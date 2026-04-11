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

const VIS={"핸드크림":{bg:"#fce4ec",ac:"#e8a0a0",ic:"🧴"},"로션":{bg:"#fce4ec",ac:"#e8a0a0",ic:"🧴"},"기프트카드":{bg:"#fff3e0",ac:"#e8b87a",ic:"💳"},"기프티콘":{bg:"#fff3e0",ac:"#e8b87a",ic:"☕"},"디퓨저":{bg:"#e8f5e9",ac:"#81c784",ic:"🌿"},"캔들":{bg:"#fff8e1",ac:"#dbc07a",ic:"🕯️"},"향수":{bg:"#f3e5f5",ac:"#c490c4",ic:"🌸"},"지갑":{bg:"#efebe9",ac:"#a1887f",ic:"👛"},"카드홀더":{bg:"#efebe9",ac:"#a1887f",ic:"👛"},"이어폰":{bg:"#e3f2fd",ac:"#7aaed4",ic:"🎧"},"스피커":{bg:"#e0f2f1",ac:"#6db5a8",ic:"🔊"},"가방":{bg:"#fbe9e7",ac:"#d4877a",ic:"👜"},"백팩":{bg:"#fbe9e7",ac:"#d4877a",ic:"🎒"},"시계":{bg:"#eceff1",ac:"#90a4ae",ic:"⌚"},"워치":{bg:"#eceff1",ac:"#90a4ae",ic:"⌚"},"아기":{bg:"#e1f5fe",ac:"#7abcd4",ic:"👶"},"턱받이":{bg:"#e1f5fe",ac:"#7abcd4",ic:"🍼"},"유모차":{bg:"#e8eaf6",ac:"#8a92b8",ic:"🚼"},"카시트":{bg:"#e0f7fa",ac:"#6dbcc4",ic:"🚗"},"침구":{bg:"#fce4ec",ac:"#e8a0a0",ic:"🛏️"},"이불":{bg:"#fce4ec",ac:"#e8a0a0",ic:"🛏️"},"청소기":{bg:"#e0f7fa",ac:"#6dbcc4",ic:"🤖"},"커피머신":{bg:"#efebe9",ac:"#8d6e63",ic:"☕"},"커피":{bg:"#efebe9",ac:"#8d6e63",ic:"☕"},"디저트":{bg:"#fce4ec",ac:"#e8a0a0",ic:"🍰"},"케이크":{bg:"#fce4ec",ac:"#e8a0a0",ic:"🎂"},"식기":{bg:"#fff3e0",ac:"#e8b87a",ic:"🍽️"},"냄비":{bg:"#fff3e0",ac:"#e8b87a",ic:"🍳"},"수건":{bg:"#e3f2fd",ac:"#7aaed4",ic:"🛁"},"타올":{bg:"#e3f2fd",ac:"#7aaed4",ic:"🛁"},"와인":{bg:"#f3e5f5",ac:"#ab6fab",ic:"🍷"},"샴페인":{bg:"#f3e5f5",ac:"#ab6fab",ic:"🍾"},"호텔":{bg:"#fff8e1",ac:"#dbc07a",ic:"🏨"},"레스토랑":{bg:"#fff3e0",ac:"#d4977a",ic:"🍽️"},"식사권":{bg:"#fff3e0",ac:"#d4977a",ic:"🍽️"},"스파":{bg:"#e0f2f1",ac:"#6db5a8",ic:"💆"},"명품":{bg:"#f3e5f5",ac:"#9c6f9c",ic:"💎"},"액세서리":{bg:"#f3e5f5",ac:"#9c6f9c",ic:"💎"},"전자기기":{bg:"#eceff1",ac:"#78909c",ic:"📱"},"무드등":{bg:"#fff8e1",ac:"#dbc07a",ic:"💡"},"조명":{bg:"#fff8e1",ac:"#dbc07a",ic:"💡"},"꽃다발":{bg:"#fce4ec",ac:"#e8a0a0",ic:"💐"},"꽃":{bg:"#fce4ec",ac:"#e8a0a0",ic:"💐"},"차":{bg:"#e8f5e9",ac:"#66bb6a",ic:"🍵"},"매트리스":{bg:"#e8eaf6",ac:"#8a92b8",ic:"💤"},"공기청정기":{bg:"#e0f7fa",ac:"#6dbcc4",ic:"🌬️"},"아기띠":{bg:"#e8eaf6",ac:"#8a92b8",ic:"👨‍👩‍👧"},"바운서":{bg:"#e1f5fe",ac:"#7abcd4",ic:"🍼"},"기저귀":{bg:"#e1f5fe",ac:"#7abcd4",ic:"👶"},"의류":{bg:"#fce4ec",ac:"#e8a0a0",ic:"👕"},"양말":{bg:"#e1f5fe",ac:"#7abcd4",ic:"🧦"},"가제":{bg:"#e3f2fd",ac:"#7aaed4",ic:"🤍"},"산후조리":{bg:"#fce4ec",ac:"#e8a0a0",ic:"💆‍♀️"},"한우":{bg:"#ffebee",ac:"#d47a7a",ic:"🥩"},"갈비":{bg:"#ffebee",ac:"#d47a7a",ic:"🥩"},"건강":{bg:"#e8f5e9",ac:"#66bb6a",ic:"💊"},"견과":{bg:"#fff3e0",ac:"#e8b87a",ic:"🥜"},"한과":{bg:"#fff8e1",ac:"#dbc07a",ic:"🍡"},"참기름":{bg:"#fff3e0",ac:"#e8b87a",ic:"🫒"},"과일":{bg:"#e8f5e9",ac:"#66bb6a",ic:"🍎"},"죽":{bg:"#fff3e0",ac:"#e8b87a",ic:"🍲"},"만년필":{bg:"#eceff1",ac:"#78909c",ic:"🖊️"},"명함":{bg:"#efebe9",ac:"#a1887f",ic:"👔"},"팔찌":{bg:"#f3e5f5",ac:"#c490c4",ic:"💍"},"반지":{bg:"#f3e5f5",ac:"#c490c4",ic:"💍"},"목걸이":{bg:"#f3e5f5",ac:"#c490c4",ic:"💎"},"포토":{bg:"#fff3e0",ac:"#e8b87a",ic:"📸"},"화분":{bg:"#e8f5e9",ac:"#66bb6a",ic:"🪴"},"엽서":{bg:"#fce4ec",ac:"#e8a0a0",ic:"💌"},"간식":{bg:"#fff3e0",ac:"#e8b87a",ic:"🍫"},"머그":{bg:"#efebe9",ac:"#8d6e63",ic:"☕"},"액자":{bg:"#fff3e0",ac:"#e8b87a",ic:"📷"},"인센스":{bg:"#e8f5e9",ac:"#81c784",ic:"🌿"},"에센스":{bg:"#fce4ec",ac:"#e8a0a0",ic:"💧"},"립밤":{bg:"#fce4ec",ac:"#e8a0a0",ic:"💋"},"텀블러":{bg:"#e0f7fa",ac:"#6dbcc4",ic:"🥤"},"에코백":{bg:"#e8f5e9",ac:"#66bb6a",ic:"👜"},"파자마":{bg:"#f3e5f5",ac:"#c490c4",ic:"👘"},"쿠션":{bg:"#fff8e1",ac:"#dbc07a",ic:"🛋️"},"담요":{bg:"#fce4ec",ac:"#e8a0a0",ic:"🧣"},"보조배터리":{bg:"#eceff1",ac:"#78909c",ic:"🔋"},"노트":{bg:"#efebe9",ac:"#a1887f",ic:"📓"},"다이어리":{bg:"#efebe9",ac:"#a1887f",ic:"📔"},"홍삼":{bg:"#ffebee",ac:"#d47a7a",ic:"💊"},"꿀":{bg:"#fff8e1",ac:"#dbc07a",ic:"🍯"},"올리브오일":{bg:"#e8f5e9",ac:"#66bb6a",ic:"🫒"},"비타민":{bg:"#e8f5e9",ac:"#66bb6a",ic:"💊"}};
const VD={bg:"#f7f0eb",ac:"#c4756e",ic:"🎁"};
function gv(n){const k=Object.keys(VIS).find(k=>n.includes(k));return k?VIS[k]:VD;}

// ── Category representative images (Unsplash free) ──
const IMG={
  "핸드크림":"photo-1556228578-0d85b1a4d571","로션":"photo-1556228578-0d85b1a4d571",
  "향수":"photo-1541643600914-78b084683601","퍼퓸":"photo-1541643600914-78b084683601","코롱":"photo-1541643600914-78b084683601",
  "디퓨저":"photo-1602928321679-560bb453f190","인센스":"photo-1602928321679-560bb453f190",
  "캔들":"photo-1603006905003-be475563bc59","양초":"photo-1603006905003-be475563bc59",
  "지갑":"photo-1627123424574-724758594e93","카드홀더":"photo-1627123424574-724758594e93",
  "이어폰":"photo-1590658268037-6bf12f032f55","헤드폰":"photo-1505740420928-5e560c06d30e","에어팟":"photo-1590658268037-6bf12f032f55",
  "스피커":"photo-1608043152269-423dbba4e7e1","블루투스":"photo-1608043152269-423dbba4e7e1",
  "가방":"photo-1584917865442-de89df76afd3","백팩":"photo-1553062407-98eeb64c6a62",
  "시계":"photo-1524592094714-0f0654e20314","워치":"photo-1524592094714-0f0654e20314","스마트워치":"photo-1546868871-af0de0ae72be",
  "커피":"photo-1509042239860-f550ce710b93","커피머신":"photo-1495474472287-4d71bcdd2085","드립":"photo-1495474472287-4d71bcdd2085",
  "와인":"photo-1510812431401-41d2bd2722f3","샴페인":"photo-1510812431401-41d2bd2722f3",
  "꽃":"photo-1487530811176-3780de880c2d","꽃다발":"photo-1487530811176-3780de880c2d","꽃바구니":"photo-1487530811176-3780de880c2d",
  "케이크":"photo-1578985545062-69928b1d9587","디저트":"photo-1551024601-bec78aea704b",
  "초콜릿":"photo-1549007994-cb92caebd54b","간식":"photo-1549007994-cb92caebd54b",
  "차":"photo-1556679343-c7306c1976bc","티백":"photo-1556679343-c7306c1976bc","허브티":"photo-1556679343-c7306c1976bc",
  "수건":"photo-1583845112203-29329902332e","타올":"photo-1583845112203-29329902332e",
  "화분":"photo-1459411552884-841db9b3cc2a","식물":"photo-1459411552884-841db9b3cc2a",
  "무드등":"photo-1513506003901-1e6a229e2d15","조명":"photo-1513506003901-1e6a229e2d15",
  "텀블러":"photo-1602143407151-7111542de6e8","보온":"photo-1602143407151-7111542de6e8",
  "견과":"photo-1608797178974-15b35a64ede9","견과류":"photo-1608797178974-15b35a64ede9",
  "과일":"photo-1619566636858-adf3ef46400b","과일세트":"photo-1619566636858-adf3ef46400b",
  "홍삼":"photo-1563822249510-04678c3ae8d2","건강":"photo-1563822249510-04678c3ae8d2","비타민":"photo-1563822249510-04678c3ae8d2",
  "한우":"photo-1603048297172-c92544798d5a","갈비":"photo-1603048297172-c92544798d5a",
  "올리브":"photo-1474979266404-7eaacbcd87c5","꿀":"photo-1587049352846-4a222e784d38",
  "아기":"photo-1519689680058-324335c77eba","턱받이":"photo-1519689680058-324335c77eba","기저귀":"photo-1519689680058-324335c77eba",
  "유모차":"photo-1591261731048-dd1fcc658e06","카시트":"photo-1591261731048-dd1fcc658e06",
  "침구":"photo-1631049307264-da0ec9d70304","이불":"photo-1631049307264-da0ec9d70304","파자마":"photo-1631049307264-da0ec9d70304",
  "청소기":"photo-1558618666-fcd25c85f82e","로봇청소기":"photo-1558618666-fcd25c85f82e",
  "냄비":"photo-1556909114-f6e7ad7d3136","팬":"photo-1556909114-f6e7ad7d3136","식기":"photo-1556909114-f6e7ad7d3136",
  "만년필":"photo-1585336261022-680e295ce3fe","볼펜":"photo-1585336261022-680e295ce3fe","펜":"photo-1585336261022-680e295ce3fe",
  "노트":"photo-1531346878377-a5be20888e57","다이어리":"photo-1531346878377-a5be20888e57",
  "팔찌":"photo-1573408301185-9146fe634ad0","반지":"photo-1605100804763-247f67b3557e","목걸이":"photo-1599643478518-a784e5dc4c8f","주얼리":"photo-1599643478518-a784e5dc4c8f",
  "액자":"photo-1513519245088-0e12902e35ca","포토":"photo-1513519245088-0e12902e35ca",
  "쿠션":"photo-1584100936595-c0c02b55d2c7","담요":"photo-1584100936595-c0c02b55d2c7",
  "에코백":"photo-1597484662317-9bd7bdda2907",
  "립밤":"photo-1586495777744-4413f21062fa","립":"photo-1586495777744-4413f21062fa",
  "입욕제":"photo-1570172619644-dfd03ed5d881","바디":"photo-1570172619644-dfd03ed5d881",
  "스카프":"photo-1601924921557-45e8e0220532",
  "카메라":"photo-1516035069371-29a1b244cc32",
  "전자책":"photo-1544716278-ca5e3f4abd8c",
  "기프트카드":"photo-1556742049-0cfed4f6a45d","기프티콘":"photo-1556742049-0cfed4f6a45d",
  "호텔":"photo-1566073771259-6a8506099945","스파":"photo-1544161515-4ab6ce6db874",
  "레스토랑":"photo-1414235077428-338989a2e8c0","식사권":"photo-1414235077428-338989a2e8c0",
  "명품":"photo-1600003014755-ba31aa59c4b6","럭셔리":"photo-1600003014755-ba31aa59c4b6",
  "공기청정기":"photo-1585771724684-38269d6639fd",
};
function gimg(n){
  const k=Object.keys(IMG).find(k=>n.includes(k));
  return k?`https://images.unsplash.com/${IMG[k]}?w=140&h=140&fit=crop&auto=format&q=80`:null;
}

// ── Shuffle utility ──
function shuffle(arr){
  const a=[...arr];
  for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
  return a;
}

// ══════════════════════════════════════
// ── EXPANDED Fallback DB (6+ items per combo, randomly pick 3) ──
// ══════════════════════════════════════
const FB={
  // ── 생일 ──
  "birthday|b1":[
    {name:"프리미엄 핸드크림 세트",price:"1~2만원",reason:"매일 쓸 때마다 생각나는 감성적인 선물이에요.",sk:"핸드크림 선물세트"},
    {name:"카페 기프트카드",price:"1~2만원",reason:"부담 없이 받을 수 있으면서도 센스 있는 선물이에요.",sk:"스타벅스 기프트카드"},
    {name:"감성 디저트 세트",price:"1~2만원",reason:"생일의 달콤함을 더해주는 특별한 간식이에요.",sk:"선물용 디저트 세트"},
    {name:"미니 꽃다발 + 엽서",price:"1~2만원",reason:"작지만 마음이 가득 담긴 생일 선물이에요.",sk:"미니 꽃다발 선물"},
    {name:"감성 머그컵",price:"1~2만원",reason:"매일 아침 커피를 마실 때마다 떠올리게 되는 선물이에요.",sk:"감성 머그컵 선물"},
    {name:"프리미엄 립밤 세트",price:"1~2만원",reason:"실용적이면서도 센스있는 뷰티 아이템이에요.",sk:"프리미엄 립밤 세트"},
    {name:"아로마 입욕제 세트",price:"1~2만원",reason:"바쁜 일상 속 작은 힐링을 선물하는 거예요.",sk:"입욕제 선물 세트"},
  ],
  "birthday|b2":[
    {name:"브랜드 향수 미니어처 세트",price:"3~5만원",reason:"여러 향을 체험할 수 있어서 특별하고 센스 있어 보여요.",sk:"향수 미니어처 세트"},
    {name:"감성 무드등",price:"3~5만원",reason:"공간에 분위기를 더해주는 특별한 인테리어 선물이에요.",sk:"감성 무드등"},
    {name:"프리미엄 디퓨저 세트",price:"3~5만원",reason:"향기가 날 때마다 생각나는 감성적인 선물이에요.",sk:"프리미엄 디퓨저 세트"},
    {name:"보온 텀블러",price:"3~4만원",reason:"매일 들고 다니는 실용템이라 자주 떠올리게 돼요.",sk:"프리미엄 텀블러 선물"},
    {name:"실크 파자마",price:"3~5만원",reason:"매일 밤 편안함을 선물하는 센스 있는 아이템이에요.",sk:"실크 파자마 선물"},
    {name:"프리미엄 초콜릿 세트",price:"3~5만원",reason:"생일의 달콤함을 배로 만들어주는 고급 초콜릿이에요.",sk:"프리미엄 초콜릿 선물세트"},
    {name:"감성 인센스 세트",price:"3~4만원",reason:"명상과 힐링의 시간을 선물하는 향기 아이템이에요.",sk:"인센스 선물세트"},
  ],
  "birthday|b3":[
    {name:"브랜드 지갑·카드홀더",price:"7~10만원",reason:"매일 쓰는 물건이라 오래 기억에 남는 실용적인 선물이에요.",sk:"브랜드 카드지갑 선물"},
    {name:"프리미엄 블루투스 이어폰",price:"8~10만원",reason:"매일 쓰는 아이템이라 가장 실용적인 선물이에요.",sk:"블루투스 이어폰"},
    {name:"고급 레스토랑 식사권",price:"6~10만원",reason:"특별한 날 특별한 경험을 선물하는 거예요.",sk:"레스토랑 식사권"},
    {name:"프리미엄 블루투스 스피커",price:"7~10만원",reason:"음악과 함께하는 일상을 더 풍성하게 만들어줘요.",sk:"블루투스 스피커 선물"},
    {name:"고급 캔들 세트",price:"7~9만원",reason:"은은한 향으로 공간을 채우는 럭셔리한 선물이에요.",sk:"고급 캔들 세트 선물"},
    {name:"스마트 체중계 세트",price:"6~8만원",reason:"건강을 챙기는 스마트한 선물이에요.",sk:"스마트 체중계"},
  ],
  "birthday|b4":[
    {name:"브랜드 가방",price:"15~20만원",reason:"오래 쓸 수 있는 특별한 선물. 매일 함께하니까요.",sk:"브랜드 가방"},
    {name:"스마트워치",price:"15~20만원",reason:"건강도 챙기고 일상도 편리해지는 스마트한 선물이에요.",sk:"스마트워치"},
    {name:"프리미엄 향수 정품",price:"12~18만원",reason:"고급스러운 향기로 특별한 날을 기억하게 해줘요.",sk:"프리미엄 향수"},
    {name:"노이즈캔슬링 헤드폰",price:"15~20만원",reason:"나만의 세계에 빠질 수 있는 몰입감 선물이에요.",sk:"노이즈캔슬링 헤드폰"},
    {name:"전자책 리더기",price:"12~18만원",reason:"책을 좋아하는 사람에겐 세상 최고의 선물이에요.",sk:"전자책 리더기"},
    {name:"프리미엄 만년필",price:"12~18만원",reason:"글을 쓸 때마다 특별한 순간을 만들어주는 선물이에요.",sk:"프리미엄 만년필 선물"},
  ],
  "birthday|b5":[
    {name:"명품 액세서리",price:"25~40만원",reason:"오래도록 간직할 수 있는 의미 있는 선물이에요.",sk:"명품 액세서리"},
    {name:"프리미엄 전자기기",price:"25~50만원",reason:"정말 갖고 싶었던 걸 선물받는 기쁨은 특별해요.",sk:"에어팟 맥스"},
    {name:"호텔 스파 패키지",price:"20~35만원",reason:"잊을 수 없는 경험을 선물하는 거예요.",sk:"호텔 숙박 패키지"},
    {name:"명품 지갑",price:"25~40만원",reason:"매일 손에 닿는 럭셔리. 오랫동안 함께해요.",sk:"명품 지갑"},
    {name:"프리미엄 카메라",price:"30~50만원",reason:"추억을 담는 특별한 도구를 선물하는 거예요.",sk:"미러리스 카메라"},
    {name:"고급 시계",price:"25~50만원",reason:"시간이 흘러도 변하지 않는 마음을 담은 선물이에요.",sk:"브랜드 시계 선물"},
  ],
  // ── 기념일 ──
  "anniversary|b1":[
    {name:"커플 머그컵 세트",price:"1~2만원",reason:"함께 마시는 커피가 더 특별해지는 선물이에요.",sk:"커플 머그컵"},
    {name:"미니 꽃다발",price:"1~2만원",reason:"작지만 진심이 담긴 기념일의 클래식이에요.",sk:"미니 꽃다발 선물"},
    {name:"감성 포토 앨범",price:"1~2만원",reason:"둘만의 추억을 담는 소중한 공간이에요.",sk:"감성 포토앨범"},
    {name:"향기 있는 편지 세트",price:"1~2만원",reason:"손글씨와 향기로 마음을 전하는 아날로그 감성이에요.",sk:"편지지 세트 선물"},
    {name:"커플 양말 세트",price:"1~2만원",reason:"소소하지만 '우리'라는 느낌을 주는 귀여운 선물이에요.",sk:"커플 양말 세트"},
  ],
  "anniversary|b2":[
    {name:"프리미엄 꽃다발",price:"3~5만원",reason:"기념일에 꽃은 절대 실패하지 않는 선물이에요.",sk:"꽃다발 배달"},
    {name:"커플 향수 미니 세트",price:"3~5만원",reason:"같은 향을 공유하는 건 특별한 친밀감이에요.",sk:"커플 향수 세트"},
    {name:"프리미엄 케이크 주문",price:"3~5만원",reason:"둘만의 특별한 케이크로 기념일을 축하해요.",sk:"주문 케이크 기념일"},
    {name:"감성 액자 + 사진 인화",price:"3~5만원",reason:"둘만의 순간을 인테리어로 남기는 선물이에요.",sk:"감성 액자 사진"},
    {name:"프리미엄 바디케어 세트",price:"3~5만원",reason:"향기로운 일상을 선물하는 감성적인 아이템이에요.",sk:"바디케어 선물세트"},
  ],
  "anniversary|b3":[
    {name:"프리미엄 향수",price:"8~10만원",reason:"향기는 기억을 가장 오래 남기는 선물이에요.",sk:"프리미엄 향수 선물"},
    {name:"커플 팔찌",price:"7~10만원",reason:"서로의 손목에서 '우리'를 확인하는 특별한 선물이에요.",sk:"커플 팔찌"},
    {name:"호텔 디너 코스",price:"8~10만원",reason:"특별한 공간에서 특별한 시간을 보내는 선물이에요.",sk:"호텔 디너 코스"},
    {name:"프리미엄 디퓨저 + 캔들 세트",price:"7~9만원",reason:"집에서도 로맨틱한 분위기를 만들어주는 선물이에요.",sk:"고급 디퓨저 캔들 세트"},
    {name:"브랜드 스카프",price:"8~10만원",reason:"격식 있으면서도 감성적인 패션 아이템이에요.",sk:"브랜드 스카프 선물"},
  ],
  "anniversary|b4":[
    {name:"명품 주얼리",price:"15~20만원",reason:"기념일의 무게감에 어울리는 의미 있는 선물이에요.",sk:"명품 주얼리 선물"},
    {name:"호텔 스테이 패키지",price:"15~20만원",reason:"일상을 벗어나 둘만의 시간을 보내는 특별한 경험이에요.",sk:"호텔 스테이 패키지"},
    {name:"프리미엄 시계",price:"15~20만원",reason:"시간이 흘러도 변하지 않는 마음을 담아요.",sk:"브랜드 시계 선물"},
    {name:"브랜드 가방",price:"15~20만원",reason:"매일 들고 다니며 우리의 기념일을 기억하게 해요.",sk:"브랜드 가방 선물"},
  ],
  // ── 감사 인사 ──
  "thanks|b1":[
    {name:"프리미엄 티백 세트",price:"1~2만원",reason:"따뜻한 차 한 잔과 함께 감사의 마음을 전해요.",sk:"프리미엄 티백 선물"},
    {name:"고급 손수건",price:"1~2만원",reason:"격식 있으면서 부담 없는 감사 표현이에요.",sk:"고급 손수건 선물"},
    {name:"프리미엄 핸드크림",price:"1~2만원",reason:"실용적이면서 감사의 마음이 잘 전해지는 선물이에요.",sk:"핸드크림 선물"},
    {name:"꿀 선물 세트",price:"1~2만원",reason:"달콤한 마음을 전하는 건강한 선물이에요.",sk:"꿀 선물세트"},
    {name:"감성 노트 + 펜 세트",price:"1~2만원",reason:"깔끔하고 센스 있는 감사 선물이에요.",sk:"노트 펜 선물세트"},
  ],
  "thanks|b2":[
    {name:"프리미엄 차 선물 세트",price:"3~5만원",reason:"격식 있으면서 부담 없는 감사의 표현이에요.",sk:"차 선물세트"},
    {name:"고급 올리브오일 세트",price:"3~5만원",reason:"건강을 생각하는 고급스러운 감사 선물이에요.",sk:"올리브오일 선물세트"},
    {name:"프리미엄 견과류 세트",price:"3~5만원",reason:"건강을 챙기는 정성 담긴 감사 선물이에요.",sk:"견과류 선물세트"},
    {name:"감성 디퓨저",price:"3~4만원",reason:"공간에 향기를 남기는 세련된 감사 표현이에요.",sk:"디퓨저 선물"},
    {name:"프리미엄 드립커피 세트",price:"3~5만원",reason:"커피를 좋아하는 분께 딱 맞는 감사 선물이에요.",sk:"드립커피 선물세트"},
  ],
  "thanks|b3":[
    {name:"브랜드 텀블러",price:"5~8만원",reason:"매일 쓰면서 감사의 마음을 떠올리게 하는 선물이에요.",sk:"브랜드 텀블러 선물"},
    {name:"프리미엄 와인 + 치즈 세트",price:"7~10만원",reason:"품격 있는 감사의 표현. 함께 즐기면 더 좋아요.",sk:"와인 치즈 선물세트"},
    {name:"고급 만년필",price:"7~10만원",reason:"글을 쓸 때마다 감사의 마음이 전해지는 선물이에요.",sk:"만년필 선물"},
    {name:"프리미엄 홍삼 세트",price:"7~10만원",reason:"건강을 챙기는 정성이 담긴 한국적인 감사 표현이에요.",sk:"홍삼 선물세트"},
  ],
  // ── 축하 ──
  "congrats|b1":[
    {name:"축하 케이크 기프티콘",price:"1~2만원",reason:"달콤한 축하의 메시지를 전해요.",sk:"케이크 기프티콘"},
    {name:"응원 문구 머그컵",price:"1~2만원",reason:"매일 아침 힘을 주는 응원 메시지 선물이에요.",sk:"응원 머그컵 선물"},
    {name:"미니 꽃바구니",price:"1~2만원",reason:"작지만 환한 축하의 마음을 전해요.",sk:"미니 꽃바구니"},
    {name:"고급 볼펜 세트",price:"1~2만원",reason:"새로운 시작을 함께하는 실용적인 축하 선물이에요.",sk:"고급 볼펜 선물"},
  ],
  "congrats|b2":[
    {name:"프리미엄 꽃다발",price:"3~5만원",reason:"축하의 자리에 빠질 수 없는 화사한 선물이에요.",sk:"축하 꽃다발"},
    {name:"브랜드 다이어리 + 펜",price:"3~5만원",reason:"새로운 챕터를 열어가는 멋진 도구예요.",sk:"브랜드 다이어리 펜 세트"},
    {name:"프리미엄 샴페인",price:"3~5만원",reason:"축하의 순간을 더 빛나게 하는 거품이에요.",sk:"샴페인 선물"},
    {name:"고급 초콜릿 세트",price:"3~5만원",reason:"달콤한 축하의 마음을 전하는 선물이에요.",sk:"고급 초콜릿 선물세트"},
  ],
  // ── 집들이 ──
  "housewarming|b1":[
    {name:"감성 수건 세트",price:"1~2만원",reason:"집들이 선물의 클래식. 누구나 기뻐하는 실용템이에요.",sk:"고급 수건 선물세트"},
    {name:"미니 화분",price:"1~2만원",reason:"새 공간에 생기를 불어넣는 작은 그린 선물이에요.",sk:"미니 화분 선물"},
    {name:"디퓨저",price:"1~2만원",reason:"새 집에 좋은 향기를 채워주는 센스 있는 선물이에요.",sk:"디퓨저 선물"},
    {name:"핸드 비누 세트",price:"1~2만원",reason:"부담 없이 세련된 집들이 선물이에요.",sk:"고급 핸드비누 세트"},
  ],
  "housewarming|b2":[
    {name:"프리미엄 디퓨저 세트",price:"3~5만원",reason:"새 집을 좋은 향기로 채우는 감성적인 선물이에요.",sk:"프리미엄 디퓨저"},
    {name:"감성 인테리어 소품",price:"3~5만원",reason:"새 공간에 포인트를 줄 수 있는 인테리어 아이템이에요.",sk:"인테리어 소품 선물"},
    {name:"프리미엄 올리브오일 세트",price:"3~5만원",reason:"주방을 시작하는 새 집에 딱 맞는 식재료 선물이에요.",sk:"올리브오일 선물세트"},
    {name:"고급 수건 세트",price:"3~5만원",reason:"새 집에 꼭 필요한 실용적이면서 고급스러운 선물이에요.",sk:"프리미엄 수건세트"},
    {name:"감성 쿠션 커버",price:"3~5만원",reason:"거실 분위기를 바꿔주는 인테리어 선물이에요.",sk:"감성 쿠션커버"},
  ],
  "housewarming|b3":[
    {name:"프리미엄 캔들 세트",price:"7~10만원",reason:"분위기 있는 저녁을 만들어주는 럭셔리 아이템이에요.",sk:"고급 캔들 세트"},
    {name:"로봇청소기",price:"8~10만원",reason:"새 집을 깨끗하게 유지하는 가장 실용적인 선물이에요.",sk:"로봇청소기"},
    {name:"블루투스 스피커",price:"7~10만원",reason:"새 집에 음악을 채워주는 감성적인 선물이에요.",sk:"블루투스 스피커"},
    {name:"프리미엄 식기 세트",price:"7~10만원",reason:"새 집 식탁을 빛나게 하는 고급스러운 선물이에요.",sk:"프리미엄 식기 세트"},
  ],
  // ── 병문안·위로 ──
  "recovery|b1":[
    {name:"프리미엄 죽 세트",price:"1~2만원",reason:"아플 때 가장 위로가 되는 건 따뜻한 한 끼예요.",sk:"죽 선물세트"},
    {name:"비타민 세트",price:"1~2만원",reason:"빠른 회복을 바라는 건강한 마음이에요.",sk:"비타민 세트"},
    {name:"따뜻한 담요",price:"1~2만원",reason:"포근한 감싸줌으로 위로의 마음을 전해요.",sk:"담요 선물"},
    {name:"허브티 세트",price:"1~2만원",reason:"마음을 편안하게 해주는 따뜻한 선물이에요.",sk:"허브티 선물세트"},
  ],
  "recovery|b2":[
    {name:"프리미엄 과일 세트",price:"3~5만원",reason:"신선한 과일로 건강 회복의 마음을 전해요.",sk:"과일 선물세트"},
    {name:"건강즙 선물 세트",price:"3~5만원",reason:"진심 어린 건강 기원의 마음을 담은 선물이에요.",sk:"건강즙 선물세트"},
    {name:"프리미엄 홍삼 스틱",price:"3~5만원",reason:"회복에 도움이 되는 전통 건강 선물이에요.",sk:"홍삼 스틱 선물"},
    {name:"아로마테라피 세트",price:"3~5만원",reason:"몸과 마음의 치유를 돕는 힐링 선물이에요.",sk:"아로마테라피 세트"},
  ],
  // ── 명절 ──
  "holiday|b2":[
    {name:"한우 선물세트",price:"3~5만원",reason:"명절에 가장 환영받는 고급 식재료 선물이에요.",sk:"한우 선물세트"},
    {name:"프리미엄 견과류 세트",price:"3~5만원",reason:"건강을 생각하는 정성 담긴 명절 선물이에요.",sk:"견과류 선물세트"},
    {name:"참기름 세트",price:"3~5만원",reason:"한국적인 정성이 담긴 실용적인 명절 선물이에요.",sk:"참기름 들기름 세트"},
    {name:"과일 선물세트",price:"3~5만원",reason:"명절의 클래식. 정성을 보여주는 대표 선물이에요.",sk:"과일 선물세트"},
    {name:"한과 세트",price:"3~5만원",reason:"한국적인 멋과 맛이 담긴 전통 명절 선물이에요.",sk:"한과 선물세트"},
  ],
  "holiday|b3":[
    {name:"프리미엄 한우 세트",price:"7~10만원",reason:"명절 선물의 왕도. 누구나 기뻐하는 선물이에요.",sk:"프리미엄 한우 선물세트"},
    {name:"프리미엄 갈비 세트",price:"7~10만원",reason:"온 가족이 함께 즐길 수 있는 푸짐한 선물이에요.",sk:"갈비 선물세트"},
    {name:"고급 홍삼 세트",price:"7~10만원",reason:"어른들의 건강을 챙기는 정성 가득한 선물이에요.",sk:"홍삼 선물세트"},
    {name:"프리미엄 굴비 세트",price:"7~10만원",reason:"격식 있는 명절 인사에 딱 맞는 전통 선물이에요.",sk:"굴비 선물세트"},
  ],
  // ── 출산 ──
  "baby|b1":[
    {name:"오가닉 아기 턱받이 세트",price:"1~2만원",reason:"실용적이면서 부담 없는 출산 선물이에요.",sk:"아기 턱받이 세트"},
    {name:"아기 양말·손싸개 세트",price:"1~2만원",reason:"신생아 필수 아이템이에요.",sk:"신생아 양말 세트"},
    {name:"아기 가제 수건 세트",price:"1~2만원",reason:"매일 여러 장 쓰는 필수품이에요.",sk:"아기 가제수건"},
    {name:"아기 딸랑이 세트",price:"1~2만원",reason:"아이의 첫 장난감으로 딱 좋은 선물이에요.",sk:"아기 딸랑이 선물"},
    {name:"수유 쿠션",price:"1~2만원",reason:"엄마의 편안한 수유를 도와주는 실용적인 선물이에요.",sk:"수유쿠션"},
  ],
  "baby|b2":[
    {name:"유기농 베이비 로션 세트",price:"3~5만원",reason:"아기 피부를 생각하는 세심한 마음이에요.",sk:"유기농 베이비 로션 세트"},
    {name:"이유식 용기 세트",price:"2~4만원",reason:"곧 시작할 이유식에 꼭 필요한 센스 있는 선물이에요.",sk:"이유식 용기 세트"},
    {name:"프리미엄 기저귀 대용량",price:"3~4만원",reason:"실용적인 출산 선물 1위예요.",sk:"프리미엄 기저귀"},
    {name:"아기 목욕 세트",price:"3~5만원",reason:"아기의 첫 목욕을 특별하게 만들어주는 선물이에요.",sk:"아기 목욕세트"},
    {name:"유기농 아기 의류 세트",price:"3~5만원",reason:"부드러운 소재로 아기를 감싸는 따뜻한 선물이에요.",sk:"유기농 아기옷 세트"},
  ],
  "baby|b3":[
    {name:"아기 바운서",price:"7~10만원",reason:"육아 부담을 덜어주는 실질적인 도움이에요.",sk:"아기 바운서"},
    {name:"프리미엄 아기띠",price:"8~10만원",reason:"외출할 때 필수. 부모의 편안함을 생각한 선물이에요.",sk:"아기띠 힙시트"},
    {name:"유기농 아기 의류 선물 세트",price:"5~8만원",reason:"프리미엄 브랜드라 선물로 받으면 특별해요.",sk:"아기옷 선물세트"},
    {name:"산모 케어 세트",price:"7~10만원",reason:"아기뿐 아니라 엄마의 회복도 챙기는 따뜻한 선물이에요.",sk:"산모 케어 세트"},
  ],
  "baby|b4":[
    {name:"프리미엄 유모차",price:"15~20만원",reason:"직접 사기엔 고민되는 가격대라 선물로 최고예요.",sk:"유모차"},
    {name:"아기 카시트",price:"15~20만원",reason:"안전과 직결되는 필수 아이템이에요.",sk:"아기 카시트"},
    {name:"산모 산후조리 케어 세트",price:"10~15만원",reason:"엄마의 회복도 챙겨주는 따뜻한 마음이에요.",sk:"산후조리 세트"},
    {name:"프리미엄 아기 침대",price:"15~20만원",reason:"안전하고 편안한 잠자리를 선물하는 거예요.",sk:"아기 침대"},
  ],
  // ── 결혼 ──
  "wedding|b2":[
    {name:"프리미엄 수건 세트",price:"3~5만원",reason:"신혼살림에 꼭 필요한 실용적인 축하 선물이에요.",sk:"결혼 수건 세트"},
    {name:"커플 향수 세트",price:"3~5만원",reason:"둘만의 향기를 만들어가는 로맨틱한 선물이에요.",sk:"커플 향수"},
    {name:"프리미엄 와인 세트",price:"3~5만원",reason:"신혼의 로맨틱한 저녁에 곁들일 와인이에요.",sk:"와인 선물세트"},
    {name:"감성 액자",price:"3~5만원",reason:"새 집에 웨딩 사진을 담을 특별한 선물이에요.",sk:"감성 액자 선물"},
  ],
  "wedding|b3":[
    {name:"프리미엄 이불·침구 세트",price:"7~10만원",reason:"필수 혼수 아이템. 좋은 침구는 삶의 질을 바꿔요.",sk:"프리미엄 침구 세트"},
    {name:"고급 주방가전",price:"8~10만원",reason:"신혼 살림에 꼭 필요한 실용적인 선물이에요.",sk:"주방 가전 선물"},
    {name:"프리미엄 식기 세트",price:"7~10만원",reason:"신혼집 식탁을 빛나게 하는 고급 식기예요.",sk:"프리미엄 식기 세트"},
    {name:"고급 캔들 + 디퓨저 세트",price:"7~10만원",reason:"신혼집에 향기를 채우는 럭셔리한 선물이에요.",sk:"캔들 디퓨저 세트"},
  ],
  "wedding|b4":[
    {name:"로봇청소기",price:"15~20만원",reason:"신혼생활을 편리하게 만들어주는 최고의 실용 선물이에요.",sk:"로봇청소기"},
    {name:"프리미엄 커피머신",price:"15~20만원",reason:"매일 아침 둘만의 카페를 만들어주는 선물이에요.",sk:"커피머신"},
    {name:"고급 냄비·팬 세트",price:"15~20만원",reason:"요리를 시작하는 신혼부부에게 가장 실용적인 선물이에요.",sk:"프리미엄 냄비 세트"},
    {name:"공기청정기",price:"15~20만원",reason:"깨끗한 공기로 건강한 신혼생활을 선물해요.",sk:"공기청정기"},
  ],
  // ── 사과·화해 ──
  "apology|b2":[
    {name:"프리미엄 꽃다발",price:"3~5만원",reason:"진심을 담은 꽃은 어떤 말보다 강해요.",sk:"사과 꽃다발"},
    {name:"수제 케이크",price:"3~5만원",reason:"달콤함으로 마음의 벽을 녹이는 선물이에요.",sk:"수제 케이크 주문"},
    {name:"향기 캔들 세트",price:"3~5만원",reason:"따뜻한 향기로 관계의 온도를 올려요.",sk:"캔들 선물세트"},
    {name:"프리미엄 초콜릿",price:"3~5만원",reason:"미안한 마음을 달콤하게 전하는 선물이에요.",sk:"프리미엄 초콜릿 선물"},
  ],
  // ── 그냥 마음 ──
  "justbecause|b1":[
    {name:"카페 기프티콘",price:"1만원",reason:"아무 이유 없이 보내는 커피 한 잔의 마음이에요.",sk:"카페 기프티콘"},
    {name:"미니 디저트 세트",price:"1~2만원",reason:"달콤한 깜짝 선물로 일상에 행복을 더해요.",sk:"디저트 선물"},
    {name:"감성 엽서 + 스티커",price:"1만원",reason:"손글씨와 함께 전하는 진심 어린 서프라이즈예요.",sk:"감성 엽서 세트"},
    {name:"미니 화분",price:"1~2만원",reason:"책상 위 작은 초록이 주는 위로와 응원이에요.",sk:"미니 화분"},
    {name:"프리미엄 립밤",price:"1~2만원",reason:"소소하지만 '널 생각해'라는 메시지가 담긴 선물이에요.",sk:"프리미엄 립밤"},
  ],
  "justbecause|b2":[
    {name:"프리미엄 디퓨저",price:"3~4만원",reason:"이유 없는 선물이 가장 감동적이에요. 향기로 마음을 전해요.",sk:"프리미엄 디퓨저"},
    {name:"브랜드 핸드크림 세트",price:"3~5만원",reason:"아무 날도 아닌 날에 주는 게 더 특별해요.",sk:"브랜드 핸드크림 세트"},
    {name:"감성 쿠키 세트",price:"3~4만원",reason:"예쁜 포장의 쿠키는 마음까지 달콤하게 해요.",sk:"감성 쿠키 선물"},
    {name:"프리미엄 에코백",price:"3~4만원",reason:"실용적이면서도 '너를 생각해'라는 메시지가 담긴 선물이에요.",sk:"프리미엄 에코백"},
  ],
  // ── 시부모·장인장모 (inlaw) 5~10만원 프리미엄 ──
  "birthday|b3|inlaw":[
    {name:"프리미엄 홍삼 세트",price:"7~10만원",reason:"어른들 건강을 진심으로 챙기는 마음이 전해져요.",sk:"정관장 홍삼 선물세트"},
    {name:"프리미엄 한우 등심 세트",price:"8~10만원",reason:"명절이 아니어도 기뻐하시는 고급 식재료예요.",sk:"한우 등심 선물세트"},
    {name:"고급 안마기",price:"7~10만원",reason:"매일 쓰시며 건강도 챙기는 실용적인 효도 선물이에요.",sk:"안마기 선물"},
    {name:"프리미엄 혈압계",price:"5~8만원",reason:"건강을 직접 챙기실 수 있는 스마트 건강 선물이에요.",sk:"가정용 혈압계"},
  ],
  "thanks|b3|inlaw":[
    {name:"프리미엄 과일 세트",price:"7~10만원",reason:"계절 과일로 감사의 마음을 정성스럽게 전해요.",sk:"프리미엄 과일 선물세트"},
    {name:"고급 참기름·들기름 세트",price:"5~8만원",reason:"매일 요리에 쓰시는 건강한 감사 표현이에요.",sk:"참기름 들기름 선물세트"},
    {name:"프리미엄 견과류 선물 세트",price:"7~10만원",reason:"건강을 생각하는 정성이 가득한 감사 선물이에요.",sk:"견과류 선물세트"},
    {name:"고급 꿀·벌집꿀 세트",price:"6~9만원",reason:"자연의 달콤함으로 감사 인사를 전해요.",sk:"꿀 선물세트"},
  ],
  "holiday|b3|inlaw":[
    {name:"프리미엄 갈비 세트",price:"8~10만원",reason:"명절에 온 가족이 함께 즐길 수 있는 대표 선물이에요.",sk:"갈비 선물세트"},
    {name:"프리미엄 굴비 세트",price:"7~10만원",reason:"격식 있는 명절 인사에 딱 맞는 전통 선물이에요.",sk:"굴비 선물세트"},
    {name:"고급 한과 세트",price:"5~8만원",reason:"한국적인 멋과 맛으로 정성을 보여드려요.",sk:"한과 선물세트"},
    {name:"프리미엄 버섯 세트",price:"7~10만원",reason:"건강에 좋은 고급 식재료로 마음을 전해요.",sk:"버섯 선물세트"},
  ],
  "recovery|b3|inlaw":[
    {name:"프리미엄 산삼배양근 세트",price:"7~10만원",reason:"빠른 회복을 바라는 정성 가득한 건강 선물이에요.",sk:"산삼배양근 선물"},
    {name:"고급 녹용 진액 세트",price:"8~10만원",reason:"보양에 좋은 전통 건강식품으로 회복을 응원해요.",sk:"녹용 진액 선물"},
    {name:"프리미엄 흑염소 진액",price:"6~9만원",reason:"어르신 회복에 좋은 전통 보양 선물이에요.",sk:"흑염소 진액 선물"},
    {name:"고급 유기농 즙 세트",price:"5~8만원",reason:"자연 그대로의 건강을 선물하는 정성 가득한 선물이에요.",sk:"유기농 즙 선물세트"},
  ],
  "anniversary|b3|inlaw":[
    {name:"프리미엄 스파 이용권",price:"8~10만원",reason:"부모님께 편안한 휴식을 선물하는 특별한 경험이에요.",sk:"스파 이용권 선물"},
    {name:"고급 도자기 찻잔 세트",price:"7~10만원",reason:"매일 차를 즐기시는 분께 품격 있는 선물이에요.",sk:"도자기 찻잔 세트"},
    {name:"프리미엄 실크 이불",price:"8~10만원",reason:"매일 밤 편안한 잠자리를 선물하는 효도 아이템이에요.",sk:"실크 이불 선물"},
    {name:"고급 건강 베개",price:"6~9만원",reason:"숙면을 돕는 기능성 베개로 건강을 챙겨드려요.",sk:"기능성 베개 선물"},
  ],
};

// ── Budget-only fallback (expanded, 6+ items each) ──
const FD={
  b1:[
    {name:"프리미엄 핸드크림 세트",price:"1~2만원",reason:"가볍지만 정성이 담긴 선물. 매일 쓸 때마다 마음이 전해져요.",sk:"핸드크림 선물 세트"},
    {name:"카페 음료 기프티콘",price:"1만원",reason:"언제든 편하게 쓸 수 있는 실용적인 선물이에요.",sk:"카페 기프티콘"},
    {name:"감성 미니 디퓨저",price:"1~2만원",reason:"공간에 향기를 남기는 작지만 특별한 선물이에요.",sk:"미니 디퓨저"},
    {name:"미니 꽃다발",price:"1~2만원",reason:"작지만 진심이 담긴 아름다운 선물이에요.",sk:"미니 꽃다발"},
    {name:"감성 머그컵",price:"1~2만원",reason:"매일 아침 따뜻한 음료와 함께 떠올리게 되는 선물이에요.",sk:"감성 머그컵"},
    {name:"아로마 입욕제",price:"1~2만원",reason:"하루의 피로를 녹여주는 작은 사치예요.",sk:"입욕제 선물"},
  ],
  b2:[
    {name:"프리미엄 디퓨저 세트",price:"3~5만원",reason:"향기가 날 때마다 마음이 전해지는 감성적인 선물이에요.",sk:"프리미엄 디퓨저 세트"},
    {name:"고급 차·커피 선물 세트",price:"3~5만원",reason:"매일 마실 때마다 생각나는 따뜻한 선물이에요.",sk:"차 선물 세트"},
    {name:"브랜드 손수건",price:"3~5만원",reason:"실용적이면서도 격식 있는 선물이에요.",sk:"브랜드 손수건 선물"},
    {name:"프리미엄 초콜릿 세트",price:"3~5만원",reason:"달콤한 마음을 전하는 고급 초콜릿이에요.",sk:"프리미엄 초콜릿 선물세트"},
    {name:"프리미엄 텀블러",price:"3~5만원",reason:"매일 들고 다니며 떠올리는 실용적인 선물이에요.",sk:"프리미엄 텀블러"},
    {name:"아로마 캔들 세트",price:"3~5만원",reason:"분위기 있는 저녁을 만들어주는 선물이에요.",sk:"아로마 캔들 세트"},
  ],
  b3:[
    {name:"브랜드 지갑·카드홀더",price:"7~10만원",reason:"매일 쓰는 물건이라 오래 기억에 남는 실용적인 선물이에요.",sk:"브랜드 카드지갑"},
    {name:"고급 캔들 세트",price:"8~10만원",reason:"집에 향기가 날 때마다 이 마음이 은은하게 닿아요.",sk:"고급 캔들 세트"},
    {name:"블루투스 스피커",price:"7~10만원",reason:"일상에 음악을 더해주는 감성적인 선물이에요.",sk:"블루투스 스피커"},
    {name:"프리미엄 향수",price:"8~10만원",reason:"향기는 기억을 가장 오래 남기는 선물이에요.",sk:"프리미엄 향수"},
    {name:"브랜드 텀블러 세트",price:"7~9만원",reason:"고급스러운 일상 아이템으로 센스를 보여줘요.",sk:"브랜드 텀블러 세트"},
    {name:"프리미엄 와인",price:"7~10만원",reason:"특별한 날 함께 나누는 한 잔의 여유예요.",sk:"프리미엄 와인 선물"},
  ],
  b4:[
    {name:"브랜드 가방",price:"12~18만원",reason:"매일 함께하는 아이템이라 특별한 의미가 있어요.",sk:"브랜드 가방"},
    {name:"프리미엄 향수",price:"12~18만원",reason:"향기로 마음을 전하는 고급스러운 선물이에요.",sk:"프리미엄 향수"},
    {name:"고급 레스토랑 식사권",price:"10~15만원",reason:"특별한 경험을 함께 나누는 의미 있는 선물이에요.",sk:"레스토랑 식사권"},
    {name:"노이즈캔슬링 이어폰",price:"15~20만원",reason:"나만의 세계에 빠질 수 있는 프리미엄 아이템이에요.",sk:"노이즈캔슬링 이어폰"},
    {name:"스마트워치",price:"15~20만원",reason:"건강과 일상을 스마트하게 챙기는 선물이에요.",sk:"스마트워치"},
    {name:"프리미엄 만년필",price:"12~18만원",reason:"격식과 감성을 동시에 전하는 선물이에요.",sk:"프리미엄 만년필"},
  ],
  b5:[
    {name:"명품 액세서리",price:"25~40만원",reason:"오래도록 간직할 수 있는 특별한 선물이에요.",sk:"명품 액세서리"},
    {name:"프리미엄 전자기기",price:"25~50만원",reason:"정말 원했던 걸 선물받는 기쁨은 잊을 수 없어요.",sk:"프리미엄 전자기기"},
    {name:"호텔 스파 패키지",price:"20~35만원",reason:"몸과 마음 모두 쉴 수 있는 특별한 경험이에요.",sk:"호텔 스파 패키지"},
    {name:"명품 지갑",price:"25~40만원",reason:"매일 손에 닿는 럭셔리. 오랫동안 함께해요.",sk:"명품 지갑"},
    {name:"고급 시계",price:"25~50만원",reason:"시간이 흘러도 변하지 않는 마음을 담은 선물이에요.",sk:"브랜드 시계"},
    {name:"프리미엄 카메라",price:"30~50만원",reason:"추억을 담는 특별한 도구를 선물하세요.",sk:"미러리스 카메라"},
  ]
};

// ── Tag → keyword mapping for fallback filtering ──
const TAG_KEYWORDS = {
  cafe:["커피","카페","기프트카드","기프티콘","드립","머그","텀블러"],
  fashion:["패션","의류","가방","지갑","백팩","액세서리","명품","시계","워치"],
  fitness:["운동","건강","비타민","홍삼","스마트워치","프로틴","요가"],
  travel:["여행","캐리어","백팩","카메라","보조배터리","호텔"],
  interior:["인테리어","무드등","조명","디퓨저","캔들","화분","쿠션","액자","침구"],
  tech:["전자기기","이어폰","에어팟","스피커","보조배터리","카메라","태블릿"],
  pet:["반려동물","강아지","고양이","펫"],
  book:["독서","책","노트","다이어리","만년필","북엔드"],
  game:["게임","닌텐도","플레이스테이션","스위치"],
  music:["음악","스피커","블루투스","이어폰","헤드폰","턴테이블","LP"],
  cooking:["요리","베이킹","냄비","식기","오일","올리브","레스토랑","식사권"],
  camping:["캠핑","아웃도어","랜턴","텀블러","담요"],
  idol:["아이돌","덕질","굿즈","캐릭터","포토","앨범"],
  selfcare:["셀프케어","힐링","스파","입욕제","핸드크림","로션","에센스","향수","아로마","파자마"],
  photo:["사진","카메라","폴라로이드","액자","포토","앨범"],
  alcohol:["와인","샴페인","위스키","맥주","술","잔"],
  character:["캐릭터","굿즈","피규어","인형"],
  retro:["레트로","빈티지","LP","턴테이블","필름","폴라로이드"],
  funny:["웃긴","장난감","병맛","유머","재미"],
  practical:["실용","청소기","수건","타올","정리","세제","양말"],
};

// ══════════════════════════════════════
// ── 스코어링 기반 추천 엔진 (총 100점) ──
// ══════════════════════════════════════

// 관계 깊이 분류
const LIGHT_DEPTHS = new Set(["썸 단계","3개월 미만","아는 사이","가끔 만나는 친구","다른 팀","졸업 후 인연","사촌","기타 인척","시누이·처남"]);
const DEEP_DEPTHS = new Set(["3년 이상","10년 이상","절친","시부모·장인장모","함께 사는","3~10년차"]);

// 계절-카테고리 매칭
const SEASON_KW = {
  봄:["꽃","화분","디퓨저","피크닉","자외선","선크림","봄"],
  여름:["냉감","선풍기","텀블러","아이스","쿨","물놀이","여름","선글라스"],
  가을:["캔들","차","스카프","머플러","가을","담요","디퓨저"],
  겨울:["온열","핫팩","담요","니트","장갑","히터","겨울","이불","파자마"],
};

// 실용성 높은 카테고리 (수혜자 관점 가산)
const PRACTICAL_KW = ["청소기","수건","텀블러","충전","배터리","비타민","건강","혈압","안마","세제","칫솔","면도","이불","침구","식기","냄비"];

// 세션 히스토리 (같은 세션에서 중복 방지)
const _recHistory = new Set();

function gfb(o, b, userTags, relId, depth) {
  // 1. 풀 선택
  let pool = (relId === 'inlaw' && FB[`${o}|${b}|inlaw`]) || FB[`${o}|${b}`] || FD[b] || FD.b2;
  pool = [...pool];

  // 김영란법 필터: 직장동료/스승 관계 시 예산 5만원 초과 상품 제외
  if ((relId === 'colleague' || relId === 'mentor') && (b === 'b3' || b === 'b4' || b === 'b5')) {
    pool = pool.filter(item => {
      const p = parseInt((item.price || "").match(/\d+/)?.[0] || "0");
      return p <= 5; // 5만원 이하만
    });
    if (pool.length === 0) pool = [...(FD.b2 || [])]; // 빈 풀 방지
  }

  // 2. 현재 계절
  const season = ["봄","봄","여름","여름","가을","가을","겨울","겨울","봄","봄","겨울","겨울"][new Date().getMonth()];
  const seasonKw = SEASON_KW[season] || [];

  // 3. 태그 키워드 세트
  const kwSet = (userTags || []).flatMap(t => TAG_KEYWORDS[t] || []);

  // 4. 관계 깊이 분류
  const isLight = LIGHT_DEPTHS.has(depth);
  const isDeep = DEEP_DEPTHS.has(depth);

  // 5. 각 아이템 스코어링 (총 100점)
  const scored = pool.map(item => {
    const text = `${item.name} ${item.sk || ""}`.toLowerCase();
    let score = 0;

    // ① 태그 매칭 (40점) — 매칭 키워드 수에 비례, 최대 40
    const tagHits = kwSet.filter(kw => text.includes(kw.toLowerCase())).length;
    score += Math.min(tagHits * 13, 40);

    // ② 관계 깊이 적합성 (25점)
    const isPractical = PRACTICAL_KW.some(kw => text.includes(kw));
    const isExperience = ["호텔","스파","레스토랑","식사권","여행","공연","클래스"].some(kw => text.includes(kw));
    if (isLight && isPractical) score += 25;        // 먼 관계 + 실용품 = 안전
    else if (isDeep && isExperience) score += 25;   // 가까운 관계 + 경험/감성 = 대담
    else if (isDeep && !isPractical) score += 18;   // 가까운 관계 + 비실용 = 적당
    else if (isLight && !isExperience) score += 12; // 먼 관계 + 비경험 = 적당
    else score += 8;

    // ③ 계절 적합성 (15점)
    const seasonHits = seasonKw.filter(kw => text.includes(kw)).length;
    score += Math.min(seasonHits * 8, 15);

    // ④ 증여자-수혜자 비대칭 보정 (10점) — 실용성 가산
    if (isPractical) score += 10;
    else if (isExperience) score += 6; // 경험도 수혜자에게 가치
    else score += 3;

    // 세션 히스토리 감점 (이미 추천된 상품)
    if (_recHistory.has(item.name)) score -= 30;

    // 랜덤 시드 (±8점) — 매번 다른 결과
    score += Math.random() * 16 - 8;

    return { ...item, _score: score };
  });

  // 6. 점수 내림차순 정렬
  scored.sort((a, b) => b._score - a._score);

  // 7. 카테고리 다양성 보장 (10점 보너스 로직) — 상위에서 서로 다른 카테고리 3개 선택
  const picks = [];
  const usedCategories = new Set();
  for (const item of scored) {
    if (picks.length >= 3) break;
    // 카테고리 추출: VIS 키 매칭 또는 이름 첫 단어
    const cat = Object.keys(VIS).find(k => item.name.includes(k)) || item.name.slice(0, 2);
    if (picks.length < 2 || !usedCategories.has(cat)) {
      // 3번째 픽은 반드시 다른 카테고리 (가능한 경우)
      picks.push(item);
      usedCategories.add(cat);
    }
  }
  // 부족하면 나머지에서 채움
  if (picks.length < 3) {
    for (const item of scored) {
      if (picks.length >= 3) break;
      if (!picks.includes(item)) picks.push(item);
    }
  }

  // 8. 히스토리에 추가
  picks.forEach(p => _recHistory.add(p.name));

  console.log("[마로] fallback 스코어링", picks.map(p => `${p.name}(${Math.round(p._score)}점)`));
  return picks.map(({ _score, ...item }) => item);
}

// ── Utils ──
function parsePrice(s){if(!s)return null;const n=s.match(/[\d.]+/g);if(!n)return null;const m=s.includes("만")?10000:1;return n.length>=2?{min:Math.round(n[0]*m),max:Math.round(n[1]*m)}:{min:Math.round(n[0]*m*.7),max:Math.round(n[0]*m*1.3)};}
function mkUrl(kw,pr){
  const PARTNER_ID="AF3339921";
  const b=`https://www.coupang.com/np/search?component=&q=${encodeURIComponent(kw)}&channel=user&traid=${PARTNER_ID}&subid=maro-app`;
  const p=parsePrice(pr);
  return p?`${b}&minPrice=${p.min}&maxPrice=${p.max}`:b;
}

// ── Components ──
function Btn({onClick,children,style={},scale=0.94,ms=220}){
  const[d,setD]=useState(false);const[ok,setOk]=useState(false);const t=useRef(null);
  const go=()=>{setD(false);setOk(true);t.current=setTimeout(()=>onClick?.(),ms);};
  useEffect(()=>()=>clearTimeout(t.current),[]);
  return(<button onPointerDown={()=>setD(true)} onPointerUp={go} onPointerLeave={()=>setD(false)} onPointerCancel={()=>setD(false)} style={{...style,transform:d?`scale(${scale})`:ok?"scale(0.97)":"scale(1)",transition:d?"transform .06s":"all .2s cubic-bezier(.2,0,.2,1)",outline:"none",WebkitTapHighlightColor:"transparent",userSelect:"none",position:"relative",overflow:"hidden",...(ok?{borderColor:"#c4756e",background:"rgba(196,117,110,.1)",boxShadow:"0 0 0 3px rgba(196,117,110,.18)"}:{})}}>{children}
  {ok&&<div style={{position:"absolute",top:7,right:7,width:22,height:22,borderRadius:"50%",background:"linear-gradient(135deg,#c4756e,#a85e58)",display:"flex",alignItems:"center",justifyContent:"center",animation:"pop .18s cubic-bezier(.34,1.56,.64,1)",boxShadow:"0 2px 8px rgba(168,94,88,.35)"}}><span style={{color:"#fff",fontSize:12,fontWeight:800}}>✓</span></div>}
  </button>);
}
function Thumb({name,sz=68}){
  const v=gv(name);
  const imgUrl=gimg(name);
  const[ok,setOk]=useState(true);
  return(
    <div style={{width:sz,height:sz,borderRadius:14,flexShrink:0,background:`linear-gradient(145deg,${v.bg},${v.bg}dd)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:Math.round(sz*.42),boxShadow:`0 3px 12px ${v.ac}18`,border:`1.5px solid ${v.ac}25`,position:"relative",overflow:"hidden"}}>
      {imgUrl&&ok?(
        <img src={imgUrl} alt={name} onError={()=>setOk(false)} style={{width:"100%",height:"100%",objectFit:"cover",position:"absolute",top:0,left:0}}/>
      ):(
        <><div style={{position:"absolute",top:"-18%",right:"-18%",width:"48%",height:"48%",borderRadius:"50%",background:`${v.ac}0d`}}/><span style={{position:"relative",zIndex:1}}>{v.ic}</span></>
      )}
    </div>
  );
}
function SH({n,title,sub,onBack}){return(<div style={{marginBottom:20}}>{onBack&&<button onClick={onBack} style={{display:"inline-flex",alignItems:"center",gap:4,background:"none",border:"none",cursor:"pointer",fontSize:13,color:"#a09080",padding:"4px 0",marginBottom:10}} onPointerDown={e=>e.currentTarget.style.color="#6b5040"} onPointerUp={e=>e.currentTarget.style.color="#a09080"}><span style={{fontSize:16}}>←</span> 이전으로</button>}<div style={{fontSize:11,color:"#c4756e",fontWeight:700,letterSpacing:2,marginBottom:6}}>STEP {n}</div><h2 style={{fontSize:19,fontWeight:600,color:"#2d2420",margin:"0 0 5px",lineHeight:1.4}}>{title}</h2><p style={{fontSize:13,color:"#9a8a7a",margin:0}}>{sub}</p></div>);}

// ── GiftCard (접기 토글 포함) ──
function GiftCard({g,i,rank,compat,v,imgUrl,url,onCoupangClick,P,P2,TX,TX2}){
  const[open,setOpen]=useState(false);
  return(
    <div style={{background:"rgba(255,255,255,.95)",borderRadius:16,boxShadow:"0 4px 6px rgba(0,0,0,0.07)",overflow:"hidden",animation:`up .35s ease ${i*.1}s both`}}>
      <div style={{height:120,background:`linear-gradient(145deg,${v.bg},${v.bg}dd)`,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
        {imgUrl?<img src={imgUrl} alt={g.name} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>{e.target.style.display="none";e.target.nextSibling.style.display="flex"}}/>:null}
        <div style={{display:imgUrl?"none":"flex",alignItems:"center",justifyContent:"center",width:"100%",height:"100%",fontSize:48}}>{v.ic}</div>
        <div style={{position:"absolute",top:10,left:10,display:"flex",gap:6}}>
          <span style={{background:"#5B7B9A",color:"#fff",fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:20}}>AI pick</span>
          <span style={{background:i===0?`linear-gradient(135deg,${P},${P2})`:"rgba(0,0,0,.5)",color:"#fff",fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:20}}>{rank}</span>
        </div>
      </div>
      <div style={{padding:16}}>
        <div style={{fontFamily:"'Gowun Batang',serif",fontSize:15,fontWeight:700,color:TX,marginBottom:4,lineHeight:1.3}}>{g.name}</div>
        <div style={{fontSize:13,color:TX2,marginBottom:8,fontFamily:"'Noto Sans KR',sans-serif"}}>{g.price}</div>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
          <div style={{flex:1,height:6,background:"#ebe4dc",borderRadius:3,overflow:"hidden"}}>
            <div style={{width:`${compat}%`,height:"100%",background:"#4A8C6F",borderRadius:3,transition:"width .5s ease"}}/>
          </div>
          <span style={{fontSize:11,color:"#4A8C6F",fontWeight:600,whiteSpace:"nowrap"}}>궁합 {compat}%</span>
        </div>
        {/* 왜 이 선물? 접기 토글 */}
        <button onClick={()=>setOpen(!open)} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:"#5B7B9A",fontWeight:600,padding:"4px 0",marginBottom:open?8:12,display:"flex",alignItems:"center",gap:4}}>
          왜 이 선물? <span style={{transition:"transform .2s",transform:open?"rotate(90deg)":"none"}}>▸</span>
        </button>
        {open&&<div style={{fontFamily:"'Gowun Batang',serif",fontSize:12,color:"#5a4a3a",lineHeight:1.75,fontStyle:"italic",marginBottom:12,padding:"10px 12px",background:"rgba(91,123,154,.05)",borderRadius:10,borderLeft:"3px solid #5B7B9A"}}>"{g.reason}"</div>}
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <button onClick={()=>{}} style={{width:40,height:40,borderRadius:12,border:"1.5px solid #ebe4dc",background:"rgba(255,255,255,.8)",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>♡</button>
          <a href={url} target="_blank" rel="noopener noreferrer" onClick={onCoupangClick} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"10px 14px",background:"#2B7A78",color:"#fff",borderRadius:12,textDecoration:"none",fontSize:13,fontWeight:600}}>쿠팡 최저가 보기 →</a>
        </div>
      </div>
    </div>
  );
}

// ── App ──
export default function App(){
  const[step,setStep]=useState(0);const[rel,setRel]=useState(null);const[dep,setDep]=useState("");const[occ,setOcc]=useState(null);const[bud,setBud]=useState(null);
  const[intent,setIntent]=useState("");const[tags,setTags]=useState([]);const[results,setResults]=useState([]);const[loading,setLoading]=useState(false);const[lm,setLm]=useState(0);const[fade,setFade]=useState(true);const box=useRef(null);const[src,setSrc]=useState("");

  const TAGS=[{id:"cafe",label:"카페·맛집",em:"☕"},{id:"fashion",label:"패션·뷰티",em:"👗"},{id:"fitness",label:"운동·건강",em:"💪"},{id:"travel",label:"여행",em:"✈️"},{id:"interior",label:"집꾸미기",em:"🏠"},{id:"tech",label:"테크·가전",em:"📱"},{id:"pet",label:"반려동물",em:"🐶"},{id:"book",label:"독서·문화",em:"📚"},{id:"game",label:"게임",em:"🎮"},{id:"music",label:"음악",em:"🎵"},{id:"cooking",label:"요리·베이킹",em:"🍳"},{id:"camping",label:"캠핑·아웃도어",em:"⛺"},{id:"idol",label:"아이돌·덕질",em:"🎤"},{id:"selfcare",label:"셀프케어·힐링",em:"🧖"},{id:"photo",label:"사진·영상",em:"📸"},{id:"alcohol",label:"술·와인",em:"🍷"},{id:"character",label:"캐릭터·굿즈",em:"🧸"},{id:"retro",label:"레트로·빈티지",em:"📻"},{id:"funny",label:"웃긴선물·장난감",em:"🤣"},{id:"practical",label:"극한의 실용템",em:"🧹"}];
  const toggleTag=id=>setTags(p=>p.includes(id)?p.filter(x=>x!==id):p.length<5?[...p,id]:p);
  const tagLabels=tags.map(id=>TAGS.find(t=>t.id===id)?.label).filter(Boolean);

  const LM=["관계를 분석하고 있어요...","의도에 맞는 선물을 찾고 있어요...","감정 메시지를 해석하고 있어요...","최적의 선물을 선별하고 있어요..."];
  useEffect(()=>{if(!loading)return;const i=setInterval(()=>setLm(p=>(p+1)%LM.length),2000);return()=>clearInterval(i);},[loading]);

  const go=n=>{setFade(false);setTimeout(()=>{setStep(n);setFade(true);box.current?.scrollTo({top:0,behavior:"smooth"});},280);};

  // ══════════════════════════════════════
  // ── IMPROVED AI Analysis ──
  // ══════════════════════════════════════
  // ── GA4 이벤트 헬퍼 ──
  const ga=(event,params={})=>{try{window.gtag?.('event',event,params)}catch{}};

  // ══════════════════════════════════════
  const analyze=async()=>{
    ga('recommend_start',{relation:rel?.label,occasion:occ?.label,budget:bud?.label,tags:tags.join(',')});
    setLoading(true);go(6);

    const season=["봄","봄","여름","여름","가을","가을","겨울","겨울","봄","봄","겨울","겨울"][new Date().getMonth()];

    console.log("[마로] AI API 호출 시작", {relation:rel?.label,depth:dep,occasion:occ?.label,budget:bud?.label});
    try{
      const r=await fetch("/api/recommend",{method:"POST",cache:"no-store",headers:{"Content-Type":"application/json"},body:JSON.stringify({relation:rel?.label,depth:dep,occasion:occ?.label,budget:bud?.label,intent,tags,season})});
      const d=await r.json();
      if(!r.ok||!d.gifts?.length){
        console.warn("[마로] AI API 실패 - fallback 사용",{status:r.status,body:d});
        throw d;
      }
      console.log("[마로] AI API 응답 성공",d.gifts.map(g=>g.name));
      setResults(d.gifts);setSrc("ai");
      ga('recommend_complete',{source:'ai',count:d.gifts.length});
    }catch(err){
      console.warn("[마로] fallback DB 사용",err);
      setResults(gfb(occ?.id,bud?.id,tags,rel?.id,dep));setSrc("fallback");
      ga('recommend_complete',{source:'fallback',count:3});
    }
    setLoading(false);
  };

  // "다시 추천받기" — 항상 새로운 API 호출
  const reroll=()=>analyze();

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

        {/* Header */}
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

        {/* Progress */}
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

          {/* S1: Relation */}
          {step===1&&(<div><SH n="01" title="누구에게 선물하나요?" sub="관계에 따라 적절한 선물이 달라져요" onBack={()=>go(0)}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>{RELATIONS.map(r=>(<Btn key={r.id} onClick={()=>{setRel(r);go(2)}} style={{...card,padding:"16px 12px"}}><span style={{fontSize:24}}>{r.icon}</span><div style={{fontSize:14,fontWeight:600,color:TX,marginTop:6}}>{r.label}</div><div style={{fontSize:11,color:TX2,marginTop:2}}>{r.desc}</div></Btn>))}</div></div>)}

          {/* S2: Depth */}
          {step===2&&(<div><SH n="02" title={`${rel?.icon} ${rel?.label}과의 관계 깊이는?`} sub="관계의 깊이에 따라 선물의 무게감이 달라져요" onBack={()=>go(1)}/>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>{(rel?.depth||[]).map((d,i)=>(<Btn key={i} onClick={()=>{setDep(d);go(3)}} style={{...card,padding:"14px 18px",fontSize:14,color:TX,fontWeight:500}}><span style={{marginRight:10,opacity:.4,fontWeight:700}}>{i+1}</span>{d}</Btn>))}</div></div>)}

          {/* S3: Occasion */}
          {step===3&&(<div><SH n="03" title="어떤 상황인가요?" sub="상황에 따라 선물의 의미가 완전히 달라져요" onBack={()=>go(2)}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>{OCCASIONS.map(o=>(<Btn key={o.id} onClick={()=>{setOcc(o);go(4)}} style={{...card,padding:"14px 12px",textAlign:"center"}}><span style={{fontSize:22}}>{o.icon}</span><div style={{fontSize:13,fontWeight:600,color:TX,marginTop:5}}>{o.label}</div></Btn>))}</div></div>)}

          {/* S4: Budget */}
          {step===4&&(<div><SH n="04" title="예산은 얼마 정도 생각하세요?" sub="예산에 맞는 최적의 선물을 찾아드릴게요" onBack={()=>go(3)}/>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>{BUDGETS.map(b=>(<Btn key={b.id} onClick={()=>{setBud(b);go(5)}} style={{...card,padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:14,fontWeight:600,color:TX}}>{b.label}</span><span style={{fontSize:11,color:P,background:`${P}10`,padding:"3px 10px",borderRadius:20,fontWeight:500}}>{b.tag}</span></Btn>))}</div></div>)}

          {/* S5: Intent + Tags */}
          {step===5&&!loading&&results.length===0&&(
            <div>
              <SH n="05" title="어떤 마음을 전하고 싶으세요?" sub="이 한마디가 선물의 방향을 결정해요 (선택)" onBack={()=>go(4)}/>
              <textarea value={intent} onChange={e=>setIntent(e.target.value)} placeholder="예) 항상 곁에 있어줘서 고마워..." style={{width:"100%",minHeight:76,background:"rgba(255,255,255,.85)",border:"1.5px solid #ebe4dc",borderRadius:12,padding:"12px 16px",fontSize:14,color:TX,resize:"none",outline:"none",fontFamily:"inherit",lineHeight:1.6,boxSizing:"border-box",transition:"border-color .2s"}} onFocus={e=>e.target.style.borderColor=P} onBlur={e=>e.target.style.borderColor="#ebe4dc"}/>
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
            {/* 제목 */}
            <div style={{textAlign:"center",marginBottom:20}}>
              <h2 style={{fontFamily:"'Gowun Batang',serif",fontSize:20,fontWeight:700,color:TX,margin:"0 0 6px"}}>이런 선물은 어떨까요?</h2>
              <p style={{fontSize:13,color:TX2,margin:0}}>💖 {rel?.label} · {occ?.label} · {bud?.label}</p>
              <div style={{display:"inline-block",marginTop:8,fontSize:11,color:"#5B7B9A",background:"rgba(91,123,154,.1)",padding:"3px 12px",borderRadius:20,fontWeight:600}}>{src==="ai"?"AI가 추천했어요":"맞춤 추천이에요"}</div>
            </div>

            {/* 카드 3장 — 궁합 점수 내림차순 보장 */}
            {(()=>{const compats=[Math.floor(92+Math.random()*7),0,0];compats[1]=compats[0]-Math.floor(3+Math.random()*5);compats[2]=compats[1]-Math.floor(3+Math.random()*5);return(
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {results.map((g,i)=>{const sk=g.searchKeyword||g.sk||g.name;const url=mkUrl(sk,g.price);const v=gv(g.name);const imgUrl=gimg(g.name);const onCoupangClick=()=>ga('coupang_click',{product:g.name,price:g.price,rank:i+1,page:'app'});const rank=["1st","2nd","3rd"][i];const compat=compats[i];return(
                <GiftCard key={i} g={g} i={i} rank={rank} compat={compat} v={v} imgUrl={imgUrl} url={url} onCoupangClick={onCoupangClick} P={P} P2={P2} TX={TX} TX2={TX2}/>
              );})}
            </div>);})()}

            {/* 팁 */}
            <div style={{background:`${P}06`,border:`1px dashed ${P}25`,borderRadius:12,padding:"12px 16px",marginTop:16}}>
              <div style={{fontSize:12,color:"#6a5a4a",lineHeight:1.7}}>💡 <strong>TIP</strong> — 선물과 함께 짧은 손편지를 곁들이면 마음이 더 잘 전달돼요.{intent&&` "${intent}" 이 마음을 직접 적어보는 건 어떨까요?`}</div>
            </div>

            {/* 쿠팡 파트너스 고지 */}
            <div style={{background:"rgba(0,0,0,.03)",border:"1px solid rgba(0,0,0,.07)",borderRadius:10,padding:"10px 14px",marginTop:10}}>
              <div style={{fontSize:11,color:"#a09585",lineHeight:1.7}}>📢 위 상품 링크는 <strong>쿠팡 파트너스</strong> 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.</div>
            </div>

            {/* SNS 공유 */}
            <div style={{marginTop:18}}>
              <div style={{fontSize:12,fontWeight:600,color:TX2,marginBottom:8,textAlign:"center"}}>추천 결과 공유하기</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                {typeof navigator!=="undefined"&&navigator.share&&(
                  <button onClick={()=>{try{navigator.share({title:"마로 - 마음을 새기는 선물 추천",text:`${rel?.label}에게 ${occ?.label} 선물로 ${results[0]?.name}을(를) 추천받았어요!`,url:"https://maro.ai.kr/app"})}catch{}; ga('share',{method:'webshare'})}} style={{border:".5px solid #E8DCD8",borderRadius:12,padding:10,background:"rgba(255,255,255,.7)",cursor:"pointer",fontSize:12,color:TX2,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                    <span style={{fontSize:18}}>📤</span>공유하기
                  </button>
                )}
                <button onClick={()=>{const t=encodeURIComponent(`${rel?.label}에게 ${occ?.label} 선물로 ${results[0]?.name}을(를) 추천받았어요! 마로에서 나도 추천받기 👉`);const u=encodeURIComponent("https://maro.ai.kr/app");window.open(`https://story.kakao.com/share?url=${u}&text=${t}`,"_blank");ga('share',{method:'kakao'})}} style={{border:".5px solid #E8DCD8",borderRadius:12,padding:10,background:"rgba(255,255,255,.7)",cursor:"pointer",fontSize:12,color:TX2,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                  <span style={{fontSize:18}}>💬</span>카카오
                </button>
                <button onClick={async()=>{try{await navigator.clipboard.writeText("https://maro.ai.kr/app");alert("✅ 링크가 복사되었어요!")}catch{};ga('share',{method:'copy'})}} style={{border:".5px solid #E8DCD8",borderRadius:12,padding:10,background:"rgba(255,255,255,.7)",cursor:"pointer",fontSize:12,color:TX2,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                  <span style={{fontSize:18}}>🔗</span>링크 복사
                </button>
              </div>
            </div>

            {/* 액션 버튼 */}
            <div style={{marginTop:18,display:"flex",flexDirection:"column",gap:10}}>
              <Btn onClick={reroll} style={{width:"100%",background:"rgba(255,255,255,.8)",border:"1.5px solid #ebe4dc",borderRadius:12,padding:14,fontSize:14,color:TX,fontWeight:600,cursor:"pointer"}}>↻ 다른 추천 보기</Btn>
              <div style={{display:"flex",gap:10}}>
                <Btn onClick={restart} style={{flex:1,background:"rgba(255,255,255,.6)",border:"1.5px solid #ebe4dc",borderRadius:12,padding:13,fontSize:13,color:"#5a4a3a",fontWeight:500,cursor:"pointer"}}>처음부터</Btn>
                <Btn onClick={()=>{setResults([]);setIntent("");go(5)}} style={{flex:1,background:"rgba(255,255,255,.6)",border:"1.5px solid #ebe4dc",borderRadius:12,padding:13,fontSize:13,color:"#5a4a3a",fontWeight:500,cursor:"pointer"}}>마음 바꿔서</Btn>
              </div>
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
