# Iteradores, geradores e decorators

Esta lição abre o capô do `for` para mostrar o **protocolo de iteração**, apresenta os **geradores** (funções que produzem valores sob demanda e economizam memória) e reúne quatro recursos de funções que você vai encontrar em todo código Python profissional: `*args`/`**kwargs`, `lambda`, *closures* e **decorators**. Ao final, você escreverá um decorator `@cronometrar` que mede o tempo de qualquer função.

## O que o `for` faz por baixo dos panos

Quando você escreve `for x in lista:`, o Python executa, na prática:

```python
lista = [10, 20, 30]
it = iter(lista)          # pede um ITERADOR ao objeto (chama lista.__iter__())
print(next(it))           # 10   (chama it.__next__())
print(next(it))           # 20
print(next(it))           # 30
print(next(it))           # lança StopIteration  <- o for captura isso e encerra
```

Um objeto é **iterável** se tem `__iter__` (listas, strings, dicionários, arquivos, `range`). Um **iterador** é o objeto que tem `__next__` e lembra onde parou. A separação importa: a lista pode ser percorrida várias vezes (cada `iter()` cria um iterador novo), mas um iterador, uma vez esgotado, acabou.

```python
it = iter([1, 2])
print(list(it))    # [1, 2]
print(list(it))    # []  <- já consumido
```

É por isso que um arquivo aberto só pode ser lido uma vez com `for`, e `zip`, `map`, `enumerate` e `csv.reader` devolvem iteradores de uso único.

## Geradores: iteradores sem esforço

Escrever uma classe com `__iter__` e `__next__` é trabalhoso. Um **gerador** é uma função que usa `yield` em vez de `return`, e o Python monta o iterador para você:

```python
def competencias(ano):
    for mes in range(1, 13):
        yield f"{mes:02d}/{ano}"

g = competencias(2026)
print(type(g))          # <class 'generator'>
print(next(g))          # 01/2026
print(next(g))          # 02/2026
print(list(g))          # ['03/2026', ..., '12/2026']  (continua de onde parou)
```

Ao chamar `competencias(2026)`, **nada roda**: o Python devolve um objeto gerador. A cada `next()`, a função executa até o próximo `yield`, entrega o valor e **congela** no lugar, guardando todas as variáveis locais. No `next()` seguinte, continua da linha seguinte. Quando a função termina, lança `StopIteration`.

### Por que isso importa: memória

Compare duas formas de ler um extrato de 5 milhões de linhas:

```python
def ler_tudo(caminho):
    with open(caminho, encoding="utf-8") as f:
        return [linha.strip() for linha in f]      # 5 milhões de strings na RAM

def ler_aos_poucos(caminho):
    with open(caminho, encoding="utf-8") as f:
        for linha in f:
            yield linha.strip()                     # uma de cada vez

# Mesmo uso, consumo de memória completamente diferente
# (supondo que /tmp/extrato.txt exista):
for linha in ler_aos_poucos("/tmp/extrato.txt"):
    if "TARIFA" in linha:
        print(linha)
```

Geradores formam **pipelines**: cada estágio processa um item e passa adiante, sem listas intermediárias.

```python
def apenas_debitos(lancamentos):
    for valor in lancamentos:
        if valor < 0:
            yield valor

def em_reais(valores):
    for v in valores:
        yield f"R$ {abs(v):,.2f}"

dados = [100.0, -35.5, -1200.0, 50.0, -8.9]
for texto in em_reais(apenas_debitos(dados)):
    print(texto)
# R$ 35.50
# R$ 1,200.00
# R$ 8.90
```

### Expressões geradoras

É a *list comprehension* com parênteses em vez de colchetes. Não cria lista; produz os valores sob demanda:

```python
valores = [100.0, -35.5, -1200.0, 50.0, -8.9]
quadrados = (v * v for v in valores)        # gerador, nada calculado ainda
print(sum(v for v in valores if v < 0))     # -1244.4  (parênteses da função já servem)
print(any(v > 1000 for v in valores))       # False
print(max(abs(v) for v in valores))         # 1200.0
```

Regra: se você vai percorrer uma vez e só precisa do resultado agregado (`sum`, `max`, `any`, `",".join`), use expressão geradora. Se precisa indexar, percorrer duas vezes ou saber o `len`, use lista.

## `*args` e `**kwargs`

Uma função pode aceitar um número variável de argumentos. `*args` recebe os posicionais extras como **tupla**; `**kwargs` recebe os nomeados extras como **dicionário**:

```python
def somar_tudo(*valores):
    return round(sum(valores), 2)

print(somar_tudo(1.5, 2.5))            # 4.0
print(somar_tudo(10, 20, 30, 40))      # 100

def montar_lancamento(conta, **extras):
    reg = {"conta": conta}
    reg.update(extras)
    return reg

print(montar_lancamento("1.1.01", valor=500, historico="Venda"))
# {'conta': '1.1.01', 'valor': 500, 'historico': 'Venda'}
```

Os nomes `args` e `kwargs` são convenção; o que importa são os asteriscos. O operador funciona também na **chamada**, para desempacotar:

```python
def imposto(base, aliquota, deducao):
    return round(base * aliquota - deducao, 2)

parametros = (5000, 0.275, 896.0)
print(imposto(*parametros))                        # 479.0
config = {"aliquota": 0.275, "deducao": 896.0}
print(imposto(5000, **config))                     # 479.0
```

## `lambda`: funções anônimas de uma linha

`lambda parametros: expressao` cria uma função pequena sem nome. Serve para passar como argumento, principalmente em `key=`:

```python
notas = [("NF-3", 800.0), ("NF-1", 1500.0), ("NF-2", 120.0)]
print(sorted(notas, key=lambda n: n[1]))                 # ordena pelo valor
print(max(notas, key=lambda n: n[1]))                    # ('NF-1', 1500.0)
print(list(map(lambda n: round(n[1] * 1.1, 2), notas)))  # [880.0, 1650.0, 132.0]
```

Se a lambda não couber num olhar, escreva um `def` com nome.

## Closures: funções que lembram do contexto

Uma função definida dentro de outra "captura" as variáveis da função externa, mesmo depois que esta já retornou. Isso é uma **closure**:

```python
def criar_calculadora_imposto(aliquota):
    def calcular(valor):
        return round(valor * aliquota, 2)   # usa 'aliquota' da função externa
    return calcular

iss_5 = criar_calculadora_imposto(0.05)
iss_2 = criar_calculadora_imposto(0.02)
print(iss_5(1000), iss_2(1000))    # 50.0 20.0
```

Cada chamada a `criar_calculadora_imposto` gera uma função nova com a sua própria `aliquota` guardada. É o mecanismo que torna os decorators possíveis.

## Decorators: embrulhando funções

Um **decorator** é uma função que recebe uma função e devolve outra, geralmente acrescentando um comportamento (medir tempo, registrar log, verificar permissão, guardar cache). A sintaxe `@nome` em cima do `def` é só açúcar para `funcao = nome(funcao)`.

Vamos escrever o `@cronometrar`:

```python
import time
import functools

def cronometrar(func):
    @functools.wraps(func)              # preserva nome e docstring da função original
    def embrulho(*args, **kwargs):
        inicio = time.perf_counter()
        resultado = func(*args, **kwargs)   # chama a função de verdade
        duracao = time.perf_counter() - inicio
        print(f"{func.__name__} levou {duracao:.4f}s")
        return resultado
    return embrulho


@cronometrar
def somar_ate(n):
    return sum(range(n))

print(somar_ate(1_000_000))
# somar_ate levou 0.0213s   (o tempo varia de máquina para máquina)
# 499999500000
print(somar_ate.__name__)    # somar_ate  (graças ao functools.wraps)
```

Passo a passo: `@cronometrar` faz `somar_ate = cronometrar(somar_ate)`. Agora `somar_ate` aponta para `embrulho`, que guarda a função original em `func` (closure). Quando você chama `somar_ate(1_000_000)`, roda o `embrulho`: marca o tempo, chama a original com `*args, **kwargs` (para aceitar qualquer assinatura), imprime e devolve o resultado.

Outro exemplo, um decorator que registra chamadas:

```python
import functools

def registrar(func):
    @functools.wraps(func)
    def embrulho(*args, **kwargs):
        print(f"Chamando {func.__name__} com {args} {kwargs}")
        return func(*args, **kwargs)
    return embrulho

@registrar
def calcular_iss(valor, aliquota=0.05):
    return round(valor * aliquota, 2)

print(calcular_iss(1000, aliquota=0.03))
# Chamando calcular_iss com (1000,) {'aliquota': 0.03}
# 30.0
```

Você já usou decorators prontos: `@dataclass`, `@property`, `@classmethod`. No módulo 4 verá `@functools.lru_cache` e os do `pytest`.

## Erros comuns

- **Consumir o iterador duas vezes**: `len(list(g))` e depois `for x in g` acham o gerador vazio. Converta para lista uma vez se precisar reutilizar.
- **Esquecer que o gerador é preguiçoso**: chamar `competencias(2026)` sem iterar não executa nada; erros dentro dele só aparecem no primeiro `next()`.
- **Usar `return valor` em gerador esperando devolver**: `return` encerra o gerador; o valor vai parar dentro da `StopIteration`.
- **Decorator sem `return resultado`**: a função decorada passa a devolver `None`.
- **Decorator sem `*args, **kwargs`**: só funciona com funções de uma assinatura específica.
- **Esquecer `functools.wraps`**: `func.__name__` vira `embrulho` e o `help()` perde a docstring.

## Na prática

Extratos e arquivos fiscais podem ter milhões de linhas: um gerador que filtra uma linha por vez roda em qualquer máquina, enquanto a lista completa pode estourar a memória. Decorators como `@cronometrar` medem scripts agendados sem sujar a lógica.

## Resumo

- `for` chama `iter()` e `next()` até `StopIteration`; iteradores são de uso único.
- Funções com `yield` são geradores: produzem valores sob demanda, gastam pouca memória e encadeiam em pipelines. `(x for x in ...)` é a expressão geradora.
- `*args` junta posicionais em tupla, `**kwargs` junta nomeados em dict; na chamada, `*` e `**` desempacotam.
- `lambda` cria funções de uma expressão; closures guardam variáveis da função externa.
- Decorator = função que recebe e devolve função; `@nome` equivale a `f = nome(f)`. Use `*args, **kwargs`, devolva o resultado e aplique `functools.wraps`.
