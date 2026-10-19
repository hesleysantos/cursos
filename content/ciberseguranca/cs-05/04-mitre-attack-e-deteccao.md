Nesta lição você vai aprender a **falar a língua dos ataques** usando o MITRE ATT&CK, a enciclopédia pública de táticas e técnicas de adversários. Vai mapear um ataque nessa matriz, distinguir **indicadores de comprometimento** de **comportamento**, entender o que é *threat hunting* e reconhecer os eventos do Windows e do Sysmon que denunciam um ataque. Isso importa porque detectar bem é saber **o que procurar**, e o ATT&CK é esse catálogo.

## O ATT&CK em uma frase

**MITRE ATT&CK** (lê-se "atack") é uma base de conhecimento gratuita, mantida pela organização MITRE, que descreve **como** os atacantes agem no mundo real, organizada em **táticas** (o objetivo de cada etapa) e **técnicas** (o método para alcançá-lo). Analogia: a tática é a **rubrica contábil** ("despesa com pessoal"); a técnica é o **lançamento específico** ("hora extra do mês").

## As 14 táticas da matriz Enterprise

Elas seguem, aproximadamente, a ordem de um ataque; cada uma responde a uma pergunta do atacante:

| # | Tática | Pergunta |
|---|---|---|
| 1 | Reconnaissance | o que o alvo expõe? |
| 2 | Resource Development | que infraestrutura preparo? |
| 3 | Initial Access | como entro? |
| 4 | Execution | como rodo código? |
| 5 | Persistence | como sobrevivo a um reinício? |
| 6 | Privilege Escalation | como viro administrador? |
| 7 | Defense Evasion | como engano o antivírus? |
| 8 | Credential Access | como roubo senhas? |
| 9 | Discovery | o que há na rede? |
| 10 | Lateral Movement | como pulo para outras máquinas? |
| 11 | Collection | que dados junto? |
| 12 | Command and Control | como falo com minha base? |
| 13 | Exfiltration | como tiro os dados? |
| 14 | Impact | como causo dano? |

Cada técnica tem um código. Os que você verá sempre: **T1566** Phishing, **T1078** Valid Accounts (contas legítimas roubadas), **T1059** Command and Scripting Interpreter (PowerShell, cmd), **T1110** Brute Force, **T1003** OS Credential Dumping (senhas da memória), **T1021** Remote Services (RDP, SMB), **T1053** Scheduled Task/Job, **T1486** Data Encrypted for Impact (ransomware).

## Mapeando um ataque

Um caso típico em escritório contábil, traduzido para o ATT&CK:

1. E-mail "Notificação de processo trabalhista" com anexo. **Initial Access: T1566.001 Phishing com anexo.**
2. A funcionária abre o arquivo; uma macro executa PowerShell. **Execution: T1059.001 PowerShell.**
3. O script cria uma tarefa agendada de hora em hora. **Persistence: T1053.005 Scheduled Task.**
4. Extrai senhas salvas no navegador. **Credential Access: T1555.003 Credentials from Web Browsers.**
5. Com a senha do administrador, conecta por RDP no servidor. **Lateral Movement: T1021.001 RDP.**
6. Copia a pasta de clientes para um serviço na nuvem. **Exfiltration: T1567 Exfiltration Over Web Service.**
7. Criptografa tudo e deixa o resgate. **Impact: T1486.**

O valor concreto: para **cada** passo você pergunta "eu detectaria isso? Com qual log?". O passo 3 gera o evento 4698 (tarefa agendada criada). Se ninguém olha esse evento, o passo é invisível.

## IoC versus comportamento

Um **indicador de comprometimento (IoC)** é um dado concreto de um ataque conhecido: hash de arquivo malicioso, IP do servidor de comando, domínio. É fácil de bloquear e **fácil de trocar**: o atacante recompila o malware e o hash muda; registra outro domínio e o IoC morre.

**Comportamento** é o padrão de ação: "Word abrindo PowerShell", "usuário comum rodando `vssadmin delete shadows`", "login às 3h de país onde a empresa não opera". Trocar comportamento custa caro, porque exige mudar o método.

A **Pirâmide da Dor**, de David Bianco, organiza isso: na base, hashes e IPs (triviais de trocar); no topo, táticas, técnicas e procedimentos (TTPs), que doem para o adversário mudar. Detecção madura usa IoCs para bloqueio rápido e comportamento para pegar o novo.

## Threat hunting (noção)

**Threat hunting** é procurar ativamente, **sem esperar o alerta**, sinais de que algo já está dentro. Parte de uma hipótese baseada no ATT&CK: "se alguém usou T1053 aqui, haveria tarefas agendadas recentes que ninguém reconhece". O caçador consulta o SIEM, lista as tarefas das últimas duas semanas e revisa uma a uma; mesmo sem achar nada, sai dali com uma regra de detecção nova.

## Eventos do Windows que denunciam um ataque

O log de **Segurança** do Windows (Visualizador de Eventos) é a fonte número um. IDs para decorar:

| ID | Significado | Por que importa |
|---|---|---|
| 4624 | Logon bem-sucedido | *Logon Type* diz como: 2 interativo, 3 rede, 10 RDP |
| 4625 | Logon falhou | muitos em sequência = força bruta |
| 4672 | Privilégios especiais atribuídos | um administrador entrou |
| 4688 | Novo processo criado | mostra a linha de comando (se a auditoria estiver ativa) |
| 4698 | Tarefa agendada criada | persistência |
| 4720 | Conta de usuário criada | porta dos fundos |
| 4732 | Membro adicionado a grupo local | alguém virou administrador |
| 1102 | Log de auditoria apagado | alguém esconde rastros |
| 7045 (log Sistema) | Novo serviço instalado | persistência |

> **Dica:** por padrão o Windows **não** registra o 4688 com a linha de comando; ative *Auditoria de Criação de Processo* e *Incluir linha de comando* na Política de Grupo.

## Sysmon

O **Sysmon** (System Monitor), da suíte Sysinternals da Microsoft, é gratuito e grava eventos muito mais ricos que o log padrão:

- **Event 1:** criação de processo, com hash, linha de comando e **processo pai** (onde "Word abriu PowerShell" aparece).
- **Event 3:** conexão de rede feita por um processo.
- **Event 11:** arquivo criado.
- **Event 13:** valor de registro alterado (persistência clássica em `Run`).
- **Event 22:** consulta DNS feita por um processo.

Instalado com um arquivo de configuração da comunidade (o de SwiftOnSecurity é o ponto de partida habitual), o Sysmon alimenta o SIEM com exatamente o rastro que as técnicas do ATT&CK deixam.

## Erros comuns

- Bloquear só IoCs (hashes, IPs) e se considerar protegido. Eles mudam em minutos.
- Não ativar a auditoria de criação de processos e não conseguir reconstruir o ataque.
- Tratar o ATT&CK como lista a "cobrir 100%". Priorize as técnicas mais usadas contra o seu porte.

## Na prática

Mapeie o último incidente que você conheceu no ATT&CK e, para cada passo, anote qual evento do Windows ou do Sysmon o revelaria. As lacunas são o seu plano de detecção.

## Resumo

- ATT&CK organiza ataques em 14 táticas (objetivos) e centenas de técnicas (métodos), com códigos como T1566 (phishing) e T1486 (ransomware); mapear um ataque revela o que você consegue ou não detectar.
- IoCs são fáceis de trocar; comportamento é caro de trocar. Suba a Pirâmide da Dor.
- Eventos essenciais do Windows: 4624, 4625, 4672, 4688, 4698, 4720, 4732, 1102, 7045.
- Sysmon (eventos 1, 3, 11, 13, 22) mostra processo pai, rede, registro e DNS.
