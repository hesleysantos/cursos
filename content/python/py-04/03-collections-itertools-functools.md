# collections, itertools e functools

Três módulos da biblioteca padrão resolvem, em uma linha, problemas que você hoje escreve em dez: contar ocorrências, agrupar, combinar, memorizar resultados. Nesta lição você vai conhecer as estruturas do `collections` (`Counter`, `defaultdict`, `deque`, `namedtuple`), as ferramentas de iteração do `itertools` (`chain`, `groupby`, `product`, `combinations`, `islice`) e os utilitários de função do `functools` (`lru_cache`, `partial`, `reduce`).

## `collections`: estruturas de dados especializadas

### `Counter`: contando sem esforço

Quantas notas fiscais cada cliente emitiu no mês? Sem `Counter`:

```python
clientes = ["Padaria", "Oficina", "Padaria", "Farmácia", "Padaria", "Oficina"]
contagem = {}
for c in clientes:
    contagem[c] = contagem.get(c, 0) + 1
print(contagem)   # {'Padaria': 3, 'Oficina': 2, 'Farmácia': 1}
```

Com `Counter`:

```python
from collections import Counter

clientes = ["Padaria", "Oficina", "Padaria", "Farmácia", "Padaria", "Oficina"]
cont = Counter(clientes)
print(cont)                      # Counter({'Padaria': 3, 'Oficina': 2, 'Farmácia': 1})
print(cont["Padaria"])           # 3
print(cont["Inexistente"])       # 0  (não dá KeyError!)
print(cont.most_common(2))       # [('Padaria', 3), ('Oficina', 2)]
cont.update(["Farmácia"])        # soma mais uma
print(cont["Farmácia"])          # 2
print(sum(cont.values()))        # 7  total de notas
```

`Counter` é um dicionário cujo valor padrão é zero. Aceita qualquer iterável (lista, string, gerador) e tem `most_common`, soma e subtração entre contadores (`c1 + c2`, `c1 - c2`).

### `defaultdict`: dicionário com valor padrão

Agrupar lançamentos por conta exige "se a chave não existe, crie uma lista". O `defaultdict` faz isso sozinho:

```python
from collections import defaultdict

lancamentos = [("1.1.01", 1500.0), ("3.1.02", -3500.0), ("1.1.01", 7200.0), ("3.1.05", -820.45)]

por_conta = defaultdict(list)
for conta, valor in lancamentos:
    por_conta[conta].append(valor)     # a lista é criada automaticamente na 1ª vez
print(dict(por_conta))
# {'1.1.01': [1500.0, 7200.0], '3.1.02': [-3500.0], '3.1.05': [-820.45]}

totais = defaultdict(float)
for conta, valor in lancamentos:
    totais[conta] += valor
print(dict(totais))
# {'1.1.01': 8700.0, '3.1.02': -3500.0, '3.1.05': -820.45}
```

O argumento é uma **função** que fabrica o valor padrão: `list`, `float`, `int`, `set`, ou até `lambda: {"debitos": 0, "creditos": 0}`.

> **Atenção:** apenas **ler** uma chave inexistente (`por_conta["9.9.99"]`) já a cria com o valor padrão. Use `if chave in d` quando quiser só consultar.

### `deque`: fila de duas pontas

Listas são rápidas para adicionar e remover no **fim**, mas lentas no **início** (`lista.insert(0, x)` e `lista.pop(0)` precisam deslocar todos os elementos). O `deque` (*double-ended queue*) é rápido nas duas pontas:

```python
from collections import deque

fila = deque(["NF-1", "NF-2", "NF-3"])
fila.append("NF-4")            # entra no fim
fila.appendleft("NF-0")        # entra no início
print(fila.popleft())          # NF-0  (sai do início)
print(fila)                    # deque(['NF-1', 'NF-2', 'NF-3', 'NF-4'])

ultimos = deque(maxlen=3)      # guarda só os 3 mais recentes
for v in [10, 20, 30, 40, 50]:
    ultimos.append(v)
print(list(ultimos))           # [30, 40, 50]
```

`maxlen` é perfeito para "média móvel dos últimos N meses" ou "últimas 100 linhas do log".

### `namedtuple`: tuplas com nomes

Uma tupla `("2026-03-02", "3.1.02", -3500.0)` obriga você a lembrar que o índice 2 é o valor. `namedtuple` cria uma classe leve, imutável, com acesso por nome:

```python
from collections import namedtuple

Lancamento = namedtuple("Lancamento", ["data", "conta", "valor"])
l = Lancamento("2026-03-02", "3.1.02", -3500.0)
print(l.valor)        # -3500.0
print(l[2])           # -3500.0  (continua sendo uma tupla)
print(l)              # Lancamento(data='2026-03-02', conta='3.1.02', valor=-3500.0)
data, conta, valor = l             # desempacota como tupla
print(l._asdict())    # {'data': '2026-03-02', 'conta': '3.1.02', 'valor': -3500.0}
```

Comparada à `dataclass`, a `namedtuple` é mais leve e sempre imutável, mas acrescentar métodos exige criar uma subclasse e os valores padrão são limitados (parâmetro `defaults=`). Para registros simples lidos de CSV, ela basta; se precisar de comportamento, use `dataclass`.

## `itertools`: iteração com superpoderes

Todas as funções do `itertools` devolvem **iteradores** preguiçosos: nada é calculado até você pedir.

### `chain`: emendar iteráveis

```python
from itertools import chain

janeiro = [100.0, 200.0]
fevereiro = [150.0]
marco = (v for v in [300.0, 50.0])
print(list(chain(janeiro, fevereiro, marco)))    # [100.0, 200.0, 150.0, 300.0, 50.0]
print(sum(chain.from_iterable([[1, 2], [3], [4, 5]])))   # 15 (lista de listas)
```

Mais eficiente que `janeiro + fevereiro + marco`, que criaria listas intermediárias e nem funcionaria com o gerador.

### `groupby`: agrupar sequências ORDENADAS

```python
from itertools import groupby

lanc = [("3.1.02", -3500.0), ("1.1.01", 1500.0), ("1.1.01", 7200.0), ("3.1.02", -200.0)]
lanc.sort(key=lambda x: x[0])                  # OBRIGATÓRIO ordenar pela mesma chave
for conta, grupo in groupby(lanc, key=lambda x: x[0]):
    valores = [v for _, v in grupo]
    print(conta, valores, round(sum(valores), 2))
# 1.1.01 [1500.0, 7200.0] 8700.0
# 3.1.02 [-3500.0, -200.0] -3700.0
```

O `groupby` agrupa apenas elementos **consecutivos** com a mesma chave. Sem ordenar antes, você teria dois grupos "3.1.02" separados. Se não quiser ordenar, use `defaultdict(list)`.

### `product`, `combinations`, `permutations`

```python
from itertools import product, combinations, permutations

regimes = ["Simples", "Presumido"]
anos = [2025, 2026]
print(list(product(regimes, anos)))
# [('Simples', 2025), ('Simples', 2026), ('Presumido', 2025), ('Presumido', 2026)]

notas = [100.0, 250.0, 400.0, 150.0]
# Quais pares de notas somam 500?
print([par for par in combinations(notas, 2) if sum(par) == 500])
# [(100.0, 400.0)]
print(list(permutations("ABC", 2)))   # [('A','B'), ('A','C'), ('B','A'), ...] ordem importa
```

`product` é o produto cartesiano (todos os `for` aninhados numa linha); `combinations` escolhe subconjuntos sem repetição e sem ordem; `permutations` considera a ordem. Esse `combinations` é a base de um problema clássico de conciliação: descobrir quais lançamentos somam um valor do extrato.

### `islice`: fatiar iteradores

Geradores não aceitam `g[:5]`. O `islice` resolve:

```python
from itertools import islice, count

def numeros_nf():
    n = 1
    while True:             # gerador infinito
        yield f"NF-{n:04d}"
        n += 1

print(list(islice(numeros_nf(), 3)))        # ['NF-0001', 'NF-0002', 'NF-0003']
print(list(islice(numeros_nf(), 2, 5)))     # ['NF-0003', 'NF-0004', 'NF-0005']
print(list(islice(count(10, 5), 4)))        # [10, 15, 20, 25]
```

Também vale a pena conhecer `accumulate` (somas acumuladas: saldo após cada lançamento), `zip_longest` e `pairwise` (pares consecutivos, Python 3.10+).

## `functools`: ferramentas para funções

### `lru_cache`: memorizar resultados

Funções puras e caras (que sempre dão o mesmo resultado para a mesma entrada) podem guardar as respostas:

```python
from functools import lru_cache

@lru_cache(maxsize=None)
def fatorial(n):
    return 1 if n <= 1 else n * fatorial(n - 1)

print(fatorial(50))             # calculado
print(fatorial(50))             # instantâneo: veio do cache
print(fatorial.cache_info())    # CacheInfo(hits=1, misses=50, ...)
```

Uma consulta de alíquota por município, por exemplo, pode ser cara (ler arquivo, chamar API); com `@lru_cache` só a primeira chamada paga o preço. Os argumentos precisam ser *hashable* (nada de listas ou dicts). No Python 3.9+, `@cache` é um atalho para `lru_cache(maxsize=None)`.

### `partial`: fixar argumentos

```python
from functools import partial

def imposto(valor, aliquota):
    return round(valor * aliquota, 2)

iss_aracaju = partial(imposto, aliquota=0.05)
iss_sp = partial(imposto, aliquota=0.02)
print(iss_aracaju(1000), iss_sp(1000))      # 50.0 20.0
print(list(map(iss_aracaju, [100, 200])))   # [5.0, 10.0]
```

`partial` cria uma nova função com alguns argumentos já preenchidos. É a closure da lição 8 do módulo 3, pronta.

### `reduce`: acumular

```python
from functools import reduce

valores = [100.0, -35.5, -1200.0, 50.0]
print(reduce(lambda acc, v: acc + v, valores, 0.0))     # -1085.5 (igual a sum)
print(reduce(lambda a, b: a if abs(a) > abs(b) else b, valores))   # -1200.0 (maior em módulo)
```

`reduce(funcao, iteravel, inicial)` aplica a função acumulando dois a dois. Na prática, `sum`, `max`, `min` e `"".join` cobrem 95% dos casos de forma mais legível; use `reduce` só quando não houver função pronta.

## Erros comuns

- **`groupby` sem ordenar**: grupos duplicados e totais errados.
- **Ler chave inexistente num `defaultdict`** achando que só consulta: cria a chave.
- **`lru_cache` em função com efeito colateral** ou que depende de algo externo que muda (hora atual, arquivo): devolve resultado velho.
- **Esgotar o iterador do `itertools`**: `chain`, `islice` e companhia são de uso único; converta para lista se precisar reutilizar.
- **`namedtuple` quando precisa alterar campos**: ela é imutável; use `._replace()` ou troque por `dataclass`.

## Na prática

`Counter` responde "quantas notas cada cliente emitiu"; `defaultdict(list)` agrupa lançamentos por conta sem `if`; `deque(maxlen=12)` guarda os últimos 12 meses para a média móvel; `combinations` descobre quais lançamentos somam o valor de um depósito não identificado. São ferramentas de conciliação e análise prontas na biblioteca padrão.

## Resumo

- `Counter` conta; `defaultdict` cria valores padrão; `deque` é fila rápida nas duas pontas (com `maxlen`); `namedtuple` dá nomes aos campos de uma tupla.
- `chain` emenda iteráveis; `groupby` agrupa consecutivos (ordene antes!); `product`/`combinations`/`permutations` geram combinações; `islice` fatia iteradores e geradores infinitos.
- `lru_cache` memoriza resultados de funções puras; `partial` fixa argumentos; `reduce` acumula (prefira `sum`/`max` quando existirem).
- Tudo no `itertools` é preguiçoso e de uso único: pense em pipelines, não em listas.
