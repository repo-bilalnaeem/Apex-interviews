import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function streamChatResponse(
  message: string,
  context: string,
  resume: string,
  history: ChatMessage[],
  onToken: (token: string) => void
): Promise<void> {
  const model = new ChatOpenAI({
    model: 'gpt-4o-mini',
    apiKey: process.env.OPENAI_API_KEY,
    streaming: true,
  });

  const systemContent = [
    'You are an AI interview coach. Help the user prepare for job interviews, improve their CV, and develop their career. Be concise, practical, and encouraging.',
    context ? `Relevant knowledge:\n${context}` : '',
    resume ? `User resume:\n${resume}` : '',
  ].filter(Boolean).join('\n\n');

  // Build message array: system prompt + full conversation history + new message
  // This IS the memory — LangChain reconstructs context from the history array each request
  const messages = [
    new SystemMessage(systemContent),
    ...history.map((m) =>
      m.role === 'user' ? new HumanMessage(m.content) : new AIMessage(m.content)
    ),
    new HumanMessage(message),
  ];

  const stream = await model.stream(messages);
  for await (const chunk of stream) {
    const token = typeof chunk.content === 'string' ? chunk.content : '';
    if (token) onToken(token);
  }
}
