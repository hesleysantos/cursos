Nesta lição você vai aprender a enxergar um aplicativo completo como um conjunto de peças que conversam entre si — frontend, backend, banco de dados, autenticação e APIs — e a **desenhar essa estrutura antes de pedir qualquer código à IA**. Isso importa porque, nos módulos anteriores, você publicou páginas que viviam inteiras no navegador. Um app de verdade guarda dados, tem usuários e fala com outros sistemas. Quem pede "faça um sistema de honorários" sem saber onde cada coisa mora recebe da IA um emaranhado que funciona na demonstração e quebra no primeiro cliente real.

## As cinco peças de um app

Pense em um escritório de contabilidade físico. O **frontend** é a recepção: é o que o cliente vê e toca — telas, botões, formulários. Roda no navegador (ou no celular) e é feito de HTML, CSS e JavaScript, hoje quase sempre organizados por uma biblioteca como o **React**.

O **backend** é a sala de atendimento: recebe os pedidos da recepção, aplica as regras (pode ou não pode, calcula, valida) e decide o que responder. Roda em um servidor, longe do usuário, e por isso é o único lugar onde você pode confiar que ninguém alterou a lógica.

O **banco de dados** é o arquivo morto, só que vivo: tabelas onde ficam clientes, contratos, faturas. Quase sempre é um banco **relacional** (PostgreSQL, por exemplo), com tabelas, colunas e relações — muito parecido com planilhas que se referenciam.

A **autenticação** é a portaria: confere quem é a pessoa (login) e o que ela pode ver (permissões). Sem ela, qualquer um que descubra o endereço do seu app vê os dados de todos.

As **APIs** são os telefones: canais padronizados pelos quais o seu app pede informações a outros sistemas (consultar um CNPJ, pegar a cotação do dólar, chamar um modelo de IA) e pelos quais o seu frontend conversa com o seu próprio backend.

## Como as peças conversam

Quase tudo em um app segue o mesmo ciclo:

1. O usuário clica em "Salvar fatura" no **frontend**.
2. O frontend envia uma **requisição** (um pacote de dados, geralmente em JSON) para o **backend** por uma API.
3. O backend confere a **autenticação** (quem está pedindo?), valida os dados e grava no **banco**.
4. O banco confirma; o backend responde ao frontend; o frontend mostra "Fatura salva".

Repare na regra de ouro que vem daí: **o frontend nunca decide sozinho o que é permitido**. Ele pode esconder um botão, mas quem bloqueia de fato é o backend ou o banco. Qualquer pessoa consegue abrir as ferramentas do navegador e mandar uma requisição "na mão", pulando a tela. Esse ponto volta com força na lição de segurança.

## Stacks que a IA gera bem

Uma **stack** é o conjunto de tecnologias escolhido para cada peça. Para quem faz vibe coding, a melhor stack não é a mais poderosa, e sim a que a IA conhece profundamente e cuja hospedagem é simples. Duas combinações se destacam:

| Peça | Opção A (web completa) | Opção B (backend em Python) |
|------|------------------------|-----------------------------|
| Frontend | **Next.js** (React) | Next.js ou HTML simples |
| Backend | Rotas do próprio Next.js | **FastAPI** (Python) |
| Banco + Auth | **Supabase** (PostgreSQL + autenticação + storage) | Supabase ou PostgreSQL direto |
| Hospedagem | **Vercel** | Render, Railway ou similar |

A Opção A é a que vamos usar no projeto guiado. Há milhões de exemplos públicos dessa combinação, então o código gerado tende a ser correto e idiomático, e a Vercel publica um projeto Next.js com poucos cliques. A Opção B serve quando a lógica pesada já está em Python — por exemplo, se você aproveita as funções do curso de Python para cálculos fiscais.

> **Dica:** evite misturar demais. Pedir "React com Firebase, backend em Go e banco Mongo" multiplica os pontos em que a IA pode errar e em que você não saberá depurar.

## Desenhar antes de gerar

Antes de abrir a ferramenta de IA, responda em uma página:

1. **Quem usa?** (só você; o escritório; seus clientes)
2. **Quais entidades existem?** Substantivos do negócio: cliente, contrato, fatura, lembrete.
3. **Como elas se relacionam?** Um cliente tem vários contratos; um contrato gera várias faturas.
4. **Quais telas?** Lista de clientes, detalhe do cliente, nova fatura, painel.
5. **O que fala com fora?** API de CNPJ, envio de e-mail, IA para resumir documentos.

Esse rascunho é o que você cola no prompt. Veja a diferença:

```text
Ruim:
"Crie um sistema de controle de honorários para contador."

Bom:
"Quero um app web com Next.js + Supabase. Entidades: clientes (nome, CNPJ,
e-mail), contratos (cliente, valor mensal, dia de vencimento, ativo),
faturas (contrato, competência, valor, status: aberta/paga/atrasada).
Um cliente tem vários contratos; um contrato tem várias faturas.
Telas: lista de clientes, detalhe do cliente com contratos, lista de faturas
com filtro por status, painel com total a receber no mês.
Só usuários autenticados acessam; cada usuário vê apenas os próprios dados.
Comece propondo o modelo de dados e as telas; não gere código ainda."
```

O segundo prompt termina pedindo um **plano**, não código. Essa é a disciplina deste módulo: a IA propõe, você revisa, só então gera.

## Armadilhas

- **Começar pela tela bonita.** O frontend é a parte mais fácil de refazer; o banco é a mais cara. Modele os dados primeiro.
- **Guardar regras só no frontend.** "O botão Excluir só aparece para o admin" não impede ninguém de excluir. A regra tem que estar no backend ou no banco.
- **Trocar de stack no meio.** Cada troca joga fora contexto que a IA e você acumularam.
- **Ignorar o custo de operação.** Um app que depende de cinco serviços pagos é difícil de manter sozinho.
- **Não nomear as coisas.** Se você chama de "cobrança" hoje e "fatura" amanhã, a IA cria duas tabelas.

## Na prática

No escritório, a arquitetura aparece quando você explica para a IA (ou para um sócio) o que o sistema faz: "o cliente entra pelo portal (frontend), o sistema confere o login (auth), busca as faturas dele (banco) e, se ele pedir, consulta a situação do CNPJ na Receita (API externa)". Quem consegue contar essa história consegue também achar o problema quando algo falha: se a tela abre mas os dados não aparecem, o erro está entre o backend e o banco; se ninguém consegue entrar, é a autenticação.

## Resumo

- Um app completo tem frontend (tela), backend (regras), banco (dados), autenticação (quem pode) e APIs (comunicação).
- O ciclo básico é: tela pede → backend valida e autentica → banco grava → tela mostra.
- O frontend nunca é a barreira de segurança; backend e banco são.
- Stack recomendada para vibe coding: Next.js + Supabase na Vercel; FastAPI quando a lógica é Python.
- Desenhe entidades, relações, telas e integrações em uma página antes de gerar qualquer código, e peça primeiro um plano à IA.
