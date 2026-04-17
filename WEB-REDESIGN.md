# APEX — Web UI Redesign Brief

## Overview

This document defines the full UI/UX redesign for the **folio-interns** Next.js web app, aligning it with the APEX mobile app aesthetic defined in `UI-REDESIGN.md`.

**Goal:** The web app should look and feel like the same product as the mobile app — same brand, same palette, same typography system, same feature set. No features are added or removed. Only the UI layer changes.

**Stack:** Next.js 15 · Tailwind CSS v4 · shadcn/ui · TypeScript

---

## Brand Identity

| Property | Value |
|----------|-------|
| App Name | **APEX** |
| Tagline | *Ace every interview.* |
| Aesthetic | Dark editorial + electric lime — Spotify Wrapped × Linear.app |
| Voice | Confident, minimal, screenshot-worthy |

---

## Design Tokens

Replace the current `globals.css` CSS variables with the APEX token set below. These mirror the mobile `lib/theme.ts` mapped to CSS custom properties.

```css
/* globals.css — APEX token overrides */
:root {
  /* Core surfaces */
  --background:       #0A0A0A;   /* page bg — true black */
  --surface:          #141414;   /* cards, panels */
  --card:             #1E1E1E;   /* elevated cards */
  --border:           #2A2A2A;   /* all borders/dividers */

  /* Brand accent */
  --accent:           #CAFF02;   /* electric lime — CTAs, active states */
  --accent-dark:      #A8D900;   /* pressed/hover state for accent */
  --accent-fg:        #000000;   /* text on lime backgrounds */

  /* Text */
  --foreground:       #F5F5F5;   /* primary text */
  --muted-foreground: #6B6B6B;   /* secondary/helper text */

  /* Semantic */
  --destructive:      #FF4444;
  --warning:          #FBBF24;
  --success:          #34D399;
  --processing:       #818CF8;

  /* Sidebar */
  --sidebar:          #0F0F0F;
  --sidebar-border:   #1E1E1E;
  --sidebar-fg:       #F5F5F5;
  --sidebar-accent:   #1A1A1A;   /* hover/active bg in sidebar */

  /* Radius */
  --radius: 0.75rem;             /* 12px — matches mobile rounded-2xl */
}
```

> **Rule:** Never use raw hex values in component files. Always reference a CSS variable or a Tailwind token mapped to one of the above.

---

## Typography

### Fonts to Load

Add via `next/font/google` in `app/layout.tsx`:

```ts
import { Syne, Plus_Jakarta_Sans } from 'next/font/google';

const syne = Syne({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-display',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
});
```

Apply via `<html className={`${syne.variable} ${plusJakartaSans.variable}`}>`.

### Usage Rules

| Role | Font | Weight | Size |
|------|------|--------|------|
| Page titles / screen headers | Syne | 700 | 28–36px |
| Hero numbers / large stats | Syne | 700 | 40–56px |
| Card titles | Plus Jakarta Sans | 700 | 16–18px |
| Body text | Plus Jakarta Sans | 400 | 14–15px |
| Labels / captions / meta | Plus Jakarta Sans | 500 | 11–13px |
| Buttons (primary) | Syne | 700 | 14px |
| Buttons (secondary) | Plus Jakarta Sans | 600 | 14px |

### CSS Variables

```css
--font-display: var(--font-syne);
--font-body:    var(--font-plus-jakarta-sans);
```

---

## Layout System

### Sidebar Navigation

The sidebar is the primary navigation container on web (replaces mobile bottom tabs). Keep the existing `DashboardSidebar` + `SidebarProvider` structure but restyle it:

- **Width:** 240px (collapsed: 64px icon-only)
- **Background:** `var(--sidebar)` = `#0F0F0F`
- **Border right:** 1px `var(--sidebar-border)` = `#1E1E1E`
- **Logo/wordmark:** "APEX" in Syne Bold 22px, white; replace current "CareerGuru" text
- **Active item:** `background: #1A1A1A`, left 3px lime bar `var(--accent)`, text white
- **Hover item:** `background: rgba(202,255,2,0.05)` transition 150ms
- **Nav icons:** Lucide, 20px, muted on inactive / white on active
- **Footer:** User avatar + name + sign-out button — separated by `var(--border)`

### Page Content Area

- **Background:** `var(--background)` = `#0A0A0A`
- **Max content width:** `max-w-7xl mx-auto` inside `px-6 py-6`
- **Top navbar:** 64px height, `background: var(--background)`, bottom border `var(--border)`, shows breadcrumb + user button

### Breakpoints (mobile-first)

| Breakpoint | Width | Layout change |
|------------|-------|---------------|
| `sm` | 640px | Sidebar hidden → hamburger menu |
| `md` | 768px | Sidebar visible (icon-only collapsed) |
| `lg` | 1024px | Sidebar fully expanded (labels visible) |
| `xl` | 1280px | Content area wider, 2–3 column grids |

---

## Component Redesign Spec

### Reusable UI Primitives

These override the current shadcn defaults to match APEX tokens.

#### Button

```
primary:   bg-[#CAFF02] text-black font-[Syne] font-bold hover:bg-[#A8D900]
           active:scale-[0.97] transition-all duration-150
secondary: bg-[#1E1E1E] text-[#F5F5F5] border border-[#2A2A2A]
           hover:border-[#CAFF02]/30 hover:bg-[#252525]
danger:    bg-[#FF4444] text-white hover:bg-[#cc3636]
ghost:     bg-transparent text-[#CAFF02] hover:bg-[#CAFF02]/10
```

Sizes: `sm = h-8 px-3 text-sm` · `md = h-10 px-4 text-sm` · `lg = h-12 px-6 text-base`

#### Input / Textarea

```
bg-[#141414] border border-[#2A2A2A] text-[#F5F5F5]
placeholder:text-[#6B6B6B] rounded-xl
focus:border-[#CAFF02] focus:ring-1 focus:ring-[#CAFF02]/30
transition-colors duration-150
```

Label: Plus Jakarta Sans 13px `#F5F5F5`, displayed above input
Error text: 12px `#FF4444` below input

#### Card

```
bg-[#141414] rounded-2xl border border-[#2A2A2A] p-6
```

Variant `accentBorder`: adds `border-l-2 border-l-[#CAFF02]`

#### Badge (status)

No pill background — just a colored dot + text inline:

```
• UPCOMING   → dot #CAFF02  text #CAFF02
• ACTIVE     → dot #34D399  text #34D399
• PROCESSING → dot #818CF8  text #818CF8
• COMPLETED  → dot #34D399  text muted-foreground
• CANCELLED  → dot #FF4444  text #FF4444
```

---

## Page-by-Page Redesign Spec

---

### 1. Sign In (`/sign-in`)

**Current:** Generic split card with light theme, photo on right.
**Target:** Full-page dark, matches mobile sign-in.

**Layout:**
- `min-h-screen bg-[#0A0A0A] flex`
- Left panel (60%): centered form vertically + horizontally
- Right panel (40%): full-bleed background image with a `linear-gradient(to right, #0A0A0A 0%, transparent 40%)` overlay bleeding into the form side

**Form content:**
- Top: "APEX" wordmark (Syne Bold 20px, white), centered
- Heading: "Welcome back." — Syne Bold 40px, white
- Sub: "Sign in to continue." — Plus Jakarta Sans 14px, muted
- Email + Password inputs (styled per token spec above)
- Password show/hide toggle (existing behavior — keep)
- Forgot password link: small, `color: var(--accent)`, right-aligned
- Primary button: full-width lime "Sign in"
- Divider: "Or continue with" — muted center text
- Social buttons (GitHub, Google): `secondary` variant, icon + label
- "Don't have an account? Sign up" — muted + lime tappable link

**Responsive:** Stack to single column on mobile; right panel hidden on `< md`

---

### 2. Sign Up (`/sign-up`)

Mirror of sign-in with:
- Heading: "Let's get you hired."
- Fields: Name, Email, Password
- Same button + social layout

---

### 3. Overview / Dashboard (`/overview`)

**Current:** Generic light cards, "Welcome back!" heading, stats grid, quick actions, recent activity.
**Target:** Dark APEX editorial, matches mobile dashboard closely but wider.

**Header row:**
- Left: greeting label "Good morning, [Name]" — Plus Jakarta Sans 13px muted
- Below: "Overview" — Syne Bold 32px white

**Hero card:**
- Full-width card, `bg-[#141414]`, `border border-[#CAFF02]/20`, rounded-2xl
- Left: "APEX INTERVIEWS" uppercase tracking label (muted 10px), bold headline "Ace your next interview.", sub text muted, lime pill CTA "Start Now →"
- Right: decorative lime circle with "AI" Syne Bold inside
- On desktop, this sits below the header and spans full content width

**Stats grid:**
- 4 equal columns on `lg`, 2×2 on `md`, stacked on mobile
- Each card: `bg-[#141414]` rounded-xl, giant number top-left (Syne Bold 48px with status color), icon top-right in tinted circle, label below
  - Total Meetings → lime `#CAFF02`
  - Upcoming → amber `#FBBF24`
  - Completed → green `#34D399`
  - AI Agents → purple `#818CF8`

**Quick Actions card:**
- Section label: uppercase tracking muted 11px "QUICK ACTIONS"
- 3 buttons inline: "Create Meeting" (primary lime), "Manage Agents" (secondary), "View All Meetings" (secondary)
- Keep "Take Tour" button (secondary ghost)

**Recent Activity:**
- Section label: uppercase muted "RECENT ACTIVITY" + "See all →" link in lime right-aligned
- Each activity item: dark card `bg-[#141414]` rounded-xl, avatar circle (initial letter, tinted with status color), title bold, description muted, time right-aligned
- Empty state: centered muted text + 2 CTA buttons

---

### 4. Meetings List (`/meetings`)

**Current:** Data table with generic columns.
**Target:** Status-bar list layout, consistent with mobile meetings screen.

**Header row:**
- "MEETINGS" — Syne Bold 28px tracking-widest
- Right: lime "+ New Meeting" button

**Filter chips row:**
- Pill chips: All · Upcoming · Active · Processing · Completed · Cancelled
- Inactive: `bg-[#141414] border border-[#2A2A2A]` text muted
- Active: `bg-[#CAFF02]` text black, Syne Bold

**Meetings list (replacing data table):**

Each row is a card row:
```
[4px colored status bar] | [info] | [date + actions]
```
- Left: 4px vertical bar color-coded by status (same colors as badge spec)
- Center: Meeting name (Plus Jakarta Sans Bold 16px white) + Agent name (muted 13px)
- Right: date muted 12px + edit (pencil) + delete (trash) icon buttons
- `bg-[#141414]` row, `border-b border-[#2A2A2A]` separator, hover `bg-[#1E1E1E]` transition
- Clicking row → `/meetings/[id]`

**Pagination:** Keep existing `DataPagination` component, restyle with dark tokens.

**Empty state:**
- Centered, muted text "No meetings yet.", lime "Create your first meeting" primary button below.

**New Meeting Dialog:**
- Keep existing `NewMeetingDialog` structure
- Restyle: `bg-[#141414]` dialog, lime "Create" button, dark inputs

---

### 5. Meeting Detail (`/meetings/[id]`)

**Current:** Multiple state components (upcoming, active, processing, completed, cancelled).
**Target:** Match mobile detail screen exactly, adapted for wider layout.

**Header:**
- Back chevron (lime) + meeting name (Syne Bold 24px) truncated
- Right: edit + delete icon buttons
- Status badge: colored dot + text (no pill bg)

**UPCOMING state:**
- Hero card: meeting name, agent name, date/time, lime "Join Interview" full-width button

**ACTIVE state:**
- Green pulsing dot indicator, "In Progress" label
- Lime "Rejoin" button

**PROCESSING state:**
- Lime spinner + "Generating your AI debrief…" copy in muted
- Keep polling behavior intact

**COMPLETED state:**
- "AI Summary" card: `bg-[#141414]`, 2px lime top border, Markdown rendered inside with custom prose styling (all text `#F5F5F5`, headings Syne Bold, code blocks `bg-[#0A0A0A]`)
- "Transcript" section below summary:
  - Each turn: agent name in lime uppercase 11px / user in muted uppercase 11px, message text Plus Jakarta Sans 14px
  - Alternating row backgrounds: transparent / `bg-[#0F0F0F]`
  - On desktop: max-width constrained to ~720px, centered

**CANCELLED state:**
- Red dot badge, muted copy, "Create new meeting" ghost button

---

### 6. Agents List (`/agents`)

**Current:** Data table with columns.
**Target:** 2-column card grid (matches mobile agents screen).

**Header row:**
- "AGENTS" — Syne Bold 28px tracking-widest
- Right: lime "+ New Agent" button

**Search bar:**
- Full-width `bg-[#141414]` input, magnifier icon left, lime focus border
- Positioned above the grid

**Agent grid:**
- `grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4`
- Each agent card:
  - Large initial letter circle: 60px, `bg-[#1E1E1E]`, Syne Bold 32px lime letter
  - Agent name below: Plus Jakarta Sans Bold 16px
  - Meeting count badge: muted small pill
  - Click → `/agents/[id]`
- "New Agent" card (last): dashed `#2A2A2A` border, lime `+` center, "New Agent" muted below — opens `NewAgentDialog`

---

### 7. Agent Detail (`/agents/[id]`)

**Current:** Form layout with generic cards.
**Target:** Match mobile agent detail, wider layout.

**Hero section:**
- 80px initial circle (lime bg, black Syne Bold 40px letter)
- Agent name: Syne Bold 36px right of circle
- Subtitle: "AI Interview Agent" muted
- Top-right: Edit + Delete icon buttons

**Instructions card:**
- Section label "INSTRUCTIONS" uppercase muted 11px
- `bg-[#141414]` card, full text, Plus Jakarta Sans 14px, line-height 1.6
- Edit pencil button top-right of card

**Start Interview section:**
- Lime full-width "Start Interview" button → creates / navigates to meeting

**Recent Meetings mini-list:**
- Section label "RECENT MEETINGS"
- Compact rows: meeting name + date + status badge, max 5, "See all" lime link

---

### 8. Call Screen (`/call/[meetingId]`)

The call screen uses a dedicated layout (`/call/layout.tsx`) — full screen, no sidebar.

**Lobby state:**
- `bg-[#000000]` full screen
- Center: meeting name Syne Bold 24px, "Ready to begin?" muted
- Camera / mic permission status indicators (colored dots)
- Lime "Join Interview" button full-width, centered

**Active Call state:**
- `bg-[#000000]` full screen
- Center column: AI participant circle (120px), pulsing lime ring when AI speaking (CSS `animate-ping` on ring layer), "AI Interviewer" label, "Listening..." / "Speaking..." muted
- User PiP: bottom-right rounded rect, `aspect-[9/16]` constrained
- Controls bar: frosted glass pill `rgba(255,255,255,0.08)` backdrop-blur, at bottom — mic toggle, hang-up (red circle), camera toggle
- Top-left: `● REC` in red + "Transcribing" muted label

**Ended state:**
- "Session complete" Syne Bold 32px, center
- Sub: "Your AI debrief is being generated."
- Lime "View Summary" button → `/meetings/[id]`

---

### 9. Resume Assistant (`/my-resumes`)

**Current:** Resume matching component, file upload, job description input.
**Target:** Same feature set, APEX dark styling.

**Header:**
- "RESUME ASSISTANT" Syne Bold 28px
- Sub: muted description

**Tab switcher:**
- Pill tabs: "Tailor CV" · "Cover Letter" · "Career Chat"
- Active: `bg-[#CAFF02]` black Syne Bold text; inactive: `bg-[#141414]` border `#2A2A2A`

**Each tab:**
- File upload zone: dashed `#2A2A2A` border, rounded-2xl, hover `border-[#CAFF02]/50`, document icon + "Upload your CV" muted text, lime "Browse" button
- Job description textarea: dark input, lime focus
- Lime submit button full-width

**Results card:**
- `bg-[#141414]` with 2px lime top border, scrollable, Markdown prose dark styling

---

### 10. HR Tools (`/hr-tools`)

**Current:** Resume matching component (up to 4 CVs).
**Target:** Same feature, APEX styling.

**Header:**
- "HR TOOLS" Syne Bold 28px
- Sub: "Screen candidates and match resumes to job descriptions"

**CV upload grid:**
- 2×2 grid of upload cards (`bg-[#141414]`, dashed border, rounded-2xl)
- Each: upload icon + "CV [1–4]" label + remove × button when filled
- Drop zone highlight on hover: `border-[#CAFF02]/50`

**Job description:**
- Full-width textarea, dark input

**"Match Candidates" button:**
- Lime full-width

**Results:**
- Ranked list cards: rank number (Syne Bold, lime for #1, muted for others), candidate name, score bar (lime fill on `#2A2A2A` track), score percentage badge

---

### 11. Chatbot (`/chatbot`)

**Current:** Basic chat layout.
**Target:** Match mobile chatbot screen.

**Header:**
- "CHAT" Syne Bold 24px, back-style breadcrumb

**Messages area:**
- Full height minus header + input bar
- User messages: right-aligned, `bg-[#CAFF02]` text black, rounded-2xl, max-w-[70%]
- AI messages: left-aligned, `bg-[#1E1E1E]` text white, rounded-2xl, max-w-[70%]
- Typing indicator: 3 animated dots in `bg-[#1E1E1E]` pill

**Input bar:**
- `bg-[#141414]` sticky bottom, textarea with auto-resize, lime send button (arrow icon)

---

### 12. Question Generator (`/questions`)

**Current:** File upload + role input.
**Target:** Same, APEX styled.

**Layout:**
- Upload zone: dashed lime-tinted border when focused, document icon, "Upload your CV"
- Role input: dark input with label
- "Generate Questions" lime full-width button

**Results:**
- Numbered list, each question as a card row: `bg-[#141414]`, number in lime Syne Bold, question text Plus Jakarta Sans 15px
- Copy icon per question (secondary ghost button)

---

### 13. Coding Assessment (`/coding-assessment`)

**Current:** Monaco editor + problem panel, multi-panel layout.
**Target:** Same feature set, APEX dark styling only.

**Panels:**
- Problem panel: `bg-[#0F0F0F]`, problem title Syne Bold 18px, description Plus Jakarta Sans 14px
- Editor panel: Monaco dark theme (`vs-dark`) with `background: #0A0A0A`, lime cursor/selection color
- Output/results panel: `bg-[#0F0F0F]`, success text green `#34D399`, error red `#FF4444`
- Language selector: dark dropdown, lime active state
- "Run" button: secondary style; "Submit" button: lime primary

---

### 14. Settings (`/settings`)

**Current:** Profile form with card layout.
**Target:** APEX settings screen.

**Header:**
- "SETTINGS" Syne Bold 28px tracking-widest

**Sections** (with uppercase muted 11px section labels):
- **Profile:** Name input + avatar upload, "Save Changes" lime button
- **Account:** Email (read-only), password change
- **Danger Zone:** "Sign Out" row — red text, separated from other rows visually

**Row style:**
- `bg-[#141414]` row, `border-b border-[#2A2A2A]`, label left, value/chevron right
- Hover: `bg-[#1A1A1A]`

**Version number:**
- Muted small text at very bottom of page

---

## Navigation Structure (Sidebar)

Match all sidebar items to mobile bottom tabs + tools:

```
APEX (wordmark)
────────────────
Overview            ← HomeIcon
Meetings            ← VideoIcon
Agents              ← BotIcon

────────────────
Resume Assistant    ← UserIcon
HR Tools            ← UsersIcon
Chatbot             ← MessageSquareIcon
Question Generator  ← HelpCircleIcon
Coding Assessment   ← CodeIcon

────────────────
API Docs            ← BookIcon  (external)
Postman Collection  ← CodeIcon  (external)
────────────────
[User avatar + name]
[Sign Out]
```

Active item indicator: 3px left border `var(--accent)`, `bg-[#1A1A1A]`, text white.

---

## Animations & Transitions

| Interaction | Duration | Easing | Notes |
|-------------|----------|--------|-------|
| Button hover/press | 150ms | ease-out | Color + scale(0.97) on press |
| Page transitions | 200ms | ease-out | Fade via Next.js `<AnimatePresence>` if using Framer |
| Sidebar collapse | 200ms | ease-in-out | Width interpolation |
| Skeleton loading | — | — | `animate-pulse` on `bg-[#1E1E1E]` shapes |
| Active pulsing ring (call) | 1500ms | ease-in-out | CSS `animate-ping` on lime ring layer |
| Spinner (processing) | 600ms | linear | `animate-spin` on lime SVG spinner |
| Filter chip switch | 150ms | ease | Color + background transition |
| Toast | 3–5s | — | Auto-dismiss, position bottom-right |

All animations must respect `prefers-reduced-motion` — use `motion-safe:` Tailwind variant.

---

## UX Guidelines (from ui-ux-pro-max analysis)

### Accessibility
- All interactive elements: minimum `44×44px` click target
- Focus rings: 2px `ring-[#CAFF02]/60` on all focusable elements
- Color is never the only meaning indicator — status badges include text label alongside dot
- Skip-to-main-content link at top of every page
- All images have `alt` text; icon-only buttons have `aria-label`

### Forms
- Every input has a visible label above (not placeholder-only)
- Errors displayed below the relevant field in red, not only at top
- Submit buttons show loading spinner during async, disabled state
- Confirmation dialogs before destructive actions (delete meeting, delete agent)
- Toast notifications: success (green), error (red), 4s auto-dismiss

### Navigation
- Breadcrumbs for 3+ level deep pages (e.g. Meeting Detail)
- Back button in `MeetingIdViewHeader` and `AgentIdViewHeader` is always predictable
- Sidebar active state stays correct on browser back/forward navigation
- Search bars: immediate filter on input with 300ms debounce

### Performance
- Skeleton loaders (`HomeViewLoading`, `AgentsViewLoading`, etc.) already exist — style them with APEX dark tokens (`bg-[#1E1E1E] animate-pulse`)
- No horizontal scroll at any breakpoint
- Images: use `next/image` with `width`/`height` to prevent CLS

---

## Implementation Order

### Phase 1 — Design Tokens + Typography
1. Update `globals.css` with APEX CSS variables
2. Install `Syne` + `Plus Jakarta Sans` via `next/font/google` in `app/layout.tsx`
3. Update `tailwind.config` to expose `font-display` + `font-body` utilities
4. Update shadcn component overrides: Button, Input, Card, Badge

### Phase 2 — Sidebar + Layout Shell
1. Restyle `DashboardSidebar`: wordmark "APEX", APEX nav colors, active state indicator
2. Restyle `DashboardNavbar`: dark bg, breadcrumb, user button
3. Update `(dashboard)/layout.tsx` background to `#0A0A0A`

### Phase 3 — Auth Screens
1. Redesign `sign-in-view.tsx` — full dark split layout
2. Redesign `sign-up-view.tsx` — mirror sign-in

### Phase 4 — Dashboard + Overview
1. Redesign `home-view.tsx` — hero card, colored stats grid, dark activity list

### Phase 5 — Meetings
1. Redesign `meetings-view.tsx` — filter chips + status-bar list (replace DataTable)
2. Redesign all meeting state components (upcoming, active, processing, completed, cancelled)
3. Restyle `meeting-id-view-header.tsx`

### Phase 6 — Agents
1. Redesign `agents-view.tsx` — 2–4 column card grid (replace DataTable)
2. Redesign `agent-id-view.tsx` — hero circle, instructions card

### Phase 7 — Call Screen
1. Restyle `call-lobby.tsx`, `call-active.tsx`, `call-ended.tsx`
2. Add pulsing lime ring for AI speaking state (CSS animation)

### Phase 8 — Tools
1. Redesign `resume-assistant-view.tsx` — tab switcher + upload zones
2. Redesign `hr-tools-view.tsx` — CV grid + results
3. Redesign chatbot view — message bubbles + input bar
4. Redesign `question-generator-view.tsx` — upload + numbered results
5. Restyle `coding-assessment-view.tsx` — Monaco dark theme + APEX panel headers

### Phase 9 — Settings
1. Redesign `settings-view.tsx` — section rows, danger zone

---

## Key Constraints

- **No backend changes** — all API calls, tRPC procedures, data models stay identical
- **No new routes** — all existing routes are preserved, no new pages added
- **Tailwind only** — no inline `style={{}}` unless absolutely necessary (e.g. dynamic values)
- **shadcn components stay** — just override their CSS variable values via tokens
- **Feature parity with mobile** — every feature the mobile app has must be present in the web app at the equivalent page
- **Dark only** — no light mode toggle; the app is OLED dark by design
- **Lucide icons** — already used; keep consistent 20px stroke icons throughout
