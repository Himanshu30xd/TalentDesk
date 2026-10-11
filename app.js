'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const today = () => new Date(Date.now() - new Date().getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
const fmt = d => d ? new Date(d + 'T00:00:00').toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No date';
const t12 = t => { if (!t) return ''; const [h, m] = t.split(':'); return ((+h % 12) || 12) + ':' + m + (+h < 12 ? ' AM' : ' PM'); };

/* ---------- Icons ---------- */
const I = {
  briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  dollar: '<circle cx="12" cy="12" r="10"/><path d="M15 9.5c0-1.4-1.3-2-3-2s-3 .8-3 2 1.3 1.8 3 2.2 3 .9 3 2.3-1.3 2-3 2-3-.7-3-2M12 5.5v13"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>'
};
const ic = n => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n]}</svg>`;

/* ---------- Data store ----------
   BACKEND: replace Store.load / Store.save with fetch() calls to your API later.
   The rest of the code only reads and writes the `db` object. */
const TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship'];
const DEPTS = ['Engineering', 'Design', 'Human Resources', 'Marketing', 'Sales', 'Operations'];
const ETYPES = ['Interview', 'Hiring drive', 'HR meeting'];
const J = (title, dept, loc, type, exp, salary, deadline, apps, status = 'Open') =>
  ({ id: uid(), title, dept, loc, type, exp, salary, deadline, apps, status, desc: `We are looking for a ${title} to join our ${dept} team. You will work with hiring managers and colleagues to deliver great results.` });
const E = (title, type, date, time, loc, who, status = 'Scheduled') => ({ id: uid(), title, type, date, time, loc, who, status });
const seed = () => ({
  jobs: [
    J('Senior Frontend Developer', 'Engineering', 'Remote', 'Full-time', '5+ years', '$90k - $120k', '2026-11-15', 24),
    J('Backend Developer', 'Engineering', 'London', 'Full-time', '3+ years', '$70k - $95k', '2026-11-08', 17),
    J('UI/UX Designer', 'Design', 'Remote', 'Full-time', '2+ years', '$60k - $80k', '2026-10-30', 31),
    J('HR Executive', 'Human Resources', 'New York', 'Full-time', '1-3 years', '$45k - $58k', '2026-10-25', 12),
    J('Marketing Manager', 'Marketing', 'New York', 'Full-time', '6+ years', '$85k - $110k', '2026-11-20', 9),
    J('Software Engineer', 'Engineering', 'Singapore', 'Contract', '2+ years', '$65k - $85k', '2026-09-30', 40, 'Closed'),
    J('Sales Executive', 'Sales', 'Remote', 'Full-time', '1+ years', '$40k - $55k + commission', '2026-11-12', 15)
  ],
  cands: [
    { id: uid(), name: 'Aisha Khan', email: 'aisha.khan@example.com', role: 'Senior Frontend Developer', date: '2026-10-03', stage: 'Interview' },
    { id: uid(), name: 'Daniel Lee', email: 'daniel.lee@example.com', role: 'UI/UX Designer', date: '2026-10-05', stage: 'Applied' },
    { id: uid(), name: 'Maria Rossi', email: 'maria.rossi@example.com', role: 'Backend Developer', date: '2026-10-06', stage: 'Applied' },
    { id: uid(), name: 'Tom Becker', email: 'tom.becker@example.com', role: 'Sales Executive', date: '2026-10-08', stage: 'Shortlisted' }
  ],
  events: [
    E('HR sync: Q4 hiring plan', 'HR meeting', '2026-10-12', '15:00', 'Conference Room 2', 'HR team'),
    E('Technical interview: Senior Frontend Developer', 'Interview', '2026-10-14', '10:30', 'Google Meet', 'Candidate: Aisha Khan, Interviewer: R. Mehta'),
    E('Final round: UI/UX Designer', 'Interview', '2026-10-20', '14:00', 'Zoom', 'Candidate: Daniel Lee, Panel: Design leads'),
    E('Weekend hiring drive: Engineering', 'Hiring drive', '2026-10-24', '09:00', 'Head office, Hall B', 'Panel: Engineering leads'),
    E('Offer review: Software Engineer', 'HR meeting', '2026-10-02', '11:00', 'Room 1', 'HR team', 'Completed'),
    E('Virtual job fair', 'Hiring drive', '2026-09-18', '10:00', 'Online', 'Recruitment team', 'Completed')
  ]
});
const Store = {
  key: 'talentdesk-db-v1',
  load() { try { const d = JSON.parse(localStorage.getItem(this.key)); if (d && d.jobs && d.cands && d.events) return d; } catch (e) {} return seed(); },
  save(d) { try { localStorage.setItem(this.key, JSON.stringify(d)); } catch (e) {} }
};
const db = Store.load();
const save = () => Store.save(db);

/* ---------- Shell ---------- */
const PAGES = [['recruitment', 'index.html', 'Recruitment'], ['trade', 'import-export.html', 'Import / Export'], ['events', 'event.html', 'Events']];
const page = document.body.dataset.page;
$('#root').innerHTML = `
  <div class="app-shell">
    <aside class="sidebar" id="sidebar">
      <a class="brand" href="index.html" aria-label="TalentDesk home">${ic('briefcase')}<span>TalentDesk</span></a>
      <p class="side-label">WORKSPACE</p>
      <nav id="nav" aria-label="Main navigation">${PAGES.map(p => `<a href="${p[1]}"${p[0] === page ? ' aria-current="page"' : ''}>${p[0] === 'recruitment' ? ic('briefcase') : p[0] === 'trade' ? ic('upload') : ic('calendar')}<span>${p[2]}</span></a>`).join('')}</nav>
      <div class="sidebar-foot"><span class="avatar">TD</span><div><b>TalentDesk</b><small>Hiring workspace</small></div></div>
    </aside>
    <div class="app-area">
      <header class="topbar"><a class="brand top-brand" href="index.html" aria-label="TalentDesk home">${ic('briefcase')}<span>TalentDesk</span></a><button class="burger" id="burger" aria-label="Open navigation menu" aria-expanded="false" aria-controls="sidebar">${ic('menu')}</button><div class="crumb">Workspace <span>/</span> <b>${(PAGES.find(p => p[0] === page) || PAGES[0])[2]}</b></div><span class="topbar-tag">Recruitment workspace</span></header>
      <main class="w app-main" id="main"></main>
    </div>
  </div>
  <div class="mobile-scrim" id="scrim"></div>
  <dialog id="dlg"></dialog>
  <div id="toast" role="status" aria-live="polite"></div>`;
$('#burger').onclick = () => { const o = $('#sidebar').classList.toggle('open'); $('#burger').setAttribute('aria-expanded', o); $('#scrim').classList.toggle('show', o); };
$('#scrim').onclick = () => { $('#sidebar').classList.remove('open'); $('#burger').setAttribute('aria-expanded', 'false'); $('#scrim').classList.remove('show'); };
$('#nav').addEventListener('click', e => { if (e.target.closest('a')) { $('#sidebar').classList.remove('open'); $('#scrim').classList.remove('show'); $('#burger').setAttribute('aria-expanded', 'false'); } });

/* ---------- Dialog and toast helpers ---------- */
const dlg = $('#dlg');
dlg.addEventListener('click', e => { if (e.target === dlg || e.target.closest('[data-close]')) dlg.close(); });
const show = html => { dlg.innerHTML = html; if (!dlg.open) dlg.showModal(); };
let tt;
const toast = msg => { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('on'), 2600); };
let refresh = () => {};

function openForm(title, fields, v, onSave, ok = 'Save') {
  show(`<form method="dialog" class="m" id="f"><h2>${esc(title)}</h2>${fields.map(f => {
    const val = v[f.k] ?? '';
    const ctl = f.t === 'select' ? `<select name="${f.k}">${(f.o.includes(val) || !val ? f.o : [...f.o, val]).map(o => `<option${o === val ? ' selected' : ''}>${esc(o)}</option>`).join('')}</select>`
      : f.t === 'textarea' ? `<textarea name="${f.k}" rows="3">${esc(val)}</textarea>`
      : `<input name="${f.k}" type="${f.t || 'text'}" value="${esc(val)}"${f.r ? ' required' : ''}>`;
    return `<label>${f.l}${f.r ? ' *' : ''}${ctl}</label>`;
  }).join('')}<div class="btns"><button type="button" class="btn ghost" data-close>Cancel</button><button class="btn pri">${ok}</button></div></form>`);
  $('#f').onsubmit = () => onSave(Object.fromEntries(new FormData($('#f'))));
}
function confirmDelete(msg, onYes) {
  show(`<div class="m"><h2>Delete this record?</h2><p>${esc(msg)} This cannot be undone.</p><div class="btns"><button class="btn ghost" data-close>Cancel</button><button class="btn danger" id="yes">Delete</button></div></div>`);
  $('#yes').onclick = () => { dlg.close(); onYes(); };
}
const empty = (icon, h, p, btn) => `<div class="empty">${ic(icon)}<h3>${h}</h3><p>${p}</p>${btn || ''}</div>`;

/* ---------- CSV helpers ---------- */
function parseCSV(text) {
  const rows = []; let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; } else if (c === '"') q = false; else cell += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(cell); cell = ''; rows.push(row); row = []; }
    else cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows.map(r => r.map(x => x.trim())).filter(r => r.some(x => x));
}
function download(name, rows) {
  const csv = rows.map(r => r.map(c => { c = String(c ?? ''); if (/^[=+\-@]/.test(c)) c = "'" + c; return /[",\n]/.test(c) ? '"' + c.replace(/"/g, '""') + '"' : c; }).join(',')).join('\r\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  toast('Downloaded ' + name);
}

/* =====================================================
   PAGE 1: Recruitment
   ===================================================== */
const jobFields = [
  { k: 'title', l: 'Job title', r: 1 }, { k: 'dept', l: 'Department', t: 'select', o: DEPTS }, { k: 'loc', l: 'Location', r: 1 },
  { k: 'type', l: 'Employment type', t: 'select', o: TYPES }, { k: 'exp', l: 'Experience required' }, { k: 'salary', l: 'Salary range' },
  { k: 'deadline', l: 'Application deadline', t: 'date', r: 1 }, { k: 'status', l: 'Status', t: 'select', o: ['Open', 'Closed'] },
  { k: 'desc', l: 'Description', t: 'textarea' }
];
const deadline = j => j.status === 'Closed' ? 'Closed' : (j.deadline && j.deadline < today() ? 'Deadline passed' : 'Closes ' + fmt(j.deadline));

function recruitment() {
  $('#main').innerHTML = `
    <div class="head"><div><h1>Job openings</h1><p>Post vacancies, review applicants and manage hiring status.</p></div>
      <button class="btn pri" id="add">${ic('plus')}Post a job</button></div>
    <div class="stats" id="stats"></div>
    <div class="bar">
      <div class="sb">${ic('search')}<input id="q" type="search" placeholder="Search by title, department or location" aria-label="Search jobs"></div>
      <select id="fs" aria-label="Status"><option value="">All statuses</option><option>Open</option><option>Closed</option></select>
      <select id="fd" aria-label="Department"><option value="">All departments</option>${DEPTS.map(d => `<option>${d}</option>`).join('')}</select>
    </div>
    <div class="grid" id="list"></div>`;

  const draw = refresh = () => {
    const q = $('#q').value.toLowerCase(), s = $('#fs').value, d = $('#fd').value;
    const list = db.jobs.filter(j => (!s || j.status === s) && (!d || j.dept === d) && (!q || [j.title, j.dept, j.loc].join(' ').toLowerCase().includes(q)));
    const up = db.events.filter(e => e.type === 'Interview' && e.status === 'Scheduled' && e.date >= today()).length;
    $('#stats').innerHTML = [['Open positions', db.jobs.filter(j => j.status === 'Open').length], ['Closed positions', db.jobs.filter(j => j.status === 'Closed').length],
      ['Total applicants', db.jobs.reduce((a, j) => a + j.apps, 0)], ['Interviews scheduled', up]].map(x => `<div class="stat"><b>${x[1]}</b>${x[0]}</div>`).join('');
    $('#list').innerHTML = list.length ? list.map(j => {
      const closed = j.status === 'Closed';
      return `<article class="card ${closed ? 'off' : ''}">
        <div class="row"><span class="badge ${closed ? '' : 'ok'}">${j.status}</span><span>${deadline(j)}</span></div>
        <h3>${esc(j.title)}</h3><p class="dept">${esc(j.dept)}</p>
        <ul class="meta"><li>${ic('pin')}${esc(j.loc)}</li><li>${ic('briefcase')}${esc(j.type)}${j.exp ? ' &middot; ' + esc(j.exp) : ''}</li><li>${ic('dollar')}${esc(j.salary || 'Not disclosed')}</li></ul>
        <div class="ap">${ic('users')}<span><b>${j.apps}</b> applicants</span></div>
        <div class="acts"><button class="btn sec" data-a="view" data-id="${j.id}">View Job</button>
          <button class="btn pri" data-a="apply" data-id="${j.id}"${closed ? ' disabled' : ''}>Apply Now</button>
          <button class="btn ghost" data-a="manage" data-id="${j.id}">Manage</button></div></article>`;
    }).join('') : empty('briefcase', 'No jobs found', db.jobs.length ? 'Try a different search or clear the filters.' : 'Post your first vacancy to start hiring.', `<button class="btn pri" data-a="new">${ic('plus')}Post a job</button>`);
  };
  ['q', 'fs', 'fd'].forEach(id => $('#' + id).oninput = draw);

  const newJob = () => openForm('Post a job', jobFields, { type: 'Full-time', dept: DEPTS[0], status: 'Open' }, d => {
    db.jobs.unshift({ id: uid(), apps: 0, ...d }); save(); draw(); toast('Job posted');
  }, 'Post job');
  $('#add').onclick = newJob;
  $('#list').onclick = e => {
    const b = e.target.closest('[data-a]'); if (!b) return;
    if (b.dataset.a === 'new') return newJob();
    const j = db.jobs.find(x => x.id === b.dataset.id); if (!j) return;
    ({ view: () => viewJob(j), apply: () => applyJob(j), manage: () => manageJob(j) })[b.dataset.a]();
  };
  draw();
}
function viewJob(j) {
  show(`<div class="m"><span class="badge ${j.status === 'Open' ? 'ok' : ''}">${j.status}</span><h2>${esc(j.title)}</h2><p class="dept">${esc(j.dept)}</p>
    <dl class="facts"><div><dt>Location</dt><dd>${esc(j.loc)}</dd></div><div><dt>Employment type</dt><dd>${esc(j.type)}</dd></div>
    <div><dt>Experience</dt><dd>${esc(j.exp || 'Not specified')}</dd></div><div><dt>Salary</dt><dd>${esc(j.salary || 'Not disclosed')}</dd></div>
    <div><dt>Application deadline</dt><dd>${fmt(j.deadline)}</dd></div><div><dt>Applicants</dt><dd>${j.apps}</dd></div></dl>
    <p>${esc(j.desc)}</p>
    <div class="btns"><button class="btn ghost" data-close>Close</button>${j.status === 'Open' ? '<button class="btn pri" id="ap">Apply Now</button>' : ''}</div></div>`);
  const a = $('#ap'); if (a) a.onclick = () => applyJob(j);
}
function applyJob(j) {
  openForm('Apply for ' + j.title, [{ k: 'name', l: 'Full name', r: 1 }, { k: 'email', l: 'Email address', t: 'email', r: 1 }, { k: 'note', l: 'Cover note (optional)', t: 'textarea' }], {}, d => {
    db.cands.unshift({ id: uid(), name: d.name, email: d.email, note: d.note || '', role: j.title, date: today(), stage: 'Applied' });
    j.apps++; save(); refresh(); toast('Application submitted for ' + j.title);
  }, 'Submit application');
}
function manageJob(j) {
  const open = j.status === 'Open';
  show(`<div class="m"><h2>Manage job</h2><p class="dept">${esc(j.title)}</p><div class="stack">
    <button class="btn sec" id="ed">Edit job details</button>
    <button class="btn sec" id="st">${open ? 'Close this job' : 'Reopen this job'}</button>
    <button class="btn sec" id="rm" style="color:var(--bad)">Delete job</button></div>
    <div class="btns"><button class="btn ghost" data-close>Done</button></div></div>`);
  $('#ed').onclick = () => openForm('Edit job', jobFields, j, d => { Object.assign(j, d); save(); refresh(); toast('Job updated'); });
  $('#st').onclick = () => { j.status = open ? 'Closed' : 'Open'; save(); refresh(); dlg.close(); toast(open ? 'Job closed' : 'Job reopened'); };
  $('#rm').onclick = () => confirmDelete(`"${j.title}" will be removed.`, () => { db.jobs = db.jobs.filter(x => x !== j); save(); refresh(); toast('Job deleted'); });
}

/* =====================================================
   PAGE 2: Import / Export
   ===================================================== */
function trade() {
  const tiles = [
    ['upload', 'Import candidates', 'Upload a CSV with columns: name, email, role, note (note is optional). Rows with an invalid or duplicate email are skipped.', 'Choose CSV file', 'imp-c'],
    ['upload', 'Import job listings', 'Upload a CSV with columns: title, department, location, type, experience, salary, deadline.', 'Choose CSV file', 'imp-j'],
    ['download', 'Export candidate data', 'The full candidate database as a CSV file that opens in Excel.', 'Download CSV', 'exp-c'],
    ['download', 'Export job listings', 'All vacancies with status, deadline and applicant counts.', 'Download CSV', 'exp-j'],
    ['download', 'Export interview schedule', 'Interviews, hiring drives and HR meetings with date, time and location.', 'Download CSV', 'exp-e'],
    ['download', 'Download hiring report', 'A summary of applicants and status for every role.', 'Download report', 'exp-r']
  ];
  $('#main').innerHTML = `
    <div class="head"><div><h1>Import / Export</h1><p>Move candidate and job data in and out of your recruitment records.</p></div></div>
    <div class="tiles">${tiles.map(t => `<div class="tile"><div class="ib ${t[0] === 'download' ? 'x' : ''}">${ic(t[0])}</div><h3>${t[1]}</h3><p>${t[2]}</p><button class="btn ${t[0] === 'upload' ? 'pri' : 'sec'}" data-t="${t[4]}">${t[3]}</button></div>`).join('')}</div>
    <h2>Candidate database</h2><div id="cands"></div>`;

  const draw = refresh = () => {
    $('#cands').innerHTML = db.cands.length
      ? `<div class="tw"><table><thead><tr><th>Name</th><th>Email</th><th>Applied for</th><th>Date</th><th>Stage</th><th>Note</th></tr></thead><tbody>${db.cands.map(c =>
        `<tr><td><b>${esc(c.name)}</b></td><td>${esc(c.email)}</td><td>${esc(c.role)}</td><td>${fmt(c.date)}</td><td><span class="badge info">${esc(c.stage)}</span></td><td>${esc(c.note || "")}</td></tr>`).join('')}</tbody></table></div>`
      : `<div class="grid">${empty('users', 'No candidates yet', 'Import a CSV file or wait for applications from the Recruitment page.')}</div>`;
  };

  const fi = document.createElement('input'); fi.type = 'file'; fi.accept = '.csv,text/csv'; let mode = '';
  fi.onchange = () => {
    const f = fi.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => { doImport(mode, String(r.result)); fi.value = ''; };
    r.readAsText(f);
  };
  function doImport(m, text) {
    let rows = parseCSV(text); if (rows.length && /^(name|title)$/i.test(rows[0][0])) rows = rows.slice(1);
    rows = rows.filter(r => r[0]);
    if (!rows.length) return toast('No valid rows found in that file');
    if (m === 'imp-c') {
      let added = 0, skipped = 0;
      rows.forEach(r => {
        const name = (r[0] || '').trim(), email = (r[1] || '').trim().toLowerCase(), role = (r[2] || 'General').trim();
        if (!name || (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) || (email && db.cands.some(c => (c.email || '').toLowerCase() === email))) { skipped++; return; }
        db.cands.unshift({ id: uid(), name, email, note: (r[3] || '').trim(), role, date: today(), stage: 'Imported' });
        const j = db.jobs.find(x => x.title.toLowerCase() === role.toLowerCase()); if (j) j.apps++;
        added++;
      });
      toast(`Imported ${added}; skipped ${skipped} invalid or duplicate row${skipped === 1 ? '' : 's'}`);
    } else {
      let added = 0, skipped = 0;
      rows.forEach(r => {
        const title = (r[0] || '').trim();
        if (!title || db.jobs.some(j => j.title.toLowerCase() === title.toLowerCase())) { skipped++; return; }
        db.jobs.push({ id: uid(), title, dept: r[1] || DEPTS[0], loc: r[2] || 'Remote', type: TYPES.includes(r[3]) ? r[3] : 'Full-time', exp: r[4] || '', salary: r[5] || '', deadline: /^\d{4}-\d{2}-\d{2}$/.test(r[6] || '') ? r[6] : '', apps: 0, status: 'Open', desc: `We are looking for a ${title} to join our team.` }); added++;
      });
      toast(`Imported ${added}; skipped ${skipped} duplicate or invalid row${skipped === 1 ? '' : 's'}`);
    }
    save(); draw();
  }
  $('.tiles').onclick = e => {
    const b = e.target.closest('[data-t]'); if (!b) return; const t = b.dataset.t;
    if (t.startsWith('imp')) { mode = t; fi.click(); }
    else if (t === 'exp-c') download('candidates.csv', [['Name', 'Email', 'Applied for', 'Date', 'Stage', 'Note'], ...db.cands.map(c => [c.name, c.email, c.role, c.date, c.stage, c.note || ''])]);
    else if (t === 'exp-j') download('job-listings.csv', [['Title', 'Department', 'Location', 'Type', 'Experience', 'Salary', 'Deadline', 'Status', 'Applicants'], ...db.jobs.map(j => [j.title, j.dept, j.loc, j.type, j.exp, j.salary, j.deadline, j.status, j.apps])]);
    else if (t === 'exp-e') download('interview-schedule.csv', [['Event', 'Type', 'Date', 'Time', 'Location', 'People', 'Status'], ...db.events.map(v => [v.title, v.type, v.date, v.time, v.loc, v.who, v.status])]);
    else download('hiring-report.csv', [['Job title', 'Department', 'Status', 'Applicants', 'Deadline'], ...db.jobs.map(j => [j.title, j.dept, j.status, j.apps, j.deadline]), [], ['Total applicants', '', '', db.jobs.reduce((a, j) => a + j.apps, 0)]]);
  };
  draw();
}

/* =====================================================
   PAGE 3: Events
   ===================================================== */
const evFields = [
  { k: 'title', l: 'Event title', r: 1 }, { k: 'type', l: 'Event type', t: 'select', o: ETYPES },
  { k: 'date', l: 'Date', t: 'date', r: 1 }, { k: 'time', l: 'Time', t: 'time', r: 1 },
  { k: 'loc', l: 'Location or meeting link', r: 1 }, { k: 'who', l: 'Candidate / interviewer / panel' },
  { k: 'status', l: 'Status', t: 'select', o: ['Scheduled', 'Completed', 'Cancelled'] }
];
function events() {
  let view = 'up';
  $('#main').innerHTML = `
    <div class="head"><div><h1>Hiring events</h1><p>Interview schedules, hiring drives and HR meetings.</p></div>
      <button class="btn pri" id="add">${ic('plus')}Schedule event</button></div>
    <div class="bar"><div class="seg" role="group" aria-label="Event period"><button data-v="up" aria-pressed="true">Upcoming</button><button data-v="past" aria-pressed="false">Past</button></div>
      <select id="ft" aria-label="Event type"><option value="">All event types</option>${ETYPES.map(t => `<option>${t}</option>`).join('')}</select></div>
    <div id="list"></div>`;

  const draw = refresh = () => {
    const t = $('#ft').value, td = today();
    const isUp = e => e.status === 'Scheduled' && e.date >= td;
    let list = db.events.filter(e => (!t || e.type === t) && (view === 'up' ? isUp(e) : !isUp(e)));
    list.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time) * (view === 'up' ? 1 : -1));
    $('#list').innerHTML = list.length ? list.map(e => {
      const d = new Date(e.date + 'T00:00:00');
      return `<article class="ev"><div class="dt"><b>${d.getDate()}</b><small>${d.toLocaleString('en', { month: 'short' })}</small></div>
        <div class="in"><span class="badge ${e.status === 'Scheduled' ? 'info' : e.status === 'Completed' ? 'ok' : ''}">${e.status}</span> <span class="badge">${esc(e.type)}</span>
          <h3>${esc(e.title)}</h3><p>${t12(e.time)} &middot; ${esc(e.loc)}${e.who ? '<br>' + esc(e.who) : ''}</p></div>
        <div class="acts"><button class="btn sec" data-a="edit" data-id="${e.id}">Edit</button>
          ${e.status === 'Scheduled' ? `<button class="btn sec" data-a="done" data-id="${e.id}">Mark completed</button>` : ''}
          <button class="btn ghost" data-a="del" data-id="${e.id}">Delete</button></div></article>`;
    }).join('') : `<div class="grid">${empty('calendar', view === 'up' ? 'No upcoming events' : 'No past events', view === 'up' ? 'Schedule an interview or hiring drive.' : 'Completed and cancelled events appear here.', view === 'up' ? `<button class="btn pri" data-a="new">${ic('plus')}Schedule event</button>` : '')}</div>`;
  };
  $('#ft').oninput = draw;
  $$('.seg button').forEach(b => b.onclick = () => { view = b.dataset.v; $$('.seg button').forEach(x => x.setAttribute('aria-pressed', x === b)); draw(); });

  const newEv = () => openForm('Schedule event', evFields, { type: ETYPES[0], status: 'Scheduled', date: today() }, d => {
    db.events.push({ id: uid(), ...d }); save(); draw(); toast('Event scheduled');
  }, 'Schedule');
  $('#add').onclick = newEv;
  $('#list').onclick = e => {
    const b = e.target.closest('[data-a]'); if (!b) return;
    if (b.dataset.a === 'new') return newEv();
    const v = db.events.find(x => x.id === b.dataset.id); if (!v) return;
    if (b.dataset.a === 'edit') openForm('Edit event', evFields, v, d => { Object.assign(v, d); save(); draw(); toast('Event updated'); });
    else if (b.dataset.a === 'done') { v.status = 'Completed'; save(); draw(); toast('Marked as completed'); }
    else confirmDelete(`"${v.title}" will be removed.`, () => { db.events = db.events.filter(x => x !== v); save(); draw(); toast('Event deleted'); });
  };
  draw();
}

({ recruitment, trade, events })[page]();
