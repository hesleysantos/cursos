# Confiabilidade de agentes

Nesta lição você vai aprender as proteções que separam um agente de demonstração de um agente que roda todo dia sem supervisão: timeouts, retentativas com recuo exponencial (backoff), idempotência, filas, limites de passos e de custo, sandbox para ações perigosas e testes. Ao final, você vai implementar um `retry` com backoff e entender por que cada uma dessas peças existe.

## Tudo falha, o tempo todo

APIs de modelo ficam lentas ou devolvem erro 429 (limite de requisições) e 529/503 (sobrecarga). A rede cai. O sistema contábil trava. Um agente de produção precisa supor que **cada** chamada pode falhar e reagir sem intervenção humana, mas sem causar estragos (como enviar o mesmo e-mail três vezes).

## Timeouts

Toda chamada externa precisa de um tempo máximo. Sem timeout, uma requisição travada segura o agente para sempre. Os SDKs de API têm padrão (o da Anthropic, 10 minutos; `requests` em Python não tem padrão, você precisa passar `timeout=`). Defina por operação: uma consulta a planilha deve responder em segundos; uma chamada ao modelo com tarefa longa pode levar minutos. E lembre: o tempo total pode ser timeout × tentativas.

## Retentativas com backoff exponencial

Erros transitórios (429, 5xx, queda de conexão) merecem nova tentativa; erros definitivos (400, 401, 404) não, porque repetir dá o mesmo erro. Entre tentativas, espere um tempo **crescente** (1 s, 2 s, 4 s, 8 s) com um pouco de **aleatoriedade** (jitter), para que mil clientes que falharam juntos não tentem de novo no mesmo instante.

```python
import random

class TransitorioError(Exception):
    """Erro que vale a pena tentar de novo (429, 5xx, queda de conexao)."""

def retry_backoff(funcao, tentativas=4, base=1.0, fator=2.0, jitter=0.1, dormir=None):
    """Chama funcao(); em erro transitorio, espera base*fator**n (+jitter) e repete.
    dormir: funcao que recebe segundos (injetada para simular sem esperar de verdade)."""
    esperas = []
    for n in range(tentativas):
        try:
            return funcao(), esperas
        except TransitorioError:
            if n == tentativas - 1:
                raise
            espera = base * (fator ** n) + random.uniform(0, jitter)
            esperas.append(round(espera, 2))
            if dormir:
                dormir(espera)
    raise RuntimeError("inesperado")

chamadas = {"n": 0}
def api_instavel():
    chamadas["n"] += 1
    if chamadas["n"] < 3:
        raise TransitorioError("429 Too Many Requests")
    return "ok"

random.seed(1)
resultado, esperas = retry_backoff(api_instavel, dormir=lambda s: None)
print(resultado, chamadas["n"], esperas)
# ok 3 [1.01, 2.08]
```

A função `dormir` é injetada para que o teste não espere de verdade; em produção, passe `time.sleep`. Os SDKs oficiais já fazem retry com backoff para 429 e 5xx (o da Anthropic tenta 2 vezes por padrão, configurável); ainda assim, suas **próprias** ferramentas (planilha, ERP, e-mail) precisam dessa proteção.

## Idempotência

Repetir uma chamada é seguro só se ela for **idempotente**: executar duas vezes produz o mesmo efeito de executar uma. Consultar é idempotente; "enviar e-mail" e "criar lançamento" não são. Como tornar seguras as retentativas de escrita:

- **Chave de idempotência**: cada ação recebe um identificador único (ex.: `envio-2026-09-padaria-das`). Antes de executar, o código verifica se aquela chave já foi processada; se sim, devolve o resultado anterior sem repetir. Muitas APIs de pagamento aceitam um cabeçalho `Idempotency-Key` com exatamente essa função.
- **Verificar antes de escrever**: "já existe lançamento com este número de nota?" antes de inserir.
- **Registrar a intenção antes de agir**: salve "vou enviar" em banco, execute, salve "enviado". Se o processo cair no meio, na retomada você sabe o que checar.

```python
executados = {}

def executar_idempotente(chave, acao):
    if chave in executados:
        return executados[chave], "repetido"
    resultado = acao()
    executados[chave] = resultado
    return resultado, "novo"

print(executar_idempotente("envio-0917", lambda: "email enviado"))
print(executar_idempotente("envio-0917", lambda: "email enviado"))
# ('email enviado', 'novo')
# ('email enviado', 'repetido')
```

## Filas: noção

Quando chegam 200 documentos de uma vez, processar tudo no mesmo instante derruba a API (limite de requisições) e o seu servidor. Uma **fila** desacopla a chegada do processamento: o evento entra na fila, e um ou mais **workers** retiram um item por vez e processam. Se um worker cai, o item volta para a fila. Ferramentas: Redis com RQ ou Celery, RabbitMQ, SQS na AWS; no n8n, o modo *queue* com Redis faz isso por baixo. A lição 4 do próximo módulo monta uma esteira completa com filas.

## Limites de passos e de custo

Um agente pode entrar em laço: chama a ferramenta, o resultado não ajuda, chama de novo. Imponha, por tarefa:

- **Máximo de passos** (10 a 30, conforme a complexidade). Ao atingir, pare e escale.
- **Orçamento de tokens ou de dinheiro**: some os tokens de cada chamada (os provedores devolvem `usage`); ao passar do teto, pare. Alguns provedores permitem informar um orçamento ao modelo, para que ele se organize dentro dele.
- **Tempo total** da tarefa.
- **Limite diário** do agente inteiro, como seguro contra bugs: se gastar mais que X por dia, desliga e avisa.

## Sandbox para ações perigosas

Se o agente executa código, comandos de terminal ou mexe em arquivos, faça isso em um ambiente isolado: um contêiner Docker descartável, uma pasta de trabalho separada, um usuário sem privilégios, sem acesso à rede interna. Os agentes gerenciados dos provedores rodam cada sessão num contêiner por esse motivo. Para ações em sistemas reais (ERP, banco), o "sandbox" é o ambiente de homologação: teste lá antes de apontar para produção.

## Testes de agentes

Agentes não são determinísticos, então testar é diferente de testar uma função:

- **Testes das ferramentas**: as funções Python por trás das ferramentas são comuns; teste-as com `pytest` como qualquer código.
- **Testes de cenário** (evals): uma lista de pedidos reais com o resultado esperado (qual ferramenta deveria ser chamada, que resposta é aceitável). Rode periodicamente e meça a taxa de acerto; a lição 9 monta 30 casos.
- **Modelo simulado**: nos testes de integração, substitua a chamada ao modelo por respostas gravadas, para testar o laço, os limites e as aprovações sem custo e sem variação.
- **Casos adversos**: pedidos ambíguos, dados faltando, instruções maliciosas (lição 8).

## Armadilhas

- **Retry em erro 400**: só gasta tempo; o erro é seu.
- **Retry em ação não idempotente**: e-mail triplicado, lançamento duplicado.
- **Backoff sem jitter**: todas as retentativas caem no mesmo segundo.
- **Limite de passos alto demais** "para o agente conseguir": o laço infinito fica só mais caro.
- **Testar só com o modelo real**: caro, lento e não reproduzível. Grave respostas.

## Na prática

O agente de triagem de documentos de um escritório parou numa segunda-feira de pico: a API devolvia 429 e o código abortava a fila inteira. A correção foi em camadas: retry com backoff e jitter nas chamadas ao modelo; fila com três workers e limite de requisições por minuto; chave de idempotência por documento (hash do arquivo) para que a reexecução não duplicasse lançamentos; teto de 20 passos e de custo por documento; e um painel com a taxa de erro por hora. Na segunda-feira seguinte, o pico foi absorvido sem intervenção.

## Resumo

- Suponha que toda chamada pode falhar: timeout em tudo, retry com backoff exponencial e jitter só para erros transitórios.
- Idempotência torna as retentativas seguras: chave única por ação, verificação antes de escrever, intenção registrada.
- Filas desacoplam chegada e processamento e absorvem picos.
- Limites de passos, tokens, tempo e gasto diário são o seguro contra laços e bugs.
- Sandbox para código e arquivos; homologação para sistemas reais; testes de ferramentas, cenários gravados e casos adversos.
