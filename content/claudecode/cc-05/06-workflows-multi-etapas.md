# Workflows multi-etapas

Nesta lição você vai aprender a montar trabalhos **grandes** com o Claude Code sem perder o controle: encadear prompts, dividir o trabalho em partes com entregas claras, usar o Git como ponto de retorno, rodar sessões em paralelo com *worktrees* e delegar pedaços independentes a subagentes. O exemplo condutor é um relatório mensal montado a partir de várias fontes.

## Por que dividir

Um único prompt "gere o relatório mensal do cliente" tende a falhar por dois motivos que a documentação de boas práticas repete: a janela de contexto enche rápido e o desempenho cai conforme ela enche; e sem um critério verificável o agente para quando "parece pronto". Dividir em etapas resolve os dois: cada etapa tem contexto menor e um resultado checável.

O fluxo recomendado na doc é **explorar → planejar → implementar → commitar**. Em automação, cada seta vira uma execução separada com entrada e saída definidas.

## Encadear prompts

Há duas formas de encadear. A primeira é **continuar a mesma conversa**, útil quando a etapa seguinte depende do que o agente já leu:

```bash
claude -p "Leia os extratos em dados/2026-09/ e liste os lançamentos sem conciliação" --allowedTools "Read,Grep"
claude -p "Agora agrupe esses lançamentos por fornecedor e estime o total" --continue
claude -p "Gere um resumo de uma página em Markdown em relatorios/pendencias.md" --continue --allowedTools "Edit"
```

A segunda é **sessões independentes conectadas por arquivos**: cada execução lê a saída da anterior em disco. É mais robusta para agendamento, porque não depende de a sessão anterior existir, e mais barata, porque cada etapa começa com contexto limpo. Se precisar de uma sessão específica, capture `session_id` da saída JSON e use `--resume`.

## Checkpoints com Git

O Claude Code tem *checkpoints* internos (`/rewind` restaura código e conversa), mas a própria documentação avisa que eles só rastreiam edições feitas pelas ferramentas de arquivo e **não substituem o Git**. Em workflows longos, faça um commit ao fim de cada etapa bem-sucedida:

```bash
claude -p "Etapa 2: conciliar e gravar resultados em dados/conciliado.csv" --allowedTools "Read,Edit,Bash(python *)"
git add -A && git commit -m "relatorio: etapa 2 conciliada"
```

Se a etapa 3 estragar algo, `git checkout -- .` ou `git reset --hard HEAD` volta ao ponto bom. Em scripts, só avance para a próxima etapa se a anterior saiu com código `0` e os testes passaram.

## Sessões paralelas com worktrees

Quando duas partes do trabalho são independentes e mexem em arquivos diferentes, rode-as ao mesmo tempo. A documentação descreve **git worktrees**: cada sessão ganha uma cópia própria dos arquivos e um branch, compartilhando o histórico. Com a flag `--worktree` (ou `-w`), o Claude Code cria o worktree em `.claude/worktrees/<nome>/`, no branch `worktree-<nome>`:

```bash
claude --worktree relatorio-fiscal
claude --worktree relatorio-folha
```

Em dois terminais, cada sessão trabalha isolada. Ao sair, o Claude Code remove automaticamente o worktree que ficou limpo (se a sessão tiver nome, ele pergunta antes) e pergunta o que fazer com os que têm trabalho; em execuções `-p` ele **não limpa**, então remova depois com `git worktree remove`. A doc recomenda adicionar `.claude/worktrees/` ao `.gitignore`. Para copiar arquivos ignorados como `.env` para cada worktree, crie um `.worktreeinclude`.

Não paralelize quando as partes editam os mesmos arquivos (haverá conflito no merge) ou quando a segunda depende da saída da primeira. Paralelize quando as fontes são distintas e o resultado é combinado no fim.

## Subagentes para tarefas independentes

Dentro de uma sessão, subagentes rodam em **contexto separado** e devolvem só um resumo, o que mantém a conversa principal limpa. Peça explicitamente: "use subagentes para investigar X". Um subagente pode ter `isolation: worktree` no frontmatter para editar sem conflitar. Para lotes grandes de mudanças, o comando `/batch <instrução>` decompõe o trabalho em 5 a 30 unidades, cada uma em um subagente com worktree próprio.

A doc também sugere o padrão **escritor/revisor**: uma sessão implementa, outra, com contexto fresco, revisa; ou um subagente revisor confere o diff contra o plano. Quem fez o trabalho não deveria ser quem o aprova.

## Exemplo: relatório mensal de várias fontes

Fontes: extratos bancários (CSV), notas fiscais (XML), folha (planilha) e o razão do sistema contábil (exportação). Arquitetura em quatro etapas:

1. **Coleta** (3 execuções paralelas, uma por fonte, cada uma com `--allowedTools "Read"` e um esquema JSON de totais): produz `coleta/banco.json`, `coleta/nf.json`, `coleta/folha.json`.
2. **Conciliação** (1 execução): lê os três arquivos e o razão, grava `conciliado.json` com divergências. Commit.
3. **Redação** (1 execução): gera `relatorio.md` a partir de `conciliado.json`, com um prompt que exige seções fixas e números citando a fonte. Commit.
4. **Revisão** (1 execução em sessão nova ou subagente): confere se todo número do relatório existe em `conciliado.json`; devolve lista de problemas em JSON. Se vazia, o script abre o PR.

Dividir o lote de fontes em grupos de tamanho fixo é a lógica que o exercício de código desta lição pede: é ela que decide quantas execuções paralelas o script dispara.

```text
Você é o redator do relatório mensal. Use APENAS os números de conciliado.json.
Estrutura obrigatória: 1) Resumo executivo (5 linhas); 2) Receitas; 3) Despesas;
4) Divergências encontradas (tabela: origem, valor, ação sugerida); 5) Pendências.
Cite a origem de cada número entre parênteses. Não invente valores ausentes: escreva "não disponível".
```

## Erros comuns

- Um prompt gigante para tudo: contexto cheio, resultado "parece pronto".
- Encadear com `--continue` em tarefas agendadas: se outra sessão rodou no meio, você continua a conversa errada; prefira arquivos ou `--resume <id>`.
- Paralelizar partes que editam os mesmos arquivos.
- Esquecer de limpar worktrees de execuções `-p`.
- Pular o commit entre etapas e depois não ter para onde voltar.
- Revisar com a mesma sessão que escreveu: o viés de quem produziu permanece.

## Na prática

No escritório, o relatório mensal é o caso perfeito: fontes separadas, resultado combinado, prazo fixo. Comece sequencial (coleta → conciliação → redação → revisão) com commits entre etapas. Quando funcionar, paralelize só a coleta. Mantenha um `CLAUDE.md` com as regras contábeis fixas e esquemas JSON em arquivos versionados, para que as etapas falem a mesma língua.

## Resumo

- Divida trabalhos grandes em etapas com entrada, saída e verificação; cada etapa é uma execução.
- Encadeie por `--continue`/`--resume` quando a memória importa; por arquivos quando a robustez importa.
- Commit entre etapas é o checkpoint confiável; `/rewind` não substitui o Git.
- `claude --worktree <nome>` isola sessões paralelas em `.claude/worktrees/`; use só para partes independentes.
- Subagentes e `/batch` dividem trabalho dentro da sessão; revise com contexto fresco.
