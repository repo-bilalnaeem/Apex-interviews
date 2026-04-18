# Multimodal AI — Whisper Enrichment + GPT-4o Vision CV Fallback

**Date:** 2026-04-18
**Status:** Approved

---

## Overview

Two independent multimodal AI features added to Apex Interviews:

1. **Whisper Speech Enrichment** — analyze the interview recording post-call for filler words and speaking pace, store results in the DB, display in the meeting detail UI
2. **GPT-4o Vision CV Fallback** — when `pdf-parse` fails to extract meaningful text from an uploaded CV (scanned/image PDF), fall back to GPT-4o vision to extract text from a rendered page image

Both features use the existing `OPENAI_SECRET_KEY` environment variable. No new vendors or API keys required.

---

## Feature 1: Whisper Speech Enrichment

### Pipeline

Runs as two new steps in the existing Inngest `meetings/processing` function, appended after `embed-transcript`:

```
parse-transcript → add-speakers → summarizer.run() → embed-transcript
  → whisper-enrichment (NEW)
  → save-speech-analysis (NEW)
```

### whisper-enrichment step

1. Fetch the recording URL from the `meetings` table using `event.data.meetingId`
2. Download the audio file as a buffer
3. Send to OpenAI Whisper API:
   - Model: `whisper-1`
   - Response format: `verbose_json` (returns word-level timestamps)
4. Filter to user-only words (exclude agent speaker turns identified by `agentNames` set)
5. Derive metrics:
   - **Filler words** — scan words against `["um", "uh", "like", "you know", "basically", "literally"]`, count total and per-word breakdown
   - **WPM** — `(total user word count) / (total user speaking duration in minutes)`
   - **WPM label** — `"too slow"` (<120), `"good"` (120–180), `"too fast"` (>180)

### save-speech-analysis step

Write the result to a new `speech_analysis` JSON column on the `meetings` table:

```ts
{
  fillerWords: {
    total: number,
    breakdown: Record<string, number>  // e.g. { um: 2, uh: 1, like: 1 }
  },
  wpm: number,
  wpmLabel: "too slow" | "good" | "too fast",
  analyzedAt: string  // ISO timestamp
}
```

If Whisper fails (network error, no recording URL, empty audio), the step logs the error and exits gracefully — existing transcript and summary are unaffected.

### DB change

```ts
// src/db/schema.ts — meetings table
speechAnalysis: text("speech_analysis")  // JSON string, nullable
```

Run `npm run db:push` to apply.

### UI

New **"Speech Analysis"** card in the completed meeting detail view (`src/modules/meetings/ui/views/`), shown alongside the existing AI Summary card:

- Filler word total + breakdown (e.g. "4 filler words — um ×2, uh ×1, like ×1")
- WPM value + colored badge (green = good, yellow = too slow, red = too fast)
- One-line tip based on WPM label (e.g. "Try slowing down — aim for 120–180 words per minute")
- Hidden entirely if `speechAnalysis` is null (recording not yet processed or Whisper unavailable)

---

## Feature 2: GPT-4o Vision CV Fallback

### Fallback chain

```
/api/parseResume receives base64 PDF
  → pdf-parse(buffer) → extracted text
  → text.length >= 100? → return text  (existing path, unchanged)
  → text.length < 100?
      → render PDF page 1 to PNG via pdfjs-dist
      → send PNG to GPT-4o vision
      → return extracted text
  → GPT-4o also returns empty?
      → return 400 error: "Could not extract text from this CV. Try copying and pasting the text directly."
```

### PDF rendering

Use `pdfjs-dist` (pure JS, no system dependencies, works in serverless):

1. Load PDF from buffer using `pdfjs-dist/legacy/build/pdf`
2. Get page 1
3. Render to an off-screen canvas at 2x scale (higher resolution = better OCR accuracy)
4. Export canvas as PNG buffer, encode as base64

### GPT-4o vision call

```ts
model: "gpt-4o",
messages: [{
  role: "user",
  content: [
    {
      type: "text",
      text: "You are a CV text extractor. Extract all text from this resume image exactly as it appears, preserving section headings and bullet points. Return only the extracted text, no commentary."
    },
    {
      type: "image_url",
      image_url: { url: `data:image/png;base64,${base64Image}`, detail: "high" }
    }
  ]
}]
```

### Error handling

- `pdf-parse` throws → catch, attempt vision fallback
- `pdfjs-dist` render fails → return 400 with clear message
- GPT-4o vision returns <20 chars → return 400 with clear message
- All errors surface to the user as actionable messages, not stack traces

---

## Files Changed

| File | Change |
|------|--------|
| `src/db/schema.ts` | Add `speechAnalysis` column to meetings table |
| `src/inngest/functions.ts` | Add `whisper-enrichment` and `save-speech-analysis` steps |
| `src/app/api/parseResume/route.ts` | Add GPT-4o vision fallback after pdf-parse |
| `src/modules/meetings/ui/views/completed-meeting-view.tsx` (or equivalent) | Add Speech Analysis card |

New dependency: `pdfjs-dist` (PDF page renderer, pure JS)

---

## What Is NOT in Scope

- Real-time Whisper during calls (requires streaming audio capture, out of scope)
- Body language / video frame analysis
- Whisper replacing Stream's transcript
- Vision processing for anything other than CV PDFs
- Multiple CV pages (page 1 only for vision fallback)
