# Módulos e pacotes

Nesta lição você vai aprender a dividir um programa em vários arquivos, a reaproveitar código pronto da **biblioteca padrão** do Python e a entender o que acontece de verdade quando escreve `import`. Ao final, vai saber usar `math`, `random`, `datetime`, `os`, `sys` e `statistics` para resolver problemas do dia a dia do escritório sem reinventar a roda.

## Por que dividir o código em módulos?

Nos módulos anteriores, tudo cabia em um único arquivo. Mas um sistema de folha de pagamento real tem cálculo de INSS, de IRRF, de FGTS, leitura de planilhas, geração de relatórios... Se tudo ficar num arquivo só, ele vira um monstro de 3 mil linhas que ninguém consegue manter.

Um **módulo** é simplesmente um arquivo `.py`. Quando você escreve `import impostos`, o Python procura um arquivo `impostos.py`, executa-o uma única vez e guarda tudo o que foi definido lá (funções, variáveis, classes) dentro de um objeto chamado `impostos`. A partir daí, você acessa com ponto: `impostos.calcular_inss(3000)`.

Um **pacote** é uma pasta com vários módulos dentro (e, tradicionalmente, um arquivo `__init__.py`, que pode até estar vazio). A biblioteca padrão é organizada assim: `os.path`, `email.mime`, `urllib.request`.

## As quatro formas de importar

```python
# 1. Importa o módulo inteiro; usa com prefixo
import math
print(math.sqrt(144))        # 12.0

# 2. Importa só o que precisa
from math import sqrt, pi
print(sqrt(144), pi)         # 12.0 3.141592653589793

# 3. Apelido (alias) para nomes longos ou conflitantes
import statistics as st
print(st.mean([100, 200, 300]))   # 200

# 4. Tudo com asterisco (EVITE: polui o namespace e esconde de onde veio cada nome)
from math import *
```

Qual escolher? A forma 1 é a mais clara: ao ler `math.sqrt`, qualquer pessoa sabe de onde veio a função. A forma 2 é boa quando você usa poucas funções muitas vezes. A forma 3 é padrão em algumas bibliotecas (`import numpy as np`). A forma 4 é quase sempre má ideia: se dois módulos tiverem uma função `open`, qual delas você está chamando?

> **Atenção:** nunca dê a um arquivo seu o nome de um módulo da biblioteca padrão. Se você criar um `random.py` na pasta do projeto, `import random` vai importar o **seu** arquivo, e `random.randint` vai sumir. Esse erro é clássico e confunde muita gente.

## Criando o seu próprio módulo

Suponha o arquivo `tributos.py`:

```python
# tributos.py
ALIQUOTA_ISS = 0.05

def iss(valor_servico):
    return round(valor_servico * ALIQUOTA_ISS, 2)

def irrf_simplificado(base):
    # faixa de exemplo; a tabela real do IRRF muda todo ano
    if base <= 2259.20:
        return 0.0
    return round(base * 0.075, 2)

if __name__ == "__main__":
    # Só roda quando executamos "python tributos.py" diretamente
    print("Teste rápido:", iss(1000))
```

E, em outro arquivo na mesma pasta (o bloco abaixo só roda se `tributos.py` existir ao lado dele):

```python
# relatorio.py
import tributos

nota = 4800.00
print(f"ISS da nota: R$ {tributos.iss(nota):.2f}")   # ISS da nota: R$ 240.00
```

## O mistério do `if __name__ == "__main__":`

Toda vez que o Python carrega um arquivo, ele define uma variável especial chamada `__name__`. Se o arquivo foi executado **diretamente** (`python tributos.py`), `__name__` vale `"__main__"`. Se ele foi **importado** por outro arquivo, `__name__` vale o nome do módulo (`"tributos"`).

Esse truque permite colocar um teste rápido ou um menu no fim do arquivo sem que ele dispare quando alguém importa o módulo. Sem essa proteção, ao fazer `import tributos` dentro do `relatorio.py`, a linha `print("Teste rápido...")` seria executada sem você querer.

```python
print(__name__)
# Executando direto:   __main__
# Importado:           nome_do_arquivo
```

## Tour pela biblioteca padrão

O Python vem com "baterias incluídas": centenas de módulos prontos. Veja os que mais aparecem na vida de quem trabalha com números e datas.

### `math` — matemática além do básico

```python
import math

print(math.ceil(1234.01))       # 1235  (arredonda para cima)
print(math.floor(1234.99))      # 1234  (para baixo)
print(math.fsum([0.1, 0.2, 0.3]))   # 0.6   (soma de floats com precisão máxima; 0.1 + 0.2 + 0.3 dá 0.6000000000000001)
print(math.isclose(0.1 + 0.2, 0.3))   # True (compara floats com tolerância)
```

### `random` — sorteios e amostras

Útil para gerar dados de teste ou selecionar uma amostra de notas fiscais para auditoria.

```python
import random

random.seed(42)                       # fixa a semente: resultados reproduzíveis
notas = ["NF-101", "NF-102", "NF-103", "NF-104", "NF-105"]
print(random.choice(notas))           # uma nota ao acaso
print(random.sample(notas, 2))        # duas notas distintas
print(random.randint(1, 6))           # inteiro entre 1 e 6, inclusive
print(round(random.uniform(100, 500), 2))   # float entre 100 e 500
```

### `datetime` — datas e prazos

```python
from datetime import date, timedelta

hoje = date(2026, 3, 10)
vencimento = hoje + timedelta(days=30)
print(vencimento)                    # 2026-04-09
print(vencimento.strftime("%d/%m/%Y"))   # 09/04/2026
print((vencimento - hoje).days)      # 30
```

Veremos `datetime` a fundo no módulo 4; por enquanto, saiba que `date` representa um dia e `timedelta` uma duração.

### `statistics` — médias e dispersão

```python
import statistics as st

vendas = [12500, 9800, 15200, 11000, 9800]
print(st.mean(vendas))      # 11660
print(st.median(vendas))    # 11000
print(st.mode(vendas))      # 9800
print(round(st.stdev(vendas), 2))   # 2268.92  (desvio padrão amostral)
```

### `os` e `sys` — conversando com o sistema

```python
import os, sys

print(os.getcwd())                 # pasta atual
print(os.listdir("."))             # arquivos da pasta atual
print(os.path.join("docs", "2026", "folha.csv"))   # docs/2026/folha.csv (ou com \ no Windows)
print(sys.version_info.major)      # 3
print(sys.platform)                # 'win32', 'linux', 'darwin'...
```

`sys.argv` (argumentos da linha de comando) e `sys.exit()` aparecerão no módulo 4.

## Onde o Python procura os módulos?

A ordem está em `sys.path`: primeiro a pasta do script que está rodando, depois as pastas da instalação e, por fim, os pacotes instalados com `pip`. Por isso, um `random.py` seu "ganha" do `random` oficial. Para ver a lista:

```python
import sys
for p in sys.path:
    print(p)
```

Para descobrir o que um módulo oferece, use `dir(modulo)` e `help(modulo.funcao)` no interpretador interativo. É mais rápido do que procurar na internet.

## Erros comuns

- **`ModuleNotFoundError: No module named 'tributos'`** — o arquivo não está na mesma pasta do script ou o nome está errado (lembre: o nome do módulo é o nome do arquivo **sem** `.py`).
- **`AttributeError: module 'random' has no attribute 'randint'`** — quase sempre existe um `random.py` seu na pasta, fazendo sombra ao módulo oficial.
- **Importar dentro de laços** — `import` dentro de um `for` não é erro, mas é desnecessário: o Python guarda o módulo em cache e não reimporta. Coloque todos os imports no topo do arquivo.
- **Esquecer o prefixo** — depois de `import math`, escrever `sqrt(9)` dá `NameError`. Ou use `math.sqrt`, ou importe com `from math import sqrt`.
- **Importação circular** — `a.py` importa `b.py`, que importa `a.py`. O sintoma é um `ImportError` estranho. A solução é reorganizar: mover o código comum para um terceiro módulo.

## Na prática

No escritório, um pacote `folha/` com `inss.py`, `irrf.py` e `fgts.py` permite que o script de fechamento e o de simulação importem as mesmas funções; quando a tabela muda, você corrige um arquivo só. Antes de escrever uma função, procure na biblioteca padrão: `statistics`, `datetime` e `math` já resolvem a maior parte dos cálculos de rotina.

## Resumo

- Um módulo é um arquivo `.py`; um pacote é uma pasta de módulos. `import` executa o arquivo uma vez e guarda seus nomes.
- Prefira `import modulo` ou `from modulo import nome`; evite `from modulo import *`.
- `if __name__ == "__main__":` separa o que roda ao executar o arquivo do que roda ao importá-lo.
- A biblioteca padrão já resolve matemática (`math`), sorteios (`random`), datas (`datetime`), estatística (`statistics`) e sistema (`os`, `sys`).
- Nunca nomeie um arquivo seu igual a um módulo padrão (`random.py`, `csv.py`, `json.py`).
