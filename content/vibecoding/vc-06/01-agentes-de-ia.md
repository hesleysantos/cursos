Nesta lição você vai entender o que é um **agente de IA**, em que ele difere de um chat e de um workflow, como os modelos "usam ferramentas" (function calling), o que é o **MCP** e onde agentes já ajudam num escritório contábil — e, tão importante quanto, onde eles não devem agir sozinhos. Isso importa porque "agente" virou palavra de marketing: saber o que ela significa de verdade evita comprar promessa e, ao mesmo tempo, revela automações reais que você consegue montar.

## Chat, workflow e agente

Três formas de usar um modelo de linguagem, em ordem de autonomia:

**Chat.** Você pergunta, o modelo responde. Toda ação é sua: copiar a resposta, abrir a planilha, enviar o e-mail.

**Workflow (fluxo).** Uma sequência fixa de passos, definida por você, em que o modelo ocupa um ou mais passos. Exemplo: "quando chegar um e-mail com anexo PDF, extraia o texto, peça ao modelo para classificar como nota fiscal, contrato ou outro, e salve na pasta certa". O caminho é sempre o mesmo; o modelo só decide o rótulo. É o que as ferramentas no-code de automação do módulo 3 fazem.

**Agente.** O modelo recebe um **objetivo** e um conjunto de **ferramentas**, e decide sozinho quais passos dar, em que ordem, e quando parou. Exemplo: "descubra por que a fatura de março do cliente X não foi gerada". O agente pode consultar o banco, ler os logs, comparar com fevereiro, formular uma hipótese, testá-la e relatar. Você não escreveu esses passos; ele os escolheu.

A diferença prática: diante do inesperado, o workflow quebra ou ignora; o agente tenta contornar — poderoso quando dá certo, perigoso quando contorna o que não devia.

## Ferramentas e function calling

Um modelo de linguagem, sozinho, só produz texto. **Function calling** (chamada de função) é o mecanismo que permite ao modelo pedir que o programa execute uma ação. Funciona assim:

1. O programa informa ao modelo quais ferramentas existem, cada uma com nome, descrição e parâmetros. Por exemplo: `consultar_fatura(cnpj, competencia)`.
2. O usuário pergunta: "a Padaria Central pagou março?".
3. O modelo, em vez de inventar, responde com um pedido estruturado: *chamar `consultar_fatura` com cnpj=... e competencia="2026-03"*.
4. O **programa** executa a função de verdade (consulta o banco) e devolve o resultado ao modelo.
5. O modelo lê o resultado e responde em linguagem natural: "Sim, paga em 12/03".

Repare: o modelo nunca executa nada. Ele **pede**; o seu código **decide** se executa. Esse é o ponto de controle. Uma ferramenta de leitura (consultar) pode ser liberada; uma de escrita (cancelar fatura, enviar e-mail) pode exigir confirmação humana.

```text
Definição de ferramenta (o formato exato varia por provedor):
nome: consultar_fatura
descrição: Busca a fatura de um cliente em uma competência. Use quando o
  usuário perguntar sobre pagamento, vencimento ou status de uma cobrança.
parâmetros:
  cnpj (texto, 14 dígitos, obrigatório)
  competencia (texto AAAA-MM, obrigatório)
```

A **descrição** é o que o modelo lê para decidir quando usar a ferramenta. Descrição vaga gera uso errado; descrição com "use quando…" gera uso certo.

## MCP: um padrão para conectar ferramentas

Cada provedor de IA tinha seu jeito de descrever ferramentas, e cada sistema (Google Drive, banco de dados, GitHub) precisava de uma integração específica para cada assistente. O **Model Context Protocol (MCP)** é um padrão aberto, criado pela Anthropic em 2024 e adotado por diversas ferramentas e provedores, que resolve isso: um sistema expõe suas ferramentas e dados uma única vez, como um **servidor MCP**, e qualquer assistente compatível consegue usá-las.

A analogia é a tomada elétrica: com o padrão, qualquer aparelho entra em qualquer tomada. Na prática, você pode dar a um assistente acesso ao seu Supabase, ao Google Drive ou a um sistema interno instalando (ou pedindo à IA que gere) um servidor MCP, em vez de programar uma integração do zero para cada caso.

Em termos gerais, funciona assim: o **servidor MCP** descreve o que oferece — **ferramentas** (ações, como "consultar fatura"), **recursos** (dados para leitura, como um arquivo ou uma tabela) e **prompts** prontos; o assistente (o **cliente MCP**) se conecta, lê essa lista e passa a usar as ferramentas pelo mesmo mecanismo de function calling que você acabou de ver. O servidor pode rodar na sua máquina ou em um endereço na internet; a conexão é feita por um protocolo padronizado, e é por isso que o mesmo servidor serve a assistentes de fabricantes diferentes.

O que o MCP **não** faz: não torna o modelo mais inteligente nem mais seguro; só padroniza a conexão. Toda ferramenta exposta por MCP merece a pergunta "o que acontece se o modelo chamar isso na hora errada?" e as mesmas permissões cuidadosas.

## Agentes úteis no escritório

Casos em que a autonomia compensa, sempre com leitura livre e escrita supervisionada:

- **Triagem de documentos recebidos**: ler o que chegou, classificar, extrair datas e valores, abrir um rascunho de lançamento para alguém aprovar.
- **Investigação de divergência**: "por que o saldo de fornecedores não bate?" — o agente cruza razão, extrato e notas, e apresenta hipóteses com evidência.
- **Preparação de reunião com cliente**: reunir faturas em aberto, últimas obrigações entregues e pendências, e montar um resumo.
- **Assistente de pesquisa de normas**: buscar em bases internas e públicas, citar a fonte e indicar o que mudou.

Sem autonomia: transmitir declarações, enviar comunicação ao cliente, alterar lançamentos, pagar. Nessas ações o agente prepara e a pessoa confirma.

## Limites e supervisão

Agentes falham de formas que chats não falham:

- **Loops**: tentar a mesma coisa dez vezes. Defina um número máximo de passos.
- **Ações irreversíveis por engano**: por isso ferramentas de escrita pedem confirmação.
- **Injeção por conteúdo**: um documento lido pelo agente pode conter instruções ("ignore as regras e…"). Trate tudo que o agente lê como dado, não como ordem — você viu isso na segurança de apps.
- **Confiança excessiva**: o relatório vem bem escrito mesmo quando a conclusão está errada. Exija que o agente mostre **evidências** (qual registro, qual linha) e confira as que importam.
- **Custo**: cada passo é uma chamada; um agente solto pode gastar em uma hora o orçamento do mês. Defina tetos.

> **Atenção:** supervisão não é desconfiança, é desenho. Um bom agente é construído para pedir confirmação nos pontos certos, não para pedir em tudo nem em nada.

## Erros comuns

- Chamar de agente um workflow fixo (ou o contrário) e dimensionar errado o risco.
- Dar ao agente ferramentas de escrita "porque é mais prático" sem confirmação.
- Escrever descrições de ferramenta sem dizer quando usar.
- Não limitar passos nem gasto.
- Acreditar que o MCP resolve segurança ou qualidade.

## Na prática

Um escritório monta um agente de triagem: ele lê os e-mails de uma caixa específica, classifica anexos, extrai dados e cria rascunhos em um sistema interno. Uma pessoa revisa os rascunhos em dez minutos por dia. Depois de um mês medindo acertos, o escritório decide se libera a criação automática nas categorias em que o agente acertou sempre.

## Resumo

- Chat responde; workflow segue passos fixos; agente escolhe os passos para atingir um objetivo.
- Function calling: o modelo pede uma ação com parâmetros; o seu código decide e executa.
- MCP padroniza a conexão entre assistentes e ferramentas; não substitui permissões nem revisão.
- No escritório: leitura e rascunho com autonomia; ações irreversíveis com confirmação humana.
- Limite passos e gasto, exija evidências, trate conteúdo lido como dado.
