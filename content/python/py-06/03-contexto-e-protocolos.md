# Gerenciadores de contexto e protocolos

Nesta lição você vai dominar dois pilares do Python idiomático: os **gerenciadores de contexto** (`with`), com `__enter__`/`__exit__` e as ferramentas do `contextlib`, e os **protocolos**, o conjunto de métodos especiais que faz um objeto se comportar como iterável, sequência ou hashable. Você fechará com as duas formas de formalizar protocolos: **ABCs** (herança nominal) e `typing.Protocol` (duck typing estrutural, verificável por ferramentas).

## Por que `with` existe

Toda vez que você abre um recurso (arquivo, conexão, trava, transação), precisa fechá-lo **mesmo que dê erro no meio**. Sem `with`, isso vira um `try/finally` repetido em todo lugar, e alguém sempre esquece. O `with` encapsula o par "preparar/limpar" no próprio objeto, garantindo a limpeza.

```python
# (supondo que dados.csv exista na pasta atual)
# sem with: fácil de errar
f = open("dados.csv")
try:
    conteudo = f.read()
finally:
    f.close()

# com with: a limpeza é garantida
with open("dados.csv") as f:
    conteudo = f.read()
```

Sob o capô, `with obj as x:` chama `x = obj.__enter__()`, executa o bloco e, ao sair (normalmente ou por exceção), chama `obj.__exit__(tipo, valor, traceback)`.

## Escrevendo um gerenciador com `__enter__`/`__exit__`

```python
import time

class Cronometro:
    def __init__(self, rotulo):
        self.rotulo = rotulo

    def __enter__(self):
        self.inicio = time.perf_counter()
        return self                      # o que vai para o "as"

    def __exit__(self, exc_type, exc, tb):
        self.duracao = time.perf_counter() - self.inicio
        print(f"{self.rotulo}: {self.duracao:.3f}s")
        return False                     # False = NÃO engole a exceção

with Cronometro("soma") as c:
    total = sum(range(1_000_000))
# soma: 0.021s
print(c.duracao > 0)    # True
```

Os três argumentos de `__exit__` descrevem a exceção que saiu do bloco (ou `None, None, None` se não houve). Se `__exit__` devolver `True`, a exceção é **suprimida**; qualquer outro valor a deixa propagar. Devolver `True` sem querer é um bug silencioso: engole erros que você precisava ver.

## `contextlib`: gerenciadores com menos código

### `@contextmanager`

Para a maioria dos casos, uma função geradora decorada é mais curta: tudo antes do `yield` é o `__enter__`, o valor do `yield` vai para o `as`, e tudo depois é o `__exit__`.

```python
from contextlib import contextmanager
import sqlite3

@contextmanager
def transacao(caminho):
    con = sqlite3.connect(caminho)
    try:
        yield con          # o bloco do with roda aqui
        con.commit()       # só se não houve exceção
    except Exception:
        con.rollback()
        raise              # propaga: não engolimos o erro
    finally:
        con.close()        # sempre

with transacao(":memory:") as con:
    con.execute("CREATE TABLE t (x)")
    con.execute("INSERT INTO t VALUES (1)")
```

O `try/finally` em volta do `yield` é essencial: sem ele, se o bloco lançar exceção, o código depois do `yield` nunca roda e o recurso vaza.

### `suppress`

Substitui o `try/except: pass` quando ignorar uma exceção específica é a intenção:

```python
from contextlib import suppress
import os

with suppress(FileNotFoundError):
    os.remove("temporario.xlsx")     # se não existir, segue a vida
```

### `ExitStack`

Quando o número de recursos é dinâmico (abrir N arquivos de uma lista), `ExitStack` empilha gerenciadores e fecha todos na ordem inversa:

```python
from contextlib import ExitStack

caminhos = ["jan.csv", "fev.csv", "mar.csv"]   # arquivos que existiriam na pasta
with ExitStack() as pilha:
    arquivos = [pilha.enter_context(open(c)) for c in caminhos]
    for f in arquivos:
        print(f.readline().strip())
# todos fechados aqui, mesmo que um open() do meio tenha falhado
```

`ExitStack` também aceita `pilha.callback(funcao, *args)` para registrar uma limpeza arbitrária, útil para desfazer passos de um processo em caso de erro.

Outros utilitários: `redirect_stdout` (captura `print` para um `StringIO`), `nullcontext` (um "with que não faz nada", para parâmetros opcionais) e `closing` (chama `.close()` em objetos que não implementam `with`).

## Protocolos: o que faz um objeto "ser" algo

Em Python, um objeto é iterável não porque herda de `Iterable`, mas porque **implementa os métodos certos**. Esse conjunto de métodos é um **protocolo**. O `for`, o `len()`, o `in`, o `[]` e o `hash()` só perguntam: "você tem o método?".

| Protocolo | Métodos | Habilita |
|---|---|---|
| Iterável | `__iter__` (ou `__getitem__` com índices 0,1,2...) | `for`, `list()`, desempacotamento |
| Iterador | `__iter__` + `__next__` | `next()` |
| Sized | `__len__` | `len()`, verdade/falsidade |
| Container | `__contains__` | `in` |
| Sequência | `__getitem__` + `__len__` | indexação, fatias, `reversed`, `in` por varredura |
| Hashable | `__hash__` + `__eq__` | chave de dict, elemento de set |
| Comparável | `__lt__`, `__eq__`... | `sorted`, `min`, `max` |

```python
class PlanoDeContas:
    def __init__(self, contas):
        self._contas = list(contas)          # lista de (codigo, descricao)

    def __len__(self):
        return len(self._contas)

    def __getitem__(self, i):
        return self._contas[i]              # aceita int E slice, de graça

    def __contains__(self, codigo):
        return any(c == codigo for c, _ in self._contas)

plano = PlanoDeContas([("1.1", "Caixa"), ("1.2", "Bancos"), ("2.1", "Fornecedores")])
print(len(plano))              # 3
print(plano[0])                # ('1.1', 'Caixa')
print(plano[-1])               # ('2.1', 'Fornecedores')
print(plano[:2])               # [('1.1', 'Caixa'), ('1.2', 'Bancos')]
print("1.2" in plano)          # True
for codigo, desc in plano:     # funciona: __getitem__ + IndexError ao final
    print(codigo, desc)
print(list(reversed(plano))[0])   # ('2.1', 'Fornecedores')
```

Com dois métodos, `PlanoDeContas` ganhou `for`, fatias, `reversed`, `in` e `len`. Isso é **duck typing**: se anda como pato e grasna como pato, é pato.

### Hashable e igualdade andam juntos

Se você define `__eq__`, o Python zera o `__hash__` automaticamente (a classe vira não-hashable), porque objetos iguais **precisam** ter o mesmo hash. Para usar como chave de dict, defina os dois sobre os mesmos campos, ou use `@dataclass(frozen=True)`, que faz isso por você.

```python
from dataclasses import dataclass

@dataclass(frozen=True)
class Conta:
    codigo: str

saldos = {Conta("1.1"): 100.0}
print(saldos[Conta("1.1")])   # 100.0 -> outra instância, mesmo hash e igualdade
```

## ABCs: protocolos com herança

O módulo `collections.abc` oferece classes-base abstratas (`Iterable`, `Sequence`, `Mapping`, `MutableMapping`...) com dois benefícios. Primeiro, `isinstance(obj, Iterable)` funciona até para classes que **não herdam** dela, porque a ABC verifica a presença de `__iter__` (`__subclasshook__`). Segundo, herdar de uma ABC lhe dá **métodos mixin** de graça: implemente `__getitem__` e `__len__` herdando de `Sequence` e receba `__contains__`, `__iter__`, `__reversed__`, `index` e `count` prontos.

```python
from collections.abc import Sequence, Iterable

class Historico(Sequence):
    def __init__(self, itens): self._itens = list(itens)
    def __getitem__(self, i): return self._itens[i]
    def __len__(self): return len(self._itens)

h = Historico([10, 20, 20, 30])
print(h.count(20), h.index(30), 30 in h)   # 2 3 True  -> vieram do mixin
print(isinstance(h, Iterable))             # True
print(isinstance([], Sequence), isinstance({}, Sequence))   # True False
```

Se você esquecer um método abstrato, a classe nem instancia: `TypeError: Can't instantiate abstract class`. Para suas próprias hierarquias, `abc.ABC` com `@abstractmethod` dá a mesma garantia.

## `typing.Protocol`: duck typing que o type checker entende

ABCs exigem herança (ou registro). `Protocol` descreve o formato e deixa qualquer objeto com aquele formato ser aceito, **sem herdar nada**, e ferramentas como mypy e pyright verificam isso estaticamente.

```python
from typing import Protocol, runtime_checkable

@runtime_checkable
class Exportavel(Protocol):
    def exportar(self, dados: list[dict]) -> str: ...

class CSV:
    def exportar(self, dados): return ";".join(d["conta"] for d in dados)

class JSON:
    def exportar(self, dados): return str(dados)

class Vazio:
    pass

def salvar(exp: Exportavel, dados):
    return exp.exportar(dados)

print(salvar(CSV(), [{"conta": "1.1"}, {"conta": "1.2"}]))   # 1.1;1.2
print(isinstance(JSON(), Exportavel), isinstance(Vazio(), Exportavel))   # True False
# mypy acusaria: salvar(Vazio(), []) -> "Vazio" não tem "exportar"
```

`CSV` e `JSON` nunca ouviram falar de `Exportavel`, e mesmo assim são aceitos. É o contrato ideal para **injeção de dependência**: a camada de aplicação declara `repo: Repositorio` (um Protocol com `salvar` e `buscar`), e você passa um `RepositorioSQLite` em produção e um `RepositorioMemoria` nos testes, nenhum dos dois herdando de nada. `@runtime_checkable` habilita `isinstance`, que confere só a **presença** dos métodos, não suas assinaturas.

## Armadilhas comuns

- **`__exit__` devolvendo `True`** por engano: exceções somem.
- **`@contextmanager` sem `try/finally`**: o recurso vaza quando o bloco falha.
- **Definir `__eq__` sem `__hash__`** e depois tentar usar o objeto como chave de dict.
- **`__getitem__` que não lança `IndexError`** no fim: o `for` baseado nele vira loop infinito.
- **Confundir ABC com Protocol**: ABC é "herdou de mim"; Protocol é "tem a minha cara".
- **`isinstance` com Protocol sem `@runtime_checkable`**: lança `TypeError`.

## Na prática

Dois usos imediatos: um gerenciador `transacao(con)` como o desta lição em volta de cada lançamento gravado no SQLite (ou grava tudo, ou nada), e um `Cronometro` para medir quanto cada etapa do fechamento leva, registrado no log. E, nos seus projetos em camadas, o `Repositorio` passa a ser um `Protocol`: a aplicação declara o que precisa, e o teste entrega uma classe em memória que nunca ouviu falar de SQLite.

## Resumo

- `with` chama `__enter__` e garante `__exit__`; devolver `True` em `__exit__` suprime a exceção, então devolva `False` por padrão.
- `contextlib`: `@contextmanager` (gerador com `yield` dentro de `try/finally`), `suppress`, `ExitStack` para recursos dinâmicos, `redirect_stdout`, `nullcontext`.
- Protocolos são conjuntos de métodos especiais: `__iter__`, `__len__`, `__getitem__`, `__contains__`, `__hash__`/`__eq__`; implementá-los dá ao objeto o comportamento nativo.
- ABCs (`collections.abc`, `abc.ABC`) formalizam por herança e fornecem mixins; `typing.Protocol` formaliza por estrutura, sem herança, verificável por mypy.
- Use Protocol para contratos de injeção de dependência: repositórios, exportadores, notificadores trocáveis entre produção e teste.
