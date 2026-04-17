import { NextRequest, NextResponse } from 'next/server';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    let extractedText = '';

    // Extract text based on file type
    if (file.type === 'application/pdf') {
      const data = await pdf(buffer);
      extractedText = data.text;
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    } else {
      return NextResponse.json({ error: 'Unsupported file type. Please upload PDF or DOCX files.' }, { status: 400 });
    }

    return NextResponse.json({ extractedText });
  } catch (error) {
    console.error('File extraction error:', error);
    return NextResponse.json({ error: 'Failed to extract text from file' }, { status: 500 });
  }
}