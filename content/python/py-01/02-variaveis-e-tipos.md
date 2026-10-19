Nesta lição você vai aprender o que são variáveis, como guardar valores nelas, quais são os tipos básicos do Python (`int`, `float`, `str`, `bool`, `None`), como descobrir o tipo de um valor com `type()` e quais nomes são válidos e recomendados. Variáveis são a base de qualquer programa: sem elas, você não consegue guardar um salário para calcular o INSS depois.

## O que é uma variável?

Uma variável é um **nome que aponta para um valor**. Pense numa célula do Excel com um rótulo: a célula `B2` guarda `3500` e você escreve "Salário bruto" ao lado. Em Python, você dá o nome diretamente:

```python
salario_bruto = 3500
```

O sinal `=` aqui **não** significa "é igual a" como na matemática. Significa **"receba"**: a variável `salario_bruto` recebe o valor `3500`. Lemos da direita para a esquerda: calcula-se o que está à direita e guarda-se no nome à esquerda.

Depois de criada, a variável pode ser usada em qualquer lugar:

```python
salario_bruto = 3500
desconto = 280
print(salario_bruto - desconto)
```

Saída:

```
3220
```

E pode receber um novo valor a qualquer momento. O valor antigo é descartado:

```python
saldo = 1000
print(saldo)
saldo = saldo + 500   # calcula 1000 + 500 e guarda de volta em saldo
print(saldo)
```

Saída:

```
1000
1500
```

A linha `saldo = saldo + 500` parece errada para quem vem da matemática, mas faz todo sentido lendo como "saldo recebe saldo mais 500".

> **Dica:** o texto depois de `#` é um **comentário**. O Python ignora; serve para você (ou um colega) entender o código depois. Use sem medo.

## Por que tipos importam

Todo valor em Python tem um **tipo**, que define o que se pode fazer com ele. Somar dois números faz sentido; somar um número a um texto, não. O Python é rigoroso com isso justamente para evitar erros silenciosos, como um CPF virar número e perder o zero à esquerda.

Os cinco tipos que você precisa conhecer agora:

| Tipo | Nome | Exemplos | Para quê |
|------|------|----------|----------|
| `int` | inteiro | `12`, `-3`, `2024`, `0` | contagens, anos, quantidades |
| `float` | decimal | `3.5`, `0.08`, `1250.90` | valores monetários, percentuais |
| `str` | texto (string) | `"Maria"`, `'12.345.678/0001-90'` | nomes, códigos, CNPJ, CPF |
| `bool` | lógico | `True`, `False` | sim/não, pago/não pago |
| `NoneType` | ausência | `None` | "ainda não tem valor" |

### `int` e `float`

A diferença é o ponto decimal. `10` é `int`; `10.0` é `float`. Em Python o separador decimal é o **ponto**, não a vírgula: `1250.90`, nunca `1250,90`. A vírgula tem outro significado (separar itens) e vai dar confusão.

```python
quantidade = 12          # int
preco_unitario = 89.90   # float
print(quantidade * preco_unitario)
```

Saída:

```
1078.8000000000002
```

Esse `...0002` esquisito acontece porque computadores guardam decimais em binário e nem todo decimal tem representação exata. É normal e você vai aprender a arredondar na próxima lição. Para contabilidade que exige centavos exatos, a biblioteca padrão tem o módulo `decimal`; neste curso, `round()` resolve.

### `str`

Qualquer coisa entre aspas é `str`, mesmo que pareça número:

```python
cnpj = "12.345.678/0001-90"
cep = "49000-000"
codigo = "007"
print(codigo)
```

Saída:

```
007
```

Se `codigo` fosse o número `007`, o Python mostraria `7` e o zero à esquerda sumiria. Por isso **códigos, CPF, CNPJ, CEP e telefone são sempre texto**, mesmo sendo compostos de dígitos — você nunca vai somar dois CPFs.

### `bool`

Só tem dois valores: `True` e `False`, com inicial maiúscula. Representa perguntas de sim ou não:

```python
nota_paga = True
cliente_ativo = False
print(nota_paga)
```

Saída:

```
True
```

Comparações também produzem `bool`, o que será o coração das decisões no programa:

```python
print(3500 > 2000)
print(10 == 20)
```

Saída:

```
True
False
```

Note: `==` (dois iguais) **compara**; `=` (um igual) **atribui**. Essa é uma das confusões mais comuns de quem começa.

### `None`

`None` significa "nada", "vazio", "ainda não definido". É diferente de zero e de texto vazio. Um campo "data de pagamento" de uma nota ainda não paga é um bom caso: não é zero, não é texto em branco, é ausência de valor.

```python
data_pagamento = None
print(data_pagamento)
```

Saída:

```
None
```

## Descobrindo o tipo com `type()`

A função `type()` mostra o tipo de qualquer valor ou variável:

```python
print(type(42))
print(type(3.14))
print(type("texto"))
print(type(True))
print(type(None))
```

Saída:

```
<class 'int'>
<class 'float'>
<class 'str'>
<class 'bool'>
<class 'NoneType'>
```

Use `type()` sempre que estiver em dúvida se um valor é número ou texto. Esse é o primeiro passo para resolver muitos erros.

## Nomes válidos

Regras obrigatórias do Python:

1. Começa com letra ou sublinhado (`_`), nunca com número. `nota2` vale; `2nota` não.
2. Só letras, números e sublinhado. Nada de espaços, hífens, pontos ou acentos (acentos até funcionam, mas evite).
3. Maiúsculas e minúsculas são diferentes: `Total`, `total` e `TOTAL` são três variáveis distintas.
4. Não pode ser palavra reservada da linguagem: `if`, `for`, `while`, `def`, `class`, `return`, `True`, `None` etc.

Exemplos (as três últimas linhas são erros propositais: um arquivo com qualquer uma delas nem começa a rodar):

```python
valor_nota = 1500      # válido
valorNota = 1500       # válido, mas não é o estilo do Python
valor-nota = 1500      # ERRO: hífen vira subtração
valor nota = 1500      # ERRO: espaço
1valor = 1500          # ERRO: começa com número
```

## Convenções (o jeito "pythônico")

Além das regras, existem **convenções** que a comunidade segue para o código ficar legível. Elas vêm de um documento chamado PEP 8:

- Variáveis em **minúsculas com sublinhado** separando palavras: `salario_bruto`, `total_impostos`, `nome_cliente`. Esse estilo chama-se *snake_case*.
- Constantes (valores que não mudam) em **MAIÚSCULAS**: `ALIQUOTA_ISS = 0.05`, `TETO_INSS = 8157.41`.
- Nomes **descritivos**. `sb = 3500` economiza letras, mas daqui a um mês você não lembra o que `sb` significa. `salario_bruto = 3500` se explica sozinho.
- Evite nomes de uma letra, exceto em contadores rápidos (`i`, `n`) que você verá mais adiante.
- Não sobrescreva nomes de funções do Python: `print = 5` ou `type = "nota"` funcionam, mas quebram o `print()` e o `type()` dali em diante.

## Várias atribuições em uma linha

Python permite atribuir vários valores de uma vez, o que deixa o código compacto:

```python
mes, ano = 10, 2026
print(mes, ano)

a = b = 0   # as duas recebem 0
print(a, b)
```

Saída:

```
10 2026
0 0
```

## Na prática

Um script de fechamento costuma começar com um bloco de variáveis bem nomeadas: `competencia = "10/2026"`, `aliquota_iss = 0.05`, `cnpj_cliente = "12.345.678/0001-90"`. Quem abrir o arquivo daqui a seis meses entende tudo sem ler o resto. A regra "código é texto, valor é número" evita o erro mais caro desse trabalho: um CNPJ, CEP ou número de nota que perde o zero à esquerda por ter sido guardado como número.

## Erros comuns

- **Usar vírgula como decimal**: `preco = 10,50` cria uma tupla `(10, 50)`, não o número 10,50. Use ponto.
- **Esquecer as aspas em texto**: `nome = Maria` dá `NameError`, porque o Python procura uma variável chamada `Maria`.
- **Usar variável antes de criar**: `print(total)` antes de `total = 0` gera `NameError: name 'total' is not defined`.
- **Confundir `=` com `==`**: `if saldo = 0` é erro de sintaxe; comparação é `==`.
- **Guardar CPF/CNPJ como número**: perde zeros à esquerda e a formatação. Use `str`.
- **`true`/`false` em minúsculas**: em Python é `True` e `False`.

## Resumo

- Variável é um nome que guarda um valor; `=` significa "recebe", e o valor pode ser trocado a qualquer momento.
- Os tipos básicos são `int` (inteiro), `float` (decimal com ponto), `str` (texto entre aspas), `bool` (`True`/`False`) e `None` (ausência de valor).
- `type(valor)` revela o tipo; use quando houver dúvida.
- Nomes começam com letra ou `_`, não têm espaços nem hífens e diferenciam maiúsculas de minúsculas.
- Convenção: `snake_case` para variáveis, `MAIUSCULAS` para constantes e nomes descritivos sempre.
