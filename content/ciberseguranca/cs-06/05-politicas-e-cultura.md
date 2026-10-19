Nesta lição você vai aprender a escrever a **política de segurança da informação** e as políticas que a acompanham (uso aceitável, senhas, BYOD, trabalho remoto), a montar um programa de **conscientização** que funcione, com treinamento e simulação de phishing, a medir resultados e a cuidar dos dois momentos mais sensíveis da vida de um funcionário: a **entrada** e a **saída**. Isso importa porque controle técnico sem regra escrita e sem pessoa treinada é um cadeado sem combinação definida: todo mundo usa do seu jeito.

## Por que escrever políticas

Uma **política** é a decisão da direção escrita, aprovada e comunicada. Ela serve a três coisas: diz às pessoas o que se espera delas; dá base para cobrar (inclusive em processo trabalhista); e é a primeira evidência que qualquer auditor, cliente ou a ANPD pede. A ISO 27001 exige uma política de segurança aprovada pela direção (cláusula 5.2) e um conjunto de políticas por tema (Anexo A, controle 5.1).

A regra de ouro: **política curta, que as pessoas leem, é melhor que política perfeita, que ninguém lê.** Duas ou três páginas para a política principal; uma página para cada política específica.

## Estrutura da política de segurança da informação (PSI)

1. **Objetivo e escopo:** o que protege (informações do escritório e dos clientes), a quem se aplica (sócios, funcionários, estagiários, prestadores).
2. **Papéis e responsabilidades:** direção aprova e financia; um responsável pela segurança coordena; todos cumprem; o encarregado LGPD orienta.
3. **Princípios:** confidencialidade, integridade, disponibilidade; menor privilégio; necessidade de conhecer.
4. **Diretrizes por tema** (ou referência às políticas específicas): classificação da informação, controle de acesso, senhas e MFA, uso de e-mail e internet, dispositivos, trabalho remoto, backup, incidentes, LGPD.
5. **Conformidade e sanções:** o que acontece em caso de descumprimento, conforme o regimento interno e a CLT.
6. **Revisão:** anual ou após incidente; versão, data, quem aprovou.

## Políticas específicas

**Uso aceitável:** equipamentos e contas do escritório são para o trabalho; uso pessoal moderado é tolerado, mas não há expectativa de privacidade no e-mail corporativo (informe isso claramente); proibido instalar software sem autorização, desativar proteções, compartilhar credenciais, usar pendrive de origem desconhecida.

**Senhas e autenticação:** frases-senha longas (mínimo 12–14 caracteres), únicas por serviço, guardadas no gerenciador de senhas fornecido; MFA obrigatório onde disponível; troca só em caso de suspeita de comprometimento (a troca periódica obrigatória foi abandonada pelo NIST em suas diretrizes); nunca compartilhar nem enviar senha por mensagem.

**BYOD (uso de dispositivo pessoal):** permitido apenas com bloqueio de tela, atualizações em dia, criptografia e o aplicativo de gestão (MDM) ou, no mínimo, separação de perfil de trabalho; o escritório pode apagar remotamente os dados corporativos; dados de clientes não ficam em aplicativos pessoais (WhatsApp pessoal, Drive pessoal).

**Trabalho remoto:** VPN para acessar a rede; Wi-Fi doméstico com senha e WPA2/WPA3; nada de Wi-Fi público sem VPN; tela protegida de olhares em locais públicos; documentos impressos em casa seguem a regra de descarte.

## Conscientização que funciona

O treinamento anual de uma hora em que todos assinam a lista e esquecem no dia seguinte **não funciona**. O que funciona:

- **Curto e frequente:** 10 minutos por mês, um tema por vez (golpe do boleto, deepfake de voz pedindo transferência, anexo falso do "Judiciário").
- **Relevante:** exemplos do próprio escritório e dos clientes, não genéricos.
- **Sem humilhação:** quem cai na simulação recebe orientação, não bronca pública. O objetivo é que as pessoas **reportem** sem medo; cultura de culpa produz silêncio.
- **Com a direção presente:** se o sócio pula o treinamento, a mensagem é "isso não importa".

### Simulação de phishing

Uma ferramenta envia e-mails falsos, mas inofensivos, para a equipe, e mede quem clica, quem digita a senha, quem reporta. Opções: GoPhish (gratuito, exige quem opere), o simulador do Microsoft Defender for Office 365, KnowBe4 e similares. Regras: avise que simulações acontecerão (sem dizer quando); comece com cenários fáceis; nunca use temas cruéis (demissão, falecimento, bônus); use o resultado para treinar, não para punir.

## Métricas

O que medir para saber se o programa está funcionando:

| Métrica | Meta razoável |
|---|---|
| Taxa de clique em simulações | cair ao longo do ano (de ~30% para menos de 10%) |
| Taxa de **reporte** de phishing (real e simulado) | subir; é a métrica mais importante |
| Tempo até o primeiro reporte de um phishing real | minutos, não dias |
| Conclusão de treinamento | 100% em até 30 dias da contratação |
| Contas sem MFA | zero |
| Acessos de desligados ainda ativos | zero, verificado mensalmente |

Reporte é mais importante que clique: um escritório em que 10% clicam, mas 60% reportam em cinco minutos, está mais protegido que um em que 5% clicam e ninguém avisa.

## Onboarding e offboarding

**Entrada (onboarding):** conta criada com perfil mínimo; termo de confidencialidade e ciência das políticas assinados; gerenciador de senhas e MFA configurados no primeiro dia; treinamento inicial nos primeiros 30 dias; equipamento com disco criptografado e EDR.

**Saída (offboarding):** é o momento de maior risco de vazamento, e o mais negligenciado. Lista de verificação para o **mesmo dia** do desligamento: bloquear conta de e-mail e do sistema; revogar MFA, tokens e acessos a sistemas de terceiros (portais de governo, bancos, certificado digital); trocar senhas compartilhadas que a pessoa conhecia (Wi-Fi, admin local, portais); recolher equipamento e verificar devolução; transferir arquivos e e-mails ao gestor; remover de grupos de WhatsApp e listas; registrar tudo com data e assinatura. Desligamento litigioso: fazer o bloqueio **antes** da conversa.

## Erros comuns

- Política de 40 páginas que ninguém leu, nem quem assinou.
- Regras impossíveis de cumprir (trocar senha a cada 30 dias) que incentivam a burlar.
- Simulação de phishing usada para expor ou punir; a equipe para de reportar.
- Offboarding em "até uma semana"; o ex-funcionário entra no e-mail no fim de semana.
- Prestadores e estagiários fora do escopo das políticas e do treinamento.

## Na prática

Escreva a PSI em três páginas, com as cinco políticas específicas em uma página cada, aprove em reunião de sócios (com ata), colha ciência de todos, e marque o primeiro treinamento de 10 minutos para o mês que vem. Lista de offboarding impressa e colada na pasta de RH.

## Resumo

- Política é decisão da direção escrita, comunicada e cobrável; curta e lida vale mais que longa e ignorada.
- PSI: objetivo, papéis, princípios, diretrizes por tema, sanções, revisão. Políticas específicas de uso aceitável, senhas, BYOD e trabalho remoto.
- Conscientização: curta, frequente, relevante, sem humilhação, com a direção presente; simulação de phishing para treinar, não punir.
- Métricas: taxa de reporte importa mais que taxa de clique; MFA em todos; zero acessos de desligados.
- Onboarding com privilégio mínimo e treinamento; offboarding no mesmo dia, com lista de verificação assinada.
