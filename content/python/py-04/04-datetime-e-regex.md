# datetime e expressões regulares

Datas e textos padronizados estão em tudo o que passa pela mesa de um contador: vencimentos, competências, prazos de entrega, CPFs, CNPJs, valores no meio de um e-mail. Nesta lição você vai dominar o módulo `datetime` (datas, horas, durações, formatação, fusos com `zoneinfo`) e as **expressões regulares** do módulo `re`, para validar documentos formatados e extrair valores de texto livre.

## `datetime`: as quatro classes

| Classe | Representa | Exemplo |
|--------|------------|---------|
| `date` | um dia | 2026-03-10 |
| `time` | um horário sem dia | 14:30:00 |
| `datetime` | dia e horário | 2026-03-10 14:30:00 |
| `timedelta` | uma duração | 30 dias, 2 horas |

```python
from datetime import date, datetime, timedelta

hoje = date(2026, 3, 10)
agora = datetime(2026, 3, 10, 14, 30)
print(hoje.year, hoje.month, hoje.day)     # 2026 3 10
print(hoje.weekday())                      # 1  (segunda=0 ... domingo=6)
print(agora.hour, agora.minute)            # 14 30
print(date.today())                        # data atual do sistema
print(datetime.now())                      # data e hora atuais
```

### Aritmética com `timedelta`

Os blocos desta seção continuam usando `hoje`, `agora` e os imports do bloco anterior.

```python
vencimento = hoje + timedelta(days=30)
print(vencimento)                          # 2026-04-09
atraso = date(2026, 4, 20) - vencimento
print(atraso.days)                         # 11
print(type(atraso))                        # <class 'datetime.timedelta'>

prazo = timedelta(hours=48)
print(agora + prazo)                       # 2026-03-12 14:30:00
print(timedelta(days=1, hours=12).total_seconds())   # 129600.0
```

Data menos data dá `timedelta`; data mais `timedelta` dá data. Não existe `timedelta(months=1)`: meses têm tamanhos diferentes. Para "mesmo dia do mês seguinte", calcule manualmente ou use `replace`:

```python
def mes_seguinte(d):
    ano, mes = (d.year + 1, 1) if d.month == 12 else (d.year, d.month + 1)
    return d.replace(year=ano, month=mes, day=1)

print(mes_seguinte(date(2026, 12, 15)))    # 2027-01-01
```

Juros de mora, por exemplo, ficam triviais:

```python
def juros_mora(valor, vencimento, pagamento, taxa_dia=0.00033):
    dias = (pagamento - vencimento).days
    return round(valor * taxa_dia * dias, 2) if dias > 0 else 0.0

print(juros_mora(1000.0, date(2026, 3, 10), date(2026, 3, 25)))   # 4.95
```

### `strftime`: data para texto

```python
d = datetime(2026, 3, 10, 14, 5)
print(d.strftime("%d/%m/%Y"))          # 10/03/2026
print(d.strftime("%d/%m/%Y %H:%M"))    # 10/03/2026 14:05
print(d.strftime("%Y-%m"))             # 2026-03  (competência)
print(d.strftime("%A, %d de %B"))      # Tuesday, 10 de March (nomes em inglês por padrão)
print(f"{d:%d/%m/%Y}")                 # 10/03/2026  (f-string aceita o mesmo formato)
```

Códigos mais usados: `%d` dia, `%m` mês, `%Y` ano com 4 dígitos, `%y` com 2, `%H` hora (24h), `%M` minuto, `%S` segundo, `%A` dia da semana, `%B` nome do mês. Para nomes em português, use `locale.setlocale(locale.LC_TIME, "pt_BR.UTF-8")` (depende do sistema ter o locale instalado).

### `strptime`: texto para data

```python
d = datetime.strptime("10/03/2026", "%d/%m/%Y")
print(d)               # 2026-03-10 00:00:00
print(d.date())        # 2026-03-10

venc = datetime.strptime("25/04/2026 23:59", "%d/%m/%Y %H:%M")
print(date.fromisoformat("2026-03-10"))     # atalho para o formato ISO
print(datetime.fromisoformat("2026-03-10T14:30:00"))
```

`strptime` é rigoroso: se o texto não bater exatamente com o formato, lança `ValueError`. Isso é bom para validar entradas.

### Fusos horários com `zoneinfo`

Um `datetime` sem fuso é "ingênuo" (*naive*). Para comparar horários de sistemas diferentes ou registrar o instante exato de uma transmissão, use fusos:

```python
from datetime import datetime, timezone
from zoneinfo import ZoneInfo

utc = datetime(2026, 3, 10, 17, 0, tzinfo=timezone.utc)
brasilia = utc.astimezone(ZoneInfo("America/Sao_Paulo"))
print(brasilia)                            # 2026-03-10 14:00:00-03:00
print(brasilia.strftime("%H:%M %Z"))       # 14:00 -03
agora_br = datetime.now(ZoneInfo("America/Sao_Paulo"))
```

Regra: armazene em UTC, exiba no fuso local. Nunca compare um `datetime` com fuso e outro sem (`TypeError`).

> **Atenção:** o `zoneinfo` usa o banco de fusos do sistema operacional. No Windows, que não o tem, instale o pacote `tzdata` (`pip install tzdata`); sem ele, `ZoneInfo("America/Sao_Paulo")` lança `ZoneInfoNotFoundError`.

## Expressões regulares com `re`

Uma **expressão regular** (regex) é um padrão que descreve um conjunto de textos: "três dígitos, ponto, três dígitos, ponto, três dígitos, hífen, dois dígitos" descreve um CPF formatado. O módulo `re` procura, valida, extrai e substitui com base nesses padrões.

### Os blocos básicos

| Padrão | Significa |
|--------|-----------|
| `\d` | um dígito (0-9) |
| `\w` | letra, dígito ou `_` |
| `\s` | espaço, tab, quebra de linha |
| `.` | qualquer caractere |
| `[abc]`, `[0-9]`, `[^x]` | um dos listados / intervalo / exceto x |
| `a*`, `a+`, `a?` | zero ou mais, um ou mais, zero ou um |
| `a{3}`, `a{2,4}` | exatamente 3, de 2 a 4 |
| `^`, `$` | início e fim do texto |
| `(...)` | grupo (captura) |
| `\|` | ou |

Caracteres especiais (`.`, `(`, `$`) precisam de barra invertida para serem literais: `\.`, `\(`, `\$`. Escreva padrões sempre como **raw strings** (`r"..."`) para que a barra invertida chegue intacta ao `re`.

### `match`, `search`, `fullmatch`

Os exemplos de regex a seguir usam o `import re` deste primeiro bloco.

```python
import re

padrao_cpf = r"\d{3}\.\d{3}\.\d{3}-\d{2}"

print(re.fullmatch(padrao_cpf, "123.456.789-09"))    # <re.Match ...>  (texto inteiro bate)
print(re.fullmatch(padrao_cpf, "123.456.789-0"))     # None
print(re.match(padrao_cpf, "123.456.789-09 Ana"))    # Match (bate no INÍCIO)
print(re.search(padrao_cpf, "CPF: 123.456.789-09"))  # Match (bate em QUALQUER lugar)
print(re.match(padrao_cpf, "CPF: 123.456.789-09"))   # None (não começa com o padrão)
```

- `fullmatch`: o texto inteiro precisa casar. Ideal para **validar formato**.
- `match`: casa a partir do início.
- `search`: encontra a primeira ocorrência em qualquer posição.

Todos devolvem um objeto `Match` (verdadeiro) ou `None`. Use `m.group()` para pegar o trecho.

```python
def cpf_formatado(texto):
    return re.fullmatch(r"\d{3}\.\d{3}\.\d{3}-\d{2}", texto) is not None

def cnpj_formatado(texto):
    return re.fullmatch(r"\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}", texto) is not None

print(cpf_formatado("123.456.789-09"), cnpj_formatado("12.345.678/0001-90"))   # True True
print(cnpj_formatado("12345678000190"))     # False (sem pontuação)
```

> **Atenção:** a regex valida o **formato**, não os dígitos verificadores. Um CPF `111.111.111-11` passa no padrão e é inválido. Para validar de verdade, calcule os dígitos (ótimo exercício).

### `findall`: extrair todas as ocorrências

```python
texto = "Pagar NF 101 R$ 1.500,00 e NF 102 R$ 820,45 até 10/03/2026."
print(re.findall(r"\d{2}/\d{2}/\d{4}", texto))         # ['10/03/2026']
print(re.findall(r"R\$ ?[\d.]+,\d{2}", texto))         # ['R$ 1.500,00', 'R$ 820,45']
print(re.findall(r"NF (\d+)", texto))                  # ['101', '102']  (só o grupo)
```

Quando há **um grupo**, `findall` devolve só o conteúdo dele; com vários grupos, devolve tuplas.

### Grupos: pegando as partes

```python
m = re.search(r"(\d{2})/(\d{2})/(\d{4})", "Vencimento: 10/03/2026")
print(m.group(0))            # 10/03/2026  (tudo)
print(m.group(1), m.group(3))   # 10 2026
print(m.groups())            # ('10', '03', '2026')

# Grupos nomeados: mais legíveis
m = re.search(r"(?P<dia>\d{2})/(?P<mes>\d{2})/(?P<ano>\d{4})", "10/03/2026")
print(m.group("ano"))        # 2026
print(m.groupdict())         # {'dia': '10', 'mes': '03', 'ano': '2026'}
```

### Extraindo valores em reais

```python
def extrair_valores(texto):
    achados = re.findall(r"R\$\s?(\d{1,3}(?:\.\d{3})*,\d{2})", texto)
    return [float(v.replace(".", "").replace(",", ".")) for v in achados]

print(extrair_valores("Total R$ 1.500,00; tarifa R$ 45,90; juros R$12,30"))
# [1500.0, 45.9, 12.3]
```

`(?:...)` é um grupo **sem captura**: agrupa para o `*` sem aparecer no resultado do `findall`. O padrão lê-se: "R$, espaço opcional, 1 a 3 dígitos, zero ou mais blocos de ponto+3 dígitos, vírgula, 2 dígitos".

### `sub`: substituir

```python
print(re.sub(r"\D", "", "123.456.789-09"))            # 12345678909 (remove tudo que não é dígito)
print(re.sub(r"\s+", " ", "muitos    espaços   aqui"))  # muitos espaços aqui
# Reformatar CNPJ limpo
limpo = "12345678000190"
print(re.sub(r"(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})", r"\1.\2.\3/\4-\5", limpo))
# 12.345.678/0001-90
```

`\D` é "não dígito"; `\1` na substituição refere-se ao grupo 1. Esse último padrão é o jeito mais rápido de formatar documentos.

### `compile` e flags

Se o mesmo padrão é usado milhares de vezes, compile uma vez:

```python
RE_CNPJ = re.compile(r"\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}")
print(bool(RE_CNPJ.fullmatch("12.345.678/0001-90")))   # True
print(re.findall(r"nota fiscal", "Nota Fiscal e NOTA FISCAL", flags=re.IGNORECASE))
# ['Nota Fiscal', 'NOTA FISCAL']
```

## Erros comuns

- **Esquecer o `r`** na string do padrão: `"\d"` gera `SyntaxWarning: invalid escape sequence` no Python 3.12, e `"\b"` ou `"\n"` viram outros caracteres antes de chegar ao `re`. Sempre `r"\d"`.
- **Usar `match` para validar o texto inteiro**: `match` aceita lixo depois do padrão. Use `fullmatch` ou `^...$`.
- **Não escapar o ponto**: `\d{3}.\d{3}` aceita `123X456`. Escreva `\.`.
- **Comparar `datetime` com e sem fuso**: `TypeError: can't compare offset-naive and offset-aware datetimes`.
- **`strptime` com formato errado**: `"%d/%m/%y"` para ano de 4 dígitos lança `ValueError`.
- **Achar que `timedelta` tem meses**: não tem; trabalhe com `replace` ou calcule.
- **Regex gigante para tudo**: se o padrão passou de uma linha, divida em etapas ou use funções de string (`split`, `startswith`).

## Na prática

Vencimentos, competências e juros de mora são `date` e `timedelta`; CPF, CNPJ e valores dentro de e-mails ou de PDFs convertidos em texto são trabalho para regex. Um script que extrai todos os `R$` de um texto com `findall` e valida CNPJs com `fullmatch` substitui a conferência manual de documentos que chegam fora de padrão.

## Resumo

- `date`, `datetime`, `timedelta`: aritmética de datas com `+` e `-`; `strftime` formata (`%d/%m/%Y`), `strptime` interpreta texto e valida formato.
- `zoneinfo.ZoneInfo("America/Sao_Paulo")` para fusos; armazene em UTC, exiba no local.
- `re.fullmatch` valida, `re.search` encontra, `re.findall` extrai todas as ocorrências, `re.sub` substitui; grupos `(...)` capturam partes, `(?P<nome>...)` dá nomes, `(?:...)` agrupa sem capturar.
- Padrões sempre em raw string `r"..."`; escape `.`, `$`, `(` com barra invertida.
- Regex valida formato de CPF/CNPJ, não os dígitos verificadores; para extrair valores em reais, capture `\d{1,3}(?:\.\d{3})*,\d{2}` e converta.
