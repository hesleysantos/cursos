Nesta lição você vai aprender a trabalhar com texto em Python: acessar letras por posição, recortar pedaços (fatiamento), usar os métodos mais úteis (`upper`, `lower`, `strip`, `split`, `replace`, `find`, `startswith`), medir com `len()`, juntar textos e, principalmente, montar mensagens bem formatadas com f-strings. Boa parte do trabalho com dados contábeis é tratar texto: nomes de clientes, números de nota, CNPJ, descrições de lançamento.

## Strings são sequências

Uma string é uma sequência de caracteres. Cada caractere tem uma **posição** (índice), e a contagem **começa em zero**:

```
texto:   N  O  T  A  -  1  2  3
índice:  0  1  2  3  4  5  6  7
```

Para acessar um caractere, use colchetes:

```python
codigo = "NOTA-123"
print(codigo[0])
print(codigo[5])
print(codigo[-1])   # índice negativo conta do fim
print(codigo[-3])
```

Saída:

```
N
1
3
1
```

O índice `-1` é o último caractere, `-2` o penúltimo, e assim por diante. Isso é muito prático para pegar o dígito final de um código sem saber o tamanho.

### `len()` mede o tamanho

```python
cnpj = "12.345.678/0001-90"
print(len(cnpj))
print(len(""))
```

Saída:

```
18
0
```

Um CNPJ formatado tem sempre 18 caracteres; um CPF formatado, 14. Verificar `len()` é uma validação rápida e barata.

## Fatiamento: recortando pedaços

A sintaxe é `texto[inicio:fim]`. O caractere na posição `inicio` **entra**; o da posição `fim` **não entra**. Pense como "do índice 0 até antes do 2".

```python
nf = "NFE-2026-000123"
print(nf[0:3])     # posições 0, 1, 2
print(nf[4:8])     # o ano
print(nf[9:])      # da posição 9 até o fim
print(nf[:3])      # do começo até antes da 3
print(nf[-6:])     # os 6 últimos
```

Saída:

```
NFE
2026
000123
NFE
000123
```

Omitir o início significa "desde o começo"; omitir o fim significa "até o final". A regra "fim não entra" parece estranha no começo, mas tem uma vantagem: `texto[:n]` tem exatamente `n` caracteres, e `texto[:n] + texto[n:]` reconstrói o texto original sem sobrepor nada.

Um uso real: separar competência `"10/2026"` em mês e ano.

```python
competencia = "10/2026"
mes = competencia[:2]
ano = competencia[3:]
print(mes, ano)
```

Saída:

```
10 2026
```

## Métodos de string

Métodos são ações que o próprio valor sabe executar, chamados com ponto: `texto.metodo()`. Strings são **imutáveis**: nenhum método altera o original — todos devolvem uma string nova. Se quiser guardar o resultado, atribua a uma variável.

### `upper()`, `lower()`

```python
nome = "Maria da Silva"
print(nome.upper())
print(nome.lower())
print(nome)   # o original não mudou
```

Saída:

```
MARIA DA SILVA
maria da silva
Maria da Silva
```

Útil para comparar sem se importar com maiúsculas: `nome.lower() == "maria da silva"`.

### `strip()`

Remove espaços (e quebras de linha) do início e do fim. Essencial ao ler dados de planilhas e arquivos, que vêm cheios de espaços perdidos:

```python
campo = "   12.345.678/0001-90   "
print("[" + campo + "]")
print("[" + campo.strip() + "]")
```

Saída:

```
[   12.345.678/0001-90   ]
[12.345.678/0001-90]
```

Existem também `lstrip()` (só esquerda) e `rstrip()` (só direita).

### `replace(antigo, novo)`

Troca todas as ocorrências:

```python
cnpj = "12.345.678/0001-90"
so_digitos = cnpj.replace(".", "").replace("/", "").replace("-", "")
print(so_digitos)

valor_br = "1.250,90"
valor_py = valor_br.replace(".", "").replace(",", ".")
print(valor_py)
```

Saída:

```
12345678000190
1250.90
```

O segundo exemplo é um clássico brasileiro: converter "1.250,90" para o formato que o Python entende. Note que removemos o ponto de milhar **antes** de trocar a vírgula por ponto, senão ficaria `1.250.90`.

### `split(separador)`

Divide o texto em uma **lista** de pedaços. Você verá listas em detalhe no próximo módulo, mas já dá para usar:

```python
linha = "001;Maria Silva;3500.00;Analista"
campos = linha.split(";")
print(campos)
print(campos[1])
print(campos[2])
```

Saída:

```
['001', 'Maria Silva', '3500.00', 'Analista']
Maria Silva
3500.00
```

Sem argumento, `split()` separa por qualquer espaço em branco: `"a  b   c".split()` dá `['a', 'b', 'c']`.

### `find(trecho)`

Devolve a posição onde o trecho começa, ou `-1` se não existir:

```python
historico = "Pagamento fornecedor NF 4521"
print(historico.find("NF"))
print(historico.find("boleto"))
```

Saída:

```
21
-1
```

Para só saber **se** existe, o operador `in` é mais legível: `"NF" in historico` dá `True`.

### `startswith()`, `endswith()`

```python
arquivo = "SPED_FISCAL_102026.txt"
print(arquivo.startswith("SPED"))
print(arquivo.endswith(".txt"))
print(arquivo.endswith(".xlsx"))
```

Saída:

```
True
True
False
```

### Outros que valem conhecer

```python
print("maria silva".title())        # Maria Silva
print("abc".isdigit())              # False
print("123".isdigit())              # True
print("nota".count("a"))            # 1
print("7".zfill(3))                 # 007 — completa com zeros à esquerda
```

## Concatenação e repetição

O `+` entre strings **junta**; o `*` repete:

```python
nome = "Maria"
sobrenome = "Silva"
print(nome + " " + sobrenome)
print("-" * 30)
```

Saída:

```
Maria Silva
------------------------------
```

Mas atenção: `+` entre string e número **não funciona**:

```python
total = 1500
print("Total: " + total)   # TypeError
```

Esse `TypeError: can only concatenate str (not "int") to str` é um dos erros mais frequentes de iniciantes. A solução antiga é `str(total)`; a solução moderna é a f-string.

## f-strings: a forma certa de montar texto

Coloque `f` antes das aspas e escreva variáveis ou expressões entre chaves `{}`:

```python
nome = "Maria"
salario = 3500
print(f"Funcionária: {nome}, salário: {salario}")
print(f"Com reajuste de 5%: {salario * 1.05}")
```

Saída:

```
Funcionária: Maria, salário: 3500
Com reajuste de 5%: 3675.0
```

Dentro das chaves pode ir qualquer expressão: conta, chamada de método, acesso a índice.

### Formatação: `:.2f`

Depois do valor, dois-pontos e uma especificação de formato. `.2f` significa "número decimal com 2 casas":

```python
iss = 119.3665
print(f"ISS: {iss:.2f}")
print(f"ISS: {iss:.0f}")
total = 1500
print(f"Total: {total:.2f}")   # inteiro também ganha casas
```

Saída:

```
ISS: 119.37
ISS: 119
Total: 1500.00
```

Essa é a forma recomendada de exibir dinheiro. O `round()` serve para o cálculo; `:.2f` serve para a exibição.

### Alinhamento: `:>10`, `:<10`, `:^10`

O número é a largura mínima; `>` alinha à direita, `<` à esquerda, `^` centraliza. Isso monta relatórios em colunas:

```python
print(f"{'Conta':<15}{'Valor':>12}")
print(f"{'Receitas':<15}{45000:>12.2f}")
print(f"{'Despesas':<15}{31200.5:>12.2f}")
print(f"{'Resultado':<15}{45000 - 31200.5:>12.2f}")
```

Saída:

```
Conta                 Valor
Receitas           45000.00
Despesas           31200.50
Resultado          13799.50
```

Repare em `{45000:>12.2f}`: largura 12, alinhado à direita, duas casas. Pode combinar tudo.

### Separador de milhar: `:,`

```python
faturamento = 1250000.5
print(f"{faturamento:,.2f}")
```

Saída:

```
1,250,000.50
```

O Python usa o padrão americano (vírgula de milhar, ponto decimal). Para o formato brasileiro, um truque comum é formatar e depois trocar: `f"{v:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")`. A biblioteca padrão também tem o módulo `locale`, que formata conforme o idioma configurado no sistema, mas o truque acima funciona em qualquer máquina.

### Percentual: `:.1%`

```python
margem = 0.3067
print(f"Margem: {margem:.1%}")
```

Saída:

```
Margem: 30.7%
```

O `%` multiplica por 100 e coloca o símbolo automaticamente.

## Na prática

Dados exportados de sistemas contábeis chegam "sujos": CNPJ com pontuação, valor com vírgula, espaços nas bordas, nome em caixa alta. A sequência `strip()` → `replace()` → conversão é o que você vai escrever antes de qualquer conta. E, na saída, as f-strings com largura (`:<15`, `:>12.2f`) montam relatórios em colunas que cabem num e-mail ou num `.txt`, sem precisar de planilha.

## Erros comuns

- **Índice fora do alcance**: `"abc"[3]` gera `IndexError`, porque as posições são 0, 1 e 2.
- **Esquecer que métodos não alteram o original**: `nome.upper()` sozinho não faz nada visível; use `nome = nome.upper()`.
- **Somar string com número**: `"Total: " + 100` dá `TypeError`. Use f-string.
- **Esquecer o `f`** antes das aspas: `"Total: {total}"` imprime as chaves literalmente.
- **Confundir `find` com `in`**: `find` devolve posição (e `0` é uma posição válida!); `in` devolve `True`/`False`.
- **Trocar vírgula por ponto sem remover o milhar**: `"1.250,90".replace(",", ".")` dá `"1.250.90"`, que não é número.

## Resumo

- Strings são sequências indexadas a partir de 0; índices negativos contam do fim; `len()` mede o tamanho.
- Fatiamento `texto[inicio:fim]` inclui o início e exclui o fim; omita um lado para ir até a borda.
- Métodos (`upper`, `lower`, `strip`, `replace`, `split`, `find`, `startswith`) devolvem strings novas — o original não muda.
- `+` junta strings, mas não string com número; use f-strings: `f"Total: {valor}"`.
- Formatos nas f-strings: `:.2f` para duas casas, `:>10` para alinhar em colunas, `:,` para milhar, `:.1%` para percentual.
