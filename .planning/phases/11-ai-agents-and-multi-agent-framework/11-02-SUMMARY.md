---
phase: 11-ai-agents-and-multi-agent-framework
plan: "02"
subsystem: chatbot-orchestration
tags: [multi-agent, orchestrator, routing, sse, langchain]
dependency_graph:
  requires: [11-01]
  provides: [orchestrateAndStream, agentName-sse-event]
  affects: [src/app/api/chatbot/route.ts, src/lib/chatbot/agent.ts]
tech_stack:
  added: []
  patterns: [LLM-based intent classification, thin delegation wrapper, SSE event ordering]
key_files:
  created:
    - src/lib/chatbot/agents/orchestrator.ts
  modified:
    - src/lib/chatbot/agent.ts
    - src/app/api/chatbot/route.ts
decisions:
  - "LLM classification uses temperature: 0 and streaming: false for deterministic routing (~200ms overhead)"
  - "agent.ts reduced to thin wrapper — all logic lives in specialist agents and orchestrator"
  - "SSE event order standardized: agentName -> (optional) toolCall -> answer tokens"
  - "Default agent is interview_coach for unclassified general career questions"
metrics:
  duration_seconds: 92
  completed_date: "2026-04-18"
  tasks_completed: 2
  files_changed: 3
---

# Phase 11 Plan 02: Orchestrator and Multi-Agent Routing Summary

**One-liner:** LLM-based orchestrator routes user messages to specialist agents via gpt-4o-mini classification at temperature 0, emitting an agentName SSE event before response tokens.

## What Was Built

The orchestrator is the routing layer that transforms the system from a single agent with multiple tools into a true multi-agent framework. It classifies user intent in a fast, deterministic LLM call, selects the appropriate specialist (transcript_analysis, interview_coach, or resume_advisor), emits an `agentName` SSE event so the UI knows which agent is responding, then delegates streaming to that specialist.

### Files Created

**src/lib/chatbot/agents/orchestrator.ts**
- `classifyIntent(message)` — zero-temperature gpt-4o-mini call with rule-based fallback to 'interview_coach'
- `orchestrateAndStream(ctx, onAgentName, onToolCall, onToken)` — public export; classifies, emits agent name, delegates stream

### Files Modified

**src/lib/chatbot/agent.ts**
- Replaced entire implementation (130 lines with transcriptTool, tool loop, manual streaming) with a 19-line thin wrapper that imports and delegates to `orchestrateAndStream`
- Signature extended with `onAgentName` callback parameter

**src/app/api/chatbot/route.ts**
- Added `onAgentName` callback that enqueues `{ agentName }` SSE event
- SSE event order per request: `{agentName}` → `{toolCall}` (optional) → `{answer}` tokens

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| temperature: 0 for classification | Deterministic routing — same message always routes to same agent |
| streaming: false for classification | Routing decision must complete before streaming begins; adds ~200ms |
| Default to interview_coach | Covers general career questions not matching specific keywords |
| agent.ts as thin wrapper | All agent logic stays in specialist files; agent.ts is just the public API |

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check

- [x] orchestrator.ts created at correct path
- [x] `orchestrateAndStream` exported
- [x] agent.ts delegates to `orchestrateAndStream` with 4 callbacks
- [x] route.ts emits `{agentName}` SSE event
- [x] TypeScript compiles with 0 errors (`npx tsc --noEmit` exits 0)
- [x] `grep "agentName" src/app/api/chatbot/route.ts` confirms SSE emit
- [x] `grep "orchestrateAndStream" src/lib/chatbot/agent.ts` confirms delegation

## Self-Check: PASSED
