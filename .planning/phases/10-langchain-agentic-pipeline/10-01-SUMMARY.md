---
phase: 10-langchain-agentic-pipeline
plan: "01"
subsystem: api
tags: [langchain, openai, sse, agentic, tool-calling, streaming]

requires:
  - phase: 09-rag-pipeline
    provides: vectorStore with getTranscriptChunks, retrieve.ts with getRelevantDocs, openai.ts with ChatMessage type

provides:
  - LangChain manual tool loop agent with fetch_transcript tool in src/lib/chatbot/agent.ts
  - SSE route emitting toolCall events alongside answer tokens in src/app/api/chatbot/route.ts

affects: [client-side chat UI that consumes SSE events, any future agent tools]

tech-stack:
  added: []
  patterns:
    - "Manual tool loop: stream first pass to detect tool_call_chunks, execute tool, stream second pass for final answer"
    - "SSE event shape: {toolCall: toolName} before {answer: token} events"
    - "Tool call accumulation via additional_kwargs.tool_calls index map"

key-files:
  created:
    - src/lib/chatbot/agent.ts
  modified:
    - src/app/api/chatbot/route.ts

key-decisions:
  - "Manual tool loop used instead of AgentExecutor for clean token-level streaming"
  - "Tool invoke result coerced to string via typeof check to satisfy ToolMessage content type"
  - "No-tool-call path emits accumulated content as single onToken call (not re-streamed)"

patterns-established:
  - "Tool call detection: accumulate tool_call_chunks from additional_kwargs into index-keyed map"
  - "SSE toolCall event: emitted from onToolCall callback before final answer tokens"

requirements-completed: [AGEN-01]

duration: 2min
completed: 2026-04-18
---

# Phase 10 Plan 01: Agentic Pipeline Summary

**LangChain tool-augmented chatbot with manual tool loop streaming fetch_transcript tool calls and SSE toolCall events over the existing RAG route**

## Performance

- **Duration:** 2 min
- **Started:** 2026-04-18T06:18:27Z
- **Completed:** 2026-04-18T06:20:15Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Created `agent.ts` with `transcriptTool` (using `tool()` from `@langchain/core/tools`) and manual two-pass streaming loop
- Upgraded `/api/chatbot/route.ts` to use `streamAgentResponse` with `onToolCall` and `onToken` callbacks
- Route now emits `{"toolCall": "fetch_transcript"}` SSE events before answer tokens when agent calls the tool

## Task Commits

1. **Task 1: Create agent.ts with transcript tool and streaming agent runner** - `0827d43` (feat)
2. **Task 2: Update route.ts to use streamAgentResponse and emit toolCall SSE events** - `89b6742` (feat)

## Files Created/Modified
- `src/lib/chatbot/agent.ts` - LangChain agentic runner with transcriptTool and streamAgentResponse export
- `src/app/api/chatbot/route.ts` - Updated to call streamAgentResponse with toolCall SSE event emission

## Decisions Made
- Manual tool loop chosen over AgentExecutor — AgentExecutor does not support token-level streaming cleanly
- Tool invoke return type coerced with `typeof rawResult === 'string'` check to satisfy TS2322 on ToolMessage content
- No-tool-call path emits accumulated content as a single `onToken` call rather than re-streaming, since the first-pass stream is already consumed

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed TS2322 type error on transcriptTool.invoke return value**
- **Found during:** Task 1 (agent.ts TypeScript verification)
- **Issue:** `transcriptTool.invoke()` returns `string | ToolMessage<...>` but assignment target was typed `string`
- **Fix:** Added `typeof rawResult === 'string' ? rawResult : String(rawResult)` coercion
- **Files modified:** src/lib/chatbot/agent.ts
- **Verification:** `npx tsc --noEmit` exits 0 with no errors
- **Committed in:** 0827d43 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 type bug)
**Impact on plan:** Required fix for TypeScript compilation correctness. No scope change.

## Issues Encountered
- LangChain `tool()` helper return type includes `ToolMessage` union — required explicit coercion to `string` for ToolMessage content field

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Agentic backend complete — client chat UI needs to handle `toolCall` SSE events to show tool-thinking indicators
- `streamAgentResponse` is ready for additional tools to be bound to the model

---
*Phase: 10-langchain-agentic-pipeline*
*Completed: 2026-04-18*
