registerModule({
  course: 'python',
  id: 'py-04',
  order: 4,
  level: 'Avançado',
  title: 'Qualidade, ferramentas e biblioteca padrão',
  description: 'Você vai escrever código com tipos, testes automatizados e logging, dominar collections, itertools, datetime e expressões regulares, criar programas de linha de comando e organizar projetos com ambientes virtuais. No fim, constrói um CLI de fechamento mensal com validação, agregação, log e testes.',
  hours: 11,
  lessons: [
    // ------------------------------------------------------------------
    {
      id: 'py-04-01',
      title: 'Type hints',
      minutes: 32,
      content: 'content/python/py-04/01-type-hints.md',
      exercises: [
        { type: 'mc', q: 'Uma função é anotada como def f(valor: float) -> float. O que acontece ao executar f("mil") sem rodar nenhuma ferramenta externa?', options: ['O Python lança TypeError antes de entrar na função', 'Nada: o Python não verifica anotações em tempo de execução; o erro só aparece se o corpo falhar', 'O Python converte "mil" para float automaticamente', 'O Python emite um aviso e continua'], answer: 1, explain: 'Anotações são informação para pessoas e ferramentas (mypy, pyright). O interpretador as ignora na execução.' },
        { type: 'fill', q: 'Complete a anotação para uma lista de números decimais: def media(valores: list[___]) -> float:', answer: ['float'], explain: 'list[float] indica uma lista cujos elementos são float.' },
        { type: 'tf', q: 'No Python 3.12, Optional[int] e int | None significam a mesma coisa.', answer: true, explain: 'A sintaxe com barra (3.10+) é a forma moderna de escrever o mesmo tipo opcional.' },
        {
          type: 'code',
          q: 'Escreva a função `media(valores)` com anotações de tipo: o parâmetro é list[float] e o retorno é float. Ela devolve a média aritmética dos valores, arredondada a 2 casas.',
          starter: `def media(valores):
    pass
`,
          tests: `assert media([100.0, 200.0, 300.0]) == 200.0, "A média de 100, 200 e 300 é 200.0"
assert media([1.0, 2.0]) == 1.5, "A média de 1 e 2 é 1.5"
anot = media.__annotations__
assert anot.get("valores") == list[float], "O parâmetro valores deve ser anotado como list[float]"
assert anot.get("return") is float, "O retorno deve ser anotado como float"
`,
          solution: `def media(valores: list[float]) -> float:
    return round(sum(valores) / len(valores), 2)
`,
          hint: 'A sintaxe é def media(valores: list[float]) -> float:. As anotações ficam em media.__annotations__.',
          explain: 'As anotações documentam o contrato da função e ficam acessíveis em __annotations__, de onde ferramentas e o próprio Python podem lê-las.',
        },
        {
          type: 'code',
          q: 'Crie o TypedDict `Lancamento` com as chaves data (str), conta (str) e valor (float), e a função `total(lancamentos: list[Lancamento]) -> float` que soma os valores arredondando a 2 casas.',
          starter: `from typing import TypedDict

# defina Lancamento e total aqui
`,
          tests: `import typing
assert typing.is_typeddict(Lancamento), "Lancamento deve ser um TypedDict"
assert Lancamento.__annotations__ == {"data": str, "conta": str, "valor": float}, "As chaves devem ser data: str, conta: str, valor: float"
dados = [{"data": "2026-03-01", "conta": "1.1.01", "valor": 1500.0}, {"data": "2026-03-02", "conta": "3.1.02", "valor": -3500.0}]
assert total(dados) == -2000.0, "total deveria ser -2000.0"
assert total([]) == 0.0, "Lista vazia soma 0.0"
`,
          solution: `from typing import TypedDict

class Lancamento(TypedDict):
    data: str
    conta: str
    valor: float

def total(lancamentos: list[Lancamento]) -> float:
    return round(sum(lanc["valor"] for lanc in lancamentos), 2)
`,
          hint: 'class Lancamento(TypedDict): com um campo anotado por linha. Em total, some lanc["valor"] de cada item.',
          explain: 'TypedDict descreve dicionários com chaves fixas: em execução são dicts comuns, mas o verificador de tipos conhece cada chave e seu tipo.',
        },
        { type: 'mc', q: 'Para que serve typing.Protocol?', options: ['Aceitar qualquer objeto que tenha certos métodos, sem exigir herança (tipagem por comportamento)', 'Definir uma classe-mãe obrigatória para herança', 'Serializar objetos em JSON', 'Validar tipos em tempo de execução'], answer: 0, explain: 'Protocol formaliza o duck typing: o que importa é ter os métodos com a assinatura certa, não herdar de uma classe específica.' },
        { type: 'mc', q: 'O que significa a anotação Callable[[float], float]?', options: ['Uma lista de floats', 'Uma tupla com dois floats', 'Uma função que recebe um float e devolve um float', 'Um dicionário de float para float'], answer: 2, explain: 'A lista interna traz os tipos dos parâmetros; o tipo após ela é o retorno.' },
        { type: 'mc', q: 'Qual anotação descreve corretamente um dicionário que mapeia códigos de conta (texto) para saldos (decimal)?', options: ['dict[float, str]', 'list[str, float]', 'dict[str]', 'dict[str, float]'], answer: 3, explain: 'dict[chave, valor]: a chave é str (código) e o valor é float (saldo).' },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'py-04-02',
      title: 'Testes automatizados',
      minutes: 34,
      content: 'content/python/py-04/02-testes-automatizados.md',
      exercises: [
        { type: 'mc', q: 'Quais arquivos e funções o pytest descobre automaticamente?', options: ['Qualquer arquivo .py com a palavra assert', 'Arquivos test_*.py e funções test_*', 'Apenas classes que herdam de unittest.TestCase', 'Arquivos listados em requirements.txt'], answer: 1, explain: 'A convenção de nomes test_ é o que permite ao pytest coletar os testes sem configuração.' },
        { type: 'tf', q: 'Ao executar com python -O, todas as instruções assert são removidas do programa.', answer: true, explain: 'Por isso assert serve para checagens internas, nunca para validar dados de entrada.' },
        { type: 'fill', q: 'Complete para verificar que a chamada lança ValueError no pytest: with pytest.___(ValueError):', answer: ['raises'], explain: 'pytest.raises é o gerenciador de contexto que falha o teste se a exceção esperada não ocorrer.' },
        {
          type: 'code',
          q: 'Escreva `calcular_inss(salario)`: 7,5% até 1518.00; 9% até 2793.88; 12% acima disso (arredondado a 2 casas); salário negativo lança ValueError. Depois escreva `testar_inss(funcao)`, que recebe uma implementação e usa asserts para verificar pelo menos: 1000 -> 75.0, 2000 -> 180.0, 3000 -> 360.0 e que -1 lança ValueError.',
          starter: `def calcular_inss(salario):
    pass

def testar_inss(funcao):
    # use assert para testar a funcao recebida
    pass
`,
          tests: `assert calcular_inss(1000) == 75.0, "1000 deveria dar 75.0"
assert calcular_inss(1518) == 113.85, "Limite da 1ª faixa: 1518 -> 113.85"
assert calcular_inss(2000) == 180.0, "2000 deveria dar 180.0"
assert calcular_inss(3000) == 360.0, "3000 deveria dar 360.0"
try:
    calcular_inss(-1)
    assert False, "Salário negativo deveria lançar ValueError"
except ValueError:
    pass
testar_inss(calcular_inss)
for ruim in [lambda s: 0.0, lambda s: s * 0.075, lambda s: round(s * 0.09, 2)]:
    try:
        testar_inss(ruim)
        assert False, "SENTINELA_X9: testar_inss não acusou uma implementação errada; seus asserts precisam cobrir as três faixas"
    except AssertionError as e:
        if "SENTINELA_X9" in str(e):
            raise
    except ValueError:
        pass
`,
          solution: `def calcular_inss(salario):
    if salario < 0:
        raise ValueError("salário negativo")
    if salario <= 1518.00:
        return round(salario * 0.075, 2)
    if salario <= 2793.88:
        return round(salario * 0.09, 2)
    return round(salario * 0.12, 2)

def testar_inss(funcao):
    assert funcao(1000) == 75.0, "faixa 7,5%"
    assert funcao(2000) == 180.0, "faixa 9%"
    assert funcao(3000) == 360.0, "faixa 12%"
    try:
        funcao(-1)
        assert False, "negativo deveria lançar ValueError"
    except ValueError:
        pass
`,
          hint: 'Em testar_inss, chame funcao(1000) etc. dentro de asserts. Para o negativo, use try/except ValueError e um assert False se não lançar.',
          explain: 'Um bom teste falha quando a implementação está errada: por isso o exercício confere que testar_inss acusa funções incorretas, não só aprova a correta.',
        },
        {
          type: 'code',
          q: 'Escreva `rodar_casos(funcao, casos)` que recebe uma função e uma lista de tuplas (entrada, esperado), chama a função para cada entrada e devolve a lista das entradas cujo resultado foi diferente do esperado. Depois crie a lista `CASOS_ARREDONDAR` com pelo menos 4 casos para a função embutida round com 2 casas (use lambda x: round(x, 2)).',
          starter: `def rodar_casos(funcao, casos):
    pass

CASOS_ARREDONDAR = [
    # (entrada, esperado)
]
`,
          tests: `assert rodar_casos(lambda x: x * 2, [(1, 2), (2, 4), (3, 7)]) == [3], "Só a entrada 3 falha (3*2 != 7)"
assert rodar_casos(lambda x: x, []) == [], "Sem casos, sem falhas"
assert len(CASOS_ARREDONDAR) >= 4, "Crie pelo menos 4 casos"
assert all(isinstance(c, tuple) and len(c) == 2 for c in CASOS_ARREDONDAR), "Cada caso é uma tupla (entrada, esperado)"
assert rodar_casos(lambda x: round(x, 2), CASOS_ARREDONDAR) == [], "Todos os casos devem passar com round(x, 2)"
assert rodar_casos(lambda x: x, CASOS_ARREDONDAR) != [], "Pelo menos um caso deve exigir arredondamento de verdade"
`,
          solution: `def rodar_casos(funcao, casos):
    falhas = []
    for entrada, esperado in casos:
        if funcao(entrada) != esperado:
            falhas.append(entrada)
    return falhas

CASOS_ARREDONDAR = [
    (1.005, 1.0),
    (2.675, 2.67),
    (10.123, 10.12),
    (0.1 + 0.2, 0.3),
    (100.0, 100.0),
]
`,
          hint: 'Percorra os casos com for entrada, esperado in casos: e compare funcao(entrada) com esperado.',
          explain: 'Separar os casos em uma tabela e o laço em uma função é a ideia por trás do parametrize do pytest: um teste, muitos dados.',
        },
        { type: 'mc', q: 'Para que serve uma fixture no pytest?', options: ['Marcar um teste como lento', 'Pular testes no Windows', 'Comparar floats com tolerância', 'Preparar dados ou objetos que vários testes recebem como parâmetro'], answer: 3, explain: 'Fixtures encapsulam a preparação (um objeto, uma pasta temporária) e são injetadas pelo nome do parâmetro.' },
        { type: 'order', q: 'Ordene o ciclo do TDD.', items: ['Escrever um teste para um comportamento que ainda não existe', 'Rodar e ver o teste falhar (vermelho)', 'Escrever o mínimo de código para o teste passar (verde)', 'Refatorar mantendo os testes passando'], explain: 'Vermelho, verde, refatorar: o teste vem antes do código e guia a implementação.' },
        { type: 'tf', q: 'É boa prática escrever testes para funções da biblioteca padrão, como sum() e sorted().', answer: false, explain: 'Teste o SEU comportamento. A biblioteca padrão já é testada pelos mantenedores do Python.' },
        { type: 'mc', q: 'Qual fixture embutida do pytest fornece uma pasta temporária para testes que gravam arquivos?', options: ['tmp_dir', 'temp_folder', 'tmp_path', 'tempfile'], answer: 2, explain: 'tmp_path entrega um pathlib.Path exclusivo para cada teste, limpo automaticamente.' },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'py-04-03',
      title: 'collections, itertools e functools',
      minutes: 33,
      content: 'content/python/py-04/03-collections-itertools-functools.md',
      exercises: [
        { type: 'mc', q: 'O que devolve Counter(["a", "b", "a", "c", "a"]).most_common(1)?', options: ['"a"', '3', '[("a", 3)]', '{"a": 3}'], answer: 2, explain: 'most_common devolve uma lista de tuplas (elemento, contagem), em ordem decrescente.' },
        { type: 'fill', q: 'Complete para que cada chave nova comece com uma lista vazia: grupos = defaultdict(___)', answer: ['list'], explain: 'O argumento é a função fábrica do valor padrão: list cria [] na primeira vez que a chave aparece.' },
        { type: 'tf', q: 'itertools.groupby agrupa corretamente mesmo que a sequência não esteja ordenada pela chave.', answer: false, explain: 'groupby só junta elementos consecutivos com a mesma chave. Sem ordenar antes, grupos iguais aparecem separados.' },
        {
          type: 'code',
          q: 'Escreva `top_clientes(clientes, n)` que devolve os n clientes mais frequentes como lista de tuplas (nome, quantidade), usando Counter; e `agrupar_por_conta(lancamentos)` que recebe tuplas (conta, valor) e devolve um dict conta -> lista de valores, usando defaultdict.',
          starter: `from collections import Counter, defaultdict

def top_clientes(clientes, n):
    pass

def agrupar_por_conta(lancamentos):
    pass
`,
          tests: `assert top_clientes(["Padaria", "Oficina", "Padaria", "Farmácia", "Padaria", "Oficina"], 2) == [("Padaria", 3), ("Oficina", 2)], "Os dois mais frequentes são Padaria (3) e Oficina (2)"
assert top_clientes([], 3) == [], "Lista vazia devolve []"
g = agrupar_por_conta([("1.1.01", 1500.0), ("3.1.02", -3500.0), ("1.1.01", 7200.0)])
assert dict(g) == {"1.1.01": [1500.0, 7200.0], "3.1.02": [-3500.0]}, "Agrupamento por conta incorreto"
assert isinstance(g, dict), "O resultado deve ser um dicionário (defaultdict também vale)"
`,
          solution: `from collections import Counter, defaultdict

def top_clientes(clientes, n):
    return Counter(clientes).most_common(n)

def agrupar_por_conta(lancamentos):
    grupos = defaultdict(list)
    for conta, valor in lancamentos:
        grupos[conta].append(valor)
    return grupos
`,
          hint: 'Counter(clientes).most_common(n) resolve a primeira. Na segunda, grupos[conta].append(valor) sem precisar checar se a chave existe.',
          explain: 'Counter e defaultdict eliminam o código repetitivo de "se a chave não existe, crie": contar e agrupar viram uma linha cada.',
        },
        {
          type: 'code',
          q: 'Escreva `ultimos_n(valores, n)` que devolve uma lista com os n últimos valores usando deque(maxlen=n), e `pares_que_somam(valores, alvo)` que devolve a lista de pares (tuplas) de valores distintos por posição cuja soma é igual a alvo, usando itertools.combinations.',
          starter: `from collections import deque
from itertools import combinations

def ultimos_n(valores, n):
    pass

def pares_que_somam(valores, alvo):
    pass
`,
          tests: `assert ultimos_n([10, 20, 30, 40, 50], 3) == [30, 40, 50], "Os 3 últimos são 30, 40, 50"
assert ultimos_n([1, 2], 5) == [1, 2], "Com menos valores que n, devolve todos"
assert pares_que_somam([100.0, 250.0, 400.0, 150.0], 500.0) == [(100.0, 400.0)], "Só 100 + 400 soma 500"
assert pares_que_somam([1, 2, 3, 4], 5) == [(1, 4), (2, 3)], "Pares que somam 5: (1,4) e (2,3), na ordem de combinations"
assert pares_que_somam([1, 2], 10) == [], "Sem pares, lista vazia"
`,
          solution: `from collections import deque
from itertools import combinations

def ultimos_n(valores, n):
    d = deque(maxlen=n)
    for v in valores:
        d.append(v)
    return list(d)

def pares_que_somam(valores, alvo):
    return [par for par in combinations(valores, 2) if sum(par) == alvo]
`,
          hint: 'deque(valores, maxlen=n) já descarta os mais antigos. combinations(valores, 2) gera todos os pares sem repetição.',
          explain: 'deque com maxlen mantém só os últimos itens automaticamente; combinations gera os subconjuntos de tamanho 2, base de problemas como "quais lançamentos somam este valor".',
        },
        { type: 'mc', q: 'O que acontece ao fazer append em um deque(maxlen=3) que já tem 3 elementos?', options: ['Lança IndexError', 'O elemento mais antigo (da esquerda) é descartado', 'O novo elemento é ignorado', 'O deque cresce para 4'], answer: 1, explain: 'maxlen cria uma janela deslizante: entra um no fim, sai o mais antigo do início.' },
        { type: 'tf', q: 'Uma função decorada com @lru_cache pode receber uma lista como argumento sem problemas.', answer: false, explain: 'Os argumentos precisam ser hashable para servir de chave do cache; listas não são. Use tuplas.' },
        { type: 'mc', q: 'O que faz functools.partial(imposto, aliquota=0.05)?', options: ['Cria uma nova função com o argumento aliquota já fixado em 0.05', 'Executa imposto com alíquota 0.05 e devolve o resultado', 'Transforma imposto em um gerador', 'Guarda em cache o resultado de imposto'], answer: 0, explain: 'partial devolve uma função que, ao ser chamada, repassa os argumentos fixados mais os novos.' },
        { type: 'fill', q: 'Complete para emendar várias listas em um único iterador: from itertools import ___', answer: ['chain'], explain: 'chain(a, b, c) percorre a, depois b, depois c, sem criar uma lista intermediária.' },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'py-04-04',
      title: 'datetime e expressões regulares',
      minutes: 34,
      content: 'content/python/py-04/04-datetime-e-regex.md',
      exercises: [
        { type: 'mc', q: 'Qual função do módulo re exige que o texto INTEIRO case com o padrão, sendo a mais indicada para validar formatos?', options: ['re.match', 're.search', 're.fullmatch', 're.findall'], answer: 2, explain: 'match casa só no início e aceita lixo depois; search procura em qualquer lugar; fullmatch exige o texto completo.' },
        { type: 'fill', q: 'Complete para converter texto em data: datetime.___("10/03/2026", "%d/%m/%Y")', answer: ['strptime'], explain: 'strptime (parse) lê texto segundo um formato; strftime (format) faz o caminho inverso.' },
        {
          type: 'code',
          q: 'Escreva `cpf_formatado(texto)` e `cnpj_formatado(texto)` que devolvem True se o texto estiver exatamente nos formatos 000.000.000-00 e 00.000.000/0000-00, respectivamente. Use re.fullmatch.',
          starter: `import re

def cpf_formatado(texto):
    pass

def cnpj_formatado(texto):
    pass
`,
          tests: `assert cpf_formatado("123.456.789-09") is True, "CPF formatado deve ser aceito"
assert cpf_formatado("12345678909") is False, "CPF sem pontuação deve ser rejeitado"
assert cpf_formatado("123.456.789-09 ") is False, "Espaço extra deve ser rejeitado (use fullmatch)"
assert cpf_formatado("123x456.789-09") is False, "O ponto deve ser literal: escape com barra invertida"
assert cnpj_formatado("12.345.678/0001-90") is True, "CNPJ formatado deve ser aceito"
assert cnpj_formatado("12.345.678/0001-9") is False, "CNPJ com dígito faltando deve ser rejeitado"
assert cnpj_formatado("12345678000190") is False, "CNPJ sem pontuação deve ser rejeitado"
`,
          solution: `import re

def cpf_formatado(texto):
    return re.fullmatch(r"\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}", texto) is not None

def cnpj_formatado(texto):
    return re.fullmatch(r"\\d{2}\\.\\d{3}\\.\\d{3}/\\d{4}-\\d{2}", texto) is not None
`,
          hint: 'Use raw string r"..." e escape os pontos: r"\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}". Devolva re.fullmatch(...) is not None.',
          explain: 'fullmatch garante que não há caracteres sobrando; o ponto escapado casa só com ponto. A regex valida o formato, não os dígitos verificadores.',
        },
        {
          type: 'code',
          q: 'Escreva `extrair_valores(texto)` que encontra todos os valores no formato "R$ 1.500,00" (espaço opcional após R$) em um texto e devolve a lista de floats correspondentes.',
          starter: `import re

def extrair_valores(texto):
    pass
`,
          tests: `assert extrair_valores("Total R$ 1.500,00; tarifa R$ 45,90; juros R$12,30") == [1500.0, 45.9, 12.3], "Deve extrair 1500.0, 45.9 e 12.3"
assert extrair_valores("Sem valores aqui") == [], "Texto sem valores devolve []"
assert extrair_valores("Pagar R$ 1.234.567,89 hoje") == [1234567.89], "Deve aceitar vários grupos de milhar"
`,
          solution: `import re

def extrair_valores(texto):
    achados = re.findall(r"R\\$\\s?(\\d{1,3}(?:\\.\\d{3})*,\\d{2})", texto)
    return [float(v.replace(".", "").replace(",", ".")) for v in achados]
`,
          hint: 'Padrão: r"R\\$\\s?(\\d{1,3}(?:\\.\\d{3})*,\\d{2})". findall devolve só o grupo capturado; depois converta trocando "." por "" e "," por ".".',
          explain: 'O grupo (...) captura só o número; (?:...) agrupa os blocos de milhar sem capturar; o $ precisa ser escapado porque é um caractere especial da regex.',
        },
        {
          type: 'code',
          q: 'Escreva `dias_atraso(vencimento, pagamento)` que recebe duas datas em texto no formato dd/mm/aaaa e devolve quantos dias o pagamento atrasou (0 se foi pago em dia ou antes). Use datetime.strptime.',
          starter: `from datetime import datetime

def dias_atraso(vencimento, pagamento):
    pass
`,
          tests: `assert dias_atraso("10/03/2026", "25/03/2026") == 15, "De 10/03 a 25/03 são 15 dias"
assert dias_atraso("10/03/2026", "10/03/2026") == 0, "Pago no dia: 0"
assert dias_atraso("10/03/2026", "01/03/2026") == 0, "Pago antes: 0, não negativo"
assert dias_atraso("25/12/2026", "05/01/2027") == 11, "Virada de ano: 11 dias"
`,
          solution: `from datetime import datetime

def dias_atraso(vencimento, pagamento):
    v = datetime.strptime(vencimento, "%d/%m/%Y")
    p = datetime.strptime(pagamento, "%d/%m/%Y")
    return max((p - v).days, 0)
`,
          hint: 'Converta as duas com strptime(texto, "%d/%m/%Y"); a diferença é um timedelta com atributo .days. Use max(..., 0).',
          explain: 'Data menos data dá timedelta; .days extrai a duração em dias. strptime valida o formato e lança ValueError se o texto não bater.',
        },
        { type: 'mc', q: 'O que significa (?:...) em uma expressão regular?', options: ['Grupo nomeado', 'Comentário dentro do padrão', 'Grupo opcional', 'Grupo sem captura: agrupa sem aparecer no resultado'], answer: 3, explain: 'Útil para aplicar * ou + a um trecho sem que ele seja devolvido por findall ou groups().' },
        { type: 'mc', q: 'Qual expressão cria um datetime com o fuso horário de Brasília?', options: ['datetime.now("Brasilia")', 'datetime.now(ZoneInfo("America/Sao_Paulo"))', 'datetime.now(tz="-03:00")', 'datetime.now().fuso("BRT")'], answer: 1, explain: 'zoneinfo.ZoneInfo usa os nomes do banco IANA; America/Sao_Paulo é o fuso de Brasília.' },
        { type: 'fill', q: 'Complete para remover tudo que não é dígito de um CPF: re.___(r"\\D", "", cpf)', answer: ['sub'], explain: 're.sub(padrao, substituto, texto) troca cada ocorrência; \\D casa qualquer caractere que não seja dígito.' },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'py-04-05',
      title: 'Linha de comando',
      minutes: 34,
      content: 'content/python/py-04/05-linha-de-comando.md',
      exercises: [
        { type: 'mc', q: 'Ao rodar python juros.py 1000 15, o que é sys.argv[0]?', options: ['"1000"', '"15"', '"juros.py"', '"python"'], answer: 2, explain: 'A posição 0 é sempre o nome do script; os argumentos digitados começam na posição 1.' },
        { type: 'tf', q: 'Todos os itens de sys.argv são strings, mesmo quando o usuário digita números.', answer: true, explain: 'A linha de comando entrega texto; a conversão para int ou float é responsabilidade do programa (ou do argparse com type=).' },
        { type: 'fill', q: 'Complete para criar uma opção booleana sem valor: parser.add_argument("--verbose", action="___")', answer: ['store_true'], explain: 'store_true define o atributo como True quando a opção aparece e False caso contrário.' },
        {
          type: 'code',
          q: 'Escreva `criar_parser()` que devolve um argparse.ArgumentParser com os posicionais valor (float) e dias (int) e a opção --taxa (float, padrão 0.00033). Depois escreva `calcular(argv)` que recebe a lista de argumentos, faz o parse e devolve os juros simples arredondados a 2 casas (valor * taxa * dias).',
          starter: `import argparse

def criar_parser():
    pass

def calcular(argv):
    pass
`,
          tests: `p = criar_parser()
assert isinstance(p, argparse.ArgumentParser), "criar_parser deve devolver um ArgumentParser"
a = p.parse_args(["1000", "15"])
assert a.valor == 1000.0 and isinstance(a.valor, float), "valor deve ser convertido para float"
assert a.dias == 15 and isinstance(a.dias, int), "dias deve ser convertido para int"
assert a.taxa == 0.00033, "taxa padrão deve ser 0.00033"
assert calcular(["1000", "15"]) == 4.95, "1000 * 0.00033 * 15 = 4.95"
assert calcular(["1000", "15", "--taxa", "0.001"]) == 15.0, "Com --taxa 0.001: 15.0"
`,
          solution: `import argparse

def criar_parser():
    parser = argparse.ArgumentParser(description="Calcula juros de mora simples.")
    parser.add_argument("valor", type=float)
    parser.add_argument("dias", type=int)
    parser.add_argument("--taxa", type=float, default=0.00033)
    return parser

def calcular(argv):
    args = criar_parser().parse_args(argv)
    return round(args.valor * args.taxa * args.dias, 2)
`,
          hint: 'add_argument("valor", type=float) para posicional; add_argument("--taxa", type=float, default=0.00033) para opção. parse_args aceita uma lista.',
          explain: 'Passar a lista de argumentos para parse_args permite testar o CLI sem a linha de comando real; type= faz a conversão e default= o valor padrão.',
        },
        {
          type: 'code',
          q: 'Escreva `categoria_de(nome_arquivo)` que devolve "pdf" para .pdf, "planilhas" para .xlsx/.xls/.csv, "xml" para .xml, "imagens" para .png/.jpg/.jpeg e "outros" para o resto. Ignore maiúsculas na extensão. Use pathlib.Path(...).suffix.',
          starter: `from pathlib import Path

def categoria_de(nome_arquivo):
    pass
`,
          tests: `assert categoria_de("nf_101.pdf") == "pdf", "nf_101.pdf é pdf"
assert categoria_de("folha.XLSX") == "planilhas", "Extensão em maiúsculas deve ser normalizada"
assert categoria_de("dados.csv") == "planilhas", "csv é planilha"
assert categoria_de("nfe.xml") == "xml", "xml"
assert categoria_de("foto.jpeg") == "imagens", "jpeg é imagem"
assert categoria_de("notas.txt") == "outros", "txt cai em outros"
assert categoria_de("sem_extensao") == "outros", "Sem extensão cai em outros"
`,
          solution: `from pathlib import Path

CATEGORIAS = {
    "pdf": {".pdf"},
    "planilhas": {".xlsx", ".xls", ".csv"},
    "xml": {".xml"},
    "imagens": {".png", ".jpg", ".jpeg"},
}

def categoria_de(nome_arquivo):
    ext = Path(nome_arquivo).suffix.lower()
    for nome, extensoes in CATEGORIAS.items():
        if ext in extensoes:
            return nome
    return "outros"
`,
          hint: 'ext = Path(nome).suffix.lower(); depois percorra um dicionário categoria -> conjunto de extensões.',
          explain: 'suffix devolve a extensão com o ponto; lower() evita que .PDF e .pdf sejam tratados de forma diferente. A regra em um dicionário facilita acrescentar extensões.',
        },
        {
          type: 'code',
          q: 'Escreva `contar_por_extensao(pasta)` que recebe um caminho de pasta e devolve um dicionário extensão (minúscula, com ponto) -> quantidade de arquivos, ignorando subpastas. Use Path.iterdir() e is_file().',
          starter: `from pathlib import Path

def contar_por_extensao(pasta):
    pass
`,
          tests: `import tempfile
from pathlib import Path as _P
_d = _P(tempfile.mkdtemp())
for nome in ["a.pdf", "b.PDF", "c.csv", "d.xlsx", "e.txt"]:
    (_d / nome).write_text("x", encoding="utf-8")
(_d / "subpasta").mkdir()
r = contar_por_extensao(_d)
assert r == {".pdf": 2, ".csv": 1, ".xlsx": 1, ".txt": 1}, "Contagem por extensão incorreta (normalize com lower e ignore pastas)"
assert contar_por_extensao(str(_d)) == r, "Deve aceitar o caminho também como string"
`,
          solution: `from pathlib import Path

def contar_por_extensao(pasta):
    contagem = {}
    for p in Path(pasta).iterdir():
        if not p.is_file():
            continue
        ext = p.suffix.lower()
        contagem[ext] = contagem.get(ext, 0) + 1
    return contagem
`,
          hint: 'Path(pasta).iterdir() lista tudo; pule o que não for is_file(); acumule com contagem.get(ext, 0) + 1.',
          explain: 'iterdir percorre a pasta sem recursão; is_file separa arquivos de subpastas; Path(pasta) aceita tanto str quanto Path.',
        },
        { type: 'mc', q: 'Por que um CLI que move arquivos deve ter uma opção --dry-run?', options: ['Para mostrar o que seria feito sem alterar nada, permitindo conferir antes de executar de verdade', 'Para rodar mais rápido', 'Para ignorar erros', 'Para gerar o arquivo de ajuda'], answer: 0, explain: 'Operações em arquivos são difíceis de desfazer; a simulação é a rede de segurança.' },
        { type: 'order', q: 'Ordene as etapas de um main() bem estruturado para um CLI.', items: ['Criar o ArgumentParser e declarar os argumentos', 'Chamar parse_args(argv)', 'Validar entradas (ex.: a pasta existe?)', 'Chamar a função que faz o trabalho', 'Imprimir o resultado e devolver o código de saída'], explain: 'Parsing, validação, processamento e saída, nessa ordem, com a lógica de negócio fora do main.' },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'py-04-06',
      title: 'Ambientes virtuais e dependências',
      minutes: 29,
      content: 'content/python/py-04/06-ambientes-virtuais-e-dependencias.md',
      exercises: [
        { type: 'mc', q: 'Qual comando cria um ambiente virtual chamado .venv na pasta atual?', options: ['pip install venv', 'python -m venv .venv', 'venv create .venv', 'python --venv .venv'], answer: 1, explain: 'venv é um módulo da biblioteca padrão, executado com python -m venv NOME.' },
        { type: 'tf', q: 'A pasta .venv deve ser versionada no Git para que outras pessoas tenham os mesmos pacotes.', answer: false, explain: 'O .venv é pesado e específico da máquina. Versione requirements.txt ou pyproject.toml e recrie o ambiente com pip install.' },
        { type: 'fill', q: 'Complete para instalar todas as dependências listadas: pip install -r ___', answer: ['requirements.txt'], explain: '-r (requirements) lê o arquivo e instala cada linha.' },
        { type: 'order', q: 'Ordene os passos para começar um projeto com dependências isoladas.', items: ['python -m venv .venv', 'Ativar o ambiente (Activate.ps1 ou source activate)', 'pip install openpyxl pytest', 'pip freeze > requirements.txt'], explain: 'Criar, ativar, instalar e só então registrar o que foi instalado.' },
        { type: 'mc', q: 'No pyproject.toml, onde ficam as dependências obrigatórias do projeto?', options: ['[tool.pip] packages', '[requirements]', '[build-system] requires', '[project] dependencies = [...]'], answer: 3, explain: 'A seção [project] traz nome, versão, requires-python e a lista dependencies; build-system é só para empacotar.' },
        { type: 'mc', q: 'O que faz pip install -e . na raiz do projeto?', options: ['Exporta o projeto para um .exe', 'Apaga o ambiente virtual', 'Instala o projeto em modo editável: alterações no código valem sem reinstalar', 'Instala só as dependências de desenvolvimento'], answer: 2, explain: 'O modo editável cria um link para a pasta src/, resolvendo os imports do pacote nos testes.' },
        { type: 'tf', q: 'Dados reais de clientes podem ser versionados desde que o repositório no GitHub seja privado.', answer: false, explain: 'Repositórios privados vazam, mudam de dono e ficam em servidores de terceiros. Use dados de exemplo anonimizados.' },
        { type: 'mc', q: 'Para que serve o arquivo .gitignore?', options: ['Indicar ao Git quais arquivos e pastas não devem ser versionados', 'Listar as dependências do projeto', 'Configurar o ruff', 'Definir a versão do Python'], answer: 0, explain: 'Nele entram .venv/, __pycache__/, caches, .env e pastas de dados.' },
        { type: 'order', q: 'Ordene os comandos para publicar um projeto novo no GitHub (o remoto origin já foi configurado).', items: ['git init', 'git add .', 'git commit -m "Estrutura inicial"', 'git push -u origin main'], explain: 'Cada comando depende do anterior: só há o que adicionar depois do init, só há o que commitar depois do add, e só há o que enviar depois do commit.' },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'py-04-07',
      title: 'Logging e depuração',
      minutes: 35,
      content: 'content/python/py-04/07-logging-e-depuracao.md',
      exercises: [
        { type: 'mc', q: 'Qual é a ordem correta dos níveis de logging, do menos ao mais grave?', options: ['DEBUG, INFO, WARNING, ERROR, CRITICAL', 'INFO, DEBUG, WARNING, ERROR, CRITICAL', 'DEBUG, WARNING, INFO, ERROR, CRITICAL', 'WARNING, INFO, DEBUG, ERROR, CRITICAL'], answer: 0, explain: 'Definir o nível mínimo como INFO descarta DEBUG; como WARNING, descarta DEBUG e INFO.' },
        { type: 'fill', q: 'Complete para que TODAS as mensagens, inclusive as de depuração, apareçam: logging.basicConfig(level=logging.___)', answer: ['DEBUG'], explain: 'DEBUG é o nível mais baixo; com ele nada é filtrado.' },
        { type: 'tf', q: 'logger.exception("msg") dentro de um except grava a mensagem em nível ERROR junto com o traceback completo.', answer: true, explain: 'É a forma recomendada de registrar exceções: preserva a pilha para a investigação posterior.' },
        {
          type: 'code',
          q: 'Escreva `processar(valores)` que usa um logger chamado "folha" (logging.getLogger("folha")): para cada valor negativo registra um WARNING contendo o valor; para os demais soma. Devolve a soma dos valores não negativos.',
          starter: `import logging

logger = logging.getLogger("folha")

def processar(valores):
    pass
`,
          tests: `import logging, io
_buf = io.StringIO()
_h = logging.StreamHandler(_buf)
_h.setFormatter(logging.Formatter("%(levelname)s %(message)s"))
_lg = logging.getLogger("folha")
_lg.addHandler(_h)
_lg.setLevel(logging.DEBUG)
assert processar([10, -5, 20, -1.5]) == 30, "A soma dos não negativos de [10, -5, 20, -1.5] é 30"
_txt = _buf.getvalue()
assert "WARNING" in _txt, "Valores negativos devem gerar WARNING"
assert "-5" in _txt and "-1.5" in _txt, "A mensagem de aviso deve conter o valor negativo"
assert _txt.count("WARNING") == 2, "Deve haver exatamente um WARNING por valor negativo"
assert processar([1, 2, 3]) == 6, "Sem negativos, soma tudo"
`,
          solution: `import logging

logger = logging.getLogger("folha")

def processar(valores):
    total = 0
    for v in valores:
        if v < 0:
            logger.warning("Valor negativo ignorado: %s", v)
        else:
            total += v
    return total
`,
          hint: 'Dentro do laço: if v < 0: logger.warning("Valor negativo: %s", v) else: total += v.',
          explain: 'Um logger nomeado permite que o programa principal decida para onde as mensagens vão (tela, arquivo) e qual nível exibir, sem alterar a função.',
        },
        {
          type: 'code',
          q: 'Escreva `ratear(total, pesos)` que divide total proporcionalmente aos pesos, arredondando cada parte a 2 casas e ajustando a última parte para que a soma feche exatamente. Inclua um assert que verifica a invariante round(sum(partes), 2) == round(total, 2) antes de devolver.',
          starter: `def ratear(total, pesos):
    pass
`,
          tests: `assert ratear(100.0, [1, 1, 1]) == [33.33, 33.33, 33.34], "100 em 3 partes iguais: 33.33, 33.33, 33.34"
assert ratear(1000.0, [1, 3]) == [250.0, 750.0], "1000 em pesos 1 e 3: 250 e 750"
r = ratear(10.0, [1, 1, 1, 1, 1, 1])
assert round(sum(r), 2) == 10.0, "A soma das partes deve fechar com o total"
assert len(r) == 6, "Uma parte por peso"
`,
          solution: `def ratear(total, pesos):
    soma_pesos = sum(pesos)
    partes = [round(total * p / soma_pesos, 2) for p in pesos]
    diferenca = round(total - sum(partes), 2)
    partes[-1] = round(partes[-1] + diferenca, 2)
    assert round(sum(partes), 2) == round(total, 2), f"rateio não fecha: {sum(partes)} != {total}"
    return partes
`,
          hint: 'Calcule as partes, some, ache a diferença para o total e some-a à última parte. O assert documenta que a soma fecha.',
          explain: 'O assert verifica uma invariante interna (a soma deve fechar); se um dia o cálculo quebrar, o erro aparece na hora, com mensagem, em vez de um centavo sumir em silêncio.',
        },
        { type: 'mc', q: 'No pdb, qual comando executa a linha atual e para na próxima, SEM entrar em funções chamadas?', options: ['s', 'n', 'c', 'p'], answer: 1, explain: 'n (next) pula por cima das chamadas; s (step) entra nelas; c continua; p imprime uma expressão.' },
        { type: 'mc', q: 'Por que assert não deve ser usado para validar dados de entrada do usuário ou de arquivos?', options: ['Porque é lento', 'Porque assert só funciona dentro de testes', 'Porque com python -O os asserts são removidos e a validação desaparece', 'Porque assert não aceita mensagem'], answer: 2, explain: 'Validação de entrada precisa existir sempre: use if + raise ValueError. Reserve assert para invariantes internas.' },
        { type: 'order', q: 'Ordene uma estratégia de depuração eficaz.', items: ['Reproduzir o erro com a menor entrada possível', 'Ler o traceback de baixo para cima até a primeira linha do seu código', 'Formular uma hipótese sobre a causa', 'Testar a hipótese (breakpoint, log ou print)', 'Corrigir e escrever um teste que reproduza o bug'], explain: 'Entender antes de mudar; e o teste final garante que o bug não volta.' },
        { type: 'fill', q: 'Complete a forma recomendada de criar o logger de um módulo: logger = logging.getLogger(___)', answer: ['__name__'], explain: 'Com __name__, o logger recebe o nome do módulo, e as mensagens mostram de onde vieram.' },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'py-04-08',
      title: 'Código limpo',
      minutes: 35,
      content: 'content/python/py-04/08-codigo-limpo.md',
      exercises: [
        { type: 'mc', q: 'Pela PEP 8, qual é a convenção de nome para classes?', options: ['snake_case', 'CamelCase', 'MAIUSCULAS', 'kebab-case'], answer: 1, explain: 'Classes usam CamelCase (NotaFiscal); funções e variáveis usam snake_case; constantes, MAIUSCULAS.' },
        { type: 'tf', q: 'A PEP 8 recomenda indentar com tabs para economizar espaço.', answer: false, explain: 'A recomendação é 4 espaços por nível, nunca tabs.' },
        { type: 'fill', q: 'Complete a comparação idiomática com None: if resultado ___ None:', answer: ['is'], explain: 'None é um singleton; compare identidade com is, não igualdade com ==.' },
        {
          type: 'code',
          q: 'Refatore: a função `proc(lst)` abaixo funciona, mas é ilegível. Escreva `resumir(valores)` que recebe uma lista de floats e devolve um dict com as chaves "total", "debitos" (soma dos negativos) e "creditos" (soma dos não negativos), todos arredondados a 2 casas. Mantenha proc intacta para comparação.',
          starter: `def proc(lst):
    t = 0; d = 0; c = 0
    for x in lst:
        t = t + x
        if x < 0: d = d + x
        else: c = c + x
    return {"total": round(t, 2), "debitos": round(d, 2), "creditos": round(c, 2)}

def resumir(valores):
    pass
`,
          tests: `dados = [100.0, -35.5, -1200.0, 50.0, -8.9]
assert resumir(dados) == {"total": -1094.4, "debitos": -1244.4, "creditos": 150.0}, "resumir deve devolver os mesmos totais"
assert resumir(dados) == proc(dados), "resumir deve ter o mesmo comportamento de proc"
assert resumir([]) == {"total": 0.0, "debitos": 0.0, "creditos": 0.0}, "Lista vazia: tudo 0.0"
assert resumir([10]) == {"total": 10.0, "debitos": 0.0, "creditos": 10.0}, "Um crédito só"
`,
          solution: `def proc(lst):
    t = 0; d = 0; c = 0
    for x in lst:
        t = t + x
        if x < 0: d = d + x
        else: c = c + x
    return {"total": round(t, 2), "debitos": round(d, 2), "creditos": round(c, 2)}

def resumir(valores):
    debitos = round(sum(v for v in valores if v < 0), 2)
    creditos = round(sum(v for v in valores if v >= 0), 2)
    return {"total": round(debitos + creditos, 2), "debitos": debitos, "creditos": creditos}
`,
          hint: 'Use expressões geradoras: sum(v for v in valores if v < 0). Nomes completos em vez de t, d, c.',
          explain: 'Refatorar é mudar a forma mantendo o comportamento: o teste resumir(dados) == proc(dados) é a rede de segurança que garante isso.',
        },
        {
          type: 'code',
          q: 'Escreva a constante `ALIQUOTA_ISS = 0.05` e a função `iss(valor)` que usa a constante (nunca o número solto) e devolve o imposto arredondado a 2 casas. A função deve ter uma docstring de uma linha explicando o que faz.',
          starter: `# constante aqui

def iss(valor):
    pass
`,
          tests: `assert ALIQUOTA_ISS == 0.05, "Defina a constante ALIQUOTA_ISS = 0.05"
assert iss(1000) == 50.0, "ISS de 1000 a 5% é 50.0"
assert iss.__doc__ is not None and len(iss.__doc__.strip()) > 10, "iss precisa de uma docstring descritiva"
ALIQUOTA_ISS = 0.02
assert iss(1000) == 20.0, "iss deve usar a constante ALIQUOTA_ISS, não o número 0.05 solto"
`,
          solution: `ALIQUOTA_ISS = 0.05

def iss(valor):
    """Calcula o ISS devido sobre o valor do serviço usando a alíquota padrão."""
    return round(valor * ALIQUOTA_ISS, 2)
`,
          hint: 'A docstring é a string logo abaixo do def. Dentro da função, use ALIQUOTA_ISS no cálculo.',
          explain: 'Número mágico vira constante nomeada (DRY: a alíquota existe em um só lugar) e a docstring diz o que a função faz sem precisar ler o corpo.',
        },
        { type: 'mc', q: 'O que o princípio DRY recomenda?', options: ['Escrever o código mais curto possível', 'Documentar tudo em inglês', 'Evitar classes', 'Cada regra de negócio deve existir em um único lugar, sem repetição'], answer: 3, explain: 'Don\'t Repeat Yourself: repetição é sinal de que falta uma função, constante ou classe.' },
        { type: 'mc', q: 'O que faz o comando ruff check --fix .?', options: ['Roda os testes', 'Cria o ambiente virtual', 'Aponta problemas de estilo e qualidade e corrige automaticamente os que forem seguros', 'Publica o pacote no PyPI'], answer: 2, explain: 'ruff é um linter rápido; --fix aplica correções automáticas (imports não usados, por exemplo). ruff format formata.' },
        { type: 'order', q: 'Ordene os passos de uma refatoração segura.', items: ['Garantir que existem testes para o comportamento atual', 'Fazer UMA mudança pequena (renomear, extrair função)', 'Rodar os testes', 'Fazer commit e repetir'], explain: 'Testes antes, passos pequenos, verificação a cada passo: assim a refatoração nunca muda o comportamento sem você perceber.' },
        { type: 'mc', q: 'Qual destes comentários é útil?', options: ['i += 1  # incrementa i', 'return x  # retorna x', '# A Receita manda arredondar para baixo nesta faixa (IN 2.110, art. 3)', '# função'], answer: 2, explain: 'Comentários devem explicar o porquê de algo não óbvio, não repetir o que o código já diz.' },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'py-04-09',
      title: 'Projeto guiado: CLI fechamento mensal',
      minutes: 35,
      content: 'content/python/py-04/09-projeto-fechamento-mensal.md',
      exercises: [
        {
          type: 'code',
          q: 'Crie a exceção `LinhaInvalida(ValueError)` e a função `validar_valor(texto)` que aceita apenas o formato brasileiro ("1.500,00", "-45,90", "0,10", "1500,00") usando re.fullmatch, devolvendo float. Qualquer outro formato (inclusive "1500.00") lança LinhaInvalida.',
          starter: `import re

class LinhaInvalida(ValueError):
    pass

def validar_valor(texto):
    pass
`,
          tests: `assert issubclass(LinhaInvalida, ValueError), "LinhaInvalida deve herdar de ValueError"
assert validar_valor("1.500,00") == 1500.0, "1.500,00 -> 1500.0"
assert validar_valor("-45,90") == -45.9, "-45,90 -> -45.9"
assert validar_valor("0,10") == 0.1, "0,10 -> 0.1"
assert validar_valor(" 1500,00 ") == 1500.0, "Espaços nas pontas devem ser ignorados"
for ruim in ["1500.00", "abc", "", "1,5", "1.50,00"]:
    try:
        validar_valor(ruim)
        assert False, f"{ruim!r} deveria lançar LinhaInvalida"
    except LinhaInvalida:
        pass
`,
          solution: `import re

RE_VALOR = re.compile(r"-?\\d{1,3}(?:\\.\\d{3})*,\\d{2}|-?\\d+,\\d{2}")

class LinhaInvalida(ValueError):
    pass

def validar_valor(texto):
    t = texto.strip()
    if not RE_VALOR.fullmatch(t):
        raise LinhaInvalida(f"valor fora do padrão 1.234,56: {texto!r}")
    return float(t.replace(".", "").replace(",", "."))
`,
          hint: 'Padrão: r"-?\\d{1,3}(?:\\.\\d{3})*,\\d{2}|-?\\d+,\\d{2}". Se fullmatch falhar, raise LinhaInvalida(...); senão converta.',
          explain: 'Validar com fullmatch e uma exceção própria rejeita formatos ambíguos de forma visível, em vez de interpretar um valor errado em silêncio.',
        },
        {
          type: 'code',
          q: 'Escreva `processar_linhas(linhas)` que recebe uma lista de dicionários com as chaves "conta" e "valor" (valor no formato brasileiro, ex. "1.500,00") e devolve uma tupla (por_conta, erros): por_conta é um dict conta -> total (arredondado a 2 casas) e erros é a lista de mensagens "linha N: ..." para valores inválidos, com N começando em 2 (a linha 1 é o cabeçalho). Use defaultdict(float).',
          starter: `from collections import defaultdict

def converter(texto):
    t = texto.strip()
    if "," not in t:
        raise ValueError(f"valor inválido: {texto!r}")
    return float(t.replace(".", "").replace(",", "."))

def processar_linhas(linhas):
    pass
`,
          tests: `linhas = [
    {"conta": "1.1.02", "valor": "1.500,00"},
    {"conta": "2.1.01", "valor": "-820,45"},
    {"conta": "1.1.02", "valor": "abc"},
    {"conta": "1.1.02", "valor": "200,00"},
]
por_conta, erros = processar_linhas(linhas)
assert dict(por_conta) == {"1.1.02": 1700.0, "2.1.01": -820.45}, "Totais por conta incorretos"
assert len(erros) == 1 and erros[0].startswith("linha 4:"), "A linha inválida é a 4 (cabeçalho é a 1)"
pc, er = processar_linhas([])
assert dict(pc) == {} and er == [], "Sem linhas: tudo vazio"
`,
          solution: `from collections import defaultdict

def converter(texto):
    t = texto.strip()
    if "," not in t:
        raise ValueError(f"valor inválido: {texto!r}")
    return float(t.replace(".", "").replace(",", "."))

def processar_linhas(linhas):
    por_conta = defaultdict(float)
    erros = []
    for n, reg in enumerate(linhas, start=2):
        try:
            valor = converter(reg["valor"])
        except ValueError as e:
            erros.append(f"linha {n}: {e}")
            continue
        por_conta[reg["conta"]] += valor
    return {c: round(v, 2) for c, v in por_conta.items()}, erros
`,
          hint: 'enumerate(linhas, start=2); dentro do try converta o valor; no except registre f"linha {n}: {e}" e continue; fora, some em por_conta[conta].',
          explain: 'Receber uma lista de dicts (o que o DictReader produziria) torna a função testável sem arquivos; registrar erros com o número da linha e seguir entrega o quadro completo em uma rodada.',
        },
        {
          type: 'code',
          q: 'Escreva `formatar_relatorio(por_conta, erros)` que devolve uma string com a linha "=== FECHAMENTO ===", depois uma linha por conta em ordem alfabética no formato "CONTA  VALOR" (valor com 2 casas), e, se houver erros, uma linha "Erros: N" seguida de uma linha "  - mensagem" por erro. Use "\\n" para separar as linhas.',
          starter: `def formatar_relatorio(por_conta, erros):
    pass
`,
          tests: `r = formatar_relatorio({"2.1.01": -820.45, "1.1.02": 1700.0}, ["linha 4: valor inválido: 'abc'"])
linhas = r.split("\\n")
assert linhas[0] == "=== FECHAMENTO ===", "Primeira linha deve ser o título"
assert linhas[1].startswith("1.1.02") and "1700.00" in linhas[1], "Contas em ordem alfabética, valor com 2 casas"
assert linhas[2].startswith("2.1.01") and "-820.45" in linhas[2], "Segunda conta"
assert "Erros: 1" in r, "Deve informar a quantidade de erros"
assert "  - linha 4: valor inválido: 'abc'" in linhas, "Cada erro em uma linha com dois espaços e hífen"
r2 = formatar_relatorio({"1.1.02": 10.0}, [])
assert "Erros" not in r2, "Sem erros, não deve aparecer a seção de erros"
`,
          solution: `def formatar_relatorio(por_conta, erros):
    linhas = ["=== FECHAMENTO ==="]
    for conta in sorted(por_conta):
        linhas.append(f"{conta}  {por_conta[conta]:.2f}")
    if erros:
        linhas.append(f"Erros: {len(erros)}")
        for e in erros:
            linhas.append(f"  - {e}")
    return "\\n".join(linhas)
`,
          hint: 'Monte uma lista de linhas e devolva "\\n".join(linhas). Percorra sorted(por_conta) para a ordem alfabética.',
          explain: 'Separar a formatação do cálculo permite testar o texto do relatório com dados de entrada conhecidos, sem ler arquivo nem processar nada.',
        },
        { type: 'mc', q: 'Por que o projeto envia o log para stderr e o relatório para stdout?', options: ['Porque stdout é mais rápido', 'Porque logging não funciona em stdout', 'Para que fechamento pasta > relatorio.txt grave só o relatório, enquanto o log continua visível na tela', 'Para esconder os erros'], answer: 2, explain: 'Separar os dois fluxos permite redirecionar o resultado sem misturá-lo com mensagens de processamento.' },
        { type: 'tf', q: 'Devolver código de saída 1 quando houve linhas com erro permite que um agendador ou script externo detecte o problema.', answer: true, explain: 'Convenção universal: 0 é sucesso; qualquer outro valor sinaliza falha para quem chamou.' },
        { type: 'mc', q: 'Em validar_data, por que usar a regex E depois date(ano, mes, dia)?', options: ['A regex confere o formato dd/mm/aaaa; date() confere se a data existe (31/02 passa na regex, mas não existe)', 'Porque a regex sozinha é lenta', 'Porque date() não aceita strings', 'Para converter o fuso horário'], answer: 0, explain: 'Formato e existência são validações diferentes; cada ferramenta cuida de uma.' },
        { type: 'fill', q: 'Complete para listar todos os CSVs da pasta em ordem: arquivos = sorted(pasta.___("*.csv"))', answer: ['glob'], explain: 'Path.glob aceita padrões com curinga e devolve os caminhos que casam; sorted garante ordem previsível.' },
        { type: 'order', q: 'Ordene o fluxo do CLI de fechamento mensal.', items: ['Interpretar argumentos e configurar o logging', 'Encontrar os CSVs da pasta com glob', 'Validar cada linha com regex e converter', 'Acumular totais com defaultdict e Counter', 'Imprimir o relatório e devolver o código de saída'], explain: 'Configuração, descoberta de arquivos, validação, agregação e saída: a ordem do pipeline.' },
      ],
    },
  ],
  // ====================================================================
  exam: {
    passScore: 70,
    questions: [
      { type: 'mc', q: 'Qual anotação descreve uma função que recebe uma lista de strings e devolve um dicionário de string para inteiro?', options: ['def f(x: list) -> dict', 'def f(x: list[str]) -> dict[str, int]', 'def f(x: [str]) -> {str: int}', 'def f(x: str[]) -> dict<str, int>'], answer: 1, explain: 'Coleções genéricas usam colchetes com os tipos internos: list[str] e dict[str, int].' },
      { type: 'tf', q: 'O interpretador Python lança erro automaticamente quando um argumento não corresponde à anotação de tipo.', answer: false, explain: 'As anotações só são verificadas por ferramentas externas como mypy e pyright.' },
      { type: 'mc', q: 'No pytest, como se verifica que uma chamada lança ValueError?', options: ['assert raises(ValueError)', 'with pytest.raises(ValueError): chamada()', 'try: chamada() except: pass', 'pytest.expect(ValueError)'], answer: 1, explain: 'pytest.raises é um gerenciador de contexto que falha se a exceção não ocorrer.' },
      { type: 'fill', q: 'Complete o decorador que roda o mesmo teste com vários casos: @pytest.mark.___("salario, esperado", [...])', answer: ['parametrize'], explain: 'parametrize transforma uma tabela de casos em vários testes independentes.' },
      {
        type: 'code',
        q: 'Escreva `validar_cnpj_formato(texto)` que devolve True se o texto estiver exatamente no formato 00.000.000/0000-00 (use re.fullmatch), e `testar_validador(funcao)` que usa asserts para checar que a função aceita "12.345.678/0001-90" e rejeita "12345678000190" e "12.345.678/0001-9".',
        starter: `import re

def validar_cnpj_formato(texto):
    pass

def testar_validador(funcao):
    pass
`,
        tests: `assert validar_cnpj_formato("12.345.678/0001-90") is True, "CNPJ formatado deve ser aceito"
assert validar_cnpj_formato("12345678000190") is False, "Sem pontuação deve ser rejeitado"
assert validar_cnpj_formato("12.345.678/0001-9") is False, "Dígito faltando deve ser rejeitado"
testar_validador(validar_cnpj_formato)
try:
    testar_validador(lambda t: True)
    assert False, "SENTINELA_X9: testar_validador não acusou um validador que aceita tudo; inclua asserts com casos inválidos"
except AssertionError as e:
    if "SENTINELA_X9" in str(e):
        raise
`,
        solution: `import re

def validar_cnpj_formato(texto):
    return re.fullmatch(r"\\d{2}\\.\\d{3}\\.\\d{3}/\\d{4}-\\d{2}", texto) is not None

def testar_validador(funcao):
    assert funcao("12.345.678/0001-90") is True, "formato correto"
    assert funcao("12345678000190") is False, "sem pontuação"
    assert funcao("12.345.678/0001-9") is False, "dígito faltando"
`,
        hint: 'Regex: r"\\d{2}\\.\\d{3}\\.\\d{3}/\\d{4}-\\d{2}". Em testar_validador, três asserts chamando funcao(...).',
        explain: 'Um teste útil precisa rejeitar implementações erradas: por isso o validador que aceita tudo deve fazer testar_validador falhar.',
      },
      { type: 'mc', q: 'Qual estrutura é a mais indicada para contar quantas notas cada cliente emitiu?', options: ['list', 'collections.deque', 'set', 'collections.Counter'], answer: 3, explain: 'Counter conta ocorrências e oferece most_common; é um dict com padrão zero.' },
      { type: 'tf', q: 'itertools.combinations([1, 2, 3], 2) gera (1, 2), (1, 3) e (2, 3), sem repetir pares em ordem diferente.', answer: true, explain: 'combinations ignora a ordem; permutations consideraria também (2, 1), (3, 1) e (3, 2).' },
      { type: 'fill', q: 'Complete para formatar uma data no padrão brasileiro: data.___("%d/%m/%Y")', answer: ['strftime'], explain: 'strftime (format) converte data em texto; strptime (parse) faz o inverso.' },
      {
        type: 'code',
        q: 'Escreva `extrair_datas(texto)` que devolve a lista de todas as datas no formato dd/mm/aaaa encontradas no texto, convertidas em objetos date. Use re.findall com grupos e datetime.date.',
        starter: `import re
from datetime import date

def extrair_datas(texto):
    pass
`,
        tests: `assert extrair_datas("Venc. 10/03/2026, pago em 25/03/2026.") == [date(2026, 3, 10), date(2026, 3, 25)], "Deve encontrar as duas datas em ordem"
assert extrair_datas("sem datas") == [], "Sem datas, lista vazia"
assert extrair_datas("Ano novo: 01/01/2027") == [date(2027, 1, 1)], "Uma data"
`,
        solution: `import re
from datetime import date

def extrair_datas(texto):
    achados = re.findall(r"(\\d{2})/(\\d{2})/(\\d{4})", texto)
    return [date(int(a), int(m), int(d)) for d, m, a in achados]
`,
        hint: 'Com três grupos, findall devolve tuplas (dia, mes, ano) de strings; converta com int() e monte date(ano, mes, dia).',
        explain: 'Grupos de captura permitem extrair as partes da data separadamente; findall com vários grupos devolve tuplas.',
      },
      { type: 'mc', q: 'Qual parâmetro de add_argument converte o texto digitado em número inteiro?', options: ['type=int', 'kind=int', 'convert=int', 'as=int'], answer: 0, explain: 'type= recebe uma função de conversão aplicada ao texto; entradas inválidas geram mensagem de erro automática.' },
      { type: 'mc', q: 'Qual arquivo deve conter .venv/, __pycache__/ e pastas de dados reais?', options: ['requirements.txt', 'pyproject.toml', '.gitignore', 'README.md'], answer: 2, explain: '.gitignore lista o que o Git não deve versionar.' },
      { type: 'mc', q: 'Com logging.basicConfig(level=logging.WARNING), quais chamadas produzem saída?', options: ['Apenas logging.debug', 'logging.info e logging.debug', 'logging.warning, logging.error e logging.critical', 'Todas'], answer: 2, explain: 'O nível mínimo WARNING descarta DEBUG e INFO.' },
      { type: 'tf', q: 'Pela PEP 8, constantes de módulo devem ser escritas em MAIUSCULAS_COM_UNDERSCORE.', answer: true, explain: 'ALIQUOTA_ISS, TETO_INSS: a convenção sinaliza que o valor não deve mudar.' },
      {
        type: 'code',
        q: 'Escreva `totalizar(linhas)` que recebe uma lista de tuplas (conta, valor_texto) com valores no formato brasileiro ("1.500,00") e devolve um dict conta -> total arredondado a 2 casas. Valores que não contêm vírgula devem ser ignorados (não somados), sem interromper o processamento. Use defaultdict(float).',
        starter: `from collections import defaultdict

def totalizar(linhas):
    pass
`,
        tests: `r = totalizar([("1.1.02", "1.500,00"), ("2.1.01", "-820,45"), ("1.1.02", "abc"), ("1.1.02", "200,00")])
assert dict(r) == {"1.1.02": 1700.0, "2.1.01": -820.45}, "Totais incorretos (o valor inválido deve ser ignorado)"
assert dict(totalizar([])) == {}, "Sem linhas, dict vazio"
`,
        solution: `from collections import defaultdict

def totalizar(linhas):
    totais = defaultdict(float)
    for conta, texto in linhas:
        t = texto.strip()
        if "," not in t:
            continue
        try:
            valor = float(t.replace(".", "").replace(",", "."))
        except ValueError:
            continue
        totais[conta] += valor
    return {c: round(v, 2) for c, v in totais.items()}
`,
        hint: 'Para cada tupla, pule se não houver vírgula; converta trocando "." por "" e "," por "."; some em totais[conta].',
        explain: 'defaultdict(float) acumula sem inicialização explícita; ignorar linhas inválidas de forma controlada mantém o processamento tolerante a falhas.',
      },
      { type: 'match', q: 'Relacione cada ferramenta ao que ela faz no projeto.', pairs: [['mypy', 'verifica os tipos sem executar o programa'], ['pytest', 'roda os testes automatizados'], ['ruff', 'aponta e corrige problemas de estilo (linter)'], ['venv', 'isola os pacotes de cada projeto'], ['logging', 'registra a execução com níveis e data/hora']], explain: 'Cada ferramenta cuida de uma camada da qualidade: tipos, testes, estilo, dependências e rastreabilidade.' },
    ],
  },
});
