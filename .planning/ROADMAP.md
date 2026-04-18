# Roadmap: APEX — UI Redesign

**Created:** 2026-03-26
**Granularity:** Standard
**Execution:** Parallel (within phases)

---

## Phase 1: Foundation

**Goal:** Establish the design system that all other phases depend on — tokens, fonts, and reusable components.

**Requirements:** FOUND-01–07

**Scope:**
- Install `expo-linear-gradient`, `@expo-google-fonts/syne`, `@expo-google-fonts/plus-jakarta-sans`
- Create `frontend/lib/theme.ts` with all color + font tokens
- Create `frontend/components/ui/Button.tsx` (primary/secondary/danger/ghost, sm/md/lg)
- Create `frontend/components/ui/Input.tsx` (lime focus ring, label, error)
- Create `frontend/components/ui/Card.tsx` (dark surface, optional lime accent border)
- Create `frontend/components/ui/Badge.tsx` (status dot, color map)
- Update `app/_layout.tsx` to load fonts via `useFonts`

**Success Criteria:**
1. `theme.ts` exports all colors and fonts from the design brief
2. Button renders all 4 variants and 3 sizes without errors
3. Input shows lime focus border on focus and red error text when error prop set
4. Card renders with and without accentBorder prop
5. Badge renders all meeting status states with correct colors
6. Fonts load on app start without splash screen flicker

---

## Phase 2: Onboarding Flow

**Goal:** First-time user experience from cold launch to sign-in — animated splash, 3-slide onboarding, AsyncStorage routing gate.

**Requirements:** ONBD-01–04

**Plans:** 2/2 plans complete

Plans:
- [x] 02-01-PLAN.md — Animated APEX splash screen + AsyncStorage routing gate in index.tsx
- [x] 02-02-PLAN.md — 3-slide paginated onboarding screen with images, gradient, dots, CTAs

**Scope:**
- Create `app/splash.tsx` — full-screen APEX wordmark, lime underscore animates in with Reanimated, auto-nav after 1.5s
- Create `app/onboarding.tsx` — 3-slide FlatList with pagingEnabled, Unsplash images, LinearGradient overlay, progress dots, Next/Get Started button
- Update `app/index.tsx` — AsyncStorage check → splash → onboarding → auth → app routing

**Success Criteria:**
1. Splash screen shows APEX wordmark with lime underscore animation, no status bar
2. Lime underscore animates from left using Reanimated (not CSS)
3. Auto-navigates after 1.5s to onboarding (first time) or app (returning)
4. Onboarding shows 3 slides with Unsplash images and LinearGradient overlay
5. Progress dots update as user swipes
6. "Skip" button top-right navigates directly to sign-in
7. "Get Started" on slide 3 sets AsyncStorage and navigates to sign-in
8. Returning users bypass onboarding entirely

---

## Phase 3: Auth Screens

**Goal:** Branded sign-in and sign-up screens with APEX identity — all existing auth logic unchanged.

**Requirements:** AUTH-01–03

**Plans:** 2/2 plans complete

Plans:
- [x] 03-01-PLAN.md — Redesign sign-in.tsx: APEX wordmark, "Welcome back." heading, Input/Button components, lime CTA
- [x] 03-02-PLAN.md — Redesign sign-up.tsx: "Let's get you hired." heading, 4 fields, mirror layout

**Scope:**
- Redesign `app/(auth)/sign-in.tsx` — APEX wordmark, "Welcome back." heading, floating inputs, lime CTA
- Redesign `app/(auth)/sign-up.tsx` — "Let's get you hired." heading, same layout

**Success Criteria:**
1. Sign-in shows APEX wordmark, "Welcome back." in Syne Bold 40px
2. Input fields have dark surface background and lime focus border
3. Sign In button is full-width lime with black Syne Bold text
4. Sign-up link is muted text with lime tappable "Sign up"
5. Sign-up screen mirrors layout with "Let's get you hired." heading
6. All auth logic (better-auth, SecureStore, API calls) unchanged and working

---

## Phase 4: Core App Screens

**Goal:** All 5 main tab screens redesigned with cohesive APEX brand — lime accents, Syne headings, dark surfaces.

**Requirements:** CORE-01–05

**Plans:** 5/5 plans complete

Plans:
- [x] 04-01-PLAN.md — Dashboard (index.tsx): greeting, lime stats grid, Quick Start card, activity feed
- [x] 04-02-PLAN.md — Meetings (meetings.tsx): 4px status bars, filter chips, lime FAB, dark rows
- [x] 04-03-PLAN.md — Agents (agents.tsx): 2-column grid, 56px initial circles, dashed New Agent card
- [x] 04-04-PLAN.md — Tools (tools.tsx): 2×2 card grid with lime Lucide icons
- [ ] 04-05-PLAN.md — Settings (settings.tsx): dark rows, lime initials, danger Sign Out

**Scope:**
- `(app)/index.tsx` — editorial header, 2×2 lime stat grid, Quick Start card, activity feed with lime left borders
- `(app)/meetings.tsx` — status bar colors, filter chips, FAB, empty state
- `(app)/agents.tsx` — 2-column grid, initial letter circles, dashed "New Agent" card, search bar
- `(app)/tools.tsx` — 2×2 tool card grid with lime icons
- `(app)/settings.tsx` — section rows, danger sign-out, version footer

**Success Criteria:**
1. Dashboard shows "Good morning, [Name]" + "Overview" in Syne Bold 28px
2. Stats grid has 4 cells with Syne Bold 48px lime numbers
3. Meetings list has color-coded 4px left status bars per meeting status
4. Filter chips are pill-shaped; active chip has lime bg and black text
5. Agents list is a 2-column grid with initial letter circles (lime, Syne Bold 40px)
6. "New Agent" card has dashed border with lime + center
7. Tools hub shows 2×2 card grid with lime icons
8. FAB on meetings screen is lime circle bottom-right
9. Settings has "Sign Out" row in danger red

---

## Phase 5: Detail Screens

**Goal:** Meeting detail and agent detail pages fully redesigned with all state variants.

**Requirements:** DETL-01–02

**Plans:** 1/2 plans executed

Plans:
- [x] 05-01-PLAN.md — Meeting detail: dark theme, Badge status, 5 status states, lime summary card, transcript rows
- [x] 05-02-PLAN.md — Agent detail: 80px hero circle, instructions card, Start Interview button, recent meetings

**Scope:**
- `meetings/[id].tsx` — inline status badge, state-specific UI for all 5 statuses (upcoming/active/processing/completed/cancelled)
- `agents/[id].tsx` — 80px hero initial circle, instructions card, Start Interview button, recent meetings

**Success Criteria:**
1. Meeting detail shows status as inline badge (dot + text, no pill background)
2. Upcoming state shows lime "Join Interview" full-width button
3. Processing state shows lime spinner + "Generating your AI debrief..." copy
4. Completed state shows AI Summary card with lime top border and transcript rows
5. Transcript agent name in lime uppercase 11px, user in muted uppercase 11px
6. Agent detail shows 80px initial circle (lime bg, Syne Bold)
7. "Start Interview" button is full-width lime

---

## Phase 6: Call Screen

**Goal:** Immersive, polished call experience — pulsing Reanimated ring for AI speaking state, frosted glass controls.

**Requirements:** CALL-01–03

**Plans:** 3/3 plans complete

Plans:
- [x] 06-01-PLAN.md — CallLobby: pure black bg, Syne meeting name, cam/mic indicators, lime "Join Interview" button
- [x] 06-02-PLAN.md — CallActive: 120px AI circle, Reanimated pulsing lime ring, frosted glass pill, REC indicator, user PiP
- [x] 06-03-PLAN.md — CallEnded + [meetingId].tsx: "Session complete" Syne heading, lime "View Summary" button, parent bg updates

**Scope:**
- Lobby — black bg, Syne meeting name, lime "Join Interview" button
- Active — AI circle (120px) with pulsing lime ring (Reanimated loop), frosted glass controls pill, REC indicator, user PiP
- Ended — "Session complete", lime "View Summary" button

**Success Criteria:**
1. Lobby shows meeting name in Syne Bold on pure black background
2. Active call shows 120px AI circle with pulsing Reanimated lime ring when AI is speaking
3. Controls are in a frosted glass pill (rgba white) at bottom
4. REC indicator shows red dot + "● REC" text top-left
5. User PiP is bottom-right rounded rect
6. Ended state shows "Session complete" with lime "View Summary" button

---

## Phase 7: Tools Screens

**Goal:** All 4 career tool screens redesigned to feel premium and cohesive.

**Requirements:** TOOL-01–04

**Plans:** 4/4 plans complete

Plans:
- [x] 07-01-PLAN.md — Chatbot: lime user bubbles, dark AI bubbles, Reanimated typing dots, dark input bar
- [x] 07-02-PLAN.md — Resume Tools: pill tab switcher, dashed upload, dark Card results
- [x] 07-03-PLAN.md — Questions: dashed upload, lime generate button, numbered question cards
- [x] 07-04-PLAN.md — HR Tools: 2x2 CV upload grid, ranked results with score badges

**Scope:**
- `tools/chatbot.tsx` — lime user bubbles, dark AI bubbles, animated typing dots
- `tools/resume.tsx` — pill tab switcher (Tailor/Cover Letter/Career Chat), dashed upload, results card
- `tools/questions.tsx` — dashed upload area, lime generate button, numbered question cards
- `tools/hr-tools.tsx` — 4-slot CV upload grid, match button, ranked results with score badges

**Success Criteria:**
1. Chatbot user messages right-aligned with lime bg and black text
2. AI messages left-aligned with dark surface bg
3. Typing indicator shows 3 animated dots
4. Resume tool has 3 pill tabs; active tab has lime bg
5. Upload areas have dashed lime border
6. Questions tool generates numbered list; each question is a card row
7. HR tools accepts up to 4 CVs; results show ranked list with score badges
8. Top-ranked CV badge is lime; others are muted

---

## Phase 8: AI Guardrails & Prompt Injection Defense

**Goal:** Two enforcement layers — backend LLM validation blocks off-topic/injection agent instructions on create/edit, and a hybrid system prompt enforces topic scope and graceful injection handling during live calls.
**Depends on:** Phase 7
**Plans:** 2/2 plans complete

Plans:
- [ ] 08-01-PLAN.md — Guardrails validation service (src/lib/guardrails.ts) + wire into agent create/update tRPC procedures
- [ ] 08-02-PLAN.md — Refined in-call hybrid system prompt in webhook handler + inline error display in agents form

## Phase 9: RAG Pipeline

**Goal:** Replace the hardcoded 3-doc knowledge base and naive keyword matching with a proper vector store and semantic search pipeline. Embed documents at startup, retrieve relevant chunks via cosine similarity, and inject them into the chatbot system prompt context for transcript-grounded Ask AI answers.
**Depends on:** Phase 8
**Plans:** 3/3 plans complete

Plans:
- [ ] 09-01-PLAN.md — OpenAI embedding wrapper (embeddings.ts) + in-memory vector store with cosine similarity (vectorStore.ts)
- [ ] 09-02-PLAN.md — Expand KB content + rewrite retrieve.ts with semantic search + inngest transcript embedding step
- [ ] 09-03-PLAN.md — Wire meetingId through /api/chatbot route and chat-ui.tsx to complete the RAG pipeline

### Phase 10: LangChain Agentic Pipeline

**Goal:** Upgrade the Ask AI chatbot with agentic tool use — the agent calls a transcript retrieval tool mid-answer and shows a tool-specific thinking indicator inside the chat bubble before streaming the response.
**Depends on:** Phase 9
**Plans:** 2/2 plans complete

Plans:
- [ ] 10-01-PLAN.md — Backend agent: transcript tool + streamAgentResponse + route.ts toolCall SSE events
- [ ] 10-02-PLAN.md — Frontend UX: toolCall state + per-tool thinking indicator in chat bubble + human verify

### Phase 11: AI Agents and Multi-Agent Framework

**Goal:** Introduce an orchestrator agent that classifies user intent and routes to one of three specialist agents (TranscriptAnalysisAgent, InterviewCoachAgent, ResumeAdvisorAgent), each with dedicated system prompts and tools. The chat UI displays the active agent name in the thinking bubble.
**Depends on:** Phase 10
**Plans:** 3/3 plans complete

Plans:
- [ ] 11-01-PLAN.md — Agent types + registry + three specialist agent implementations
- [ ] 11-02-PLAN.md — Orchestrator with LLM-based routing + wire into agent.ts and route.ts SSE
- [ ] 11-03-PLAN.md — Chat UI agentName SSE handling + active agent display in thinking bubble + human verify

---
*Created: 2026-03-26*
