# Custos, monitoramento e limites

Nesta lição você vai aprender a **enxergar** quanto o Claude Code gasta, a estimar o custo de uma tarefa antes de rodar em lote, a reduzir contexto para gastar menos e a registrar o que o agente fez, tanto para auditoria quanto para acompanhar o consumo de uma equipe.

## O que você paga, e onde ver

Existem dois mundos, e é importante não confundi-los:

- **Assinatura** (Pro, Max, Team, Enterprise): o uso do Claude Code conta contra a cota do plano, com janelas de uso (nas contas Team/Enterprise, a doc descreve uma janela rolante de cinco horas e uma semanal por assento). O valor em dólares mostrado pelo Claude Code **não é cobrança**, pois o uso está incluído. Quem ultrapassa a cota pode habilitar *usage credits* (uso extra) com limite de gasto.
- **API** (Console da Anthropic, ou provedores como Bedrock, Vertex, Foundry): cobrança por token. Aqui o valor estimado importa, e a fatura real está na página de uso do Console; a organização pode definir limites de gasto por *workspace*.

Dentro da sessão, o comando é `/usage` (com os aliases `/cost` e `/stats`). O bloco *Session* mostra custo total estimado, duração, tokens por modelo (entrada, saída, leitura e gravação de cache) e, desde versões recentes, estatísticas de cache de prompt. Em planos por assinatura, `/usage` também mostra barras do plano e uma atribuição de uso por skills, subagentes, plugins e servidores MCP. Os totais zeram quando `/clear` inicia uma sessão nova.

> **Atenção:** o custo é calculado localmente com preço de lista. Com `modelPricing` em settings gerenciados, a organização pode fazer os números baterem com o contrato, mas continuam sendo estimativas.

## Estimar o custo de uma tarefa

O método prático, em quatro passos:

1. Rode a tarefa uma vez com `--output-format json` e leia `total_cost_usd`, `num_turns` e `usage`.
2. Repita com 3 a 5 itens representativos (um documento pequeno, um grande, um difícil).
3. Calcule média e máximo. Multiplique pelo volume mensal.
4. Defina `--max-budget-usd` por execução um pouco acima do máximo observado, e `--max-turns` um pouco acima dos turnos típicos.

```python
def estimar_lote(custos, volume):
    """custos: lista de total_cost_usd observados; volume: itens por mes."""
    media = sum(custos) / len(custos)
    pior = max(custos)
    return {"media": round(media, 4), "mensal": round(media * volume, 2),
            "teto_por_item": round(pior * 1.5, 4)}

print(estimar_lote([0.011, 0.018, 0.009, 0.031], 500))
# {'media': 0.0173, 'mensal': 8.63, 'teto_por_item': 0.0465}
```

Os números são ilustrativos: preços mudam, e a documentação pede que você consulte a página de preços e o `/usage` em vez de decorar valores.

## Reduzir contexto, reduzir custo

A doc de custos é direta: o custo escala com o tamanho do contexto. As táticas que ela lista:

- **`/clear` entre tarefas não relacionadas**; contexto velho é enviado de novo a cada mensagem.
- **`/compact` com instruções** (`/compact Foque nos arquivos alterados e nos testes`) e instruções de compactação no `CLAUDE.md`.
- **`/context`** para ver o que ocupa espaço; **`/btw`** para perguntas laterais que não devem entrar no histórico.
- **Modelo certo**: Sonnet para a maioria; Opus para decisões arquiteturais; Haiku para subagentes simples (`model: haiku` no frontmatter).
- **MCP enxuto**: as definições de ferramentas MCP ficam adiadas por padrão (*tool search*); desative servidores que não usa; prefira CLIs como `gh`.
- **Hooks que pré-processam**: em vez de o Claude ler um log de 10 mil linhas, um hook filtra só os erros.
- **CLAUDE.md curto** (meta: menos de 200 linhas) e instruções de uso ocasional em skills, que só carregam quando invocadas.
- **Subagentes** para operações verbosas (testes, logs): o volume fica no contexto deles.
- **Prompts específicos** e **plan mode** para tarefas complexas, evitando retrabalho.
- Em automação: `--bare`, que não carrega hooks, skills, plugins, MCP, memória automática nem `CLAUDE.md`.

Há também uso de fundo: sumarização de conversas para `--resume`, verificação de status, sugestões de prompt; pequeno, mas existe.

## Monitoramento com OpenTelemetry

Para uma equipe, a doc oferece exportação **OpenTelemetry** de métricas e eventos. Ativa-se por variáveis de ambiente (no shell, no `settings.json` do usuário ou em settings gerenciados; o `.claude/settings.json` de um repositório não consegue ligar a telemetria nem escolher o destino, só desligar um sinal com `none`):

```bash
export CLAUDE_CODE_ENABLE_TELEMETRY=1
export OTEL_METRICS_EXPORTER=otlp
export OTEL_LOGS_EXPORTER=otlp
export OTEL_EXPORTER_OTLP_PROTOCOL=grpc
export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317
```

Métricas exportadas incluem `claude_code.cost.usage`, `claude_code.token.usage`, `claude_code.session.count`, `claude_code.lines_of_code.count`, `claude_code.commit.count` e `claude_code.pull_request.count`. Eventos incluem `claude_code.user_prompt`, `claude_code.tool_result`, `claude_code.tool_decision` e `claude_code.api_request`. A doc chama os eventos de "fonte de dados de auditoria": cada um carrega identidade do usuário e pode ir para um SIEM. Por padrão, o conteúdo dos prompts e dos comandos é **redigido**; `OTEL_LOG_USER_PROMPTS=1` e `OTEL_LOG_TOOL_DETAILS=1` liberam, e isso vai só para o seu coletor, nunca para a Anthropic. Administradores podem impor tudo isso em `managed-settings.json` (bloco `env`).

## Logs e auditoria do que o agente fez

Mesmo sem OpenTelemetry, você tem três fontes:

1. **Transcrições locais**: cada sessão fica em `~/.claude/projects/<projeto>/<session-id>.jsonl`, por 30 dias (`cleanupPeriodDays`). O formato é interno e muda entre versões; para ler, use `/export` ou `claude -p --resume <id> --output-format json "resuma o que fizemos"`.
2. **Saída JSON** de execuções `-p`: `num_turns`, `total_cost_usd`, `permission_denials`, `session_id`. Guarde-a por execução.
3. **Hooks**: um `PreToolUse` com matcher `Bash` pode anexar cada comando a um arquivo de log; a doc mostra o comando `jq -r .tool_input.command >> ~/.claude/bash.log` (o hook sai com código 0 e não decide nada, só registra). Um `ConfigChange` pode registrar mudanças em settings em um log de auditoria.

No Windows, o Agendador de Tarefas tem seu próprio histórico, e o seu script deve gravar início, fim, código de saída e custo de cada item.

## Erros comuns

- Ler o dólar do `/usage` como fatura em plano por assinatura.
- Estimar com um item só, e logo o mais fácil.
- Sessão de oito horas sem `/clear`: cada mensagem reenvia o dia inteiro.
- Opus como padrão para tudo.
- Confiar na transcrição `.jsonl` como formato estável para scripts.
- Ligar `OTEL_LOG_USER_PROMPTS` sem política de privacidade: os prompts contêm dados de clientes.

## Na prática

Para um escritório pequeno: assinatura para o uso diário das pessoas; chave de API (com limite de gasto no workspace) para as automações, que assim aparecem separadas na fatura. Um script de lote grava custo por item; uma planilha mensal compara volume e gasto. Quando a equipe crescer, OpenTelemetry com um coletor simples mostra quem gasta com o quê.

## Resumo

- `/usage` (`/cost`, `/stats`) mostra custo estimado, tokens e, por assinatura, cota e atribuição; o dólar só é cobrança na API.
- Estime com amostra representativa, defina `--max-budget-usd` e `--max-turns` com folga.
- Contexto é custo: `/clear`, `/compact`, modelo adequado, MCP enxuto, hooks filtrando, CLAUDE.md curto, subagentes, `--bare`.
- OpenTelemetry exporta métricas (`claude_code.cost.usage`, `claude_code.token.usage`) e eventos de auditoria; conteúdo redigido por padrão.
- Auditoria local: transcrições em `~/.claude/projects/`, saída JSON das execuções e hooks de log.
