Nesta lição você vai usar o módulo HTTP para chamar qualquer API de dentro do fluxo: montar a URL, definir cabeçalhos, enviar e receber JSON, autenticar com chave, Bearer ou OAuth e interpretar a resposta. O exemplo é consultar um CNPJ na BrasilAPI e gravar os dados na planilha. Ao final, você vai treinar a leitura dessa lógica em Python. Isso importa porque o módulo HTTP é a chave mestra: quando não existe conector pronto para um serviço, ele resolve.

## O módulo HTTP

Make, n8n, Zapier e Power Automate têm um bloco genérico chamado **HTTP** (ou "Webhooks by Zapier", "HTTP" e "HTTP com Microsoft Entra ID" no Power Automate etc.). Ele faz exatamente o que você aprendeu no módulo anterior: envia uma requisição (URL, método, cabeçalhos, corpo) e devolve status, cabeçalhos e corpo. A diferença para um conector pronto é que você preenche tudo à mão, com base na documentação da API.

Os campos do módulo HTTP, em qualquer ferramenta:

| Campo | O que colocar | Exemplo (BrasilAPI CNPJ) |
|---|---|---|
| **URL** | O endereço do recurso, com os parâmetros | `https://brasilapi.com.br/api/cnpj/v1/12345678000190` |
| **Método** | GET, POST, PUT, DELETE | GET |
| **Cabeçalhos** | Pares nome: valor | `Accept: application/json` |
| **Corpo** | Dados enviados (só em POST/PUT), em geral JSON | (vazio no GET) |
| **Parse da resposta** | Marque para a ferramenta converter o JSON em campos | Sim |

> **Dica:** antes de montar no fluxo, teste a URL no navegador (para GET sem autenticação) e leia o JSON cru. Depois reproduza no módulo HTTP.

## Consultando CNPJ na BrasilAPI

A BrasilAPI expõe um endpoint de CNPJ que devolve os dados cadastrais públicos. A URL é formada pela base da API mais o CNPJ **só com dígitos**. A resposta inclui campos como `razao_social`, `nome_fantasia`, `descricao_situacao_cadastral`, `cnae_fiscal`, `cnae_fiscal_descricao`, `uf`, `municipio`, `data_inicio_atividade` e uma lista `qsa` com os sócios. Os nomes podem evoluir; confira na documentação atual.

Fluxo completo:

```
[Formulário: novo cadastro]
   -> [Função: cnpj_limpo = só dígitos do CNPJ]
   -> [HTTP GET https://brasilapi.com.br/api/cnpj/v1/{{cnpj_limpo}}]
   -> [Roteador]
        status = 200 -> [Sheets: adicionar linha com razao_social, situacao, cnae, uf]
        status = 404 -> [Sheets: adicionar linha com status "CNPJ não encontrado"] -> [Alerta]
        senão        -> [Alerta ao responsável: erro na consulta]
```

Passos genéricos:

1. **Limpe o CNPJ.** O formulário recebe "12.345.678/0001-90"; a API quer "12345678000190". Use a função de substituição com expressão regular para remover tudo que não é dígito (`[^0-9]` → vazio).
2. **Monte a URL** mapeando a variável limpa no fim do endereço.
3. **Ative o parse** da resposta para que os campos do JSON apareçam como campos mapeáveis.
4. **Trate o status.** A maioria das ferramentas interrompe o fluxo quando o status não é 2xx, a menos que você marque uma opção como "continuar mesmo com erro" ou "aceitar qualquer status". Marque, e trate o status no roteador.
5. **Mapeie os campos** da resposta nas colunas da planilha.

Teste com um CNPJ válido, um inválido (dígitos aleatórios) e um com formatação (pontos e barra), e observe as três rotas.

## Cabeçalhos e JSON no POST

Quando a API exige envio de dados (criar um cliente num ERP, emitir um boleto), você usa POST com corpo em JSON. Dois cabeçalhos quase sempre necessários:

- `Content-Type: application/json` diz que o corpo é JSON.
- `Accept: application/json` pede a resposta em JSON.

No corpo, você escreve o JSON com os campos mapeados:

```json
{
  "razao_social": "{{formulário.empresa}}",
  "cnpj": "{{cnpj_limpo}}",
  "email": "{{formulário.email}}"
}
```

Cuidado com aspas: valores de texto vão entre aspas, números e booleanos não. Um campo com aspas dentro do valor (nome com `"`) quebra o JSON; use a função de escape da ferramenta, se houver, ou remova aspas antes.

## Autenticação no módulo HTTP

| Tipo | Como configurar | Onde aparece |
|---|---|---|
| **Chave de API no cabeçalho** | Cabeçalho `X-API-Key: SUA_CHAVE` (o nome varia) | ERPs, serviços de boleto, APIs de IA |
| **Bearer token** | Cabeçalho `Authorization: Bearer SEU_TOKEN` | A maioria das APIs modernas |
| **Basic** | Usuário e senha codificados; a ferramenta monta | Sistemas mais antigos |
| **OAuth 2.0** | A ferramenta tem um tipo de credencial específico; você cadastra client ID e secret da API e autoriza | Google, Microsoft, Meta, bancos |

Em todas, use o **cofre de credenciais** da ferramenta em vez de digitar a chave no cabeçalho. No n8n, crie uma credencial do tipo "Header Auth" ou "OAuth2" e associe ao nó HTTP; no Make, use a opção de "keychain" ou de autenticação do módulo. Assim a chave fica fora do fluxo exportado e dos logs.

## Parse da resposta

Com o parse ativado, a resposta vira campos. Para campos aninhados, a ferramenta mostra a hierarquia: no Make, `qsa[1].nome_socio` é o nome do primeiro sócio (as listas do Make começam em 1); no n8n e em Python, a contagem começa em 0, então o primeiro sócio é `qsa[0].nome_socio`. Para listas (como `qsa`), use um iterador se quiser uma linha por sócio, ou um agregador para juntar todos os nomes numa célula.

## Treino de leitura em Python

A mesma lógica, escrita em Python, ajuda a entender o que a ferramenta faz nos bastidores. Não é para rodar aqui com rede; é para ler:

```python
import re
import json

def montar_url(cnpj):
    """Remove tudo que não é dígito e monta a URL da BrasilAPI."""
    cnpj_limpo = re.sub(r"[^0-9]", "", cnpj)
    return f"https://brasilapi.com.br/api/cnpj/v1/{cnpj_limpo}"

def interpretar(status, corpo):
    """Decide o que fazer com a resposta, como o roteador do fluxo."""
    if status == 200:
        dados = json.loads(corpo)
        return {"ok": True, "razao_social": dados["razao_social"], "uf": dados["uf"]}
    if status == 404:
        return {"ok": False, "motivo": "CNPJ não encontrado"}
    return {"ok": False, "motivo": f"erro {status}"}

print(montar_url("12.345.678/0001-90"))
print(interpretar(200, '{"razao_social": "PADARIA PAO QUENTE ME", "uf": "SP"}'))
print(interpretar(404, '{"message": "CNPJ não encontrado"}'))
```

Saída:

```
https://brasilapi.com.br/api/cnpj/v1/12345678000190
{'ok': True, 'razao_social': 'PADARIA PAO QUENTE ME', 'uf': 'SP'}
{'ok': False, 'motivo': 'CNPJ não encontrado'}
```

Repare: `montar_url` é o passo de limpeza mais a URL; `interpretar` é o roteador por status. Quando um fluxo visual ficar confuso, escrevê-lo assim em texto costuma esclarecer.

## Erros comuns

- Mandar o CNPJ com pontos e barra na URL e receber 404 ou 400.
- Não ativar o parse e tentar mapear um "texto" em vez de campos.
- Deixar o módulo interromper o fluxo em erro 404, quando o 404 é um caso esperado.
- Digitar a chave direto no cabeçalho em vez de usar o cofre.
- Esquecer `Content-Type: application/json` no POST e receber 400.
- Ultrapassar o limite de requisições de uma API pública ao iterar centenas de CNPJs de uma vez; insira uma pausa entre chamadas.

## Na prática

APIs públicas úteis para o escritório: BrasilAPI (CNPJ, CEP, feriados, bancos), ViaCEP (CEP). APIs privadas: o ERP ou sistema contábil (clientes, lançamentos), plataformas de boleto e PIX, o sistema de assinatura eletrônica. Para cada uma, abra a documentação, localize "autenticação" e "endpoints" e reproduza um GET simples no módulo HTTP antes de qualquer POST.

## Resumo

- O módulo HTTP chama qualquer API: URL, método, cabeçalhos, corpo, parse.
- Limpe o CNPJ (só dígitos) antes de montar a URL; trate 200, 404 e outros com roteador.
- POST com JSON exige `Content-Type: application/json`; cuidado com aspas nos valores.
- Autenticação: chave no cabeçalho, Bearer, Basic ou OAuth 2.0, sempre via cofre de credenciais.
- Em Python, montar a URL e interpretar o status é o mesmo raciocínio do fluxo visual.
