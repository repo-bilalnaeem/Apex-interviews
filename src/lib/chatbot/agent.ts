import 'server-only';
import { orchestrateAndStream } from './agents/orchestrator';
import type { ChatMessage } from './openai';
import type { AgentContext } from './agents/types';

export async function streamAgentResponse(
  message: string,
  context: string,
  resume: string,
  history: ChatMessage[],
  meetingId: string | undefined,
  onAgentName: (name: string) => void,
  onToolCall: (toolName: string) => void,
  onToken: (token: string) => void
): Promise<void> {
  const ctx: AgentContext = { message, context, resume, history, meetingId };
  await orchestrateAndStream(ctx, onAgentName, onToolCall, onToken);
}
