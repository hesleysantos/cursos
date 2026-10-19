Nesta lição você vai aprender a entregar um script para colegas que não programam: README com instruções de uso, lista de dependências em `requirements.txt` ou `pyproject.toml`, ambiente virtual reproduzível, um atalho em `.bat` ou PowerShell para rodar com dois cliques, a ideia geral do PyInstaller para gerar um executável e um changelog que registra o que mudou. Ao final, você escreve a função que interpreta linhas de `requirements.txt`. Um script que só roda na sua máquina não é uma automação do escritório; é um hobby seu.

## O que "entregar" significa

Entregar é fazer o programa rodar em outra máquina, operado por outra pessoa, sem você por perto. Isso exige quatro coisas: o código, a lista do que instalar, o passo a passo de uso e um registro das versões. O Claude Code gera os quatro em minutos; o seu trabalho é testar a entrega em uma máquina limpa (ou pelo menos em uma pasta nova com um ambiente virtual novo) antes de mandar.

## README: o manual de uma página

Peça o README com as seções que o colega vai procurar, na ordem em que vai procurar:

```text
Gere README.md para o consolidador, em português, com exatamente estas seções:
1. O que faz (3 linhas). 2. Pré-requisitos (Python 3.12+, Windows).
3. Instalação passo a passo em PowerShell. 4. Como rodar (comando completo com
exemplo). 5. Formato das planilhas de entrada (colunas obrigatórias).
6. O que fazer quando dá erro (os 3 erros mais prováveis e a solução).
7. Quem procurar. Use apenas comandos e opções que existem no código.
```

Revise como na lição 6: cada comando citado tem de existir. Teste copiando e colando os comandos do README em um PowerShell novo.

## Dependências: requirements.txt e pyproject.toml

`requirements.txt` é a forma mais simples: uma biblioteca por linha, com versão fixada.

```text
openpyxl==3.1.5
pandas==2.2.3
pypdf==5.1.0
```

Gere com `pip freeze > requirements.txt` dentro do ambiente virtual e instale com `pip install -r requirements.txt`. Versões fixas (`==`) garantem que o colega instala exatamente o que você testou; as versões acima são apenas exemplo, confira as suas com `pip freeze`.

`pyproject.toml` é o formato moderno de projeto Python: além das dependências, guarda nome, versão e configuração de ferramentas como `ruff` e `pytest` em um só arquivo. Para scripts de escritório, `requirements.txt` basta; adote `pyproject.toml` quando o projeto virar pacote instalável ou tiver várias ferramentas configuradas. Peça ao Claude Code para gerar um ou outro e explique por quê no README.

## Ambiente virtual na máquina do colega

O roteiro de instalação que vai no README, em PowerShell:

```powershell
cd C:\automacoes\consolidador
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python consolidar.py --help
```

Se o PowerShell bloquear a ativação ("execução de scripts foi desabilitada"), o README deve mencionar `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`, executado uma vez. Lembre: `.venv` e `.env` não vão junto; vai `requirements.txt` e um `.env.exemplo` com as chaves sem valores.

## Rodar com dois cliques: .bat ou PowerShell

O colega não vai ativar ambiente virtual. Um `rodar.bat` na pasta resolve:

```text
@echo off
cd /d "%~dp0"
".venv\Scripts\python.exe" consolidar.py %*
pause
```

`%~dp0` é a pasta onde o `.bat` está, então funciona de qualquer lugar; chamar o `python.exe` de dentro do `.venv` dispensa ativação; `%*` repassa argumentos; `pause` segura a janela aberta para ler a saída ou o erro. A versão PowerShell (`rodar.ps1`) faz o mesmo com `& ".\.venv\Scripts\python.exe" .\consolidar.py @args`. Peça ao Claude Code o arquivo e teste dando dois cliques.

## PyInstaller: um executável (visão geral)

Quando nem Python pode ser instalado na máquina do colega, o **PyInstaller** empacota o interpretador, as bibliotecas e o seu script em um `.exe`. O uso básico é `pip install pyinstaller` e `pyinstaller --onefile consolidar.py`; o executável sai na pasta `dist/`. Vantagens: um arquivo só, sem instalação. Custos: o arquivo é grande (dezenas de MB), antivírus corporativos às vezes bloqueiam executáveis desconhecidos, e cada correção exige gerar e distribuir um `.exe` novo. Para a maioria dos escritórios, `.bat` + ambiente virtual é mais simples de manter; guarde o PyInstaller para quando a restrição for real.

## Changelog: o que mudou e quando

Um `CHANGELOG.md` com uma seção por versão, do mais recente para o mais antigo, evita a pergunta "essa versão já trata o cliente duplicado?":

```markdown
# Changelog

## 1.2.0 - 2026-10-18
### Adicionado
- Coluna "Arquivo de origem" no consolidado.
### Corrigido
- Valores com "R$" nas planilhas da Oficina eram lidos como texto.

## 1.1.0 - 2026-09-30
### Adicionado
- Detecção de cliente + competência duplicados.
```

Peça ao Claude Code para atualizar o changelog a partir dos commits desde a última versão (`git log`), e revise: a linguagem deve ser a do usuário ("valores com R$ eram lidos como texto"), não a do código ("refatorado parser de float").

## Erros comuns

- **Mandar a pasta com `.venv` dentro** (centenas de MB) ou com o `.env` com senhas.
- **README com comandos que não existem** porque o Claude "completou" a documentação.
- **Esquecer de fixar versões**: o colega instala uma versão nova do `pandas` e algo muda.
- **Caminhos absolutos da sua máquina** no script ou no `.bat`.
- **Entregar sem testar em pasta limpa**; o script dependia de algo instalado só no seu Python global.
- **Gerar `.exe` para evitar instalar Python** e descobrir que o antivírus bloqueia na primeira máquina.

## Na prática

O pacote de entrega padrão de um escritório: pasta com `consolidar.py`, `tests/`, `requirements.txt`, `README.md`, `CHANGELOG.md`, `.env.exemplo`, `rodar.bat` e `exemplos/`. Compactada, sem `.venv` e sem `.env`. Quem recebe segue o README, roda com os exemplos, confere com os números do README e só então usa os dados do mês. Quando pedir uma alteração, você muda, testa, atualiza o changelog, sobe a versão e manda o pacote de novo.

## Resumo

- Entregar = código + dependências fixadas + instruções testadas + histórico de versões.
- `requirements.txt` com `==` para scripts; `pyproject.toml` quando virar pacote ou tiver muitas ferramentas.
- O README só pode citar comandos que existem; teste-o em um PowerShell novo.
- `rodar.bat` com `%~dp0` e o `python.exe` do `.venv` dispensa ativação.
- PyInstaller gera `.exe` com `--onefile`, com custos de tamanho, antivírus e manutenção.
- Changelog por versão, em linguagem do usuário.
