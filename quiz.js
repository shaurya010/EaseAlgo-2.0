// =============================================
// EaseAlgo — js/quiz.js
// =============================================
// Quiz engine — handles all MCQ logic.
//
// launchQuiz(qs, title, ret, start) — start any quiz
//   qs    = array of question objects
//   title = quiz header title string
//   ret   = page to return to: 'gate','psu','dsa'
//   start = starting question index (default 0)
//
// renderQ() — render current question
// pickOpt(i) — handle option selection
// submitQ() — grade answer, show explanation
// skipQ() — skip current question
// nextQ() — advance to next question
// jumpQ(i) — navigator jump to question i
// showResult() — show animated result overlay
// retryQuiz() — restart same quiz shuffled
// closeResult() — dismiss result and go back
// startSubjQuiz(id, ret) — start practice for subject id
// quickGateQuiz() — random 10-question GATE quiz
// =============================================
// ══════════════════════════════════════════
// QUIZ ENGINE
// ══════════════════════════════════════════
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}

function renderQ(){
  const q=QS.qs[QS.cur];
  if(!q)return;
  QS.answered=false;QS.sel=null;
  const n=QS.cur+1,t=QS.qs.length;
  document.getElementById('prog-txt').textContent=`Q ${n} / ${t}`;
  document.getElementById('prog-fill').style.width=`${(n/t)*100}%`;
  updateChips();
  const dc={easy:'qb-e',medium:'qb-m',hard:'qb-h'};
  const pyqTag=q.y?`<span class="qbadge qb-yr">📅 GATE ${q.y}</span>`:'';
  const topTag=q.top?`<span class="qbadge qb-tp">${q.top}</span>`:'';
  document.getElementById('q-area').innerHTML=`
    <div class="qcard">
      <div class="qcard-hdr">
        <span class="qbadge qb-n">Q${n}</span>
        <span class="qbadge ${dc[q.d]||'qb-m'}">${q.d||'medium'}</span>
        ${pyqTag}${topTag}
        <span class="qbadge qb-mk" style="margin-left:auto;">${q.m||1} mark${(q.m||1)>1?'s':''}</span>
      </div>
      <div class="qtext">${(q.q||'').replace(/</g,'&lt;').replace(/\n/g,'<br>').replace(/`([^`]+)`/g,'<code>$1</code>')}</div>
      <div class="opts">
        ${['A','B','C','D'].map((k,i)=>`
          <div class="opt" id="opt-${i}" onclick="pickOpt(${i})">
            <div class="opt-k" id="ok-${i}">${k}</div>
            <div class="opt-body">${(q.opts&&q.opts[i])||'—'}</div>
            <span class="opt-icon" id="oi-${i}"></span>
          </div>`).join('')}
      </div>
      <div class="explanation" id="exp" style="display:none;">
        <div class="exp-lbl">💡 Explanation</div>
        <div class="exp-text">${q.e||'Review the relevant concepts for this topic.'}</div>
      </div>
    </div>
    <div class="qactions">
      <div class="qa-l">
        <button class="qbtn qbtn-bm ${QS.bookmarks.has(QS.cur)?'on':''}" id="bm-btn" onclick="toggleBm()">
          ${QS.bookmarks.has(QS.cur)?'★':'☆'}
        </button>
        <button class="qbtn qbtn-skip" onclick="skipQ()">Skip</button>
      </div>
      <div class="qa-r">
        <button class="qbtn qbtn-sub" id="sub-btn" onclick="submitQ()" disabled style="opacity:0.4;cursor:not-allowed;">Submit</button>
        <button class="qbtn qbtn-nxt" id="nxt-btn" onclick="nextQ()" style="display:none;">${QS.cur+1>=QS.qs.length?'Finish 🏁':'Next →'}</button>
      </div>
    </div>`;
  buildQGrid();
}

function pickOpt(i){
  if(QS.answered)return;
  QS.sel=i;
  document.querySelectorAll('.opt').forEach((el,j)=>el.classList.toggle('picked',j===i));
  const b=document.getElementById('sub-btn');
  if(b){b.disabled=false;b.style.opacity='1';b.style.cursor='pointer';}
}

function submitQ(){
  if(QS.answered||QS.sel===null)return;
  QS.answered=true;
  const q=QS.qs[QS.cur],cor=q.ans;
  document.querySelectorAll('.opt').forEach((el,i)=>{
    el.classList.add('locked');el.style.pointerEvents='none';
    const ic=document.getElementById('oi-'+i);
    if(i===cor){el.classList.remove('picked');el.classList.add('correct');if(ic)ic.textContent='✓';}
    else if(i===QS.sel&&i!==cor){el.classList.add('wrong');if(ic)ic.textContent='✗';}
  });
  if(QS.sel===cor){QS.correct++;QS.marks+=(q.m||1);QS.status[QS.cur]='c';}
  else{QS.wrong++;QS.marks=Math.max(0,QS.marks-0.33*(q.m||1));QS.status[QS.cur]='w';}
  const exp=document.getElementById('exp');if(exp)exp.style.display='block';
  const sb=document.getElementById('sub-btn');if(sb)sb.style.display='none';
  const nb=document.getElementById('nxt-btn');if(nb)nb.style.display='inline-block';
  updateChips();buildQGrid();
}

function skipQ(){if(QS.answered)return;QS.skipped++;QS.status[QS.cur]='s';updateChips();nextQ();}

function nextQ(){
  QS.cur++;
  if(QS.cur>=QS.qs.length){showResult();return;}
  renderQ();
}

function jumpQ(i){
  if(i===QS.cur)return;
  if(!QS.answered&&QS.status[QS.cur]==='u'){QS.skipped++;QS.status[QS.cur]='s';updateChips();}
  QS.cur=i;renderQ();
}

function toggleBm(){
  const b=document.getElementById('bm-btn');
  if(QS.bookmarks.has(QS.cur)){QS.bookmarks.delete(QS.cur);if(b){b.classList.remove('on');b.textContent='☆';}}
  else{QS.bookmarks.add(QS.cur);if(b){b.classList.add('on');b.textContent='★';}}
  buildQGrid();
}

function buildQGrid(){
  const el=document.getElementById('qgrid');if(!el)return;
  const map={u:'','c':'qc','w':'qw','s':'qs'};
  el.innerHTML=QS.status.map((s,i)=>{
    const cur=i===QS.cur?'qa':'';
    const bm=QS.bookmarks.has(i)?'qbk':'';
    return`<div class="qbub ${cur} ${map[s]||''} ${bm}" onclick="jumpQ(${i})" style="position:relative;">${i+1}</div>`;
  }).join('');
  // update sidebar stats
  ['c','w','s','m'].forEach(k=>{
    const el2=document.getElementById('sb-'+k);
    if(el2) el2.textContent=k==='m'?Math.round(QS.marks*10)/10:QS[{c:'correct',w:'wrong',s:'skipped',m:'marks'}[k]];
  });
}

function updateChips(){
  document.getElementById('ch-c').textContent=`✓ ${QS.correct}`;
  document.getElementById('ch-w').textContent=`✗ ${QS.wrong}`;
  document.getElementById('ch-s').textContent=`– ${QS.skipped}`;
  document.getElementById('ch-m').textContent=`📊 ${Math.round(QS.marks*10)/10}`;
}

function startTimer(){
  clearInterval(QS.timer);QS.secs=0;
  QS.timer=setInterval(()=>{
    QS.secs++;
    const m=Math.floor(QS.secs/60).toString().padStart(2,'0');
    const s=(QS.secs%60).toString().padStart(2,'0');
    const tb=document.getElementById('timer-box');if(tb)tb.textContent=`⏱ ${m}:${s}`;
  },1000);
}

function showResult(){
  clearInterval(QS.timer);
  const t=QS.qs.length;
  const pct=Math.round((QS.correct/t)*100);
  totalScore+=Math.round(QS.marks);
  document.getElementById('score-v').textContent=totalScore;
  document.getElementById('r-pct').textContent=pct+'%';
  document.getElementById('rb-c').textContent=QS.correct;
  document.getElementById('rb-w').textContent=QS.wrong;
  document.getElementById('rb-s').textContent=QS.skipped;
  document.getElementById('rb-m').textContent=Math.round(QS.marks*10)/10;
  const grades=pct>=85?['🏆 Excellent!','Outstanding performance! Top 5% percentile.','#f59e0b']:pct>=70?['🎯 Great!','Well above average. Keep up the practice!','#6366f1']:pct>=50?['👍 Good','Average performance. Review weak areas.','#10b981']:['📚 Keep Practicing','Focus on fundamentals and attempt more PYQs.','#ef4444'];
  document.getElementById('r-grade').textContent=grades[0];document.getElementById('r-grade').style.color=grades[2];
  document.getElementById('r-msg').textContent=grades[1];
  const ring=document.getElementById('r-ring');
  ring.style.stroke=grades[2];
  ring.style.strokeDashoffset=264*(1-pct/100);
  document.getElementById('result-ov').classList.add('on');
}

function retryQuiz(){
  document.getElementById('result-ov').classList.remove('on');
  QS.qs=shuffle([...QS.qs]);
  QS={...QS,cur:0,correct:0,wrong:0,skipped:0,marks:0,answered:false,sel:null,
      status:Array(QS.qs.length).fill('u'),bookmarks:new Set(),secs:0};
  renderQ();buildQGrid();startTimer();
}

function closeResult(){
  document.getElementById('result-ov').classList.remove('on');
  goto(quizReturn);
}

function nlSub(){
  const v=document.getElementById('nl-email');
  if(v&&v.value){v.value='';v.placeholder='✓ Subscribed! Thank you.';}
}

// ══════ INIT ══════
// ══ INIT ══
showGateSection('pyq');
initPYQ();
