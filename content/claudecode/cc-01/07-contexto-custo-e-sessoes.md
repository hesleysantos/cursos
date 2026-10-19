Nesta lição você vai entender a **janela de contexto** — o recurso mais importante a administrar no Claude Code —, aprender a usar `/compact`, `/clear` e `/context`, a retomar sessões com `--continue` e `--resume`, e a acompanhar uso e custo com `/usage`. Dominar isso evita respostas piores em conversas longas e evita surpresas no consumo do plano.

## A janela de contexto

A documentação é direta: "a janela de contexto do Claude enche rápido, e o desempenho piora à medida que enche". A janela guarda tudo que o modelo vê a cada resposta: suas mensagens, cada arquivo que ele leu, cada saída de comando, o `CLAUDE.md`, a memória automática, as instruções do sistema. Uma sessão de depuração pode consumir dezenas de milhares de **tokens** (as unidades em que o texto é medido e cobrado).

Dois efeitos práticos:

- **Qualidade**: com a janela cheia, o modelo "esquece" instruções do começo e erra mais.
- **Custo/uso**: a cada mensagem, o histórico inteiro é reenviado. Uma pergunta de uma linha numa sessão aberta o dia todo consome o contexto todo (com cache, mais barato, mas ainda conta).

Para ver o que está ocupando espaço, use:

```text
/context
```

Ele mostra um painel com o uso atual, inclusive os arquivos de memória carregados.

## `/compact` e a compactação automática

Quando a janela se aproxima do limite, o Claude Code **compacta automaticamente**: primeiro descarta saídas antigas de ferramentas, depois resume a conversa. Pedidos e trechos importantes são preservados; instruções detalhadas do começo podem se perder — por isso regras permanentes vão no `CLAUDE.md`, não na conversa.

Você pode compactar quando quiser, e dizer no que focar:

```text
/compact mantenha a lista de arquivos alterados e o comando de teste
```

A documentação lembra que `/compact` lê a conversa inteira para resumi-la, então compactar um contexto grande é, em si, um pedido grande.

## `/clear`: quando começar do zero

`/clear` inicia uma conversa nova com contexto vazio (a anterior fica salva). Use entre tarefas **não relacionadas**: a "sessão pia de cozinha", em que você mistura o organizador de notas com uma dúvida de folha e volta ao organizador, é um dos padrões de falha listados na documentação. Outra regra oficial: se corrigiu o agente mais de duas vezes no mesmo problema, `/clear` e um pedido melhor rendem mais do que insistir.

Para encontrar a conversa depois, dê um nome antes de limpar: `/rename organizador-notas`, ou passe o nome direto: `/clear organizador-notas` (nomeia a conversa que você está deixando).

## Retomar sessões

As conversas ficam salvas localmente, em `~/.claude/projects/` (no Windows, dentro de `C:\Users\SeuUsuário\.claude\`). Para voltar:

```powershell
claude --continue
claude --resume
claude --resume organizador-notas
```

- `--continue` (ou `-c`) reabre a conversa **mais recente da pasta atual**.
- `--resume` (ou `-r`) sem argumento abre um **seletor** para escolher; com um nome ou ID, abre direto.
- Dentro de uma sessão, `/resume` troca para outra conversa.

Ao retomar, ele restaura o histórico completo (inclusive chamadas de ferramentas) e os checkpoints. Nomear sessões (`claude -n nome` ao iniciar, `/rename nome` durante) é o que torna o `--resume` útil quando há várias.

## `/usage` e o custo

O comando é:

```text
/usage
```

Os aliases `/cost` e `/stats` abrem a mesma tela. O que você vê depende de como entrou:

- **Assinatura (Pro, Max, Team, Enterprise)**: barras de uso do plano, estatísticas de atividade e um detalhamento do que está pesando (atribuição a skills, subagentes, MCP; sinais como "contexto longo"). O valor em dólares da sessão aparece, mas a documentação explica que para assinantes ele não é relevante para cobrança — o uso está incluído no plano.
- **Console (API)**: o bloco de sessão mostra tokens de entrada, saída e cache e um custo estimado, calculado localmente a preço de lista; a cobrança oficial é a página de uso do Console.

Preços e limites exatos mudam e não cabem aqui; o que importa é o comportamento: contexto maior = mais consumo. A documentação lista as causas de uso alto numa sessão longa, entre elas: contexto longo, perda de cache após pausas, tarefas agendadas, subagentes e a própria compactação.

## Quando iniciar conversa nova

Use `/clear` (ou saia e abra de novo) quando:

1. Vai começar uma tarefa **sem relação** com a anterior.
2. Já corrigiu o mesmo erro duas vezes.
3. O `/context` mostra a janela quase cheia e a tarefa atual já terminou.
4. A conversa está lenta ou as respostas começaram a ignorar instruções.

Use `/compact` quando quer **continuar a mesma tarefa** mas liberar espaço. Use `--resume` quando a tarefa de ontem ficou pela metade.

## Erros comuns

- Manter uma única sessão aberta a semana inteira "para ele lembrar de tudo": o que precisa ser lembrado vai no `CLAUDE.md`.
- Nunca olhar o `/context` e só descobrir o problema quando a qualidade cai.
- Confundir `/clear` (conversa nova) com `/compact` (mesma conversa resumida).
- Esperar que `--continue` ache a sessão de **outra** pasta: ele olha a pasta atual.
- Interpretar o custo em dólares do `/usage` como fatura quando se é assinante.

## Na prática

Fluxo de um dia típico: de manhã, `claude --continue` para retomar o organizador; ao terminar, `/rename organizador-v2`; chega uma dúvida sobre outro script, `/clear` e pergunte; antes do almoço, `/usage` para ver como está o plano; à tarde, `claude --resume organizador-v2` para seguir. Conversas curtas e focadas, uma por tarefa.

## Resumo

- A janela de contexto guarda tudo que o modelo vê; cheia demais, piora respostas e aumenta consumo.
- `/context` mostra o uso; `/compact [foco]` resume mantendo a conversa; `/clear` começa do zero.
- `claude --continue` retoma a última da pasta; `claude --resume [nome]` escolhe; `/rename` dá nome.
- `/usage` (aliases `/cost`, `/stats`): barras do plano para assinantes, custo estimado para API.
- Uma conversa por tarefa; regras permanentes no `CLAUDE.md`.
