Neste projeto guiado você vai montar o **kit do escritório**: um repositório de automações contábeis com configurações de permissão seguras, `CLAUDE.md`, duas skills, um subagente revisor, um hook de formatação e um servidor MCP de sistema de arquivos. Cada peça é montada e **testada** antes da próxima, porque configuração que não foi testada é configuração que você acha que tem. Ao final, você escreve uma função que audita um `settings.json` e avalia o kit com uma rubrica. É o fecho do curso: tudo que você aprendeu nos módulos anteriores, empacotado para o time.

## Passo 0: a pasta e o Git

```powershell
mkdir C:\automacoes
cd C:\automacoes
git init
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install pytest black ruff
mkdir .claude\hooks, .claude\skills\fechar-mes, .claude\skills\revisar-script, .claude\agents, exemplos
```

Crie `.gitignore` com `.venv/`, `.env`, `CLAUDE.local.md` e `.claude/settings.local.json`. Commit inicial.

## Passo 1: permissões seguras

`.claude/settings.json`:

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "permissions": {
    "allow": [
      "Bash(pytest *)",
      "Bash(ruff *)",
      "Bash(black *)",
      "Bash(git status *)",
      "Bash(git diff *)",
      "Bash(git log *)"
    ],
    "ask": [
      "Bash(git push *)"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(git push --force *)",
      "Bash(git reset --hard *)",
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(./certificados/**)",
      "Edit(./exemplos/**)"
    ],
    "disableBypassPermissionsMode": "disable"
  }
}
```

**Teste:** abra `claude` na pasta, aceite o diálogo de confiança (as regras `allow` do projeto só valem depois dele), rode `/permissions` e confira que as regras aparecem com origem no arquivo do projeto. Peça "leia o arquivo .env" (crie um `.env` de mentira antes) e confirme a recusa. Peça "rode pytest" e confirme que não pergunta.

## Passo 2: CLAUDE.md

Use o exemplo da lição 3 (`automacoes/CLAUDE.md`), adaptado: comandos de teste e qualidade, regra de dinheiro em centavos, proibição de dados reais, TDD. **Teste:** `/context` deve listar o arquivo entre os de memória; pergunte "quais regras deste repositório você deve seguir?" e compare com o arquivo.

## Passo 3: duas skills

`fechar-mes`, igual à lição 4. E `revisar-script`, mais simples, que o Claude pode invocar sozinho:

```markdown
---
name: revisar-script
description: Revisa um script Python de automação contábil com o checklist do escritório. Use quando o usuário pedir revisão de um script ou antes de commitar alterações em arquivos .py.
argument-hint: [caminho-do-script]
allowed-tools: Bash(pytest *), Bash(ruff *)
---

Revise $0 com este checklist e devolva uma lista por gravidade, sem editar nada:
1. Regra de negócio: arredondamento, competência, sinal de débito e crédito.
2. Dinheiro em centavos inteiros; datas como date; encoding declarado ao abrir arquivos.
3. Nenhum segredo, caminho pessoal ou dado real de cliente.
4. Exceções específicas (sem `except Exception: pass`).
5. Testes cobrem vazio, duplicado, texto no lugar de número.
Rode `ruff check` e `pytest` e inclua a saída resumida.
```

**Teste:** `/reload-skills`, depois `/skills` para ver as duas; `/fechar-mes padaria 2026-10` deve parar no passo 1 (a pasta do cliente não existe) e dizer o que falta; `/revisar-script exemplos/ola.py` deve devolver a lista.

## Passo 4: subagente revisor

Crie `.claude/agents/revisor.md` como na lição 5 (só leitura mais `Bash`). **Teste:** altere um `.py` e peça "use o subagente revisor no diff"; a resposta deve vir como relatório, e o diff não deve ter sido alterado (`git diff` igual ao anterior).

## Passo 5: hook de formatação

Copie `formatar.py` da lição 6 para `.claude/hooks/` e acrescente o bloco `hooks` ao `.claude/settings.json` (como irmão de `permissions`), na forma exec com `python` e `${CLAUDE_PROJECT_DIR}`. Se quiser, acrescente também o `bloquear.py` da lição 6, com o matcher `Bash|PowerShell`: ele reforça as regras `deny` do passo 1 nos casos em que o texto do comando escapa delas. **Teste:** `/hooks` deve listar o `PostToolUse`; peça ao Claude para criar `exemplos/teste_formato.py` com `x=1` e abra o arquivo: deve estar `x = 1`. Se nada mudar, rode o script à mão com um JSON de exemplo no stdin para ver o erro:

```powershell
'{"tool_input":{"file_path":"C:/automacoes/exemplos/teste_formato.py"}}' | python .claude\hooks\formatar.py
```

## Passo 6: servidor MCP

```powershell
claude mcp add --scope project arquivos -- npx -y @modelcontextprotocol/server-filesystem C:\automacoes\exemplos
claude mcp list
```

**Teste:** `claude mcp list` deve mostrar `arquivos` conectado (na primeira vez o `npx` baixa o pacote; se demorar, aumente `MCP_TIMEOUT`). Abra a sessão, aprove o servidor de projeto quando perguntado, rode `/mcp` e peça "use o servidor arquivos para listar a pasta exemplos". Troque o caminho absoluto no `.mcp.json` por `${PASTA_EXEMPLOS:-C:/automacoes/exemplos}` antes de commitar.

## Passo 7: fechar

Commit de cada peça separadamente (sete commits). README curto explicando o kit e como um colega o adota: clonar, criar `.venv`, instalar, abrir `claude`, aceitar confiança e aprovar o servidor MCP.

## Rubrica

| Critério | 0 | 1 | 2 |
| --- | --- | --- | --- |
| Permissões | Padrão | Allow/deny básicos | Segredos e destruição negados, push perguntando, bypass desligado, testado |
| CLAUDE.md | Não existe | Genérico | Regras específicas, menos de 200 linhas, confirmado em `/context` |
| Skills | Nenhuma | Uma, sem argumentos | Duas, com `description` clara, argumentos e `allowed-tools` mínimos, testadas |
| Subagente | Nenhum | Com `Edit` | Revisor só leitura, descrição com "use proativamente", testado |
| Hook | Nenhum | Registrado | Forma exec, `timeout`, testado com arquivo real |
| MCP | Nenhum | Caminho pessoal no `.mcp.json` | Escopo projeto, variável com padrão, aprovado e testado |
| Git/entrega | Um commit | Commits por peça | Commits por peça, `.gitignore` correto, README de adoção |

De 11 a 14: kit pronto para o time. De 7 a 10: funciona para você; revise antes de compartilhar. Abaixo de 7: refaça os testes de cada peça.

## Erros comuns

- Pular o diálogo de confiança e achar que as regras `allow` do projeto não funcionam.
- Hook na forma shell sem Git Bash, bloqueando edições com erro.
- `.mcp.json` commitado com `C:\Users\seu-nome\...`.
- `settings.local.json` no Git, levando suas aprovações para os colegas.
- Skill com `allowed-tools: Bash`, liberando tudo durante a skill.
- Não testar cada peça isoladamente e depois não saber qual delas quebrou.

## Na prática

O kit é um repositório que o escritório clona em cada máquina. Novas automações nascem em subpastas dele, herdando permissões, memória, skills, revisor, hook e servidor. Quando uma regra nova surge ("a pasta de certificados mudou"), muda-se uma linha no `settings.json`, commita-se, e todos recebem. É o módulo 4 inteiro virando infraestrutura.

## Resumo

- Kit = `settings.json` seguro + `CLAUDE.md` + 2 skills + subagente revisor + hook de formatação + servidor MCP, cada peça commitada e testada.
- Testes: `/permissions`, `/context`, `/skills`, `git diff` após o revisor, `/hooks` e um arquivo formatado, `claude mcp list` e `/mcp`.
- Sem caminhos pessoais nem segredos no que vai para o Git; `${VAR:-padrao}` no `.mcp.json`.
- A rubrica mede permissões, memória, skills, subagente, hook, MCP e entrega.
