Nesta lição você vai construir, etapa por etapa, o **Gestão de Honorários**: um app em que o escritório cadastra clientes e contratos, gera faturas por competência, acompanha pagamentos, recebe lembretes de vencimento e exporta tudo em CSV — com login, RLS e painel. Cada etapa tem o prompt a usar e a **verificação** que você faz antes de seguir. Isso importa porque é aqui que as lições anteriores viram método: especificar, gerar pouco, testar, commitar, repetir.

## Antes de começar

Tenha prontos: uma conta no Supabase com um projeto novo, um repositório no GitHub, a ferramenta de vibe coding da sua preferência e o PRD abaixo salvo num arquivo `PRD.md`.

```text
Produto: Gestão de Honorários (uso interno de um escritório contábil).
Stack: Next.js (App Router) + Supabase (auth, banco, RLS) + Vercel.
Usuários: contador e equipe, cada um com login por e-mail e senha.
Entidades:
- clientes: id, user_id, nome*, cnpj (14 dígitos, único por usuário),
  email, telefone, criado_em.
- contratos: id, user_id, cliente_id*, descricao, valor_mensal* (>0),
  dia_vencimento* (1-28), ativo (padrão true), inicio (data).
- faturas: id, user_id, contrato_id*, competencia* (AAAA-MM), valor*,
  vencimento*, status gravado (aberta|paga|cancelada), pago_em.
  Única por (contrato_id, competencia).
Regras: só o dono (user_id) lê e escreve seus registros (RLS).
Fatura é "atrasada" quando aberta e vencimento < hoje; esse status é
calculado ao listar, nunca gravado.
Telas: login; clientes (lista, novo, editar, excluir); detalhe do cliente
com contratos; faturas (lista com filtro por status e mês, gerar para a
competência, registrar pagamento, cancelar); painel (a receber no mês,
recebido no mês, atrasadas, próximos 7 dias); exportar CSV das faturas
filtradas (separador ;, decimal com vírgula, datas DD/MM/AAAA).
Lembretes: lista "vence em até 7 dias" no painel (sem envio automático
nesta versão).
Fora do escopo: multiusuário por escritório, boletos, NF-e.
```

## Etapa 1: projeto e contrato com a IA

```text
Leia o PRD.md. Você é o desenvolvedor deste projeto. Regras: proponha
antes de gerar; uma entrega por vez; não invente funcionalidades; ao final
de cada entrega diga como testo. Crie o projeto Next.js com TypeScript,
instale o cliente do Supabase e configure as variáveis de ambiente
NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY lidas de
.env.local (que deve estar no .gitignore). Não crie telas ainda.
```

**Verificação:** `npm run dev` abre a página inicial sem erro; `.env.local` existe e **não** aparece no `git status`. Commit: "etapa 1: projeto base".

## Etapa 2: banco e RLS

```text
Gere o SQL para as três tabelas do PRD, com tipos corretos (numeric para
dinheiro, check para dia_vencimento e valor, unique para cnpj por usuário
e para contrato+competencia), RLS ativada e as quatro políticas
(select, insert, update, delete) baseadas em auth.uid() = user_id.
```

Cole no SQL Editor do Supabase e execute. **Verificação:** em Table Editor, nenhuma das três tabelas mostra o aviso de RLS desativada; na página de políticas (Authentication → Policies), cada tabela tem quatro. Guarde o SQL em `supabase/schema.sql` no repositório. Commit.

## Etapa 3: login

```text
Implemente cadastro, login e logout por e-mail e senha com Supabase Auth.
Rotas protegidas redirecionam para /login. Mostre o e-mail do usuário
logado no cabeçalho. Mensagens de erro em português.
```

**Verificação:** crie dois usuários (A e B). Entre e saia com cada um. Tente abrir `/clientes` deslogado: deve redirecionar. Commit.

## Etapa 4: clientes (CRUD)

```text
Implemente a tela de clientes: lista ordenada por nome, formulário de
novo/editar com validação (nome obrigatório; CNPJ com 14 dígitos,
aceitando máscara; e-mail válido se preenchido), exclusão com confirmação.
Valide também no servidor. Ao salvar, preencha user_id com o usuário
logado. Erro de CNPJ duplicado deve virar mensagem "CNPJ já cadastrado".
```

**Verificação (a mais importante do projeto):** com o usuário A, cadastre dois clientes. Saia, entre com B: a lista deve estar **vazia**. Tente cadastrar o mesmo CNPJ duas vezes com A: deve ser barrado. Commit.

## Etapa 5: contratos

```text
No detalhe do cliente, liste os contratos e permita criar/editar/
desativar. Valide valor > 0 e dia 1-28 no formulário e no servidor.
Contrato desativado continua visível, marcado como inativo.
```

**Verificação:** crie um contrato de R$ 1.500,00 vencendo dia 10 e outro de R$ 800,00 dia 25. Desative o segundo. Commit.

## Etapa 6: faturas

```text
Implemente a geração de faturas: botão "Gerar faturas da competência
AAAA-MM" que, para cada contrato ativo sem fatura nessa competência, cria
uma fatura aberta com o valor do contrato e vencimento no dia_vencimento
do mês da competência. Não duplique. Liste faturas com filtro por status
e competência; calcule "atrasada" ao listar (aberta e vencimento < hoje).
Ações: registrar pagamento (data padrão hoje, não futura) e cancelar.
Escreva testes com Vitest para a função que calcula o vencimento e para a
regra de não duplicar; me diga como rodar.
```

**Verificação:** gere a competência atual: deve criar **uma** fatura (só o contrato ativo). Gere de novo: nenhuma nova. Gere uma competência passada: a fatura aparece como atrasada. Registre pagamento: status muda para paga. `npm test` verde. Commit.

## Etapa 7: painel e lembretes

```text
Crie o painel com quatro cartões: a receber no mês (faturas abertas ou
atrasadas da competência atual), recebido no mês (pagas com pago_em no
mês atual), total de atrasadas, e lista "vence nos próximos 7 dias".
Use consultas eficientes (agregue no banco, não traga tudo para somar
no navegador).
```

**Verificação:** confira os números à mão com as faturas que você criou. Se o cartão "a receber" não bater, o erro costuma estar na definição de competência atual. Commit.

## Etapa 8: exportar CSV

```text
Adicione "Exportar CSV" na lista de faturas, respeitando o filtro ativo.
Colunas: cliente;competencia;valor;vencimento;status. Separador ponto e
vírgula, decimal com vírgula, datas DD/MM/AAAA, codificação UTF-8 com
BOM para abrir corretamente no Excel em português.
```

**Verificação:** abra o arquivo no Excel. As colunas devem estar separadas, os acentos corretos, os valores reconhecidos como número. Commit.

## Etapa 9: revisão e segurança

Rode o checklist da lição de segurança. Depois:

```text
Revise todo o projeto como desenvolvedor sênior: validação no servidor em
todas as rotas, nenhuma chave no código, RLS respeitada, tratamento de
erro. Liste problemas por gravidade com a correção. Não reescreva tudo.
```

Cole a lista em uma segunda IA e compare. Corrija, rode os testes, commit "etapa 9: revisão".

## Armadilhas do projeto

- Pular a verificação com dois usuários na etapa 4 e descobrir o vazamento na etapa 9.
- Deixar a IA gerar as etapas 4 a 7 de uma vez "para ganhar tempo".
- Calcular "atrasada" gravando no banco em vez de ao listar — amanhã o status fica velho.
- Somar valores no navegador com números de ponto flutuante e estranhar R$ 0,01 de diferença.
- Esquecer o commit por etapa e não conseguir voltar quando a etapa 6 quebrar a 5.

## Na prática

Com o app funcionando, o escritório troca a planilha de honorários por uma tela em que qualquer pessoa da equipe vê o que vence esta semana. Os próximos passos naturais — lembrete por e-mail automático, portal para o cliente ver as próprias faturas, boleto — entram no PRD como versão 2, uma entrega por vez.

## Resumo

- PRD salvo no repositório e colado no primeiro prompt; contrato com a IA.
- Nove etapas, cada uma com prompt, verificação objetiva e commit.
- O teste com dois usuários é a verificação mais importante.
- "Atrasada" é calculado ao listar; faturas são únicas por contrato e competência.
- Fechamento com testes, revisão por duas IAs e checklist de segurança.
