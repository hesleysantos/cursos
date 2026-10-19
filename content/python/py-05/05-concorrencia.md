# Concorrência: threads, processos e o GIL

Nesta lição você vai entender como fazer um programa Python realizar várias coisas "ao mesmo tempo": o que são threads e processos, por que o famoso **GIL** limita as threads, como o módulo `concurrent.futures` simplifica tudo com `ThreadPoolExecutor` e `ProcessPoolExecutor`, e como evitar o bug mais traiçoeiro da área, a condição de corrida, usando `Lock`. Você sairá sabendo escolher a ferramenta certa para cada tipo de tarefa.

## Por que concorrência?

Imagine consultar 300 CNPJs na BrasilAPI. Cada chamada leva meio segundo esperando a rede; em sequência, são 150 segundos em que seu processador fica praticamente parado. Agora imagine calcular a depreciação de 2 milhões de bens: aí o processador trabalha sem parar, e a espera é por cálculo, não por rede.

Esses dois cenários têm nomes:

- **I/O-bound** (limitado por entrada/saída): o programa passa o tempo **esperando** rede, disco, banco. Threads ajudam muito.
- **CPU-bound** (limitado por processamento): o programa passa o tempo **calculando**. Threads não ajudam em Python; processos sim.

Saber classificar a tarefa é 80% da decisão.

## Threads e o GIL

Uma **thread** é uma linha de execução dentro do mesmo processo, compartilhando memória com as outras. Criar threads em Python é fácil:

```python
import threading
import time

def consultar(cnpj):
    time.sleep(0.5)            # simula espera de rede
    print(f"{cnpj} consultado")

inicio = time.perf_counter()
threads = [threading.Thread(target=consultar, args=(c,)) for c in ["A", "B", "C", "D"]]
for t in threads:
    t.start()
for t in threads:
    t.join()                   # espera cada uma terminar
print(f"{time.perf_counter() - inicio:.1f}s")
# A consultado  (a ordem pode variar)
# C consultado
# B consultado
# D consultado
# 0.5s   -> as quatro esperaram ao mesmo tempo, não 2.0s
```

Então por que threads não aceleram cálculo? Por causa do **GIL** (Global Interpreter Lock): o interpretador CPython só deixa **uma thread executar bytecode Python por vez**. Enquanto uma thread espera rede ou disco, ela solta o GIL e outra trabalha; é por isso que I/O paralelo funciona. Mas se todas querem calcular, elas se revezam no mesmo núcleo e o tempo total não cai (às vezes até sobe, pelo custo da troca).

> **Dica:** desde o Python 3.13 existe uma compilação **opcional** sem GIL (free-threaded, PEP 703): experimental no 3.13 e oficialmente suportada a partir do 3.14 (PEP 779), mas ainda distribuída como build separado, que você precisa escolher no instalador. O Python padrão continua com o GIL. Para o Python 3.12/3.14 comum que você usa, a regra "threads para I/O, processos para CPU" vale integralmente.

## Processos

Um **processo** é um interpretador Python separado, com sua própria memória e seu próprio GIL. Com `multiprocessing`, cada processo roda em um núcleo e o cálculo realmente se divide.

```python
from multiprocessing import Pool

def depreciacao_total(bens):
    return sum(valor / vida for valor, vida in bens)

if __name__ == "__main__":
    lotes = [[(10000, 5)] * 500_000 for _ in range(4)]    # 4 lotes de 500 mil bens
    with Pool(processes=4) as pool:
        totais = pool.map(depreciacao_total, lotes)
    print(sum(totais))
```

O preço dos processos: criar um é caro (dezenas de milissegundos), e dados trafegam entre eles por **serialização (pickle)**, então enviar objetos gigantes custa. O `if __name__ == "__main__":` é **obrigatório** no Windows, porque os processos filhos reimportam o módulo e sem essa guarda criariam processos infinitamente.

## concurrent.futures: a interface moderna

Em vez de gerenciar threads e processos na mão, use `concurrent.futures`. Ele oferece dois **executores** com a mesma interface: você só troca a classe.

```python
from concurrent.futures import ThreadPoolExecutor, as_completed
import time

def consultar(cnpj):
    time.sleep(0.3)
    return {"cnpj": cnpj, "situacao": "ATIVA"}

cnpjs = ["11222333000181", "22333444000172", "33444555000163"]

with ThreadPoolExecutor(max_workers=8) as executor:
    # map: mesma ordem da entrada
    resultados = list(executor.map(consultar, cnpjs))
print([r["cnpj"] for r in resultados])
# ['11222333000181', '22333444000172', '33444555000163']

with ThreadPoolExecutor(max_workers=8) as executor:
    # submit + as_completed: processa conforme termina
    futuros = {executor.submit(consultar, c): c for c in cnpjs}
    for fut in as_completed(futuros):
        cnpj = futuros[fut]
        try:
            print(cnpj, fut.result()["situacao"])
        except Exception as e:
            print(cnpj, "falhou:", e)
```

Um **Future** é uma promessa de resultado: `fut.result()` bloqueia até o valor existir e **relança** a exceção que tiver ocorrido dentro da tarefa. Isso é importante: em threads cruas, uma exceção morre em silêncio; com futures, ela chega até você.

Para CPU-bound, troque por `ProcessPoolExecutor` e pronto:

```python
from concurrent.futures import ProcessPoolExecutor

def calcular_juros(lote):
    return sum(v * 1.01 ** 12 for v in lote)

if __name__ == "__main__":
    lotes = [list(range(1_000_000))] * 4
    with ProcessPoolExecutor() as ex:      # padrão: nº de núcleos
        print(sum(ex.map(calcular_juros, lotes)))
```

### Quando usar cada um

| Situação | Ferramenta |
|---|---|
| Muitas chamadas HTTP, leitura de arquivos, banco | `ThreadPoolExecutor` (ou asyncio, próxima lição) |
| Cálculo pesado em Python puro | `ProcessPoolExecutor` |
| Cálculo pesado com NumPy/pandas | Muitas vezes nem precisa: essas bibliotecas soltam o GIL em C |
| Poucas tarefas, código simples | Nenhum: a complexidade não compensa |

## Condições de corrida e Lock

Threads compartilham memória, e aí mora o perigo. Veja um contador incrementado por várias threads:

```python
import sys
import threading

sys.setswitchinterval(1e-6)   # força trocas de thread muito frequentes, só para evidenciar o bug

saldo = 0

def somar_um(x):
    return x + 1

def depositar(vezes):
    global saldo
    for _ in range(vezes):
        saldo = somar_um(saldo)   # NÃO é atômico: lê, calcula, grava

threads = [threading.Thread(target=depositar, args=(100_000,)) for _ in range(4)]
for t in threads: t.start()
for t in threads: t.join()
print(saldo)   # esperado 400000; sai algo como 203443, 175472... (varia a cada execução)
```

Ler, calcular e gravar são três passos. Se a thread A lê 10, a thread B lê 10, ambas somam e gravam 11, um depósito se perdeu. Isso é uma **condição de corrida**: o resultado depende de quem chega primeiro. O bug é intermitente: com o intervalo de troca padrão (5 ms), este mesmo programa costuma imprimir 400000 dezenas de vezes seguidas, e o erro aparece só em produção, sob carga, ou some quando você adiciona um `print` para investigar, o que o torna especialmente cruel. (Nas versões recentes do CPython a troca de thread só acontece em certos pontos do bytecode, como a chamada de função do exemplo; por isso o `sys.setswitchinterval` acima, que torna a perda visível em segundos. Mas "quase nunca" não é garantia, e o código continua errado.)

A solução é um **Lock**: só quem segura a trava mexe no dado.

```python
import threading

saldo = 0
trava = threading.Lock()

def somar_um(x):
    return x + 1

def depositar(vezes):
    global saldo
    for _ in range(vezes):
        with trava:         # adquire, executa, libera (mesmo com exceção)
            saldo = somar_um(saldo)

threads = [threading.Thread(target=depositar, args=(100_000,)) for _ in range(4)]
for t in threads: t.start()
for t in threads: t.join()
print(saldo)   # 400000, sempre
```

Regras práticas: proteja o **menor trecho possível**; nunca adquira dois locks em ordens diferentes em lugares diferentes (gera **deadlock**, as threads esperam umas às outras para sempre); e, melhor ainda, **evite estado compartilhado**. Se cada tarefa devolve um valor e você soma os resultados na thread principal, não há corrida alguma. É o que `executor.map` incentiva.

Outra estrutura segura por natureza é `queue.Queue`: uma thread põe, outra tira, e a fila cuida da sincronização. É a base do padrão produtor-consumidor.

## Pense primeiro no código sequencial

Antes de paralelizar, escreva a **função pura** que processa um item e teste-a isoladamente. Paralelizar depois é trocar `[f(x) for x in itens]` por `executor.map(f, itens)`. Se a função tem efeitos colaterais (escreve em arquivo compartilhado, altera lista global), ela não está pronta para rodar em paralelo.

```python
def processar_lote(lancamentos):
    """Pura: recebe lista de dicts, devolve total por conta. Pronta para paralelizar."""
    totais = {}
    for l in lancamentos:
        totais[l["conta"]] = totais.get(l["conta"], 0.0) + l["valor"]
    return totais

def juntar(parciais):
    final = {}
    for p in parciais:
        for conta, v in p.items():
            final[conta] = final.get(conta, 0.0) + v
    return final

# sequencial:  juntar([processar_lote(lote) for lote in lotes])
# paralelo:    juntar(executor.map(processar_lote, lotes))
```

## Armadilhas comuns

- **Usar threads para cálculo** e se frustrar com o GIL.
- **Esquecer `if __name__ == "__main__"`** com processos no Windows.
- **Passar objetos enormes** para processos: o pickle pode custar mais que o cálculo.
- **Ignorar exceções** em threads cruas; prefira futures, que as relançam.
- **Compartilhar estado** sem Lock; ou com Lock demais, serializando tudo e perdendo o ganho.
- **max_workers gigante**: para I/O, 8 a 32 threads costumam bastar; mais que isso só pressiona o servidor remoto.

## Na prática

O cenário mais comum no escritório é o da abertura da lição: **consultar centenas de CNPJs ou CEPs**. Escreva `consultar(cnpj)` pura, teste com três CNPJs em um `for`, e só então troque o `for` por `ThreadPoolExecutor(max_workers=8)` com `as_completed`, gravando cada resultado conforme chega. Respeite o limite da API (um `time.sleep` dentro da função, se a documentação pedir) e trate a exceção de cada futuro individualmente: um CNPJ inválido não pode derrubar a consulta dos outros 299.

## Resumo

- I/O-bound (rede, disco): threads ajudam; CPU-bound (cálculo): só processos ajudam, por causa do GIL.
- `concurrent.futures` dá a mesma interface para threads e processos: `map` (ordem preservada) e `submit` + `as_completed` (conforme terminam); `Future.result()` relança exceções.
- Condição de corrida acontece quando threads alteram o mesmo dado; `with lock:` protege, mas o melhor é não compartilhar estado.
- Escreva primeiro a função pura e sequencial; paralelizar depois é trocar uma linha.
- No Windows, código com processos precisa de `if __name__ == "__main__":`.
