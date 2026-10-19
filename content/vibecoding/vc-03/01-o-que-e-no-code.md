Nesta lição você vai entender o que é **no-code** e **low-code**, aprender a enxergar qualquer sistema como quatro partes (dados, telas, lógica e integrações), descobrir quando o no-code resolve o problema e quando ele vira armadilha, e conhecer o panorama de ferramentas disponíveis em 2026. Isso importa porque a escolha da ferramenta errada custa meses de retrabalho; a escolha certa coloca um sistema funcionando no seu escritório em uma semana.

## O que é no-code e low-code

**No-code** é uma forma de construir software usando telas visuais em vez de escrever código: você arrasta componentes, preenche formulários de configuração e conecta blocos. **Low-code** é o meio do caminho: a maior parte é visual, mas em alguns pontos você escreve pequenas fórmulas ou trechos de código para resolver o que a interface não cobre.

A analogia mais honesta é a do Excel. Você nunca "programou" uma planilha, mas já construiu um sistema de controle com fórmulas, validação de dados e formatação condicional. O no-code é esse mesmo raciocínio, só que com tabelas de verdade, telas para celular, login de usuários e automações. Se você domina planilhas, já tem metade do caminho.

## A anatomia de qualquer sistema

Todo sistema, do WhatsApp ao programa da Receita Federal, é feito de quatro partes. Aprender a enxergá-las é a habilidade mais importante desta lição, porque ela vale para no-code, para vibe coding e para avaliar qualquer software que alguém tente vender ao seu escritório.

1. **Dados** — onde a informação fica guardada. Tabelas de clientes, honorários, documentos, tarefas. É a "base de dados" (ou banco de dados).
2. **Telas** — o que o usuário vê e toca. Listas, formulários, botões, filtros. É a "interface".
3. **Lógica** — as regras. "Se o honorário está vencido há mais de 10 dias, marcar como inadimplente." "Só o administrador pode excluir um cliente."
4. **Integrações** — as conversas com outros sistemas. Enviar e-mail, gerar cobrança no Pix, gravar na planilha do Google, avisar no WhatsApp.

Exemplo concreto: um controle de obrigações fiscais do escritório.

| Parte | No controle de obrigações |
|---|---|
| Dados | Tabela de clientes, tabela de obrigações (DCTF, SPED, DAS...), tabela de entregas com data e responsável |
| Telas | Lista "o que vence esta semana", formulário "marcar como entregue", tela do cliente com histórico |
| Lógica | Calcular o prazo a partir do regime tributário; impedir marcar como entregue sem anexar o recibo |
| Integrações | E-mail para o cliente quando a guia estiver pronta; lembrete no calendário |

> **Dica:** antes de abrir qualquer ferramenta, escreva essas quatro listas no papel. Quem pula essa etapa descobre no meio do caminho que a ferramenta escolhida não faz o que precisava.

## Quando o no-code resolve

O no-code brilha quando o problema tem estas características:

- **Poucos usuários** (uma equipe, dezenas de clientes, não milhões).
- **Dados tabulares** que caberiam em planilhas, mas que precisam de telas melhores, acesso por celular ou permissões.
- **Regras simples ou médias**: filtros, cálculos, status, aprovações.
- **Pressa**: você precisa de algo funcionando em dias, não em meses.
- **Orçamento pequeno**: assinaturas mensais em vez de um desenvolvedor contratado.

## Quando o no-code não resolve

Também é preciso ser honesto sobre os limites:

- **Volume alto de dados**: centenas de milhares de linhas deixam muitos bancos no-code lentos ou caros.
- **Regras muito complexas**: um cálculo de folha com dezenas de convenções coletivas vira um emaranhado de blocos visuais impossível de manter.
- **Integrações que a ferramenta não oferece**: se o sistema do governo só aceita um formato específico de arquivo, talvez não exista bloco pronto para isso.
- **Exigência de controle total**: dados sensíveis que não podem sair do país, auditoria detalhada, personalização profunda.
- **Custo que escala com usuários**: muitas ferramentas cobram por "assento"; com 200 clientes acessando um portal, a conta muda de patamar.

Nesses casos, a resposta pode ser vibe coding (módulo seguinte) ou um sistema híbrido, assunto da lição 8.

## Panorama de ferramentas em 2026

As categorias abaixo são estáveis; os nomes mudam de posição, mas a função de cada grupo permanece.

| Categoria | Para quê | Exemplos |
|---|---|---|
| Bancos de dados no-code | Guardar tabelas com tipos de campo e relacionamentos | Airtable, Google Sheets, Notion, Baserow |
| Construtores de apps internos | Telas de lista, formulário e detalhe em cima de um banco | Glide, Softr, AppSheet, Retool |
| Construtores web | Sites e aplicações web com lógica própria | Bubble, Framer, Webflow, WordPress |
| Formulários | Coletar informação com validação e uploads | Tally, Typeform, Google Forms |
| Automação | Ligar um sistema ao outro quando algo acontece | Make, Zapier, n8n |
| Pagamentos | Cobrar, assinar planos, receber Pix | Stripe, Mercado Pago |

## Como escolher

Use quatro perguntas, nessa ordem:

1. **Onde ficam os dados?** Escolha o banco primeiro (lição 2). Tudo o mais se conecta a ele.
2. **Quem vai usar e por onde?** Equipe interna no computador pede uma ferramenta; cliente externo no celular pede outra.
3. **Quais integrações são obrigatórias?** Confira na documentação atual se a ferramenta se conecta ao que você precisa. Se não conectar, descarte antes de começar.
4. **Quanto custa com o número real de usuários daqui a um ano?** Faça a conta com o plano que você vai precisar, não com o plano grátis.

Um prompt útil para essa etapa, já aplicando o que você aprendeu em engenharia de prompt:

```text
Sou contador e quero construir um sistema simples sem programar. Descrição: [o que o sistema faz].
Usuários: [quem e quantos]. Dados: [listas principais]. Integrações obrigatórias: [e-mail, Pix...].
Liste 3 combinações de ferramentas no-code que atendem isso, com prós, contras e o ponto
em que cada uma começa a ficar cara ou limitada. Não invente preços; diga o que devo
conferir na documentação de cada uma.
```

## Erros comuns

- **Começar pelas telas.** A tela bonita não salva um sistema com dados mal organizados. Dados primeiro.
- **Escolher pela propaganda.** "Crie seu app em 5 minutos" vale para o exemplo do vídeo, não para o seu caso.
- **Ignorar o plano pago.** O grátis serve para testar; o custo real aparece quando o sistema é usado de verdade.

## Na prática

Um escritório com 80 clientes queria parar de controlar obrigações em uma planilha compartilhada que vivia sendo apagada por engano. Listou as quatro partes, viu que os dados cabiam em um banco no-code, que os usuários eram quatro pessoas da equipe e que a única integração era e-mail. Em uma semana, um app interno substituiu a planilha, com permissão para apagar restrita ao sócio. Nenhuma linha de código.

## Resumo

- No-code constrói software por telas visuais; low-code aceita pequenos trechos de código.
- Todo sistema tem dados, telas, lógica e integrações; liste as quatro antes de escolher ferramenta.
- No-code serve para poucos usuários, dados tabulares, regras médias e pressa.
- Volume alto, regras complexas e integrações inexistentes pedem outra abordagem.
- Escolha pelo banco de dados, pelos usuários, pelas integrações obrigatórias e pelo custo real.
