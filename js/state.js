// =============================================
// EaseAlgo — js/state.js
// Full SPA router with deep history support.
// Every page + sub-state (gate section, quiz return)
// is stored in history so browser back/forward works.
// =============================================

let QS = {qs:[],cur:0,correct:0,wrong:0,skipped:0,marks:0,answered:false,sel:null,status:[],bookmarks:new Set(),timer:null,secs:0};
let quizReturn = 'gate';
let quizReturnState = null;  // stores sub-state to restore on back from quiz
let totalScore = 0;
let PF = {stream:'cs', subj:null, mode:'year', selYear:'all', diff:'all', marks:'all'};

// Current gate sub-state so back knows where to restore
let _gateSubState = null; // null = home | {sec:'pyq', tab:'year'} | {sec:'practice'}
let _navFromHistory = false;

// ── Core page switcher (no sub-state logic) ──
function _showPage(p) {
  document.querySelectorAll('.page').forEach(x => x.classList.remove('on'));
  const pg = document.getElementById('page-'+p);
  if (pg) pg.classList.add('on');
  document.querySelectorAll('.navl').forEach(x => x.classList.remove('on'));
  const nl = document.getElementById('nl-'+p);
  if (nl) nl.classList.add('on');
  const footer = document.getElementById('site-footer');
  if (footer) footer.style.display = p === 'quiz' ? 'none' : 'block';
  document.getElementById('mobnav')?.classList.remove('open');
}

// ── Main goto — handles page nav + pushes history ──
function goto(p, pushHistory=true) {
  _showPage(p);
  window.scrollTo({top:0, behavior:'smooth'});

  // Page-specific init
  if (p === 'gate') {
    _gateSubState = null;
    showGateHome();
  }
  if (p === 'jobs') initJobsPage();
  if (p === 'dsa')  initDSAPage();

  if (pushHistory && !_navFromHistory) {
    history.pushState({page:p, gateState:null}, '', '#'+p);
  }
}

// ── Gate section navigation — pushes its own history entry ──
function gotoGateSection(sec, tab) {
  _gateSubState = {sec, tab: tab || (sec==='pyq' ? 'year' : null)};
  showGateSection(sec, tab);
  history.pushState({page:'gate', gateState:_gateSubState}, '', '#gate-'+sec);
}

// ── Called from Back buttons inside gate sections ──
function gotoGateHome() {
  _gateSubState = null;
  showGateHome();
  history.pushState({page:'gate', gateState:null}, '', '#gate');
}

// ── Launch quiz — stores where to return ──
function _launchQuizNav(ret, retState) {
  quizReturn = ret;
  quizReturnState = retState || null;
  _showPage('quiz');
  window.scrollTo({top:0});
  history.pushState({page:'quiz', quizRet:ret, quizRetState:retState}, '', '#quiz');
}

// ── Close quiz / result — go back to where quiz was launched from ──
function closeResult() {
  document.getElementById('result-ov')?.classList.remove('on');
  _restoreReturnState(quizReturn, quizReturnState);
}

function _restoreReturnState(page, state) {
  if (page === 'gate') {
    _showPage('gate');
    if (state && state.sec) {
      _gateSubState = state;
      showGateSection(state.sec, state.tab);
    } else {
      _gateSubState = null;
      showGateHome();
    }
    history.pushState({page:'gate', gateState:_gateSubState}, '', '#gate'+(state&&state.sec ? '-'+state.sec : ''));
  } else {
    goto(page || 'home');
  }
  window.scrollTo({top:0});
}

// ── Handle browser back/forward ──
window.addEventListener('popstate', function(e) {
  const state = e.state;
  if (!state) return;
  _navFromHistory = true;

  const p = state.page || 'home';
  _showPage(p);
  window.scrollTo({top:0});

  if (p === 'gate') {
    const gs = state.gateState;
    if (gs && gs.sec) {
      _gateSubState = gs;
      showGateSection(gs.sec, gs.tab);
    } else {
      _gateSubState = null;
      showGateHome();
    }
  } else if (p === 'quiz') {
    quizReturn = state.quizRet || 'gate';
    quizReturnState = state.quizRetState || null;
    if (typeof renderQ === 'function') renderQ();
  } else if (p === 'jobs') {
    initJobsPage();
  } else if (p === 'dsa') {
    initDSAPage();
  }

  // Restore footer
  const footer = document.getElementById('site-footer');
  if (footer) footer.style.display = p === 'quiz' ? 'none' : 'block';

  _navFromHistory = false;
});

// ── On first load ──
window.addEventListener('DOMContentLoaded', function() {
  const hash = window.location.hash.replace('#','');
  const validPages = ['home','gate','psu','dsa','jobs','quiz'];
  const basePage = validPages.find(p => hash === p || hash.startsWith(p+'-')) || 'home';

  history.replaceState({page: basePage, gateState: null}, '', '#'+basePage);
  _showPage(basePage);

  if (basePage === 'gate') showGateHome();
  if (basePage === 'dsa')  initDSAPage();
  if (basePage === 'jobs') initJobsPage();
  if (basePage === 'home') initPYQ(); // init PYQ data structures

  // Init PYQ regardless for gate to work
  if (typeof initPYQ === 'function') initPYQ();
});

function toggleMob() {
  document.getElementById('mobnav').classList.toggle('open');
}
