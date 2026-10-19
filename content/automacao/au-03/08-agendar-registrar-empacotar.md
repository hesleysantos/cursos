Nesta lição você vai transformar um script que "funciona quando eu rodo" em um robô que roda sozinho e avisa quando algo dá errado: agendamento no Agendador de Tarefas do Windows e no cron, registro com `logging`, tratamento de erros com `try/except`, notificação de falha, parâmetros de linha de comando com `argparse` e distribuição para colegas com PyInstaller. Isso importa porque automação sem agendamento é só um atalho, e automação sem log é uma caixa-preta que ninguém confia.

## Agendar no Windows

O **Agendador de Tarefas** (procure "Agendador de Tarefas" no menu Iniciar) executa um programa em horários definidos. Para um script Python, o segredo é apontar para o Python do ambiente virtual, não para o `python` genérico:

1. **Criar Tarefa Básica**, dê um nome (`robo-guias`).
2. Gatilho: **Diariamente**, 07:00.
3. Ação: **Iniciar um programa**.
   - Programa: `C:\automacoes\robo-guias\.venv\Scripts\python.exe`
   - Argumentos: `robo.py --competencia atual`
   - Iniciar em: `C:\automacoes\robo-guias`
4. Em Propriedades, marque **Executar estando o usuário conectado ou não** se a máquina fica ligada sem ninguém logado, e **Executar com privilégios mais altos** só se o script realmente precisar.

O campo "Iniciar em" é o mais esquecido: sem ele, caminhos relativos como `dados/entrada` apontam para outra pasta e o `.env` não é encontrado. Pela linha de comando, o mesmo agendamento é:

```powershell
schtasks /create /tn "robo-guias" /sc daily /st 07:00 /tr "C:\automacoes\robo-guias\.venv\Scripts\python.exe C:\automacoes\robo-guias\robo.py"
```

Na linha de comando não existe o campo "Iniciar em"; a tarefa criada assim roda em outra pasta. Nesse caso, abra a tarefa no Agendador e preencha o campo, ou faça o script descobrir a própria pasta com `Path(__file__).parent` e montar os caminhos a partir dela.

## Agendar no Linux e no macOS: cron

O **cron** lê uma tabela de horários (`crontab -e`) com cinco campos: minuto, hora, dia do mês, mês, dia da semana.

```
0 7 * * 1-5  cd /home/escritorio/robo-guias && .venv/bin/python robo.py >> robo.log 2>&1
```

Lê-se: minuto 0, hora 7, qualquer dia do mês, qualquer mês, de segunda (1) a sexta (5). O `cd` garante a pasta certa e o `>> robo.log 2>&1` guarda saída e erros num arquivo. O cron não carrega seu `.env` automaticamente; o script precisa chamar `load_dotenv()` ou as variáveis devem ser definidas no próprio crontab.

## Registrar com logging

`print` some quando ninguém está olhando. O módulo `logging` grava em arquivo, com data, nível e mensagem:

```python
import logging
from logging.handlers import RotatingFileHandler

def configurar_log(caminho="robo.log"):
    formato = logging.Formatter("%(asctime)s %(levelname)s %(message)s")
    arquivo = RotatingFileHandler(caminho, maxBytes=1_000_000, backupCount=5, encoding="utf-8")
    arquivo.setFormatter(formato)
    tela = logging.StreamHandler()
    tela.setFormatter(formato)
    logging.basicConfig(level=logging.INFO, handlers=[arquivo, tela])

configurar_log()
logging.info("robô iniciado")
logging.warning("cliente padaria sem planilha em 2026-03")
logging.error("falha ao enviar e-mail para cliente@padaria.com.br")
```

Saída no arquivo e na tela:

```
2026-10-18 07:00:01,234 INFO robô iniciado
2026-10-18 07:00:01,235 WARNING cliente padaria sem planilha em 2026-03
2026-10-18 07:00:01,235 ERROR falha ao enviar e-mail para cliente@padaria.com.br
```

Níveis: `DEBUG` (detalhe para depurar), `INFO` (o que aconteceu de normal), `WARNING` (algo estranho, mas seguiu), `ERROR` (uma etapa falhou), `CRITICAL` (o robô não pode continuar). `RotatingFileHandler` impede que o log cresça sem fim: ao passar de 1 MB, renomeia e começa outro, mantendo 5 antigos. Dentro de um `except`, use `logging.exception("mensagem")`: além da mensagem, grava a pilha de erro completa.

## Tratamento de erros e notificação

A regra de ouro de um robô: **um cliente com problema não pode derrubar os outros**. O laço principal captura o erro de cada item, registra e segue; no fim, resume e avisa.

```python
import logging

def processar_cliente(cliente):
    if cliente == "oficina":
        raise FileNotFoundError("planilha de oficina não encontrada")
    return f"{cliente} ok"

def executar(clientes):
    sucesso, falhas = [], []
    for cliente in clientes:
        try:
            resultado = processar_cliente(cliente)
            logging.info(resultado)
            sucesso.append(cliente)
        except FileNotFoundError as e:
            logging.warning("pulando %s: %s", cliente, e)
            falhas.append((cliente, str(e)))
        except Exception:
            logging.exception("erro inesperado em %s", cliente)
            falhas.append((cliente, "erro inesperado"))
    return sucesso, falhas

logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
ok, ruim = executar(["padaria", "oficina", "mercado"])
print("sucesso:", ok)
print("falhas:", ruim)
```

Saída:

```
INFO padaria ok
WARNING pulando oficina: planilha de oficina não encontrada
INFO mercado ok
sucesso: ['padaria', 'mercado']
falhas: [('oficina', 'planilha de oficina não encontrada')]
```

Erros previstos (`FileNotFoundError`, `requests.exceptions.RequestException`, `KeyError` num JSON) ganham `except` específico com mensagem clara; o `except Exception` final pega o imprevisto e grava a pilha. Com a lista `falhas` em mãos, o robô envia um e-mail de resumo (lição 5) ou uma mensagem num canal (webhook do Teams/Slack/Telegram, como no módulo 2) **somente se houver falha**, para não virar ruído. Encerre com `sys.exit(1)` quando houver falha: o Agendador registra a execução como malsucedida.

## Scripts como linha de comando: argparse

Um robô bom aceita parâmetros em vez de ter valores fixos no código. `argparse` cria a interface:

```python
import argparse
from datetime import date

def competencia_atual():
    return date.today().strftime("%Y-%m")

parser = argparse.ArgumentParser(description="Gera e envia as guias do mês.")
parser.add_argument("--competencia", default=competencia_atual(), help="AAAA-MM (padrão: mês atual)")
parser.add_argument("--cliente", help="processa só este cliente")
parser.add_argument("--simular", action="store_true", help="não envia e-mail, só mostra")
args = parser.parse_args([])          # [] para o exemplo; na vida real, parse_args()

print(args.competencia, args.cliente, args.simular)
```

Uso no terminal: `python robo.py --competencia 2026-03 --cliente padaria --simular`. O `--simular` (às vezes chamado *dry run*) é o parâmetro mais valioso de todos: deixa você rodar o robô inteiro sem efeitos colaterais. `python robo.py --help` mostra a ajuda gerada automaticamente.

## Distribuir para colegas: PyInstaller

Nem todo colega vai instalar Python. **PyInstaller** (`pip install pyinstaller`) empacota o script e as bibliotecas num executável:

```powershell
pyinstaller --onefile --name robo-guias robo.py
```

O resultado fica em `dist\robo-guias.exe`. Limites que você precisa saber: o arquivo é grande (dezenas de MB), antivírus às vezes bloqueia executáveis desconhecidos (assinatura digital resolve), o `.env` e as pastas de dados precisam ficar ao lado do executável, e bibliotecas que trazem navegadores (Playwright) exigem passos extras. Para equipes técnicas, é mais simples compartilhar a pasta com `requirements.txt` e um arquivo `rodar.bat` que ativa o ambiente e executa o script.

## Erros comuns

- Agendar com o `python` global em vez do `.venv\Scripts\python.exe`: falta biblioteca e o robô falha em silêncio.
- Esquecer "Iniciar em": `.env` e pastas relativas não são encontrados.
- `except Exception: pass`: o erro some e você só descobre no fechamento.
- Log sem rotação que chega a gigabytes depois de um ano.
- Mandar notificação em toda execução: a equipe para de ler.

## Na prática

Robô bem acabado é assim: agendado às 07:00 com o Python do ambiente virtual, grava `robo.log` com rotação, processa cliente a cliente sem derrubar o lote, manda um resumo só quando algo falha, aceita `--competencia` e `--simular`, e termina com código 1 em caso de falha para o Agendador registrar. Na próxima lição você monta um desses do início ao fim.

## Resumo

- Agendador de Tarefas (Windows) e cron (Linux/macOS) executam o script no horário; aponte para o Python do `.venv` e defina a pasta inicial.
- `logging` com `RotatingFileHandler` registra o que aconteceu; `logging.exception` grava a pilha.
- `try/except` por item mantém o lote vivo; notifique só em caso de falha; `sys.exit(1)` sinaliza erro.
- `argparse` dá parâmetros como `--competencia` e `--simular`.
- PyInstaller gera `.exe` para quem não tem Python, com as limitações de tamanho, antivírus e arquivos ao lado.
