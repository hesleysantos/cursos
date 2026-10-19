Nesta lição você vai aprender a chamar um modelo de linguagem **a partir do seu próprio código**: a estrutura de uma chamada à API, o papel do **prompt de sistema**, como obter **saídas estruturadas em JSON** que o programa consegue usar, a noção de **streaming**, como os **custos por token** se acumulam e o que o **cache** economiza. Isso importa porque é a ponte entre "conversar com a IA" e "construir com a IA": tudo que você viu em agentes, assistentes e RAG vira, no fim, chamadas como as desta lição.

## A estrutura de uma chamada

Todos os grandes provedores (Anthropic, OpenAI, Google e outros) oferecem APIs com o mesmo formato geral. Você envia uma requisição HTTP com:

- o **modelo** a usar;
- um **prompt de sistema**: instruções fixas sobre papel, formato e limites;
- a lista de **mensagens** da conversa (usuário e assistente, alternados);
- parâmetros como **máximo de tokens de saída** e **temperatura** (quanto o modelo varia; para tarefas de extração, baixa).

E recebe uma resposta com o texto gerado, o motivo da parada e a **contagem de tokens** usada. O código para isso é curto e a IA o gera bem; peça na linguagem do seu backend:

```text
Escreva uma função em Python que chame a API do [provedor] usando a
biblioteca oficial, com a chave lida da variável de ambiente
LLM_API_KEY. Parâmetros: prompt de sistema, mensagem do usuário,
máximo de 800 tokens de saída, temperatura 0. Devolva o texto da resposta
e a contagem de tokens de entrada e saída. Trate erro de rede e de limite
(429) com até 3 tentativas e espera crescente.
```

Os nomes exatos dos campos e dos modelos mudam; consulte a documentação atual do provedor. O que não muda é a estrutura: sistema + mensagens → texto + uso.

## O prompt de sistema

O prompt de sistema é o lugar das regras que valem para todas as chamadas. Para um classificador de documentos do escritório:

```text
Você classifica documentos recebidos por um escritório contábil.
Categorias possíveis: nota_fiscal, contrato, extrato_bancario, guia_imposto,
outro. Responda SOMENTE com JSON válido, sem texto antes ou depois, no
formato: {"categoria": "...", "confianca": 0.0 a 1.0, "motivo": "..."}.
Se o texto estiver ilegível ou vazio, use "outro" com confianca 0.
```

Repare na separação: o **sistema** diz o que o modelo é e como responde; a **mensagem do usuário** traz o documento a classificar. Isso permite reaproveitar o sistema em milhares de chamadas e trocar só o conteúdo.

## Saídas estruturadas em JSON

Texto livre é bom para humanos e ruim para programas. Se o modelo responde "Acho que é uma nota fiscal, bem provável", seu código precisa adivinhar. Se responde `{"categoria": "nota_fiscal", "confianca": 0.92}`, seu código lê e decide.

Três níveis de garantia, do mais simples ao mais robusto:

1. **Pedir JSON no prompt** (como acima) e **validar** a resposta no código. Funciona na maioria das vezes; a validação pega as exceções.
2. **Modo JSON** ou **saída estruturada** do provedor: você envia um esquema (quais campos, de que tipo) e o provedor garante que a resposta obedece. Os nomes do recurso variam; consulte a documentação.
3. **Function calling** com uma "ferramenta" cujo único papel é receber os campos — a resposta vem como argumentos tipados.

Qualquer que seja o nível, **valide sempre**. Em Python, o padrão é: carregar o JSON, conferir campos obrigatórios e tipos, rejeitar o que estiver errado. Montar o payload (o corpo da requisição) e validar a resposta são duas funções pequenas:

```python
import json

CATEGORIAS = {"nota_fiscal", "contrato", "extrato_bancario", "guia_imposto", "outro"}

def montar_payload(modelo, sistema, texto_documento, max_tokens=300):
    return {
        "model": modelo,
        "max_tokens": max_tokens,
        "temperature": 0,
        "system": sistema,
        "messages": [{"role": "user", "content": texto_documento}],
    }

def validar_classificacao(resposta_texto):
    """Devolve (dados, erro). Se erro for None, dados é um dicionário válido."""
    try:
        dados = json.loads(resposta_texto)
    except json.JSONDecodeError:
        return None, "resposta não é JSON válido"
    if not isinstance(dados, dict):
        return None, "resposta deve ser um objeto JSON"
    if dados.get("categoria") not in CATEGORIAS:
        return None, "categoria desconhecida"
    conf = dados.get("confianca")
    if isinstance(conf, bool) or not isinstance(conf, (int, float)) or not 0 <= conf <= 1:
        return None, "confianca deve ser número entre 0 e 1"
    return dados, None

print(validar_classificacao('{"categoria": "contrato", "confianca": 0.9, "motivo": "cláusulas"}'))
# ({'categoria': 'contrato', 'confianca': 0.9, 'motivo': 'cláusulas'}, None)
print(validar_classificacao('Acho que é um contrato'))
# (None, 'resposta não é JSON válido')
```

O par `(dados, erro)` é um padrão útil: quem chama confere `erro` e decide — tentar de novo, mandar para revisão humana, registrar no log.

## Streaming: noção

Por padrão, a API devolve a resposta inteira quando termina. Com **streaming**, ela envia pedaço a pedaço enquanto gera, e a tela mostra o texto aparecendo. Não muda o custo nem a qualidade; muda a **percepção** de velocidade. Vale para chats e resumos longos que uma pessoa lê; não vale para classificações que um programa consome — nesse caso, espere a resposta completa e valide.

## Custos por token

A conta que você viu no módulo anterior se aplica a cada chamada: tokens de entrada × preço de entrada + tokens de saída × preço de saída. A API devolve as contagens exatas na resposta; **registre-as** por chamada e some por dia. Três alavancas de economia, em ordem de impacto:

1. **Modelo**: o mais barato que resolve a tarefa. Classificar documentos raramente exige o modelo topo de linha.
2. **Entrada**: mande só o necessário. Um extrato de 40 páginas para descobrir o banco pode ser cortado nas primeiras linhas.
3. **Saída**: peça respostas curtas e limite `max_tokens`.

## Cache

Quando o mesmo prompt de sistema (longo, com regras e exemplos) é enviado milhares de vezes, os provedores oferecem **cache de prompt**: a parte repetida é processada uma vez e reaproveitada por um período, com desconto no custo e ganho de velocidade. Funciona para o que é **idêntico e vem primeiro** na requisição — por isso o sistema fica antes e o documento variável depois. Há também o cache que você mesmo faz: guardar no banco a resposta para um documento já classificado e não perguntar duas vezes.

## Erros comuns

- Colocar a chave no código ou no frontend.
- Não validar o JSON e deixar o programa quebrar na primeira resposta fora do formato.
- Temperatura alta em tarefas de extração.
- Mandar o documento inteiro quando só o cabeçalho importa.
- Não registrar o uso de tokens e descobrir o custo na fatura.

## Na prática

O backend do escritório recebe um PDF, extrai o texto, monta o payload com o sistema de classificação, chama a API, valida a resposta e grava a categoria. Com `confianca` abaixo de 0,7, o documento vai para uma fila de revisão humana. O uso de tokens vai para uma tabela; no fim do mês, um painel mostra custo por categoria e a taxa de revisão.

## Resumo

- Chamada = modelo + prompt de sistema + mensagens + parâmetros → texto + uso de tokens.
- Prompt de sistema concentra papel, formato e limites; a mensagem traz o conteúdo variável.
- Peça JSON, use saída estruturada quando houver, e valide sempre no código.
- Streaming melhora a percepção em chats; para programas, resposta completa e validada.
- Custo: modelo certo, entrada enxuta, saída limitada; cache de prompt e cache próprio de resultados.
