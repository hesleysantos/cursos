Nesta lição você vai aprender a transformar "essa tarefa toma muito tempo" em números: horas por mês, custo da hora, erros e retrabalho. Com esses números você vai montar uma matriz de esforço × impacto, calcular um retorno sobre investimento (ROI) simples e descobrir em quantos meses uma automação se paga. Ao final, vai escrever um pequeno programa em Python que faz essa conta. Isso importa porque, sem medir, você automatiza o que incomoda, não o que custa.

## O que medir

Para cada processo candidato, colete quatro números. Não precisa ser exato; uma estimativa honesta serve.

| Medida | Como obter | Exemplo: envio de guias |
|---|---|---|
| **Tempo por execução** | Cronometre três vezes e tire a média | 4 minutos por cliente |
| **Frequência** | Quantas vezes por mês acontece | 60 clientes × 1 vez = 60 execuções |
| **Custo da hora** | Salário mais encargos dividido pelas horas trabalhadas | R$ 35 por hora |
| **Erros** | Quantas vezes por mês dá problema e quanto tempo o conserto leva | 2 erros por mês, 30 minutos cada |

Com isso, o custo mensal do processo é:

- Tempo de execução: 60 × 4 min = 240 min = 4 horas.
- Retrabalho: 2 × 30 min = 1 hora.
- Total: 5 horas × R$ 35 = **R$ 175 por mês**, ou R$ 2.100 por ano.

Parece pouco? Agora multiplique por vinte processos parecidos no escritório. É aí que a conta fica interessante.

> **Dica:** o custo da hora não é só o salário. Inclua encargos, décimo terceiro, férias e benefícios. Uma regra prática usada em muitos escritórios é multiplicar o salário-hora por 1,6 a 1,8 para chegar ao custo real.

## Custos escondidos

Além das horas, considere:

- **Atraso.** Guia enviada no dia 20 em vez do dia 15 gera reclamação, multa para o cliente e, às vezes, perda do cliente.
- **Interrupção.** Tarefas pequenas e frequentes quebram a concentração em trabalhos de análise, que valem mais.
- **Dependência de pessoa.** Se só a Ana sabe fazer, as férias da Ana viram um problema.

Esses custos são difíceis de colocar em reais, mas vale anotar ao lado dos números como "fator de urgência".

## Matriz esforço × impacto

Depois de medir, você precisa escolher por onde começar. A **matriz esforço × impacto** é um quadrado dividido em quatro:

| | **Baixo esforço** | **Alto esforço** |
|---|---|---|
| **Alto impacto** | Faça primeiro (vitórias rápidas) | Planeje (projetos) |
| **Baixo impacto** | Faça se sobrar tempo | Não faça |

**Impacto** é o quanto você economiza (horas × custo da hora + erros evitados). **Esforço** é o que custa montar: horas de quem vai construir, ferramenta, treinamento, e a dificuldade técnica (a fonte tem API? o processo tem muitas exceções?).

Exemplos típicos num escritório:

- Enviar guias por e-mail: impacto alto, esforço baixo. **Vitória rápida.**
- Conciliação bancária inteligente: impacto alto, esforço alto. **Projeto para depois.**
- Renomear arquivos de uma pasta: impacto baixo, esforço baixo. **Se sobrar tempo.**
- Robô que lê o site de uma prefeitura que muda a cada mês: impacto baixo, esforço alto. **Não faça.**

## ROI simples e payback

**ROI** (*return on investment*, retorno sobre o investimento) responde "quanto ganho para cada real gasto". **Payback** responde "em quantos meses recupero o que investi". As duas contas são simples:

```
economia_mensal = horas_economizadas_por_mes × custo_da_hora
payback_em_meses = investimento_inicial ÷ (economia_mensal − custo_mensal_da_ferramenta)
ROI_no_primeiro_ano = (economia_anual − custo_total_no_ano) ÷ custo_total_no_ano
```

Voltando ao envio de guias: a automação economiza 5 horas por mês (R$ 175). Montar levou 10 horas de alguém a R$ 50 por hora (R$ 500) e a ferramenta custa R$ 60 por mês.

- Economia líquida mensal: 175 − 60 = R$ 115.
- Payback: 500 ÷ 115 ≈ 4,3 meses.
- No primeiro ano: economia de R$ 2.100; custo de 500 + 12 × 60 = R$ 1.220; ROI = (2.100 − 1.220) ÷ 1.220 ≈ 0,72, ou seja, 72%.

Se o payback fica acima de 12 meses, pense duas vezes; ferramentas e processos mudam, e a automação pode precisar de manutenção antes de se pagar.

## A conta em Python

Como você pode estar fazendo o curso de Python em paralelo, veja a mesma conta em código. Mesmo quem não programa consegue ler:

```python
def horas_economizadas(execucoes_por_mes, minutos_por_execucao, minutos_retrabalho=0):
    """Horas por mês que a automação libera."""
    total_minutos = execucoes_por_mes * minutos_por_execucao + minutos_retrabalho
    return total_minutos / 60

def payback_meses(investimento, economia_mensal, custo_mensal_ferramenta=0):
    """Meses até recuperar o investimento. Devolve None se nunca se paga."""
    liquido = economia_mensal - custo_mensal_ferramenta
    if liquido <= 0:
        return None
    return investimento / liquido

horas = horas_economizadas(60, 4, 60)          # 5.0
economia = horas * 35                           # 175.0
print(f"Horas economizadas: {horas:.1f} h/mês")
print(f"Economia: R$ {economia:.2f}/mês")
print(f"Payback: {payback_meses(500, economia, 60):.1f} meses")
```

Saída:

```
Horas economizadas: 5.0 h/mês
Economia: R$ 175.00/mês
Payback: 4.3 meses
```

Repare na proteção `if liquido <= 0: return None`: se a ferramenta custa mais do que economiza, não existe payback, e o programa diz isso em vez de dividir por zero ou devolver um número negativo sem sentido.

## Erros comuns

- **Medir só o tempo "feliz".** Cronometrar o envio de uma guia que deu certo e esquecer os 30 minutos procurando o e-mail certo do cliente que trocou de contato.
- **Esquecer o custo de manutenção.** Toda automação precisa de ajustes. Reserve de 10% a 20% do esforço inicial por ano.
- **Comparar impacto em horas com esforço em reais.** Converta tudo para a mesma unidade (reais) antes de comparar.
- **Priorizar pelo barulho.** O processo de que todo mundo reclama nem sempre é o mais caro. Os números decidem.

## Na prática

Monte uma planilha com uma linha por processo e as colunas: tempo por execução, execuções por mês, custo da hora, minutos de retrabalho, custo mensal, esforço estimado (horas) e payback. Ordene por payback. Os três primeiros são o seu plano para o trimestre. Essa planilha é exatamente o que você vai entregar no projeto final deste módulo.

## Resumo

- Meça quatro coisas: tempo por execução, frequência, custo da hora e erros.
- Custo mensal = (tempo total + retrabalho) × custo da hora. Inclua encargos no custo da hora.
- Matriz esforço × impacto: comece pelas vitórias rápidas (alto impacto, baixo esforço).
- Payback = investimento ÷ economia líquida mensal. Acima de 12 meses, repense.
- Uma função em Python com proteção contra economia zero faz a conta em segundos.
