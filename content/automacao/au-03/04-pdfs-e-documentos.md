Nesta lição você vai juntar, dividir e extrair texto de PDFs com `pypdf`, puxar tabelas com `pdfplumber`, gerar documentos Word com `python-docx`, conhecer as opções para criar PDF (`reportlab` e `fpdf2`) e, com expressões regulares, extrair valores e datas de uma guia como o DAS. Isso importa porque o escritório vive de PDF: guias, extratos, notas, contratos. Quem lê PDF com código para de redigitar.

## PDF com texto e PDF com imagem

Antes de qualquer biblioteca, uma distinção decide tudo: o PDF tem **camada de texto** (foi gerado por um sistema, você consegue selecionar palavras) ou é uma **imagem** (foi escaneado ou fotografado)? As bibliotecas desta lição leem a camada de texto. Para imagem é preciso OCR, assunto do módulo 4. Teste rápido: abra o PDF, tente selecionar uma palavra com o mouse. Se não selecionar, é imagem.

## pypdf: juntar, dividir, extrair

Instale com `pip install pypdf`. Os dois objetos centrais são `PdfReader` (lê) e `PdfWriter` (monta um novo arquivo).

```python
from pypdf import PdfReader, PdfWriter

# juntar várias guias num único PDF para mandar ao cliente
escritor = PdfWriter()
for nome in ["das_2026-03.pdf", "gps_2026-03.pdf", "fgts_2026-03.pdf"]:
    escritor.append(nome)
escritor.write("guias_2026-03.pdf")

# dividir: uma página por arquivo
leitor = PdfReader("lote_de_holerites.pdf")
for i, pagina in enumerate(leitor.pages, start=1):
    parte = PdfWriter()
    parte.add_page(pagina)
    parte.write(f"holerite_{i:02d}.pdf")

# extrair texto
leitor = PdfReader("das_2026-03.pdf")
texto = "\n".join(p.extract_text() or "" for p in leitor.pages)
print(texto[:500])
```

`append` recebe um caminho e anexa todas as páginas; `add_page` anexa uma página; `write` grava. `extract_text()` devolve o texto da página, e devolve string vazia quando a página é imagem, por isso o `or ""`. Os blocos acima supõem que os arquivos existam na pasta; troque pelos seus. A documentação oficial fica em `pypdf.readthedocs.io`.

## pdfplumber: tabelas

Quando o PDF tem uma tabela de verdade (extrato bancário, relatório de sistema), `extract_text` devolve tudo embaralhado. O `pdfplumber` (`pip install pdfplumber`) reconhece linhas e colunas:

```python
import pdfplumber

with pdfplumber.open("extrato_2026-03.pdf") as pdf:
    for pagina in pdf.pages:
        for tabela in pagina.extract_tables():
            for linha in tabela:
                print(linha)          # lista com o texto de cada célula
```

Cada linha vem como lista de strings (ou `None` para célula vazia). Dali para um `DataFrame` ou para o `csv` é um passo. Tabelas sem bordas às vezes exigem ajustes nas opções de `extract_tables`; a documentação mostra as estratégias.

## python-docx: gerar Word

Para contratos, declarações e cartas padronizadas, o caminho mais prático é um **modelo** `.docx` com marcadores e um script que substitui. Instale com `pip install python-docx` (o módulo importa como `docx`).

```python
from docx import Document

dados = {"{{CLIENTE}}": "Padaria Central Ltda", "{{CNPJ}}": "12.345.678/0001-90",
         "{{COMPETENCIA}}": "março de 2026"}

doc = Document("modelo_declaracao.docx")
for paragrafo in doc.paragraphs:
    for marcador, valor in dados.items():
        if marcador in paragrafo.text:
            for trecho in paragrafo.runs:          # substitui run a run para manter a formatação
                trecho.text = trecho.text.replace(marcador, valor)
doc.save("declaracao_padaria-central_2026-03.docx")
```

Também dá para criar do zero: `doc = Document()`, `doc.add_heading("Título", level=1)`, `doc.add_paragraph("texto")`, `doc.add_table(rows=1, cols=3)`. Um cuidado: o Word às vezes quebra um marcador em dois *runs* (pedaços com formatação diferente). Se a substituição não pegar, digite o marcador de uma vez só no modelo, sem corrigir no meio. Para converter o `.docx` em PDF sem abrir o Word, o LibreOffice faz pela linha de comando: `soffice --headless --convert-to pdf arquivo.docx`.

## Gerar PDF: visão geral

Duas bibliotecas se destacam. **reportlab** desenha em coordenadas (`canvas.drawString(x, y, texto)`), é poderosa e verbosa. **fpdf2** (`pip install fpdf2`) é mais simples para relatórios: cria página, define fonte, escreve células e linhas. Para a maioria dos relatórios de escritório, a estratégia mais produtiva é gerar o conteúdo em `.docx` ou em HTML e converter para PDF; só vá para reportlab quando precisar de layout milimétrico. Em qualquer caso, consulte a documentação da biblioteca para a assinatura exata das funções, que muda entre versões.

## Extrair valores e datas com regex

Uma **expressão regular** (regex) descreve um padrão de texto. O módulo `re` encontra esse padrão em qualquer string, inclusive no texto extraído de um PDF. Para guias brasileiras, dois padrões resolvem quase tudo:

```python
import re

texto = """DAS - Documento de Arrecadação do Simples Nacional
Período de Apuração: 03/2026
Data de Vencimento: 20/04/2026
Valor Total do Documento: R$ 1.234,56"""

datas = re.findall(r"\d{2}/\d{2}/\d{4}", texto)
valores = re.findall(r"R\$\s?([\d.]+,\d{2})", texto)

def para_float(valor_br):
    return float(valor_br.replace(".", "").replace(",", "."))

print(datas)                       # ['20/04/2026']
print([para_float(v) for v in valores])   # [1234.56]

vencimento = re.search(r"Vencimento:\s*(\d{2}/\d{2}/\d{4})", texto)
print(vencimento.group(1))         # 20/04/2026
```

Lendo os padrões: `\d{2}` são dois dígitos; `/` é a barra literal; `R\$` é o cifrão escapado (sem a barra, `$` significa "fim da linha"); `\s?` é um espaço opcional; `[\d.]+` é um ou mais dígitos ou pontos; os parênteses marcam o **grupo** que `findall` devolve e `group(1)` recupera. A função `para_float` converte o formato brasileiro (`1.234,56`) para o que o Python entende (`1234.56`). Para transformar a data em objeto, use `datetime.strptime("20/04/2026", "%d/%m/%Y")`.

> **Dica:** teste a regex no texto extraído, não no PDF visual. Espaços duplos, quebras de linha e caracteres invisíveis são comuns. `re.search(..., re.IGNORECASE)` ignora maiúsculas.

## Robô 3: ler uma pasta de DAS e montar a lista de vencimentos

```python
from pathlib import Path
import re
from pypdf import PdfReader

def ler_das(caminho):
    texto = "\n".join(p.extract_text() or "" for p in PdfReader(caminho).pages)
    venc = re.search(r"Vencimento:?\s*(\d{2}/\d{2}/\d{4})", texto)
    valor = re.search(r"Valor Total[^\d]*([\d.]+,\d{2})", texto)
    if not (venc and valor):
        return None
    return {"arquivo": Path(caminho).name, "vencimento": venc.group(1),
            "valor": float(valor.group(1).replace(".", "").replace(",", "."))}

# for pdf in Path("guias").glob("*das*.pdf"):
#     print(ler_das(pdf))
```

O retorno `None` quando algo não é encontrado permite ao robô separar os arquivos que precisam de conferência manual, em vez de inventar um valor.

## Erros comuns

- Tentar extrair texto de PDF escaneado e receber string vazia: precisa de OCR.
- Esquecer de escapar o cifrão (`R$` em vez de `R\$`) e a regex nunca encontrar nada.
- Converter `"1.234,56"` com `float()` direto: dá erro. Remova o ponto e troque a vírgula.
- Substituir marcadores em `paragrafo.text` diretamente: perde negrito e fonte. Use os `runs`.

## Na prática

Na entrega mensal, o robô junta DAS, GPS e FGTS de cada cliente em um PDF só, extrai os vencimentos e valores, grava numa planilha de controle (lição 3) e envia por e-mail (lição 5). O que levava uma tarde vira um clique e uma conferência.

## Resumo

- Distinga PDF com texto de PDF imagem; as bibliotecas daqui leem só o primeiro.
- pypdf: `PdfWriter.append` junta, `add_page` divide, `extract_text` lê.
- pdfplumber extrai tabelas; python-docx preenche modelos Word pelos `runs`.
- Para gerar PDF: fpdf2 ou reportlab, ou converter `.docx`/HTML.
- Regex `\d{2}/\d{2}/\d{4}` pega datas e `R\$\s?([\d.]+,\d{2})` pega valores; converta o formato brasileiro antes de calcular.
