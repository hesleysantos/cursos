Nesta lição você vai aprender as seis partes de um bom prompt — papel, contexto, tarefa, formato de saída, critérios de qualidade e exemplos — e vai ver, lado a lado, prompts ruins transformados em prompts bons. Ao final, vai saber diagnosticar por que uma resposta saiu ruim e consertar o pedido em vez de brigar com a ferramenta. Essa é a habilidade que separa quem "usa IA" de quem obtém resultado com IA.

## Por que a forma de pedir importa tanto

Lembre da lição sobre funcionamento: o modelo prevê a continuação mais provável para o texto que recebe. Um pedido vago tem infinitas continuações plausíveis, e o modelo escolhe uma genérica. Um pedido específico estreita o caminho: só sobra a resposta que você queria. **Prompt** é o nome que se dá ao texto do pedido; **engenharia de prompt** é a prática de escrevê-lo com método.

Não existe fórmula mágica, mas existe uma anatomia que funciona na grande maioria dos casos.

## As seis partes

**1. Papel.** Quem o modelo deve "ser". Isso ativa o vocabulário, o nível de detalhe e o tom adequados. "Você é um contador experiente explicando para um cliente leigo" produz algo muito diferente de "Você é um auditor revisando o trabalho de um colega".

**2. Contexto.** O que o modelo precisa saber e não tem: quem é o cliente, qual o regime tributário, o que já foi tentado, para que serve a resposta. Lembre-se: ele só vê o que está na conversa.

**3. Tarefa.** O verbo exato: resumir, listar, comparar, reescrever, extrair, classificar, explicar, redigir. Uma tarefa por pedido. "Analise" é vago; "liste os três riscos principais e explique cada um em duas frases" é tarefa.

**4. Formato de saída.** Tabela, lista, parágrafo único, JSON, e-mail pronto, número de palavras ou tópicos. Sem isso, o modelo escolhe — e costuma escolher longo demais.

**5. Critérios de qualidade e restrições.** O que torna a resposta boa e o que ela não pode conter: "sem jargão", "cite o artigo", "não invente prazos", "se não souber, diga", "até 150 palavras".

**6. Exemplos.** Quando o formato é difícil de descrever, mostre. Um exemplo de entrada e saída vale mais que três parágrafos de explicação. A próxima lição aprofunda essa técnica.

> **Dica:** nem todo prompt precisa das seis partes. Um pedido simples pode ter só tarefa e formato. Mas quando a resposta vier ruim, percorra a lista: quase sempre falta uma delas.

## Antes e depois

**Antes:**

```text
Explica o Simples Nacional.
```

Resposta esperada: um texto genérico de várias telas, com informação que o cliente não pediu, sem foco e sem ressalvas.

**Depois:**

```text
Você é um contador explicando para o dono de uma pequena loja de roupas
que está abrindo a empresa agora (papel + contexto).
Explique o que é o Simples Nacional e quais são as duas principais
vantagens e as duas principais desvantagens para o caso dele (tarefa).
Formato: quatro tópicos curtos, seguidos de uma frase final dizendo o que
ele precisa decidir (formato).
Sem jargão, sem citar artigos de lei, até 150 palavras. Não afirme valores
de limite de faturamento; diga que eles mudam e devem ser consultados
(critérios e restrições).
```

Resposta esperada (resumo): quatro tópicos objetivos (unificação de tributos e menos burocracia como vantagens; possíveis alíquotas maiores em alguns anexos e restrições de atividade como desvantagens), uma frase de fechamento e nenhum número inventado.

**Antes:**

```text
Faz um e-mail pro cliente sobre os documentos.
```

**Depois:**

```text
Você é assistente de um escritório contábil. O cliente "Padaria Boa Massa"
(Simples Nacional) ainda não enviou os extratos bancários e as notas de
compra de setembro; o prazo interno de fechamento é dia 10.
Redija um e-mail curto (até 100 palavras) pedindo os documentos até o
dia 8, em tom cordial, listando os dois itens pendentes em tópicos e
oferecendo ajuda para o envio. Assine como "Equipe Contábil".
```

Resposta esperada (resumo): e-mail pronto para enviar, com os dois itens em lista, data clara e assinatura — sem precisar reescrever.

## Como diagnosticar uma resposta ruim

| Sintoma | Parte que faltou |
|---|---|
| Resposta genérica, poderia servir para qualquer um | Contexto |
| Tom errado (muito técnico ou muito informal) | Papel |
| Fez outra coisa, ou várias coisas | Tarefa |
| Longa demais, ou no formato errado | Formato |
| Inventou números, incluiu o que você não queria | Critérios e restrições |
| Quase certo, mas não "do jeito" que você precisa | Exemplos |

Esse diagnóstico é o coração do ciclo pedir → verificar → ajustar: em vez de dizer "ficou ruim", você diz exatamente o que faltou.

## Erros comuns

1. **Pedir tudo de uma vez.** "Explique, compare, calcule e escreva o e-mail." Divida em pedidos encadeados.
2. **Esconder o objetivo.** "Resuma este texto" rende um resumo qualquer; "resuma para eu decidir se preciso avisar os clientes" rende o resumo certo.
3. **Supor que ele sabe o seu contexto.** Ele não sabe o regime do cliente, o nome do sistema nem o que foi combinado ontem.
4. **Não dizer o tamanho.** Sem limite, o modelo escreve demais, e você perde tempo cortando.
5. **Papel exagerado.** "Você é o maior especialista do mundo" não melhora nada; um papel realista e específico melhora.

## Na prática

Monte um bloco de contexto fixo do escritório e guarde num arquivo de texto: quem vocês são, tipo de clientes, tom padrão, regras (citar artigo, não inventar prazos, dizer quando não sabe). Cole esse bloco no início dos prompts importantes — ou coloque num projeto, como visto no módulo anterior. A partir daí, cada pedido só precisa da tarefa, do formato e do que é específico daquele caso. O tempo de escrever um bom prompt é de um a dois minutos; o tempo que ele economiza é de dez a trinta.

## Resumo

- Um prompt bom tem papel, contexto, tarefa, formato, critérios/restrições e, quando preciso, exemplos.
- Pedido vago gera resposta genérica porque o modelo escolhe a continuação mais provável entre muitas.
- Uma tarefa por pedido, com verbo exato e tamanho definido.
- Diagnostique a resposta ruim pela parte que faltou e corrija o prompt, não a ferramenta.
- Guarde um bloco de contexto do escritório para reaproveitar.
