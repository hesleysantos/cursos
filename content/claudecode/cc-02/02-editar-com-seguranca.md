Nesta lição você vai consolidar a forma segura de deixar o Claude Code **editar** seu código: pedidos pequenos, leitura atenta do diff, aceitar ou rejeitar cada proposta, pedir testes junto com a mudança e manter o Git como rede de segurança. A diferença entre usar um agente com tranquilidade e viver com medo dele está nesses hábitos.

## Pedidos pequenos, diffs pequenos

Um diff que cabe na tela é um diff que você consegue revisar. A documentação recomenda fazer refatorações "em incrementos pequenos e testáveis" e, para o modo plan, pular o plano quando a mudança cabe em uma frase. Regra prática: uma mudança por mensagem, com o arquivo e a função nomeados.

```text
em folha.py, na função calcular_inss, troque o número mágico 0.075 pela constante ALIQUOTA_INSS_FAIXA1 definida no topo do arquivo. não altere mais nada.
```

"Não altere mais nada" é importante: sem isso, o agente pode aproveitar para "melhorar" formatação, comentários e nomes, e seu diff de 3 linhas vira 40.

## Ler o diff: um roteiro

Quando ele propõe uma edição em modo manual, aparece o diff com um pedido de permissão. Antes de responder, percorra este roteiro:

1. **Arquivo certo?** O nome no topo do diff é o que você pediu?
2. **Só o que pedi?** Procure linhas `-`/`+` fora do trecho combinado.
3. **Entendi cada linha nova?** Se não, recuse e pergunte: "por que essa linha?".
4. **Algo sumiu?** Linhas `-` sem `+` correspondente podem ser remoções indevidas (um `return`, uma validação).
5. **Tem como verificar?** Se não há teste, peça um junto.

Para ver tudo que mudou na pasta de trabalho (edições do Claude e suas, ainda não commitadas), use `/diff` a qualquer momento. Ele lista os arquivos alterados com a contagem de linhas adicionadas e removidas e mostra o diff de cada um. Na renderização em tela cheia (o modo visual mais novo do terminal), ele abre como um painel ao lado da conversa, que fica aberto e se atualiza a cada edição; na renderização clássica, abre como um diálogo acima da caixa de texto, que você fecha ao terminar de ler.

## Aceitar, rejeitar, redirecionar

O diálogo de permissão oferece aprovar a ação, aprová-la para o resto da sessão ou recusar. **Esc** fecha o diálogo sem aprovar, o que na prática recusa. Com uma opção **Yes** ou **No** selecionada, a tecla **Tab** abre um campo de comentário, para você recusar dizendo o motivo ("não quero mudar a assinatura; só a constante"), o que evita uma segunda tentativa igual.

Modos para quem já confia no fluxo: no **accept edits** as edições de arquivos dentro da pasta não perguntam mais, e você revisa depois pelo `/diff` ou pelo `git diff`. A documentação sugere esse modo justamente para "revisar as mudanças no editor ou via `git diff` depois, em vez de aprovar cada edição inline". Use em tarefas repetitivas e de baixo risco; volte ao manual para código sensível.

## Pedir testes junto

A mudança mais segura é a que vem com um teste que prova que ela funciona. Peça os dois na mesma tarefa, mas com a verificação explícita:

```text
em competencia.py, faça extrair_competencia aceitar "15/03/2026" (barras). adicione um caso em testes/test_competencia.py que cubra isso e rode python -m pytest -q. me mostre a saída.
```

A documentação lembra que o Claude "examina seus arquivos de teste existentes para seguir o estilo, os frameworks e os padrões de asserção já em uso" — então, uma vez que o projeto tenha um teste de exemplo, os próximos saem no mesmo padrão. Peça também casos de borda: "adicione testes para valores vazios, datas inválidas e nomes com espaços".

Uma técnica recomendada pela documentação para correções de bug: "escreva um teste que falhe reproduzindo o problema, depois corrija". Assim você vê o teste vermelho ficar verde, e ele não "corrige" algo que não estava quebrado.

## Reverter com Git

O `/rewind` (lição 6 do módulo 1) desfaz edições feitas pelas ferramentas de arquivo, mas a documentação é clara: "não é substituto para o controle de versão". O Git é a rede de segurança definitiva:

- Antes de uma sessão de edições, deixe a árvore limpa (`git status` sem pendências) ou faça um commit do estado atual. Assim, tudo que o Claude mudar aparece em `git diff`.
- Para descartar as mudanças de um arquivo que não ficaram boas:

```powershell
git restore folha.py
```

- Para descartar tudo que não foi commitado (cuidado: irreversível para arquivos sem commit):

```powershell
git restore .
```

- Para voltar a um commit anterior sem perder histórico, peça ao próprio Claude: "reverta o último commit com git revert". Ele propõe o comando e você aprova.

Repare que, em modo auto, o classificador bloqueia por padrão comandos que descartam alterações não commitadas (como `git reset --hard`, `git checkout -- .` e `git restore .`) — justamente porque são irreversíveis. Rodar esses comandos você mesmo, conscientemente, é diferente de deixar o agente rodá-los.

## Erros comuns

- Aprovar "para o resto da sessão" na primeira edição e nunca mais ver um diff.
- Pedir "corrija e melhore o que achar necessário": escopo aberto, diff gigante.
- Deixar mudanças suas não commitadas misturadas com as do Claude; depois não se sabe de quem é cada linha.
- Pedir o teste **depois** de aceitar a mudança: o teste tende a ser escrito para passar, não para provar.
- Usar `git restore .` sem conferir o `git status` antes.

## Na prática

Rotina de uma edição no escritório: `git status` limpo → pedido de uma mudança com "não altere mais nada" e "adicione um teste e rode" → leitura do diff pelo roteiro → aprovação → conferência da saída dos testes → `/diff` para ver o conjunto → commit (próximas lições). Se algo saiu errado no meio, `git restore arquivo` e um pedido mais claro.

## Resumo

- Um pedido por mensagem, arquivo e função nomeados, "não altere mais nada".
- Roteiro do diff: arquivo certo, só o que pedi, entendi tudo, nada sumiu, há verificação.
- Tab abre um comentário na recusa; accept edits troca aprovação inline por revisão posterior com `/diff` ou `git diff`.
- Peça o teste junto com a mudança (ou antes, para bugs) e exija a saída do `pytest`.
- Git é a rede de segurança: árvore limpa antes, `git restore` para descartar, `git revert` para voltar.
