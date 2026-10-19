# Testes automatizados

Você já testa seu código: roda, olha o resultado, confere na calculadora. O problema é que esse teste manual se perde no minuto seguinte. Nesta lição você vai transformar essas conferências em **testes automatizados** que rodam em segundos, quantas vezes quiser, com `unittest` (biblioteca padrão) e `pytest` (a ferramenta mais usada no mercado). Vai conhecer *fixtures*, parametrização, a prática de **TDD** e como organizar os testes de um projeto.

## Por que testar automaticamente?

Imagine a função que calcula o INSS da folha. Você a testou em janeiro e funcionou. Em março, mudou a faixa de alíquotas. Como garantir que os casos de janeiro continuam certos, que a mudança não quebrou o cálculo do teto, que o salário mínimo ainda é tratado? Reconferindo tudo na mão? Em um sistema com 50 funções, isso é inviável.

Um teste automatizado é um pedaço de código que chama a sua função com entradas conhecidas e **afirma** (`assert`) o resultado esperado. Se alguém mudar a função e quebrar um caso, o teste falha na hora. Testes são a rede de segurança que permite mexer no código sem medo.

## O `assert`, a peça fundamental

```python
def calcular_inss(salario: float) -> float:
    if salario <= 1518.00:
        return round(salario * 0.075, 2)
    if salario <= 2793.88:
        return round(salario * 0.09, 2)
    return round(salario * 0.12, 2)

assert calcular_inss(1000) == 75.0
assert calcular_inss(2000) == 180.0
assert calcular_inss(3000) == 360.0, "faixa de 12% errada"
print("tudo certo")
```

`assert condicao, "mensagem"` lança `AssertionError` quando a condição é falsa. Se o script chegar ao `print`, todos os testes passaram. É exatamente o mecanismo que o site deste curso usa para corrigir seus exercícios.

Esse estilo funciona para scripts pequenos, mas tem limitações: o primeiro erro interrompe tudo, não há relatório e não dá para rodar um teste isolado. Para isso existem os frameworks.

## `unittest`: na biblioteca padrão

```python
# test_inss.py
import unittest
from folha import calcular_inss

class TestINSS(unittest.TestCase):
    def test_primeira_faixa(self):
        self.assertEqual(calcular_inss(1000), 75.0)

    def test_segunda_faixa(self):
        self.assertEqual(calcular_inss(2000), 180.0)

    def test_salario_negativo_lanca_erro(self):
        with self.assertRaises(ValueError):
            calcular_inss(-1)

if __name__ == "__main__":
    unittest.main()
```

O `from folha import calcular_inss` supõe que a função está salva em `folha.py`, na mesma pasta. Rode com `python -m unittest test_inss.py` (ou `python test_inss.py`). Saída:

```
.F.
======================================================================
FAIL: test_salario_negativo_lanca_erro (test_inss.TestINSS.test_salario_negativo_lanca_erro)
----------------------------------------------------------------------
Traceback (most recent call last):
  ...
AssertionError: ValueError not raised

----------------------------------------------------------------------
Ran 3 tests in 0.001s

FAILED (failures=1)
```

Cada método que começa com `test_` é um teste independente (o `unittest` os executa em ordem alfabética, por isso o `F` aparece no meio). Os métodos `assertEqual`, `assertTrue`, `assertIn`, `assertAlmostEqual` (para floats) e `assertRaises` são as verificações. O relatório mostra quantos passaram e exatamente onde falhou. Nosso terceiro teste revelou que a função ainda não valida salários negativos: é hora de adicionar o `raise`.

## `pytest`: menos cerimônia, mais recursos

O `pytest` (instale com `pip install pytest`) descobre automaticamente arquivos `test_*.py` e funções `test_*`, e usa o `assert` puro do Python:

```python
# test_inss.py
import pytest
from folha import calcular_inss

def test_primeira_faixa():
    assert calcular_inss(1000) == 75.0

def test_segunda_faixa():
    assert calcular_inss(2000) == 180.0

def test_salario_negativo_lanca_erro():
    with pytest.raises(ValueError):
        calcular_inss(-1)
```

Rode com `pytest` na pasta do projeto:

```
$ pytest
============ test session starts ============
collected 3 items
test_inss.py ..F                       [100%]
================= FAILURES =================
____ test_salario_negativo_lanca_erro ____
    with pytest.raises(ValueError):
>       calcular_inss(-1)
E       Failed: DID NOT RAISE <class 'ValueError'>
======== 1 failed, 2 passed in 0.03s ========
```

Quando um `assert` falha, o `pytest` mostra os valores envolvidos (`assert 75.5 == 75.0`), o que `unittest` só faz com os métodos `assertX`. Por isso a maioria dos projetos novos usa `pytest`.

### Fixtures: preparando dados para vários testes

Uma *fixture* é uma função que prepara algo (um objeto, um arquivo, uma lista de lançamentos) e o entrega aos testes que pedirem por ela como parâmetro:

```python
# test_conciliacao.py (supõe o projeto do módulo 3 salvo em conciliacao.py)
import pytest
from datetime import date
from conciliacao import Movimento, conciliar

@pytest.fixture
def extrato():
    return [
        Movimento(date(2026, 3, 2), 1500.0, "PIX", "banco"),
        Movimento(date(2026, 3, 3), -45.9, "TARIFA", "banco"),
    ]

@pytest.fixture
def contabil():
    return [Movimento(date(2026, 3, 2), 1500.0, "NF 101", "contabil")]

def test_conciliados(extrato, contabil):
    c, sb, sc = conciliar(extrato, contabil)
    assert len(c) == 1

def test_sobra_no_banco(extrato, contabil):
    c, sb, sc = conciliar(extrato, contabil)
    assert sb[0].historico == "TARIFA"
```

Cada teste recebe uma cópia nova da fixture, então um teste não contamina o outro. O `pytest` traz fixtures prontas, como `tmp_path`, que entrega uma pasta temporária para testes que gravam arquivos:

```python
def test_gravar_relatorio(tmp_path):
    arquivo = tmp_path / "relatorio.txt"
    gravar_relatorio(arquivo, ["linha 1", "linha 2"])
    assert arquivo.read_text(encoding="utf-8").count("\n") == 2
```

### Parametrize: um teste, muitos casos

Em vez de copiar o mesmo teste para cada faixa do INSS, declare uma tabela de casos:

```python
@pytest.mark.parametrize("salario, esperado", [
    (1000, 75.0),
    (1518, 113.85),
    (2000, 180.0),
    (2793.88, 251.45),
    (3000, 360.0),
])
def test_faixas_inss(salario, esperado):
    assert calcular_inss(salario) == esperado
```

O `pytest` roda cinco testes, um por linha, e aponta exatamente qual caso falhou. Repare nos **limites de faixa** (1518 e 2793.88): é ali que os bugs se escondem.

## TDD: escrever o teste antes

*Test-Driven Development* inverte a ordem habitual:

1. **Vermelho**: escreva um teste para um comportamento que ainda não existe. Rode: ele falha.
2. **Verde**: escreva o mínimo de código para o teste passar.
3. **Refatore**: melhore o código mantendo os testes verdes.

Parece estranho no início, mas tem um efeito poderoso: você é obrigado a pensar em **como a função será usada** (nome, parâmetros, retorno) antes de pensar em como implementá-la. E termina com testes de graça. Para funções de cálculo tributário, onde as regras já estão escritas na lei, TDD é natural: cada faixa e cada exceção vira um teste antes de virar código.

## O que testar (e o que não)

- **Casos normais**: o salário de 3000 dá 360.
- **Limites**: exatamente 1518; 1518.01; zero.
- **Erros esperados**: negativo lança `ValueError`; string lança `TypeError`.
- **Casos reais que já deram problema**: toda vez que um bug aparecer em produção, escreva primeiro o teste que o reproduz. Ele nunca mais volta.

Não teste a biblioteca padrão (`assert sum([1, 2]) == 3` não ajuda) nem detalhes internos que mudam toda hora. Teste o **comportamento** visível da função.

## Organizando os testes

```
projeto/
  folha/
    __init__.py
    inss.py
    irrf.py
  tests/
    test_inss.py
    test_irrf.py
  pyproject.toml
```

Um arquivo de teste por módulo, nomes espelhados (`inss.py` -> `test_inss.py`), e nomes de teste que descrevem o comportamento: `test_salario_no_teto_usa_aliquota_maxima` é melhor que `test_3`. Rode `pytest` na raiz; o `-v` mostra cada teste, `-x` para no primeiro erro, `-k inss` roda só os que têm "inss" no nome.

## Erros comuns

- **Comparar floats com `==`** quando há arredondamento em cadeia: use `round()` dos dois lados ou `pytest.approx(0.3)`.
- **Testes que dependem da ordem** ou de um arquivo deixado por outro teste: cada teste deve preparar o que usa (fixtures e `tmp_path`).
- **Um único teste gigante** com 20 asserts: quando falha, você não sabe qual caso quebrou. Divida ou parametrize.
- **Testar só o caminho feliz**: os bugs moram nos limites e nos erros.
- **Esquecer de rodar os testes** antes de entregar. Crie o hábito de rodar `pytest` antes de cada commit; no módulo 5, com Git e GitHub, você verá como automatizar isso.

## Na prática

Toda regra tributária tem faixas e limites, e é neles que os bugs moram. Um `test_inss.py` com `parametrize` nos limites de cada faixa é a garantia de que a atualização anual da tabela não quebrou o cálculo; rode `pytest` antes de entregar qualquer script.

## Resumo

- `assert condicao, "mensagem"` é a base de todo teste; `AssertionError` indica falha.
- `unittest` vem com o Python (classes `TestCase`, métodos `test_*`, `assertEqual`, `assertRaises`); `pytest` usa funções simples e `assert` puro, com relatórios melhores.
- Fixtures preparam dados para vários testes; `tmp_path` dá uma pasta temporária; `@pytest.mark.parametrize` roda o mesmo teste com uma tabela de casos.
- TDD: teste vermelho, código verde, refatorar. Pense no uso antes da implementação.
- Teste casos normais, limites de faixa e erros esperados; nomeie os testes pelo comportamento e espelhe a estrutura dos módulos.
