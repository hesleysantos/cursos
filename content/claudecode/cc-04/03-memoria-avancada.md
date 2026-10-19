Nesta lição você vai aprofundar a memória do Claude Code: `CLAUDE.md` por pasta, importação de outros arquivos com `@caminho`, a diferença entre memória do usuário e do projeto, as regras em `.claude/rules/`, o que **não** colocar nesses arquivos e como mantê-los. Ao final, você monta o conjunto completo de memória para um repositório de automações contábeis. No módulo 1 você aprendeu o que é o `CLAUDE.md`; aqui ele vira um sistema.

## Os arquivos de memória e onde ficam

A documentação lista estes arquivos, do mais amplo ao mais específico (nessa ordem eles entram no contexto):

| Escopo | Local | Para quê | Compartilhado com |
| --- | --- | --- | --- |
| Política gerenciada | No Windows, `C:\Program Files\ClaudeCode\CLAUDE.md` | Regras da organização, impostas por TI | Todos na empresa |
| Usuário | `~/.claude/CLAUDE.md` | Suas preferências em todos os projetos | Só você |
| Projeto | `./CLAUDE.md` ou `./.claude/CLAUDE.md` | Regras do projeto, via Git | O time |
| Local | `./CLAUDE.local.md` | Suas preferências só neste projeto; vai no `.gitignore` | Só você |

Além disso, o Claude Code lê os `CLAUDE.md` das pastas **acima** da pasta onde você o iniciou (iniciado em `automacoes/conciliador/`, lê `automacoes/CLAUDE.md` e `automacoes/conciliador/CLAUDE.md`) e descobre os `CLAUDE.md` de **subpastas**, que são carregados sob demanda, quando o Claude lê ou edita um arquivo daquela subpasta. Tudo é concatenado, não sobrescrito: o conteúdo mais próximo da sua pasta de trabalho é lido por último.

Há também a **memória automática**, notas que o próprio Claude escreve a partir das suas correções e preferências, carregadas em toda sessão. Ela pode ser ligada ou desligada pela chave `autoMemoryEnabled` e consultada com `/memory`, que também abre os `CLAUDE.md` para edição.

## Imports com @caminho

Um `CLAUDE.md` pode importar outros arquivos com a sintaxe `@caminho/do/arquivo`. O conteúdo importado é expandido e carregado no início da sessão junto com o `CLAUDE.md` que o referencia. Caminhos relativos resolvem a partir do arquivo que contém o import, não da pasta de trabalho; imports podem importar outros imports, até **quatro níveis**. Para citar um caminho sem importá-lo, coloque-o entre crases: `` `@README` `` é texto; `@README` fora de crases importa o arquivo. Caminhos com espaço precisam de barra invertida antes de cada espaço.

```markdown
Veja @README.md para a visão geral e @docs/plano-de-contas.md para as contas usadas.

# Instruções adicionais
- Fluxo de Git: @docs/git-fluxo.md
```

Imports que apontam para fora da pasta de trabalho (por exemplo `@~/.claude/minhas-regras.md`) são considerados externos: na primeira vez, o Claude Code mostra um diálogo pedindo aprovação, para protegê-lo de arquivos que outras pessoas commitaram no projeto.

## Regras em .claude/rules/

Para projetos maiores, em vez de um `CLAUDE.md` gigante, use a pasta `.claude/rules/` com um arquivo Markdown por assunto (`testes.md`, `planilhas.md`, `seguranca.md`). Arquivos sem cabeçalho são carregados no início, com a mesma prioridade do `.claude/CLAUDE.md`. Com o cabeçalho `paths`, a regra só entra no contexto quando o Claude trabalha em arquivos que casam com o padrão:

```markdown
---
paths:
  - "leitores/**/*.py"
---
# Regras para leitores de arquivos
- Sempre declarar encoding ao abrir arquivos (cp1252 para exportações do sistema antigo).
- Devolver listas de dicionários com chaves em snake_case.
```

Regras pessoais, válidas em todos os projetos, vão em `~/.claude/rules/`. A documentação recomenda manter cada `CLAUDE.md` com menos de 200 linhas: arquivos longos consomem contexto e reduzem a aderência; o que só interessa a uma parte do código vai para regras com `paths`.

## Memória do usuário versus do projeto

A regra prática: no `~/.claude/CLAUDE.md` vai o que é **seu** e vale em qualquer projeto (estilo de resposta, idioma, ferramentas que prefere, "explique antes de editar"). No `CLAUDE.md` do projeto vai o que é **do projeto** e vale para qualquer pessoa (comandos de teste, estrutura de pastas, regras de negócio, convenções). No `CLAUDE.local.md` vai o que é seu e só deste projeto (caminho da sua pasta de amostras, URL de homologação). Se um colega clonar o repositório e algo deixar de funcionar, a instrução estava no lugar errado.

## O que não colocar

- **Segredos**: senhas, tokens, chaves. O arquivo vai para o Git e para o contexto do modelo.
- **Dados de clientes**: CNPJ, nomes, valores reais; use exemplos fictícios.
- **Procedimentos longos** que só valem em certas tarefas: viram skills (próxima lição), carregadas só quando necessárias.
- **Instruções vagas** ("formate bem"): prefira verificáveis ("use 4 espaços; rode `ruff format .`").
- **Regras que precisam ser garantidas**: o `CLAUDE.md` é contexto, não imposição. Para bloquear uma ação de verdade, use permissões (lição 2) ou um hook `PreToolUse` (lição 6).
- **Instruções contraditórias** entre arquivos: o Claude pode escolher qualquer uma.

## Manutenção

Acrescente ao `CLAUDE.md` quando o Claude errar a mesma coisa pela segunda vez, quando uma revisão pegar algo que ele deveria saber ou quando você digitar a mesma correção que digitou na sessão anterior. Use `/init` para gerar um ponto de partida (se o arquivo já existe, `/init` sugere melhorias) e `/context` para confirmar que os arquivos de memória foram carregados. O comando `/doctor prompt-audit` pede ao Claude que procure instruções desatualizadas, referências a arquivos que não existem e contradições, e propõe correções sem alterar nada até você aprovar. Revise os arquivos a cada mudança grande no projeto.

## Exemplo completo: repositório de automações contábeis

Estrutura:

```text
automacoes/
├── CLAUDE.md                  # regras gerais do repositório
├── CLAUDE.local.md            # suas preferências (no .gitignore)
├── .claude/
│   └── rules/
│       ├── planilhas.md       # paths: "**/planilhas/**"
│       └── seguranca.md       # sempre carregada
├── docs/
│   └── plano-de-contas.md
├── conciliador/
│   └── CLAUDE.md              # carregado quando o Claude mexe aqui
└── consolidador/
    └── CLAUDE.md
```

`automacoes/CLAUDE.md`:

```markdown
# Automações do escritório

Python 3.12 no Windows. Cada robô tem sua pasta, seu `.venv` e seu `requirements.txt`.

## Comandos
- Testes: `pytest` dentro da pasta do robô.
- Qualidade: `ruff check .` e `black .` antes de commitar.

## Regras
- Regra de negócio em funções puras; Excel, PDF e arquivos só nas pontas.
- Dinheiro em centavos inteiros; datas como `datetime.date`.
- Nunca usar dados reais de clientes em testes ou exemplos.
- TDD: testes antes da implementação; não alterar testes para passar.

Plano de contas usado nos lançamentos: @docs/plano-de-contas.md
```

`conciliador/CLAUDE.md` traz só o que é específico: formato do OFX aceito, tolerância padrão, nomes das abas de saída. `CLAUDE.local.md` guarda, por exemplo, "amostras em `C:\Users\ana\amostras`".

## Erros comuns

- `@caminho` com a intenção de citar, e o arquivo é importado inteiro no contexto.
- Mais de 200 linhas no `CLAUDE.md` e queda de aderência.
- Regra que deveria ser garantida escrita como instrução (e depois descumprida).
- `CLAUDE.local.md` commitado por falta do `.gitignore`.
- Regras com `paths` em padrões que não casam com os arquivos reais (confira a extensão).

## Na prática

O conjunto acima leva uma hora para montar e economiza a mesma hora toda semana: ninguém repete "centavos inteiros" ou "não use dados reais" em prompt, o Claude segue as convenções por padrão e o novo colega entende o repositório lendo o mesmo arquivo. A auditoria mensal com `/doctor prompt-audit` mantém o conjunto enxuto.

## Resumo

- Memória: gerenciada, usuário (`~/.claude/CLAUDE.md`), projeto (`CLAUDE.md` ou `.claude/CLAUDE.md`), local (`CLAUDE.local.md`), pastas acima e subpastas sob demanda, mais a memória automática.
- `@caminho` importa arquivos (até 4 níveis); entre crases, é só texto; imports externos pedem aprovação.
- `.claude/rules/` divide por assunto; `paths` carrega a regra só nos arquivos certos.
- Usuário = seu em todo projeto; projeto = de todos; local = seu neste projeto.
- Sem segredos, sem dados reais, sem procedimentos longos; para garantias, permissões e hooks.
- Mantenha com `/init`, `/context`, `/memory` e `/doctor prompt-audit`.
