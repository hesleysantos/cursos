Nesta lição você vai conhecer as três famílias de ferramentas de vibe coding disponíveis em 2026: **editores com IA** (Cursor, Windsurf, VS Code com Copilot), **agentes de terminal** (Claude Code, Codex CLI) e **construtores de app por prompt** (Lovable, v0, Bolt, Replit). Vai entender o que cada família faz bem, onde cada uma trava e quais critérios usar para escolher. Isso importa porque a ferramenta errada para o seu perfil transforma uma tarde produtiva em uma semana de frustração.

## Três famílias, três formas de trabalhar

Todas usam modelos de IA parecidos; a diferença está em **onde você trabalha** e **quanto controle tem**.

| Família | Onde você trabalha | Controle | Para quem |
|---|---|---|---|
| Construtores por prompt | No navegador, vendo o app pronto | Baixo: a ferramenta decide estrutura e hospedagem | Quem quer resultado visual rápido sem instalar nada |
| Editores com IA | No seu computador, vendo os arquivos | Médio: você vê e edita o código; a IA sugere e gera | Quem quer aprender aos poucos e ter o projeto em mãos |
| Agentes de terminal | No seu computador, conversando em texto | Alto: o agente lê, cria e altera arquivos, roda comandos | Quem quer delegar tarefas inteiras e já se sente à vontade com pastas e comandos |

## Construtores de app por prompt

**Lovable**, **v0**, **Bolt** e **Replit** funcionam de forma parecida: você descreve o app em uma caixa de texto, a ferramenta gera a aplicação completa e mostra o resultado ao lado da conversa. Você pede mudanças ("deixe o botão verde", "adicione um campo de telefone") e vê a atualização na hora. A publicação é um botão.

Diferenças gerais, sem entrar em recursos específicos que mudam com frequência:

- **Lovable** e **Bolt** são focados em aplicações web completas, com banco de dados e login integrados por parceiros.
- **v0** é especialmente forte em gerar interfaces (telas e componentes) com acabamento profissional.
- **Replit** é um ambiente de desenvolvimento completo no navegador, com agente de IA, que também serve para scripts e serviços em Python.

Onde travam: quando o projeto cresce, pedidos começam a quebrar o que já funcionava; o código fica dentro da plataforma (lembra do lock-in?) e exportar nem sempre é simples. Confira na documentação atual de cada uma se é possível exportar o código para o GitHub; isso deve ser critério de escolha.

## Editores com IA

O **VS Code** é o editor de código mais usado do mundo; com a extensão **GitHub Copilot**, ganha sugestões de código enquanto você digita, um chat para pedir alterações e um modo agente que executa tarefas em vários arquivos. **Cursor** e **Windsurf** são editores derivados do VS Code, construídos em torno da IA desde o início: o chat entende o projeto inteiro, aplica mudanças diretamente nos arquivos e mostra o que alterou para você aprovar.

A experiência: você abre a pasta do projeto, vê os arquivos de um lado e a conversa de outro. Pede "crie uma página de contato com formulário"; a IA cria os arquivos, você vê o código aparecer, aceita ou rejeita cada mudança. É o melhor lugar para quem quer aprender vendo.

Onde travam: exigem instalar programas no computador e entender a noção de pasta de projeto, terminal e **dependências** (bibliotecas de terceiros que o projeto usa e que precisam ser baixadas). A lição 3 cobre o vocabulário mínimo de web; o resto vem com a prática das lições 5 e 7.

## Agentes de terminal

**Claude Code** (da Anthropic) e **Codex CLI** (da OpenAI) rodam no **terminal**, a janela de texto em que se digitam comandos para o computador (você talvez a conheça do curso de Python; se não, a lição 5 mostra o básico para abri-la em uma pasta). Você digita um pedido em linguagem natural; o agente lê os arquivos do projeto, planeja, cria ou altera o que for preciso, roda testes e comandos, e mostra o resultado. Ele pede permissão antes de ações mais sensíveis.

A grande vantagem é delegar tarefas inteiras: "adicione validação de CNPJ ao formulário e atualize os testes" vira uma única instrução. A desvantagem para iniciantes: não há interface visual; tudo é texto. Quem já se sente confortável com pastas e comandos ganha muita velocidade.

## Como escolher: critérios

Use estes critérios, nessa ordem:

1. **Seu conforto com o computador.** Nunca abriu um terminal nem uma pasta de projeto? Comece em um construtor por prompt. Já se vira com arquivos e já instalou programas? Editor com IA. Já usa terminal? Agente.
2. **O que você vai construir.** Interface bonita rápida: v0 ou Lovable. Script em Python que processa arquivos: Replit, editor ou agente. App com login e banco: Lovable ou Bolt para começar, editor para crescer.
3. **Exportação.** O código sai para o GitHub? Se não, você está preso.
4. **Privacidade.** Leia a política de uso de dados: o seu código e os seus prompts são usados para treinar modelos? Há opção de desligar? Para dados de clientes, isso é obrigatório.
5. **Modelo de cobrança.** Assinatura fixa, cobrança por uso ou créditos. Não decore valores: consulte a página de preços atual e estime com base no uso real.

Um prompt para decidir:

```text
Sou contador, uso bem Excel e Windows, já instalei programas mas nunca usei terminal. Quero
construir: (1) uma landing page com formulário e (2) uma calculadora de honorários web.
Com base nisso, qual família de ferramenta de vibe coding devo começar (construtor por prompt,
editor com IA ou agente de terminal) e por quê? Diga o que vou precisar aprender para migrar
para a família seguinte quando o projeto crescer. Não cite preços.
```

## Passos práticos: experimente duas

1. Crie uma conta em um construtor por prompt (Lovable, v0 ou Bolt) e peça "uma página com o nome do meu escritório, três serviços e um botão de WhatsApp". Veja o resultado em minutos.
2. Instale o VS Code e a extensão do Copilot, ou instale o Cursor. Abra uma pasta vazia e peça a mesma página no chat. Compare: onde foi mais fácil? Onde você entendeu melhor o que aconteceu?
3. Anote a diferença; essa anotação é sobre você, não sobre a ferramenta.

## Erros comuns

- **Começar pelo agente de terminal sem base.** A frustração vem rápido; suba um degrau de cada vez.
- **Ignorar a exportação.** Semanas de trabalho presas em uma plataforma.
- **Não ler a política de dados.** Código com dados de cliente treinando modelo de terceiro é problema sério.

## Na prática

Um escritório começou no Lovable para validar a ideia de um portal de documentos em uma tarde. Quando precisou de regras específicas, exportou o código para o GitHub, abriu no Cursor e passou a pedir alterações vendo os arquivos. Hoje, tarefas de manutenção ("atualize o texto de aviso de LGPD em todas as páginas") vão para o Claude Code. Três ferramentas, um projeto, evolução natural.

## Resumo

- Três famílias: construtores por prompt (navegador, controle baixo), editores com IA (arquivos à vista, controle médio), agentes de terminal (texto, controle alto).
- Lovable, v0, Bolt e Replit mostram o app pronto; Cursor, Windsurf e VS Code com Copilot mostram o código; Claude Code e Codex CLI delegam tarefas inteiras.
- Escolha pelo seu conforto com o computador, pelo que vai construir, pela exportação, pela privacidade e pelo modelo de cobrança.
- Confira preços e recursos na documentação atual; eles mudam com frequência.
- Um projeto pode evoluir pelas três famílias; comece simples.
