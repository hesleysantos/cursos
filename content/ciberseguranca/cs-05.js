registerModule({
  course: 'ciberseguranca',
  id: 'cs-05',
  order: 5,
  level: 'Profissional',
  title: 'Defesa, detecção e resposta (Blue Team)',
  description: 'Você vai aprender a defender uma empresa em camadas: endurecer Windows, Linux e Active Directory, escolher firewall, IDS/IPS e EDR com critério, centralizar logs e detectar ataques com SIEM e MITRE ATT&CK, responder a incidentes pelo NIST SP 800-61 respeitando a LGPD, preservar evidências forenses, planejar continuidade com backups imutáveis e proteger nuvem, SaaS e aplicações. Ao final, saberá montar e operar a defesa de um escritório contábil.',
  hours: 5,
  lessons: [
    {
      id: 'cs-05-01',
      title: 'Defesa em profundidade e hardening',
      minutes: 28,
      content: 'content/ciberseguranca/cs-05/01-defesa-em-profundidade.md',
      exercises: [
        { type: 'mc', q: 'O que é a superfície de ataque de um computador?', options: ['A área física que o atacante precisa invadir', 'O conjunto de pontos por onde alguém pode tentar entrar: portas, serviços, contas, programas', 'A quantidade de antivírus instalados', 'O número de usuários cadastrados no domínio'], answer: 1, explain: 'Cada serviço, porta, conta ou programa é um ponto potencial de entrada; por isso desligar o que não se usa reduz a superfície de ataque.' },
        { type: 'tf', q: 'O SMBv1 deve permanecer ativado nas estações Windows para garantir compatibilidade com impressoras antigas.', answer: false, explain: 'O SMBv1 é a versão dos anos 1980 do protocolo de compartilhamento, explorada pelo WannaCry; deve ser desativado, e as poucas exceções tratadas caso a caso, não mantendo o protocolo em todas as máquinas.' },
        { type: 'fill', q: 'No arquivo de configuração do SSH, para impedir o login direto do root usa-se PermitRootLogin ___.', answer: ['no'], explain: 'Com PermitRootLogin no, a administração passa a ser feita com conta nominal e sudo, e o log registra quem fez cada ação.' },
        { type: 'match', q: 'Relacione a camada de defesa a um controle típico dela.', pairs: [['Perímetro', 'firewall de borda e VPN'], ['Host', 'EDR e disco criptografado'], ['Dados', 'backup off-line'], ['Pessoas', 'treinamento contra phishing']], explain: 'Defesa em profundidade combina camadas independentes: a falha de uma (a pessoa que clicou) é compensada por outra (o EDR, o backup).' },
        { type: 'mc', q: 'Qual a diferença entre o Nível 1 e o Nível 2 de um CIS Benchmark?', options: ['Nível 1 é pago e Nível 2 é gratuito', 'Nível 1 cobre Windows e Nível 2 cobre Linux', 'Nível 1 traz configurações que quase não atrapalham o uso; Nível 2 é mais restritivo, para ambientes sensíveis', 'Nível 1 é para servidores e Nível 2 para estações'], answer: 2, explain: 'Os benchmarks são gratuitos para qualquer sistema; os níveis diferem na restrição: o Nível 1 é o ponto de partida seguro para uma pequena empresa.' },
        { type: 'order', q: 'Coloque em ordem o roteiro correto para aplicar um baseline de hardening no escritório.', items: ['Baixar o CIS Benchmark do sistema', 'Aplicar o Nível 1 em uma máquina de teste', 'Corrigir o que quebrou (impressora, sistema legado)', 'Aplicar nas demais estações', 'Documentar o que foi feito, por máquina, com data'], explain: 'Testar em uma máquina antes evita quebrar o escritório inteiro; documentar no fim gera a evidência de diligência.' },
        { type: 'tf', q: 'O LAPS, da Microsoft, atribui uma senha de administrador local diferente e rotacionada para cada máquina do domínio.', answer: true, explain: 'Sem o LAPS, uma única senha de administrador local vazada abre todas as máquinas; com ele, cada máquina tem a sua, trocada automaticamente.' },
        { type: 'mc', q: 'Um escritório mantém o RDP do servidor aberto na internet para o contador acessar de casa. Qual a melhor medida?', options: ['Trocar a senha por uma mais forte e manter aberto', 'Fechar a porta na internet e acessar por VPN, com NLA e MFA', 'Mudar a porta padrão do RDP para esconder o serviço', 'Instalar um segundo antivírus no servidor'], answer: 1, explain: 'RDP exposto é uma das principais portas de entrada de ransomware; senha forte ou porta alternativa não eliminam o risco, só a VPN fecha a porta.' },
      ],
    },
    {
      id: 'cs-05-02',
      title: 'Firewalls, IDS/IPS e EDR',
      minutes: 27,
      content: 'content/ciberseguranca/cs-05/02-firewalls-ids-edr.md',
      exercises: [
        { type: 'mc', q: 'O que significa a política "deny by default" em um firewall?', options: ['Bloquear apenas os endereços que já causaram problema', 'Bloquear tudo e liberar somente o que foi explicitamente permitido', 'Permitir tudo na rede interna e bloquear a internet', 'Negar acesso aos usuários que erraram a senha'], answer: 1, explain: 'Negar por padrão garante que o que ninguém lembrou de bloquear continue bloqueado; a alternativa (permitir tudo e bloquear o que lembrar) sempre deixa buracos.' },
        { type: 'tf', q: 'Um IDS bloqueia ativamente o tráfego malicioso que detecta.', answer: false, explain: 'O IDS (detecção) apenas alerta, como uma câmera; quem bloqueia é o IPS (prevenção), como o segurança.' },
        { type: 'match', q: 'Relacione cada ferramenta ao que ela observa.', pairs: [['Antivírus tradicional', 'assinaturas de malware conhecido'], ['EDR', 'comportamento dos processos no endpoint'], ['XDR', 'correlação de endpoint, e-mail, identidade e nuvem'], ['Filtro de DNS', 'domínios consultados antes da conexão']], explain: 'Cada camada enxerga um ângulo: assinatura, comportamento, correlação entre domínios e resolução de nomes.' },
        { type: 'fill', q: 'Snort e ___ são os dois IDS/IPS gratuitos e de código aberto mais conhecidos.', answer: ['Suricata'], explain: 'Ambos usam regras mantidas pela comunidade e estão disponíveis em firewalls como OPNsense (integrado) e pfSense (pacote).' },
        { type: 'mc', q: 'Um escritório contábil de 12 pessoas, sem equipe de TI, precisa escolher onde investir primeiro. Qual a prioridade mais sensata?', options: ['Um NGFW de alto desempenho', 'Um IDS/IPS com regras completas', 'EDR gerenciado por um prestador, firewall bem configurado e filtro de DNS', 'Um segundo roteador para redundância'], answer: 2, explain: 'O ataque chega por e-mail, no endpoint; EDR gerenciado, deny by default e filtro de DNS protegem mais por real gasto do que NGFW ou IDS sem alguém para olhar os alertas.' },
        { type: 'tf', q: 'Se a rede tem um bom firewall de borda, o firewall de host das estações pode ficar desligado.', answer: false, explain: 'O firewall de borda não vê um notebook infectado atacando a impressora na mesma rede; o firewall de host protege cada máquina inclusive dos vizinhos.' },
        { type: 'order', q: 'Ordene a sequência de ações de um EDR diante de uma macro maliciosa, conforme descrito na lição.', items: ['Detecta a cadeia suspeita (Word abre PowerShell que baixa algo da internet)', 'Mata o processo malicioso', 'Isola a máquina da rede', 'Guarda a linha do tempo para a investigação'], explain: 'O EDR primeiro reconhece o comportamento, depois interrompe, contém a máquina e preserva o histórico para a análise.' },
        { type: 'mc', q: 'Qual destas opções é um filtro de DNS gratuito que bloqueia domínios maliciosos para toda a rede ao ser configurado no roteador?', options: ['Quad9 (9.9.9.9)', 'Suricata', 'Microsoft Defender for Endpoint', 'pfSense'], answer: 0, explain: 'Quad9 é um resolvedor DNS público e gratuito com bloqueio de domínios maliciosos; Suricata é IDS/IPS, Defender for Endpoint é EDR e pfSense é firewall.' },
      ],
    },
    {
      id: 'cs-05-03',
      title: 'Logs e SIEM',
      minutes: 27,
      content: 'content/ciberseguranca/cs-05/03-logs-e-siem.md',
      exercises: [
        { type: 'mc', q: 'Quais são os quatro elementos mínimos de uma linha de log útil?', options: ['Quando, onde, quem e o quê', 'Nome do arquivo, tamanho, dono e permissões', 'IP, porta, protocolo e assinatura', 'Data, versão do sistema, licença e fabricante'], answer: 0, explain: 'Sem data/hora, máquina, usuário/IP e ação com resultado, a linha não permite reconstruir o que aconteceu.' },
        { type: 'tf', q: 'Para economizar espaço, é melhor guardar os logs apenas na máquina que os gerou.', answer: false, explain: 'O atacante apaga o log local como primeiro passo (evento 1102 no Windows); centralizar garante que a cópia sobreviva e que alguém a veja.' },
        { type: 'fill', q: 'O ___ é um SIEM gratuito e de código aberto que inclui agente para Windows e Linux e verificação de CIS Benchmarks.', answer: ['Wazuh'], explain: 'Wazuh é a opção realista para pequenas empresas com pouco orçamento; Splunk e Sentinel são comerciais.' },
        { type: 'match', q: 'Relacione o padrão observado no SIEM ao que ele indica.', pairs: [['20 eventos 4625 do mesmo IP seguidos de um 4624', 'força bruta bem-sucedida'], ['Login em São Paulo e, 20 minutos depois, em outro país', 'viagem impossível (credencial roubada)'], ['Regra de encaminhamento de e-mail para domínio externo criada após login de IP novo', 'conta comprometida (golpe do boleto)'], ['Processo vssadmin delete shadows em uma estação', 'ransomware apagando cópias de sombra']], explain: 'A correlação cruza fontes e tempo; cada padrão corresponde a uma técnica conhecida de ataque.' },
        { type: 'mc', q: 'O SIEM do escritório gera 300 alertas por dia e ninguém mais olha. Qual a resposta correta a esse problema?', options: ['Desligar o SIEM, já que não funciona', 'Calibrar limiares, documentar exceções, priorizar por gravidade e dar um dono a cada alerta', 'Aumentar o número de regras para pegar mais ataques', 'Encaminhar todos os alertas para o celular do sócio'], answer: 1, explain: 'Fadiga de alertas se resolve com calibração e priorização, não com mais regras nem com o abandono da ferramenta.' },
        {
          type: 'code',
          q: 'Escreva a função ips_suspeitos(log, limite) que recebe o texto de um log do SSH e devolve a lista dos IPs com pelo menos `limite` linhas contendo "Failed password", ordenada do IP com mais falhas para o com menos. O IP é o que vem após a palavra "from".',
          starter: `import re
from collections import Counter

def ips_suspeitos(log, limite):
    pass
`,
          tests: `log = """Mar 14 09:21:07 srv01 sshd[2231]: Failed password for root from 203.0.113.45 port 51234 ssh2
Mar 14 09:21:09 srv01 sshd[2231]: Failed password for root from 203.0.113.45 port 51240 ssh2
Mar 14 09:21:12 srv01 sshd[2231]: Failed password for admin from 203.0.113.45 port 51251 ssh2
Mar 14 09:22:01 srv01 sshd[2240]: Failed password for ana from 198.51.100.7 port 40001 ssh2
Mar 14 09:22:05 srv01 sshd[2240]: Failed password for ana from 198.51.100.7 port 40002 ssh2
Mar 14 09:25:40 srv01 sshd[2290]: Accepted publickey for ana from 10.0.0.12 port 60122 ssh2
Mar 14 09:31:02 srv01 sshd[2301]: Failed password for ana from 10.0.0.12 port 60130 ssh2
"""
assert ips_suspeitos(log, 3) == ["203.0.113.45"], "com limite 3 só o IP 203.0.113.45 tem 3 falhas"
assert ips_suspeitos(log, 2) == ["203.0.113.45", "198.51.100.7"], "com limite 2, dois IPs, o de mais falhas primeiro"
assert ips_suspeitos(log, 1) == ["203.0.113.45", "198.51.100.7", "10.0.0.12"], "com limite 1 entram os três IPs com falha"
assert ips_suspeitos(log, 10) == [], "nenhum IP tem 10 falhas"
assert ips_suspeitos("", 1) == [], "log vazio devolve lista vazia"
`,
          solution: `import re
from collections import Counter

def ips_suspeitos(log, limite):
    padrao = re.compile(r"Failed password for \\S+ from (\\d+\\.\\d+\\.\\d+\\.\\d+)")
    contador = Counter()
    for linha in log.splitlines():
        m = padrao.search(linha)
        if m:
            contador[m.group(1)] += 1
    return [ip for ip, n in contador.most_common() if n >= limite]
`,
          hint: 'Percorra as linhas, capture o IP das que têm "Failed password" com uma expressão regular, conte com Counter e filtre most_common() pelo limite.',
          explain: 'É a lógica de uma regra de SIEM: extrair o campo (IP), agregar (contar) e aplicar um limiar; most_common() já devolve em ordem decrescente.',
        },
        { type: 'tf', q: 'Relógios dessincronizados entre as máquinas (sem NTP) tornam a correlação de eventos por tempo praticamente impossível.', answer: true, explain: 'Correlacionar "20 falhas seguidas de um sucesso" exige que as horas de todas as fontes batam; NTP é pré-requisito do SIEM.' },
      ],
    },
    {
      id: 'cs-05-04',
      title: 'Detecção com MITRE ATT&CK',
      minutes: 30,
      content: 'content/ciberseguranca/cs-05/04-mitre-attack-e-deteccao.md',
      exercises: [
        { type: 'mc', q: 'No MITRE ATT&CK, qual a diferença entre tática e técnica?', options: ['Tática é o objetivo de uma etapa do ataque; técnica é o método usado para alcançá-lo', 'Tática é o ataque em Windows; técnica é o ataque em Linux', 'Tática é o que o defensor faz; técnica é o que o atacante faz', 'Não há diferença, são sinônimos'], answer: 0, explain: 'A matriz organiza 14 táticas (objetivos, como Persistência) e centenas de técnicas (métodos, como Tarefa Agendada).' },
        { type: 'match', q: 'Relacione o ID de evento do log de Segurança do Windows ao seu significado.', pairs: [['4625', 'logon falhou'], ['4688', 'novo processo criado'], ['4720', 'conta de usuário criada'], ['1102', 'log de auditoria apagado'], ['4698', 'tarefa agendada criada']], explain: 'Esses IDs são os mais consultados em investigações: força bruta (4625), execução (4688), porta dos fundos (4720), ocultação (1102) e persistência (4698).' },
        { type: 'fill', q: 'A técnica T1566 do ATT&CK corresponde a ___.', answer: ['phishing', 'Phishing'], explain: 'T1566 (Phishing) é a técnica de acesso inicial mais comum contra pequenas empresas; suas subtécnicas incluem anexo e link maliciosos.' },
        { type: 'tf', q: 'O hash de um arquivo malicioso é um indicador de comprometimento fácil de trocar, por isso fica na base da Pirâmide da Dor.', answer: true, explain: 'Basta recompilar o malware para o hash mudar; já táticas, técnicas e procedimentos (TTPs), no topo da pirâmide, custam caro para o atacante alterar.' },
        { type: 'mc', q: 'Qual evento do Sysmon mostra o processo pai, permitindo detectar "Word abrindo PowerShell"?', options: ['Event 22 (consulta DNS)', 'Event 3 (conexão de rede)', 'Event 1 (criação de processo)', 'Event 13 (registro alterado)'], answer: 2, explain: 'O Event 1 do Sysmon registra criação de processo com hash, linha de comando e processo pai; a relação pai-filho é o que denuncia a macro maliciosa.' },
        { type: 'order', q: 'Ordene as etapas do ataque mapeado no ATT&CK, do acesso inicial ao impacto.', items: ['Phishing com anexo (Initial Access)', 'Macro executa PowerShell (Execution)', 'Tarefa agendada criada (Persistence)', 'Senhas do navegador extraídas (Credential Access)', 'Conexão RDP ao servidor (Lateral Movement)', 'Dados copiados para a nuvem (Exfiltration)', 'Arquivos criptografados (Impact)'], explain: 'As táticas seguem a progressão típica do ataque: entrar, executar, persistir, roubar credenciais, mover-se, exfiltrar e causar impacto.' },
        {
          type: 'code',
          q: 'Alertas do SIEM chegam em JSON: uma lista de eventos com os campos "host", "event_id" e "user". Escreva a função forca_bruta(json_texto, limite) que devolve a lista ordenada alfabeticamente dos hosts com pelo menos `limite` eventos 4625 (logon falhou).',
          starter: `import json

def forca_bruta(json_texto, limite):
    pass
`,
          tests: `dados = json.dumps([
    {"host": "PC-FISCAL", "event_id": 4625, "user": "ana"},
    {"host": "PC-FISCAL", "event_id": 4625, "user": "ana"},
    {"host": "PC-FISCAL", "event_id": 4625, "user": "admin"},
    {"host": "PC-FISCAL", "event_id": 4624, "user": "ana"},
    {"host": "SRV-ARQ", "event_id": 4625, "user": "root"},
    {"host": "SRV-ARQ", "event_id": 4625, "user": "root"},
    {"host": "SRV-ARQ", "event_id": 4625, "user": "root"},
    {"host": "SRV-ARQ", "event_id": 4625, "user": "root"},
    {"host": "PC-RH", "event_id": 4688, "user": "bia"},
    {"host": "PC-RH", "event_id": 4625, "user": "bia"},
])
assert forca_bruta(dados, 3) == ["PC-FISCAL", "SRV-ARQ"], "PC-FISCAL (3) e SRV-ARQ (4) atingem o limite 3, em ordem alfabética"
assert forca_bruta(dados, 4) == ["SRV-ARQ"], "só SRV-ARQ tem 4 falhas"
assert forca_bruta(dados, 1) == ["PC-FISCAL", "PC-RH", "SRV-ARQ"], "com limite 1 entram os três hosts com algum 4625"
assert forca_bruta("[]", 1) == [], "lista vazia devolve lista vazia"
assert forca_bruta(dados, 100) == [], "nenhum host chega a 100"
`,
          solution: `import json

def forca_bruta(json_texto, limite):
    eventos = json.loads(json_texto)
    contagem = {}
    for ev in eventos:
        if ev.get("event_id") == 4625:
            contagem[ev["host"]] = contagem.get(ev["host"], 0) + 1
    return sorted(h for h, n in contagem.items() if n >= limite)
`,
          hint: 'json.loads transforma o texto em lista de dicionários; conte só os eventos com event_id igual a 4625, por host, e filtre pelo limite.',
          explain: 'Parse de JSON, filtro por ID de evento e agregação por host é o trabalho básico de qualquer regra de detecção de força bruta.',
        },
        { type: 'mc', q: 'O que é threat hunting?', options: ['Esperar o alerta do SIEM e investigá-lo', 'Procurar ativamente, a partir de uma hipótese baseada no ATT&CK, sinais de que algo já está dentro, sem esperar o alerta', 'Bloquear IPs de listas públicas de ameaças', 'Contratar hackers para atacar a empresa'], answer: 1, explain: 'A caça parte de uma hipótese ("se usaram T1053, haveria tarefas agendadas estranhas") e consulta os dados; o resultado costuma ser uma regra de detecção nova.' },
      ],
    },
    {
      id: 'cs-05-05',
      title: 'Resposta a incidentes (NIST SP 800-61)',
      minutes: 27,
      content: 'content/ciberseguranca/cs-05/05-resposta-a-incidentes.md',
      exercises: [
        { type: 'order', q: 'Coloque em ordem as etapas do tratamento de um incidente segundo o NIST SP 800-61, com a terceira fase desdobrada em seus três passos.', items: ['Preparação', 'Detecção e análise', 'Contenção', 'Erradicação', 'Recuperação', 'Lições aprendidas'], explain: 'A Revisão 2 agrupa contenção, erradicação e recuperação em uma única fase; dentro dela, a sequência é parar o sangramento, remover a causa e voltar ao normal; depois vem a atividade pós-incidente (lições aprendidas).' },
        { type: 'mc', q: 'Uma estação mostra arquivos com extensão .lockbit e uma nota de resgate. Qual a primeira ação correta?', options: ['Desligar a máquina imediatamente', 'Formatar e reinstalar o Windows', 'Isolar a máquina da rede sem desligá-la', 'Conectar o HD de backup para restaurar os arquivos'], answer: 2, explain: 'Isolar impede a propagação e preserva a memória (evidências e possivelmente chaves); desligar perde a memória e conectar o backup o expõe ao ransomware.' },
        { type: 'tf', q: 'Pela Resolução CD/ANPD nº 15/2024, o controlador deve comunicar à ANPD um incidente com risco relevante aos titulares em 3 dias úteis a partir do conhecimento.', answer: true, explain: 'A resolução regulamentou o art. 48 da LGPD fixando o prazo de 3 dias úteis, por formulário próprio, com possibilidade de complementação.' },
        { type: 'fill', q: 'O artigo ___ da LGPD obriga o controlador a comunicar à ANPD e ao titular incidentes de segurança que possam acarretar risco ou dano relevante.', answer: ['48'], explain: 'O art. 48 é a base legal da comunicação de incidentes; a Resolução 15/2024 detalhou prazo e conteúdo.' },
        { type: 'mc', q: 'Após redefinir a senha de uma conta de e-mail invadida, qual verificação é indispensável no playbook de conta comprometida?', options: ['Trocar o papel de parede do computador', 'Procurar e remover regras de encaminhamento e de exclusão criadas na caixa', 'Reinstalar o navegador', 'Desativar o MFA para evitar bloqueios'], answer: 1, explain: 'Atacantes criam regras para desviar ou apagar e-mails (base do golpe do boleto); elas sobrevivem à troca de senha se não forem removidas.' },
        { type: 'match', q: 'Relacione cada situação ao passo essencial do playbook correspondente.', pairs: [['Funcionária digitou a senha em página falsa', 'trocar a senha e revogar as sessões ativas'], ['Ransomware no servidor', 'verificar se o backup está íntegro e desconectado'], ['Login suspeito e e-mails enviados sem o dono saber', 'revisar o log de auditoria e avisar contatos que receberam mensagens falsas'], ['Incidente encerrado', 'reunião de lições aprendidas em até duas semanas']], explain: 'Cada playbook tem um passo que, se pulado, anula o resto: a sessão ativa, o backup contaminado, o contato enganado, a repetição do incidente.' },
        { type: 'tf', q: 'Pagar o resgate do ransomware garante a recuperação dos dados e evita o vazamento.', answer: false, explain: 'Não há garantia de decifrador funcional nem de que os dados exfiltrados não serão divulgados; pagar ainda financia o crime.' },
        { type: 'write', q: 'Escreva um playbook de cinco passos para a situação: "um funcionário recebeu uma ligação de alguém dizendo ser do suporte da Microsoft e instalou um programa de acesso remoto no computador do escritório".', model: '1. Isolar o computador da rede (cabo/Wi-Fi), sem desligar. 2. Não usar a máquina; chamar o prestador e acionar o EDR. 3. Trocar as senhas usadas naquela máquina e revogar sessões (e-mail, sistema contábil, bancos). 4. Verificar no log de auditoria e no EDR o que o programa acessou; avaliar se dados pessoais foram expostos (decisão sobre ANPD em 3 dias úteis). 5. Registrar horários e ações; reinstalar a máquina; reforçar treinamento sobre golpes de suporte falso.', checklist: ['Contém a contenção (isolar sem desligar) como primeiro passo?', 'Prevê troca de senhas e revogação de sessões?', 'Prevê análise do que foi acessado e a decisão sobre comunicação à ANPD?', 'Prevê registro das ações e lição aprendida?'] },
      ],
    },
    {
      id: 'cs-05-06',
      title: 'Forense básica e preservação de evidências',
      minutes: 27,
      content: 'content/ciberseguranca/cs-05/06-forense-basica.md',
      exercises: [
        { type: 'order', q: 'Ordene as evidências pela ordem de volatilidade da tabela da lição, da que some primeiro para a mais duradoura.', items: ['Memória RAM', 'Estado da rede (conexões abertas)', 'Processos em execução', 'Disco (arquivos e registro)', 'Logs remotos e backups', 'Mídia de arquivo guardada'], explain: 'A RFC 3227 manda coletar primeiro o que desaparece primeiro: memória e rede somem ao desligar; disco e mídias duram meses ou anos.' },
        { type: 'mc', q: 'Por que não se deve desligar um computador suspeito antes de a coleta começar?', options: ['Porque o Windows pode instalar atualizações', 'Porque a memória RAM, com processos, conexões e chaves de criptografia, se perde', 'Porque o disco pode ser danificado fisicamente', 'Porque o atacante seria avisado'], answer: 1, explain: 'A memória guarda o que estava em execução, inclusive conexões com o atacante e chaves do ransomware; isole da rede, mas mantenha ligado.' },
        { type: 'tf', q: 'MD5 continua adequado para provar a integridade de uma evidência forense.', answer: false, explain: 'MD5 e SHA-1 têm colisões conhecidas; use SHA-256 para que a prova de integridade não seja contestada.' },
        { type: 'fill', q: 'O documento que registra cada posse e transferência de uma evidência, com datas, nomes e assinaturas, é a cadeia de ___.', answer: ['custódia', 'custodia'], explain: 'A cadeia de custódia prova que a evidência esteve sempre sob controle; qualquer lacuna enfraquece a prova.' },
        {
          type: 'code',
          q: 'Escreva duas funções: sha256_de_arquivo(caminho), que devolve o hash SHA-256 (hexadecimal) do conteúdo do arquivo lendo em blocos, e integridade_ok(caminho, hash_esperado), que devolve True se o hash calculado for igual ao esperado (ignorando maiúsculas) e False caso contrário.',
          starter: `import hashlib

def sha256_de_arquivo(caminho):
    pass

def integridade_ok(caminho, hash_esperado):
    pass
`,
          tests: `import tempfile, os, hashlib
caminho = os.path.join(tempfile.gettempdir(), "evidencia_teste.log")
conteudo = b"Mar 14 09:21:07 srv01 sshd: Failed password for root from 203.0.113.45\\n"
with open(caminho, "wb") as f:
    f.write(conteudo)
esperado = hashlib.sha256(conteudo).hexdigest()
assert sha256_de_arquivo(caminho) == esperado, "o hash deve ser o SHA-256 do conteudo do arquivo, em hexadecimal"
assert integridade_ok(caminho, esperado) is True, "hash igual deve devolver True"
assert integridade_ok(caminho, esperado.upper()) is True, "a comparacao deve ignorar maiusculas"
assert integridade_ok(caminho, "0" * 64) is False, "hash diferente deve devolver False"
with open(caminho, "ab") as f:
    f.write(b"x")
assert integridade_ok(caminho, esperado) is False, "arquivo alterado deve falhar na verificacao"
`,
          solution: `import hashlib

def sha256_de_arquivo(caminho):
    h = hashlib.sha256()
    with open(caminho, "rb") as f:
        for bloco in iter(lambda: f.read(65536), b""):
            h.update(bloco)
    return h.hexdigest()

def integridade_ok(caminho, hash_esperado):
    return sha256_de_arquivo(caminho).lower() == hash_esperado.lower()
`,
          hint: 'Abra em modo binário ("rb"), alimente hashlib.sha256() com blocos e use hexdigest(); na comparação, normalize os dois lados com lower().',
          explain: 'Ler em blocos permite calcular o hash de discos grandes sem carregar tudo na memória; a verificação prova que a evidência não mudou desde a coleta.',
        },
        { type: 'match', q: 'Relacione a ferramenta forense à sua função principal.', pairs: [['Autopsy', 'análise de imagens de disco e linha do tempo'], ['Velociraptor', 'coleta e caça em muitas máquinas ao mesmo tempo'], ['FTK Imager', 'criação de imagem de disco e captura de memória'], ['Wireshark', 'análise de capturas de rede']], explain: 'Cada ferramenta cobre uma etapa: adquirir (FTK Imager), analisar disco (Autopsy), coletar em escala (Velociraptor), analisar rede (Wireshark).' },
        { type: 'mc', q: 'Você é a primeira pessoa a chegar a um computador suspeito. Qual destas ações está CORRETA?', options: ['Rodar o antivírus para remover o malware', 'Abrir o histórico do navegador para ver o que aconteceu', 'Fotografar a tela, anotar a hora, isolar da rede e chamar quem vai coletar', 'Reiniciar para ver se o problema persiste'], answer: 2, explain: 'Qualquer clique altera datas de acesso e sobrescreve espaço livre; o antivírus apaga a evidência; reiniciar perde a memória. Registre, isole e chame o responsável.' },
      ],
    },
    {
      id: 'cs-05-07',
      title: 'Continuidade e recuperação',
      minutes: 27,
      content: 'content/ciberseguranca/cs-05/07-continuidade-e-recuperacao.md',
      exercises: [
        { type: 'mc', q: 'O que significa um RPO de 4 horas?', options: ['O sistema precisa voltar em até 4 horas', 'Aceita-se perder, no pior caso, 4 horas de dados; o backup deve ocorrer pelo menos a cada 4 horas', 'O backup leva 4 horas para ser feito', 'A empresa pode ficar 4 horas sem internet'], answer: 1, explain: 'RPO é o ponto de recuperação (quanto de dados se perde); RTO é o tempo para voltar. Confundir os dois leva a backups inadequados.' },
        { type: 'tf', q: 'Uma pasta sincronizada com OneDrive ou Google Drive é um backup adequado contra ransomware.', answer: false, explain: 'A sincronização envia a versão criptografada para a nuvem; backup é cópia separada, com retenção, que o usuário comum não consegue apagar.' },
        { type: 'fill', q: 'Na regra 3-2-1-1-0, o segundo "1" significa uma cópia ___ ou off-line, que o atacante não consegue apagar.', answer: ['imutável', 'imutavel'], explain: 'Ransomware moderno procura e apaga backups acessíveis pela rede; a cópia imutável (object lock) ou desconectada é a que sobrevive.' },
        { type: 'match', q: 'Relacione o conceito à sua definição.', pairs: [['BIA', 'impacto e tolerância de cada processo do negócio'], ['RTO', 'tempo máximo para o processo voltar'], ['RPO', 'quantidade de dados (em tempo) que se aceita perder'], ['BCP', 'como a empresa continua operando durante a crise'], ['DRP', 'como a tecnologia é recuperada']], explain: 'A BIA define prioridades; RTO e RPO definem o backup; o BCP cuida do negócio e o DRP, da tecnologia.' },
        { type: 'mc', q: 'Por que um backup em HD externo permanentemente conectado ao servidor não protege contra ransomware?', options: ['Porque HDs externos são lentos', 'Porque o ransomware criptografa tudo o que está acessível, inclusive o HD conectado', 'Porque o Windows não reconhece HDs externos como backup', 'Porque o HD precisa estar na nuvem para valer'], answer: 1, explain: 'Se o malware alcança o HD, criptografa o backup junto; a cópia off-line ou imutável é a que fica fora do alcance.' },
        { type: 'order', q: 'Ordene as etapas lógicas para definir e validar a estratégia de backup do escritório.', items: ['Fazer a BIA dos processos essenciais', 'Definir RTO e RPO de cada processo', 'Escolher a estratégia de backup que atende ao RPO', 'Testar a restauração e medir o tempo', 'Comparar o tempo medido com o RTO', 'Ajustar o plano onde não atende'], explain: 'A tecnologia vem depois do negócio: primeiro o impacto, depois as metas, depois a solução, e o teste é o que prova que a meta é cumprida.' },
        { type: 'tf', q: 'Testar a restauração trimestralmente, cronometrando, é a forma de descobrir o RTO real do escritório.', answer: true, explain: 'Backup nunca restaurado é esperança; o teste revela cópias corrompidas, senhas perdidas e o tempo real de recuperação.' },
        { type: 'mc', q: 'Qual norma internacional trata de gestão de continuidade de negócios?', options: ['ISO 22301', 'ISO 9001', 'ISO 14001', 'ISO 45001'], answer: 0, explain: 'A ISO 22301 é a norma de sistemas de gestão de continuidade de negócios; 9001 é qualidade, 14001 ambiental e 45001 segurança ocupacional.' },
      ],
    },
    {
      id: 'cs-05-08',
      title: 'Segurança em nuvem e SaaS',
      minutes: 28,
      content: 'content/ciberseguranca/cs-05/08-nuvem-e-saas.md',
      exercises: [
        { type: 'mc', q: 'No modelo de responsabilidade compartilhada, quem é responsável por contas, MFA e permissões de compartilhamento no Microsoft 365?', options: ['A Microsoft, por ser a dona do serviço', 'O cliente (a empresa que usa o serviço)', 'A ANPD', 'O provedor de internet'], answer: 1, explain: 'O provedor protege a infraestrutura; configuração, contas e permissões são do cliente, e a LGPD cobra do controlador.' },
        { type: 'tf', q: 'A autenticação legada (IMAP/POP com senha) deve permanecer ligada para compatibilidade, pois o MFA já protege as contas.', answer: false, explain: 'Protocolos legados ignoram o MFA; é por ali que atacantes entram em contas "protegidas". Desative-os.' },
        { type: 'fill', q: 'No Microsoft 365, o recurso gratuito que exige MFA de todos os usuários e bloqueia autenticação legada chama-se Security ___.', answer: ['Defaults', 'defaults'], explain: 'Security Defaults é a configuração básica gratuita; políticas de Acesso Condicional exigem licença adequada e permitem regras mais finas.' },
        { type: 'match', q: 'Relacione o recurso de segurança do Workspace/M365 ao que ele faz.', pairs: [['DLP', 'bloqueia ou avisa ao enviar CPF, dados bancários ou cartão para fora'], ['Acesso condicional', 'bloqueia login de países onde a empresa não opera'], ['Log de auditoria', 'mostra quem acessou, compartilhou ou apagou'], ['CASB', 'dá visibilidade de todos os SaaS usados, inclusive os não autorizados']], explain: 'DLP cuida de dados em saída, acesso condicional de contexto de login, auditoria de rastreabilidade e CASB de visibilidade entre serviços.' },
        {
          type: 'code',
          q: 'O painel de administração exporta os usuários em JSON: uma lista de objetos com "email", "ativo" (true/false) e "mfa" (true/false). Escreva a função usuarios_sem_mfa(json_texto) que devolve, em ordem alfabética, os e-mails dos usuários ATIVOS que não têm MFA.',
          starter: `import json

def usuarios_sem_mfa(json_texto):
    pass
`,
          tests: `dados = json.dumps([
    {"email": "ana@horizonte.com.br", "ativo": True, "mfa": True},
    {"email": "carlos@horizonte.com.br", "ativo": True, "mfa": False},
    {"email": "bia@horizonte.com.br", "ativo": True, "mfa": False},
    {"email": "ex.func@horizonte.com.br", "ativo": False, "mfa": False},
])
assert usuarios_sem_mfa(dados) == ["bia@horizonte.com.br", "carlos@horizonte.com.br"], "só ativos sem MFA, em ordem alfabética"
assert usuarios_sem_mfa("[]") == [], "lista vazia devolve lista vazia"
todos = json.dumps([{"email": "a@x.com", "ativo": True, "mfa": True}])
assert usuarios_sem_mfa(todos) == [], "todos com MFA devolve lista vazia"
`,
          solution: `import json

def usuarios_sem_mfa(json_texto):
    usuarios = json.loads(json_texto)
    return sorted(u["email"] for u in usuarios if u["ativo"] and not u["mfa"])
`,
          hint: 'json.loads, depois uma compreensão filtrando ativo verdadeiro e mfa falso; sorted() ordena os e-mails.',
          explain: 'Esse relatório é o indicador "contas sem MFA" do programa de segurança; contas inativas ficam fora porque devem ser desativadas, não corrigidas.',
        },
        { type: 'mc', q: 'Uma chave de API da AWS foi enviada por engano a um repositório público no GitHub. Qual a primeira ação?', options: ['Apagar o commit do histórico', 'Revogar a chave e gerar uma nova imediatamente', 'Tornar o repositório privado', 'Esperar para ver se alguém usa'], answer: 1, explain: 'Robôs varrem o GitHub em minutos; apagar o histórico ou privar o repositório não desfaz a cópia já feita. Só a revogação resolve.' },
        { type: 'tf', q: 'Um bucket de armazenamento configurado como público é encontrado em horas por ferramentas automatizadas.', answer: true, explain: 'Varreduras contínuas localizam buckets abertos; por isso o bloqueio de acesso público deve estar ligado na conta inteira.' },
      ],
    },
    {
      id: 'cs-05-09',
      title: 'Segurança de aplicações e DevSecOps',
      minutes: 28,
      content: 'content/ciberseguranca/cs-05/09-appsec-e-devsecops.md',
      exercises: [
        { type: 'match', q: 'Relacione o tipo de teste ou ferramenta ao que ele analisa.', pairs: [['SAST', 'código-fonte, sem executar'], ['DAST', 'aplicação em execução, como um atacante'], ['SCA', 'dependências de terceiros com vulnerabilidades conhecidas'], ['gitleaks', 'segredos deixados no repositório']], explain: 'Os três testes se complementam: código, comportamento em execução e bibliotecas; a varredura de segredos cobre o erro mais comum.' },
        { type: 'mc', q: 'Um desenvolvedor apagou uma senha do código e fez novo commit. O problema está resolvido?', options: ['Sim, o segredo não está mais no código', 'Não: o segredo continua no histórico do Git e pode já ter sido copiado; é preciso rotacionar a credencial', 'Sim, desde que o repositório seja privado', 'Não, é preciso reinstalar o Git'], answer: 1, explain: 'O histórico preserva o segredo e robôs copiam em minutos; a única ação que neutraliza o vazamento é gerar nova credencial e revogar a antiga.' },
        { type: 'fill', q: 'No STRIDE, a letra T representa ___, a ameaça de alterar dados em trânsito ou armazenados.', answer: ['Tampering', 'tampering', 'adulteração', 'adulteracao'], explain: 'Tampering viola a integridade; os controles típicos são assinatura, HTTPS e auditoria de alterações.' },
        { type: 'tf', q: 'Validar os dados do formulário apenas no navegador (JavaScript) é suficiente para proteger a aplicação.', answer: false, explain: 'O atacante envia requisições sem passar pelo seu navegador; toda validação e autorização precisa existir no servidor.' },
        { type: 'order', q: 'Ordene as atividades de segurança ao longo do ciclo de desenvolvimento seguro.', items: ['Definir requisitos de segurança e privacidade', 'Modelar ameaças com STRIDE', 'Codificar com revisão e SAST', 'Testar com DAST e SCA', 'Implantar por pipeline protegido com segredos em cofre', 'Manter dependências atualizadas e responder a vulnerabilidades'], explain: 'Cada etapa do SDLC tem sua atividade de segurança; quanto mais cedo a falha é achada, mais barata é a correção.' },
        { type: 'mc', q: 'A API devolve a fatura de outro cliente quando o ID na URL é trocado (IDOR). Em qual categoria do STRIDE essa ameaça se enquadra?', options: ['Spoofing', 'Denial of service', 'Information disclosure', 'Repudiation'], answer: 2, explain: 'Dados vazam para quem não deveria vê-los: é violação de confidencialidade, categoria Information disclosure; o controle é autorização no servidor em cada requisição.' },
        { type: 'mc', q: 'Qual tipo de teste teria apontado a vulnerabilidade Log4Shell (2021) em uma aplicação que usava a biblioteca Log4j?', options: ['SCA, que verifica dependências contra bases de CVE', 'DAST, que testa formulários', 'Revisão manual de código próprio', 'Teste de carga'], answer: 0, explain: 'Log4Shell estava em uma biblioteca de terceiros; a análise de composição de software (SCA) é a que confronta dependências com vulnerabilidades conhecidas.' },
        { type: 'write', q: 'Aplique o STRIDE a um portal onde os clientes do escritório fazem login e baixam suas guias de impostos. Escreva uma ameaça e um controle para cada uma das seis letras.', model: 'S: cliente usa senha roubada de outro — MFA e bloqueio por tentativas. T: alguém altera o código de barras da guia armazenada — guia assinada, auditoria de alterações, HTTPS. R: cliente nega ter baixado a guia — log de download com usuário, data e IP. I: trocar o ID na URL mostra guia de outro cliente — autorização no servidor em cada requisição. D: envio em massa de requisições no dia do vencimento — limite de requisições e CDN. E: parâmetro perfil=admin no formulário — papel definido no servidor, nunca vindo do cliente.', checklist: ['Há uma ameaça plausível para cada letra (S, T, R, I, D, E)?', 'Cada ameaça tem um controle correspondente?', 'As ameaças são específicas do portal de guias, não genéricas?'] },
      ],
    },
  ],
  exam: {
    passScore: 70,
    questions: [
      { type: 'mc', q: 'Qual princípio descreve "várias camadas independentes, de modo que a falha de uma não entregue tudo"?', options: ['Menor privilégio', 'Defesa em profundidade', 'Deny by default', 'Responsabilidade compartilhada'], answer: 1, explain: 'Defesa em profundidade é o castelo com fosso, muralha e guardas: camadas que se somam.' },
      { type: 'tf', q: 'Em uma estação de trabalho bem configurada, todos os usuários devem ser administradores locais para evitar chamados de suporte.', answer: false, explain: 'Conta padrão para todos e administrador local só para instalar: assim um anexo malicioso não vira administrador.' },
      { type: 'mc', q: 'Qual a diferença essencial entre antivírus tradicional e EDR?', options: ['O EDR é gratuito e o antivírus é pago', 'O antivírus compara assinaturas; o EDR observa comportamento e responde (isola, mata processo)', 'O EDR protege a rede e o antivírus o endpoint', 'Não há diferença'], answer: 1, explain: 'Assinaturas falham contra malware novo e ataques sem arquivo; o EDR reconhece cadeias de comportamento e age.' },
      { type: 'fill', q: 'Um ___ centraliza logs de várias fontes, normaliza, correlaciona eventos e gera alertas.', answer: ['SIEM', 'siem'], explain: 'SIEM (Security Information and Event Management) é o conciliador dos logs; Wazuh, Elastic, Splunk e Sentinel são exemplos.' },
      { type: 'match', q: 'Relacione o ID de evento do Windows ao seu significado.', pairs: [['4624', 'logon bem-sucedido'], ['4625', 'logon falhou'], ['4672', 'privilégios especiais atribuídos (administrador entrou)'], ['7045', 'novo serviço instalado']], explain: 'Esses quatro eventos cobrem entrada, tentativa falha, elevação e persistência por serviço.' },
      { type: 'mc', q: 'No ATT&CK, a técnica T1486 (Data Encrypted for Impact) pertence a qual tática?', options: ['Initial Access', 'Persistence', 'Impact', 'Discovery'], answer: 2, explain: 'Criptografar dados para extorsão é o dano final do ataque, tática Impact.' },
      { type: 'order', q: 'Ordene as fases do ciclo do NIST SP 800-61.', items: ['Preparação', 'Detecção e análise', 'Contenção, erradicação e recuperação', 'Atividade pós-incidente (lições aprendidas)'], explain: 'As quatro fases formam um ciclo: o que se aprende volta para a preparação.' },
      { type: 'mc', q: 'Qual destes itens pertence à fase de Preparação do NIST SP 800-61?', options: ['Isolar a máquina infectada da rede', 'Lista de contatos impressa, backup testado e playbooks prontos antes de qualquer incidente', 'Restaurar os dados do backup', 'Reunião de lições aprendidas'], answer: 1, explain: 'Preparação é tudo o que existe antes do incidente; isolar é contenção, restaurar é recuperação e a reunião é a atividade pós-incidente.' },
      { type: 'mc', q: 'Qual é a evidência mais volátil, que deve ser coletada primeiro em um computador suspeito?', options: ['Arquivos no disco', 'Memória RAM', 'Backups remotos', 'Logs do firewall'], answer: 1, explain: 'A RAM se perde ao desligar; disco, logs remotos e backups duram muito mais.' },
      {
        type: 'code',
        q: 'Escreva a função falhas_por_usuario(eventos) que recebe uma lista de dicionários com "event_id" e "user" e devolve um dicionário usuário -> quantidade de eventos 4625 (logon falhou). Usuários sem falhas não aparecem.',
        starter: `def falhas_por_usuario(eventos):
    pass
`,
        tests: `ev = [
    {"event_id": 4625, "user": "ana"},
    {"event_id": 4625, "user": "ana"},
    {"event_id": 4624, "user": "ana"},
    {"event_id": 4625, "user": "root"},
    {"event_id": 4688, "user": "bia"},
]
assert falhas_por_usuario(ev) == {"ana": 2, "root": 1}, "ana tem 2 falhas, root tem 1, bia nenhuma"
assert falhas_por_usuario([]) == {}, "lista vazia devolve dicionario vazio"
assert falhas_por_usuario([{"event_id": 4624, "user": "x"}]) == {}, "sem eventos 4625 devolve dicionario vazio"
`,
        solution: `def falhas_por_usuario(eventos):
    resultado = {}
    for ev in eventos:
        if ev.get("event_id") == 4625:
            resultado[ev["user"]] = resultado.get(ev["user"], 0) + 1
    return resultado
`,
        hint: 'Percorra a lista, considere só event_id 4625 e some no dicionário com get(usuario, 0) + 1.',
        explain: 'Contar falhas por usuário é a base da detecção de força bruta e de password spraying.',
      },
      { type: 'mc', q: 'Qual regra de backup inclui uma cópia imutável ou off-line e a verificação com zero erros?', options: ['3-2-1', '3-2-1-1-0', '1-1-1', '5-4-3'], answer: 1, explain: 'A regra 3-2-1-1-0 acrescenta à clássica 3-2-1 a cópia imutável/off-line e a restauração testada.' },
      { type: 'tf', q: 'No modelo de responsabilidade compartilhada, um e-mail invadido por falta de MFA no Google Workspace é responsabilidade do Google.', answer: false, explain: 'O provedor cuida da infraestrutura; contas, MFA e permissões são do cliente, e a LGPD responsabiliza o controlador.' },
      { type: 'mc', q: 'Qual ferramenta analisa as dependências de terceiros de uma aplicação em busca de vulnerabilidades conhecidas (CVE)?', options: ['SAST', 'DAST', 'SCA', 'Firewall de aplicação'], answer: 2, explain: 'SCA (Software Composition Analysis) confronta as bibliotecas usadas com bases de CVE; foi o que faltou a muitos no caso Log4Shell.' },
      { type: 'match', q: 'Relacione a letra do STRIDE à propriedade de segurança que ela viola.', pairs: [['Spoofing', 'autenticação'], ['Tampering', 'integridade'], ['Information disclosure', 'confidencialidade'], ['Denial of service', 'disponibilidade'], ['Elevation of privilege', 'autorização']], explain: 'Cada categoria do STRIDE corresponde a uma propriedade: identidade, integridade, confidencialidade, disponibilidade e autorização (e Repudiation ao não repúdio).' },
      { type: 'mc', q: 'Qual medida corta boa parte do phishing e do malware antes mesmo de a conexão existir, com custo quase zero para uma pequena empresa?', options: ['Trocar o roteador por um NGFW', 'Configurar um filtro de DNS (como Quad9) no roteador', 'Instalar um IDS com todas as regras', 'Desligar o firewall de host'], answer: 1, explain: 'O filtro de DNS recusa resolver domínios maliciosos; é barato, simples e cobre toda a rede ao ser configurado no roteador.' },
    ],
  },
});
