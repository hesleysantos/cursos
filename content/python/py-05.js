registerModule({
  course: 'python',
  id: 'py-05',
  order: 5,
  level: 'Profissional',
  title: 'Dados, web e automação',
  description: 'Você vai consumir APIs REST, guardar dados em SQLite, analisar planilhas com pandas, automatizar Excel, PDF e e-mail, usar threads, processos e asyncio, publicar uma API web, versionar com Git e fechar o módulo construindo um robô de fechamento mensal completo, em camadas e com testes.',
  hours: 10,
  lessons: [
    // ------------------------------------------------------------------
    {
      id: 'py-05-01',
      title: 'HTTP e APIs',
      minutes: 35,
      content: 'content/python/py-05/01-http-e-apis.md',
      exercises: [
        {
          type: 'mc',
          q: 'Uma API respondeu com status 404. O que isso significa?',
          options: ['O servidor caiu', 'O recurso pedido não foi encontrado', 'Você não está autenticado', 'A requisição deu certo'],
          answer: 1,
          explain: 'Códigos 4xx são erros do cliente; 404 (Not Found) indica que a URL pedida não corresponde a nenhum recurso. 401 é não autenticado e 5xx é erro do servidor.',
        },
        {
          type: 'code',
          q: 'O ViaCEP devolve JSON como texto. Escreva `extrair_endereco(texto_json)` que recebe a string JSON e devolve um dict com as chaves `logradouro`, `cidade` (vinda de `localidade`) e `uf`. Se o JSON contiver a chave `"erro"` com valor verdadeiro (`true` ou a string `"true"`, como o ViaCEP devolve hoje), devolva `None`.',
          starter: `import json

def extrair_endereco(texto_json):
    pass
`,
          tests: `import json
ok = '{"cep": "01001-000", "logradouro": "Praça da Sé", "localidade": "São Paulo", "uf": "SP"}'
r = extrair_endereco(ok)
assert r == {"logradouro": "Praça da Sé", "cidade": "São Paulo", "uf": "SP"}, "Deveria extrair logradouro, cidade e uf"
assert extrair_endereco('{"erro": true}') is None, "Resposta com erro deveria devolver None"
assert extrair_endereco('{"erro": "true"}') is None, "Resposta com erro (string) tambem deveria devolver None"
`,
          solution: `import json

def extrair_endereco(texto_json):
    dados = json.loads(texto_json)
    if dados.get("erro"):
        return None
    return {
        "logradouro": dados["logradouro"],
        "cidade": dados["localidade"],
        "uf": dados["uf"],
    }
`,
          hint: 'json.loads transforma o texto em dict; depois confira a chave "erro" com .get().',
          explain: 'A resposta da API é texto; json.loads a converte em dict. Como o ViaCEP sinaliza CEP inexistente dentro do corpo, é preciso checar a chave "erro" antes de ler os campos.',
        },
        {
          type: 'fill',
          q: 'Para evitar que o script fique travado para sempre esperando a rede: `requests.get(url, ___=10)`',
          answer: ['timeout'],
          explain: 'O parâmetro timeout define quantos segundos esperar antes de desistir e lançar requests.Timeout. Sem ele, a chamada pode nunca retornar.',
        },
        {
          type: 'code',
          q: 'Escreva `montar_url(base, params)` que recebe uma URL base e um dict de parâmetros e devolve a URL completa com query string codificada, usando `urllib.parse.urlencode`. Ex.: `montar_url("https://api.x.com/busca", {"q": "São Paulo", "uf": "SP"})` deve devolver `"https://api.x.com/busca?q=S%C3%A3o+Paulo&uf=SP"`. Se o dict estiver vazio, devolva a base sem `?`.',
          starter: `from urllib.parse import urlencode

def montar_url(base, params):
    pass
`,
          tests: `assert montar_url("https://api.x.com/busca", {"q": "São Paulo", "uf": "SP"}) == "https://api.x.com/busca?q=S%C3%A3o+Paulo&uf=SP", "A query string deve ser codificada com urlencode"
assert montar_url("https://api.x.com/busca", {"page": 2, "per_page": 50}) == "https://api.x.com/busca?page=2&per_page=50", "Numeros tambem devem entrar na query"
assert montar_url("https://api.x.com/busca", {}) == "https://api.x.com/busca", "Sem parametros, nao deve haver ?"
`,
          solution: `from urllib.parse import urlencode

def montar_url(base, params):
    if not params:
        return base
    return base + "?" + urlencode(params)
`,
          hint: 'urlencode(dict) devolve "chave=valor&chave2=valor2" já codificado.',
          explain: 'urlencode cuida de acentos, espaços e caracteres especiais; montar a query na mão com f-strings geraria URLs inválidas.',
        },
        {
          type: 'tf',
          q: 'Se a API respondeu com status 200, os dados do corpo são necessariamente válidos.',
          answer: false,
          explain: 'Algumas APIs, como o ViaCEP, devolvem 200 com um indicador de erro dentro do JSON. Confira o status E o conteúdo.',
        },
        {
          type: 'order',
          q: 'Ordene os passos de uma consulta robusta a uma API com requests.',
          items: [
            'ler a chave da API em os.environ',
            'chamar requests.get(url, headers=..., timeout=10) dentro de try',
            'chamar r.raise_for_status()',
            'converter o corpo com r.json()',
            'tratar requests.RequestException no except',
          ],
          explain: 'Primeiro o segredo, depois a chamada protegida por try, a checagem do status, a leitura do JSON e, no except, o tratamento de falhas de rede ou HTTP.',
        },
        {
          type: 'code',
          q: 'Simule a paginação: `coletar_itens(paginas)` recebe uma lista de respostas de API (dicts com `"items"` e `"has_next"`), na ordem em que seriam baixadas. Devolva uma única lista com todos os itens, mas PARE de ler assim que encontrar uma página com `has_next` igual a `False` (ignore as páginas seguintes, mesmo que existam na lista).',
          starter: `def coletar_itens(paginas):
    pass
`,
          tests: `paginas = [
    {"items": [1, 2], "has_next": True},
    {"items": [3], "has_next": False},
    {"items": [99], "has_next": False},
]
assert coletar_itens(paginas) == [1, 2, 3], "Deveria parar na primeira pagina com has_next False"
assert coletar_itens([{"items": [], "has_next": False}]) == [], "Pagina vazia devolve lista vazia"
assert coletar_itens([{"items": ["a"], "has_next": True}, {"items": ["b"], "has_next": True}]) == ["a", "b"], "Se nunca vier has_next False, le tudo"
`,
          solution: `def coletar_itens(paginas):
    todos = []
    for pagina in paginas:
        todos.extend(pagina["items"])
        if not pagina.get("has_next"):
            break
    return todos
`,
          hint: 'Percorra as páginas acumulando items e use break quando has_next for falso.',
          explain: 'A API indica quando acabou; o cliente para de pedir páginas assim que has_next for falso, evitando chamadas desnecessárias.',
        },
        {
          type: 'match',
          q: 'Relacione o método HTTP à ação em uma API REST.',
          pairs: [['GET', 'ler um recurso'], ['POST', 'criar um recurso'], ['PUT/PATCH', 'alterar um recurso'], ['DELETE', 'remover um recurso']],
          explain: 'Em REST, a URL identifica o recurso e o método HTTP identifica a ação.',
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'py-05-02',
      title: 'Bancos de dados com sqlite3',
      minutes: 34,
      content: 'content/python/py-05/02-sqlite3.md',
      exercises: [
        {
          type: 'code',
          q: 'Escreva `inserir_clientes(con, clientes)` que recebe uma conexão sqlite3 e uma lista de tuplas `(nome, cnpj)`. A função deve criar a tabela `clientes` (colunas `id INTEGER PRIMARY KEY`, `nome TEXT`, `cnpj TEXT`) se ela não existir, inserir todos os registros com parâmetros `?`, dar commit e devolver quantos foram inseridos.',
          starter: `import sqlite3

def inserir_clientes(con, clientes):
    pass
`,
          tests: `import sqlite3
con = sqlite3.connect(":memory:")
n = inserir_clientes(con, [("Padaria", "111"), ("Oficina", "222")])
assert n == 2, "Deveria devolver 2 inseridos"
assert not con.in_transaction, "Faltou o con.commit(): a transacao ainda esta aberta"
linhas = con.execute("SELECT nome, cnpj FROM clientes ORDER BY id").fetchall()
assert linhas == [("Padaria", "111"), ("Oficina", "222")], "Os dois clientes deveriam estar na tabela"
n2 = inserir_clientes(con, [("D'Avila", "333")])
assert n2 == 1, "Chamar de novo nao deve recriar a tabela nem falhar"
assert con.execute("SELECT COUNT(*) FROM clientes").fetchone()[0] == 3, "Agora deveriam existir 3 clientes"
assert con.execute("SELECT nome FROM clientes WHERE cnpj = ?", ("333",)).fetchone()[0] == "D'Avila", "Apostrofo deve ser gravado sem quebrar o SQL (use parametros ?)"
`,
          solution: `import sqlite3

def inserir_clientes(con, clientes):
    con.execute("CREATE TABLE IF NOT EXISTS clientes (id INTEGER PRIMARY KEY, nome TEXT, cnpj TEXT)")
    con.executemany("INSERT INTO clientes (nome, cnpj) VALUES (?, ?)", clientes)
    con.commit()
    return len(clientes)
`,
          hint: 'CREATE TABLE IF NOT EXISTS, depois executemany com "?" e commit.',
          explain: 'IF NOT EXISTS torna a função segura para chamadas repetidas; executemany com ? insere a lista inteira sem risco de SQL injection; o commit grava de fato.',
        },
        {
          type: 'mc',
          q: 'Qual destas chamadas está protegida contra SQL injection?',
          options: [
            'cur.execute(f"SELECT * FROM clientes WHERE nome = \'{nome}\'")',
            'cur.execute("SELECT * FROM clientes WHERE nome = \'" + nome + "\'")',
            'cur.execute("SELECT * FROM clientes WHERE nome = ?", (nome,))',
            'cur.execute("SELECT * FROM clientes WHERE nome = %s" % nome)',
          ],
          answer: 2,
          explain: 'Só o marcador ? com a tupla de parâmetros deixa o driver separar comando de dado. Qualquer forma de concatenar ou interpolar strings permite que o valor altere o SQL.',
        },
        {
          type: 'fill',
          q: 'Para acessar colunas pelo nome em vez de por posição: `con.row_factory = sqlite3.___`',
          answer: ['Row'],
          explain: 'sqlite3.Row faz cada linha aceitar linha["nome"] além de linha[0], e permite dict(linha).',
        },
        {
          type: 'code',
          q: 'A conexão já tem as tabelas `clientes(id, nome)` e `lancamentos(id, cliente_id, valor)`. Escreva `total_por_cliente(con)` que devolve um dict `{nome: total}` usando uma única consulta SQL com JOIN e GROUP BY. Clientes sem lançamentos não precisam aparecer.',
          starter: `def total_por_cliente(con):
    pass
`,
          tests: `import sqlite3
con = sqlite3.connect(":memory:")
con.execute("CREATE TABLE clientes (id INTEGER PRIMARY KEY, nome TEXT)")
con.execute("CREATE TABLE lancamentos (id INTEGER PRIMARY KEY, cliente_id INTEGER, valor REAL)")
con.executemany("INSERT INTO clientes (id, nome) VALUES (?, ?)", [(1, "Padaria"), (2, "Oficina"), (3, "Mercado")])
con.executemany("INSERT INTO lancamentos (cliente_id, valor) VALUES (?, ?)", [(1, 100.0), (1, 50.5), (2, 20.0)])
r = total_por_cliente(con)
assert r == {"Padaria": 150.5, "Oficina": 20.0}, "Deveria somar os lancamentos de cada cliente"
`,
          solution: `def total_por_cliente(con):
    cur = con.execute("""
        SELECT c.nome, SUM(l.valor)
        FROM clientes c
        JOIN lancamentos l ON l.cliente_id = c.id
        GROUP BY c.id
    """)
    return {nome: total for nome, total in cur.fetchall()}
`,
          hint: 'SELECT c.nome, SUM(l.valor) FROM clientes c JOIN lancamentos l ON ... GROUP BY c.id; depois monte o dict.',
          explain: 'JOIN liga cada lançamento ao seu cliente e GROUP BY agrega por cliente; o banco faz a soma, e o Python só converte as linhas em dict.',
        },
        {
          type: 'tf',
          q: 'O bloco `with con:` em sqlite3 fecha a conexão ao terminar.',
          answer: false,
          explain: 'with con: faz commit (ou rollback se houver exceção), mas a conexão continua aberta. Para fechar, use con.close() ou contextlib.closing.',
        },
        {
          type: 'order',
          q: 'Coloque as cláusulas de uma consulta SQL na ordem em que devem ser escritas.',
          items: ['SELECT conta, SUM(valor)', 'FROM lancamentos', 'WHERE data >= \'2026-01-01\'', 'GROUP BY conta', 'ORDER BY 2 DESC'],
          explain: 'A ordem sintática do SQL é SELECT, FROM, WHERE, GROUP BY, (HAVING), ORDER BY.',
        },
        {
          type: 'code',
          q: 'Escreva `buscar_por_nome(con, termo)` que devolve a lista de nomes da tabela `clientes` cujo nome contém `termo` (use LIKE com `%` e parâmetro `?`), em ordem alfabética. A função deve funcionar mesmo que o termo tenha apóstrofo.',
          starter: `def buscar_por_nome(con, termo):
    pass
`,
          tests: `import sqlite3
con = sqlite3.connect(":memory:")
con.execute("CREATE TABLE clientes (id INTEGER PRIMARY KEY, nome TEXT)")
con.executemany("INSERT INTO clientes (nome) VALUES (?)", [("Padaria Central",), ("Oficina do Ze",), ("Mercado Central",), ("D'Avila Ltda",)])
assert buscar_por_nome(con, "Central") == ["Mercado Central", "Padaria Central"], "Deveria achar os dois 'Central' em ordem alfabetica"
assert buscar_por_nome(con, "D'Av") == ["D'Avila Ltda"], "Apostrofo no termo nao pode quebrar a consulta"
assert buscar_por_nome(con, "xyz") == [], "Sem resultados devolve lista vazia"
`,
          solution: `def buscar_por_nome(con, termo):
    cur = con.execute(
        "SELECT nome FROM clientes WHERE nome LIKE ? ORDER BY nome",
        (f"%{termo}%",),
    )
    return [linha[0] for linha in cur.fetchall()]
`,
          hint: 'Monte o padrão "%termo%" em Python e passe-o como parâmetro, não dentro do SQL.',
          explain: 'O padrão do LIKE é um valor como outro qualquer: passado via ?, um apóstrofo no termo vira texto e não quebra nem altera o comando.',
        },
        {
          type: 'mc',
          q: 'Qual a forma mais segura de guardar valores monetários no SQLite?',
          options: ['REAL, porque aceita casas decimais', 'TEXT no formato "R$ 1.234,56"', 'INTEGER guardando centavos', 'BLOB com o objeto Decimal serializado'],
          answer: 2,
          explain: 'REAL é ponto flutuante e acumula erros de arredondamento. Centavos em INTEGER somam com exatidão e ainda ordenam e comparam corretamente.',
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'py-05-03',
      title: 'Introdução ao pandas',
      minutes: 31,
      content: 'content/python/py-05/03-pandas.md',
      exercises: [
        {
          type: 'mc',
          q: 'Qual operação do pandas corresponde à tabela dinâmica da planilha?',
          options: ['df.merge()', 'df.groupby() / df.pivot_table()', 'df.head()', 'df.to_excel()'],
          answer: 1,
          explain: 'groupby agrupa por uma coluna e aplica agregações; pivot_table faz o mesmo com linhas, colunas e valores, exatamente como a tabela dinâmica.',
        },
        {
          type: 'fill',
          q: 'A convenção universal de importação: `import pandas as ___`',
          answer: ['pd'],
          explain: 'Praticamente todo código e toda documentação usam o apelido pd.',
        },
        {
          type: 'code',
          q: 'Reproduza um groupby com dicionários puros. `agrupar_soma(linhas, chave, campo)` recebe uma lista de dicts e devolve um dict `{valor_da_chave: soma_do_campo}`, com as chaves em ordem alfabética (como o pandas faz).',
          starter: `def agrupar_soma(linhas, chave, campo):
    pass
`,
          tests: `linhas = [
    {"cliente": "Padaria", "receita": 12000.0},
    {"cliente": "Oficina", "receita": 8500.0},
    {"cliente": "Padaria", "receita": 13400.0},
]
r = agrupar_soma(linhas, "cliente", "receita")
assert r == {"Oficina": 8500.0, "Padaria": 25400.0}, "Deveria somar a receita por cliente"
assert list(r.keys()) == ["Oficina", "Padaria"], "As chaves devem vir em ordem alfabetica"
assert agrupar_soma([], "cliente", "receita") == {}, "Lista vazia devolve dict vazio"
`,
          solution: `def agrupar_soma(linhas, chave, campo):
    totais = {}
    for linha in linhas:
        k = linha[chave]
        totais[k] = totais.get(k, 0) + linha[campo]
    return dict(sorted(totais.items()))
`,
          hint: 'Acumule em um dict com .get(k, 0) e devolva dict(sorted(...)).',
          explain: 'É exatamente o que df.groupby(chave)[campo].sum() faz por baixo: agrupa pela chave, soma o campo e ordena as chaves.',
        },
        {
          type: 'mc',
          q: 'Como filtrar um DataFrame por duas condições ao mesmo tempo?',
          options: [
            'df[df["mes"] == "2026-02" and df["receita"] > 10000]',
            'df[(df["mes"] == "2026-02") & (df["receita"] > 10000)]',
            'df.filter(mes="2026-02", receita>10000)',
            'df[df["mes"] == "2026-02" && df["receita"] > 10000]',
          ],
          answer: 1,
          explain: 'Filtros usam máscaras booleanas combinadas com & (e), | (ou) e ~ (não), cada condição entre parênteses. and/or lançam erro de ambiguidade.',
        },
        {
          type: 'order',
          q: 'Ordene o fluxo típico de uma análise com pandas.',
          items: ['pd.read_csv("lanc.csv", sep=";", decimal=",")', 'df.info() para conferir tipos e nulos', 'df = df[df["valor"] > 0]', 'resumo = df.groupby("conta")["valor"].sum()', 'resumo.to_excel("resumo.xlsx")'],
          explain: 'Ler, inspecionar, limpar/filtrar, agregar e exportar é a sequência que você repete em quase todo relatório.',
        },
        {
          type: 'code',
          q: 'Reproduza um `merge(how="left")` com dicionários. `juntar_esquerda(esquerda, direita, chave)` recebe duas listas de dicts e devolve uma nova lista: para cada dict da esquerda, acrescente os campos do dict da direita que tem o mesmo valor em `chave`. Se não houver correspondência, acrescente os campos da direita com valor `None`. Não altere os dicts originais.',
          starter: `def juntar_esquerda(esquerda, direita, chave):
    pass
`,
          tests: `esq = [{"cliente": "Padaria", "receita": 100}, {"cliente": "Bar", "receita": 50}]
dir_ = [{"cliente": "Padaria", "regime": "Simples"}, {"cliente": "Oficina", "regime": "Presumido"}]
r = juntar_esquerda(esq, dir_, "cliente")
assert r == [
    {"cliente": "Padaria", "receita": 100, "regime": "Simples"},
    {"cliente": "Bar", "receita": 50, "regime": None},
], "Esquerda mantida; sem correspondencia, campos da direita viram None"
assert esq[0] == {"cliente": "Padaria", "receita": 100}, "Nao altere os dicts originais"
assert juntar_esquerda([], dir_, "cliente") == [], "Esquerda vazia devolve lista vazia"
`,
          solution: `def juntar_esquerda(esquerda, direita, chave):
    indice = {d[chave]: d for d in direita}
    campos_direita = [c for d in direita for c in d.keys() if c != chave]
    campos_direita = list(dict.fromkeys(campos_direita))
    resultado = []
    for e in esquerda:
        novo = dict(e)
        par = indice.get(e[chave])
        for campo in campos_direita:
            novo[campo] = par.get(campo) if par else None
        resultado.append(novo)
    return resultado
`,
          hint: 'Monte um índice {valor_chave: dict} da direita; para cada item da esquerda copie-o e complete com os campos da direita (ou None).',
          explain: 'merge(how="left") mantém todas as linhas da esquerda e preenche com NaN o que não casa; aqui None faz o papel do NaN. Copiar os dicts evita alterar os dados originais.',
        },
        {
          type: 'tf',
          q: 'Para ler um CSV brasileiro (ponto e vírgula e vírgula decimal) corretamente, basta `pd.read_csv("arquivo.csv")` com os parâmetros padrão.',
          answer: false,
          explain: 'Os padrões são sep="," e decimal=".". Sem sep=";" e decimal="," a coluna de valores vira texto ou tudo cai em uma única coluna.',
        },
        {
          type: 'match',
          q: 'Relacione a operação da planilha ao equivalente em pandas.',
          pairs: [['PROCV', 'merge(how="left")'], ['Tabela dinâmica', 'pivot_table'], ['Filtro', 'df[mascara]'], ['Salvar como .xlsx', 'to_excel']],
          explain: 'Cada recurso da planilha tem um correspondente direto e reproduzível em código.',
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'py-05-04',
      title: 'Automação de escritório',
      minutes: 34,
      content: 'content/python/py-05/04-automacao-de-escritorio.md',
      exercises: [
        {
          type: 'mc',
          q: 'Você abriu uma planilha com openpyxl e a célula B10, que tem `=SUM(B2:B9)`, devolveu o texto da fórmula em vez do número. O que fazer?',
          options: ['Chamar ws.calculate()', 'Abrir com load_workbook(arquivo, data_only=True)', 'Converter com float(ws["B10"].value)', 'Trocar para pandas'],
          answer: 1,
          explain: 'data_only=True faz o openpyxl devolver o último valor calculado pelo Excel. O openpyxl não calcula fórmulas; se o arquivo nunca foi aberto no Excel, o valor será None.',
        },
        {
          type: 'code',
          q: 'Escreva `montar_corpo_email(cliente, competencia, total)` que devolve o texto do e-mail de fechamento com exatamente estas linhas: `Olá, {cliente}!`, uma linha em branco, `Segue o fechamento de {competencia}.`, `Receita total: R$ {total}` (total com duas casas, ponto de milhar e vírgula decimal, ex.: 12.345,67), uma linha em branco e `Equipe Contábil`.',
          starter: `def montar_corpo_email(cliente, competencia, total):
    pass
`,
          tests: `esperado = "Olá, Padaria!\\n\\nSegue o fechamento de 2026-03.\\nReceita total: R$ 12.345,67\\n\\nEquipe Contábil"
assert montar_corpo_email("Padaria", "2026-03", 12345.67) == esperado, "O texto deve seguir exatamente o formato pedido"
assert "R$ 900,00" in montar_corpo_email("X", "2026-01", 900), "Valor sem centavos deve mostrar ,00"
assert "R$ 1.000.000,50" in montar_corpo_email("X", "2026-01", 1000000.5), "Milhoes precisam de dois pontos de milhar"
`,
          solution: `def montar_corpo_email(cliente, competencia, total):
    valor = f"{total:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
    return (
        f"Olá, {cliente}!\\n\\n"
        f"Segue o fechamento de {competencia}.\\n"
        f"Receita total: R$ {valor}\\n\\n"
        "Equipe Contábil"
    )
`,
          hint: 'Formate com f"{total:,.2f}" (padrão americano) e troque os separadores: vírgula por ponto e ponto por vírgula, usando um caractere temporário.',
          explain: 'Montar o corpo do e-mail é uma função pura: você confere o texto com um assert, sem rede. O envio (smtplib) fica em outra função.',
        },
        {
          type: 'fill',
          q: 'Antes de fazer login no servidor SMTP na porta 587, criptografe a conexão: `smtp.___()`',
          answer: ['starttls'],
          explain: 'starttls() atualiza a conexão para TLS. Sem isso, usuário e senha trafegariam em texto puro.',
        },
        {
          type: 'code',
          q: 'Simule uma pasta de trabalho como dict `{nome_da_aba: linhas}`, onde cada linha é uma lista `[cliente, valor]` e a primeira linha de cada aba é o cabeçalho. Escreva `totais_por_aba(planilha)` que devolve `{nome_da_aba: soma_dos_valores}`, ignorando o cabeçalho e linhas cujo valor seja `None`.',
          starter: `def totais_por_aba(planilha):
    pass
`,
          tests: `planilha = {
    "Janeiro": [["Cliente", "Valor"], ["Padaria", 100.0], ["Oficina", 50.0]],
    "Fevereiro": [["Cliente", "Valor"], ["Padaria", 200.0], ["Mercado", None]],
    "Marco": [["Cliente", "Valor"]],
}
assert totais_por_aba(planilha) == {"Janeiro": 150.0, "Fevereiro": 200.0, "Marco": 0}, "Some os valores de cada aba ignorando cabecalho e None"
`,
          solution: `def totais_por_aba(planilha):
    totais = {}
    for aba, linhas in planilha.items():
        soma = 0
        for linha in linhas[1:]:
            if linha[1] is not None:
                soma += linha[1]
        totais[aba] = soma
    return totais
`,
          hint: 'Percorra linhas[1:] de cada aba e some linha[1] quando não for None.',
          explain: 'É o mesmo que ws.iter_rows(min_row=2, values_only=True) faria em cada aba do openpyxl; células vazias chegam como None e precisam ser ignoradas.',
        },
        {
          type: 'tf',
          q: 'O openpyxl recalcula as fórmulas da planilha quando você salva o arquivo.',
          answer: false,
          explain: 'O openpyxl só grava o texto da fórmula. Quem calcula é o Excel (ou LibreOffice) ao abrir o arquivo. Se precisar do número em Python, calcule em Python.',
        },
        {
          type: 'mc',
          q: 'Qual fórmula deve ser gravada com openpyxl para que o Excel em português a exiba como =SOMA(B2:B9)?',
          options: ['"=SOMA(B2:B9)"', '"=SUM(B2:B9)"', '"=SUM(B2;B9)"', '"SOMA(B2:B9)"'],
          answer: 1,
          explain: 'O arquivo .xlsx guarda as fórmulas sempre em inglês, com vírgula como separador de argumentos. O Excel traduz para o idioma do usuário ao exibir.',
        },
        {
          type: 'order',
          q: 'Ordene os passos para enviar um e-mail com anexo em Python.',
          items: ['msg = EmailMessage() e preencher Subject, From, To', 'msg.set_content(texto)', 'msg.add_attachment(bytes, maintype=..., subtype=..., filename=...)', 'with smtplib.SMTP(host, 587) as smtp: smtp.starttls()', 'smtp.login(usuario, senha_de_aplicativo)', 'smtp.send_message(msg)'],
          explain: 'Primeiro monta-se a mensagem completa (função pura), depois abre-se a conexão segura, autentica-se e envia-se.',
        },
        {
          type: 'code',
          q: 'O openpyxl identifica colunas por letras. Escreva `letra_coluna(n)` que converte o número da coluna (1 = A, 26 = Z, 27 = AA, 52 = AZ, 53 = BA, 702 = ZZ) na letra correspondente, sem usar openpyxl.',
          starter: `def letra_coluna(n):
    pass
`,
          tests: `assert letra_coluna(1) == "A", "1 deve ser A"
assert letra_coluna(26) == "Z", "26 deve ser Z"
assert letra_coluna(27) == "AA", "27 deve ser AA"
assert letra_coluna(52) == "AZ", "52 deve ser AZ"
assert letra_coluna(53) == "BA", "53 deve ser BA"
assert letra_coluna(702) == "ZZ", "702 deve ser ZZ"
assert letra_coluna(703) == "AAA", "703 deve ser AAA"
`,
          solution: `def letra_coluna(n):
    letras = ""
    while n > 0:
        n, resto = divmod(n - 1, 26)
        letras = chr(ord("A") + resto) + letras
    return letras
`,
          hint: 'É uma base 26 sem zero: use divmod(n - 1, 26) em um laço e monte a string da direita para a esquerda.',
          explain: 'As letras de coluna são uma numeração em base 26 sem o dígito zero; o n - 1 em cada passo compensa isso. É o algoritmo de openpyxl.utils.get_column_letter.',
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'py-05-05',
      title: 'Concorrência: threads e processos',
      minutes: 32,
      content: 'content/python/py-05/05-concorrencia.md',
      exercises: [
        {
          type: 'mc',
          q: 'O que o GIL (Global Interpreter Lock) impede no CPython?',
          options: ['Criar mais de uma thread', 'Que duas threads executem bytecode Python ao mesmo tempo', 'Usar processos', 'Acessar a rede em paralelo'],
          answer: 1,
          explain: 'O GIL permite criar várias threads, mas só uma executa código Python por vez. Enquanto uma espera I/O, ela libera o GIL, por isso threads ajudam em tarefas I/O-bound mas não em CPU-bound.',
        },
        {
          type: 'tf',
          q: 'Em Python, usar 4 threads para um cálculo pesado em Python puro deixa o cálculo cerca de 4 vezes mais rápido.',
          answer: false,
          explain: 'Por causa do GIL, as threads se revezam no mesmo núcleo. Para cálculo pesado, use ProcessPoolExecutor, que cria interpretadores separados.',
        },
        {
          type: 'code',
          q: 'Prepare a lógica que seria paralelizada. Escreva `processar_lote(lancamentos)` (recebe lista de dicts com `conta` e `valor`, devolve `{conta: soma}`) e `juntar(parciais)` (recebe uma lista desses dicts parciais e devolve um único dict somando as contas). As duas funções devem ser puras.',
          starter: `def processar_lote(lancamentos):
    pass

def juntar(parciais):
    pass
`,
          tests: `lote1 = [{"conta": "1.1", "valor": 10.0}, {"conta": "2.1", "valor": 5.0}, {"conta": "1.1", "valor": 2.5}]
lote2 = [{"conta": "1.1", "valor": 1.0}, {"conta": "3.1", "valor": 7.0}]
p1 = processar_lote(lote1)
assert p1 == {"1.1": 12.5, "2.1": 5.0}, "processar_lote deve somar por conta"
assert processar_lote([]) == {}, "Lote vazio devolve dict vazio"
total = juntar([p1, processar_lote(lote2)])
assert total == {"1.1": 13.5, "2.1": 5.0, "3.1": 7.0}, "juntar deve somar os parciais"
assert juntar([]) == {}, "Sem parciais, dict vazio"
assert lote1[0] == {"conta": "1.1", "valor": 10.0}, "Nao altere a entrada"
`,
          solution: `def processar_lote(lancamentos):
    totais = {}
    for l in lancamentos:
        totais[l["conta"]] = totais.get(l["conta"], 0.0) + l["valor"]
    return totais

def juntar(parciais):
    final = {}
    for p in parciais:
        for conta, v in p.items():
            final[conta] = final.get(conta, 0.0) + v
    return final
`,
          hint: 'Ambas acumulam em um dict com .get(chave, 0.0). Em produção, juntar(executor.map(processar_lote, lotes)) faria o paralelismo.',
          explain: 'Funções puras, sem estado compartilhado, são as únicas seguras para rodar em paralelo: cada lote devolve um resultado e a junção acontece depois, sem Lock.',
        },
        {
          type: 'fill',
          q: 'Para proteger um dado compartilhado entre threads, crie a trava: `trava = threading.___()` e use `with trava:` ao alterar o dado.',
          answer: ['Lock'],
          explain: 'threading.Lock garante que só uma thread por vez execute o bloco protegido, evitando condições de corrida.',
        },
        {
          type: 'mc',
          q: 'Você precisa calcular a depreciação de 2 milhões de bens em Python puro. Qual executor escolher?',
          options: ['ThreadPoolExecutor', 'ProcessPoolExecutor', 'asyncio.gather', 'Nenhum: threads e processos são equivalentes'],
          answer: 1,
          explain: 'Cálculo pesado é CPU-bound. Só processos escapam do GIL e usam vários núcleos de verdade.',
        },
        {
          type: 'order',
          q: 'Ordene o uso típico de concurrent.futures para consultar vários CNPJs.',
          items: ['escrever a função pura consultar(cnpj) e testá-la isoladamente', 'with ThreadPoolExecutor(max_workers=8) as executor:', 'futuros = {executor.submit(consultar, c): c for c in cnpjs}', 'for fut in as_completed(futuros):', 'resultado = fut.result() dentro de try/except'],
          explain: 'Função pura primeiro; depois o executor, o envio das tarefas, a iteração conforme terminam e a leitura do resultado protegida contra exceções relançadas.',
        },
        {
          type: 'code',
          q: 'Antes de paralelizar, é comum dividir o trabalho. Escreva `dividir_em_lotes(itens, tamanho)` que devolve uma lista de listas, cada uma com até `tamanho` itens, preservando a ordem. Se `tamanho` for menor que 1, levante `ValueError`.',
          starter: `def dividir_em_lotes(itens, tamanho):
    pass
`,
          tests: `assert dividir_em_lotes([1, 2, 3, 4, 5], 2) == [[1, 2], [3, 4], [5]], "O ultimo lote pode ser menor"
assert dividir_em_lotes([1, 2, 3, 4], 2) == [[1, 2], [3, 4]], "Divisao exata"
assert dividir_em_lotes([], 3) == [], "Lista vazia devolve lista vazia"
assert dividir_em_lotes([1, 2], 10) == [[1, 2]], "Tamanho maior que a lista gera um unico lote"
try:
    dividir_em_lotes([1], 0)
    assert False, "tamanho 0 deveria levantar ValueError"
except ValueError:
    pass
try:
    dividir_em_lotes([1, 2], -3)
    assert False, "tamanho negativo deveria levantar ValueError"
except ValueError:
    pass
`,
          solution: `def dividir_em_lotes(itens, tamanho):
    if tamanho < 1:
        raise ValueError("tamanho deve ser >= 1")
    return [itens[i:i + tamanho] for i in range(0, len(itens), tamanho)]
`,
          hint: 'range(0, len(itens), tamanho) dá os índices de início; fatie itens[i:i+tamanho].',
          explain: 'Dividir em lotes reduz o custo de enviar dados a processos (menos pickles) e permite controlar a granularidade do paralelismo.',
        },
        {
          type: 'match',
          q: 'Relacione o termo à definição.',
          pairs: [['I/O-bound', 'passa o tempo esperando rede ou disco'], ['CPU-bound', 'passa o tempo calculando'], ['condição de corrida', 'resultado depende da ordem em que threads acessam um dado'], ['deadlock', 'threads esperam umas às outras para sempre']],
          explain: 'Classificar a tarefa (I/O ou CPU) define a ferramenta; corrida e deadlock são os dois bugs clássicos do estado compartilhado.',
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'py-05-06',
      title: 'Programação assíncrona com asyncio',
      minutes: 32,
      content: 'content/python/py-05/06-asyncio.md',
      exercises: [
        {
          type: 'mc',
          q: 'O que acontece ao chamar `consultar("A")` quando `consultar` foi definida com `async def`, sem usar `await`?',
          options: ['A função executa normalmente e devolve o resultado', 'É criado um objeto coroutine que não executa; o Python avisa que nunca foi aguardado', 'O programa trava', 'O Python lança SyntaxError'],
          answer: 1,
          explain: 'Chamar uma função async apenas cria a coroutine. Ela só roda quando alguém dá await nela ou a entrega ao loop (create_task, gather, asyncio.run).',
        },
        {
          type: 'code',
          q: 'Defina a coroutine `async def dobrar(x)` que aguarda `asyncio.sleep(0)` (simulando uma espera) e devolve o dobro de `x`.',
          starter: `import asyncio

async def dobrar(x):
    pass
`,
          tests: `import asyncio, inspect
assert inspect.iscoroutinefunction(dobrar), "dobrar deve ser definida com async def"
_r = await dobrar(21)
assert _r == 42, "dobrar(21) deveria devolver 42"
_r2 = await dobrar(-4)
assert _r2 == -8, "dobrar(-4) deveria devolver -8"
`,
          solution: `import asyncio

async def dobrar(x):
    await asyncio.sleep(0)
    return x * 2
`,
          hint: 'Dentro de async def, use await asyncio.sleep(0) e depois return.',
          explain: 'async def define uma coroutine; o await em asyncio.sleep(0) é o ponto em que o loop pode executar outras tarefas antes de a função continuar.',
        },
        {
          type: 'fill',
          q: 'Para aguardar várias coroutines ao mesmo tempo e receber os resultados na ordem de entrada: `resultados = await asyncio.___(*coroutines)`',
          answer: ['gather'],
          explain: 'gather agenda todas as coroutines e devolve uma lista de resultados na mesma ordem em que foram passadas.',
        },
        {
          type: 'tf',
          q: 'Usar `time.sleep(2)` dentro de uma coroutine bloqueia o loop de eventos inteiro por 2 segundos.',
          answer: true,
          explain: 'time.sleep é síncrono e segura a única thread do loop. Em código async, use await asyncio.sleep(2).',
        },
        {
          type: 'mc',
          q: 'Em `await asyncio.gather(consultar("A", 0.3), consultar("B", 0.1))`, em que ordem vêm os resultados?',
          options: ['Na ordem em que terminaram: B depois A', 'Na ordem de entrada: A depois B', 'Em ordem aleatória', 'gather devolve um dict, não uma lista'],
          answer: 1,
          explain: 'gather preserva a ordem de entrada, independentemente de qual coroutine terminou primeiro.',
        },
        {
          type: 'order',
          q: 'Ordene os passos de um programa asyncio que consulta vários CEPs com limite de concorrência.',
          items: ['sem = asyncio.Semaphore(5)', 'async def buscar(cep): async with sem: ... await ...', 'async def main(): resultados = await asyncio.gather(*(buscar(c) for c in ceps))', 'asyncio.run(main())'],
          explain: 'Cria-se o semáforo, define-se a coroutine que o respeita, a main que reúne tudo com gather e, por fim, uma única chamada a asyncio.run.',
        },
        {
          type: 'code',
          q: 'Defina `async def somar_lote(lote)` que aguarda `asyncio.sleep(0)` e devolve a soma da lista, e `async def somar_tudo(lotes)` que usa `asyncio.gather` para somar todos os lotes em paralelo e devolve o total geral (um número).',
          starter: `import asyncio

async def somar_lote(lote):
    pass

async def somar_tudo(lotes):
    pass
`,
          tests: `import asyncio, inspect
assert inspect.iscoroutinefunction(somar_lote), "somar_lote deve ser async def"
assert inspect.iscoroutinefunction(somar_tudo), "somar_tudo deve ser async def"
import re as _re
_fonte = ""
try:
    _fonte = inspect.getsource(somar_tudo)
except Exception:
    pass
if _fonte:
    assert "gather" in _fonte, "somar_tudo deve usar asyncio.gather"
_r = await somar_tudo([[1, 2, 3], [10, 20], [100]])
assert _r == 136, "somar_tudo deveria devolver 136"
_r2 = await somar_tudo([])
assert _r2 == 0, "Sem lotes, total 0"
_r3 = await somar_lote([4, 5])
assert _r3 == 9, "somar_lote([4, 5]) deveria devolver 9"
`,
          solution: `import asyncio

async def somar_lote(lote):
    await asyncio.sleep(0)
    return sum(lote)

async def somar_tudo(lotes):
    parciais = await asyncio.gather(*(somar_lote(l) for l in lotes))
    return sum(parciais)
`,
          hint: 'parciais = await asyncio.gather(*(somar_lote(l) for l in lotes)); devolva sum(parciais).',
          explain: 'gather agenda todas as coroutines de uma vez e espera todas; com await em sequência, cada lote só começaria quando o anterior terminasse.',
        },
        {
          type: 'mc',
          q: 'Em qual destes casos async NÃO compensa?',
          options: ['Servidor web com milhares de conexões simultâneas', 'Robô que faz 3 mil requisições HTTP', 'Cálculo pesado de juros compostos em 5 milhões de contratos', 'Cliente de WebSocket que recebe cotações em tempo real'],
          answer: 2,
          explain: 'Async roda em uma única thread e não acelera CPU. Para cálculo pesado, use processos. Os outros três são cenários de muita espera de rede, ideais para asyncio.',
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'py-05-07',
      title: 'Web com Flask e FastAPI',
      minutes: 35,
      content: 'content/python/py-05/07-web-flask-fastapi.md',
      exercises: [
        {
          type: 'mc',
          q: 'No Flask, o que faz `@app.route("/clientes/<int:cliente_id>")`?',
          options: ['Cria a tabela clientes no banco', 'Liga a URL à função abaixo e converte o trecho variável em inteiro', 'Faz uma requisição GET para /clientes', 'Define um template Jinja2'],
          answer: 1,
          explain: 'O decorator registra a view para aquela URL; <int:cliente_id> captura o segmento e o passa como parâmetro inteiro para a função.',
        },
        {
          type: 'code',
          q: 'Escreva `validar_payload(dados)`, a função pura usada na rota POST /clientes. Ela recebe um dict e devolve uma lista de mensagens de erro (vazia se tudo estiver certo): `"nome é obrigatório"` se `nome` estiver ausente ou em branco; `"regime inválido"` se `regime` não for Simples, Presumido ou Real; `"cnpj deve ter 14 dígitos"` se `cnpj` existir e não tiver exatamente 14 dígitos numéricos (cnpj ausente é aceito).',
          starter: `def validar_payload(dados):
    pass
`,
          tests: `assert validar_payload({"nome": "Padaria", "regime": "Simples"}) == [], "Payload valido devolve lista vazia"
assert validar_payload({"nome": "Padaria", "regime": "Simples", "cnpj": "11222333000181"}) == [], "CNPJ com 14 digitos e aceito"
assert validar_payload({"nome": "   ", "regime": "Simples"}) == ["nome é obrigatório"], "Nome em branco e invalido"
assert validar_payload({"regime": "Lucro"}) == ["nome é obrigatório", "regime inválido"], "Dois erros, na ordem nome depois regime"
assert validar_payload({"nome": "X", "regime": "Real", "cnpj": "123"}) == ["cnpj deve ter 14 dígitos"], "CNPJ curto e invalido"
assert validar_payload({"nome": "X", "regime": "Real", "cnpj": "1122233300018A"}) == ["cnpj deve ter 14 dígitos"], "CNPJ com letra e invalido"
`,
          solution: `def validar_payload(dados):
    erros = []
    if not str(dados.get("nome", "")).strip():
        erros.append("nome é obrigatório")
    if dados.get("regime") not in {"Simples", "Presumido", "Real"}:
        erros.append("regime inválido")
    cnpj = dados.get("cnpj")
    if cnpj is not None and not (len(str(cnpj)) == 14 and str(cnpj).isdigit()):
        erros.append("cnpj deve ter 14 dígitos")
    return erros
`,
          hint: 'Acumule as mensagens em uma lista na ordem nome, regime, cnpj. Use .strip(), um conjunto de regimes válidos e str.isdigit().',
          explain: 'Validar em uma função pura permite testar cada regra com assert, sem servidor. A rota só chama a função e devolve 400 com a lista de erros.',
        },
        {
          type: 'fill',
          q: 'No Flask, para devolver JSON com o status "Created" após criar um recurso: `return jsonify(novo), ___`',
          answer: ['201'],
          explain: 'A tupla (corpo, status) define o código HTTP da resposta; 201 Created é o status convencional após um POST bem-sucedido.',
        },
        {
          type: 'code',
          q: 'Escreva `montar_resposta_paginada(itens, pagina, por_pagina)`, função pura usada em uma rota GET. Devolva um dict com `items` (a fatia correspondente à página, começando em 1), `page`, `per_page`, `total` (quantidade total de itens) e `has_next` (True se existir página seguinte).',
          starter: `def montar_resposta_paginada(itens, pagina, por_pagina):
    pass
`,
          tests: `itens = list(range(1, 11))  # 1..10
r = montar_resposta_paginada(itens, 1, 4)
assert r == {"items": [1, 2, 3, 4], "page": 1, "per_page": 4, "total": 10, "has_next": True}, "Primeira pagina de 4"
r = montar_resposta_paginada(itens, 3, 4)
assert r == {"items": [9, 10], "page": 3, "per_page": 4, "total": 10, "has_next": False}, "Ultima pagina, incompleta, sem proxima"
r = montar_resposta_paginada(itens, 5, 4)
assert r["items"] == [] and r["has_next"] is False, "Pagina alem do fim devolve lista vazia"
r = montar_resposta_paginada([], 1, 10)
assert r == {"items": [], "page": 1, "per_page": 10, "total": 0, "has_next": False}, "Sem itens"
`,
          solution: `def montar_resposta_paginada(itens, pagina, por_pagina):
    inicio = (pagina - 1) * por_pagina
    fim = inicio + por_pagina
    return {
        "items": itens[inicio:fim],
        "page": pagina,
        "per_page": por_pagina,
        "total": len(itens),
        "has_next": fim < len(itens),
    }
`,
          hint: 'inicio = (pagina - 1) * por_pagina; fim = inicio + por_pagina; has_next é fim < len(itens).',
          explain: 'É o lado servidor da paginação vista na lição de APIs: a resposta informa a fatia e se há próxima página, para que o cliente saiba quando parar.',
        },
        {
          type: 'tf',
          q: 'Templates Jinja2 escapam HTML automaticamente, protegendo contra XSS quando você exibe dados digitados pelo usuário.',
          answer: true,
          explain: 'Por padrão, {{ variavel }} converte < > & em entidades HTML. Montar HTML com f-strings perderia essa proteção.',
        },
        {
          type: 'mc',
          q: 'No FastAPI, você enviou `{"conta": "", "valor": -5}` para uma rota que espera um modelo Pydantic com `conta: str = Field(min_length=1)` e `valor: float = Field(gt=0)`. Qual o status da resposta?',
          options: ['200, e a função recebe os dados inválidos', '500 Internal Server Error', '422 com a lista de campos inválidos', '404 Not Found'],
          answer: 2,
          explain: 'O FastAPI valida o corpo contra o modelo antes de chamar sua função e devolve 422 Unprocessable Entity detalhando cada violação.',
        },
        {
          type: 'order',
          q: 'Ordene o caminho de uma requisição POST em um projeto bem organizado.',
          items: ['navegador/cliente envia POST /clientes com JSON', 'a rota lê request.get_json()', 'a rota chama validar_payload(dados) (função pura em servicos.py)', 'se houver erros, devolve 400 com a lista; senão chama o repositório para gravar', 'a rota devolve jsonify(novo), 201'],
          explain: 'A rota é fina: traduz HTTP para chamadas de função e o retorno em resposta. A lógica fica nas funções puras, testáveis sem servidor.',
        },
        {
          type: 'code',
          q: 'Escreva `parsear_query(query_string)` que recebe uma query string como `"regime=Simples&uf=SE&page=2"` e devolve um dict com um valor por chave (não lista), usando `urllib.parse.parse_qs`. Se uma chave aparecer mais de uma vez, fique com o primeiro valor. String vazia devolve dict vazio.',
          starter: `from urllib.parse import parse_qs

def parsear_query(query_string):
    pass
`,
          tests: `assert parsear_query("regime=Simples&uf=SE&page=2") == {"regime": "Simples", "uf": "SE", "page": "2"}, "Cada chave vira um valor simples"
assert parsear_query("q=S%C3%A3o+Paulo") == {"q": "São Paulo"}, "A codificacao da URL deve ser desfeita"
assert parsear_query("uf=SE&uf=BA") == {"uf": "SE"}, "Chave repetida: fica o primeiro valor"
assert parsear_query("") == {}, "String vazia devolve dict vazio"
`,
          solution: `from urllib.parse import parse_qs

def parsear_query(query_string):
    bruto = parse_qs(query_string)
    return {chave: valores[0] for chave, valores in bruto.items()}
`,
          hint: 'parse_qs devolve {chave: [valores]}; pegue o índice 0 de cada lista.',
          explain: 'parse_qs devolve listas porque uma chave pode se repetir na URL; request.args do Flask faz a mesma simplificação ao devolver o primeiro valor.',
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'py-05-08',
      title: 'Git e GitHub',
      minutes: 30,
      content: 'content/python/py-05/08-git-e-github.md',
      exercises: [
        {
          type: 'mc',
          q: 'Qual comando mostra o que mudou, o que está preparado e em qual branch você está?',
          options: ['git log', 'git status', 'git diff --staged', 'git branch'],
          answer: 1,
          explain: 'git status é o painel geral do repositório. git log mostra a história, git diff mostra linhas alteradas e git branch lista branches.',
        },
        {
          type: 'fill',
          q: 'Para criar uma branch chamada envio-email e já mudar para ela: `git switch ___ envio-email`',
          answer: ['-c'],
          explain: 'git switch -c cria e troca para a nova branch (equivalente ao antigo git checkout -b).',
        },
        {
          type: 'order',
          q: 'Ordene o fluxo diário de trabalho com Git e GitHub.',
          items: ['git switch main && git pull', 'git switch -c minha-tarefa', 'editar, testar, git add -A && git commit -m "..."', 'git push -u origin minha-tarefa', 'abrir pull request, revisar e fazer merge'],
          explain: 'Começar atualizado, isolar a tarefa em uma branch, commitar, enviar e integrar via PR evita conflitos e mantém a main sempre funcional.',
        },
        {
          type: 'tf',
          q: 'Se você apagar a senha de um arquivo e fizer um novo commit, ela some da história do repositório.',
          answer: false,
          explain: 'Commits anteriores continuam guardando a versão com a senha. Se um segredo entrou no Git, troque a senha; e use .gitignore para o .env desde o primeiro commit.',
        },
        {
          type: 'match',
          q: 'Relacione o comando ao que ele faz.',
          pairs: [['git add', 'prepara mudanças para o próximo commit'], ['git commit', 'grava uma fotografia com mensagem'], ['git push', 'envia commits ao remoto'], ['git pull', 'traz e integra commits do remoto'], ['git merge', 'junta outra branch na atual']],
          explain: 'add e commit atuam localmente; push e pull conversam com o remoto; merge integra linhas de desenvolvimento.',
        },
        {
          type: 'mc',
          q: 'Após um `git merge`, o arquivo config.py ficou com trechos entre `<<<<<<< HEAD`, `=======` e `>>>>>>> outra-branch`. O que fazer?',
          options: ['Apagar o arquivo e baixar de novo', 'Editar o arquivo deixando a versão correta sem os marcadores, rodar os testes, git add e git commit', 'Rodar git push --force', 'Ignorar: o Git resolve sozinho no próximo commit'],
          answer: 1,
          explain: 'Os marcadores delimitam as duas versões em conflito. Você escolhe (ou combina) o conteúdo, remove os marcadores, confere com testes e conclui o merge com add e commit.',
        },
        {
          type: 'fill',
          q: 'Para desfazer um commit que já foi enviado ao GitHub sem reescrever a história, criando um novo commit inverso: `git ___ abc1234`',
          answer: ['revert'],
          explain: 'revert cria um commit que desfaz as mudanças de outro, preservando a história. reset --hard reescreve e só deve ser usado em commits locais.',
        },
        {
          type: 'order',
          q: 'Ordene os passos para publicar um site estático com GitHub Pages.',
          items: ['criar o repositório no GitHub e fazer git push da branch main', 'abrir Settings e depois Pages no repositório', 'escolher a branch main e a pasta (/ ou /docs)', 'aguardar a publicação e acessar https://usuario.github.io/repo/'],
          explain: 'Pages serve os arquivos da branch e pasta escolhidas; cada push republica automaticamente.',
        },
        {
          type: 'mc',
          q: 'Qual destes itens NÃO deve ir para o .gitignore?',
          options: ['.venv/', '.env', 'requirements.txt', '*.db'],
          answer: 2,
          explain: 'requirements.txt descreve as dependências e deve ser versionado. O venv é recriável, o .env tem segredos e bancos .db são dados gerados.',
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'py-05-09',
      title: 'Projeto guiado: Robô de fechamento',
      minutes: 34,
      content: 'content/python/py-05/09-projeto-robo-de-fechamento.md',
      exercises: [
        {
          type: 'code',
          q: 'Implemente `parsear_lancamento(bruto)` do domínio: recebe o dict vindo da API e devolve `{"id": int, "conta": str sem espaços nas pontas, "valor_centavos": int}`. O valor vem como número ou string decimal (ex.: `"100.50"`) e deve virar centavos arredondados. Levante `ValueError` se `valor` estiver ausente ou não for numérico, ou se `conta` estiver ausente ou vazia.',
          starter: `def parsear_lancamento(bruto):
    pass
`,
          tests: `assert parsear_lancamento({"id": "7", "conta": " 1.1.01 ", "valor": "100.50"}) == {"id": 7, "conta": "1.1.01", "valor_centavos": 10050}, "Deve converter id, limpar conta e transformar o valor em centavos"
assert parsear_lancamento({"id": 2, "conta": "3.1", "valor": -20})["valor_centavos"] == -2000, "Valores negativos sao permitidos"
assert parsear_lancamento({"id": 3, "conta": "3.1", "valor": 0.1 + 0.2})["valor_centavos"] == 30, "Arredonde para evitar erro de ponto flutuante"
for ruim in [{"id": 1, "conta": "1.1"}, {"id": 1, "conta": "1.1", "valor": "abc"}, {"id": 1, "valor": 10}, {"id": 1, "conta": "", "valor": 10}]:
    try:
        parsear_lancamento(ruim)
        assert False, f"Deveria levantar ValueError para {ruim}"
    except ValueError:
        pass
`,
          solution: `def parsear_lancamento(bruto):
    try:
        valor = round(float(bruto["valor"]) * 100)
    except (KeyError, TypeError, ValueError):
        raise ValueError(f"valor inválido em {bruto!r}")
    conta = str(bruto.get("conta") or "").strip()
    if not conta:
        raise ValueError("conta vazia")
    return {"id": int(bruto["id"]), "conta": conta, "valor_centavos": valor}
`,
          hint: 'round(float(valor) * 100) dentro de try/except que relança ValueError; confira a conta com .strip().',
          explain: 'A fronteira entre a API e o domínio é onde se valida e se normaliza: centavos inteiros evitam erros de ponto flutuante e ValueError sinaliza itens que a aplicação deve rejeitar e logar.',
        },
        {
          type: 'code',
          q: 'Implemente `totalizar_por_conta(lancamentos)`: recebe uma lista de dicts com `conta` e `valor_centavos` e devolve `{conta: total_em_centavos}` com as contas em ordem alfabética.',
          starter: `def totalizar_por_conta(lancamentos):
    pass
`,
          tests: `lancs = [
    {"id": 1, "conta": "3.1.01", "valor_centavos": -2000},
    {"id": 2, "conta": "1.1.01", "valor_centavos": 10000},
    {"id": 3, "conta": "1.1.01", "valor_centavos": 550},
]
r = totalizar_por_conta(lancs)
assert r == {"1.1.01": 10550, "3.1.01": -2000}, "Deve somar centavos por conta"
assert list(r.keys()) == ["1.1.01", "3.1.01"], "Contas em ordem alfabetica"
assert totalizar_por_conta([]) == {}, "Lista vazia devolve dict vazio"
`,
          solution: `def totalizar_por_conta(lancamentos):
    totais = {}
    for l in lancamentos:
        totais[l["conta"]] = totais.get(l["conta"], 0) + l["valor_centavos"]
    return dict(sorted(totais.items()))
`,
          hint: 'Acumule em um dict e devolva dict(sorted(totais.items())).',
          explain: 'Função pura do domínio: a mesma soma alimenta a planilha, o e-mail e os testes, sem depender de banco ou rede.',
        },
        {
          type: 'code',
          q: 'Implemente `formatar_reais(centavos)` que recebe um inteiro em centavos e devolve texto no padrão brasileiro: `1234567` vira `"R$ 12.345,67"`, `5` vira `"R$ 0,05"`, `-150000` vira `"-R$ 1.500,00"`.',
          starter: `def formatar_reais(centavos):
    pass
`,
          tests: `assert formatar_reais(1234567) == "R$ 12.345,67", "Ponto de milhar e virgula decimal"
assert formatar_reais(5) == "R$ 0,05", "Centavos abaixo de 1 real"
assert formatar_reais(0) == "R$ 0,00", "Zero"
assert formatar_reais(-150000) == "-R$ 1.500,00", "Negativo com sinal antes do R$"
assert formatar_reais(-5) == "-R$ 0,05", "Negativo menor que 1 real"
assert formatar_reais(100000000) == "R$ 1.000.000,00", "Um milhao"
`,
          solution: `def formatar_reais(centavos):
    inteiro, resto = divmod(abs(centavos), 100)
    texto = f"{inteiro:,}".replace(",", ".")
    sinal = "-" if centavos < 0 else ""
    return f"{sinal}R$ {texto},{resto:02d}"
`,
          hint: 'divmod(abs(centavos), 100) separa reais e centavos; f"{inteiro:,}" põe vírgulas de milhar que você troca por ponto.',
          explain: 'Guardar centavos inteiros e formatar só na saída garante somas exatas e um único ponto onde o padrão brasileiro é aplicado.',
        },
        {
          type: 'mc',
          q: 'Por que o robô usa `INSERT OR REPLACE` ao gravar os lançamentos no SQLite?',
          options: ['Para ser mais rápido que INSERT', 'Para que reexecutar a mesma competência não duplique registros (idempotência)', 'Porque o SQLite não aceita INSERT simples', 'Para apagar lançamentos antigos'],
          answer: 1,
          explain: 'Automações falham no meio e precisam ser reexecutadas. Com a chave primária vinda da API, INSERT OR REPLACE sobrescreve o mesmo registro em vez de criar outro.',
        },
        {
          type: 'fill',
          q: 'Complete o comando SQL idempotente usado no repositório: `INSERT OR ___ INTO lancamentos VALUES (?, ?, ?, ?, ?)`',
          answer: ['REPLACE'],
          explain: 'INSERT OR REPLACE substitui a linha existente com a mesma chave primária, tornando a gravação segura para reexecução.',
        },
        {
          type: 'order',
          q: 'Ordene os passos de executar_fechamento, a camada de aplicação do robô.',
          items: ['brutos = buscar(competencia)', 'converter cada item com parsear_lancamento, registrando os rejeitados no log', 'repositorio.salvar(lancamentos)', 'totais = totalizar_por_conta(lancamentos)', 'gerar_planilha(caminho, totais)', 'enviar_email(assunto, montar_corpo_email(...), anexo)'],
          explain: 'Buscar, transformar (domínio), persistir, agregar, gerar o arquivo e comunicar. A aplicação só orquestra; cada passo é uma função separada.',
        },
        {
          type: 'tf',
          q: 'Passar `buscar`, `gerar_planilha` e `enviar_email` como parâmetros de executar_fechamento permite testar a camada de aplicação sem internet, substituindo-os por funções falsas.',
          answer: true,
          explain: 'Essa é a injeção de dependência na forma mais simples: o teste passa uma lambda que devolve uma lista fixa e outra que apenas registra o que seria enviado.',
        },
        {
          type: 'mc',
          q: 'Em qual camada deve ficar o cálculo do total por conta?',
          options: ['Em api.py, logo após baixar o JSON', 'Em planilha.py, ao montar a aba', 'Em dominio.py, como função pura', 'Em __main__.py, junto ao argparse'],
          answer: 2,
          explain: 'Regras de negócio ficam no domínio, independentes de rede, arquivo ou e-mail. Assim a mesma função serve para a planilha, o e-mail e os testes.',
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
        q: 'Qual parâmetro do requests evita que o script fique travado para sempre?',
        options: ['retries', 'timeout', 'wait', 'blocking=False'],
        answer: 1,
        explain: 'timeout define o tempo máximo de espera e lança requests.Timeout quando estoura.',
      },
      {
        type: 'tf',
        q: 'r.raise_for_status() lança exceção para respostas com status 4xx e 5xx.',
        answer: true,
        explain: 'É a forma mais limpa de transformar erros HTTP em exceções requests.HTTPError.',
      },
      {
        type: 'code',
        q: 'Escreva `cnpjs_ativos(texto_json)` que recebe uma string JSON com uma lista de empresas (dicts com `cnpj` e `situacao`) e devolve a lista de CNPJs cuja situação é `"ATIVA"`, na ordem original.',
        starter: `import json

def cnpjs_ativos(texto_json):
    pass
`,
        tests: `import json
texto = json.dumps([{"cnpj": "1", "situacao": "ATIVA"}, {"cnpj": "2", "situacao": "BAIXADA"}, {"cnpj": "3", "situacao": "ATIVA"}])
assert cnpjs_ativos(texto) == ["1", "3"], "Deve filtrar apenas as ATIVA"
assert cnpjs_ativos("[]") == [], "Lista vazia devolve lista vazia"
`,
        solution: `import json

def cnpjs_ativos(texto_json):
    empresas = json.loads(texto_json)
    return [e["cnpj"] for e in empresas if e.get("situacao") == "ATIVA"]
`,
        hint: 'json.loads e uma list comprehension com if.',
        explain: 'Consumir API é converter o texto JSON em estruturas Python e filtrá-las; .get evita KeyError se algum item vier sem situação.',
      },
      {
        type: 'mc',
        q: 'Qual trecho está vulnerável a SQL injection?',
        options: ['cur.execute("DELETE FROM x WHERE id = ?", (i,))', 'cur.execute(f"DELETE FROM x WHERE id = {i}")', 'cur.executemany("INSERT INTO x VALUES (?)", dados)', 'con.execute("SELECT 1")'],
        answer: 1,
        explain: 'Interpolar o valor na string permite que ele altere o comando SQL. Use sempre o marcador ?.',
      },
      {
        type: 'fill',
        q: 'Para um banco SQLite temporário, só na memória RAM: `sqlite3.connect("___")`',
        answer: [':memory:'],
        explain: 'A string especial ":memory:" cria um banco que existe só enquanto a conexão estiver aberta, ideal para testes.',
      },
      {
        type: 'code',
        q: 'Escreva `contar_por_regime(con)` que devolve um dict `{regime: quantidade}` a partir da tabela `clientes(id, nome, regime)` já existente na conexão, usando GROUP BY.',
        starter: `def contar_por_regime(con):
    pass
`,
        tests: `import sqlite3
con = sqlite3.connect(":memory:")
con.execute("CREATE TABLE clientes (id INTEGER PRIMARY KEY, nome TEXT, regime TEXT)")
con.executemany("INSERT INTO clientes (nome, regime) VALUES (?, ?)", [("A", "Simples"), ("B", "Simples"), ("C", "Real")])
assert contar_por_regime(con) == {"Simples": 2, "Real": 1}, "Deve contar clientes por regime"
`,
        solution: `def contar_por_regime(con):
    cur = con.execute("SELECT regime, COUNT(*) FROM clientes GROUP BY regime")
    return {regime: qtd for regime, qtd in cur.fetchall()}
`,
        hint: 'SELECT regime, COUNT(*) FROM clientes GROUP BY regime.',
        explain: 'GROUP BY com COUNT(*) é a forma de agregar no banco; o Python apenas transforma as linhas devolvidas em dict.',
      },
      {
        type: 'mc',
        q: 'No pandas, `df.merge(outro, on="cliente", how="left")` equivale a qual recurso da planilha?',
        options: ['Tabela dinâmica', 'PROCV', 'Filtro avançado', 'Classificar'],
        answer: 1,
        explain: 'merge com how="left" mantém todas as linhas da esquerda e traz as colunas correspondentes da direita, como o PROCV, com NaN onde não há correspondência.',
      },
      {
        type: 'tf',
        q: 'O openpyxl calcula o resultado de fórmulas como =SUM(B2:B9) ao salvar a planilha.',
        answer: false,
        explain: 'Ele grava apenas o texto da fórmula; o cálculo é feito pelo Excel ao abrir o arquivo.',
      },
      {
        type: 'mc',
        q: 'Para 300 chamadas HTTP a uma API, qual ferramenta é a mais indicada e por quê?',
        options: ['ProcessPoolExecutor, porque usa vários núcleos', 'ThreadPoolExecutor (ou asyncio), porque a tarefa é I/O-bound e threads liberam o GIL ao esperar', 'Um for simples, porque threads não funcionam com rede', 'multiprocessing.Pool com 300 processos'],
        answer: 1,
        explain: 'Esperar rede é I/O-bound: enquanto uma thread aguarda, outra trabalha. Processos seriam desperdício; 300 processos, um desastre.',
      },
      {
        type: 'fill',
        q: 'Dentro de uma coroutine, para pausar sem travar o loop de eventos: `await asyncio.___(1)`',
        answer: ['sleep'],
        explain: 'asyncio.sleep é assíncrono e devolve o controle ao loop; time.sleep bloquearia tudo.',
      },
      {
        type: 'mc',
        q: 'Em uma aplicação Flask bem organizada, onde fica a função que valida o payload recebido em um POST?',
        options: ['Dentro da função decorada com @app.route', 'Em um módulo de serviços, como função pura testável sem servidor', 'No template Jinja2', 'No arquivo .env'],
        answer: 1,
        explain: 'Rotas finas e lógica em funções puras permitem testar as regras com um simples assert, sem subir o servidor.',
      },
      {
        type: 'tf',
        q: 'No FastAPI, o uso de type hints e modelos Pydantic gera validação automática da entrada e documentação interativa em /docs.',
        answer: true,
        explain: 'Essa é a principal vantagem do FastAPI: tipos viram validação (422 em caso de erro) e documentação Swagger sem código extra.',
      },
      {
        type: 'order',
        q: 'Ordene os comandos para gravar e enviar uma mudança com Git.',
        items: ['git switch -c corrige-icms', 'git add config.py', 'git commit -m "Corrige alíquota do ICMS"', 'git push -u origin corrige-icms'],
        explain: 'Branch, preparar, commitar, enviar; depois vem o pull request no GitHub.',
      },
      {
        type: 'mc',
        q: 'Qual arquivo deve estar no .gitignore para evitar vazar senhas?',
        options: ['requirements.txt', 'README.md', '.env', 'pyproject.toml'],
        answer: 2,
        explain: 'O .env guarda variáveis de ambiente com credenciais e nunca deve ser versionado.',
      },
      {
        type: 'mc',
        q: 'No Robô de fechamento, por que a camada de aplicação recebe buscar, gerar_planilha e enviar_email como parâmetros?',
        options: ['Para economizar memória', 'Para permitir substituí-los por fakes nos testes e trocar a infraestrutura sem alterar a lógica', 'Porque o Python exige isso para funções com efeitos colaterais', 'Para que o argparse consiga ler as opções'],
        answer: 1,
        explain: 'Injeção de dependência: a aplicação orquestra sem conhecer rede, Excel ou SMTP; os testes passam lambdas e rodam em milissegundos, sem internet.',
      },
    ],
  },
});
