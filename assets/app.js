function $id(i){return document.getElementById(i);}
const $=$id;
/* ============================================================
   은또링쌤의 행성 지도 · ATLAS
   마인드맵 개념 매칭 엔진 — 모든 강이 이 파일 하나를 공유합니다.
   필요한 전역: LESSON / DATA / PITS / GICHUL / YEARS / FREQ / CNOTE
   ============================================================ */
buildNav(LESSON.no);
document.title = PAD(LESSON.no)+'강 '+LESSON.title+' · 은또링쌤의 행성 지도';
$id('hLv').textContent   = PAD(LESSON.no)+'강 · 개념 매칭';
$id('hTitle').textContent= LESSON.title;
$id('hSub').textContent  = LESSON.sub;
$id('coreT').innerHTML   = twoLine(LESSON.title);
function twoLine(t){
  const w=t.split(' ');if(w.length<3)return t;
  let best=1,gap=1e9;
  for(let i=1;i<w.length;i++){
    const a=w.slice(0,i).join(' ').length,b=w.slice(i).join(' ').length;
    if(Math.abs(a-b)<gap){gap=Math.abs(a-b);best=i;}
  }
  return w.slice(0,best).join(' ')+'<br>'+w.slice(best).join(' ');
}
$id('fqT').innerHTML     = PAD(LESSON.no)+'강 <b>출제 빈도</b>';

/* ================= build ================= */
const Q=[{c:'c1',pos:'nw'},{c:'c2',pos:'ne'},{c:'c3',pos:'sw'},{c:'c4',pos:'se'}];
const ALL=[];DATA.forEach((g,bi)=>g.items.forEach((it,li)=>{it._bi=bi;it._li=li;ALL.push(it);}));
const TOTAL=ALL.length;

const map=$('map'),svg=$('links'),toksEl=$('toks'),det=$('detail'),core=$('core');
function el(t,c,h){const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e;}

const quads=DATA.map((g,bi)=>{
  const q=el('div','quad '+Q[bi].pos+' '+Q[bi].c);q.dataset.b=bi;
  const pill=el('div','pill',`<span>${g.b}</span><span class="cnt">0 / ${g.items.length}</span>`);
  const bub=el('div','bubbles');
  q.appendChild(pill);q.appendChild(bub);
  q._pill=pill;q._bub=bub;q._cnt=pill.querySelector('.cnt');q._n=g.items.length;
  pill.addEventListener('click',()=>tryDrop(bi));
  q.addEventListener('dragover',e=>{if(sel){e.preventDefault();q.classList.add('armed');}});
  q.addEventListener('dragleave',()=>q.classList.remove('armed'));
  q.addEventListener('drop',e=>{e.preventDefault();q.classList.remove('armed');tryDrop(bi);});
  map.appendChild(q);return q;
});

let sel=null, placed=0, okN=0, noN=0;
const wrongs=new Map();
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]];}return a;}

function buildPool(){
  toksEl.innerHTML='';sel=null;
  const rest=ALL.filter(it=>!it._done);
  if(!rest.length)toksEl.appendChild(el('div','done','모든 개념을 소단원에 붙였습니다. 아래 함정 8가지와 출제 빈도로 넘어가세요.'));
  shuffle(rest.slice()).forEach(it=>{
    const t=el('button','tok',it.k);t.draggable=true;it._tok=t;
    t.addEventListener('click',()=>{
      if(sel===it){sel=null;t.classList.remove('sel');quads.forEach(q=>q.classList.remove('armed'));return;}
      toksEl.querySelectorAll('.tok').forEach(x=>x.classList.remove('sel'));
      sel=it;t.classList.add('sel');quads.forEach(q=>q.classList.add('armed'));
    });
    t.addEventListener('dragstart',e=>{sel=it;t.classList.add('drag');
      toksEl.querySelectorAll('.tok').forEach(x=>x.classList.remove('sel'));t.classList.add('sel');
      e.dataTransfer.setData('text/plain','x');e.dataTransfer.effectAllowed='move';});
    t.addEventListener('dragend',()=>{t.classList.remove('drag');quads.forEach(q=>q.classList.remove('armed'));});
    toksEl.appendChild(t);
  });
  $('pLeft').textContent=rest.length;
  requestAnimationFrame(draw);
}

function tryDrop(bi){
  if(!sel){toast('먼저 보기에서 개념을 하나 고르세요.');return;}
  const it=sel,q=quads[bi];
  quads.forEach(x=>x.classList.remove('armed'));
  if(it._bi===bi){
    it._done=true;okN++;placed++;
    q.classList.add('hit');setTimeout(()=>q.classList.remove('hit'),520);
    addBubble(bi,it);sel=null;buildPool();openDetail(it);
    toast('정답! '+DATA[bi].b+' 소속입니다.','ok');
  }else{
    noN++;wrongs.set(it.k,it);
    q.classList.add('miss');it._tok.classList.add('wrong');
    setTimeout(()=>{q.classList.remove('miss');it._tok.classList.remove('wrong');},480);
    toast('아쉽네요. 다른 소단원입니다.','no');
  }
  update();
}

function addBubble(bi,it){
  const q=quads[bi];
  const b=el('div','bub',`<span class="ck">✓</span><span>${it.k}</span>${it.hot?'<span class="hot">기출</span>':''}`);
  b.dataset.li=it._li;b.addEventListener('click',()=>openDetail(it));
  it._bub=b;
  const after=[...q._bub.children].find(x=>+x.dataset.li>it._li);
  if(after)q._bub.insertBefore(b,after);else q._bub.appendChild(b);
  q._cnt.textContent=q._bub.children.length+' / '+q._n;
  requestAnimationFrame(()=>{draw();if(curIt)place(curIt);setTimeout(()=>{draw();if(curIt)place(curIt);},340);});
}

/* ================= 상세 말풍선 ================= */
let curIt=null;
function openDetail(it){
  document.querySelectorAll('.bub').forEach(b=>b.classList.remove('cur'));
  if(it._bub)it._bub.classList.add('cur');
  curIt=it;
  const dots=[1,2,3].map(n=>`<i class="${n<=it.s?'on':''}"></i>`).join('');
  det.innerHTML=`<button class="xc" aria-label="닫기">✕</button>
    <div class="dh"><h3>${it.k}</h3><span class="dots" title="출제 중요도">${dots}</span>
      ${it.hot?'<span class="tag">기출 단골</span>':''}
      ${(GIBY[it.k]||[]).length?`<span class="tag2">📝 선지 ${GIBY[it.k].length}문항</span>`:''}</div>
    <div class="path">${PAD(LESSON.no)}강 › ${DATA[it._bi].b}</div>${it.d}${gichulHTML(it.k)}`;
  det.querySelector('.xc').onclick=e=>{e.stopPropagation();closeDetail();};
  det.classList.add('show');
  requestAnimationFrame(()=>place(it));
}
function closeDetail(){det.classList.remove('show');det.innerHTML='';curIt=null;
  document.querySelectorAll('.bub').forEach(b=>b.classList.remove('cur'));}
function place(it){
  const a=it._bub;
  if(innerWidth<=1000||!a){det.classList.add('inline');det.style.cssText='';
    det.classList.add('show');det.scrollIntoView({behavior:'smooth',block:'nearest'});return;}
  det.classList.remove('inline');
  const mw=map.getBoundingClientRect(),r=a.getBoundingClientRect();
  const W=Math.min(420,Math.round(mw.width*0.42));
  det.style.width=W+'px';det.style.maxHeight=Math.round(mw.height-14)+'px';
  const ax=r.left-mw.left,ar=r.right-mw.left;
  let L=((ax+r.width/2)<mw.width/2)?ar+16:ax-16-W;
  L=Math.max(6,Math.min(L,mw.width-W-6));
  const h=det.offsetHeight;
  let T=(r.top-mw.top)+r.height/2-h/2;
  T=Math.max(6,Math.min(T,mw.height-h-6));
  det.style.left=L+'px';det.style.top=T+'px';
}
document.addEventListener('click',e=>{
  if(!curIt||innerWidth<=1000)return;
  if(det.contains(e.target)||e.target.closest('.bub')||e.target.closest('.pill')||e.target.closest('.tok')||e.target.closest('#wlist span'))return;
  closeDetail();
});

/* ================= 연결선 ================= */
const NS='http://www.w3.org/2000/svg';
const COL=['#8FC9A3','#F0A2AC','#C9D26E','#9BC4DC'];
function defs(){
  const d=document.createElementNS(NS,'defs');
  ([['aC','#EE8C93']].concat(COL.map((c,i)=>['a'+i,c]))).forEach(([id,col])=>{
    const m=document.createElementNS(NS,'marker');
    m.setAttribute('id',id);m.setAttribute('viewBox','0 0 10 10');m.setAttribute('refX','8');
    m.setAttribute('refY','5');m.setAttribute('markerWidth','5');m.setAttribute('markerHeight','5');
    m.setAttribute('orient','auto-start-reverse');
    const p=document.createElementNS(NS,'path');
    p.setAttribute('d','M0,1 L9,5 L0,9 z');p.setAttribute('fill',col);
    m.appendChild(p);d.appendChild(m);});
  svg.appendChild(d);
}
function curve(x1,y1,x2,y2,col,mk,w,dash){
  const mx=(x1+x2)/2,my=(y1+y2)/2,dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy)||1;
  const off=Math.min(46,len*0.22);
  const p=document.createElementNS(NS,'path');
  p.setAttribute('d',`M${x1},${y1} Q${mx-dy/len*off},${my+dx/len*off} ${x2},${y2}`);
  p.setAttribute('fill','none');p.setAttribute('stroke',col);p.setAttribute('stroke-width',w);
  p.setAttribute('stroke-dasharray',dash);p.setAttribute('stroke-linecap','round');
  p.setAttribute('marker-end',`url(#${mk})`);
  svg.appendChild(p);
}
function draw(){
  svg.innerHTML='';
  const mb=map.getBoundingClientRect();
  svg.setAttribute('viewBox',`0 0 ${mb.width} ${mb.height}`);
  svg.setAttribute('width',mb.width);svg.setAttribute('height',mb.height);
  if(innerWidth<=1000)return;
  defs();
  const R=e=>{const r=e.getBoundingClientRect();
    return{l:r.left-mb.left,r:r.right-mb.left,t:r.top-mb.top,b:r.bottom-mb.top,
           cx:r.left-mb.left+r.width/2,cy:r.top-mb.top+r.height/2};};
  const C=R(core.querySelector('.disc'));
  quads.forEach((q,bi)=>{
    const left=Q[bi].pos[1]==='w',P=R(q._pill);
    const sx=left?C.l+14:C.r-14, sy=Q[bi].pos[0]==='n'?C.t+32:C.b-32;
    curve(sx,sy,left?P.r+9:P.l-9,P.cy,'#EE8C93','aC',2.4,'8 7');
    const AX=left?P.l+20:P.r-20, AY=P.b+3;
    let ax=AX,ay=AY,pcx=null;
    [...q._bub.children].forEach(bEl=>{
      const B=R(bEl);
      if(pcx!==null&&Math.abs(B.cx-pcx)>26){ax=AX;ay=AY;}
      curve(ax,ay,left?B.r+6:B.l-6,B.cy,COL[bi],'a'+bi,1.6,'5 5');
      ax=left?B.l+18:B.r-18;ay=B.b+2;pcx=B.cx;
    });
  });
}
addEventListener('resize',()=>{draw();if(curIt)place(curIt);});
if(window.ResizeObserver)new ResizeObserver(draw).observe(map);

/* ================= 상태 ================= */
DATA.forEach((g,bi)=>{
  const r=el('div','prow',`<div class="pl">${g.b}</div>
    <div class="pt"><div class="pf"></div></div>
    <div class="pn">0 / ${g.items.length}</div>`);
  r.dataset.c=bi;$('prog4').appendChild(r);
});
function saveProgress(){
  try{localStorage.setItem(LKEY(LESSON.no),JSON.stringify({ok:okN,total:TOTAL,at:Date.now()}));}catch(e){}
}
function update(){
  $('sDone').textContent=placed;$('sOk').textContent=okN;$('sNo').textContent=noN;
  [...$('prog4').children].forEach((r,bi)=>{
    const n=quads[bi]._bub.children.length,t=quads[bi]._n;
    r.querySelector('.pf').style.width=(n/t*100)+'%';
    r.querySelector('.pn').textContent=n+' / '+t;
    r.classList.toggle('done',n===t);
  });
  $('rOk').textContent=okN;$('rNo').textContent=noN;
  const tr=okN+noN;$('rRate').textContent=tr?Math.round(okN/tr*100)+'%':'-';
  const wl=$('wlist');wl.innerHTML='';
  if(!wrongs.size)wl.appendChild(el('span','none',placed===TOTAL
    ?'한 번도 틀리지 않고 완성했습니다.':'아직 틀린 개념이 없습니다.'));
  else [...wrongs.values()].forEach(it=>{
    const s=el('span',null,it.k);
    s.onclick=()=>{map.scrollIntoView({behavior:'smooth',block:'center'});
      setTimeout(()=>openDetail(it),260);};
    wl.appendChild(s);});
  saveProgress();
}
function toast(m,k){const t=$('toast');t.className='toast show'+(k?' '+k:'');t.textContent=m;
  clearTimeout(t._i);t._i=setTimeout(()=>t.className='toast',1700);}

/* ================= 함정 ================= */
PITS.forEach((p,i)=>{
  $('pits').appendChild(el('details','pit',
   `<summary><span class="n">${i+1}</span><span>${p.q}</span><span class="pm">＋</span></summary>
    <div class="pb"><div class="vs"><div><div class="t">${p.vs[0][0]}</div>${p.vs[0][1]}</div>
    <div><div class="t">${p.vs[1][0]}</div>${p.vs[1][1]}</div></div>
    <div class="ans">${p.a.trimStart().startsWith('<table')?'':'<b>정리 ·</b> '}${p.a}</div></div>`));
});

/* ================= 개념별 기출 선지 인덱스 ================= */
const GIBY={};
GICHUL.forEach(g=>g.qs.forEach(q=>{
  (GIBY[q.link]=GIBY[q.link]||[]).push(Object.assign({y:g.y,e:g.e},q));
  (q.more||[]).forEach(k=>{
    (GIBY[k]=GIBY[k]||[]).push(Object.assign({y:g.y,e:g.e,sub:1},q));
  });
}));
function gichulHTML(name){
  const list=GIBY[name];
  if(!list||!list.length)return '';
  let h=`<div class="gwrap"><div class="ghd">📝 이 개념의 기출 선지 <span>${list.length}문항</span></div>`;
  list.forEach(q=>{
    h+=`<div class="gq"><div class="gqh"><span class="gy">${q.y} ${q.e}</span>
      <span class="gn">${q.n}번</span>${q.pt?`<span class="gp">${q.pt}</span>`:''}
      ${q.sub?'<span class="gsub">선지 일부</span>':''}
      <span class="ga">정답 ${q.a}</span></div>
      <div class="gs">${q.stem}</div>`;
    q.ch.forEach(([lb,ox,tx,why])=>{
      const cls=ox==='o'?'o':ox==='x'?'x':'n';
      const mk=ox==='o'?'✅':ox==='x'?'❌':'ℹ️';
      h+=`<div class="gop ${cls}"><span class="mk">${mk}</span>
        <span class="lb">${lb==='-'?'':lb}</span>
        <span class="tx">${tx}${why?`<span class="why">${why}</span>`:''}</span></div>`;
    });
    h+=`</div>`;
  });
  return h+`<div class="gfoot">2022~2027학년도 22회차 기준 · 선지는 요지로 줄였습니다</div></div>`;
}

/* ================= 출제 그래프 ================= */
const MAXY=(typeof YMAX!=='undefined'&&YMAX)?YMAX:10;   /* 강별 데이터에서 YMAX로 세로축 최댓값을 덮어쓸 수 있음 */
YEARS.forEach(d=>{
  const col=el('div','barcol'+(d.n>=8?' hi':''));
  const tip=d.su===null?`${d.y}학년도 · 6월·9월 모평까지 ${d.n}문항`
    :`${d.y}학년도 전체 ${d.n}문항 · 그중 수능 ${d.su}문항`;
  col.innerHTML=`<div class="tip">${tip}</div>
    <div class="gbar"><span class="v">${d.n}</span><span class="yr">${d.y}</span></div>
    <div class="cap">${d.su===null?'9월까지':'수능 '+d.su+'문항'}</div>`;
  col._h=Math.max(d.n/MAXY*100,14)+'%';   /* 값이 작아도 연도 글자가 보이도록 최소 높이 확보 */$('bars').appendChild(col);
});
const FMAX=Math.max(...FREQ.map(x=>x[1]))||1;
FREQ.forEach(([k,v])=>{
  const r=el('div','frow'+(v?'':' zero'),
    v?`<div class="fl">${k}</div><div class="ft"><div class="fb">${v}회</div></div>`
     :`<div class="fl">${k}</div><div class="ft"><span class="zt">0회 · 한 번도 출제되지 않음</span></div>`);
  r._w=(v/FMAX*100)+'%';$('freq').appendChild(r);
});
$('cnote').innerHTML=CNOTE;
function animateCharts(){
  document.querySelectorAll('.barcol').forEach(c=>c.querySelector('.gbar').style.height=c._h);
  document.querySelectorAll('.frow').forEach(r=>{const f=r.querySelector('.fb');if(f)f.style.width=r._w;});
}
if(window.IntersectionObserver){
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){animateCharts();io.disconnect();}}),{threshold:.25});
  io.observe(document.querySelector('.chartbox'));
}else setTimeout(animateCharts,600);

/* ================= 조작 ================= */
$('sTotal').textContent=TOTAL;
$('bShuffle').onclick=()=>{buildPool();toast('보기를 섞었습니다.');};
$('bReveal').onclick=()=>{
  ALL.forEach(it=>{if(!it._done){it._done=true;placed++;addBubble(it._bi,it);}});
  buildPool();update();toast('정답 배치를 모두 표시했습니다.');};
$('bBig').onclick=()=>{
  const big=document.documentElement.style.getPropertyValue('--fs')==='19px';
  document.documentElement.style.setProperty('--fs',big?'16px':'19px');
  $('bBig').classList.toggle('on',!big);$('bBig').textContent=big?'큰 글씨':'보통 글씨';
  setTimeout(()=>{draw();if(curIt)place(curIt);},90);};
$('bReset').onclick=()=>{
  ALL.forEach(it=>{delete it._done;delete it._bub;});
  quads.forEach(q=>{q._bub.innerHTML='';q._cnt.textContent='0 / '+q._n;});
  placed=okN=noN=0;wrongs.clear();closeDetail();
  document.querySelectorAll('.pit').forEach(d=>d.open=false);
  buildPool();update();scrollTo({top:0,behavior:'smooth'});toast('처음으로 되돌렸습니다.');};
addEventListener('keydown',e=>{
  if(/input|textarea/i.test(e.target.tagName))return;
  if(e.code==='Escape'){closeDetail();sel=null;
    toksEl.querySelectorAll('.tok').forEach(x=>x.classList.remove('sel'));
    quads.forEach(q=>q.classList.remove('armed'));}});
buildPool();update();draw();setTimeout(draw,400);
