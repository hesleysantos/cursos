Nesta lição você vai entender o que é uma API, como funciona o jogo de requisição e resposta, o que significam GET, POST e os códigos de status, para que serve uma chave de API e o que é um webhook. Ao final, vai ler em Python a resposta JSON de uma consulta de CEP. Isso importa porque APIs e webhooks são a "tomada" em que todas as automações se conectam.

## O que é uma API

**API** significa *Application Programming Interface*: a interface que um sistema oferece para que outros programas conversem com ele. Pense num **restaurante**. Você não entra na cozinha; faz o pedido ao garçom pelo cardápio, a cozinha prepara e ele traz o prato. A API é o garçom mais o cardápio: define o que você pode pedir e em que formato, e devolve o resultado sem que você precise saber como a cozinha funciona.

Quando você consulta um CEP num site, usa a tela. Quando a sua automação consulta o mesmo CEP, usa a API: pedido padronizado, resposta padronizada, sem tela.

## Requisição e resposta

Toda conversa com uma API tem duas partes:

1. **Requisição** (*request*): o que você envia. Tem um **endereço** (URL), um **método** (o verbo), opcionalmente **cabeçalhos** (quem pede, em que formato quer a resposta) e, às vezes, um **corpo** (os dados que você manda).
2. **Resposta** (*response*): o que volta. Tem um **código de status** (deu certo?), cabeçalhos e um **corpo**, quase sempre em JSON.

Exemplo real com o **ViaCEP**, um serviço gratuito brasileiro de consulta de CEP. A requisição é só uma URL:

```
GET https://viacep.com.br/ws/01001000/json/
```

E a resposta vem assim (campos resumidos; a lista completa está na documentação):

```json
{
  "cep": "01001-000",
  "logradouro": "Praça da Sé",
  "bairro": "Sé",
  "localidade": "São Paulo",
  "uf": "SP"
}
```

Você mandou um CEP; recebeu o endereço estruturado, pronto para preencher um cadastro.

## Métodos: GET e POST

O **método** diz o tipo de ação:

| Método | Significado | Exemplo |
|---|---|---|
| **GET** | Buscar informação, sem alterar nada | Consultar CEP, consultar CNPJ, listar boletos |
| **POST** | Enviar dados para criar algo ou executar uma ação | Criar um cliente, emitir um boleto, enviar uma mensagem |
| PUT / PATCH | Atualizar algo existente | Alterar o e-mail de um cliente |
| DELETE | Remover | Cancelar um agendamento |

Regra mental: GET é "me mostre"; POST é "faça isso".

## Códigos de status

A resposta sempre traz um número de três dígitos dizendo o que aconteceu:

| Código | Significado | O que fazer |
|---|---|---|
| **200** | OK, deu certo | Use a resposta |
| **201** | Criado | O POST funcionou, algo foi criado |
| **400** | Requisição malformada | Você mandou algo errado (campo faltando, formato inválido) |
| **401** | Não autorizado | Chave de API ausente ou inválida |
| **403** | Proibido | Chave válida, mas sem permissão para isso |
| **404** | Não encontrado | O recurso não existe (CNPJ inválido, por exemplo) |
| **429** | Muitas requisições | Você passou do limite; espere e tente de novo |
| **500** | Erro no servidor | Problema do lado deles; tente mais tarde |

Memorize a família: **2xx** sucesso, **4xx** erro seu, **5xx** erro deles. Toda automação séria verifica o código antes de usar a resposta.

## Chaves de API

Serviços públicos como ViaCEP e **BrasilAPI** (que, entre outras coisas, consulta dados cadastrais de CNPJ) não exigem identificação. Já a API do seu banco, do sistema contábil ou de uma plataforma de boletos exige uma **chave de API** (*API key*) ou um **token**: uma sequência longa de letras e números que funciona como senha da automação, enviada em geral num cabeçalho da requisição. Você aprenderá a cuidar dela na próxima lição; por ora, grave: **chave de API é senha, nunca se compartilha nem se publica**.

## Webhooks: a API ao contrário

Com uma API, você pergunta e o sistema responde. Mas e quando você quer ser avisado assim que algo acontece, como um boleto pago? Ficar perguntando a cada minuto ("já pagou?") desperdiça requisições.

O **webhook** inverte a direção: você cadastra uma URL sua no sistema de origem e diz "quando acontecer o evento X, mande os dados para cá". O sistema então faz um POST na sua URL no momento do evento. É a diferença entre ligar para a transportadora perguntando pela encomenda e receber um SMS quando ela sai para entrega.

```
Evento (boleto pago) -> sistema do banco faz POST -> https://sua-automacao.exemplo/webhook
```

Make e n8n geram essa URL para você; basta cadastrá-la no sistema de origem. Webhooks são a base dos fluxos em tempo real.

## Exemplos reais no Brasil

- **ViaCEP**: endereço a partir do CEP. Gratuito, sem chave.
- **BrasilAPI**: CNPJ, CEP, bancos, feriados nacionais, tabela FIPE e mais. Gratuito, sem chave, mantido pela comunidade.
- **APIs de bancos**: extrato, boletos e PIX (Banco do Brasil, Itaú, Inter, Sicoob e outros têm portais de desenvolvedor). Exigem cadastro, certificado e chaves.
- **Open Finance Brasil**: padrão regulado para compartilhar dados bancários com consentimento do cliente.
- **Sistemas contábeis e ERPs**: muitos oferecem API para clientes, notas e lançamentos.

## Lendo um JSON de resposta em Python

Em Python, a resposta JSON vira um dicionário com `json.loads`. O texto abaixo simula o que o ViaCEP devolveria (no navegador do curso não há acesso à rede):

```python
import json

resposta = '{"cep": "01001-000", "logradouro": "Praça da Sé", "bairro": "Sé", "localidade": "São Paulo", "uf": "SP"}'

dados = json.loads(resposta)
print(dados["localidade"])          # São Paulo
print(dados["uf"])                  # SP
print(f'{dados["logradouro"]}, {dados["bairro"]}')
```

Saída:

```
São Paulo
SP
Praça da Sé, Sé
```

Quando o campo pode não existir (para CEP inexistente, o ViaCEP devolve um objeto com o campo `erro` e sem endereço), use `dados.get("localidade")`, que devolve `None` em vez de erro.

## Erros comuns

- Usar a resposta sem conferir o código de status.
- Colocar a chave de API na URL, onde fica visível em logs.
- Confundir webhook com API: webhook é o sistema chamando você; API é você chamando o sistema.
- Ignorar o 429 e insistir, o que pode levar a bloqueio.
- Supor que o JSON nunca muda; trate campos ausentes.

## Na prática

Abra no navegador `https://viacep.com.br/ws/SEU-CEP/json/` (troque pelo seu CEP, só números) e veja o JSON cru. Depois faça o mesmo com a BrasilAPI para um CNPJ. O hábito de "olhar a resposta crua" poupa horas quando um fluxo falha: o problema quase sempre está num campo com nome diferente do que você imaginava.

## Resumo

- API é o garçom com cardápio: define o que pedir e devolve o resultado em formato padronizado.
- Requisição = URL + método + cabeçalhos (+ corpo); resposta = status + corpo (JSON).
- GET consulta; POST cria ou executa. 2xx sucesso, 4xx erro seu, 5xx erro deles.
- Chave de API é senha. ViaCEP e BrasilAPI dispensam chave; bancos e ERPs exigem.
- Webhook é o sistema avisando você (POST na sua URL) quando algo acontece.
