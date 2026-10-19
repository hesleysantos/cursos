# Governança, LGPD e auditoria

Nesta lição você vai aprender a manter as automações sob controle: **inventário** com dono, **segredos** com rotação, **trilhas de auditoria**, **retenção**, **contratos com fornecedores de IA**, onde a **revisão humana é obrigatória** por responsabilidade do contador, e a **política de automação** de uma página. Ao final, você terá o esqueleto dessa política e saberá o que a LGPD exige de quem automatiza com dados de clientes.

## Inventário de automações

Governança responde: o que existe, quem cuida, o que acessa o quê, o que fica registrado e por quanto tempo. Começa pelo inventário.

Uma tabela, uma linha por automação: nome, o que faz, **dono** (uma pessoa, não "o TI"), ferramenta, sistemas e dados que acessa, provedor de IA se houver, nível de risco (lê, escreve, envia, paga), última revisão, link para documentação e runbook. Sem dono, não há a quem perguntar quando quebra. Revise a cada trimestre e desligue o que ninguém usa.

## LGPD aplicada à automação

A Lei 13.709/2018 vale para qualquer tratamento de dados pessoais; com automação, a escala muda: um erro se repete milhares de vezes. Pontos práticos:

- **Base legal**: o escritório trata dados para **cumprir obrigação legal** (folha, obrigações acessórias) e **executar o contrato**; não precisa de consentimento, mas precisa saber qual base sustenta cada uso. Outra finalidade (marketing) exige outra base.
- **Minimização**: só os campos necessários vão ao provedor de IA; classificar um documento não exige o CPF do funcionário.
- **Papéis**: em geral o cliente é o **controlador**, o escritório é o **operador** e o provedor de IA é **suboperador**; o contrato com o cliente deve prever ferramentas automatizadas e fornecedores.
- **Encarregado (DPO)** indicado e com contato divulgado (agentes de tratamento de pequeno porte, pela regulamentação da ANPD, estão dispensados de nomear o encarregado, mas precisam manter um canal de contato para os titulares); **direitos dos titulares** (acesso, correção, eliminação) atendíveis: a automação precisa localizar e apagar dados de uma pessoa, inclusive em logs e índices vetoriais.
- **Incidentes**: vazamento com risco relevante deve ser comunicado à ANPD e aos titulares em prazo curto (a regulamentação da ANPD fixa três dias úteis). Tenha o procedimento escrito antes.
- **Transferência internacional**: provedores de IA costumam processar fora do Brasil; a LGPD permite com salvaguardas contratuais (a ANPD publicou cláusulas-padrão).

## Segredos: inventário e rotação

Segredo é tudo que dá acesso: chaves de API, tokens, senhas, certificados A1, credenciais bancárias.

- **Cofre**: o cofre do n8n, variáveis de ambiente em servidor restrito, gerenciadores de senha, cofres de nuvem. Nunca em código, planilha, e-mail ou WhatsApp.
- **Uma credencial por automação**, com o menor escopo; a mesma chave em dez fluxos impede saber quem fez o quê e obriga a trocar tudo quando uma vaza.
- **Rotação** a cada 90 dias e imediatamente quando alguém sai ou há suspeita de vazamento; certificados A1 vencem em um ano, alerta com 30 dias.
- **Registro** de onde cada segredo é usado; sem isso, a rotação quebra automações sem aviso.

## Trilhas de auditoria

Trilha de auditoria é o registro de **quem fez o quê, quando e com base em quê**, incluindo as automações. Ela guarda toda ação de escrita (lançamento, envio, guia) com a versão da automação, os dados de entrada (ou seu hash), a decisão de IA e a aprovação humana (quem, quando). Precisa ser **imutável**: ninguém edita, e o acesso é registrado. É o que responde ao cliente ("quem enviou esta guia?"), ao fiscal ("de onde veio este lançamento?") e à ANPD ("quem acessou estes dados?").

## Retenção

Escreva o prazo por categoria: documentos fiscais e contábeis pelo prazo legal (em geral cinco anos; trabalhistas e previdenciários podem ser maiores); trilha de auditoria pelo mesmo prazo dos documentos; logs operacionais por 12 meses; dados enviados ao provedor de IA pelo mínimo que o contrato permitir; índices vetoriais e memórias de agentes enquanto o cliente for ativo. Apagar no prazo é tão importante quanto guardar: dado que não existe não vaza.

## Contratos com fornecedores de IA

Antes de mandar dados de clientes para uma API, confirme nos termos empresariais: **não uso para treinamento**; **retenção** (alguns oferecem retenção zero); **local de processamento** e salvaguardas de transferência internacional; **confidencialidade** e subcontratados; **segurança** (SOC 2, ISO 27001); **notificação de incidentes**. Planos de consumidor ("chat gratuito") não dão essas garantias; use planos empresariais ou a API, e guarde a versão dos termos aceita.

## Onde a revisão humana é obrigatória

Automação não transfere responsabilidade. Demonstrações contábeis, ECD, ECF, declarações transmitidas com certificado, pareceres e tudo que exige **assinatura do contador** com registro no CRC continuam atos de responsabilidade técnica (Decreto-Lei 9.295/1946 e normas do CFC). A IA prepara, confere e sugere; o contador revisa e assina. Nenhuma guia ou declaração é transmitida sem conferência humana registrada na trilha, e nenhuma orientação fiscal personalizada sai sem revisão. Escreva essa lista na política.

## A política de automação do escritório

Uma página, aprovada pelos sócios:

1. **Escopo**: toda automação que acessa dados de clientes ou executa ações.
2. **Inventário** com dono e revisão trimestral.
3. **Risco** (lê, escreve, envia, paga) e aprovação por nível.
4. **Dados**: minimização, base legal, o que nunca vai para IA externa (saúde, biometria).
5. **Segredos**: cofre, uma credencial por automação, rotação, revogação na saída de pessoas.
6. **Fornecedores** aprovados e cláusulas mínimas.
7. **Revisão humana obrigatória**: a lista acima.
8. **Auditoria e retenção**: o que fica registrado e por quanto tempo.
9. **Incidentes**: quem aciona, prazos, análise posterior.
10. **Mudanças**: versionamento, teste, rollback.

## Armadilhas

- **Inventário que ninguém atualiza**: vale o mesmo que nenhum.
- **"Dados anonimizados" que não são** (nome retirado, CPF mantido).
- **Confiar nos termos de consumidor** do provedor de IA.
- **Transmitir sem conferência**: economiza minutos e custa a responsabilidade técnica.
- **Reter para sempre**: aumenta o dano em caso de vazamento.

## Na prática

Um escritório com 15 automações descobriu, ao montar o inventário, que quatro usavam a chave de API pessoal de um ex-funcionário e duas enviavam a folha inteira a um provedor de IA pelo plano gratuito. Em um mês: chaves trocadas e separadas, plano empresarial com contrato revisado, campos sensíveis fora dos prompts, trilha de auditoria e política assinada pelos sócios. Na primeira solicitação de exclusão de dados, o inventário mostrou em dez minutos onde eles estavam.

## Resumo

- Governança começa pelo inventário: uma linha por automação, com dono, dados, risco e revisão trimestral.
- LGPD: base legal, minimização, papéis, encarregado, direitos dos titulares, incidentes e transferência internacional.
- Segredos em cofre, uma credencial por automação, rotação periódica e na saída de pessoas.
- Trilha de auditoria imutável; retenção definida por categoria.
- Contratos com provedores de IA sem treinamento e com retenção mínima; revisão humana obrigatória onde o contador assina; política de uma página.
