# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI workshop demo app: React 19 frontend + Express 5 backend, plus a standalone slide deck (`slides.html`) for an "AI for Developers" workshop presentation.

## Commands

- **Dev (both):** `npm run dev` — runs frontend (Vite, port 5173) and backend (Express, port 3001) concurrently
- **Dev frontend only:** `npm run dev:frontend`
- **Dev backend only:** `npm run dev:backend`
- **Build:** `npm run build` — type-checks then produces production build
- **Lint:** `npm run lint` — uses oxlint (not ESLint)
- **Preview prod build:** `npm run preview`
- **No test framework is configured.**

## Architecture

- **Frontend (`src/`):** React 19 SPA, no router. Uses shadcn/ui (base-nova preset on `@base-ui/react`), Tailwind CSS v4, and Vite.
- **Backend (`server/index.ts`):** Minimal Express 5 server. Port configurable via `SERVER_PORT` env var (default 3001).
- **API proxy:** Vite proxies `/api/*` to `http://localhost:3001` in dev.
- **Path alias:** `@/*` maps to `./src/*` (configured in both vite.config.ts and tsconfig.app.json).

## Styling

- Tailwind CSS v4 — theme is configured entirely in `src/index.css` via `@theme` directives and CSS custom properties (oklch color space), not in a `tailwind.config.js`.
- shadcn/ui components live in `src/components/ui/`. Add new ones via `npx shadcn@latest add <component>`.
- `cn()` utility in `src/lib/utils.ts` (clsx + tailwind-merge).

## TypeScript

Three tsconfig files:
- `tsconfig.app.json` — frontend source
- `tsconfig.server.json` — backend source
- `tsconfig.node.json` — Vite config only

Root `tsconfig.json` references app and node configs. The server config is standalone (used by `tsx` directly).

## Spawnable Agents

- **define-issue** — transforms ideas into well-structured GitHub issues
- **implement-issue** — takes a GitHub issue, implements it, and creates a PR
