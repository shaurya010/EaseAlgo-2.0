// =============================================
// EaseAlgo — js/pyq.js
// =============================================
// PYQ page sidebar + filter logic.
// (The standalone /pyq page — accessible from nav)
//
// initPYQ() — initialize PYQ page on load
// setStream(s, el) — switch stream in sidebar
// selectSubj(s) — select/deselect a subject
// setPYQMode(mode) — 'year' | 'subject' | 'topic'
// applyFilters() — called on filter dropdown change
// getFiltered() — returns filtered PYQ array
// renderPYQContent() — main content renderer
// startFilteredQuiz() — start quiz with current filters
// startYearQuiz(y) — start year-specific quiz
// =============================================
// ══════════════════════════════════════════
// PYQ PAGE — practicepaper.in style
// ══════════════════════════════════════════
function initPYQ(){
  renderSidebarSubjects();
  renderYearDropdown();
  setPYQMode(PF.mode||'year');
}

const STREAM_SUBJECTS = {
  cs:['Data Structures','Algorithms','Operating Systems','DBMS','Computer Networks','Theory of Computation','Computer Organization','Discrete Mathematics','Compiler Design','Software Engineering','Programming (C/C++)','Digital Logic'],
  ece:['Signals & Systems','Electronic Devices','Control Systems','Analog/Digital Circuits','Electromagnetics','Communications'],
  me:['Thermodynamics','Fluid Mechanics','Strength of Materials','Theory of Machines','Manufacturing','Heat Transfer'],
  ce:['Structural Analysis','Geotechnical Engg','Concrete Technology','Environmental Engg','Surveying'],
  ga:['Quantitative Aptitude','Logical Reasoning','Verbal Ability']
};
const STREAM_COLORS = {cs:'var(--indigo)',ece:'var(--amber)',me:'var(--green)',ce:'var(--cyan)',ga:'var(--pink)'};

function setStream(s, el){
  PF.stream=s; PF.subj=null;
  document.querySelectorAll('.st').forEach(b=>b.classList.remove('on'));
  el.classList.add('on');
  renderSidebarSubjects();
  updatePYQTitle();
  renderYearDropdown();
  renderPYQContent();
}

function renderSidebarSubjects(){
  const subs = STREAM_SUBJECTS[PF.stream]||[];
  const el=document.getElementById('sidebar-subjects');
  if(!el)return;
  const color=STREAM_COLORS[PF.stream];
  const total = PYQ.filter(q=>q.st===PF.stream).length;
  el.innerHTML=`<div class="pyq-sb-section">
    <div class="pyq-sb-sec-lbl">Subjects</div>
    <button class="subj-item ${!PF.subj?'on':''}" onclick="selectSubj(null)">
      <span class="si-dot" style="background:${color}"></span>
      <span class="si-name">All Subjects</span>
      <span class="si-cnt">${total}</span>
    </button>
    ${subs.map(s=>{
      const cnt=PYQ.filter(q=>q.st===PF.stream&&q.sub===s).length;
      if(cnt===0)return'';
      return`<button class="subj-item ${PF.subj===s?'on':''}" onclick="selectSubj('${s}')">
        <span class="si-dot" style="background:${color}"></span>
        <span class="si-name">${s}</span>
        <span class="si-cnt">${cnt}</span>
      </button>`;
    }).join('')}
  </div>`;
}

function selectSubj(s){
  PF.subj=s; PF.mode='subject';
  renderSidebarSubjects();
  updatePYQTitle();
  renderPYQContent();
}

function renderYearDropdown(){
  const years=[...new Set(PYQ.filter(q=>q.st===PF.stream).map(q=>q.y))].sort((a,b)=>b-a);
  const el=document.getElementById('pf-year-sel');
  if(!el)return;
  el.innerHTML=`<option value="all">All Years</option>`+years.map(y=>`<option value="${y}">${y}</option>`).join('');
}

function setPYQMode(mode){
  PF.mode=mode;
  ['year','subject','topic'].forEach(m=>{
    const b=document.getElementById('mt-'+m);if(b)b.classList.toggle('on',m===mode);
  });
  renderPYQContent();
  updatePYQTitle();
}

function updatePYQTitle(){
  const el=document.getElementById('pyq-tb-title');if(!el)return;
  const sn={cs:'CS/IT',ece:'ECE',me:'ME',ce:'CE',ga:'GA'}[PF.stream]||'';
  const sub=PF.subj?` · ${PF.subj}`:'';
  const modeLabel={year:'Year-wise',subject:'Subject-wise',topic:'Topic-wise'}[PF.mode];
  el.textContent=`GATE ${sn}${sub} — ${modeLabel} PYQ`;
}

function applyFilters(){
  renderPYQContent();
}

function getFiltered(){
  const d=document.getElementById('pf-diff')?.value||'all';
  const m=document.getElementById('pf-marks')?.value||'all';
  const y=document.getElementById('pf-year-sel')?.value||'all';
  return PYQ.filter(q=>{
    if(q.st!==PF.stream)return false;
    if(PF.subj && q.sub!==PF.subj)return false;
    if(d!=='all'&&q.d!==d)return false;
    if(m!=='all'&&q.m!==parseInt(m))return false;
    if(y!=='all'&&q.y!==parseInt(y))return false;
    return true;
  });
}

function renderPYQContent(){
  const el=document.getElementById('pyq-main-content');if(!el)return;
  const qs=getFiltered();
  const cnt=document.getElementById('pf-cnt');if(cnt)cnt.textContent=`${qs.length} question${qs.length!==1?'s':''}`;
  const sb=document.getElementById('pf-start');if(sb)sb.disabled=qs.length===0;

  if(PF.mode==='year') renderYearMode(el,qs);
  else if(PF.mode==='topic') renderTopicMode(el,qs);
  else renderQuestionList(el,qs);
}

function renderYearMode(el, qs){
  const years=[...new Set(qs.map(q=>q.y))].sort((a,b)=>b-a);
  if(years.length===0){el.innerHTML=`<div class="q-empty">No PYQs found for current filters.</div>`;return;}
  el.innerHTML=`<div class="year-cards">${years.map(y=>{
    const yqs=qs.filter(q=>q.y===y);
    const easy=yqs.filter(q=>q.d==='easy').length;
    const hard=yqs.filter(q=>q.d==='hard').length;
    return`<div class="yc" onclick="startYearQuiz(${y})">
      <div class="yc-y">GATE ${y}</div>
      <div class="yc-c">${yqs.length} Q</div>
      <div style="margin-top:6px;display:flex;gap:3px;justify-content:center;flex-wrap:wrap;">
        <span style="font-size:0.75rem;padding:1px 5px;border-radius:3px;background:rgba(16,185,129,0.1);color:var(--green);">${easy}E</span>
        <span style="font-size:0.75rem;padding:1px 5px;border-radius:3px;background:rgba(239,68,68,0.1);color:var(--red);">${hard}H</span>
      </div>
    </div>`;
  }).join('')}</div>
  <div style="padding:0 1.5rem;"><div style="font-family:'JetBrains Mono',monospace;font-size:0.75rem;color:var(--text3);text-transform:uppercase;letter-spacing:1.5px;margin-bottom:0.75rem;">// All Questions — sorted by year</div></div>`
  +buildQList(qs);
}

function renderTopicMode(el, qs){
  const topics=[...new Set(qs.map(q=>q.top))].sort();
  if(topics.length===0){el.innerHTML=`<div class="q-empty">No topics found.</div>`;return;}
  el.innerHTML=`<div class="topic-list">${topics.map(t=>{
    const tqs=qs.filter(q=>q.top===t);
    return`<div class="topic-card">
      <div class="topic-head" onclick="this.nextElementSibling.classList.toggle('open')">
        <span class="th-emoji">🔬</span>
        <span class="th-name">${t}</span>
        <span class="th-cnt">${tqs.length} Q</span>
        <button onclick="event.stopPropagation();startTopicQuiz('${t.replace(/'/g,"\\'")}',event)" style="padding:4px 12px;background:var(--indigo);color:#fff;border:none;border-radius:6px;font-size:0.7rem;font-weight:700;cursor:pointer;">Practice →</button>
        <span class="th-chev">▼</span>
      </div>
      <div class="topic-body">
        ${tqs.slice(0,5).map(q=>`<div style="font-size:0.78rem;color:var(--text2);padding:4px 0;border-bottom:1px solid var(--border);cursor:pointer;" onclick="startSingleQ(${PYQ.indexOf(q)})">
          <span style="font-family:'JetBrains Mono',monospace;font-size:0.6rem;color:var(--pink);margin-right:6px;">GATE ${q.y}</span>${q.q.length>100?q.q.substring(0,100)+'...':q.q}
        </div>`).join('')}
        ${tqs.length>5?`<div style="font-size:0.7rem;color:var(--text3);padding:4px 0;">+ ${tqs.length-5} more in quiz...</div>`:''}
      </div>
    </div>`;
  }).join('')}</div>`;
}

function renderQuestionList(el, qs){
  el.innerHTML=qs.length===0?`<div class="q-empty">No questions match the selected filters. Try broader filters.</div>`:`<div class="q-list"><div class="ql-head"><span class="ql-h-title">${qs.length} Questions</span><div class="ql-stats"><span class="diff-chip dc-e">${qs.filter(q=>q.d==='easy').length} Easy</span><span class="diff-chip dc-m">${qs.filter(q=>q.d==='medium').length} Med</span><span class="diff-chip dc-h">${qs.filter(q=>q.d==='hard').length} Hard</span></div></div>${buildQList(qs)}</div>`;
}

function buildQList(qs){
  return qs.map((q,i)=>`<div class="q-row" onclick="startSingleQ(${PYQ.indexOf(q)})">
    <div class="q-num">${i+1}.</div>
    <div class="q-main">
      <div class="q-text-prev">${q.q.length>110?q.q.substring(0,110)+'…':q.q}</div>
      <div class="q-meta">
        <span class="qm-year">GATE ${q.y}</span>
        <span class="qm-subj">${q.sub}</span>
        <span class="qm-top">${q.top}</span>
        <span class="qm-marks">${q.m}M</span>
        <span class="diff-chip ${q.d==='easy'?'dc-e':q.d==='hard'?'dc-h':'dc-m'}">${q.d}</span>
      </div>
    </div>
    <button class="q-solve-btn">Solve →</button>
  </div>`).join('');
}

function startFilteredQuiz(){
  const qs=getFiltered();if(qs.length===0)return;
  launchQuiz(qs,'📅 PYQ — Filtered Quiz','pyq');
}
function startYearQuiz(y){
  const qs=getFiltered().filter(q=>q.y===y);
  launchQuiz(qs,`📅 GATE ${y} PYQ`,'pyq');
}
function startTopicQuiz(t){
  const qs=getFiltered().filter(q=>q.top===t);
  launchQuiz(qs,`🔬 Topic: ${t}`,'pyq');
}
function startSingleQ(idx){
  const qs=getFiltered();
  const q=PYQ[idx];
  const start=qs.findIndex(x=>x===q);
  launchQuiz(qs,`📅 PYQ Quiz`,'pyq',Math.max(0,start));
}
// Subject ID → PYQ subject name mapping
const SUBJ_MAP = {
  ds:'Data Structures', algo:'Algorithms', os:'Operating Systems',
  dbms:'DBMS', cn:'Computer Networks', toc:'Theory of Computation',
  co:'Computer Organization', dm:'Discrete Mathematics', compiler:'Compiler Design',
  se:'Software Engineering', prog:'Programming (C/C++)', dl:'Digital Logic',
  signals:'Signals & Systems', edc:'Electronic Devices', control:'Control Systems',
  ade:'Analog/Digital Circuits', emf:'Electromagnetics', comm:'Communications',
  thermo:'Thermodynamics', fm:'Fluid Mechanics', som:'Strength of Materials',
  tom:'Theory of Machines', mfg:'Manufacturing', ht:'Heat Transfer',
  struct:'Structural Analysis', geotech:'Geotechnical Engg', concrete:'Concrete Technology',
  enveng:'Environmental Engg', surveying:'Surveying',
  quant:'Quantitative Aptitude', lr:'Logical Reasoning', verbal:'Verbal Ability',
};

function startSubjQuiz(id, ret){
  const subjName = SUBJ_MAP[id];
  // First try real PYQ data
  let pool = subjName ? PYQ.filter(q => q.sub === subjName) : [];
  // Fall back to QB practice questions
  if(pool.length === 0) pool = QB[id] || [];
  if(pool.length === 0){ alert('No questions available yet for this subject.'); return; }
  const title = `📐 ${subjName || id} Practice`;
  launchQuiz(shuffle([...pool]).slice(0, Math.min(20, pool.length)), title, ret||'gate');
}

function quickGateQuiz(){
  const csQs = PYQ.filter(q => q.st === 'cs');
  const pool = csQs.length > 0 ? csQs : Object.values(QB).flat();
  launchQuiz(shuffle([...pool]).slice(0,15),'⚡ Random GATE Quiz','gate');
}

function launchQuiz(qs, title, ret, start=0){
  quizReturn=ret||'gate';
  QS={qs,cur:start,correct:0,wrong:0,skipped:0,marks:0,answered:false,sel:null,
      status:Array(qs.length).fill('u'),bookmarks:new Set(),timer:null,secs:0};
  document.getElementById('quiz-title').textContent=title;
  goto('quiz');
  renderQ();buildQGrid();startTimer();
}

