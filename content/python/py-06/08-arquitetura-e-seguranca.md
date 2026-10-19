# Arquitetura e segurança

Nesta lição você vai consolidar como organizar um sistema para que ele continue fácil de mudar (SOLID, camadas, injeção de dependência) e como protegê-lo das falhas mais comuns: segredos expostos, entrada não validada, senhas mal guardadas, `eval` e `pickle` em dados externos. Fechamos com o essencial do OWASP, a referência mundial em segurança de aplicações. Arquitetura e segurança andam juntas porque um sistema bem separado é também um sistema onde a validação e o controle de acesso têm lugar certo para morar.

## SOLID em Python

SOLID é um acrônimo de cinco princípios de design orientado a objetos. Em Python, eles valem igualmente para funções e módulos.

**S, responsabilidade única**: cada módulo ou classe muda por **um único motivo**. Uma classe que lê a API, calcula o imposto e grava o Excel muda quando a API muda, quando a regra muda e quando o layout muda; três motivos, três classes.

**O, aberto/fechado**: aberto para extensão, fechado para modificação. O dicionário de estratégias da lição de padrões é o exemplo: um regime novo é uma função nova, não um `elif` a mais dentro da função existente.

**L, substituição de Liskov**: uma subclasse deve funcionar em qualquer lugar onde a classe-base funciona. Se `RepositorioMemoria.salvar` aceita lista vazia e `RepositorioSQLite.salvar` lança exceção com lista vazia, um deles quebra o contrato. Em Python, isso se aplica também a quem implementa um `Protocol`.

**I, segregação de interfaces**: contratos pequenos. Em vez de um `Protocol` gigante com dez métodos, vários pequenos (`Leitor`, `Gravador`, `Notificador`), para que cada implementação só precise do que usa.

**D, inversão de dependência**: módulos de alto nível (regra de negócio) não dependem de módulos de baixo nível (SQLite, SMTP); ambos dependem de **abstrações**. Na prática: o domínio define o `Protocol`, a infraestrutura o implementa, e a aplicação recebe a implementação pronta.

```python
from typing import Protocol
from dataclasses import dataclass

@dataclass(frozen=True)
class Lancamento:
    conta: str
    valor_centavos: int

class Repositorio(Protocol):                       # abstração definida pelo domínio
    def salvar(self, lancamentos: list[Lancamento]) -> int: ...
    def listar(self) -> list[Lancamento]: ...

class RepositorioMemoria:                          # infraestrutura de teste
    def __init__(self): self._dados: list[Lancamento] = []
    def salvar(self, lancamentos): self._dados.extend(lancamentos); return len(lancamentos)
    def listar(self): return list(self._dados)

def fechar_mes(repo: Repositorio, novos: list[Lancamento]) -> int:   # alto nível
    repo.salvar(novos)
    return sum(l.valor_centavos for l in repo.listar())

repo = RepositorioMemoria()
print(fechar_mes(repo, [Lancamento("1.1", 10000), Lancamento("3.1", -2500)]))   # 7500
```

`fechar_mes` não importa `sqlite3` nem sabe que ele existe. Trocar para SQLite é escrever outra classe com os mesmos dois métodos.

## Camadas: domínio, aplicação, infraestrutura

Você já usou isso no Robô de fechamento; aqui está a regra formal. As dependências apontam **para dentro**:

```
infraestrutura  ->  aplicação  ->  domínio
(SQLite, HTTP,      (casos de uso,   (entidades, regras,
 Excel, SMTP, CLI)   orquestração)    Protocols)
```

- **Domínio**: dataclasses, funções puras, Protocols. Importa só a biblioteca padrão. É onde ficam as regras que o contador reconhece.
- **Aplicação**: casos de uso ("fechar competência", "importar extrato"). Recebe implementações concretas como parâmetros e coordena.
- **Infraestrutura**: tudo que fala com o mundo. Depende das duas camadas internas; nenhuma delas depende dela.

O teste prático: `grep -r "import sqlite3" src/dominio/` deve devolver nada. Se a camada de domínio importa uma biblioteca de infraestrutura, a fronteira vazou.

## Injeção de dependência simples

Injeção de dependência (DI) é só isto: **quem usa recebe, não cria**. A função ou classe declara o que precisa como parâmetro; quem monta o sistema (o `main`) decide qual implementação passar.

```python
# continua o exemplo anterior (Lancamento, Repositorio, RepositorioMemoria, fechar_mes)
import logging

class ServicoFechamento:
    def __init__(self, repo: Repositorio, notificar, relogio=None, log=None):
        self.repo = repo
        self.notificar = notificar                 # função: (assunto, corpo) -> None
        self.relogio = relogio or (lambda: "2026-03-31")
        self.log = log or logging.getLogger(__name__)

    def executar(self, novos):
        total = fechar_mes(self.repo, novos)
        self.notificar("Fechamento", f"Total em {self.relogio()}: {total}")
        self.log.info("fechamento concluído: %d", total)
        return total

# produção (main.py):
# ServicoFechamento(RepositorioSQLite("x.db"), enviar_email, relogio=lambda: date.today().isoformat())
# teste:
enviados = []
svc = ServicoFechamento(RepositorioMemoria(), lambda a, c: enviados.append(c))
svc.executar([Lancamento("1.1", 500)])
print(enviados)   # ['Total em 2026-03-31: 500']
```

Não é preciso framework. Parâmetros com padrão sensato (`relogio=None`) mantêm a chamada curta em produção e permitem controlar o tempo nos testes, resolvendo o clássico "o teste falha na virada do mês". Frameworks de DI existem (`dependency-injector`, o sistema de `Depends` do FastAPI), mas para a maioria dos projetos, parâmetros bastam.

## Segredos e `.env`

Regra única: **segredo nunca vai para o código nem para o Git**. Ele vem do ambiente.

```python
import os
from pathlib import Path

def carregar_dotenv(caminho=".env"):
    """Lê KEY=valor de um .env simples para os.environ, sem sobrescrever o que já existe."""
    p = Path(caminho)
    if not p.exists():
        return
    for linha in p.read_text(encoding="utf-8").splitlines():
        linha = linha.strip()
        if not linha or linha.startswith("#") or "=" not in linha:
            continue
        chave, _, valor = linha.partition("=")
        os.environ.setdefault(chave.strip(), valor.strip().strip('"').strip("'"))

carregar_dotenv()
TOKEN = os.environ["ROBO_API_TOKEN"]      # KeyError claro se faltar (no .env ou no ambiente): melhor que None silencioso
```

Em produção use a biblioteca `python-dotenv` ou o gerenciador de segredos da plataforma. O `.env` fica no `.gitignore`; um `.env.example` **sem valores** entra no repositório para documentar as variáveis necessárias. Nos logs, nunca imprima o valor: registre `"token carregado (len=40)"`, não o token.

## Validação de entrada

Tudo que vem de fora (arquivo, API, formulário, argumento de linha de comando) é **hostil até prova em contrário**. Validar significa: tipo certo, faixa certa, formato certo, e rejeitar com mensagem clara o que não passar.

```python
import re
from dataclasses import dataclass

CNPJ_RE = re.compile(r"^\d{14}$")

@dataclass(frozen=True)
class NovoCliente:
    nome: str
    cnpj: str
    regime: str

def validar_novo_cliente(bruto: dict) -> NovoCliente:
    nome = str(bruto.get("nome", "")).strip()
    if not (2 <= len(nome) <= 120):
        raise ValueError("nome deve ter entre 2 e 120 caracteres")
    cnpj = re.sub(r"\D", "", str(bruto.get("cnpj", "")))
    if not CNPJ_RE.match(cnpj):
        raise ValueError("cnpj deve ter 14 dígitos")
    regime = bruto.get("regime")
    if regime not in {"Simples", "Presumido", "Real"}:
        raise ValueError("regime inválido")
    return NovoCliente(nome, cnpj, regime)

print(validar_novo_cliente({"nome": " Padaria ", "cnpj": "11.222.333/0001-81", "regime": "Simples"}))
# NovoCliente(nome='Padaria', cnpj='11222333000181', regime='Simples')
```

Repare no padrão: a função recebe um dict "sujo" e devolve um objeto **tipado e imutável**. A partir daí, o resto do sistema confia no `NovoCliente` e não revalida. Validar na borda, confiar dentro. Pydantic automatiza isso em APIs; o princípio é o mesmo.

## hashlib e secrets

**Nunca guarde senhas em texto puro**, nem "criptografadas" de forma reversível. Guarde um **hash com sal**, lento por design, e compare hashes.

```python
import hashlib
import secrets
import hmac

def gerar_hash_senha(senha: str) -> str:
    sal = secrets.token_bytes(16)
    hash_ = hashlib.pbkdf2_hmac("sha256", senha.encode(), sal, iterations=600_000)
    return sal.hex() + ":" + hash_.hex()

def verificar_senha(senha: str, armazenado: str) -> bool:
    sal_hex, hash_hex = armazenado.split(":")
    novo = hashlib.pbkdf2_hmac("sha256", senha.encode(), bytes.fromhex(sal_hex), iterations=600_000)
    return hmac.compare_digest(novo.hex(), hash_hex)

h = gerar_hash_senha("Troque-me-123")
print(verificar_senha("Troque-me-123", h), verificar_senha("errada", h))   # True False

print(secrets.token_urlsafe(32))      # token aleatório seguro para links de redefinição
print(hashlib.sha256(b"conteudo do arquivo").hexdigest()[:16])   # integridade de arquivos
```

`pbkdf2_hmac` com centenas de milhares de iterações torna ataques de força bruta caros (bibliotecas como `argon2-cffi` e `bcrypt` são ainda melhores). O **sal** aleatório impede que duas senhas iguais gerem o mesmo hash. `hmac.compare_digest` compara em tempo constante, evitando ataques de temporização. `secrets` é o módulo para tokens e senhas; `random` **não** é seguro para isso. `hashlib.sha256` puro serve para integridade de arquivos (conferir que um SPED não foi alterado), não para senhas.

## eval, exec e pickle

`eval` e `exec` executam **qualquer** código Python. Se a string vem de fora, você entregou a máquina ao remetente:

```python
expressao = '__import__("os").system("del /q *.xlsx")'   # veio de um campo de formulário
# eval(expressao)  -> apagaria seus arquivos
```

Para "calcular uma fórmula digitada pelo usuário", use `ast.literal_eval` (só literais: números, strings, listas, dicts) ou um parser de expressões próprio. Para configuração, JSON/TOML. Para templates, Jinja2 em modo sandbox.

`pickle` tem o mesmo problema: desserializar um pickle **executa código** definido por quem o criou. A documentação oficial avisa em letras garrafais. Nunca faça `pickle.load` de dados recebidos pela rede, de upload ou de fonte não confiável. Para trocar dados, use JSON; para cache local gerado pelo seu próprio processo, pickle é aceitável, com o arquivo protegido.

Outros pontos da mesma família: `subprocess` com `shell=True` e entrada do usuário (injeção de comando), `yaml.load` sem `Loader=SafeLoader`, e SQL concatenado (visto no módulo anterior).

## OWASP básico

O OWASP Top 10 lista as categorias de risco mais frequentes em aplicações. As que mais tocam o código Python de escritório:

| Risco | O que é | Defesa em Python |
|---|---|---|
| Injeção | SQL, comando, código via entrada | Parâmetros `?`, sem `shell=True`, sem `eval` |
| Falhas criptográficas | Senha em texto puro, hash fraco, segredo no código | `pbkdf2_hmac`/argon2, `secrets`, variáveis de ambiente |
| Controle de acesso quebrado | Usuário vê dados de outro | Checar permissão em **toda** rota, nunca confiar em ID vindo do cliente |
| Configuração insegura | `debug=True` em produção, listagem de diretórios | Config por ambiente, segredos fora do código |
| Componentes vulneráveis | Dependência antiga com falha conhecida | `pip-audit` (instale com `pip install pip-audit`), Dependabot, atualizar faixas |
| Falhas de log e monitoramento | Ataque sem rastro | `logging` estruturado, sem segredos nos logs |
| Desserialização insegura | `pickle`/`yaml.load` de fonte externa | JSON, `SafeLoader` |

Uma mentalidade resume tudo: **confie no mínimo, valide na borda, registre o que acontece**. Sistemas contábeis guardam dados sensíveis de terceiros; a LGPD torna o vazamento um problema jurídico além de técnico.

## Armadilhas comuns

- **Importar infraestrutura no domínio** "só dessa vez".
- **Protocol gigante** que força implementações a stubs vazios.
- **Segredo em log** ou em mensagem de erro que vai para o usuário.
- **Validar no meio** em vez de na borda: cada função revalida, e alguma esquece.
- **`random` para tokens**, `md5`/`sha1` para senhas, comparação de hash com `==`.
- **`pickle.load` de upload**, `eval` em fórmulas, `yaml.load` sem SafeLoader.
- **Dependências nunca atualizadas**: a falha já é pública e você ainda a carrega.

## Na prática

Um escritório contábil guarda CNPJs, folhas de pagamento e extratos de terceiros: o checklist mínimo para qualquer script seu é segredo fora do código (`.env` no `.gitignore`), validação de todo arquivo que chega do cliente antes de processar, senhas de sistemas internos com `pbkdf2_hmac` e nunca `pickle` ou `eval` sobre o que veio de fora. Rode `pip-audit` uma vez por mês no venv de produção: leva um minuto e evita carregar uma falha conhecida.

## Resumo

- SOLID em Python: uma responsabilidade por módulo, extensão por adição (dicionários/Protocols), contratos pequenos e dependências invertidas via Protocol.
- Camadas apontam para dentro: domínio puro, aplicação orquestra, infraestrutura implementa; injeção de dependência é passar implementações como parâmetros.
- Segredos vêm do ambiente (`.env` fora do Git, `.env.example` no Git); valide toda entrada na borda e converta em objetos tipados imutáveis.
- Senhas com `hashlib.pbkdf2_hmac` + sal de `secrets` e `hmac.compare_digest`; tokens com `secrets`, nunca `random`.
- `eval`, `exec`, `pickle.load`, `yaml.load` e `shell=True` com dados externos executam código do atacante; OWASP Top 10 orienta as defesas.
