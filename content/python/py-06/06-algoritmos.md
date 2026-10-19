# Algoritmos clássicos

Nesta lição você vai implementar e entender os algoritmos que aparecem em toda entrevista e em muito código real: busca linear e binária, os quatro algoritmos de ordenação clássicos (bubble, insertion, merge, quick), recursão e sua relação com a pilha, programação dinâmica nos problemas do troco e da mochila, e grafos com BFS e DFS. O objetivo não é substituir `sorted()` ou `bisect`, que já estão otimizados em C, mas desenvolver o raciocínio para reconhecer esses padrões nos seus próprios problemas.

## Por que estudar algoritmos que a biblioteca já traz

Três razões. Primeiro, **reconhecimento**: quando você sabe o que é busca binária, percebe que "achar a faixa de alíquota em uma tabela ordenada" é exatamente isso e usa `bisect` em vez de um `for`. Segundo, **análise**: entender por que merge sort é O(n log n) e bubble sort é O(n²) treina o olho para o custo do seu próprio código. Terceiro, **adaptação**: problemas reais raramente vêm no formato exato da biblioteca; saber o algoritmo permite ajustá-lo.

## Busca linear e binária

Busca linear percorre tudo: O(n), funciona em qualquer lista. Busca binária exige lista **ordenada** e corta o espaço pela metade a cada passo: O(log n). Em 1 milhão de itens, são 20 comparações contra 500 mil em média.

```python
def busca_linear(itens, alvo):
    for i, x in enumerate(itens):
        if x == alvo:
            return i
    return -1

def busca_binaria(itens, alvo):
    esq, dir_ = 0, len(itens) - 1
    while esq <= dir_:
        meio = (esq + dir_) // 2
        if itens[meio] == alvo:
            return meio
        if itens[meio] < alvo:
            esq = meio + 1
        else:
            dir_ = meio - 1
    return -1

faixas = [0, 180_000, 360_000, 720_000, 1_800_000, 3_600_000]   # limites do Simples
print(busca_binaria(faixas, 720_000))    # 3
print(busca_binaria(faixas, 100))        # -1

import bisect
receita = 500_000
print(bisect.bisect_right(faixas, receita))   # 3 -> receita cai na 3ª faixa
```

O `bisect` da biblioteca padrão devolve a **posição de inserção**, que é exatamente "em qual faixa esse valor cai". Esse é o uso prático mais comum em contabilidade: tabelas progressivas de IR, INSS, Simples Nacional.

## Ordenação

### Bubble sort e insertion sort: O(n²)

Bubble sort compara vizinhos e troca; depois de cada passagem, o maior "borbulha" para o fim. Insertion sort constrói a parte ordenada inserindo cada novo elemento na posição certa, como quem ordena cartas na mão. Ambos são O(n²), mas o insertion é bom para listas **quase ordenadas** (vira quase O(n)) e por isso aparece dentro de algoritmos híbridos como o Timsort do Python.

```python
def bubble_sort(itens):
    a = list(itens)
    n = len(a)
    for i in range(n):
        trocou = False
        for j in range(n - 1 - i):
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
                trocou = True
        if not trocou:          # já ordenado: para cedo
            break
    return a

def insertion_sort(itens):
    a = list(itens)
    for i in range(1, len(a)):
        chave = a[i]
        j = i - 1
        while j >= 0 and a[j] > chave:
            a[j + 1] = a[j]     # desloca para a direita
            j -= 1
        a[j + 1] = chave
    return a

print(bubble_sort([5, 1, 4, 2, 8]))      # [1, 2, 4, 5, 8]
print(insertion_sort([5, 1, 4, 2, 8]))   # [1, 2, 4, 5, 8]
```

### Merge sort: O(n log n), dividir para conquistar

Divide a lista ao meio, ordena cada metade recursivamente e **intercala** as duas metades ordenadas. É estável (mantém a ordem de elementos iguais) e tem desempenho garantido, ao custo de memória extra.

```python
def merge_sort(itens):
    if len(itens) <= 1:
        return list(itens)
    meio = len(itens) // 2
    esq = merge_sort(itens[:meio])
    dir_ = merge_sort(itens[meio:])
    return intercalar(esq, dir_)

def intercalar(a, b):
    resultado = []
    i = j = 0
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            resultado.append(a[i]); i += 1
        else:
            resultado.append(b[j]); j += 1
    resultado.extend(a[i:])
    resultado.extend(b[j:])
    return resultado

print(merge_sort([38, 27, 43, 3, 9, 82, 10]))   # [3, 9, 10, 27, 38, 43, 82]
```

A função `intercalar` é útil sozinha: juntar dois extratos já ordenados por data é exatamente isso, em O(n), sem reordenar tudo (`heapq.merge` faz o mesmo de forma preguiçosa).

### Quick sort: O(n log n) médio

Escolhe um **pivô**, separa menores e maiores, e ordena as partes recursivamente. Em média é o mais rápido dos clássicos; no pior caso (pivô sempre o menor, em lista já ordenada) degrada para O(n²), por isso implementações reais escolhem o pivô aleatoriamente ou pela mediana de três.

```python
def quick_sort(itens):
    if len(itens) <= 1:
        return list(itens)
    pivo = itens[len(itens) // 2]
    menores = [x for x in itens if x < pivo]
    iguais  = [x for x in itens if x == pivo]
    maiores = [x for x in itens if x > pivo]
    return quick_sort(menores) + iguais + quick_sort(maiores)

print(quick_sort([3, 6, 8, 10, 1, 2, 1]))   # [1, 1, 2, 3, 6, 8, 10]
```

Na prática, use `sorted(itens, key=...)`: o Timsort é O(n log n), estável e escrito em C. Mas agora você sabe o que ele faz e por que `key=` (chamada uma vez por elemento) é mais eficiente que uma função de comparação (`functools.cmp_to_key`, chamada a cada comparação).

## Recursão e a pilha

Toda chamada de função empilha um **quadro** (frame) com seus argumentos e variáveis locais. Recursão profunda empilha muitos quadros; o Python limita a cerca de 1000 (`sys.getrecursionlimit()`) e lança `RecursionError` além disso. Para profundidades grandes, converta em iteração com uma pilha explícita (uma lista com `append`/`pop`), que é exatamente o que a máquina faz por você.

```python
def somar_arvore(no):                       # recursivo: claro, limitado em profundidade
    return no["valor"] + sum(somar_arvore(f) for f in no.get("filhos", []))

def somar_arvore_iterativo(raiz):           # pilha explícita: sem limite
    total, pilha = 0, [raiz]
    while pilha:
        no = pilha.pop()
        total += no["valor"]
        pilha.extend(no.get("filhos", []))
    return total

plano = {"valor": 0, "filhos": [
    {"valor": 100, "filhos": [{"valor": 30}, {"valor": 70}]},
    {"valor": 50},
]}
print(somar_arvore(plano), somar_arvore_iterativo(plano))   # 250 250
```

Um plano de contas é uma árvore; somar saldos por grupo é percorrê-la. Recursão é a forma natural de expressar isso; a pilha explícita é o plano B quando a profundidade pode explodir.

## Programação dinâmica

Programação dinâmica (PD) resolve problemas que se decompõem em **subproblemas sobrepostos**: em vez de recalcular o mesmo subproblema mil vezes, guarda o resultado (memoização, de cima para baixo) ou constrói uma tabela (de baixo para cima). O `lru_cache` da lição anterior é PD de cima para baixo.

### Troco com o mínimo de moedas

```python
def troco_minimo(moedas, valor):
    INF = float("inf")
    dp = [0] + [INF] * valor                  # dp[v] = mínimo de moedas para v
    for v in range(1, valor + 1):
        for m in moedas:
            if m <= v and dp[v - m] + 1 < dp[v]:
                dp[v] = dp[v - m] + 1
    return dp[valor] if dp[valor] != INF else -1

print(troco_minimo([1, 5, 10, 25], 63))   # 6  (25+25+10+1+1+1)
print(troco_minimo([2], 3))               # -1 (impossível)
```

O algoritmo guloso (sempre pegar a maior moeda) funciona para o sistema de moedas brasileiro, mas falha em geral (moedas `[1, 3, 4]`, valor 6: guloso dá 4+1+1 = 3 moedas, ótimo é 3+3 = 2). A PD sempre acha o ótimo.

### Mochila 0/1

Dado um conjunto de itens com peso e valor e uma capacidade, escolher o subconjunto de maior valor que caiba. Em finanças, é "quais projetos aprovar com orçamento limitado" ou "quais notas pagar com o caixa disponível maximizando desconto".

```python
def mochila(itens, capacidade):
    """itens: lista de (peso, valor). Devolve o valor máximo."""
    dp = [0] * (capacidade + 1)
    for peso, valor in itens:
        for c in range(capacidade, peso - 1, -1):     # de trás para frente: cada item uma vez
            dp[c] = max(dp[c], dp[c - peso] + valor)
    return dp[capacidade]

projetos = [(3, 40), (4, 50), (2, 30), (5, 70)]    # (custo em mil, retorno em mil)
print(mochila(projetos, 7))    # 100  -> itens de custo 2 e 5 (30 + 70)
```

Percorrer a capacidade de trás para frente garante que cada item seja usado no máximo uma vez. O custo é O(n × capacidade), excelente quando a capacidade é um inteiro moderado.

## Grafos: BFS e DFS

Um grafo é um conjunto de nós ligados por arestas: cidades e estradas, empresas e participações societárias, contas e lançamentos entre elas. A representação mais simples é um dict de **listas de adjacência**.

**BFS** (busca em largura) usa uma **fila** e visita os nós por camadas de distância; encontra o caminho mais curto em número de arestas. **DFS** (busca em profundidade) usa uma **pilha** (ou recursão) e vai fundo antes de voltar; serve para detectar ciclos, componentes conexos e ordenação topológica.

```python
from collections import deque

grafo = {
    "Holding": ["Alfa", "Beta"],
    "Alfa": ["Gama"],
    "Beta": ["Gama", "Delta"],
    "Gama": [],
    "Delta": ["Alfa"],
}

def bfs(grafo, inicio):
    visitados, fila, ordem = {inicio}, deque([inicio]), []
    while fila:
        no = fila.popleft()
        ordem.append(no)
        for viz in grafo.get(no, []):
            if viz not in visitados:
                visitados.add(viz)
                fila.append(viz)
    return ordem

def dfs(grafo, inicio):
    visitados, pilha, ordem = set(), [inicio], []
    while pilha:
        no = pilha.pop()
        if no in visitados:
            continue
        visitados.add(no)
        ordem.append(no)
        pilha.extend(reversed(grafo.get(no, [])))   # reversed: visita na ordem natural
    return ordem

print(bfs(grafo, "Holding"))   # ['Holding', 'Alfa', 'Beta', 'Gama', 'Delta']
print(dfs(grafo, "Holding"))   # ['Holding', 'Alfa', 'Gama', 'Beta', 'Delta']
```

Trocar a fila (`popleft()`) pela pilha (`pop()`) é a diferença essencial entre os dois: fila dá largura, pilha dá profundidade. Para caminho mais curto com pesos (custo em reais, distância em km), o próximo passo é Dijkstra com `heapq`.

## Armadilhas comuns

- **Busca binária em lista não ordenada**: devolve lixo sem avisar.
- **Erro de limite** (`<` vs `<=`, `meio + 1`): teste com listas de 0, 1 e 2 elementos.
- **Recursão sem caso-base** ou profundidade acima de ~1000: `RecursionError`.
- **Mochila percorrendo a capacidade de frente para trás**: vira mochila ilimitada (cada item várias vezes).
- **Esquecer o conjunto de visitados** em grafos com ciclo: loop infinito.
- **Reimplementar `sorted`/`bisect`/`heapq` em produção**: use a biblioteca; implemente para aprender.

## Na prática

Na contabilidade esses algoritmos aparecem disfarçados: tabela progressiva de IR ou INSS é `bisect`; conciliar dois extratos ordenados por data é `intercalar`; plano de contas com grupos e subgrupos é uma árvore percorrida por recursão; participações societárias entre empresas de um grupo formam um grafo, e "quem controla quem, direta ou indiretamente" é um BFS. Quando reconhecer o padrão, use a versão da biblioteca; quando o problema não couber nela, você sabe adaptar.

## Resumo

- Busca binária é O(log n) em listas ordenadas; `bisect` resolve tabelas de faixas progressivas.
- Bubble/insertion são O(n²); merge/quick são O(n log n); `sorted` (Timsort) é a escolha em produção, e `intercalar` serve para juntar sequências já ordenadas.
- Recursão empilha quadros e tem limite; uma pilha explícita (`list`) a substitui quando a profundidade pode crescer.
- Programação dinâmica guarda resultados de subproblemas: troco mínimo e mochila 0/1 em O(n × capacidade).
- Grafos como dict de adjacência: BFS com `deque` (largura, caminho mais curto), DFS com pilha (profundidade, ciclos); sempre mantenha o conjunto de visitados.
