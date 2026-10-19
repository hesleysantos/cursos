Nesta lição você vai conhecer as outras superfícies do Claude Code além do terminal: a extensão do **VS Code**, o plugin **JetBrains**, o **aplicativo desktop** e o **Claude Code na web**. Vai entender o que muda em cada uma (diffs no editor, seleção como contexto, sessões), o que exige a CLI instalada e quando usar cada uma. Tudo usa o mesmo motor: seu `CLAUDE.md`, suas configurações e seus servidores MCP valem em todas.

## Extensão do VS Code

A documentação a descreve como "a forma recomendada de usar o Claude Code no VS Code": um painel gráfico dentro do editor. O que muda em relação ao terminal:

- **Diffs no editor**: em modo manual, cada edição proposta aparece numa comparação lado a lado; você pode aceitar, rejeitar, editar o texto proposto antes de aceitar, e revisar mudança por mudança com os botões **Accept this change** / **Reject this change**.
- **Seleção como contexto**: o texto selecionado no editor é visto automaticamente pelo Claude; **Alt+K** insere a referência com arquivo e linhas (`@app.py#5-10`).
- **@-menções** com busca aproximada de arquivos e pastas, e `@terminal:nome` para incluir a saída de um terminal integrado.
- **Plano como documento**: no modo Plan, o plano abre como um Markdown onde você deixa comentários antes de ele começar.
- **Histórico de sessões**: botão **Session history** no topo do painel, com busca; a extensão e a CLI compartilham o histórico — `claude --resume` no terminal retoma uma conversa iniciada na extensão.
- **Modo de permissão**: indicador na base da caixa de texto, com os rótulos Manual, Edit automatically, Plan e Auto (Bypass permissions só aparece se você ativar a opção correspondente nas configurações da extensão). Aqui **não** é Shift+Tab.
- **Várias conversas**: "Open in New Tab" (Ctrl+Shift+Esc), cada uma com seu contexto.

Requisitos: VS Code 1.94 ou superior; extensão "Claude Code" (também para Cursor); conta paga ou Console. Abrir: ícone na barra lateral ou Ctrl+Shift+P → "Open in New Tab". **Ctrl+Esc** alterna o foco entre o editor e o painel. A extensão traz sua própria cópia da CLI para o painel, mas **não** coloca `claude` no PATH: para usar a CLI no terminal integrado (Ctrl+`), é preciso a instalação feita no módulo 1. Recursos que só existem na CLI: rode `claude` no terminal integrado, que se conecta ao editor (ou `/ide` num terminal externo).

## Plugin JetBrains (PyCharm, IntelliJ…)

Instala-se pelo JetBrains Marketplace e **exige a CLI instalada** separadamente: o plugin roda `claude` no terminal integrado e conecta a ele. Recursos documentados: **Ctrl+Esc** abre o Claude Code; diffs no visualizador do IDE (ajustável em `/config` → Diff tool); a seleção ou aba atual é compartilhada como contexto; **Alt+Ctrl+K** insere referências como `@src/app.py#L1-99`; o Claude pode ler os diagnósticos do IDE (erros de lint e sintaxe). De um terminal externo, `/ide` conecta ao IDE em execução. A documentação alerta que, em accept edits (e em auto), o Claude poderia alterar arquivos de configuração do IDE que são executados automaticamente pelo próprio IDE; prefira o modo manual ali.

## Aplicativo desktop

O app do Claude (Windows x64 e ARM64, macOS, Linux em beta) tem a aba **Code**. Ele **inclui** o Claude Code — não precisa instalar a CLI — e exige assinatura paga. O que muda:

- **Sessões com pasta própria**: cada sessão tem seu histórico e sua pasta de projeto; dá para rodar várias lado a lado e, em repositórios Git, marcar a opção **worktree** para cada sessão ter uma cópia isolada.
- **Ambientes**: Local, Cloud, SSH ou WSL.
- **Revisão visual de diffs**: um indicador `+12 -1` abre o diff; você comenta linhas e envia os comentários com **Ctrl+Enter**.
- **Modos de permissão** por seletor (Manual, Accept edits, Plan, Auto, Bypass); Shift+Tab não cicla modos no desktop; o modo escolhido é lembrado por pasta (exceto Plan).
- **Tarefas agendadas** na sua máquina e acompanhamento de PR com CI.
- Lê os **mesmos arquivos de configuração** da CLI (`settings.json`, `CLAUDE.md`).

Da CLI, `/desktop` continua a sessão atual no app (macOS e Windows x64, com assinatura), e `claude --desktop` abre o app na pasta atual.

## Claude Code na web (visão)

Em claude.ai/code (e na aba Code do app de celular), cada **sessão na nuvem** roda numa máquina virtual gerenciada pela Anthropic, a partir de um repositório no **GitHub** que você conecta. A sessão continua com o seu computador desligado, e você acompanha pelo celular. Disponível nos planos Pro, Max e Team (e Enterprise com assentos específicos); o uso conta nos limites do plano, sem cobrança separada da VM.

Da CLI: `claude --cloud "descrição da tarefa"` cria uma sessão na nuvem com o repositório atual (ele clona o remoto no GitHub, então faça push antes); `claude --teleport` puxa uma sessão da nuvem para o seu terminal, com a branch. Na web, `/clear` não existe (inicia-se outra sessão) e os modos disponíveis são Accept edits, Plan e Auto. É a opção para tarefas longas e repositórios que você não tem localmente; para scripts que vivem no seu disco, terminal ou desktop são mais simples.

## Quando usar cada uma

| Situação | Melhor opção |
| --- | --- |
| Automatizar rotinas no seu disco, aprender o fluxo | **Terminal** (CLI) |
| Já edita no VS Code/PyCharm e quer diffs visuais e seleção como contexto | **Extensão / plugin** |
| Quer várias sessões lado a lado com interface gráfica e sem instalar nada | **Desktop** |
| Tarefa longa num repositório GitHub, acompanhar do celular | **Web / nuvem** |

## Erros comuns

- Instalar só a extensão e esperar `claude` no terminal.
- Procurar Shift+Tab no desktop ou no VS Code: use o seletor/indicador de modo.
- Tentar usar a web com um projeto que não está no GitHub.
- Não dar push antes de `claude --cloud`: a nuvem clona o remoto.
- Esquecer que o `CLAUDE.md` e as permissões valem em todas as superfícies.

## Na prática

Um arranjo que funciona: VS Code aberto no projeto, com a extensão para revisar diffs e marcar trechos com Alt+K; o terminal integrado com `claude` para o que só existe na CLI; o desktop para acompanhar duas automações ao mesmo tempo. A web fica para mandar "atualize as dependências e rode os testes" do celular, a caminho do cliente.

## Resumo

- Mesmo motor em todas: `CLAUDE.md`, configurações e MCP valem em todo lugar.
- VS Code: diffs lado a lado, seleção com Alt+K, plano como documento, histórico compartilhado com a CLI; não põe `claude` no PATH.
- JetBrains: exige a CLI; Ctrl+Esc, diffs no IDE, Alt+Ctrl+K.
- Desktop: inclui o Claude Code, sessões com pasta própria e worktree, diffs comentáveis, seletor de modos; `/desktop` e `claude --desktop`.
- Web: VM na nuvem a partir do GitHub; `claude --cloud` e `claude --teleport`.
