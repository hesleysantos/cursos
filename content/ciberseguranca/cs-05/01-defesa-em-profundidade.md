Nesta lição você vai aprender a pensar como quem **defende**: montar camadas de proteção que não dependem de um único controle, reduzir a **superfície de ataque** e aplicar um **baseline** de configuração segura (*hardening*) em Windows, Linux e Active Directory. Isso importa porque, nos módulos anteriores, você viu como o atacante entra; agora vai ver por que, numa rede bem configurada, ele entra e não consegue ir adiante.

## Defesa em profundidade: o castelo medieval

Um castelo não confia só na muralha. Tem fosso, muralha, portão, guardas, torre e, no centro, a sala do tesouro trancada. Se o invasor pula o fosso, ainda enfrenta a muralha; se passa pela muralha, enfrenta os guardas. **Defesa em profundidade** é isso aplicado a sistemas: várias camadas independentes, de modo que a falha de uma não entregue tudo.

As camadas típicas de uma pequena empresa:

| Camada | Exemplos de controle |
|---|---|
| Perímetro | firewall do roteador, filtro de DNS, VPN |
| Rede interna | segmentação (rede de visitantes separada), Wi-Fi com WPA3 |
| Host (cada computador) | atualizações, antivírus ou EDR (o antivírus que observa comportamento, tema da lição 2), firewall local, disco criptografado |
| Aplicação | MFA no sistema contábil, permissões por perfil |
| Dados | backup off-line, criptografia, controle de quem acessa cada pasta |
| Pessoas | treinamento, política de senhas, processo de aprovação de pagamentos |

A última camada, **pessoas**, é a que mais aparece em incidentes reais: o ransomware entrou porque alguém abriu um anexo. Por isso as camadas se somam.

## Superfície de ataque: cada porta aberta é uma porta

**Superfície de ataque** é o conjunto de pontos por onde alguém pode tentar entrar: portas de rede abertas, serviços em execução, contas existentes, programas instalados, pastas compartilhadas, extensões de navegador. A regra de ouro é simples: **o que você não usa, desligue**. Um serviço desligado não tem vulnerabilidade explorável.

Exemplo real: um escritório mantinha a Área de Trabalho Remota (RDP) aberta na internet "para o contador acessar de casa". RDP exposto com senha fraca segue sendo uma das portas de entrada mais comuns de ransomware no Brasil. A solução não é só "senha mais forte": é fechar a porta e acessar por VPN.

## Baselines: não reinvente a configuração segura

Um **baseline** é uma lista de configurações recomendadas, testadas e documentadas. O mais usado no mundo é o conjunto de **CIS Benchmarks**, do Center for Internet Security: documentos gratuitos (mediante cadastro) para Windows 10/11, Windows Server, Ubuntu, Microsoft 365, Google Workspace, navegadores e mais. Cada item diz o que configurar, por quê e como auditar.

Os benchmarks têm dois níveis: **Nível 1** (configurações que quase nunca atrapalham o uso) e **Nível 2** (mais restritivas, para ambientes sensíveis). Para um escritório, o Nível 1 já é um salto enorme. A Microsoft também publica o **Security Baseline** do Windows.

> **Dica:** aplique o baseline primeiro em uma máquina de teste; desligar protocolos antigos pode quebrar impressoras ou sistemas legados.

## Hardening de Windows

Os pontos que mais reduzem risco em estações de trabalho:

- **Contas:** cada pessoa com sua conta **padrão** (não administrador). O administrador local existe, com senha única por máquina, usado só para instalar ou configurar. Se todos são administradores, qualquer anexo malicioso vira administrador.
- **UAC (Controle de Conta de Usuário):** mantenha no nível padrão ou acima. Aquela janela "Deseja permitir que este aplicativo faça alterações?" é uma barreira real contra malware que tenta elevar privilégio.
- **SMB:** desative o **SMBv1**, versão original do protocolo de compartilhamento de arquivos criada nos anos 1980 e porta de entrada do WannaCry (2017). Exija assinatura SMB quando possível.
- **RDP:** desligado se não for usado; se for, só pela rede interna ou VPN, com **NLA** (Autenticação no Nível da Rede) ativada e conta com MFA.
- **Políticas:** bloqueio de tela automático (10 minutos), bloqueio de conta após tentativas erradas, auditoria de logon ativada (você vai usar esses eventos na lição 4), macros do Office bloqueadas por padrão.
- **Atualizações:** Windows Update automático, com reinicialização agendada fora do horário de trabalho.
- **Disco:** BitLocker (a criptografia de disco do Windows) ligado em notebooks. Um notebook perdido vira apenas um prejuízo de hardware, não um incidente de dados.

## Hardening de Linux

Servidores Linux (o site da empresa, um servidor de arquivos, uma VM na nuvem) seguem a mesma lógica:

- **SSH por chave:** desative login por senha (`PasswordAuthentication no`) e login direto como root (`PermitRootLogin no`). Chaves não sofrem força bruta na prática.
- **sudo:** administração via `sudo` com conta nominal, não compartilhando a senha do root. Assim o log diz *quem* fez o quê.
- **Atualizações automáticas:** no Ubuntu/Debian, o pacote `unattended-upgrades` aplica correções de segurança sozinho.
- **Firewall local:** `ufw` com política padrão de bloquear entrada e liberar só as portas necessárias (22, 80, 443).
- **Serviços:** liste o que está rodando e desative o que não usa.

## Servidores e Active Directory (noções)

Em empresas com mais de uma dezena de máquinas é comum o **Active Directory (AD)**, o serviço da Microsoft que centraliza contas, grupos e políticas. Quem domina o AD domina todas as máquinas. Noções mínimas de defesa:

- **Separação de contas:** o administrador do domínio tem uma conta normal para ler e-mail e outra, só administrativa.
- **Menor privilégio:** o grupo *Domain Admins* tem duas ou três pessoas, não vinte.
- **LAPS:** ferramenta gratuita da Microsoft que dá uma senha de administrador local diferente, rotacionada, para cada máquina; sem isso, uma senha vazada abre todas.
- **GPO (políticas de grupo):** aplicam o baseline de uma vez em todas as estações.
- **Servidores** em segmento de rede separado, sem navegação na internet.

## Erros comuns

- Aplicar hardening só nos servidores e esquecer as estações, por onde o phishing entra.
- Deixar contas de ex-funcionários e de "testes" ativas. Toda conta é superfície de ataque.
- Confundir antivírus instalado com máquina protegida. Sem patch e sem conta padrão, é uma camada só.
- Fazer tudo de uma vez, sem testar, e quebrar a impressora de rede na segunda-feira.

## Na prática

Num escritório contábil de 12 pessoas: (1) baixar o CIS Benchmark do Windows 11 e aplicar o Nível 1 em uma máquina de teste; (2) remover todos os usuários do grupo Administradores; (3) desligar SMBv1 e RDP; (4) ligar BitLocker nos notebooks; (5) documentar numa planilha, por máquina, com data: é evidência de diligência em incidente ou auditoria.

## Resumo

- Defesa em profundidade: várias camadas independentes, para que uma falha não entregue tudo.
- Superfície de ataque se reduz desligando serviços, portas, contas e programas que não são usados.
- CIS Benchmarks e Security Baselines são listas prontas e testadas; comece pelo Nível 1.
- Windows: conta padrão, UAC, sem SMBv1, RDP só por VPN com NLA, BitLocker, atualizações.
- Linux: SSH por chave, sudo nominal, atualizações automáticas, firewall local; AD: poucos administradores, LAPS, contas separadas.
