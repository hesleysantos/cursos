# MCP: Model Context Protocol

Nesta lição você vai entender o que é o **MCP (Model Context Protocol)**, que problema ele resolve, como servidores e clientes se conectam e quais cuidados de segurança são obrigatórios. Ao final, você vai saber explicar como um assistente de IA pode consultar as planilhas, os arquivos e os e-mails do escritório sem que você escreva uma integração do zero para cada sistema.

## O problema que o MCP resolve

Na lição anterior você definiu ferramentas à mão. Funciona, mas cada aplicação de IA precisava reescrever a mesma integração: um conector para o Google Drive no seu agente, outro no Claude Desktop, outro no n8n. É o problema "N × M".

O **MCP** é um protocolo aberto, publicado pela Anthropic em novembro de 2024 e adotado desde então por OpenAI, Google, Microsoft e pela maioria das ferramentas de agentes. Ele padroniza como uma aplicação de IA descobre e usa ferramentas, dados e prompts de um sistema externo. Quem fornece o sistema escreve **um servidor MCP**; qualquer aplicação compatível (um **cliente MCP**) o usa. É o que o USB fez pelos periféricos: um conector padrão em vez de um cabo por aparelho.

## Peças: host, cliente, servidor

| Peça | O que é | Exemplo |
|---|---|---|
| **Host** | A aplicação de IA que o usuário usa | Claude Desktop, Cursor, VS Code, um agente seu em Python |
| **Cliente** | O componente do host que fala o protocolo com um servidor | Uma conexão por servidor configurado |
| **Servidor** | Programa que expõe capacidades de um sistema | Servidor de arquivos, de banco de dados, do Google Drive |

Um servidor MCP oferece três tipos de coisa:

- **Tools (ferramentas)**: funções que o modelo pode chamar, exatamente como no function calling, com nome, descrição e esquema de entrada.
- **Resources (recursos)**: dados que a aplicação pode ler (um arquivo, uma linha de banco), identificados por URI.
- **Prompts**: modelos de instrução prontos.

As *tools* são o que mais se usa. Ao conectar, o cliente pergunta ao servidor "que ferramentas você tem?" (`tools/list`) e recebe a lista com os esquemas; quando o modelo decide usar uma, o cliente envia `tools/call` com nome e argumentos. A mensagem viaja em **JSON-RPC 2.0**, por dois transportes: **stdio** (servidor como processo local, pela entrada e saída padrão) ou **HTTP** (servidor remoto, *Streamable HTTP*).

```python
# Como um cliente ve a resposta de tools/list (JSON-RPC)
import json
resposta = {
    "jsonrpc": "2.0", "id": 1,
    "result": {"tools": [
        {"name": "read_file", "description": "Le o conteudo de um arquivo",
         "inputSchema": {"type": "object", "properties": {"path": {"type": "string"}},
                         "required": ["path"]}},
    ]},
}
for t in resposta["result"]["tools"]:
    print(t["name"], "->", list(t["inputSchema"]["properties"]))
# read_file -> ['path']
```

É o mesmo JSON Schema da lição 2, só que enviado pelo servidor em vez de escrito por você.

## Servidores que existem

Há servidores de referência da comunidade e servidores oficiais de fornecedores:

- **Sistema de arquivos**: lê, escreve e busca em pastas que você autorizar.
- **Bancos de dados**: PostgreSQL, SQLite, MySQL; em geral somente leitura por padrão.
- **Google Drive, Gmail, Google Calendar**: documentos, e-mails e agenda via OAuth.
- **GitHub, Slack, Notion**: ferramentas de trabalho em equipe.
- **Navegador (Playwright)**: abrir páginas e extrair dados.
- **Servidores próprios**: em Python (SDK oficial `mcp`, com `FastMCP`) ou TypeScript, em poucas dezenas de linhas.

No host, a configuração é um arquivo JSON apontando para o comando do servidor (stdio) ou para a URL (HTTP); confira o formato na documentação de cada aplicação.

## Como um contador usaria

Imagine três conexões num assistente de IA de desktop:

1. **Servidor de arquivos** apontando só para a pasta `Clientes/` do servidor do escritório.
2. **Servidor do Google Drive** com a planilha de controle de obrigações.
3. **Servidor de e-mail** com leitura da caixa compartilhada de atendimento.

A conversa fica assim: "Quais clientes do Simples ainda não enviaram os extratos de setembro?" O assistente lê a planilha de controle no Drive, cruza com os arquivos na pasta e responde com a lista. "Já cobramos a Padaria Sol?" Ele busca na caixa de e-mail mensagens para aquele cliente nos últimos dez dias. Nada disso exigiu código: só configurar servidores existentes e autorizar pastas e contas.

O mesmo vale dentro de um agente próprio: os SDKs de agentes (lição 4) conectam-se a servidores MCP e tratam as ferramentas deles como suas; alguns provedores de API aceitam até um servidor MCP remoto direto na chamada do modelo.

## Segurança e permissões

Um servidor MCP é uma porta do seu sistema para o modelo. Cuidados:

- **Escopo mínimo**: o servidor de arquivos só vê as pastas que você listar; o de banco só tem usuário de leitura; o de e-mail só lê, não envia.
- **Confirmação por ferramenta**: hosts sérios pedem aprovação antes de executar uma ferramenta; não marque "sempre permitir" para as que escrevem.
- **Origem confiável**: instale só servidores oficiais ou cujo código você possa ler; um servidor malicioso pode descrever uma ferramenta de forma enganosa para induzir o modelo a vazar dados.
- **Credenciais fora do prompt**: tokens e senhas ficam na configuração do servidor (variáveis de ambiente), nunca na conversa.
- **Injeção indireta**: o conteúdo lido por um servidor (um e-mail, um PDF) pode conter instruções maliciosas; trate-o como dado e exija confirmação para escritas (lição 8).
- **LGPD**: os dados dos clientes passam pelo provedor do modelo; verifique contrato, retenção e uso para treinamento.

## Armadilhas

- **Achar que MCP substitui o function calling**: MCP é uma forma padronizada de **entregar** ferramentas; por baixo, o mecanismo é o mesmo.
- **Conectar dezenas de servidores**: cada ferramenta ocupa contexto e aumenta a chance de escolha errada. Conecte o que a tarefa precisa.
- **Servidor com acesso total ao disco**: um pedido ambíguo vira leitura de documentos pessoais ou escrita no lugar errado.
- **Ignorar atualizações**: o protocolo evolui (autenticação OAuth para servidores remotos, por exemplo); confira modelcontextprotocol.io antes de seguir um tutorial antigo.

## Na prática

Um escritório pequeno, sem programador, instalou no assistente de desktop três servidores: arquivos (pasta de clientes), Google Drive (planilhas de controle) e leitura do sistema de tarefas. Os sócios passaram a perguntar "o que está pendente da empresa X" e "que documentos do cliente Y chegaram". Ferramentas de escrita não foram instaladas. O custo foi uma tarde de configuração e uma política escrita de quais pastas podem ser conectadas.

## Resumo

- MCP é um protocolo aberto que padroniza como aplicações de IA descobrem e usam ferramentas, recursos e prompts de sistemas externos.
- Host (aplicação), cliente (conexão) e servidor (sistema exposto) conversam por JSON-RPC via stdio ou HTTP.
- Há servidores prontos para arquivos, bancos, Google Drive, e-mail e mais; você também pode escrever o seu.
- Para o contador: conectar planilhas, pastas e e-mails a um assistente sem programar integrações.
- Segurança: escopo mínimo, confirmação para escritas, servidores confiáveis, credenciais fora do prompt e atenção à LGPD.
