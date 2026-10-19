Nesta lição você vai aprender a desenhar um processo antes de automatizá-lo: identificar entradas, passos, decisões, saídas e exceções, representá-lo num fluxograma simples e resumi-lo numa tabela SIPOC. Ao final, você terá mapeado o processo de "envio de guias mensais" do começo ao fim. Isso importa porque toda ferramenta de automação, sem exceção, pede que você descreva o processo em passos; quem não sabe mapear não consegue automatizar.

## Por que mapear primeiro

Imagine explicar para um motorista de aplicativo o caminho até o escritório dizendo apenas "é perto do centro". Ele vai se perder. Um processo "na cabeça" tem o mesmo problema: você sabe fazê-lo, mas não consegue entregá-lo a um robô. Mapear é escrever a rota completa, com cada curva e cada "se a rua estiver fechada, vire à direita".

Mapear também revela coisas que ninguém via: passos duplicados, aprovações que não servem para nada, e aquele momento em que o processo depende da memória de uma única pessoa.

## As cinco peças de um processo

Todo processo pode ser descrito com cinco elementos:

| Peça | O que é | No envio de guias |
|---|---|---|
| **Entradas** | O que precisa existir antes de começar | Guia gerada no sistema, cadastro do cliente com e-mail |
| **Passos** | As ações, uma após a outra | Baixar o PDF, anexar ao e-mail, enviar |
| **Decisões** | Pontos em que o caminho se divide | O cliente quer por e-mail ou WhatsApp? |
| **Saídas** | O resultado entregue | Guia na caixa de entrada do cliente, registro de envio |
| **Exceções** | O que acontece quando algo foge do normal | Guia não gerada, e-mail devolvido, cliente sem cadastro |

As exceções são a peça que todo mundo esquece e a que mais derruba automações. Pergunte sempre: "o que já deu errado nesse processo nos últimos seis meses?".

## Fluxograma simples (BPMN básico)

O **fluxograma** é o desenho do processo. Existe um padrão internacional chamado **BPMN** (Business Process Model and Notation), mas você só precisa de quatro símbolos para começar:

- **Círculo**: início ou fim do processo.
- **Retângulo**: uma ação ("baixar o PDF da guia").
- **Losango**: uma decisão, com saídas rotuladas ("Sim" / "Não").
- **Seta**: a ordem em que as coisas acontecem.

Em texto, o fluxo de envio de guias fica assim:

```
(início) Dia 15 do mês
  -> [Listar clientes do Simples Nacional ativos]
  -> [Para cada cliente: localizar a guia do DAS no sistema]
  -> <A guia existe?>
       Não -> [Avisar o responsável] -> (fim com pendência)
       Sim -> <Canal preferido do cliente?>
                E-mail    -> [Enviar e-mail com PDF anexo]
                WhatsApp  -> [Enviar mensagem com PDF]
  -> [Registrar data e hora do envio na planilha de controle]
  -> (fim)
```

Repare que cada losango tem todas as saídas tratadas. Um fluxograma em que a decisão "Não" não leva a lugar nenhum é um buraco por onde a automação vai cair.

> **Dica:** ferramentas como draw.io (diagrams.net), Miro ou até o Google Slides servem para desenhar. Mas uma folha de papel com caixas e setas resolve na primeira vez. O desenho importa menos que a conversa que ele provoca.

## SIPOC: o resumo em uma tabela

**SIPOC** é a sigla em inglês para *Suppliers, Inputs, Process, Outputs, Customers*: fornecedores, entradas, processo, saídas e clientes. É uma tabela de cinco colunas que cabe numa página e dá a visão geral antes do detalhe.

| Fornecedores | Entradas | Processo | Saídas | Clientes |
|---|---|---|---|---|
| Sistema contábil, cadastro de clientes | Guia em PDF, e-mail/telefone do cliente, calendário de vencimentos | Localizar guia, escolher canal, enviar, registrar | Guia entregue, registro de envio, lista de pendências | Cliente do escritório, responsável pelo departamento fiscal |

O SIPOC responde "quem fornece o quê para quem" sem entrar em cada passo. O fluxograma responde "em que ordem e com quais decisões". Use os dois: SIPOC para a visão geral, fluxograma para o detalhe.

## Mapeando "envio de guias mensais" passo a passo

Vamos fazer o mapeamento completo como você faria numa reunião com a equipe:

1. **Nomeie o processo e o gatilho.** "Envio de guias do DAS, disparado todo dia 15."
2. **Liste as entradas.** Guias geradas no sistema; cadastro de clientes com nome, CNPJ, e-mail, telefone e canal preferido; lista de quem é Simples Nacional.
3. **Escreva os passos como um estagiário faria.** Abrir o sistema, filtrar o mês, baixar o PDF de cada cliente, salvar na pasta do cliente, abrir o e-mail, anexar, usar o texto padrão, enviar, anotar na planilha.
4. **Marque as decisões.** Guia existe? Canal é e-mail ou WhatsApp? Cliente tem mais de um CNPJ?
5. **Defina as saídas.** Guia entregue, registro com data e hora, lista de pendências para o responsável.
6. **Levante as exceções.** Cliente novo sem cadastro completo; guia com valor zero; e-mail que retorna; cliente que pediu para não receber mais; sistema fora do ar no dia 15.
7. **Valide com quem faz hoje.** A pessoa que envia as guias conhece exceções que não estão em nenhum manual.

O resultado desse exercício é um documento de uma ou duas páginas. Ele será a especificação da sua automação, seja ela feita em Make, n8n, Python ou por um fornecedor.

## Erros comuns

- **Mapear o processo ideal, não o real.** Desenhe como é feito hoje, com as gambiarras. Depois melhore.
- **Decisões sem todas as saídas.** Cada losango precisa de pelo menos duas setas saindo.
- **Esquecer o gatilho.** O que faz o processo começar? Uma data, um e-mail recebido, um documento que chega?
- **Detalhar demais na primeira versão.** Comece com dez passos, não com cem. Refine depois.
- **Não registrar as saídas.** Se o processo não deixa registro, você nunca saberá se a automação funcionou.

## Na prática

Em escritórios contábeis, os processos mais mapeados são: envio de guias, cobrança de documentos, fechamento de folha, integração de notas fiscais e onboarding de cliente novo. Comece pelo que você mapeou mentalmente hoje. Reserve 30 minutos com a pessoa que executa a tarefa, desenhe junto e guarde o resultado numa pasta "Processos" compartilhada. Esse acervo vale ouro quando alguém sai de férias ou quando você contrata.

## Resumo

- Mapear é escrever a rota completa do processo, inclusive os desvios.
- Cinco peças: entradas, passos, decisões, saídas e exceções.
- Fluxograma: círculo (início/fim), retângulo (ação), losango (decisão), seta (ordem). Toda decisão tem todas as saídas tratadas.
- SIPOC resume fornecedores, entradas, processo, saídas e clientes numa tabela.
- Mapeie o processo real, valide com quem executa e guarde o documento: ele é a especificação da automação.
