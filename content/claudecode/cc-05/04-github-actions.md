# GitHub Actions com Claude Code

Nesta lição você vai colocar o Claude Code para trabalhar **dentro do GitHub**: revisar pull requests automaticamente, responder quando alguém escreve `@claude` em uma issue e rodar tarefas agendadas, sem depender da sua máquina. Vai entender a configuração mínima, a questão dos segredos, as permissões e os custos.

## A action oficial

A integração se chama **Claude Code GitHub Actions** e é a action `anthropics/claude-code-action@v1`, mantida no repositório `anthropics/claude-code-action`. Ela é construída sobre o Agent SDK: o mesmo motor da CLI roda dentro do *runner* do GitHub, com acesso ao repositório clonado. Não confunda com o **Code Review** (revisão automática sem workflow, configurada pelo app) nem com o Claude Code na nuvem; aqui falamos do workflow YAML que você escreve.

Ela trabalha em dois modos, detectados pelo próprio arquivo:

- **Interativo**: sem o input `prompt`, o Claude espera a frase de gatilho (`@claude`, por padrão) em comentários de issue ou PR, em revisões de PR, ou no corpo/título de uma issue nova, e responde em um comentário.
- **Automação**: com `prompt`, o Claude roda em qualquer evento do GitHub, inclusive `schedule`, e o resultado vai para o log da execução (ou para o PR, se o prompt mandar e houver ferramenta para isso).

## Configuração mínima

Há dois caminhos. O rápido: dentro de uma sessão do Claude Code no repositório, rodar `/install-github-app`. Ele instala o Claude GitHub App, cria o segredo e abre um PR com o workflow. Precisa do `gh` CLI autenticado e de acesso de administrador ao repositório; funciona só com github.com.

O manual, útil para entender as peças:

1. Instalar o **Claude GitHub App** no repositório (permissões de Contents, Issues e Pull requests em leitura e escrita).
2. Criar um **segredo**: `ANTHROPIC_API_KEY` (chave do Console) ou `CLAUDE_CODE_OAUTH_TOKEN` (token gerado por `claude setup-token`, válido por um ano, exige plano Pro, Max, Team ou Enterprise e consome a sua assinatura).
3. Copiar `examples/claude.yml` do repositório da action para `.github/workflows/`.

O workflow de resposta a `@claude`, copiado da documentação:

```yaml
name: Claude Code
on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
jobs:
  claude:
    if: contains(github.event.comment.body, '@claude')
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
      issues: write
      id-token: write
      actions: read
    steps:
      - uses: actions/checkout@v6
        with:
          fetch-depth: 1
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
```

Se você usa o token da assinatura, troque a última linha por `claude_code_oauth_token: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}`. O `id-token: write` é exigido pela autenticação padrão via GitHub App; `actions: read` deixa o Claude ler resultados de CI.

Depois do merge, qualquer pessoa **com acesso de escrita** no repositório pode comentar:

```text
@claude revise esta função de conciliação e aponte casos de borda não tratados
```

A action verifica quem disparou: usuários sem escrita são rejeitados (há o input `allowed_non_write_users` para exceções, que exige também um `github_token` próprio), e bots são bloqueados a menos que listados em `allowed_bots`, para evitar laços. Eventos sem autor humano, como `schedule`, pulam a verificação de escrita.

## Revisão automática de PR

Para revisar todo PR aberto ou atualizado, a documentação mostra um workflow em modo automação que instala o plugin `code-review` e chama a skill dele:

```yaml
name: Code Review
on:
  pull_request:
    types: [opened, synchronize, ready_for_review, reopened]
jobs:
  review:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: read
      issues: read
      id-token: write
    steps:
      - uses: actions/checkout@v6
        with:
          fetch-depth: 1
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          plugin_marketplaces: "https://github.com/anthropics/claude-code.git"
          plugins: "code-review@claude-code-plugins"
          prompt: "/code-review:code-review --comment ${{ github.repository }}/pull/${{ github.event.pull_request.number }}"
          claude_args: '--allowedTools "mcp__github_inline_comment__create_inline_comment"'
```

O `--comment` faz o Claude postar comentários no PR; sem ele, a revisão fica só no log. O `claude_args` precisa listar a ferramenta MCP de comentário inline, senão a action nem inicia o servidor que posta. Em repositórios públicos, o GitHub não entrega segredos a PRs vindos de forks, então a revisão só roda em branches do próprio repositório.

## Agendamento no CI

Com `prompt` e `on: schedule`, você tem um cron que roda na nuvem do GitHub. Lembre-se de que, com prompt em texto puro, o Claude não tem shell nem API do GitHub até você liberar ferramentas em `claude_args` (`--allowedTools`) ou em `permissions.allow` no input `settings`. O GitHub só executa workflows agendados a partir da branch padrão e, em repositórios públicos, desativa o agendamento após 60 dias sem atividade.

## Custos e permissões

Cada execução consome duas coisas: **minutos do GitHub Actions** (runners hospedados) e **tokens** (API, ou a assinatura se você usa o token OAuth). Para controlar, a documentação recomenda:

- `--max-turns` em `claude_args`;
- `timeout-minutes` no job, para não ter execuções fugitivas;
- controles de `concurrency` do GitHub;
- pedidos `@claude` específicos e `CLAUDE.md` enxuto (ele é lido a toda execução).

Permissões: dê ao workflow só o que ele usa (o exemplo de revisão só lê). Nunca escreva a chave no YAML; sempre `${{ secrets.NOME }}`. Para a organização, use um segredo em nível de organização e um workflow reutilizável, autenticando com chave do Console (o token OAuth fica preso à assinatura de quem o gerou).

## Erros comuns

- Comentar `/claude` ou `@claude-bot`: o gatilho exige `@claude` como palavra completa.
- Esquecer `id-token: write`: a autenticação padrão via app falha.
- Passar `github_token: ${{ secrets.GITHUB_TOKEN }}`: commits feitos com esse token **não disparam** outros workflows; deixe a action autenticar como o app.
- Prompt automático sem ferramentas liberadas: o Claude "não consegue" fazer nada e o log mostra negações.
- Ainda usar `@beta`: migre para `@v1`, remova `mode` e troque `direct_prompt` por `prompt`.

## Na prática

Para um escritório que mantém scripts de conciliação em um repositório, dois workflows bastam: revisão automática em todo PR (modo automação, somente leitura) e `@claude` para pedir correções pontuais em issues. Combine com um `CLAUDE.md` que diga como testar e quais regras contábeis não podem mudar. Revise sempre o PR do Claude antes do merge: a action faz o trabalho, a aprovação continua humana.

## Resumo

- A action oficial é `anthropics/claude-code-action@v1`; configure com `/install-github-app` ou manualmente (app + segredo + YAML).
- Segredo: `ANTHROPIC_API_KEY` ou `CLAUDE_CODE_OAUTH_TOKEN` (de `claude setup-token`), sempre via `secrets`.
- Sem `prompt` → responde a `@claude`; com `prompt` → automação em qualquer evento, inclusive `schedule`.
- Revisão de PR: workflow com o plugin `code-review`, `--comment` e a ferramenta de comentário liberada em `claude_args`.
- Custos = minutos de Actions + tokens; limite com `--max-turns`, `timeout-minutes` e `concurrency`; permissões mínimas.
