Nesta lição você vai colocar o Gestão de Honorários no ar com **Vercel + Supabase**, ligar um domínio próprio, preparar a entrada dos primeiros usuários, escrever a documentação mínima e organizar o suporte. Vai também aplicar a **rubrica final** do módulo ao seu projeto. Isso importa porque um app bom que ninguém consegue acessar, entender ou pedir ajuda não entrega valor; e porque "publicar" é uma lista de passos verificáveis, não um salto de fé.

## Deploy na Vercel

A Vercel é a hospedagem feita pelos criadores do Next.js; ela lê o repositório do GitHub e publica a cada commit. Passos:

1. Entre na Vercel com a conta do GitHub e importe o repositório.
2. Na tela de configuração, cadastre as **variáveis de ambiente**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` e quaisquer chaves de servidor (LLM, e-mail). Copie do `.env.local`; nunca commit o arquivo.
3. Clique em Deploy. Em um ou dois minutos você recebe um endereço `.vercel.app`.
4. Abra o endereço e faça login. Se a tela de login aparecer mas o login falhar, o erro mais comum é variável de ambiente ausente ou com espaço no fim.

No Supabase, há um detalhe que a IA costuma esquecer: em **Authentication → URL Configuration**, cadastre o endereço da Vercel como *Site URL* e nas *Redirect URLs*. Sem isso, links de confirmação de e-mail e magic links apontam para `localhost`.

A partir daqui, cada `git push` na branch principal gera um deploy; cada branch secundária gera uma **pré-visualização** com endereço próprio, ideal para mostrar uma funcionalidade nova antes de liberar.

> **Dica:** mantenha dois projetos no Supabase — um de desenvolvimento, apontado pelo `.env.local`, e um de produção, apontado pelas variáveis da Vercel. Testar na base de produção é como treinar lançamento contábil no livro do cliente.

## Domínio próprio

`honorarios.vercel.app` funciona, mas `honorarios.seuescritorio.com.br` passa confiança. Se você já tem o domínio do escritório, crie um **subdomínio**:

1. Na Vercel, em *Domains*, adicione `honorarios.seuescritorio.com.br`.
2. A Vercel mostra o registro DNS a criar (em geral um `CNAME` apontando para o endereço que ela indica).
3. No painel do seu registrador (onde o domínio foi comprado), crie esse registro.
4. Aguarde a propagação (minutos a algumas horas). A Vercel emite o certificado HTTPS automaticamente.

Se não tem domínio, registre um pelo registro.br (para `.br`) ou por um registrador internacional; o custo anual é baixo. Evite comprar pelo mesmo serviço de hospedagem só por conveniência se isso dificultar mudar depois.

## Onboarding dos usuários

**Onboarding** é a primeira experiência da pessoa com o app. Para um sistema interno, o mínimo é:

- **Convite**: crie as contas (ou envie o link de cadastro) para a equipe e avise que o cadastro exige confirmação por e-mail.
- **Estado vazio útil**: a tela de clientes sem nenhum registro deve dizer "Nenhum cliente ainda. Clique em Novo cliente para começar", não ficar em branco. Peça à IA: *"adicione estados vazios com orientação em todas as listas"*.
- **Dados de exemplo opcionais**: um botão "carregar exemplo" ajuda a entender o app sem digitar; lembre de oferecer "apagar exemplos".
- **Primeira tarefa guiada**: um aviso no painel — "Passo 1: cadastre um cliente. Passo 2: crie um contrato. Passo 3: gere as faturas do mês" — que some quando as três coisas existem.

Se os usuários forem clientes do escritório (versão 2, com portal), o onboarding inclui um e-mail curto explicando o que eles vão ver e por quê.

## Documentação mínima

Três documentos, todos curtos, no próprio repositório:

```text
README.md
- O que o app faz (3 linhas) e para quem.
- Como rodar localmente: clonar, npm install, criar .env.local com as
  variáveis X e Y, npm run dev.
- Como fazer deploy: push na main; variáveis na Vercel.
- Onde está o banco: projeto Supabase "honorarios-prod"; schema em
  supabase/schema.sql.
- Como rodar os testes: npm test.

GUIA-DO-USUARIO.md
- Uma seção por tela, com o que ela faz e as regras (ex.: "fatura
  atrasada = aberta com vencimento passado").
- Perguntas frequentes: "gerei a competência duas vezes, duplicou?" (não).

DIVIDAS.md
- Pendências conhecidas e decisões adiadas, com data.
```

A IA escreve o rascunho dos três a partir do PRD e do código em um prompt; você revisa e corrige o que ela supôs. Documentação é o que permite que outra pessoa — ou você daqui a um ano — mexa no app sem medo.

## Suporte

Defina **um** canal (um e-mail, um grupo, um formulário dentro do app) e **um** prazo de resposta realista ("respondo em até 2 dias úteis"). Toda ocorrência vira uma linha em uma lista simples: data, quem, o que aconteceu, o que foi feito. Depois de um mês, essa lista mostra o que precisa melhorar mais do que qualquer opinião. Erros técnicos chegam pelo Sentry; dúvidas de uso chegam pelo canal; os dois alimentam o `DIVIDAS.md` e o PRD da versão 2.

## Próximos passos

Com o app publicado, as evoluções naturais, nesta ordem de valor para um escritório:

1. Lembrete automático por e-mail três dias antes do vencimento (serviço de e-mail + tarefa agendada).
2. Portal do cliente com magic link para ver e baixar as próprias faturas.
3. Importação da carteira atual por CSV, com validação linha a linha.
4. Resumo de contrato por IA no cadastro (o fluxo da lição de integrações).

Cada uma entra no PRD como entrega própria, com fluxo, casos de borda e critérios de aceite, e segue o mesmo ciclo: proposta, geração, teste, commit, deploy.

## Rubrica final do módulo

Avalie o seu Gestão de Honorários com esta rubrica. Cada item vale até 2 pontos (0 = ausente, 1 = parcial, 2 = completo). A meta é 16 de 20.

```text
1. Modelo de dados com tipos corretos, unique e check          __/2
2. RLS ativa com quatro políticas e teste com dois usuários     __/2
3. Login funcional, rotas protegidas, mensagens em português    __/2
4. CRUD de clientes e contratos com validação no servidor       __/2
5. Faturas: geração sem duplicar, atrasada calculada, pagamento __/2
6. Painel com números corretos e lista dos próximos 7 dias      __/2
7. CSV abre certo no Excel em português                         __/2
8. Testes automatizados rodando verdes                          __/2
9. Checklist de segurança completo; sem chave no repositório    __/2
10. Deploy na Vercel com domínio, README e guia do usuário      __/2
```

## Erros comuns

- Esquecer de cadastrar as variáveis na Vercel e achar que o deploy "quebrou o app".
- Não configurar a *Site URL* no Supabase e ter links de e-mail apontando para localhost.
- Publicar apontando para o banco de desenvolvimento cheio de dados de teste.
- Entregar sem estado vazio e sem guia: o usuário abre, não entende, desiste.
- Não definir canal de suporte e receber pedidos por três lugares diferentes.

## Na prática

Na segunda-feira, o contador importa o repositório na Vercel, cadastra as variáveis, aponta o subdomínio e configura as URLs no Supabase. Na terça, convida a equipe, que encontra telas com orientação e um guia de duas páginas. Na quinta, o primeiro chamado chega pelo formulário: "como cancelo uma fatura gerada errada?" — a resposta está no guia, e ele anota no `DIVIDAS.md` que o botão precisa ficar mais visível.

## Resumo

- Deploy: importar o repositório na Vercel, cadastrar variáveis, configurar *Site URL* e *Redirect URLs* no Supabase; dois projetos (dev e prod).
- Domínio próprio via CNAME no registrador; HTTPS automático.
- Onboarding: convite, estados vazios úteis, primeira tarefa guiada.
- Documentação mínima: README, guia do usuário, dívidas.
- Um canal de suporte, um prazo, uma lista de ocorrências; evoluções entram no PRD como entregas.
