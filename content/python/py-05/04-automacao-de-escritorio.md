# Automação de escritório: planilhas, PDF, e-mail e agendamento

Nesta lição você aprende a automatizar as quatro tarefas que mais consomem tempo em um escritório: mexer em planilhas Excel com `openpyxl`, gerar relatórios em PDF, enviar e-mails com `smtplib` e `email`, e agendar tudo isso para rodar sozinho com o Agendador de Tarefas do Windows ou a biblioteca `schedule`. A meta é que o relatório mensal que hoje leva uma tarde passe a sair sozinho às 7h da manhã.

## Por que automatizar?

Tarefa repetitiva feita por pessoa gera dois custos: tempo e erro. Um fechamento que exige abrir 30 planilhas, copiar totais, formatar, salvar como PDF e mandar e-mail para cada cliente é previsível, e tudo que é previsível pode virar código. O ganho não é só velocidade: o script faz **sempre igual**, deixa **log**, e libera você para o trabalho que exige julgamento.

## openpyxl: ler e escrever Excel

O `openpyxl` manipula arquivos `.xlsx` diretamente, célula por célula, com acesso a fórmulas e formatação. Instale com `pip install openpyxl`.

### Ler

```python
from openpyxl import load_workbook

wb = load_workbook("fechamento.xlsx", data_only=True)   # data_only: lê o valor calculado, não a fórmula
print(wb.sheetnames)        # ['Janeiro', 'Fevereiro', 'Março']

ws = wb["Março"]
print(ws["B2"].value)       # 12000.0
print(ws.cell(row=2, column=2).value)   # mesma célula
print(ws.max_row, ws.max_column)        # 45 6

for linha in ws.iter_rows(min_row=2, values_only=True):   # pula o cabeçalho
    cliente, receita, despesa = linha[:3]
    print(cliente, receita - despesa)
```

Sem `data_only=True`, uma célula com `=SOMA(B2:B10)` devolve o texto da fórmula. Com ele, devolve o último valor que o Excel calculou e salvou; se o arquivo foi gerado por código e nunca aberto no Excel, esse valor é `None`. O `openpyxl` **não calcula fórmulas**.

### Escrever, com fórmulas e formatação

```python
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.utils import get_column_letter

dados = {"Padaria": 12000.0, "Oficina": 8500.0, "Mercado": 21000.0}

wb = Workbook()
ws = wb.active
ws.title = "Resumo"

ws.append(["Cliente", "Receita", "Imposto 6%"])
for cliente, receita in dados.items():
    ws.append([cliente, receita, None])

# fórmulas em português NÃO funcionam: openpyxl grava em inglês, o Excel traduz ao abrir
for r in range(2, ws.max_row + 1):
    ws.cell(row=r, column=3, value=f"=B{r}*0.06")
ultima = ws.max_row + 1
ws.cell(row=ultima, column=1, value="Total")
ws.cell(row=ultima, column=2, value=f"=SUM(B2:B{ultima - 1})")

# formatação
negrito = Font(bold=True)
cinza = PatternFill("solid", fgColor="DDDDDD")
for c in ws[1]:
    c.font = negrito
    c.fill = cinza
    c.alignment = Alignment(horizontal="center")
for r in range(2, ultima + 1):
    ws.cell(row=r, column=2).number_format = 'R$ #,##0.00'
    ws.cell(row=r, column=3).number_format = 'R$ #,##0.00'
ws.column_dimensions[get_column_letter(1)].width = 20
ws.freeze_panes = "A2"

wb.save("resumo.xlsx")
```

Ao abrir, o Excel calcula `SUM` e mostra `R$ 41.500,00`. Pontos de atenção: fórmulas sempre em **inglês** e com **vírgula** separando argumentos; `number_format` usa a sintaxe do Excel; `append` adiciona uma linha no fim da aba.

## PDF: visão geral

Para relatórios em PDF, duas bibliotecas populares são `reportlab` (poderosa, mais verbosa) e `fpdf2` (simples). Com `fpdf2`:

```python
from fpdf import FPDF

pdf = FPDF()
pdf.add_page()
pdf.set_font("Helvetica", "B", 16)
pdf.cell(0, 10, "Resumo de fechamento - Marco/2026", new_x="LMARGIN", new_y="NEXT")
pdf.set_font("Helvetica", size=11)
for cliente, receita in {"Padaria": 12000.0, "Oficina": 8500.0}.items():
    pdf.cell(0, 8, f"{cliente}: R$ {receita:,.2f}", new_x="LMARGIN", new_y="NEXT")
pdf.output("resumo.pdf")
```

As fontes padrão do PDF (Helvetica, Times, Courier) cobrem só o conjunto Latin-1: os acentos do português funcionam, mas símbolos fora dele (travessão, emoji) quebram. Para Unicode completo, carregue uma fonte TrueType (`pdf.add_font("DejaVu", "", "DejaVuSans.ttf")`) e use-a com `pdf.set_font("DejaVu")`. Alternativa muito usada: gerar HTML com Jinja2 e converter para PDF com `weasyprint`, aproveitando CSS para o layout.

## E-mail com smtplib e email

Enviar e-mail é dois passos: **montar** a mensagem (módulo `email`) e **entregar** pelo servidor SMTP (módulo `smtplib`). Ambos estão na biblioteca padrão.

```python
import os
import smtplib
from email.message import EmailMessage

def montar_email(destinatario: str, cliente: str, total: float) -> EmailMessage:
    msg = EmailMessage()
    msg["Subject"] = f"Fechamento de março - {cliente}"
    msg["From"] = "contabilidade@escritorio.com.br"
    msg["To"] = destinatario
    msg.set_content(
        f"Olá,\n\nSegue o fechamento de março de {cliente}.\n"
        f"Receita total: R$ {total:,.2f}\n\nAtenciosamente,\nEquipe Contábil"
    )
    with open("resumo.xlsx", "rb") as f:
        msg.add_attachment(
            f.read(),
            maintype="application",
            subtype="vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            filename="resumo.xlsx",
        )
    return msg

msg = montar_email("dono@padaria.com.br", "Padaria", 12000.0)

# EMAIL_USER e EMAIL_SENHA precisam existir no ambiente (KeyError claro se faltarem)
with smtplib.SMTP("smtp.gmail.com", 587) as smtp:
    smtp.starttls()                                   # criptografa a conexão
    smtp.login(os.environ["EMAIL_USER"], os.environ["EMAIL_SENHA"])
    smtp.send_message(msg)
```

Separe a função que **monta** a mensagem da que **envia**: a primeira é pura e testável (você confere assunto, corpo e anexo sem rede), a segunda depende do mundo externo. No Gmail e no Outlook você precisa de uma **senha de aplicativo**, nunca a senha da conta; e ela vai em variável de ambiente, como toda credencial. Um erro de digitação aqui manda o e-mail para a pessoa errada: em desenvolvimento, aponte o `To` para você mesmo.

## Agendar

### Agendador de Tarefas do Windows

É a solução mais robusta no Windows, porque não depende de um processo Python ficar aberto. Pelo PowerShell (uma tarefa do seu próprio usuário não exige administrador; abra como administrador se o Windows recusar):

```bash
schtasks /Create /SC DAILY /ST 07:00 /TN "Fechamento" /TR "C:\proj\.venv\Scripts\python.exe C:\proj\fechamento.py"
```

Ou pela interface gráfica: Criar Tarefa Básica, gatilho Diariamente, ação Iniciar um programa, apontando para o `python.exe` **do seu venv** e com o script como argumento. Dois cuidados que resolvem 90% dos problemas: definir a pasta "Iniciar em" (o diretório de trabalho) e marcar "Executar estando o usuário conectado ou não". Como o script roda sem ninguém olhando, **logging em arquivo** é obrigatório.

### A biblioteca schedule

Quando você quer um processo Python rodando continuamente (um serviço em um servidor, por exemplo), `schedule` oferece uma sintaxe legível:

```python
import schedule
import time

def gerar_fechamento():
    print("Gerando fechamento...")

schedule.every().day.at("07:00").do(gerar_fechamento)
schedule.every().monday.at("08:30").do(lambda: print("Resumo semanal"))
schedule.every(10).minutes.do(lambda: print("Verificando e-mails"))

while True:
    schedule.run_pending()
    time.sleep(30)
```

O preço é que, se a janela fechar ou a máquina reiniciar, o agendamento morre. Para tarefas de escritório em uma máquina Windows, prefira o Agendador do sistema; use `schedule` dentro de serviços que já ficam no ar.

## Juntando tudo: o esqueleto de um robô

```python
import logging
from pathlib import Path

logging.basicConfig(filename="fechamento.log", level=logging.INFO,
                    format="%(asctime)s %(levelname)s %(message)s")

def main():
    logging.info("Início do fechamento")
    dados = ler_planilhas(Path("entrada"))      # openpyxl
    resumo = consolidar(dados)                  # função pura: dict -> dict
    gravar_excel(resumo, Path("saida/resumo.xlsx"))
    gerar_pdf(resumo, Path("saida/resumo.pdf"))
    for cliente, info in resumo.items():
        enviar(montar_email(info["email"], cliente, info["total"]))
    logging.info("Fechamento concluído: %d clientes", len(resumo))

if __name__ == "__main__":
    try:
        main()
    except Exception:
        logging.exception("Falha no fechamento")
        raise
```

Repare na separação: ler, consolidar, gravar, enviar. A parte **pura** (`consolidar`, `montar_email`) é a que você testa com `pytest`; as bordas (arquivo, rede) ficam finas.

## Armadilhas comuns

- **Abrir o arquivo errado**: use `pathlib.Path` e caminhos absolutos em scripts agendados; o diretório de trabalho do Agendador não é o da sua pasta.
- **Fórmula em português** no openpyxl (`=SOMA`) aparece como `#NOME?` ao abrir. Sempre inglês.
- **Esperar valor de fórmula** em arquivo gerado por código: será `None` até o Excel recalcular. Calcule em Python se precisar do número.
- **Senha no código**: variável de ambiente, senha de aplicativo, `.env` no `.gitignore`.
- **Testar envio em produção**: envie para si mesmo até ter certeza.
- **Script agendado sem log**: quando falhar, você não saberá por quê.

## Na prática

Um roteiro que funciona: automatize **uma** etapa por vez. Primeiro o script lê as planilhas e grava o resumo (você ainda manda o e-mail à mão); quando ele acertar três meses seguidos, acrescente o envio; só depois agende. A cada etapa, compare a saída do script com a feita à mão antes de confiar. E mantenha um e-mail de teste como destinatário até o dia em que o cliente realmente precisar receber.

## Resumo

- `openpyxl`: `load_workbook(data_only=True)` para ler valores, `Workbook()`/`append`/`cell` para escrever; fórmulas em inglês, não são calculadas pela biblioteca.
- PDF: `fpdf2` para o simples, `reportlab` ou HTML+`weasyprint` para layouts elaborados.
- E-mail: monte com `EmailMessage` (função pura, testável) e envie com `smtplib.SMTP` + `starttls` + `login` com senha de aplicativo em variável de ambiente.
- Agende com o Agendador de Tarefas do Windows (robusto, usa o `python.exe` do venv) ou com `schedule` em processos que já ficam no ar.
- Separe funções puras de funções com efeito externo e registre tudo em log.
