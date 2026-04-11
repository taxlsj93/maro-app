export const config = { runtime: 'edge', maxDuration: 25 };

function fetchWithTimeout(url, opts, ms = 12000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  return fetch(url, { ...opts, signal: ctrl.signal }).finally(() => clearTimeout(timer));
}

// ── JSON 파싱 3단계 ──
function extractGifts(text) {
  if (!text) return null;
  // 0단계: ```json ... ``` 마크다운 블록 제거
  const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();

  // 1단계: JSON.parse 직접 시도
  try {
    const d = JSON.parse(cleaned);
    if (validateGifts(d.gifts)) return d.gifts;
    if (Array.isArray(d) && validateGifts(d)) return d;
  } catch {}

  // 2단계: {"gifts":[...]} 패턴 추출
  try {
    const m = cleaned.match(/\{\s*"gifts"\s*:\s*\[[\s\S]*?\]\s*\}/);
    if (m) { const d = JSON.parse(m[0]); if (validateGifts(d.gifts)) return d.gifts; }
  } catch {}

  // 3단계: 가장 바깥 {...} 또는 [...] 추출
  try {
    const m = cleaned.match(/\{[\s\S]*\}/);
    if (m) { const d = JSON.parse(m[0]); if (validateGifts(d.gifts)) return d.gifts; }
  } catch {}
  try {
    const m = cleaned.match(/\[[\s\S]*\]/);
    if (m) { const arr = JSON.parse(m[0]); if (validateGifts(arr)) return arr; }
  } catch {}

  return null;
}

// ── 응답 검증: 각 gift에 필수 필드 확인 ──
function validateGifts(gifts) {
  if (!Array.isArray(gifts) || gifts.length === 0) return false;
  return gifts.every(g => g.name && g.price && g.reason && g.searchKeyword);
}

// ── Claude API 1회 호출 ──
async function callClaude(apiKey, model, prompt, temperature) {
  const res = await fetchWithTimeout('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 500,
      temperature,
      system: 'JSON 객체만 출력. 설명/마크다운/```json 절대 금지. {"gifts":[...]} 형식만 반환.',
      messages: [
        { role: 'user', content: prompt },
        { role: 'assistant', content: '{"gifts":[' }
      ],
    }),
  });
  return { res, status: res.status };
}

export default async function handler(req) {
  const origin = req.headers.get('origin') || '';
  const allowedOrigins = ['https://maro.ai.kr', 'http://localhost:5173', 'http://localhost:3000'];
  const corsOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  const corsHeaders = {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });

  const apiKey = (process.env.ANTHROPIC_API_KEY || '').trim();
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API 설정 오류', detail: 'ANTHROPIC_API_KEY 미설정' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    const { relation, depth, occasion, budget, intent, tags, season } = await req.json();
    if (!relation || !occasion || !budget) {
      return new Response(JSON.stringify({ error: '필수 파라미터 누락' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const safe = (s, max = 50) => String(s || '').slice(0, max);
    const tl = Array.isArray(tags) && tags.length > 0 ? ` 취향:${tags.slice(0, 5).map(t => safe(t, 20)).join(',')}` : '';
    const fm = Array.isArray(tags) && tags.includes('funny');

    const prompt = `현재 시간:${new Date().toISOString()} 관계:${safe(relation)}(${safe(depth)||'일반'}) 상황:${safe(occasion)} 예산:${safe(budget)} 마음:"${safe(intent,100)||'없음'}"${tl} 계절:${safe(season,10)}
규칙:상황+관계깊이 적합,한국문화 부적절선물 제외,3개 서로 다른 카테고리,구체적 상품명,searchKeyword는 쿠팡검색용${fm?' B급감성 웃긴선물':''}
다양성:이전과 다른 새로운 상품 추천,같은 상품 반복 금지,다양한 카테고리에서 선택,흔한추천(양말/머그컵/기프티콘) 지양
추가:①수혜자관점 실용성②관계깊이전략(먼→안전,가까운→대담)③김영란법(직장 공직자 식품5만/선물5만/경조사10만)④세대별(Z세대→경험/디지털,시니어→건강/실용)
형식:{"gifts":[{"name":"구체적상품명","price":"N만원","reason":"1문장","emoji":"1개","searchKeyword":"쿠팡검색어"}]} 3개`;

    const HAIKU = 'claude-haiku-4-5-20251001';

    // ── 3단계 재시도 전략 (같은 모델, temperature 점진 하강) ──
    // 1차: temp 0.7 (다양성 유지)
    // 2차: temp 0.5 (안정적 JSON)
    // 3차: temp 0.3 (최대 안정)
    const attempts = [
      { model: HAIKU, temp: 0.7 },
      { model: HAIKU, temp: 0.5 },
      { model: HAIKU, temp: 0.3 },
    ];

    let lastError = '';

    for (const { model, temp } of attempts) {
      try {
        const { res, status } = await callClaude(apiKey, model, prompt, temp);

        // 인증 에러 → 즉시 중단
        if (status === 401 || status === 403) {
          const err = await res.json().catch(() => ({}));
          return new Response(JSON.stringify({ error: '인증 실패', detail: err.error?.message }), {
            status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // API 에러 → 다음 시도
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          lastError = `${model} HTTP ${status}: ${err.error?.message || ''}`;
          continue;
        }

        const data = await res.json();
        // prefill '{"gifts":[' 이 stop_reason으로 빠지므로 응답 앞에 붙여서 완전한 JSON 복원
        const raw = data.content?.[0]?.text || '';
        const text = '{"gifts":[' + raw;
        const gifts = extractGifts(text);

        if (gifts) {
          return new Response(JSON.stringify({ gifts }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'no-store, no-cache, must-revalidate' }
          });
        }

        // 파싱 실패 → 다음 시도
        lastError = `${model} t=${temp} 파싱 실패`;
        continue;

      } catch (e) {
        lastError = e.name === 'AbortError' ? `${model} 타임아웃` : e.message;
        continue;
      }
    }

    // 3회 모두 실패
    return new Response(JSON.stringify({ error: '추천 생성 실패', detail: lastError }), {
      status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: '추천을 생성하지 못했어요.', detail: e.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}
