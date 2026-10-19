Nesta lição você vai aprender a estrutura de dados mais usada do Python: a **lista**. Vai criar listas, acessar e fatiar itens, adicionar e remover com `append`, `insert`, `remove` e `pop`, ordenar com `sort` e `sorted`, somar e achar extremos com `sum`, `min` e `max`, testar pertencimento com `in` e, por fim, entender a diferença crucial entre copiar uma lista e apenas apontar para ela.

## O que é uma lista

Uma lista é uma **coleção ordenada de valores**, escrita entre colchetes e separada por vírgulas. É a coluna de uma planilha: vários valores, numa ordem, que você pode percorrer, somar, ordenar.

```python
notas = [1200.00, 850.50, 300.00, 4500.00]
clientes = ["Padaria Central", "Oficina Souza"]
vazia = []
mista = ["NF 123", 1500.0, True, None]   # pode misturar tipos, mas evite
print(len(notas))
print(notas)
```

Saída:

```
4
[1200.0, 850.5, 300.0, 4500.0]
```

Diferente das strings, listas são **mutáveis**: você pode trocar, adicionar e remover itens depois de criadas. Isso é o que as torna úteis para acumular dados ao longo do programa.

## Indexar e fatiar

Funciona exatamente como em strings: índice começa em 0, negativo conta do fim, fatiamento exclui o fim.

```python
notas = [1200.00, 850.50, 300.00, 4500.00]
print(notas[0])
print(notas[-1])
print(notas[1:3])
print(notas[:2])
```

Saída:

```
1200.0
4500.0
[850.5, 300.0]
[1200.0, 850.5]
```

Como listas são mutáveis, dá para **atribuir** a uma posição:

```python
notas[1] = 900.00     # corrige a segunda nota
print(notas)
```

Saída:

```
[1200.0, 900.0, 300.0, 4500.0]
```

Acessar uma posição que não existe gera `IndexError: list index out of range`. Com 4 itens, os índices válidos são 0 a 3.

## Adicionar itens

### `append(item)`: no final

É o método mais usado. Você começa com uma lista vazia e vai enchendo:

```python
aprovadas = []
notas = [1200, 15000, 300, 22000]
for valor in notas:
    if valor > 10000:
        aprovadas.append(valor)
print(aprovadas)
```

Saída:

```
[15000, 22000]
```

### `insert(posição, item)`: em qualquer lugar

```python
fila = ["Oficina", "Mercado"]
fila.insert(0, "Padaria")      # entra na frente
print(fila)
```

Saída:

```
['Padaria', 'Oficina', 'Mercado']
```

### `extend(outra_lista)` e `+`

```python
janeiro = [100, 200]
fevereiro = [300]
janeiro.extend(fevereiro)      # modifica janeiro
print(janeiro)
tudo = janeiro + [400, 500]    # cria uma lista nova
print(tudo)
```

Saída:

```
[100, 200, 300]
[100, 200, 300, 400, 500]
```

> **Atenção:** `lista.append([1, 2])` adiciona a lista inteira como **um único item** (lista dentro de lista). Para juntar os itens, use `extend`.

## Remover itens

### `remove(valor)`: pelo valor

Remove a **primeira** ocorrência. Se não existir, `ValueError`.

```python
pendentes = ["NF 10", "NF 11", "NF 12"]
pendentes.remove("NF 11")
print(pendentes)
```

Saída:

```
['NF 10', 'NF 12']
```

### `pop(posição)`: pela posição, devolvendo o item

```python
fila = ["Padaria", "Oficina", "Mercado"]
atendido = fila.pop(0)       # tira o primeiro e devolve
print(atendido)
print(fila)
ultimo = fila.pop()          # sem argumento: tira o último
print(ultimo, fila)
```

Saída:

```
Padaria
['Oficina', 'Mercado']
Mercado ['Oficina']
```

`pop()` é a escolha quando você precisa **usar** o item removido. `del lista[i]` também remove por posição, mas sem devolver.

## Ordenar: `sort()` e `sorted()`

Aqui está uma diferença que vale a pena fixar:

- `lista.sort()` ordena **a própria lista** (no lugar) e devolve `None`.
- `sorted(lista)` devolve uma **lista nova** ordenada e deixa a original intacta.

```python
notas = [1200, 850, 4500, 300]
ordenada = sorted(notas)
print(ordenada)
print(notas)            # original não mudou

notas.sort()
print(notas)            # agora mudou

notas.sort(reverse=True)
print(notas)
```

Saída:

```
[300, 850, 1200, 4500]
[1200, 850, 4500, 300]
[300, 850, 1200, 4500]
[4500, 1200, 850, 300]
```

O erro clássico: `notas = notas.sort()`. Como `sort()` devolve `None`, você acaba de apagar sua lista. Use `notas.sort()` sozinho, ou `notas = sorted(notas)`.

Strings ordenam alfabeticamente (maiúsculas antes das minúsculas). Para ignorar isso: `sorted(nomes, key=str.lower)`. O parâmetro `key` será muito útil quando você tiver listas de dicionários.

`reversed(lista)` e `lista.reverse()` invertem a ordem sem ordenar.

## `sum`, `min`, `max`, `len`

Funções embutidas que operam em listas numéricas:

```python
notas = [1200, 850, 4500, 300]
print(sum(notas))
print(min(notas))
print(max(notas))
print(len(notas))
print(round(sum(notas) / len(notas), 2))   # média
```

Saída:

```
6850
300
4500
4
1712.5
```

`sum(notas)` substitui o laço acumulador inteiro. Use o laço quando precisar de lógica (somar só as pagas, por exemplo); use `sum` quando for só somar.

## `in`, `index` e `count`

```python
tipos = ["NFe", "NFSe", "CTe"]
print("NFSe" in tipos)
print("Recibo" in tipos)
print(tipos.index("CTe"))      # posição; ValueError se não existir
print([1, 2, 2, 3].count(2))
```

Saída:

```
True
False
2
2
```

`in` é a forma mais legível de verificar se algo está numa lista, e é o que você usará em condições: `if tipo in tipos_validos:`.

## Cópia versus referência: o ponto mais importante da lição

`b = a` nunca copia nada: faz o nome `b` apontar para o **mesmo objeto** que `a`. Com números e strings isso passa despercebido, porque eles são imutáveis — não há como alterar o valor "por dentro", e `b = b + 1` cria um número novo só para `b`. Com listas, que são **mutáveis**, a diferença aparece: `b.append(...)` altera a lista que os dois nomes compartilham, e a alteração feita por um nome aparece pelo outro.

```python
original = [100, 200, 300]
apelido = original          # NÃO é cópia
apelido.append(400)
print(original)
```

Saída:

```
[100, 200, 300, 400]
```

`original` mudou, mesmo que você só tenha mexido em `apelido`. Isso surpreende todo iniciante e é fonte de bugs difíceis de achar: você passa uma lista para uma função, a função altera, e a lista "lá fora" também muda.

Para copiar de verdade, use um destes:

```python
original = [100, 200, 300]
copia = original.copy()     # ou original[:] ou list(original)
copia.append(400)
print(original)
print(copia)
```

Saída:

```
[100, 200, 300]
[100, 200, 300, 400]
```

Como saber se dois nomes apontam para a mesma lista? O operador `is` compara identidade, enquanto `==` compara conteúdo:

```python
a = [1, 2]
b = a
c = a.copy()
print(a == c)     # mesmo conteúdo
print(a is b)     # mesmo objeto
print(a is c)     # objetos diferentes
```

Saída:

```
True
True
False
```

Cópias feitas com `copy()` são **rasas**: se a lista contém outras listas, as listas internas continuam compartilhadas. Para listas aninhadas use `copy.deepcopy()` do módulo `copy`. Em 90% dos casos a cópia rasa basta.

## Listas de listas

Uma tabela é uma lista de linhas, e cada linha é uma lista:

```python
folha = [
    ["Maria", 3500.00],
    ["João", 4200.00],
    ["Ana", 2900.00],
]
print(folha[1])          # linha inteira
print(folha[1][0])       # nome da segunda linha
print(folha[1][1])       # salário da segunda linha

total = 0
for nome, salario in folha:
    total += salario
print(f"Folha total: {total:.2f}")
```

Saída:

```
['João', 4200.0]
João
4200.0
Folha total: 10600.00
```

`for nome, salario in folha` desempacota cada linha nas duas variáveis. Vamos aprofundar isso na próxima lição, sobre tuplas.

## Na prática

As notas de um cliente, os CNPJs de uma carteira, as linhas de um extrato: tudo isso vira lista. O fluxo mais comum é começar com `[]`, fazer `append` a cada linha lida, e no final usar `sum`, `sorted` e `len` para o relatório. A lição sobre cópia e referência deixa de ser teórica no dia em que uma função "de conferência" ordena ou remove itens da lista de quem chamou: na dúvida, passe uma cópia ou devolva uma lista nova.

## Erros comuns

- **`lista = lista.sort()`**: apaga a lista, porque `sort()` devolve `None`.
- **`b = a` achando que copiou**: é o mesmo objeto. Use `a.copy()`.
- **Índice fora do alcance**: `lista[len(lista)]` não existe; o último é `lista[-1]` ou `lista[len(lista) - 1]`.
- **`remove` de item inexistente**: `ValueError`. Teste com `in` antes.
- **`append` de uma lista inteira** quando queria juntar: use `extend`.
- **Remover itens dentro do `for` que percorre a mesma lista**: pula elementos. Construa uma lista nova com os que ficam.
- **Esquecer que `sum` só funciona com números**: lista de strings dá `TypeError`.

## Resumo

- Lista é uma coleção ordenada e **mutável** entre colchetes; indexação e fatiamento funcionam como em strings e permitem atribuição.
- Adicionar: `append` (fim), `insert(pos, x)`, `extend`. Remover: `remove(valor)`, `pop(pos)` (devolve o item), `del`.
- `lista.sort()` ordena no lugar e devolve `None`; `sorted(lista)` devolve uma nova lista; `reverse=True` inverte.
- `sum`, `min`, `max`, `len` e `in` cobrem as perguntas mais comuns sobre uma lista.
- `b = a` **não copia** — os dois nomes apontam para a mesma lista; copie com `a.copy()` e compare identidade com `is`.
