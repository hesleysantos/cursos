Nesta lição você vai ajustar o jeito de o Claude Code responder e trabalhar: os **estilos de saída** (output styles), a escolha de **modelo** e de **nível de esforço** por tarefa, os **plugins** e seus **marketplaces** e, de passagem, a **linha de status**. São ajustes que não mudam o que o Claude pode fazer (isso é permissão), mas mudam quanto custa, quão rápido fica e quão didática é a resposta, o que importa quando você está aprendendo e quando está pagando a conta.

## Estilos de saída

Um estilo de saída é um conjunto de instruções que define papel, tom e formato das respostas em toda a sessão. Segundo a documentação, além do padrão (**Default**, sem estilo), há quatro embutidos:

| Estilo | O que muda | Quando usar |
| --- | --- | --- |
| **Proactive** | Começa a trabalhar de imediato e assume decisões de rotina em vez de perguntar | Quando você prefere corrigir o rumo depois |
| **Concise** | Respostas começam pelo resultado, sem preâmbulo nem recapitulação | Quando as respostas estão longas demais |
| **Explanatory** | Acrescenta blocos `Insight` explicando as escolhas por trás do código | Quando você está conhecendo um projeto |
| **Learning** | Explica e deixa pequenos trechos marcados `TODO(human)` para você escrever | Quando quer praticar enquanto a tarefa anda |

Para trocar: `/output-style concise` (sem argumento, lista os estilos), ou `/config` e a opção de estilo. A escolha é gravada em `.claude/settings.local.json`. Também dá para escrever a chave diretamente, lembrando que o valor diferencia maiúsculas (`"Explanatory"`, não `"explanatory"`, que cai no padrão):

```json
{
  "outputStyle": "Explanatory"
}
```

Um estilo personalizado é um arquivo Markdown em `~/.claude/output-styles/` (usuário) ou `.claude/output-styles/` (projeto), com cabeçalho `name`, `description` e, se você ainda quer o Claude programando normalmente, `keep-coding-instructions: true`:

```markdown
---
name: Contador
description: Explica cada mudança em termos contábeis antes do código
keep-coding-instructions: true
---

Antes de cada alteração, explique em uma frase o efeito contábil (conta, competência, sinal).
Use termos do dia a dia do escritório; evite jargão de programação sem explicar.
```

Para o estilo Learning durante este curso: ele é a forma mais eficiente de aprender Python com o Claude Code, porque você escreve exatamente as partes em que há decisão de negócio. Lembre que estilo é instrução, não garantia; para algo que tem de acontecer sempre, hook.

## Modelo por tarefa

O Claude Code aceita apelidos de modelo que apontam para a versão recomendada do momento: `sonnet` (tarefas diárias de código), `opus` (raciocínio complexo), `haiku` (tarefas simples, mais rápido e barato), `opusplan` (usa `opus` no modo de planejamento e `sonnet` na execução), além de variantes de contexto longo como `sonnet[1m]` e o valor `default`, que volta ao padrão da sua conta. A lista exata e as versões mudam; `/model` sem argumento abre o seletor com o que está disponível para você.

Formas de escolher, em ordem de prioridade: `/model nome` durante a sessão (também salva como padrão; no seletor, `s` troca só para a sessão), `claude --model nome` ao iniciar, a variável `ANTHROPIC_MODEL` e a chave `model` nas configurações.

Critérios práticos para o escritório:

- **Renomear, formatar, escrever docstring, perguntas rápidas**: `haiku`.
- **Implementar um passo com testes, depurar um traceback, refatorar**: `sonnet`.
- **Planejar um projeto, revisar regra de negócio difícil, decidir arquitetura**: `opus` (ou `opusplan` para planejar caro e executar barato).
- **Sessões longas com muitos arquivos**: variante `[1m]`, se disponível no seu plano.

Há ainda o **nível de esforço**, que regula quanto o modelo "pensa" antes de agir: `/effort low|medium|high|xhigh|max` (ou `--effort` e a variável `CLAUDE_CODE_EFFORT_LEVEL`). A documentação orienta `low` para trocas rápidas em que você revisa cada resultado, `medium` para trabalho com escopo claro, `high` quando verificação importa (bug em código existente) e `max` só para problemas difíceis, testando antes de adotar. Custo e uso você acompanha com `/usage` (`/cost` é apelido).

## Plugins e marketplaces

Um **plugin** é uma pasta com skills, subagentes, hooks e servidores MCP instalados como uma unidade. Um **marketplace** é um catálogo que lista plugins e onde buscá-los; o Claude Code adiciona o marketplace oficial da Anthropic (`claude-plugins-official`) na primeira sessão interativa no terminal. Dentro da sessão:

```text
/plugin
/plugin install commit-commands@claude-plugins-official
/plugin marketplace add sua-org/plugins
```

`/plugin` abre o painel com a aba **Discover** (catálogo), **Installed** e **Marketplaces**. `/plugin install` abre os detalhes do plugin para você revisar o que ele adiciona e escolher o **escopo**: usuário (todos os seus projetos), projeto (todos do repositório, via `.claude/settings.json`) ou local (só você neste repositório). As skills do plugin aparecem como `/plugin:skill`. No terminal, sem sessão, `claude plugin install nome@marketplace --scope project` e `claude plugin list`. A chave `enabledPlugins` nas configurações registra o que está ligado; `/reload-plugins` aplica mudanças sem reiniciar.

Dois alertas da documentação: um plugin ligado faz parte de toda sessão (suas descrições ocupam contexto mesmo sem uso), e o que ele roda, roda como você: leia os detalhes antes de instalar e desligue os que não usa. Para um escritório, o caminho é um marketplace próprio (repositório com `.claude-plugin/marketplace.json`) distribuindo o kit interno; criar plugins está na documentação, fora do escopo desta lição.

## Linha de status (menção)

A linha de status é uma barra no rodapé do terminal que executa um script seu e mostra o que ele imprimir: modelo, pasta, porcentagem de contexto, custo estimado, ramo do Git. `/statusline` com uma descrição ("mostre modelo e porcentagem de contexto") gera script e configuração; manualmente, é a chave `statusLine` com `"type": "command"` e o comando, que recebe JSON no stdin (`model.display_name`, `workspace.current_dir`, `context_window.used_percentage`). A documentação traz exemplos em PowerShell. É um conforto, não uma necessidade.

## Erros comuns

- `"outputStyle": "explanatory"` em minúsculas e cair no estilo padrão sem perceber.
- Usar `opus` com esforço `max` para renomear variáveis, pagando caro à toa.
- Trocar de modelo com `/model` achando que vale só para a sessão; ele salva como padrão (use `s` no seletor para sessão apenas).
- Instalar plugins "para ver" e deixar todos ligados, inflando o contexto.
- Esperar que um estilo garanta comportamento; estilo é instrução.

## Na prática

Rotina sugerida: estilo Learning enquanto você estuda, Concise quando já sabe o que quer; `sonnet` como padrão, `haiku` para tarefas mecânicas, `opusplan` para projetos novos; `/usage` no fim do dia para ver onde foi o consumo; um ou dois plugins oficiais que de fato ajudam (como o de commits) e nada mais.

## Resumo

- Estilos: Default, Proactive, Concise, Explanatory, Learning; `/output-style nome`; chave `outputStyle` (diferencia maiúsculas); personalizados em `.claude/output-styles/`.
- Modelo por apelido (`haiku`, `sonnet`, `opus`, `opusplan`): `/model`, `--model`, `ANTHROPIC_MODEL`, chave `model`; esforço com `/effort`.
- Critério: tarefa mecânica → barato e rápido; implementar e depurar → intermediário; planejar e decidir → mais capaz.
- Plugins = pacotes de skills, agentes, hooks e MCP; `/plugin`, marketplaces, escopos; leia antes de instalar e desligue o que não usa.
- Linha de status: `/statusline` ou chave `statusLine`.
