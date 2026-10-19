# Web com Flask e FastAPI

Nesta lição você aprende a transformar funções Python em um serviço web: definir rotas, receber dados da requisição, devolver HTML com templates Jinja2 ou JSON para outros programas, rodar localmente e organizar o projeto. Vamos usar **Flask** para o básico de páginas e **FastAPI** para APIs JSON modernas, e você verá que o coração dos dois é o mesmo: uma função que recebe uma requisição e devolve uma resposta.

## Por que colocar seu código na web?

Até aqui seus scripts rodam no seu computador, para você. Um serviço web permite que **outras pessoas e outros programas** usem seu código: o colega consulta o fechamento pelo navegador, o sistema do cliente envia lançamentos para a sua API, o site da empresa exibe um painel. Em vez de mandar planilhas por e-mail, você publica uma URL.

Um framework web cuida da parte chata (ouvir a porta, interpretar HTTP, montar a resposta) e deixa para você só a lógica: "quando chegar GET em `/clientes/5`, devolva os dados do cliente 5".

## Flask: o mínimo que funciona

Instale com `pip install flask`. Um arquivo basta:

```python
# app.py
from flask import Flask, jsonify, request, render_template, abort

app = Flask(__name__)

CLIENTES = {
    1: {"id": 1, "nome": "Padaria Pão Quente", "regime": "Simples"},
    2: {"id": 2, "nome": "Oficina do Zé", "regime": "Presumido"},
}

@app.route("/")
def inicio():
    return "<h1>Escritório Contábil</h1>"

@app.route("/clientes/<int:cliente_id>")
def ver_cliente(cliente_id):
    cliente = CLIENTES.get(cliente_id)
    if cliente is None:
        abort(404)
    return jsonify(cliente)

if __name__ == "__main__":
    app.run(debug=True)
```

Rode com `python app.py` (ou `flask --app app run --debug`) e acesse `http://127.0.0.1:5000/clientes/1`:

```bash
$ curl http://127.0.0.1:5000/clientes/1
{
  "id": 1,
  "nome": "Padaria Pão Quente",
  "regime": "Simples"
}
$ curl -i http://127.0.0.1:5000/clientes/9
HTTP/1.1 404 NOT FOUND
```

O decorator `@app.route` liga a URL à função (a **view**). `<int:cliente_id>` captura um pedaço da URL e converte para inteiro. `jsonify` serializa e põe o `Content-Type` certo; `abort(404)` interrompe com o status indicado. `debug=True` recarrega ao salvar e mostra erros detalhados, **só em desenvolvimento** (e, em modo debug, o JSON sai indentado; fora dele, compacto). Repare no `ã`: por padrão o Flask escapa caracteres não ASCII, o que é válido e qualquer cliente JSON lê corretamente; para ver os acentos, defina `app.json.ensure_ascii = False`.

## Recebendo dados: query string, formulário e JSON

```python
@app.route("/clientes")
def listar():
    regime = request.args.get("regime")            # ?regime=Simples
    itens = [c for c in CLIENTES.values() if not regime or c["regime"] == regime]
    return jsonify(itens)

@app.route("/clientes", methods=["POST"])
def criar():
    dados = request.get_json(silent=True)
    if not dados or "nome" not in dados:
        return jsonify({"erro": "campo 'nome' é obrigatório"}), 400
    novo_id = max(CLIENTES) + 1
    CLIENTES[novo_id] = {"id": novo_id, "nome": dados["nome"], "regime": dados.get("regime", "Simples")}
    return jsonify(CLIENTES[novo_id]), 201
```

`request.args` traz a query string, `request.form` os campos de formulário HTML e `request.get_json()` o corpo JSON. Devolver uma tupla `(corpo, status)` define o código de resposta. Repare na validação: **nunca confie no que chega**. Payload sem `nome` recebe 400 com mensagem clara, em vez de um `KeyError` virando 500.

A mesma rota aceita GET e POST com funções diferentes: a URL identifica o recurso, o método identifica a ação, exatamente a convenção REST da lição 1.

## Templates com Jinja2

Para páginas HTML, Flask usa **Jinja2**: você escreve HTML com marcações `{{ variavel }}` e `{% for %}` e o Flask preenche. Os arquivos ficam na pasta `templates/`.

```python
@app.route("/painel")
def painel():
    total = len(CLIENTES)
    return render_template("painel.html", clientes=CLIENTES.values(), total=total)
```

```html
<!-- templates/painel.html -->
<h1>Clientes ({{ total }})</h1>
<ul>
  {% for c in clientes %}
    <li>{{ c.nome }} - {{ c.regime }}</li>
  {% else %}
    <li>Nenhum cliente.</li>
  {% endfor %}
</ul>
```

Jinja2 **escapa** HTML automaticamente: se um nome contiver uma tag de script, ela aparece como texto, não executa. Isso evita a vulnerabilidade XSS sem você fazer nada. Filtros como `{{ valor | round(2) }}` e herança de templates (`{% extends "base.html" %}`) completam o kit; é a mesma Jinja2 que você pode usar fora da web para gerar e-mails e relatórios.

## FastAPI: APIs JSON com validação automática

`pip install "fastapi[standard]"`. O FastAPI usa **type hints** e **Pydantic** para validar entrada e documentar a API sozinho.

```python
# main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI(title="API do Escritório")

class LancamentoIn(BaseModel):
    conta: str = Field(min_length=1)
    valor: float = Field(gt=0)
    historico: str = ""

class LancamentoOut(LancamentoIn):
    id: int

BANCO: dict[int, LancamentoOut] = {}

@app.get("/lancamentos/{lanc_id}", response_model=LancamentoOut)
def obter(lanc_id: int):
    if lanc_id not in BANCO:
        raise HTTPException(status_code=404, detail="Lançamento não encontrado")
    return BANCO[lanc_id]

@app.post("/lancamentos", response_model=LancamentoOut, status_code=201)
def criar(dados: LancamentoIn):
    novo = LancamentoOut(id=len(BANCO) + 1, **dados.model_dump())
    BANCO[novo.id] = novo
    return novo
```

Rode com `fastapi dev main.py` (ou `uvicorn main:app --reload`) e abra `http://127.0.0.1:8000/docs`: a documentação interativa (Swagger) já está lá, gerada a partir dos tipos. Envie `{"conta": "", "valor": -5}` e receba um **422** detalhando cada campo inválido, sem que você tenha escrito uma linha de validação.

```bash
$ curl -X POST http://127.0.0.1:8000/lancamentos -H "Content-Type: application/json" \
       -d '{"conta":"1.1.01","valor":1500,"historico":"NF 123"}'
{"conta":"1.1.01","valor":1500.0,"historico":"NF 123","id":1}
```

FastAPI é assíncrono por natureza: você pode declarar `async def` nas rotas e usar `await` com bancos e clientes HTTP assíncronos, aproveitando a lição anterior. Rotas `def` comuns também funcionam (ele as roda em threads).

## Flask ou FastAPI?

| Critério | Flask | FastAPI |
|---|---|---|
| Páginas HTML com templates | Muito natural | Possível, menos comum |
| API JSON | Funciona, validação manual | Validação e docs automáticas |
| Curva de aprendizado | Menor | Pequena, exige type hints |
| Async | Limitado | Nativo |
| Ecossistema | Enorme, maduro | Crescendo rápido |

Para um painel interno com algumas páginas, Flask. Para uma API consumida por outros sistemas, FastAPI. Os conceitos (rota, request, response, status, template) são os mesmos.

## Estrutura de projeto

Um único arquivo serve para aprender; um projeto real se organiza em camadas, exatamente como nos módulos anteriores:

```
escritorio/
  app/
    __init__.py       # cria o app (create_app) e registra rotas
    rotas.py          # views finas: recebem request, chamam serviços, devolvem resposta
    servicos.py       # regras de negócio: funções puras, testáveis
    repositorio.py    # acesso a banco (sqlite3)
    validadores.py    # validar_payload(), normalizar_cnpj()...
  templates/
  static/
  tests/
    test_servicos.py
    test_rotas.py     # usa app.test_client()
  .env                # SECRET_KEY, DATABASE_URL (no .gitignore)
  requirements.txt
```

A regra de ouro: **as rotas não contêm lógica**. Elas traduzem HTTP para chamadas de função e traduzem o retorno em resposta. Toda regra (validar payload, calcular total, montar o dicionário de resposta) fica em funções puras que você testa sem servidor nenhum. É por isso que os exercícios desta lição pedem essas funções: elas são o que realmente importa, o framework é a embalagem.

```python
# servicos.py: puro, sem Flask
def validar_payload(dados: dict) -> list[str]:
    erros = []
    if not dados.get("nome", "").strip():
        erros.append("nome é obrigatório")
    if dados.get("regime") not in {"Simples", "Presumido", "Real"}:
        erros.append("regime inválido")
    return erros

# rotas.py: fino
@app.route("/clientes", methods=["POST"])
def criar():
    dados = request.get_json(silent=True) or {}
    erros = validar_payload(dados)
    if erros:
        return jsonify({"erros": erros}), 400
    ...
```

## Rodando localmente e além

Em desenvolvimento: `flask run --debug` ou `fastapi dev`. Em produção, nunca o servidor de desenvolvimento: use `gunicorn` (Linux) ou `waitress` (Windows) para Flask, e `uvicorn` com vários workers para FastAPI, atrás de um proxy como Nginx. Segredos (`SECRET_KEY`, senhas de banco) vêm de variáveis de ambiente.

## Armadilhas comuns

- **`debug=True` em produção**: expõe um console que executa código.
- **Lógica dentro das rotas**: impossível testar sem subir o servidor.
- **Confiar no payload**: valide tudo; devolva 400/422 com mensagem útil.
- **Montar HTML com f-strings**: perde o escape automático; use templates.
- **Estado em variáveis globais** (como o dicionário `CLIENTES` dos exemplos): some ao reiniciar e quebra com vários workers. Em projetos reais, banco de dados.
- **Esquecer o `Content-Type: application/json`** ao testar com curl: `get_json(silent=True)` devolve `None` (sem `silent`, o Flask responde 415 Unsupported Media Type).

## Na prática

O primeiro serviço web de um escritório costuma ser um **painel interno**: uma página Flask que lê o SQLite do robô de fechamento e mostra, por cliente, o que já foi entregue no mês. Roda em um computador da rede local, sem internet, e substitui a planilha compartilhada que todo mundo sobrescreve. O passo seguinte é expor a mesma consulta como JSON (FastAPI) para que o sistema do cliente ou uma planilha com Power Query busque os dados sozinhos.

## Resumo

- Rota = URL + método HTTP ligados a uma função que recebe a requisição e devolve a resposta (corpo + status).
- Flask: `@app.route`, `request.args/form/get_json()`, `jsonify`, `render_template` com Jinja2 (escape automático).
- FastAPI: type hints + Pydantic validam a entrada, geram 422 e documentação em `/docs`; async nativo.
- Rotas finas, lógica em funções puras (validar payload, montar resposta) que você testa sem servidor.
- Desenvolvimento com servidor embutido; produção com gunicorn/waitress/uvicorn e segredos em variáveis de ambiente.
