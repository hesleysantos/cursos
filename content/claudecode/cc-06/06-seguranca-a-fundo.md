# Segurança a fundo

Nesta lição você vai montar um **modelo de ameaças** para o uso de agentes no escritório e ver, ponto a ponto, o que o Claude Code oferece contra cada ameaça: sandboxing, permissões por regra, revisão de servidores MCP, gestão de segredos e, por fim, como tratar dados de clientes à luz da **LGPD**.

## Modelo de ameaças

Um modelo de ameaças responde: o que pode dar errado, por onde, e o que perdemos. Para um agente que lê documentos de terceiros e acessa o sistema de arquivos:

| Ameaça | Vetor | Dano |
|---|---|---|
| **Injeção de prompt** | arquivo processado, página web, resultado de ferramenta MCP, README de repositório clonado | agente executa ações que você não pediu |
| **Exfiltração** | comando de rede (`curl`), ferramenta de escrita externa, commit com segredo | dados de clientes ou credenciais saem |
| **Comando destrutivo** | `rm -rf`, `git reset --hard`, `DROP TABLE`, sobrescrita de arquivos | perda de trabalho ou de dados |
| **Servidor MCP malicioso ou vulnerável** | ferramenta com descrição enganosa; servidor que busca conteúdo externo | injeção e exfiltração por dentro |
| **Vazamento de segredo** | chave em prompt, em `CLAUDE.md`, em log, em transcrição | uso indevido da conta |

A documentação de implantação segura da Anthropic remete, nas leituras recomendadas, à "tríade letal" descrita por Simon Willison: acesso a dados privados, exposição a conteúdo não confiável e capacidade de comunicar para fora. Juntos no mesmo agente, o risco é máximo (uma injeção pode levar dados para fora); a estratégia é nunca juntar os três.

## O que o Claude Code oferece

**Permissões.** No modo manual (`default`), o Claude Code começa somente leitura e pergunta antes de editar ou executar; `curl` e `wget` não são aprovados automaticamente; comandos que ele não consegue analisar por completo pedem aprovação mesmo com regra `Bash(git *)`; a correspondência é *fail-closed*. Regras `deny` valem em todos os modos. No modo `auto`, um classificador revisa ações e bloqueia escalada de escopo e ações dirigidas por conteúdo hostil, mas é um controle por ação, não uma fronteira de isolamento.

**Sandboxing.** O sandbox do Bash (`/sandbox`, `sandbox.enabled`) isola comandos de shell: escrita só na pasta de trabalho e temporários, leitura com `denyRead` para `~/.ssh` e afins, rede só para `network.allowedDomains` por um proxy local. Roda em macOS, Linux e WSL2; **no Windows nativo, não**. Ferramentas de arquivo, MCP e hooks ficam fora. Para cobrir tudo: sandbox runtime, dev container, contêiner próprio ou VM. Configuração mínima, montada a partir dos exemplos da doc (que mostra o bloco `filesystem` e o bloco `network` em exemplos separados):

```json
{
  "sandbox": {
    "enabled": true,
    "filesystem": {
      "denyRead": ["~/"],
      "allowRead": ["."]
    },
    "network": {
      "allowedDomains": ["github.com"]
    }
  }
}
```

**Proteções embutidas.** Escritas em caminhos protegidos (estado do repositório e configuração do próprio Claude Code) nunca são aprovadas automaticamente fora de `bypassPermissions`; `rm` em caminhos críticos (raiz, home, pasta de trabalho) é barrado; o `WebFetch` resume a página em chamada separada; credenciais ficam em armazenamento protegido por usuário.

## Permissões por regra

Avaliação `deny → ask → allow`. Um conjunto defensivo para o escritório:

```json
{
  "permissions": {
    "deny": [
      "Read(./.env)",
      "Read(./segredos/**)",
      "Read(~/.ssh/**)",
      "Bash(curl *)",
      "Bash(wget *)",
      "Bash(rm -rf *)",
      "Edit(.claude/**)"
    ],
    "ask": [
      "Bash(git push *)",
      "Edit(dados/clientes/**)"
    ],
    "allow": [
      "Bash(python -m pytest *)",
      "Bash(git status *)",
      "Bash(git diff *)"
    ]
  }
}
```

`ask` é o meio-termo: a ação é possível, mas sempre com confirmação. Limitações documentadas: uma regra de Bash casa o texto **como escrito** (um `curl` por caminho absoluto ou dentro de `sh -c` escapa), e regras de caminho só valem para `Read` e `Edit` (escreva `Edit(docs/**)`, não `Write(docs/**)`). Hooks `PreToolUse` com `exit 2` complementam, pois inspecionam o comando inteiro.

## Revisão de servidores MCP

A doc de segurança é direta: a Anthropic não audita servidores MCP; use os seus ou os de fornecedores confiáveis. Checklist antes de conectar:

1. **Origem**: código aberto e legível? Quem mantém?
2. **Ferramentas**: liste-as (`/mcp`); alguma escreve, apaga ou envia? Precisa mesmo?
3. **Conteúdo externo**: o servidor busca páginas ou e-mails? É um canal de injeção; não combine com ferramentas de efeito externo.
4. **Escopo**: um `.mcp.json` em repositório clonado conecta servidores **sem perguntar** em execuções `-p`.
5. **Permissões**: regras `mcp__servidor__*`; `deniedMcpServers`/`allowedMcpServers` em settings gerenciados.
6. **Segredos**: `${VAR}` em `env`, nunca valor literal.

Servidores próprios: somente leitura, SQL parametrizado, `requiresUserInteraction` nas ferramentas sensíveis (lição 3).

## Segredos

Onde segredos **não** podem estar: prompt, `CLAUDE.md`, repositório, log, transcrição. Onde podem: variáveis de ambiente do processo, arquivo protegido lido pelo script, ou um proxy que injeta a chave fora da fronteira do agente (o padrão recomendado pela doc para implantações sérias). A doc lista arquivos que vazam credenciais mesmo em montagem somente leitura: `.env`, `~/.git-credentials`, `~/.aws/credentials`, `~/.kube/config`, `.npmrc`, `*.pem`. Negue a leitura deles.

Transcrições locais ficam em `~/.claude/projects/` em texto puro por 30 dias; se um prompt continha um segredo, ele está lá (`claude purge` apaga o estado de um projeto). A telemetria OpenTelemetry redige prompts e comandos por padrão; só ative `OTEL_LOG_USER_PROMPTS` com política clara.

## LGPD com dados de clientes em prompts

Quando você cola um extrato ou um contrato no Claude Code, dados pessoais (nome, CPF, salário) vão para o provedor do modelo. Pontos verificados na documentação de uso de dados:

- Em contas **comerciais** (Team, Enterprise, API), a Anthropic **não treina** modelos com código ou prompts; retenção padrão de 30 dias; existe *Zero Data Retention* para contas qualificadas.
- Em contas de **consumidor** (Free, Pro, Max), o treinamento depende da preferência de privacidade do usuário e a retenção varia conforme ela (30 dias sem treino; 5 anos com).
- Dados trafegam com TLS; a sessão fica localmente em texto puro.

Para a LGPD: use conta comercial para dados de clientes; registre o provedor como operador no inventário de tratamento; minimize (envie só o necessário e **anonimize** CPF e nomes quando a tarefa não precisa deles, que é o exercício de código desta lição); defina retenção local (`cleanupPeriodDays`); informe os clientes no contrato; nunca envie dados sensíveis (saúde, biometria) sem base legal e necessidade real.

## Erros comuns

- Juntar leitura de conteúdo externo com ferramenta de envio na mesma sessão.
- `deny: ["Bash(rm *)"]` como única defesa contra destruição.
- Colar a planilha de salários inteira para perguntar sobre uma linha.
- Conta pessoal (Pro) para dados de clientes.

## Na prática

Monte o modelo de ameaças do escritório em uma página: ativos, vetores, controles. Para cada automação, marque quais lados da tríade ela tem; se tiver os três, divida-a em duas. Revise trimestralmente: servidores MCP novos, regras, retenção, contratos.

## Resumo

- Ameaças: injeção, exfiltração, comandos destrutivos, MCP malicioso, vazamento de segredo; nunca junte dados privados + conteúdo não confiável + saída externa.
- Claude Code: permissões *fail-closed* e `deny` em todo modo; sandbox do Bash (não no Windows nativo, não cobre MCP/hooks); `WebFetch` resumido; modo `auto` como controle por ação.
- Regras `deny → ask → allow` com `Read`, `Edit`, `Bash(cmd *)`, `mcp__*`; hooks determinísticos complementam.
- MCP: origem, ferramentas, conteúdo externo, escopo, permissões, segredos.
- LGPD: conta comercial, minimização e anonimização, retenção definida, transparência com o cliente.
