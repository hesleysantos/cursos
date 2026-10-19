Nesta lição você vai juntar tudo em um **programa de segurança executável** para uma pequena empresa: um roteiro de 90 dias para um escritório contábil, com o que fazer em cada semana, um orçamento realista, o que vale terceirizar para um **MSSP** e os indicadores que mostram se o programa está funcionando. Isso importa porque conhecimento sem roteiro vira lista de desejos; o que protege é o que foi implantado, medido e mantido.

## Princípios do roteiro

1. **Primeiro o que reduz mais risco por real gasto:** MFA, backup imutável, conta padrão, atualizações. São baratos e cortam a maior parte dos ataques reais.
2. **Uma coisa por vez, com dono e data.** Dez iniciativas simultâneas terminam em zero.
3. **Evidência desde o início:** cada passo gera um registro (planilha, captura de tela, ata). É o que a lição de auditoria pediu.
4. **O sócio patrocina.** Sem a direção, o programa morre na primeira reclamação de "ficou chato".

O roteiro abaixo segue a ordem do NIST CSF 2.0 e usa o CIS IG1 como lista de conferência.

## Roteiro de 90 dias

**Dias 1–15: Governar e identificar**
- Nomear o responsável pela segurança e o encarregado LGPD; registrar em ata.
- **Inventário** de hardware (computadores, celulares, roteador, impressora), de software/serviços (sistemas, SaaS) e de **contas** (quem tem acesso a quê); desativar as de ex-funcionários e as genéricas.
- **Registro de riscos** inicial (lição 2) e **RoPA** inicial (lição 4): uma reunião de duas horas cada.
- Definir apetite a risco e aprovar o roteiro.

**Dias 16–30: Proteger (identidade e dados)**
- **MFA obrigatório** no e-mail/Workspace/M365, no sistema contábil, nos bancos e no gerenciador de senhas; desligar autenticação legada.
- **Gerenciador de senhas** para todos; eliminar senhas em planilha ou papel.
- **Backup 3-2-1-1-0**: nuvem imutável + HD off-line em rodízio; primeiro **teste de restauração** documentado.
- Certificados digitais A1 em cofre, com acesso nominal.

**Dias 31–45: Proteger (dispositivos e rede)**
- Todos como **usuário padrão**; administrador local com senha única por máquina.
- **Atualizações automáticas** no Windows, navegadores e sistemas.
- **EDR** em todas as máquinas (gerenciado pelo prestador ou MSSP).
- **BitLocker** nos notebooks; bloqueio de tela em 10 minutos; macros do Office bloqueadas.
- Roteador: senha trocada, firmware atualizado, Wi-Fi de visitantes separado, **filtro de DNS**, nada exposto à internet; VPN para acesso remoto.

**Dias 46–60: Políticas e pessoas**
- **PSI** e políticas específicas aprovadas e assinadas (lição 5).
- Primeiro **treinamento** de 30 minutos e primeira **simulação de phishing**.
- Lista de **onboarding/offboarding** em uso.
- Cláusula LGPD nos contratos com clientes e questionário aos fornecedores críticos (lição 6).

**Dias 61–75: Detectar e responder**
- **Auditoria** ativa no Workspace/M365 com os três alertas (encaminhamento externo, login suspeito, compartilhamento público); logs do firewall e do EDR revisados semanalmente pelo prestador.
- **Playbooks** de phishing, ransomware e conta comprometida (módulo 5) impressos, com telefones.
- Procedimento de **comunicação à ANPD** (3 dias úteis) e modelo de registro de incidente.
- **Exercício de mesa** de 30 minutos: "é terça, 9h, e os arquivos estão com extensão estranha".

**Dias 76–90: Recuperar, medir e consolidar**
- **BIA** e plano "3 dias sem sistema" (módulo 5); segundo teste de restauração, cronometrado.
- Autoavaliação **CIS IG1** completa: o que falta vira plano para os próximos 90 dias.
- Painel de **indicadores** apresentado aos sócios; ata com decisões e orçamento do ano.

## Orçamento realista

Os valores variam muito por fornecedor, porte e negociação; trate as faixas como **ordem de grandeza** para conversar com prestadores, não como tabela. Para um escritório de 12 pessoas:

| Item | Ordem de grandeza mensal |
|---|---|
| Gerenciador de senhas corporativo | dezenas de reais por usuário |
| EDR gerenciado | dezenas de reais por máquina |
| Backup imutável em nuvem (1–2 TB) | de dezenas a poucas centenas de reais |
| Microsoft 365 Business Premium ou Workspace Business Plus | dezenas de reais por usuário; já incluem boa parte das proteções |
| Filtro de DNS | gratuito (Quad9) a dezenas de reais |
| Prestador de TI/MSSP com monitoramento | de centenas a poucos milhares de reais, conforme escopo e SLA |
| Treinamento e simulação de phishing | gratuito (GoPhish) a dezenas de reais por usuário |
| Seguro cibernético | variável; seguradoras costumam exigir MFA e backup |

Itens de custo único: notebooks reserva, HDs para o backup off-line, horas de consultoria para riscos e políticas. O programa inteiro costuma caber numa fração pequena do faturamento, e custa menos que um único ransomware com uma semana parada.

## O que terceirizar: o MSSP

Um **MSSP (Managed Security Service Provider)** é o prestador que **opera** a segurança para você: monitora EDR e logs 24×7 ou em horário comercial, responde a alertas, aplica patches, gerencia o backup e atua no incidente. Para uma empresa sem TI própria, é a única forma realista de ter detecção e resposta.

Faz sentido terceirizar: monitoramento e resposta (SOC), gestão de EDR e patches, backup, firewall, pentest anual. **Não** se terceiriza: a decisão (governança), o apetite a risco, a responsabilidade legal (o controlador continua sendo o escritório), a conscientização da equipe e a gestão do contrato com o próprio MSSP. Exija: SLA de resposta por gravidade, relatório mensal com indicadores, acesso seu aos logs e ao console, cláusula de saída com entrega de tudo.

## Indicadores

Os que cabem numa página mensal para os sócios:

- Contas sem MFA: **0**. Contas de desligados ativas: **0**.
- Máquinas sem EDR ou com patch crítico pendente há mais de 14 dias: **0**.
- Último teste de restauração: data e resultado (**sucesso**, tempo medido).
- Taxa de reporte e de clique na última simulação de phishing.
- Alertas de alta gravidade no mês e tempo médio de resposta.
- Incidentes registrados no mês (inclusive os pequenos) e status das ações.
- Itens do CIS IG1 concluídos (por exemplo, 41 de 56) e tendência.

## Erros comuns

- Começar comprando ferramenta (NGFW, SIEM) antes de MFA e backup.
- Roteiro sem dono: "a TI vai fazer" não é nome de pessoa.
- Fazer tudo nos 90 dias e nada no dia 91: segurança é rotina, não projeto.
- Terceirizar e esquecer: MSSP sem relatório lido e sem SLA cobrado vira custo sem retorno.
- Esconder o custo do incidente ao comparar: o orçamento parece caro só até o primeiro ransomware.

## Na prática

Copie o roteiro, coloque nomes e datas em cada linha, apresente aos sócios com o registro de riscos ao lado e peça a aprovação do orçamento do ano. Marque na agenda a revisão de 90 em 90 dias. Esse documento, com os indicadores, é o rascunho do projeto final.

## Resumo

- Ordem: o que reduz mais risco por real (MFA, backup imutável, usuário padrão, atualizações), uma coisa por vez, com dono, data e evidência.
- 90 dias: governar e identificar; proteger identidade, dados, dispositivos e rede; políticas e pessoas; detectar e responder; recuperar e medir.
- Orçamento em ordens de grandeza; o programa inteiro custa menos que um incidente.
- MSSP opera (monitoramento, resposta, patches, backup); governança, responsabilidade legal e cultura ficam com a empresa.
- Indicadores mensais de uma página: MFA, desligados, EDR/patches, restauração, phishing, alertas, incidentes, CIS IG1.
