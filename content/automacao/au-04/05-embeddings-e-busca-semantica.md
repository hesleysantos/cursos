Nesta lição você vai entender o que são *embeddings* (vetores que representam o significado de um texto), como medir a semelhança entre dois textos pela similaridade de cosseno, o que é uma base vetorial e como tudo isso permite buscar "o e-mail sobre o atraso do cliente X" sem que a palavra "atraso" apareça nele. Vai aprender também quando essa busca vale a pena e quando a busca por palavra continua melhor. Isso importa porque é a base do RAG da próxima lição e porque "achar aquele e-mail" consome mais tempo do escritório do que parece.

## O problema da busca por palavra

A busca do Outlook ou do Windows procura **as palavras que você digitou**. Se o cliente escreveu "não vamos conseguir pagar dentro do prazo" e você busca "atraso", nada aparece. Sinônimos, erros de digitação, formas diferentes de dizer a mesma coisa: a busca por palavra não entende nada disso. Ela é ótima para o que é exato (número de nota, CNPJ, nome de arquivo) e ruim para o que é **significado**.

## O que é um embedding

Um **embedding** é uma lista de números (um vetor) que um modelo produz a partir de um texto, de modo que **textos com significado parecido ganham vetores parecidos**. "Atraso no pagamento" e "não vamos conseguir pagar no prazo" ficam próximos; "atraso no pagamento" e "receita de bolo" ficam longe. O vetor tem centenas ou milhares de posições, mas o conceito cabe num exemplo de três:

```python
# vetores fictícios de 3 posições só para ilustrar a ideia
textos = {
    "atraso no pagamento do boleto":   [0.9, 0.1, 0.0],
    "não conseguiremos pagar no prazo": [0.8, 0.2, 0.1],
    "receita de bolo de cenoura":       [0.0, 0.1, 0.9],
}
```

Os provedores de IA oferecem **modelos de embedding** pela API (a OpenAI e o Google têm os seus; a Anthropic indica parceiros, como a Voyage AI); também há modelos abertos que rodam localmente (via `sentence-transformers`). Você manda o texto e recebe o vetor. Custa uma fração do custo de uma chamada de chat, porque não há geração de texto.

## Similaridade de cosseno

Para comparar dois vetores, a medida padrão é a **similaridade de cosseno**: o cosseno do ângulo entre eles. Vai de -1 a 1; quanto mais perto de 1, mais parecidos. Ela ignora o "tamanho" do vetor e olha só a direção, o que a torna independente do comprimento do texto.

```python
import math

def cosseno(a, b):
    produto = sum(x * y for x, y in zip(a, b))
    norma_a = math.sqrt(sum(x * x for x in a))
    norma_b = math.sqrt(sum(y * y for y in b))
    if norma_a == 0 or norma_b == 0:
        return 0.0
    return produto / (norma_a * norma_b)

a = [0.9, 0.1, 0.0]
b = [0.8, 0.2, 0.1]
c = [0.0, 0.1, 0.9]
print(round(cosseno(a, b), 3))   # 0.984  (parecidos)
print(round(cosseno(a, c), 3))   # 0.012  (diferentes)
```

A fórmula: produto escalar dividido pelo produto das normas. Com vetores de verdade (1.536 posições, por exemplo), a conta é a mesma; na prática usa-se `numpy` pela velocidade.

## Busca semântica: do texto ao resultado

O fluxo de uma busca semântica é:

1. **Indexar**: para cada e-mail/documento, gerar o embedding uma vez e guardar junto com o texto e metadados (cliente, data, assunto).
2. **Consultar**: gerar o embedding da pergunta ("atraso do cliente Padaria Central").
3. **Comparar**: calcular a similaridade da pergunta com cada item e devolver os mais parecidos.

O bloco abaixo continua os anteriores: usa o dicionário `textos` e a função `cosseno` definidos acima, no mesmo arquivo.

```python
def mais_parecidos(consulta, base, k=2):
    """base: lista de (texto, vetor). Devolve os k textos mais parecidos com o vetor da consulta."""
    pontuados = [(cosseno(consulta, vetor), texto) for texto, vetor in base]
    pontuados.sort(reverse=True)
    return pontuados[:k]

base = list(textos.items())
pergunta = [0.8, 0.25, 0.1]       # embedding fictício de "cliente atrasou o pagamento"
for pontuacao, texto in mais_parecidos(pergunta, base):
    print(round(pontuacao, 3), texto)
```

Saída:

```
0.998 não conseguiremos pagar no prazo
0.975 atraso no pagamento do boleto
```

Nenhuma palavra da pergunta precisou aparecer no texto encontrado. É isso que a busca por palavra não faz.

## Bases vetoriais

Com cem e-mails, uma lista em memória e um laço resolvem. Com cem mil, você precisa de uma **base vetorial**: um banco de dados feito para guardar vetores e encontrar os mais próximos rapidamente. Opções comuns: **Chroma** (simples, local, bom para começar), **pgvector** (extensão do PostgreSQL, ideal se você já tem Postgres), **Qdrant**, **Pinecone** e outras. Todas fazem a mesma coisa: `adicionar(id, vetor, metadados)` e `buscar(vetor, k)`, geralmente com filtro por metadados ("só do cliente X", "só de 2026"). O n8n tem nós prontos para várias delas.

## Quando usar e quando não usar

Use busca semântica quando a pergunta é por **assunto ou sentido**: "e-mails em que o cliente reclamou de prazo", "contratos que falam de rescisão sem multa", "qual norma interna trata de atestado". Use busca por palavra (ou filtro de banco) quando o alvo é **exato**: número de nota, CNPJ, valor, nome de arquivo, data. Na prática, os melhores sistemas combinam as duas (**busca híbrida**): filtro por cliente e período, depois ordenação semântica. E sempre mostre o resultado para uma pessoa decidir: a busca encontra candidatos, não verdades.

Limites a conhecer: embeddings de modelos diferentes não se comparam entre si (mudou o modelo, reindexe tudo); textos muito longos precisam ser divididos antes (próxima lição); nomes próprios raros e códigos são mal representados; e o texto enviado para gerar o embedding sai do seu computador, com as mesmas regras de privacidade da lição 8.

## Erros comuns

- Comparar vetores de modelos diferentes e achar que a busca "ficou ruim".
- Buscar CNPJ ou número de nota semanticamente: use igualdade ou busca por palavra.
- Indexar o e-mail inteiro com assinatura, aviso legal e histórico de respostas: o ruído domina o vetor. Limpe antes.
- Devolver só o primeiro resultado como "a resposta": devolva os 3 a 5 melhores com a pontuação.

## Na prática

O escritório indexou dois anos de e-mails (assunto + corpo limpo, com cliente e data como metadados). A pergunta "o que ficou combinado com a Padaria sobre o parcelamento?" devolve três e-mails em segundos, inclusive um em que a palavra usada era "dividir em vezes". Com busca por palavra, levaria dez minutos de tentativas.

## Resumo

- Embedding é um vetor que representa o significado; textos parecidos têm vetores próximos.
- Similaridade de cosseno (produto escalar sobre produto das normas) mede essa proximidade de -1 a 1.
- Busca semântica: indexar vetores uma vez, vetorizar a pergunta, devolver os k mais próximos.
- Bases vetoriais (Chroma, pgvector, Qdrant, Pinecone) escalam isso e filtram por metadados.
- Semântica para sentido, palavra para dados exatos; combine as duas e reindexe se trocar o modelo.
