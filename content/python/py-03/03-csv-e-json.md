# CSV e JSON

Dois formatos dominam a troca de dados no escritório: o **CSV**, que é a planilha em forma de texto, e o **JSON**, que é a língua das APIs e dos arquivos de configuração. Nesta lição você vai ler e escrever os dois com os módulos `csv` e `json` da biblioteca padrão e, ao final, montar um resumo de lançamentos contábeis a partir de um CSV.

## CSV: a planilha em texto puro

CSV significa *Comma-Separated Values*: cada linha é um registro e as colunas são separadas por vírgula. No Brasil, como a vírgula é o separador decimal, o Excel exporta com **ponto e vírgula**. Um arquivo típico de lançamentos:

```
data;conta;historico;valor
2026-03-01;1.1.01;Recebimento cliente A;15000.00
2026-03-02;3.1.02;Aluguel;-3500.00
2026-03-05;3.1.05;Energia elétrica;-820.45
```

### Por que não usar `split(";")`?

Parece simples, mas quebra assim que um campo contém o próprio separador ou aspas: `"Pagamento; parcela 2/3"`. O módulo `csv` conhece as regras de aspas, escapes e quebras de linha dentro de campos. Use-o sempre.

### Lendo com `csv.reader`

Os blocos a seguir supõem que o arquivo `/tmp/lancamentos.csv` já existe com o conteúdo acima.

```python
import csv

with open("/tmp/lancamentos.csv", encoding="utf-8", newline="") as f:
    leitor = csv.reader(f, delimiter=";")
    cabecalho = next(leitor)          # primeira linha
    for linha in leitor:
        print(linha)

# ['2026-03-01', '1.1.01', 'Recebimento cliente A', '15000.00']
# ['2026-03-02', '3.1.02', 'Aluguel', '-3500.00']
# ...
```

Cada linha vem como **lista de strings**: é você quem converte `'15000.00'` em `float`. O parâmetro `newline=""` é exigido pela documentação do `csv`, tanto na leitura quanto na escrita: na leitura, deixa o `csv` cuidar das quebras de linha dentro de campos entre aspas; na escrita, evita uma linha em branco entre os registros no Windows.

### Lendo com `csv.DictReader`

Quando o arquivo tem cabeçalho, o `DictReader` devolve cada linha como **dicionário**, com as chaves vindas da primeira linha. O código fica legível e para de depender da posição das colunas:

```python
import csv

with open("/tmp/lancamentos.csv", encoding="utf-8", newline="") as f:
    for reg in csv.DictReader(f, delimiter=";"):
        print(reg["data"], reg["historico"], float(reg["valor"]))

# 2026-03-01 Recebimento cliente A 15000.0
# 2026-03-02 Aluguel -3500.0
# 2026-03-05 Energia elétrica -820.45
```

Se a planilha ganhar uma coluna nova no meio, `reg["valor"]` continua funcionando. Com `linha[3]`, você teria de corrigir todos os índices.

### Escrevendo com `csv.writer` e `csv.DictWriter`

```python
import csv

dados = [
    ["conta", "saldo"],
    ["1.1.01", 15000.00],
    ["3.1.02", -3500.00],
]
with open("/tmp/saldos.csv", "w", encoding="utf-8", newline="") as f:
    escritor = csv.writer(f, delimiter=";")
    escritor.writerows(dados)           # várias linhas de uma vez
    # escritor.writerow(["3.1.05", -820.45])  # ou uma por vez

# Com dicionários:
registros = [{"conta": "1.1.01", "saldo": 15000.0}, {"conta": "3.1.02", "saldo": -3500.0}]
with open("/tmp/saldos2.csv", "w", encoding="utf-8", newline="") as f:
    w = csv.DictWriter(f, fieldnames=["conta", "saldo"], delimiter=";")
    w.writeheader()
    w.writerows(registros)
```

### Trabalhando sem arquivo: `io.StringIO`

Para testar código de CSV sem gravar nada em disco, use `io.StringIO`, que é "um arquivo na memória":

```python
import csv, io

texto = "conta;valor\n1.1.01;100.50\n1.1.02;200.00\n"
total = sum(float(r["valor"]) for r in csv.DictReader(io.StringIO(texto), delimiter=";"))
print(total)   # 300.5
```

## JSON: dados estruturados

JSON (*JavaScript Object Notation*) representa dicionários, listas, strings, números, booleanos e nulo em texto. É o formato de resposta de quase toda API (consulta de CNPJ, bancos, meios de pagamento) e de muitos arquivos de configuração.

```json
{
  "empresa": "Padaria Pão Quente",
  "cnpj": "12.345.678/0001-90",
  "regime": "Simples Nacional",
  "socios": ["Ana", "Carlos"],
  "ativa": true,
  "matriz": null
}
```

A correspondência com Python é direta:

| JSON | Python |
|------|--------|
| `{}` objeto | `dict` |
| `[]` array | `list` |
| `"texto"` | `str` |
| `12.5` | `float` / `int` |
| `true` / `false` | `True` / `False` |
| `null` | `None` |

### As quatro funções do módulo `json`

A regra para lembrar: **s** de *string*. `dumps`/`loads` trabalham com strings; `dump`/`load` trabalham com arquivos.

```python
import json

empresa = {"nome": "Padaria Pão Quente", "cnpj": "12.345.678/0001-90", "socios": ["Ana", "Carlos"], "ativa": True}

# dict -> string JSON
texto = json.dumps(empresa, ensure_ascii=False, indent=2)
print(texto)
# {
#   "nome": "Padaria Pão Quente",
#   "cnpj": "12.345.678/0001-90",
#   "socios": [
#     "Ana",
#     "Carlos"
#   ],
#   "ativa": true
# }

# string JSON -> dict
de_volta = json.loads(texto)
print(de_volta["socios"][0])     # Ana
print(type(de_volta["ativa"]))   # <class 'bool'>

# dict -> arquivo
with open("/tmp/empresa.json", "w", encoding="utf-8") as f:
    json.dump(empresa, f, ensure_ascii=False, indent=2)

# arquivo -> dict
with open("/tmp/empresa.json", encoding="utf-8") as f:
    lido = json.load(f)
print(lido == empresa)           # True
```

`ensure_ascii=False` mantém os acentos legíveis (sem ele, "Pão" vira `"P\u00e3o"`, que é válido mas ilegível). `indent=2` formata com quebras de linha e recuo, colocando cada item de lista e cada chave em uma linha própria; sem ele, sai tudo numa linha só, o que é ótimo para transmitir e péssimo para ler.

> **Dica:** JSON não aceita tudo. Datas (`datetime`), `Decimal`, conjuntos (`set`) e objetos de classes suas disparam `TypeError: Object of type ... is not JSON serializable`. Converta antes: `str(data)`, `float(decimal)`, `list(conjunto)`.

Outra pegadinha: as **chaves** de um objeto JSON são sempre strings. Se você gravar `{1: "janeiro"}`, ao ler de volta terá `{"1": "janeiro"}`.

## Exemplo completo: resumo de lançamentos contábeis

Vamos ler o CSV de lançamentos, totalizar por conta e gravar o resumo em JSON.

```python
import csv, json, io

csv_texto = """data;conta;historico;valor
2026-03-01;1.1.01;Recebimento cliente A;15000.00
2026-03-02;3.1.02;Aluguel;-3500.00
2026-03-05;3.1.05;Energia elétrica;-820.45
2026-03-10;1.1.01;Recebimento cliente B;7200.00
2026-03-15;3.1.05;Energia elétrica (ajuste);-110.00
"""

totais = {}
quantidade = {}
for reg in csv.DictReader(io.StringIO(csv_texto), delimiter=";"):
    conta = reg["conta"]
    valor = float(reg["valor"])
    totais[conta] = totais.get(conta, 0.0) + valor
    quantidade[conta] = quantidade.get(conta, 0) + 1

resumo = {
    "periodo": "2026-03",
    "contas": [
        {"conta": c, "lancamentos": quantidade[c], "total": round(totais[c], 2)}
        for c in sorted(totais)
    ],
    "saldo_geral": round(sum(totais.values()), 2),
}

print(json.dumps(resumo, ensure_ascii=False, indent=2))
# {
#   "periodo": "2026-03",
#   "contas": [
#     {
#       "conta": "1.1.01",
#       "lancamentos": 2,
#       "total": 22200.0
#     },
#     {
#       "conta": "3.1.02",
#       "lancamentos": 1,
#       "total": -3500.0
#     },
#     {
#       "conta": "3.1.05",
#       "lancamentos": 2,
#       "total": -930.45
#     }
#   ],
#   "saldo_geral": 17769.55
# }
```

Em cinco minutos, um CSV exportado do sistema virou um resumo estruturado que pode alimentar outro programa, um painel ou um e-mail automático.

## Erros comuns

- **Esquecer `delimiter=";"`** em arquivos brasileiros: o `csv` assume vírgula e devolve cada linha como uma lista de um único elemento gigante.
- **Esquecer `newline=""`** ao abrir o arquivo para o `csv`: no Windows, aparecem linhas em branco entre os registros.
- **Tratar valores como número sem converter**: `reg["valor"] + 10` dá `TypeError` porque é string. Use `float()`.
- **Valor com vírgula decimal** (`820,45`): `float("820,45")` falha. Faça `float(v.replace(",", "."))`.
- **Confundir `dump` e `dumps`**: `json.dumps(dados, f)` dá erro estranho porque o segundo argumento de `dumps` não é um arquivo.
- **Esquecer `ensure_ascii=False`** e entregar um JSON cheio de `\u00e7` no lugar de `ç` para alguém ler.
- **Serializar `datetime` ou `Decimal` direto** sem converter para `str` ou `float`.

## Na prática

Praticamente toda integração passa por CSV ou JSON: o relatório que o sistema contábil exporta vem em CSV com `;`, e a consulta de um CNPJ em uma API devolve JSON. Um script que lê o CSV com `DictReader`, totaliza e grava um JSON de resumo substitui horas de planilha e pode rodar todo mês sem mudanças.

## Resumo

- `csv.reader` devolve listas; `csv.DictReader` devolve dicionários com as chaves do cabeçalho. Sempre abra com `newline=""` e, no Brasil, `delimiter=";"`.
- `csv.writer`/`csv.DictWriter` gravam; `writerow` escreve uma linha, `writerows` várias.
- Tudo lido de um CSV é **string**: converta números e datas você mesmo.
- `json.dumps`/`json.loads` convertem entre objetos Python e **strings**; `json.dump`/`json.load` fazem o mesmo com **arquivos**.
- Use `ensure_ascii=False` e `indent=2` para JSON legível; converta datas, `Decimal` e `set` antes de serializar.
