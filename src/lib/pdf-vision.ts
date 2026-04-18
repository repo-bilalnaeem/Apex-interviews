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
  if (!apiKey) {
    console.error('OPENAI_SECRET_KEY not configured for PDF vision extraction');
    return null;
  }

  let base64Image: string;
  try {
    base64Image = await pdfToImageBase64(pdfBuffer);
  } catch (err) {
    console.error('PDF to image rendering failed:', err instanceof Error ? err.message : String(err));
    return null;
  }

  const client = new OpenAI({ apiKey });

  let response;
  try {
    response = await client.chat.completions.create({
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
  } catch (err) {
    console.error('GPT-4o vision API call failed:', err instanceof Error ? err.message : String(err));
    return null;
  }

  const text = response.choices[0]?.message?.content ?? '';
  return text.trim().length > 20 ? text.trim() : null;
}
