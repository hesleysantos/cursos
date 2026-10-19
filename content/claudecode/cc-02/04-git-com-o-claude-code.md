Nesta lição você vai usar o Git **conversando**: ver o status, fazer commits com mensagens claras, criar branches, resolver conflitos com ajuda e abrir um pull request com a ferramenta `gh`. Vai também aprender o que revisar antes de cada commit. O Git é a memória permanente do projeto, e com o Claude Code ele deixa de ser um conjunto de comandos decorados para virar uma série de pedidos em português.

## O que o Claude Code sabe do seu Git

Ao abrir numa pasta com repositório, ele enxerga a branch atual, as alterações não commitadas e o histórico recente. A visão geral da documentação resume: "ele prepara as mudanças (stage), escreve mensagens de commit, cria branches e abre pull requests". E ainda: cada conversa é uma sessão ligada à pasta; se você troca de branch, ele vê os arquivos da nova branch, mas a conversa continua a mesma.

## Status e commit

Os prompts do início rápido oficial servem como estão (traduzidos):

```text
quais arquivos eu alterei?
```

```text
faça o commit das minhas alterações com uma mensagem descritiva
```

```text
mostre os últimos 5 commits
```

Antes de aprovar o commit, confira no pedido de permissão **quais arquivos** entram (`git add` de quê?) e **qual mensagem**. Uma boa mensagem diz o quê e o porquê: `Aceita datas com barra em extrair_competencia` é melhor que `ajustes`. Se quiser padronizar, diga a regra: "mensagens em português, no imperativo, com até 72 caracteres na primeira linha". Na lição 5 você vai gravar essa regra no `CLAUDE.md` para não repetir.

> **Dica:** por padrão o Claude Code acrescenta uma linha de atribuição (`Co-Authored-By`) nas mensagens de commit e nas descrições de PR que ele cria. A documentação cita a configuração `attribution` para mudar ou remover isso; se o escritório não quiser a linha, peça ao próprio Claude para ajustar a configuração.

## Branches

Trabalhe cada mudança em uma branch, para que a `main` fique sempre funcionando:

```text
crie uma nova branch chamada feature/log-csv a partir da main
```

Ao terminar, "volte para a main e faça o merge de feature/log-csv". Peça para ele conferir antes: "mostre o que a feature/log-csv tem de diferente da main". Se o projeto tem vários trabalhos em paralelo, a documentação descreve as **worktrees** (`claude --worktree nome`), que criam uma pasta separada por branch; é assunto para mais adiante no curso.

## Resolver conflitos com ajuda

Um merge pode parar em conflito: o Git não sabe escolher entre duas versões da mesma linha. O prompt oficial é simplesmente:

```text
me ajude a resolver os conflitos de merge
```

Ele lê os arquivos com marcadores de conflito, explica as duas versões e propõe a resolução. **Sua parte**: decidir qual regra de negócio vale ("a versão da main tem a alíquota nova; mantenha ela e traga só a formatação da outra branch") e revisar o diff da resolução antes de aprovar. Depois, "rode os testes" — conflito resolvido às pressas é fonte clássica de bug.

## Abrir um pull request com `gh`

A documentação de boas práticas recomenda instalar a **CLI do GitHub (`gh`)**: "o Claude sabe usá-la para criar issues, abrir pull requests e ler comentários". Sem o `gh`, ele ainda pode usar a API do GitHub, mas requisições não autenticadas costumam bater em limites. Instale o `gh`, faça `gh auth login` **você mesmo** (é autenticação; não passe tokens pela conversa) e depois:

```text
crie um pull request para esta branch
```

O prompt oficial ainda mais curto é "create a pr". Ele resume os commits, escreve título e descrição e roda `gh pr create`. Você pode refinar: "melhore a descrição explicando o impacto no fechamento mensal". Quando o PR é criado pelo Claude com `gh pr create`, a sessão fica **vinculada** a ele: depois, `claude --from-pr 123` abre o seletor filtrado pelas sessões daquele PR. A documentação recomenda "revisar o PR gerado antes de enviar e pedir ao Claude para destacar riscos".

Se o escritório não usa GitHub, o fluxo de branch e commit é o mesmo; só o PR muda de ferramenta.

## O que revisar antes de commitar

Uma lista curta que vale para todo commit, com ou sem agente:

1. `git status`/`/diff`: só os arquivos esperados? Nenhum `.env`, planilha de cliente, `.venv/` ou arquivo temporário?
2. O diff inteiro faz sentido? Nada "de brinde"?
3. Os testes passam? Peça a saída.
4. Segredos? Procure senhas, tokens e CNPJs reais em arquivos de teste. Se escaparam, remova antes do commit (depois de commitado, o histórico guarda).
5. Mensagem de commit clara.
6. `.gitignore` atualizado para o que não deve entrar.

Dica de revisão com o próprio agente: `/security-review` analisa as mudanças da branch atual procurando riscos como injeção e exposição de dados (precisa de um remoto `origin`), e `/code-review` revisa o diff em busca de bugs.

## Erros comuns

- Commitar na `main` direto "porque é rápido".
- Aprovar `git add .` sem ver a lista: lá vai o `.env`.
- Deixar o Claude resolver o conflito e não rodar os testes depois.
- Passar o token do GitHub na conversa para "ele configurar o gh": faça o `gh auth login` você.
- Mensagens genéricas ("fix", "ajustes") que não dizem nada daqui a três meses.

## Na prática

Fluxo completo de uma melhoria: "crie a branch feature/competencia-barra" → pedido da mudança com teste → "rode os testes" → revisão da lista acima → "faça o commit com mensagem descritiva" → "crie um pull request" → leitura do PR no GitHub → merge. Tudo em português, cada comando aprovado por você.

## Resumo

- O Claude Code vê branch, alterações e histórico; status, commit, branch, merge e PR viram pedidos em português.
- Revise arquivos e mensagem antes de aprovar o commit; padronize a mensagem (e grave a regra no CLAUDE.md).
- Conflitos: peça ajuda, decida a regra de negócio, revise e rode os testes.
- `gh` instalado e autenticado por você; "crie um pull request" usa `gh pr create` e vincula a sessão ao PR.
- Antes de commitar: só os arquivos certos, diff entendido, testes verdes, zero segredos.
