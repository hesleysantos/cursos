Nesta lição você vai aprender a fazer o programa **tomar decisões**: comparar valores, usar `if`, `elif` e `else`, combinar condições com `and`, `or` e `not`, testar pertencimento com `in`, entender quais valores o Python considera "falsos" e escrever condições de uma linha. É aqui que o código deixa de ser uma calculadora e passa a seguir regras — como as tabelas de INSS e IRRF.

## Comparações produzem `True` ou `False`

| Operador | Significado | Exemplo | Resultado |
|----------|-------------|---------|-----------|
| `==` | igual a | `5 == 5` | `True` |
| `!=` | diferente de | `5 != 3` | `True` |
| `>` | maior que | `1500 > 2000` | `False` |
| `<` | menor que | `1500 < 2000` | `True` |
| `>=` | maior ou igual | `10 >= 10` | `True` |
| `<=` | menor ou igual | `10 <= 9` | `False` |

```python
salario = 3500
print(salario > 1518)
print(salario == 3500)
print(salario != 3500)
print("abc" == "ABC")     # strings diferenciam maiúsculas
```

Saída:

```
True
True
False
False
```

Lembre: `==` compara, `=` atribui. Escrever `if salario = 3500:` é erro de sintaxe.

Python também permite comparações encadeadas, muito legíveis para faixas:

```python
base = 3000
print(2259.21 <= base <= 2826.65)
```

Saída:

```
False
```

Isso é o mesmo que `base >= 2259.21 and base <= 2826.65`, mas lido como na matemática.

## `if`: execute só se for verdade

```python
saldo = -250
if saldo < 0:
    print("Conta no vermelho!")
print("Fim da verificação")
```

Saída:

```
Conta no vermelho!
Fim da verificação
```

Anatomia: a palavra `if`, a condição, **dois-pontos**, e o bloco **indentado com 4 espaços**. Tudo que estiver indentado pertence ao `if` e só roda se a condição for verdadeira. A linha `print("Fim...")` está sem indentação, então roda sempre.

Em Python a indentação não é enfeite: **ela define onde o bloco começa e termina**. Outras linguagens usam chaves; o Python usa o recuo. Se você esquecer de indentar, dá `IndentationError`; se indentar errado, o programa roda mas faz outra coisa.

## `else`: caso contrário

```python
valor_nota = 1200
if valor_nota > 5000:
    print("Precisa de aprovação do gerente")
else:
    print("Aprovação automática")
```

Saída:

```
Aprovação automática
```

Exatamente um dos dois blocos executa. Nunca os dois, nunca nenhum.

## `elif`: várias faixas

Quando há mais de duas possibilidades, `elif` (contração de "else if") testa condições em sequência. O Python avalia de cima para baixo e **executa só o primeiro bloco verdadeiro**; os demais são ignorados.

```python
faturamento_anual = 2500000

if faturamento_anual <= 81000:
    regime = "MEI"
elif faturamento_anual <= 4800000:
    regime = "Simples Nacional"
elif faturamento_anual <= 78000000:
    regime = "Lucro Presumido (opcional)"
else:
    regime = "Lucro Real obrigatório"

print(regime)
```

Saída:

```
Simples Nacional
```

Repare que no segundo `elif` não precisei escrever `faturamento_anual > 81000 and ...`: se chegou ali, é porque o primeiro `if` já foi falso. Essa é a vantagem de ordenar as faixas da menor para a maior.

> **Dica:** a ordem dos `elif` importa. Se você testar `<= 4800000` antes de `<= 81000`, o MEI nunca será alcançado, porque 50.000 também é menor que 4.800.000.

Um exemplo de tabela progressiva, que você usará no mini-projeto:

```python
base = 3000.00

if base <= 2259.20:
    aliquota = 0.0
elif base <= 2826.65:
    aliquota = 0.075
elif base <= 3751.05:
    aliquota = 0.15
elif base <= 4664.68:
    aliquota = 0.225
else:
    aliquota = 0.275

print(f"Alíquota: {aliquota:.1%}")
```

Saída:

```
Alíquota: 15.0%
```

## Combinando condições: `and`, `or`, `not`

| Operador | Verdadeiro quando |
|----------|-------------------|
| `a and b` | **ambos** são verdadeiros |
| `a or b` | **pelo menos um** é verdadeiro |
| `not a` | `a` é falso (inverte) |

```python
valor = 12000
tem_contrato = True

if valor > 10000 and tem_contrato:
    print("Pagamento liberado")

if valor > 50000 or not tem_contrato:
    print("Revisar manualmente")
else:
    print("Sem revisão")
```

Saída:

```
Pagamento liberado
Sem revisão
```

Um erro de lógica clássico: escrever `if tipo == "NFe" or "NFSe":`. Isso **não** significa "tipo é NFe ou NFSe". O Python lê como `(tipo == "NFe") or ("NFSe")`, e `"NFSe"` sozinho é sempre verdadeiro (veremos por quê adiante). O correto é repetir a comparação: `tipo == "NFe" or tipo == "NFSe"`, ou melhor ainda, usar `in`.

Quando misturar `and` e `or`, use parênteses para deixar a intenção clara. `not` tem prioridade sobre `and`, que tem prioridade sobre `or`; com parênteses, ninguém precisa lembrar disso.

### Ordem de avaliação: o Python para no primeiro resultado decisivo

`and` e `or` avaliam **da esquerda para a direita** e param assim que o resultado já está decidido. Em `a and b`, se `a` for falso, `b` nem é olhado (o resultado já é falso). Em `a or b`, se `a` for verdadeiro, `b` nem é olhado. Isso se chama **curto-circuito** e é útil para proteger uma conta perigosa:

```python
qtd = 0
total = 1500
if qtd > 0 and total / qtd > 100:
    print("Ticket médio alto")
else:
    print("Sem itens ou ticket médio baixo")
```

Saída:

```
Sem itens ou ticket médio baixo
```

Como `qtd > 0` é falso, a divisão `total / qtd` nunca é executada e não há `ZeroDivisionError`. Se as duas condições estivessem invertidas (`total / qtd > 100 and qtd > 0`), o programa quebraria. Regra prática: coloque primeiro a condição que "protege" a segunda.

## `in`: pertencimento

`in` verifica se um valor está dentro de uma sequência (string, lista etc.):

```python
tipo = "NFSe"
print(tipo in ("NFe", "NFSe", "CTe"))

historico = "Pagto fornecedor NF 4521"
print("NF" in historico)
print("boleto" in historico)
print("boleto" not in historico)
```

Saída:

```
True
True
False
True
```

`tipo in ("NFe", "NFSe", "CTe")` é a forma correta e elegante de testar "é um destes". O `(...)` com vírgulas é uma tupla, assunto do próximo módulo.

## Valores "falsy": o que o Python considera falso

O `if` não exige um `bool`. Ele aceita qualquer valor e decide se ele "conta como verdadeiro" (*truthy*) ou "conta como falso" (*falsy*). São **falsy**:

- `False`
- `None`
- Zero numérico: `0`, `0.0`
- Coleções vazias: `""`, `[]`, `()`, `{}`

**Tudo o mais é truthy**: qualquer número diferente de zero, qualquer texto não vazio (inclusive `"0"` e `"False"`), qualquer lista com itens.

```python
nome = ""
if nome:
    print(f"Cliente: {nome}")
else:
    print("Nome não informado")

desconto = 0
if desconto:
    print("Tem desconto")
else:
    print("Sem desconto")

observacao = "0"
if observacao:
    print("Tem observação (texto não vazio conta como verdadeiro)")
```

Saída:

```
Nome não informado
Sem desconto
Tem observação (texto não vazio conta como verdadeiro)
```

Esse comportamento permite escrever `if nome:` em vez de `if nome != "":` — mais curto e idiomático. Mas explica também o bug do `or "NFSe"`: um texto não vazio é sempre verdadeiro, então a condição sempre passa.

## Condicional em uma linha (expressão ternária)

Para escolher entre dois valores de forma compacta:

```python
valor = 7000
status = "Alto" if valor > 5000 else "Normal"
print(status)
```

Saída:

```
Alto
```

Leia como em português: "status é 'Alto' se valor > 5000, senão 'Normal'". Use quando as duas alternativas são valores simples. Se houver vários passos em cada ramo, prefira o `if/else` em bloco: legibilidade vale mais que economizar linhas.

Outro uso comum é em f-strings:

```python
qtd = 1
print(f"{qtd} {'item' if qtd == 1 else 'itens'}")
```

Saída:

```
1 item
```

## Aninhando `if`

Um `if` pode conter outro. Cada nível ganha mais 4 espaços:

```python
valor = 8000
aprovado_gerente = False

if valor > 5000:
    if aprovado_gerente:
        print("Pagar")
    else:
        print("Aguardando gerente")
else:
    print("Pagar (sem necessidade de aprovação)")
```

Saída:

```
Aguardando gerente
```

Funciona, mas três ou mais níveis ficam difíceis de ler. Muitas vezes dá para achatar com `and`: `if valor > 5000 and not aprovado_gerente:`.

## Na prática

Regra fiscal é `if/elif/else`: faixas de INSS e IRRF, enquadramento de regime, alertas de valor. Ao transcrever uma tabela oficial, ordene as faixas da menor para a maior e teste os **limites exatos** de cada faixa, que é onde os erros se escondem.

## Erros comuns

- **`=` em vez de `==`**: `if x = 5:` é `SyntaxError`.
- **Esquecer os dois-pontos** no fim da linha do `if`, `elif` ou `else`.
- **Indentação inconsistente**: misturar tabs e espaços ou indentar o `else` em nível diferente do `if`. Use sempre 4 espaços.
- **`or` com valor solto**: `if tipo == "A" or "B":` é sempre verdadeiro. Repita a comparação ou use `in`.
- **Faixas na ordem errada** no `elif`: teste da menor para a maior (ou da maior para a menor), nunca fora de ordem.
- **Comparar tipos diferentes**: `"1500" > 1000` gera `TypeError`. Converta antes.
- **Confundir `"0"` com `0`**: o texto `"0"` é truthy; o número `0` é falsy.

## Resumo

- Comparações (`== != > < >= <=`) devolvem `True` ou `False`; `==` compara, `=` atribui.
- `if condição:` executa o bloco indentado só se verdadeiro; `else` cobre o caso contrário; `elif` encadeia faixas e só o primeiro bloco verdadeiro roda.
- `and` exige ambos, `or` exige pelo menos um, `not` inverte; use parênteses ao misturar e nunca escreva `x == "a" or "b"`. A avaliação é da esquerda para a direita e para no primeiro resultado decisivo (curto-circuito).
- `in` testa se um valor está numa sequência: `tipo in ("NFe", "NFSe")`.
- Falsy: `False`, `None`, `0`, `""` e coleções vazias; todo o resto é truthy. A forma `valor_a if cond else valor_b` escolhe entre dois valores numa linha.
