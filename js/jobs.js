// =============================================
// EaseAlgo — js/jobs.js
// =============================================
// Job & Research Opportunities — full page logic.
//
// JOBS_DATA — curated opportunities array
//   Each: {id, title, org, icon, cat, domain, location, deadline, desc, link, featured}
//   cat: 'research' | 'tech' | 'academia' | 'govt' | 'internship'
//   domain: 'CS/AI' | 'ECE' | 'ME' | 'CE' | 'EE' | 'General'
//
// initJobsPage() — called by goto('jobs') to render the page
// filterJobsPage(cat, el) — filter by category pill
// openJobSubmit() / closeJobSubmit() — modal
// submitJob() — add user job, save to localStorage
// =============================================

const JOBS_DATA = [
  // ── RESEARCH ──
  { id:'r1', cat:'research', domain:'CS/AI', featured:true,
    title:'Junior Research Fellow — Machine Learning & Computer Vision',
    org:'IISc Bangalore', icon:'🔬', location:'Bangalore', deadline:'Rolling',
    desc:'Funded JRF in the Dept of Computational & Data Sciences. Work on deep learning for medical imaging. GATE CS/ECE candidates preferred. Stipend ₹31,000–35,000.',
    link:'https://cds.iisc.ac.in' },
  { id:'r2', cat:'research', domain:'ECE', featured:true,
    title:'Project Scientist — VLSI & Embedded Systems',
    org:'CDAC Pune', icon:'🧪', location:'Pune', deadline:'31 Mar 2026',
    desc:'Design and verification of SoC architectures. B.Tech/M.Tech ECE/EE with GATE score required. Stipend: ₹35,000/month.',
    link:'https://cdac.in/careers' },
  { id:'r3', cat:'research', domain:'CS/AI',
    title:'Research Associate — Natural Language Processing',
    org:'IIT Bombay', icon:'🤖', location:'Mumbai', deadline:'15 Apr 2026',
    desc:'NLP research on Indic languages. M.Tech/MS (CS/AI) or exceptional B.Tech with GATE score. Stipend: ₹42,000/month.',
    link:'https://cse.iitb.ac.in' },
  { id:'r4', cat:'research', domain:'ME',
    title:'Research Engineer — Robotics & Automation',
    org:'DRDO CAIR', icon:'🛡️', location:'Bangalore', deadline:'20 Apr 2026',
    desc:'Autonomous systems, ROS-based robotics for defence. ME/MTech Mechanical/Robotics. GATE ME score mandatory.',
    link:'https://drdo.gov.in' },
  { id:'r5', cat:'research', domain:'CS/AI',
    title:'Postdoctoral Researcher — Quantum Computing',
    org:'TCS Research', icon:'⚛️', location:'Mumbai / Pune', deadline:'Rolling',
    desc:'Quantum algorithms, error correction, and optimization research. PhD in CS/Physics with strong math background.',
    link:'https://www.tcs.com/careers/research' },

  // ── TECH / INDUSTRY ──
  { id:'t1', cat:'tech', domain:'CS/AI', featured:true,
    title:'Software Engineer — Core Infrastructure',
    org:'Google India', icon:'🟡', location:'Bangalore (Hybrid)', deadline:'Rolling',
    desc:'Google-scale distributed systems, data pipelines, infrastructure. B.Tech/M.Tech CS. Strong DSA and systems knowledge required.',
    link:'https://careers.google.com' },
  { id:'t2', cat:'tech', domain:'CS/AI', featured:true,
    title:'SDE — Backend Platform',
    org:'Flipkart', icon:'🛒', location:'Bangalore', deadline:'Rolling',
    desc:'High-scale commerce platform. Java/Go, microservices, Kafka. GATE qualified freshers eligible for SDE-1.',
    link:'https://flipkartcareers.com' },
  { id:'t3', cat:'tech', domain:'ECE',
    title:'VLSI Design Engineer',
    org:'Intel India', icon:'💙', location:'Bangalore / Hyderabad', deadline:'30 Apr 2026',
    desc:'RTL design and verification for next-gen processor products. B.Tech/M.Tech ECE with VLSI specialization. GATE ECE preferred.',
    link:'https://jobs.intel.com' },
  { id:'t4', cat:'tech', domain:'ME',
    title:'Mechanical Design Engineer — EV Systems',
    org:'Ather Energy', icon:'⚡', location:'Bangalore', deadline:'Rolling',
    desc:'Design battery packs, thermal management, chassis for electric vehicles. B.Tech ME. GATE score is an advantage.',
    link:'https://atherenergy.com/careers' },
  { id:'t5', cat:'tech', domain:'CS/AI',
    title:'Data Scientist — ML Platform',
    org:'Amazon India', icon:'🟠', location:'Hyderabad (Hybrid)', deadline:'Rolling',
    desc:'ML models for supply chain, forecasting, recommendations. Python, PyTorch, SageMaker. GATE CS background preferred.',
    link:'https://amazon.jobs' },
  { id:'t6', cat:'tech', domain:'CE',
    title:'Structural Analysis Engineer',
    org:'L&T Construction', icon:'🏗️', location:'Mumbai / Chennai', deadline:'30 Apr 2026',
    desc:'Analysis and design of infrastructure using STAAD, ETABS. B.Tech/M.Tech Civil + GATE CE score. CTC: ₹6–9 LPA.',
    link:'https://larsentoubro.com/careers' },

  // ── ACADEMIA ──
  { id:'a1', cat:'academia', domain:'CS/AI', featured:true,
    title:'PhD Admission — Computer Science (2026–27)',
    org:'IIT Delhi', icon:'🎓', location:'Delhi', deadline:'25 Apr 2026',
    desc:'Ph.D. in AI, Systems, Theory, Networks. GATE CS/IT mandatory. Scholarship: ₹31,000–35,000/month + HRA.',
    link:'https://www.iitd.ac.in/phd' },
  { id:'a2', cat:'academia', domain:'ECE',
    title:'PhD — Signal Processing & Communications',
    org:'IIT Madras', icon:'📡', location:'Chennai', deadline:'30 Apr 2026',
    desc:'Research in 5G/6G systems, signal processing, radar. GATE ECE mandatory. JRF stipend + housing.',
    link:'https://www.iitm.ac.in/phd-admissions' },
  { id:'a3', cat:'academia', domain:'ME',
    title:'M.Tech + PhD Dual Degree — Thermal Science',
    org:'IIT Kharagpur', icon:'🔥', location:'Kharagpur', deadline:'15 Apr 2026',
    desc:'M.Tech/PhD in Mechanical — Heat Transfer, CFD, Fluid Mechanics. GATE ME required. Stipend: ₹12,400/month.',
    link:'https://erp.iitkgp.ac.in/Admission' },
  { id:'a4', cat:'academia', domain:'General',
    title:'M.Tech Admissions — All Disciplines (2026)',
    org:'NIT Trichy', icon:'🏛️', location:'Tiruchirappalli', deadline:'20 May 2026',
    desc:'M.Tech through GATE score — CSE, ECE, ME, CE, EE. GATE cutoff varies by branch. Scholarships available.',
    link:'https://www.nitt.edu/admissions' },
  { id:'a5', cat:'academia', domain:'CS/AI',
    title:'Research Internship — AI & Data Science Lab',
    org:'IIIT Hyderabad', icon:'🧠', location:'Hyderabad', deadline:'10 Apr 2026',
    desc:'Summer research in ML, CV, NLP, AI for healthcare. Pre-final year B.Tech. Duration: 2 months. Stipend: ₹20,000.',
    link:'https://iiit.ac.in/research' },

  // ── GOVT / PSU ──
  { id:'g1', cat:'govt', domain:'CS/AI', featured:true,
    title:'Scientist/Engineer SC — Computer Science',
    org:'ISRO', icon:'🚀', location:'Multiple centres', deadline:'GATE Score Based',
    desc:'Entry via GATE CS score. Satellite software, mission control, embedded systems. One of India\'s most prestigious engineering roles.',
    link:'https://isro.gov.in/careers' },
  { id:'g2', cat:'govt', domain:'ECE',
    title:'Scientific Officer — Electronics',
    org:'BARC', icon:'⚛️', location:'Mumbai', deadline:'OCES/DGFS 2026',
    desc:'OCES/DGFS scheme. Electronics, instrumentation, reactor systems. B.Tech ECE + GATE ECE score.',
    link:'https://barc.gov.in/careers' },
  { id:'g3', cat:'govt', domain:'ME',
    title:'Engineer Trainee — Mechanical',
    org:'BHEL', icon:'⚡', location:'Pan India', deadline:'GATE 2026',
    desc:'ET recruitment via GATE ME. Manufacturing, power plants, turbines. Starting CTC: ₹9 LPA.',
    link:'https://bhel.com/careers' },
  { id:'g4', cat:'govt', domain:'CE',
    title:'Assistant Executive Engineer — Civil',
    org:'NHPC Limited', icon:'💧', location:'Various hydro projects', deadline:'Apr 2026',
    desc:'Civil engineering in hydropower plant construction, dam design, project management. GATE CE required.',
    link:'https://nhpcindia.com/careers' },
  { id:'g5', cat:'govt', domain:'CS/AI',
    title:'Deputy Manager (IT/Systems)',
    org:'ONGC', icon:'🛢️', location:'Multiple cities', deadline:'GATE Score',
    desc:'IT systems, software, cybersecurity at India\'s largest energy company. B.Tech CS/IT + GATE score.',
    link:'https://ongcindia.com/careers' },

  // ── INTERNSHIP ──
  { id:'i1', cat:'internship', domain:'CS/AI', featured:true,
    title:'Summer Research Intern — AI Infrastructure',
    org:'Microsoft Research India', icon:'🔵', location:'Bangalore', deadline:'20 Mar 2026',
    desc:'12-week internship on LLMs, systems for ML, or HCI. Final year UG or PG. Stipend: ₹80,000/month + relocation.',
    link:'https://www.microsoft.com/en-us/research/lab/microsoft-research-india' },
  { id:'i2', cat:'internship', domain:'CS/AI',
    title:'Software Engineering Intern',
    org:'Adobe India', icon:'🎨', location:'Bangalore / Noida', deadline:'31 Mar 2026',
    desc:'3-month SWE internship on Creative Cloud or Experience Cloud. Pre-final year B.Tech/M.Tech CS.',
    link:'https://adobe.wd5.myworkdayjobs.com' },
  { id:'i3', cat:'internship', domain:'ECE',
    title:'Embedded Systems Intern',
    org:'Qualcomm India', icon:'📱', location:'Hyderabad', deadline:'15 Apr 2026',
    desc:'Modem firmware, RF calibration, SoC validation. B.Tech/M.Tech ECE penultimate year. ₹60,000/month.',
    link:'https://qualcomm.com/company/careers' },
  { id:'i4', cat:'internship', domain:'ME',
    title:'Design Intern — Aerospace Structures',
    org:'HAL Bangalore', icon:'✈️', location:'Bangalore', deadline:'30 Apr 2026',
    desc:'Aerostructures design using CATIA/NASTRAN. 3rd/4th year Aerospace or Mechanical B.Tech. Monthly stipend + certificate.',
    link:'https://hal-india.co.in/Careers' },
  { id:'i5', cat:'internship', domain:'CS/AI',
    title:'ML Research Intern',
    org:'Samsung R&D India', icon:'🌀', location:'Bangalore / Noida', deadline:'Rolling',
    desc:'On-device AI, computer vision, speech/NLP research. B.Tech/M.Tech CS/ECE + strong ML fundamentals. Stipend: ₹50,000.',
    link:'https://research.samsung.com/careers' },
];

const CAT_COLORS = {
  research:  { badge:'jb-cat-research',  btn:'#6366f1' },
  tech:      { badge:'jb-cat-tech',      btn:'#06b6d4' },
  academia:  { badge:'jb-cat-academia',  btn:'#8b5cf6' },
  govt:      { badge:'jb-cat-govt',      btn:'#f59e0b', btnText:'#000' },
  internship:{ badge:'jb-cat-internship',btn:'#10b981' },
};
const CAT_LABELS = {
  research:'🔬 Research', tech:'💻 Tech', academia:'🎓 Academia',
  govt:'🏛️ Govt/PSU', internship:'🌱 Internship'
};

let activeJobCat = 'all';
let userJobs = [];

// ── Init page ──
function initJobsPage() {
  try { userJobs = JSON.parse(localStorage.getItem('ea_jobs') || '[]'); } catch(e) { userJobs = []; }
  activeJobCat = 'all';
  // reset pills
  document.querySelectorAll('[id^="jfp-"]').forEach(b => b.classList.remove('on'));
  const allPill = document.getElementById('jfp-all');
  if (allPill) allPill.classList.add('on');
  const domSel = document.getElementById('jp-domain');
  if (domSel) domSel.value = 'all';
  renderJobsGrid([...JOBS_DATA, ...userJobs]);
}

// ── Filter ──
function filterJobsPage(cat, el) {
  if (cat !== null) {
    activeJobCat = cat;
    document.querySelectorAll('[id^="jfp-"]').forEach(b => b.classList.remove('on'));
    if (el) el.classList.add('on');
  }
  const domSel = document.getElementById('jp-domain');
  const activeDomain = domSel ? domSel.value : 'all';
  const all = [...JOBS_DATA, ...userJobs];
  const filtered = all.filter(j => {
    if (activeJobCat !== 'all' && j.cat !== activeJobCat) return false;
    if (activeDomain !== 'all' && j.domain !== activeDomain) return false;
    return true;
  });
  renderJobsGrid(filtered);
}

// ── Render cards ──
function renderJobsGrid(jobs) {
  const grid  = document.getElementById('jobs-grid');
  const empty = document.getElementById('jobs-empty');
  const count = document.getElementById('jp-count');
  if (!grid) return;
  if (count) count.textContent = jobs.length + ' listing' + (jobs.length !== 1 ? 's' : '');
  if (jobs.length === 0) {
    grid.innerHTML = '';
    if (empty) empty.style.display = 'block';
    return;
  }
  if (empty) empty.style.display = 'none';

  const sorted = [...jobs].sort((a,b) => (b.featured?1:0)-(a.featured?1:0));

  grid.innerHTML = sorted.map(j => {
    const cc = CAT_COLORS[j.cat] || CAT_COLORS.tech;
    const btnColor = cc.btn;
    const btnText  = cc.btnText || '#fff';
    const featuredBadge = j.featured
      ? `<span style="display:inline-flex;align-items:center;gap:3px;font-family:'JetBrains Mono',monospace;
          font-size:0.62rem;background:rgba(245,158,11,0.12);border:1px solid rgba(245,158,11,0.3);
          color:#f59e0b;padding:3px 9px;border-radius:6px;letter-spacing:0.4px;white-space:nowrap;flex-shrink:0;">⭐ Featured</span>`
      : '';
    return `
    <div class="job-card" data-cat="${j.cat}" onclick="applyJob('${j.link}')">
      <div class="job-card-top">
        <div class="job-org-icon">${j.icon}</div>
        <div class="job-card-info">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:0.5rem;">
            <div class="job-title" style="flex:1;">${j.title}</div>
            ${featuredBadge}
          </div>
          <div class="job-org">${j.org}</div>
        </div>
      </div>
      <div class="job-badges">
        <span class="job-badge ${cc.badge}">${CAT_LABELS[j.cat]}</span>
        <span class="job-badge jb-domain">${j.domain}</span>
      </div>
      <div class="job-desc">${j.desc}</div>
      <div class="job-footer">
        <div class="job-meta">
          ${j.location ? `<span class="job-meta-item">📍 ${j.location}</span>` : ''}
          ${j.deadline ? `<span class="job-meta-item">⏰ ${j.deadline}</span>` : ''}
        </div>
        <button class="job-apply-btn" style="background:${btnColor};color:${btnText};"
          onclick="event.stopPropagation();applyJob('${j.link}')">
          Apply →
        </button>
      </div>
    </div>`; 
  }).join('');
}

function applyJob(link) {
  if (link && (link.startsWith('http') || link.startsWith('mailto'))) {
    window.open(link, '_blank');
  }
}

// ── Modal ──
function openJobSubmit() {
  const m = document.getElementById('job-modal');
  if (m) { m.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
}
function closeJobSubmit() {
  const m = document.getElementById('job-modal');
  if (m) { m.style.display = 'none'; document.body.style.overflow = ''; }
  ['jf-title','jf-org','jf-loc','jf-deadline','jf-desc','jf-link'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
}
function submitJob() {
  const title    = document.getElementById('jf-title')?.value.trim();
  const org      = document.getElementById('jf-org')?.value.trim();
  const cat      = document.getElementById('jf-cat')?.value || 'tech';
  const domain   = document.getElementById('jf-domain')?.value || 'General';
  const location = document.getElementById('jf-loc')?.value.trim() || 'India';
  const deadline = document.getElementById('jf-deadline')?.value.trim() || 'Rolling';
  const desc     = document.getElementById('jf-desc')?.value.trim() || '';
  const link     = document.getElementById('jf-link')?.value.trim();
  if (!title || !org || !link) { alert('Please fill Title, Organisation and Apply Link.'); return; }
  const icons = {research:'🔬',academia:'🎓',govt:'🏛️',internship:'🌱',tech:'💼'};
  const job = { id:'u_'+Date.now(), title, org, cat, domain, location, deadline, desc, link, icon:icons[cat]||'💼', featured:false };
  try {
    const saved = JSON.parse(localStorage.getItem('ea_jobs')||'[]');
    saved.push(job); localStorage.setItem('ea_jobs', JSON.stringify(saved));
  } catch(e) {}
  userJobs.push(job);
  closeJobSubmit();
  filterJobsPage(activeJobCat, null);
  showJobToast('✅ Opportunity posted!');
}
function showJobToast(msg) {
  let t = document.getElementById('job-toast');
  if (!t) {
    t = document.createElement('div'); t.id = 'job-toast';
    t.style.cssText = `position:fixed;bottom:2rem;left:50%;transform:translateX(-50%) translateY(20px);
      background:var(--green);color:#fff;padding:11px 26px;border-radius:10px;font-family:'Inter',sans-serif;
      font-weight:600;font-size:0.9rem;opacity:0;transition:all 0.3s;z-index:99999;pointer-events:none;`;
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1'; t.style.transform = 'translateX(-50%) translateY(0)';
  setTimeout(() => { t.style.opacity='0'; t.style.transform='translateX(-50%) translateY(20px)'; }, 3000);
}

// Close modal on backdrop click
document.addEventListener('click', e => {
  const m = document.getElementById('job-modal');
  if (m && e.target === m) closeJobSubmit();
});
