#!/usr/bin/env node
// Valida arquivos de módulo. Uso:
//   node tools/validar.js                         -> valida todos os arquivos do manifest
//   node tools/validar.js content/python/py-01.js -> valida só esse
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { spawnSync } = require('child_process');
const os = require('os');

const ROOT = path.resolve(__dirname, '..');
const TYPES = ['mc', 'tf', 'fill', 'order', 'match', 'code', 'listen', 'write', 'speak'];
const GENERIC = ['Iniciante', 'Básico', 'Intermediário', 'Avançado', 'Profissional', 'Especialista'];
const LEVELS = { python: GENERIC, ingles: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'], ciberseguranca: GENERIC, vibecoding: GENERIC, automacao: GENERIC, claudecode: GENERIC };
const COURSES = Object.keys(LEVELS);
const MAX_MINUTES = 40; // metodologia de 30 min/dia: lições de 20 a 35 min

let files = process.argv.slice(2);
if (!files.length) {
  const manifest = fs.readFileSync(path.join(ROOT, 'content/manifest.js'), 'utf8');
  const ctx = { window: {} };
  vm.runInNewContext(manifest, ctx);
  files = ctx.window.CONTENT_FILES || [];
}

let errors = 0;
let warnings = 0;
const err = (f, m) => { errors++; console.log(`  ERRO  ${f}: ${m}`); };
const warn = (f, m) => { warnings++; console.log(`  aviso ${f}: ${m}`); };

function words(md) {
  return md.replace(/```[\s\S]*?```/g, ' ').split(/\s+/).filter(Boolean).length;
}

function checkExercise(f, ex, where, course) {
  if (!ex || typeof ex !== 'object') return err(f, `${where}: exercício não é objeto`);
  if (!TYPES.includes(ex.type)) return err(f, `${where}: type inválido "${ex.type}"`);
  if (ex.type !== 'listen' && (!ex.q || typeof ex.q !== 'string')) err(f, `${where}: falta q`);
  if (ex.type !== 'write' && !ex.explain) warn(f, `${where}: falta explain`);
  switch (ex.type) {
    case 'mc':
      if (!Array.isArray(ex.options) || ex.options.length < 2) err(f, `${where}: mc precisa de options (>=2)`);
      else if (!Number.isInteger(ex.answer) || ex.answer < 0 || ex.answer >= ex.options.length) err(f, `${where}: mc answer fora do intervalo`);
      break;
    case 'tf':
      if (typeof ex.answer !== 'boolean') err(f, `${where}: tf answer deve ser true/false`);
      break;
    case 'fill':
      if (!Array.isArray(ex.answer) || !ex.answer.length) err(f, `${where}: fill answer deve ser lista não vazia`);
      if (ex.q && !ex.q.includes('___')) warn(f, `${where}: fill sem ___ no enunciado`);
      break;
    case 'order':
      if (!Array.isArray(ex.items) || ex.items.length < 3) err(f, `${where}: order precisa de items (>=3)`);
      break;
    case 'match':
      if (!Array.isArray(ex.pairs) || ex.pairs.length < 3 || !ex.pairs.every(p => Array.isArray(p) && p.length === 2)) err(f, `${where}: match precisa de pairs [[a,b],...] (>=3)`);
      break;
    case 'code':
      if (course === 'ingles') err(f, `${where}: code não é usado no curso de inglês`);
      if (typeof ex.tests !== 'string' || !ex.tests.trim()) err(f, `${where}: code precisa de tests`);
      if (typeof ex.solution !== 'string' || !ex.solution.trim()) err(f, `${where}: code precisa de solution`);
      if (typeof ex.starter !== 'string') warn(f, `${where}: code sem starter`);
      if (/input\s*\(/.test((ex.starter || '') + ex.solution + ex.tests)) err(f, `${where}: input() não funciona no navegador`);
      if (ex.tests && ex.solution) runPython(f, where, ex.solution, ex.tests);
      break;
    case 'listen':
      if (course !== 'ingles') err(f, `${where}: listen só no curso ingles`);
      if (!ex.text) err(f, `${where}: listen precisa de text`);
      break;
    case 'write':
      if (!ex.model) warn(f, `${where}: write sem model`);
      break;
    case 'speak':
      if (course !== 'ingles') err(f, `${where}: speak só no curso ingles`);
      if (!ex.text) err(f, `${where}: speak precisa de text`);
      break;
  }
}

let pythonOk = null;
function runPython(f, where, solution, tests) {
  if (pythonOk === false) return;
  const tmp = path.join(os.tmpdir(), `validar_${process.pid}_${Math.random().toString(36).slice(2)}.py`);
  // Mesma lógica do js/py-worker.js: testes podem usar await no nível superior.
  const prog = `import sys, io, ast, asyncio, linecache\n_src = ${JSON.stringify(solution)}\nlinecache.cache["seu_codigo.py"] = (len(_src), None, _src.splitlines(True), "seu_codigo.py")\n_buf = io.StringIO(); _old = sys.stdout; sys.stdout = _buf\n_ns = {"__name__": "__main__"}\ntry:\n    exec(compile(_src, 'seu_codigo.py', 'exec'), _ns)\nfinally:\n    sys.stdout = _old\n_ns['saida'] = _buf.getvalue()\n_co = compile(${JSON.stringify(tests)}, 'testes', 'exec', flags=ast.PyCF_ALLOW_TOP_LEVEL_AWAIT)\n_r = eval(_co, _ns)\nif asyncio.iscoroutine(_r):\n    asyncio.run(_r)\nprint('OK')\n`;
  fs.writeFileSync(tmp, prog, 'utf8');
  const r = spawnSync('python', ['-I', tmp], { encoding: 'utf8', timeout: 15000 });
  fs.unlinkSync(tmp);
  if (r.error && r.error.code === 'ENOENT') { pythonOk = false; warn(f, 'python não encontrado; pulando testes de code'); return; }
  pythonOk = true;
  if (r.status !== 0 || !/OK\s*$/.test(r.stdout)) {
    const msg = (r.stderr || r.stdout || '').trim().split('\n').slice(-3).join(' | ');
    err(f, `${where}: solution não passa nos tests -> ${msg}`);
  }
}

const allIds = new Set();
for (const rel of files) {
  const f = rel;
  const abs = path.join(ROOT, rel);
  console.log(`\n${rel}`);
  if (!fs.existsSync(abs)) { err(f, 'arquivo não existe'); continue; }
  const mods = []; const speaking = [];
  const ctx = { registerModule: m => mods.push(m), registerSpeaking: s => speaking.push(s), window: {}, console };
  try { vm.runInNewContext(fs.readFileSync(abs, 'utf8'), ctx, { filename: rel }); }
  catch (e) { err(f, `erro de sintaxe: ${e.message}`); continue; }
  if (speaking.length) { // arquivo de frases de fala
    let n = 0;
    for (const map of speaking) for (const [id, list] of Object.entries(map)) {
      if (!allIds.has(id)) warn(f, `fala para lição desconhecida "${id}" (valide o manifest inteiro para conferir)`);
      if (!Array.isArray(list)) { err(f, `${id}: deve ser lista`); continue; }
      for (const it of list) { const t = typeof it === 'string' ? it : it && it.text; if (!t) err(f, `${id}: frase sem texto`); else n++; }
    }
    console.log(`  ${n} frases de fala`);
    continue;
  }
  if (mods.length !== 1) { err(f, `esperava 1 registerModule, achou ${mods.length}`); continue; }
  const m = mods[0];
  if (!COURSES.includes(m.course)) err(f, `course inválido "${m.course}"`);
  if (!m.id || allIds.has(m.id)) err(f, `id ausente ou repetido "${m.id}"`); allIds.add(m.id);
  if (!Number.isInteger(m.order)) err(f, 'order deve ser inteiro');
  if (LEVELS[m.course] && !LEVELS[m.course].includes(m.level)) err(f, `level "${m.level}" inválido para ${m.course}`);
  if (!m.title) err(f, 'falta title');
  if (!m.description) err(f, 'falta description');
  if (!Array.isArray(m.lessons) || m.lessons.length < 4) err(f, `poucas lições (${(m.lessons || []).length})`);
  else if (m.lessons.length < 6 || m.lessons.length > 9) warn(f, `${m.lessons.length} lições (recomendado 6 a 9)`);
  let exCount = 0;
  for (const [i, l] of (m.lessons || []).entries()) {
    const w = `lição ${i + 1} (${l.id || '?'})`;
    if (!l.id || allIds.has(l.id)) err(f, `${w}: id ausente ou repetido`); allIds.add(l.id);
    if (!l.title) err(f, `${w}: falta title`);
    if (!Number.isInteger(l.minutes)) warn(f, `${w}: falta minutes`); else if (l.minutes > MAX_MINUTES) warn(f, `${w}: ${l.minutes} min — acima da meta de 30 min/dia; encurte ou divida a lição`);
    if (!l.content) err(f, `${w}: falta content`);
    else if (!fs.existsSync(path.join(ROOT, l.content))) err(f, `${w}: md não existe: ${l.content}`);
    else {
      const md = fs.readFileSync(path.join(ROOT, l.content), 'utf8');
      const n = words(md);
      if (n < 350) warn(f, `${w}: texto curto (${n} palavras)`);
      if (/<(div|span|script|style|table)\b/i.test(md)) warn(f, `${w}: HTML no markdown`);
      if (m.course === 'ingles' && !/\{\{en:/.test(md) && m.order <= 4) warn(f, `${w}: nenhum {{en:...}} no texto`);
    }
    if (!Array.isArray(l.exercises) || l.exercises.length < 3) err(f, `${w}: poucos exercícios (${(l.exercises || []).length})`);
    else if (l.exercises.length < 6) warn(f, `${w}: só ${l.exercises.length} exercícios (recomendado 6 a 10)`);
    (l.exercises || []).forEach((ex, j) => checkExercise(f, ex, `${w} ex ${j + 1}`, m.course));
    exCount += (l.exercises || []).length;
    if (l.vocab) for (const [k, v] of l.vocab.entries()) if (!v.en || !v.pt) err(f, `${w}: vocab ${k + 1} precisa de en e pt`);
  }
  if (!m.exam || !Array.isArray(m.exam.questions)) err(f, 'falta exam.questions');
  else {
    if (m.exam.questions.length < 10) err(f, `prova com só ${m.exam.questions.length} questões (mínimo 10, recomendado 15)`);
    if (typeof m.exam.passScore !== 'number') err(f, 'exam.passScore deve ser número');
    const codes = m.exam.questions.filter(q => q && q.type === 'code').length;
    if (codes > 3) warn(f, `prova com ${codes} questões code (máximo 3)`);
    m.exam.questions.forEach((q, j) => checkExercise(f, q, `prova q ${j + 1}`, m.course));
  }
  console.log(`  ${m.lessons ? m.lessons.length : 0} lições, ${exCount} exercícios, ${m.exam && m.exam.questions ? m.exam.questions.length : 0} questões de prova`);
}

console.log(`\n${errors} erro(s), ${warnings} aviso(s)`);
process.exit(errors ? 1 : 0);
