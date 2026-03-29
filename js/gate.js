// =============================================
// EaseAlgo — js/gate.js
// =============================================
// All GATE page logic.
//
// GATE_SUBJS — list of all 30 GATE subjects
// showGateSection(sec) — switch between 'pyq' and 'practice'
// showPYQTab(tab) — switch between 'year','subject','topic'
// setGateStream(s, el) — filter by stream CS/ECE/ME/CE/GA
// renderGatePYQ() — main render dispatcher
// renderGateYearTab(el, qs) — renders year grid + Q list
// renderGateSubjectTab(el, qs) — subject accordion with Qs
// renderGateTopicTab(el, qs) — subject → topics → MCQ cards
// startGateYearQuiz(y) — start quiz for a year
// startGateSubjPYQ(sub) — start quiz for a subject
// startGateTopicPYQ(top) — start quiz for a topic (called on topic click)
// renderGate() — renders practice sets (subject grid)
// =============================================
// ══════════════════════════════════════════
// GATE PAGE
// ══════════════════════════════════════════
const GATE_SUBJS = [
  {id:'ds',      name:'Data Structures',         emoji:'🌲', color:'#6366f1', stream:'CS/IT', cnt:30},
  {id:'algo',    name:'Algorithms',              emoji:'⚙️', color:'#8b5cf6', stream:'CS/IT', cnt:33},
  {id:'os',      name:'Operating Systems',       emoji:'💻', color:'#3b82f6', stream:'CS/IT', cnt:29},
  {id:'dbms',    name:'DBMS',                    emoji:'🗄️', color:'#06b6d4', stream:'CS/IT', cnt:25},
  {id:'cn',      name:'Computer Networks',       emoji:'🌐', color:'#10b981', stream:'CS/IT', cnt:26},
  {id:'toc',     name:'Theory of Computation',   emoji:'🔵', color:'#f59e0b', stream:'CS/IT', cnt:24},
  {id:'co',      name:'Computer Organization',   emoji:'🖥️', color:'#ef4444', stream:'CS/IT', cnt:19},
  {id:'dm',      name:'Discrete Mathematics',    emoji:'∑',  color:'#ec4899', stream:'CS/IT', cnt:12},
  {id:'compiler',name:'Compiler Design',         emoji:'📝', color:'#f97316', stream:'CS/IT', cnt:9},
  {id:'se',      name:'Software Engineering',    emoji:'🔧', color:'#6366f1', stream:'CS/IT', cnt:4},
  {id:'prog',    name:'Programming (C/C++)',      emoji:'</>',color:'#8b5cf6', stream:'CS/IT', cnt:5},
  {id:'dl',      name:'Digital Logic',           emoji:'💡', color:'#f43f5e', stream:'CS/IT', cnt:5},
  {id:'signals', name:'Signals & Systems',       emoji:'〰️', color:'#f59e0b', stream:'ECE',   cnt:9},
  {id:'edc',     name:'Electronic Devices',      emoji:'⚡', color:'#ef4444', stream:'ECE',   cnt:5},
  {id:'control', name:'Control Systems',         emoji:'🎛️', color:'#10b981', stream:'ECE',   cnt:1},
  {id:'ade',     name:'Analog/Digital Circuits', emoji:'🔌', color:'#06b6d4', stream:'ECE',   cnt:8},
  {id:'emf',     name:'Electromagnetics',        emoji:'🧲', color:'#f97316', stream:'ECE',   cnt:6},
  {id:'comm',    name:'Communications',          emoji:'📡', color:'#3b82f6', stream:'ECE',   cnt:8},
  {id:'thermo',  name:'Thermodynamics',          emoji:'🔥', color:'#ef4444', stream:'ME',    cnt:8},
  {id:'fm',      name:'Fluid Mechanics',         emoji:'💧', color:'#3b82f6', stream:'ME',    cnt:8},
  {id:'som',     name:'Strength of Materials',   emoji:'🏗️', color:'#6366f1', stream:'ME',    cnt:8},
  {id:'tom',     name:'Theory of Machines',      emoji:'⚙️', color:'#f59e0b', stream:'ME',    cnt:8},
  {id:'mfg',     name:'Manufacturing',           emoji:'🏭', color:'#10b981', stream:'ME',    cnt:8},
  {id:'ht',      name:'Heat Transfer',           emoji:'♨️', color:'#f97316', stream:'ME',    cnt:8},
  {id:'struct',  name:'Structural Analysis',     emoji:'🏛️', color:'#6366f1', stream:'CE',    cnt:8},
  {id:'geotech', name:'Geotechnical Engg',       emoji:'⛏️', color:'#f59e0b', stream:'CE',    cnt:8},
  {id:'concrete',name:'Concrete Technology',     emoji:'🧱', color:'#94a3b8', stream:'CE',    cnt:8},
  {id:'enveng',  name:'Environmental Engg',      emoji:'🌿', color:'#10b981', stream:'CE',    cnt:8},
  {id:'surveying',name:'Surveying',              emoji:'📐', color:'#06b6d4', stream:'CE',    cnt:8},
  {id:'quant',   name:'Quantitative Aptitude',   emoji:'🔢', color:'#f59e0b', stream:'GA',    cnt:14},
  {id:'lr',      name:'Logical Reasoning',       emoji:'🧩', color:'#ec4899', stream:'GA',    cnt:10},
  {id:'verbal',  name:'Verbal Ability',          emoji:'📖', color:'#10b981', stream:'GA',    cnt:8},
];

// ══════════════════════════════════════════
// GATE PAGE — sub-nav system
// ══════════════════════════════════════════
let gateStream = 'cs';
let gatePYQTab = 'year'; // 'year' | 'subject' | 'topic'

function setGateHero(title, sub, breadcrumbLabel){
  const t=document.getElementById('gate-hero-title');
  const s=document.getElementById('gate-hero-sub');
  const sep=document.getElementById('gate-breadcrumb-sep');
  const lbl=document.getElementById('gate-breadcrumb-label');
  const parent=document.getElementById('gate-breadcrumb-parent');
  if(t)t.textContent=title;
  if(s)s.textContent=sub;
  if(breadcrumbLabel){
    if(sep)sep.style.display='';
    if(lbl){lbl.style.display='';lbl.textContent=breadcrumbLabel;}
    if(parent)parent.style.color='var(--text2)';
  } else {
    if(sep)sep.style.display='none';
    if(lbl){lbl.style.display='none';lbl.textContent='';}
    if(parent)parent.style.color='var(--indigo)';
  }
}

function showGateHome(){
  const home = document.getElementById('gate-home');
  if(home) home.style.display='flex';
  const strip = document.getElementById('gate-stats-strip');
  if(strip) strip.style.display='flex';
  document.getElementById('gate-sec-pyq').style.display='none';
  document.getElementById('gate-sec-practice').style.display='none';
  const hs = document.getElementById('gate-hero-section');
  if(hs){ hs.style.minHeight='calc(100vh - var(--nav-h))'; hs.style.alignItems=''; }
  setGateHero('📐 GATE Preparation Hub',
    'Your complete GATE 2026 companion — real PYQs with solutions, subject-wise practice sets, topic drills, and mock tests with official scoring.',
    null);
  window.scrollTo({top:0,behavior:'smooth'});
}

function showGateSection(sec, tab){
  const home = document.getElementById('gate-home');
  if(home) home.style.display='none';
  const strip = document.getElementById('gate-stats-strip');
  if(strip) strip.style.display='none';
  document.getElementById('gate-sec-pyq').style.display   = sec==='pyq'      ? 'block' : 'none';
  document.getElementById('gate-sec-practice').style.display = sec==='practice' ? 'block' : 'none';
  const hs = document.getElementById('gate-hero-section');
  if(hs){ hs.style.minHeight='auto'; hs.style.alignItems='flex-start'; }
  if(sec==='pyq'){
    setGateHero('📅 GATE PYQ',
      'Solve real GATE previous year questions — filter by year, subject or topic. Official −⅓ negative marking.',
      'GATE PYQ');
    showPYQTab(tab || 'year');
  }
  if(sec==='practice'){
    setGateHero('📚 GATE Practice Sets',
      'Subject-wise curated practice questions — choose a subject, start drilling, and get instant feedback with explanations.',
      'Practice Sets');
    renderGate();
  }
  window.scrollTo({top:0,behavior:'smooth'});
}

function showPYQTab(tab){
  gatePYQTab=tab;
  const cfg = {
    year:    {border:'var(--pink)',   bg:'rgba(236,72,153,0.1)',  color:'var(--pink)'},
    subject: {border:'var(--indigo)', bg:'rgba(99,102,241,0.1)',  color:'var(--indigo)'},
    topic:   {border:'var(--cyan)',   bg:'rgba(6,182,212,0.1)',   color:'var(--cyan)'},
  };
  ['year','subject','topic'].forEach(t=>{
    const b=document.getElementById('pst-'+t);
    if(!b)return;
    const svg=b.querySelector('svg');
    const span=b.querySelectorAll('span')[0];
    if(t===tab){
      b.style.borderColor=cfg[t].border;
      b.style.background=cfg[t].bg;
      b.style.boxShadow='none';
      if(svg)svg.style.color=cfg[t].color;
      if(span){span.style.color=cfg[t].color;span.style.fontWeight='700';}
    } else {
      b.style.borderColor='var(--border)';
      b.style.background='var(--card)';
      b.style.boxShadow='none';
      if(svg)svg.style.color='var(--text2)';
      if(span){span.style.color='var(--text2)';span.style.fontWeight='600';}
    }
  });
  renderGatePYQ();
}

function setGateStream(s, el){
  gateStream=s;
  document.querySelectorAll('.gpill').forEach(b=>b.classList.remove('on'));
  el.classList.add('on');
  renderGatePYQ();
}

function getGatePYQFiltered(){
  return PYQ.filter(q=>q.st===gateStream);
}

function renderGatePYQ(){
  const el=document.getElementById('gate-pyq-content');if(!el)return;
  const qs=getGatePYQFiltered();
  // update count badge + button
  const cnt=document.getElementById('gate-pyq-count');
  const btn=document.getElementById('gate-start-btn');
  if(cnt)cnt.textContent=`${qs.length} Q`;
  if(btn){btn.disabled=qs.length===0;btn.style.opacity=qs.length>0?'1':'0.5';}

  if(gatePYQTab==='year') renderGateYearTab(el,qs);
  else if(gatePYQTab==='subject') renderGateSubjectTab(el,qs);
  else renderGateTopicTab(el,qs);
}

function renderGateYearTab(el, qs){
  const years=[...new Set(qs.map(q=>q.y))].sort((a,b)=>b-a);
  el.innerHTML = `
    <div style="width:100%;padding:1.75rem 1.5rem 2.5rem;">
      <div style="margin-bottom:1.25rem;display:flex;align-items:center;gap:0.75rem;">
        <div style="width:3px;height:20px;background:linear-gradient(135deg,var(--pink),var(--rose));border-radius:2px;"></div>
        <div style="font-family:'Inter',sans-serif;font-weight:700;font-size:1rem;color:var(--text);">Select a year — click to start full paper quiz</div>
        <span style="font-family:'JetBrains Mono',monospace;font-size:0.65rem;color:var(--text3);margin-left:auto;">${years.length} papers</span>
      </div>
      <div class="gate-year-grid">
        ${years.map(y=>{
          const yqs=qs.filter(q=>q.y===y);
          const e=yqs.filter(q=>q.d==='easy').length;
          const m=yqs.filter(q=>q.d==='medium').length;
          const h=yqs.filter(q=>q.d==='hard').length;
          return `<div class="gyc" onclick="startGateYearQuiz(${y})">
            <div class="gyc-y">GATE ${y}</div>
            <div class="gyc-c">${yqs.length} Questions</div>
            <div style="display:flex;gap:4px;justify-content:center;margin-top:10px;flex-wrap:wrap;">
              <span style="font-size:0.7rem;padding:2px 7px;border-radius:5px;background:rgba(16,185,129,0.1);color:var(--green);">${e}E</span>
              <span style="font-size:0.7rem;padding:2px 7px;border-radius:5px;background:rgba(245,158,11,0.1);color:var(--amber);">${m}M</span>
              <span style="font-size:0.7rem;padding:2px 7px;border-radius:5px;background:rgba(239,68,68,0.1);color:var(--red);">${h}H</span>
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>`;
}

function renderGateSubjectTab(el, qs){
  const subjects=[...new Set(qs.map(q=>q.sub))].sort();
  el.innerHTML=`<div class="gate-subj-acc">
    ${subjects.map(sub=>{
      const sqs=qs.filter(q=>q.sub===sub);
      const safe=sub.replace(/\//g,'_').replace(/[^a-zA-Z0-9_]/g,'');
      return `<div class="gsa-card">
        <div class="gsa-head" onclick="toggleGSA('${safe}')">
          <span style="font-size:1.1rem;">${getSubjEmoji(sub)}</span>
          <span class="gsa-name">${sub}</span>
          <span class="gsa-cnt">${sqs.length} PYQs</span>
          <button onclick="event.stopPropagation();startGateSubjPYQ('${sub}')"
            style="padding:4px 12px;background:var(--indigo);color:#fff;border:none;border-radius:6px;font-size:0.7rem;font-weight:700;cursor:pointer;margin-right:0.5rem;">Practice →</button>
          <span style="color:var(--text3);font-size:0.7rem;" id="chev-${safe}">▼</span>
        </div>
        <div class="gsa-body" id="gsa-${safe}">
          ${buildGatePQRows(sqs)}
        </div>
      </div>`;
    }).join('')}
  </div>`;
}

function renderGateTopicTab(el, qs){
  // Group by subject first, then topics under each subject
  const subjects=[...new Set(qs.map(q=>q.sub))].sort();
  el.innerHTML=`<div class="gate-topic-list">
    ${subjects.map(sub=>{
      const sqs=qs.filter(q=>q.sub===sub);
      const topics=[...new Set(sqs.map(q=>q.top))].sort();
      const safeId=sub.replace(/[^a-zA-Z0-9]/g,'_');
      return `<div class="gtc" style="border-color:var(--border2);">
        <!-- Subject header — always visible, click to expand/collapse -->
        <div class="gtc-head" onclick="toggleGTC('${safeId}')" style="background:var(--card2);">
          <span style="font-size:1.15rem;">${getSubjEmoji(sub)}</span>
          <span class="gtc-name" style="font-size:0.92rem;">${sub}</span>
          <span class="gtc-cnt" style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.18);color:var(--indigo);padding:2px 8px;border-radius:5px;">${topics.length} topics · ${sqs.length} Q</span>
          <span style="color:var(--text3);font-size:0.7rem;margin-left:0.5rem;" id="gtchev-${safeId}">▼</span>
        </div>
        <!-- Topics grid — shown on expand -->
        <div class="gtc-body open" id="gtc-${safeId}" style="padding:0.85rem 1.1rem;">
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(195px,1fr));gap:0.5rem;">
            ${topics.map(top=>{
              const tqs=sqs.filter(q=>q.top===top);
              const safeTopic=top.replace(/[^a-zA-Z0-9]/g,'_');
              const diffCounts={easy:tqs.filter(q=>q.d==='easy').length,medium:tqs.filter(q=>q.d==='medium').length,hard:tqs.filter(q=>q.d==='hard').length};
              return `<div onclick="startGateTopicPYQ('${top.replace(/'/g,"\\'")}')"
                style="background:var(--bg2);border:1.5px solid var(--border);border-radius:10px;
                  padding:0.75rem 0.9rem;cursor:pointer;transition:all 0.18s;
                  display:flex;flex-direction:column;gap:0.35rem;"
                onmouseover="this.style.borderColor='var(--indigo)';this.style.background='rgba(99,102,241,0.05)';this.style.transform='translateY(-1px)'"
                onmouseout="this.style.borderColor='var(--border)';this.style.background='var(--bg2)';this.style.transform='none'">
                <div style="font-weight:700;font-size:0.95rem;font-family:'Inter',sans-serif;color:var(--text);line-height:1.5;">${top}</div>
                <div style="display:flex;align-items:center;gap:0.35rem;flex-wrap:wrap;">
                  <span style="font-family:'JetBrains Mono',monospace;font-size:0.6rem;color:var(--text3);">${tqs.length} PYQ${tqs.length!==1?'s':''}</span>
                  ${diffCounts.easy?`<span style="font-size:0.75rem;padding:1px 5px;border-radius:3px;background:rgba(16,185,129,0.1);color:var(--green);">${diffCounts.easy}E</span>`:''}
                  ${diffCounts.medium?`<span style="font-size:0.75rem;padding:1px 5px;border-radius:3px;background:rgba(245,158,11,0.1);color:var(--amber);">${diffCounts.medium}M</span>`:''}
                  ${diffCounts.hard?`<span style="font-size:0.75rem;padding:1px 5px;border-radius:3px;background:rgba(239,68,68,0.1);color:var(--red);">${diffCounts.hard}H</span>`:''}
                  <span style="margin-left:auto;font-size:0.75rem;color:var(--indigo);font-weight:700;">Solve →</span>
                </div>
              </div>`;
            }).join('')}
          </div>
        </div>
      </div>`;
    }).join('')}
  </div>`;
}

function buildGatePQRows(qs){
  return qs.map((q,i)=>`
    <div class="gpq-row" onclick="startGateSinglePYQ(${PYQ.indexOf(q)},${JSON.stringify(qs.map(x=>PYQ.indexOf(x))).replace(/"/g,'&quot;')})">
      <span class="gpq-num">${i+1}.</span>
      <span class="gpq-q">${q.q.length>100?q.q.substring(0,100)+'…':q.q}</span>
      <span class="gpq-yr">GATE ${q.y}</span>
      <span class="diff-chip ${q.d==='easy'?'dc-e':q.d==='hard'?'dc-h':'dc-m'}" style="font-size:0.75rem;padding:1px 5px;">${q.d}</span>
    </div>`).join('');
}

function toggleGSA(id){
  const b=document.getElementById('gsa-'+id);
  const c=document.getElementById('chev-'+id);
  if(b){b.classList.toggle('open');if(c)c.textContent=b.classList.contains('open')?'▲':'▼';}
}
function toggleGTC(id){
  const b=document.getElementById('gtc-'+id);
  const c=document.getElementById('gtchev-'+id);
  if(!b)return;
  const isOpen=b.classList.contains('open');
  b.classList.toggle('open',!isOpen);
  b.style.display=isOpen?'none':'block';
  if(c)c.textContent=isOpen?'▼':'▲';
}

function getSubjEmoji(sub){
  const map={
    'Data Structures':'🌲','Algorithms':'⚙️','Operating Systems':'💻','DBMS':'🗄️',
    'Computer Networks':'🌐','Theory of Computation':'🔵','Computer Organization':'🖥️',
    'Discrete Mathematics':'∑','Discrete Math':'∑','Compiler Design':'📝',
    'Software Engineering':'🔧','Programming (C/C++)':'</>','Digital Logic':'💡',
    'Signals & Systems':'〰️','Electronic Devices':'⚡','Control Systems':'🎛️',
    'Analog/Digital Circuits':'🔌','Electromagnetics':'🧲','Communications':'📡',
    'Thermodynamics':'🔥','Fluid Mechanics':'💧','Strength of Materials':'🏗️',
    'Theory of Machines':'⚙️','Manufacturing':'🏭','Heat Transfer':'♨️',
    'Structural Analysis':'🏛️','Geotechnical Engg':'⛏️','Concrete Technology':'🧱',
    'Environmental Engg':'🌿','Surveying':'📐',
    'Quantitative Aptitude':'🔢','Logical Reasoning':'🧩','Verbal Ability':'📖',
  };
  return map[sub]||'📖';
}

function startGatePYQQuiz(){
  const qs=getGatePYQFiltered();
  const sn={cs:'CS/IT',ece:'ECE',me:'ME',ce:'CE',ga:'GA'}[gateStream];
  launchQuiz(qs,`📅 GATE ${sn} — All PYQs`,'gate');
}
function startGateYearQuiz(y){
  const qs=getGatePYQFiltered().filter(q=>q.y===y);
  launchQuiz(qs,`📅 GATE ${y} — Full Paper`,'gate');
}
function startGateSubjPYQ(sub){
  const qs=getGatePYQFiltered().filter(q=>q.sub===sub);
  launchQuiz(qs,`📚 PYQ — ${sub}`,'gate');
}
function startGateTopicPYQ(top){
  const qs=getGatePYQFiltered().filter(q=>q.top===top);
  if(qs.length===0)return;
  launchQuiz(qs,`🔬 ${top}`,'gate');
}
function startGateSinglePYQ(startIdx, indices){
  const qs=(indices||[]).map(i=>PYQ[i]).filter(Boolean);
  const pos=qs.findIndex((q,i)=>PYQ.indexOf(q)===startIdx)||0;
  launchQuiz(qs.length>0?qs:PYQ.slice(startIdx,startIdx+1),`📅 PYQ Quiz`,'gate',Math.max(0,pos));
}

function renderGate(){
  const streams = [...new Set(GATE_SUBJS.map(s=>s.stream))];
  const el = document.getElementById('gate-body-content');
  if(!el)return;

  const streamMeta = {
    'CS/IT': { color:'#6366f1', bg:'rgba(99,102,241,0.08)', border:'rgba(99,102,241,0.25)', emoji:'🖥️', desc:'Computer Science & Information Technology' },
    'ECE':   { color:'#f59e0b', bg:'rgba(245,158,11,0.08)',  border:'rgba(245,158,11,0.25)',  emoji:'📡', desc:'Electronics & Communication Engineering' },
    'ME':    { color:'#10b981', bg:'rgba(16,185,129,0.08)',  border:'rgba(16,185,129,0.25)',  emoji:'⚙️', desc:'Mechanical Engineering' },
    'CE':    { color:'#06b6d4', bg:'rgba(6,182,212,0.08)',   border:'rgba(6,182,212,0.25)',   emoji:'🏗️', desc:'Civil Engineering' },
    'GA':    { color:'#ec4899', bg:'rgba(236,72,153,0.08)',  border:'rgba(236,72,153,0.25)',  emoji:'🧠', desc:'General Aptitude' },
  };

  // ── Domain-wise Mock Test definitions ──
  const DOMAIN_MOCKS = [
    {
      stream: 'CS/IT', emoji: '🖥️',
      color: '#6366f1', bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.25)', glow: 'rgba(99,102,241,0.2)',
      desc: 'Computer Science & Information Technology',
      tests: [
        { id:'cs-1', label:'CS Mock Test 1', tag:'Foundation',  subjects:['ds','algo','os','dbms'] },
        { id:'cs-2', label:'CS Mock Test 2', tag:'Systems',     subjects:['cn','co','compiler','toc'] },
        { id:'cs-3', label:'CS Mock Test 3', tag:'Theory',      subjects:['dm','se','prog','dl'] },
        { id:'cs-4', label:'CS Mock Test 4', tag:'Full Paper ⭐', subjects:['ds','algo','os','dbms','cn','toc','compiler','co','dm','se','prog','dl'] },
      ]
    },
    {
      stream: 'ECE', emoji: '📡',
      color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)', glow: 'rgba(245,158,11,0.18)',
      desc: 'Electronics & Communication Engineering',
      tests: [
        { id:'ece-1', label:'ECE Mock Test 1', tag:'Circuits',  subjects:['edc','ade','signals'] },
        { id:'ece-2', label:'ECE Mock Test 2', tag:'Systems',   subjects:['control','comm','emf'] },
        { id:'ece-3', label:'ECE Mock Test 3', tag:'Full Paper ⭐', subjects:['signals','edc','control','ade','emf','comm'] },
      ]
    },
    {
      stream: 'ME', emoji: '⚙️',
      color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.25)', glow: 'rgba(16,185,129,0.18)',
      desc: 'Mechanical Engineering',
      tests: [
        { id:'me-1', label:'ME Mock Test 1', tag:'Thermal',    subjects:['thermo','ht','fm'] },
        { id:'me-2', label:'ME Mock Test 2', tag:'Design',     subjects:['som','tom','mfg'] },
        { id:'me-3', label:'ME Mock Test 3', tag:'Full Paper ⭐', subjects:['thermo','fm','som','tom','mfg','ht'] },
      ]
    },
    {
      stream: 'CE', emoji: '🏗️',
      color: '#06b6d4', bg: 'rgba(6,182,212,0.08)', border: 'rgba(6,182,212,0.25)', glow: 'rgba(6,182,212,0.18)',
      desc: 'Civil Engineering',
      tests: [
        { id:'ce-1', label:'CE Mock Test 1', tag:'Structural',  subjects:['struct','geotech','concrete'] },
        { id:'ce-2', label:'CE Mock Test 2', tag:'Env & Survey', subjects:['enveng','surveying'] },
        { id:'ce-3', label:'CE Mock Test 3', tag:'Full Paper ⭐', subjects:['struct','geotech','concrete','enveng','surveying'] },
      ]
    },
    {
      stream: 'GA', emoji: '🧠',
      color: '#ec4899', bg: 'rgba(236,72,153,0.08)', border: 'rgba(236,72,153,0.25)', glow: 'rgba(236,72,153,0.18)',
      desc: 'General Aptitude (All Streams)',
      tests: [
        { id:'ga-1', label:'GA Mock Test 1', tag:'Quantitative', subjects:['quant'] },
        { id:'ga-2', label:'GA Mock Test 2', tag:'Verbal & Logic', subjects:['lr','verbal'] },
        { id:'ga-3', label:'GA Mock Test 3', tag:'Full GA ⭐',    subjects:['quant','lr','verbal'] },
      ]
    },
  ];

  el.innerHTML = `
    <!-- ════ TAB SWITCHER — big, visible ════ -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:2rem;">

      <div id="tab-mock" onclick="switchPracticeTab('mock')" style="background:linear-gradient(135deg,rgba(236,72,153,0.18),rgba(139,92,246,0.10));
        border:2px solid var(--pink);border-radius:16px;padding:1.4rem 1.75rem;cursor:pointer;transition:all 0.2s;">
        <div style="display:flex;align-items:center;gap:0.85rem;margin-bottom:0.5rem;">
          <div style="width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,var(--pink),var(--rose));
            display:flex;align-items:center;justify-content:center;font-size:1.3rem;box-shadow:0 4px 14px rgba(236,72,153,0.4);">🎯</div>
          <div>
            <div style="font-family:'Inter',sans-serif;font-weight:800;font-size:1.1rem;color:var(--text);letter-spacing:-0.3px;">Domain-wise Mock Tests</div>
            <div style="font-size:0.78rem;color:var(--pink);font-family:'Inter',sans-serif;margin-top:1px;font-weight:600;">Full-length papers · Timer · −⅓ scoring</div>
          </div>
        </div>
        <div style="display:flex;gap:0.4rem;flex-wrap:wrap;margin-top:0.5rem;">
          <span style="font-size:0.68rem;background:rgba(236,72,153,0.12);color:var(--pink);border:1px solid rgba(236,72,153,0.25);padding:2px 8px;border-radius:5px;font-family:'JetBrains Mono',monospace;">CS/IT</span>
          <span style="font-size:0.68rem;background:rgba(236,72,153,0.12);color:var(--pink);border:1px solid rgba(236,72,153,0.25);padding:2px 8px;border-radius:5px;font-family:'JetBrains Mono',monospace;">ECE</span>
          <span style="font-size:0.68rem;background:rgba(236,72,153,0.12);color:var(--pink);border:1px solid rgba(236,72,153,0.25);padding:2px 8px;border-radius:5px;font-family:'JetBrains Mono',monospace;">ME</span>
          <span style="font-size:0.68rem;background:rgba(236,72,153,0.12);color:var(--pink);border:1px solid rgba(236,72,153,0.25);padding:2px 8px;border-radius:5px;font-family:'JetBrains Mono',monospace;">CE</span>
          <span style="font-size:0.68rem;background:rgba(236,72,153,0.12);color:var(--pink);border:1px solid rgba(236,72,153,0.25);padding:2px 8px;border-radius:5px;font-family:'JetBrains Mono',monospace;">GA</span>
          <span style="font-size:0.68rem;background:rgba(236,72,153,0.2);color:var(--pink);border:1px solid rgba(236,72,153,0.4);padding:2px 8px;border-radius:5px;font-family:'JetBrains Mono',monospace;font-weight:700;">16 Tests</span>
        </div>
      </div>

      <div id="tab-subj" onclick="switchPracticeTab('subj')" style="background:var(--card);
        border:2px solid var(--border);border-radius:16px;padding:1.4rem 1.75rem;cursor:pointer;transition:all 0.2s;"
        onmouseover="this.style.borderColor='var(--green)';this.style.boxShadow='0 6px 24px rgba(16,185,129,0.15)'"
        onmouseout="if(!this.classList.contains('active')){this.style.borderColor='var(--border)';this.style.boxShadow='none'}">
        <div style="display:flex;align-items:center;gap:0.85rem;margin-bottom:0.5rem;">
          <div style="width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,var(--green),var(--cyan));
            display:flex;align-items:center;justify-content:center;font-size:1.3rem;box-shadow:0 4px 14px rgba(16,185,129,0.35);">📚</div>
          <div>
            <div style="font-family:'Inter',sans-serif;font-weight:800;font-size:1.1rem;color:var(--text);letter-spacing:-0.3px;">Subject-wise Practice</div>
            <div style="font-size:0.78rem;color:var(--green);font-family:'Inter',sans-serif;margin-top:1px;font-weight:600;">30 subjects · Instant feedback · Any topic</div>
          </div>
        </div>
        <div style="display:flex;gap:0.4rem;flex-wrap:wrap;margin-top:0.5rem;">
          <span style="font-size:0.68rem;background:rgba(16,185,129,0.1);color:var(--green);border:1px solid rgba(16,185,129,0.25);padding:2px 8px;border-radius:5px;font-family:'JetBrains Mono',monospace;">Data Structures</span>
          <span style="font-size:0.68rem;background:rgba(16,185,129,0.1);color:var(--green);border:1px solid rgba(16,185,129,0.25);padding:2px 8px;border-radius:5px;font-family:'JetBrains Mono',monospace;">Algorithms</span>
          <span style="font-size:0.68rem;background:rgba(16,185,129,0.1);color:var(--green);border:1px solid rgba(16,185,129,0.25);padding:2px 8px;border-radius:5px;font-family:'JetBrains Mono',monospace;">OS</span>
          <span style="font-size:0.68rem;background:rgba(16,185,129,0.1);color:var(--green);border:1px solid rgba(16,185,129,0.25);padding:2px 8px;border-radius:5px;font-family:'JetBrains Mono',monospace;">+27 more</span>
        </div>
      </div>
    </div>

    <!-- ════ MOCK TESTS PANEL ════ -->
    <div id="panel-mock">
      ${DOMAIN_MOCKS.map(domain => `
      <div style="margin-bottom:1.75rem;">
        <div style="display:flex;align-items:center;gap:0.85rem;padding:0.9rem 1.25rem;
          background:${domain.bg};border:1.5px solid ${domain.border};border-radius:13px;margin-bottom:0.85rem;">
          <span style="font-size:1.5rem;">${domain.emoji}</span>
          <div style="flex:1;">
            <div style="font-family:'Inter',sans-serif;font-weight:800;font-size:1rem;color:${domain.color};letter-spacing:-0.2px;">${domain.stream}</div>
            <div style="font-size:0.78rem;color:var(--text2);font-family:'Inter',sans-serif;">${domain.desc}</div>
          </div>
          <span style="font-family:'JetBrains Mono',monospace;font-size:0.62rem;color:${domain.color};opacity:0.7;">${domain.tests.length} tests</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:0.75rem;">
          ${domain.tests.map(t => {
            const pool = t.subjects.flatMap(id => QB[id]||[]);
            const total = Math.min(30, pool.length);
            const easy  = pool.filter(q=>q.d==='easy').length;
            const med   = pool.filter(q=>q.d==='medium').length;
            const hard  = pool.filter(q=>q.d==='hard').length;
            const isFull = t.tag.includes('⭐');
            return `<div onclick="startMockTest('${t.id}')"
              style="background:var(--card);border:1.5px solid ${isFull ? domain.border : 'var(--border)'};
                border-radius:13px;padding:1.1rem 1.2rem;cursor:pointer;transition:all 0.2s;position:relative;overflow:hidden;"
              onmouseover="this.style.borderColor='${domain.color}';this.style.transform='translateY(-3px)';this.style.boxShadow='0 8px 28px ${domain.glow}'"
              onmouseout="this.style.borderColor='${isFull ? domain.border : 'var(--border)'}';this.style.transform='none';this.style.boxShadow='none'">
              <div style="position:absolute;top:0;left:0;right:0;height:2.5px;background:${domain.color};opacity:${isFull?'0.9':'0.4'};"></div>
              <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:0.5rem;margin-top:0.15rem;">
                <div style="font-family:'Inter',sans-serif;font-weight:700;font-size:0.92rem;color:var(--text);">${t.label}</div>
                <span style="font-family:'JetBrains Mono',monospace;font-size:0.58rem;background:${domain.color}20;color:${domain.color};border:1px solid ${domain.color}40;padding:2px 7px;border-radius:4px;white-space:nowrap;margin-left:0.4rem;">${t.tag}</span>
              </div>
              <div style="font-size:0.76rem;color:var(--text3);font-family:'Inter',sans-serif;margin-bottom:0.7rem;">
                ${t.subjects.map(id=>{const s=GATE_SUBJS.find(x=>x.id===id);return s?s.name:id;}).slice(0,3).join(' · ')}${t.subjects.length>3?` +${t.subjects.length-3} more`:''}
              </div>
              <div style="display:flex;align-items:center;justify-content:space-between;">
                <div style="display:flex;gap:4px;">
                  <span style="font-size:0.65rem;padding:2px 7px;border-radius:4px;background:rgba(16,185,129,0.1);color:var(--green);font-family:'JetBrains Mono',monospace;">${easy}E</span>
                  <span style="font-size:0.65rem;padding:2px 7px;border-radius:4px;background:rgba(245,158,11,0.1);color:var(--amber);font-family:'JetBrains Mono',monospace;">${med}M</span>
                  <span style="font-size:0.65rem;padding:2px 7px;border-radius:4px;background:rgba(239,68,68,0.1);color:var(--red);font-family:'JetBrains Mono',monospace;">${hard}H</span>
                </div>
                <span style="font-size:0.78rem;color:${domain.color};font-weight:700;font-family:'Inter',sans-serif;">${total}Q →</span>
              </div>
            </div>`;
          }).join('')}
        </div>
      </div>`).join('')}
    </div>

    <!-- ════ SUBJECT PRACTICE PANEL ════ -->
    <div id="panel-subj" style="display:none;">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.5rem;margin-bottom:1.5rem;">
        <div style="font-family:'Inter',sans-serif;font-weight:700;font-size:0.95rem;color:var(--text2);">Choose a subject and start drilling</div>
        <button onclick="quickGateQuiz()" style="background:var(--indigo);color:#fff;border:none;padding:9px 20px;border-radius:9px;font-family:'Inter',sans-serif;font-weight:700;font-size:0.88rem;cursor:pointer;transition:all 0.2s;" onmouseover="this.style.opacity='0.85'" onmouseout="this.style.opacity='1'">⚡ Random Quiz</button>
      </div>
      ${streams.map(st=>{
        const meta = streamMeta[st] || { color:'#6366f1', bg:'rgba(99,102,241,0.08)', border:'rgba(99,102,241,0.25)', emoji:'📐', desc:st };
        const subs = GATE_SUBJS.filter(s=>s.stream===st);
        return `<div style="margin-bottom:2rem;">
          <div style="display:flex;align-items:center;gap:1rem;padding:0.9rem 1.25rem;
            background:${meta.bg};border:1.5px solid ${meta.border};border-radius:12px;margin-bottom:1rem;">
            <span style="font-size:1.6rem;">${meta.emoji}</span>
            <div>
              <div style="font-family:'Inter',sans-serif;font-weight:800;font-size:1.1rem;color:${meta.color};letter-spacing:-0.3px;">${st}</div>
              <div style="font-size:0.82rem;color:var(--text2);margin-top:1px;font-family:'Inter',sans-serif;">${meta.desc} · ${subs.length} subjects</div>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(185px,1fr));gap:0.75rem;">
            ${subs.map(s=>`
            <div onclick="startSubjQuiz('${s.id}','gate')"
              style="background:var(--card);border:1.5px solid var(--border);border-radius:13px;
                padding:1.1rem 1.15rem;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;gap:0.75rem;"
              onmouseover="this.style.borderColor='${s.color}';this.style.background='rgba(0,0,0,0.05)';this.style.transform='translateY(-2px)'"
              onmouseout="this.style.borderColor='var(--border)';this.style.background='var(--card)';this.style.transform='none'">
              <span style="font-size:1.4rem;flex-shrink:0;">${s.emoji}</span>
              <div style="flex:1;min-width:0;">
                <div style="font-weight:700;font-size:0.92rem;font-family:'Inter',sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--text);">${s.name}</div>
                <div style="font-size:0.76rem;color:var(--text2);font-family:'JetBrains Mono',monospace;margin-top:2px;">${s.cnt} Questions</div>
              </div>
            </div>`).join('')}
          </div>
        </div>`;
      }).join('')}
    </div>`;

  // init tab state
  _practiceTab = 'mock';
}

let _practiceTab = 'mock';

function switchPracticeTab(tab) {
  _practiceTab = tab;
  const mock = document.getElementById('panel-mock');
  const subj = document.getElementById('panel-subj');
  const tabMock = document.getElementById('tab-mock');
  const tabSubj = document.getElementById('tab-subj');
  if (!mock || !subj) return;

  if (tab === 'mock') {
    mock.style.display = 'block';
    subj.style.display = 'none';
    // Active tab styling
    tabMock.style.background = 'linear-gradient(135deg,rgba(236,72,153,0.18),rgba(139,92,246,0.10))';
    tabMock.style.borderColor = 'var(--pink)';
    tabSubj.style.background = 'var(--card)';
    tabSubj.style.borderColor = 'var(--border)';
    tabSubj.style.boxShadow = 'none';
  } else {
    mock.style.display = 'none';
    subj.style.display = 'block';
    // Active tab styling
    tabSubj.style.background = 'linear-gradient(135deg,rgba(16,185,129,0.15),rgba(6,182,212,0.08))';
    tabSubj.style.borderColor = 'var(--green)';
    tabSubj.style.boxShadow = '0 4px 20px rgba(16,185,129,0.15)';
    tabSubj.onmouseover = null; tabSubj.onmouseout = null;
    tabMock.style.background = 'var(--card)';
    tabMock.style.borderColor = 'var(--border)';
  }
}

function startMockTest(id){
  const ALL_TESTS = [
    {id:'cs-1', label:'CS Mock Test 1',  subjects:['ds','algo','os','dbms']},
    {id:'cs-2', label:'CS Mock Test 2',  subjects:['cn','co','compiler','toc']},
    {id:'cs-3', label:'CS Mock Test 3',  subjects:['dm','se','prog','dl']},
    {id:'cs-4', label:'CS Mock Test 4 — Full', subjects:['ds','algo','os','dbms','cn','toc','compiler','co','dm','se','prog','dl']},
    {id:'ece-1',label:'ECE Mock Test 1', subjects:['edc','ade','signals']},
    {id:'ece-2',label:'ECE Mock Test 2', subjects:['control','comm','emf']},
    {id:'ece-3',label:'ECE Mock Test 3 — Full', subjects:['signals','edc','control','ade','emf','comm']},
    {id:'me-1', label:'ME Mock Test 1',  subjects:['thermo','ht','fm']},
    {id:'me-2', label:'ME Mock Test 2',  subjects:['som','tom','mfg']},
    {id:'me-3', label:'ME Mock Test 3 — Full',  subjects:['thermo','fm','som','tom','mfg','ht']},
    {id:'ce-1', label:'CE Mock Test 1',  subjects:['struct','geotech','concrete']},
    {id:'ce-2', label:'CE Mock Test 2',  subjects:['enveng','surveying']},
    {id:'ce-3', label:'CE Mock Test 3 — Full',  subjects:['struct','geotech','concrete','enveng','surveying']},
    {id:'ga-1', label:'GA Mock Test 1',  subjects:['quant']},
    {id:'ga-2', label:'GA Mock Test 2',  subjects:['lr','verbal']},
    {id:'ga-3', label:'GA Mock Test 3 — Full',  subjects:['quant','lr','verbal']},
  ];
  const mock = ALL_TESTS.find(m=>m.id===id);
  if(!mock){ alert('Mock test not found.'); return; }
  const pool = mock.subjects.flatMap(s => QB[s]||[]);
  if(pool.length === 0){ alert('Questions coming soon for this test! 🚧'); return; }
  const qs = shuffle([...pool]).slice(0, Math.min(30, pool.length));
  launchQuiz(qs, `🎯 ${mock.label}`, 'gate');
}

function getStream(s){return{CS_IT:'cs',ECE:'ece',ME:'me',CE:'ce',GA:'ga','CS/IT':'cs'}[s]||'cs';}
function goPYQSubj(name,stream){
  gateStream=stream||'cs'; gatePYQTab='subject';
  showGateSection('pyq');
  // highlight correct stream pill
  document.querySelectorAll('.gpill').forEach(b=>b.classList.remove('on'));
  const map={cs:0,ece:1,me:2,ce:3,ga:4};
  const pills=document.querySelectorAll('.gpill');
  if(pills[map[stream]])pills[map[stream]].classList.add('on');
}
