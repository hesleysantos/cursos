Nesta lição você vai aprender a melhorar código que já funciona sem quebrá-lo: refatorar com os testes como rede de segurança, escolher nomes, quebrar funções grandes, adicionar type hints, rodar `ruff` e `black` pelo Claude Code e gerar docstrings e README que você revisa antes de aceitar. Ao final, você refatora uma função confusa mantendo o comportamento. Código gerado por IA nasce funcionando e, com frequência, nasce feio; quem não refatora acumula scripts que ninguém mais entende, inclusive o próprio autor.

## O que é refatorar

**Refatorar** é mudar a estrutura do código sem mudar o que ele faz. Renomear uma variável, extrair uma função, substituir três `if` por um dicionário: tudo isso é refatoração. Corrigir um bug ou adicionar uma coluna não é. A distinção importa porque refatoração tem um critério de sucesso simples: os testes que passavam antes continuam passando depois, e nenhum teste novo foi necessário.

Daí a regra desta lição: **sem testes, não refatore**. Se o script não tem testes, escreva-os primeiro (lição 2), capturando o comportamento atual, mesmo os pedaços estranhos. Só então mexa.

## O prompt de refatoração

```text
Os testes em tests/ estão verdes. Refatore consolidar.py sem mudar comportamento:
- funções com no máximo ~25 linhas e um único propósito;
- nomes que digam o que a coisa é (registros_validos, não lst2);
- type hints em todas as funções públicas;
- sem alterar nenhum teste.
Faça em commits pequenos: um por tipo de mudança (renomear, extrair, tipar).
Rode pytest depois de cada um e pare se algo ficar vermelho.
```

"Um commit por tipo de mudança" é o que permite revisar: um diff que só renomeia é fácil de aprovar; um diff que renomeia, extrai e muda lógica ao mesmo tempo é impossível de auditar.

## Nomes e funções pequenas

Nome bom responde "o que é isto?" sem abrir a função. Compare `proc(d, f)` com `consolidar_por_cliente(registros, flag_pago)`. Em Python, a convenção é `snake_case` para funções e variáveis, `MAIUSCULAS` para constantes e `CamelCase` para classes.

Função pequena faz uma coisa. Um sinal de que precisa dividir: você usa "e" para explicá-la ("lê a planilha **e** valida **e** soma"). Peça ao Claude Code para extrair cada "e" em uma função com nome próprio:

```python
def ler_planilha(caminho: str) -> list[dict]:
    ...

def validar_registros(registros: list[dict]) -> tuple[list[dict], list[str]]:
    ...

def somar_por_cliente(registros: list[dict]) -> dict[str, float]:
    ...
```

## Type hints

**Type hints** (anotações de tipo) dizem o que cada parâmetro recebe e o que a função devolve. Python não as impõe em tempo de execução, mas elas documentam a intenção, ajudam o editor a completar código e deixam o Claude muito mais preciso ao chamar suas funções:

```python
from datetime import date

def dias_de_atraso(vencimento: date, pagamento: date | None = None) -> int:
    """Devolve quantos dias o pagamento atrasou; 0 se pagou em dia ou antes."""
    pago_em = pagamento or date.today()
    return max(0, (pago_em - vencimento).days)

print(dias_de_atraso(date(2026, 10, 20), date(2026, 10, 25)))  # 5
print(dias_de_atraso(date(2026, 10, 20), date(2026, 10, 10)))  # 0
```

`date | None` significa "uma data ou nada" (sintaxe do Python 3.10 em diante). A docstring de uma linha, entre aspas triplas logo abaixo do `def`, é o manual mínimo da função.

## ruff e black

**black** formata o código em um estilo único (espaços, quebras, aspas), sem discussão. **ruff** é um verificador rápido que aponta importações não usadas, variáveis definidas e esquecidas, comparações erradas e centenas de outros problemas; também formata, se você preferir usar só ele. Instale no ambiente virtual com `pip install ruff black` e rode:

```powershell
ruff check .
ruff check --fix .
black .
```

`ruff check` lista problemas; `--fix` corrige os seguros automaticamente; `black .` reformata todos os `.py` da pasta. Peça ao Claude Code: "rode ruff check e corrija os avisos um a um, me explicando cada um", e você aprende as regras no processo. Na lição de hooks do próximo módulo, você vai fazer o `black` rodar sozinho a cada edição.

## Docstrings e README gerados, revisados por você

O Claude Code escreve docstrings e README muito bem, e é exatamente por isso que você precisa revisar: o texto fica convincente mesmo quando descreve um comportamento que não existe. Prompt:

```text
Escreva docstrings (formato Google, em português) para todas as funções
públicas de consolidar.py, descrevendo parâmetros, retorno e exceções que
realmente acontecem no código. Depois gere um README.md com: o que o script
faz, como instalar, como rodar, formato das entradas e exemplos de saída.
Não invente opções de linha de comando que não existem.
```

Ao revisar, compare cada frase com o código: "levanta ValueError em duplicidade" tem um `raise ValueError` correspondente? A opção `--saida` descrita existe no `argparse`? Se o README diz que o script "trata PDFs escaneados" e ele não trata, apague.

## Erros comuns

- **Refatorar e corrigir bug no mesmo commit**: se algo quebrar, você não sabe qual das duas mudanças foi.
- **Confiar em "refatorei e funciona"** sem rodar os testes depois.
- **Renomear para nomes genéricos** (`dados`, `resultado`, `temp`), que não dizem nada.
- **Type hints inventadas** (`-> dict` quando devolve lista); o editor passa a mentir para você.
- **Docstring que descreve a intenção, não o código.** Leia o corpo antes de aceitar.
- **Rodar `black` em código sem testes e sem Git**: a mudança é grande e você não tem como conferir.

## Na prática

Um script de fechamento que começou com 80 linhas e hoje tem 600 é candidato a uma sessão de refatoração por semana: testes primeiro, depois um objetivo por sessão (nomes, extração, tipos, formatação). Em um mês, o colega consegue ler o código, e o próprio Claude Code passa a errar menos nele, porque funções pequenas e tipadas dão menos margem a interpretação.

## Resumo

- Refatorar é mudar a forma sem mudar o comportamento; os testes são o juiz.
- Sem testes, escreva-os antes de refatorar.
- Nomes que explicam, funções de um propósito, type hints em tudo que é público.
- `ruff check` encontra problemas; `ruff check --fix` e `black .` corrigem e formatam.
- Docstrings e README gerados devem ser confrontados com o código, linha por linha.
