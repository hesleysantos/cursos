# Gestão avançada de contexto

Nesta lição você vai entender **o que entra** na janela de contexto do Claude Code, o que isso custa, e as estratégias para manter o contexto útil: sessões curtas, resumos, arquivos de notas, `/compact` dirigido, prevenção de poluição e medição com `/context` e `/usage`.

## O que entra no contexto

A documentação tem uma simulação da janela de contexto que mostra o que carrega **antes do seu primeiro prompt**:

- o prompt de sistema do Claude Code;
- a **memória automática** (`MEMORY.md`, as primeiras 200 linhas ou 25 KB);
- informações do ambiente (pasta, sistema, git);
- os **nomes** das ferramentas MCP (as definições completas ficam adiadas até o uso, pelo *tool search*);
- `CLAUDE.md` da pasta atual e das pastas acima, `CLAUDE.local.md`, `.claude/rules/*.md` sem `paths`, e os arquivos importados com `@`;
- a lista de skills que o Claude pode invocar sozinho (só nome e descrição; skills com `disable-model-invocation: true` ficam fora até você chamá-las).

Depois disso, cada coisa que acontece soma: cada arquivo lido, cada saída de comando, cada resultado de ferramenta, cada resposta. Regras com `paths` carregam quando um arquivo que casa é lido; `CLAUDE.md` de subpastas carrega quando o Claude mexe em arquivos dali. Hooks devolvem contexto via `additionalContext`. Subagentes trabalham em janelas próprias e só o resumo volta.

Por que isso importa: o custo escala com o tamanho do contexto, e a qualidade cai quando a janela enche (a doc fala em instruções "esquecidas" e mais erros). O `/context` mostra, como uma grade colorida, quem ocupa o quê e dá sugestões.

## Estratégias

### Sessões curtas e `/clear`

A regra número um da doc: `/clear` entre tarefas não relacionadas. Contexto antigo é reenviado a cada mensagem e distrai. Se você corrigiu o Claude duas vezes no mesmo assunto, limpe e escreva um prompt melhor com o que aprendeu. Nomeie a sessão antes (`/rename`) para poder voltar com `/resume`.

### `/compact` dirigido

`/compact` substitui a conversa por um resumo. Dirigido, ele preserva o que importa:

```text
/compact Preserve a lista de arquivos alterados, os comandos de teste e as decisões sobre a tabela de alíquotas. Descarte as saídas brutas dos testes.
```

Você também pode fixar instruções de compactação no `CLAUDE.md`:

```markdown
# Compact instructions

When you are using compact, please focus on test output and code changes
```

O que sobrevive à compactação, segundo a doc: o prompt de sistema, `CLAUDE.md`, memória e ferramentas MCP recarregam; o Claude Code relê até cinco dos arquivos modificados mais recentemente e reinjeta o corpo das skills que você invocou; a **lista** de skills não é recarregada. Pelo menu `/rewind` dá para resumir só parte da conversa ("summarize from here" / "up to here"). A compactação automática acontece perto do limite; o `--autocompact` e `/autocompact` ajustam a janela.

### Arquivos de notas

Para trabalhos que atravessam sessões, o estado deve morar em **arquivos**, não na conversa. Três tipos:

- `SPEC.md` ou `PLANO.md`: o que será feito, decisões tomadas, o que está fora de escopo. Escrito uma vez; cada sessão nova começa lendo-o.
- Notas de progresso (`NOTAS.md`): "etapa 2 concluída; pendência: conciliar fornecedor X". Peça ao Claude que atualize ao fim de cada etapa.
- A **memória automática**: o Claude escreve o que aprende com suas correções; é carregada em toda sessão. Revise-a com `/memory` e apague o que ficou errado.

O `CLAUDE.md` não é lugar de notas de progresso: ele deve ter só o que vale para todas as sessões (comandos, estilo, regras do projeto), com meta de **menos de 200 linhas**. Procedimentos de uso ocasional vão para skills, que só carregam quando chamadas.

### Evitar poluição

- **Investigação em subagentes**: "use subagentes para investigar como a importação OFX trata duplicatas"; as leituras ficam no contexto deles.
- **`/btw`** para perguntas laterais: a resposta não entra no histórico.
- **Hooks que filtram**: um `PreToolUse` que reescreve `pytest` para mostrar só falhas reduz dezenas de milhares de tokens a centenas (exemplo da doc de custos).
- **Prompts específicos**: "melhore este código" dispara leitura ampla; "adicione validação de CNPJ em `validar_cliente()`" lê um arquivo.
- **MCP sob medida**: desative servidores não usados (`/mcp`); prefira CLIs como `gh` quando couber.
- **`--bare`** em scripts: nada de CLAUDE.md, hooks, skills, plugins, MCP ou memória.

### Medir

Antes e depois de uma mudança, meça. `/context` mostra a ocupação; `/usage` mostra tokens por modelo e, em planos por assinatura, a atribuição por skills, subagentes, plugins e servidores MCP, além de sinalizar "contexto longo" e "cache miss" quando pesam 10% ou mais. Uma linha de status pode exibir o uso de contexto continuamente. Em execuções `-p`, compare `usage` e `total_cost_usd` antes e depois.

Uma estimativa grosseira ajuda a planejar o que cabe em um prompt: em texto em português e código, algo em torno de **quatro caracteres por token** é uma aproximação razoável para ordem de grandeza (não é a contagem oficial; para precisão, use os números do `/usage` ou da API).

```python
def estimar_tokens(texto):
    return max(1, len(texto) // 4)

arquivos = {"razao.csv": "x" * 120000, "regras.md": "y" * 8000}
total = sum(estimar_tokens(c) for c in arquivos.values())
print(total)
# 32000
```

Se o total se aproxima do que a janela comporta, não leia tudo: peça um subagente para extrair só o necessário, ou pré-processe com Python antes de chamar o Claude.

## Erros comuns

- Sessão "pia de cozinha": três tarefas diferentes no mesmo contexto.
- `CLAUDE.md` com 600 linhas; o Claude ignora metade.
- Confiar na compactação automática para preservar decisões específicas sem instruí-la.
- Guardar estado de projeto só na conversa; a sessão seguinte começa do zero.
- Ler arquivos enormes "para garantir".
- Nunca abrir `/context`; otimizar no escuro.

## Na prática

Para o fechamento contábil, mantenha `PLANO.md` com decisões, `NOTAS.md` com progresso, `CLAUDE.md` enxuto e skills para os procedimentos. Cada competência começa com `/clear`, leitura do plano e das notas. A coleta de dados pesados vai para subagentes ou para scripts Python que entregam só totais. Ao fim de cada etapa, o Claude atualiza as notas; você mede com `/context` antes de seguir.

## Resumo

- Antes do seu prompt já entram prompt de sistema, memória, CLAUDE.md e regras, nomes de MCP e lista de skills; depois, tudo o que é lido ou executado.
- `/clear` entre tarefas; `/compact` com instruções (ou instruções fixas no CLAUDE.md); `/rewind` para resumir parte.
- Estado em arquivos (`SPEC.md`, `NOTAS.md`) e memória automática revisada; CLAUDE.md curto, procedimentos em skills.
- Subagentes, `/btw`, hooks que filtram, prompts específicos e `--bare` evitam poluição.
- Meça com `/context`, `/usage` e, em scripts, `usage`/`total_cost_usd`.
