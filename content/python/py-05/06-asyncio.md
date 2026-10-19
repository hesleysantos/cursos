# Programação assíncrona com asyncio

Nesta lição você vai conhecer o terceiro modelo de concorrência do Python: a **programação assíncrona** com `asyncio`, `async` e `await`. Vai entender o que é um loop de eventos, por que uma única thread consegue atender milhares de conexões, como rodar coroutines em paralelo com `gather`, o que o `aiohttp` oferece para HTTP assíncrono e, principalmente, **quando** async compensa e quando ele só complica.

## Por que outro modelo?

Na lição anterior, threads resolveram o problema de esperar a rede: enquanto uma espera, outra trabalha. Mas threads têm custos: cada uma consome memória, a troca entre elas é feita pelo sistema operacional em momentos imprevisíveis, e isso gera condições de corrida.

A ideia do async é diferente: **uma só thread**, e o próprio código diz onde pode ser interrompido. Quando uma tarefa chega em um ponto de espera (uma requisição de rede, um `sleep`), ela diz "pode rodar outra coisa enquanto isso" com a palavra `await`. Um **loop de eventos** administra quem está pronto para continuar. Como a troca só acontece em `await`, não existe interrupção no meio de `saldo += 1`: as corridas clássicas desaparecem.

Isso torna o async ideal para programas com **muita espera e pouco cálculo**: servidores web, robôs que consultam dezenas de APIs, clientes de WebSocket.

## async, await e coroutines

Uma função declarada com `async def` não executa quando chamada: ela devolve um objeto **coroutine**, uma receita de execução. Quem executa é o loop de eventos, via `asyncio.run`.

```python
import asyncio

async def consultar(cnpj):
    print(f"iniciando {cnpj}")
    await asyncio.sleep(0.5)        # ponto de espera: libera o loop
    print(f"terminou {cnpj}")
    return {"cnpj": cnpj, "situacao": "ATIVA"}

async def main():
    r = await consultar("11222333000181")
    print(r)

asyncio.run(main())
# iniciando 11222333000181
# terminou 11222333000181
# {'cnpj': '11222333000181', 'situacao': 'ATIVA'}
```

Regras essenciais:

- `await` só pode aparecer **dentro** de `async def`.
- Só dá para dar `await` em algo "aguardável": outra coroutine, um `Task`, um `Future`.
- `asyncio.run(main())` cria o loop, roda até `main` terminar e fecha o loop. Chame-o **uma vez**, no topo do programa.
- `time.sleep` dentro de código async é um erro grave: ele trava a thread inteira e ninguém mais roda. Use `await asyncio.sleep`.

## Rodando em paralelo com gather

Se você der `await` em três coroutines uma após a outra, elas rodam em sequência. Para que esperem **juntas**, use `asyncio.gather`:

```python
import asyncio
import time

async def consultar(cnpj, demora):
    await asyncio.sleep(demora)
    return cnpj

async def main():
    inicio = time.perf_counter()

    # sequencial: 0.3 + 0.2 + 0.1 = 0.6s
    a = await consultar("A", 0.3)
    b = await consultar("B", 0.2)
    c = await consultar("C", 0.1)
    print([a, b, c], f"{time.perf_counter() - inicio:.1f}s")   # ['A', 'B', 'C'] 0.6s

    inicio = time.perf_counter()
    # concorrente: todas esperam ao mesmo tempo -> 0.3s
    resultados = await asyncio.gather(
        consultar("A", 0.3),
        consultar("B", 0.2),
        consultar("C", 0.1),
    )
    print(resultados, f"{time.perf_counter() - inicio:.1f}s")   # ['A', 'B', 'C'] 0.3s

asyncio.run(main())
```

`gather` devolve os resultados **na ordem em que as coroutines foram passadas**, independentemente de qual terminou primeiro. Se uma lançar exceção, `gather` relança a primeira; com `return_exceptions=True`, as exceções voltam como valores na lista, e você trata uma a uma.

Para uma lista dinâmica, use desempacotamento: `await asyncio.gather(*[consultar(c, 0.1) for c in cnpjs])`.

## Tasks: agendar sem esperar

`asyncio.create_task(coro)` entrega a coroutine ao loop imediatamente e devolve um `Task`, que você pode aguardar depois ou nunca. É útil para disparar algo em segundo plano enquanto segue o fluxo principal.

```python
import asyncio

async def registrar_log(msg):
    await asyncio.sleep(0.1)
    print("LOG:", msg)

async def main():
    t = asyncio.create_task(registrar_log("fechamento iniciado"))
    print("continuando o trabalho...")
    await asyncio.sleep(0)       # cede a vez: o log começa a rodar
    await t                      # garante que terminou antes de sair
    print("fim")

asyncio.run(main())
# continuando o trabalho...
# LOG: fechamento iniciado
# fim
```

`await asyncio.sleep(0)` é um truque conhecido: "deixa qualquer outra tarefa pronta rodar agora". Guarde a referência do Task em uma variável; um Task sem referência pode ser coletado pelo garbage collector antes de terminar.

## Limitando a concorrência com Semaphore

Disparar 2 mil requisições ao mesmo tempo derruba você no 429 ou derruba o servidor. `asyncio.Semaphore(n)` limita quantas coroutines passam de um ponto ao mesmo tempo:

```python
import asyncio

sem = asyncio.Semaphore(5)      # no máximo 5 consultas simultâneas

async def consultar_limitado(cnpj):
    async with sem:
        await asyncio.sleep(0.2)   # aqui iria a chamada HTTP
        return cnpj

async def main():
    cnpjs = [f"CNPJ{i:03}" for i in range(20)]
    resultados = await asyncio.gather(*(consultar_limitado(c) for c in cnpjs))
    print(len(resultados))   # 20, em cerca de 0.8s (20 / 5 * 0.2)

asyncio.run(main())
```

`async with` é a versão assíncrona do `with`; `async for` é a do `for`, usada com geradores assíncronos (`async def` com `yield`).

## HTTP assíncrono: aiohttp e httpx

`requests` é síncrono: dentro de código async ele trava o loop. Para HTTP assíncrono use `aiohttp` (`pip install aiohttp`) ou `httpx`, que tem API parecida com a do `requests` e funciona nos dois modos.

```python
import asyncio
import aiohttp

async def buscar_cep(session, cep):
    async with session.get(f"https://viacep.com.br/ws/{cep}/json/", timeout=aiohttp.ClientTimeout(total=10)) as r:
        r.raise_for_status()
        return await r.json()

async def main():
    ceps = ["01001000", "49010000", "30130010"]
    async with aiohttp.ClientSession() as session:
        dados = await asyncio.gather(*(buscar_cep(session, c) for c in ceps))
    for d in dados:
        print(d["localidade"], d["uf"])
# São Paulo SP
# Aracaju SE
# Belo Horizonte MG

# asyncio.run(main())
```

A `ClientSession` reaproveita conexões, como o `requests.Session`. Note que até `r.json()` precisa de `await`: ler o corpo também é espera de rede.

## Quando async compensa (e quando não)

| Situação | Vale async? |
|---|---|
| Centenas ou milhares de chamadas de rede simultâneas | Sim, é o cenário ideal |
| Servidor web/API com muitas conexões | Sim (FastAPI, aiohttp) |
| Um script que faz 10 consultas | Não; `ThreadPoolExecutor` é mais simples |
| Cálculo pesado | Não; async não acelera CPU. Use processos |
| Biblioteca que só tem versão síncrona (ex.: `openpyxl`, `sqlite3`) | Complica: precisa de `asyncio.to_thread` para não travar o loop |

O async **contamina**: uma função async só é chamada por outra async, e as bibliotecas precisam ter versão assíncrona. Se o seu robô lê Excel, grava SQLite e faz 15 chamadas HTTP, threads resolvem com um décimo da complexidade. Reserve async para quando o volume de espera simultânea é realmente grande ou quando o framework (FastAPI, por exemplo) já é async.

Quando precisar rodar uma função síncrona demorada dentro de código async sem travar o loop, use `await asyncio.to_thread(funcao, arg)`: ela roda em uma thread auxiliar e o loop segue livre.

## Armadilhas comuns

- **Esquecer o `await`**: `consultar("A")` sem `await` cria a coroutine e a joga fora (o Python avisa: *coroutine was never awaited*).
- **`time.sleep` ou `requests` em código async**: travam o loop inteiro.
- **`asyncio.run` dentro de um loop já em execução** (Jupyter, alguns navegadores): dá `RuntimeError`. Nesses ambientes, use `await` direto na célula.
- **Perder Tasks sem referência**: guarde-as em uma variável ou lista.
- **Confundir concorrência com paralelismo**: async roda em uma única thread; se você tem 100% de CPU, nada ficou mais rápido.
- **`gather` sem `return_exceptions`**: a primeira exceção é relançada na hora e você perde os resultados das outras coroutines (que continuam rodando sem ninguém olhar).

## Na prática

Onde o async realmente aparece no dia a dia de quem automatiza escritório: (1) em **APIs web com FastAPI**, que já são assíncronas e permitem consultar banco e serviços externos sem travar as outras requisições; (2) em robôs que precisam de **milhares de consultas** a uma API externa, com `Semaphore` para respeitar o limite do fornecedor. Para o robô de fechamento que faz dez chamadas e grava um Excel, fique com threads: menos conceitos novos, mesmo resultado.

## Resumo

- `async def` cria coroutines; `await` marca onde o loop pode trocar de tarefa; `asyncio.run(main())` inicia tudo uma única vez.
- `asyncio.gather(*coros)` espera várias ao mesmo tempo e devolve resultados na ordem de entrada; `create_task` agenda sem esperar.
- Nunca use `time.sleep`/`requests` dentro de async; use `asyncio.sleep`, `aiohttp`/`httpx` ou `asyncio.to_thread` para código síncrono.
- `Semaphore` limita a concorrência e protege as APIs que você consome.
- Async compensa para muita espera simultânea (servidores, milhares de requisições); para scripts pequenos, threads são mais simples; para CPU, processos.
