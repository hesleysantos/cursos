Nesta lição você vai criar **skills**: procedimentos reutilizáveis que o Claude Code carrega quando você invoca `/nome` ou quando ele percebe que a tarefa combina com a descrição. Você vai aprender o formato do arquivo `SKILL.md`, os campos do cabeçalho, onde a pasta fica, como passar argumentos e quando uma skill é melhor do que uma instrução no `CLAUDE.md`. O exemplo é a skill `fechar-mes`. Também vai entender a relação com a pasta antiga `.claude/commands/`. Skills transformam o seu procedimento de fechamento em um comando que qualquer pessoa do escritório executa igual.

## O que é uma skill

Uma skill é uma pasta com um arquivo `SKILL.md`: um cabeçalho YAML entre marcadores `---` e, abaixo, instruções em Markdown. O corpo só entra no contexto quando a skill é usada, por isso material de referência longo custa quase nada até ser necessário. Isso resolve o problema da lição anterior: procedimentos de várias etapas não cabem no `CLAUDE.md`, mas cabem em uma skill.

Onde a pasta fica, segundo a documentação:

| Local | Caminho | Vale em |
| --- | --- | --- |
| Pessoal | `~/.claude/skills/<nome>/SKILL.md` | Todos os seus projetos |
| Projeto | `.claude/skills/<nome>/SKILL.md` | Sessões neste repositório; commite para compartilhar |
| Aninhada | `<subpasta>/.claude/skills/<nome>/SKILL.md` | Sessões iniciadas nessa subpasta ou abaixo |
| Plugin | `<plugin>/skills/<nome>/SKILL.md` | Onde o plugin estiver ligado, como `/plugin:skill` |

Quando os nomes colidem, a versão da organização vence a pessoal, e a pessoal vence a do projeto.

## O formato do SKILL.md

Todos os campos do cabeçalho são opcionais; `description` é recomendado porque é por ela que o Claude decide quando carregar a skill. Os campos mais usados:

- `name`: nome do comando; por padrão, o nome da pasta.
- `description`: o que a skill faz e quando usar; coloque o caso de uso principal no começo.
- `argument-hint`: dica de autocompletar, como `[competencia]`.
- `disable-model-invocation: true`: impede o Claude de carregar a skill sozinho; só você invoca.
- `user-invocable: false`: esconde do menu `/`; só o Claude invoca.
- `allowed-tools`: ferramentas que rodam sem perguntar durante o turno da skill.
- `model` e `effort`: modelo e nível de esforço enquanto a skill está ativa.
- `context: fork` e `agent`: roda a skill em um subagente separado.
- `shell`: `bash` (padrão) ou `powershell` para os blocos de comando dinâmico.

O corpo pode incluir **contexto dinâmico**: uma linha com `` !`comando` `` é executada antes de o Claude ler a skill e substituída pela saída do comando. Exemplo da documentação: `` !`git diff HEAD` `` coloca o diff atual dentro da skill.

## Argumentos

O que você digita depois de `/nome` chega à skill por substituições: `$ARGUMENTS` é o texto completo; `$0`, `$1` (ou `$ARGUMENTS[0]`, `$ARGUMENTS[1]`) são os argumentos por posição; `${CLAUDE_SKILL_DIR}` é a pasta da própria skill, útil para apontar scripts que a acompanham; `${CLAUDE_PROJECT_DIR}` é a raiz do projeto. Se você passa argumentos e nenhuma substituição os recebe, o Claude Code acrescenta `ARGUMENTS: <texto>` ao final da skill.

## Exemplo: a skill fechar-mes

Arquivo `.claude/skills/fechar-mes/SKILL.md`:

```markdown
---
name: fechar-mes
description: Executa o roteiro de fechamento mensal de um cliente (conciliação, consolidação de honorários e relatório). Use quando o usuário pedir para fechar o mês ou rodar o fechamento de uma competência.
argument-hint: [cliente] [competencia AAAA-MM]
disable-model-invocation: true
allowed-tools: Bash(pytest *), Bash(python *)
---

Fechamento do cliente $0 na competência $1.

## Estado atual do repositório

!`git status --short`

## Roteiro

1. Confirme que `clientes/$0/$1/` existe e contém extrato (OFX ou CSV) e `lancamentos.xlsx`. Se faltar algo, pare e liste o que falta.
2. Rode `pytest` na pasta `conciliador/`. Se falhar, pare e mostre a falha.
3. Rode `python conciliador/conciliar.py --cliente $0 --competencia $1` e resuma: conciliados, só banco, só escritório.
4. Rode `python consolidador/consolidar.py $1` e informe o total de honorários.
5. Gere `clientes/$0/$1/relatorio.md` com os números acima e as pendências em lista.
6. Não commite nada; apresente o diff para revisão.

Regras: nunca altere os arquivos de entrada; valores em centavos nos cálculos e em reais no relatório.
```

Invocação: `/fechar-mes padaria 2026-10`. Com `disable-model-invocation: true`, o Claude não dispara o fechamento por conta própria quando você só menciona "fechamento" numa conversa; é a escolha certa para procedimentos com efeitos. A lista `allowed-tools` evita um pedido de permissão a cada `pytest`, sem liberar nada além disso.

Arquivos de apoio podem ficar na mesma pasta (`referencia.md`, `scripts/gerar_relatorio.py`) e ser citados no `SKILL.md`, para o Claude ler quando precisar; a documentação recomenda manter o `SKILL.md` abaixo de 500 linhas.

## Quando usar skill, CLAUDE.md ou hook

- **CLAUDE.md**: fatos e regras que valem sempre (comandos, convenções).
- **Skill**: procedimento de várias etapas para um tipo de tarefa, carregado só quando usado.
- **Hook**: algo que precisa acontecer **sempre**, sem depender de o modelo seguir a instrução (lição 6).

Teste: se a instrução começa com "sempre" e cabe em uma linha, é `CLAUDE.md`; se é uma lista numerada que você repetiria em prompt, é skill; se "não pode falhar", é hook.

## Relação com .claude/commands/

Antes das skills existiam os "comandos personalizados" em `.claude/commands/nome.md`. A documentação informa que os comandos foram incorporados às skills: um arquivo `.claude/commands/deploy.md` e uma skill `.claude/skills/deploy/SKILL.md` criam o mesmo `/deploy` e se comportam igual; se ambos existirem, a skill tem precedência. Arquivos de comando aceitam o mesmo cabeçalho, exceto `name` e `paths`; subpastas em `.claude/commands/` geram nomes com dois-pontos (`frontend/component.md` vira `/frontend:component`). Para trabalho novo, a recomendação é skill, que ganha pasta para arquivos de apoio, controle de quem invoca e carregamento automático pela descrição.

O Claude Code observa as pastas de skills que existiam quando a sessão começou, então editar uma skill existente já vale na própria sessão. Se você criou a pasta `.claude/skills/` (ou `~/.claude/skills/`) durante a sessão, rode `/reload-skills` para ela ser lida; `/skills` lista as skills disponíveis.

## Erros comuns

- Descrição genérica ("ajuda com fechamento") que nunca casa, ou genérica demais e casa com tudo.
- Skill com efeitos (gera arquivos, roda scripts) sem `disable-model-invocation`, disparada por uma frase casual.
- `allowed-tools` amplo demais (`Bash`), que vira permissão total durante a skill.
- Esquecer os `---` do cabeçalho, e o YAML vira texto do corpo.
- Procedimento que mudou no escritório e a skill ficou desatualizada; trate-a como código, no Git.

## Na prática

Um escritório tende a ter meia dúzia de skills de projeto: `fechar-mes`, `conferir-folha`, `importar-extratos`, `gerar-relatorio-cliente`, `revisar-script`. Cada uma é um procedimento que antes vivia na cabeça de uma pessoa. Commitadas no repositório, viram o manual executável do escritório, e qualquer pessoa roda `/fechar-mes oficina 2026-10` com o mesmo resultado.

## Resumo

- Skill = pasta com `SKILL.md` (cabeçalho YAML + instruções); corpo carregado só quando usada.
- Locais: `~/.claude/skills/`, `.claude/skills/`, aninhadas e plugins.
- Campos úteis: `name`, `description`, `argument-hint`, `disable-model-invocation`, `allowed-tools`, `context: fork`.
- Argumentos: `$ARGUMENTS`, `$0`, `$1`; `${CLAUDE_SKILL_DIR}` aponta para a pasta da skill; `` !`comando` `` injeta saída de comando.
- `.claude/commands/` ainda funciona, mas skills são o caminho recomendado; `/reload-skills` lê uma pasta de skills criada durante a sessão e `/skills` lista as disponíveis.
