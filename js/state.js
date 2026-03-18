// =============================================
// EaseAlgo — js/state.js
// =============================================
// Global state, SPA routing, browser back button support.
// =============================================
let QS = {qs:[],cur:0,correct:0,wrong:0,skipped:0,marks:0,answered:false,sel:null,status:[],bookmarks:new Set(),timer:null,secs:0};
let quizReturn = 'gate';
let totalScore = 0;
let PF = {stream:'cs', subj:null, mode:'year', selYear:'all', diff:'all', marks:'all'};
let _navFromHistory = false; // flag to prevent double pushState on popstate

// ── SPA Router with browser history ──
function goto(p, pushHistory=true) {
  document.querySelectorAll('.page').forEach(x => x.classList.remove('on'));
  document.getElementById('page-'+p).classList.add('on');
  document.querySelectorAll('.navl').forEach(x => x.classList.remove('on'));
  const n = document.getElementById('nl-'+p); if(n) n.classList.add('on');
  document.getElementById('site-footer').style.display = p==='quiz' ? 'none' : 'block';
  window.scrollTo({top:0, behavior:'smooth'});
  document.getElementById('mobnav').classList.remove('open');

  // Push to browser history so back button works
  if (pushHistory && !_navFromHistory) {
    history.pushState({page: p}, '', '#'+p);
  }

  // Page-specific init
  if (p === 'gate') showGateHome();
  if (p === 'jobs') initJobsPage();
  if (p === 'dsa')  initDSAPage();
}

// Handle browser back/forward
window.addEventListener('popstate', function(e) {
  const p = e.state?.page || 'home';
  _navFromHistory = true;
  goto(p, false);
  _navFromHistory = false;
});

// On first load, push current state
window.addEventListener('DOMContentLoaded', function() {
  const hash = window.location.hash.replace('#','');
  const validPages = ['home','gate','psu','dsa','jobs','quiz'];
  const startPage = validPages.includes(hash) ? hash : 'home';
  history.replaceState({page: startPage}, '', '#'+startPage);
  if (startPage !== 'home') goto(startPage, false);
});

function toggleMob() {
  document.getElementById('mobnav').classList.toggle('open');
}
