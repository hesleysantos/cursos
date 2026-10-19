Nesta lição você vai ver o e-mail por dentro: os protocolos que enviam e recebem mensagens, os cabeçalhos escondidos atrás do "De:", por que é tão fácil falsificar um remetente e como SPF, DKIM e DMARC impedem que o domínio do escritório seja usado em golpes contra os seus clientes. Ao final, vai verificar o domínio do escritório com ferramentas gratuitas. Importa porque o e-mail é o canal número um do phishing e um domínio sem proteção é um presente para quem quer se passar por você.

## Como um e-mail viaja

Quando você clica em Enviar, o programa de e-mail entrega a mensagem ao servidor do seu provedor usando o **SMTP** (*Simple Mail Transfer Protocol*), na porta 587, com usuário e senha. Esse servidor consulta o DNS para descobrir o registro **MX** do domínio de destino (quem recebe e-mail para `cliente.com.br`) e entrega a mensagem ao servidor de lá, também por SMTP, na porta 25.

Para ler, o programa do destinatário usa o **IMAP** (porta 993, com criptografia), que mantém as mensagens no servidor e sincroniza todos os aparelhos, ou o antigo **POP3**, que baixa e apaga. Nos Correios, SMTP é o carteiro entre agências; IMAP é você abrindo a caixa. E o envelope tem dois remetentes: o escrito na carta e o que o carteiro viu.

## Os cabeçalhos

O que você vê no programa de e-mail ("De", "Para", "Assunto") é um resumo. A mensagem completa tem dezenas de **cabeçalhos**, e qualquer programa permite exibi-los (no Gmail, "Mostrar original"; no Outlook, Propriedades, "Cabeçalhos da internet"). Um trecho:

```
Return-Path: <bounce@mailer-xyz.ru>
Received: from mailer-xyz.ru (185.220.101.7) by mx.google.com; Tue, 12 May 2026 09:14:22 -0300
From: "Receita Federal" <atendimento@receita.fazenda.gov.br>
To: contato@escritorio.com.br
Subject: Irregularidade no CNPJ
Authentication-Results: mx.google.com; spf=fail; dkim=none; dmarc=fail
```

Leitura de cima para baixo:

- **Return-Path** é o endereço para onde voltam as mensagens que falham: o remetente real do envelope.
- **Received** são carimbos que cada servidor acrescenta no caminho, com IP e horário; o de baixo é o primeiro. Aqui, a mensagem saiu de `mailer-xyz.ru`, não de servidor algum do governo.
- **From** é o que aparece na tela. É texto livre: quem envia escreve o que quiser.
- **Authentication-Results** é o veredito do servidor receptor sobre os mecanismos que veremos a seguir. `spf=fail` diz que o servidor `185.220.101.7` não está autorizado a enviar pelo domínio do envelope; `dkim=none` diz que não há assinatura; `dmarc=fail` diz que nada confirmou o domínio do From. Resumo: a mensagem não veio de onde diz.

## Por que o spoofing é fácil

**Spoofing** é falsificar o remetente. O SMTP foi criado em 1982, quando a internet era um clube de universidades, e não verifica nada: o campo `From` é preenchido por quem envia, como o remetente escrito à mão num envelope. Um atacante pode mandar `From: socio@escritorio.com.br` a um cliente pedindo a troca de conta bancária, e o programa do cliente mostrará "Sócio" como remetente. A defesa não está no SMTP, mas em registros publicados no DNS do domínio, que os servidores receptores consultam.

## SPF, DKIM e DMARC

Cada um responde a uma pergunta:

| Mecanismo | Pergunta que responde | Como funciona |
|---|---|---|
| **SPF** | Este servidor pode enviar e-mail em nome deste domínio? | Um registro TXT no DNS lista os servidores autorizados (o do Google, o do Microsoft 365, o do sistema de boletos) |
| **DKIM** | Esta mensagem foi alterada no caminho e saiu mesmo do domínio? | O servidor de envio assina a mensagem com uma chave privada; a chave pública fica num registro TXT no DNS |
| **DMARC** | O que fazer quando SPF ou DKIM falham, e para quem avisar? | Um registro TXT define a política (`none`, `quarantine` ou `reject`) e um e-mail para receber relatórios |

Na analogia: SPF é a lista de carteiros autorizados a sair da sua agência; DKIM é o lacre com a sua assinatura no envelope; DMARC é a instrução "se o carteiro não é da lista ou o lacre está rompido, devolva, e me avise".

Um domínio com os três configurados e DMARC em `reject` faz Gmail, Outlook e a maioria dos provedores recusarem mensagens falsas em seu nome. Um domínio só com SPF, ou com DMARC em `none`, continua falsificável: `none` apenas pede relatórios, não bloqueia nada. Desde 2024, Google e Yahoo exigem SPF, DKIM e DMARC de quem envia e-mail em volume.

## Verificando o domínio do escritório

Você pode consultar os registros com o `nslookup`:

```powershell
nslookup -type=TXT escritorio.com.br
```

```
Não é resposta autoritativa:
Servidor:  UnKnown
Address:  192.168.0.1

escritorio.com.br       text =

        "v=spf1 include:_spf.google.com ~all"
```

```powershell
nslookup -type=TXT _dmarc.escritorio.com.br
```

```
Não é resposta autoritativa:
Servidor:  UnKnown
Address:  192.168.0.1

_dmarc.escritorio.com.br        text =

        "v=DMARC1; p=reject; rua=mailto:dmarc@escritorio.com.br"
```

Lendo: as três primeiras linhas só dizem que quem respondeu foi o resolvedor da rede (o roteador, sem nome registrado, por isso "UnKnown"). Um domínio pode ter vários registros TXT (verificações de domínio de outros serviços, por exemplo); o SPF é o que começa com `v=spf1`. Ele autoriza os servidores do Google e marca os demais como suspeitos (`~all`; `-all` seria rejeitar). O DMARC está em `reject` e envia relatórios para `dmarc@escritorio.com.br`. Se o segundo comando responder "Non-existent domain", o domínio não tem DMARC.

Mais fácil que o `nslookup` são as ferramentas gratuitas na web: o **MXToolbox** (`mxtoolbox.com`, com verificações de SPF, DKIM, DMARC e listas negras), o **Google Admin Toolbox Check MX** e os verificadores do **dmarcian**. Quem configura os registros é quem administra o DNS do domínio (registrador ou hospedagem), seguindo a documentação do Workspace ou do 365.

## Erros comuns

- **Confiar no nome exibido.** "Receita Federal" entre aspas é texto; o endereço entre `< >` e os cabeçalhos `Received` são o que vale.
- **Configurar o SPF e esquecer o sistema de boletos.** Os e-mails dele caem em spam; a reação comum é afrouxar o SPF para `+all`, o que anula tudo.
- **DMARC em `none` para sempre.** É modo de observação; depois de alguns relatórios limpos, suba para `quarantine` e `reject`.
- **Achar que SPF/DKIM/DMARC protegem você de receber phishing.** Eles protegem o seu domínio de ser falsificado; os cuidados do módulo anterior continuam valendo.

## Na prática

Rode as duas consultas acima para o domínio do escritório e abra o MXToolbox. Anote o que falta. Depois, pegue um phishing real da caixa de spam, exiba os cabeçalhos e identifique Return-Path, o primeiro Received e a linha Authentication-Results: é a mesma análise que um analista faz. Por fim, ative no Workspace ou no 365 o aviso em mensagens externas ("Este e-mail veio de fora da organização"): é barato e reduz muito o golpe do falso sócio.

> **Dica:** os relatórios do DMARC (`rua=`) chegam em XML; serviços como o dmarcian os transformam em gráficos legíveis (o plano gratuito do dmarcian é só para uso pessoal; para o domínio do escritório há teste gratuito e planos pagos, e o MXToolbox também oferece leitura de relatórios).

## Resumo

- SMTP envia (porta 587 do cliente ao servidor, 25 entre servidores); IMAP lê (993) mantendo as mensagens no servidor; o registro MX do DNS diz quem recebe.
- Cabeçalhos escondidos (Return-Path, Received, Authentication-Results) mostram o caminho real; o campo From é texto livre e por isso o spoofing é trivial.
- SPF lista servidores autorizados; DKIM assina a mensagem; DMARC define a política (none, quarantine, reject) e os relatórios.
- Só com DMARC em `quarantine` ou `reject` o domínio fica protegido contra falsificação; `none` apenas observa.
- Verifique o domínio com `nslookup -type=TXT` ou MXToolbox e peça ao administrador do DNS os registros que faltarem.
