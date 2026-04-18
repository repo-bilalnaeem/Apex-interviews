# GPT-4o Vision CV Fallback — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** When `pdf-parse` fails to extract meaningful text from an uploaded CV (scanned/image PDF returns <100 chars), fall back to rendering the first PDF page as an image and extracting text via GPT-4o vision.

**Architecture:** A new utility `src/lib/pdf-vision.ts` handles PDF-to-PNG rendering (via `pdfjs-dist` + `canvas`) and the GPT-4o vision API call. The existing `/api/parseResume` route wraps the current `pdf-parse` call in a try/catch and calls the vision utility on failure. `next.config.ts` is updated to mark `canvas` and `pdfjs-dist` as server external packages so their native binaries are not bundled.

**Tech Stack:** `pdfjs-dist` (pure JS PDF renderer), `canvas` (Node.js canvas bindings), OpenAI SDK v5 (`chat.completions.create` with image_url content), Next.js 15

---

## File Map

| File | Change |
|------|--------|
| `next.config.ts` | Add `canvas` and `pdfjs-dist` to `serverExternalPackages` |
| `src/lib/pdf-vision.ts` | New — `pdfToImageBase64()` + `extractTextWithVision()` |
| `src/app/api/parseResume/route.ts` | Add vision fallback when pdf-parse returns <100 chars |

---

### Task 1: Install dependencies and update Next.js config

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Install packages**

```bash
npm install pdfjs-dist canvas
```

Expected: both packages appear in `package.json` dependencies.

- [ ] **Step 2: Update serverExternalPackages in next.config.ts**

Find `serverExternalPackages` in `next.config.ts` and extend it:

```ts
serverExternalPackages: ['pdf-parse', 'canvas', 'pdfjs-dist'],
```

- [ ] **Step 3: Commit**

```bash
git add next.config.ts package.json package-lock.json
git commit -m "feat: add pdfjs-dist and canvas for PDF page rendering"
```

---

### Task 2: Create pdf-vision utility

**Files:**
- Create: `src/lib/pdf-vision.ts`

- [ ] **Step 1: Create the file**

```ts
import 'server-only';
import OpenAI from 'openai';

export async function pdfToImageBase64(pdfBuffer: Buffer): Promise<string> {
  // pdfjs-dist legacy build works in Node.js without a DOM
  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs' as string);
  const { createCanvas } = await import('canvas');

  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(pdfBuffer) });
  const pdfDoc = await loadingTask.promise;
  const page = await pdfDoc.getPage(1);

  const scale = 2.0; // 2x for better OCR accuracy
  const viewport = page.getViewport({ scale });

  const canvas = createCanvas(viewport.width, viewport.height);
  const context = canvas.getContext('2d');

  await page.render({
    canvasContext: context as unknown as CanvasRenderingContext2D,
    viewport,
  }).promise;

  // Return base64 PNG without the data URL prefix
  return canvas.toDataURL('image/png').replace('data:image/png;base64,', '');
}

export async function extractTextWithVision(pdfBuffer: Buffer): Promise<string | null> {
  const apiKey = process.env.OPENAI_SECRET_KEY;
  if (!apiKey) return null;

  let base64Image: string;
  try {
    base64Image = await pdfToImageBase64(pdfBuffer);
  } catch {
    return null;
  }

  const client = new OpenAI({ apiKey });

  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'You are a CV text extractor. Extract all text from this resume image exactly as it appears, preserving section headings and bullet points. Return only the extracted text, no commentary.',
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/png;base64,${base64Image}`,
              detail: 'high',
            },
          },
        ],
      },
    ],
    max_tokens: 4096,
  });

  const text = response.choices[0]?.message?.content ?? '';
  return text.trim().length > 20 ? text.trim() : null;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/pdf-vision.ts
git commit -m "feat: add pdf-vision utility for GPT-4o image-based text extraction"
```

---

### Task 3: Add vision fallback to parseResume route

**Files:**
- Modify: `src/app/api/parseResume/route.ts`

- [ ] **Step 1: Add import**

At the top of `src/app/api/parseResume/route.ts`, add:

```ts
import { extractTextWithVision } from '@/lib/pdf-vision';
```

- [ ] **Step 2: Replace the route handler with the fallback-aware version**

Replace the entire contents of `src/app/api/parseResume/route.ts` with:

```ts
import { NextRequest, NextResponse } from 'next/server';
import { Buffer } from 'buffer';
import { extractTextWithVision } from '@/lib/pdf-vision';

export async function POST(req: NextRequest) {
  try {
    const { pdfBase64 } = await req.json();

    if (!pdfBase64) {
      return NextResponse.json({ error: 'No PDF provided.' }, { status: 400 });
    }

    const base64 = pdfBase64.replace(/^data:application\/pdf;base64,/, '');
    const pdfBuffer = Buffer.from(base64, 'base64');

    if (!pdfBuffer || pdfBuffer.length < 100) {
      return NextResponse.json(
        { error: 'PDF data is empty or too small. Please upload a valid PDF.' },
        { status: 400 }
      );
    }

    // Attempt 1: pdf-parse (fast, free, works for text-based PDFs)
    let extractedText = '';
    try {
      const pdfParse = (await import('pdf-parse')).default;
      const data = await pdfParse(pdfBuffer);
      extractedText = data?.text ?? '';
    } catch {
      // pdf-parse failed — fall through to vision
    }

    // Attempt 2: GPT-4o vision (for scanned/image PDFs)
    if (extractedText.trim().length < 100) {
      const visionText = await extractTextWithVision(pdfBuffer);
      if (visionText) {
        return NextResponse.json({ text: visionText, source: 'vision' });
      }
      return NextResponse.json(
        {
          error:
            'Could not extract text from this CV. Try copying and pasting the text directly.',
        },
        { status: 422 }
      );
    }

    return NextResponse.json({ text: extractedText, source: 'pdf-parse' });
  } catch (err: unknown) {
    const errorMsg =
      err instanceof Error ? err.message : String(err);
    console.error('PDF parsing error:', err);
    return NextResponse.json(
      { error: 'Failed to parse PDF: ' + errorMsg },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/parseResume/route.ts
git commit -m "feat: add GPT-4o vision fallback for scanned CV PDF parsing"
```
