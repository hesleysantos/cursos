Nesta lição você vai conhecer as **tuplas**, coleções parecidas com listas mas que não podem ser alteradas, e o **desempacotamento**, uma das sintaxes mais elegantes do Python para distribuir vários valores em várias variáveis de uma vez. Também vai entender quando faz sentido usar tupla em vez de lista — uma decisão que deixa o código mais seguro e mais claro.

## O que é uma tupla

Uma tupla é uma sequência **ordenada e imutável**, escrita entre parênteses:

```python
competencia = (10, 2026)
coordenada = (-10.91, -37.07)
registro = ("Maria", 3500.00, True)
print(competencia)
print(len(registro))
print(registro[0])
print(registro[-1])
```

Saída:

```
(10, 2026)
3
Maria
True
```

Indexar, fatiar, `len()`, `in`, percorrer com `for` — tudo funciona igual a lista. A diferença é que, depois de criada, **nada muda**:

```python
competencia = (10, 2026)
competencia[0] = 11
```

```
TypeError: 'tuple' object does not support item assignment
```

Também não existem `append`, `remove`, `sort` nem `pop`. Se você precisa de um valor diferente, cria uma tupla nova.

Na verdade, o que define a tupla é a **vírgula**, não o parêntese. `a = 10, 2026` já cria uma tupla; os parênteses servem para legibilidade e para evitar ambiguidades. Uma tupla de um único item precisa da vírgula: `(5,)` é tupla, `(5)` é só o número 5 entre parênteses.

```python
sozinho = (5,)
print(type(sozinho))
nao_e_tupla = (5)
print(type(nao_e_tupla))
```

Saída:

```
<class 'tuple'>
<class 'int'>
```

## Desempacotamento

Esta é a parte mais útil. Se uma tupla tem três itens, você pode distribuí-los em três variáveis numa única linha:

```python
registro = ("Maria", 3500.00, True)
nome, salario, ativo = registro
print(nome)
print(salario)
print(ativo)
```

Saída:

```
Maria
3500.0
True
```

O número de variáveis à esquerda tem que bater com o número de itens. Se não bater, `ValueError: too many values to unpack` ou `not enough values to unpack`.

O desempacotamento funciona com **qualquer sequência**, listas incluídas, e é por isso que `for nome, salario in folha:` funcionou na lição anterior: cada linha (uma lista de dois itens) é desempacotada em `nome` e `salario`.

### Troca de variáveis

Em outras linguagens, trocar dois valores exige uma variável temporária. Em Python:

```python
a = 10
b = 20
a, b = b, a
print(a, b)
```

Saída:

```
20 10
```

O lado direito cria a tupla `(20, 10)` **antes** da atribuição, então não há sobreposição.

### Múltiplos retornos de função

Uma função só pode devolver um valor — mas esse valor pode ser uma tupla. É assim que funções "devolvem duas coisas":

```python
def dividir_com_resto(a, b):
    return a // b, a % b

quociente, resto = dividir_com_resto(1000, 350)
print(f"{quociente} parcelas de 350, sobram {resto}")
```

Saída:

```
2 parcelas de 350, sobram 300
```

Um caso contábil: separar um valor em reais e centavos inteiros.

```python
def reais_e_centavos(valor):
    centavos_total = round(valor * 100)
    return centavos_total // 100, centavos_total % 100

reais, centavos = reais_e_centavos(1250.90)
print(reais, centavos)
```

Saída:

```
1250 90
```

### `enumerate` e `zip` entregam tuplas

Agora fica claro por que `for i, nome in enumerate(lista)` tem duas variáveis: `enumerate` produz tuplas `(0, item)`, `(1, item)`..., que são desempacotadas a cada volta. O mesmo vale para `zip`:

```python
meses = ["Jan", "Fev", "Mar"]
receitas = [45000, 38000, 51000]
for mes, receita in zip(meses, receitas):
    print(f"{mes}: {receita:>8,}")
```

Saída:

```
Jan:   45,000
Fev:   38,000
Mar:   51,000
```

### Desempacotamento com `*`

Quando você quer "os primeiros e o resto":

```python
linha = ["NF 4521", 1200.00, "pago", "boleto", "2026-10-05"]
numero, valor, *detalhes = linha
print(numero)
print(valor)
print(detalhes)

primeiro, *meio, ultimo = [1, 2, 3, 4, 5]
print(primeiro, meio, ultimo)
```

Saída:

```
NF 4521
1200.0
['pago', 'boleto', '2026-10-05']
1 [2, 3, 4] 5
```

A variável com `*` recebe uma **lista** com tudo que sobrou. Só pode haver um `*` por desempacotamento.

### Ignorando valores com `_`

Por convenção, `_` é "não me interessa":

```python
nome, _, ativo = ("Maria", 3500.00, True)
print(nome, ativo)
```

Saída:

```
Maria True
```

## Convertendo entre lista e tupla

```python
lista = [3, 1, 2]
tupla = tuple(lista)
print(tupla)
de_volta = list(tupla)
de_volta.append(4)
print(de_volta)
print(sorted(tupla))        # sorted sempre devolve lista
```

Saída:

```
(3, 1, 2)
[3, 1, 2, 4]
[1, 2, 3]
```

## Quando usar tupla e quando usar lista

A regra prática:

| Use **tupla** quando... | Use **lista** quando... |
|-------------------------|-------------------------|
| os itens formam um **registro** com posições de significado fixo: `(nome, salario, ativo)` | os itens são **do mesmo tipo** e a quantidade varia: `[1200, 850, 300]` |
| o conteúdo **não deve mudar** depois de criado: constantes, coordenadas, competência | você vai **adicionar, remover ou ordenar** |
| precisa usar como **chave de dicionário** (listas não servem, veremos adiante) | vai construir aos poucos com `append` |
| quer devolver vários valores de uma função | — |

Pense assim: uma lista é uma **coluna** da planilha (vários salários); uma tupla é uma **linha** (um funcionário com nome, salário e status). Uma tabela, portanto, costuma ser uma lista de tuplas:

```python
folha = [
    ("Maria", 3500.00, 2),
    ("João", 4200.00, 0),
    ("Ana", 2900.00, 1),
]
total = 0
for nome, salario, dependentes in folha:
    total += salario
    print(f"{nome:<8}{salario:>10.2f}  dep: {dependentes}")
print(f"{'Total':<8}{total:>10.2f}")
```

Saída:

```
Maria      3500.00  dep: 2
João       4200.00  dep: 0
Ana        2900.00  dep: 1
Total     10600.00
```

A imutabilidade é uma **proteção**: ao usar tupla você está dizendo "este registro não é para ser alterado por acidente". Se alguém tentar, o Python avisa com `TypeError` em vez de deixar o bug passar em silêncio. Isso é especialmente valioso para constantes como `FAIXAS_INSS = ((1518.00, 0.075), (2793.88, 0.09), ...)`.

Um detalhe importante: a tupla é imutável, mas se ela contiver uma **lista**, a lista interna continua mutável. `t = ([1, 2], 3)` permite `t[0].append(9)`. A tupla só garante que não se trocam os **itens** dela, não o conteúdo interno de cada item.

## Tuplas e desempenho

Tuplas ocupam um pouco menos de memória e são criadas um pouco mais rápido que listas. Para o tipo de programa deste curso isso não faz diferença perceptível — escolha pela **semântica** (registro fixo versus coleção variável), não pela velocidade.

## Na prática

Tuplas aparecem como registros pequenos que não devem mudar: `(cnpj, razao_social, regime)`, `(data, valor)` de um lançamento, `(mes, ano)` de uma competência. As tabelas fiscais ficam bem como tupla de tuplas no topo do arquivo (`FAIXAS_INSS = ((1518.00, 0.075), ...)`): ninguém altera por engano, e atualizar o ano é trocar os números num lugar só. E `return quociente, resto` é o jeito natural de uma função devolver "o imposto e a base" de uma vez.

## Erros comuns

- **Tentar alterar uma tupla**: `t[0] = 5` gera `TypeError`. Crie uma nova ou converta para lista.
- **Tupla de um item sem vírgula**: `(5)` é um inteiro. Escreva `(5,)`.
- **Número errado de variáveis** no desempacotamento: `a, b = (1, 2, 3)` gera `ValueError`. Conte os itens ou use `*resto`.
- **Achar que `sorted(tupla)` devolve tupla**: devolve lista. Use `tuple(sorted(t))` se precisar.
- **Usar lista para registros fixos**: funciona, mas perde a proteção e a clareza. `funcionario[1]` numa lista pode ser alterado por engano; numa tupla, não.
- **Esquecer que o `for` com duas variáveis exige itens de dois elementos**: `for a, b in [1, 2, 3]` gera `TypeError: cannot unpack non-iterable int`.

## Resumo

- Tupla é uma sequência ordenada e **imutável** definida pela vírgula (geralmente entre parênteses); tupla de um item é `(x,)`.
- Indexar, fatiar, `len`, `in` e `for` funcionam como em listas, mas não há `append`, `remove`, `sort`.
- Desempacotamento distribui itens em variáveis: `nome, salario = registro`; permite `a, b = b, a`, múltiplos retornos (`return x, y`) e `*resto` para capturar o que sobra.
- `enumerate` e `zip` produzem tuplas, por isso o `for` com duas variáveis funciona.
- Use tupla para registros com posições fixas e dados que não devem mudar; use lista para coleções homogêneas que crescem, encolhem ou são ordenadas.
