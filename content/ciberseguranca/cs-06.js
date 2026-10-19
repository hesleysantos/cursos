registerModule({
  course: 'ciberseguranca',
  id: 'cs-06',
  order: 6,
  level: 'Especialista',
  title: 'Governança, risco, conformidade e carreira',
  description: 'Você vai organizar a segurança como gestão: escolher entre ISO/IEC 27001, NIST CSF 2.0 e CIS Controls, montar um registro de riscos, dominar a LGPD do ponto de vista do contador (bases legais, papéis, RoPA, RIPD, incidentes e ANPD), escrever políticas que as pessoas leem, auditar e avaliar fornecedores, implantar um programa de 90 dias para uma pequena empresa e planejar a carreira na área. O projeto final é o Plano de Segurança e Privacidade de um escritório contábil fictício.',
  hours: 5,
  lessons: [
    {
      id: 'cs-06-01',
      title: 'GRC e frameworks',
      minutes: 27,
      content: 'content/ciberseguranca/cs-06/01-grc-e-frameworks.md',
      exercises: [
        { type: 'match', q: 'Relacione a função do NIST CSF 2.0 à pergunta que ela responde.', pairs: [['Govern', 'quem decide, qual a estratégia e a política?'], ['Identify', 'o que temos, o que vale, quais os riscos?'], ['Protect', 'quais controles impedem o incidente?'], ['Detect', 'como percebemos que algo aconteceu?'], ['Respond', 'o que fazemos quando acontece?'], ['Recover', 'como voltamos ao normal?']], explain: 'As seis funções da versão 2.0 formam o mapa da segurança; Govern foi acrescentada para dar peso à governança.' },
        { type: 'mc', q: 'Qual a relação entre a ISO/IEC 27001 e a ISO/IEC 27002?', options: ['São a mesma norma com nomes diferentes', 'A 27001 é certificável e diz o que deve existir; a 27002 é o guia de como implementar os controles', 'A 27002 é certificável e a 27001 é o guia', 'A 27001 é para empresas grandes e a 27002 para pequenas'], answer: 1, explain: 'A 27001 define o SGSI (cláusulas 4–10 e Anexo A); a 27002 detalha cada um dos 93 controles e não gera certificado.' },
        { type: 'fill', q: 'O Anexo A da ISO/IEC 27001:2022 lista ___ controles de referência, organizados em quatro temas.', answer: ['93', 'noventa e três'], explain: 'São 37 organizacionais, 8 de pessoas, 14 físicos e 34 tecnológicos; a empresa justifica os excluídos na Declaração de Aplicabilidade.' },
        { type: 'tf', q: 'Uma empresa pode obter um certificado oficial de conformidade com o NIST CSF 2.0.', answer: false, explain: 'O CSF é um guia de autoavaliação e organização, não um esquema de certificação; quem certifica é a ISO 27001 (e o SOC 2 atesta).' },
        { type: 'mc', q: 'Um escritório contábil de 12 pessoas quer começar a estruturar a segurança do zero. Por onde é mais sensato começar?', options: ['Contratar a certificação ISO 27001', 'Implementar todas as 93 medidas do Anexo A', 'Pelo CIS Controls v8, Grupo de Implementação 1 (IG1)', 'Pelo NIST CSF Tier 4'], answer: 2, explain: 'O IG1 traz as 56 salvaguardas de higiene essencial, desenhadas para quem tem pouca equipe e orçamento; é a lista de tarefas inicial.' },
        { type: 'order', q: 'Ordene as etapas do caminho até a certificação ISO 27001 e sua manutenção.', items: ['Implantar o SGSI e os controles', 'Realizar a auditoria interna', 'Auditoria de estágio 1 (documentação)', 'Auditoria de estágio 2 (evidências de funcionamento)', 'Emissão do certificado', 'Auditorias de manutenção anuais até a recertificação'], explain: 'O certificado só vem depois de o sistema funcionar e ser auditado internamente; a manutenção anual compõe o ciclo de três anos.' },
        { type: 'tf', q: 'Os CIS Controls v8 são compostos por 18 controles, cada um com salvaguardas concretas.', answer: true, explain: 'A versão 8 (e a revisão 8.1) organiza 18 controles em grupos de implementação IG1, IG2 e IG3.' },
        { type: 'mc', q: 'No tripé GRC, o que significa "conformidade"?', options: ['Quem decide e presta contas', 'Identificar o que pode dar errado', 'Atender ao que lei, contrato ou norma exigem', 'Instalar as ferramentas de segurança'], answer: 2, explain: 'Governança é a decisão, risco é a análise e conformidade é o cumprimento de exigências externas, como LGPD e cláusulas de clientes.' },
      ],
    },
    {
      id: 'cs-06-02',
      title: 'Gestão de riscos',
      minutes: 28,
      content: 'content/ciberseguranca/cs-06/02-gestao-de-riscos.md',
      exercises: [
        { type: 'mc', q: 'Como se define risco na gestão de riscos de segurança?', options: ['Qualquer ameaça presente na internet', 'A combinação da probabilidade de uma ameaça explorar uma vulnerabilidade com o impacto sobre o ativo', 'A quantidade de vulnerabilidades encontradas no pentest', 'O valor do seguro cibernético'], answer: 1, explain: 'Risco une ameaça, vulnerabilidade, ativo e impacto; sem probabilidade e impacto, é só uma lista de medos.' },
        { type: 'match', q: 'Relacione a opção de tratamento ao exemplo.', pairs: [['Mitigar', 'ligar MFA e fazer backup imutável'], ['Aceitar', 'registrar que o site institucional pode ficar fora do ar'], ['Transferir', 'contratar seguro cibernético'], ['Evitar', 'parar de guardar cópias de documentos pessoais desnecessários']], explain: 'Mitigar reduz, aceitar convive conscientemente, transferir compartilha o impacto e evitar elimina a atividade.' },
        { type: 'fill', q: 'A norma da família 27000 dedicada à gestão de riscos de segurança da informação é a ISO/IEC ___.', answer: ['27005'], explain: 'A ISO/IEC 27005:2022 detalha contexto, identificação, análise, avaliação, tratamento e monitoramento exigidos pela 27001.' },
        { type: 'tf', q: 'Aceitar um risco por omissão (simplesmente não tratá-lo) é uma forma válida de tratamento.', answer: false, explain: 'Aceitar é legítimo apenas quando consciente e registrado, dentro do apetite definido pela direção.' },
        {
          type: 'code',
          q: 'Escreva a função classificar(prob, impacto) que devolve a tupla (nivel, faixa), em que nivel = prob × impacto e faixa é "baixo" (até 4), "medio" (5 a 9), "alto" (10 a 14) ou "critico" (15 ou mais). Escreva também priorizar(riscos), que recebe uma lista de tuplas (nome, prob, impacto) e devolve a lista dos nomes do maior nível para o menor (em empate, ordem alfabética).',
          starter: `def classificar(prob, impacto):
    pass

def priorizar(riscos):
    pass
`,
          tests: `assert classificar(4, 5) == (20, "critico"), "4x5 = 20 e critico"
assert classificar(2, 4) == (8, "medio"), "2x4 = 8 e medio"
assert classificar(3, 1) == (3, "baixo"), "3x1 = 3 e baixo"
assert classificar(3, 4) == (12, "alto"), "3x4 = 12 e alto"
assert classificar(1, 4) == (4, "baixo"), "4 ainda e baixo"
assert classificar(5, 3) == (15, "critico"), "15 ja e critico"
riscos = [("R7 site fora", 3, 1), ("R1 ransomware", 4, 5), ("R4 notebook perdido", 2, 4), ("R6 falha de disco", 2, 4)]
assert priorizar(riscos) == ["R1 ransomware", "R4 notebook perdido", "R6 falha de disco", "R7 site fora"], "maior nivel primeiro; empate em ordem alfabetica"
assert priorizar([]) == [], "lista vazia devolve lista vazia"
`,
          solution: `def classificar(prob, impacto):
    nivel = prob * impacto
    if nivel <= 4:
        faixa = "baixo"
    elif nivel <= 9:
        faixa = "medio"
    elif nivel <= 14:
        faixa = "alto"
    else:
        faixa = "critico"
    return (nivel, faixa)

def priorizar(riscos):
    ordenados = sorted(riscos, key=lambda r: (-r[1] * r[2], r[0]))
    return [r[0] for r in ordenados]
`,
          hint: 'Para priorizar, use sorted com uma chave que combine o nível negativo (para ordem decrescente) e o nome (para desempate).',
          explain: 'É o cálculo do registro de riscos: nível por probabilidade × impacto, faixa por limiares fixos e priorização para decidir onde agir primeiro.',
        },
        { type: 'mc', q: 'O que é risco residual?', options: ['O risco que ainda não foi identificado', 'O risco que sobra depois de aplicado o tratamento escolhido', 'O risco de um fornecedor', 'O risco acima do apetite'], answer: 1, explain: 'Após os controles, o risco diminui mas raramente zera; o residual deve ficar dentro do apetite ou ser aceito formalmente.' },
        { type: 'mc', q: 'Na frase "ransomware criptografa o servidor porque não há backup off-line", o que é ameaça e o que é vulnerabilidade?', options: ['Ransomware é a vulnerabilidade; falta de backup é a ameaça', 'Ransomware é a ameaça; falta de backup off-line é a vulnerabilidade', 'Ambos são ameaças', 'Ambos são vulnerabilidades'], answer: 1, explain: 'Ameaça é o que causa dano (ransomware); vulnerabilidade é a fraqueza explorada (sem backup off-line); confundir os dois atrapalha o tratamento.' },
      ],
    },
    {
      id: 'cs-06-03',
      title: 'LGPD a fundo (parte 1)',
      minutes: 28,
      content: 'content/ciberseguranca/cs-06/03-lgpd-parte-1.md',
      exercises: [
        { type: 'mc', q: 'Qual destes itens é dado pessoal SENSÍVEL segundo o art. 5º, II, da LGPD?', options: ['CPF', 'Endereço residencial', 'Atestado médico (dado de saúde)', 'Salário'], answer: 2, explain: 'Saúde, biometria, origem racial, religião, opinião política, filiação sindical, vida sexual e dado genético são sensíveis; CPF, endereço e salário são pessoais comuns.' },
        { type: 'match', q: 'Relacione o tratamento à base legal mais adequada (art. 7º).', pairs: [['Enviar o eSocial dos funcionários do cliente', 'cumprimento de obrigação legal'], ['Cadastrar o cliente para prestar o serviço contratado', 'execução de contrato'], ['Enviar newsletter a contatos', 'consentimento'], ['Analisar inadimplência de um cliente', 'proteção do crédito'], ['Registrar logs de acesso para prevenir fraudes', 'legítimo interesse']], explain: 'No escritório, obrigação legal e execução de contrato sustentam a maior parte; consentimento é exceção, não regra.' },
        { type: 'fill', q: 'A multa simples da LGPD pode chegar a ___% do faturamento do grupo no Brasil no último exercício, limitada a R$ 50 milhões por infração.', answer: ['2', 'dois', '2%'], explain: 'Art. 52, II: até 2% do faturamento, com teto de R$ 50 milhões por infração; há ainda advertência, multa diária, publicização e suspensões.' },
        { type: 'tf', q: 'O CNPJ e o faturamento de uma empresa cliente são dados pessoais protegidos pela LGPD.', answer: false, explain: 'A LGPD protege dados de pessoa natural; dados da PJ não, mas os dos sócios, funcionários e clientes dela sim.' },
        { type: 'mc', q: 'Ao processar a folha de pagamento de um cliente seguindo as instruções dele, o escritório contábil é:', options: ['Controlador', 'Operador', 'Encarregado', 'Titular'], answer: 1, explain: 'O cliente decide finalidade e meios (contratar, demitir, pagar); o escritório executa em nome dele, logo é operador (art. 5º, VII).' },
        { type: 'tf', q: 'O operador responde solidariamente pelos danos quando descumpre a lei ou as instruções lícitas do controlador.', answer: true, explain: 'Art. 42, § 1º, I: "só executei o que o cliente mandou" não protege se a execução foi insegura ou ilegal.' },
        { type: 'mc', q: 'Qual o prazo para responder a um pedido de acesso de titular em formato completo (art. 19)?', options: ['24 horas', '15 dias', '30 dias', '90 dias'], answer: 1, explain: 'Em formato simplificado a resposta é imediata; em formato completo, até 15 dias contados do requerimento.' },
        { type: 'order', q: 'Ordene os passos para atender a um pedido de um ex-funcionário de cliente que quer saber "tudo o que vocês têm sobre mim".', items: ['Reconhecer o pedido como exercício de direito do titular', 'Confirmar a identidade de quem pede', 'Localizar os dados nos processos mapeados (RoPA)', 'Responder de forma completa em até 15 dias', 'Registrar o atendimento como evidência'], explain: 'Sem reconhecer o pedido ele é ignorado; sem confirmar identidade há risco de vazar; o RoPA diz onde procurar; o prazo e o registro fecham o ciclo.' },
      ],
    },
    {
      id: 'cs-06-04',
      title: 'LGPD (parte 2): programa de privacidade',
      minutes: 28,
      content: 'content/ciberseguranca/cs-06/04-lgpd-parte-2.md',
      exercises: [
        { type: 'mc', q: 'O que é o RoPA exigido pelo art. 37 da LGPD?', options: ['O relatório anual enviado à ANPD', 'O registro das operações de tratamento: inventário de cada processo com dados, finalidade, base legal, compartilhamento e retenção', 'O contrato entre controlador e operador', 'A política de privacidade do site'], answer: 1, explain: 'O RoPA é o inventário que sustenta tudo o mais: política, contratos, atendimento a titulares e resposta a incidentes.' },
        { type: 'tf', q: 'Um consentimento obtido por caixa de seleção já marcada por padrão é válido pela LGPD.', answer: false, explain: 'Consentimento precisa ser manifestação livre, informada e inequívoca (art. 8º); caixa pré-marcada não demonstra manifestação do titular.' },
        { type: 'fill', q: 'Pela Resolução CD/ANPD nº 15/2024, a comunicação de incidente à ANPD deve ocorrer em ___ dias úteis a partir do conhecimento.', answer: ['3', 'três', 'tres'], explain: 'O prazo de 3 dias úteis vale para incidentes com risco ou dano relevante; o registro interno é obrigatório em todos os casos.' },
        { type: 'match', q: 'Relacione o instrumento ao seu papel no programa de privacidade.', pairs: [['RoPA', 'inventário dos tratamentos'], ['RIPD', 'análise de tratamento de alto risco'], ['Tabela de temporalidade', 'prazos de retenção e descarte'], ['Cláusula ou contrato de operador', 'deveres entre controlador e operador']], explain: 'Cada documento responde a uma exigência: art. 37, art. 38, arts. 15–16 e art. 39.' },
        { type: 'mc', q: 'Em qual situação o escritório deveria elaborar um RIPD?', options: ['Ao trocar o antivírus', 'Ao implantar ponto biométrico nos clientes (dado sensível em escala)', 'Ao contratar um estagiário', 'Ao enviar a DCTFWeb'], answer: 1, explain: 'Biometria é dado sensível e o tratamento sistemático de muitas pessoas configura alto risco, caso típico de RIPD (art. 38).' },
        { type: 'order', q: 'Ordene a implantação de um programa de privacidade conforme a lição.', items: ['Indicar o encarregado e publicar o canal', 'Preencher o RoPA', 'Escrever as políticas de privacidade (externa e interna)', 'Fechar contratos com clientes e fornecedores', 'Definir a tabela de temporalidade e a rotina de descarte', 'Treinar a equipe e registrar presença'], explain: 'O encarregado dá dono ao programa; o RoPA alimenta políticas e contratos; retenção e treinamento consolidam a rotina.' },
        { type: 'tf', q: 'O registro interno de um incidente de segurança só é necessário quando ele for comunicado à ANPD.', answer: false, explain: 'A Resolução 15/2024 exige registrar todo incidente, comunicado ou não, com a justificativa da decisão, por 5 anos.' },
        { type: 'write', q: 'Escreva a linha do RoPA para o processo "cadastro de clientes para emissão de boletos de honorários", preenchendo: papel do escritório, dados, titulares, finalidade, base legal, compartilhamento, retenção e controles.', model: 'Papel: controlador. Dados: nome, CPF/CNPJ, e-mail, telefone, endereço, dados bancários do pagador. Titulares: clientes pessoa física e sócios/representantes de clientes PJ. Finalidade: emitir e cobrar honorários. Base legal: execução de contrato (art. 7º, V). Compartilhamento: banco emissor do boleto, sistema financeiro em nuvem. Retenção: durante o contrato e pelo prazo legal fiscal/civil após o término. Controles: acesso por perfil, MFA, backup, log de alterações.', checklist: ['Identificou o escritório como controlador neste processo?', 'A base legal é execução de contrato, não consentimento?', 'Listou com quem os dados são compartilhados?', 'Definiu retenção com referência a prazo legal e controles de segurança?'] },
      ],
    },
    {
      id: 'cs-06-05',
      title: 'Políticas, conscientização e cultura',
      minutes: 28,
      content: 'content/ciberseguranca/cs-06/05-politicas-e-cultura.md',
      exercises: [
        { type: 'mc', q: 'Qual característica torna uma política de segurança efetiva em uma pequena empresa?', options: ['Ter o máximo de páginas possível para cobrir tudo', 'Ser curta, aprovada pela direção, comunicada e cobrável', 'Ser escrita apenas pela TI, sem envolver os sócios', 'Ficar guardada no servidor sem divulgação'], answer: 1, explain: 'Política que ninguém lê não orienta nem serve de evidência; curta e conhecida vale mais que longa e ignorada.' },
        { type: 'tf', q: 'A troca periódica obrigatória de senhas (a cada 30 ou 60 dias) é recomendada pelas diretrizes atuais do NIST.', answer: false, explain: 'O NIST abandonou a troca periódica obrigatória: ela gera senhas previsíveis; troque só em caso de suspeita de comprometimento e use MFA.' },
        { type: 'match', q: 'Relacione a política específica à regra típica dela.', pairs: [['Uso aceitável', 'não há expectativa de privacidade no e-mail corporativo'], ['Senhas e autenticação', 'frases-senha longas, únicas, no gerenciador, com MFA'], ['BYOD', 'dispositivo pessoal só com bloqueio, criptografia e apagamento remoto'], ['Trabalho remoto', 'VPN e nada de Wi-Fi público sem proteção']], explain: 'Cada política cobre um contexto de uso; juntas, elas detalham a PSI em uma página cada.' },
        { type: 'fill', q: 'Nas simulações de phishing, a métrica mais importante não é a taxa de clique, e sim a taxa de ___.', answer: ['reporte', 'report', 'relato', 'denúncia', 'denuncia'], explain: 'Quem reporta em minutos permite conter antes do dano; um escritório onde ninguém avisa está desprotegido mesmo com poucos cliques.' },
        { type: 'mc', q: 'Quando os acessos de um funcionário desligado devem ser bloqueados?', options: ['Em até uma semana após o desligamento', 'No mesmo dia e, se o desligamento for litigioso, antes da conversa', 'No fim do mês, junto com a rescisão', 'Só se a pessoa tiver acesso a dados sensíveis'], answer: 1, explain: 'A saída é o momento de maior risco de vazamento; o ex-funcionário com conta ativa no fim de semana é um incidente clássico.' },
        { type: 'order', q: 'Ordene a lista de verificação de offboarding conforme a lição.', items: ['Bloquear conta de e-mail e do sistema', 'Revogar MFA, tokens e acessos a portais de terceiros', 'Trocar senhas compartilhadas que a pessoa conhecia', 'Recolher o equipamento e verificar a devolução', 'Transferir arquivos e e-mails ao gestor', 'Registrar tudo com data e assinatura'], explain: 'Primeiro corta-se o acesso lógico (conta, tokens, senhas compartilhadas), depois o físico, depois a transferência e o registro.' },
        { type: 'tf', q: 'Usar o tema "demissão em massa" na simulação de phishing é boa prática porque aumenta a taxa de clique e deixa o resultado mais realista.', answer: false, explain: 'Temas cruéis destroem a confiança e fazem as pessoas pararem de reportar; a simulação serve para treinar, não para humilhar.' },
        { type: 'mc', q: 'Qual cláusula da ISO/IEC 27001 exige uma política de segurança da informação aprovada pela direção?', options: ['Cláusula 5.2', 'Cláusula 9.2', 'Anexo A, controle 8.13', 'Cláusula 10.1'], answer: 0, explain: 'A cláusula 5.2 (Política) está em Liderança; a 9.2 trata de auditoria interna e o 8.13 de backup.' },
      ],
    },
    {
      id: 'cs-06-06',
      title: 'Auditoria, evidências e terceiros',
      minutes: 28,
      content: 'content/ciberseguranca/cs-06/06-auditoria-e-terceiros.md',
      exercises: [
        { type: 'mc', q: 'Qual destas é a melhor evidência de que "todo acesso administrativo exige MFA"?', options: ['Uma planilha preenchida pelo administrador dizendo que o MFA está ligado', 'O relatório exportado do painel, datado, mostrando todos os administradores com MFA ativo, mais a captura da política que o obriga', 'Um e-mail do prestador afirmando que configurou', 'A política de segurança dizendo que o MFA é obrigatório'], answer: 1, explain: 'Evidência boa é datada, gerada pelo sistema e reproduzível; a política mostra o desenho, o relatório mostra a efetividade.' },
        { type: 'tf', q: 'SOC 2 é uma certificação emitida pela AICPA que aprova a segurança do fornecedor.', answer: false, explain: 'SOC 2 é um relatório de atestação de um auditor independente sobre os Trust Services Criteria, com opinião e exceções; não é selo nem certificação.' },
        { type: 'match', q: 'Relacione o termo à sua definição.', pairs: [['SOC 2 Tipo I', 'controles desenhados adequadamente em uma data'], ['SOC 2 Tipo II', 'controles que operaram ao longo de um período'], ['ISO 27001', 'certificação de um sistema de gestão de segurança'], ['Auditoria interna (cláusula 9.2)', 'verificação independente feita pela própria organização']], explain: 'Tipo II é o que vale, pois cobre um período; a ISO certifica o SGSI; a auditoria interna prepara para a externa.' },
        { type: 'fill', q: 'Um SLA de 99,9% de disponibilidade ao mês equivale a cerca de ___ minutos de indisponibilidade permitida.', answer: ['43', '44', '43 minutos', '44 minutos'], explain: 'Um mês tem cerca de 43.200 minutos; 0,1% disso são aproximadamente 43 minutos. Sem medição e penalidade, o SLA é só promessa.' },
        { type: 'mc', q: 'Na due diligence de um ERP contábil em nuvem, por que perguntar "como exporto todos os meus dados e em quanto tempo"?', options: ['Para negociar desconto', 'Para evitar aprisionamento ao fornecedor e permitir backup próprio e continuidade', 'Porque a ANPD exige exportação mensal', 'Para testar a velocidade da internet'], answer: 1, explain: 'Sem exportação viável, uma falência, venda ou incidente do fornecedor deixa o escritório sem seus dados; a cópia própria é continuidade.' },
        { type: 'order', q: 'Ordene as etapas de avaliação de um fornecedor, proporcional ao risco.', items: ['Classificar o fornecedor pelo que ele acessa', 'Enviar o questionário de segurança', 'Pedir e conferir evidências (certificado, SOC 2, pentest)', 'Fechar contrato com cláusulas de dados, incidentes e SLA', 'Monitorar e reavaliar anualmente'], explain: 'A classificação define a profundidade; questionário e evidências informam o contrato; o monitoramento mantém a avaliação viva.' },
        { type: 'tf', q: 'Um controle pode estar bem desenhado (a política prevê revisão trimestral de acessos) e mesmo assim não operar (nenhuma ata de revisão existe).', answer: true, explain: 'Auditores verificam desenho e efetividade operacional; o segundo exige evidências de que o controle aconteceu de fato.' },
        { type: 'mc', q: 'O que são os "controles complementares do usuário" em um relatório SOC 2?', options: ['Controles que o auditor recomenda ao fornecedor', 'O que o fornecedor espera que o CLIENTE faça, como gerir seus próprios usuários e MFA', 'Exceções encontradas na auditoria', 'Os critérios de privacidade'], answer: 1, explain: 'O relatório pressupõe que o cliente cumpre sua parte; ignorar essa seção é confiar num controle que depende de você e que você não fez.' },
      ],
    },
    {
      id: 'cs-06-07',
      title: 'Programa de segurança para pequenas empresas',
      minutes: 28,
      content: 'content/ciberseguranca/cs-06/07-programa-para-pequenas-empresas.md',
      exercises: [
        { type: 'mc', q: 'Quais controles devem vir primeiro no roteiro de 90 dias, por reduzirem mais risco por real gasto?', options: ['NGFW e SIEM', 'MFA, backup imutável, usuário padrão e atualizações automáticas', 'Pentest e certificação ISO 27001', 'CASB e XDR'], answer: 1, explain: 'Esses quatro cortam a maior parte dos ataques reais contra pequenas empresas e custam pouco; ferramentas caras vêm depois.' },
        { type: 'order', q: 'Ordene as fases do roteiro de 90 dias conforme a lição.', items: ['Governar e identificar (responsáveis, inventário, riscos)', 'Proteger identidade e dados (MFA, senhas, backup)', 'Proteger dispositivos e rede (usuário padrão, EDR, roteador)', 'Políticas e pessoas (PSI, treinamento, offboarding)', 'Detectar e responder (auditoria, alertas, playbooks)', 'Recuperar, medir e consolidar (BIA, CIS IG1, indicadores)'], explain: 'O roteiro segue as funções do NIST CSF 2.0: governar e identificar antes de proteger; detectar e responder antes de medir.' },
        { type: 'tf', q: 'Ao contratar um MSSP, o escritório transfere a ele a responsabilidade legal pelos dados pessoais perante a LGPD.', answer: false, explain: 'O MSSP opera; a responsabilidade do controlador, o apetite a risco e a governança continuam com a empresa.' },
        { type: 'fill', q: 'MSSP significa Managed Security ___ Provider: o prestador que opera a segurança para a empresa.', answer: ['Service', 'service', 'Services'], explain: 'O MSSP monitora, responde, aplica patches e gerencia backup; é a forma realista de uma empresa sem TI ter detecção e resposta.' },
        {
          type: 'code',
          q: 'Escreva a função painel(indicadores) que recebe um dicionário com as chaves "contas_sem_mfa", "desligados_ativos", "maquinas_sem_edr" (inteiros) e "dias_desde_restauracao" (inteiro) e devolve a lista, em ordem alfabética, dos nomes dos indicadores fora da meta: os três primeiros devem ser 0 e o último deve ser no máximo 90.',
          starter: `def painel(indicadores):
    pass
`,
          tests: `assert painel({"contas_sem_mfa": 0, "desligados_ativos": 0, "maquinas_sem_edr": 0, "dias_desde_restauracao": 30}) == [], "tudo dentro da meta devolve lista vazia"
assert painel({"contas_sem_mfa": 2, "desligados_ativos": 0, "maquinas_sem_edr": 0, "dias_desde_restauracao": 90}) == ["contas_sem_mfa"], "90 dias ainda esta na meta; 2 contas sem MFA nao"
assert painel({"contas_sem_mfa": 0, "desligados_ativos": 1, "maquinas_sem_edr": 3, "dias_desde_restauracao": 120}) == ["desligados_ativos", "dias_desde_restauracao", "maquinas_sem_edr"], "tres indicadores fora da meta, em ordem alfabetica"
`,
          solution: `def painel(indicadores):
    fora = []
    for chave in ("contas_sem_mfa", "desligados_ativos", "maquinas_sem_edr"):
        if indicadores[chave] > 0:
            fora.append(chave)
    if indicadores["dias_desde_restauracao"] > 90:
        fora.append("dias_desde_restauracao")
    return sorted(fora)
`,
          hint: 'Compare cada indicador com sua meta (0 para os três contadores, 90 para os dias) e devolva sorted() da lista dos que falharam.',
          explain: 'É o painel mensal dos sócios em código: metas explícitas por indicador e a lista do que exige ação.',
        },
        { type: 'mc', q: 'Qual meta é adequada para o indicador "contas sem MFA" no painel mensal?', options: ['Menos de 50%', 'Zero', 'Até 5 contas', 'Não precisa de meta'], answer: 1, explain: 'MFA é obrigatório para todos; qualquer conta sem MFA é uma porta aberta e o indicador deve ser zero.' },
        { type: 'tf', q: 'É sensato comprar um SIEM antes de implantar MFA e backup imutável, porque a detecção é mais importante que a prevenção.', answer: false, explain: 'Sem MFA e backup, o SIEM só vai registrar o ataque bem-sucedido; os controles básicos vêm primeiro.' },
      ],
    },
    {
      id: 'cs-06-08',
      title: 'Carreira em cibersegurança',
      minutes: 28,
      content: 'content/ciberseguranca/cs-06/08-carreira.md',
      exercises: [
        { type: 'match', q: 'Relacione a área de atuação à atividade típica.', pairs: [['SOC / Blue Team', 'monitorar alertas e responder a incidentes'], ['GRC', 'políticas, riscos, auditoria e conformidade'], ['Pentest / Red Team', 'simular atacantes e relatar vulnerabilidades'], ['AppSec', 'revisão de código, SAST/DAST e threat modeling'], ['Privacidade', 'programa de privacidade, LGPD e encarregado']], explain: 'Cibersegurança é um conjunto de profissões; cada área combina com um perfil diferente.' },
        { type: 'mc', q: 'Qual certificação é considerada de ENTRADA na área?', options: ['OSCP', 'CISSP', 'CompTIA Security+', 'CISM'], answer: 2, explain: 'Security+ (e o ISC2 CC) são de entrada; OSCP, CISSP e CISM são avançadas e exigem experiência ou prática intensa.' },
        { type: 'tf', q: 'A OSCP é uma boa primeira certificação para quem está começando, por ser prática.', answer: false, explain: 'A OSCP exige base sólida de redes, sistemas e scripts; começar por ela sem fundamentos costuma terminar em frustração.' },
        { type: 'fill', q: 'O CISSP exige ___ anos de experiência profissional comprovada para o título pleno.', answer: ['5', 'cinco'], explain: 'Quem passa no exame sem a experiência fica como Associate do ISC2 até completar os cinco anos.' },
        { type: 'mc', q: 'Praticar técnicas de invasão em um sistema real sem autorização do dono é:', options: ['Permitido se for só para aprender', 'Crime previsto no art. 154-A do Código Penal (Lei 12.737/2012)', 'Permitido se nada for alterado', 'Uma infração administrativa leve'], answer: 1, explain: 'Invasão de dispositivo informático é crime; pratique apenas em laboratórios e plataformas autorizadas.' },
        { type: 'mc', q: 'Para um contador que domina LGPD e processos, quais áreas são a porta de entrada mais natural?', options: ['Pentest e exploração de binários', 'GRC e privacidade', 'Engenharia reversa de malware', 'Desenvolvimento de exploits'], answer: 1, explain: 'A lógica de controle, evidência, auditoria e prazo legal é a mesma da contabilidade; muda o objeto, não o raciocínio.' },
        { type: 'tf', q: 'É seguro basear uma decisão de carreira em um número exato de salário encontrado em uma postagem sem fonte nem data.', answer: false, explain: 'Salários variam por cidade, porte, idioma e regime, e envelhecem em meses; use faixas com ressalva e pesquisas atualizadas.' },
        { type: 'write', q: 'Escreva um plano de estudo de seis meses para entrar na área de GRC/privacidade a partir da contabilidade: certificação alvo, laboratório, portfólio e comunidade.', model: 'Meses 1–2: ISC2 CC (fundamentos) com estudo diário de 30 min; montar laboratório com uma VM Windows e uma Linux. Meses 3–4: CompTIA Security+; publicar no LinkedIn o mapeamento ATT&CK de um incidente público. Meses 5–6: curso de ISO 27001 Lead Implementer; concluir e publicar (anonimizado) o Plano de Segurança e Privacidade do projeto final; participar de um BSides ou encontro OWASP e entrar num grupo de encarregados LGPD.', checklist: ['Há uma certificação-alvo coerente com o nível de entrada?', 'O plano inclui prática (laboratório) e não só teoria?', 'Há pelo menos uma entrega pública de portfólio?', 'Há participação em comunidade?'] },
      ],
    },
    {
      id: 'cs-06-09',
      title: 'Projeto final: Plano de Segurança e Privacidade',
      minutes: 27,
      content: 'content/ciberseguranca/cs-06/09-projeto-final.md',
      exercises: [
        { type: 'mc', q: 'Quais seções do plano devem ser preenchidas primeiro?', options: ['Sumário executivo e orçamento', 'Escopo, governança, inventário e riscos', 'Indicadores e anexos', 'Políticas e carreira'], answer: 1, explain: 'Sem diagnóstico e riscos, a escolha de controles é chute; o sumário executivo é escrito por último.' },
        { type: 'order', q: 'Ordene a sequência de trabalho recomendada para elaborar o plano.', items: ['Diagnóstico e inventário', 'Registro de riscos', 'Escolha dos controles pelos riscos', 'Mapeamento aos frameworks (CIS, CSF, ISO)', 'Políticas e privacidade (LGPD)', 'Resposta a incidentes e continuidade', 'Cronograma, orçamento, indicadores e sumário executivo'], explain: 'Cada etapa alimenta a seguinte; o mapeamento vem depois da escolha para que o framework não dite controles sem risco correspondente.' },
        { type: 'tf', q: 'O sumário executivo deve ser escrito por último, em linguagem que um sócio entende em três minutos.', answer: true, explain: 'Ele resume decisões que só existem depois de riscos, controles e orçamento definidos; e é a única parte que muitos leitores lerão.' },
        { type: 'match', q: 'Relacione o controle proposto para a Horizonte à função do NIST CSF 2.0 em que se enquadra.', pairs: [['Inventário de ativos', 'Identify'], ['MFA em todas as contas', 'Protect'], ['EDR com monitoramento de alertas', 'Detect'], ['Playbook de ransomware', 'Respond'], ['Backup imutável e teste de restauração', 'Recover'], ['Nomear o responsável e definir o apetite a risco', 'Govern']], explain: 'Mapear cada controle à função mostra se o plano cobre todo o ciclo ou só a proteção.' },
        { type: 'mc', q: 'Na rubrica de avaliação, com 10 critérios de 0 a 4, qual a pontuação sugerida para aprovação?', options: ['20 de 40', '28 de 40', '36 de 40', '40 de 40'], answer: 1, explain: '28/40 corresponde a 70%, o mesmo critério das provas do curso.' },
        { type: 'fill', q: 'Em relação à folha de pagamento dos clientes, a Horizonte é ___ dos dados, pois segue as instruções do cliente.', answer: ['operadora', 'operador'], explain: 'O cliente decide finalidade e meios (controlador); a Horizonte executa em nome dele; nos dados dos próprios funcionários e do cadastro de clientes, ela é controladora.' },
        { type: 'write', q: 'Elabore o Plano de Segurança e Privacidade da Horizonte seguindo o modelo de 14 seções. Entregue aqui, no mínimo, o sumário executivo e o registro de riscos com cinco riscos (probabilidade, impacto, nível, tratamento, controle e residual).', model: 'Sumário: a Horizonte tem risco crítico de ransomware e invasão de contas (backup conectado, todos administradores, sem MFA, 40 certificados A1 em pasta compartilhada); o plano implanta em 90 dias MFA, backup imutável, usuário padrão, EDR gerenciado, políticas e resposta a incidentes, por custo mensal pequeno diante de uma a duas semanas paradas e possível sanção da ANPD. Riscos: R1 ransomware (4×5=20, mitigar, backup imutável + EDR, residual 10); R2 conta M365 invadida (4×4=16, mitigar, MFA + alertas, residual 6); R3 certificados A1 copiados (3×5=15, mitigar, cofre nominal + revogação, residual 5); R4 notebook perdido (3×4=12, mitigar, BitLocker, residual 3); R5 SaaS indisponível (2×5=10, transferir + mitigar, SLA + exportação mensal, residual 6).', checklist: ['O sumário cabe em meia página e um sócio entende em três minutos?', 'Os cinco riscos são específicos da Horizonte, com probabilidade, impacto e nível coerentes?', 'Cada risco tem tratamento, controle e residual?', 'Os primeiros controles são os de maior redução de risco por custo?', 'O plano cita os prazos da ANPD e os papéis LGPD corretamente?'] },
      ],
    },
  ],
  exam: {
    passScore: 70,
    questions: [
      { type: 'mc', q: 'Quais são as seis funções do NIST CSF 2.0?', options: ['Plan, Do, Check, Act, Review, Improve', 'Govern, Identify, Protect, Detect, Respond, Recover', 'Identify, Protect, Detect, Respond, Recover, Audit', 'Assess, Design, Implement, Test, Operate, Retire'], answer: 1, explain: 'A versão 2.0 (2024) acrescentou Govern às cinco funções anteriores.' },
      { type: 'tf', q: 'A ISO/IEC 27002 é a norma certificável da família 27000.', answer: false, explain: 'A certificável é a 27001; a 27002 é o guia de implementação dos controles.' },
      { type: 'mc', q: 'Qual o nível e a faixa de um risco com probabilidade 3 e impacto 4, usando as faixas da lição (1–4 baixo, 5–9 médio, 10–14 alto, 15+ crítico)?', options: ['7, médio', '12, alto', '12, crítico', '3, baixo'], answer: 1, explain: '3 × 4 = 12, que está na faixa de 10 a 14, alto.' },
      { type: 'match', q: 'Relacione a opção de tratamento de risco à sua descrição.', pairs: [['Mitigar', 'reduzir probabilidade ou impacto com controles'], ['Aceitar', 'conviver com o risco de forma consciente e registrada'], ['Transferir', 'compartilhar o impacto com terceiro (seguro, contrato)'], ['Evitar', 'eliminar a atividade que gera o risco']], explain: 'As quatro opções da ISO 27005; transferir nunca é total e aceitar exige registro.' },
      { type: 'mc', q: 'Qual base legal sustenta o envio do eSocial dos funcionários de um cliente?', options: ['Consentimento', 'Cumprimento de obrigação legal ou regulatória', 'Legítimo interesse', 'Proteção do crédito'], answer: 1, explain: 'O eSocial é obrigação legal (art. 7º, II); pedir consentimento para isso é erro.' },
      { type: 'fill', q: 'A multa simples da LGPD tem teto de R$ ___ milhões por infração.', answer: ['50', 'cinquenta'], explain: 'Art. 52, II: até 2% do faturamento, limitada a R$ 50 milhões por infração.' },
      { type: 'tf', q: 'Ao tratar os dados dos seus próprios funcionários, o escritório contábil é operador.', answer: false, explain: 'Nos dados dos próprios funcionários o escritório decide finalidade e meios, logo é controlador; é operador na folha dos clientes.' },
      { type: 'mc', q: 'Qual documento descreve um tratamento de alto risco, os riscos aos titulares e as medidas de mitigação (art. 38 da LGPD)?', options: ['RoPA', 'SoA', 'RIPD', 'BIA'], answer: 2, explain: 'RIPD é o relatório de impacto à proteção de dados; RoPA é o registro das operações (art. 37); SoA é a declaração de aplicabilidade da ISO 27001; BIA é a análise de impacto no negócio.' },
      { type: 'mc', q: 'Pela Resolução CD/ANPD nº 15/2024, em quanto tempo o controlador deve comunicar à ANPD um incidente com risco relevante?', options: ['24 horas', '3 dias úteis', '15 dias', '72 horas'], answer: 1, explain: 'Três dias úteis a partir do conhecimento, por formulário próprio, com possibilidade de complementação.' },
      { type: 'tf', q: 'Em um programa de conscientização, a taxa de reporte de phishing é mais importante que a taxa de clique.', answer: true, explain: 'Quem reporta em minutos permite conter o incidente; cliques sem reporte são incidentes silenciosos.' },
      { type: 'mc', q: 'Qual a diferença entre SOC 2 Tipo I e Tipo II?', options: ['Tipo I é para nuvem e Tipo II para software', 'Tipo I avalia o desenho dos controles em uma data; Tipo II avalia a operação ao longo de um período', 'Tipo II é emitido pela ISO', 'Tipo I vale mais que Tipo II'], answer: 1, explain: 'O Tipo II cobre um período (6 a 12 meses) e é o que demonstra efetividade operacional.' },
      { type: 'mc', q: 'Ao contratar um MSSP, qual destas responsabilidades NÃO pode ser terceirizada?', options: ['Monitoramento de EDR e logs', 'Aplicação de patches e gestão do backup', 'A decisão sobre o apetite a risco e a responsabilidade legal perante a LGPD', 'Resposta inicial a alertas'], answer: 2, explain: 'O MSSP opera a segurança; governança, apetite a risco e a responsabilidade do controlador continuam com a empresa.' },
      {
        type: 'code',
        q: 'Escreva a função acima_do_apetite(riscos, apetite) que recebe uma lista de tuplas (nome, probabilidade, impacto) e devolve, em ordem alfabética, os nomes cujo nível (probabilidade × impacto) é MAIOR que o apetite.',
        starter: `def acima_do_apetite(riscos, apetite):
    pass
`,
        tests: `riscos = [("R1", 4, 5), ("R4", 2, 4), ("R7", 3, 1), ("R6", 2, 3)]
assert acima_do_apetite(riscos, 6) == ["R1", "R4"], "20 e 8 passam de 6; 3 e 6 nao"
assert acima_do_apetite(riscos, 25) == [], "nada passa de 25"
assert acima_do_apetite([], 6) == [], "lista vazia devolve lista vazia"
assert acima_do_apetite([("B", 3, 3), ("A", 5, 5)], 8) == ["A", "B"], "ordem alfabetica"
`,
        solution: `def acima_do_apetite(riscos, apetite):
    return sorted(nome for nome, p, i in riscos if p * i > apetite)
`,
        hint: 'Uma compreensão com a condição p * i > apetite, dentro de sorted().',
        explain: 'É a leitura do registro de riscos: tudo o que está acima do apetite definido pela direção exige tratamento.',
      },
      { type: 'mc', q: 'Qual certificação é de entrada e qual exige cinco anos de experiência para o título pleno?', options: ['CISSP é de entrada; Security+ exige cinco anos', 'Security+ é de entrada; CISSP exige cinco anos', 'OSCP é de entrada; CEH exige cinco anos', 'ISO 27001 Lead Auditor é de entrada; CC exige cinco anos'], answer: 1, explain: 'Security+ e ISC2 CC são de entrada; o CISSP exige cinco anos de experiência comprovada.' },
      { type: 'mc', q: 'No projeto final, qual erro a rubrica pune com mais força?', options: ['Usar tabelas', 'Um plano genérico que serviria para qualquer empresa, sem as fraquezas específicas da Horizonte', 'Citar o CIS Controls', 'Escrever o sumário executivo em meia página'], answer: 1, explain: 'Especificidade e priorização por risco são o que separa um plano bom de um genérico.' },
    ],
  },
});
