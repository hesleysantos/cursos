# Projeto final: esteira de fechamento mensal

Este é o projeto que fecha o curso. Você vai especificar, de ponta a ponta, a **esteira de fechamento mensal** de um escritório contábil: coleta de documentos por e-mail, WhatsApp e portal; classificação com IA; extração e validação; lançamento por importação no sistema contábil; conciliação bancária; guias e envio aos clientes com aprovação; painel. A entrega é uma especificação completa, com arquitetura, sprints, riscos e rubrica. O código central é a **validação final do lote** antes de gerar o arquivo de importação, o ponto em que um erro vira centenas de lançamentos errados.

## Especificação

**Objetivo**: reduzir o prazo do fechamento de 12 para 6 dias úteis e o tempo de equipe em 50%, sem aumentar erros, para 40 clientes do Simples Nacional e do Lucro Presumido.

**Escopo**: documentos de entrada e saída (NF-e, NFS-e, cupons via XML), extratos (OFX), recibos e comprovantes em PDF/imagem, guias do mês (DAS, DARF, GPS, ISS). Fora do escopo na primeira versão: folha de pagamento, obrigações anuais, clientes do Lucro Real.

**Entradas**: caixa de e-mail de documentos; número de WhatsApp do escritório (API oficial); pasta por cliente no Drive; download dos XMLs pelo web service da SEFAZ com o certificado A1 de cada cliente, autorizado em contrato e guardado em cofre; formulário para OFX.

**Saídas**: arquivos de importação no layout do sistema contábil; relatório de conciliação por cliente; guias geradas e conferidas; mensagem ao cliente com guias e pendências (após aprovação); painel.

**Regras de negócio** (exemplos; a lista completa é parte da entrega): competência pela data de emissão; nota cancelada não entra; nota com destinatário diferente do cliente vai para pendência; documento duplicado (mesma chave ou mesmo hash) é descartado com registro; divergência de valor entre extrato e lançamento acima de R$ 0,01 vira pendência; nenhuma guia é enviada sem conferência humana.

## Arquitetura

```
E-mail / WhatsApp / Drive / SEFAZ / Formulário
        |  (entradas só registram e enfileiram)
        v
   Fila (Postgres)  ->  Workers por etapa:
                        receber -> classificar (IA) -> extrair (XML / OCR+IA)
                        -> validar -> lancar (arquivo de importação)
                        -> conciliar (OFX x lançamentos) -> guias -> enviar (aprovação)
        |
   Banco de execuções (tarefa, etapa, status, tentativas, versão, custo)
   Armazenamento (cliente/competência/etapa/arquivo)
   Trilha de auditoria (escritas, decisões de IA, aprovações)
        |
   Painel (por cliente: documentos por etapa, pendências, previsão) + alertas
```

Decisões: fila em Postgres com marcação atômica; um worker por etapa pesada, com concorrência limitada pela cota da API; idempotência por hash do arquivo + etapa; estados da lição 4; logs e métricas da lição 5; segredos e política da lição 6; aprovação por Slack para o envio.

## Ferramentas e IA

Classificação com saída estruturada (tipo, cliente provável, competência, confiança); extração de XML com `xml.etree`; OCR + IA para PDFs e imagens, com confiança por campo; conciliação com regras determinísticas primeiro (`FITID`, `txid`, nosso número, valor e data) e IA só para sugerir pares incertos; mensagens ao cliente a partir de modelo fixo. **50 casos de teste** para classificação e extração, rodados por versão.

## Validação final do lote

Antes de gerar o arquivo de importação de um cliente, o lote inteiro passa por uma validação que recusa **tudo** se houver erro grave, e devolve a lista de problemas:

```python
import re

TIPOS = {"nfe", "nfse", "extrato", "recibo"}

def validar_lote(lote, competencia, cnpj_cliente):
    """lote: lista de dicts com chave, tipo, cnpj_cliente, competencia, valor, status.
    Devolve lista de erros (vazia = lote aprovado)."""
    erros = []
    if not re.fullmatch(r"\d{4}-(0[1-9]|1[0-2])", competencia):
        return ["competencia invalida: " + str(competencia)]
    vistos = set()
    for i, doc in enumerate(lote, 1):
        ref = f"doc {i} ({doc.get('chave', '?')})"
        if doc.get("tipo") not in TIPOS:
            erros.append(f"{ref}: tipo desconhecido")
        if doc.get("cnpj_cliente") != cnpj_cliente:
            erros.append(f"{ref}: cnpj diferente do cliente")
        if doc.get("competencia") != competencia:
            erros.append(f"{ref}: competencia diferente do lote")
        if not isinstance(doc.get("valor"), (int, float)) or doc["valor"] <= 0:
            erros.append(f"{ref}: valor invalido")
        if doc.get("status") == "cancelado":
            erros.append(f"{ref}: documento cancelado")
        chave = doc.get("chave")
        if chave in vistos:
            erros.append(f"{ref}: chave duplicada")
        vistos.add(chave)
    return erros

lote = [
    {"chave": "A1", "tipo": "nfe", "cnpj_cliente": "11222333000181", "competencia": "2026-09", "valor": 1200.0, "status": "autorizado"},
    {"chave": "A2", "tipo": "nfse", "cnpj_cliente": "11222333000181", "competencia": "2026-09", "valor": 500.0, "status": "cancelado"},
    {"chave": "A1", "tipo": "nfe", "cnpj_cliente": "99888777000166", "competencia": "2026-08", "valor": 0, "status": "autorizado"},
]
for e in validar_lote(lote, "2026-09", "11222333000181"):
    print(e)
```

Saída:

```
doc 2 (A2): documento cancelado
doc 3 (A1): cnpj diferente do cliente
doc 3 (A1): competencia diferente do lote
doc 3 (A1): valor invalido
doc 3 (A1): chave duplicada
```

Um lote com erro não gera arquivo: os documentos problemáticos vão para pendência humana, os demais seguem num novo lote. A validação é determinística e testada; a IA nunca decide sozinha o que entra no sistema contábil.

## Plano em sprints (duas semanas cada)

| Sprint | Entrega | Critério de pronto |
|---|---|---|
| 1 | Entradas + fila + armazenamento + banco de execuções; painel básico | Documentos de 3 clientes piloto entram e aparecem no painel |
| 2 | Classificação com IA + 50 casos de teste | Acerto ≥ 95% nos casos; baixa confiança vai para humano |
| 3 | Extração de XML e OCR + validação de lote | Zero duplicidade; pendências com motivo claro |
| 4 | Lançamento por importação + trilha de auditoria | Arquivo importado no sistema sem erro para os 3 pilotos |
| 5 | Conciliação OFX + relatório | 90% das linhas conciliadas automaticamente; resto com sugestão |
| 6 | Guias + envio com aprovação + alertas e runbooks | Fechamento dos pilotos em 6 dias úteis; política aplicada |
| 7 | Abertura gradual para 40 clientes, medição de ROI | Métricas da lição 7 coletadas; caso escrito |

Cada sprint termina com demonstração aos sócios e revisão dos riscos.

## Riscos e mitigação

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| Layout do sistema contábil muda | Média | Alto | Layout versionado; teste de importação por sprint |
| PDFs de baixa qualidade na extração | Alta | Médio | Confiança por campo; pendência humana; orientar clientes |
| Certificados A1 vencidos ou sem autorização do cliente | Média | Alto | Inventário e alerta de 30 dias; autorização no contrato |
| Custo de IA acima do previsto | Média | Médio | Limite diário; roteamento para modelo menor nos casos simples |
| Injeção de prompt em documentos | Baixa | Alto | Conteúdo como dado; sem ferramentas de escrita na classificação; detector |
| Equipe não confia na esteira | Alta no início | Alto | Modo de ensaio; revisão por amostragem; painel transparente |
| Vazamento de dados pessoais | Baixa | Muito alto | Minimização; contrato com provedor; cofre; trilha; plano de incidente |

## Rubrica de avaliação

Avalie a especificação de 0 a 3 em cada item; 21 ou mais em 27 é um projeto pronto para começar. A escala é a mesma para todos os itens: **0** ausente; **1** mencionado, mas sem detalhe que permita executar; **2** completo, com lacunas pequenas; **3** completo, específico e verificável (dá para testar ou conferir sem perguntar ao autor).

1. Objetivo mensurável com baseline.
2. Escopo e exclusões explícitos.
3. Arquitetura com as seis peças e estados de tarefa.
4. Regras de negócio escritas e testáveis.
5. Pontos de revisão humana definidos, incluindo os obrigatórios por lei.
6. Validação de lote determinística com testes.
7. Observabilidade: métricas, alertas e runbooks.
8. Governança: inventário, segredos, LGPD, contrato com provedor.
9. Plano em sprints com critérios de pronto, riscos e ROI previsto.

## Armadilhas

- **Começar pela IA** em vez de pelas entradas e pela fila: a IA é uma etapa; a esteira é o produto.
- **Lote sem validação**: um erro vira centenas de lançamentos.
- **Pular o modo de ensaio**: a equipe precisa confiar antes de depender.
- **Abrir para os 40 clientes de uma vez**.
- **Esquecer que o contador assina**: a esteira prepara; a responsabilidade técnica continua humana.

## Na prática

Um escritório de 40 clientes seguiu esse plano. Os três pilotos do sprint 1 revelaram que um deles mandava documentos por fotos de WhatsApp em baixa resolução; a extração por OCR ficou em 70% de confiança e o cliente foi orientado a enviar PDF, o que resolveu antes de a carteira inteira entrar. No sprint 4, o primeiro arquivo de importação falhou por uma conta inexistente no plano de contas: a validação de lote ganhou a regra "conta existe no plano" e o erro nunca se repetiu. No fim do sprint 7, o fechamento dos 40 clientes saía em 6 dias úteis, com 11% dos documentos passando por pendência humana e zero lançamentos duplicados em três meses.

## Resumo

- A esteira de fechamento encadeia coleta, classificação, extração, validação, lançamento, conciliação, guias e envio, sobre fila, workers, banco de execuções, armazenamento, auditoria e painel.
- A validação final do lote é determinística, recusa o lote inteiro em erro grave e manda os problemáticos para pendência.
- Sete sprints com critérios de pronto, pilotos antes da carteira, riscos com mitigação e ROI medido.
- IA classifica, extrai e sugere; regras validam; pessoas aprovam o que importa e assinam o que a lei exige.
- A rubrica de nove itens diz se o projeto está pronto para começar.
