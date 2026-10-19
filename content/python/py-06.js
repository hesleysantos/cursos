registerModule({
  course: 'python',
  id: 'py-06',
  order: 6,
  level: 'Especialista',
  title: 'Python a fundo e engenharia de software',
  description: 'Você vai entender o Python por dentro (modelo de objetos, descritores, metaclasses, protocolos), aplicar padrões de projeto sem exagero, medir e otimizar desempenho, implementar algoritmos clássicos, empacotar e publicar bibliotecas com CI, projetar sistemas em camadas seguros e concluir com um capstone: um sistema de escrituração contábil completo, testado e distribuível.',
  hours: 15,
  lessons: [
    // ------------------------------------------------------------------
    {
      id: 'py-06-01',
      title: 'Modelo de dados do Python',
      minutes: 35,
      content: 'content/python/py-06/01-modelo-de-dados.md',
      exercises: [
        {
          type: 'mc',
          q: 'Qual a diferença entre `a is b` e `a == b`?',
          options: ['Nenhuma; são sinônimos', 'is compara identidade (mesmo objeto); == compara valor via __eq__', 'is compara valor; == compara identidade', 'is só funciona com números'],
          answer: 1,
          explain: 'Duas listas com o mesmo conteúdo são == mas não is. Use is apenas para None e sentinelas; para o resto, ==.',
        },
        {
          type: 'code',
          q: 'A função abaixo tem o bug clássico do valor padrão mutável: chamadas sucessivas compartilham a mesma lista. Corrija `adicionar(item, lista=None)` para que cada chamada sem lista crie uma lista nova, mantendo o comportamento quando uma lista é passada.',
          starter: `def adicionar(item, lista=[]):
    lista.append(item)
    return lista
`,
          tests: `a = adicionar(1)
b = adicionar(2)
assert a == [1], "Primeira chamada deve devolver [1]"
assert b == [2], "Segunda chamada sem lista deve criar uma lista NOVA: [2]"
assert a is not b, "As listas de chamadas diferentes nao podem ser o mesmo objeto"
minha = [10]
assert adicionar(20, minha) == [10, 20] and minha == [10, 20], "Com lista passada, deve alterar essa lista"
import inspect
try:
    fonte = inspect.getsource(adicionar)
except Exception:
    fonte = "None"
assert "None" in fonte, "Use None como padrao e crie a lista dentro da funcao"
assert adicionar.__defaults__ == (None,), "O valor padrao de lista deve ser None"
`,
          solution: `def adicionar(item, lista=None):
    if lista is None:
        lista = []
    lista.append(item)
    return lista
`,
          hint: 'O padrão é avaliado uma única vez. Use None como padrão e faça if lista is None: lista = [].',
          explain: 'Valores padrão são criados na definição da função, não a cada chamada; um padrão mutável é compartilhado entre todas as chamadas. None como sentinela resolve.',
        },
        {
          type: 'tf',
          q: 'Se uma classe define `__eq__` mas não define `__hash__`, suas instâncias deixam de poder ser usadas como chaves de dicionário.',
          answer: true,
          explain: 'O Python zera __hash__ automaticamente quando você define __eq__, porque objetos iguais precisam ter o mesmo hash. Defina os dois ou use dataclass(frozen=True).',
        },
        {
          type: 'code',
          q: 'Implemente o descritor `Positivo` (com `__set_name__`, `__get__` e `__set__`) que guarda o valor na instância sob o nome `_<atributo>` e lança `ValueError` para valores menores ou iguais a zero. Depois use-o na classe `NotaFiscal`, que tem os atributos `valor` e `quantidade` e um `__init__(self, valor, quantidade)`.',
          starter: `class Positivo:
    pass

class NotaFiscal:
    pass
`,
          tests: `nf = NotaFiscal(1500.0, 3)
assert nf.valor == 1500.0 and nf.quantidade == 3, "Leitura deve passar pelo __get__"
assert nf.__dict__ == {"_valor": 1500.0, "_quantidade": 3}, "O valor deve ficar na instancia como _valor e _quantidade"
assert isinstance(NotaFiscal.valor, Positivo), "Acesso pela classe deve devolver o proprio descritor"
try:
    nf.quantidade = 0
    assert False, "quantidade 0 deveria lancar ValueError"
except ValueError:
    pass
try:
    NotaFiscal(-1, 1)
    assert False, "valor negativo no construtor deveria lancar ValueError"
except ValueError:
    pass
assert nf.quantidade == 3, "Apos a tentativa invalida, o valor antigo deve permanecer"
`,
          solution: `class Positivo:
    def __set_name__(self, dono, nome):
        self.nome = "_" + nome

    def __get__(self, obj, tipo=None):
        if obj is None:
            return self
        return getattr(obj, self.nome)

    def __set__(self, obj, valor):
        if valor <= 0:
            raise ValueError(f"{self.nome[1:]} deve ser positivo")
        setattr(obj, self.nome, valor)

class NotaFiscal:
    valor = Positivo()
    quantidade = Positivo()

    def __init__(self, valor, quantidade):
        self.valor = valor
        self.quantidade = quantidade
`,
          hint: '__set_name__(self, dono, nome) recebe o nome do atributo; guarde "_" + nome e use getattr/setattr no obj. Em __get__, se obj is None devolva self.',
          explain: 'Um descritor colocado como atributo de classe intercepta leitura e escrita de todas as instâncias. Com ele, a validação é escrita uma vez e reutilizada em quantos atributos e classes quiser.',
        },
        {
          type: 'fill',
          q: 'Para que as instâncias não tenham `__dict__` e só aceitem os atributos conta e valor, economizando memória: `___ = ("conta", "valor")`',
          answer: ['__slots__'],
          explain: '__slots__ troca o dicionário por um array fixo de referências: menos memória, acesso mais rápido e erro imediato para atributos não declarados.',
        },
        {
          type: 'code',
          q: 'Escreva a classe `Config` que recebe um dict no construtor (guardado em `self._dados`) e permite acessar as chaves como atributos via `__getattr__`. Para chave inexistente, deve lançar `AttributeError` (para que `hasattr` e `getattr` com padrão funcionem).',
          starter: `class Config:
    def __init__(self, dados):
        self._dados = dados
`,
          tests: `cfg = Config({"api_url": "https://x", "timeout": 10})
assert cfg.api_url == "https://x" and cfg.timeout == 10, "Chaves do dict devem virar atributos"
assert cfg._dados == {"api_url": "https://x", "timeout": 10}, "Atributos normais continuam funcionando"
assert hasattr(cfg, "senha") is False, "hasattr deve devolver False para chave inexistente"
assert getattr(cfg, "senha", "padrao") == "padrao", "getattr com padrao deve funcionar"
try:
    cfg.senha
    assert False, "Chave inexistente deveria lancar AttributeError"
except AttributeError:
    pass
`,
          solution: `class Config:
    def __init__(self, dados):
        self._dados = dados

    def __getattr__(self, nome):
        try:
            return self._dados[nome]
        except KeyError:
            raise AttributeError(f"Config não tem '{nome}'") from None
`,
          hint: '__getattr__(self, nome) só é chamado quando a busca normal falha. Lance AttributeError (não devolva None) quando a chave não existir.',
          explain: '__getattr__ roda apenas quando o atributo não foi encontrado pelo caminho normal, por isso _dados não passa por ele. Lançar AttributeError mantém o contrato de hasattr e getattr.',
        },
        {
          type: 'mc',
          q: 'Qual afirmação sobre `__getattr__` e `__getattribute__` está correta?',
          options: [
            '__getattribute__ só é chamado quando o atributo não existe',
            '__getattr__ é chamado para todo acesso a atributo',
            '__getattribute__ intercepta todo acesso e exige super() para evitar recursão; __getattr__ só roda quando a busca normal falha',
            'Os dois são sinônimos mantidos por compatibilidade',
          ],
          answer: 2,
          explain: 'Sobrescrever __getattribute__ é raro e perigoso (self.x dentro dele chama a si mesmo). __getattr__ é o gancho seguro para atributos dinâmicos.',
        },
        {
          type: 'order',
          q: 'Ordene a sequência em que o Python procura um atributo ao executar `obj.x`.',
          items: ['descritor de dados (com __set__) definido na classe ou nas bases', '__dict__ da própria instância', 'atributo de classe ou descritor não-dados (ex.: método) na classe ou nas bases', '__getattr__, se definido, como último recurso'],
          explain: 'Descritores de dados vencem o __dict__ da instância; descritores não-dados perdem para ele; __getattr__ só entra quando tudo falha.',
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'py-06-02',
      title: 'Metaclasses e criação de classes',
      minutes: 34,
      content: 'content/python/py-06/02-metaclasses.md',
      exercises: [
        {
          type: 'mc',
          q: 'O que a instrução `class Conta: taxa = 0.01` faz por baixo dos panos?',
          options: ['Chama object.__init__', 'Executa o corpo em um namespace e chama type("Conta", (object,), namespace)', 'Cria um dict e o guarda em uma variável global', 'Compila a classe para C'],
          answer: 1,
          explain: 'Classes são instâncias de type. A sintaxe class é açúcar para a chamada type(nome, bases, namespace), e uma metaclasse substitui type nessa chamada.',
        },
        {
          type: 'code',
          q: 'Escreva `criar_classe(nome, atributos)` que cria dinamicamente uma classe (herdando de object) com o nome dado e os atributos do dict, usando `type()` com três argumentos.',
          starter: `def criar_classe(nome, atributos):
    pass
`,
          tests: `Conta = criar_classe("Conta", {"taxa": 0.01, "descrever": lambda self: f"taxa {self.taxa}"})
assert Conta.__name__ == "Conta", "O nome da classe deve ser o informado"
assert type(Conta) is type, "O resultado deve ser uma classe (instancia de type)"
c = Conta()
assert c.taxa == 0.01, "Atributos do dict viram atributos de classe"
assert c.descrever() == "taxa 0.01", "Funcoes no dict viram metodos"
assert isinstance(c, object) and Conta.__bases__ == (object,), "Deve herdar de object"
`,
          solution: `def criar_classe(nome, atributos):
    return type(nome, (object,), dict(atributos))
`,
          hint: 'type(nome, (object,), dict_de_atributos).',
          explain: 'type com três argumentos é o construtor de classes; é exatamente o que a instrução class chama. Útil para gerar classes a partir de dados, como colunas de um arquivo.',
        },
        {
          type: 'code',
          q: 'Implemente a classe-base `Plugin` com um dict de classe `registro` e um `__init_subclass__(cls, codigo=None, **kwargs)` que registra automaticamente cada subclasse: a chave é `codigo` ou, se não informado, o nome da classe em minúsculas. Guarde também o código em `cls.codigo`. Chame `super().__init_subclass__(**kwargs)`.',
          starter: `class Plugin:
    registro = {}
`,
          tests: `class CSV(Plugin, codigo="csv"):
    pass

class Xlsx(Plugin):
    pass

assert Plugin.registro.get("csv") is CSV, "Subclasse com codigo deve ser registrada por ele"
assert Plugin.registro.get("xlsx") is Xlsx, "Sem codigo, usa o nome em minusculas"
assert CSV.codigo == "csv" and Xlsx.codigo == "xlsx", "cls.codigo deve ser definido"
assert "plugin" not in Plugin.registro, "A classe-base nao deve se registrar"
`,
          solution: `class Plugin:
    registro = {}

    def __init_subclass__(cls, codigo=None, **kwargs):
        super().__init_subclass__(**kwargs)
        cls.codigo = codigo or cls.__name__.lower()
        Plugin.registro[cls.codigo] = cls
`,
          hint: '__init_subclass__ é chamado automaticamente para cada subclasse; argumentos de palavra-chave da declaração (codigo="csv") chegam como parâmetros.',
          explain: '__init_subclass__ resolve o registro de plugins sem metaclasse: só a base precisa conhecê-lo, e as subclasses se registram ao serem definidas.',
        },
        {
          type: 'tf',
          q: 'Herdar de duas classes cujas metaclasses são diferentes e não relacionadas gera TypeError (metaclass conflict).',
          answer: true,
          explain: 'O Python precisa escolher uma metaclasse que seja subclasse de todas as envolvidas; se não existir, falha. É um dos motivos para preferir __init_subclass__.',
        },
        {
          type: 'fill',
          q: 'Dentro de `def __init_subclass__(cls, **kwargs):`, a primeira linha deve ser `super().___(**kwargs)` para cooperar com outras bases.',
          answer: ['__init_subclass__'],
          explain: 'Chamar super().__init_subclass__(**kwargs) repassa os argumentos restantes para as bases, mantendo a cooperação em hierarquias múltiplas.',
        },
        {
          type: 'mc',
          q: 'Em qual situação uma metaclasse é realmente justificada?',
          options: ['Registrar automaticamente subclasses', 'Validar um atributo ao atribuir', 'Construir um framework que precisa alterar o namespace antes de o corpo da classe rodar (__prepare__) ou interceptar a criação em nível que decorators e __init_subclass__ não alcançam', 'Criar um comando de CLI'],
          answer: 2,
          explain: 'Registro é __init_subclass__; validação é descritor/property. Metaclasses ficam para frameworks (ORMs, Enum) que precisam de controle total sobre a criação da classe.',
        },
        {
          type: 'order',
          q: 'Ordene as ferramentas da mais simples para a mais poderosa (e mais arriscada), que é a ordem em que você deve tentá-las.',
          items: ['property ou descritor', 'decorator de função ou de classe', '__init_subclass__', 'type(nome, bases, namespace) dinâmico', 'metaclasse'],
          explain: 'Cada degrau adiciona poder e complexidade. Comece pelo mais simples que resolve; metaclasse é o último recurso.',
        },
        {
          type: 'code',
          q: 'Implemente o registro explícito com decorator: um dict global `PLUGINS` e a função `registrar(codigo)` que devolve um decorator de classe; o decorator grava a classe em `PLUGINS[codigo]` e devolve a classe inalterada.',
          starter: `PLUGINS = {}

def registrar(codigo):
    pass
`,
          tests: `@registrar("csv")
class ExportadorCSV:
    def exportar(self): return "csv"

@registrar("json")
class ExportadorJSON:
    def exportar(self): return "json"

assert PLUGINS.get("csv") is ExportadorCSV, "A classe deve ser registrada pela chave"
assert PLUGINS.get("json") is ExportadorJSON, "Cada chave aponta para sua classe"
assert ExportadorCSV.__name__ == "ExportadorCSV", "O decorator deve devolver a classe inalterada"
assert PLUGINS["csv"]().exportar() == "csv", "A classe registrada deve ser utilizavel"
`,
          solution: `PLUGINS = {}

def registrar(codigo):
    def decorator(cls):
        PLUGINS[codigo] = cls
        return cls
    return decorator
`,
          hint: 'registrar recebe o código e devolve uma função que recebe a classe, registra e devolve a própria classe.',
          explain: 'O decorator de classe é a alternativa explícita ao registro automático: quem lê a classe vê o @registrar e entende na hora que ela entra no catálogo.',
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'py-06-03',
      title: 'Gerenciadores de contexto e protocolos',
      minutes: 34,
      content: 'content/python/py-06/03-contexto-e-protocolos.md',
      exercises: [
        {
          type: 'code',
          q: 'Implemente a classe `Transacao` como gerenciador de contexto: `__enter__` devolve o próprio objeto; `__exit__` grava em `self.ok` True se o bloco terminou sem exceção e False se houve exceção, e NÃO suprime a exceção.',
          starter: `class Transacao:
    pass
`,
          tests: `with Transacao() as t:
    x = 1 + 1
assert t.ok is True, "Sem excecao, ok deve ser True"
propagou = False
try:
    with Transacao() as t2:
        raise ValueError("falhou")
except ValueError:
    propagou = True
assert propagou, "A excecao deve propagar (nao devolva True em __exit__)"
assert t2.ok is False, "Com excecao, ok deve ser False"
`,
          solution: `class Transacao:
    def __enter__(self):
        self.ok = None
        return self

    def __exit__(self, exc_type, exc, tb):
        self.ok = exc_type is None
        return False
`,
          hint: '__exit__(self, exc_type, exc, tb): exc_type é None quando não houve exceção. Devolva False para deixá-la propagar.',
          explain: 'Os três argumentos de __exit__ descrevem a exceção do bloco. Devolver False (ou None) deixa a exceção seguir; True a engoliria, o que raramente é desejado.',
        },
        {
          type: 'code',
          q: 'Com `contextlib.contextmanager`, escreva `capturar_erros(lista)`: um gerenciador de contexto que, se o bloco lançar uma exceção (subclasse de Exception), acrescenta `str(excecao)` à lista e suprime a exceção. Se nada falhar, não altera a lista.',
          starter: `from contextlib import contextmanager

@contextmanager
def capturar_erros(lista):
    pass
`,
          tests: `erros = []
with capturar_erros(erros):
    raise ValueError("saldo insuficiente")
assert erros == ["saldo insuficiente"], "A mensagem da excecao deve ser registrada e a excecao suprimida"
with capturar_erros(erros):
    y = 2 * 2
assert erros == ["saldo insuficiente"], "Sem excecao, a lista nao muda"
with capturar_erros(erros):
    int("abc")
assert len(erros) == 2 and "abc" in erros[1], "Outras excecoes tambem sao capturadas"
`,
          solution: `from contextlib import contextmanager

@contextmanager
def capturar_erros(lista):
    try:
        yield
    except Exception as e:
        lista.append(str(e))
`,
          hint: 'Envolva o yield em try/except Exception as e; dentro do except, registre e não relance.',
          explain: 'Em um gerador decorado com @contextmanager, a exceção do bloco é lançada no ponto do yield; capturá-la ali e não relançar equivale a __exit__ devolver True.',
        },
        {
          type: 'code',
          q: 'Implemente `PlanoDeContas`, que recebe uma lista de tuplas `(codigo, descricao)` e implementa o protocolo de sequência: `__len__`, `__getitem__` (delegando à lista interna, para aceitar índices negativos e fatias) e `__contains__`, que verifica se um CÓDIGO existe. Não herde de nada além de object.',
          starter: `class PlanoDeContas:
    def __init__(self, contas):
        self._contas = list(contas)
`,
          tests: `plano = PlanoDeContas([("1.1", "Caixa"), ("1.2", "Bancos"), ("2.1", "Fornecedores")])
assert len(plano) == 3, "__len__ deve devolver a quantidade de contas"
assert plano[0] == ("1.1", "Caixa") and plano[-1] == ("2.1", "Fornecedores"), "Indices positivos e negativos"
assert plano[:2] == [("1.1", "Caixa"), ("1.2", "Bancos")], "Fatias devem funcionar"
assert "1.2" in plano and "9.9" not in plano, "__contains__ deve procurar pelo codigo"
assert [c for c, _ in plano] == ["1.1", "1.2", "2.1"], "Iteracao deve funcionar via __getitem__"
assert list(reversed(plano))[0] == ("2.1", "Fornecedores"), "reversed deve funcionar via __len__ + __getitem__"
`,
          solution: `class PlanoDeContas:
    def __init__(self, contas):
        self._contas = list(contas)

    def __len__(self):
        return len(self._contas)

    def __getitem__(self, i):
        return self._contas[i]

    def __contains__(self, codigo):
        return any(c == codigo for c, _ in self._contas)
`,
          hint: 'Delegue __len__ e __getitem__ à lista interna; em __contains__, percorra as tuplas comparando o primeiro elemento.',
          explain: 'Com __len__ e __getitem__ o objeto ganha for, fatias e reversed sem herdar nada: é o protocolo de sequência em ação (duck typing).',
        },
        {
          type: 'tf',
          q: 'Para que uma classe seja aceita onde um `typing.Protocol` é esperado, ela precisa herdar explicitamente desse Protocol.',
          answer: false,
          explain: 'Protocol é estrutural: basta ter os métodos com o formato certo. É a diferença para as ABCs, que exigem herança ou registro.',
        },
        {
          type: 'fill',
          q: 'Para que `isinstance(obj, Exportavel)` funcione com um Protocol, decore a classe com `@___` (importado de typing).',
          answer: ['runtime_checkable'],
          explain: 'Sem @runtime_checkable, isinstance com Protocol lança TypeError. Com ele, a verificação confere apenas a presença dos métodos.',
        },
        {
          type: 'code',
          q: 'Defina o Protocol `Exportavel` (decorado com `runtime_checkable`) com o método `exportar(self, dados) -> str`, e a função `filtrar_exportaveis(objetos)` que devolve apenas os objetos que satisfazem o protocolo, usando `isinstance`.',
          starter: `from typing import Protocol, runtime_checkable

class Exportavel(Protocol):
    pass

def filtrar_exportaveis(objetos):
    pass
`,
          tests: `class CSV:
    def exportar(self, dados): return ";".join(dados)

class Vazio:
    pass

a, b = CSV(), CSV()
r = filtrar_exportaveis([a, Vazio(), b, 42, "texto"])
assert r == [a, b], "So objetos com o metodo exportar devem passar"
assert isinstance(a, Exportavel) and not isinstance(Vazio(), Exportavel), "O Protocol deve ser verificavel em tempo de execucao"
assert filtrar_exportaveis([]) == [], "Lista vazia devolve lista vazia"
`,
          solution: `from typing import Protocol, runtime_checkable

@runtime_checkable
class Exportavel(Protocol):
    def exportar(self, dados) -> str: ...

def filtrar_exportaveis(objetos):
    return [o for o in objetos if isinstance(o, Exportavel)]
`,
          hint: 'Decore com @runtime_checkable, declare o método com corpo "..." e filtre com isinstance.',
          explain: 'CSV nunca ouviu falar de Exportavel e mesmo assim é aceito: duck typing verificado. É o contrato ideal para dependências trocáveis (produção x teste).',
        },
        {
          type: 'match',
          q: 'Relacione o protocolo aos métodos especiais que o definem.',
          pairs: [['Iterável', '__iter__'], ['Sized', '__len__'], ['Container', '__contains__'], ['Hashable', '__hash__ e __eq__'], ['Gerenciador de contexto', '__enter__ e __exit__']],
          explain: 'Cada comportamento nativo (for, len, in, chave de dict, with) pergunta por um conjunto específico de métodos.',
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'py-06-04',
      title: 'Padrões de projeto em Python idiomático',
      minutes: 35,
      content: 'content/python/py-06/04-padroes-de-projeto.md',
      exercises: [
        {
          type: 'code',
          q: 'Implemente o padrão Strategy com funções: um dict `ESTRATEGIAS` que mapeia "Simples", "Presumido" e "Real" a funções que recebem a receita e devolvem o imposto (6%, 11,33% e 15% da receita, respectivamente), e `calcular_imposto(regime, receita)` que usa o dict e lança `ValueError` para regime desconhecido.',
          starter: `ESTRATEGIAS = {}

def calcular_imposto(regime, receita):
    pass
`,
          tests: `assert set(ESTRATEGIAS) == {"Simples", "Presumido", "Real"}, "ESTRATEGIAS deve ter as tres chaves"
assert all(callable(f) for f in ESTRATEGIAS.values()), "Os valores devem ser funcoes"
assert abs(calcular_imposto("Simples", 10000) - 600) < 0.01, "Simples: 6%"
assert abs(calcular_imposto("Presumido", 10000) - 1133) < 0.01, "Presumido: 11,33%"
assert abs(calcular_imposto("Real", 10000) - 1500) < 0.01, "Real: 15%"
try:
    calcular_imposto("Lucro", 1)
    assert False, "Regime desconhecido deveria lancar ValueError"
except ValueError:
    pass
`,
          solution: `def _simples(receita):
    return receita * 0.06

def _presumido(receita):
    return receita * 0.1133

def _real(receita):
    return receita * 0.15

ESTRATEGIAS = {"Simples": _simples, "Presumido": _presumido, "Real": _real}

def calcular_imposto(regime, receita):
    try:
        estrategia = ESTRATEGIAS[regime]
    except KeyError:
        raise ValueError(f"regime desconhecido: {regime}") from None
    return estrategia(receita)
`,
          hint: 'Funções são valores: coloque-as no dict e chame ESTRATEGIAS[regime](receita), tratando KeyError.',
          explain: 'Em Python, o Strategy dispensa classes: um dicionário de funções permite adicionar um regime novo sem tocar em calcular_imposto (princípio aberto/fechado).',
        },
        {
          type: 'mc',
          q: 'Você precisa de uma única instância de configuração compartilhada. Qual abordagem é preferível em Python ao Singleton clássico com __new__?',
          options: ['Uma variável global alterada por todas as funções', 'Criar o objeto no ponto de entrada e passá-lo como parâmetro (ou usar o módulo/lru_cache como instância única)', 'Uma metaclasse que impede a segunda instância', 'Serializar a configuração em pickle a cada acesso'],
          answer: 1,
          explain: 'Injeção de dependência deixa a dependência explícita e testável. Módulos já são singletons naturais, e lru_cache permite cache_clear() nos testes.',
        },
        {
          type: 'code',
          q: 'Implemente o Observer: a classe `Eventos` com `inscrever(evento, callback)` e `emitir(evento, **dados)`, que chama todos os callbacks inscritos naquele evento passando os dados como argumentos nomeados. Emitir um evento sem inscritos não deve falhar.',
          starter: `class Eventos:
    def __init__(self):
        self._ouvintes = {}
`,
          tests: `ev = Eventos()
saldos = {}
log = []
ev.inscrever("gravado", lambda conta, valor: saldos.__setitem__(conta, saldos.get(conta, 0) + valor))
ev.inscrever("gravado", lambda conta, valor: log.append(f"{conta}:{valor}"))
ev.emitir("gravado", conta="1.1", valor=100)
ev.emitir("gravado", conta="1.1", valor=-30)
assert saldos == {"1.1": 70}, "Todos os ouvintes devem receber os dados"
assert log == ["1.1:100", "1.1:-30"], "Os ouvintes sao chamados na ordem de inscricao"
ev.emitir("inexistente", x=1)
`,
          solution: `class Eventos:
    def __init__(self):
        self._ouvintes = {}

    def inscrever(self, evento, callback):
        self._ouvintes.setdefault(evento, []).append(callback)

    def emitir(self, evento, **dados):
        for cb in self._ouvintes.get(evento, []):
            cb(**dados)
`,
          hint: 'Use setdefault(evento, []).append(callback) para inscrever e .get(evento, []) para emitir sem KeyError.',
          explain: 'Quem emite não conhece quem reage: os callbacks desacoplam o repositório das consequências (saldo, log, notificação).',
        },
        {
          type: 'fill',
          q: 'Em uma dataclass, uma lista como valor padrão exige fábrica: `executados: list = field(___=list)`',
          answer: ['default_factory'],
          explain: 'default_factory chama a função a cada instância, evitando que todas compartilhem a mesma lista (o mesmo bug do parâmetro padrão mutável).',
        },
        {
          type: 'code',
          q: 'Implemente o padrão Command com undo: a dataclass `Transferir(saldos, origem, destino, valor)` com métodos `executar()` (tira de origem, põe em destino) e `desfazer()` (inverso), e a classe `Historico` com `executar(cmd)` (executa e guarda) e `desfazer_ultimo()` (desfaz e remove o último comando; sem comandos, não faz nada).',
          starter: `from dataclasses import dataclass, field

@dataclass
class Transferir:
    saldos: dict
    origem: str
    destino: str
    valor: float

@dataclass
class Historico:
    executados: list = field(default_factory=list)
`,
          tests: `saldos = {"caixa": 1000.0, "banco": 500.0}
h = Historico()
h.executar(Transferir(saldos, "caixa", "banco", 200))
assert saldos == {"caixa": 800.0, "banco": 700.0}, "executar deve mover o valor"
h.executar(Transferir(saldos, "banco", "caixa", 50))
assert saldos == {"caixa": 850.0, "banco": 650.0}, "Segundo comando"
h.desfazer_ultimo()
assert saldos == {"caixa": 800.0, "banco": 700.0}, "desfazer_ultimo desfaz o ultimo comando"
h.desfazer_ultimo()
assert saldos == {"caixa": 1000.0, "banco": 500.0}, "Desfaz o primeiro"
h.desfazer_ultimo()
assert saldos == {"caixa": 1000.0, "banco": 500.0}, "Sem comandos, nada acontece"
assert h.executados == [], "A pilha deve estar vazia"
`,
          solution: `from dataclasses import dataclass, field

@dataclass
class Transferir:
    saldos: dict
    origem: str
    destino: str
    valor: float

    def executar(self):
        self.saldos[self.origem] -= self.valor
        self.saldos[self.destino] += self.valor

    def desfazer(self):
        self.saldos[self.origem] += self.valor
        self.saldos[self.destino] -= self.valor

@dataclass
class Historico:
    executados: list = field(default_factory=list)

    def executar(self, cmd):
        cmd.executar()
        self.executados.append(cmd)

    def desfazer_ultimo(self):
        if self.executados:
            self.executados.pop().desfazer()
`,
          hint: 'O comando guarda tudo que precisa para executar e desfazer; o histórico é uma pilha (append/pop).',
          explain: 'Empacotar a ação com seus parâmetros em um objeto permite enfileirar, registrar e desfazer; sem a necessidade de undo, uma função com partial bastaria.',
        },
        {
          type: 'tf',
          q: 'Criar uma interface abstrata para uma funcionalidade que tem (e provavelmente terá) uma única implementação é um sinal de over-engineering.',
          answer: true,
          explain: 'Abstração sem variação só adiciona indireção. Introduza-a quando a segunda implementação ou a repetição aparecerem.',
        },
        {
          type: 'mc',
          q: 'A camada de aplicação espera `exportar(linhas) -> str`, mas a biblioteca de terceiros oferece `dump(rows, fp)`. Qual padrão resolve sem alterar nenhuma das duas?',
          options: ['Singleton', 'Observer', 'Adapter', 'Command'],
          answer: 2,
          explain: 'O Adapter é uma classe fina que traduz uma interface na outra, mantendo a incompatibilidade na borda do sistema.',
        },
        {
          type: 'order',
          q: 'Ordene a evolução saudável de um trecho de código até um padrão, do mais simples ao mais estruturado.',
          items: ['if/elif com dois ou três ramos, legível', 'um ramo novo a cada mês: o if cresce e se repete em outra função', 'extrair cada ramo para uma função', 'colocar as funções em um dicionário (Strategy) e remover o if', 'só se o estado ficar complexo, trocar funções por classes com __call__'],
          explain: 'O padrão entra quando a dor (repetição, variação) aparece, não antes. Cada passo é uma refatoração pequena e segura.',
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'py-06-05',
      title: 'Desempenho',
      minutes: 35,
      content: 'content/python/py-06/05-desempenho.md',
      exercises: [
        {
          type: 'mc',
          q: 'Qual a complexidade de `x in colecao` para list e para set, respectivamente?',
          options: ['O(1) e O(1)', 'O(n) e O(1)', 'O(log n) e O(n)', 'O(n) e O(n)'],
          answer: 1,
          explain: 'A lista precisa varrer os elementos; o set usa hash e acha em tempo constante médio. É a otimização mais comum e mais eficaz em scripts de dados.',
        },
        {
          type: 'code',
          q: 'A função `filtrar_pagos(lancamentos, ids_pagos)` deve devolver os lançamentos (dicts com chave `id`) cujo id está em `ids_pagos` (uma lista), preservando a ordem. Implemente-a de forma eficiente, convertendo `ids_pagos` em `set` UMA vez antes do laço.',
          starter: `def filtrar_pagos(lancamentos, ids_pagos):
    pass
`,
          tests: `lancs = [{"id": i, "valor": i * 10} for i in range(20)]
r = filtrar_pagos(lancs, [3, 7, 7, 15, 99])
assert [l["id"] for l in r] == [3, 7, 15], "Deve manter a ordem dos lancamentos e ignorar ids inexistentes"
assert filtrar_pagos(lancs, []) == [], "Sem ids pagos, nada e devolvido"
import inspect
try:
    fonte = inspect.getsource(filtrar_pagos)
except Exception:
    fonte = "set("
assert "set(" in fonte, "Converta ids_pagos em set antes do laco para ter busca O(1)"
grande = [{"id": i} for i in range(200_000)]
ids = list(range(0, 200_000, 2))
assert len(filtrar_pagos(grande, ids)) == 100_000, "Deve funcionar rapido com 200 mil itens"
`,
          solution: `def filtrar_pagos(lancamentos, ids_pagos):
    pagos = set(ids_pagos)
    return [l for l in lancamentos if l["id"] in pagos]
`,
          hint: 'pagos = set(ids_pagos) fora do laço; depois uma list comprehension com "in pagos".',
          explain: 'Com a lista, cada "in" é O(n) e o total vira O(n*m); com o set, cada teste é O(1) e o total O(n+m). Uma linha, ganho de centenas de vezes.',
        },
        {
          type: 'fill',
          q: 'Para memoizar uma função pura com um decorator da biblioteca padrão: `from functools import ___`',
          answer: ['lru_cache', 'cache'],
          explain: 'lru_cache (ou cache, atalho para maxsize=None) guarda os resultados por argumentos hashable e os devolve sem recalcular.',
        },
        {
          type: 'code',
          q: 'Implemente `fib(n)` recursiva (fib(0)=0, fib(1)=1) decorada com `lru_cache` para que `fib(80)` seja calculado instantaneamente.',
          starter: `from functools import lru_cache

def fib(n):
    pass
`,
          tests: `assert fib(0) == 0 and fib(1) == 1 and fib(10) == 55, "Casos base e fib(10)"
assert fib(80) == 23416728348467685, "fib(80) deve ser calculado (so e viavel com cache)"
assert hasattr(fib, "cache_info"), "fib deve estar decorada com lru_cache"
info = fib.cache_info()
assert info.currsize >= 81, "O cache deve guardar os subproblemas"
`,
          solution: `from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    return n if n < 2 else fib(n - 1) + fib(n - 2)
`,
          hint: 'Coloque @lru_cache(maxsize=None) acima do def; a recursão ingênua passa a ser O(n).',
          explain: 'Sem cache, fib recursiva recalcula os mesmos subproblemas exponencialmente; com memoização cada n é calculado uma vez. É programação dinâmica de cima para baixo.',
        },
        {
          type: 'mc',
          q: 'Você implementa uma fila com `lista.pop(0)` e ela ficou lenta com 100 mil itens. O que fazer?',
          options: ['Usar lista.pop() e inverter a lógica', 'Trocar por collections.deque e usar popleft()', 'Converter a lista em set', 'Aumentar o limite de recursão'],
          answer: 1,
          explain: 'pop(0) desloca todos os elementos (O(n)); deque.popleft() é O(1) porque a estrutura foi feita para inserir e remover nas duas pontas.',
        },
        {
          type: 'code',
          q: 'Escreva a função geradora `quadrados(n)` que produz os quadrados de 0 até n-1 um por vez (com `yield`), sem criar lista.',
          starter: `def quadrados(n):
    pass
`,
          tests: `import inspect
assert inspect.isgeneratorfunction(quadrados), "quadrados deve ser uma funcao geradora (use yield)"
assert list(quadrados(5)) == [0, 1, 4, 9, 16], "Deve produzir os quadrados de 0 a n-1"
assert list(quadrados(0)) == [], "n = 0 nao produz nada"
assert sum(quadrados(100_000)) == sum(i * i for i in range(100_000)), "Deve funcionar em streaming para n grande"
`,
          solution: `def quadrados(n):
    for i in range(n):
        yield i * i
`,
          hint: 'for i in range(n): yield i * i.',
          explain: 'Um gerador ocupa memória constante e entrega um item por vez; a lista equivalente ocuparia megabytes para n grande.',
        },
        {
          type: 'match',
          q: 'Relacione a necessidade à estrutura de dados mais adequada.',
          pairs: [['testar pertencimento muitas vezes', 'set'], ['fila: tirar do início', 'deque'], ['contar ocorrências', 'Counter'], ['obter sempre o menor elemento', 'heapq'], ['associar chave a valor', 'dict']],
          explain: 'Cada estrutura é otimizada para um padrão de acesso; escolher a certa costuma valer mais que qualquer micro-otimização.',
        },
        {
          type: 'order',
          q: 'Ordene os passos de uma otimização disciplinada.',
          items: ['escrever o código claro que funciona', 'medir com cProfile e localizar a função que domina o tempo', 'melhorar algoritmo ou estrutura de dados nesse trecho', 'remover trabalho repetido com cache', 'só então considerar NumPy, Cython ou paralelismo', 'medir de novo e comparar'],
          explain: 'Medir antes evita otimizar o lugar errado; estrutura e algoritmo resolvem a maioria dos casos antes de qualquer ferramenta pesada.',
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'py-06-06',
      title: 'Algoritmos clássicos',
      minutes: 35,
      content: 'content/python/py-06/06-algoritmos.md',
      exercises: [
        {
          type: 'code',
          q: 'Implemente `busca_binaria(itens, alvo)` em uma lista ordenada: devolve o índice do alvo ou -1 se não existir. Não use `in` nem `index`.',
          starter: `def busca_binaria(itens, alvo):
    pass
`,
          tests: `faixas = [0, 180000, 360000, 720000, 1800000, 3600000]
assert busca_binaria(faixas, 720000) == 3, "720000 esta no indice 3"
assert busca_binaria(faixas, 0) == 0 and busca_binaria(faixas, 3600000) == 5, "Extremos"
assert busca_binaria(faixas, 100) == -1, "Ausente devolve -1"
assert busca_binaria([], 1) == -1, "Lista vazia devolve -1"
assert busca_binaria([7], 7) == 0 and busca_binaria([7], 8) == -1, "Lista de um elemento"
import inspect
try:
    fonte = inspect.getsource(busca_binaria)
except Exception:
    fonte = ""
assert ".index(" not in fonte, "Nao use list.index"
`,
          solution: `def busca_binaria(itens, alvo):
    esq, dir_ = 0, len(itens) - 1
    while esq <= dir_:
        meio = (esq + dir_) // 2
        if itens[meio] == alvo:
            return meio
        if itens[meio] < alvo:
            esq = meio + 1
        else:
            dir_ = meio - 1
    return -1
`,
          hint: 'Mantenha esq e dir_; meio = (esq + dir_) // 2; mova esq ou dir_ conforme a comparação; pare quando esq > dir_.',
          explain: 'Cada comparação descarta metade do espaço de busca: O(log n). Teste sempre com lista vazia, um elemento e os extremos para pegar erros de limite.',
        },
        {
          type: 'code',
          q: 'Implemente `intercalar(a, b)`, que junta duas listas JÁ ordenadas em uma única lista ordenada em O(n), e `merge_sort(itens)`, que ordena recursivamente dividindo ao meio e usando `intercalar`. Não use `sorted`/`sort`.',
          starter: `def intercalar(a, b):
    pass

def merge_sort(itens):
    pass
`,
          tests: `assert intercalar([1, 4, 9], [2, 3, 10, 11]) == [1, 2, 3, 4, 9, 10, 11], "intercalar deve juntar mantendo a ordem"
assert intercalar([], [1, 2]) == [1, 2] and intercalar([1], []) == [1], "Uma lista vazia"
assert merge_sort([38, 27, 43, 3, 9, 82, 10]) == [3, 9, 10, 27, 38, 43, 82], "merge_sort deve ordenar"
assert merge_sort([]) == [] and merge_sort([5]) == [5], "Casos triviais"
assert merge_sort([2, 2, 1, 1]) == [1, 1, 2, 2], "Repetidos"
import inspect
try:
    fonte = inspect.getsource(merge_sort) + inspect.getsource(intercalar)
except Exception:
    fonte = ""
assert "sorted(" not in fonte and ".sort(" not in fonte, "Implemente o algoritmo, nao use sorted/sort"
`,
          solution: `def intercalar(a, b):
    resultado = []
    i = j = 0
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            resultado.append(a[i]); i += 1
        else:
            resultado.append(b[j]); j += 1
    resultado.extend(a[i:])
    resultado.extend(b[j:])
    return resultado

def merge_sort(itens):
    if len(itens) <= 1:
        return list(itens)
    meio = len(itens) // 2
    return intercalar(merge_sort(itens[:meio]), merge_sort(itens[meio:]))
`,
          hint: 'intercalar: dois índices avançando pelo menor; ao final, anexe o resto. merge_sort: caso-base len <= 1, depois intercalar(merge_sort(esq), merge_sort(dir)).',
          explain: 'Dividir para conquistar: log n níveis de divisão, cada um com n trabalho de intercalação, total O(n log n) garantido e estável.',
        },
        {
          type: 'code',
          q: 'Programação dinâmica: implemente `troco_minimo(moedas, valor)` que devolve o menor número de moedas para formar o valor (moedas ilimitadas), ou -1 se for impossível. `troco_minimo(moedas, 0)` é 0.',
          starter: `def troco_minimo(moedas, valor):
    pass
`,
          tests: `assert troco_minimo([1, 5, 10, 25], 63) == 6, "63 = 25+25+10+1+1+1"
assert troco_minimo([1, 3, 4], 6) == 2, "6 = 3+3 (o guloso daria 4+1+1)"
assert troco_minimo([2], 3) == -1, "Impossivel devolve -1"
assert troco_minimo([1, 5], 0) == 0, "Valor zero: zero moedas"
assert troco_minimo([5, 10, 25, 50, 100], 300) == 3, "300 = 100+100+100"
`,
          solution: `def troco_minimo(moedas, valor):
    INF = float("inf")
    dp = [0] + [INF] * valor
    for v in range(1, valor + 1):
        for m in moedas:
            if m <= v and dp[v - m] + 1 < dp[v]:
                dp[v] = dp[v - m] + 1
    return dp[valor] if dp[valor] != INF else -1
`,
          hint: 'dp[v] = mínimo de moedas para v. Para cada v de 1 a valor, dp[v] = min(dp[v - m] + 1) para cada moeda m <= v.',
          explain: 'A tabela guarda a solução de cada subproblema (valores menores) uma única vez; o algoritmo guloso falha em sistemas de moedas como [1, 3, 4], a PD sempre acha o ótimo.',
        },
        {
          type: 'code',
          q: 'Implemente `bfs(grafo, inicio)` que devolve a ordem de visita em largura a partir de `inicio`. O grafo é um dict `{no: [vizinhos]}`; use `collections.deque` como fila e um conjunto de visitados.',
          starter: `from collections import deque

def bfs(grafo, inicio):
    pass
`,
          tests: `grafo = {
    "Holding": ["Alfa", "Beta"],
    "Alfa": ["Gama"],
    "Beta": ["Gama", "Delta"],
    "Gama": [],
    "Delta": ["Alfa"],
}
assert bfs(grafo, "Holding") == ["Holding", "Alfa", "Beta", "Gama", "Delta"], "Visita por camadas, sem repetir"
assert bfs(grafo, "Gama") == ["Gama"], "No sem vizinhos"
assert bfs(grafo, "Delta") == ["Delta", "Alfa", "Gama"], "A partir de Delta"
ciclo = {"A": ["B"], "B": ["A"]}
assert bfs(ciclo, "A") == ["A", "B"], "Ciclos nao podem gerar loop infinito"
`,
          solution: `from collections import deque

def bfs(grafo, inicio):
    visitados = {inicio}
    fila = deque([inicio])
    ordem = []
    while fila:
        no = fila.popleft()
        ordem.append(no)
        for viz in grafo.get(no, []):
            if viz not in visitados:
                visitados.add(viz)
                fila.append(viz)
    return ordem
`,
          hint: 'Marque como visitado ao ENFILEIRAR (não ao desenfileirar) para não duplicar; popleft() dá a ordem em largura.',
          explain: 'A fila garante que nós mais próximos sejam visitados antes dos mais distantes; o conjunto de visitados evita loops em grafos com ciclo.',
        },
        {
          type: 'mc',
          q: 'Qual a complexidade de tempo do merge sort no pior caso?',
          options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
          answer: 1,
          explain: 'Há log n níveis de divisão e cada nível intercala n elementos. Diferente do quick sort, o merge sort não degrada para O(n²).',
        },
        {
          type: 'fill',
          q: 'Para descobrir em qual faixa de uma tabela progressiva ordenada `faixas` cai um valor, sem escrever a busca binária: `bisect.___(faixas, valor)`',
          answer: ['bisect_right', 'bisect', 'bisect_left'],
          explain: 'As funções do módulo bisect devolvem a posição de inserção em O(log n), que corresponde ao índice da faixa. bisect_right e bisect_left diferem apenas quando o valor coincide com um limite.',
        },
        {
          type: 'tf',
          q: 'O algoritmo guloso (sempre pegar a maior moeda possível) encontra o troco com o mínimo de moedas para qualquer conjunto de moedas.',
          answer: false,
          explain: 'Funciona para o sistema brasileiro, mas falha em geral: com moedas [1, 3, 4] e valor 6, o guloso dá 3 moedas (4+1+1) e o ótimo é 2 (3+3). A programação dinâmica garante o ótimo.',
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'py-06-07',
      title: 'Empacotamento e distribuição',
      minutes: 30,
      content: 'content/python/py-06/07-empacotamento.md',
      exercises: [
        {
          type: 'mc',
          q: 'Qual arquivo centraliza metadados, dependências, entry points e configuração de ferramentas de um projeto Python moderno?',
          options: ['setup.py', 'requirements.txt', 'pyproject.toml', 'MANIFEST.in'],
          answer: 2,
          explain: 'pyproject.toml (PEPs 517/518/621) substitui setup.py, setup.cfg e, para bibliotecas, o requirements.txt.',
        },
        {
          type: 'fill',
          q: 'Para instalar o projeto em modo editável com as dependências de desenvolvimento: `pip install ___ ".[dev]"`',
          answer: ['-e', '--editable'],
          explain: 'O modo editável (-e) aponta a instalação para a pasta do código, então alterações valem imediatamente sem reinstalar.',
        },
        {
          type: 'order',
          q: 'Ordene os passos para publicar uma nova versão de um pacote.',
          items: ['atualizar version no pyproject.toml e o CHANGELOG.md', 'git tag v0.2.0 && git push --tags', 'python -m build', 'python -m twine check dist/*', 'python -m twine upload --repository testpypi dist/*', 'python -m twine upload dist/*'],
          explain: 'Versão e changelog primeiro, tag para marcar o ponto, construir, validar, ensaiar no TestPyPI e só então publicar no PyPI, onde versões são permanentes.',
        },
        {
          type: 'tf',
          q: 'Se uma versão publicada no PyPI saiu com erro, basta corrigir e fazer upload de novo com o mesmo número de versão.',
          answer: false,
          explain: 'Versões no PyPI são imutáveis: você precisa publicar 0.1.1. Por isso o TestPyPI existe, para ensaiar antes.',
        },
        {
          type: 'match',
          q: 'Relacione a mudança ao incremento de versão semântica correto.',
          pairs: [['corrige um bug sem mudar comportamento documentado', 'CORREÇÃO (0.1.0 -> 0.1.1)'], ['adiciona função nova compatível', 'MENOR (0.1.1 -> 0.2.0)'], ['remove uma função pública ou muda sua assinatura', 'MAIOR (0.2.0 -> 1.0.0)']],
          explain: 'SemVer comunica a quem depende do pacote o risco de atualizar: correção é segura, menor adiciona, maior quebra.',
        },
        {
          type: 'mc',
          q: 'O que a seção `[project.scripts] robo-fechamento = "robo_fechamento.cli:main"` faz?',
          options: ['Executa main() durante a instalação', 'Cria o comando de terminal robo-fechamento, que chama a função main do módulo robo_fechamento.cli', 'Define o script de testes', 'Registra o pacote no PyPI'],
          answer: 1,
          explain: 'É o entry point de CLI: ao instalar, o pip gera um executável com esse nome apontando para a função indicada.',
        },
        {
          type: 'fill',
          q: 'Para que o GitHub Actions rode também quando alguém abre um PR, o gatilho precisa incluir `on: push: ... ___:` além de push.',
          answer: ['pull_request'],
          explain: 'Com pull_request, lint e testes rodam antes do merge e a branch main pode exigir CI verde.',
        },
        {
          type: 'mc',
          q: 'Qual a função do `pre-commit` em um projeto?',
          options: ['Publicar o pacote antes de cada commit', 'Rodar verificações (ruff, detecção de chaves privadas, YAML válido) localmente no momento do git commit, recusando commits com problemas', 'Fazer backup do repositório', 'Substituir o GitHub Actions'],
          answer: 1,
          explain: 'pre-commit instala um gancho no .git/hooks que roda as ferramentas configuradas antes do commit; o CI continua existindo como segunda barreira.',
        },
        {
          type: 'tf',
          q: 'Em uma biblioteca publicada no PyPI, é recomendado fixar versões exatas nas dependencies (por exemplo requests==2.31.0).',
          answer: false,
          explain: 'Versões exatas em bibliotecas causam conflitos para quem instala junto com outros pacotes. Use faixas (>=2.31,<3); versões exatas ficam em aplicações, via lock file.',
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'py-06-08',
      title: 'Arquitetura e segurança',
      minutes: 34,
      content: 'content/python/py-06/08-arquitetura-e-seguranca.md',
      exercises: [
        {
          type: 'mc',
          q: 'O que diz o princípio da inversão de dependência (o D de SOLID) aplicado a Python?',
          options: ['Importe sempre do módulo mais baixo', 'A regra de negócio define um Protocol; a infraestrutura o implementa; a aplicação recebe a implementação pronta', 'Toda classe deve herdar de uma ABC', 'Dependências devem ser instaladas em ordem inversa'],
          answer: 1,
          explain: 'Alto nível (domínio) e baixo nível (SQLite, SMTP) dependem de uma abstração definida pelo domínio. Assim o domínio não importa infraestrutura.',
        },
        {
          type: 'code',
          q: 'Validação na borda: `validar_novo_cliente(bruto)` recebe um dict e devolve `{"nome", "cnpj", "regime"}` normalizado (nome sem espaços nas pontas; cnpj só com os 14 dígitos). Lance `ValueError` se o nome não tiver entre 2 e 120 caracteres, se o cnpj (após remover não-dígitos) não tiver exatamente 14 dígitos, ou se o regime não for Simples, Presumido ou Real.',
          starter: `import re

def validar_novo_cliente(bruto):
    pass
`,
          tests: `r = validar_novo_cliente({"nome": " Padaria ", "cnpj": "11.222.333/0001-81", "regime": "Simples"})
assert r == {"nome": "Padaria", "cnpj": "11222333000181", "regime": "Simples"}, "Deve normalizar nome e cnpj"
for ruim in [
    {"nome": "P", "cnpj": "11222333000181", "regime": "Simples"},
    {"nome": "Padaria", "cnpj": "123", "regime": "Simples"},
    {"nome": "Padaria", "cnpj": "11222333000181", "regime": "Lucro"},
    {"cnpj": "11222333000181", "regime": "Real"},
    {"nome": "Padaria", "regime": "Real"},
]:
    try:
        validar_novo_cliente(ruim)
        assert False, f"Deveria lancar ValueError para {ruim}"
    except ValueError:
        pass
`,
          solution: `import re

def validar_novo_cliente(bruto):
    nome = str(bruto.get("nome", "")).strip()
    if not (2 <= len(nome) <= 120):
        raise ValueError("nome deve ter entre 2 e 120 caracteres")
    cnpj = re.sub(r"\\D", "", str(bruto.get("cnpj", "")))
    if len(cnpj) != 14:
        raise ValueError("cnpj deve ter 14 dígitos")
    regime = bruto.get("regime")
    if regime not in {"Simples", "Presumido", "Real"}:
        raise ValueError("regime inválido")
    return {"nome": nome, "cnpj": cnpj, "regime": regime}
`,
          hint: 'Use .get com padrão, .strip(), re.sub(r"\\D", "", ...) para limpar o cnpj e um conjunto de regimes válidos.',
          explain: 'A função transforma um dict hostil em dados confiáveis e normalizados; a partir daí o resto do sistema não precisa revalidar. Validar na borda, confiar dentro.',
        },
        {
          type: 'code',
          q: 'Implemente `gerar_hash_senha(senha)` que gera um sal aleatório de 16 bytes com `secrets`, faz o "alongamento" da senha aplicando `hmac.new(sal, dado, "sha256").digest()` repetidamente por `ITERACOES` vezes (o dado inicial é `senha.encode()`; a cada volta o dado passa a ser o resultado anterior) e devolve `"<sal_hex>:<hash_hex>"`; e `verificar_senha(senha, armazenado)` que recalcula e compara com `hmac.compare_digest`. (Em produção use `hashlib.pbkdf2_hmac` ou argon2 — o Python do navegador não tem pbkdf2, por isso implementamos o alongamento à mão.)',
          starter: `import hashlib
import hmac
import secrets

ITERACOES = 10_000

def alongar(senha, sal):
    """Aplica hmac-sha256 ITERACOES vezes e devolve bytes."""
    pass

def gerar_hash_senha(senha):
    pass

def verificar_senha(senha, armazenado):
    pass
`,
          tests: `h = gerar_hash_senha("Troque-me-123")
assert isinstance(h, str) and h.count(":") == 1, "Formato deve ser sal_hex:hash_hex"
sal, hsh = h.split(":")
assert len(sal) == 32 and len(hsh) == 64, "Sal de 16 bytes (32 hex) e sha256 (64 hex)"
assert verificar_senha("Troque-me-123", h) is True, "Senha correta deve verificar"
assert verificar_senha("errada", h) is False, "Senha errada nao verifica"
h2 = gerar_hash_senha("Troque-me-123")
assert h2 != h, "Sal aleatorio: a mesma senha gera hashes diferentes"
assert verificar_senha("Troque-me-123", h2) is True, "O segundo hash tambem verifica"
`,
          solution: `import hashlib
import hmac
import secrets

ITERACOES = 10_000

def alongar(senha, sal):
    dado = senha.encode()
    for _ in range(ITERACOES):
        dado = hmac.new(sal, dado, "sha256").digest()
    return dado

def gerar_hash_senha(senha):
    sal = secrets.token_bytes(16)
    return sal.hex() + ":" + alongar(senha, sal).hex()

def verificar_senha(senha, armazenado):
    sal_hex, hash_hex = armazenado.split(":")
    novo = alongar(senha, bytes.fromhex(sal_hex))
    return hmac.compare_digest(novo.hex(), hash_hex)
`,
          hint: 'secrets.token_bytes(16) para o sal; em alongar, um for de ITERACOES voltas trocando dado por hmac.new(sal, dado, "sha256").digest(); .hex() e bytes.fromhex() convertem.',
          explain: 'Hash lento com sal aleatório torna força bruta cara e impede que senhas iguais gerem o mesmo hash; compare_digest evita ataques de temporização.',
        },
        {
          type: 'fill',
          q: 'Para comparar dois hashes em tempo constante, evitando ataques de temporização: `hmac.___(a, b)`',
          answer: ['compare_digest'],
          explain: 'Comparar com == para na primeira diferença, e o tempo de resposta vaza informação. compare_digest sempre leva o mesmo tempo.',
        },
        {
          type: 'mc',
          q: 'Por que `pickle.load` em dados recebidos de uma fonte externa é perigoso?',
          options: ['Porque é lento', 'Porque desserializar um pickle pode executar código arbitrário definido por quem o criou', 'Porque pickle não suporta dicionários', 'Porque o arquivo fica grande'],
          answer: 1,
          explain: 'O formato pickle inclui instruções para reconstruir objetos, inclusive chamar funções. Para dados externos, use JSON.',
        },
        {
          type: 'code',
          q: 'Escreva `parsear_dotenv(texto)` que recebe o conteúdo de um arquivo .env e devolve um dict. Ignore linhas vazias, linhas começando com `#` e linhas sem `=`. Divida na PRIMEIRA ocorrência de `=`; remova espaços das pontas da chave e do valor e aspas simples ou duplas que envolvam o valor.',
          starter: `def parsear_dotenv(texto):
    pass
`,
          tests: `texto = """
# configuracao
ROBO_API_URL=https://api.x.com/v1
ROBO_API_TOKEN = "abc=123"
SENHA='s3nh@'
LINHA_INVALIDA

VAZIO=
"""
r = parsear_dotenv(texto)
assert r == {"ROBO_API_URL": "https://api.x.com/v1", "ROBO_API_TOKEN": "abc=123", "SENHA": "s3nh@", "VAZIO": ""}, "Deve ignorar comentarios e linhas invalidas, dividir no primeiro = e tirar aspas"
assert parsear_dotenv("") == {}, "Texto vazio devolve dict vazio"
`,
          solution: `def parsear_dotenv(texto):
    resultado = {}
    for linha in texto.splitlines():
        linha = linha.strip()
        if not linha or linha.startswith("#") or "=" not in linha:
            continue
        chave, _, valor = linha.partition("=")
        valor = valor.strip()
        if len(valor) >= 2 and valor[0] == valor[-1] and valor[0] in "\\"'":
            valor = valor[1:-1]
        resultado[chave.strip()] = valor
    return resultado
`,
          hint: 'str.partition("=") divide na primeira ocorrência; confira se o valor começa e termina com a mesma aspa antes de removê-la.',
          explain: 'Ler segredos de um .env (fora do Git) para variáveis de ambiente é o padrão; a função é pura e testável porque recebe o texto, não o caminho do arquivo.',
        },
        {
          type: 'match',
          q: 'Relacione o risco do OWASP à defesa em Python.',
          pairs: [['Injeção', 'parâmetros ? no SQL, sem shell=True, sem eval'], ['Falhas criptográficas', 'pbkdf2_hmac/argon2 e secrets, segredos em variáveis de ambiente'], ['Desserialização insegura', 'JSON em vez de pickle; yaml.SafeLoader'], ['Componentes vulneráveis', 'pip-audit e dependências atualizadas']],
          explain: 'Cada categoria do Top 10 tem contramedidas concretas na biblioteca padrão e nas práticas de projeto.',
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'py-06-09',
      title: 'Projeto final: escrituração simplificada',
      minutes: 35,
      content: 'content/python/py-06/09-capstone-escrituracao.md',
      exercises: [
        {
          type: 'code',
          q: 'Implemente o núcleo do domínio: a dataclass imutável `Partida(conta: str, valor_centavos: int, tipo: str)` que lança `ValueError` se tipo não for "D" ou "C" ou se o valor não for positivo; e `Lancamento(id: int, data: date, historico: str, partidas: tuple)` que lança `ValueError` se não houver ao menos um débito e um crédito ou se a soma dos débitos for diferente da soma dos créditos.',
          starter: `from dataclasses import dataclass
from datetime import date

@dataclass(frozen=True)
class Partida:
    conta: str
    valor_centavos: int
    tipo: str

@dataclass(frozen=True)
class Lancamento:
    id: int
    data: date
    historico: str
    partidas: tuple
`,
          tests: `from datetime import date
l = Lancamento(1, date(2026, 3, 1), "Venda", (Partida("1.1", 15000, "D"), Partida("3.1", 15000, "C")))
assert l.partidas[0].conta == "1.1", "Lancamento balanceado deve ser criado"
l2 = Lancamento(2, date(2026, 3, 2), "Compra", (Partida("1.3", 7000, "D"), Partida("1.1", 5000, "C"), Partida("2.1", 2000, "C")))
assert len(l2.partidas) == 3, "Varias partidas que fecham"
def espera_erro(f, msg):
    try:
        f()
        assert False, msg
    except ValueError:
        pass
espera_erro(lambda: Partida("1.1", 0, "D"), "valor zero deveria falhar")
espera_erro(lambda: Partida("1.1", -5, "C"), "valor negativo deveria falhar")
espera_erro(lambda: Partida("1.1", 10, "X"), "tipo invalido deveria falhar")
espera_erro(lambda: Lancamento(3, date(2026, 3, 3), "x", (Partida("1.1", 100, "D"), Partida("3.1", 90, "C"))), "partidas que nao fecham deveriam falhar")
espera_erro(lambda: Lancamento(4, date(2026, 3, 3), "x", (Partida("1.1", 100, "D"), Partida("1.2", 100, "D"))), "so debitos deveria falhar")
try:
    l.historico = "outro"
    assert False, "A dataclass deve ser frozen"
except AttributeError:
    pass
`,
          solution: `from dataclasses import dataclass
from datetime import date

@dataclass(frozen=True)
class Partida:
    conta: str
    valor_centavos: int
    tipo: str

    def __post_init__(self):
        if self.tipo not in ("D", "C"):
            raise ValueError(f"tipo inválido: {self.tipo}")
        if self.valor_centavos <= 0:
            raise ValueError("valor deve ser positivo")

@dataclass(frozen=True)
class Lancamento:
    id: int
    data: date
    historico: str
    partidas: tuple

    def __post_init__(self):
        debitos = sum(p.valor_centavos for p in self.partidas if p.tipo == "D")
        creditos = sum(p.valor_centavos for p in self.partidas if p.tipo == "C")
        if debitos == 0 or creditos == 0:
            raise ValueError("lançamento precisa de ao menos um débito e um crédito")
        if debitos != creditos:
            raise ValueError(f"partidas não fecham: D={debitos} C={creditos}")
`,
          hint: 'Use __post_init__ nas duas dataclasses para validar; some débitos e créditos com generator expressions.',
          explain: 'Invariantes no construtor tornam estados inválidos irrepresentáveis: nenhuma outra camada precisa conferir se o lançamento fecha, porque um lançamento que não fecha não existe.',
        },
        {
          type: 'code',
          q: 'Implemente `saldo(natureza, partidas)`: `natureza` é "D" (devedora) ou "C" (credora) e `partidas` é uma lista de tuplas `(tipo, valor_centavos)`. Para conta devedora, saldo = débitos - créditos; para credora, créditos - débitos. Natureza inválida lança `ValueError`.',
          starter: `def saldo(natureza, partidas):
    pass
`,
          tests: `movs = [("D", 10000), ("C", 3000), ("D", 500)]
assert saldo("D", movs) == 7500, "Devedora: debitos - creditos"
assert saldo("C", movs) == -7500, "Credora: creditos - debitos"
assert saldo("D", []) == 0, "Sem movimento, saldo zero"
assert saldo("C", [("C", 20000), ("D", 5000)]) == 15000, "Credora com saldo positivo"
try:
    saldo("X", movs)
    assert False, "Natureza invalida deveria lancar ValueError"
except ValueError:
    pass
`,
          solution: `def saldo(natureza, partidas):
    if natureza not in ("D", "C"):
        raise ValueError(f"natureza inválida: {natureza}")
    debitos = sum(v for t, v in partidas if t == "D")
    creditos = sum(v for t, v in partidas if t == "C")
    return debitos - creditos if natureza == "D" else creditos - debitos
`,
          hint: 'Some débitos e créditos separadamente e inverta o sinal conforme a natureza.',
          explain: 'Regra contábil pura em centavos: a mesma função alimenta o balancete, o razão e os testes, sem depender de banco.',
        },
        {
          type: 'code',
          q: 'Importação CSV: `validar_linha_csv(campos, numero)` recebe a lista `[data, historico, conta, tipo, valor]` (strings) e o número da linha. Devolva `{"data": date, "historico", "conta", "tipo", "valor_centavos"}`, aceitando valor com ponto ou vírgula decimal. Qualquer problema (quantidade de campos diferente de 5, data inválida, tipo diferente de D/C, valor não numérico ou não positivo) lança `ValueError` cuja mensagem começa com `"linha <numero>: "`.',
          starter: `from datetime import date

def validar_linha_csv(campos, numero):
    pass
`,
          tests: `from datetime import date
r = validar_linha_csv(["2026-03-05", "Venda", "1.1.01", "D", "1500,00"], 2)
assert r == {"data": date(2026, 3, 5), "historico": "Venda", "conta": "1.1.01", "tipo": "D", "valor_centavos": 150000}, "Virgula decimal deve ser aceita"
r2 = validar_linha_csv(["2026-03-05", "Venda", "3.1.01", "C", "1500.5"], 3)
assert r2["valor_centavos"] == 150050 and r2["tipo"] == "C", "Ponto decimal tambem"
def espera(campos, numero):
    try:
        validar_linha_csv(campos, numero)
        assert False, f"Deveria falhar: {campos}"
    except ValueError as e:
        assert str(e).startswith(f"linha {numero}: "), f"Mensagem deve comecar com 'linha {numero}: ', veio {e!r}"
espera(["2026-03-05", "Venda", "1.1", "D"], 4)
espera(["05/03/2026", "Venda", "1.1", "D", "10"], 5)
espera(["2026-03-05", "Venda", "1.1", "X", "10"], 6)
espera(["2026-03-05", "Venda", "1.1", "D", "abc"], 7)
espera(["2026-03-05", "Venda", "1.1", "D", "0"], 8)
`,
          solution: `from datetime import date

def validar_linha_csv(campos, numero):
    prefixo = f"linha {numero}: "
    if len(campos) != 5:
        raise ValueError(prefixo + f"esperados 5 campos, vieram {len(campos)}")
    data_txt, historico, conta, tipo, valor_txt = [c.strip() for c in campos]
    try:
        data = date.fromisoformat(data_txt)
    except ValueError:
        raise ValueError(prefixo + f"data inválida: {data_txt}") from None
    if tipo not in ("D", "C"):
        raise ValueError(prefixo + f"tipo inválido: {tipo}")
    try:
        valor = round(float(valor_txt.replace(",", ".")) * 100)
    except ValueError:
        raise ValueError(prefixo + f"valor inválido: {valor_txt}") from None
    if valor <= 0:
        raise ValueError(prefixo + "valor deve ser positivo")
    return {"data": data, "historico": historico, "conta": conta, "tipo": tipo, "valor_centavos": valor}
`,
          hint: 'Monte o prefixo "linha N: " uma vez; use date.fromisoformat, replace(",", ".") antes de float e round(x * 100).',
          explain: 'Na importação, o número da linha na mensagem é o que permite ao usuário corrigir o arquivo; validar e converter para centavos na borda mantém o domínio limpo.',
        },
        {
          type: 'mc',
          q: 'Onde deve ficar a regra "débitos têm de ser iguais a créditos"?',
          options: ['Na CLI, ao ler os argumentos', 'No repositório SQLite, como CHECK', 'No construtor de Lancamento (domínio), para que lançamentos inválidos não existam', 'No template do relatório'],
          answer: 2,
          explain: 'Se a regra estiver só na CLI, a futura API HTTP a ignoraria. No domínio, todo caminho (CLI, API, importação) passa por ela obrigatoriamente.',
        },
        {
          type: 'tf',
          q: 'Uma fixture do pytest parametrizada com `params=["memoria", "sqlite"]` faz os mesmos testes rodarem nas duas implementações do repositório, verificando que elas respeitam o mesmo contrato.',
          answer: true,
          explain: 'É o princípio de substituição de Liskov testado na prática: se um repositório passa e o outro falha, o Protocol foi violado.',
        },
        {
          type: 'fill',
          q: 'Para que as entidades do domínio sejam imutáveis e hashable: `@dataclass(___=True)`',
          answer: ['frozen'],
          explain: 'frozen=True impede atribuição após a criação e gera __hash__ coerente com __eq__, permitindo usar as entidades em sets e como chaves.',
        },
        {
          type: 'order',
          q: 'Ordene o roteiro sugerido para construir o capstone.',
          items: ['domínio com testes (sem persistência)', 'RepositorioMemoria e casos de uso da aplicação', 'CLI com argparse e main(argv)', 'RepositorioSQLite passando na mesma bateria parametrizada', 'empacotamento, CI e pre-commit', 'importação CSV e razão'],
          explain: 'Domínio primeiro garante que as regras estão certas antes de qualquer infraestrutura; a bateria compartilhada valida o SQLite; engenharia entra quando o núcleo está estável.',
        },
        {
          type: 'mc',
          q: 'Como a CLI do capstone deve descobrir o caminho do banco SQLite?',
          options: ['Hardcoded como C:\\escrita.db', 'Pela variável de ambiente ESCRITA_DB, com padrão escrita.db se ausente', 'Perguntando com input() a cada comando', 'Lendo de um pickle na pasta do usuário'],
          answer: 1,
          explain: 'Configuração por ambiente permite trocar o banco entre desenvolvimento, teste e produção sem alterar código, e um padrão sensato mantém o uso simples.',
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
        q: 'Por que `def f(x, acumulador=[])` é um bug em potencial?',
        options: ['Listas não podem ser padrão', 'O padrão é criado uma única vez e compartilhado entre todas as chamadas', 'O Python copia a lista a cada chamada, o que é lento', 'acumulador vira variável global'],
        answer: 1,
        explain: 'Valores padrão são avaliados na definição da função. Use None e crie a lista dentro.',
      },
      {
        type: 'tf',
        q: 'Um descritor com `__set__` definido como atributo de classe tem prioridade sobre o `__dict__` da instância na busca de atributos.',
        answer: true,
        explain: 'Descritores de dados vencem o dicionário da instância; é assim que property e descritores de validação interceptam atribuições.',
      },
      {
        type: 'fill',
        q: 'Para reagir à criação de subclasses sem metaclasse, defina na base o método `def ___(cls, **kwargs):`',
        answer: ['__init_subclass__'],
        explain: '__init_subclass__ é chamado automaticamente para cada subclasse e resolve registro e validação de plugins.',
      },
      {
        type: 'code',
        q: 'Implemente a classe-base `Relatorio` com um `__init_subclass__` que lança `TypeError` se a subclasse não definir o atributo `titulo` e, caso contrário, acrescenta a subclasse à lista de classe `Relatorio.registrados`. Chame `super().__init_subclass__(**kwargs)`.',
        starter: `class Relatorio:
    registrados = []
`,
        tests: `class Balancete(Relatorio):
    titulo = "Balancete"

assert Relatorio.registrados == [Balancete], "Subclasse com titulo deve ser registrada"
try:
    class SemTitulo(Relatorio):
        pass
    assert False, "Subclasse sem titulo deveria lancar TypeError"
except TypeError:
    pass
assert Relatorio.registrados == [Balancete], "Subclasse invalida nao pode ser registrada"
`,
        solution: `class Relatorio:
    registrados = []

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        if not hasattr(cls, "titulo"):
            raise TypeError(f"{cls.__name__} precisa definir titulo")
        Relatorio.registrados.append(cls)
`,
        hint: '__init_subclass__(cls, **kwargs) roda ao definir cada subclasse; confira hasattr(cls, "titulo") antes de registrar.',
        explain: 'Validar e registrar subclasses no momento em que são definidas faz o erro aparecer na importação, sem metaclasse.',
      },
      {
        type: 'mc',
        q: 'Em um gerador decorado com `@contextmanager`, por que o `yield` deve ficar dentro de `try/finally`?',
        options: ['Para o gerador poder ser reutilizado', 'Porque sem isso o código depois do yield não roda se o bloco with lançar exceção, e o recurso vaza', 'Porque yield exige try sintaticamente', 'Para melhorar o desempenho'],
        answer: 1,
        explain: 'A exceção do bloco é lançada no ponto do yield; o finally garante a limpeza em qualquer caso.',
      },
      {
        type: 'tf',
        q: 'Com `typing.Protocol`, uma classe é aceita onde o protocolo é esperado desde que tenha os métodos com o formato certo, mesmo sem herdar do Protocol.',
        answer: true,
        explain: 'Tipagem estrutural (duck typing verificável): o contrato é a forma, não a herança.',
      },
      {
        type: 'mc',
        q: 'Qual a forma idiomática de implementar o padrão Strategy em Python para escolher a regra de imposto por regime?',
        options: ['Uma hierarquia de classes abstratas com um método calcular cada', 'Um dicionário mapeando o nome do regime a uma função', 'Uma metaclasse que escolhe a implementação', 'Um if/elif dentro de cada função que usa a regra'],
        answer: 1,
        explain: 'Funções são valores de primeira classe; o dicionário torna a extensão uma linha nova sem alterar a função que usa a estratégia.',
      },
      {
        type: 'mc',
        q: 'Um script faz `if id in lista_de_ids` dentro de um laço sobre 100 mil lançamentos e demora minutos. Qual a correção mais eficaz?',
        options: ['Usar ProcessPoolExecutor', 'Converter lista_de_ids em set antes do laço', 'Reescrever em Cython', 'Ordenar a lista'],
        answer: 1,
        explain: 'O teste de pertencimento passa de O(n) para O(1); o laço inteiro cai de O(n*m) para O(n). É estrutura de dados, não paralelismo.',
      },
      {
        type: 'code',
        q: 'Implemente `insertion_sort(itens)` que devolve uma NOVA lista ordenada crescente, sem alterar a original e sem usar `sorted`/`sort`.',
        starter: `def insertion_sort(itens):
    pass
`,
        tests: `orig = [5, 1, 4, 2, 8]
assert insertion_sort(orig) == [1, 2, 4, 5, 8], "Deve ordenar crescente"
assert orig == [5, 1, 4, 2, 8], "Nao altere a lista original"
assert insertion_sort([]) == [] and insertion_sort([1]) == [1], "Casos triviais"
assert insertion_sort([3, 3, 1, 3]) == [1, 3, 3, 3], "Repetidos"
import inspect
try:
    fonte = inspect.getsource(insertion_sort)
except Exception:
    fonte = ""
assert "sorted(" not in fonte and ".sort(" not in fonte, "Implemente o algoritmo, nao use sorted/sort"
`,
        solution: `def insertion_sort(itens):
    a = list(itens)
    for i in range(1, len(a)):
        chave = a[i]
        j = i - 1
        while j >= 0 and a[j] > chave:
            a[j + 1] = a[j]
            j -= 1
        a[j + 1] = chave
    return a
`,
        hint: 'Copie a lista; para cada posição i, desloque para a direita os elementos maiores que a[i] e insira a[i] no buraco.',
        explain: 'Insertion sort é O(n²), mas quase O(n) em listas já quase ordenadas; por isso o Timsort do Python o usa em trechos pequenos.',
      },
      {
        type: 'fill',
        q: 'Busca em largura (BFS) usa uma fila; a estrutura da biblioteca padrão com popleft() em O(1) é `collections.___`',
        answer: ['deque'],
        explain: 'deque é otimizada para inserir e remover nas duas pontas; list.pop(0) seria O(n).',
      },
      {
        type: 'mc',
        q: 'Qual seção do pyproject.toml cria um comando de terminal que chama uma função do pacote?',
        options: ['[build-system]', '[project.scripts]', '[tool.ruff]', '[project.urls]'],
        answer: 1,
        explain: '[project.scripts] define entry points de CLI: nome-do-comando = "modulo:funcao".',
      },
      {
        type: 'order',
        q: 'Ordene os passos de uma publicação segura no PyPI.',
        items: ['atualizar versão e CHANGELOG', 'python -m build', 'twine check dist/*', 'upload no TestPyPI e teste de instalação', 'upload no PyPI'],
        explain: 'Versões no PyPI são permanentes; ensaie no TestPyPI antes.',
      },
      {
        type: 'mc',
        q: 'Qual combinação é correta para armazenar senhas?',
        options: ['md5 da senha', 'sha256 da senha sem sal', 'pbkdf2_hmac (ou argon2) com sal aleatório de secrets e comparação com hmac.compare_digest', 'A senha criptografada com uma chave guardada no código'],
        answer: 2,
        explain: 'Hash lento com sal aleatório resiste a força bruta e a tabelas arco-íris; compare_digest evita ataques de temporização.',
      },
      {
        type: 'tf',
        q: 'É seguro usar `eval()` para calcular uma fórmula digitada pelo usuário desde que o resultado seja convertido para float.',
        answer: false,
        explain: 'eval executa qualquer código Python; a conversão posterior não impede a execução. Use ast.literal_eval ou um parser próprio.',
      },
      {
        type: 'code',
        q: 'Escreva `eh_balanceado(partidas)` que recebe uma lista de tuplas `(tipo, valor_centavos)` e devolve True se a soma dos débitos ("D") for igual à soma dos créditos ("C") e houver pelo menos um de cada; caso contrário False.',
        starter: `def eh_balanceado(partidas):
    pass
`,
        tests: `assert eh_balanceado([("D", 100), ("C", 100)]) is True, "Fecha"
assert eh_balanceado([("D", 70), ("D", 30), ("C", 100)]) is True, "Varios debitos"
assert eh_balanceado([("D", 100), ("C", 90)]) is False, "Nao fecha"
assert eh_balanceado([("D", 100), ("D", 100)]) is False, "Sem credito"
assert eh_balanceado([]) is False, "Vazio nao e balanceado"
`,
        solution: `def eh_balanceado(partidas):
    debitos = sum(v for t, v in partidas if t == "D")
    creditos = sum(v for t, v in partidas if t == "C")
    return debitos > 0 and creditos > 0 and debitos == creditos
`,
        hint: 'Some os dois lados e confira que ambos são maiores que zero e iguais.',
        explain: 'É a invariante central da escrituração por partidas dobradas, que no capstone vive no construtor de Lancamento.',
      },
    ],
  },
});
