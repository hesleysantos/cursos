Nesta lição você vai aprender o que são dados estruturados e por que automações só funcionam bem com eles: tabelas com colunas definidas, arquivos CSV e JSON, campos com tipos, identificadores únicos e formatos de data e valor. Ao final, você saberá por que uma "planilha bagunçada" trava qualquer automação e vai escrever uma função em Python que converte "1.234,56" em número. Isso importa porque a maior parte das automações que falham no escritório falha por dados, não por ferramenta.

## Dados estruturados: a mesma coisa sempre no mesmo lugar

Dados estruturados são dados organizados em **campos** definidos, com um **tipo** definido, sempre na mesma posição. Uma tabela de clientes com as colunas `cnpj`, `razao_social`, `regime` e `email` é estruturada. Um e-mail em que o cliente escreveu "oi, segue o CNPJ da nova empresa, é 12.345.678/0001-90, me liga" não é.

Pense num **armário de arquivos**. Se cada gaveta tem etiqueta e cada pasta está na gaveta certa, qualquer pessoa (ou robô) acha o que procura. Se os documentos estão empilhados numa caixa, só quem empilhou sabe onde está cada coisa.

## Tabelas, campos e tipos

A forma mais comum de dado estruturado é a **tabela**: linhas são registros (um cliente, uma nota, uma guia); colunas são campos. Cada campo tem um **tipo**:

| Tipo | O que guarda | Exemplo |
|---|---|---|
| Texto (string) | Letras, números e símbolos como texto | `"Padaria Pão Quente ME"` |
| Número inteiro | Contagens, sem casas decimais | `12` |
| Número decimal | Valores com casas decimais | `1234.56` |
| Data | Um dia do calendário | `2026-03-20` |
| Booleano | Verdadeiro ou falso | `true` (cliente ativo) |

O tipo importa porque define o que a automação pode fazer. Se o valor da guia está guardado como texto `"R$ 1.234,56"`, a ferramenta não consegue somar; precisa primeiro converter. Se a data está como `"20/3"`, não dá para saber o ano.

> **Atenção:** CNPJ, CPF, CEP e número de telefone devem ser guardados como **texto**, não como número. Como número, o zero à esquerda some (`04.690.098` vira `4690098`) e planilhas podem exibir em notação científica.

## Identificadores únicos

Um **identificador único** (ID) é um campo que nunca se repete e nunca muda. No escritório, o CNPJ é o ID natural de uma empresa; o CPF, de uma pessoa; o número mais a série, de uma nota fiscal. Automações usam IDs para responder "esse registro já existe?". Sem ID, o fluxo cadastra o mesmo cliente duas vezes porque alguém escreveu "Padaria Pão Quente" numa linha e "PADARIA PAO QUENTE ME" na outra.

Quando não existe ID natural, crie um: um número sequencial ou um código gerado pela ferramenta.

## CSV e JSON: os dois formatos que você vai encontrar

**CSV** (*comma-separated values*, valores separados por vírgula) é uma tabela em texto puro: uma linha por registro, campos separados por vírgula (ou ponto e vírgula, muito comum no Brasil porque a vírgula é o separador decimal):

```
cnpj;razao_social;regime;email
12345678000190;Padaria Pão Quente ME;Simples Nacional;financeiro@paopquente.com.br
98765432000111;Clínica Vida Ltda;Lucro Presumido;contato@clinicavida.com.br
```

Praticamente todo sistema exporta e importa CSV. É o formato de troca entre planilha e automação.

**JSON** (*JavaScript Object Notation*) é o formato que APIs usam para conversar (você verá APIs na próxima lição). Em vez de colunas, usa pares `"campo": valor` entre chaves, e listas entre colchetes:

```json
{
  "cnpj": "12345678000190",
  "razao_social": "Padaria Pão Quente ME",
  "regime": "Simples Nacional",
  "ativo": true,
  "socios": [
    { "nome": "Maria Silva", "percentual": 60 },
    { "nome": "João Souza", "percentual": 40 }
  ]
}
```

Repare que o JSON aceita **aninhamento**: dentro de um cliente há uma lista de sócios, cada um com seus campos. Uma planilha não representa isso bem; o JSON, sim. Em Make e n8n você verá JSON o tempo todo ao olhar o que cada passo recebeu e devolveu.

## Datas e valores: Brasil versus o resto do mundo

Aqui está a origem de metade dos erros em automações brasileiras:

| | Formato brasileiro | Formato internacional (ISO / sistemas) |
|---|---|---|
| Data | `20/03/2026` | `2026-03-20` |
| Valor | `1.234,56` | `1234.56` |
| Separador de milhar | ponto | nenhum ou vírgula |
| Separador decimal | vírgula | ponto |

A data `03/04/2026` é 3 de abril no Brasil e 4 de março nos Estados Unidos. O formato ISO `2026-04-03` (ano-mês-dia) não tem ambiguidade e ordena corretamente em qualquer lista, por isso é o padrão em bancos de dados e APIs. Regra de ouro: **guarde e transporte em ISO; mostre ao usuário em formato brasileiro**.

Com valores, o problema é o inverso: ferramentas internacionais leem `1.234,56` como texto, ou pior, como `1.234` (um vírgula duzentos e trinta e quatro, porque para elas o ponto é o separador decimal). Por isso toda automação que recebe valores de planilhas brasileiras precisa de um passo de conversão.

## Convertendo "1.234,56" em número com Python

A conversão tem três passos: tirar o ponto de milhar, trocar a vírgula por ponto, transformar em número.

```python
def brl_para_numero(texto):
    """Converte '1.234,56' (ou 'R$ 1.234,56') em 1234.56."""
    limpo = texto.replace("R$", "").strip()
    limpo = limpo.replace(".", "")      # remove separador de milhar
    limpo = limpo.replace(",", ".")     # vírgula decimal vira ponto
    return float(limpo)

print(brl_para_numero("1.234,56"))        # 1234.56
print(brl_para_numero("R$ 10.500,00"))    # 10500.0
print(brl_para_numero("0,99"))            # 0.99
```

Saída:

```
1234.56
10500.0
0.99
```

A ordem importa: se você trocasse a vírgula por ponto antes de remover os pontos, `"1.234,56"` viraria `"1.234.56"`, e a remoção de pontos deixaria `"123456"`.

## Por que a planilha bagunçada trava tudo

Uma automação lê a planilha esperando que a coluna C seja o CNPJ e a coluna F seja o valor. Se alguém:

- inseriu uma coluna no meio,
- deixou uma linha em branco separando grupos,
- escreveu "a confirmar" na coluna de valor,
- juntou nome e CNPJ na mesma célula,
- mesclou células para fazer um título bonito,

o fluxo para, ou pior, continua rodando com dados errados. A regra: **planilha que alimenta automação é banco de dados, não relatório**. Uma linha de cabeçalho, uma linha por registro, uma informação por célula, sem células mescladas, sem totais no fim.

## Erros comuns

- Guardar CNPJ como número e perder o zero à esquerda.
- Misturar `20/03/2026` e `2026-03-20` na mesma coluna.
- Usar o nome do cliente como identificador em vez do CNPJ.
- Colocar totais e observações dentro da tabela de dados.
- Exportar CSV com vírgula como separador e valores com vírgula decimal, o que embaralha as colunas.

## Na prática

Antes de automatizar, abra a planilha que alimenta o processo e faça uma "faxina estrutural": uma aba só de dados, cabeçalho na linha 1, IDs em texto, datas em ISO, valores sem "R$". Se a fonte é um sistema, verifique como ele exporta (separador? formato de data?). Essa preparação costuma ser metade do projeto.

## Resumo

- Dado estruturado: campos definidos, tipos definidos, sempre na mesma posição.
- CNPJ, CPF, CEP e telefone são texto. Valores e datas precisam de tipo correto.
- Identificador único (CNPJ, número da nota) é o que evita duplicidade.
- CSV troca tabelas; JSON é a língua das APIs e aceita aninhamento.
- Guarde datas em ISO (`2026-03-20`) e valores com ponto decimal; converta "1.234,56" removendo o ponto e trocando a vírgula.
