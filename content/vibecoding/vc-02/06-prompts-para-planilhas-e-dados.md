Nesta lição você vai usar IA para o que mais ocupa o dia de um contador: planilhas e dados. Vai aprender a pedir fórmulas do Excel e do Google Sheets, a analisar uma tabela colada, a limpar dados bagunçados, a montar um plano de contas inicial e a pedir a explicação de um balancete. Também vai entender o limite mais importante desta área: o modelo é ótimo em escrever a fórmula e ruim em fazer a conta de cabeça.

## Fórmulas do Excel e do Sheets

Pedir uma fórmula é uma das tarefas em que o modelo mais acerta, porque fórmulas são texto com regras fixas, exatamente o que ele aprendeu bem. O que faz diferença é descrever **a estrutura da planilha** (quais colunas, quais linhas) e **a versão** (Excel em português usa `;` como separador de argumentos e nomes traduzidos, como `SE` e `PROCV`; o Sheets aceita os mesmos nomes em português).

```text
Tenho uma planilha no Excel em português. Coluna A: data do pagamento;
coluna B: valor; coluna C: categoria (texto). Na célula F2 quero a soma
dos valores da categoria "FOLHA" apenas no mês de setembro de 2026.
Escreva a fórmula e explique cada parte em uma linha.

Resposta esperada (resumo):
Uma fórmula com SOMASES usando intervalos de data (">=" 01/09/2026 e
"<=" 30/09/2026) e o critério de categoria, com a explicação de cada
argumento. Verificação: colar na planilha e testar com um valor que
você sabe de cabeça.
```

Se a fórmula der erro, cole a mensagem de erro e a fórmula de volta: "deu #NOME? com esta fórmula; minha versão é o Excel do Microsoft 365 em português". O modelo costuma corrigir de primeira. Peça sempre a **explicação**: você aprende e consegue adaptar na próxima vez sem perguntar.

## Analisar uma tabela colada

Você pode colar uma tabela (copiada do Excel, vem separada por tabulações) e pedir análise. Funciona bem para tabelas pequenas (dezenas de linhas). Para centenas de linhas, prefira anexar o arquivo numa ferramenta que **execute código** sobre ele, ou peça ao modelo a fórmula ou o script e rode você mesmo.

```text
A tabela abaixo tem as despesas de um cliente por mês e categoria.
Identifique: (1) as três categorias que mais cresceram do primeiro para
o último mês, em percentual; (2) qualquer mês em que uma categoria tenha
ficado zerada; (3) duas perguntas que eu deveria fazer ao cliente.
Mostre o cálculo dos percentuais. Não arredonde antes do resultado final.

[tabela colada]

Resposta esperada (resumo):
Três categorias com o percentual e a conta mostrada, meses com zero
identificados, e duas perguntas pertinentes ("a categoria X zerou em
julho: houve troca de fornecedor?"). Verificação de nível alto para os
números: confira um ou dois percentuais na planilha.
```

> **Atenção:** o modelo pode errar somas e percentuais feitos "no texto", especialmente com muitas linhas. Quando a ferramenta oferece análise com código (muitas mostram um aviso de que estão executando código sobre os dados), a conta fica confiável; sem isso, trate números como rascunho.

## Limpar dados

Dados que chegam do cliente vêm sujos: CNPJ com e sem pontuação, datas em formatos misturados, nomes em maiúsculas e minúsculas, espaços extras. O modelo pode **limpar diretamente** (listas pequenas) ou **escrever a regra** para você aplicar (listas grandes).

```text
Padronize a lista abaixo: CNPJ no formato 00.000.000/0000-00, datas em
DD/MM/AAAA, nomes com iniciais maiúsculas, sem espaços duplicados. Devolva
em tabela com as colunas Original | Padronizado | Observação. Se algum
item não puder ser padronizado com segurança (por exemplo, data ambígua
como 03/04/2026 sem saber se é dia/mês ou mês/dia), marque "VERIFICAR"
na observação e não altere.

[lista]

Resposta esperada (resumo):
Tabela com os itens limpos e os ambíguos marcados. A coluna "Original"
permite conferir cada linha. Para listas grandes, peça em seguida:
"escreva uma fórmula do Excel que faça a padronização do CNPJ".
```

## Criar um plano de contas inicial

O modelo conhece a estrutura típica de planos de contas e produz um ponto de partida razoável, que você adapta.

```text
Monte um plano de contas resumido para uma empresa de serviços de
manutenção de ar-condicionado, Simples Nacional, com 6 funcionários e
2 veículos. Estrutura: Ativo, Passivo, Patrimônio Líquido, Receitas,
Custos e Despesas, com códigos numéricos de 3 níveis (1, 1.1, 1.1.01).
Inclua contas específicas da atividade (peças, combustível, manutenção
de veículos). Máximo de 60 contas. Formato: tabela Código | Conta | Uso.

Resposta esperada (resumo):
Uma tabela organizada e coerente, com contas da atividade. Ajustes
típicos: alinhar com a nomenclatura do sistema contábil, remover o que
não se aplica, acrescentar contas exigidas pelo escritório.
```

## Explicar um balancete

Explicar números para quem não é da área é um uso excelente — desde que o modelo receba os números e não tenha de inventá-los.

```text
O balancete abaixo é de um cliente de comércio (Simples Nacional). Explique
para o dono, em até 10 linhas, sem jargão: (1) se a empresa deu lucro no
período, (2) quanto ela tem em caixa e bancos em relação ao que deve a
fornecedores e (3) um ponto de atenção. Use só os números do balancete;
não calcule índices que não estejam diretamente nos dados.

[balancete colado]

Resposta esperada (resumo):
Uma explicação em linguagem simples, com os três pontos e os números do
próprio balancete. Verificação: conferir que cada valor citado existe
no balancete e que "lucro" e "dívida" foram lidos das contas certas.
```

## Erros comuns

1. **Não dizer a estrutura da planilha.** O modelo chuta colunas e a fórmula não bate.
2. **Não informar a versão/idioma.** Fórmulas em inglês com vírgula não funcionam no Excel em português.
3. **Pedir cálculo de centenas de linhas "no texto".** Use código, fórmula ou ferramenta que executa.
4. **Aceitar o plano de contas sem adaptar ao sistema.** O modelo não conhece o seu sistema contábil.
5. **Colar o balancete do cliente com nome e CNPJ numa conta sem garantia de dados.** Anonimize ou use a conta corporativa (módulo 1).

## Na prática

Comece pelas fórmulas: cada vez que travar numa, descreva a planilha e peça com explicação. Em uma semana, você terá resolvido problemas que antes esperavam "alguém que entende de Excel". Depois, experimente a limpeza de dados num cadastro real (anonimizado) e, por fim, a explicação de balancete para um cliente — mostre ao sócio antes de enviar. Nos próximos módulos, essas mesmas tarefas vão virar scripts e automações; o prompt que você escreve agora é o rascunho delas.

## Resumo

- Fórmulas: descreva colunas, versão e idioma, peça explicação; cole o erro de volta se falhar.
- Tabelas pequenas podem ser analisadas no chat; tabelas grandes pedem código ou fórmula.
- O modelo erra contas feitas "no texto"; números são rascunho até conferência ou execução por código.
- Limpeza de dados: tabela Original | Padronizado | Observação, com "VERIFICAR" para casos ambíguos.
- Plano de contas e explicação de balancete: pontos de partida excelentes, sempre adaptados e conferidos.
