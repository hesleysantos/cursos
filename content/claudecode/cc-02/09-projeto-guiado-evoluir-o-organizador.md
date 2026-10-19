Neste projeto guiado você vai pegar o organizador de notas fiscais do módulo 1 e evoluí-lo como um projeto profissional, tudo pela conversa: `CLAUDE.md`, testes com pytest, uma branch de trabalho, commits claros e um pull request — com um checklist de revisão humana a cada etapa. É o fluxo que você vai repetir em cada automação do escritório daqui para a frente.

## Ponto de partida

Abra a pasta do módulo 1 com o venv ativo e em modo **manual** (o valor de configuração é `default`). Aqui não começamos em plan, porque a primeira etapa já cria um arquivo (`/init` escreve o `CLAUDE.md`), e no modo plan edições ficam bloqueadas:

```powershell
cd C:\projetos\organizador-notas
python -m venv .venv
.\.venv\Scripts\Activate.ps1
claude --permission-mode default
```

Confira na barra de status `⏸ manual mode on`. Se não guardou o projeto, repita a lição 8 do módulo 1 (leva uns 20 minutos).

## Etapa 1: a memória do projeto

```text
/init
```

Revise o rascunho gerado e peça os ajustes que ele não teria como adivinhar:

```text
no CLAUDE.md, adicione: (1) ativar .venv antes de rodar; (2) testes com python -m pytest -q
(vamos migrar para pytest na etapa 3); (3) competência = data no nome do arquivo, formato AAAA-MM; (4) só biblioteca padrão, nova
dependência precisa de aprovação e entra no requirements.txt; (5) commits em português,
imperativo, primeira linha até 72 caracteres; (6) a pasta entrada/ tem arquivos reais:
nunca apagar, só mover. mantenha o arquivo com menos de 60 linhas.
```

**Checklist humano:** o arquivo tem títulos e bullets? Nada de senha ou caminho pessoal? `/context` lista o `CLAUDE.md` em **Memory files**? Crie também o `.gitignore` com `.venv/`, `__pycache__/`, `organizado/` e `entrada/` (dados reais não vão para o Git).

## Etapa 2: branch e primeiro commit

Ainda em modo manual (se mudou de modo, Shift+Tab até `⏸ manual mode on`), peça:

```text
mostre o git status, crie a branch feature/pytest-e-log a partir da main e faça um commit
só com CLAUDE.md e .gitignore, mensagem "Adiciona CLAUDE.md e .gitignore".
```

**Checklist:** no pedido de permissão, o `git add` inclui **só** os dois arquivos? A mensagem segue a convenção? `git log --oneline -3` confirma?

## Etapa 3: migrar os testes para pytest

```text
converta testes/test_organizador.py de unittest para pytest (funções test_*, assert simples),
mantendo todos os casos. acrescente casos: nome com espaços e maiúsculas, nome com "-" e "_"
misturados e lista vazia em agrupar_por_competencia. rode python -m pytest -q e mostre a
saída. não altere organizador.py nesta etapa.
```

Se o pytest não estiver no venv, ele vai pedir para instalar: confira que o comando é `pip install pytest` e aprove; depois, "adicione pytest ao requirements.txt".

**Checklist:** o diff tocou só a pasta `testes/` (e `requirements.txt`)? A saída termina em `N passed`? Os casos novos realmente existem no arquivo (abra-o e confira)? Nesta etapa tudo deve passar; o teste que falha de propósito fica para a etapa 4.

Commit: "Migra testes para pytest e cobre casos de borda".

## Etapa 4: um bug real e um teste que falha primeiro

```text
escreva primeiro um teste que falhe: extrair_competencia("NF_32-13-2026.pdf") deve devolver
None (mês 13 e dia 32 não existem). rode e mostre a falha. só depois corrija organizador.py
validando mês entre 01 e 12 e dia entre 01 e 31, e rode de novo.
```

**Checklist:** você viu o teste **vermelho** antes da correção? O diff em `organizador.py` é pequeno e só valida intervalos? A assinatura de `extrair_competencia` não mudou (regra do `CLAUDE.md`)?

Commit: "Rejeita datas inválidas em extrair_competencia".

## Etapa 5: log em CSV

```text
adicione um log em CSV (organizado/log.csv) com nome original, destino e data/hora de cada
arquivo movido, usando só csv e datetime. em --simular, não gravar log. teste a função que
monta a linha do log (sem tocar no disco). rode os testes.
```

**Checklist:** `--simular` continua sem efeitos no disco? O log usa `;` ou `,`? (Decida você: o Excel em português abre melhor com `;`.) Os testes passam?

Commit: "Registra movimentações em organizado/log.csv".

## Etapa 6: revisão e pull request

```text
/diff
```

Revise o conjunto da branch contra a `main`. Depois peça uma revisão independente: `/code-review` analisa o diff atual em busca de bugs. Trate os achados que afetam corretude; ignore gosto. Então:

```text
crie um pull request desta branch para a main com título "Testes com pytest, validação de datas e log CSV" e uma descrição com o que mudou, como testar e riscos.
```

Se o `gh` não estiver instalado e autenticado (faça `gh auth login` você mesmo), peça apenas "escreva a descrição do PR em PR.md" e abra o PR pelo site.

**Checklist final:** o PR lista os quatro commits? A descrição diz como testar? Nenhum arquivo de `entrada/` ou `organizado/` entrou? Você leu o diff completo no GitHub antes de fazer o merge?

## Erros comuns

- Pular o `.gitignore` e commitar PDFs de clientes.
- Aceitar que o agente "corrija" o teste de data inválida em vez do código.
- Fazer um commit único com tudo: quatro commits pequenos contam a história.
- Deixar o `CLAUDE.md` virar manual; 60 linhas bastam.
- Abrir o PR sem rodar `/diff` e `/code-review`.

## Rubrica de avaliação

| Critério | Insuficiente | Bom | Excelente |
| --- | --- | --- | --- |
| CLAUDE.md | Não existe ou é vago | Como rodar e regras principais | Curto, verificável, com "não tocar" e convenções |
| Testes | Só os do módulo 1 | pytest com casos de borda | Teste vermelho antes da correção do bug |
| Git | Tudo na main, um commit | Branch e commits por etapa | Mensagens claras, `.gitignore` correto, PR descritivo |
| Revisão humana | Aprovou sem ler | Checklist em cada etapa | Checklist + `/diff` + `/code-review` antes do PR |
| Segurança | Dados reais no repositório | Dados fora do Git | Dados fora, sem segredos, modo manual nas edições |

## Na prática

Esse esqueleto — `CLAUDE.md`, pytest, branch, commits pequenos, PR revisado — serve para qualquer automação do escritório: conciliação, folha, guias. Copie o `CLAUDE.md` como modelo para os próximos projetos e ajuste as regras de negócio. Nos módulos seguintes, o mesmo projeto ganha skills, hooks e integrações.

## Resumo

- `/init` + ajustes manuais criam um `CLAUDE.md` curto e verificável; `.gitignore` protege dados reais.
- Branch por melhoria, um commit por etapa, mensagem na convenção.
- Testes com pytest, casos de borda e teste vermelho antes da correção.
- `/diff` e `/code-review` antes do PR; `gh` autenticado por você; descrição com "como testar" e riscos.
- Checklist humano em toda etapa: arquivos certos, diff entendido, testes verdes, zero segredos.
