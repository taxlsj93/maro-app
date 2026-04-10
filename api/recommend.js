export const config = { runtime: 'edge' };

// Rate limiting: IP당 분당 10회
const rateMap = new Map();
function checkRate(ip) {
  const now = Date.now();
  const entry = rateMap.get(ip) || { count: 0, reset: now + 60000 };
  if (now > entry.reset) { entry.count = 0; entry.reset = now + 60000; }
  entry.count++;
  rateMap.set(ip, entry);
  return entry.count <= 10;
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

  // Rate limit
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  if (!checkRate(ip)) {
    return new Response(JSON.stringify({ error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' }), {
      status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // API key check
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API 설정 오류' }), {
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

    const prompt = `선물추천 JSON만 출력. 관계:${safe(relation)}(${safe(depth) || '일반'}) 상황:${safe(occasion)} 예산:${safe(budget)} 마음:"${safe(intent, 100) || '없음'}"${tl} 계절:${safe(season, 10)}
규칙:상황+관계깊이 적합,한국문화 부적절선물 제외,3개 서로 다른 카테고리,구체적 상품명,searchKeyword는 쿠팡검색용${fm ? ' B급감성 웃긴선물' : ''}
{"gifts":[{"name":"상품명","price":"가격","reason":"추천이유1문장","emoji":"이모지","searchKeyword":"쿠팡키워드"},...(3개)]}`;

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!res.ok) {
      return new Response(JSON.stringify({ error: '추천 생성 실패' }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const data = await res.json();
    const text = data.content?.[0]?.text || '';
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('JSON parse failed');

    const parsed = JSON.parse(match[0]);
    if (!parsed.gifts?.length) throw new Error('No gifts');

    return new Response(JSON.stringify({ gifts: parsed.gifts }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'private, max-age=3600' }
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: '추천을 생성하지 못했어요. 다시 시도해주세요.' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}
