Nesta lição você vai aprender a pedir ao Claude Code que **rode** comandos e testes por você: o laço "rode os testes e corrija", como funcionam os limites da ferramenta de execução (tempo, saída, comandos que esperam teclado) e como pedir instalação de dependências dentro de um ambiente virtual. É aqui que o agente deixa de ser um escritor de código e vira um colega que também testa.

## O laço "rode e corrija"

O pedido mais produtivo do dia a dia é curto:

```text
rode python -m pytest -q e corrija as falhas. não altere os testes, só o código. repita até passar e me mostre a saída final.
```

Isso aciona o ciclo da documentação: rodar a suíte → ler o erro → procurar o arquivo → ler → editar → rodar de novo. A frase "não altere os testes" evita a saída fácil de "corrigir" o teste em vez do código. A frase "me mostre a saída" pede **evidência**: a documentação recomenda que o Claude "mostre a prova em vez de afirmar sucesso" — a saída do teste, o comando que rodou e o que ele devolveu.

Cada comando que ele quer rodar passa pelo pedido de permissão em modo manual (com a opção de aprovar aquele comando para o resto da sessão). Há um conjunto fixo de comandos somente-leitura, como `ls`, `cat` e `git status`, que rodam sem perguntar.

## Comandos pontuais

Você também pode pedir comandos avulsos: "rode `python organizador.py --simular` e resuma o que ele faria", "liste os arquivos maiores que 10 MB na pasta `entrada`", "mostre as 20 últimas linhas do log". Para comandos que você quer rodar **você mesmo** e só colocar a saída na conversa, use o prefixo `!`:

```text
!python -m pytest -q
```

A saída entra no contexto e o Claude responde a ela.

## Limites da ferramenta de execução

A documentação da ferramenta Bash explica como ela funciona, e isso define o que pedir e o que evitar:

- **Cada comando roda em um processo separado.** Um `cd` dentro da pasta do projeto é lembrado nos comandos seguintes, mas **variáveis de ambiente não persistem** entre comandos (um `export` ou `$env:X = ...` em um comando não vale no próximo). Por isso a orientação oficial: **ative o ambiente virtual antes de abrir o Claude Code**.
- **Tempo limite.** Cada comando em primeiro plano tem um tempo máximo: por padrão dois minutos, e o Claude pode pedir mais, até um teto de dez minutos. Quando o tempo acaba, o Claude Code não mata o comando: ele o move para **segundo plano** e segue trabalhando. Processos longos (um servidor, uma importação de horas) devem rodar em segundo plano desde o início: o Claude pode iniciá-los assim, você pode pressionar **Ctrl+B** para mandar um comando em execução para o fundo, e `/tasks` lista e encerra o que está rodando.
- **Saída limitada.** Saídas muito grandes são gravadas em arquivo e só um trecho entra na conversa; peça filtros ("mostre só as linhas com FAIL").
- **Sem teclado.** O comando recebe a entrada e devolve a saída; não há ninguém para digitar uma resposta no meio. Um script que para esperando `input()` ou uma confirmação "S/N" não recebe resposta pela ferramenta (na ferramenta PowerShell, a documentação diz que o comando recebe fim de arquivo em vez de travar). Prefira argumentos de linha de comando, arquivos de configuração ou flags como `--sim` em vez de perguntas interativas.
- **Windows**: com o Git para Windows, os comandos vão pelo Git Bash (ferramenta `Bash`); também existe a ferramenta `PowerShell`. Se um comando só faz sentido no PowerShell (`Get-ChildItem`, `Remove-Item`), diga isso.

> **Atenção:** o Claude decide o tempo limite de cada comando sozinho; você não configura isso por comando (há variáveis de ambiente para mudar o padrão e o teto, mas não precisará delas agora). Se algo demora mais que alguns minutos, é caso de segundo plano.

## Instalar dependências com venv

Num projeto Python, as bibliotecas ficam em um **ambiente virtual** (venv), não no Python do sistema. O fluxo recomendado, dado o comportamento da ferramenta:

1. Você cria e ativa o venv **antes** de abrir o Claude Code:

```powershell
cd C:\projetos\organizador-notas
python -m venv .venv
.\.venv\Scripts\Activate.ps1
claude
```

2. Dentro da sessão, peça a instalação e o registro da dependência:

```text
instale openpyxl no ambiente virtual ativo com pip, adicione ao requirements.txt com a versão instalada e rode python -c "import openpyxl; print(openpyxl.__version__)" para confirmar.
```

3. Confira no diff o `requirements.txt` e, no pedido de permissão, confira que o comando é um `pip install` do pacote certo (sem um `curl | bash` ou um pacote com nome parecido).

Se você esquecer de ativar o venv, cada `pip install` irá para o Python global. Adicione `.venv/` ao `.gitignore` e registre no `CLAUDE.md` (lição 5) "ative `.venv` antes de rodar; dependências em `requirements.txt`".

## Erros comuns

- Pedir "rode os testes" sem ter testes: ele vai escrever alguns — o que pode ser ótimo, mas decida você.
- Deixar o agente "corrigir" o teste para passar: diga explicitamente que os testes não podem mudar.
- Esperar que `pip install` feito pelo Claude vá para o venv que você **não** ativou.
- Rodar um servidor ou uma importação longa em primeiro plano e bater no tempo limite.
- Aprovar `pip install` de um pacote que você não pediu "porque ele achou necessário". Pergunte por quê.

## Na prática

Manhã de fechamento: venv ativado, `claude`, "rode `python -m pytest -q`". Três falhas. "Corrija só o código, não os testes, repita até passar e mostre a saída". Ele itera duas vezes, mostra `3 passed`. Você confere o `/diff`, vê que só `calculo.py` mudou, e commita. Precisa gerar a planilha final? "instale openpyxl no venv e registre em requirements.txt" — e o ciclo continua com a dependência documentada.

## Resumo

- "Rode os testes e corrija, sem alterar os testes, e mostre a saída" é o laço central; exija evidência.
- Cada comando é um processo isolado: `cd` persiste, variáveis não; ative o venv antes de abrir o Claude Code.
- Limites: dois minutos por padrão (até dez), saída truncada, sem entrada de teclado; use segundo plano (Ctrl+B, `/tasks`) para processos longos.
- Dependências: venv ativo, `pip install`, `requirements.txt`, comando conferido no pedido de permissão.
- `!comando` roda algo você mesmo e traz a saída para a conversa.
