Nesta lição você vai aprender a receber pagamentos em um sistema no-code (Stripe, Mercado Pago e Pix), a estruturar planos e assinaturas, a publicar o sistema em um domínio próprio com HTTPS, a cuidar de termos de uso e LGPD, e a calcular o custo mensal real do que construiu. Isso importa porque publicar é o momento em que o sistema deixa de ser experimento e passa a envolver dinheiro, dados de terceiros e obrigações legais.

## Como um pagamento funciona em no-code

Você não processa pagamentos: um **provedor de pagamento** faz isso. O seu sistema cria a cobrança, manda o cliente para a tela do provedor (ou mostra o QR Code do Pix), e o provedor avisa seu sistema quando o pagamento foi confirmado. Esse aviso de volta se chama **webhook**: uma mensagem automática que o provedor envia para um endereço do seu sistema ou da sua ferramenta de automação.

| Provedor | Ponto forte | Observação |
|---|---|---|
| Stripe | Documentação excelente, integração pronta em vários construtores (Softr, Bubble e outros) | Suporte a Pix e boleto depende da configuração da conta no Brasil; consulte a documentação atual |
| Mercado Pago | Forte no Brasil: Pix, boleto, cartão, parcelamento | Integração em no-code costuma passar por automação ou link de pagamento |
| Pix pelo banco | Sem intermediário | Conciliação manual; em no-code, gere o Pix por um provedor |

A forma mais simples de começar, em qualquer provedor, é o **link de pagamento**: você cria a cobrança no painel do provedor, recebe um link e o coloca em um botão do app. Nenhuma integração técnica. A limitação é que a confirmação não volta sozinha ao seu banco de dados; para isso, o webhook ou a integração nativa do construtor.

## Planos e assinaturas

Para serviços recorrentes (honorários mensais, por exemplo), o provedor oferece **assinaturas**: você define o plano (nome, valor, periodicidade), o cliente assina uma vez e a cobrança se repete. O provedor cuida das tentativas de cobrança, dos avisos de cartão vencido e do cancelamento.

No seu sistema, o que importa guardar é o **estado da assinatura**: ativa, em atraso, cancelada. O webhook atualiza esse campo na tabela Clientes, e o portal pode mostrar um aviso ou restringir funções quando o estado é "em atraso". Não tente reproduzir a lógica de cobrança dentro do no-code; deixe o provedor fazer o que ele faz bem.

Teste sempre no **modo de teste** do provedor, que simula pagamentos com cartões fictícios documentados, antes de ativar o modo real.

## Publicar: domínio e SSL

Você já viu domínio e DNS na lição 4; aqui, o roteiro completo para colocar o app no ar:

1. **Revise o nome**: o app ficará em um subdomínio como `portal.meuescritorio.com.br`. Subdomínio não custa nada a mais; é um registro de DNS.
2. **No construtor**, abra as configurações de domínio personalizado e informe o subdomínio. A ferramenta mostra os registros DNS a criar (normalmente CNAME).
3. **No painel do registrador** (Registro.br ou outro), crie os registros exatamente como indicados.
4. **Aguarde** a propagação e a emissão automática do certificado **SSL/TLS**, que é o que habilita o HTTPS. Pode levar de minutos a algumas horas.
5. **Confira o cadeado** no navegador e teste o login, os filtros por cliente e o pagamento em modo de teste, agora no endereço final.
6. **Só então** ative o modo real do pagamento e envie o link aos clientes.

## Termos de uso, privacidade e LGPD

Ao publicar um portal que recebe documentos e dados pessoais, o escritório é **controlador** desses dados perante a Lei Geral de Proteção de Dados. O mínimo que o sistema precisa ter:

- **Política de privacidade** acessível: o que é coletado, para quê, por quanto tempo, com quem é compartilhado (o próprio provedor no-code e o de pagamento são "operadores" que tratam dados em seu nome).
- **Termos de uso**: regras do portal, responsabilidades, como encerrar a conta.
- **Aceite registrado**: uma caixa de seleção no cadastro, com a data do aceite guardada na tabela de usuários.
- **Caminho para exercer direitos**: um e-mail de contato para o titular pedir acesso, correção ou exclusão dos dados.
- **Minimização**: não colete o que não precisa; não guarde o que não usa.

Peça um rascunho à IA, mas revise com um profissional antes de publicar; a IA ajuda a estruturar, não substitui a avaliação jurídica:

```text
Escreva um rascunho de política de privacidade, em linguagem simples, para um portal
no-code de escritório contábil que coleta: nome, e-mail, CNPJ, documentos fiscais e
dados de pagamento (processados por [provedor]). Dados ficam hospedados em [ferramenta].
Estruture por seções (o que coletamos, finalidade, compartilhamento, retenção, direitos do
titular, contato). Marque com [REVISAR] os pontos que dependem de decisão do escritório.
```

## Custos mensais reais

Antes de lançar, some o que o sistema vai custar com o uso real, não com o plano grátis. Os itens que quase sempre aparecem:

| Item | O que verificar |
|---|---|
| Banco de dados | Limite de registros e de anexos do plano; quantos "editores" pagos |
| Construtor do app | Cobrança por usuário logado ou por app; limite de usuários externos |
| Automação | Número de execuções por mês; cada envio de formulário conta |
| Domínio | Taxa anual do registro |
| Provedor de pagamento | Percentual por transação mais valor fixo; tarifa de Pix |
| Serviços extras | E-mail transacional, assinatura eletrônica, armazenamento |

Os valores mudam; por isso esta lição não os cita. Monte uma planilha com o plano de cada ferramenta que você vai realmente precisar e revise a cada seis meses. Um portal que custa pouco com 10 clientes pode custar bem mais com 100; saber isso antes é parte do projeto.

## Erros comuns

- **Ativar o modo real antes de testar o webhook.** O cliente paga e o sistema não registra. Teste o ciclo inteiro em modo de teste.
- **Guardar dados de cartão.** Nunca. O provedor guarda; você guarda apenas o estado da assinatura e o identificador da transação.
- **Publicar sem política de privacidade.** Além da obrigação legal, clientes e provedores de pagamento exigem.

## Na prática

Um escritório passou a cobrar honorários por assinatura no provedor de pagamento, com o estado da assinatura espelhado no Airtable por webhook. O portal mostra um aviso amigável ao cliente em atraso, e a equipe parou de conferir extrato bancário para saber quem pagou. O custo mensal das ferramentas ficou abaixo do que o escritório gastava em horas de conciliação.

## Resumo

- O provedor processa o pagamento; seu sistema cria a cobrança e recebe o webhook de confirmação.
- Links de pagamento são o começo mais simples; assinaturas recorrentes ficam a cargo do provedor.
- Publicar: subdomínio, registros DNS, SSL automático, testes no endereço final, só depois modo real.
- LGPD: política de privacidade, termos, aceite registrado, canal para direitos do titular, minimização.
- Some os custos com o uso real de todas as ferramentas e revise periodicamente.
