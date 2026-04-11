export const config = { runtime: 'edge', maxDuration: 25 };

// fetch with timeout (Edge Function 안전 마진 확보)
function fetchWithTimeout(url, opts, ms = 15000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  return fetch(url, { ...opts, signal: ctrl.signal }).finally(() => clearTimeout(timer));
}

export default async function handler(req) {
  // CORS
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

  // API key check
  const apiKey = (process.env.ANTHROPIC_API_KEY || '').trim();
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API 설정 오류', detail: 'ANTHROPIC_API_KEY 환경변수가 설정되지 않았습니다' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    const { relation, depth, occasion, budget, intent, tags, season } = await req.json();

    // 입력 검증
    if (!relation || !occasion || !budget) {
      return new Response(JSON.stringify({ error: '필수 파라미터 누락' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 길이 제한 (injection 방지)
    const safe = (s, max = 50) => String(s || '').slice(0, max);
    const tl = Array.isArray(tags) && tags.length > 0 ? ` 취향:${tags.slice(0, 5).map(t => safe(t, 20)).join(',')}` : '';
    const fm = Array.isArray(tags) && tags.includes('funny');

    // 타임스탬프 + 랜덤 시드로 매번 다른 결과 유도
    const ts = Date.now();
    const seed = Math.random().toString(36).slice(2, 8);

    const prompt = `선물추천 JSON만 출력. 관계:${safe(relation)}(${safe(depth) || '일반'}) 상황:${safe(occasion)} 예산:${safe(budget)} 마음:"${safe(intent, 100) || '없음'}"${tl} 계절:${safe(season, 10)} t:${ts} seed:${seed}
규칙:상황+관계깊이 적합,한국문화 부적절선물 제외,3개 서로 다른 카테고리,구체적 상품명,searchKeyword는 쿠팡검색용${fm ? ' B급감성 웃긴선물' : ''}
다양성:이전 추천과 다른 새로운 조합으로 추천해줘. 매번 다른 카테고리와 가격대에서 골라줘. 흔한추천(양말/머그컵/기프티콘) 지양,구체적 브랜드/상품명 제시
추가규칙:①수혜자관점 실용성가중(받는사람이 실제쓸지 판단)②관계깊이전략:먼관계(아는사이/다른팀/기타인척)→무난안전한선물,가까운관계(절친/3년이상/시부모)→대담특별한선물③김영란법:직장관계중 공직자/교사일때 식품5만원/선물5만원/경조사10만원 한도엄수,초과시 반드시 한도내 대안제시④세대별가중:20대Z세대→경험형/디지털/구독서비스선호,50대이상시니어→건강식품/실용품/전통선물선호
{"gifts":[{"name":"상품명","price":"가격","reason":"추천이유1문장","emoji":"이모지","searchKeyword":"쿠팡키워드"},...(3개)]}`;

    // 모델 fallback: haiku(빠름) → sonnet 순서로 시도
    const models = ['claude-haiku-4-5-20251001', 'claude-sonnet-4-5-20241022'];
    let data = null;
    let lastStatus = 0;
    let lastError = '';

    for (const model of models) {
      try {
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
            temperature: 0.9,
            messages: [{ role: 'user', content: prompt }],
          }),
        });

        lastStatus = res.status;

        if (res.ok) {
          data = await res.json();
          break;
        }

        // 401/403 = 키 문제, 어떤 모델이든 실패하므로 바로 중단
        if (res.status === 401 || res.status === 403) {
          const errBody = await res.json().catch(() => ({}));
          lastError = errBody.error?.message || `인증 실패 (${res.status})`;
          break;
        }

        // 404/429/529/5xx = 재시도 가능, 다음 모델 시도
        const errBody = await res.json().catch(() => ({}));
        lastError = errBody.error?.message || `API 오류 (${res.status})`;
        continue;
      } catch (fetchErr) {
        // 타임아웃 또는 네트워크 에러 → 다음 모델 시도
        lastError = fetchErr.name === 'AbortError' ? `모델 ${model} 타임아웃` : `네트워크 오류: ${fetchErr.message}`;
        continue;
      }
    }

    if (!data) {
      return new Response(JSON.stringify({ error: '추천 생성 실패', status: lastStatus, detail: lastError }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const text = data.content?.[0]?.text || '';
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('JSON parse failed');

    const parsed = JSON.parse(match[0]);
    if (!parsed.gifts?.length) throw new Error('No gifts');

    return new Response(JSON.stringify({ gifts: parsed.gifts }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'private, max-age=3600' }
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: '추천을 생성하지 못했어요. 다시 시도해주세요.', detail: e.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}
