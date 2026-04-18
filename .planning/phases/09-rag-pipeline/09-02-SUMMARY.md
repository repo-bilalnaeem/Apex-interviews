---
phase: 09-rag-pipeline
plan: "02"
subsystem: chatbot/rag
tags: [rag, semantic-search, knowledge-base, embeddings, inngest, transcript-chunking]
dependency_graph:
  requires: [embed, embedBatch, EmbeddedChunk, topK, initKB, getKBChunks, storeTranscriptChunks, getTranscriptChunks]
  provides: [getRelevantDocs, knowledgeBase, embed-transcript-step]
  affects: [src/app/api/chatbot/route.ts, src/app/api/gemini/route.ts]
tech_stack:
  added: []
  patterns: [lazy KB init sentinel, cosine similarity retrieval, speaker-labeled transcript chunks, inngest step chaining]
key_files:
  created: []
  modified:
    - src/lib/chatbot/knowledgeBase.ts
    - src/lib/chatbot/retrieve.ts
    - src/inngest/functions.ts
    - src/app/api/chatbot/route.ts
decisions:
  - knowledgeBase changed from Doc[] to string[] matching vectorStore initKB interface
  - agentSpeakers re-queried inside embed-transcript step (not reused from add-speakers scope) for inngest replay safety
  - regex changed from /gs dotAll to /[\s\S]/g for TS target compatibility (pre-ES2018 target)
  - route.ts await fix applied immediately (Rule 2) rather than deferring to Plan 03
metrics:
  duration_seconds: 259
  completed_date: "2026-04-17"
  tasks_completed: 2
  files_created: 0
  files_modified: 4
---

# Phase 9 Plan 02: Semantic Retrieval and Transcript Embedding Summary

Replaced hardcoded KB and keyword matching with async cosine similarity retrieval, and wired transcript chunking and embedding into the inngest processing pipeline.

## What Was Built

**src/lib/chatbot/knowledgeBase.ts** — Expanded from 3 placeholder `Doc[]` entries to 14 substantive `string[]` interview coaching entries:
- STAR method, "Tell me about yourself" formula, weakness answers, salary negotiation
- Questions to ask interviewers, technical interview strategy, body language, employment gaps
- CV writing tips, cover letter formula, post-interview follow-up, handling rejection
- Interview preparation strategy, managing nerves
- Shape changed from `Doc[]` to `string[]` to match `initKB(rawTexts: string[])` interface

**src/lib/chatbot/retrieve.ts** — Full async rewrite:
- `getRelevantDocs(query, meetingId?)` — now `async`, returns `Promise<string>`
- `ensureKB()` lazy-init sentinel: calls `initKB(knowledgeBase)` once per server process, subsequent calls return immediately
- `embed(query)` to get query vector, then `topK(queryVector, kbChunks, 5)` for KB results
- Optional `meetingId` path: `getTranscriptChunks(meetingId)` then `topK` on transcript store
- Transcript results formatted as `"Agent: {text}"` or `"User: {text}"` using the `speaker` field
- Returns formatted string with "Interview coaching knowledge:" and "Relevant transcript excerpts:" sections

**src/inngest/functions.ts** — New "embed-transcript" step after "save-summary":
- Imports `embedBatch` from `@/lib/chatbot/embeddings` and `storeTranscriptChunks`, `EmbeddedChunk` from `@/lib/chatbot/vectorStore`
- Queries `agents` table inside the step (inngest replay-safe) to build `agentNames` Set
- Iterates `transcriptWithSpeakers`, labels each turn as "Agent" or "User"
- Splits turns longer than 800 chars at word boundaries using `/[\s\S]{1,800}(\s|$)/g`
- Calls `embedBatch(chunkTexts)` then builds `EmbeddedChunk[]` with `meetingId` and `speaker`
- Calls `storeTranscriptChunks(event.data.meetingId, embeddedChunks)` to persist in memory
- Early returns if no transcript items or no chunks produced

**src/app/api/chatbot/route.ts** — Bug fix (Rule 2 deviation):
- Added `await` to `getRelevantDocs(message)` call — required by async signature change

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1 | f110040 | feat(09-02): expand KB to 14 entries and rewrite retrieve.ts with semantic search |
| 2 | 1b40e59 | feat(09-02): add embed-transcript inngest step and await getRelevantDocs in route.ts |

## Verification

- `npx tsc --noEmit` — zero errors (full project clean)
- Targeted checks on `knowledgeBase/retrieve` and `inngest/functions` returned no errors
- Shape checks: 14 KB entries, `embed-transcript` step at line 117, `async function getRelevantDocs` with `meetingId?` param confirmed

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Regex `s` flag not supported by TS target**
- **Found during:** Task 2
- **Issue:** `/gs` (dotAll) flag requires ES2018+ target; the project compiles to an earlier target, causing TS error 1501
- **Fix:** Changed regex to `/[\s\S]{1,800}(\s|$)/g` — semantically equivalent, compatible with all TS targets
- **Files modified:** `src/inngest/functions.ts`
- **Commit:** 1b40e59

**2. [Rule 2 - Missing critical functionality] route.ts missing `await` on getRelevantDocs**
- **Found during:** Task 2 (full TypeScript verification)
- **Issue:** `route.ts` called `getRelevantDocs(message)` synchronously; after Task 1 changed the signature to `async`, the return value became `Promise<string>` passed to `streamChatResponse` expecting `string`
- **Fix:** Added `await` to the call: `const context = await getRelevantDocs(message)`
- **Files modified:** `src/app/api/chatbot/route.ts`
- **Commit:** 1b40e59

**3. [Rule 1 - Scope] agentSpeakers re-queried inside embed-transcript step**
- **Found during:** Task 2
- **Issue:** Plan referenced `agentSpeakers` as in-scope, but it is defined inside the `step.run("add-speakers", ...)` callback and not returned — only `transcriptWithSpeakers` is returned from that step
- **Fix:** Added a fresh DB query for agents inside the "embed-transcript" step, which is also better for inngest replay safety (steps must be idempotent and self-contained)
- **Files modified:** `src/inngest/functions.ts`
- **Commit:** 1b40e59

## Self-Check: PASSED

- [x] `src/lib/chatbot/knowledgeBase.ts` — exports `string[]` with 14 entries
- [x] `src/lib/chatbot/retrieve.ts` — exports `async function getRelevantDocs(query: string, meetingId?: string): Promise<string>`
- [x] `src/inngest/functions.ts` — contains `"embed-transcript"` step after `"save-summary"` with `storeTranscriptChunks` call
- [x] `src/app/api/chatbot/route.ts` — `await getRelevantDocs(message)` present
- [x] TypeScript compiles clean (0 errors, exit 0)
- [x] Commits f110040 and 1b40e59 exist
