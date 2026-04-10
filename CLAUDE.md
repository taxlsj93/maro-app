# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MARO (마로 — "마음을 새기는 선물") is a Korean-language gift recommendation web app. Users select a relationship type, occasion, budget, and interests to receive curated gift suggestions. Built with React 18 + Vite 4, deployed as static files on Vercel.

## Commands

```bash
npm run dev      # Start Vite dev server
npm run build    # Production build (vite build)
npm run preview  # Preview production build locally
```

No test framework or linter is configured.

## Architecture

**Single-component app**: Nearly all application logic lives in `maro-app.jsx` — the main React component containing the multi-step wizard UI, all data constants (relations, occasions, budgets, tags, fallback gift database), and inline styles.

**Multi-page static site**: Each feature has its own HTML entry point. Vercel rewrites map clean URLs to HTML files:
- `/` → `index.html` (landing page)
- `/app` → `app.html` (gift recommendation wizard — mounts `maro-app.jsx` via `main.jsx`)
- `/today` → `today-pick.html` (daily featured pick)
- `/message` → `message.html` (shareable message card creator)
- `/calc` → `calc.html` (gift cost split calculator)
- `/vote` → `vote.html` (community voting)

Only the `/app` route uses the React/Vite build. Other pages are standalone HTML with inline JS/CSS.

## Key Data Structures (in maro-app.jsx)

- **RELATIONS** — 8 relationship types with depth variations
- **OCCASIONS** — 11 gift-giving occasions
- **BUDGETS** — 5 price tiers (₩2만 to ₩20만+)
- **TAGS** — 20+ lifestyle interest categories
- **FB** — Fallback gift database keyed by relation×budget
- **VIS** — Visual styling (colors/emojis) for ~100 gift categories
- **IMG** — Unsplash image URLs for gift category thumbnails

## External Integrations

- **Coupang Affiliate** (PARTNER_ID: `AF3339921`) — product recommendation links
- **Toss / Kakao Pay** — deep links in the split calculator
- **Unsplash** — category images
- **Google Fonts** — Gowun Batang (serif) + Noto Sans KR (sans-serif)

## Deployment

- **Platform**: Vercel (static hosting, no backend)
- **Output directory**: `.` (root)
- **Build command**: empty in vercel.json (Vite build runs via npm)
- **Domain**: maro.ai.kr

## Styling

All styles are inline CSS objects within React components. Design uses a warm cream/terra palette (`#c4756e` primary, cream gradients background, brown text shades) with glassmorphic card effects.

## Agent Rules

모든 에이전트는 작업 완료 시 `CHANGELOG.md`에 아래 형식으로 기록한다:

```markdown
## YYYY-MM-DD
- **[에이전트명]** 변경 파일: `file1`, `file2` — 작업 요약
```
