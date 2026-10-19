# Esquema de conteúdo — como escrever um módulo

Cada **curso** (`python`, `ingles`, `ciberseguranca`, `vibecoding`, `automacao`, `claudecode`) é formado por **módulos** (níveis). Cada módulo é um arquivo `.js` que chama `registerModule({...})`, mais uma pasta com os textos das lições em Markdown.

```
content/
  python/
    py-01.js              <- módulo (metadados, exercícios, prova)
    py-01/
      01-ola-mundo.md     <- texto da lição 1
      02-variaveis.md
  ingles/
    en-01.js
    en-01/
      01-alfabeto.md
```

## Arquivo do módulo (`py-01.js`)

```js
registerModule({
  course: 'python',            // 'python' | 'ingles' | 'ciberseguranca' | 'vibecoding' | 'automacao' | 'claudecode'
  id: 'py-01',                 // único; prefixo py-, en-, cs-, vc-, au- ou cc-, dois dígitos
  order: 1,                    // posição no curso (1..6)
  level: 'Iniciante',          // Cursos técnicos: Iniciante, Básico, Intermediário, Avançado, Profissional, Especialista
                               // Inglês: A1, A2, B1, B2, C1, C2
  title: 'Fundamentos',
  description: 'Duas ou três frases dizendo o que a pessoa vai saber fazer ao terminar.',
  hours: 10,                   // estimativa de horas de estudo do módulo
  lessons: [
    {
      id: 'py-01-01',          // id do módulo + '-' + dois dígitos
      title: 'Olá, mundo',
      minutes: 25,             // tempo estimado da lição — METODOLOGIA 30 MIN/DIA: entre 20 e 35, nunca acima de 40
      content: 'content/python/py-01/01-ola-mundo.md',   // caminho a partir da raiz do site
      vocab: [                 // OPCIONAL — usado no curso de inglês (flashcards com áudio)
        { en: 'house', pt: 'casa', example: 'My house is small.' },
      ],
      exercises: [ /* ver tipos abaixo */ ],
    },
  ],
  exam: {
    passScore: 70,             // % mínima para aprovar e liberar o próximo módulo
    questions: [ /* mesmos tipos de exercício; 15 questões */ ],
  },
});
```

Regras:
- **Metodologia de 30 minutos por dia:** cada lição é uma sessão de estudo de 20 a 35 minutos (leitura de 600 a 1100 palavras + 6 a 8 exercícios). Se um assunto não cabe, divida em duas lições. `minutes` deve ser realista.
- Um módulo tem **6 a 9 lições**. Cada lição: texto de **600 a 1200 palavras** no `.md` (sem contar código) e **6 a 9 exercícios**.
- A prova tem **15 questões** cobrindo todas as lições do módulo. Em Python, no máximo 3 questões `code`; em inglês, nenhuma `code`.
- Toda explicação é em **português do Brasil**. No curso de inglês, frases, textos e exemplos são em inglês; a explicação gramatical é em português (nos níveis C1/C2 pode ser em inglês).
- Strings de várias linhas (código, `starter`, `tests`, `solution`) usam template literal com crase (`` ` ``). Código Python não contém crase, então não há conflito. Não use `${` dentro delas.
- Todo exercício tem `explain` (uma ou duas frases dizendo **por quê** a resposta é essa) — exceto `write`.

## Tipos de exercício

### `mc` — múltipla escolha (uma resposta)
```js
{ type: 'mc', q: 'Qual função mostra texto na tela?', options: ['show()', 'print()', 'echo()', 'write()'], answer: 1, explain: 'print() é a função embutida que escreve na saída padrão.' }
```
`answer` é o índice (começa em 0). 3 a 5 opções. O site embaralha a ordem das alternativas a cada exibição.

### `tf` — verdadeiro ou falso
```js
{ type: 'tf', q: 'Em Python, a indentação é apenas estética.', answer: false, explain: 'A indentação define os blocos de código.' }
```

### `fill` — completar a lacuna (uma lacuna por exercício, marcada com `___`)
```js
{ type: 'fill', q: 'She ___ (go) to work every day.', answer: ['goes'], explain: 'Terceira pessoa do singular no present simple recebe -s/-es.' }
```
`answer` é uma lista com todas as respostas aceitas. A comparação ignora maiúsculas, espaços extras e pontuação final. Pode incluir código: `q: 'for i in ___(5):'`, `answer: ['range']`.

### `order` — ordenar itens (palavras de uma frase, linhas de código, passos)
```js
{ type: 'order', q: 'Coloque as palavras na ordem correta.', items: ['I', 'have never', 'been', 'to London'], explain: 'Sujeito + have + advérbio + particípio + complemento.' }
```
`items` já vem **na ordem correta**; o site embaralha. 3 a 7 itens.

### `match` — relacionar pares
```js
{ type: 'match', q: 'Relacione a palavra à tradução.', pairs: [['dog', 'cachorro'], ['cat', 'gato'], ['bird', 'pássaro']], explain: 'Vocabulário de animais.' }
```
3 a 6 pares.

### `code` — programar em Python (cursos técnicos; não usar no curso de inglês)
```js
{
  type: 'code',
  q: 'Escreva a função `dobro(n)` que devolve o dobro de n.',
  starter: `def dobro(n):
    pass
`,
  tests: `assert dobro(2) == 4, "dobro(2) deveria ser 4"
assert dobro(-3) == -6, "dobro(-3) deveria ser -6"
`,
  solution: `def dobro(n):
    return n * 2
`,
  hint: 'Use return, não print.',
}
```
- Pode ser usado em qualquer curso técnico (Python, Cibersegurança, Automação, Vibe Coding) quando faz sentido pedir código Python. O código do aluno roda no navegador (Pyodide, Python 3 puro). **Só biblioteca padrão**; nada de `requests`, `pandas`, rede, ou arquivos fora de `/tmp`. Para esses assuntos use `mc`/`fill`/`order`.
- `tests` roda no **mesmo namespace** do código do aluno, depois dele. A variável `saida` contém tudo que o aluno imprimiu (`print`). Exemplo: `assert saida.strip() == "Olá, mundo!", "Imprima exatamente Olá, mundo!"`.
- Use só `assert condição, "mensagem clara em português"`. Sem `input()` (não existe no navegador) — peça funções ou variáveis em vez de leitura do teclado.
- Exercícios de **asyncio**: os `tests` podem usar `await` no nível superior (`r = await minha_coroutine(1)`). Não use `asyncio.run()` nem `run_until_complete` no código do aluno ou nos testes — no navegador já existe um loop rodando.
- O Python do navegador não tem `hashlib.pbkdf2_hmac`/`scrypt`, rede, `threading` real nem pacotes de terceiros.
- `solution` DEVE passar nos `tests` (o validador confere isso rodando Python localmente).

### `listen` — ditado (SOMENTE inglês)
```js
{ type: 'listen', text: 'The meeting starts at nine.', q: 'Ouça e escreva a frase.', explain: 'Horas usam "at".' }
```
O site lê `text` em voz alta (en-US); o aluno digita o que ouviu. Frases de 4 a 12 palavras.

### `speak` — prática de fala (SOMENTE inglês)
```js
{ type: 'speak', q: 'Leia a frase em voz alta.', text: 'Could you send me the invoice by Friday?', pt: 'Você poderia me enviar a fatura até sexta?', explain: 'Pedido educado com could.' }
```
O aluno ouve o modelo e fala no microfone; o site compara palavra a palavra (reconhecimento de voz do Chrome/Edge, en-US) e aceita a partir de 80% das palavras. `pt` é opcional. As frases de fala de cada lição também podem ficar em `content/ingles/fala.js` (gerado por `node tools/gerar-fala.js`), que as acrescenta automaticamente às lições sem exercícios `speak`.

### `write` — produção escrita com autoavaliação (sem correção automática)
```js
{ type: 'write', q: 'Escreva 3 frases sobre sua rotina usando present simple.', model: 'I wake up at 6. I work in an office. I go home at 7.', checklist: ['Usou a 3ª pessoa com -s quando necessário?', 'Cada frase tem sujeito e verbo?'] }
```
Usado em inglês (redações) e, com moderação, em Python (ex.: "explique com suas palavras").

## Texto da lição (`.md`)

- Markdown comum: títulos `##`, listas, tabelas, negrito, blocos de código com linguagem (```python).
- Estrutura didática de cada lição: (1) um parágrafo dizendo o que a pessoa vai saber fazer ao final e por que isso importa; (2) o conceito explicado do simples ao complexo, com analogia quando ajudar; (3) exemplos concretos (código com saída, frases com tradução, casos reais); (4) **Erros comuns** ou **Armadilhas**; (5) **Na prática** — como isso aparece no trabalho; (6) **Resumo** em 3–5 bullets. Títulos `##` para cada parte.
- Explique **por quê**, não só **como**. Mostre exemplos reais e erros comuns.
- Inglês: toda frase em inglês que mereça áudio vai entre `{{en:...}}`. Ex.: `{{en:Nice to meet you.}}` vira um botão que fala a frase. Use bastante em A1–B1.
- Use `> **Dica:**` ou `> **Atenção:**` em blockquote para destaques.
- Não use HTML dentro do Markdown, exceto `<br>`.

## Validar

```
node tools/validar.js content/python/py-01.js
```
Confere o esquema, a existência dos `.md`, os índices das respostas e roda `solution` + `tests` de cada `code` no Python local. Corrija tudo que ele apontar antes de terminar.
