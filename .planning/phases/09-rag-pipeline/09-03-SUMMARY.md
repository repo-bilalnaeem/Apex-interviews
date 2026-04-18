---
phase: 09-rag-pipeline
plan: "03"
subsystem: chatbot-rag
tags: [rag, chatbot, meetingId, transcript-retrieval]
dependency_graph:
  requires:
    - 09-02
  provides:
    - end-to-end RAG pipeline wired through UI to route to vector store
  affects:
    - src/app/api/chatbot/route.ts
    - src/modules/meetings/ui/components/chat-ui.tsx
tech_stack:
  added: []
  patterns:
    - meetingId propagation from UI through API to vector store
key_files:
  modified:
    - src/app/api/chatbot/route.ts
    - src/modules/meetings/ui/components/chat-ui.tsx
decisions:
  - "route.ts await fix was already applied at Plan 02; Plan 03 only added meetingId destructuring and parameter passing"
metrics:
  duration_seconds: 193
  completed_date: "2026-04-17"
  tasks_completed: 2
  files_modified: 2
---

# Phase 9 Plan 03: Wire meetingId Through RAG Pipeline Summary

**One-liner:** meetingId flows from ChatUI fetch body through /api/chatbot route into getRelevantDocs for transcript-grounded interview Q&A.

## What Was Built

Two targeted edits close the final gap in the RAG pipeline:

1. `/api/chatbot/route.ts` — destructures `meetingId` from the POST request body and passes it as the second argument to `await getRelevantDocs(message, meetingId)`.
2. `chat-ui.tsx` — includes `meetingId` in the JSON body of every `/api/chatbot` fetch request; the prop was already available at the component level.

The `getRelevantDocs` function (implemented in Plan 02) already handled the `meetingId?: string` parameter — it performs transcript chunk lookup when `meetingId` is provided and gracefully skips it when undefined (for non-meeting chatbot usage).

## Tasks

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Update /api/chatbot route to accept meetingId | 1a5cb95 | src/app/api/chatbot/route.ts |
| 2 | Update chat-ui.tsx to send meetingId in request | 7ee18f1 | src/modules/meetings/ui/components/chat-ui.tsx |

## Verification

- TypeScript: `npx tsc --noEmit` — clean, no errors
- Per-file checks: no errors in `api/chatbot` or `chat-ui`
- Build: compiled successfully (pre-existing `/api/upload-cv` error unrelated to this phase)

## Deviations from Plan

None - plan executed exactly as written.

Note: The STATE.md already recorded that `await` was added to `getRelevantDocs` call at Plan 02, so Plan 03 only needed the `meetingId` parameter wiring (not re-adding `await`). The route.ts already had `await` on line 8 when Plan 03 began.

## Self-Check: PASSED

- [x] src/app/api/chatbot/route.ts modified and committed (1a5cb95)
- [x] src/modules/meetings/ui/components/chat-ui.tsx modified and committed (7ee18f1)
- [x] TypeScript compiles clean
- [x] SUMMARY.md created
