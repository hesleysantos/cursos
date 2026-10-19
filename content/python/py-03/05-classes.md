# Classes e objetos

Até aqui você representou uma nota fiscal como um dicionário e as operações sobre ela como funções soltas. Funciona, mas à medida que o programa cresce os dados e as funções que os manipulam ficam espalhados. Nesta lição você vai aprender a juntar os dois em **classes**, criando os seus próprios tipos: `NotaFiscal`, `Funcionario`, `ContaContabil`. É a porta de entrada da programação orientada a objetos.

## Por que classes?

Pense num dicionário `{"numero": 101, "valor": 1500.0, "cliente": "Padaria"}` e numa função `calcular_iss(nota)`. Nada impede alguém de criar uma nota sem `valor`, ou com `valor` sendo uma string, ou de chamar `calcular_iss` passando um funcionário. Uma **classe** define um molde: toda `NotaFiscal` nasce com os mesmos campos e carrega consigo as operações que fazem sentido para ela. O código fica mais seguro, mais legível e mais fácil de testar.

Vocabulário:

- **Classe**: o molde, a definição (`NotaFiscal`).
- **Objeto** ou **instância**: um exemplar concreto criado a partir do molde (a nota 101).
- **Atributo**: um dado guardado no objeto (`nota.valor`).
- **Método**: uma função definida dentro da classe, que opera sobre o objeto (`nota.calcular_iss()`).

Você já usa objetos o tempo todo: `"abc".upper()`, `lista.append(1)`, `data.strftime(...)`. Strings e listas são classes embutidas do Python; `date` é uma classe da biblioteca padrão.

## Definindo uma classe

```python
class NotaFiscal:
    def __init__(self, numero, cliente, valor):
        self.numero = numero
        self.cliente = cliente
        self.valor = valor

    def iss(self, aliquota=0.05):
        return round(self.valor * aliquota, 2)

    def liquido(self):
        return round(self.valor - self.iss(), 2)


nf = NotaFiscal(101, "Padaria Pão Quente", 1500.00)
print(nf.cliente)      # Padaria Pão Quente
print(nf.iss())        # 75.0
print(nf.liquido())    # 1425.0
```

Vamos destrinchar:

- `class NotaFiscal:` abre a definição. Por convenção, nomes de classe usam `CapWords` (cada palavra com inicial maiúscula, sem underscore; muita gente chama de `CamelCase`).
- `__init__` é o **construtor**: roda automaticamente quando você escreve `NotaFiscal(101, ...)`. Ele recebe os argumentos e os guarda no objeto.
- `self` é o próprio objeto que está sendo criado ou usado. Dentro da classe, `self.valor` é "o valor **desta** nota". O Python passa `self` automaticamente: você escreve `nf.iss()`, e o Python executa `NotaFiscal.iss(nf)`.
- `self.numero = numero` cria um **atributo de instância**. Cada nota tem o seu.

> **Atenção:** esquecer o `self` como primeiro parâmetro de um método é o erro mais comum de iniciantes. O sintoma é `TypeError: iss() takes 0 positional arguments but 1 was given`: o Python tentou passar o objeto e não havia onde colocá-lo.

## Cada objeto tem seu estado

Os blocos seguintes continuam usando a classe `NotaFiscal` definida acima.

```python
nf1 = NotaFiscal(101, "Padaria", 1500.0)
nf2 = NotaFiscal(102, "Oficina", 800.0)
nf1.valor = 2000.0          # altera só a nf1
print(nf1.valor, nf2.valor)  # 2000.0 800.0
print(nf1 is nf2)            # False: são objetos diferentes
```

Métodos podem alterar o estado do objeto. Um exemplo clássico é uma conta contábil que acumula lançamentos:

```python
class ContaContabil:
    def __init__(self, codigo, nome):
        self.codigo = codigo
        self.nome = nome
        self.lancamentos = []      # lista própria de cada conta

    def lancar(self, valor, historico=""):
        self.lancamentos.append((valor, historico))

    def saldo(self):
        return round(sum(v for v, _ in self.lancamentos), 2)


caixa = ContaContabil("1.1.01", "Caixa")
caixa.lancar(5000, "Abertura")
caixa.lancar(-1200.50, "Pagamento fornecedor")
print(caixa.saldo())            # 3799.5
print(len(caixa.lancamentos))   # 2
```

Repare que `self.lancamentos = []` está dentro do `__init__`. Isso garante que cada conta tenha a sua própria lista. Veremos daqui a pouco o que acontece quando alguém coloca a lista fora do `__init__`.

## `__str__` e `__repr__`: como o objeto aparece

Se você der `print(nf)`, verá algo como `<__main__.NotaFiscal object at 0x7f3a...>`. Pouco útil. Dois métodos especiais (chamados **dunder**, de *double underscore*) controlam a representação em texto:

```python
class NotaFiscal:
    def __init__(self, numero, cliente, valor):
        self.numero = numero
        self.cliente = cliente
        self.valor = valor

    def __str__(self):
        # Para humanos: usado por print() e str()
        return f"NF {self.numero} - {self.cliente} - R$ {self.valor:,.2f}"

    def __repr__(self):
        # Para programadores: usado no interpretador, em listas e no depurador
        return f"NotaFiscal({self.numero!r}, {self.cliente!r}, {self.valor!r})"


nf = NotaFiscal(101, "Padaria", 1500.0)
print(nf)            # NF 101 - Padaria - R$ 1,500.00
print([nf])          # [NotaFiscal(101, 'Padaria', 1500.0)]
print(repr(nf))      # NotaFiscal(101, 'Padaria', 1500.0)
```

Regra prática: `__repr__` deve, se possível, mostrar como recriar o objeto; `__str__` deve ser agradável de ler. Se definir só `__repr__`, o `print` o usa também. Definir pelo menos `__repr__` em toda classe sua economiza horas de depuração.

## Atributos de classe vs. atributos de instância

Um **atributo de instância** (`self.valor`) pertence a um objeto. Um **atributo de classe** é definido direto no corpo da classe e é **compartilhado** por todas as instâncias. Use-o para constantes e contadores:

```python
class Funcionario:
    ALIQUOTA_FGTS = 0.08          # atributo de classe: igual para todos
    total_cadastrados = 0         # contador compartilhado

    def __init__(self, nome, salario):
        self.nome = nome          # atributos de instância
        self.salario = salario
        Funcionario.total_cadastrados += 1

    def fgts(self):
        return round(self.salario * self.ALIQUOTA_FGTS, 2)


a = Funcionario("Ana", 3000)
b = Funcionario("Bruno", 4500)
print(a.fgts(), b.fgts())              # 240.0 360.0
print(Funcionario.total_cadastrados)   # 2
print(a.ALIQUOTA_FGTS is b.ALIQUOTA_FGTS)   # True: o mesmo objeto
```

Dentro de um método você acessa o atributo de classe por `self.ALIQUOTA_FGTS` (o Python procura primeiro na instância, depois na classe) ou por `Funcionario.ALIQUOTA_FGTS`.

### A armadilha do atributo de classe mutável

```python
class ContaErrada:
    lancamentos = []              # ERRADO: lista compartilhada por todos!

    def lancar(self, v):
        self.lancamentos.append(v)

c1 = ContaErrada()
c2 = ContaErrada()
c1.lancar(100)
print(c2.lancamentos)   # [100]  <- a c2 "ganhou" o lançamento da c1
```

Como a lista foi criada uma vez, no corpo da classe, todas as instâncias apontam para ela. Listas, dicionários e conjuntos que pertencem a cada objeto **devem** ser criados dentro do `__init__` com `self.`.

## Métodos que recebem outros objetos

Métodos podem receber outros objetos como parâmetros e trabalhar com eles:

```python
class Carteira:
    def __init__(self):
        self.notas = []

    def adicionar(self, nota):
        self.notas.append(nota)

    def total(self):
        return round(sum(n.valor for n in self.notas), 2)

    def maior(self):
        return max(self.notas, key=lambda n: n.valor)


c = Carteira()
c.adicionar(NotaFiscal(101, "Padaria", 1500.0))
c.adicionar(NotaFiscal(102, "Oficina", 800.0))
print(c.total())    # 2300.0
print(c.maior())    # NF 101 - Padaria - R$ 1,500.00
```

## Erros comuns

- **Esquecer `self`** na definição do método ou escrever `valor` em vez de `self.valor` dentro da classe (o Python acha que é uma variável local).
- **Esquecer os parênteses ao instanciar**: `nf = NotaFiscal` guarda a classe, não cria um objeto. `nf.valor` dá `AttributeError`.
- **Chamar o método sem parênteses**: `nf.iss` devolve o método em si, não o resultado. Compare `print(nf.iss)` com `print(nf.iss())`.
- **Atributo de classe mutável** (lista/dict fora do `__init__`) compartilhado sem querer.
- **`__init__` que devolve valor**: o construtor deve devolver `None`; `return algo` dentro dele dá `TypeError`.
- **Escrever `__init__` com um só underscore** de cada lado (`_init_`): o Python não reconhece e o construtor nunca roda.

## Na prática

Quando o mesmo dicionário de nota fiscal começa a circular por dez funções, é hora de virar classe: `NotaFiscal` garante que toda nota tem número, cliente e valor, e carrega `iss()` e `liquido()` consigo. O ganho aparece na manutenção: mudar a regra do ISS é mexer em um método, não caçar cinco funções soltas.

## Resumo

- `class Nome:` define um molde; `Nome(args)` cria uma instância, executando `__init__`.
- `self` é o próprio objeto; atributos de instância nascem com `self.atributo = valor` dentro do `__init__`.
- Métodos são funções da classe e recebem `self` como primeiro parâmetro.
- `__str__` define o texto amigável do `print`; `__repr__` define a representação técnica (defina pelo menos ele).
- Atributos de classe são compartilhados por todas as instâncias: bons para constantes, perigosos quando são listas ou dicionários.
