Nesta lição você vai aprender a receber dados digitados pelo usuário com `input()`, a converter texto em número com `int()` e `float()` (e número em texto com `str()`), e a entender o erro `ValueError` que aparece quando a conversão não é possível. Também vai ver por que, nos exercícios deste curso, usamos funções em vez de `input()`.

## `input()`: perguntando ao usuário

Até agora, todos os valores estavam fixos no código. Um programa de verdade precisa receber informação de fora. A função `input()` mostra uma mensagem, espera o usuário digitar algo e apertar Enter, e devolve o que foi digitado.

```python
nome = input("Qual o nome do cliente? ")
print(f"Olá, {nome}!")
```

Ao rodar, o terminal mostra `Qual o nome do cliente? ` e fica esperando. Se a pessoa digitar `Padaria Central`, a saída é:

```
Olá, Padaria Central!
```

O texto passado para `input()` é o **prompt**, a pergunta exibida. Deixe um espaço no final para o cursor não grudar na pergunta.

## O detalhe que pega todo mundo: `input()` sempre devolve texto

Não importa o que a pessoa digite, o resultado de `input()` é uma **string**:

```python
valor = input("Valor da nota: ")   # usuário digita 1500
print(type(valor))
print(valor + valor)
```

Saída:

```
<class 'str'>
15001500
```

Veja o problema: `"1500" + "1500"` é concatenação de texto, não soma. Se você tentar fazer conta misturando texto e número, o Python reclama:

```python
valor = input("Valor: ")     # digita 1500
print(valor * 1.05)
```

```
TypeError: can't multiply sequence by non-int of type 'float'
```

Por que o Python não converte sozinho? Porque ele não tem como adivinhar sua intenção. "0045" pode ser o número 45 ou o código "0045" de um plano de contas. Quem decide é você, explicitamente, com as funções de conversão.

## Convertendo com `int()`, `float()` e `str()`

| Função | Converte para | Exemplo | Resultado |
|--------|---------------|---------|-----------|
| `int(x)` | inteiro | `int("42")` | `42` |
| `float(x)` | decimal | `float("1500.50")` | `1500.5` |
| `str(x)` | texto | `str(3.14)` | `"3.14"` |

```python
quantidade = int(input("Quantidade: "))        # digita 12
preco = float(input("Preço unitário: "))       # digita 89.90
total = quantidade * preco
print(f"Total: {total:.2f}")
```

Saída (com os valores indicados):

```
Total: 1078.80
```

É comum embrulhar o `input()` diretamente dentro de `int()` ou `float()`, como acima. Leia de dentro para fora: primeiro `input()` lê o texto, depois `float()` converte.

### Conversões entre números

```python
print(int(9.99))      # corta a parte decimal
print(int(-9.99))     # corta em direção ao zero
print(float(7))       # vira 7.0
print(int(True))      # True vale 1
print(int(False))     # False vale 0
```

Saída:

```
9
-9
7.0
1
0
```

### `str()` para juntar texto e número

```python
nf = 4521
mensagem = "Nota " + str(nf) + " emitida"
print(mensagem)
```

Saída:

```
Nota 4521 emitida
```

Funciona, mas a f-string `f"Nota {nf} emitida"` é mais legível e faz a conversão por você. Use `str()` quando precisar guardar o número como texto, por exemplo para contar seus dígitos: `len(str(123456))` dá `6`.

## Quando a conversão falha: `ValueError`

O que acontece se a pessoa digita algo que não é um número?

```python
idade = int("vinte")
```

```
Traceback (most recent call last):
  File "exemplo.py", line 1, in <module>
    idade = int("vinte")
            ^^^^^^^^^^^^
ValueError: invalid literal for int() with base 10: 'vinte'
```

`ValueError` significa: "o tipo até está certo (é uma string), mas o **valor** não serve". A mensagem mostra exatamente o que tentou converter: `'vinte'`.

Outros casos que geram `ValueError`:

```python
int("1500.00")    # int não aceita ponto decimal -> use float primeiro
int("1.500")      # ponto de milhar também não
float("1.500,90") # vírgula não é decimal em Python
float("")         # string vazia
int(" 42 ")       # ESTE funciona: espaços nas bordas são ignorados
```

A solução para o formato brasileiro é limpar antes de converter, como vimos na lição de strings:

```python
texto = "1.500,90"
numero = float(texto.replace(".", "").replace(",", "."))
print(numero)
```

Saída:

```
1500.9
```

E para `"1500.00"` virar inteiro, converta em dois passos: `int(float("1500.00"))` dá `1500`.

## Verificando antes de converter

Uma forma simples de evitar o `ValueError` é checar se o texto só tem dígitos com `isdigit()`:

```python
texto = "4521"
print(texto.isdigit())
texto2 = "45a21"
print(texto2.isdigit())
```

Saída:

```
True
False
```

Limitação: `isdigit()` não aceita sinal negativo nem ponto decimal, então serve para inteiros positivos (quantidades, códigos). Para valores decimais, a forma robusta é usar `try/except`, que você aprenderá mais à frente no curso. Por enquanto, saiba que o erro existe e por que acontece.

## Um programa completo com `input()`

```python
print("=== Cálculo de ISS ===")
empresa = input("Empresa: ")
valor = float(input("Valor do serviço (use ponto): "))
aliquota = float(input("Alíquota em % (ex.: 5): "))

iss = valor * aliquota / 100
liquido = valor - iss

print(f"\nEmpresa: {empresa}")
print(f"Valor bruto:   {valor:>12.2f}")
print(f"ISS ({aliquota:.0f}%):      {iss:>12.2f}")
print(f"Valor líquido: {liquido:>12.2f}")
```

Exemplo de execução (digitando `Oficina Souza`, `2400`, `5`):

```
=== Cálculo de ISS ===
Empresa: Oficina Souza
Valor do serviço (use ponto): 2400
Alíquota em % (ex.: 5): 5

Empresa: Oficina Souza
Valor bruto:        2400.00
ISS (5%):            120.00
Valor líquido:      2280.00
```

O `\n` no começo de uma string é uma **quebra de linha**: pula uma linha antes de imprimir. Deixa a saída mais organizada.

## Por que os exercícios pedem funções, não `input()`

Os exercícios de código deste curso rodam direto no navegador, e lá **não existe teclado para o `input()` ler**; ele simplesmente não funciona. Mais importante que isso: código que depende de `input()` é difícil de **testar**. Para conferir se o cálculo do ISS está certo, você teria que rodar o programa à mão e digitar valores toda vez.

A alternativa é separar o cálculo da leitura. Em vez de:

```python
valor = float(input("Valor: "))
print(valor * 0.05)
```

escreva uma **função** que recebe o valor e devolve o resultado:

```python
def calcular_iss(valor, aliquota):
    return valor * aliquota / 100

print(calcular_iss(2400, 5))
print(calcular_iss(1000, 3))
```

Saída:

```
120.0
30.0
```

Funções serão estudadas a fundo no próximo módulo, mas o esqueleto é simples: `def nome(parametros):` abre a definição, o corpo fica indentado com 4 espaços, e `return` devolve o resultado. Quem chama a função decide de onde vêm os dados — do teclado, de uma planilha, de um teste automático. É assim que programas profissionais são organizados, e é assim que você vai escrever nos exercícios: a função faz a conta, e os testes passam os valores.

## Na prática

`input()` serve para utilitários rápidos de uso próprio: "digite o valor do serviço e a alíquota, receba o ISS". Para processar uma planilha com 300 notas, ninguém vai digitar 300 valores: os dados virão de um arquivo, e a mesma função de cálculo será chamada em um laço. Por isso vale a pena já se acostumar a separar leitura de cálculo: hoje o valor vem do teclado, amanhã vem do Excel, e a função não muda.

## Erros comuns

- **Fazer conta com o resultado de `input()` sem converter**: `input()` devolve `str`. Converta com `int()` ou `float()`.
- **Usar `int()` em texto com decimal**: `int("3.5")` gera `ValueError`. Use `float()`.
- **Vírgula decimal**: `float("10,50")` falha. Troque a vírgula por ponto antes.
- **Esquecer que `int()` trunca**: `int(9.99)` é `9`, não `10`. Para arredondar, `round()`.
- **Concatenar número com texto**: `"Total: " + 100` dá `TypeError`. Use `str(100)` ou f-string.
- **Chamar `input()` nos exercícios do navegador**: não há teclado; escreva funções.

## Resumo

- `input(prompt)` mostra a pergunta e devolve o que o usuário digitou, **sempre como string**.
- `int()` e `float()` convertem texto em número; `str()` converte número em texto.
- `ValueError` ocorre quando o valor não pode ser convertido (`int("abc")`, `float("1,5")`). Limpe o texto antes (`replace`) e, para decimais, use `float`.
- `int()` corta a parte decimal; `round()` arredonda. São coisas diferentes.
- Nos exercícios, separe cálculo de leitura: escreva funções que recebem os valores por parâmetro e devolvem o resultado com `return`.
