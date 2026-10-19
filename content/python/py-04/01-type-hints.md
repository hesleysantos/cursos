# Type hints: anotações de tipo

Python é dinamicamente tipado: uma variável pode guardar um número agora e uma string depois, e o interpretador não reclama. Isso dá agilidade, mas esconde bugs até o momento da execução. Nesta lição você vai aprender a **anotar tipos** em funções, variáveis e classes, a usar o módulo `typing` para descrever estruturas mais ricas e a rodar verificadores como `mypy` e `pyright`, que encontram erros **antes** de o programa rodar.

## Por que vale a pena?

Veja esta função sem anotações:

```python
def calcular_juros(valor, dias, taxa):
    return valor * taxa * dias / 30
```

`valor` é float ou `Decimal`? `dias` é inteiro ou `timedelta`? `taxa` é 0.02 ou 2 (por cento)? Quem lê precisa adivinhar ou abrir o código de quem chama. Agora com anotações:

```python
def calcular_juros(valor: float, dias: int, taxa: float) -> float:
    return valor * taxa * dias / 30
```

Três ganhos imediatos:

1. **Documentação que não envelhece**: a assinatura diz o que a função espera e devolve.
2. **Autocompletar melhor**: o editor sabe que `valor` é float e sugere `.is_integer()`, não `.upper()`.
3. **Verificação estática**: ferramentas como `mypy` avisam quando você passa uma string onde era esperado um float, sem precisar executar.

Em um sistema contábil, onde um erro de tipo pode significar somar um CNPJ a um valor, isso é segurança barata.

> **Atenção:** o Python **não** verifica as anotações em tempo de execução. `calcular_juros("mil", 10, 0.02)` só vai falhar quando tentar multiplicar. As anotações são para pessoas e para ferramentas; a checagem é feita pelo `mypy`/`pyright`, não pelo interpretador.

## Sintaxe básica

```python
nome: str = "Ana"
salario: float = 3000.0
ativo: bool = True
dependentes: int = 2

def saudacao(nome: str, formal: bool = False) -> str:
    return f"Prezado(a) {nome}" if formal else f"Oi, {nome}"

def registrar(mensagem: str) -> None:    # não devolve nada
    print(mensagem)
```

A anotação vem depois de dois pontos; o tipo de retorno vem depois de `->`. `None` indica que a função não devolve valor.

## Coleções: `list[int]`, `dict[str, float]`, `tuple`, `set`

Desde o Python 3.9, as coleções embutidas aceitam parâmetros de tipo diretamente, sem importar nada:

```python
def media(valores: list[float]) -> float:
    return sum(valores) / len(valores)

def totais_por_conta(lancamentos: list[tuple[str, float]]) -> dict[str, float]:
    resultado: dict[str, float] = {}
    for conta, valor in lancamentos:
        resultado[conta] = resultado.get(conta, 0.0) + valor
    return resultado

cnpjs_vistos: set[str] = set()
coordenada: tuple[float, float] = (-10.9, -37.1)        # tupla de tamanho fixo
varios: tuple[int, ...] = (1, 2, 3, 4)                   # tupla de tamanho qualquer
```

`list[float]` lê-se "lista de floats"; `dict[str, float]` é "dicionário de str para float"; `tuple[str, float]` é "tupla com uma str e um float, nessa ordem".

## O módulo `typing`

Para casos além das coleções simples, importe do `typing`.

### `Optional` e `Union`: pode ser isso ou aquilo

```python
from typing import Optional, Union

def buscar_funcionario(cpf: str) -> Optional[dict]:
    # devolve o dicionário ou None se não achar
    ...

def formatar(valor: Union[int, float, str]) -> str:
    return f"{float(valor):,.2f}"
```

No Python 3.10+, há uma sintaxe mais curta com `|`: `dict | None` equivale a `Optional[dict]` e `int | float | str` equivale ao `Union`. Prefira a barra em código novo; `Optional`/`Union` ainda aparecem muito em código existente.

```python
def buscar_funcionario(cpf: str) -> dict | None: ...
def formatar(valor: int | float | str) -> str: ...
```

### `Callable`: funções como parâmetro

```python
from typing import Callable

def aplicar_em_todos(valores: list[float], funcao: Callable[[float], float]) -> list[float]:
    return [funcao(v) for v in valores]

print(aplicar_em_todos([100.0, 200.0], lambda v: round(v * 1.1, 2)))   # [110.0, 220.0]
```

`Callable[[float], float]` significa "algo chamável que recebe um float e devolve um float". Os tipos dos parâmetros vão na lista interna; o retorno, depois.

### `TypedDict`: dicionários com chaves conhecidas

Quando você usa dicionários como registros (muito comum ao ler JSON ou CSV), `TypedDict` descreve as chaves e os tipos de cada valor:

```python
from typing import TypedDict

class Lancamento(TypedDict):
    data: str
    conta: str
    valor: float

def total(lancamentos: list[Lancamento]) -> float:
    return round(sum(lanc["valor"] for lanc in lancamentos), 2)

dados: list[Lancamento] = [
    {"data": "2026-03-01", "conta": "1.1.01", "valor": 1500.0},
    {"data": "2026-03-02", "conta": "3.1.02", "valor": -3500.0},
]
print(total(dados))   # -2000.0
```

Em tempo de execução, `Lancamento` é um dict comum. Mas o `mypy` vai reclamar se você escrever `lanc["vlaor"]` (chave inexistente) ou `{"data": 20260301, ...}` (tipo errado). Use `TypedDict` para dados que já chegam como dicionário; use `dataclass` quando você controla a criação dos objetos.

### `Protocol`: tipagem pelo comportamento

Às vezes você não quer exigir uma classe específica, só que o objeto **tenha certo método**. É o chamado *duck typing*, formalizado com `Protocol`:

```python
from typing import Protocol

class TemCusto(Protocol):
    def custo_total(self) -> float: ...

class CLT:
    def __init__(self, salario: float) -> None:
        self.salario = salario
    def custo_total(self) -> float:
        return self.salario * 1.28

class PJ:
    def __init__(self, valor: float) -> None:
        self.valor = valor
    def custo_total(self) -> float:
        return self.valor

def folha(colaboradores: list[TemCusto]) -> float:
    return round(sum(c.custo_total() for c in colaboradores), 2)

print(folha([CLT(3000), PJ(5000)]))   # 8840.0
```

`CLT` e `PJ` **não herdam** de `TemCusto`; basta terem o método `custo_total` com a assinatura certa. O verificador aceita qualquer objeto compatível. É a versão tipada do polimorfismo que você viu no módulo 3, sem obrigar a uma hierarquia de herança.

### Outros nomes úteis

- `Any`: qualquer coisa; desliga a verificação para aquele valor. Use com moderação.
- `Iterable[T]` e `Iterator[T]`: para funções que aceitam qualquer coisa percorrível ou devolvem geradores. Em código novo, importe-os de `collections.abc` (`from collections.abc import Iterable`); as versões do `typing` ainda funcionam, mas são consideradas antigas.
- `Literal["D", "C"]`: só aceita esses valores exatos.
- Apelidos de tipo: dê nome a um tipo complexo com a instrução `type` do Python 3.12: `type Extrato = list[tuple[str, float]]` (em versões anteriores, `Extrato: TypeAlias = list[tuple[str, float]]`).

## Anotando classes e dataclasses

Você já fez isso no módulo 3 sem perceber: os campos de uma `@dataclass` **são** anotações de tipo.

```python
from dataclasses import dataclass

@dataclass
class NotaFiscal:
    numero: int
    cliente: str
    valor: float
    itens: list[str]

    def iss(self, aliquota: float = 0.05) -> float:
        return round(self.valor * aliquota, 2)
```

## Rodando o verificador: `mypy` e `pyright`

Instale com `pip install mypy` (ou `pyright`, que é o motor do VS Code/Pylance) e rode na pasta do projeto:

```
$ mypy folha.py
folha.py:12: error: Argument 1 to "calcular_juros" has incompatible type "str"; expected "float"  [arg-type]
Found 1 error in 1 file (checked 1 source file)
```

O erro foi encontrado **sem executar** o programa. Em um script que roda uma vez por mês, isso significa descobrir o bug em março, não em abril. Algumas dicas:

- Comece anotando as **assinaturas das funções**; o `mypy` infere o resto.
- `mypy --strict` liga todas as verificações; é exigente, mas vale em projetos novos.
- Bibliotecas sem anotações geram avisos "missing stubs"; instale `types-nome` quando existir ou ignore com `# type: ignore` na linha.
- Não anote o óbvio: `x: int = 0` é redundante; `x = 0` já diz tudo ao verificador.

## Erros comuns

- **Esperar erro em tempo de execução**: anotações não validam; passe os dados por `isinstance` ou `__post_init__` se precisar checar de verdade.
- **Usar `list` sem parâmetro** (`def f(x: list)`): funciona, mas o verificador não sabe o que há dentro. Prefira `list[float]`.
- **`Optional` sem tratar o `None`**: se a função pode devolver `None`, quem chama precisa de um `if resultado is not None:`; o `mypy` cobra isso.
- **Misturar `Dict`/`List` do `typing` (maiúsculos) com `dict`/`list`**: os maiúsculos são do Python 3.8 e anteriores; em 3.12, use os minúsculos.
- **Anotar `-> None` e devolver valor** (ou o contrário): o verificador acusa; o interpretador não.

## Na prática

Em scripts de fechamento, anote pelo menos as funções que recebem dinheiro, datas e documentos: `def calcular_inss(salario: float) -> float` deixa claro que `"3.000,00"` (string) não serve ali. Rodar `mypy` antes de entregar custa segundos e pega o erro de tipo antes que ele vire um valor errado na folha.

## Resumo

- Anotações (`nome: tipo`, `-> retorno`) documentam, melhoram o autocompletar e permitem verificação estática; o Python não as valida ao executar.
- Coleções: `list[float]`, `dict[str, float]`, `tuple[str, int]`, `set[str]`; `X | None` para opcionais e `A | B` para união.
- `typing` traz `Callable` (funções), `TypedDict` (dicionários com chaves fixas), `Protocol` (tipagem por comportamento), `Any`, `Literal`.
- `mypy`/`pyright` encontram erros de tipo antes da execução; comece pelas assinaturas das funções.
- Em projetos de dados financeiros, tipos explícitos são a forma mais barata de evitar somar texto com número.
