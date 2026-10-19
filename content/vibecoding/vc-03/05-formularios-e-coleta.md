Nesta lição você vai aprender a coletar informação de forma confiável com formulários no-code (Tally, Typeform e Google Forms), configurar validações, uploads e assinaturas, e ligar o formulário ao banco de dados e a uma notificação usando uma ferramenta de automação. Isso importa porque a maior parte do retrabalho em um escritório começa com dado mal coletado: o cliente manda o documento errado, esquece um campo, envia pelo WhatsApp e ninguém registra.

## O formulário é a porta de entrada dos dados

Lembre da anatomia: dados, telas, lógica, integrações. O formulário é a tela mais importante, porque é por ela que a informação entra. Um formulário bem feito faz três coisas: pede só o necessário, impede o preenchimento errado e entrega o resultado no lugar certo sem que alguém precise copiar à mão.

## As três ferramentas

| Ferramenta | Ponto forte | Quando usar |
|---|---|---|
| Google Forms | Gratuito, respostas caem direto numa planilha do Google | Pesquisas internas, coleta simples |
| Tally | Aparência limpa, lógica condicional, muitas integrações, plano gratuito generoso | Formulários para clientes com uploads e integrações |
| Typeform | Uma pergunta por vez, experiência agradável | Pesquisas de satisfação e captação de contatos |

Além deles, o Airtable e o Softr geram formulários direto das tabelas: o campo do formulário já é o campo da tabela, sem automação no meio. Para coletas que alimentam uma base no-code, essa costuma ser a opção mais simples. Use Tally ou Typeform quando quiser mais controle visual ou quando o formulário precisa existir fora da base.

## Validação: impedir o erro na origem

**Validação** é a regra que o formulário aplica antes de aceitar a resposta. As principais:

- **Obrigatório**: não envia sem preencher.
- **Tipo**: campo de e-mail exige "@"; campo de número não aceita letras; campo de data abre calendário.
- **Formato**: CNPJ com 14 dígitos, CEP com 8. Algumas ferramentas aceitam uma **expressão regular** (um padrão de texto) para isso; se a sua não aceitar, use um campo de texto com tamanho mínimo e máximo de 14 caracteres e confira depois. Não use campo de número para CNPJ: ele apaga os zeros à esquerda e pode formatar o valor como quantia.
- **Intervalo**: valor entre 0 e 100.000; data não anterior a hoje.
- **Lógica condicional**: a pergunta "quantos funcionários?" só aparece se a resposta a "tem funcionários?" for sim.

Validação boa reduz drasticamente o trabalho de conferência. Validação demais afasta o cliente: peça só o que o processo precisa.

## Uploads e assinaturas

Para **upload** de arquivos (notas, extratos, contratos), configure:

- Tipos aceitos (PDF, imagem, XML) e tamanho máximo.
- Onde o arquivo vai parar: na própria ferramenta, numa pasta do Google Drive ou como anexo na tabela do Airtable. Decida antes; mudar depois dá trabalho.
- Nome do arquivo: muitas ferramentas permitem renomear com o nome do cliente e a data na automação. Isso evita a pasta cheia de "documento (3).pdf".

Para **assinatura**, há duas situações. Um campo de assinatura desenhada à mão no formulário (Tally e outros oferecem) serve para aceites simples, como autorização para enviar e-mail. Para contratos de honorários ou documentos com valor jurídico, use um serviço de assinatura eletrônica reconhecido e ligue o formulário a ele por automação; o formulário coleta os dados, o serviço cuida da assinatura.

> **Atenção:** documentos recebidos contêm dados pessoais e financeiros de terceiros. Configure quem pode ver as respostas, apague o que não precisa guardar e lembre-se do que aprendeu sobre privacidade no módulo 1. A LGPD volta na lição 7.

## Ligar formulário → banco → notificação

Aqui entra a **automação**: uma ferramenta que fica "ouvindo" um evento (nova resposta no formulário) e executa ações (criar linha no banco, enviar e-mail). As três mais usadas são **Make**, **Zapier** e **n8n**. O n8n pode ser hospedado por você; Make e Zapier são serviços prontos. O curso de Automação aprofunda cada uma; aqui você vai montar um fluxo de três passos para entender o conceito.

Todo fluxo tem a mesma forma: **gatilho** (o que dispara) → **ações** (o que fazer) → **mapeamento** (qual campo do formulário vai para qual campo do banco).

### Passo a passo: recebimento de documento

1. **Crie o formulário** no Tally: nome da empresa (obrigatório), CNPJ (texto, exatamente 14 caracteres), competência (data), tipo de documento (seleção: extrato, notas, folha, outro), arquivo (upload PDF/XML, até 10 MB), observações (texto, opcional).
2. **Prepare a tabela** Documentos no Airtable com campos equivalentes, mais "Situação" (seleção: recebido, conferido, lançado) e "Cliente" (vínculo).
3. **Crie o cenário** na ferramenta de automação: gatilho "nova resposta no formulário Tally".
4. **Adicione a ação** "criar registro no Airtable" e, dentro dela, faça o mapeamento campo a campo. Deixe "Situação" fixa em "recebido". O campo "Cliente" é um vínculo, e um vínculo precisa apontar para uma linha existente: ou a automação localiza o cliente pelo CNPJ com um passo de busca antes de criar o registro, ou o campo fica em branco para a equipe preencher na conferência. Comece pela segunda opção; a busca pode vir depois.
5. **Adicione a notificação**: e-mail para o analista responsável com o nome da empresa, o tipo e o link do registro. Se preferir, uma mensagem em um canal da equipe.
6. **Teste** com uma resposta real; confira que o registro apareceu com o arquivo anexado e que o e-mail chegou. Teste também um erro: envie sem arquivo e veja se a validação segurou.
7. **Ative** o cenário e monitore os primeiros dias; automação que falha em silêncio é pior que nenhuma.

Se o mapeamento confundir, descreva o problema para a IA:

```text
Estou ligando um formulário Tally a uma tabela do Airtable com o Make. O campo "competência"
do formulário é uma data, mas no Airtable está chegando vazio. Liste as causas mais prováveis
(formato de data, campo mapeado errado, tipo do campo no Airtable) e como testar cada uma,
em ordem do mais comum para o mais raro.
```

## Erros comuns

- **Formulário longo demais.** Cada campo a mais reduz a taxa de resposta. Peça o mínimo e complete depois.
- **Texto livre onde cabia seleção.** Já vimos na lição 2; aqui o estrago começa.
- **Não testar o caminho do erro.** Envie um arquivo grande demais, um CNPJ com 13 dígitos, um e-mail sem "@". O formulário deve recusar com mensagem clara.
- **Automação sem aviso de falha.** Configure notificação de erro na ferramenta de automação, ou você só descobrirá o problema quando o cliente reclamar.

## Na prática

Um escritório substituiu "mande os extratos por WhatsApp" por um formulário com upload e competência obrigatória. Cada envio cria um registro, anexa o arquivo e avisa o analista. No fechamento do mês, a lista de quem ainda não enviou sai de um filtro, não de uma conferência manual de conversas.

## Resumo

- O formulário é a porta de entrada dos dados; validação impede o erro na origem.
- Google Forms, Tally e Typeform cobrem coletas simples a profissionais; Airtable e Softr geram formulários direto da tabela.
- Uploads precisam de tipo, tamanho e destino definidos; assinaturas jurídicas pedem serviço próprio.
- Automação = gatilho → ações → mapeamento; Make, Zapier e n8n fazem isso.
- Teste o caminho do erro e configure aviso de falha.
