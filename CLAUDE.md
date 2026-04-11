# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 최상위 목표 (북극성)
> **사람들에게 적합한 선물을 추천하고, 그에 따른 수익을 얻는다.**

## 기본 원칙
> **모든 작업은 에이전트가 자동 수행하되, 의사결정이 필요한 사항은 반드시 선재에게 질문한다.**

## Project Overview

MARO (마로 — "마음을 새기는 선물") is a Korean-language gift recommendation web app. Users select a relationship type, occasion, budget, and interests to receive curated gift suggestions. Built with React 18 + Vite 4, deployed as static files on Vercel.

- **포지셔닝 (절충)**: 감성 브랜드 + 실용 가치. "마음을 새기는 선물"(슬로건 유지) + "3분 만에 딱 맞는 선물 찾기"(실용 훅). 감성으로 끌어들이고, 실용으로 전환시킨다.
  - 대외 카피: 감성 우선 ("마음을 새기는 선물", "어떤 마음을 전할지부터")
  - 기능 설명: 실용 강조 ("3분 AI 추천", "관계×상황×예산 = Top 3", "바로 구매 가능")
  - 콘텐츠 밸런스: 감성 60% + 실용 40%
- **타겟**: 20대 여성 (1차) → 사회생활을 하는 모든 사람 (확장)
- **수익 모델**: 쿠팡 파트너스 제휴 (PARTNER_ID: AF3339921)

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
- `/app` → `app.html` (gift recommendation wizard)
- `/today` → `today-pick.html` (daily featured pick)
- `/message` → `message.html` (shareable message card creator)
- `/calc` → `calc.html` (gift cost split calculator)
- `/vote` → `vote.html` (community voting — 준비 중)

**중요: `/app` 라우트의 실제 프로덕션 코드는 `app.html` 내부 인라인 `<script type="text/babel">`입니다.** `maro-app.jsx`는 Vite 빌드용이지만 프로덕션에서 사용되지 않습니다. **앱 기능 수정 시 반드시 `app.html`을 수정하세요.** maro-app.jsx는 참조/백업용입니다.

## Key Data Structures (in app.html)

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
- **Pretendard Variable** — CDN: `cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css`
  - font-family: `'Pretendard Variable', 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', sans-serif`
  - Weight: 브랜드명 700, 제목 600, 버튼 500, 본문 400, 보조 300

## Deployment

- **Platform**: Vercel (static hosting, no backend)
- **Output directory**: `.` (root)
- **Build command**: empty in vercel.json (Vite build runs via npm)
- **Domain**: maro.ai.kr

## 마케팅 전략 (2트랙)

### Track A — 시즌 단기 (즉시 매출)
- 목표: 시즌 검색 트래픽 → 쿠팡 전환
- 대상 시즌: 어린이날(5/5), 어버이날(5/8), 스승의날(5/15) 등
- 실행: 시즌 3주 전부터 관련 콘텐츠 집중, 시즌 배너 교체, 블로그 SEO

### Track B — 20대 여성 브랜드 빌딩 (중기)
- 목표: "선물 고민 = 마로" 인식 확보
- 채널: Threads/인스타 (빌딩로그 + 감성 콘텐츠)
- KPI: 팔로워, 프로필 방문, 저장/공유 수

### 시즌 캘린더

| 시기 | 이벤트 | 콘텐츠 시작 |
|------|--------|------------|
| 5월 초 | 어린이날(5/5) · 어버이날(5/8) | **3주 전** |
| 5월 중 | 스승의날(5/15) | 2주 전 |
| 6~7월 | 졸업/여름 | 4주 전 |
| 9월 | 추석 | 3주 전 |
| 11월 | 빼빼로데이(11/11) · 수능 | 2주 전 |
| 12월 | 크리스마스 | 4주 전 |
| 2월 | 발렌타인 | 3주 전 |
| 3월 | 화이트데이 | 2주 전 |

### 인스타/Threads 광고 전략
- 예산: **월 3만원** (시즌 버스트 방식)
- 시즌 집중: 일 2,500원 × 6일 = 15,000원/시즌
- 부스트 대상: 저장/공유 수가 높은 오가닉 콘텐츠 1개
- 타겟: 25~35세, 관심사 "선물/기념일/가족"

## Styling

All styles are inline CSS objects within React components. **상세 디자인 원칙은 `MARO_UI_BRAND_GUIDE.md` 참조** (학술 근거 기반 색채/타이포/모바일/접근성/디자인 토큰 가이드).

핵심: 1차 CTA `#2B7A78`(딥 틸), `#c4756e`는 본문 텍스트 금지(≥24px만), 터치 타깃 ≥48px, 한글 line-height 1.75, transform/opacity만 애니메이션.

**폰트**: Pretendard Variable (Gowun Batang 사용 금지). 모든 HTML 파일에서 Gowun Batang 참조가 남아있으면 Pretendard로 교체할 것.

## 에이전트 자동 워크플로우

1. 모든 코드 수정 에이전트(`@ui-brand`, `@gift-data`, `@content-growth`)는 작업 완료 후 자동으로 `@qa-review`를 호출한다.
2. `@qa-review`가 BLOCKER 없이 통과하면 자동으로 `@deploy-test`가 커밋+푸시한다.
3. `@qa-review`가 BLOCKER를 발견하면 수정한 에이전트가 자동으로 수정 후 재검토 받는다.
4. `@content-growth`가 콘텐츠를 만들면 `@planner`가 브랜드 톤 일관성을 확인한다.
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

## 팀 R/R (역할과 책임)

### 전략기획팀 (`@planner`)
- ✅ 마케팅 2트랙 전략 수립/수정, 광고 예산 배분, 사업 방향
- ✅ 에이전트 간 과제 분배, 데이터 분석/리포트
- ❌ 콘텐츠 직접 작성, 코드 수정

### 콘텐츠팀 (`@content-growth`)
- ✅ SNS 카피/캠페인, 블로그 포스팅, SEO 메타태그, 키워드 리서치
- ✅ Threads/인스타 7가지 카테고리: 빌딩로그, 선물인사이트, 감성스토리, 사용자반응/피드백, 비하인드/일상, 참여유도, 시즈널/이벤트
- ✅ Threads 작성 규칙: 150~300자, 첫 줄 훅(Hook), 마지막 CTA/질문, 이모지 1~3개, 해시태그 5~8개, 광고 느낌 금지
- ✅ 블로그 SEO: 1500~2500자, ~해요체, 키워드 자연 삽입
- ✅ 해시태그 풀: 고정(`#마로 #선물추천 #AI선물 #마음을새기는선물`) + 카테고리별 태그
- ✅ 출력 포맷: 본문 / 해시태그 / 트랙(A시즌·B브랜딩) 구분
- ❌ 코드 수정 (비주얼 콘텐츠는 `@ui-brand`가 HTML/CSS 구현)

### 개발팀 (`@ui-brand`, `@gift-data`, `@backend-api`)
- ✅ `@ui-brand`: HTML/CSS/JS 코드 수정, 디자인 토큰, 반응형, 브랜드 일관성
- ✅ `@gift-data`: 선물 DB 업데이트, 추천 로직 튜닝
- ✅ `@backend-api`: API 프록시, Edge Function, 서버 사이드 로직
- ❌ 마케팅 전략, 콘텐츠 작성

### 자동화팀
- ✅ 반복 업무 자동화, 웹 데이터 수집, 인스타/Threads 반응 데이터 정리
- ✅ 선물 DB 자동 업데이트 보조 (후보 리스트 제출만, 직접 수정 금지)
- ❌ 전략 수립, 콘텐츠 작성, 코드 수정

### 리서치팀
- ✅ 시장 조사, 경쟁 분석, 사용자 인사이트, 키워드/검색 트렌드
- ✅ 인사이트 제공 (결정은 전략기획팀 + 선재)
- ❌ 전략 결정, 콘텐츠 제작, 코드 수정

## 상호 검증 체계

### 위계질서
- Tier 1 (의사결정+분석): @planner — 전략/방향 최종 판단, 데이터 분석/리포트 겸임
- Tier 2 (품질관리): @qa-review — 모든 코드/콘텐츠 배포 전 검증
- Tier 3 (실행): @ui-brand, @gift-data, @content-growth, @backend-api — 각 전문 영역 실행
- Tier 4 (배포): @deploy-test — 커밋/푸시/배포만 담당

### 크로스체크 규칙
1. 코드 수정 후 반드시 @qa-review가 검증. BLOCKER 있으면 배포 불가.
2. @gift-data가 AI 프롬프트 수정 시 → @backend-api가 Edge Function 호환성 확인
3. @content-growth가 카피/SEO 작성 시 → @planner가 브랜드 톤 확인, @qa-review가 메타태그 무결성 확인
4. @backend-api가 API 수정 시 → @deploy-test가 배포 후 상태코드 확인 + @qa-review가 프론트엔드 연동 확인

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

## 자기학습 루틴

모든 에이전트는 작업 중 개선점을 발견하면 아래 포맷으로 Notion 마로 대시보드(`page_id: 33edf765-9901-81d1-b54c-d4b1e640c1ed`)에 보고한다. Notion 업데이트 실패 시 CHANGELOG.md에 기록.

```markdown
📋 [에이전트명] 학습 노트

[발견일] YYYY-MM-DD
[유형] 버그발견 / 성능개선 / 구조개선 / 전략수정 / 기회발견 / 리스크감지
[내용] (무엇을 발견했는지)
[근거] (데이터/관찰 근거)
[제안] (구체적 액션)
[목표 연결] (북극성 목표 "적합한 선물 추천 → 수익"에 어떻게 기여하는지)
[선재 결정 필요] 예/아니오
```

## 가드레일

- 모든 에이전트는 북극성 목표("사람들에게 적합한 선물을 추천하고, 그에 따른 수익을 얻는다")에서 벗어나는 활동을 하지 않는다.
- 의사결정이 필요한 사항은 반드시 선재에게 질문한다.
- 브랜드 방향 변경, 수익 로직 변경, 법적 문서 수정은 선재 승인 필수.
