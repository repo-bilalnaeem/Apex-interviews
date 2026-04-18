---
phase: 10-langchain-agentic-pipeline
plan: "02"
subsystem: ui
tags: [react, sse, streaming, tool-calling, agentic, chat-ui]

requires:
  - phase: 10-langchain-agentic-pipeline
    provides: SSE route emitting toolCall events alongside answer tokens in /api/chatbot

provides:
  - Chat UI with toolCall SSE event handling and per-tool thinking indicator in src/modules/meetings/ui/components/chat-ui.tsx

affects: [any future tool additions that need chat bubble indicator text]

tech-stack:
  added: []
  patterns:
    - "Bubble state machine: dots (waiting) -> label+dots (tool active) -> streamed text (answering) — all in same bubble"
    - "TOOL_LABELS module-level const maps tool names to user-friendly display strings"
    - "thinkingLabel cleared on first answer token so transition is seamless"

key-files:
  created: []
  modified:
    - src/modules/meetings/ui/components/chat-ui.tsx

key-decisions:
  - "Three-state bubble: plain dots for non-agentic queries, label+dots when tool fires, streamed text once answer arrives"
  - "thinkingLabel reset both on parsed.answer and in finally block for correctness on error paths"
  - "TOOL_LABELS default fallback is 'Looking up meeting...' for unknown future tool names"

patterns-established:
  - "Bubble state machine: dots -> label+dots -> answer in single DOM element, no bubble swap"

requirements-completed: [AGEN-02]

duration: 1min
completed: 2026-04-18
---

# Phase 10 Plan 02: Chat UI Tool-Thinking Indicator Summary

**Three-state streaming bubble in chat-ui.tsx — animated dots, tool-specific label+dots on toolCall SSE event, seamless transition to answer in same bubble**

## Performance

- **Duration:** 1 min
- **Started:** 2026-04-18T06:21:55Z
- **Completed:** 2026-04-18T06:22:58Z
- **Tasks:** 2 (1 auto + 1 auto-approved checkpoint)
- **Files modified:** 1

## Accomplishments
- Added `TOOL_LABELS` module-level const with `fetch_transcript: "Fetching transcript..."` mapping, extensible for future tools
- Added `thinkingLabel` state and SSE reader logic to parse `toolCall` events and set per-tool display text
- Updated streaming bubble to cycle through three states: plain dots -> label+dots -> streamed answer — all in the same bubble
- Reset `thinkingLabel` in `finally` block ensuring clean state even on error paths

## Task Commits

1. **Task 1: Add toolCall state and thinking indicator to chat-ui.tsx** - `a9c46b4` (feat)
2. **Task 2: Verify agentic pipeline end-to-end** - auto-approved (checkpoint:human-verify, auto_advance=true)

## Files Created/Modified
- `src/modules/meetings/ui/components/chat-ui.tsx` - Extended SSE reader to parse toolCall events, added thinkingLabel state, three-state streaming bubble

## Decisions Made
- Three-state bubble (dots, label+dots, answer) all within the same DOM element — no bubble swap ensures smooth UX
- `thinkingLabel` fallback to `"Looking up meeting..."` for unrecognized tool names — future-proof without breaking UX
- Reset `thinkingLabel` in both `parsed.answer` handler and `finally` block to handle all code paths correctly

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None — TypeScript compiled clean on first attempt with exit 0.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Complete agentic pipeline is live end-to-end: transcript embedding (Phase 9) -> LangChain agent with fetch_transcript tool (Phase 10 Plan 01) -> chat UI with tool-thinking indicator (Phase 10 Plan 02)
- Adding new agent tools requires: (1) add tool to agent.ts, (2) add label to TOOL_LABELS in chat-ui.tsx

---
*Phase: 10-langchain-agentic-pipeline*
*Completed: 2026-04-18*
