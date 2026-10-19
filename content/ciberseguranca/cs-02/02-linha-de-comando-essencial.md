Nesta lição você vai perder o medo da tela preta. Vai aprender a abrir o PowerShell, o CMD e o bash, navegar entre pastas, listar e buscar arquivos, ver os processos e as conexões de rede abertas, e, principalmente, a **ler** a saída de um comando. Importa porque, na segurança, quase todo diagnóstico começa na linha de comando: é ali que se descobre quem está conectado à máquina, o que está rodando e onde um arquivo suspeito se escondeu.

## Por que a linha de comando

Um **terminal** é uma janela em que você digita comandos em texto e lê respostas em texto. Parece antiquado, mas tem três vantagens: é mais rápido que clicar em dez janelas, funciona do mesmo jeito em qualquer máquina (inclusive remota, sem interface gráfica) e mostra informações que a interface esconde, como as conexões de rede de cada processo.

No Windows existem dois terminais. O **CMD** (Prompt de Comando) é o antigo, com comandos herdados do MS-DOS. O **PowerShell** é o moderno: aceita os comandos antigos e acrescenta centenas de outros, com saídas estruturadas. Abra qualquer um pelo menu Iniciar digitando `cmd` ou `powershell`. No Linux e no macOS, o terminal roda o **bash** (ou um parente próximo, como o zsh).

Para abrir uma linha, o terminal mostra o **prompt**: `C:\Users\Maria>` no CMD, `PS C:\Users\Maria>` no PowerShell, `maria@servidor:~$` no bash. O `~` no bash é a pasta pessoal; o `$` indica usuário comum e o `#` indica root.

## Navegar e listar

Os comandos de movimentação são quase iguais nos três ambientes:

| Ação | CMD / PowerShell | bash |
|---|---|---|
| Onde estou | `cd` sem argumento (CMD) / `pwd` (PowerShell) | `pwd` |
| Listar a pasta | `dir` / `ls` | `ls -l` |
| Entrar numa pasta | `cd Documentos` | `cd Documentos` |
| Voltar uma pasta | `cd ..` | `cd ..` |
| Ver conteúdo de um texto | `type arquivo.txt` / `Get-Content` | `cat arquivo.txt` |
| Limpar a tela | `cls` / `clear` | `clear` |

Pressione `Tab` para completar nomes de arquivos e a seta para cima para repetir comandos. Um exemplo no PowerShell:

```powershell
PS C:\Users\Maria> cd Documentos\Clientes
PS C:\Users\Maria\Documentos\Clientes> dir

    Diretório: C:\Users\Maria\Documentos\Clientes

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----        12/05/2026     09:14                Padaria Central
-a----        11/05/2026     17:52          48213 folha_abril.xlsx
-a----        12/05/2026     08:03           2140 LEIA-ME.txt
```

Leitura: `d` no início indica pasta (*directory*); `a` indica arquivo; a data é a última alteração; `Length` é o tamanho em bytes. Um `LEIA-ME.txt` novo numa pasta de clientes, criado no mesmo horário em todas as pastas, é a assinatura típica de um pedido de resgate de ransomware.

## Buscar

Para achar um arquivo pelo nome, `dir /s nome*` no CMD (o `/s` busca nas subpastas) ou `Get-ChildItem -Recurse -Filter "folha*"` no PowerShell. No bash, `find . -name "folha*"`.

Para procurar um texto **dentro** de arquivos, o Windows usa `findstr` e o Linux usa `grep`:

```powershell
findstr /s /i "12.345.678" *.txt
```

```bash
grep -ri "12.345.678" /home/maria/clientes
```

Em ambos, `/i` ou `-i` ignora maiúsculas e `/s` ou `-r` entra nas subpastas. O `grep` é a ferramenta mais usada da segurança: é com ele que se filtra um log de milhares de linhas para ver só as que interessam (`grep "Failed password" /var/log/auth.log`).

## Ver processos

```powershell
tasklist
```

```
Nome da imagem            Identifi Nome da sessão       Sessão# Uso de memór
========================= ======== ================ =========== ============
svchost.exe                   1032 Services                   0     22.540 K
EXCEL.EXE                     5820 Console                    1    210.112 K
anydesk.exe                   7044 Console                    1     64.330 K
```

A segunda coluna é o **PID** (no Windows em português o título sai truncado como "Identifi", de "Identificação de processo"): o número que identifica o processo; vai servir para cruzar com as conexões de rede. No PowerShell, `Get-Process` mostra o mesmo com mais detalhes, e `Get-Process | Sort-Object CPU -Descending | Select-Object -First 5` lista os cinco que mais usam processador. No Linux, `ps aux` lista tudo e `top` mostra em tempo real.

## Ver conexões de rede

Este é o comando que mais vale a pena aprender:

```powershell
netstat -ano
```

```
Conexões ativas

  Proto  Endereço local         Endereço externo       Estado           PID
  TCP    0.0.0.0:135            0.0.0.0:0              LISTENING       1032
  TCP    0.0.0.0:3389           0.0.0.0:0              LISTENING       1288
  TCP    192.168.0.15:52114     142.250.79.46:443      ESTABLISHED     5820
  TCP    192.168.0.15:52190     185.220.101.7:443      ESTABLISHED     7044
```

Como ler cada linha: o protocolo; o endereço e a **porta** local; o endereço e a porta do outro lado; o estado; e o PID do processo responsável. `LISTENING` significa que a máquina está esperando conexões naquela porta (a 3389 é a Área de Trabalho Remota, que não deveria estar aberta numa estação comum). `ESTABLISHED` é uma conexão ativa. A linha do PID 7044 mostra o AnyDesk conectado a um endereço externo: se ninguém está em atendimento de suporte, isso é um alarme.

No Linux, o equivalente moderno é `ss -tulpn` (ou `netstat -tulpn`). A opção `-p` mostra o processo, e exige `sudo`.

## Erros comuns

- **Rodar comandos copiados de um site sem entender.** A linha de comando faz exatamente o que você pede, inclusive apagar tudo. Leia antes de executar, e nunca execute o que um "suporte" mandou por mensagem.
- **Abrir o terminal como administrador por hábito.** Só quando o comando exigir.
- **Confundir `0.0.0.0` com "nenhum endereço".** Em `LISTENING`, significa "em todas as interfaces", ou seja, aceita conexão de qualquer rede.
- **Ignorar a coluna PID.** Sem cruzar com `tasklist`, a conexão suspeita não tem dono.

## Na prática

Monte uma rotina de cinco minutos para quando uma máquina "estiver estranha": `tasklist` para ver o que roda, `netstat -ano | findstr ESTABLISHED` para ver com quem a máquina conversa (a barra vertical `|` entrega a saída de um comando ao seguinte, que filtra), e `tasklist /fi "PID eq 7044"` para descobrir qual processo é dono de cada conexão (troque 7044 pelo PID da linha suspeita). Anote endereços externos desconhecidos; a lição 3 vai ensinar a interpretá-los. Não precisa decorar: salve esses três comandos num arquivo de texto no gerenciador de senhas do escritório.

> **Dica:** `comando /?` no CMD, `Get-Help comando` no PowerShell e `man comando` no bash mostram a ajuda. Ninguém decora as opções.

## Resumo

- Terminais: CMD e PowerShell no Windows, bash no Linux; o prompt diz onde você está e com que poder.
- Navegar e listar: `cd`, `dir`/`ls`, `type`/`cat`; buscar: `dir /s` e `findstr` no Windows, `find` e `grep` no Linux.
- Processos: `tasklist`/`Get-Process` e `ps aux`; o PID identifica cada um.
- Conexões: `netstat -ano` (Windows) e `ss -tulpn` (Linux); `LISTENING` é porta aberta esperando, `ESTABLISHED` é conversa em andamento, e o PID diz quem é o dono.
- Leia antes de executar; nunca rode comandos recebidos de um "suporte" por mensagem.
