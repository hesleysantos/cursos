Nesta lição você vai montar, em conceito e em prática, um **RAG** (*Retrieval-Augmented Generation*, geração aumentada por recuperação): um assistente que responde perguntas com base nos **seus** documentos, citando de onde tirou a resposta. Vai ver o pipeline completo (ingestão, divisão em pedaços, embeddings, busca, prompt com contexto), as ferramentas que o montam sem código (NotebookLM, n8n) e com código (LangChain, como conceito), os limites e como manter a base atualizada. O exemplo é um assistente de normas internas do escritório. Isso importa porque é a forma segura de usar IA sobre conteúdo próprio: o modelo não precisa "saber" das suas normas; ele as lê na hora de responder.

## Por que não perguntar direto ao modelo

Pergunte a um modelo "qual o prazo para entregar documentos no escritório Contábil Silva?" e ele não sabe, ou pior, inventa. O modelo foi treinado com texto público, não com o seu manual. Duas saídas: colar o manual inteiro em toda pergunta (caro e limitado pelo tamanho do contexto) ou **recuperar só os trechos relevantes** e colar esses. A segunda é o RAG.

## O pipeline

```
documentos -> ingestão -> chunks -> embeddings -> base vetorial
pergunta   -> embedding -> busca (top-k) -> prompt com contexto -> modelo -> resposta com fontes
```

**1. Ingestão.** Reúna os documentos (PDF, Word, páginas internas) e extraia o texto com as ferramentas do módulo 3. Guarde metadados: título, seção, página, data de versão.

**2. Chunks.** Divida o texto em pedaços de 300 a 800 palavras, com **sobreposição** de algumas linhas entre um e outro para não cortar uma frase no meio. Pedaço pequeno demais perde contexto; grande demais traz ruído e custa tokens. Dividir por seção (títulos) costuma ser melhor que por contagem cega.

**3. Embeddings e base.** Gere o embedding de cada chunk (lição 5) e guarde na base vetorial com os metadados.

**4. Busca.** Para cada pergunta, gere o embedding e recupere os `k` chunks mais parecidos (3 a 8). Filtre por metadados quando fizer sentido ("só a versão vigente").

**5. Prompt com contexto.** Monte a mensagem assim:

```
Você responde dúvidas sobre as normas internas do escritório.
Use SOMENTE os trechos abaixo. Se a resposta não estiver neles, diga
"não encontrei nas normas" e não invente. Ao final, cite a fonte de cada afirmação
no formato [título, seção].

Trechos:
[1] (Manual de Procedimentos, 3.2 Prazos) Os clientes devem enviar os documentos até o dia 5...
[2] (Política de Férias, 1.1) ...

Pergunta: até que dia o cliente deve enviar os documentos?
```

**6. Resposta com fontes.** O modelo responde "Até o dia 5 do mês seguinte [Manual de Procedimentos, 3.2]". A citação permite conferir em segundos e é o que separa um assistente confiável de um chute bem escrito.

## Ferramentas

- **NotebookLM** (Google): você sobe os documentos e pergunta, sem código, com citações automáticas. Excelente para testar se a ideia funciona com o seu material antes de construir qualquer coisa. Limitado a uso pela interface e às políticas da conta.
- **n8n**: nós de *Vector Store* (Chroma, Pinecone, Qdrant, Supabase, Postgres), *Embeddings*, *Document Loader* e *Text Splitter*, além de um nó de agente que faz a busca e responde. Dá para montar o pipeline inteiro arrastando nós, com gatilho de chat ou de e-mail.
- **LangChain / LlamaIndex** (Python): bibliotecas que oferecem os blocos (loaders, splitters, vector stores, cadeias). Valem quando você precisa de lógica personalizada; a API delas muda com frequência, então trate como conceito e consulte a documentação na hora de codar.
- **Projetos e arquivos nos assistentes**: subir documentos num projeto do Claude ou num GPT personalizado também é RAG, gerenciado pelo provedor.
- **Busca por arquivo dos provedores**: as APIs dos grandes provedores oferecem ferramentas de busca em arquivos enviados; é RAG sem montar base própria, com menos controle.

Para um escritório, a ordem razoável é: provar com NotebookLM, construir com n8n, ir para Python só se a regra ficar específica demais.

## Limites que você precisa conhecer

- **A busca pode não achar.** Se o chunk certo não entra no top-k, o modelo responde "não encontrei" (bom) ou improvisa (ruim). Teste com perguntas reais e ajuste k, tamanho do chunk e a forma de dividir.
- **O modelo ainda pode alucinar** mesmo com o trecho na frente, misturando dois chunks ou "completando" uma regra. A instrução de só usar os trechos e citar reduz, não elimina.
- **Documentos desatualizados respondem como se fossem atuais.** Se a norma mudou e a base não, o assistente erra com confiança.
- **Tabelas e imagens** se perdem na extração; normas em tabela (prazos por tipo de cliente) precisam de tratamento especial ou de conversão para texto.
- **Privacidade**: os chunks vão para o provedor na hora da pergunta. Normas internas costumam ser ok; dados de clientes exigem os cuidados da lição 8.

## Manter a base viva

RAG não é projeto, é processo. Defina: **quem** é dono de cada documento, **como** uma alteração dispara a reindexação (um robô que vigia a pasta de normas e reprocessa o arquivo alterado), **versão** nos metadados para filtrar só a vigente, e uma **lista de perguntas de teste** (20 a 50) com respostas esperadas, rodada a cada mudança da base ou do prompt (a mesma ideia da lição 3). Quando o assistente errar, a primeira pergunta é "o chunk certo foi recuperado?": se não, é problema de busca; se sim, é problema de prompt ou de modelo.

## Exemplo: assistente de normas do escritório

Material: manual de procedimentos (40 páginas), política de atendimento, tabela de prazos, FAQ interna. Pipeline no n8n: pasta no Drive → loader → splitter por seção com 500 palavras → embeddings → base vetorial com metadados `documento`, `secao`, `versao`. Gatilho: chat interno. Prompt: o da seção 5. Resultado após duas semanas de ajuste: 44 das 50 perguntas de teste corretas com citação; as 6 erradas eram sobre a tabela de prazos, resolvidas convertendo a tabela em frases ("Clientes do Simples: documentos até o dia 5"). Novos colaboradores passaram a tirar dúvidas ali antes de perguntar ao sócio.

## Erros comuns

- Chunks por contagem de caracteres cortando frases ao meio: divida por seção com sobreposição.
- Prompt sem a instrução "se não estiver nos trechos, diga que não encontrou".
- Base indexada uma vez e nunca mais: norma velha vira resposta errada.
- Medir pela sensação ("parece bom"): use a lista de perguntas de teste.

## Na prática

Num escritório contábil, o RAG aparece primeiro como o "manual que responde": o estagiário pergunta no chat interno "como protocolo um pedido de parcelamento?" e recebe o passo a passo com a citação [Manual de Procedimentos, 4.3], sem interromper o sócio. Depois, a mesma base cresce com as convenções coletivas dos clientes, o regulamento do ICMS do estado e as circulares internas, cada uma com `versao` nos metadados; quando a CCT nova chega, o responsável salva o PDF na pasta vigiada e a reindexação acontece sozinha. A regra de ouro continua: dados de clientes (folha, extratos, contratos) não entram na base sem os cuidados da lição 8, e toda resposta usada numa entrega é conferida na fonte citada.

## Resumo

- RAG recupera os trechos relevantes dos seus documentos e os entrega ao modelo junto com a pergunta.
- Pipeline: ingestão → chunks com sobreposição → embeddings → busca top-k → prompt com contexto → resposta citando fonte.
- Ferramentas: NotebookLM para provar, n8n para construir, LangChain/LlamaIndex como conceito para casos específicos.
- Limites: busca que não acha, alucinação residual, documentos desatualizados, tabelas, privacidade.
- Base viva: dono, reindexação automática, versão nos metadados e perguntas de teste.
