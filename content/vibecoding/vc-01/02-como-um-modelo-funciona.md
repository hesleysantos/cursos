Nesta lição você vai entender, sem nenhuma matemática, como um modelo de linguagem funciona por dentro: o que são tokens, o que significa "prever a próxima palavra", como o modelo é treinado em três fases, o que são parâmetros e temperatura. Ao final, você vai saber explicar por que ele "sabe" tanta coisa e por que, mesmo assim, erra — e isso vai mudar a forma como você escreve seus pedidos.

## A ideia central: prever a próxima palavra

Um modelo de linguagem faz, no fundo, uma única coisa: dado um texto, ele calcula **qual é a continuação mais provável**. Se você escreve "O prazo de entrega da declaração de", ele estima que "imposto" ou "renda" são continuações bem prováveis, "banana" é improvável, e escolhe uma. Depois pega o texto já com a palavra nova e repete o processo. Uma palavra por vez (na verdade, um pedaço de palavra, o *token*, que você verá a seguir), milhares de vezes, até montar a resposta inteira.

Parece simples demais para gerar um parecer de três páginas, e é aí que mora a surpresa: para prever bem a próxima palavra em qualquer texto, o modelo precisou aprender gramática, estilo, fatos, relações entre conceitos e até o jeito de raciocinar que aparece nos textos. Tudo isso fica guardado, comprimido, dentro dele.

> **Dica:** pense no autocompletar do celular, só que treinado com uma biblioteca inteira e capaz de olhar para todo o seu texto, não só para a última palavra.

## Tokens: a unidade que o modelo lê

O modelo não lê letras nem palavras exatamente; ele lê **tokens**, pedaços de texto. Uma palavra comum em inglês costuma ser um token; em português, palavras longas são quebradas em dois ou três ("contabilidade" pode virar "contab" + "ilidade"). Números, pontuação e espaços também viram tokens.

Isso importa por três motivos práticos:

1. **Limites são medidos em tokens**, não em páginas. Como regra grosseira, 1.000 tokens dão cerca de 750 palavras em inglês e algo entre 500 e 700 palavras em português — a proporção varia conforme o modelo e o texto.
2. **Texto em português gasta mais tokens** que o mesmo conteúdo em inglês, porque as palavras são quebradas em mais pedaços.
3. **Contar letras é difícil para o modelo**, porque ele nunca vê as letras isoladas. Por isso erra ao contar quantos "s" tem numa palavra. Não é burrice; é a forma como ele enxerga.

## Como o modelo é treinado: três fases

**Fase 1 — Pré-treinamento.** O modelo lê uma quantidade gigantesca de texto (sites, livros, artigos, código) e, para cada trecho, tenta adivinhar a palavra seguinte. Quando erra, seus "ajustes internos" são corrigidos um pouquinho. Repetido para trilhões de pedaços de texto, isso produz um modelo que escreve de forma fluente sobre quase tudo. Mas ele ainda não é um assistente: é só um completador de texto muito bom.

**Fase 2 — Ajuste fino (fine-tuning) com exemplos.** Agora pessoas escrevem milhares de pares "pergunta → resposta ideal", e o modelo é treinado com eles. Ele aprende o formato de assistente: responder ao que foi pedido, ser organizado, recusar coisas inadequadas.

**Fase 3 — Aprendizado com feedback humano (RLHF, sigla em inglês de *reinforcement learning from human feedback*).** O modelo gera duas respostas para o mesmo pedido; avaliadores humanos dizem qual é melhor. Com um volume enorme dessas comparações, o modelo aprende a preferir respostas que as pessoas consideram úteis, claras e seguras. Hoje parte desse feedback também vem de outros modelos de IA, que avaliam as respostas seguindo regras escritas por pessoas. Esse é o passo que deixa o ChatGPT ou o Claude com "jeito" de assistente educado.

Uma consequência importante dessa terceira fase: o modelo foi treinado para **agradar**. Ele tende a concordar com você, a elogiar sua ideia e a responder mesmo quando deveria dizer "não sei". Lembre-se disso quando ele confirmar algo com entusiasmo.

## Parâmetros: o "tamanho do cérebro"

Os **parâmetros** são os bilhões de números internos ajustados durante o treinamento. É neles que o conhecimento fica guardado. Modelos maiores (mais parâmetros) tendem a ser mais capazes, mas são mais lentos e caros de rodar; modelos pequenos cabem num notebook e rodam offline. Quando um fornecedor fala em modelo "mini", "flash" ou "haiku", é um modelo menor e mais rápido, adequado a tarefas simples e repetitivas.

## Temperatura: o botão da criatividade

A cada palavra, o modelo tem uma lista de candidatas com probabilidades. A **temperatura** controla se ele escolhe quase sempre a mais provável (temperatura baixa: respostas previsíveis, consistentes) ou se dá chance às menos prováveis (temperatura alta: respostas mais variadas e criativas, mas também mais sujeitas a inventar). Nos aplicativos de chat esse ajuste costuma ficar escondido; nas APIs e em ferramentas de automação você pode definir. Para extração de dados e tarefas contábeis, prefira temperatura baixa. Para brainstorm, pode subir.

É também por causa dessa aleatoriedade controlada que a mesma pergunta pode gerar respostas diferentes em dois dias.

## Por que ele "sabe" coisas — e por que erra

Ele "sabe" porque os fatos apareceram muitas vezes no texto de treinamento. "O Simples Nacional é um regime tributário" apareceu em milhares de páginas, então a associação ficou forte. Mas o modelo não guarda uma tabela de fatos; guarda **padrões**. Quando o padrão é forte, acerta. Quando é fraco — um número específico, uma lei municipal, um detalhe raro — ele preenche com o que **soa certo**. O resultado é texto fluente, confiante e, às vezes, falso. Esse fenômeno tem nome, **alucinação**, e é o tema da próxima lição.

Compare os dois pedidos:

```text
Prompt A:
Qual é o limite de faturamento do Simples Nacional?

Prompt B:
Qual é o limite de faturamento anual do Simples Nacional segundo a
Lei Complementar 123/2006? Se não tiver certeza do valor em vigor,
diga isso explicitamente e indique onde confirmar.

Resposta esperada (resumo):
O prompt A tende a vir com um número e nenhuma ressalva. O prompt B
tende a citar o limite, informar que valores podem ter sido atualizados
após a data de corte e apontar a fonte oficial para conferência.
```

O modelo é o mesmo; o que mudou foi você dar a ele permissão para expressar incerteza.

## Erros comuns de interpretação

- **"Ele pesquisou no Google para me responder."** Não, a menos que a ferramenta tenha busca ativada. Por padrão, a resposta vem dos padrões aprendidos.
- **"Ele está aprendendo com a minha conversa."** Dentro da conversa, ele usa o que foi dito como contexto; os parâmetros não mudam. Numa conversa nova, ele não lembrará, salvo se a ferramenta tiver recurso de memória.
- **"Se ele escreveu com confiança, está certo."** Confiança no texto é estilo, não evidência.

## Na prática

Quando você entende que o modelo é um previsor de texto treinado para agradar, muda o jeito de pedir: passa a dar contexto (ele só vê o que está na conversa), a pedir que ele expresse incerteza (ele não faz isso sozinho) e a exigir fonte para qualquer número. Também passa a usar as ferramentas certas: cálculo com planilha ou código, informação atual com busca ligada, tarefas simples com modelos menores.

## Resumo

- O modelo prevê a próxima palavra, uma por vez, com base em padrões aprendidos de um volume enorme de texto.
- Ele lê tokens (pedaços de palavras); limites, custos e dificuldades com contagem de letras vêm daí.
- Treinamento em três fases: pré-treino (fluência), ajuste fino (formato de assistente) e RLHF (preferências humanas — inclusive a tendência de agradar).
- Parâmetros guardam o conhecimento; temperatura controla a variação das respostas.
- Ele acerta quando o padrão é forte e inventa quando é fraco; por isso, peça incerteza e fontes.
