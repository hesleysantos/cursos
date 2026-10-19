Nesta lição você vai entender como enviar mensagens a clientes a partir de um fluxo: o que é a API oficial do WhatsApp Business (Meta e provedores), por que soluções não oficiais podem levar a banimento, como bots de Telegram, SMS e e-mail transacional se encaixam, e como montar o envio de lembretes de obrigações. Isso importa porque o WhatsApp é o canal em que o cliente do escritório realmente lê, e usá-lo errado pode custar o número do escritório.

## O cenário do WhatsApp em 2026

Há duas maneiras de um sistema enviar mensagens pelo WhatsApp:

| | **API oficial (WhatsApp Business Platform)** | **Soluções não oficiais** |
|---|---|---|
| Como funciona | API da Meta, acessada direto ou por um provedor homologado (BSP) | Automatizam o WhatsApp Web ou o app, simulando uma pessoa |
| Custo | Por mensagem enviada com template, conforme categoria e país (o modelo de cobrança já mudou mais de uma vez; consulte a Meta) | Em geral mais barato ou gratuito |
| Risco | Baixo, se seguir as regras | **Alto: banimento do número** sem aviso, perda de histórico |
| Modelos de mensagem | Mensagens ativas precisam de **templates** aprovados pela Meta | Sem aprovação, qualquer texto |
| Estabilidade | Alta | Quebra a cada atualização do WhatsApp |
| Termos de uso | Dentro dos termos | **Viola os termos** do WhatsApp |

**BSP** (*Business Solution Provider*) é uma empresa parceira da Meta que revende o acesso à API com painel, suporte e cobrança em reais; há vários no Brasil. Muitas ferramentas de fluxo têm conectores para a API oficial e para os principais BSPs.

> **Atenção:** um escritório que usa solução não oficial no número principal corre o risco de acordar com o número banido, sem acesso às conversas com centenas de clientes. Se insistir em testar, use um número descartável e nunca o principal.

## Como funciona a API oficial

1. O escritório cria uma conta no **Gerenciador de Negócios da Meta**, verifica a empresa e registra um número de telefone (que não pode estar em uso no app comum).
2. Para enviar uma mensagem **ativa** (iniciada pela empresa), é preciso usar um **template**: um modelo com variáveis, submetido e aprovado pela Meta. Exemplo: "Olá {{1}}, a guia do {{2}} referente a {{3}} vence em {{4}}. O arquivo está na sua pasta." As variáveis são preenchidas pelo fluxo.
3. Quando o cliente responde, abre-se uma **janela de atendimento** (um período, em geral 24 horas) em que a empresa pode enviar mensagens livres.
4. O envio é um POST na API com o número de destino, o nome do template e as variáveis. No fluxo, isso é um módulo do conector ou um módulo HTTP com Bearer token.
5. **Opt-in**: o cliente precisa ter concordado em receber mensagens. Inclua uma cláusula no contrato ou um aceite no formulário de cadastro, e registre-o.

Os detalhes de categorias de template, preços e janelas mudam; consulte a documentação atual da Meta ou do BSP.

## Telegram: o bot mais fácil de começar

O **Telegram** tem uma API de bots gratuita e aberta: você cria um bot com o BotFather (dentro do próprio Telegram), recebe um token e pronto. Ferramentas de fluxo têm conectores nativos. Limitação: o cliente precisa iniciar a conversa com o bot (ou estar num grupo com ele). Por isso o Telegram é ideal para **alertas internos** (falhas de fluxo, resumo diário para a equipe) e menos para clientes, que no Brasil estão no WhatsApp.

## SMS

Serviços de SMS (vários provedores nacionais e internacionais) enviam por API, cobrando por mensagem. Vantagem: chega em qualquer celular, sem app nem opt-in técnico. Desvantagens: custo por unidade, limite de caracteres, sem anexo, e muita gente ignora SMS. Uso razoável: código de confirmação e lembrete curto de vencimento como canal reserva.

## E-mail transacional

**E-mail transacional** é o e-mail disparado por um sistema, um por evento (confirmação, lembrete, guia em anexo), diferente de e-mail de marketing em massa. Para poucos envios por dia, o Gmail ou o Outlook da conta de automação bastam. Para volume maior ou para garantir entrega, use um serviço de e-mail transacional por API (há vários; os conectores existem nas ferramentas). Em qualquer caso, configure a autenticação do domínio (SPF, DKIM, DMARC) com quem cuida do DNS do escritório, senão as mensagens caem em spam.

## Escolhendo o canal

| Situação | Canal |
|---|---|
| Lembrete de vencimento com arquivo | E-mail (anexo) + WhatsApp oficial (aviso curto com link) |
| Alerta interno de falha no fluxo | Telegram ou e-mail |
| Confirmação de recebimento de formulário | E-mail |
| Cliente que só responde no WhatsApp | WhatsApp oficial, com opt-in |
| Canal de contingência | SMS |

## Lembretes de obrigações aos clientes: o fluxo

```
[Agendamento: dia útil, 9h, 3 dias antes do vencimento]
   -> [Sheets: buscar obrigações do mês com status "pendente"]
   -> [Iterador]
   -> [Sheets: buscar cliente pelo CNPJ (canal, opt-in, telefone, e-mail)]
   -> [Roteador]
        canal = whatsapp E opt_in = sim -> [WhatsApp API: template "lembrete_guia" com nome, tributo, competência, vencimento]
        canal = email                   -> [Gmail: e-mail com PDF em anexo]
        senão                           -> [Log: "sem canal válido"] -> [Alerta ao responsável]
   -> [Sheets: log com data, CNPJ, canal, "lembrete enviado"]
```

Pontos de atenção: respeitar a janela comercial; não enviar duas vezes (verifique o log antes); texto curto e com o essencial (tributo, competência, valor se possível, vencimento, onde está o arquivo); e um caminho para o cliente responder a uma pessoa.

## LGPD e boas maneiras

Mensagens contêm dados pessoais (nome, telefone) e, às vezes, financeiros (valor da guia). Envie só o necessário, com base no contrato, e registre o opt-in. Ofereça saída ("responda SAIR para não receber lembretes"). Nunca envie dados sensíveis (senha, dados bancários completos) por mensagem.

## Erros comuns

- Usar automação não oficial no número principal do escritório.
- Enviar mensagem ativa sem template aprovado e receber erro da API.
- Esquecer o opt-in e receber reclamações, ou bloqueios por denúncia.
- Disparar fora do horário comercial.
- E-mail sem SPF/DKIM/DMARC indo para spam.
- Colocar o valor da guia e dados bancários numa mensagem que o cliente encaminha para terceiros.

## Na prática

Comece pelo Telegram para alertas internos (meia hora de trabalho). Depois monte os lembretes por e-mail. Só então avalie a API oficial do WhatsApp com um BSP, calculando o custo por mensagem versus o ganho (lição 3 do módulo anterior). Com templates aprovados e opt-in registrado, migre os clientes aos poucos.

## Resumo

- WhatsApp: use a API oficial (Meta ou BSP); soluções não oficiais arriscam o número.
- Mensagens ativas exigem template aprovado e opt-in; respostas abrem janela de atendimento.
- Telegram: bot gratuito, ótimo para alertas internos. SMS: canal reserva. E-mail transacional: confirmações e anexos, com SPF/DKIM/DMARC.
- Lembretes: agendamento em dia útil, roteador por canal, log antes e depois, caminho para falar com uma pessoa.
- LGPD: só o necessário, opt-in registrado, opção de sair.
