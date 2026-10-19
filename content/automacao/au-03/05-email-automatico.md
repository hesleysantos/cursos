Nesta lição você vai enviar e-mails com anexo a partir de um script (`smtplib` + `email`), ler a caixa de entrada e baixar anexos (`imaplib`), configurar o Gmail com senha de app e montar o corpo da mensagem a partir de dados, com templates. Isso importa porque o e-mail é a porta de entrada e de saída do escritório: notas chegam por ele, guias saem por ele. Automatizar as duas direções fecha o ciclo dos robôs das lições anteriores.

## Como o e-mail funciona por trás

Dois protocolos: **SMTP** envia; **IMAP** lê. Cada provedor tem um servidor para cada um, com porta e segurança próprias. Os valores do Gmail são `smtp.gmail.com` na porta 465 (SSL) ou 587 (STARTTLS), e `imap.gmail.com` na porta 993. Microsoft 365 usa `smtp.office365.com` (587) e `outlook.office365.com` (993). Provedores de hospedagem informam os seus no painel.

## Autenticação: senha de app e OAuth

Gmail e Microsoft não aceitam mais a senha comum da conta em scripts. As opções:

1. **Senha de app** (Gmail): ative a verificação em duas etapas na conta Google, depois em *Segurança > Senhas de app* gere uma senha de 16 letras só para o robô. Ela vai para o `.env`, nunca para o código. Se um dia vazar, você revoga só ela.
2. **OAuth 2.0**: o script pede autorização uma vez pelo navegador e guarda um token renovável. É o caminho obrigatório no Microsoft 365 (que desligou a autenticação por senha no IMAP e anunciou o fim dela no SMTP; confira o cronograma vigente na documentação da Microsoft) e nas contas Google Workspace em que o administrador desativou as senhas de app. Exige registrar um "aplicativo" no console do provedor e usar a biblioteca oficial (Gmail API ou Microsoft Graph). Mais trabalho de configuração, mais seguro.

Para começar, use senha de app numa conta dedicada do escritório (`robo@escritorio.com.br`), não na conta pessoal.

## Enviar com anexo

```python
import os
import smtplib
from email.message import EmailMessage
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()
USUARIO = os.getenv("EMAIL_USUARIO")
SENHA = os.getenv("EMAIL_SENHA_APP")

def enviar(destinatario, assunto, corpo, anexos=()):
    msg = EmailMessage()
    msg["From"] = USUARIO
    msg["To"] = destinatario
    msg["Subject"] = assunto
    msg.set_content(corpo)                       # versão em texto simples
    for caminho in anexos:
        caminho = Path(caminho)
        msg.add_attachment(caminho.read_bytes(), maintype="application",
                           subtype="pdf", filename=caminho.name)
    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as servidor:
        servidor.login(USUARIO, SENHA)
        servidor.send_message(msg)

# enviar("cliente@padaria.com.br", "Guias 03/2026", "Segue em anexo.", ["guias_2026-03.pdf"])
```

`EmailMessage` monta a mensagem; `set_content` define o corpo; `add_attachment` anexa bytes com o tipo (`application/pdf` para PDF, `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` para `.xlsx`, ou simplesmente `application/octet-stream` para qualquer arquivo). `SMTP_SSL` abre a conexão segura e o `with` garante que ela feche. Para a porta 587 troque por `smtplib.SMTP("smtp.gmail.com", 587)` seguido de `servidor.starttls()` antes do `login`.

Para enviar HTML além do texto simples, chame `msg.add_alternative(html, subtype="html")` depois do `set_content`: clientes de e-mail mostram o HTML e caem para o texto se não conseguirem.

## Ler a caixa e baixar anexos

```python
import imaplib, email, os
from email.header import decode_header
from pathlib import Path

def texto_cabecalho(valor):
    partes = decode_header(valor or "")
    return "".join(p.decode(enc or "utf-8", errors="replace") if isinstance(p, bytes) else p
                   for p, enc in partes)

def baixar_anexos(pasta_destino, filtro='(UNSEEN SUBJECT "NF")'):
    pasta_destino = Path(pasta_destino)
    pasta_destino.mkdir(exist_ok=True)
    with imaplib.IMAP4_SSL("imap.gmail.com", 993) as caixa:
        caixa.login(os.getenv("EMAIL_USUARIO"), os.getenv("EMAIL_SENHA_APP"))
        caixa.select("INBOX")
        _, resultado = caixa.search(None, filtro)
        for numero in resultado[0].split():
            _, dados = caixa.fetch(numero, "(RFC822)")
            msg = email.message_from_bytes(dados[0][1])
            assunto = texto_cabecalho(msg["Subject"])
            for parte in msg.walk():
                if parte.get_content_disposition() == "attachment":
                    nome = texto_cabecalho(parte.get_filename())
                    (pasta_destino / nome).write_bytes(parte.get_payload(decode=True))
                    print("baixado:", nome, "de:", assunto)

# baixar_anexos("entrada")
```

O fluxo é sempre o mesmo: conectar, `login`, `select` da pasta, `search` com um filtro IMAP, `fetch` de cada mensagem, converter os bytes em objeto com `email.message_from_bytes`, e percorrer as partes com `walk()`. Filtros úteis: `UNSEEN` (não lidas), `FROM "cliente@..."`, `SINCE 01-Mar-2026`, `SUBJECT "..."`. Assuntos e nomes de arquivo com acento chegam codificados; `decode_header` resolve, por isso a função auxiliar. Depois de processar, o `fetch` já marca a mensagem como lida; se quiser mover para uma pasta "Processados", use `caixa.copy(numero, "Processados")`, depois `caixa.store(numero, "+FLAGS", "\\Deleted")` e `caixa.expunge()` para apagar de verdade o original.

## Montar o corpo a partir de dados

Mensagem automática não precisa parecer robótica. Separe o **template** (texto fixo com lacunas) dos **dados** (o que muda):

```python
from string import Template

MODELO = Template("""Olá, $contato,

Seguem as guias da $empresa referentes a $competencia:
$lista_guias
Total a pagar até $vencimento: R$$ $total.

Qualquer dúvida, estamos à disposição.
Equipe Contábil""")

def montar_corpo(dados, guias):
    linhas = "\n".join(f"- {g['nome']}: R$ {g['valor']:,.2f}" for g in guias)
    total = sum(g["valor"] for g in guias)
    return MODELO.substitute(dados, lista_guias=linhas, total=f"{total:,.2f}")

dados = {"contato": "Marcos", "empresa": "Padaria Central", "competencia": "03/2026",
         "vencimento": "20/04/2026"}
guias = [{"nome": "DAS", "valor": 1234.56}, {"nome": "FGTS", "valor": 800.0}]
print(montar_corpo(dados, guias))
```

`string.Template` usa `$nome` como lacuna e `substitute` preenche com um dicionário (e com argumentos extras). Um cifrão literal, como em "R$", precisa ser escrito `$$`, senão o Template tenta interpretá-lo como lacuna e levanta `ValueError`. Se faltar uma chave, levanta `KeyError`, o que é bom: melhor o robô parar do que mandar "Olá, $contato". Repare que a formatação `{valor:,.2f}` usa vírgula de milhar e ponto decimal (padrão americano); para o formato brasileiro troque com `.replace(",", "X").replace(".", ",").replace("X", ".")` ou use o módulo `locale`.

## Erros comuns

- Usar a senha normal da conta: o login falha com "Username and Password not accepted". Gere senha de app.
- Enviar para dezenas de destinatários num laço rápido demais: o provedor bloqueia por suspeita de spam. Espace os envios e use conta dedicada.
- Esquecer `decode=True` em `get_payload`: grava o anexo em base64, e o PDF "não abre".
- Testar o robô apontando para a caixa real e processar e-mails de verdade: use uma conta de teste ou o filtro `FROM` do seu próprio endereço.

## Na prática

O robô de guias (lições 3 e 4) termina chamando `enviar()` para cada cliente, com o PDF consolidado e o corpo montado pelo template. Na outra ponta, `baixar_anexos()` roda de manhã, pega as notas que os clientes mandaram e deposita na pasta `entrada` do organizador (lição 2). Um registro em log (lição 8) diz o que foi enviado e o que foi baixado.

## Resumo

- SMTP envia, IMAP lê; Gmail usa `smtp.gmail.com:465` e `imap.gmail.com:993`.
- Autentique com senha de app numa conta dedicada; OAuth quando a empresa exigir.
- `EmailMessage` + `set_content` + `add_attachment` + `SMTP_SSL.send_message` enviam com anexo.
- `IMAP4_SSL` + `search` + `fetch` + `message_from_bytes` + `walk()` leem e baixam anexos.
- Separe template (`string.Template`) de dados; falha explícita é melhor que lacuna em branco.
