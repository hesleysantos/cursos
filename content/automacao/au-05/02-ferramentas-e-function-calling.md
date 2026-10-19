# Ferramentas e function calling

Nesta lição você vai aprender como um modelo de linguagem "usa" uma ferramenta: você descreve a função (nome, descrição, parâmetros em JSON Schema), o modelo escolhe qual chamar e preenche os argumentos, e **o seu código** executa e devolve o resultado. Esse mecanismo, chamado **function calling** ou **tool use**, é o que transforma um chat em agente. Ao final você vai saber definir uma ferramenta, entender o formato da resposta da API e validar os argumentos antes de executar qualquer coisa.

## O modelo não executa nada

A primeira ideia a fixar: o modelo **nunca** roda código, acessa planilha ou envia e-mail. Ele produz um pedido estruturado ("chame `consultar_guia` com `cnpj="12.345.678/0001-90"` e `competencia="2026-09"`"). Quem executa é o seu programa, que depois devolve o resultado como texto para o modelo continuar o raciocínio. Isso é bom: você decide o que pode ou não ser executado.

## Definindo uma ferramenta

Uma ferramenta tem três partes: um **nome** (identificador curto), uma **descrição** (o modelo lê para decidir quando usar) e um **esquema de parâmetros** em JSON Schema (o formato que você viu no módulo 4 para saídas estruturadas). Na API da Anthropic o campo do esquema chama-se `input_schema`; na da OpenAI, `parameters` dentro de `function`. A ideia é idêntica.

```python
import json

consultar_guia = {
    "name": "consultar_guia",
    "description": (
        "Consulta o status de uma guia de imposto (DAS, DARF, GPS) de um cliente "
        "em uma competencia. Use quando o usuario perguntar se uma guia foi emitida, "
        "paga ou esta vencida."
    ),
    "input_schema": {
        "type": "object",
        "properties": {
            "cnpj": {"type": "string", "description": "CNPJ do cliente, so digitos"},
            "tipo": {"type": "string", "enum": ["DAS", "DARF", "GPS"]},
            "competencia": {"type": "string", "description": "Formato AAAA-MM"},
        },
        "required": ["cnpj", "tipo", "competencia"],
        "additionalProperties": False,
    },
}
print(json.dumps(consultar_guia, indent=2, ensure_ascii=False)[:120], "...")
```

A **descrição** é a parte mais importante e a mais negligenciada. O modelo decide com base nela. "Consulta guia" é vago; "use quando o usuário perguntar se uma guia foi emitida, paga ou está vencida" diz exatamente quando chamar. Também vale descrever cada parâmetro e usar `enum` para limitar valores.

## O ciclo de uma chamada

Com a API da Anthropic, a conversa com ferramenta tem este formato (o padrão da OpenAI é parecido, com nomes diferentes):

1. Você envia `messages` e a lista `tools`.
2. Se o modelo decide usar uma ferramenta, a resposta vem com `stop_reason == "tool_use"` e um bloco `tool_use` contendo `id`, `name` e `input` (os argumentos já em formato de dicionário).
3. Seu código executa a função e envia de volta uma mensagem de usuário com um bloco `tool_result`, referenciando o mesmo `tool_use_id`.
4. O modelo lê o resultado e responde em texto (`stop_reason == "end_turn"`) ou pede outra ferramenta.

```python
# Esboço com a biblioteca anthropic (pip install anthropic). Nao roda sem chave.
# import anthropic
# client = anthropic.Anthropic()
# messages = [{"role": "user", "content": "O DAS de setembro da Padaria Sol foi pago?"}]
# resposta = client.messages.create(
#     model="claude-opus-5-5", max_tokens=1024,
#     tools=[consultar_guia], messages=messages,
# )
# if resposta.stop_reason == "tool_use":
#     messages.append({"role": "assistant", "content": resposta.content})
#     resultados = []
#     for bloco in resposta.content:          # pode haver mais de um tool_use na mesma resposta
#         if bloco.type == "tool_use":
#             resultado = executar(bloco.name, bloco.input)   # seu codigo
#             resultados.append({"type": "tool_result", "tool_use_id": bloco.id, "content": resultado})
#     messages.append({"role": "user", "content": resultados})   # todos os resultados numa so mensagem
#     resposta = client.messages.create(model="claude-opus-5-5", max_tokens=1024,
#                                       tools=[consultar_guia], messages=messages)
```

O trecho está comentado porque exige chave de API e rede. Repare em dois detalhes que costumam dar erro: a resposta inteira do modelo (`resposta.content`) entra no histórico como mensagem `assistant` antes dos resultados, e, se o modelo pediu mais de uma ferramenta de uma vez, todos os `tool_result` vão juntos em uma única mensagem `user`. Consulte a documentação oficial de *tool use* da Anthropic (ou de *function calling* da OpenAI) para a versão completa; os nomes dos campos mudam entre fornecedores, o fluxo não. O SDK da Anthropic também oferece um *tool runner* que executa esse laço por você a partir de funções Python decoradas, mas entender o laço manual é o que permite colocar validações e aprovações no meio.

## Validar antes de executar

O modelo preenche os argumentos, mas ele pode errar: inventar um CNPJ com 13 dígitos, escrever "setembro/2026" em vez de "2026-09", ou passar um tipo que não existe. Mesmo com a opção `strict` (que garante que a saída obedece ao esquema), a validação **semântica** é sua: o CNPJ existe na sua carteira? A competência não está no futuro? Um padrão simples, sem biblioteca externa:

```python
import re

def validar_args(schema, args):
    """Devolve lista de erros (vazia se tudo ok)."""
    erros = []
    props = schema["properties"]
    for campo in schema.get("required", []):
        if campo not in args:
            erros.append(f"faltou o campo obrigatorio '{campo}'")
    for campo, valor in args.items():
        if campo not in props:
            erros.append(f"campo desconhecido '{campo}'")
            continue
        regra = props[campo]
        if regra["type"] == "string" and not isinstance(valor, str):
            erros.append(f"'{campo}' deveria ser texto")
        if "enum" in regra and valor not in regra["enum"]:
            erros.append(f"'{campo}' fora das opcoes {regra['enum']}")
    if "competencia" in args and not re.fullmatch(r"\d{4}-(0[1-9]|1[0-2])", str(args["competencia"])):
        erros.append("'competencia' deve estar no formato AAAA-MM")
    return erros

schema = {
    "type": "object",
    "properties": {
        "cnpj": {"type": "string"},
        "tipo": {"type": "string", "enum": ["DAS", "DARF", "GPS"]},
        "competencia": {"type": "string"},
    },
    "required": ["cnpj", "tipo", "competencia"],
}
print(validar_args(schema, {"cnpj": "11222333000181", "tipo": "DAS", "competencia": "2026-09"}))
print(validar_args(schema, {"cnpj": "11222333000181", "tipo": "ISS", "competencia": "setembro"}))
# []
# ["'tipo' fora das opcoes ['DAS', 'DARF', 'GPS']", "'competencia' deve estar no formato AAAA-MM"]
```

Quando a validação falha, você **não executa**: devolve o erro como `tool_result` (com `is_error: true`) e o modelo tenta de novo com argumentos corrigidos. Isso é melhor do que corrigir silenciosamente, porque o modelo aprende o formato dentro da conversa.

## Boas práticas de desenho

- **Poucas ferramentas, bem descritas.** Dez ferramentas específicas confundem menos que uma genérica "executar_sql".
- **Nomes em snake_case e verbos**: `consultar_guia`, `listar_pendencias`, `agendar_reuniao`.
- **Separe leitura de escrita.** Ferramentas que alteram algo (enviar, lançar, pagar) precisam de confirmação (lição 6).
- **Resultados curtos e estruturados.** Devolva JSON ou texto objetivo; despejar 500 linhas de planilha no resultado estoura contexto e custo.
- **Erros informativos.** "Cliente não encontrado; CNPJs válidos têm 14 dígitos" ajuda o modelo a se corrigir.

## Armadilhas

- **Descrição vaga**: o modelo chama a ferramenta errada ou não chama nenhuma.
- **Confiar nos argumentos sem validar**: um CNPJ inventado vira consulta errada e resposta errada com cara de certa.
- **Esquecer o `tool_use_id`**: o resultado precisa referenciar o pedido; sem isso a API rejeita a mensagem.
- **Ferramenta que faz duas coisas**: "consultar_e_enviar" impede a confirmação humana entre a consulta e o envio.

## Na prática

Um escritório definiu quatro ferramentas para o assistente interno: `buscar_cliente(nome_ou_cnpj)`, `listar_obrigacoes(cnpj, competencia)`, `localizar_guia(cnpj, tipo, competencia)` e `enviar_whatsapp(cnpj, mensagem)`. As três primeiras são de leitura e rodam livremente; a última só executa após uma pessoa clicar em "aprovar". Toda chamada passa pelo `validar_args` e é registrada em log com data, argumentos e resultado. Em duas semanas, o log mostrou que 15% das chamadas de `localizar_guia` vinham com competência em formato errado; ajustaram a descrição do parâmetro ("sempre AAAA-MM, ex.: 2026-09") e o erro sumiu.

## Resumo

- Function calling: você descreve a ferramenta, o modelo escolhe e preenche os argumentos, o seu código executa e devolve o resultado.
- Uma ferramenta tem nome, descrição clara (quando usar) e parâmetros em JSON Schema, com `required` e `enum`.
- A resposta traz um bloco `tool_use` com `id`, `name` e `input`; você responde com `tool_result` e o mesmo `tool_use_id`.
- Valide argumentos (formato e semântica) antes de executar; em caso de erro, devolva a mensagem ao modelo.
- Separe ferramentas de leitura das de escrita e registre todas as chamadas.
