// =============================================
// EaseAlgo — js/auth.js
// =============================================
// Local auth + personalization system.
// Uses localStorage for storage.
// Data structure per user:
//   ea_users        → {email: {name, email, passwordHash, stream, createdAt}}
//   ea_session      → {email, name, stream, loginAt}
//   ea_progress_{email} → {
//     quizzesAttempted, totalQuestions, correctAnswers,
//     subjectScores: {subj: {attempted, correct}},
//     bookmarks: [qIndices],
//     mockHistory: [{year, score, total, date}],
//     streak: {lastDate, count},
//     xp: number
//   }
// =============================================

// ── Simple hash (not cryptographic — for demo. Real app use bcrypt on backend) ──
function simpleHash(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = (h * 0x01000193) >>> 0;
  }
  return h.toString(16);
}

// ── Storage helpers ──
function getUsers()   { try { return JSON.parse(localStorage.getItem('ea_users')||'{}'); } catch(e){return{};} }
function saveUsers(u) { localStorage.setItem('ea_users', JSON.stringify(u)); }
function getSession() { try { return JSON.parse(localStorage.getItem('ea_session')||'null'); } catch(e){return null;} }
function saveSession(s){ localStorage.setItem('ea_session', JSON.stringify(s)); }
function clearSession(){ localStorage.removeItem('ea_session'); }
function getProgress(email){ try { return JSON.parse(localStorage.getItem('ea_progress_'+email)||'null'); } catch(e){return null;} }
function saveProgress(email, p){ localStorage.setItem('ea_progress_'+email, JSON.stringify(p)); }

function defaultProgress(){
  return {
    quizzesAttempted:0, totalQuestions:0, correctAnswers:0,
    subjectScores:{}, bookmarks:[], mockHistory:[],
    streak:{lastDate:null, count:0}, xp:0
  };
}

// ── Current user ──
let _currentUser = null;

// ── Init on load ──
document.addEventListener('DOMContentLoaded', function(){
  const session = getSession();
  if (session && session.email) {
    const users = getUsers();
    if (users[session.email]) {
      _currentUser = { ...users[session.email], ...session };
      updateNavAuth();
      updateStreakOnLogin();
    } else {
      clearSession();
    }
  } else {
    updateNavAuth();
  }
  // Close dropdown when clicking outside
  document.addEventListener('click', function(e){
    const dd = document.getElementById('user-dropdown');
    const btn = document.getElementById('auth-nav-btn');
    if (dd && !dd.contains(e.target) && !btn.contains(e.target)) {
      dd.style.display = 'none';
    }
  });
});

// ── Modal open/close ──
function openAuthModal() {
  if (_currentUser) {
    // Toggle user dropdown
    const dd = document.getElementById('user-dropdown');
    if (dd) dd.style.display = dd.style.display === 'block' ? 'none' : 'block';
    updateDropdown();
    return;
  }
  const m = document.getElementById('auth-modal');
  if (m) { m.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
  switchAuthTab('login');
}
function closeAuthModal(){
  const m = document.getElementById('auth-modal');
  if (m) { m.style.display = 'none'; document.body.style.overflow = ''; }
  clearAuthErrors();
}
function closeUserDropdown(){
  const dd = document.getElementById('user-dropdown');
  if (dd) dd.style.display = 'none';
}
document.addEventListener('click', function(e){
  const m = document.getElementById('auth-modal');
  if (m && e.target === m) closeAuthModal();
});

// ── Tab switch ──
function switchAuthTab(tab) {
  document.getElementById('auth-form-login').style.display    = tab==='login'    ? 'block' : 'none';
  document.getElementById('auth-form-register').style.display = tab==='register' ? 'block' : 'none';
  const tl = document.getElementById('auth-tab-login');
  const tr = document.getElementById('auth-tab-register');
  if(tl){ tl.style.background=tab==='login'?'var(--indigo)':'transparent'; tl.style.color=tab==='login'?'#fff':'var(--text2)'; }
  if(tr){ tr.style.background=tab==='register'?'var(--indigo)':'transparent'; tr.style.color=tab==='register'?'#fff':'var(--text2)'; }
  clearAuthErrors();
}

function clearAuthErrors(){
  const le=document.getElementById('login-error');
  const re=document.getElementById('reg-error');
  if(le){le.style.display='none';le.textContent='';}
  if(re){re.style.display='none';re.textContent='';}
}
function showError(id, msg){
  const el=document.getElementById(id);
  if(el){el.textContent=msg;el.style.display='block';}
}

// ── Register ──
function doRegister(){
  const name  = document.getElementById('reg-name')?.value.trim();
  const email = document.getElementById('reg-email')?.value.trim().toLowerCase();
  const pass  = document.getElementById('reg-password')?.value;
  const stream= document.getElementById('reg-stream')?.value || 'cs';

  if (!name)  return showError('reg-error','Please enter your name.');
  if (!email || !email.includes('@')) return showError('reg-error','Please enter a valid email.');
  if (!pass || pass.length < 6) return showError('reg-error','Password must be at least 6 characters.');

  const users = getUsers();
  if (users[email]) return showError('reg-error','An account with this email already exists. Please sign in.');

  const user = { name, email, passwordHash: simpleHash(pass), stream, createdAt: new Date().toISOString() };
  users[email] = user;
  saveUsers(users);
  saveProgress(email, defaultProgress());

  _loginUser(user);
}

// ── Login ──
function doLogin(){
  const email = document.getElementById('login-email')?.value.trim().toLowerCase();
  const pass  = document.getElementById('login-password')?.value;

  if (!email) return showError('login-error','Please enter your email.');
  if (!pass)  return showError('login-error','Please enter your password.');

  const users = getUsers();
  const user = users[email];
  if (!user) return showError('login-error','No account found. Please create one.');
  if (user.passwordHash !== simpleHash(pass)) return showError('login-error','Incorrect password. Please try again.');

  _loginUser(user);
}

function _loginUser(user){
  _currentUser = user;
  saveSession({ email:user.email, name:user.name, stream:user.stream, loginAt:new Date().toISOString() });
  closeAuthModal();
  updateNavAuth();
  updateStreakOnLogin();
  showAuthToast(`Welcome back, ${user.name.split(' ')[0]}! 👋`);
  // Fire any pending post-login action
  if (_pendingPostLoginCallback) {
    const cb = _pendingPostLoginCallback;
    _pendingPostLoginCallback = null;
    setTimeout(cb, 300);
  }
  // Set gate stream to user's preference
  if (user.stream && typeof setGateStream === 'function') {
    const pillMap = {cs:0, ece:1, me:2, ce:3, ga:4};
    const pills = document.querySelectorAll('.gpill');
    if (pills[pillMap[user.stream]]) {
      setGateStream(user.stream, pills[pillMap[user.stream]]);
    }
  }
}

// ── Logout ──
function doLogout(){
  _currentUser = null;
  clearSession();
  closeUserDropdown();
  updateNavAuth();
  showAuthToast('Signed out successfully.');
}

// ── Update nav button ──
function updateNavAuth(){
  const btn   = document.getElementById('auth-nav-btn');
  const icon  = document.getElementById('auth-nav-icon');
  const label = document.getElementById('auth-nav-label');
  if (!btn) return;
  if (_currentUser) {
    const initials = _currentUser.name.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
    if (icon) icon.textContent = '';
    if (label) label.textContent = _currentUser.name.split(' ')[0];
    // Replace icon with avatar circle
    btn.innerHTML = `
      <div style="width:22px;height:22px;border-radius:50%;background:linear-gradient(135deg,var(--indigo),var(--purple));
        display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:800;color:#fff;">${initials}</div>
      <span style="font-family:'Inter',sans-serif;font-size:0.85rem;font-weight:600;">${_currentUser.name.split(' ')[0]}</span>`;
    btn.onclick = openAuthModal;
  } else {
    btn.innerHTML = `<span id="auth-nav-icon">👤</span><span id="auth-nav-label" style="font-family:'Inter',sans-serif;">Login</span>`;
    btn.onclick = openAuthModal;
  }
}

// ── Update user dropdown ──
function updateDropdown(){
  const av = document.getElementById('ud-avatar');
  const nm = document.getElementById('ud-name');
  const em = document.getElementById('ud-email');
  const st = document.getElementById('ud-stats');
  if (!_currentUser) return;
  const initials = _currentUser.name.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
  if (av) av.textContent = initials;
  if (nm) nm.textContent = _currentUser.name;
  if (em) em.textContent = _currentUser.email;
  const prog = getProgress(_currentUser.email) || defaultProgress();
  const acc = prog.totalQuestions > 0 ? Math.round((prog.correctAnswers/prog.totalQuestions)*100) : 0;
  if (st) st.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.5rem;text-align:center;">
      <div><div style="font-weight:800;font-size:1rem;color:var(--indigo);">${prog.quizzesAttempted}</div><div style="font-size:0.65rem;color:var(--text3);">Quizzes</div></div>
      <div><div style="font-weight:800;font-size:1rem;color:var(--green);">${acc}%</div><div style="font-size:0.65rem;color:var(--text3);">Accuracy</div></div>
      <div><div style="font-weight:800;font-size:1rem;color:var(--amber);">${prog.streak.count}</div><div style="font-size:0.65rem;color:var(--text3);">Streak 🔥</div></div>
    </div>`;
}

// ── Track quiz results ──
function trackQuizResult(correct, total, subjects, isMock, year){
  if (!_currentUser) return;
  const prog = getProgress(_currentUser.email) || defaultProgress();
  prog.quizzesAttempted = (prog.quizzesAttempted||0) + 1;
  prog.totalQuestions   = (prog.totalQuestions||0)   + total;
  prog.correctAnswers   = (prog.correctAnswers||0)   + correct;
  prog.xp               = (prog.xp||0) + correct * 10 + (total-correct) * 2;
  // Per-subject tracking
  if (subjects) {
    subjects.forEach(({sub, correct:c, total:t}) => {
      if (!prog.subjectScores[sub]) prog.subjectScores[sub] = {attempted:0, correct:0};
      prog.subjectScores[sub].attempted += t;
      prog.subjectScores[sub].correct   += c;
    });
  }
  if (isMock && year) {
    prog.mockHistory = prog.mockHistory || [];
    prog.mockHistory.push({year, score:correct, total, date:new Date().toISOString()});
  }
  saveProgress(_currentUser.email, prog);
}

// ── Bookmark a question ──
function toggleBookmark(qIdx){
  if (!_currentUser) { openAuthModal(); return; }
  const prog = getProgress(_currentUser.email) || defaultProgress();
  prog.bookmarks = prog.bookmarks || [];
  const i = prog.bookmarks.indexOf(qIdx);
  if (i === -1) {
    prog.bookmarks.push(qIdx);
    showAuthToast('Bookmarked ✓');
  } else {
    prog.bookmarks.splice(i, 1);
    showAuthToast('Bookmark removed');
  }
  saveProgress(_currentUser.email, prog);
  return i === -1; // true = added
}

function isBookmarked(qIdx){
  if (!_currentUser) return false;
  const prog = getProgress(_currentUser.email) || defaultProgress();
  return (prog.bookmarks||[]).includes(qIdx);
}

// ── Streak logic ──
function updateStreakOnLogin(){
  if (!_currentUser) return;
  const prog = getProgress(_currentUser.email) || defaultProgress();
  const today = new Date().toDateString();
  const last  = prog.streak?.lastDate;
  if (last === today) return; // already updated today
  const yesterday = new Date(Date.now()-86400000).toDateString();
  if (last === yesterday) {
    prog.streak = { lastDate:today, count:(prog.streak?.count||0)+1 };
  } else {
    prog.streak = { lastDate:today, count:1 };
  }
  saveProgress(_currentUser.email, prog);
}

// ── Toast ──
function showAuthToast(msg, color='var(--green)'){
  let t = document.getElementById('auth-toast');
  if (!t) {
    t = document.createElement('div'); t.id = 'auth-toast';
    t.style.cssText = `position:fixed;bottom:2rem;left:50%;transform:translateX(-50%) translateY(20px);
      color:#fff;padding:11px 24px;border-radius:10px;font-family:'Inter',sans-serif;
      font-weight:600;font-size:0.9rem;opacity:0;transition:all 0.3s;z-index:99999;pointer-events:none;`;
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.background = color;
  t.style.opacity = '1';
  t.style.transform = 'translateX(-50%) translateY(0)';
  setTimeout(() => { t.style.opacity='0'; t.style.transform='translateX(-50%) translateY(20px)'; }, 3000);
}

// ── Expose helpers ──
window.EA_AUTH = {
  getUser:    () => _currentUser,
  isLoggedIn: () => !!_currentUser,
  getProgress:() => _currentUser ? getProgress(_currentUser.email) : null,
  trackResult: trackQuizResult,
  toggleBookmark, isBookmarked,
};

// ── Login gate — call before any action that requires login ──
// Usage: requireLogin(() => doThing(), 'Start solving PYQs')
function requireLogin(callback, actionLabel) {
  if (_currentUser) { callback(); return; }
  // Show a branded prompt modal before the auth modal
  showLoginPrompt(actionLabel, callback);
}

function showLoginPrompt(actionLabel, callback) {
  // Remove existing prompt if any
  const existing = document.getElementById('login-prompt-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'login-prompt-overlay';
  overlay.style.cssText = `position:fixed;inset:0;z-index:9998;background:rgba(5,7,14,0.88);
    backdrop-filter:blur(12px);display:flex;align-items:center;justify-content:center;padding:1rem;`;

  overlay.innerHTML = `
    <div style="background:var(--card);border:1.5px solid var(--border2);border-radius:22px;
      padding:0;max-width:400px;width:100%;overflow:hidden;box-shadow:0 32px 80px rgba(0,0,0,0.5);">
      <div style="height:4px;background:linear-gradient(90deg,var(--indigo),var(--purple),var(--cyan));"></div>
      <div style="padding:2rem 2rem 1.5rem;">
        <div style="text-align:center;margin-bottom:1.5rem;">
          <div style="font-size:2.5rem;margin-bottom:0.75rem;">🔒</div>
          <div style="font-family:'Inter',sans-serif;font-weight:800;font-size:1.2rem;letter-spacing:-0.3px;margin-bottom:0.4rem;">Login to continue</div>
          <div style="font-size:0.875rem;color:var(--text2);font-family:'Inter',sans-serif;line-height:1.6;">
            ${actionLabel ? `<span style="color:var(--indigo);font-weight:600;">${actionLabel}</span> requires a free account.<br>` : ''}
            Track progress, save bookmarks &amp; streaks.
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:0.65rem;">
          <button id="lp-signin" style="background:linear-gradient(135deg,var(--indigo),var(--purple));color:#fff;border:none;
            cursor:pointer;padding:13px;border-radius:11px;font-family:'Inter',sans-serif;font-weight:700;
            font-size:0.95rem;transition:all 0.2s;" onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
            Sign In / Create Free Account →
          </button>
          <button id="lp-guest" style="background:transparent;color:var(--text2);border:1.5px solid var(--border);
            cursor:pointer;padding:11px;border-radius:11px;font-family:'Inter',sans-serif;font-weight:600;
            font-size:0.88rem;transition:all 0.2s;" onmouseover="this.style.borderColor='var(--text2)'" onmouseout="this.style.borderColor='var(--border)'">
            Continue as Guest
          </button>
        </div>
        <div style="text-align:center;margin-top:1rem;font-size:0.75rem;color:var(--text3);font-family:'Inter',sans-serif;">
          Free forever · No credit card · Takes 30 seconds
        </div>
      </div>
    </div>`;

  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  // Sign in → open auth modal
  document.getElementById('lp-signin').onclick = () => {
    overlay.remove();
    document.body.style.overflow = '';
    openAuthModal();
    // After login, call callback — hook into _loginUser
    _pendingPostLoginCallback = callback;
  };

  // Guest → proceed anyway
  document.getElementById('lp-guest').onclick = () => {
    overlay.remove();
    document.body.style.overflow = '';
    if (callback) callback();
  };

  // Click backdrop to dismiss
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.remove();
      document.body.style.overflow = '';
    }
  });
}

// Pending callback after login
let _pendingPostLoginCallback = null;
