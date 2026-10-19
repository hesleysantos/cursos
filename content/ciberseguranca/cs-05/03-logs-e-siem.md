Nesta lição você vai aprender a tratar **logs** como a contabilidade da segurança: registros de tudo o que aconteceu, que precisam ser coletados, guardados e conciliados. Vai conhecer o **SIEM**, a ferramenta que centraliza e correlaciona esses registros, e vai escrever um pequeno analisador de log em Python para detectar força bruta. Sem logs, um incidente é um prejuízo sem explicação; com logs, é um caso que se investiga.

## O que é um log

Um **log** é uma linha de texto que um sistema escreve quando algo acontece: um login, um arquivo aberto, uma conexão recusada, um erro. Cada linha tem, no mínimo, **quando** (data e hora), **onde** (qual máquina ou serviço), **quem** (usuário, IP) e **o quê** (a ação e seu resultado).

Exemplo de linha do servidor SSH de um Linux:

```
Mar 14 09:21:07 srv01 sshd[2231]: Failed password for root from 203.0.113.45 port 51234 ssh2
```

Lendo: em 14 de março às 9h21, no servidor `srv01`, o serviço `sshd` registrou uma senha errada para o usuário `root` vinda do IP `203.0.113.45`. Uma linha dessas é normal. Quinhentas em um minuto é um ataque de força bruta.

A analogia contábil é direta: o log é o **livro diário**. Um lançamento isolado diz pouco; o conjunto, conciliado com outras fontes, conta a história.

## Fontes de log que importam

| Fonte | O que revela |
|---|---|
| Windows (Segurança, Sistema, Aplicativo) | logons, criação de processos, serviços instalados |
| Linux (`/var/log/auth.log`, `journalctl`) | SSH, sudo, serviços |
| Firewall/roteador | conexões bloqueadas e permitidas, destinos |
| Servidor web (Apache, Nginx, IIS) | requisições, erros, varreduras |
| Antivírus/EDR | detecções, ações tomadas |
| Microsoft 365 / Google Workspace | logins, compartilhamentos, regras de e-mail criadas |
| Sistema contábil/ERP | quem acessou qual cliente, exportações |
| DNS | domínios consultados por cada máquina |

Para um escritório, os três primeiros a ligar são: logs de logon do Windows, auditoria do Microsoft 365 ou Google Workspace, e o firewall.

## Centralização e retenção

Logs guardados só na própria máquina têm dois problemas: o atacante **apaga** (o ransomware limpa o log de eventos como primeiro passo) e ninguém **olha**. A solução é **centralizar**: cada máquina envia suas linhas para um servidor de logs. Em Linux, o protocolo clássico é o **syslog**; no Windows, usa-se um agente (o próprio Wazuh, o Winlogbeat da Elastic, ou o encaminhamento nativo de eventos).

**Retenção** é por quanto tempo guardar. Referências práticas: 90 dias "quentes" (pesquisáveis) e 12 meses "frios" (arquivados) são um ponto de partida razoável. A LGPD não fixa prazo para logs de segurança, mas exige que você consiga **demonstrar** o que aconteceu num incidente, e o Marco Civil da Internet (Lei 12.965/2014) exige que provedores de aplicação guardem registros de acesso por 6 meses. Logs são dados pessoais (contêm IP e usuário), portanto entram no seu mapeamento de dados.

## SIEM: o conciliador

Um **SIEM (Security Information and Event Management)** recebe logs de todas as fontes, **normaliza** (traduz formatos diferentes para campos comuns: `usuario`, `ip_origem`, `acao`), **indexa** para busca rápida, **correlaciona** eventos e **alerta** segundo regras. Os nomes que você vai encontrar:

- **Wazuh:** gratuito e de código aberto; inclui agente para Windows/Linux, detecção de vulnerabilidades e verificação de CIS Benchmarks. A opção realista para quem tem pouco orçamento e alguém disposto a aprender.
- **Elastic Security (ELK):** a pilha Elasticsearch + Kibana com módulo de segurança; muito flexível, exige mais configuração.
- **Splunk:** referência comercial, poderoso e caro.
- **Microsoft Sentinel:** SIEM na nuvem Azure, natural para quem já usa Microsoft 365; cobra por volume de dados ingeridos.

### Correlação

A força do SIEM está em cruzar fontes. Exemplos de regras de correlação:

- 20 logons falhos (evento 4625) do mesmo IP em 2 minutos, seguidos de 1 logon com sucesso (4624): **força bruta bem-sucedida**.
- Login no Microsoft 365 de São Paulo às 14h e de outro país às 14h20 pela mesma conta: **viagem impossível**, provável credencial roubada.
- Criação de regra de encaminhamento de e-mail para domínio externo logo após um login de IP novo: padrão clássico de fraude de boleto.
- Processo `vssadmin delete shadows` em uma estação: ransomware apagando cópias de sombra antes de criptografar.

## Alertas e falsos positivos

Toda regra gera **falsos positivos**: alertas sobre coisas legítimas (o próprio contador errando a senha cinco vezes na segunda de manhã). O desafio não é zerar alertas, é calibrar: ajustar limiares, criar exceções documentadas e **priorizar**. Um sistema que grita o dia inteiro é ignorado, e quando o alerta verdadeiro chega, ninguém olha. Esse fenômeno tem nome: **fadiga de alertas**.

Boas práticas: cada alerta tem um responsável e um prazo; alertas de alta gravidade (ransomware, conta de administrador criada) notificam no celular; alertas de baixa gravidade viram um relatório diário.

## Analisando um log com Python

Você não precisa de SIEM para começar. Um script que lê um log e conta tentativas falhas por IP já detecta força bruta:

```python
import re
from collections import Counter

log = """Mar 14 09:21:07 srv01 sshd[2231]: Failed password for root from 203.0.113.45 port 51234 ssh2
Mar 14 09:21:09 srv01 sshd[2231]: Failed password for root from 203.0.113.45 port 51240 ssh2
Mar 14 09:21:12 srv01 sshd[2231]: Failed password for admin from 203.0.113.45 port 51251 ssh2
Mar 14 09:25:40 srv01 sshd[2290]: Accepted publickey for ana from 10.0.0.12 port 60122 ssh2
Mar 14 09:31:02 srv01 sshd[2301]: Failed password for ana from 10.0.0.12 port 60130 ssh2
"""

padrao = re.compile(r"Failed password for \S+ from (\d+\.\d+\.\d+\.\d+)")
contador = Counter()
for linha in log.splitlines():
    m = padrao.search(linha)
    if m:
        contador[m.group(1)] += 1

for ip, n in contador.most_common():
    alerta = " <-- suspeito" if n >= 3 else ""
    print(ip, n, alerta)
```

Saída:

```
203.0.113.45 3  <-- suspeito
10.0.0.12 1 
```

A expressão regular captura o IP de cada linha de falha; `Counter` conta; o limiar de 3 marca o suspeito. É a mesma lógica das regras de SIEM, em dez linhas.

## Erros comuns

- Ligar a coleta de tudo e estourar o disco em uma semana. Comece pelas fontes de maior valor.
- Guardar logs só na máquina de origem, onde o atacante apaga.
- Relógios dessincronizados entre máquinas: sem NTP (o protocolo que acerta o relógio de todas as máquinas pela rede), a correlação por tempo fica impossível.
- Regras sem dono: o alerta dispara e ninguém é responsável por olhar.
- Esquecer que log contém dado pessoal e deixá-lo acessível a todos.

## Na prática

Para o escritório, a sequência realista: (1) ativar auditoria de logon no Windows e a auditoria unificada do Microsoft 365/Google Workspace; (2) exportar o log do firewall; (3) instalar um Wazuh em uma VM (ou contratar um MSSP que forneça o SIEM); (4) criar três regras: força bruta, viagem impossível e regra de encaminhamento de e-mail; (5) definir quem olha e quando.

## Resumo

- Log é o livro diário da segurança: quando, onde, quem, o quê. Centralize; não deixe só na máquina de origem.
- Retenção de referência: 90 dias pesquisáveis, 12 meses arquivados; logs contêm dados pessoais.
- SIEM normaliza, correlaciona e alerta; Wazuh é a opção gratuita, Sentinel/Splunk/Elastic as comerciais.
- Correlação cruza fontes: força bruta seguida de sucesso, viagem impossível, regra de encaminhamento.
- Falsos positivos se calibram, não se eliminam; todo alerta precisa de dono e prazo.
