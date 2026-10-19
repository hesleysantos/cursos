Nesta lição você vai aprender a **ler** as mensagens de erro do Python em vez de ter medo delas. Vamos entender o que é um traceback, conhecer os quatro erros mais comuns de quem começa (`SyntaxError`, `NameError`, `TypeError`, `IndentationError`), ver como localizar a linha do problema e como pesquisar um erro na internet de forma eficiente. Errar faz parte de programar; saber ler o erro é o que separa quem trava de quem resolve.

## Erro não é fracasso, é informação

Quando um programa quebra, o Python não diz apenas "deu erro". Ele conta **qual** erro, **em que linha** e **por quê**. É como uma crítica de malha fiscal: a mensagem parece assustadora, mas aponta exatamente o campo a corrigir. A maior parte das pessoas que desiste de programar desiste porque nunca aprendeu a ler essa mensagem — então vamos aprender agora.

Existem dois momentos em que um erro pode acontecer:

1. **Antes de rodar** — o Python lê o arquivo inteiro e, se encontrar algo que não é Python válido, nem começa a executar. São os erros de sintaxe (`SyntaxError`, `IndentationError`).
2. **Durante a execução** — o código é válido, mas em certa linha algo impossível acontece: uma variável que não existe, uma conta entre texto e número, uma conversão inválida. São as **exceções** (`NameError`, `TypeError`, `ValueError`, `ZeroDivisionError`...).

## Anatomia de um traceback

Salve este arquivo como `folha.py` e rode:

```python
salario = 3500
desconto = "280"
liquido = salario - desconto
print(liquido)
```

Saída:

```
Traceback (most recent call last):
  File "C:\python-curso\folha.py", line 3, in <module>
    liquido = salario - desconto
              ~~~~~~~~^~~~~~~~~~
TypeError: unsupported operand type(s) for -: 'int' and 'str'
```

Leia **de baixo para cima**:

- **Última linha** — o tipo do erro e a mensagem: `TypeError: unsupported operand type(s) for -: 'int' and 'str'`. Tradução: "operação `-` não suportada entre `int` e `str`". Você tentou subtrair um texto de um número.
- **Linha acima** — o trecho de código culpado, com setinhas `~~~^~~~` apontando a operação exata (Python 3.11 e superiores).
- **`File "...", line 3`** — o arquivo e o número da linha. Abra o arquivo, vá para a linha 3 e olhe.
- **`Traceback (most recent call last)`** — só o cabeçalho; significa "rastro das chamadas, a mais recente por último".

Quando o programa tem funções chamando funções, o traceback lista vários blocos `File ... line ...`. O **último** é onde o erro estourou; os anteriores mostram o caminho até lá.

## Os quatro erros mais comuns

### `SyntaxError` — o Python não entendeu a frase

Acontece quando falta ou sobra um símbolo: parêntese, aspas, dois-pontos, vírgula.

```python
print("Total: 1500"
total = 1500
```

```
  File "exemplo.py", line 1
    print("Total: 1500"
         ^
SyntaxError: '(' was never closed
```

Mensagens frequentes e seu significado:

| Mensagem | Causa provável |
|----------|----------------|
| `'(' was never closed` | parêntese aberto sem fechar |
| `unterminated string literal` | aspas abertas sem fechar |
| `expected ':'` | faltou `:` no fim do `if`, `else`, `def`, `for` |
| `invalid syntax` | genérico; olhe a linha indicada **e a anterior** |
| `cannot assign to expression` / `invalid syntax. Maybe you meant '=='` | usou `=` onde devia ser `==` |

> **Dica:** se a linha apontada parece perfeita, o erro geralmente está na **linha anterior** — um parêntese que ficou aberto, por exemplo, só é percebido quando o Python chega na linha seguinte.

### `NameError` — nome desconhecido

```python
valor_bruto = 2000
print(valor_brutto * 0.05)
```

```
NameError: name 'valor_brutto' is not defined. Did you mean: 'valor_bruto'?
```

Causas típicas:

- erro de digitação no nome (o próprio Python sugere a correção com "Did you mean");
- usar a variável antes da linha que a cria;
- esquecer aspas em um texto: `print(Maria)` em vez de `print("Maria")`;
- diferença de maiúsculas: criou `Total` e usou `total`.

### `TypeError` — tipos incompatíveis

Acontece quando a operação não faz sentido para os tipos envolvidos:

```python
quantidade = input("Qtd: ")   # devolve "12"
print(quantidade * 1.5)
```

```
TypeError: can't multiply sequence by non-int of type 'float'
```

Outros `TypeError` do dia a dia:

- `can only concatenate str (not "int") to str` — `"Total: " + 100`. Use f-string.
- `unsupported operand type(s) for +: 'int' and 'str'` — `100 + "50"`. Converta com `int()`.
- `'str' object is not callable` — você sobrescreveu uma função: `print = "x"` e depois `print(...)`.
- `function() takes 2 positional arguments but 3 were given` — chamou a função com argumentos a mais.

A pergunta-chave para resolver um `TypeError` é: **"qual o tipo de cada coisa nesta linha?"**. Um `print(type(x))` antes da linha problemática costuma revelar a resposta.

### `IndentationError` — recuo errado

```python
if saldo < 0:
print("Negativo")
```

```
  File "exemplo.py", line 2
    print("Negativo")
    ^^^^^
IndentationError: expected an indented block after 'if' statement on line 1
```

Variações:

- `expected an indented block` — faltou indentar depois de `if`, `else`, `def`, `for`.
- `unexpected indent` — há espaços a mais no começo de uma linha que não devia estar indentada.
- `unindent does not match any outer indentation level` — o recuo da linha não bate com nenhum nível anterior (comum ao misturar 2 e 4 espaços).
- `TabError: inconsistent use of tabs and spaces` — tab e espaço misturados. No VS Code, configure para converter tabs em 4 espaços.

## Outros erros que você já encontrou (ou vai encontrar)

```python
int("abc")          # ValueError: invalid literal for int() with base 10: 'abc'
100 / 0             # ZeroDivisionError: division by zero
"abc"[5]            # IndexError: string index out of range
"texto".upperr()    # AttributeError: 'str' object has no attribute 'upperr'. Did you mean: 'upper'?
```

`AttributeError` aparece quando você chama um método que não existe para aquele tipo — geralmente erro de digitação ou tentativa de usar um método de lista em uma string.

## Um método para resolver qualquer erro

1. **Leia a última linha** do traceback. Identifique o tipo do erro e traduza a mensagem.
2. **Vá até a linha indicada** (e olhe a anterior, se for `SyntaxError`).
3. **Pergunte "o que o Python esperava e o que ele encontrou?"**. Em `TypeError`, cheque tipos. Em `NameError`, cheque a grafia. Em `IndentationError`, cheque espaços.
4. **Faça uma alteração de cada vez** e rode de novo. Mudar cinco coisas ao mesmo tempo esconde o que resolveu.
5. **Use `print()` como lanterna**: imprima as variáveis envolvidas logo antes da linha problemática para ver seus valores e tipos reais.

```python
valor = "1.500,90"
print("DEBUG valor:", repr(valor), type(valor))   # repr mostra aspas e espaços invisíveis
numero = float(valor.replace(".", "").replace(",", "."))
```

Saída:

```
DEBUG valor: '1.500,90' <class 'str'>
```

`repr()` é útil para enxergar espaços e caracteres invisíveis que o `print` normal esconde.

## Como pesquisar um erro

Quando a mensagem não é óbvia, pesquisar é parte do trabalho — programadores experientes fazem isso todo dia. Algumas regras para encontrar resposta rápido:

- **Copie a última linha do traceback**, sem os valores específicos do seu programa. Em vez de `NameError: name 'valor_brutto' is not defined`, pesquise `python NameError name is not defined`.
- **Inclua a palavra `python`** e, se souber, a versão.
- **Tire caminhos e nomes pessoais**: `C:\Users\Joao\...` não ajuda ninguém.
- **Para erros de biblioteca**, inclua o nome dela: `python openpyxl KeyError worksheet`.
- Os resultados mais confiáveis costumam vir do **Stack Overflow** (em inglês há muito mais respostas, mas o site em português também existe), da **documentação oficial** (`docs.python.org`) e de blogs técnicos.
- Ao usar um assistente de IA, cole o traceback **inteiro** e o trecho de código em volta da linha. Quanto mais contexto, melhor a resposta.

Uma dica final: antes de pesquisar, **tente explicar o erro em voz alta** para si mesmo ou para um colega (o famoso "método do patinho de borracha"). Muitas vezes a solução aparece no meio da explicação.

## Na prática

O cenário típico: um script que processava a planilha de um cliente para na linha 148 com `ValueError`. Em vez de abrir a planilha inteira, você lê a última linha do traceback (`invalid literal for float(): '1.250,90'`), vai à linha indicada do código e descobre que aquele cliente exporta valores com vírgula. Dois minutos de leitura, um `replace()`, resolvido. Quem não lê o traceback passa a tarde procurando.

## Erros comuns (ao lidar com erros)

- **Ler só a primeira linha do traceback** — a informação útil está no fim.
- **Ignorar o número da linha** e procurar o erro "a olho" pelo arquivo inteiro.
- **Mudar código ao acaso** até parar de reclamar, sem entender a causa. Costuma gerar outro erro logo adiante.
- **Confundir aviso com erro** — alguns textos amarelos no VS Code são sugestões de estilo, não erros.
- **Culpar o Python** — em 99% dos casos a mensagem está certa. Releia com calma.

## Resumo

- Traceback se lê de baixo para cima: a última linha diz o tipo e a mensagem; `line N` diz onde olhar.
- `SyntaxError`/`IndentationError` acontecem antes de rodar (símbolo faltando, recuo errado); `NameError`/`TypeError`/`ValueError` acontecem durante a execução.
- `NameError`: nome digitado errado ou usado antes de existir. `TypeError`: operação entre tipos incompatíveis. `IndentationError`: recuo inconsistente — use sempre 4 espaços.
- Método: leia a última linha, vá à linha indicada, cheque tipos/grafia/recuo, mude uma coisa por vez, use `print()` e `repr()` como lanterna.
- Para pesquisar, copie a mensagem genérica (sem seus nomes e caminhos), inclua "python" e prefira Stack Overflow e a documentação oficial.
