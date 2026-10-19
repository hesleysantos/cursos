# Ambientes virtuais e dependências

Até aqui você só usou a biblioteca padrão. Mas o ecossistema Python tem centenas de milhares de pacotes prontos, e um dia você vai querer ler planilhas Excel com `openpyxl` ou gerar PDFs com `reportlab`. Nesta lição você vai aprender a instalar pacotes de forma **isolada** com ambientes virtuais, a registrar dependências em `requirements.txt` e `pyproject.toml`, a estruturar um projeto e a publicá-lo no GitHub.

## O problema que o ambiente virtual resolve

Imagine dois projetos na mesma máquina: o de folha de pagamento usa `openpyxl 3.0`; um projeto novo exige `openpyxl 3.1`, que mudou uma função. Se os pacotes forem instalados "no Python do sistema", só uma versão pode existir, e um dos projetos quebra. Pior: ao formatar o computador, você não lembra quais pacotes o projeto precisava.

Um **ambiente virtual** é uma cópia leve do Python dentro da pasta do projeto, com a sua própria lista de pacotes. Cada projeto tem o seu; nada vaza para fora. É a prática padrão, não um luxo.

## Criando e ativando com `venv`

```
$ cd meu_projeto
$ python -m venv .venv
```

Isso cria a pasta `.venv` (o ponto a esconde em alguns sistemas; o nome é convenção). Dentro dela há um interpretador Python e uma pasta de pacotes vazia. Agora **ative**:

```
# Windows (PowerShell)
$ .venv\Scripts\Activate.ps1
# Windows (cmd)
$ .venv\Scripts\activate.bat
# Linux / macOS
$ source .venv/bin/activate
```

O prompt ganha um prefixo `(.venv)`. A partir daí, `python` e `pip` referem-se ao ambiente, não ao sistema. Para sair: `deactivate`.

> **Dica:** se o PowerShell reclamar de política de execução, rode uma vez `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`. O VS Code detecta o `.venv` automaticamente e o ativa no terminal integrado.

Confirme que está no lugar certo:

```
(.venv) $ python -c "import sys; print(sys.prefix)"
C:\projetos\meu_projeto\.venv
```

## `pip`: instalando pacotes

```
(.venv) $ pip install openpyxl
(.venv) $ pip install "requests>=2.31,<3"      # restrição de versão
(.venv) $ pip install pytest ruff               # vários de uma vez
(.venv) $ pip list                              # o que está instalado
(.venv) $ pip show openpyxl                     # detalhes de um pacote
(.venv) $ pip install --upgrade openpyxl        # atualizar
(.venv) $ pip uninstall openpyxl                # remover
```

Os pacotes vêm do **PyPI** (Python Package Index, pypi.org). Antes de instalar algo, olhe a página do pacote: data da última versão, número de downloads, link para o repositório. Pacotes abandonados ou com nomes parecidos com os famosos (*typosquatting*) são um risco real.

## `requirements.txt`: congelando as dependências

Para que outra pessoa (ou você, em outro computador) reproduza o ambiente, registre as dependências:

```
(.venv) $ pip freeze > requirements.txt
```

O arquivo lista tudo o que está instalado, com versões exatas:

```
et-xmlfile==1.1.0
openpyxl==3.1.2
pytest==8.1.1
```

Na outra máquina:

```
$ python -m venv .venv
$ .venv\Scripts\Activate.ps1
(.venv) $ pip install -r requirements.txt
```

Alternativa mais limpa: escrever o `requirements.txt` à mão só com o que você **pediu** (`openpyxl`, `pytest`), sem as dependências indiretas, usando faixas de versão (`openpyxl>=3.1,<4`). O `pip freeze` é bom para registrar o estado exato de produção; o arquivo manual é melhor para dizer a intenção.

## `pyproject.toml`: o padrão moderno

Desde 2021, a forma oficial de descrever um projeto Python é o arquivo `pyproject.toml`, na raiz. Ele reúne metadados, dependências e configurações de ferramentas em um único lugar:

```toml
[project]
name = "fechamento-mensal"
version = "0.1.0"
description = "Ferramentas de fechamento contábil mensal"
requires-python = ">=3.12"
dependencies = [
    "openpyxl>=3.1,<4",
]

[project.optional-dependencies]
dev = ["pytest>=8", "ruff>=0.4", "mypy>=1.9"]

[project.scripts]
fechamento = "fechamento.cli:main"      # cria o comando 'fechamento' ao instalar

[tool.ruff]
line-length = 100

[tool.pytest.ini_options]
testpaths = ["tests"]
```

Com esse arquivo, `pip install -e .` instala o seu projeto em modo editável (alterações no código valem na hora) e `pip install -e ".[dev]"` instala também as ferramentas de desenvolvimento. O bloco `[project.scripts]` transforma a função `main` em um comando de terminal.

TOML é um formato de configuração simples: seções entre colchetes, pares `chave = valor`, strings entre aspas, listas entre colchetes. O Python lê TOML com o módulo padrão `tomllib`.

## Estrutura de um projeto

```
fechamento-mensal/
├── .venv/                  <- ambiente virtual (NÃO vai para o Git)
├── .gitignore
├── README.md               <- o que é, como instalar, como usar
├── pyproject.toml
├── requirements.txt        <- opcional, se não usar só o pyproject
├── src/
│   └── fechamento/
│       ├── __init__.py
│       ├── cli.py          <- argparse e main()
│       ├── leitura.py      <- ler CSVs
│       └── calculos.py     <- regras de negócio
├── tests/
│   ├── test_leitura.py
│   └── test_calculos.py
└── dados_exemplo/
    └── lancamentos.csv
```

Pontos importantes:

- **`src/`**: colocar o pacote dentro de `src/` evita que os testes importem o código da pasta atual por acidente em vez do pacote instalado. É a convenção recomendada hoje.
- **`tests/` separado** do código, espelhando os módulos.
- **`README.md`** com três seções mínimas: o que faz, como instalar (`python -m venv`, `pip install -e .`), como rodar.
- **`.gitignore`** para não versionar lixo (veja abaixo).

## Publicando no GitHub

O Git guarda o histórico do código; o GitHub hospeda o repositório para backup, colaboração e portfólio. Fluxo mínimo:

```
$ git init
$ git add .
$ git commit -m "Estrutura inicial do fechamento mensal"
# crie o repositório vazio no site do GitHub, depois:
$ git remote add origin https://github.com/seu-usuario/fechamento-mensal.git
$ git branch -M main
$ git push -u origin main
```

Antes do primeiro `git add .`, crie o `.gitignore`:

```
.venv/
__pycache__/
*.pyc
.pytest_cache/
.mypy_cache/
.ruff_cache/
dados/              # dados reais de clientes NUNCA vão para o repositório
*.xlsx
.env                # senhas e chaves
```

> **Atenção:** o `.venv` tem centenas de megabytes e é recriável com `pip install`; nunca o versione. E, em um escritório contábil, **dados de clientes jamais entram no Git**, nem em repositório privado. Use arquivos de exemplo anonimizados em `dados_exemplo/`.

Depois, o ciclo de trabalho é: alterar código, `git add`, `git commit -m "mensagem clara"`, `git push`. Mensagens de commit descrevem **o que mudou e por quê**: "Corrige arredondamento do INSS na segunda faixa" é útil; "ajustes" não é.

## Ferramentas que você verá por aí

- **`pip-tools`** (`pip-compile`): gera um `requirements.txt` travado a partir do `pyproject.toml`.
- **`uv`**: substituto do `pip` + `venv` escrito em Rust, muito rápido; cria ambiente e instala com `uv sync`.
- **`poetry`** e **`pdm`**: gerenciam ambiente, dependências e publicação; usam `pyproject.toml`.
- **`pipx`**: instala ferramentas de linha de comando (como `ruff`, `black`) isoladas, disponíveis em qualquer lugar.

Não é preciso aprender todas. `venv` + `pip` + `pyproject.toml` resolvem a maioria dos projetos e são o que a documentação oficial recomenda.

## Erros comuns

- **Instalar sem ativar o ambiente**: o pacote vai para o Python do sistema e "some" quando você ativa o `.venv`. Confira o prefixo `(.venv)` no prompt.
- **Versionar o `.venv`** no Git: repositório gigante e inútil em outra máquina.
- **`pip freeze` com o ambiente do sistema ativo**: o `requirements.txt` vem com dezenas de pacotes que nada têm a ver com o projeto.
- **Esquecer `requires-python`**: alguém tenta rodar no Python 3.8 e tudo quebra com erros de sintaxe.
- **`import fechamento` falha nos testes**: o pacote não foi instalado em modo editável (`pip install -e .`).
- **Colocar senhas no código**: use variáveis de ambiente ou um `.env` ignorado pelo Git.

## Na prática

Cada projeto do escritório (folha, conciliação, geração de guias) tem seu `.venv` e seu `pyproject.toml`; assim, atualizar o `openpyxl` em um não quebra o outro. No GitHub, o repositório guarda código e dados de exemplo anonimizados; a pasta de dados reais fica no `.gitignore`.

## Resumo

- `python -m venv .venv` cria um ambiente isolado por projeto; ative antes de instalar qualquer coisa com `pip`.
- `requirements.txt` (`pip freeze` ou manual) e `pyproject.toml` (padrão moderno, com `[project]`, `dependencies`, `optional-dependencies`, `scripts`) registram as dependências.
- Estrutura: `src/pacote/`, `tests/`, `README.md`, `pyproject.toml`, `.gitignore`; instale o projeto com `pip install -e ".[dev]"`.
- Git + GitHub: `init`, `add`, `commit`, `remote add`, `push`; mensagens de commit explicam o porquê.
- Nunca versione `.venv`, caches, senhas nem dados reais de clientes.
