# PRD: 에이전트 구조 최적화

> 작성: @planner | 2026-04-11
> 상태: **선재 승인 대기** — 승인 전까지 실행 금지

---

## 1. 배경 및 문제

현재 MARO 프로젝트에는 9개 에이전트가 운영 중입니다:

| 에이전트 | 역할 | 실제 활용 빈도 |
|----------|------|---------------|
| @planner | 전략/방향 | 중 |
| @qa-review | 품질 검증 | 높음 |
| @ui-brand | HTML/CSS/JS | 높음 |
| @gift-data | 선물 DB/프롬프트 | 높음 |
| @backend-api | Edge Function | 중 |
| @deploy-test | 배포 | 높음 |
| @marketing | 인스타 카피/기획 | 낮음 |
| @content-seo | 블로그/메타태그 | 중 |
| @analytics | GA4 분석 | **매우 낮음** |

### 문제점
1. **@analytics 유명무실**: GA4 이벤트 설정 이후 독립 작업이 거의 없음. 분석 요청이 올 때만 간헐적 사용.
2. **@marketing + @content-seo 역할 중복**: 둘 다 "콘텐츠 생성"이 핵심. marketing은 인스타 카피, content-seo는 블로그인데 실제로는 한 사람(선재)이 두 에이전트를 번갈아 호출하며 비효율 발생.
3. **에이전트 9개 관리 오버헤드**: CLAUDE.md 규칙, 크로스체크, SYNC 기록 등에서 에이전트 수가 많을수록 복잡도 증가.

---

## 2. 제안

### 2-A. @analytics 비활성화

**이유:**
- GA4 이벤트는 이미 모든 페이지에 설정 완료
- 데이터 분석은 GA4 대시보드에서 직접 확인 가능
- 에이전트가 할 일이 "리포트 작성" 뿐인데, 이는 @planner가 대행 가능

**실행 방법:**
1. `.claude/agents/analytics.md` 파일을 `.claude/agents/_archive/analytics.md`로 이동
2. CLAUDE.md 상호 검증 체계에서 Tier 5 (분석) 항목 제거
3. 분석 관련 요청은 @planner가 처리하도록 역할 경계에 명시

**리스크:** 낮음. GA4 이벤트 코드는 이미 프론트엔드에 심어져 있으므로 에이전트 없어도 데이터 수집은 계속됨.

### 2-B. @marketing + @content-seo → @content-growth 통합

**이유:**
- 두 에이전트의 핵심 업무가 모두 "콘텐츠 생성"
- 인스타 카피 → 블로그 발행 → SEO 최적화가 하나의 파이프라인
- 통합하면 브랜드 톤 일관성 자동 유지 (현재는 @planner가 별도 크로스체크)

**통합 후 @content-growth 역할:**
- 인스타 릴스/카드뉴스 카피 작성 (기존 @marketing)
- 네이버 블로그 포스팅 (기존 @content-seo)
- 메타태그/SEO 최적화 (기존 @content-seo)
- 해시태그/키워드 리서치 (기존 @marketing + @content-seo)
- 캠페인 전략/UTM (기존 @marketing)

**실행 방법:**
1. `.claude/agents/content-growth.md` 신규 생성 (marketing + content-seo 스킬 통합)
2. `.claude/agents/marketing.md`, `.claude/agents/content-seo.md` → `_archive/`로 이동
3. CLAUDE.md 역할 경계에서 두 에이전트를 @content-growth로 교체
4. 크로스체크 규칙 3번, 4번을 @content-growth 기준으로 수정

**리스크:** 중간. 하나의 에이전트에 역할이 많아지면 프롬프트가 길어져 정확도가 떨어질 수 있음. 스킬 파일을 잘 구조화해야 함.

---

## 3. 변경 전후 비교

### Before (9개)
```
@planner → @qa-review → @ui-brand / @gift-data / @marketing / @content-seo / @backend-api → @deploy-test → @analytics
```

### After (7개)
```
@planner → @qa-review → @ui-brand / @gift-data / @content-growth / @backend-api → @deploy-test
```

| 지표 | Before | After |
|------|--------|-------|
| 에이전트 수 | 9 | 7 |
| CLAUDE.md 규칙 복잡도 | 높음 | 중간 |
| 크로스체크 경로 | 5개 | 4개 |
| 콘텐츠 브랜드 톤 확인 | @planner 별도 필요 | @content-growth 내부 자동 |
| 분석 업무 | @analytics (미사용) | @planner 겸임 |

---

## 4. 실행 계획 (승인 후)

| 단계 | 작업 | 담당 |
|------|------|------|
| 1 | `_archive/` 디렉토리 생성 | @deploy-test |
| 2 | `analytics.md` → `_archive/` 이동 | @deploy-test |
| 3 | `content-growth.md` 신규 작성 | @planner |
| 4 | `marketing.md`, `content-seo.md` → `_archive/` 이동 | @deploy-test |
| 5 | CLAUDE.md 역할 경계 + 크로스체크 규칙 수정 | @planner |
| 6 | CHANGELOG.md, SYNC.md 기록 | @deploy-test |

---

## 5. 승인 요청

> 선재님, 위 변경사항을 검토해주세요.
> - [  ] 2-A 승인: @analytics 비활성화
> - [  ] 2-B 승인: @marketing + @content-seo → @content-growth 통합
> - [  ] 거부 또는 수정 요청
>
> 승인 시 바로 실행합니다.
