# HTTP e APIs: conversando com outros sistemas

Nesta lição você vai entender como programas conversam pela internet usando HTTP, o que é uma API REST e como consumir uma com a biblioteca `requests`. Ao final, você saberá buscar um CEP no ViaCEP, consultar um CNPJ na BrasilAPI, tratar erros de rede, lidar com paginação e guardar chaves de acesso de forma segura. Para um contador, isso significa trocar horas de consulta manual em sites por um script que roda em segundos.

## Por que APIs importam para quem trabalha com dados

Boa parte do trabalho de escritório é copiar informação de um sistema para outro: consultar um CNPJ na Receita, conferir o endereço de um cliente pelo CEP, baixar a cotação do dólar do Banco Central. Esses sistemas expõem **APIs** (Application Programming Interfaces): portas de entrada feitas para programas, não para pessoas. Em vez de uma página bonita, a API devolve dados brutos, quase sempre em JSON, que seu código consegue ler direto.

Uma **API REST** segue algumas convenções simples:

- cada recurso tem um endereço (URL), como `https://viacep.com.br/ws/01001000/json/`;
- a ação é dada pelo **método HTTP**: `GET` lê, `POST` cria, `PUT`/`PATCH` alteram, `DELETE` remove;
- a resposta traz um **código de status** (200 deu certo, 404 não achou, 500 erro no servidor) e um **corpo**, normalmente JSON.

Você já domina `json.loads` e dicionários. Consumir uma API é só aplicar isso ao texto que chega pela rede.

## Anatomia de uma requisição

Toda requisição HTTP tem quatro partes:

| Parte | O que é | Exemplo |
|---|---|---|
| Método | A ação | `GET` |
| URL | Onde | `https://brasilapi.com.br/api/cnpj/v1/00000000000191` |
| Cabeçalhos (headers) | Metadados | `Accept: application/json`, `Authorization: Bearer ...` |
| Corpo (body) | Dados enviados | JSON em um `POST` |

A resposta tem **status**, **headers** e **corpo**. Guarde essa estrutura: toda biblioteca HTTP, em qualquer linguagem, gira em torno dela.

## A biblioteca requests

`requests` não vem com o Python; instale no seu ambiente virtual com `pip install requests`. Ela é o padrão de fato por ser muito mais agradável que o `urllib` da biblioteca padrão.

```python
import requests

resposta = requests.get("https://viacep.com.br/ws/01001000/json/", timeout=10)

print(resposta.status_code)   # 200
print(resposta.headers["Content-Type"])  # application/json; charset=utf-8
dados = resposta.json()       # converte o corpo JSON em dict
print(dados["logradouro"])    # Praça da Sé
print(dados["localidade"], dados["uf"])  # São Paulo SP
```

Repare em três coisas. Primeiro, `timeout=10`: sem ele, uma rede lenta pode travar seu script para sempre. **Sempre** informe timeout. Segundo, `.json()` faz o `json.loads` por você. Terceiro, `status_code` é um inteiro que você deve conferir antes de confiar nos dados.

### Parâmetros de consulta e cabeçalhos

Em vez de montar a URL na mão com `?chave=valor&outra=...`, passe um dicionário em `params`. A biblioteca cuida da codificação de espaços, acentos e caracteres especiais.

```python
import requests

params = {"q": "contabilidade", "page": 2, "per_page": 50}
headers = {"Accept": "application/json", "User-Agent": "robo-fechamento/1.0"}

r = requests.get("https://api.exemplo.com/busca", params=params, headers=headers, timeout=10)
print(r.url)
# https://api.exemplo.com/busca?q=contabilidade&page=2&per_page=50
```

### Enviando dados com POST

Para criar um recurso, use `requests.post` e passe o dicionário em `json=`. A biblioteca serializa, define `Content-Type: application/json` e envia.

```python
import requests

novo_lancamento = {"conta": "1.1.01", "valor": 1500.00, "historico": "Recebimento NF 123"}
r = requests.post("https://api.exemplo.com/lancamentos", json=novo_lancamento, timeout=10)

print(r.status_code)   # 201 (Created)
print(r.json())        # {'id': 987, 'conta': '1.1.01', 'valor': 1500.0, ...}
```

> **Atenção:** `data=` envia como formulário (`application/x-www-form-urlencoded`); `json=` envia JSON. APIs REST modernas quase sempre esperam `json=`.

## Lendo o status e tratando erros

Códigos de status se agrupam por centena:

- **2xx** sucesso (200 OK, 201 Created, 204 No Content);
- **3xx** redirecionamento (requests segue sozinho);
- **4xx** erro do cliente (400 requisição inválida, 401 não autenticado, 403 proibido, 404 não encontrado, 429 muitas requisições);
- **5xx** erro do servidor.

O jeito mais limpo de tratar é chamar `raise_for_status()`, que lança `requests.HTTPError` para qualquer 4xx/5xx. Problemas de rede (sem conexão, DNS, timeout) lançam outras exceções, todas filhas de `requests.RequestException`.

```python
import requests

def consultar_cnpj(cnpj: str) -> dict | None:
    url = f"https://brasilapi.com.br/api/cnpj/v1/{cnpj}"
    try:
        r = requests.get(url, timeout=10)
        r.raise_for_status()
        return r.json()
    except requests.HTTPError as e:
        print(f"Servidor respondeu erro: {e.response.status_code}")
    except requests.Timeout:
        print("A API demorou demais para responder.")
    except requests.RequestException as e:
        print(f"Falha de rede: {e}")
    return None

empresa = consultar_cnpj("00000000000191")
if empresa:
    print(empresa["razao_social"])          # BANCO DO BRASIL SA
    print(empresa["descricao_situacao_cadastral"])  # ATIVA
```

Note que o ViaCEP tem uma pegadinha: para CEP inexistente ele devolve **200** com `{"erro": "true"}` no corpo (hoje a string `"true"`; versões antigas devolviam o booleano `true`, então teste com `if dados.get("erro"):`, que cobre os dois). Ou seja, status 200 não garante dados válidos; leia a documentação da API que você consome.

## Paginação

APIs não devolvem 50 mil registros de uma vez. Elas entregam **páginas** e indicam como pedir a próxima. Os dois estilos mais comuns são por número de página (`?page=2`) e por cursor (um token opaco em `next`). Um gerador deixa o código elegante:

```python
import requests

def iterar_paginas(url_base: str, token: str):
    pagina = 1
    while True:
        r = requests.get(
            url_base,
            params={"page": pagina, "per_page": 100},
            headers={"Authorization": f"Bearer {token}"},
            timeout=15,
        )
        r.raise_for_status()
        corpo = r.json()
        yield from corpo["items"]          # entrega item por item
        if not corpo.get("has_next"):      # a API diz quando acabou
            break
        pagina += 1

# for nota in iterar_paginas("https://api.exemplo.com/notas", token):
#     processar(nota)
```

Quem consome só vê um `for`; o detalhe de paginação fica escondido no gerador. Isso é exatamente o tipo de abstração que você aprendeu em geradores, aplicada a um problema real.

## Chaves de API e segredos

Muitas APIs exigem uma **chave** (API key) ou **token** para identificar quem chama. Essa chave é uma senha. Nunca a escreva no código-fonte: ela acabaria em um commit, em um e-mail, em um backup. O padrão é guardá-la em **variável de ambiente** e ler com `os.environ`.

```python
import os
import requests

TOKEN = os.environ.get("MINHA_API_TOKEN")
if not TOKEN:
    raise SystemExit("Defina a variável de ambiente MINHA_API_TOKEN")

r = requests.get(
    "https://api.exemplo.com/relatorios",
    headers={"Authorization": f"Bearer {TOKEN}"},
    timeout=10,
)
```

No PowerShell, para a sessão atual: `$env:MINHA_API_TOKEN = "abc123"`. Para persistir no Windows, use as Variáveis de Ambiente do sistema ou um arquivo `.env` lido pela biblioteca `python-dotenv` (e **coloque `.env` no `.gitignore`**).

## Montando URLs com segurança

Quando precisar montar uma URL na mão (por exemplo, para registrar em log ou sem `requests`), use `urllib.parse`, que está na biblioteca padrão:

```python
from urllib.parse import urlencode, urljoin, urlparse, quote

base = "https://api.exemplo.com/v1/"
print(urljoin(base, "clientes"))            # https://api.exemplo.com/v1/clientes
print(urlencode({"nome": "João Silva", "uf": "SE"}))  # nome=Jo%C3%A3o+Silva&uf=SE
print(quote("Rua das Flores, 10"))          # Rua%20das%20Flores%2C%2010

partes = urlparse("https://viacep.com.br/ws/49000000/json/?x=1")
print(partes.netloc)   # viacep.com.br
print(partes.path)     # /ws/49000000/json/
print(partes.query)    # x=1
```

## Armadilhas comuns

- **Esquecer o timeout.** O script fica pendurado e você só percebe horas depois.
- **Confiar no 200.** Confira também o conteúdo; algumas APIs devolvem erro dentro do JSON.
- **Chamar a API em loop sem limite.** Você toma 429 (Too Many Requests) e pode ser bloqueado. Respeite limites e use `time.sleep` entre chamadas quando a documentação pedir.
- **Colar tokens no código.** Use variáveis de ambiente desde o primeiro dia.
- **Não usar `Session`.** Para muitas chamadas ao mesmo servidor, `requests.Session()` reaproveita a conexão e aceita cabeçalhos padrão, ficando mais rápido e mais limpo.
- **Ignorar a documentação.** Cada API tem seus campos, formatos de data e regras de paginação. Leia antes de codificar.

> **Dica:** antes de escrever código, teste a URL no navegador ou com `curl`. Se o JSON aparece lá, você já sabe o formato que vai receber.

## Na prática

No escritório, o primeiro script de API costuma ser o de **cadastro**: uma função `consultar_cnpj` como a desta lição, chamada em um `for` sobre a planilha de clientes, preenchendo razão social, situação cadastral e endereço (CEP via ViaCEP) sem ninguém abrir o site da Receita. Guarde o JSON bruto de cada resposta em uma pasta `cache/` com a data: quando a API sair do ar ou mudar um campo, você ainda tem os dados do último fechamento e consegue comparar.

## Resumo

- API REST: recursos em URLs, ações por método HTTP (GET/POST/PUT/DELETE), resposta com status + JSON.
- `requests.get/post(url, params=, json=, headers=, timeout=)`; sempre informe `timeout`.
- Confira `status_code` ou use `raise_for_status()`; capture `requests.RequestException` para falhas de rede.
- Paginação: percorra páginas com um gerador que esconde o detalhe de quem consome.
- Chaves de API ficam em variáveis de ambiente (`os.environ`), nunca no código; monte URLs com `urllib.parse`.
