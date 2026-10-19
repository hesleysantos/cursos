# Exceções

Um programa que só funciona quando tudo dá certo não serve para o mundo real: o arquivo pode não existir, o valor pode vir em branco, o CNPJ pode estar errado. Nesta lição você vai aprender a **tratar erros** com `try`/`except`, a **lançar** os seus próprios erros com `raise`, a criar **exceções personalizadas** e, principalmente, a não cometer o pecado mais comum: engolir erros em silêncio.

## O que é uma exceção?

Quando o Python encontra algo impossível de executar (`1 / 0`, `int("abc")`, `lista[99]`), ele cria um objeto de **exceção** e interrompe o fluxo normal. Se ninguém tratar aquela exceção, o programa termina mostrando o *traceback*:

```python
valor = float("1.234,56")
# ValueError: could not convert string to float: '1.234,56'
```

Esse comportamento é bom: é melhor parar do que continuar calculando a folha com um valor errado. Mas há situações em que você sabe que o erro pode acontecer e quer reagir a ele: avisar o usuário, pular a linha defeituosa, tentar outro caminho.

## `try` / `except`

```python
texto = "1.234,56"
try:
    valor = float(texto)
except ValueError:
    valor = float(texto.replace(".", "").replace(",", "."))
print(valor)   # 1234.56
```

O Python tenta executar o bloco `try`. Se acontecer um `ValueError`, pula para o `except` correspondente e segue a vida. Se não acontecer nada, o `except` é ignorado.

### Capture tipos específicos

```python
try:
    with open("/tmp/nao_existe.csv", encoding="utf-8") as f:
        dados = f.read()
except FileNotFoundError:
    print("Arquivo não encontrado. Exporte o extrato antes de continuar.")
except PermissionError:
    print("Sem permissão para ler o arquivo. Ele está aberto no Excel?")
```

Cada `except` trata um tipo. Isso importa porque a reação a "arquivo não existe" é diferente da reação a "sem permissão". Você pode agrupar tipos numa tupla: `except (ValueError, TypeError):`.

### Acessando a mensagem do erro

```python
try:
    int("12a")
except ValueError as e:
    print(f"Valor inválido: {e}")
# Valor inválido: invalid literal for int() with base 10: '12a'
```

O `as e` guarda o objeto da exceção; `str(e)` é a mensagem. Útil para registrar em log o que exatamente deu errado.

## A hierarquia das exceções

As exceções formam uma árvore. `Exception` é a mãe de quase todas; `ValueError`, `TypeError`, `KeyError`, `FileNotFoundError` etc. são filhas. Um `except` captura o tipo indicado **e todos os seus descendentes**:

```
BaseException
 ├── KeyboardInterrupt       (Ctrl+C)
 ├── SystemExit              (sys.exit)
 └── Exception
      ├── ValueError
      ├── TypeError
      ├── KeyError, IndexError  (filhas de LookupError)
      ├── ZeroDivisionError     (filha de ArithmeticError)
      └── OSError
           ├── FileNotFoundError
           └── PermissionError
```

Por isso `except Exception:` pega praticamente tudo, e `except OSError:` pega `FileNotFoundError` e `PermissionError` de uma vez.

## `else` e `finally`

```python
def ler_saldo(caminho):
    try:
        f = open(caminho, encoding="utf-8")
    except FileNotFoundError:
        print("Arquivo ausente, usando saldo zero.")
        return 0.0
    else:
        # roda SÓ se o try não levantou exceção
        with f:                      # garante o fechamento do arquivo aberto no try
            return float(f.read().strip())
    finally:
        # roda SEMPRE: com erro, sem erro, com return no meio
        print("Tentativa de leitura encerrada.")
```

- `else`: código que deve rodar apenas quando o `try` deu certo. Mantém o `try` pequeno, cobrindo só a linha que pode falhar.
- `finally`: limpeza obrigatória (fechar arquivo, conexão, liberar recurso). Executa mesmo que haja `return` dentro do `try`. Na prática, o `with` já faz o papel do `finally` para arquivos.

## `raise`: lançando erros de propósito

Validar dados é lançar exceções quando algo está errado, em vez de devolver `None` ou `-1` e torcer para alguém verificar.

```python
def calcular_inss(salario):
    # faixas simplificadas, só para o exemplo; a tabela real tem mais faixas e muda todo ano
    if salario < 0:
        raise ValueError(f"Salário não pode ser negativo: {salario}")
    if salario <= 1518.00:
        return round(salario * 0.075, 2)
    return round(salario * 0.09, 2)

print(calcular_inss(1500))    # 112.5
calcular_inss(-100)
# ValueError: Salário não pode ser negativo: -100
```

Quem chama `calcular_inss` fica livre para tratar ou não o erro; o que não pode acontecer é um salário negativo passar despercebido e virar um INSS negativo na folha.

Dentro de um `except`, um `raise` sozinho **relança** a mesma exceção. Isso é útil para registrar o erro e deixá-lo subir (trecho ilustrativo; `processar_folha` seria uma função sua):

```python
try:
    processar_folha()
except Exception:
    print("Erro ao processar a folha; veja o traceback abaixo.")
    raise
```

## Exceções personalizadas

Quando o seu domínio tem erros próprios ("competência fechada", "CNPJ inválido"), crie classes de exceção. É só herdar de `Exception`:

```python
class ErroContabil(Exception):
    """Base para os erros do nosso sistema."""

class CompetenciaFechadaError(ErroContabil):
    pass

class CNPJInvalidoError(ErroContabil):
    def __init__(self, cnpj):
        super().__init__(f"CNPJ inválido: {cnpj}")
        self.cnpj = cnpj

def lancar(competencia, cnpj):
    if competencia < "2026-03":
        raise CompetenciaFechadaError(f"Competência {competencia} já encerrada")
    if len(cnpj) != 14:
        raise CNPJInvalidoError(cnpj)
    return "ok"

try:
    lancar("2026-01", "12345678000190")
except ErroContabil as e:
    print(type(e).__name__, "->", e)
# CompetenciaFechadaError -> Competência 2026-01 já encerrada
```

Com uma classe base `ErroContabil`, quem usa o sistema pode capturar todos os erros de negócio com um único `except ErroContabil`, sem misturá-los com bugs genéricos como `TypeError`.

## Boas práticas (e o pecado capital)

**1. Nunca engula erros.** O pior código do mundo é:

```python
try:
    processar()
except:
    pass
```

Ele esconde `KeyboardInterrupt`, bugs de digitação, tudo. O programa termina "sem erro" com a folha pela metade e ninguém fica sabendo. Se precisar ignorar um erro, seja específico e registre (aqui `campo` seria o texto lido de uma linha do arquivo):

```python
try:
    valor = float(campo)
except ValueError:
    print(f"Aviso: valor ilegível '{campo}', lançamento ignorado")
    valor = 0.0
```

**2. `try` pequeno.** Envolva só as linhas que podem falhar. Um `try` com 40 linhas dentro esconde de onde veio o erro.

**3. Seja específico.** `except Exception` é aceitável na camada mais externa de um programa (para registrar em log e encerrar com dignidade), não em cada função.

**4. Exceções são para o excepcional.** Não use `try/except KeyError` para checar se uma chave existe quando `if chave in dicionario` resolve. Por outro lado, a filosofia do Python é "é mais fácil pedir perdão do que permissão" (*EAFP*): se o caso normal é a chave existir, `try` pode ser mais limpo.

**5. Mensagens úteis.** `raise ValueError("Valor inválido")` não ajuda ninguém. `raise ValueError(f"Valor inválido na linha {n}: {campo!r}")` aponta o problema.

## Erros comuns

- **`except:` sem tipo** ou **`except: pass`**: engole tudo, inclusive Ctrl+C.
- **Capturar e não fazer nada útil**: `except ValueError: print("erro")` sem dizer qual valor nem onde.
- **Colocar o `return` dentro do `try` e esquecer o `else`**: funciona, mas mistura "o que pode falhar" com "o que fazer depois".
- **Achar que `finally` substitui `except`**: `finally` não trata o erro, só garante a limpeza; o erro continua subindo.
- **Esquecer que `except ValueError` não pega `TypeError`**: `float(None)` lança `TypeError`, não `ValueError`.

## Na prática

Em um script que processa cinco mil linhas de extrato, uma linha com valor em branco não pode derrubar tudo. Capture o `ValueError` daquela linha, registre o número dela em uma lista de problemas e siga; no fim, mostre quantas linhas foram ignoradas. É esse padrão que o projeto da lição 9 usa.

## Resumo

- `try` tenta; `except Tipo as e` trata um tipo específico; `else` roda sem erro; `finally` roda sempre.
- Capture tipos específicos e, dentro do `except`, faça algo útil: registre, corrija, avise ou relance com `raise`.
- `raise ValueError("mensagem clara")` valida dados na entrada em vez de deixar valores errados se espalharem.
- Crie exceções próprias herdando de `Exception` (ou de uma base sua, como `ErroContabil`) para erros de negócio.
- **Nunca** use `except: pass`. Erro escondido é erro que aparece no pior momento.
