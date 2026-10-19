# Linha de comando: argparse, pathlib, os e shutil

Um script que você precisa abrir e editar para mudar a pasta de entrada não é uma ferramenta, é um rascunho. Nesta lição você vai transformar scripts em **programas de linha de comando** (CLI) que recebem argumentos, com `sys.argv` e `argparse`; vai dominar o `pathlib` para navegar em pastas; e vai usar `os` e `shutil` para mover, copiar e apagar arquivos. O projeto da lição é um CLI que organiza uma pasta bagunçada separando os arquivos por extensão.

## Por que linha de comando?

Programas de linha de comando são fáceis de automatizar: podem ser agendados pelo Agendador de Tarefas do Windows, encadeados com outros programas e rodados em servidores sem interface gráfica. Para um escritório, "rodar o fechamento" vira um comando: `python fechamento.py --pasta notas/2026-03 --saida relatorio.csv`.

## `sys.argv`: o jeito cru

```python
# saudacao.py
import sys

print(sys.argv)
# $ python saudacao.py Ana 3
# ['saudacao.py', 'Ana', '3']
```

`sys.argv` é a lista de argumentos digitados, começando pelo nome do script. Tudo chega como **string**. Para scripts com um ou dois argumentos obrigatórios, serve:

```python
import sys

if len(sys.argv) != 3:
    print("Uso: python juros.py VALOR DIAS")
    sys.exit(1)             # código diferente de zero sinaliza erro ao sistema

valor = float(sys.argv[1])
dias = int(sys.argv[2])
print(round(valor * 0.00033 * dias, 2))
```

Mas assim que aparecem opções (`--verbose`), valores padrão e mensagens de ajuda, o código vira um emaranhado de `if`. É aí que entra o `argparse`.

## `argparse`: argumentos profissionais

```python
# juros.py
import argparse

parser = argparse.ArgumentParser(description="Calcula juros de mora simples.")
parser.add_argument("valor", type=float, help="valor original em reais")
parser.add_argument("dias", type=int, help="dias de atraso")
parser.add_argument("--taxa", type=float, default=0.00033, help="taxa diária (padrão: 0.033%%)")
parser.add_argument("--verbose", "-v", action="store_true", help="mostra detalhes")

args = parser.parse_args()
juros = round(args.valor * args.taxa * args.dias, 2)
if args.verbose:
    print(f"{args.valor} x {args.taxa} x {args.dias} dias")
print(juros)
```

```
$ python juros.py 1000 15
4.95
$ python juros.py 1000 15 --taxa 0.001 -v
1000.0 x 0.001 x 15 dias
15.0
$ python juros.py --help
usage: juros.py [-h] [--taxa TAXA] [--verbose] valor dias

Calcula juros de mora simples.

positional arguments:
  valor          valor original em reais
  dias           dias de atraso

options:
  -h, --help     show this help message and exit
  --taxa TAXA    taxa diária (padrão: 0.033%)
  --verbose, -v  mostra detalhes
$ python juros.py mil 15
usage: juros.py [-h] [--taxa TAXA] [--verbose] valor dias
juros.py: error: argument valor: invalid float value: 'mil'
```

O `argparse` converte tipos, aplica padrões, gera o `--help` e rejeita entradas inválidas com mensagens claras. Os principais parâmetros de `add_argument`:

- Nome sem traços (`"valor"`): argumento **posicional**, obrigatório.
- Nome com `--` (`"--taxa"`): **opção**, geralmente opcional; `-v` é a forma curta.
- `type=`: função de conversão (`int`, `float`, `Path`).
- `default=`: valor quando a opção não é informada.
- `action="store_true"`: opção booleana, sem valor.
- `choices=["csv", "json"]`: restringe a valores permitidos.
- `nargs="+"`: aceita um ou mais valores, devolvidos em lista.
- `required=True`: torna uma opção `--x` obrigatória.

Para testar a função de parsing sem a linha de comando real, passe uma lista: `parser.parse_args(["1000", "15", "--taxa", "0.001"])`. É assim que se escreve testes para CLIs.

## `pathlib` completo

No módulo 3 você viu o básico. Agora, o conjunto de ferramentas para percorrer e inspecionar o sistema de arquivos:

```python
from pathlib import Path

pasta = Path("/tmp/documentos")
pasta.mkdir(parents=True, exist_ok=True)
(pasta / "nf_101.pdf").write_bytes(b"%PDF")
(pasta / "folha.xlsx").write_bytes(b"PK")
(pasta / "notas.txt").write_text("a\nb\n", encoding="utf-8")

# Listar
for p in sorted(pasta.iterdir()):               # tudo na pasta (sem recursão)
    print(p.name, p.suffix, p.is_file())
# folha.xlsx .xlsx True
# nf_101.pdf .pdf True
# notas.txt .txt True

print([p.name for p in pasta.glob("*.pdf")])    # ['nf_101.pdf']
print(len(list(pasta.rglob("*"))))              # recursivo: subpastas também

# Inspecionar
arq = pasta / "notas.txt"
print(arq.exists(), arq.is_dir())               # True False
print(arq.stat().st_size)                       # 4 bytes (6 no Windows, que grava \r\n)
print(arq.resolve())                            # caminho absoluto
print(arq.with_suffix(".bak"))                  # /tmp/documentos/notas.bak
print(arq.with_name("notas_2026.txt"))          # /tmp/documentos/notas_2026.txt

# Renomear e apagar
novo = arq.rename(pasta / "notas_antigas.txt")
novo.unlink()                                   # apaga o arquivo
print(Path.home())                              # pasta do usuário
print(Path.cwd())                               # pasta atual
```

`glob` aceita padrões como `*.csv`, `nf_*.xml`, `2026-??.csv`; `rglob` desce em todas as subpastas. `suffix` vem com o ponto e preserva maiúsculas: compare sempre com `.lower()`.

## `os` e `shutil`: operações no sistema

O `pathlib` cobre criação, renomeação e remoção de arquivos individuais. Para copiar, mover árvores e consultar o ambiente, entram `shutil` e `os`:

```python
import os, shutil
from pathlib import Path

origem = Path("/tmp/documentos/nf_101.pdf")
destino = Path("/tmp/arquivo_morto")
destino.mkdir(exist_ok=True)

shutil.copy(origem, destino / origem.name)        # copia o arquivo (conteúdo + permissões básicas)
shutil.copy2(origem, destino / "copia2.pdf")      # copia também datas de modificação
shutil.move(str(origem), str(destino / "movido.pdf"))   # move (ou renomeia entre discos)
shutil.copytree("/tmp/documentos", "/tmp/backup_docs", dirs_exist_ok=True)   # pasta inteira
shutil.rmtree("/tmp/backup_docs")                 # apaga a pasta inteira (CUIDADO: sem lixeira)

print(os.getenv("USERNAME") or os.getenv("USER"))  # variável de ambiente
print(os.cpu_count())
os.makedirs("/tmp/a/b/c", exist_ok=True)           # equivalente a Path.mkdir(parents=True)
```

> **Atenção:** `shutil.rmtree` e `Path.unlink` apagam **definitivamente**, sem passar pela lixeira. Em scripts que apagam, imprima o que seria apagado primeiro (modo `--dry-run`) e só execute com confirmação explícita.

## Projeto: CLI que organiza arquivos por extensão

A pasta de downloads do escritório vira um caos: PDFs de notas, XMLs, planilhas, imagens, tudo misturado. O programa abaixo cria uma subpasta por tipo e move cada arquivo para a sua.

```python
# organizar.py
import argparse
import shutil
from pathlib import Path

CATEGORIAS = {
    "pdf": {".pdf"},
    "planilhas": {".xlsx", ".xls", ".csv"},
    "xml": {".xml"},
    "imagens": {".png", ".jpg", ".jpeg"},
    "textos": {".txt", ".md", ".docx"},
}

def categoria_de(arquivo: Path) -> str:
    ext = arquivo.suffix.lower()
    for nome, extensoes in CATEGORIAS.items():
        if ext in extensoes:
            return nome
    return "outros"

def organizar(pasta: Path, dry_run: bool = False) -> dict[str, int]:
    contagem: dict[str, int] = {}
    for arquivo in sorted(pasta.iterdir()):
        if not arquivo.is_file():
            continue                                # pula subpastas
        cat = categoria_de(arquivo)
        destino = pasta / cat / arquivo.name
        contagem[cat] = contagem.get(cat, 0) + 1
        if dry_run:
            print(f"[simulação] {arquivo.name} -> {cat}/")
            continue
        destino.parent.mkdir(exist_ok=True)
        shutil.move(str(arquivo), str(destino))
    return contagem

def main(argv=None):
    parser = argparse.ArgumentParser(description="Organiza arquivos em subpastas por tipo.")
    parser.add_argument("pasta", type=Path, help="pasta a organizar")
    parser.add_argument("--dry-run", action="store_true", help="só mostra o que faria")
    args = parser.parse_args(argv)

    if not args.pasta.is_dir():
        parser.error(f"{args.pasta} não é uma pasta")
    resultado = organizar(args.pasta, args.dry_run)
    for cat, n in sorted(resultado.items()):
        print(f"{cat:<10} {n:>4} arquivo(s)")

if __name__ == "__main__":
    main()
```

```
$ python organizar.py ~/Downloads --dry-run
[simulação] nf_101.pdf -> pdf/
[simulação] folha.xlsx -> planilhas/
[simulação] foto.png -> imagens/
imagens       1 arquivo(s)
pdf           1 arquivo(s)
planilhas     1 arquivo(s)
$ python organizar.py ~/Downloads
...
```

Repare em três decisões de projeto. A lógica está em funções puras (`categoria_de`, `organizar`), separadas do `argparse`, o que permite testá-las com `pytest` sem simular a linha de comando. O `main(argv=None)` aceita uma lista de argumentos, então um teste pode chamar `main(["/tmp/x", "--dry-run"])`. E o `--dry-run` é a primeira coisa a implementar em qualquer script que mova ou apague arquivos.

Há ainda dois detalhes defensivos que valem a pena notar. O `if not arquivo.is_file(): continue` evita que o programa tente mover as próprias subpastas `pdf/`, `planilhas/` etc. na segunda execução, o que faria o script "engolir" a si mesmo. E `sorted(pasta.iterdir())` garante uma ordem previsível na saída: sem o `sorted`, a ordem depende do sistema de arquivos e muda de uma máquina para outra, o que atrapalha a leitura dos testes e dos logs.

Para o escritório, as extensões do dicionário `CATEGORIAS` podem ser adaptadas à realidade: `.xml` de NF-e separado de `.xml` genérico pelo nome do arquivo, `.ofx` de extratos bancários, `.ret` e `.rem` de arquivos de cobrança. Como a regra está em um único dicionário no topo do arquivo, essa mudança não exige mexer em nenhuma função.

## Agendando a execução

Um CLI pronto pode rodar sozinho. No Windows, o Agendador de Tarefas aceita uma ação do tipo "Iniciar um programa" apontando para o `python.exe` do seu ambiente virtual (`C:\projetos\organizar\.venv\Scripts\python.exe`) com os argumentos `organizar.py C:\Users\voce\Downloads`. No Linux e macOS, uma linha no `crontab` faz o mesmo: `0 8 * * 1-5 /caminho/.venv/bin/python /caminho/organizar.py ~/Downloads`. Em ambos os casos, use **caminhos absolutos** para o interpretador, para o script e para a pasta, porque o agendador não roda a partir da sua pasta de projeto, e redirecione a saída para um arquivo de log para poder conferir depois o que aconteceu.

## Erros comuns

- **Esquecer que `sys.argv` é tudo string**: `sys.argv[1] + 1` dá `TypeError`.
- **`shutil.move` com `Path`** em versões antigas do Python: passe `str(caminho)` para garantir.
- **`glob("*.PDF")` não encontrar `nota.pdf`**: o padrão diferencia maiúsculas em alguns sistemas; normalize com `suffix.lower()`.
- **Apagar sem simular**: `rmtree` em uma variável com a pasta errada é irreversível.
- **Caminhos relativos**: dependem da pasta onde o comando foi digitado, não da pasta do script. Use `Path(__file__).parent` ou `resolve()`.
- **`parser.parse_args()` dentro de funções testadas**: passe `argv` como parâmetro para poder testar.

## Na prática

Um CLI com `argparse` é o que permite entregar o script para um colega ou agendar sua execução: `python organizar.py pasta/ --dry-run` é autoexplicativo e tem `--help`. Antes de qualquer script que mova ou apague arquivos do escritório, implemente a simulação e rode-a primeiro.

## Resumo

- `sys.argv` dá acesso bruto aos argumentos; `argparse` converte tipos, define padrões, gera `--help` e valida entradas. Separe a lógica do parsing para testar.
- `pathlib.Path`: `iterdir`, `glob`, `rglob`, `exists`, `is_file`, `stat`, `with_suffix`, `rename`, `unlink`, `mkdir(parents=True, exist_ok=True)`.
- `shutil.copy`/`copy2`/`move`/`copytree`/`rmtree` para operações em massa; `os.getenv`, `os.makedirs` para ambiente e pastas.
- Scripts que movem ou apagam arquivos devem ter `--dry-run` e nunca confiar em caminhos relativos.
- Um CLI bem feito tem `main(argv=None)`, funções puras testáveis e saída clara.
