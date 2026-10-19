/* Motor do site de cursos: carregamento de conteúdo, rotas, exercícios, provas e progresso. */
const App = (() => {
  'use strict';

  // ---------- Cursos ----------
  const COURSES = {
    python: { id: 'python', title: 'Python', emoji: '🐍', tagline: 'Do primeiro print() a software profissional. Você programa direto no navegador.', modules: [] },
    ingles: { id: 'ingles', title: 'Inglês', emoji: '🇬🇧', tagline: 'Do A1 ao C2 pelo Quadro Europeu, com áudio, ditados, fala e produção escrita.', modules: [] },
    ciberseguranca: { id: 'ciberseguranca', title: 'Cibersegurança', emoji: '🛡️', tagline: 'Da higiene digital à defesa profissional: redes, criptografia, ataques, resposta a incidentes e LGPD.', modules: [] },
    vibecoding: { id: 'vibecoding', title: 'IA, Vibe Coding e No Code', emoji: '🤖', tagline: 'Construa sistemas e apps com IA, prompts e ferramentas sem código — do MVP ao produto no ar.', modules: [] },
    automacao: { id: 'automacao', title: 'Automação e IA', emoji: '⚙️', tagline: 'Elimine trabalho repetitivo: APIs, n8n/Make, Python, agentes de IA e automação de escritório.', modules: [] },
    claudecode: { id: 'claudecode', title: 'Claude Code', emoji: '💻', tagline: 'Programe com um agente de IA no terminal: do primeiro comando a automações, hooks, MCP e CI.', modules: [] },
  };
  const DAILY_MINUTES = 30; // metodologia: 30 minutos por dia
  const VERSION = '2026-10-19'; // mude ao atualizar o conteúdo: evita cache antigo no navegador dos alunos
  window.registerModule = (m) => {
    if (!COURSES[m.course]) { console.error('Curso desconhecido', m); return; }
    COURSES[m.course].modules.push(m);
  };
  // Frases de prática de fala por lição (content/ingles/fala.js): { 'en-01-01': ['frase', {text, pt}], ... }
  const SPEAK = {};
  window.registerSpeaking = (map) => Object.assign(SPEAK, map);
  function mergeSpeaking() {
    for (const c of Object.values(COURSES)) for (const m of c.modules) for (const l of m.lessons) {
      const list = SPEAK[l.id]; if (!list || !list.length) continue;
      l.exercises = l.exercises || [];
      if (l.exercises.some(e => e.type === 'speak')) continue;
      for (const it of list) { const o = typeof it === 'string' ? { text: it } : it; l.exercises.push({ type: 'speak', q: 'Leia a frase em voz alta. Ouça o modelo antes, se quiser.', text: o.text, pt: o.pt, explain: 'Repetir em voz alta fixa pronúncia, ritmo e entonação. Vale mais falar devagar e claro do que rápido.' }); }
    }
  }

  // ---------- Progresso (localStorage) ----------
  const KEY = 'meus-cursos-v1';
  const defaults = () => ({ done: {}, ex: {}, exams: {}, xp: 0, streak: { last: null, count: 0 }, settings: { free: false, theme: 'auto', name: '' }, updated: null });
  let P = defaults();
  function load() {
    try { const raw = localStorage.getItem(KEY); if (raw) P = Object.assign(defaults(), JSON.parse(raw)); } catch (e) { console.warn('Sem localStorage', e); }
    P.settings = Object.assign(defaults().settings, P.settings || {});
    applyTheme();
  }
  function save() {
    P.updated = new Date().toISOString();
    try { localStorage.setItem(KEY, JSON.stringify(P)); } catch (e) { console.warn(e); }
    renderTopStats();
  }
  function today() { return new Date().toISOString().slice(0, 10); }
  function touchStreak() {
    const t = today();
    if (P.streak.last === t) return;
    const y = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    P.streak.count = P.streak.last === y ? P.streak.count + 1 : 1;
    P.streak.last = t;
  }
  function addXp(n) { P.xp += n; touchStreak(); save(); }
  function applyTheme() {
    const t = P.settings.theme || 'auto';
    if (t === 'auto') document.documentElement.removeAttribute('data-theme'); else document.documentElement.setAttribute('data-theme', t);
  }

  // ---------- Utilidades ----------
  const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const h = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const norm = (s) => String(s).toLowerCase().normalize('NFC').replace(/[’‘]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim().replace(/[.!?,;:]+$/g, '').trim();
  function toast(msg) { const t = h(`<div class="toast">${esc(msg)}</div>`); document.body.appendChild(t); setTimeout(() => t.remove(), 3000); }
  function inline(md) { // markdown leve para enunciados (código, negrito)
    return esc(md).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
  }

  // ---------- Áudio (inglês) ----------
  let voices = [];
  function loadVoices() { try { voices = speechSynthesis.getVoices(); } catch (e) { voices = []; } }
  if ('speechSynthesis' in window) { loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; }
  function pickVoice() {
    const en = voices.filter(v => /^en[-_]/i.test(v.lang));
    const pref = ['Google US English', 'Microsoft Aria', 'Microsoft Jenny', 'Microsoft Guy', 'Samantha', 'Microsoft Zira', 'Microsoft David'];
    for (const p of pref) { const v = en.find(x => x.name.includes(p)); if (v) return v; }
    return en.find(v => v.lang === 'en-US') || en[0] || null;
  }
  function speak(text, rate = 0.95) {
    if (!('speechSynthesis' in window)) { toast('Seu navegador não tem síntese de voz.'); return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US'; u.rate = rate; const v = pickVoice(); if (v) u.voice = v;
    speechSynthesis.speak(u);
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-say]'); if (!b) return;
    speak(b.getAttribute('data-say'), b.hasAttribute('data-slow') ? 0.65 : 0.95);
  });

  // ---------- Reconhecimento de voz (prática de fala) ----------
  const Rec = {
    Ctor: window.SpeechRecognition || window.webkitSpeechRecognition || null,
    available() { return !!this.Ctor; },
    // Ouve uma frase e devolve as alternativas reconhecidas (lista de textos).
    listen(onState) {
      return new Promise((resolve, reject) => {
        if (!this.Ctor) return reject(new Error('sem suporte'));
        try { speechSynthesis.cancel(); } catch (e) {}
        const r = new this.Ctor();
        r.lang = 'en-US'; r.interimResults = false; r.maxAlternatives = 5; r.continuous = false;
        let done = false;
        const finish = (fn, v) => { if (done) return; done = true; clearTimeout(timer); fn(v); };
        const timer = setTimeout(() => { try { r.stop(); } catch (e) {} finish(reject, new Error('tempo')); }, 12000);
        r.onstart = () => onState && onState('ouvindo');
        r.onspeechend = () => onState && onState('processando');
        r.onresult = (ev) => { const alts = []; for (const res of ev.results) for (const a of res) alts.push(a.transcript); finish(resolve, alts); };
        r.onerror = (ev) => finish(reject, new Error(ev.error || 'erro'));
        r.onend = () => finish(reject, new Error('nada'));
        try { r.start(); } catch (e) { finish(reject, e); }
      });
    },
  };
  // Compara o que foi dito com o esperado, palavra a palavra (alinhamento por LCS).
  const CONTR = { "i'm": 'i am', "you're": 'you are', "he's": 'he is', "she's": 'she is', "it's": 'it is', "we're": 'we are', "they're": 'they are', "that's": 'that is', "there's": 'there is', "what's": 'what is', "where's": 'where is', "who's": 'who is', "how's": 'how is', "let's": 'let us', "i've": 'i have', "you've": 'you have', "we've": 'we have', "they've": 'they have', "i'll": 'i will', "you'll": 'you will', "he'll": 'he will', "she'll": 'she will', "we'll": 'we will', "they'll": 'they will', "it'll": 'it will', "i'd": 'i would', "you'd": 'you would', "he'd": 'he would', "she'd": 'she would', "we'd": 'we would', "they'd": 'they would', "isn't": 'is not', "aren't": 'are not', "wasn't": 'was not', "weren't": 'were not', "don't": 'do not', "doesn't": 'does not', "didn't": 'did not', "can't": 'can not', 'cannot': 'can not', "couldn't": 'could not', "won't": 'will not', "wouldn't": 'would not', "shouldn't": 'should not', "mustn't": 'must not', "haven't": 'have not', "hasn't": 'has not', "hadn't": 'had not', 'gonna': 'going to', 'wanna': 'want to' };
  const NUMS = { zero: '0', one: '1', two: '2', three: '3', four: '4', five: '5', six: '6', seven: '7', eight: '8', nine: '9', ten: '10', eleven: '11', twelve: '12', thirteen: '13', fourteen: '14', fifteen: '15', sixteen: '16', seventeen: '17', eighteen: '18', nineteen: '19', twenty: '20', thirty: '30', forty: '40', fifty: '50', sixty: '60', seventy: '70', eighty: '80', ninety: '90', hundred: '100', thousand: '1000' };
  // Normaliza fala: minúsculas, sem pontuação, contrações expandidas, números por extenso → dígitos.
  function speechWords(s) {
    return norm(s).replace(/[^a-z0-9' ]/g, ' ').split(' ').filter(Boolean)
      .flatMap(w => (CONTR[w] || w).split(' ')).map(w => w.replace(/'s$/, '')).map(w => NUMS[w] || w).filter(Boolean);
  }
  function compareSpeech(said, expected) {
    const S = speechWords(said);
    const E = speechWords(expected);
    const n = S.length, m = E.length; const L = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
    for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) L[i][j] = S[i] === E[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
    const okE = new Array(m).fill(false); let i = 0, j = 0;
    while (i < n && j < m) { if (S[i] === E[j]) { okE[j] = true; i++; j++; } else if (L[i + 1][j] >= L[i][j + 1]) i++; else j++; }
    const hits = okE.filter(Boolean).length;
    return { score: m ? hits / m : 0, words: E.map((w, k) => ({ w, ok: okE[k] })), said: S.join(' ') };
  }
  function bestSpeech(alts, expected) { let best = null; for (const a of alts) { const c = compareSpeech(a, expected); if (!best || c.score > best.score) best = c; } return best || compareSpeech('', expected); }
  const recErrorMsg = (e) => ({ 'not-allowed': 'Permita o uso do microfone no navegador (ícone de cadeado na barra de endereço).', 'audio-capture': 'Nenhum microfone encontrado.', 'no-speech': 'Não ouvi nada. Fale mais perto do microfone.', nada: 'Não ouvi nada. Tente de novo.', tempo: 'Tempo esgotado. Tente de novo.', network: 'O reconhecimento de voz precisa de internet.' }[e.message] || 'Não consegui ouvir. Tente de novo.');

  // ---------- Markdown ----------
  function renderMarkdown(md) {
    md = md.replace(/\{\{en:([\s\S]+?)\}\}/g, (_, t) => `<button type="button" class="speak-inline" data-say="${esc(t.trim())}">${esc(t.trim())}</button>`);
    let html;
    if (window.marked) {
      try { html = marked.parse(md, { gfm: true, breaks: false }); } catch (e) { html = `<pre>${esc(md)}</pre>`; }
    } else html = `<pre>${esc(md)}</pre>`;
    const el = h(`<div class="lesson-content">${html}</div>`);
    if (window.hljs) el.querySelectorAll('pre code').forEach(c => { try { hljs.highlightElement(c); } catch (e) {} });
    return el;
  }
  const mdCache = {};
  async function fetchMd(path) {
    if (mdCache[path]) return mdCache[path];
    const r = await fetch(path + '?v=' + VERSION);
    if (!r.ok) throw new Error(`Não achei ${path} (${r.status})`);
    return (mdCache[path] = await r.text());
  }

  // ---------- Python no navegador ----------
  const Py = {
    worker: null, ready: null, pending: new Map(), seq: 0,
    start() {
      if (this.worker) return this.ready;
      this.worker = new Worker('js/py-worker.js', { type: 'module' });
      this.ready = new Promise((res, rej) => { this._res = res; this._rej = rej; });
      this.worker.onmessage = (ev) => {
        const d = ev.data;
        if ('ready' in d) { d.ready ? this._res() : this._rej(new Error(d.error)); return; }
        const p = this.pending.get(d.id); if (!p) return;
        clearTimeout(p.timer); this.pending.delete(d.id); p.resolve(d.result);
      };
      this.worker.onerror = (e) => { console.error(e); this._rej && this._rej(new Error(e.message || 'erro no worker')); };
      return this.ready;
    },
    kill() {
      if (this.worker) this.worker.terminate();
      this.worker = null; this.ready = null;
      for (const p of this.pending.values()) { clearTimeout(p.timer); p.resolve({ ok: false, saida: '', erro: 'Tempo esgotado (15 s). Seu código provavelmente entrou em um laço infinito.' }); }
      this.pending.clear();
    },
    async run(code, tests, onStatus) {
      try { onStatus && onStatus('Iniciando o Python no navegador (só na primeira vez, pode levar alguns segundos)…'); await this.start(); }
      catch (e) { this.kill(); return { ok: false, saida: '', erro: 'Não consegui carregar o Python no navegador. Verifique a conexão e recarregue a página.' }; }
      onStatus && onStatus('Executando…');
      const id = ++this.seq;
      return new Promise((resolve) => {
        const timer = setTimeout(() => { this.pending.delete(id); this.kill(); resolve({ ok: false, saida: '', erro: 'Tempo esgotado (15 s). Seu código provavelmente entrou em um laço infinito.' }); }, 15000);
        this.pending.set(id, { resolve, timer });
        this.worker.postMessage({ id, code, tests });
      });
    },
  };

  // ---------- Modelo de progressão ----------
  const modulesOf = (c) => COURSES[c].modules;
  const findModule = (id) => Object.values(COURSES).flatMap(c => c.modules).find(m => m.id === id);
  const lessonDone = (l) => !!P.done[l.id];
  const moduleLessonsDone = (m) => m.lessons.filter(lessonDone).length;
  const examPassed = (m) => !!(P.exams[m.id] && P.exams[m.id].passed);
  const moduleComplete = (m) => examPassed(m);
  function moduleUnlocked(m) {
    if (P.settings.free) return true;
    const mods = modulesOf(m.course); const i = mods.indexOf(m);
    return i <= 0 || examPassed(mods[i - 1]);
  }
  const examUnlocked = (m) => P.settings.free || moduleLessonsDone(m) === m.lessons.length;
  function courseStats(c) {
    const mods = modulesOf(c);
    const lessons = mods.flatMap(m => m.lessons);
    return { modules: mods.length, modulesDone: mods.filter(moduleComplete).length, lessons: lessons.length, lessonsDone: lessons.filter(lessonDone).length, hours: mods.reduce((s, m) => s + (m.hours || 0), 0) };
  }

  // ---------- Exercícios ----------
  // Cada widget devolve { el, check(): Promise<boolean>, answered(): boolean, reveal(ok) }
  function makeExercise(ex, idx, mode, exId) {
    const card = h(`<div class="card ex" data-type="${ex.type}"><div class="ex-head"><span class="ex-num">${mode === 'exam' ? 'Questão' : 'Exercício'} ${idx + 1} · ${typeName(ex.type)}</span></div></div>`);
    if (ex.type !== 'listen' || ex.q) card.appendChild(h(`<div class="q">${inline(ex.q || '')}</div>`));
    const body = document.createElement('div'); card.appendChild(body);
    const fb = h('<div class="feedback" hidden></div>'); card.appendChild(fb);
    const w = { el: card, ex, fb, body, mode, exId, done: false };
    builders[ex.type](w);
    if (mode === 'lesson') {
      if (P.ex[exId]) { card.classList.add('correct'); w.done = true; if (w.showDone) w.showDone(); }
      w.onResult = (ok, extra) => {
        card.classList.toggle('correct', ok); card.classList.toggle('wrong', !ok);
        fb.hidden = false; fb.className = 'feedback ' + (ok ? 'ok' : 'bad');
        fb.innerHTML = (ok ? '<b>Correto!</b> ' : '<b>Ainda não.</b> ') + (extra || '') + (ok && ex.explain ? ' ' + inline(ex.explain) : '');
        if (ok && !w.done) { w.done = true; P.ex[exId] = true; addXp(5); w.afterCorrect && w.afterCorrect(); }
      };
    }
    return w;
  }
  function typeName(t) { return { mc: 'múltipla escolha', tf: 'verdadeiro ou falso', fill: 'complete', order: 'ordene', match: 'relacione', code: 'programe', listen: 'ditado', write: 'escreva', speak: 'fale' }[t] || t; }

  const builders = {
    mc(w) {
      const { ex, body } = w; let sel = null; // sel = índice ORIGINAL da opção escolhida
      // Ordem das alternativas embaralhada a cada exibição (evita "a resposta é sempre a B").
      const order = shuffle(ex.options.map((_, i) => i));
      const opts = h('<div class="options"></div>');
      order.forEach((i) => {
        const l = h(`<label><input type="radio" name="${w.exId}"><span>${inline(ex.options[i])}</span></label>`);
        l.dataset.i = i;
        l.querySelector('input').onchange = () => { sel = i; opts.querySelectorAll('label').forEach(x => x.classList.remove('selected')); l.classList.add('selected'); };
        opts.appendChild(l);
      });
      body.appendChild(opts);
      const reveal = (ok) => { opts.querySelectorAll('label').forEach((l) => { const i = Number(l.dataset.i); if (i === ex.answer) l.classList.add('right'); else if (i === sel && !ok) l.classList.add('wrongpick'); }); };
      if (w.mode === 'lesson') {
        const b = h('<div class="row"><button class="btn primary small">Verificar</button></div>'); body.appendChild(b);
        b.querySelector('button').onclick = () => { if (sel === null) return toast('Escolha uma opção.'); const ok = sel === ex.answer; reveal(ok); w.onResult(ok, ok ? '' : 'Tente de novo.'); };
      }
      w.answered = () => sel !== null; w.check = async () => sel === ex.answer; w.reveal = reveal;
    },
    tf(w) {
      const { ex, body } = w; let sel = null;
      const opts = h(`<div class="options"><label><input type="radio" name="${w.exId}"><span>Verdadeiro</span></label><label><input type="radio" name="${w.exId}"><span>Falso</span></label></div>`);
      const labels = opts.querySelectorAll('label');
      labels.forEach((l, i) => l.querySelector('input').onchange = () => { sel = i === 0; labels.forEach(x => x.classList.remove('selected')); l.classList.add('selected'); });
      body.appendChild(opts);
      const reveal = (ok) => { labels.forEach((l, i) => { const v = i === 0; if (v === ex.answer) l.classList.add('right'); else if (v === sel && !ok) l.classList.add('wrongpick'); }); };
      if (w.mode === 'lesson') {
        const b = h('<div class="row"><button class="btn primary small">Verificar</button></div>'); body.appendChild(b);
        b.querySelector('button').onclick = () => { if (sel === null) return toast('Escolha uma opção.'); const ok = sel === ex.answer; reveal(ok); w.onResult(ok, ok ? '' : 'Tente de novo.'); };
      }
      w.answered = () => sel !== null; w.check = async () => sel === ex.answer; w.reveal = reveal;
    },
    fill(w) {
      const { ex, body } = w;
      const row = h('<div class="row"><input type="text" autocomplete="off" spellcheck="false" placeholder="Sua resposta"></div>');
      const inp = row.querySelector('input'); body.appendChild(row);
      const correct = () => ex.answer.map(norm).includes(norm(inp.value));
      if (w.mode === 'lesson') {
        const b = h('<button class="btn primary small">Verificar</button>'); row.appendChild(b);
        const go = () => { if (!inp.value.trim()) return toast('Digite uma resposta.'); const ok = correct(); w.onResult(ok, ok ? '' : (ex.hint ? inline(ex.hint) : 'Confira a grafia e tente de novo.')); };
        b.onclick = go; inp.onkeydown = (e) => { if (e.key === 'Enter') go(); };
      }
      w.answered = () => !!inp.value.trim(); w.check = async () => correct();
      w.reveal = (ok) => { if (!ok) row.appendChild(h(`<span class="pill ok">Resposta: ${esc(ex.answer[0])}</span>`)); };
    },
    order(w) {
      const { ex, body } = w; let chosen = [];
      const pool = h('<div class="chips pool"></div>'), ans = h('<div class="chips answer" title="Clique em um item para devolvê-lo"></div>');
      body.appendChild(h('<div class="meta">Clique nos itens na ordem correta:</div>')); body.appendChild(ans); body.appendChild(pool);
      const items = shuffle(ex.items.map((t, i) => ({ t, i })));
      const render = () => {
        pool.innerHTML = ''; ans.innerHTML = '';
        items.forEach(it => { if (!chosen.includes(it)) { const c = h(`<button type="button" class="chip">${esc(it.t)}</button>`); c.onclick = () => { chosen.push(it); render(); }; pool.appendChild(c); } });
        chosen.forEach(it => { const c = h(`<button type="button" class="chip">${esc(it.t)}</button>`); c.onclick = () => { chosen = chosen.filter(x => x !== it); render(); }; ans.appendChild(c); });
        if (!chosen.length) ans.appendChild(h('<span class="meta">(sua resposta aparece aqui)</span>'));
      };
      render();
      const correct = () => chosen.length === items.length && chosen.every((it, k) => it.i === k);
      if (w.mode === 'lesson') {
        const b = h('<div class="row"><button class="btn primary small">Verificar</button><button class="btn small ghost">Limpar</button></div>'); body.appendChild(b);
        b.children[0].onclick = () => { if (chosen.length !== items.length) return toast('Use todos os itens.'); const ok = correct(); w.onResult(ok, ok ? '' : 'A ordem não está certa. Tente de novo.'); };
        b.children[1].onclick = () => { chosen = []; render(); };
      }
      w.answered = () => chosen.length === items.length; w.check = async () => correct();
      w.reveal = (ok) => { if (!ok) body.appendChild(h(`<div class="meta">Ordem correta: <b>${esc(ex.items.join(' '))}</b></div>`)); };
    },
    match(w) {
      const { ex, body } = w;
      const rights = shuffle(ex.pairs.map(p => p[1]));
      const selects = ex.pairs.map(([l]) => {
        const row = h(`<div class="match-row"><div class="left">${inline(l)}</div><select><option value="">— escolha —</option>${rights.map(r => `<option>${esc(r)}</option>`).join('')}</select></div>`);
        body.appendChild(row); return row.querySelector('select');
      });
      const results = () => ex.pairs.map(([, r], i) => selects[i].value === r);
      if (w.mode === 'lesson') {
        const b = h('<div class="row"><button class="btn primary small">Verificar</button></div>'); body.appendChild(b);
        b.querySelector('button').onclick = () => {
          if (selects.some(s => !s.value)) return toast('Relacione todos os itens.');
          const r = results(); const ok = r.every(Boolean);
          selects.forEach((s, i) => s.style.borderColor = r[i] ? 'var(--ok)' : 'var(--bad)');
          w.onResult(ok, ok ? '' : `${r.filter(Boolean).length} de ${r.length} certos. Ajuste os marcados em vermelho.`);
        };
      }
      w.answered = () => selects.every(s => s.value); w.check = async () => results().every(Boolean);
      w.reveal = (ok) => { if (!ok) body.appendChild(h(`<div class="meta">Pares: ${ex.pairs.map(p => `<b>${esc(p[0])}</b> → ${esc(p[1])}`).join('; ')}</div>`)); };
    },
    code(w) {
      const { ex, body } = w; let attempts = 0;
      const ta = h('<textarea class="code" spellcheck="false"></textarea>'); ta.value = ex.starter || '';
      ta.onkeydown = (e) => { if (e.key === 'Tab') { e.preventDefault(); const s = ta.selectionStart; ta.setRangeText('    ', s, ta.selectionEnd, 'end'); } };
      body.appendChild(ta);
      const row = h(`<div class="row"><button class="btn primary small">▶ Rodar e testar</button>${ex.hint ? '<button class="btn small ghost">💡 Dica</button>' : ''}<span class="meta status"></span></div>`);
      body.appendChild(row);
      const out = h('<div class="output" hidden></div>'); body.appendChild(out);
      const status = row.querySelector('.status');
      let lastOk = false;
      const run = async () => {
        row.children[0].disabled = true; out.hidden = true;
        const r = await Py.run(ta.value, ex.tests, (s) => status.textContent = s);
        status.textContent = ''; row.children[0].disabled = false; attempts++;
        out.hidden = false; out.className = 'output' + (r.ok ? '' : ' err');
        let txt = r.saida ? `<span class="label">Saída</span>${esc(r.saida)}` : '';
        if (!r.ok) txt += `${txt ? '\n' : ''}<span class="label">${r.fase === 'testes' ? 'Teste falhou' : 'Erro'}</span>${esc(r.erro || '')}`;
        else if (!r.saida) txt = '<span class="label">Tudo certo</span>Todos os testes passaram.';
        out.innerHTML = txt;
        lastOk = r.ok;
        if (w.mode === 'lesson') { w.onResult(r.ok, r.ok ? '' : 'Leia a mensagem acima, ajuste o código e rode de novo.'); if (!r.ok && attempts >= 3 && ex.solution && !body.querySelector('details')) body.appendChild(solutionBox(ex)); }
        return r.ok;
      };
      row.children[0].onclick = run;
      if (ex.hint) row.children[1].onclick = () => { w.fb.hidden = false; w.fb.className = 'feedback info'; w.fb.innerHTML = '💡 ' + inline(ex.hint); };
      w.showDone = () => { if (ex.solution) body.appendChild(solutionBox(ex)); };
      w.afterCorrect = () => { if (ex.solution && !body.querySelector('details')) body.appendChild(solutionBox(ex)); };
      w.answered = () => ta.value.trim() !== (ex.starter || '').trim() || lastOk;
      w.check = async () => { if (lastOk) return true; return run(); };
      w.reveal = (ok) => { if (!ok && ex.solution) body.appendChild(solutionBox(ex)); };
    },
    listen(w) {
      const { ex, body } = w;
      body.appendChild(h(`<div class="row"><button type="button" class="btn speak" data-say="${esc(ex.text)}">🔊 Ouvir</button><button type="button" class="btn speak small ghost" data-say="${esc(ex.text)}" data-slow>🐢 Devagar</button></div>`));
      const row = h('<div class="row"><input type="text" autocomplete="off" spellcheck="false" placeholder="Escreva o que ouviu" style="min-width:min(100%,420px)"></div>');
      const inp = row.querySelector('input'); body.appendChild(row);
      const correct = () => norm(inp.value) === norm(ex.text);
      if (w.mode === 'lesson') {
        const b = h('<button class="btn primary small">Verificar</button>'); row.appendChild(b);
        const go = () => { if (!inp.value.trim()) return toast('Escreva o que ouviu.'); const ok = correct(); w.onResult(ok, ok ? '' : `Ouça de novo. ${diffHint(inp.value, ex.text)}`); };
        b.onclick = go; inp.onkeydown = (e) => { if (e.key === 'Enter') go(); };
      }
      w.answered = () => !!inp.value.trim(); w.check = async () => correct();
      w.reveal = (ok) => { if (!ok) row.appendChild(h(`<span class="pill ok">Frase: ${esc(ex.text)}</span>`)); };
    },
    speak(w) {
      const { ex, body } = w; let best = null, tries = 0;
      body.appendChild(h(`<div class="speak-target"><span class="phrase">${esc(ex.text)}</span>${ex.pt ? `<span class="meta">${esc(ex.pt)}</span>` : ''}</div>`));
      const row = h(`<div class="row"><button type="button" class="btn speak small" data-say="${esc(ex.text)}">🔊 Ouvir modelo</button><button type="button" class="btn primary mic">🎤 Falar</button><span class="meta status"></span></div>`);
      body.appendChild(row);
      const mic = row.querySelector('.mic'), status = row.querySelector('.status');
      const heard = h('<div class="heard" hidden></div>'); body.appendChild(heard);
      const show = (c) => {
        heard.hidden = false;
        heard.innerHTML = `<div class="meta">Você disse: <i>${esc(c.said || '—')}</i></div><div class="words">${c.words.map(x => `<span class="${x.ok ? 'ok' : 'bad'}">${esc(x.w)}</span>`).join(' ')}</div><div class="meta">Pronúncia reconhecida: <b>${Math.round(c.score * 100)}%</b></div>`;
      };
      if (!Rec.available()) {
        mic.disabled = true;
        body.appendChild(h('<div class="feedback info">Seu navegador não tem reconhecimento de voz. Use o <b>Chrome</b> ou o <b>Edge</b> para a prática de fala. Enquanto isso, ouça o modelo e repita em voz alta.</div>'));
        if (w.mode === 'lesson') { const b = h('<div class="row"><button class="btn small">Repeti em voz alta</button></div>'); body.appendChild(b); b.querySelector('button').onclick = () => { w.onResult(true, 'Registrado. Continue praticando a pronúncia.'); b.remove(); }; }
      }
      mic.onclick = async () => {
        mic.disabled = true; mic.textContent = '🎤 Ouvindo…'; status.textContent = 'Fale agora.';
        try {
          const alts = await Rec.listen(s => { status.textContent = s === 'processando' ? 'Processando…' : 'Fale agora.'; });
          const c = bestSpeech(alts, ex.text); tries++;
          if (!best || c.score > best.score) best = c;
          show(c);
          const ok = c.score >= 0.8;
          if (w.mode === 'lesson') w.onResult(ok, ok ? (c.score < 1 ? 'Boa! As palavras em vermelho merecem mais atenção.' : 'Perfeito!') : 'Ouça o modelo e tente de novo, devagar e com clareza.' + (tries >= 3 && !w.done ? ' <br><small>Se o microfone não estiver reconhecendo bem, após 3 tentativas você pode seguir em frente.</small>' : ''));
          if (!ok && tries >= 3 && w.mode === 'lesson' && !w.done && !body.querySelector('.skip')) { const b = h('<div class="row skip"><button class="btn small">Pratiquei, seguir em frente</button></div>'); body.appendChild(b); b.querySelector('button').onclick = () => { w.onResult(true, 'Registrado. Volte a esta frase depois.'); b.remove(); }; }
        } catch (e) { status.textContent = ''; w.fb.hidden = false; w.fb.className = 'feedback info'; w.fb.textContent = recErrorMsg(e); }
        mic.disabled = false; mic.textContent = '🎤 Falar de novo'; status.textContent = '';
      };
      w.answered = () => !!best; w.check = async () => !!best && best.score >= 0.8; w.reveal = () => {};
    },
    write(w) {
      const { ex, body } = w;
      const ta = h('<textarea class="plain" placeholder="Escreva aqui…"></textarea>'); body.appendChild(ta);
      const row = h('<div class="row"><button class="btn primary small">Comparar com o modelo</button></div>'); body.appendChild(row);
      let compared = false;
      row.children[0].onclick = () => {
        if (ta.value.trim().length < 10) return toast('Escreva um pouco mais antes de comparar.');
        if (compared) return; compared = true;
        const box = h(`<div class="feedback info"><b>Resposta modelo:</b><br>${inline(ex.model || '—')}${ex.checklist && ex.checklist.length ? `<div class="checklist" style="margin-top:10px"><b>Confira o seu texto:</b>${ex.checklist.map(c => `<label><input type="checkbox"> <span>${inline(c)}</span></label>`).join('')}</div>` : ''}</div>`);
        body.appendChild(box);
        if (w.mode === 'lesson') { const d = h('<div class="row"><button class="btn ok small">Concluir exercício</button></div>'); body.appendChild(d); d.children[0].onclick = () => { w.onResult(true, 'Produção escrita registrada.'); d.remove(); }; }
      };
      w.answered = () => ta.value.trim().length >= 10; w.check = async () => ta.value.trim().length >= 10; w.reveal = () => {};
    },
  };
  function solutionBox(ex) {
    const d = h(`<details class="solution"><summary>Ver uma solução possível</summary><pre><code class="language-python">${esc(ex.solution)}</code></pre></details>`);
    if (window.hljs) { try { hljs.highlightElement(d.querySelector('code')); } catch (e) {} }
    return d;
  }
  function diffHint(got, want) {
    const g = norm(got).split(' '), t = norm(want).split(' ');
    const k = g.findIndex((x, i) => x !== t[i]);
    if (k === -1 && g.length < t.length) return `Faltou algo depois de "${t[g.length - 1] || ''}".`;
    if (k >= 0) return `Confira a palavra ${k + 1}.`;
    return '';
  }

  // ---------- Rotas ----------
  const app = () => document.getElementById('app');
  function setActiveNav(path) {
    document.querySelectorAll('.topnav a').forEach(a => a.classList.toggle('active', path.startsWith(a.getAttribute('href').slice(1))));
  }
  function route() {
    const hash = location.hash.replace(/^#/, '') || '/';
    const parts = hash.split('/').filter(Boolean);
    setActiveNav(hash);
    window.scrollTo(0, 0);
    try {
      if (!parts.length) return viewHome();
      if (parts[0] === 'curso' && parts[1] && COURSES[parts[1]]) return parts[2] ? viewModule(parts[2]) : viewCourse(parts[1]);
      if (parts[0] === 'licao' && parts[1] && parts[2]) return viewLesson(parts[1], parts[2]);
      if (parts[0] === 'prova' && parts[1]) return viewExam(parts[1]);
      if (parts[0] === 'progresso') return viewProgress();
      if (parts[0] === 'hoje') return viewToday();
      app().innerHTML = '<div class="card"><h2>Página não encontrada</h2><p><a href="#/">Voltar ao início</a></p></div>';
    } catch (e) { console.error(e); app().innerHTML = `<div class="card"><h2>Ops</h2><p>${esc(e.message)}</p><p><a href="#/">Voltar ao início</a></p></div>`; }
  }
  function renderTopStats() {
    const el = document.getElementById('topstats'); if (!el) return;
    el.innerHTML = `<span title="Pontos de experiência">⭐ <b>${P.xp}</b> XP</span><span title="Dias seguidos estudando">🔥 <b>${P.streak.count}</b></span>`;
  }

  // ---------- Views ----------
  function viewHome() {
    const cards = Object.values(COURSES).map(c => {
      const s = courseStats(c.id); const pct = s.lessons ? Math.round(100 * s.lessonsDone / s.lessons) : 0;
      return `<a class="card course-card ${c.id}" href="#/curso/${c.id}"><div class="emoji">${c.emoji}</div><h2>${c.title}</h2><p class="tagline">${c.tagline}</p>
        <div class="progress"><i style="width:${pct}%"></i></div>
        <div class="meta">${s.modules} módulos · ${s.lessons} lições · ~${s.hours} h · <b>${pct}%</b> concluído</div></a>`;
    }).join('');
    const name = P.settings.name ? `, ${esc(P.settings.name)}` : '';
    const n = Object.keys(COURSES).length;
    app().innerHTML = `<section class="hero"><h1>Bem-vindo${name} 👋</h1><p>${n} cursos completos, do zero ao avançado, feitos para <b>30 minutos por dia</b>. Leia a lição, faça os exercícios, passe na prova e libere o próximo nível.</p>
      <p style="margin-top:14px"><a class="btn primary" href="#/hoje">▶ Estudar hoje (30 min)</a></p></section>
      <div class="grid">${cards}</div>
      <section class="card" style="margin-top:24px"><h3 style="margin-top:0">Como funciona</h3>
      <ul><li><b>30 minutos por dia.</b> Cada lição foi dimensionada para caber em uma sessão. A página <a href="#/hoje">Hoje</a> mostra o que fazer: a próxima lição e uma revisão rápida do que você já viu. Não terminou? Pare e continue amanhã — tudo fica salvo.</li>
      <li><b>Lições</b> com explicação, exemplos e exercícios corrigidos na hora. Uma lição fica concluída quando você acerta todos os exercícios.</li>
      <li><b>Provas</b> ao final de cada módulo. Com ${70}% ou mais, o próximo módulo é liberado.</li>
      <li><b>Python no navegador</b>: nos cursos técnicos você escreve e roda código de verdade, sem instalar nada.</li>
      <li><b>Inglês com áudio e microfone</b>: clique nas frases para ouvir; ditados treinam a escuta e os exercícios de fala, a pronúncia.</li>
      <li><b>Progresso</b> salvo neste navegador e exportável em <a href="#/progresso">Progresso</a> para continuar em outro computador. Estude todo dia para manter o 🔥.</li></ul></section>`;
  }

  // Próxima lição pendente de um curso (ou null se o curso terminou / está bloqueado).
  function nextLesson(c) {
    for (const m of c.modules) {
      if (!moduleUnlocked(m)) return { blocked: m };
      for (const l of m.lessons) if (!lessonDone(l)) return { m, l };
      if (!examPassed(m)) return { m, exam: true };
    }
    return null;
  }
  function viewToday() {
    const blocks = Object.values(COURSES).filter(c => c.modules.length).map(c => {
      const s = courseStats(c.id); const nx = nextLesson(c);
      let body;
      if (!nx) body = `<span class="pill ok">Curso concluído 🎉</span>`;
      else if (nx.blocked) body = `<span class="pill">🔒 ${esc(nx.blocked.title)} — passe na prova anterior</span>`;
      else if (nx.exam) body = `<a class="btn primary small" href="#/prova/${nx.m.id}">📝 Fazer a prova de ${esc(nx.m.title)}</a> <span class="meta">~${DAILY_MINUTES} min</span>`;
      else {
        const done = (nx.l.exercises || []).filter((e, i) => P.ex[`${nx.l.id}-e${i}`]).length;
        const started = done > 0;
        body = `<a class="btn primary small" href="#/licao/${nx.m.id}/${nx.l.id}">${started ? '▶ Continuar' : '▶ Começar'}: ${esc(nx.l.title)}</a> <span class="meta">${esc(nx.m.level)} · ${nx.l.minutes || DAILY_MINUTES} min${started ? ` · ${done}/${(nx.l.exercises || []).length} exercícios feitos` : ''}</span>`;
      }
      const left = s.lessons - s.lessonsDone;
      return `<div class="card"><div class="row" style="justify-content:space-between;margin-top:0"><h3 style="margin:0">${c.emoji} ${c.title}</h3><span class="meta">${s.lessonsDone}/${s.lessons} lições${left ? ` · ~${left} dias para terminar` : ''}</span></div><div class="row">${body}</div></div>`;
    }).join('');
    // Revisão rápida: exercícios objetivos de lições já concluídas.
    const pool = [];
    for (const c of Object.values(COURSES)) for (const m of c.modules) for (const l of m.lessons) if (lessonDone(l)) (l.exercises || []).forEach((e, i) => { if (['mc', 'tf', 'fill'].includes(e.type)) pool.push({ e, id: `rev-${l.id}-e${i}`, from: `${c.emoji} ${l.title}` }); });
    const picks = shuffle(pool).slice(0, 5);
    app().innerHTML = `<h1>📅 Hoje</h1><p class="meta">Meta: <b>${DAILY_MINUTES} minutos</b>. Sequência atual: 🔥 ${P.streak.count} dia${P.streak.count === 1 ? '' : 's'}${P.streak.last === today() ? ' — você já estudou hoje!' : ''}. Escolha um curso (ou dois, alternando os dias) e faça a próxima lição. Sobrou tempo? Faça a revisão abaixo.</p>
      <div class="grid">${blocks}</div>
      <section class="card" style="margin-top:20px"><h3 style="margin-top:0">🔁 Revisão rápida</h3>${picks.length ? `<p class="meta">${picks.length} exercícios sorteados de lições que você já concluiu. Revisar espaçadamente é o que fixa na memória.</p><div id="review"></div>` : '<p class="meta">Conclua a primeira lição e a revisão aparece aqui.</p>'}</section>`;
    const box = document.getElementById('review');
    if (box) picks.forEach((p, i) => { const w = makeExercise(p.e, i, 'lesson', p.id); delete P.ex[p.id]; w.el.classList.remove('correct'); w.done = false; w.el.querySelector('.ex-num').textContent += ` · de "${p.from}"`; w.afterCorrect = () => { delete P.ex[p.id]; }; box.appendChild(w.el); });
  }

  function viewCourse(cid) {
    const c = COURSES[cid]; const s = courseStats(cid);
    const list = c.modules.map((m, i) => {
      const unlocked = moduleUnlocked(m), done = moduleComplete(m), ld = moduleLessonsDone(m);
      const ex = P.exams[m.id];
      const status = done ? `<span class="pill ok">Concluído · prova ${ex.best}%</span>` : !unlocked ? '<span class="pill">🔒 Passe na prova anterior</span>' : ld === m.lessons.length ? '<span class="pill warn">Lições prontas · faça a prova</span>' : `<span class="pill">${ld}/${m.lessons.length} lições</span>`;
      return `<div class="card module ${unlocked ? '' : 'locked'} ${done ? 'done' : ''}">
        <div class="badge">${esc(cid === 'ingles' ? m.level : String(i + 1))}</div>
        <div><h3>${esc(m.title)} <span class="meta">· ${esc(m.level)}</span></h3><p>${esc(m.description)}</p>
          <div class="progress ${done ? 'ok' : ''}" style="max-width:260px"><i style="width:${Math.round(100 * ld / m.lessons.length)}%"></i></div>
          <div class="meta">${m.lessons.length} lições · ~${m.hours || '?'} h</div></div>
        <div class="actions">${status}${unlocked ? `<a class="btn ${done ? '' : 'primary'} small" href="#/curso/${cid}/${m.id}">${done ? 'Revisar' : ld ? 'Continuar' : 'Começar'}</a>` : ''}</div></div>`;
    }).join('');
    app().innerHTML = `<div class="crumbs"><a href="#/">Início</a> › ${c.title}</div><h1>${c.emoji} Curso de ${c.title}</h1><p class="meta">${s.modulesDone}/${s.modules} módulos concluídos · ${s.lessonsDone}/${s.lessons} lições · ~${s.hours} horas de estudo no total</p>
      ${c.modules.length ? `<div class="module-list">${list}</div>` : '<div class="notice">Nenhum módulo carregado. Verifique content/manifest.js.</div>'}
      ${P.settings.free ? '<p class="meta" style="margin-top:14px">Modo livre ativado: todos os módulos estão abertos.</p>' : ''}`;
  }

  function viewModule(mid) {
    const m = findModule(mid); if (!m) throw new Error('Módulo não encontrado: ' + mid);
    const c = COURSES[m.course];
    if (!moduleUnlocked(m)) { app().innerHTML = `<div class="card"><h2>🔒 Módulo bloqueado</h2><p>Conclua a prova do módulo anterior para liberar <b>${esc(m.title)}</b>. Ou ative o modo livre em <a href="#/progresso">Progresso</a>.</p><p><a class="btn" href="#/curso/${m.course}">Voltar ao curso</a></p></div>`; return; }
    const ex = P.exams[m.id]; const canExam = examUnlocked(m);
    app().innerHTML = `<div class="crumbs"><a href="#/">Início</a> › <a href="#/curso/${m.course}">${c.title}</a> › ${esc(m.title)}</div>
      <h1>${esc(m.level)} — ${esc(m.title)}</h1><p>${esc(m.description)}</p>
      <ol class="lesson-list">${m.lessons.map((l, i) => `<li class="${lessonDone(l) ? 'done' : ''}"><a href="#/licao/${m.id}/${l.id}"><span class="num">${lessonDone(l) ? '✓' : i + 1}</span><span class="t">${esc(l.title)}</span><span class="meta">${l.minutes ? l.minutes + ' min · ' : ''}${(l.exercises || []).length} exerc.</span></a></li>`).join('')}</ol>
      <div class="card" style="margin-top:20px"><h3 style="margin-top:0">📝 Prova do módulo</h3>
        <p class="meta">${m.exam.questions.length} questões · mínimo ${m.exam.passScore}% para aprovar${ex ? ` · melhor nota: <b>${ex.best}%</b> (${ex.attempts} tentativa${ex.attempts > 1 ? 's' : ''})` : ''}</p>
        ${canExam ? `<a class="btn primary" href="#/prova/${m.id}">${ex ? 'Refazer a prova' : 'Fazer a prova'}</a>` : `<span class="pill">Conclua todas as lições para liberar a prova (${moduleLessonsDone(m)}/${m.lessons.length})</span>`}
        ${ex && ex.passed ? ' <span class="pill ok">Aprovado</span>' : ''}</div>`;
  }

  async function viewLesson(mid, lid) {
    const m = findModule(mid); if (!m) throw new Error('Módulo não encontrado');
    const li = m.lessons.findIndex(l => l.id === lid); const l = m.lessons[li]; if (!l) throw new Error('Lição não encontrada');
    const c = COURSES[m.course];
    if (!moduleUnlocked(m)) return viewModule(mid);
    const side = `<aside class="sidebar card"><p class="side-title">${esc(m.level)} — ${esc(m.title)}</p><ol>${m.lessons.map((x, i) => `<li class="${x.id === lid ? 'active' : ''} ${lessonDone(x) ? 'done' : ''}"><a href="#/licao/${m.id}/${x.id}">${i + 1}. ${esc(x.title)}</a></li>`).join('')}<li class="exam"><a href="#/curso/${m.course}/${m.id}">📝 Prova do módulo</a></li></ol></aside>`;
    app().innerHTML = `<div class="crumbs"><a href="#/">Início</a> › <a href="#/curso/${m.course}">${c.title}</a> › <a href="#/curso/${m.course}/${m.id}">${esc(m.title)}</a></div>
      <div class="lesson-layout">${side}<div><div id="lesson-body"><div class="loading">Carregando a lição…</div></div></div></div>`;
    const body = document.getElementById('lesson-body');
    let md;
    try { md = await fetchMd(l.content); } catch (e) { body.innerHTML = `<div class="notice">Não consegui carregar o texto da lição (${esc(e.message)}). Se abriu o arquivo direto do disco, use um servidor local: <code>python -m http.server</code> na pasta do site.</div>`; return; }
    if (location.hash !== `#/licao/${mid}/${lid}`) return; // usuário já navegou
    body.innerHTML = '';
    const head = h(`<div><div class="meta">Lição ${li + 1} de ${m.lessons.length}${l.minutes ? ` · ~${l.minutes} min` : ''}</div><h1 style="margin-top:4px">${esc(l.title)}</h1></div>`);
    body.appendChild(head);
    body.appendChild(renderMarkdown(md.replace(/^\s*#\s[^\n]*\n/, ''))); // o título já aparece acima
    if (l.vocab && l.vocab.length) {
      const mic = Rec.available();
      const v = h(`<section><h2>📚 Vocabulário da lição</h2><p class="meta">Clique no cartão para ver a tradução; no alto-falante para ouvir${mic ? '; no microfone para treinar a pronúncia' : ''}.</p><div class="vocab"></div></section>`);
      const grid = v.querySelector('.vocab');
      l.vocab.forEach(it => {
        const card = h(`<div class="vocab-card"><div class="en"><span>${esc(it.en)}</span><span class="nowrap"><button type="button" class="btn small ghost" data-say="${esc(it.en)}" title="Ouvir">🔊</button>${mic ? '<button type="button" class="btn small ghost mic" title="Falar">🎤</button>' : ''}</span></div><div class="pt hidden">${esc(it.pt)}</div>${it.example ? `<div class="example hidden">${esc(it.example)}</div>` : ''}<div class="mic-result"></div></div>`);
        card.onclick = (e) => { if (e.target.closest('button')) return; card.querySelectorAll('.pt,.example').forEach(x => x.classList.toggle('hidden')); };
        const mb = card.querySelector('.mic');
        if (mb) mb.onclick = async () => {
          const out = card.querySelector('.mic-result'); mb.disabled = true; out.textContent = 'Ouvindo…';
          try { const c = bestSpeech(await Rec.listen(), it.en); out.innerHTML = c.score >= 0.99 ? '<span class="pill ok">✓ ótimo</span>' : c.score >= 0.5 ? `<span class="pill warn">quase: ouvi "${esc(c.said)}"</span>` : `<span class="pill bad">ouvi "${esc(c.said || '…')}" — tente de novo</span>`; }
          catch (e) { out.innerHTML = `<span class="meta">${esc(recErrorMsg(e))}</span>`; }
          mb.disabled = false;
        };
        grid.appendChild(card);
      });
      body.appendChild(v);
    }
    const exs = l.exercises || [];
    const sec = h(`<section class="exercises"><h2>✏️ Exercícios</h2><p class="meta">Acerte todos para concluir a lição. Cada acerto vale 5 XP.</p></section>`);
    const widgets = exs.map((ex, i) => makeExercise(ex, i, 'lesson', `${l.id}-e${i}`));
    widgets.forEach(w => sec.appendChild(w.el));
    body.appendChild(sec);
    const banner = h('<div class="done-banner" hidden><h3>🎉 Lição concluída!</h3><p></p></div>');
    body.appendChild(banner);
    const next = m.lessons[li + 1];
    const navEl = h(`<div class="lesson-nav">${li > 0 ? `<a class="btn" href="#/licao/${m.id}/${m.lessons[li - 1].id}">← ${esc(m.lessons[li - 1].title)}</a>` : '<span></span>'}${next ? `<a class="btn" href="#/licao/${m.id}/${next.id}">${esc(next.title)} →</a>` : `<a class="btn primary" href="#/curso/${m.course}/${m.id}">Ir para a prova do módulo →</a>`}</div>`);
    body.appendChild(navEl);
    const checkDone = (fresh) => {
      if (!exs.length || widgets.every(w => w.done)) {
        if (!P.done[l.id]) { P.done[l.id] = true; addXp(20); if (fresh) toast('Lição concluída! +20 XP'); }
        banner.hidden = false;
        banner.querySelector('p').innerHTML = next ? `Próxima: <a href="#/licao/${m.id}/${next.id}">${esc(next.title)}</a>` : (examUnlocked(m) ? `Todas as lições prontas. <a href="#/prova/${m.id}">Fazer a prova do módulo</a>.` : `Volte ao <a href="#/curso/${m.course}/${m.id}">módulo</a>.`);
        document.querySelectorAll('.sidebar li.active').forEach(x => x.classList.add('done'));
      }
    };
    widgets.forEach(w => { const orig = w.afterCorrect; w.afterCorrect = () => { orig && orig(); checkDone(true); }; });
    checkDone(false);
    if (!exs.length && !P.done[l.id]) { const b = h('<div class="row"><button class="btn primary">Marcar lição como concluída</button></div>'); b.querySelector('button').onclick = () => { checkDone(true); b.remove(); }; body.insertBefore(b, banner); }
    touchStreak(); save();
  }

  function viewExam(mid) {
    const m = findModule(mid); if (!m) throw new Error('Módulo não encontrado');
    const c = COURSES[m.course];
    if (!moduleUnlocked(m) || !examUnlocked(m)) return viewModule(mid);
    const qs = m.exam.questions;
    app().innerHTML = `<div class="crumbs"><a href="#/">Início</a> › <a href="#/curso/${m.course}">${c.title}</a> › <a href="#/curso/${m.course}/${m.id}">${esc(m.title)}</a> › Prova</div>
      <div class="exam-head"><h1>📝 Prova — ${esc(m.title)}</h1><span class="pill">${qs.length} questões · mínimo ${m.exam.passScore}%</span></div>
      <p class="meta">Responda tudo e clique em <b>Entregar</b>. Você vê a correção no final. Pode refazer quantas vezes quiser; fica registrada a melhor nota.</p>
      <div id="exam-qs"></div>
      <div class="row" style="margin-top:20px"><button class="btn primary" id="exam-submit">Entregar prova</button><span class="meta" id="exam-status"></span></div>
      <div id="exam-result"></div>`;
    const box = document.getElementById('exam-qs');
    const widgets = qs.map((q, i) => makeExercise(q, i, 'exam', `${m.id}-exam-${i}`));
    widgets.forEach(w => box.appendChild(w.el));
    document.getElementById('exam-submit').onclick = async () => {
      const missing = widgets.filter(w => !w.answered());
      if (missing.length && !confirm(`${missing.length} questão(ões) sem resposta. Entregar mesmo assim?`)) return;
      const btn = document.getElementById('exam-submit'); btn.disabled = true;
      const st = document.getElementById('exam-status'); st.textContent = 'Corrigindo…';
      const results = [];
      for (const w of widgets) { let ok = false; try { ok = w.answered() ? await w.check() : false; } catch (e) { ok = false; } results.push(ok); w.el.classList.add(ok ? 'correct' : 'wrong'); w.reveal(ok); w.fb.hidden = false; w.fb.className = 'feedback ' + (ok ? 'ok' : 'bad'); w.fb.innerHTML = (ok ? '<b>Correto.</b> ' : '<b>Errado.</b> ') + (w.ex.explain ? inline(w.ex.explain) : ''); }
      const score = Math.round(100 * results.filter(Boolean).length / results.length);
      const passed = score >= m.exam.passScore;
      const prev = P.exams[m.id] || { best: 0, attempts: 0, passed: false };
      P.exams[m.id] = { best: Math.max(prev.best, score), attempts: prev.attempts + 1, passed: prev.passed || passed, last: score, date: today() };
      if (passed && !prev.passed) addXp(100); else addXp(10);
      save(); st.textContent = '';
      const mods = modulesOf(m.course); const nextMod = mods[mods.indexOf(m) + 1];
      const res = document.getElementById('exam-result');
      res.innerHTML = `<div class="card" style="margin-top:20px;text-align:center"><div class="score ${passed ? 'pass' : 'fail'}">${score}%</div>
        <h3 style="margin:4px 0">${passed ? '🎉 Aprovado!' : 'Ainda não foi desta vez'}</h3>
        <p class="meta">${results.filter(Boolean).length} de ${results.length} questões certas. ${passed ? (nextMod ? `O módulo <b>${esc(nextMod.title)}</b> está liberado.` : 'Você concluiu o último módulo deste curso. Parabéns!') : `Revise as lições e tente de novo (mínimo ${m.exam.passScore}%).`}</p>
        <div class="row" style="justify-content:center">${passed && nextMod ? `<a class="btn primary" href="#/curso/${m.course}/${nextMod.id}">Ir para ${esc(nextMod.title)} →</a>` : ''}<a class="btn" href="#/curso/${m.course}/${m.id}">Voltar ao módulo</a>${!passed ? `<a class="btn" href="#/prova/${m.id}" onclick="setTimeout(()=>location.reload(),0)">Refazer agora</a>` : ''}</div></div>`;
      res.scrollIntoView({ behavior: 'smooth' });
    };
  }

  function viewProgress() {
    const rows = Object.values(COURSES).map(c => {
      const s = courseStats(c.id);
      const mods = c.modules.map(m => { const e = P.exams[m.id]; return `<tr><td>${esc(m.level)} — ${esc(m.title)}</td><td>${moduleLessonsDone(m)}/${m.lessons.length}</td><td>${e ? `${e.best}% ${e.passed ? '<span class="pill ok">aprovado</span>' : '<span class="pill bad">reprovado</span>'} <span class="meta">(${e.attempts}x)</span>` : '—'}</td></tr>`; }).join('');
      return `<div class="card"><h3 style="margin-top:0">${c.emoji} ${c.title}</h3><div class="progress ${s.modulesDone === s.modules && s.modules ? 'ok' : ''}"><i style="width:${s.lessons ? Math.round(100 * s.lessonsDone / s.lessons) : 0}%"></i></div>
        <p class="meta">${s.lessonsDone}/${s.lessons} lições · ${s.modulesDone}/${s.modules} módulos</p>
        <table><thead><tr><th>Módulo</th><th>Lições</th><th>Prova</th></tr></thead><tbody>${mods}</tbody></table></div>`;
    }).join('');
    const exCount = Object.keys(P.ex).length;
    app().innerHTML = `<h1>📊 Seu progresso</h1>
      <div class="stat-grid"><div class="card stat"><div class="n">⭐ ${P.xp}</div><div class="l">XP acumulado</div></div><div class="card stat"><div class="n">🔥 ${P.streak.count}</div><div class="l">dias seguidos</div></div><div class="card stat"><div class="n">${exCount}</div><div class="l">exercícios certos</div></div><div class="card stat"><div class="n">${Object.keys(P.done).length}</div><div class="l">lições concluídas</div></div></div>
      <div class="grid" style="margin-top:16px">${rows}</div>
      <div class="card" style="margin-top:16px"><h3 style="margin-top:0">💾 Levar o progresso para outro computador</h3>
        <p class="meta">O progresso fica salvo só neste navegador. Exporte um arquivo aqui e importe no outro computador (ou no celular). Faça isso ao trocar de máquina. Última alteração: ${P.updated ? new Date(P.updated).toLocaleString('pt-BR') : '—'}</p>
        <div class="row"><button class="btn primary" id="btn-export">⬇ Exportar progresso</button><label class="btn">⬆ Importar progresso <input type="file" id="inp-import" accept="application/json" hidden></label><button class="btn ghost" id="btn-reset">Zerar tudo</button></div></div>
      <div class="card" style="margin-top:16px"><h3 style="margin-top:0">⚙️ Preferências</h3>
        <div class="row"><label>Seu nome: <input type="text" id="inp-name" value="${esc(P.settings.name)}" placeholder="opcional" style="font:inherit;padding:8px 10px;border:1px solid var(--border);border-radius:8px;background:var(--surface);color:var(--text)"></label></div>
        <div class="row"><label class="switch"><input type="checkbox" id="chk-free" ${P.settings.free ? 'checked' : ''}> <span><b>Modo livre</b> — abre todos os módulos e provas sem precisar passar nas anteriores (útil se você já sabe parte do conteúdo).</span></label></div>
        <div class="row"><label>Tema: <select id="sel-theme" style="font:inherit;padding:8px 10px;border:1px solid var(--border);border-radius:8px;background:var(--surface);color:var(--text)"><option value="auto" ${P.settings.theme === 'auto' ? 'selected' : ''}>Automático</option><option value="light" ${P.settings.theme === 'light' ? 'selected' : ''}>Claro</option><option value="dark" ${P.settings.theme === 'dark' ? 'selected' : ''}>Escuro</option></select></label>
        <button class="btn small" id="btn-voice">🔊 Testar voz em inglês</button></div></div>`;
    document.getElementById('btn-export').onclick = () => {
      const blob = new Blob([JSON.stringify(P, null, 2)], { type: 'application/json' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `progresso-cursos-${today()}.json`; a.click(); URL.revokeObjectURL(a.href);
    };
    document.getElementById('inp-import').onchange = (e) => {
      const f = e.target.files[0]; if (!f) return;
      const r = new FileReader();
      r.onload = () => { try { const d = JSON.parse(r.result); if (!d || typeof d !== 'object' || !('done' in d)) throw new Error('formato'); if (!confirm('Substituir o progresso deste navegador pelo do arquivo?')) return; P = Object.assign(defaults(), d); P.settings = Object.assign(defaults().settings, P.settings || {}); save(); applyTheme(); toast('Progresso importado!'); viewProgress(); } catch (err) { toast('Arquivo inválido.'); } };
      r.readAsText(f);
    };
    document.getElementById('btn-reset').onclick = () => { if (confirm('Apagar TODO o progresso deste navegador? Não dá para desfazer (exporte antes, se quiser).')) { P = defaults(); save(); applyTheme(); viewProgress(); } };
    document.getElementById('inp-name').onchange = (e) => { P.settings.name = e.target.value.trim(); save(); };
    document.getElementById('chk-free').onchange = (e) => { P.settings.free = e.target.checked; save(); toast(P.settings.free ? 'Modo livre ativado' : 'Modo livre desativado'); };
    document.getElementById('sel-theme').onchange = (e) => { P.settings.theme = e.target.value; applyTheme(); save(); };
    document.getElementById('btn-voice').onclick = () => speak('Hello! This is your English voice. Nice to meet you.');
  }

  // ---------- Inicialização ----------
  function loadScript(src) {
    return new Promise((res) => { const s = document.createElement('script'); s.src = src + '?v=' + VERSION; s.onload = () => res(true); s.onerror = () => { console.error('Falha ao carregar', src); res(false); }; document.head.appendChild(s); });
  }
  async function boot() {
    load(); renderTopStats();
    const files = window.CONTENT_FILES || [];
    const results = await Promise.all(files.map(loadScript));
    const missing = files.filter((_, i) => !results[i]);
    for (const c of Object.values(COURSES)) c.modules.sort((a, b) => (a.order || 0) - (b.order || 0));
    mergeSpeaking();
    if (missing.length) console.warn('Módulos ausentes:', missing);
    window.addEventListener('hashchange', route);
    route();
    if (location.protocol === 'file:') app().insertAdjacentHTML('afterbegin', '<div class="notice" style="margin-bottom:16px">Você abriu o arquivo direto do disco. As lições e o Python não funcionam assim. Rode <code>python -m http.server 8000</code> nesta pasta e abra <code>http://localhost:8000</code> — ou publique no GitHub Pages.</div>');
  }

  return { boot, COURSES, runPython: (code, tests) => Py.run(code, tests), compareSpeech, speechAvailable: () => Rec.available(), get progress() { return P; } };
})();
