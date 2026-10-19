Nesta lição você vai entender o que um sistema operacional faz, como Windows e Linux organizam usuários, grupos e permissões, o que são processos e serviços, como usar o Gerenciador de Tarefas e por que "rodar como administrador" é a porta mais fácil para um atacante. Importa porque quase toda medida de segurança (antivírus, contas padrão, bloqueio, logs) é um recurso do sistema operacional.

## O que o sistema operacional faz

O **sistema operacional** (SO) é o programa que fica entre o hardware (processador, memória, disco, rede) e os programas que você usa (navegador, Excel, sistema contábil). Ele decide quem usa o processador agora, guarda os arquivos no disco, controla a rede e, principalmente, **decide quem pode fazer o quê**. É o síndico do prédio: sabe quem tem chave de qual porta. Programas são visitantes: entram com a permissão de quem os convidou.

Os dois sistemas que você mais vai encontrar:

| | Windows | Linux |
|---|---|---|
| Onde aparece | Desktops e notebooks de escritório, servidores Microsoft | Servidores de internet, nuvem, roteadores, Android (base) |
| Usuário máximo | Administrador | root |
| Pasta do sistema | `C:\Windows\System32` | `/bin`, `/etc`, `/usr` |
| Logs | Visor de Eventos | `/var/log` e `journalctl` |

O escritório usa Windows nas estações; o site, o e-mail e os sistemas em nuvem rodam, quase sempre, em Linux. Um profissional de segurança lê os dois.

## Usuários, grupos e permissões

Cada pessoa (e cada serviço) tem uma **conta de usuário**. Contas são reunidas em **grupos**: em vez de dar permissão a dez pessoas, dá-se ao grupo "Fiscal". No Windows, os grupos mais importantes são **Administradores** (podem tudo) e **Usuários** (podem usar, não alterar o sistema). No Linux, o usuário **root** pode tudo; os demais executam tarefas administrativas com `sudo`, que pede senha e registra quem fez o quê.

**Permissões** são as regras de quem pode ler, alterar ou executar cada arquivo e pasta. No Windows (sistema de arquivos NTFS), botão direito na pasta, Propriedades, aba Segurança: aparece a lista de usuários e grupos com Leitura, Gravação, Modificar ou Controle total. No Linux, cada arquivo tem três conjuntos de permissões (dono, grupo, outros), com leitura (r), escrita (w) e execução (x):

```bash
ls -l /var/log/auth.log
-rw-r----- 1 syslog adm 48213 mai 12 09:41 /var/log/auth.log
```

Lendo: o dono (`syslog`) pode ler e escrever; o grupo `adm` só lê; os outros não podem nada. Para o escritório, a lição é simples: a pasta dos clientes dá permissão aos grupos que precisam, não a "Todos". Compartilhamento de rede com "Todos: Controle total" é uma das configurações mais comuns e mais perigosas.

## Processos e serviços

Um **processo** é um programa em execução. Ao abrir o Excel, nasce um processo `EXCEL.EXE`; ao fechar, ele morre. Cada processo roda **com a identidade de quem o abriu**: se você é administrador, o processo é administrador. Essa frase é o coração desta lição.

Um **serviço** (no Linux, *daemon*) é um processo que roda em segundo plano, sem janela, desde a inicialização: o antivírus, o Windows Update, o banco de dados do sistema contábil. No Windows, a lista fica em `services.msc`; no Linux, o `systemd` os gerencia (`systemctl status ssh`). Serviços importam porque muitos rodam com privilégios altos e abrem **portas de rede** (lição 3), e porque programas maliciosos adoram se instalar como serviço: voltam a rodar a cada reinicialização.

## Gerenciador de Tarefas

Pressione `Ctrl + Shift + Esc`. O **Gerenciador de Tarefas** mostra, na aba Processos, tudo que está rodando e quanto consome de processador, memória, disco e rede. Na aba Inicializar (no Windows 11, "Aplicativos de inicialização"), o que liga junto com o Windows. Na aba Detalhes, o executável, o usuário que o executa e o PID (*process ID*, o número que identifica o processo).

O que um olhar treinado procura:

- Processo com nome parecido com um legítimo (`svch0st.exe` em vez de `svchost.exe`), ou rodando de uma pasta estranha (`AppData\Local\Temp`, a pasta de arquivos temporários do usuário) em vez de `System32`.
- Consumo alto de processador sem motivo (mineração de criptomoeda, em que o invasor usa a sua máquina para ganhar dinheiro).
- Programa de acesso remoto (AnyDesk, TeamViewer) na inicialização sem que ninguém o tenha configurado.
- Processo rodando como SYSTEM (a conta interna do próprio Windows, com poder acima do administrador) ou como administrador sem motivo.

Botão direito em um processo, "Abrir local do arquivo", mostra de onde ele vem.

## Por que "rodar como administrador" é perigoso

Volte à frase central: o processo herda a identidade de quem o abriu. Quando um administrador abre um anexo malicioso, o programa malicioso nasce administrador. Ele pode desligar o antivírus, criar um serviço para sobreviver à reinicialização, ler as senhas do navegador, instalar um certificado falso, cifrar todos os discos da rede. Nada disso pede confirmação, porque quem faz "é" o administrador.

O mesmo anexo aberto por um usuário padrão esbarra em cada uma dessas tentativas: o Controle de Conta de Usuário (UAC) pede a senha de administrador, e o programa, sem ela, fica confinado à pasta do usuário. Ainda é um problema (ele pode cifrar os documentos daquele usuário), mas o estrago é limitado e visível. No Linux o princípio é o mesmo: usuário comum no dia a dia, `sudo` só para o comando específico.

## Erros comuns

- **Todo mundo administrador "porque o sistema contábil pede".** Quase sempre o sistema só precisa de escrita na própria pasta, que se concede ao grupo.
- **Compartilhamento de pasta com "Todos: Controle total".** Qualquer máquina infectada na rede cifra a pasta inteira.
- **Nunca abrir a aba Inicializar.** É onde programas indesejados e ferramentas de acesso remoto se escondem.
- **Confundir nome de processo com legitimidade.** A localização diz mais que o nome.

## Na prática

Em cada máquina do escritório: Gerenciador de Tarefas, aba Detalhes, ordene por "Nome de usuário"; tudo o que roda como o seu usuário deveria ser reconhecível. Aba Inicializar: desabilite o que não precisa ligar com o Windows. Configurações, Contas: rebaixe para "Usuário padrão" quem não precisa ser administrador. Na pasta compartilhada dos clientes, troque "Todos" pelos grupos reais.

> **Dica:** se um programa "só funciona como administrador", pergunte ao fornecedor qual pasta ele grava e dê permissão só ali.

## Resumo

- O SO administra hardware, arquivos, rede e, sobretudo, quem pode fazer o quê; Windows nas estações, Linux nos servidores.
- Usuários são agrupados em grupos; permissões de leitura, escrita e execução são dadas a grupos, nunca a "Todos".
- Processo é programa em execução e herda a identidade de quem o abriu; serviço é processo em segundo plano que volta a cada reinicialização.
- O Gerenciador de Tarefas (Ctrl + Shift + Esc) mostra processos, consumo, inicialização e usuário; localização e usuário dizem mais que o nome.
- Conta de administrador no dia a dia dá ao malware poder total; conta padrão o confina e faz o UAC funcionar como alarme.
