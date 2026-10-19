Nesta lição você vai aprender quando é permitido extrair dados de sites, como ler páginas estáticas com BeautifulSoup, como controlar um navegador de verdade com Playwright para entrar em portais, preencher formulários, clicar e baixar arquivos, e quais são os limites: esperas, seletores que não quebram, captcha e certificado digital. Isso importa porque muitos dados do escritório só existem em portais sem API, e a diferença entre um robô útil e um robô que quebra toda semana está nos detalhes desta lição.

## Primeiro: pode?

Antes de automatizar um site, três verificações:

1. **Termos de uso.** Muitos portais proíbem acesso automatizado. Portais do governo costumam permitir consulta, mas bloqueiam volume alto. Se existe API oficial, use a API, não o scraping.
2. **robots.txt.** O arquivo `https://site.com.br/robots.txt` diz quais caminhos o dono do site não quer que robôs acessem. Não é lei, mas é a vontade declarada do dono, e ignorá-lo pesa contra você numa disputa.
3. **LGPD.** Dado pessoal (nome, CPF, endereço) coletado de um site continua sendo dado pessoal. Você precisa de base legal para tratá-lo e deve coletar só o necessário. Dados da sua própria empresa ou dos seus clientes, acessados com as credenciais deles e com autorização, são o caso normal do escritório.

Além disso, seja gentil com o servidor: poucas requisições por minuto, horário de baixo movimento, cache do que já baixou.

## Páginas estáticas: BeautifulSoup

Uma página **estática** entrega o conteúdo já no HTML; você baixa com `requests` e lê a estrutura. O **BeautifulSoup** (`pip install beautifulsoup4`) transforma o HTML numa árvore pesquisável:

```python
import requests
from bs4 import BeautifulSoup

html = requests.get("https://exemplo.gov.br/tabela-indices", timeout=15).text
sopa = BeautifulSoup(html, "html.parser")

titulo = sopa.find("h1").get_text(strip=True)
linhas = []
for tr in sopa.select("table#indices tbody tr"):          # seletor CSS
    celulas = [td.get_text(strip=True) for td in tr.find_all("td")]
    linhas.append(celulas)
links_pdf = [a["href"] for a in sopa.find_all("a", href=True) if a["href"].endswith(".pdf")]
```

`find` pega o primeiro elemento; `find_all` todos; `select` aceita seletores CSS como `table#indices` (tabela com id `indices`) ou `div.card a` (links dentro de divs com classe `card`). `get_text(strip=True)` devolve o texto sem espaços sobrando. Para descobrir o seletor, abra a página no navegador, clique com o botão direito no dado e escolha **Inspecionar**.

Se a página carrega os dados por JavaScript depois de abrir (tabela que "aparece" depois de um segundo), o HTML baixado vem vazio. Duas saídas: olhar na aba **Rede** do inspetor qual requisição traz o JSON e chamá-la direto com requests (muitas vezes é uma API escondida), ou usar um navegador controlado.

## Portais com login: Playwright

**Playwright** controla um navegador real (Chromium, Firefox ou WebKit). Ele abre a página, digita, clica, espera e baixa, como você faria. Instale com `pip install playwright` e depois `playwright install chromium` para baixar o navegador.

```python
import os
from pathlib import Path
from playwright.sync_api import sync_playwright

def baixar_relatorio(competencia):
    with sync_playwright() as p:
        navegador = p.chromium.launch(headless=False)     # False mostra a janela; True roda escondido
        pagina = navegador.new_page()
        pagina.goto("https://portal.exemplo.com.br/login")
        pagina.get_by_label("Usuário").fill(os.getenv("PORTAL_USUARIO"))
        pagina.get_by_label("Senha").fill(os.getenv("PORTAL_SENHA"))
        pagina.get_by_role("button", name="Entrar").click()
        pagina.wait_for_url("**/painel")                  # espera a página pós-login

        pagina.get_by_role("link", name="Relatórios").click()
        pagina.get_by_label("Competência").fill(competencia)
        with pagina.expect_download() as download_info:
            pagina.get_by_role("button", name="Exportar").click()
        download = download_info.value
        destino = Path("downloads") / f"relatorio_{competencia}.xlsx"
        destino.parent.mkdir(exist_ok=True)
        download.save_as(destino)
        navegador.close()
        return destino

# baixar_relatorio("2026-03")
```

O que cada parte faz: `launch` abre o navegador; `new_page` abre uma aba; `goto` navega; `get_by_label`, `get_by_role` e `get_by_text` localizam elementos **pelo que o usuário vê** (rótulo do campo, papel e nome do botão); `fill` digita; `click` clica; `expect_download` captura o arquivo que o clique dispara. Credenciais vêm do `.env`.

## Esperas e seletores estáveis

Dois motivos fazem robôs de navegador quebrarem: o robô age antes de a página estar pronta, ou o site muda e o seletor deixa de existir.

**Esperas.** O Playwright espera automaticamente o elemento ficar visível e habilitado antes de clicar ou digitar. Para situações além disso, use esperas explícitas: `pagina.wait_for_selector("table#resultado")`, `pagina.wait_for_url(...)`, `pagina.wait_for_load_state("networkidle")`. Evite `time.sleep(5)`: é lento quando a página é rápida e insuficiente quando é lenta.

**Seletores.** Prefira, nesta ordem: `get_by_role("button", name="Exportar")` (papel e texto visível), `get_by_label("CNPJ")` (rótulo do campo), `get_by_test_id(...)` se o site tiver atributos de teste, e só por último seletores CSS por id (`#btnExportar`). Nunca use caminhos longos gerados pelo inspetor como `div > div:nth-child(3) > span`: qualquer mudança de layout quebra. Um robô que localiza "o botão chamado Exportar" sobrevive a redesenhos.

## Captcha e certificado digital: os limites

**Captcha** existe justamente para impedir robôs. Não tente burlar: além de violar os termos, serviços "resolvedores" são caros e instáveis. Caminhos legítimos: procurar API oficial, pedir ao portal um acesso de integração, ou deixar o robô fazer tudo até o captcha e chamar uma pessoa para resolver aquela etapa (`input` no terminal ou uma pausa com janela visível).

**Certificado digital.** Portais como e-CAC, SEFAZ e eSocial autenticam por certificado A1 (arquivo `.pfx`) ou A3 (token/cartão). O Playwright suporta certificados de cliente ao criar o contexto do navegador (opção `client_certificates`, com o caminho do `.pfx` e a senha); consulte a documentação em `playwright.dev/python` para a sintaxe atual. Certificado A3 em token físico depende de driver do fabricante e normalmente não funciona em modo automatizado. Login via gov.br com certificado costuma envolver redirecionamentos e, às vezes, captcha. Avalie antes se o portal oferece **web service** (como os da NF-e) ou **API** (como a integração do eSocial), que são feitos para máquinas.

## Parse de HTML só com a biblioteca padrão

Para páginas simples ou quando não pode instalar nada, `html.parser` resolve. Você cria uma classe que reage às tags:

```python
from html.parser import HTMLParser

class LeitorTabela(HTMLParser):
    def __init__(self):
        super().__init__()
        self.linhas, self.linha_atual, self.na_celula = [], [], False
    def handle_starttag(self, tag, attrs):
        if tag == "tr": self.linha_atual = []
        if tag in ("td", "th"): self.na_celula = True
    def handle_data(self, dados):
        if self.na_celula and dados.strip(): self.linha_atual.append(dados.strip())
    def handle_endtag(self, tag):
        if tag in ("td", "th"): self.na_celula = False
        if tag == "tr" and self.linha_atual: self.linhas.append(self.linha_atual)

html = "<tbody><tr><th>Índice</th><th>Valor</th></tr><tr><td>SELIC</td><td>0,95%</td></tr></tbody>"
leitor = LeitorTabela()
leitor.feed(html)
print(leitor.linhas)   # [['Índice', 'Valor'], ['SELIC', '0,95%']]
```

`handle_starttag` é chamado a cada abertura de tag, `handle_data` a cada texto e `handle_endtag` a cada fechamento (o exemplo usa só o miolo da tabela, o `tbody`, mas funciona igual com a tabela inteira). É mais trabalhoso que o BeautifulSoup, mas não depende de nada externo e é o que os exercícios desta lição usam.

## Erros comuns

- Baixar o HTML com requests e não achar a tabela: a página monta por JavaScript. Procure a API na aba Rede ou use Playwright.
- Usar seletor frágil (`nth-child`) e o robô quebrar na primeira mudança do portal.
- Rodar em `headless=True` desde o início: desenvolva com a janela visível para ver o que acontece.
- Fazer login a cada execução em laço de mil consultas: o portal bloqueia. Faça login uma vez e reaproveite a sessão (`navegador.new_context(storage_state=...)`).

## Na prática

Um escritório usa Playwright para baixar, todo dia 1º, o relatório de movimento de cada cliente no portal do banco que não oferece OFX automático, salvando com o padrão `cliente_competencia_extrato.xlsx` (lição 2). Onde há captcha, o robô abre a página, preenche tudo e espera o operador clicar; ainda assim, economiza 90% do tempo.

## Resumo

- Antes de automatizar: termos de uso, `robots.txt`, LGPD; prefira API oficial.
- BeautifulSoup lê páginas estáticas com `find`, `find_all`, `select` e `get_text`.
- Playwright controla o navegador: `goto`, `get_by_label/get_by_role`, `fill`, `click`, `expect_download`.
- Espere com `wait_for_*`, nunca com `sleep`; localize por papel e texto visível, não por caminhos CSS longos.
- Captcha não se burla; certificado A1 é suportado, A3 e gov.br têm limites; `html.parser` lê HTML sem instalar nada.
