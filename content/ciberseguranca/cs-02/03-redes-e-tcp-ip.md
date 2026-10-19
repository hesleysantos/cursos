Nesta lição você vai entender como a informação viaja de um computador a outro: o que é um pacote, o que é um endereço IP (privado e público), o papel da máscara, do gateway e do NAT, o que são portas e protocolos (TCP e UDP) e como tudo se organiza em camadas. Importa porque firewall, segmentação e varredura de portas só fazem sentido quando se entende como um pacote encontra o caminho.

## A analogia dos Correios

Imagine que o escritório precisa enviar um livro de 500 páginas a um cliente, mas o correio só aceita envelopes de 10 páginas. Você divide o livro em 50 envelopes, numera cada um ("12 de 50"), escreve destinatário e remetente, e despacha. Os envelopes podem seguir caminhos diferentes e chegar fora de ordem; o cliente os reordena pelos números e, se faltar um, pede reenvio.

É assim que a internet funciona. O **pacote** é o envelope: um pedaço dos dados com um cabeçalho que traz origem, destino, número de sequência e controle. O conteúdo é a **carga útil**. Roteadores são as agências: leem só o endereço e encaminham, sem abrir a carta (a menos que ela não esteja lacrada; o lacre é a criptografia, assunto da próxima lição).

## Endereço IP

O **endereço IP** é o endereço postal da máquina. No **IPv4**, são quatro números de 0 a 255 separados por pontos: `192.168.0.15`. São cerca de 4,3 bilhões de combinações, que acabaram; por isso existe o **IPv6**, com endereços muito maiores, escritos em hexadecimal (base 16, com os dígitos de 0 a 9 e as letras de a a f): `2804:14d:5c81:9a00::1`. Os dois convivem.

A distinção mais importante para segurança é entre **endereço privado** e **público**. Alguns intervalos de IPv4 são reservados para redes internas e não existem na internet:

| Intervalo | Uso típico |
|---|---|
| `10.0.0.0` a `10.255.255.255` | Empresas grandes |
| `172.16.0.0` a `172.31.255.255` | Empresas médias, redes de containers |
| `192.168.0.0` a `192.168.255.255` | Casas e escritórios pequenos |

Qualquer endereço fora desses intervalos é **público**: é o que o provedor dá ao escritório e o que os sites veem. No `netstat` da lição anterior, `192.168.0.15` era a própria máquina (endereço privado) e `185.220.101.7`, alguém na internet (endereço público).

## Máscara, gateway e NAT

No PowerShell:

```powershell
ipconfig
```

```
Configuração de IP do Windows


Adaptador Ethernet Ethernet:

   Sufixo DNS específico de conexão. . . . . . : lan
   Endereço IPv6 de link local . . . . . . . . : fe80::ff9d:376f:314b:bdc7%10
   Endereço IPv4. . . . . . . .  . . . . . . . : 192.168.0.15
   Máscara de Sub-rede . . . . . . . . . . . . : 255.255.255.0
   Gateway Padrão. . . . . . . . . . . . . . . : 192.168.0.1
```

(O endereço IPv6 que começa com `fe80::` é o de "link local", gerado automaticamente e válido só dentro da rede local; ignore-o por enquanto.)

A **máscara de sub-rede** diz qual parte do endereço identifica a rede e qual identifica a máquina. Com `255.255.255.0` (ou `/24`), os três primeiros números (`192.168.0`) são a rede e o último é a máquina: de `192.168.0.1` a `192.168.0.254`, todos estão na mesma rede local e conversam diretamente.

O **gateway padrão** é a saída: qualquer destino fora da rede local é entregue ao gateway (o roteador), a agência do bairro, que sabe o caminho para fora.

O **NAT** (*Network Address Translation*) permite a dez máquinas com endereços privados usarem um único endereço público. O roteador troca o remetente `192.168.0.15` pelo endereço público ao sair, anota a troca numa tabela e a desfaz quando a resposta volta. Efeito útil: de fora, ninguém inicia conexão com `192.168.0.15`, porque esse endereço não existe na internet. O NAT é um firewall acidental; por isso "abrir uma porta no roteador" (encaminhamento de porta) é uma decisão de segurança.

## Portas e protocolos

O IP leva o pacote até a máquina certa. A **porta** leva até o programa certo dentro dela: é o número do apartamento. Portas vão de 0 a 65535; as baixas são padronizadas:

| Porta | Serviço |
|---|---|
| 22 | SSH (acesso remoto a servidores Linux) |
| 53 | DNS |
| 80 | HTTP |
| 443 | HTTPS |
| 445 | Compartilhamento de arquivos do Windows (SMB) |
| 3389 | Área de Trabalho Remota (RDP) |

Quando o navegador acessa `https://gov.br`, conecta-se ao IP do servidor na porta 443. Um servidor que "escuta" uma porta diz "aceito conexões aqui". Portas abertas para a internet sem necessidade (3389, 445) são o alvo preferido de varreduras: há robôs testando senhas de RDP em todo endereço público, o dia inteiro.

Dois protocolos de transporte dividem o trabalho. O **TCP** é o envelope registrado: origem e destino fazem um "aperto de mão", cada pacote é numerado e confirmado, e o que se perde é reenviado; serve para e-mail, sites, transferências. O **UDP** é o cartão-postal: envia e não confirma; mais rápido, serve para DNS, vídeo e voz.

## O modelo em camadas

Redes são descritas em **camadas**, cada uma com uma responsabilidade, como etapas de uma remessa dos Correios:

1. **Aplicação**: o conteúdo da carta e o idioma (HTTP, SMTP, DNS).
2. **Transporte**: envelope registrado (TCP) ou cartão-postal (UDP); as portas vivem aqui.
3. **Rede (Internet)**: origem, destino e o caminho entre cidades (IP, roteadores).
4. **Enlace e física**: o caminhão e a estrada; cabo, Wi-Fi e o endereço MAC (o número de fábrica de cada placa de rede, usado só dentro da rede local).

Cada camada embrulha a de cima: os dados do HTTP vão dentro de um segmento TCP, dentro de um pacote IP, dentro de um quadro Ethernet ou Wi-Fi. O modelo localiza cada ataque: phishing na aplicação, varredura de portas no transporte, falsificação de endereço na rede, interceptação de Wi-Fi no enlace.

## Erros comuns

- **Achar que "192.168" é um endereço único no mundo.** Todo escritório tem um `192.168.0.1`.
- **Abrir a porta 3389 no roteador para acessar de casa.** Causa de boa parte dos ransomwares em pequenas empresas. Use VPN.
- **Confundir IP com nome.** `gov.br` é um nome; a conversão para IP é o DNS, tema da próxima lição.
- **Acreditar que o NAT substitui o firewall.** Ele bloqueia entradas, mas não impede uma máquina infectada de sair.

## Na prática

Rode `ipconfig` em uma máquina do escritório e anote IP, máscara e gateway. No `netstat -ano`, classifique cada endereço externo como privado ou público e anote a porta: 443 para um IP do Google é o navegador; 443 para um IP desconhecido, com PID de um programa que você não reconhece, merece investigação. Na página do roteador (lição 5), procure "encaminhamento de portas": se houver 3389 ou 445 abertas para a internet, feche.

> **Atenção:** em um incidente, IP público e horário são o que a polícia usa para rastrear; guarde os logs.

## Resumo

- Dados viajam em pacotes, com cabeçalho (origem, destino, sequência) e carga útil; roteadores encaminham lendo só o cabeçalho.
- Os intervalos `10.x`, `172.16–31.x` e `192.168.x` são privados e não existem na internet; o resto é público.
- Máscara define a rede local; gateway é a saída; NAT põe muitos privados atrás de um público e bloqueia entradas por padrão.
- Portas identificam o programa (443 HTTPS, 3389 RDP, 445 SMB); TCP confirma e reenvia, UDP só envia.
- O modelo em camadas (aplicação, transporte, rede, enlace) localiza onde cada ataque e cada defesa acontece.
