Nesta lição você vai usar um modelo de linguagem para classificar e-mails e documentos em categorias, com exemplos no prompt (*few-shot*), um grau de confiança e regras de roteamento que mandam o que é urgente ou duvidoso para uma pessoa. Vai aprender também a medir se a classificação está acertando, com acurácia e matriz de confusão. Isso importa porque triagem é a tarefa de IA com melhor retorno num escritório: barata, frequente e fácil de conferir.

## Classificar é escolher uma etiqueta

Classificação é dar a cada item **uma categoria de uma lista fechada**. E-mail: `guia`, `documento_enviado`, `duvida_fiscal`, `cobranca`, `spam`. Documento: `nota_fiscal`, `extrato`, `contrato`, `holerite`, `outro`. O segredo está na lista: categorias **poucas** (5 a 10), **excludentes** (um item cabe numa só) e **definidas por escrito** (o que é cada uma, com exemplos de fronteira). Se você não consegue explicar a um estagiário a diferença entre duas categorias, o modelo também não vai conseguir.

## O prompt de classificação

Uma instrução de sistema que define as categorias, o formato de saída e o que fazer na dúvida:

```python
INSTRUCAO = """Você classifica e-mails recebidos por um escritório contábil.
Categorias:
- guia: o cliente pede uma guia, boleto ou segunda via de imposto.
- documento_enviado: o cliente manda notas, extratos ou comprovantes (geralmente com anexo).
- duvida_fiscal: pergunta sobre tributação, enquadramento, obrigação acessória.
- cobranca: assunto financeiro entre escritório e cliente (honorários, boleto do escritório).
- outro: nenhuma das anteriores, inclusive propaganda e spam.
Responda apenas com JSON: {"categoria": "...", "confianca": 0.0 a 1.0, "motivo": "uma frase"}.
Use confianca abaixo de 0.6 quando o e-mail for ambíguo ou tiver mais de um assunto."""

EXEMPLOS = [
    ("Preciso do DAS de março, pode mandar?", {"categoria": "guia", "confianca": 0.95, "motivo": "pede guia"}),
    ("Segue extrato do Banco X em anexo.", {"categoria": "documento_enviado", "confianca": 0.9, "motivo": "envia extrato"}),
    ("Posso emitir nota de serviço para fora do estado sem ISS?", {"categoria": "duvida_fiscal", "confianca": 0.9, "motivo": "pergunta tributária"}),
]
```

Os `EXEMPLOS` entram na conversa como pares de mensagem `user` (o e-mail) e `assistant` (a resposta esperada) antes do e-mail real. Isso é **few-shot**: mostrar alguns casos resolvidos. Três a cinco exemplos bem escolhidos, incluindo um caso de fronteira, melhoram mais a acurácia do que parágrafos de instrução. Mantenha a temperatura baixa e `max_tokens` pequeno (a resposta tem 30 tokens).

## Confiança e roteamento

O campo `confianca` não é uma probabilidade calibrada; é a autoavaliação do modelo. Ainda assim é útil como **sinal para rotear**: alta confiança segue o fluxo automático; baixa vai para uma pessoa. Some a isso regras fixas que não dependem do modelo:

```python
def rotear(classificacao, texto_email):
    cat = classificacao["categoria"]
    conf = classificacao["confianca"]
    urgente = any(p in texto_email.lower() for p in ("urgente", "hoje", "vence", "multa", "intimação"))
    if urgente:
        return "humano_urgente"
    if conf < 0.6:
        return "humano_revisar"
    return {"guia": "robo_guias", "documento_enviado": "robo_arquivar",
            "duvida_fiscal": "fila_contador", "cobranca": "fila_financeiro", "outro": "arquivar"}[cat]

print(rotear({"categoria": "guia", "confianca": 0.95}, "Preciso do DAS de março"))
print(rotear({"categoria": "guia", "confianca": 0.95}, "URGENTE: vence hoje!"))
print(rotear({"categoria": "outro", "confianca": 0.4}, "Oi, tudo bem?"))
```

Saída:

```
robo_guias
humano_urgente
humano_revisar
```

A regra de urgência vem **antes** do modelo e usa palavras-chave simples: é barata, previsível e ninguém vai perguntar "por que a IA não viu que era urgente?". O modelo cuida da parte nebulosa; as regras cuidam do que não pode falhar.

## Medir o acerto

Você não sabe se a classificação funciona até medir. O método: separe um conjunto de e-mails reais (50 a 200), **rotule à mão** a categoria correta de cada um, rode o classificador e compare. Duas medidas bastam para começar:

- **Acurácia**: acertos divididos pelo total. Simples, mas esconde onde erra.
- **Matriz de confusão**: uma tabela com a categoria real nas linhas e a prevista nas colunas. A diagonal são acertos; fora dela, você vê que `cobranca` está sendo confundida com `guia`, por exemplo, e ajusta a definição ou os exemplos.

```python
def acuracia(reais, previstos):
    acertos = sum(1 for r, p in zip(reais, previstos) if r == p)
    return acertos / len(reais)

def matriz_confusao(reais, previstos, classes):
    matriz = {r: {p: 0 for p in classes} for r in classes}
    for r, p in zip(reais, previstos):
        matriz[r][p] += 1
    return matriz

reais = ["guia", "guia", "cobranca", "outro", "guia", "cobranca"]
prev  = ["guia", "guia", "guia",     "outro", "guia", "cobranca"]
classes = ["guia", "cobranca", "outro"]
print(round(acuracia(reais, prev), 3))
m = matriz_confusao(reais, prev, classes)
for r in classes:
    print(f"{r:10}", [m[r][p] for p in classes])
```

Saída:

```
0.833
guia       [3, 0, 0]
cobranca   [1, 1, 0]
outro      [0, 0, 1]
```

A linha `cobranca` diz: de 2 cobranças reais, 1 foi prevista como `guia`. Para categorias em que errar custa caro (urgente, cobrança), olhe também o **recall** daquela classe (quantos dos reais foram pegos) e a **precisão** (quantos dos previstos estavam certos). A fórmula do recall de uma classe é a diagonal dividida pela soma da linha; a da precisão, a diagonal dividida pela soma da coluna.

Repita a medição sempre que mudar o prompt, os exemplos ou o modelo. Guarde o conjunto rotulado como patrimônio do escritório: é ele que diz se uma "melhoria" melhorou.

## Erros comuns

- Categorias vagas ou sobrepostas ("documento" e "comprovante"): o modelo oscila, e a culpa é da lista.
- Confiar na `confianca` como se fosse estatística: use como sinal, calibre o limiar olhando os erros.
- Medir só acurácia num conjunto em que 90% é `outro`: 90% de acerto classificando tudo como `outro`.
- Rotular o conjunto de teste depois de ver a resposta do modelo: o rótulo vem antes, às cegas.

## Na prática

O escritório recebe 300 e-mails por dia. O robô lê a caixa (módulo 3), classifica cada um, roteia: guias vão para o robô de guias, documentos para o organizador de pastas, dúvidas para a fila do contador, urgentes para o celular do responsável. O conjunto de 100 e-mails rotulados mostrou 91% de acurácia; os 9% de erro eram quase todos e-mails com dois assuntos, que agora caem em `humano_revisar` pela regra de confiança.

## Resumo

- Classificar é escolher uma etiqueta de uma lista fechada, curta, excludente e definida por escrito.
- Prompt com definições, formato JSON e 3 a 5 exemplos resolvidos (few-shot); temperatura baixa.
- `confianca` baixa e palavras de urgência roteiam para pessoas; regras fixas vêm antes do modelo.
- Meça com conjunto rotulado à mão: acurácia e matriz de confusão; olhe recall das classes caras.
- Repita a medição a cada mudança e guarde o conjunto de teste.
