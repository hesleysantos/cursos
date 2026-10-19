# 🎓 Meus Cursos — 6 cursos do zero ao avançado, 30 minutos por dia

Site estático com seis cursos completos, exercícios corrigidos na hora, provas por módulo, progresso e uma metodologia de **30 minutos por dia**. Não precisa de servidor nem banco de dados: roda inteiro no navegador e pode ser publicado de graça no **GitHub Pages**.

| Curso | Níveis | Destaques |
|---|---|---|
| 🐍 **Python** | Iniciante → Básico → Intermediário → Avançado → Profissional → Especialista | Você escreve e **roda Python de verdade no navegador** (Pyodide), com testes automáticos |
| 🇬🇧 **Inglês** | A1 → A2 → B1 → B2 → C1 → C2 (CEFR), inglês americano | Áudio em todas as frases, ditados, **prática de fala com microfone**, flashcards, produção escrita |
| 🛡️ **Cibersegurança** | Iniciante → Especialista | Higiene digital, redes, criptografia, ataques (ética), Blue Team, LGPD/ISO 27001, carreira |
| 🤖 **IA, Vibe Coding e No Code** | Iniciante → Especialista | Como a IA funciona, prompts, no-code (Airtable/Softr/Bubble), vibe coding (Cursor/Claude Code/Lovable), apps completos, agentes |
| ⚙️ **Automação e IA** | Iniciante → Especialista | Mapear processos, Make/n8n, Python para automação, IA em automações (JSON, OCR, RAG), agentes, automação contábil |
| 💻 **Claude Code** | Iniciante → Especialista | Agente de programação no terminal: uso diário, projetos com Python, settings/permissões, CLAUDE.md, skills, subagentes, hooks, MCP, modo não interativo, GitHub Actions, Agent SDK, governança |

**Números:** 36 módulos, 314 lições, mais de 2.500 exercícios e 540 questões de prova. Cada módulo tem 7–9 lições (texto + 6–9 exercícios) e uma **prova de 15 questões**. Com 70% ou mais você libera o próximo módulo. Tudo em português do Brasil, com exemplos do dia a dia de um escritório contábil.

## Metodologia: 30 minutos por dia

- Cada lição foi dimensionada para uma sessão de 20–35 minutos (leitura + exercícios). Não terminou? Pare e continue amanhã: cada exercício certo fica salvo.
- A página **Hoje** mostra a próxima lição de cada curso e uma **revisão rápida** com exercícios sorteados de lições já concluídas (repetição espaçada).
- Estude um curso por vez ou alterne dois (dias pares/ímpares). A sequência de dias 🔥 no topo acompanha a constância.
- As provas liberam o nível seguinte; o **Modo livre** (em Progresso) abre tudo se você já domina parte do conteúdo.

## Publicar no GitHub Pages (uma vez)

1. Crie um repositório **público** no GitHub (o Pages gratuito exige repositório público), por exemplo com o nome `cursos`.
2. Nesta pasta, rode:
   ```bash
   git init
   git add .
   git commit -m "Site de cursos"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/cursos.git
   git push -u origin main
   ```
3. No GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main` / `(root)` → Save**.
4. Em um ou dois minutos o site estará em `https://SEU-USUARIO.github.io/cursos/`. Salve esse endereço nos favoritos de todos os seus computadores e do celular.

Toda vez que alterar algo, basta `git add . && git commit -m "..." && git push` e o site atualiza sozinho. Ao mudar conteúdo ou o `app.js`, troque também a versão (`VERSION` em `js/app.js` e o `?v=` no `index.html`) para o navegador dos alunos não usar arquivos antigos em cache.

## Rodar no seu computador

Abrir o `index.html` com dois cliques **não funciona** (o navegador bloqueia o carregamento das lições por `file://`). Use um servidor local:

```bash
python -m http.server 8000
```

e abra <http://localhost:8000>.

## Seu progresso em vários computadores

O progresso (lições concluídas, exercícios, notas das provas, XP, sequência de dias) fica salvo no navegador (`localStorage`). Para continuar em outro computador:

1. Na página **Progresso**, clique em **Exportar progresso** — baixa um arquivo `.json`.
2. No outro computador, abra o site, vá em **Progresso → Importar progresso** e escolha o arquivo.

Faça isso sempre que trocar de máquina. Se quiser pular a trava de módulos, ative o **Modo livre** na mesma página.

## Estrutura

```
index.html              página única (SPA)
css/style.css           visual (claro/escuro automático, responsivo)
js/app.js               motor: rotas, exercícios, provas, progresso, áudio
js/py-worker.js         Python no navegador (Pyodide em Web Worker, com timeout)
content/manifest.js     lista dos módulos carregados
content/SCHEMA.md       como escrever/alterar conteúdo
content/python/py-NN.js + py-NN/*.md          módulos de Python
content/ingles/en-NN.js + en-NN/*.md          módulos de Inglês (+ fala.js)
content/ciberseguranca/cs-NN.js + cs-NN/      módulos de Cibersegurança
content/vibecoding/vc-NN.js + vc-NN/          módulos de IA, Vibe Coding e No Code
content/automacao/au-NN.js + au-NN/           módulos de Automação e IA
content/claudecode/cc-NN.js + cc-NN/          módulos de Claude Code
tools/validar.js        valida o conteúdo (node tools/validar.js)
tools/rodar-blocos.js   roda os blocos de código Python dos textos
tools/gerar-fala.js     regenera as frases de prática de fala do inglês
tools/REVISAO.md        roteiro de revisão de qualidade de um módulo
tools/REVISAO-2.md      protocolo da revisão final linha por linha
tools/CLAUDE-CODE-FONTES.md  fontes oficiais usadas no curso de Claude Code
```

## Alterar ou acrescentar conteúdo

Leia `content/SCHEMA.md`. Cada lição é um arquivo Markdown + uma lista de exercícios no `.js` do módulo. Depois de editar, valide:

```bash
node tools/validar.js
```

Ele confere o formato, os índices das respostas e roda a solução de cada exercício de código contra os testes (precisa de `node` e `python` instalados).

## Prática de fala (microfone)

Nas lições de inglês há exercícios **Fale**: você ouve a frase-modelo, clica em 🎤 e lê em voz alta; o site mostra palavra a palavra o que reconheceu e aceita a partir de 80%. Nos flashcards de vocabulário, o 🎤 confere a pronúncia de cada palavra.

- Funciona no **Chrome** e no **Edge** (usa o reconhecimento de voz do navegador, en-US, que precisa de internet). No Firefox/Safari o exercício vira "ouça e repita" com registro manual.
- Na primeira vez o navegador pede permissão para usar o microfone — aceite. O site precisa estar em `https://` (GitHub Pages) ou `localhost`.
- As frases de cada lição ficam em `content/ingles/fala.js`; `node tools/gerar-fala.js` as regenera a partir dos ditados e exemplos de vocabulário.

## Tecnologias

HTML/CSS/JS puros, sem build. Bibliotecas via CDN: [marked](https://marked.js.org/) (Markdown), [highlight.js](https://highlightjs.org/) (realce de código), [Pyodide](https://pyodide.org/) (Python 3 em WebAssembly). Áudio do inglês pela Web Speech API do navegador (funciona melhor no Chrome/Edge).
