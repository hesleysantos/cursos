Nesta lição você vai aprender a diferença entre inteligência artificial, machine learning e IA generativa, vai conhecer a história curta que nos trouxe até 2026 e vai entender, de forma honesta, o que essas ferramentas fazem bem e o que ainda fazem mal. Isso importa porque quem não entende a diferença acaba usando a ferramenta errada para a tarefa errada — e, pior, confia onde não deveria.

## Três termos que todo mundo mistura

**Inteligência artificial (IA)** é o nome do campo inteiro: qualquer programa que executa uma tarefa que, feita por uma pessoa, exigiria alguma inteligência. Um programa antigo que decide, por regras escritas à mão por um especialista, se um lançamento parece suspeito já é, tecnicamente, uma forma primitiva de IA (os chamados "sistemas especialistas"). O termo existe desde 1956.

**Machine learning (aprendizado de máquina)** é uma parte da IA. Em vez de um programador escrever todas as regras à mão, o programa **aprende padrões a partir de exemplos**. O filtro de spam do seu e-mail não tem uma regra "se contém a palavra prêmio, é spam"; ele viu milhões de e-mails marcados e aprendeu sozinho o que diferencia um do outro. O antifraude do seu cartão e a sugestão de conta para lançamentos recorrentes em alguns sistemas contábeis funcionam assim.

**IA generativa** é uma parte do machine learning que, em vez de só classificar ou prever, **cria conteúdo novo**: texto, imagem, áudio, vídeo e código. Os **modelos de linguagem** (LLMs, de *large language models*) são a parte da IA generativa que lida com texto — e são o assunto principal deste curso. ChatGPT, Claude e Gemini são produtos construídos em cima de modelos de linguagem.

> **Dica:** pense em bonecas russas. IA é a boneca grande; machine learning é a do meio; IA generativa é a de dentro; e os modelos de linguagem são a menorzinha, aquela com que você conversa.

## Uma história curta (até 2026)

- **1950–1956**: Alan Turing propõe a pergunta "máquinas podem pensar?" e o termo "inteligência artificial" nasce numa conferência em Dartmouth.
- **Décadas de 1970 a 1990**: sistemas baseados em regras escritas à mão (os "sistemas especialistas") têm sucesso limitado; promessas exageradas geram os "invernos da IA". Em 1997, o Deep Blue vence o campeão de xadrez Garry Kasparov.
- **2012**: redes neurais profundas (*deep learning*) passam a vencer competições de reconhecimento de imagens com folga. Aprender a partir de dados vira o caminho dominante.
- **2017**: pesquisadores do Google publicam a arquitetura **Transformer**, base de praticamente todos os modelos de linguagem atuais.
- **2018–2022**: a OpenAI lança a série GPT; cada versão é treinada com muito mais texto e fica surpreendentemente mais capaz. Em novembro de 2022, o **ChatGPT** coloca um modelo de linguagem numa interface de bate-papo e atinge 100 milhões de usuários em cerca de dois meses.
- **2023–2024**: chegam Claude (Anthropic), Gemini (Google), Llama (Meta, com "pesos abertos": um modelo que qualquer um pode baixar e rodar, como você verá na lição 4) e Copilot (Microsoft). Os modelos passam a ler imagens, ouvir áudio e aceitar documentos inteiros. Surgem os modelos "de raciocínio", que pensam por etapas antes de responder.
- **2025–2026**: a IA entra no Office, no Google Workspace, nos navegadores e nos sistemas de gestão. Crescem os **agentes**, modelos que executam tarefas de várias etapas usando ferramentas (abrir arquivos, rodar código, navegar em sites). O termo **vibe coding** — descrever um programa em linguagem natural e deixar a IA escrever o código — vira comum. É nesse mundo que você está entrando.

## O que mudou com os modelos de linguagem

Até poucos anos atrás, cada tarefa de IA exigia, na prática, um modelo treinado só para ela, por uma equipe técnica, com dados preparados. O que mudou é que **um único modelo geral passou a executar milhares de tarefas diferentes a partir de uma instrução em português**. A interface virou a conversa. Pela primeira vez, uma pessoa sem formação técnica consegue "programar" o comportamento de um sistema só descrevendo o que quer. Essa é a mudança que justifica este curso.

Um exemplo simples:

```text
Prompt:
Explique em até 5 linhas, para um cliente leigo, o que é o Simples Nacional
e por que ele pode ser vantajoso para uma pequena empresa de serviços.

Resposta esperada (resumo):
Um texto curto, em linguagem acessível, dizendo que o Simples unifica vários
tributos numa guia única, com alíquotas que variam por faixa de faturamento
e por anexo, e que costuma reduzir burocracia — com a ressalva de que a
vantagem depende do caso e de uma simulação.
```

Ninguém precisou "ensinar" o modelo sobre Simples Nacional nessa hora: ele já viu muito texto sobre o assunto no treinamento. Repare também na ressalva final — um bom modelo evita afirmações absolutas, e você deve exigir isso dele.

## O que a IA faz bem hoje

- **Transformar texto**: resumir, reescrever em outro tom, traduzir, corrigir, organizar em tópicos.
- **Explicar**: destrinchar um conceito, uma norma ou uma mensagem de erro em linguagem simples.
- **Rascunhar**: e-mails, propostas, checklists, modelos de contrato (para revisão humana).
- **Estruturar**: tirar dados de um texto bagunçado e colocar em tabela.
- **Gerar código e fórmulas**: Excel, Python, consultas a banco de dados — tema dos próximos módulos.
- **Brainstorm**: listar possibilidades que você não tinha pensado.

## O que a IA ainda faz mal

- **Fatos específicos sem fonte**: números de uma lei, prazos, alíquotas de um município, nomes e datas. Ela pode responder com total confiança e estar errada.
- **Contas longas feitas "de cabeça"**: somar 40 linhas de um balancete sem usar uma ferramenta de cálculo é pedir erro. Quando a ferramenta oferece um modo de executar código ou planilha, use-o.
- **Saber quando não sabe**: o modelo raramente diz "não tenho essa informação" espontaneamente.
- **Consistência**: a mesma pergunta pode receber respostas diferentes em dias diferentes.
- **Informação recente**: tudo que aconteceu depois da data de corte do treinamento ele desconhece, a menos que consulte a internet.
- **Julgamento profissional e responsabilidade**: ela não assina balanço, não responde ao CRC e não conhece o seu cliente.

## Erros comuns de quem está começando

1. **Tratar o chat como um buscador.** Um buscador devolve páginas que existem; o modelo devolve texto que ele gerou.
2. **Achar que ele "entende" como uma pessoa.** Ele produz texto plausível com base em padrões — poderoso, mas não é compreensão humana.
3. **Desistir no primeiro erro.** Uma resposta ruim quase sempre vem de um pedido ruim ou de uma tarefa inadequada.
4. **Delegar o que não pode conferir.** Se você não consegue verificar a resposta, não a use em algo que importa.

## Na prática

No escritório contábil, as três camadas convivem. O banco usa machine learning para detectar fraude; o sistema contábil sugere a conta de um lançamento recorrente; e você usa um modelo de linguagem para transformar uma norma de 30 páginas num resumo de uma página, redigir o e-mail ao cliente e montar o checklist do fechamento. O resumo e o e-mail saem em minutos; a conferência da norma continua sendo sua.

## Resumo

- IA é o campo; machine learning aprende com exemplos; IA generativa cria conteúdo novo; modelos de linguagem são a parte que lida com texto.
- A grande virada foi 2017 (Transformer) e 2022 (ChatGPT): um modelo geral, comandado em linguagem natural.
- Ela faz muito bem transformar, explicar, rascunhar e estruturar texto.
- Ela faz mal fatos específicos sem fonte, contas longas, saber quando não sabe e informação recente.
- Use IA para acelerar o que você sabe conferir; nunca para substituir o julgamento pelo qual você responde.
