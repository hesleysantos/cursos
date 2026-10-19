Nesta lição você vai aprender a conduzir **tarefas grandes** com o Claude Code: entrar no modo de planejamento, revisar e editar o plano, executar em etapas, acompanhar a lista de tarefas e decidir quando dividir o trabalho em sessões. O exemplo será migrar uma planilha de controle para um banco SQLite — um projeto típico de escritório que, sem plano, costuma virar um emaranhado.

## Por que planejar

A documentação resume: "deixar o Claude pular direto para o código pode produzir código que resolve o problema errado". O modo plan separa **exploração** de **execução**: ele lê arquivos, roda comandos de exploração e escreve um plano, mas **não edita** nada até você aprovar. A recomendação oficial é usar plano quando a abordagem é incerta, a mudança toca vários arquivos ou o código é desconhecido; e pular o plano quando o diff cabe em uma frase.

## Entrar no modo plan

Três formas documentadas:

- Pressionar **Shift+Tab** até a barra mostrar `⏸ plan mode on`.
- Iniciar a sessão já nele: `claude --permission-mode plan`.
- Prefixar um único pedido com `/plan`: `/plan migre a planilha para SQLite`.

Shift+Tab de novo sai do modo plan sem aprovar nada.

## O exemplo: planilha → SQLite

Situação: o escritório controla os honorários em `honorarios.xlsx` (abas Clientes e Lançamentos). Queremos um `honorarios.db` em SQLite, um script de importação e funções de consulta, sem perder nenhum dado.

Prompt no modo plan:

```text
Quero migrar honorarios.xlsx (abas Clientes e Lançamentos) para um banco SQLite honorarios.db.
Requisitos: tabelas clientes e lancamentos com chave estrangeira; importação idempotente
(rodar duas vezes não duplica); valores em centavos (inteiro), nunca float; um script
consultas.py com total por cliente e por competência; testes com pytest.
Explore o projeto, veja como a planilha é lida hoje e monte um plano com etapas pequenas
e verificáveis. Diga o que você precisa que eu decida.
```

Repare nos ingredientes: objetivo, requisitos verificáveis, regra de negócio (centavos), e o pedido explícito de etapas pequenas e de perguntas. A documentação sugere até pedir para ele **entrevistar** você antes de escrever uma especificação, usando a ferramenta `AskUserQuestion`, quando a funcionalidade é grande.

## Revisar e editar o plano

Quando o plano estiver pronto, ele o apresenta e pergunta como seguir. As opções documentadas são:

- **Yes, and use auto mode** (ou "Yes, auto-accept edits", quando o modo auto não está disponível): aprova e executa com menos interrupções.
- **Yes, manually approve edits**: aprova e você revisa cada edição.
- **No, keep planning**: continua planejando; diga o que mudar.

Antes de escolher, abra o plano no seu editor com **Ctrl+G** e corrija direto no texto — reordene etapas, corte o que não pediu, acrescente restrições. Perguntas de revisão: as etapas são pequenas e cada uma tem como ser verificada? A ordem faz sentido (modelo de dados antes da importação, importação antes das consultas)? Há uma etapa de **validação contra a planilha** (contagem de linhas e soma dos valores iguais)? Se não, "No, keep planning" e peça.

Aprovar o plano sai do modo plan e também dá à sessão um título gerado a partir do plano (se você ainda não a nomeou).

## Executar em etapas

Mesmo com o plano aprovado, mande executar **uma etapa por vez**:

```text
execute só a etapa 1 (criar o esquema do banco em esquema.sql e a função criar_banco()). rode os testes dessa etapa e pare para eu revisar.
```

Depois da revisão, "siga para a etapa 2". Isso mantém os diffs pequenos e permite corrigir cedo. Entre etapas, se o contexto estiver pesado, `/compact mantenha o plano, a lista de arquivos alterados e o comando de teste`.

## Lista de tarefas

Em tarefas com vários passos, o Claude mantém uma **lista de tarefas** (checklist) com o andamento. Pressione **Ctrl+T** para mostrar ou ocultar essa lista na área de status. Use-a para acompanhar o que já foi feito e o que falta, e para pedir ajustes ("adicione à lista: validar soma dos valores contra a planilha"). Não confunda com `/tasks`, que lista processos em segundo plano (comandos e subagentes).

## Quando dividir em sessões

A documentação recomenda escrever a especificação numa sessão e **iniciar uma sessão nova** para executá-la: "a nova sessão tem contexto limpo, focado na implementação, e você tem uma especificação escrita para consultar". Sinais de que é hora de dividir:

- O plano ficou longo e a conversa de planejamento já ocupa muito contexto (`/context`).
- Cada etapa é independente (importação, consultas, relatório).
- Você vai parar e continuar outro dia: nomeie (`/rename migracao-sqlite`) e retome com `claude --resume migracao-sqlite`.

Padrão sugerido: peça "salve o plano aprovado em PLANO.md" ao final do planejamento; `/clear`; na sessão nova, "implemente a etapa 1 de @PLANO.md". O arquivo vira a fonte da verdade, imune à compactação.

## Erros comuns

- Aprovar o plano sem ler (o Ctrl+G existe para isso).
- Escolher "use auto mode" numa migração que mexe com dados reais: comece com aprovação manual.
- Mandar "execute o plano todo" e receber um diff de 15 arquivos.
- Não incluir a etapa de validação (contagens e somas) e descobrir linhas perdidas meses depois.
- Insistir na mesma sessão com o contexto cheio; dividir é mais barato que corrigir.

## Na prática

Migrações de planilha para banco aparecem toda hora: controle de certificados, protocolo de entregas, tabela de honorários. O roteiro é sempre o mesmo: plan mode → prompt com requisitos verificáveis → plano editado no Ctrl+G → aprovação com revisão manual → uma etapa por vez com testes → validação final contra a origem → commit e PR. Guarde o `PLANO.md` no repositório: ele documenta a decisão.

## Resumo

- Plan mode (Shift+Tab, `--permission-mode plan` ou `/plan`) explora e propõe sem editar.
- Revise o plano com Ctrl+G; aprove com "manually approve edits" em dados reais; "keep planning" se faltar algo.
- Execute uma etapa por vez com teste; acompanhe com a lista de tarefas (Ctrl+T).
- Divida em sessões quando o plano é longo ou as etapas são independentes; salve o plano em um arquivo.
- Em migrações, exija validação contra a origem (contagens e somas).
