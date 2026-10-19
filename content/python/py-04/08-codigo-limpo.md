# Código limpo

Código é lido muito mais do que escrito, e quem lê costuma ser você mesmo seis meses depois, sem lembrar de nada. Nesta lição você vai aprender as convenções da **PEP 8**, a escolher nomes, a escrever funções pequenas e docstrings úteis, a automatizar a formatação com `ruff` e `black`, a aplicar os princípios **DRY** e **KISS** e, principalmente, a **refatorar**: melhorar código existente sem mudar o que ele faz.

## Por que se importar com estilo?

Porque estilo é comunicação: o esforço gasto decifrando código mal formatado não foi gasto encontrando o bug. Em equipe, um padrão comum elimina discussões ("espaço ou tab?") e deixa o *diff* limpo.

## PEP 8: o guia de estilo oficial

A PEP 8 é o guia oficial de estilo do Python. Os pontos que mais importam:

- **Indentação**: 4 espaços, nunca tabs.
- **Linhas**: até 79 caracteres (muitos projetos adotam 88 ou 100; o importante é ter um limite).
- **Linhas em branco**: 2 entre funções e classes de nível superior; 1 entre métodos.
- **Imports**: no topo, um por linha, em três grupos separados por linha em branco: biblioteca padrão, pacotes de terceiros, módulos do projeto.
- **Espaços**: ao redor de operadores (`a = b + c`), depois de vírgulas, nunca dentro dos parênteses (`f(a, b)`, não `f( a,b )`). Exceção: argumentos nomeados e padrões, sem espaço (`f(x, aliquota=0.05)`).
- **Comparações**: `if ativo:` em vez de `if ativo == True:`; `if x is None:` em vez de `== None`; `if not lista:` em vez de `len(lista) == 0`.

### Nomes

| O quê | Convenção | Exemplo |
|-------|-----------|---------|
| variáveis e funções | `snake_case` | `valor_liquido`, `calcular_inss` |
| classes | `CapWords` (ou `CamelCase`) | `NotaFiscal`, `ErroContabil` |
| constantes | `MAIUSCULAS` | `ALIQUOTA_ISS`, `TETO_INSS` |
| interno/privado | `_prefixo` | `_salario`, `_validar` |
| módulos | `minusculas` curtas | `leitura.py`, `calculos.py` |

Mais importante que a convenção é o **conteúdo**: um nome deve dizer o que a coisa é ou faz, sem comentário:

```python
# Ruim (trechos ilustrativos)
d = 30
l = [x for x in lst if x[2] > 0]
def proc(a, b): ...

# Bom
dias_atraso = 30
lancamentos_credito = [lanc for lanc in lancamentos if lanc.valor > 0]
def calcular_juros_mora(valor, dias_atraso): ...
```

Funções são verbos (`calcular`, `ler`, `validar`, `gerar`); variáveis e classes são substantivos. Evite abreviações que só você entende (`vlr_tot_liq`), nomes genéricos (`dados`, `info`, `temp`, `resultado2`) e as letras `l`, `O` e `I` sozinhas, que a PEP 8 proíbe (confundem-se com `1` e `0`).

## Funções pequenas, uma responsabilidade

Uma função deve fazer **uma coisa** e caber na tela (15 a 25 linhas é um bom teto). Sinais de que ela cresceu demais: comentários separando "etapas" ou um nome com "e" ("ler_e_validar_e_salvar").

## Docstrings

A docstring é a string logo abaixo do `def` ou `class`. Ela aparece no `help()`, no autocompletar do editor e em geradores de documentação. Escreva **o que** a função faz, o que recebe e o que devolve, não **como** faz (isso é o código):

```python
def calcular_inss(salario: float) -> float:
    """Calcula a contribuição do empregado ao INSS pela tabela progressiva simplificada.

    Args:
        salario: salário bruto mensal em reais (deve ser >= 0).

    Returns:
        Valor da contribuição arredondado para 2 casas.

    Raises:
        ValueError: se o salário for negativo.
    """
```

Uma linha basta para funções óbvias: `"""Devolve o CNPJ só com dígitos."""`. Comentários (`#`) são para explicar **por que** algo foi feito de um jeito não óbvio ("# a Receita arredonda para baixo aqui"), nunca para repetir o código (`i += 1  # incrementa i`).

## Ferramentas: `ruff` e `black`

Duas ferramentas cuidam disso por você:

- **`black`**: formatador. Reescreve seu arquivo no estilo padrão (aspas duplas, vírgulas finais, quebras de linha). Sem opções, sem discussão: "qualquer cor, desde que seja preto".
- **`ruff`**: *linter* ultrarrápido que detecta problemas (import não usado, comparação com `None` errada, `except` nu, complexidade excessiva) e também formata (compatível com o `black`).

```
(.venv) $ pip install ruff
(.venv) $ ruff check .            # aponta problemas
folha.py:3:8: F401 [*] `os` imported but unused
folha.py:17:5: E722 Do not use bare `except`
(.venv) $ ruff check --fix .      # corrige o que for seguro
(.venv) $ ruff format .           # formata (como o black)
```

Configure no `pyproject.toml` (`[tool.ruff] line-length = 100`) e rode antes de cada commit; muitos editores rodam ao salvar. Assim a PEP 8 vira algo automático, não algo para decorar.

## DRY e KISS

**DRY** (*Don't Repeat Yourself*): cada regra de negócio deve existir em **um** lugar. Se a alíquota do ISS aparece em cinco arquivos, um dia alguém atualiza quatro. Repetição é o sinal mais claro de que falta uma função, uma constante ou uma classe.

**KISS** (*Keep It Simple*): a solução mais simples que resolve o problema é a melhor. Não crie uma hierarquia de classes para três tipos de desconto quando um dicionário resolve, nem adicione parâmetros "para o futuro": complexidade tem custo todo dia, e o futuro pode nunca chegar.

Os dois se equilibram: DRY em excesso gera abstrações confusas; KISS em excesso gera copiar e colar. Regra prática: na **terceira** repetição, extraia.

## Refatoração guiada: antes e depois

Refatorar é mudar a estrutura do código **sem mudar o comportamento**; os testes garantem que nada quebrou. Veja um trecho de script de fechamento, como costuma nascer:

### Antes

```python
import csv

def proc(f):
    r = csv.DictReader(open(f, encoding="utf-8"), delimiter=";")
    t = 0
    d = 0
    c = 0
    for x in r:
        v = float(x["valor"].replace(".", "").replace(",", "."))
        t = t + v
        if v < 0:
            d = d + v
        else:
            c = c + v
    print("Total: " + str(round(t, 2)))
    print("Debitos: " + str(round(d, 2)))
    print("Creditos: " + str(round(c, 2)))
    if round(t, 2) != round(c + d, 2):
        print("ERRO")
    return t
```

Problemas: nomes de uma letra; arquivo aberto sem `with`; conversão de valor embutida no laço (não reaproveitável, e falharia com "1500.00"); cálculo misturado com impressão (impossível testar sem capturar a tela); verificação final que imprime "ERRO" e segue; sem docstring nem tipos.

### Depois

```python
import csv
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class Resumo:
    """Totais de um arquivo de lançamentos."""
    total: float
    debitos: float
    creditos: float


def converter_valor(texto: str) -> float:
    """Converte '1.234,56' ou '1234.56' em float."""
    limpo = texto.strip()
    if "," in limpo:
        limpo = limpo.replace(".", "").replace(",", ".")
    return float(limpo)


def ler_valores(caminho: Path) -> list[float]:
    """Lê a coluna 'valor' de um CSV separado por ponto e vírgula."""
    with open(caminho, encoding="utf-8", newline="") as f:
        return [converter_valor(reg["valor"]) for reg in csv.DictReader(f, delimiter=";")]


def resumir(valores: list[float]) -> Resumo:
    """Calcula total, débitos e créditos de uma lista de valores."""
    debitos = round(sum(v for v in valores if v < 0), 2)
    creditos = round(sum(v for v in valores if v >= 0), 2)
    return Resumo(total=round(debitos + creditos, 2), debitos=debitos, creditos=creditos)


def formatar_resumo(resumo: Resumo) -> str:
    return (
        f"Total:    {resumo.total:>12,.2f}\n"
        f"Débitos:  {resumo.debitos:>12,.2f}\n"
        f"Créditos: {resumo.creditos:>12,.2f}"
    )


if __name__ == "__main__":
    print(formatar_resumo(resumir(ler_valores(Path("/tmp/lancamentos.csv")))))
```

O que mudou: cada função faz uma coisa e tem nome que diz o quê; a conversão de valor virou função reutilizável (e corrigida); `resumir` é pura (recebe lista, devolve dataclass) e, por isso, trivial de testar: `assert resumir([100, -30]).debitos == -30`; a impressão ficou separada do cálculo; o arquivo é fechado pelo `with`; a verificação que imprimia "ERRO" sumiu porque, por construção, `total == debitos + creditos`. O código ficou mais longo, mas cada pedaço é menor, e isso é o que importa. (O bloco final só roda se `/tmp/lancamentos.csv` existir.)

### Refatorações que você fará o tempo todo

- **Extrair função**: um trecho com comentário "# calcula X" vira `def calcular_x()`.
- **Renomear**: `d` vira `debitos` (F2 no VS Code).
- **Substituir número mágico por constante**: `* 0.08` vira `* ALIQUOTA_FGTS`.
- **Separar cálculo de entrada/saída**: funções puras no meio, leitura e impressão nas bordas.
- **Trocar `if/elif` em cadeia por dicionário** quando é só um mapeamento de chave para valor.
- **Remover código morto**: funções não chamadas, `import` não usado, comentários com código antigo (o Git guarda o histórico).

## Erros comuns

- **Refatorar sem testes**: você não sabe se quebrou algo. Escreva ao menos um teste antes.
- **Refatorar e corrigir bug ao mesmo tempo**: se o teste falhar, não sabe qual mudança causou. Um commit para cada.
- **Comentar o óbvio** e não comentar o não óbvio.
- **Otimizar antes de medir**: código "esperto" e ilegível para ganhar milissegundos imperceptíveis.
- **Abstração prematura**: criar classe base, fábrica e configuração para um script de 40 linhas.

## Na prática

O script de fechamento com nomes de uma letra será relido daqui a seis meses, na atualização da tabela. Nomes claros, funções pequenas e `ruff` antes do commit fazem essa releitura levar minutos.

## Resumo

- PEP 8: 4 espaços, limite de linha, imports agrupados no topo, espaços ao redor de operadores, `is None`, `if not lista`.
- Nomes dizem o que a coisa é (`snake_case` para funções e variáveis, `CamelCase` para classes, `MAIUSCULAS` para constantes); funções pequenas com uma responsabilidade; docstrings dizem o quê, comentários dizem por quê.
- `ruff check --fix` e `ruff format` (ou `black`) automatizam estilo; rode antes de cada commit.
- DRY: regra de negócio em um só lugar; KISS: a solução mais simples que funciona. Extraia na terceira repetição.
- Refatore com testes, em passos pequenos, separando cálculo puro de leitura e impressão.
