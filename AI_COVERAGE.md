# AI Feature Coverage Tracker

Tracks which AI/ML topics are implemented in the APEX Interviews platform.

---

## RAG / Vectorstore

**Status:** Not implemented

- No retrieval-augmented generation pipeline
- No vector database (Pinecone, Weaviate, pgvector, etc.)
- All AI calls are direct prompt → response with no document retrieval

**Gap:** CV/resume content and job descriptions are passed inline to LLM prompts. A RAG layer could retrieve relevant interview questions or career advice from a knowledge base.

---

## Defence from Prompt Injection & Guardrails

**Status:** Implemented (Phase 8)

- **Agent creation validation** — `src/lib/guardrails.ts` calls OpenAI gpt-4o-mini to classify agent instructions before saving. Checks two criteria in one call: topic relevance (must be job/interview/career related) and injection detection (catches "ignore previous instructions", DAN-style, etc.). Hard block with `TRPCError BAD_REQUEST` on failure. Applied to both create and update.
- **In-call guardrails** — `src/app/api/webhook/route.ts` injects a hybrid system prompt into every OpenAI Realtime session: fixed guardrail layer (permitted topics, polite redirect, injection defence, AI identity honesty) prepended above the agent's custom instructions.
- **Permitted topics:** Interviews, CV/resume, cover letters, job search, salary, career advice, LinkedIn, industry knowledge, job-adjacent questions.
- **Refusal tone:** Polite redirect — "I am here to help with your interview prep — let us keep focused on that."

---

## Deployment

**Status:** Not implemented

- No Docker / docker-compose
- No CI/CD pipeline (GitHub Actions, etc.)
- No cloud deployment config (Railway, Render, Vercel, AWS, etc.)
- `backend/dist` is gitignored — must build before any deploy

**Gap:** Needs containerisation + a deployment target. Backend (NestJS/Fastify) and frontend (Next.js) need separate deploy configs. Stream webhooks require a public URL (currently ngrok for local dev).

---

## LangChain / Agentic Framework

**Status:** Partial — Inngest Agent Kit

- **Inngest Agent Kit** used for transcript summarisation pipeline (`backend/src/inngest/`): triggered by `call.transcription_ready` webhook → fetches NDJSON from Stream CDN → OpenAI summarises → saves to DB.
- No LangChain, LlamaIndex, or CrewAI.
- Agents are single-step (one LLM call per job), not multi-step reasoning chains.

**Gap:** No chain-of-thought, tool-calling agents, or ReAct-style reasoning loops.

---

## AI Agents & Multiagent Frameworks

**Status:** Partial — single AI agent per call

- **Live interview agent** — OpenAI Realtime API (`gpt-4o-mini-realtime-preview`) joins each Stream Video call as a participant via `connectOpenAi` in the webhook handler. Conducts the interview based on agent instructions + guardrail system prompt.
- **Custom agent personas** — users create agents with custom names and instructions (validated by Phase 8 guardrails).
- No multiagent orchestration (no agent-to-agent communication, no supervisor/worker pattern).
- One agent per call — no parallel agents or handoff between agents.

**Gap:** No multiagent framework. Each interview call has exactly one AI agent.

---

## Chatbot & Memory Tricks

**Status:** Partial — stateless chatbot, no memory

- **Interview prep chatbot** — `backend/src/chatbot/` powered by Google Gemini 1.5 Flash. Answers career and interview questions.
- **Career tools chatbot** — `tools/chatbot.tsx` on frontend with typing indicator and message bubbles.
- **No persistent memory** — conversation history is not stored between sessions. Each new chat starts fresh.
- **No summarisation memory** — no sliding window, no vector-based memory retrieval, no session summarisation.

**Gap:** Memory tricks (sliding window, summary memory, entity memory) not implemented. Conversations reset on page refresh.

---

## Multimodal / Images & Sound

**Status:** Implemented — audio and PDF

- **Live audio** — OpenAI Realtime API handles real-time voice conversation during interviews. The AI agent speaks and listens via Stream Video's audio channel.
- **Video calls** — Stream Video React Native SDK provides live video between user and AI agent participant.
- **PDF parsing** — `backend/src/common/` parses uploaded resume PDFs for question generation (`/questions`) and CV tools (`/resume`, `/hr-tools`).
- **No image understanding** — no vision models, no screenshot or image analysis.
- **No TTS/STT custom pipeline** — audio handled entirely by OpenAI Realtime (built-in STT + TTS).

---

## Summary

| Topic | Status |
|-------|--------|
| RAG / Vectorstore | Not implemented |
| Prompt injection defence & guardrails | Implemented |
| Deployment | Not implemented |
| LangChain / agentic framework | Partial (Inngest Agent Kit) |
| AI agents & multiagent frameworks | Partial (single agent per call) |
| Chatbot & memory tricks | Partial (stateless chatbot) |
| Multimodal — images/sound | Implemented (audio, video, PDF) |

---

*Last updated: 2026-04-17*
