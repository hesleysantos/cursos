Nesta lição você vai entender como um programa conversa com um modelo de linguagem (LLM) pela API: o formato de mensagens, o papel do *system prompt*, os parâmetros de temperatura e tamanho máximo, como se paga (por token), como se guarda a chave e o que são os limites de uso. Vai ver a mesma chamada em Python e num nó do n8n ou do Make. Isso importa porque, no módulo 3, seus robôs leem planilhas, PDFs e e-mails; neste módulo eles vão **interpretar** esse conteúdo, e tudo começa por uma chamada bem feita.

## O que é a API de um modelo

Quando você usa o ChatGPT, o Claude ou o Gemini pelo site, está usando uma interface por cima de uma API. A API é o mesmo modelo, acessível por programa: você manda uma lista de mensagens e recebe uma resposta em texto. Os três grandes provedores (OpenAI, Anthropic e Google) têm APIs parecidas na ideia e diferentes nos detalhes; cada um publica uma biblioteca Python oficial (`openai`, `anthropic`, `google-genai`) e uma documentação com os nomes dos modelos e os preços atuais. **Nomes de modelo e preços mudam a cada poucos meses**: nesta lição o texto diz "o modelo atual recomendado na documentação", e você confere lá na hora de escrever o código.

## A anatomia de uma chamada

Toda chamada tem os mesmos ingredientes:

- **model**: qual modelo usar (maior e mais caro, ou menor e mais rápido).
- **system** (instrução de sistema): quem o modelo é e como deve se comportar. "Você é um assistente de um escritório contábil. Responda em português, de forma objetiva, só com base no texto fornecido."
- **messages**: a conversa, uma lista de mensagens com `role` (`user` ou `assistant`) e `content`. Para uma tarefa isolada, basta uma mensagem `user`.
- **max_tokens**: limite de tamanho da resposta. Evita respostas infinitas e custos surpresa.
- **temperature**: de 0 a 1 (em alguns provedores até 2). Baixa, respostas mais previsíveis; alta, mais variadas. Para automação, use baixa. Alguns modelos mais novos (os chamados modelos de raciocínio) não aceitam esse parâmetro; se a API devolver erro ao enviá-lo, remova-o. Mesmo com temperatura mínima o modelo não é 100% determinístico: a mesma entrada pode gerar respostas ligeiramente diferentes.

A resposta traz o texto gerado, o motivo da parada (terminou, atingiu o limite) e a **contagem de tokens** de entrada e saída, que é o que você paga.

## Tokens e custo

O modelo não lê palavras, lê **tokens**: pedaços de texto de uns 3 a 4 caracteres. Em português, mil tokens dão algo entre 500 e 700 palavras, conforme o texto e o modelo. Cada provedor cobra um preço por milhão de tokens de entrada (o que você manda) e outro, maior, por milhão de tokens de saída (o que ele gera). Uma classificação de e-mail com 500 tokens de entrada e 50 de saída custa frações de centavo; mil e-mails por mês custam alguns reais. O que pesa é mandar documentos inteiros sem necessidade ou pedir respostas longas quando bastava uma palavra.

```python
def estimar_custo(tokens_entrada, tokens_saida, preco_entrada_milhao, preco_saida_milhao):
    """Custo em dólares de uma chamada, dados os preços por milhão de tokens."""
    return (tokens_entrada * preco_entrada_milhao + tokens_saida * preco_saida_milhao) / 1_000_000

# preços fictícios só para o exemplo; use os da tabela do provedor
print(round(estimar_custo(500, 50, 3.0, 15.0), 6))      # 0.00225
print(round(estimar_custo(500, 50, 3.0, 15.0) * 1000, 2))  # 2.25 para mil e-mails
```

Toda resposta traz `usage` com os tokens reais; registre no log (lição 8 deste módulo) e some por dia.

## Chaves e limites

A chave de API identifica sua conta e autoriza a cobrança. Vai no `.env` (`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GOOGLE_API_KEY`); as bibliotecas oficiais leem a variável de ambiente sozinhas. Crie uma chave por robô, com limite de gasto mensal no painel do provedor, e revogue quando o robô for desativado. Os provedores também limitam **requisições por minuto** e **tokens por minuto** por conta; ao ultrapassar, respondem `429`, e a biblioteca oficial já tenta de novo com espera. Em lotes grandes, processe em série com pequena pausa, ou use o modo de lote (batch) que vários provedores oferecem com desconto para quem não tem pressa.

## A chamada em Python

Com a biblioteca da Anthropic (`pip install anthropic`), o padrão é:

```python
import anthropic

client = anthropic.Anthropic()          # lê ANTHROPIC_API_KEY do ambiente

resposta = client.messages.create(
    model="MODELO_ATUAL",              # copie o identificador da documentação
    max_tokens=300,
    system="Você é assistente de um escritório contábil. Responda em português, em uma frase.",
    messages=[{"role": "user", "content": "Resuma: o cliente pede a segunda via do DAS de março."}],
)
texto = "".join(bloco.text for bloco in resposta.content if bloco.type == "text")
print(texto)
print(resposta.usage.input_tokens, resposta.usage.output_tokens)
```

A resposta vem em **blocos** (`resposta.content`); o laço junta só os de texto. Com a biblioteca da OpenAI (`pip install openai`), a forma é `client = OpenAI()` e uma chamada de criação de resposta com `model`, a instrução de sistema e a entrada do usuário; com a do Google (`pip install google-genai`), `client = genai.Client()` e `client.models.generate_content(model=..., contents=...)`. Os nomes exatos dos métodos e dos campos mudaram mais de uma vez nos últimos anos; o padrão mental é o mesmo e a documentação de cada biblioteca mostra o exemplo mínimo atual. Copie de lá, não da memória (nem da memória da IA).

## A mesma chamada por HTTP e num nó do n8n/Make

Por baixo da biblioteca há um `POST` com JSON. Entender o corpo da requisição permite montar a chamada em qualquer ferramenta:

```python
import json

def montar_payload(modelo, instrucao, pergunta, max_tokens=300):
    return {
        "model": modelo,
        "max_tokens": max_tokens,
        "system": instrucao,
        "messages": [{"role": "user", "content": pergunta}],
    }

corpo = montar_payload("MODELO_ATUAL", "Responda em português.", "O que é DAS?")
print(json.dumps(corpo, ensure_ascii=False, indent=2))
```

No n8n há nós prontos (**OpenAI**, **Anthropic**, **Google Gemini** e o genérico **Basic LLM Chain**) onde você cola a chave numa credencial e preenche sistema e mensagem em campos. No Make, módulos equivalentes. Quando o nó pronto não expõe um parâmetro, use o nó **HTTP Request** com o mesmo JSON acima no corpo, o cabeçalho de autenticação que a documentação indica e `Content-Type: application/json`. A chave fica na credencial do n8n/Make, nunca escrita no fluxo.

## Erros comuns

- Colar a chave no código ou num fluxo exportado. Vai para o `.env` ou para a credencial da ferramenta.
- Esquecer `max_tokens` ou colocá-lo baixo demais: a resposta vem cortada e o JSON (próxima lição) fica inválido.
- Mandar o PDF inteiro de 40 páginas para perguntar o vencimento: extraia o trecho relevante antes (módulo 3) e mande só ele.
- Confiar na memória para nomes de modelo e parâmetros: confira a documentação na data em que escreve.

## Na prática

Um robô de atendimento recebe o e-mail do cliente (módulo 3, lição 5), monta a instrução de sistema com as regras do escritório, manda o texto do e-mail como mensagem do usuário com `max_tokens` curto e temperatura baixa, registra os tokens usados e guarda a resposta para o contador revisar. Mil e-mails por mês, custo de um café, horas economizadas.

## Resumo

- A API recebe `model`, `system`, `messages`, `max_tokens` e (às vezes) `temperature`; devolve texto, motivo de parada e uso de tokens.
- Paga-se por milhão de tokens, entrada mais barata que saída; registre `usage`.
- Chave no `.env` ou na credencial, uma por robô, com limite de gasto; `429` é limite de uso.
- Em Python, `client.messages.create(...)` (Anthropic) e equivalentes nas outras bibliotecas; copie o exemplo mínimo da documentação atual.
- No n8n/Make, nó pronto ou HTTP Request com o mesmo JSON.
