# Varredura e enumeração

Nesta lição você vai entender a fase em que o pentester passa a **interagir** com o alvo: a varredura de serviços e a enumeração. O objetivo aqui é compreensão e leitura, não execução: você vai saber o que o **nmap** faz, aprender a **interpretar uma saída** de varredura, entender o que são banners e versões, como scanners de vulnerabilidade usam esses dados e por que sondar um sistema sem autorização é crime. Os exemplos são de laboratório próprio, e toda a lição se apoia na regra da lição 1.

## Portas e serviços: relembrando

No módulo 2 você viu que cada serviço escuta numa **porta** numerada (80 para HTTP, 443 para HTTPS, 22 para SSH, 3389 para a Área de Trabalho Remota do Windows). Um servidor é como um prédio com milhares de portas; a maioria está fechada, e cada porta aberta é uma entrada que alguém precisa manter protegida. A **varredura** descobre quais portas estão abertas; a **enumeração** descobre **o que** está atrás de cada uma: qual programa, qual versão, qual configuração.

Por que isso importa para a defesa? Porque a melhor forma de reduzir a superfície de ataque é saber exatamente o que o seu servidor expõe. Um serviço aberto que ninguém usa é risco puro; a varredura autorizada do próprio ambiente é como um inventário de portas e janelas da casa.

## O nmap e o sentido de cada resultado

O **nmap** (Network Mapper) é a ferramenta padrão de varredura, gratuita e de código aberto, usada tanto por administradores quanto por atacantes. Ele envia pacotes às portas e classifica a resposta em estados; os três que você mais vai ver são:

| Estado | Significado |
|---|---|
| `open` | Há um serviço escutando: é o que interessa inventariar e proteger |
| `closed` | A porta responde, mas nada escuta nela |
| `filtered` | Um firewall descarta os pacotes; o nmap não consegue decidir |

Existem variações de varredura com propósitos diferentes (sondar serviços TCP ou UDP, tentar identificar a versão do programa, estimar o sistema operacional pelas respostas). Para o nível deste curso, o que importa não é decorar opções, e sim entender que cada modo troca velocidade, discrição e profundidade, e que a **detecção de versão** é a parte mais valiosa: saber que atrás da porta 22 roda uma versão específica de um servidor SSH é o que liga o serviço a falhas conhecidas (lição 5).

## Interpretando uma saída

Esta é a habilidade central da lição. Veja uma saída simplificada de uma varredura autorizada em uma máquina de laboratório:

```bash
# Varredura em uma VM de laboratório (ambiente próprio e autorizado)
PORT     STATE    SERVICE      VERSION
22/tcp   open     ssh          OpenSSH 7.6p1
80/tcp   open     http         Apache httpd 2.4.29
443/tcp  open     ssl/http     Apache httpd 2.4.29
3306/tcp open     mysql        MySQL 5.7.33
3389/tcp filtered ms-wbt-server
```

O que um analista lê aqui:

- **Quatro serviços abertos e um filtrado.** Cada porta aberta é uma superfície a justificar: todas são necessárias?
- **Versões antigas.** OpenSSH 7.6 e Apache 2.4.29 são de alguns anos atrás; o passo seguinte é checar se têm falhas corrigidas desde então (lição 5). A versão é a informação mais sensível da varredura.
- **MySQL (3306) acessível.** Um banco de dados escutando numa interface alcançável de fora é um alerta grave: bancos devem ficar numa rede interna segmentada (módulo 3), nunca expostos.
- **3389 filtrada.** A Área de Trabalho Remota existe, mas um firewall a protege. Bom sinal, embora valha confirmar que o acesso remoto passa por VPN.

Repare que a varredura **não invadiu nada**: só listou o que já estava exposto. O valor está na leitura, não na ferramenta.

## Banners e enumeração

Muitos serviços, ao receberem uma conexão, respondem com um **banner**: uma linha que anuncia o programa e a versão, como `220 ProFTPD 1.3.5 Server`. Foi criado para diagnóstico, mas entrega de graça o que um atacante precisa. Enumerar é aprofundar isso: listar usuários que um serviço revela, pastas compartilhadas, nomes de bancos, cabeçalhos de uma aplicação web. Do lado da defesa, **reduzir banners** (esconder a versão) é uma camada a mais: não resolve a falha, mas tira o atacante automatizado do caminho mais fácil.

## Scanners de vulnerabilidade

Ferramentas como **Nessus**, **OpenVAS** e **Qualys** automatizam o passo seguinte: pegam o inventário de serviços e versões e comparam com uma base enorme de falhas conhecidas, gerando uma lista priorizada. São essenciais para a defesa contínua, mas têm dois limites: produzem **falsos positivos** (apontam falhas que não se confirmam naquele ambiente) e **falsos negativos** (não enxergam problemas de lógica da aplicação). Por isso o scan alimenta o pentest, mas não o substitui (lição 2).

## A fronteira legal, de novo

Varrer e enumerar são atividades **ativas**: enviam pacotes ao alvo e deixam rastro nos logs dele. Diferentemente do OSINT passivo da lição 3, aqui você toca no sistema. Fazer isso sem autorização fica registrado no servidor do alvo, pode gerar reclamação ou denúncia e, conforme o que se faz em seguida, ser enquadrado como tentativa de invasão (art. 154-A do Código Penal). A regra não muda: **só se varre o que é seu ou o que está no escopo de um contrato assinado**. Em laboratório próprio, no TryHackMe, no HackTheBox ou numa VM que você montou, pode à vontade.

> **Atenção:** varrer "só para ver" o site de um cliente ou de um concorrente não é uma travessura técnica; é um ato que fica gravado no servidor do outro e pode ser enquadrado como tentativa de invasão. Autorização por escrito antes, sempre.

## Erros comuns

- **Confundir varredura com invasão.** Listar portas não é entrar; mas fazer isso sem permissão já é ilegal.
- **Ignorar o `filtered`.** Nem toda ausência de resposta significa porta fechada; pode ser firewall.
- **Esquecer o UDP.** Serviços como DNS e SNMP usam UDP e passam despercebidos em quem só olha TCP.
- **Tratar o scanner como verdade absoluta.** Falsos positivos e negativos existem; é preciso confirmar.
- **Deixar banco de dados exposto.** O MySQL do exemplo é o erro clássico das pequenas empresas.

## Na prática

- Varra o próprio ambiente (com autorização interna registrada) e monte o inventário de serviços expostos; feche o que não precisa estar aberto.
- Garanta que bancos de dados e painéis de administração só são alcançáveis pela rede interna ou por VPN.
- Agende um scan de vulnerabilidades periódico e trate os achados por prioridade.
- Reduza banners e mantenha os serviços atualizados; a versão exposta é o que liga você às falhas conhecidas.

## Resumo

- Varredura descobre portas abertas; enumeração descobre o serviço, a versão e a configuração por trás delas.
- O nmap classifica portas em open, closed e filtered; a detecção de versão é a informação mais valiosa.
- Saber ler uma saída (serviços desnecessários, versões antigas, banco exposto) vale mais do que decorar opções.
- Scanners de vulnerabilidade automatizam a comparação com falhas conhecidas, mas geram falsos positivos e negativos.
- Varredura é atividade ativa: sem autorização escrita, é crime; em laboratório próprio, é livre.
