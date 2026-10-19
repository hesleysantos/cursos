Nesta lição você vai aprender como o Claude Code é configurado: quais arquivos de configuração existem, onde ficam no Windows, qual vale quando dois dizem coisas diferentes, o formato JSON que eles usam, as chaves mais importantes e as variáveis de ambiente que mudam o comportamento da ferramenta. Ao final você saberá ler e escrever um `settings.json` sem adivinhar. Nos módulos anteriores você usou o Claude Code com a configuração padrão; a partir daqui, você passa a moldá-lo ao escritório.

## Os arquivos de configuração

A documentação oficial lista estes arquivos de configuração (settings), cada um com um alcance:

| Arquivo | Vale para | Uso típico |
| --- | --- | --- |
| `~/.claude/settings.json` | Você, em todos os projetos desta máquina | Preferências pessoais, regras de permissão suas |
| `.claude/settings.json` (na pasta do projeto) | Todos que trabalham no projeto; vai para o Git | Regras do time, hooks, permissões do projeto |
| `.claude/settings.local.json` | Só você, só neste projeto; não vai para o Git | Experimentos, aprovações que você salvou |
| Configurações gerenciadas (managed) | Todos na organização; impostas pelo administrador | Política de segurança da empresa |

No Windows, `~/.claude` significa `%USERPROFILE%\.claude`, normalmente `C:\Users\SeuNome\.claude`. Os arquivos de usuário e local não precisam ser criados à mão: o Claude Code cria `~/.claude/settings.json` na primeira vez que você muda uma opção em `/config` e cria `.claude/settings.local.json` na primeira vez que você responde "sim, e não pergunte de novo" a uma permissão.

Há ainda `~/.claude.json`, que o Claude Code escreve para si mesmo (login, servidores MCP, decisões de confiança); não o edite à mão.

## Precedência: quem vence

Quando a mesma chave aparece em mais de um lugar, vale o nível mais alto desta lista:

1. Configurações gerenciadas (organização).
2. Linha de comando (`claude --settings <arquivo-ou-json>`), só naquela sessão.
3. `.claude/settings.local.json` (local do projeto).
4. `.claude/settings.json` (projeto compartilhado).
5. `~/.claude/settings.json` (usuário).

Há uma exceção importante: chaves que são **listas**, como `permissions.allow`, não se sobrescrevem; elas se **somam** entre os arquivos. Assim, a regra que você salvou no arquivo local continua valendo junto com as regras do projeto. E, dentro das permissões, uma regra de negar em qualquer nível vence uma regra de permitir em outro, como você verá na próxima lição.

## O formato: JSON estrito

Os arquivos são JSON estrito: sem comentários `//` e sem vírgula sobrando depois do último item. Um erro de sintaxe faz o Claude Code reportar o arquivo como inválido no início da sessão. Exemplo mínimo e válido de `~/.claude/settings.json`:

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "permissions": {
    "allow": ["Bash(git status *)", "Bash(pytest *)"],
    "deny": ["Read(./.env)"]
  },
  "env": {
    "BASH_DEFAULT_TIMEOUT_MS": "300000"
  }
}
```

A linha `$schema` aponta para o esquema publicado das configurações; com ela, editores como o VS Code mostram as chaves possíveis e apontam erros enquanto você digita. Vale a pena incluir.

## As chaves principais

Entre as muitas chaves documentadas, estas são as que um escritório usa primeiro:

- **`permissions`**: listas `allow`, `ask` e `deny`, `defaultMode` (modo inicial), `additionalDirectories` (pastas extras) e `disableBypassPermissionsMode` (lição 2).
- **`env`**: variáveis de ambiente para toda sessão e seus processos; escreva os valores por extenso (caminhos absolutos, sem `~` nem `%VAR%`), porque não passam por um shell.
- **`model`**: modelo inicial das sessões (apelido como `sonnet` ou nome completo).
- **`hooks`**: comandos seus em pontos do ciclo de vida (lição 6).
- **`outputStyle`**, **`statusLine`**, **`enabledPlugins`**: estilo de resposta, linha de status e plugins (lição 8).
- **`enabledMcpjsonServers`** e **`disabledMcpjsonServers`**: servidores do `.mcp.json` aprovados ou rejeitados (lição 7).
- **`cleanupPeriodDays`**: dias de retenção das transcrições.
- **`language`**: idioma em que o Claude deve responder (por exemplo, `"português do Brasil"`).

A lista completa está na página "All settings" da documentação.

## /config e /permissions

Dentro de uma sessão no terminal, `/config` abre a interface de configurações com uma aba de opções pessoais (tema, modo do editor, saída detalhada, entre outras). A maior parte do que você muda ali é gravada em `~/.claude/settings.json` (algumas opções vão para `.claude/settings.local.json` ou para `~/.claude.json`). Também dá para definir uma opção sem abrir o menu: `/config verbose=true`. Já `/permissions` abre o diálogo que lista todas as regras de permissão e de qual arquivo cada uma veio, permitindo adicionar e remover regras por escopo. E `/status` mostra, entre outras coisas, quais arquivos de configuração foram carregados, o primeiro lugar para olhar quando "a configuração não pegou".

> **Atenção:** `/config` é parte da interface do terminal. A extensão do VS Code e o aplicativo desktop não abrem esse menu; neles você edita os arquivos diretamente ou usa as configurações do próprio aplicativo.

## Variáveis de ambiente importantes

Algumas variáveis mudam o comportamento do Claude Code sem mexer em arquivo de configuração. As mais relevantes para você:

- `ANTHROPIC_API_KEY`: chave de API; quando definida, é usada no lugar da sua assinatura (em modo interativo, o Claude Code pede confirmação uma vez). Nunca a coloque em arquivo de projeto.
- `ANTHROPIC_MODEL`: modelo da sessão; tem prioridade sobre a chave `model` dos arquivos.
- `CLAUDE_CONFIG_DIR`: muda a pasta de configuração (padrão `~/.claude`); útil para separar duas contas.
- `CLAUDE_CODE_EFFORT_LEVEL`: nível de esforço de raciocínio (`low`, `medium`, `high`, `xhigh`, `max`).
- `BASH_DEFAULT_TIMEOUT_MS`: tempo máximo padrão de um comando de shell, em milissegundos (padrão 120000).
- `DISABLE_TELEMETRY`: qualquer valor não vazio desliga a telemetria (`0` ou `false` também desligam; para religar, remova a variável).

No PowerShell, `$env:NOME = "valor"` antes de `claude` vale para aquela sessão; para valer sempre, use o bloco `env` do `settings.json` ou as variáveis de ambiente do Windows.

## Erros comuns

- Vírgula sobrando ou comentário no JSON: o arquivo inteiro é ignorado.
- Colocar `ANTHROPIC_API_KEY` no `.claude/settings.json` do projeto, que vai para o Git.
- Esperar que `defaultMode: "bypassPermissions"` funcione a partir do arquivo do projeto: esse valor (e `auto`) só vale em configurações de usuário ou gerenciadas.
- Editar `~/.claude.json` à mão e corromper o login ou os servidores MCP.
- Procurar o arquivo em `%APPDATA%`: o lugar é `%USERPROFILE%\.claude`.

## Na prática

Um escritório pequeno costuma ter: no `~/.claude/settings.json` de cada pessoa, tema e modelo preferido; no `.claude/settings.json` de cada repositório, as permissões e os hooks de todos; no `.claude/settings.local.json`, o que cada um aprovou trabalhando. Quando a empresa crescer, as regras de segurança migram para configurações gerenciadas.

## Resumo

- Quatro níveis: usuário (`~/.claude/settings.json`), projeto (`.claude/settings.json`), local (`.claude/settings.local.json`) e gerenciado; no Windows, `~` é `%USERPROFILE%`.
- Precedência: gerenciado > linha de comando > local > projeto > usuário; listas como `permissions.allow` se somam.
- JSON estrito, com `$schema` para ajuda do editor.
- Chaves principais: `permissions`, `env`, `model`, `hooks`, `outputStyle`, `statusLine`, `enabledPlugins`.
- `/config` muda opções pessoais, `/permissions` gerencia regras, `/status` mostra o que foi carregado.
- Variáveis de ambiente como `ANTHROPIC_MODEL`, `CLAUDE_CONFIG_DIR` e `CLAUDE_CODE_EFFORT_LEVEL` ajustam a sessão sem editar arquivos; segredos como `ANTHROPIC_API_KEY` ficam fora de qualquer arquivo versionado.
