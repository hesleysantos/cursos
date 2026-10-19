Nesta lição você vai aprender como a segurança é **verificada**: auditoria interna e externa, controles e evidências, o relatório **SOC 2**, a avaliação de fornecedores com questionários, contratos e SLA, e a **due diligence** de um software contábil ou ERP em nuvem antes de confiar a ele os dados de todos os clientes. Isso importa porque contador entende de auditoria, e a mesma lógica (controle, evidência, amostra, opinião) se aplica à segurança.

## Auditoria: a lógica que você já conhece

Na auditoria contábil, o auditor não refaz a contabilidade; ele testa **controles** e examina **evidências** por amostragem para formar uma opinião. Na segurança é igual:

- **Controle:** a medida que reduz um risco: "todo acesso administrativo exige MFA".
- **Evidência:** a prova de que o controle existe e funciona: a captura de tela da configuração que obriga MFA, mais o relatório de usuários mostrando que todos têm MFA ativo, mais o log de um login recente exigindo o segundo fator.
- **Desenho** versus **efetividade operacional:** um controle pode estar bem desenhado (a política diz que há revisão trimestral de acessos) e não operar (não há ata de revisão nenhuma). O auditor quer ver os dois.

Evidência boa é **datada, gerada pelo sistema** (não por quem é auditado) e **reproduzível**. Uma planilha preenchida à mão dizendo "revisamos os acessos" vale pouco; o relatório exportado do Microsoft 365 em 3 de março, anexado à ata assinada, vale muito.

## Auditoria interna e externa

- **Auditoria interna:** feita por alguém da própria empresa (ou contratado para isso), independente da área auditada, com plano anual. A ISO 27001 a exige (cláusula 9.2). Para um escritório pequeno, um sócio que não cuida da TI, com um roteiro simples (os 56 itens do CIS IG1, por exemplo), já é auditoria interna.
- **Auditoria externa:** feita por organismo independente para fins de certificação (ISO 27001), de atestação (SOC 2) ou por exigência de um cliente. Ela gera **não conformidades** (maior: falha sistêmica; menor: desvio pontual) e um prazo para o plano de ação.

A sequência clássica: autoavaliação, auditoria interna, correção, auditoria externa. Pular etapas custa caro na externa.

## SOC 2 (noção)

**SOC 2** é um relatório de **atestação** emitido por uma firma de contadores públicos certificados (CPA) segundo as normas do AICPA (o instituto americano dos contadores públicos certificados) sobre os controles de um prestador de serviço em relação aos **Trust Services Criteria**: segurança (obrigatório), disponibilidade, integridade de processamento, confidencialidade e privacidade. Dois tipos:

- **Tipo I:** os controles estão desenhados adequadamente em uma **data**.
- **Tipo II:** os controles **operaram** efetivamente ao longo de um **período** (geralmente 6 a 12 meses). É o que vale.

SOC 2 não é certificação nem "aprovação"; é a opinião de um auditor com exceções listadas. Ao receber um relatório Tipo II (normalmente sob NDA, um acordo de confidencialidade), leia a opinião, o período, os critérios cobertos e, principalmente, as **exceções** e os **controles complementares do usuário** (o que o fornecedor espera que **você** faça). Fornecedores brasileiros costumam ter a ISO 27001; grandes provedores internacionais têm ambos.

## Avaliação de fornecedores

Todo fornecedor com acesso a dados ou sistemas é parte da sua superfície de ataque. O processo, proporcional ao risco:

1. **Classificar** o fornecedor pelo que acessa: dados sensíveis de clientes (crítico), dados internos (relevante), nada (baixo).
2. **Questionário** de segurança para críticos e relevantes: onde ficam os dados; criptografia em trânsito e em repouso; MFA; backup e RTO/RPO; logs; pentest periódico; certificações; resposta a incidentes e prazo de comunicação; subcontratados; encarregado LGPD; destino dos dados ao fim do contrato. Há modelos públicos (SIG, CAIQ), mas quinze perguntas bem escolhidas resolvem para o escritório.
3. **Evidências:** certificado ISO (validade e escopo), relatório SOC 2, resumo do último pentest, política de privacidade.
4. **Contrato:** cláusulas de confidencialidade, tratamento de dados (LGPD, art. 39), comunicação de incidentes em prazo, direito de auditoria, **SLA**, portabilidade e eliminação ao término, subcontratação com aviso.
5. **Monitoramento:** reavaliar anualmente e quando houver incidente ou mudança relevante.

### SLA

**SLA (Service Level Agreement)** é a parte do contrato que define níveis mensuráveis: disponibilidade (99,9% ao mês equivale a cerca de 43 minutos de indisponibilidade), tempo de resposta e de solução por gravidade, prazo de comunicação de incidente, créditos ou multas por descumprimento. SLA sem medição e sem penalidade é promessa.

## Due diligence de software contábil ou ERP em nuvem

Antes de migrar a escrituração de 100 clientes para um sistema em nuvem, responda com evidências:

| Pergunta | Por que importa |
|---|---|
| Onde os dados ficam (país, provedor)? Há transferência internacional? | LGPD exige base para transferência internacional (arts. 33–36; Resolução CD/ANPD nº 19/2024) |
| MFA disponível e obrigatório para administradores? | principal causa de invasão de contas |
| Como exporto **todos** os meus dados, em que formato, em quanto tempo? | evita aprisionamento e permite o backup próprio |
| Qual o backup deles, RTO/RPO, e já restauraram de verdade? | continuidade (módulo 5) |
| Há log de auditoria acessível a mim (quem acessou qual cliente)? | investigação e LGPD |
| Permissões por perfil (fiscal não vê folha)? | menor privilégio |
| Certificado ISO 27001 ou SOC 2 válido e com escopo que cobre o serviço? | evidência de terceiros |
| Como reportam incidentes e em quanto tempo? Já tiveram? | resposta a incidentes |
| O contrato tem cláusula de dados pessoais, SLA e eliminação ao fim? | base legal e saída |
| O que acontece com os dados se a empresa fechar ou for vendida? | continuidade do próprio fornecedor |

Um fornecedor que responde "isso é confidencial" para tudo já deu a resposta. Guarde o questionário e as evidências: são a sua prova de diligência se o fornecedor sofrer um incidente.

## Erros comuns

- Aceitar "somos certificados" sem ver o certificado, a validade e o escopo.
- Confundir SOC 2 Tipo I com Tipo II, ou tratar o relatório como selo.
- Questionário enviado, respondido e nunca lido.
- Contrato sem cláusula de comunicação de incidente: você descobre pelo jornal.
- Auditoria interna feita pela mesma pessoa que configura os sistemas.

## Na prática

Liste os fornecedores críticos (sistema contábil, folha, e-mail, hospedagem, prestador de TI, certificadora), envie o questionário de quinze perguntas, arquive respostas e evidências numa pasta "Terceiros" e marque a reavaliação anual. Faça a autoavaliação do CIS IG1 e registre o resultado: é a sua primeira auditoria interna.

## Resumo

- Auditoria testa controles por evidências datadas, geradas pelo sistema e reproduzíveis; desenho e efetividade operacional.
- Interna (independente da área, plano anual) prepara para a externa (certificação ISO 27001 ou atestação).
- SOC 2: relatório de atestação sobre Trust Services Criteria; Tipo II cobre um período e é o que vale; leia as exceções.
- Fornecedores: classificar, questionar, pedir evidências, contratar com cláusulas de dados e SLA, monitorar anualmente.
- Due diligence de ERP em nuvem: localização, MFA, exportação, backup, logs, perfis, certificações, incidentes, contrato, continuidade.
