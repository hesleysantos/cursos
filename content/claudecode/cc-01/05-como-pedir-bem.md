Nesta lição você vai aprender a formular pedidos que o Claude Code consegue executar bem: tarefas pequenas e verificáveis, com contexto suficiente, critérios de aceite claros e, quando a mudança é grande, um plano antes do código. A diferença entre um pedido bom e um ruim é a diferença entre uma tarde produtiva e uma tarde corrigindo o que o agente entendeu errado.

## O princípio: delegar, não ditar

A documentação sugere pensar em "delegar a um colega capaz": dar **contexto e direção**, e deixar que ele descubra os detalhes (quais arquivos ler, quais comandos rodar). Você não precisa ditar cada passo, mas precisa dizer o que quer, onde está e como saber se ficou pronto. O resumo oficial é "seja específico": em vez de "corrija o bug", "corrija o bug de login em que o usuário vê a tela em branco depois de errar a senha".

## Os quatro ingredientes de um bom pedido

1. **Objetivo**: o que deve existir ou mudar ao final.
2. **Contexto**: onde está o código (arquivos, pastas), qual a regra de negócio, o que **não** pode mudar.
3. **Critérios de aceite**: como verificar — exemplos de entrada e saída, um teste, um comando que deve passar.
4. **Escopo**: tamanho pequeno e um pedido por vez.

A documentação enfatiza o terceiro ponto: "dê ao Claude uma forma de verificar o próprio trabalho". Quando existe um teste ou um exemplo com resultado esperado, ele roda, lê o resultado e itera sozinho até passar. Sem isso, "parece pronto" é o único sinal que ele tem — e quem descobre o erro é você.

## Exemplos para um script contábil

Suponha o script `competencia.py`, que extrai a competência (mês/ano) do nome de arquivos de notas fiscais.

**Ruim** (vago, sem critério):

```text
melhora o script de competência
```

**Bom** (objetivo, contexto, critério, escopo):

```text
Em competencia.py, a função extrair_competencia(nome) deve devolver a competência
no formato "AAAA-MM" a partir do nome do arquivo. Hoje ela só reconhece datas como
2026-03-15. Faça ela aceitar também o formato brasileiro 15-03-2026 e 15_03_2026.
Exemplos que devem funcionar:
- "NF_1234_2026-03-15.pdf" -> "2026-03"
- "NF 98 15-03-2026.pdf" -> "2026-03"
- "sem_data.pdf" -> None
Não mude a assinatura da função. Depois, rode python -m pytest e me mostre o resultado.
```

**Ruim** (grande demais, vários pedidos):

```text
faça o organizador completo com interface, banco de dados, envio de e-mail e relatório em PDF
```

**Bom** (fatiado):

```text
Primeira etapa: apenas a função que lê a pasta "entrada" e lista os PDFs com a competência
detectada, sem mover nada. Me mostre a lista para eu conferir antes de seguirmos.
```

## Pedir plano antes

Para mudanças que tocam vários arquivos ou cuja abordagem você não tem certeza, a documentação recomenda **explorar, planejar e só então codificar**: entre no modo plan (Shift+Tab até `⏸ plan mode on`, ou `claude --permission-mode plan`), peça o plano, revise, e aprove. No modo plan ele lê e explora, mas não edita nada. Exemplo:

```text
Quero que o organizador passe a gravar um log em CSV de cada arquivo movido
(nome original, destino, data/hora). Quais arquivos precisam mudar? Monte um plano
antes de editar.
```

Quando o plano aparecer, você pode editá-lo no seu editor com **Ctrl+G** e então aprovar. A própria documentação pondera: se a mudança cabe em uma frase (corrigir um erro de digitação, renomear uma variável), **não** planeje — peça direto.

## Pedir explicação antes de mudar

Em código que você não escreveu (ou escreveu há dois anos), peça para explicar primeiro:

```text
Antes de mudar qualquer coisa: explique como conciliacao.py decide que um lançamento
bancário "bate" com um lançamento contábil. Liste as regras e os casos que ele ignora.
```

Isso tem dois ganhos: você confirma que o agente entendeu o código, e você descobre comportamentos que não lembrava antes de mexer neles.

## Iterar

Um pedido raramente fica perfeito de primeira, e a documentação trata isso como o normal: "Corrija o bug" → ele tenta → "não é isso, o problema está no tratamento da sessão" → ele ajusta. Duas regras práticas:

- Corrija **cedo**: assim que vir o rumo errado, pressione **Esc** para interromper e redirecione.
- Se já corrigiu a mesma coisa **duas vezes** sem sucesso, a conversa está poluída; use `/clear` e escreva um pedido novo e melhor, incorporando o que aprendeu.

## Erros comuns

- **Omitir a regra de negócio**: "agrupe por mês" sem dizer se é mês de emissão, de vencimento ou de pagamento.
- **Pedir sem exemplo**: sem entrada e saída esperadas, ele escolhe por você.
- **Juntar três pedidos numa mensagem**: ele faz os três e você revisa um diff enorme.
- **"Deixe tudo mais robusto"**: adjetivos não são critérios.
- **Não dizer o que não pode mudar**: a assinatura de uma função que outro script usa, o formato de um arquivo que o sistema contábil importa.

## Na prática

Monte um modelo mental de pedido e use sempre: *"Em [arquivo], faça [objetivo]. Regra: [regra de negócio]. Exemplos: [entrada → saída]. Não mude [restrição]. Depois rode [comando] e me mostre."* Em pedidos grandes, acrescente "monte um plano antes". Em código desconhecido, acrescente "explique antes". Em uma semana isso vira hábito, e os diffs que você revisa passam a ser pequenos e previsíveis.

## Resumo

- Bons pedidos têm objetivo, contexto, critério de aceite e escopo pequeno.
- Dê ao agente uma forma de verificar: exemplos de entrada/saída, testes, um comando que deve passar.
- Mudança grande ou incerta: modo plan primeiro; mudança de uma frase: direto.
- Em código desconhecido, peça explicação antes de editar.
- Iterar é normal; corrija cedo (Esc) e, após duas correções sem sucesso, `/clear` e recomece melhor.
