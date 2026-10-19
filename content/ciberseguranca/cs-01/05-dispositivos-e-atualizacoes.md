Nesta lição você vai aprender a deixar o computador e o celular do escritório em um estado mínimo de segurança: atualizados, com proteção ativa, contas sem poder de administrador, tela bloqueada e disco criptografado, sem comprar nada. Importa porque a maioria dos programas maliciosos entra por falhas que já tinham correção e por usuários que, sem perceber, dão a eles poder total sobre a máquina.

## Por que atualizar

Todo programa tem falhas. Quando uma falha de segurança é descoberta, o fabricante publica uma correção (a atualização) e, a partir desse momento, a falha fica pública. Criminosos leem essas publicações e criam ferramentas para explorar quem ainda não atualizou. Ou seja: o computador desatualizado não está "igual a ontem"; está mais vulnerável do que ontem, porque agora a receita da invasão é conhecida.

O WannaCry (2017) parou hospitais e empresas no mundo todo explorando uma falha do Windows corrigida dois meses antes.

O que manter atualizado, em ordem de importância: o sistema operacional (Windows, Android, iOS), o navegador, o programa de e-mail, o leitor de PDF, o pacote Office e o próprio sistema contábil. No Windows, deixe o Windows Update automático e reinicie quando ele pedir: a atualização só vale depois disso. Atenção a versões sem suporte: o suporte do Windows 10 terminou em **14 de outubro de 2025**; desde então, só recebe correções quem aderiu ao programa de atualizações estendidas (ESU) da Microsoft, e por tempo limitado. Máquina com sistema sem suporte é máquina sem defesa para falhas novas.

## Antivírus e EDR

O **antivírus** reconhece programas maliciosos por assinatura (uma "impressão digital" conhecida) e por comportamento suspeito. O Windows já inclui o Microsoft Defender, que é competente e gratuito; para um escritório pequeno, mantê-lo ativo e atualizado é o essencial. Não instale dois antivírus ao mesmo tempo: eles brigam entre si.

Em empresas, o antivírus evoluiu para o **EDR** (*Endpoint Detection and Response*): além de bloquear, ele registra o que acontece em cada máquina, permite investigar e isolar um computador da rede remotamente. O importante é entender o limite: antivírus não impede você de digitar a senha num site falso nem de autorizar uma transferência.

## Firewall

O **firewall** controla que conexões de rede podem entrar e sair da máquina. O Firewall do Windows vem ativado e deve continuar assim. Não o desative "para o sistema funcionar": se um programa precisa de exceção, crie a exceção específica para ele, e só.

## Contas sem privilégio de administrador

Esta é a medida mais negligenciada e uma das mais eficazes. No Windows, há dois tipos de conta: **administrador** (pode instalar programas, alterar o sistema, desativar proteções) e **usuário padrão** (usa os programas, mas não altera o sistema). Quando você usa uma conta de administrador no dia a dia, qualquer programa malicioso que você abrir por engano herda esse poder: ele pode desligar o antivírus, instalar-se no sistema e criptografar tudo.

Com uma conta padrão, o mesmo programa esbarra numa janela pedindo senha de administrador (o Controle de Conta de Usuário, UAC). Esse pedido inesperado é o seu alarme. A configuração ideal: uma conta de administrador local, com senha forte, usada só para instalar e configurar; e uma conta padrão para cada pessoa (nunca a conta "escritório" compartilhada) para o trabalho de todo dia.

## Bloqueio de tela e criptografia de disco

Computador destravado numa sala com clientes, prestadores e entregadores é um convite. Configure o bloqueio automático após 5 minutos de inatividade e crie o hábito de pressionar `Win + L` ao levantar. No celular, bloqueio por digital ou rosto com PIN de seis dígitos ou mais.

Mas bloqueio de tela não protege um notebook roubado: basta retirar o disco e ler os arquivos em outra máquina. Para isso existe a **criptografia de disco**. No Windows 11 Pro, o **BitLocker** criptografa o disco inteiro; sem a senha de login ou a chave de recuperação, o conteúdo é ilegível. No Windows Home, a função chama-se "Criptografia de dispositivo" e depende do hardware. Guarde a chave de recuperação fora da máquina (na conta Microsoft da empresa ou impressa e trancada): sem ela, uma falha no disco pode significar perder tudo. Celulares modernos já vêm criptografados, desde que tenham bloqueio de tela.

## Celular: permissões e lojas oficiais

O celular do contador acessa e-mail, WhatsApp, banco e o aplicativo autenticador. Três regras: instale aplicativos **apenas** das lojas oficiais (Google Play, App Store); nunca instale um `.apk` (arquivo de instalação do Android) enviado por link, mesmo que "seja do banco"; e revise as **permissões** dos aplicativos. Um app de lanterna não precisa de acesso a contatos, SMS e acessibilidade (esta última é a porta usada por programas que leem a tela do banco). Revogue tudo que não faz sentido.

## Pendrives

Um pendrive "esquecido" na recepção ou entregue num evento pode conter programa malicioso que roda ao ser aberto. Regras: não conecte dispositivos de origem desconhecida; os pendrives do escritório devem ser criptografados (o BitLocker To Go faz isso) e usados para transporte, nunca como única cópia de alguma coisa.

## Erros comuns

- **Adiar a atualização por semanas** clicando em "lembrar mais tarde". A correção existe; só você não a aplicou.
- **Desativar o antivírus para instalar o sistema contábil** e esquecer de reativar.
- **Dar a senha de administrador ao usuário "para parar de pedir".** Isso anula a proteção.
- **Ativar o BitLocker sem guardar a chave de recuperação.** A criptografia protege contra ladrão e contra você mesmo.
- **Deixar o programa de acesso remoto do suporte instalado.** AnyDesk, TeamViewer e similares só devem rodar durante o atendimento, nunca iniciar com o Windows.

## Na prática

Faça uma rodada em cada máquina do escritório com sete itens: Windows e navegador atualizados; Defender ativo; Firewall ativo; conta de uso diário padrão, não administrador; bloqueio automático em 5 minutos; BitLocker ativado e chave guardada; nenhum programa de acesso remoto iniciando com o sistema. Repita a cada trimestre. Ao comprar um computador novo, prefira Windows 11 Pro pelo BitLocker e pela gestão de contas.

> **Atenção:** se um "suporte" ligar pedindo para instalar um programa de acesso remoto, desligue. Suporte legítimo só acessa quando você chamou.

## Resumo

- Atualize sistema, navegador, Office e leitor de PDF; falha corrigida e não aplicada é a porta mais usada. Sistemas sem suporte (como o Windows 10 desde 14 de outubro de 2025) não recebem correção.
- Mantenha o Microsoft Defender (ou um EDR) e o Firewall do Windows ativos; nunca dois antivírus ao mesmo tempo.
- Trabalhe com conta de usuário padrão; a conta de administrador fica só para instalar e configurar.
- Bloqueio de tela automático e BitLocker com chave de recuperação guardada protegem contra acesso físico e roubo.
- No celular: só lojas oficiais, permissões revisadas; pendrives desconhecidos nunca são conectados.
