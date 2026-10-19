Nesta lição você vai reconhecer os sinais de que o no-code chegou ao limite (lock-in, performance, custo escalando), aprender a exportar os seus dados de forma segura, decidir quando é hora de partir para o vibe coding e conhecer o modelo **híbrido**, que combina no-code com pequenos scripts. Isso importa porque sistemas crescem; saber sair de uma ferramenta sem perder dados é tão importante quanto saber entrar.

## O que é lock-in

**Lock-in** (aprisionamento) é a dificuldade de sair de uma ferramenta depois de depender dela. Acontece quando os dados, a lógica e as telas estão todos dentro de um serviço que só exporta uma parte, cobra por sair ou simplesmente deixa de existir.

A analogia: um sistema contábil que guarda seus lançamentos em formato próprio e só exporta PDF. Trocar de sistema significa redigitar anos de histórico. Em no-code, o risco é o mesmo, e a proteção começa no primeiro dia.

Os três níveis de lock-in, do mais leve ao mais grave:

1. **Dados**: a ferramenta exporta CSV ou JSON? Com os anexos? Se sim, o lock-in é leve.
2. **Lógica**: fórmulas, automações e workflows raramente exportam. Você vai refazê-los em outro lugar; por isso documente cada regra em texto.
3. **Telas**: nunca exportam. Mas telas são a parte mais rápida de reconstruir, especialmente com IA.

## Sinais de que chegou ao limite

Fique atento a estes sintomas; cada um é um aviso de que o sistema está pedindo outra abordagem:

- **Lentidão**: listas que demoram segundos para abrir, automações que atrasam minutos. Bancos no-code têm limites de registros e de chamadas por minuto; conferir os limites atuais na documentação faz parte do planejamento.
- **Gambiarras**: uma regra simples precisou de três automações e duas tabelas auxiliares. Quando a solução é mais complicada que o problema, a ferramenta não é a certa.
- **Custo escalando com usuários**: a cobrança por assento ou por execução cresce mais rápido que a receita que o sistema gera.
- **Integração que não existe**: você precisa falar com um sistema (do governo, do banco, do ERP) que a ferramenta não alcança.
- **Exigência de controle**: auditoria detalhada, dados em servidor próprio, regras de retenção específicas.
- **Dependência de uma pessoa**: só quem montou entende os workflows. Isso não é limite da ferramenta, mas é limite do sistema.

Um ou dois sinais pedem ajuste; três ou mais pedem plano de migração.

## Exportar dados com segurança

Antes de qualquer migração, e também como rotina de backup, exporte:

1. **Cada tabela em CSV** (ou JSON, se a ferramenta oferecer), com todos os campos, inclusive os identificadores internos. Os identificadores são o que mantém os vínculos entre tabelas: na tabela Honorários, o campo "Cliente" exportado traz o identificador ou o nome do cliente; você precisa de um dos dois para reconstruir a ligação.
2. **Os anexos**. Muitas ferramentas exportam apenas o link para o arquivo, e o link pode expirar. Baixe os arquivos e guarde-os em pasta organizada por cliente e data.
3. **A documentação da lógica**: um documento com cada fórmula, cada automação (gatilho, ações, mapeamento) e cada regra de permissão, em português claro.
4. **Teste a importação** em uma ferramenta vazia (até uma planilha serve) e confira que os vínculos se reconstroem.

Faça isso **periodicamente**, não só ao migrar. Um backup mensal exportado automaticamente por uma automação é barato e evita o dia em que a ferramenta muda de dono, de preço ou de política.

```text
Exportei do Airtable três tabelas em CSV: clientes.csv, honorarios.csv e tarefas.csv.
Em honorarios.csv, a coluna "Cliente" traz o nome do cliente, não o identificador.
Explique, passo a passo, como garantir que cada honorário continue ligado ao cliente certo
ao importar em outro sistema, e quais problemas posso ter com nomes duplicados ou alterados.
```

## Quando partir para o vibe coding

O módulo seguinte ensina a construir com IA gerando código. Faz sentido migrar quando:

- A lógica ficou complexa demais para blocos visuais, mas cabe em algumas centenas de linhas de código.
- O custo por usuário do no-code supera o custo de hospedar algo próprio.
- Você precisa de integrações específicas que só existem por API.
- Você quer ser dono do sistema: código no seu repositório, dados no seu banco.

E **não** faz sentido quando o no-code funciona bem e o único motivo é "parece mais profissional". Código também tem custo: manutenção, segurança, atualizações. Migre por limite real, não por vaidade.

Uma migração bem feita raramente é tudo de uma vez. Comece por uma parte (o cálculo complicado, a integração que faltava) e deixe o resto onde está.

## O modelo híbrido

**Híbrido** é usar no-code para o que ele faz bem (banco, telas, formulários, login) e pequenos **scripts** para o que ele não faz. Um script é um programa curto, muitas vezes em Python, que a IA ajuda a escrever, e que roda em algum lugar (seu computador, um serviço de automação, um servidor barato).

Exemplos de híbrido em um escritório:

- O Airtable guarda os clientes; um script em Python lê a tabela pela API, consulta uma situação cadastral no site do governo e grava o resultado de volta.
- O Softr é o portal; um script gera o PDF do demonstrativo mensal com formatação que o no-code não consegue e o anexa ao registro.
- O Make dispara a automação; um passo de código no meio faz um cálculo que os blocos visuais tornariam ilegível.

O híbrido é, para muitos escritórios, o destino final: nem tudo em no-code, nem tudo em código. Cada parte na ferramenta certa, conversando por integrações. É a aplicação direta da anatomia da lição 1.

## Erros comuns

- **Descobrir o lock-in na hora de sair.** Teste a exportação no primeiro mês, não no último.
- **Exportar sem anexos.** Os links expiram; os arquivos somem.
- **Migrar tudo de uma vez.** Migre a parte que dói; mantenha o resto funcionando.
- **Não documentar a lógica.** Fórmulas e automações não exportam; se não estão escritas, serão redescobertas na dor.

## Na prática

Um escritório com 150 clientes no portal viu o custo por usuário do construtor subir e a lista de documentos ficar lenta. Em vez de reescrever tudo, migrou apenas o portal do cliente para uma aplicação gerada com IA, ligada ao mesmo Airtable que a equipe continuou usando por dentro. Exportação mensal já estava automatizada; a lógica estava documentada. A migração levou três semanas e não perdeu nenhum registro.

## Resumo

- Lock-in tem três níveis: dados (exportáveis), lógica (documente) e telas (reconstruíveis).
- Sinais de limite: lentidão, gambiarras, custo escalando, integração inexistente, exigência de controle.
- Exporte tabelas com identificadores, baixe anexos, documente a lógica e teste a importação; faça isso como rotina.
- Migre para vibe coding por limite real, uma parte de cada vez.
- O modelo híbrido combina no-code com scripts; costuma ser o destino final.
