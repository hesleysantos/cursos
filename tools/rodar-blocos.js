#!/usr/bin/env node
// Roda cada bloco ```python de arquivos .md no Python local e mostra os que dão erro
// (SyntaxError, NameError...). Serve para a revisão: um bloco pode ser um trecho
// incompleto de propósito, então julgue cada caso. Uso:
//   node tools/rodar-blocos.js content/python/py-01/*.md
//   node tools/rodar-blocos.js content/python/py-01        (pasta inteira)
const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawnSync } = require('child_process');

let files = process.argv.slice(2);
if (!files.length) { console.log('informe arquivos .md ou pastas'); process.exit(1); }
files = files.flatMap(f => fs.statSync(f).isDirectory() ? fs.readdirSync(f).filter(x => x.endsWith('.md')).map(x => path.join(f, x)) : [f]);

let total = 0, bad = 0;
for (const f of files) {
  const md = fs.readFileSync(f, 'utf8');
  const re = /```python[^\n]*\n([\s\S]*?)```/g; let m, i = 0;
  while ((m = re.exec(md))) {
    i++; total++;
    const code = m[1];
    if (/input\s*\(/.test(code)) { console.log(`  ~ ${f} bloco ${i}: usa input() (não executado)`); continue; }
    const tmp = path.join(os.tmpdir(), `bloco_${process.pid}_${i}.py`);
    fs.writeFileSync(tmp, code, 'utf8');
    const r = spawnSync('python', ['-I', tmp], { encoding: 'utf8', timeout: 10000, cwd: os.tmpdir() });
    fs.unlinkSync(tmp);
    if (r.status !== 0) {
      bad++;
      const last = (r.stderr || '').trim().split('\n').filter(Boolean).slice(-1)[0] || `exit ${r.status}`;
      const line = (m.index > 0 ? md.slice(0, m.index).split('\n').length : 1);
      console.log(`  ✘ ${f}:${line} bloco ${i}: ${last}`);
    }
  }
}
console.log(`\n${total} blocos, ${bad} com erro de execução`);
