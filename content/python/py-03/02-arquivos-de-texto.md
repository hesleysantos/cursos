# Arquivos de texto

Até agora, tudo o que seus programas calculavam desaparecia ao fechar o Python. Nesta lição você vai aprender a **gravar** e **ler** arquivos de texto, o passo que transforma um script de brincadeira em uma ferramenta de trabalho: salvar um relatório, ler um extrato exportado do banco, registrar um log de execução. Também vai conhecer o `pathlib`, a forma moderna de lidar com caminhos de arquivos.

## Por que arquivos?

Memória RAM é temporária; disco é permanente. Quase tudo no escritório chega ou sai em forma de arquivo: o extrato vem em `.txt` ou `.csv`, a folha sai em `.txt` para importar no sistema, o relatório final vai em `.txt` ou `.md`. Saber ler e escrever arquivos é o que permite ao Python conversar com os outros programas que você usa.

## Abrindo um arquivo com `open()`

Os exemplos desta lição gravam na pasta `/tmp`, que existe no Linux, no macOS e no Python do navegador; no Windows, troque por uma pasta sua (por exemplo `C:/temp/relatorio.txt`).

```python
arquivo = open("/tmp/relatorio.txt", "w", encoding="utf-8")
arquivo.write("Relatório de fechamento\n")
arquivo.write("Receita: R$ 125.000,00\n")
arquivo.close()
```

`open()` recebe o **caminho**, o **modo** e o **encoding**, e devolve um objeto arquivo. Três detalhes importam:

1. `write()` **não** adiciona quebra de linha: você precisa escrever o `\n`.
2. O arquivo precisa ser **fechado** com `close()`; só então o sistema operacional garante que tudo foi gravado.
3. Se der erro entre `open()` e `close()`, o arquivo fica aberto. Por isso existe o `with`.

## `with`: fechamento automático

```python
with open("/tmp/relatorio.txt", "w", encoding="utf-8") as arq:
    arq.write("Relatório de fechamento\n")
    arq.write("Receita: R$ 125.000,00\n")
# Ao sair do bloco, arq.close() é chamado automaticamente, mesmo se houver erro
```

O `with` cria um **gerenciador de contexto**: ao entrar, abre o arquivo; ao sair (normalmente ou por exceção), fecha. É a forma recomendada em praticamente 100% dos casos. Se você só se lembrar de uma coisa desta lição, que seja esta: **sempre use `with`**.

## Os modos de abertura

| Modo | Significado | Se o arquivo existe | Se não existe |
|------|-------------|---------------------|---------------|
| `"r"` | leitura (padrão) | lê | erro `FileNotFoundError` |
| `"w"` | escrita | **apaga tudo** e reescreve | cria |
| `"a"` | append (acrescentar) | escreve no fim | cria |
| `"x"` | criação exclusiva | erro `FileExistsError` | cria |
| `"r+"` | leitura e escrita | lê e escreve | erro |

Adicione `b` (`"rb"`, `"wb"`) para arquivos binários (PDF, imagens, planilhas `.xlsx`), nos quais não há encoding nem linhas.

> **Atenção:** o modo `"w"` é destrutivo. Abrir `folha_marco.txt` com `"w"` por engano zera o arquivo instantaneamente, antes mesmo de você escrever algo. Para adicionar linhas a um log, use `"a"`.

```python
# Registro de execução que cresce a cada rodada
with open("/tmp/log.txt", "a", encoding="utf-8") as log:
    log.write("10/03/2026 09:15 - Importação concluída: 340 lançamentos\n")
```

## Encoding: por que `utf-8`?

Um arquivo de texto é, no fundo, uma sequência de bytes. O **encoding** diz como transformar bytes em letras. `utf-8` é o padrão da web e do Linux/macOS e representa qualquer caractere (ç, ã, €, emojis). O Windows, por tradição, às vezes usa `cp1252` (chamado de "ANSI" nos programas da Microsoft; é um parente próximo do `latin-1`, com alguns símbolos a mais), e aí surgem os famosos `Ã§` e `Ã£` no lugar de `ç` e `ã` quando um arquivo é lido com o encoding errado.

Regra prática: **sempre passe `encoding="utf-8"` explicitamente**, tanto ao escrever quanto ao ler. Se receber um arquivo de um sistema antigo que vem em `latin-1` ou `cp1252` (comum em arquivos de bancos e do governo), especifique esse encoding na leitura.

```python
# Arquivo exportado por um sistema legado
with open("/tmp/extrato_banco.txt", encoding="latin-1") as f:
    conteudo = f.read()
```

Se você errar o encoding, o Python lança `UnicodeDecodeError` ou, pior, lê caracteres trocados sem avisar.

## Lendo arquivos

Há três maneiras de ler, e a escolha depende do tamanho do arquivo.

```python
with open("/tmp/relatorio.txt", encoding="utf-8") as f:
    tudo = f.read()           # uma string com o arquivo inteiro
print(tudo)

with open("/tmp/relatorio.txt", encoding="utf-8") as f:
    linhas = f.readlines()    # lista de strings, cada uma com '\n' no fim
print(len(linhas))            # 2

with open("/tmp/relatorio.txt", encoding="utf-8") as f:
    for linha in f:           # linha a linha, sem carregar tudo na memória
        print(linha.rstrip("\n"))
```

A terceira forma é a mais importante. Um extrato bancário de dez anos pode ter milhões de linhas; `read()` carregaria tudo na RAM de uma vez, enquanto o `for` lê uma linha, processa, descarta e vai para a próxima. Repare no `rstrip("\n")`: cada linha lida vem com a quebra de linha no final, e se você der `print` direto vai ver linhas em branco duplicadas.

### Exemplo: somando valores de um arquivo

Imagine `/tmp/lancamentos.txt` com uma linha por lançamento, no formato `descricao;valor`:

```python
conteudo = """Aluguel;3500.00
Energia;820.45
Internet;199.90
"""
with open("/tmp/lancamentos.txt", "w", encoding="utf-8") as f:
    f.write(conteudo)

total = 0.0
with open("/tmp/lancamentos.txt", encoding="utf-8") as f:
    for linha in f:
        linha = linha.strip()
        if not linha:            # pula linhas vazias
            continue
        descricao, valor = linha.split(";")
        total += float(valor)

print(f"Total de despesas: R$ {total:.2f}")   # Total de despesas: R$ 4520.35
```

Nos arquivos reais, o separador decimal pode ser vírgula (`820,45`). Nesse caso, converta com `float(valor.replace(",", "."))`. No próximo capítulo o módulo `csv` vai cuidar da separação de colunas de forma mais robusta.

## `pathlib`: caminhos como objetos

Montar caminhos colando strings (`pasta + "/" + nome`) quebra entre Windows (`\`) e Linux (`/`). O módulo `pathlib` resolve isso com a classe `Path`:

```python
from pathlib import Path

base = Path("/tmp")
arquivo = base / "fechamento" / "marco.txt"   # o operador / junta caminhos
print(arquivo)             # /tmp/fechamento/marco.txt  (ou com \ no Windows)
print(arquivo.name)        # marco.txt
print(arquivo.stem)        # marco
print(arquivo.suffix)      # .txt
print(arquivo.parent)      # /tmp/fechamento

arquivo.parent.mkdir(parents=True, exist_ok=True)   # cria as pastas se não existirem
arquivo.write_text("Fechamento de março\n", encoding="utf-8")
print(arquivo.exists())    # True
print(arquivo.read_text(encoding="utf-8"))          # Fechamento de março
```

`write_text` e `read_text` são atalhos para arquivos pequenos: abrem, escrevem/leem e fecham em uma linha. Para listar arquivos, `Path("/tmp").glob("*.txt")` devolve todos os `.txt` da pasta. Veremos `pathlib` completo no módulo 4.

## Erros comuns

- **Esquecer o `\n`** em `write()` e descobrir que todas as linhas ficaram grudadas numa só.
- **Usar `"w"` quando queria `"a"`** e perder o conteúdo anterior do arquivo.
- **Não especificar `encoding`** e ter acentos corrompidos ao abrir o arquivo em outra máquina.
- **Não usar `with`** e, em um script que grava e lê o mesmo arquivo em sequência, ler um arquivo ainda vazio porque o buffer não foi gravado no disco.
- **Comparar linhas sem `strip()`**: `if linha == "FIM":` nunca é verdadeiro porque a linha lida é `"FIM\n"`.
- **`FileNotFoundError`** por caminho relativo: o Python procura a partir da pasta onde o terminal está, não da pasta do script. Use caminhos absolutos ou `Path(__file__).parent`.

## Na prática

O caso típico é o arquivo exportado por outro sistema: o extrato em `.txt` que o banco gera, o lote de folha que o sistema de RH importa. O roteiro é sempre o mesmo: abrir com `with` e o encoding certo, percorrer linha a linha, limpar com `strip()` e gravar o resultado em outro arquivo, nunca por cima do original.

## Resumo

- `open(caminho, modo, encoding="utf-8")` abre um arquivo; use **sempre** dentro de `with` para fechamento garantido.
- Modos: `"r"` lê, `"w"` sobrescreve, `"a"` acrescenta, `"x"` cria sem sobrescrever; `b` para binário.
- Prefira `for linha in arquivo:` para ler linha a linha sem estourar a memória; limpe com `strip()`.
- Declare `encoding="utf-8"` explicitamente; use `latin-1` para arquivos de sistemas legados.
- `pathlib.Path` monta caminhos com `/`, cria pastas, lê e grava textos curtos e funciona igual em qualquer sistema operacional.
