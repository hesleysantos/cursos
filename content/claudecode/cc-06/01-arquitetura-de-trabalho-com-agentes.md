# Arquitetura de trabalho com agentes

Nesta lição você vai aprender a **desenhar** trabalho para agentes, em vez de só pedir. Vai ver o padrão orquestrador/especialistas, como decompor uma tarefa, como escrever contratos de entrada e saída entre as partes, quando paralelizar (e quando não) e quais padrões funcionam quando uma equipe inteira usa o Claude Code.

## O princípio: contexto é o recurso escasso

A documentação de boas práticas resume quase tudo em uma frase: a janela de contexto enche rápido e o desempenho cai conforme enche. Toda arquitetura de agentes é uma forma de administrar isso: cada agente deve ver **só o que precisa** para a sua parte. O segundo princípio é verificabilidade: o agente para quando "parece pronto", então cada parte precisa de um teste, um esquema ou um critério que diga se está certo.

## Orquestrador e especialistas

O desenho mais comum tem um **orquestrador** (a sessão principal ou um script) que entende o objetivo, divide o trabalho, chama **especialistas** e combina os resultados. No Claude Code isso se materializa de três formas:

| Especialista | O que é | Quando usar |
|---|---|---|
| **Subagente** (`.claude/agents/*.md`) | Roda em contexto próprio, com prompt de sistema, ferramentas e modelo definidos; devolve um resumo | Pesquisa que lê muitos arquivos; revisão independente; tarefas repetíveis com papel fixo |
| **Skill** (`.claude/skills/<nome>/SKILL.md`) | Procedimento ou conhecimento carregado sob demanda; pode rodar em subagente com `context: fork` | Rotinas da equipe ("fechar competência", "gerar guia") |
| **Sessão separada** (`claude -p` ou worktree) | Processo independente, contexto zerado | Etapas de pipeline; trabalho paralelo em arquivos distintos; agendamento |

Um subagente é definido assim (exemplo da documentação, adaptado):

```markdown
---
name: revisor-fiscal
description: Revisa cálculos e textos fiscais em busca de erros de alíquota, base e competência
tools: Read, Grep, Glob
model: sonnet
---

Você é um revisor fiscal sênior. Analise o que lhe for entregue e liste,
com referência de arquivo e linha, cada erro de alíquota, base de cálculo
ou competência. Não corrija; apenas aponte. Se não houver erros, diga isso.
```

O orquestrador delega pela `description`, ou você pede: "use o subagente revisor-fiscal para conferir o cálculo". O subagente **não vê sua conversa**; recebe só a tarefa. Por isso o prompt dele precisa ser autossuficiente e a tarefa precisa vir completa.

## Decomposição de tarefas

Decompor bem é mais importante que prompts bonitos. Um roteiro:

1. **Nomeie o resultado final** em termos verificáveis: "arquivo `conciliado.json` com zero divergências sem explicação".
2. **Liste as entradas** e de onde vêm.
3. **Corte onde o contexto muda**: ler extratos é um contexto; redigir relatório é outro. Cada corte vira um agente ou etapa.
4. **Corte onde a verificação é possível**: se você consegue testar a saída de um pedaço, ele pode ser uma unidade.
5. **Ordene por dependência**: o que não depende de nada pode rodar em paralelo.

Tarefas pequenas demais geram custo de coordenação; grandes demais estouram contexto. A medida prática: uma unidade que um subagente termina em poucos turnos e cujo resultado cabe em um resumo de uma tela.

## Contratos: entradas e saídas

Entre agentes, combine o formato **antes**. Um contrato tem: nome da etapa, entradas (arquivos, campos), saída (esquema JSON ou arquivo com estrutura fixa), critério de aceite e o que fazer em caso de dúvida. Escreva-o em um arquivo versionado e referencie-o no prompt:

```text
Etapa: coleta-banco
Entrada: dados/2026-09/*.ofx
Saída: coleta/banco.json conforme esquemas/coleta.schema.json
Aceite: todo lançamento tem data, valor e descricao; soma dos valores = saldo final - saldo inicial
Dúvida: registre em "pendencias" com motivo; nunca invente valores
```

O esquema JSON (`--json-schema` ou `output_format` no SDK) é o contrato executável: a saída que não obedece é rejeitada antes de chegar ao próximo agente. Campos opcionais para o que pode faltar; `enum` para categorias; nunca texto livre onde um valor estruturado serve.

## Quando paralelizar, quando não

Paralelize quando as unidades são **independentes em dados e em arquivos**. A doc oferece as ferramentas: `claude --worktree <nome>` para sessões em checkouts isolados; subagentes com `isolation: worktree`; `/batch` para dividir uma mudança grande em 5 a 30 subagentes, cada um em seu worktree; sessões na nuvem e o app Desktop para gerenciar várias ao mesmo tempo.

Não paralelize quando: a segunda etapa precisa da saída da primeira; as unidades editam os mesmos arquivos; o resultado exige uma visão de conjunto (um relatório coeso é melhor escrito por um agente que leu tudo conciliado do que por quatro que escreveram seções separadas). E lembre-se do custo: cada agente paralelo tem o próprio contexto; a doc de custos observa que equipes de agentes podem usar muito mais tokens que uma sessão.

## Padrões que funcionam em equipes

- **Escritor/revisor**: uma sessão implementa, outra revisa com contexto fresco; ou um subagente revisor confere o diff contra o plano. "Quem fez não aprova."
- **Explorar → planejar → implementar → commitar**: plan mode para entender, plano revisado por pessoa, implementação, commit. A doc recomenda pular o plano em tarefas de uma linha.
- **Verificação executável**: testes, build, esquema, screenshot; um hook `Stop` pode impedir o fim do turno até a verificação passar.
- **Entrevista antes de construir**: para funcionalidades grandes, pedir ao Claude que entreviste você com `AskUserQuestion` e escreva um `SPEC.md`; a implementação começa em sessão nova.
- **Configuração versionada**: `CLAUDE.md`, `.claude/agents/`, `.claude/skills/`, `.mcp.json` e `.claude/settings.json` no repositório, para que todos trabalhem com os mesmos agentes e regras.

## Erros comuns

- Subagente com prompt que supõe o contexto da conversa principal.
- Decompor por "tema" em vez de por contexto e verificação.
- Contratos só na cabeça: cada etapa inventa seu formato.
- Paralelizar e depois gastar mais tempo resolvendo conflitos de merge.
- Um orquestrador que também faz o trabalho pesado e estoura o próprio contexto.

## Na prática

No escritório, o "fechamento mensal" é um orquestrador natural: um script (ou uma sessão) chama o especialista de coleta por fonte, o conciliador, o redator e o revisor. Comece com dois agentes e um contrato JSON; cresça quando o fluxo estiver estável. O projeto final deste módulo monta exatamente isso.

## Resumo

- Arquitetura de agentes é gestão de contexto mais verificabilidade.
- Orquestrador coordena; especialistas (subagentes, skills com `context: fork`, sessões separadas) fazem partes com contexto próprio.
- Decomponha onde o contexto muda e onde há verificação possível; ordene por dependência.
- Contratos escritos e esquemas JSON são a cola entre agentes.
- Paralelize só unidades independentes (worktrees, `isolation: worktree`, `/batch`); revise com contexto fresco.
