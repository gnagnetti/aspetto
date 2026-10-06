import { exercisesData } from '../data/exercisesData';
import { synopticGeneralTable, suppletivePairsTable, aktionsartTable } from '../data/theoryAndTablesData';

export function downloadStandaloneHtmlFile() {
  const serializedExercises = JSON.stringify(exercisesData, null, 2);
  const serializedGeneral = JSON.stringify(synopticGeneralTable);
  const serializedSuppletive = JSON.stringify(suppletivePairsTable);
  const serializedAktionsart = JSON.stringify(aktionsartTable);

  const htmlContent = `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
  <title>Вид — L'Aspetto Verbale Russo (801 Esercizi — L.G. Abu Lafia)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=IBM+Plex+Mono:wght@400;600&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet" />
  <style>
    :root {
      --bg: #F8FAFC;
      --surface: #FFFFFF;
      --border: #E2E8F0;
      --text: #0F172A;
      --muted: #475569;
      --accent: #0284C7;
      --accent-hover: #0369A1;
      --ok-bg: #ECFDF5;
      --ok-text: #065F46;
      --ok-border: #10B981;
      --err-bg: #FEF2F2;
      --err-text: #991B1B;
      --err-border: #EF4444;
    }
    body.dsa-mode {
      --bg: #FDFBF7;
      --surface: #FFFDF9;
      --border: #D6D0C4;
      --text: #1C1917;
      letter-spacing: 0.025em;
      line-height: 1.8;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
    body {
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      padding-bottom: 76px;
    }
    header {
      background: rgba(255,255,255,0.95);
      backdrop-filter: blur(8px);
      border-bottom: 1px solid var(--border);
      padding: 0.75rem 1rem;
      height: 54px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 30;
    }
    .brand {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 1.25rem;
      font-weight: 700;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .nav-tabs { display: flex; gap: 1rem; }
    @media (max-width: 860px) { .nav-tabs { display: none; } }
    .nav-btn {
      background: none;
      border: none;
      font-family: inherit;
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--muted);
      cursor: pointer;
      padding: 0.4rem 0.6rem;
      border-bottom: 2px solid transparent;
    }
    .nav-btn.active { color: var(--accent); border-bottom-color: var(--accent); }
    .container { max-width: 1280px; margin: 0 auto; padding: 1rem; display: grid; grid-template-columns: 320px 1fr; gap: 1.25rem; }
    @media (max-width: 860px) {
      .container { grid-template-columns: 1fr; padding: 0.75rem; }
      .desktop-sidebar { display: none; }
    }
    .panel {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 1.15rem;
    }
    label { display: block; font-size: 0.78rem; font-weight: 600; color: var(--muted); margin-bottom: 0.35rem; margin-top: 0.85rem; }
    select, input[type="text"], input[type="number"] {
      width: 100%;
      min-height: 44px;
      padding: 0.6rem 0.75rem;
      border: 1px solid var(--border);
      border-radius: 10px;
      font-family: inherit;
      font-size: 0.9rem;
      background: var(--bg);
      color: var(--text);
    }
    .stats-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.5rem;
      margin-top: 0.85rem;
      font-family: 'IBM Plex Mono', monospace;
      font-variant-numeric: tabular-nums;
      text-align: center;
    }
    .stat-box { padding: 0.55rem; border: 1px solid var(--border); border-radius: 10px; font-size: 0.75rem; background: var(--bg); }
    .stat-box strong { display: block; font-size: 1.05rem; }
    .sentence-box {
      font-size: 1.2rem;
      line-height: 1.65;
      margin: 1rem 0;
      padding: 1.15rem;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      word-break: break-word;
    }
    .options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1rem; }
    @media (max-width: 600px) { .options-grid { grid-template-columns: 1fr; } }
    .opt-btn {
      min-height: 52px;
      padding: 0.9rem 1rem;
      font-size: 1.05rem;
      font-weight: 600;
      border-radius: 12px;
      border: 2px solid var(--border);
      background: var(--surface);
      cursor: pointer;
      transition: transform 0.1s ease, border-color 0.1s ease;
      text-align: left;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .opt-btn:active { transform: scale(0.98); }
    .opt-btn.correct { background: var(--ok-bg); border-color: var(--ok-border); color: var(--ok-text); }
    .opt-btn.wrong { background: var(--err-bg); border-color: var(--err-border); color: var(--err-text); }
    .feedback {
      padding: 1rem;
      border-radius: 12px;
      margin-top: 0.85rem;
      border: 1px solid var(--border);
      font-size: 0.92rem;
      line-height: 1.5;
    }
    .feedback.ok { background: var(--ok-bg); border-color: var(--ok-border); color: var(--ok-text); }
    .feedback.err { background: var(--err-bg); border-color: var(--err-border); color: var(--err-text); }
    .toolbar { display: flex; justify-content: space-between; align-items: center; margin-top: 1.25rem; gap: 0.5rem; }
    .btn {
      min-height: 44px;
      padding: 0.55rem 1rem;
      border-radius: 10px;
      border: 1px solid var(--border);
      background: var(--surface);
      font-weight: 600;
      font-size: 0.85rem;
      cursor: pointer;
      font-family: inherit;
    }
    .btn-primary { background: var(--accent); color: #fff; border-color: var(--accent); }
    .foglio-sheet {
      margin-top: 0.85rem;
      min-height: 48px;
      padding: 0.9rem;
      border-radius: 12px;
      border: 2px dashed var(--accent);
      background: #F0F9FF;
      cursor: pointer;
      text-align: center;
      font-weight: 600;
      font-size: 0.88rem;
    }
    .bottom-nav {
      display: none;
      position: fixed;
      bottom: 0; left: 0; right: 0;
      height: 62px;
      background: rgba(255,255,255,0.96);
      backdrop-filter: blur(8px);
      border-top: 1px solid var(--border);
      z-index: 40;
      grid-template-columns: repeat(4, 1fr);
    }
    @media (max-width: 860px) { .bottom-nav { display: grid; } }
    .bnav-item {
      border: none;
      background: none;
      font-family: inherit;
      font-size: 0.72rem;
      font-weight: 600;
      color: var(--muted);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2px;
      cursor: pointer;
    }
    .bnav-item.active { color: var(--accent); }
    .sheet-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      z-index: 50;
      display: none;
      flex-direction: column;
      justify-content: flex-end;
    }
    .sheet-backdrop.open { display: flex; }
    .sheet-body {
      background: var(--surface);
      border-radius: 24px 24px 0 0;
      padding: 1.25rem;
      max-height: 82vh;
      overflow-y: auto;
    }
  </style>
</head>
<body>
  <header>
    <div class="brand">Вид · L'Aspetto Verbale Russo</div>
    <nav class="nav-tabs">
      <button class="nav-btn active" onclick="setTab('quiz')" id="tab-quiz">Pratica (801)</button>
      <button class="nav-btn" onclick="setTab('foglio')" id="tab-foglio">Modalità Foglio (DSA)</button>
      <button class="nav-btn" onclick="setTab('tabelle')" id="tab-tabelle">Tabelle Sinottiche</button>
    </nav>
    <div>
      <button class="btn" onclick="toggleDsa()">DSA</button>
    </div>
  </header>

  <main class="container" id="app-main"></main>

  <div class="sheet-backdrop" id="mobile-sheet" onclick="if(event.target===this)toggleSheet(false)">
    <div class="sheet-body" id="sheet-content"></div>
  </div>

  <nav class="bottom-nav">
    <button class="bnav-item active" id="bnav-quiz" onclick="setTab('quiz');toggleSheet(false)"><span>Esercizi</span></button>
    <button class="bnav-item" id="bnav-foglio" onclick="setTab('foglio');toggleSheet(false)"><span>Foglio DSA</span></button>
    <button class="bnav-item" id="bnav-filtri" onclick="toggleSheet(true)"><span>Filtri & Moduli</span></button>
    <button class="bnav-item" id="bnav-tabelle" onclick="setTab('tabelle');toggleSheet(false)"><span>Tabelle</span></button>
  </nav>

  <script>
    const exercisesData = ${serializedExercises};
    const synopticGeneralTable = ${serializedGeneral};
    const suppletivePairsTable = ${serializedSuppletive};
    const aktionsartTable = ${serializedAktionsart};

    let state = {
      tab: 'quiz',
      modulo: 'ALL',
      sezione: 'ALL',
      search: '',
      statusFilter: 'ALL',
      currentIndex: 0,
      foglioRevealed: false,
      answers: JSON.parse(localStorage.getItem('vid_standalone_answers') || '{}')
    };

    function saveAnswers() {
      localStorage.setItem('vid_standalone_answers', JSON.stringify(state.answers));
    }

    function toggleDsa() {
      document.body.classList.toggle('dsa-mode');
    }

    function toggleSheet(open) {
      const el = document.getElementById('mobile-sheet');
      if (open) {
        el.classList.add('open');
        renderFiltersInto('sheet-content', true);
      } else {
        el.classList.remove('open');
      }
    }

    function setTab(t) {
      state.tab = t;
      document.querySelectorAll('.nav-btn, .bnav-item').forEach(b => b.classList.remove('active'));
      const btn = document.getElementById('tab-' + t);
      const bbtn = document.getElementById('bnav-' + t);
      if (btn) btn.classList.add('active');
      if (bbtn) bbtn.classList.add('active');
      render();
    }

    function getFiltered() {
      return exercisesData.filter(ex => {
        if (state.modulo !== 'ALL' && ex.modulo !== state.modulo) return false;
        if (state.sezione !== 'ALL' && ex.sezione !== state.sezione) return false;
        const ans = state.answers[ex.id];
        if (state.statusFilter === 'TODO' && ans) return false;
        if (state.statusFilter === 'CORRECT' && ans !== ex.opzioneCorretta) return false;
        if (state.statusFilter === 'WRONG' && (!ans || ans === ex.opzioneCorretta)) return false;
        if (state.search.trim()) {
          const q = state.search.trim().toLowerCase();
          const full = (ex.id + ' ' + ex.testoPrima + ' ' + ex.opzione1 + ' ' + ex.opzione2 + ' ' + ex.testoDopo + ' ' + ex.spiegazione).toLowerCase();
          if (!full.includes(q)) return false;
        }
        return true;
      });
    }

    function answerExercise(id, chosen) {
      state.answers[id] = chosen;
      state.foglioRevealed = true;
      saveAnswers();
      render();
    }

    function buildFilterHtml(isSheet) {
      const moduli = [...new Set(exercisesData.map(e => e.modulo))];
      const sezioni = [...new Set(exercisesData.filter(e => state.modulo === 'ALL' || e.modulo === state.modulo).map(e => e.sezione))];
      const totalAnswered = Object.keys(state.answers).length;
      const totalCorrect = Object.entries(state.answers).filter(([id, val]) => {
        const item = exercisesData.find(x => x.id === Number(id));
        return item && item.opzioneCorretta === val;
      }).length;

      return \`
        <h3>Filtri e Percorso</h3>
        <div class="stats-row">
          <div class="stat-box"><strong>\${totalAnswered}/801</strong>Svolti</div>
          <div class="stat-box"><strong>\${totalCorrect}</strong>Esatti</div>
          <div class="stat-box"><strong>\${totalAnswered ? Math.round((totalCorrect/totalAnswered)*100) : 0}%</strong>Precisione</div>
        </div>
        <label>Modulo (1–10)</label>
        <select onchange="state.modulo=this.value;state.sezione='ALL';state.currentIndex=0;render();if(\${isSheet})renderFiltersInto('sheet-content',true)">
          <option value="ALL">Tutti i 10 Moduli (801 esercizi)</option>
          \${moduli.map(m => \`<option value="\${m}" \${state.modulo === m ? 'selected' : ''}>\${m}</option>\`).join('')}
        </select>
        <label>Sezione</label>
        <select onchange="state.sezione=this.value;state.currentIndex=0;render()">
          <option value="ALL">Tutte le sezioni</option>
          \${sezioni.map(s => \`<option value="\${s}" \${state.sezione === s ? 'selected' : ''}>\${s}</option>\`).join('')}
        </select>
        <label>Stato</label>
        <select onchange="state.statusFilter=this.value;state.currentIndex=0;render()">
          <option value="ALL" \${state.statusFilter === 'ALL' ? 'selected' : ''}>Tutti (\${exercisesData.length})</option>
          <option value="TODO" \${state.statusFilter === 'TODO' ? 'selected' : ''}>Da svolgere</option>
          <option value="WRONG" \${state.statusFilter === 'WRONG' ? 'selected' : ''}>Da ripassare (errati)</option>
          <option value="CORRECT" \${state.statusFilter === 'CORRECT' ? 'selected' : ''}>Completati correttamente</option>
        </select>
        <label>Cerca parola o N° (1–801)</label>
        <input type="text" value="\${state.search}" oninput="state.search=this.value;state.currentIndex=0;render()" placeholder="Es. 268, нельзя, читать..." />
        \${isSheet ? '<button class="btn btn-primary" style="width:100%;margin-top:1rem;" onclick="toggleSheet(false)">Applica e torna agli esercizi</button>' : ''}
      \`;
    }

    function renderFiltersInto(containerId, isSheet) {
      const el = document.getElementById(containerId);
      if (el) el.innerHTML = buildFilterHtml(isSheet);
    }

    function render() {
      const main = document.getElementById('app-main');
      if (state.tab === 'tabelle') {
        main.style.gridTemplateColumns = '1fr';
        main.innerHTML = '<div class="panel"><h2>Tabella Sinottica Generale</h2><div style="display:grid;gap:0.75rem;margin-top:1rem;">' +
          synopticGeneralTable.map(r => '<div style="padding:0.85rem;border:1px solid var(--border);border-radius:10px;background:var(--bg);"><div><strong>' + r.contesto + '</strong></div><div style="color:var(--accent);font-size:0.82rem;margin:0.2rem 0;">' + r.regola + '</div><div style="font-weight:600;">' + r.esempio + '</div><div style="font-size:0.8rem;color:var(--muted);margin-top:0.2rem;">' + r.valore + '</div></div>').join('') +
          '</div></div>';
        return;
      }
      main.style.gridTemplateColumns = '';
      const filtered = getFiltered();
      if (state.currentIndex >= filtered.length) state.currentIndex = 0;
      const current = filtered[state.currentIndex];
      const sidebarHtml = '<aside class="panel desktop-sidebar">' + buildFilterHtml(false) + '</aside>';

      if (!current) {
        main.innerHTML = sidebarHtml + '<section class="panel"><p>Nessun esercizio corrisponde ai filtri selezionati.</p></section>';
        return;
      }

      const userAns = state.answers[current.id];
      const isCorrect = userAns === current.opzioneCorretta;

      main.innerHTML = sidebarHtml + \`
        <section class="panel">
          <div style="font-size:0.78rem;color:var(--muted);margin-bottom:0.5rem;">
            <strong>Esercizio #\${current.id}</strong> · <span>\${current.modulo}</span> · <span>\${current.sezione}</span>
          </div>
          <div class="sentence-box">
            \${current.testoPrima}<strong>\${current.opzione1} / \${current.opzione2}</strong>\${current.testoDopo}
          </div>
          <div class="options-grid">
            <button class="opt-btn \${userAns ? (current.opzione1 === current.opzioneCorretta ? 'correct' : (userAns === current.opzione1 ? 'wrong' : '')) : ''}" onclick="answerExercise(\${current.id}, '\${current.opzione1.replace(/'/g, "\\\\'")}')">
              <span>1. \${current.opzione1}</span>
            </button>
            <button class="opt-btn \${userAns ? (current.opzione2 === current.opzioneCorretta ? 'correct' : (userAns === current.opzione2 ? 'wrong' : '')) : ''}" onclick="answerExercise(\${current.id}, '\${current.opzione2.replace(/'/g, "\\\\'")}')">
              <span>2. \${current.opzione2}</span>
            </button>
          </div>
          \${!userAns && !state.foglioRevealed ? \`
            <div class="foglio-sheet" onclick="state.foglioRevealed=true;render()">
              Tocca per far scorrere il foglio di copertura e vedere la soluzione
            </div>
          \` : ''}
          \${(userAns || state.foglioRevealed) ? \`
            <div class="feedback \${!userAns ? 'ok' : (isCorrect ? 'ok' : 'err')}">
              <strong>\${!userAns ? 'Soluzione:' : (isCorrect ? '● CORRETTO:' : '▲ ERRORE — Soluzione corretta:')} \${current.opzioneCorretta}</strong>
              <p style="margin-top:0.35rem;">\${current.spiegazione}</p>
            </div>
          \` : ''}
          <div class="toolbar">
            <button class="btn" onclick="if(state.currentIndex>0){state.currentIndex--;state.foglioRevealed=false;render();}">← Prec.</button>
            <span style="font-family:'IBM Plex Mono',monospace;font-size:0.82rem;">\${state.currentIndex + 1} / \${filtered.length}</span>
            <button class="btn btn-primary" onclick="if(state.currentIndex<filtered.length-1){state.currentIndex++;state.foglioRevealed=false;render();}">Succ. →</button>
          </div>
        </section>
      \`;
    }

    render();
  </script>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'aspetto-verbale-russo-800-esercizi.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
