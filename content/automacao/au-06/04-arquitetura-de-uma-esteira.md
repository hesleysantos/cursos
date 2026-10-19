# Arquitetura de uma esteira de automação

Nesta lição você vai aprender a desenhar uma **esteira** (pipeline): o conjunto de peças que recebe entradas de várias origens, processa em etapas, guarda o que aconteceu e mostra o andamento. Você vai conhecer as seis peças (entradas, fila, workers, banco de execuções, armazenamento de arquivos e painel), desenhar a esteira do fechamento mensal e simular uma fila com estados de tarefas em Python. É o esqueleto sobre o qual o projeto final do módulo é construído.

## Por que uma esteira, e não um script

Um script que faz tudo de uma vez funciona até o dia em que: chegam 300 documentos juntos, a API cai no meio, alguém quer saber "em que pé está o cliente X" ou é preciso reprocessar só os que falharam. A esteira resolve isso separando responsabilidades: cada peça faz uma coisa, o estado de cada tarefa fica registrado, e as etapas podem rodar em paralelo e ser retomadas.

## As seis peças

```
Entradas            Fila           Workers            Banco de execuções
(e-mail, pasta,  -> [tarefa] ->  classificar  ->   id | etapa | status | tentativas
 webhook, API)      [tarefa]     extrair             log por tarefa
                    [tarefa]     validar
                                 lançar       <->   Armazenamento de arquivos
                                                    (original, extraído, gerado)
                                       |
                                       v
                                  Painel (fila, falhas, por cliente)
```

1. **Entradas**: tudo que dispara trabalho. Um e-mail na caixa de documentos, um arquivo que aparece numa pasta monitorada (ou no Drive), um webhook do WhatsApp ou de um portal, uma rotina agendada ("todo dia 1º, buscar XMLs"). A entrada não processa; ela só **registra** a tarefa e coloca na fila.
2. **Fila**: a lista de tarefas pendentes, com prioridade e ordem. Pode ser uma tabela no banco (suficiente para dezenas de tarefas por minuto), Redis com RQ/Celery, RabbitMQ ou SQS. O n8n em modo *queue* usa Redis.
3. **Workers**: processos que pegam uma tarefa da fila, executam **uma etapa** e devolvem o resultado. Vários workers em paralelo absorvem picos; cada etapa pode ter seu próprio worker (classificar, extrair, validar, lançar).
4. **Banco de execuções**: a tabela que diz, para cada tarefa, em que etapa está, com que status, quantas tentativas, qual erro, quando começou e terminou. É a memória da esteira e a fonte do painel.
5. **Armazenamento de arquivos**: os documentos originais, os dados extraídos e os arquivos gerados (lançamentos, guias), em pastas organizadas por cliente e competência ou em um serviço de objetos (S3, Google Cloud Storage). O banco guarda o caminho, não o arquivo.
6. **Painel**: uma tela (planilha conectada, Metabase, Grafana, página simples) mostrando fila, falhas, tarefas por cliente e tempo médio. Sem painel, ninguém sabe que a esteira parou.

## Estados de uma tarefa

Cada tarefa percorre uma pequena máquina de estados. O conjunto mínimo:

| Estado | Significado | Próximos estados |
|---|---|---|
| `pendente` | Na fila, aguardando worker | `processando` |
| `processando` | Um worker pegou | `concluida`, `pendente` (nova tentativa), `falha`, `aguardando_humano` |
| `aguardando_humano` | Precisa de revisão ou aprovação | `pendente` (após decisão) ou `cancelada` |
| `concluida` | Etapa feita com sucesso | Próxima etapa ou fim |
| `falha` | Esgotou tentativas | Reprocessamento manual |

Transições fora dessa tabela são bugs. Com os estados explícitos, "reprocessar as que falharam" vira uma consulta ao banco, e "o que está parado há mais de uma hora" também.

```python
from datetime import datetime, timezone

class Fila:
    def __init__(self, max_tentativas=3):
        self.tarefas = {}
        self.max_tentativas = max_tentativas
        self._seq = 0

    def adicionar(self, nome, dados=None):
        self._seq += 1
        self.tarefas[self._seq] = {"id": self._seq, "nome": nome, "dados": dados or {},
                                   "status": "pendente", "tentativas": 0, "erro": None}
        return self._seq

    def proxima(self):
        for t in self.tarefas.values():
            if t["status"] == "pendente":
                t["status"] = "processando"
                t["tentativas"] += 1
                return t
        return None

    def concluir(self, id_):
        self.tarefas[id_]["status"] = "concluida"

    def falhar(self, id_, erro):
        t = self.tarefas[id_]
        t["erro"] = erro
        t["status"] = "pendente" if t["tentativas"] < self.max_tentativas else "falha"

    def resumo(self):
        contagem = {}
        for t in self.tarefas.values():
            contagem[t["status"]] = contagem.get(t["status"], 0) + 1
        return contagem

fila = Fila(max_tentativas=2)
a = fila.adicionar("classificar", {"arquivo": "nf1.xml"})
b = fila.adicionar("classificar", {"arquivo": "nf2.xml"})
t = fila.proxima(); fila.concluir(t["id"])
t = fila.proxima(); fila.falhar(t["id"], "timeout na API")
print(fila.resumo())
t = fila.proxima(); fila.falhar(t["id"], "timeout na API")
print(fila.resumo(), fila.tarefas[b]["tentativas"])
# {'concluida': 1, 'pendente': 1}
# {'concluida': 1, 'falha': 1} 2
```

Em produção, `self.tarefas` é uma tabela (SQLite serve para começar; Postgres quando há vários workers), e `proxima()` precisa marcar a tarefa de forma atômica para que dois workers não peguem a mesma. Em SQL, o jeito simples é um **UPDATE condicional**: `UPDATE tarefas SET status = 'processando' WHERE id = ? AND status = 'pendente'`, conferindo que exatamente uma linha foi alterada (se foi zero, outro worker chegou antes). No Postgres, com vários workers, usa-se `SELECT ... FOR UPDATE SKIP LOCKED`, que entrega a cada worker uma tarefa diferente sem bloquear os demais.

## A esteira do fechamento mensal

Aplicando as peças ao processo central do escritório:

- **Entradas**: e-mails na caixa de documentos, pasta do Drive por cliente, webhook do WhatsApp, download dos XMLs pelo web service da SEFAZ no dia 1º, OFX enviados por formulário.
- **Etapas (cada uma um worker)**: `receber` (registra e guarda o arquivo) → `classificar` (NF-e, NFS-e, extrato, recibo, outro; IA do módulo 4) → `extrair` (XML por `xml.etree`, PDF por OCR + IA) → `validar` (chave, destinatário, duplicidade, competência) → `lancar` (gera arquivo de importação ou chama o sistema) → `conciliar` (cruza extrato com lançamentos) → `guias` (gera e confere) → `enviar` (com aprovação).
- **Humano no loop**: `validar` manda para `aguardando_humano` o que não bate; `enviar` sempre espera aprovação.
- **Banco de execuções**: uma linha por documento por etapa, com cliente e competência.
- **Painel**: por cliente, quantos documentos em cada etapa, pendências humanas e previsão de conclusão do fechamento.

Com isso, "como está o fechamento da Padaria Sol?" é uma consulta: 42 documentos, 40 lançados, 2 aguardando revisão.

## Decisões de dimensionamento

- Até algumas centenas de tarefas por dia: fila em tabela SQLite/Postgres, dois ou três workers em um servidor pequeno. Não comece com Kafka.
- Etapas que chamam IA ou OCR são as lentas e caras: limite de concorrência por etapa para respeitar as cotas da API.
- Tarefas com **chave de idempotência** (hash do arquivo + etapa) para reprocessar sem duplicar.
- Retenção: arquivos originais por cinco anos (prazo fiscal comum); logs detalhados por 12 meses.

## Armadilhas

- **Entrada que processa**: o webhook que faz tudo na hora trava e perde eventos. Entrada só enfileira.
- **Estado na cabeça do script**: sem banco de execuções, reprocessar é começar do zero.
- **Dois workers na mesma tarefa**: marcação não atômica duplica lançamentos.
- **Arquivos dentro do banco**: fica lento e enorme; guarde o caminho.
- **Sem painel**: a esteira para numa sexta e ninguém vê até terça.

## Na prática

Um escritório trocou um script de 2.000 linhas, que rodava na madrugada e "às vezes não terminava", por uma esteira com fila em Postgres, quatro workers (um por etapa pesada), armazenamento em pastas por cliente/competência e um painel no Metabase. O primeiro ganho não foi velocidade, foi visibilidade: descobriram que 8% dos documentos paravam na extração por PDFs de má qualidade, algo que o script antigo engolia em silêncio. Depois vieram paralelismo e reprocessamento seletivo.

## Resumo

- Uma esteira separa entradas, fila, workers, banco de execuções, armazenamento de arquivos e painel; cada peça faz uma coisa.
- Toda tarefa tem estado explícito (pendente, processando, aguardando_humano, concluida, falha) e contagem de tentativas.
- A esteira do fechamento mensal encadeia receber, classificar, extrair, validar, lançar, conciliar, guias e enviar, com humano nos pontos críticos.
- Comece pequeno: fila em tabela, poucos workers, idempotência por documento; cresça quando o volume exigir.
- Visibilidade primeiro: o painel mostra o que o script escondia.
