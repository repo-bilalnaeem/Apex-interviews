import { getRelevantDocs } from '@/lib/chatbot/retrieve';
import { streamChatResponse, ChatMessage } from '@/lib/chatbot/openai';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { message, resume, history = [] } = await req.json();
    const context = await getRelevantDocs(message);
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          await streamChatResponse(
            message,
            context,
            resume || '',
            history as ChatMessage[],
            (token) => {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ answer: token })}\n\n`)
              );
            }
          );
          controller.close();
        } catch (error: unknown) {
          const msg = error instanceof Error ? error.message : 'Failed to get response';
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
