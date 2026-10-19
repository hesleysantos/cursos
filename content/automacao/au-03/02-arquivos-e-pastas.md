Nesta lição você vai aprender a manipular arquivos e pastas com Python: listar, criar, mover, renomear e copiar, usando `pathlib` e `shutil`. Vai definir um padrão de nome para documentos (`cliente_competencia_tipo`) e montar o primeiro robô útil do módulo: um organizador que pega tudo que caiu na pasta Downloads e guarda na pasta do cliente certo. Isso importa porque boa parte do tempo perdido num escritório é procurar arquivo, e quase todo robô começa ou termina mexendo em pastas.

## Caminhos com pathlib

No curso de Python você usou `open()` e talvez `os.path`. A biblioteca padrão tem uma forma mais limpa de trabalhar com caminhos: `pathlib.Path`. Um `Path` é um objeto que representa um arquivo ou pasta, com métodos para tudo que você precisa.

```python
from pathlib import Path

downloads = Path.home() / "Downloads"       # a barra junta pedaços do caminho
arquivo = downloads / "das_padaria_2026-03.pdf"

print(arquivo.name)     # das_padaria_2026-03.pdf
print(arquivo.stem)     # das_padaria_2026-03  (nome sem extensão)
print(arquivo.suffix)   # .pdf
print(arquivo.parent)   # ...\Downloads
print(arquivo.exists()) # True ou False
```

A barra `/` entre `Path` e texto monta o caminho com o separador correto do sistema. Você não precisa se preocupar se é `\` no Windows ou `/` no Linux. Para caminhos fixos no Windows, use string "crua" com `r` para a barra invertida não virar caractere especial: `Path(r"C:\clientes\padaria")`.

## Listar e filtrar

```python
from pathlib import Path

pasta = Path.home() / "Downloads"
for item in pasta.iterdir():            # tudo que está na pasta, sem entrar nas subpastas
    tipo = "pasta" if item.is_dir() else "arquivo"
    print(tipo, item.name)

pdfs = sorted(pasta.glob("*.pdf"))      # só os PDFs
todos_xlsx = list(pasta.rglob("*.xlsx"))  # rglob entra em todas as subpastas
```

`glob` aceita curingas: `*.pdf` (todos os PDFs), `das_*.pdf` (começa com das_), `*2026-03*` (contém a competência). `rglob` faz o mesmo de forma recursiva.

## Criar, renomear, mover, copiar, apagar

```python
from pathlib import Path
import shutil

destino = Path("clientes") / "padaria-central" / "2026-03"
destino.mkdir(parents=True, exist_ok=True)  # cria a cadeia inteira; não reclama se já existe

origem = Path("Downloads") / "guia.pdf"
if origem.exists():
    novo = destino / "padaria-central_2026-03_das.pdf"
    shutil.move(origem, novo)               # move (funciona entre discos diferentes)
    shutil.copy2(novo, destino / "copia.pdf")  # copia preservando a data de modificação
    (destino / "copia.pdf").unlink()        # apaga o arquivo
```

`Path.rename()` também renomeia e move, mas falha se origem e destino estiverem em discos diferentes (C: e um pendrive, por exemplo). `shutil.move` resolve os dois casos, por isso é a escolha segura. `shutil.copytree` copia uma pasta inteira e `shutil.rmtree` apaga uma pasta com tudo dentro; use este último com muito cuidado.

> **Atenção:** `unlink()` e `rmtree()` não mandam para a Lixeira. Teste sempre com cópias antes de apontar para a pasta real.

## Um padrão de nome que o robô entende

Arquivo com nome bagunçado é arquivo perdido. Defina um padrão e siga em tudo que o escritório gera:

```
cliente_competencia_tipo.extensao
padaria-central_2026-03_das.pdf
mercado-bom-preco_2026-03_folha.xlsx
```

Regras simples: cliente em minúsculas com hífen no lugar de espaço, competência no formato `AAAA-MM` (ordena corretamente em qualquer lista) e tipo curto. Com esse padrão, o robô "lê" o nome do arquivo apenas separando pelo sublinhado:

```python
def interpretar_nome(nome):
    """'padaria-central_2026-03_das.pdf' -> dict com cliente, competencia, tipo"""
    base = nome.rsplit(".", 1)[0]           # tira a extensão
    partes = base.split("_")
    if len(partes) != 3:
        return None                         # fora do padrão
    cliente, competencia, tipo = partes
    return {"cliente": cliente, "competencia": competencia, "tipo": tipo}

print(interpretar_nome("padaria-central_2026-03_das.pdf"))
print(interpretar_nome("foto da festa.jpg"))
```

Saída:

```
{'cliente': 'padaria-central', 'competencia': '2026-03', 'tipo': 'das'}
None
```

Quando o arquivo vem de fora (portal, cliente), o nome não segue o padrão. Aí você renomeia na chegada: o robô descobre o cliente por uma lista de palavras-chave ou pelo CNPJ no conteúdo, e grava o arquivo já com o nome certo.

## Robô 1: organizar a pasta Downloads por cliente

```python
from pathlib import Path
import shutil

CLIENTES = {               # palavra no nome do arquivo -> pasta do cliente
    "padaria": "padaria-central",
    "mercado": "mercado-bom-preco",
    "oficina": "oficina-do-ze",
}

def organizar(downloads, raiz_clientes):
    movidos = []
    for arquivo in downloads.iterdir():
        if not arquivo.is_file():
            continue
        nome = arquivo.name.lower()
        for chave, pasta_cliente in CLIENTES.items():
            if chave in nome:
                destino = raiz_clientes / pasta_cliente / "entrada"
                destino.mkdir(parents=True, exist_ok=True)
                shutil.move(arquivo, destino / arquivo.name)
                movidos.append((arquivo.name, pasta_cliente))
                break
    return movidos

if __name__ == "__main__":
    import tempfile
    base = Path(tempfile.mkdtemp())          # pasta temporária só para testar
    (base / "down").mkdir()
    (base / "down" / "DAS Padaria 03-2026.pdf").write_text("teste")
    (base / "down" / "notas.txt").write_text("teste")
    print(organizar(base / "down", base / "clientes"))
```

Saída:

```
[('DAS Padaria 03-2026.pdf', 'padaria-central')]
```

O arquivo `notas.txt` não casou com nenhuma palavra-chave e ficou onde estava, o que é o comportamento certo: o robô só mexe no que tem certeza. O bloco `if __name__ == "__main__":` roda o teste numa pasta temporária; na vida real você troca por `organizar(Path.home() / "Downloads", Path(r"C:\clientes"))`.

## Erros comuns

- Esquecer o `r` em `"C:\novo\teste"`: o `\n` vira quebra de linha e o `\t` vira tabulação.
- Mover um arquivo para uma pasta que não existe: crie antes com `mkdir(parents=True, exist_ok=True)`.
- Sobrescrever silenciosamente: `shutil.move` substitui o destino se ele já existir. Confira `destino.exists()` antes quando isso importa.
- Rodar o robô enquanto o navegador ainda está baixando: o arquivo aparece como `.crdownload` ou `.part`. Ignore essas extensões.

## Na prática

Ligue esse organizador ao agendador (lição 8) para rodar a cada 10 minutos, e a pasta Downloads do escritório deixa de ser um depósito. Combine com o padrão de nome e qualquer colega encontra o DAS de março da padaria em dois cliques, sem perguntar para ninguém.

## Resumo

- `Path` representa arquivos e pastas; `/` monta caminhos; `.name`, `.stem`, `.suffix`, `.parent` decompõem.
- `iterdir()`, `glob()` e `rglob()` listam; `mkdir(parents=True, exist_ok=True)` cria sem erro.
- `shutil.move` e `shutil.copy2` movem e copiam com segurança; `unlink()` apaga sem Lixeira.
- Padrão `cliente_competencia_tipo` torna o nome legível para pessoas e para o robô.
- Teste em pasta temporária antes de apontar para a pasta real.
