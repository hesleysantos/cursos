Nesta lição você vai entender o que é o Claude Code, em que ele é diferente de um chat de IA, o que ele consegue (e não consegue) fazer no seu computador e para quem ele serve — inclusive para quem não é programador. Isso importa porque a ferramenta é poderosa justamente por agir no seu lugar: antes de dar a ela acesso aos arquivos do escritório, você precisa saber exatamente o que está colocando na mesa.

## Um agente, não um chat

Um chat de IA recebe um texto e devolve um texto. Se você quer um script Python, ele escreve o código e você copia, cola, salva, roda, lê o erro, volta ao chat… Você é o "braço" da IA.

O **Claude Code** é um **agente de programação**: além de conversar, ele **age** no seu computador. Ele lê os arquivos da pasta onde você o abriu, edita código, cria arquivos, roda comandos no terminal, usa o Git e, se você permitir, busca documentação na internet. A documentação oficial descreve o trabalho dele como um ciclo de três fases: **reunir contexto** (ler e procurar), **agir** (editar, rodar) e **verificar o resultado** (rodar testes, conferir a saída) — repetindo até a tarefa terminar. Você participa desse ciclo: pode interromper, corrigir o rumo e aprovar ou negar cada ação.

> **Dica:** pense no Claude Code como um estagiário de programação muito rápido sentado no seu computador. Ele faz, mas você supervisiona — e ele pede autorização antes de mexer no que é importante.

## Onde ele roda

O mesmo "motor" está disponível em várias superfícies, e as configurações do projeto (como o arquivo `CLAUDE.md`, que veremos no módulo 2) valem em todas:

| Superfície | O que é | Quando usar |
| --- | --- | --- |
| **Terminal (CLI)** | O comando `claude` no PowerShell ou no Git Bash | A forma completa; é o foco deste curso |
| **Extensão do VS Code / plugin JetBrains** | No VS Code, um painel dentro do editor com diffs visuais; no JetBrains, a CLI no terminal integrado com diffs no IDE. Nos dois, o código selecionado vira contexto | Quando você já edita arquivos no VS Code ou PyCharm |
| **Aplicativo desktop** | App do Claude com a aba **Code**; já inclui o Claude Code, sem instalar a CLI | Quem prefere interface gráfica e várias sessões lado a lado |
| **Web (claude.ai/code) e celular** | Sessões que rodam em máquinas virtuais na nuvem, a partir de um repositório no GitHub | Tarefas longas que continuam com o computador desligado |

Neste curso, "Claude Code" sem qualificação significa a CLI no terminal. Quando algo só existe em uma superfície, o texto avisa.

## O que ele consegue fazer

Segundo a documentação, ao abrir `claude` numa pasta ele passa a ter acesso ao **projeto** (arquivos daquela pasta e subpastas), ao **terminal** (qualquer comando que você mesmo rodaria), ao **estado do Git** (branch, alterações, histórico) e às instruções que você deixar no `CLAUDE.md`. Na prática, para um escritório contábil isso significa:

- **Criar e corrigir scripts**: "escreva um script que leia esta planilha de folha e gere um resumo por centro de custo".
- **Explicar código que alguém deixou**: "o que faz o arquivo `conciliacao.py`?".
- **Rodar e testar**: "rode os testes e corrija o que falhar".
- **Automatizar o chato**: renomear centenas de PDFs de notas, converter extratos, gerar relatórios.
- **Usar Git**: criar branch, fazer commit com mensagem clara, abrir pull request.
- **Buscar documentação** de uma biblioteca ou API, se você autorizar o acesso à web.

## O que ele não faz (ou não deveria)

- **Não adivinha o que você não disse.** Se a regra do escritório é "competência é a data de emissão da nota", ele precisa saber disso.
- **Não garante que o código está certo.** Ele verifica quando tem como (testes, saída de comandos), mas a responsabilidade pelo resultado é sua. A documentação é direta: você é responsável por revisar o que ele propõe antes de aprovar.
- **Não substitui o contador.** Ele escreve a automação; a regra fiscal, a conferência e a assinatura continuam com você.
- **Não deve receber segredos.** Senhas, tokens e certificados não entram na conversa (lição 4).
- **Não desfaz tudo sozinho.** Ele tem "checkpoints" para reverter edições, mas ações em sistemas externos (um banco de dados, um envio de e-mail) não têm desfazer.

## Para quem é

Para programadores, claro. Mas também para quem **não programa**: a documentação diz que, embora ele se destaque em código, ele ajuda em "qualquer coisa que você faria pela linha de comando" — escrever documentos, organizar arquivos, pesquisar. Um contador com noções de Python (como você) está num ponto ótimo: sabe ler o que ele produz, sabe testar, e tem problemas reais e repetitivos para resolver.

## Como se encaixa com vibe coding e automação

No curso de Vibe Coding você aprendeu a descrever o que quer e deixar a IA escrever; o Claude Code fecha o ciclo: além de escrever, ele roda, testa e corrige. No curso de Automação você viu scripts, agendamento e APIs; aqui você vai construí-los conversando — ainda neste módulo, um organizador de notas fiscais inteiro sem digitar código.

## Erros comuns

- **Tratar como chat**: pedir "me dê o código" e copiar à mão. Peça "crie o arquivo `x.py` com…" e deixe que ele escreva e rode.
- **Abrir na pasta errada**: ele enxerga a pasta onde foi aberto. Abrir no `C:\` inteiro ou na área de trabalho confunde e expõe demais.
- **Aprovar sem ler**: clicar "sim" em tudo transforma o supervisor em figurante.

## Na prática

Imagine a rotina: todo mês chegam 300 PDFs de notas fiscais com nomes diferentes. Com o Claude Code, você abre o terminal na pasta do projeto e diz "crie um script que leia os nomes dos arquivos, extraia a competência e mova cada um para a pasta do mês". Ele lê a pasta, propõe o script, pede permissão para criar o arquivo, roda num teste e mostra o resultado. Você confere com três arquivos de exemplo, aprova, e o mês seguinte leva segundos. É esse fluxo que o curso vai ensinar passo a passo.

## Resumo

- O Claude Code é um **agente**: lê, edita, roda comandos, usa Git e verifica resultados — não só responde texto.
- Funciona no terminal (foco do curso), no VS Code/JetBrains, no app desktop e na web; as configurações do projeto valem em todas.
- Ele enxerga a pasta onde foi aberto e o terminal; pede permissão antes de agir.
- Serve a programadores e a quem só sabe o básico, desde que **revise** antes de aprovar.
- Não substitui o julgamento profissional nem deve receber segredos.
