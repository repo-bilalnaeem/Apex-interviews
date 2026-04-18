import { getRelevantDocs } from '@/lib/chatbot/retrieve';
import { streamAgentResponse } from '@/lib/chatbot/agent';
import { ChatMessage } from '@/lib/chatbot/openai';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { message, resume, history = [], meetingId } = await req.json();
    const context = await getRelevantDocs(message, meetingId as string | undefined);
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          await streamAgentResponse(
            message,
            context,
            resume || '',
            history as ChatMessage[],
            meetingId as string | undefined,
            (agentName) => {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ agentName })}\n\n`)
              );
            },
            (toolName) => {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ toolCall: toolName })}\n\n`)
              );
            },
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
