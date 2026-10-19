Nesta lição você vai instalar o Claude Code no Windows 11, fazer o primeiro login e confirmar que tudo funciona. Vai também entender quais contas dão acesso, por que vale instalar o Git para Windows e onde ficam a extensão do VS Code e o aplicativo desktop. Instalar bem evita a dúvida clássica de "será que o problema é minha máquina ou meu pedido?".

## Requisitos

A documentação lista, para Windows: **Windows 10 versão 1809 ou superior** (o Windows 11 atende), **4 GB ou mais de RAM**, processador x64 ou ARM64, **conexão com a internet** e um shell — PowerShell ou CMD servem. Não é preciso instalar Node.js nem rodar como administrador.

Dois pontos específicos do Windows:

- **Git para Windows é recomendado.** Ele traz o Git Bash, que o Claude Code usa para a ferramenta Bash. Sem ele, o Claude Code usa o PowerShell como shell. Como você também vai usar Git no curso, instale-o em git-scm.com/downloads/win.
- Você pode usar o Claude Code **nativamente no Windows** (o que faremos) ou dentro do **WSL**. A opção nativa é a indicada para projetos e ferramentas Windows.

## Instalação (método oficial atual)

O método recomendado é o **instalador nativo**. Abra o PowerShell (o prompt mostra `PS C:\...>`) e rode:

```powershell
irm https://claude.ai/install.ps1 | iex
```

Se preferir o CMD (prompt sem o `PS`), o comando é outro:

```bash
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

Dois erros comuns de "shell errado", citados na própria documentação: `The token '&&' is not a valid statement separator` significa que você colou o comando do CMD no PowerShell; `'irm' is not recognized` significa o contrário.

O instalador **não mostra progresso** enquanto baixa. Quando terminar, **abra uma nova janela do terminal** e confira:

```powershell
claude --version
```

A saída é um número de versão seguido de `(Claude Code)`. Se aparecer "não reconhecido", a pasta de instalação ainda não está no PATH; a página de solução de problemas de instalação explica como corrigir.

Alternativas documentadas: `winget install Anthropic.ClaudeCode` (mas o WinGet **não atualiza sozinho**; rode `winget upgrade Anthropic.ClaudeCode` de tempos em tempos) e `npm install -g @anthropic-ai/claude-code` (exige Node.js 22 ou superior). O instalador nativo se **atualiza automaticamente** em segundo plano; para forçar uma atualização, `claude update`.

> **Dica:** `claude doctor` faz um diagnóstico da instalação e das configurações sem abrir uma sessão. Guarde esse comando para quando algo parecer estranho.

## Login: conta ou chave de API

O Claude Code **exige** uma conta paga: planos **Pro, Max, Team ou Enterprise** do claude.ai, ou uma conta no **Claude Console** (acesso por API com créditos pré-pagos). O plano gratuito do claude.ai **não** inclui o Claude Code. Preços e limites mudam; consulte claude.com/pricing.

Como escolher, em critérios:

- **Assinatura (Pro/Max/Team/Enterprise)**: uso incluído no plano, com limites por janela de tempo. É o caminho recomendado pela documentação para uso pessoal e de equipe, e é o que libera recursos como o app desktop, a web e o `/usage` com as barras do plano.
- **Console (API)**: paga por token consumido; útil para automações, scripts e quando a empresa já tem conta de API. Nesse caso você pode definir a variável de ambiente `ANTHROPIC_API_KEY`; na primeira execução o Claude Code pergunta se deve usá-la.

O login acontece na primeira vez que você roda `claude`: ele abre o navegador para você autenticar e guarda as credenciais. Para trocar de conta depois, use `/login` dentro da sessão; para sair, `/logout`. Pela linha de comando existem `claude auth login`, `claude auth logout` e `claude auth status`.

## O primeiro acesso

Vá até uma pasta de projeto (crie uma vazia só para testar) e inicie:

```powershell
mkdir C:\projetos\teste-claude
cd C:\projetos\teste-claude
claude
```

Acima do prompt aparecem a versão, o modelo atual e a pasta de trabalho. Na primeira abertura de uma pasta ele pergunta se você **confia** naquele diretório — isso protege você de arquivos de terceiros que poderiam conter instruções. Digite:

```text
/help
```

para ver os comandos disponíveis. Para sair, `/exit` (ou Ctrl+D duas vezes).

## Onde estão as outras superfícies

- **Extensão do VS Code**: procure "Claude Code" na aba de extensões (Ctrl+Shift+X) ou instale pelo marketplace (também há versão para Cursor). Exige VS Code 1.94 ou superior. A extensão **traz sua própria cópia** da CLI para o painel de chat, mas **não** coloca o comando `claude` no PATH — para usá-lo no terminal integrado você precisa da instalação que acabou de fazer.
- **Plugin JetBrains** (PyCharm, IntelliJ…): instalado pelo JetBrains Marketplace; **precisa** da CLI instalada separadamente.
- **App desktop**: baixe em claude.com/download (Windows x64 ou ARM64), entre com a conta e clique na aba **Code**. Ele já inclui o Claude Code, sem instalar a CLI; exige assinatura paga.
- **Web**: claude.ai/code, com o repositório no GitHub.

## Erros comuns

- Rodar `claude --version` **na mesma janela** em que instalou: o PATH só é recarregado em uma janela nova.
- Esperar o plano gratuito funcionar: não funciona.
- Instalar pelo WinGet e achar que está atualizado meses depois.
- Abrir o Claude Code na raiz `C:\` ou em `Documentos` inteiro: ele pede confiança e ganha acesso a tudo ali. Use uma pasta por projeto.

## Na prática

Monte a estrutura do escritório desde já: uma pasta `C:\projetos` com uma subpasta por automação (`notas-fiscais`, `conciliacao`, `folha`). Cada uma vira um projeto com seu próprio Git e seu próprio `CLAUDE.md`. Assim, quando você abrir `claude` em `notas-fiscais`, ele só vê o que interessa.

## Resumo

- Windows 11, 4 GB de RAM e internet bastam; instale também o Git para Windows.
- Instalação nativa no PowerShell: `irm https://claude.ai/install.ps1 | iex`; confira com `claude --version` numa janela nova.
- Conta Pro/Max/Team/Enterprise ou Console; o plano gratuito não serve.
- `claude` abre a sessão e faz o login no navegador; `/help` lista comandos; `/exit` sai.
- VS Code, JetBrains, desktop e web usam o mesmo motor; só o desktop dispensa a CLI.
