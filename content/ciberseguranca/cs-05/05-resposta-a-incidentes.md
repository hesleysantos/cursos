Nesta lição você vai aprender a **responder a um incidente** de forma organizada, seguindo o ciclo do NIST SP 800-61: preparar, detectar e analisar, conter, erradicar, recuperar e aprender. Vai montar **playbooks** para os três incidentes mais comuns em escritórios (phishing, ransomware e conta comprometida), saber quem comunicar e em que prazo, inclusive à ANPD, e acompanhar um incidente guiado. Isso importa porque, no dia do incidente, ninguém pensa com clareza; quem tem roteiro executa, quem não tem improvisa e piora.

## O ciclo do NIST SP 800-61

O **NIST SP 800-61** é o guia de referência mundial de tratamento de incidentes. A Revisão 2 (2012) organiza o processo em quatro fases que formam um ciclo; a Revisão 3 (2025) reescreveu o documento alinhado ao NIST CSF 2.0, mas a lógica continua a mesma:

| Fase | O que acontece |
|---|---|
| 1. Preparação | políticas, contatos, ferramentas, backups, treinamento, playbooks prontos |
| 2. Detecção e análise | perceber que algo aconteceu, confirmar, avaliar escopo e gravidade |
| 3. Contenção, erradicação e recuperação | parar o sangramento, remover a causa, voltar ao normal |
| 4. Atividade pós-incidente | lições aprendidas, relatório, melhorias |

A analogia é o pronto-socorro: **detecção** é a triagem; **contenção** é estancar o sangramento antes de diagnosticar tudo; **erradicação** é a cirurgia; **recuperação** é a alta.

### Preparação

É a fase que decide todas as outras. Mínimo para um escritório: lista de contatos (TI, prestador de segurança, advogado, seguradora, clientes-chave) impressa e fora do computador; backup testado; inventário de máquinas e contas; playbooks; definição de quem decide (desligar o servidor? pagar?).

### Detecção e análise

O sinal vem de um alerta (EDR, SIEM), de uma pessoa ("meu computador está estranho") ou de fora (cliente recebeu e-mail falso do escritório). O analista confirma se é incidente mesmo, estima **escopo** (quantas máquinas, quais dados) e **gravidade**, e começa a **documentar**: hora de cada ação, quem fez, o que viu.

### Contenção, erradicação e recuperação

**Contenção** primeiro: isolar a máquina da rede (EDR ou cabo fora; **não desligue**, a memória tem evidências), bloquear a conta, revogar sessões. Depois **erradicação**: remover malware, fechar a vulnerabilidade, trocar senhas, reinstalar máquinas comprometidas. Por fim **recuperação**: restaurar do backup, validar, monitorar de perto por dias.

### Lições aprendidas

Em até duas semanas, reunião com os envolvidos: o que aconteceu, o que funcionou, o que faltou, o que muda, com ações e prazos. Sem essa fase, o incidente se repete.

## Playbooks

Um **playbook** é o roteiro de um tipo específico de incidente: passos numerados, quem executa, o que registrar. Três que todo escritório precisa:

**Phishing (alguém clicou):**
1. Não apague o e-mail; encaminhe como anexo para quem analisa.
2. A pessoa digitou senha? Troque imediatamente e revogue sessões ativas.
3. Baixou ou abriu anexo? Isole a máquina e acione o EDR.
4. Procure o mesmo e-mail nas caixas dos demais e remova; bloqueie o remetente.

**Ransomware:**
1. Isole imediatamente as máquinas afetadas (rede), não desligue.
2. Identifique a extensão/nota de resgate; consulte o [No More Ransom](https://www.nomoreransom.org) para decifradores.
3. Verifique se o backup está íntegro e **desconectado**; não o conecte à rede infectada.
4. Acione o prestador de resposta e o advogado; avalie notificação à ANPD.
5. Reinstale máquinas, restaure dados, troque todas as senhas, monitore.
6. Não pague sem avaliar: pagar não garante nada e pode financiar crime; registre boletim de ocorrência.

**Conta comprometida (e-mail/nuvem):**
1. Redefina a senha e revogue todos os tokens/sessões.
2. Procure regras de encaminhamento e de exclusão criadas na caixa; remova.
3. Revise o log de auditoria: de onde logou, o que acessou, o que enviou.
4. Avise contatos que receberam e-mails falsos (boleto trocado é o golpe mais comum).
5. Ative MFA se não havia; avalie se dados pessoais foram expostos.

## Comunicação e LGPD

Dentro da empresa, uma pessoa fala por todos; os demais não postam em redes nem respondem clientes por conta própria. Mensagens para clientes são **curtas, verdadeiras e sem especulação**.

A **LGPD (art. 48)** exige que o controlador comunique à **ANPD** e ao **titular** o incidente de segurança que possa acarretar risco ou dano relevante aos titulares. A **Resolução CD/ANPD nº 15/2024** regulamentou isso: comunicação em **3 dias úteis** a partir do conhecimento de que o incidente afetou dados pessoais, por formulário no site da ANPD, podendo ser complementada depois. O incidente deve constar de um **registro interno** mesmo quando não for comunicado. Ransomware sobre dados pessoais de clientes é caso típico de comunicação; vazamento de documentos fiscais, mais ainda.

## Exemplo guiado: escritório contábil

Terça, 8h40. A auxiliar fiscal abre um "comprovante de pagamento" recebido por e-mail. Às 9h10, não consegue abrir as planilhas da pasta compartilhada; os arquivos têm extensão `.lockbit`. Ela avisa o sócio.

- **9h12, contenção:** o sócio tira o cabo de rede da estação dela e do servidor de arquivos, desliga o Wi-Fi e liga para o prestador de TI.
- **9h30, análise:** o prestador verifica o EDR: a estação dela e o servidor estão criptografados; as outras 10 estações não. O backup na nuvem (imutável) está íntegro, última cópia às 2h.
- **10h, comunicação:** o sócio avisa a equipe pessoalmente; registra o horário de cada ação num caderno.
- **Tarde, erradicação:** a estação é formatada; o servidor é reinstalado; todas as senhas são trocadas; MFA é ligado no Microsoft 365.
- **Quarta, recuperação:** restauração do backup; perde-se o trabalho entre 2h e 9h de terça. Monitoramento reforçado por 15 dias.
- **Quarta, LGPD:** advogado e sócio concluem que havia dados pessoais de clientes e que não há prova de ausência de exfiltração; comunicam a ANPD dentro dos 3 dias úteis e avisam os clientes.
- **Sexta seguinte, lições aprendidas:** macros bloqueadas, auxiliar sem privilégio de administrador, treinamento de phishing trimestral, playbook atualizado com os telefones que faltaram.

## Erros comuns

- Desligar a máquina infectada (perde a memória) ou formatar antes de coletar evidências.
- Conectar o backup na rede ainda infectada.
- Esperar "ter certeza" para conter. Contenha primeiro, confirme depois.
- Não documentar horários e decisões.
- Pular a reunião de lições aprendidas porque "já passou".

## Na prática

Escreva hoje os três playbooks em uma página cada, com os telefones. Imprima e guarde fora do computador. Faça um exercício de mesa (simulação verbal) de 30 minutos com a equipe a cada seis meses.

## Resumo

- NIST SP 800-61: preparação; detecção e análise; contenção, erradicação e recuperação; lições aprendidas.
- Conter primeiro (isolar sem desligar), erradicar (reinstalar, trocar senhas), recuperar (restaurar e monitorar).
- Playbooks de phishing, ransomware e conta comprometida: passos numerados, com telefones.
- LGPD art. 48 + Resolução CD/ANPD 15/2024: comunicar ANPD e titulares em 3 dias úteis quando houver risco relevante; registrar internamente sempre.
