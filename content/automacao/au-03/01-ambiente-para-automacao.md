Nesta lição você vai montar, do zero, um ambiente de trabalho para escrever e rodar scripts de automação em Python: instalar o interpretador e o VS Code, criar um ambiente virtual, instalar bibliotecas com o pip, organizar uma pasta de scripts, rodar um script pelo terminal e guardar senhas e chaves fora do código. Isso importa porque, nos módulos 1 e 2, você automatizou com Make e n8n; agora vai ganhar uma ferramenta sem limites de plano, que roda no seu computador e faz exatamente o que você mandar. Um ambiente bem montado evita 80% dos problemas que travam quem está começando.

## Por que Python para automação de escritório

Make e n8n resolvem bem fluxos entre serviços na nuvem. Mas várias tarefas do escritório contábil vivem no seu computador: pastas de clientes, planilhas no disco, PDFs baixados de portais, o Excel que o cliente mandou por e-mail. Python entra justamente aí. É gratuito, roda em qualquer máquina, tem biblioteca pronta para planilhas, PDFs, e-mail e APIs, e qualquer script seu pode ser chamado por um nó do n8n quando precisar misturar os dois mundos.

A ideia central deste módulo: **um script é um procedimento escrito**. Se você consegue descrever em passos como fecha um processo hoje, consegue transformá-lo em código.

## Instalando o Python e o VS Code

Se você fez o curso de Python do site, provavelmente já tem os dois. Confira no terminal (PowerShell):

```powershell
python --version
code --version
```

Se o Python não responder, baixe em `python.org/downloads`, abra o instalador e **marque "Add python.exe to PATH"** antes de clicar em Install Now. Sem essa opção o terminal não encontra o comando `python`. O VS Code vem de `code.visualstudio.com`; depois de instalar, adicione a extensão **Python** (da Microsoft).

> **Dica:** evite instalar o Python pela Microsoft Store em máquinas de trabalho. Funciona, mas algumas bibliotecas e agendadores se confundem com o caminho dela.

## A pasta de scripts

Crie uma pasta só para automações, fora do OneDrive se ele sincronizar com atraso, por exemplo `C:\automacoes`. Dentro dela, cada robô ganha uma subpasta:

```
C:\automacoes\
  organizador-downloads\
    .venv\            <- ambiente virtual (não vai para o Git)
    .env              <- segredos (não vai para o Git)
    .gitignore
    requirements.txt  <- bibliotecas usadas
    organizar.py      <- o script
    dados\            <- entradas e saídas
```

Abra a pasta do robô no VS Code com **Arquivo > Abrir Pasta**. Tudo que você rodar no terminal integrado (menu **Terminal > Novo Terminal**) já parte dali.

## Ambiente virtual (venv)

Um **ambiente virtual** é uma cópia isolada do Python dentro da pasta do projeto. Cada robô instala as bibliotecas que precisa, na versão que precisa, sem bagunçar os outros. Pense nele como uma gaveta separada por cliente: o que entra em uma não se mistura com a outra.

```powershell
cd C:\automacoes\organizador-downloads
python -m venv .venv
.venv\Scripts\Activate.ps1
```

Quando o ambiente está ativo, o prompt mostra `(.venv)` no início da linha. Se o PowerShell reclamar que "a execução de scripts foi desabilitada", rode uma vez `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` e tente de novo. No Prompt de Comando clássico, o comando de ativação é `.venv\Scripts\activate.bat`.

No VS Code, pressione `Ctrl + Shift + P`, escolha **Python: Select Interpreter** e aponte para o `.venv`. A partir daí o botão de executar usa o Python certo.

## Instalando bibliotecas com o pip

O **pip** é o instalador de pacotes do Python. Com o ambiente ativo:

```powershell
pip install openpyxl python-dotenv
pip freeze > requirements.txt
```

A primeira linha instala as bibliotecas; a segunda grava a lista exata (com versões) em `requirements.txt`. Em outra máquina, `pip install -r requirements.txt` recria tudo igual. Esse arquivo é o que você manda para um colega junto com o script.

## Rodando um script

Crie `ola.py` com o conteúdo abaixo e execute com `python ola.py`:

```python
from datetime import date

hoje = date.today()
competencia = hoje.strftime("%Y-%m")
print(f"Robô iniciado. Competência de trabalho: {competencia}")
```

A saída será algo como `Robô iniciado. Competência de trabalho: 2026-10`. Se aparecer `ModuleNotFoundError`, quase sempre o ambiente virtual não está ativo ou a biblioteca não foi instalada nele.

## Segredos fora do código: o arquivo .env

Scripts de automação precisam de senhas de e-mail, chaves de API, tokens de portal. **Nunca** escreva isso dentro do `.py`: o arquivo acaba num e-mail, num backup, num repositório. A prática padrão é um arquivo `.env` na pasta do projeto, lido pela biblioteca `python-dotenv`:

```
EMAIL_USUARIO=financeiro@escritorio.com.br
EMAIL_SENHA_APP=abcd efgh ijkl mnop
API_TOKEN=xyz123
```

E no script:

```python
import os
from dotenv import load_dotenv

load_dotenv()  # lê o .env da pasta atual e coloca nas variáveis de ambiente
usuario = os.getenv("EMAIL_USUARIO")
senha = os.getenv("EMAIL_SENHA_APP")
if not senha:
    raise SystemExit("EMAIL_SENHA_APP não definida no .env")
```

`os.getenv` devolve `None` quando a variável não existe, por isso o teste logo abaixo: é melhor o robô parar com uma mensagem clara do que falhar no meio do envio. Variáveis de ambiente também podem ser definidas no Windows (procure "Editar as variáveis de ambiente" no menu Iniciar) ou direto no agendador, sem arquivo nenhum; o `.env` é só a forma mais prática em desenvolvimento.

Crie também um `.gitignore` com as linhas `.venv/` e `.env`, para que nem o ambiente nem os segredos entrem em controle de versão.

## O que a IA pode gerar e o que você precisa entender

Assistentes de IA escrevem scripts inteiros em segundos, e você deve usá-los. Mas eles erram em três pontos que só quem entende o ambiente percebe: **versões de biblioteca** (uma função que mudou de nome), **caminhos de arquivo** (barra invertida, pasta que não existe, OneDrive) e **segredos** (código com senha escrita dentro). Por isso esta lição é sobre fundamentos, não sobre digitar. Seu papel é: descrever a tarefa com precisão, revisar o que a IA gerou, rodar num arquivo de teste e só depois apontar para os dados reais.

## Erros comuns

- Instalar a biblioteca fora do ambiente virtual e receber `ModuleNotFoundError` ao rodar.
- Salvar o script dentro de uma pasta sincronizada e o arquivo mudar enquanto o robô roda.
- Colar a senha no código "só para testar" e esquecer de tirar.
- Rodar `python` e `pip` de instalações diferentes (confira com `where.exe python`; no PowerShell, `where` sem o `.exe` é um apelido de `Where-Object` e não mostra nada).

## Na prática

Um escritório com cinco automações terá cinco pastas, cada uma com seu `.venv`, seu `.env` e seu `requirements.txt`. Quando um colega assume uma delas, recebe a pasta sem o `.venv` e sem o `.env`, recria o ambiente com `pip install -r requirements.txt` e preenche o `.env` com as credenciais dele. É assim que automação deixa de depender de uma única pessoa.

## Resumo

- Python roda no seu computador e cobre o que Make e n8n não alcançam: pastas, planilhas e PDFs locais.
- Cada robô vive numa pasta com ambiente virtual (`python -m venv .venv`), `requirements.txt` e script.
- `pip install` instala; `pip freeze > requirements.txt` registra o que foi instalado.
- Segredos ficam no `.env`, lidos com `load_dotenv()` e `os.getenv()`, e nunca no código.
- A IA gera o código; você garante versões, caminhos e segredos.
