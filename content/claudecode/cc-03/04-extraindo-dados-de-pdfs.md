Nesta lição você vai usar o Claude Code para extrair texto e tabelas de PDFs com `pypdf` e `pdfplumber`, puxar valores e datas com expressões regulares e entender o que fazer quando o PDF é uma imagem escaneada. Ao final, você escreve a regex que transforma `"R$ 1.234,56"` em número. Guias, boletos, notas de serviço e extratos chegam em PDF todos os dias no escritório; quem sabe lê-los por script elimina horas de digitação.

## Três tipos de PDF

Antes de qualquer código, descubra que tipo de PDF você tem, porque a ferramenta muda:

- **PDF com texto** (gerado por sistema, como DARF, boleto, NFS-e): o texto está dentro do arquivo e pode ser extraído direto.
- **PDF com tabela**: também tem texto, mas a posição na página importa; `pdfplumber` consegue reconstruir linhas e colunas.
- **PDF escaneado** (foto ou digitalização): é só imagem; extrair texto exige OCR, reconhecimento óptico de caracteres.

Teste rápido: abra o PDF e tente selecionar uma palavra com o mouse. Se seleciona, há texto; se a seleção vira um retângulo azul sobre tudo, é imagem.

## pypdf: texto simples

```python
# requer: pip install pypdf (e um arquivo PDF real no caminho)
from pypdf import PdfReader

leitor = PdfReader("guias/darf-2026-10.pdf")
texto = ""
for pagina in leitor.pages:
    texto += pagina.extract_text()
print(texto[:500])
```

`extract_text()` devolve o texto da página em uma string; em uma página que é só imagem, a string vem vazia (ou quase), sem erro, e é assim que você descobre por código que o PDF precisa de OCR. A ordem das palavras segue a ordem interna do PDF, que nem sempre é a visual; para documentos simples, basta.

## pdfplumber: tabelas e posição

```python
# requer: pip install pdfplumber (e um arquivo PDF real no caminho)
import pdfplumber

with pdfplumber.open("extratos/cartao-2026-10.pdf") as pdf:
    for pagina in pdf.pages:
        for tabela in pagina.extract_tables():
            for linha in tabela:
                print(linha)
```

`extract_tables()` devolve uma lista de tabelas; cada tabela é uma lista de linhas; cada linha, uma lista de células (strings ou `None`). Quando a tabela não tem linhas desenhadas, o resultado pode vir vazio ou desalinhado; nesse caso, `pagina.extract_text()` com regex costuma ser mais confiável.

## Pedindo ao Claude Code

Comece mostrando o texto bruto, não o PDF:

```text
Rodei pypdf no arquivo exemplos/darf-exemplo.pdf e o texto extraído está em
exemplos/darf-exemplo.txt. Analise o texto e me diga quais campos dá para
localizar com segurança: código da receita, período de apuração, vencimento,
valor principal, multa, juros e total. Para cada um, proponha a regex e mostre
o trecho do texto em que ela casa. Não escreva o script ainda.
```

Depois, com as regex aprovadas:

```text
Crie extrair_darf(texto) -> dict com esses campos, valores como float e datas
como datetime.date. Testes primeiro, usando trechos de texto fixos no próprio
teste (sem abrir PDF). Depois crie ler_pdf(caminho) -> str com pypdf e um
script que percorre a pasta guias/ e grava guias.csv.
```

Separar `extrair_darf(texto)` de `ler_pdf(caminho)` é o que permite testar a regra sem arquivo e trocar de biblioteca sem mexer na regra.

## Regex para valores e datas brasileiras

Valores monetários brasileiros usam ponto de milhar e vírgula decimal. A regex abaixo encontra `R$ 1.234,56`, `R$1.234,56` e `1.234,56`, com milhares opcionais:

```python
import re

PADRAO_VALOR = re.compile(r"R?\$?\s*(\d{1,3}(?:\.\d{3})*,\d{2})")

def valores_em(texto):
    achados = PADRAO_VALOR.findall(texto)
    return [float(v.replace(".", "").replace(",", ".")) for v in achados]

print(valores_em("Principal R$ 1.234,56 Multa R$ 24,69 Total: R$1.259,25"))
```

Saída: `[1234.56, 24.69, 1259.25]`. Lendo a regex: `R?\$?\s*` aceita o prefixo opcional; `\d{1,3}` é o primeiro grupo de dígitos; `(?:\.\d{3})*` repete `.000` zero ou mais vezes; `,\d{2}` exige dois centavos. Para datas:

```python
import re
from datetime import date

PADRAO_DATA = re.compile(r"(\d{2})/(\d{2})/(\d{4})")

def datas_em(texto):
    return [date(int(a), int(m), int(d)) for d, m, a in PADRAO_DATA.findall(texto)]

print(datas_em("Período 30/09/2026 Vencimento 20/10/2026"))
```

Saída: `[datetime.date(2026, 9, 30), datetime.date(2026, 10, 20)]`. A ordem dos grupos é dia, mês, ano no texto, mas `date()` recebe ano, mês, dia; esse é o tipo de inversão que um teste pega na hora.

## PDFs escaneados: OCR (visão geral)

Quando o PDF é imagem, o caminho é OCR: um programa que "lê" a imagem e produz texto. A ferramenta livre mais usada é o Tesseract, que no Python é chamado por bibliotecas como `pytesseract` e precisa do programa Tesseract instalado no Windows e do pacote de idioma português. O fluxo é: converter cada página em imagem, passar pelo OCR, aplicar as mesmas regex. O resultado nunca é 100%: `0` vira `O`, `1` vira `l`, vírgula some. Trate OCR como fonte que exige conferência humana por amostragem, e peça ao Claude Code que registre no CSV um campo de confiança ou o texto bruto para auditoria. Esta lição não aprofunda OCR; saiba que existe, que é mais frágil e que a separação `extrair(texto)` continua valendo.

## Erros comuns

- **Regex de valor sem exigir os centavos**, que casa com datas e CNPJs.
- **Confiar na ordem do texto extraído**: em colunas lado a lado, a extração pode intercalar linhas. Confira com o texto bruto.
- **Ler todas as páginas em memória** de um PDF de 300 páginas quando só a primeira interessa.
- **Aplicar OCR em PDF que já tem texto**, perdendo precisão à toa.
- **Testar regex direto no PDF**. Teste em strings fixas; use o PDF só no teste de integração.

## Na prática

Um script que lê a pasta de DARFs do mês e gera um CSV com código, período, vencimento e valores é um dos robôs mais pedidos em escritórios. Com o Claude Code, o trabalho humano concentra-se em dois pontos: aprovar as regex olhando os trechos em que casam e conferir uma amostra de cinco guias contra o CSV. O resto é repetição.

## Resumo

- Descubra se o PDF tem texto, tabela ou só imagem; a ferramenta depende disso.
- `pypdf` extrai texto simples; `pdfplumber` reconstrói tabelas e usa posição.
- Mostre ao Claude o texto extraído e peça as regex com os trechos em que casam antes do script.
- Valores brasileiros: `\d{1,3}(?:\.\d{3})*,\d{2}`, depois troque `.` por nada e `,` por `.`.
- OCR para escaneados é possível, mas frágil: conferência por amostragem obrigatória.
