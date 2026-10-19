# O modelo de dados do Python

Nesta lição você vai olhar por baixo do capô do Python: o que significa "tudo é objeto", a diferença entre `is` e `==`, por que mutabilidade causa bugs sutis, onde os atributos ficam guardados (`__dict__`), como `__slots__` economiza memória, o que são descritores (`__get__`/`__set__`) e a diferença entre `__getattr__` e `__getattribute__`. Esses detalhes explicam comportamentos que parecem mágicos, e são a base de bibliotecas como dataclasses, Django ORM e pytest.

## Tudo é objeto

Em Python, inteiros, strings, funções, classes e módulos são objetos: têm **identidade** (um endereço, visto com `id()`), **tipo** (`type()`) e **valor**. Uma variável não "contém" um objeto; ela é um **nome** ligado a ele. Isso muda a forma de pensar atribuição:

```python
a = [1, 2, 3]
b = a            # b aponta para o MESMO objeto
b.append(4)
print(a)         # [1, 2, 3, 4]  -> a "mudou" porque é o mesmo objeto
print(id(a) == id(b))   # True

def f(): pass
print(type(f), type(int), type(type))
# <class 'function'> <class 'type'> <class 'type'>
```

Até `int` é um objeto, e seu tipo é `type`. Funções têm atributos (`f.__name__`, `f.__doc__`) e podem receber novos (`f.contador = 0`). É por isso que decorators funcionam: funções são valores como qualquer outro.

## `is` versus `==`

`==` compara **valores** (chama `__eq__`); `is` compara **identidade** (mesmo objeto na memória).

```python
x = [1, 2]
y = [1, 2]
print(x == y)   # True  -> mesmo conteúdo
print(x is y)   # False -> objetos diferentes

n = None
print(n is None)   # True  -> a forma correta de testar None
```

Use `is` apenas para singletons: `None`, `True`, `False`, `Ellipsis`, e sentinelas que você mesmo criou. Para tudo o mais, `==`. Uma armadilha clássica: o CPython **reaproveita** inteiros pequenos (-5 a 256) e algumas strings, então `a = 100; b = 100; a is b` dá `True`, mas com `1000` pode dar `False`. Isso é detalhe de implementação; código que depende dele está errado.

## Mutabilidade

Objetos **imutáveis** (int, float, str, tuple, frozenset, bytes) não podem ser alterados depois de criados: toda "alteração" cria um objeto novo. **Mutáveis** (list, dict, set, a maioria das classes que você escreve) mudam no lugar.

```python
s = "abc"
t = s
s += "d"
print(s, t)          # abcd abc   -> s agora aponta para um novo objeto; t ficou no antigo

def adicionar(item, lista=[]):     # ERRO CLÁSSICO: padrão mutável
    lista.append(item)
    return lista

print(adicionar(1))   # [1]
print(adicionar(2))   # [1, 2]  -> a MESMA lista é reaproveitada entre chamadas
```

O valor padrão de um parâmetro é avaliado **uma vez**, na definição da função. Se for mutável, todas as chamadas compartilham o mesmo objeto. A correção é `lista=None` e `if lista is None: lista = []`. Essa regra também explica por que `dataclass` exige `field(default_factory=list)` para listas.

Outra consequência: só imutáveis podem ser chaves de dict ou elementos de set, porque o hash não pode mudar. Uma tupla contendo uma lista não é hashable.

Copiar exige cuidado: `copia = original[:]` ou `list(original)` faz **cópia rasa** (os elementos internos ainda são compartilhados); `copy.deepcopy` copia recursivamente.

## Onde moram os atributos: `__dict__`

Por padrão, cada instância guarda seus atributos em um dicionário chamado `__dict__`. É literalmente um dict: você pode ler, adicionar e remover chaves.

```python
class Conta:
    taxa = 0.01                 # atributo de CLASSE

    def __init__(self, titular, saldo):
        self.titular = titular  # atributos de INSTÂNCIA
        self.saldo = saldo

c = Conta("Ana", 1000)
print(c.__dict__)           # {'titular': 'Ana', 'saldo': 1000}
print(Conta.__dict__["taxa"])   # 0.01
c.limite = 500              # cria um atributo novo, só nesta instância
print(c.__dict__)           # {'titular': 'Ana', 'saldo': 1000, 'limite': 500}
print(c.taxa)               # 0.01 -> não achou na instância, buscou na classe
```

A **busca de atributo** segue uma ordem: `__dict__` da instância, depois a classe, depois as classes-base (MRO). Isso explica por que `c.taxa = 0.02` cria um atributo de instância que "esconde" o da classe, sem alterar `Conta.taxa`. É também o motivo de `vars(obj)` e `getattr(obj, nome, padrao)` existirem: eles manipulam esse dicionário.

## `__slots__`: economia de memória e proteção

Um dict por instância custa memória (centenas de bytes) e tempo. Quando você vai criar milhões de objetos pequenos (um lançamento contábil, um ponto), `__slots__` troca o dict por um array fixo de referências.

```python
import sys

class LancamentoDict:
    def __init__(self, conta, valor):
        self.conta = conta
        self.valor = valor

class LancamentoSlots:
    __slots__ = ("conta", "valor")
    def __init__(self, conta, valor):
        self.conta = conta
        self.valor = valor

a = LancamentoDict("1.1", 10)
b = LancamentoSlots("1.1", 10)
print(sys.getsizeof(a) + sys.getsizeof(a.__dict__))   # ~ 48 + 296 bytes (varia por versão)
print(sys.getsizeof(b))                               # ~ 48 bytes

b.historico = "x"
# AttributeError: 'LancamentoSlots' object has no attribute 'historico'
```

Benefícios: menos memória, acesso um pouco mais rápido e proteção contra erros de digitação (`b.vlaor = 5` falha em vez de criar um atributo fantasma). Custos: não há `__dict__` (a menos que você o inclua nos slots), herança exige slots em todas as classes da cadeia, e `dataclass(slots=True)` já faz isso por você no Python 3.10+.

## Descritores: a mágica por trás de `property`

Um **descritor** é qualquer objeto que define `__get__`, `__set__` ou `__delete__` e é colocado como atributo **de classe**. Quando você acessa `instancia.atributo`, o Python percebe que o atributo da classe é um descritor e chama seu `__get__` em vez de devolver o objeto. `property`, métodos, `classmethod` e `staticmethod` são todos descritores.

O uso prático é **validação reutilizável**:

```python
class Positivo:
    def __set_name__(self, dono, nome):
        self.nome = "_" + nome          # onde guardar o valor na instância

    def __get__(self, obj, tipo=None):
        if obj is None:
            return self                 # acesso pela classe devolve o descritor
        return getattr(obj, self.nome)

    def __set__(self, obj, valor):
        if valor <= 0:
            raise ValueError(f"{self.nome[1:]} deve ser positivo, recebeu {valor}")
        setattr(obj, self.nome, valor)

class NotaFiscal:
    valor = Positivo()
    quantidade = Positivo()

    def __init__(self, valor, quantidade):
        self.valor = valor               # passa pelo __set__
        self.quantidade = quantidade

nf = NotaFiscal(1500.0, 3)
print(nf.valor)          # 1500.0
nf.quantidade = 0
# ValueError: quantidade deve ser positivo, recebeu 0
print(nf.__dict__)       # {'_valor': 1500.0, '_quantidade': 3}
```

Com `property` você escreveria a validação duas vezes (uma por atributo). Com um descritor, escreve uma vez e reutiliza em quantas classes quiser. `__set_name__` (Python 3.6+) informa ao descritor o nome do atributo em que ele foi colocado. Descritores com `__set__` são chamados **de dados** e têm prioridade sobre o `__dict__` da instância; os só com `__get__` (como métodos) são **não-dados** e perdem para o `__dict__`.

## `__getattr__` versus `__getattribute__`

São dois ganchos com nomes parecidos e papéis muito diferentes:

- `__getattribute__(self, nome)` é chamado para **todo** acesso a atributo. Sobrescrevê-lo é perigoso: qualquer `self.x` dentro dele chama a si mesmo e gera recursão infinita. Use `super().__getattribute__(nome)` e só quando realmente precisar interceptar tudo (proxies, logging de acesso).
- `__getattr__(self, nome)` é chamado **apenas quando a busca normal falha**. É o gancho ideal para atributos dinâmicos.

```python
class Config:
    def __init__(self, dados):
        self._dados = dados

    def __getattr__(self, nome):        # só roda se o atributo não existir
        try:
            return self._dados[nome]
        except KeyError:
            raise AttributeError(f"Config não tem '{nome}'") from None

cfg = Config({"api_url": "https://x", "timeout": 10})
print(cfg.api_url)    # https://x   -> veio pelo __getattr__
print(cfg._dados)     # {...}       -> atributo normal, __getattr__ nem é chamado
print(cfg.senha)
# AttributeError: Config não tem 'senha'
```

Repare no `raise AttributeError`: é obrigatório para que `hasattr(cfg, "senha")` devolva `False` e `getattr(cfg, "senha", None)` funcione. Devolver `None` em vez de lançar quebraria esses contratos.

## Armadilhas comuns

- **`is` para comparar valores** (`if x is 10`). Funciona por acaso com inteiros pequenos e quebra com outros.
- **Padrão mutável em parâmetro**: use `None` e crie dentro da função.
- **Cópia rasa achando que é profunda**: listas de listas, dicts de listas.
- **`__slots__` sem incluir `__weakref__`** quando precisar de referências fracas, ou esquecendo-o em subclasses.
- **Recursão infinita em `__getattribute__`** por acessar `self.algo` sem `super()`.
- **`__getattr__` que não lança `AttributeError`**: quebra `hasattr`, `getattr` com padrão e até `copy`/`pickle`.

## Na prática

Você vai usar isto menos para escrever descritores e mais para **ler** código alheio e diagnosticar bugs: o campo que "mudou sozinho" (duas variáveis apontando para a mesma lista), o `dataclass` que exige `default_factory`, o ORM em que `Cliente.nome` é um objeto coluna e `cliente.nome` é uma string (um descritor), o `AttributeError` estranho de um objeto com `__slots__`. Quando precisar validar o mesmo tipo de campo em várias classes (valores positivos, CNPJ com 14 dígitos), um descritor como `Positivo` evita repetir `property` em cada uma.

## Resumo

- Tudo é objeto com identidade, tipo e valor; variáveis são nomes ligados a objetos, e atribuição não copia.
- `is` compara identidade (use só para `None` e sentinelas); `==` compara valor.
- Imutáveis criam objetos novos ao "mudar"; mutáveis mudam no lugar; padrões mutáveis em parâmetros e cópias rasas são as duas armadilhas clássicas.
- Atributos de instância ficam em `__dict__`; `__slots__` troca o dict por um array fixo, economizando memória e barrando atributos errados.
- Descritores (`__get__`/`__set__`/`__set_name__`) são a base de `property` e permitem validação reutilizável; `__getattr__` só roda quando a busca falha e deve lançar `AttributeError`, enquanto `__getattribute__` intercepta tudo e exige `super()`.
