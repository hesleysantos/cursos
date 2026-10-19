Nesta lição você vai aprender a modelar os dados do seu sistema antes de construir qualquer tela: como dividir a informação em tabelas, escolher o tipo certo de cada campo, criar chaves e relacionamentos, e evitar a repetição que faz todo controle quebrar. Vai também comparar os bancos no-code mais usados (Airtable, Google Sheets, Notion e Baserow). Isso importa porque dados bem modelados tornam todo o resto fácil; dados mal modelados tornam tudo impossível, por mais bonita que seja a ferramenta.

## Por que dados primeiro

Imagine o arquivo físico de um escritório: uma pasta por cliente, com guias, contratos e recibos. Se o contrato de um cliente for guardado na pasta de outro, nada funciona. Um sistema é igual: as telas só mostram o que está nas tabelas; tabela confusa, tela confusa.

Modelar dados significa responder três perguntas: **quais coisas existem** (clientes, honorários, tarefas), **o que sabemos de cada uma** (campos) e **como elas se ligam** (relacionamentos).

## Tabelas: uma por "coisa"

A regra é simples: **cada tipo de coisa ganha uma tabela, e cada linha é uma coisa só**. Para um controle de honorários do escritório:

- **Clientes**: uma linha por empresa atendida.
- **Honorários**: uma linha por cobrança mensal (cliente, competência, valor, situação).
- **Tarefas**: uma linha por obrigação a fazer (cliente, descrição, prazo, responsável).

O erro mais comum de quem vem da planilha é fazer uma tabela gigante com tudo: nome do cliente, CNPJ, telefone, valor de janeiro, valor de fevereiro, valor de março... Em abril é preciso criar coluna nova; o telefone do cliente é digitado em dezenas de linhas; se mudar, alguém esquece uma. Separar em tabelas resolve isso de vez.

## Campos e tipos

Cada coluna de uma tabela é um **campo**, e cada campo tem um **tipo**. O tipo diz ao sistema o que pode ser guardado ali e como tratar o valor. Escolher o tipo certo evita que "1.500,00" vire texto e não some, ou que uma data seja digitada como "15/3" numa linha e "março" na outra.

| Tipo | Serve para | Exemplo no escritório |
|---|---|---|
| Texto curto | Nomes, códigos | Razão social, CNPJ |
| Texto longo | Observações | Histórico de atendimento |
| Número | Quantidades e valores | Valor do honorário |
| Data | Prazos, competências | Vencimento da guia |
| Seleção única | Status com opções fixas | Regime: Simples, Presumido, Real |
| Seleção múltipla | Várias etiquetas | Serviços contratados |
| Caixa de seleção | Sim ou não | Cliente ativo? |
| Anexo | Arquivos | Contrato em PDF |
| Vínculo (link) | Ligar a outra tabela | Cliente da tarefa |
| Fórmula | Calcular a partir de outros campos | Dias em atraso |

> **Dica:** se um campo vai aparecer em filtro ou gráfico, não use texto livre. "Simples Nacional", "simples" e "SN" são três valores diferentes para o sistema. Use seleção única.

## Chaves: cada linha precisa de identidade

Uma **chave primária** é o campo que identifica uma linha sem ambiguidade. Em bancos no-code, toda linha ganha um identificador interno automático; você raramente precisa criá-lo. Mas vale definir também um identificador que faça sentido para as pessoas: o CNPJ para clientes, um código como "HON-2026-03-015" para honorários.

Por que não usar o nome como chave? Porque nomes se repetem, mudam de grafia e têm erro de digitação. "Padaria Central Ltda" e "Padaria Central LTDA" seriam dois clientes.

## Relacionamentos: ligar tabelas

Depois de separar as tabelas, é preciso ligá-las. É aqui que entra o campo de **vínculo** (em inglês, *link* ou *relation*). Na tabela Honorários, o campo "Cliente" não é um texto digitado: é um vínculo que aponta para uma linha da tabela Clientes. Mude a razão social na tabela Clientes, e todos os honorários passam a mostrar o nome novo.

Existem dois tipos que você vai usar o tempo todo:

- **Um para muitos**: um cliente tem muitos honorários; cada honorário pertence a um cliente só. É o mais comum.
- **Muitos para muitos**: um cliente pode ter vários serviços contratados, e cada serviço é contratado por vários clientes. Resolve-se com um campo de vínculo que aceita várias linhas, ou com uma terceira tabela ("Contratos") quando é preciso guardar informação sobre a ligação, como valor e data de início.

## Normalizar, sem o jargão

"Normalização" é o nome técnico para um conjunto de regras que evitam repetição. Você não precisa dos nomes das formas normais; precisa de três hábitos:

1. **Cada informação em um lugar só.** O telefone do cliente fica na tabela Clientes, nunca em Honorários.
2. **Uma coisa por célula.** Não escreva "DAS, DCTF, SPED" num campo de texto; use seleção múltipla ou linhas separadas.
3. **Sem colunas que são datas disfarçadas.** "Janeiro", "Fevereiro", "Março" como colunas significa que deveriam ser linhas com um campo de data.

Peça ajuda à IA para revisar o seu modelo:

```text
Vou criar um sistema no-code para um escritório contábil. Estas são as tabelas e campos que
pensei: [cole a lista]. Revise como um analista de dados: aponte informação repetida, campos
que deveriam ser vínculo entre tabelas, tipos de campo errados e o que falta para controlar
honorários mensais por cliente. Explique cada sugestão em uma frase.
```

## Bancos no-code: qual usar

| Banco | Ponto forte | Atenção |
|---|---|---|
| Airtable | Tipos de campo ricos, vínculos, visualizações, muitas integrações | Limites de registros por plano; conferir a documentação atual |
| Google Sheets | Gratuito, todo mundo conhece, integra com tudo | Não é banco de verdade: sem tipos fortes nem vínculos; cuidado com volume e edição simultânea |
| Notion | Ótimo para documentação e bancos leves juntos | Menos adequado para muitos relacionamentos e volume |
| Baserow | Código aberto, pode ser hospedado por você; parecido com Airtable | Exige um pouco mais de configuração se for hospedar |

Para os projetos deste módulo usaremos o **Airtable**, porque seus campos e vínculos ensinam o raciocínio que vale para qualquer banco. Se preferir não depender de serviço estrangeiro, o Baserow aplica os mesmos conceitos.

## Erros comuns

- **Guardar valores em texto.** "R$ 1.500,00" não soma. Número puro, formatação na tela.
- **Vincular pelo nome digitado.** Use o campo de vínculo, não um texto com o nome do cliente.
- **Uma tabela para cada mês.** Mês é um campo de data, não uma tabela nova.

## Na prática

Um escritório migrou seu controle de honorários de uma planilha com 40 colunas para três tabelas no Airtable. Resultado: total em aberto por cliente, inadimplentes atualizados por fórmula e zero cadastro duplicado. Modelar levou uma tarde; importar, outra.

## Resumo

- Modele dados antes das telas: coisas, campos e ligações.
- Uma tabela por tipo de coisa; uma linha por item; uma informação por célula.
- Escolha o tipo de cada campo; use seleção para status e vínculo para ligar tabelas.
- Um para muitos resolve quase tudo; muitos para muitos pede vínculo múltiplo ou tabela intermediária.
- Airtable e Baserow ensinam o raciocínio; Sheets e Notion servem para casos leves.
