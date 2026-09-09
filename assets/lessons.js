/* 20강 목차 · ready:true 인 강만 열립니다 */
const LESSONS=[
 {n:1, t:"일과 직업 및 직업 생활",              c:20, ready:true},
 {n:2, t:"생애 발달과 직업적 성공 (1)",          ready:false},
 {n:3, t:"생애 발달과 직업적 성공 (2)",          ready:false},
 {n:4, t:"기업의 종류와 형태별 특징",             ready:false},
 {n:5, t:"기업의 경영 활동",                    ready:false},
 {n:6, t:"제조업과 제품 생산 활동",               ready:false},
 {n:7, t:"서비스업과 서비스 생산",                ready:false},
 {n:8, t:"직업 기초 능력의 종류와 향상",           ready:false},
 {n:9, t:"전공별 직무 수행 능력 탐색 (1)",        ready:false},
 {n:10,t:"전공별 직무 수행 능력 탐색 (2)",        ready:false},
 {n:11,t:"경력 개발과 평생 학습의 의미",           ready:false},
 {n:12,t:"취업과 창업 및 기업가 정신 (1)",        ready:false},
 {n:13,t:"취업과 창업 및 기업가 정신 (2)",        ready:false},
 {n:14,t:"취업과 창업 및 기업가 정신 (3)",        ready:false},
 {n:15,t:"근로 관계와 법 (1)",                  ready:false},
 {n:16,t:"근로 관계와 법 (2)",                  ready:false},
 {n:17,t:"고용 서비스와 사회 제도",               ready:false},
 {n:18,t:"산업 안전과 재해 예방",                 ready:false},
 {n:19,t:"협력적인 노사 관계",                   ready:false},
 {n:20,t:"사회 문제와 직업 윤리 및 미래 사회와 직업 사회", ready:false}
];
/* 홈 화면 묶음 · 교재의 공식 대단원이 아니라 주제별 편의 분류입니다 */
const CLUSTERS=[
 {g:1,side:"L",row:1,name:"진로와 직업 생활",      ns:[1,2,3]},
 {g:2,side:"L",row:2,name:"산업과 기업",           ns:[4,5,6,7]},
 {g:3,side:"L",row:3,name:"직업 능력과 경력",      ns:[8,9,10,11]},
 {g:4,side:"R",row:1,name:"취업과 창업",           ns:[12,13,14]},
 {g:5,side:"R",row:2,name:"근로 관계와 사회 제도", ns:[15,16,17,18,19]},
 {g:6,side:"R",row:3,name:"직업 윤리와 미래",      ns:[20]}
];
const PAD=n=>String(n).padStart(2,'0');
const LKEY=n=>'atlas.p'+PAD(n);

/* 사이트 공통 셸 · 모든 페이지 상단 내비게이션 */
function buildNav(cur){
  const w=document.createElement('div');w.className='nav';
  const opts=LESSONS.map(l=>`<option value="${l.n}" ${l.n===cur?'selected':''} ${l.ready?'':'disabled'}>${PAD(l.n)}강 · ${l.t}${l.ready?'':' (준비 중)'}</option>`).join('');
  const prev=LESSONS.filter(l=>l.ready&&l.n<cur).pop();
  const next=LESSONS.filter(l=>l.ready&&l.n>cur)[0];
  w.innerHTML=`<div class="in">
    <a class="brand" href="index.html">
      <svg width="26" height="26" viewBox="0 0 46 46" aria-hidden="true">
        <path d="M4.93 28.54A17 5 -19 0 1 37.07 17.46" fill="none" stroke="#8FC9A3" stroke-width="2" stroke-linecap="round"/>
        <circle cx="21" cy="23" r="9.5" fill="#EE8C93"/>
        <circle cx="18" cy="20" r="2.6" fill="#DB7F8C"/>
        <circle cx="24" cy="26" r="1.7" fill="#DB7F8C"/>
        <path d="M4.93 28.54A17 5 -19 0 0 37.07 17.46" fill="none" stroke="#8FC9A3" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <span class="bt">행성 지도</span><span class="bs">ATLAS</span></a>
    <span class="sp"></span>
    ${cur?`<a class="nb home" href="index.html">⌂ 홈</a>
      <select id="navSel" aria-label="강 선택">${opts}</select>
      <a class="nb ${prev?'':'off'}" href="${prev?'lesson'+PAD(prev.n)+'.html':'#'}">← 이전</a>
      <a class="nb ${next?'':'off'}" href="${next?'lesson'+PAD(next.n)+'.html':'#'}">다음 →</a>`
     :`<a class="nb" href="lesson01.html">01강 열기</a>`}
  </div>`;
  document.body.insertBefore(w,document.body.firstChild);
  const sel=w.querySelector('#navSel');
  if(sel)sel.onchange=()=>{location.href='lesson'+PAD(sel.value)+'.html';};
  if(cur)buildBottom(cur);
}

/* 페이지 맨 하단 · 맨 위로 / 홈으로 */
function buildBottom(cur){
  const foot=document.querySelector('.foot');
  if(!foot)return;
  const prev=LESSONS.filter(l=>l.ready&&l.n<cur).pop();
  const next=LESSONS.filter(l=>l.ready&&l.n>cur)[0];
  const box=document.createElement('div');
  box.className='pagend';
  box.innerHTML=`
    <button class="pgb up" id="pgUp">↑ 맨 위로</button>
    <a class="pgb" href="index.html">⌂ 홈으로</a>
    ${prev?`<a class="pgb" href="lesson${PAD(prev.n)}.html">← ${PAD(prev.n)}강</a>`:''}
    ${next?`<a class="pgb" href="lesson${PAD(next.n)}.html">${PAD(next.n)}강 →</a>`:''}`;
  foot.parentNode.insertBefore(box,foot);
  box.querySelector('#pgUp').onclick=()=>scrollTo({top:0,behavior:'smooth'});
}
