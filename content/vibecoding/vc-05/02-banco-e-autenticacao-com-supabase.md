Nesta lição você vai criar o banco de dados e o login do seu app usando o **Supabase**, entender o SQL mínimo que a IA gera para montar tabelas, e descobrir por que a **Row Level Security (RLS)** não é opcional. Isso importa porque o banco é a peça mais cara de refazer e a mais perigosa de errar: uma tabela sem proteção expõe os dados de todos os seus clientes a qualquer pessoa com o endereço do app.

## O que é o Supabase

O Supabase é um serviço que entrega, pronto para uso, um banco **PostgreSQL** (um dos bancos relacionais mais usados no mundo), um sistema de **autenticação**, um **storage** para arquivos e uma API automática para tudo isso. Você cria um projeto no site, recebe uma URL e duas chaves, e o seu app conversa com o banco por meio delas. O **Firebase** (do Google) tem proposta parecida, mas com banco de documentos em vez de tabelas; para quem pensa em planilhas e relações, o Supabase costuma ser mais natural, e é o que a IA gera com mais consistência junto do Next.js.

Ao criar o projeto, guarde com cuidado:

- **URL do projeto**: o endereço do seu banco.
- **Chave anon (pública)**: usada pelo frontend; ela só consegue o que a RLS permitir.
- **Chave service_role (secreta)**: pula toda proteção. Nunca vai para o navegador nem para o GitHub.

O painel de projetos novos mostra esses dois papéis com outros nomes: uma chave *publishable* (pública, começa com `sb_publishable_`) e uma *secret* (secreta, começa com `sb_secret_`). As chaves `anon` e `service_role`, mais antigas, continuam valendo e aparecem em muitos tutoriais e no código que a IA gera, mas o Supabase já as trata como legadas. A lógica é a mesma nos dois formatos: a pública obedece à RLS; a secreta ignora tudo e só vive no servidor.

## Tabelas e SQL gerado por IA

Um banco relacional guarda dados em **tabelas** com colunas tipadas. A linguagem para criá-las e consultá-las é o **SQL**. Você não precisa escrever SQL de cabeça — precisa **ler** o que a IA gera e conferir se faz sentido. Peça assim:

```text
Gere o SQL para o Supabase (PostgreSQL) com as tabelas clientes e contratos.
clientes: id (uuid, gerado automaticamente), user_id (dono do registro,
referência a auth.users), nome (texto obrigatório), cnpj (texto, 14 dígitos,
único por usuário), email, criado_em (data/hora, padrão agora).
contratos: id, user_id, cliente_id (referência a clientes, apagar em cascata),
valor_mensal (numérico com 2 casas, maior que zero), dia_vencimento (1 a 28),
ativo (booleano, padrão true).
Ative RLS nas duas tabelas e crie políticas para que cada usuário só leia e
escreva os próprios registros.
```

A IA devolve algo como:

```sql
create table clientes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  nome text not null,
  cnpj text,
  email text,
  criado_em timestamptz not null default now(),
  unique (user_id, cnpj)
);

create table contratos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  cliente_id uuid not null references clientes(id) on delete cascade,
  valor_mensal numeric(12,2) not null check (valor_mensal > 0),
  dia_vencimento int not null check (dia_vencimento between 1 and 28),
  ativo boolean not null default true
);
```

O que conferir, linha a linha: cada tabela tem `id` e `user_id`; campos obrigatórios têm `not null`; valores numéricos usam `numeric`, nunca `float` (dinheiro com ponto flutuante gera centavos fantasmas); regras do negócio viram `check`. Você cola esse SQL no **SQL Editor** do painel do Supabase e executa.

## Autenticação: e-mail/senha e magic link

O Supabase Auth cuida de cadastro, login, recuperação de senha e sessão. Dois modos cobrem quase tudo:

- **E-mail e senha**: o clássico. O Supabase guarda a senha com hash; você nunca a vê.
- **Magic link**: o usuário digita o e-mail e recebe um link que o autentica. Sem senha para esquecer, ótimo para clientes do escritório que entram uma vez por mês.

No app, o código gerado chama funções como `signInWithPassword` ou `signInWithOtp` e, dali em diante, cada requisição ao banco carrega a identidade do usuário. É essa identidade que a RLS usa.

## Row Level Security: por que é obrigatória

A chave anon fica no frontend, visível para qualquer um que abra o código da página. Se a tabela `clientes` não tiver proteção, qualquer pessoa pode usar essa chave para ler **todos** os clientes de **todos** os usuários. A RLS é a regra, escrita no próprio banco, que diz: "nesta tabela, cada linha só é visível para quem a criou".

```sql
alter table clientes enable row level security;

create policy "dono le os proprios clientes"
  on clientes for select
  using (auth.uid() = user_id);

create policy "dono insere os proprios clientes"
  on clientes for insert
  with check (auth.uid() = user_id);

create policy "dono altera os proprios clientes"
  on clientes for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "dono apaga os proprios clientes"
  on clientes for delete
  using (auth.uid() = user_id);
```

`auth.uid()` é o id do usuário logado. `using` filtra as linhas que já existem (quais posso ler, alterar ou apagar); `with check` valida a linha que entra (inserção ou resultado de uma alteração), garantindo que ninguém grave um registro em nome de outro. Por isso a política de `update` leva os dois. Como a regra mora no banco, nenhuma tela mal feita e nenhuma requisição manual consegue contorná-la.

Um detalhe que confunde iniciantes: com a RLS ativada, **tudo que não tem política é negado**. Se você esquecer a política de `update`, ninguém consegue editar — nem o dono. Isso não é um vazamento, é o app "não salvando"; o erro de segurança é o oposto: "resolver" o problema desativando a RLS ou criando uma política `using (true)`, que libera as linhas para todo mundo.

> **Atenção:** tabela sem RLS ativada no Supabase é pública para quem tiver a chave anon. O painel avisa; não ignore o aviso.

## Storage de arquivos

Contratos assinados, comprovantes e notas em PDF não vão em colunas de tabela: vão no **Storage**, organizados em *buckets* (pastas de nível superior). O banco guarda só o caminho do arquivo. Buckets também têm políticas de acesso; peça à IA um bucket privado com política de que cada usuário só lê os arquivos cujo caminho começa com o próprio id.

## Validar antes de gravar

O banco rejeita o que viola `not null` e `check`, mas a mensagem de erro é técnica. Por isso, o app valida antes, no backend, e devolve uma mensagem clara. Em Python (útil quando o backend é FastAPI ou um script de importação), a validação de um cliente fica assim:

```python
import re

def validar_cliente(dados):
    erros = []
    nome = (dados.get("nome") or "").strip()
    if not nome:
        erros.append("nome é obrigatório")
    cnpj = re.sub(r"\D", "", dados.get("cnpj") or "")
    if len(cnpj) != 14:
        erros.append("cnpj deve ter 14 dígitos")
    email = dados.get("email") or ""
    if email and "@" not in email:
        erros.append("email inválido")
    return erros

print(validar_cliente({"nome": "Padaria Central", "cnpj": "12.345.678/0001-90"}))
# []
print(validar_cliente({"nome": "", "cnpj": "123"}))
# ['nome é obrigatório', 'cnpj deve ter 14 dígitos']
```

A função devolve uma **lista de erros**; lista vazia significa dados bons. Esse padrão é simples de testar e fácil de a IA reproduzir em JavaScript para o frontend.

## Erros comuns

- Guardar dinheiro em `float`: use `numeric(12,2)`.
- Esquecer `user_id` em uma tabela e, por consequência, não conseguir escrever a política de RLS.
- Colocar a chave `service_role` no frontend "só para testar".
- Criar a tabela pelo chat da IA e nunca executar o SQL no painel — depois estranhar que "o app não salva".
- Testar sempre com um único usuário e nunca perceber que todos veem os dados de todos.

## Na prática

Um escritório que monta o portal de clientes cria, no mínimo, `clientes`, `contratos` e `faturas`, todas com `user_id` e RLS. O contador entra por e-mail e senha; o cliente, por magic link. Os PDFs ficam no Storage. Antes de cadastrar em lote a carteira, um script Python valida os CNPJs com a função acima e só então grava.

## Resumo

- Supabase = PostgreSQL + autenticação + storage + API pronta; chave anon no frontend, service_role nunca.
- Peça o SQL à IA com nomes, tipos, obrigatoriedade e regras; confira `not null`, `numeric`, `check`, `user_id`.
- Auth por e-mail/senha ou magic link; a identidade do usuário alimenta a RLS.
- RLS é a barreira real: sem ela, a chave pública lê tudo.
- Valide no backend antes de gravar e devolva mensagens claras.
