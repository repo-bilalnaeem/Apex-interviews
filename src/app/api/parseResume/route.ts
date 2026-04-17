import { NextRequest, NextResponse } from 'next/server';
import { Buffer } from 'buffer';

export async function POST(req: NextRequest) {
  try {
    const { pdfBase64 } = await req.json();
    
    if (!pdfBase64) {
      return NextResponse.json({ error: 'No PDF provided.' }, { status: 400 });
    }

    // Remove data URL prefix if present
    const base64 = pdfBase64.replace(/^data:application\/pdf;base64,/, '');
    const pdfBuffer = Buffer.from(base64, 'base64');

    // Debug: log buffer info
    console.log('PDF buffer length:', pdfBuffer.length);
    if (!pdfBuffer || pdfBuffer.length < 100) {
      // Most PDFs are at least a few KB
      return NextResponse.json({ error: 'PDF data is empty or too small. Please upload a valid PDF.' }, { status: 400 });
    }

    // Dynamically import pdf-parse
    const pdfParse = (await import('pdf-parse')).default;
    let data;
    try {
      data = await pdfParse(pdfBuffer);
    } catch (err: unknown) {
      // Return the actual error for debugging
      let errorMsg = '';
      if (typeof err === 'object' && err !== null && 'message' in err) {
        errorMsg = (err as { message: string }).message;
      } else {
        errorMsg = String(err);
      }
      return NextResponse.json({ error: 'PDF parsing failed: ' + errorMsg }, { status: 500 });
    }

    if (!data?.text) {
      return NextResponse.json({ error: 'No text extracted from PDF.' }, { status: 422 });
    }
    return NextResponse.json({ text: data.text });
  } catch (err: unknown) {
    // Log and return the actual error for debugging
    let errorMsg = '';
    if (typeof err === 'object' && err !== null && 'message' in err) {
      errorMsg = (err as { message: string }).message;
    } else {
      errorMsg = String(err);
    }
    console.error('PDF parsing error:', err);
    return NextResponse.json({ error: 'Failed to parse PDF: ' + errorMsg }, { status: 500 });
  }
}
