Nesta lição você vai aprender o fluxo de trabalho que separa quem "pede código para a IA" de quem **entrega software que funciona**: especificar, planejar, implementar em passos, testar, revisar e commitar. Você vai sair com um modelo de especificação curta que cabe em dez linhas e serve para qualquer automação do escritório. Isso importa porque, com o Claude Code, o gargalo deixou de ser digitar código e passou a ser dizer com precisão o que precisa existir e conferir se existe.

## Por que o fluxo importa mais com IA

Quando você mesmo escreve um script, as decisões acontecem devagar, uma linha por vez, e você percebe as dúvidas no caminho ("e se a planilha vier sem cabeçalho?"). O Claude Code produz cem linhas em segundos. Se a pergunta não foi feita antes, ele escolhe uma resposta por conta própria, e a escolha pode ser a errada: arredondar centavos, ignorar linhas em branco, tratar `01/02/2026` como 2 de janeiro.

Um fluxo explícito faz três coisas: obriga você a pensar nos casos difíceis **antes** de gerar código, dá ao Claude um critério objetivo de "pronto" e deixa um rastro (testes, commits) que permite voltar atrás quando algo quebra. Nos módulos anteriores você viu o modo de planejamento e o CLAUDE.md; aqui eles entram em um ciclo completo.

## As seis etapas

1. **Especificar**: escrever o objetivo, as entradas e saídas e os critérios de aceite.
2. **Planejar**: pedir ao Claude um plano em passos e ajustá-lo antes de qualquer edição (no terminal, o modo de planejamento serve exatamente para isso).
3. **Implementar em passos**: um passo por vez, cada um pequeno o suficiente para ser lido inteiro.
4. **Testar**: rodar os testes automatizados e um teste manual com dados reais (anonimizados).
5. **Revisar**: ler o diff, pedir revisão crítica, corrigir.
6. **Commitar**: registrar no Git com mensagem que explique o porquê.

A ordem não é burocracia. Especificar antes de planejar evita planos para o problema errado; testar antes de revisar faz a revisão se concentrar no que os testes não pegam (nomes ruins, segurança, legibilidade); commitar por último garante que o histórico só tem versões que passaram por tudo isso.

## O modelo de especificação curta

Uma especificação não precisa de documento formal. Precisa responder quatro perguntas de forma verificável:

```text
OBJETIVO: Consolidar as planilhas de honorários de cada cliente em uma única
planilha mensal, para conferência do financeiro.

ENTRADAS: pasta `entradas/` com arquivos .xlsx, um por cliente, abas "Honorarios"
com colunas Cliente | Competencia | Valor | Pago (S/N).

SAÍDAS: `saida/consolidado-AAAA-MM.xlsx` com as mesmas colunas mais a coluna
Arquivo de origem; uma linha de total por cliente no final.

CRITÉRIOS DE ACEITE:
- Valores são lidos como número, nunca como texto; "R$ 1.234,56" vira 1234.56.
- Linhas sem Cliente ou sem Valor são ignoradas e listadas no log.
- Se dois arquivos trouxerem o mesmo Cliente+Competencia, o script avisa e para.
- O total geral bate com a soma manual da amostra `exemplos/amostra.xlsx` (R$ 18.450,00).
- Roda com `python consolidar.py 2026-10` no Windows, sem perguntar nada.
```

Repare no que torna isso útil para o Claude: nomes de arquivos, colunas e comandos exatos; números concretos para conferir; comportamento definido para os casos chatos (vazio, duplicado). "Fazer um script que junta planilhas" não tem nada disso.

> **Dica:** critérios de aceite são frases que começam com "o programa deve" e terminam com algo que dá para checar: um número, um arquivo, uma mensagem. Se não dá para checar, não é critério, é desejo.

## Do plano aos passos

Com a especificação pronta, o prompt de planejamento fica curto:

```text
Leia a especificação em docs/especificacao.md. Antes de editar qualquer arquivo,
proponha um plano em passos pequenos (no máximo 6), dizendo para cada passo
quais arquivos serão criados ou alterados e como vamos testá-lo. Aguarde
minha aprovação.
```

O plano que volta costuma ter a forma "1. estrutura do projeto e ambiente; 2. função que lê um arquivo; 3. função que valida linhas; 4. consolidação; 5. gravação e totais; 6. linha de comando e log". Aprove, corte ou reordene. Depois, peça **um passo por vez**:

```text
Implemente apenas o passo 2 (função ler_planilha). Escreva primeiro os testes
em tests/test_ler_planilha.py, rode pytest, depois implemente até passar.
Não avance para o passo 3.
```

Passos pequenos têm uma vantagem prática: quando algo sai errado, o diff tem trinta linhas, não trezentas, e você consegue entender o que mudou.

## Testar, revisar, commitar

Testar tem dois níveis. O automatizado (`pytest`) garante que cada função faz o que a especificação pede; o manual com a amostra real garante que o conjunto faz sentido ("o total bateu com R$ 18.450,00?"). Faça os dois. Revisar é ler o diff com olhos de contador: a regra de negócio está certa? O arredondamento está certo? O que acontece com acento no nome do cliente? Commitar é o fecho: `git add`, `git commit -m "Lê planilhas de honorários com validação de linhas"`. No Claude Code, você pode pedir o commit no próprio prompt; o Claude roda os comandos de Git e escreve a mensagem a partir do diff, mas você continua responsável por conferi-la.

## Erros comuns

- **Pular a especificação "porque é simples".** O script simples de hoje vira o robô de fechamento de amanhã, e ninguém lembra as regras.
- **Aprovar um plano sem ler.** O plano é o único momento barato para dizer "não, a competência vem do nome do arquivo, não da célula".
- **Pedir tudo de uma vez.** Resultado: um arquivo de 400 linhas que você não entende e não consegue testar por partes.
- **Testar só com o arquivo bonito.** Inclua na amostra a planilha torta do cliente que sempre dá problema.
- **Commitar código que ainda não passou nos testes.** O histórico perde o valor de "ponto seguro para voltar".

## Na prática

No escritório, a especificação curta vira o documento que você manda para o colega que vai usar o script, e os critérios de aceite viram o roteiro de conferência do primeiro mês. Um fluxo típico de sessão de trinta minutos: cinco minutos escrevendo ou revisando a especificação, cinco no plano, quinze implementando um ou dois passos com testes, cinco revisando e commitando. Pequeno, repetível, auditável.

## Resumo

- O fluxo é: especificar, planejar, implementar em passos, testar, revisar, commitar.
- Com IA, a especificação importa mais, porque decisões não tomadas por você serão tomadas pelo modelo.
- Uma boa especificação tem objetivo, entradas, saídas e critérios de aceite verificáveis.
- Peça um plano antes de editar e implemente um passo por vez, com testes.
- Só commite o que passou em testes e revisão.
