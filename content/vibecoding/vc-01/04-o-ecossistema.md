Nesta lição você vai conhecer o mapa das ferramentas de IA generativa em 2026: quem são os principais fornecedores, a diferença entre modelos fechados e abertos, o que muda entre usar um assistente de chat, uma API ou uma IA integrada ao sistema que você já usa, e como decidir entre planos gratuitos e pagos. O objetivo não é decorar nomes — eles mudam a cada poucos meses —, mas sair com **critérios** para escolher bem, hoje e daqui a um ano.

## Os principais fornecedores

Em 2026, a maior parte do uso profissional se concentra em poucos nomes. Cada fornecedor mantém uma **família** de modelos com versões e tamanhos diferentes, lançadas com frequência. Por isso, esta lição fala de famílias e de critérios, não de números de versão.

- **Claude (Anthropic)**: conhecido por respostas cuidadosas, bom desempenho com documentos longos e por escrever código; oferece o assistente de chat (no navegador, no computador e no celular), ferramentas para programadores e API.
- **ChatGPT (OpenAI)**: o mais conhecido do público; ecossistema amplo, com assistentes personalizados (os "GPTs"), geração de imagem, voz e busca integrada.
- **Gemini (Google)**: integrado ao Gmail, Docs, Sheets e Drive no Google Workspace; forte em tarefas que envolvem dados do próprio Google e em contextos muito longos.
- **Copilot (Microsoft)**: a camada de IA do Windows, do Microsoft 365 (Excel, Word, Outlook, Teams) e do Edge; interessante para quem vive nesses programas. Por baixo, usa modelos de parceiros (principalmente da OpenAI) e da própria Microsoft.
- **Llama (Meta) e outros modelos abertos**: modelos cujos "pesos" (os parâmetros treinados) são publicados para qualquer um baixar e rodar. Além do Llama, há famílias como Mistral, Qwen, DeepSeek e Gemma. São a base de muitos produtos de terceiros e de uso local.

## Modelos fechados, abertos e locais

**Modelo fechado** roda nos servidores do fornecedor; você usa pela interface ou pela API e nunca tem acesso aos parâmetros. Vantagens: melhor desempenho de ponta, zero manutenção. Desvantagem: seus dados saem do seu computador e você depende das políticas da empresa.

**Modelo aberto** tem os pesos publicados. Você (ou um fornecedor de nuvem) pode rodá-lo onde quiser. Vantagem: controle e privacidade; muitos são gratuitos para uso comercial, mas leia a licença de cada um. Desvantagem: o desempenho dos melhores modelos abertos costuma ficar um passo atrás dos melhores fechados, e alguém precisa cuidar da infraestrutura.

**Modelo local** é um modelo aberto rodando no seu próprio computador ou servidor. A ferramenta mais popular para isso é o **Ollama**, que baixa e executa modelos com um comando; também existem interfaces gráficas como o LM Studio. O ganho é total: nenhum dado sai da máquina. O preço é que um notebook comum só roda modelos pequenos, mais lentos e menos capazes. Para um escritório que precisa processar documentos sigilosos sem enviá-los a ninguém, essa é a opção a estudar.

## Três formas de usar: assistente, API e integração

**Assistente de chat** (ChatGPT, Claude, Gemini, Copilot no navegador ou no aplicativo). Você conversa, anexa arquivos, pede e recebe. É por onde se começa e onde a maioria das tarefas do dia a dia acontece.

**API** (interface de programação). Em vez de uma pessoa digitar, um programa envia o pedido e recebe a resposta. É assim que se automatiza: um script (um programa pequeno) que lê 300 e-mails e classifica cada um, uma planilha que chama o modelo para resumir um campo. Na API você paga por uso (por token enviado e recebido), escolhe o modelo e define parâmetros como a temperatura. Você vai mexer com isso nos módulos de automação.

**IA integrada** à ferramenta que você já usa: o Copilot dentro do Excel, o Gemini dentro do Gmail, o assistente dentro do sistema contábil ou do ERP (o sistema de gestão da empresa). Vantagem: zero troca de janela e acesso direto aos seus dados. Desvantagem: você usa o modelo que o fornecedor escolheu, com os limites que ele definiu.

```text
Prompt (num assistente de chat, para decidir a forma de uso):
Tenho um escritório contábil com 8 pessoas. Quero usar IA para
(1) resumir normas, (2) redigir e-mails e (3) classificar 2.000 lançamentos
bancários por mês. Para cada tarefa, diga se o melhor caminho é um assistente
de chat, uma API ou uma integração, e por quê.

Resposta esperada (resumo):
(1) e (2) cabem num assistente de chat; (3) é repetitivo e volumoso, então
pede automação via API ou um recurso de IA integrado ao sistema bancário ou
contábil. A resposta deve mencionar custo por volume e revisão humana.
```

## Gratuito ou pago?

Os planos mudam, então avalie pelos critérios, não pelo preço do mês:

- **Modelo disponível**: planos gratuitos costumam dar acesso a modelos menores ou a um número limitado de mensagens com o modelo principal. Para rascunhos simples, basta. Para análise de documentos longos e código, o modelo principal faz diferença.
- **Limites de uso**: quantidade de mensagens por período, tamanho de arquivos, uso de busca e geração de imagens.
- **Recursos de organização**: projetos ou espaços de trabalho, memória, assistentes personalizados, integração com arquivos.
- **Privacidade e dados**: planos pagos, especialmente os corporativos (Team, Enterprise, Business e nomes parecidos), costumam garantir contratualmente que seus dados não são usados para treinamento. Para dados de clientes, isso não é opcional (lição 6).
- **Administração**: contas corporativas permitem gerenciar usuários, cobrança única e políticas de uso.

Consulte sempre a página de planos e a política de uso de dados atual do fornecedor. Não decida com base numa captura de tela de seis meses atrás.

## Como escolher: um roteiro

1. **Comece pelo que já tem.** Se o escritório usa Microsoft 365, teste o Copilot; se usa Google Workspace, o Gemini. A integração vale muito.
2. **Teste os assistentes com as suas tarefas reais.** Pegue três tarefas típicas (resumir uma norma, revisar um e-mail, explicar um balancete) e rode nos candidatos. Compare qualidade, não marketing.
3. **Para dados sigilosos**, exija plano com garantia de não treinamento ou avalie modelo local.
4. **Para volume e repetição**, pense em API, com revisão por amostragem.
5. **Reavalie a cada seis meses.** O mercado muda rápido; o melhor de hoje pode não ser o de amanhã.

## Erros comuns

- **Escolher pelo nome mais famoso** sem testar na própria tarefa.
- **Usar a conta pessoal gratuita para trabalho** com dados de cliente.
- **Achar que modelo local é "de graça"**: há custo de hardware, de tempo e de qualidade.
- **Trocar de ferramenta toda semana** por causa de lançamentos. Estabilidade de processo vale mais que o último modelo.

## Na prática

Um escritório pequeno pode começar assim: contas corporativas de um assistente de chat para a equipe (com garantia de dados), uso do assistente integrado ao pacote de escritório que já paga, e um projeto-piloto de automação via API para uma tarefa volumosa. O modelo local fica como estudo para o caso de clientes que exigem que nada saia da rede interna.

## Resumo

- Fornecedores principais: Claude, ChatGPT, Gemini, Copilot e os modelos abertos (Llama, Mistral, Qwen, DeepSeek, Gemma); cada um é uma família que muda com frequência.
- Fechado = melhor desempenho, dados no fornecedor; aberto = controle; local (Ollama) = privacidade total com menos capacidade.
- Assistente para o dia a dia; API para automação e volume; integração para quem vive dentro do Office ou do Workspace.
- Planos pagos e corporativos importam principalmente por modelo, limites e garantia de dados.
- Escolha testando nas suas tarefas e reavalie periodicamente, consultando a documentação atual.
