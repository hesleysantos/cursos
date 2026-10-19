# Introdução ao pandas

Nesta lição você conhece o **pandas**, a biblioteca que transformou o Python na ferramenta preferida de quem analisa dados. Você vai entender `Series` e `DataFrame`, ler CSV e Excel, filtrar linhas, agrupar e agregar, juntar tabelas e exportar o resultado. O fio condutor é uma comparação constante com a planilha, porque, se você já pensa em colunas, filtros e tabelas dinâmicas, você já pensa como o pandas.

## Por que pandas se eu já sei planilha?

A planilha é excelente até ela parar de ser: 500 mil linhas travam, uma fórmula arrastada errado passa despercebida, e refazer o mesmo relatório todo mês é trabalho manual repetido. O pandas pega as ideias da planilha (tabela, coluna, filtro, tabela dinâmica, PROCV) e as coloca em **código reproduzível**: você escreve uma vez, roda todo mês, e cada passo fica documentado.

Instale com `pip install pandas openpyxl` dentro do seu venv (`openpyxl` é o motor que o pandas usa para ler e escrever `.xlsx`). A convenção universal é `import pandas as pd`.

## Series e DataFrame

Uma **Series** é uma coluna: uma sequência de valores com um **índice** (rótulos). Um **DataFrame** é a tabela: várias Series alinhadas pelo mesmo índice.

```python
import pandas as pd

saldos = pd.Series([1500.0, -320.5, 980.0], index=["Caixa", "Fornecedores", "Clientes"])
print(saldos)
# Caixa           1500.0
# Fornecedores    -320.5
# Clientes         980.0
# dtype: float64
print(saldos["Clientes"])   # 980.0
print(saldos.sum())         # 2159.5

df = pd.DataFrame({
    "cliente": ["Padaria", "Oficina", "Padaria", "Mercado"],
    "mes": ["2026-01", "2026-01", "2026-02", "2026-02"],
    "receita": [12000.0, 8500.0, 13400.0, 21000.0],
})
print(df)
#    cliente      mes  receita
# 0  Padaria  2026-01  12000.0
# 1  Oficina  2026-01   8500.0
# 2  Padaria  2026-02  13400.0
# 3  Mercado  2026-02  21000.0
print(df.shape)      # (4, 3)  -> 4 linhas, 3 colunas
print(df.dtypes)
# cliente        str
# mes            str
# receita    float64
# dtype: object
```

Cada coluna tem um **dtype** (tipo). `str` significa texto a partir do pandas 3; no pandas 2 você verá `object` no lugar. Isso importa: somar uma coluna `object` concatena strings em vez de somar números, um erro clássico de quem importa CSV com vírgula decimal.

## Ler e inspecionar arquivos

```python
import pandas as pd

# CSV brasileiro: ponto e vírgula, vírgula decimal, latin-1
df = pd.read_csv("lancamentos.csv", sep=";", decimal=",", encoding="latin-1", parse_dates=["data"])

# Excel: escolha a aba
df = pd.read_excel("fechamento.xlsx", sheet_name="Março")

print(df.head())        # primeiras 5 linhas
df.info()               # imprime colunas, tipos, nulos e memória (devolve None, por isso sem print)
print(df.describe())    # count, mean, std, min, quartis, max das colunas numéricas
print(df["conta"].value_counts())   # frequência de cada valor
```

`head()`, `info()` e `describe()` são os três comandos que você roda **sempre** ao abrir um arquivo novo. Eles respondem: a leitura veio certa? os tipos estão corretos? há valores faltando (`NaN`)?

## Selecionar e filtrar

| Planilha | pandas |
|---|---|
| Clicar na coluna | `df["receita"]` |
| Várias colunas | `df[["cliente", "receita"]]` |
| Filtro: receita > 10 mil | `df[df["receita"] > 10000]` |
| Filtro com duas condições | `df[(df["mes"] == "2026-02") & (df["receita"] > 10000)]` |
| Linha pela posição | `df.iloc[0]` |
| Linha pelo rótulo do índice | `df.loc[0]` |
| Nova coluna com fórmula | `df["imposto"] = df["receita"] * 0.06` |

Os exemplos a seguir usam o `df` de quatro linhas criado na seção Series e DataFrame:

```python
grandes = df[df["receita"] > 10000]
print(grandes["cliente"].tolist())    # ['Padaria', 'Padaria', 'Mercado']

df["imposto"] = df["receita"] * 0.06   # coluna inteira de uma vez (vetorizado)
print(df["imposto"].round(2).tolist()) # [720.0, 510.0, 804.0, 1260.0]

so_fev = df.loc[df["mes"] == "2026-02", ["cliente", "receita"]]
print(so_fev)
#    cliente  receita
# 2  Padaria  13400.0
# 3  Mercado  21000.0
```

Repare que os operadores lógicos são `&`, `|` e `~` (não `and`, `or`, `not`), e cada condição vai entre parênteses. Esse é o erro de sintaxe mais comum de iniciantes em pandas.

## Agrupar e agregar: a tabela dinâmica

`groupby` é a tabela dinâmica da planilha. Você escolhe por qual coluna agrupar e qual agregação aplicar.

```python
por_cliente = df.groupby("cliente")["receita"].sum()
print(por_cliente)
# cliente
# Mercado    21000.0
# Oficina     8500.0
# Padaria    25400.0
# Name: receita, dtype: float64

resumo = df.groupby("mes").agg(
    total=("receita", "sum"),
    media=("receita", "mean"),
    qtd=("cliente", "count"),
)
print(resumo)
#            total    media  qtd
# mes
# 2026-01  20500.0  10250.0    2
# 2026-02  34400.0  17200.0    2

tabela = df.pivot_table(index="cliente", columns="mes", values="receita", aggfunc="sum", fill_value=0)
print(tabela)
# mes      2026-01  2026-02
# cliente
# Mercado      0.0  21000.0
# Oficina   8500.0      0.0
# Padaria  12000.0  13400.0
```

`pivot_table` é literalmente a tabela dinâmica: linhas, colunas, valores e função. Funções comuns: `sum`, `mean`, `count`, `min`, `max`, `nunique`.

Para ordenar, `resumo.sort_values("total", ascending=False)`. Para transformar o índice de volta em coluna, `.reset_index()`.

## Juntar tabelas: o PROCV

`merge` faz o que o PROCV faz, mas para todas as colunas de uma vez e com controle sobre o que acontece quando não há correspondência.

```python
clientes = pd.DataFrame({
    "cliente": ["Padaria", "Oficina", "Mercado"],
    "regime": ["Simples", "Presumido", "Simples"],
})
completo = df.merge(clientes, on="cliente", how="left")
print(completo[["cliente", "receita", "regime"]])
#    cliente  receita     regime
# 0  Padaria  12000.0    Simples
# 1  Oficina   8500.0  Presumido
# 2  Padaria  13400.0    Simples
# 3  Mercado  21000.0    Simples

print(completo.groupby("regime")["receita"].sum())
# regime
# Presumido     8500.0
# Simples      46400.0
```

O parâmetro `how` define o tipo de junção: `left` mantém todas as linhas da esquerda (como o PROCV, que dá `#N/D` quando não acha, aqui vira `NaN`); `inner` só o que casa nos dois lados; `outer` tudo de ambos. Se as colunas-chave têm nomes diferentes, use `left_on=` e `right_on=`.

## Lidar com valores faltantes

Células vazias viram `NaN`. Você decide o que fazer: `df.dropna()` descarta linhas com qualquer nulo, `df["valor"].fillna(0)` preenche, `df["valor"].isna().sum()` conta. Nunca ignore: uma soma com `NaN` simplesmente pula o valor, e seu total fica menor sem aviso.

## Exportar

```python
resumo.to_csv("resumo.csv", sep=";", decimal=",", index=True, encoding="utf-8-sig")
resumo.to_excel("resumo.xlsx", sheet_name="Resumo")

with pd.ExcelWriter("fechamento.xlsx") as escritor:
    resumo.to_excel(escritor, sheet_name="Por mês")
    tabela.to_excel(escritor, sheet_name="Dinâmica")
```

`utf-8-sig` coloca o BOM que faz o Excel brasileiro abrir acentos corretamente. `ExcelWriter` grava várias abas no mesmo arquivo.

## O mesmo cálculo sem pandas

Para entender o que o `groupby` faz por baixo, vale escrever uma vez a versão com dicionários. É exatamente isso que você vai fazer nos exercícios desta lição, já que o pandas não roda no navegador:

```python
from collections import defaultdict

linhas = [
    {"cliente": "Padaria", "receita": 12000.0},
    {"cliente": "Oficina", "receita": 8500.0},
    {"cliente": "Padaria", "receita": 13400.0},
]
total = defaultdict(float)
for l in linhas:
    total[l["cliente"]] += l["receita"]
print(dict(total))   # {'Padaria': 25400.0, 'Oficina': 8500.0}
```

Funciona, mas repare que você precisou de um loop, um `defaultdict` e cuidado com tipos. O pandas faz isso em uma linha, mais rápido, e já trata nulos, ordenação e múltiplas agregações. É por isso que ele existe.

## Armadilhas comuns

- **Vírgula decimal e `;`**: esqueça `sep=";"` e `decimal=","` e sua coluna de valores vira texto.
- **`and`/`or` em filtros**: use `&`/`|` com parênteses.
- **Atribuição encadeada**: `df[cond]["col"] = valor` altera uma cópia, não o `df` (o pandas 2 avisava com `SettingWithCopyWarning`; o 3 simplesmente não altera nada). Use `df.loc[cond, "col"] = valor`.
- **Datas como texto**: converta com `pd.to_datetime(df["data"], format="%d/%m/%Y")` antes de filtrar por período.
- **Índice duplicado após concatenar**: use `ignore_index=True` em `pd.concat`.
- **Encoding**: arquivos de sistemas antigos costumam ser `latin-1`/`cp1252`.

## Na prática

O caso típico é o **relatório mensal que hoje é feito à mão**: exportar os lançamentos do sistema contábil em CSV, abrir no Excel, filtrar, montar uma tabela dinâmica por conta e colar em outra planilha. Em pandas isso é um script de dez linhas (`read_csv`, filtro, `groupby`, `to_excel`) que roda em segundos e sai idêntico todo mês. Comece reproduzindo um relatório que você já faz e compare os totais com a versão manual: quando baterem, você ganhou uma tarde por mês.

## Resumo

- `Series` é uma coluna com índice; `DataFrame` é a tabela. `head()`, `info()` e `describe()` sempre ao abrir um arquivo.
- Ler: `read_csv(sep, decimal, encoding, parse_dates)` e `read_excel(sheet_name)`; exportar: `to_csv`, `to_excel`, `ExcelWriter`.
- Filtrar com máscaras booleanas (`&`, `|`, parênteses); criar colunas de forma vetorizada.
- `groupby` + `agg`/`pivot_table` é a tabela dinâmica; `merge(how=)` é o PROCV para a tabela inteira.
- Trate `NaN` explicitamente (`dropna`, `fillna`, `isna`); nunca deixe somas silenciosamente pularem valores.
