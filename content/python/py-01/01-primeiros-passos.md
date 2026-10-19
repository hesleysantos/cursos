Nesta lição você vai entender o que significa programar, por que o Python é uma boa primeira linguagem, como instalar o Python e o VS Code no Windows, como abrir o terminal, como usar o modo interativo (aquele `>>>`) e como mostrar algo na tela com `print()`. Ao final, você já terá escrito e executado seu primeiro programa.

## O que é programar?

Programar é **escrever instruções que o computador consegue seguir**. Pense num procedimento do escritório: "pegue a nota fiscal, confira o CNPJ, some os valores, lance no sistema". Um ser humano entende isso com folga, mesmo que a ordem fique meio bagunçada. O computador não: ele precisa de cada passo escrito de forma exata, na ordem certa, numa linguagem que ele reconheça.

Essa linguagem é a **linguagem de programação**. Existem centenas delas. Python é uma das mais usadas no mundo, especialmente para automatizar tarefas, tratar planilhas, gerar relatórios e analisar dados — exatamente o tipo de trabalho que aparece todo dia em um escritório de contabilidade.

Por que Python para quem nunca programou?

- A sintaxe parece inglês simples. `print("Olá")` mostra "Olá" na tela. Não há símbolos estranhos espalhados.
- Você vê resultado imediato: escreve uma linha, aperta Enter, aparece a resposta.
- Tem biblioteca pronta para quase tudo: ler Excel, PDF, enviar e-mail, consultar sites.
- É gratuito e roda em qualquer computador.

## Como o Python funciona

O Python é um programa (o **interpretador**) que lê o seu texto, linha por linha, e executa cada instrução. Você escreve o código em um arquivo de texto com extensão `.py`, por exemplo `calculo.py`, e pede ao interpretador para rodá-lo. Se tiver um erro de digitação, ele para e avisa em que linha está o problema.

Isso é diferente do Excel, onde a fórmula fica presa na célula. Em Python, as instruções ficam em um arquivo que você pode guardar, reaproveitar, mandar para um colega e rodar quantas vezes quiser.

## Instalando o Python no Windows

1. Acesse `python.org/downloads` e clique no botão amarelo "Download Python 3.14.x" (ou a versão 3 mais recente que aparecer; tudo neste curso funciona do 3.12 em diante).
2. Abra o instalador. **Antes de clicar em Install Now, marque a caixa "Add python.exe to PATH"** na parte de baixo da janela. Esse passo é o que mais gente esquece — sem ele, o Windows não encontra o Python quando você digita `python` no terminal.
3. Clique em "Install Now" e aguarde.

Para conferir se deu certo, abra o terminal (veremos a seguir) e digite:

```
python --version
```

A resposta deve ser algo como `Python 3.14.0` (os números mudam conforme a versão instalada). Se aparecer "python não é reconhecido como um comando", a caixa do PATH não foi marcada. Rode o instalador de novo, escolha "Modify" e marque a opção.

## Instalando o VS Code

O VS Code (Visual Studio Code) é um editor de texto feito para código. É gratuito, da Microsoft, e será o seu "bloco de notas turbinado".

1. Acesse `code.visualstudio.com` e baixe a versão para Windows.
2. Instale com as opções padrão.
3. Abra o VS Code, clique no ícone de extensões na barra lateral (quatro quadradinhos) e instale a extensão **Python** (da Microsoft). Ela colore o código, aponta erros e permite rodar o arquivo com um clique no botão de "play".

> **Dica:** crie uma pasta só para seus estudos, por exemplo `C:\Users\SeuNome\python-curso`. No VS Code, use **Arquivo > Abrir Pasta** e aponte para ela. Todos os arquivos do curso ficarão organizados ali.

## Usando o terminal

O terminal (também chamado de prompt de comando ou console) é uma janela onde você digita comandos em texto, em vez de clicar em ícones. É por ele que você vai rodar seus programas.

Formas de abrir no Windows:

- Pressione `Win + R`, digite `cmd` e Enter; ou
- Clique com o botão direito no menu Iniciar e escolha "Terminal"; ou
- Dentro do VS Code, use **Terminal > Novo Terminal** (atalho `Ctrl + '` no teclado brasileiro ABNT2; em teclados americanos é Ctrl + crase, a tecla à esquerda do 1). Esta é a forma mais prática, porque o terminal já abre dentro da pasta do seu projeto.

Alguns comandos úteis:

```
cd python-curso        -> entra na pasta python-curso
dir                    -> lista os arquivos da pasta atual
python nome.py         -> executa o arquivo nome.py
cls                    -> limpa a tela
```

## O modo interativo: `>>>`

Digite apenas `python` no terminal e aperte Enter. Vai aparecer algo assim:

```
Python 3.14.0 (tags/v3.14.0...) on win32
Type "help", "copyright", "credits" or "license" for more information.
>>>
```

Os três sinais de maior (`>>>`) indicam que o Python está esperando uma instrução. É o **modo interativo**: você digita uma linha, ele executa e mostra o resultado na hora. É perfeito para testar ideias rapidamente, como uma calculadora turbinada.

```python
>>> 2 + 2
4
>>> 1500 * 0.08
120.0
>>> "Bom dia"
'Bom dia'
```

Repare que o modo interativo mostra o valor de qualquer expressão sem você pedir. Isso só acontece ali; em um arquivo `.py`, nada aparece na tela a menos que você use `print()`. (O bloco acima é uma transcrição do modo interativo: as linhas com `>>>` são o que você digita, as outras são as respostas. Não copie os `>>>` para um arquivo.)

Para sair do modo interativo, digite `exit()` e Enter, ou pressione `Ctrl + Z` seguido de Enter.

## A função `print()`

`print()` é a instrução que **escreve algo na tela**. O que vai entre parênteses é o que será mostrado.

```python
print("Olá, mundo!")
```

Saída:

```
Olá, mundo!
```

O texto entre aspas chama-se **string**. As aspas dizem ao Python "isto é texto, não é um comando". Podem ser aspas duplas `"..."` ou simples `'...'`, desde que a de abrir e a de fechar sejam iguais.

Você pode mostrar números e contas diretamente:

```python
print(1250 + 380)
print("Total da nota:", 1250 + 380)
```

Saída:

```
1630
Total da nota: 1630
```

Quando você separa vários itens por vírgula, o `print()` coloca um espaço entre eles automaticamente. Isso é útil para montar mensagens com valores calculados.

Vários `print()` em sequência saem um embaixo do outro:

```python
print("Relatório de fechamento")
print("Receitas: 45000")
print("Despesas: 31200")
print("Resultado:", 45000 - 31200)
```

Saída:

```
Relatório de fechamento
Receitas: 45000
Despesas: 31200
Resultado: 13800
```

## Seu primeiro arquivo `.py`

1. No VS Code, crie um arquivo chamado `ola.py` (Arquivo > Novo Arquivo, depois salve com esse nome).
2. Digite `print("Meu primeiro programa!")` e salve (`Ctrl + S`).
3. Abra o terminal do VS Code e digite `python ola.py`.

Se aparecer `Meu primeiro programa!` na tela, parabéns: você acabou de programar.

## Na prática

No escritório, o terminal é o lugar onde você vai rodar os scripts que leem planilhas, conferem notas e geram relatórios. Crie a pasta `python-curso` hoje e guarde ali tudo o que fizer no curso. Em qualquer máquina nova, o primeiro comando é `python --version`: se ele responde, o resto funciona. E o `print()` será sua lanterna por muito tempo: sempre que um total parecer estranho, imprima o valor e olhe.

## Erros comuns

- **Esquecer as aspas**: `print(Olá)` gera `NameError`, porque sem aspas o Python acha que `Olá` é o nome de uma variável.
- **Esquecer um parêntese**: `print("Olá"` gera `SyntaxError`. Sempre feche o que abriu.
- **Misturar aspas**: `print("Olá')` não funciona. Abra e feche com o mesmo tipo.
- **Escrever `Print` com P maiúsculo**: Python diferencia maiúsculas de minúsculas. É `print`, tudo minúsculo.
- **Digitar `python` e nada acontecer / "não reconhecido"**: o Python não está no PATH. Reinstale marcando a opção.
- **Rodar código de arquivo dentro do modo interativo**: se o terminal mostra `>>>`, você está dentro do Python. Digite `exit()` antes de usar `python ola.py`.

## Resumo

- Programar é escrever instruções exatas, em ordem, numa linguagem que o computador entende. Python é uma linguagem legível e ótima para iniciantes.
- Instale o Python marcando "Add python.exe to PATH" e confira com `python --version`.
- O VS Code com a extensão Python é o editor recomendado; abra o terminal com `Ctrl + '`.
- O modo interativo (`>>>`) executa uma linha por vez e é ótimo para testar; arquivos `.py` rodam com `python nome.py`.
- `print()` escreve na tela; textos vão entre aspas, e vírgulas separam vários itens com espaço.
