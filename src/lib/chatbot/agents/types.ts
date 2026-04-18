import 'server-only';
import type { ChatMessage } from '@/lib/chatbot/openai';

export type AgentName = 'transcript_analysis' | 'interview_coach' | 'resume_advisor';

export interface AgentContext {
  message: string;
  context: string;       // RAG-retrieved docs
  resume: string;        // user resume text
  history: ChatMessage[];
  meetingId?: string;
}

export interface SpecialistAgent {
  name: AgentName;
  displayName: string;   // shown in chat UI, e.g. "Transcript Analyst"
  description: string;   // used by orchestrator to pick the right agent
  stream(
    ctx: AgentContext,
    onToolCall: (toolName: string) => void,
    onToken: (token: string) => void
  ): Promise<void>;
}
