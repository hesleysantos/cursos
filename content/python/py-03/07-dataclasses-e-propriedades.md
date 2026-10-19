# dataclasses e propriedades

Escrever `__init__`, `__repr__` e `__eq__` para toda classe é repetitivo. Nesta lição você vai conhecer o decorador `@dataclass`, que gera tudo isso automaticamente, e `@property`, que transforma métodos em atributos calculados com validação. Juntos, eles deixam a modelagem de dados (notas, lançamentos, funcionários) curta, segura e legível.

## O problema: classes "só de dados"

Uma classe `Lancamento` com data, conta, histórico e valor precisa de um `__init__` de quatro linhas, um `__repr__` para depurar e um `__eq__` para comparar. São umas 15 linhas de código mecânico, e qualquer campo novo exige mexer em três lugares. Esse tipo de classe é tão comum que o Python criou uma solução na biblioteca padrão.

## `@dataclass`

```python
from dataclasses import dataclass

@dataclass
class Lancamento:
    data: str
    conta: str
    historico: str
    valor: float


l1 = Lancamento("2026-03-02", "3.1.02", "Aluguel", -3500.0)
l2 = Lancamento("2026-03-02", "3.1.02", "Aluguel", -3500.0)
print(l1)          # Lancamento(data='2026-03-02', conta='3.1.02', historico='Aluguel', valor=-3500.0)
print(l1 == l2)    # True (compara campo a campo)
print(l1.valor)    # -3500.0
```

Em cinco linhas você ganhou `__init__`, `__repr__` e `__eq__` (os demais blocos desta lição reaproveitam esse `import`). Os campos são declarados com **anotações de tipo** (`data: str`): o `dataclass` lê essas anotações para saber quais atributos criar, na ordem em que aparecem. O Python **não** verifica os tipos em tempo de execução (`Lancamento(1, 2, 3, "x")` é aceito), mas as anotações documentam a intenção e permitem que ferramentas como o `mypy` (módulo 4) avisem erros.

### Valores padrão

```python
@dataclass
class Funcionario:
    nome: str
    salario: float
    departamento: str = "Geral"
    ativo: bool = True

f = Funcionario("Ana", 3000)
print(f)    # Funcionario(nome='Ana', salario=3000, departamento='Geral', ativo=True)
```

Como num `def`, campos com padrão vêm **depois** dos obrigatórios.

### `field()` para listas e configurações

Lembra da armadilha do atributo de classe mutável? O `dataclass` a proíbe explicitamente: `itens: list = []` dá `ValueError: mutable default`. A solução é `field(default_factory=list)`, que cria uma lista nova para cada instância:

```python
from dataclasses import dataclass, field

@dataclass
class NotaFiscal:
    numero: int
    cliente: str
    itens: list = field(default_factory=list)
    observacao: str = field(default="", repr=False)   # não aparece no repr

    def total(self):
        return round(sum(q * p for q, p in self.itens), 2)


nf = NotaFiscal(101, "Padaria")
nf.itens.append((2, 50.0))
nf.itens.append((1, 30.0))
print(nf.total())    # 130.0
print(nf)            # NotaFiscal(numero=101, cliente='Padaria', itens=[(2, 50.0), (1, 30.0)])
```

`field()` aceita ainda `compare=False` (ignora o campo no `==`) e `init=False` (campo calculado, não passado no construtor).

### `__post_init__`: validação e campos derivados

Para checar dados ou calcular um campo a partir de outros, defina `__post_init__`, que roda logo depois do `__init__` gerado:

```python
@dataclass
class Lancamento:
    data: str
    conta: str
    valor: float
    tipo: str = field(init=False)

    def __post_init__(self):
        if self.valor == 0:
            raise ValueError("Lançamento com valor zero não é permitido")
        self.tipo = "D" if self.valor < 0 else "C"


print(Lancamento("2026-03-02", "3.1.02", -3500.0).tipo)   # D
Lancamento("2026-03-02", "3.1.02", 0)
# ValueError: Lançamento com valor zero não é permitido
```

### `frozen=True`: objetos imutáveis

Dados que não devem mudar depois de criados (uma data de competência, uma alíquota, um CNPJ) ficam mais seguros com `frozen=True`. Tentar alterar lança erro, e o objeto passa a ter `__hash__`, podendo ser usado em conjuntos e como chave de dicionário:

```python
@dataclass(frozen=True)
class Competencia:
    ano: int
    mes: int

    def __str__(self):
        return f"{self.mes:02d}/{self.ano}"


c = Competencia(2026, 3)
print(c)                # 03/2026
fechadas = {Competencia(2026, 1), Competencia(2026, 2)}
print(Competencia(2026, 1) in fechadas)   # True
c.mes = 4
# dataclasses.FrozenInstanceError: cannot assign to field 'mes'
```

Outras opções do decorador: `order=True` gera `<`, `<=`, `>`, `>=` comparando os campos em ordem; `slots=True` (Python 3.10+) economiza memória quando há milhares de instâncias.

### Convertendo para dicionário

`dataclasses.asdict(obj)` devolve um dicionário, pronto para `json.dumps` ou `csv.DictWriter`:

```python
from dataclasses import asdict
import json

lanc = Lancamento("2026-03-02", "3.1.02", -3500.0)
print(asdict(lanc))   # {'data': '2026-03-02', 'conta': '3.1.02', 'valor': -3500.0, 'tipo': 'D'}
print(json.dumps(asdict(lanc)))
```

## `@property`: atributos calculados e protegidos

Às vezes você quer que algo pareça um atributo (`nf.total`) mas seja calculado na hora, ou quer validar o valor sempre que alguém o atribuir. `@property` resolve os dois casos.

### Getter: atributo calculado

```python
class Funcionario:
    def __init__(self, nome, salario):
        self.nome = nome
        self.salario = salario

    @property
    def fgts(self):
        return round(self.salario * 0.08, 2)


f = Funcionario("Ana", 3000)
print(f.fgts)        # 240.0  <- sem parênteses!
f.salario = 4000
print(f.fgts)        # 320.0  <- sempre atualizado
```

Se `fgts` fosse um atributo comum calculado no `__init__`, ele ficaria desatualizado ao mudar o salário. Como propriedade, é recalculado a cada acesso. E como não há *setter*, `f.fgts = 1` dá `AttributeError`: ninguém sobrescreve o FGTS por engano.

### Setter: validação na atribuição

```python
class Funcionario:
    def __init__(self, nome, salario):
        self.nome = nome
        self.salario = salario        # passa pelo setter abaixo!

    @property
    def salario(self):
        return self._salario

    @salario.setter
    def salario(self, valor):
        if valor < 1518.00:          # piso usado no exemplo; o mínimo real muda todo ano
            raise ValueError(f"Salário abaixo do mínimo: {valor}")
        self._salario = round(float(valor), 2)


f = Funcionario("Ana", 3000)
f.salario = 3500          # ok
f.salario = 500
# ValueError: Salário abaixo do mínimo: 500
```

A convenção: o dado real fica em `self._salario` (underscore indica "interno, não mexa direto"), e `salario` é a interface pública com validação. Repare que o `__init__` faz `self.salario = salario`, não `self._salario`: assim a validação roda também na criação.

### Propriedades em dataclasses

Dá para combinar: campos simples via `dataclass` e cálculos via `@property`:

```python
@dataclass
class ItemNota:
    descricao: str
    quantidade: int
    preco_unitario: float

    @property
    def total(self):
        return round(self.quantidade * self.preco_unitario, 2)


item = ItemNota("Pão francês (kg)", 10, 18.90)
print(item.total)   # 189.0
```

## Quando usar o quê

- **Classe comum**: quando o comportamento domina (muitos métodos, pouco dado).
- **`@dataclass`**: quando o dado domina (registros, linhas de CSV, respostas de API). É o padrão para "estruturas".
- **`frozen=True`**: valores que não mudam; chaves de dicionário; segurança.
- **`@property`**: campos derivados que devem estar sempre atualizados; validação ao atribuir; esconder a representação interna.
- **`namedtuple`** (módulo 4): tuplas com nomes; mais leve, menos recursos.

## Erros comuns

- **Esquecer a anotação de tipo**: `nome = "x"` sem `: str` vira atributo de classe, não campo da dataclass.
- **Campo mutável como padrão**: `itens: list = []` lança erro; use `field(default_factory=list)`.
- **Campo com padrão antes de campo obrigatório**: `TypeError: non-default argument 'valor' follows default argument` (a mensagem cita o nome do campo).
- **Chamar propriedade com parênteses**: `f.fgts()` dá `TypeError: 'float' object is not callable`.
- **No setter, gravar em `self.salario`** em vez de `self._salario`: chama o próprio setter infinitamente (`RecursionError`).
- **Esperar que `dataclass` valide tipos**: ela não valida; use `__post_init__` para isso.

## Na prática

Cada linha de um CSV de lançamentos vira uma `@dataclass` com `data`, `conta` e `valor`: o `__repr__` automático ajuda a depurar, o `__eq__` permite comparar com o esperado nos testes e `frozen=True` impede alterações acidentais. Validações de negócio (salário mínimo, valor diferente de zero) ficam em `@property` com setter ou em `__post_init__`.

## Resumo

- `@dataclass` gera `__init__`, `__repr__` e `__eq__` a partir de campos anotados (`nome: tipo = padrao`).
- Use `field(default_factory=list)` para listas/dicts padrão; `__post_init__` para validar e derivar campos; `asdict` para converter em dicionário.
- `frozen=True` torna o objeto imutável e *hashable*; `order=True` gera comparações.
- `@property` cria atributos calculados (acessados sem parênteses); `@nome.setter` valida atribuições e guarda o dado em `self._nome`.
- Dataclasses para dados, propriedades para cálculo e validação: juntos, menos código e menos bugs.
