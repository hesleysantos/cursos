Nesta lição você vai aprender a criar suas próprias **funções** com `def`, devolver resultados com `return`, receber parâmetros (obrigatórios, com valor padrão e nomeados), entender a diferença entre escopo local e global, documentar com docstrings e, por fim, fixar uma distinção que confunde muita gente: `return` não é `print`. Você já usou funções nos exercícios; agora vai entender o que acontece por trás.

## Por que funções

Imagine o cálculo do INSS escrito três vezes no mesmo programa, para três situações diferentes. Quando a tabela mudar, você precisa achar e corrigir os três lugares — e vai esquecer um. Uma função resolve: o cálculo fica em **um só lugar**, com um **nome**, e é chamado quantas vezes for preciso.

Funções servem para:

- **Não repetir código** (quando mudar, muda num lugar só).
- **Dar nome a uma ideia**: `calcular_inss(bruto)` diz o que faz; vinte linhas de `if/elif` não dizem.
- **Testar**: uma função que recebe entrada e devolve saída pode ser verificada automaticamente.
- **Dividir um problema grande** em pedaços pequenos que cabem na cabeça.

## Definindo e chamando

```python
def saudacao():
    print("Bem-vindo ao sistema de folha")

saudacao()
saudacao()
```

Saída:

```
Bem-vindo ao sistema de folha
Bem-vindo ao sistema de folha
```

Anatomia: `def`, o nome (snake_case, como variáveis), parênteses, dois-pontos, e o corpo indentado. **Definir** a função não executa nada; só **chamar** com `saudacao()` executa o corpo. A definição precisa vir antes da chamada no arquivo.

## Parâmetros e argumentos

Parâmetros são as variáveis entre parênteses na definição; argumentos são os valores passados na chamada.

```python
def calcular_iss(valor, aliquota):
    return round(valor * aliquota / 100, 2)

print(calcular_iss(2400, 5))
print(calcular_iss(1000, 2.5))
```

Saída:

```
120.0
25.0
```

Na chamada `calcular_iss(2400, 5)`, `valor` recebe 2400 e `aliquota` recebe 5 — pela **posição**. Chamar com menos ou mais argumentos que parâmetros gera `TypeError: calcular_iss() missing 1 required positional argument` ou `takes 2 positional arguments but 3 were given`.

## `return`: devolvendo o resultado

`return` faz duas coisas: **encerra** a função imediatamente e **entrega** um valor para quem chamou. Esse valor pode ser guardado numa variável, impresso, usado em outra conta ou passado para outra função.

```python
def calcular_iss(valor, aliquota):
    return round(valor * aliquota / 100, 2)

iss = calcular_iss(2400, 5)          # guardar
total = 2400 + calcular_iss(2400, 5) # usar em conta
print(f"ISS: {iss}, total: {total}")
```

Saída:

```
ISS: 120.0, total: 2520.0
```

Como `return` encerra a função, código depois dele nunca roda. Isso permite "retornos antecipados" que simplificam condições:

```python
def classificar(valor):
    if valor < 0:
        return "inválido"
    if valor == 0:
        return "zerado"
    if valor > 10000:
        return "alto"
    return "normal"

print(classificar(-5), classificar(0), classificar(50000), classificar(300))
```

Saída:

```
inválido zerado alto normal
```

Não precisou de `elif` nem `else`: cada `return` já sai. Uma função pode devolver vários valores separados por vírgula (na verdade, uma tupla), como vimos na lição de tuplas: `return quociente, resto`.

Uma função **sem `return`** (ou com `return` sozinho) devolve `None`:

```python
def avisar():
    print("Processando...")

resultado = avisar()
print(resultado)
```

Saída:

```
Processando...
None
```

## Valores padrão

Um parâmetro pode ter um valor padrão, usado quando o argumento não é passado:

```python
def calcular_iss(valor, aliquota=5):
    return round(valor * aliquota / 100, 2)

print(calcular_iss(2400))        # usa aliquota=5
print(calcular_iss(2400, 3))     # sobrescreve
```

Saída:

```
120.0
72.0
```

Parâmetros com padrão devem vir **depois** dos obrigatórios: `def f(a, b=1)` vale; `def f(a=1, b)` é `SyntaxError`.

> **Atenção:** nunca use lista ou dicionário como valor padrão (`def f(itens=[])`). O padrão é criado **uma vez** e compartilhado entre todas as chamadas — os itens de uma chamada aparecem na próxima. Use `None` e crie dentro: `def f(itens=None): if itens is None: itens = []`.

## Argumentos nomeados

Em vez de confiar na posição, você pode nomear os argumentos na chamada:

```python
def calcular_liquido(bruto, dependentes=0, pensao=0.0):
    base = bruto - dependentes * 189.59 - pensao
    return round(base, 2)

print(calcular_liquido(5000, pensao=500))
print(calcular_liquido(bruto=5000, dependentes=2))
print(calcular_liquido(dependentes=1, bruto=3000))
```

Saída:

```
4500.0
4620.82
2810.41
```

Vantagens: a chamada se explica sozinha (`pensao=500` é mais claro que um `500` solto), a ordem deixa de importar, e você pode pular parâmetros com padrão. Argumentos posicionais devem vir antes dos nomeados na chamada: `f(5000, pensao=500)` vale; `f(pensao=500, 5000)` não.

## Escopo: local e global

Variáveis criadas **dentro** de uma função são **locais**: existem só enquanto a função roda e somem depois. Quem está fora não as vê.

```python
def calcular():
    resultado = 42       # local
    return resultado

print(calcular())
print(resultado)         # NameError: name 'resultado' is not defined
```

Isso é bom: cada função tem seu espaço, e nomes iguais em funções diferentes não se misturam. Os parâmetros também são locais.

Variáveis criadas **fora** de qualquer função são **globais**: a função consegue **ler** uma global, mas, se tentar **atribuir** a ela, cria uma local de mesmo nome.

```python
ALIQUOTA = 5                      # global, constante

def iss(valor):
    return valor * ALIQUOTA / 100  # lê a global: ok

contador = 0

def incrementar():
    contador = contador + 1        # UnboundLocalError

def incrementar_certo():
    global contador
    contador += 1

print(iss(1000))
incrementar_certo()
incrementar_certo()
print(contador)
```

Saída (sem chamar a versão com erro):

```
50.0
2
```

A palavra `global` avisa "quero alterar a variável de fora". Funciona, mas é um sinal de alerta: funções que alteram estado global são difíceis de testar e entender. O caminho preferido é **receber por parâmetro e devolver por `return`**: `contador = incrementar(contador)`.

Ler constantes globais (como `ALIQUOTA` ou `TETO_INSS`) é perfeitamente normal e é exatamente para isso que elas ficam no topo do arquivo em maiúsculas.

Listas e dicionários passados como argumento são o mesmo objeto (lembra da lição de listas?). Se a função fizer `lista.append(x)`, a lista de fora muda. Às vezes é o que você quer (`adicionar_despesa(despesas, ...)`); às vezes não — nesse caso, trabalhe numa cópia.

## Docstrings

Uma string logo na primeira linha do corpo documenta a função. Use três aspas:

```python
def calcular_iss(valor, aliquota=5):
    """Calcula o ISS sobre o valor do serviço.

    valor: valor bruto do serviço em reais.
    aliquota: percentual do município (padrão 5).
    Devolve o imposto arredondado em 2 casas.
    """
    return round(valor * aliquota / 100, 2)

help(calcular_iss)
```

O `help()` mostra a docstring; o VS Code a exibe quando você passa o mouse sobre a chamada. Escreva o que a função **faz**, o que **recebe** e o que **devolve**. Não repita o código; explique a intenção.

## `return` versus `print`

Esta confusão trava muitos iniciantes, então vamos ser diretos:

- `print(x)` **mostra** `x` na tela e devolve `None`. É comunicação com o humano.
- `return x` **entrega** `x` para o código que chamou. É comunicação entre partes do programa.

```python
def iss_print(valor):
    print(valor * 0.05)

def iss_return(valor):
    return valor * 0.05

a = iss_print(1000)      # mostra 50.0 na tela; a recebe None
b = iss_return(1000)     # não mostra nada; b recebe 50.0
print(a)
print(b + 10)            # dá para continuar a conta
```

Saída:

```
50.0
None
60.0
```

Se a função só imprime, o valor **se perde**: você não consegue somar, comparar, guardar numa lista nem testar. Regra prática: funções de **cálculo** usam `return`; a exibição fica em outra função, ou no programa principal. Foi assim que organizamos o projeto do salário líquido, e é assim que os exercícios conseguem verificar seu código.

## Funções como valores

Em Python, uma função é um valor como outro qualquer: pode ser guardada em variável e passada como argumento. Isso explica o `key` de `sorted` e `max`:

```python
def pegar_salario(registro):
    return registro[1]

folha = [("Maria", 3500), ("João", 4200), ("Ana", 2900)]
print(sorted(folha, key=pegar_salario))
print(max(folha, key=pegar_salario))
```

Saída:

```
[('Ana', 2900), ('Maria', 3500), ('João', 4200)]
('João', 4200)
```

Note que passamos `pegar_salario` **sem parênteses**: estamos entregando a função, não o resultado dela. `sorted` a chama internamente para cada item e ordena pelo que ela devolve. Esse recurso será essencial no projeto final para ordenar despesas por valor.

## Na prática

Cada regra fiscal vira uma função com nome claro e docstring: `calcular_inss(bruto)`, `calcular_irrf(base, dependentes=0)`, `retencao_csrf(valor, servico)`. Quando a tabela muda, você altera uma função e todos os scripts que a usam passam a calcular certo. E, como elas devolvem com `return` em vez de imprimir, dá para conferir cada uma com três ou quatro valores conhecidos antes de confiar nela na folha inteira.

## Erros comuns

- **Esquecer o `return`**: a função devolve `None` e a conta seguinte dá `TypeError: unsupported operand type(s) for +: 'NoneType'`.
- **Confundir `print` com `return`**: a saída aparece na tela, mas o valor se perde.
- **Chamar antes de definir**: `NameError`. A definição precisa vir antes no arquivo.
- **Esquecer os parênteses na chamada**: `calcular_iss` sem `()` é a função em si, não o resultado.
- **Lista como valor padrão**: compartilhada entre chamadas. Use `None`.
- **Atribuir a uma global sem `global`**: `UnboundLocalError`. Prefira receber e devolver.
- **Código após o `return`**: nunca executa.

## Resumo

- `def nome(parametros):` define; `nome(argumentos)` chama. Parâmetros são locais à função.
- `return` encerra a função e entrega um valor; sem `return`, a função devolve `None`. Vários valores viram uma tupla.
- Valores padrão (`aliquota=5`) tornam parâmetros opcionais; argumentos nomeados (`pensao=500`) deixam a chamada clara e a ordem livre. Nunca use lista/dicionário como padrão.
- Variáveis de dentro são locais; funções leem globais, mas para alterá-las precisam de `global` — evite; receba por parâmetro e devolva por `return`.
- Docstrings documentam; `print` mostra, `return` entrega — funções de cálculo devolvem, e a exibição fica separada.
