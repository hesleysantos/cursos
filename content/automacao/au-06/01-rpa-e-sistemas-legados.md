# RPA e sistemas legados

Nesta lição você vai entender quando usar **RPA** (automação robótica de processos: um robô que opera a tela como uma pessoa), quais ferramentas existem em 2026, como lidar com sistemas sem API (ERP antigo, Domínio, portais do governo) e os limites legais e técnicos: certificado digital, captcha, autenticação em dois fatores. Ao final, você vai saber decidir entre API, RPA e "deixa manual", e estimar o custo de manutenção que ninguém conta.

## O que é RPA e quando ele entra

Nos módulos anteriores, toda integração passou por **API**: um contrato formal entre programas. Muitos sistemas do contador não oferecem isso: o ERP do cliente de 2009, o módulo fiscal que só exporta em tela, o portal da prefeitura que só aceita digitação. O RPA resolve pela via lenta: um robô abre o programa, clica, digita, lê a tela e copia o resultado, como o estagiário faria, só que à noite e sem errar o dedo.

A regra de prioridade:

1. **API ou arquivo de importação** (XML, CSV, layout do sistema) sempre que existir.
2. **Banco de dados** do sistema, se o fornecedor permitir leitura.
3. **RPA**, quando não há outra via e o volume justifica.
4. **Manual**, quando o volume é baixo ou o processo muda toda semana.

RPA é a última opção porque é a mais frágil: uma atualização que move um botão quebra o robô.

## Ferramentas em 2026

| Ferramenta | Tipo | Quando usar |
|---|---|---|
| **UiPath** | Plataforma completa (Studio + Orchestrator), licença por robô | Muitos processos e equipe dedicada; edição Community gratuita para estudo |
| **Power Automate Desktop** | Microsoft; fluxos assistidos incluídos no Windows 10/11 | Telas do Windows para quem usa Microsoft 365; execução sem supervisão exige licença |
| **Python + Playwright** | Automação de navegador | Portais web: preenche, baixa arquivos, lê tabelas |
| **Python + pywinauto / pyautogui** | Controle de janelas, mouse e teclado | Programas de desktop sem API; pywinauto lê os controles do Windows e é mais estável que clicar por coordenadas |

Para quem sabe Python, Playwright para portais e pywinauto para desktop cobrem a maioria dos casos sem licença. UiPath e Power Automate ganham quando a equipe não programa ou há dezenas de robôs para gerenciar.

```python
# Esqueleto de automacao de portal com Playwright (pip install playwright; playwright install)
# Nao roda aqui: exige navegador instalado. Confira a API em playwright.dev/python
# from playwright.sync_api import sync_playwright
# with sync_playwright() as p:
#     navegador = p.chromium.launch(headless=True)
#     pagina = navegador.new_page()
#     pagina.goto("https://portal.exemplo.gov.br/consulta")
#     pagina.fill("#cnpj", "11222333000181")
#     pagina.click("text=Consultar")
#     pagina.wait_for_selector("table.resultado")
#     linhas = pagina.locator("table.resultado tr").all_inner_texts()
#     navegador.close()
```

O padrão é sempre o mesmo: abrir, localizar elementos por seletor (id, texto, CSS), agir, **esperar** o resultado e ler. A espera explícita (`wait_for_selector`) separa o robô que funciona do que falha "às vezes".

## Sistemas contábeis: Domínio e similares

Domínio, Alterdata, Fortes e outros não têm API aberta para o escritório, mas têm **layouts de importação** documentados (lançamentos em lote, notas, folha). Gere o arquivo no layout e importe; o RPA fica para o que não tem importação, como um relatório que só existe em tela. A lição 2 mostra os layouts.

## Portais do governo: e-CAC, SEFAZ, prefeituras

**Certificado digital.** O e-CAC, as SEFAZ e a maioria dos sistemas fiscais exigem certificado ICP-Brasil (o e-CAC também aceita conta gov.br de nível prata ou ouro). O **A1** é um arquivo (`.pfx`) válido por um ano: um programa consegue usá-lo para assinar e autenticar, o que torna a automação viável. O **A3** fica em token ou cartão e exige o dispositivo físico (muitas vezes com PIN); automatizar é frágil.

Há duas formas legítimas de agir em nome do cliente. A primeira é usar o **certificado do próprio escritório** com uma **procuração eletrônica** que o cliente outorga no e-CAC: é o caminho correto para os serviços da Receita Federal, e cada acesso fica vinculado a quem o fez. A segunda é usar o **certificado A1 do cliente**, entregue ao escritório com autorização formal em contrato: é o usual nos web services da NF-e, em que o certificado precisa ser do CNPJ interessado. Nos dois casos, usar certificado ou senha de terceiro sem autorização formal é acesso indevido, com consequências civis e penais; e o certificado do cliente fica em cofre, com cada uso registrado, porque o titular continua respondendo pelo que for feito com ele.

**Captcha e 2FA.** Vários portais usam captcha justamente para impedir robôs, e a conta gov.br pode exigir segundo fator. Não existe automação legítima que "quebre" captcha: serviços que fazem isso violam os termos de uso e expõem o escritório. Com captcha, a automação para antes dele e uma pessoa completa.

**Canais oficiais existem.** Os **web services da NF-e** (distribuição de documentos fiscais, manifestação do destinatário) funcionam com certificado A1 e são a forma correta de baixar os XMLs dos clientes; o **Integra Contador**, do Serpro, é uma plataforma paga de APIs para escritórios (procurações, DCTFWeb, PGDAS-D, consultas); a **NFS-e nacional** tem API própria. Pesquise se existe API antes de montar robô de tela em portal público: além de mais estável, é a via prevista pelo próprio órgão.

**Termos de uso.** Leia: portais que proíbem acesso automatizado podem bloquear o certificado ou a conta do escritório inteiro.

## Fragilidade e manutenção

Um robô de tela quebra quando o sistema muda um botão, a resolução muda, aparece uma janela inesperada, a rede atrasa a página ou a senha expira. Estime manutenção de **duas a quatro horas por mês por robô** e inclua isso no custo (lição 7).

Práticas que reduzem a dor:

- **Seletores estáveis**: id ou texto, nunca coordenadas de pixel.
- **Esperas explícitas** por elementos, com timeout, em vez de `sleep` fixo.
- **Capturas de tela em caso de erro**, salvas com data.
- **Modo de ensaio**: o robô preenche e para antes de confirmar, nas primeiras semanas.
- **Alerta de quebra** (lição 5) e **idempotência**: verificar se já foi lançado antes de lançar.

## Armadilhas

- **Robô de tela onde existe importação de arquivo**: trabalho dobrado e mais frágil.
- **Clicar por coordenadas**: quebra na primeira mudança de resolução.
- **Senhas e certificados no código**: use variáveis de ambiente ou cofre; o `.pfx` com permissão restrita.
- **Prometer "automatizar o e-CAC inteiro"**: a parte com captcha ou 2FA continua manual; diga isso ao cliente antes.
- **Robô na máquina de alguém**: quando o computador desliga, a automação morre; use máquina dedicada ou servidor.

## Na prática

Um escritório precisava baixar todo mês os XMLs de NF-e de 80 clientes. A primeira versão era um robô de tela no portal da SEFAZ, que quebrava a cada mudança e esbarrava em captcha. A segunda usou o web service de distribuição de DF-e com os certificados A1 dos clientes (autorização em contrato e certificados em cofre), com log por cliente e alerta 30 dias antes do vencimento de cada certificado. O que não tem API ficou com o Playwright e uma pessoa resolvendo o captcha. A manutenção caiu de horas por semana para poucas por mês.

## Resumo

- RPA opera a tela como uma pessoa; é a última opção, depois de API, arquivo de importação e banco de dados.
- UiPath e Power Automate Desktop para quem não programa; Playwright (web) e pywinauto (desktop) para quem programa.
- Sistemas contábeis: prefira os layouts de importação ao robô de tela.
- Portais do governo: A1 automatizável (certificado do escritório com procuração eletrônica, ou A1 do cliente com autorização formal); A3, captcha e 2FA são limites reais; use os canais oficiais.
- Robôs quebram: seletores estáveis, esperas explícitas, capturas, modo de ensaio, alerta e orçamento de manutenção.
