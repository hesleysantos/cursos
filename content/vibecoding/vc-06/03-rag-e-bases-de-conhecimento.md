Nesta lição você vai entender por que um modelo de linguagem precisa de **contexto** para responder sobre os seus documentos, o que é **RAG** (geração aumentada por recuperação), as noções de **embeddings**, **busca semântica** e **chunking**, as ferramentas prontas que fazem isso por você e, principalmente, quando RAG resolve o problema e quando não. Isso importa porque "coloque a IA para ler todos os nossos documentos" é o pedido mais comum em escritórios — e o que decide o sucesso é saber o que acontece por baixo.

## Por que o modelo precisa de contexto

Um modelo de linguagem foi treinado com textos públicos até uma certa data. Ele não leu o manual do seu escritório nem conhece os contratos dos seus clientes. Quando você pergunta algo que ele não sabe, ele admite ou inventa — e, sem instrução, muitas vezes inventa.

A solução é colocar a informação **na conversa**, na **janela de contexto**: o espaço de texto que o modelo enxerga a cada resposta. Se o manual inteiro couber na janela, basta anexá-lo (foi o que você fez com o assistente de normas). O problema aparece quando os documentos somam milhares de páginas: não cabem e, mesmo quando cabem, custam caro e confundem o modelo com material irrelevante.

## RAG: buscar antes de responder

**RAG** (Retrieval-Augmented Generation) é a técnica que resolve isso em três passos:

1. **Recuperar**: dada a pergunta, buscar nos documentos os trechos mais relevantes.
2. **Aumentar**: montar o prompt com a pergunta e esses trechos.
3. **Gerar**: o modelo responde com base no que recebeu, citando os trechos.

Em vez de "ler tudo", o modelo lê só o que importa para aquela pergunta — como um bom estagiário, que não decora a biblioteca, mas sabe achar a página certa.

A pergunta central vira: **como encontrar os trechos certos?** Busca por palavra exata falha: quem pergunta "prazo da folha" não acha o parágrafo "fechamento dos salários até o dia 25". É aqui que entram os embeddings.

## Embeddings e busca semântica

Um **embedding** é uma representação numérica de um texto: uma lista de centenas ou milhares de números (gerada por um modelo treinado para isso) que captura o **significado**. Textos com sentido parecido têm listas parecidas, mesmo com palavras diferentes. "Prazo da folha" e "fechamento dos salários" ficam próximos; "prazo da folha" e "receita de bolo" ficam longe.

A **busca semântica** usa isso: converte a pergunta em embedding, compara com os embeddings de todos os trechos e devolve os mais próximos. Por isso o RAG acha o parágrafo certo mesmo quando as palavras não batem.

Você não calcula embeddings à mão; um modelo de embeddings dos provedores de IA faz isso. A noção serve para entender as falhas: dois trechos parecidos (a tabela de INSS de 2025 e a de 2026) ficam próximos, e a busca pode trazer o errado.

## Chunking: cortar os documentos em pedaços

Os documentos são divididos em **chunks** (pedaços) antes de gerar os embeddings, porque o embedding de um documento de 80 páginas é uma média sem sentido. O tamanho do pedaço é uma escolha:

- **Pedaços pequenos** (um parágrafo): busca precisa, mas o trecho pode vir sem contexto ("conforme o item anterior").
- **Pedaços grandes** (uma seção): mais contexto, menos precisão, mais custo por pergunta.

Boas práticas que funcionam na maioria dos casos: cortar respeitando títulos e parágrafos (não no meio de uma frase), manter uma pequena **sobreposição** entre pedaços vizinhos, e guardar com cada pedaço o **título do documento, a seção e a data**. Esse último detalhe é o que permite ao modelo citar a fonte e ao usuário desconfiar de uma tabela de 2025.

## Ferramentas prontas

Você raramente vai implementar RAG do zero. Em ordem crescente de esforço:

- **NotebookLM** (Google): você sobe documentos e conversa com eles, com citações; bom para pesquisa pessoal sobre um conjunto fechado de fontes.
- **Projects / Custom GPTs / Gems**: os arquivos anexados passam por recuperação interna; adequados para bases pequenas e médias.
- **Ferramentas de busca em documentos de empresa**, de diversos fornecedores, com conectores a Drive, e-mail e sistemas.
- **Bases vetoriais**: bancos especializados em guardar e comparar embeddings (o PostgreSQL tem uma extensão para isso, disponível no Supabase). É o caminho quando você constrói o seu app com RAG; a IA gera o pipeline (extrair texto, cortar, gerar embeddings, guardar, buscar) a partir de um PRD claro.

Nomes, limites e planos mudam; consulte a documentação atual.

## Quando RAG resolve e quando não

**Resolve bem:**

- Perguntas cuja resposta **está escrita** em algum documento: "qual o prazo de X?", "o que diz o contrato sobre reajuste?".
- Bases grandes demais para a janela de contexto.
- Situações em que a **citação da fonte** é obrigatória.

**Não resolve (ou resolve mal):**

- Perguntas que exigem **cálculo ou agregação** sobre muitos registros: "qual o total de honorários em aberto?" é pergunta para o banco de dados, não para busca em texto. Use function calling com uma consulta SQL.
- **Raciocínio sobre o documento inteiro**: "resuma as tendências dos últimos 50 contratos" precisa ler os 50, não os 5 trechos mais parecidos.
- **Informação que não está em lugar nenhum**: RAG não inventa menos; ele só inventa com citação, se as fontes forem ruins.
- **Dados que mudam a cada minuto**: cotações, saldos — chame a API.

A regra prática: se a resposta é um **trecho**, use RAG; se é um **número calculado**, use banco; se é **síntese de tudo**, mande tudo (ou resuma em etapas).

## Erros comuns

- Subir PDFs escaneados sem OCR e concluir que "RAG não funciona".
- Misturar versões antigas e novas na mesma base.
- Esperar que RAG some valores de uma tabela.
- Pedaços cortados no meio de tabelas, perdendo o cabeçalho.
- Não guardar fonte e data junto do pedaço, impossibilitando a citação.

## Na prática

O escritório tem 400 contratos em PDF. Com RAG, a pergunta "quais contratos têm cláusula de reajuste pelo IPCA?" devolve os trechos certos, com nome do arquivo. Já "qual a soma dos honorários mensais dos contratos ativos?" é respondida pelo Gestão de Honorários, com SQL. Saber qual ferramenta responde a qual pergunta é a competência desta lição.

## Resumo

- O modelo não conhece seus documentos; o contexto precisa entrar na conversa, e a janela tem limite.
- RAG recupera os trechos relevantes, monta o prompt e gera a resposta com citação.
- Embeddings representam significado; busca semântica acha o trecho mesmo com palavras diferentes.
- Chunking: cortar por parágrafos/seções, com sobreposição, guardando fonte, seção e data.
- RAG para trechos; banco para números; leitura completa para síntese; API para dados vivos.
