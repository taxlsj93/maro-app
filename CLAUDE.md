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

## 에이전트 자동 워크플로우

1. 모든 코드 수정 에이전트(`@ui-brand`, `@gift-data`, `@content-seo`)는 작업 완료 후 자동으로 `@qa-review`를 호출한다.
2. `@qa-review`가 BLOCKER 없이 통과하면 자동으로 `@deploy-test`가 커밋+푸시한다.
3. `@qa-review`가 BLOCKER를 발견하면 수정한 에이전트가 자동으로 수정 후 재검토 받는다.
4. `@marketing`과 `@content-seo`가 콘텐츠를 만들면 `@planner`가 브랜드 톤 일관성을 확인한다.
5. 모든 에이전트는 작업 완료 시 `CHANGELOG.md`에 아래 형식으로 기록한다:

```markdown
## YYYY-MM-DD
- **[에이전트명]** 변경 파일: `file1`, `file2` — 작업 요약
```

6. 커밋 메시지는 한국어로 작성한다.
7. 모든 에이전트는 커밋 완료 후 반드시 `SYNC.md`에 아래 형식으로 추가(append)한다 (덮어쓰기 금지):

```markdown
### [YYYY-MM-DD HH:MM] @에이전트명
- 커밋: `해시 7자리`
- 변경: `file1`, `file2`, ...
- 요약: 작업 내용 한 줄 설명
```

8. 작업 진행 시 Notion 마로 대시보드(`page_id: 33edf765-9901-81d1-b54c-d4b1e640c1ed`)를 자동으로 업데이트한다.
9. Notion 업데이트 실패 시 CHANGELOG.md와 SYNC.md에 반드시 기록한다. 선재가 claude.ai에서 수동 반영한다.
10. `@deploy-test`는 배포 후 Vercel MCP를 통해 배포 상태를 확인하고, 실패 시 자동으로 롤백한다.

## 에이전트 역할 경계

- **`@ui-brand`**: HTML/CSS/JS **코드 수정** 전담. 디자인 토큰 적용, 컴포넌트 스타일링, 반응형 구현, 브랜드 일관성 유지.
- **`@marketing`**: **비주얼 콘텐츠 기획** 전담. 인스타 카드 기획/카피 작성, 캠페인 전략, 해시태그 선정. 코드 수정은 하지 않음.
- 비주얼 콘텐츠 제작 흐름: `@marketing`(기획/카피) → `@ui-brand`(HTML/CSS 구현) → 결과물 PNG 캡처.
- **`@backend-api`**: API 프록시, 서버 사이드 로직만 담당. 프론트엔드 코드는 `@gift-data` 또는 `@ui-brand`가 수정.
- **`@content-seo`**: 블로그 글 작성 + 메타태그 최적화. 블로그 코드 구조(`blog.html`)는 `@ui-brand`가 수정.

## 상호 검증 체계

### 위계질서
- Tier 1 (의사결정): @planner — 전략/방향 최종 판단
- Tier 2 (품질관리): @qa-review — 모든 코드/콘텐츠 배포 전 검증
- Tier 3 (실행): @ui-brand, @gift-data, @marketing, @content-seo, @backend-api — 각 전문 영역 실행
- Tier 4 (배포): @deploy-test — 커밋/푸시/배포만 담당
- Tier 5 (분석): @analytics — 결과 측정/리포트

### 크로스체크 규칙
1. 코드 수정 후 반드시 @qa-review가 검증. BLOCKER 있으면 배포 불가.
2. @gift-data가 AI 프롬프트 수정 시 → @backend-api가 Edge Function 호환성 확인
3. @marketing이 카피 작성 시 → @planner가 브랜드 톤 확인
4. @content-seo가 SEO 수정 시 → @qa-review가 메타태그 무결성 확인
5. @backend-api가 API 수정 시 → @deploy-test가 배포 후 상태코드 확인 + @qa-review가 프론트엔드 연동 확인

### 주간 시스템 점검 (매주 토요일)
@qa-review가 다음을 자동 실행:
1. 전체 페이지 HTTP 상태코드 확인
2. API 엔드포인트 정상 응답 확인
3. Console 에러 유무 확인
4. CHANGELOG.md와 실제 코드 일치 여부
5. 결과를 SYSTEM-CHECK.md에 기록

### 에러 에스컬레이션
- WARNING: 해당 에이전트가 자체 수정
- BLOCKER: @qa-review가 원인 분석 → 해당 에이전트에 수정 지시
- CRITICAL: @planner가 개입하여 전략적 판단
