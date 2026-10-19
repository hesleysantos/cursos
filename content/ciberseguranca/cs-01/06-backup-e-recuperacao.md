Nesta lição você vai aprender a montar um backup que realmente salva o escritório no pior dia: a regra 3-2-1, a diferença entre sincronizar e fazer backup, por que o versionamento é indispensável e por que o único teste que vale é a restauração. Importa porque, contra o ransomware, nenhum antivírus, firewall ou senha resolve depois do fato: só o backup devolve o que foi perdido.

## O que o backup protege

Backup é uma cópia dos dados guardada em outro lugar, feita de forma que possa ser recuperada. Ele protege contra cinco coisas diferentes: falha de hardware (o disco morre), erro humano (alguém apaga a pasta do cliente ou sobrescreve a planilha), roubo ou desastre (notebook furtado, incêndio, enchente), programas maliciosos (ransomware) e falha de fornecedor (o sistema em nuvem sai do ar ou encerra a conta). Um backup bom protege contra todas; o backup ruim, que é o mais comum, protege só contra a primeira.

## Ransomware: por que o backup é a única defesa real

O **ransomware** é um programa que criptografa seus arquivos e exige um resgate (*ransom*) para devolver a chave. Ele chega por anexo de e-mail, por link, por acesso remoto com senha fraca ou por uma máquina já comprometida na rede. Quando age, cifra cada documento, planilha, PDF e banco de dados do sistema contábil, apaga o original e deixa um aviso com o valor em criptomoeda.

Pagar não é garantia: muitos grupos não devolvem a chave, e pagar financia o próximo ataque. As versões modernas ainda **roubam os dados antes de cifrar**, para ameaçar publicá-los (dupla extorsão), um problema à parte sob a LGPD. A única resposta sólida é limpar as máquinas e restaurar de um backup que o ransomware não alcançou.

Ponto crítico: o ransomware cifra **tudo que a máquina enxerga**, inclusive o HD externo conectado, a pasta de rede do servidor e o pendrive. Backup acessível pelo computador infectado é backup perdido.

## A regra 3-2-1

A regra clássica, que continua valendo:

- **3** cópias dos dados (a original e mais duas).
- **2** mídias diferentes (por exemplo, disco local e nuvem; ou servidor e HD externo).
- **1** cópia fora do local (*off-site*): em outro prédio ou na nuvem, para sobreviver a roubo, incêndio e ransomware da rede local.

Uma montagem viável para o escritório: arquivos de trabalho no servidor (cópia 1); backup automático diário num HD externo que fica **desconectado** entre os backups ou num NAS (um pequeno servidor de armazenamento ligado à rede) com usuário e senha próprios, que as estações não usam (cópia 2); e backup automático na nuvem com versionamento (cópia 3, fora do local).

## Sincronizar não é fazer backup

Este é o engano mais caro. OneDrive, Google Drive e Dropbox **sincronizam**: o que você altera, apaga ou cifra na sua máquina é replicado para a nuvem em segundos. Se o ransomware cifra a pasta, a nuvem recebe os arquivos cifrados. Se você apaga a pasta do cliente, a nuvem apaga também.

O que salva, nesses serviços, é o **versionamento** e a lixeira: Google Drive, OneDrive e Dropbox guardam versões anteriores dos arquivos por um período (30 dias é comum nos planos básicos). Isso funciona, mas tem prazo e depende de a conta não ter sido invadida. Trate a sincronização como conveniência e tenha um backup de verdade ao lado.

| Solução | Disco morto | Apagar por engano | Ransomware | Incêndio |
|---|---|---|---|---|
| HD externo sempre conectado | Protege | Parcial | Não | Não |
| OneDrive/Drive sincronizado | Protege | Dentro do prazo de versões | Dentro do prazo | Protege |
| Backup em nuvem com versões | Protege | Protege | Protege | Protege |
| HD desconectado entre backups | Protege | Protege | Protege | Não |

## Automático e versionado

Backup manual ("toda sexta eu copio") não existe: na sexta movimentada ele não acontece, e o ataque vem na segunda. Use ferramentas que rodam sozinhas: o Histórico de Arquivos do Windows, o backup do NAS ou um serviço de backup em nuvem (Backblaze, iDrive, Acronis e Veeam são exemplos).

**Versionamento** significa guardar várias versões do mesmo arquivo ao longo do tempo, não só a última. Sem versões, o backup de segunda sobrescreve o de sexta com os arquivos cifrados; com versões, você volta para quinta. Mantenha pelo menos 30 dias; ransomware costuma ficar semanas em silêncio antes de agir.

## Testar a restauração

Backup que nunca foi restaurado é uma esperança, não um backup. É comum a empresa "ter backup" e descobrir, no dia do incidente, que o disco estava corrompido, que a tarefa agendada falhava há meses ou que a pasta do banco de dados do sistema não estava incluída.

Faça um **teste de restauração** mensal: escolha três arquivos aleatórios (um documento, uma planilha, um XML de nota) e restaure-os em outra pasta. Uma vez por semestre, teste a restauração completa do sistema contábil em uma máquina de reserva e anote quanto tempo levou: esse é o seu tempo real de recuperação.

## Erros comuns

- **Backup no mesmo disco** ("pasta Backup" dentro de Documentos). Morreu o disco, morreu tudo.
- **HD externo sempre plugado.** O ransomware o cifra junto.
- **Backup só dos "arquivos importantes"**, esquecendo o banco de dados do sistema, os certificados, os XML e os e-mails.
- **Confiar que "está na nuvem".** Sincronização sem versões não é backup.
- **Nunca testar.** O problema aparece no dia do incidente.

## Na prática

Escreva um plano de uma página: o que é copiado, para onde (as três cópias), com que frequência, quantas versões, quem confere que rodou e quando se testa. Inclua obrigatoriamente: base de dados do sistema contábil e fiscal, XMLs de notas, documentos dos clientes, certificados A1 (com a senha guardada à parte) e as caixas de e-mail. Em caso de ransomware: desconecte a máquina da rede, não pague, restaure do backup limpo e comunique os clientes afetados conforme a LGPD.

> **Dica:** a pergunta que resolve 80% do planejamento é "se amanhã todos os computadores estiverem cifrados, a que horas voltamos a trabalhar?".

## Resumo

- Backup protege contra disco morto, erro humano, roubo e desastre, ransomware e falha de fornecedor; só o backup bem feito cobre todos.
- Regra 3-2-1: três cópias, duas mídias, uma fora do local; o ideal inclui uma cópia desconectada ou imutável (que ninguém, nem o ransomware, consegue alterar ou apagar por um prazo).
- Sincronização (OneDrive, Drive) não é backup: replica o erro e o ransomware; o que a salva é o versionamento dentro do prazo.
- Backup tem de ser automático e versionado (30 dias ou mais), incluindo banco de dados do sistema, XMLs, certificados e e-mails.
- Teste a restauração todo mês; o tempo de restaurar é o número que importa.
