Nesta lição você vai aprender a repetir instruções com o laço `while`, usar contadores e acumuladores, interromper um laço com `break`, pular uma volta com `continue`, e reconhecer e evitar o temido laço infinito. Repetição é o que transforma um script que calcula uma nota fiscal em um script que processa mil notas.

## Por que repetir?

Até agora, cada linha do seu programa rodava uma vez. Se você quisesse somar dez notas fiscais, teria que escrever dez `total +=`. Com cem notas, cem linhas. Isso não escala. A repetição (ou **laço**, do inglês *loop*) resolve: você escreve o bloco uma vez e diz ao Python "repita enquanto tal condição for verdadeira".

## O `while`

```python
contador = 1
while contador <= 5:
    print(f"Parcela {contador}")
    contador += 1
print("Fim")
```

Saída:

```
Parcela 1
Parcela 2
Parcela 3
Parcela 4
Parcela 5
Fim
```

Como funciona, passo a passo:

1. O Python avalia a condição `contador <= 5`. Se for verdadeira, executa o bloco indentado.
2. Ao terminar o bloco, **volta** para a condição e avalia de novo.
3. Repete até a condição ser falsa. Aí pula o bloco e segue para a linha seguinte (`print("Fim")`).

Três peças sempre aparecem num `while` bem construído:

- **Inicialização** antes do laço: `contador = 1`.
- **Condição** que será testada a cada volta: `contador <= 5`.
- **Atualização** dentro do laço, que faz a condição um dia ficar falsa: `contador += 1`.

Se uma dessas três faltar, o laço não roda, ou nunca para.

## Contadores e acumuladores

Um **contador** conta voltas (`contador += 1`). Um **acumulador** soma valores (`total += valor`). Os dois costumam aparecer juntos:

```python
# simular parcelas de um financiamento até quitar
saldo = 5000.00
parcela = 1200.00
mes = 0
total_pago = 0

while saldo > 0:
    mes += 1
    pagamento = min(parcela, saldo)   # a última parcela pode ser menor
    saldo -= pagamento
    total_pago += pagamento
    print(f"Mês {mes}: pagou {pagamento:.2f}, restam {saldo:.2f}")

print(f"Quitado em {mes} meses, total {total_pago:.2f}")
```

Saída:

```
Mês 1: pagou 1200.00, restam 3800.00
Mês 2: pagou 1200.00, restam 2600.00
Mês 3: pagou 1200.00, restam 1400.00
Mês 4: pagou 1200.00, restam 200.00
Mês 5: pagou 200.00, restam 0.00
Quitado em 5 meses, total 5000.00
```

Repare no `min(parcela, saldo)`: no último mês, sobrava 200, então pagamos só 200. Sem isso o saldo ficaria negativo.

Outro uso clássico: quantos anos para um investimento dobrar?

```python
capital = 10000
taxa = 0.08
anos = 0
while capital < 20000:
    capital *= 1 + taxa
    anos += 1
print(f"Dobrou em {anos} anos ({capital:.2f})")
```

Saída:

```
Dobrou em 10 anos (21589.25)
```

Esse tipo de pergunta ("quantas vezes até...") é a especialidade do `while`: você não sabe de antemão quantas voltas serão necessárias.

## `break`: sair do laço imediatamente

`break` interrompe o laço na hora, mesmo que a condição ainda seja verdadeira. Útil para "procurar até achar":

```python
notas = [1200, 850, 15000, 300, 22000]
i = 0
while i < len(notas):
    if notas[i] > 10000:
        print(f"Primeira nota acima de 10 mil: {notas[i]} (posição {i})")
        break
    i += 1
```

Saída:

```
Primeira nota acima de 10 mil: 15000 (posição 2)
```

Assim que achamos a primeira nota grande, não há motivo para continuar olhando as outras.

`break` também permite um padrão muito comum: o laço "para sempre" com saída controlada por dentro.

```python
tentativas = 0
while True:
    tentativas += 1
    print(f"Tentativa {tentativas}")
    if tentativas == 3:
        print("Limite de tentativas atingido")
        break
```

Saída:

```
Tentativa 1
Tentativa 2
Tentativa 3
Limite de tentativas atingido
```

`while True:` significa "repita indefinidamente"; o `break` dentro é a única porta de saída. É um padrão legítimo, muito usado em menus e leitura de dados, **desde que o `break` seja alcançável**.

## `continue`: pular para a próxima volta

`continue` abandona o restante do bloco **nesta volta** e vai direto testar a condição de novo. Serve para ignorar casos que não interessam:

```python
valores = [100, -50, 200, 0, 300]
i = 0
total = 0
while i < len(valores):
    valor = valores[i]
    i += 1
    if valor <= 0:
        continue          # ignora zeros e negativos
    total += valor
print(f"Soma dos positivos: {total}")
```

Saída:

```
Soma dos positivos: 600
```

> **Atenção:** observe que `i += 1` está **antes** do `continue`. Se estivesse depois, o `continue` pularia a atualização, `i` nunca mudaria e o laço travaria no primeiro valor negativo. Essa é a armadilha número um do `continue` em laços `while`.

## Laços infinitos: como acontecem e como evitar

Um laço infinito é um `while` cuja condição nunca fica falsa. O programa trava, a tela enche (ou fica em silêncio) e o computador fica ocupado. Para parar, pressione `Ctrl + C` no terminal.

As causas mais comuns (os três trechos abaixo são exemplos de **erro** — se rodar algum deles, use `Ctrl + C` para interromper):

**1. Esquecer a atualização**

```python
n = 0
while n < 5:
    print(n)
    # faltou n += 1  -> imprime 0 para sempre
```

**2. Atualizar na direção errada**

```python
n = 10
while n > 0:
    n += 1    # devia ser n -= 1; n só cresce e nunca chega a zero
```

**3. Condição que nunca bate exatamente**

```python
x = 0.0
while x != 1.0:
    x += 0.1    # por causa dos decimais binários, x passa por 0.9999999 e nunca é exatamente 1.0
```

Com `float`, use `<` ou `<=` em vez de `!=`.

**4. `continue` antes da atualização** (o caso que vimos acima).

Checklist para prevenir:

- Antes de escrever o `while`, pergunte: "o que faz esta condição ficar falsa?". Se não souber responder, o laço está errado.
- Prefira `<` e `<=` a `!=` quando a variável é numérica.
- Se usar `while True`, garanta que existe um `break` e que ele é alcançado.
- Em programas que processam dados externos, considere um **limite de segurança**: um contador que força a saída após N voltas.

```python
saldo = 1000
voltas = 0
while saldo > 0 and voltas < 1000:
    saldo -= 0   # bug proposital: saldo nunca muda
    voltas += 1
print("Saiu pelo limite de segurança" if voltas == 1000 else "Saiu normalmente")
```

Saída:

```
Saiu pelo limite de segurança
```

O limite não corrige o bug, mas impede que o programa trave e deixa o problema visível.

## `while` com `else`

Pouco conhecido: o `while` pode ter um `else`, que roda **só se o laço terminou sem `break`**. Serve para "procurou e não achou":

```python
notas = [1200, 850, 300]
i = 0
while i < len(notas):
    if notas[i] > 10000:
        print("Achou nota grande")
        break
    i += 1
else:
    print("Nenhuma nota acima de 10 mil")
```

Saída:

```
Nenhuma nota acima de 10 mil
```

Você verá que o `for` (próxima lição) é geralmente a escolha melhor para percorrer listas. O `while` brilha quando o número de repetições **depende do que acontece durante o laço**.

## Na prática

No escritório, o `while` aparece em simulações ("em quantos meses esse parcelamento termina?", "em quantos anos a aplicação dobra?") e em rotinas que repetem até não sobrar pendência: reprocessar um lote enquanto houver linhas com erro, tentar de novo uma consulta que falhou até três vezes. Em todos esses casos, o limite de segurança (`and tentativas < 3`) é o que impede que um dado inesperado trave o script no meio do fechamento.

## Erros comuns

- **Esquecer os dois-pontos** depois da condição: `while x < 5` sem `:` é `SyntaxError`.
- **Esquecer de inicializar** a variável antes do laço: `NameError` na primeira avaliação da condição.
- **Esquecer a atualização** ou colocá-la depois de um `continue`: laço infinito.
- **Comparar float com `!=`**: pode nunca bater. Use `<`/`<=`.
- **Indentar errado** a atualização, deixando-a fora do bloco: o laço roda uma vez para sempre.
- **Usar `break` achando que termina o programa**: ele só sai do laço mais interno; o código depois continua.

## Resumo

- `while condição:` repete o bloco enquanto a condição for verdadeira; precisa de inicialização, condição e atualização.
- Contador (`n += 1`) conta voltas; acumulador (`total += valor`) soma valores. Juntos resolvem a maioria dos relatórios.
- `break` sai do laço na hora; `continue` pula o resto da volta atual. Com `continue`, atualize a variável **antes**.
- `while True` + `break` é um padrão válido para "repetir até acontecer algo".
- Laço infinito acontece quando a condição nunca fica falsa; pressione `Ctrl + C` para parar, e previna com atualização correta, comparações `<`/`<=` e, se necessário, um limite de segurança.
