Nesta lição você vai aprender o mínimo de tecnologia web que todo vibe coder precisa: os papéis de **HTML**, **CSS** e **JavaScript**, a diferença entre navegador e servidor, o que é **HTTP**, o que é **JSON** e o que é uma **API**. Vai também aprender a ler uma página de erro sem pânico e vai treinar o raciocínio com pequenos exercícios de Python manipulando JSON e validando dados. Isso importa porque, sem esse vocabulário, você não consegue descrever o que quer nem entender o que a IA responde.

## HTML, CSS e JavaScript: os três papéis

Toda página web é feita de três tipos de arquivo, cada um com um papel:

- **HTML** é a estrutura: títulos, parágrafos, formulários, botões. É o esqueleto. Um arquivo `.html` com `<h1>Calculadora</h1>` mostra um título.
- **CSS** é a aparência: cores, tamanhos, espaçamentos, layout para celular. É a roupa. `h1 { color: navy; }` deixa o título azul-marinho.
- **JavaScript** é o comportamento: o que acontece quando alguém clica, digita, envia. É o músculo. É ele que calcula o honorário quando o botão é apertado.

Quando você pede "uma página com um formulário bonito que calcula o valor", a IA gera os três. Saber os nomes permite pedir ajustes precisos: "mude só o CSS do botão" é muito melhor que "deixe mais bonito".

## Navegador e servidor

O **navegador** (Chrome, Edge, Firefox) é o programa no seu computador ou celular que lê HTML, CSS e JavaScript e desenha a página. Tudo o que roda no navegador é chamado de **front-end** ou "lado do cliente".

O **servidor** é um computador em algum lugar que guarda os arquivos e os entrega quando o navegador pede. Muitas vezes ele também executa lógica: consulta um banco de dados, valida um login, envia um e-mail. Isso é o **back-end** ou "lado do servidor".

Uma calculadora de honorários pode viver inteira no navegador: a conta é feita em JavaScript, sem servidor. Um portal com login precisa de servidor, porque os dados dos clientes não podem ficar no computador de quem acessa. Quando você diz à IA "sem servidor" ou "com banco de dados", está escolhendo entre esses dois mundos.

## HTTP: a conversa entre os dois

**HTTP** é o protocolo, isto é, o conjunto de regras da conversa entre navegador e servidor. O navegador faz uma **requisição** ("me dê a página inicial", "grave este formulário") e o servidor devolve uma **resposta** com um **código de status**:

| Código | Significado | O que fazer |
|---|---|---|
| 200 | Deu certo | Nada |
| 301/302 | Endereço mudou (redirecionamento) | Normalmente nada |
| 400 | A requisição está errada (dado faltando ou inválido) | Conferir o que foi enviado |
| 401/403 | Não autenticado / sem permissão | Conferir login e permissões |
| 404 | Não encontrado | Conferir o endereço ou o arquivo |
| 500 | Erro no servidor | O problema está no back-end; ver o registro de erros |

O **HTTPS** é o HTTP com criptografia; o cadeado que você viu no módulo anterior.

## JSON: o formato em que os dados viajam

**JSON** é um formato de texto para representar dados estruturados. É o que as APIs devolvem e o que os formulários enviam. Parece muito com um dicionário de Python:

```json
{
  "cliente": "Padaria Central",
  "cnpj": "12345678000190",
  "regime": "Simples",
  "honorarios": [
    {"competencia": "2026-01", "valor": 1500.0, "pago": true},
    {"competencia": "2026-02", "valor": 1500.0, "pago": false}
  ]
}
```

Chaves entre aspas duplas; valores que podem ser texto, número, verdadeiro/falso, lista (`[...]`) ou outro objeto (`{...}`).

Em Python, o módulo `json` converte texto JSON em dicionários e listas, e vice-versa:

```python
import json

texto = '{"cliente": "Padaria Central", "valor": 1500.0}'
dados = json.loads(texto)        # texto -> dicionário
print(dados["cliente"])          # Padaria Central
print(json.dumps(dados, ensure_ascii=False))  # dicionário -> texto
```

## API: a porta de serviço de um sistema

**API** (interface de programação de aplicações) é a forma como um programa conversa com outro sem interface visual. O Airtable tem uma API: um programa pode ler e gravar registros por HTTP, mandando e recebendo JSON. O provedor de pagamento tem uma API. O site do governo que consulta um CNPJ pode ter uma API.

Quando você pede "integre com o Airtable", a IA vai usar a API do Airtable: fazer requisições HTTP a um endereço, enviando uma **chave de API** para se identificar e JSON com os dados. A chave é um segredo; ela fica em uma **variável de ambiente** (lição 8), nunca no código.

## Ler uma página de erro

Erros assustam porque parecem com ruído. Mas toda mensagem de erro tem três partes úteis:

1. **O tipo**: `TypeError`, `SyntaxError`, `404 Not Found`, `KeyError`. Diz a categoria do problema.
2. **A descrição**: `Cannot read properties of undefined (reading 'valor')` ou `name 'cnpj' is not defined`. Diz o que faltou.
3. **O lugar**: nome do arquivo e número da linha. Diz onde olhar.

No navegador, os erros de JavaScript aparecem no **console**: tecla F12, aba "Console". Em Python, aparecem no terminal, e a última linha é a mais importante. A lição 6 vai aprofundar; por enquanto, o hábito a formar é: **leia a última linha, identifique as três partes, e copie a mensagem inteira para a IA**.

## Treinar o raciocínio com Python

Os exercícios desta lição usam Python porque ele roda aqui no navegador e porque a lógica (ler JSON, validar, decidir) é a mesma que você vai pedir à IA em JavaScript:

```python
import json

def validar_cliente(texto_json):
    dados = json.loads(texto_json)
    erros = []
    if not dados.get("cliente"):
        erros.append("cliente obrigatório")
    cnpj = dados.get("cnpj", "")
    if len(cnpj) != 14 or not cnpj.isdigit():
        erros.append("cnpj deve ter 14 dígitos")
    if dados.get("regime") not in ("Simples", "Presumido", "Real"):
        erros.append("regime inválido")
    return erros

print(validar_cliente('{"cliente": "Padaria", "cnpj": "123", "regime": "Simples"}'))
# ['cnpj deve ter 14 dígitos']
```

Repare no raciocínio: converter o texto em dados, conferir cada regra, acumular os erros em uma lista, devolver a lista. É exatamente o que você vai pedir para a IA fazer no formulário da lição 5.

## Erros comuns

- **Confundir CSS com JavaScript.** "Deixe o botão verde" é CSS; "faça o botão calcular" é JavaScript.
- **Colocar a chave de API no código.** Vai para o GitHub, vaza, alguém usa. Variável de ambiente, sempre.
- **Ignorar a última linha do erro.** É onde está a resposta.

## Na prática

Um contador pediu à IA "um conversor de XML de nota fiscal para planilha". Com o vocabulário desta lição, refinou: "uma página HTML, sem servidor, em que o usuário arrasta o XML; o JavaScript lê os campos e gera um CSV". O pedido preciso saiu certo na primeira tentativa.

## Resumo

- HTML é estrutura, CSS é aparência, JavaScript é comportamento.
- Navegador roda o front-end; servidor roda o back-end; HTTP é a conversa entre eles, com códigos de status.
- JSON é o formato dos dados; APIs são portas de serviço que falam HTTP e JSON; chaves de API são segredos.
- Toda mensagem de erro tem tipo, descrição e lugar; leia a última linha e copie inteira para a IA.
- A lógica de ler, validar e decidir é a mesma em Python e em JavaScript; treine aqui, peça lá.
