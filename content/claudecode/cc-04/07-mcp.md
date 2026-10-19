Nesta lição você vai conectar o Claude Code a ferramentas externas pelo **MCP** (Model Context Protocol): entender o que é, adicionar servidores com `claude mcp add`, escolher o escopo certo, escrever o `.mcp.json` do projeto, usar recursos de um servidor com `@`, conhecer servidores reais e, principalmente, decidir em quem confiar. Um escritório que conecta o Claude Code a arquivos, a um banco de dados ou a um serviço na nuvem precisa saber o que está abrindo.

## O que é MCP

MCP é um padrão aberto para conectar assistentes de IA a fontes de dados e ferramentas. Um **servidor MCP** é um programa (local ou hospedado) que expõe ferramentas (ações), recursos (dados para leitura) e prompts. O Claude Code é o cliente: conecta-se, descobre o que o servidor oferece e usa essas ferramentas como usa as próprias. Com um servidor de sistema de arquivos, lê uma pasta fora do projeto; com um de banco de dados, consulta tabelas; com um de serviço na nuvem, abre tarefas ou lê documentos.

## Adicionando um servidor

O comando roda no seu terminal (em qualquer shell, PowerShell inclusive), **fora** de uma sessão `claude`. Servidor hospedado (transporte HTTP):

```powershell
claude mcp add --transport http claude-code-docs https://code.claude.com/docs/mcp
```

É um bom primeiro servidor: hospedado pela Anthropic, oferece busca na documentação do Claude Code e não exige autenticação. Servidor local (transporte `stdio`, o padrão), em que o Claude Code inicia o programa como subprocesso; tudo depois de `--` é o comando do servidor:

```powershell
claude mcp add arquivos -- npx -y @modelcontextprotocol/server-filesystem C:\automacoes\exemplos
```

`npx -y` baixa e executa o pacote sem perguntar (exige Node.js instalado); o último argumento é a pasta que o servidor pode acessar. O `--` é obrigatório para que as opções do servidor não sejam lidas como opções do `claude`. Variáveis de ambiente para o servidor vão com `--env CHAVE=valor`, e cabeçalhos de autenticação de servidores HTTP com `--header "Authorization: Bearer <token>"`.

Depois, confira e gerencie:

```powershell
claude mcp list
claude mcp get arquivos
claude mcp remove arquivos
```

`claude mcp list` mostra o estado de cada servidor (`Connected`, `Needs authentication`, `Failed to connect`, `Pending approval`). Dentro da sessão, `/mcp` abre o painel para ver ferramentas, reconectar e autenticar servidores com login no navegador. Se um servidor `stdio` demorar para iniciar (o `npx` baixando o pacote), aumente o limite com `$env:MCP_TIMEOUT = "60000"; claude` (milissegundos).

## Escopos

| Escopo | Flag | Onde fica | Quem vê |
| --- | --- | --- | --- |
| `local` (padrão) | `--scope local` | `~/.claude.json`, na entrada deste projeto | Só você, só neste projeto |
| `project` | `--scope project` | `.mcp.json` na raiz do projeto | Todos que clonam o projeto |
| `user` | `--scope user` | `~/.claude.json` | Só você, em todos os projetos |

Quando o mesmo nome existe em mais de um escopo, vale local, depois projeto, depois usuário. No Windows, `~/.claude.json` é `%USERPROFILE%\.claude.json`.

## O .mcp.json do projeto

O escopo `project` grava um arquivo versionável. Exemplo com um servidor HTTP e um `stdio`:

```json
{
  "mcpServers": {
    "claude-code-docs": {
      "type": "http",
      "url": "https://code.claude.com/docs/mcp"
    },
    "arquivos": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "${PASTA_EXEMPLOS:-C:/automacoes/exemplos}"]
    }
  }
}
```

O arquivo aceita expansão de variáveis de ambiente em `command`, `args`, `env`, `url` e `headers`: `${VAR}` usa o valor de `VAR`, e `${VAR:-padrao}` usa `padrao` quando a variável não existe. É assim que você compartilha a configuração sem gravar caminhos pessoais nem segredos. Se uma alteração feita à mão no `.mcp.json` não aparecer em `/mcp`, encerre e abra a sessão de novo.

Por segurança, na primeira vez que vê um servidor de projeto, o Claude Code pede sua aprovação (um repositório clonado não pode iniciar programas na sua máquina sem consentimento). Para refazer essas escolhas, `claude mcp reset-project-choices`. Em execuções não interativas (`claude -p`), os servidores de projeto carregam sem perguntar; para bloquear um, use a chave `disabledMcpjsonServers` nas configurações (e `enabledMcpjsonServers` para aprovar).

## Usando recursos e prompts do servidor

Servidores podem expor **recursos**, referenciados como arquivos com `@servidor:protocolo://caminho`; digite `@` no prompt para vê-los junto com os arquivos. Exemplos da documentação: `@github:issue://123`, `@docs:file://api/authentication`. Prompts expostos pelo servidor aparecem como comandos: `/mcp__servidor__prompt`, com argumentos separados por espaço. E as ferramentas do servidor entram nas regras de permissão com o nome `mcp__servidor__ferramenta`; `mcp__arquivos__*` libera todas as ferramentas do servidor `arquivos`.

## Servidores úteis (nomes reais)

- **claude-code-docs** (HTTP, `https://code.claude.com/docs/mcp`): documentação do Claude Code com busca; ótimo primeiro teste.
- **@modelcontextprotocol/server-filesystem** (stdio, via `npx`): acesso a pastas que você escolhe; servidor de referência do projeto MCP.
- **@playwright/mcp** (stdio, `npx -y @playwright/mcp@latest`): um navegador que o Claude controla, mantido pelo projeto Playwright.
- Serviços hospedados com login no navegador, como **Sentry** (`https://mcp.sentry.dev/mcp`) e **Notion** (`https://mcp.notion.com/mcp`); o **GitHub** usa token no cabeçalho (`--header "Authorization: Bearer <token>"`).

Para bancos de dados, a documentação mostra um servidor `stdio` ligado ao PostgreSQL e recomenda conectar com um usuário **somente leitura**; procure no diretório oficial de servidores um que atenda ao seu banco e siga a mesma regra.

## Segurança: em quem confiar

A documentação é direta: verifique se confia em cada servidor antes de conectar; servidores que buscam conteúdo externo expõem você a **injeção de prompt** (uma página ou documento com instruções escondidas que o modelo pode seguir). Regras para o escritório:

1. Só servidores de origem conhecida (projeto MCP, fabricante do serviço, diretório oficial).
2. Sistema de arquivos apontando para pastas de exemplo ou de trabalho, nunca para a raiz do disco nem para a pasta de certificados.
3. Credenciais via `--env`, variáveis de ambiente ou `${VAR}` no `.mcp.json`; nunca o token literal no arquivo commitado.
4. Banco de dados com usuário somente leitura.
5. Permissões `mcp__servidor__*` apenas para o que a tarefa exige; o resto continua perguntando.
6. Cada servidor conectado ocupa contexto (nomes de ferramentas e instruções); remova os que não usa.

## Erros comuns

- Esquecer o `--` e ver as opções do servidor serem interpretadas pelo `claude`.
- Rodar `claude mcp add` dentro de uma sessão em vez de no terminal.
- Adicionar no escopo local em um projeto e procurar o servidor em outro.
- Editar `.mcp.json` à mão com erro de JSON e não conferir em `/mcp` se o servidor apareceu.
- Caminho pessoal ou token no `.mcp.json` commitado; use `${VAR:-padrao}`.

## Na prática

Um kit inicial de escritório tem dois servidores: a documentação do Claude Code e um sistema de arquivos apontando para a pasta compartilhada de modelos e amostras. Novas necessidades (tarefas no sistema de gestão, banco de dados) passam pelas seis regras acima antes de ligar.

## Resumo

- MCP conecta o Claude Code a servidores que oferecem ferramentas, recursos e prompts.
- `claude mcp add --transport http nome url` para hospedados; `claude mcp add nome -- comando args` para locais; `list`, `get`, `remove` para gerenciar; `/mcp` dentro da sessão.
- Escopos `local` (padrão), `project` (`.mcp.json`, versionável) e `user`.
- `.mcp.json` com `mcpServers`, `type`, `url` ou `command`/`args`, e expansão `${VAR:-padrao}`.
- Recursos com `@servidor:protocolo://caminho`; prompts como `/mcp__servidor__prompt`; permissões `mcp__servidor__ferramenta`.
- Confie só em servidores conhecidos, limite pastas e credenciais, use somente leitura em bancos.
