# Whisper Speech Enrichment — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** After each completed interview, analyze the recording with OpenAI Whisper to count filler words and measure speaking pace, then display results in the meeting detail UI.

**Architecture:** Two new Inngest steps appended to the existing `meetingsProcessing` pipeline — `whisper-enrichment` downloads the recording, calls Whisper with word-level timestamps, computes metrics, and `save-speech-analysis` writes the JSON result to a new `speech_analysis` DB column. The tRPC `getOne` procedure parses and returns the JSON so the `CompletedState` component can render a Speech Analysis card.

**Tech Stack:** OpenAI SDK v5 (`audio.transcriptions.create`, `toFile`), Inngest, Drizzle ORM, Next.js App Router, Tailwind CSS

---

## File Map

| File | Change |
|------|--------|
| `src/db/schema.ts` | Add `speechAnalysis` nullable text column to meetings table |
| `src/lib/speech-analysis.ts` | New — `SpeechAnalysis` type + `computeSpeechMetrics()` + `analyzeRecordingWithWhisper()` |
| `src/inngest/functions.ts` | Add `whisper-enrichment` and `save-speech-analysis` steps |
| `src/modules/meetings/server/procedures.ts` | Parse `speechAnalysis` JSON in `getOne` return value |
| `src/modules/meetings/ui/components/completed-state.tsx` | Add Speech Analysis card to summary tab |

---

### Task 1: Add speechAnalysis column to DB schema

**Files:**
- Modify: `src/db/schema.ts`

- [ ] **Step 1: Add the column**

In `src/db/schema.ts`, find the `meetings` table definition and add `speechAnalysis` after `summary`:

```ts
export const meetings = pgTable("meetings", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  agentId: text("agent_id")
    .notNull()
    .references(() => agents.id, { onDelete: "cascade" }),
  status: meetingStatus("status").notNull().default("upcoming"),
  transcriptUrl: text("transcript_url"),
  recordingUrl: text("recording_url"),
  summary: text("summary"),
  speechAnalysis: text("speech_analysis"),   // <-- add this line
  startedAt: timestamp("started_at"),
  endedAt: timestamp("ended_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
```

- [ ] **Step 2: Push schema to database**

```bash
npm run db:push
```

Expected: Drizzle prints "speech_analysis column added" (or similar) and exits 0.

- [ ] **Step 3: Commit**

```bash
git add src/db/schema.ts
git commit -m "feat: add speech_analysis column to meetings table"
```

---

### Task 2: Create speech-analysis utility

**Files:**
- Create: `src/lib/speech-analysis.ts`

- [ ] **Step 1: Create the file**

```ts
import 'server-only';
import OpenAI, { toFile } from 'openai';

export interface SpeechAnalysis {
  fillerWords: {
    total: number;
    breakdown: Record<string, number>;
  };
  wpm: number;
  wpmLabel: 'too slow' | 'good' | 'too fast';
  analyzedAt: string;
}

const FILLER_WORDS = new Set(['um', 'uh', 'like', 'basically', 'literally']);

export function computeSpeechMetrics(
  words: Array<{ word: string; start: number; end: number }>
): SpeechAnalysis {
  if (words.length === 0) {
    return {
      fillerWords: { total: 0, breakdown: {} },
      wpm: 0,
      wpmLabel: 'good',
      analyzedAt: new Date().toISOString(),
    };
  }

  const breakdown: Record<string, number> = {};
  for (const { word } of words) {
    const normalized = word.toLowerCase().replace(/[^a-z]/g, '');
    if (FILLER_WORDS.has(normalized)) {
      breakdown[normalized] = (breakdown[normalized] ?? 0) + 1;
    }
  }
  const total = Object.values(breakdown).reduce((a, b) => a + b, 0);

  const durationMinutes = (words[words.length - 1].end - words[0].start) / 60;
  const wpm = durationMinutes > 0 ? Math.round(words.length / durationMinutes) : 0;
  const wpmLabel: SpeechAnalysis['wpmLabel'] =
    wpm < 120 ? 'too slow' : wpm > 180 ? 'too fast' : 'good';

  return {
    fillerWords: { total, breakdown },
    wpm,
    wpmLabel,
    analyzedAt: new Date().toISOString(),
  };
}

export async function analyzeRecordingWithWhisper(
  recordingUrl: string
): Promise<SpeechAnalysis | null> {
  const apiKey = process.env.OPENAI_SECRET_KEY;
  if (!apiKey) return null;

  const res = await fetch(recordingUrl);
  if (!res.ok) return null;

  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const client = new OpenAI({ apiKey });
  const file = await toFile(buffer, 'recording.webm', { type: 'audio/webm' });

  const transcription = await client.audio.transcriptions.create({
    file,
    model: 'whisper-1',
    response_format: 'verbose_json',
    timestamp_granularities: ['word'],
  });

  const words: Array<{ word: string; start: number; end: number }> =
    (transcription as unknown as { words?: Array<{ word: string; start: number; end: number }> })
      .words ?? [];

  return computeSpeechMetrics(words);
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/speech-analysis.ts
git commit -m "feat: add speech analysis utility with Whisper integration"
```

---

### Task 3: Add Whisper steps to Inngest pipeline

**Files:**
- Modify: `src/inngest/functions.ts`

- [ ] **Step 1: Add import**

At the top of `src/inngest/functions.ts`, add:

```ts
import { analyzeRecordingWithWhisper, SpeechAnalysis } from "@/lib/speech-analysis";
```

- [ ] **Step 2: Add two new steps after the embed-transcript step**

After the closing `});` of the `embed-transcript` step (currently the last step), add:

```ts
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
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/inngest/functions.ts
git commit -m "feat: add whisper-enrichment and save-speech-analysis Inngest steps"
```

---

### Task 4: Parse speechAnalysis in tRPC getOne

**Files:**
- Modify: `src/modules/meetings/server/procedures.ts`

- [ ] **Step 1: Add import**

At the top of `src/modules/meetings/server/procedures.ts`, add:

```ts
import type { SpeechAnalysis } from "@/lib/speech-analysis";
```

- [ ] **Step 2: Update getOne return value**

Find the `getOne` query return (currently `return { ...existingMeeting, duration };`) and replace with:

```ts
      return {
        ...existingMeeting,
        duration,
        speechAnalysis: existingMeeting.speechAnalysis
          ? (JSON.parse(existingMeeting.speechAnalysis) as SpeechAnalysis)
          : null,
      };
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: 0 errors. `MeetingGetOne` type now has `speechAnalysis: SpeechAnalysis | null`.

- [ ] **Step 4: Commit**

```bash
git add src/modules/meetings/server/procedures.ts
git commit -m "feat: parse speechAnalysis JSON in getOne tRPC procedure"
```

---

### Task 5: Add Speech Analysis card to completed meeting UI

**Files:**
- Modify: `src/modules/meetings/ui/components/completed-state.tsx`

- [ ] **Step 1: Add the Speech Analysis card below the markdown prose in the summary TabsContent**

Find the closing `</div>` of the markdown prose section (after `</Markdown>`) and before the closing `</div>` of the summary card. Insert the following block:

```tsx
              {/* Speech Analysis */}
              {data.speechAnalysis && (
                <div className="mt-4 rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] p-4">
                  <h3 className="mb-3 font-[family-name:var(--font-display)] text-sm font-semibold text-white">
                    Speech Analysis
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {/* WPM */}
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-[#6B6B6B]">Speaking Pace</span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-white">
                          {data.speechAnalysis.wpm} <span className="text-xs font-normal text-[#6B6B6B]">wpm</span>
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            data.speechAnalysis.wpmLabel === 'good'
                              ? 'bg-[#CAFF02]/10 text-[#CAFF02]'
                              : data.speechAnalysis.wpmLabel === 'too fast'
                              ? 'bg-red-500/10 text-red-400'
                              : 'bg-yellow-500/10 text-yellow-400'
                          }`}
                        >
                          {data.speechAnalysis.wpmLabel}
                        </span>
                      </div>
                      <span className="text-xs text-[#6B6B6B]">
                        {data.speechAnalysis.wpmLabel === 'too fast'
                          ? 'Try slowing down — aim for 120–180 wpm'
                          : data.speechAnalysis.wpmLabel === 'too slow'
                          ? 'Try speaking a bit faster — aim for 120–180 wpm'
                          : 'Good pace for an interview'}
                      </span>
                    </div>

                    {/* Filler words */}
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-[#6B6B6B]">Filler Words</span>
                      <span className="text-lg font-bold text-white">
                        {data.speechAnalysis.fillerWords.total}
                        <span className="ml-1 text-xs font-normal text-[#6B6B6B]">detected</span>
                      </span>
                      {data.speechAnalysis.fillerWords.total > 0 && (
                        <span className="text-xs text-[#6B6B6B]">
                          {Object.entries(data.speechAnalysis.fillerWords.breakdown)
                            .map(([word, count]) => `"${word}" ×${count}`)
                            .join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/modules/meetings/ui/components/completed-state.tsx
git commit -m "feat: add Speech Analysis card to completed meeting summary tab"
```
