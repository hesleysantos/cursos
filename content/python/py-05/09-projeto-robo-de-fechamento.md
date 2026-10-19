# Projeto guiado: Robô de fechamento

Nesta lição você junta tudo que viu no módulo em um projeto completo: o **Robô de fechamento** baixa lançamentos de uma API (simulada), grava em SQLite, gera uma planilha Excel com `openpyxl` e envia um resumo por e-mail. Mais importante que cada biblioteca é a **arquitetura em camadas**, a configuração por variáveis de ambiente, os logs e os testes. Esse é o modelo que você vai reutilizar em qualquer automação de escritório daqui para a frente.

## O problema

Todo dia 5, o escritório precisa, para cada cliente: buscar os lançamentos do mês no sistema do cliente (uma API REST), guardar uma cópia local para auditoria, montar uma planilha com totais por conta e mandar um e-mail com o resumo. Hoje isso é feito à mão em três sistemas. O robô faz em um comando:

```bash
python -m robo_fechamento --competencia 2026-03
```

## Arquitetura em camadas

A regra que organiza tudo: **cada camada só conhece a de baixo**, e a lógica de negócio não sabe que existe rede, banco ou e-mail.

```
robo_fechamento/
  __main__.py        # ponto de entrada: argparse, logging, chama a aplicação
  config.py          # lê variáveis de ambiente, valida, expõe um objeto Config
  dominio.py         # dataclasses (Lancamento, Resumo) e funções puras
  api.py             # infraestrutura: busca JSON na API (requests)
  repositorio.py     # infraestrutura: SQLite
  planilha.py        # infraestrutura: openpyxl
  email_.py          # infraestrutura: smtplib/email
  aplicacao.py       # orquestra: api -> dominio -> repositorio -> planilha -> email
tests/
  test_dominio.py    # testa as funções puras, sem rede nem arquivo
  test_repositorio.py  # SQLite em memória
  test_aplicacao.py  # usa "fakes" no lugar de api e email
```

- **Domínio**: o que é um lançamento, como se calcula o total por conta, o que é um lançamento inválido. Puro Python, 100% testável.
- **Aplicação**: a sequência de passos do caso de uso.
- **Infraestrutura**: tudo que toca o mundo externo. Fino, trocável.

Por que essa separação vale o esforço? Porque a API vai mudar, o cliente vai pedir PDF em vez de Excel, o e-mail vai virar WhatsApp. Se a regra de negócio está misturada com `requests` e `smtplib`, cada mudança quebra tudo. Separada, você troca uma peça.

## Configuração por variáveis de ambiente

```python
# config.py
import os
from dataclasses import dataclass

@dataclass(frozen=True)
class Config:
    api_url: str
    api_token: str
    db_path: str
    smtp_host: str
    smtp_user: str
    smtp_senha: str
    email_destino: str

def carregar_config() -> Config:
    faltando = []
    def obter(nome, padrao=None):
        valor = os.environ.get(nome, padrao)
        if valor is None:
            faltando.append(nome)
        return valor
    cfg = Config(
        api_url=obter("ROBO_API_URL"),
        api_token=obter("ROBO_API_TOKEN"),
        db_path=obter("ROBO_DB_PATH", "fechamento.db"),
        smtp_host=obter("ROBO_SMTP_HOST", "smtp.gmail.com"),
        smtp_user=obter("ROBO_SMTP_USER"),
        smtp_senha=obter("ROBO_SMTP_SENHA"),
        email_destino=obter("ROBO_EMAIL_DESTINO"),
    )
    if faltando:
        raise SystemExit(f"Variáveis de ambiente obrigatórias ausentes: {', '.join(faltando)}")
    return cfg
```

Nada de senha no código, e o programa falha **cedo e claro** se algo estiver faltando, em vez de quebrar depois de meia hora rodando.

## Domínio: dataclasses e funções puras

```python
# dominio.py
from dataclasses import dataclass
from datetime import date

@dataclass(frozen=True)
class Lancamento:
    id: int
    data: date
    conta: str
    historico: str
    valor_centavos: int

def parsear_lancamento(bruto: dict) -> Lancamento:
    """Converte o dict da API em Lancamento. Levanta ValueError se inválido."""
    try:
        valor = round(float(bruto["valor"]) * 100)
    except (KeyError, TypeError, ValueError):
        raise ValueError(f"valor inválido em {bruto!r}")
    conta = str(bruto.get("conta") or "").strip()
    if not conta:
        raise ValueError("conta vazia")
    return Lancamento(
        id=int(bruto["id"]),
        data=date.fromisoformat(bruto["data"]),
        conta=conta,
        historico=str(bruto.get("historico", "")).strip(),
        valor_centavos=valor,
    )

def totalizar_por_conta(lancamentos: list[Lancamento]) -> dict[str, int]:
    totais: dict[str, int] = {}
    for l in lancamentos:
        totais[l.conta] = totais.get(l.conta, 0) + l.valor_centavos
    return dict(sorted(totais.items()))

def formatar_reais(centavos: int) -> str:
    inteiro, resto = divmod(abs(centavos), 100)
    texto = f"{inteiro:,}".replace(",", ".")
    sinal = "-" if centavos < 0 else ""
    return f"{sinal}R$ {texto},{resto:02d}"

def montar_corpo_email(competencia: str, totais: dict[str, int]) -> str:
    linhas = [f"Fechamento {competencia}", ""]
    for conta, v in totais.items():
        linhas.append(f"{conta:<12} {formatar_reais(v):>18}")
    linhas += ["", f"Total geral: {formatar_reais(sum(totais.values()))}"]
    return "\n".join(linhas)

# exemplo:
# totalizar_por_conta([...]) -> {'1.1.01': 150000, '3.1.01': -20000}
# formatar_reais(1234567)    -> 'R$ 12.345,67'
# formatar_reais(-5)         -> '-R$ 0,05'
```

Dinheiro em **centavos inteiros**: soma exata, sem `0.1 + 0.2`. Todas as funções recebem valores e devolvem valores: você as testa com um `assert` e nada mais.

## Infraestrutura

```python
# api.py
import requests

def buscar_lancamentos(url_base: str, token: str, competencia: str) -> list[dict]:
    itens, pagina = [], 1
    while True:
        r = requests.get(f"{url_base}/lancamentos",
                         params={"competencia": competencia, "page": pagina},
                         headers={"Authorization": f"Bearer {token}"}, timeout=15)
        r.raise_for_status()
        corpo = r.json()
        itens.extend(corpo["items"])
        if not corpo.get("has_next"):
            return itens
        pagina += 1
```

```python
# repositorio.py
import sqlite3
from .dominio import Lancamento

class RepositorioSQLite:
    def __init__(self, caminho: str):
        self.con = sqlite3.connect(caminho)
        self.con.execute("""CREATE TABLE IF NOT EXISTS lancamentos (
            id INTEGER PRIMARY KEY, data TEXT, conta TEXT, historico TEXT, valor_centavos INTEGER)""")

    def salvar(self, lancamentos: list[Lancamento]) -> int:
        with self.con:
            self.con.executemany(
                "INSERT OR REPLACE INTO lancamentos VALUES (?, ?, ?, ?, ?)",
                [(l.id, l.data.isoformat(), l.conta, l.historico, l.valor_centavos) for l in lancamentos])
        return len(lancamentos)
```

```python
# planilha.py
from openpyxl import Workbook

def gerar_planilha(caminho: str, totais: dict[str, int]) -> None:
    wb = Workbook(); ws = wb.active; ws.title = "Totais"
    ws.append(["Conta", "Total (R$)"])
    for conta, v in totais.items():
        ws.append([conta, v / 100])
    ws.append(["Total", f"=SUM(B2:B{ws.max_row})"])
    for r in range(2, ws.max_row + 1):
        ws.cell(row=r, column=2).number_format = 'R$ #,##0.00'
    wb.save(caminho)
```

`INSERT OR REPLACE` torna o robô **idempotente**: rodar duas vezes a mesma competência não duplica registros. Isso é essencial em automações, porque elas falham no meio e precisam ser reexecutadas.

## Aplicação: orquestrar com dependências injetadas

```python
# aplicacao.py
import logging
from .dominio import parsear_lancamento, totalizar_por_conta, montar_corpo_email

log = logging.getLogger(__name__)

def executar_fechamento(competencia, buscar, repositorio, gerar_planilha, enviar_email, caminho_xlsx):
    brutos = buscar(competencia)
    log.info("API devolveu %d itens", len(brutos))

    lancamentos, rejeitados = [], 0
    for b in brutos:
        try:
            lancamentos.append(parsear_lancamento(b))
        except ValueError as e:
            rejeitados += 1
            log.warning("Item rejeitado: %s", e)

    repositorio.salvar(lancamentos)
    totais = totalizar_por_conta(lancamentos)
    gerar_planilha(caminho_xlsx, totais)
    enviar_email(f"Fechamento {competencia}", montar_corpo_email(competencia, totais), caminho_xlsx)
    log.info("Concluído: %d gravados, %d rejeitados", len(lancamentos), rejeitados)
    return {"gravados": len(lancamentos), "rejeitados": rejeitados, "totais": totais}
```

Repare: `executar_fechamento` recebe as **funções** `buscar`, `gerar_planilha`, `enviar_email` como parâmetros. No `__main__.py` você passa as reais; no teste, passa fakes. Isso é **injeção de dependência** na sua forma mais simples, e é o que torna a camada de aplicação testável sem internet.

```python
# __main__.py
import argparse, logging
from .config import carregar_config
from . import api, email_, planilha
from .repositorio import RepositorioSQLite
from .aplicacao import executar_fechamento

def main():
    parser = argparse.ArgumentParser(description="Robô de fechamento mensal")
    parser.add_argument("--competencia", required=True, help="AAAA-MM")
    args = parser.parse_args()
    logging.basicConfig(level=logging.INFO, filename="robo.log",
                        format="%(asctime)s %(levelname)s %(name)s %(message)s")
    cfg = carregar_config()
    executar_fechamento(
        args.competencia,
        buscar=lambda comp: api.buscar_lancamentos(cfg.api_url, cfg.api_token, comp),
        repositorio=RepositorioSQLite(cfg.db_path),
        gerar_planilha=planilha.gerar_planilha,
        enviar_email=lambda assunto, corpo, anexo: email_.enviar(cfg, assunto, corpo, anexo),
        caminho_xlsx=f"fechamento-{args.competencia}.xlsx",
    )

if __name__ == "__main__":
    main()
```

## Testes

```python
# tests/test_aplicacao.py
from robo_fechamento.aplicacao import executar_fechamento

class RepoFake:
    def __init__(self): self.salvos = []
    def salvar(self, lancs): self.salvos.extend(lancs); return len(lancs)

def test_fechamento_rejeita_invalidos_e_totaliza(tmp_path):
    brutos = [
        {"id": 1, "data": "2026-03-01", "conta": "1.1.01", "valor": "100.00"},
        {"id": 2, "data": "2026-03-02", "conta": "1.1.01", "valor": "abc"},     # inválido
        {"id": 3, "data": "2026-03-03", "conta": "3.1.01", "valor": -20},
    ]
    enviados = []
    repo = RepoFake()
    resultado = executar_fechamento(
        "2026-03",
        buscar=lambda comp: brutos,
        repositorio=repo,
        gerar_planilha=lambda caminho, totais: None,
        enviar_email=lambda a, c, anexo: enviados.append((a, c)),
        caminho_xlsx=str(tmp_path / "x.xlsx"),
    )
    assert resultado == {"gravados": 2, "rejeitados": 1, "totais": {"1.1.01": 10000, "3.1.01": -2000}}
    assert len(repo.salvos) == 2
    assert "Total geral: R$ 80,00" in enviados[0][1]
```

Nenhum teste toca rede, disco (além do `tmp_path`) ou servidor de e-mail. A API simulada é só uma lista de dicts. Esse teste roda em milissegundos e cobre o fluxo inteiro.

## Critérios de pronto

- [ ] `python -m robo_fechamento --competencia 2026-03` roda do início ao fim.
- [ ] Falta de variável de ambiente gera mensagem clara e saída imediata.
- [ ] Reexecutar a mesma competência não duplica registros.
- [ ] Itens inválidos são rejeitados com aviso no log, sem derrubar o robô.
- [ ] `pytest` passa sem acesso à internet.
- [ ] `robo.log` registra início, quantidades e fim (ou a exceção).
- [ ] Repositório Git com `.gitignore` cobrindo `.env`, `*.db`, `*.xlsx`, `*.log`.

## Como evoluir o projeto

Com a arquitetura montada, cada pedido novo vira uma peça pequena e isolada. Alguns caminhos naturais para você praticar depois de concluir os critérios de pronto:

- **Vários clientes por execução**: o `__main__` passa a receber uma lista de configurações e chama `executar_fechamento` para cada uma, registrando no log qual cliente falhou sem interromper os demais.
- **Consultas em paralelo**: se a API for lenta, troque o `for` sobre clientes por um `ThreadPoolExecutor`, exatamente como na lição de concorrência; o domínio não muda em nada.
- **PDF além do Excel**: acrescente `pdf.py` na infraestrutura e passe `gerar_pdf` como mais uma dependência da aplicação.
- **Agendamento**: cadastre o comando no Agendador de Tarefas do Windows apontando para o `python.exe` do venv, com a pasta do projeto como diretório inicial.
- **Histórico**: como os lançamentos ficam no SQLite, você pode gerar comparativos entre competências com um `SELECT` agrupado por mês, sem baixar nada de novo.

Repare que nenhuma dessas evoluções exige reescrever o que já existe. Esse é o teste definitivo de uma boa arquitetura: mudanças novas se encaixam, em vez de forçar você a mexer em tudo.

## Armadilhas

- **Lógica na camada de infraestrutura** ("já que estou lendo a API, aproveito e calculo o total aqui"). Não: a API devolve dicts, o domínio calcula.
- **Testar só o caminho feliz.** Inclua item inválido, lista vazia, API fora do ar (a exceção de `requests` deve chegar ao log).
- **Float para dinheiro.** Centavos inteiros, sempre.
- **Robô que não é idempotente.** Uma segunda execução deve ser segura.
- **Exceção engolida.** Em `__main__`, capture, logue com `logging.exception` e relance ou saia com código diferente de zero, para que o Agendador registre a falha.

## Na prática

Troque a API simulada pela fonte real do seu escritório (a exportação do sistema contábil, uma planilha compartilhada, a API do banco) alterando **só** `api.py`: se o resto do projeto não precisar mudar, a arquitetura está certa. Rode o robô à mão por dois fechamentos, comparando a planilha gerada com a feita manualmente, e só então agende. O `robo.log` é a sua prova de execução quando alguém perguntar "o e-mail de março saiu?".

## Resumo

- Camadas: domínio (puro) ← aplicação (orquestra) ← infraestrutura (API, SQLite, Excel, e-mail); cada uma só conhece a de baixo.
- Configuração por variáveis de ambiente com falha imediata e clara se faltar algo.
- Dinheiro em centavos inteiros, dataclasses imutáveis, funções puras testáveis com `assert`.
- Injeção de dependência (passar funções e objetos como parâmetros) permite testar a aplicação com fakes, sem rede.
- Idempotência (`INSERT OR REPLACE`), logs e tratamento de itens inválidos tornam o robô confiável para rodar agendado.
