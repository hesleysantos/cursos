#!/usr/bin/env node
// Gera content/ingles/fala.js: 2 frases de prática de fala por lição de inglês,
// tiradas dos ditados (listen) e dos exemplos de vocabulário já existentes.
// Uso: node tools/gerar-fala.js   (rode de novo se mudar o conteúdo)
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const manifest = fs.readFileSync(path.join(ROOT, 'content/manifest.js'), 'utf8');
const mctx = { window: {} }; vm.runInNewContext(manifest, mctx);
const mods = [];
for (const rel of mctx.window.CONTENT_FILES) {
  if (!/content\/ingles\/en-\d+\.js$/.test(rel)) continue;
  const ctx = { registerModule: m => mods.push(m), registerSpeaking() {}, window: {}, console };
  vm.runInNewContext(fs.readFileSync(path.join(ROOT, rel), 'utf8'), ctx, { filename: rel });
}
mods.sort((a, b) => a.order - b.order);

const wc = s => s.trim().split(/\s+/).length;
const out = {};
let total = 0;
for (const m of mods) for (const l of m.lessons) {
  const picked = [];
  const seen = new Set();
  const add = t => { t = String(t).trim(); if (!t || seen.has(t.toLowerCase())) return; seen.add(t.toLowerCase()); picked.push(t); };
  for (const e of l.exercises || []) if (e.type === 'listen' && e.text) add(e.text);
  const examples = (l.vocab || []).map(v => v.example).filter(Boolean).filter(t => wc(t) >= 4 && wc(t) <= 14).sort((a, b) => wc(a) - wc(b));
  for (const ex of examples) { if (picked.length >= 2) break; add(ex); }
  if (picked.length < 2) for (const e of l.exercises || []) { if (picked.length >= 2) break; if (e.type === 'order' && e.items && e.items.every(x => /^[A-Za-z' ,.!?-]+$/.test(x))) add(e.items.join(' ')); }
  out[l.id] = picked.slice(0, 2);
  total += out[l.id].length;
}

const lines = ["// Frases de prática de fala por lição (geradas por tools/gerar-fala.js; pode editar à mão).", 'registerSpeaking({'];
for (const [id, list] of Object.entries(out)) lines.push(`  '${id}': [${list.map(t => JSON.stringify(t)).join(', ')}],`);
lines.push('});', '');
fs.writeFileSync(path.join(ROOT, 'content/ingles/fala.js'), lines.join('\n'), 'utf8');
console.log(`content/ingles/fala.js: ${Object.keys(out).length} lições, ${total} frases`);
