Nesta lição você vai aprender a fazer **gestão de riscos de segurança** do jeito que os frameworks pedem e que uma pequena empresa consegue manter: identificar, analisar com probabilidade × impacto, avaliar, tratar, registrar e revisar. Vai conhecer a **ISO/IEC 27005**, o **apetite a risco** e montar um registro de riscos completo para um escritório contábil. É a gestão de riscos que transforma "precisamos de segurança" em "precisamos destes cinco controles, nesta ordem, por estes motivos".

## O vocabulário

- **Ativo:** algo de valor: dados de clientes, o sistema contábil, o certificado digital, a reputação.
- **Ameaça:** o que pode causar dano: ransomware, funcionário descontente, enchente, erro humano.
- **Vulnerabilidade:** a fraqueza que a ameaça explora: sem MFA, backup não testado, RDP exposto.
- **Risco:** a combinação de **probabilidade** de a ameaça explorar a vulnerabilidade com o **impacto** que isso causaria no ativo.

A frase que junta tudo: "o risco de **ransomware** (ameaça) explorar a **falta de backup off-line** (vulnerabilidade) e tornar os **dados dos clientes** (ativo) indisponíveis por uma semana (impacto) é **alto**".

## O processo da ISO/IEC 27005

A **ISO/IEC 27005:2022** é a norma da família 27000 dedicada à gestão de riscos de segurança da informação. Ela detalha o que a 27001 exige na cláusula 6, em etapas:

1. **Estabelecer o contexto:** escopo, critérios de probabilidade e impacto, apetite a risco.
2. **Identificar** os riscos: ativos, ameaças, vulnerabilidades, consequências.
3. **Analisar:** estimar probabilidade e impacto de cada risco.
4. **Avaliar:** comparar o nível de risco com os critérios e priorizar.
5. **Tratar:** escolher o que fazer com cada risco e planejar.
6. **Comunicar e monitorar:** registrar, revisar periodicamente, atualizar.

## Analisar: probabilidade × impacto

A forma mais usada em pequenas empresas é a **análise qualitativa** com escalas de 1 a 5:

| Nota | Probabilidade | Impacto |
|---|---|---|
| 1 | raro (uma vez em muitos anos) | insignificante |
| 2 | improvável (uma vez em 5 anos) | menor (horas de retrabalho) |
| 3 | possível (uma vez por ano) | moderado (dias parados, multa pequena) |
| 4 | provável (algumas vezes por ano) | maior (perda de clientes, multa relevante) |
| 5 | quase certo (mensal) | severo (ameaça a continuidade do negócio) |

**Nível de risco = probabilidade × impacto**, de 1 a 25. Com faixas: 1–4 baixo, 5–9 médio, 10–14 alto, 15–25 crítico. As faixas são decisão sua; o que importa é usar as mesmas sempre.

A análise **quantitativa** (perda esperada anual = probabilidade anual × custo do evento, em reais) é mais precisa e mais difícil; use quando tiver dados, como o custo de um dia parado.

## Apetite a risco

**Apetite a risco** é o nível de risco com que a direção aceita conviver. Exemplo: "aceitamos riscos até nível 6; de 7 a 14, tratar em 90 dias; de 15 para cima, imediatamente". Essa frase, assinada pelos sócios, é governança: transforma a priorização em decisão de negócio, não em opinião da TI.

## Tratar: as quatro opções

| Opção | O que significa | Exemplo |
|---|---|---|
| **Mitigar** (modificar) | reduzir probabilidade ou impacto com controles | ligar MFA, fazer backup imutável |
| **Aceitar** (reter) | conviver com o risco, documentando a decisão | risco baixo de o site institucional sair do ar |
| **Transferir** (compartilhar) | passar parte do impacto a terceiro | seguro cibernético, contrato com SLA |
| **Evitar** | eliminar a atividade que gera o risco | parar de guardar cópias de documentos pessoais que não são necessárias |

Aceitar é legítimo quando é **consciente e registrado**; aceitar por omissão não é. Transferir nunca é total: o seguro paga, mas a LGPD responsabiliza o controlador do mesmo jeito.

## Registro de riscos

O **registro de riscos** é a planilha viva com, para cada risco: identificador, descrição (ativo, ameaça, vulnerabilidade), probabilidade, impacto, nível, tratamento, controles, responsável, prazo e **risco residual** (o que sobra depois do tratamento). Revisado a cada trimestre e sempre que algo muda (novo sistema, incidente, nova lei).

## Exemplo completo: escritório contábil de 12 pessoas

| ID | Risco | P | I | Nível | Tratamento | Controles | Residual |
|---|---|---|---|---|---|---|---|
| R1 | Ransomware criptografa servidor de arquivos e backup conectado | 4 | 5 | 20 crítico | mitigar | backup imutável, EDR, macros bloqueadas, treinamento | 2×5 = 10 |
| R2 | Conta de e-mail invadida por phishing e usada em golpe do boleto | 4 | 4 | 16 crítico | mitigar | MFA obrigatório, alerta de encaminhamento, dupla checagem de dados bancários | 2×3 = 6 |
| R3 | Certificado digital A1 copiado por ex-funcionário | 3 | 4 | 12 alto | mitigar | certificado em cofre com senha, offboarding com revogação | 1×4 = 4 |
| R4 | Vazamento de dados de clientes por notebook perdido | 2 | 4 | 8 médio | mitigar | BitLocker, bloqueio remoto | 2×2 = 4 |
| R5 | Envio de dados ao cliente errado por e-mail | 4 | 3 | 12 alto | mitigar | DLP, confirmação de destinatário, anexos com senha | 2×3 = 6 |
| R6 | Falha de disco do servidor | 2 | 3 | 6 médio | transferir + mitigar | contrato de suporte com SLA, backup | 2×2 = 4 |
| R7 | Site institucional fora do ar | 3 | 1 | 3 baixo | aceitar | — | 3 |
| R8 | Fornecedor de sistema contábil em nuvem sofre incidente | 2 | 5 | 10 alto | transferir + mitigar | contrato com cláusula LGPD, exportação mensal dos dados | 2×3 = 6 |

Leitura: com apetite "até 6", seis riscos passam do limite e exigem ação, nesta ordem de prioridade: R1 (20), R2 (16), R3 e R5 (12), R8 (10) e R4 (8); só R6 (6) e R7 (3) ficam dentro do apetite. Esse quadro de uma página é o coração do plano do projeto final.

## Calculando em Python

A lógica cabe em poucas linhas:

```python
def nivel(prob, impacto):
    return prob * impacto

def faixa(n):
    if n <= 4:
        return "baixo"
    if n <= 9:
        return "medio"
    if n <= 14:
        return "alto"
    return "critico"

riscos = [("R1 ransomware", 4, 5), ("R4 notebook perdido", 2, 4), ("R7 site fora", 3, 1)]
for nome, p, i in sorted(riscos, key=lambda r: nivel(r[1], r[2]), reverse=True):
    n = nivel(p, i)
    print(nome, n, faixa(n))
```

Saída:

```
R1 ransomware 20 critico
R4 notebook perdido 8 medio
R7 site fora 3 baixo
```

## Erros comuns

- Listar 80 riscos genéricos copiados da internet. Dez riscos reais, bem descritos, valem mais.
- Pontuar tudo como 5×5 por medo. Se tudo é crítico, nada é prioridade.
- Esquecer o risco residual: tratou e continua alto? Precisa de mais controle ou de aceitação formal.
- Não revisar: o registro de 2023 não cobre o sistema novo de 2026.
- Confundir ameaça com vulnerabilidade: ransomware é ameaça; "sem backup" é vulnerabilidade.

## Na prática

Reserve uma hora com os sócios: listem os oito ativos mais valiosos, pensem na pior ameaça plausível para cada um, pontuem probabilidade e impacto e decidam o apetite. Está pronto o primeiro registro de riscos, e ele já diz onde gastar o próximo real.

## Resumo

- Risco = probabilidade de uma ameaça explorar uma vulnerabilidade × impacto no ativo.
- ISO/IEC 27005: contexto, identificar, analisar, avaliar, tratar, comunicar e monitorar.
- Escalas de 1 a 5 e faixas fixas; apetite a risco definido e assinado pela direção.
- Quatro tratamentos: mitigar, aceitar (consciente), transferir (parcial) e evitar.
- Registro de riscos com responsável, prazo e risco residual, revisado a cada trimestre.
