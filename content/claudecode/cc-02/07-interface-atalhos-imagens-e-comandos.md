Nesta lição você vai dominar a interface do Claude Code no terminal: os atalhos que mais economizam tempo, como escrever mensagens de várias linhas, como anexar imagens e capturas de tela, e os comandos de diagnóstico e configuração `/model`, `/status`, `/doctor` e `/config`. Saber onde cada coisa está deixa a conversa fluida e evita aquele "como é que fecha isso?".

## Atalhos essenciais

Todos confirmados na referência de modo interativo (podem variar conforme o terminal):

| Atalho | O que faz |
| --- | --- |
| **Esc** | Interrompe a resposta ou a ferramenta em execução (o trabalho feito fica); fecha um diálogo aberto, inclusive um pedido de permissão, que fica sem aprovação |
| **Esc Esc** | Com texto digitado: limpa o rascunho (recuperável com ↑). Com a caixa vazia: abre o menu de **rewind** |
| **Ctrl+C** | Interrompe; sem nada rodando, o 1º toque limpa a caixa e o 2º fecha o programa |
| **Ctrl+D** | Sai (pressione duas vezes) |
| **Shift+Tab** (ou **Alt+M** no Windows, se Shift+Tab não funcionar) | Alterna o modo de permissão |
| **Tab** | Aceita a sugestão de autocompletar (caminhos com `@`, comandos com `/`); num pedido de permissão, abre um campo de comentário |
| **↑ / ↓** | Navega no histórico de mensagens (ou move o cursor em texto de várias linhas) |
| **Ctrl+R** | Busca reversa no histórico |
| **Ctrl+O** | Abre/fecha o visualizador de transcrição com os detalhes das ferramentas |
| **Ctrl+L** | Redesenha a tela se ela ficar embaralhada |
| **Ctrl+G** | Abre o que você está escrevendo (ou o plano proposto) no editor de texto padrão |
| **Ctrl+B** | Manda a tarefa em execução para segundo plano |
| **Ctrl+T** | Mostra/oculta a lista de tarefas do Claude |
| **Alt+P** | Troca de modelo sem perder o que estava digitando |
| **?** (com a caixa vazia) | Mostra o painel de ajuda de atalhos |

## Escrever várias linhas

Enter envia. Para quebrar linha sem enviar, a documentação lista:

- `\` seguido de **Enter**: funciona em qualquer terminal.
- **Shift+Enter**: nativo no Windows Terminal (e em iTerm2, WezTerm, Ghostty, Kitty, Warp e Terminal da Apple). No terminal integrado do VS Code, rode `/terminal-setup` para instalar a tecla.
- **Ctrl+J**: funciona em qualquer terminal, sem configuração.
- **Colar** um bloco de texto já com quebras.

Para pedidos longos, escreva num editor com **Ctrl+G** e salve.

## Modo vim (menção)

Quem usa Vim pode ativar a edição no estilo vim por `/config` → **Editor mode**. O antigo comando `/vim` foi removido; a configuração persistente no `~/.claude/settings.json` é `"editorMode": "vim"`. Se você não usa Vim, ignore.

## Imagens e capturas de tela

Uma captura de um erro na tela do sistema contábil ou de uma planilha diz mais que uma descrição. Três formas documentadas de anexar:

1. **Arrastar e soltar** a imagem na janela do terminal.
2. **Colar** da área de transferência com **Ctrl+V**; no Windows e no WSL, **Alt+V** também funciona (use-o se o terminal capturar o Ctrl+V). Aparece um marcador `[Image #N]` na mensagem.
3. **Informar o caminho**: "analise esta imagem: C:\capturas\erro.png".

Depois, pergunte: "aqui está a captura do erro; o que está causando?" ou "este é o leiaute do relatório; gere o CSV com essas colunas". Você pode anexar várias imagens numa conversa.

## `/model`, `/status`, `/doctor`, `/config`

- **`/model`**: abre o seletor de modelo (ou aceita o nome direto, como `/model sonnet`) e salva como padrão para novas sessões; na lista, `s` troca só para a sessão atual. Critério, sem decorar nomes: um modelo mais leve para tarefas simples e repetitivas; um mais forte para planejar e para mudanças que atravessam vários arquivos. A documentação de custos lembra que o modelo mais forte consome mais do plano. Para ver o modelo atual, olhe o cabeçalho da sessão ou `/status`.
- **`/status`**: abre a tela de configurações na aba de status, com versão, modelo, conta e conectividade. Funciona mesmo enquanto o Claude responde.
- **`/doctor`**: faz um check-up da instalação, das configurações, das extensões e do `CLAUDE.md`, propondo correções que o Claude aplica depois que você confirma (alias `/checkup`). Com `/doctor prompt-audit`, revisa seus arquivos de instruções em busca de itens obsoletos ou contraditórios. Pela linha de comando, `claude doctor` faz o diagnóstico somente-leitura sem abrir sessão.
- **`/config`**: abre as configurações (tema, modelo, modo de edição, etc.); aceita `chave=valor` direto, como `/config theme=dark`.

Outros comandos úteis do dia a dia: `/help` (lista de comandos), `/release-notes` (novidades da versão), `/export` (salva a conversa em texto), `/btw pergunta` (pergunta lateral que **não** entra no histórico da conversa) e `/diff`.

## Erros comuns

- Dar Enter no meio de um pedido longo e enviar pela metade: use `\`+Enter ou Ctrl+J.
- Procurar o atalho de modo no Esc: é Shift+Tab (Alt+M no Windows).
- Colar imagem com Ctrl+V no terminal que intercepta a tecla e não entender por que não anexou: Alt+V.
- Mudar para o modelo mais forte "por garantia" em tudo e esgotar o plano cedo.
- Usar `/clear` quando só queria limpar a tela: para isso é Ctrl+L.

## Na prática

Peça: Shift+Enter (Windows Terminal) para escrever um pedido de 5 linhas com o objetivo, a regra e os exemplos; Alt+V para colar a captura da tela de erro; Tab para aceitar `@relatorio.py`; Enter. Enquanto ele trabalha, Ctrl+O para ver os comandos; se o rumo estiver errado, Esc e corrija. No fim do dia, `/status` para conferir a conta e `/usage` para ver o consumo.

## Resumo

- Esc interrompe; Esc Esc rebobina; Ctrl+C/Ctrl+D saem; Shift+Tab (Alt+M) troca o modo; Tab completa; Ctrl+O mostra detalhes; Ctrl+G abre o editor.
- Várias linhas: `\`+Enter, Shift+Enter (Windows Terminal), Ctrl+J, ou colar.
- Imagens: arrastar, Ctrl+V/Alt+V, ou caminho do arquivo.
- `/model` escolhe o modelo; `/status` mostra versão, modelo e conta; `/doctor` faz check-up; `/config` ajusta preferências (modo vim incluído).
