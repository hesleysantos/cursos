Nesta lição você vai aprender as **comprehensions**, uma sintaxe compacta e muito pythônica para construir listas, dicionários e conjuntos a partir de outras coleções — com ou sem filtro. Elas substituem o padrão "lista vazia + `for` + `append`" por uma única linha legível, e aparecem em praticamente todo código Python profissional.

## O padrão que a comprehension substitui

Você já escreveu isso várias vezes:

```python
notas = [1200.00, 850.50, 300.00]
com_iss = []
for valor in notas:
    com_iss.append(round(valor * 0.95, 2))
print(com_iss)
```

Saída:

```
[1140.0, 807.97, 285.0]
```

Quatro linhas para dizer "a lista dos valores com 5% a menos". A comprehension diz isso em uma:

```python
com_iss = [round(valor * 0.95, 2) for valor in notas]
print(com_iss)
```

Saída:

```
[1140.0, 807.97, 285.0]
```

Leia da esquerda para a direita como uma frase: "**a lista de** `round(valor * 0.95, 2)` **para cada** `valor` **em** `notas`". A estrutura é:

```
[expressão for item in coleção]
```

A **expressão** é o que entra na lista nova; o **`for item in coleção`** é o mesmo laço de sempre, só que escrito depois.

## Comprehension de lista

Transformar cada item:

```python
nomes = ["maria silva", "joão souza", "ana lima"]
formatados = [nome.title() for nome in nomes]
print(formatados)

cnpjs = ["12.345.678/0001-90", "98.765.432/0001-11"]
limpos = [c.replace(".", "").replace("/", "").replace("-", "") for c in cnpjs]
print(limpos)

quadrados = [n ** 2 for n in range(1, 6)]
print(quadrados)
```

Saída:

```
['Maria Silva', 'João Souza', 'Ana Lima']
['12345678000190', '98765432000111']
[1, 4, 9, 16, 25]
```

## Com condição: filtrar

Acrescente `if condição` no final para incluir só alguns itens:

```
[expressão for item in coleção if condição]
```

```python
notas = [1200, 15000, 300, 22000, 850]
grandes = [v for v in notas if v > 10000]
print(grandes)

lancamentos = ["Aluguel", "", "Energia", "  ", "Material"]
validos = [l.strip() for l in lancamentos if l.strip()]
print(validos)
```

Saída:

```
[15000, 22000]
['Aluguel', 'Energia', 'Material']
```

No segundo exemplo, `if l.strip()` aproveita que string vazia é falsy: só passam os lançamentos com conteúdo, e a expressão `l.strip()` já os devolve limpos.

O equivalente longo, para comparar:

```python
grandes = []
for v in notas:
    if v > 10000:
        grandes.append(v)
```

A comprehension é a mesma coisa, achatada. Se você souber escrever o laço, sabe escrever a comprehension.

### `if/else` na expressão

Há duas posições diferentes para o `if`, e elas fazem coisas diferentes:

- `if` **no final** filtra (decide se o item entra).
- `if/else` **na expressão** transforma (o item sempre entra, mas o valor depende da condição).

```python
valores = [100, -50, 200, -30]
classificacao = ["crédito" if v > 0 else "débito" for v in valores]
print(classificacao)

absolutos = [v if v >= 0 else -v for v in valores]
print(absolutos)
```

Saída:

```
['crédito', 'débito', 'crédito', 'débito']
[100, 50, 200, 30]
```

Na expressão, o `else` é **obrigatório** (é a expressão condicional da lição de condicionais). No filtro do final, não existe `else`.

Dá para combinar os dois:

```python
notas = [1200, 15000, 300, 22000, 850]
rotulos = [f"{v} (alta)" if v > 10000 else f"{v}" for v in notas if v >= 500]
print(rotulos)
```

Saída:

```
['1200', '15000 (alta)', '22000 (alta)', '850']
```

Primeiro o filtro `v >= 500` descarta o 300; depois cada sobrevivente ganha o rótulo conforme o `if/else`.

## Comprehension de dicionário

Mesma ideia, com chaves `{}` e um par `chave: valor`:

```
{chave: valor for item in coleção}
```

```python
funcionarios = ["Maria", "João", "Ana"]
salarios = [3500, 4200, 2900]
tabela = {nome: sal for nome, sal in zip(funcionarios, salarios)}
print(tabela)

com_reajuste = {nome: round(sal * 1.05, 2) for nome, sal in tabela.items()}
print(com_reajuste)

acima_de_3000 = {nome: sal for nome, sal in tabela.items() if sal > 3000}
print(acima_de_3000)
```

Saída:

```
{'Maria': 3500, 'João': 4200, 'Ana': 2900}
{'Maria': 3675.0, 'João': 4410.0, 'Ana': 3045.0}
{'Maria': 3500, 'João': 4200}
```

Inverter um dicionário (trocar chaves por valores) é um clássico de uma linha:

```python
codigos = {"Caixa": "1.1.01", "Bancos": "1.1.02"}
por_codigo = {cod: nome for nome, cod in codigos.items()}
print(por_codigo)
```

Saída:

```
{'1.1.01': 'Caixa', '1.1.02': 'Bancos'}
```

Se houver valores repetidos, o último vence (chaves são únicas).

## Comprehension de conjunto

Chaves `{}` com uma única expressão (sem dois-pontos). Ótima para "quais valores distintos existem?":

```python
lancamentos = [
    ("Aluguel", 2500), ("Energia", 380), ("Aluguel", 2500), ("Material", 129),
]
categorias = {cat for cat, valor in lancamentos}
print(sorted(categorias))

ufs = {"se", "SE", "ba", "Ba", "al"}
normalizadas = {uf.upper() for uf in ufs}
print(sorted(normalizadas))
```

Saída:

```
['Aluguel', 'Energia', 'Material']
['AL', 'BA', 'SE']
```

## Aninhadas: dois `for`

Uma comprehension pode ter mais de um `for`, equivalente a laços aninhados. A ordem dos `for` é a mesma do código em bloco: o primeiro é o externo.

```python
empresas = ["Padaria", "Oficina"]
meses = ["Jan", "Fev"]
pares = [(e, m) for e in empresas for m in meses]
print(pares)

tabela = [[1200, 300], [5000], [800, 450]]
achatada = [v for linha in tabela for v in linha]
print(achatada)
```

Saída:

```
[('Padaria', 'Jan'), ('Padaria', 'Fev'), ('Oficina', 'Jan'), ('Oficina', 'Fev')]
[1200, 300, 5000, 800, 450]
```

"Achatar" uma lista de listas é o uso mais comum de dois `for`. Mais de dois níveis, porém, fica ilegível — nesse ponto, volte ao laço em bloco.

## Combinando com `sum`, `max`, `sorted`

Comprehensions dentro de funções agregadoras são um padrão poderoso:

```python
folha = [("Maria", 3500, True), ("João", 4200, False), ("Ana", 2900, True)]

total_ativos = sum(sal for nome, sal, ativo in folha if ativo)
print(total_ativos)

maior_nome = max(len(nome) for nome, _, _ in folha)
print(maior_nome)

ordenados = sorted(nome for nome, _, _ in folha)
print(ordenados)
```

Saída:

```
6400
5
['Ana', 'João', 'Maria']
```

Repare que dentro de `sum(...)` não usei colchetes: `sum(sal for ...)` em vez de `sum([sal for ...])`. Sem colchetes é uma **expressão geradora**, que produz os itens um a um sem montar a lista inteira na memória. Para somas, máximos e ordenações, é a forma preferida. O resultado é o mesmo; a diferença é eficiência.

## Quando NÃO usar

Comprehension é para **construir uma coleção**. Não use para executar ações:

```python
[print(n) for n in notas]     # funciona, mas é feio: cria uma lista de None só para imprimir
```

Para isso, use o `for` normal. Outras situações em que o laço em bloco é melhor:

- A expressão tem várias etapas ou precisa de variáveis intermediárias.
- Há `try/except` ou lógica complexa em cada item.
- A linha ficaria com mais de 80–90 caracteres ou com dois níveis de `if`.

A regra: se você precisa parar para decifrar, é longa demais. Legibilidade primeiro.

## Na prática

Comprehensions são o jeito rápido de preparar dados antes de um relatório: `[limpar_cnpj(c) for c in cnpjs]` para padronizar, `[n for n in notas if n["valor"] > 10000]` para selecionar o que precisa de revisão, `{d["categoria"] for d in despesas}` para saber quais categorias existem, `sum(n["valor"] for n in notas if n["tipo"] == "NFSe")` para um total filtrado. Cada uma dessas linhas substitui um laço de quatro linhas e se lê como uma frase.

## Erros comuns

- **Colocar o `else` no filtro do final**: `[v for v in lista if v > 0 else 0]` é `SyntaxError`. Com `else`, o `if` vai antes do `for`.
- **Esquecer o `else` na expressão**: `[v if v > 0 for v in lista]` é `SyntaxError`. Na expressão, `if` exige `else`.
- **Inverter a ordem dos `for` aninhados**: `[v for v in linha for linha in tabela]` gera `NameError`, porque `linha` ainda não existe quando `v in linha` é avaliado.
- **Usar `{}` esperando conjunto vazio**: comprehension de conjunto com zero itens resulta em `set()`, tudo bem; mas o literal `{}` é dicionário.
- **Usar comprehension só pelo efeito colateral** (`print`, `append` em outra lista).
- **Variável do laço com mesmo nome de uma externa**: dentro da comprehension ela é local e não vaza, mas confunde quem lê.

## Resumo

- Comprehension constrói uma coleção em uma linha: `[expr for item in coleção]`; leia como "a lista de expr para cada item em coleção".
- `if` no final **filtra**; `expr_a if cond else expr_b` na expressão **transforma** (e exige `else`).
- Dicionário: `{chave: valor for ...}`; conjunto: `{expr for ...}`; dois `for` equivalem a laços aninhados (primeiro é o externo).
- Dentro de `sum`, `max`, `min`, `sorted`, use a forma sem colchetes (expressão geradora).
- Use para construir coleções; para executar ações ou lógica complexa, prefira o `for` em bloco. Legibilidade acima de concisão.
