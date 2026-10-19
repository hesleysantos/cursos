Nesta lição você vai construir, passo a passo, um **controle de despesas em memória**: uma lista de dicionários onde cada despesa tem descrição, categoria, valor e data, mais um conjunto de funções para adicionar despesas, totalizar (geral e por categoria), filtrar por mês e imprimir um relatório formatado e ordenado. É o módulo inteiro em um só programa: listas, dicionários, laços, comprehensions, funções com parâmetros padrão e ordenação com `key`.

## Passo 1: desenhar os dados

Antes de escrever código, decida **como os dados vão ser representados**. Uma despesa tem campos com nomes — é um dicionário. Várias despesas — uma lista. Logo, a estrutura central é uma **lista de dicionários**:

```python
despesas = [
    {"descricao": "Aluguel escritório", "categoria": "Aluguel", "valor": 2500.00, "data": "2026-10-05"},
    {"descricao": "Conta de energia", "categoria": "Energia", "valor": 380.50, "data": "2026-10-10"},
]
```

Por que não uma lista de tuplas? Porque com quatro campos, `d[2]` já não é óbvio; `d["valor"]` é. Por que a data como texto `"AAAA-MM-DD"`? Porque nesse formato a ordem alfabética coincide com a cronológica, e `data.startswith("2026-10")` filtra um mês inteiro. Mais adiante no curso usaremos o módulo `datetime`; por enquanto, texto bem formatado resolve.

"Em memória" significa que os dados vivem só enquanto o programa roda. Ao fechar, somem. Persistir em arquivo é assunto dos próximos módulos; aqui o foco é a lógica.

## Passo 2: adicionar despesas

A função recebe a lista e os dados, monta o dicionário, acrescenta e devolve a despesa criada.

```python
def adicionar_despesa(despesas, descricao, categoria, valor, data):
    """Cria o dicionário da despesa, adiciona à lista e devolve a despesa."""
    despesa = {
        "descricao": descricao,
        "categoria": categoria,
        "valor": round(valor, 2),
        "data": data,
    }
    despesas.append(despesa)
    return despesa
```

A lista é passada como parâmetro e alterada dentro da função — lembre que a função recebe o **mesmo objeto**, não uma cópia, então `despesas.append` modifica a lista de quem chamou. É intencional aqui. O `round(valor, 2)` garante centavos desde a entrada.

```python
despesas = []
adicionar_despesa(despesas, "Aluguel escritório", "Aluguel", 2500.00, "2026-10-05")
adicionar_despesa(despesas, "Conta de energia", "Energia", 380.50, "2026-10-10")
print(len(despesas))
print(despesas[0]["categoria"])
```

Saída:

```
2
Aluguel
```

## Passo 3: totais

O total geral é uma soma dos valores — com uma expressão geradora dentro de `sum`:

```python
def total_geral(despesas):
    return round(sum(d["valor"] for d in despesas), 2)
```

O total por categoria é o **padrão contador** da lição de dicionários, com uma comprehension no final para arredondar:

```python
def total_por_categoria(despesas):
    totais = {}
    for d in despesas:
        cat = d["categoria"]
        totais[cat] = totais.get(cat, 0) + d["valor"]
    return {cat: round(v, 2) for cat, v in totais.items()}
```

Vamos carregar mais dados e testar:

```python
adicionar_despesa(despesas, "Papel A4", "Material", 129.90, "2026-10-12")
adicionar_despesa(despesas, "Internet", "Energia", 199.90, "2026-10-15")
adicionar_despesa(despesas, "Aluguel escritório", "Aluguel", 2500.00, "2026-11-05")
adicionar_despesa(despesas, "Toner", "Material", 450.00, "2026-11-08")

print(total_geral(despesas))
print(total_por_categoria(despesas))
```

Saída:

```
6160.3
{'Aluguel': 5000.0, 'Energia': 580.4, 'Material': 579.9}
```

## Passo 4: filtros

Filtrar é uma comprehension com `if`. Duas funções, mesma forma:

```python
def filtrar_por_mes(despesas, mes):
    """mes no formato 'AAAA-MM', ex.: '2026-10'."""
    return [d for d in despesas if d["data"].startswith(mes)]


def filtrar_por_categoria(despesas, categoria):
    return [d for d in despesas if d["categoria"] == categoria]
```

```python
outubro = filtrar_por_mes(despesas, "2026-10")
print(len(outubro))
print(total_geral(outubro))
print(total_geral(filtrar_por_categoria(despesas, "Material")))
```

Saída:

```
4
3210.3
579.9
```

Repare na composição: `total_geral(filtrar_por_categoria(...))`. Como os filtros devolvem **listas de despesas no mesmo formato**, qualquer função que aceita a lista completa aceita também a lista filtrada. Esse encaixe entre funções é o que torna o código flexível: não precisamos de uma função "total de Material em outubro" — basta encadear.

## Passo 5: a maior despesa

Para achar o dicionário com maior valor, usamos `max` com `key`. Precisamos de uma função que, dado um dicionário, devolva o valor pelo qual comparar:

```python
def valor_da_despesa(despesa):
    return despesa["valor"]


def maior_despesa(despesas):
    if not despesas:
        return None
    return max(despesas, key=valor_da_despesa)
```

O `if not despesas` protege contra lista vazia (`max` de lista vazia gera `ValueError`). Devolver `None` é a forma honesta de dizer "não há maior despesa".

```python
print(maior_despesa(despesas)["descricao"])
print(maior_despesa([]))
```

Saída:

```
Aluguel escritório
None
```

A mesma função `valor_da_despesa` vai servir de `key` para o `sorted` do relatório.

## Passo 6: o relatório

Agora a exibição, separada do cálculo. O relatório recebe uma lista (completa ou filtrada) e um título opcional, lista as despesas da maior para a menor e fecha com o resumo por categoria e o total.

```python
def valor_do_par(par):
    return par[1]


def relatorio(despesas, titulo="RELATÓRIO DE DESPESAS"):
    print("=" * 50)
    print(f"{titulo:^50}")
    print("=" * 50)
    print(f"{'Data':<12}{'Descrição':<20}{'Categoria':<10}{'Valor':>8}")
    print("-" * 50)
    for d in sorted(despesas, key=valor_da_despesa, reverse=True):
        print(f"{d['data']:<12}{d['descricao']:<20}{d['categoria']:<10}{d['valor']:>8.2f}")
    print("-" * 50)
    totais = total_por_categoria(despesas)
    total = total_geral(despesas)
    print("Por categoria:")
    for cat, valor in sorted(totais.items(), key=valor_do_par, reverse=True):
        pct = valor / total * 100 if total else 0
        print(f"  {cat:<18}{valor:>10.2f}  {pct:>5.1f}%")
    print("-" * 50)
    print(f"{'TOTAL':<30}{total:>20.2f}")
    print("=" * 50)
```

Pontos de atenção:

- `sorted(despesas, key=valor_da_despesa, reverse=True)` ordena os dicionários pelo valor, decrescente, sem alterar a lista original.
- `totais.items()` produz tuplas `(categoria, valor)`; `valor_do_par` pega a posição 1 para ordenar as categorias pelo total.
- `pct = valor / total * 100 if total else 0` evita divisão por zero quando a lista está vazia.
- Dentro das f-strings usamos aspas simples (`d['data']`) porque a string externa usa aspas duplas.

```python
relatorio(filtrar_por_mes(despesas, "2026-10"), "DESPESAS DE OUTUBRO/2026")
```

Saída:

```
==================================================
             DESPESAS DE OUTUBRO/2026             
==================================================
Data        Descrição           Categoria    Valor
--------------------------------------------------
2026-10-05  Aluguel escritório  Aluguel    2500.00
2026-10-10  Conta de energia    Energia     380.50
2026-10-15  Internet            Energia     199.90
2026-10-12  Papel A4            Material    129.90
--------------------------------------------------
Por categoria:
  Aluguel              2500.00   77.9%
  Energia               580.40   18.1%
  Material              129.90    4.0%
--------------------------------------------------
TOTAL                                      3210.30
==================================================
```

## Código completo

```python
# despesas.py — controle de despesas em memória


def adicionar_despesa(despesas, descricao, categoria, valor, data):
    """Cria o dicionário da despesa, adiciona à lista e devolve a despesa."""
    despesa = {
        "descricao": descricao,
        "categoria": categoria,
        "valor": round(valor, 2),
        "data": data,
    }
    despesas.append(despesa)
    return despesa


def total_geral(despesas):
    return round(sum(d["valor"] for d in despesas), 2)


def total_por_categoria(despesas):
    totais = {}
    for d in despesas:
        cat = d["categoria"]
        totais[cat] = totais.get(cat, 0) + d["valor"]
    return {cat: round(v, 2) for cat, v in totais.items()}


def filtrar_por_mes(despesas, mes):
    """mes no formato 'AAAA-MM', ex.: '2026-10'."""
    return [d for d in despesas if d["data"].startswith(mes)]


def filtrar_por_categoria(despesas, categoria):
    return [d for d in despesas if d["categoria"] == categoria]


def valor_da_despesa(despesa):
    return despesa["valor"]


def valor_do_par(par):
    return par[1]


def maior_despesa(despesas):
    if not despesas:
        return None
    return max(despesas, key=valor_da_despesa)


def relatorio(despesas, titulo="RELATÓRIO DE DESPESAS"):
    print("=" * 50)
    print(f"{titulo:^50}")
    print("=" * 50)
    print(f"{'Data':<12}{'Descrição':<20}{'Categoria':<10}{'Valor':>8}")
    print("-" * 50)
    for d in sorted(despesas, key=valor_da_despesa, reverse=True):
        print(f"{d['data']:<12}{d['descricao']:<20}{d['categoria']:<10}{d['valor']:>8.2f}")
    print("-" * 50)
    totais = total_por_categoria(despesas)
    total = total_geral(despesas)
    print("Por categoria:")
    for cat, valor in sorted(totais.items(), key=valor_do_par, reverse=True):
        pct = valor / total * 100 if total else 0
        print(f"  {cat:<18}{valor:>10.2f}  {pct:>5.1f}%")
    print("-" * 50)
    print(f"{'TOTAL':<30}{total:>20.2f}")
    print("=" * 50)


despesas = []
adicionar_despesa(despesas, "Aluguel escritório", "Aluguel", 2500.00, "2026-10-05")
adicionar_despesa(despesas, "Conta de energia", "Energia", 380.50, "2026-10-10")
adicionar_despesa(despesas, "Papel A4", "Material", 129.90, "2026-10-12")
adicionar_despesa(despesas, "Internet", "Energia", 199.90, "2026-10-15")
adicionar_despesa(despesas, "Aluguel escritório", "Aluguel", 2500.00, "2026-11-05")
adicionar_despesa(despesas, "Toner", "Material", 450.00, "2026-11-08")

relatorio(filtrar_por_mes(despesas, "2026-10"), "DESPESAS DE OUTUBRO/2026")
relatorio(despesas)
```

## Por que essa organização funciona

- **Uma estrutura de dados clara** (lista de dicionários) e todas as funções falam a mesma língua: recebem e devolvem essa estrutura.
- **Cálculo separado de exibição**: `total_geral`, `total_por_categoria`, `filtrar_*` e `maior_despesa` devolvem valores e podem ser testadas; só `relatorio` imprime.
- **Funções pequenas que se compõem**: `relatorio(filtrar_por_mes(...))` em vez de uma função gigante com vários parâmetros.
- **Sem variáveis globais alteradas dentro das funções**: a lista é sempre passada como parâmetro. Trocar a lista por outra (de outro cliente, de outro ano) não exige mudar nenhuma função.

## Ideias para continuar

- `remover_despesa(despesas, descricao)` que remove a primeira despesa com aquela descrição e devolve `True`/`False`.
- `media_por_categoria` usando contagem e soma no mesmo laço.
- Validar a categoria contra um conjunto `CATEGORIAS_VALIDAS` e recusar despesas fora dele.
- Agrupar por mês em vez de por categoria: a chave vira `d["data"][:7]`.
- Nos próximos módulos: salvar e carregar as despesas em um arquivo CSV ou JSON, para que não se percam ao fechar o programa.

## Na prática

Troque "despesa" por "lançamento", "nota fiscal" ou "título a pagar" e este programa vira o esqueleto de boa parte dos relatórios de um escritório: uma lista de registros, filtros por período e por categoria, totais e um relatório ordenado. Quando as despesas passarem a vir de um arquivo CSV (próximo módulo), só a parte que carrega os dados muda; `total_por_categoria`, `filtrar_por_mes` e `relatorio` continuam exatamente como estão.

## Erros comuns neste projeto

- **Esquecer de zerar/arredondar**: somas de floats acumulam cauda; arredonde ao devolver.
- **`max` em lista vazia**: `ValueError`. Proteja com `if not despesas`.
- **Ordenar a lista original com `sort()`** dentro do relatório: muda a ordem para quem chamou. Use `sorted`.
- **Passar a função `key` com parênteses**: `key=valor_da_despesa()` chama a função sem argumento e dá `TypeError`. Passe sem parênteses.
- **Divisão por zero no percentual** quando a lista filtrada está vazia.
- **Aspas duplas dentro de f-string com aspas duplas**: use simples por dentro.

## Resumo

- A estrutura central é uma lista de dicionários; todas as funções recebem e devolvem essa mesma forma, o que permite compor filtros e totais livremente.
- `adicionar_despesa` altera a lista recebida (referência) e devolve a despesa; os totais usam `sum` com gerador e o padrão contador com `get(cat, 0)`.
- Filtros são comprehensions com `if`; `max` e `sorted` com `key=função` escolhem e ordenam dicionários por um campo.
- O relatório é a única função que imprime; usa f-strings alinhadas e `sorted(..., reverse=True)` sem alterar os dados.
- Separar dados, cálculo e exibição é o que torna o programa testável e fácil de estender — o mesmo princípio do projeto do módulo anterior.
