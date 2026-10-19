Nesta lição você vai aprender cinco técnicas que resolvem a maior parte dos problemas de qualidade: dar exemplos (few-shot), pedir raciocínio passo a passo, decompor tarefas grandes em etapas, usar restrições e negativas, e pedir que o modelo faça perguntas antes de responder. Cada uma tem um motivo para funcionar, e entender o motivo é o que permite usá-las na hora certa.

## Técnica 1: exemplos (few-shot)

O modelo é um imitador de padrões. Se você mostra dois ou três exemplos de entrada e saída no formato exato que quer, ele completa o padrão com muito mais precisão do que se você descrever o formato em palavras. O nome técnico é **few-shot** ("poucos exemplos"); sem exemplo nenhum é **zero-shot**.

```text
Classifique cada lançamento bancário em uma destas categorias:
FORNECEDOR, TRIBUTO, FOLHA, TARIFA, RECEITA, OUTROS.

Exemplos:
"PIX ENVIADO DISTRIBUIDORA ABC" -> FORNECEDOR
"DARF 0220 COMPETENCIA 08/2026" -> TRIBUTO
"TAR MANUT CONTA" -> TARIFA
"TED RECEBIDA CLIENTE XYZ" -> RECEITA

Agora classifique:
"PIX ENVIADO MARIA SOUZA SALARIO"
"DAS SIMPLES NACIONAL"
"PGTO BOLETO ENERGISA"

Resposta esperada (resumo):
FOLHA, TRIBUTO, FORNECEDOR (ou OUTROS, dependendo do critério do
escritório para despesas de consumo). Os exemplos fixam o formato
"texto -> CATEGORIA" e o vocabulário permitido.
```

Dicas: use exemplos variados (um de cada categoria importante), inclua um exemplo difícil, e mantenha o formato idêntico ao que quer receber. Exemplos com erro ensinam o erro.

## Técnica 2: raciocínio passo a passo

Quando a tarefa exige lógica — um cálculo, uma decisão com várias condições, uma análise de enquadramento —, pedir que o modelo **mostre o raciocínio antes da conclusão** melhora a resposta. O motivo é mecânico: como ele gera uma palavra por vez, escrever os passos intermediários dá a ele "espaço de trabalho" para chegar à conclusão certa. Se você exige a resposta final na primeira linha, ele chuta e depois justifica o chute.

```text
Uma empresa de serviços de TI faturou R$ 3,9 milhões nos últimos 12 meses
e tem folha de R$ 1,2 milhão. Analise se ela deve ficar atenta ao
fator R do Simples Nacional. Antes de concluir, mostre o raciocínio em
etapas numeradas: o que é o fator R, como se calcula, qual o resultado
neste caso e o que isso implica. Só então dê a conclusão em uma frase.
Indique o que precisa ser confirmado na legislação vigente.

Resposta esperada (resumo):
Etapas: definição do fator R (folha ÷ receita), cálculo (1,2 ÷ 3,9 ≈ 0,31),
comparação com o limite de 28%, implicação (tende ao anexo mais favorável)
e ressalva para confirmar regras e anexos atuais. Conclusão só no final.
```

Os modelos "de raciocínio" fazem isso internamente, mas pedir a exposição dos passos continua útil porque permite que **você** confira a lógica.

## Técnica 3: decomposição em etapas

Tarefas grandes saem melhor em pedaços. Em vez de "analise este contrato e me diga tudo que importa", faça uma cadeia:

1. "Liste as cláusulas deste contrato com uma frase sobre cada uma."
2. "Das cláusulas listadas, quais envolvem obrigação financeira para o contratante? Explique cada uma."
3. "Com base na sua resposta anterior, redija três perguntas que eu deveria fazer ao cliente antes de assinar."

Cada etapa recebe a atenção inteira do modelo, e você confere no meio do caminho — se a etapa 1 veio errada, não vale a pena continuar. Decompor também é a base das automações que você vai construir mais adiante no curso: cada etapa vira um passo do fluxo.

## Técnica 4: restrições e negativas

Dizer o que **não** fazer é tão importante quanto dizer o que fazer. Restrições típicas no trabalho contábil:

- "Não invente números, prazos ou artigos; se não souber, escreva 'confirmar'."
- "Não use jargão; o leitor é leigo."
- "Não altere os dados; só reporte."
- "Não inclua introdução nem conclusão; só a lista."
- "Responda apenas com base no documento anexo."

Uma ressalva: negativas funcionam melhor acompanhadas da alternativa positiva. "Não seja prolixo" é fraco; "responda em até 5 tópicos de uma linha" é forte. O modelo segue instruções concretas com mais fidelidade do que proibições abstratas.

## Técnica 5: perguntas de esclarecimento antes

Quando a tarefa é complexa e você suspeita que falta informação, inverta o jogo: peça que o modelo pergunte antes de responder.

```text
Quero montar um fluxo de onboarding (entrada e integração) para clientes
novos do escritório.
Antes de propor qualquer coisa, faça-me até 5 perguntas sobre o que você
precisa saber (tipo de clientes, sistemas usados, quem faz o quê).
Só depois das respostas, monte o fluxo.

Resposta esperada (resumo):
Cinco perguntas objetivas (porte dos clientes, regimes atendidos, sistema
contábil, responsáveis, prazos). Depois das suas respostas, um fluxo
muito mais aderente do que o genérico que sairia de primeira.
```

Isso funciona porque força o levantamento de contexto que você talvez não lembrasse de dar — e evita que o modelo preencha as lacunas com suposições.

## Combinando técnicas

As cinco se combinam. Um prompt de classificação pode ter exemplos (técnica 1), uma restrição de categorias permitidas (técnica 4) e, para casos ambíguos, o pedido de justificar em uma linha (técnica 2). Um projeto grande começa com perguntas (técnica 5), segue decomposto (técnica 3) e cada etapa usa restrições (técnica 4).

## Erros comuns

1. **Exemplos inconsistentes** (formatos diferentes entre si). O modelo não sabe qual seguir.
2. **Pedir "pense passo a passo" para tarefas triviais.** Alonga a resposta sem ganho; reserve para lógica e cálculo.
3. **Decompor demais.** Dez etapas para um e-mail é burocracia; decomponha quando a tarefa realmente tem partes.
4. **Só negativas.** "Não faça X, não faça Y" sem dizer o que fazer.
5. **Aceitar as perguntas de esclarecimento e não respondê-las.** O modelo vai supor as respostas.

## Na prática

Um uso que paga a lição: montar o prompt de classificação de lançamentos do escritório com dez exemplos reais (anonimizados), as categorias do plano de contas e a instrução "em caso de dúvida, marque REVISAR e explique em uma linha". Teste com 30 lançamentos, meça os acertos, ajuste os exemplos. Esse mesmo prompt, mais tarde, vira o núcleo de uma automação via API.

## Resumo

- Few-shot: mostre dois ou três exemplos no formato exato; o modelo imita padrões.
- Passo a passo: peça o raciocínio antes da conclusão em tarefas de lógica e cálculo; isso dá "espaço de trabalho" ao modelo e permite conferir.
- Decomposição: tarefas grandes em etapas encadeadas, com conferência entre elas.
- Restrições: diga o que não fazer e, sempre que possível, o que fazer no lugar.
- Perguntas antes: em tarefas complexas, peça que o modelo levante o que falta antes de responder.
