# Saída estruturada e scripts

Nesta lição você vai aprender a fazer o Claude Code devolver **dados que um programa consegue ler**: JSON com campos definidos por você, validado em Python, com tratamento de erro, código de saída e custo por execução. Sem isso, automação vira "colar texto e torcer": com isso, vira um sistema confiável.

## Por que JSON

Texto livre é bom para humanos e péssimo para scripts: um dia o modelo escreve "Fornecedor: ACME", no outro "Emitente – ACME". Quando a resposta precisa alimentar um banco, uma planilha ou uma decisão automática, peça **estrutura**. O Claude Code oferece dois níveis:

1. `--output-format json`: o envelope da execução vira um objeto JSON com metadados. O texto da resposta fica no campo `result`.
2. `--json-schema '{...}'` junto com `--output-format json`: além do envelope, o agente é obrigado a entregar, ao final, um objeto que obedece ao seu **JSON Schema**; ele chega no campo `structured_output`, já validado. Se o esquema não for válido, o comando encerra com erro antes de começar.

```powershell
$schema = '{"type":"object","properties":{"tipo":{"type":"string","enum":["nota_fiscal","boleto","extrato","outro"]},"cnpj":{"type":"string"},"valor":{"type":"number"}},"required":["tipo"]}'
Get-Content .\entrada\doc1.txt | claude -p "Classifique este documento contábil" `
  --bare --output-format json --json-schema $schema --max-turns 2 --permission-mode dontAsk
```

Dica da documentação: mantenha o esquema **focado**. Esquemas profundos, com muitos campos obrigatórios, são mais difíceis de satisfazer; torne opcional o que o documento pode não ter.

## O envelope da execução

Com `--output-format json`, a saída é um único objeto. Os campos que interessam a um script, conforme a referência do Agent SDK:

| Campo | Significado |
|---|---|
| `type` | `"result"` |
| `subtype` | `"success"` ou um erro: `error_max_turns`, `error_max_budget_usd`, `error_during_execution`, `error_max_structured_output_retries` |
| `is_error` | `true` quando a execução falhou; é um campo separado de `subtype`, então confira os dois (um resultado pode trazer `subtype` `success` e `is_error` `true`) |
| `result` | texto final da resposta |
| `structured_output` | o objeto validado, quando você passou `--json-schema` |
| `session_id` | identificador para `--resume` |
| `num_turns` | turnos agênticos usados |
| `total_cost_usd` | **estimativa** de custo calculada no cliente |
| `usage` | tokens de entrada, saída e cache do laço principal |
| `permission_denials` | o que foi negado por falta de permissão |

> **Atenção:** `total_cost_usd` é uma estimativa feita a partir de uma tabela de preços embutida; a cobrança real está no Console. Use para acompanhar tendência, não para faturar.

## Validar em Python

A saída do comando é texto; o script precisa interpretá-la com `json.loads`, conferir os campos e só então usar os dados. Uma função defensiva:

```python
import json

def extrair_resultado(texto):
    """Interpreta a saída de `claude -p --output-format json`."""
    try:
        dados = json.loads(texto)
    except json.JSONDecodeError as e:
        return {"ok": False, "erro": f"JSON invalido: {e}"}
    if not isinstance(dados, dict) or dados.get("type") != "result":
        return {"ok": False, "erro": "envelope inesperado"}
    if dados.get("is_error") or dados.get("subtype") != "success":
        return {"ok": False, "erro": dados.get("subtype", "desconhecido")}
    return {
        "ok": True,
        "texto": dados.get("result", ""),
        "dados": dados.get("structured_output"),
        "custo": dados.get("total_cost_usd", 0.0),
        "turnos": dados.get("num_turns", 0),
    }

exemplo = '{"type":"result","subtype":"success","is_error":false,"result":"ok","structured_output":{"tipo":"boleto"},"total_cost_usd":0.012,"num_turns":1,"session_id":"abc"}'
print(extrair_resultado(exemplo))
# {'ok': True, 'texto': 'ok', 'dados': {'tipo': 'boleto'}, 'custo': 0.012, 'turnos': 1}
```

Repare na ordem: primeiro JSON válido, depois envelope certo, depois sucesso, só então os dados. Um `structured_output` ausente com `subtype` `success` também deve ser tratado como falha quando você pediu esquema; a documentação recomenda exatamente isso.

## Chamando o Claude de dentro do Python

Para orquestrar várias execuções, chame a CLI com `subprocess`:

```python
import json
import subprocess

def classificar(caminho, schema):
    with open(caminho, encoding="utf-8") as f:
        conteudo = f.read()
    proc = subprocess.run(
        ["claude", "-p", "Classifique este documento contábil", "--bare",
         "--output-format", "json", "--json-schema", json.dumps(schema),
         "--max-turns", "2", "--permission-mode", "dontAsk"],
        input=conteudo, capture_output=True, text=True, encoding="utf-8",
        timeout=300,
    )
    if proc.returncode != 0:
        raise RuntimeError(f"claude saiu com {proc.returncode}: {proc.stderr[:200]}")
    return extrair_resultado(proc.stdout)
```

Esse bloco é um trecho de referência: não roda no navegador do curso porque depende do executável `claude` e de uma chave de API no ambiente. Três decisões importantes: `timeout` para não travar o lote, `returncode` antes de qualquer parse, e o conteúdo entrando por `input` (stdin), não como argumento, para não estourar o limite da linha de comando.

## Códigos de saída e tratamento de erros

Trate três camadas separadas:

1. **Processo**: `returncode` diferente de zero, timeout, executável não encontrado. Ação: registrar e reprocessar depois.
2. **Execução**: `is_error`, `subtype` de erro, `permission_denials` não vazio. Ação: revisar prompt ou permissões; não repetir cegamente.
3. **Dados**: JSON válido, mas campos fora do esperado (CNPJ com 10 dígitos, valor negativo). Ação: validação de negócio em Python, como você faria com qualquer entrada externa.

## Custo por execução e limites

Cada chamada tem custo e tempo. Para controlar: `--max-turns` limita o laço; `--max-budget-usd` interrompe pela estimativa de gasto (deixe folga, a estimativa pode ultrapassar); `--model` com um modelo menor para tarefas simples; `--bare` reduz o contexto carregado. Some `total_cost_usd` de cada execução em um registro: ao final do lote você sabe quanto custou classificar 50 documentos e pode estimar 500.

## Erros comuns

- Pedir JSON só no prompt ("responda em JSON") e não usar `--json-schema`: o texto pode vir com explicações antes das chaves e quebrar o `json.loads`.
- Esquecer `--output-format json` junto com `--json-schema`.
- Esquema com `required` para campos que o documento nem sempre tem: gera `error_max_structured_output_retries`.
- Usar `total_cost_usd` como valor de fatura.
- Não definir `timeout` no `subprocess`.

## Na prática

Um fluxo típico no escritório: PDF → texto (com uma biblioteca de extração) → `claude -p` com esquema → validação Python → gravação em SQLite ou planilha → relatório. O JSON Schema é o contrato entre o modelo e o resto do sistema. Quando o contrato muda, mude o esquema e o validador juntos, e rode um lote de teste antes de colocar em produção.

## Resumo

- `--output-format json` devolve um envelope com `result`, `subtype`, `is_error`, `session_id`, `num_turns` e `total_cost_usd`.
- `--json-schema` faz o agente entregar um objeto validado em `structured_output`.
- Em Python: `json.loads` → conferir envelope → conferir sucesso → validar dados de negócio.
- Trate processo, execução e dados como camadas distintas de erro.
- `total_cost_usd` é estimativa; limites (`--max-turns`, `--max-budget-usd`) protegem o lote.
