registerModule({
  course: 'claudecode',
  id: 'cc-03',
  order: 3,
  level: 'Intermediário',
  title: 'Projetos reais com Python e Claude Code',
  description: 'Você vai aplicar um fluxo profissional (especificar, planejar, implementar em passos, testar, revisar, commitar) para construir scripts reais com o Claude Code: TDD com pytest, planilhas com openpyxl e pandas, extração de PDFs, depuração guiada, refatoração, revisão de código e entrega para colegas. Ao final, constrói do zero um conciliador bancário com testes, CLAUDE.md e commits.',
  hours: 12,
  lessons: [
    {
      id: 'cc-03-01',
      title: 'O fluxo profissional',
      minutes: 26,
      content: 'content/claudecode/cc-03/01-fluxo-profissional.md',
      exercises: [
        { type: 'order', q: 'Coloque as etapas do fluxo profissional na ordem correta.', items: ['Especificar objetivo, entradas, saídas e critérios de aceite', 'Pedir e ajustar o plano em passos', 'Implementar um passo por vez', 'Rodar testes automatizados e teste manual com amostra', 'Revisar o diff e pedir revisão crítica', 'Commitar com mensagem que explica o porquê'], explain: 'Especificar antes de planejar evita planos para o problema errado; testar antes de revisar concentra a revisão no que os testes não pegam; commitar por último garante que o histórico só tem versões aprovadas.' },
        { type: 'mc', q: 'Por que o fluxo de trabalho importa MAIS quando se usa o Claude Code do que quando se escreve o código à mão?', options: ['Porque o Claude Code não aceita pedidos sem especificação formal', 'Porque decisões que você não tomou na especificação serão tomadas pelo modelo, rapidamente e sem avisar', 'Porque a IA escreve código mais lento e o fluxo compensa o tempo', 'Porque o Git exige um plano antes de cada commit'], answer: 1, explain: 'O modelo gera muito código em segundos; cada dúvida que você não resolveu antes vira uma escolha dele, que pode ser a errada (arredondamento, linhas vazias, formato de data).' },
        { type: 'tf', q: '"O script deve tratar bem as planilhas" é um critério de aceite adequado.', answer: false, explain: 'Critério de aceite precisa ser verificável: um número, um arquivo, uma mensagem. "Tratar bem" não dá para checar; "linhas sem Valor são ignoradas e listadas no log" dá.' },
        { type: 'match', q: 'Relacione cada parte da especificação curta ao seu conteúdo.', pairs: [['Objetivo', 'O que o programa resolve e para quem'], ['Entradas', 'Arquivos, pastas e colunas que o programa recebe'], ['Saídas', 'Arquivos e formato que o programa produz'], ['Critérios de aceite', 'Frases verificáveis que definem "pronto"']], explain: 'As quatro partes respondem o quê, com o quê, produzindo o quê e como saber que terminou.' },
        { type: 'fill', q: 'Depois de aprovar o plano, o pedido correto ao Claude Code é implementar ___ passo por vez, com testes.', answer: ['um', '1', 'apenas um', 'somente um'], explain: 'Passos pequenos geram diffs pequenos, que você consegue ler inteiros e entender quando algo sai errado.' },
        { type: 'mc', q: 'O Claude propôs um plano de 6 passos. Qual é a atitude correta antes de pedir a implementação?', options: ['Aprovar imediatamente, já que o plano foi gerado a partir da especificação', 'Ler o plano, cortar ou reordenar passos e corrigir premissas erradas antes de qualquer edição', 'Pedir que ele implemente todos os passos de uma vez para ganhar tempo', 'Ignorar o plano e pedir o código direto'], answer: 1, explain: 'O plano é o momento mais barato para corrigir uma premissa errada, por exemplo de onde vem a competência; depois do código, a correção custa muito mais.' },
        { type: 'tf', q: 'É aceitável commitar o código antes de rodar os testes, desde que você rode os testes logo depois.', answer: false, explain: 'O commit deve ser o fecho do ciclo; commitar código não testado tira do histórico a garantia de que cada versão foi um ponto seguro para voltar.' },
        { type: 'write', q: 'Escreva uma especificação curta (objetivo, entradas, saídas e 3 critérios de aceite verificáveis) para um script que lê a pasta de boletos em PDF do mês e gera um CSV com vencimento e valor.', model: 'OBJETIVO: listar vencimento e valor de todos os boletos do mês para o financeiro programar pagamentos. ENTRADAS: pasta boletos/AAAA-MM com PDFs com texto. SAÍDAS: boletos-AAAA-MM.csv com arquivo;vencimento;valor. CRITÉRIOS: valor como número com duas casas (R$ 1.234,56 vira 1234.56); vencimento em AAAA-MM-DD; PDF sem vencimento ou valor é listado em erros.txt e não interrompe o script; total do CSV da amostra bate com R$ 7.890,10.', checklist: ['O objetivo diz o que e para quem?', 'Entradas e saídas têm nomes de pasta, arquivo e colunas?', 'Cada critério tem algo checável (número, arquivo, mensagem)?', 'Há um critério para o caso difícil (PDF sem dado)?'] },
      ],
    },
    {
      id: 'cc-03-02',
      title: 'TDD com Claude Code',
      minutes: 25,
      content: 'content/claudecode/cc-03/02-tdd-com-claude-code.md',
      exercises: [
        { type: 'order', q: 'Coloque o ciclo de TDD na ordem correta.', items: ['Escrever um teste para um comportamento que ainda não existe', 'Rodar e ver o teste falhar (vermelho)', 'Escrever o mínimo de código para o teste passar (verde)', 'Refatorar mantendo os testes verdes'], explain: 'O teste vem antes do código e precisa falhar primeiro; só depois vem a implementação mínima e a refatoração protegida.' },
        { type: 'mc', q: 'Por que pedir "função e testes" no mesmo prompt enfraquece o TDD?', options: ['Porque o pytest não consegue rodar os dois arquivos', 'Porque o modelo tende a escrever testes que confirmam o que a função já faz, inclusive os erros', 'Porque o Claude Code só aceita um arquivo por prompt', 'Porque os testes ficam mais lentos'], answer: 1, explain: 'Quando os testes são escritos a partir da especificação, antes da função, eles viram um contrato; escritos depois, apenas repetem a implementação.' },
        { type: 'tf', q: 'No CNPJ alfanumérico, os dois dígitos verificadores também podem ser letras.', answer: false, explain: 'Segundo a Receita Federal, as 12 primeiras posições podem ter dígitos ou letras maiúsculas; os 2 dígitos verificadores continuam numéricos.' },
        { type: 'fill', q: 'No cálculo do DV do CNPJ alfanumérico, cada caractere é convertido pelo seu código ASCII menos ___.', answer: ['48'], explain: 'Com ASCII − 48, os dígitos 0–9 continuam valendo 0–9 e as letras A–Z passam a valer 17–42.' },
        { type: 'mc', q: 'Os testes exigem que "12.abc.345/01DE-35" (minúsculas) seja inválido, mas a implementação do Claude usou .upper() e o teste falhou. O que fazer?', options: ['Alterar o teste para aceitar minúsculas, já que o DV está certo', 'Manter o teste e corrigir a implementação, pois o teste é a especificação', 'Apagar o teste para a suíte ficar verde', 'Ignorar: um teste falhando não impede o commit'], answer: 1, explain: 'A regra (só maiúsculas) foi definida na especificação; se o teste for "corrigido" para passar, a regra se perde silenciosamente.' },
        { type: 'match', q: 'Relacione o resultado do pytest ao seu significado.', pairs: [['ModuleNotFoundError ao importar cnpj', 'Vermelho esperado: a função ainda não existe'], ['assert False is True', 'A função devolveu False onde o teste esperava True'], ['3 passed', 'Todos os testes passaram'], ['1 failed, 2 passed', 'Um assert falhou; os outros dois passaram']], explain: 'Ler a saída do pytest é o que permite decidir se o erro está no código ou no teste antes de pedir correção.' },
        { type: 'code', q: 'Escreva `validar_cnpj(texto)` que devolve True para um CNPJ válido (numérico ou alfanumérico) e False em qualquer outro caso, sem lançar exceção. Aceite pontuação (. / -) e espaços nas pontas. As 12 primeiras posições podem ter dígitos ou letras maiúsculas A–Z; as 2 últimas são dígitos. DV: valor = ord(caractere) − 48, pesos 5,4,3,2,9,8,7,6,5,4,3,2 (e 6,5,4,3,2,9,8,7,6,5,4,3,2 para o segundo), soma mod 11; resto 0 ou 1 dá 0, senão 11 − resto. Rejeite tamanho diferente de 14, caracteres inválidos (inclusive minúsculas), todos iguais e DV errado.', starter: `import re

def calcular_dv(base):
    """Devolve o dígito verificador (0-9) para a sequência base (12 ou 13 caracteres)."""
    pass

def validar_cnpj(texto):
    pass
`, tests: `assert validar_cnpj("11.222.333/0001-81") is True, "11.222.333/0001-81 é válido"
assert validar_cnpj("11222333000181") is True, "sem pontuação também é válido"
assert validar_cnpj("  11222333000181  ") is True, "espaços nas pontas devem ser ignorados"
assert validar_cnpj("12.ABC.345/01DE-35") is True, "exemplo oficial alfanumérico é válido"
assert validar_cnpj("11.222.333/0001-80") is False, "DV errado deve ser inválido"
assert validar_cnpj("12.abc.345/01DE-35") is False, "letras minúsculas são inválidas"
assert validar_cnpj("") is False, "vazio é inválido"
assert validar_cnpj("00000000000000") is False, "todos iguais é inválido"
assert validar_cnpj("1122233300018") is False, "13 caracteres é inválido"
assert validar_cnpj("12.ABC.345/01DE-3A") is False, "DV com letra é inválido"
assert validar_cnpj(None) is False, "None deve devolver False, não lançar erro"
assert validar_cnpj(11222333000181) is False, "número (int) deve devolver False"
assert calcular_dv("12ABC34501DE") == 3, "primeiro DV de 12ABC34501DE é 3"
assert calcular_dv("12ABC34501DE3") == 5, "segundo DV de 12ABC34501DE3 é 5"
`, solution: `import re

def calcular_dv(base):
    """Devolve o dígito verificador (0-9) para a sequência base (12 ou 13 caracteres)."""
    valores = [ord(c) - 48 for c in base]
    pesos = [(i % 8) + 2 for i in range(len(valores))][::-1]
    resto = sum(v * p for v, p in zip(valores, pesos)) % 11
    return 0 if resto < 2 else 11 - resto

def validar_cnpj(texto):
    if not isinstance(texto, str):
        return False
    limpo = re.sub(r"[.\\-/\\s]", "", texto)
    if len(limpo) != 14 or len(set(limpo)) == 1:
        return False
    if not re.fullmatch(r"[0-9A-Z]{12}[0-9]{2}", limpo):
        return False
    d1 = calcular_dv(limpo[:12])
    d2 = calcular_dv(limpo[:12] + str(d1))
    return limpo[12:] == str(d1) + str(d2)
`, explain: 'A validação limpa a pontuação, confere tamanho e padrão e recalcula os dois DVs com módulo 11 sobre ASCII − 48; só é válido quando os DVs calculados batem com os informados.', hint: 'Os pesos do primeiro DV são 5,4,3,2,9,8,7,6,5,4,3,2; para 13 posições, 6,5,4,3,2,9,8,7,6,5,4,3,2. Limpe a pontuação com re.sub, confira o tamanho e o padrão [0-9A-Z]{12}[0-9]{2} com re.fullmatch, e compare os dois DVs calculados com os dois últimos caracteres.' },
      ],
    },
    {
      id: 'cc-03-03',
      title: 'Construindo um script de planilhas',
      minutes: 24,
      content: 'content/claudecode/cc-03/03-script-de-planilhas.md',
      exercises: [
        { type: 'mc', q: 'Você precisa ler uma planilha em que o cabeçalho está na linha 5 e há totais no meio dos dados. Qual biblioteca é a escolha mais natural?', options: ['pandas, porque lê qualquer layout automaticamente', 'openpyxl, porque permite ler célula a célula e lidar com layouts irregulares', 'csv, porque .xlsx é texto', 'pypdf, porque exporta a planilha para PDF primeiro'], answer: 1, explain: 'openpyxl dá controle célula a célula; pandas é melhor para intervalos retangulares regulares.' },
        { type: 'fill', q: 'Para que as células com fórmula devolvam o valor calculado em vez do texto da fórmula, abra o arquivo com load_workbook(caminho, ___=True).', answer: ['data_only'], explain: 'Sem data_only=True, o openpyxl devolve a string da fórmula, como =SOMA(C2:C9), e a soma quebra.' },
        { type: 'tf', q: 'Com iter_rows(values_only=True), cada linha vem como uma tupla de valores, e não como objetos de célula.', answer: true, explain: 'values_only=True devolve os valores diretamente, o que simplifica o desempacotamento em variáveis.' },
        { type: 'mc', q: 'Por que a função consolidar(registros) deve receber dicionários e não o caminho da planilha?', options: ['Porque o openpyxl não aceita ser chamado dentro de outra função', 'Porque assim a regra de negócio pode ser testada sem arquivo Excel e reaproveitada em outros scripts', 'Porque dicionários ocupam menos memória do que planilhas', 'Porque o pandas exige dicionários'], answer: 1, explain: 'Separar leitura (Excel) de regra (dados puros) torna os testes rápidos e o código reaproveitável; é o padrão ler → validar → consolidar → gravar.' },
        { type: 'order', q: 'Coloque na ordem correta as etapas da conversão do texto "R$ 1.234,56" em número, seguindo o valor intermediário de cada uma.', items: ['Texto original: "R$ 1.234,56"', 'Remover o prefixo "R$" e os espaços: "1.234,56"', 'Remover os pontos de milhar: "1234,56"', 'Trocar a vírgula decimal por ponto: "1234.56"', 'Converter com float(): 1234.56'], explain: 'Cada etapa parte do resultado da anterior; se trocar a vírgula antes de remover os pontos, "1.234.56" dá erro no float(), por isso os pontos saem primeiro.' },
        { type: 'match', q: 'Relacione cada trecho de pandas ao que ele faz.', pairs: [['pd.read_excel(arquivo, sheet_name="Honorarios")', 'Lê uma aba como tabela (DataFrame)'], ['df.dropna(subset=["Cliente", "Valor"])', 'Descarta linhas sem cliente ou sem valor'], ['df.groupby("Cliente")["Valor"].sum()', 'Soma os valores por cliente'], ['df.to_excel(saida, index=False)', 'Grava a tabela sem a coluna de índice']], explain: 'Essas quatro operações cobrem a maior parte das consolidações de escritório.' },
        { type: 'code', q: 'Escreva `consolidar(registros)` que recebe uma lista de dicionários com as chaves "cliente" e "valor" e devolve um dicionário {cliente: total}. Regras: ignore registros sem cliente (None ou vazio) ou sem valor (None ou vazio); "valor" pode vir como número ou como texto no formato "R$ 1.234,56"; some em float; os nomes de cliente devem ter espaços nas pontas removidos.', starter: `def texto_para_valor(texto):
    pass

def consolidar(registros):
    pass
`, tests: `registros = [
    {"cliente": "Padaria", "valor": 100.0},
    {"cliente": "Padaria ", "valor": "R$ 1.234,56"},
    {"cliente": "Oficina", "valor": "980,00"},
    {"cliente": "", "valor": 50.0},
    {"cliente": None, "valor": 10.0},
    {"cliente": "Mercado", "valor": None},
    {"cliente": "Mercado", "valor": ""},
    {"cliente": "Mercado", "valor": 15},
]
r = consolidar(registros)
assert set(r.keys()) == {"Padaria", "Oficina", "Mercado"}, "deve haver exatamente Padaria, Oficina e Mercado"
assert abs(r["Padaria"] - 1334.56) < 0.001, "Padaria deveria somar 1334.56"
assert abs(r["Oficina"] - 980.0) < 0.001, "Oficina deveria somar 980.0"
assert abs(r["Mercado"] - 15.0) < 0.001, "Mercado deveria somar 15.0 (valores vazios ignorados)"
assert consolidar([]) == {}, "lista vazia devolve dicionário vazio"
assert abs(texto_para_valor("R$ 1.234,56") - 1234.56) < 0.001, "texto_para_valor deve converter R$ 1.234,56"
`, solution: `def texto_para_valor(texto):
    if isinstance(texto, (int, float)):
        return float(texto)
    limpo = str(texto).replace("R$", "").replace(".", "").replace(",", ".").strip()
    return float(limpo)

def consolidar(registros):
    totais = {}
    for r in registros:
        cliente = r.get("cliente")
        valor = r.get("valor")
        if cliente is None or str(cliente).strip() == "":
            continue
        if valor is None or (isinstance(valor, str) and valor.strip() == ""):
            continue
        nome = str(cliente).strip()
        totais[nome] = totais.get(nome, 0.0) + texto_para_valor(valor)
    return totais
`, explain: 'A consolidação ignora registros incompletos, normaliza o nome do cliente e converte textos monetários antes de somar, mantendo a regra de negócio fora do Excel.', hint: 'Teste primeiro se cliente é None ou vazio depois de strip(); depois se valor é None ou texto vazio. Use totais.get(nome, 0.0) para somar sem KeyError.' },
      ],
    },
    {
      id: 'cc-03-04',
      title: 'Extraindo dados de PDFs',
      minutes: 25,
      content: 'content/claudecode/cc-03/04-extraindo-dados-de-pdfs.md',
      exercises: [
        { type: 'mc', q: 'Você abre o PDF, tenta selecionar uma palavra e a seleção vira um retângulo azul sobre a página inteira. O que isso indica?', options: ['O PDF tem texto, mas está protegido', 'O PDF é uma imagem escaneada; extrair texto exige OCR', 'O PDF tem tabelas e precisa de pdfplumber', 'O leitor de PDF está com defeito'], answer: 1, explain: 'Quando não há texto selecionável, o conteúdo é imagem; pypdf e pdfplumber devolvem vazio e o caminho é OCR.' },
        { type: 'match', q: 'Relacione a ferramenta ao uso.', pairs: [['pypdf', 'Extrair texto simples de PDFs gerados por sistema'], ['pdfplumber', 'Reconstruir tabelas usando a posição na página'], ['OCR (Tesseract)', 'Reconhecer texto em PDFs que são imagem'], ['re (regex)', 'Localizar valores e datas no texto extraído']], explain: 'Cada camada tem um papel; a regra de negócio (regex) deve ficar separada da leitura.' },
        { type: 'tf', q: 'Em pypdf, pagina.extract_text() devolve uma string; em uma página que é só imagem, ela vem vazia (ou quase), sem lançar erro.', answer: true, explain: 'A função sempre devolve str; texto vazio em todas as páginas é o sinal, por código, de que o PDF é escaneado e precisa de OCR.' },
        { type: 'fill', q: 'Na regex de valores brasileiros, o trecho (?:\\.\\d{3})* representa os grupos de ___ opcionais.', answer: ['milhar', 'milhares', 'milhar (pontos de milhar)', 'ponto de milhar', 'pontos de milhar'], explain: 'Cada repetição casa um ponto seguido de três dígitos, como ".234"; o * permite zero ou mais grupos.' },
        { type: 'mc', q: 'Por que separar extrair_darf(texto) de ler_pdf(caminho)?', options: ['Porque o pypdf só funciona em funções separadas', 'Para testar as regras com strings fixas, sem abrir PDF, e poder trocar a biblioteca de leitura sem mexer na regra', 'Porque funções grandes não cabem no contexto do Claude', 'Para que o OCR rode mais rápido'], answer: 1, explain: 'A regra em função pura é testável e independente da ferramenta de leitura; o PDF entra só no teste de integração.' },
        { type: 'mc', q: 'Qual é o problema de uma regex de valor como \\d+,\\d+ (sem exigir exatamente dois centavos)?', options: ['Ela não casa com nenhum valor em reais', 'Ela pode casar com pedaços de outros números, como partes de CNPJ ou datas, gerando valores falsos', 'Ela só funciona com pdfplumber', 'Ela exige o prefixo R$'], answer: 1, explain: 'Exigir ",\\d{2}" (dois centavos) e milhares de três dígitos reduz casamentos falsos em textos cheios de números.' },
        { type: 'code', q: 'Escreva `extrair_valores(texto)` que devolve a lista de valores monetários brasileiros encontrados no texto, como floats, na ordem em que aparecem. Aceite "R$ 1.234,56", "R$1.234,56" e "1.234,56"; exija sempre dois centavos; não capture pedaços de números que não seguem o padrão de milhar (por exemplo, em "12345,678" nada deve ser capturado).', starter: `import re

def extrair_valores(texto):
    pass
`, tests: `assert extrair_valores("Principal R$ 1.234,56 Multa R$ 24,69 Total: R$1.259,25") == [1234.56, 24.69, 1259.25], "deve achar os três valores na ordem"
assert extrair_valores("Vencimento 20/10/2026 sem valor") == [], "datas não são valores"
assert extrair_valores("Taxa 0,50 e saldo 1.000.000,00") == [0.5, 1000000.0], "valores pequenos e milhões"
assert extrair_valores("") == [], "texto vazio devolve lista vazia"
assert extrair_valores("CNPJ 11222333000181 total 10,00") == [10.0], "não deve pegar pedaços do CNPJ"
assert extrair_valores("errado 12345,678 certo 12,34") == [12.34], "só valores com formato correto"
`, solution: `import re

PADRAO_VALOR = re.compile(r"(?<![\\d.,])(\\d{1,3}(?:\\.\\d{3})*,\\d{2})(?![\\d])")

def extrair_valores(texto):
    achados = PADRAO_VALOR.findall(texto)
    return [float(v.replace(".", "").replace(",", ".")) for v in achados]
`, explain: 'A regex exige milhares de três dígitos e dois centavos; os lookarounds impedem capturar pedaços de números maiores, e a conversão troca o separador decimal.', hint: 'Use re.findall com o padrão \\d{1,3}(?:\\.\\d{3})*,\\d{2}. Para não capturar pedaços de números maiores, cerque o padrão com (?<![\\d.,]) antes e (?!\\d) depois. Converta trocando "." por nada e "," por ".".' },
      ],
    },
    {
      id: 'cc-03-05',
      title: 'Depuração guiada',
      minutes: 25,
      content: 'content/claudecode/cc-03/05-depuracao-guiada.md',
      exercises: [
        { type: 'mc', q: 'Em um traceback do Python, onde está a linha que efetivamente falhou?', options: ['Na primeira linha, logo após "Traceback (most recent call last)"', 'Na última chamada listada, logo acima do tipo e da mensagem do erro', 'Em uma linha separada no início do arquivo de log', 'Sempre na linha 1 do script'], answer: 1, explain: 'O traceback vai do início do programa (em cima) até a chamada mais recente (embaixo); a última linha de código mostrada é a que falhou, seguida do tipo e da mensagem.' },
        { type: 'tf', q: 'Diante de um traceback, a melhor primeira ação é pedir ao Claude Code que corrija o erro imediatamente.', answer: false, explain: 'Primeiro peça hipótese da causa raiz, forma de confirmar e proposta de mudança; a correção rápida costuma tratar o sintoma e esconder a origem do dado errado.' },
        { type: 'fill', q: 'No logging, o marcador ___ mostra a representação do valor com aspas, permitindo distinguir 1234.56 de \'1234.56\'.', answer: ['%r'], explain: '%r usa repr(), que mostra aspas em strings; %s usaria str() e os dois casos ficariam iguais na tela.' },
        { type: 'order', q: 'Coloque na ordem correta o fluxo de depuração com teste de regressão.', items: ['Colar o traceback completo no Claude Code', 'Receber e confirmar a hipótese da causa raiz', 'Escrever um teste que reproduz o bug e vê-lo falhar', 'Corrigir o código até o teste passar', 'Rodar todos os testes e commitar citando o sintoma'], explain: 'O teste de regressão vem antes da correção para provar que reproduz o bug e, depois, para garantir que ele não volta.' },
        { type: 'mc', q: 'O erro é UnicodeDecodeError: \'utf-8\' codec can\'t decode byte 0xe7 ao abrir um CSV exportado de um sistema antigo. Causa mais provável e solução?', options: ['O arquivo está corrompido; peça outro ao cliente', 'O arquivo está em cp1252 (ç é 0xe7); abra com encoding="cp1252"', 'O Python não suporta acentos; remova-os do arquivo', 'Falta instalar o pandas'], answer: 1, explain: 'Sistemas Windows antigos exportam em cp1252; o byte 0xe7 é o ç nesse encoding. Declarar o encoding certo na leitura resolve.' },
        { type: 'mc', q: 'O que há de errado em caminho = "C:\\novo\\teste.csv" (string normal do Python)?', options: ['Nada; é o formato padrão do Windows', 'As sequências \\n e \\t viram quebra de linha e tabulação; use pathlib.Path com barras normais', 'Falta a extensão do arquivo', 'O Python não aceita a letra do drive'], answer: 1, explain: 'A barra invertida inicia escapes em strings; Path("C:/novo/teste.csv") evita o problema e o Windows aceita barras normais.' },
        { type: 'code', q: 'A função `total_por_cliente(registros)` tem dois bugs. Ela deve devolver {cliente: soma dos valores}, com o nome do cliente sem espaços nas pontas, e ignorar registros cujo cliente seja None ou vazio. Hoje ela substitui em vez de somar e quebra com AttributeError quando cliente é None. Corrija sem mudar a assinatura.', starter: `def total_por_cliente(registros):
    totais = {}
    for r in registros:
        cliente = r["cliente"].strip()
        if cliente not in totais:
            totais[cliente] = 0
        totais[cliente] = r["valor"]
    return totais
`, tests: `dados = [
    {"cliente": "Padaria", "valor": 100.0},
    {"cliente": " Padaria", "valor": 200.0},
    {"cliente": "Oficina", "valor": 50.0},
    {"cliente": None, "valor": 999.0},
    {"cliente": "  ", "valor": 999.0},
]
r = total_por_cliente(dados)
assert r == {"Padaria": 300.0, "Oficina": 50.0}, "deve somar por cliente e ignorar cliente None ou vazio"
assert total_por_cliente([]) == {}, "lista vazia devolve dicionário vazio"
assert total_por_cliente([{"cliente": "X", "valor": 1}, {"cliente": "X", "valor": 2}, {"cliente": "X", "valor": 3}]) == {"X": 6}, "deve acumular, não substituir"
`, solution: `def total_por_cliente(registros):
    totais = {}
    for r in registros:
        cliente = r["cliente"]
        if cliente is None or str(cliente).strip() == "":
            continue
        cliente = str(cliente).strip()
        if cliente not in totais:
            totais[cliente] = 0
        totais[cliente] += r["valor"]
    return totais
`, explain: 'Os dois bugs eram substituir em vez de acumular (= no lugar de +=) e chamar .strip() em None; o teste de regressão garante que não voltam.', hint: 'Primeiro bug: "=" onde deveria ser "+=". Segundo: chamar .strip() em None; teste se cliente é None ou vazio antes de usar strip e pule o registro com continue.' },
      ],
    },
    {
      id: 'cc-03-06',
      title: 'Refatoração e qualidade',
      minutes: 25,
      content: 'content/claudecode/cc-03/06-refatoracao-e-qualidade.md',
      exercises: [
        { type: 'mc', q: 'Qual destas mudanças é uma refatoração?', options: ['Adicionar a coluna "Documento" ao relatório', 'Corrigir a soma que ignorava a última linha', 'Extrair o trecho que converte valores para uma função converter_valor()', 'Trocar openpyxl por pandas para ler mais colunas'], answer: 2, explain: 'Refatorar muda a estrutura sem mudar o comportamento; extrair função é o exemplo clássico. Corrigir bug ou adicionar coluna muda o comportamento.' },
        { type: 'tf', q: 'É seguro refatorar um script que não tem testes, desde que a mudança seja pequena.', answer: false, explain: 'Sem testes não há como provar que o comportamento não mudou; a regra é escrever os testes antes, capturando o comportamento atual.' },
        { type: 'match', q: 'Relacione o comando à sua função.', pairs: [['ruff check .', 'Lista problemas como importações não usadas e variáveis esquecidas'], ['ruff check --fix .', 'Corrige automaticamente os problemas seguros'], ['black .', 'Reformata todos os arquivos .py em um estilo único'], ['pytest', 'Roda os testes e confirma que o comportamento não mudou']], explain: 'ruff verifica e corrige, black formata, pytest é o juiz da refatoração.' },
        { type: 'fill', q: 'Na anotação de tipo `pagamento: date | None`, a barra vertical significa que o parâmetro aceita uma data ___ None.', answer: ['ou'], explain: 'A sintaxe X | Y (Python 3.10+) indica união de tipos: o valor pode ser de um tipo ou do outro.' },
        { type: 'mc', q: 'O Claude gerou um README dizendo que o script "aceita a opção --formato csv", mas o argparse do código não tem essa opção. O que fazer?', options: ['Manter, porque a opção pode ser adicionada depois', 'Remover ou corrigir a frase: documentação deve descrever o código que existe', 'Pedir ao Claude que implemente a opção para o README ficar certo', 'Mover a frase para o changelog'], answer: 1, explain: 'Documentação gerada é convincente mesmo quando descreve algo que não existe; a revisão compara cada frase com o código.' },
        { type: 'mc', q: 'Por que pedir "um commit por tipo de mudança" (renomear, extrair, tipar) na refatoração?', options: ['Porque o Git limita o tamanho de cada commit', 'Porque um diff que só renomeia é fácil de revisar, e se algo quebrar você sabe qual mudança foi', 'Porque o black exige commits separados', 'Porque o pytest roda mais rápido assim'], answer: 1, explain: 'Commits pequenos e homogêneos tornam a revisão possível e isolam a causa de qualquer teste que fique vermelho.' },
        { type: 'code', q: 'Escreva `dias_de_atraso(vencimento, pagamento=None)` com type hints e docstring. Devolve quantos dias o pagamento atrasou em relação ao vencimento (0 se pagou em dia ou antes). Se pagamento for None, use date.today(). A função deve ter docstring (atributo __doc__) e anotação de retorno int em __annotations__["return"].', starter: `from datetime import date

def dias_de_atraso(vencimento, pagamento=None):
    pass
`, tests: `from datetime import date
assert dias_de_atraso(date(2026, 10, 20), date(2026, 10, 25)) == 5, "5 dias de atraso"
assert dias_de_atraso(date(2026, 10, 20), date(2026, 10, 20)) == 0, "pagou no dia: 0"
assert dias_de_atraso(date(2026, 10, 20), date(2026, 10, 10)) == 0, "pagou antes: 0, não negativo"
assert dias_de_atraso(date(2000, 1, 1)) > 1000, "sem pagamento usa a data de hoje"
assert dias_de_atraso.__doc__ and dias_de_atraso.__doc__.strip(), "a função precisa de docstring"
assert dias_de_atraso.__annotations__.get("return") is int, "anote o retorno como int"
assert "vencimento" in dias_de_atraso.__annotations__, "anote o tipo do parâmetro vencimento"
`, solution: `from datetime import date

def dias_de_atraso(vencimento: date, pagamento: date | None = None) -> int:
    """Devolve quantos dias o pagamento atrasou; 0 se pagou em dia ou antes."""
    pago_em = pagamento or date.today()
    return max(0, (pago_em - vencimento).days)
`, explain: 'Type hints e docstring documentam a intenção sem mudar o comportamento; o parâmetro opcional de pagamento permite testar com data fixa.', hint: 'Assinatura: def dias_de_atraso(vencimento: date, pagamento: date | None = None) -> int. A docstring vai entre aspas triplas na primeira linha do corpo. Use max(0, (pago_em - vencimento).days).' },
      ],
    },
    {
      id: 'cc-03-07',
      title: 'Revisão de código',
      minutes: 23,
      content: 'content/claudecode/cc-03/07-revisao-de-codigo.md',
      exercises: [
        { type: 'mc', q: 'Os testes passaram. Por que ainda vale a pena revisar o código?', options: ['Porque o pytest não é confiável', 'Porque os testes verificam o que você pensou em testar; a revisão procura o que você não pensou (bordas, segurança, erros engolidos)', 'Porque o Git exige revisão antes do commit', 'Porque a revisão substitui os testes'], answer: 1, explain: 'Teste e revisão são filtros complementares: um confirma o esperado, o outro procura o inesperado.' },
        { type: 'order', q: 'Coloque na ordem proposta na lição (seção "Na prática") as etapas do fechamento de uma funcionalidade.', items: ['Testes verdes', 'Pedir revisão crítica como lista por gravidade, sem alterações', 'Triar a lista e pedir correções uma a uma, com teste', 'Segunda opinião em sessão sem contexto', 'Checklist humano no diff', 'Commit com mensagem que explica o porquê'], explain: 'Revisar antes de corrigir mantém a decisão com você; a segunda opinião e o checklist vêm antes do commit, que é o fecho.' },
        { type: 'tf', q: 'Pedir a revisão e a correção no mesmo prompt é uma boa prática, pois economiza tempo.', answer: false, explain: 'Se a correção vem junto, ela acontece antes de você decidir o que aceita; a frase "não altere nada ainda" separa os dois momentos.' },
        { type: 'match', q: 'Relacione o erro típico da IA ao risco que ele traz.', pairs: [['except Exception: pass', 'Esconde a causa real do erro'], ['float(x) sem tratar "R$" e vírgula', 'Quebra ou lê valor errado em planilhas brasileiras'], ['date.today() dentro da função sem parâmetro', 'Impossível de testar com data fixa'], ['Comparar floats com == em dinheiro', 'Casamentos perdidos por erro de ponto flutuante']], explain: 'Esses padrões aparecem com frequência em código gerado e merecem uma olhada dirigida na revisão.' },
        { type: 'fill', q: 'Para obter uma segunda opinião independente na mesma sessão, você pode zerar o contexto com o comando ___ antes de pedir a leitura do código.', answer: ['/clear'], explain: '/clear inicia uma conversa com contexto vazio, então o revisor não "lembra" das escolhas feitas ao escrever o código; outra opção é abrir um segundo terminal.' },
        { type: 'mc', q: 'Qual pergunta é mais valiosa para um revisor em contabilidade?', options: ['O código está bonito?', 'Em que situações este programa produziria um número errado sem dar erro?', 'Quantas linhas tem o arquivo?', 'O nome das variáveis está em inglês?'], answer: 1, explain: 'Um script que quebra é melhor do que um que soma errado em silêncio; a pergunta mira exatamente os erros silenciosos.' },
        { type: 'write', q: 'Escreva o prompt de revisão crítica que você usaria para um diff que altera o cálculo de juros de boletos atrasados, pedindo lista por gravidade e proibindo alterações.', model: 'Faça uma revisão crítica do diff atual como um revisor sênior que não confia no autor. Liste por gravidade: 1) bugs prováveis com o cenário que os dispara (juros em dia de vencimento, pagamento antes do vencimento, taxa zero); 2) riscos de segurança; 3) casos de borda (valor zero, data None, texto no lugar de número); 4) legibilidade. Para cada item: arquivo, linha, por quê e correção sugerida. Não altere nada ainda.', checklist: ['Pediu lista ordenada por gravidade?', 'Citou bordas específicas do domínio (vencimento, taxa, datas)?', 'Pediu arquivo, linha, motivo e correção?', 'Proibiu alterações até a sua decisão?'] },
      ],
    },
    {
      id: 'cc-03-08',
      title: 'Documentação e entrega',
      minutes: 26,
      content: 'content/claudecode/cc-03/08-documentacao-e-entrega.md',
      exercises: [
        { type: 'mc', q: 'O que NÃO deve ir no pacote enviado ao colega?', options: ['requirements.txt', 'README.md', 'A pasta .venv e o arquivo .env', 'rodar.bat'], answer: 2, explain: 'O .venv é recriado na máquina do colega com pip install -r requirements.txt; o .env contém segredos e é substituído por um .env.exemplo sem valores.' },
        { type: 'fill', q: 'O comando que grava as bibliotecas instaladas com versões fixas é: pip ___ > requirements.txt', answer: ['freeze'], explain: 'pip freeze lista pacote==versão; o redirecionamento grava a lista no arquivo que o colega instala com pip install -r.' },
        { type: 'tf', q: 'No rodar.bat, %~dp0 representa a pasta em que o próprio .bat está, o que permite rodá-lo de qualquer lugar.', answer: true, explain: 'cd /d "%~dp0" muda para a pasta do script antes de chamar o python.exe do .venv, evitando caminhos absolutos.' },
        { type: 'match', q: 'Relacione cada arquivo de entrega à sua função.', pairs: [['README.md', 'Instruções de instalação e uso testadas'], ['requirements.txt', 'Dependências com versões fixadas'], ['CHANGELOG.md', 'O que mudou em cada versão, em linguagem do usuário'], ['.env.exemplo', 'Modelo das variáveis de configuração, sem valores reais']], explain: 'Os quatro arquivos respondem como instalar, o que instalar, o que mudou e o que configurar.' },
        { type: 'mc', q: 'Quando o PyInstaller é a escolha certa?', options: ['Sempre, porque um .exe é mais profissional', 'Quando não é possível instalar Python na máquina do colega e os custos (tamanho, antivírus, redistribuição a cada correção) são aceitáveis', 'Quando o script usa pandas', 'Quando o README ficou muito longo'], answer: 1, explain: 'Para a maioria dos escritórios, .bat + ambiente virtual é mais simples de manter; o .exe resolve uma restrição real, com custos.' },
        { type: 'mc', q: 'Qual frase está adequada para um CHANGELOG lido por usuários?', options: ['Refatorado parser de float em utils.py', 'Valores com "R$" nas planilhas da Oficina eram lidos como texto; corrigido', 'Merge da branch feature/float-fix', 'Alterado regex PADRAO_VALOR'], answer: 1, explain: 'O changelog descreve o efeito para quem usa, não o detalhe técnico; a linguagem é a do usuário.' },
        { type: 'code', q: 'Escreva `ler_requisitos(texto)` que recebe o conteúdo de um requirements.txt e devolve um dicionário {pacote: versao}. Ignore linhas vazias e linhas que começam com "#". Linhas no formato "pacote==versao" devolvem a versão; linhas só com o nome do pacote devolvem None como versão. Nomes de pacote devem ficar em minúsculas e sem espaços nas pontas.', starter: `def ler_requisitos(texto):
    pass
`, tests: `conteudo = """# dependências do consolidador
openpyxl==3.1.5

Pandas==2.2.3
pypdf
  requests==2.32.3
"""
r = ler_requisitos(conteudo)
assert r == {"openpyxl": "3.1.5", "pandas": "2.2.3", "pypdf": None, "requests": "2.32.3"}, "deve ler pacotes e versões, ignorando comentários e vazios"
assert ler_requisitos("") == {}, "texto vazio devolve dicionário vazio"
assert ler_requisitos("# só comentário\\n\\n") == {}, "só comentários devolve vazio"
`, solution: `def ler_requisitos(texto):
    resultado = {}
    for linha in texto.splitlines():
        linha = linha.strip()
        if not linha or linha.startswith("#"):
            continue
        if "==" in linha:
            nome, versao = linha.split("==", 1)
            resultado[nome.strip().lower()] = versao.strip()
        else:
            resultado[linha.lower()] = None
    return resultado
`, explain: 'O leitor ignora vazios e comentários, separa nome e versão em == e normaliza o nome em minúsculas, como o pip faz.', hint: 'Percorra texto.splitlines(); use strip(); pule vazias e comentários; se houver "==", separe com split("==", 1).' },
      ],
    },
    {
      id: 'cc-03-09',
      title: 'Projeto guiado: conciliador bancário',
      minutes: 26,
      content: 'content/claudecode/cc-03/09-projeto-conciliador-bancario.md',
      exercises: [
        { type: 'mc', q: 'Por que o projeto exige valores em centavos inteiros em vez de float?', options: ['Porque o openpyxl não grava floats', 'Porque comparar floats com == pode falhar por erro de ponto flutuante e perder casamentos', 'Porque o OFX só traz inteiros', 'Porque inteiros ocupam menos memória'], answer: 1, explain: '0.1 + 0.2 não é exatamente 0.3 em float; em centavos inteiros, 10 + 20 == 30 sempre.' },
        { type: 'order', q: 'Coloque as quatro sessões do projeto na ordem proposta.', items: ['Especificação, CLAUDE.md, Git e esqueleto', 'Leitura do extrato (CSV e OFX) com testes', 'Função de casamento pura com TDD', 'Gravação, linha de comando e entrega'], explain: 'A regra de negócio (casamento) só é escrita depois que a leitura devolve a estrutura comum; a entrega fecha o ciclo.' },
        { type: 'tf', q: 'Uma transação do banco pode casar com dois lançamentos do escritório de mesmo valor e data, para garantir que nada fique pendente.', answer: false, explain: 'Cada transação casa com no máximo um lançamento e vice-versa; o segundo lançamento fica em SoEscritorio para investigação.' },
        { type: 'match', q: 'Relacione a marcação do OFX ao campo.', pairs: [['<DTPOSTED>', 'Data da transação (AAAAMMDD...)'], ['<TRNAMT>', 'Valor com ponto decimal, negativo para débito'], ['<MEMO>', 'Histórico/descrição'], ['<STMTTRN>', 'Início de uma transação']], explain: 'Essas marcações são as que um leitor por regex precisa localizar para montar {data, centavos, historico}.' },
        { type: 'fill', q: 'A função de casamento deve ficar em regras.py e ser ___: sem arquivo, sem Excel, só dados de entrada e saída.', answer: ['pura', 'função pura'], explain: 'Função pura é testável com listas fixas e independente de como os dados foram lidos ou serão gravados.' },
        { type: 'mc', q: 'Na rubrica, um projeto com especificação com critérios verificáveis, testes de borda, regra pura, centavos inteiros, commits pequenos, CLAUDE.md específico e entrega completa soma quantos pontos?', options: ['7', '10', '12', '14'], answer: 3, explain: 'São 7 critérios com nota máxima 2 cada: 14 pontos, faixa "pronto para uso no escritório".' },
        { type: 'code', q: 'Escreva `casar(banco, escritorio, tolerancia_dias=0)`. Cada item é um dicionário com "data" (datetime.date) e "centavos" (int). Devolva uma tupla (conciliados, so_banco, so_escritorio): conciliados é a lista de tuplas (transacao, lancamento) com mesmo valor em centavos e datas cuja diferença absoluta em dias seja menor ou igual à tolerância; cada item casa no máximo uma vez; percorra o banco na ordem e, para cada transação, use o primeiro lançamento ainda livre que satisfaça a regra. so_banco e so_escritorio contêm os itens que sobraram, na ordem original.', starter: `from datetime import date

def casar(banco, escritorio, tolerancia_dias=0):
    pass
`, tests: `from datetime import date
b = [
    {"data": date(2026, 10, 1), "centavos": 10000, "historico": "PIX"},
    {"data": date(2026, 10, 3), "centavos": -5000, "historico": "TARIFA"},
    {"data": date(2026, 10, 5), "centavos": 20000, "historico": "TED"},
    {"data": date(2026, 10, 5), "centavos": 20000, "historico": "TED 2"},
]
e = [
    {"data": date(2026, 10, 1), "centavos": 10000, "descricao": "Cliente A"},
    {"data": date(2026, 10, 7), "centavos": 20000, "descricao": "Cliente B"},
    {"data": date(2026, 10, 5), "centavos": 20000, "descricao": "Cliente C"},
    {"data": date(2026, 10, 9), "centavos": 777, "descricao": "Sem par"},
]
c, sb, se = casar(b, e)
assert len(c) == 2, "sem tolerância: PIX e um TED casam"
assert c[0] == (b[0], e[0]), "PIX casa com Cliente A"
assert c[1] == (b[2], e[2]), "primeiro TED casa com Cliente C (mesma data)"
assert sb == [b[1], b[3]], "tarifa e segundo TED ficam só no banco"
assert se == [e[1], e[3]], "Cliente B (data diferente) e Sem par ficam só no escritório"
c2, sb2, se2 = casar(b, e, tolerancia_dias=2)
assert len(c2) == 3, "com tolerância 2, o segundo TED casa com Cliente B (7/10)"
assert sb2 == [b[1]] and se2 == [e[3]], "sobram tarifa e Sem par"
assert casar([], e) == ([], [], e), "banco vazio: tudo fica no escritório"
assert casar(b, []) == ([], b, []), "escritório vazio: tudo fica no banco"
`, solution: `from datetime import date

def casar(banco, escritorio, tolerancia_dias=0):
    conciliados = []
    usados = set()
    so_banco = []
    for t in banco:
        par = None
        for i, l in enumerate(escritorio):
            if i in usados:
                continue
            if l["centavos"] == t["centavos"] and abs((l["data"] - t["data"]).days) <= tolerancia_dias:
                par = i
                break
        if par is None:
            so_banco.append(t)
        else:
            usados.add(par)
            conciliados.append((t, escritorio[par]))
    so_escritorio = [l for i, l in enumerate(escritorio) if i not in usados]
    return conciliados, so_banco, so_escritorio
`, explain: 'Cada transação procura o primeiro lançamento livre com mesmo valor em centavos e data dentro da tolerância; índices usados garantem que cada item casa no máximo uma vez.', hint: 'Guarde os índices dos lançamentos já usados em um set. Para cada transação, percorra o escritório na ordem e pare no primeiro índice livre com mesmo centavos e abs((l["data"] - t["data"]).days) <= tolerancia_dias.' },
      ],
    },
  ],
  exam: {
    passScore: 70,
    questions: [
      { type: 'mc', q: 'Qual é a ordem correta do fluxo profissional ensinado no módulo?', options: ['Implementar → testar → especificar → commitar', 'Especificar → planejar → implementar em passos → testar → revisar → commitar', 'Planejar → commitar → testar → revisar', 'Testar → implementar → especificar → revisar'], answer: 1, explain: 'A especificação vem antes do plano, o plano antes do código, os testes antes da revisão e o commit por último.' },
      { type: 'tf', q: 'Um critério de aceite precisa ser verificável: um número, um arquivo ou uma mensagem que dá para checar.', answer: true, explain: 'Se não dá para checar, é desejo, não critério; é o critério que dá ao Claude a definição de "pronto".' },
      { type: 'mc', q: 'No TDD com o Claude Code, qual é o pedido correto?', options: ['Escrever função e testes juntos para ganhar tempo', 'Escrever os testes a partir da especificação, vê-los falhar e só então implementar, sem alterar os testes', 'Escrever a função e pedir testes que a confirmem', 'Pular os testes em funções pequenas'], answer: 1, explain: 'Testes antes da função viram contrato; o vermelho inicial prova que eles testam algo.' },
      { type: 'fill', q: 'No CNPJ alfanumérico (formato AA.AAA.AAA/AAAA-DV), as ___ primeiras posições podem conter dígitos ou letras maiúsculas.', answer: ['12', 'doze'], explain: 'Segundo a Receita Federal, 12 posições alfanuméricas e 2 dígitos verificadores numéricos, calculados por módulo 11 com valor = ASCII − 48.' },
      { type: 'mc', q: 'Qual parâmetro faz o openpyxl devolver o valor calculado de uma célula com fórmula?', options: ['values_only=True em load_workbook', 'data_only=True em load_workbook', 'formulas=False em iter_rows', 'read_only=True em load_workbook'], answer: 1, explain: 'data_only=True devolve o último valor calculado pelo Excel; values_only é parâmetro de iter_rows e trata de objetos de célula versus valores.' },
      { type: 'match', q: 'Relacione a ferramenta ao uso.', pairs: [['openpyxl', 'Ler e gravar .xlsx célula a célula'], ['pandas', 'Tabelas regulares, agrupamentos e somas'], ['pdfplumber', 'Extrair tabelas de PDF com texto'], ['Tesseract (OCR)', 'Texto em PDF escaneado']], explain: 'Cada biblioteca cobre um tipo de entrada; a regra de negócio fica separada em funções puras.' },
      { type: 'mc', q: 'Qual regex casa corretamente valores como "1.234,56" exigindo dois centavos e milhares de três dígitos?', options: ['\\d+,\\d+', '\\d{1,3}(?:\\.\\d{3})*,\\d{2}', '\\d{3}\\.\\d{3}', '[0-9,.]+'], answer: 1, explain: 'A segunda opção descreve exatamente o formato brasileiro; as outras casam com pedaços de datas, CNPJs ou números quaisquer.' },
      { type: 'mc', q: 'Ao receber um traceback, qual é o primeiro pedido correto ao Claude Code?', options: ['"Corrija o erro"', '"Antes de alterar qualquer arquivo, me dê a hipótese da causa raiz, como confirmá-la e o que mudaria"', '"Reescreva o script do zero"', '"Remova a linha que deu erro"'], answer: 1, explain: 'A hipótese obriga a olhar para a origem do dado; a correção imediata costuma tratar só o sintoma.' },
      { type: 'tf', q: 'No Windows, é recomendável sempre declarar o encoding ao abrir arquivos de texto, porque CSVs de sistemas antigos costumam vir em cp1252.', answer: true, explain: 'O erro UnicodeDecodeError com byte 0xe7 (ç) é o sintoma típico; encoding="cp1252" na leitura resolve.' },
      { type: 'mc', q: 'O que torna uma mudança uma refatoração?', options: ['Ela adiciona uma funcionalidade pedida pelo cliente', 'Ela muda a estrutura do código sem mudar o comportamento, com os testes como juiz', 'Ela corrige um bug sem teste', 'Ela troca a biblioteca para ler mais formatos'], answer: 1, explain: 'Refatoração não muda o que o programa faz; os testes que passavam continuam passando.' },
      { type: 'fill', q: 'O comando ___ check --fix . corrige automaticamente os problemas seguros apontados pelo verificador.', answer: ['ruff'], explain: 'ruff check lista problemas; com --fix corrige os seguros; black . formata o código.' },
      { type: 'mc', q: 'Por que pedir uma segunda opinião em uma sessão sem contexto (outro terminal ou /clear)?', options: ['Porque a primeira sessão fica lenta', 'Porque um revisor que não viu a conversa não tende a defender as escolhas feitas ao escrever o código', 'Porque o Claude Code só permite uma revisão por sessão', 'Porque /clear corrige bugs'], answer: 1, explain: 'A revisão independente vem de um contexto limpo; a pergunta "o que este programa faz?" testa inclusive a legibilidade.' },
      { type: 'mc', q: 'O que deve acompanhar o script na entrega para um colega?', options: ['A pasta .venv completa e o .env com as senhas', 'README testado, requirements.txt com versões fixadas, rodar.bat, changelog e .env.exemplo', 'Apenas o .py, pois o resto ele gera', 'Um .exe sempre'], answer: 1, explain: 'O ambiente é recriado com pip install -r requirements.txt; segredos nunca viajam; o README só cita comandos que existem.' },
      { type: 'code', q: 'Escreva `texto_para_centavos(texto)` que converte "R$ 1.234,56" (ou "1.234,56", ou "980,00") em centavos inteiros: 123456. Também aceite um número (int ou float), arredondando para o centavo mais próximo.', starter: `def texto_para_centavos(texto):
    pass
`, tests: `assert texto_para_centavos("R$ 1.234,56") == 123456, "R$ 1.234,56 -> 123456"
assert texto_para_centavos("980,00") == 98000, "980,00 -> 98000"
assert texto_para_centavos("0,05") == 5, "0,05 -> 5"
assert texto_para_centavos(12.34) == 1234, "float 12.34 -> 1234"
assert texto_para_centavos(7) == 700, "int 7 -> 700"
assert texto_para_centavos(0.1 + 0.2) == 30, "0.1 + 0.2 deve dar 30 centavos (arredondar)"
`, solution: `def texto_para_centavos(texto):
    if isinstance(texto, (int, float)):
        return int(round(texto * 100))
    limpo = str(texto).replace("R$", "").replace(".", "").replace(",", ".").strip()
    return int(round(float(limpo) * 100))
`, explain: 'Converter para centavos inteiros com arredondamento elimina os erros de ponto flutuante nas comparações.', hint: 'Converta para float como na lição 3 e depois use int(round(valor * 100)).' },
      { type: 'code', q: 'Escreva `datas_em(texto)` que devolve a lista de objetos datetime.date para todas as datas no formato dd/mm/aaaa encontradas no texto, na ordem em que aparecem.', starter: `import re
from datetime import date

def datas_em(texto):
    pass
`, tests: `from datetime import date
assert datas_em("Período 30/09/2026 Vencimento 20/10/2026") == [date(2026, 9, 30), date(2026, 10, 20)], "duas datas na ordem"
assert datas_em("sem data 1.234,56") == [], "sem datas devolve lista vazia"
assert datas_em("01/02/2026") == [date(2026, 2, 1)], "01/02/2026 é 1º de fevereiro, não 2 de janeiro"
`, solution: `import re
from datetime import date

PADRAO_DATA = re.compile(r"(\\d{2})/(\\d{2})/(\\d{4})")

def datas_em(texto):
    return [date(int(a), int(m), int(d)) for d, m, a in PADRAO_DATA.findall(texto)]
`, explain: 'Os grupos aparecem como dia, mês e ano no texto, mas date() recebe ano, mês e dia; a inversão é o erro clássico.', hint: 'Use re.findall com três grupos (dia, mês, ano) e monte date(ano, mes, dia); cuidado com a ordem.' },
    ],
  },
});
