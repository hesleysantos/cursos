registerModule({
  course: 'ciberseguranca',
  id: 'cs-02',
  order: 2,
  level: 'Básico',
  title: 'Como computadores e redes funcionam',
  description: 'Você vai entender o que acontece por baixo da interface: usuários, permissões e processos do sistema operacional, a linha de comando, como um pacote viaja pela rede, como um site é resolvido e carregado, o que o roteador do escritório faz, como o e-mail pode ser falsificado e como ler logs. Ao final, saberá diagnosticar uma máquina e uma rede com comandos simples, verificar o domínio do escritório e montar um laboratório seguro em máquina virtual.',
  hours: 4,
  lessons: [
    {
      id: 'cs-02-01',
      title: 'Sistemas operacionais',
      minutes: 25,
      content: 'content/ciberseguranca/cs-02/01-sistemas-operacionais.md',
      exercises: [
        { type: 'mc', q: 'Um usuário administrador abre um anexo malicioso. Com que identidade o programa malicioso passa a rodar?', options: ['Como usuário convidado, sem poderes', 'Como administrador, herdando o poder de quem o abriu', 'Como SYSTEM, sempre', 'Como o antivírus'], answer: 1, explain: 'Todo processo herda a identidade de quem o iniciou. Por isso trabalhar com conta de administrador entrega ao malware o controle total da máquina.' },
        { type: 'match', q: 'Relacione o item do Windows ao equivalente no Linux.', pairs: [['Administrador', 'root'], ['C:\\Windows\\System32', '/bin e /etc'], ['Visor de Eventos', '/var/log e journalctl'], ['services.msc', 'systemd (systemctl)']], explain: 'Os dois sistemas têm os mesmos conceitos com nomes diferentes: usuário máximo, pasta do sistema, logs e gerenciador de serviços.' },
        { type: 'tf', q: 'Na linha "-rw-r----- 1 syslog adm 48213 auth.log", usuários que não são o dono nem estão no grupo adm podem ler o arquivo.', answer: false, explain: 'Os três últimos caracteres (---) são as permissões de "outros": nenhuma. Só o dono (rw-) e o grupo adm (r--) acessam o log.' },
        { type: 'fill', q: 'O atalho ___ abre o Gerenciador de Tarefas diretamente no Windows.', answer: ['Ctrl + Shift + Esc', 'Ctrl+Shift+Esc', 'ctrl shift esc', 'Ctrl + Shift + Esc.'], explain: 'Ctrl + Shift + Esc abre o Gerenciador sem passar pela tela de segurança do Ctrl + Alt + Del.' },
        { type: 'mc', q: 'Qual destes sinais no Gerenciador de Tarefas é o mais suspeito?', options: ['O Excel usando 200 MB de memória', 'svchost.exe rodando a partir de C:\\Windows\\System32', 'Um processo chamado svch0st.exe rodando a partir de AppData\\Local\\Temp', 'O navegador com várias abas abertas'], answer: 2, explain: 'Nome quase igual ao legítimo e pasta de usuário em vez de System32 é a combinação clássica de programa malicioso disfarçado; a localização diz mais que o nome.' },
        { type: 'mc', q: 'Por que programas maliciosos gostam de se instalar como serviço?', options: ['Porque serviços não aparecem em nenhuma ferramenta', 'Porque serviços voltam a rodar a cada reinicialização, muitas vezes com privilégios altos', 'Porque serviços não usam rede', 'Porque o antivírus ignora serviços'], answer: 1, explain: 'Serviços iniciam sozinhos com o sistema e costumam rodar como SYSTEM, garantindo persistência e poder ao malware.' },
        { type: 'order', q: 'Ordene a rotina de verificação de uma máquina proposta na lição.', items: ['Abrir a aba Detalhes e ordenar por nome de usuário', 'Abrir a aba Inicializar e desabilitar o desnecessário', 'Conferir o tipo de cada conta e rebaixar para usuário padrão', 'Trocar "Todos" pelos grupos reais na pasta compartilhada'], explain: 'A lição propõe começar pelo que está rodando, depois pelo que inicia com o sistema, em seguida pelas contas e por fim pelas permissões da pasta compartilhada.' },
      ],
    },
    {
      id: 'cs-02-02',
      title: 'Linha de comando essencial',
      minutes: 27,
      content: 'content/ciberseguranca/cs-02/02-linha-de-comando-essencial.md',
      exercises: [
        { type: 'match', q: 'Relacione o comando do Windows ao equivalente no bash.', pairs: [['dir', 'ls'], ['findstr', 'grep'], ['tasklist', 'ps aux'], ['type', 'cat']], explain: 'Listar, buscar texto, listar processos e exibir arquivo têm nomes diferentes, mas a função é a mesma nos dois ambientes.' },
        { type: 'mc', q: 'No netstat -ano, o que significa uma linha com estado LISTENING e endereço local 0.0.0.0:3389?', options: ['A máquina está conectada a um servidor na porta 3389', 'A máquina aceita conexões de Área de Trabalho Remota em todas as interfaces', 'A porta 3389 está bloqueada', 'Nenhum programa usa a porta 3389'], answer: 1, explain: 'LISTENING é "esperando conexão"; 0.0.0.0 significa "em todas as interfaces". A 3389 é o RDP, que não deveria estar aberto numa estação comum.' },
        { type: 'fill', q: 'No Windows, o comando ___ /s /i "texto" *.txt procura um texto dentro dos arquivos, inclusive nas subpastas.', answer: ['findstr'], explain: 'findstr é o equivalente do grep; /s entra nas subpastas e /i ignora maiúsculas e minúsculas.' },
        { type: 'tf', q: 'O PID mostrado pelo netstat -ano permite descobrir, com tasklist, qual programa é dono de cada conexão.', answer: true, explain: 'O PID identifica o processo; cruzar netstat e tasklist é o que dá nome à conexão suspeita.' },
        { type: 'mc', q: 'Um "suporte" manda por WhatsApp um comando para você colar no PowerShell "para corrigir o certificado". O que fazer?', options: ['Colar como administrador para garantir que funcione', 'Colar em uma conta padrão para limitar o risco', 'Não executar: comandos recebidos por mensagem são a forma clássica de instalar programas maliciosos', 'Colar no CMD em vez do PowerShell'], answer: 2, explain: 'A linha de comando faz exatamente o que se pede, inclusive baixar e instalar malware. Comandos de "suporte" por mensagem são golpe até prova em contrário.' },
        { type: 'mc', q: 'Na saída do dir, o que indica a letra "d" no início da coluna Mode?', options: ['Arquivo danificado', 'Pasta (diretório)', 'Arquivo oculto', 'Arquivo de dados'], answer: 1, explain: 'O "d" de directory marca pastas; o "a" marca arquivos comuns.' },
        {
          type: 'code',
          q: 'Escreva a função `portas_escutando(linhas)` que recebe uma lista de linhas no formato do `netstat -ano` e devolve uma lista ordenada, sem repetição, com os números (int) das portas locais cujo estado é LISTENING. O endereço local é o segundo campo da linha e a porta vem depois do último dois-pontos.',
          starter: `def portas_escutando(linhas):
    pass
`,
          tests: `linhas = [
    "  TCP    0.0.0.0:135            0.0.0.0:0              LISTENING       1032",
    "  TCP    0.0.0.0:3389           0.0.0.0:0              LISTENING       1288",
    "  TCP    192.168.0.15:52114     142.250.79.46:443      ESTABLISHED     5820",
    "  TCP    [::]:445               [::]:0                 LISTENING       4",
    "  TCP    0.0.0.0:135            0.0.0.0:0              LISTENING       1032",
]
assert portas_escutando(linhas) == [135, 445, 3389], "Esperado [135, 445, 3389]: só LISTENING, sem repetição, em ordem crescente"
assert portas_escutando([]) == [], "Lista vazia deve devolver lista vazia"
assert portas_escutando(["  TCP    10.0.0.2:5000   10.0.0.9:443   ESTABLISHED  77"]) == [], "Linha ESTABLISHED não deve entrar"
assert all(isinstance(p, int) for p in portas_escutando(linhas)), "As portas devem ser inteiros (int)"
`,
          solution: `def portas_escutando(linhas):
    portas = set()
    for linha in linhas:
        partes = linha.split()
        if "LISTENING" in partes:
            local = partes[1]
            porta = int(local.rsplit(":", 1)[1])
            portas.add(porta)
    return sorted(portas)
`,
          hint: 'Use linha.split() para separar os campos; o endereço local é partes[1]. Para pegar só o que vem depois do último dois-pontos, use rsplit(":", 1)[1]. Um set elimina repetições e sorted() ordena.',
          explain: 'O exercício reproduz a leitura do netstat: filtrar o estado, isolar a porta do endereço local e organizar o resultado, que é o que se faz ao auditar portas abertas.',
        },
      ],
    },
    {
      id: 'cs-02-03',
      title: 'Redes e TCP/IP',
      minutes: 28,
      content: 'content/ciberseguranca/cs-02/03-redes-e-tcp-ip.md',
      exercises: [
        { type: 'mc', q: 'Qual destes endereços IPv4 é público (existe na internet)?', options: ['192.168.0.15', '10.20.30.40', '172.20.1.1', '200.199.45.9'], answer: 3, explain: 'Os intervalos 10.x, 172.16 a 172.31 e 192.168.x são privados. 200.199.45.9 está fora deles, portanto é público.' },
        { type: 'fill', q: 'O dispositivo para onde a máquina envia pacotes destinados a fora da rede local chama-se ___ padrão.', answer: ['gateway', 'Gateway'], explain: 'O gateway padrão (o roteador) é a saída da rede local, como a agência dos Correios do bairro.' },
        { type: 'match', q: 'Relacione a porta ao serviço.', pairs: [['443', 'HTTPS'], ['3389', 'Área de Trabalho Remota (RDP)'], ['53', 'DNS'], ['445', 'Compartilhamento de arquivos do Windows (SMB)']], explain: 'Portas baixas são padronizadas; 3389 e 445 abertas para a internet são os alvos preferidos de varreduras automáticas.' },
        { type: 'tf', q: 'O NAT impede que alguém da internet inicie uma conexão direta com um endereço privado da rede do escritório.', answer: true, explain: 'Endereços privados não existem na internet; o roteador só traduz respostas a conexões iniciadas de dentro. É um firewall acidental, anulado por encaminhamento de portas.' },
        { type: 'mc', q: 'Qual é a diferença essencial entre TCP e UDP?', options: ['TCP é para Wi-Fi e UDP para cabo', 'TCP confirma e reenvia pacotes perdidos; UDP envia sem confirmar', 'UDP é criptografado e TCP não', 'TCP só funciona com IPv6'], answer: 1, explain: 'TCP é o envelope registrado (aperto de mão, numeração, reenvio); UDP é o cartão-postal, mais rápido e sem garantia, usado em DNS, voz e vídeo.' },
        { type: 'order', q: 'Ordene as camadas do modelo de rede da lição, da mais próxima do usuário (conteúdo) até a física.', items: ['Aplicação (HTTP, SMTP, DNS)', 'Transporte (TCP, UDP, portas)', 'Rede/Internet (IP, roteadores)', 'Enlace e física (cabo, Wi-Fi, MAC)'], explain: 'Cada camada embrulha a de cima: dados de aplicação vão dentro de TCP, que vai dentro de IP, que vai dentro de um quadro Ethernet ou Wi-Fi.' },
        {
          type: 'code',
          q: 'Escreva a função `ip_valido(texto)` que devolve True se o texto é um endereço IPv4 válido (quatro partes separadas por ponto, cada uma formada só por dígitos e com valor entre 0 e 255) e False caso contrário.',
          starter: `def ip_valido(texto):
    pass
`,
          tests: `assert ip_valido("192.168.0.1") is True, "192.168.0.1 é válido"
assert ip_valido("8.8.8.8") is True, "8.8.8.8 é válido"
assert ip_valido("0.0.0.0") is True, "0.0.0.0 é válido"
assert ip_valido("256.1.1.1") is False, "256 passa de 255"
assert ip_valido("10.0.0") is False, "Só tem três partes"
assert ip_valido("1.2.3.4.5") is False, "Tem cinco partes"
assert ip_valido("a.b.c.d") is False, "Letras não são permitidas"
assert ip_valido("192.168.-1.1") is False, "Número negativo não é permitido"
assert ip_valido("") is False, "Texto vazio não é IP"
`,
          solution: `def ip_valido(texto):
    partes = texto.split(".")
    if len(partes) != 4:
        return False
    for parte in partes:
        if not parte.isdigit():
            return False
        if int(parte) > 255:
            return False
    return True
`,
          hint: 'Use texto.split(".") e confira se há exatamente 4 partes. Para cada parte, parte.isdigit() garante que só há dígitos (e rejeita vazio e sinal); depois compare int(parte) com 255.',
          explain: 'Validar o formato de um IP é o primeiro filtro de qualquer ferramenta que lê logs ou saídas de rede; isdigit() resolve letras, vazio e sinal de uma vez.',
        },
      ],
    },
    {
      id: 'cs-02-04',
      title: 'DNS, HTTP e HTTPS',
      minutes: 28,
      content: 'content/ciberseguranca/cs-02/04-dns-http-e-https.md',
      exercises: [
        { type: 'order', q: 'Ordene as etapas de uma consulta DNS quando o nome ainda não é conhecido.', items: ['Consultar o cache do próprio computador', 'Perguntar ao resolvedor configurado (provedor ou público)', 'O resolvedor pergunta aos servidores raiz e aos responsáveis por .br e gov.br', 'O servidor autoritativo do domínio responde com o IP'], explain: 'A busca vai do mais próximo (cache local) ao mais distante (servidor autoritativo), passando pelo resolvedor e pela hierarquia de domínios.' },
        { type: 'match', q: 'Relacione o código de status HTTP ao significado.', pairs: [['200', 'OK, deu certo'], ['301', 'Redirecionado'], ['401', 'Não autenticado'], ['404', 'Não encontrado'], ['500', 'Erro interno do servidor']], explain: 'A família 2xx é sucesso, 3xx redirecionamento, 4xx erro do cliente e 5xx erro do servidor.' },
        { type: 'mc', q: 'Um programa malicioso copiou o cookie de sessão do navegador do contador. O que o atacante consegue fazer?', options: ['Nada, porque a conta tem MFA', 'Entrar na conta sem senha e sem MFA, porque o login já foi feito', 'Apenas ver o histórico de navegação', 'Mudar a senha do Wi-Fi'], answer: 1, explain: 'O cookie de sessão é a prova de que a autenticação já aconteceu; com ele, o servidor reconhece o atacante como você. Logout invalida a sessão.' },
        { type: 'tf', q: 'Um certificado TLS válido garante que o site é honesto e pertence a quem diz pertencer.', answer: false, explain: 'O TLS garante que a conversa é cifrada e que o servidor controla o domínio digitado; um domínio parecido, como receita-federal-gov.net, pode ter certificado válido.' },
        { type: 'fill', q: 'O cabeçalho HTTP ___ diz ao servidor qual site se quer, já que um mesmo IP pode hospedar vários.', answer: ['Host', 'host', 'Host:'], explain: 'O cabeçalho Host identifica o domínio desejado; sem ele o servidor não sabe qual dos sites hospedados deve responder.' },
        { type: 'mc', q: 'Qual ponto de interceptação NÃO é resolvido pelo HTTPS?', options: ['Alguém no mesmo Wi-Fi capturando o tráfego', 'Um DNS falso que leva ao IP errado (o certificado não bate)', 'Uma extensão maliciosa do navegador lendo a página', 'O provedor lendo o conteúdo das páginas'], answer: 2, explain: 'A extensão age depois do TLS, com a página já decifrada. HTTPS protege o caminho na rede, não o que acontece dentro do navegador ou da máquina.' },
        {
          type: 'code',
          q: 'Escreva a função `contar_status(linhas)` que recebe linhas de um log web no formato combinado e devolve um dicionário com a contagem de cada código de status. O código de status é o primeiro número depois da linha do pedido, que fica entre aspas duplas.',
          starter: `def contar_status(linhas):
    pass
`,
          tests: `linhas = [
    '185.220.101.7 - - [12/May/2026:09:41:07 -0300] "GET /wp-login.php HTTP/1.1" 404 512 "-" "python-requests/2.31"',
    '185.220.101.7 - - [12/May/2026:09:41:08 -0300] "GET /admin HTTP/1.1" 404 512 "-" "python-requests/2.31"',
    '192.168.0.15 - - [12/May/2026:09:42:10 -0300] "GET /index.html HTTP/1.1" 200 18422 "https://www.google.com/" "Mozilla/5.0"',
    '192.168.0.15 - - [12/May/2026:09:42:11 -0300] "POST /login HTTP/1.1" 401 220 "-" "Mozilla/5.0"',
    '192.168.0.15 - - [12/May/2026:09:42:15 -0300] "GET /painel HTTP/1.1" 200 9001 "-" "Mozilla/5.0"',
]
r = contar_status(linhas)
assert r == {"404": 2, "200": 2, "401": 1}, "Esperado {'404': 2, '200': 2, '401': 1}"
assert contar_status([]) == {}, "Lista vazia deve devolver dicionário vazio"
assert contar_status([linhas[2]]) == {"200": 1}, "Uma linha com 200 deve devolver {'200': 1}"
`,
          solution: `def contar_status(linhas):
    contagem = {}
    for linha in linhas:
        depois_do_pedido = linha.split('"')[2]
        status = depois_do_pedido.split()[0]
        contagem[status] = contagem.get(status, 0) + 1
    return contagem
`,
          hint: "Divida a linha pelas aspas duplas com linha.split('\"'): o pedaço de índice 2 é o que vem logo depois do pedido, e o primeiro campo dele é o status. Use dicionario.get(chave, 0) + 1 para contar.",
          explain: 'Contar códigos de status é a análise mais básica de um log web: muitos 404 do mesmo IP indicam robô, muitos 401 indicam tentativa de senha.',
        },
      ],
    },
    {
      id: 'cs-02-05',
      title: 'Redes locais e Wi-Fi',
      minutes: 25,
      content: 'content/ciberseguranca/cs-02/05-redes-locais-e-wifi.md',
      exercises: [
        { type: 'fill', q: 'O protocolo que distribui automaticamente IP, máscara, gateway e DNS para os dispositivos que entram na rede é o ___.', answer: ['DHCP', 'dhcp'], explain: 'O DHCP é o recepcionista da rede: entrega a configuração por um tempo determinado (lease) e mantém a lista de quem está conectado.' },
        { type: 'mc', q: 'Qual padrão de segurança de Wi-Fi deve ser usado hoje?', options: ['WEP', 'WPA (original) com TKIP', 'WPA2-AES ou WPA3', 'Rede aberta com senha na recepção'], answer: 2, explain: 'WEP e WPA original são quebráveis em minutos; WPA2 com AES continua seguro com senha forte e WPA3 é o padrão atual.' },
        { type: 'tf', q: 'Quem tem a senha do Wi-Fi do escritório está na mesma rede que o servidor de arquivos, a menos que exista uma rede de visitantes.', answer: true, explain: 'WPA2/WPA3 cifram o tráfego, mas quem se conecta está dentro da rede. A rede de visitantes dá internet sem acesso aos computadores internos.' },
        { type: 'mc', q: 'Qual destas configurações do roteador deve ficar DESLIGADA?', options: ['Rede de visitantes', 'Firewall', 'Gerenciamento remoto pela internet (WAN)', 'Atualização de firmware'], answer: 2, explain: 'O acesso remoto pela internet expõe a página de administração do roteador ao mundo; WPS e UPnP também devem ficar desligados.' },
        { type: 'mc', q: 'Onde devem ficar impressoras, câmeras e a TV da sala de reunião?', options: ['Na mesma rede das estações, para facilitar a impressão', 'Na rede de visitantes ou numa VLAN própria, com senha padrão trocada', 'Conectadas diretamente à internet', 'Desligadas da rede'], answer: 1, explain: 'Dispositivos IoT raramente são atualizados e vêm com senha de fábrica; segregá-los limita o que um deles comprometido alcança.' },
        { type: 'match', q: 'Relacione o recurso do roteador à sua função.', pairs: [['NAT', 'Muitos endereços privados atrás de um público'], ['DHCP', 'Distribui endereços automaticamente'], ['VLAN', 'Divide logicamente a rede em partes isoladas'], ['WPS', 'Conexão por botão ou PIN, com falha conhecida']], explain: 'NAT e DHCP são funções essenciais; VLAN é segmentação; WPS é conveniência insegura que deve ser desligada.' },
        { type: 'order', q: 'Ordene o checklist da página do roteador como proposto na lição, do primeiro ao último item.', items: ['Trocar a senha de administração', 'Desligar acesso remoto e UPnP', 'Atualizar o firmware', 'Configurar o Wi-Fi em WPA2-AES/WPA3 com WPS desligado', 'Ativar a rede de visitantes', 'Conferir dispositivos conectados e encaminhamento de portas'], explain: 'A lição parte do acesso ao próprio roteador (senha, exposição, firmware), passa ao Wi-Fi e à segmentação e termina na auditoria de quem está na rede e das portas abertas.' },
      ],
    },
    {
      id: 'cs-02-06',
      title: 'E-mail por dentro',
      minutes: 28,
      content: 'content/ciberseguranca/cs-02/06-email-por-dentro.md',
      exercises: [
        { type: 'match', q: 'Relacione o mecanismo à pergunta que ele responde.', pairs: [['SPF', 'Este servidor pode enviar e-mail em nome deste domínio?'], ['DKIM', 'A mensagem foi alterada no caminho e saiu mesmo do domínio?'], ['DMARC', 'O que fazer quando SPF ou DKIM falham, e a quem avisar?'], ['MX', 'Qual servidor recebe o e-mail deste domínio?']], explain: 'SPF é a lista de remetentes autorizados, DKIM é a assinatura, DMARC é a política e o relatório; MX é o registro DNS de quem recebe.' },
        { type: 'mc', q: 'Por que é fácil falsificar o campo "De:" de um e-mail?', options: ['Porque o SMTP não verifica o remetente: o From é texto livre preenchido por quem envia', 'Porque os provedores permitem isso de propósito', 'Porque o DNS está sempre desatualizado', 'Porque o IMAP apaga o remetente verdadeiro'], answer: 0, explain: 'O SMTP de 1982 não autentica nada; a verificação vem dos registros SPF, DKIM e DMARC publicados no DNS do domínio.' },
        { type: 'tf', q: 'Um domínio com DMARC configurado em "p=none" está protegido contra falsificação.', answer: false, explain: 'A política none apenas pede relatórios; só quarantine e reject fazem os provedores recusar ou isolar mensagens falsas.' },
        { type: 'fill', q: 'A política DMARC de um domínio é publicada como registro TXT no subdomínio ___.escritorio.com.br (consultado com nslookup -type=TXT).', answer: ['_dmarc', '_DMARC'], explain: 'Por convenção, o registro DMARC fica no subdomínio _dmarc e define a política (none, quarantine, reject) e o endereço dos relatórios.' },
        { type: 'mc', q: 'Nos cabeçalhos de um e-mail, qual campo mostra de qual servidor a mensagem realmente saiu?', options: ['Subject', 'From', 'Received (o mais antigo, no fim da lista)', 'To'], answer: 2, explain: 'Cada servidor no caminho acrescenta um carimbo Received com IP e horário; o From é texto livre e pode dizer qualquer coisa.' },
        { type: 'mc', q: 'O que a linha "Authentication-Results: spf=fail; dkim=none; dmarc=fail" indica?', options: ['Que o servidor receptor está com defeito', 'Que a mensagem passou em todas as verificações', 'Que a mensagem não veio de um servidor autorizado pelo domínio do remetente', 'Que o destinatário não existe'], answer: 2, explain: 'O servidor receptor consultou SPF, DKIM e DMARC do domínio do From e nenhum confirmou a origem: forte indício de spoofing.' },
        {
          type: 'code',
          q: 'Escreva a função `dominio_do_remetente(cabecalho)` que recebe uma linha de cabeçalho From e devolve só o domínio do endereço, em minúsculas. O endereço pode vir entre < e > (com um nome antes) ou ser a última palavra da linha.',
          starter: `def dominio_do_remetente(cabecalho):
    pass
`,
          tests: `assert dominio_do_remetente('From: "Receita Federal" <atendimento@receita-federal-gov.net>') == "receita-federal-gov.net", "Deve pegar o domínio do endereço entre < >, não o nome exibido"
assert dominio_do_remetente("From: joao@escritorio.com.br") == "escritorio.com.br", "Sem < >, o endereço é a última palavra"
assert dominio_do_remetente("From: Maria <MARIA@Escritorio.COM.BR>") == "escritorio.com.br", "O domínio deve vir em minúsculas"
assert dominio_do_remetente("From: Socio <socio@escritorio.com.br.golpe.net>") == "escritorio.com.br.golpe.net", "Deve devolver o domínio inteiro, sem cortar"
`,
          solution: `def dominio_do_remetente(cabecalho):
    if "<" in cabecalho and ">" in cabecalho:
        inicio = cabecalho.index("<") + 1
        fim = cabecalho.index(">")
        endereco = cabecalho[inicio:fim]
    else:
        endereco = cabecalho.split()[-1]
    return endereco.split("@")[1].lower()
`,
          hint: 'Se houver "<" na linha, o endereço está entre cabecalho.index("<") + 1 e cabecalho.index(">"); senão, é cabecalho.split()[-1]. Depois separe por "@" e pegue a parte [1] em minúsculas com .lower().',
          explain: 'Extrair o domínio real do endereço, ignorando o nome exibido, é exatamente o que se faz ao analisar um e-mail suspeito e o que os filtros de spam fazem antes de consultar SPF e DMARC.',
        },
      ],
    },
    {
      id: 'cs-02-07',
      title: 'Logs e ferramentas de diagnóstico',
      minutes: 28,
      content: 'content/ciberseguranca/cs-02/07-logs-e-ferramentas-de-diagnostico.md',
      exercises: [
        { type: 'match', q: 'Relacione o ID de evento do Windows ao seu significado.', pairs: [['4624', 'Logon bem-sucedido'], ['4625', 'Falha de logon'], ['4720', 'Conta de usuário criada'], ['1102', 'Log de auditoria limpo']], explain: 'Esses quatro IDs do log de Segurança cobrem quem entrou, quem tentou e falhou, contas novas e apagamento de rastros.' },
        { type: 'mc', q: 'O log de Segurança mostra um evento 4624 com tipo de logon 10 às 3h da manhã na máquina do financeiro. O que isso significa?', options: ['Uma atualização automática do Windows', 'Alguém entrou por Área de Trabalho Remota fora do horário, o que exige investigação', 'Um erro de aplicativo', 'O usuário destravou a tela normalmente'], answer: 1, explain: 'Tipo 10 é logon via RDP. Um acesso remoto bem-sucedido de madrugada é um dos sinais mais claros de comprometimento.' },
        { type: 'fill', q: 'No Linux, o comando ___ -u ssh --since "1 hour ago" mostra os registros do serviço SSH da última hora.', answer: ['journalctl'], explain: 'journalctl consulta o diário do systemd; -u escolhe o serviço, --since o período e -f acompanha em tempo real.' },
        { type: 'tf', q: 'Com o tráfego em HTTPS, o Wireshark consegue mostrar o conteúdo das páginas e as senhas digitadas.', answer: false, explain: 'Em HTTPS o Wireshark vê o domínio de destino (no início do TLS) e o volume, mas o conteúdo está cifrado. Só em HTTP puro ele mostra tudo.' },
        { type: 'mc', q: 'Qual comando mostra cada roteador no caminho entre sua máquina e um destino?', options: ['ping', 'nslookup', 'tracert (ou traceroute)', 'netstat'], answer: 2, explain: 'tracert lista os saltos: o primeiro é o roteador do escritório, os seguintes são o provedor e o último é o destino.' },
        { type: 'mc', q: 'Considere a linha de log web: 185.220.101.7 - - [12/May/2026:09:41:07 -0300] "GET /wp-login.php HTTP/1.1" 404 512 "-" "python-requests/2.31". Quem fez o pedido e o que ele procurava?', options: ['Um usuário do Chrome acessando a página inicial', 'Um robô (python-requests) procurando a página de login do WordPress, que não existe (404)', 'O administrador fazendo backup', 'O Google indexando o site'], answer: 1, explain: 'O user-agent python-requests indica script automatizado; o caminho /wp-login.php é a página de login do WordPress; o 404 diz que ela não existe no site.' },
        {
          type: 'code',
          q: 'Escreva a função `ip_mais_frequente(linhas)` que recebe linhas de um log web (o IP de origem é o primeiro campo de cada linha) e devolve o IP que mais aparece.',
          starter: `def ip_mais_frequente(linhas):
    pass
`,
          tests: `linhas = [
    '185.220.101.7 - - [12/May/2026:09:41:07 -0300] "GET /wp-login.php HTTP/1.1" 404 512 "-" "python-requests/2.31"',
    '192.168.0.15 - - [12/May/2026:09:42:10 -0300] "GET /index.html HTTP/1.1" 200 18422 "-" "Mozilla/5.0"',
    '185.220.101.7 - - [12/May/2026:09:41:08 -0300] "GET /admin HTTP/1.1" 404 512 "-" "python-requests/2.31"',
    '200.1.2.3 - - [12/May/2026:09:43:00 -0300] "GET /contato HTTP/1.1" 200 3100 "-" "Mozilla/5.0"',
    '185.220.101.7 - - [12/May/2026:09:41:09 -0300] "GET /phpmyadmin HTTP/1.1" 404 512 "-" "python-requests/2.31"',
]
assert ip_mais_frequente(linhas) == "185.220.101.7", "O IP 185.220.101.7 aparece 3 vezes e deve ser o devolvido"
assert ip_mais_frequente([linhas[1]]) == "192.168.0.15", "Com uma linha só, devolva o IP dela"
assert ip_mais_frequente(linhas[1:4] + [linhas[3]]) == "200.1.2.3", "Com 200.1.2.3 repetido duas vezes, ele deve ser o devolvido"
`,
          solution: `def ip_mais_frequente(linhas):
    contagem = {}
    for linha in linhas:
        ip = linha.split()[0]
        contagem[ip] = contagem.get(ip, 0) + 1
    return max(contagem, key=contagem.get)
`,
          hint: 'Pegue o IP com linha.split()[0], conte num dicionário com .get(ip, 0) + 1 e, no fim, devolva max(contagem, key=contagem.get).',
          explain: 'Descobrir o IP mais ativo é o primeiro passo para identificar um robô ou um atacante num log web; a mesma técnica serve para tentativas de senha no auth.log.',
        },
      ],
    },
    {
      id: 'cs-02-08',
      title: 'Nuvem e virtualização básicas',
      minutes: 25,
      content: 'content/ciberseguranca/cs-02/08-nuvem-e-virtualizacao-basicas.md',
      exercises: [
        { type: 'match', q: 'Relacione o modelo de nuvem ao exemplo.', pairs: [['IaaS', 'Servidor Windows virtual na Azure, administrado por você'], ['PaaS', 'Banco de dados gerenciado pelo provedor'], ['SaaS', 'Google Workspace ou Microsoft 365']], explain: 'IaaS entrega máquinas, PaaS entrega a plataforma pronta e SaaS entrega o sistema inteiro; quanto mais à direita, menos você administra.' },
        { type: 'mc', q: 'Um funcionário sem MFA teve a senha roubada e um criminoso leu os e-mails do escritório no Microsoft 365. Pelo modelo de responsabilidade compartilhada, de quem é a responsabilidade?', options: ['Da Microsoft, que hospeda o serviço', 'Do escritório, que responde por contas, senhas e MFA', 'Do provedor de internet', 'De ninguém, porque foi crime'], answer: 1, explain: 'O provedor protege a nuvem (servidores, rede); o cliente protege o que está na nuvem: contas, MFA, permissões e compartilhamento.' },
        { type: 'tf', q: 'Dados guardados no Google Workspace ou no Microsoft 365 dispensam backup, porque o provedor garante que nunca serão perdidos.', answer: false, explain: 'O provedor garante disponibilidade dos servidores, não proteção contra apagamentos, erros e ransomware nos seus próprios arquivos. A regra 3-2-1 continua valendo.' },
        { type: 'fill', q: 'Uma foto do estado de uma máquina virtual, à qual se pode voltar em segundos, chama-se ___.', answer: ['snapshot', 'Snapshot', 'instantâneo'], explain: 'O snapshot permite experimentar e voltar ao estado "limpo"; é o que torna a VM ideal para laboratório.' },
        { type: 'mc', q: 'Qual modo de rede da VM deve ser usado ao abrir um arquivo suspeito no laboratório?', options: ['Bridge, na mesma rede do escritório', 'Host-only ou rede interna, sem internet e sem acesso à rede local', 'Qualquer um, porque a VM é sempre isolada', 'NAT, porque bloqueia tudo que a VM tenta enviar'], answer: 1, explain: 'Em modo bridge a VM vira mais um computador na rede do escritório; em NAT ela ainda alcança a rede local por meio do hospedeiro. Só host-only ou rede interna impedem que algo malicioso alcance as outras máquinas.' },
        { type: 'mc', q: 'Qual é a diferença entre máquina virtual e container?', options: ['Container simula um computador inteiro; VM só um programa', 'VM simula um computador inteiro com seu sistema; container empacota um programa isolado sobre o sistema do hospedeiro', 'São sinônimos', 'Container é sempre mais seguro que VM'], answer: 1, explain: 'A VM é um apartamento completo; o container é um quarto com chave dentro de um apartamento compartilhado: mais leve, menos isolado.' },
        { type: 'order', q: 'Ordene os passos de montagem do laboratório seguro em VM.', items: ['Instalar o VirtualBox ou ativar o Hyper-V', 'Criar uma VM com Ubuntu', 'Configurar a rede da VM (NAT no dia a dia, host-only para análises)', 'Tirar o snapshot "limpo" logo após instalar', 'Experimentar e, depois, voltar ao snapshot'], explain: 'Hipervisor, sistema, rede configurada, snapshot limpo e só então os experimentos: essa ordem garante que nada escape para a máquina de trabalho.' },
      ],
    },
  ],
  exam: {
    passScore: 70,
    questions: [
      { type: 'mc', q: 'Por que usar uma conta de administrador no dia a dia é perigoso?', options: ['Porque o Windows fica mais lento', 'Porque qualquer programa aberto por engano herda o poder de alterar o sistema inteiro', 'Porque a conta de administrador não recebe atualizações', 'Porque o antivírus não funciona em contas de administrador'], answer: 1, explain: 'O processo herda a identidade de quem o abriu; com conta padrão, o malware fica confinado e o UAC funciona como alarme.' },
      { type: 'fill', q: 'O número que identifica cada processo em execução, usado para cruzar tasklist com netstat, é o ___.', answer: ['PID', 'pid'], explain: 'O PID aparece nos dois comandos e é o que dá nome ao processo dono de uma conexão.' },
      { type: 'mc', q: 'No netstat -ano, o que significa o estado ESTABLISHED?', options: ['A porta está fechada', 'Há uma conexão ativa com o endereço externo mostrado', 'A máquina espera conexões naquela porta', 'O processo foi encerrado'], answer: 1, explain: 'ESTABLISHED é uma conversa em andamento; LISTENING é porta aberta esperando conexão.' },
      { type: 'tf', q: 'O endereço 172.20.5.9 é um endereço privado.', answer: true, explain: 'O intervalo 172.16.0.0 a 172.31.255.255 é reservado para redes internas; 172.20 está dentro dele.' },
      { type: 'match', q: 'Relacione a porta ao serviço.', pairs: [['80', 'HTTP'], ['443', 'HTTPS'], ['22', 'SSH'], ['3389', 'RDP']], explain: 'Portas baixas são padronizadas; conhecê-las permite ler netstat e logs com rapidez.' },
      { type: 'mc', q: 'O que o registro MX do DNS informa?', options: ['O IPv4 do site', 'O servidor que recebe o e-mail do domínio', 'A política DMARC', 'O apelido do domínio'], answer: 1, explain: 'A é IPv4, AAAA é IPv6, MX é o servidor de e-mail, TXT guarda SPF e DMARC, CNAME é apelido.' },
      { type: 'mc', q: 'Um site mostra o código 401 ao tentar abrir uma página. O que aconteceu?', options: ['A página não existe', 'O servidor teve erro interno', 'É preciso se autenticar (fazer login)', 'A página foi movida'], answer: 2, explain: '401 é não autenticado; 403 é proibido mesmo autenticado; 404 é não encontrado; 500 é erro do servidor.' },
      { type: 'tf', q: 'Fazer logout de um portal invalida a sessão no servidor; fechar a aba, não.', answer: true, explain: 'A sessão continua válida até expirar ou até o logout; um cookie roubado de uma sessão aberta dispensa senha e MFA.' },
      { type: 'mc', q: 'Qual medida separa os celulares de visitantes e os dispositivos IoT da rede interna do escritório?', options: ['Trocar a senha do Wi-Fi todo mês', 'Ativar a rede de visitantes (ou uma VLAN própria)', 'Usar WEP na rede principal', 'Ligar o WPS'], answer: 1, explain: 'A rede de visitantes dá acesso à internet sem enxergar os computadores internos; VLANs fazem o mesmo em redes maiores.' },
      { type: 'mc', q: 'Qual política DMARC faz os provedores recusarem mensagens falsas em nome do domínio?', options: ['p=none', 'p=quarantine', 'p=reject', 'p=report'], answer: 2, explain: 'reject recusa; quarantine manda para spam; none apenas observa e gera relatórios.' },
      { type: 'tf', q: 'Se o campo From de um e-mail mostra socio@escritorio.com.br, a mensagem certamente saiu do servidor do escritório.', answer: false, explain: 'O From é texto livre; o caminho real está nos cabeçalhos Received e no veredito Authentication-Results.' },
      { type: 'mc', q: 'Dezenas de eventos 4625 em sequência no log de Segurança, vindos do mesmo endereço, indicam o quê?', options: ['Atualização do Windows', 'Tentativa de adivinhar senha (força bruta)', 'Backup em andamento', 'Criação de contas'], answer: 1, explain: '4625 é falha de logon; muitos seguidos do mesmo endereço são um robô ou atacante testando senhas.' },
      { type: 'fill', q: 'O comando ___ gov.br 8.8.8.8 consulta o DNS público do Google para comparar com a resposta do resolvedor local.', answer: ['nslookup'], explain: 'Comparar o resolvedor padrão com um público ajuda a detectar DNS local comprometido.' },
      { type: 'mc', q: 'Pelo modelo de responsabilidade compartilhada, o que é responsabilidade do cliente num serviço SaaS como o Microsoft 365?', options: ['A energia do datacenter', 'A rede entre os servidores do provedor', 'Contas, MFA, permissões, compartilhamento e backup dos próprios dados', 'A atualização do hipervisor'], answer: 2, explain: 'O provedor cuida da nuvem; o cliente cuida do que está na nuvem, e é ali que a maioria dos incidentes acontece.' },
      {
        type: 'code',
        q: 'Escreva a função `ip_privado(ip)` que devolve True se o endereço IPv4 (já válido) pertence a um intervalo privado (10.0.0.0/8, 172.16.0.0 a 172.31.255.255 ou 192.168.0.0/16) e False caso contrário.',
        starter: `def ip_privado(ip):
    pass
`,
        tests: `assert ip_privado("10.1.2.3") is True, "10.x.x.x é privado"
assert ip_privado("172.16.0.1") is True, "172.16.x.x é privado"
assert ip_privado("172.31.255.255") is True, "172.31.x.x é privado"
assert ip_privado("172.32.0.1") is False, "172.32.x.x já é público"
assert ip_privado("172.15.0.1") is False, "172.15.x.x é público"
assert ip_privado("192.168.1.1") is True, "192.168.x.x é privado"
assert ip_privado("192.169.1.1") is False, "192.169.x.x é público"
assert ip_privado("8.8.8.8") is False, "8.8.8.8 é público"
`,
        solution: `def ip_privado(ip):
    partes = ip.split(".")
    a = int(partes[0])
    b = int(partes[1])
    if a == 10:
        return True
    if a == 172 and 16 <= b <= 31:
        return True
    if a == 192 and b == 168:
        return True
    return False
`,
        hint: 'Separe com ip.split(".") e converta os dois primeiros números com int(). Depois compare: a == 10; a == 172 e b entre 16 e 31; a == 192 e b == 168.',
        explain: 'Classificar um IP como privado ou público é o que se faz ao ler o netstat: endereço privado é a rede local, público é a internet.',
      },
    ],
  },
});
