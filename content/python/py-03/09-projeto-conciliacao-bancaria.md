# Projeto guiado: conciliação bancária

Chegou a hora de juntar tudo o que você viu no módulo em um programa de verdade. A **conciliação bancária** compara o extrato do banco com os lançamentos registrados na contabilidade e aponta o que não bate: cheques não compensados, tarifas não contabilizadas, valores digitados errados. Vamos ler dois CSVs, modelar com dataclasses, casar os registros por data e valor e gerar um relatório de divergências, tratando os erros que aparecem no caminho.

## O problema

Temos dois arquivos:

**extrato.csv** (exportado do banco):

```
data;historico;valor
2026-03-02;PIX RECEBIDO PADARIA;1500.00
2026-03-03;TARIFA PACOTE SERVICOS;-45.90
2026-03-05;PAGTO FORNECEDOR XYZ;-820.45
2026-03-10;TED RECEBIDA OFICINA;800.00
```

**lancamentos.csv** (do sistema contábil):

```
data;conta;historico;valor
2026-03-02;1.1.02;Recebimento NF 101 Padaria;1500,00
2026-03-05;2.1.01;Pagamento fornecedor XYZ;-820,45
2026-03-10;1.1.02;Recebimento NF 102 Oficina;850,00
2026-03-12;2.1.03;Pagamento energia;-310,00
```

Repare nos problemas reais: o extrato usa ponto decimal, o sistema usa vírgula; a tarifa de R$ 45,90 não foi contabilizada; a TED da Oficina veio como 800 no banco e 850 na contabilidade (erro de digitação); e o pagamento de energia do dia 12 ainda não saiu da conta.

## Passo 1: modelar com dataclasses

Cada movimento, venha do banco ou da contabilidade, tem data, valor e histórico. Uma dataclass `frozen` serve bem, porque um movimento não muda depois de lido:

```python
from dataclasses import dataclass
from datetime import date

@dataclass(frozen=True)
class Movimento:
    data: date
    valor: float
    historico: str
    origem: str          # "banco" ou "contabil"

    @property
    def chave(self):
        # Casamos por data + valor em centavos (evita 0.1 + 0.2 != 0.3)
        return (self.data, round(self.valor * 100))
```

A propriedade `chave` concentra a regra de casamento num só lugar. Se amanhã quisermos tolerar diferença de um dia, mudamos aqui.

## Passo 2: converter os campos com tratamento de erro

Datas e valores chegam como string e com formatos diferentes. Funções pequenas, que lançam exceções claras, deixam a leitura robusta:

```python
class ErroDeLeitura(Exception):
    """Linha do CSV que não pôde ser interpretada."""

def converter_valor(texto):
    limpo = texto.strip().replace("R$", "").replace(" ", "")
    if "," in limpo:                       # formato brasileiro: 1.234,56
        limpo = limpo.replace(".", "").replace(",", ".")
    try:
        return float(limpo)
    except ValueError:
        raise ErroDeLeitura(f"valor inválido: {texto!r}") from None

def converter_data(texto):
    try:
        return date.fromisoformat(texto.strip())      # aceita 2026-03-02
    except ValueError:
        pass
    try:
        d, m, a = texto.strip().split("/")            # aceita 02/03/2026
        return date(int(a), int(m), int(d))
    except (ValueError, AttributeError):
        raise ErroDeLeitura(f"data inválida: {texto!r}") from None

print(converter_valor("1.500,00"), converter_valor("-820.45"))   # 1500.0 -820.45
print(converter_data("02/03/2026"))                             # 2026-03-02
```

Repare na tradução de erros: capturamos o `ValueError` genérico do Python e lançamos um `ErroDeLeitura` nosso, com uma mensagem no vocabulário do negócio e apontando o texto problemático. Quem chama essas funções só precisa conhecer uma exceção. O `from None` no final do `raise` é um detalhe de acabamento: sem ele, o traceback mostraria também o `ValueError` original ("During handling of the above exception, another exception occurred"), o que só confunde quem lê.

## Passo 3: ler os CSVs

Uma única função de leitura serve para os dois arquivos, porque ambos têm as colunas `data`, `historico` e `valor`. Linhas defeituosas são registradas, não engolidas:

```python
import csv, io

def ler_movimentos(texto_csv, origem):
    movimentos = []
    problemas = []
    leitor = csv.DictReader(io.StringIO(texto_csv), delimiter=";")
    for n, reg in enumerate(leitor, start=2):      # linha 1 é o cabeçalho
        try:
            mov = Movimento(
                data=converter_data(reg["data"]),
                valor=converter_valor(reg["valor"]),
                historico=reg["historico"].strip(),
                origem=origem,
            )
        except ErroDeLeitura as e:
            problemas.append(f"{origem} linha {n}: {e}")
        except KeyError as e:
            problemas.append(f"{origem} linha {n}: coluna ausente {e}")
        else:
            movimentos.append(mov)
    return movimentos, problemas
```

Em um programa real, `texto_csv` viria de `open(caminho, encoding="utf-8", newline="").read()`; usar `io.StringIO` aqui permite testar sem disco. A estrutura `try/except/else` mantém o `try` restrito às conversões e deixa claro que `append` só acontece quando tudo deu certo.

## Passo 4: casar por data + valor

A ideia é construir um dicionário `chave -> lista de movimentos` para cada lado e comparar as chaves. Usamos lista porque pode haver dois movimentos idênticos no mesmo dia (duas vendas de R$ 100,00).

```python
from collections import defaultdict

def agrupar(movimentos):
    grupos = defaultdict(list)
    for m in movimentos:
        grupos[m.chave].append(m)
    return grupos

def conciliar(banco, contabil):
    g_banco = agrupar(banco)
    g_contabil = agrupar(contabil)
    conciliados, so_banco, so_contabil = [], [], []

    for chave in set(g_banco) | set(g_contabil):
        lb = g_banco.get(chave, [])
        lc = g_contabil.get(chave, [])
        pares = min(len(lb), len(lc))
        conciliados.extend(zip(lb[:pares], lc[:pares]))
        so_banco.extend(lb[pares:])
        so_contabil.extend(lc[pares:])

    def ordem(m):
        return (m.data, m.valor)

    return conciliados, sorted(so_banco, key=ordem), sorted(so_contabil, key=ordem)
```

`set(g_banco) | set(g_contabil)` é a união das chaves dos dois lados. Para cada chave, casamos quantos pares forem possíveis e o que sobrar vira divergência. A função `ordem`, definida dentro de `conciliar`, serve só como chave de ordenação (poderia ser uma `lambda`, mas o guia de estilo do Python prefere `def` quando a função recebe um nome). (`defaultdict` será visto a fundo no módulo 4; aqui basta saber que ele cria a lista automaticamente na primeira vez que a chave aparece.)

## Passo 5: o relatório

```python
def relatorio(conciliados, so_banco, so_contabil, problemas):
    linhas = []
    linhas.append("=== CONCILIAÇÃO BANCÁRIA ===")
    linhas.append(f"Conciliados: {len(conciliados)}")
    linhas.append(f"Só no banco (falta contabilizar): {len(so_banco)}")
    for m in so_banco:
        linhas.append(f"  {m.data:%d/%m/%Y}  {m.valor:>12,.2f}  {m.historico}")
    linhas.append(f"Só na contabilidade (não compensado ou valor errado): {len(so_contabil)}")
    for m in so_contabil:
        linhas.append(f"  {m.data:%d/%m/%Y}  {m.valor:>12,.2f}  {m.historico}")
    if problemas:
        linhas.append(f"Linhas ignoradas por erro: {len(problemas)}")
        for p in problemas:
            linhas.append(f"  - {p}")
    return "\n".join(linhas)
```

## Juntando tudo

Com todas as funções acima no mesmo arquivo, o programa principal fica assim:

```python
EXTRATO = """data;historico;valor
2026-03-02;PIX RECEBIDO PADARIA;1500.00
2026-03-03;TARIFA PACOTE SERVICOS;-45.90
2026-03-05;PAGTO FORNECEDOR XYZ;-820.45
2026-03-10;TED RECEBIDA OFICINA;800.00
"""
LANCAMENTOS = """data;conta;historico;valor
2026-03-02;1.1.02;Recebimento NF 101 Padaria;1500,00
2026-03-05;2.1.01;Pagamento fornecedor XYZ;-820,45
2026-03-10;1.1.02;Recebimento NF 102 Oficina;850,00
2026-03-12;2.1.03;Pagamento energia;-310,00
31/02/2026;2.1.03;Linha quebrada;abc
"""

banco, prob1 = ler_movimentos(EXTRATO, "banco")
contabil, prob2 = ler_movimentos(LANCAMENTOS, "contabil")
c, sb, sc = conciliar(banco, contabil)
print(relatorio(c, sb, sc, prob1 + prob2))
```

Saída:

```
=== CONCILIAÇÃO BANCÁRIA ===
Conciliados: 2
Só no banco (falta contabilizar): 2
  03/03/2026        -45.90  TARIFA PACOTE SERVICOS
  10/03/2026        800.00  TED RECEBIDA OFICINA
Só na contabilidade (não compensado ou valor errado): 2
  10/03/2026        850.00  Recebimento NF 102 Oficina
  12/03/2026       -310.00  Pagamento energia
Linhas ignoradas por erro: 1
  - contabil linha 6: data inválida: '31/02/2026'
```

O relatório conta a história completa: a tarifa precisa ser lançada, a NF 102 tem valor errado em um dos lados, a energia ainda não compensou e uma linha do CSV estava corrompida (e foi reportada, não escondida).

## Decisões de projeto que valem a pena entender

Alguns detalhes do código não são acidentais e merecem um comentário.

**Por que `frozen=True` no `Movimento`?** Porque um movimento lido do extrato é um fato: não faz sentido alterá-lo depois. Congelar a dataclass impede que uma função, por descuido, mude a data de um registro no meio da conciliação. De quebra, o objeto vira *hashable*, o que permitiria colocá-lo num `set` se fosse preciso.

**Por que o `origem` está no objeto?** Para que, no relatório e nas mensagens de erro, saibamos de qual arquivo veio cada movimento sem precisar carregar duas listas separadas por todo lado. É um campo pequeno que evita confusão.

**Por que registrar problemas em vez de parar?** Um arquivo real de extrato pode ter mil linhas e uma delas corrompida. Se o programa parasse na linha ruim, você não teria relatório nenhum. Registrar e continuar entrega o resultado das 999 linhas boas e ainda aponta exatamente qual precisa ser corrigida. Esse comportamento tolerante só é aceitável porque **nada é escondido**: a contagem de linhas ignoradas aparece no relatório.

**Por que `enumerate(leitor, start=2)`?** A primeira linha do arquivo é o cabeçalho, consumido pelo `DictReader`. Começando a contagem em 2, o número reportado corresponde à linha que a pessoa vê ao abrir o CSV no editor, o que facilita a correção.

## O que você usou

| Recurso | Onde |
|---------|------|
| `csv.DictReader`, `io.StringIO` | leitura dos arquivos |
| `@dataclass(frozen=True)`, `@property` | modelo `Movimento` e sua `chave` |
| exceção própria, `try/except/else` | conversões e leitura tolerante a falhas |
| `defaultdict`, `set`, `zip`, `sorted` com `key=` | casamento dos movimentos |
| f-strings com formatação de data e número | relatório |

## Para ir além

- Tolerar diferença de até 1 dia na data (compensação de cheque) ou de centavos no valor.
- Casar também pelo histórico usando `in` ou `difflib.SequenceMatcher`.
- Gravar as divergências em um CSV com `csv.DictWriter` para abrir no Excel.
- Ler os arquivos reais com `pathlib.Path(...).read_text(encoding="utf-8")`.
- Escrever testes automáticos para `converter_valor` e `conciliar` (módulo 4).

## Erros comuns

- **Casar pelo `float` direto** em vez de centavos inteiros: diferenças de arredondamento impedem o casamento.
- **Agrupar em `set` em vez de `dict` de listas**: dois movimentos iguais no mesmo dia viram um só e a conciliação perde um deles.
- **Parar na primeira linha inválida** e ficar sem relatório; registre e siga.
- **Esquecer que a data pode vir em dois formatos** (`2026-03-02` e `02/03/2026`) e rejeitar linhas válidas.

## Na prática

A conciliação mensal é uma das tarefas mais repetitivas do escritório. Com os dois CSVs exportados, este script aponta em segundos a tarifa não lançada e a nota com valor digitado errado; o contador só precisa olhar as divergências, não as centenas de linhas que bateram.

## Resumo

- Modele os dados com dataclasses imutáveis e concentre regras (como a chave de casamento) em propriedades.
- Converta texto em data e número com funções pequenas que lançam exceções específicas e informativas.
- Leia com `DictReader`, registre as linhas problemáticas e siga em frente: relatório com avisos é melhor que programa que para na linha 300.
- Agrupe por chave em dicionários e compare conjuntos de chaves para encontrar o que sobra de cada lado.
- Um relatório claro, com contagens e detalhes, é o produto final; o código é só o meio.
