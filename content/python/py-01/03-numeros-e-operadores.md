Nesta lição você vai dominar os operadores matemáticos do Python (`+ - * / // % **`), entender a ordem em que as contas são feitas, arredondar resultados com `round()` e usar as atribuições abreviadas (`+=`, `-=` etc.). Como a maior parte do trabalho contábil é conta, essa lição é das mais úteis do módulo.

## Os sete operadores

| Operador | Nome | Exemplo | Resultado |
|----------|------|---------|-----------|
| `+` | soma | `1200 + 300` | `1500` |
| `-` | subtração | `1200 - 300` | `900` |
| `*` | multiplicação | `12 * 150` | `1800` |
| `/` | divisão | `7 / 2` | `3.5` |
| `//` | divisão inteira | `7 // 2` | `3` |
| `%` | resto da divisão (módulo) | `7 % 2` | `1` |
| `**` | potência | `2 ** 10` | `1024` |

Os quatro primeiros você conhece. Vamos olhar com atenção os três que são novidade.

### Divisão `/` sempre dá `float`

Mesmo quando a conta é exata, o resultado da divisão comum é decimal:

```python
print(10 / 2)
print(9 / 3)
print(type(10 / 2))
```

Saída:

```
5.0
3.0
<class 'float'>
```

Isso é proposital: a divisão "normal" sempre pode gerar decimais, então o Python padroniza o tipo. Se você precisa de um inteiro, use `//`.

### Divisão inteira `//`

Arredonda o resultado **para baixo**, para o inteiro anterior. Com números positivos, isso é o mesmo que descartar a parte decimal; com negativos, o resultado se afasta de zero (veja o terceiro exemplo). Útil para perguntas como "quantas parcelas inteiras cabem?" ou "quantas caixas fechadas?".

```python
print(17 // 5)      # 17 dividido por 5 dá 3, sobra 2
print(1000 // 350)  # quantas parcelas de 350 cabem em 1000?
print(-7 // 2)      # cuidado: arredonda para baixo, não para zero
```

Saída:

```
3
2
-4
```

### Resto `%`

Devolve o que **sobra** da divisão inteira. Parece exótico, mas resolve muitos problemas práticos:

```python
print(17 % 5)        # 17 = 3*5 + 2 -> sobra 2
print(1000 % 350)    # após 2 parcelas de 350, sobram 300
print(2026 % 2)      # 0 -> ano par
print(2025 % 2)      # 1 -> ano ímpar
```

Saída:

```
2
300
0
1
```

O teste `numero % 2 == 0` é a forma clássica de descobrir se um número é par. E `valor % 100` separa os centavos quando você trabalha com valores em centavos inteiros.

### Potência `**`

```python
print(2 ** 3)         # 2 x 2 x 2
print(1.01 ** 12)     # 1% ao mês durante 12 meses
print(10 ** 6)        # um milhão
```

Saída:

```
8
1.1268250301319698
1000000
```

Cálculo de juros compostos é só uma potência: `montante = capital * (1 + taxa) ** meses`.

```python
capital = 10000
taxa = 0.015      # 1,5% ao mês
meses = 24
montante = capital * (1 + taxa) ** meses
print(montante)
```

Saída:

```
14295.028119290218
```

## Prioridade dos operadores

Python segue a mesma ordem da matemática escolar:

1. Parênteses `( )`
2. Potência `**`
3. Multiplicação, divisão, divisão inteira e resto `* / // %` (da esquerda para a direita)
4. Soma e subtração `+ -` (da esquerda para a direita)

Veja o estrago que a prioridade pode causar:

```python
print(100 + 50 * 2)       # multiplica primeiro: 100 + 100
print((100 + 50) * 2)     # parênteses primeiro: 150 * 2
print(1000 - 200 / 4)     # divide primeiro: 1000 - 50
print(2 ** 3 * 2)         # potência primeiro: 8 * 2
```

Saída:

```
200
300
950.0
16
```

> **Dica:** quando houver qualquer dúvida, use parênteses. Eles não custam nada e deixam a intenção explícita. `(bruto - inss) * aliquota` é mais claro para quem lê do que confiar na prioridade.

Um exemplo bem real: calcular a base do IRRF descontando INSS e dependentes.

```python
bruto = 5000.00
inss = 450.00
dependentes = 2
deducao_dependente = 189.59
base_irrf = bruto - inss - dependentes * deducao_dependente
print(base_irrf)
```

Saída:

```
4170.82
```

A multiplicação `dependentes * deducao_dependente` acontece antes das subtrações, exatamente como queríamos.

## Arredondando com `round()`

Como vimos, decimais em binário produzem caudas estranhas. `round(valor, casas)` arredonda para o número de casas pedido:

```python
print(round(1078.8000000000002, 2))
print(round(3.14159, 2))
print(round(2.5))          # sem casas -> inteiro
print(round(1234.5678, -2))  # casas negativas arredondam dezenas/centenas
```

Saída:

```
1078.8
3.14
2
1200.0
```

> **Atenção:** `round(2.5)` dá `2`, e `round(3.5)` dá `4`. O Python usa o "arredondamento do banqueiro": empates vão para o par mais próximo. Isso reduz viés em somas grandes, mas difere da regra escolar. Para valores monetários com regras fiscais rígidas, a biblioteca padrão tem o módulo `decimal`, que permite escolher a regra de arredondamento (consulte a documentação quando precisar). Neste curso, `round(x, 2)` resolve o dia a dia.

Um cálculo de ISS com arredondamento:

```python
valor_servico = 2387.33
aliquota_iss = 0.05
iss = round(valor_servico * aliquota_iss, 2)
print(iss)
```

Saída:

```
119.37
```

## Outras funções numéricas úteis

```python
print(abs(-250.75))      # valor absoluto (remove o sinal)
print(max(1200, 850, 2300))
print(min(1200, 850, 2300))
print(int(9.99))         # trunca (corta) a parte decimal, não arredonda
print(float(8))          # converte inteiro em decimal
```

Saída:

```
250.75
2300
850
9
8.0
```

Note a diferença: `int(9.99)` dá `9` (corta), enquanto `round(9.99)` dá `10` (arredonda).

## Atribuição abreviada

É muito comum atualizar uma variável com base no próprio valor: `total = total + nota`. Python tem um atalho para isso:

| Longo | Abreviado |
|-------|-----------|
| `x = x + 5` | `x += 5` |
| `x = x - 5` | `x -= 5` |
| `x = x * 2` | `x *= 2` |
| `x = x / 2` | `x /= 2` |
| `x = x // 2` | `x //= 2` |
| `x = x % 2` | `x %= 2` |
| `x = x ** 2` | `x **= 2` |

Um acumulador de notas fiscais:

```python
total = 0
total += 1500.00   # primeira nota
total += 320.50    # segunda nota
total += 89.90     # terceira nota
print(round(total, 2))

estoque = 100
estoque -= 15      # saída de 15 unidades
print(estoque)
```

Saída:

```
1910.4
85
```

Esse padrão — começar em zero e ir somando — é a espinha dorsal de quase todo relatório. Você o usará constantemente quando aprender repetição no próximo módulo.

## Trabalhando com percentuais

Percentual é só um decimal: 8% é `0.08`, 27,5% é `0.275`. Três operações aparecem o tempo todo:

```python
valor = 4000

# quanto é 8% de 4000?
print(valor * 0.08)

# acrescentar 10%
print(valor * 1.10)

# descontar 15%
print(valor * (1 - 0.15))
```

Saída:

```
320.0
4400.0
3400.0
```

Para calcular um percentual a partir de dois valores (que fração a despesa representa da receita):

```python
receita = 45000
despesa = 31200
percentual = despesa / receita * 100
print(round(percentual, 1))
```

Saída:

```
69.3
```

## Na prática

Quase toda conta do escritório cabe nestes operadores: ISS é `valor * aliquota`, multa de boleto atrasado é `valor * 0.02`, juros de mora de 1% ao mês, pro rata, são `valor * 0.01 / 30 * dias`, e a margem de um cliente é `lucro / receita * 100`. O hábito que diferencia um cálculo confiável é arredondar **uma vez, no final**: acumule os valores com toda a precisão e aplique `round(total, 2)` só na hora de exibir ou gravar.

## Erros comuns

- **Esperar `int` de uma divisão**: `10 / 2` é `5.0`, não `5`. Use `//` se quiser inteiro.
- **Usar `^` para potência**: em Python `^` é outra coisa (ou-exclusivo bit a bit). Potência é `**`.
- **Esquecer a prioridade**: `bruto - inss * 0.275` multiplica antes de subtrair. Coloque parênteses: `(bruto - inss) * 0.275`.
- **Dividir por zero**: `100 / 0` gera `ZeroDivisionError`. Verifique divisores antes.
- **Achar que `round(x, 2)` altera `x`**: `round()` devolve um valor novo; a variável só muda se você guardar o resultado (`x = round(x, 2)`). E arredonde ao final da conta, não no meio, para os centavos não se acumularem.
- **Escrever `x =+ 5`**: isso é `x = +5` (atribui 5). O correto é `x += 5`.

## Resumo

- Operadores: `+ - * /` são os de sempre; `//` divide descartando decimais; `%` dá o resto; `**` eleva à potência.
- `/` sempre devolve `float`, mesmo em divisões exatas.
- Prioridade: parênteses, depois `**`, depois `* / // %`, depois `+ -`. Na dúvida, use parênteses.
- `round(valor, 2)` arredonda para duas casas; cuidado com o arredondamento de empates para o par.
- `+=`, `-=`, `*=` etc. atualizam a variável com base no valor atual, padrão essencial para acumular totais.
