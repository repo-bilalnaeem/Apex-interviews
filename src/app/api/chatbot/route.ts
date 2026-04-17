import { getRelevantDocs } from '@/lib/chatbot/retrieve';
import { streamGeminiResponse } from '@/lib/chatbot/gemini';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const { message, resume } = await req.json();
    const context = getRelevantDocs(message);
    const prompt = `Context:\n${context}\n\nUser Resume:\n${resume || ''}\n\nUser question: ${message}\n\nAnswer:`;

    // Set up SSE headers
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        streamGeminiResponse(prompt, (chunk) => {
          // Send each chunk as it's generated
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ answer: chunk })}\n\n`));
        }).then(() => {
          controller.close();
        }).catch((error) => {
          // Send the actual error message for debugging
          const errorMsg = error?.message || error?.toString() || 'Failed to get response from Gemini.';
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: errorMsg })}\n\n`));
          controller.close();
        });
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
