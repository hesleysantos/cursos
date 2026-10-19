Nesta lição você vai aprender a ler os registros que os sistemas deixam para trás: o que são logs, onde Windows e Linux os guardam, quais eventos de segurança merecem atenção, como usar ping, tracert e nslookup, o que o Wireshark mostra e como interpretar uma linha de log de servidor web. Importa porque, num incidente, os logs são a única testemunha; no dia a dia, são o jeito de descobrir um problema antes que vire incidente.

## O que é um log

Um **log** é um registro cronológico de eventos: quem entrou, o que falhou, que serviço iniciou, qual arquivo foi acessado. Cada linha tem data e hora, origem e descrição. É o livro de ocorrências da portaria: ninguém o lê por prazer, mas no dia em que algo some, é a primeira fonte.

Dois cuidados: **tempo** (o relógio das máquinas precisa estar certo e no mesmo fuso, senão a sequência não bate) e **retenção** (um log que se apaga em sete dias não ajuda num ataque descoberto em três semanas). Como invasores costumam limpar o log, copiá-lo para fora da máquina é simples e valioso.

## Visor de Eventos do Windows

Pressione `Win + R`, digite `eventvwr` e Enter. Em "Logs do Windows" há três registros principais: **Aplicativo** (erros de programas), **Sistema** (drivers, serviços, reinicializações) e **Segurança** (logins, contas, privilégios). Cada evento tem um **ID** numérico; alguns valem decorar:

| ID | Evento | Por que importa |
|---|---|---|
| 4624 | Logon bem-sucedido | Quem entrou, quando e por qual método |
| 4625 | Falha de logon | Dezenas em sequência são tentativa de adivinhar senha |
| 4720 | Conta de usuário criada | Conta nova que ninguém criou é sinal de invasão |
| 1102 | Log de auditoria limpo | Quase sempre é alguém apagando rastros |
| 7045 (Sistema) | Novo serviço instalado | Programas maliciosos se instalam como serviço |

O evento 4624 traz o **tipo de logon**: 2 é interativo (na frente da máquina), 3 é pela rede (pasta compartilhada), 10 é Área de Trabalho Remota. Um 4624 tipo 10 às 3h da manhã na máquina do financeiro é uma pergunta que precisa de resposta. Para filtrar, use "Filtrar log atual" e informe os IDs.

## Logs no Linux

Em servidores Linux, os logs ficam em `/var/log` (`auth.log` para autenticação, `syslog` para o sistema) e, nas distribuições modernas, são consultados pelo **journalctl**:

```bash
journalctl -u ssh --since "1 hour ago"
```

```
mai 12 09:41:07 servidor sshd[2210]: Failed password for root from 185.220.101.7 port 51022 ssh2
mai 12 09:41:09 servidor sshd[2210]: Failed password for root from 185.220.101.7 port 51022 ssh2
mai 12 09:41:12 servidor sshd[2214]: Accepted publickey for maria from 192.168.0.15 port 50218 ssh2
```

A opção `-u` escolhe o serviço, `--since` o período e `-f` acompanha em tempo real. As duas primeiras linhas são um robô tentando a senha de root (comum em qualquer servidor público; a defesa é desligar login por senha e usar chaves). A terceira é a Maria entrando da rede local com chave, como esperado. Com o `grep` da lição 2, `grep "Failed password" /var/log/auth.log | wc -l` conta as tentativas.

## Ferramentas de diagnóstico de rede

Três comandos respondem "a rede funciona e por onde o tráfego passa?":

**ping** envia pequenos pacotes e mede o tempo de resposta:

```powershell
ping 8.8.8.8
```

```
Disparando 8.8.8.8 com 32 bytes de dados:
Resposta de 8.8.8.8: bytes=32 tempo=39ms TTL=115
Resposta de 8.8.8.8: bytes=32 tempo=39ms TTL=115
Resposta de 8.8.8.8: bytes=32 tempo=39ms TTL=115
Resposta de 8.8.8.8: bytes=32 tempo=39ms TTL=115

Estatísticas do Ping para 8.8.8.8:
    Pacotes: Enviados = 4, Recebidos = 4, Perdidos = 0 (0% de
             perda),
Aproximar um número redondo de vezes em milissegundos:
    Mínimo = 39ms, Máximo = 39ms, Média = 39ms
```

"tempo=39ms" diz que o destino responde e em quanto tempo (o `8.8.8.8` é o DNS do Google, útil como alvo porque sempre responde). Já "Esgotado o tempo limite do pedido" indica bloqueio ou máquina fora, mas alguns servidores não respondem de propósito: `ping gov.br` devolve só tempos esgotados, e o site funciona normalmente. Ping sem resposta não é prova de que o site caiu.

**tracert** (Windows; `traceroute` no Linux) mostra cada roteador no caminho até o destino, com três medições de tempo por salto:

```powershell
tracert gov.br
```

```
Rastreando a rota para gov.br [161.148.164.31]
com no máximo 30 saltos:

  1    <1 ms    <1 ms    <1 ms  192.168.0.1
  2    11 ms    10 ms    12 ms  100.64.10.1
  3    14 ms    13 ms    14 ms  200.199.45.9
  ...
  9     *        *        *     Esgotado o tempo limite do pedido.
```

O primeiro salto é o roteador do escritório; os seguintes são o provedor (o `100.64.10.1` é um endereço interno do provedor, de um intervalo reservado para isso, o `100.64.0.0/10`); os saltos seguintes vão se aproximando do destino. Um `*` significa que aquele roteador não respondeu no tempo; como o `gov.br` não responde a ping, os últimos saltos aparecem assim, mesmo com o site no ar. Se o tracert para logo no roteador, o problema está localizado.

**nslookup**, visto nas lições 4 e 6, pergunta ao DNS. Para diagnóstico, compare a resposta do resolvedor padrão com a de um público (`nslookup banco.com.br 8.8.8.8`): se os IPs diferem, o DNS local pode estar comprometido.

## Wireshark

O **Wireshark** é um programa gratuito que captura e mostra, pacote a pacote, tudo o que passa pela placa de rede: cada consulta DNS, cada aperto de mão TLS, cada pedido HTTP. Na tela, colunas de origem, destino, protocolo e resumo; ao clicar, as camadas do pacote da lição 3: Ethernet, IP, TCP, HTTP.

Em tráfego HTTPS, o Wireshark mostra para qual domínio a conexão foi (o nome aparece no início do TLS) e o volume, mas não o conteúdo; em HTTP puro, mostra senhas e tudo mais. É ferramenta de defesa (achar um programa que conversa com um servidor desconhecido); use só na sua máquina e rede.

## Lendo um log de acesso web

Servidores web (Apache e Nginx são os programas mais usados para servir sites) registram cada pedido em uma linha, no formato combinado:

```
185.220.101.7 - - [12/May/2026:09:41:07 -0300] "GET /wp-login.php HTTP/1.1" 404 512 "-" "python-requests/2.31"
192.168.0.15 - - [12/May/2026:09:42:10 -0300] "GET /index.html HTTP/1.1" 200 18422 "https://www.google.com/" "Mozilla/5.0 (Windows NT 10.0) Chrome/124.0"
```

Campo a campo: IP de origem; dois traços (identidade e usuário, raramente usados); data e hora com fuso; a linha do pedido entre aspas (método, caminho, versão); código de status; tamanho da resposta em bytes; **referer** (de onde veio o clique); e **user-agent** (quem pediu). A primeira linha é um robô (`python-requests`, uma biblioteca de programação, não um navegador) procurando a página de login do WordPress (o sistema de sites mais usado no mundo, e por isso o mais atacado) num site que nem usa WordPress; a segunda é uma pessoa vinda do Google. Contar status por IP e identificar user-agents incomuns é o básico da análise, e é o que você vai programar nos exercícios.

## Erros comuns

- **Relógio errado nas máquinas.** Logs com horários inconsistentes não contam a história.
- **Log só na própria máquina.** O invasor apaga; o evento 1102 denuncia, mas tarde.
- **Olhar só eventos de erro.** Um logon bem-sucedido (4624) no horário errado é mais grave que mil erros de aplicativo.
- **Capturar tráfego de redes de terceiros.** Além de ilegal, é desnecessário: a sua rede tem tudo o que você precisa aprender.

## Na prática

Abra o Visor de Eventos na sua máquina, filtre o log de Segurança pelos IDs 4624 e 4625 dos últimos sete dias e veja quem entrou, quando e por qual tipo. No PowerShell, rode `ping`, `tracert` e `nslookup` para o site do escritório e guarde a saída como referência de "normal". Por fim, instale o Wireshark, capture um minuto do seu próprio tráfego e procure a consulta DNS e o início do TLS.

> **Dica:** uma planilha (data, evento, explicação) alimentada por semana a partir do Visor de Eventos é o "monitoramento" mais simples que existe.

## Resumo

- Log é o registro cronológico de eventos; relógio certo, retenção suficiente e cópia fora da máquina o tornam útil.
- Visor de Eventos (`eventvwr`): Aplicativo, Sistema e Segurança; IDs 4624, 4625, 4720, 1102 e 7045 são os que mais importam.
- No Linux, `/var/log` e `journalctl -u serviço --since`; "Failed password" em série é robô, "Accepted" fora de hora é pergunta.
- ping testa alcance, tracert mostra o caminho, nslookup confere o DNS (compare com `8.8.8.8`).
- Wireshark mostra pacotes e camadas; com HTTPS vê domínio e volume, não conteúdo. O log web traz IP, hora, pedido, status, tamanho, referer e user-agent.
