registerModule({
  course: 'automacao',
  id: 'au-03',
  order: 3,
  level: 'Intermediário',
  title: 'Automação com Python',
  description: 'Você vai montar um ambiente de automação em Python e construir robôs que organizam pastas, consolidam planilhas, leem PDFs e guias, enviam e recebem e-mails com anexo, consultam APIs, operam portais no navegador e rodam sozinhos todo dia com log e tratamento de erros. Ao final, entrega um robô de conciliação bancária completo, testado e agendado.',
  hours: 14,
  lessons: [
    {
      id: 'au-03-01',
      title: 'Ambiente para automação',
      minutes: 27,
      content: 'content/automacao/au-03/01-ambiente-para-automacao.md',
      exercises: [
        { type: 'mc', q: 'Para que serve um ambiente virtual (venv)?', options: ['Acelerar a execução do Python', 'Isolar as bibliotecas de cada projeto, cada um com suas versões', 'Esconder o código-fonte dos colegas', 'Substituir o VS Code'], answer: 1, explain: 'O venv é uma cópia isolada do Python dentro da pasta do projeto; as bibliotecas instaladas nele não afetam outros projetos.' },
        { type: 'tf', q: 'O comando pip freeze > requirements.txt grava a lista das bibliotecas instaladas com suas versões exatas.', answer: true, explain: 'pip freeze lista pacote==versão; redirecionar para requirements.txt permite recriar o mesmo ambiente em outra máquina.' },
        { type: 'fill', q: 'Para criar o ambiente virtual na pasta do projeto usamos: python -m ___ .venv', answer: ['venv'], explain: 'O módulo venv da biblioteca padrão cria o ambiente; .venv é o nome convencional da pasta.' },
        { type: 'order', q: 'Coloque na ordem correta os passos para preparar um robô novo.', items: ['Criar a pasta do robô e abrir no VS Code', 'Criar o ambiente virtual com python -m venv .venv', 'Ativar o ambiente (.venv\\Scripts\\Activate.ps1)', 'Instalar as bibliotecas com pip install', 'Gravar as versões com pip freeze > requirements.txt'], explain: 'O ambiente precisa existir e estar ativo antes de instalar; só depois de instalar faz sentido registrar as versões.' },
        { type: 'mc', q: 'Você rodou o script e apareceu ModuleNotFoundError: No module named openpyxl, embora tenha instalado a biblioteca ontem. Causa mais provável?', options: ['O Windows apagou a biblioteca', 'O ambiente virtual não está ativo ou a biblioteca foi instalada em outro Python', 'O arquivo .py está com o nome errado', 'Falta o arquivo .env'], answer: 1, explain: 'A biblioteca foi instalada em um Python (ou venv) e o script está rodando em outro. Ative o .venv e confira com where.exe python.' },
        { type: 'match', q: 'Relacione cada arquivo da pasta do robô à sua função.', pairs: [['.env', 'Guarda senhas e chaves fora do código'], ['requirements.txt', 'Lista as bibliotecas e versões do projeto'], ['.gitignore', 'Diz o que não entra no controle de versão'], ['.venv', 'Pasta do ambiente virtual com as bibliotecas instaladas']], explain: 'Cada arquivo tem um papel: segredos, dependências, exclusões do Git e o próprio ambiente.' },
        { type: 'tf', q: 'Escrever a senha do e-mail dentro do script é aceitável desde que o arquivo fique só no seu computador.', answer: false, explain: 'O arquivo vai para backup, e-mail, repositório ou colega mais cedo ou mais tarde. Segredos ficam no .env ou em variáveis de ambiente.' },
        { type: 'mc', q: 'O que os.getenv("API_TOKEN") devolve quando a variável API_TOKEN não existe?', options: ['Uma string vazia', 'Um erro KeyError', 'None', 'O texto "API_TOKEN"'], answer: 2, explain: 'os.getenv devolve None para variável inexistente (ou o valor padrão passado como segundo argumento), por isso o script deve testar e parar com mensagem clara.' },
      ],
    },
    {
      id: 'au-03-02',
      title: 'Arquivos e pastas',
      minutes: 29,
      content: 'content/automacao/au-03/02-arquivos-e-pastas.md',
      exercises: [
        { type: 'mc', q: 'O que a expressão Path("clientes") / "padaria" / "2026-03" produz?', options: ['Uma divisão numérica, que dá erro', 'Um caminho clientes/padaria/2026-03 com o separador correto do sistema', 'Uma string com barras invertidas sempre', 'Uma lista de três pastas'], answer: 1, explain: 'A barra entre Path e strings monta o caminho usando o separador do sistema operacional (\\ no Windows, / no Linux).' },
        { type: 'fill', q: 'Para obter a extensão de um arquivo (por exemplo .pdf) usamos o atributo arquivo.___', answer: ['suffix'], explain: 'suffix devolve a extensão com o ponto; stem devolve o nome sem a extensão; name devolve o nome completo.' },
        { type: 'tf', q: 'Path.rename() funciona para mover um arquivo do disco C: para um pendrive.', answer: false, explain: 'rename falha entre discos diferentes; shutil.move resolve os dois casos (mesmo disco ou discos diferentes).' },
        { type: 'mc', q: 'O que faz destino.mkdir(parents=True, exist_ok=True)?', options: ['Cria só a última pasta e dá erro se já existir', 'Cria toda a cadeia de pastas que faltar e não reclama se já existir', 'Apaga a pasta e cria de novo', 'Cria a pasta somente se o pai existir'], answer: 1, explain: 'parents=True cria as pastas intermediárias; exist_ok=True evita o erro FileExistsError quando a pasta já está lá.' },
        {
          type: 'code',
          q: 'Escreva a função interpretar_nome(nome) que recebe um nome de arquivo no padrão cliente_competencia_tipo.extensao (ex.: "padaria-central_2026-03_das.pdf") e devolve o dicionário {"cliente": ..., "competencia": ..., "tipo": ...}. Se o nome não tiver exatamente três partes separadas por sublinhado, devolva None.',
          starter: `def interpretar_nome(nome):
    pass
`,
          tests: `assert interpretar_nome("padaria-central_2026-03_das.pdf") == {"cliente": "padaria-central", "competencia": "2026-03", "tipo": "das"}, "padaria-central_2026-03_das.pdf deveria virar dict com cliente, competencia e tipo"
assert interpretar_nome("oficina_2026-04_folha.xlsx") == {"cliente": "oficina", "competencia": "2026-04", "tipo": "folha"}, "a extensão deve ser removida do tipo"
assert interpretar_nome("foto da festa.jpg") is None, "nome fora do padrão deve devolver None"
assert interpretar_nome("a_b_c_d.pdf") is None, "quatro partes também é fora do padrão"
`,
          solution: `def interpretar_nome(nome):
    base = nome.rsplit(".", 1)[0]
    partes = base.split("_")
    if len(partes) != 3:
        return None
    cliente, competencia, tipo = partes
    return {"cliente": cliente, "competencia": competencia, "tipo": tipo}
`,
          hint: 'Tire a extensão com rsplit(".", 1)[0] e separe por "_"; confira se deu exatamente 3 partes.',
          explain: 'Separar pelo sublinhado só funciona porque o padrão de nome foi definido antes; o None sinaliza arquivo fora do padrão para tratamento manual.',
        },
        {
          type: 'code',
          q: 'Escreva nome_padrao(cliente, competencia, tipo, extensao) que monta o nome no padrão: cliente em minúsculas com espaços trocados por hífen, depois competência, depois tipo em minúsculas, separados por sublinhado, mais a extensão. Ex.: nome_padrao("Padaria Central", "2026-03", "DAS", "pdf") -> "padaria-central_2026-03_das.pdf".',
          starter: `def nome_padrao(cliente, competencia, tipo, extensao):
    pass
`,
          tests: `assert nome_padrao("Padaria Central", "2026-03", "DAS", "pdf") == "padaria-central_2026-03_das.pdf", "espaços viram hífen e tudo fica minúsculo"
assert nome_padrao("oficina", "2026-04", "folha", "xlsx") == "oficina_2026-04_folha.xlsx", "nome simples"
assert nome_padrao("Oficina do Ze", "2026-05", "Extrato", "csv") == "oficina-do-ze_2026-05_extrato.csv", "vários espaços viram vários hífens"
`,
          solution: `def nome_padrao(cliente, competencia, tipo, extensao):
    cliente = cliente.strip().lower().replace(" ", "-")
    return f"{cliente}_{competencia}_{tipo.lower()}.{extensao}"
`,
          hint: 'lower() e replace(" ", "-") no cliente; monte com f-string.',
          explain: 'Um padrão único de nome permite que pessoas e robôs encontrem o arquivo e que interpretar_nome o leia de volta.',
        },
        { type: 'mc', q: 'Qual padrão de glob lista apenas os PDFs cujo nome começa com das_?', options: ['glob("das_")', 'glob("*.pdf")', 'glob("das_*.pdf")', 'glob("das_?.pdf")'], answer: 2, explain: 'O asterisco casa qualquer sequência de caracteres; das_*.pdf exige o prefixo das_ e a extensão .pdf.' },
        { type: 'order', q: 'Ordene os passos do robô que organiza a pasta Downloads por cliente.', items: ['Percorrer os itens da pasta com iterdir()', 'Pular o que não é arquivo (is_file())', 'Descobrir o cliente pela palavra-chave no nome', 'Criar a pasta de destino com mkdir(parents=True, exist_ok=True)', 'Mover o arquivo com shutil.move'], explain: 'Primeiro se percorre e filtra; só depois de saber o destino faz sentido criar a pasta e mover.' },
      ],
    },
    {
      id: 'au-03-03',
      title: 'Planilhas: openpyxl e pandas',
      minutes: 29,
      content: 'content/automacao/au-03/03-planilhas.md',
      exercises: [
        { type: 'mc', q: 'Qual biblioteca é a escolha certa para aplicar negrito, cor de fundo e formato de moeda em células de um .xlsx?', options: ['pandas', 'openpyxl', 'csv', 'pathlib'], answer: 1, explain: 'openpyxl manipula o arquivo célula a célula, incluindo estilos; pandas trata a planilha como tabela de dados, sem formatação.' },
        { type: 'tf', q: 'Ao escrever ws["C5"] = "=SUM(C2:C4)" com openpyxl, a célula C5 já fica com o valor calculado dentro do arquivo.', answer: false, explain: 'openpyxl grava a fórmula como texto; quem calcula é o Excel ao abrir o arquivo. data_only=True só lê um resultado que o Excel já salvou.' },
        { type: 'fill', q: 'Para acrescentar uma linha inteira na próxima posição livre da planilha usamos ws.___(["Cliente", "Valor"])', answer: ['append'], explain: 'append escreve a lista como uma nova linha logo abaixo da última usada.' },
        { type: 'mc', q: 'Qual combinação de parâmetros de pd.read_csv costuma resolver um CSV exportado de sistema brasileiro?', options: ['sep=",", decimal="."', 'sep=";", decimal=",", encoding="latin-1"', 'sep="\\t", decimal=","', 'header=None, sep=";"'], answer: 1, explain: 'Sistemas nacionais costumam usar ponto e vírgula como separador, vírgula decimal e codificação latin-1 (ou utf-8).' },
        {
          type: 'code',
          q: 'Escreva total_por_cliente(texto_csv) que recebe o conteúdo de um CSV com cabeçalho cliente;valor, separador ponto e vírgula e valores no formato brasileiro (1.234,56), e devolve um dicionário {cliente: total}. Use csv.DictReader com io.StringIO.',
          starter: `import csv, io

def total_por_cliente(texto_csv):
    pass
`,
          tests: `csv1 = "cliente;valor\\npadaria;850,00\\nmercado;1.200,50\\npadaria;150,00\\n"
r = total_por_cliente(csv1)
assert r == {"padaria": 1000.0, "mercado": 1200.5}, "deve somar por cliente convertendo o formato brasileiro"
assert total_por_cliente("cliente;valor\\n") == {}, "CSV só com cabeçalho devolve dicionário vazio"
`,
          solution: `import csv, io

def total_por_cliente(texto_csv):
    totais = {}
    for linha in csv.DictReader(io.StringIO(texto_csv), delimiter=";"):
        valor = float(linha["valor"].replace(".", "").replace(",", "."))
        totais[linha["cliente"]] = totais.get(linha["cliente"], 0.0) + valor
    return totais
`,
          hint: 'csv.DictReader(io.StringIO(texto), delimiter=";"); converta o valor removendo o ponto e trocando a vírgula por ponto; some com dict.get(chave, 0).',
          explain: 'É o mesmo raciocínio do groupby do pandas, feito à mão: converter o valor e acumular por chave.',
        },
        {
          type: 'code',
          q: 'Escreva consolidar(planilhas) que recebe um dicionário {nome_arquivo: lista_de_linhas}, em que cada linha é um dict, e devolve uma única lista com todas as linhas, cada uma acrescida da chave "cliente" igual ao trecho do nome do arquivo antes do primeiro sublinhado. Não altere os dicionários originais (crie cópias).',
          starter: `def consolidar(planilhas):
    pass
`,
          tests: `entrada = {"padaria_2026-03.xlsx": [{"valor": 10}, {"valor": 20}], "mercado_2026-03.xlsx": [{"valor": 5}]}
saida_c = consolidar(entrada)
assert len(saida_c) == 3, "deve juntar todas as linhas"
assert {l["cliente"] for l in saida_c} == {"padaria", "mercado"}, "cliente vem do nome do arquivo antes do _"
assert sum(l["valor"] for l in saida_c) == 35, "os valores devem ser preservados"
assert "cliente" not in entrada["padaria_2026-03.xlsx"][0], "não altere os dicionários originais"
`,
          solution: `def consolidar(planilhas):
    geral = []
    for nome, linhas in planilhas.items():
        cliente = nome.split("_")[0]
        for linha in linhas:
            nova = dict(linha)
            nova["cliente"] = cliente
            geral.append(nova)
    return geral
`,
          hint: 'Para cada arquivo, pegue nome.split("_")[0]; para cada linha, faça dict(linha) e acrescente a chave cliente.',
          explain: 'É a versão sem pandas do pd.concat com coluna cliente; copiar o dict evita efeitos colaterais nos dados de entrada.',
        },
        { type: 'match', q: 'Relacione cada recurso do openpyxl ao que ele controla.', pairs: [['Font(bold=True)', 'Negrito e cor da letra'], ['PatternFill("solid", fgColor=...)', 'Cor de fundo da célula'], ['number_format', 'Formato de exibição, como moeda'], ['column_dimensions["A"].width', 'Largura da coluna']], explain: 'Cada estilo é um objeto ou atributo próprio aplicado à célula ou à coluna.' },
        { type: 'mc', q: 'Por que usar dtype={"cnpj": str} ao ler uma planilha com pandas?', options: ['Para o pandas ler mais rápido', 'Para não perder zeros à esquerda e manter a pontuação do CNPJ', 'Para converter o CNPJ em número', 'Porque pandas não lê colunas numéricas'], answer: 1, explain: 'Lido como número, 01234567000190 vira 1234567000190; como texto, o valor é preservado exatamente.' },
      ],
    },
    {
      id: 'au-03-04',
      title: 'PDFs e documentos',
      minutes: 31,
      content: 'content/automacao/au-03/04-pdfs-e-documentos.md',
      exercises: [
        { type: 'mc', q: 'pagina.extract_text() devolveu uma string vazia para todas as páginas. O que isso indica?', options: ['O PDF está corrompido', 'O PDF é uma imagem (escaneado) e precisa de OCR', 'A biblioteca pypdf não lê PDFs', 'O arquivo está protegido por senha'], answer: 1, explain: 'Sem camada de texto não há o que extrair; PDFs escaneados exigem OCR, assunto do módulo 4.' },
        { type: 'fill', q: 'Complete a regex que encontra datas no formato dd/mm/aaaa: re.findall(r"\\d{2}/\\d{2}/___", texto)', answer: ['\\d{4}', '\\\\d{4}', '[0-9]{4}'], explain: '\\d{4} casa exatamente quatro dígitos, o ano.' },
        { type: 'tf', q: 'Numa regex, para encontrar o texto R$ é preciso escrever R\\$, escapando o cifrão.', answer: true, explain: 'Sem a barra, $ significa fim da linha e o padrão nunca casa com o cifrão literal.' },
        { type: 'mc', q: 'O que faz escritor.append("gps.pdf") num PdfWriter do pypdf?', options: ['Anexa todas as páginas desse arquivo ao PDF que está sendo montado', 'Adiciona o texto "gps.pdf" na última página', 'Abre o arquivo para leitura', 'Divide o arquivo em páginas separadas'], answer: 0, explain: 'append recebe um caminho e anexa todas as páginas; é a base do robô que junta guias num PDF só.' },
        {
          type: 'code',
          q: 'Escreva para_float(valor_br) que converte um valor no formato brasileiro ("1.234,56", "800,00") para float (1234.56, 800.0).',
          starter: `def para_float(valor_br):
    pass
`,
          tests: `assert para_float("1.234,56") == 1234.56, "1.234,56 deve virar 1234.56"
assert para_float("800,00") == 800.0, "800,00 deve virar 800.0"
assert para_float("12.345.678,90") == 12345678.9, "vários pontos de milhar"
assert para_float("0,05") == 0.05, "valor pequeno"
`,
          solution: `def para_float(valor_br):
    return float(valor_br.replace(".", "").replace(",", "."))
`,
          hint: 'Remova os pontos primeiro, depois troque a vírgula por ponto, depois float().',
          explain: 'float() só entende ponto decimal; a ordem das substituições importa: tirar os pontos de milhar antes de trocar a vírgula.',
        },
        {
          type: 'code',
          q: 'Escreva extrair_vencimento(texto) que devolve a data no formato dd/mm/aaaa que aparece logo após a palavra "Vencimento" (com ou sem dois-pontos e espaços), ou None se não houver. Use o módulo re.',
          starter: `import re

def extrair_vencimento(texto):
    pass
`,
          tests: `t1 = "DAS\\nPeríodo: 03/2026\\nData de Vencimento: 20/04/2026\\nValor: R$ 100,00"
assert extrair_vencimento(t1) == "20/04/2026", "deve pegar a data após Vencimento, não a competência"
assert extrair_vencimento("Vencimento 05/05/2026") == "05/05/2026", "sem dois-pontos também"
assert extrair_vencimento("Valor Total: R$ 50,00") is None, "sem vencimento devolve None"
`,
          solution: `import re

def extrair_vencimento(texto):
    m = re.search(r"Vencimento:?\\s*(\\d{2}/\\d{2}/\\d{4})", texto)
    return m.group(1) if m else None
`,
          hint: 'Procure r"Vencimento:?\\s*(\\d{2}/\\d{2}/\\d{4})" com re.search e devolva group(1).',
          explain: 'Ancorar a regex na palavra Vencimento evita pegar outra data do documento, como o período de apuração.',
        },
        { type: 'match', q: 'Relacione a biblioteca à tarefa.', pairs: [['pypdf', 'Juntar, dividir e extrair texto de PDF'], ['pdfplumber', 'Extrair tabelas de PDF'], ['python-docx', 'Preencher modelos Word'], ['fpdf2', 'Gerar PDF simples do zero']], explain: 'Cada biblioteca cobre uma etapa; a maioria dos robôs combina duas ou três.' },
        { type: 'order', q: 'Ordene as etapas para ler o valor de um DAS em PDF e gravá-lo na planilha.', items: ['Abrir o PDF com PdfReader', 'Extrair o texto de todas as páginas', 'Encontrar o valor com re.search', 'Converter o formato brasileiro para float', 'Gravar na planilha com openpyxl'], explain: 'O texto precisa existir antes da regex; o valor precisa ser número antes de entrar na planilha.' },
      ],
    },
    {
      id: 'au-03-05',
      title: 'E-mail automático',
      minutes: 30,
      content: 'content/automacao/au-03/05-email-automatico.md',
      exercises: [
        { type: 'mc', q: 'Qual protocolo é usado para enviar e qual para ler e-mails?', options: ['IMAP envia, SMTP lê', 'SMTP envia, IMAP lê', 'HTTP envia, FTP lê', 'POP3 envia, SMTP lê'], answer: 1, explain: 'SMTP (Simple Mail Transfer Protocol) é o protocolo de envio; IMAP é o de leitura da caixa no servidor.' },
        { type: 'tf', q: 'No Gmail, um script pode fazer login com a senha normal da conta.', answer: false, explain: 'Gmail e Microsoft exigem senha de app (com verificação em duas etapas) ou OAuth 2.0 para acesso por programas.' },
        { type: 'fill', q: 'Para anexar um arquivo a um EmailMessage usamos msg.___(dados, maintype="application", subtype="pdf", filename="guia.pdf")', answer: ['add_attachment'], explain: 'add_attachment recebe os bytes do arquivo, o tipo e o nome que o destinatário verá.' },
        { type: 'mc', q: 'Por que usar parte.get_payload(decode=True) ao salvar um anexo?', options: ['Para comprimir o arquivo', 'Para obter os bytes originais em vez do texto codificado em base64', 'Para traduzir o nome do arquivo', 'Para marcar o e-mail como lido'], answer: 1, explain: 'Anexos viajam codificados (base64); decode=True devolve os bytes reais, que gravados em disco formam o arquivo original.' },
        {
          type: 'code',
          q: 'Escreva montar_corpo(dados, guias) que devolve o texto do e-mail: a primeira linha "Olá, {contato}," (contato vem de dados), depois uma linha por guia no formato "- NOME: R$ VALOR" com duas casas decimais e ponto, e por fim a linha "Total: R$ TOTAL" com a soma. Separe tudo com quebras de linha simples.',
          starter: `def montar_corpo(dados, guias):
    pass
`,
          tests: `corpo = montar_corpo({"contato": "Marcos"}, [{"nome": "DAS", "valor": 1234.56}, {"nome": "FGTS", "valor": 800}])
linhas = corpo.strip().split("\\n")
assert linhas[0] == "Olá, Marcos,", "primeira linha deve ser a saudação com o contato"
assert "- DAS: R$ 1234.56" in linhas, "cada guia vira uma linha - NOME: R$ VALOR"
assert "- FGTS: R$ 800.00" in linhas, "valor com duas casas decimais"
assert linhas[-1] == "Total: R$ 2034.56", "última linha é o total"
`,
          solution: `def montar_corpo(dados, guias):
    linhas = [f"Olá, {dados['contato']},"]
    for g in guias:
        linhas.append(f"- {g['nome']}: R$ {g['valor']:.2f}")
    total = sum(g["valor"] for g in guias)
    linhas.append(f"Total: R$ {total:.2f}")
    return "\\n".join(linhas)
`,
          hint: 'Monte uma lista de linhas e junte com "\\n".join; use f"{valor:.2f}" para duas casas.',
          explain: 'Separar os dados do texto fixo é o princípio do template; a lista de linhas facilita montar e testar.',
        },
        {
          type: 'code',
          q: 'Escreva filtro_imap(remetente=None, assunto=None, nao_lidas=False) que monta a string de busca do IMAP: começa com "(" e termina com ")", contém UNSEEN se nao_lidas for True, FROM "remetente" se informado e SUBJECT "assunto" se informado, nessa ordem, separados por espaço. Sem nenhum critério, devolva "(ALL)".',
          starter: `def filtro_imap(remetente=None, assunto=None, nao_lidas=False):
    pass
`,
          tests: `assert filtro_imap() == "(ALL)", "sem critérios devolve (ALL)"
assert filtro_imap(nao_lidas=True) == "(UNSEEN)", "só não lidas"
assert filtro_imap(remetente="cliente@padaria.com.br", assunto="NF", nao_lidas=True) == '(UNSEEN FROM "cliente@padaria.com.br" SUBJECT "NF")', "ordem: UNSEEN, FROM, SUBJECT"
assert filtro_imap(assunto="DAS") == '(SUBJECT "DAS")', "só assunto"
`,
          solution: `def filtro_imap(remetente=None, assunto=None, nao_lidas=False):
    partes = []
    if nao_lidas:
        partes.append("UNSEEN")
    if remetente:
        partes.append(f'FROM "{remetente}"')
    if assunto:
        partes.append(f'SUBJECT "{assunto}"')
    if not partes:
        return "(ALL)"
    return "(" + " ".join(partes) + ")"
`,
          hint: 'Acumule as partes numa lista na ordem pedida e junte com espaço entre parênteses.',
          explain: 'O IMAP usa critérios entre parênteses separados por espaço; montar a string com uma função evita erros de digitação e facilita testar.',
        },
        { type: 'match', q: 'Relacione a porta ao uso.', pairs: [['465', 'SMTP com SSL (SMTP_SSL)'], ['587', 'SMTP com STARTTLS'], ['993', 'IMAP com SSL']], explain: 'As portas padrão identificam o protocolo e o tipo de segurança da conexão.' },
        { type: 'mc', q: 'O que acontece se o Template tiver a lacuna $vencimento e o dicionário passado a substitute() não tiver essa chave?', options: ['A lacuna fica em branco', 'É levantado KeyError', 'O texto $vencimento é enviado como está', 'O Python usa None no lugar'], answer: 1, explain: 'substitute exige todas as chaves; o erro impede mandar um e-mail com lacuna. safe_substitute deixaria o $vencimento no texto.' },
      ],
    },
    {
      id: 'au-03-06',
      title: 'APIs com requests',
      minutes: 30,
      content: 'content/automacao/au-03/06-apis-com-requests.md',
      exercises: [
        { type: 'mc', q: 'Por que todo requests.get deve ter timeout?', options: ['Para a resposta vir mais rápida', 'Para o script não ficar travado para sempre se o servidor não responder', 'Porque sem ele o requests não envia a requisição', 'Para economizar tokens'], answer: 1, explain: 'Sem timeout, um servidor mudo prende o robô indefinidamente; com timeout, estoura uma exceção que você trata.' },
        { type: 'tf', q: 'resposta.raise_for_status() levanta uma exceção quando o status é 404 ou 500.', answer: true, explain: 'raise_for_status transforma qualquer status 4xx ou 5xx em HTTPError, evitando ler um JSON de erro como se fosse sucesso.' },
        { type: 'fill', q: 'Para enviar um dicionário como corpo JSON num POST: requests.post(url, ___=payload, timeout=15)', answer: ['json'], explain: 'json=payload serializa o dicionário e define o cabeçalho Content-Type: application/json; data= enviaria como formulário.' },
        { type: 'mc', q: 'Como o ViaCEP sinaliza um CEP inexistente?', options: ['Status 404', 'Status 200 com {"erro": "true"} no JSON', 'Status 500', 'Resposta vazia'], answer: 1, explain: 'O ViaCEP responde 200 com a chave erro (valor "true"); por isso é preciso conferir o conteúdo do JSON, não só o status.' },
        {
          type: 'code',
          q: 'Escreva cnpjs_ativos(json_texto) que recebe o texto JSON de uma resposta no formato {"dados": [{"cnpj": "...", "situacao": "ATIVA"}, ...]} e devolve a lista dos CNPJs cuja situacao é "ATIVA", na ordem em que aparecem.',
          starter: `import json

def cnpjs_ativos(json_texto):
    pass
`,
          tests: `txt = '{"dados": [{"cnpj": "111", "situacao": "ATIVA"}, {"cnpj": "222", "situacao": "BAIXADA"}, {"cnpj": "333", "situacao": "ATIVA"}]}'
assert cnpjs_ativos(txt) == ["111", "333"], "deve filtrar só as ATIVAS mantendo a ordem"
assert cnpjs_ativos('{"dados": []}') == [], "lista vazia devolve lista vazia"
`,
          solution: `import json

def cnpjs_ativos(json_texto):
    empresas = json.loads(json_texto)["dados"]
    return [e["cnpj"] for e in empresas if e["situacao"] == "ATIVA"]
`,
          hint: 'json.loads converte o texto em dict; depois uma list comprehension com if.',
          explain: 'Processar a resposta é Python comum depois do json.loads; a rede é só o transporte.',
        },
        {
          type: 'code',
          q: 'Escreva espera_para(status, cabecalhos, tentativa) que implementa a regra de rate limit: se status não for 429, devolva None; se for 429, devolva o inteiro do cabeçalho "Retry-After" quando existir, senão 2 ** tentativa.',
          starter: `def espera_para(status, cabecalhos, tentativa):
    pass
`,
          tests: `assert espera_para(200, {}, 0) is None, "status diferente de 429 não espera"
assert espera_para(429, {"Retry-After": "7"}, 0) == 7, "usa o Retry-After quando existe"
assert espera_para(429, {}, 3) == 8, "sem Retry-After, 2 ** tentativa"
assert espera_para(429, {}, 0) == 1, "2 ** 0 é 1"
`,
          solution: `def espera_para(status, cabecalhos, tentativa):
    if status != 429:
        return None
    return int(cabecalhos.get("Retry-After", 2 ** tentativa))
`,
          hint: 'cabecalhos.get("Retry-After", 2 ** tentativa) e converta com int().',
          explain: 'Respeitar o Retry-After e crescer a espera exponencialmente é o comportamento esperado por APIs com limite de requisições.',
        },
        { type: 'order', q: 'Ordene os passos de um laço de paginação.', items: ['Começar com pagina = 1 e lista vazia', 'Pedir a página atual com params={"pagina": pagina}', 'Se o lote vier vazio, parar o laço', 'Acrescentar o lote à lista', 'Incrementar pagina e repetir'], explain: 'A condição de parada (lote vazio) é testada antes de acumular; só então se avança para a próxima página.' },
        { type: 'mc', q: 'Em qual ordem os blocos except devem aparecer ao tratar erros do requests?', options: ['RequestException primeiro, depois Timeout e HTTPError', 'Timeout e HTTPError primeiro, RequestException por último', 'A ordem não importa', 'Só RequestException, os outros são iguais'], answer: 1, explain: 'RequestException é a classe mãe; se vier primeiro, captura tudo e os except específicos nunca executam.' },
      ],
    },
    {
      id: 'au-03-07',
      title: 'Web scraping e automação de navegador',
      minutes: 32,
      content: 'content/automacao/au-03/07-web-scraping-e-navegador.md',
      exercises: [
        { type: 'mc', q: 'O que é o arquivo robots.txt de um site?', options: ['Uma lei que proíbe robôs', 'A declaração do dono do site sobre quais caminhos não quer que robôs acessem', 'Um arquivo que bloqueia tecnicamente qualquer acesso automatizado', 'A lista de APIs disponíveis'], answer: 1, explain: 'robots.txt expressa a vontade do dono; não é bloqueio técnico nem lei, mas ignorá-lo pesa contra você e fere a boa prática.' },
        { type: 'tf', q: 'O Playwright espera automaticamente o elemento ficar visível e habilitado antes de clicar ou digitar.', answer: true, explain: 'As ações do Playwright têm espera automática; esperas explícitas (wait_for_url, wait_for_selector) servem para situações além disso.' },
        { type: 'fill', q: 'Para localizar um botão pelo papel e pelo texto visível: pagina.get_by_role("button", ___="Exportar")', answer: ['name'], explain: 'name é o nome acessível do elemento, normalmente o texto do botão; é um seletor estável.' },
        { type: 'mc', q: 'Qual seletor tende a sobreviver melhor a mudanças de layout do portal?', options: ['div > div:nth-child(3) > span > button', 'get_by_role("button", name="Exportar")', 'xpath=/html/body/div[2]/form/button[1]', 'Clicar nas coordenadas x=420, y=310'], answer: 1, explain: 'Localizar pelo papel e pelo texto visível não depende da estrutura interna da página, que muda a cada redesenho.' },
        {
          type: 'code',
          q: 'Usando html.parser, escreva extrair_links(html) que devolve a lista dos valores do atributo href de todas as tags <a>, na ordem em que aparecem.',
          starter: `from html.parser import HTMLParser

def extrair_links(html):
    pass
`,
          tests: `h = '<p>Guias: <a href="das.pdf">DAS</a> e <a href="/gps.pdf">GPS</a></p><a>sem href</a>'
assert extrair_links(h) == ["das.pdf", "/gps.pdf"], "deve listar os href na ordem, ignorando <a> sem href"
assert extrair_links("<p>nada</p>") == [], "sem links devolve lista vazia"
assert extrair_links('<a class="btn" href="a.pdf">x</a>') == ["a.pdf"], "href pode não ser o primeiro atributo da tag"
`,
          solution: `from html.parser import HTMLParser

class _Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
    def handle_starttag(self, tag, attrs):
        if tag == "a":
            for nome, valor in attrs:
                if nome == "href" and valor is not None:
                    self.links.append(valor)

def extrair_links(html):
    p = _Links()
    p.feed(html)
    return p.links
`,
          hint: 'Crie uma subclasse de HTMLParser com handle_starttag; attrs é uma lista de pares (nome, valor).',
          explain: 'handle_starttag recebe cada tag de abertura com seus atributos; basta guardar o href das tags a.',
        },
        {
          type: 'code',
          q: 'Escreva extrair_tabela(html) que, com html.parser, devolve uma lista de linhas, cada linha sendo a lista dos textos (sem espaços nas pontas) das células <td> e <th> de uma <tr>. Linhas sem células devem ser ignoradas.',
          starter: `from html.parser import HTMLParser

class LeitorTabela(HTMLParser):
    def __init__(self):
        super().__init__()
        self.linhas = []
        self.linha_atual = []
        self.na_celula = False
    # implemente handle_starttag, handle_data e handle_endtag

def extrair_tabela(html):
    pass
`,
          tests: `h = "<table><tr><th>Índice</th><th>Valor</th></tr><tr><td> SELIC </td><td>0,95%</td></tr><tr></tr></table>"
assert extrair_tabela(h) == [["Índice", "Valor"], ["SELIC", "0,95%"]], "cabeçalho e dados, sem espaços nas pontas, sem linhas vazias"
assert extrair_tabela("<p>sem tabela</p>") == [], "sem tabela devolve lista vazia"
`,
          solution: `from html.parser import HTMLParser

class LeitorTabela(HTMLParser):
    def __init__(self):
        super().__init__()
        self.linhas = []
        self.linha_atual = []
        self.na_celula = False
    def handle_starttag(self, tag, attrs):
        if tag == "tr":
            self.linha_atual = []
        if tag in ("td", "th"):
            self.na_celula = True
    def handle_data(self, dados):
        if self.na_celula and dados.strip():
            self.linha_atual.append(dados.strip())
    def handle_endtag(self, tag):
        if tag in ("td", "th"):
            self.na_celula = False
        if tag == "tr" and self.linha_atual:
            self.linhas.append(self.linha_atual)

def extrair_tabela(html):
    p = LeitorTabela()
    p.feed(html)
    return p.linhas
`,
          hint: 'Em tr abra uma linha nova; em td/th ligue na_celula; em handle_data guarde o texto se estiver numa célula; ao fechar tr, acrescente a linha se não estiver vazia.',
          explain: 'O parser dispara eventos por tag; manter o estado (estou numa célula? qual linha?) é o padrão para montar a tabela.',
        },
        { type: 'mc', q: 'O portal mostra um captcha no login. Qual é a conduta correta para o robô?', options: ['Usar um serviço pago que resolve captchas automaticamente', 'Deixar o robô preencher tudo e chamar uma pessoa para resolver o captcha, ou buscar API oficial', 'Tentar mil vezes até passar', 'Copiar o cookie de sessão de outro usuário'], answer: 1, explain: 'Captcha existe para barrar robôs; burlá-lo viola termos e é instável. O caminho legítimo é API oficial ou intervenção humana naquela etapa.' },
        { type: 'match', q: 'Relacione o recurso do Playwright à sua função.', pairs: [['get_by_label("CNPJ")', 'Localiza um campo pelo rótulo visível'], ['expect_download()', 'Captura o arquivo que um clique dispara'], ['wait_for_url("**/painel")', 'Espera a navegação chegar a uma página'], ['headless=True', 'Roda o navegador sem mostrar a janela']], explain: 'Cada recurso resolve um passo: localizar, baixar, esperar, mostrar ou não a janela.' },
      ],
    },
    {
      id: 'au-03-08',
      title: 'Agendar, registrar e empacotar',
      minutes: 31,
      content: 'content/automacao/au-03/08-agendar-registrar-empacotar.md',
      exercises: [
        { type: 'mc', q: 'No Agendador de Tarefas do Windows, o campo "Programa" de um robô Python deve apontar para:', options: ['O arquivo robo.py', 'O python.exe dentro do .venv do projeto', 'O VS Code', 'O arquivo requirements.txt'], answer: 1, explain: 'O Agendador precisa do executável; usando o Python do .venv, as bibliotecas do projeto estão disponíveis. O robo.py vai em Argumentos.' },
        { type: 'fill', q: 'Complete a linha do cron para rodar às 07:00 de segunda a sexta: 0 7 * * ___', answer: ['1-5'], explain: 'O quinto campo é o dia da semana; 1 é segunda e 5 é sexta, e o hífen indica intervalo.' },
        { type: 'tf', q: 'logging.exception("falha") dentro de um except grava a mensagem e também a pilha completa do erro.', answer: true, explain: 'exception é um error com traceback anexado; é a forma certa de registrar um erro inesperado.' },
        { type: 'mc', q: 'Qual é o problema de except Exception: pass?', options: ['Dá erro de sintaxe', 'O erro desaparece sem registro e o problema só é descoberto muito depois', 'Faz o script rodar mais devagar', 'Impede o uso de logging'], answer: 1, explain: 'Engolir a exceção esconde a falha; o certo é registrar (logging.exception) e decidir se continua ou para.' },
        {
          type: 'code',
          q: 'Escreva processar_lote(itens, func) que chama func(item) para cada item. Se der certo, guarda o item em sucesso; se func levantar qualquer exceção, guarda (item, str(erro)) em falhas e continua com o próximo. Devolva a tupla (sucesso, falhas).',
          starter: `def processar_lote(itens, func):
    pass
`,
          tests: `def f(x):
    if x == "oficina":
        raise FileNotFoundError("planilha ausente")
    if x == "zero":
        raise ValueError("valor zero")
    return x.upper()
ok, ruim = processar_lote(["padaria", "oficina", "mercado", "zero"], f)
assert ok == ["padaria", "mercado"], "itens sem erro vão para sucesso, na ordem"
assert ruim == [("oficina", "planilha ausente"), ("zero", "valor zero")], "falhas guardam (item, mensagem) e o lote continua"
assert processar_lote([], f) == ([], []), "lote vazio devolve listas vazias"
`,
          solution: `def processar_lote(itens, func):
    sucesso, falhas = [], []
    for item in itens:
        try:
            func(item)
            sucesso.append(item)
        except Exception as e:
            falhas.append((item, str(e)))
    return sucesso, falhas
`,
          hint: 'try/except Exception as e dentro do for; str(e) dá a mensagem.',
          explain: 'Capturar por item é o que impede um cliente com problema de derrubar o lote inteiro; a lista de falhas alimenta a notificação.',
        },
        {
          type: 'code',
          q: 'Escreva criar_parser() que devolve um argparse.ArgumentParser com: --competencia (texto, padrão "atual"), --cliente (texto, padrão None) e --simular (flag booleana, False por padrão).',
          starter: `import argparse

def criar_parser():
    pass
`,
          tests: `p = criar_parser()
a = p.parse_args([])
assert a.competencia == "atual" and a.cliente is None and a.simular is False, "valores padrão: atual, None, False"
b = p.parse_args(["--competencia", "2026-03", "--cliente", "padaria", "--simular"])
assert b.competencia == "2026-03" and b.cliente == "padaria" and b.simular is True, "os três parâmetros devem ser lidos"
`,
          solution: `import argparse

def criar_parser():
    parser = argparse.ArgumentParser(description="Robô do escritório")
    parser.add_argument("--competencia", default="atual")
    parser.add_argument("--cliente", default=None)
    parser.add_argument("--simular", action="store_true")
    return parser
`,
          hint: 'add_argument com default para os textos e action="store_true" para a flag.',
          explain: 'argparse transforma o script em ferramenta de linha de comando com ajuda automática; --simular permite rodar sem efeitos colaterais.',
        },
        { type: 'match', q: 'Relacione o nível de log ao uso.', pairs: [['DEBUG', 'Detalhe para depurar, normalmente desligado'], ['INFO', 'O que aconteceu de normal'], ['WARNING', 'Algo estranho, mas o robô seguiu'], ['ERROR', 'Uma etapa falhou']], explain: 'Os níveis permitem filtrar: em produção, INFO para cima; ao investigar, DEBUG.' },
        { type: 'mc', q: 'Qual destas é uma limitação real do PyInstaller?', options: ['Só funciona no Linux', 'O executável fica grande e antivírus podem bloqueá-lo; .env e dados precisam ficar ao lado', 'Não aceita bibliotecas externas', 'Exige que o colega instale o Python mesmo assim'], answer: 1, explain: 'PyInstaller embute o Python e as bibliotecas (tamanho), gera executáveis desconhecidos para antivírus e não inclui arquivos de configuração.' },
      ],
    },
    {
      id: 'au-03-09',
      title: 'Projeto guiado: Robô de conciliação',
      minutes: 28,
      content: 'content/automacao/au-03/09-projeto-robo-de-conciliacao.md',
      exercises: [
        {
          type: 'code',
          q: 'Escreva casar(extrato, lancamentos, tolerancia_dias=2). Cada item é um dict com "data" (datetime.date) e "valor" (float). Um movimento do extrato casa com um lançamento se os valores arredondados em 2 casas forem iguais e a diferença de dias (em módulo) for no máximo tolerancia_dias. Cada lançamento só pode ser usado uma vez. Devolva (conciliados, so_extrato, so_planilha), em que conciliados é lista de tuplas (movimento, lancamento).',
          starter: `from datetime import date

def casar(extrato, lancamentos, tolerancia_dias=2):
    pass
`,
          tests: `from datetime import date
e = [{"data": date(2026, 3, 5), "valor": -150.0}, {"data": date(2026, 3, 6), "valor": 2500.0}, {"data": date(2026, 3, 7), "valor": -150.0}]
p = [{"data": date(2026, 3, 4), "valor": -150.0}, {"data": date(2026, 3, 10), "valor": -80.0}]
c, se, sp = casar(e, p)
assert len(c) == 1 and c[0][0] is e[0] and c[0][1] is p[0], "o movimento de 05/03 casa com o lançamento de 04/03 (1 dia, mesmo valor)"
assert se == [e[1], e[2]], "o PIX e o segundo -150 ficam só no extrato (lançamento já usado)"
assert sp == [p[1]], "a tarifa fica só na planilha"
c2, se2, sp2 = casar([{"data": date(2026, 3, 5), "valor": 100.004}], [{"data": date(2026, 3, 5), "valor": 100.0}])
assert len(c2) == 1, "valores devem ser comparados com round(..., 2)"
c3, se3, sp3 = casar([{"data": date(2026, 3, 5), "valor": 100.0}], [{"data": date(2026, 3, 9), "valor": 100.0}])
assert len(c3) == 0 and len(se3) == 1 and len(sp3) == 1, "4 dias de diferença excede a tolerância de 2"
`,
          solution: `from datetime import date

def casar(extrato, lancamentos, tolerancia_dias=2):
    usados = set()
    conciliados, so_extrato = [], []
    for mov in extrato:
        achou = None
        for i, lan in enumerate(lancamentos):
            if i in usados:
                continue
            mesmo_valor = round(mov["valor"], 2) == round(lan["valor"], 2)
            dias = abs((mov["data"] - lan["data"]).days)
            if mesmo_valor and dias <= tolerancia_dias:
                achou = i
                break
        if achou is None:
            so_extrato.append(mov)
        else:
            usados.add(achou)
            conciliados.append((mov, lancamentos[achou]))
    so_planilha = [lan for i, lan in enumerate(lancamentos) if i not in usados]
    return conciliados, so_extrato, so_planilha
`,
          hint: 'Guarde os índices já usados num set; para cada movimento, procure o primeiro lançamento livre com mesmo valor arredondado e diferença de dias dentro da tolerância.',
          explain: 'O set de usados garante casamento um-para-um; arredondar evita falhas de ponto flutuante; a tolerância cobre compensação de boletos.',
        },
        {
          type: 'code',
          q: 'Escreva ler_ofx(texto) que extrai de cada bloco <STMTTRN>...</STMTTRN> um dicionário {"data": "AAAA-MM-DD", "valor": float, "descricao": str}, usando os 8 primeiros caracteres de DTPOSTED para a data, TRNAMT para o valor e MEMO para a descrição. Use o módulo re.',
          starter: `import re

def ler_ofx(texto):
    pass
`,
          tests: `ofx = "<STMTTRN><TRNTYPE>DEBIT<DTPOSTED>20260305120000[-3:BRT]<TRNAMT>-150.00\\n<FITID>1<MEMO>PAG FORNECEDOR</STMTTRN>\\n<STMTTRN><TRNTYPE>CREDIT<DTPOSTED>20260306<TRNAMT>2500.00<FITID>2<MEMO>PIX RECEBIDO</STMTTRN>"
r = ler_ofx(ofx)
assert len(r) == 2, "dois blocos STMTTRN"
assert r[0] == {"data": "2026-03-05", "valor": -150.0, "descricao": "PAG FORNECEDOR"}, "data AAAA-MM-DD, valor float negativo, memo"
assert r[1]["data"] == "2026-03-06" and r[1]["valor"] == 2500.0 and r[1]["descricao"] == "PIX RECEBIDO", "segundo movimento"
assert ler_ofx("<OFX></OFX>") == [], "sem transações devolve lista vazia"
`,
          solution: `import re

def ler_ofx(texto):
    movimentos = []
    for bloco in re.findall(r"<STMTTRN>(.*?)</STMTTRN>", texto, re.S):
        def campo(tag):
            m = re.search(rf"<{tag}>([^<\\r\\n]+)", bloco)
            return m.group(1).strip() if m else ""
        d = campo("DTPOSTED")[:8]
        movimentos.append({"data": f"{d[:4]}-{d[4:6]}-{d[6:8]}",
                           "valor": float(campo("TRNAMT")),
                           "descricao": campo("MEMO")})
    return movimentos
`,
          hint: 'findall com r"<STMTTRN>(.*?)</STMTTRN>" e re.S; dentro de cada bloco, search por r"<TAG>([^<\\r\\n]+)".',
          explain: 'OFX é texto com tags sem fechamento; a regex por tag pega o valor até o próximo < ou quebra de linha, e os 8 primeiros dígitos da data ignoram hora e fuso.',
        },
        { type: 'mc', q: 'Por que comparar valores com round(valor, 2) em vez de == direto?', options: ['Para o código rodar mais rápido', 'Porque números decimais em float podem ter diferenças minúsculas (0.1 + 0.2 != 0.3)', 'Porque o OFX usa vírgula decimal', 'Para ignorar o sinal do valor'], answer: 1, explain: 'Float não representa centavos exatamente; arredondar em 2 casas compara o que importa, os centavos.' },
        { type: 'tf', q: 'O robô de conciliação deve corrigir sozinho as divergências que encontrar na planilha.', answer: false, explain: 'O robô reporta em três abas; a decisão sobre cada divergência é do contador. Automatizar a correção esconderia erros reais.' },
        { type: 'order', q: 'Ordene as etapas do robô de conciliação.', items: ['Ler o extrato OFX e os lançamentos da planilha', 'Casar movimentos por valor e data', 'Gerar o relatório com três abas', 'Enviar e-mail só se houver divergência', 'Em caso de falha em qualquer etapa, registrar no log e sair com código 1'], explain: 'Cada etapa consome a saída da anterior; o e-mail vem depois do relatório, e o tratamento de falha (log + código de saída 1) encerra o robô.' },
        { type: 'mc', q: 'Para que serve o conjunto usados dentro de casar()?', options: ['Para acelerar a busca', 'Para impedir que dois movimentos do extrato casem com o mesmo lançamento', 'Para guardar os movimentos sem par', 'Para ordenar os lançamentos por data'], answer: 1, explain: 'Sem ele, dois débitos de R$ 150 casariam com um único lançamento de R$ 150 e a divergência passaria despercebida.' },
        { type: 'mc', q: 'Em que situação o robô envia o e-mail de resumo?', options: ['Sempre, em toda execução', 'Só quando há divergência e não está em --simular', 'Só quando tudo conciliou', 'Só quando o extrato está vazio'], answer: 1, explain: 'Notificar só quando há o que resolver evita ruído; --simular suprime efeitos colaterais durante testes.' },
      ],
    },
  ],
  exam: {
    passScore: 70,
    questions: [
      { type: 'mc', q: 'Qual é a sequência correta para começar a usar bibliotecas num robô novo?', options: ['pip install e depois python -m venv', 'python -m venv .venv, ativar o ambiente, pip install', 'Instalar o VS Code e pronto', 'Copiar a pasta .venv de outro projeto'], answer: 1, explain: 'O ambiente virtual precisa existir e estar ativo antes de instalar, para as bibliotecas irem para o lugar certo.' },
      { type: 'tf', q: 'O arquivo .env deve ser incluído no .gitignore.', answer: true, explain: 'O .env contém segredos; o .gitignore impede que ele entre no controle de versão.' },
      { type: 'mc', q: 'Qual função move um arquivo com segurança mesmo entre discos diferentes?', options: ['Path.rename', 'shutil.move', 'Path.unlink', 'shutil.rmtree'], answer: 1, explain: 'shutil.move copia e apaga quando preciso; rename falha entre discos; unlink e rmtree apagam.' },
      { type: 'fill', q: 'Para listar todos os .xlsx inclusive dentro das subpastas usamos pasta.___("*.xlsx")', answer: ['rglob'], explain: 'rglob é a versão recursiva de glob.' },
      { type: 'mc', q: 'Como uma fórmula deve ser escrita numa célula com openpyxl?', options: ['=SOMA(C2;C4)', '=SUM(C2:C4)', 'SUM(C2:C4) sem o sinal de igual', 'Não é possível gravar fórmulas'], answer: 1, explain: 'Fórmulas vão como texto começando com =, com nomes em inglês; o Excel calcula ao abrir.' },
      { type: 'tf', q: 'Ler uma coluna de CNPJ com pandas sem dtype=str pode apagar zeros à esquerda.', answer: true, explain: 'Interpretado como número, 01234567000190 vira 1234567000190.' },
      { type: 'mc', q: 'Qual regex encontra valores como R$ 1.234,56?', options: ['r"R$ [0-9]+"', 'r"R\\$\\s?([\\d.]+,\\d{2})"', 'r"R$\\d,\\d"', 'r"\\d{2}/\\d{2}/\\d{4}"'], answer: 1, explain: 'O cifrão precisa ser escapado; [\\d.]+ cobre os pontos de milhar e ,\\d{2} os centavos.' },
      { type: 'mc', q: 'Para ler a caixa de entrada e baixar anexos, o script usa:', options: ['smtplib na porta 465', 'imaplib com IMAP4_SSL na porta 993', 'requests.get na URL do webmail', 'ftplib'], answer: 1, explain: 'IMAP é o protocolo de leitura; SMTP é só envio.' },
      { type: 'tf', q: 'Omitir o timeout em requests.get é seguro porque o requests tem um limite padrão de 30 segundos.', answer: false, explain: 'O requests não tem timeout padrão; sem ele a chamada pode esperar indefinidamente.' },
      { type: 'mc', q: 'A API respondeu 429. O que isso significa e o que fazer?', options: ['Página não encontrada; corrigir a URL', 'Excesso de requisições; esperar (Retry-After) e tentar de novo com limite de tentativas', 'Erro no servidor; desistir', 'Chave inválida; gerar outra'], answer: 1, explain: '429 Too Many Requests é limite de uso; a resposta correta é espera crescente e tentativas limitadas.' },
      { type: 'mc', q: 'Antes de automatizar a coleta de dados de um site, o que deve ser verificado?', options: ['Só se o site é bonito', 'Termos de uso, robots.txt e LGPD, e se existe API oficial', 'Se o site usa HTTPS', 'Nada; dado público é livre'], answer: 1, explain: 'As três verificações definem se a automação é permitida e responsável; API oficial é sempre preferível ao scraping.' },
      { type: 'mc', q: 'No Agendador de Tarefas, para que serve o campo "Iniciar em"?', options: ['Definir o horário de início', 'Definir a pasta de trabalho, para o .env e os caminhos relativos funcionarem', 'Escolher o usuário que executa', 'Indicar o arquivo de log'], answer: 1, explain: 'Sem a pasta de trabalho, o script roda em outro diretório e não encontra .env nem dados/entrada.' },
      {
        type: 'code',
        q: 'Escreva competencia_de_data(data_br) que recebe uma data "dd/mm/aaaa" e devolve a competência "aaaa-mm". Ex.: "20/04/2026" -> "2026-04".',
        starter: `def competencia_de_data(data_br):
    pass
`,
        tests: `assert competencia_de_data("20/04/2026") == "2026-04", "20/04/2026 -> 2026-04"
assert competencia_de_data("05/12/2025") == "2025-12", "05/12/2025 -> 2025-12"
`,
        solution: `def competencia_de_data(data_br):
    dia, mes, ano = data_br.split("/")
    return f"{ano}-{mes}"
`,
        hint: 'split("/") e monte ano-mes.',
        explain: 'A competência AAAA-MM ordena corretamente e segue o padrão de nome do módulo.',
      },
      {
        type: 'code',
        q: 'Escreva total_csv(texto) que recebe um CSV com cabeçalho descricao;valor (separador ponto e vírgula, valor no formato brasileiro) e devolve a soma dos valores como float.',
        starter: `import csv, io

def total_csv(texto):
    pass
`,
        tests: `assert total_csv("descricao;valor\\nDAS;1.234,56\\nFGTS;800,00\\n") == 2034.56, "soma 1234.56 + 800.00"
assert total_csv("descricao;valor\\n") == 0.0, "sem linhas devolve 0.0"
`,
        solution: `import csv, io

def total_csv(texto):
    total = 0.0
    for linha in csv.DictReader(io.StringIO(texto), delimiter=";"):
        total += float(linha["valor"].replace(".", "").replace(",", "."))
    return round(total, 2)
`,
        hint: 'DictReader com delimiter=";"; converta cada valor e some.',
        explain: 'csv.DictReader resolve CSVs pequenos sem pandas; a conversão do formato brasileiro é indispensável.',
      },
      {
        type: 'code',
        q: 'Escreva so_no_extrato(extrato, lancamentos) que devolve a lista dos movimentos do extrato para os quais não existe nenhum lançamento com a mesma data (string) e o mesmo valor arredondado em 2 casas. Cada item é um dict com "data" e "valor".',
        starter: `def so_no_extrato(extrato, lancamentos):
    pass
`,
        tests: `e = [{"data": "2026-03-05", "valor": -150.0}, {"data": "2026-03-06", "valor": 2500.0}]
p = [{"data": "2026-03-05", "valor": -150.004}]
assert so_no_extrato(e, p) == [e[1]], "o -150 casa (arredondado); o PIX fica só no extrato"
assert so_no_extrato(e, []) == e, "sem lançamentos, tudo fica só no extrato"
`,
        solution: `def so_no_extrato(extrato, lancamentos):
    chaves = {(l["data"], round(l["valor"], 2)) for l in lancamentos}
    return [m for m in extrato if (m["data"], round(m["valor"], 2)) not in chaves]
`,
        hint: 'Monte um set de tuplas (data, round(valor, 2)) dos lançamentos e filtre o extrato.',
        explain: 'Chaves em set tornam a verificação rápida e o arredondamento evita falhas de ponto flutuante.',
      },
    ],
  },
});
