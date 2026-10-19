Nesta lição você vai ver cinco casos práticos de uso de IA no trabalho de um escritório contábil, com os prompts reais e o que esperar de cada um, vai aprender o fluxo "pedir → verificar → ajustar" que transforma uma resposta mediana numa entrega boa, e vai montar o seu registro de uso de IA. É a lição em que tudo que vimos até aqui vira rotina.

## O fluxo: pedir → verificar → ajustar

Quem usa IA mal faz um pedido e copia a resposta. Quem usa bem trabalha em três passos:

1. **Pedir** com contexto, tarefa clara e formato desejado (o módulo 2 aprofunda isso).
2. **Verificar** pelo custo do erro (lição 3): bom senso, fonte original ou fonte oficial.
3. **Ajustar**: dizer o que ficou ruim e pedir de novo. "Mais curto", "tire o jargão", "o item 3 está errado porque…" A segunda versão costuma ser muito melhor que a primeira, e a terceira melhor ainda.

Esse ciclo leva poucos minutos e é a diferença entre "a IA não serve" e "a IA me poupou uma hora".

## Caso 1: resumir uma norma

```text
Prompt (com o PDF anexado):
Você é um contador explicando para a equipe do escritório. Com base
exclusivamente no documento anexo, faça um resumo em até 10 tópicos:
o que muda, para quem se aplica, a partir de quando, e o que o escritório
precisa fazer. Cite o artigo ao lado de cada tópico. Se algo não estiver
claro no texto, diga "a norma não especifica".

Resposta esperada (resumo):
Dez tópicos curtos, cada um com referência ao artigo, separando regra,
público, vigência e ação prática. Verificação: abra dois artigos citados
e confira se dizem aquilo.
```

Por que funciona: papel definido, fonte restrita ao anexo, formato fixo e permissão explícita para dizer que não sabe.

## Caso 2: redigir um e-mail difícil

```text
Prompt:
Escreva um e-mail para um cliente (empresa de comércio, Simples Nacional)
avisando que a documentação do mês chegou com 10 dias de atraso pela
terceira vez e que isso compromete os prazos das obrigações. Tom: firme,
educado, sem ameaça. Até 120 palavras. Termine propondo uma data fixa
mensal de envio.

Resposta esperada (resumo):
Um e-mail curto, cordial, que descreve o problema, explica a consequência
e propõe a solução. Ajuste típico: "deixe menos formal" ou "mencione que
podemos ajudar a organizar o envio".
```

Por que funciona: você deu contexto do cliente, o tom, o tamanho e o fechamento desejado. Verificação: nível baixo, leia e ajuste.

## Caso 3: revisar uma planilha

```text
Prompt (com a planilha anexada ou o trecho colado):
Esta é uma conciliação bancária. Verifique: (1) se há lançamentos
duplicados (mesma data, valor e histórico), (2) se a soma da coluna
"Valor" bate com o total informado na última linha, (3) se há datas
fora do mês de referência. Liste cada achado com a linha e o motivo.
Não altere os dados; só reporte.

Resposta esperada (resumo):
Uma lista de achados por linha. Verificação: confira cada achado na
planilha — o modelo pode errar somas longas; se a ferramenta executar
código, peça que recalcule por código.
```

Por que funciona: critérios objetivos, pedido de reportar sem alterar. Nível médio a alto: confira os números.

## Caso 4: explicar legislação a um leigo

```text
Prompt:
Explique para o dono de uma padaria, sem jargão, o que é a substituição
tributária do ICMS e por que o preço de compra de alguns produtos já vem
com imposto embutido. Use uma analogia do dia a dia e termine com uma
frase sobre o que ele deve conferir na nota de compra. Até 150 palavras.

Resposta esperada (resumo):
Uma explicação simples com analogia (por exemplo, "o imposto é cobrado
na fábrica, de uma vez, para toda a cadeia"), sem citar artigos, com
um alerta prático no final.
```

Por que funciona: público definido, proibição de jargão, pedido de analogia e de fechamento prático. Verificação: o conceito tem de estar certo; se a analogia distorcer, ajuste.

## Caso 5: gerar um checklist

```text
Prompt:
Monte um checklist de fechamento mensal para um cliente do Lucro Presumido,
prestador de serviços, com 5 funcionários. Separe em: fiscal, contábil,
departamento pessoal e entregas ao cliente. Formato: lista com caixas de
seleção. Não inclua prazos específicos; eu preencho.

Resposta esperada (resumo):
Um checklist organizado em quatro blocos. Ajuste típico: remover itens
que não se aplicam e acrescentar particularidades do escritório.
Depois, salve como modelo.
```

Por que funciona: perfil do cliente, categorias, formato e uma restrição que evita prazos inventados.

## Outros usos que valem a pena

- Transformar anotações de reunião em ata estruturada.
- Traduzir uma mensagem de erro do sistema para português claro e sugerir causas.
- Preparar perguntas para uma reunião com cliente novo.
- Reescrever um texto técnico em três níveis: para o sócio, para o cliente e para o estagiário.
- Criar um roteiro de treinamento para um procedimento interno.

Em todos eles, o padrão é o mesmo: a IA faz o rascunho, você faz a conferência e a decisão.

## Registro do que foi feito com IA

Registrar protege você (prova de diligência), ajuda a equipe (reaproveitamento) e atende à política do escritório. Um registro mínimo tem:

| Campo | Exemplo |
|---|---|
| Data | 12/03/2026 |
| Tarefa | Resumo da IN sobre obrigações acessórias |
| Ferramenta e conta | Assistente X, conta corporativa |
| Dados enviados | PDF público da IN; nenhum dado de cliente |
| Verificação feita | Artigos 3 e 7 conferidos no texto oficial |
| Responsável | Nome |

Pode ser uma planilha compartilhada ou um campo no sistema de tarefas. O importante é que exista e seja usado. Para entregas a clientes, considere uma nota discreta no documento: "rascunho elaborado com apoio de IA e revisado por [nome]".

## Erros comuns

1. **Pular a verificação porque a resposta "ficou boa".** Qualidade de texto não é qualidade de conteúdo.
2. **Pedir tudo de uma vez.** "Resuma a norma, escreva o e-mail e monte o checklist" numa mensagem só gera três coisas medianas. Uma tarefa por pedido.
3. **Não ajustar.** Aceitar a primeira versão desperdiça o maior ganho da ferramenta.
4. **Não guardar o que funcionou.** Um prompt que deu certo vira modelo; você vai construir sua biblioteca no módulo 2.

## Na prática

Comece pequeno: escolha **uma** tarefa recorrente desta semana, rode o fluxo pedir → verificar → ajustar, registre e compare o tempo com o que gastava antes. Se economizou, padronize. Se não, mude a tarefa ou o pedido. Em um mês você terá cinco ou seis fluxos que funcionam, e eles serão a base de tudo que vem a seguir neste curso: prompts melhores, assistentes personalizados e, mais adiante, automações e aplicativos construídos com IA.

## Resumo

- O fluxo é pedir → verificar → ajustar; a segunda versão quase sempre supera a primeira.
- Casos que funcionam bem: resumir normas com anexo, e-mails, revisão de planilhas com critérios, explicações para leigos e checklists.
- Em todos, a IA rascunha e você confere no nível de rigor que o erro exige.
- Registre data, tarefa, ferramenta, dados enviados, verificação e responsável.
- Comece por uma tarefa, meça o ganho e padronize o que funciona.
