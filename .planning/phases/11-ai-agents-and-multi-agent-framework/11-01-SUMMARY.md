---
phase: 11-ai-agents-and-multi-agent-framework
plan: "01"
subsystem: ai-agents
tags: [multi-agent, specialist-agents, langchain, streaming, registry]
dependency_graph:
  requires: []
  provides: [SpecialistAgent interface, agentRegistry, transcript-analysis-agent, interview-coach-agent, resume-advisor-agent]
  affects: [src/lib/chatbot/agents/]
tech_stack:
  added: []
  patterns: [specialist-agent-pattern, registry-pattern, two-pass-tool-loop, single-pass-stream]
key_files:
  created:
    - src/lib/chatbot/agents/types.ts
    - src/lib/chatbot/agents/registry.ts
    - src/lib/chatbot/agents/transcript-analysis-agent.ts
    - src/lib/chatbot/agents/interview-coach-agent.ts
    - src/lib/chatbot/agents/resume-advisor-agent.ts
  modified: []
decisions:
  - transcript-analysis-agent reuses fetch_transcript tool verbatim from agent.ts for in-memory/DB fallback pattern
  - interview-coach and resume-advisor use single-pass model.stream() — no tools needed
  - _onToolCall parameter prefixed with underscore in no-tool agents to satisfy TypeScript unused-param lint
metrics:
  duration_seconds: 110
  completed_date: "2026-04-18"
  tasks_completed: 2
  files_created: 5
---

# Phase 11 Plan 01: Specialist Agents and Registry Summary

Three specialist agents with a shared contract and central registry — transcript analysis (two-pass tool loop with fetch_transcript), interview coach (single-pass STAR/CARL coaching), and resume advisor (single-pass ATS/CV optimization), wired through a typed registry mapping AgentName to SpecialistAgent instances.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Define SpecialistAgent interface and AgentName types | 51a2614 | src/lib/chatbot/agents/types.ts |
| 2 | Build three specialist agents and central registry | b20b080 | transcript-analysis-agent.ts, interview-coach-agent.ts, resume-advisor-agent.ts, registry.ts |

## What Was Built

**types.ts** — Shared contract for all agents:
- `AgentName` union: `'transcript_analysis' | 'interview_coach' | 'resume_advisor'`
- `AgentContext` interface: message, context (RAG docs), resume text, history, optional meetingId
- `SpecialistAgent` interface: name, displayName, description, stream(ctx, onToolCall, onToken)

**transcript-analysis-agent.ts** — Two-pass tool loop, identical pattern to `agent.ts`:
- Binds `fetch_transcript` tool (in-memory store + DB URL fallback)
- First pass accumulates tool_call_chunks, second pass streams final answer
- System prompt focuses on objective transcript analysis and evidence-based feedback

**interview-coach-agent.ts** — Single-pass streaming, no tools:
- Coaching system prompt covering STAR/CARL frameworks, behavioral/technical interviews
- Emits tokens directly via `onToken`

**resume-advisor-agent.ts** — Single-pass streaming, no tools:
- CV/ATS system prompt covering job description tailoring, achievement quantification, keyword density
- References user's resume content when provided via AgentContext

**registry.ts** — Central dispatch:
- `agentRegistry: Record<AgentName, SpecialistAgent>` — typed map to all three singletons
- `getAgent(name: AgentName): SpecialistAgent` — lookup function for orchestrator use

## Deviations from Plan

None — plan executed exactly as written.

## Verification

- `npx tsc --noEmit` exits 0 with no errors
- `grep -r "SpecialistAgent" src/lib/chatbot/agents/` returns definition in types.ts + all 3 agent files implementing the interface + registry.ts importing it

## Self-Check: PASSED

All 5 files confirmed created:
- src/lib/chatbot/agents/types.ts — FOUND
- src/lib/chatbot/agents/registry.ts — FOUND
- src/lib/chatbot/agents/transcript-analysis-agent.ts — FOUND
- src/lib/chatbot/agents/interview-coach-agent.ts — FOUND
- src/lib/chatbot/agents/resume-advisor-agent.ts — FOUND

Commits confirmed:
- 51a2614 — FOUND
- b20b080 — FOUND
