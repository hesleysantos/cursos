# O que é um agente de IA

Nesta lição você vai entender o que diferencia um **agente** de um fluxo de automação comum, conhecer o ciclo observar → raciocinar → agir e, principalmente, aprender a decidir quando um agente compensa e quando um fluxo simples do Make ou do n8n resolve melhor. Isso importa porque "agente" virou palavra da moda: muita gente gasta tempo e dinheiro montando um agente para uma tarefa que um fluxo de cinco passos faria com mais segurança.

## Fluxo fixo versus agente

Nos módulos anteriores você montou **workflows**: sequências de passos definidas por você. Chegou um e-mail → extrai o anexo → classifica com IA → grava na planilha → avisa no WhatsApp. A ordem é fixa; a IA entra só em etapas pontuais (classificar, extrair). Se aparece uma situação que o fluxo não previu, ele quebra ou cai num ramo "outros".

Um **agente** inverte a lógica: o modelo de linguagem recebe um **objetivo**, uma lista de **ferramentas** e decide, passo a passo, o que fazer. Ele pode consultar a planilha, perceber que falta um dado, pedir para ler um e-mail, e só então responder. O caminho não está escrito de antemão; é escolhido durante a execução.

Uma analogia de escritório: o workflow é o **checklist** que o estagiário segue sem desviar; o agente é o **assistente experiente** que recebe "resolve a pendência do cliente X" e descobre sozinho quais sistemas abrir. O assistente é mais flexível, mas custa mais caro, demora mais e pode errar de formas que o checklist não erraria.

## O ciclo: observar → raciocinar → agir

Todo agente, em qualquer framework, repete o mesmo laço:

1. **Observar**: lê o estado atual: a mensagem do usuário, o resultado da última ferramenta, o conteúdo de um arquivo.
2. **Raciocinar**: o modelo decide o próximo passo: responder, chamar uma ferramenta ou pedir esclarecimento.
3. **Agir**: o código executa a ferramenta escolhida (consulta ao banco, envio de e-mail, cálculo) e devolve o resultado para a próxima observação.

O laço termina quando o modelo decide que o objetivo foi atingido ou quando o código impõe um limite (número máximo de passos, custo, tempo). Em pseudocódigo:

```python
def executar_agente(objetivo, ferramentas, max_passos=10):
    historico = [{"role": "user", "content": objetivo}]
    for passo in range(max_passos):
        decisao = modelo(historico, ferramentas)      # raciocinar
        if decisao["tipo"] == "resposta_final":
            return decisao["texto"]
        resultado = executar(decisao["ferramenta"], decisao["args"])  # agir
        historico.append({"role": "tool", "content": resultado})     # observar
    return "Limite de passos atingido; escalando para humano."

# simulação sem modelo real, só para ver o laço funcionar
def modelo(historico, ferramentas):
    if len(historico) == 1:
        return {"tipo": "ferramenta", "ferramenta": "consultar_planilha", "args": {"cliente": "Padaria Sol"}}
    return {"tipo": "resposta_final", "texto": "DAS de setembro está pago."}

def executar(nome, args):
    return f"{nome}({args}) -> status: pago"

print(executar_agente("Situação do DAS da Padaria Sol?", ["consultar_planilha"]))
# DAS de setembro está pago.
```

Repare que o **código** continua no controle: é ele que executa ferramentas, conta passos e decide quando parar. O modelo só sugere. Essa separação é a base de toda a segurança que veremos na lição 8.

## Quando um agente compensa

Use quatro perguntas antes de montar um agente:

| Pergunta | Se a resposta é "sim" | Se é "não" |
|---|---|---|
| A tarefa tem **muitos caminhos** possíveis, difíceis de listar? | Agente faz sentido | Workflow fixo |
| O **valor** por tarefa justifica custo e latência maiores? | Agente | Workflow ou chamada única |
| Os **erros** podem ser detectados e corrigidos (revisão, teste, desfazer)? | Agente com aprovação | Nem agente nem automação cega |
| Um modelo atual **consegue** fazer isso de forma confiável? | Agente | Espere ou simplifique |

Se qualquer resposta for "não", fique no nível mais simples. Classificar 300 notas fiscais por tipo de despesa não precisa de agente: é uma chamada de IA por nota dentro de um workflow (módulo 4). Já "descubra por que o saldo de fornecedores do cliente não fecha, consultando razão, extratos e e-mails" é uma investigação com caminhos imprevisíveis: um agente com ferramentas de leitura resolve bem, desde que um humano confirme o diagnóstico.

## Exemplos de agentes úteis no escritório

- **Assistente de atendimento**: responde dúvidas de clientes com base nos documentos do escritório, consulta o status das obrigações do mês e, quando não sabe, abre um chamado para uma pessoa. É o projeto da lição 9.
- **Investigador de divergências**: recebe "a conciliação do banco X não bate", lê o extrato, o razão e os lançamentos pendentes, e apresenta hipóteses com os lançamentos suspeitos.
- **Preparador de reuniões**: antes da reunião com o cliente, junta faturamento, impostos pagos, pendências e e-mails recentes num resumo de uma página.
- **Triagem de e-mails**: lê a caixa compartilhada, classifica, responde o que é rotina (segunda via de guia, confirmação de recebimento) e encaminha o resto com contexto.

Repare que os quatro exemplos têm algo em comum: ações de **leitura** são livres; ações de **escrita** (responder, lançar, pagar) passam por confirmação humana. Essa é a regra de ouro para começar.

## Armadilhas

- **Agente para tudo**: o erro mais comum. Se você consegue desenhar o fluxo num papel com menos de dez caixas, não precisa de agente.
- **Sem limite de passos**: um agente que não encontra a resposta pode rodar em círculos e gastar dezenas de chamadas. Sempre imponha um máximo.
- **Confundir sugestão com execução**: o modelo não executa nada sozinho. Se o seu código executa qualquer coisa que o modelo pedir, a responsabilidade pelo erro é do código.
- **Testar só o caminho feliz**: agentes brilham nos exemplos bonitos e falham nos casos de borda. Teste com pedidos ambíguos, dados faltando e instruções maliciosas.

## Na prática

Um escritório com 120 clientes recebe por dia uns 40 pedidos repetitivos por WhatsApp e e-mail: "minha guia venceu?", "manda o boleto de novo", "qual o faturamento do trimestre?". Um workflow fixo responde mal porque cada pergunta exige consultar uma fonte diferente. Um agente com três ferramentas de leitura (planilha de obrigações, pasta de guias, base de conhecimento) e uma de escrita com aprovação (enviar resposta) responde 70% dos casos em segundos e encaminha o resto com o contexto já reunido. Antes de construir, o escritório listou 30 pedidos reais e marcou quais ferramentas cada um exigiria. Esse levantamento, não o framework, é o que faz o projeto dar certo.

## Resumo

- Workflow: caminho fixo definido por você; agente: o modelo escolhe os passos em tempo de execução, com ferramentas.
- O ciclo é observar → raciocinar → agir, repetido até a resposta final ou até um limite imposto pelo código.
- Agente compensa quando há muitos caminhos, valor alto por tarefa, erros recuperáveis e capacidade real do modelo; caso contrário, use um fluxo simples.
- Leituras livres, escritas com aprovação humana: a regra para começar com segurança.
- O código, não o modelo, executa ferramentas e impõe limites.
