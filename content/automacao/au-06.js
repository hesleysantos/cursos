registerModule({
  course: 'automacao',
  id: 'au-06',
  order: 6,
  level: 'Especialista',
  title: 'Automação no escritório e carreira',
  description: 'Você vai automatizar o que é específico do escritório contábil: sistemas sem API e portais do governo (com seus limites legais), XML de NF-e, SPED e layouts de importação, extratos OFX, boletos e Pix; desenhar e operar uma esteira completa com filas, logs, métricas e governança LGPD; medir resultados, precificar e vender automação; planejar sua carreira; e concluir com a especificação da esteira de fechamento mensal.',
  hours: 15,
  lessons: [
    // ------------------------------------------------------------------
    {
      id: 'au-06-01',
      title: 'RPA e sistemas legados',
      minutes: 26,
      content: 'content/automacao/au-06/01-rpa-e-sistemas-legados.md',
      exercises: [
        {
          type: 'order',
          q: 'Ordene as opções de integração da mais recomendada para a menos recomendada.',
          items: ['API ou arquivo de importação do sistema', 'Leitura direta no banco de dados, se permitida', 'RPA (robô que opera a tela)', 'Processo manual'],
          explain: 'RPA é a última opção técnica porque é a mais frágil; API e importação são estáveis e validadas pelo próprio sistema.',
        },
        {
          type: 'match',
          q: 'Relacione a ferramenta ao cenário em que ela se encaixa melhor.',
          pairs: [['Playwright (Python)', 'Portais web: preencher formulários, baixar arquivos, ler tabelas'], ['pywinauto', 'Controlar um programa de desktop a partir de código Python, lendo os controles do Windows'], ['UiPath', 'Dezenas de robôs com equipe dedicada e orquestração'], ['Power Automate Desktop', 'Fluxos de tela sem código para quem já usa Microsoft 365']],
          explain: 'A escolha depende de quem programa, de onde está o sistema (web ou desktop) e da escala de robôs a gerenciar.',
        },
        {
          type: 'mc',
          q: 'Por que o certificado digital A1 é mais adequado que o A3 para automações?',
          options: ['Porque o A1 é um arquivo que um programa consegue usar para assinar e autenticar; o A3 exige token ou cartão físico', 'Porque o A1 é gratuito', 'Porque o A3 não vale no e-CAC', 'Porque o A1 dispensa procuração'],
          answer: 0,
          explain: 'O A1 (.pfx) pode ser carregado por código; o A3 depende do dispositivo físico e muitas vezes de PIN, o que torna a automação frágil.',
        },
        {
          type: 'tf',
          q: 'Serviços que resolvem captcha automaticamente permitem automatizar portais do governo de forma legítima.',
          answer: false,
          explain: 'O captcha existe para impedir robôs; contorná-lo viola os termos de uso e expõe o escritório. A automação para antes do captcha ou usa o canal oficial.',
        },
        {
          type: 'mc',
          q: 'Qual é a forma correta de baixar mensalmente os XMLs das NF-e dos clientes?',
          options: ['Um robô de tela no portal da SEFAZ com a senha do cliente', 'Pedir ao cliente para imprimir as DANFEs', 'O web service de distribuição de documentos fiscais, com o certificado A1 do cliente autorizado em contrato', 'Um serviço que quebra o captcha do portal'],
          answer: 2,
          explain: 'O web service é o canal oficial previsto pelo próprio fisco, mais estável que robô de tela e sem violar termos de uso; o certificado precisa ser do CNPJ interessado, por isso é o A1 do cliente, com autorização formal.',
        },
        {
          type: 'fill',
          q: 'Para acessar o e-CAC em nome do cliente usando o certificado do próprio escritório, é preciso que o cliente outorgue uma ___ eletrônica.',
          answer: ['procuração', 'procuracao', 'procuração eletrônica', 'procuracao eletronica'],
          explain: 'A procuração eletrônica no e-CAC dá ao escritório poderes para agir pelo cliente com o certificado do escritório, e cada acesso fica vinculado a quem o fez; é o caminho correto na Receita Federal.',
        },
        {
          type: 'mc',
          q: 'Um robô de tela funciona "às vezes": em alguns dias o clique acontece antes de a página carregar. Qual correção ataca a causa?',
          options: ['Aumentar um sleep fixo de 5 para 20 segundos', 'Clicar por coordenadas de pixel', 'Rodar o robô na máquina de outra pessoa', 'Usar esperas explícitas por elemento, com timeout, antes de agir'],
          answer: 3,
          explain: 'A espera explícita aguarda o elemento aparecer e falha com mensagem clara se não aparecer; sleep fixo é lento e ainda assim falha em dias ruins.',
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'au-06-02',
      title: 'Documentos fiscais e integrações contábeis',
      minutes: 27,
      content: 'content/automacao/au-06/02-documentos-fiscais-e-integracoes.md',
      exercises: [
        {
          type: 'mc',
          q: 'Ao buscar `inf.find("ide/nNF")` em um XML de NF-e com xml.etree, o resultado é None. Qual é a causa mais provável?',
          options: ['O XML está corrompido', 'Os elementos estão no namespace da NF-e e a busca não o informou', 'O campo nNF não existe na NF-e', 'xml.etree não lê arquivos grandes'],
          answer: 1,
          explain: 'Todos os elementos da NF-e estão em http://www.portalfiscal.inf.br/nfe; é preciso buscar com o prefixo do namespace, como "nfe:ide/nfe:nNF" com o dicionário NS.',
        },
        {
          type: 'code',
          q: 'Escreva `extrair_nfe(xml)` que recebe o texto de um XML de NF-e (namespace http://www.portalfiscal.inf.br/nfe) e devolve um dict com: "chave" (o atributo Id de infNFe sem o prefixo "NFe"), "numero" (texto de ide/nNF), "emitente" (texto de emit/xNome), "valor_total" (float de total/ICMSTot/vNF), "status" (texto de cStat em protNFe) e "itens", uma lista de dicts {"descricao": prod/xProd, "valor": float de prod/vProd} na ordem dos det.',
          starter: `import xml.etree.ElementTree as ET

NS = {"nfe": "http://www.portalfiscal.inf.br/nfe"}

def extrair_nfe(xml):
    pass
`,
          tests: `XML = """<?xml version="1.0" encoding="UTF-8"?>
<nfeProc xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
  <NFe>
    <infNFe Id="NFe35260911222333000181550010000012341000012345" versao="4.00">
      <ide><nNF>1234</nNF><serie>1</serie><dhEmi>2026-09-15T10:20:00-03:00</dhEmi></ide>
      <emit><CNPJ>11222333000181</CNPJ><xNome>Padaria Sol Ltda</xNome></emit>
      <dest><CNPJ>99888777000166</CNPJ><xNome>Mercado Lua</xNome></dest>
      <det nItem="1"><prod><cProd>P1</cProd><xProd>Pao frances</xProd><NCM>19059090</NCM><CFOP>5102</CFOP><vProd>850.00</vProd></prod></det>
      <det nItem="2"><prod><cProd>P2</cProd><xProd>Bolo</xProd><NCM>19059090</NCM><CFOP>5102</CFOP><vProd>350.00</vProd></prod></det>
      <total><ICMSTot><vProd>1200.00</vProd><vNF>1200.00</vNF></ICMSTot></total>
    </infNFe>
  </NFe>
  <protNFe><infProt><cStat>100</cStat><nProt>135260000123456</nProt></infProt></protNFe>
</nfeProc>"""
r = extrair_nfe(XML)
assert isinstance(r, dict), "Deve devolver um dict"
assert r["chave"] == "35260911222333000181550010000012341000012345", "chave deve ser o Id sem o prefixo NFe, obtido: " + str(r.get("chave"))
assert r["numero"] == "1234", "numero deve ser o texto de nNF"
assert r["emitente"] == "Padaria Sol Ltda", "emitente deve ser o xNome de emit"
assert r["valor_total"] == 1200.0 and isinstance(r["valor_total"], float), "valor_total deve ser float de vNF"
assert r["status"] == "100", "status deve ser o cStat do protocolo"
assert r["itens"] == [{"descricao": "Pao frances", "valor": 850.0}, {"descricao": "Bolo", "valor": 350.0}], "itens incorretos: " + str(r.get("itens"))
XML2 = XML.replace("<cStat>100</cStat>", "<cStat>101</cStat>").replace('<det nItem="2"><prod><cProd>P2</cProd><xProd>Bolo</xProd><NCM>19059090</NCM><CFOP>5102</CFOP><vProd>350.00</vProd></prod></det>', "")
r2 = extrair_nfe(XML2)
assert r2["status"] == "101" and len(r2["itens"]) == 1, "Deve funcionar com outro status e um item so"
`,
          solution: `import xml.etree.ElementTree as ET

NS = {"nfe": "http://www.portalfiscal.inf.br/nfe"}

def extrair_nfe(xml):
    raiz = ET.fromstring(xml)
    inf = raiz.find(".//nfe:infNFe", NS)
    itens = []
    for det in inf.findall("nfe:det", NS):
        itens.append({
            "descricao": det.findtext("nfe:prod/nfe:xProd", namespaces=NS),
            "valor": float(det.findtext("nfe:prod/nfe:vProd", namespaces=NS)),
        })
    return {
        "chave": inf.get("Id")[3:],
        "numero": inf.findtext("nfe:ide/nfe:nNF", namespaces=NS),
        "emitente": inf.findtext("nfe:emit/nfe:xNome", namespaces=NS),
        "valor_total": float(inf.findtext("nfe:total/nfe:ICMSTot/nfe:vNF", namespaces=NS)),
        "status": raiz.findtext(".//nfe:cStat", namespaces=NS),
        "itens": itens,
    }
`,
          hint: 'ET.fromstring(xml); inf = raiz.find(".//nfe:infNFe", NS); use findtext com namespaces=NS e caminhos como "nfe:ide/nfe:nNF"; a chave é inf.get("Id")[3:].',
          explain: 'Extrair com o namespace correto e converter valores para float é a base de toda automação com NF-e; a chave e o cStat alimentam as validações de duplicidade e cancelamento.',
        },
        {
          type: 'tf',
          q: 'Nos arquivos do SPED, os campos são separados por ponto e vírgula e os valores decimais usam ponto.',
          answer: false,
          explain: 'O SPED usa barra vertical (|) como separador, com a linha começando e terminando em |, e decimais com vírgula; datas vêm como DDMMAAAA.',
        },
        {
          type: 'fill',
          q: 'No protocolo de autorização da NF-e (protNFe), o campo cStat igual a ___ indica "Autorizado o uso da NF-e" (110 é denegada).',
          answer: ['100'],
          explain: 'cStat 100 é "Autorizado o uso da NF-e"; conferir esse código barra notas denegadas ou rejeitadas, e o cancelamento posterior precisa ser conferido nos eventos (procEventoNFe), não só no protocolo.',
        },
        {
          type: 'match',
          q: 'Relacione o elemento do XML da NF-e ao que ele contém.',
          pairs: [['ide', 'Número, série e data de emissão'], ['emit', 'CNPJ e nome do emitente'], ['det/prod', 'Descrição, NCM, CFOP e valor de cada item'], ['total/ICMSTot', 'Totais da nota, inclusive vNF'], ['protNFe', 'Protocolo e status da autorização']],
          explain: 'A hierarquia da NF-e é fixa; conhecer onde cada dado mora torna a extração direta.',
        },
        {
          type: 'mc',
          q: 'Por que a NFS-e exige um "adaptador" por layout, diferente da NF-e?',
          options: ['Porque NFS-e não usa XML', 'Porque a NFS-e não tem valor', 'Porque notas de serviço são municipais: cada prefeitura tinha seu layout e a adesão ao padrão nacional é gradual', 'Porque xml.etree não lê NFS-e'],
          answer: 2,
          explain: 'Em 2026 convivem layouts municipais (muitos ABRASF, com variações) e o padrão nacional; cada um devolve o mesmo dicionário por meio de um extrator próprio.',
        },
        {
          type: 'mc',
          q: 'Qual validação detecta o erro mais comum ao lançar XMLs em lote?',
          options: ['Conferir se a chave de 44 dígitos já foi lançada (duplicidade)', 'Conferir se o arquivo termina em .xml', 'Conferir se o emitente tem IE', 'Conferir se a nota tem mais de um item'],
          answer: 0,
          explain: 'O mesmo XML chega por vários canais (e-mail, web service, cliente); sem checagem de chave, a nota é lançada duas vezes.',
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'au-06-03',
      title: 'Bancos, boletos e Pix',
      minutes: 27,
      content: 'content/automacao/au-06/03-bancos-boletos-e-pix.md',
      exercises: [
        {
          type: 'mc',
          q: 'Por que um parser XML comum falha ao ler a maioria dos arquivos OFX?',
          options: ['Porque OFX é binário', 'Porque OFX usa vírgula decimal', 'Porque o OFX é criptografado', 'Porque as tags do OFX em geral não são fechadas (estilo SGML)'],
          answer: 3,
          explain: 'O corpo do OFX parece XML, mas as tags normalmente não fecham; por isso se usa regex por bloco STMTTRN ou uma biblioteca específica.',
        },
        {
          type: 'code',
          q: 'Escreva `ler_ofx(texto)` que devolve uma lista de dicts, um por bloco `<STMTTRN>...</STMTTRN>`, com as chaves: "tipo" (TRNTYPE), "data" (os 8 primeiros caracteres de DTPOSTED convertidos para "AAAA-MM-DD"), "valor" (float de TRNAMT), "id" (FITID) e "historico" (MEMO). Os valores das tags podem ou não ter tag de fechamento; o valor termina no fim da linha ou no próximo "<". Remova espaços nas pontas.',
          starter: `import re

def ler_ofx(texto):
    pass
`,
          tests: `OFX = """<OFX><BANKTRANLIST>
<STMTTRN>
<TRNTYPE>DEBIT
<DTPOSTED>20260905120000[-3:BRT]
<TRNAMT>-1250.00
<FITID>2026090500123
<MEMO>PIX ENVIADO FORNECEDOR ABC
</STMTTRN>
<STMTTRN>
<TRNTYPE>CREDIT</TRNTYPE>
<DTPOSTED>20260906</DTPOSTED>
<TRNAMT>3400.50</TRNAMT>
<FITID>2026090600456</FITID>
<MEMO>TED RECEBIDA MERCADO LUA </MEMO>
</STMTTRN>
</BANKTRANLIST></OFX>"""
r = ler_ofx(OFX)
assert isinstance(r, list) and len(r) == 2, "Deve devolver uma lista com 2 transacoes"
assert r[0] == {"tipo": "DEBIT", "data": "2026-09-05", "valor": -1250.0, "id": "2026090500123", "historico": "PIX ENVIADO FORNECEDOR ABC"}, "Primeira transacao incorreta: " + str(r[0])
assert r[1] == {"tipo": "CREDIT", "data": "2026-09-06", "valor": 3400.5, "id": "2026090600456", "historico": "TED RECEBIDA MERCADO LUA"}, "Segunda transacao (tags fechadas) incorreta: " + str(r[1])
assert ler_ofx("<OFX></OFX>") == [], "Sem blocos deve devolver lista vazia"
`,
          solution: `import re

def ler_ofx(texto):
    transacoes = []
    for bloco in re.findall(r"<STMTTRN>(.*?)</STMTTRN>", texto, re.S):
        def campo(tag):
            m = re.search(r"<" + tag + r">([^\\r\\n<]+)", bloco)
            return m.group(1).strip() if m else ""
        data = campo("DTPOSTED")[:8]
        transacoes.append({
            "tipo": campo("TRNTYPE"),
            "data": data[:4] + "-" + data[4:6] + "-" + data[6:8],
            "valor": float(campo("TRNAMT")),
            "id": campo("FITID"),
            "historico": campo("MEMO"),
        })
    return transacoes
`,
          hint: 're.findall(r"<STMTTRN>(.*?)</STMTTRN>", texto, re.S) separa os blocos; dentro de cada um, re.search(r"<TAG>([^\\r\\n<]+)") pega o valor até a quebra de linha ou o próximo <.',
          explain: 'O FITID é o que impede importar a mesma transação duas vezes, e a data normalizada permite cruzar com os lançamentos; a regex tolera OFX com e sem tags de fechamento.',
        },
        {
          type: 'fill',
          q: 'O campo ___ do OFX é o identificador único da transação e deve ser usado para não importar o mesmo lançamento duas vezes.',
          answer: ['FITID'],
          explain: 'Cada STMTTRN traz um FITID; guardá-lo no banco e verificar antes de importar garante idempotência.',
        },
        {
          type: 'match',
          q: 'Relacione o mecanismo ao que ele faz.',
          pairs: [['Arquivo remessa CNAB', 'Leva ao banco os boletos a registrar'], ['Arquivo retorno CNAB', 'Devolve quais boletos foram pagos, com data e valor'], ['txid', 'Identificador da cobrança Pix usado na conciliação'], ['Webhook de pagamento', 'Aviso do banco ou PSP de que um título foi liquidado']],
          explain: 'Boletos e Pix têm identificadores próprios (nosso número, txid) que ligam cobrança, pagamento e lançamento.',
        },
        {
          type: 'tf',
          q: 'Um escritório pode acessar o Open Finance diretamente para ler os extratos de qualquer cliente, bastando o CNPJ.',
          answer: false,
          explain: 'O Open Finance exige consentimento do cliente, com prazo e escopo, e o acesso passa por instituições participantes ou agregadores; o escritório não entra diretamente.',
        },
        {
          type: 'mc',
          q: 'A API Pix padronizada pelo Banco Central exige, na autenticação, além do OAuth 2.0:',
          options: ['A senha do internet banking', 'mTLS: um certificado do cliente registrado no PSP, usado em todas as chamadas', 'Um captcha por requisição', 'Nada além da chave Pix'],
          answer: 1,
          explain: 'Toda chamada à API Pix apresenta o certificado do cliente (mTLS) junto com o token OAuth; é o padrão da especificação do Bacen.',
        },
        {
          type: 'mc',
          q: 'Um webhook chega dizendo "boleto 123 pago". O que o sistema deve fazer antes de marcar o título como liquidado?',
          options: ['Validar a assinatura ou a origem do webhook, pois um aviso falso marcaria como pago o que não foi', 'Marcar imediatamente para não atrasar', 'Responder ao cliente agradecendo', 'Apagar o boleto'],
          answer: 0,
          explain: 'Webhooks são requisições HTTP que qualquer um pode tentar enviar; a validação de assinatura/origem é obrigatória quando há dinheiro.',
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'au-06-04',
      title: 'Arquitetura de uma esteira de automação',
      minutes: 27,
      content: 'content/automacao/au-06/04-arquitetura-de-uma-esteira.md',
      exercises: [
        {
          type: 'match',
          q: 'Relacione a peça da esteira à sua função.',
          pairs: [['Entradas', 'Registram a tarefa e a colocam na fila, sem processar'], ['Fila', 'Lista de tarefas pendentes com ordem e prioridade'], ['Workers', 'Executam uma etapa por tarefa, em paralelo'], ['Banco de execuções', 'Guarda etapa, status, tentativas e erro de cada tarefa'], ['Painel', 'Mostra fila, falhas e andamento por cliente']],
          explain: 'Cada peça faz uma coisa; a separação é o que permite reprocessar, paralelizar e enxergar o andamento.',
        },
        {
          type: 'code',
          q: 'Implemente a classe `Fila(max_tentativas=3)` com: `adicionar(nome)` que cria uma tarefa {"id", "nome", "status": "pendente", "tentativas": 0, "erro": None} com ids sequenciais a partir de 1 e devolve o id; `proxima()` que pega a primeira tarefa "pendente" (menor id), muda para "processando", incrementa tentativas e a devolve (ou None se não houver); `concluir(id)` que marca "concluida"; `falhar(id, erro)` que guarda o erro e volta para "pendente" se tentativas < max_tentativas, senão marca "falha"; e `resumo()` que devolve um dict {status: quantidade}.',
          starter: `class Fila:
    def __init__(self, max_tentativas=3):
        pass
`,
          tests: `f = Fila(max_tentativas=2)
a = f.adicionar("classificar")
b = f.adicionar("extrair")
assert (a, b) == (1, 2), "ids devem ser sequenciais a partir de 1"
assert f.resumo() == {"pendente": 2}, "Duas tarefas pendentes, obtido: " + str(f.resumo())
t = f.proxima()
assert t["id"] == 1 and t["status"] == "processando" and t["tentativas"] == 1, "proxima() deve pegar a tarefa 1 e marcar processando"
f.concluir(1)
t = f.proxima()
assert t["id"] == 2, "proxima() deve pegar a tarefa 2"
f.falhar(2, "timeout")
assert f.resumo() == {"concluida": 1, "pendente": 1}, "Falha com tentativas restantes volta para pendente, obtido: " + str(f.resumo())
t = f.proxima()
assert t["id"] == 2 and t["tentativas"] == 2, "A tarefa 2 deve voltar com tentativas == 2"
f.falhar(2, "timeout de novo")
assert f.resumo() == {"concluida": 1, "falha": 1}, "Esgotadas as tentativas deve ir para falha, obtido: " + str(f.resumo())
assert f.proxima() is None, "Sem pendentes deve devolver None"
assert f.tarefas[2]["erro"] == "timeout de novo", "O ultimo erro deve ficar registrado"
`,
          solution: `class Fila:
    def __init__(self, max_tentativas=3):
        self.tarefas = {}
        self.max_tentativas = max_tentativas
        self._seq = 0

    def adicionar(self, nome):
        self._seq += 1
        self.tarefas[self._seq] = {"id": self._seq, "nome": nome, "status": "pendente",
                                   "tentativas": 0, "erro": None}
        return self._seq

    def proxima(self):
        for id_ in sorted(self.tarefas):
            t = self.tarefas[id_]
            if t["status"] == "pendente":
                t["status"] = "processando"
                t["tentativas"] += 1
                return t
        return None

    def concluir(self, id_):
        self.tarefas[id_]["status"] = "concluida"

    def falhar(self, id_, erro):
        t = self.tarefas[id_]
        t["erro"] = erro
        t["status"] = "pendente" if t["tentativas"] < self.max_tentativas else "falha"

    def resumo(self):
        contagem = {}
        for t in self.tarefas.values():
            contagem[t["status"]] = contagem.get(t["status"], 0) + 1
        return contagem
`,
          hint: 'Guarde as tarefas em um dict self.tarefas indexado por id e um contador self._seq; proxima() percorre os ids em ordem e devolve a primeira pendente.',
          explain: 'Estados explícitos e contagem de tentativas são o que permite reprocessar só o que falhou e detectar o que está parado; em produção, o dict vira uma tabela com marcação atômica.',
        },
        {
          type: 'tf',
          q: 'O webhook que recebe um documento deve classificar, extrair e lançar na mesma requisição, para evitar filas.',
          answer: false,
          explain: 'Entrada só registra e enfileira; processar na hora trava a requisição, perde eventos em picos e impede reprocessamento.',
        },
        {
          type: 'order',
          q: 'Ordene as etapas da esteira do fechamento mensal que vêm depois de "receber".',
          items: ['classificar', 'extrair', 'validar', 'lancar', 'conciliar', 'guias', 'enviar'],
          explain: 'Cada etapa é um worker: só dá para extrair o que já foi classificado, validar o que foi extraído e conciliar o que foi lançado; enviar sempre espera aprovação.',
        },
        {
          type: 'mc',
          q: 'Dois workers pegaram a mesma tarefa e lançaram a nota duas vezes. Qual é a correção?',
          options: ['Usar um único worker para sempre', 'Aumentar o número de tentativas', 'Marcar a tarefa como "processando" de forma atômica no banco (UPDATE condicional ou SELECT FOR UPDATE SKIP LOCKED)', 'Guardar os arquivos dentro do banco'],
          answer: 2,
          explain: 'A marcação atômica garante que só um worker consegue mudar a tarefa de pendente para processando; a chave de idempotência é a segunda rede de proteção.',
        },
        {
          type: 'fill',
          q: 'Para reprocessar um documento sem duplicar lançamentos, cada tarefa recebe uma chave de ___ formada pelo hash do arquivo e pela etapa.',
          answer: ['idempotência', 'idempotencia'],
          explain: 'Com a chave, executar a mesma etapa duas vezes para o mesmo arquivo produz o efeito de uma só.',
        },
        {
          type: 'mc',
          q: 'Um escritório processa 300 documentos por dia. Qual dimensionamento inicial é adequado?',
          options: ['Kafka com dez servidores', 'Processar tudo em um único script à meia-noite', 'Um worker por cliente', 'Fila em tabela SQLite ou Postgres, dois ou três workers e concorrência limitada nas etapas de IA'],
          answer: 3,
          explain: 'Centenas de tarefas por dia cabem em uma fila em tabela com poucos workers; a concorrência limitada respeita as cotas da API de IA.',
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'au-06-05',
      title: 'Observabilidade e operação',
      minutes: 27,
      content: 'content/automacao/au-06/05-observabilidade-e-operacao.md',
      exercises: [
        {
          type: 'mc',
          q: 'Por que registrar logs como uma linha JSON por evento, em vez de texto livre?',
          options: ['Porque JSON ocupa menos espaço', 'Porque campos fixos (evento, tarefa, etapa, duração, tipo de erro) permitem buscar, contar e agregar', 'Porque texto livre não pode ser gravado em arquivo', 'Porque a LGPD exige JSON'],
          answer: 1,
          explain: 'Um log estruturado vira métrica com uma consulta; "Erro ao processar nota" em texto livre não permite responder quantos timeouts houve hoje.',
        },
        {
          type: 'code',
          q: 'Escreva `resumir_logs(texto)` que recebe linhas JSON (uma por linha, ignorando linhas vazias), cada uma com "status" ("ok" ou "erro"), "duracao_ms", opcionalmente "custo_brl" e, nas falhas, "tipo_erro". Devolva um dict com: "total" (número de linhas), "taxa_sucesso" (ok ÷ total, arredondado a 3 casas; 0.0 se total for 0), "mediana_ms" (elemento central da lista ordenada de durações das linhas ok, usando o índice len//2; 0 se não houver ok), "custo_total" (soma de custo_brl, arredondada a 3 casas) e "erros_por_tipo" (dict tipo_erro → quantidade, só das linhas com status diferente de ok).',
          starter: `import json
from collections import Counter

def resumir_logs(texto):
    pass
`,
          tests: `LOGS = """{"evento": "etapa_concluida", "etapa": "extrair", "duracao_ms": 1800, "custo_brl": 0.01, "status": "ok"}
{"evento": "etapa_concluida", "etapa": "extrair", "duracao_ms": 2200, "custo_brl": 0.012, "status": "ok"}
{"evento": "etapa_falhou", "etapa": "extrair", "duracao_ms": 30000, "status": "erro", "tipo_erro": "timeout"}

{"evento": "etapa_concluida", "etapa": "validar", "duracao_ms": 120, "custo_brl": 0.0, "status": "ok"}
{"evento": "etapa_falhou", "etapa": "validar", "duracao_ms": 90, "status": "erro", "tipo_erro": "validacao"}
{"evento": "etapa_falhou", "etapa": "extrair", "duracao_ms": 30000, "status": "erro", "tipo_erro": "timeout"}"""
r = resumir_logs(LOGS)
assert r["total"] == 6, "total deve ignorar a linha vazia e contar 6, obtido: " + str(r.get("total"))
assert r["taxa_sucesso"] == 0.5, "taxa_sucesso deve ser 0.5"
assert r["mediana_ms"] == 1800, "mediana das duracoes ok [120, 1800, 2200] e 1800"
assert r["custo_total"] == 0.022, "custo_total deve ser 0.022, obtido: " + str(r.get("custo_total"))
assert r["erros_por_tipo"] == {"timeout": 2, "validacao": 1}, "erros_por_tipo incorreto: " + str(r.get("erros_por_tipo"))
vazio = resumir_logs("")
assert vazio["total"] == 0 and vazio["taxa_sucesso"] == 0.0 and vazio["mediana_ms"] == 0 and vazio["erros_por_tipo"] == {}, "Texto vazio deve devolver zeros"
`,
          solution: `import json
from collections import Counter

def resumir_logs(texto):
    linhas = [json.loads(l) for l in texto.splitlines() if l.strip()]
    total = len(linhas)
    ok = [l for l in linhas if l["status"] == "ok"]
    duracoes = sorted(l["duracao_ms"] for l in ok)
    mediana = duracoes[len(duracoes) // 2] if duracoes else 0
    return {
        "total": total,
        "taxa_sucesso": round(len(ok) / total, 3) if total else 0.0,
        "mediana_ms": mediana,
        "custo_total": round(sum(l.get("custo_brl", 0) for l in linhas), 3),
        "erros_por_tipo": dict(Counter(l["tipo_erro"] for l in linhas if l["status"] != "ok")),
    }
`,
          hint: 'json.loads em cada linha não vazia; separe as ok; ordene as durações e pegue o índice len//2; Counter dos tipo_erro das falhas.',
          explain: 'Esse resumo, rodado por dia e por etapa, é o painel mínimo: taxa de sucesso, tempo típico, custo e o que mais quebra.',
        },
        {
          type: 'tf',
          q: 'A média do tempo de processamento é a melhor métrica para encontrar gargalos, porque considera todas as tarefas.',
          answer: false,
          explain: 'A média esconde a cauda: mediana e p95 mostram o tempo típico e o que acontece com os 5% piores, onde o gargalo costuma estar.',
        },
        {
          type: 'match',
          q: 'Relacione o alerta à ação do runbook.',
          pairs: [['Extração abaixo de 90% com erros de timeout', 'Checar status da API e reduzir a concorrência'], ['Erros do tipo arquivo_corrompido', 'Mover arquivos para pendência humana e avisar atendimento'], ['Tarefa mais antiga na fila há 4 horas', 'Verificar se os workers estão rodando e acionar o responsável'], ['Certificado vencendo em 30 dias', 'Abrir tarefa para o atendimento renovar com o cliente']],
          explain: 'Cada alerta tem um roteiro escrito; sem runbook, a resposta depende de quem está de plantão.',
        },
        {
          type: 'order',
          q: 'Ordene as etapas do tratamento de um incidente de automação.',
          items: ['Conter: pausar o que está causando dano', 'Comunicar quem precisa saber', 'Corrigir a causa', 'Reprocessar o que ficou pendente usando os estados da esteira', 'Analisar sem culpa e registrar o que muda'],
          explain: 'Conter primeiro evita que o dano cresça; a análise posterior é o que impede a repetição.',
        },
        {
          type: 'fill',
          q: 'Quando uma mudança de prompt piora os resultados em produção, a ação mais rápida é o ___ para a versão anterior guardada no Git.',
          answer: ['rollback'],
          explain: 'Com prompts, código e fluxos versionados, voltar leva minutos; consertar na pressa costuma piorar.',
        },
        {
          type: 'mc',
          q: 'Qual item NÃO deve aparecer em um log operacional?',
          options: ['O identificador da tarefa', 'O tipo do erro (timeout, validacao)', 'O CPF completo do funcionário presente no documento', 'A duração da etapa em milissegundos'],
          answer: 2,
          explain: 'Logs também são dados pessoais sob a LGPD; registre identificadores internos, nunca CPF, senhas ou conteúdo de documentos.',
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'au-06-06',
      title: 'Governança, LGPD e auditoria',
      minutes: 25,
      content: 'content/automacao/au-06/06-governanca-lgpd-e-auditoria.md',
      exercises: [
        {
          type: 'mc',
          q: 'Qual é o item mais importante do inventário de automações?',
          options: ['O dono: uma pessoa responsável por cada automação', 'A cor do fluxo no n8n', 'O número de linhas de código', 'A data de criação'],
          answer: 0,
          explain: 'Sem dono não há a quem perguntar quando a automação quebra ou quando a lei muda; o resto do inventário serve a essa pessoa.',
        },
        {
          type: 'match',
          q: 'Relacione o papel da LGPD ao ator, no caso típico da folha de pagamento dos clientes.',
          pairs: [['Controlador', 'O cliente, dono dos dados dos seus funcionários'], ['Operador', 'O escritório, que trata os dados por conta do cliente'], ['Suboperador', 'O provedor de IA contratado pelo escritório'], ['Encarregado (DPO)', 'A pessoa indicada pelo escritório como contato para dados pessoais']],
          explain: 'Os papéis definem quem decide, quem executa e quem responde; o contrato com o cliente deve prever o uso de operadores e fornecedores.',
        },
        {
          type: 'tf',
          q: 'Para tratar os dados dos funcionários dos clientes na folha de pagamento, o escritório precisa do consentimento de cada funcionário.',
          answer: false,
          explain: 'A base legal é o cumprimento de obrigação legal e a execução do contrato; consentimento não é necessário, mas outra finalidade (marketing) exigiria outra base.',
        },
        {
          type: 'mc',
          q: 'Qual prática de gestão de segredos está correta?',
          options: ['Uma chave de API compartilhada por todas as automações, para simplificar', 'A chave de API pessoal do sócio em todos os fluxos', 'Senhas em uma planilha protegida no Drive', 'Uma credencial por automação, com escopo mínimo, guardada em cofre e rotacionada periodicamente e na saída de pessoas'],
          answer: 3,
          explain: 'Credencial por automação permite saber quem fez o quê e revogar sem derrubar tudo; cofre e rotação limitam o dano de um vazamento.',
        },
        {
          type: 'fill',
          q: 'O registro imutável de quem fez o quê, quando e com base em quê, incluindo decisões de IA e aprovações, chama-se trilha de ___.',
          answer: ['auditoria'],
          explain: 'A trilha de auditoria responde ao cliente, ao fiscal e à ANPD; precisa ser imutável e ter acesso registrado.',
        },
        {
          type: 'mc',
          q: 'Qual destas ações pode ser totalmente automatizada, sem revisão humana obrigatória?',
          options: ['Transmitir a ECD assinada', 'Classificar um documento recebido e gravá-lo na pasta do cliente', 'Enviar orientação fiscal personalizada ao cliente gerada por IA', 'Assinar demonstrações contábeis'],
          answer: 1,
          explain: 'Classificar e arquivar é ato de leitura e organização; transmitir, assinar e orientar são atos de responsabilidade técnica do contador e exigem revisão.',
        },
        {
          type: 'write',
          q: 'Escreva a seção "Dados" e a seção "Revisão humana obrigatória" da política de automação do seu escritório, em 4 a 8 frases.',
          model: 'Dados: toda automação acessa apenas os campos necessários à sua finalidade; CPF, dados de saúde e biometria nunca são enviados a provedores de IA externos; quando possível, identificadores internos substituem dados pessoais antes do envio. Revisão humana obrigatória: nenhuma declaração, guia ou demonstração é transmitida ou assinada sem conferência registrada pelo contador responsável; orientações fiscais personalizadas geradas por IA passam por revisão antes de chegar ao cliente; ações de pagamento ou envio ao fisco nunca são executadas por agentes sem aprovação.',
          checklist: ['Citou minimização e o que nunca vai para IA externa?', 'Listou os atos que exigem assinatura ou conferência do contador?', 'Deixou claro que a responsabilidade técnica continua humana?'],
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'au-06-07',
      title: 'Medir resultados e vender automação',
      minutes: 25,
      content: 'content/automacao/au-06/07-medir-resultados-e-vender.md',
      exercises: [
        {
          type: 'mc',
          q: 'Por que medir o processo manual durante duas semanas antes de automatizar?',
          options: ['Para ter um baseline: sem ele, não há como provar o ganho depois', 'Para atrasar o projeto', 'Porque a lei exige', 'Para treinar a equipe'],
          answer: 0,
          explain: 'Horas, erros, prazo e satisfação medidos antes são a referência contra a qual o resultado da automação é comparado.',
        },
        {
          type: 'mc',
          q: 'Uma automação gera R$ 3.000 de ganho por mês e custa R$ 500 mensais; o projeto custou R$ 15.000. Qual é o payback aproximado?',
          options: ['3 meses', '5 meses', '6 meses', '10 meses'],
          answer: 2,
          explain: 'Ganho líquido mensal = 3.000 − 500 = 2.500; payback = 15.000 ÷ 2.500 = 6 meses.',
        },
        {
          type: 'tf',
          q: 'Horas economizadas só devem entrar no cálculo de ROI quando forem realocadas para outro trabalho ou reduzirem hora extra.',
          answer: true,
          explain: 'Hora "economizada" que vira ociosidade não é dinheiro; o ganho real vem de atender mais clientes, fazer consultoria ou cortar hora extra.',
        },
        {
          type: 'match',
          q: 'Relacione o modelo de preço à situação adequada.',
          pairs: [['Projeto fechado', 'Escopo claro e implantação única'], ['Mensalidade', 'Operação e manutenção contínuas com relação de longo prazo'], ['Por processo ou documento', 'Preço alinhado ao volume, com medição confiável e mínimo mensal']],
          explain: 'O mais comum para escritórios é implantação (projeto) mais mensalidade, que paga a manutenção recorrente.',
        },
        {
          type: 'fill',
          q: 'O acordo que define prazos e disponibilidade mensuráveis (por exemplo, documento processado em até 24 horas úteis) chama-se ___.',
          answer: ['SLA', 'acordo de nível de serviço', 'acordo de nivel de servico'],
          explain: 'SLA só vale com métrica coletada; prometer o que não se mede é promessa vazia.',
        },
        {
          type: 'mc',
          q: 'Qual cláusula protege o escritório quando o governo muda o layout de um portal e o robô para de funcionar?',
          options: ['Cláusula de confidencialidade', 'Cláusula de propriedade do código', 'Cláusula de foro', 'Cláusula de manutenção que define o que está incluído (correções) e o que não está (mudanças de sistemas externos), e como se cobra o excedente'],
          answer: 3,
          explain: 'Mudanças externas são imprevisíveis; o contrato precisa dizer quem paga a adaptação para não virar prejuízo nem briga.',
        },
        {
          type: 'write',
          q: 'Escreva, em até 6 frases, a apresentação de resultados de uma automação para os sócios, com antes, depois e ROI em números.',
          model: 'Antes: a conciliação de 40 clientes consumia 60 horas por mês, com três erros mensais e prazo médio de 12 dias. Depois: 10 horas de revisão, zero erros em três meses, prazo de 6 dias. As 50 horas liberadas foram realocadas para dois clientes novos. Ganho mensal de R$ 3.450 contra custo mensal de R$ 600; o projeto de R$ 18.000 se pagou em sete meses. Proposta: oferecer conciliação e caixa diário à carteira por mensalidade.',
          checklist: ['Tem baseline (antes) com números?', 'Tem resultado (depois) nas mesmas medidas?', 'Tem custo mensal, custo do projeto e payback?', 'Termina com uma proposta de próximo passo?'],
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'au-06-08',
      title: 'Carreira e comunidade',
      minutes: 25,
      content: 'content/automacao/au-06/08-carreira-e-comunidade.md',
      exercises: [
        {
          type: 'match',
          q: 'Relacione o papel à atividade principal.',
          pairs: [['Analista de automação', 'Mapeia processos e monta fluxos em ferramentas low-code, medindo resultados'], ['Desenvolvedor RPA', 'Constrói e mantém robôs de tela'], ['Engenheiro de IA', 'Integra modelos em produtos com prompts, RAG, agentes e avaliação'], ['AI ops', 'Opera esteiras e agentes em produção: filas, observabilidade, incidentes']],
          explain: 'Os papéis se sobrepõem; o contador que automatiza combina o domínio do processo com qualquer um deles.',
        },
        {
          type: 'mc',
          q: 'Qual é a vantagem competitiva do contador que faz este curso, segundo a lição?',
          options: ['Programar mais rápido que desenvolvedores', 'Entender o processo fiscal e conseguir automatizá-lo, combinação rara no mercado', 'Conhecer todos os frameworks de agentes', 'Ter mais certificações'],
          answer: 1,
          explain: 'Programadores sobram; quem conhece o processo contábil e consegue automatizá-lo é raro e costuma ser a pessoa certa para liderar a automação do escritório.',
        },
        {
          type: 'order',
          q: 'Ordene a trilha de seis meses proposta na lição.',
          items: ['Automatizar um processo de ponta a ponta com esteira, logs e painel', 'Aprofundar uma ferramenta (n8n ou Python)', 'Operar sem você: alertas, runbooks, incidente real', 'Avaliar a IA com 30 a 50 casos de teste', 'Contar a história com números e publicar um caso anonimizado'],
          explain: 'A trilha vai de entregar para operar, depois medir e, por fim, comunicar; cada etapa depende da anterior.',
        },
        {
          type: 'tf',
          q: 'Uma coleção de certificações substitui um portfólio de casos entregues.',
          answer: false,
          explain: 'Certificação abre portas, mas quem contrata ou compra quer ver casos com números; priorize a certificação da ferramenta que você usa de fato.',
        },
        {
          type: 'mc',
          q: 'Como publicar um caso no portfólio sem violar a LGPD e a confiança do cliente?',
          options: ['Publicar o fluxo completo com as credenciais removidas', 'Publicar só o nome do cliente, sem números', 'Anonimizar (sem CNPJ, nomes ou valores identificáveis), usar dados inventados nas capturas e pedir autorização quando o caso for reconhecível', 'Não publicar nada nunca'],
          answer: 2,
          explain: 'O caso vale pela estrutura e pelos resultados; dados reais do cliente nunca entram, e código publicado é só o genérico.',
        },
        {
          type: 'fill',
          q: 'Modelos abertos rodando no servidor do próprio escritório, para dados que não podem sair, são a tendência chamada IA ___.',
          answer: ['local'],
          explain: 'IA local atende restrições de LGPD e contrato e fica mais barata a cada ano; combina com classificação e extração de documentos.',
        },
        {
          type: 'mc',
          q: 'Por que o curso insistiu em princípios (idempotência, estados, logs, menor privilégio, revisão humana) mais do que em ferramentas?',
          options: ['Porque não dá para prever qual framework ou modelo vai dominar, e os princípios sobrevivem às trocas de ferramenta', 'Porque ferramentas são difíceis', 'Porque princípios caem em certificações', 'Porque ferramentas não funcionam no Brasil'],
          answer: 0,
          explain: 'Frameworks, modelos e preços mudam a cada poucos meses; os princípios de engenharia transferem de uma ferramenta para outra.',
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'au-06-09',
      title: 'Projeto final: esteira de fechamento mensal',
      minutes: 28,
      content: 'content/automacao/au-06/09-projeto-final-esteira-de-fechamento.md',
      exercises: [
        {
          type: 'mc',
          q: 'Por que a validação final do lote é determinística e nunca feita pela IA?',
          options: ['Porque a IA é lenta', 'Porque a IA não lê JSON', 'Porque o sistema contábil exige', 'Porque um erro no arquivo de importação vira centenas de lançamentos errados; regras fixas e testadas são previsíveis e auditáveis'],
          answer: 3,
          explain: 'A IA classifica, extrai e sugere; o que entra no sistema contábil passa por regras determinísticas, testadas e registradas na trilha.',
        },
        {
          type: 'code',
          q: 'Escreva `validar_lote(lote, competencia, cnpj_cliente)` que devolve uma lista de erros (vazia = aprovado). Se `competencia` não estiver no formato AAAA-MM (mês 01 a 12), devolva apenas ["competencia invalida"]. Para cada documento (dict com chave, tipo, cnpj_cliente, competencia, valor, status), numerado a partir de 1, gere mensagens no formato "doc N: MOTIVO" com os motivos, nesta ordem: "tipo desconhecido" se tipo não está em {"nfe", "nfse", "extrato", "recibo"}; "cnpj diferente" se cnpj_cliente difere do parâmetro; "competencia diferente" se a competência do documento difere da do lote; "valor invalido" se valor não é int/float ou é menor ou igual a zero; "cancelado" se status == "cancelado"; "chave duplicada" se a chave já apareceu em documento anterior do lote.',
          starter: `import re

TIPOS = {"nfe", "nfse", "extrato", "recibo"}

def validar_lote(lote, competencia, cnpj_cliente):
    pass
`,
          tests: `ok = [
    {"chave": "A1", "tipo": "nfe", "cnpj_cliente": "11222333000181", "competencia": "2026-09", "valor": 1200.0, "status": "autorizado"},
    {"chave": "A2", "tipo": "extrato", "cnpj_cliente": "11222333000181", "competencia": "2026-09", "valor": 300, "status": "ok"},
]
assert validar_lote(ok, "2026-09", "11222333000181") == [], "Lote correto deve devolver lista vazia"
assert validar_lote(ok, "09/2026", "11222333000181") == ["competencia invalida"], "Competencia fora do formato deve devolver so esse erro"
assert validar_lote(ok, "2026-13", "11222333000181") == ["competencia invalida"], "Mes 13 e invalido"
ruim = [
    {"chave": "A1", "tipo": "nfe", "cnpj_cliente": "11222333000181", "competencia": "2026-09", "valor": 1200.0, "status": "autorizado"},
    {"chave": "A2", "tipo": "nfse", "cnpj_cliente": "11222333000181", "competencia": "2026-09", "valor": 500.0, "status": "cancelado"},
    {"chave": "A1", "tipo": "boleto", "cnpj_cliente": "99888777000166", "competencia": "2026-08", "valor": 0, "status": "autorizado"},
]
r = validar_lote(ruim, "2026-09", "11222333000181")
esperado = ["doc 2: cancelado", "doc 3: tipo desconhecido", "doc 3: cnpj diferente", "doc 3: competencia diferente", "doc 3: valor invalido", "doc 3: chave duplicada"]
assert r == esperado, "Erros esperados: " + str(esperado) + ", obtido: " + str(r)
r2 = validar_lote([{"chave": "B1", "tipo": "recibo", "cnpj_cliente": "1", "competencia": "2026-09", "valor": "10", "status": "ok"}], "2026-09", "1")
assert r2 == ["doc 1: valor invalido"], "Valor em texto e invalido, obtido: " + str(r2)
`,
          solution: `import re

TIPOS = {"nfe", "nfse", "extrato", "recibo"}

def validar_lote(lote, competencia, cnpj_cliente):
    if not re.fullmatch(r"\\d{4}-(0[1-9]|1[0-2])", str(competencia)):
        return ["competencia invalida"]
    erros = []
    vistos = set()
    for i, doc in enumerate(lote, 1):
        ref = f"doc {i}"
        if doc.get("tipo") not in TIPOS:
            erros.append(f"{ref}: tipo desconhecido")
        if doc.get("cnpj_cliente") != cnpj_cliente:
            erros.append(f"{ref}: cnpj diferente")
        if doc.get("competencia") != competencia:
            erros.append(f"{ref}: competencia diferente")
        valor = doc.get("valor")
        if not isinstance(valor, (int, float)) or isinstance(valor, bool) or valor <= 0:
            erros.append(f"{ref}: valor invalido")
        if doc.get("status") == "cancelado":
            erros.append(f"{ref}: cancelado")
        chave = doc.get("chave")
        if chave in vistos:
            erros.append(f"{ref}: chave duplicada")
        vistos.add(chave)
    return erros
`,
          hint: 'Valide a competência com re.fullmatch(r"\\d{4}-(0[1-9]|1[0-2])", ...) e devolva cedo; depois percorra o lote com enumerate(lote, 1), um if por regra na ordem pedida, e um set de chaves vistas.',
          explain: 'A validação de lote é a última barreira antes do sistema contábil: regras simples, na ordem combinada, com mensagens que a pessoa da pendência entende.',
        },
        {
          type: 'match',
          q: 'Relacione o risco do projeto à mitigação.',
          pairs: [['Layout do sistema contábil muda', 'Layout versionado e teste de importação a cada sprint'], ['PDFs de baixa qualidade', 'Confiança por campo e pendência humana'], ['Certificado A1 vencido', 'Inventário e alerta com 30 dias'], ['Equipe não confia na esteira', 'Modo de ensaio, amostragem revisada e painel transparente']],
          explain: 'Cada risco tem uma mitigação concreta e barata; listá-los por sprint evita surpresas.',
        },
        {
          type: 'tf',
          q: 'Na primeira versão do projeto, é recomendável abrir a esteira para os 40 clientes de uma vez, para medir o ROI mais rápido.',
          answer: false,
          explain: 'O plano prevê 3 clientes piloto por vários sprints e abertura gradual; problemas descobertos com 3 clientes custam muito menos que com 40.',
        },
        {
          type: 'order',
          q: 'Ordene as entregas dos sprints do projeto.',
          items: ['Entradas, fila, armazenamento, banco de execuções e painel básico', 'Classificação com IA e 50 casos de teste', 'Extração de XML e OCR com validação de lote', 'Lançamento por importação e trilha de auditoria', 'Conciliação OFX', 'Guias, envio com aprovação, alertas e runbooks', 'Abertura gradual e medição de ROI'],
          explain: 'A ordem segue o fluxo do documento pela esteira; cada sprint entrega algo demonstrável sobre o anterior.',
        },
        {
          type: 'fill',
          q: 'Na rubrica do projeto, cada um dos 9 itens recebe nota de 0 a 3; a partir de ___ pontos em 27 o projeto está pronto para começar.',
          answer: ['21'],
          explain: 'A rubrica cobre objetivo, escopo, arquitetura, regras, revisão humana, validação, observabilidade, governança e plano; 21 pontos é a linha de corte.',
        },
        {
          type: 'write',
          q: 'Escreva as regras de negócio da etapa "validar" da sua esteira de fechamento: pelo menos 6 regras testáveis, cada uma em uma frase.',
          model: '1. A competência é a data de emissão do documento. 2. Nota com cStat diferente de 100 não entra e vai para pendência com o motivo. 3. Nota cujo destinatário (entrada) ou emitente (saída) não é o CNPJ do cliente vai para pendência. 4. Documento com a mesma chave ou o mesmo hash de outro já recebido é descartado com registro. 5. Divergência maior que R$ 0,01 entre a soma dos itens e o total da nota vai para pendência. 6. Extrato sem FITID em todas as transações é rejeitado. 7. Nenhum lote é lançado com qualquer erro grave; os documentos válidos seguem em novo lote.',
          checklist: ['Cada regra é verificável por código, sem julgamento subjetivo?', 'Há regra para duplicidade, cancelamento e cliente errado?', 'Diz o que acontece com o documento que falha (pendência, descarte)?'],
        },
      ],
    },
  ],
  // ====================================================================
  exam: {
    passScore: 70,
    questions: [
      {
        type: 'mc',
        q: 'Um analista que trabalha em um escritório que vive no Microsoft 365 quer uma certificação de RPA alinhada à ferramenta que usa. Qual faz mais sentido?',
        options: ['AWS Cloud Practitioner', 'Microsoft PL-500 (Power Automate RPA Developer)', 'Certificado de conclusão da Make Academy', 'Python Brasil'],
        answer: 1,
        explain: 'A lição recomenda priorizar a certificação da ferramenta que você usa de fato; para Power Automate, é a PL-500. Cloud Practitioner é de nuvem, Make Academy é sinal de domínio de outra ferramenta e Python Brasil é comunidade, não certificação.',
      },
      {
        type: 'tf',
        q: 'Com o certificado A1 do cliente, entregue ao escritório com autorização formal em contrato, é possível automatizar o download dos XMLs de NF-e pelo web service oficial da SEFAZ.',
        answer: true,
        explain: 'O web service de distribuição de DF-e é o canal previsto pelo fisco; o certificado precisa ser do CNPJ interessado, o A1 é um arquivo utilizável por programa, e a autorização formal legitima o uso pelo escritório.',
      },
      {
        type: 'mc',
        q: 'Qual é o limite real ao automatizar o e-CAC que deve ser dito ao cliente antes de vender o projeto?',
        options: ['Partes com captcha ou segundo fator (gov.br) continuam manuais; contorná-las viola os termos de uso', 'O e-CAC não aceita certificado', 'O e-CAC só funciona em horário comercial', 'O e-CAC exige UiPath'],
        answer: 0,
        explain: 'Não há automação legítima que quebre captcha ou 2FA; a proposta precisa dizer o que fica manual.',
      },
      {
        type: 'fill',
        q: 'Para encontrar elementos do XML da NF-e com xml.etree é preciso informar o ___ http://www.portalfiscal.inf.br/nfe nas buscas.',
        answer: ['namespace'],
        explain: 'Sem o namespace, find e findtext devolvem None e parece que o campo não existe.',
      },
      {
        type: 'code',
        q: 'Escreva `campos_sped(linha)` que recebe uma linha de arquivo SPED (campos separados por "|", começando e terminando com "|", podendo ter quebra de linha no final) e devolve a lista de campos como strings, sem os "|" das pontas. Campos vazios devem aparecer como "".',
        starter: `def campos_sped(linha):
    pass
`,
        tests: `assert campos_sped("|C100|1|0|F001|55|00|1|1234|") == ["C100", "1", "0", "F001", "55", "00", "1", "1234"], "Campos devem ser separados por |"
assert campos_sped("|C170|1|P1|Pao frances|100|UN|850,00|\\n") == ["C170", "1", "P1", "Pao frances", "100", "UN", "850,00"], "Deve ignorar a quebra de linha final"
assert campos_sped("|0000|020|0|01092026|30092026|PADARIA SOL|11222333000181||SP|") == ["0000", "020", "0", "01092026", "30092026", "PADARIA SOL", "11222333000181", "", "SP"], "Campo vazio (CPF) deve virar string vazia"
assert campos_sped("|C100|1|0|F001||") == ["C100", "1", "0", "F001", ""], "Campo vazio no fim da linha deve ser preservado"
assert campos_sped("|9999|12|")[0] == "9999", "O primeiro campo e o codigo do registro"
`,
        solution: `def campos_sped(linha):
    linha = linha.strip()
    if linha.startswith("|"):
        linha = linha[1:]
    if linha.endswith("|"):
        linha = linha[:-1]
    return linha.split("|")
`,
        hint: 'strip() para a quebra de linha; remova um | do início e um do fim (não use strip("|"), que apagaria campos vazios nas pontas); depois split("|").',
        explain: 'Ler registros do SPED por posição de campo é a base das conferências entre XML e EFD; o código do registro é sempre o primeiro campo.',
      },
      {
        type: 'tf',
        q: 'O CSV exportado do internet banking traz, como o OFX, um identificador único por transação, então pode ser importado sem risco de duplicidade.',
        answer: false,
        explain: 'O CSV não tem FITID e varia em colunas, separador e formato de data; para evitar importar duas vezes é preciso criar um identificador próprio (data, valor e histórico) ou preferir o OFX.',
      },
      {
        type: 'match',
        q: 'Relacione o identificador ao tipo de cobrança que ele concilia.',
        pairs: [['Nosso número', 'Boleto'], ['txid', 'Pix'], ['FITID', 'Transação do extrato OFX']],
        explain: 'Conciliar por valor apenas confunde títulos iguais; cada mecanismo tem seu identificador próprio.',
      },
      {
        type: 'mc',
        q: 'Na esteira, qual é a função correta da entrada (webhook, e-mail, pasta monitorada)?',
        options: ['Classificar e lançar o documento imediatamente', 'Enviar o documento ao cliente', 'Gerar o relatório final', 'Apenas registrar a tarefa e colocá-la na fila'],
        answer: 3,
        explain: 'A entrada que processa trava e perde eventos em picos; o processamento é dos workers, com estado no banco de execuções.',
      },
      {
        type: 'order',
        q: 'Ordene os estados de uma tarefa que falha na primeira tentativa e é concluída na segunda.',
        items: ['pendente', 'processando (tentativa 1)', 'pendente (após falha)', 'processando (tentativa 2)', 'concluida'],
        explain: 'Enquanto houver tentativas, a falha devolve a tarefa à fila; só esgotadas as tentativas ela vai para o estado falha.',
      },
      {
        type: 'mc',
        q: 'Qual métrica mostra melhor que 5% dos documentos estão demorando muito mais que o normal?',
        options: ['Média do tempo', 'p95 do tempo por etapa', 'Total de documentos', 'Custo total'],
        answer: 1,
        explain: 'O p95 é o valor abaixo do qual estão 95% das medições; ele expõe a cauda que a média esconde.',
      },
      {
        type: 'tf',
        q: 'Como o cliente é o controlador dos dados dos seus funcionários, o escritório (operador) não precisa se preocupar com o contrato do provedor de IA que usa.',
        answer: false,
        explain: 'O escritório responde pelas instruções que dá aos suboperadores; precisa garantir no contrato do provedor não uso para treinamento, retenção mínima e salvaguardas de transferência.',
      },
      {
        type: 'mc',
        q: 'Qual destes atos exige revisão e assinatura do contador, não podendo ser concluído só pela automação?',
        options: ['Classificar um XML recebido', 'Gravar um extrato na pasta do cliente', 'Transmitir a ECD', 'Gerar um resumo de pendências para a equipe'],
        answer: 2,
        explain: 'A ECD e outras declarações assinadas com certificado são atos de responsabilidade técnica do contador registrado no CRC.',
      },
      {
        type: 'code',
        q: 'Escreva `payback_meses(custo_projeto, ganho_mensal, custo_mensal)` que devolve o número de meses para recuperar o investimento (custo_projeto dividido pelo ganho líquido mensal, que é ganho_mensal menos custo_mensal), arredondado a 1 casa decimal. Se o ganho líquido for menor ou igual a zero, devolva None.',
        starter: `def payback_meses(custo_projeto, ganho_mensal, custo_mensal):
    pass
`,
        tests: `assert payback_meses(18000, 3450, 600) == 6.3, "18000 / 2850 = 6.3 meses"
assert payback_meses(15000, 3000, 500) == 6.0, "15000 / 2500 = 6.0 meses"
assert payback_meses(10000, 500, 500) is None, "Ganho liquido zero deve devolver None"
assert payback_meses(10000, 400, 600) is None, "Ganho liquido negativo deve devolver None"
assert payback_meses(1000, 1000, 0) == 1.0, "Sem custo mensal, 1 mes"
`,
        solution: `def payback_meses(custo_projeto, ganho_mensal, custo_mensal):
    liquido = ganho_mensal - custo_mensal
    if liquido <= 0:
        return None
    return round(custo_projeto / liquido, 1)
`,
        hint: 'Calcule o ganho líquido; se for <= 0, None; senão round(custo_projeto / liquido, 1).',
        explain: 'O payback é o número que o sócio entende em segundos; incluir manutenção e tokens no custo mensal é o que o torna honesto.',
      },
      {
        type: 'mc',
        q: 'Qual modelo de preço cobre melhor as 2 a 4 horas mensais de manutenção que robôs de tela exigem?',
        options: ['Mensalidade que inclui operação, manutenção e ferramentas', 'Projeto fechado sem recorrência', 'Preço por hora sem contrato', 'Gratuito, cobrando só a implantação'],
        answer: 0,
        explain: 'A mensalidade paga a manutenção recorrente e cria relação de longo prazo; o projeto fechado cobre só a implantação.',
      },
      {
        type: 'mc',
        q: 'No projeto final, por que o plano prevê três clientes piloto por vários sprints antes de abrir para a carteira?',
        options: ['Porque a API limita a três clientes', 'Porque os outros clientes não têm XML', 'Porque o ROI só pode ser medido com três clientes', 'Porque problemas descobertos com poucos clientes custam muito menos e a equipe ganha confiança antes de depender da esteira'],
        answer: 3,
        explain: 'Abertura gradual, modo de ensaio e amostragem revisada são as mitigações para o risco de confiança e para erros em escala.',
      },
    ],
  },
});
