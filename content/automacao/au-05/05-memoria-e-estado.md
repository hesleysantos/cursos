# Memória e estado

Nesta lição você vai entender como um agente "lembra": a diferença entre o contexto curto da conversa e a memória de longo prazo, como resumir e truncar o histórico quando ele cresce, onde guardar informações (banco relacional, banco vetorial, arquivos) e como manter o **estado** de uma tarefa longa para retomá-la depois de uma pausa. Ao final, você vai escrever uma função que resume e corta o histórico por limite de tamanho, algo que todo agente de produção precisa.

## Contexto curto: a janela do modelo

Um modelo de linguagem não tem memória entre chamadas. Tudo o que ele "sabe" sobre a conversa é o que você envia em `messages`. Essa é a **janela de contexto**, medida em tokens (pedaços de palavra; em português, uma palavra costuma valer entre 1,5 e 2 tokens, variando com o tokenizador de cada modelo). Os modelos atuais aceitam centenas de milhares de tokens, mas isso não significa que você deva usar tudo:

- **Custo**: você paga por token enviado, a cada chamada. Um histórico de 50 mil tokens reenviado 20 vezes numa tarefa custa um milhão de tokens.
- **Qualidade**: instruções importantes no meio de um histórico enorme são seguidas pior. Contexto limpo gera respostas melhores.
- **Latência**: mais tokens, mais tempo de resposta.

Por isso, agentes gerenciam o histórico ativamente: resumem o que passou, descartam resultados de ferramentas que já não importam e mantêm só o essencial.

## Três camadas de memória

| Camada | O que guarda | Onde | Duração |
|---|---|---|---|
| **Contexto** | A conversa atual e os resultados recentes de ferramentas | Na lista `messages` | Uma tarefa |
| **Memória de trabalho** | Estado da tarefa: etapa atual, dados coletados, pendências | Dicionário/JSON salvo em banco ou arquivo | Dias (até terminar) |
| **Memória de longo prazo** | Fatos sobre clientes, preferências, decisões passadas | Banco relacional, banco vetorial, arquivos de notas | Meses ou anos |

A memória de longo prazo é consultada **sob demanda**: antes de responder, o agente busca o que é relevante (por chave, como o CNPJ, ou por similaridade, com embeddings e RAG, que você viu no módulo 4) e injeta no contexto. Guardar tudo no prompt não escala; buscar o que importa, sim.

## Resumir e truncar o histórico

A técnica mais usada quando o contexto cresce: manter as últimas N mensagens intactas e substituir as anteriores por um **resumo** gerado pelo próprio modelo ("até aqui: cliente Padaria Sol, competência 09/2026, DAS pago, falta extrato"). Alguns provedores oferecem isso no servidor (compactação automática), mas entender a mecânica permite controlar o que é preservado.

Sem um contador de tokens exato, dá para aproximar pelo número de palavras. A função abaixo mantém o sistema, resume o bloco antigo e preserva as mensagens recentes dentro de um limite:

```python
def contar_palavras(msg):
    return len(str(msg.get("content", "")).split())

def resumir_bloco(mensagens):
    """Resumo simples e deterministico (na vida real, uma chamada ao modelo)."""
    inicios = [" ".join(str(m["content"]).split()[:3]) for m in mensagens]
    return "Resumo do inicio: " + "; ".join(i for i in inicios if i) + "."

def compactar_historico(historico, limite_palavras, manter_recentes=4):
    total = sum(contar_palavras(m) for m in historico)
    if total <= limite_palavras:
        return historico
    sistema = [m for m in historico if m["role"] == "system"]
    resto = [m for m in historico if m["role"] != "system"]
    recentes = resto[-manter_recentes:]
    antigas = resto[:-manter_recentes]
    if not antigas:
        return sistema + recentes
    resumo = {"role": "user", "content": resumir_bloco(antigas)}
    novo = sistema + [resumo] + recentes
    # se ainda estourar, corta as recentes mais antigas uma a uma
    while sum(contar_palavras(m) for m in novo) > limite_palavras and len(novo) > len(sistema) + 2:
        novo.pop(len(sistema) + 1)
    return novo

hist = [
    {"role": "system", "content": "Voce e o assistente do escritorio."},
    {"role": "user", "content": "Quero saber do DAS da Padaria Sol. Competencia setembro."},
    {"role": "assistant", "content": "Consultando a planilha de obrigacoes. Um momento."},
    {"role": "user", "content": "Tambem veja se o extrato chegou. E urgente."},
    {"role": "assistant", "content": "DAS pago em 20/10. Extrato ainda nao recebido."},
    {"role": "user", "content": "Entao cobra o cliente por e-mail."},
    {"role": "assistant", "content": "Preciso de aprovacao para enviar e-mail."},
]
compacto = compactar_historico(hist, limite_palavras=45, manter_recentes=3)
for m in compacto:
    print(m["role"], "|", m["content"])
```

Saída:

```
system | Voce e o assistente do escritorio.
user | Resumo do inicio: Quero saber do; Consultando a planilha; Tambem veja se.
assistant | DAS pago em 20/10. Extrato ainda nao recebido.
user | Entao cobra o cliente por e-mail.
assistant | Preciso de aprovacao para enviar e-mail.
```

Repare nas decisões embutidas: a mensagem de sistema nunca é cortada; o resumo entra como mensagem de usuário (para manter a alternância que as APIs exigem); as mensagens mais recentes são preservadas porque é nelas que está o pedido atual.

## Estado de uma tarefa longa

Tarefas como "fechar o mês do cliente X" têm dezenas de passos, esperas por documentos e aprovações que levam horas. O agente não pode ficar "rodando" o tempo todo. A solução é um **estado serializável**: um dicionário com tudo o que é preciso para retomar, salvo a cada passo.

```python
import json
from datetime import datetime, timezone

estado = {
    "tarefa_id": "fech-2026-09-padaria",
    "etapa": "aguardando_extrato",
    "coletado": {"das": "pago", "nfs": 42},
    "pendente": ["extrato_banco"],
    "aprovacoes": [],
    "atualizado_em": datetime.now(timezone.utc).isoformat(),
}
json.dump(estado, open("/tmp/estado.json", "w"))
retomado = json.load(open("/tmp/estado.json"))
print(retomado["etapa"], retomado["pendente"])
# aguardando_extrato ['extrato_banco']
```

Quando o extrato chega (um webhook, um e-mail), o sistema carrega o estado, monta um contexto enxuto ("estávamos na etapa X, falta Y") e continua. É o que o LangGraph chama de **checkpoint** e que agentes gerenciados fazem com sessões persistentes. Em produção, o estado vai para um banco (SQLite, Postgres), não para `/tmp`.

## Onde guardar a memória longa

- **Banco relacional** (SQLite, Postgres): fatos estruturados: CNPJ, regime, responsável, datas. Busca por chave.
- **Banco vetorial** (pgvector, Chroma, Qdrant) ou índice de embeddings: textos livres: atas de reunião, e-mails, políticas. Busca por significado (RAG).
- **Arquivos de notas** (Markdown por cliente): simples, auditável, fácil de editar à mão. Vários SDKs de agentes oferecem uma "ferramenta de memória" que lê e escreve nesses arquivos.

A regra: estruturado vai para tabela; texto vai para índice; e **o agente só grava na memória longa o que você autorizar** (por exemplo, "preferências do cliente", mas nunca senhas ou dados sensíveis sem necessidade).

## Armadilhas

- **Enviar o histórico inteiro sempre**: custo e qualidade pioram sem você perceber.
- **Resumir cedo demais** e perder o pedido original: mantenha a primeira mensagem do usuário ou garanta que o resumo a preserve.
- **Estado só na memória RAM**: o processo reinicia e a tarefa some. Salve a cada passo.
- **Memória longa sem limpeza**: fatos desatualizados ("o cliente é MEI") contaminam respostas por anos. Registre data e fonte de cada fato.
- **Contar tokens por palavras em produção**: é aproximação para estudo; use o contador de tokens do provedor quando precisar de precisão.

## Na prática

O assistente de atendimento de um escritório guardava toda a conversa de cada cliente e reenviava tudo a cada mensagem. Em três meses o custo por resposta triplicou e as respostas ficaram imprecisas. A correção: compactar o histórico acima de um limite, salvar o estado de cada pedido em SQLite e manter um arquivo de notas por cliente com fatos estáveis (regime, dia de pagamento, contato preferido), consultado no início de cada conversa. O custo voltou ao patamar inicial e as respostas melhoraram, porque o contexto passou a ter só o que importava.

## Resumo

- O modelo não lembra nada entre chamadas; tudo está na janela de contexto, que custa dinheiro e qualidade quando cresce.
- Três camadas: contexto (conversa), memória de trabalho (estado da tarefa) e memória longa (fatos, consultados sob demanda).
- Compactar histórico: preservar sistema e mensagens recentes, resumir as antigas, respeitar um limite.
- Tarefas longas exigem estado serializável salvo a cada passo, para pausar e retomar.
- Estruturado em tabela, texto em índice vetorial ou notas; grave na memória longa só o autorizado e com data.
