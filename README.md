# Coachy AI Frontend

[![Version](https://img.shields.io/badge/Version-0.1.0-blue.svg)]()
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)]()
[![Tech Stack](https://img.shields.io/badge/Tech-Vite%20%7C%20TypeScript%20%7C%20TailwindCSS-blue.svg)]()
[![Real-time](https://img.shields.io/badge/Realtime-SSE%20%7C%20WebSocket-success.svg)]()
[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-yellow.svg)]()
[![Hackathon](https://img.shields.io/badge/Hackathon-Build__with__AI-ff69b4.svg)](https://ai.gdgtashkent.uz/hackathon)

## Overview

The Coachy AI Frontend is the React 19 + Vite single-page app that students
use to prepare for the **BMBA Milliy Sertifikat** exams. It pairs a focused
exam-taking environment with an interactive AI coach, an adaptive learning
roadmap, real-time student-vs-student battles, and four-scope leaderboards.

The app talks to the FastAPI backend (see `../backend`) over HTTPS for CRUD,
WebSockets for live battles, and Server-Sent Events for the streaming AI
tutor. A built-in `VITE_USE_MOCK_DATA` toggle lets every page render against
deterministic fixtures, so the UI stays demo-ready even when the backend is
offline.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | **React 19** + **TypeScript 6** |
| Bundler | **Vite 8** (`@` aliased to `src/`) |
| Routing | **react-router-dom 7** |
| Styling | **Tailwind CSS 3** + `tailwindcss-animate` + `tailwind-merge` + `class-variance-authority` |
| Animations | **framer-motion 12** |
| Data fetching | **axios** + **SWR** |
| State | **Zustand 5** + `sessionStorage` (for in-flight exam state) |
| Charts | **Recharts 3** |
| Counters | **react-countup** |
| Toasts | **sonner** |
| Icons | **lucide-react** |
| Lint | **eslint 10** (typescript-eslint, react-hooks, react-refresh) |

## Project Structure

```
frontend/
├── index.html
├── vite.config.ts          @/ alias → src/
├── tailwind.config.ts      Design tokens (ink/bg/border/score-* CSS vars)
├── postcss.config.js
├── tsconfig*.json
└── src/
    ├── main.tsx            React root + I18nProvider
    ├── App.tsx             Route table (Landing / Quick / App shells)
    ├── index.css           Tailwind layers + CSS variables
    ├── pages/              One file per route (~14 screens)
    │   ├── Landing.tsx
    │   ├── QuickExamStart.tsx           Login-less entry into a mock exam
    │   ├── ExamLanding.tsx / ExamActive.tsx
    │   ├── ExamAnalyzing.tsx / ExamResult.tsx
    │   ├── Dashboard.tsx                Per-subject Rasch, ELO, mastery, streak
    │   ├── Roadmap.tsx                  Adaptive weekly milestones
    │   ├── ChatLesson.tsx               Socratic AI tutor (SSE-streamed)
    │   ├── Battle.tsx / BattleMatchmaking.tsx
    │   ├── BattleActive.tsx / BattleResult.tsx
    │   └── Leaderboard.tsx              Global / weekly / regional / school
    ├── components/
    │   ├── app/            AppShell, QuickExamShell, Sidebar, LangSwitcher
    │   ├── exam/           Calculator, FormulaSheet, ScratchPaper, FloatingPanel
    │   └── ui/             CoachMessage, Icon, Primitives (button/card/...)
    ├── hooks/
    │   ├── useExamTimer.ts Countdown w/ 30 / 15 / 5-min warn callbacks
    │   └── useMediaQuery.ts
    └── lib/
        ├── api.ts          Axios client, types, every endpoint + mock fixtures
        ├── examMode.ts     /app/exam ↔ /quick-exam routing helpers
        ├── examState.ts    sessionStorage-backed in-progress exam state
        ├── i18n.tsx        Tri-lingual dictionary (en / ru / uz) + <I18nProvider>
        ├── palette.ts      Per-subject accent colors
        └── utils.ts        cn() class helper
```

## Routing

Two shells are mounted around different feature sets:

| Path | Shell | Screen |
|---|---|---|
| `/` | none | Landing marketing page |
| `/quick-exam/:subject` → `…/active` → `…/analyzing` → `…/result` | `QuickExamShell` | Login-less mock exam flow |
| `/app` | `AppShell` | Dashboard |
| `/app/roadmap` | `AppShell` | Adaptive roadmap |
| `/app/exam` → `…/active` → `…/analyzing` → `…/result` | `AppShell` | Authenticated exam flow |
| `/app/chat` | `AppShell` | AI tutor chat (SSE) |
| `/app/battle` → `…/matchmaking` → `…/active` → `…/result` | `AppShell` | Real-time battles (WS) |
| `/app/leaderboard` | `AppShell` | Four-scope leaderboard |

Anything unknown redirects to `/`.

## Features

- **Login-less Quick Exam** — `/quick-exam/:subject` lets visitors start a
  full mock exam without an account; results auto-grade through the same
  pipeline as authenticated attempts.
- **Focused Exam UI** — Per-question timer (`useExamTimer`) with 30 / 15 /
  5-minute warning callbacks, autosave every 30 s, resume-on-reload via
  `sessionStorage` (`lib/examState.ts`), built-in **Calculator**,
  **Formula Sheet**, and **Scratch Paper** floating panels.
- **AI Coach Chat (SSE)** — Streams Gemini tokens through
  `streamChatMessage()` and progressively renders `token` / `math_inline` /
  `math_block` / `diagram` events.
- **Live Battles (WebSocket)** — `openBattleWebSocket()` opens
  `wss://…/ws/battles/{id}?token=…`, dispatches `answer` / `ping` / `forfeit`
  frames, and renders countdown, opponent progress, per-question results, and
  ELO delta on completion.
- **Adaptive Roadmap** — Weekly milestones with mastery %, status, and
  prerequisite chain; can be regenerated after each exam result.
- **Tri-lingual UI** — `lib/i18n.tsx` ships an English / Russian / Uzbek
  dictionary surfaced via `<LangSwitcher />` in the app shell.
- **Mock-data Mode** — Every `api.ts` function checks `VITE_USE_MOCK_DATA`;
  when `true`, the page renders against the same shapes the backend returns,
  so the build is fully demoable offline.
- **Design System** — CSS-variable-driven Tailwind tokens (`ink`, `bg`,
  `border`, `score-low/mid/high`), display + sans + mono font stacks,
  custom keyframes (`fade-in`, `pulse-ring`).

## Getting Started

### Prerequisites

- **Node.js 18+** (20+ recommended)
- **npm** (or yarn / pnpm)
- A running Coachy AI backend on `http://localhost:8000` — or set
  `VITE_USE_MOCK_DATA=true` to skip the backend entirely.

### Install & run

```bash
npm install
cp .env.example .env          # set VITE_API_BASE_URL (optional)
npm run dev                   # Vite dev server (default :5173)
```

Open <http://localhost:5173>.

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | `tsc -b` type-check, then `vite build` → `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint across the project |

## Configuration

Vite exposes only `VITE_*` env vars to the client. Supported keys:

| Var | Default | Purpose |
|---|---|---|
| `VITE_API_BASE_URL` | `""` (same-origin) | Base URL the axios client points at; also used to build `ws://` and SSE URLs |
| `VITE_USE_MOCK_DATA` | `"false"` | When `"true"`, every API call returns local fixtures — UI works fully offline |

When `VITE_API_BASE_URL` is set, `lib/api.ts` automatically derives the
WebSocket URL by swapping `http`→`ws` / `https`→`wss`.

## Backend Contract

The complete endpoint contract is documented in
[`../backend/API.md`](../backend/API.md). The shapes consumed by each page
are mirrored as TypeScript types in [`src/lib/api.ts`](./src/lib/api.ts) —
`ExamSession`, `ExamSummary`, `BattleSession`, `BattleSummary`,
`LeaderboardRow`, `ChatMessage`, etc. Keep them in sync when the backend
schema evolves.

## Members
- **Muhammad Jabborov** — Backend Engineer
- **Sukhrob Tokhirov** — Frontend Engineer
- **Ali Sultonov** — AI/ML Engineer

## License
Proprietary — bwi-edtech-hackathon.
