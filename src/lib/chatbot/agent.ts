import 'server-only';

import { z } from 'zod';
import { tool } from '@langchain/core/tools';
import { ChatOpenAI } from '@langchain/openai';
import {
  HumanMessage,
  AIMessage,
  SystemMessage,
  ToolMessage,
} from '@langchain/core/messages';
import { getTranscriptChunks } from './vectorStore';
import type { ChatMessage } from './openai';

const transcriptTool = tool(
  async ({ meetingId }: { meetingId: string }) => {
    const chunks = getTranscriptChunks(meetingId);
    if (!chunks || chunks.length === 0) return 'No transcript available for this meeting.';
    return chunks.map((c) => (c.speaker ? `${c.speaker}: ${c.text}` : c.text)).join('\n');
  },
  {
    name: 'fetch_transcript',
    description:
      'Fetch the full transcript for a specific meeting by ID. Use this when the user asks about specific things that were said in an interview.',
    schema: z.object({
      meetingId: z.string().describe('The meeting ID to fetch transcript for'),
    }),
  }
);

export async function streamAgentResponse(
  message: string,
  context: string,
  resume: string,
  history: ChatMessage[],
  meetingId: string | undefined,
  onToolCall: (toolName: string) => void,
  onToken: (token: string) => void
): Promise<void> {
  const model = new ChatOpenAI({
    model: 'gpt-4o-mini',
    apiKey: process.env.OPENAI_API_KEY,
    streaming: true,
  }).bindTools([transcriptTool]);

  const systemContent = [
    'You are an AI interview coach. Help the user prepare for job interviews, improve their CV, and develop their career. Be concise, practical, and encouraging.',
    context ? `Relevant knowledge:\n${context}` : '',
    resume ? `User resume:\n${resume}` : '',
    meetingId ? `Current meeting ID: ${meetingId}` : '',
  ]
    .filter(Boolean)
    .join('\n\n');

  const messages = [
    new SystemMessage(systemContent),
    ...history.map((m) =>
      m.role === 'user' ? new HumanMessage(m.content) : new AIMessage(m.content)
    ),
    new HumanMessage(message),
  ];

  // First pass: stream to detect tool calls
  const firstStream = await model.stream(messages);

  // Accumulate the full first response
  type ToolCallChunk = { id?: string; name?: string; args?: string; index?: number };
  let content = '';
  const toolCallMap: Record<number, { id: string; name: string; args: string }> = {};

  for await (const chunk of firstStream) {
    // Accumulate text content
    if (typeof chunk.content === 'string' && chunk.content) {
      content += chunk.content;
    }

    // Accumulate tool call chunks
    const rawChunks = chunk.additional_kwargs?.tool_calls as ToolCallChunk[] | undefined;
    if (rawChunks) {
      for (const tc of rawChunks) {
        const idx = tc.index ?? 0;
        if (!toolCallMap[idx]) {
          toolCallMap[idx] = { id: tc.id ?? '', name: tc.name ?? '', args: '' };
        }
        if (tc.id) toolCallMap[idx].id = tc.id;
        if (tc.name) toolCallMap[idx].name = tc.name;
        if (tc.args) toolCallMap[idx].args += tc.args;
      }
    }
  }

  const toolCalls = Object.values(toolCallMap);

  if (toolCalls.length > 0) {
    // Signal tool call to client
    onToolCall(toolCalls[0].name);

    // Build AI message with tool calls for history
    const aiMsg = new AIMessage({
      content,
      tool_calls: toolCalls.map((tc) => ({
        id: tc.id,
        name: tc.name,
        args: JSON.parse(tc.args || '{}'),
        type: 'tool_call' as const,
      })),
    });

    // Execute tool and collect result
    let toolResult = '';
    try {
      const parsedArgs = JSON.parse(toolCalls[0].args || '{}') as { meetingId: string };
      const rawResult = await transcriptTool.invoke(parsedArgs);
      toolResult = typeof rawResult === 'string' ? rawResult : String(rawResult);
    } catch (err) {
      console.error('[agent] Tool execution failed:', err);
      toolResult = 'Tool failed to retrieve transcript. Continuing with available context.';
    }

    const toolMsg = new ToolMessage({
      tool_call_id: toolCalls[0].id,
      content: String(toolResult),
    });

    // Second pass: stream final answer with tool result in context
    const updatedMessages = [...messages, aiMsg, toolMsg];
    const finalStream = await model.stream(updatedMessages);
    for await (const chunk of finalStream) {
      const token = typeof chunk.content === 'string' ? chunk.content : '';
      if (token) onToken(token);
    }
  } else {
    // No tool call — emit accumulated content if any, then re-stream for token delivery
    // Re-stream so tokens are delivered incrementally (we consumed the stream above)
    if (content) {
      onToken(content);
    }
  }
}
