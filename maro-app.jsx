import { useState, useEffect, useRef } from "react";

// ── Data ──
const RELATIONS = [
  { id:"lover",icon:"💕",label:"연인",desc:"사랑하는 사람에게",depth:["썸 단계","3개월 미만","6개월~1년","1년 이상","3년 이상"] },
  { id:"spouse",icon:"💍",label:"배우자",desc:"함께 하는 소중한 사람",depth:["신혼 (1년 미만)","1~3년차","3~10년차","10년 이상"] },
  { id:"friend",icon:"🤝",label:"친구",desc:"마음을 나누는 사이",depth:["아는 사이","가끔 만나는 친구","자주 만나는 친구","절친"] },
  { id:"parent",icon:"🏠",label:"부모님",desc:"늘 감사한 분들",depth:["함께 사는","따로 사는","자주 연락하는","명절에 만나는"] },
  { id:"colleague",icon:"💼",label:"직장 동료",desc:"함께 일하는 관계",depth:["같은 팀","다른 팀","상사","후배"] },
  { id:"mentor",icon:"🎓",label:"선생님·은사",desc:"배움을 주신 분",depth:["현재 가르침 받는","졸업 후 인연"] },
  { id:"family",icon:"👨‍👩‍👧‍👦",label:"친척·가족",desc:"가까운 혈연 관계",depth:["형제·자매","조부모","삼촌·이모","사촌"] },
  { id:"inlaw",icon:"🤝",label:"시댁·처가",desc:"조심스러운 가족 관계",depth:["시부모·장인장모","시누이·처남","기타 인척"] },
];
const OCCASIONS = [
  {id:"birthday",icon:"🎂",label:"생일"},{id:"anniversary",icon:"💝",label:"기념일"},{id:"thanks",icon:"🙏",label:"감사 인사"},
  {id:"congrats",icon:"🎊",label:"축하 (승진·합격)"},{id:"wedding",icon:"💒",label:"결혼·약혼"},{id:"baby",icon:"👶",label:"출산·돌잔치"},
  {id:"housewarming",icon:"🏡",label:"집들이"},{id:"recovery",icon:"🌿",label:"병문안·위로"},{id:"apology",icon:"💐",label:"사과·화해"},
  {id:"holiday",icon:"🎁",label:"명절·시즌"},{id:"justbecause",icon:"✨",label:"그냥, 마음 전달"},
];
const BUDGETS = [
  {id:"b1",label:"~2만원",tag:"부담 없는"},{id:"b2",label:"2~5만원",tag:"적당한"},{id:"b3",label:"5~10만원",tag:"정성을 담은"},
  {id:"b4",label:"10~20만원",tag:"특별한"},{id:"b5",label:"20만원 이상",tag:"프리미엄"},
];
const INTENT_HINTS = {
  lover:["보고 싶었어","항상 고마워","사랑해","우리 오래가자"],spouse:["항상 고생 많아","덕분에 행복해","사랑해","고마워"],
  friend:["곁에 있어줘서 고마워","축하해","힘내","보고 싶다"],parent:["항상 감사합니다","건강하세요","사랑합니다"],
  colleague:["수고 많으셨습니다","감사합니다","잘 부탁드립니다"],mentor:["가르침 감사합니다","덕분에 성장했습니다"],
  family:["감사해요","건강하세요","보고 싶어요"],inlaw:["감사합니다","건강하세요","잘 부탁드립니다"],
};
const VIS={"핸드크림":{bg:"#fce4ec",ac:"#e8a0a0",ic:"🧴"},"로션":{bg:"#fce4ec",ac:"#e8a0a0",ic:"🧴"},"기프트카드":{bg:"#fff3e0",ac:"#e8b87a",ic:"💳"},"기프티콘":{bg:"#fff3e0",ac:"#e8b87a",ic:"☕"},"디퓨저":{bg:"#e8f5e9",ac:"#81c784",ic:"🌿"},"캔들":{bg:"#fff8e1",ac:"#dbc07a",ic:"🕯️"},"향수":{bg:"#f3e5f5",ac:"#c490c4",ic:"🌸"},"지갑":{bg:"#efebe9",ac:"#a1887f",ic:"👛"},"카드홀더":{bg:"#efebe9",ac:"#a1887f",ic:"👛"},"이어폰":{bg:"#e3f2fd",ac:"#7aaed4",ic:"🎧"},"스피커":{bg:"#e0f2f1",ac:"#6db5a8",ic:"🔊"},"가방":{bg:"#fbe9e7",ac:"#d4877a",ic:"👜"},"백팩":{bg:"#fbe9e7",ac:"#d4877a",ic:"🎒"},"시계":{bg:"#eceff1",ac:"#90a4ae",ic:"⌚"},"워치":{bg:"#eceff1",ac:"#90a4ae",ic:"⌚"},"아기":{bg:"#e1f5fe",ac:"#7abcd4",ic:"👶"},"턱받이":{bg:"#e1f5fe",ac:"#7abcd4",ic:"🍼"},"유모차":{bg:"#e8eaf6",ac:"#8a92b8",ic:"🚼"},"카시트":{bg:"#e0f7fa",ac:"#6dbcc4",ic:"🚗"},"침구":{bg:"#fce4ec",ac:"#e8a0a0",ic:"🛏️"},"이불":{bg:"#fce4ec",ac:"#e8a0a0",ic:"🛏️"},"청소기":{bg:"#e0f7fa",ac:"#6dbcc4",ic:"🤖"},"커피머신":{bg:"#efebe9",ac:"#8d6e63",ic:"☕"},"커피":{bg:"#efebe9",ac:"#8d6e63",ic:"☕"},"디저트":{bg:"#fce4ec",ac:"#e8a0a0",ic:"🍰"},"케이크":{bg:"#fce4ec",ac:"#e8a0a0",ic:"🎂"},"식기":{bg:"#fff3e0",ac:"#e8b87a",ic:"🍽️"},"냄비":{bg:"#fff3e0",ac:"#e8b87a",ic:"🍳"},"수건":{bg:"#e3f2fd",ac:"#7aaed4",ic:"🛁"},"타올":{bg:"#e3f2fd",ac:"#7aaed4",ic:"🛁"},"와인":{bg:"#f3e5f5",ac:"#ab6fab",ic:"🍷"},"샴페인":{bg:"#f3e5f5",ac:"#ab6fab",ic:"🍾"},"호텔":{bg:"#fff8e1",ac:"#dbc07a",ic:"🏨"},"레스토랑":{bg:"#fff3e0",ac:"#d4977a",ic:"🍽️"},"식사권":{bg:"#fff3e0",ac:"#d4977a",ic:"🍽️"},"스파":{bg:"#e0f2f1",ac:"#6db5a8",ic:"💆"},"명품":{bg:"#f3e5f5",ac:"#9c6f9c",ic:"💎"},"액세서리":{bg:"#f3e5f5",ac:"#9c6f9c",ic:"💎"},"전자기기":{bg:"#eceff1",ac:"#78909c",ic:"📱"},"무드등":{bg:"#fff8e1",ac:"#dbc07a",ic:"💡"},"조명":{bg:"#fff8e1",ac:"#dbc07a",ic:"💡"},"꽃다발":{bg:"#fce4ec",ac:"#e8a0a0",ic:"💐"},"꽃":{bg:"#fce4ec",ac:"#e8a0a0",ic:"💐"},"차":{bg:"#e8f5e9",ac:"#66bb6a",ic:"🍵"},"매트리스":{bg:"#e8eaf6",ac:"#8a92b8",ic:"💤"},"공기청정기":{bg:"#e0f7fa",ac:"#6dbcc4",ic:"🌬️"},"아기띠":{bg:"#e8eaf6",ac:"#8a92b8",ic:"👨‍👩‍👧"},"바운서":{bg:"#e1f5fe",ac:"#7abcd4",ic:"🍼"},"기저귀":{bg:"#e1f5fe",ac:"#7abcd4",ic:"👶"},"의류":{bg:"#fce4ec",ac:"#e8a0a0",ic:"👕"},"양말":{bg:"#e1f5fe",ac:"#7abcd4",ic:"🧦"},"가제":{bg:"#e3f2fd",ac:"#7aaed4",ic:"🤍"},"산후조리":{bg:"#fce4ec",ac:"#e8a0a0",ic:"💆‍♀️"},"한우":{bg:"#ffebee",ac:"#d47a7a",ic:"🥩"},"갈비":{bg:"#ffebee",ac:"#d47a7a",ic:"🥩"},"건강":{bg:"#e8f5e9",ac:"#66bb6a",ic:"💊"},"견과":{bg:"#fff3e0",ac:"#e8b87a",ic:"🥜"},"한과":{bg:"#fff8e1",ac:"#dbc07a",ic:"🍡"},"참기름":{bg:"#fff3e0",ac:"#e8b87a",ic:"🫒"},"과일":{bg:"#e8f5e9",ac:"#66bb6a",ic:"🍎"},"죽":{bg:"#fff3e0",ac:"#e8b87a",ic:"🍲"},"만년필":{bg:"#eceff1",ac:"#78909c",ic:"🖊️"},"명함":{bg:"#efebe9",ac:"#a1887f",ic:"👔"},"팔찌":{bg:"#f3e5f5",ac:"#c490c4",ic:"💍"},"반지":{bg:"#f3e5f5",ac:"#c490c4",ic:"💍"},"목걸이":{bg:"#f3e5f5",ac:"#c490c4",ic:"💎"},"포토":{bg:"#fff3e0",ac:"#e8b87a",ic:"📸"},"화분":{bg:"#e8f5e9",ac:"#66bb6a",ic:"🪴"},"엽서":{bg:"#fce4ec",ac:"#e8a0a0",ic:"💌"},"간식":{bg:"#fff3e0",ac:"#e8b87a",ic:"🍫"},"머그":{bg:"#efebe9",ac:"#8d6e63",ic:"☕"},"액자":{bg:"#fff3e0",ac:"#e8b87a",ic:"📷"}};
const VD={bg:"#f7f0eb",ac:"#c4756e",ic:"🎁"};
function gv(n){const k=Object.keys(VIS).find(k=>n.includes(k));return k?VIS[k]:VD;}

// ── Fallback DB ──
const FB={
  "birthday|b1":[{name:"프리미엄 핸드크림",price:"1~2만원",reason:"매일 쓸 때마다 생각나는 감성적인 선물이에요.",sk:"프리미엄 핸드크림 선물"},{name:"카페 기프트카드",price:"1~2만원",reason:"부담 없이 받을 수 있으면서도 센스 있는 선물이에요.",sk:"스타벅스 기프트카드"},{name:"감성 디저트 세트",price:"1~2만원",reason:"생일의 달콤함을 더해주는 특별한 간식이에요.",sk:"선물용 디저트 세트"}],
  "birthday|b2":[{name:"브랜드 향수 미니어처 세트",price:"3~5만원",reason:"여러 향을 체험할 수 있어서 특별하고 센스 있어 보여요.",sk:"향수 미니어처 세트"},{name:"감성 무드등",price:"3~5만원",reason:"공간에 분위기를 더해주는 특별한 인테리어 선물이에요.",sk:"감성 무드등"},{name:"프리미엄 디퓨저 세트",price:"3~5만원",reason:"집에 향기가 날 때마다 생각나는 감성적인 선물이에요.",sk:"프리미엄 디퓨저 세트"}],
  "birthday|b3":[{name:"브랜드 지갑·카드홀더",price:"7~10만원",reason:"매일 쓰는 물건이라 오래 기억에 남는 실용적인 선물이에요.",sk:"브랜드 카드지갑 선물"},{name:"프리미엄 블루투스 이어폰",price:"8~10만원",reason:"매일 쓰는 아이템이라 가장 실용적인 선물이에요.",sk:"블루투스 이어폰"},{name:"고급 레스토랑 식사권",price:"6~10만원",reason:"특별한 날 특별한 경험을 선물하는 거예요.",sk:"레스토랑 식사권"}],
  "birthday|b4":[{name:"브랜드 가방",price:"15~20만원",reason:"오래 쓸 수 있는 특별한 선물. 매일 함께하니까요.",sk:"브랜드 가방"},{name:"스마트워치",price:"15~20만원",reason:"건강도 챙기고 일상도 편리해지는 스마트한 선물이에요.",sk:"스마트워치"},{name:"프리미엄 향수 정품",price:"12~18만원",reason:"고급스러운 향기로 특별한 날을 기억하게 해줘요.",sk:"프리미엄 향수"}],
  "birthday|b5":[{name:"명품 액세서리",price:"25~40만원",reason:"오래도록 간직할 수 있는 의미 있는 선물이에요.",sk:"명품 액세서리"},{name:"프리미엄 전자기기",price:"25~50만원",reason:"정말 갖고 싶었던 걸 선물받는 기쁨은 특별해요.",sk:"에어팟 맥스"},{name:"호텔 스파 패키지",price:"20~35만원",reason:"잊을 수 없는 경험을 선물하는 거예요.",sk:"호텔 숙박 패키지"}],
  "baby|b1":[{name:"오가닉 아기 턱받이 세트",price:"1~2만원",reason:"실용적이면서 부담 없는 출산 선물. 매일 쓰는 필수템이에요.",sk:"아기 턱받이 세트"},{name:"아기 양말·손싸개 세트",price:"1~2만원",reason:"소소하지만 정성이 느껴지는 신생아 필수 아이템이에요.",sk:"신생아 양말 세트"},{name:"아기 가제 수건 세트",price:"1~2만원",reason:"매일 여러 장 쓰는 필수품이라 정말 감사한 선물이에요.",sk:"아기 가제수건"}],
  "baby|b2":[{name:"유기농 베이비 로션·워시 세트",price:"3~5만원",reason:"아기 피부에 좋은 걸 챙겨주는 세심한 마음이 전해져요.",sk:"유기농 베이비 로션 세트"},{name:"보냉보온 이유식 용기 세트",price:"2~4만원",reason:"곧 이유식 시작할 때 꼭 필요한 센스 있는 선물이에요.",sk:"이유식 용기 세트"},{name:"프리미엄 기저귀 대용량",price:"3~4만원",reason:"가장 실용적인 출산 선물 1위. 아무리 많아도 부족해요.",sk:"프리미엄 기저귀"}],
  "baby|b3":[{name:"아기 바운서",price:"7~10만원",reason:"신생아 필수템으로 육아 부담을 덜어주는 실질적인 도움이에요.",sk:"아기 바운서"},{name:"프리미엄 아기띠·힙시트",price:"8~10만원",reason:"외출할 때 꼭 필요해요. 부모의 편안함을 생각한 선물이에요.",sk:"아기띠 힙시트"},{name:"유기농 아기 의류 선물 세트",price:"5~8만원",reason:"프리미엄 브랜드라 선물로 받으면 특별해요.",sk:"아기옷 선물세트"}],
  "baby|b4":[{name:"프리미엄 유모차",price:"15~20만원",reason:"직접 사기엔 고민되는 가격대라 선물로 최고예요.",sk:"유모차"},{name:"아기 카시트",price:"15~20만원",reason:"안전과 직결되는 필수 아이템. 가장 감사한 출산 선물이에요.",sk:"아기 카시트"},{name:"산모 산후조리 케어 세트",price:"10~15만원",reason:"엄마의 회복도 챙겨주는 따뜻한 마음이에요.",sk:"산후조리 세트"}],
  "wedding|b3":[{name:"프리미엄 이불·침구 세트",price:"7~10만원",reason:"매일 쓰는 필수 혼수 아이템. 좋은 침구는 삶의 질을 바꿔요.",sk:"프리미엄 침구 세트"},{name:"고급 주방가전",price:"8~10만원",reason:"신혼 살림에 꼭 필요한 실용적인 선물이에요.",sk:"주방 가전 선물"},{name:"커플 향수 세트",price:"8~10만원",reason:"둘만의 향기를 만들어주는 로맨틱한 선물이에요.",sk:"커플 향수 세트"}],
  "wedding|b4":[{name:"로봇청소기",price:"15~20만원",reason:"신혼생활을 편리하게 만들어주는 최고의 실용 선물이에요.",sk:"로봇청소기"},{name:"프리미엄 커피머신",price:"15~20만원",reason:"매일 아침 둘만의 카페를 만들어주는 선물이에요.",sk:"커피머신"},{name:"고급 냄비·팬 세트",price:"15~20만원",reason:"요리를 시작하는 신혼부부에게 가장 실용적인 선물이에요.",sk:"프리미엄 냄비 세트"}],
};
const FD={b1:[{name:"프리미엄 핸드크림 세트",price:"1~2만원",reason:"가볍지만 정성이 담긴 선물. 매일 쓸 때마다 마음이 전해져요.",sk:"핸드크림 선물 세트"},{name:"카페 음료 기프티콘",price:"1만원",reason:"언제든 편하게 쓸 수 있는 실용적인 선물이에요.",sk:"카페 기프티콘"},{name:"감성 미니 디퓨저",price:"1~2만원",reason:"공간에 향기를 남기는 작지만 특별한 선물이에요.",sk:"미니 디퓨저"}],b2:[{name:"프리미엄 디퓨저 세트",price:"3~5만원",reason:"향기가 날 때마다 마음이 전해지는 감성적인 선물이에요.",sk:"프리미엄 디퓨저 세트"},{name:"고급 차·커피 선물 세트",price:"3~5만원",reason:"매일 마실 때마다 생각나는 따뜻한 선물이에요.",sk:"차 선물 세트"},{name:"브랜드 손수건",price:"3~5만원",reason:"실용적이면서도 격식 있는 선물이에요.",sk:"브랜드 손수건 선물"}],b3:[{name:"브랜드 지갑·카드홀더",price:"7~10만원",reason:"매일 쓰는 물건이라 오래 기억에 남는 실용적인 선물이에요.",sk:"브랜드 카드지갑"},{name:"고급 캔들 세트",price:"8~10만원",reason:"집에 향기가 날 때마다 이 마음이 은은하게 닿아요.",sk:"고급 캔들 세트"},{name:"블루투스 스피커",price:"7~10만원",reason:"일상에 음악을 더해주는 감성적인 선물이에요.",sk:"블루투스 스피커"}],b4:[{name:"브랜드 가방",price:"12~18만원",reason:"매일 함께하는 아이템이라 특별한 의미가 있어요.",sk:"브랜드 가방"},{name:"프리미엄 향수",price:"12~18만원",reason:"향기로 마음을 전하는 고급스러운 선물이에요.",sk:"프리미엄 향수"},{name:"고급 레스토랑 식사권",price:"10~15만원",reason:"특별한 경험을 함께 나누는 의미 있는 선물이에요.",sk:"레스토랑 식사권"}],b5:[{name:"명품 액세서리",price:"25~40만원",reason:"오래도록 간직할 수 있는 특별한 선물이에요.",sk:"명품 액세서리"},{name:"프리미엄 전자기기",price:"25~50만원",reason:"정말 원했던 걸 선물받는 기쁨은 잊을 수 없어요.",sk:"프리미엄 전자기기"},{name:"호텔 스파 패키지",price:"20~35만원",reason:"몸과 마음 모두 쉴 수 있는 특별한 경험이에요.",sk:"호텔 스파 패키지"}]};
function gfb(o,b){return FB[`${o}|${b}`]||FD[b]||FD.b2;}

// ── Utils ──
function parsePrice(s){if(!s)return null;const n=s.match(/[\d.]+/g);if(!n)return null;const m=s.includes("만")?10000:1;return n.length>=2?{min:Math.round(n[0]*m),max:Math.round(n[1]*m)}:{min:Math.round(n[0]*m*.7),max:Math.round(n[0]*m*1.3)};}
function mkUrl(kw,pr){
  const PARTNER_ID="AF3339921";
  const b=`https://www.coupang.com/np/search?component=&q=${encodeURIComponent(kw)}&channel=user&affiliate=${PARTNER_ID}`;
  const p=parsePrice(pr);
  return p?`${b}&minPrice=${p.min}&maxPrice=${p.max}`:b;
}

// ── Components ──
function Btn({onClick,children,style={},scale=0.94,ms=220}){
  const[d,setD]=useState(false);const[ok,setOk]=useState(false);const t=useRef(null);
  const go=()=>{setD(false);setOk(true);t.current=setTimeout(()=>onClick?.(),ms);};
  useEffect(()=>()=>clearTimeout(t.current),[]);
  return(<button onPointerDown={()=>setD(true)} onPointerUp={go} onPointerLeave={()=>setD(false)} onPointerCancel={()=>setD(false)}
    style={{...style,transform:d?`scale(${scale})`:ok?"scale(0.97)":"scale(1)",transition:d?"transform .06s":"all .2s cubic-bezier(.2,0,.2,1)",outline:"none",WebkitTapHighlightColor:"transparent",userSelect:"none",position:"relative",overflow:"hidden",...(ok?{borderColor:"#c4756e",background:"rgba(196,117,110,.1)",boxShadow:"0 0 0 3px rgba(196,117,110,.18)"}:{})}}>{children}
    {ok&&<div style={{position:"absolute",top:7,right:7,width:22,height:22,borderRadius:"50%",background:"linear-gradient(135deg,#c4756e,#a85e58)",display:"flex",alignItems:"center",justifyContent:"center",animation:"pop .18s cubic-bezier(.34,1.56,.64,1)",boxShadow:"0 2px 8px rgba(168,94,88,.35)"}}><span style={{color:"#fff",fontSize:12,fontWeight:800}}>✓</span></div>}
  </button>);
}
function Thumb({name,sz=68}){const v=gv(name);return(<div style={{width:sz,height:sz,borderRadius:14,flexShrink:0,background:`linear-gradient(145deg,${v.bg},${v.bg}dd)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:Math.round(sz*.42),boxShadow:`0 3px 12px ${v.ac}18`,border:`1.5px solid ${v.ac}25`,position:"relative",overflow:"hidden"}}><div style={{position:"absolute",top:"-18%",right:"-18%",width:"48%",height:"48%",borderRadius:"50%",background:`${v.ac}0d`}}/><span style={{position:"relative",zIndex:1}}>{v.ic}</span></div>);}
function SH({n,title,sub,onBack}){return(<div style={{marginBottom:20}}>{onBack&&<button onClick={onBack} style={{display:"inline-flex",alignItems:"center",gap:4,background:"none",border:"none",cursor:"pointer",fontSize:13,color:"#a09080",padding:"4px 0",marginBottom:10}} onPointerDown={e=>e.currentTarget.style.color="#6b5040"} onPointerUp={e=>e.currentTarget.style.color="#a09080"}><span style={{fontSize:16}}>←</span> 이전으로</button>}<div style={{fontSize:11,color:"#c4756e",fontWeight:700,letterSpacing:2,marginBottom:6}}>STEP {n}</div><h2 style={{fontSize:19,fontWeight:600,color:"#2d2420",margin:"0 0 5px",lineHeight:1.4}}>{title}</h2><p style={{fontSize:13,color:"#9a8a7a",margin:0}}>{sub}</p></div>);}

// ── App ──
export default function App(){
  const[step,setStep]=useState(0);const[rel,setRel]=useState(null);const[dep,setDep]=useState("");const[occ,setOcc]=useState(null);const[bud,setBud]=useState(null);
  const[intent,setIntent]=useState("");const[tags,setTags]=useState([]);const[results,setResults]=useState([]);const[loading,setLoading]=useState(false);const[lm,setLm]=useState(0);const[fade,setFade]=useState(true);const box=useRef(null);

  const TAGS=[{id:"cafe",label:"카페·맛집",em:"☕"},{id:"fashion",label:"패션·뷰티",em:"👗"},{id:"fitness",label:"운동·건강",em:"💪"},{id:"travel",label:"여행",em:"✈️"},{id:"interior",label:"집꾸미기",em:"🏠"},{id:"tech",label:"테크·가전",em:"📱"},{id:"pet",label:"반려동물",em:"🐶"},{id:"book",label:"독서·문화",em:"📚"},{id:"game",label:"게임",em:"🎮"},{id:"music",label:"음악",em:"🎵"},{id:"cooking",label:"요리·베이킹",em:"🍳"},{id:"camping",label:"캠핑·아웃도어",em:"⛺"},{id:"idol",label:"아이돌·덕질",em:"🎤"},{id:"selfcare",label:"셀프케어·힐링",em:"🧖"},{id:"photo",label:"사진·영상",em:"📸"},{id:"alcohol",label:"술·와인",em:"🍷"},{id:"character",label:"캐릭터·굿즈",em:"🧸"},{id:"retro",label:"레트로·빈티지",em:"📻"},{id:"funny",label:"웃긴선물·장난감",em:"🤣"},{id:"practical",label:"극한의 실용템",em:"🧹"}];
  const toggleTag=id=>setTags(p=>p.includes(id)?p.filter(x=>x!==id):p.length<5?[...p,id]:p);
  const tagLabels=tags.map(id=>TAGS.find(t=>t.id===id)?.label).filter(Boolean);

  const LM=["관계를 분석하고 있어요...","의도에 맞는 선물을 찾고 있어요...","감정 메시지를 해석하고 있어요...","최적의 선물을 선별하고 있어요..."];
  useEffect(()=>{if(!loading)return;const i=setInterval(()=>setLm(p=>(p+1)%LM.length),2000);return()=>clearInterval(i);},[loading]);
  const go=n=>{setFade(false);setTimeout(()=>{setStep(n);setFade(true);box.current?.scrollTo({top:0,behavior:"smooth"});},280);};

  const analyze=async()=>{
    setLoading(true);go(6);
    const tl=tagLabels.length>0?`\n이 사람 관심사/취향: ${tagLabels.join(", ")}`:"";
    const fm=tags.includes("funny");
    const prompt=`당신은 한국의 관계 문화를 깊이 이해하는 선물 추천 전문가입니다.
관계: ${rel?.label}, 깊이: ${dep||"미지정"}, 상황: ${occ?.label}, 예산: ${bud?.label}
전하고 싶은 마음: "${intent||"특별한 메시지 없음"}"${tl}
규칙: 1)${occ?.label} 상황에 맞는 선물만 2)관계 깊이 고려 3)한국 문화 부적절 선물 제외 4)searchKeyword는 해당 가격대에 맞는 쿠팡 검색 키워드${tagLabels.length>0?" 5)관심사/취향을 적극 반영해서 추천":""}${fm?" 6)웃긴선물 태그가 있으므로 B급 감성, 병맛, 웃기지만 센스있는 선물을 추천":""}
JSON만 출력: {"gifts":[{"name":"상품명","price":"가격대","reason":"2문장 설명","emoji":"이모지","searchKeyword":"쿠팡키워드"},{"name":"...","price":"...","reason":"...","emoji":"...","searchKeyword":"..."},{"name":"...","price":"...","reason":"...","emoji":"...","searchKeyword":"..."}]}`;
    try{const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:prompt}]})});if(!r.ok)throw 0;const d=await r.json();const t=d.content?.[0]?.text||"";const m=t.match(/\{[\s\S]*\}/);if(!m)throw 0;const p=JSON.parse(m[0]);if(!p.gifts?.length)throw 0;setResults(p.gifts);}catch{setResults(gfb(occ?.id,bud?.id));}setLoading(false);
  };
  const restart=()=>{setRel(null);setDep("");setOcc(null);setBud(null);setIntent("");setTags([]);setResults([]);setLoading(false);go(0);};
  const prog=Math.min(step,5);
  const anaText=rel&&occ?`${rel.label}${dep?` (${dep})`:""}에게 ${occ.label} 상황에서`:"";

  // ── Theme ──
  const P="#c4756e",P2="#a85e58",BG="#fdfbf8",TX="#2d2420",TX2="#8a7a6a",TX3="#b0a090";
  const card={background:"rgba(255,255,255,.8)",border:"1.5px solid #ebe4dc",borderRadius:14,cursor:"pointer",textAlign:"left",backdropFilter:"blur(8px)",position:"relative",overflow:"hidden"};

  return(
    <div style={{minHeight:"100vh",background:`linear-gradient(170deg,${BG} 0%,#f7f2ec 40%,#faf6f2 70%,#f2ebe4 100%)`,fontFamily:"'Pretendard','Apple SD Gothic Neo',-apple-system,sans-serif",color:TX}}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}@keyframes up{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes pop{from{transform:scale(0)}to{transform:scale(1)}}@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}`}</style>
      <div style={{position:"fixed",top:-80,left:-60,width:300,height:300,borderRadius:"50%",background:`radial-gradient(circle,${P}08 0%,transparent 70%)`,pointerEvents:"none"}}/>
      <div style={{position:"fixed",bottom:-80,right:-40,width:350,height:350,borderRadius:"50%",background:"radial-gradient(circle,rgba(196,117,110,.06)0%,transparent 70%)",pointerEvents:"none"}}/>

      <div ref={box} style={{maxWidth:460,margin:"0 auto",padding:"16px 20px 40px",minHeight:"100vh",position:"relative",zIndex:1}}>

        {/* ── Brand Header ── */}
        <div style={{textAlign:"center",padding:"24px 0 8px"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,marginBottom:6}}>
            <div style={{width:32,height:32,borderRadius:10,background:`linear-gradient(135deg,${P},${P2})`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 3px 12px ${P}30`}}>
              <span style={{color:"#fff",fontSize:16}}>♥</span>
            </div>
            <span style={{fontSize:26,fontWeight:700,color:TX,letterSpacing:"-0.5px"}}>마로</span>
          </div>
          <div style={{fontSize:11,letterSpacing:3,color:TX3,marginBottom:4}}>MARO</div>
          <p style={{fontSize:13,color:TX2,margin:0,lineHeight:1.5}}>마음을 새기는 선물</p>
        </div>

        {/* ── Progress ── */}
        {step>=1&&step<=6&&(
          <div style={{margin:"14px 0 22px",background:"rgba(255,255,255,.5)",borderRadius:12,padding:"10px 14px",border:"1px solid #ebe4dc"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              {["관계","깊이","상황","예산","마음"].map((l,i)=><span key={i} onClick={()=>{if(i<prog)go(i+1)}} style={{fontSize:10,color:i<prog?P:TX3,fontWeight:i<prog?700:400,transition:"all .3s",cursor:i<prog?"pointer":"default"}}>{l}</span>)}
            </div>
            <div style={{height:4,background:"#ebe4dc",borderRadius:3,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${(prog/5)*100}%`,background:`linear-gradient(90deg,${P},${P2})`,borderRadius:3,transition:"width .5s cubic-bezier(.4,0,.2,1)"}}/>
            </div>
          </div>
        )}

        <div style={{opacity:fade?1:0,transform:fade?"translateY(0)":"translateY(10px)",transition:"all .28s ease"}}>

          {/* S0 */}
          {step===0&&(
            <div style={{textAlign:"center",padding:"36px 0"}}>
              <div style={{fontSize:56,marginBottom:16,animation:"float 3s ease-in-out infinite"}}>🎁</div>
              <h2 style={{fontSize:21,fontWeight:700,color:TX,marginBottom:8,lineHeight:1.4}}>어떤 마음을<br/>전하고 싶으세요?</h2>
              <p style={{fontSize:14,color:TX2,lineHeight:1.7,marginBottom:32}}>선물이 아니라, 관계에서 전하고 싶은<br/>마음을 먼저 정리해드릴게요.</p>
              <Btn onClick={()=>go(1)} ms={280} style={{background:`linear-gradient(135deg,${P},${P2})`,color:"#fff",border:"none",borderRadius:14,padding:"15px 44px",fontSize:15,fontWeight:600,cursor:"pointer",boxShadow:`0 6px 24px ${P}35`,letterSpacing:.3}}>시작하기</Btn>
              <p style={{fontSize:11,color:TX3,marginTop:16}}>약 30초면 완료돼요</p>
            </div>
          )}

          {/* S1 */}
          {step===1&&(<div><SH n="01" title="누구에게 선물하나요?" sub="관계에 따라 적절한 선물이 달라져요" onBack={()=>go(0)}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>{RELATIONS.map(r=>(<Btn key={r.id} onClick={()=>{setRel(r);go(2)}} style={{...card,padding:"16px 12px"}}><span style={{fontSize:24}}>{r.icon}</span><div style={{fontSize:14,fontWeight:600,color:TX,marginTop:6}}>{r.label}</div><div style={{fontSize:11,color:TX2,marginTop:2}}>{r.desc}</div></Btn>))}</div></div>)}

          {/* S2 */}
          {step===2&&(<div><SH n="02" title={`${rel?.icon} ${rel?.label}과의 관계 깊이는?`} sub="관계의 깊이에 따라 선물의 무게감이 달라져요" onBack={()=>go(1)}/>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>{(rel?.depth||[]).map((d,i)=>(<Btn key={i} onClick={()=>{setDep(d);go(3)}} style={{...card,padding:"14px 18px",fontSize:14,color:TX,fontWeight:500}}><span style={{marginRight:10,opacity:.4,fontWeight:700}}>{i+1}</span>{d}</Btn>))}</div></div>)}

          {/* S3 */}
          {step===3&&(<div><SH n="03" title="어떤 상황인가요?" sub="상황에 따라 선물의 의미가 완전히 달라져요" onBack={()=>go(2)}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>{OCCASIONS.map(o=>(<Btn key={o.id} onClick={()=>{setOcc(o);go(4)}} style={{...card,padding:"14px 12px",textAlign:"center"}}><span style={{fontSize:22}}>{o.icon}</span><div style={{fontSize:13,fontWeight:600,color:TX,marginTop:5}}>{o.label}</div></Btn>))}</div></div>)}

          {/* S4 */}
          {step===4&&(<div><SH n="04" title="예산은 얼마 정도 생각하세요?" sub="예산에 맞는 최적의 선물을 찾아드릴게요" onBack={()=>go(3)}/>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>{BUDGETS.map(b=>(<Btn key={b.id} onClick={()=>{setBud(b);go(5)}} style={{...card,padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:14,fontWeight:600,color:TX}}>{b.label}</span><span style={{fontSize:11,color:P,background:`${P}10`,padding:"3px 10px",borderRadius:20,fontWeight:500}}>{b.tag}</span></Btn>))}</div></div>)}

          {/* S5 */}
          {step===5&&!loading&&results.length===0&&(
            <div>
              <SH n="05" title="어떤 마음을 전하고 싶으세요?" sub="이 한마디가 선물의 방향을 결정해요 (선택)" onBack={()=>go(4)}/>
              <textarea value={intent} onChange={e=>setIntent(e.target.value)} placeholder="예) 항상 곁에 있어줘서 고마워..."
                style={{width:"100%",minHeight:76,background:"rgba(255,255,255,.85)",border:"1.5px solid #ebe4dc",borderRadius:12,padding:"12px 16px",fontSize:14,color:TX,resize:"none",outline:"none",fontFamily:"inherit",lineHeight:1.6,boxSizing:"border-box",transition:"border-color .2s"}}
                onFocus={e=>e.target.style.borderColor=P} onBlur={e=>e.target.style.borderColor="#ebe4dc"}/>
              <div style={{display:"flex",flexWrap:"wrap",gap:6,margin:"10px 0 18px"}}>
                {(INTENT_HINTS[rel?.id]||INTENT_HINTS.friend).map((s,i)=>(
                  <button key={i} onClick={()=>setIntent(s)} style={{background:intent===s?`${P}15`:"rgba(255,255,255,.6)",border:`1px solid ${intent===s?P:"#e2dbd0"}`,borderRadius:20,padding:"5px 13px",fontSize:12,color:intent===s?P2:TX2,cursor:"pointer",transition:"all .15s",fontWeight:intent===s?600:400}}>{s}</button>
                ))}
              </div>
              <div style={{marginBottom:18}}>
                <div style={{fontSize:12,fontWeight:600,color:"#5a4a3a",marginBottom:8}}>🔍 이 사람 관심사 <span style={{fontWeight:400,color:TX3}}>(선택, 최대 5개)</span></div>
                <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                  {TAGS.map(t=>{const on=tags.includes(t.id);return(
                    <button key={t.id} onClick={()=>toggleTag(t.id)} style={{background:on?`${P}14`:"rgba(255,255,255,.6)",border:`1px solid ${on?P:"#e2dbd0"}`,borderRadius:20,padding:"4px 11px",fontSize:11,color:on?P2:TX2,cursor:"pointer",transition:"all .15s",fontWeight:on?600:400,boxShadow:on?`0 0 0 2px ${P}15`:"none"}}>{t.em} {t.label}</button>
                  );})}
                </div>
                {tags.length>0&&<div style={{fontSize:11,color:P,marginTop:6}}>{tags.length}개 선택됨 — AI가 취향 반영해서 추천해요</div>}
              </div>
              <div style={{background:"rgba(255,255,255,.6)",border:"1px solid #ebe4dc",borderRadius:12,padding:"12px 16px",marginBottom:18}}>
                <div style={{fontSize:11,color:P,fontWeight:600,marginBottom:6,letterSpacing:1}}>분석 요약</div>
                <div style={{fontSize:13,color:"#5a4a3a",lineHeight:1.7}}>{rel?.icon} {rel?.label} ({dep}) · {occ?.icon} {occ?.label} · {bud?.label}{tagLabels.length>0&&` · ${tagLabels.join(", ")}`}</div>
              </div>
              <Btn onClick={analyze} ms={300} style={{width:"100%",background:`linear-gradient(135deg,${P},${P2})`,color:"#fff",border:"none",borderRadius:14,padding:15,fontSize:15,fontWeight:600,cursor:"pointer",boxShadow:`0 6px 24px ${P}30`}}>AI 분석 시작하기 ✨</Btn>
              <button onClick={()=>{setIntent("");analyze()}} style={{width:"100%",background:"transparent",border:"none",color:TX3,fontSize:13,padding:12,cursor:"pointer",marginTop:4}}>건너뛰기 — AI가 알아서 판단할게요</button>
            </div>
          )}

          {/* Loading */}
          {loading&&(<div style={{textAlign:"center",padding:"60px 0"}}>
            <div style={{width:52,height:52,margin:"0 auto 24px",border:`3px solid #ebe4dc`,borderTop:`3px solid ${P}`,borderRadius:"50%",animation:"spin 1s linear infinite"}}/>
            <p style={{fontSize:15,color:"#5a4a3a",fontWeight:500,marginBottom:6}}>{LM[lm]}</p>
            <p style={{fontSize:12,color:TX3}}>{anaText} 최적의 선물을 찾고 있어요</p>
          </div>)}

          {/* Results */}
          {!loading&&results.length>0&&(<div>
            <div style={{background:`linear-gradient(135deg,${P}08,${P}0c)`,borderRadius:16,padding:20,marginBottom:18,border:`1px solid ${P}18`}}>
              <div style={{fontSize:11,letterSpacing:2,color:P,fontWeight:700,marginBottom:8}}>AI 분석 완료</div>
              <div style={{fontSize:15,color:TX,fontWeight:600,lineHeight:1.6,marginBottom:4}}>{anaText}</div>
              {intent&&<div style={{fontSize:13,color:TX2,fontStyle:"italic"}}>"{intent}"</div>}
              <div style={{fontSize:12,color:TX3,marginTop:6}}>예산 {bud?.label} · {bud?.tag} 선물</div>
              {tagLabels.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:8}}>{tagLabels.map((l,i)=><span key={i} style={{fontSize:11,background:`${P}10`,color:P2,padding:"2px 8px",borderRadius:10}}>{l}</span>)}</div>}
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              {results.map((g,i)=>{const sk=g.searchKeyword||g.sk||g.name;const url=mkUrl(sk,g.price);return(
                <div key={i} style={{background:"rgba(255,255,255,.92)",border:i===0?`2px solid ${P}`:"1.5px solid #ebe4dc",borderRadius:18,padding:18,position:"relative",overflow:"hidden",animation:`up .4s ease ${i*.15}s both`}}>
                  {i===0&&<div style={{position:"absolute",top:12,right:12,background:`linear-gradient(135deg,${P},${P2})`,color:"#fff",fontSize:10,fontWeight:700,padding:"4px 12px",borderRadius:20,letterSpacing:.5}}>BEST</div>}
                  <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
                    <Thumb name={g.name} sz={68}/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:15,fontWeight:700,color:TX,marginBottom:4,lineHeight:1.3}}>{g.name}</div>
                      <div style={{display:"inline-block",fontSize:12,color:P,fontWeight:700,background:`${P}0c`,padding:"2px 10px",borderRadius:6,marginBottom:8}}>{g.price}</div>
                      <div style={{fontSize:13,color:"#5a4a3a",lineHeight:1.7}}>{g.reason}</div>
                    </div>
                  </div>
                  <a href={url} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginTop:12,padding:"9px 14px",background:`${P}06`,border:`1px solid ${P}18`,borderRadius:10,textDecoration:"none",fontSize:13,color:"#5a4a3a",fontWeight:600}}>
                    <span>🔍</span> 상품 예시 보기 <span style={{fontSize:11,color:TX3,fontWeight:400}}>쿠팡</span><span style={{fontSize:12,marginLeft:"auto",color:P}}>→</span>
                  </a>
                </div>
              );})}
            </div>

            <div style={{background:`${P}06`,border:`1px dashed ${P}25`,borderRadius:12,padding:"12px 16px",marginTop:16}}>
              <div style={{fontSize:12,color:"#6a5a4a",lineHeight:1.7}}>💡 <strong>TIP</strong> — 선물과 함께 짧은 손편지를 곁들이면 마음이 더 잘 전달돼요.{intent&&` "${intent}" 이 마음을 직접 적어보는 건 어떨까요?`}</div>
            </div>
            <div style={{background:"rgba(0,0,0,.03)",border:"1px solid rgba(0,0,0,.07)",borderRadius:10,padding:"10px 14px",marginTop:10}}>
              <div style={{fontSize:11,color:"#a09585",lineHeight:1.7}}>📢 위 상품 링크는 <strong>쿠팡 파트너스</strong> 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.</div>
            </div>

            <div style={{marginTop:22,display:"flex",gap:10}}>
              <Btn onClick={restart} style={{flex:1,background:"rgba(255,255,255,.75)",border:"1.5px solid #ebe4dc",borderRadius:12,padding:13,fontSize:13,color:"#5a4a3a",fontWeight:600,cursor:"pointer"}}>처음부터 다시</Btn>
              <Btn onClick={()=>{setResults([]);setIntent("");go(5)}} style={{flex:1,background:`linear-gradient(135deg,${P},${P2})`,border:"none",borderRadius:12,padding:13,fontSize:13,color:"#fff",fontWeight:600,cursor:"pointer"}}>마음을 바꿔서 다시</Btn>
            </div>

            <div style={{textAlign:"center",marginTop:28,paddingBottom:16}}>
              <div style={{display:"inline-flex",alignItems:"center",gap:6,marginBottom:4}}>
                <div style={{width:18,height:18,borderRadius:6,background:`linear-gradient(135deg,${P},${P2})`,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:"#fff",fontSize:9}}>♥</span></div>
                <span style={{fontSize:13,fontWeight:600,color:TX}}>마로</span>
              </div>
              <div style={{fontSize:10,letterSpacing:2,color:TX3}}>마음을 새기는 선물</div>
            </div>
          </div>)}
        </div>
      </div>
    </div>
  );
}
