# Padrões de projeto em Python idiomático

Nesta lição você vai conhecer os padrões de projeto mais úteis no dia a dia (Strategy, Factory, Singleton, Observer, Command e Adapter) e, principalmente, ver como o Python os simplifica: muitos padrões que em Java exigem três classes e uma interface viram uma função ou um dicionário aqui. Você também vai aprender a reconhecer o momento em que um padrão deixa de resolver um problema e passa a ser **over-engineering**.

## Por que padrões, e por que com cuidado

Padrões de projeto são soluções nomeadas para problemas recorrentes de organização de código. O valor deles está no **vocabulário**: dizer "isso é um Strategy" comunica a intenção em uma palavra. O perigo está em aplicá-los por reflexo. O catálogo clássico (Gang of Four, 1994) foi escrito para C++ e Smalltalk, linguagens sem funções de primeira classe, sem tipagem dinâmica e sem módulos como objetos. Em Python, boa parte da maquinaria some, e insistir nela produz código mais longo e mais difícil de ler que o problema que resolve.

A regra prática: **primeiro escreva o código simples; introduza o padrão quando a dor aparecer**, geralmente na terceira repetição ou na segunda variação de uma regra.

## Strategy: trocar o algoritmo

Problema: calcular o imposto de um lançamento com regras diferentes por regime tributário. A versão ingênua é um `if/elif` que cresce a cada regime novo. O Strategy isola cada regra em um objeto trocável. Em Python, esse objeto é uma **função**.

```python
def imposto_simples(receita):   return receita * 0.06
def imposto_presumido(receita): return receita * 0.32 * 0.15 + receita * 0.0365
def imposto_real(receita):      return receita * 0.34 * 0.20

ESTRATEGIAS = {
    "Simples": imposto_simples,
    "Presumido": imposto_presumido,
    "Real": imposto_real,
}

def calcular_imposto(regime, receita):
    try:
        estrategia = ESTRATEGIAS[regime]
    except KeyError:
        raise ValueError(f"regime desconhecido: {regime}") from None
    return estrategia(receita)

print(round(calcular_imposto("Simples", 10000), 2))     # 600.0
print(round(calcular_imposto("Presumido", 10000), 2))   # 845.0
```

Adicionar um regime é adicionar uma função e uma linha no dicionário; `calcular_imposto` nunca muda. Quando a estratégia precisa de **estado** (parâmetros configuráveis), use uma classe com `__call__` ou um `functools.partial`; a interface continua sendo "algo chamável que recebe receita".

## Factory: centralizar a criação

Problema: criar o objeto certo a partir de um dado externo (uma string de configuração, um campo do JSON). Em vez de espalhar `if formato == "csv": ExportadorCSV()` pelo código, uma função decide uma única vez.

```python
class ExportadorCSV:
    def exportar(self, linhas): return "\n".join(";".join(map(str, l)) for l in linhas)

class ExportadorJSON:
    def exportar(self, linhas):
        import json
        return json.dumps(linhas, ensure_ascii=False)

FABRICA = {"csv": ExportadorCSV, "json": ExportadorJSON}

def criar_exportador(formato):
    try:
        return FABRICA[formato.lower()]()
    except KeyError:
        raise ValueError(f"formato não suportado: {formato}") from None

exp = criar_exportador("CSV")
print(exp.exportar([["1.1", 100], ["1.2", 50]]))
# 1.1;100
# 1.2;50
```

De novo, um dicionário de classes substitui a hierarquia de "fábricas abstratas". Como classes são chamáveis, `FABRICA[formato]()` instancia direto. Se a criação exigir passos (ler config, abrir conexão), a factory é o lugar certo para eles, e o resto do código só recebe o objeto pronto. Combinada com o registro automático da lição de metaclasses, a factory nem precisa conhecer as implementações.

## Singleton: e por que evitar

Problema: garantir uma única instância (configuração, pool de conexões). A implementação clássica sobrescreve `__new__`:

```python
class Config:
    _instancia = None

    def __new__(cls, *args, **kwargs):
        if cls._instancia is None:
            cls._instancia = super().__new__(cls)
        return cls._instancia

a = Config(); b = Config()
print(a is b)   # True
```

Funciona, mas traz problemas: é um **estado global disfarçado**, difícil de substituir em testes (todo teste vê a mesma instância suja), e esconde dependências (a função que usa `Config()` não declara que depende dela). Em Python há duas alternativas melhores. A primeira é o **módulo**: módulos são importados uma única vez e já são singletons naturais; `config.py` com `CONFIG = carregar()` resolve. A segunda é `functools.lru_cache` em uma função de criação, que você pode limpar com `.cache_clear()` nos testes:

```python
from functools import lru_cache

@lru_cache(maxsize=None)
def obter_config():
    print("carregando...")
    return {"api_url": "https://x"}

obter_config(); obter_config()   # imprime "carregando..." uma vez
obter_config.cache_clear()       # nos testes, reinicia
```

Melhor ainda: crie o objeto uma vez no ponto de entrada e **passe-o como parâmetro** (injeção de dependência). Nenhuma mágica, dependências explícitas, testes triviais.

## Observer: reagir a eventos

Problema: quando um lançamento é gravado, várias coisas devem acontecer (atualizar saldo, logar, notificar), e você não quer que o repositório conheça todas elas. O Observer mantém uma lista de **callbacks** e os chama quando o evento ocorre.

```python
class Eventos:
    def __init__(self):
        self._ouvintes = {}

    def inscrever(self, evento, callback):
        self._ouvintes.setdefault(evento, []).append(callback)

    def emitir(self, evento, **dados):
        for cb in self._ouvintes.get(evento, []):
            cb(**dados)

eventos = Eventos()
saldos = {}
eventos.inscrever("lancamento_gravado", lambda conta, valor: saldos.__setitem__(conta, saldos.get(conta, 0) + valor))
eventos.inscrever("lancamento_gravado", lambda conta, valor: print(f"LOG: {conta} {valor:+}"))

eventos.emitir("lancamento_gravado", conta="1.1", valor=100)
eventos.emitir("lancamento_gravado", conta="1.1", valor=-30)
# LOG: 1.1 +100
# LOG: 1.1 -30
print(saldos)   # {'1.1': 70}
```

Quem emite não sabe quem ouve. Em interfaces gráficas e sistemas de mensageria isso é essencial; em um script linear com dois efeitos, uma chamada direta é mais clara. Observe o sinal de alerta: se você precisa **depurar a ordem** em que os ouvintes rodam, o desacoplamento virou obscuridade.

## Command: ações como objetos (e desfazer)

Problema: representar operações para enfileirar, registrar ou **desfazer**. Um Command empacota a ação e seus parâmetros; em Python, uma dataclass com `executar` e `desfazer` basta.

```python
from dataclasses import dataclass, field

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

saldos = {"caixa": 1000.0, "banco": 500.0}
h = Historico()
h.executar(Transferir(saldos, "caixa", "banco", 200))
print(saldos)        # {'caixa': 800.0, 'banco': 700.0}
h.desfazer_ultimo()
print(saldos)        # {'caixa': 1000.0, 'banco': 500.0}
```

Quando não há "desfazer" nem fila, um Command é só uma função com argumentos; `functools.partial(transferir, saldos, "caixa", "banco", 200)` já é um comando adiado.

## Adapter: encaixar interfaces diferentes

Problema: a camada de aplicação espera `exportar(linhas) -> str`, mas a biblioteca de terceiros oferece `dump(rows, fp)`. O Adapter é uma classe fina que traduz uma interface na outra, sem alterar nenhuma das duas.

```python
import io

class BibliotecaExterna:
    def dump(self, rows, fp):
        for r in rows:
            fp.write(",".join(map(str, r)) + "\n")

class AdaptadorExterno:
    def __init__(self, lib):
        self._lib = lib

    def exportar(self, linhas):
        buffer = io.StringIO()
        self._lib.dump(linhas, buffer)
        return buffer.getvalue()

exp = AdaptadorExterno(BibliotecaExterna())
print(exp.exportar([["1.1", 100]]))   # 1.1,100
```

Com `typing.Protocol`, o adaptador satisfaz o contrato `Exportavel` sem herdar nada. Adapters são o padrão mais honesto da lista: eles existem porque o mundo real tem interfaces incompatíveis, e são a forma de manter a sujeira na borda do sistema.

## Quando um padrão vira over-engineering

Sinais de que você passou do ponto:

- **Uma única implementação** de uma "interface" que existe "para o futuro". O futuro raramente chega como previsto; adicione a abstração quando a segunda implementação aparecer.
- **Mais arquivos de infraestrutura que de regra de negócio.** Fábricas de fábricas, gerentes de gerentes.
- **Indireção que exige abrir quatro arquivos** para descobrir qual função roda.
- **Padrão aplicado a problema de 10 linhas.** Um `if/elif` com três ramos é perfeitamente legível; o Strategy começa a valer a partir de cinco ou quando cada ramo tem lógica própria.
- **Nome do padrão no nome da classe** (`ExportadorStrategyFactoryImpl`). Se o padrão é bom, ele é invisível.

O inverso também existe: um `if/elif` com doze regimes, repetido em três funções, está implorando por um dicionário de estratégias. A habilidade é sentir o momento certo, e ela vem de refatorar código real nas duas direções.

## Armadilhas comuns

- **Herança para reutilizar código** quando composição (passar um objeto como parâmetro) seria mais simples e flexível.
- **Singleton para "facilitar o acesso"**: esconde dependências e contamina testes.
- **Observer com ouvintes que lançam exceções**: um ouvinte quebrado derruba os outros. Capture e logue por ouvinte.
- **Factory que recebe flags booleanas** (`criar(csv=True, json=False)`): use a chave de texto e um dicionário.
- **Adapter com lógica de negócio dentro**: ele só traduz; regras ficam no domínio.

## Na prática

Procure os padrões no código que você já tem. O `if regime == ...` repetido em três funções é um Strategy esperando um dicionário; o `if formato == "csv"` na hora de exportar é uma Factory; a função que recebe a biblioteca de PDF e devolve `bytes` é um Adapter. Refatorar um deles por semana, com os testes verdes antes e depois, ensina mais que decorar o catálogo; e, se o código ficou mais longo depois da refatoração, desfaça: o padrão não era necessário ali.

## Resumo

- Padrões são vocabulário, não obrigação; em Python, funções, dicionários e módulos substituem boa parte das hierarquias clássicas.
- Strategy = dicionário de funções; Factory = dicionário de classes; ambos tornam a extensão uma linha nova em vez de um `if` a mais.
- Evite Singleton: use módulo, `lru_cache` ou, melhor, injeção de dependência.
- Observer desacopla quem emite de quem reage via callbacks; Command empacota ações para fila/undo; Adapter traduz interfaces na borda do sistema.
- Introduza o padrão quando a dor aparecer (repetição, variação); abstração para uma única implementação é over-engineering.
