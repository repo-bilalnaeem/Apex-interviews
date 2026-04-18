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
