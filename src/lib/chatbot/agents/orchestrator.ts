import 'server-only';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import type { AgentName, AgentContext } from './types';
import { agentRegistry } from './registry';

const AGENT_SELECTION_PROMPT = `You are a routing agent for an AI interview coaching system. Based on the user's message, select the most appropriate specialist agent.

Available agents:
- transcript_analysis: Analyzes interview transcripts, recalls specific quotes, identifies key moments, and assesses performance based on what was said
- interview_coach: Provides actionable coaching on interview techniques, answer frameworks (STAR, CARL), how to improve responses, body language, and general interview strategy
- resume_advisor: Advises on CV/resume content, tailoring experience sections to job descriptions, quantifying achievements, and optimizing for ATS systems

Respond with ONLY one of these exact strings: transcript_analysis, interview_coach, resume_advisor

Rules:
- If the user asks about "what was said", "transcript", "quotes", "specific moment", or "what happened in" → transcript_analysis
- If the user asks about "how to answer", "interview tips", "STAR", "nervous", "technique", "practice" → interview_coach
- If the user asks about "CV", "resume", "tailor", "ATS", "job description match", "bullet points" → resume_advisor
- Default to interview_coach for general career questions`;

async function classifyIntent(message: string): Promise<AgentName> {
  const model = new ChatOpenAI({
    model: 'gpt-4o-mini',
    apiKey: process.env.OPENAI_API_KEY,
    streaming: false,
    temperature: 0,
  });

  const result = await model.invoke([
    new SystemMessage(AGENT_SELECTION_PROMPT),
    new HumanMessage(message),
  ]);

  const raw = typeof result.content === 'string' ? result.content.trim() : '';
  const valid: AgentName[] = ['transcript_analysis', 'interview_coach', 'resume_advisor'];
  const matched = valid.find((v) => raw.startsWith(v));
  return matched ?? 'interview_coach'; // safe default
}

export async function orchestrateAndStream(
  ctx: AgentContext,
  onAgentName: (name: string) => void,
  onToolCall: (toolName: string) => void,
  onToken: (token: string) => void
): Promise<void> {
  const start = Date.now();
  const agentName = await classifyIntent(ctx.message);
  onAgentName(agentRegistry[agentName].displayName);
  const agent = agentRegistry[agentName];
  await agent.stream(ctx, onToolCall, onToken);
  console.log({ agent: agentName, latencyMs: Date.now() - start, meetingId: ctx.meetingId ?? null });
}
