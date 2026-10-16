/* ============================================================
   행성 타이핑 · typing.html?l=09  (m=q 이면 탐사 모드로 시작)
   가운데 모행성 = 강 · 궤도 구역 4개 = 소단원 · 우주 정거장 20개 = 마인드맵 개념(DATA)
   정거장 이름을 다 치면 우주선이 나선 궤도를 따라 다음 정거장으로 날아가 도킹합니다.
   🚀 주행 모드 — 정거장 이름과 한 줄 정리를 보며 타이핑
   🔭 탐사 모드 — 단서만 보고 숨겨진 정거장 이름을 맞히기
   ============================================================ */
(function(){
const Q=new URLSearchParams(location.search);
const LN=parseInt(Q.get('l'),10)||0;
const L=LESSONS.find(x=>x.n===LN&&x.ready);
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const TKEY=(n,m)=>'atlas.ty'+PAD(n)+m;
function rd(k){try{return JSON.parse(localStorage.getItem(k)||'null')}catch(e){return null}}
function wr(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
const mmss=ms=>{const s=Math.floor(ms/1000);return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')};
const mmssc=ms=>mmss(ms)+'.'+String(Math.floor(ms%1000/10)).padStart(2,'0');
const NS='http://www.w3.org/2000/svg';
const COL=['#8FC9A3','#F0A2AC','#C9D26E','#9BC4DC'];      /* 구역 색 · 마인드맵 가지 색과 같음 */
const COLD=['#5FA97C','#DB7F8C','#A9B34C','#6FA3C2'];
function rng(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);
  t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const app=$('#tyApp');
function el(tag,attr,parent){const e=document.createElementNS(NS,tag);for(const k in attr)e.setAttribute(k,attr[k]);if(parent)parent.appendChild(e);return e;}
function stars(g,r,n,x0,y0,w,h){
  for(let i=0;i<n;i++){
    const big=r()<.08, x=x0+r()*w, y=y0+r()*h;
    if(r()<.04){el('ellipse',{cx:x,cy:y,rx:1.4,ry:5+r()*4,fill:'#fff',opacity:.8},g);continue;}  /* 반짝 */
    const c=el('circle',{cx:x,cy:y,r:big?(2+r()*2.4).toFixed(2):(.5+r()*1.2).toFixed(2),
      fill:'#FFFFFF',opacity:(.45+r()*.55).toFixed(2)},g);
    if(r()<.2){c.setAttribute('class','twk');c.style.animationDelay=(r()*3).toFixed(2)+'s';}
  }
}

/* ---------- 귀여운 행성 그리기 ----------
   무늬 12가지 · 표정 4가지(자는 중 · 기다림 · 반가움 · 시무룩)  — 그림은 반지름 50 기준으로 그린 뒤 크기를 맞춥니다 */
let defs=null, UID=0;
const PTYPES=['earth','waves','sun','spots','blue','purple','hearts','cheese','ring','clouds','marble','crater'];
const PALS={earth:['#6EC1F2','#3DB54A'],waves:['#FFB5BA','#FF8A93','#FFD6D9'],sun:['#FFCC66','#FFA84A','#FFB54D'],
  spots:['#C4DE9C','#A2C66A'],blue:['#7FC7F7','#56ABEA'],purple:['#D6A2F2','#B36BDD','#ECCCFA'],hearts:['#FFC6DC','#FF97BF'],
  cheese:['#FFDDAA','#FFB050','#FFE8C6'],ring:['#C9C4FF','#9D92F7','#8B80EE'],clouds:['#A3DBD1','#D9F4EF'],
  marble:['#D3AA8A','#B08263','#E3C3A8'],crater:['#C2C2C2','#A3A3A3'],core:['#F7AEB6','#EE8C93','#FFD3D8']};
const wave=(y,a)=>`M-62,${y} C-42,${y-a} -22,${y+a} 0,${y} S40,${y-a} 62,${y}`;
const heart=(x,y,z)=>`M${x},${y+z*.4} C${x-z*.95},${y-z*.2} ${x-z*.5},${y-z*.95} ${x},${y-z*.42} C${x+z*.5},${y-z*.95} ${x+z*.95},${y-z*.2} ${x},${y+z*.4} Z`;
const INK='#2B2B33';
const FACE={
  sleep:`<path d="M-15,-13 Q-10.5,-8.5 -6,-13" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M6,-13 Q10.5,-8.5 15,-13" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M-3,-3 Q0,-1 3,-3" stroke="${INK}" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <text x="22" y="-26" font-size="15" font-weight="800" fill="#FFFFFF" opacity=".85" class="zz">z</text>`,
  wait:`<circle cx="-10" cy="-13" r="4" fill="${INK}"/><circle cx="10" cy="-13" r="4" fill="${INK}"/>
    <circle cx="-8.6" cy="-14.6" r="1.3" fill="#fff"/><circle cx="11.4" cy="-14.6" r="1.3" fill="#fff"/>
    <path d="M-5,-5 Q0,0 5,-5" stroke="${INK}" stroke-width="2.8" fill="none" stroke-linecap="round"/>`,
  happy:`<path d="M-15,-11 Q-10.5,-18 -6,-11" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M6,-11 Q10.5,-18 15,-11" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M-7,-5 Q0,4 7,-5 Z" fill="${INK}"/><path d="M-3.5,-1.2 Q0,1.6 3.5,-1.2" fill="#FF8FA3"/>
    <ellipse cx="-19" cy="-4" rx="4.6" ry="2.6" fill="#FF7F97" opacity=".55"/><ellipse cx="19" cy="-4" rx="4.6" ry="2.6" fill="#FF7F97" opacity=".55"/>`,
  sad:`<circle cx="-10" cy="-12" r="3.8" fill="${INK}"/><circle cx="10" cy="-12" r="3.8" fill="${INK}"/>
    <path d="M-5,-1 Q0,-6 5,-1" stroke="${INK}" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <path d="M15,-7 q2.6,4 0,5.6 q-2.6,-1.6 0,-5.6 Z" fill="#7FC7F7"/>`
};
function cutePlanet(parent,type,r){
  const id='cp'+(UID++), C=PALS[type], g=el('g',{},parent), s=el('g',{transform:`scale(${r/50})`},g);
  const cp=el('clipPath',{id},defs); el('circle',{r:50},cp);
  const ringed=type==='ring'||type==='core', rc=type==='core'?'#FFD3D8':C[2];
  if(type==='sun'){
    let d='';for(let a=0;a<=40;a++){const t=a/40*Math.PI*2, rr=56+Math.sin(a*2.7)*3.5+(a%6===0?8:0);
      d+=(a?'L':'M')+(rr*Math.cos(t)).toFixed(1)+','+(rr*Math.sin(t)).toFixed(1);}
    el('path',{d:d+'Z',fill:C[1],stroke:C[1],'stroke-width':7,'stroke-linejoin':'round'},s);
    el('circle',{cx:-58,cy:30,r:4,fill:C[1]},s);el('circle',{cx:56,cy:-36,r:3,fill:C[1]},s);
  }
  if(ringed)el('path',{d:'M-80,0 A80,19 0 0 1 80,0',transform:'rotate(-22)',fill:'none',stroke:rc,'stroke-width':8,'stroke-linecap':'round',opacity:.9},s);
  el('circle',{r:50,fill:C[0]},s);
  const q=el('g',{'clip-path':`url(#${id})`},s);
  const P2=(d,f)=>el('path',{d,fill:f},q), CI=(cx,cy,rr,f)=>el('circle',{cx,cy,r:rr,fill:f},q);
  const WV=(y,a,c,w)=>el('path',{d:wave(y,a),fill:'none',stroke:c,'stroke-width':w,'stroke-linecap':'round'},q);
  switch(type){
    case 'earth':
      P2('M-52,-8 C-38,-30 -22,-6 -28,10 C-34,26 -44,30 -52,42 Z',C[1]);
      P2('M6,-52 C14,-36 34,-40 40,-24 C48,-10 30,-6 22,-14 C14,-22 0,-30 6,-52 Z',C[1]);
      P2('M-6,10 C4,2 16,8 12,20 C8,30 -8,26 -6,10 Z',C[1]);
      P2('M18,32 C30,22 48,28 54,38 L54,54 L12,54 Z',C[1]);CI(40,10,5,C[1]);break;
    case 'waves': case 'purple': case 'core':
      [[-34,9,C[1],7],[-18,7,C[2],5],[0,9,C[1],7],[18,8,C[2],5],[34,9,C[1],7]].forEach(a=>WV(...a));break;
    case 'sun':
      el('ellipse',{cx:-14,cy:20,rx:16,ry:6,fill:C[2]},q);el('ellipse',{cx:20,cy:24,rx:11,ry:5,fill:C[2]},q);
      el('ellipse',{cx:24,cy:4,rx:8,ry:3.5,fill:C[2]},q);break;
    case 'spots':
      [[-30,-12,13],[16,10,10],[32,-32,9],[-6,34,12],[40,26,15],[-42,24,7]].forEach(a=>CI(...a,C[1]));break;
    case 'blue':
      [[-28,-10,10,8,20],[24,-24,8,6,-15],[2,16,12,9,10],[-22,32,8,6,0],[34,22,10,8,30],[-38,-34,6,5,0]].forEach(a=>
        el('ellipse',{cx:a[0],cy:a[1],rx:a[2],ry:a[3],transform:`rotate(${a[4]} ${a[0]} ${a[1]})`,fill:C[1]},q));break;
    case 'hearts':
      [[-26,8,16],[24,-30,13],[28,24,12],[-6,36,9],[-38,-28,8],[40,2,7]].forEach(a=>P2(heart(...a),C[1]));break;
    case 'cheese':
      P2('M-54,-20 C-30,-34 -12,-10 4,-24 C22,-40 40,-20 54,-30 L54,18 C38,28 22,8 6,24 C-12,42 -30,20 -54,30 Z',C[1]);
      [[-24,4,6],[18,-2,5],[34,-14,4],[-4,-8,3.5]].forEach(a=>CI(...a,C[2]));break;
    case 'ring':
      [[-36,-24,22],[20,-8,26],[-20,18,20],[30,26,16]].forEach(a=>P2(`M${a[0]-a[2]},${a[1]} Q${a[0]},${a[1]-5} ${a[0]+a[2]},${a[1]} Q${a[0]},${a[1]+3} ${a[0]-a[2]},${a[1]} Z`,C[1]));break;
    case 'clouds':
      [[-30,-30],[18,4],[-22,30],[38,-28]].forEach(([x,y])=>{CI(x,y,9,C[1]);CI(x+10,y-4,11,C[1]);CI(x+21,y,8,C[1]);
        el('rect',{x:x-6,y:y,width:30,height:8,rx:4,fill:C[1]},q);});break;
    case 'marble':
      el('path',{d:'M-56,-14 C-30,-34 -10,0 14,-16 C34,-30 44,-4 56,-12',fill:'none',stroke:C[1],'stroke-width':10,'stroke-linecap':'round'},q);
      el('path',{d:'M-56,24 C-36,8 -18,34 6,20 C28,6 40,30 56,22',fill:'none',stroke:C[1],'stroke-width':9,'stroke-linecap':'round'},q);
      el('path',{d:'M-30,-2 C-18,-10 -6,4 8,-2',fill:'none',stroke:C[2],'stroke-width':4,'stroke-linecap':'round'},q);break;
    case 'crater':
      [[-28,-20,'M-36,-28 L-22,-30 L-18,-18 L-28,-10 L-38,-16 Z'],[0,0,'M14,-36 L26,-34 L28,-24 L18,-20 L10,-26 Z'],
       [0,0,'M-14,18 L0,14 L8,24 L0,36 L-14,32 Z'],[0,0,'M28,10 L40,8 L44,20 L34,26 L26,20 Z'],[0,0,'M-44,10 L-36,8 L-34,16 L-42,20 Z']]
       .forEach(a=>P2(a[2],C[1]));break;
  }
  el('path',{d:'M-38,-20 A42,42 0 0 1 -16,-40',fill:'none',stroke:'#fff','stroke-width':5,'stroke-linecap':'round',opacity:.35},s);
  if(ringed)el('path',{d:'M-80,0 A80,19 0 0 0 80,0',transform:'rotate(-22)',fill:'none',stroke:rc,'stroke-width':8,'stroke-linecap':'round'},s);
  const face=el('g',{},s);
  return {g,setMood(m){if(face.dataset.m!==m){face.dataset.m=m;face.innerHTML=FACE[m];}}};
}

const SHIP=`<ellipse cx="-24" cy="0" rx="12" ry="5" fill="#9BE3FF" opacity=".55" filter="url(#glow)">
   <animate attributeName="rx" dur=".22s" repeatCount="indefinite" values="12;8;12"/></ellipse>
 <path d="M-16,-6 L-26,-15 L-6,-7 Z" fill="#F0A2AC"/>
 <path d="M-16,6 L-26,15 L-6,7 Z" fill="#F0A2AC"/>
 <path d="M-20,-7 Q6,-11 24,0 Q6,11 -20,7 Q-23,0 -20,-7 Z" fill="#F4F7FA" stroke="#C8D3DC" stroke-width="1.2"/>
 <path d="M4,-4.5 Q14,-3 17,0 Q14,3 4,4.5 Z" fill="#6FA3C2"/>
 <circle cx="-8" cy="0" r="2" fill="#EE8C93"/>`;

/* 깜짝 퀴즈를 내는 UFO 외계인 · 표정 3가지(happy 기본 · joy 정답 · oops 오답) */
const UFO=`<g class="ufb"><path d="M-13,12 L-18,22 M13,12 L18,22 M-20,22 h5 M15,22 h5" stroke="#8C949E" stroke-width="3" stroke-linecap="round" fill="none"/>
 <path d="M-22,-1 A22,30 0 0 1 22,-1 Z" fill="#D8F3FF" opacity=".32"/>
 <g transform="translate(0 -5)">
   <path d="M-6,-15 L-9,-22 M6,-15 L9,-22" stroke="#5DB33F" stroke-width="2.4" stroke-linecap="round"/>
   <circle cx="-9.5" cy="-23" r="2.6" fill="#6CC24A"/><circle cx="9.5" cy="-23" r="2.6" fill="#6CC24A"/>
   <ellipse cx="0" cy="2" rx="9" ry="7" fill="#5DB33F"/>
   <ellipse cx="0" cy="-8" rx="11.5" ry="10" fill="#6CC24A"/>
   <ellipse cx="-4" cy="-12" rx="3.2" ry="1.8" fill="#fff" opacity=".35"/>
   <g class="uf-face"></g>
 </g>
 <path d="M-22,-1 A22,30 0 0 1 22,-1" fill="none" stroke="#9FE0BE" stroke-width="2.4"/>
 <path d="M-15,-14 A16,22 0 0 1 -5,-25" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity=".7"/>
 <path d="M-30,4 Q-28,17 0,18 Q28,17 30,4 Z" fill="#F07E45"/>
 <path d="M-26,11 Q0,19 26,11" fill="none" stroke="#D9622E" stroke-width="1.6" opacity=".6"/>
 <ellipse cx="0" cy="3" rx="31" ry="7.5" fill="#B4BBC3"/>
 <path d="M-24,0.5 Q0,-4 24,0.5" fill="none" stroke="#E2E6EA" stroke-width="2.4" stroke-linecap="round"/>
 <g class="uf-lt" fill="#FFD54F"><circle cx="-17" cy="5" r="2.6"/><circle cx="0" cy="7" r="2.8"/><circle cx="17" cy="5" r="2.6"/></g></g>`;
const UFACE={
 happy:`<ellipse cx="-4" cy="-8.5" rx="1.7" ry="2.2" fill="#2F3A2A"/><ellipse cx="4" cy="-8.5" rx="1.7" ry="2.2" fill="#2F3A2A"/>
   <path d="M-3.5,-4 Q0,-1 3.5,-4" fill="none" stroke="#2F3A2A" stroke-width="1.5" stroke-linecap="round"/>`,
 joy:`<path d="M-6,-8 Q-4,-11 -2,-8 M2,-8 Q4,-11 6,-8" fill="none" stroke="#2F3A2A" stroke-width="1.6" stroke-linecap="round"/>
   <path d="M-3.6,-4.6 Q0,0 3.6,-4.6 Z" fill="#2F3A2A"/>
   <ellipse cx="-7.5" cy="-4.5" rx="2.2" ry="1.3" fill="#F49AA6" opacity=".8"/><ellipse cx="7.5" cy="-4.5" rx="2.2" ry="1.3" fill="#F49AA6" opacity=".8"/>`,
 oops:`<circle cx="-4" cy="-8.5" r="2" fill="#2F3A2A"/><circle cx="4" cy="-8.5" r="2" fill="#2F3A2A"/>
   <ellipse cx="0" cy="-3.5" rx="1.8" ry="2.2" fill="#2F3A2A"/>
   <path d="M8,-15 q1.5,3 0,4 q-1.5,-1 0,-4 Z" fill="#9BD8FF"/>`
};
const ufoSVG=(m,cls)=>`<svg class="${cls||''}" viewBox="-36 -36 72 62" aria-hidden="true"><g class="ufbob">${UFO.replace('<g class="uf-face"></g>','<g class="uf-face">'+UFACE[m||'happy']+'</g>')}</g></svg>`;

/* ---------- 강 고르기 화면 · 모행성을 공전하는 우주선 ---------- */
if(!L){
  document.title='행성 타이핑 · 은또링쌤의 행성 지도';
  app.innerHTML=`<svg id="space"><defs>
     <filter id="glow" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="4" result="b"/>
       <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs></svg>
   <div class="ttop"><a href="index.html">⌂ 홈</a><div class="ttl">행성 타이핑<span>강 고르기</span></div></div>
   <div class="tpick">
     <div class="hero">
       <svg id="hero" viewBox="-300 -175 600 350" aria-hidden="true">
         <g id="hStar"></g>
         <g transform="rotate(-12)">
           <path d="M-215,0 A215,60 0 0 1 215,0" fill="none" stroke="rgba(255,255,255,.28)" stroke-width="2" stroke-dasharray="3 8"/>
           <g id="hBack"></g>
         </g>
         <g id="hCore"></g>
         <g transform="rotate(-12)">
           <path d="M-215,0 A215,60 0 0 0 215,0" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="2" stroke-dasharray="3 8"/>
           <g id="hFront"></g>
         </g>
         <g id="hSat"></g>
       </svg>
       <h1>행성 <b>타이핑</b></h1>
       <p>강을 고르면 모행성 둘레의 개념 행성 20개를 타이핑으로 하나씩 깨우며 항해합니다.<br>
         <small>🚀 주행 — 이름 보며 치기 · 🔭 탐사 — 단서로 맞히기 · 🛸 항해 중 UFO가 나타나면 깜짝 퀴즈! · 완주한 강의 행성은 잠에서 깨어나요</small></p>
     </div>
     <div id="tGroups"></div>
   </div>`;
  const sv=$('#space'); defs=sv.querySelector('defs');
  sv.setAttribute('viewBox','0 0 1600 1000');sv.setAttribute('preserveAspectRatio','xMidYMid slice');
  stars(sv,rng(7),360,0,0,1600,1000);
  const hero=$('#hero'); defs=hero.querySelector('defs')||defs;
  stars($('#hStar'),rng(11),70,-300,-175,600,350);
  /* 모행성 */
  const core=cutePlanet($('#hCore'),'core',92); core.setMood('happy');
  core.g.setAttribute('class','hbob');
  /* 둘레에 떠 있는 작은 행성들 */
  [[-245,-120,'earth','happy',22],[250,-112,'hearts','wait',18],[-262,118,'spots','sleep',17],[262,120,'sun','happy',20],[-150,148,'clouds','sleep',13],]
    .forEach(([x,y,t,m,r],k)=>{const g=el('g',{transform:`translate(${x} ${y})`},$('#hSat'));
      const b=el('g',{class:'hbob'},g);b.style.animationDelay=(-k*.7)+'s';const p=cutePlanet(b,t,r);p.setMood(m);});
  /* 깜짝 퀴즈를 내는 UFO가 구석에 둥실 */
  {const u=el('g',{transform:'translate(178 -132) scale(1.15)',class:'hufo'},$('#hSat'));u.innerHTML=`<g class="ufbob">${UFO.replace('<g class="uf-face"></g>','<g class="uf-face">'+UFACE.happy+'</g>')}</g>`;}
  /* 공전하는 우주선 */
  const back=$('#hBack'), front=$('#hFront');
  const ship=el('g',{}), shipR=el('g',{},ship); shipR.innerHTML=SHIP;
  let th=Math.PI*.15, last=0, lastT=0;
  const RX=215, RY=60;
  function orbit(now){
    const dt=Math.min(50,now-(lastT||now));lastT=now;
    th+=dt*0.00085;
    const x=RX*Math.cos(th), y=RY*Math.sin(th), fr=Math.sin(th)>0;
    const layer=fr?front:back; if(ship.parentNode!==layer)layer.appendChild(ship);
    const a=Math.atan2(RY*Math.cos(th),-RX*Math.sin(th)), sc=.95+.3*Math.sin(th);
    ship.setAttribute('transform',`translate(${x} ${y}) scale(${sc})`);shipR.setAttribute('transform',`rotate(${a*180/Math.PI})`);
    if(now-last>45){last=now;
      const c=el('circle',{cx:x-Math.cos(a)*22*sc,cy:y-Math.sin(a)*22*sc,r:3.2*sc,fill:'#BFEFFF',class:'trail'},layer);
      setTimeout(()=>c.remove(),900);}
    requestAnimationFrame(orbit);
  }
  requestAnimationFrame(orbit);
  /* 강 카드 · 주제별 묶음 */
  const GC=['#8FC9A3','#F0A2AC','#C9D26E','#9BC4DC','#C9C4FF','#FFCC66'];
  $('#tGroups').innerHTML=CLUSTERS.map((c,gi)=>`<section class="grp"><h2><i style="background:${GC[gi%6]}"></i>${c.name}</h2>
    <div class="grid">${c.ns.map(n=>{const l=LESSONS.find(x=>x.n===n);
      const a=rd(TKEY(n,'d')), b=rd(TKEY(n,'q'));
      const rc=[a?'🚀 '+mmss(a.t):'',b?'🔭 '+(20-b.miss)+'/20':''].filter(Boolean).join(' · ');
      return `<a class="tc ${l.ready?'':'off'}" href="typing.html?l=${PAD(n)}" data-n="${n}" data-m="${a||b?'happy':'sleep'}">
        <span class="ico"></span><span class="tx"><small>${PAD(n)}강</small><b>${l.t}</b>${rc?`<em>${rc}</em>`:''}</span><span class="go">→</span></a>`;
    }).join('')}</div></section>`).join('');
  document.querySelectorAll('.tc').forEach(a=>{
    const m=document.createElementNS(NS,'svg');m.setAttribute('viewBox','-62 -62 124 124');a.querySelector('.ico').appendChild(m);
    const p=cutePlanet(m,PTYPES[(+a.dataset.n*7)%PTYPES.length],50);p.setMood(a.dataset.m);
    a.addEventListener('mouseenter',()=>p.setMood('happy'));
    a.addEventListener('mouseleave',()=>p.setMood(a.dataset.m));
  });
  return;
}

/* ---------- 한글 자모 도구 ---------- */
const CHO='ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ';
const JUNG=['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅗㅏ','ㅗㅐ','ㅗㅣ','ㅛ','ㅜ','ㅜㅓ','ㅜㅔ','ㅜㅣ','ㅠ','ㅡ','ㅡㅣ','ㅣ'];
const JONG=['','ㄱ','ㄲ','ㄱㅅ','ㄴ','ㄴㅈ','ㄴㅎ','ㄷ','ㄹ','ㄹㄱ','ㄹㅁ','ㄹㅂ','ㄹㅅ','ㄹㅌ','ㄹㅍ','ㄹㅎ','ㅁ','ㅂ','ㅂㅅ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
const CMP={'ㄳ':'ㄱㅅ','ㄵ':'ㄴㅈ','ㄶ':'ㄴㅎ','ㄺ':'ㄹㄱ','ㄻ':'ㄹㅁ','ㄼ':'ㄹㅂ','ㄽ':'ㄹㅅ','ㄾ':'ㄹㅌ','ㄿ':'ㄹㅍ','ㅀ':'ㄹㅎ','ㅄ':'ㅂㅅ',
  'ㅘ':'ㅗㅏ','ㅙ':'ㅗㅐ','ㅚ':'ㅗㅣ','ㅝ':'ㅜㅓ','ㅞ':'ㅜㅔ','ㅟ':'ㅜㅣ','ㅢ':'ㅡㅣ'};
const isH=c=>{const x=c.charCodeAt(0);return x>=0xAC00&&x<=0xD7A3};
function jamo(s){let o='';for(const ch of s){if(isH(ch)){const i=ch.charCodeAt(0)-0xAC00;
  o+=CHO[Math.floor(i/588)]+JUNG[Math.floor(i%588/28)]+JONG[i%28];}else o+=CMP[ch]||ch;}return o;}
const cho=ch=>isH(ch)?CHO[Math.floor((ch.charCodeAt(0)-0xAC00)/588)]:ch;
/* 띄어쓰기 · 가운뎃점 · 괄호는 치지 않아도 됩니다 */
const SKIP=/[\s·・‧∙()（）\[\]\-–—,.]/;
const norm=s=>[...s].filter(c=>!SKIP.test(c)).join('').toLowerCase();

/* ---------- 데이터 ---------- */
/* 강별 키워드 파일(data/typeNN.js의 TYPE)이 있으면 그것을, 없으면 마인드맵 개념(DATA)을 씁니다 */
const ZP=parseInt(Q.get('z'),10)||0;                       /* z=1~4 이면 그 구역만 */
const SRC=typeof TYPE!=='undefined'
  ?TYPE.map(z=>({name:z.z,items:z.items.map(x=>({k:x.k,desc:x.c||'',g:x.g||'',hot:!!x.hot}))}))
  :DATA.map(b=>({name:b.b,items:b.items.map(x=>({k:x.k,desc:x.desc||'',g:'',hot:!!x.hot}))}));
const ZONES=SRC.map((z,bi)=>({...z,bi})).filter(z=>!ZP||z.bi===ZP-1);
const ITEMS=[];
ZONES.forEach(z=>z.items.forEach((it,k)=>ITEMS.push({...it,b:z.name,bi:z.bi,no:`${z.bi+1}-${k+1}`})));
const N=ITEMS.length;
const RKEY=m=>TKEY(LN,m)+(ZP?'z'+ZP:'');
function clueOf(it){let c=it.desc;[it.k,it.k.replace(/\s+/g,'')].forEach(w=>{if(w.length>1)c=c.split(w).join('○○');});return c;}

/* ---------- 궤도 만들기 · 모행성 둘레를 바깥으로 도는 나선 ---------- */
const R=rng(LN*977+13), SQ=.8;              /* SQ: 위아래로 살짝 눌린 타원 궤도 */
const P=[]; let th=-Math.PI*.78, rad=440;
ZONES.forEach((z,zi)=>{
  if(zi>0)th+=.5;                           /* 구역이 바뀌면 크게 한 번 워프 */
  z.items.forEach((it,k)=>{
    if(zi>0||k>0)th+=232/rad;
    rad+=Math.max(10,Math.min(24,11000/rad));   /* 한 바퀴 돌 때마다 궤도 사이가 충분히 벌어지도록 */
    const rr=rad+(R()-.5)*36;
    P.push({x:rr*Math.cos(th),y:rr*Math.sin(th)*SQ,th});
  });
});
const a0=Math.atan2(P[0].y,P[0].x);
const S={x:205*Math.cos(a0-.35),y:205*Math.sin(a0-.35)*SQ};   /* 모행성 앞 발사대 */
const QP=[S,...P];
function segD(j){const p0=QP[j-1]||QP[j],p1=QP[j],p2=QP[j+1],p3=QP[j+2]||QP[j+1];
  const c1={x:p1.x+(p2.x-p0.x)/6,y:p1.y+(p2.y-p0.y)/6},c2={x:p2.x-(p3.x-p1.x)/6,y:p2.y-(p3.y-p1.y)/6};
  return `M${p1.x},${p1.y} C${c1.x},${c1.y} ${c2.x},${c2.y} ${p2.x},${p2.y}`;}
const BB=[...QP,{x:-170,y:-170},{x:170,y:170}].reduce((a,p)=>({x0:Math.min(a.x0,p.x),y0:Math.min(a.y0,p.y),
  x1:Math.max(a.x1,p.x),y1:Math.max(a.y1,p.y)}),{x0:1e9,y0:1e9,x1:-1e9,y1:-1e9});

/* ---------- 화면 뼈대 ---------- */
document.title=`${PAD(LN)}강 행성 타이핑 · 은또링쌤의 행성 지도`;
app.innerHTML=`
 <svg id="space"><defs>
   <filter id="glow" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="4" result="b"/>
     <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
   <filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="60"/></filter>
   <radialGradient id="core" cx="35%" cy="32%" r="75%"><stop offset="0" stop-color="#FFD9DD"/>
     <stop offset=".55" stop-color="#EE8C93"/><stop offset="1" stop-color="#B9606C"/></radialGradient>
   <radialGradient id="hub" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#B9C6D2"/></radialGradient>
 </defs><g id="world"></g></svg>
 <div class="ttop">
   <a href="lesson${PAD(LN)}.html" title="마인드맵으로">←<span class="bk"> 마인드맵</span></a>
   <div class="ttl">${PAD(LN)}강 ${esc(LESSON.title)}<span>행성 타이핑</span></div>
   <div class="prog"><i id="tProg"></i></div><span class="pc" id="tPc"></span>
   <div class="acc" id="tAcc"></div>
   <div class="seg zsel">${[0,...SRC.map((z,i)=>i+1)].map(k=>`<a class="${k===ZP?'on':''}" title="${k?esc(SRC[k-1].name):'모든 구역'}"
      href="typing.html?l=${PAD(LN)}${k?'&z='+k:''}${Q.get('m')==='q'?'&m=q':''}">${k?k+'구역':'전체'}<small>${k?SRC[k-1].items.length:SRC.reduce((a,z)=>a+z.items.length,0)}</small></a>`).join('')}</div>
   <div class="seg md"><button data-m="d">🚀 주행</button><button data-m="q">🔭 탐사</button></div>
   <button id="tRe" title="처음부터 다시">↺</button>
 </div>
 <div class="tzoom">
   <button id="zAll" title="궤도 전체 보기">⤢<small>전체</small></button>
   <button id="zIn" title="확대">＋</button><button id="zOut" title="축소">－</button>
 </div>
 <div class="hud">
   <div class="hrow">
     <div class="meter">
       <svg width="46" height="28" viewBox="0 0 46 28" aria-hidden="true">
         <path d="M5 24 A18 18 0 0 1 41 24" fill="none" stroke="rgba(255,255,255,.15)" stroke-width="5" stroke-linecap="round"/>
         <path id="gArc" d="M5 24 A18 18 0 0 1 41 24" fill="none" stroke="#8FC9A3" stroke-width="5" stroke-linecap="round"
           stroke-dasharray="57" stroke-dashoffset="57"/>
         <line id="gNd" x1="23" y1="24" x2="10" y2="24" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>
         <circle cx="23" cy="24" r="2.6" fill="#fff"/></svg>
       <span class="v"><b id="tCpm">0</b><small>타/분</small></span>
       <span class="sep"></span>
       <span class="v"><small>운항 시간</small><b id="tTm">00:00.00</b></span>
     </div>
     <div class="ztag" id="tZone"></div>
   </div>
   <div class="console" id="tBar">
     <div class="now">
       <div class="port"><span class="mini big" id="tNowI"></span></div>
       <div class="mid">
         <div class="dock"><span class="badge" id="tNo"></span>도킹할 행성</div>
         <div class="kw" id="tKw" aria-live="polite"></div>
         <input id="tyIn" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="여기에 입력" aria-label="행성 이름 입력">
         <div class="sub" id="tSub"></div>
         <div class="orbit"><span class="ob"><span class="mini xs" id="tPvO"></span><span class="ot" id="tPvB"></span></span><i></i><span class="ob nx"><span class="ot" id="tNxB"></span><span class="mini xs" id="tNxO"></span></span></div>
         <div class="ttools" id="tTools"></div>
       </div>
     </div>
   </div>
 </div>
 <div class="fin" id="tyFin"><div class="box" id="tyFinBox"></div></div>
 <div class="ufo" id="tyUfo"><div class="ubox" id="tyUfoBox" role="dialog" aria-label="깜짝 퀴즈"></div></div>`;

const sv=$('#space'), world=$('#world'), inp=$('#tyIn');
document.body.classList.add('hudA');

/* 배경 — 성운 · 별 · 먼 은하 */
(function deco(){
  const r=rng(LN*31+5), pad=900, w=BB.x1-BB.x0+2*pad, h=BB.y1-BB.y0+2*pad;
  const g=el('g',{},world);
  for(let i=0;i<7;i++){
    el('circle',{cx:BB.x0-pad/2+r()*(w-pad),cy:BB.y0-pad/2+r()*(h-pad),r:180+r()*260,fill:COL[i%4],
      opacity:(.05+r()*.05).toFixed(2),filter:'url(#soft)'},g);
  }
  stars(g,r,700,BB.x0-pad,BB.y0-pad,w,h);
  for(let i=0;i<3;i++){ /* 먼 은하 */
    const cx=BB.x0-400+r()*(w-1000), cy=BB.y0-400+r()*(h-1000);
    const gg=el('g',{transform:`translate(${cx} ${cy}) rotate(${r()*180})`,opacity:.35},g);
    el('ellipse',{rx:70,ry:16,fill:'#fff',opacity:.18,filter:'url(#glow)'},gg);
    el('ellipse',{rx:24,ry:7,fill:'#fff',opacity:.5},gg);
  }
})();

defs=sv.querySelector('defs');

/* 모행성 — 강 제목 */
(function core(){
  const g=el('g',{},world);
  el('circle',{r:230,fill:'#EE8C93',opacity:.12,filter:'url(#soft)'},g);
  const cp=cutePlanet(g,'core',125); cp.setMood('happy');
  const words=LESSON.title.split(' '), lines=[];let cur='';
  words.forEach(wd=>{if((cur+' '+wd).trim().length>11&&cur){lines.push(cur);cur=wd;}else cur=(cur+' '+wd).trim();});
  if(cur)lines.push(cur);
  const h=28*lines.length+30, wdt=Math.max(...lines.map(l=>l.length))*22+50;
  el('rect',{x:-wdt/2,y:150,width:wdt,height:h,rx:22,fill:'rgba(20,26,44,.72)',stroke:'rgba(255,255,255,.18)'},g);
  const n=el('text',{'text-anchor':'middle',y:174,class:'core-n'},g);n.textContent=PAD(LN)+'강';
  const t=el('text',{'text-anchor':'middle',class:'core-t'},g);
  lines.forEach((ln,i)=>{const s=el('tspan',{x:0,y:200+i*28},t);s.textContent=ln;});
})();

/* 구역 이름 */
ZONES.forEach(z=>{
  const bi=z.bi, idx=ITEMS.findIndex(it=>it.bi===bi), n=z.items.length, mid=P[idx+Math.floor((n-1)/2)];
  const len=Math.hypot(mid.x,mid.y/SQ)||1, ox=mid.x/len*150, oy=mid.y/len*150*SQ;
  const t=el('text',{x:mid.x+ox,y:mid.y+oy,'text-anchor':'middle',class:'zone',fill:COL[bi]},world);
  t.textContent=`${bi+1}구역 · ${z.name}`;
});

/* 궤도 · 우주 정거장 · 우주선 */
const SEG=[];
const gR=el('g',{},world);
for(let j=0;j<N;j++){
  const d=segD(j), c=COL[ITEMS[j].bi];
  el('path',{d,fill:'none',stroke:'rgba(255,255,255,.22)','stroke-width':1.6,'stroke-dasharray':'2 9','stroke-linecap':'round'},gR);
  const dn=el('path',{d,fill:'none',stroke:c,'stroke-width':3,'stroke-linecap':'round',filter:'url(#glow)'},gR);
  const len=dn.getTotalLength(); dn.style.strokeDasharray=len+' '+len; dn.style.strokeDashoffset=len;
  SEG.push({el:dn,len});
}
el('circle',{cx:S.x,cy:S.y,r:7,fill:'#fff',opacity:.8},world);
const lp=el('text',{x:S.x,y:S.y+24,'text-anchor':'middle',class:'pl-no'},world); lp.textContent='발사대';
const ghost=el('text',{class:'ghost','text-anchor':'middle'},world);
const gTrail=el('g',{},world);
const ptype=i=>PTYPES[(i*5+LN*7)%PTYPES.length];
function mini(box,i,mood){ /* 계기판용 작은 행성 */
  box.innerHTML='';
  if(i==null){box.textContent=mood;return;}
  const m=document.createElementNS(NS,'svg');m.setAttribute('viewBox','-62 -62 124 124');box.appendChild(m);
  const p=cutePlanet(m,ptype(i),50);p.setMood(mood);
}
const PR=34;
const PL=P.map((p,i)=>{
  const it=ITEMS[i], c=COL[it.bi];
  const g=el('g',{class:'pl',transform:`translate(${p.x},${p.y})`},world);
  const halo=el("circle",{r:PR+20,fill:c,opacity:0},g);
  const body=el('g',{class:'bob'},g); body.style.animationDelay=(-R()*3).toFixed(2)+'s';
  const cp=cutePlanet(body,ptype(i),PR);
  const nm=el('text',{y:PR+22,'text-anchor':'middle',class:'pl-name'},g);
  const pw=it.hot?46:36;
  el('rect',{x:-pw/2,y:PR+29,width:pw,height:15,rx:7.5,fill:COLD[it.bi]},g);
  const no=el('text',{y:PR+40,'text-anchor':'middle',class:'pl-no'},g); no.textContent=it.no+(it.hot?' ★':'');
  const ds=el('text',{y:PR+60,'text-anchor':'middle',class:'pl-desc'},g);
  if(it.g){const gt=el('text',{y:-PR-10,'text-anchor':'middle',class:'pl-grp'},g);gt.textContent=it.g;}
  return {g,halo,cp,nm,ds,body};
});
const flyPath=el('path',{d:'M0,0',fill:'none',stroke:'none'},world);
let shipAt={x:0,y:0};
const ship=el('g',{},world), shipR=el('g',{},ship);
shipR.innerHTML=SHIP;
let lastTrail=0;
function placeShip(p,a,trail){
  shipAt={x:p.x,y:p.y};
  ship.setAttribute('transform',`translate(${p.x},${p.y})`);shipR.setAttribute('transform',`rotate(${a*180/Math.PI})`);
  const now=performance.now();
  if(trail&&now-lastTrail>28){lastTrail=now;
    const c=el('circle',{cx:p.x-Math.cos(a)*24,cy:p.y-Math.sin(a)*24,r:3.4,fill:'#BFEFFF',class:'trail'},gTrail);
    setTimeout(()=>c.remove(),900);}
}

/* ---------- 카메라 ---------- */
let W=0,H=0,zoom=1,overview=false;
const cam={x:0,y:0,s:1};
const small=()=>innerWidth<=760;
function base(){return small()?0.74:1;}
function anchor(){return {ax:.5,ay:small()?.31:.37};}
function apply(){const a=anchor();
  world.setAttribute('transform',`translate(${W*a.ax-cam.x*cam.s},${H*a.ay-cam.y*cam.s}) scale(${cam.s})`);}
function resize(){W=sv.clientWidth;H=sv.clientHeight;if(overview)fitAll(false);else{cam.s=base()*zoom;apply();}}
addEventListener('resize',resize);
function followPoint(){const a=QP[cur]||QP[N], b=QP[cur+1]||a;return {x:a.x+(b.x-a.x)*.45,y:a.y+(b.y-a.y)*.45};}
let camAnim=null;
function moveCam(to,s,ms){
  const from={x:cam.x,y:cam.y,s:cam.s}, t0=performance.now();
  cancelAnimationFrame(camAnim);
  const f=now=>{const t=Math.min(1,(now-t0)/ms), e=1-Math.pow(1-t,3);
    cam.x=from.x+(to.x-from.x)*e;cam.y=from.y+(to.y-from.y)*e;cam.s=from.s+(s-from.s)*e;apply();
    if(t<1)camAnim=requestAnimationFrame(f);};
  camAnim=requestAnimationFrame(f);
}
function fitAll(anim){
  const top=80, bot=small()?260:250, pad=60;
  const s=Math.min((W-pad*2)/(BB.x1-BB.x0+260),(H-top-bot)/(BB.y1-BB.y0+200),1);
  const a=anchor(), cx=(BB.x0+BB.x1)/2, cy=(BB.y0+BB.y1)/2;
  const to={x:cx,y:cy-((top+(H-bot))/2-H*a.ay)/s};
  if(anim)moveCam(to,s,800);else{cam.x=to.x;cam.y=to.y;cam.s=s;apply();}
}
function setOverview(on){overview=on;$('#zAll').classList.toggle('on',on);
  if(on)fitAll(true);else moveCam(followPoint(),base()*zoom,600);}
$('#zAll').onclick=()=>{setOverview(!overview);inp.focus();};
$('#zIn').onclick=()=>{zoom=Math.min(1.8,zoom*1.2);overview=false;$('#zAll').classList.remove('on');moveCam(followPoint(),base()*zoom,300);inp.focus();};
$('#zOut').onclick=()=>{zoom=Math.max(.45,zoom/1.2);overview=false;$('#zAll').classList.remove('on');moveCam(followPoint(),base()*zoom,300);inp.focus();};

/* ---------- 항해 (도킹 순서대로 차례차례) ---------- */
const queue=[]; let flying=false;
function fly(){
  if(flying||!queue.length)return;
  flying=true;
  const j=queue.shift(), sg=SEG[j], D=queue.length>2?180:queue.length?360:900;
  const camFrom={x:cam.x,y:cam.y}, b=QP[j+1], c=QP[j+2]||b;
  const camTo={x:b.x+(c.x-b.x)*.45,y:b.y+(c.y-b.y)*.45};
  /* 우주선은 행성을 가리지 않도록 행성 바로 앞에 멈춥니다 */
  const from={...shipAt}, arr=sg.el.getPointAtLength(Math.max(0,sg.len-(PR+22))), mid=sg.el.getPointAtLength(sg.len/2);
  flyPath.setAttribute('d',`M${from.x},${from.y} Q${2*mid.x-(from.x+arr.x)/2},${2*mid.y-(from.y+arr.y)/2} ${arr.x},${arr.y}`);
  const FL=flyPath.getTotalLength();
  const t0=performance.now();
  const f=now=>{
    const t=Math.min(1,(now-t0)/D), e=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
    const l=FL*e, p=flyPath.getPointAtLength(l), q=flyPath.getPointAtLength(Math.min(FL,l+2)), p0=flyPath.getPointAtLength(Math.max(0,l-2));
    placeShip(p,Math.atan2(q.y-p0.y,q.x-p0.x),t<1);
    sg.el.style.strokeDashoffset=sg.len*(1-e);
    if(!overview){cam.x=camFrom.x+(camTo.x-camFrom.x)*e;cam.y=camFrom.y+(camTo.y-camFrom.y)*e;apply();}
    if(t<1)requestAnimationFrame(f);
    else{dockFx(j);flying=false;
      if(ufoAt.has(j+1)){ufoAt.delete(j+1);ufoDue++;}
      /* 빨리 쳐서 퀴즈 지점을 지나쳤으면 행성 3개 뒤에 이어서 나와요 */
      if(queue.length)fly();else if(ufoDue&&j+1-ufoLast>=3){ufoDue--;ufoLast=j+1;setTimeout(openUfo,350);}else if(done)setTimeout(finish,500);}
  };
  cancelAnimationFrame(camAnim);
  requestAnimationFrame(f);
}
const landed=new Set();
function dockFx(j){ /* 도킹 — 잠자던 행성이 깨어나 웃습니다 */
  const o=PL[j], it=ITEMS[j], c=missed.has(j)?'#DB7F8C':COL[it.bi];
  landed.add(j);o.cp.setMood(missed.has(j)?'sad':'happy');o.g.classList.add('woke');
  const ring=el('circle',{r:PR+4,fill:'none',stroke:c,'stroke-width':3,class:'dockring'},o.g);
  setTimeout(()=>ring.remove(),900);
  o.body.classList.remove('jump');void o.body.getBBox();o.body.classList.add('jump');
  o.ds.textContent=it.desc.length>26?it.desc.slice(0,25)+'…':it.desc;
}

/* ---------- 상태 ---------- */
let mode=Q.get('m')==='q'?'q':'d', cur=0, t0, typed, err, strokes, wrong, hint, reveal, missed=new Set(), lastJ=0, done=false;
document.querySelectorAll('.seg.md button').forEach(b=>b.onclick=()=>{mode=b.dataset.m;
  try{history.replaceState(null,'','?l='+PAD(LN)+(ZP?'&z='+ZP:'')+(mode==='q'?'&m=q':''));}catch(e){}start();});
$('#tRe').onclick=start;
sv.addEventListener('pointerdown',()=>setTimeout(()=>inp.focus(),0));

function start(){
  cur=0;t0=0;typed=0;err=0;strokes=0;wrong=0;hint=new Set();reveal=new Set();missed=new Set();lastJ=0;done=false;
  queue.length=0;flying=false;gTrail.innerHTML='';resetUfo();
  document.querySelectorAll('.seg.md button').forEach(b=>b.classList.toggle('on',b.dataset.m===mode));
  document.body.classList.toggle('q',mode==='q');
  $('#tyFin').classList.remove('on');
  SEG.forEach(s=>s.el.style.strokeDashoffset=s.len);
  landed.clear();PL.forEach(o=>{o.ds.textContent='';o.g.classList.remove('woke');});
  placeShip(S,Math.atan2(P[0].y-S.y,P[0].x-S.x),false);
  inp.value='';inp.classList.remove('err');
  W=sv.clientWidth;H=sv.clientHeight;
  overview=false;$('#zAll').classList.remove('on');
  const fp=followPoint();cam.x=fp.x;cam.y=fp.y;cam.s=base()*zoom;apply();
  $('#tTm').textContent='00:00.00';$('#tCpm').textContent='0';
  drawPlanets();drawBar();drawTop();
  setTimeout(()=>inp.focus(),60);
}

function drawPlanets(){
  PL.forEach((o,i)=>{
    const it=ITEMS[i], isDone=i<cur, isCur=i===cur, show=mode==='d'||isDone;
    o.g.setAttribute('class','pl'+(isDone?' done':'')+(isCur?' cur':'')+(show?'':' hid'));
    o.nm.textContent=show?it.k:'?';
    o.halo.setAttribute('class',isCur?'halo':'');o.halo.setAttribute('opacity',isCur?.45:0);
    o.cp.setMood(landed.has(i)?(missed.has(i)?'sad':'happy'):(i<=cur?'wait':'sleep'));
  });
  const t=P[cur];
  if(t&&mode==='d'){ghost.textContent=ITEMS[cur].k;ghost.setAttribute('x',t.x);ghost.setAttribute('y',t.y-70);}
  else ghost.textContent='';
}

function drawBar(){
  if(cur>=N)return;
  const it=ITEMS[cur], bar=$('#tBar');
  bar.style.setProperty('--c',COL[it.bi]);bar.style.setProperty('--cd',COLD[it.bi]);
  $('#tZone').innerHTML=`<span class="no" style="background:${COLD[it.bi]}">${it.bi+1}</span>${it.bi+1}구역 · ${esc(it.b)}`;
  $('#tNo').textContent=it.no;
  const pv=ITEMS[cur-1], nx=ITEMS[cur+1];
  const pvT=pv?pv.k:'발사대', nxT=nx?(mode==='d'?nx.k:'?'):'귀환';
  mini($('#tNowI'),cur,'wait');
  $('#tPvB').innerHTML=`<small>지나온</small> <b>${pv?pv.no:''}</b> ${esc(pvT)}`;
  $('#tNxB').innerHTML=`<small>다음</small> <b>${nx?nx.no:''}</b> ${esc(nxT)}`;
  mini($('#tPvO'),pv?cur-1:null,pv?(missed.has(cur-1)?'sad':'happy'):'🛰');
  mini($('#tNxO'),nx?cur+1:null,nx?'sleep':'🏁');
  if(mode==='d'){
    $('#tSub').innerHTML=(it.g?`<span class="gtag">${esc(it.g)}</span>`:'')+esc(it.desc);
    $('#tTools').innerHTML='<span class="msg" id="tMsg"></span>';
  }else{
    $('#tSub').innerHTML=esc(clueOf(it))+(it.g?` <span class="gtag">힌트 · ${esc(it.g)}</span>`:'');
    $('#tTools').innerHTML=`<button id="tHint">💡 초성 힌트</button><button id="tSkip">🙋 정답 보기</button><span class="msg" id="tMsg">답을 입력하고 Enter</span>`;
    $('#tHint').onclick=()=>{hint.add(cur);paint();inp.focus();};
    $('#tSkip').onclick=()=>{giveUp();inp.focus();};
  }
  paint();
}

function drawTop(){
  $('#tProg').style.width=(cur/N*100)+'%';
  $('#tPc').textContent=`${Math.min(cur,N)} / ${N}`;
  const s=stat();
  $('#tAcc').innerHTML=mode==='d'?`정확도<b>${s.acc}%</b>`:`맞힘<b>${cur-[...missed].filter(i=>i<cur).length}/${cur}</b>`;
}

/* 목표 글자 칠하기 */
function paint(){
  const it=ITEMS[cur]; if(!it)return;
  const tn=norm(it.k), iv=norm(inp.value);
  const okPre=jamo(tn).startsWith(jamo(iv));
  let full=0; for(let i=0;i<iv.length&&i<tn.length;i++){if(iv[i]===tn[i])full++;else break;}
  let idx=0, html='';
  for(const ch of it.k){
    if(SKIP.test(ch)){html+=ch===' '?' ':`<span class="${mode==='d'&&idx>0&&idx<=full?'ok':''}">${esc(ch)}</span>`;continue;}
    let cls='', shown=ch;
    if(mode==='d'){if(idx<full)cls='ok';else if(!okPre&&idx===full)cls='bad';}
    else if(reveal.has(cur))cls='ans';
    else{cls=hint.has(cur)?'mask h':'mask';shown=hint.has(cur)?cho(ch):'○';}
    html+=`<span class="${cls}">${esc(shown)}</span>`;idx++;
  }
  $('#tKw').innerHTML=html;
  inp.classList.toggle('err',mode==='d'&&!okPre&&iv.length>0);
}

inp.addEventListener('input',()=>{
  if(done||cur>=N||ufoOpen)return;
  if(!t0){t0=Date.now();tick();}
  if(overview)setOverview(false);
  const tn=norm(ITEMS[cur].k), iv=norm(inp.value), j=jamo(iv).length;
  if(j>lastJ){typed+=j-lastJ;if(!jamo(tn).startsWith(jamo(iv)))err+=j-lastJ;}
  lastJ=j;
  paint();
  if(iv===tn)arrive();
});
inp.addEventListener('keydown',e=>{
  if(e.key!=='Enter')return;
  if(!e.isComposing)e.preventDefault();
  setTimeout(submit,10); /* 조합 중인 글자가 확정된 뒤 확인 */
});

function submit(){
  if(done||cur>=N||ufoOpen)return;
  const it=ITEMS[cur];
  if(norm(inp.value)===norm(it.k)){arrive();return;}
  if(!norm(inp.value))return;
  inp.classList.remove('shake');void inp.offsetWidth;inp.classList.add('shake');
  if(mode==='d'){msg('빨간 글자부터 고쳐 보세요',true);return;}
  if(reveal.has(cur)){msg('빨간 정답을 그대로 입력하세요',true);return;}
  wrong++;
  if(wrong>=3){giveUp();return;}
  msg(`아쉬워요! 다시 도전 (${wrong}/3)`,true);
}
function giveUp(){
  if(reveal.has(cur))return;
  reveal.add(cur);missed.add(cur);
  msg('정답을 보고 그대로 입력하면 출발합니다',true);
  inp.value='';lastJ=0;paint();
}
function msg(t,no){const m=$('#tMsg');if(m){m.textContent=t;m.classList.toggle('no',!!no);}}

function arrive(){
  const it=ITEMS[cur];
  strokes+=jamo(norm(it.k)).length;
  queue.push(cur);
  cur++;wrong=0;
  /* 조합 중인 글자가 남지 않도록 포커스를 잠깐 뺐다가 비웁니다 */
  inp.blur();inp.value='';lastJ=0;inp.classList.remove('err');
  setTimeout(()=>{inp.value='';lastJ=0;if(cur<N)inp.focus();},0);
  drawPlanets();drawTop();fly();
  if(cur>=N){done=true;return;}  /* 마지막 정거장에 도킹하면 완주 창이 뜹니다 */
  drawBar();
}

/* ---------- 🛸 깜짝 퀴즈 · 항해 중 UFO가 나타나 지나온 행성을 4지선다로 물어요 ---------- */
const ALL=SRC.flatMap((z,bi)=>z.items.map(x=>({...x,bi})));
const shuf=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const pick=a=>a[Math.floor(Math.random()*a.length)];
const eun=w=>{const c=w.charCodeAt(w.length-1);return w+(c>=0xAC00&&c<=0xD7A3?((c-0xAC00)%28?'은':'는'):'은(는)');};
const top=g=>String(g||'').split(' · ')[0];
let ufoLast=0, ufoGrp=new Set(), ufoAt=new Set(), ufoDue=0, ufoOpen=false, ufoT=0, ufoN=0, ufoLog=[], ufoAsked=new Set(), ufoQ=null, ufoMap=null;
function resetUfo(){
  ufoAt=new Set();ufoDue=0;ufoLast=0;ufoOpen=false;ufoLog=[];ufoAsked=new Set();ufoGrp=new Set();ufoQ=null;
  inp.disabled=false;$('#tyUfo').classList.remove('on','out');
  if(ufoMap){ufoMap.remove();ufoMap=null;}
  /* 행성 11개쯤마다 한 번(최대 5번) · 5개 이하 구역은 없음 · 위치는 매번 조금씩 달라요 */
  const n=N<6?0:Math.max(1,Math.min(5,Math.round(N/11)));
  for(let k=1;k<=n;k++){const p=Math.round(N*k/(n+1))+Math.floor(Math.random()*3)-1;ufoAt.add(Math.max(4,Math.min(N-1,p)));}
  ufoN=ufoAt.size;
}
/* 문제 만들기 · 같은 묶음 → 같은 구역 → 나머지 순으로 헷갈리는 보기를 고릅니다 */
function others(t,need,f){
  const c=ALL.filter(x=>x.k!==t.k&&f(x)), rank=x=>t.g&&x.g===t.g?0:top(x.g)&&top(x.g)===top(t.g)?1:x.bi===t.bi?2:3;
  const seen=new Set(), out=[];
  for(const x of shuf(c).sort((a,b)=>rank(a)-rank(b))){const key=need(x);if(!key||seen.has(key))continue;seen.add(key);out.push(x);if(out.length===3)break;}
  return out;
}
function makeQ(){
  const passed=ITEMS.slice(0,cur);
  let pool=passed.filter(x=>!ufoAsked.has(x.k)); if(!pool.length)pool=passed;
  const weak=pool.filter(x=>missed.has(ITEMS.indexOf(x)));
  const t=pick(weak.length&&Math.random()<.7?weak:pool); if(!t)return null;
  ufoAsked.add(t.k);
  const kinds=['k','k','c'];
  const grp=ALL.filter(x=>x.g&&x.g===t.g), outer=ALL.filter(x=>x.bi===t.bi&&x.g&&top(x.g)!==top(t.g));
  if(grp.length>=3&&outer.length&&!ufoGrp.has(t.g))kinds.push('g','g'); /* 같은 묶음은 한 번만 물어요 */
  const kind=pick(kinds);
  if(kind==='g'){
    ufoGrp.add(t.g);
    /* 묶음과 가까이 있는(헷갈리기 쉬운) 개념 중에서 고릅니다 */
    const gi=grp.map(x=>ALL.indexOf(x)), near=x=>Math.min(...gi.map(i=>Math.abs(i-ALL.indexOf(x))));
    const ans=pick([...outer].sort((a,b)=>near(a)-near(b)).slice(0,3)), ins=shuf(grp).slice(0,3);
    const opts=shuf([...ins.map(x=>({t:x.k,x})),{t:ans.k,x:ans,ok:1}]);
    return {kind,label:'묶음 확인',q:`다음 중 <b>「${esc(t.g)}」</b>에 해당하지 <u>않는</u> 것은?`,opts,
      why:`${esc(eun(ans.k))} 「${esc(ans.g)}」에 속해요.`};
  }
  if(kind==='c'&&t.desc){
    const ds=others(t,x=>x.desc,()=>true);
    if(ds.length===3){
      const opts=shuf([{t:t.desc,x:t,ok:1},...ds.map(x=>({t:x.desc,x}))]);
      return {kind,label:'개념 → 설명',q:`<b>「${esc(t.k)}」</b>에 대한 설명으로 옳은 것은?`,opts,why:''};
    }
  }
  const ds=others(t,x=>x.k,()=>true);
  const opts=shuf([{t:t.k,x:t,ok:1},...ds.map(x=>({t:x.k,x}))]);
  return {kind:'k',label:'설명 → 개념',q:'다음 설명에 해당하는 개념은?',clue:clueOf(t),opts,why:''};
}
function openUfo(){
  if(ufoOpen)return;
  ufoQ=makeQ(); if(!ufoQ){if(done)setTimeout(finish,500);return;}
  ufoOpen=true;ufoT=Date.now();inp.blur();inp.disabled=true;
  /* 지도 위 우주선 옆으로 UFO가 날아와요 */
  ufoMap=el('g',{transform:`translate(${shipAt.x+64},${shipAt.y-58})`},world);
  ufoMap.innerHTML=`<g class="ufmap"><g class="ufbob">${UFO.replace('<g class="uf-face"></g>','<g class="uf-face">'+UFACE.happy+'</g>')}</g></g>`;
  setTimeout(showUfo,800);
}
function showUfo(){
  const q=ufoQ, k=ufoLog.length+1;
  $('#tyUfoBox').innerHTML=`
    <div class="uhead">${ufoSVG('happy','uf')}
      <div class="bub"><b>깜짝 퀴즈!</b><small>지나온 행성 복습 · ${q.label} · ${Math.min(k,ufoN)}/${ufoN}</small></div></div>
    <div class="uq">${q.q}</div>
    ${q.clue?`<div class="uclue">${esc(q.clue)}</div>`:''}
    <div class="uops ${q.kind==='c'?'long':''}">${q.opts.map((o,i)=>`<button data-i="${i}"><b>${i+1}</b><span>${esc(o.t)}</span></button>`).join('')}</div>
    <div class="ufb" id="uFb">번호를 누르거나 보기를 골라 주세요</div>
    <button class="ugo" id="uGo" hidden>계속 항해 →</button>`;
  $('#tyUfo').classList.remove('out');$('#tyUfo').classList.add('on');
  document.querySelectorAll('#tyUfoBox .uops button').forEach(b=>b.onclick=()=>answerUfo(+b.dataset.i));
  $('#uGo').onclick=closeUfo;
}
function answerUfo(i){
  const q=ufoQ; if(!q||q.done)return; q.done=true;
  const o=q.opts[i], ok=!!o.ok, a=q.opts.findIndex(x=>x.ok), ax=q.opts[a].x;
  ufoLog.push({k:ax.k,ok});
  document.querySelectorAll('#tyUfoBox .uops button').forEach((b,j)=>{b.disabled=true;
    if(j===a)b.classList.add('ok');else if(j===i)b.classList.add('no');});
  const face=m=>{const f=document.querySelector('#tyUfoBox .uf-face');if(f)f.innerHTML=UFACE[m];
    const mf=ufoMap&&ufoMap.querySelector('.uf-face');if(mf)mf.innerHTML=UFACE[m];};
  face(ok?'joy':'oops');
  const fb=$('#uFb'); fb.classList.toggle('no',!ok);
  fb.innerHTML=ok?`정답! ⭐ 보너스 별을 얻었어요 ${q.why?'<small>'+q.why+'</small>':''}`
    :`아쉬워요! 정답은 <b>${a+1}번${q.kind==='c'?'':' '+esc(ax.k)}</b><small>${q.kind==='g'?q.why
        :q.kind==='c'?`고른 설명은 「${esc(o.x.k)}」에 대한 설명이에요.`:`「${esc(o.x.k)}」 — ${esc(o.x.desc)}`}</small>`;
  const g=$('#uGo'); g.hidden=false; setTimeout(()=>g.focus(),30);
}
function closeUfo(){
  if(!ufoOpen)return;
  t0+=Date.now()-ufoT; ufoOpen=false; inp.disabled=false; ufoQ=null;
  $('#tyUfo').classList.add('out');setTimeout(()=>$('#tyUfo').classList.remove('on','out'),260);
  if(ufoMap){const m=ufoMap;m.querySelector('.ufmap').classList.add('bye');setTimeout(()=>m.remove(),700);ufoMap=null;}
  drawTop();
  if(done)setTimeout(finish,500);else setTimeout(()=>inp.focus(),60);
}
document.addEventListener('keydown',e=>{
  if(!ufoOpen||!$('#tyUfo').classList.contains('on'))return;
  if(ufoQ&&!ufoQ.done&&/^[1-4]$/.test(e.key)){e.preventDefault();answerUfo(+e.key-1);}
  else if((!ufoQ||ufoQ.done)&&(e.key==='Enter'||e.key===' ')){e.preventDefault();closeUfo();}
});

function stat(){
  const ms=t0?(ufoOpen?ufoT:Date.now())-t0:0; /* 깜짝 퀴즈 푸는 동안은 운항 시간이 멈춰요 */
  return {ms,cpm:ms>3000?Math.round(strokes/(ms/60000)):0,acc:typed?Math.max(0,Math.round((typed-err)/typed*100)):100};
}
function tick(){
  if(!t0)return;
  const s=stat();
  $('#tTm').textContent=mmssc(s.ms);
  $('#tCpm').textContent=s.cpm;
  const r=Math.min(1,s.cpm/600);
  $('#gArc').style.strokeDashoffset=57*(1-r);
  const a=Math.PI*(1-r);$('#gNd').setAttribute('x2',23+13*Math.cos(a));$('#gNd').setAttribute('y2',24-13*Math.sin(a));
  if(mode==='d')$('#tAcc').innerHTML=`정확도<b>${s.acc}%</b>`;
  if(!done)requestAnimationFrame(tick);
}

function finish(){
  const s=stat(), key=RKEY(mode), best=rd(key), miss=missed.size;
  const rec={t:s.ms,cpm:s.cpm,acc:s.acc,miss,at:Date.now()};
  const better=!best||(mode==='d'?s.ms<best.t:(miss<best.miss||miss===best.miss&&s.ms<best.t));
  if(better)wr(key,rec);
  const next=LESSONS.filter(l=>l.ready&&l.n>LN)[0];
  const ms=[...missed].map(i=>ITEMS[i].k);
  $('#tyFinBox').innerHTML=`
    <div class="em">${mode==='d'?'🚀':'🔭'}</div>
    <h2>${mode==='d'?'항해 완주!':'탐사 완료!'}</h2>
    <div style="font-size:.86rem;font-weight:600">${PAD(LN)}강 ${esc(LESSON.title)} · 행성 ${N}개</div>
    <div class="row">
      <div>운항 시간<b>${mmss(s.ms)}</b></div>
      <div>타수<b>${s.cpm}</b>타/분</div>
      ${mode==='d'?`<div>정확도<b>${s.acc}%</b></div>`:`<div>맞힘<b>${N-miss}/${N}</b></div>`}
    </div>
    <div class="nb2">${better?(best?'🎉 최고 기록을 새로 세웠어요!':'🎉 첫 기록이 저장되었어요!'):`최고 기록 ${mode==='d'?mmss(best.t):(N-best.miss)+'/'+N}`}</div>
    ${mode==='q'&&ms.length?`<div class="ms"><b>다시 볼 행성 ${ms.length}개</b> — ${ms.map(esc).join(' · ')}</div>`:''}
    ${ufoLog.length?`<div class="uqr">🛸 깜짝 퀴즈 <b>${ufoLog.filter(x=>x.ok).length}/${ufoLog.length}</b> 맞힘${ufoLog.some(x=>!x.ok)?` — 다시 볼 개념: ${ufoLog.filter(x=>!x.ok).map(x=>esc(x.k)).join(' · ')}`:' ⭐'}</div>`:''}
    ${mode==='q'&&hint.size?`<div style="font-size:.78rem;color:var(--muted);margin-top:6px">초성 힌트 ${hint.size}번 사용</div>`:''}
    <div class="acts">
      <button class="pri" id="fAgain">↺ 다시 출발</button>
      <button id="fMap">⤢ 지나온 궤도 보기</button>
      ${mode==='d'?'<button id="fQ">🔭 탐사 모드</button>':'<button id="fD">🚀 주행 모드</button>'}
      <a href="lesson${PAD(LN)}.html">🗺 마인드맵</a>
      ${next?`<a href="typing.html?l=${PAD(next.n)}${mode==='q'?'&m=q':''}">${PAD(next.n)}강 →</a>`:''}
    </div>`;
  $('#tyFin').classList.add('on');
  $('#fAgain').onclick=start;
  $('#fMap').onclick=()=>{$('#tyFin').classList.remove('on');setOverview(true);};
  const fq=$('#fQ'),fd=$('#fD');
  if(fq)fq.onclick=()=>{mode='q';start();};
  if(fd)fd.onclick=()=>{mode='d';start();};
}

start();
})();
