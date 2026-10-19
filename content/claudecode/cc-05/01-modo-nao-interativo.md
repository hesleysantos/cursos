# Modo não interativo: `claude -p`

Até aqui você usou o Claude Code conversando com ele no terminal. Nesta lição você vai aprender a chamá-lo **sem conversa**: um comando, uma resposta, fim. Esse é o **modo não interativo** (antes chamado de *headless* ou *print mode*), ativado pela flag `-p`. É a base de toda automação deste módulo: scripts, lotes, agendamentos e integração contínua dependem dele.

## O que muda com `-p`

Em uma sessão normal, o Claude Code abre uma interface, espera suas mensagens e pede permissão antes de agir. Com `-p` (ou `--print`), ele recebe o prompt pela linha de comando, executa o trabalho e **imprime o resultado na saída padrão**, encerrando em seguida. Não há interface, não há diálogo de confiança da pasta e, por padrão, **não há ninguém para responder a um pedido de permissão**: o que exigiria aprovação é negado, a menos que você libere antes.

```powershell
claude -p "Explique o que o script conciliar.py faz"
```

A documentação oficial chama isso de usar o Agent SDK pela CLI: o mesmo motor que roda na sessão interativa, só que controlado por um programa. O código de saída segue a convenção de qualquer comando: `0` em caso de sucesso e diferente de zero quando a execução falha. Isso permite que um script PowerShell ou bash decida o que fazer a seguir.

## Entrada por pipe

A entrada padrão (stdin) também é lida. Você pode "encanar" um arquivo para o Claude, o que evita dar permissão de leitura de arquivos quando o conteúdo já vai no próprio comando. Exemplo clássico: resumir um log de importação de extratos.

```powershell
Get-Content .\logs\importacao.log | claude -p "Resuma este log em até 5 linhas: quantos arquivos entraram, quais falharam e por quê"
```

Em bash:

```bash
cat logs/importacao.log | claude -p "Resuma este log em até 5 linhas: quantos arquivos entraram, quais falharam e por quê"
```

A documentação fixa um limite: a entrada por pipe é cortada em **10 MB**; acima disso o comando encerra com erro. Para arquivos maiores, salve em disco e cite o caminho no prompt (o que exige a ferramenta `Read` liberada).

## As flags que você vai usar

| Flag | Para quê |
|---|---|
| `--output-format text\|json\|stream-json` | `text` é o padrão; `json` devolve um objeto com `result`, `session_id`, custo e metadados; `stream-json` emite um JSON por linha enquanto a execução acontece |
| `--allowedTools "Read,Edit,Bash(git diff *)"` | Ferramentas liberadas sem perguntar (mesma sintaxe das regras de permissão) |
| `--disallowedTools "Edit"` | Ferramentas negadas; um nome puro remove a ferramenta do contexto |
| `--permission-mode dontAsk` | Nega automaticamente tudo o que pediria aprovação; ideal para execução não assistida |
| `--max-turns 3` | Limite de turnos agênticos; ao atingir, encerra com erro |
| `--max-budget-usd 1.00` | Interrompe quando a estimativa de gasto chega ao valor (estimativa do cliente, não a fatura) |
| `--model sonnet` | Escolhe o modelo por apelido ou nome completo |
| `--append-system-prompt "..."` | Acrescenta instruções ao prompt de sistema sem perder o comportamento padrão |
| `--bare` | Pula hooks, skills, plugins, MCP e CLAUDE.md para iniciar mais rápido e de forma previsível |
| `--no-session-persistence` | Não grava a sessão em disco |
| `--continue` / `--resume <id>` | Continua uma conversa anterior |

Todas estão na página *CLI reference* da documentação; `claude --help` não lista todas, então a doc é a referência.

> **Atenção:** uma execução `-p` **não mostra o diálogo de confiança da pasta**, mas ainda carrega os hooks do `.claude/settings.json` do projeto e conecta os servidores do `.mcp.json`. Em pastas que você não controla, use `--bare` ou `--setting-sources user`.

Outro cuidado: em scripts, passe sempre `--permission-mode` de forma explícita. Sem a flag, o modo inicial de uma execução `-p` depende da versão, do plano e das suas configurações (pode ser o modo manual ou o modo `auto`, em que um classificador revisa as ações); escrevendo `--permission-mode dontAsk` você garante o mesmo comportamento em qualquer máquina.

## Exemplo completo: resumir um log em um script

Um script PowerShell que roda todo dia, resume o log e grava a saída:

```powershell
$log = Get-Content .\logs\importacao.log -Raw
$resumo = $log | claude -p "Resuma em português, em até 5 linhas, quantos arquivos foram importados, quais falharam e a causa provável" `
  --bare --output-format text --max-turns 1 --permission-mode dontAsk
if ($LASTEXITCODE -ne 0) {
  Write-Error "Claude falhou (código $LASTEXITCODE)"
  exit 1
}
$resumo | Set-Content .\relatorios\resumo-log.txt -Encoding utf8
```

Com `--bare`, o Claude Code não lê a credencial do login por assinatura (nem a variável `CLAUDE_CODE_OAUTH_TOKEN`): defina `ANTHROPIC_API_KEY` no ambiente (ou um `apiKeyHelper` via `--settings`) antes de rodar. Sem `--bare`, uma sessão `-p` usa a credencial que já estiver configurada; a chave `ANTHROPIC_API_KEY`, quando presente, é sempre usada em modo não interativo.

A mesma ideia em bash, aproveitando o código de saída:

```bash
cat logs/importacao.log | claude -p "Resuma em até 5 linhas" --bare --max-turns 1 \
  --permission-mode dontAsk > relatorios/resumo-log.txt || echo "falhou"
```

## Erros comuns

- **Esquecer as permissões.** Sem `--allowedTools` ou um modo de permissão adequado, o Claude não consegue editar nem rodar comandos; ele relata que foi negado e o resultado vem incompleto. Decida antes o que a tarefa precisa.
- **Confundir `--allowedTools` com `--tools`.** A primeira libera sem perguntar; a segunda restringe quais ferramentas existem na sessão.
- **Deixar sem limite.** Sem `--max-turns` e `--max-budget-usd`, uma tarefa mal definida pode rodar muitos turnos. Em automação, limite sempre.
- **Ler stdout como se fosse só o resultado.** Avisos vão para stderr, mas falhas internas da execução (por exemplo, autenticação ausente) são impressas como resultado na saída padrão. Verifique o código de saída e, de preferência, use `--output-format json` (lição 2).
- **Rodar em pasta desconhecida sem `--bare`.** Hooks e servidores MCP de um repositório clonado rodam sem perguntar.

## Na prática

No escritório, o modo `-p` serve para o que se repete: resumir o log da importação bancária, revisar o diff do commit antes de abrir o PR, classificar e-mails exportados, gerar o texto de um memorando a partir de uma planilha. A regra de ouro é: **tarefa curta, prompt específico, permissões mínimas, limite de turnos e verificação do código de saída**. Comece sempre rodando à mão uma vez, com `--verbose`, para ver o que o agente faz; só depois coloque no script.

## Resumo

- `claude -p "prompt"` executa uma tarefa e encerra; `0` é sucesso, outro código é falha.
- A entrada pode vir por pipe (até 10 MB); o resultado sai em stdout.
- `--allowedTools`, `--permission-mode dontAsk`, `--max-turns`, `--max-budget-usd` e `--model` controlam o que o agente pode fazer e quanto pode gastar.
- `--output-format json` devolve resultado e metadados para scripts; `stream-json` emite eventos em tempo real.
- `--bare` deixa a execução previsível em scripts e CI, mas exige `ANTHROPIC_API_KEY`.
