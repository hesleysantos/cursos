Nesta lição você vai aprender a **ler** o que o Claude Code está fazendo: quais ferramentas ele usa, por que às vezes passa um tempo "explorando" antes de responder, como interpretar as mensagens e os diffs, e como interromper, corrigir o rumo ou pedir para desfazer. Quem entende o que está acontecendo na tela aprova com segurança; quem não entende aprova no escuro.

## As ferramentas

O modelo, sozinho, só produz texto. O que torna o Claude Code um agente são as **ferramentas** (tools) que ele pode chamar. A documentação as agrupa em categorias:

| Categoria | Ferramentas (nomes oficiais) | Pede permissão no modo manual? |
| --- | --- | --- |
| Arquivos | `Read` (ler), `Edit` (editar trecho), `Write` (criar/sobrescrever) | `Read` não; `Edit` e `Write` sim |
| Busca | `Glob` (achar arquivos por padrão), `Grep` (procurar texto dentro deles) | Não |
| Execução | `Bash` (comandos no Git Bash) e, no Windows, `PowerShell` | Sim (exceto um conjunto fixo de comandos somente-leitura) |
| Web | `WebFetch` (baixar uma página), `WebSearch` (pesquisar) | Sim (o `WebFetch` dispensa aprovação só para alguns domínios de documentação pré-aprovados) |
| Orquestração | `Agent` (subagente com contexto próprio), `AskUserQuestion` (perguntar a você) | Não |

Cada chamada de ferramenta devolve uma informação que alimenta a próxima decisão. Quando você pede "corrija os testes que estão falhando", a documentação descreve a sequência típica: rodar os testes → ler o erro → procurar os arquivos relevantes → lê-los → editar → rodar de novo para verificar.

> **Dica:** no Windows sem Git para Windows, o Claude Code usa a ferramenta `PowerShell`; com o Git instalado, usa o `Bash` (Git Bash), e o `PowerShell` também fica disponível. Por isso você verá comandos nos dois dialetos.

## Por que ele "explora" antes

A primeira fase do ciclo é **reunir contexto**. Antes de editar um arquivo, ele costuma listar a pasta, ler o arquivo inteiro, procurar onde uma função é usada e ler os arquivos vizinhos. Isso parece lento, mas é o que evita a edição errada: alterar uma função sem saber quem a chama quebra outro script. Quando a tarefa é só uma pergunta, ele pode parar na exploração; quando é uma correção, passa pelas três fases várias vezes.

Se a exploração estiver indo longe demais ("investigue" sem escopo pode levá-lo a ler centenas de arquivos), delimite: "olhe só a pasta `src/notas`" ou use `@arquivo` para apontar o alvo (módulo 2).

## Como ler as mensagens

Na sessão, cada ação aparece como uma linha curta: o nome da ferramenta e o alvo (por exemplo, a leitura de um arquivo ou o comando que vai rodar). Pedidos de permissão aparecem como um diálogo com as opções de aprovar ou negar; em pedidos de edição, o diálogo traz o **diff**. Para ver os detalhes completos de cada chamada de ferramenta e seus resultados, pressione **Ctrl+O**, que abre o visualizador da transcrição. Para ver todas as alterações pendentes na pasta (as do Claude e as suas, ainda não commitadas), use `/diff`.

Lendo um diff:

- Linhas com `-` saem; linhas com `+` entram; o restante é contexto.
- Confira se o arquivo alterado é o que você pediu e se não há mudanças "de brinde" (reformatar o arquivo todo, remover comentários, renomear coisas).
- Um diff que você não entende não deve ser aprovado: pergunte "por que essa linha?".

## Interromper e corrigir o rumo

Você faz parte do ciclo e pode intervir a qualquer momento:

- **Esc** interrompe o que ele está fazendo; a ferramenta em execução é cancelada e ele espera sua próxima instrução, mantendo o trabalho já feito.
- **Ctrl+C** também interrompe; com nada rodando, o primeiro toque limpa o que você digitou e o segundo fecha o programa.
- **Digitar e dar Enter enquanto ele trabalha** coloca sua mensagem na fila; ele a lê assim que terminar as chamadas em andamento e ajusta o rumo.
- Em um pedido de permissão, **No** recusa a ação e **Esc** fecha o diálogo sem aprovar (a ação não roda); nos dois casos você pode dizer o que fazer em vez disso.

## Pedir para desfazer

Há três caminhos, do mais simples ao mais estrutural:

1. **Pedir**: "desfaça essa última alteração". Ele reverte a edição.
2. **Checkpoints**: antes de editar um arquivo, o Claude Code salva um instantâneo. Pressione **Esc duas vezes** (com a caixa de texto vazia) ou use `/rewind` para abrir o menu: escolha o ponto da conversa e então **Restore code** (só os arquivos), **Restore conversation** (só a conversa) ou **Restore code and conversation** (os dois). O mesmo menu oferece **Summarize from here** e **Summarize up to here** (resumir a conversa a partir daquele ponto, ou até ele, para liberar contexto) e **Never mind** (sair sem mudar nada). Os checkpoints ficam salvos com a conversa, então funcionam mesmo após retomar a sessão.
3. **Git**: para histórico permanente, commits e branches (módulo 2).

Limites importantes, segundo a documentação: os checkpoints cobrem **apenas** edições feitas pelas ferramentas de arquivo; arquivos alterados por comandos do shell (`rm`, `mv`, `cp`) **não** são rastreados, e ações em sistemas externos (bancos, APIs, implantações) não têm desfazer. Checkpoint "não substitui o controle de versão".

## Erros comuns

- Aprovar uma sequência de edições sem abrir nenhum diff porque "está indo bem".
- Achar que Esc apaga o que ele já fez: não apaga; apenas para.
- Confiar no `/rewind` para reverter um `rm` executado pelo Bash.
- Deixá-lo explorar sem escopo em um projeto grande e estourar o contexto.
- Ignorar uma pergunta dele (`AskUserQuestion`) e mandar outra coisa; responda primeiro.

## Na prática

Ao pedir "atualize o cálculo de honorários para incluir reajuste anual", observe: ele lê `honorarios.py`, procura onde `calcular` é chamada, talvez leia um teste. Se começar a abrir a pasta de relatórios inteira, pressione Esc e diga "só `honorarios.py` e `testes/`". Quando o diff aparecer, confira a fórmula do reajuste linha a linha e aprove. Depois, "rode os testes". Se algo quebrar e a correção não convencer, `/rewind` e tente outra abordagem.

## Resumo

- Ferramentas: `Read`, `Edit`, `Write`, `Glob`, `Grep`, `Bash`/`PowerShell`, `WebFetch`, `WebSearch`, `Agent`, `AskUserQuestion`.
- Ele explora antes de agir para não editar às cegas; delimite o escopo quando necessário.
- Leia as linhas de ação, o diff (`-` sai, `+` entra) e, se precisar, Ctrl+O e `/diff`.
- Esc interrompe mantendo o trabalho; mensagens digitadas entram na fila.
- Desfazer: pedir, `/rewind` (Esc Esc) para edições de arquivo, Git para o resto.
