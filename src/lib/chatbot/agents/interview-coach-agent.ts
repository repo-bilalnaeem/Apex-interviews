import 'server-only';

import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';
import type { SpecialistAgent, AgentContext } from './types';

const systemPrompt =
  'You are an expert interview coach specializing in behavioral and technical interviews. You help candidates structure their answers using STAR and CARL frameworks, improve delivery and clarity, handle difficult questions, and build confidence. Give specific, actionable advice.';

export const interviewCoachAgent: SpecialistAgent = {
  name: 'interview_coach',
  displayName: 'Interview Coach',
  description:
    'Provides actionable coaching on interview techniques, answer frameworks (STAR, CARL), how to improve responses, body language, and general interview strategy',

  async stream(
    ctx: AgentContext,
    _onToolCall: (toolName: string) => void,
    onToken: (token: string) => void
  ): Promise<void> {
    const model = new ChatOpenAI({
      model: 'gpt-4o-mini',
      apiKey: process.env.OPENAI_API_KEY,
      streaming: true,
    });

    const systemContent = [
      systemPrompt,
      ctx.context ? `Relevant knowledge:\n${ctx.context}` : '',
      ctx.resume ? `User resume:\n${ctx.resume}` : '',
    ]
      .filter(Boolean)
      .join('\n\n');

    const messages = [
      new SystemMessage(systemContent),
      ...ctx.history.map((m) =>
        m.role === 'user' ? new HumanMessage(m.content) : new AIMessage(m.content)
      ),
      new HumanMessage(ctx.message),
    ];

    const stream = await model.stream(messages);
    for await (const chunk of stream) {
      const token = typeof chunk.content === 'string' ? chunk.content : '';
      if (token) onToken(token);
    }
  },
};
