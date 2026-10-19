Nesta lição você vai aprender a proteger o que a maioria das empresas já usa sem perceber que é "nuvem": e-mail e documentos no Google Workspace ou Microsoft 365, o sistema contábil em SaaS, arquivos em buckets de armazenamento. Vai entender o modelo de **responsabilidade compartilhada**, o papel do **IAM**, por que o MFA precisa ser obrigatório e quais configurações ligar hoje. Isso importa porque, na nuvem, a maioria dos vazamentos não vem de falha do provedor, mas de **configuração** do cliente.

## Responsabilidade compartilhada

O provedor de nuvem protege o **prédio**: data center, hardware, rede física, hipervisor. Você protege o que coloca **dentro**: dados, contas, permissões, configurações. A fronteira muda conforme o serviço:

| Modelo | Provedor cuida de | Você cuida de |
|---|---|---|
| IaaS (infraestrutura como serviço: máquinas virtuais, como AWS EC2 e Azure VM) | hardware, rede, virtualização | sistema operacional, patches, firewall, dados |
| PaaS (plataforma como serviço: banco de dados gerenciado, hospedagem de aplicação) | tudo acima + SO e runtime | código, dados, acesso |
| SaaS (software como serviço: Google Workspace, M365, sistema contábil) | quase tudo | **contas, MFA, permissões, compartilhamento, configuração** |

Analogia: em um prédio comercial, o síndico cuida da portaria e dos elevadores; a tranca da sua sala, as chaves que você distribui e o que deixa em cima da mesa são com você. Um e-mail invadido no Microsoft 365 por falta de MFA é responsabilidade do cliente, e a LGPD cobra do controlador, não da Microsoft.

## IAM na nuvem

**IAM (Identity and Access Management)** é o sistema de contas, grupos, papéis e permissões do provedor. Os princípios são os mesmos do módulo de identidade, com peso maior:

- **Menor privilégio:** cada conta tem só o que precisa. "Proprietário" ou "Administrador global" para duas pessoas, com conta separada da conta de uso diário.
- **Grupos e papéis**, não permissões individuais: "Fiscal" tem acesso à pasta fiscal; quando alguém sai, remove-se do grupo.
- **Revisão periódica de acessos:** trimestral, lista de quem tem o quê, assinada pelo responsável.
- **Contas de serviço** (usadas por integrações e scripts) com chaves rotacionadas e permissão mínima.
- **Offboarding imediato:** desligou, bloqueia a conta no mesmo dia, transfere os arquivos, revoga tokens.

## MFA obrigatório, não opcional

O ataque mais comum contra SaaS é o uso de senha roubada (phishing, vazamento, reutilização). O **MFA** bloqueia a maioria desses casos. "Opcional" não funciona: as pessoas não ligam. Nas duas plataformas é possível **exigir** para todos:

- **Google Workspace:** no Admin Console, Menu > Segurança > Autenticação > Verificação em duas etapas, com a **aplicação** (*enforcement*) ativada para todos (o caminho pode mudar com as atualizações do painel). Prefira chaves de segurança ou o prompt do Google; SMS é o último recurso.
- **Microsoft 365:** *Security Defaults* (gratuito, exige MFA para todos e bloqueia autenticação legada) ou, com licença adequada, políticas de **Acesso Condicional** (exigir MFA, bloquear países, exigir dispositivo gerenciado).

Desative a **autenticação legada** (protocolos antigos como IMAP/POP com senha), que ignora MFA; é por ali que os atacantes entram quando o MFA está "ligado".

## Configurações que valem a pena no Workspace e no M365

| Configuração | Para quê |
|---|---|
| **Auditoria ativada e retida** (Google: relatórios de auditoria; M365: log de auditoria unificado no Purview) | saber quem acessou, compartilhou, apagou |
| **Alertas** de regra de encaminhamento externo, login suspeito, compartilhamento público | detectar conta comprometida em minutos |
| **DLP (Data Loss Prevention)** | bloquear ou avisar quando alguém envia CPF, CNPJ, dados bancários ou número de cartão para fora |
| **Compartilhamento externo** restrito | links "qualquer pessoa com o link" desligados por padrão |
| **Retenção e eDiscovery** (Google Vault, Purview) | guardar e-mails por prazo legal, localizar em investigação |
| **Acesso condicional / Context-Aware Access** | bloquear login de países onde não se opera, exigir dispositivo conhecido |
| **Bloqueio de apps de terceiros** | impedir que um app desconhecido receba acesso OAuth (a autorização que um aplicativo ganha para agir na sua conta sem conhecer a senha) à caixa inteira |
| **Proteção de anexos e links** (Safe Attachments/Links, sandbox do Gmail) | abrir anexo em ambiente isolado antes de entregar |

Um escritório com Microsoft 365 Business Premium ou Google Workspace Business Plus tem a maior parte disso incluída; o que falta é alguém ligar.

## Buckets expostos e chaves vazadas

Dois erros clássicos de IaaS/PaaS que aparecem todo ano em manchetes:

**Bucket exposto:** um "balde" de armazenamento (S3 na AWS, Blob no Azure, Cloud Storage no Google) configurado como **público** por engano. Mecanismos de busca e ferramentas automatizadas encontram em horas. Milhões de documentos de clientes já vazaram assim no Brasil. Regra: bloqueio de acesso público ligado na conta inteira, e cada exceção justificada.

**Chave vazada:** uma chave de API (AWS Access Key, token do Google) colada em um repositório público no GitHub, em um script enviado por e-mail ou em uma planilha. Robôs varrem o GitHub e usam a chave em **minutos** para minerar criptomoedas ou baixar dados. Regra: chaves nunca em código (lição 9), rotação periódica, alerta de uso anômalo, e revogar imediatamente se houver suspeita.

## CASB (noção)

Um **CASB (Cloud Access Security Broker)** fica entre os usuários e os serviços de nuvem, dando visibilidade e controle: quais SaaS a equipe usa (inclusive os não autorizados, o chamado *shadow IT*), quem compartilha o quê, aplicação de DLP em vários serviços de uma vez. Exemplos: Microsoft Defender for Cloud Apps, Netskope, Zscaler. É ferramenta de empresa média para cima; para o escritório, as configurações nativas do Workspace/M365 cumprem o papel.

## Erros comuns

- Achar que "está na nuvem, então está seguro". A nuvem protege o prédio; a sala é sua.
- MFA "disponível" mas não obrigatório; autenticação legada ligada.
- Conta de administrador global usada para ler e-mail todos os dias.
- Links de compartilhamento público com dados de clientes "só para facilitar".
- Ex-funcionário com conta ativa meses depois, ou com apps OAuth ainda autorizados.
- Chave de API em planilha, e-mail ou código.

## Na prática

Hoje, no painel de administração do seu Workspace ou M365: (1) exija MFA para todos; (2) desligue autenticação legada; (3) ligue a auditoria e três alertas (encaminhamento externo, login suspeito, compartilhamento público); (4) restrinja compartilhamento externo; (5) liste todos os usuários e desative quem não está mais na empresa. Uma hora de trabalho, risco reduzido pela metade.

## Resumo

- Responsabilidade compartilhada: o provedor cuida da infraestrutura; contas, permissões, MFA e configuração são seus.
- IAM: menor privilégio, grupos, administradores separados, revisão trimestral, offboarding imediato.
- MFA obrigatório para todos e autenticação legada desligada; acesso condicional quando possível.
- Ligue auditoria, alertas, DLP e restrição de compartilhamento no Workspace/M365.
- Buckets públicos e chaves vazadas são achados em minutos; bloqueie acesso público e nunca exponha chaves.
