# Metaclasses e a criação de classes

Nesta lição você vai entender como o Python cria classes: o que `type()` faz com três argumentos, o que é uma metaclasse, como `__init_subclass__` resolve a maioria dos casos sem metaclasse alguma, para que serve `__class_getitem__` e, acima de tudo, quando **não** usar nada disso. O exemplo guia é um registro automático de plugins, o uso mais legítimo e frequente dessas técnicas em código real.

## Classes também são objetos

Na lição anterior você viu que `type(int)` é `type`. Isso significa que classes são **instâncias de `type`**, e `type` é a **metaclasse** padrão: a classe cujas instâncias são classes. Assim como `Conta("Ana", 100)` cria uma conta, `type("Conta", bases, atributos)` cria uma classe.

```python
def depositar(self, valor):
    self.saldo += valor

Conta = type("Conta", (object,), {
    "taxa": 0.01,
    "__init__": lambda self, saldo=0: setattr(self, "saldo", saldo),
    "depositar": depositar,
})

c = Conta(100)
c.depositar(50)
print(c.saldo, Conta.__name__, type(Conta))   # 150 Conta <class 'type'>
```

A instrução `class Conta: ...` é açúcar sintático para exatamente isso: o Python executa o corpo da classe em um namespace temporário, coleta o dicionário resultante e chama `type(nome, bases, namespace)`. Entender isso desmistifica tudo o que vem a seguir.

## O que é uma metaclasse

Uma metaclasse é uma subclasse de `type` que você indica com `metaclass=` na definição da classe. O Python chama **ela** em vez de `type` para construir a classe, e você ganha um gancho para inspecionar ou alterar a classe no momento em que ela nasce.

```python
class RegistroMeta(type):
    plugins = {}

    def __new__(mcs, nome, bases, namespace):
        cls = super().__new__(mcs, nome, bases, namespace)
        if bases:                        # não registra a classe-base abstrata
            chave = namespace.get("codigo", nome.lower())
            RegistroMeta.plugins[chave] = cls
        return cls

class Exportador(metaclass=RegistroMeta):
    def exportar(self, dados): raise NotImplementedError

class ExportadorCSV(Exportador):
    codigo = "csv"
    def exportar(self, dados): return "a;b;c"

class ExportadorJSON(Exportador):
    codigo = "json"
    def exportar(self, dados): return '{"a": 1}'

print(RegistroMeta.plugins)
# {'csv': <class '__main__.ExportadorCSV'>, 'json': <class '__main__.ExportadorJSON'>}
print(RegistroMeta.plugins["csv"]().exportar(None))   # a;b;c
```

Repare: ninguém chamou "registrar". Só definir a subclasse já a colocou no dicionário. Esse é o padrão **registro de plugins**: um módulo principal define a base, outros módulos definem implementações, e o sistema as descobre sozinho. Frameworks como Django (modelos), SQLAlchemy e `enum.Enum` usam metaclasses para esse tipo de trabalho.

### Como a metaclasse é escolhida

O Python usa a metaclasse declarada explicitamente ou, se não houver, a mais derivada entre as metaclasses das bases. Isso tem uma consequência prática: se você herda de duas classes com metaclasses diferentes e incompatíveis, recebe `TypeError: metaclass conflict`. É uma das razões para preferir alternativas mais simples.

## `__init_subclass__`: o mesmo resultado, sem metaclasse

Desde o Python 3.6, uma classe-base pode definir `__init_subclass__`, um método de classe chamado automaticamente **toda vez que alguém a subclassifica**. Ele cobre 90% dos casos de uso de metaclasses com um décimo da complexidade.

```python
class Exportador:
    plugins = {}

    def __init_subclass__(cls, codigo=None, **kwargs):
        super().__init_subclass__(**kwargs)
        cls.codigo = codigo or cls.__name__.lower()
        Exportador.plugins[cls.codigo] = cls

    def exportar(self, dados): raise NotImplementedError

class ExportadorCSV(Exportador, codigo="csv"):
    def exportar(self, dados): return ";".join(dados)

class ExportadorXLSX(Exportador):            # sem codigo: usa o nome
    def exportar(self, dados): return "binário"

print(Exportador.plugins)
# {'csv': <class '__main__.ExportadorCSV'>, 'exportadorxlsx': <class '__main__.ExportadorXLSX'>}

def exportar(formato, dados):
    try:
        return Exportador.plugins[formato]().exportar(dados)
    except KeyError:
        raise ValueError(f"formato desconhecido: {formato}") from None

print(exportar("csv", ["a", "b"]))   # a;b
```

Vantagens sobre a metaclasse: é só um método, não há conflito de metaclasses, aceita **argumentos de palavra-chave na declaração da classe** (`codigo="csv"`), e qualquer leitor entende o que acontece. Sempre que sua necessidade for "fazer algo quando uma subclasse é criada" (registrar, validar atributos obrigatórios, injetar métodos), comece por `__init_subclass__`.

Um uso complementar é **validar** a subclasse:

```python
class Relatorio:
    campos_obrigatorios = ("titulo", "gerar")

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        faltando = [c for c in cls.campos_obrigatorios if not hasattr(cls, c)]
        if faltando:
            raise TypeError(f"{cls.__name__} precisa definir: {', '.join(faltando)}")

class Balancete(Relatorio):   # esqueceu gerar(): a própria definição da classe falha
    titulo = "Balancete"
# TypeError: Balancete precisa definir: gerar
```

O erro aparece **na importação**, não quando alguém tenta usar a classe em produção. Falhar cedo é o objetivo.

## `__class_getitem__`: a sintaxe `Classe[...]`

Quando você escreve `list[int]` ou `dict[str, float]`, o Python chama `list.__class_getitem__(int)`. É um método de classe que recebe o que está entre colchetes e devolve algo, geralmente um alias genérico para type hints. Você pode implementá-lo para dar à sua classe a mesma sintaxe:

```python
class Lote:
    def __class_getitem__(cls, item):
        return f"{cls.__name__}[{getattr(item, '__name__', item)}]"

print(Lote[int])        # Lote[int]
print(Lote["Nota"])     # Lote[Nota]
```

Na prática, você quase nunca escreve isso à mão: herdar de `typing.Generic[T]` já o fornece. Mas saber que `Classe[...]` é só uma chamada de método ajuda a ler bibliotecas de tipagem e ORMs sem achar que há sintaxe especial.

## Quando usar (e quando não)

A regra de Tim Peters, membro histórico do núcleo do Python, é famosa: se você se pergunta se precisa de metaclasses, não precisa. Em ordem de preferência:

| Necessidade | Ferramenta |
|---|---|
| Alterar/validar um atributo | `property` ou descritor |
| Alterar uma função ou classe específica | decorator |
| Reagir à criação de subclasses | `__init_subclass__` |
| Gerar classes dinamicamente a partir de dados | `type(nome, bases, ns)` ou `dataclasses.make_dataclass` |
| Alterar a **sintaxe** de definição da classe ou o namespace antes do corpo rodar (`__prepare__`) | metaclasse |

Metaclasses se justificam quando você constrói um **framework** que precisa interceptar a definição da classe em um nível que nenhuma das alternativas alcança: ORMs que transformam atributos de classe em colunas, `Enum`, sistemas de serialização que precisam de ordem dos campos (hoje resolvido pelo fato de dicts serem ordenados). Para código de aplicação (um robô de fechamento, uma API de escritório) elas são quase sempre over-engineering: tornam o código difícil de ler, de depurar e de combinar com outras bibliotecas.

> **Dica:** um decorator de classe registra plugins tão bem quanto `__init_subclass__` e torna o registro **explícito** no ponto de uso: `@registrar("csv")` acima da classe. Quando a descoberta automática não for requisito, prefira o explícito.

```python
PLUGINS = {}

def registrar(codigo):
    def decorator(cls):
        PLUGINS[codigo] = cls
        return cls
    return decorator

@registrar("csv")
class ExportadorCSV:
    def exportar(self, dados): return ";".join(dados)

print(PLUGINS)   # {'csv': <class '__main__.ExportadorCSV'>}
```

## Armadilhas comuns

- **Metaclass conflict** ao combinar bases com metaclasses diferentes. Sinal de que `__init_subclass__` seria melhor.
- **Esquecer `super().__init_subclass__(**kwargs)`**: quebra a cooperação com outras bases que também usam o gancho.
- **Registrar a classe-base** junto com as subclasses. Filtre por `bases` ou pela presença de um atributo.
- **Efeitos colaterais na importação**: registros automáticos só acontecem se o módulo for importado. Se o plugin "sumiu", provavelmente ninguém importou o arquivo dele.
- **Mutar o namespace** em `__new__` da metaclasse sem necessidade: dificulta a leitura e ferramentas de análise estática.

## Na prática

O caso real mais comum é um sistema que precisa **importar arquivos de vários formatos** (CSV do banco A, OFX do banco B, XLSX do sistema de folha): cada formato vira uma subclasse de `Importador` registrada por `__init_subclass__` ou por `@registrar("ofx")`, e o comando `importar extrato.ofx` escolhe a classe pela extensão sem nenhum `if`. Acrescentar o banco C é criar um arquivo novo. Metaclasses você vai encontrar lendo Django, SQLAlchemy ou `Enum`; agora sabe o que elas estão fazendo.

## Resumo

- `class X: ...` equivale a `type("X", bases, namespace)`; classes são instâncias de `type`, a metaclasse padrão.
- Uma metaclasse (subclasse de `type` com `__new__`) intercepta a criação da classe; serve para frameworks, não para código de aplicação.
- `__init_subclass__` reage à criação de subclasses sem metaclasse, aceita argumentos na declaração e resolve registro e validação de plugins.
- `__class_getitem__` é o que faz `Classe[...]` funcionar; normalmente vem de `typing.Generic`.
- Prefira, nesta ordem: property/descritor, decorator, `__init_subclass__`, `type()` dinâmico e, só em último caso, metaclasse.
