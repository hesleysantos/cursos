# Desempenho: medir antes de otimizar

Nesta lição você aprende a pensar em desempenho de forma disciplinada: entender a notação Big-O na prática, **medir** com `timeit` e `cProfile` antes de mexer em qualquer coisa, escolher a estrutura de dados certa (list, set, dict, deque), usar `lru_cache` para memoização, geradores para economizar memória, `sys.getsizeof` para enxergar o custo dos objetos e saber quando o problema exige sair do Python puro com NumPy ou Cython.

## Por que medir primeiro

A frase de Donald Knuth virou clichê porque é verdade: otimização prematura é a raiz de muitos males. Programadores são péssimos em adivinhar onde o tempo é gasto; o gargalo quase nunca está onde a intuição aponta. O método é simples: escreva o código claro, meça, encontre o trecho que domina o tempo (quase sempre um ou dois lugares), otimize **só ali** e meça de novo.

## Big-O na prática

Big-O descreve como o tempo (ou a memória) cresce com o tamanho da entrada `n`. Ignora constantes e foca no formato da curva:

| Ordem | Nome | Exemplo | 1 mil itens | 1 milhão |
|---|---|---|---|---|
| O(1) | constante | `d[chave]`, `lista.append` | 1 | 1 |
| O(log n) | logarítmica | busca binária em lista ordenada | 10 | 20 |
| O(n) | linear | `for` simples, `x in lista`, `sum` | 1 mil | 1 milhão |
| O(n log n) | linearítmica | `sorted` | 10 mil | 20 milhões |
| O(n²) | quadrática | dois `for` aninhados sobre a mesma lista | 1 milhão | 10¹² |

A lição central: **`x in lista` é O(n); `x in conjunto` e `x in dicionario` são O(1)**. Um loop que faz `in lista` dentro de outro loop vira O(n²) e é a causa número um de scripts que "funcionavam com 100 linhas e travaram com 100 mil".

```python
import time

lancamentos = [{"id": i, "conta": f"{i % 50}"} for i in range(20_000)]
ids_pagos = [i for i in range(0, 20_000, 2)]            # lista: 10 mil

inicio = time.perf_counter()
pagos = [l for l in lancamentos if l["id"] in ids_pagos]  # O(n * m)
print(f"lista: {time.perf_counter() - inicio:.2f}s")      # lista: 1.89s

ids_pagos_set = set(ids_pagos)
inicio = time.perf_counter()
pagos = [l for l in lancamentos if l["id"] in ids_pagos_set]  # O(n)
print(f"set:   {time.perf_counter() - inicio:.4f}s")      # set:   0.0021s
```

Uma linha (`set(...)`) tornou o código quase mil vezes mais rápido (os tempos variam por máquina, a proporção não). Nenhum truque, só a estrutura certa. E a diferença cresce com o volume: com 50 mil lançamentos, a versão com lista passa de 10 segundos.

## Medindo com timeit

Para comparar trechos pequenos, `timeit` roda o código muitas vezes e devolve o melhor tempo, eliminando ruído do sistema.

```python
import timeit

setup = "dados = list(range(10_000)); alvo = 9_999"
print(timeit.timeit("alvo in dados", setup=setup, number=1_000))         # ~0.11  (lista)
print(timeit.timeit("alvo in s", setup=setup + "; s = set(dados)", number=1_000))   # ~0.00004 (set)

# comparando formas de concatenar strings
partes = [str(i) for i in range(1000)]

def com_mais():
    s = ""
    for p in partes:
        s += p
    return s

print(timeit.timeit(lambda: "".join(partes), number=10_000))   # ~0.09
print(timeit.timeit(com_mais, number=10_000))                  # ~3.5  (varia por máquina; sempre bem mais lento)
```

No terminal, `python -m timeit -s "d = dict.fromkeys(range(1000))" "500 in d"` faz o mesmo. Use `timeit` para microdecisões (list comprehension ou `map`? `join` ou `+=`?), nunca para o programa inteiro.

## Encontrando o gargalo com cProfile

Para um programa real, use o profiler: ele mede quanto tempo cada função consumiu e quantas vezes foi chamada.

```python
# desempenho.py
import cProfile
import pstats

lancamentos = [{"id": i, "conta": f"{i % 50}"} for i in range(50_000)]

def calcular_tudo():
    totais = {}
    for l in lancamentos:
        totais[l["conta"]] = totais.get(l["conta"], 0) + 1
    return sorted(totais.items(), key=lambda kv: kv[1])

cProfile.run("calcular_tudo()", "perfil.out")
pstats.Stats("perfil.out").sort_stats("cumulative").print_stats(5)
#          50056 function calls in 0.057 seconds
#    ncalls  tottime  percall  cumtime  percall filename:lineno(function)
#         1    0.000    0.000    0.057    0.057 {built-in method builtins.exec}
#         1    0.000    0.000    0.057    0.057 <string>:1(<module>)
#         1    0.036    0.036    0.057    0.057 desempenho.py:7(calcular_tudo)
#     50000    0.020    0.000    0.020    0.000 {method 'get' of 'dict' objects}
#         1    0.000    0.000    0.000    0.000 {built-in method builtins.sorted}
```

Os tempos variam por máquina; o que importa é a proporção. Leia `cumtime` (tempo total incluindo chamadas internas) para achar a função culpada e `ncalls` para descobrir chamadas excessivas. No terminal: `python -m cProfile -s cumulative script.py`. Para visualizar, `snakeviz perfil.out` abre um gráfico interativo no navegador.

## Escolhendo a estrutura

| Precisa de... | Use | Por quê |
|---|---|---|
| Ordem e acesso por índice | `list` | `append`/índice O(1); `insert(0, x)` é O(n) |
| Testar pertencimento, eliminar duplicatas | `set` | `in`, `add`, `remove` O(1) |
| Associar chave a valor | `dict` | O(1) médio; mantém ordem de inserção |
| Fila (tirar do início) | `collections.deque` | `popleft`/`appendleft` O(1); em list são O(n) |
| Contar ocorrências | `collections.Counter` | `most_common`, aritmética de contadores |
| Lista sempre ordenada | `bisect` | inserção O(log n) de busca + O(n) de deslocamento |
| Menor elemento repetidamente | `heapq` | `heappush`/`heappop` O(log n) |

```python
from collections import deque
import timeit

fila_list = list(range(100_000))
fila_deque = deque(range(100_000))
print(timeit.timeit(lambda: fila_list.pop(0), number=10_000))     # ~0.4    (desloca tudo)
print(timeit.timeit(lambda: fila_deque.popleft(), number=10_000)) # ~0.002
```

## Memoização com lru_cache

Funções **puras** (mesma entrada, mesma saída) chamadas repetidamente com os mesmos argumentos podem guardar os resultados. `functools.lru_cache` faz isso com um decorator.

```python
from functools import lru_cache
import time

@lru_cache(maxsize=None)
def fib(n):
    return n if n < 2 else fib(n - 1) + fib(n - 2)

inicio = time.perf_counter()
print(fib(80))                                 # 23416728348467685
print(f"{time.perf_counter() - inicio:.4f}s")  # 0.0001s (sem cache, levaria horas)
print(fib.cache_info())    # CacheInfo(hits=78, misses=81, maxsize=None, currsize=81)
```

Casos reais: consulta de alíquota por NCM (repete milhares de vezes), conversão de código de conta em descrição, chamadas a uma API para o mesmo CNPJ dentro da mesma execução. Os argumentos precisam ser **hashable** (nada de listas ou dicts). `maxsize` limita a memória; `functools.cache` é um atalho para `maxsize=None`.

## Geradores para economizar memória

Uma lista de 10 milhões de inteiros ocupa centenas de MB. Um gerador produz um item por vez e ocupa bytes.

```python
import sys

lista = [i * i for i in range(1_000_000)]
gerador = (i * i for i in range(1_000_000))
print(sys.getsizeof(lista))    # 8448728  (~8 MB só para os ponteiros)
print(sys.getsizeof(gerador))  # 200

print(sum(gerador))            # 333332833333500000 -> consumido em streaming
```

Em pipelines de arquivos grandes (ler linha, filtrar, transformar, gravar), encadeie geradores e nunca materialize a lista completa. `csv.reader`, arquivos abertos e `map`/`filter` já são preguiçosos; `itertools` completa o kit. Só converta em lista quando precisar de índice, tamanho ou múltiplas passagens.

`sys.getsizeof` mostra o tamanho **do objeto em si**, não do que ele referencia: para uma lista de strings ele conta os ponteiros, não as strings. Para medir memória total de um processo, use `tracemalloc` ou o `memory_profiler`.

## Quando sair do Python puro

Se, depois de usar a estrutura certa e remover trabalho desnecessário, o gargalo ainda é cálculo numérico sobre milhões de valores, o Python puro perdeu a batalha: cada `+` em um loop passa pelo interpretador. As saídas:

- **NumPy**: arrays homogêneos com operações vetorizadas em C. `valores * 1.06` sobre 10 milhões de floats roda em milissegundos. Pandas é construído sobre ele.
- **Cython / mypyc**: compilam Python anotado para C; ganhos de 10 a 100 vezes em loops numéricos.
- **Numba**: compila funções numéricas com um decorator (`@njit`), sem alterar o código.
- **Multiprocessing**: como visto no módulo anterior, para dividir cálculo entre núcleos.

```python
import numpy as np

valores = np.arange(10_000_000, dtype=np.float64)
corrigidos = valores * 1.06 + 10       # uma linha, sem loop, ~30 ms
print(corrigidos[:3])                  # [10.   11.06 12.12]
```

A ordem de tentativa é sempre: algoritmo e estrutura de dados, depois remover trabalho repetido (cache), depois bibliotecas vetorizadas, e só então paralelismo ou compilação. A maioria dos problemas de escritório termina no primeiro ou segundo passo.

## Armadilhas comuns

- **Otimizar sem medir**: você acelera a parte errada e deixa o código feio.
- **`in lista` dentro de loop**: converta para set antes.
- **`lista.insert(0, x)` / `pop(0)`** como fila: use `deque`.
- **Concatenar strings com `+=` em loop**: acumule em lista e `"".join`.
- **`lru_cache` em função com efeitos colaterais** ou com argumentos mutáveis.
- **Materializar listas gigantes** quando um gerador bastaria.
- **Confiar em `getsizeof` como memória total**: ele não segue referências.

## Na prática

Quase todo script de escritório que "ficou lento" cai em um de três casos: `in lista` dentro de um loop (troque por `set`), leitura do mesmo arquivo ou consulta à mesma API repetida a cada item (leia uma vez, ou `lru_cache`) e planilha inteira carregada na memória para processar linha a linha (gerador ou `csv.reader`). Antes de qualquer um deles, rode `python -m cProfile -s cumulative script.py` e olhe as três primeiras linhas: é lá que o tempo está.

## Resumo

- Meça antes: `timeit` para trechos pequenos, `cProfile`/`pstats` (coluna `cumtime`) para o programa inteiro.
- Big-O importa na prática: `in` em list é O(n), em set/dict é O(1); loops aninhados sobre a mesma coleção são O(n²).
- Estrutura certa resolve a maioria dos casos: set para pertencimento, dict para associação, deque para filas, Counter para contagem, heapq para prioridades.
- `lru_cache` memoriza funções puras com argumentos hashable; geradores processam em streaming e ocupam memória constante.
- Quando o gargalo é cálculo numérico pesado, vetorize com NumPy ou compile com Cython/Numba; paralelismo é o último recurso.
