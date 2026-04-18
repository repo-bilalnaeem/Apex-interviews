import 'server-only';

import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';
import type { SpecialistAgent, AgentContext } from './types';

const systemPrompt =
  "You are a CV and resume specialist. You help users tailor their resume to specific job descriptions, strengthen achievement bullet points with quantified impact, optimize keyword density for ATS systems, and structure their experience for maximum impact. Reference the user's actual resume content when given.";

export const resumeAdvisorAgent: SpecialistAgent = {
  name: 'resume_advisor',
  displayName: 'Resume Advisor',
  description:
    'Advises on CV/resume content, tailoring experience sections to job descriptions, quantifying achievements, and optimizing for ATS systems',

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
