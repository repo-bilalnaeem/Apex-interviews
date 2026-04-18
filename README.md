# Apex Interviews

An AI-powered interview coaching platform. Users create AI agents with custom job descriptions, conduct live mock interviews over video, and get post-interview analysis, coaching, and resume advice from a multi-agent AI system.

---

## What It Does

- **Live AI Interviews** — join a video/audio call with a custom AI agent that plays the interviewer, powered by Stream Video
- **Transcript Analysis** — after the call, the transcript is auto-processed: summarized by an Inngest agent and embedded into a vector store for semantic search
- **Ask AI Chatbot** — a multi-agent chatbot answers questions about the transcript, coaches on interview technique, and advises on CV/resume — with visible agent routing in the UI
- **Resume Assistant** — upload a PDF CV, get it tailored to a job description, generate a cover letter or offer letter, export as PDF/DOCX
- **Secure Agent Creation** — all agent instructions are validated by an LLM guardrail before saving, blocking off-topic content and prompt injection attempts

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 15 (App Router, Turbopack) |
| Database | Neon Serverless Postgres + Drizzle ORM |
| Auth | Better Auth |
| Video/Audio calls | Stream Video SDK |
| Chat | Stream Chat SDK |
| Background jobs | Inngest |
| AI models | OpenAI GPT-4o-mini, text-embedding-ada-002 |
| Agentic framework | LangChain (`@langchain/openai`, `@langchain/core`) + Inngest Agent Kit |
| File uploads | UploadThing |
| Email | Nodemailer |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Neon (or Postgres) database
- OpenAI API key
- Stream Video + Chat API keys
- Inngest account (or run locally with `npx inngest-cli dev`)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file at the project root:

```env
# Database
DATABASE_URL=postgresql://...

# Auth
BETTER_AUTH_SECRET=your-secret
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Stream Video (live calls)
NEXT_PUBLIC_STREAM_VIDEO_API_KEY=your-key
STREAM_VIDEO_SECRET_KEY=your-secret

# Stream Chat
NEXT_PUBLIC_STREAM_CHAT_API_KEY=your-key
STREAM_CHAT_SECRET_KEY=your-secret

# OpenAI — embeddings, guardrails, and all AI agents
OPENAI_SECRET_KEY=sk-...    # used for text-embedding-ada-002
OPENAI_API_KEY=sk-...       # used for chatbot agents and guardrails

# Inngest webhook secret (from Inngest dashboard)
Webhook=your-inngest-webhook-secret
```

### 3. Push the database schema

```bash
npm run db:push
```

### 4. Run the dev server

```bash
npm run dev
```

App runs at `http://localhost:3000`.

### 5. Run the Inngest dev server (background jobs)

In a separate terminal:

```bash
npx inngest-cli@latest dev
```

This handles transcript processing after calls end. For webhook tunneling:

```bash
npm run dev:webhook   # uses ngrok
```

---

## AI Features

### 1. RAG Pipeline (Vector Store + Semantic Search)

**Files:** `src/lib/chatbot/embeddings.ts`, `vectorStore.ts`, `retrieve.ts`, `knowledgeBase.ts`

After a meeting ends, the transcript is chunked by speaker turn (max 800 chars/chunk), batch-embedded using OpenAI `text-embedding-ada-002`, and stored in an **in-memory vector store** keyed by `meetingId`.

A static **knowledge base** of interview coaching tips is also embedded at server startup (lazy init, once per process).

When the user sends a message in the chatbot:
1. The query is embedded into a vector
2. **Cosine similarity search** retrieves top-5 KB chunks + top-5 transcript chunks
3. Retrieved context is injected into the agent's system prompt before the LLM generates a response

```
User message
    │
    ▼
embed(query)
    │
    ├── topK(query, kbChunks, 5)         → interview coaching knowledge
    └── topK(query, transcriptChunks, 5) → relevant transcript excerpts
                    │
                    ▼
            injected into agent system prompt
```

| File | Role |
|------|------|
| `embeddings.ts` | `embed()` and `embedBatch()` via OpenAI SDK |
| `vectorStore.ts` | In-memory KB store + per-meeting transcript store + `topK()` cosine search |
| `retrieve.ts` | `getRelevantDocs()` — queries both stores, returns merged context string |
| `knowledgeBase.ts` | Static interview coaching texts |

---

### 2. Guardrails & Prompt Injection Defense

**Files:** `src/lib/guardrails.ts` + system prompt hardening in all agents

**Two-layer defense:**

**Layer 1 — Backend LLM validation (on agent create/edit)**

When a user creates or edits an AI agent, `validateAgentInstructions()` runs before the record is saved. An LLM classifier (GPT-4o-mini) checks:
- Are the instructions plausibly job/career-related?
- Do they contain injection patterns (`ignore previous instructions`, `you are now`, `DAN`, override commands)?

Returns `VALID` or `INVALID`. Invalid instructions are rejected before touching the database.

**Layer 2 — System prompt hardening (live calls + chatbot)**

Every specialist agent has a scoped system prompt. Off-topic or injection-style messages receive a polite refusal. No jailbreak path exists because the scope is defined in the system prompt, not enforced by the user message alone.

---

### 3. Inngest Agent (Transcript Summarization)

**Files:** `src/inngest/functions.ts`

When a meeting ends, Stream sends a webhook that fires the `meetings/processing` Inngest event. The pipeline runs as discrete, replayable steps:

1. `parse-transcript` — fetches and parses the JSONL transcript from the recording URL
2. `add-speakers` — joins speaker IDs against the DB to resolve real names (user vs AI agent)
3. `summarizer.run()` — **Inngest Agent Kit**: a `createAgent()` wrapping GPT-4o-mini generates a structured markdown summary (Overview + timestamped Notes sections), saved back to the `meetings` table
4. `embed-transcript` — chunks by speaker turn, batch-embeds, stores in the vector store for RAG

---

### 4. LangChain Agentic Pipeline

**Files:** `src/lib/chatbot/agent.ts`, `src/app/api/gemini/route.ts`

The chatbot uses a **manual tool loop** (not `AgentExecutor`) built with `@langchain/openai` and `@langchain/core` for clean token-level streaming:

1. First LangChain streaming pass — if the model emits `tool_call_chunks`, the loop collects them
2. `fetch_transcript` tool executes — retrieves transcript chunks from the vector store
3. Second LangChain streaming pass — generates the final grounded answer

All responses stream as **Server-Sent Events (SSE)**:
- `{ agentName }` — which specialist is responding (always first)
- `{ toolCall }` — tool name when a tool is executing (optional)
- `{ answer }` — streamed response tokens

The chat UI renders a **three-state thinking bubble**: `●●●` (waiting) → `AgentName + tool label + ●●●` (tool active) → streamed answer.

---

### 5. Multi-Agent Framework

**Files:** `src/lib/chatbot/agents/`

Every user message is routed by an **orchestrator** that calls GPT-4o-mini at `temperature: 0` (no streaming, ~200ms) to classify intent and pick the right specialist.

**Specialists:**

| Agent | Routes when user asks about | Capability |
|-------|----------------------------|------------|
| `TranscriptAnalysisAgent` | Specific moments, quotes, "what was said", transcript | Two-pass tool loop with `fetch_transcript` — answers grounded in the actual recording |
| `InterviewCoachAgent` | How to answer questions, STAR/CARL, technique, nerves | Single-pass stream — coaching frameworks, no tools needed |
| `ResumeAdvisorAgent` | CV, resume, ATS, tailoring, bullet points | Single-pass stream — ATS optimization, quantifying achievements |

Safe default: falls back to `interview_coach` if the classifier returns an unexpected value.

**Adding a new agent** requires only 4 changes: create the agent class, add to `AgentName` union, add to `agentRegistry`, add a routing rule to the orchestrator prompt. No changes to `agent.ts`, `route.ts`, or `chat-ui.tsx`.

```
src/lib/chatbot/agents/
├── types.ts                       # SpecialistAgent interface, AgentContext, AgentName union
├── registry.ts                    # agentRegistry map + getAgent()
├── orchestrator.ts                # classifyIntent() + orchestrateAndStream()
├── transcript-analysis-agent.ts   # Two-pass tool loop
├── interview-coach-agent.ts       # Single-pass STAR/CARL coaching
└── resume-advisor-agent.ts        # Single-pass ATS/CV advisor
```

---

### 6. Chatbot Memory

**Meeting chatbot** (`src/modules/meetings/ui/components/chat-ui.tsx`): conversation `history` is sent with every request as a `ChatMessage[]` array. The LangChain agents receive it in `AgentContext` and prepend it to the message list, giving the model full session context.

**Resume Assistant** (`src/modules/resume-assistant/`): chat history is persisted to `localStorage` under `resume_assistant_chat`, surviving page refreshes. Messages are loaded on mount and included with every API call.

---

### 7. Resume Assistant — PDF Parsing (Multimodal Input)

**Files:** `src/modules/resume-assistant/`, `src/app/api/parseResume/`

Users upload a PDF CV. The `/api/parseResume` endpoint:
1. Accepts a base64-encoded PDF
2. Uses `pdf-parse` to extract raw text from the binary buffer
3. Returns the text to the client

Extracted CV text becomes context for all resume AI requests. Outputs can be exported as **PDF** (`jsPDF`) or **DOCX** (`docx` + `file-saver`).

---

### 8. Video & Audio Calls

**Files:** `src/lib/stream-video.ts`, `src/modules/call/`

Live mock interviews use **Stream Video SDK** for real-time audio/video. The AI agent joins the call as a participant via Stream's API. When the call ends, Stream fires a webhook that triggers the Inngest transcript processing pipeline.

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── gemini/route.ts      # Chatbot SSE endpoint (POST)
│   │   ├── inngest/route.ts     # Inngest event handler
│   │   ├── parseResume/         # PDF text extraction
│   │   ├── auth/                # Better Auth routes
│   │   └── webhook/             # Stream webhook → Inngest trigger
│   └── (dashboard)/             # App pages (protected)
├── lib/
│   ├── chatbot/
│   │   ├── agents/              # Multi-agent framework
│   │   │   ├── types.ts
│   │   │   ├── registry.ts
│   │   │   ├── orchestrator.ts
│   │   │   ├── transcript-analysis-agent.ts
│   │   │   ├── interview-coach-agent.ts
│   │   │   └── resume-advisor-agent.ts
│   │   ├── agent.ts             # Entry point — delegates to orchestrator
│   │   ├── embeddings.ts        # OpenAI embedding calls
│   │   ├── vectorStore.ts       # In-memory vector store + cosine search
│   │   ├── retrieve.ts          # RAG retrieval (KB + transcript)
│   │   └── knowledgeBase.ts     # Static coaching knowledge base
│   ├── guardrails.ts            # LLM-based agent instruction validator
│   ├── stream-video.ts          # Stream Video server client
│   └── stream-chat.ts           # Stream Chat server client
├── inngest/
│   ├── client.ts                # Inngest client
│   └── functions.ts             # meetings/processing pipeline (summarize + embed)
├── modules/
│   ├── meetings/                # Meeting list, detail, chatbot UI
│   ├── agents/                  # Agent creation/edit (guarded by guardrails)
│   ├── call/                    # Live interview call screen
│   ├── resume-assistant/        # Resume upload, chat, export
│   └── dashboard/               # Home dashboard
└── db/
    ├── schema.ts                # Drizzle ORM schema
    └── index.ts                 # DB client (Neon serverless)
```

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Next.js dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run db:push` | Push Drizzle schema to database |
| `npm run db:studio` | Open Drizzle Studio (DB GUI) |
| `npm run dev:webhook` | Start ngrok tunnel for Stream webhooks |

---

## Deployment

The app is a standard Next.js project and deploys to **Vercel** without configuration. Required services:

| Service | Purpose |
|---------|---------|
| Vercel (or any Node host) | Next.js app hosting |
| Neon | Serverless Postgres database |
| Inngest Cloud | Background job processing (transcript pipeline) |
| Stream | Video calls + chat |
| OpenAI | Embeddings + all AI agents |
| UploadThing | CV file uploads |

Set all environment variables in the Vercel dashboard. Point the Stream webhook URL to `https://your-domain.com/api/webhook`.
