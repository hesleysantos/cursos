# Agent SDK

Nesta lição você vai conhecer o **Claude Agent SDK** (antes chamado de Claude Code SDK): a biblioteca que coloca o motor do Claude Code dentro de um programa seu em **Python** ou **TypeScript**. Ao final, você saberá quando ele vale mais que a CLI, qual é a estrutura mínima de um script e como escrever a lógica Python em volta do agente: ler o resultado, controlar passos e custo.

## O que é

A documentação define assim: o Agent SDK dá a você as mesmas ferramentas, o mesmo laço agêntico e o mesmo gerenciamento de contexto que movem o Claude Code, programáveis em Python e TypeScript. Ele é uma biblioteca que **executa o binário do Claude Code** por baixo e expõe as mensagens como objetos. Capacidades disponíveis: ferramentas embutidas (ler, editar, rodar comandos, buscar na web), hooks, subagentes, MCP, permissões, sessões, skills e CLAUDE.md, plugins.

A tabela de comparação oficial ajuda a escolher:

| Você quer | Use |
|---|---|
| Embutir o agente do Claude Code em um app Python/TypeScript seu | **Agent SDK** |
| Trabalhar no terminal, tarefas pontuais | **CLI** (`claude` ou `claude -p`) |
| Chamar a API do Claude direto e escrever o laço de ferramentas | **SDK de cliente** (API) |
| Deixar a Anthropic hospedar o agente | **Managed Agents** |

Em outras linguagens, o caminho é rodar a CLI como subprocesso com `-p` e `--output-format json`, como fizemos na lição 2. Ou seja: **CLI `-p` para scripts simples; Agent SDK quando você precisa de mensagens tipadas, múltiplos turnos no mesmo processo, callbacks de permissão ou saída estruturada integrada ao código**.

## Instalação

Pré-requisitos: Python 3.10+ (ou Node 18+) e uma chave de API da Anthropic. No Windows, em PowerShell:

```powershell
py -m venv .venv
.venv\Scripts\Activate.ps1
pip install claude-agent-sdk
$env:ANTHROPIC_API_KEY = "sua-chave"
```

O pacote Python traz o binário do Claude Code embutido (a doc avisa exceções, como Windows ARM64, em que é preciso instalar o Claude Code nativamente). O SDK **não lê arquivos `.env`** sozinho: a chave precisa estar no ambiente do processo. Em TypeScript, o pacote é `@anthropic-ai/claude-agent-sdk`.

> **Atenção:** a documentação é explícita: produtos construídos com o Agent SDK não podem oferecer login do claude.ai nem usar os limites da assinatura; use chave de API.

## Estrutura mínima de um script

A função central é `query()`, assíncrona, que devolve um iterador de mensagens. O exemplo abaixo é o do quickstart oficial, adaptado só no prompt:

```python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions, AssistantMessage, ResultMessage, TextBlock


async def main():
    options = ClaudeAgentOptions(
        allowed_tools=["Read", "Grep"],
        permission_mode="dontAsk",
        max_turns=5,
        max_budget_usd=0.50,
    )
    async for message in query(prompt="Resuma o que conciliar.py faz", options=options):
        if isinstance(message, AssistantMessage):
            for block in message.content:
                if isinstance(block, TextBlock):
                    print(block.text)
        elif isinstance(message, ResultMessage):
            print("fim:", message.subtype, "turnos:", message.num_turns, "custo:", message.total_cost_usd)


asyncio.run(main())
```

Esse script não roda no navegador do curso (precisa do pacote, do binário e da chave). O que importa entender:

- `ClaudeAgentOptions` recebe o que você passava por flags: `allowed_tools`, `disallowed_tools`, `permission_mode` (`default`, `acceptEdits`, `plan`, `dontAsk`, `bypassPermissions`, `auto`), `max_turns`, `max_budget_usd`, `cwd`, `model`, `system_prompt`, `output_format`, `mcp_servers`, `setting_sources`, `resume`, `continue_conversation`.
- As mensagens chegam em ordem: `AssistantMessage` (texto e chamadas de ferramenta), e no fim uma `ResultMessage`.
- `ResultMessage` tem `subtype` (`success`, `error_max_turns`, `error_max_budget_usd`, `error_during_execution`, `error_max_structured_output_retries`), `is_error`, `result`, `structured_output`, `total_cost_usd` (pode ser `None`), `num_turns`, `session_id`, `usage`.

Para saída estruturada, passe `output_format={"type": "json_schema", "schema": {...}}` e leia `message.structured_output` na `ResultMessage`. Para conversa com vários turnos no mesmo processo, use `ClaudeSDKClient` (`await client.query(...)` e `client.receive_response()`), que mantém a sessão entre chamadas.

## A lógica Python ao redor

O agente decide os passos; o **seu código** decide o que fazer com eles. Três controles que valem em qualquer script:

```python
def avaliar_resultado(resultado, limite_custo):
    """Decide o que fazer com uma ResultMessage ja convertida em dict."""
    custo = resultado.get("total_cost_usd") or 0.0
    if resultado.get("is_error") or resultado.get("subtype") != "success":
        return "reprocessar"
    if custo > limite_custo:
        return "revisar_custo"
    if resultado.get("structured_output") is None:
        return "sem_dados"
    return "ok"

print(avaliar_resultado({"subtype": "success", "is_error": False,
                         "total_cost_usd": 0.02, "structured_output": {"tipo": "nf"}}, 0.10))
# ok
print(avaliar_resultado({"subtype": "error_max_turns", "is_error": True,
                         "total_cost_usd": 0.30}, 0.10))
# reprocessar
```

1. **Parse defensivo**: trate `None` em `total_cost_usd` e a ausência de `structured_output` mesmo com `success` (a doc recomenda tratar como falha).
2. **Controle de passos**: `max_turns` limita o laço; se o `subtype` for `error_max_turns`, não repita com o mesmo prompt, simplifique a tarefa ou divida em etapas.
3. **Orçamento**: `max_budget_usd` corta a execução; some `total_cost_usd` de cada chamada para o total do lote. A doc lembra que chamadas independentes somam, mas chamadas que **retomam** uma sessão já incluem o gasto anterior, então leia o último resultado em vez de somar.

Um detalhe de implementação apontado na documentação: com `ClaudeSDKClient`, evite sair do laço de mensagens com `break`, pois isso pode causar problemas de limpeza do `asyncio`; deixe o laço terminar ou use uma flag.

## Erros comuns

- Achar que o SDK é a API: ele roda um agente com ferramentas; para chamada simples ao modelo, use o SDK de cliente da API.
- Esquecer `asyncio.run(main())` ou chamar `query()` fora de contexto assíncrono.
- `allowed_tools` não restringe: só pré-aprova. Para limitar o que existe, use `disallowed_tools`.
- Não definir `cwd`: o agente trabalha na pasta de onde o script foi chamado.
- Deixar `.env` e esperar que o SDK carregue a chave.

## Na prática

Um bom primeiro projeto com o SDK é o "robô de triagem" da lição 9: Python lê a fila, chama `query()` com esquema, valida, grava em SQLite. O SDK compensa quando você precisa de vários turnos com memória (ex.: "classifique" e depois "agora explique o item 3"), de um callback para aprovar ferramentas em um fluxo com revisão humana, ou de hooks programáticos. Para um laço simples de `-p`, a CLI continua sendo a opção mais direta.

## Resumo

- Agent SDK: motor do Claude Code como biblioteca, em Python (`claude-agent-sdk`) e TypeScript; binário embutido; chave de API no ambiente.
- Padrão mínimo: `async for message in query(prompt=..., options=ClaudeAgentOptions(...))`, filtrando `AssistantMessage`/`TextBlock` e lendo a `ResultMessage`.
- `ResultMessage` traz `subtype`, `is_error`, `result`, `structured_output`, `total_cost_usd`, `num_turns`, `session_id`.
- Controles no seu código: parse defensivo, `max_turns`, `max_budget_usd`, decisão por `subtype`.
- SDK para integração profunda e múltiplos turnos; CLI `-p` para scripts simples; API direta para chamadas sem ferramentas.
