registerModule({
  course: 'python',
  id: 'py-03',
  order: 3,
  level: 'Intermediário',
  title: 'Organização, arquivos e objetos',
  description: 'Você vai organizar programas em módulos, ler e gravar arquivos de texto, CSV e JSON, tratar erros com exceções e modelar dados com classes, herança e dataclasses. No fim, constrói uma conciliação bancária completa que lê dois arquivos e aponta divergências.',
  hours: 10,
  lessons: [
    // ------------------------------------------------------------------
    {
      id: 'py-03-01',
      title: 'Módulos e pacotes',
      minutes: 31,
      content: 'content/python/py-03/01-modulos-e-pacotes.md',
      exercises: [
        { type: 'mc', q: 'Qual destas formas de importar é desaconselhada porque polui o namespace e esconde a origem dos nomes?', options: ['import math', 'from math import sqrt', 'from math import *', 'import statistics as st'], answer: 2, explain: 'O asterisco traz todos os nomes do módulo para o seu arquivo; se dois módulos tiverem funções com o mesmo nome, você não sabe qual está usando.' },
        { type: 'tf', q: 'A variável __name__ vale "__main__" quando o arquivo é importado por outro módulo.', answer: false, explain: 'Quando importado, __name__ recebe o nome do módulo (o nome do arquivo sem .py). Só vale "__main__" quando o arquivo é executado diretamente.' },
        { type: 'fill', q: 'Complete para dar o apelido st ao módulo: import statistics ___ st', answer: ['as'], explain: 'A palavra-chave as cria um apelido (alias) para o módulo importado.' },
        {
          type: 'code',
          q: 'Escreva a função `desvio(valores)` que devolve o desvio padrão amostral da lista, arredondado para 2 casas. Use o módulo statistics.',
          starter: `import statistics

def desvio(valores):
    pass
`,
          tests: `assert desvio([2, 4, 4, 4, 5, 5, 7, 9]) == 2.14, "O desvio de [2,4,4,4,5,5,7,9] deveria ser 2.14"
assert desvio([10, 10, 10]) == 0.0, "Valores iguais têm desvio zero"
assert desvio([100, 200]) == 70.71, "O desvio de [100, 200] deveria ser 70.71"
`,
          solution: `import statistics

def desvio(valores):
    return round(statistics.stdev(valores), 2)
`,
          hint: 'statistics.stdev calcula o desvio padrão amostral; depois arredonde com round(x, 2).',
          explain: 'statistics.stdev é o desvio padrão amostral pronto da biblioteca padrão; não é preciso implementar a fórmula.',
        },
        {
          type: 'code',
          q: 'Escreva a função `prazo(ano, mes, dia, dias)` que recebe uma data e um número de dias e devolve a data de vencimento no formato "dd/mm/aaaa". Use date e timedelta do módulo datetime.',
          starter: `from datetime import date, timedelta

def prazo(ano, mes, dia, dias):
    pass
`,
          tests: `assert prazo(2026, 3, 10, 30) == "09/04/2026", "10/03/2026 + 30 dias deveria ser 09/04/2026"
assert prazo(2026, 12, 25, 10) == "04/01/2027", "25/12/2026 + 10 dias deveria virar o ano: 04/01/2027"
assert prazo(2024, 2, 28, 1) == "29/02/2024", "2024 é bissexto: 28/02 + 1 dia é 29/02/2024"
`,
          solution: `from datetime import date, timedelta

def prazo(ano, mes, dia, dias):
    venc = date(ano, mes, dia) + timedelta(days=dias)
    return venc.strftime("%d/%m/%Y")
`,
          hint: 'Some um timedelta(days=dias) à date e formate com strftime("%d/%m/%Y").',
          explain: 'date + timedelta devolve outra date já com virada de mês e ano resolvida; strftime formata no padrão brasileiro.',
        },
        { type: 'mc', q: 'Você criou um arquivo chamado random.py na pasta do seu projeto. O que acontece ao escrever import random em outro script da mesma pasta?', options: ['O Python importa o módulo oficial, ignorando o seu', 'O Python importa o SEU arquivo, e funções como randint deixam de existir', 'O Python lança ImportError por conflito de nomes', 'O Python importa os dois e mescla os nomes'], answer: 1, explain: 'A pasta do script vem primeiro em sys.path, então o seu random.py faz sombra ao módulo da biblioteca padrão.' },
        { type: 'order', q: 'Ordene as linhas para formar um módulo com uma função e um bloco de teste protegido.', items: ['import math', 'def area(raio):', '    return math.pi * raio ** 2', 'if __name__ == "__main__":', '    print(area(2))'], explain: 'Imports no topo, depois a definição da função e, por fim, o bloco que só roda quando o arquivo é executado diretamente.' },
        { type: 'mc', q: 'Qual módulo da biblioteca padrão oferece mean, median e mode?', options: ['math', 'random', 'statistics', 'sys'], answer: 2, explain: 'statistics reúne as funções de estatística descritiva; math cuida de operações matemáticas gerais.' },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'py-03-02',
      title: 'Arquivos de texto',
      minutes: 34,
      content: 'content/python/py-03/02-arquivos-de-texto.md',
      exercises: [
        { type: 'mc', q: 'Qual modo de abertura APAGA o conteúdo do arquivo existente antes de escrever?', options: ['"r"', '"a"', '"w"', '"x"'], answer: 2, explain: 'O modo "w" trunca o arquivo ao abrir. Para acrescentar sem apagar, use "a".' },
        { type: 'tf', q: 'Ao usar with open(...) as f:, o arquivo é fechado automaticamente mesmo que ocorra uma exceção dentro do bloco.', answer: true, explain: 'O with é um gerenciador de contexto: a saída do bloco, normal ou por erro, chama close().' },
        { type: 'fill', q: 'Complete o modo para ACRESCENTAR linhas ao fim de um log sem apagar o que já existe: with open("log.txt", "___", encoding="utf-8") as f:', answer: ['a'], explain: 'O modo "a" (append) posiciona a escrita no fim do arquivo e o cria se não existir.' },
        {
          type: 'code',
          q: 'Escreva duas funções: `gravar_linhas(caminho, linhas)` grava cada string da lista em uma linha do arquivo (modo "w", utf-8); `contar_linhas(caminho)` devolve quantas linhas o arquivo tem. Use with.',
          starter: `def gravar_linhas(caminho, linhas):
    pass

def contar_linhas(caminho):
    pass
`,
          tests: `import tempfile, os
_p = os.path.join(tempfile.gettempdir(), "py03_l2_ex4.txt")
gravar_linhas(_p, ["Aluguel;3500", "Energia;820", "Internet;199"])
assert contar_linhas(_p) == 3, "Depois de gravar 3 linhas, contar_linhas deveria devolver 3"
gravar_linhas(_p, ["só uma"])
assert contar_linhas(_p) == 1, "Gravar de novo com modo w deve substituir o conteúdo (1 linha)"
with open(_p, encoding="utf-8") as _f:
    assert _f.read() == "só uma\\n", "Cada linha precisa terminar com quebra de linha"
`,
          solution: `def gravar_linhas(caminho, linhas):
    with open(caminho, "w", encoding="utf-8") as f:
        for linha in linhas:
            f.write(linha + "\\n")

def contar_linhas(caminho):
    with open(caminho, encoding="utf-8") as f:
        return sum(1 for _ in f)
`,
          hint: 'write() não adiciona quebra de linha: escreva linha + "\\n". Para contar, percorra o arquivo com for.',
          explain: 'O modo "w" substitui o conteúdo a cada gravação, e percorrer o arquivo com for conta as linhas sem carregar tudo na memória.',
        },
        {
          type: 'code',
          q: 'Escreva `somar_arquivo(caminho)` que lê um arquivo de texto onde cada linha tem o formato "descricao;valor" e devolve a soma dos valores arredondada para 2 casas. Ignore linhas vazias. Leia linha a linha com for.',
          starter: `def somar_arquivo(caminho):
    pass
`,
          tests: `import tempfile, os
_p = os.path.join(tempfile.gettempdir(), "py03_l2_ex5.txt")
with open(_p, "w", encoding="utf-8") as _f:
    _f.write("Aluguel;3500.00\\nEnergia;820.45\\n\\nInternet;199.90\\n")
assert somar_arquivo(_p) == 4520.35, "A soma deveria ser 4520.35 (ignorando a linha vazia)"
with open(_p, "w", encoding="utf-8") as _f:
    _f.write("Único;10\\n")
assert somar_arquivo(_p) == 10.0, "Um só valor: 10.0"
`,
          solution: `def somar_arquivo(caminho):
    total = 0.0
    with open(caminho, encoding="utf-8") as f:
        for linha in f:
            linha = linha.strip()
            if not linha:
                continue
            _, valor = linha.split(";")
            total += float(valor)
    return round(total, 2)
`,
          hint: 'strip() limpa a linha; if not linha: continue pula vazias; split(";") separa descrição e valor.',
          explain: 'Ler linha a linha, limpar, separar e converter é o padrão básico de processamento de arquivos de texto.',
        },
        { type: 'mc', q: 'Você lê um arquivo com for linha in f: e testa if linha == "FIM":, mas a condição nunca é verdadeira, embora exista uma linha FIM. Por quê?', options: ['O arquivo precisa ser aberto em modo binário', 'A linha lida vem com "\\n" no final; é preciso usar strip()', 'O for não funciona com arquivos de texto', 'A comparação de strings exige o operador is'], answer: 1, explain: 'Cada linha lida inclui a quebra de linha. "FIM\\n" é diferente de "FIM"; limpe com strip() ou rstrip("\\n").' },
        { type: 'mc', q: 'Com from pathlib import Path e p = Path("/tmp/fechamento/marco.csv"), qual atributo devolve ".csv"?', options: ['p.name', 'p.stem', 'p.suffix', 'p.parent'], answer: 2, explain: 'suffix é a extensão; name é "marco.csv"; stem é "marco"; parent é a pasta.' },
        { type: 'tf', q: 'Para um extrato com milhões de linhas, f.read() é a forma mais indicada de processar o conteúdo.', answer: false, explain: 'read() carrega tudo na memória. Percorrer com for linha in f: processa uma linha de cada vez.' },
        { type: 'order', q: 'Ordene os passos para somar os valores de um arquivo "descricao;valor" linha a linha.', items: ['Abrir o arquivo com with open(..., encoding="utf-8")', 'Percorrer com for linha in arquivo', 'Limpar a linha com strip()', 'Separar com split(";")', 'Converter o valor com float() e somar'], explain: 'Primeiro abre, depois itera, limpa, separa e só então converte e acumula.' },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'py-03-03',
      title: 'CSV e JSON',
      minutes: 33,
      content: 'content/python/py-03/03-csv-e-json.md',
      exercises: [
        { type: 'mc', q: 'O que csv.DictReader devolve a cada iteração?', options: ['Uma lista de strings', 'Um dicionário cujas chaves vêm do cabeçalho', 'Uma tupla com os valores convertidos', 'Uma string com a linha inteira'], answer: 1, explain: 'DictReader usa a primeira linha como nomes das colunas e entrega cada registro como dict.' },
        { type: 'fill', q: 'Complete para ler um CSV brasileiro separado por ponto e vírgula: csv.reader(f, ___=";")', answer: ['delimiter'], explain: 'O parâmetro delimiter define o separador de colunas; o padrão é a vírgula.' },
        { type: 'tf', q: 'json.dumps grava o conteúdo diretamente em um arquivo.', answer: false, explain: 'O s de dumps é de string: ele devolve uma str. Quem grava em arquivo é json.dump(obj, arquivo).' },
        {
          type: 'code',
          q: 'Escreva `total_por_conta(texto_csv)` que recebe o conteúdo de um CSV (separador ";", colunas data;conta;historico;valor) e devolve um dicionário {conta: total}, com totais arredondados para 2 casas. Use csv.DictReader com io.StringIO.',
          starter: `import csv, io

def total_por_conta(texto_csv):
    pass
`,
          tests: `_csv = "data;conta;historico;valor\\n2026-03-01;1.1.01;Venda A;15000.00\\n2026-03-02;3.1.02;Aluguel;-3500.00\\n2026-03-10;1.1.01;Venda B;7200.00\\n2026-03-15;3.1.05;Energia;-110.10\\n"
_r = total_por_conta(_csv)
assert _r == {"1.1.01": 22200.0, "3.1.02": -3500.0, "3.1.05": -110.1}, "Totais por conta incorretos"
assert total_por_conta("data;conta;historico;valor\\n") == {}, "CSV só com cabeçalho deve devolver dicionário vazio"
`,
          solution: `import csv, io

def total_por_conta(texto_csv):
    totais = {}
    for reg in csv.DictReader(io.StringIO(texto_csv), delimiter=";"):
        conta = reg["conta"]
        totais[conta] = totais.get(conta, 0.0) + float(reg["valor"])
    return {c: round(v, 2) for c, v in totais.items()}
`,
          hint: 'io.StringIO(texto) funciona como um arquivo; some com totais.get(conta, 0.0) + float(reg["valor"]).',
          explain: 'DictReader entrega cada linha como dict de strings; o acumulador por chave com get(conta, 0.0) totaliza sem precisar checar se a conta já existe.',
        },
        {
          type: 'code',
          q: 'Escreva `resumo_json(empresa, totais)` que devolve uma string JSON com as chaves "empresa" (string) e "totais" (dicionário recebido), mantendo acentos legíveis (ensure_ascii=False). Depois escreva `ler_resumo(texto)` que faz o caminho inverso e devolve o dicionário.',
          starter: `import json

def resumo_json(empresa, totais):
    pass

def ler_resumo(texto):
    pass
`,
          tests: `_t = resumo_json("Padaria Pão Quente", {"1.1.01": 100.5, "3.1.02": -20.0})
assert isinstance(_t, str), "resumo_json deve devolver uma string"
assert "Pão" in _t, "Use ensure_ascii=False para manter os acentos legíveis"
_d = ler_resumo(_t)
assert _d == {"empresa": "Padaria Pão Quente", "totais": {"1.1.01": 100.5, "3.1.02": -20.0}}, "ler_resumo deve reconstruir o dicionário original"
assert ler_resumo('{"empresa": "X", "totais": {}}') == {"empresa": "X", "totais": {}}, "ler_resumo deve usar json.loads"
`,
          solution: `import json

def resumo_json(empresa, totais):
    return json.dumps({"empresa": empresa, "totais": totais}, ensure_ascii=False)

def ler_resumo(texto):
    return json.loads(texto)
`,
          hint: 'Monte um dict e passe para json.dumps(..., ensure_ascii=False); para ler, json.loads(texto).',
          explain: 'dumps e loads trabalham com strings; ensure_ascii=False evita que acentos virem sequências \\u00e3.',
        },
        { type: 'mc', q: 'Ao chamar json.dumps({"vencimento": date(2026, 3, 10)}) aparece TypeError: Object of type date is not JSON serializable. Qual a solução correta?', options: ['Usar json.dump em vez de json.dumps', 'Adicionar ensure_ascii=False', 'Trocar o dicionário por uma lista', 'Converter a data para string antes, por exemplo com str() ou isoformat()'], answer: 3, explain: 'JSON não tem tipo data. Converta para texto (ou número) antes de serializar.' },
        { type: 'mc', q: 'Você lê um CSV com DictReader e faz reg["valor"] + 10. Aparece TypeError. Por quê?', options: ['Tudo o que o csv lê é string; é preciso converter com float()', 'DictReader não aceita somas', 'A chave "valor" não existe em dicionários', 'O arquivo precisa ser aberto com newline="\\n"'], answer: 0, explain: 'O módulo csv devolve strings. A conversão para número é responsabilidade do seu código.' },
        { type: 'fill', q: 'Complete para gravar o dicionário dados no arquivo aberto f: json.___(dados, f, ensure_ascii=False, indent=2)', answer: ['dump'], explain: 'json.dump (sem s) escreve em um arquivo; json.dumps devolve string.' },
        { type: 'tf', q: 'Em JSON, as chaves de um objeto podem ser números inteiros, assim como em um dict do Python.', answer: false, explain: 'Chaves JSON são sempre strings. Um dict {1: "jan"} vira {"1": "jan"} depois de dumps/loads.' },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'py-03-04',
      title: 'Exceções',
      minutes: 31,
      content: 'content/python/py-03/04-excecoes.md',
      exercises: [
        { type: 'mc', q: 'Qual bloco de um try é executado SEMPRE, com ou sem erro, mesmo que haja return no meio?', options: ['except', 'else', 'finally', 'raise'], answer: 2, explain: 'finally é destinado à limpeza garantida (fechar arquivos, conexões). else roda só quando não houve exceção.' },
        { type: 'tf', q: 'Usar except: pass é uma boa prática para evitar que o programa pare.', answer: false, explain: 'Isso engole todos os erros, inclusive bugs e Ctrl+C. Capture tipos específicos e faça algo útil (registrar, avisar, corrigir).' },
        {
          type: 'code',
          q: 'Escreva `para_float(texto)` que converte textos como "10.5" ou "1.234,56" em float. Tente float() direto; se der ValueError, remova pontos de milhar e troque a vírgula por ponto. Se ainda assim falhar, lance ValueError com a mensagem "valor inválido: " seguida do texto original.',
          starter: `def para_float(texto):
    pass
`,
          tests: `assert para_float("10.5") == 10.5, "Texto com ponto decimal deve converter direto"
assert para_float("1.234,56") == 1234.56, "Formato brasileiro deve virar 1234.56"
assert para_float("-820,45") == -820.45, "Negativo com vírgula deve virar -820.45"
try:
    para_float("abc")
    assert False, "Texto inválido deveria lançar ValueError"
except ValueError as e:
    assert "valor inválido: abc" in str(e), "A mensagem deve ser 'valor inválido: abc'"
`,
          solution: `def para_float(texto):
    try:
        return float(texto)
    except ValueError:
        pass
    try:
        return float(texto.replace(".", "").replace(",", "."))
    except ValueError:
        raise ValueError(f"valor inválido: {texto}")
`,
          hint: 'Dois try: o primeiro com float(texto); o segundo com o texto tratado. No último except, use raise ValueError(...).',
          explain: 'Tentar o caminho normal e tratar a exceção quando falha é o estilo EAFP; relançar com mensagem própria deixa claro qual texto deu problema.',
        },
        {
          type: 'code',
          q: 'Crie a exceção `SaldoInsuficienteError` (herdando de Exception) e a função `sacar(saldo, valor)` que devolve saldo - valor, mas lança SaldoInsuficienteError com a mensagem "saldo insuficiente" quando valor > saldo.',
          starter: `class SaldoInsuficienteError(Exception):
    pass

def sacar(saldo, valor):
    pass
`,
          tests: `assert issubclass(SaldoInsuficienteError, Exception), "A exceção deve herdar de Exception"
assert sacar(1000, 300) == 700, "sacar(1000, 300) deveria devolver 700"
assert sacar(500, 500) == 0, "Sacar o saldo inteiro é permitido"
try:
    sacar(100, 150)
    assert False, "Saque maior que o saldo deveria lançar SaldoInsuficienteError"
except SaldoInsuficienteError as e:
    assert "saldo insuficiente" in str(e).lower(), "A mensagem deve conter 'saldo insuficiente'"
`,
          solution: `class SaldoInsuficienteError(Exception):
    pass

def sacar(saldo, valor):
    if valor > saldo:
        raise SaldoInsuficienteError("saldo insuficiente")
    return saldo - valor
`,
          hint: 'Dentro de sacar, verifique if valor > saldo: raise SaldoInsuficienteError("saldo insuficiente").',
          explain: 'Uma exceção própria herda de Exception e recebe a mensagem no construtor; lançá-la impede que um saque inválido passe despercebido.',
        },
        { type: 'fill', q: 'Complete para guardar o objeto da exceção na variável e: except ValueError ___ e:', answer: ['as'], explain: 'except Tipo as nome dá acesso ao objeto da exceção, cuja str() é a mensagem.' },
        { type: 'mc', q: 'O que float(None) lança?', options: ['ValueError', 'NoneError', 'TypeError', 'Nada: devolve 0.0'], answer: 2, explain: 'None não é um tipo conversível em float: o erro é de TIPO. ValueError acontece com strings de conteúdo inválido, como float("abc").' },
        { type: 'order', q: 'Ordene as cláusulas na sequência exigida pelo Python.', items: ['try:', 'except ValueError:', 'else:', 'finally:'], explain: 'A ordem obrigatória é try, except (um ou mais), else e finally.' },
        { type: 'mc', q: 'Dentro de um bloco except, o que faz um raise sem argumentos?', options: ['Encerra o programa imediatamente', 'Lança um Exception genérico', 'Volta ao início do try', 'Relança a mesma exceção que estava sendo tratada'], answer: 3, explain: 'raise sozinho propaga a exceção atual, útil para registrar o erro e deixá-lo subir.' },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'py-03-05',
      title: 'Classes e objetos',
      minutes: 31,
      content: 'content/python/py-03/05-classes.md',
      exercises: [
        { type: 'fill', q: 'Complete o primeiro parâmetro do construtor: def __init__(___, nome, valor):', answer: ['self'], explain: 'self é o próprio objeto; o Python o passa automaticamente em todo método de instância.' },
        { type: 'mc', q: 'Qual é o efeito de nf = NotaFiscal (sem parênteses)?', options: ['Cria uma instância com valores padrão', 'Guarda a própria classe na variável, sem criar objeto', 'Lança SyntaxError', 'Cria uma instância vazia'], answer: 1, explain: 'Sem parênteses não há chamada ao construtor. nf passa a ser a classe; nf.valor dá AttributeError.' },
        {
          type: 'code',
          q: 'Escreva a classe `Conta` com __init__(self, codigo, nome), que cria uma lista vazia de lançamentos; o método `lancar(self, valor)` adiciona o valor à lista; `saldo(self)` devolve a soma arredondada para 2 casas.',
          starter: `class Conta:
    def __init__(self, codigo, nome):
        pass

    def lancar(self, valor):
        pass

    def saldo(self):
        pass
`,
          tests: `c = Conta("1.1.01", "Caixa")
assert c.codigo == "1.1.01" and c.nome == "Caixa", "Guarde codigo e nome como atributos"
assert c.saldo() == 0.0, "Conta nova deve ter saldo 0.0"
c.lancar(5000)
c.lancar(-1200.50)
assert c.saldo() == 3799.5, "Saldo após 5000 e -1200.50 deveria ser 3799.5"
c2 = Conta("1.1.02", "Banco")
assert c2.saldo() == 0.0, "Cada conta deve ter sua própria lista de lançamentos"
`,
          solution: `class Conta:
    def __init__(self, codigo, nome):
        self.codigo = codigo
        self.nome = nome
        self.lancamentos = []

    def lancar(self, valor):
        self.lancamentos.append(valor)

    def saldo(self):
        return round(sum(self.lancamentos), 2)
`,
          hint: 'A lista deve ser criada DENTRO do __init__ com self.lancamentos = [], para que cada conta tenha a sua.',
          explain: 'Atributos de instância nascem no __init__; a lista criada ali pertence só àquela conta, e os métodos operam sobre self.',
        },
        {
          type: 'code',
          q: 'Escreva a classe `Produto` com atributos nome e preco. Defina __str__ devolvendo "Nome - R$ 10.50" (preço com 2 casas) e __repr__ devolvendo "Produto(\'Nome\', 10.5)".',
          starter: `class Produto:
    def __init__(self, nome, preco):
        self.nome = nome
        self.preco = preco
`,
          tests: `p = Produto("Caneta", 10.5)
assert str(p) == "Caneta - R$ 10.50", "str(p) deveria ser 'Caneta - R$ 10.50'"
assert repr(p) == "Produto('Caneta', 10.5)", "repr(p) deveria ser Produto('Caneta', 10.5)"
assert str(Produto("Papel", 3)) == "Papel - R$ 3.00", "O preço deve ter sempre 2 casas"
`,
          solution: `class Produto:
    def __init__(self, nome, preco):
        self.nome = nome
        self.preco = preco

    def __str__(self):
        return f"{self.nome} - R$ {self.preco:.2f}"

    def __repr__(self):
        return f"Produto({self.nome!r}, {self.preco!r})"
`,
          hint: 'Use f-strings: {self.preco:.2f} para duas casas e {self.nome!r} para colocar as aspas no repr.',
          explain: '__str__ é o texto amigável usado por print; __repr__ mostra como recriar o objeto e é usado em listas e no depurador.',
        },
        { type: 'tf', q: 'Uma lista definida diretamente no corpo da classe (fora do __init__) é compartilhada por todas as instâncias.', answer: true, explain: 'Atributos de classe são criados uma vez só. Listas e dicionários por instância devem nascer no __init__ com self.' },
        { type: 'mc', q: 'Qual método especial o print(objeto) usa para obter o texto a exibir?', options: ['__init__', '__str__', '__print__', '__len__'], answer: 1, explain: 'print chama str(objeto), que usa __str__; se ele não existir, usa __repr__.' },
        { type: 'mc', q: 'Ao chamar nf.iss() aparece TypeError: iss() takes 0 positional arguments but 1 was given. Qual a causa mais provável?', options: ['O método foi definido sem o parâmetro self', 'Faltou passar a alíquota', 'A classe não tem __init__', 'O objeto não foi instanciado'], answer: 0, explain: 'O Python passa o objeto como primeiro argumento; sem self na definição, não há onde recebê-lo.' },
        { type: 'order', q: 'Ordene as linhas para definir e usar uma classe simples.', items: ['class Funcionario:', '    def __init__(self, nome):', '        self.nome = nome', 'f = Funcionario("Ana")', 'print(f.nome)'], explain: 'Primeiro a classe com o construtor, depois a instanciação e, por fim, o uso do atributo.' },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'py-03-06',
      title: 'Herança e polimorfismo',
      minutes: 32,
      content: 'content/python/py-03/06-heranca-e-polimorfismo.md',
      exercises: [
        { type: 'fill', q: 'Complete para que CLT herde de Colaborador: class CLT(___):', answer: ['Colaborador'], explain: 'A classe-mãe vai entre parênteses na definição da filha.' },
        { type: 'mc', q: 'Para que serve super() dentro de um método sobrescrito?', options: ['Criar uma nova instância da classe-mãe', 'Chamar a versão do método definida na classe-mãe', 'Apagar o método herdado', 'Transformar o método em atributo de classe'], answer: 1, explain: 'super() dá acesso à implementação da classe-mãe, permitindo estender em vez de reescrever.' },
        {
          type: 'code',
          q: 'A classe `Colaborador` já está pronta. Crie `CLT(Colaborador)` sobrescrevendo encargos() para devolver 28% do valor_mensal (arredondado a 2 casas) e `Estagiario(Colaborador)` cujo __init__ recebe também instituicao, chamando super().__init__ para os campos comuns.',
          starter: `class Colaborador:
    def __init__(self, nome, valor_mensal):
        self.nome = nome
        self.valor_mensal = valor_mensal

    def encargos(self):
        return 0.0

    def custo_total(self):
        return round(self.valor_mensal + self.encargos(), 2)

# escreva CLT e Estagiario abaixo
`,
          tests: `a = CLT("Ana", 3000)
assert a.encargos() == 840.0, "Encargos CLT de 3000 deveriam ser 840.0"
assert a.custo_total() == 3840.0, "Custo total CLT deveria ser 3840.0"
e = Estagiario("Bia", 1200, "UFS")
assert e.nome == "Bia" and e.valor_mensal == 1200, "Estagiario deve chamar super().__init__ para nome e valor_mensal"
assert e.instituicao == "UFS", "Estagiario deve guardar a instituicao"
assert e.custo_total() == 1200.0, "Estagiário não tem encargos: custo igual ao valor mensal"
assert isinstance(a, Colaborador) and isinstance(e, Colaborador), "Ambas devem herdar de Colaborador"
`,
          solution: `class Colaborador:
    def __init__(self, nome, valor_mensal):
        self.nome = nome
        self.valor_mensal = valor_mensal

    def encargos(self):
        return 0.0

    def custo_total(self):
        return round(self.valor_mensal + self.encargos(), 2)

class CLT(Colaborador):
    def encargos(self):
        return round(self.valor_mensal * 0.28, 2)

class Estagiario(Colaborador):
    def __init__(self, nome, valor_mensal, instituicao):
        super().__init__(nome, valor_mensal)
        self.instituicao = instituicao
`,
          hint: 'Em Estagiario.__init__, chame super().__init__(nome, valor_mensal) e depois guarde self.instituicao.',
          explain: 'CLT sobrescreve só o que muda (encargos) e herda o resto; Estagiario estende o construtor com super() para não repetir a inicialização comum.',
        },
        {
          type: 'code',
          q: 'Escreva a classe `Dinheiro` que guarda centavos (inteiro) e implementa __eq__ (igualdade por centavos), __lt__ (menor que) e __add__ (soma devolvendo um novo Dinheiro).',
          starter: `class Dinheiro:
    def __init__(self, centavos):
        self.centavos = int(centavos)
`,
          tests: `a = Dinheiro(1010)
b = Dinheiro(2020)
assert a == Dinheiro(1010), "Dois Dinheiro com os mesmos centavos devem ser iguais"
assert not (a == b), "Centavos diferentes não são iguais"
assert a < b, "1010 centavos é menor que 2020"
assert not (b < a), "2020 não é menor que 1010"
s = a + b
assert isinstance(s, Dinheiro) and s.centavos == 3030, "A soma deve devolver um Dinheiro com 3030 centavos"
assert sorted([b, a])[0].centavos == 1010, "Com __lt__, sorted deve ordenar pelos centavos"
`,
          solution: `class Dinheiro:
    def __init__(self, centavos):
        self.centavos = int(centavos)

    def __eq__(self, outro):
        return isinstance(outro, Dinheiro) and self.centavos == outro.centavos

    def __lt__(self, outro):
        return self.centavos < outro.centavos

    def __add__(self, outro):
        return Dinheiro(self.centavos + outro.centavos)
`,
          hint: 'Cada dunder recebe (self, outro). __add__ deve devolver Dinheiro(self.centavos + outro.centavos).',
          explain: 'Os dunders conectam a classe aos operadores: == chama __eq__, < chama __lt__ (e habilita sorted), + chama __add__.',
        },
        { type: 'tf', q: 'Se CLT herda de Colaborador, isinstance(CLT("Ana", 3000), Colaborador) devolve True.', answer: true, explain: 'isinstance respeita a herança: uma instância da filha também é instância da mãe.' },
        { type: 'mc', q: 'Uma Empresa TEM uma lista de colaboradores. Qual técnica modela melhor essa relação?', options: ['Herança: class Empresa(list)', 'Herança múltipla de list e dict', 'Composição: um atributo self.colaboradores = []', 'Um atributo de classe compartilhado'], answer: 2, explain: 'Relação "tem um" pede composição. Herança é para "é um" (CLT é um Colaborador).' },
        { type: 'mc', q: 'Qual método dunder faz len(meu_objeto) funcionar?', options: ['__size__', '__count__', '__len__', '__length__'], answer: 2, explain: 'A função len() chama __len__ do objeto, que deve devolver um inteiro.' },
        { type: 'mc', q: 'Você definiu __eq__ na sua classe e, de repente, não consegue mais colocar os objetos em um set. O que aconteceu?', options: ['set só aceita tipos embutidos', 'É preciso definir __lt__ para usar set', 'Faltou o decorador @dataclass', 'Definir __eq__ sem __hash__ torna a classe não hashable'], answer: 3, explain: 'Quando você define __eq__, o Python remove o __hash__ padrão. Defina __hash__ (por exemplo, hash(self.centavos)) para voltar a usar em set e como chave de dict.' },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'py-03-07',
      title: 'dataclasses e propriedades',
      minutes: 30,
      content: 'content/python/py-03/07-dataclasses-e-propriedades.md',
      exercises: [
        { type: 'fill', q: 'Complete a importação necessária para usar default_factory: from dataclasses import dataclass, ___', answer: ['field'], explain: 'field() configura cada campo: default_factory, repr, compare, init.' },
        { type: 'mc', q: 'O que acontece ao definir itens: list = [] dentro de uma @dataclass?', options: ['O Python lança ValueError: mutable default', 'Cada instância recebe uma lista nova', 'A lista vira atributo privado', 'Funciona normalmente, como em classe comum'], answer: 0, explain: 'A dataclass proíbe padrões mutáveis para evitar listas compartilhadas. Use field(default_factory=list).' },
        {
          type: 'code',
          q: 'Crie a dataclass `Item` com os campos descricao (str), quantidade (int) e preco (float), e uma @property `total` que devolve quantidade * preco arredondado para 2 casas.',
          starter: `from dataclasses import dataclass

# escreva a dataclass Item aqui
`,
          tests: `import dataclasses
assert dataclasses.is_dataclass(Item), "Item deve ser uma dataclass"
i = Item("Pão (kg)", 10, 18.9)
assert i.total == 189.0, "total deveria ser 189.0 (sem parênteses: é uma property)"
assert i == Item("Pão (kg)", 10, 18.9), "A dataclass deve gerar __eq__ campo a campo"
assert repr(i).startswith("Item("), "A dataclass deve gerar __repr__ automaticamente"
assert Item("x", 3, 0.1).total == 0.3, "total deve ser arredondado a 2 casas"
`,
          solution: `from dataclasses import dataclass

@dataclass
class Item:
    descricao: str
    quantidade: int
    preco: float

    @property
    def total(self):
        return round(self.quantidade * self.preco, 2)
`,
          hint: 'Declare os campos com anotação de tipo (nome: tipo) e use @property acima de def total(self).',
          explain: 'A dataclass gera __init__, __repr__ e __eq__ a partir dos campos anotados; a property calcula o total sempre atualizado, sem parênteses.',
        },
        {
          type: 'code',
          q: 'Escreva a classe `Funcionario` com nome e salario, onde salario é uma @property com setter que lança ValueError se o valor for menor que 1518. O dado deve ficar em self._salario e a validação deve valer também no __init__.',
          starter: `class Funcionario:
    def __init__(self, nome, salario):
        self.nome = nome
        self.salario = salario   # deve passar pelo setter
`,
          tests: `f = Funcionario("Ana", 3000)
assert f.salario == 3000, "O getter deve devolver o salário"
f.salario = 3500
assert f.salario == 3500 and f._salario == 3500, "O setter deve guardar em self._salario"
try:
    f.salario = 500
    assert False, "Salário abaixo de 1518 deveria lançar ValueError"
except ValueError:
    pass
try:
    Funcionario("Bia", 100)
    assert False, "A validação também deve valer no __init__"
except ValueError:
    pass
`,
          solution: `class Funcionario:
    def __init__(self, nome, salario):
        self.nome = nome
        self.salario = salario

    @property
    def salario(self):
        return self._salario

    @salario.setter
    def salario(self, valor):
        if valor < 1518:
            raise ValueError(f"Salário abaixo do mínimo: {valor}")
        self._salario = valor
`,
          hint: 'Defina @property def salario(self) e @salario.setter def salario(self, valor). Dentro do setter, grave em self._salario (com underscore).',
          explain: 'Como o __init__ faz self.salario = salario, a atribuição passa pelo setter e a validação vale desde a criação do objeto.',
        },
        { type: 'tf', q: 'Uma dataclass com frozen=True permite alterar os campos depois de criada.', answer: false, explain: 'frozen=True torna a instância imutável: atribuir a um campo lança FrozenInstanceError.' },
        { type: 'mc', q: 'Para que serve o método __post_init__ em uma dataclass?', options: ['Substituir o __init__ gerado', 'Validar dados e calcular campos derivados logo após a inicialização', 'Converter a dataclass em dicionário', 'Definir o __repr__'], answer: 1, explain: '__post_init__ roda após o __init__ automático, sendo o lugar certo para checagens e campos calculados.' },
        { type: 'mc', q: 'Você definiu @property def fgts(self) e chamou f.fgts(). O que acontece?', options: ['Devolve o valor normalmente', 'AttributeError', 'TypeError: o resultado (float) não é chamável', 'Devolve None'], answer: 2, explain: 'f.fgts já devolve o float calculado; os parênteses tentam chamar esse número como função.' },
        { type: 'fill', q: 'Complete para tornar a dataclass imutável e hashable: @dataclass(___=True)', answer: ['frozen'], explain: 'frozen=True impede atribuições e gera __hash__, permitindo usar em set e como chave de dict.' },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'py-03-08',
      title: 'Iteradores, geradores e decorators',
      minutes: 35,
      content: 'content/python/py-03/08-iteradores-geradores-e-decorators.md',
      exercises: [
        { type: 'mc', q: 'O que acontece ao chamar next() em um iterador já esgotado?', options: ['Devolve None', 'Volta ao primeiro elemento', 'Lança StopIteration', 'Lança IndexError'], answer: 2, explain: 'StopIteration sinaliza o fim; o for a captura silenciosamente e encerra o laço.' },
        { type: 'tf', q: 'Chamar uma função geradora (que contém yield) executa o corpo dela imediatamente.', answer: false, explain: 'A chamada apenas devolve um objeto gerador; o corpo só roda quando alguém pede valores com next() ou for.' },
        {
          type: 'code',
          q: 'Escreva a função geradora `pares_ate(n)` que produz, com yield, os números pares de 0 até n (inclusive).',
          starter: `def pares_ate(n):
    pass
`,
          tests: `import inspect
assert inspect.isgeneratorfunction(pares_ate), "pares_ate deve usar yield (função geradora)"
assert list(pares_ate(10)) == [0, 2, 4, 6, 8, 10], "pares_ate(10) deveria produzir 0,2,4,6,8,10"
assert list(pares_ate(5)) == [0, 2, 4], "pares_ate(5) deveria produzir 0,2,4"
g = pares_ate(4)
assert next(g) == 0 and next(g) == 2, "O gerador deve entregar um valor por vez com next()"
`,
          solution: `def pares_ate(n):
    for i in range(0, n + 1, 2):
        yield i
`,
          hint: 'for i in range(0, n + 1, 2): yield i',
          explain: 'Uma função com yield vira gerador: cada next() executa até o próximo yield e congela, entregando um valor por vez.',
        },
        {
          type: 'code',
          q: 'Escreva `somar_tudo(*valores)` que devolve a soma de qualquer quantidade de números (arredondada a 2 casas) e `montar(conta, **extras)` que devolve um dict com a chave "conta" mais todos os argumentos nomeados recebidos.',
          starter: `def somar_tudo(*valores):
    pass

def montar(conta, **extras):
    pass
`,
          tests: `assert somar_tudo(1.5, 2.5) == 4.0, "somar_tudo(1.5, 2.5) deveria ser 4.0"
assert somar_tudo(10, 20, 30, 40) == 100, "somar_tudo com 4 valores deveria ser 100"
assert somar_tudo() == 0, "Sem argumentos, a soma é 0"
assert montar("1.1.01", valor=500, historico="Venda") == {"conta": "1.1.01", "valor": 500, "historico": "Venda"}, "montar deve juntar conta e os extras"
assert montar("2.1.01") == {"conta": "2.1.01"}, "Sem extras, só a conta"
`,
          solution: `def somar_tudo(*valores):
    return round(sum(valores), 2)

def montar(conta, **extras):
    reg = {"conta": conta}
    reg.update(extras)
    return reg
`,
          hint: '*valores é uma tupla: use sum(valores). **extras é um dict: use reg.update(extras).',
          explain: '*args empacota os posicionais extras em tupla e **kwargs empacota os nomeados em dicionário, permitindo assinaturas flexíveis.',
        },
        {
          type: 'code',
          q: 'Escreva o decorator `cronometrar(func)` que mede o tempo da função com time.perf_counter, imprime "NOME levou X s" (onde NOME é func.__name__) e devolve o resultado da função. Use functools.wraps e aceite qualquer assinatura (*args, **kwargs).',
          starter: `import time
import functools

def cronometrar(func):
    pass

@cronometrar
def quadrado(x):
    return x * x

print(quadrado(3))
`,
          tests: `assert quadrado(3) == 9, "O decorator deve devolver o resultado da função original"
assert quadrado.__name__ == "quadrado", "Use functools.wraps para preservar o nome da função"
assert "quadrado levou" in saida, "O decorator deve imprimir 'quadrado levou ...'"
@cronometrar
def soma(a, b=0):
    return a + b
assert soma(2, b=3) == 5, "O decorator deve repassar *args e **kwargs"
`,
          solution: `import time
import functools

def cronometrar(func):
    @functools.wraps(func)
    def embrulho(*args, **kwargs):
        inicio = time.perf_counter()
        resultado = func(*args, **kwargs)
        duracao = time.perf_counter() - inicio
        print(f"{func.__name__} levou {duracao:.6f} s")
        return resultado
    return embrulho

@cronometrar
def quadrado(x):
    return x * x

print(quadrado(3))
`,
          hint: 'Dentro de cronometrar, defina embrulho(*args, **kwargs) decorado com @functools.wraps(func), chame func, imprima e devolva o resultado; por fim, return embrulho.',
          explain: 'O decorator recebe a função, devolve um embrulho que a chama medindo o tempo; functools.wraps preserva o nome original e *args/**kwargs aceitam qualquer assinatura.',
        },
        { type: 'fill', q: 'Complete para ordenar as notas pelo valor (segunda posição da tupla): sorted(notas, key=___ n: n[1])', answer: ['lambda'], explain: 'lambda cria uma função anônima de uma expressão, ideal para o parâmetro key.' },
        { type: 'mc', q: 'Qual a principal diferença entre (v * v for v in valores) e [v * v for v in valores]?', options: ['Nenhuma: são sinônimos', 'A primeira é mais lenta e usa mais memória', 'A segunda só funciona com números', 'A primeira não cria a lista na memória; produz os valores sob demanda'], answer: 3, explain: 'Parênteses criam uma expressão geradora, preguiçosa; colchetes constroem a lista inteira de uma vez.' },
        { type: 'mc', q: 'Em def f(*args, **kwargs):, que tipo de objeto é args dentro da função?', options: ['list', 'tuple', 'dict', 'set'], answer: 1, explain: 'Os argumentos posicionais extras chegam como tupla; os nomeados (kwargs) chegam como dicionário.' },
        { type: 'order', q: 'Ordene as linhas de um decorator que registra a chamada de uma função.', items: ['def registrar(func):', '    def embrulho(*args, **kwargs):', '        print("Chamando", func.__name__)', '        return func(*args, **kwargs)', '    return embrulho'], explain: 'O decorator define a função interna, que chama a original e devolve o resultado; por fim devolve a função interna.' },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'py-03-09',
      title: 'Projeto guiado: conciliação bancária',
      minutes: 32,
      content: 'content/python/py-03/09-projeto-conciliacao-bancaria.md',
      exercises: [
        {
          type: 'code',
          q: 'Escreva `converter_valor(texto)` que aceita "1.500,00" (formato brasileiro), "-820.45" (formato americano) e "R$ 2.000,50", devolvendo float. Se houver vírgula, remova os pontos de milhar e troque a vírgula por ponto. Para texto inválido, lance ValueError.',
          starter: `def converter_valor(texto):
    pass
`,
          tests: `assert converter_valor("1.500,00") == 1500.0, "1.500,00 deveria virar 1500.0"
assert converter_valor("-820.45") == -820.45, "-820.45 deveria continuar -820.45"
assert converter_valor("R$ 2.000,50") == 2000.5, "Deve remover o prefixo R$ e espaços"
assert converter_valor(" 99 ") == 99.0, "Deve ignorar espaços nas pontas"
try:
    converter_valor("abc")
    assert False, "Texto inválido deveria lançar ValueError"
except ValueError:
    pass
`,
          solution: `def converter_valor(texto):
    limpo = texto.strip().replace("R$", "").replace(" ", "")
    if "," in limpo:
        limpo = limpo.replace(".", "").replace(",", ".")
    return float(limpo)
`,
          hint: 'Limpe o texto, verifique se tem vírgula e só então remova pontos e troque a vírgula. float() já lança ValueError para texto inválido.',
          explain: 'A presença da vírgula identifica o formato brasileiro; nele o ponto é separador de milhar e deve ser removido antes da conversão.',
        },
        {
          type: 'code',
          q: 'Escreva `conciliar(banco, contabil)` que recebe duas listas de tuplas (data, valor) e devolve uma tupla (so_banco, so_contabil) com os movimentos que não têm par na outra lista. A chave de casamento é (data, round(valor * 100)). Se houver dois movimentos iguais de um lado e um do outro, apenas um casa.',
          starter: `def conciliar(banco, contabil):
    pass
`,
          tests: `b = [("2026-03-02", 1500.0), ("2026-03-03", -45.9), ("2026-03-10", 800.0)]
c = [("2026-03-02", 1500.0), ("2026-03-10", 850.0), ("2026-03-12", -310.0)]
sb, sc = conciliar(b, c)
assert sorted(sb) == [("2026-03-03", -45.9), ("2026-03-10", 800.0)], "Só no banco: tarifa e TED de 800"
assert sorted(sc) == [("2026-03-10", 850.0), ("2026-03-12", -310.0)], "Só na contabilidade: 850 e energia"
sb2, sc2 = conciliar([("2026-03-01", 100.0), ("2026-03-01", 100.0)], [("2026-03-01", 100.0)])
assert sb2 == [("2026-03-01", 100.0)] and sc2 == [], "Dois iguais no banco e um na contabilidade: sobra um no banco"
assert conciliar([], []) == ([], []), "Listas vazias devolvem ([], [])"
`,
          solution: `def conciliar(banco, contabil):
    def chave(m):
        return (m[0], round(m[1] * 100))
    gb, gc = {}, {}
    for m in banco:
        gb.setdefault(chave(m), []).append(m)
    for m in contabil:
        gc.setdefault(chave(m), []).append(m)
    so_banco, so_contabil = [], []
    for k in set(gb) | set(gc):
        lb = gb.get(k, [])
        lc = gc.get(k, [])
        n = min(len(lb), len(lc))
        so_banco.extend(lb[n:])
        so_contabil.extend(lc[n:])
    return so_banco, so_contabil
`,
          hint: 'Agrupe cada lado em um dict chave -> lista. Para cada chave da união, case min(len) pares e o restante vai para as divergências.',
          explain: 'Agrupar por chave em listas permite tratar movimentos repetidos; a união das chaves garante que nenhum lado seja esquecido.',
        },
        { type: 'mc', q: 'Por que o projeto usa round(valor * 100) (centavos inteiros) na chave de casamento em vez do float direto?', options: ['Porque floats podem ter diferenças minúsculas (0.1 + 0.2 != 0.3) e não casar', 'Porque inteiros ocupam menos memória', 'Porque dicionários não aceitam float como chave', 'Porque o CSV sempre vem em centavos'], answer: 0, explain: 'Comparar floats por igualdade é frágil; converter para centavos inteiros torna a comparação exata.' },
        { type: 'tf', q: 'Ao encontrar uma linha com data inválida no CSV, o programa de conciliação deve parar imediatamente para não produzir relatório.', answer: false, explain: 'A estratégia do projeto é registrar a linha problemática na lista de problemas e continuar; o relatório final mostra o que foi ignorado.' },
        { type: 'mc', q: 'No código for chave in set(g_banco) | set(g_contabil):, o que o operador | faz?', options: ['Interseção: só chaves presentes nos dois lados', 'União: chaves presentes em qualquer um dos lados', 'Diferença: chaves só do banco', 'Ou lógico entre dois booleanos'], answer: 1, explain: 'Entre conjuntos, | é a união. Assim percorremos todas as chaves, inclusive as que só existem de um lado.' },
        { type: 'fill', q: 'Complete para ler o CSV em memória como dicionários: csv.___(io.StringIO(texto), delimiter=";")', answer: ['DictReader'], explain: 'DictReader usa o cabeçalho como chaves, o que permite acessar reg["data"] e reg["valor"] pelo nome.' },
        { type: 'order', q: 'Ordene as etapas do projeto de conciliação.', items: ['Ler os dois CSVs com DictReader', 'Converter data e valor, registrando linhas com erro', 'Agrupar os movimentos por chave (data, centavos)', 'Comparar as chaves e separar o que sobra de cada lado', 'Gerar o relatório de divergências'], explain: 'Leitura, conversão, agrupamento, comparação e relatório: cada etapa depende da anterior.' },
        { type: 'mc', q: 'Um movimento aparece apenas no extrato bancário e não na contabilidade. O que isso indica mais provavelmente?', options: ['Erro no banco', 'Um cheque não compensado', 'Um lançamento que ainda precisa ser contabilizado (ex.: tarifa)', 'Nada: deve ser ignorado'], answer: 2, explain: 'O banco registrou algo que a contabilidade não tem: tipicamente tarifas, juros ou recebimentos não lançados. O cheque não compensado é o caso oposto (só na contabilidade).' },
      ],
    },
  ],
  // ====================================================================
  exam: {
    passScore: 70,
    questions: [
      { type: 'mc', q: 'Qual afirmação sobre if __name__ == "__main__": é correta?', options: ['O bloco roda sempre que o módulo é importado', 'O bloco roda apenas quando o arquivo é executado diretamente', 'É obrigatório em todo arquivo Python', 'Define a função principal do programa'], answer: 1, explain: 'Quando importado, __name__ é o nome do módulo; só vale "__main__" na execução direta.' },
      { type: 'fill', q: 'Complete para importar apenas a função sqrt: ___ math import sqrt', answer: ['from'], explain: 'from modulo import nome traz apenas o nome indicado para o namespace atual.' },
      { type: 'mc', q: 'Qual combinação abre um arquivo para acrescentar texto ao final, com acentuação correta?', options: ['open(c, "w")', 'open(c, "a", encoding="utf-8")', 'open(c, "r", encoding="utf-8")', 'open(c, "x")'], answer: 1, explain: '"a" acrescenta sem apagar; encoding="utf-8" garante os acentos.' },
      { type: 'tf', q: 'with open(...) as f: dispensa a chamada explícita a f.close().', answer: true, explain: 'O gerenciador de contexto fecha o arquivo ao sair do bloco.' },
      { type: 'mc', q: 'Qual função transforma uma string JSON em objeto Python?', options: ['json.dump', 'json.dumps', 'json.load', 'json.loads'], answer: 3, explain: 'loads lê de string (s de string); load lê de arquivo.' },
      { type: 'mc', q: 'Ao ler um CSV brasileiro com csv.reader(f) sem outros parâmetros, cada linha vem como uma lista de um único elemento. Qual o motivo?', options: ['O arquivo está em latin-1', 'Faltou delimiter=";"', 'Faltou newline=""', 'O csv.reader só funciona com DictReader'], answer: 1, explain: 'O delimitador padrão é a vírgula; com ponto e vírgula, a linha inteira vira uma única coluna.' },
      { type: 'mc', q: 'Qual trecho trata corretamente a ausência de um arquivo sem esconder outros erros?', options: ['try: ... except: pass', 'try: ... except Exception: pass', 'try: ... except FileNotFoundError: print("arquivo ausente")', 'try: ... finally: pass'], answer: 2, explain: 'Capturar o tipo específico e reagir de forma útil é a boa prática; except genérico com pass engole tudo.' },
      { type: 'fill', q: 'Complete para lançar um erro de valor: ___ ValueError("salário negativo")', answer: ['raise'], explain: 'raise lança uma exceção; quem chamou pode tratá-la com except.' },
      {
        type: 'code',
        q: 'Escreva `validar_cnpj_tamanho(cnpj)` que devolve o CNPJ só com dígitos (removendo ".", "/" e "-") se ele tiver exatamente 14 dígitos; caso contrário, lança ValueError com a mensagem "CNPJ inválido".',
        starter: `def validar_cnpj_tamanho(cnpj):
    pass
`,
        tests: `assert validar_cnpj_tamanho("12.345.678/0001-90") == "12345678000190", "Deve remover a pontuação"
assert validar_cnpj_tamanho("12345678000190") == "12345678000190", "CNPJ já limpo deve ser devolvido igual"
try:
    validar_cnpj_tamanho("123")
    assert False, "CNPJ curto deveria lançar ValueError"
except ValueError as e:
    assert "CNPJ inválido" in str(e), "A mensagem deve ser 'CNPJ inválido'"
`,
        solution: `def validar_cnpj_tamanho(cnpj):
    limpo = cnpj.replace(".", "").replace("/", "").replace("-", "")
    if len(limpo) != 14 or not limpo.isdigit():
        raise ValueError("CNPJ inválido")
    return limpo
`,
        hint: 'Remova os separadores com replace e verifique len(limpo) == 14 antes de devolver.',
        explain: 'Validar na entrada e lançar ValueError com mensagem clara impede que um CNPJ malformado se espalhe pelo sistema.',
      },
      { type: 'mc', q: 'Em uma classe, o que é self?', options: ['A instância sobre a qual o método está sendo chamado', 'A classe em si', 'Uma variável global', 'O módulo onde a classe foi definida'], answer: 0, explain: 'self é a referência ao objeto atual; é por ele que você acessa os atributos de instância.' },
      { type: 'tf', q: 'Se uma classe define apenas __repr__ e não __str__, print(objeto) usa o __repr__.', answer: true, explain: 'Na ausência de __str__, str() recorre a __repr__. Por isso vale definir ao menos __repr__.' },
      { type: 'mc', q: 'Qual método dunder permite usar o operador + entre dois objetos da sua classe?', options: ['__sum__', '__plus__', '__add__', '__concat__'], answer: 2, explain: 'a + b chama a.__add__(b).' },
      { type: 'mc', q: 'Qual é a forma correta de declarar um campo lista com padrão em uma dataclass?', options: ['itens: list = []', 'itens = list()', 'itens: list = field(default_factory=list)', 'itens: list = None, sem mais nada'], answer: 2, explain: 'default_factory cria uma lista nova para cada instância e evita o erro de padrão mutável.' },
      {
        type: 'code',
        q: 'Escreva a função geradora `debitos(valores)` que produz apenas os valores negativos da sequência recebida, e a função `total_debitos(valores)` que devolve a soma deles arredondada a 2 casas usando o gerador.',
        starter: `def debitos(valores):
    pass

def total_debitos(valores):
    pass
`,
        tests: `import inspect
assert inspect.isgeneratorfunction(debitos), "debitos deve ser uma função geradora (yield)"
assert list(debitos([100.0, -35.5, -1200.0, 50.0, -8.9])) == [-35.5, -1200.0, -8.9], "debitos deve produzir só os negativos"
assert total_debitos([100.0, -35.5, -1200.0, 50.0, -8.9]) == -1244.4, "total_debitos deveria ser -1244.4"
assert total_debitos([1, 2, 3]) == 0, "Sem negativos, o total é 0"
`,
        solution: `def debitos(valores):
    for v in valores:
        if v < 0:
            yield v

def total_debitos(valores):
    return round(sum(debitos(valores)), 2)
`,
        hint: 'No gerador, use if v < 0: yield v. Em total_debitos, some o gerador com sum().',
        explain: 'O gerador filtra sob demanda, sem criar lista intermediária; sum() consome o gerador até o fim.',
      },
      { type: 'mc', q: 'No projeto de conciliação, por que cada lado é agrupado em um dicionário chave -> LISTA de movimentos, em vez de um simples conjunto de chaves?', options: ['Porque conjuntos não aceitam tuplas como elementos', 'Porque listas são mais rápidas que conjuntos', 'Para tratar movimentos repetidos: dois lançamentos iguais no mesmo dia precisam de dois pares para casar', 'Para manter a ordem original do arquivo no relatório'], answer: 2, explain: 'Com um conjunto, dois movimentos idênticos virariam uma única chave e um deles sumiria da conciliação; a lista preserva a quantidade e casa par a par.' },
    ],
  },
});
