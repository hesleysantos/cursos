Nesta lição você vai aprender a revisar código gerado pelo Claude Code como um revisor profissional: pedir uma revisão crítica (bugs, segurança, casos de borda), dividir diffs grandes em partes, pedir uma segunda opinião em outra sessão, usar um checklist humano e reconhecer os erros que a IA costuma cometer. Revisão é o último filtro antes do commit. Em um escritório contábil, um script que roda certo 99 vezes e erra na centésima custa mais do que o tempo de revisá-lo.

## Por que revisar o que "já funciona"

Testes verificam o que você pensou em testar. A revisão procura o que você não pensou: a divisão por zero quando o cliente não tem lançamentos, a senha que foi parar no código, o `except Exception: pass` que engole o erro. O Claude Code é um ótimo autor e um bom revisor, mas não deve revisar o próprio trabalho na mesma conversa sem instrução clara, porque tende a defender as escolhas que acabou de fazer.

## O prompt de revisão crítica

```text
Faça uma revisão crítica do diff atual (git diff), como um revisor sênior que
não confia no autor. Liste, em ordem de gravidade:
1. bugs prováveis, com o cenário que os dispara;
2. riscos de segurança (segredos no código, caminhos vindos de entrada sem
   validação, comandos montados com texto externo);
3. casos de borda não tratados (lista vazia, None, texto onde se espera número,
   datas em formato diferente, arquivo inexistente, duplicados);
4. problemas de legibilidade.
Para cada item: arquivo, linha, por que é problema e a correção sugerida.
Não altere nada ainda.
```

A frase "não altere nada ainda" separa revisão de correção. Você lê a lista, decide o que aceita e só então pede as mudanças, uma por vez, cada uma com teste.

O Claude Code também traz um comando próprio de revisão: `/code-review` (e o atalho `/review`) revisa o diff atual ou um branch e aceita níveis de profundidade. Vale usar; os critérios acima continuam valendo para interpretar o resultado.

## Diffs grandes: revise em partes

Um diff de 500 linhas não é revisável de uma vez, nem por você nem pelo modelo. Divida por arquivo ou por tema:

```text
Revise apenas as mudanças em leitura.py, ignorando o resto do diff. Foque em
como valores e datas são convertidos.
```

```text
Agora apenas em gravacao.py. Foque em: o arquivo de saída pode sobrescrever
algo existente? Os totais são calculados dos mesmos registros que foram
gravados?
```

Se o diff é grande porque o passo foi grande, o problema começou no planejamento: volte à lição 1 e peça passos menores na próxima vez.

## Segunda opinião: outra sessão

Uma revisão independente vem de um contexto que não viu a conversa. Abra uma segunda sessão do Claude Code (outro terminal na mesma pasta, ou `/clear` para zerar o contexto da atual) e peça:

```text
Você não participou da escrita deste código. Leia consolidar.py e tests/ e
responda: o que este programa faz? Quais regras de negócio ele implementa?
Em que situações ele produziria um número errado sem dar erro?
```

A pergunta "o que este programa faz?" é um teste de legibilidade: se a descrição que volta não bate com a sua especificação, ou o código está errado ou está ilegível. "Número errado sem dar erro" é a pergunta mais valiosa em contabilidade: um script que quebra é melhor do que um que soma errado em silêncio.

## O checklist humano

A revisão da IA não substitui a sua. Antes de commitar, passe por esta lista, olhando o diff no Git (no VS Code ou com `git diff`):

- **Regra de negócio:** a conta está certa? Arredondamento, competência, sinal de débito e crédito.
- **Dados reais:** nenhum CNPJ, nome ou valor real ficou em teste, comentário ou exemplo.
- **Segredos:** nenhuma senha, token ou caminho pessoal no código; `.env` no `.gitignore`.
- **Entradas externas:** caminhos e nomes vindos de arquivo ou argumento são validados antes de abrir ou executar algo.
- **Erros:** o que acontece quando o arquivo não existe, a aba não existe, a célula está vazia?
- **Saídas:** o script sobrescreve arquivos? Avisa? Gera em pasta separada?
- **Testes:** os testes novos testam o comportamento ou só repetem a implementação?
- **Mensagem de commit:** explica o porquê, não só o quê.

## O que a IA costuma errar

Padrões que aparecem com frequência em código gerado e que valem uma olhada dirigida:

- **`except Exception: pass`** ou `except:` genérico que esconde a causa; peça exceções específicas e log.
- **Conversão otimista**: `float(x)` sem tratar `"R$"`, vírgula ou célula vazia.
- **Caminhos absolutos** da máquina em que foi gerado, ou barra invertida em string.
- **Datas**: `strptime` com formato americano, ou `date.today()` dentro de função sem parâmetro, impossível de testar.
- **Ponto flutuante em dinheiro** com comparações `==` entre floats; use arredondamento explícito ou `Decimal` onde a igualdade importa.
- **Escopo que cresce**: você pediu uma função e vieram três "melhorias" não pedidas, cada uma com um risco novo.
- **Testes que só cobrem o caminho feliz** e asserts fracos (`assert resultado`).
- **Dependência nova** instalada "para facilitar" sem necessidade.

## Erros comuns na revisão

- Ler só o resumo do Claude ("implementei X, Y e Z") e não o diff.
- Aprovar porque os testes passaram; os testes testam o que você pediu.
- Pedir revisão e correção no mesmo prompt; a correção acontece antes de você decidir.
- Revisar cansado um diff grande; divida ou deixe para a próxima sessão.

## Na prática

Rotina de fechamento de uma funcionalidade: testes verdes, `/code-review` ou o prompt de revisão crítica, lista lida e triada, correções uma a uma com teste, segunda opinião em sessão limpa para o que mexe com dinheiro, checklist humano, commit. Parece muito; são dez a quinze minutos para algo que vai rodar todo mês.

## Resumo

- Revisão busca o que os testes não cobrem: bugs, segurança, bordas, legibilidade.
- Peça a revisão como lista ordenada por gravidade e proíba alterações até você decidir.
- Divida diffs grandes por arquivo ou tema; segunda opinião em sessão sem contexto.
- Use o checklist humano, com atenção especial a regra de negócio, dados reais e segredos.
- Conheça os erros típicos da IA (exceções genéricas, conversão otimista, caminhos, datas, floats, escopo).
