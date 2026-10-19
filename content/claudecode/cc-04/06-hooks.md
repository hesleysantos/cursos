Nesta lição você vai aprender **hooks**: comandos seus que o Claude Code executa automaticamente em pontos do ciclo de vida, como "depois de cada edição" ou "antes de cada comando de shell". Diferente de uma instrução no `CLAUDE.md`, um hook acontece sempre, sem depender de o modelo lembrar. Você vai conhecer os eventos, o formato no `settings.json`, o que o hook recebe (JSON na entrada padrão) e como responde (código de saída e JSON), e vai montar dois hooks em Python: formatar com `black` após cada edição e bloquear comandos perigosos. Ao final, você escreve a lógica de decisão de um hook.

## O que é um hook e por que ele garante

Um hook é um manipulador registrado para um **evento**. Quando o evento acontece, o Claude Code roda o manipulador; se for um comando, passa os dados do evento em JSON pela entrada padrão (stdin) e lê o código de saída e a saída padrão. É o próprio Claude Code que executa, não o modelo; por isso serve para regras que não podem falhar: formatação obrigatória, bloqueio de comandos, notificações, auditoria. A documentação cita manipuladores do tipo comando, HTTP, ferramenta MCP, prompt e agente; esta lição usa o tipo `command`.

## Os eventos

A referência lista dezenas de eventos. Os que você vai usar primeiro:

- **`SessionStart`** / **`SessionEnd`**: início e fim da sessão.
- **`UserPromptSubmit`**: quando você envia um prompt (dá para acrescentar contexto ou bloquear).
- **`PreToolUse`**: antes de uma ferramenta rodar; pode bloquear, permitir ou pedir confirmação.
- **`PermissionRequest`**: quando um pedido de permissão seria mostrado.
- **`PostToolUse`**: depois de uma ferramenta rodar com sucesso.
- **`PostToolUseFailure`**: depois de uma ferramenta falhar.
- **`Stop`** / **`SubagentStop`**: quando o Claude (ou um subagente) termina a resposta.
- **`PreCompact`** / **`PostCompact`**: antes e depois da compactação do contexto.
- **`Notification`**: quando o Claude precisa da sua atenção.
- **`ConfigChange`**: quando um arquivo de configuração muda.

A lista completa, com os campos de cada evento, está na página de referência de hooks.

## O formato no settings.json

Três níveis: o evento, o grupo com `matcher` (filtro) e a lista de manipuladores. O `matcher` em eventos de ferramenta é o nome da ferramenta: `Bash`, `Edit|Write` (alternativas separadas por `|`), ou uma expressão regular como `mcp__.*`; vazio, `*` ou ausente casa com tudo. Exemplo oficial de formatação após edição (usa `jq` e Prettier, em um projeto JavaScript):

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.file_path' | xargs npx prettier --write"
          }
        ]
      }
    ]
  }
}
```

Os hooks podem ficar em `~/.claude/settings.json` (todos os seus projetos), `.claude/settings.json` (o projeto, commitado), `.claude/settings.local.json` (só você), nas configurações gerenciadas, em plugins e no cabeçalho de skills e subagentes. Campos comuns de um manipulador de comando: `command`, `args` (forma exec, sem shell), `timeout` (segundos; padrão 600 para comandos), `shell` (`powershell` para rodar no PowerShell no Windows) e `if` (uma regra de permissão como `"Bash(git *)"` que filtra ainda mais). Dentro de uma sessão, `/hooks` mostra os hooks configurados por evento; `"disableAllHooks": true` desliga todos.

> **Atenção (Windows):** na forma shell (só `"command"`), o comando roda no Git Bash quando ele está instalado; sem o Git Bash, roda no PowerShell, e um comando escrito para bash pode falhar. Um hook `PreToolUse` que falha nessa situação pode bloquear a ferramenta com a mensagem `blocking because Git Bash wasn't found...`. A forma exec (`"command"` + `"args"`) inicia o programa diretamente, sem shell nenhum, e é a mais previsível no Windows; para que uma falha do próprio script (Python ausente, erro de sintaxe) também bloqueie em vez de deixar a ação passar, a documentação indica acrescentar `"onFailure": "block"` ao manipulador. Nos exemplos abaixo, o programa é o `python` e o argumento é o caminho do script, com `${CLAUDE_PROJECT_DIR}` apontando para a raiz do projeto. Lembre também que, sem o Git Bash, a ferramenta de shell se chama `PowerShell`, não `Bash`: um matcher só com `Bash` nunca dispara nessa máquina, por isso o exemplo 2 usa `Bash|PowerShell`.

## Entrada e saída

Todo hook de comando recebe JSON no stdin com campos comuns (`session_id`, `cwd`, `hook_event_name`, `permission_mode`) e campos do evento. Em `PreToolUse` e `PostToolUse`: `tool_name`, `tool_input` (os argumentos da ferramenta; para Bash, `tool_input.command`; para Edit e Write, `tool_input.file_path`, sempre absoluto) e, no `PostToolUse`, `tool_response`.

A resposta se dá pelo código de saída:

- **0**: sem objeção. Se o stdout for um objeto JSON completo, ele é interpretado (controle fino). Em `PreToolUse`, sair com 0 **não** aprova a chamada: o fluxo normal de permissões continua.
- **2**: bloqueia a ação; o texto do stderr vira a justificativa (em `PreToolUse`, o Claude a recebe e ajusta o rumo). `PostToolUse` não pode ser bloqueado (a ferramenta já rodou).
- **Outro**: erro não bloqueante; a ação prossegue e um aviso aparece.

Para decisões estruturadas em `PreToolUse`, saia com 0 e imprima só o JSON:

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "Comandos que apagam a pasta de dados são proibidos"
  }
}
```

`permissionDecision` aceita `allow` (pula a pergunta; regras `deny` e `ask` ainda valem), `deny` e `ask`. Escolha uma abordagem por hook: código 2 com stderr, ou código 0 com JSON. E imprima apenas o JSON no stdout; qualquer texto extra impede a leitura.

## Exemplo 1: black após cada edição

Script `.claude/hooks/formatar.py`:

```python
import json
import subprocess
import sys

dados = json.load(sys.stdin)
caminho = dados.get("tool_input", {}).get("file_path", "")
caminho = caminho.replace("\\", "/")
if caminho.endswith(".py"):
    subprocess.run([sys.executable, "-m", "black", "--quiet", caminho])
sys.exit(0)
```

Registro em `.claude/settings.json`:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "python",
            "args": ["${CLAUDE_PROJECT_DIR}/.claude/hooks/formatar.py"],
            "timeout": 60
          }
        ]
      }
    ]
  }
}
```

Teste: peça ao Claude para criar um `.py` com espaços fora do padrão e abra o arquivo; o `black` já terá reformatado. Como o hook roda com o Python do seu PATH, instale o `black` nele (ou aponte para o `python.exe` do `.venv`).

## Exemplo 2: bloquear comandos perigosos

Script `.claude/hooks/bloquear.py`:

```python
import json
import re
import sys

PERIGOSOS = [r"\brm\s+-rf\b", r"\bRemove-Item\b.*-Recurse", r"\bgit\s+push\s+.*--force", r"\bgit\s+reset\s+--hard\b", r"\bdel\s+/s\b"]

dados = json.load(sys.stdin)
comando = dados.get("tool_input", {}).get("command", "")
for padrao in PERIGOSOS:
    if re.search(padrao, comando, re.IGNORECASE):
        print(f"Bloqueado pelo hook: comando perigoso ({padrao})", file=sys.stderr)
        sys.exit(2)
sys.exit(0)
```

Registro, no mesmo `hooks` (como irmão de `PostToolUse`):

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash|PowerShell",
        "hooks": [
          {
            "type": "command",
            "command": "python",
            "args": ["${CLAUDE_PROJECT_DIR}/.claude/hooks/bloquear.py"],
            "onFailure": "block"
          }
        ]
      }
    ]
  }
}
```

As duas ferramentas de shell (`Bash` e `PowerShell`) mandam o comando em `tool_input.command`, então o mesmo script serve para ambas. Teste: peça "apague a pasta build com rm -rf"; o Claude Code bloqueia antes de rodar e o Claude recebe a mensagem do stderr. Lembre da lição 2: o hook vê o texto do comando; um hook bloqueante tem precedência até sobre regras `allow`.

## Erros comuns

- Imprimir texto além do JSON no stdout e o JSON ser ignorado.
- Misturar código 2 com JSON de `allow`: o código 2 bloqueia mesmo assim.
- Hook lento sem `timeout` menor, travando cada edição (o padrão é 600 s).
- Caminho relativo ao script em vez de `${CLAUDE_PROJECT_DIR}`; o hook "não é encontrado".
- Esquecer que `file_path` chega com barras invertidas no Windows ao comparar padrões.
- Hook `PostToolUse` em `Edit|Write` esperando ver arquivos alterados por comandos Bash: para isso existe o evento `FileChanged`.
- Matcher só com `Bash` em uma máquina Windows sem Git Bash, onde a ferramenta de shell é `PowerShell`: o hook nunca dispara.

## Na prática

Dois hooks mudam a rotina de um escritório: formatação automática (ninguém discute estilo nem esquece o `black`) e bloqueio de comandos destrutivos no repositório de dados. Um terceiro, `Notification` com um aviso na tela, deixa você trabalhar em outra coisa enquanto uma tarefa longa roda. Tudo no `.claude/settings.json` do projeto, commitado, valendo para todo mundo.

## Resumo

- Hooks são comandos executados pelo Claude Code em eventos; garantem, não sugerem.
- Eventos principais: `SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `Stop`, `Notification`.
- Formato: evento → grupo com `matcher` → lista de manipuladores `{ "type": "command", ... }`.
- Entrada em JSON no stdin (`tool_name`, `tool_input`); saída por código (0 ok, 2 bloqueia com stderr) ou JSON com `permissionDecision`.
- No Windows, prefira a forma exec (`command` + `args`) com `python` e `${CLAUDE_PROJECT_DIR}`; em hooks de bloqueio, use o matcher `Bash|PowerShell` e `"onFailure": "block"`.
- `/hooks` lista; `disableAllHooks` desliga.
