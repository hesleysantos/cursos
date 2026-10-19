Nesta lição você vai ler, escrever e formatar planilhas Excel com `openpyxl`, e vai usar `pandas` para carregar CSV e Excel, filtrar, agrupar e salvar. O exemplo central é um robô que consolida as planilhas mensais de vários clientes em uma só. Isso importa porque a planilha é a moeda do escritório: cliente manda planilha, sistema exporta planilha, sócio pede planilha. Quem automatiza planilha devolve horas por semana.

## Duas bibliotecas, dois papéis

- **openpyxl** manipula o arquivo `.xlsx` célula por célula: lê valores, escreve, aplica negrito, cor, largura de coluna e fórmulas. É a ferramenta para **produzir** uma planilha bonita ou mexer num arquivo que já tem formatação.
- **pandas** enxerga a planilha como uma **tabela de dados** (um `DataFrame`): filtrar, somar por grupo, juntar tabelas, salvar. É a ferramenta para **processar** dados em volume.

Instale as duas no ambiente virtual: `pip install openpyxl pandas`. O pandas usa o openpyxl por baixo para ler e gravar `.xlsx`.

## openpyxl: escrever

```python
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment

wb = Workbook()
ws = wb.active
ws.title = "Honorarios"

ws.append(["Cliente", "Competência", "Valor"])          # linha de cabeçalho
ws.append(["Padaria Central", "2026-03", 850.00])
ws.append(["Mercado Bom Preço", "2026-03", 1200.00])
ws.append(["Oficina do Zé", "2026-03", 600.00])

ws["A5"] = "Total"
ws["C5"] = "=SUM(C2:C4)"                                # fórmula como texto, em inglês

for celula in ws[1]:                                    # formata o cabeçalho
    celula.font = Font(bold=True, color="FFFFFF")
    celula.fill = PatternFill("solid", fgColor="1F4E78")
    celula.alignment = Alignment(horizontal="center")

for linha in range(2, 6):
    ws.cell(row=linha, column=3).number_format = 'R$ #,##0.00'

ws.column_dimensions["A"].width = 24
ws.column_dimensions["B"].width = 14

wb.save("honorarios.xlsx")
print("gerado honorarios.xlsx")
```

Pontos importantes: `append` escreve a próxima linha livre; `ws["C5"]` e `ws.cell(row=, column=)` acessam uma célula específica; fórmulas são escritas como texto começando com `=` e com nomes de função em inglês e vírgula como separador de argumentos, mesmo com Excel em português. O openpyxl **não calcula** a fórmula: quem calcula é o Excel ao abrir.

## openpyxl: ler

```python
from openpyxl import load_workbook

wb = load_workbook("honorarios.xlsx", data_only=True)
ws = wb["Honorarios"]

for cliente, competencia, valor in ws.iter_rows(min_row=2, max_row=4, values_only=True):
    print(cliente, competencia, valor)
```

`values_only=True` devolve os valores em vez de objetos célula. `data_only=True` pede o **resultado** das fórmulas em vez do texto `=SUM(...)`; mas esse resultado só existe se o arquivo foi salvo pelo Excel alguma vez. Um arquivo recém-gerado pelo openpyxl devolve `None` nas células de fórmula, por isso o exemplo lê só as linhas 2 a 4.

## pandas: ler, filtrar, agrupar, salvar

```python
import pandas as pd

# CSV exportado de sistema brasileiro: ponto e vírgula, vírgula decimal, acentos em latin-1
df = pd.read_csv("lancamentos.csv", sep=";", decimal=",", encoding="latin-1")

# Excel: sheet_name escolhe a aba; dtype=str evita que CNPJ perca zeros à esquerda
folha = pd.read_excel("folha_2026-03.xlsx", sheet_name="Resumo", dtype={"cnpj": str})

grandes = df[df["valor"] > 1000]                         # filtro
por_cliente = df.groupby("cliente")["valor"].sum()       # soma por grupo
por_cliente = por_cliente.sort_values(ascending=False)

df.to_excel("saida.xlsx", index=False)                   # salva sem a coluna de índice
por_cliente.to_csv("totais.csv", sep=";", decimal=",")
```

Um `DataFrame` tem colunas nomeadas e linhas numeradas. `df["valor"]` é uma coluna; `df[df["valor"] > 1000]` filtra linhas; `groupby` agrupa e `sum()`, `count()` ou `mean()` resumem. O trio `sep=";", decimal=",", encoding="latin-1"` resolve a maioria dos CSVs gerados por sistemas nacionais; se os acentos saírem errados, tente `encoding="utf-8"`.

## Robô 2: consolidar planilhas de clientes

Cada cliente manda uma planilha com as mesmas colunas (`data`, `descricao`, `valor`). Você quer uma só, com uma coluna extra dizendo de qual cliente veio.

```python
from pathlib import Path
import pandas as pd

def consolidar(pasta_entrada, saida):
    tabelas = []
    for arquivo in sorted(Path(pasta_entrada).glob("*.xlsx")):
        df = pd.read_excel(arquivo)
        df.columns = [c.strip().lower() for c in df.columns]   # normaliza cabeçalhos
        df["cliente"] = arquivo.stem.split("_")[0]              # padrão cliente_competencia
        tabelas.append(df)
    if not tabelas:
        raise SystemExit("nenhuma planilha encontrada")
    geral = pd.concat(tabelas, ignore_index=True)
    geral["valor"] = pd.to_numeric(geral["valor"], errors="coerce")
    resumo = geral.groupby("cliente")["valor"].sum().reset_index()
    with pd.ExcelWriter(saida) as escritor:
        geral.to_excel(escritor, sheet_name="Lancamentos", index=False)
        resumo.to_excel(escritor, sheet_name="Resumo", index=False)
    return len(geral)

# consolidar("entrada", "consolidado_2026-03.xlsx")
```

`pd.concat` empilha as tabelas; `pd.to_numeric(..., errors="coerce")` transforma em número e troca o que não for número por `NaN` (vazio) em vez de travar; `ExcelWriter` grava várias abas no mesmo arquivo. Depois, se quiser formatar o cabeçalho, abra o arquivo gerado com openpyxl e aplique os estilos da primeira seção.

## Quando não usar pandas

Para arquivos pequenos ou quando você não pode instalar bibliotecas, o módulo `csv` da biblioteca padrão resolve:

```python
import csv, io

texto = "cliente;valor\npadaria;850,00\nmercado;1200,50\n"
leitor = csv.DictReader(io.StringIO(texto), delimiter=";")
total = 0.0
for linha in leitor:
    total += float(linha["valor"].replace(".", "").replace(",", "."))
print(f"{total:.2f}")
```

Saída: `2050.50`. É exatamente essa versão "sem pandas" que os exercícios desta lição usam, porque o Python do navegador não tem pandas.

## Erros comuns

- Ler CNPJ ou CEP como número e perder zeros à esquerda: use `dtype=str` ou `dtype={"cnpj": str}`.
- Escrever fórmula com nome em português (`=SOMA(C2:C4)`) ou com `;` entre argumentos (`=IF(A1>0;1;0)`): o Excel mostra `#NAME?` ou pede reparo do arquivo. Use nomes em inglês, `:` para intervalo e vírgula entre argumentos: `=SUM(C2:C4)`, `=IF(A1>0,1,0)`.
- Esperar que `load_workbook(data_only=True)` calcule a fórmula: ele só lê o valor que o Excel já gravou.
- Abrir com openpyxl um `.xls` antigo: ele só lê `.xlsx`. Converta no Excel ou use pandas com a biblioteca `xlrd`.

## Na prática

O robô de consolidação roda no dia 5 de cada mês, lê a pasta `entrada/2026-03`, gera `consolidado_2026-03.xlsx` com aba de detalhe e aba de resumo, e a lição 5 vai mandar esse arquivo por e-mail para o sócio. Nenhuma célula copiada à mão.

## Resumo

- openpyxl escreve e formata célula a célula; pandas processa a planilha como tabela.
- `ws.append`, `ws["A1"]`, `ws.cell()`, `Font`, `PatternFill`, `number_format`, `column_dimensions` cobrem a formatação do dia a dia.
- Fórmulas vão como texto em inglês e são calculadas pelo Excel, não pelo Python.
- `read_csv(sep=";", decimal=",", encoding="latin-1")`, filtros, `groupby`, `concat` e `ExcelWriter` fazem a consolidação.
- Sem pandas, `csv.DictReader` resolve arquivos pequenos.
