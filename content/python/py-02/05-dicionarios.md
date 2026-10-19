Nesta lição você vai aprender o **dicionário**, a estrutura que associa **chaves** a **valores** — como uma ficha cadastral ou um plano de contas. Vai criar dicionários, acessar valores com colchetes e com `get`, adicionar, alterar e remover entradas, percorrer com `items`, `keys` e `values`, aninhar dicionários dentro de dicionários e dominar o **padrão contador**, que resolve metade dos relatórios do dia a dia.

## O problema que o dicionário resolve

Com listas, você acessa itens pela **posição**: `funcionario[1]` é o salário. Isso exige lembrar que a posição 1 é o salário — e com dez campos, ninguém lembra. O dicionário acessa pelo **nome**: `funcionario["salario"]`. O código passa a se explicar sozinho.

```python
funcionario = {
    "nome": "Maria da Silva",
    "cargo": "Analista",
    "salario": 3500.00,
    "dependentes": 2,
}
print(funcionario["nome"])
print(funcionario["salario"])
```

Saída:

```
Maria da Silva
3500.0
```

Estrutura: chaves `{}`, pares `chave: valor` separados por vírgula. As chaves geralmente são strings, mas podem ser números ou tuplas — qualquer coisa imutável. Os valores podem ser qualquer coisa: números, textos, listas, outros dicionários.

Cada chave é **única**. Se você repetir uma chave, o último valor vence.

## Acessar: colchetes ou `get`

Com colchetes, uma chave inexistente gera erro:

```python
print(funcionario["email"])
```

```
KeyError: 'email'
```

Com `get`, uma chave inexistente devolve `None` — ou um valor padrão que você escolher:

```python
print(funcionario.get("email"))
print(funcionario.get("email", "não informado"))
print(funcionario.get("salario", 0))
```

Saída:

```
None
não informado
3500.0
```

Quando usar cada um? Colchetes quando a chave **tem** que existir (se não existir, é bug e você quer saber). `get` quando a ausência é normal e você tem um valor padrão razoável.

Para testar se uma chave existe, use `in`:

```python
print("salario" in funcionario)
print("email" in funcionario)
```

Saída:

```
True
False
```

Note que `in` testa as **chaves**, não os valores.

## Adicionar, alterar e remover

Adicionar e alterar usam a mesma sintaxe: atribuição com colchetes. Se a chave não existe, cria; se existe, substitui.

```python
funcionario["email"] = "maria@empresa.com"   # adiciona
funcionario["salario"] = 3700.00              # altera
print(funcionario["email"], funcionario["salario"])
```

Saída:

```
maria@empresa.com 3700.0
```

Para remover:

```python
del funcionario["email"]                 # remove; KeyError se não existir
dep = funcionario.pop("dependentes")     # remove e devolve o valor
print(dep)
print(funcionario.pop("fax", None))      # com padrão, não dá erro
```

Saída:

```
2
None
```

`update` mescla outro dicionário, sobrescrevendo chaves repetidas:

```python
funcionario.update({"cargo": "Coordenadora", "setor": "Fiscal"})
print(funcionario)
```

Saída:

```
{'nome': 'Maria da Silva', 'cargo': 'Coordenadora', 'salario': 3700.0, 'setor': 'Fiscal'}
```

Desde o Python 3.7, dicionários **mantêm a ordem de inserção**: as chaves aparecem na ordem em que foram adicionadas.

## Percorrer: `items`, `keys`, `values`

```python
plano = {"1.1.01": "Caixa", "1.1.02": "Bancos", "2.1.01": "Fornecedores"}

for codigo in plano:              # percorre as chaves
    print(codigo)

for codigo, nome in plano.items():   # chave e valor
    print(f"{codigo} - {nome}")

for nome in plano.values():       # só os valores
    print(nome)
```

Saída:

```
1.1.01
1.1.02
2.1.01
1.1.01 - Caixa
1.1.02 - Bancos
2.1.01 - Fornecedores
Caixa
Bancos
Fornecedores
```

`items()` é o que você mais vai usar: entrega tuplas `(chave, valor)`, desempacotadas no `for`. `keys()` existe, mas `for chave in dicionario` já percorre as chaves.

Funções embutidas funcionam sobre as views:

```python
salarios = {"Maria": 3500, "João": 4200, "Ana": 2900}
print(sum(salarios.values()))
print(max(salarios.values()))
print(len(salarios))
print(sorted(salarios))               # chaves ordenadas
print(max(salarios, key=salarios.get))   # chave com maior valor
```

Saída:

```
10600
4200
3
['Ana', 'João', 'Maria']
João
```

`max(salarios, key=salarios.get)` merece atenção: percorre as chaves, mas compara pelo valor que `salarios.get(chave)` devolve. É o jeito idiomático de achar "quem ganha mais".

## Dicionários aninhados

Valores podem ser dicionários. Isso modela dados hierárquicos: um cadastro de clientes onde cada cliente tem vários campos.

```python
clientes = {
    "12345678000190": {"nome": "Padaria Central", "regime": "Simples", "ativo": True},
    "98765432000111": {"nome": "Oficina Souza", "regime": "Presumido", "ativo": False},
}

print(clientes["12345678000190"]["nome"])
clientes["98765432000111"]["ativo"] = True

for cnpj, dados in clientes.items():
    status = "ativo" if dados["ativo"] else "inativo"
    print(f"{dados['nome']:<18}{dados['regime']:<12}{status}")
```

Saída:

```
Padaria Central
Padaria Central   Simples     ativo
Oficina Souza     Presumido   ativo
```

Acesso em cadeia: `clientes[cnpj]["nome"]` — primeiro colchete escolhe o cliente, segundo escolhe o campo. Dentro da f-string usei aspas simples em `dados['nome']` porque a f-string já usa aspas duplas.

Um valor também pode ser uma **lista**, e aí você combina as duas estruturas:

```python
notas_por_cliente = {
    "Padaria": [1200.00, 300.00],
    "Oficina": [5000.00],
}
notas_por_cliente["Padaria"].append(450.00)
notas_por_cliente["Mercado"] = []          # cliente novo, sem notas
for cliente, notas in notas_por_cliente.items():
    print(f"{cliente}: {len(notas)} nota(s), total {sum(notas):.2f}")
```

Saída:

```
Padaria: 3 nota(s), total 1950.00
Oficina: 1 nota(s), total 5000.00
Mercado: 0 nota(s), total 0.00
```

## O padrão contador

Pergunta frequente: "quantas notas de cada tipo?", "quanto gastamos por categoria?". A resposta é sempre a mesma estrutura: um dicionário onde a chave é a categoria e o valor é a contagem ou a soma.

```python
lancamentos = ["Aluguel", "Energia", "Aluguel", "Material", "Energia", "Aluguel"]

contagem = {}
for categoria in lancamentos:
    if categoria in contagem:
        contagem[categoria] += 1
    else:
        contagem[categoria] = 1
print(contagem)
```

Saída:

```
{'Aluguel': 3, 'Energia': 2, 'Material': 1}
```

A lógica: se a chave já existe, incrementa; se não, cria com 1. O `get` com padrão encurta isso para uma linha:

```python
contagem = {}
for categoria in lancamentos:
    contagem[categoria] = contagem.get(categoria, 0) + 1
```

`contagem.get(categoria, 0)` devolve a contagem atual ou 0 se for a primeira vez; somamos 1 e gravamos. Mesmo resultado, sem `if`.

A versão "somar por categoria" é idêntica, trocando o 1 pelo valor:

```python
despesas = [
    ("Aluguel", 2500.00),
    ("Energia", 380.50),
    ("Aluguel", 2500.00),
    ("Material", 129.90),
    ("Energia", 410.00),
]
total_por_categoria = {}
for categoria, valor in despesas:
    total_por_categoria[categoria] = total_por_categoria.get(categoria, 0) + valor

for categoria, total in sorted(total_por_categoria.items()):
    print(f"{categoria:<10}{total:>10.2f}")
```

Saída:

```
Aluguel      5000.00
Energia       790.50
Material      129.90
```

Grave esse padrão: ele é o coração do projeto final do módulo. Para contagens puras, a biblioteca padrão tem `collections.Counter`, que faz isso pronto, mas entender a versão manual é essencial.

## Na prática

Três usos que você vai repetir sem parar: cadastro indexado por CNPJ (`clientes[cnpj]["regime"]`), plano de contas (`plano["1.1.01"]` devolve "Caixa") e **totais por categoria**, que é o padrão contador aplicado a lançamentos. Quase todo relatório gerencial ("quanto por conta", "quantas notas por tipo", "faturamento por mês") é um dicionário acumulador seguido de um `for` sobre `sorted(d.items())`.

## Erros comuns

- **`KeyError`** ao acessar chave que não existe com colchetes. Use `get` ou teste com `in`.
- **Confundir chave com valor no `in`**: `3500 in salarios` é `False` (3500 é valor). Para valores, `3500 in salarios.values()`.
- **Usar lista como chave**: `TypeError: unhashable type: 'list'`. Chaves precisam ser imutáveis — use tupla.
- **Esquecer o `.items()`** e tentar `for k, v in dicionario:` — cada volta entrega só a chave, então o Python tenta desempacotar a própria chave em `k` e `v`: dá `ValueError` (ou `TypeError`, se a chave for número), ou um resultado sem sentido se a chave for um texto de exatamente dois caracteres.
- **Alterar o dicionário enquanto percorre** (adicionar ou remover chaves dentro do `for`): `RuntimeError`. Percorra `list(d.keys())` ou acumule as alterações para depois.
- **Aspas iguais dentro da f-string**: `f"{d["x"]}"` quebra em versões anteriores à 3.12; use aspas simples dentro: `f"{d['x']}"`.

## Resumo

- Dicionário mapeia chaves únicas e imutáveis a valores de qualquer tipo: `{"nome": "Maria", "salario": 3500}`; mantém a ordem de inserção.
- `d[chave]` acessa (erro se não existir); `d.get(chave, padrao)` acessa com fallback; `in` testa chaves.
- `d[chave] = valor` cria ou altera; `del d[chave]` e `d.pop(chave)` removem; `update` mescla.
- Percorra com `for chave, valor in d.items()`; `values()` e `keys()` para um lado só; `sum`, `max`, `sorted` funcionam sobre eles.
- Padrão contador/somador: `d[cat] = d.get(cat, 0) + valor` — a base de qualquer "total por categoria".
