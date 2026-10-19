Nesta lição você vai aprender a usar **TDD** (Test-Driven Development, desenvolvimento guiado por testes) com o Claude Code: pedir os testes primeiro, vê-los falhar, implementar, vê-los passar. O exemplo é um validador de CNPJ que aceita o formato alfanumérico que a Receita Federal passou a emitir em 2026. Ao final, você vai escrever a função e os asserts você mesmo. TDD é a técnica que mais aumenta a confiança no código gerado por IA, porque transforma "parece que funciona" em "passou em 12 casos que eu escolhi".

## O ciclo em três cores

TDD é um ciclo curto:

1. **Vermelho**: escreva um teste para um comportamento que ainda não existe e rode. Ele falha (vermelho).
2. **Verde**: escreva o mínimo de código para o teste passar.
3. **Refatore**: melhore o código mantendo os testes verdes.

Com o Claude Code, o ponto crítico é a ordem. Se você pede "faça a função e os testes", o modelo escreve a função e depois testes que confirmam o que a função já faz, inclusive os erros. Se você pede os testes primeiro, a partir da especificação, os testes viram um contrato que a implementação tem de cumprir.

## A ferramenta: pytest

`pytest` é o executor de testes mais usado em Python. Instale no ambiente virtual do projeto (`pip install pytest`). Ele procura arquivos `test_*.py`, roda cada função `test_*` e considera que passou se nenhum `assert` falhar:

```python
# tests/test_cnpj.py (trecho)
from cnpj import validar_cnpj

def test_cnpj_numerico_valido():
    assert validar_cnpj("11.222.333/0001-81") is True

def test_cnpj_com_digito_errado():
    assert validar_cnpj("11.222.333/0001-80") is False
```

Rode com `pytest` na pasta do projeto (ou `python -m pytest` se o comando não for encontrado). A saída termina com algo como `2 passed` ou `1 failed, 1 passed`, e cada falha mostra a linha do assert e os valores comparados.

## A regra do CNPJ (inclusive alfanumérico)

Segundo o material oficial da Receita Federal, o CNPJ alfanumérico mantém 14 posições (`AA.AAA.AAA/AAAA-DV`, em que cada `A` é um dígito ou uma letra e `DV` são os dois dígitos verificadores): as 12 primeiras podem ser dígitos de 0 a 9 ou letras maiúsculas de A a Z, e os dois dígitos verificadores continuam numéricos. Os CNPJs já existentes não mudam; o formato novo vale para inscrições novas a partir de julho de 2026. O cálculo do DV continua sendo o módulo 11, com uma adaptação: cada caractere é convertido pelo seu código ASCII menos 48, então `0`..`9` continuam valendo 0..9 e `A` vale 17, `B` 18, até `Z` 42.

Os pesos do primeiro dígito são 5,4,3,2,9,8,7,6,5,4,3,2 (um para cada uma das 12 posições); soma-se o produto de cada valor pelo seu peso, calcula-se o resto da divisão por 11; se o resto for 0 ou 1, o dígito é 0; senão, é 11 menos o resto. O segundo dígito repete o processo com 13 posições (as 12 mais o primeiro dígito) e pesos 6,5,4,3,2,9,8,7,6,5,4,3,2. O exemplo oficial `12.ABC.345/01DE` resulta nos dígitos `35`.

## Os prompts que funcionam

Primeiro, só os testes:

```text
Vamos fazer TDD. Crie tests/test_cnpj.py com testes pytest para uma função
validar_cnpj(texto) -> bool que ainda não existe, em cnpj.py. Regras:
- aceita com ou sem pontuação (pontos, barra, hífen) e espaços nas pontas;
- os 12 primeiros caracteres podem ser dígitos ou letras maiúsculas A-Z; os 2
  últimos são sempre dígitos;
- DV por módulo 11 com valor = código ASCII - 48, pesos 5..2,9..2 e 6..2,9..2;
- devolve False para tamanho errado, letra minúscula, caracteres inválidos,
  todos os caracteres iguais e DV errado; nunca lança exceção.
Casos obrigatórios: "11.222.333/0001-81" True, "11222333000181" True,
"12.ABC.345/01DE-35" True, "11.222.333/0001-80" False, "" False,
"00000000000000" False. Não implemente a função ainda. Rode pytest e me
mostre as falhas.
```

Você verá os testes falharem com `ImportError` ou `ModuleNotFoundError`: é o vermelho esperado, prova de que os testes testam algo. Depois:

```text
Agora implemente validar_cnpj em cnpj.py, o mais simples possível, até todos
os testes passarem. Não altere os testes. Mostre a saída do pytest.
```

Se o Claude alterar um teste para fazê-lo passar, recuse: o teste é a especificação. Por fim:

```text
Com os testes verdes, refatore cnpj.py: separe uma função calcular_dv(base) e
use nomes claros. Rode pytest de novo e confirme que continua tudo verde.
```

## Lendo um teste que falhou

Quando um assert falha, o pytest mostra `assert False is True` com a chamada que gerou o valor. Antes de pedir correção, leia e decida: o teste está certo e o código errado, ou o teste estava errado? No exemplo do CNPJ, um erro clássico é aceitar `"12.abc.345/01DE-35"` em minúsculas porque a implementação chamou `.upper()`. O teste exige False para minúsculas; se o Claude "corrigir" trocando o teste, a regra se perdeu.

## Erros comuns

- **Pedir função e testes juntos.** Os testes só repetem a implementação.
- **Deixar o Claude editar os testes para passar.** Peça explicitamente: "não altere os testes".
- **Testar só o caminho feliz.** Inclua vazio, tamanho errado, DV errado, repetidos, tipo errado (`None`, número).
- **Testes que dependem de arquivos reais ou rede.** Testes unitários recebem valores e devolvem valores; arquivos entram em pastas de exemplo controladas.
- **Copiar o CNPJ real de um cliente para o teste.** Use os exemplos públicos (`11.222.333/0001-81`, `12.ABC.345/01DE-35`) ou gere com a própria função de DV.

## Na prática

Validadores de CNPJ, CPF, chave de NF-e e código de barras de boleto são os primeiros candidatos a TDD em um escritório: regra fechada, entrada pequena, consequência alta se errar. Depois que a função existe com testes, ela vira módulo reaproveitado em todo script de importação, e qualquer mudança futura (como o alfanumérico) é feita acrescentando testes e vendo o que quebra.

## Resumo

- TDD: teste falha (vermelho), implementação mínima (verde), refatoração.
- Com IA, peça os testes **antes** da função e proíba alterar testes para passar.
- `pytest` roda arquivos `test_*.py` e relata cada assert que falhou.
- CNPJ alfanumérico: 12 posições com dígitos ou letras maiúsculas, 2 DVs numéricos, valor = ASCII − 48, módulo 11.
- Testes cobrem caminho feliz e casos de borda; leia a falha antes de pedir correção.
