Neste projeto você vai juntar tudo que aprendeu no módulo num robô completo: ler o extrato bancário (OFX ou CSV), ler os lançamentos da planilha do escritório, casar cada movimento por data e valor, gerar um relatório de divergências em Excel, enviar um resumo por e-mail e deixar tudo agendado para rodar todo dia. Isso importa porque a conciliação bancária é a tarefa mais repetitiva e mais sujeita a erro do fechamento, e porque este robô é o modelo de arquitetura que você vai reaproveitar em qualquer automação futura.

## Arquitetura

Antes de escrever código, desenhe o fluxo em etapas que não se misturam:

```
extrato (OFX/CSV)  --> ler_ofx()         --> lista de movimentos
planilha (.xlsx)   --> ler_lancamentos() --> lista de lançamentos
                        casar()          --> conciliados, só_extrato, só_planilha
                        gerar_relatorio()--> divergencias_AAAA-MM.xlsx
                        enviar_resumo()  --> e-mail
                        main() + argparse + logging + agendador
```

Cada função recebe dados e devolve dados; só `main` sabe de arquivos, e-mail e log. Essa separação permite testar `casar()` sem banco, sem planilha e sem rede, exatamente como o exercício desta lição faz.

A pasta do projeto segue a lição 1:

```
C:\automacoes\conciliacao\
  .venv\  .env  requirements.txt  robo.py  conciliacao.py  test_conciliacao.py
  entrada\   saida\   robo.log
```

`conciliacao.py` guarda as funções puras; `robo.py` orquestra; `test_conciliacao.py` testa.

## Parte 1: ler o extrato

OFX é o formato que os bancos exportam. Por dentro é texto com tags, uma transação por bloco `<STMTTRN>`:

```python
import re
from datetime import datetime

def ler_ofx(texto):
    """Devolve lista de dicts {data, valor, descricao, id} a partir do conteúdo OFX."""
    movimentos = []
    for bloco in re.findall(r"<STMTTRN>(.*?)</STMTTRN>", texto, re.S):
        def campo(tag):
            """valor da tag dentro do bloco: tudo até o próximo < ou quebra de linha"""
            m = re.search(rf"<{tag}>([^<\r\n]+)", bloco)
            return m.group(1).strip() if m else ""
        data = datetime.strptime(campo("DTPOSTED")[:8], "%Y%m%d").date()
        movimentos.append({"data": data, "valor": float(campo("TRNAMT")),
                           "descricao": campo("MEMO"), "id": campo("FITID")})
    return movimentos

exemplo = """<STMTTRN><TRNTYPE>DEBIT<DTPOSTED>20260305120000[-3:BRT]<TRNAMT>-150.00
<FITID>2026030501<MEMO>PAG FORNECEDOR XYZ</STMTTRN>
<STMTTRN><TRNTYPE>CREDIT<DTPOSTED>20260306<TRNAMT>2500.00<FITID>2026030602<MEMO>PIX RECEBIDO</STMTTRN>"""
for m in ler_ofx(exemplo):
    print(m)
```

Saída:

```
{'data': datetime.date(2026, 3, 5), 'valor': -150.0, 'descricao': 'PAG FORNECEDOR XYZ', 'id': '2026030501'}
{'data': datetime.date(2026, 3, 6), 'valor': 2500.0, 'descricao': 'PIX RECEBIDO', 'id': '2026030602'}
```

`re.S` faz o `.` casar quebras de linha; a função `campo` lê o valor de uma tag (OFX não fecha as tags, por isso o valor vai até o próximo `<` ou quebra de linha); `[:8]` pega só `AAAAMMDD` da data, ignorando hora e fuso. Em OFX o valor já vem com ponto decimal e sinal (negativo = saída). Se o banco só exportar CSV, use `csv.DictReader` com `delimiter=";"` e converta o valor brasileiro como na lição 4. Existem bibliotecas prontas para OFX (`ofxtools`, por exemplo), mas para extratos de bancos brasileiros esse leitor de vinte linhas costuma ser mais previsível.

## Parte 2: ler os lançamentos

A planilha do escritório tem colunas `data`, `historico`, `valor` (positivo entrada, negativo saída). Com pandas, três linhas:

```python
import pandas as pd

def ler_lancamentos(caminho):
    df = pd.read_excel(caminho)
    df["data"] = pd.to_datetime(df["data"], dayfirst=True).dt.date
    return df.to_dict("records")       # lista de dicts, uma por linha
```

`dayfirst=True` interpreta `05/03/2026` como 5 de março; `.dt.date` descarta a hora para casar com o OFX. `to_dict("records")` entrega o mesmo formato de lista de dicionários do extrato, para as duas fontes entrarem iguais na função de casamento.

## Parte 3: casar por data e valor

A regra: um movimento do extrato casa com um lançamento se tiverem o **mesmo valor** (arredondado em centavos) e a **mesma data**, com tolerância de alguns dias para compensação de boleto e cartão. Cada lançamento só pode ser usado uma vez.

```python
from datetime import date

def casar(extrato, lancamentos, tolerancia_dias=2):
    usados = set()
    conciliados, so_extrato = [], []
    for mov in extrato:
        achou = None
        for i, lan in enumerate(lancamentos):
            if i in usados:
                continue
            mesmo_valor = round(mov["valor"], 2) == round(lan["valor"], 2)
            dias = abs((mov["data"] - lan["data"]).days)
            if mesmo_valor and dias <= tolerancia_dias:
                achou = i
                break
        if achou is None:
            so_extrato.append(mov)
        else:
            usados.add(achou)
            conciliados.append((mov, lancamentos[achou]))
    so_planilha = [lan for i, lan in enumerate(lancamentos) if i not in usados]
    return conciliados, so_extrato, so_planilha

extrato = [{"data": date(2026, 3, 5), "valor": -150.0, "descricao": "PAG XYZ"},
           {"data": date(2026, 3, 6), "valor": 2500.0, "descricao": "PIX"}]
planilha = [{"data": date(2026, 3, 4), "valor": -150.0, "historico": "Fornecedor XYZ"},
            {"data": date(2026, 3, 10), "valor": -80.0, "historico": "Tarifa"}]
c, se, sp = casar(extrato, planilha)
print(len(c), "conciliados;", len(se), "só no extrato;", len(sp), "só na planilha")
```

Saída: `1 conciliados; 1 só no extrato; 1 só na planilha`. O `set` de índices usados impede que dois movimentos de R$ 150,00 casem com o mesmo lançamento. Quando houver vários candidatos, o laço pega o primeiro livre; uma melhoria é ordenar por proximidade de data antes de escolher.

## Parte 4: relatório em Excel

```python
from openpyxl import Workbook
from openpyxl.styles import Font

def gerar_relatorio(caminho, conciliados, so_extrato, so_planilha):
    wb = Workbook()
    abas = {"Conciliados": [["Data", "Valor", "Extrato", "Planilha"]],
            "So no extrato": [["Data", "Valor", "Descrição"]],
            "So na planilha": [["Data", "Valor", "Histórico"]]}
    for mov, lan in conciliados:
        abas["Conciliados"].append([mov["data"], mov["valor"], mov["descricao"], lan["historico"]])
    for mov in so_extrato:
        abas["So no extrato"].append([mov["data"], mov["valor"], mov["descricao"]])
    for lan in so_planilha:
        abas["So na planilha"].append([lan["data"], lan["valor"], lan["historico"]])
    wb.remove(wb.active)
    for nome, linhas in abas.items():
        ws = wb.create_sheet(nome)
        for linha in linhas:
            ws.append(linha)
        for celula in ws[1]:
            celula.font = Font(bold=True)
        for linha in ws.iter_rows(min_row=2, min_col=2, max_col=2):
            linha[0].number_format = 'R$ #,##0.00'
        ws.column_dimensions["C"].width = 40
    wb.save(caminho)
```

Três abas, cabeçalho em negrito, coluna de valor formatada. É o arquivo que o contador abre para resolver as divergências; o robô não decide nada sozinho.

## Parte 5: e-mail, orquestração e agendamento

Este bloco é o `robo.py`: ele importa as funções puras de `conciliacao.py` (que fica na mesma pasta) e só roda dentro do projeto.

```python
import argparse, logging, sys
from datetime import date
from pathlib import Path
from conciliacao import ler_ofx, ler_lancamentos, casar, gerar_relatorio, enviar

def main():
    parser = argparse.ArgumentParser(description="Conciliação bancária diária")
    parser.add_argument("--competencia", default=date.today().strftime("%Y-%m"))
    parser.add_argument("--simular", action="store_true")
    args = parser.parse_args()
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s",
                        handlers=[logging.FileHandler("robo.log", encoding="utf-8"), logging.StreamHandler()])
    try:
        extrato = ler_ofx(Path(f"entrada/extrato_{args.competencia}.ofx").read_text(encoding="latin-1"))
        lancamentos = ler_lancamentos(f"entrada/lancamentos_{args.competencia}.xlsx")
        c, se, sp = casar(extrato, lancamentos)
        saida = f"saida/divergencias_{args.competencia}.xlsx"
        gerar_relatorio(saida, c, se, sp)
        resumo = f"{len(c)} conciliados, {len(se)} só no extrato, {len(sp)} só na planilha"
        logging.info(resumo)
        if not args.simular and (se or sp):
            enviar("contador@escritorio.com.br", f"Conciliação {args.competencia}", resumo, [saida])
    except FileNotFoundError as e:
        logging.error("arquivo não encontrado: %s", e)
        sys.exit(1)
    except Exception:
        logging.exception("falha inesperada")
        sys.exit(1)
```

`enviar` é a função da lição 5, copiada para `conciliacao.py`. O e-mail só sai quando há divergência e quando não está em `--simular`. O agendamento é o da lição 8: Agendador às 07:30, Python do `.venv`, "Iniciar em" na pasta do projeto.

## Parte 6: testes

Funções puras se testam com `pytest` (`pip install pytest`), em `test_conciliacao.py`:

```python
from datetime import date
from conciliacao import casar

def test_casa_mesmo_valor_dentro_da_tolerancia():
    e = [{"data": date(2026, 3, 5), "valor": -150.0, "descricao": "x"}]
    p = [{"data": date(2026, 3, 6), "valor": -150.0, "historico": "y"}]
    c, se, sp = casar(e, p)
    assert len(c) == 1 and not se and not sp

def test_nao_reusa_lancamento():
    e = [{"data": date(2026, 3, 5), "valor": -150.0, "descricao": "a"},
         {"data": date(2026, 3, 5), "valor": -150.0, "descricao": "b"}]
    p = [{"data": date(2026, 3, 5), "valor": -150.0, "historico": "y"}]
    c, se, sp = casar(e, p)
    assert len(c) == 1 and len(se) == 1
```

Rode com `pytest` na pasta do projeto. Cada regra de negócio nova (tolerância, centavos, sinal) ganha um teste antes de entrar no robô.

## Erros comuns

- Comparar `float` sem arredondar: `0.1 + 0.2 != 0.3`. Sempre `round(x, 2)`.
- Esquecer o fuso da data do OFX e casar um dia errado: use só `AAAAMMDD`.
- Deixar o robô "resolver" divergências sozinho: ele reporta; o contador decide.
- Testar só com o arquivo real: crie extratos mínimos de teste com os casos difíceis.

## Na prática

No dia a dia do escritório, o fluxo fica assim: no fim da tarde, quem cuida do financeiro do cliente baixa o OFX do internet banking e salva em `entrada\` com o nome da competência; às 07:30 o robô roda, grava `robo.log` e, se houver divergência, o contador recebe o e-mail com a planilha anexa. Ele abre a aba "Só no extrato" (tarifas, juros e PIX que ninguém lançou) e a aba "Só na planilha" (lançamento duplicado ou com data errada), resolve no sistema contábil e segue para o próximo cliente. O que antes tomava uma manhã por empresa vira dez minutos de conferência; e cada regra nova que o contador pede entra como um teste em `test_conciliacao.py`.

## Resumo

- Arquitetura em funções puras (`ler_ofx`, `ler_lancamentos`, `casar`, `gerar_relatorio`) mais um `main` que cuida de arquivos, log e e-mail.
- OFX é texto com `<STMTTRN>`; vinte linhas de regex leem; valor com ponto e sinal.
- Casar por valor arredondado e data com tolerância, sem reusar lançamento.
- Relatório com três abas é o produto; o e-mail só sai quando há divergência.
- Testes com pytest protegem a regra de casamento a cada mudança.
