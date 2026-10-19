Nesta lição você vai abrir a caixa preta na parede do escritório: o roteador. Vai entender o que ele faz (DHCP, NAT, Wi-Fi, firewall), como o Wi-Fi é protegido (WPA2 e WPA3), por que a rede de visitantes é obrigatória, o que fazer com impressoras, câmeras e dispositivos "inteligentes", e o que é uma VLAN. Importa porque a rede local é onde o atacante se move depois de entrar, e uma rede bem dividida transforma um incidente em um problema pequeno.

## O que o roteador faz

O aparelho que o provedor instala costuma ser quatro coisas em uma:

- **Roteador**: encaminha pacotes entre a rede local e a internet, fazendo o NAT da lição 3.
- **Switch**: as portas de cabo atrás dele conectam as máquinas entre si.
- **Ponto de acesso Wi-Fi**: faz o mesmo que o switch, sem fio.
- **Servidor DHCP e firewall básico**: distribui endereços e bloqueia conexões de entrada.

O **DHCP** (*Dynamic Host Configuration Protocol*) é o recepcionista: quando um notebook entra na rede, pergunta "qual é o meu endereço?", e o roteador responde com IP, máscara, gateway e servidores DNS, por um tempo determinado (o *lease*, geralmente 24 horas). É por isso que o `ipconfig` da lição 3 mostrava tudo preenchido. A lista de dispositivos com endereço atribuído aparece na página do roteador e mostra **quem está na rede**: um nome desconhecido merece pergunta.

## Entrando no roteador

Todo roteador tem uma página de administração, acessível pelo endereço do gateway: digite `192.168.0.1` (ou `192.168.1.1`, ou o que o `ipconfig` mostrou) no navegador. Ele vai pedir usuário e senha. Ali você encontra, com nomes que variam por fabricante:

| Seção | O que configurar |
|---|---|
| Wireless / Wi-Fi | Nome da rede (SSID), senha, tipo de segurança (WPA2/WPA3) |
| Rede de visitantes (Guest) | Rede separada, sem acesso à rede interna |
| DHCP / Dispositivos conectados | Quem está na rede e quais IPs têm |
| Encaminhamento de portas | Portas abertas para a internet (deve estar vazio) |
| Administração | Senha do roteador, acesso remoto (desligado), atualização de firmware |
| Logs | Registro de conexões e tentativas de acesso |

Quatro configurações resolvem a maior parte dos problemas: trocar a senha padrão do roteador (a de fábrica está em qualquer site); desligar o **acesso remoto pela internet** (gerenciamento via WAN), que expõe a administração ao mundo; atualizar o **firmware** (o sistema do roteador, que também tem falhas corrigidas); e desligar o **UPnP**, que deixa programas abrirem portas sem perguntar.

## Wi-Fi: WPA2 e WPA3

O sinal do Wi-Fi atravessa paredes e chega ao estacionamento. Quem o protege é o padrão de segurança:

- **WEP** e **WPA** (original): obsoletos e quebráveis em minutos. Se o roteador só oferece isso, troque o roteador.
- **WPA2**: o padrão desde 2004, ainda seguro com senha forte. Use o modo **AES** (às vezes chamado CCMP), não TKIP.
- **WPA3**: o atual, com proteção melhor contra tentativa de adivinhar a senha capturando o tráfego. Escolha "WPA2/WPA3" se houver aparelhos antigos.

A senha do Wi-Fi segue a regra das senhas: longa (uma frase de 20 caracteres ou mais), não impressa na parede da recepção. E desligue o **WPS** (o botão de "conectar sem senha"): o método por PIN tem falha conhecida que permite descobrir a senha.

Atenção: WPA2 e WPA3 cifram o tráfego entre o aparelho e o roteador, mas quem tem a senha está dentro da rede. Entregar a senha do Wi-Fi a clientes e visitantes é deixá-los na mesma rede do servidor de arquivos.

## Rede de visitantes e segmentação

**Segmentar** é dividir a rede em partes que não se enxergam. A forma mais simples é a **rede de visitantes** (*guest network*) de quase todo roteador: um segundo Wi-Fi, com outra senha, que dá acesso à internet mas não aos computadores internos. Clientes, celulares pessoais e o notebook do prestador entram ali.

Nas redes maiores, a segmentação se faz com **VLANs** (*Virtual LANs*): um mesmo switch é dividido logicamente em várias redes, como se fossem cabos separados. Uma VLAN para estações, outra para o servidor, outra para impressoras e câmeras, outra para visitantes, com um firewall decidindo o que passa entre elas. Para um escritório de oito pessoas, a rede de visitantes já resolve a maior parte. Mas o princípio vale: o ransomware que entra na estação da recepção só cifra o que a rede dela alcança.

## Dispositivos IoT, impressoras e câmeras

Impressoras, câmeras de segurança, TV da sala de reunião, assistentes de voz, ar-condicionado com aplicativo: são computadores pequenos, geralmente sem atualização e com senha de fábrica. É a **Internet das Coisas** (IoT). Uma câmera com senha padrão exposta na internet vira ponto de entrada e parte de redes de robôs que atacam terceiros.

Regras: trocar a senha padrão de cada um; desligar o acesso pela internet se não for necessário; colocá-los na rede de visitantes ou numa VLAN própria; e não deixar a impressora "digitalizar para pasta de rede" com credenciais de administrador gravadas nela.

## Erros comuns

- **Roteador com senha de fábrica.** O primeiro teste de qualquer invasor.
- **Uma só rede Wi-Fi para tudo.** Visitante, câmera e servidor no mesmo barco.
- **Encaminhamento de portas "temporário"** feito pelo técnico e nunca fechado.
- **Firmware nunca atualizado.** Roteadores têm falhas graves corrigidas regularmente.

## Na prática

Entre na página do roteador do escritório (guarde a senha no gerenciador). Confira: senha de administração trocada; acesso remoto e UPnP desligados; firmware atualizado; Wi-Fi em WPA2-AES ou WPA3 com senha longa e WPS desligado; rede de visitantes ativa; lista de dispositivos sem desconhecidos; encaminhamento de portas vazio. Depois, mova impressora, câmeras e TV para a rede de visitantes e troque as senhas padrão delas.

> **Atenção:** se o roteador do provedor tem senha que só o provedor conhece, peça a senha ou coloque o seu próprio roteador atrás dele; não aceite uma rede que você não controla.

## Resumo

- O roteador do escritório é roteador, switch, ponto de acesso, DHCP e firewall; sua página de administração (geralmente `192.168.0.1`) é onde se configura tudo.
- Mínimo de segurança: senha de administração trocada, acesso remoto e UPnP desligados, firmware atualizado, encaminhamento de portas vazio.
- Wi-Fi em WPA2-AES ou WPA3, senha longa, WPS desligado; quem tem a senha está dentro da rede.
- Rede de visitantes separa clientes, celulares e dispositivos IoT da rede interna; VLANs fazem o mesmo em redes maiores.
- Impressoras, câmeras e outros dispositivos inteligentes recebem senha própria, ficam sem acesso pela internet e vão para a rede segregada.
