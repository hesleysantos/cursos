Nesta lição você vai construir, com o Claude Code, um script que lê várias planilhas Excel, consolida os dados e grava uma planilha nova, usando as bibliotecas `openpyxl` e `pandas`. Você vai aprender a pedir por etapas, a conferir o resultado com uma amostra pequena e a entender a lógica de consolidação bem o suficiente para escrevê-la com dicionários puros. Planilha é o formato universal do escritório contábil; dominar isso com IA paga o curso sozinho.

## Duas bibliotecas, dois papéis

- **openpyxl** abre e grava arquivos `.xlsx` célula a célula. Serve quando você precisa preservar abas, formatação, fórmulas, ou ler um layout irregular (cabeçalho na linha 5, totais no meio).
- **pandas** trabalha com tabelas (`DataFrame`): lê um intervalo retangular, filtra, agrupa, soma, junta tabelas e exporta. Serve quando os dados são regulares e você quer operações de "planilha dinâmica" em código. O `pandas` usa o `openpyxl` por baixo para ler `.xlsx`.

Instale no ambiente virtual: `pip install openpyxl pandas`. Peça ao Claude Code que escolha e justifique: "use pandas se as abas forem regulares; use openpyxl se houver cabeçalhos deslocados".

## Lendo com openpyxl

```python
# requer: pip install openpyxl
from openpyxl import load_workbook

wb = load_workbook("entradas/cliente-a.xlsx", data_only=True)
ws = wb["Honorarios"]
for linha in ws.iter_rows(min_row=2, values_only=True):
    cliente, competencia, valor, pago = linha
    print(cliente, competencia, valor, pago)
```

`data_only=True` faz as células com fórmula devolverem o último valor calculado pelo Excel em vez do texto da fórmula; sem isso você lê `=SOMA(C2:C9)`. `values_only=True` devolve tuplas de valores em vez de objetos de célula. Esses dois detalhes são os que o Claude às vezes esquece, e é por isso que você precisa conhecê-los.

## Lendo e gravando com pandas

```python
# requer: pip install pandas openpyxl
import pandas as pd

df = pd.read_excel("entradas/cliente-a.xlsx", sheet_name="Honorarios")
df = df.dropna(subset=["Cliente", "Valor"])
totais = df.groupby("Cliente", as_index=False)["Valor"].sum()
totais.to_excel("saida/totais.xlsx", index=False)
```

`dropna(subset=...)` descarta linhas sem cliente ou sem valor; `groupby(...).sum()` faz o subtotal; `index=False` evita uma coluna extra de índice no arquivo gravado.

## Prompts por etapa

Siga o fluxo da lição anterior. A especificação já diz entradas, saídas e critérios. Os prompts, um passo por vez:

```text
Passo 1: crie ler_honorarios(caminho) que abre a aba "Honorarios" com openpyxl
(data_only=True) e devolve uma lista de dicionários com as chaves cliente,
competencia, valor (float) e pago (bool). Ignore linhas sem cliente ou sem
valor e devolva também a lista das linhas ignoradas com o número da linha.
Escreva os testes antes usando uma planilha gerada no próprio teste.
```

```text
Passo 2: crie consolidar(registros) que recebe a lista de dicionários de vários
arquivos e devolve um dicionário {cliente: total}. Se o mesmo cliente +
competencia aparecer duas vezes, levante ValueError com os dois arquivos.
Testes primeiro, só com dicionários, sem Excel.
```

```text
Passo 3: crie gravar_consolidado(registros, totais, caminho) com openpyxl:
cabeçalho, uma linha por registro, linha em branco, uma linha "TOTAL <cliente>"
por cliente. Valores como número com duas casas (number_format "#,##0.00").
```

Repare que o passo 2 não toca em Excel: a regra de negócio vive em funções que recebem e devolvem estruturas Python simples. É isso que torna o teste rápido e o código reaproveitável.

## Conferindo com amostra

Antes de apontar o script para a pasta real, monte `exemplos/` com três arquivos pequenos: um normal, um com linha em branco e valor em texto (`"R$ 1.234,56"`), um com cliente duplicado. Peça:

```text
Rode python consolidar.py --entrada exemplos --saida saida-teste e me mostre:
quantos registros leu por arquivo, quais linhas ignorou e o total por cliente.
Compare com estes valores que calculei à mão: Padaria 3.450,00; Oficina
2.100,50; o terceiro arquivo deve dar erro de duplicidade.
```

Se o total não bater, não peça "corrija": peça "mostre os registros lidos do arquivo X" e encontre a linha divergente. Normalmente é um valor lido como texto, uma competência com formato diferente ou um cabeçalho fora do lugar.

## Valores que chegam como texto

Planilhas exportadas de sistemas contábeis trazem `"R$ 1.234,56"` em vez de `1234.56`. A conversão em Python puro:

```python
def texto_para_valor(texto):
    if isinstance(texto, (int, float)):
        return float(texto)
    limpo = str(texto).replace("R$", "").replace(".", "").replace(",", ".").strip()
    return float(limpo)

print(texto_para_valor("R$ 1.234,56"))  # 1234.56
print(texto_para_valor(980))            # 980.0
```

Guarde valores monetários como `float` para somar e formate só na gravação; para conferências com centavos exatos, `decimal.Decimal` evita surpresas de arredondamento.

## Erros comuns

- **Ler fórmula em vez de valor** por esquecer `data_only=True`.
- **Somar texto**: `"1.234,56" + "980"` concatena ou dá erro; converta antes.
- **Apontar para a pasta real no primeiro teste** e sobrescrever a planilha do mês.
- **Deixar a regra de negócio dentro do código de Excel**, impossível de testar sem arquivo.
- **Competência como data e como texto** misturadas (`2026-10-01` e `"10/2026"`); normalize para `"AAAA-MM"` na leitura.

## Na prática

O mesmo esqueleto (ler → validar → consolidar → gravar) resolve folha de honorários, controle de guias pagas, conferência de extratos de cartão e apuração de comissões. Com o Claude Code, o que muda de um para outro é a especificação e os testes; a estrutura do código fica igual, e você começa a reconhecer de longe quando uma função "sabe demais" sobre Excel.

## Resumo

- `openpyxl` para célula a célula e layouts irregulares; `pandas` para tabelas regulares e agregações.
- `load_workbook(..., data_only=True)` e `iter_rows(values_only=True)` são os detalhes que evitam ler fórmulas e objetos.
- Peça um passo por vez: ler, consolidar (sem Excel), gravar.
- Regra de negócio em funções com dicionários e listas; Excel só nas pontas.
- Confira com uma amostra pequena e valores calculados à mão antes de usar dados reais.
