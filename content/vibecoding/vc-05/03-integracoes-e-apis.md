Nesta lição você vai fazer o seu app conversar com o mundo de fora: consultar um CEP, validar um CNPJ, pegar uma cotação, receber avisos automáticos de outros sistemas (webhooks) e chamar um modelo de IA para resumir documentos. Vai aprender também onde guardar as chaves que dão acesso a esses serviços e como estimar o que isso custa. Isso importa porque um app isolado faz o usuário digitar o que outra máquina já sabe; um app integrado economiza horas e evita erro de digitação.

## O que é chamar uma API

Uma **API** (interface de programação) é um endereço na internet que responde a perguntas em formato padronizado — quase sempre **JSON**, que você já conhece. Em vez de uma página para humanos, ela devolve dados para programas. Chamar uma API é mandar uma requisição HTTP (GET para consultar, POST para enviar) e ler a resposta.

Exemplo real e gratuito: a API ViaCEP devolve o endereço de um CEP.

```text
GET https://viacep.com.br/ws/01001000/json/

{"cep": "01001-000", "logradouro": "Praça da Sé", "bairro": "Sé",
 "localidade": "São Paulo", "uf": "SP", ...}
```

(A resposta real traz mais campos, como `complemento`, `ibge` e `ddd`; para um CEP inexistente, ela devolve `{"erro": "true"}`.)

Para o seu app, você pede à IA:

```text
No formulário de cliente, quando o usuário digitar um CEP com 8 dígitos,
consulte https://viacep.com.br/ws/{cep}/json/ e preencha rua, bairro,
cidade e UF. Se a resposta tiver o campo "erro", mostre "CEP não encontrado".
Trate falha de rede com uma mensagem amigável e não trave o formulário.
```

Repare nos três cuidados que todo prompt de integração deve ter: **o que fazer com a resposta**, **o que fazer quando o dado não existe** e **o que fazer quando a rede falha**. A IA, sem isso, gera o caminho feliz e esquece os outros dois.

Outros exemplos comuns no escritório: APIs públicas de consulta de CNPJ (há várias, com limites de uso diferentes; consulte a documentação atual de cada uma), cotações de moedas (a API do Banco Central publica séries de dados) e serviços de envio de e-mail.

## Chaves e variáveis de ambiente

Muitas APIs exigem uma **chave** (uma sequência longa de letras e números que identifica a sua conta). Essa chave é como uma senha: quem a tiver gasta o seu saldo ou acessa seus dados. A regra é absoluta: **chave nunca vai no código**. Ela vai em uma **variável de ambiente**, um valor que o servidor conhece mas que não está em nenhum arquivo versionado.

Na prática:

1. Crie um arquivo `.env.local` na raiz do projeto com `NOME_DA_CHAVE=valor`.
2. Garanta que `.env*` está no `.gitignore` (a IA costuma fazer isso; confira).
3. No código, leia a variável (`process.env.NOME_DA_CHAVE` em Node, `os.environ["NOME_DA_CHAVE"]` em Python).
4. Na hospedagem (Vercel, por exemplo), cadastre a mesma variável no painel do projeto.

Há uma sutileza no Next.js: variáveis com prefixo `NEXT_PUBLIC_` são enviadas ao navegador. Use esse prefixo **só** para a URL do Supabase e a chave anon. Chaves de LLM, de e-mail, a `service_role` — nunca.

> **Atenção:** se uma chave vazar (foi parar no GitHub, apareceu num print), não basta apagar: **revogue** no painel do serviço e gere outra. Bots varrem repositórios públicos à procura de chaves em minutos.

## Webhooks: quando o outro sistema liga para você

Uma chamada de API é você perguntando. Um **webhook** é o inverso: você dá ao outro serviço um endereço do seu app, e ele avisa quando algo acontece — "o boleto foi pago", "o e-mail foi aberto", "o arquivo terminou de processar". Seu backend precisa ter uma rota que receba esse aviso (um POST com JSON) e faça algo, como marcar a fatura como paga.

Dois cuidados que a IA costuma pular se você não pedir: **verificar a assinatura** do webhook (a maioria dos serviços manda um código para provar que foi ele quem chamou) e **tolerar repetição** (o mesmo aviso pode chegar duas vezes; marcar como paga duas vezes não pode gerar dois recebimentos).

## Chamar um LLM a partir do app

O caso mais útil para um contador: o usuário anexa um contrato em PDF e o app gera um resumo. O fluxo é:

1. O frontend envia o arquivo para o backend.
2. O backend extrai o texto (uma biblioteca de leitura de PDF).
3. O backend monta um prompt com o texto e chama a API do provedor de IA (OpenAI, Anthropic, Google e outros oferecem APIs com formato semelhante).
4. O backend grava o resumo e devolve ao frontend.

O passo 3 **sempre** acontece no backend, porque é lá que vive a chave da API. Peça à IA:

```text
Crie uma rota de API no backend que receba o texto de um documento e
devolva um resumo em até 5 bullets, em português, usando a API do
[provedor]. A chave vem da variável de ambiente LLM_API_KEY. Limite o
texto a 20 mil caracteres (corte e avise se passar). Trate erro do
provedor devolvendo status 502 e mensagem clara. Não exponha a chave
nem o prompt ao frontend.
```

## Custos

APIs de IA cobram por **token** (pedaço de palavra; em português, uma palavra comum vale de 1 a 3 tokens), separando entrada (o que você manda) e saída (o que o modelo escreve). As tabelas de preço são expressas **por milhão de tokens**, e a saída costuma custar várias vezes mais que a entrada. Os preços mudam com frequência e variam muito entre modelos; consulte a tabela atual do provedor. O que importa é a conta mental:

```text
custo por chamada ≈ (tokens de entrada ÷ 1.000.000) × preço de entrada por milhão
                   + (tokens de saída ÷ 1.000.000) × preço de saída por milhão
custo mensal ≈ custo por chamada × chamadas por mês
```

Exemplo: 8.000 tokens de entrada e 500 de saída, com preços de 3 e 15 dólares por milhão, custam 0,024 + 0,0075 = cerca de 0,03 dólar por chamada.

Um contrato de 10 páginas tem algo em torno de 5 a 8 mil tokens de entrada. Resumir 200 contratos por mês com um modelo econômico custa, em geral, poucos reais; com o modelo mais caro do catálogo, pode custar dezenas de vezes mais. Boas práticas: usar o modelo mais barato que resolve, limitar o tamanho da entrada, guardar o resultado para não pedir o mesmo resumo duas vezes e definir um **limite de gasto** no painel do provedor.

APIs de dados públicos (CEP, CNPJ) costumam ser gratuitas com limite de requisições por minuto; serviços de e-mail têm planos gratuitos pequenos. Leia o limite antes de depender dele.

## Erros comuns

- Chamar a API de IA direto do frontend, expondo a chave.
- Commitar o `.env.local` no GitHub.
- Não tratar resposta vazia, erro 429 (limite atingido) ou 500 do serviço.
- Confiar cegamente no dado de uma API pública como se fosse oficial — valide o que importa.
- Reprocessar o mesmo documento a cada abertura de tela em vez de guardar o resultado.

## Na prática

No portal de honorários, o CEP preenche o endereço, a consulta de CNPJ confere a razão social no cadastro, um webhook do serviço de cobrança marca faturas pagas, e um botão "Resumir contrato" chama o LLM pelo backend. Tudo com chaves em variáveis de ambiente, limite de gasto definido e mensagens claras quando algo falha.

## Resumo

- API: endereço que responde dados em JSON; GET consulta, POST envia; trate sucesso, "não encontrado" e falha de rede.
- Chaves ficam em variáveis de ambiente, fora do Git, cadastradas também na hospedagem; `NEXT_PUBLIC_` só para o que pode ser público.
- Webhook é o serviço externo chamando o seu app; verifique a assinatura e tolere repetição.
- LLM é chamado sempre pelo backend; limite a entrada, guarde o resultado, defina teto de gasto.
- Custos: tokens de entrada e saída × volume mensal; consulte a tabela atual do provedor.
