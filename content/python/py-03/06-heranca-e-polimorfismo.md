# Herança e polimorfismo

Na lição anterior você criou classes isoladas. Agora vai aprender a relacioná-las: fazer uma classe **herdar** o comportamento de outra, **sobrescrever** métodos, tratar objetos diferentes de forma uniforme (**polimorfismo**) e ensinar seus objetos a usar `==`, `<`, `len()` e `+` com os **métodos dunder**. Também vai ver quando herança é má ideia e a **composição** é melhor.

## Por que herança?

Imagine que o sistema tem funcionários CLT, estagiários e prestadores PJ. Todos têm nome, CPF e recebem um valor mensal. Mas o cálculo de encargos é diferente para cada um. Sem herança, você copiaria o código de nome/CPF três vezes; com herança, define uma classe base `Colaborador` com o que é comum e classes filhas com o que é específico.

```python
class Colaborador:
    def __init__(self, nome, cpf, valor_mensal):
        self.nome = nome
        self.cpf = cpf
        self.valor_mensal = valor_mensal

    def encargos(self):
        return 0.0

    def custo_total(self):
        return round(self.valor_mensal + self.encargos(), 2)

    def __repr__(self):
        return f"{type(self).__name__}({self.nome!r}, {self.valor_mensal})"


class CLT(Colaborador):
    def encargos(self):
        # FGTS 8% + INSS patronal 20% (simplificado)
        return round(self.valor_mensal * 0.28, 2)


class Estagiario(Colaborador):
    def __init__(self, nome, cpf, valor_mensal, instituicao):
        super().__init__(nome, cpf, valor_mensal)   # reaproveita o construtor da base
        self.instituicao = instituicao


class PJ(Colaborador):
    pass    # herda tudo sem mudar nada


equipe = [CLT("Ana", "111", 3000), Estagiario("Bia", "222", 1200, "UFS"), PJ("Caio", "333", 5000)]
for c in equipe:
    print(c, "->", c.custo_total())
# CLT('Ana', 3000) -> 3840.0
# Estagiario('Bia', 1200) -> 1200.0
# PJ('Caio', 5000) -> 5000.0
```

`class CLT(Colaborador):` diz que `CLT` **herda** de `Colaborador`: ganha `__init__`, `custo_total` e `__repr__` de graça. `CLT.encargos` **sobrescreve** a versão da base. `Estagiario` acrescenta um atributo, mas chama `super().__init__(...)` para não repetir a inicialização dos campos comuns.

## `super()`: estendendo em vez de substituir

`super()` devolve um atalho para a classe-mãe. Use-o quando quiser **acrescentar** comportamento, não trocar (os blocos desta lição continuam usando as classes definidas acima):

```python
class CLTComVale(CLT):
    def encargos(self):
        base = super().encargos()         # 28% calculado pela CLT
        return round(base + 220.00, 2)    # + vale-transporte fixo

print(CLTComVale("Dani", "444", 3000).custo_total())   # 4060.0
```

Sem `super()`, você teria de copiar a fórmula dos 28% e, no dia em que a alíquota mudasse, corrigir em dois lugares.

## Polimorfismo: o mesmo código para objetos diferentes

No laço `for c in equipe:` acima, chamamos `c.custo_total()` sem saber se `c` é CLT, estagiário ou PJ. Cada objeto responde do seu jeito. Isso é **polimorfismo** ("muitas formas"), e é o que torna a herança poderosa: o código que gera a folha não precisa de um `if tipo == "CLT"` para cada caso.

```python
def total_folha(colaboradores):
    return round(sum(c.custo_total() for c in colaboradores), 2)

print(total_folha(equipe))    # 10040.0
```

Se amanhã surgir `Aprendiz(Colaborador)`, `total_folha` continua funcionando sem alteração.

## `isinstance` e `type`

Para perguntar se um objeto é de certo tipo, use `isinstance`, que respeita a herança:

```python
ana = CLT("Ana", "111", 3000)
print(isinstance(ana, CLT))           # True
print(isinstance(ana, Colaborador))   # True: CLT é um Colaborador
print(type(ana) is Colaborador)       # False: type() olha só a classe exata
print(isinstance(ana, (PJ, Estagiario)))   # False (aceita tupla de tipos)
```

Use `isinstance` com parcimônia. Se você se vê escrevendo `if isinstance(c, CLT): ... elif isinstance(c, PJ): ...`, provavelmente deveria mover aquela lógica para um método sobrescrito em cada classe.

## Métodos dunder: ensinando operadores aos seus objetos

Os métodos com dois underscores conectam sua classe à sintaxe do Python. Vamos modelar um valor monetário:

```python
class Dinheiro:
    def __init__(self, centavos):
        self.centavos = int(centavos)

    @classmethod
    def de_reais(cls, valor):
        return cls(round(valor * 100))

    def __repr__(self):
        return f"R$ {self.centavos / 100:,.2f}"

    def __eq__(self, outro):            # ==
        return isinstance(outro, Dinheiro) and self.centavos == outro.centavos

    def __lt__(self, outro):            # <  (também habilita sorted e min/max)
        return self.centavos < outro.centavos

    def __add__(self, outro):           # +
        return Dinheiro(self.centavos + outro.centavos)

    def __hash__(self):                 # permite usar em set e como chave de dict
        return hash(self.centavos)


a = Dinheiro.de_reais(10.10)
b = Dinheiro.de_reais(20.20)
print(a + b)                 # R$ 30.30
print(a == Dinheiro(1010))   # True
print(a < b)                 # True
print(sorted([b, a]))        # [R$ 10.10, R$ 20.20]
print(sum([a, b], Dinheiro(0)))   # R$ 30.30
```

Guardar centavos como inteiro evita os erros de arredondamento do `float` (`0.1 + 0.2 != 0.3`), um cuidado essencial em sistemas financeiros.

Repare também no `@classmethod`: um método decorado assim recebe a **classe** (`cls`) em vez da instância, e por isso serve como construtor alternativo (`Dinheiro.de_reais(10.10)` cria o objeto a partir de reais, não de centavos). Como usa `cls(...)` em vez de `Dinheiro(...)`, continua funcionando em subclasses.

Outros dunders úteis:

```python
class Lote:
    def __init__(self, notas):
        self._notas = list(notas)

    def __len__(self):                  # len(lote)
        return len(self._notas)

    def __getitem__(self, i):           # lote[0], e também torna o objeto iterável
        return self._notas[i]

    def __contains__(self, nota):       # nota in lote
        return nota in self._notas


lote = Lote(["NF-1", "NF-2", "NF-3"])
print(len(lote))          # 3
print(lote[1])            # NF-2
print("NF-3" in lote)     # True
for n in lote:            # funciona graças ao __getitem__
    print(n, end=" ")     # NF-1 NF-2 NF-3
```

> **Dica:** se definir `__eq__`, defina `__hash__` também (ou aceite que o objeto deixe de ser *hashable*). Com `__eq__` e `__lt__` definidos, o decorador `functools.total_ordering` gera `<=`, `>` e `>=` automaticamente.

## Composição vs. herança

Herança expressa "**é um**": um CLT **é um** colaborador. Composição expressa "**tem um**": uma empresa **tem** colaboradores, uma nota **tem** itens. O erro clássico é usar herança onde a relação é "tem um":

```python
# RUIM: Empresa não é uma lista
class Empresa(list):
    pass

# BOM: Empresa tem uma lista
class Empresa:
    def __init__(self, razao_social):
        self.razao_social = razao_social
        self.colaboradores = []

    def contratar(self, c):
        self.colaboradores.append(c)

    def folha(self):
        return total_folha(self.colaboradores)
```

A composição é mais flexível: você escolhe exatamente quais operações expor, pode trocar a lista por outra estrutura sem quebrar quem usa a classe, e evita heranças profundas difíceis de entender. A recomendação geral é **preferir composição**; use herança quando houver uma relação "é um" clara e você realmente precisar de polimorfismo.

Um teste rápido para decidir: pergunte se faz sentido passar o objeto filho em qualquer lugar onde o pai é aceito. Um `CLT` pode entrar em qualquer função que espera um `Colaborador`? Sim, então herança cabe. Uma `Empresa` pode entrar em qualquer função que espera uma `list` (ser ordenada, fatiada, concatenada com outra lista)? Não faz o menor sentido, então composição.

## Quando sobrescrever e quando não

Nem todo método precisa ser sobrescrito nas filhas. A regra é simples: a classe base define o comportamento **padrão** e as filhas mudam apenas o que é diferente. No exemplo dos colaboradores, `custo_total` vive só na base, porque a fórmula "valor mensal mais encargos" vale para todos; o que varia é `encargos`, e é só isso que cada filha redefine. Esse padrão (um método geral na base que chama métodos específicos das filhas) é tão comum que tem nome: *template method*. Ele evita que a mesma lógica seja copiada em três classes e, quando a regra geral muda, você corrige em um único lugar.

Por outro lado, se você perceber que uma filha sobrescreve quase todos os métodos da base, é sinal de que a herança não está ajudando: as duas classes não compartilham comportamento de verdade, apenas um nome parecido.

## Erros comuns

- **Esquecer `super().__init__()`** na filha que define o próprio `__init__`: os atributos da base nunca são criados e aparece `AttributeError: 'Estagiario' object has no attribute 'nome'`.
- **Passar `self` para `super().__init__(self, ...)`**: no Python 3, `super()` já sabe quem é o objeto.
- **Sobrescrever com assinatura diferente** (a base aceita 2 argumentos, a filha 3) e quebrar o polimorfismo.
- **Definir `__eq__` sem `__hash__`** e descobrir que o objeto não entra mais em `set`.
- **Devolver `print` em vez de string no `__repr__`**: o método deve **retornar** uma `str`.
- **Herdar de `list`/`dict` para "ganhar" métodos**: quase sempre composição é melhor.

## Na prática

A folha de pagamento é o exemplo clássico: CLT, estagiário, PJ e aprendiz têm dados em comum e encargos diferentes. Uma classe base com `custo_total()` e filhas que só redefinem `encargos()` deixam o cálculo da folha em uma única função, que continua funcionando quando surge um tipo novo de contrato.

## Resumo

- `class Filha(Base):` herda atributos e métodos; a filha pode **sobrescrever** métodos e **estender** com `super()`.
- Polimorfismo: código que chama `obj.metodo()` funciona para qualquer subclasse sem `if`s.
- `isinstance(obj, Classe)` respeita a herança; `type(obj) is Classe` não.
- Dunders conectam sua classe aos operadores: `__eq__` (==), `__lt__` (<), `__add__` (+), `__len__`, `__getitem__`, `__contains__`, `__hash__`.
- Herança é "é um"; composição é "tem um". Na dúvida, prefira composição.
