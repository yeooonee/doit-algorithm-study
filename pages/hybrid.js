(() => {
'use strict';

const REPO   = 'seoyeonDev/doit-algorithm-study';
const BRANCH = 'main';
const GH_RAW = `https://raw.githubusercontent.com/${REPO}/${BRANCH}`;
const GH_URL = `https://github.com/${REPO}`;

// Members (fixed, based on repo)
const MEMBERS = [
  { name: '김혜원', color: '#4a8a5c', aliases: ['haeburney', 'hyewon'] },
  { name: '이서연', color: '#c96442', aliases: ['seoyeondev', 'sylee'] },
];

function memberByGitHub(ghName) {
  const lower = ghName.toLowerCase();
  return MEMBERS.find(m => m.aliases.some(a => lower.includes(a)))
    || { name: ghName, color: '#a39681' };
}
const _mCache = {};
function memberOf(filename) {
  const base = filename.replace(/\.[^.]+$/, '');
  if (!_mCache[base]) {
    const matched = MEMBERS.find(m => base.includes(m.name));
    _mCache[base] = matched || { name: base, color: '#a39681' };
  }
  return _mCache[base];
}

const FOLDER_DESC = {
  problem:  '주차 문제 파일 (.md)',
  summary:  '스터디원 요약 노트 (.md)',
  practice: '연습 코드 (.py)',
  solved:   '제출 풀이 코드 (.py)',
};

const ICONS = {
  folder: `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M3 5.5C3 4.67 3.67 4 4.5 4h4.2c.4 0 .78.16 1.06.44L11.3 5.6c.28.28.66.44 1.06.44h7.14C20.33 6.04 21 6.7 21 7.54v10.92c0 .83-.67 1.5-1.5 1.5h-15A1.5 1.5 0 013 18.46V5.5z"/></svg>`,
  folderOpen: `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M3 5.5C3 4.67 3.67 4 4.5 4h4.2c.4 0 .78.16 1.06.44L11.3 5.6c.28.28.66.44 1.06.44h7.14C20.33 6.04 21 6.7 21 7.54V9H3V5.5zM3 10h18l-1.7 8.8c-.14.7-.76 1.2-1.47 1.2H6.17c-.71 0-1.33-.5-1.47-1.2L3 10z"/></svg>`,
  md: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 15V9l2.5 3L12 9v6M15 9v6m0 0l2-2m-2 2l-2-2"/></svg>`,
  py: `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M11.5 2C9 2 7 2.6 7 5v3h5v1H5.5C3.6 9 3 11 3 13.5S3.6 18 5.5 18H7v-3c0-1.9 1.6-3.5 3.5-3.5h4c1.4 0 2.5-1.1 2.5-2.5V5c0-2.4-2-3-5-3h-.5zm-1.5 2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z" opacity=".85"/><path d="M12.5 22C15 22 17 21.4 17 19v-3h-5v-1h6.5C20.4 15 21 13 21 10.5S20.4 6 18.5 6H17v3c0 1.9-1.6 3.5-3.5 3.5h-4C8.1 12.5 7 13.6 7 15v4c0 2.4 2 3 5 3h.5zm1.5-2c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" opacity=".5"/></svg>`,
  file: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9l-6-6z"/><path d="M14 3v6h6"/></svg>`,
};

function fileIcon(name) {
  if (name.endsWith('.md'))  return ICONS.md;
  if (name.endsWith('.py'))  return ICONS.py;
  return ICONS.file;
}

function ghApi(p) { return `/api/github?path=${encodeURIComponent(p)}`; }
function weekDir(n) { return `week${String(n).padStart(2,'0')}`; }
function weekNum(w) { return parseInt(w.num.replace('W','')); }

// ── data ──
let _weeks = null;
async function getWeeks() {
  if (_weeks) return _weeks;
  _weeks = await fetch('/pages/weeks.json').then(r => r.json());
  return _weeks;
}

let _fileCache    = {};
let _activityCache = null;
async function getFiles(num, folder) {
  const key = `${num}:${folder}`;
  if (_fileCache[key]) return _fileCache[key];
  const dir = weekDir(num);
  try {
    const res = await fetch(ghApi(`repos/${REPO}/contents/${dir}/${folder}?ref=${BRANCH}`));
    if (!res.ok) { _fileCache[key] = []; return []; }
    const data = await res.json();
    _fileCache[key] = Array.isArray(data)
      ? data.filter(f => f.type === 'file' && f.name !== '.gitkeep')
      : [];
  } catch { _fileCache[key] = []; }
  return _fileCache[key];
}

function computeStatus(weeks, year) {
  const today = new Date(); today.setHours(0,0,0,0);
  const dates = weeks.map(w => { const [m,d] = w.date.split('/'); return new Date(year, +m-1, +d); });
  let ci = -1;
  for (let i = 0; i < dates.length; i++) {
    const start = i === 0 ? new Date(0) : new Date(dates[i-1].getTime() + 86400000);
    if (today >= start && today <= dates[i]) { ci = i; break; }
  }
  if (ci < 0) return weeks.map(w => ({ ...w, status: 'done' }));
  return weeks.map((w,i) => ({ ...w, status: i < ci ? 'done' : i === ci ? 'current' : 'upcoming' }));
}

// ── routing ──
let route = decodeURIComponent(location.hash.replace(/^#/,'') || 'home');

function go(r) {
  route = r;
  location.hash = encodeURIComponent(r);
  render();
}

function parseRoute(r) {
  const parts = r.split(':');
  return {
    view:   parts[0],
    num:    parts[1] ? parseInt(parts[1]) : null,
    folder: parts[2] || null,
    file:   parts.slice(3).join(':') || null,
  };
}

// ── strip ──
function renderStrip(computed) {
  const done  = computed.filter(w => w.status === 'done').length;
  const total = computed.length;
  document.getElementById('stripPct').textContent = `${Math.round(done/total*100)}%`;
  document.getElementById('stripTrack').style.gridTemplateColumns = `repeat(${total},1fr)`;
  document.getElementById('stripTrack').innerHTML = computed.map(w => {
    const n = weekNum(w);
    const isDone = w.status === 'done';
    const isNow  = w.status === 'current';
    return `<div class="strip-cell ${isDone?'done':''} ${isNow?'now':''}" data-phase="${w.phase}" data-num="${n}" title="${w.num} — ${w.title}">
      <div class="strip-bar"></div>
      <div class="strip-num">${n}</div>
    </div>`;
  }).join('');
  document.getElementById('stripTrack').querySelectorAll('.strip-cell').forEach(el => {
    el.onclick = () => go('week:' + el.dataset.num);
  });
}

// ── time-ago ──
function timeAgo(d) {
  const s = Math.floor((Date.now() - d) / 1000);
  if (s < 3600)   return `${Math.floor(s/60)}분 전`;
  if (s < 86400)  return `${Math.floor(s/3600)}시간 전`;
  if (s < 172800) return '어제';
  if (s < 604800) return `${Math.floor(s/86400)}일 전`;
  return `${Math.floor(s/604800)}주 전`;
}

const FOLDER_ACTION = {
  summary:  '요약 제출',
  solved:   '풀이 제출',
  problem:  '문제 업로드',
  practice: '연습 코드',
};

function folderLabel(ww, folder) {
  const action = FOLDER_ACTION[folder] || folder;
  return `W${ww} ${action}`;
}

// ── recent activity (GitHub commits) ──
async function fetchActivity() {
  if (_activityCache) return _activityCache;
  try {
    const res = await fetch(ghApi(`repos/${REPO}/commits?ref=${BRANCH}&per_page=60`));
    if (!res.ok) return [];
    const list = await res.json();
    if (!Array.isArray(list)) return [];

    const seen  = new Set();
    const items = [];
    for (const c of list) {
      if (items.length >= 7) break;
      const msg  = c.commit.message.split('\n')[0];
      const date = new Date(c.commit.author.date);

      // PR merge: "Merge pull request #N from owner/summary/week01/이름"
      const prBranch = msg.match(/from [^/]+\/(summary|solve(?:d)?|practice|problem)\/week(\d{2})\/(.+)/i);
      if (prBranch) {
        const folder = prBranch[1] === 'solve' ? 'solved' : prBranch[1];
        const ww     = prBranch[2];
        const num    = parseInt(ww);
        const mStr   = prBranch[3];
        const m      = MEMBERS.find(x => mStr.includes(x.name)) || memberByGitHub(mStr);
        const key    = `${ww}:${folder}`;
        if (!seen.has(key)) {
          seen.add(key);
          items.push({
            date,
            route: `folder:${num}:${folder}`,
            label: folderLabel(ww, folder),
            path:  `week${ww}/${folder}/`,
            icon:  ['summary','problem'].includes(folder) ? 'md' : 'py',
            member: m,
          });
        }
        continue;
      }

      // Direct path in message: weekNN/folder/file.ext
      const pathInMsg = msg.match(/week(\d{1,2})\/(summary|solved|practice|problem)\/([^\s,;]+)/i);
      if (pathInMsg) {
        const ww     = String(parseInt(pathInMsg[1])).padStart(2,'0');
        const folder = pathInMsg[2];
        const file   = pathInMsg[3];
        const num    = parseInt(ww);
        const m      = memberOf(file);
        const key    = `${ww}:${folder}`;
        if (!seen.has(key)) {
          seen.add(key);
          items.push({
            date,
            route: `file:${num}:${folder}:${file}`,
            label: `W${ww} ${FOLDER_ACTION[folder] || folder} — ${file.replace(/\.[^.]+$/, '')}`,
            path:  `week${ww}/${folder}/${file}`,
            icon:  file.endsWith('.py') ? 'py' : 'md',
            member: m,
          });
        }
        continue;
      }

      // docs:/solve: prefix with path hint
      const prefixPath = msg.match(/^(?:docs|solve|fix|chore):\s*(.+)/i);
      if (prefixPath) {
        const hint   = prefixPath[1].trim();
        const wMatch = hint.match(/week(\d{1,2})/i);
        if (wMatch) {
          const num  = parseInt(wMatch[1]);
          const ww   = String(num).padStart(2,'0');
          const ghName = c.commit.author.name;
          const m    = MEMBERS.find(x => ghName.includes(x.name)) || memberByGitHub(ghName);
          items.push({
            date,
            route: `week:${num}`,
            label: hint,
            path:  `week${ww}/`,
            icon:  'md',
            member: m,
          });
        }
      }
    }
    _activityCache = items;
    return items;
  } catch { return []; }
}

function renderCrumb(r) {
  const c = document.getElementById('crumb');
  const parts = r.split(':');
  const a = (label, goRoute) => `<a data-go="${goRoute}">${label}</a>`;
  const sep = `<span class="sep">/</span>`;
  const here = label => `<span class="here">${label}</span>`;

  if (r === 'home')       { c.innerHTML = here('홈'); return; }
  if (r === 'curriculum') { c.innerHTML = a('홈','home') + sep + here('커리큘럼'); c.querySelectorAll('[data-go]').forEach(el=>el.onclick=e=>{e.preventDefault();go(el.dataset.go);}); return; }
  if (r === 'problems')   { c.innerHTML = a('홈','home') + sep + here('문제 모음'); c.querySelectorAll('[data-go]').forEach(el=>el.onclick=e=>{e.preventDefault();go(el.dataset.go);}); return; }

  if (parts[0] === 'week') {
    c.innerHTML = a('홈','home') + sep + here(`week${String(parts[1]).padStart(2,'0')}`);
  } else if (parts[0] === 'folder') {
    c.innerHTML = a('홈','home') + sep + a(`week${String(parts[1]).padStart(2,'0')}`, `week:${parts[1]}`) + sep + here(parts[2]);
  } else if (parts[0] === 'file') {
    c.innerHTML = a('홈','home') + sep + a(`week${String(parts[1]).padStart(2,'0')}`,`week:${parts[1]}`) + sep + a(parts[2],`folder:${parts[1]}:${parts[2]}`) + sep + here(parts[3]);
  }
  c.querySelectorAll('[data-go]').forEach(el => el.onclick = e => { e.preventDefault(); go(el.dataset.go); });
}

// ── sidebar ──
async function renderSide(r, computed) {
  const side = document.getElementById('side');
  const p = parseRoute(r);

  let openFiles = [];
  if (p.num && p.folder) {
    openFiles = await getFiles(p.num, p.folder);
  }

  let totalFiles = 0;
  computed.forEach(w => {
    const n = weekNum(w);
    Object.keys(FOLDER_DESC).forEach(fn => {
      const key = `${n}:${fn}`;
      if (_fileCache[key]) totalFiles += _fileCache[key].length;
    });
  });

  const PAGES = [
    { route: 'home',       label: '홈' },
    { route: 'curriculum', label: '커리큘럼' },
    { route: 'problems',   label: '문제 모음' },
  ];

  let html = `
    <div class="side-section">PAGES <span class="count">${PAGES.length}</span></div>
    <div class="tree">
      ${PAGES.map(pg => `
        <div class="row pageRow ${r===pg.route?'on':''}" data-route="${pg.route}">
          <span class="chev"></span>
          <span class="icon">${ICONS.file}</span>
          <span class="name">${pg.label}</span>
        </div>`).join('')}
    </div>
    <div class="side-section">WEEKS ${totalFiles ? `<span class="count">${totalFiles} FILES</span>` : ''}</div>
    <div class="tree">`;

  computed.forEach(w => {
    const n = weekNum(w);
    const isOpen   = p.num === n && r !== 'home';
    const isOnWeek = r === `week:${n}`;

    html += `
      <div class="row weekRow ${isOpen?'open':''} ${isOnWeek?'on':''}" data-num="${n}" data-phase="${w.phase}">
        <span class="chev">▸</span>
        <span class="dot"></span>
        <span class="icon">${isOpen ? ICONS.folderOpen : ICONS.folder}</span>
        <span class="name"><span class="num">${String(n).padStart(2,'0')}</span>${w.title.replace(/🎉\s*/,'')}</span>
      </div>
      <div class="children">
        ${Object.keys(FOLDER_DESC).map(fn => {
          const folderRoute  = `folder:${n}:${fn}`;
          const isFolderOpen = r === folderRoute || r.startsWith(`file:${n}:${fn}:`);
          const isFolderOn   = r === folderRoute;
          const activeFile   = r.startsWith(`file:${n}:${fn}:`) ? r.split(':').slice(3).join(':') : null;
          const cachedCount  = (_fileCache[`${n}:${fn}`] || []).length;

          let filesHtml = '';
          if (isFolderOpen && openFiles.length > 0) {
            filesHtml = `<div class="children">
              ${openFiles.map(f => `
                <div class="row l3 fileRow ${f.name === activeFile ? 'on' : ''}" data-num="${n}" data-folder="${fn}" data-name="${f.name}">
                  <span class="chev"></span>
                  <span class="icon">${fileIcon(f.name)}</span>
                  <span class="name">${f.name}</span>
                </div>`).join('')}
            </div>`;
          } else if (isFolderOpen && openFiles.length === 0) {
            filesHtml = `<div class="children">
              <div class="row l3" style="color:var(--mute);pointer-events:none">
                <span class="chev"></span><span class="name">비어 있음</span>
              </div>
            </div>`;
          }

          return `
            <div class="row l2 folderRow ${isFolderOpen?'open':''} ${isFolderOn?'on':''}" data-num="${n}" data-folder="${fn}">
              <span class="chev">▸</span>
              <span class="icon">${isFolderOpen ? ICONS.folderOpen : ICONS.folder}</span>
              <span class="name">${fn}</span>
              ${cachedCount ? `<span class="badge">${cachedCount}</span>` : ''}
            </div>
            ${filesHtml}`;
        }).join('')}
      </div>`;
  });

  html += '</div>';
  side.innerHTML = html;

  side.querySelectorAll('.pageRow').forEach(el => el.onclick = () => go(el.dataset.route));
  side.querySelectorAll('.weekRow').forEach(el => el.onclick = () => go('week:' + el.dataset.num));
  side.querySelectorAll('.folderRow').forEach(el => el.onclick = e => {
    e.stopPropagation();
    go(`folder:${el.dataset.num}:${el.dataset.folder}`);
  });
  side.querySelectorAll('.fileRow').forEach(el => el.onclick = e => {
    e.stopPropagation();
    go(`file:${el.dataset.num}:${el.dataset.folder}:${el.dataset.name}`);
  });
}

// ── pages ──
async function renderHome(computed) {
  const done = computed.filter(w => w.status === 'done').length;
  const cur  = computed.find(w => w.status === 'current');

  document.getElementById('main').innerHTML = `
    <div class="pagehead">
      <div>
        <h1>Do it! 자료구조와 함께 배우는 알고리즘 입문</h1>
        <div class="lede">매주 목요일 20:00, 2명이 함께 읽고, 요약하고, 문제를 풉니다.
        이 사이트는 그 기록을 주차별 폴더로 정리해 둔 곳입니다.</div>
      </div>
      <div class="meta">
        <span class="pill"><span class="dot"></span>${cur ? cur.num + '주차 진행 중' : '완료'}</span>
        <span class="pill" style="font-family:var(--mono)">2026.04 → 2026.08</span>
      </div>
    </div>
    <div class="grid-3">
      <div class="card now">
        <div class="k">This week</div>
        <div class="v">${cur ? `<span class="wk">${cur.num}</span>${cur.title.replace(/🎉\s*/,'')}` : '—'}</div>
        <div class="sub">${cur ? `${cur.chapter} · ${cur.date} 목` : '스터디 완료'}</div>
      </div>
      <div class="card">
        <div class="k">Curriculum</div>
        <div class="v">${done}<span style="font-size:18px;color:var(--mute);font-weight:500">/${computed.length}</span></div>
        <div class="sub">${computed.length - done}주 남음</div>
        <div class="bar"><div style="width:${(done/computed.length*100).toFixed(1)}%"></div></div>
      </div>
      <div class="card">
        <div class="k">Members</div>
        <div class="v">2</div>
        <div class="sub">${MEMBERS.map(m=>`<span class="avatar pill" style="background:${m.color}">${m.name}</span>`).join(' ')}</div>
      </div>
    </div>
    <h2 class="sec">Recent activity</h2>
    <div id="activityArea"><div class="loading" style="padding:20px 0;font-size:12px">불러오는 중…</div></div>
    <h2 class="sec">All weeks</h2>
    <div class="folder-grid" style="grid-template-columns:repeat(3,1fr)">
      ${computed.map(w => {
        const n = weekNum(w);
        const past = w.status === 'done';
        const now  = w.status === 'current';
        const fileCount = Object.keys(FOLDER_DESC).reduce((s,fn) => s + ((_fileCache[`${n}:${fn}`]||[]).length), 0);
        const statusSuffix = now ? ' · 이번 주' : past ? '' : ' · 예정';
        return `<div class="folder-card" data-go="week:${n}" style="opacity:${past||now?1:.5}">
          <div class="fh">
            <span class="icon">${ICONS.folder}</span>
            <span class="name">${weekDir(n)}</span>
            ${fileCount ? `<span class="count">${fileCount} files</span>` : ''}
          </div>
          <div style="font-size:13px;color:var(--ink);font-weight:500;margin-bottom:2px">${w.title}</div>
          <div style="font-size:11px;color:var(--mute);font-family:var(--mono)">${w.chapter.split(' · ')[0]} · ${w.date}${statusSuffix}</div>
        </div>`;
      }).join('')}
    </div>`;
  bindGo();

  const activities = await fetchActivity();
  const area = document.getElementById('activityArea');
  if (!area) return;
  if (!activities.length) {
    area.innerHTML = `<div style="color:var(--mute);font-family:var(--mono);font-size:12px;padding:12px 0">최근 활동을 불러올 수 없습니다.</div>`;
    return;
  }
  area.innerHTML = `<div class="feed">
    ${activities.map(a => `
      <div class="feed-row" data-go="${a.route}">
        <div class="when">${timeAgo(a.date)}</div>
        <div class="what">
          <span class="icon">${a.icon === 'py' ? ICONS.py : ICONS.md}</span>
          <span class="ttl">${a.label}</span>
          <span class="path">${a.path}</span>
        </div>
        <div class="by">
          <span class="avatar" style="background:${a.member.color}">${a.member.name[0]}</span>
          ${a.member.name}
        </div>
      </div>`).join('')}
  </div>`;
  area.querySelectorAll('[data-go]').forEach(el => {
    el.onclick = e => { e.preventDefault(); go(el.dataset.go); };
  });
}

function renderCurriculum(computed) {
  document.getElementById('main').innerHTML = `
    <div class="pagehead">
      <div><h1>커리큘럼</h1><div class="lede">18주 전체 일정. 주차를 클릭하면 해당 주로 이동합니다.</div></div>
    </div>
    <div class="folder-grid" style="grid-template-columns:repeat(3,1fr)">
      ${computed.map(w => {
        const n = weekNum(w);
        const past = w.status === 'done', now = w.status === 'current';
        return `<div class="folder-card" data-go="week:${n}" style="opacity:${past||now?1:.5}">
          <div class="fh"><span class="icon">${ICONS.folder}</span><span class="name">${weekDir(n)}</span></div>
          <div style="font-size:12.5px;color:var(--ink);font-weight:500;margin-bottom:2px">${w.title}</div>
          <div style="font-size:11px;color:var(--mute);font-family:var(--mono)">${w.date}${now?' · 이번 주':''}</div>
        </div>`;
      }).join('')}
    </div>`;
  bindGo();
}

function renderProblems(computed) {
  document.getElementById('main').innerHTML = `
    <div class="pagehead">
      <div><h1>문제 모음</h1><div class="lede">주차별 solved/ 폴더에서 제출 풀이를 확인할 수 있습니다.</div></div>
    </div>
    <div class="feed">
      ${computed.filter(w => w.status === 'done' || w.status === 'current').map(w => {
        const n = weekNum(w);
        const cached = _fileCache[`${n}:solved`] || [];
        if (!cached.length) return '';
        return cached.map(f => `<div class="feed-row" data-go="file:${n}:solved:${f.name}">
          <div class="when">${weekDir(n)}</div>
          <div class="what"><span class="icon">${ICONS.py}</span><span class="ttl">${f.name.replace(/\.py$/,'')}</span><span class="path">${weekDir(n)}/solved/${f.name}</span></div>
          <div class="by"><span class="avatar" style="background:${memberOf(f.name).color}">${memberOf(f.name).name[0]}</span>${memberOf(f.name).name}</div>
        </div>`).join('');
      }).join('')||'<div style="padding:32px;text-align:center;color:var(--mute);font-family:var(--mono);font-size:13px">먼저 주차를 방문하면 파일 목록이 로드됩니다.</div>'}
    </div>`;
  bindGo();
}

async function renderWeek(num, computed) {
  const w = computed.find(x => weekNum(x) === num);
  if (!w) { renderHome(computed); return; }

  const [p, s, pr, so] = await Promise.all([
    getFiles(num, 'problem'),
    getFiles(num, 'summary'),
    getFiles(num, 'practice'),
    getFiles(num, 'solved'),
  ]);

  const folderFiles = { problem: p, summary: s, practice: pr, solved: so };
  const past = w.status === 'done';
  const now  = w.status === 'current';
  const statusLabel = now ? '이번 주' : past ? '완료' : '예정';

  document.getElementById('main').innerHTML = `
    <div class="pagehead">
      <div class="wk-head">
        <div class="wk-num">W<b>${String(num).padStart(2,'0')}</b><span class="date">${w.date} 목</span></div>
        <div>
          <h1 style="margin-top:4px">${w.title}</h1>
          <div class="lede">${w.desc}</div>
          <div class="wk-tags">
            <span class="wk-tag">${w.chapter}</span>
            ${(w.tags||[]).map(t=>`<span class="wk-tag">#${t}</span>`).join('')}
          </div>
        </div>
      </div>
      <div class="meta">
        <span class="pill"><span class="dot" style="background:var(--${now?'accent':past?'ok':'mute'})"></span>${statusLabel}</span>
      </div>
    </div>
    <h2 class="sec">${weekDir(num)}/ &nbsp;contents</h2>
    <div class="folder-grid">
      ${Object.keys(FOLDER_DESC).map(fn => {
        const list = folderFiles[fn];
        return `<div class="folder-card" data-go="folder:${num}:${fn}">
          <div class="fh">
            <span class="icon">${ICONS.folder}</span>
            <span class="name">${fn}/</span>
            <span class="count">${list.length} 파일</span>
          </div>
          <div style="font-size:12px;color:var(--ink-3);margin:2px 0 10px">${FOLDER_DESC[fn]}</div>
          <ul>
            ${list.slice(0,4).map(f=>`<li><span class="fi">${fileIcon(f.name)}</span><span class="fn">${f.name}</span></li>`).join('') || '<li style="color:var(--mute)"><span class="fi"></span>아직 비어 있음</li>'}
            ${list.length > 4 ? `<li style="color:var(--mute)"><span class="fi"></span>+${list.length-4} more…</li>` : ''}
          </ul>
        </div>`;
      }).join('')}
    </div>`;
  bindGo();
}

async function renderFolder(num, folderName, computed) {
  const w = computed.find(x => weekNum(x) === num);
  if (!w) { renderHome(computed); return; }

  document.getElementById('main').innerHTML = `<div class="loading">불러오는 중…</div>`;
  const files = await getFiles(num, folderName);
  const dir   = weekDir(num);

  document.getElementById('main').innerHTML = `
    <div class="pagehead">
      <div>
        <h1 style="font-family:var(--mono);font-size:22px">${dir} / ${folderName}/</h1>
        <div class="lede">${w.title} — ${FOLDER_DESC[folderName] || folderName} (${files.length}개)</div>
      </div>
    </div>
    ${files.length === 0
      ? `<div class="empty">아직 파일이 없습니다.</div>`
      : `<div class="feed">
          ${files.map(f => {
            const ext = f.name.split('.').pop();
            const nameNoExt = f.name.slice(0, -(ext.length+1));
            const isMd = ext === 'md';
            const clickRoute = `file:${num}:${folderName}:${f.name}`;
            const m = memberOf(f.name);
            return `<div class="feed-row" ${clickRoute ? `data-go="${clickRoute}"` : ``}>
              <div class="when" style="font-family:var(--mono);text-transform:uppercase">.${ext}</div>
              <div class="what">
                <span class="icon">${fileIcon(f.name)}</span>
                <span class="ttl">${nameNoExt}</span>
                <span class="path">${dir}/${folderName}/${f.name}</span>
              </div>
              <div class="by">
                <span class="avatar" style="background:${m.color}">${m.name[0]}</span>
                ${m.name}
              </div>
            </div>`;
          }).join('')}
        </div>`}`;
  bindGo();
}

async function renderFile(num, folderName, fileName, computed) {
  const w = computed.find(x => weekNum(x) === num);
  if (!w) { renderHome(computed); return; }

  document.getElementById('main').innerHTML = `<div class="loading">불러오는 중…</div>`;

  const dir     = weekDir(num);
  const rawUrl  = `${GH_RAW}/${dir}/${folderName}/${fileName}`;
  const ghUrl   = `${GH_URL}/blob/${BRANCH}/${dir}/${folderName}/${fileName}`;
  const ext     = fileName.split('.').pop();
  const isMd    = ext === 'md';
  const m       = memberOf(fileName);

  let text = '', err = false;
  try {
    const res = await fetch(rawUrl);
    if (res.ok) text = await res.text(); else err = true;
  } catch { err = true; }

  const lines = text.split('\n').length;
  const words = text.split(/\s+/).filter(Boolean).length;
  const readMin = Math.max(1, Math.round(words / 200));

  const metaRight = isMd
    ? `<span>~${readMin}분 읽기</span><a href="${ghUrl}" target="_blank" rel="noopener" style="color:var(--mute)">GitHub ↗</a>`
    : `<span>${lines}줄</span><a href="${ghUrl}" target="_blank" rel="noopener" style="color:var(--mute)">GitHub ↗</a>`;

  const filebar = `<div class="filebar">
    <span class="path">${dir}/${folderName}/${fileName}</span>
    <span class="meta">
      <span><span class="avatar" style="background:${m.color}">${m.name[0]}</span>${m.name}</span>
      ${metaRight}
    </span>
  </div>`;

  let body;
  if (err) {
    body = `<div style="border:1px solid var(--border);border-top:0;border-radius:0 0 10px 10px;background:var(--panel)"><div class="empty">파일을 불러올 수 없습니다.</div></div>`;
  } else if (isMd) {
    const tmp = document.createElement('div');
    tmp.innerHTML = marked.parse(text);
    const headings = [];
    tmp.querySelectorAll('h1, h2, h3').forEach((h, i) => {
      const id = `toc-${i}`;
      h.id = id;
      headings.push({ id, level: parseInt(h.tagName[1]), text: h.textContent });
    });
    const tocHtml = headings.length < 2 ? '' : `
      <aside class="toc" id="fileToc">
        <div class="toc-title">목차</div>
        ${headings.map(h => `<a class="toc-item h${h.level}" data-id="${h.id}" href="#${h.id}">${h.text}</a>`).join('')}
      </aside>`;
    body = `<div class="file-layout">
      <article class="reader">${tmp.innerHTML}</article>
      ${tocHtml}
    </div>`;
  } else {
    const lang = ext === 'py' ? 'python' : 'plaintext';
    const highlighted = (typeof hljs !== 'undefined')
      ? hljs.highlight(text, { language: lang }).value
      : text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    const lineNums = text.split('\n').map((_,i)=>`<span>${i+1}</span>`).join('');
    body = `<div class="codeview">
      <div class="ln">${lineNums}</div>
      <pre><code class="hljs language-${lang}">${highlighted}</code></pre>
    </div>`;
  }

  document.getElementById('main').innerHTML = filebar + body;
  bindGo();

  if (isMd && !err) {
    const toc = document.getElementById('fileToc');
    if (toc) {
      toc.querySelectorAll('.toc-item').forEach(a => {
        a.onclick = e => {
          e.preventDefault();
          document.getElementById(a.dataset.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        };
      });
      const items = toc.querySelectorAll('.toc-item');
      const obs = new IntersectionObserver(entries => {
        entries.forEach(en => {
          if (en.isIntersecting) {
            items.forEach(a => a.classList.toggle('active', a.dataset.id === en.target.id));
          }
        });
      }, { rootMargin: '-10% 0px -80% 0px' });
      document.querySelectorAll('.reader h1, .reader h2, .reader h3').forEach(h => obs.observe(h));
    }
  }
}

// ── search ──
let _searchInit = false;
function initSearch(computed) {
  if (_searchInit) return;
  _searchInit = true;

  const input = document.getElementById('searchInput');
  if (!input) return;

  let drop = null;
  let focusIdx = -1;

  function buildResults(q) {
    if (!q) return [];
    const lq = q.toLowerCase();
    const results = [];

    for (const w of computed) {
      const n = weekNum(w);
      if (`${w.num} ${w.title} ${w.chapter}`.toLowerCase().includes(lq)) {
        results.push({ label: w.title, sub: `${w.num} · ${w.date}`, route: `week:${n}`, icon: 'folder' });
      }
    }

    for (const [key, files] of Object.entries(_fileCache)) {
      const [num, folder] = key.split(':');
      for (const f of files) {
        if (f.name.toLowerCase().includes(lq)) {
          results.push({
            label: f.name.replace(/\.[^.]+$/, ''),
            sub: `week${String(num).padStart(2,'0')}/${folder}/`,
            route: `file:${num}:${folder}:${f.name}`,
            icon: f.name.endsWith('.py') ? 'py' : 'md',
          });
        }
      }
    }

    return results.slice(0, 8);
  }

  function renderDrop(results) {
    if (drop) drop.remove();
    drop = null;
    focusIdx = -1;
    if (!results.length) return;

    drop = document.createElement('div');
    drop.className = 'search-drop';
    drop.innerHTML = results.map(r => `
      <div class="search-item">
        <span class="search-icon">${ICONS[r.icon] || ICONS.file}</span>
        <span class="search-label">${r.label}</span>
        <span class="search-sub">${r.sub}</span>
      </div>`).join('');

    input.closest('.search').appendChild(drop);
    drop.querySelectorAll('.search-item').forEach((el, i) => {
      el.onmousedown = e => { e.preventDefault(); go(results[i].route); hideDrop(); input.value = ''; };
    });
  }

  function hideDrop() { if (drop) { drop.remove(); drop = null; } focusIdx = -1; }

  function moveFocus(dir) {
    if (!drop) return;
    const items = drop.querySelectorAll('.search-item');
    items.forEach(el => el.classList.remove('focused'));
    focusIdx = Math.max(0, Math.min(items.length - 1, focusIdx + dir));
    items[focusIdx]?.classList.add('focused');
  }

  input.addEventListener('input', () => renderDrop(buildResults(input.value.trim())));
  input.addEventListener('focus', () => { if (input.value.trim()) renderDrop(buildResults(input.value.trim())); });
  input.addEventListener('blur', () => hideDrop());
  input.addEventListener('keydown', e => {
    if (e.key === 'Escape') { hideDrop(); input.value = ''; input.blur(); }
    if (e.key === 'ArrowDown') { e.preventDefault(); moveFocus(1); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); moveFocus(-1); }
    if (e.key === 'Enter' && drop) {
      const focused = drop.querySelector('.search-item.focused');
      focused?.dispatchEvent(new MouseEvent('mousedown'));
    }
  });
}

function bindGo() {
  document.querySelectorAll('[data-go]').forEach(el => {
    el.onclick = e => { e.preventDefault(); go(el.dataset.go); };
  });
}

// ── router ──
async function render() {
  const { weeks, year } = await getWeeks();
  const computed = computeStatus(weeks, year);

  renderStrip(computed);
  renderCrumb(route);
  initSearch(computed);
  await renderSide(route, computed);

  const p = parseRoute(route);

  if (route === 'home' || p.view === 'home') {
    await renderHome(computed);
  } else if (route === 'curriculum') {
    renderCurriculum(computed);
  } else if (route === 'problems') {
    renderProblems(computed);
  } else if (p.view === 'week') {
    await renderWeek(p.num, computed);
  } else if (p.view === 'folder') {
    await renderFolder(p.num, p.folder, computed);
  } else if (p.view === 'file') {
    await renderFile(p.num, p.folder, p.file, computed);
  } else {
    await renderHome(computed);
  }
}

window.addEventListener('hashchange', () => {
  const r = decodeURIComponent(location.hash.replace(/^#/,'') || 'home');
  if (r !== route) { route = r; render(); }
});

document.addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT') return;
  if (e.key === '1') go('home');
  if (e.key === 'Escape') go('home');
});

render();
})();
