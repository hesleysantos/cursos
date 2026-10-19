# Observabilidade e operação

Nesta lição você vai aprender a **operar** automações, não só construí-las: logs estruturados, métricas que dizem se a esteira está saudável, alertas que avisam antes do cliente reclamar, painéis simples, **runbooks** para quem atende o incidente, e versionamento com rollback. Ao final, você vai transformar um arquivo de logs em métricas com Python.

## O que é observabilidade

É a capacidade de responder, com os dados que o sistema produz, a perguntas como "por que o fechamento da Padaria Sol atrasou?", "quantos documentos falharam ontem e por quê?" e "quanto gastamos de IA por cliente?". Duas fontes bastam para o escritório: **logs** (o que aconteceu, evento por evento) e **métricas** (números agregados ao longo do tempo).

## Logs estruturados

Um log de texto livre ("Erro ao processar nota") é inútil para buscar e agregar. Um log **estruturado** é uma linha JSON por evento, com campos fixos:

```python
import json
from datetime import datetime, timezone

def registrar(evento, **campos):
    linha = {"ts": datetime.now(timezone.utc).isoformat(), "evento": evento}
    linha.update(campos)
    print(json.dumps(linha, ensure_ascii=False))

registrar("etapa_concluida", tarefa_id=812, cliente="11222333000181", etapa="extrair",
          duracao_ms=1840, custo_brl=0.012, status="ok")
registrar("etapa_falhou", tarefa_id=813, cliente="11222333000181", etapa="extrair",
          duracao_ms=30000, status="erro", tipo_erro="timeout", mensagem="API nao respondeu em 30s")
```

Campos que sempre entram: carimbo de tempo em UTC (`ts`), nome do evento, identificador da tarefa, cliente, etapa, duração, status e, nas falhas, o **tipo** do erro (uma categoria fixa: `timeout`, `validacao`, `api_4xx`, `api_5xx`, `arquivo_corrompido`) além da mensagem. O tipo é o que permite contar "quantos timeouts hoje". Em Python real, use o módulo `logging` com um formatador JSON e grave em arquivo rotativo ou envie para um serviço (Loki, Elasticsearch, CloudWatch); o `print` acima é só para mostrar o formato.

Dois cuidados: **nunca registre dados sensíveis** (CPF, senhas, conteúdo de documentos), só identificadores; e defina retenção (12 meses é comum) com acesso restrito, porque logs também são dados pessoais.

## Métricas que importam

| Métrica | Pergunta que responde | Como calcular |
|---|---|---|
| Taxa de sucesso por etapa | A extração está piorando? | concluídas ÷ total, por etapa e por dia |
| Tempo por etapa (mediana e p95) | Onde está o gargalo? | duração das etapas concluídas |
| Fila pendente e idade da tarefa mais antiga | A esteira está parada? | contagem no banco de execuções |
| Custo de IA por documento e por cliente | O que estamos gastando e com quem? | soma de `custo_brl` |
| Pendências humanas abertas | A equipe dá conta da revisão? | tarefas em `aguardando_humano` |
| Erros por tipo | O que mais quebra? | contagem de `tipo_erro` |

A mediana e o **p95** (o valor abaixo do qual estão 95% das medições) dizem mais que a média: uma média de 2 s esconde que 5% das tarefas levam 40 s.

```python
import json
from collections import Counter

LOGS = """{"evento": "etapa_concluida", "etapa": "extrair", "duracao_ms": 1800, "custo_brl": 0.01, "status": "ok"}
{"evento": "etapa_concluida", "etapa": "extrair", "duracao_ms": 2200, "custo_brl": 0.012, "status": "ok"}
{"evento": "etapa_falhou", "etapa": "extrair", "duracao_ms": 30000, "status": "erro", "tipo_erro": "timeout"}
{"evento": "etapa_concluida", "etapa": "validar", "duracao_ms": 120, "custo_brl": 0.0, "status": "ok"}
{"evento": "etapa_falhou", "etapa": "validar", "duracao_ms": 90, "status": "erro", "tipo_erro": "validacao"}
{"evento": "etapa_falhou", "etapa": "extrair", "duracao_ms": 30000, "status": "erro", "tipo_erro": "timeout"}"""

def resumir_logs(texto):
    linhas = [json.loads(l) for l in texto.splitlines() if l.strip()]
    total = len(linhas)
    ok = [l for l in linhas if l["status"] == "ok"]
    duracoes = sorted(l["duracao_ms"] for l in ok)
    mediana = duracoes[len(duracoes) // 2] if duracoes else 0
    return {
        "total": total,
        "taxa_sucesso": round(len(ok) / total, 3) if total else 0.0,
        "mediana_ms": mediana,
        "custo_total": round(sum(l.get("custo_brl", 0) for l in linhas), 3),
        "erros_por_tipo": dict(Counter(l["tipo_erro"] for l in linhas if l["status"] != "ok")),
    }

print(resumir_logs(LOGS))
# {'total': 6, 'taxa_sucesso': 0.5, 'mediana_ms': 1800, 'custo_total': 0.022, 'erros_por_tipo': {'timeout': 2, 'validacao': 1}}
```

Esse resumo, por dia e por etapa, é o painel mínimo.

## Alertas

Alerta é métrica com limiar e destinatário. Regras de ouro: poucos alertas, acionáveis, com o que fazer no texto. Exemplos para a esteira:

- Taxa de sucesso da extração abaixo de 90% na última hora → Slack do time.
- Tarefa mais antiga na fila há mais de 60 minutos → Slack; mais de 4 horas → telefone do responsável.
- Custo de IA do dia acima de 2× a média → e-mail ao sócio.
- Certificado digital de cliente vencendo em 30 dias → tarefa para o atendimento.
- Nenhum documento processado em dia útil até as 10h → "a entrada parou?".

Alertas que disparam toda hora são silenciados em uma semana; ajuste limiares até que cada disparo mereça ação.

## Painéis simples

Não precisa de ferramenta cara: uma planilha alimentada pelo resumo diário, um Metabase apontando para o banco de execuções (gratuito) ou um Grafana. O painel responde, em uma tela: documentos de hoje por etapa; falhas por tipo; pendências humanas por cliente; custo acumulado do mês. Cinco minutos de painel toda manhã evitam a maioria dos incidentes.

## Runbooks e incidentes

Um **runbook** é o roteiro escrito para cada alerta: o que verificar, em que ordem, e como resolver ou a quem escalar. Exemplo para "extração abaixo de 90%":

1. Ver `erros_por_tipo` da última hora no painel.
2. Se `timeout`: checar status da API do provedor; se instável, reduzir concorrência para 1 e aguardar.
3. Se `arquivo_corrompido`: listar os arquivos, mover para pendência humana, avisar atendimento.
4. Se outro: pausar o worker de extração, abrir incidente, chamar o responsável técnico.

Tratamento de incidente: **conter** (pausar o que está causando dano, por exemplo o envio ao cliente), **comunicar** (quem precisa saber, inclusive clientes afetados, se for o caso), **corrigir**, **reprocessar** o que ficou pendente usando os estados da esteira e, depois, uma **análise sem culpa**: o que falhou, por que não foi detectado antes, o que muda. Um parágrafo por incidente, guardado, vira o histórico que evita repetição.

## Versionamento e rollback

Código, prompts, configurações de fluxo (os JSON exportados do n8n e do Make) e layouts de importação ficam em **Git**, com mensagem dizendo o que mudou e por quê. Toda mudança em produção tem uma tag ou commit identificável, e o log registra a versão que processou cada tarefa. Quando algo quebra depois de uma mudança, **rollback** é voltar para a versão anterior em minutos, não "tentar consertar na pressa". Mudança de prompt é mudança de software: passa pelos casos de teste (módulo anterior) antes de ir para produção, e vai primeiro para um cliente ou uma fração dos documentos.

## Armadilhas

- **Log de texto livre**: impossível contar e agregar.
- **Registrar dados sensíveis** no log.
- **Média em vez de mediana e p95**.
- **Alertas demais**: viram ruído e são ignorados.
- **Runbook na cabeça de uma pessoa**: ela tira férias e ninguém sabe operar.
- **Mudar prompt em produção sem versão nem teste**.

## Na prática

Depois de montar a esteira, um escritório passou um mês "no escuro": só descobria falhas quando o cliente cobrava. Implementaram logs JSON com tipo de erro, resumo diário em planilha, três alertas no Slack e runbooks de meia página. No segundo mês, um aumento de timeouts foi detectado às 9h, o runbook mandou reduzir a concorrência, e o fechamento saiu no prazo. A análise mostrou que uma mudança de prompt havia dobrado o tamanho das respostas; o rollback levou cinco minutos porque o prompt estava no Git.

## Resumo

- Observabilidade: logs estruturados (JSON, campos fixos, tipo de erro, sem dados sensíveis) e métricas por etapa, dia e cliente.
- Métricas essenciais: taxa de sucesso, mediana e p95 de tempo, fila e idade, custo de IA, pendências humanas, erros por tipo.
- Alertas poucos e acionáveis, cada um com runbook; painel simples olhado toda manhã.
- Incidente: conter, comunicar, corrigir, reprocessar, analisar sem culpa.
- Tudo versionado em Git (código, prompts, fluxos, layouts); rollback em minutos; mudanças testadas e graduais.
