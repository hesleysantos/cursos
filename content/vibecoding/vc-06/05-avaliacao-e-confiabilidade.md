Nesta lição você vai aprender a responder, com números, à pergunta "esse sistema de IA funciona?": montar um **conjunto de teste**, calcular métricas simples (**acurácia**, **precisão**, **revocação**), organizar a **revisão humana**, comparar prompts em um **teste A/B**, colocar **guardrails** e manter **logs**. Isso importa porque, sem medir, a opinião sobre um classificador ou um assistente é formada pelos três últimos casos que alguém viu — e um sistema que "parece bom" pode estar errando um em cada cinco documentos.

## Por que medir

Modelos de linguagem são **não determinísticos**: a mesma entrada pode gerar saídas diferentes, e uma mudança pequena no prompt pode melhorar um caso e piorar dez. Testar "na mão" com dois ou três exemplos não detecta isso. A disciplina é a mesma dos testes automatizados de código: um conjunto fixo de casos com resposta conhecida, rodado toda vez que algo muda.

## O conjunto de teste

Um **conjunto de teste** (ou de avaliação) é uma lista de entradas com a resposta correta, definida por uma pessoa. Para o classificador de documentos:

```text
arquivo              | categoria_correta
nf_001.pdf           | nota_fiscal
contrato_acme.pdf    | contrato
extrato_mar.pdf      | extrato_bancario
guia_das_03.pdf      | guia_imposto
recibo_estac.pdf     | outro
...                  | ...
```

Regras para montar um conjunto útil:

- **Tamanho**: comece com 30 a 50 casos; cresça com os erros reais que aparecerem em produção.
- **Cobertura**: todas as categorias, incluindo as raras; casos fáceis e difíceis; documentos ilegíveis e vazios.
- **Rotulagem por humano**, de preferência revisada por uma segunda pessoa nos casos ambíguos.
- **Separado dos exemplos do prompt**: se o caso está no prompt como exemplo, acertá-lo não prova nada.
- **Guardado no repositório**, com data, como qualquer teste.

## Métricas simples

Com o conjunto rotulado, rode o sistema e compare. As três métricas que resolvem a maioria dos casos:

**Acurácia**: acertos ÷ total. Simples e suficiente quando as categorias são equilibradas. Com 50 casos e 43 acertos, acurácia de 86%.

**Precisão** (de uma categoria): entre os que o sistema **disse** que são daquela categoria, quantos são de verdade. Alta precisão em "nota_fiscal" significa que, quando ele diz nota fiscal, você pode confiar.

**Revocação** (de uma categoria): entre os que **são** daquela categoria, quantos o sistema encontrou. Alta revocação significa que poucas notas fiscais escapam.

As duas se tensionam: um sistema que chama tudo de nota fiscal tem revocação perfeita e precisão péssima. Qual importa mais depende do custo do erro: deixar passar uma guia de imposto (baixa revocação) costuma custar mais do que mandar um recibo para revisão por engano (baixa precisão).

Em Python, a partir de duas listas:

```python
def acuracia(esperado, previsto):
    acertos = sum(1 for e, p in zip(esperado, previsto) if e == p)
    return acertos / len(esperado)

def precisao_revocacao(esperado, previsto, categoria):
    vp = sum(1 for e, p in zip(esperado, previsto) if p == categoria and e == categoria)
    fp = sum(1 for e, p in zip(esperado, previsto) if p == categoria and e != categoria)
    fn = sum(1 for e, p in zip(esperado, previsto) if p != categoria and e == categoria)
    precisao = vp / (vp + fp) if vp + fp else 0.0
    revocacao = vp / (vp + fn) if vp + fn else 0.0
    return precisao, revocacao

esperado = ["nf", "nf", "contrato", "extrato", "nf", "outro"]
previsto = ["nf", "contrato", "contrato", "extrato", "nf", "nf"]
print(round(acuracia(esperado, previsto), 2))
# 0.67
print(precisao_revocacao(esperado, previsto, "nf"))
# (0.6666666666666666, 0.6666666666666666)
```

`vp` são os verdadeiros positivos, `fp` os falsos positivos (disse que era e não era) e `fn` os falsos negativos (era e não disse). No exemplo, de três notas fiscais reais o sistema achou duas (revocação 2/3), e das três vezes que disse "nf", acertou duas (precisão 2/3).

## Revisão humana

Nenhuma métrica substitui a pessoa nos casos que importam. O desenho eficiente usa a **confiança** que o modelo informa (ou uma regra equivalente):

- Confiança alta e categoria de baixo risco: automático.
- Confiança baixa, ou categoria de alto risco (guia de imposto, contrato): fila de revisão.
- Toda correção feita pelo revisor vira um **caso novo no conjunto de teste**.

Meça também a revisão: quantos por cento vão para a fila e quantos o revisor corrige. Se o revisor nunca corrige, a fila está larga demais; se corrige metade, o modelo não está pronto para automatizar aquela categoria.

## Teste A/B de prompts

Para decidir entre dois prompts (ou dois modelos), não compare três respostas na tela: rode os dois sobre o **mesmo conjunto de teste** e compare as métricas. Mude **uma coisa por vez** — se você troca o prompt e o modelo juntos, não sabe qual causou a diferença. Registre: data, versão do prompt, modelo, acurácia, precisão e revocação por categoria, custo médio por chamada. Uma planilha simples basta; é o seu histórico de decisões.

## Guardrails

**Guardrails** são verificações **fora do modelo**, no código, que impedem saídas inaceitáveis independentemente do que ele gerou:

- Validação de formato (o JSON da lição anterior).
- Listas permitidas: categoria fora da lista é rejeitada.
- Limites numéricos: valor extraído acima de um teto vai para revisão.
- Bloqueios de ação: o modelo pode sugerir "cancelar fatura", mas o código exige confirmação.
- Filtro de dados sensíveis: CPF ou senha na saída do modelo são mascarados antes de qualquer log.

Guardrail é determinístico: sempre faz a mesma coisa. É a camada que torna confiável um componente que, sozinho, não é.

## Logs

Registre, por chamada: data e hora, versão do prompt, modelo, identificador do documento (não o conteúdo pessoal), resposta validada, confiança, tokens, se foi para revisão e o que o revisor decidiu. Com isso você responde a "por que esse documento foi classificado errado em 12/03?", calcula custo por categoria e reconstrói o conjunto de teste a partir da produção.

## Erros comuns

- Avaliar com os mesmos exemplos que estão no prompt.
- Olhar só a acurácia quando uma categoria rara é a que mais importa.
- Trocar prompt e modelo ao mesmo tempo e tirar conclusões.
- Confiar no campo "confianca" como se fosse probabilidade calibrada: é uma estimativa do modelo, útil para ordenar, não uma garantia.
- Registrar conteúdo pessoal dos documentos nos logs.

## Na prática

O classificador do escritório sai com acurácia de 88% no conjunto de 50 casos, mas revocação de 60% em "guia_imposto" — ele deixa passar guias. Um ajuste no prompt (descrever o que caracteriza uma guia) sobe a revocação para 95% com perda pequena de precisão em "outro". A decisão fica registrada na planilha de experimentos, e guias continuam indo para revisão por mais um mês, até o histórico mostrar que é seguro automatizar.

## Resumo

- Conjunto de teste: casos rotulados por humanos, cobrindo todas as categorias, separados dos exemplos do prompt, versionados.
- Acurácia para visão geral; precisão e revocação por categoria quando o custo do erro é desigual.
- Revisão humana orientada por confiança e risco; cada correção vira caso de teste.
- A/B: mesmo conjunto, uma mudança por vez, métricas e custo registrados.
- Guardrails no código tornam confiável o que o modelo sozinho não garante; logs sem dados pessoais.
