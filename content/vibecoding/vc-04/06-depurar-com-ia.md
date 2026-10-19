Nesta lição você vai aprender a **depurar** com a ajuda da IA: ler mensagens de erro, colar o erro certo (e só ele), isolar o problema, pedir explicação antes da correção, impedir que a IA adivinhe e saber a hora de reverter. Isso importa porque, em vibe coding, metade do tempo é gasto corrigindo o que quebrou; quem depura com método resolve em minutos o que leva horas na tentativa e erro.

## Depurar é investigar, não chutar

**Depurar** (do inglês *debug*) é encontrar a causa de um comportamento errado e corrigi-la. A palavra-chave é causa. Um sintoma ("a página fica em branco") pode ter dez causas; corrigir no chute troca um erro por outro. A IA é uma ótima parceira de investigação, desde que você a alimente com evidência, não com impressões.

A analogia contábil: uma diferença de R$ 37,50 na conciliação não se resolve lançando um ajuste de R$ 37,50; resolve-se achando o lançamento errado. Depurar é conciliar.

## Onde o erro aparece

- **No navegador:** F12 abre as ferramentas do desenvolvedor. A aba **Console** mostra erros de JavaScript em vermelho; a aba **Rede** (Network) mostra cada requisição HTTP e seu código de status. Uma página em branco quase sempre tem um erro no console.
- **No terminal:** se você rodou um script ou servidor, o erro aparece ali; em Python, a última linha é o tipo e a descrição; as linhas acima mostram o caminho até o erro (o *traceback*).
- **Na própria ferramenta de IA:** construtores por prompt mostram o erro em um painel e costumam oferecer "corrigir" automaticamente. Use, mas leia o que foi feito.

## Colar o erro certo

A IA só pode ajudar com o que vê. Regras para o que colar:

1. **A mensagem completa**, da primeira à última linha, sem resumir. Um "deu erro" não serve; "TypeError: Cannot read properties of null (reading 'value') em app.js:42" resolve.
2. **O que você fez** para o erro aparecer: "cliquei em Calcular com o campo faturamento vazio".
3. **O que esperava** que acontecesse.
4. **O trecho de código relevante**, se a ferramenta não tiver acesso aos arquivos. A linha indicada no erro e algumas ao redor.
5. **O que já tentou**, para a IA não repetir.

Um prompt de depuração bem formado:

```text
Ao clicar em "Calcular" com o campo faturamento vazio, a página mostra este erro no console:
TypeError: Cannot read properties of null (reading 'value') at calcular (app.js:42)
Eu esperava uma mensagem "informe o faturamento". Já conferi que o campo existe no HTML com
id "faturamento". Antes de corrigir, explique a causa provável em duas frases e diga que
linha do app.js você quer ver.
```

## Isolar o problema

Quando o erro não é claro, reduza o cenário até ele aparecer sozinho:

- **Mude uma coisa de cada vez.** Se três ajustes foram feitos e algo quebrou, desfaça dois e teste.
- **Simplifique a entrada.** Funciona com um cliente e não com dez? Funciona sem acento e não com acento? Essa diferença é a pista.
- **Confirme o óbvio.** O arquivo foi salvo? O navegador foi recarregado? Está abrindo a versão certa?
- **Procure a primeira ocorrência.** O console pode mostrar cinco erros; os quatro últimos costumam ser consequência do primeiro.

Peça à IA um plano de isolamento em vez de uma correção:

```text
O formulário envia, mas a linha não aparece na planilha. Não há erro no console. Liste, em
ordem do mais provável, o que pode estar errado entre o navegador, o webhook e a planilha,
e diga como testar cada hipótese isoladamente (por exemplo, enviando um JSON de teste
direto ao webhook).
```

## Explicação antes da correção

Um hábito que separa quem aprende de quem depende: **peça a explicação primeiro**. "Explique a causa e só depois proponha a correção" faz duas coisas. Primeiro, obriga a IA a raciocinar sobre o problema, em vez de trocar linhas até parar de dar erro. Segundo, ensina você: na terceira vez que vir "null (reading 'value')", vai saber que algum elemento não foi encontrado na página e nem precisará perguntar.

Quando a IA propuser a correção, pergunte: "isso corrige a causa ou só esconde o sintoma?". Um `try/except` (em JavaScript, `try/catch`) em volta de tudo faz o erro sumir e o bug continuar.

## "Não adivinhe — pergunte"

A IA tem uma tendência a preencher lacunas com suposições e seguir em frente. Em depuração, isso é perigoso: ela "corrige" um problema imaginado e introduz outro. A instrução que você aprendeu em engenharia de prompt vale aqui como regra:

> Se faltar informação para ter certeza da causa, não adivinhe: me diga o que precisa ver (arquivo, linha, saída de um comando) e eu envio.

Coloque isso no começo de toda sessão de depuração. Ferramentas que leem os arquivos sozinhas (editores com IA, agentes) vão buscar o que precisam; construtores por prompt dependem de você fornecer.

## Quando reverter

Às vezes a correção vira uma bola de neve: cada ajuste quebra outra coisa. O sinal é claro: três iterações sem progresso. Nesse momento, **reverta** para a última versão que funcionava e recomece a partir dela com um pedido menor. A lição 7 ensina a fazer isso com Git em um clique no GitHub Desktop; construtores por prompt têm histórico de versões com um botão de restaurar.

Reverter não é derrota. É a forma mais barata de sair de um buraco. E é por isso que versionar antes de cada mudança importante é obrigatório: sem versão salva, não há para onde voltar.

## Exercício mental: três erros

| Mensagem | Tipo | Causa provável |
|---|---|---|
| `SyntaxError: Unexpected token '}'` em app.js:17 | Sintaxe | Falta ou sobra uma chave; o código não é nem lido |
| `404 Not Found` ao carregar `estilos.css` | HTTP | O arquivo não existe no caminho indicado ou o nome está diferente |
| `KeyError: 'valor'` em converter.py linha 9 | Dados | O JSON lido não tem a chave `valor`; o campo veio com outro nome ou vazio |

Em todos, leia tipo, descrição e lugar; copie inteiro; peça explicação; corrija a causa.

## Erros comuns

- **Resumir o erro.** "Deu um erro de null" perde o lugar e a descrição.
- **Aceitar correção sem entender.** Hoje funciona; amanhã quebra e você não sabe por quê.
- **Mudar várias coisas e testar uma vez.** Não dá para saber o que resolveu.
- **Insistir depois de três tentativas.** Reverta.

## Na prática

Um contador passou uma hora pedindo "corrija" a um construtor por prompt para um formulário que não enviava. Trocou a abordagem: abriu o console, colou a mensagem completa, pediu explicação e recebeu em uma resposta a causa (o endereço do webhook tinha um espaço no final). Dez minutos. A diferença não foi a ferramenta; foi o método.

## Resumo

- Depurar é achar a causa, não silenciar o sintoma.
- Erros aparecem no console do navegador (F12), no terminal ou no painel da ferramenta; leia tipo, descrição e lugar.
- Cole a mensagem completa, o que fez, o que esperava e o que já tentou.
- Isole mudando uma coisa de cada vez; peça explicação antes da correção; proíba adivinhação.
- Três iterações sem progresso: reverta para a última versão que funcionava.
