# Criando um servidor MCP próprio em Python

Nesta lição você vai construir um **servidor MCP** que expõe uma ferramenta `consultar_cliente` sobre um banco SQLite, registrá-lo no Claude Code e testá-lo. Ao final, o Claude poderá perguntar "qual o regime tributário da Padaria Sol?" e obter a resposta direto do seu banco, sem que você cole nada.

## Por que um servidor próprio

Você já usou servidores MCP prontos. Um servidor **próprio** serve para dar ao Claude acesso controlado aos dados do escritório: ele vê só as ferramentas que você escreveu, com os parâmetros que você definiu, e cada ferramenta faz exatamente o que o seu código Python faz. É mais seguro do que dar `Bash` com acesso ao banco, e mais reutilizável do que colar consultas no prompt.

## O SDK oficial

O pacote é `mcp`, o SDK Python oficial do Model Context Protocol, publicado no PyPI. A versão 2.3 exige Python 3.10 ou superior (o repositório de desenvolvimento já pede 3.11; confira o requisito da versão que instalar). A instalação recomendada inclui o extra `cli`, que traz o comando `mcp` (`mcp dev`, `mcp run`, `mcp install`):

```powershell
py -m venv .venv
.venv\Scripts\Activate.ps1
pip install "mcp[cli]"
```

Na versão atual do SDK (série 2.x, em outubro de 2026), a classe de alto nível é `MCPServer`, importada de `mcp.server`. Tutoriais mais antigos mostram `from mcp.server.fastmcp import FastMCP`, da versão 1 (na 2.x esse import falha com `ModuleNotFoundError`); se você encontrar esse código, confira a versão instalada com `pip show mcp` e consulte o guia de migração na documentação do SDK. A API de alto nível é a mesma ideia: um objeto servidor, decoradores para ferramentas e recursos, e `run()`.

O exemplo mínimo do README oficial:

```python
from mcp.server import MCPServer

mcp = MCPServer("Demo")


@mcp.tool()
def add(a: int, b: int) -> int:
    """Add two numbers."""
    return a + b
```

Não há JSON Schema escrito à mão: as anotações de tipo (`a: int`) viram o esquema e a docstring vira a descrição que o Claude lê. Para rodar por **stdio** (o transporte padrão, usado por hosts locais como o Claude Code), acrescenta-se:

```python
if __name__ == "__main__":
    mcp.run()
```

(Os dois blocos acima são o esqueleto do servidor e só rodam com o pacote `mcp` instalado; o segundo é um fragmento que completa o primeiro.) A documentação explica o motivo do `if __name__ == "__main__"`: tudo o que carrega o servidor (`mcp dev`, `mcp run`, `mcp install`, seus testes) importa o arquivo; a guarda evita que a importação vire um servidor rodando. `run()` é síncrono, bloqueia, e sem argumento usa stdio (lê mensagens em stdin e responde em stdout). Enquanto serve, **stdout é o fio do protocolo**: um `print()` pode corromper a comunicação; use o módulo `logging`, que escreve em stderr. (`mcp install` registra o servidor apenas no Claude Desktop; para o Claude Code, usa-se `claude mcp add`, como mostrado adiante.)

## A ferramenta `consultar_cliente`

A lógica que importa é Python puro e não precisa de rede: uma consulta SQLite que devolve um dicionário ou `None`. É a função do exercício de código desta lição, e é ela que o servidor expõe.

```python
import sqlite3

def consultar_cliente(conn, cnpj):
    """Devolve os dados do cliente ou None. cnpj: 14 digitos, so numeros."""
    cnpj = "".join(ch for ch in cnpj if ch.isdigit())
    if len(cnpj) != 14:
        return None
    cur = conn.execute(
        "SELECT cnpj, razao_social, regime, responsavel FROM clientes WHERE cnpj = ?",
        (cnpj,),
    )
    linha = cur.fetchone()
    if linha is None:
        return None
    return {"cnpj": linha[0], "razao_social": linha[1], "regime": linha[2], "responsavel": linha[3]}

conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE clientes (cnpj TEXT PRIMARY KEY, razao_social TEXT, regime TEXT, responsavel TEXT)")
conn.execute("INSERT INTO clientes VALUES ('11222333000181', 'Padaria Sol LTDA', 'Simples Nacional', 'Ana')")
print(consultar_cliente(conn, "11.222.333/0001-81"))
# {'cnpj': '11222333000181', 'razao_social': 'Padaria Sol LTDA', 'regime': 'Simples Nacional', 'responsavel': 'Ana'}
print(consultar_cliente(conn, "000"))
# None
```

Três decisões de segurança: a consulta é **parametrizada** (`?`), nunca montada com f-string; a função só lê (`SELECT`); o CNPJ é normalizado e validado quanto ao tamanho antes de ir ao banco.

## O servidor completo

```python
import logging
import sqlite3
from pathlib import Path

from mcp.server import MCPServer

from consultas import consultar_cliente

BANCO = Path(__file__).with_name("clientes.db")
log = logging.getLogger("clientes")
mcp = MCPServer("clientes-totali")


@mcp.tool()
def consultar(cnpj: str) -> dict | None:
    """Consulta um cliente do escritorio pelo CNPJ (14 digitos). Devolve razao social, regime e responsavel, ou None."""
    conn = sqlite3.connect(f"file:{BANCO}?mode=ro", uri=True)
    try:
        return consultar_cliente(conn, cnpj)
    finally:
        conn.close()


if __name__ == "__main__":
    mcp.run()
```

A conexão abre em modo somente leitura (`mode=ro`), reforçando no banco o que a função já faz. Esse bloco é referência: depende do pacote `mcp` e de um arquivo `clientes.db`.

## Registrar no Claude Code

O comando, conforme a documentação do Claude Code, usa `--transport stdio` e o separador `--` antes do comando que inicia o servidor:

```powershell
claude mcp add --transport stdio clientes --scope project -- python C:\automacao\mcp\servidor.py
```

Com `--scope project`, a configuração vai para o `.mcp.json` na raiz do projeto, que pode ser versionado:

```json
{
  "mcpServers": {
    "clientes": {
      "command": "python",
      "args": ["C:\\automacao\\mcp\\servidor.py"]
    }
  }
}
```

Sem `--scope`, o padrão é `local` (só você, só neste projeto); `user` vale para todos os seus projetos. Caminhos de segredos entram via `${VAR}` em `env`, nunca em texto. Em sessões interativas, o Claude Code pede aprovação antes de usar servidores de projeto do `.mcp.json`.

## Testar

1. `uv run mcp dev servidor.py` (ou `mcp dev servidor.py` no venv) abre o **MCP Inspector**, que inicia o servidor por stdio e deixa você chamar `consultar` com um CNPJ.
2. `claude mcp list` mostra o servidor e seu estado; `claude mcp get clientes` dá detalhes.
3. Dentro de uma sessão, `/mcp` lista servidores e ferramentas. A ferramenta aparece como `mcp__clientes__consultar`; esse é o nome que vai em regras de permissão (`"allow": ["mcp__clientes__consultar"]`) e em `tools:` de subagentes.
4. Pergunte: "qual é o regime da empresa de CNPJ 11.222.333/0001-81?" e observe a chamada.

Se o servidor não conectar em 30 segundos, o Claude Code desiste (`MCP_TIMEOUT` ajusta). Erros de inicialização aparecem em `claude mcp get`.

## Erros comuns

- `print()` para depurar: corrompe o stdio. Use `logging`.
- Esquecer o `--` no `claude mcp add`: o Claude Code tenta interpretar os argumentos do seu servidor.
- Montar SQL com f-string: injeção por um CNPJ malicioso.
- Expor uma ferramenta de escrita "por conveniência": o servidor vira uma porta para alterar o banco a partir de qualquer conteúdo que o Claude leia.
- Rodar o servidor com um Python diferente do venv onde `mcp` foi instalado.

## Na prática

Comece com uma ou duas ferramentas de leitura: `consultar` por CNPJ e `listar_pendencias` por competência. Docstrings claras: é por elas que o Claude decide quando usar a ferramenta. Se um dia precisar de escrita, marque a ferramenta com `_meta["anthropic/requiresUserInteraction"] = true` na resposta de `tools/list`, para que o Claude Code peça aprovação a cada chamada, e registre tudo em log.

## Resumo

- SDK oficial: pacote `mcp` (`pip install "mcp[cli]"`), Python 3.10+; na série 2.x, `from mcp.server import MCPServer`, `@mcp.tool()`, `mcp.run()` sob `if __name__ == "__main__"` (stdio por padrão).
- Tipos e docstring viram esquema e descrição; `print()` quebra o stdio, use `logging`.
- A lógica fica em Python puro, com SQL parametrizado e somente leitura.
- Registre com `claude mcp add --transport stdio <nome> --scope project -- python servidor.py`; o `.mcp.json` é versionável.
- Teste com `mcp dev`, `claude mcp list` e `/mcp`; a ferramenta se chama `mcp__<servidor>__<ferramenta>`.
