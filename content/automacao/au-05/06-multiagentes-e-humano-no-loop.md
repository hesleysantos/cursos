# Multiagentes e humano no loop

Nesta lição você vai entender quando faz sentido dividir um trabalho entre vários agentes (orquestrador e especialistas), como funcionam os **handoffs** entre eles e, mais importante, como colocar uma pessoa no circuito nos pontos críticos: pagamento, envio ao cliente, lançamento contábil. Ao final, você saberá desenhar uma interface de aprovação simples por Slack, WhatsApp ou e-mail e reconhecer quando multiagente é exagero.

## Por que mais de um agente

Um único agente com vinte ferramentas e um prompt de três páginas começa a confundir papéis: usa a ferramenta errada, mistura instruções de atendimento com regras de conciliação. Dividir em agentes menores, cada um com poucas ferramentas e um prompt focado, melhora a precisão pelo mesmo motivo que um escritório divide funções entre fiscal, pessoal e contábil.

Os dois arranjos mais comuns:

- **Orquestrador + especialistas**: um agente coordenador recebe o pedido, decide qual especialista chamar (como se fosse uma ferramenta), recebe o resultado e monta a resposta. O coordenador não tem ferramentas de sistema; só "ferramentas" que são outros agentes.
- **Handoff (passagem de bastão)**: o agente de triagem conversa com o usuário e, ao perceber que o assunto é "folha de pagamento", transfere a conversa inteira para o agente de folha, que assume dali em diante. É o modelo dos *handoffs* do OpenAI Agents SDK. Já os subagentes do Claude Agent SDK e o processo hierárquico do CrewAI seguem o primeiro arranjo: um coordenador delega tarefas e recebe os resultados.

```python
# Orquestrador simples: roteia por assunto e chama o especialista como funcao
def especialista_fiscal(pedido):
    return f"[fiscal] DAS de {pedido['cliente']}: pago em 20/10"

def especialista_folha(pedido):
    return f"[folha] Holerites de {pedido['cliente']}: enviados dia 5"

ESPECIALISTAS = {"fiscal": especialista_fiscal, "folha": especialista_folha}

def orquestrador(pedido):
    assunto = pedido["assunto"]
    if assunto not in ESPECIALISTAS:
        return "Nao sei tratar esse assunto; encaminhando a uma pessoa."
    return ESPECIALISTAS[assunto](pedido)

print(orquestrador({"assunto": "fiscal", "cliente": "Padaria Sol"}))
print(orquestrador({"assunto": "juridico", "cliente": "Padaria Sol"}))
# [fiscal] DAS de Padaria Sol: pago em 20/10
# Nao sei tratar esse assunto; encaminhando a uma pessoa.
```

Na vida real, `orquestrador` e os especialistas seriam chamadas ao modelo com prompts e ferramentas diferentes; a estrutura de roteamento é a mesma.

## Quando multiagente é exagero

Sinais de que você **não** precisa de vários agentes:

- O agente único acerta nos testes. Multiagente é remédio para confusão comprovada, não prevenção.
- As "especialidades" usam as mesmas ferramentas. Dividir só duplica prompt.
- O volume é baixo. Cada agente a mais é mais chamadas, mais custo e mais pontos de falha.
- Ninguém consegue explicar em uma frase o que cada agente faz.

Comece com um agente. Quando o log mostrar que ele erra por misturar contextos, separe. Muitos projetos de "equipe de dez agentes" seriam melhores com um agente e três ferramentas.

## Humano no loop

Agentes erram, e alguns erros são caros ou irreversíveis: pagar uma guia errada, enviar um e-mail com dado de outro cliente, lançar uma nota duplicada. **Humano no loop** (human-in-the-loop) significa que o agente prepara a ação e **para**, esperando que uma pessoa aprove, edite ou rejeite.

Classifique cada ferramenta de escrita:

| Risco | Exemplo | Política |
|---|---|---|
| Baixo, reversível | Criar rascunho, adicionar linha numa planilha de controle interno | Executa e registra |
| Médio | Enviar e-mail ao cliente, agendar reunião | Executa com aprovação, ou automático com amostragem revisada |
| Alto, irreversível | Pagamento, envio de obrigação ao fisco, exclusão | Sempre aprovação, de preferência por pessoa diferente de quem configurou |

A aprovação precisa mostrar **o que** vai ser feito, com os dados concretos ("enviar para cliente@padaria.com o texto: ..."), não "o agente quer enviar um e-mail". E a decisão deve ficar registrada: quem aprovou, quando, o que foi aprovado.

## Interfaces de aprovação

Como a pessoa aprova? Três caminhos comuns:

- **Slack ou Teams**: o agente posta uma mensagem com botões "Aprovar" e "Rejeitar" (Slack Block Kit). O clique dispara um webhook que o seu sistema recebe e retoma a tarefa. É o mais confortável para equipes que já vivem no chat.
- **WhatsApp**: via API oficial (WhatsApp Business Platform) ou ferramentas como Evolution API, o agente envia a proposta e aceita respostas como "SIM 1234" (um código curto evita aprovação acidental). Bom para o sócio que aprova pelo celular.
- **E-mail**: mensagem com link único de aprovação (um token na URL) ou resposta com palavra-chave. Mais lento, mas serve como registro natural.

Em todos os casos, o mecanismo técnico é o mesmo da lição 5: a tarefa salva seu estado como "aguardando aprovação", o processo termina, e um evento (clique, resposta, webhook) carrega o estado e continua. No n8n, isso é o nó **Wait** com retomada por webhook; no LangGraph, a interrupção antes de um nó (`interrupt`) com checkpoint; nos agentes gerenciados, uma confirmação de ferramenta que o cliente responde.

```python
# Registro de uma aprovacao pendente e sua resolucao
pendentes = {}

def pedir_aprovacao(tarefa_id, acao, dados):
    pendentes[tarefa_id] = {"acao": acao, "dados": dados, "status": "aguardando"}
    return f"Aprovar {acao} para {dados['cliente']}? Responda SIM {tarefa_id[-4:]}"

def receber_resposta(tarefa_id, texto, quem):
    p = pendentes.get(tarefa_id)
    if not p or p["status"] != "aguardando":
        return "nada pendente"
    if texto.strip().upper() == f"SIM {tarefa_id[-4:]}":
        p.update(status="aprovado", por=quem)
        return "executando " + p["acao"]
    p.update(status="rejeitado", por=quem)
    return "cancelado"

print(pedir_aprovacao("env-0917", "enviar_email", {"cliente": "Padaria Sol"}))
print(receber_resposta("env-0917", "sim 0917", "Ana"))
print(pendentes["env-0917"]["status"])
# Aprovar enviar_email para Padaria Sol? Responda SIM 0917
# executando enviar_email
# aprovado
```

## Armadilhas

- **Fadiga de aprovação**: se tudo pede aprovação, a pessoa clica "sim" sem ler. Reserve aprovação para o que importa; o resto, automatize e audite por amostragem.
- **Aprovação sem contexto**: "Aprovar?" sem mostrar os dados é teatro de segurança.
- **Orquestrador com ferramentas de sistema**: se o coordenador também executa ações, você perde a separação que justificava dividir.
- **Handoff sem passar o contexto**: o especialista recebe a conversa sem o que já foi apurado e repete perguntas ao usuário.
- **Timeout infinito**: aprovação não respondida em 48 horas deve expirar e avisar, não ficar pendente para sempre.

## Na prática

O assistente de atendimento de um escritório começou com um único agente. Depois de um mês, o log mostrou que perguntas de folha de pagamento recebiam respostas com dados fiscais. A equipe separou em dois especialistas (fiscal e folha) com um triador leve na frente. Para ações, definiram: respostas informativas saem direto, com revisão semanal por amostragem de 10%; e-mails com documentos anexados e agendamentos passam por aprovação no Slack; nada de pagamento ou envio ao fisco passa pelo agente. A aprovação no Slack mostra o texto completo, o anexo e um botão; o clique fica registrado com usuário e hora. A fila de aprovações leva cinco minutos por dia.

## Resumo

- Vários agentes resolvem confusão de papéis: orquestrador + especialistas ou handoffs; comece com um e divida quando o log mostrar necessidade.
- Multiagente é exagero quando o agente único acerta, as especialidades usam as mesmas ferramentas ou o volume é baixo.
- Humano no loop: ações de escrita classificadas por risco; alto risco sempre com aprovação, mostrando dados concretos e registrando a decisão.
- Interfaces: botões no Slack/Teams, código curto no WhatsApp, link único por e-mail; tecnicamente, estado salvo e retomada por evento.
- Evite fadiga de aprovação: aprove o que importa, audite o resto por amostragem, expire pendências.
