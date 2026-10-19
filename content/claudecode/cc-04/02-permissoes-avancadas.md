Nesta lição você vai dominar o sistema de permissões do Claude Code: a sintaxe das regras por ferramenta e padrão, as listas de permitir, perguntar e negar e sua ordem de avaliação, os modos de permissão, o papel do `.claude/settings.local.json` e boas práticas para um escritório contábil, com ênfase em negar comandos destrutivos e proteger segredos. Permissões separam um assistente supervisionado de um que pode apagar a pasta do cliente por engano.

## Como uma regra é escrita

Uma regra tem o formato `Ferramenta` ou `Ferramenta(especificador)`. Sem parênteses, casa com todo uso da ferramenta (`Bash` com qualquer comando, `Read` com qualquer leitura). Com especificador, você restringe:

| Regra | Efeito |
| --- | --- |
| `Bash(npm run build)` | Só o comando exato `npm run build` |
| `Bash(git log *)` | Qualquer `git log ...`, inclusive `git log` sozinho |
| `Read(./.env)` | Ler o `.env` da pasta atual |
| `Read(./segredos/**)` | Ler qualquer arquivo dentro de `segredos/` |
| `Edit(docs/**)` | Editar arquivos dentro de `docs/` |
| `WebFetch(domain:receita.fazenda.gov.br)` | Buscar páginas desse domínio |
| `mcp__nome_do_servidor__nome_da_ferramenta` | Uma ferramenta de um servidor MCP |
| `PowerShell(Remove-Item *)` | Comandos `Remove-Item` na ferramenta PowerShell |

O `*` em regras de Bash casa com qualquer texto, inclusive espaços, e a posição importa: `Bash(git *)` libera **todo** comando git; `Bash(git log *)` libera só `git log`. Coloque o curinga depois do subcomando. O espaço antes do `*` final conta: `Bash(ls *)` não casa com `lsof`, mas `Bash(ls*)` casa. O sufixo `:*` equivale a ` *` final.

> **Atenção (Windows):** se o Git Bash (instalado com o Git para Windows) não estiver na máquina, o Claude Code não oferece a ferramenta Bash e usa a ferramenta **PowerShell** no lugar. Nesse caso, as regras seguem a mesma forma, mas com o nome `PowerShell(...)`; a documentação registra que apelidos comuns são reconhecidos (`PowerShell(Get-ChildItem *)` também casa `ls`, `dir` e `gci`) e que a comparação ignora maiúsculas. Nos exemplos deste módulo, o Git está instalado e a ferramenta Bash existe; se quiser cobrir os dois casos, escreva a regra nas duas formas.

Regras de `Read` e `Edit` usam padrões no estilo `.gitignore`: `//caminho` é absoluto, `~/caminho` parte da sua pasta pessoal, `/caminho` é relativo à pasta do arquivo de configuração e `caminho` ou `./caminho` à pasta atual. No Windows, os caminhos são normalizados para POSIX antes da comparação: `C:\Users\ana` vira `/c/Users/ana`, então `Read(//c/**/.env)` bloqueia qualquer `.env` do disco C.

## As três listas e a ordem de avaliação

- **`allow`**: a ferramenta roda sem perguntar.
- **`ask`**: pergunta sempre, mesmo em modos que não perguntam.
- **`deny`**: bloqueia.

A avaliação segue a ordem **deny, depois ask, depois allow**; a primeira regra que casa decide, e especificidade não muda a ordem. `Bash(git *)` em `deny` bloqueia `git status` mesmo com `Bash(git status)` em `allow`: um allow não abre exceção dentro de um deny. Vale entre arquivos também: um deny no arquivo de usuário bloqueia um allow do projeto, e vice-versa.

Detalhe: um `deny` só com o nome da ferramenta (`"Bash"`) **remove a ferramenta do contexto** do Claude; um `deny` com padrão (`"Bash(rm *)"`) mantém a ferramenta e bloqueia só o que casa.

```json
{
  "permissions": {
    "allow": [
      "Bash(pytest *)",
      "Bash(git status *)",
      "Bash(git diff *)",
      "Bash(git commit *)"
    ],
    "ask": [
      "Bash(git push *)"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(./segredos/**)",
      "Edit(./dados-clientes/**)"
    ]
  }
}
```

## Modos de permissão

Valores documentados de `permissions.defaultMode`:

| Modo | O que roda sem perguntar |
| --- | --- |
| `default` (rotulado "Manual") | Só leituras |
| `acceptEdits` | Leituras, edições de arquivo e comandos comuns de arquivo (`mkdir`, `mv`, `cp`) |
| `plan` | Leituras e exploração; não edita seus arquivos até você aprovar o plano |
| `auto` | Tudo, com um classificador em segundo plano verificando se cada ação condiz com o pedido |
| `dontAsk` | Só o que já está pré-aprovado; tudo que perguntaria é negado (CI e scripts) |
| `bypassPermissions` | Tudo, sem perguntas |

No terminal, `Shift+Tab` alterna os modos; `claude --permission-mode plan` inicia já em um. Os valores `auto` e `bypassPermissions` **não têm efeito** em `.claude/settings.json` nem em `.claude/settings.local.json`: só valem em configurações de usuário ou gerenciadas, ou pela linha de comando.

> **Atenção:** `--dangerously-skip-permissions` (modo `bypassPermissions`) pula todas as perguntas, inclusive gravações em caminhos protegidos. A documentação é explícita: só em ambientes isolados, como contêineres ou máquinas virtuais. Em uma máquina com dados de clientes, nunca. Para impedir que alguém o ative, defina `"disableBypassPermissionsMode": "disable"` dentro de `permissions`.

## O arquivo local e o botão "não pergunte de novo"

Quando você responde "Yes, and don't ask again" a um pedido de comando, o Claude Code salva uma regra `allow` em `.claude/settings.local.json`, na raiz do repositório. Abra esse arquivo de vez em quando: ele mostra o que você já liberou e é onde se apaga uma aprovação dada com pressa. Já as regras `allow` do `.claude/settings.json` do projeto só valem depois que cada pessoa aceita o diálogo de confiança da pasta; `deny` e `ask` valem de imediato.

## O que as regras não fazem

Regras de Bash casam com o **texto** do comando. `Bash(rm *)` em `deny` para `rm -rf build/`, mas não `/bin/rm -rf build/` nem `bash -c 'rm -rf build/'`. A documentação é clara: um deny cobre a forma que o Claude normalmente produz e não é uma fronteira de segurança em torno do programa. Para fronteiras reais há o sandbox (isolamento de arquivos e rede para comandos, em sistemas suportados) e os hooks `PreToolUse` (lição 6). Regras `Read` e `Edit` valem para as ferramentas de arquivo e comandos reconhecidos (`cat`, `head`, redirecionamentos), não para um script Python que abre o arquivo por dentro.

## Boas práticas para um escritório

1. **Negue segredos pelo caminho**: `.env`, `.env.*`, certificados (`.pfx`), chaves e tokens.
2. **Negue destruição**: `rm -rf`, `Remove-Item -Recurse`, `git push --force`, `git reset --hard`.
3. **Pergunte antes de sair da máquina**: `git push`, e-mail, uploads.
4. **Libere a rotina inofensiva**: `pytest`, `ruff`, `git status`, `git diff`, `git log`.
5. **Proteja dados de clientes com `Edit` deny** nas pastas de entrada.
6. **Nunca use bypass** fora de ambiente isolado; desligue-o com `disableBypassPermissionsMode`.
7. **Revise o `settings.local.json`** e **combine com hooks** quando a regra precisa ser garantida.

## Erros comuns

- `Bash(git *)` em `allow` achando que libera "só o básico": libera tudo, inclusive `git push --force`.
- Esperar que um allow específico abra exceção em um deny amplo.
- Confiar que `deny` de `rm` impede qualquer apagamento (não cobre `/bin/rm`, `sh -c`, scripts).

## Na prática

Um repositório de automações contábeis leva, no `.claude/settings.json`, o JSON desta lição adaptado. Cada pessoa trabalha em `acceptEdits` e volta a `default` em algo sensível. Em três semanas, o `settings.local.json` de cada um mostra o que mais foi aprovado, e o que se repete migra para o arquivo do projeto.

## Resumo

- Regra = `Ferramenta` ou `Ferramenta(especificador)`; `*` casa qualquer texto e vem depois do subcomando.
- Avaliação: deny, depois ask, depois allow; a primeira que casa decide, em qualquer arquivo.
- Modos: `default`, `acceptEdits`, `plan`, `auto`, `dontAsk`, `bypassPermissions`; `Shift+Tab` alterna; bypass só isolado.
- "Não pergunte de novo" grava em `.claude/settings.local.json`; revise-o.
- Regras casam texto, não programas: para garantias, sandbox e hooks.
- Escritório: negar segredos e destruição, perguntar antes de sair da máquina, liberar rotina.
