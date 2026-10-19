Nesta lição você vai transformar o PRD simples que escreveu no módulo anterior em uma **especificação profissional**: documento de requisitos completo, modelo de dados, fluxos, casos de borda e critérios de aceite. Vai aprender a tratar esse documento como um **contrato com a IA** e a dividir o trabalho em entregas pequenas. Isso importa porque a qualidade do que a IA gera é limitada pela clareza do que você pede: especificação vaga gera app vago, e cada ambiguidade vira uma decisão tomada por quem não conhece o seu negócio.

## Do PRD de uma página ao PRD completo

O PRD (documento de requisitos do produto) que você usou até aqui tinha objetivo, público e lista de funcionalidades. O PRD profissional acrescenta quatro blocos que a IA precisa para não inventar:

1. **Modelo de dados**: as entidades, seus campos, tipos e relações.
2. **Fluxos**: a sequência de telas e ações para cada tarefa do usuário.
3. **Casos de borda**: o que acontece nas situações estranhas.
4. **Critérios de aceite**: como saber, de forma objetiva, que uma funcionalidade está pronta.

Um PRD assim tem de duas a cinco páginas. Parece muito, mas cada parágrafo economiza uma rodada de "não era isso" com a IA.

## Modelo de dados em texto

Você não precisa de ferramenta de diagrama. Uma tabela em Markdown por entidade basta:

```text
Entidade: fatura
- id: uuid, gerado
- contrato_id: referência a contrato, obrigatório
- competencia: texto AAAA-MM, obrigatório (ex.: 2026-03)
- valor: numérico(12,2), > 0
- vencimento: data, obrigatória
- status: 'aberta' | 'paga' | 'cancelada', padrão 'aberta'
- pago_em: data, opcional, só preenchido quando status = 'paga'
Regra: (contrato_id, competencia) é único — não existem duas faturas
da mesma competência para o mesmo contrato.
Regra: "atrasada" não é gravado; é calculado ao listar
(aberta e vencimento < hoje).
```

Escreva as **regras** junto da entidade. "Única por contrato e competência" vira um `unique` no SQL; "só preenchido quando paga" vira uma validação no backend; "atrasada é calculado" evita gravar um status que ficaria velho no dia seguinte. Sem a regra escrita, a IA cria a coluna e não a protege.

## Fluxos: a história de cada tarefa

Um fluxo descreve, em passos numerados, o que o usuário faz e o que o sistema responde. Escreva um por tarefa principal:

```text
Fluxo: registrar pagamento de fatura
1. Usuário abre a lista de faturas, filtra "abertas".
2. Clica em "Registrar pagamento" na fatura.
3. Sistema abre um diálogo com data de pagamento (padrão: hoje) e valor
   (padrão: valor da fatura, editável para pagamento parcial).
4. Usuário confirma.
5. Sistema valida (data não futura, valor > 0), grava, muda status para
   'paga' se valor >= valor da fatura, senão mantém 'aberta' e registra
   o recebimento parcial.
6. Lista atualiza; aparece aviso "Pagamento registrado".
```

O passo 5 é onde moram as regras de negócio. É ele que o contador conhece e a IA não.

## Casos de borda

Casos de borda são as situações fora do caminho feliz. A pergunta que os revela: **"e se…?"**

- E se o cliente tiver dois contratos ativos? Cada um gera a própria fatura.
- E se o dia de vencimento for 31 e o mês tiver 30? Usa o último dia do mês.
- E se o usuário registrar pagamento de uma fatura cancelada? Bloqueia com mensagem.
- E se a internet cair no meio do cadastro? O formulário mantém o que foi digitado.
- E se dois usuários do mesmo escritório editarem o mesmo cliente? O último salvo vence; mostre "atualizado por X às HH:MM".

Liste pelo menos cinco por funcionalidade importante. Eles viram testes na lição de qualidade.

## Critérios de aceite

Um critério de aceite é uma frase verificável, no formato **"Dado… quando… então…"** ou como lista de checagens:

```text
Funcionalidade: exportar faturas em CSV
- Dado um filtro aplicado, quando clico em "Exportar", então o arquivo
  contém só as faturas filtradas.
- O CSV usa ponto e vírgula como separador e vírgula como decimal
  (padrão do Excel em português).
- A primeira linha é o cabeçalho: cliente;competencia;valor;vencimento;status.
- Datas no formato DD/MM/AAAA.
- Com zero faturas, o arquivo tem só o cabeçalho e o botão avisa.
```

Sem critérios, "pronto" é opinião. Com eles, você testa em dois minutos e a IA sabe exatamente o que entregar.

## O contrato com a IA

Com o PRD completo, o primeiro prompt de cada sessão de trabalho fixa as regras:

```text
Você é o desenvolvedor deste projeto. O PRD abaixo é a fonte da verdade.
Regras:
1. Antes de gerar código, liste o que vai fazer e aguarde meu "ok".
2. Não adicione funcionalidades que não estão no PRD; se achar necessário,
   proponha e espere aprovação.
3. Implemente uma entrega por vez; ao final, diga como eu testo.
4. Se algo no PRD for ambíguo, pergunte em vez de supor.
5. Use a stack definida: Next.js, Supabase, Vercel.

[PRD completo]

Entrega 1: modelo de dados (SQL + RLS). Proponha e aguarde.
```

Esse "contrato" reduz o maior problema do vibe coding: a IA que, com boa intenção, acrescenta um módulo de estoque a um sistema de honorários.

## Dividir em entregas pequenas

Uma entrega pequena é algo que cabe em uma sessão de 30 a 60 minutos e termina **testável**. Ordem típica:

1. Banco e RLS (testa pelo painel do Supabase).
2. Login e cadastro (testa entrando e saindo).
3. CRUD de clientes — criar, listar, editar, excluir (testa na tela).
4. Contratos ligados a clientes.
5. Geração de faturas por competência.
6. Painel e filtros.
7. Exportação e lembretes.

Cada entrega termina com commit no Git e, se possível, deploy. Se a entrega 5 quebrar, você volta para a 4 em um comando. Entregas grandes ("faça tudo") produzem um bloco enorme de código que ninguém — nem a IA — consegue depurar.

## Erros comuns

- Escrever o PRD e não colá-lo no prompt (a IA não lê sua cabeça nem seus arquivos sem você pedir).
- Descrever telas em detalhe e esquecer as regras (cor do botão não importa; "fatura única por competência" importa).
- Critérios de aceite subjetivos: "tela intuitiva", "rápido".
- Pular os casos de borda porque "depois eu vejo" — depois tem dado real no banco.
- Entregas grandes demais para parecer produtivo.

## Na prática

Um contador que especifica assim consegue delegar: o mesmo PRD serve para a IA, para um freelancer ou para um estagiário. E quando um cliente pede "coloca um campo de desconto", você atualiza o PRD (entidade, fluxo, caso de borda, critério) antes de pedir código — e o campo nasce certo.

## Resumo

- PRD profissional = objetivo + modelo de dados + fluxos + casos de borda + critérios de aceite.
- Regras de negócio moram no modelo de dados e no passo de validação do fluxo.
- Pergunte "e se…?" até ter cinco casos de borda por funcionalidade.
- Critérios de aceite são frases verificáveis; sem eles, "pronto" é opinião.
- Contrato com a IA: PRD é a fonte da verdade, uma entrega por vez, perguntar em vez de supor.
