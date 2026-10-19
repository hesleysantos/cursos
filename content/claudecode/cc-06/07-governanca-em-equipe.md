# Governança em equipe

Nesta lição você vai aprender a fazer o Claude Code funcionar **igual para todo mundo** no escritório: settings gerenciados pela organização, padrões de `CLAUDE.md`, revisão de PRs gerados por IA, atribuição em commits, registro de decisões e treinamento da equipe.

## Settings gerenciados

A documentação descreve **managed settings** (settings gerenciados): configurações que a organização implanta em cada máquina e que ficam **acima** de todos os outros níveis. A precedência é: gerenciados > linha de comando (`--settings`) > `.claude/settings.local.json` > `.claude/settings.json` > `~/.claude/settings.json`. Uma chave gerenciada não pode ser sobreposta por usuário, projeto ou flag (com poucas exceções, em que um valor **mais restrito** de nível inferior ainda vale).

Três formas de entrega:

- **Arquivo** `managed-settings.json` em pasta do sistema: no Windows, `C:\Program Files\ClaudeCode\managed-settings.json`; no macOS, `/Library/Application Support/ClaudeCode/managed-settings.json`; no Linux e WSL, `/etc/claude-code/managed-settings.json`.
- **MDM** (Intune, Jamf, GPO): o mesmo JSON entregue por política.
- **Server-managed settings**: configuradas no console de administração do claude.ai, para organizações Team e Enterprise; buscadas na inicialização e a cada hora.

O exemplo da doc, que nega dois arquivos, desliga o modo bypass e ignora regras de permissão de outros níveis:

```json
{
  "permissions": {
    "deny": [
      "Read(./.env)",
      "Read(./secrets/**)"
    ],
    "disableBypassPermissionsMode": "disable"
  },
  "allowManagedPermissionRulesOnly": true
}
```

Outras chaves verificadas: `allowManagedHooksOnly` (só hooks da organização), `allowedMcpServers`/`deniedMcpServers`, `strictKnownMarketplaces` e `enabledPlugins` (plugins obrigatórios ou proibidos), `disableSideloadFlags` (bloqueia `--plugin-dir`), `env` (variáveis para toda sessão, inclusive telemetria), `claudeMd` (instruções organizacionais dentro do próprio arquivo), `modelPricing`, `companyAnnouncements`, `forceLoginMethod` e `forceLoginOrgUUID`. Para confirmar que a política chegou, `/status` mostra `Enterprise managed settings` em *Setting sources*.

A doc separa papéis: **settings para imposição técnica** (bloquear ferramentas, exigir sandbox, variáveis), **CLAUDE.md para orientação de comportamento**. Um `CLAUDE.md` gerenciado pode ficar em `C:\Program Files\ClaudeCode\CLAUDE.md` (Windows) e vale para todos os usuários da organização.

## Padrões de CLAUDE.md

Para uma equipe, combine três níveis:

| Nível | Arquivo | Conteúdo |
|---|---|---|
| Organização | gerenciado (`claudeMd` ou arquivo do sistema) | política: nunca lançar sem aprovação, LGPD, idioma |
| Projeto | `./CLAUDE.md` + `.claude/rules/*.md` | comandos de teste, estrutura, regras contábeis fixas; regras com `paths` para partes específicas |
| Pessoa | `~/.claude/CLAUDE.md` e `./CLAUDE.local.md` (no `.gitignore`) | preferências individuais |

Padrões que a doc recomenda: curto (meta de 200 linhas), só o que o Claude não descobriria lendo o código, instruções verificáveis, `IMPORTANT` em uma linha quando algo é ignorado (não em todas), revisão periódica, `/doctor` para sugerir cortes e `/doctor prompt-audit` para contradições. Um modelo de seção:

```markdown
# Regras contábeis (não alterar sem aprovação da responsável técnica)
- Competência é AAAA-MM; nunca inferir do nome do arquivo.
- Valores em centavos inteiros no banco; formatar só na saída.
- Qualquer lançamento proposto vai para `pendencias/`, nunca direto ao sistema.

# Testes
- `python -m pytest -q` antes de qualquer commit.
```

Versione o `CLAUDE.md` e trate mudanças como código: PR, revisão, lote de avaliação (lição 5).

## Revisão de PR gerado por IA

Um PR aberto por agente passa pelo mesmo processo que o de uma pessoa, com três cuidados a mais:

1. **Evidência**: o PR deve mostrar o que foi verificado (saída dos testes, comando executado). A doc recomenda que o Claude mostre evidência em vez de afirmar sucesso.
2. **Revisão independente**: use o padrão escritor/revisor; o `/code-review` ou um subagente revisor confere o diff com contexto fresco. Mas a aprovação final é humana.
3. **Escopo**: nada fora do pedido. Mudança "extra" é sinal de alerta.

Em GitHub Actions, o workflow de revisão automática (módulo anterior) é o primeiro filtro; proteção de branch exige aprovação humana para o merge.

## Atribuição em commits

Por padrão, o Claude Code adiciona a commits um trailer `Co-Authored-By: <nome do modelo> <noreply@anthropic.com>` e, a descrições de PR, a linha `🤖 Generated with [Claude Code](https://claude.com/claude-code)`. A chave `attribution` em settings controla isso (`attribution.commit`, `attribution.pr`; a antiga `includeCoAuthoredBy` está obsoleta). Para ocultar a linha do PR, por exemplo:

```json
{
  "attribution": {
    "pr": ""
  }
}
```

A recomendação de governança é **manter** a atribuição: ela deixa claro, no histórico, o que foi gerado por agente, o que ajuda em auditoria e em revisão. Se a organização quiser um texto próprio, defina-o em settings gerenciados para que seja igual em todas as máquinas.

## Registro de decisões

Decisões sobre uso de IA somem se ficarem em conversas. Mantenha um `DECISOES.md` (ou ADRs, *architecture decision records*) no repositório: data, decisão, motivo, alternativas descartadas. Exemplos: "2026-10: automações usam chave de API em workspace próprio, não assinatura pessoal"; "modo bypass proibido por settings gerenciados"; "documentos de clientes só em conta comercial". Hooks `ConfigChange` podem registrar quando settings mudam durante uma sessão (a doc mostra um exemplo que grava em um log de auditoria), e a telemetria OpenTelemetry registra decisões de ferramenta por usuário.

## Treinamento da equipe

O que funciona, pela experiência relatada na documentação e na prática de equipes:

- **Começar pela revisão**: antes de gerar código, aprender a revisar diffs e a pedir evidência.
- **Permissões explicadas**: por que `default` existe, o que `acceptEdits` libera, por que bypass é proibido.
- **Sessões de pareamento**: uma pessoa experiente mostra `/context`, `/compact`, subagentes.
- **Um projeto piloto** com métricas (taxa de sucesso, custo) antes de expandir.
- **Canal de dúvidas e de incidentes**: o que deu errado vira caso de teste e, se for o caso, regra em settings.
- **Material oficial**: a Anthropic Academy (cursos em `anthropic.skilljar.com`) tem cursos como *Claude Code 101* e *Claude Code in Action* para iniciantes.

## Erros comuns

- Política só em `CLAUDE.md`: é orientação, não imposição; o que precisa ser garantido vai em settings gerenciados ou hooks.
- `defaultMode: "bypassPermissions"` em `.claude/settings.json` do projeto: a doc diz que esse valor não tem efeito a partir desse arquivo.
- Cada pessoa com seu `CLAUDE.md` de projeto divergente, sem versionar.
- Remover a atribuição "para ficar mais limpo" e perder rastreabilidade.
- Treinar só a ferramenta e não a revisão.

## Na prática

Um escritório com cinco pessoas: `managed-settings.json` entregue por GPO com `deny` de segredos, bypass desligado, telemetria para um coletor simples; `CLAUDE.md` do repositório com regras contábeis e testes; `.claude/rules/` por área; atribuição padrão mantida; `DECISOES.md`; revisão de PR com evidência e aprovação humana; um piloto de dois meses com lote de avaliação antes de liberar automações.

## Resumo

- Settings gerenciados (arquivo em `C:\Program Files\ClaudeCode\`, MDM ou console do claude.ai) ficam acima de tudo; use-os para imposição técnica.
- `CLAUDE.md` em três níveis, curto, versionado, revisado por lote; gerenciado para política da organização.
- PR de IA: evidência, revisão independente, escopo, aprovação humana.
- Mantenha a atribuição (`Co-Authored-By` e linha do PR); controle com `attribution` em settings.
- Registre decisões; treine revisão antes de geração; comece com piloto medido.
