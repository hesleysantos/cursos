Nesta lição você vai aprender o que o cadeado do navegador garante (e o que não garante), como extensões e downloads viram portas de entrada, como usar Wi-Fi fora do escritório sem expor dados, o que uma VPN faz de verdade e como redes sociais e cookies alimentam golpes. Importa porque o navegador é o programa onde o contador passa a maior parte do dia: portais, bancos, e-mail, sistemas em nuvem.

## HTTPS e o cadeado

Quando o endereço começa com `https://` e o navegador mostra um cadeado, a conexão entre o seu computador e o site está **criptografada**: ninguém no caminho (o Wi-Fi do café, o provedor, um equipamento intermediário) consegue ler ou alterar o que trafega. Isso é garantido pelo TLS, um protocolo que você vai estudar no módulo seguinte.

O que o cadeado **não** garante: que o site é honesto. Qualquer golpista obtém certificado gratuito em minutos para `receita-federal-gov.net`, e o cadeado aparece. O cadeado diz "a conversa é privada"; não diz "você está conversando com a pessoa certa". Por isso, o que importa é **o domínio** na barra de endereço. O domínio é a parte que vem logo antes da primeira barra, lida da direita para a esquerda. Em `cav.receita.fazenda.gov.br`, o final `gov.br` só pode ser usado por órgãos públicos, e `fazenda.gov.br` é o Ministério da Fazenda; `receita` e `cav` são apenas subdivisões dele. Já em `receita.gov.br.acesso-rapido.com`, o dono é `acesso-rapido.com`, por mais que o endereço comece com "receita.gov.br": tudo o que vem à esquerda do dono é um subdomínio, que ele cria como quiser.

Sites sem HTTPS (o navegador mostra "Não seguro") não devem receber senha nem dado algum.

## Extensões e downloads

Extensões do navegador têm, muitas vezes, permissão para **ler e alterar tudo** o que você vê em todos os sites, inclusive a tela do banco e do e-CAC. Extensões legítimas são vendidas ou abandonadas e depois atualizadas com código malicioso; isso já aconteceu com extensões populares. Regras: só da loja oficial, só o que você usa, e leia as permissões ("ler e alterar seus dados em todos os sites" merece reflexão).

Downloads seguem a lógica dos anexos: programas só do site do fabricante (não do primeiro resultado do Google, que muitas vezes é anúncio pago de um site falso); desconfie de "ativadores" e "cracks", veículo clássico de programas que roubam senhas; e repare na extensão real do arquivo. No Windows, ative "Mostrar extensões de nome de arquivo" no Explorador para enxergar `Boleto.pdf.exe` como ele é.

## Wi-Fi público e VPN

No Wi-Fi do aeroporto, do hotel ou da padaria, você compartilha a rede com desconhecidos, e o próprio ponto de acesso pode ser falso (um notebook com o nome "Aeroporto_Free"). Com HTTPS em todo site, o risco de alguém ler sua senha caiu muito, mas sobram: sites sem HTTPS, o sequestro de DNS (o DNS é o serviço que traduz o nome do site em endereço; sequestrado, você digita o endereço do banco e é levado a outro servidor) e a exposição de que sites você acessa.

A **VPN** (rede privada virtual) cria um túnel criptografado do seu dispositivo até um servidor de confiança; a rede Wi-Fi só vê tráfego cifrado indo para aquele servidor. Ela **não** torna você anônimo, não protege contra phishing nem contra programa malicioso, e troca a confiança: agora quem vê seu tráfego é o provedor da VPN. Prefira VPN paga e conhecida ou a VPN do próprio escritório; VPN "grátis" costuma viver de vender os seus dados. Alternativa mais simples fora do escritório: a internet do próprio celular, usando-o como ponto de acesso (o "roteamento" ou *hotspot* 4G/5G), em vez do Wi-Fi público.

## Redes sociais e exposição

O reconhecimento, primeira etapa de um ataque, é feito nas redes sociais. O perfil do escritório mostra quem é a equipe; o LinkedIn diz quem cuida do financeiro; o Instagram do sócio mostra que ele está viajando esta semana (ótimo momento para o "pedido urgente do dono"). Vídeos públicos fornecem a voz para um deepfake.

Não se trata de sair das redes, e sim de pensar antes de publicar: dados de clientes jamais; foto de tela de sistema, crachá ou documento, nunca; e cuidado com "quizzes" que pedem o nome do primeiro animal de estimação ou a cidade de nascimento, que são as perguntas de recuperação de senha. Perfis pessoais fechados, perfil profissional com o mínimo necessário.

## Cookies, rastreamento e privacidade

**Cookies** são pequenos registros que o site guarda no seu navegador. Os de sessão mantêm você logado; os de rastreamento, geralmente de terceiros (anunciantes), seguem você de site em site para montar um perfil. Isso em si não é invasão, mas gera dois riscos: o perfil vaza (e vira insumo de golpe sob medida) e o cookie de sessão roubado permite entrar na conta **sem senha e sem MFA**, que é o que fazem vários programas maliciosos modernos.

Medidas razoáveis: nos avisos de cookies, escolha "rejeitar não essenciais"; ative o bloqueio de rastreadores do navegador; faça logout de bancos e portais ao terminar, em vez de só fechar a aba; e revise as configurações de privacidade do celular e do Windows (localização, microfone, anúncios personalizados). O objetivo é reduzir a superfície, não desaparecer.

## Erros comuns

- **Ver o cadeado e relaxar.** O cadeado não valida o site; o domínio valida.
- **Instalar a extensão "que todo mundo usa"** sem ler as permissões.
- **Baixar o sistema pelo anúncio do Google.** Anúncios no topo da busca são compráveis por qualquer um, inclusive golpistas.
- **Achar que VPN é escudo contra tudo.** VPN cuida da rede; não cuida do que você clica.
- **Fechar a aba do banco sem sair.** A sessão continua válida.

## Na prática

Crie um perfil de navegador só para trabalho: nele ficam os favoritos dos portais digitados por você (e-CAC, Simples Nacional, eSocial, bancos), sem extensões além do gerenciador de senhas, com bloqueio de rastreadores ativo. Acesse portais sempre pelo favorito, nunca por link de e-mail ou resultado de busca. Fora do escritório, 4G ou VPN; nunca Wi-Fi aberto para banco ou portal. A cada trimestre, abra a lista de extensões de cada máquina e remova o que ninguém reconhece.

> **Dica:** leia o domínio da direita para a esquerda. O que vem logo antes do `.com.br`, do `.com` ou do `.gov.br` é o dono de verdade do site; tudo à esquerda dele é enfeite que o dono escolhe.

## Resumo

- HTTPS/cadeado garante conversa cifrada, não site honesto; quem valida o site é o domínio, lido da direita para a esquerda.
- Extensões e downloads são portas de entrada: só da fonte oficial, só o necessário, com as permissões lidas.
- Em Wi-Fi público use VPN confiável ou o 4G do celular; VPN protege a rede, não protege de phishing.
- Redes sociais são a fase de reconhecimento do atacante: nada de dados de clientes, telas, documentos ou respostas de recuperação de senha.
- Rejeite cookies não essenciais, use bloqueio de rastreadores e faça logout: cookie de sessão roubado dispensa senha e MFA.
