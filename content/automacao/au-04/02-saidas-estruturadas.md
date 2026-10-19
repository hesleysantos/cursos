Nesta lição você vai fazer o modelo responder em um formato que o seu programa consegue ler: JSON com campos definidos. Vai aprender a pedir JSON no prompt, a descrever o formato com um esquema (JSON Schema), a usar o modo de saída estruturada dos provedores, a validar o que chegou e a tratar resposta inválida com retentativa. Isso importa porque automação não lê prosa: o passo seguinte do fluxo precisa de `categoria`, `valor` e `vencimento` em campos, não de um parágrafo simpático.

## O problema

Peça "qual é o vencimento desta guia?" e o modelo responde "O vencimento é 20 de abril de 2026, conforme indicado no documento." Um humano entende; um `if` não. Pior: na próxima chamada ele pode responder "20/04/2026" e, na seguinte, "dia 20". **Saída estruturada** é o conjunto de técnicas para a resposta vir sempre no mesmo formato.

## Nível 1: pedir JSON no prompt

A forma mais simples é descrever o formato na instrução e mostrar um exemplo:

```
Extraia os dados da guia e responda SOMENTE com um JSON válido, sem texto antes ou depois,
no formato: {"tipo": "DAS" | "GPS" | "FGTS" | "OUTRO", "competencia": "AAAA-MM",
"vencimento": "AAAA-MM-DD", "valor": número com ponto decimal}
Se um campo não existir no texto, use null.
```

Funciona na maioria das vezes com modelos atuais. Falha de vez em quando: o modelo envolve o JSON em cercas de código (as três crases do Markdown), acrescenta "Aqui está:" antes, usa vírgula decimal ou inventa um campo. Por isso o nível 1 nunca vai sozinho; sempre vem com validação.

## Nível 2: descrever o formato com JSON Schema

**JSON Schema** é um padrão para descrever a forma de um JSON: quais campos existem, de que tipo, quais são obrigatórios, quais valores são permitidos.

```python
import json

ESQUEMA_GUIA = {
    "type": "object",
    "properties": {
        "tipo": {"type": "string", "enum": ["DAS", "GPS", "FGTS", "OUTRO"]},
        "competencia": {"type": "string", "pattern": "^\\d{4}-\\d{2}$"},
        "vencimento": {"type": ["string", "null"]},
        "valor": {"type": ["number", "null"]},
    },
    "required": ["tipo", "competencia", "vencimento", "valor"],
    "additionalProperties": False,
}
print(json.dumps(ESQUEMA_GUIA, indent=1)[:80], "...")
```

Lendo: um objeto com quatro propriedades; `tipo` é texto limitado a quatro valores (`enum`); `competencia` é texto que casa com a regex; `vencimento` e `valor` podem ser nulos; todos são obrigatórios; nenhum campo extra é aceito. Esse esquema serve para duas coisas: entra na chamada da API (nível 3) e valida a resposta (nível 4).

## Nível 3: modo de saída estruturada do provedor

Os três grandes provedores aceitam um esquema na própria chamada e **garantem** que a resposta é um JSON que obedece a ele (ou devolvem erro). Na biblioteca da Anthropic o esquema vai numa opção de configuração de saída da chamada `messages.create`; na da OpenAI, numa opção de formato de resposta; na do Google, numa configuração de geração com tipo de resposta JSON e esquema. Os nomes exatos desses parâmetros mudaram ao longo de 2025 e 2026, então o procedimento é: abrir a página "structured outputs" (ou "JSON mode") da documentação do provedor, copiar o exemplo e encaixar o seu esquema. As bibliotecas Python também aceitam, em vez do dicionário, uma classe **Pydantic**, que descreve o formato como uma classe Python e já devolve o objeto validado.

Mesmo com a garantia do provedor, mantenha a validação do nível 4: o JSON pode ser válido no formato e errado no conteúdo (um valor negativo, uma competência de 2099), e a chamada pode ser cortada por `max_tokens` antes de fechar a chave.

## Nível 4: validar o que chegou

Primeiro, limpe e converta. Depois, confira campos e tipos. Tudo em função reutilizável:

```python
import json, re

def extrair_json(texto):
    """Pega o primeiro objeto JSON do texto, mesmo com cercas ou comentários em volta."""
    texto = re.sub(r"`{3}(?:json)?", "", texto).strip()   # remove cercas de código
    inicio, fim = texto.find("{"), texto.rfind("}")
    if inicio == -1 or fim == -1:
        return None
    try:
        return json.loads(texto[inicio:fim + 1])
    except json.JSONDecodeError:
        return None

def validar_guia(dados):
    """Devolve lista de problemas; lista vazia significa válido."""
    problemas = []
    if not isinstance(dados, dict):
        return ["não é um objeto JSON"]
    for campo in ("tipo", "competencia", "vencimento", "valor"):
        if campo not in dados:
            problemas.append(f"falta o campo {campo}")
    if dados.get("tipo") not in ("DAS", "GPS", "FGTS", "OUTRO"):
        problemas.append("tipo fora da lista")
    if not re.fullmatch(r"\d{4}-\d{2}", str(dados.get("competencia", ""))):
        problemas.append("competencia fora do formato AAAA-MM")
    valor = dados.get("valor")
    if valor is not None and (not isinstance(valor, (int, float)) or valor < 0):
        problemas.append("valor deve ser número não negativo")
    return problemas

cerca = "`" * 3    # as três crases de uma cerca de código Markdown
bruto = "Aqui está:\n" + cerca + 'json\n{"tipo": "DAS", "competencia": "2026-03", "vencimento": "2026-04-20", "valor": 1234.56}\n' + cerca
dados = extrair_json(bruto)
print(dados["valor"], validar_guia(dados))
print(validar_guia({"tipo": "IPTU", "competencia": "03/2026"}))
```

Saída:

```
1234.56 []
['falta o campo vencimento', 'falta o campo valor', 'tipo fora da lista', 'competencia fora do formato AAAA-MM']
```

Para esquemas maiores, a biblioteca `jsonschema` (`pip install jsonschema`) valida um dicionário contra o esquema do nível 2 com `jsonschema.validate(dados, ESQUEMA_GUIA)`, que levanta `ValidationError` com a descrição do problema. Pydantic faz o mesmo com classes.

## Nível 5: retentativa com feedback

Quando a validação falha, não desista nem aceite: **chame de novo, dizendo o que estava errado**. O modelo corrige na segunda tentativa na grande maioria dos casos. O bloco abaixo continua o anterior: usa `extrair_json` e `validar_guia` definidos acima, no mesmo arquivo.

```python
def pedir_com_retentativa(chamar_modelo, prompt, validar, tentativas=3):
    """chamar_modelo(prompt) -> texto; validar(dados) -> lista de problemas."""
    mensagem = prompt
    for n in range(1, tentativas + 1):
        texto = chamar_modelo(mensagem)
        dados = extrair_json(texto)
        problemas = validar(dados)
        if not problemas:
            return dados, n
        mensagem = (prompt + "\n\nSua resposta anterior foi inválida: " + "; ".join(problemas)
                    + ". Responda novamente apenas com o JSON corrigido.")
    return None, tentativas

# simulação: o "modelo" erra na primeira e acerta na segunda
respostas = iter(['{"tipo": "DAS"}', '{"tipo": "DAS", "competencia": "2026-03", "vencimento": null, "valor": 100}'])
dados, usadas = pedir_com_retentativa(lambda p: next(respostas), "extraia", validar_guia)
print(dados, "em", usadas, "tentativas")
```

Saída: `{'tipo': 'DAS', 'competencia': '2026-03', 'vencimento': None, 'valor': 100} em 2 tentativas`.

Três tentativas é um bom teto. Depois disso, o item vai para uma fila de revisão humana com o texto bruto anexado; nunca para o fluxo seguinte com dados inventados ou com `None` silencioso. Registre a taxa de retentativa: se subir, o prompt ou o modelo precisa de ajuste.

## Erros comuns

- Fazer `json.loads` direto na resposta e quebrar com cercas de código ou com "Claro! Aqui está".
- Validar só a forma e não o conteúdo: competência de 2099, valor negativo, CNPJ com 13 dígitos.
- `max_tokens` curto demais: o JSON chega sem a chave final e nunca valida. Deixe folga.
- Aceitar `null` em tudo "para não dar erro": o campo ausente vira linha vazia na planilha sem ninguém perceber.

## Na prática

O robô de guias do módulo 3 extraía valor e vencimento com regex, e quebrava quando o layout do PDF mudava. Com a extração pelo modelo mais esquema e validação, o mesmo robô lê DAS, GPS, FGTS e guias municipais de prefeituras diferentes com o mesmo código; os que falharem três vezes caem numa aba "Revisar", com o texto original ao lado.

## Resumo

- Peça JSON no prompt, com formato e exemplo, e proíba texto em volta.
- Descreva o formato com JSON Schema (`type`, `properties`, `required`, `enum`, `additionalProperties`).
- Use o modo de saída estruturada do provedor copiando o exemplo da documentação atual.
- Valide sempre: extrair o JSON, conferir campos, tipos e conteúdo.
- Resposta inválida gera nova chamada com o motivo; três tentativas e vai para revisão humana.
