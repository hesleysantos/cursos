# Projeto guiado: CLI "fechamento mensal"

Este projeto reúne o módulo inteiro em uma ferramenta de trabalho: um programa de linha de comando que lê todos os CSVs de lançamentos de uma pasta, valida cada linha com expressões regulares, agrupa totais com `Counter` e `defaultdict`, registra tudo em log e vem acompanhado de testes automatizados. É o tipo de script que roda no primeiro dia útil do mês e entrega o resumo do fechamento sem intervenção manual.

## O problema

A pasta `lancamentos/2026-03/` recebe, ao longo do mês, vários arquivos exportados do sistema: `vendas.csv`, `compras.csv`, `despesas.csv`. Todos têm o mesmo formato:

```
data;documento;conta;historico;valor
02/03/2026;12.345.678/0001-90;1.1.02;Recebimento NF 101;1.500,00
03/03/2026;123.456.789-09;3.1.05;Reembolso funcionário;-45,90
05/03/2026;12.345.678/0001-90;2.1.01;Pagamento fornecedor;-820,45
```

O fechamento precisa: validar data, documento (CPF ou CNPJ formatados) e valor; totalizar por conta e por tipo (débito/crédito); contar quantos lançamentos cada documento tem; apontar as linhas inválidas; e gravar um log do processamento.

## Estrutura do projeto

```
fechamento/
├── pyproject.toml
├── src/fechamento/
│   ├── __init__.py
│   ├── validacao.py     <- regex e conversões
│   ├── processamento.py <- leitura, agrupamento
│   └── cli.py           <- argparse, logging, main
└── tests/
    ├── test_validacao.py
    └── test_processamento.py
```

## Passo 1: validação com regex (`validacao.py`)

```python
import re
from datetime import date

RE_DATA = re.compile(r"(\d{2})/(\d{2})/(\d{4})")
RE_CPF = re.compile(r"\d{3}\.\d{3}\.\d{3}-\d{2}")
RE_CNPJ = re.compile(r"\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}")
RE_VALOR = re.compile(r"-?\d{1,3}(?:\.\d{3})*,\d{2}|-?\d+,\d{2}")
RE_CONTA = re.compile(r"\d\.\d\.\d{2}")


class LinhaInvalida(ValueError):
    """Linha do CSV que não passou na validação."""


def validar_data(texto: str) -> date:
    m = RE_DATA.fullmatch(texto.strip())
    if not m:
        raise LinhaInvalida(f"data fora do padrão dd/mm/aaaa: {texto!r}")
    dia, mes, ano = (int(g) for g in m.groups())
    try:
        return date(ano, mes, dia)
    except ValueError:
        raise LinhaInvalida(f"data inexistente: {texto!r}") from None


def validar_documento(texto: str) -> str:
    t = texto.strip()
    if RE_CPF.fullmatch(t) or RE_CNPJ.fullmatch(t):
        return t
    raise LinhaInvalida(f"documento não é CPF nem CNPJ formatado: {texto!r}")


def validar_valor(texto: str) -> float:
    t = texto.strip()
    if not RE_VALOR.fullmatch(t):
        raise LinhaInvalida(f"valor fora do padrão 1.234,56: {texto!r}")
    return float(t.replace(".", "").replace(",", "."))


def validar_conta(texto: str) -> str:
    t = texto.strip()
    if not RE_CONTA.fullmatch(t):
        raise LinhaInvalida(f"conta fora do padrão 9.9.99: {texto!r}")
    return t
```

Cada função recebe texto, devolve o valor convertido e lança `LinhaInvalida` com mensagem específica. O `fullmatch` garante que não há lixo antes ou depois. Repare que `validar_data` usa a regex para o **formato** e o `date()` para a **existência** (31/02 passa na regex, mas não existe).

## Passo 2: leitura e agrupamento (`processamento.py`)

Os blocos dos passos 2 e 3 usam importações relativas (`from .validacao import ...`): eles só rodam como parte do pacote `fechamento`, depois de `pip install -e .`, não como arquivos soltos.

```python
import csv
import logging
from collections import Counter, defaultdict
from collections.abc import Iterable
from dataclasses import dataclass, field
from datetime import date
from pathlib import Path

from .validacao import LinhaInvalida, validar_conta, validar_data, validar_documento, validar_valor

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class Lancamento:
    data: date
    documento: str
    conta: str
    historico: str
    valor: float

    @property
    def tipo(self) -> str:
        return "D" if self.valor < 0 else "C"


@dataclass
class Fechamento:
    lancamentos: list[Lancamento] = field(default_factory=list)
    erros: list[str] = field(default_factory=list)
    por_conta: dict[str, float] = field(default_factory=lambda: defaultdict(float))
    por_tipo: dict[str, float] = field(default_factory=lambda: defaultdict(float))
    por_documento: Counter = field(default_factory=Counter)

    def adicionar(self, lanc: Lancamento) -> None:
        self.lancamentos.append(lanc)
        self.por_conta[lanc.conta] += lanc.valor
        self.por_tipo[lanc.tipo] += lanc.valor
        self.por_documento[lanc.documento] += 1

    @property
    def total(self) -> float:
        return round(sum(self.por_tipo.values()), 2)


def interpretar_linha(reg: dict[str, str]) -> Lancamento:
    return Lancamento(
        data=validar_data(reg["data"]),
        documento=validar_documento(reg["documento"]),
        conta=validar_conta(reg["conta"]),
        historico=reg["historico"].strip(),
        valor=validar_valor(reg["valor"]),
    )


def processar_linhas(linhas: Iterable[dict[str, str]], origem: str, fechamento: Fechamento) -> None:
    for n, reg in enumerate(linhas, start=2):
        try:
            fechamento.adicionar(interpretar_linha(reg))
        except LinhaInvalida as e:
            msg = f"{origem}:{n}: {e}"
            fechamento.erros.append(msg)
            logger.warning(msg)
        except KeyError as e:
            msg = f"{origem}:{n}: coluna ausente {e}"
            fechamento.erros.append(msg)
            logger.error(msg)


def processar_pasta(pasta: Path) -> Fechamento:
    fechamento = Fechamento()
    arquivos = sorted(pasta.glob("*.csv"))
    logger.info("Encontrados %d arquivo(s) em %s", len(arquivos), pasta)
    for arquivo in arquivos:
        logger.info("Lendo %s", arquivo.name)
        with open(arquivo, encoding="utf-8", newline="") as f:
            processar_linhas(csv.DictReader(f, delimiter=";"), arquivo.name, fechamento)
    logger.info("%d lançamento(s) válidos, %d erro(s)", len(fechamento.lancamentos), len(fechamento.erros))
    return fechamento
```

Destaques: `Fechamento` acumula os agregados **enquanto** lê, com `defaultdict(float)` para os totais e `Counter` para a contagem por documento. `processar_linhas` recebe qualquer iterável de dicionários, o que permite testá-la com uma lista de dicts, sem arquivos. O log registra cada arquivo lido e cada linha rejeitada, com nome do arquivo e número da linha.

## Passo 3: a interface de linha de comando (`cli.py`)

```python
import argparse
import logging
import sys
from pathlib import Path

from .processamento import Fechamento, processar_pasta


def configurar_log(verbose: bool, arquivo_log: Path | None) -> None:
    nivel = logging.DEBUG if verbose else logging.INFO
    handlers: list[logging.Handler] = [logging.StreamHandler(sys.stderr)]
    if arquivo_log:
        handlers.append(logging.FileHandler(arquivo_log, encoding="utf-8"))
    logging.basicConfig(
        level=nivel,
        format="%(asctime)s %(levelname)-7s %(name)s: %(message)s",
        datefmt="%d/%m/%Y %H:%M:%S",
        handlers=handlers,
    )


def formatar_relatorio(f: Fechamento) -> str:
    linhas = ["=== FECHAMENTO MENSAL ===", f"Lançamentos válidos: {len(f.lancamentos)}", f"Linhas com erro: {len(f.erros)}", ""]
    linhas.append("Por tipo:")
    for tipo in ("C", "D"):
        linhas.append(f"  {tipo}  {f.por_tipo.get(tipo, 0.0):>14,.2f}")
    linhas.append(f"  Total {f.total:>12,.2f}")
    linhas.append("")
    linhas.append("Por conta:")
    for conta, total in sorted(f.por_conta.items()):
        linhas.append(f"  {conta}  {total:>14,.2f}")
    linhas.append("")
    linhas.append("Documentos mais frequentes:")
    for doc, qtd in f.por_documento.most_common(3):
        linhas.append(f"  {doc:<20} {qtd:>3}")
    if f.erros:
        linhas.append("")
        linhas.append("Erros:")
        linhas.extend(f"  - {e}" for e in f.erros)
    return "\n".join(linhas)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="fechamento", description="Consolida os CSVs de lançamentos de uma pasta.")
    parser.add_argument("pasta", type=Path, help="pasta com os arquivos .csv")
    parser.add_argument("--log", type=Path, help="arquivo de log (além da tela)")
    parser.add_argument("-v", "--verbose", action="store_true", help="nível DEBUG")
    args = parser.parse_args(argv)

    if not args.pasta.is_dir():
        parser.error(f"{args.pasta} não é uma pasta")

    configurar_log(args.verbose, args.log)
    fechamento = processar_pasta(args.pasta)
    print(formatar_relatorio(fechamento))
    return 1 if fechamento.erros else 0


if __name__ == "__main__":
    sys.exit(main())
```

O log vai para `stderr` e o relatório para `stdout`: assim, `fechamento pasta > relatorio.txt` grava só o relatório, e as mensagens de log continuam visíveis na tela. O código de saída 1 quando há erros permite que um agendador ou script externo detecte problemas.

Saída típica:

```
$ python -m fechamento.cli lancamentos/2026-03 --log /tmp/fechamento.log
10/03/2026 09:15:01 INFO    fechamento.processamento: Encontrados 3 arquivo(s) em lancamentos/2026-03
10/03/2026 09:15:01 INFO    fechamento.processamento: Lendo compras.csv
10/03/2026 09:15:01 WARNING fechamento.processamento: compras.csv:4: valor fora do padrão 1.234,56: '820.45'
...
=== FECHAMENTO MENSAL ===
Lançamentos válidos: 41
Linhas com erro: 1

Por tipo:
  C       52,300.00
  D      -31,845.90
  Total    20,454.10
...
```

## Passo 4: testes (`tests/`)

```python
# tests/test_validacao.py
import pytest
from datetime import date
from fechamento.validacao import LinhaInvalida, validar_data, validar_documento, validar_valor

def test_data_valida():
    assert validar_data("02/03/2026") == date(2026, 3, 2)

@pytest.mark.parametrize("texto", ["2026-03-02", "31/02/2026", "1/3/2026", ""])
def test_data_invalida(texto):
    with pytest.raises(LinhaInvalida):
        validar_data(texto)

@pytest.mark.parametrize("texto, esperado", [("1.500,00", 1500.0), ("-45,90", -45.9), ("0,10", 0.1)])
def test_valor(texto, esperado):
    assert validar_valor(texto) == esperado

def test_valor_formato_americano_rejeitado():
    with pytest.raises(LinhaInvalida):
        validar_valor("1500.00")

def test_documento_cpf_e_cnpj():
    assert validar_documento("123.456.789-09") == "123.456.789-09"
    assert validar_documento("12.345.678/0001-90") == "12.345.678/0001-90"
    with pytest.raises(LinhaInvalida):
        validar_documento("12345678000190")
```

```python
# tests/test_processamento.py
from fechamento.processamento import Fechamento, processar_linhas

LINHA_OK = {"data": "02/03/2026", "documento": "123.456.789-09", "conta": "1.1.02", "historico": "Venda", "valor": "1.500,00"}

def test_processar_acumula_totais():
    f = Fechamento()
    processar_linhas([LINHA_OK, {**LINHA_OK, "valor": "-500,00", "conta": "2.1.01"}], "teste.csv", f)
    assert len(f.lancamentos) == 2
    assert f.por_tipo["C"] == 1500.0 and f.por_tipo["D"] == -500.0
    assert f.total == 1000.0
    assert f.por_documento["123.456.789-09"] == 2

def test_linha_invalida_vai_para_erros():
    f = Fechamento()
    processar_linhas([{**LINHA_OK, "valor": "abc"}], "teste.csv", f)
    assert f.lancamentos == []
    assert len(f.erros) == 1 and "teste.csv:2" in f.erros[0]
```

Os testes cobrem os limites (formato americano rejeitado, data inexistente) e o comportamento central (acumular, registrar erro com arquivo e linha). Rode com `pytest -v`. Se mais tarde alguém mudar a regex de valor e quebrar o formato `0,10`, o teste avisa.

Repare que nenhum teste toca o disco: `processar_linhas` recebe uma lista de dicionários, exatamente o que o `DictReader` produziria. Essa separação entre "ler o arquivo" e "processar os registros" é o que torna os testes rápidos e independentes. Se quiser testar `processar_pasta` de ponta a ponta, use a fixture `tmp_path` do `pytest` para criar uma pasta temporária com um ou dois CSVs pequenos e confira o `Fechamento` devolvido.

## Decisões de projeto que merecem atenção

**Validação rigorosa de propósito.** O `validar_valor` rejeita `1500.00` (formato americano) em vez de tentar adivinhar. Em um fechamento contábil, um valor interpretado errado é pior do que uma linha rejeitada e apontada no relatório: a rejeição é visível, o erro silencioso não. Se a origem dos arquivos mudar de formato, a regra muda em um único lugar.

**Erros não interrompem o processamento.** Como no projeto do módulo 3, uma linha inválida é registrada (no log e na lista `erros`) e o programa segue. O relatório final mostra a contagem e a lista completa, e o código de saída 1 avisa quem automatizou a execução. Isso dá ao contador o quadro completo em uma rodada só, em vez de corrigir uma linha, rodar de novo, descobrir a próxima.

**Uma dataclass como acumulador.** `Fechamento` reúne lançamentos, erros e os agregados em um único objeto. Isso evita que `processar_pasta` devolva uma tupla de cinco elementos difícil de lembrar, e permite que `formatar_relatorio` receba um só parâmetro. Como os agregados são atualizados no método `adicionar`, não há como esquecer de somar um lançamento em um dos totais.

**Regex como constantes compiladas.** As cinco regex ficam no topo de `validacao.py`, nomeadas e compiladas uma única vez. Quem precisar saber o formato aceito de uma conta não precisa procurar dentro de uma função: está em `RE_CONTA`.

## O que foi usado de cada lição

| Lição | Onde |
|-------|------|
| Type hints | assinaturas de todas as funções, `Path` opcional (`Path` ou `None`), `Iterable[dict[str, str]]` |
| Testes | `pytest`, `parametrize`, `pytest.raises` |
| collections | `Counter` por documento, `defaultdict(float)` por conta e tipo |
| datetime e regex | `RE_*` compiladas, `fullmatch`, `date()` |
| Linha de comando | `argparse`, `main(argv)`, `Path.glob`, código de saída |
| Ambientes | estrutura `src/`, `pyproject.toml`, testes em `tests/` |
| Logging | `getLogger(__name__)`, `basicConfig` só no `cli`, handlers para tela e arquivo |
| Código limpo | funções pequenas e puras, dataclasses, constantes para regex, cálculo separado de impressão |

## Para ir além

- Exportar o resumo por conta em CSV ou JSON com `--formato`.
- Validar os dígitos verificadores de CPF e CNPJ, não só o formato.
- Aceitar `--competencia 2026-03` e rejeitar lançamentos fora do mês.
- Usar `RotatingFileHandler` para o log crescer sem limite.
- Empacotar com `[project.scripts]` para rodar como `fechamento pasta/`.

## Erros comuns

- **Aceitar `1500.00` "por tolerância"** e somar um valor interpretado errado em silêncio.
- **Chamar `basicConfig` em `processamento.py`** em vez de no `cli.py`: módulos importados não devem configurar o log.
- **Imprimir o relatório em `stderr` ou o log em `stdout`** e misturar os dois ao redirecionar a saída.
- **Testar `processar_pasta` com arquivos fixos da sua máquina** em vez de `tmp_path`: o teste quebra em outro computador.

## Na prática

Este CLI é o modelo de ferramenta interna do escritório: agendado para o primeiro dia útil, lê o que foi exportado durante o mês, gera o resumo e deixa no log tudo o que rejeitou. Trocar o formato dos CSVs ou acrescentar um campo exige mexer em `validacao.py` e nos testes, não no resto.

## Resumo

- Validação na borda: regex compiladas com `fullmatch` e exceção própria com mensagem que aponta arquivo e linha.
- Agregação enquanto lê: `defaultdict(float)` para totais, `Counter` para contagens, dataclass para carregar tudo junto.
- CLI com `argparse`, lógica em funções puras testáveis, log em `stderr`, relatório em `stdout`, código de saída significativo.
- Testes parametrizados nos limites e testes de comportamento com listas de dicionários, sem depender de arquivos.
- O conjunto (tipos + testes + log + estrutura) é o que separa um script de uma ferramenta confiável.
