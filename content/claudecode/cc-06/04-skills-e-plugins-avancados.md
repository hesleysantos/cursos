# Skills e plugins avançados

Nesta lição você vai aprender a construir skills com **scripts e recursos** anexos, a empacotar skills, subagentes, hooks e servidores MCP em um **plugin**, a distribuí-lo para a equipe por um *marketplace* próprio e a versioná-lo. O exemplo é um plugin "fechamento-contabil".

## Skills com scripts e recursos

Uma skill é uma pasta com `SKILL.md`. Além dele, a documentação descreve arquivos de apoio que o Claude só abre quando precisa:

```text
fechar-competencia/
├── SKILL.md            (obrigatório: visão geral e navegação)
├── checklist.md        (lido quando necessário)
├── modelo-relatorio.md
└── scripts/
    └── conferir_saldos.py   (executado, não carregado no contexto)
```

Referencie os arquivos a partir do `SKILL.md` ("para o checklist completo, veja [checklist.md](checklist.md)"). Para que um script rode sem prompt de permissão, use a variável `${CLAUDE_SKILL_DIR}` no texto e em `allowed-tools`:

```markdown
---
name: fechar-competencia
description: Fecha a competência contábil de um cliente: confere saldos, concilia e gera o relatório
disable-model-invocation: true
argument-hint: [cnpj] [AAAA-MM]
allowed-tools: Bash(python ${CLAUDE_SKILL_DIR}/scripts/conferir_saldos.py *)
---

Feche a competência $1 do cliente $0.

1. Rode `python ${CLAUDE_SKILL_DIR}/scripts/conferir_saldos.py $0 $1` e leia a saída.
2. Siga o [checklist.md](checklist.md) item a item.
3. Gere o relatório usando [modelo-relatorio.md](modelo-relatorio.md).
4. Não lance nada no sistema; liste as pendências para aprovação.
```

Campos verificados na doc: `name` (padrão: nome da pasta), `description` (como o Claude decide usar), `disable-model-invocation` (só você invoca; ideal para procedimentos com efeitos), `user-invocable: false` (só o Claude), `allowed-tools`, `model`, `context: fork` (roda em subagente), `agent`, `paths`, `argument-hint`, `hooks`, e `shell: powershell` para injeção de comandos com `!`. `$ARGUMENTS` recebe tudo; `$0`, `$1`, `$2` (atalhos de `$ARGUMENTS[0]`, `$ARGUMENTS[1]`...) pegam argumentos individuais, e o índice **começa em zero**: em `/fechar-competencia 11222333000181 2026-09`, `$0` é o CNPJ e `$1` é a competência. Mantenha o `SKILL.md` abaixo de 500 linhas. Em `claude -p`, incluir `/fechar-competencia 11222333000181 2026-09` no prompt invoca a skill.

## Plugins: estrutura

Um plugin é uma pasta com um manifesto e componentes. Só o manifesto fica em `.claude-plugin/`; o resto fica na raiz do plugin:

```text
fechamento-contabil/
├── .claude-plugin/
│   └── plugin.json
├── skills/
│   ├── coletar/SKILL.md
│   ├── conciliar/SKILL.md
│   └── relatorio/SKILL.md
├── agents/
│   ├── revisor.md
│   └── testador.md
├── hooks/
│   └── hooks.json
└── .mcp.json
```

O manifesto, conforme a doc:

```json
{
  "name": "fechamento-contabil",
  "description": "Skills, agentes, hooks e MCP para o fechamento mensal do escritório",
  "version": "1.0.0",
  "author": {
    "name": "Totali Contabilidade"
  }
}
```

`name` é obrigatório e vira o prefixo de tudo: a skill `conciliar` passa a ser `/fechamento-contabil:conciliar`, e o agente `revisor` vira `fechamento-contabil:revisor`. `hooks/hooks.json` tem um objeto `hooks` com o mesmo formato do `settings.json`. O `.mcp.json` do plugin pode usar `${CLAUDE_PLUGIN_ROOT}` para apontar para arquivos dentro dele.

Validação e teste local:

```powershell
claude plugin validate .\fechamento-contabil
claude --plugin-dir .\fechamento-contabil
```

Dentro da sessão, `/fechamento-contabil:conciliar` executa a skill; `/reload-plugins` recarrega após edições; `/plugin` mostra o que carregou e a aba **Errors**. Um plugin habilitado entra em **todas** as sessões do escopo em que foi habilitado (escopo `user`: todos os seus projetos; `project`: todos que abrem aquele repositório): nomes e descrições de skills e agentes ficam no contexto a cada turno, e seus servidores MCP sobem junto; portanto, inclua só o que a equipe usa.

## Marketplace próprio

Um marketplace é um repositório com `.claude-plugin/marketplace.json` listando plugins e de onde buscá-los. É um catálogo, não uma loja. Estrutura mínima:

```json
{
  "name": "totali-plugins",
  "description": "Plugins do escritório",
  "owner": {
    "name": "Totali Contabilidade"
  },
  "plugins": [
    {
      "name": "fechamento-contabil",
      "source": "./plugins/fechamento-contabil",
      "description": "Fechamento mensal"
    }
  ]
}
```

O `source` relativo parte da raiz do marketplace (a pasta que contém `.claude-plugin/`); plugins em repositórios próprios usam `{ "source": "github", "repo": "org/repo" }`. O nome da entrada deve ser igual ao `name` do `plugin.json`. Fluxo:

```powershell
claude plugin validate .\totali-plugins
claude plugin marketplace add .\totali-plugins
claude plugin install fechamento-contabil@totali-plugins
claude plugin list
```

Publicado em um repositório Git (pode ser privado), a equipe roda `claude plugin marketplace add org/totali-plugins` e instala pelo nome. Dentro da sessão, `/plugin marketplace add` e `/plugin install` fazem o mesmo. O marketplace oficial da Anthropic se chama `claude-plugins-official`.

## Distribuir para a equipe

Para que todo mundo do repositório use o plugin sem comandos manuais, registre o marketplace e habilite o plugin no `.claude/settings.json` do projeto:

```json
{
  "extraKnownMarketplaces": {
    "totali-plugins": {
      "source": { "source": "github", "repo": "totali/totali-plugins" }
    }
  },
  "enabledPlugins": {
    "fechamento-contabil@totali-plugins": true
  }
}
```

As entradas de `extraKnownMarketplaces` só valem depois que a pessoa confiou na pasta (diálogo de confiança). Escopos de instalação: `user` (todos os seus projetos), `project` (todos no repositório, via `.claude/settings.json`), `local` (só você, só aqui). Para a organização inteira, os mesmos campos vão em settings gerenciados (lição 7).

## Versionar

`version` no `plugin.json` segue o formato `major.minor.patch`. A doc explica o efeito: com `version` definida, os usuários ficam nessa versão até você mudá-la; quando mudar, o marketplace entrega a nova. Boas práticas: um `CHANGELOG.md` no plugin, tags no repositório, e `claude plugin eval` para checar se a mudança ainda produz o comportamento esperado antes de publicar. Marketplaces com `autoUpdate` atualizam em segundo plano; para controle total, deixe desligado e peça atualização explícita.

## Erros comuns

- Colocar `skills/` dentro de `.claude-plugin/`: não carrega.
- Apontar `--plugin-dir` para a raiz do marketplace em vez da pasta do plugin.
- Nome da entrada no marketplace diferente do `name` do manifesto.
- Skill com efeitos colaterais sem `disable-model-invocation: true`.
- Hooks duplicados: o mesmo hook em `settings.json` e em `hooks/hooks.json` roda duas vezes.
- `SKILL.md` gigante: tudo entra no contexto quando a skill é usada.

## Na prática

O plugin "fechamento-contabil" é a forma de o escritório ter um fechamento igual em todas as máquinas: as três skills (coletar, conciliar, relatório), o revisor e o testador como subagentes, um hook que bloqueia escrita fora de `saida/`, e o servidor MCP de clientes. Mudou a regra? Nova versão, changelog, todos atualizam. O projeto final monta esse plugin.

## Resumo

- Skills podem ter arquivos de apoio e scripts; `${CLAUDE_SKILL_DIR}` em `allowed-tools` libera o script; `disable-model-invocation` para procedimentos.
- Plugin: `.claude-plugin/plugin.json` + `skills/`, `agents/`, `hooks/hooks.json`, `.mcp.json`; nomes ganham o prefixo do plugin.
- `claude plugin validate`, `--plugin-dir` e `/reload-plugins` para desenvolver; `/plugin` para inspecionar.
- Marketplace: `.claude-plugin/marketplace.json`; `claude plugin marketplace add` e `claude plugin install nome@marketplace`.
- Equipe: `extraKnownMarketplaces` + `enabledPlugins` no `.claude/settings.json`; versão no manifesto controla atualizações.
