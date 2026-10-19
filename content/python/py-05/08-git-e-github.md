# Git e GitHub: controle de versão para o seu código

Nesta lição você aprende a usar o **Git**, a ferramenta que registra a história do seu código, e o **GitHub**, o serviço que guarda essa história na nuvem e permite colaborar. Você vai criar um repositório, gravar commits, trabalhar com branches, juntar mudanças, resolver conflitos, abrir pull requests e até publicar um site estático com GitHub Pages. Para quem já viu `relatorio_final_v3_REVISADO_agora_vai.xlsx`, o Git é a resposta definitiva.

## Por que controle de versão?

Sem Git, versionar é copiar arquivos com nomes diferentes. Isso falha de três formas: você não sabe **o que** mudou entre as cópias, não sabe **por que**, e duas pessoas não conseguem trabalhar no mesmo arquivo sem sobrescrever uma a outra. O Git resolve as três: cada **commit** é uma fotografia do projeto com autor, data e mensagem explicando o motivo; **branches** permitem experimentar sem estragar o que funciona; e **merge** junta trabalho de várias pessoas, apontando exatamente onde elas colidiram.

Além disso, o GitHub é hoje o currículo do programador e o lugar onde ficam as bibliotecas que você usa. Saber Git é pré-requisito para qualquer trabalho com código.

## Os três estados

Todo arquivo em um repositório está em um de três lugares:

1. **Diretório de trabalho**: os arquivos que você edita.
2. **Área de preparação (staging/index)**: o que você escolheu para entrar no próximo commit (`git add`).
3. **Repositório**: a história gravada (`git commit`).

Esse passo intermediário parece burocracia, mas é o que permite gravar **só parte** das mudanças em um commit coerente: "corrige cálculo de ICMS" em um, "ajusta formatação da planilha" em outro.

## Começando

```bash
git config --global user.name "Seu Nome"
git config --global user.email "voce@exemplo.com"

mkdir robo-fechamento && cd robo-fechamento
git init
# Initialized empty Git repository in .../robo-fechamento/.git/

echo "# Robô de fechamento" > README.md
git status
# Untracked files: README.md

git add README.md
git commit -m "Cria README inicial"
# [main (root-commit) 3f2a1c9] Cria README inicial
#  1 file changed, 1 insertion(+)

git log --oneline
# 3f2a1c9 Cria README inicial
```

`git status` é o comando que você mais vai digitar: ele diz o que mudou, o que está preparado e em qual branch você está. `git diff` mostra as linhas alteradas ainda não preparadas; `git diff --staged`, as já preparadas.

### Mensagens de commit

Uma boa mensagem é curta, no imperativo e diz **o que** e, se não for óbvio, **por quê**: "Corrige arredondamento no total de PIS" é melhor que "ajustes". Commits pequenos e frequentes são mais fáceis de entender e de desfazer.

## .gitignore

Nem tudo deve entrar no repositório: o `.venv`, arquivos `.pyc`, planilhas de saída, bancos `.db` e, principalmente, o `.env` com senhas. O arquivo `.gitignore` lista padrões que o Git deve ignorar:

```
# .gitignore
.venv/
__pycache__/
*.pyc
*.db
saida/
.env
.vscode/
```

Crie-o **antes** do primeiro commit. Um segredo que entrou na história continua lá mesmo depois de apagado do arquivo; se vazar, troque a senha.

## Branches e merge

Uma **branch** é uma linha de desenvolvimento independente. A principal costuma se chamar `main`. Para trabalhar em algo novo sem arriscar o que funciona:

```bash
git switch -c envio-email        # cria e muda para a branch
# ... edita emails.py ...
git add emails.py
git commit -m "Adiciona envio de resumo por e-mail"

git switch main                  # volta para a principal
git merge envio-email            # traz os commits da outra branch
# Updating 3f2a1c9..8b7d2e1
# Fast-forward
#  emails.py | 42 ++++++++++++
git branch -d envio-email        # apaga a branch já integrada
```

Quando `main` não mudou desde que a branch nasceu, o merge é um **fast-forward**: só move o ponteiro. Quando ambas mudaram, o Git cria um **commit de merge** com dois pais.

### Resolvendo conflitos

Conflito acontece quando as duas branches alteraram **as mesmas linhas**. O Git para e marca o arquivo:

```
<<<<<<< HEAD
ALIQUOTA_PIS = 0.0065
=======
ALIQUOTA_PIS = 0.0165
>>>>>>> ajuste-aliquotas
```

Entre `<<<<<<<` e `=======` está a versão da branch atual; entre `=======` e `>>>>>>>`, a da outra. Você edita o arquivo deixando a versão correta (sem os marcadores), roda os testes, e conclui:

```bash
git add config.py
git commit            # mensagem padrão "Merge branch 'ajuste-aliquotas'"
```

Se se perder, `git merge --abort` volta ao estado anterior. Conflitos são normais; o que os torna raros é fazer commits pequenos e integrar com frequência.

## GitHub: remotos, push e pull

Crie um repositório vazio no GitHub e conecte-o ao seu:

```bash
git remote add origin https://github.com/seu-usuario/robo-fechamento.git
git push -u origin main          # envia e marca origin/main como upstream
# ... no dia seguinte, em outra máquina ou após um colega enviar ...
git pull                         # busca e integra (fetch + merge)
```

`origin` é só um apelido para a URL. `push` envia seus commits; `pull` traz os dos outros. `git fetch` apenas baixa, sem integrar, para você inspecionar antes com `git log origin/main`. Para clonar um projeto existente: `git clone URL`.

A autenticação no GitHub é por **token** ou chave SSH, não por senha. O GitHub CLI (`gh auth login`) simplifica isso.

## Pull requests

Em equipe, ninguém envia direto para `main`. O fluxo é:

1. Criar uma branch (`git switch -c corrige-icms`).
2. Fazer commits e enviar a branch: `git push -u origin corrige-icms`.
3. Abrir um **pull request (PR)** no GitHub: uma página que mostra o diff, permite comentários linha a linha e roda verificações automáticas (testes, lint).
4. Um colega revisa, pede ajustes, aprova.
5. Alguém clica em **Merge**; a branch é apagada.

O PR é onde a qualidade do código se decide. Mesmo trabalhando sozinho, abrir PRs para si mesmo força uma releitura e deixa um histórico explicando cada mudança. Com GitHub Actions você pode exigir que os testes passem antes de permitir o merge (verá isso no próximo módulo).

## Desfazendo coisas

| Quero... | Comando |
|---|---|
| Descartar edição não preparada em um arquivo | `git restore arquivo.py` |
| Tirar arquivo da área de preparação | `git restore --staged arquivo.py` |
| Corrigir a mensagem do último commit | `git commit --amend` |
| Desfazer um commit já enviado, criando outro que o reverte | `git revert abc1234` |
| Voltar o repositório a um commit (cuidado) | `git reset --hard abc1234` |
| Ver quem alterou cada linha | `git blame arquivo.py` |

`revert` é seguro em branches compartilhadas porque não reescreve história. `reset --hard` e `--amend` reescrevem: use só em commits que ainda não foram enviados.

## GitHub Pages

Se o seu repositório tem um site estático (HTML, CSS, JS, como o deste curso), o GitHub o hospeda de graça: em Settings, Pages, escolha a branch `main` e a pasta (`/` ou `/docs`). Em um minuto o site está em `https://seu-usuario.github.io/robo-fechamento/`. Cada `push` republica. É a forma mais simples de compartilhar um painel estático, uma documentação ou um portfólio.

## Fluxo diário

```bash
git switch main && git pull          # começa atualizado
git switch -c minha-tarefa           # branch para a tarefa
# edita, testa
git add -A && git commit -m "..."    # commits pequenos
git push -u origin minha-tarefa      # envia
# abre PR, revisa, merge
git switch main && git pull          # recomeça
```

## Armadilhas comuns

- **Commitar `.env` ou senhas.** `.gitignore` antes do primeiro commit.
- **Commitar o `.venv`** ou saídas geradas: o repositório incha e os diffs viram lixo.
- **Commits gigantes** com mensagem "alterações". Impossível revisar ou reverter.
- **Trabalhar direto na `main`.** Branch para cada tarefa.
- **`git push --force` em branch compartilhada.** Apaga o trabalho dos outros.
- **Resolver conflito sem rodar os testes.** O arquivo "compila", mas a lógica ficou misturada.
- **Esquecer o `git pull`** antes de começar e descobrir o conflito só na hora do push.

## Na prática

Mesmo sozinho, versione **todo** script que roda em produção, inclusive os de uma tela só. Quando o robô que funcionava há meses quebrar, `git log` mostra o que mudou e quando, e `git revert` devolve a versão boa em um minuto, no meio do fechamento. Um repositório privado no GitHub ainda serve de backup e permite que um colega assuma o script nas suas férias; a mensagem de cada commit é a documentação que você nunca teria escrito.

## Resumo

- Git registra fotografias (commits) do projeto; o fluxo é editar, `git add`, `git commit`, com `git status` e `git diff` como guias.
- `.gitignore` protege segredos e evita lixo no repositório; crie-o antes do primeiro commit.
- Branches isolam tarefas; `merge` junta; conflitos são marcados no arquivo e você escolhe a versão certa.
- GitHub guarda o remoto (`push`/`pull`), hospeda pull requests para revisão e publica sites estáticos com Pages.
- Para desfazer, prefira `revert` em história compartilhada; `reset --hard` e `--amend` só em commits locais.
