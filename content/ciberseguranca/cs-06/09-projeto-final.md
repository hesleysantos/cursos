Nesta lição você vai elaborar o **Plano de Segurança e Privacidade** de uma empresa fictícia, o **Escritório Contábil Horizonte**, com 12 pessoas. É o projeto final do curso: um documento de 8 a 15 páginas que reúne tudo o que você aprendeu, no formato que um sócio, um auditor ou um cliente esperaria. Você recebe o modelo, a rubrica de avaliação e um **exemplo resolvido** resumido; ao final, terá um documento para o portfólio e um roteiro reutilizável.

## A empresa fictícia

**Escritório Contábil Horizonte Ltda.**, Campinas (SP). 12 pessoas: 2 sócios, 3 no fiscal, 3 no departamento pessoal, 2 no contábil, 1 administrativo-financeiro, 1 estagiário. Cerca de 110 clientes. Sistemas: contábil/fiscal/folha em nuvem (SaaS), Microsoft 365 sem MFA obrigatório, servidor de arquivos local (Windows Server 2019) com pasta "Clientes", 12 estações Windows 11 (todos administradores), 3 notebooks, roteador do provedor com Wi-Fi único, backup num HD externo sempre conectado, 40 certificados digitais A1 de clientes numa pasta da rede, prestador de TI avulso. Já houve um golpe do boleto e um notebook perdido.

## O modelo (estrutura obrigatória)

1. **Sumário executivo** (meia página): situação atual, três maiores riscos, o que o plano propõe, custo e prazo.
2. **Escopo e contexto:** empresa, pessoas, sistemas, dados tratados, obrigações (LGPD, contratos), partes interessadas.
3. **Governança:** responsável pela segurança, encarregado LGPD, papel dos sócios, revisão, apetite a risco.
4. **Inventário:** hardware, software/serviços, contas, dados (RoPA resumido com 8 a 12 linhas).
5. **Avaliação de riscos:** 8 a 12 riscos com probabilidade × impacto, tratamento, controle, responsável, prazo, residual.
6. **Controles por framework:** cada controle mapeado ao CIS Controls v8 (IG1), à função do NIST CSF 2.0 e, quando couber, ao Anexo A da ISO 27001:2022.
7. **Políticas:** PSI resumida e políticas específicas, com os pontos principais.
8. **Privacidade:** papéis por processo, bases legais, contratos, retenção, atendimento a titulares, RIPD necessário ou não.
9. **Resposta a incidentes:** contatos, playbooks, procedimento de comunicação à ANPD, kit forense mínimo.
10. **Continuidade:** BIA resumida, RTO/RPO, backup, plano "3 dias sem sistema", calendário de testes.
11. **Cronograma:** 90 dias em semanas, com dono por linha; e o que fica para os 90 seguintes.
12. **Orçamento:** itens, ordem de grandeza mensal e única, comparação com o custo de um incidente.
13. **Indicadores:** os 6 a 8 números do painel mensal.
14. **Anexos:** lista de offboarding, registro de incidente, questionário de fornecedor.

## Rubrica de avaliação

Pontue cada critério de 0 a 4 (0 ausente; 1 fraco; 2 aceitável; 3 bom; 4 excelente). Total máximo: 40. Aprovação sugerida: 28 (70%).

| Critério | O que vale 4 |
|---|---|
| 1. Diagnóstico | fraquezas do enunciado identificadas e outras inferidas |
| 2. Riscos | 8–12 riscos específicos, escalas coerentes, tratamento justificado, residual calculado |
| 3. Priorização | primeiros controles são os de maior redução de risco por custo |
| 4. Mapeamento a frameworks | cada controle ligado a CIS/CSF/ISO corretamente, sem invenções |
| 5. LGPD | papéis por processo, bases legais, prazos da ANPD, contratos e retenção corretos |
| 6. Resposta e continuidade | playbooks executáveis, 3 dias úteis, backup 3-2-1-1-0 testado, RTO/RPO coerentes |
| 7. Pessoas e políticas | PSI curta, políticas específicas, onboarding/offboarding, treinamento com métricas |
| 8. Cronograma e orçamento | realistas, com dono e data, faixas com ressalva, comparação com custo de incidente |
| 9. Indicadores | mensuráveis, com meta, cabem numa página |
| 10. Clareza | linguagem de negócio; sumário que um sócio entende em 3 minutos |

## Exemplo resolvido (resumo)

**Sumário executivo.** A Horizonte opera com risco crítico de ransomware e de invasão de contas: backup sempre conectado, todos administradores, sem MFA, 40 certificados digitais em pasta compartilhada. O plano implanta, em 90 dias, MFA, backup imutável, usuário padrão, EDR gerenciado, políticas e resposta a incidentes, por um custo mensal pequeno diante da perda estimada de uma a duas semanas de operação e de possível sanção da ANPD.

**Governança.** Sócio A patrocina; o administrativo-financeiro é o responsável operacional; a sócia B é a encarregada LGPD, com canal privacidade@. Revisão trimestral. Apetite: nível até 6.

**Riscos (trecho).**

| ID | Risco | P×I | Tratamento e controle | Residual |
|---|---|---|---|---|
| R1 | Ransomware criptografa servidor e HD de backup conectado | 4×5=20 | mitigar: backup imutável + off-line, EDR, usuário padrão, macros bloqueadas | 2×5=10, reavaliar após 90 dias |
| R2 | Conta do M365 invadida; novo golpe do boleto | 4×4=16 | mitigar: MFA obrigatório, alerta de encaminhamento, dupla checagem de dados bancários por telefone | 2×3=6 |
| R3 | Certificados A1 copiados e usados indevidamente | 3×5=15 | mitigar: cofre com acesso nominal e log; revogação no offboarding | 1×5=5 |
| R4 | Notebook perdido com dados de clientes | 3×4=12 | mitigar: BitLocker, apagamento remoto | 3×1=3 |
| R5 | SaaS contábil indisponível por incidente do fornecedor | 2×5=10 | transferir + mitigar: contrato com SLA e cláusula LGPD; exportação mensal | 2×3=6 |

**Controles por framework (trecho).**

| Controle | CIS v8 | NIST CSF 2.0 | ISO 27001 Anexo A |
|---|---|---|---|
| MFA em todas as contas | 6.3, 6.5 | PR.AA | 5.17, 8.5 |
| Backup imutável e teste de restauração | 11.2–11.5 | RC.RP | 8.13 |
| Usuário padrão, admin separado | 5.4 | PR.AA | 5.15, 8.2 |
| EDR em todas as máquinas | 10.1 | DE.CM | 8.7 |
| Treinamento de conscientização | 14.1 | PR.AT | 6.3 |
| Resposta a incidentes | 17.1–17.3 | RS.MA | 5.24–5.26 |

**LGPD.** Folha e fiscal dos clientes: Horizonte é **operadora**; cadastro e financeiro de clientes, RH próprio: **controladora**. Bases: obrigação legal e execução de contrato; consentimento só para marketing. Contrato-padrão com cláusula de dados para os 110 clientes em 60 dias. Tabela de temporalidade. RIPD não exigido no momento; reavaliar se adotar ponto biométrico ou IA sobre dados de funcionários.

**Resposta e continuidade.** Playbooks em uma página; contatos impressos; comunicação à ANPD em até 3 dias úteis decidida pela encarregada com o advogado. BIA: folha e guias com RTO 8 h e RPO 4 h; escrituração com RTO 3 dias. Backup: nuvem imutável a cada 4 h + HD off-line semanal em rodízio; restauração testada trimestralmente.

**Cronograma e orçamento.** Os 90 dias da lição 7 com nomes: semanas 1–2 inventário e riscos (administrativo); semanas 3–4 MFA, gerenciador, backup (prestador + administrativo); e assim por diante. Orçamento mensal em ordem de grandeza, mais custo único de notebooks reserva e HDs; comparação com o custo de uma semana parada (honorários não faturados, multas de clientes, horas extras) e com o teto de sanção da LGPD.

**Indicadores.** Contas sem MFA (meta 0); desligados ativos (0); máquinas sem EDR/patch (0); último teste de restauração; reporte e clique em phishing; alertas graves e tempo de resposta; itens CIS IG1 concluídos (meta 45 de 56 em 90 dias).

## Como fazer o seu

1. Leia o enunciado da Horizonte duas vezes e liste as fraquezas (há pelo menos dez).
2. Preencha as seções 2 a 5 primeiro: sem diagnóstico e riscos, o resto é chute.
3. Escolha os controles pelos riscos, não pelo catálogo; depois mapeie aos frameworks.
4. Escreva o sumário executivo por último, em linguagem de sócio, e avalie-se pela rubrica.

## Erros comuns

- Plano genérico que serviria para qualquer empresa: a rubrica pune.
- Mapear controles a códigos de framework inventados; se não tem certeza do número, descreva o controle e cite o tema.
- Orçamento com valores precisos sem fonte, ou sem comparação com o custo do incidente.
- Esquecer os certificados digitais: no escritório contábil, é um dos ativos mais sensíveis.

## Na prática

Num escritório real, este plano não fica na gaveta: o sumário executivo vai para a reunião de sócios que aprova o orçamento; a tabela de riscos vira a pauta da revisão trimestral; o cronograma de 90 dias vira as tarefas do prestador de TI, com data e dono. Quando um cliente grande manda o questionário de segurança antes de fechar contrato, ou quando um auditor pergunta "quem acessa os certificados digitais?", a resposta já está nas seções de inventário e controles. E, no dia em que chegar um e-mail de golpe do boleto, o playbook da seção 9 é o que a equipe abre primeiro.

## Resumo

- O projeto final é um Plano de Segurança e Privacidade de 8 a 15 páginas para a Horizonte, com 14 seções obrigatórias.
- Rubrica de 10 critérios × 4 pontos; aprovação sugerida em 28/40.
- Ordem de trabalho: diagnóstico → riscos → controles → frameworks → políticas e LGPD → resposta e continuidade → cronograma, orçamento e indicadores → sumário executivo.
- Especificidade, priorização por risco e linguagem de negócio são o que separa um plano bom de um genérico.
