Nesta lição você vai aplicar tudo que aprendeu aos trabalhos de texto mais comuns do escritório: e-mails profissionais, resumos de documentos longos, extração de dados de textos, tradução e revisão de tom. Cada caso traz um prompt pronto, o que esperar e o que conferir. A ideia é que, ao terminar, você tenha cinco modelos testados para adaptar ao seu dia a dia.

## E-mails profissionais

E-mail é a tarefa de maior retorno imediato: baixa consequência de erro, alto volume, e o modelo é muito bom nisso. O segredo está no contexto e no tom.

```text
Você é assistente de um escritório contábil. Escreva um e-mail para o
cliente "Clínica Sorriso" (Lucro Presumido) informando que o imposto do
trimestre ficou cerca de 18% maior que o anterior porque a receita
cresceu e porque uma nota de serviço de julho não havia sido considerada
no trimestre passado. Tom: profissional e tranquilizador; explique sem
culpar ninguém; ofereça uma reunião de 20 minutos. Até 130 palavras.
Não cite valores em reais; eu insiro depois.

Resposta esperada (resumo):
Um e-mail que explica as duas causas em linguagem simples, não aponta
culpados, convida para a reunião e deixa marcadores onde entram os
valores. Verificação: ler, inserir valores e confirmar que a explicação
bate com o cálculo.
```

Variações úteis: "versão mais curta para WhatsApp", "mesmo conteúdo em três níveis de formalidade", "acrescente um P.S. lembrando do prazo".

## Resumos de documentos longos

Para normas, contratos e relatórios, anexe o documento e **diga para que serve o resumo**. Um resumo para decidir se o escritório precisa agir é diferente de um resumo para treinar a equipe.

```text
Com base exclusivamente no documento anexo (uma instrução normativa),
produza:
1. Em uma frase: o que a norma faz.
2. Em até 8 tópicos: as mudanças, cada uma com o artigo entre parênteses.
3. Em até 3 tópicos: o que um escritório contábil que atende empresas do
   Simples Nacional precisa fazer, e até quando.
Se a norma não trouxer prazo, escreva "sem prazo no texto". Não acrescente
informação de fora do documento.

Resposta esperada (resumo):
Três blocos curtos, cada afirmação ligada a um artigo. Verificação de
nível médio: abrir dois ou três artigos citados e confirmar.
```

Para documentos muito grandes, use a estratégia da lição de contexto: resumo por capítulo e depois síntese dos resumos.

## Extração de dados de textos

Transformar texto bagunçado em dados estruturados é um dos melhores usos: e-mails com pedidos, contratos com datas e valores, anotações de reunião.

```text
Do e-mail entre <<< e >>>, extraia em uma tabela: Funcionário | Evento
(admissão, demissão, férias, afastamento) | Data | Observação. Uma linha
por evento. Se algum dado faltar, escreva "não informado". Não deduza
datas que não estejam escritas.

<<<
Bom dia! Esse mês temos a admissão da Carla dia 03, o Pedro sai de férias
de 15 a 29 e o Marcos pediu demissão, último dia 20. A Ana volta do
afastamento, mas ainda não sei quando. Obrigado!
>>>

Resposta esperada (resumo):
Quatro linhas: Carla/admissão/03; Pedro/férias/15 a 29; Marcos/demissão/20;
Ana/afastamento (retorno)/não informado. Verificação: comparar linha a
linha com o e-mail — leva 30 segundos e evita um erro de folha.
```

O delimitador e a instrução "não deduza" são o que protegem contra invenções, por exemplo o modelo completar o mês e o ano que não estavam no texto.

## Tradução

Modelos traduzem muito bem textos profissionais. O que faz diferença é dizer o **registro** (formal ou informal), o **público** e os **termos que não devem ser traduzidos**.

```text
Traduza o texto abaixo do português para o inglês, registro formal, para
um investidor estrangeiro que vai ler o relatório. Mantenha os termos
"Simples Nacional", "CNPJ" e "Nota Fiscal" em português, com uma breve
explicação entre parênteses na primeira ocorrência. Preserve a formatação
em tópicos.

[texto]

Resposta esperada (resumo):
Tradução fluente, termos brasileiros mantidos com explicação curta,
tópicos preservados. Verificação: ler os números e nomes próprios
(datas e valores são o que mais se perde na tradução).
```

Para contratos e documentos com efeito legal, a tradução por IA é rascunho para um tradutor ou advogado; não substitui tradução juramentada.

## Revisão de tom e clareza

Pedir revisão é diferente de pedir reescrita. Na revisão, você quer **manter o conteúdo** e melhorar a forma — e quer saber o que foi mudado.

```text
Revise o texto abaixo para um cliente leigo: simplifique frases longas,
troque jargão por termos comuns, mantenha todo o conteúdo e o tom
respeitoso. Depois do texto revisado, liste em tópicos o que você alterou
e por quê.

[texto]

Resposta esperada (resumo):
O texto revisado seguido de uma lista de alterações ("troquei 'exação'
por 'cobrança'; dividi a frase do segundo parágrafo"). A lista permite
aceitar ou rejeitar cada mudança, e aprender com elas.
```

Outros pedidos da mesma família: "aponte ambiguidades que um cliente poderia interpretar errado", "verifique se o texto responde às três perguntas que o cliente fez", "deixe mais objetivo sem perder a cordialidade".

## Qual tarefa pedir: um guia rápido

Muitas vezes a dúvida não é como pedir, mas o que pedir. Um atalho: pergunte-se o que você vai fazer com o resultado. Se vai **enviar**, peça o texto pronto (e-mail) com tom e tamanho. Se vai **decidir**, peça resumo com finalidade declarada. Se vai **lançar num sistema ou planilha**, peça extração em tabela ou JSON. Se o leitor é **de outro idioma**, peça tradução com registro e termos preservados. Se o texto **já existe e está ruim**, peça revisão com lista de alterações, não reescrita.

> **Dica:** quando não souber qual verbo usar, descreva o destino da resposta ("isso vai para o cliente por e-mail", "isso vai para a planilha de folha"). O modelo escolhe o formato adequado com muito mais acerto quando sabe para onde o texto vai.

Esse hábito também reduz as idas e vindas: uma resposta pedida para o destino certo raramente precisa de mais de um ajuste.

## Erros comuns

1. **E-mail sem contexto do cliente.** Sai genérico e você reescreve tudo.
2. **Resumo sem finalidade.** Sai um resumo qualquer, não o que você precisava.
3. **Extração sem "não deduza".** O modelo completa datas, valores e nomes que não estavam lá.
4. **Tradução sem lista de termos a preservar.** Siglas brasileiras viram siglas inventadas em inglês.
5. **Revisão sem pedir a lista de alterações.** Você não sabe o que mudou e pode perder uma informação.

## Na prática

Escolha o tipo de texto que mais consome seu tempo e crie o template correspondente com as variáveis do seu escritório. Teste com três casos reais (anonimizados), ajuste e compartilhe. Em geral, e-mails e resumos são os primeiros a render; extração vem logo depois e abre caminho para as automações dos próximos módulos, em que esse mesmo prompt vai rodar sozinho sobre dezenas de e-mails.

## Resumo

- E-mails: contexto do cliente, tom, tamanho e o que não incluir; a IA brilha aqui.
- Resumos: anexe, diga a finalidade, exija artigo por afirmação e "sem prazo no texto" quando faltar.
- Extração: delimitadores, tabela com colunas fixas, "não informado" e "não deduza".
- Tradução: registro, público e termos a preservar; documentos legais exigem profissional.
- Revisão: manter conteúdo, melhorar forma, e pedir a lista do que mudou.
