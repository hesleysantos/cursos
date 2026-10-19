Nesta lição você vai criar e manter o `CLAUDE.md`, o arquivo que o Claude Code lê no início de **toda** sessão. Vai aprender o que colocar nele, onde ele pode ficar (projeto, usuário, local, política), como gerá-lo com `/init`, como pedir ao agente que acrescente algo e quais são as boas práticas. É o que faz o agente "lembrar" das regras do escritório sem você repeti-las a cada conversa.

## Por que existe

Cada sessão começa com a janela de contexto vazia. A documentação descreve dois mecanismos que atravessam sessões: o **`CLAUDE.md`** (instruções que **você** escreve) e a **memória automática** (anotações que o **Claude** escreve sozinho a partir das suas correções e preferências). O `CLAUDE.md` é tratado como contexto, não como regra imposta: quanto mais específico e conciso, mais o Claude o segue.

## Onde ele pode ficar

A tabela oficial, com os caminhos (no Windows, `~` é `C:\Users\SeuUsuário`):

| Escopo | Local | Para quê | Compartilhado com |
| --- | --- | --- | --- |
| **Política gerenciada** | Windows: `C:\Program Files\ClaudeCode\CLAUDE.md` | Regras da organização (TI) | Todos os usuários |
| **Usuário** | `~/.claude/CLAUDE.md` | Suas preferências em todos os projetos | Só você, todos os projetos |
| **Projeto** | `./CLAUDE.md` ou `./.claude/CLAUDE.md` | Instruções do projeto, da equipe | Equipe, via Git |
| **Local** | `./CLAUDE.local.md` | Preferências pessoais daquele projeto; **vai no `.gitignore`** | Só você, aquele projeto |

Os arquivos são **concatenados**, não substituídos: do mais amplo ao mais específico, de modo que a instrução do projeto aparece depois da do usuário. O Claude Code carrega os `CLAUDE.md` da pasta atual e de todas as pastas acima; `CLAUDE.md` em subpastas são carregados sob demanda, quando ele mexe em arquivos daquela subpasta. Para confirmar o que foi carregado, rode `/context` e veja a lista **Memory files**.

## Gerar com `/init`

Dentro do projeto:

```text
/init
```

Ele analisa o código e cria um `CLAUDE.md` inicial com comandos de build e teste e convenções que descobrir; se já existir um, sugere melhorias em vez de sobrescrever. Trate o resultado como rascunho: a documentação recomenda "refinar a partir daí com instruções que o Claude não descobriria sozinho".

## O que colocar (e o que não)

A tabela de boas práticas oficial, adaptada ao escritório:

**Inclua**: comandos que ele não adivinharia (como rodar, como testar), regras de estilo que fogem do padrão, convenções de branch e commit, decisões de arquitetura, variáveis de ambiente necessárias, pegadinhas conhecidas, e o que **não tocar**.

**Exclua**: o que ele descobre lendo o código, convenções padrão da linguagem, documentação longa, descrição arquivo por arquivo, frases vazias como "escreva código limpo".

Um `CLAUDE.md` para o organizador de notas, no formato de exemplo da documentação (títulos e bullets):

```markdown
# Organizador de notas fiscais

## Como rodar
- Ative o venv antes: .\.venv\Scripts\Activate.ps1
- Simulação: python organizador.py --simular
- Testes: python -m pytest -q

## Regras de negócio
- Competência = data que aparece no nome do arquivo, formato AAAA-MM
- Arquivos sem data vão para organizado/sem_competencia/

## Convenções
- Só biblioteca padrão; nova dependência exige aprovação e entra no requirements.txt
- Mensagens de commit em português, imperativo, primeira linha até 72 caracteres
- Não alterar a assinatura de extrair_competencia (usada por outros scripts)

## Não tocar
- Pasta entrada/ contém arquivos reais de clientes: nunca apagar, só mover
```

Escreva instruções **verificáveis**: a documentação contrasta "use indentação de 2 espaços" (bom) com "formate o código direito" (vago).

## Acrescentar durante a conversa

Quando perceber que repetiu a mesma correção, grave-a. Peça diretamente:

```text
adicione ao CLAUDE.md: "valores monetários são sempre Decimal, nunca float"
```

A documentação diz que, ao pedir "lembre que…" ou "sempre use X", o Claude salva na **memória automática**; para ir ao `CLAUDE.md`, peça explicitamente "adicione isso ao CLAUDE.md" ou edite o arquivo pelo comando `/memory`, que lista todos os arquivos de memória e abre o escolhido no editor. (Versões antigas tinham um atalho com `#` para isso; a documentação atual não o lista — use os caminhos acima.)

## Memória automática e importações

A **memória automática** fica em `~/.claude/projects/<projeto>/memory/`, com um índice `MEMORY.md` (as primeiras 200 linhas ou 25 KB entram em toda sessão) e arquivos por tema. Ela guarda suas preferências, correções e contexto que o código não revela; é local à máquina e pode ser lida, editada ou apagada por você via `/memory`.

O `CLAUDE.md` pode **importar** outros arquivos com `@caminho` (relativo ao arquivo que importa, até quatro níveis). Caminhos entre crases não são importados. Exemplo oficial:

```markdown
See @README for project overview and @package.json for available npm commands for this project.

# Additional Instructions
- git workflow @docs/git-instructions.md
```

Para projetos grandes, a pasta `.claude/rules/` guarda arquivos `.md` por assunto, que podem ser restritos a caminhos específicos com `paths:` no cabeçalho.

## Boas práticas

- **Curto**: a meta oficial é menos de 200 linhas; arquivos longos reduzem a adesão. Para cada linha, pergunte: "removê-la faria o Claude errar?".
- **Organizado**: títulos e bullets, não parágrafos.
- **Consistente**: duas instruções contraditórias fazem o Claude escolher uma ao acaso. Revise de tempos em tempos; `/doctor prompt-audit` procura instruções obsoletas ou conflitantes.
- **Versionado**: o `CLAUDE.md` do projeto vai no Git; o `CLAUDE.local.md`, no `.gitignore`.
- **Ênfase com moderação**: "IMPORTANTE" em uma linha ajuda; em dez, nenhuma se destaca.
- Instruções que só valem para uma tarefa específica ficam melhor como **skill** (módulos seguintes), não no `CLAUDE.md`.

## Erros comuns

- Colar o manual do sistema contábil inteiro no `CLAUDE.md`.
- Esperar que o `CLAUDE.md` **impeça** algo: ele orienta; para bloquear de verdade existem permissões e hooks (mais adiante).
- Guardar senhas ou caminhos de certificado no `CLAUDE.md` versionado.
- Criar o arquivo e nunca conferir no `/context` se ele está sendo carregado.
- Instruções vagas ("seja cuidadoso com datas").

## Na prática

No fim de cada semana, abra o `CLAUDE.md` do projeto e pergunte-se o que você corrigiu mais de uma vez na semana. Essas correções viram uma linha cada. Rode `/doctor prompt-audit` de vez em quando e corte o que ficou obsoleto. O arquivo "acumula valor com o tempo", nas palavras da documentação.

## Resumo

- `CLAUDE.md` é lido em toda sessão; escopos: política, usuário (`~/.claude/CLAUDE.md`), projeto (`./CLAUDE.md`), local (`./CLAUDE.local.md`, no `.gitignore`).
- `/init` gera o rascunho; `/memory` edita; `/context` confirma o carregamento.
- Inclua como rodar, regras de negócio, convenções e o que não tocar; exclua o que ele descobre lendo o código.
- Para gravar algo, peça "adicione ao CLAUDE.md"; pedidos de "lembre que…" vão para a memória automática.
- Menos de 200 linhas, títulos e bullets, sem contradições, sem segredos.
