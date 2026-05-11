<!-- Workspace-specific custom instructions for Mimi virtual cat project -->

# Mimi Project Development Guidelines

## Project Overview
Mimi is a full-stack Tamagotchi-style virtual cat game for German third-graders (age 8–9). Built with React 18 + SCSS (frontend), Express.js (backend), and TanStack Query v5 for client-server communication. Maximum 5-minute sessions with natural stat decay and autonomous pet behaviors.

## Tech Stack
- **Frontend**: React 18, pure SCSS (BEM naming), TanStack Query v5, Vite
- **Backend**: Express.js (single monolithic server)
- **Testing**: Vitest + React Testing Library
- **Language**: German UI (all labels, buttons, bubbles in German)

## Development Workflow
- Run `npm run dev` from root to start both backend (port 5000) and Vite dev server (port 5173) concurrently
- Backend logic is in `backend/server.js` (in-memory state, localStorage fallback)
- Frontend in `frontend/` with component structure: `src/components/` organized by feature
- All styling uses SCSS with variables (`_variables.scss`) and mixins (`_mixins.scss`)
- No CSS-in-JS libraries; animations are pure SCSS @keyframes

## Key Implementation Details
- Server handles all stat mutations (POST /api/pet/action, POST /api/pet/tick)
- Client polls every 10 seconds via TanStack Query
- localStorage saves snapshot (lastSaved + pet state) for persistence
- 5-min session cap: energy drains 3× faster after 5 mins to force sleep
- All stats clamped 0–100; no countdown visible to user
- Random autonomous behaviors (15–45s intervals) are client-side only
- Sleep screen overlays UI when isAsleep: true

## Code Style
- **Naming**: BEM for CSS classes, camelCase for JS
- **Components**: Functional with hooks, bottom-up build order
- **Testing**: Unit tests for StatsBar, ActionButtons, SpeechBubble, usePet hook, server endpoints
- **No third-party animation libraries** — all @keyframes inline

## Build & Deploy
- `npm run dev` — development server
- `npm run build` — Vite production build (frontend) + backend bundling
- `npm run test` — run Vitest test suite
