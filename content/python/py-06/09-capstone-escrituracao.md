# Projeto final: sistema de escrituração simplificada

Este é o capstone do curso. Você vai construir um **sistema de escrituração contábil simplificada**: um livro-diário com partidas dobradas, plano de contas, balancete e razão, com domínio em dataclasses imutáveis e Protocols, repositório SQLite trocável por memória, CLI instalável, testes, empacotamento e CI. Tudo que você aprendeu nos seis módulos aparece aqui. Esta lição traz a especificação completa, o esqueleto de código e os critérios de pronto; o trabalho de preencher é seu.

## Por que este projeto

Um sistema de escrituração é pequeno o bastante para caber em um fim de semana e rico o bastante para exigir todas as decisões de engenharia que importam: regras de negócio invariantes (débitos = créditos), persistência, interface de usuário, testes de várias camadas e distribuição. E você, como contador, é o especialista do domínio: vai perceber na hora quando o código modela a contabilidade errado.

## Especificação

### Domínio

- **Conta**: código (`"1.1.01"`), nome, natureza (`DEVEDORA` ou `CREDORA`). Contas são imutáveis e identificadas pelo código.
- **Partida**: código de conta + valor em centavos (inteiro, sempre positivo) + tipo (`D` ou `C`).
- **Lançamento**: id, data, histórico e uma lista de partidas. **Invariante**: soma dos débitos = soma dos créditos, e há pelo menos uma partida de cada tipo. Um lançamento que viola isso **não pode existir** (o construtor lança `ValueError`).
- **Saldo** de uma conta: débitos menos créditos para contas devedoras; créditos menos débitos para credoras. Sempre devolvido em centavos.
- **Balancete** de um período: para cada conta com movimento, total de débitos, total de créditos e saldo, ordenado por código.
- **Razão** de uma conta: lançamentos que a movimentam, em ordem de data, com saldo acumulado.

### Persistência

- `Repositorio` é um **Protocol** com `adicionar_conta`, `contas`, `adicionar_lancamento`, `lancamentos(inicio, fim)`.
- Duas implementações: `RepositorioMemoria` (listas, para testes) e `RepositorioSQLite` (arquivo, para uso real). Devem ser indistinguíveis para a aplicação.
- Rejeitar lançamento que referencie conta inexistente.

### Aplicação (casos de uso)

- `cadastrar_conta`, `lancar`, `balancete(inicio, fim)`, `razao(codigo, inicio, fim)`, `importar_csv(caminho)`.

### CLI

```bash
escrita conta add 1.1.01 "Caixa" D
escrita lancar --data 2026-03-05 --hist "Venda à vista" --d 1.1.01=150000 --c 3.1.01=150000
escrita balancete --de 2026-03-01 --ate 2026-03-31
escrita razao 1.1.01 --de 2026-03-01 --ate 2026-03-31
escrita importar lancamentos.csv
```

Configuração por variável de ambiente `ESCRITA_DB` (caminho do SQLite; padrão `escrita.db`).

## Esqueleto de código

```
escrita/
  pyproject.toml
  src/escrita/
    __init__.py
    dominio.py
    repositorio.py        # Protocol + RepositorioMemoria
    repositorio_sqlite.py
    aplicacao.py
    cli.py
  tests/
    test_dominio.py
    test_repositorios.py  # parametrizado: roda os MESMOS testes nas duas implementações
    test_aplicacao.py
    test_cli.py
  .github/workflows/ci.yml
  .pre-commit-config.yaml
```

### dominio.py

```python
from dataclasses import dataclass, field
from datetime import date
from enum import Enum

class Natureza(Enum):
    DEVEDORA = "D"
    CREDORA = "C"

@dataclass(frozen=True)
class Conta:
    codigo: str
    nome: str
    natureza: Natureza

@dataclass(frozen=True)
class Partida:
    conta: str
    valor_centavos: int
    tipo: str                      # "D" ou "C"

    def __post_init__(self):
        if self.tipo not in ("D", "C"):
            raise ValueError(f"tipo inválido: {self.tipo}")
        if self.valor_centavos <= 0:
            raise ValueError("valor deve ser positivo")

@dataclass(frozen=True)
class Lancamento:
    id: int
    data: date
    historico: str
    partidas: tuple[Partida, ...]

    def __post_init__(self):
        debitos = sum(p.valor_centavos for p in self.partidas if p.tipo == "D")
        creditos = sum(p.valor_centavos for p in self.partidas if p.tipo == "C")
        if debitos == 0 or creditos == 0:
            raise ValueError("lançamento precisa de ao menos um débito e um crédito")
        if debitos != creditos:
            raise ValueError(f"partidas não fecham: D={debitos} C={creditos}")

def saldo(conta: Conta, lancamentos) -> int:
    d = sum(p.valor_centavos for l in lancamentos for p in l.partidas if p.conta == conta.codigo and p.tipo == "D")
    c = sum(p.valor_centavos for l in lancamentos for p in l.partidas if p.conta == conta.codigo and p.tipo == "C")
    return d - c if conta.natureza is Natureza.DEVEDORA else c - d

def balancete(contas: dict[str, Conta], lancamentos) -> list[dict]:
    linhas = []
    for codigo in sorted(contas):
        conta = contas[codigo]
        d = sum(p.valor_centavos for l in lancamentos for p in l.partidas if p.conta == codigo and p.tipo == "D")
        c = sum(p.valor_centavos for l in lancamentos for p in l.partidas if p.conta == codigo and p.tipo == "C")
        if d or c:
            linhas.append({"conta": codigo, "nome": conta.nome, "debitos": d, "creditos": c,
                           "saldo": saldo(conta, lancamentos)})
    return linhas

def formatar_centavos(centavos: int) -> str:
    inteiro, resto = divmod(abs(centavos), 100)
    txt = f"{inteiro:,}".replace(",", ".")
    return f"{'-' if centavos < 0 else ''}{txt},{resto:02d}"
```

Tudo imutável, tudo em centavos, invariantes verificadas no construtor. Um `Lancamento` desbalanceado é impossível de criar, então nenhuma outra camada precisa conferir isso.

### repositorio.py

```python
from typing import Protocol
from datetime import date
from .dominio import Conta, Lancamento

class Repositorio(Protocol):
    def adicionar_conta(self, conta: Conta) -> None: ...
    def contas(self) -> dict[str, Conta]: ...
    def adicionar_lancamento(self, lanc: Lancamento) -> None: ...
    def lancamentos(self, inicio: date | None = None, fim: date | None = None) -> list[Lancamento]: ...

class RepositorioMemoria:
    def __init__(self):
        self._contas: dict[str, Conta] = {}
        self._lancs: list[Lancamento] = []

    def adicionar_conta(self, conta):
        if conta.codigo in self._contas:
            raise ValueError(f"conta {conta.codigo} já existe")
        self._contas[conta.codigo] = conta

    def contas(self):
        return dict(self._contas)

    def adicionar_lancamento(self, lanc):
        for p in lanc.partidas:
            if p.conta not in self._contas:
                raise ValueError(f"conta inexistente: {p.conta}")
        self._lancs.append(lanc)

    def lancamentos(self, inicio=None, fim=None):
        return sorted(
            (l for l in self._lancs
             if (inicio is None or l.data >= inicio) and (fim is None or l.data <= fim)),
            key=lambda l: (l.data, l.id),
        )
```

O `RepositorioSQLite` implementa os mesmos quatro métodos com duas tabelas (`contas`, `partidas` com `lancamento_id`, `data`, `historico`) e reconstrói os objetos `Lancamento` ao ler. Use `PRAGMA foreign_keys = ON`, parâmetros `?` e `with con:` para a transação de inserir lançamento + partidas de uma vez.

### Testes parametrizados para os dois repositórios

```python
# tests/test_repositorios.py
from datetime import date
import pytest
from escrita.dominio import Lancamento, Partida
from escrita.repositorio import RepositorioMemoria
from escrita.repositorio_sqlite import RepositorioSQLite

@pytest.fixture(params=["memoria", "sqlite"])
def repo(request, tmp_path):
    if request.param == "memoria":
        return RepositorioMemoria()
    return RepositorioSQLite(tmp_path / "t.db")

def test_rejeita_conta_inexistente(repo):
    with pytest.raises(ValueError):
        repo.adicionar_lancamento(Lancamento(1, date(2026, 3, 1), "x",
                                  (Partida("9.9", 100, "D"), Partida("9.8", 100, "C"))))
```

Essa fixture é o teste de Liskov na prática: **o mesmo teste** roda nas duas implementações. Se um passa e o outro falha, o contrato do Protocol foi violado.

### cli.py e pyproject.toml

A CLI usa `argparse` com subcomandos (`conta`, `lancar`, `balancete`, `razao`, `importar`), monta o repositório a partir de `ESCRITA_DB` e chama a aplicação. `main(argv=None) -> int` para testabilidade. No `pyproject.toml`, `[project.scripts] escrita = "escrita.cli:main"`, dependências vazias (só biblioteca padrão!) e `dev = ["pytest", "ruff", "build"]`.

## Critérios de pronto

**Domínio**
- [ ] `Lancamento` desbalanceado ou sem débito/crédito lança `ValueError` no construtor.
- [ ] `saldo` respeita a natureza da conta; `balancete` ordena por código e omite contas sem movimento.
- [ ] Cobertura de testes do domínio próxima de 100%, incluindo casos-limite (valor zero, tipo inválido, data fora do período).

**Persistência**
- [ ] `RepositorioMemoria` e `RepositorioSQLite` passam na mesma bateria parametrizada.
- [ ] SQLite usa parâmetros `?`, chaves estrangeiras ativas e transação por lançamento.
- [ ] Reabrir o banco preserva contas e lançamentos.

**Aplicação e CLI**
- [ ] Todos os subcomandos funcionam; erros de domínio viram mensagem clara e código de saída 1.
- [ ] `importar` aceita CSV com `data;historico;conta;tipo;valor` e rejeita linhas inválidas reportando o número da linha.
- [ ] `ESCRITA_DB` controla o caminho; sem ela, usa `escrita.db` na pasta atual.

**Engenharia**
- [ ] `pip install -e ".[dev]"` em venv limpo; comando `escrita --help` disponível.
- [ ] `ruff check` e `ruff format --check` limpos; `pre-commit` configurado.
- [ ] GitHub Actions rodando testes em 3.12 e 3.14; badge de CI no README.
- [ ] Tag `v0.1.0`, `CHANGELOG.md`, `python -m build` gera wheel; opcionalmente publicado no TestPyPI.

## Roteiro sugerido

1. **Domínio primeiro, com testes** (2 a 3 horas). Nenhuma persistência ainda. Faça o balancete fechar em um exemplo real seu.
2. **RepositorioMemoria + aplicação** (1 hora). Casos de uso rodando contra a memória.
3. **CLI** (1 a 2 horas). Teste com `main([...])` capturando `capsys`.
4. **RepositorioSQLite** (2 horas). A bateria parametrizada deve passar sem alterar um teste.
5. **Empacotar, CI, pre-commit** (1 hora).
6. **Importação CSV e razão** (1 a 2 horas). Agora com o sistema estável, funcionalidades novas entram sem medo.

## Extensões, se sobrar fôlego

- Plano de contas hierárquico (saldo de `1.1` soma `1.1.01`, `1.1.02`...), usando a recursão da lição de algoritmos.
- Exportar balancete em Excel com `openpyxl` e enviar por e-mail: reaproveite o Robô de fechamento.
- API HTTP com FastAPI sobre a mesma aplicação, sem tocar no domínio: prova definitiva de que as camadas estão certas.
- `Observer` para registrar um log de auditoria a cada lançamento.
- Estratégias de fechamento de exercício (zerar contas de resultado contra lucros acumulados).

## Armadilhas

- **Validar partidas na CLI** em vez de no domínio: a API HTTP futura não passaria pela CLI e aceitaria lixo.
- **Float em qualquer ponto.** Centavos inteiros do CSV ao Excel.
- **Repositório que vaza SQL** para a aplicação (devolver tuplas em vez de `Lancamento`).
- **Testar só a memória** e descobrir no SQLite que datas viraram strings ou que a ordem mudou.
- **Pular o `argv` em `main`** e depender de `sys.argv`: testes de CLI viram tortura.

## Na prática

Use um caso real pequeno como massa de teste: o movimento de um mês de um cliente simples (dez ou quinze lançamentos) cujo balancete você já conhece. Quando o seu sistema reproduzir esse balancete centavo a centavo, o domínio está certo. Depois disso, o projeto vira portfólio: um repositório público com testes, CI e README explicando as decisões diz mais a um empregador ou cliente do que qualquer certificado.

## Resumo

- Domínio imutável com invariantes no construtor: lançamentos desbalanceados não existem; saldos e balancete são funções puras em centavos.
- `Repositorio` como Protocol, com implementação em memória para testes e SQLite para uso real, validadas pela **mesma** bateria parametrizada.
- Aplicação orquestra casos de uso recebendo o repositório injetado; CLI com `argparse` e `main(argv) -> int`; configuração por variável de ambiente.
- Empacotado com `pyproject.toml` e entry point, lint e testes no CI, `pre-commit` local, versão marcada por tag.
- Os critérios de pronto são a sua definição de concluído; as extensões mostram que a arquitetura aceita crescimento sem reescrita.
