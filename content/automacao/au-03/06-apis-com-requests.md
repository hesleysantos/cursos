Nesta lição você vai consumir APIs com a biblioteca `requests`: fazer GET e POST, passar parâmetros e cabeçalhos, ler a resposta em JSON, definir tempo limite, tratar erros, percorrer páginas de resultado e respeitar limites de requisições. Os exemplos usam a BrasilAPI e o ViaCEP, serviços públicos gratuitos. Isso importa porque, no módulo 2, você chamou APIs por nós do Make e do n8n; agora vai chamar as mesmas APIs em Python, com controle total sobre o que acontece quando algo dá errado.

## Lembrando o que é uma API

Uma API web é um endereço que responde a pedidos em formato estruturado, normalmente JSON. Você manda uma requisição (método, URL, parâmetros, cabeçalhos, talvez um corpo) e recebe um código de status e uma resposta. `200` é sucesso, `404` não encontrado, `401`/`403` sem permissão, `429` excesso de requisições, `5xx` erro no servidor. Nada disso mudou; o que muda é a ferramenta.

Instale: `pip install requests`. É a biblioteca mais usada do Python para HTTP e a que a IA vai sugerir sempre.

## GET: consultar um CNPJ na BrasilAPI

```python
import requests

cnpj = "19131243000197"
resposta = requests.get(f"https://brasilapi.com.br/api/cnpj/v1/{cnpj}", timeout=10)
resposta.raise_for_status()           # levanta erro se o status não for 2xx
dados = resposta.json()               # converte o JSON em dicionário

print(dados["razao_social"])
print(dados["descricao_situacao_cadastral"], dados["municipio"], dados["uf"])
```

Três hábitos nesse bloco que você deve carregar para sempre: **`timeout`** (sem ele o script pode travar para sempre esperando um servidor mudo), **`raise_for_status()`** (transforma `404` ou `500` em exceção, em vez de você tentar ler um JSON de erro como se fosse sucesso) e **`.json()`** (devolve dict ou list já prontos). O campo `resposta.status_code` guarda o número e `resposta.text` o corpo bruto, útil para depurar.

Consulte a documentação da BrasilAPI em `brasilapi.com.br/docs` para ver os campos de cada rota: CNPJ, CEP, feriados, bancos, tabela FIPE e outras.

## Parâmetros e cabeçalhos

Muitas APIs recebem filtros pela URL (`?pagina=2&limite=50`). Em vez de montar a string na mão, passe um dicionário em `params`; o requests codifica acentos e espaços corretamente. Cabeçalhos vão em `headers`, e é neles que normalmente vai a chave de acesso:

```python
import os, requests

resposta = requests.get(
    "https://api.exemplo.com.br/notas",
    params={"competencia": "2026-03", "pagina": 1},
    headers={"Authorization": f"Bearer {os.getenv('API_TOKEN')}", "Accept": "application/json"},
    timeout=15,
)
```

O resultado da URL é `https://api.exemplo.com.br/notas?competencia=2026-03&pagina=1`. O token vem do `.env` (lição 1); a palavra `Bearer` antes dele é a convenção que diz ao servidor "o que segue é um token de acesso".

## POST: enviar dados

```python
import requests

payload = {"cnpj": "12345678000190", "competencia": "2026-03", "valor": 1234.56}
resposta = requests.post("https://api.exemplo.com.br/guias", json=payload, timeout=15)
resposta.raise_for_status()
print(resposta.status_code, resposta.json())
```

`json=payload` serializa o dicionário e já manda o cabeçalho `Content-Type: application/json`. Se a API quiser formulário clássico, use `data=payload`; se quiser arquivo, `files={"arquivo": open("nota.xml", "rb")}`.

## Tratando erros de verdade

```python
import requests

def consultar_cep(cep):
    try:
        r = requests.get(f"https://viacep.com.br/ws/{cep}/json/", timeout=10)
        r.raise_for_status()
    except requests.exceptions.Timeout:
        return {"erro": "tempo esgotado"}
    except requests.exceptions.HTTPError as e:
        return {"erro": f"status {e.response.status_code}"}
    except requests.exceptions.RequestException as e:
        return {"erro": f"falha de rede: {e}"}
    dados = r.json()
    if dados.get("erro"):                 # ViaCEP responde 200 com {"erro": "true"} para CEP inexistente
        return {"erro": "CEP não encontrado"}
    return {"logradouro": dados["logradouro"], "bairro": dados["bairro"],
            "cidade": dados["localidade"], "uf": dados["uf"]}

# print(consultar_cep("01001000"))
```

A ordem dos `except` importa: dos mais específicos (`Timeout`, `HTTPError`) para o genérico (`RequestException`, que é a classe mãe de todos os erros do requests). Note o caso do ViaCEP: ele devolve `200` mesmo quando o CEP não existe, com a chave `"erro"` no JSON (hoje com o valor `"true"` em texto; versões antigas devolviam o booleano `true`, e `dados.get("erro")` cobre os dois casos). Cada API tem suas manias; leia a documentação e teste com um valor inválido de propósito.

## Paginação

APIs não devolvem mil registros de uma vez: entregam em páginas. O padrão é um laço que pede a próxima página até vir vazia (ou até o JSON indicar que acabou):

```python
import requests

def buscar_todos(url, token):
    registros, pagina = [], 1
    while True:
        r = requests.get(url, params={"pagina": pagina, "limite": 100},
                         headers={"Authorization": f"Bearer {token}"}, timeout=15)
        r.raise_for_status()
        lote = r.json()["dados"]
        if not lote:
            break
        registros.extend(lote)
        pagina += 1
    return registros
```

Algumas APIs usam cursor (`proxima_pagina` no JSON) ou cabeçalho `Link`. A ideia é a mesma: repetir enquanto houver mais.

## Limite de requisições (rate limit)

Quase toda API limita chamadas por minuto. Quando você passa, recebe `429 Too Many Requests`, muitas vezes com o cabeçalho `Retry-After` dizendo quantos segundos esperar. O comportamento correto é esperar e tentar de novo, com um número máximo de tentativas:

```python
import time, requests

def get_com_espera(url, tentativas=4, **kwargs):
    for n in range(tentativas):
        r = requests.get(url, timeout=15, **kwargs)
        if r.status_code != 429:
            r.raise_for_status()
            return r
        espera = int(r.headers.get("Retry-After", 2 ** n))   # 1, 2, 4, 8 segundos
        time.sleep(espera)
    raise RuntimeError("limite de requisições persistente")
```

Mesmo sem `429`, é educado colocar `time.sleep(0.5)` entre chamadas num laço grande. Para dezenas de chamadas seguidas ao mesmo servidor, use `sessao = requests.Session()` e chame `sessao.get(...)`: reaproveita a conexão e aceita cabeçalhos padrão definidos uma vez.

## Processar o JSON sem rede

No navegador do curso não há rede, mas processar a resposta é a parte que mais exige raciocínio. O JSON vira dict/list com `json.loads`, e dali é Python comum:

```python
import json

resposta = '{"dados": [{"cnpj": "111", "situacao": "ATIVA"}, {"cnpj": "222", "situacao": "BAIXADA"}]}'
empresas = json.loads(resposta)["dados"]
ativas = [e["cnpj"] for e in empresas if e["situacao"] == "ATIVA"]
print(ativas)   # ['111']
```

## Erros comuns

- Esquecer `timeout` e o robô agendado ficar pendurado a noite inteira.
- Ler `r.json()` de uma resposta de erro: o JSON de erro não tem os campos esperados e dá `KeyError`. Chame `raise_for_status()` antes.
- Montar a URL concatenando strings com acentos ou espaços: use `params`.
- Colocar a chave da API no código ou na URL: cabeçalho `Authorization` com valor vindo do `.env`.

## Na prática

Um robô de cadastro recebe a lista de CNPJs dos clientes novos, consulta a BrasilAPI um a um com meio segundo de intervalo, preenche razão social, situação e endereço (completando o CEP no ViaCEP) e grava a planilha de cadastro (lição 3). O que não encontrar fica em uma aba "Conferir" com o motivo do erro.

## Resumo

- `requests.get/post` com `params`, `headers`, `json` e **sempre** `timeout`.
- `raise_for_status()` antes de `.json()`; trate `Timeout`, `HTTPError` e `RequestException` nessa ordem.
- Algumas APIs sinalizam erro dentro do JSON com status 200 (ViaCEP): confira a documentação.
- Paginação é um laço até a página vir vazia; `429` pede espera com `Retry-After` e tentativas limitadas.
- `json.loads` transforma a resposta em dict/list; o resto é Python comum.
