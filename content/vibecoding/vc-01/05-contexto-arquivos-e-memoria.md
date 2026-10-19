Nesta lição você vai entender o que o modelo realmente "vê" quando responde — a chamada janela de contexto —, como anexar documentos e organizar conversas em projetos, o que acontece quando um arquivo é grande demais, quando vale dividir o trabalho e como funciona a memória entre conversas. Com isso, você deixa de ter respostas genéricas e para de perder tempo repetindo a mesma explicação toda vez.

## A janela de contexto: tudo que o modelo enxerga

Quando você envia uma mensagem, o modelo recebe **um único bloco de texto**: as instruções da ferramenta, as mensagens anteriores da conversa, os arquivos que você anexou e a sua pergunta. Esse bloco é a **janela de contexto**. O modelo não vê nada fora dela: nem outras conversas, nem o seu computador, nem o que você pensou mas não escreveu.

A janela tem um tamanho máximo, medido em tokens (lição 2). Os modelos atuais aceitam janelas grandes — centenas de páginas em muitos casos —, mas o limite varia muito entre modelos, planos e ferramentas, e é por isso que você deve consultar a documentação da sua ferramenta em vez de decorar um número.

Duas consequências práticas:

1. **Conversas longas "esquecem" o começo.** Quando o limite é atingido, as ferramentas costumam descartar ou resumir as mensagens mais antigas. Se uma conversa de 80 mensagens começa a ignorar uma instrução que você deu no início, é isso. Solução: repita a instrução ou comece uma conversa nova com um resumo.
2. **Mais contexto não é sempre melhor.** Mesmo dentro do limite, modelos tendem a prestar menos atenção ao que está "no meio" de um texto enorme. Um contexto enxuto e relevante gera respostas melhores que um despejo de arquivos.

> **Dica:** pense na janela de contexto como a mesa de trabalho do modelo. Tudo que está sobre a mesa ele vê; o que ficou na gaveta não existe para ele. E uma mesa entulhada atrapalha.

## Anexar documentos

Os assistentes aceitam anexos: PDF, Word, Excel, imagens, arquivos de texto e, em alguns, áudio. Ao anexar, a ferramenta extrai o texto do arquivo e coloca na janela de contexto. Dali em diante, o modelo pode citar, resumir e responder **com base no documento**, o que reduz muito a alucinação em relação a perguntar "de cabeça".

Alguns cuidados:

- **PDF escaneado** (imagem de papel) só funciona se a ferramenta fizer reconhecimento de texto (OCR). Se o modelo responder que "não há texto", é isso.
- **Planilhas** são lidas como tabelas de texto. Fórmulas, formatação e abas escondidas podem se perder. Para análise séria, prefira ferramentas que executam código sobre o arquivo (há assistentes que fazem isso) ou cole só o trecho relevante.
- **Imagens** de telas, notas fiscais e gráficos podem ser interpretadas pelos modelos multimodais (os que leem imagem, e não só texto); a leitura de números pequenos pode falhar, então confira.
- **Dê instruções sobre o anexo.** "Com base exclusivamente neste documento, responda…" é muito melhor do que anexar e perguntar genericamente.

```text
Prompt (com a IN anexada):
Com base exclusivamente no documento anexo, liste as obrigações acessórias
mencionadas, com o prazo de cada uma e o número do artigo em que aparecem.
Se alguma informação não estiver no documento, escreva "não consta".

Resposta esperada (resumo):
Uma tabela com três colunas (obrigação, prazo, artigo). Itens ausentes
aparecem como "não consta" em vez de serem inventados — exatamente o
comportamento que a instrução pediu.
```

## Projetos e espaços de trabalho

A maioria dos assistentes tem um recurso para isso: **Projects** no Claude e no ChatGPT agrupam conversas com instruções e arquivos fixos; no Gemini, os **Gems** cumprem papel parecido (um assistente personalizado com instruções e arquivos de referência); no Copilot, há os **Notebooks** e os agentes personalizados — os nomes e os detalhes variam, consulte a documentação da sua ferramenta. A ideia é a mesma: você cria um espaço, coloca nele **instruções permanentes** ("você é o assistente do escritório X; respondemos clientes de forma formal; use a legislação brasileira") e **arquivos de referência** (modelo de e-mail, manual interno, tabela de honorários). Toda conversa criada dentro do projeto já começa com tudo isso na janela de contexto.

Vale usar um projeto para cada tipo de trabalho recorrente: "Atendimento a clientes", "Departamento pessoal", "Estudos de legislação". No módulo 2 você vai construir um desses.

## Quando dividir

Divida o trabalho quando:

- O arquivo ultrapassa o limite da ferramenta (ela avisa).
- A tarefa tem etapas naturais: primeiro extrair, depois analisar, depois redigir. Uma conversa por etapa, com o resultado da anterior colado no início da seguinte.
- A resposta começa a vir genérica ou a ignorar instruções — sinal de contexto saturado.
- Você precisa de **rastreabilidade**: é mais fácil conferir um resumo de 10 páginas do que de 200.

Estratégia simples para um documento grande: peça um resumo por capítulo (uma conversa por capítulo ou um anexo por vez), depois junte os resumos numa conversa nova e peça a síntese final.

## Memória entre conversas

Por padrão, **cada conversa nova começa do zero**. O modelo não lembra o que você disse ontem. Algumas ferramentas oferecem um recurso de **memória**: a ferramenta guarda fatos sobre você ("trabalha num escritório contábil em Sergipe", "prefere respostas curtas") e os injeta automaticamente nas conversas futuras. Isso é conveniente, mas tem dois lados:

- Você precisa saber **o que está guardado** e poder apagar. Procure nas configurações da ferramenta a lista de memórias.
- Memória pode carregar informação que não deveria aparecer em outra conversa, como o nome de um cliente. Em contas corporativas, verifique se o recurso é permitido pela política do escritório.

Quando não há memória (ou você preferiu desligar), a solução é o **projeto** com instruções fixas ou um bloco de contexto que você mantém salvo e cola no início das conversas.

## Erros comuns

1. **Anexar dez arquivos e fazer uma pergunta vaga.** O modelo se perde. Anexe o necessário e diga o que fazer com ele.
2. **Continuar uma conversa gigante por semanas.** Comece conversas novas por tarefa; use o projeto para o que é permanente.
3. **Achar que ele leu o arquivo inteiro com atenção.** Para verificação, peça citação literal do trecho e confira na página.
4. **Confundir memória com aprendizado.** Memória é uma lista de notas que a ferramenta cola no contexto; o modelo em si não mudou.

## Na prática

No escritório, um fluxo comum: criar um projeto "Legislação" com instruções sobre tom e formato; para cada norma nova, abrir uma conversa dentro dele, anexar o PDF oficial, pedir resumo com artigos citados, conferir dois ou três pontos na fonte e salvar o resumo. Na semana seguinte, outra conversa, outro PDF. As instruções não precisam ser repetidas, e nenhuma conversa fica grande demais.

## Resumo

- A janela de contexto é tudo que o modelo vê: instruções, conversa, anexos e pergunta. Fora dela, nada existe.
- Conversas longas perdem o começo; contexto demais piora a atenção. Enxuto e relevante é melhor.
- Anexar o documento e pedir "com base exclusivamente nele" reduz alucinação; cuidado com PDF escaneado e planilhas.
- Projetos guardam instruções e arquivos permanentes; use um por tipo de trabalho.
- Memória entre conversas é opcional e precisa ser revisada; sem ela, use projetos ou um bloco de contexto salvo.
