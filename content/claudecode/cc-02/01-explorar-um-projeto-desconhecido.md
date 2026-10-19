Nesta lição você vai aprender a usar o Claude Code para entender um projeto que você não escreveu (ou escreveu e esqueceu): pedir um mapa do código, explicar um arquivo ou função, localizar onde algo acontece, apontar arquivos com `@` e colar erros e saídas para diagnóstico. É a habilidade que transforma "herdei um script do estagiário que saiu" em "em 15 minutos sei o que ele faz".

## Comece largo, depois afunile

A documentação recomenda exatamente isso: "comece com perguntas amplas e depois vá para áreas específicas". Abra o Claude Code na raiz do projeto e peça:

```text
me dê uma visão geral deste projeto: o que ele faz, como está organizado e por onde ele começa a executar
```

Ele vai listar pastas, ler os arquivos principais e responder com um mapa. Perguntas seguintes que a documentação sugere: "quais padrões de arquitetura são usados aqui?", "quais são os principais modelos de dados?", "quais convenções de código o projeto segue?". Uma dica oficial útil para projetos de escritório cheios de jargão: **peça um glossário** dos termos específicos ("o que são `lote`, `competência` e `remessa` neste código?").

## Explicar um arquivo ou uma função

Para um arquivo inteiro:

```text
explique conciliacao.py: o que cada função faz, em que ordem são chamadas e o que entra e sai
```

Para uma função, seja ainda mais direto e peça o que você não consegue ver de relance:

```text
na função casar_lancamentos, quais regras decidem que dois lançamentos "batem"? liste as regras e os casos que ela ignora (datas diferentes, valores com centavos de diferença, duplicados)
```

A documentação diz que você pode fazer "as mesmas perguntas que faria a um engenheiro sênior": "como funciona o log aqui?", "por que este código chama `foo()` em vez de `bar()` na linha 333?". Nenhum truque de prompt é necessário.

## Encontrar onde algo acontece

Em vez de abrir arquivo por arquivo, pergunte pelo comportamento:

```text
onde o script decide em qual pasta salvar o relatório? me aponte arquivo e linha
```

```text
encontre todos os lugares que leem a variável de ambiente CAMINHO_PLANILHAS
```

Ele usa as ferramentas de busca (`Grep`, `Glob`) e devolve caminhos e linhas. A documentação recomenda usar a **linguagem do próprio projeto** nas perguntas e ser específico sobre o que procura. Se o projeto é grande, delimite ("só na pasta `src/fiscal`") ou peça um subagente ("use um subagente para investigar…"), que explora em contexto separado e devolve só o resumo.

## Referenciar arquivos com `@`

Para incluir um arquivo na conversa sem esperar que ele o procure, use `@` seguido do caminho:

```text
explique a lógica em @src/fiscal/competencia.py
```

Detalhes confirmados na documentação:

- Ao digitar `@`, abre um **menu de sugestão de caminhos**; use Enter ou Tab para aceitar o caminho e Enter de novo para enviar.
- Caminhos podem ser relativos ou absolutos; você pode citar vários arquivos na mesma mensagem (`@a.py e @b.py`).
- `@pasta/` inclui a **listagem** da pasta, não o conteúdo dos arquivos.
- O conteúdo do arquivo entra quando cabe no limite da ferramenta de leitura; arquivos de texto maiores que 256 KB não são incluídos.
- Referenciar um arquivo também traz o `CLAUDE.md` da pasta dele e das pastas acima.

> **Dica:** no VS Code, selecionar linhas e pressionar Alt+K insere a referência com o intervalo de linhas (por exemplo `@app.py#5-10`), como veremos na lição 8.

## Colar erros e saídas

Quando um script quebra, não descreva o erro de memória: cole. A documentação orienta a "dizer ao Claude o comando que reproduz o problema e colar o traceback", informar os passos para reproduzir e se o erro é intermitente. Exemplo:

```text
rodei python gerar_guias.py e recebi o erro abaixo. encontre a causa raiz e explique antes de corrigir.

Traceback (most recent call last):
  File "gerar_guias.py", line 42, in <module>
    valor = float(linha["valor"])
ValueError: could not convert string to float: '1.234,56'
```

Dois caminhos ainda mais diretos:

- **Modo shell**: comece a mensagem com `!` para rodar um comando você mesmo e colocar a saída na conversa (`!python gerar_guias.py`). Ele vê o resultado e responde.
- **Imagens**: uma captura de tela de erro pode ser colada com Ctrl+V (no Windows e WSL, Alt+V também) ou arrastada para a janela; lição 7.

Colar saídas longas é normal: acima de algumas linhas, o terminal recolhe o texto colado em um marcador como `[Pasted text #1 +120 lines]`, mas o conteúdo entra inteiro no contexto. Se a saída tem milhares de linhas, cole só o trecho relevante ou peça para ele filtrar ("rode e mostre só as linhas com ERROR").

## Erros comuns

- **Perguntar "o que tem de errado?" sem mostrar o erro**: ele vai adivinhar.
- **Investigar sem escopo** num projeto grande: enche o contexto. Delimite a pasta ou use um subagente.
- **Confundir `@pasta/` com o conteúdo**: a pasta traz a lista de arquivos; para o conteúdo, cite os arquivos.
- **Pedir explicação e mudança na mesma mensagem**: "explique e corrija" vira uma edição antes de você entender. Separe.
- **Colar dados reais de clientes** junto com o erro: anonimize o trecho.

## Na prática

Você recebeu a pasta `fechamento-mensal` do colega que saiu. Em modo plan (para garantir que nada muda), abra o Claude Code ali e, nesta ordem: visão geral → glossário dos termos → "qual arquivo gera o relatório final?" → `@relatorio.py` com "explique função por função" → `!python relatorio.py --ajuda` para ver a saída real → "quais riscos você vê?". Em meia hora você tem um documento mental do projeto, sem ter tocado em nada.

## Resumo

- Comece com visão geral e glossário; depois afunile em arquivos e funções.
- Pergunte pelo comportamento ("onde ele decide…") e deixe as ferramentas de busca trabalharem; delimite o escopo em projetos grandes.
- `@caminho` inclui um arquivo (Tab/Enter aceita a sugestão); `@pasta/` traz a listagem.
- Cole o traceback completo e o comando que o gerou; `!comando` roda e traz a saída.
- Explore em modo plan quando o objetivo é só entender.
