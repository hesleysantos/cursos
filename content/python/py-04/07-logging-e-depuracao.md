# Logging e depuração

Quando um script roda às 3 da manhã pelo agendador e falha, o `print` que você espalhou pelo código não serve para nada: ninguém estava olhando. Nesta lição você vai substituir `print` por **logging** (níveis, formato, gravação em arquivo), aprender a usar o **depurador** (`breakpoint()`/`pdb`) para investigar o código parado no meio da execução, conhecer estratégias de depuração que funcionam e entender quando `assert` ajuda.

## Por que não `print`?

`print` resolve na hora, mas tem problemas: não diz **quando** aconteceu, não diz **de onde** veio, não dá para desligar sem apagar linhas, e vai só para a tela. O módulo `logging` resolve tudo isso com uma configuração e uma troca de nome.

## Os níveis

| Nível | Quando usar |
|-------|-------------|
| `DEBUG` | detalhes para quem está investigando: valores intermediários, linha lida |
| `INFO` | marcos normais: "arquivo X lido, 340 linhas", "relatório gravado" |
| `WARNING` | algo estranho, mas o programa segue: linha ignorada, valor zerado |
| `ERROR` | uma operação falhou: arquivo não encontrado, conversão impossível |
| `CRITICAL` | o programa não pode continuar |

Você define um **nível mínimo**; mensagens abaixo dele são descartadas. Em desenvolvimento, `DEBUG`; em produção, `INFO` ou `WARNING`. O código não muda, só a configuração.

## Uso básico

```python
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")

logging.info("Iniciando fechamento de 2026-03")
logging.debug("Esta linha não aparece: nível mínimo é INFO")
logging.warning("Linha 42 ignorada: valor em branco")
logging.error("Arquivo extrato.csv não encontrado")
```

Saída:

```
2026-03-10 09:15:01,234 INFO Iniciando fechamento de 2026-03
2026-03-10 09:15:01,235 WARNING Linha 42 ignorada: valor em branco
2026-03-10 09:15:01,235 ERROR Arquivo extrato.csv não encontrado
```

`basicConfig` deve ser chamado **uma vez**, no início do programa principal (não dentro de módulos importados). Os campos do `format` mais usados: `%(asctime)s` (data e hora), `%(levelname)s`, `%(name)s` (nome do logger), `%(message)s`, `%(filename)s:%(lineno)d` (arquivo e linha).

## Loggers por módulo

Em vez de usar as funções globais, cada módulo cria o seu logger com o próprio nome. Assim você sabe de onde veio cada mensagem e pode ajustar o nível por módulo:

```python
# leitura.py
import logging
logger = logging.getLogger(__name__)      # nome = "leitura" (ou "fechamento.leitura" num pacote)

def ler_extrato(caminho):
    logger.info("Lendo %s", caminho)
    linhas = 0
    # ...
    logger.debug("Total de linhas: %d", linhas)
    return linhas
```

Repare no estilo `logger.info("Lendo %s", caminho)` em vez de f-string. A formatação só acontece se a mensagem for realmente emitida; com f-string, o texto seria montado mesmo quando o nível está desligado. Para mensagens simples a diferença é mínima, mas é a convenção.

## Handlers: para onde vai o log

Um **handler** decide o destino: tela, arquivo, e-mail, servidor. Você pode ter vários ao mesmo tempo, cada um com seu nível:

```python
import logging

logger = logging.getLogger("fechamento")
logger.setLevel(logging.DEBUG)                 # o logger aceita tudo; os handlers filtram

formato = logging.Formatter("%(asctime)s %(levelname)-8s %(name)s: %(message)s", datefmt="%d/%m/%Y %H:%M:%S")

tela = logging.StreamHandler()                 # vai para o terminal
tela.setLevel(logging.INFO)
tela.setFormatter(formato)

arquivo = logging.FileHandler("/tmp/fechamento.log", encoding="utf-8")   # vai para arquivo
arquivo.setLevel(logging.DEBUG)                # arquivo recebe tudo, inclusive DEBUG
arquivo.setFormatter(formato)

logger.addHandler(tela)
logger.addHandler(arquivo)

logger.debug("Só no arquivo")
logger.info("Na tela e no arquivo")
```

Para logs que crescem sem parar, `logging.handlers.RotatingFileHandler(caminho, maxBytes=1_000_000, backupCount=5)` troca de arquivo ao atingir o tamanho e mantém os 5 últimos.

### Registrando exceções

Dentro de um `except`, use `logger.exception`: ele grava a mensagem em nível `ERROR` **e** o traceback completo (o exemplo usa o `logger` configurado no bloco anterior):

```python
try:
    valor = float("abc")
except ValueError:
    logger.exception("Falha ao converter valor da linha 17")
# 10/03/2026 09:15:02 ERROR    fechamento: Falha ao converter valor da linha 17
# Traceback (most recent call last):
#   File "...", line 2, in <module>
#     valor = float("abc")
# ValueError: could not convert string to float: 'abc'
```

É a melhor amiga de quem precisa descobrir, no dia seguinte, por que o script da madrugada parou.

## Depuração: encontrando o bug

### A estratégia antes da ferramenta

1. **Reproduza**: encontre a menor entrada que causa o erro. Um CSV de 3 linhas que quebra vale mais que um de 30 mil.
2. **Leia o traceback de baixo para cima**: a última linha é o erro; a de cima mostra onde; as anteriores, o caminho até lá. Procure a primeira linha que é **do seu código**.
3. **Formule uma hipótese** ("o valor vem com vírgula") e **teste-a** antes de mudar código ao acaso.
4. **Divida para conquistar**: comente metade, veja se o erro some; repita.
5. **Quando corrigir, escreva um teste** que reproduza o bug. Ele não volta.

### `breakpoint()` e `pdb`

Coloque `breakpoint()` na linha onde quer parar. Ao executar, o programa congela ali e abre o depurador interativo (rode este exemplo no seu terminal, não no site do curso):

```python
def calcular_inss(salario):
    aliquota = 0.075 if salario <= 1518 else 0.09
    breakpoint()                     # o programa para aqui
    return round(salario * aliquota, 2)

calcular_inss(2000)
```

```
> folha.py(4)calcular_inss()
-> return round(salario * aliquota, 2)
(Pdb) p salario
2000
(Pdb) p aliquota
0.09
(Pdb) p salario * aliquota
180.0
(Pdb) c
```

Comandos essenciais do `pdb`:

| Comando | Faz |
|---------|-----|
| `p expressao` | imprime o valor (`p salario`, `p len(linhas)`) |
| `pp` | imprime formatado (bom para dicts e listas) |
| `n` (next) | executa a linha atual e para na próxima |
| `s` (step) | entra na função chamada na linha atual |
| `c` (continue) | continua até o próximo `breakpoint()` ou o fim |
| `l` (list) | mostra o código ao redor |
| `w` (where) | mostra a pilha de chamadas |
| `q` (quit) | encerra o programa |

Você pode digitar qualquer expressão Python no `(Pdb)`: inspecionar variáveis, chamar funções, até alterar valores para testar uma hipótese. Para parar só em certa condição, use `if valor < 0: breakpoint()`. A variável de ambiente `PYTHONBREAKPOINT=0` desliga todos os `breakpoint()` sem precisar apagá-los.

Editores como VS Code e PyCharm oferecem o mesmo poder com interface gráfica: clique na margem para criar um ponto de parada, rode em modo depuração e inspecione variáveis em um painel. Por baixo, é o mesmo mecanismo.

### Depuração com log

Nem sempre dá para parar o programa (um job agendado, por exemplo). Nesse caso, `logger.debug` com os valores intermediários, ativado só quando necessário, é a versão caseira de um depurador remoto, e funciona muito bem (trecho ilustrativo, dentro do laço de leitura de um CSV):

```python
for n, reg in enumerate(leitor, start=2):
    logger.debug("linha %d: %r", n, reg)
    ...
```

Rode uma vez com `level=logging.DEBUG`, encontre a linha problemática no arquivo de log, corrija, volte para `INFO`.

## `assert`: checagens de sanidade

`assert` verifica algo que **deveria ser sempre verdade** no seu código; se não for, há um bug:

```python
def ratear(total, pesos):
    partes = [round(total * p / sum(pesos), 2) for p in pesos]
    diferenca = round(total - sum(partes), 2)
    partes[-1] = round(partes[-1] + diferenca, 2)     # ajusta o último centavo
    assert round(sum(partes), 2) == round(total, 2), f"rateio não fecha: {sum(partes)} != {total}"
    return partes

print(ratear(100.0, [1, 1, 1]))    # [33.33, 33.33, 33.34]
```

O `assert` documenta uma invariante (a soma das partes é o total) e grita se ela for violada. Mas atenção: **`assert` não é validação de entrada**. Ao rodar com `python -O`, todos os asserts são removidos. Para dados que vêm de fora (arquivo, usuário), use `if` + `raise ValueError`; reserve `assert` para verificar a lógica interna.

## Erros comuns

- **`print` para tudo**: sem data, sem nível, sem como desligar. Troque por `logging`.
- **`basicConfig` dentro de um módulo importado**: configura antes da hora ou não configura; chame só no `main`.
- **`except Exception: logger.error("erro")`** sem o traceback: use `logger.exception` ou `exc_info=True`.
- **Esquecer um `breakpoint()`** no código entregue: o programa congela esperando um teclado. Procure antes de entregar (ou use `PYTHONBREAKPOINT=0`).
- **Mudar código antes de entender o erro**: gera bugs novos. Reproduza, leia o traceback, formule a hipótese.
- **`assert` para validar entrada**: some com `-O` e a validação desaparece.

## Na prática

Um script agendado para as 6h deve gravar em `fechamento.log` quando começou, quantos arquivos leu, quais linhas rejeitou e, se falhou, o traceback completo via `logger.exception`. É esse arquivo que você abre no dia seguinte, em vez de rodar tudo de novo para descobrir o que aconteceu.

## Resumo

- `logging` substitui `print` com níveis (`DEBUG` < `INFO` < `WARNING` < `ERROR` < `CRITICAL`), data/hora, origem e múltiplos destinos.
- `basicConfig` uma vez no programa principal; `logging.getLogger(__name__)` em cada módulo; `StreamHandler` para tela, `FileHandler` para arquivo; `logger.exception` dentro de `except`.
- Depuração começa com reproduzir o erro e ler o traceback; `breakpoint()` abre o `pdb` (`p`, `n`, `s`, `c`, `q`) para inspecionar o programa parado.
- `logger.debug` com valores intermediários é o depurador de scripts agendados.
- `assert` verifica invariantes internas e documenta suposições; não valide entrada com ele.
