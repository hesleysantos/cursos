# Medir resultados e vender automação

Nesta lição você vai aprender a provar, com números, que uma automação valeu a pena, e a transformar isso em negócio: horas economizadas, erros evitados, prazo e satisfação; **ROI**; propostas com três modelos de preço (projeto, mensalidade, por processo); **SLA** e contrato; e automação como serviço para os clientes do escritório. Ao final, você saberá apresentar um caso com números que um sócio ou um cliente entende em dois minutos.

## Medir antes de automatizar

O erro mais comum é automatizar e, meses depois, não conseguir dizer o que mudou. A medição começa **antes**: por duas semanas, registre o processo manual (quantos extratos, tempo de cada um, erros encontrados depois, prazos estourados). Esse é o **baseline**; sem ele, qualquer número depois é chute.

| Medida | Como obter | Exemplo (conciliação, 40 clientes) |
|---|---|---|
| **Horas economizadas** | Tempo manual × volume, menos tempo de revisão | 40 × 1,5 h = 60 h/mês; revisão 10 h → 50 h |
| **Erros evitados** | Erros por mês antes × custo médio de um erro (multa, retrabalho) | 3 × R$ 400 = R$ 1.200/mês |
| **Prazo** | Dias entre o fim da competência e a entrega | De 12 para 6 dias |
| **Satisfação** | Nota de 1 a 5 de clientes e equipe, ou reclamações por mês | De 8 para 2 reclamações |

Converta horas em dinheiro com o **custo-hora carregado** (salário mais encargos e benefícios, dividido pelas horas produtivas; uma aproximação comum para CLT é salário × 1,7 a 2,0 ÷ 160 horas). Hora economizada só vale dinheiro se for realocada: para outros clientes, para consultoria ou para reduzir hora extra.

## ROI com números

```python
def roi_automacao(horas_mes, custo_hora, erros_evitados_mes, custo_erro,
                  custo_projeto, custo_mensal, meses=12):
    ganho_mes = horas_mes * custo_hora + erros_evitados_mes * custo_erro
    ganho_liquido_mes = ganho_mes - custo_mensal
    ganho_periodo = ganho_liquido_mes * meses
    roi = (ganho_periodo - custo_projeto) / custo_projeto
    payback = custo_projeto / ganho_liquido_mes if ganho_liquido_mes > 0 else None
    return {"ganho_mes": round(ganho_mes, 2), "roi_12m": round(roi, 2),
            "payback_meses": round(payback, 1) if payback else None}

print(roi_automacao(horas_mes=50, custo_hora=45.0, erros_evitados_mes=3, custo_erro=400.0,
                    custo_projeto=18000.0, custo_mensal=600.0))
# {'ganho_mes': 3450.0, 'roi_12m': 0.9, 'payback_meses': 6.3}
```

Leitura: a conciliação automatizada gera R$ 3.450 por mês; descontados R$ 600 mensais (APIs, servidor, manutenção), o projeto de R$ 18.000 se paga em pouco mais de seis meses e rende 90% no primeiro ano. Inclua sempre no **custo mensal** a manutenção (lição 1: robôs quebram) e os tokens de IA (lição 5: meça). Projetos com payback acima de 18 meses em escritórios pequenos raramente sobrevivem à primeira mudança de sistema.

Apresente o ROI em três linhas: situação atual (custo anual do processo manual), proposta (projeto + custo anual da automação + revisão) e diferença. Quem decide quer ver antes e depois, não a fórmula.

## Propostas e precificação

Uma proposta tem: **problema** (com o baseline), **solução** (o que será automatizado, o que fica manual, onde há revisão humana), **entregas** (fluxos, documentação, runbook, treinamento), **prazo** em sprints, **preço e modelo**, **premissas e exclusões** (acessos, licenças, captcha e certificado conforme a lição 1), **SLA** e **condições**. Três modelos de preço:

- **Projeto fechado**: um valor pela implantação, quando o escopo é claro. Horas estimadas × taxa × margem para imprevistos (30% é prudente em RPA), com escopo por escrito.
- **Mensalidade**: valor recorrente que inclui operação, manutenção, ferramentas e um volume de melhorias. É o que paga as 2 a 4 horas mensais de manutenção e cria relação de longo prazo; combine com implantação menor.
- **Por processo ou documento**: o cliente paga por nota processada, conciliação feita, guia emitida. Alinha preço a valor; exige medição confiável (o banco de execuções da lição 4) e um mínimo mensal.

O mais comum para escritórios é implantação + mensalidade, com reajuste quando o volume cresce.

## SLA e contrato

**SLA** (acordo de nível de serviço) é o compromisso medível: disponibilidade em dias úteis (99% no horário comercial), prazo máximo por documento (24 horas úteis), resposta a incidentes (4 horas úteis para começar, 2 dias para resolver) e janela de manutenção. Prometa o que a lição 5 permite medir; SLA sem métrica é promessa vazia.

Cláusulas que evitam problemas:

- **Escopo e exclusões** explícitos; mudanças por aditivo.
- **Responsabilidades do cliente**: acessos, credenciais próprias, procurações, licenças, validação nas primeiras semanas.
- **Dados e LGPD**: papéis, fornecedores de IA usados, retenção, incidentes (lição 6).
- **Propriedade**: de quem são código e fluxos ao fim do contrato; o que acontece na rescisão (exportações, prazo de transição).
- **Limitação de responsabilidade**: a automação prepara; o cliente (ou o contador responsável) revisa e aprova o que a lei exige; teto de indenização.
- **Manutenção**: o que está incluído (correções) e o que não está (mudanças de sistemas do governo, novos layouts), e como se cobra o excedente.

## Automação como serviço para os clientes

O escritório que automatizou o próprio fechamento tem um produto nas mãos: os clientes também sofrem com processos manuais, e o contador já conhece os dados deles. Ofertas naturais:

- **Conciliação e fluxo de caixa** automatizados, com painel para o dono da empresa.
- **Emissão e cobrança**: boletos e Pix com conciliação automática (lição 3).
- **Caixa de entrada de documentos**: o cliente manda tudo por WhatsApp e a esteira organiza e devolve pendências.
- **Relatórios gerenciais** mensais com IA explicando variações; **assistente de atendimento** como diferencial.

Comece com um ou dois clientes piloto, meça, monte o caso com números e só então precifique para a carteira. Venda o resultado ("seu fechamento sai no dia 5", "você vê o caixa todo dia"), não a tecnologia.

## Armadilhas

- **Sem baseline**: impossível provar ganho.
- **Contar hora economizada que não foi realocada**.
- **Esquecer manutenção e tokens no custo mensal**: o ROI mente.
- **Projeto fechado com escopo aberto**: prejuízo garantido.
- **SLA sem métrica** ou métrica que ninguém coleta.
- **Vender "automatizar tudo"**: a proposta diz o que fica manual e por quê.

## Na prática

Um escritório mediu por duas semanas a conciliação de 40 clientes: 60 horas por mês, três erros mensais, prazo médio de 12 dias. Automatizou com OFX, classificação por IA e revisão humana e, no terceiro mês, apresentou aos sócios: 50 horas economizadas (realocadas para dois clientes novos), zero erros, prazo de 6 dias, custo mensal de R$ 600; o projeto de R$ 18.000 se pagou em sete meses. Com esse caso, ofereceu "conciliação e caixa diário" para a carteira: 12 clientes aderiram a uma mensalidade.

## Resumo

- Meça antes (baseline de duas semanas): horas, erros, prazo, satisfação; converta horas com custo-hora carregado e conte só o que foi realocado.
- ROI: ganho mensal menos custo mensal (com manutenção e tokens), comparado ao custo do projeto; payback abaixo de 18 meses.
- Proposta: problema medido, solução com o que fica manual, entregas, sprints, preço (projeto, mensalidade, por processo), premissas, SLA.
- Contrato: escopo, responsabilidades do cliente, LGPD, propriedade, limitação de responsabilidade, manutenção; SLA só com métrica coletada.
- Automação como serviço: piloto, números, oferta de resultado para a carteira.
