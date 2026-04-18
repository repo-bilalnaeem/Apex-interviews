import 'server-only';
import type { AgentName, SpecialistAgent } from './types';
import { transcriptAnalysisAgent } from './transcript-analysis-agent';
import { interviewCoachAgent } from './interview-coach-agent';
import { resumeAdvisorAgent } from './resume-advisor-agent';

export const agentRegistry: Record<AgentName, SpecialistAgent> = {
  transcript_analysis: transcriptAnalysisAgent,
  interview_coach: interviewCoachAgent,
  resume_advisor: resumeAdvisorAgent,
};

export function getAgent(name: AgentName): SpecialistAgent {
  return agentRegistry[name];
}
