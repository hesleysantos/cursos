Nesta lição você vai aprender o laço `for`, a forma mais usada de repetição em Python: percorrer cada item de uma sequência, gerar sequências numéricas com `range()`, obter a posição de cada item com `enumerate()` e combinar laços dentro de laços (aninhados). Se o `while` é "repita enquanto", o `for` é "para cada item, faça".

## `for`: para cada item

```python
notas = [1200.00, 850.50, 300.00]
for valor in notas:
    print(f"Nota de {valor:.2f}")
```

Saída:

```
Nota de 1200.00
Nota de 850.50
Nota de 300.00
```

Leia como português: "para cada `valor` em `notas`, faça...". A cada volta, a variável `valor` recebe o próximo item da lista. Quando os itens acabam, o laço termina sozinho. **Não há contador para inicializar nem atualizar** — por isso o `for` é mais seguro que o `while`: percorrendo uma lista ou um `range`, o laço sempre termina quando os itens acabam.

O nome da variável é escolha sua. Use um nome que descreva o item: `for nota in notas`, `for funcionario in funcionarios`, `for linha in linhas`.

O padrão acumulador fica assim:

```python
notas = [1200.00, 850.50, 300.00]
total = 0
for valor in notas:
    total += valor
print(f"Total: {total:.2f}")
```

Saída:

```
Total: 2350.50
```

Strings também são sequências, então dá para percorrer letra por letra:

```python
cnpj = "12.345.678/0001-90"
digitos = ""
for caractere in cnpj:
    if caractere.isdigit():
        digitos += caractere
print(digitos)
```

Saída:

```
12345678000190
```

## `range()`: gerando números

Quando você quer repetir N vezes, ou percorrer números de A até B, usa `range()`:

```python
for i in range(5):
    print(i)
```

Saída:

```
0
1
2
3
4
```

`range(5)` gera 0, 1, 2, 3, 4 — **cinco números, começando em zero e parando antes do 5**. É a mesma regra do fatiamento: o fim não entra.

As três formas:

| Chamada | Gera | Uso |
|---------|------|-----|
| `range(fim)` | 0, 1, ..., fim-1 | repetir `fim` vezes |
| `range(inicio, fim)` | inicio, ..., fim-1 | intervalo |
| `range(inicio, fim, passo)` | de `passo` em `passo` | pular, contar para trás |

```python
for mes in range(1, 13):
    print(mes, end=" ")
print()

for ano in range(2020, 2027, 2):
    print(ano, end=" ")
print()

for n in range(10, 0, -2):
    print(n, end=" ")
print()
```

Saída:

```
1 2 3 4 5 6 7 8 9 10 11 12 
2020 2022 2024 2026 
10 8 6 4 2 
```

O `end=" "` faz o `print` terminar com espaço em vez de quebra de linha, para a saída ficar numa linha só. O `print()` vazio depois pula a linha.

Para contar de trás para frente, o passo é negativo e o início é maior que o fim: `range(10, 0, -2)`.

Um exemplo financeiro: tabela de juros compostos ano a ano.

```python
capital = 10000
taxa = 0.08
for ano in range(1, 6):
    capital *= 1 + taxa
    print(f"Ano {ano}: {capital:>10.2f}")
```

Saída:

```
Ano 1:   10800.00
Ano 2:   11664.00
Ano 3:   12597.12
Ano 4:   13604.89
Ano 5:   14693.28
```

## `enumerate()`: item e posição ao mesmo tempo

Às vezes você precisa do item **e** da posição dele. O jeito ingênuo é `for i in range(len(lista))` e depois `lista[i]`. Funciona, mas é feio e propenso a erro. O jeito Python é `enumerate()`:

```python
clientes = ["Padaria Central", "Oficina Souza", "Mercado Bom Preço"]
for i, nome in enumerate(clientes):
    print(f"{i}: {nome}")
```

Saída:

```
0: Padaria Central
1: Oficina Souza
2: Mercado Bom Preço
```

A cada volta, `enumerate` entrega um par (posição, item), que desempacotamos em `i, nome`. Para numerar a partir de 1 (como as pessoas esperam em relatórios), passe o início:

```python
for numero, nome in enumerate(clientes, start=1):
    print(f"{numero}. {nome}")
```

Saída:

```
1. Padaria Central
2. Oficina Souza
3. Mercado Bom Preço
```

Outro uso: achar **onde** está o maior valor.

```python
notas = [1200, 850, 15000, 300]
maior_pos = 0
for i, valor in enumerate(notas):
    if valor > notas[maior_pos]:
        maior_pos = i
print(f"Maior nota na posição {maior_pos}: {notas[maior_pos]}")
```

Saída:

```
Maior nota na posição 2: 15000
```

## `break`, `continue` e `else` no `for`

Funcionam igual ao `while`. `break` sai; `continue` pula para o próximo item; `else` roda se não houve `break`:

```python
notas = [1200, 850, 300]
for valor in notas:
    if valor > 10000:
        print("Achou nota grande")
        break
else:
    print("Nenhuma nota acima de 10 mil")
```

Saída:

```
Nenhuma nota acima de 10 mil
```

No `for`, o `continue` é seguro: não há variável para esquecer de atualizar.

## Laços aninhados

Um `for` dentro de outro. Para cada volta do externo, o interno roda **completo**. Pense numa planilha: o laço externo percorre as linhas; o interno, as colunas de cada linha.

```python
for linha in range(1, 4):
    for coluna in range(1, 4):
        print(f"{linha * coluna:>3}", end="")
    print()
```

Saída:

```
  1  2  3
  2  4  6
  3  6  9
```

O `print()` sem argumentos está indentado no nível do laço externo: roda uma vez por linha, depois que o interno terminou as três colunas.

Exemplo real: três empresas, cada uma com suas notas do mês.

```python
empresas = ["Padaria", "Oficina", "Mercado"]
notas = [[1200, 300], [5000], [800, 450, 1100]]

for nome, lista in zip(empresas, notas):
    total = 0
    for valor in lista:
        total += valor
    print(f"{nome:<10}{len(lista)} nota(s)  total {total:>8.2f}")
```

Saída:

```
Padaria   2 nota(s)  total  1500.00
Oficina   1 nota(s)  total  5000.00
Mercado   3 nota(s)  total  2350.00
```

Duas novidades aqui: `zip()` percorre duas listas em paralelo (primeira empresa com primeira lista de notas, e assim por diante), e `total = 0` está **dentro** do laço externo, para zerar a cada empresa. Se estivesse fora, os totais se acumulariam de uma empresa para a outra — um bug muito comum.

> **Dica:** `break` dentro de um laço aninhado sai **só do laço interno**. Se precisar sair dos dois, use uma variável de controle (`achou = True`) e teste-a no externo, ou coloque os laços dentro de uma função e use `return`.

## `for` ou `while`?

- Sabe de antemão **o que** percorrer (lista, string, `range`)? Use `for`.
- O número de repetições depende **do que acontece** durante o laço (saldo chegar a zero, usuário digitar "sair")? Use `while`.

Na prática, `for` cobre uns 80% dos casos. Quando se pegar escrevendo `i = 0; while i < len(lista): ...; i += 1`, troque por `for item in lista`.

## Na prática

A planilha de lançamentos do mês é uma lista de linhas, e `for linha in linhas:` é como você vai percorrê-la: somar por conta, conferir CNPJs, marcar notas acima de um limite. O `enumerate(linhas, start=2)` é um truque útil nesse cenário: numera as linhas como no Excel (a 1 é o cabeçalho), e a mensagem de erro passa a dizer "linha 148 com valor inválido", que é exatamente o que você quer saber para ir corrigir.

## Erros comuns

- **Achar que `range(1, 10)` inclui o 10**: vai até 9. Para incluir, `range(1, 11)`.
- **Modificar a lista enquanto percorre** (remover itens dentro do `for`): pula elementos. Percorra uma cópia ou construa uma lista nova.
- **Usar `range(len(lista))` só para pegar o item**: prefira `for item in lista`; se precisar da posição, `enumerate`.
- **Reiniciar o acumulador no lugar errado** em laços aninhados: `total = 0` deve ficar onde cada total começa.
- **Esquecer que a variável do laço sobrevive** depois do `for`: `valor` ainda existe, com o último item. Não reutilize sem reatribuir.
- **`end=""` sem `print()` final**: a próxima saída cola na mesma linha.

## Resumo

- `for item in sequência:` executa o bloco uma vez para cada item; não precisa de contador nem de atualização.
- `range(fim)`, `range(inicio, fim)` e `range(inicio, fim, passo)` geram números; o fim nunca entra.
- `enumerate(lista, start=1)` entrega posição e item juntos; `zip(a, b)` percorre duas sequências lado a lado.
- `break`, `continue` e `else` funcionam no `for` como no `while`; `break` só sai do laço mais interno.
- Laços aninhados: o interno roda completo a cada volta do externo; inicialize acumuladores no nível certo.
