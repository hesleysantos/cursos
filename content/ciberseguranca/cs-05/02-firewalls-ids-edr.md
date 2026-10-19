Nesta lição você vai entender as ferramentas que ficam **vigiando** a rede e os computadores: firewalls, sistemas de detecção e prevenção de intrusão (IDS/IPS), EDR/XDR e filtros de DNS. Ao final, vai saber o que cada uma faz, o que não faz, e montar uma combinação realista para uma pequena empresa.

## Firewall: o porteiro com lista

Um **firewall** decide quais conexões de rede podem passar, com base em regras: endereço de origem, destino, porta e protocolo. Pense no porteiro de um prédio com uma lista: quem não está nela não entra, por mais que insista.

Existem dois lugares para o porteiro:

| Tipo | Onde fica | Protege | Exemplo |
|---|---|---|---|
| Firewall de rede | na borda (roteador, appliance) | todos os dispositivos atrás dele | pfSense, OPNsense, FortiGate, MikroTik |
| Firewall de host | dentro de cada computador | aquela máquina, inclusive do vizinho de rede | Windows Defender Firewall, ufw, nftables |

Os dois se complementam. O firewall de rede não vê o notebook infectado atacando a impressora na mesma sala; o de host vê. E o de host não protege a câmera IP que não tem firewall; o de rede protege.

### Deny by default

O princípio central de qualquer firewall é **negar por padrão**: tudo é bloqueado, e você abre só o que precisa. A alternativa (permitir tudo e bloquear o que lembrar) falha sempre, porque ninguém lembra de tudo. Um conjunto mínimo de regras de entrada para um escritório:

1. Bloquear toda entrada vinda da internet (padrão).
2. Permitir VPN (uma porta específica) para quem trabalha de casa.
3. Permitir, só na rede interna, o acesso ao servidor de arquivos e à impressora.
4. Registrar (log) o que foi bloqueado.

Para a saída, vale ao menos bloquear SMB para a internet e registrar destinos.

### NGFW

Um **firewall de nova geração (NGFW)** vai além de portas e endereços: identifica a **aplicação** (reconhece que aquele tráfego na porta 443 é Dropbox, não apenas "HTTPS"), inspeciona conteúdo, integra antivírus de rede e filtro de URL. É mais caro e exige alguém para administrar; para um escritório pequeno, um roteador decente com regras bem feitas e um filtro de DNS resolvem a maior parte do problema.

## IDS e IPS: a câmera e o segurança

Um **IDS (Intrusion Detection System)** é uma câmera: observa o tráfego, compara com assinaturas de ataques conhecidos e com padrões anômalos, e **alerta**. Um **IPS (Intrusion Prevention System)** é o segurança: faz o mesmo, mas **bloqueia** no ato. O IPS é mais protetor e mais arriscado, porque um falso positivo derruba tráfego legítimo.

Os nomes a reconhecer são **Snort** e **Suricata**, ambos gratuitos e de código aberto, com regras mantidas pela comunidade (por exemplo, as *Emerging Threats*). Uma regra de Suricata diz, em essência: "se vir um pacote com este padrão nesta porta, gere o alerta X". O OPNsense traz o Suricata integrado, e o pfSense o oferece como pacote de instalação simples.

IDS/IPS exige alguém olhando os alertas. Sem isso, é uma câmera gravando para ninguém assistir.

## EDR e XDR versus antivírus

O **antivírus** tradicional compara arquivos com uma lista de assinaturas de malware conhecido. Funciona contra o que já foi catalogado e falha contra o novo ou contra ataques *fileless* (sem arquivo, só com comandos do PowerShell, por exemplo).

O **EDR (Endpoint Detection and Response)** observa o **comportamento** da máquina: processos criados, conexões abertas, alterações no registro, comandos executados. Se o Word abre o PowerShell, que baixa algo da internet e tenta criptografar documentos, o EDR reconhece a cadeia, mata o processo, isola a máquina da rede e guarda a linha do tempo para investigação. Exemplos: Microsoft Defender for Endpoint, CrowdStrike Falcon, SentinelOne, Bitdefender.

O **XDR (Extended Detection and Response)** estende isso para além do endpoint, correlacionando sinais de e-mail, identidade, nuvem e rede em um painel só.

| | Antivírus | EDR | XDR |
|---|---|---|---|
| Detecta | assinaturas | comportamento no endpoint | comportamento em vários domínios |
| Responde | remove o arquivo | isola, mata processo, linha do tempo | o mesmo, com contexto de e-mail/nuvem |
| Exige | quase nada | alguém para revisar alertas | equipe ou serviço gerenciado |

> **Atenção:** o Microsoft Defender gratuito do Windows 11 é um antivírus com alguns recursos de comportamento, e é bom. O EDR corporativo é outro produto (pago por licença), com console central e resposta remota.

## Filtro de DNS

Toda conexão começa com uma consulta DNS ("qual o IP de banco-falso.com?"). Um **filtro de DNS** responde "esse domínio é malicioso, não vou resolver". É barato, simples e corta boa parte de phishing, malware e comando-e-controle antes da conexão existir. Opções: **Quad9** (9.9.9.9, gratuito, bloqueia domínios maliciosos), **Cloudflare 1.1.1.2** (gratuito, filtro de malware), **NextDNS** (configurável, com relatórios), **Cisco Umbrella** (corporativo). Basta configurar no roteador para toda a rede usar.

## O que faz sentido para uma pequena empresa

Um escritório contábil de 12 pessoas, sem equipe de TI, com orçamento limitado:

1. **Roteador/firewall com deny by default**, sem nada exposto à internet; VPN para acesso remoto.
2. **Firewall de host ligado** em todas as máquinas.
3. **Filtro de DNS** configurado no roteador (gratuito).
4. **EDR gerenciado** por um prestador de segurança gerenciada (MSSP, detalhado no módulo 6) ou, no mínimo, antivírus corporativo com console central. O EDR vale mais que o IDS aqui: o ataque vai chegar por e-mail, no endpoint.
5. **IDS/IPS**: só se houver quem olhe os alertas. Caso contrário, pule.
6. **NGFW**: não é prioridade nesse porte.

## Erros comuns

- Comprar um NGFW caro e deixar a regra "permitir tudo" que veio de fábrica.
- Achar que o firewall de rede dispensa o de host.
- Instalar EDR e nunca abrir o console. Alertas sem resposta são o mesmo que nada.
- Liberar RDP "só por hoje" no firewall e esquecer.
- Desligar o filtro de DNS porque um site legítimo foi bloqueado, em vez de criar uma exceção.

## Na prática

Quando um prestador oferecer uma "solução de segurança", pergunte: bloqueia na rede ou no endpoint? Olha assinatura ou comportamento? Quem responde aos alertas e em quanto tempo? Onde ficam os logs? Essas perguntas separam produto de proteção.

## Resumo

- Firewall de rede protege a borda; firewall de host protege cada máquina, inclusive de vizinhos. Use os dois, com **deny by default**.
- IDS alerta, IPS bloqueia; Snort e Suricata são as referências. Só valem com alguém olhando.
- Antivírus vê assinaturas; EDR vê comportamento e responde; XDR correlaciona vários domínios.
- Filtro de DNS é barato e corta muito; configure no roteador.
- Pequena empresa: firewall bem configurado, DNS filtrado, EDR gerenciado, VPN. NGFW e IDS depois.
