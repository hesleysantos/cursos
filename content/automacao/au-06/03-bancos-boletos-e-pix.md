# Bancos, boletos e Pix

Nesta lição você vai entender como automatizar a parte bancária do escritório: ler extratos em **OFX** e CSV, o que são as **APIs bancárias** e o **Open Finance**, como funciona a geração e a conciliação de **boletos**, como a **API Pix** padronizada pelo Banco Central se integra e quais cuidados de segurança são obrigatórios quando dinheiro está envolvido. Ao final, você vai escrever um leitor de OFX com a biblioteca padrão.

## Extratos: OFX e CSV

Praticamente todo banco exporta o extrato em **OFX** (Open Financial Exchange), o formato que os sistemas contábeis importam para conciliação. É um arquivo de texto com um cabeçalho simples e, depois, uma estrutura parecida com XML, mas em geral **sem fechar as tags** (estilo SGML):

```
OFXHEADER:100
DATA:OFXSGML
VERSION:102
...
<OFX>
<BANKMSGSRSV1><STMTTRNRS><STMTRS>
<BANKACCTFROM><BANKID>0033<ACCTID>12345-6</BANKACCTFROM>
<BANKTRANLIST>
<STMTTRN>
<TRNTYPE>DEBIT
<DTPOSTED>20260905120000[-3:BRT]
<TRNAMT>-1250.00
<FITID>2026090500123
<MEMO>PIX ENVIADO FORNECEDOR ABC
</STMTTRN>
<STMTTRN>
<TRNTYPE>CREDIT
<DTPOSTED>20260906
<TRNAMT>3400.50
<FITID>2026090600456
<MEMO>TED RECEBIDA MERCADO LUA
</STMTTRN>
</BANKTRANLIST>
<LEDGERBAL><BALAMT>15230.75<DTASOF>20260930</LEDGERBAL>
</STMTRS></STMTTRNRS></BANKMSGSRSV1>
</OFX>
```

Cada `<STMTTRN>` é uma transação: tipo (`DEBIT`/`CREDIT`), data (`AAAAMMDD`, às vezes com hora e fuso), valor com sinal e ponto decimal, um identificador único (`FITID`, essencial para não importar duas vezes) e o histórico (`MEMO`). Como as tags não fecham, um parser XML falha; o caminho simples é expressão regular por bloco:

```python
import re

def ler_ofx(texto):
    transacoes = []
    for bloco in re.findall(r"<STMTTRN>(.*?)</STMTTRN>", texto, re.S):
        def campo(tag):
            m = re.search(rf"<{tag}>([^\r\n<]+)", bloco)
            return m.group(1).strip() if m else ""
        data = campo("DTPOSTED")[:8]
        transacoes.append({
            "tipo": campo("TRNTYPE"),
            "data": f"{data[:4]}-{data[4:6]}-{data[6:8]}",
            "valor": float(campo("TRNAMT")),
            "id": campo("FITID"),
            "historico": campo("MEMO"),
        })
    return transacoes

exemplo = """<STMTTRN>
<TRNTYPE>DEBIT
<DTPOSTED>20260905120000[-3:BRT]
<TRNAMT>-1250.00
<FITID>2026090500123
<MEMO>PIX ENVIADO FORNECEDOR ABC
</STMTTRN>"""
print(ler_ofx(exemplo))
# [{'tipo': 'DEBIT', 'data': '2026-09-05', 'valor': -1250.0, 'id': '2026090500123', 'historico': 'PIX ENVIADO FORNECEDOR ABC'}]
```

Alguns bancos geram OFX com codificação Latin-1 e acentos no `MEMO`; abra com `encoding="latin-1"` se o UTF-8 falhar. Alguns ainda fecham as tags (`<MEMO>...</MEMO>`); a regex acima lida com os dois casos porque para no `<` seguinte. O **CSV** do internet banking é mais variável (colunas, separador, formato de data) e não traz `FITID`; se precisar, crie um identificador com data, valor e histórico.

## APIs bancárias e Open Finance

Há duas vias para buscar dados do banco por programa:

- **APIs dos próprios bancos para PJ**: Banco do Brasil, Itaú, Bradesco, Santander, Sicoob, Inter e outros têm portais de desenvolvedores com APIs de extrato, boleto e Pix. O cadastro é feito pela empresa titular da conta; a autenticação costuma ser OAuth 2.0 (client credentials) e, em muitos casos, **mTLS** (certificado do cliente na conexão). Cada banco tem sua documentação e seus prazos de aprovação.
- **Open Finance Brasil**: o sistema regulado pelo Banco Central em que o **cliente consente** o compartilhamento dos seus dados entre instituições participantes. Um escritório não acessa o Open Finance diretamente: ele usa um **agregador** participante (há empresas que oferecem isso como serviço) ou o próprio banco. O fluxo é sempre: o cliente autoriza, com prazo e escopo, e pode revogar.

Para o escritório pequeno, a sequência realista é: OFX automatizado (o cliente exporta ou o escritório tem acesso de consulta) → API do banco onde o cliente tem volume → agregador quando são muitos bancos. Em todos os casos, o escritório precisa de **autorização formal** do cliente e de credenciais próprias, nunca a senha do internet banking do cliente.

## Boletos: geração e conciliação

Boletos seguem o padrão FEBRABAN. Para emitir e acompanhar, há dois mecanismos:

- **Arquivos CNAB** (240 ou 400 posições): o **arquivo remessa** leva os boletos a registrar ao banco, e o **arquivo retorno** devolve o que foi pago, com data e valor. São layouts posicionais, com variações por banco. Sistemas de cobrança e ERPs já os geram; o seu trabalho costuma ser processar o retorno.
- **APIs de cobrança** dos bancos: criar o boleto numa chamada HTTP (com registro imediato), consultar status e receber **webhook** de pagamento. Mais simples que CNAB quando o banco oferece.

A **conciliação** é o cruzamento: cada boleto emitido tem um "nosso número"; o retorno (ou o webhook) diz quais foram liquidados; o extrato mostra o crédito. Automação típica: ler retorno/webhook, marcar o título como pago no sistema, gerar lançamento contábil, e apontar divergências (pago a menor, pago em duplicidade, pago após vencimento com juros diferentes do esperado).

## Pix

O Banco Central padronizou a **API Pix**: as instituições (PSPs) que a oferecem para empresas seguem a mesma especificação (OpenAPI), publicada pelo Bacen. Os recursos principais são a **cobrança imediata** (`/cob`, com `txid` e QR Code), a **cobrança com vencimento** (`/cobv`), a consulta de Pix recebidos (`/pix`) e os **webhooks** de recebimento. A autenticação é OAuth 2.0 com **mTLS** obrigatório: o escritório ou o cliente gera um certificado, registra no PSP e todas as chamadas usam esse certificado.

Para um escritório, os usos mais comuns são: gerar cobranças com QR Code para os honorários e conciliar automaticamente pelo `txid` quando o webhook de pagamento chega; e, para clientes, ler os Pix recebidos por período para conciliação de vendas. O `txid` é a chave de conciliação: você define um identificador que ligue a cobrança ao cliente e ao mês.

```python
# Formato geral de uma cobranca Pix imediata (API Pix, padrao Bacen). A chamada real usa
# requests com cert=(cert.pem, chave.pem) e token OAuth; veja a documentacao do seu PSP.
import json
cobranca = {
    "calendario": {"expiracao": 86400},
    "devedor": {"cnpj": "11222333000181", "nome": "Padaria Sol Ltda"},
    "valor": {"original": "850.00"},
    "chave": "cobranca@escritorio.com.br",
    "solicitacaoPagador": "Honorarios 09/2026",
}
print(json.dumps(cobranca, ensure_ascii=False)[:80], "...")
```

## Segurança quando há dinheiro

- **Leitura separada de escrita**: credenciais de consulta de extrato não podem pagar nada. Pagamentos, se automatizados um dia, passam por aprovação humana dupla.
- **Certificados e tokens em cofre**, com rotação e permissão restrita; nunca em repositório, planilha ou e-mail.
- **Webhooks autenticados**: valide a assinatura ou a origem antes de aceitar "pagamento recebido"; um webhook falso pode marcar como pago o que não foi.
- **Trilha de auditoria** de toda chamada que crie cobrança ou leia dados financeiros.
- **LGPD**: extrato é dado pessoal e financeiro; minimize, restrinja acesso e defina retenção.

## Armadilhas

- **Importar o mesmo OFX duas vezes** sem usar o `FITID`.
- **Parsear OFX como XML**: as tags não fecham; use regex ou uma biblioteca específica (`ofxparse`).
- **Pedir a senha do internet banking do cliente**: além de inseguro, viola os termos do banco.
- **Confiar em webhook sem validar**.
- **Conciliar por valor apenas**: dois boletos de R$ 850,00 no mesmo dia se confundem; use nosso número ou `txid`.

## Na prática

Um escritório conciliava manualmente 40 extratos por mês. Hoje, os clientes enviam o OFX por um formulário (ou o escritório baixa pela API do banco onde há autorização); um script lê as transações, descarta as já importadas pelo `FITID`, classifica o histórico com IA (módulo 4) e sugere o lançamento; os boletos de honorários são emitidos pela API do banco e baixados pelo webhook de liquidação. Uma pessoa revisa as sugestões marcadas como incertas. O tempo de conciliação caiu de dias para horas.

## Resumo

- OFX é o formato universal de extrato: blocos `STMTTRN` com tipo, data, valor, `FITID` e histórico; leia com regex, não com parser XML.
- APIs bancárias para PJ usam OAuth 2.0 e, em geral, mTLS; o Open Finance exige consentimento do cliente e passa por participantes ou agregadores.
- Boletos: CNAB remessa/retorno ou API de cobrança; concilie por nosso número.
- Pix: API padronizada pelo Bacen (cob, cobv, pix, webhook) com mTLS; concilie pelo `txid`.
- Segurança: leitura separada de escrita, segredos em cofre, webhooks validados, auditoria e LGPD.
