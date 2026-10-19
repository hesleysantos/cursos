Nesta lição você vai criar **subagentes**: assistentes especializados, com instruções, ferramentas e modelo próprios, que o Claude Code chama para tarefas delimitadas e que devolvem um resumo para a conversa principal. Você vai aprender o formato do arquivo em `.claude/agents/`, os campos do cabeçalho, como o Claude decide delegar e quando delegar vale a pena, com dois exemplos: um "revisor" e um "testador". Subagentes são a forma de ter um revisor que não viu o código ser escrito, sem abrir outro terminal.

## O que é um subagente

Um subagente é um arquivo Markdown com cabeçalho YAML; o corpo vira o prompt de sistema daquele agente. Quando o Claude delega uma tarefa, o subagente roda em um contexto separado, com as ferramentas que você permitiu, e devolve um relatório. A conversa principal não vê os passos intermediários, só o resultado, o que mantém o contexto principal limpo.

Onde ficam, por prioridade (quando os nomes colidem, o nível mais alto vence):

1. Configurações gerenciadas (organização).
2. Flag `--agents` na linha de comando (só aquela sessão).
3. `.claude/agents/` (projeto; vai para o Git).
4. `~/.claude/agents/` (todos os seus projetos).
5. Pasta `agents/` de um plugin.

A identidade vem do campo `name`, não do nome do arquivo. Alterações nos arquivos são detectadas em segundos; só uma pasta `agents/` recém-criada exige reiniciar a sessão.

## Os campos do cabeçalho

Só `name` e `description` são obrigatórios; campos desconhecidos são ignorados em silêncio. Os documentados que mais importam:

- `name`: identificador único (sem `:`).
- `description`: quando o Claude deve delegar a este agente.
- `tools`: lista de ferramentas permitidas (string separada por vírgulas ou lista YAML); sem o campo, herda todas as disponíveis a subagentes.
- `disallowedTools`: lista de proibidas, aplicada antes de `tools`.
- `model`: `sonnet`, `opus`, `haiku`, um nome completo ou `inherit` (o mesmo da conversa).
- `permissionMode`: `default`, `acceptEdits`, `auto`, `dontAsk`, `bypassPermissions` ou `plan`.
- `maxTurns`: número máximo de turnos antes de parar e devolver resultado parcial.
- `skills`: skills cujo conteúdo é injetado no início.
- `hooks`: hooks que valem só enquanto este agente roda.
- `memory`: memória persistente do agente (`user`, `project` ou `local`).
- `background: true`: roda em segundo plano.
- `isolation: worktree`: roda em uma cópia temporária do repositório (git worktree).
- `effort`: `low`, `medium`, `high`, `xhigh` ou `max`.
- `color`: cor de exibição.

## Exemplo 1: o revisor

Arquivo `.claude/agents/revisor.md`:

```markdown
---
name: revisor
description: Revisa código Python de automações contábeis em busca de bugs, riscos de segurança e casos de borda. Use proativamente depois de qualquer alteração em arquivos .py antes de commitar.
tools: Read, Glob, Grep, Bash
model: sonnet
---

Você é um revisor sênior que não confia no autor. Você NÃO edita arquivos.

Para o código indicado (ou o diff de `git diff`), produza uma lista ordenada por
gravidade com: arquivo, linha, problema, cenário que o dispara e correção sugerida.
Procure especialmente: exceções genéricas que escondem erros, conversão de valores
sem tratar "R$" e vírgula, comparação de dinheiro em float, datas sem parâmetro
(date.today() dentro de função), caminhos absolutos, segredos no código,
dados reais de clientes em testes, escopo maior do que o pedido.
Termine com uma pergunta: "em que situação este código produziria um número
errado sem dar erro?" e responda-a.
```

As ferramentas são só de leitura mais `Bash` (para `git diff` e `pytest`); o agente não recebe `Edit` nem `Write`, então não pode "corrigir" por conta própria.

## Exemplo 2: o testador

Arquivo `.claude/agents/testador.md`:

```markdown
---
name: testador
description: Roda a suíte pytest, analisa as falhas e propõe correções mínimas com teste de regressão. Use quando testes falharem ou quando o usuário pedir para rodar ou consertar os testes.
tools: Read, Edit, Write, Bash, Glob, Grep
model: inherit
maxTurns: 25
---

Você é responsável pela suíte de testes.

1. Rode `pytest -q` na pasta do projeto e leia a saída inteira.
2. Para cada falha, formule a hipótese da causa raiz antes de editar.
3. Nunca altere um teste existente para fazê-lo passar; se o teste estiver
   errado, explique e pergunte.
4. Corrija a implementação com a menor mudança possível e rode de novo.
5. Devolva: o que falhava, a causa, o que mudou e a saída final do pytest.
```

Aqui `model: inherit` usa o mesmo modelo da conversa principal e `maxTurns` limita o esforço, para que um bug difícil não consuma a sessão inteira.

## Como o Claude decide delegar

O Claude compara a tarefa com a `description` de cada subagente. Para incentivar a delegação espontânea, a documentação sugere incluir frases como "use proactively" ("use proativamente") na descrição, como no revisor acima. Descrições longas custam contexto: o conjunto das descrições de agentes personalizados, acima de 15.000 tokens, gera um aviso no início.

Você também pode invocar explicitamente, em linguagem natural ("Use o subagente testador para consertar os testes que falharam"), mencionando com `@"revisor (agent)"` no prompt, ou iniciando a sessão inteira como um agente com `claude --agent revisor`. O comando `/agents` imprime um lembrete de que você pode pedir ao Claude para criar ou gerenciar subagentes, ou editar as pastas `.claude/agents/` e `~/.claude/agents/` diretamente (em versões anteriores à 2.1.198, abria uma interface interativa).

O Claude Code já traz subagentes embutidos: **Explore** (busca rápida no código, só leitura), **Plan** (pesquisa durante o modo de planejamento, só leitura) e **general-purpose** (tarefas de vários passos com todas as ferramentas). Um agente seu chamado `Explore` substitui o embutido.

## Quando delegar vale a pena

- **Revisão independente**: o revisor não viu a escrita do código; sua opinião é menos enviesada.
- **Tarefas longas que poluem o contexto**: rodar e consertar uma suíte com muitas falhas gera páginas de saída; no subagente, só o resumo volta.
- **Especialização estável**: o mesmo roteiro (testar, revisar, documentar) usado em todo projeto.
- **Ferramentas restritas**: um agente que só lê é um agente que não estraga nada.

Quando **não** delegar: tarefas de uma linha, decisões que dependem da conversa inteira (o subagente não a vê) e qualquer coisa em que você quer acompanhar cada passo.

## Erros comuns

- Descrição que não diz **quando** usar; o Claude nunca delega.
- Dar `Edit` e `Write` ao revisor, que então corrige em vez de revisar.
- Esperar que o subagente conheça a conversa; passe o contexto necessário no pedido.
- Agente sem `maxTurns` em tarefa aberta, consumindo a sessão.
- Nome de arquivo diferente do `name` e confusão ao invocar: vale o `name`.

## Na prática

Um fluxo típico no escritório: você implementa um passo, pede "use o testador para rodar e consertar o que falhar", lê o resumo, pede "use o revisor no diff" e lê a lista. Dois subagentes, dois papéis que antes exigiam dois terminais ou duas pessoas, e o contexto principal continua enxuto para o próximo passo.

## Resumo

- Subagente = Markdown com cabeçalho YAML em `.claude/agents/` (projeto) ou `~/.claude/agents/` (usuário); o corpo é o prompt de sistema.
- Obrigatórios: `name` e `description`; úteis: `tools`, `disallowedTools`, `model`, `permissionMode`, `maxTurns`, `skills`, `hooks`, `memory`, `background`, `isolation`, `effort`.
- O Claude delega pela descrição ("use proativamente"); você também invoca por nome, com `@"nome (agent)"` ou `claude --agent nome`.
- Revisor só lê; testador pode editar, com limite de turnos.
- Delegue para independência, contexto limpo e especialização; não delegue o que depende da conversa inteira.
