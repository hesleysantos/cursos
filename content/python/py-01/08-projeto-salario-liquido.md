Nesta lição você vai juntar tudo o que aprendeu no módulo para construir, passo a passo, uma **calculadora de salário líquido**: a partir do salário bruto e do número de dependentes, o programa calcula o INSS por faixas progressivas, a base de cálculo do IRRF, o IRRF pela tabela com dedução, e exibe um holerite simplificado bem formatado. Você vai usar variáveis, operadores, `if/elif/else`, `round()`, f-strings e funções.

> **Atenção:** as faixas e alíquotas abaixo são **ilustrativas** e seguem a estrutura das tabelas vigentes nos últimos anos. Elas mudam todo ano (e a legislação do IRRF em especial passou por alterações recentes). O objetivo aqui é aprender a **programar a lógica**; para uso real, atualize os números com a tabela oficial do período.

## Passo 1: entender o cálculo

O salário líquido é:

```
líquido = bruto - INSS - IRRF
```

**INSS** é progressivo por faixas: cada pedaço do salário é tributado pela alíquota da sua faixa, e há um teto (acima dele, o desconto não cresce).

| Faixa de salário (R$) | Alíquota |
|-----------------------|----------|
| até 1.518,00 | 7,5% |
| de 1.518,01 até 2.793,88 | 9% |
| de 2.793,89 até 4.190,83 | 12% |
| de 4.190,84 até 8.157,41 (teto) | 14% |

**IRRF** incide sobre a base = bruto − INSS − (dependentes × 189,59), e usa uma tabela com alíquota e **parcela a deduzir**, o que simplifica a conta progressiva para uma só multiplicação:

| Base de cálculo (R$) | Alíquota | Dedução (R$) |
|----------------------|----------|--------------|
| até 2.259,20 | isento | 0,00 |
| de 2.259,21 até 2.826,65 | 7,5% | 169,44 |
| de 2.826,66 até 3.751,05 | 15% | 381,44 |
| de 3.751,06 até 4.664,68 | 22,5% | 662,77 |
| acima de 4.664,68 | 27,5% | 896,00 |

## Passo 2: constantes no topo

Valores que não mudam durante o programa ficam em MAIÚSCULAS, no início do arquivo. Quando a tabela mudar, você altera só aqui.

```python
TETO_INSS = 8157.41
DEDUCAO_DEPENDENTE = 189.59
```

## Passo 3: a função do INSS

Por que uma função? Porque vamos chamar o cálculo várias vezes (um funcionário, depois outro) e porque assim os exercícios conseguem testar. A estrutura é um `if/elif/else` ordenado da menor faixa para a maior. Em cada faixa, somamos as faixas anteriores **inteiras** mais o pedaço que cai na faixa atual.

```python
def calcular_inss(bruto):
    if bruto > TETO_INSS:
        bruto = TETO_INSS          # acima do teto, calcula como se fosse o teto

    if bruto <= 1518.00:
        inss = bruto * 0.075
    elif bruto <= 2793.88:
        inss = 1518.00 * 0.075 + (bruto - 1518.00) * 0.09
    elif bruto <= 4190.83:
        inss = (1518.00 * 0.075
                + (2793.88 - 1518.00) * 0.09
                + (bruto - 2793.88) * 0.12)
    else:
        inss = (1518.00 * 0.075
                + (2793.88 - 1518.00) * 0.09
                + (4190.83 - 2793.88) * 0.12
                + (bruto - 4190.83) * 0.14)

    return round(inss, 2)
```

Dois detalhes:

- A expressão longa está entre parênteses e quebrada em várias linhas. Dentro de parênteses o Python permite quebrar linhas livremente — isso é só para legibilidade.
- O primeiro `if` "achata" o salário no teto **antes** da cadeia de faixas. Assim quem ganha 12.000 cai no `else` com `bruto = 8157.41`.

Testando no modo interativo (as linhas com `>>>` são o que você digita, depois de colar a função; não copie os `>>>` para um arquivo):

```python
>>> calcular_inss(1518)
113.85
>>> calcular_inss(3000)
253.41
>>> calcular_inss(12000)
951.63
```

Conferindo o primeiro à mão: 1518 × 0,075 = 113,85. O terceiro é o teto: 113,85 + 114,83 + 167,63 + 555,32 = 951,63. Bateu.

## Passo 4: a função do IRRF

Aqui a tabela usa alíquota e dedução. Vamos guardar as duas em variáveis dentro de cada ramo e fazer a conta ao final, uma única vez.

```python
def calcular_irrf(base):
    if base <= 2259.20:
        aliquota, deducao = 0.0, 0.0
    elif base <= 2826.65:
        aliquota, deducao = 0.075, 169.44
    elif base <= 3751.05:
        aliquota, deducao = 0.15, 381.44
    elif base <= 4664.68:
        aliquota, deducao = 0.225, 662.77
    else:
        aliquota, deducao = 0.275, 896.00

    irrf = base * aliquota - deducao
    if irrf < 0:
        irrf = 0.0
    return round(irrf, 2)
```

A linha `aliquota, deducao = 0.075, 169.44` atribui dois valores de uma vez, como vimos na lição de variáveis. A verificação `if irrf < 0` é uma proteção. Com esta tabela a conta nunca fica negativa (a parcela a deduzir de cada faixa é calculada para que o imposto continue exatamente de onde a faixa anterior parou; na primeira faixa tributada, 2.259,21 × 7,5% ≈ 169,44, ou seja, o imposto começa em zero), mas, se alguém atualizar os números e a dedução ficar maior que base × alíquota, o programa devolveria um imposto negativo em silêncio — e imposto negativo não existe.

```python
>>> calcular_irrf(2000)
0.0
>>> calcular_irrf(2746.59)
36.55
>>> calcular_irrf(5000)
479.0
```

Conferindo: 5000 × 0,275 = 1375,00; menos 896,00 = 479,00.

## Passo 5: juntando tudo em `calcular_liquido`

```python
def calcular_liquido(bruto, dependentes):
    inss = calcular_inss(bruto)
    base_irrf = bruto - inss - dependentes * DEDUCAO_DEPENDENTE
    irrf = calcular_irrf(base_irrf)
    liquido = bruto - inss - irrf
    return round(liquido, 2)
```

Uma função chamando outras duas. Cada uma faz uma coisa só, e o nome diz o que faz. Esse é o jeito certo de crescer um programa: peças pequenas, testáveis, combinadas.

```python
>>> calcular_liquido(3000, 0)
2710.04
>>> calcular_liquido(3000, 2)
2738.47
>>> calcular_liquido(10000, 1)
7508.21
```

Note que com 2 dependentes o líquido **sobe**, porque a base do IRRF diminui. Faz sentido.

## Passo 6: o holerite formatado

Agora a parte de exibição. Vamos usar f-strings com alinhamento para montar colunas. Separar o cálculo (funções acima) da exibição (função abaixo) é uma boa prática: se amanhã você quiser gravar o resultado numa planilha em vez de imprimir, só esta parte muda.

```python
def mostrar_holerite(nome, bruto, dependentes):
    inss = calcular_inss(bruto)
    base_irrf = bruto - inss - dependentes * DEDUCAO_DEPENDENTE
    irrf = calcular_irrf(base_irrf)
    liquido = bruto - inss - irrf

    print("=" * 40)
    print(f"{'HOLERITE SIMPLIFICADO':^40}")
    print("=" * 40)
    print(f"Funcionário: {nome}")
    print(f"Dependentes: {dependentes}")
    print("-" * 40)
    print(f"{'Salário bruto':<25}{bruto:>15,.2f}")
    print(f"{'(-) INSS':<25}{inss:>15,.2f}")
    print(f"{'(-) IRRF':<25}{irrf:>15,.2f}")
    print("-" * 40)
    print(f"{'Salário líquido':<25}{liquido:>15,.2f}")
    print("=" * 40)
```

`{'HOLERITE SIMPLIFICADO':^40}` centraliza o título em 40 caracteres; `{bruto:>15,.2f}` alinha à direita em 15 posições, com separador de milhar e duas casas.

## Passo 7: o programa principal

```python
mostrar_holerite("Maria da Silva", 3000.00, 2)
mostrar_holerite("João Souza", 10000.00, 1)
```

Saída:

```
========================================
         HOLERITE SIMPLIFICADO          
========================================
Funcionário: Maria da Silva
Dependentes: 2
----------------------------------------
Salário bruto                   3,000.00
(-) INSS                          253.41
(-) IRRF                            8.12
----------------------------------------
Salário líquido                 2,738.47
========================================
========================================
         HOLERITE SIMPLIFICADO          
========================================
Funcionário: João Souza
Dependentes: 1
----------------------------------------
Salário bruto                  10,000.00
(-) INSS                          951.63
(-) IRRF                        1,540.16
----------------------------------------
Salário líquido                 7,508.21
========================================
```

Se você quiser rodar no terminal com dados digitados, troque as duas chamadas finais por:

```python
nome = input("Nome: ")
bruto = float(input("Salário bruto: "))
dependentes = int(input("Dependentes: "))
mostrar_holerite(nome, bruto, dependentes)
```

As funções de cálculo não mudam em nada — essa é a vantagem de separar as responsabilidades.

## Código completo

```python
# salario_liquido.py — calculadora de salário líquido (tabelas ilustrativas)

TETO_INSS = 8157.41
DEDUCAO_DEPENDENTE = 189.59


def calcular_inss(bruto):
    if bruto > TETO_INSS:
        bruto = TETO_INSS
    if bruto <= 1518.00:
        inss = bruto * 0.075
    elif bruto <= 2793.88:
        inss = 1518.00 * 0.075 + (bruto - 1518.00) * 0.09
    elif bruto <= 4190.83:
        inss = (1518.00 * 0.075
                + (2793.88 - 1518.00) * 0.09
                + (bruto - 2793.88) * 0.12)
    else:
        inss = (1518.00 * 0.075
                + (2793.88 - 1518.00) * 0.09
                + (4190.83 - 2793.88) * 0.12
                + (bruto - 4190.83) * 0.14)
    return round(inss, 2)


def calcular_irrf(base):
    if base <= 2259.20:
        aliquota, deducao = 0.0, 0.0
    elif base <= 2826.65:
        aliquota, deducao = 0.075, 169.44
    elif base <= 3751.05:
        aliquota, deducao = 0.15, 381.44
    elif base <= 4664.68:
        aliquota, deducao = 0.225, 662.77
    else:
        aliquota, deducao = 0.275, 896.00
    irrf = base * aliquota - deducao
    if irrf < 0:
        irrf = 0.0
    return round(irrf, 2)


def calcular_liquido(bruto, dependentes):
    inss = calcular_inss(bruto)
    base_irrf = bruto - inss - dependentes * DEDUCAO_DEPENDENTE
    irrf = calcular_irrf(base_irrf)
    return round(bruto - inss - irrf, 2)


def mostrar_holerite(nome, bruto, dependentes):
    inss = calcular_inss(bruto)
    base_irrf = bruto - inss - dependentes * DEDUCAO_DEPENDENTE
    irrf = calcular_irrf(base_irrf)
    liquido = bruto - inss - irrf
    print("=" * 40)
    print(f"{'HOLERITE SIMPLIFICADO':^40}")
    print("=" * 40)
    print(f"Funcionário: {nome}")
    print(f"Dependentes: {dependentes}")
    print("-" * 40)
    print(f"{'Salário bruto':<25}{bruto:>15,.2f}")
    print(f"{'(-) INSS':<25}{inss:>15,.2f}")
    print(f"{'(-) IRRF':<25}{irrf:>15,.2f}")
    print("-" * 40)
    print(f"{'Salário líquido':<25}{liquido:>15,.2f}")
    print("=" * 40)


mostrar_holerite("Maria da Silva", 3000.00, 2)
mostrar_holerite("João Souza", 10000.00, 1)
```

## Ideias para continuar

- Adicionar um desconto fixo de vale-transporte (6% do bruto, limitado ao valor real do transporte).
- Calcular o FGTS (8% sobre o bruto, que é custo da empresa e não desconto do funcionário) e mostrar numa linha separada.
- Aceitar pensão alimentícia como dedução adicional da base do IRRF.
- No próximo módulo, com listas e laços, você vai processar **vários funcionários de uma vez** e somar a folha inteira.

## Na prática

Um programa assim serve para **conferir** o que o sistema de folha calculou: pegue três holerites reais, rode `calcular_liquido` com o bruto e os dependentes de cada um e compare. Se bater, você tem uma segunda opinião automática para a folha inteira; se não bater, ou a tabela do programa está desatualizada, ou há um desconto que o sistema aplica e você ainda não modelou. Nos dois casos, as constantes no topo são o primeiro lugar a olhar.

## Erros comuns neste projeto

- **Esquecer de "achatar" no teto do INSS**: quem ganha 20.000 pagaria INSS sobre 20.000, o que está errado.
- **Faixas fora de ordem** no `elif`: a cadeia só funciona da menor para a maior.
- **Usar a alíquota da faixa sobre o salário inteiro** no INSS: a tabela é progressiva, cada pedaço tem sua alíquota.
- **Esquecer a dedução de dependentes** na base do IRRF, ou aplicá-la no INSS (não se aplica).
- **Arredondar no meio da conta**: arredonde só no `return`, senão os centavos se acumulam.
- **Imposto negativo**: sempre proteja com `if irrf < 0`.

## Resumo

- O programa separa **cálculo** (funções `calcular_inss`, `calcular_irrf`, `calcular_liquido`) de **exibição** (`mostrar_holerite`), o que facilita testar e reaproveitar.
- INSS progressivo: `if/elif` ordenado por faixa, somando as faixas anteriores inteiras mais o pedaço da faixa atual, com o teto aplicado antes.
- IRRF: base = bruto − INSS − dependentes × dedução; alíquota e parcela a deduzir escolhidas com `if/elif`; proteger contra valor negativo.
- Constantes em MAIÚSCULAS no topo deixam a atualização anual em um só lugar.
- f-strings com `:<25` e `:>15,.2f` montam um holerite alinhado e legível.
