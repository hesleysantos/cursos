Nesta lição você vai conhecer o **conjunto** (`set`), uma coleção **sem ordem e sem repetição**. Vai criar conjuntos, adicionar e remover itens, usar as operações de união, interseção e diferença (`|`, `&`, `-`) e aplicar o uso mais comum de todos: remover duplicados de uma lista. Conjuntos são a ferramenta certa para perguntas como "quais CNPJs aparecem nos dois relatórios?" ou "quais notas estão no sistema mas não no SPED?".

## O que é um conjunto

Um conjunto guarda valores únicos, sem posição. É o conceito matemático de conjunto: `{1, 2, 3}` é o mesmo que `{3, 1, 2}`, e `{1, 1, 2}` é simplesmente `{1, 2}`.

```python
tipos = {"NFe", "NFSe", "CTe", "NFe"}
print(tipos)
print(len(tipos))
```

Saída:

```
{'NFSe', 'CTe', 'NFe'}
3
```

Repare: o `"NFe"` repetido sumiu, e a ordem de exibição não é a de criação (pode variar entre execuções). Se a ordem importa, conjunto não é a estrutura certa.

Chaves `{}` com valores soltos criam um conjunto; com pares `chave: valor` criam um dicionário. E atenção ao conjunto vazio: `{}` é um **dicionário** vazio. Conjunto vazio se escreve `set()`.

```python
vazio_dict = {}
vazio_set = set()
print(type(vazio_dict), type(vazio_set))
```

Saída:

```
<class 'dict'> <class 'set'>
```

Assim como as chaves de dicionário, os itens de um conjunto precisam ser **imutáveis**: números, strings, tuplas. Listas e dicionários não podem entrar (`TypeError: unhashable type`).

## Criar a partir de outra coleção

`set(iteravel)` converte lista, tupla ou string em conjunto, eliminando repetições:

```python
cnpjs = ["111", "222", "111", "333", "222"]
unicos = set(cnpjs)
print(unicos)
print(len(cnpjs), "lançamentos de", len(unicos), "CNPJs distintos")

letras = set("contabilidade")
print(sorted(letras))
```

Saída:

```
{'333', '222', '111'}
5 lançamentos de 3 CNPJs distintos
['a', 'b', 'c', 'd', 'e', 'i', 'l', 'n', 'o', 't']
```

`sorted(conjunto)` devolve uma **lista** ordenada — útil para exibir, já que o conjunto em si não tem ordem.

## Adicionar, remover, testar

```python
pendentes = {"NF 10", "NF 11"}
pendentes.add("NF 12")
pendentes.add("NF 10")       # já existe: nada acontece, sem erro
print(pendentes)

pendentes.remove("NF 11")    # KeyError se não existir
pendentes.discard("NF 99")   # não existe: ignora silenciosamente
print(pendentes)

print("NF 12" in pendentes)
```

Saída:

```
{'NF 11', 'NF 12', 'NF 10'}
{'NF 12', 'NF 10'}
True
```

Prefira `discard` quando não tem certeza de que o item existe. O `in` em conjuntos é **muito rápido**, mesmo com milhões de itens — bem mais rápido que em listas. Se você vai perguntar "está aqui?" muitas vezes, converta a lista para conjunto antes.

## Operações entre conjuntos

Aqui está a força dos conjuntos. Imagine dois relatórios: as notas que estão no sistema contábil e as notas que estão no arquivo SPED. (Lembre: a ordem em que o Python exibe um conjunto de textos pode ser diferente na sua máquina; o conteúdo é o que importa.)

```python
sistema = {"NF 101", "NF 102", "NF 103", "NF 104"}
sped = {"NF 102", "NF 103", "NF 105"}
```

### União `|`: tudo que está em um ou no outro

```python
print(sistema | sped)
```

Saída:

```
{'NF 105', 'NF 101', 'NF 103', 'NF 104', 'NF 102'}
```

### Interseção `&`: só o que está nos dois

```python
print(sistema & sped)
```

Saída:

```
{'NF 103', 'NF 102'}
```

### Diferença `-`: o que está no primeiro e não no segundo

```python
print(sistema - sped)     # no sistema, faltando no SPED
print(sped - sistema)     # no SPED, faltando no sistema
```

Saída:

```
{'NF 101', 'NF 104'}
{'NF 105'}
```

A diferença **não é simétrica**: `a - b` é diferente de `b - a`. Esse é o cálculo de conciliação clássico: "o que falta de cada lado".

### Diferença simétrica `^`: o que está em um só dos dois

```python
print(sistema ^ sped)
```

Saída:

```
{'NF 105', 'NF 101', 'NF 104'}
```

Equivale a `(sistema - sped) | (sped - sistema)`: todas as divergências de uma vez.

As mesmas operações existem como métodos, aceitando qualquer iterável (não só conjuntos): `a.union(b)`, `a.intersection(b)`, `a.difference(b)`, `a.symmetric_difference(b)`. Os operadores exigem dois conjuntos; os métodos aceitam `a.intersection(lista)`.

### Subconjunto e superconjunto

```python
obrigatorios = {"nome", "cnpj", "valor"}
campos_recebidos = {"nome", "cnpj", "valor", "email"}
print(obrigatorios <= campos_recebidos)    # obrigatórios estão todos presentes?
print(obrigatorios - campos_recebidos)     # quais faltam? (vazio = nenhum)
```

Saída:

```
True
set()
```

`a <= b` pergunta "a é subconjunto de b?". A diferença vazia confirma que nenhum campo obrigatório faltou — validação de cadastro em uma linha.

## Removendo duplicados de uma lista

O uso mais frequente. A forma curta:

```python
clientes = ["Padaria", "Oficina", "Padaria", "Mercado", "Oficina"]
unicos = list(set(clientes))
print(sorted(unicos))
```

Saída:

```
['Mercado', 'Oficina', 'Padaria']
```

Funciona, mas **perde a ordem original**. Se a ordem importa (manter a primeira ocorrência de cada um), use o conjunto como auxiliar de "já vi":

```python
clientes = ["Padaria", "Oficina", "Padaria", "Mercado", "Oficina"]
vistos = set()
sem_repetir = []
for c in clientes:
    if c not in vistos:
        vistos.add(c)
        sem_repetir.append(c)
print(sem_repetir)
```

Saída:

```
['Padaria', 'Oficina', 'Mercado']
```

Um truque idiomático que preserva a ordem em uma linha: `list(dict.fromkeys(clientes))` — aproveita que dicionários não repetem chaves e mantêm ordem.

Detectar **quais** itens estão duplicados:

```python
notas = ["NF 1", "NF 2", "NF 1", "NF 3", "NF 2"]
vistos = set()
duplicados = set()
for n in notas:
    if n in vistos:
        duplicados.add(n)
    vistos.add(n)
print(duplicados)
```

Saída:

```
{'NF 1', 'NF 2'}
```

## Um caso completo: conciliação

```python
lancamentos_banco = [("2026-10-01", 1500.00), ("2026-10-02", 320.50), ("2026-10-03", 89.90)]
lancamentos_contabil = [("2026-10-01", 1500.00), ("2026-10-03", 89.90), ("2026-10-04", 2000.00)]

banco = set(lancamentos_banco)
contabil = set(lancamentos_contabil)

print("Conciliados:", sorted(banco & contabil))
print("Só no banco:", sorted(banco - contabil))
print("Só na contabilidade:", sorted(contabil - banco))
```

Saída:

```
Conciliados: [('2026-10-01', 1500.0), ('2026-10-03', 89.9)]
Só no banco: [('2026-10-02', 320.5)]
Só na contabilidade: [('2026-10-04', 2000.0)]
```

Aqui os itens são **tuplas** (data, valor) — imutáveis, portanto aceitas no conjunto. Listas não serviriam. Esse é um motivo prático para preferir tuplas em registros.

## `frozenset`

Existe uma versão imutável do conjunto: `frozenset`. Serve quando você precisa de um conjunto como chave de dicionário ou item de outro conjunto. Raro no dia a dia, mas bom saber que existe.

## Na prática

Conciliação é conjunto: notas do sistema contra notas do SPED, lançamentos do extrato contra lançamentos da contabilidade, CNPJs da carteira contra CNPJs que entregaram documentos. Duas diferenças (`a - b` e `b - a`) respondem "o que falta de cada lado" em uma linha. Outros usos frequentes: detectar notas duplicadas num lote e validar se um cadastro tem todos os campos obrigatórios (`obrigatorios <= recebidos`).

## Erros comuns

- **`{}` para conjunto vazio**: cria dicionário. Use `set()`.
- **Esperar ordem**: conjuntos não têm posição; `conjunto[0]` gera `TypeError`. Use `sorted()` para exibir.
- **Colocar lista dentro do conjunto**: `TypeError: unhashable type: 'list'`. Converta para tupla.
- **`remove` de item inexistente**: `KeyError`. Use `discard`.
- **Achar que `a - b == b - a`**: a diferença depende da ordem dos operandos.
- **Perder duplicados sem querer**: ao converter uma lista para set para "só olhar", lembre que contagens somem. Se precisa saber quantas vezes cada item aparece, use o padrão contador com dicionário.

## Resumo

- Conjunto (`set`) é uma coleção **sem ordem e sem repetição** de itens imutáveis; vazio é `set()`, não `{}`.
- `add`, `remove` (erro se ausente), `discard` (silencioso) e `in` (muito rápido) são as operações básicas.
- Operações: `|` união, `&` interseção, `-` diferença (não simétrica), `^` diferença simétrica, `<=` subconjunto.
- `set(lista)` remove duplicados perdendo a ordem; para manter a ordem, use um conjunto auxiliar de "vistos" ou `dict.fromkeys`.
- Conciliação entre duas fontes é `a & b` (bateu), `a - b` e `b - a` (faltas de cada lado); use tuplas como itens quando o registro tem vários campos.
