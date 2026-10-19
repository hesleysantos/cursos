Nesta lição você vai aprender a depurar com o Claude Code sem virar refém dele: colar o traceback, exigir uma hipótese antes de qualquer correção, usar logs para enxergar o que o programa está fazendo, reproduzir o erro com um teste e reconhecer os dois bugs mais comuns no Windows, encoding e caminho de arquivo. Ao final, você corrige uma função com bug a partir de um teste que falha. Depurar bem é o que separa "o Claude consertou" de "eu entendi o que estava errado e o conserto está protegido por um teste".

## O traceback é a melhor pista

Quando um script Python quebra, ele imprime um **traceback**: a sequência de chamadas que levou ao erro, de cima (início do programa) para baixo (a linha que falhou), terminando com o tipo e a mensagem do erro. Exemplo:

```text
Traceback (most recent call last):
  File "consolidar.py", line 42, in <module>
    total = somar_valores(registros)
  File "consolidar.py", line 18, in somar_valores
    acumulado += registro["valor"]
TypeError: unsupported operand type(s) for +=: 'float' and 'str'
```

Leia de baixo para cima: o erro é `TypeError` ao somar `float` com `str`; aconteceu na linha 18, dentro de `somar_valores`; foi chamada na linha 42. Você já sabe que algum `registro["valor"]` chegou como texto. Cole o traceback inteiro no Claude Code, sem resumir: cada linha é informação.

## Hipótese antes da correção

O pedido mais importante desta lição:

```text
Este é o traceback ao rodar python consolidar.py 2026-10. Antes de alterar
qualquer arquivo, me dê: (1) sua hipótese sobre a causa raiz, (2) como você
confirmaria essa hipótese (qual print, log ou teste), (3) o que mudaria.
Aguarde meu ok.
```

Por que insistir nisso? Porque a correção mais rápida para o erro acima é `float(registro["valor"])` dentro de `somar_valores`, e ela esconde o problema real: a planilha trouxe `"R$ 1.234,56"` e a função de leitura não normalizou. Com a conversão forçada, o próximo erro será `ValueError` em outro lugar, ou pior, um valor silenciosamente errado. A hipótese obriga a olhar para a origem do dado.

## Logs: ver o que o programa viu

`print` serve para investigar na hora; `logging` serve para deixar o rastro permanente que você vai querer quando o robô rodar sozinho às 6h da manhã:

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
)
log = logging.getLogger(__name__)

registro = {"cliente": "Padaria", "valor": "R$ 1.234,56"}
log.info("Lendo registro de %s", registro["cliente"])
log.warning("Valor veio como texto: %r", registro["valor"])
```

`%r` mostra a representação do valor com aspas, então você enxerga a diferença entre `1234.56` e `'1234.56'`. Peça ao Claude Code: "adicione logs INFO na entrada e saída de cada função de leitura, com quantidade de linhas e exemplos dos três primeiros registros". Rode, leia o log, ache o ponto em que o dado ficou errado.

## Reproduzir com um teste

Depois que a hipótese está confirmada, transforme-a em teste **antes** da correção:

```text
Confirmado: a função ler_honorarios devolve valor como str quando a célula tem
"R$". Escreva um teste em tests/test_ler_honorarios.py que reproduza isso
(uma planilha gerada no teste com a célula "R$ 1.234,56") e espere valor ==
1234.56 como float. Rode e mostre a falha. Só então corrija ler_honorarios.
```

Esse teste é a garantia de que o bug não volta quando alguém mexer na leitura daqui a seis meses. Bug sem teste de regressão é bug que vai reaparecer.

## Dois bugs clássicos no Windows

**Encoding.** Arquivos CSV e TXT gerados por sistemas antigos costumam vir em `cp1252` (o "Windows Latin-1"); o padrão do Python para abrir arquivos no Windows pode variar, e o resultado é `UnicodeDecodeError` ou nomes com `Ã§` e `Ã£`. A regra: sempre declare o encoding ao abrir:

```python
from io import StringIO

# simulando um arquivo: na vida real seria open("clientes.csv", encoding="cp1252")
conteudo = StringIO("Cliente;Valor\nAçougue São João;1.234,56\n")
for linha in conteudo:
    print(linha.strip())
```

Quando o erro for `UnicodeDecodeError: 'utf-8' codec can't decode byte 0xe7`, o byte `0xe7` é o `ç` em cp1252: troque `encoding="utf-8"` por `encoding="cp1252"` na leitura (e grave suas saídas em `utf-8`).

**Caminho.** Em strings Python, a barra invertida inicia sequências de escape: `"C:\novo\teste.csv"` contém `\n` (quebra de linha) e `\t` (tabulação). Use `pathlib.Path` e barras normais, que o Windows aceita:

```python
from pathlib import Path

base = Path("C:/automacoes/consolidador")
arquivo = base / "entradas" / "cliente-a.xlsx"
print(arquivo)            # C:\automacoes\consolidador\entradas\cliente-a.xlsx
print(arquivo.suffix)     # .xlsx
print(arquivo.exists())   # False (a pasta não existe nesta máquina)
```

Sintomas de bug de caminho: `FileNotFoundError` com um nome estranho na mensagem, ou o script funcionar no seu computador e falhar no do colega porque o caminho era absoluto da sua máquina.

## Erros comuns

- **Resumir o traceback** ("deu um erro de tipo") em vez de colar inteiro.
- **Aceitar a primeira correção** sem saber a causa; o bug muda de lugar.
- **Depurar com dados reais** e vazar nome de cliente na conversa; use a amostra.
- **Corrigir sem teste de regressão**; o erro volta na próxima refatoração.
- **Ignorar avisos (`warning`)** nos logs; eles costumam anteceder o erro.

## Na prática

Quando o robô de conciliação falhar numa segunda-feira, o fluxo é: abrir o log, achar a última linha antes do erro, colar o traceback com as cinco linhas anteriores de log no Claude Code, pedir hipótese, confirmar com um print ou teste, corrigir, rodar os testes, commitar com mensagem que cita o sintoma ("Corrige leitura de valor com R$ nas planilhas da Oficina"). Vinte minutos, com histórico.

## Resumo

- Cole o traceback inteiro; leia de baixo para cima.
- Exija hipótese, forma de confirmar e proposta de mudança antes de qualquer edição.
- Use `logging` com `%r` para enxergar o dado real; mantenha os logs no robô.
- Reproduza o bug com um teste antes de corrigir; é a proteção contra regressão.
- No Windows: declare `encoding` ao abrir arquivos e use `pathlib.Path` com barras normais.
