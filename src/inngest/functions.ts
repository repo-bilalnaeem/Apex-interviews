/* eslint-disable */

import JSONL from "jsonl-parse-stringify";

import { inngest } from "@/inngest/client";
import { db } from "@/db";
import { eq, inArray, and } from "drizzle-orm";
import { agents, meetings, user } from "@/db/schema";
import { embedBatch } from "@/lib/chatbot/embeddings";
import { storeTranscriptChunks, EmbeddedChunk } from "@/lib/chatbot/vectorStore";
import { analyzeRecordingWithWhisper, SpeechAnalysis } from "@/lib/speech-analysis";

import { StreamTranscriptItem } from "@/modules/meetings/types";
import { createAgent, openai, TextMessage } from "@inngest/agent-kit";

const summarizer = createAgent({
  name: "summarizer",
  system:
    `You are an expert summarizer. You write readable, concise, simple content. You are given a transcript of a meeting and you need to summarize it.

Use the following markdown structure for every output:

### Overview
Provide a detailed, engaging summary of the session's content. Focus on major features, user workflows, and any key takeaways. Write in a narrative style, using full sentences. Highlight unique or powerful aspects of the product, platform, or discussion.

### Notes
Break down key content into thematic sections with timestamp ranges. Each section should summarize key points, actions, or demos in bullet format.

Example:
#### Section Name
- Main point or demo shown here
- Another key insight or interaction
- Follow-up tool or explanation provided

#### Next Section
- Feature X automatically does Y
- Mention of integration with Z`.trim(),
  model: openai({
    model: "gpt-4o-mini",
    apiKey: process.env.OPENAI_SECRET_KEY,
  }),
});

export const meetingsProcessing = inngest.createFunction(
  { id: "meetings/processing" },
  { event: "meetings/processing" },
  async ({ event, step }) => {
    const response = await step.fetch(event.data.transcriptUrl);

    const transcript = await step.run("parse-transcript", async () => {
      const text = await response.text();
      return JSONL.parse<StreamTranscriptItem>(text);
    });

    const transcriptWithSpeakers = await step.run("add-speakers", async () => {
      const speakerIds = [
        ...new Set(transcript.map((item) => item.speaker_id)),
      ];

      const userSpeakers = await db
        .select()
        .from(user)
        .where(inArray(user.id, speakerIds))
        .then((users) =>
          users.map((user) => ({
            ...user,
          }))
        );

      const agentSpeakers = await db
        .select()
        .from(agents)
        .where(inArray(agents.id, speakerIds))
        .then((agents) =>
          agents.map((agent) => ({
            ...agent,
          }))
        );

      const speakers = [...userSpeakers, ...agentSpeakers];
      return transcript.map((item) => {
        const speaker = speakers.find(
          (speaker) => speaker.id === item.speaker_id
        );
        if (!speaker) {
          return {
            ...item,
            user: {
              name: "unknown",
            },
          };
        }

        return {
          ...item,
          user: {
            name: speaker.name,
          },
        };
      });
    });

    const { output } = await summarizer.run(
      "Summarize the following transcript: " +
        JSON.stringify(transcriptWithSpeakers)
    );

    await step.run("save-summary", async () => {
      await db
        .update(meetings)
        .set({
          summary: (output[0] as TextMessage).content as string,
          status: "completed",
        })
        .where(eq(meetings.id, event.data.meetingId));
    });

    await step.run("embed-transcript", async () => {
      if (!transcriptWithSpeakers || transcriptWithSpeakers.length === 0) return;

      // Determine which speaker names belong to agents
      const speakerIds = [...new Set(transcript.map((item) => item.speaker_id))];
      const agentSpeakers = await db
        .select()
        .from(agents)
        .where(inArray(agents.id, speakerIds));
      const agentNames = new Set(agentSpeakers.map((a) => a.name));

      // Chunk transcript by speaker turn; split long turns at 800-char word boundaries
      const chunkTexts: string[] = [];
      const chunkSpeakers: string[] = [];

      for (const item of transcriptWithSpeakers) {
        const speakerLabel = agentNames.has(item.user.name) ? "Agent" : "User";
        const rawText = item.text ?? "";
        const segments: string[] = rawText.match(/[\s\S]{1,800}(\s|$)/g) ?? [rawText];
        for (const segment of segments) {
          const trimmed = segment.trim();
          if (!trimmed) continue;
          chunkTexts.push(`${speakerLabel}: ${trimmed}`);
          chunkSpeakers.push(speakerLabel);
        }
      }

      if (chunkTexts.length === 0) return;

      const vectors = await embedBatch(chunkTexts);

      const embeddedChunks: EmbeddedChunk[] = chunkTexts.map((text, i) => ({
        text,
        embedding: vectors[i],
        meetingId: event.data.meetingId,
        speaker: chunkSpeakers[i],
      }));

      storeTranscriptChunks(event.data.meetingId, embeddedChunks);
    });

    const speechAnalysis = await step.run("whisper-enrichment", async () => {
      const [meeting] = await db
        .select({ recordingUrl: meetings.recordingUrl })
        .from(meetings)
        .where(eq(meetings.id, event.data.meetingId));

      if (!meeting?.recordingUrl) return null;

      try {
        return await analyzeRecordingWithWhisper(meeting.recordingUrl);
      } catch (err) {
        console.error("Whisper enrichment failed:", err);
        return null;
      }
    });

    if (speechAnalysis) {
      await step.run("save-speech-analysis", async () => {
        await db
          .update(meetings)
          .set({ speechAnalysis: JSON.stringify(speechAnalysis) })
          .where(eq(meetings.id, event.data.meetingId));
      });
    }

  }
);

