# Carreira e comunidade

Nesta lição você vai olhar para fora do terminal: quais habilidades diferenciam quem trabalha bem com agentes de código, como montar um **portfólio** que prove essas habilidades, onde estão as fontes oficiais e a comunidade, e como acompanhar um produto que muda toda semana sem se perder.

## As habilidades que importam

Depois de dois módulos de automação, a lista de habilidades fica clara, e quase nenhuma é "saber digitar prompts":

1. **Decompor trabalho** em etapas com entrada, saída e verificação (módulo 6, lição 1). É a habilidade central; vale para agentes e para pessoas.
2. **Escrever contratos**: esquemas JSON, critérios de aceite, `CLAUDE.md` curto e preciso.
3. **Revisar**: ler um diff com atenção, pedir evidência, desconfiar de mudança fora do escopo.
4. **Medir**: taxa de sucesso, custo por item, regressões; decidir com números.
5. **Pensar em segurança**: modelo de ameaças, permissões mínimas, tríade letal, LGPD.
6. **Dominar o domínio**: no seu caso, contabilidade. O agente não sabe qual alíquota se aplica a uma situação específica do cliente; você sabe, e transforma isso em regras, testes e skills. É a parte que a IA não substitui.
7. **Comunicar**: explicar para colegas e clientes o que o agente faz, o que não faz, e por que a aprovação continua humana.

O profissional que o mercado procura não é "quem usa IA", é quem **entrega resultados confiáveis com IA**, com rastreabilidade e custo conhecido.

## Portfólio: repositórios que mostram método

Um portfólio de quem trabalha com agentes de código é um conjunto de repositórios públicos (ou privados, apresentáveis em entrevista) em que a **configuração** conta tanto quanto o código. O que colocar:

- Um `CLAUDE.md` exemplar: curto, com comandos, regras do domínio e instruções de compactação; mostra que você entende contexto.
- `.claude/rules/` com regras por caminho; `.claude/skills/` com dois ou três procedimentos reais (com scripts e `disable-model-invocation` onde há efeito); `.claude/agents/` com um revisor e um testador.
- Hooks em `.claude/settings.json`: formatação após edição, bloqueio de escrita em pastas protegidas, log de comandos.
- Um `.mcp.json` com um servidor próprio (lição 3) e o código dele.
- Um workflow de GitHub Actions com revisão de PR.
- Um `README` que explique a arquitetura dos agentes, os contratos, o conjunto de avaliação e os resultados medidos (taxa, custo).
- `DECISOES.md` com as escolhas e os porquês.

O projeto final deste módulo é exatamente um repositório assim. Dois ou três projetos nesse formato dizem mais que qualquer certificado: quem lê vê método, segurança e medição.

Dica para o README: inclua uma seção "O que o agente não pode fazer" com as regras de permissão. Mostra maturidade.

## Fontes oficiais

Guarde estes endereços; tudo o que foi verificado neste curso veio deles:

| Fonte | O que tem |
|---|---|
| `code.claude.com/docs` | Documentação oficial do Claude Code: referência da CLI, settings, permissões, hooks, skills, subagentes, MCP, plugins, GitHub Actions, custos, segurança |
| `code.claude.com/docs/en/agent-sdk/overview` | Agent SDK (Python e TypeScript) |
| `github.com/anthropics/claude-code` | Repositório: `CHANGELOG.md` com cada versão (numeração do tipo `2.1.x`), *issues*, o dev container de referência (`.devcontainer/`), plugins oficiais |
| `github.com/anthropics/claude-code-action` | A action do GitHub: exemplos de workflow, FAQ, guia de segurança e de migração |
| `github.com/anthropics/claude-agent-sdk-python` e `-typescript` | SDKs, com `CHANGELOG.md` e *issues* |
| `modelcontextprotocol.io` e `github.com/modelcontextprotocol/python-sdk` | Especificação do MCP e o SDK Python (`mcp`) |
| `anthropic.skilljar.com` (Anthropic Academy) | Cursos como *Claude Code 101* e *Claude Code in Action* |
| `claude.com/marketplace` | Catálogo de plugins e conectores |
| `trust.anthropic.com` e `privacy.anthropic.com` | Certificações, retenção de dados |

Dentro da própria ferramenta: `/help`, `claude --help` (que não lista tudo), `/doctor`, `/status` e o subagente embutido `claude-code-guide`, que lê a documentação oficial para responder perguntas pontuais.

## Comunidade

A comunidade acontece em três lugares: as *issues* dos repositórios oficiais (onde bugs são reportados e recursos pedidos), grupos de profissionais da sua área que usam agentes (contadores e automação contábil), e o `/feedback` dentro do Claude Code, que envia a transcrição à Anthropic quando você escolhe reportar. Participar bem: reportar com passos reproduzíveis, compartilhar skills e hooks úteis (um plugin com marketplace, lição 4), nunca dados de clientes.

## Como acompanhar mudanças sem se perder

O Claude Code recebe atualizações frequentes, e instalações nativas se atualizam sozinhas. A doc chega a avisar que "mudanças de comportamento" acontecem e que `claude --version` mostra a sua versão. Um método que cabe em 20 minutos por semana:

1. **Leia o `CHANGELOG.md`** do repositório oficial, filtrando pelo que você usa (`-p`, hooks, permissões, MCP). As entradas marcam quando um recurso exige uma versão mínima.
2. **Reexecute o lote de avaliação** (lição 5) depois de uma atualização relevante. Se a taxa caiu, você tem o número e a versão.
3. **Fixe versões onde importa**: em CI e contêineres, instale uma versão específica (`claude install X.Y.Z`, que aceita também `stable` ou `latest`, ou `npm install -g @anthropic-ai/claude-code@X.Y.Z` com `DISABLE_AUTOUPDATER=1`) e atualize de propósito, não por acaso.
4. **Distinga nome antigo e novo**: *custom commands* viraram skills; *headless* virou modo não interativo (`-p`); *Claude Code SDK* virou Agent SDK; `includeCoAuthoredBy` virou `attribution`. A doc costuma manter o nome antigo como alias por um tempo.
5. **Confie na documentação, não na memória** (sua ou do modelo): antes de escrever uma flag em um script de produção, confira na referência da CLI. Este curso fez isso para cada comando.
6. **Anote em `DECISOES.md`** quando uma mudança de versão alterou o seu fluxo.

## Erros comuns

- Portfólio só com código gerado, sem configuração, testes nem medição.
- Seguir tutoriais antigos com nomes obsoletos (`FastMCP`, `@beta`, `--enable-auto-mode`).
- Atualizar o CI sem querer e descobrir pela falha.
- Reportar um bug sem versão, comando e passos.
- Compartilhar prompts com dados reais de clientes em grupos.

## Na prática

Reserve uma hora por semana: 20 minutos de changelog, 20 minutos rodando o lote de avaliação, 20 minutos melhorando uma skill ou um hook do portfólio. Em seis meses, você terá um repositório que demonstra método e um histórico de medições que nenhum curso dá. Para o escritório, isso se converte em automações que continuam funcionando quando a ferramenta muda.

## Resumo

- Habilidades: decompor, contratar (esquemas, critérios), revisar, medir, pensar segurança, dominar o domínio, comunicar.
- Portfólio: repositórios com `CLAUDE.md`, rules, skills com scripts, subagentes, hooks, MCP próprio, workflow de CI, avaliação e decisões documentadas.
- Fontes oficiais: `code.claude.com/docs`, repositórios `anthropics/claude-code`, `claude-code-action`, `claude-agent-sdk-*`, `modelcontextprotocol`, Anthropic Academy.
- Acompanhe pelo `CHANGELOG.md`, reexecute o lote de avaliação, fixe versões em CI, confira flags na doc antes de usar.
- Participe reportando bem e compartilhando skills, nunca dados de clientes.
