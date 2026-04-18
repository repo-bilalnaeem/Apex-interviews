import 'server-only';

import { z } from 'zod';
import { tool } from '@langchain/core/tools';
import { ChatOpenAI } from '@langchain/openai';
import {
  HumanMessage,
  AIMessage,
  SystemMessage,
  ToolMessage,
} from '@langchain/core/messages';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { meetings } from '@/db/schema';
import { getTranscriptChunks } from '@/lib/chatbot/vectorStore';
import type { StreamTranscriptItem } from '@/modules/meetings/types';
import type { SpecialistAgent, AgentContext } from './types';

const transcriptTool = tool(
  async ({ meetingId }: { meetingId: string }) => {
    // Try in-memory store first (populated by Inngest after meeting processing)
    const chunks = getTranscriptChunks(meetingId);
    if (chunks && chunks.length > 0) {
      return chunks.map((c) => (c.speaker ? `${c.speaker}: ${c.text}` : c.text)).join('\n');
    }

    // Fall back to fetching directly from the transcript URL stored in DB
    // (in-memory store is lost on server restart)
    try {
      const [meeting] = await db
        .select({ transcriptUrl: meetings.transcriptUrl })
        .from(meetings)
        .where(eq(meetings.id, meetingId))
        .limit(1);

      if (!meeting?.transcriptUrl) return 'No transcript available for this meeting.';

      const res = await fetch(meeting.transcriptUrl);
      if (!res.ok) return 'No transcript available for this meeting.';

      const text = await res.text();
      const lines = text.trim().split('\n').filter(Boolean);
      const items = lines.map((l) => JSON.parse(l) as StreamTranscriptItem);
      if (items.length === 0) return 'No transcript available for this meeting.';

      return items.map((item) => item.text).join('\n');
    } catch {
      return 'No transcript available for this meeting.';
    }
  },
  {
    name: 'fetch_transcript',
    description:
      'Fetch the full transcript for a specific meeting by ID. Use this when the user asks about specific things that were said in an interview.',
    schema: z.object({
      meetingId: z.string().describe('The meeting ID to fetch transcript for'),
    }),
  }
);

const systemPrompt =
  'You are a transcript analysis specialist for AI-powered interview coaching. Your job is to retrieve and analyze interview transcripts, identify specific quotes and moments, and provide objective evidence-based feedback on what was said. Always use the fetch_transcript tool when asked about specific interview content.';

export const transcriptAnalysisAgent: SpecialistAgent = {
  name: 'transcript_analysis',
  displayName: 'Transcript Analyst',
  description:
    'Analyzes interview transcripts, recalls specific quotes, identifies key moments, and assesses performance based on what was said',

  async stream(
    ctx: AgentContext,
    onToolCall: (toolName: string) => void,
    onToken: (token: string) => void
  ): Promise<void> {
    const model = new ChatOpenAI({
      model: 'gpt-4o-mini',
      apiKey: process.env.OPENAI_API_KEY,
      streaming: true,
    }).bindTools([transcriptTool]);

    const systemContent = [
      systemPrompt,
      ctx.context ? `Relevant knowledge:\n${ctx.context}` : '',
      ctx.resume ? `User resume:\n${ctx.resume}` : '',
      ctx.meetingId ? `Current meeting ID: ${ctx.meetingId}` : '',
    ]
      .filter(Boolean)
      .join('\n\n');

    const messages = [
      new SystemMessage(systemContent),
      ...ctx.history.map((m) =>
        m.role === 'user' ? new HumanMessage(m.content) : new AIMessage(m.content)
      ),
      new HumanMessage(ctx.message),
    ];

    // First pass: stream to detect tool calls
    const firstStream = await model.stream(messages);

    let content = '';
    const toolCallMap: Record<number, { id: string; name: string; args: string }> = {};

    for await (const chunk of firstStream) {
      if (typeof chunk.content === 'string' && chunk.content) {
        content += chunk.content;
      }

      const tcc = chunk.tool_call_chunks as
        | Array<{ id?: string; name?: string; args?: string; index?: number }>
        | undefined;
      if (tcc) {
        for (const tc of tcc) {
          const idx = tc.index ?? 0;
          if (!toolCallMap[idx]) {
            toolCallMap[idx] = { id: tc.id ?? '', name: tc.name ?? '', args: '' };
          }
          if (tc.id) toolCallMap[idx].id = tc.id;
          if (tc.name) toolCallMap[idx].name = tc.name;
          if (tc.args) toolCallMap[idx].args += tc.args;
        }
      }
    }

    const toolCalls = Object.values(toolCallMap);

    if (toolCalls.length > 0) {
      // Signal tool call to client
      onToolCall(toolCalls[0].name);

      // Build AI message with tool calls for history
      const aiMsg = new AIMessage({
        content,
        tool_calls: toolCalls.map((tc) => ({
          id: tc.id,
          name: tc.name,
          args: JSON.parse(tc.args || '{}'),
          type: 'tool_call' as const,
        })),
      });

      // Execute tool and collect result
      let toolResult = '';
      try {
        const parsedArgs = JSON.parse(toolCalls[0].args || '{}') as { meetingId: string };
        const rawResult = await transcriptTool.invoke(parsedArgs);
        toolResult = typeof rawResult === 'string' ? rawResult : String(rawResult);
      } catch (err) {
        console.error('[transcript-analysis-agent] Tool execution failed:', err);
        toolResult = 'Tool failed to retrieve transcript. Continuing with available context.';
      }

      const toolMsg = new ToolMessage({
        tool_call_id: toolCalls[0].id,
        content: String(toolResult),
      });

      // Second pass: stream final answer with tool result in context
      const updatedMessages = [...messages, aiMsg, toolMsg];
      const finalStream = await model.stream(updatedMessages);
      for await (const chunk of finalStream) {
        const token = typeof chunk.content === 'string' ? chunk.content : '';
        if (token) onToken(token);
      }
    } else {
      // No tool call — emit accumulated content
      if (content) {
        onToken(content);
      }
    }
  },
};
