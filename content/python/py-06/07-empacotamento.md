# Empacotamento e distribuição

Nesta lição você aprende a transformar uma pasta de scripts em um **pacote instalável**: o que vai no `pyproject.toml`, como gerar os arquivos de distribuição com `build`, publicar no TestPyPI e no PyPI, versionar com semântica, criar comandos de linha (entry points), automatizar lint e testes com GitHub Actions e impedir commits ruins com `pre-commit`. No fim, o `pip install robo-fechamento` que você usa para bibliotecas dos outros vai funcionar para a sua.

## Por que empacotar

Enquanto o código vive só na sua máquina, `python script.py` basta. O problema aparece quando um colega precisa rodar, quando você quer usar o mesmo módulo em três projetos, ou quando o robô precisa rodar em um servidor. Copiar pastas gera versões divergentes; um pacote resolve: ele declara **nome, versão e dependências**, instala-se com `pip`, cria comandos no terminal e permite importar de qualquer lugar sem mexer em `sys.path`.

## Estrutura mínima de um projeto

```
robo-fechamento/
  pyproject.toml
  README.md
  LICENSE
  src/
    robo_fechamento/
      __init__.py
      cli.py
      dominio.py
  tests/
    test_dominio.py
```

O **layout `src/`** (código dentro de `src/`) é a recomendação atual. Ele impede que os testes importem acidentalmente a pasta local em vez do pacote instalado, erro que faz "funcionar na minha máquina" e quebrar na do colega. Note que o nome do projeto (`robo-fechamento`, com hífen) e o do pacote importável (`robo_fechamento`, com sublinhado) podem diferir.

## pyproject.toml

É o arquivo único de configuração do projeto, padronizado pelas PEPs 517, 518 e 621. Substitui `setup.py`, `setup.cfg` e `requirements.txt` para a maioria dos casos.

```toml
[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[project]
name = "robo-fechamento"
version = "0.1.0"
description = "Robô de fechamento contábil mensal"
readme = "README.md"
requires-python = ">=3.12"
license = { text = "MIT" }
authors = [{ name = "Seu Nome", email = "voce@exemplo.com" }]
dependencies = [
    "requests>=2.31",
    "openpyxl>=3.1",
]

[project.optional-dependencies]
dev = ["pytest>=8", "ruff>=0.4", "build", "twine"]

[project.scripts]
robo-fechamento = "robo_fechamento.cli:main"

[project.urls]
Homepage = "https://github.com/seu-usuario/robo-fechamento"

[tool.ruff]
line-length = 100

[tool.pytest.ini_options]
testpaths = ["tests"]
```

Pontos-chave:

- `[build-system]` diz qual ferramenta constrói o pacote (`hatchling`, `setuptools`, `flit`, `poetry-core`). Hatchling é simples e detecta o layout `src/` sozinho.
- `dependencies` são as bibliotecas que o pacote **precisa para funcionar**; `optional-dependencies.dev` são as de desenvolvimento, instaladas com `pip install -e ".[dev]"`.
- `[project.scripts]` cria o **entry point**: ao instalar, o `pip` gera um executável `robo-fechamento` que chama a função `main` do módulo `cli`.
- Ferramentas (`ruff`, `pytest`, `mypy`) leem sua configuração das seções `[tool.*]` do mesmo arquivo.

Durante o desenvolvimento, instale em **modo editável**: `pip install -e ".[dev]"`. As alterações no código valem imediatamente, sem reinstalar.

## O entry point da CLI

```python
# src/robo_fechamento/cli.py
import argparse
from . import __version__          # __init__.py define __version__ = "0.1.0"
from .dominio import totalizar

def main(argv=None):
    parser = argparse.ArgumentParser(prog="robo-fechamento")
    parser.add_argument("--competencia", required=True)
    parser.add_argument("--version", action="version", version=__version__)
    args = parser.parse_args(argv)
    print(f"Fechando {args.competencia}...")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
```

`main(argv=None)` aceita a lista de argumentos como parâmetro para que os testes chamem `main(["--competencia", "2026-03"])` sem mexer em `sys.argv`. Devolver um inteiro e passá-lo a `SystemExit` dá ao sistema operacional o código de saída correto (0 = sucesso), essencial para agendadores e CI.

## Versionamento semântico

Versão `MAIOR.MENOR.CORREÇÃO` (SemVer):

- **CORREÇÃO** (0.1.0 → 0.1.1): conserta bug, sem mudar comportamento documentado.
- **MENOR** (0.1.1 → 0.2.0): adiciona funcionalidade compatível com a anterior.
- **MAIOR** (0.2.0 → 1.0.0): quebra compatibilidade (remove função, muda assinatura, altera formato de saída).

Antes de 1.0.0 tudo pode mudar; a partir dela, você promete estabilidade. Quem depende do seu pacote escreve `robo-fechamento>=1.2,<2` confiando nessa promessa. Mantenha um `CHANGELOG.md` com o que mudou em cada versão e marque cada release com uma tag Git: `git tag v0.2.0 && git push --tags`.

## Construir e publicar

```bash
python -m pip install --upgrade build twine
python -m build
# gera dist/robo_fechamento-0.1.0.tar.gz  (sdist: código-fonte)
#       dist/robo_fechamento-0.1.0-py3-none-any.whl  (wheel: pronto para instalar)

python -m twine check dist/*                                   # valida metadados e README
python -m twine upload --repository testpypi dist/*            # ensaio no TestPyPI
pip install --index-url https://test.pypi.org/simple/ robo-fechamento   # testa a instalação

python -m twine upload dist/*                                  # publicação real no PyPI
```

O **wheel** é o formato que o `pip` prefere: já vem "construído" e instala rápido; `py3-none-any` significa Python 3, sem extensões em C, qualquer sistema. O **sdist** é o código-fonte, para quem precisa compilar ou auditar.

Para publicar você precisa de uma conta no PyPI e de um **token de API** (nunca a senha). Guarde-o como variável de ambiente `TWINE_PASSWORD` com `TWINE_USERNAME=__token__`, ou melhor, configure o **Trusted Publishing** no PyPI para que o GitHub Actions publique sem token algum. Nomes no PyPI são únicos e permanentes: confira se `robo-fechamento` está livre antes de escolher.

> **Atenção:** uma versão publicada no PyPI **não pode ser substituída**. Se saiu errada, publique 0.1.1. Por isso o TestPyPI existe: ensaie lá.

## CI com GitHub Actions

Integração contínua é rodar lint e testes **automaticamente a cada push e pull request**. No GitHub, basta um arquivo YAML em `.github/workflows/`.

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  testes:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: ["3.12", "3.14"]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: ${{ matrix.python-version }}
          cache: pip
      - run: python -m pip install -e ".[dev]"
      - run: ruff check .
      - run: ruff format --check .
      - run: pytest -q
```

A `matrix` roda o mesmo job em várias versões do Python. Se qualquer passo falha, o PR fica marcado em vermelho, e você pode configurar a branch `main` para **exigir** CI verde antes do merge (Settings, Branches, protection rules). Um segundo workflow, disparado por `on: push: tags: ["v*"]`, pode rodar `python -m build` e publicar no PyPI automaticamente a cada tag.

## pre-commit: barrar o erro antes do commit

Esperar o CI para descobrir que faltou formatar é lento. O `pre-commit` roda verificações **localmente**, no momento do `git commit`.

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.5.0
    hooks:
      - id: ruff
        args: [--fix]
      - id: ruff-format
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.6.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: detect-private-key
```

```bash
pip install pre-commit
pre-commit install            # instala o gancho no .git/hooks
pre-commit run --all-files    # roda em tudo uma vez
```

A partir daí, cada `git commit` formata, corrige imports, remove espaços sobrando e **recusa** o commit se houver chave privada ou YAML inválido. `ruff` substitui `flake8`, `isort` e `black` em uma ferramenta só, dezenas de vezes mais rápida. `detect-private-key` é a última linha de defesa contra o vazamento de segredos visto na lição de Git.

## Checklist de um pacote pronto

- `pyproject.toml` com nome, versão, dependências, `requires-python` e entry point.
- Layout `src/`, `README.md` útil, `LICENSE`.
- `pip install -e ".[dev]"` funciona em um venv limpo.
- `pytest` verde, `ruff check` sem avisos.
- CI configurado e exigido na `main`.
- `pre-commit` instalado.
- Tag `vX.Y.Z` para cada release e `CHANGELOG.md` atualizado.
- Ensaio no TestPyPI antes do PyPI.

## Armadilhas comuns

- **Fixar versões exatas** nas `dependencies` de uma biblioteca (`requests==2.31.0`): gera conflitos para quem instala. Use faixas; versões exatas só em aplicações, via lock file.
- **Esquecer o `__init__.py`** ou pôr o pacote fora de `src/` e ver `ModuleNotFoundError` só depois de publicar.
- **Publicar sem `twine check`**: README quebrado na página do PyPI.
- **Token do PyPI no repositório**: use secrets do GitHub ou Trusted Publishing.
- **Pular o TestPyPI** e descobrir que a versão não pode ser apagada.
- **CI só na `main`**: configure também `pull_request` para pegar o erro antes do merge.

## Na prática

Você não precisa publicar no PyPI para se beneficiar disto. Empacotar o robô de fechamento com `pyproject.toml` e entry point já permite instalá-lo em outra máquina do escritório com `pip install .` (ou direto do GitHub, `pip install git+https://...`), sem copiar pastas nem ajustar caminhos, e o comando `robo-fechamento --competencia 2026-03` fica disponível no Agendador. O CI, por sua vez, é o colega que roda os testes toda vez que você esquece.

## Resumo

- `pyproject.toml` centraliza metadados, dependências, entry points e configuração das ferramentas; layout `src/` evita importações acidentais.
- `pip install -e ".[dev]"` para desenvolver; `python -m build` gera sdist e wheel; `twine` publica (ensaie no TestPyPI, versões no PyPI são permanentes).
- SemVer: CORREÇÃO conserta, MENOR adiciona, MAIOR quebra; marque releases com tags Git.
- `[project.scripts]` cria comandos de terminal; `main(argv=None)` com código de saída inteiro facilita testes e agendamento.
- GitHub Actions roda lint e testes a cada push/PR (exija CI verde na `main`); `pre-commit` com `ruff` barra problemas antes do commit.
