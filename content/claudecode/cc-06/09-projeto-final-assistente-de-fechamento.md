# Projeto final: Assistente de fechamento contábil

Este é o projeto de conclusão do curso. Você vai montar um **repositório completo** em que o Claude Code, com skills, subagentes, hooks, um servidor MCP próprio, um workflow no GitHub Actions e um script `claude -p` agendado, ajuda o escritório a fechar a competência de cada cliente. O resultado é um portfólio e uma ferramenta de trabalho ao mesmo tempo.

## Especificação

**Objetivo**: para um cliente (CNPJ) e uma competência (AAAA-MM), coletar os dados das fontes, conciliar extratos com o razão, apontar divergências e gerar um relatório de fechamento com pendências para aprovação humana. O assistente **nunca lança** no sistema contábil.

**Entradas**: extratos bancários em CSV (`dados/<cnpj>/<competencia>/extratos/*.csv`), razão exportado (`razao.csv`), cadastro de clientes em SQLite (`clientes.db`), regras do escritório em `CLAUDE.md` e `.claude/rules/`.

**Saídas**: `saida/<cnpj>/<competencia>/conciliado.json`, `relatorio.md`, `pendencias.json`; um PR com o relatório; um registro de custo por execução.

**Restrições**: permissões mínimas; escrita só em `saida/`; dados de clientes só em conta comercial; revisão humana antes de qualquer efeito externo.

## Arquitetura

```text
.
├── CLAUDE.md                      regras fixas, comandos, instruções de compactação
├── .claude/
│   ├── rules/contabil.md          regras com paths: "src/**/*.py"
│   ├── skills/
│   │   ├── coletar/SKILL.md       lê fontes -> coleta.json (esquema)
│   │   ├── conciliar/SKILL.md     cruza extratos x razão -> conciliado.json
│   │   └── relatorio/SKILL.md     conciliado.json -> relatorio.md
│   ├── agents/
│   │   ├── revisor.md             confere números do relatório contra conciliado.json
│   │   └── testador.md            roda pytest e relata falhas
│   └── settings.json              permissões + hooks
├── .mcp.json                      servidor "clientes" (SQLite, somente leitura)
├── mcp/servidor.py                MCPServer com consultar_cliente
├── src/fechamento/                funções do domínio (puras, testadas)
├── tests/                         pytest + conjunto de avaliação com gabarito
├── scripts/fechar.ps1             claude -p agendado
└── .github/workflows/revisao.yml  revisão automática de PR
```

Fluxo: `fechar.ps1` → `claude -p "/coletar <cnpj> <competencia>"` → `claude -p "/conciliar ..."` → `claude -p "/relatorio ..."` → subagente revisor (dentro da skill `relatorio`, via `context: fork`) → commit por script → PR → workflow de revisão → aprovação humana.

## Componentes

**CLAUDE.md** (menos de 200 linhas): competência `AAAA-MM`; valores em centavos; divergência = diferença maior que 1 centavo ou lançamento sem par; "nunca inventar valores; registrar em pendências"; `python -m pytest -q` antes de commit; instruções de compactação preservando arquivos alterados e decisões.

**Skills**: as três têm `disable-model-invocation: true` (só você ou o script invocam), `argument-hint: [cnpj] [AAAA-MM]`, `allowed-tools` restrito (`Read`, `Edit(saida/**)`, `Bash(python ${CLAUDE_SKILL_DIR}/scripts/*)`) e um esquema JSON de saída versionado em `esquemas/`.

**Subagentes**: `revisor` com `tools: Read, Grep` e `model: sonnet`, prompt "liste todo número do relatório que não exista em conciliado.json"; `testador` com `tools: Bash, Read` limitado a `Bash(python -m pytest *)`.

**Hooks** em `.claude/settings.json`: `PostToolUse` com matcher `Edit|Write` rodando o formatador Python nos `.py`; `PreToolUse` com matcher `Edit|Write` chamando um script que sai com código 2 se o caminho não começar com `saida/` nem `src/` nem `tests/`.

**Servidor MCP**: `mcp/servidor.py` da lição 3, registrado em `.mcp.json` com `--scope project`; ferramenta `consultar(cnpj)` somente leitura.

**Workflow**: o de revisão de PR da lição 4 do módulo anterior (plugin `code-review`, `--comment`, permissões de leitura, segredo `ANTHROPIC_API_KEY`).

**Script agendado** (`fechar.ps1`): define a chave a partir de arquivo protegido, roda as três execuções `-p` com `--bare --output-format json --max-turns 6 --max-budget-usd 0.50 --permission-mode dontAsk`, verifica `$LASTEXITCODE` e o `subtype` de cada uma, grava custo em `registro.jsonl`, commita e abre o PR com `gh`. Registrado no Agendador de Tarefas no primeiro dia útil do mês.

## As funções do domínio

Duas funções puras, testadas sem Claude, formam o núcleo; são os exercícios de código desta lição.

`conciliar(extrato, razao)`: recebe duas listas de lançamentos (`{"data", "valor", "descricao"}`, valores em centavos inteiros) e devolve `{"casados": n, "so_extrato": [...], "so_razao": [...]}`. A regra de pareamento: mesma data e mesmo valor; cada lançamento casa no máximo uma vez.

`resumir_fechamento(conciliado)`: recebe o resultado acima e devolve um dicionário com `total_divergencias`, `valor_so_extrato`, `valor_so_razao` e `status` (`"ok"` se não houver divergência, `"pendente"` caso contrário).

```python
def resumir_fechamento(conciliado):
    so_extrato = conciliado["so_extrato"]
    so_razao = conciliado["so_razao"]
    total = len(so_extrato) + len(so_razao)
    return {
        "total_divergencias": total,
        "valor_so_extrato": sum(l["valor"] for l in so_extrato),
        "valor_so_razao": sum(l["valor"] for l in so_razao),
        "status": "ok" if total == 0 else "pendente",
    }

print(resumir_fechamento({"casados": 3, "so_extrato": [{"valor": 1500}], "so_razao": []}))
# {'total_divergencias': 1, 'valor_so_extrato': 1500, 'valor_so_razao': 0, 'status': 'pendente'}
```

## Plano em sprints de 30 minutos

| Sprint | Entrega |
|---|---|
| 1 | Repositório, `CLAUDE.md`, `.claude/rules/contabil.md`, `.gitignore` (inclui `.claude/worktrees/`, `CLAUDE.local.md`, `saida/`) |
| 2 | `src/fechamento/conciliar.py` + testes unitários passando |
| 3 | `src/fechamento/resumo.py` + testes; `esquemas/*.json` |
| 4 | Skill `coletar` com script e esquema; teste manual em sessão |
| 5 | Skill `conciliar`; teste manual |
| 6 | Skill `relatorio` com `context: fork` chamando o revisor; subagentes `revisor` e `testador` |
| 7 | Hooks (formatação e bloqueio); `settings.json` com `allow`/`deny`; testar o bloqueio |
| 8 | Servidor MCP + `.mcp.json`; `claude mcp list`; pergunta de teste |
| 9 | `fechar.ps1` com três execuções `-p`, registro de custo; rodar à mão |
| 10 | Workflow de revisão de PR; segredo no repositório; abrir um PR de teste |
| 11 | Conjunto de avaliação (10 casos com gabarito) e script de lote |
| 12 | `README.md`, `DECISOES.md`, agendamento no Windows, revisão final |

Cada sprint termina com um commit. Se um sprint não couber em 30 minutos, divida-o; não avance com algo quebrado.

## Rubrica detalhada

| Critério | Pontos |
|---|---|
| `CLAUDE.md` curto, verificável, com regras do domínio e compactação; rules com `paths` | 10 |
| Funções do domínio puras, testadas, com casos de borda (listas vazias, valores repetidos) | 15 |
| Skills com `disable-model-invocation`, `allowed-tools` mínimo, esquema JSON versionado | 15 |
| Subagentes com ferramentas e modelo adequados; revisor independente usado na skill de relatório | 10 |
| Hooks: formatação funciona; bloqueio de escrita fora de `saida/`/`src/`/`tests/` comprovado | 10 |
| Servidor MCP somente leitura, SQL parametrizado, registrado em `.mcp.json`, testado | 10 |
| Script `-p` com `--bare`, limites, `dontAsk`, verificação de código de saída e `subtype`, registro de custo | 10 |
| Workflow de revisão de PR funcionando com permissões mínimas e segredo | 5 |
| Conjunto de avaliação com gabarito, taxa calculada, resultado registrado | 10 |
| `README` com arquitetura, "o que o agente não pode fazer", `DECISOES.md` | 5 |

Aprovação: 70 pontos, com pelo menos metade em cada um dos critérios de segurança (hooks, MCP, script).

## Erros comuns

- Começar pelas skills sem as funções do domínio testadas: o agente "funciona" até o primeiro caso de borda.
- Skills que o modelo pode invocar sozinho; o fechamento começa sem você pedir.
- Hook de bloqueio escrito, mas nunca testado.
- Servidor MCP com ferramenta de escrita "para o futuro".
- Script agendado sem `--max-budget-usd`.
- PR com relatório, mas sem evidência de testes.

## Na prática

Depois de pronto, rode o fechamento de um cliente real por três competências, comparando com o fechamento manual. Registre taxa de divergências encontradas e custo. Só então proponha ao escritório usar o assistente como primeira passada, mantendo a revisão humana. Esse repositório é a peça central do seu portfólio: mostre-o.

## Resumo

- Repositório com `CLAUDE.md`, rules, três skills, dois subagentes, hooks, MCP próprio, workflow de CI e script `-p` agendado.
- Núcleo em Python puro e testado: `conciliar()` e `resumir_fechamento()`.
- Permissões mínimas em cada camada; escrita só em `saida/`; efeito externo (PR) por script e aprovação humana.
- Doze sprints de 30 minutos, um commit por sprint, nada avança quebrado.
- Rubrica: 100 pontos, 70 para aprovar, com mínimo nos critérios de segurança.
