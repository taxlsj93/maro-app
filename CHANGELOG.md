# Changelog

## 2026-04-11
- **[backend-api]** 변경 파일: `api/recommend.js`, `maro-app.jsx` — Edge Function 프록시 구축, API 키 서버 보관, rate limiting, CORS, 프론트엔드 연동
- **[analytics]** 변경 파일: `maro-app.jsx`, `message.html`, `vote.html`, `today-pick.html` — GA4 커스텀 이벤트 추가 (recommend_start/complete, coupang_click, card_save/share, vote_create/submit)
- **[planner]** 변경 파일: `CLAUDE.md` — 에이전트 역할 경계 명확화 (@ui-brand vs @marketing)
- **[qa-review]** 변경 파일: `.claude/agents/qa-review.md` — 접근성 체크리스트 8항목 추가 (ARIA, alt, 키보드, focus, 대비)
- **[ui-brand]** 변경 파일: `vote.html` — 브랜드 스타일 전면 적용 (글래스모피즘, 그라데이션 배경, Noto Sans KR body)
- **[ui-brand]** 변경 파일: `message.html`, `vote.html` — 모바일 반응형 미디어쿼리 추가 (@media max-width:380px)
- **[content-seo]** 변경 파일: `privacy.html`, `terms.html` — meta description + OG 태그 추가
- **[marketing]** 변경 파일: 전체 HTML — GA4 측정 ID `G-S3Y94YY9WP`로 통일
- **[deploy-test]** 변경 파일: `message.html`, `today-pick.html`, `vote.html` — 푸터 링크 `index.html` → `/` 수정
- **[gift-data]** 변경 파일: `maro-app.jsx`, `app.html` — 쿠팡 파트너스 파라미터 `affiliate=` → `traid=`+`subid=` 통일
- **[content-seo]** 변경 파일: `blog.html`, `vercel.json`, `sitemap.xml` — 블로그 페이지 신규 생성 (5개 글, 카테고리 필터, 상세 보기)
- **[deploy-test]** 변경 파일: `firestore.rules` — Firestore 보안 규칙 영구 설정 (투표 읽기/생성만 허용, 수정/삭제 차단)
- **[gift-data]** 변경 파일: `maro-app.jsx` — AI 프롬프트 50% 압축, max_tokens 500, localStorage 캐싱(24h TTL), 태그 반영 fallback 로직
- **[planner]** 변경 파일: — 프로젝트 현황 분석 및 에이전트별 할일 우선순위 정리
- **[deploy-test]** 변경 파일: `vercel.json`, `.gitignore` — 5개 리라이트 추가, .gitignore 생성
- **[ui-brand]** 변경 파일: `today-pick.html`, `vote.html` — Noto Sans KR 폰트 추가
- **[content-seo]** 변경 파일: `app.html`, `calc.html`, `message.html`, `today-pick.html`, `vote.html` — meta description 및 OG 태그 보완
- **[gift-data]** 변경 파일: `today-pick.html` — 쿠팡 링크를 상품명 기반 검색 URL로 교체 (48개), 9개 기념일 특별 추천 세트 추가, 음력 변환 룩업 테이블 추가
- **[deploy-test]** 변경 파일: `robots.txt`, `sitemap.xml`, `CHANGELOG.md` — SEO 인프라 및 변경 이력 파일 생성
- **[content-seo]** 변경 파일: 전체 HTML — canonical 태그, theme-color 메타 추가
- **[marketing]** 변경 파일: 전체 HTML — GA4 트래킹 코드 삽입
