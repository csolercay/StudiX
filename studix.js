// =================== DATA LAYER ===================
const COLORS = ['#c0392b','#8e44ad','#2980b9','#27ae60','#e67e22'];
const COLOR_NAMES = ['Vermell','Lila','Blau','Verd','Taronja'];

function load(key, def) {
  try { const v = localStorage.getItem('studix_'+key); return v ? JSON.parse(v) : def; } catch { return def; }
}
function save(key, val) { try { localStorage.setItem('studix_'+key, JSON.stringify(val)); } catch {} }

let subjects = load('subjects', [
  { id: 1, name: 'Projecte 3', color: 2 },
  { id: 2, name: 'Programació Web', color: 0 },
  { id: 3, name: 'Fabricació Digital', color: 1 },
  { id: 4, name: 'Infografia', color: 3 },
  { id: 5, name: 'Iniciativa Emprenedora', color: 4 }
]);

let pacs = load('pacs', [
  // subjectId, name, dateRange, done
  {id:1,sid:1,name:'PAC 1',dateRange:'19/02 – 4/03',done:true},
  {id:2,sid:1,name:'PAC 2',dateRange:'5/03 – 27/03',done:false},
  {id:3,sid:1,name:'PR',dateRange:'30/03 – 14/05',done:false},
  {id:4,sid:1,name:'PAC 3',dateRange:'15/05 – 4/06',done:false},
  {id:5,sid:2,name:'PAC 1',dateRange:'19/02 – 4/03',done:true},
  {id:6,sid:2,name:'PAC 2',dateRange:'5/03 – 27/03',done:true},
  {id:7,sid:2,name:'PR',dateRange:'30/03 – 14/05',done:false},
  {id:8,sid:2,name:'PAC 3',dateRange:'15/05 – 4/06',done:false},
  {id:9,sid:3,name:'PAC 1',dateRange:'19/02 – 4/03',done:true},
  {id:10,sid:3,name:'PAC 2',dateRange:'5/03 – 27/03',done:true},
  {id:11,sid:3,name:'PR',dateRange:'30/03 – 14/05',done:false},
  {id:12,sid:3,name:'PAC 3',dateRange:'15/05 – 4/06',done:false},
  {id:13,sid:4,name:'PAC 1',dateRange:'19/02 – 4/03',done:true},
  {id:14,sid:4,name:'PAC 2',dateRange:'5/03 – 27/03',done:false},
  {id:15,sid:4,name:'PR',dateRange:'30/03 – 14/05',done:false},
  {id:16,sid:4,name:'PAC 3',dateRange:'15/05 – 4/06',done:false},
  {id:17,sid:5,name:'PAC 1',dateRange:'19/02 – 4/03',done:true},
  {id:18,sid:5,name:'PAC 2',dateRange:'5/03 – 27/03',done:true},
  {id:19,sid:5,name:'PR',dateRange:'30/03 – 14/05',done:false},
  {id:20,sid:5,name:'PAC 3',dateRange:'15/05 – 4/06',done:false},
]);

let tasks = load('tasks', [
  {id:1,name:'PAC 2',date:'2026-03-27',sid:1,done:false},
  {id:2,name:'PAC 3',date:'2026-04-22',sid:4,done:false},
  {id:3,name:'PR',date:'2026-05-14',sid:1,done:false},
  {id:4,name:'PAC 2',date:'2026-04-08',sid:2,done:false},
  {id:5,name:'PAC 1',date:'2026-03-04',sid:1,done:true},
  {id:6,name:'PAC 1',date:'2026-03-11',sid:4,done:true},
  {id:7,name:'PAC 2',date:'2026-03-25',sid:4,done:true},
  {id:8,name:'PAC 1',date:'2026-03-18',sid:2,done:true},
]);

let hours = load('hours', [
  {id:1,h:4,sid:1,date:'2026-04-25'},
  {id:2,h:3,sid:2,date:'2026-04-24'},
  {id:3,h:2,sid:4,date:'2026-04-23'},
  {id:4,h:3,sid:3,date:'2026-04-22'},
  {id:5,h:2,sid:5,date:'2026-04-21'},
  {id:6,h:4,sid:1,date:'2026-04-20'},
]);

let nextId = load('nextId', 100);
function newId() { nextId++; save('nextId', nextId); return nextId; }

// =================== NAVIGATION ===================
function navigate(page, el) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (el) el.classList.add('active');
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-'+page).classList.add('active');
  const titles = {dashboard:'Dashboard',assignatures:'Les Meves Assignatures',tasques:'Les Meves Tasques',hores:"Hores d'Estudi",estadistiques:'Les Meves Estadístiques'};
  document.getElementById('topbar-title').textContent = titles[page];
  renderPage(page);
}

function renderPage(page) {
  if (page === 'dashboard') renderDashboard();
  else if (page === 'assignatures') renderSubjects();
  else if (page === 'tasques') renderTasks();
  else if (page === 'hores') renderHours();
  else if (page === 'estadistiques') renderStats();
}

// =================== HELPERS ===================
function getSubject(id) { return subjects.find(s => s.id === id); }
function subjectColor(id) { const s = getSubject(id); return s ? COLORS[s.color] : '#999'; }
function subjectName(id) { const s = getSubject(id); return s ? s.name : '—'; }
function formatDate(d) {
  if (!d) return '—';
  const [y,m,day] = d.split('-');
  return `${day}/${m}/${y}`;
}
function weekHours() {
  const now = new Date(); const weekAgo = new Date(now - 7*24*3600*1000);
  return hours.filter(h => new Date(h.date) >= weekAgo).reduce((a,b) => a+b.h, 0);
}
function totalHours() { return hours.reduce((a,b) => a+b.h, 0); }
function todayHours() {
  const t = new Date().toISOString().slice(0,10);
  return hours.filter(h => h.date === t).reduce((a,b) => a+b.h, 0);
}
function subjectProgress(sid) {
  const subPacs = pacs.filter(p => p.sid === sid);
  if (!subPacs.length) return 0;
  return Math.round(subPacs.filter(p => p.done).length / subPacs.length * 100);
}
function overallProgress() {
  if (!pacs.length) return 0;
  return Math.round(pacs.filter(p => p.done).length / pacs.length * 100);
}

// =================== DASHBOARD ===================
function renderDashboard() {
  const pending = tasks.filter(t => !t.done).length;
  const done = tasks.filter(t => t.done).length;
  const progress = overallProgress();
  const wh = weekHours();

  document.getElementById('kpi-row').innerHTML = `
    <div class="kpi-card">
      <div class="kpi-label">Progrés Global</div>
      <div class="kpi-value">${progress}%</div>
      <div class="progress-bar-wrap" style="margin-top:10px"><div class="progress-bar-fill" style="width:${progress}%"></div></div>
      <div class="kpi-sub" style="margin-top:6px">${pacs.filter(p=>p.done).length} de ${pacs.length} tasques completades</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Tasques Pendents</div>
      <div class="kpi-value">${pending}</div>
      <div class="kpi-sub">${done} finalitzades · ${pending+done} total</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Hores Última Setmana</div>
      <div class="kpi-value">${wh}H</div>
      <div class="kpi-sub">${totalHours()}H total · ${todayHours()}H avui</div>
    </div>
  `;

  // Activity summary + recent activity
  const recentPacs = pacs.filter(p=>p.done).slice(-5).reverse();
  document.getElementById('dash-middle').innerHTML = `
    <div class="section-card" style="margin-bottom:0">
      <div class="section-header"><span class="section-title">Resum d'Activitat</span></div>
      ${recentPacs.length ? recentPacs.map(p => {
        const s = getSubject(p.sid);
        return `<div style="display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--border);font-size:13px">
          <div style="width:8px;height:8px;border-radius:50%;background:${s?COLORS[s.color]:'#999'};flex-shrink:0"></div>
          <span style="font-weight:500">${p.name}</span>
          <span style="color:var(--text-muted);font-size:11.5px">${s?s.name:''}</span>
          <span style="margin-left:auto;font-size:11px;color:var(--green);font-weight:600">✓</span>
        </div>`;
      }).join('') : '<div class="empty-state"><p>Sense activitat recent</p></div>'}
    </div>
    <div class="section-card" style="margin-bottom:0">
      <div class="section-header"><span class="section-title">Hores d'Estudi</span></div>
      <div style="text-align:center;padding:16px 0">
        <div style="font-family:'DM Serif Display',serif;font-size:48px;color:var(--gold);line-height:1">${wh}H</div>
        <div style="font-size:12px;color:var(--text-muted);margin-top:6px">L'última setmana</div>
      </div>
      ${renderMiniBarChart()}
    </div>
  `;

  // Upcoming tasks
  const upcoming = tasks.filter(t=>!t.done).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,5);
  document.getElementById('dash-tasks-section').innerHTML = `
    <div class="section-header"><span class="section-title">Tasques Properes</span></div>
    ${upcoming.length ? `<table class="task-table"><thead><tr><th></th><th>Tasca</th><th>Data Lliurament</th><th>Assignatura</th></tr></thead><tbody>
      ${upcoming.map(t => `<tr class="task-row">
        <td><div class="task-check" onclick="toggleTask(${t.id})"></div></td>
        <td style="font-weight:500">${t.name}</td>
        <td style="color:var(--text-muted)">${formatDate(t.date)}</td>
        <td><span class="subject-tag" style="background:${subjectColor(t.sid)}">${subjectName(t.sid)}</span></td>
      </tr>`).join('')}
    </tbody></table>` : '<div class="empty-state"><div class="empty-state-icon">✅</div><p>No hi ha tasques pendents!</p></div>'}
  `;
}

function renderMiniBarChart() {
  // last 7 days mini bars
  const days = [];
  for (let i=6;i>=0;i--) {
    const d = new Date(); d.setDate(d.getDate()-i);
    const key = d.toISOString().slice(0,10);
    const h = hours.filter(x=>x.date===key).reduce((a,b)=>a+b.h,0);
    days.push({key,h});
  }
  const max = Math.max(...days.map(d=>d.h), 1);
  return `<div style="display:flex;align-items:flex-end;gap:4px;height:40px;padding:0 4px">
    ${days.map(d=>`<div style="flex:1;background:${d.h?'var(--gold)':'var(--surface2)'};border-radius:2px 2px 0 0;height:${Math.max(d.h/max*40,2)}px" title="${d.h}h"></div>`).join('')}
  </div>`;
}

// =================== ASSIGNATURES ===================
function renderSubjects() {
  const grid = document.getElementById('subjects-grid');
  if (!subjects.length) {
    grid.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📚</div><p>Afegeix la teva primera assignatura!</p></div>';
    return;
  }
  grid.innerHTML = subjects.map(s => {
    const subPacs = pacs.filter(p => p.sid === s.id);
    const prog = subjectProgress(s.id);
    return `<div class="subject-card">
      <div class="subject-header">
        <span class="subject-name">${s.name}</span>
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:11px;font-weight:600;color:var(--gold)">${prog}%</span>
          <div class="subject-color" style="background:${COLORS[s.color]}"></div>
          <button class="btn btn-ghost btn-sm" onclick="deleteSubject(${s.id})" style="padding:2px 6px;font-size:11px">✕</button>
        </div>
      </div>
      <div style="padding:8px 16px 4px">
        <div class="progress-bar-wrap"><div class="progress-bar-fill" style="width:${prog}%"></div></div>
      </div>
      <div class="subject-body">
        ${subPacs.length ? subPacs.map(p => `
          <div class="pac-item">
            <div>
              <div class="pac-name">${p.name}</div>
              <div class="pac-date">${p.dateRange}</div>
            </div>
            <div class="pac-check ${p.done ? 'done' : ''}" onclick="togglePac(${p.id})"></div>
          </div>
        `).join('') : `<div style="font-size:12.5px;color:var(--text-muted);text-align:center;padding:12px">Sense PACs registrades</div>`}
        <div style="margin-top:10px;padding-top:8px;border-top:1px dashed var(--border);display:flex;gap:6px">
          <input type="text" class="form-input" placeholder="Nova PAC" id="new-pac-${s.id}" style="font-size:12px;padding:4px 8px;flex:1">
          <input type="text" class="form-input" placeholder="5/03 – 27/03" id="new-pac-date-${s.id}" style="font-size:12px;padding:4px 8px;width:120px">
          <button class="btn btn-primary btn-sm" onclick="addPac(${s.id})">+</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

function addPac(sid) {
  const nameEl = document.getElementById('new-pac-'+sid);
  const dateEl = document.getElementById('new-pac-date-'+sid);
  const name = nameEl.value.trim();
  if (!name) { toast('Introdueix el nom de la PAC'); return; }
  const dateRange = dateEl.value.trim() || '—';
  const id = newId();

  // Parse end date from dateRange (format "DD/MM – DD/MM" or "DD/MM/YY – DD/MM/YY")
  // Try to extract the last date segment after "–" or "—"
  let taskDate = '';
  const parts = dateRange.split(/[–—]/);
  if (parts.length >= 2) {
    const raw = parts[parts.length - 1].trim(); // e.g. "27/03" or "4/06"
    const segments = raw.split('/');
    if (segments.length >= 2) {
      const day = segments[0].padStart(2,'0');
      const month = segments[1].padStart(2,'0');
      const year = segments[2] ? (segments[2].length === 2 ? '20'+segments[2] : segments[2]) : new Date().getFullYear();
      taskDate = `${year}-${month}-${day}`;
    }
  }
  if (!taskDate) taskDate = new Date().toISOString().slice(0,10);

  pacs.push({ id, sid, name, dateRange, done: false, taskId: id+1000 });
  tasks.push({ id: id+1000, name, date: taskDate, sid, done: false, pacId: id });
  save('pacs', pacs);
  save('tasks', tasks);
  nameEl.value = '';
  dateEl.value = '';
  renderSubjects();
  toast('PAC afegida!');
}

function togglePac(id) {
  const p = pacs.find(x => x.id === id);
  if (!p) return;
  p.done = !p.done;
  // Sync linked task if exists
  if (p.taskId) {
    const t = tasks.find(x => x.id === p.taskId);
    if (t) t.done = p.done;
  }
  save('pacs', pacs);
  save('tasks', tasks);
  renderSubjects();
}

function deleteSubject(id) {
  if (!confirm('Eliminar aquesta assignatura i totes les seves PACs?')) return;
  subjects = subjects.filter(s => s.id !== id);
  pacs = pacs.filter(p => p.sid !== id);
  tasks = tasks.filter(t => t.sid !== id);
  hours = hours.filter(h => h.sid !== id);
  save('subjects', subjects); save('pacs', pacs); save('tasks', tasks); save('hours', hours);
  renderSubjects();
  toast('Assignatura eliminada');
}

function addSubject() {
  const name = document.getElementById('subj-name').value.trim();
  if (!name) { toast('Introdueix un nom'); return; }
  const color = parseInt(document.getElementById('subj-color').value);
  subjects.push({ id: newId(), name, color });
  save('subjects', subjects);
  closeModal('modal-add-subject');
  document.getElementById('subj-name').value = '';
  renderSubjects();
  toast('Assignatura creada!');
}

// =================== TASQUES ===================
function renderTasks() {
  populateSubjectSelect('task-subject');
  const pending = tasks.filter(t => !t.done).sort((a,b) => a.date.localeCompare(b.date));
  const done = tasks.filter(t => t.done).sort((a,b) => b.date.localeCompare(a.date));

  document.getElementById('tasks-pending-table').innerHTML = pending.length
    ? `<table class="task-table"><thead><tr><th></th><th>Tasca</th><th>Data Lliurament</th><th>Assignatura</th><th></th></tr></thead><tbody>
        ${pending.map(t => `<tr class="task-row">
          <td><div class="task-check" onclick="toggleTask(${t.id})"></div></td>
          <td style="font-weight:500">${t.name}</td>
          <td>${formatDate(t.date)}</td>
          <td><span class="subject-tag" style="background:${subjectColor(t.sid)}">${subjectName(t.sid)}</span></td>
          <td><button class="btn btn-danger btn-sm" onclick="deleteTask(${t.id})">✕</button></td>
        </tr>`).join('')}
      </tbody></table>`
    : '<div class="empty-state"><div class="empty-state-icon">✅</div><p>No hi ha tasques pendents!</p></div>';

  document.getElementById('tasks-done-table').innerHTML = done.length
    ? `<table class="task-table"><thead><tr><th></th><th>Tasca</th><th>Data Lliurament</th><th>Assignatura</th><th></th></tr></thead><tbody>
        ${done.map(t => `<tr class="task-row done">
          <td><div class="task-check done" onclick="toggleTask(${t.id})"></div></td>
          <td style="font-weight:500" class="task-name-done">${t.name}</td>
          <td>${formatDate(t.date)}</td>
          <td><span class="subject-tag" style="background:${subjectColor(t.sid)}">${subjectName(t.sid)}</span></td>
          <td><button class="btn btn-danger btn-sm" onclick="deleteTask(${t.id})">✕</button></td>
        </tr>`).join('')}
      </tbody></table>`
    : '<div class="empty-state"><p>Sense tasques finalitzades</p></div>';
}

function toggleTask(id) {
  const t = tasks.find(x => x.id === id);
  if (!t) return;
  t.done = !t.done;
  // Sync linked pac if exists
  if (t.pacId) {
    const p = pacs.find(x => x.id === t.pacId);
    if (p) p.done = t.done;
  }
  save('tasks', tasks);
  save('pacs', pacs);
  renderTasks();
}

function deleteTask(id) {
  const t = tasks.find(x => x.id === id);
  // Also remove linked pac
  if (t && t.pacId) pacs = pacs.filter(p => p.id !== t.pacId);
  tasks = tasks.filter(t => t.id !== id);
  save('tasks', tasks);
  save('pacs', pacs);
  renderTasks();
  toast('Tasca eliminada');
}

function addTask() {
  const name = document.getElementById('task-name').value.trim();
  const date = document.getElementById('task-date').value;
  const sid = parseInt(document.getElementById('task-subject').value);
  if (!name || !date || !sid) { toast('Omple tots els camps'); return; }
  const id = newId();
  const pacId = id + 2000;

  // Format date as "DD/MM" for dateRange display
  const [y, m, d] = date.split('-');
  const dateRange = `${d}/${m}/${y}`;

  tasks.push({ id, name, date, sid, done: false, pacId });
  pacs.push({ id: pacId, sid, name, dateRange, done: false, taskId: id });
  save('tasks', tasks);
  save('pacs', pacs);
  closeModal('modal-add-task');
  document.getElementById('task-name').value = '';
  document.getElementById('task-date').value = '';
  renderTasks();
  toast('Tasca creada!');
}

// =================== HORES ===================
function renderHours() {
  populateSubjectSelect('inp-hours-subject');
  if (!document.getElementById('inp-hours-date').value) {
    document.getElementById('inp-hours-date').value = new Date().toISOString().slice(0,10);
  }
  const sorted = [...hours].sort((a,b) => b.date.localeCompare(a.date));
  const log = document.getElementById('hours-log');
  log.innerHTML = sorted.length ? `<div class="hours-log">${sorted.map(h => `
    <div class="hours-log-item">
      <div class="hours-info">
        <div class="hours-count">${h.h}h</div>
        <div>
          <div style="font-weight:500;font-size:13px">${subjectName(h.sid)}</div>
          <div class="hours-date">${formatDate(h.date)}</div>
        </div>
      </div>
      <button class="btn btn-danger btn-sm" onclick="deleteHours(${h.id})">✕</button>
    </div>
  `).join('')}</div>` : '<div class="empty-state"><div class="empty-state-icon">⏱️</div><p>Registra les teves primeres hores!</p></div>';
}

function addHours() {
  const h = parseFloat(document.getElementById('inp-hours').value);
  const sid = parseInt(document.getElementById('inp-hours-subject').value);
  const date = document.getElementById('inp-hours-date').value;
  if (!h || h <= 0 || !sid || !date) { toast('Omple tots els camps'); return; }
  hours.push({ id: newId(), h, sid, date });
  save('hours', hours);
  document.getElementById('inp-hours').value = '';
  renderHours();
  toast(`${h}h registrades!`);
}

function deleteHours(id) {
  hours = hours.filter(h => h.id !== id);
  save('hours', hours);
  renderHours();
}

// =================== ESTADISTIQUES ===================
function renderStats() {
  const wh = weekHours(); const th = totalHours(); const td = todayHours();
  document.getElementById('stats-kpi-row').innerHTML = `
    <div class="stats-kpi">
      <div class="stats-kpi-icon">📅</div>
      <div class="stats-kpi-val">${wh}H</div>
      <div class="stats-kpi-label">Última setmana</div>
    </div>
    <div class="stats-kpi">
      <div class="stats-kpi-icon">📈</div>
      <div class="stats-kpi-val">${th}H</div>
      <div class="stats-kpi-label">Total registrades</div>
    </div>
    <div class="stats-kpi">
      <div class="stats-kpi-icon">😊</div>
      <div class="stats-kpi-val">${td}H</div>
      <div class="stats-kpi-label">Avui</div>
    </div>
  `;

  // Monthly bar chart
  const months = ['Gen','Feb','Mar','Abr','Mai','Jun','Jul','Ago','Set','Oct','Nov','Des'];
  const monthData = Array(12).fill(0);
  hours.forEach(h => { const m = parseInt(h.date.split('-')[1])-1; monthData[m] += h.h; });
  const now = new Date(); const cm = now.getMonth();
  const displayMonths = [];
  for (let i=3;i>=0;i--) { const m = (cm-i+12)%12; displayMonths.push({label:months[m],val:monthData[m]}); }
  const maxH = Math.max(...displayMonths.map(d=>d.val), 1);
  document.getElementById('bar-chart-months').innerHTML = displayMonths.map(d => `
    <div class="bar-group">
      <div class="bar-val">${d.val}h</div>
      <div class="bar" style="height:${Math.max(d.val/maxH*120,4)}px;background:${d.val?'var(--gold)':'var(--surface2)'}"></div>
      <div class="bar-label">${d.label}</div>
    </div>
  `).join('');

  // Subject progress
  document.getElementById('subject-progress-list').innerHTML = subjects.map(s => {
    const prog = subjectProgress(s.id);
    return `<div class="subject-prog-item">
      <div class="subject-prog-name">
        <span>${s.name}</span>
        <span class="subject-prog-pct">${prog}%</span>
      </div>
      <div class="progress-bar-wrap"><div class="progress-bar-fill" style="width:${prog}%;background:${COLORS[s.color]}"></div></div>
    </div>`;
  }).join('') || '<div class="empty-state"><p>Sense assignatures</p></div>';
}

// =================== UTILS ===================
function populateSubjectSelect(id) {
  const sel = document.getElementById(id);
  if (!sel) return;
  sel.innerHTML = subjects.length
    ? subjects.map(s => `<option value="${s.id}">${s.name}</option>`).join('')
    : '<option value="">—Cap assignatura—</option>';
}

function openModal(id) {
  populateSubjectSelect('task-subject');
  document.getElementById(id).classList.add('open');
}
function closeModal(id, e) {
  if (e && e.target !== document.getElementById(id)) return;
  document.getElementById(id).classList.remove('open');
}

let toastTimer;
function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg; el.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
}

// =================== INIT ===================
function init() {
  const now = new Date();
  const days = ['Diumenge','Dilluns','Dimarts','Dimecres','Dijous','Divendres','Dissabte'];
  const months = ['Gener','Febrer','Març','Abril','Maig','Juny','Juliol','Agost','Setembre','Octubre','Novembre','Desembre'];
  document.getElementById('date-display').textContent = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  renderDashboard();
}
init();
