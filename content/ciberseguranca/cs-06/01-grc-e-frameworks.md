Nesta lição você vai entender o que é **GRC** (governança, risco e conformidade) e conhecer os três frameworks que organizam a segurança no mundo: a família **ISO/IEC 27001/27002**, o **NIST CSF 2.0** e os **CIS Controls v8**. Ao final, vai saber o que cada um é, como se estruturam e como escolher o que serve para a sua empresa ou para um cliente. Isso importa porque, a partir de agora, o curso deixa de perguntar "como configurar?" e passa a perguntar "como organizar, provar e manter?".

## GRC: o tripé

- **Governança** é quem decide, com que autoridade e com que prestação de contas. Sem governança, segurança vira iniciativa isolada do "menino da TI".
- **Risco** é a disciplina de identificar o que pode dar errado, quanto custaria e o que fazer a respeito (lição 2).
- **Conformidade** (*compliance*) é atender ao que a lei, o contrato ou a norma exigem: LGPD, cláusulas de clientes, requisitos da seguradora, uma certificação.

A analogia com a contabilidade é direta: governança são os sócios e o conselho; risco é a análise que precede cada decisão; conformidade é o SPED, a auditoria e as obrigações acessórias. Um **framework** é o "plano de contas" da segurança: uma estrutura pronta e reconhecida que diz o que deve existir.

## ISO/IEC 27001 e 27002

A **ISO/IEC 27001:2022** é a norma internacional **certificável** de **sistema de gestão de segurança da informação (SGSI)**. Um SGSI é o conjunto de políticas, processos, papéis e controles com que a empresa gere a segurança de forma contínua. A norma é curta e se divide em:

- **Cláusulas 4 a 10** (obrigatórias): contexto da organização, liderança, planejamento (incluindo avaliação e tratamento de riscos), suporte, operação, avaliação de desempenho e melhoria. É o ciclo **PDCA** (planejar, fazer, checar, agir).
- **Anexo A:** a lista de **93 controles** de referência, organizados em quatro temas: **organizacionais** (37), **de pessoas** (8), **físicos** (14) e **tecnológicos** (34). A empresa escolhe quais se aplicam e justifica cada exclusão na **Declaração de Aplicabilidade (SoA)**.

A **ISO/IEC 27002:2022** é a norma irmã, não certificável: um guia detalhado de **como implementar** cada um dos 93 controles. Em resumo, a 27001 diz "o que precisa existir"; a 27002 explica "como fazer".

### Certificação

Uma empresa que quer o certificado contrata um **organismo de certificação** acreditado. O processo tem a **auditoria de estágio 1** (documentação), a **de estágio 2** (evidências de que o SGSI funciona) e, após o certificado, **auditorias de manutenção** anuais em um ciclo de três anos, quando há a recertificação. Pequenas empresas raramente certificam; mas **usar a 27001 como estrutura** sem certificar é comum e valioso, inclusive para responder a questionários de clientes.

## NIST CSF 2.0

O **NIST Cybersecurity Framework** é o guia do instituto de padrões dos Estados Unidos, gratuito, voltado a qualquer organização, de qualquer tamanho. A versão **2.0** (fevereiro de 2024) organiza a segurança em **seis funções**:

| Função | Pergunta |
|---|---|
| **Govern** (Governar) | quem decide, qual a estratégia, quais os papéis e a política? |
| **Identify** (Identificar) | o que temos (ativos), o que vale, quais os riscos? |
| **Protect** (Proteger) | quais controles impedem o incidente? |
| **Detect** (Detectar) | como percebemos que algo aconteceu? |
| **Respond** (Responder) | o que fazemos quando acontece? |
| **Recover** (Recuperar) | como voltamos ao normal? |

A função *Govern* foi a grande novidade da 2.0: antes eram cinco, e a governança ficava diluída. Cada função se divide em categorias e subcategorias (por exemplo, PR.AA: gestão de identidades e acessos). O CSF não diz **como** implementar; ele é um mapa para organizar e medir, apontando para outras normas (27001, CIS) nos detalhes. Os módulos 5 e 6 deste curso seguem, propositalmente, essa ordem.

## CIS Controls v8

Os **CIS Controls** são a lista **mais prática** dos três: **18 controles**, cada um com salvaguardas concretas ("mantenha inventário de ativos", "exija MFA para acesso administrativo", "faça backup automatizado"). A versão 8 (2021, com a revisão 8.1 em 2024) traz os **grupos de implementação**:

- **IG1 (higiene essencial):** as 56 salvaguardas que **toda** empresa deveria ter, desenhadas para quem tem pouca equipe e pouco orçamento. É o ponto de partida ideal de um escritório contábil.
- **IG2:** empresas com equipe de TI e dados mais sensíveis.
- **IG3:** empresas com especialistas em segurança e alvos de ataques sofisticados.

Os primeiros controles são, nessa ordem: inventário de hardware; inventário de software; proteção de dados; configuração segura; gestão de contas; gestão de acessos; gestão de vulnerabilidades; gestão de logs. Repare como a lista coincide com tudo o que o curso ensinou.

## Como escolher

| Situação | Escolha |
|---|---|
| Pequena empresa começando do zero | **CIS Controls IG1**: lista curta, prática, gratuita |
| Precisa organizar e explicar a segurança à diretoria | **NIST CSF 2.0** como mapa, com os CIS como detalhe |
| Cliente ou mercado exige certificado | **ISO 27001** (com a 27002 para implementar) |
| Dados pessoais em escala | qualquer um dos três **mais** a LGPD (lições 3 e 4) |

Os três se mapeiam entre si: o CIS publica tabelas de correspondência com a 27001 e o CSF. Na prática, uma empresa pequena usa o CIS IG1 como lista de tarefas, o CSF para apresentar o estado para os sócios e, se crescer, migra para a 27001.

## Erros comuns

- Começar pela certificação em vez de pelos controles: certificado sem controle real é papel.
- Confundir 27001 (certificável, o que ter) com 27002 (guia, como fazer).
- Dizer "somos NIST" ou "somos CIS": nenhum dos dois certifica; são referências de autoavaliação.
- Tratar o framework como fim: o objetivo é reduzir risco, e o framework é só o roteiro.
- Ignorar *Govern*: segurança sem alguém responsável e com orçamento não se sustenta.

## Na prática

Para o escritório, baixe o documento dos CIS Controls v8 (gratuito), marque as 56 salvaguardas do IG1 como "feito", "parcial" ou "não feito", e leve a planilha aos sócios organizada pelas seis funções do CSF. Em uma hora você tem um diagnóstico com linguagem que o mercado reconhece.

## Resumo

- GRC: governança (quem decide), risco (o que pode dar errado) e conformidade (o que a lei e os contratos exigem).
- ISO/IEC 27001:2022 é certificável (cláusulas 4–10 + Anexo A com 93 controles em 4 temas); a 27002 explica como implementar.
- NIST CSF 2.0: seis funções (Govern, Identify, Protect, Detect, Respond, Recover); mapa, não manual.
- CIS Controls v8: 18 controles com grupos de implementação; IG1 é o ponto de partida de uma pequena empresa.
- Escolha pelo tamanho e pela exigência externa; os três se mapeiam entre si.
