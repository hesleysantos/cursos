registerModule({
  course: 'ciberseguranca',
  id: 'cs-04',
  order: 4,
  level: 'Avançado',
  title: 'Ataques e segurança ofensiva ética',
  description: 'Você vai entender a segurança pelo lado de quem ataca, sempre para defender: a lei que separa teste de crime, a metodologia de um pentest, reconhecimento e OSINT, varredura, o ciclo de vida das vulnerabilidades (CVE/CVSS), as falhas do OWASP Top 10 e suas correções, malware, ransomware e engenharia social, e como montar um laboratório legal e ler um relatório de pentest.',
  hours: 16,
  lessons: [
    // ------------------------------------------------------------------
    {
      id: 'cs-04-01',
      title: 'Ética e lei',
      minutes: 26,
      content: 'content/ciberseguranca/cs-04/01-etica-e-lei.md',
      exercises: [
        { type: 'mc', q: 'O que diferencia um hacker ético de um criminoso, já que a habilidade técnica é a mesma?', options: ['O ético usa ferramentas diferentes', 'O ético tem autorização por escrito, escopo definido e objetivo de corrigir', 'O ético age mais rápido', 'O ético nunca encontra falhas de verdade'], answer: 1, explain: 'A técnica é idêntica; o que torna a atividade legal é o consentimento do dono, dentro de um escopo, com o fim de corrigir.' },
        { type: 'tf', q: 'Uma autorização verbal do dono do sistema ("pode testar aí") é suficiente para proteger juridicamente quem faz o teste.', answer: false, explain: 'O consentimento precisa ser por escrito, anterior e específico; sem contrato e escopo, não há proteção.' },
        { type: 'fill', q: 'A invasão de dispositivo informático sem autorização é tipificada no art. ___ do Código Penal.', answer: ['154-A', '154 A', '154a'], explain: 'O art. 154-A foi criado pela Lei 12.737/2012 e endurecido pela Lei 14.155/2021.' },
        { type: 'mc', q: 'Qual elemento é central para o crime do art. 154-A se configurar?', options: ['O valor do prejuízo causado', 'A ausência de autorização do titular (a invasão)', 'O uso de ferramentas pagas', 'A divulgação da falha na imprensa'], answer: 1, explain: 'O verbo é "invadir"; o núcleo do crime é entrar sem autorização do usuário, com o fim de obter, alterar ou destruir dados. Prejuízo e dados sigilosos apenas agravam a pena.' },
        { type: 'match', q: 'Relacione a norma ao seu foco principal.', pairs: [['Lei 12.737/2012', 'Criou o crime de invasão de dispositivo (154-A)'], ['Marco Civil', 'Uso da internet, guarda de logs e provedores'], ['LGPD', 'Proteção de dados pessoais e aviso de incidentes'], ['Bug bounty', 'Autorização prévia para testar sistemas listados']], explain: 'Cada norma ou mecanismo cobre uma dimensão diferente da atividade de segurança.' },
        { type: 'mc', q: 'Um amigo pede que você verifique "se dá para entrar" na conta de um ex-sócio dele. O que fazer?', options: ['Aceitar, pois foi ele quem pediu', 'Aceitar se não cobrar nada', 'Recusar: acessar conta de terceiro sem autorização do titular é crime', 'Aceitar e só olhar, sem mexer em nada'], answer: 2, explain: 'A autorização tem de vir do titular do sistema ou da conta; o pedido de um terceiro não autoriza, e "só olhar" já é invasão.' },
        { type: 'tf', q: 'Resolver máquinas no TryHackMe ou numa instalação local do DVWA é uma forma legal de praticar.', answer: true, explain: 'Esses ambientes foram criados para serem atacados e já embutem a autorização; é o caminho legal para treinar.' },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'cs-04-02',
      title: 'Metodologia de pentest',
      minutes: 25,
      content: 'content/ciberseguranca/cs-04/02-metodologia-de-pentest.md',
      exercises: [
        { type: 'mc', q: 'Por que um pentest segue uma metodologia em vez de rodar ferramentas ao acaso?', options: ['Para gastar mais tempo', 'Para garantir cobertura, repetibilidade e rastreabilidade', 'Porque a lei exige um roteiro específico', 'Para evitar usar ferramentas automáticas'], answer: 1, explain: 'Método garante que nada importante fique de fora, que outro profissional chegue a resultados comparáveis e que cada achado tenha evidência.' },
        { type: 'order', q: 'Ordene as fases de um pentest, na sequência adotada na lição (baseada no PTES).', items: ['Planejamento e regras de engajamento', 'Reconhecimento', 'Varredura e enumeração', 'Análise de vulnerabilidades', 'Exploração', 'Pós-exploração', 'Relatório'], explain: 'Do contrato ao relatório: primeiro autorizar e mapear, depois confirmar e medir o impacto, por fim comunicar.' },
        { type: 'mc', q: 'Qual a diferença essencial entre um scan de vulnerabilidades e um pentest?', options: ['O scan é feito por humanos e o pentest por máquinas', 'O scan lista falhas possíveis automaticamente; o pentest confirma, encadeia e mede o impacto', 'Não há diferença', 'O pentest só funciona em sites, o scan em qualquer sistema'], answer: 1, explain: 'O scanner aponta "esta versão tem a falha tal"; o pentester demonstra se ela é mesmo aproveitável e qual o impacto real.' },
        { type: 'match', q: 'Relacione o tipo de teste ao conhecimento prévio do profissional.', pairs: [['Black box', 'Nada além do nome ou do domínio'], ['Grey box', 'Credenciais de usuário comum e documentação parcial'], ['White box', 'Código-fonte e acesso administrativo']], explain: 'Quanto mais informação, maior a cobertura; o grey box costuma ter o melhor custo-benefício.' },
        { type: 'tf', q: 'Um exercício de red team foca apenas em listar vulnerabilidades técnicas dos sistemas.', answer: false, explain: 'O red team simula um adversário real por semanas e avalia a capacidade de detectar e responder, envolvendo pessoas e processos, não só sistemas.' },
        { type: 'fill', q: 'O guia da OWASP com as verificações para aplicações web é o OWASP ___ Security Testing Guide.', answer: ['Web', 'WSTG'], explain: 'O OWASP WSTG é o roteiro de testes para aplicações web, organizado por categoria.' },
        { type: 'mc', q: 'Você contrata um "pentest" e recebe só uma lista de 200 itens gerada por ferramenta, sem exploração nem priorização. O que provavelmente aconteceu?', options: ['Foi um pentest completo e bem feito', 'Foi vendido um scan automático como se fosse pentest', 'Foi um exercício de red team', 'O relatório está apenas resumido'], answer: 1, explain: 'Pentest inclui confirmação manual, encadeamento e priorização; uma lista crua de ferramenta é um scan, não um pentest.' },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'cs-04-03',
      title: 'Reconhecimento e OSINT',
      minutes: 25,
      content: 'content/ciberseguranca/cs-04/03-reconhecimento-e-osint.md',
      exercises: [
        { type: 'mc', q: 'O que é reconhecimento passivo (OSINT)?', options: ['Invadir o alvo em silêncio', 'Coletar informações de fontes abertas sem tocar nos sistemas do alvo', 'Enviar pacotes para as portas do alvo', 'Instalar um espião na rede do alvo'], answer: 1, explain: 'OSINT usa fontes públicas e consulta terceiros (DNS, certificados, redes sociais), sem interagir com os sistemas do alvo.' },
        { type: 'tf', q: 'Consultar o serviço de transparência de certificados (crt.sh) sobre um domínio é uma atividade passiva, pois a consulta vai a um registro público, não ao alvo.', answer: true, explain: 'Por não tocar nos sistemas do alvo, essa coleta é passiva; sondar as portas do alvo já seria atividade ativa (lição 4).' },
        { type: 'match', q: 'Relacione a fonte de OSINT à informação que ela costuma revelar.', pairs: [['LinkedIn', 'Organograma, quem é do financeiro, quem é novo'], ['WHOIS', 'Responsável e datas do domínio'], ['Transparência de certificados', 'Subdomínios, inclusive os esquecidos'], ['Have I Been Pwned', 'E-mails da empresa presentes em vazamentos']], explain: 'Fontes humanas revelam pessoas; fontes técnicas revelam infraestrutura; bases de vazamento revelam credenciais expostas.' },
        { type: 'mc', q: 'O que o Shodan indexa?', options: ['Páginas de texto, como o Google', 'Dispositivos e serviços expostos na internet', 'Apenas sites com HTTPS', 'Perfis de redes sociais'], answer: 1, explain: 'O Shodan varre a internet e cataloga dispositivos e seus banners, revelando o que está exposto; ele não ataca.' },
        { type: 'fill', q: 'Buscas com operadores avançados do Google (site:, filetype:, inurl:) que localizam conteúdo indexado sem querer são chamadas de Google ___.', answer: ['dorks', 'dork'], explain: 'Os Google dorks encontram documentos, painéis e páginas que não deveriam estar públicos; a Google Hacking Database cataloga esses padrões.' },
        { type: 'mc', q: 'Qual é a melhor forma de reduzir a exposição do escritório ao reconhecimento?', options: ['Confiar que ninguém vai se interessar', 'Fazer o próprio OSINT periodicamente e remover o que não precisa estar público', 'Tirar o site do ar', 'Publicar mais informações para confundir'], answer: 1, explain: 'Olhar o escritório com os olhos do atacante (OSINT próprio) e remover painéis, ambientes de teste, metadados e dados desnecessários é a defesa prática.' },
        { type: 'tf', q: 'Publicar uma vaga pedindo experiência com marcas e versões específicas de software entrega um inventário de tecnologias a um possível atacante.', answer: true, explain: 'Vagas detalhadas revelam o parque tecnológico; descreva funções em vez de marcas e versões.' },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'cs-04-04',
      title: 'Varredura e enumeração',
      minutes: 28,
      content: 'content/ciberseguranca/cs-04/04-varredura-e-enumeracao.md',
      exercises: [
        { type: 'mc', q: 'Qual a diferença entre varredura e enumeração?', options: ['São sinônimos', 'Varredura descobre portas abertas; enumeração descobre o serviço, a versão e a configuração atrás delas', 'Varredura é ilegal e enumeração é legal', 'Enumeração só funciona em UDP'], answer: 1, explain: 'Primeiro se descobre o que está aberto (varredura); depois se identifica o que há atrás de cada porta (enumeração).' },
        { type: 'match', q: 'Relacione o estado de porta do nmap ao significado.', pairs: [['open', 'Há um serviço escutando'], ['closed', 'A porta responde, mas nada escuta'], ['filtered', 'Um firewall descarta os pacotes']], explain: 'Os três estados orientam o que inventariar e proteger; filtered indica proteção de firewall.' },
        { type: 'tf', q: 'Varrer as portas do site de um cliente "só para ver", sem autorização, é uma atividade inofensiva e legal.', answer: false, explain: 'A varredura é ativa: envia pacotes e fica registrada no servidor do alvo; sem autorização pode configurar o art. 154-A.' },
        { type: 'mc', q: 'Numa saída de varredura autorizada do seu ambiente, a porta 3306 (MySQL) aparece como "open" e alcançável de fora. Qual a leitura correta?', options: ['Ótimo, o banco está disponível para todos', 'Alerta grave: bancos de dados não devem ficar expostos; devem ficar em rede interna segmentada', 'Normal, bancos sempre ficam abertos', 'Irrelevante para a segurança'], answer: 1, explain: 'Um banco de dados acessível de fora é superfície de ataque séria; ele deve ficar segmentado na rede interna (módulo 3).' },
        { type: 'fill', q: 'A linha que um serviço devolve anunciando o programa e a versão (ex.: "220 ProFTPD 1.3.5") chama-se ___.', answer: ['banner'], explain: 'O banner facilita o diagnóstico, mas entrega a versão; reduzi-lo é uma camada extra de defesa.' },
        { type: 'mc', q: 'Por que a detecção de versão é a informação mais valiosa da enumeração?', options: ['Porque muda a cor da saída', 'Porque liga o serviço às falhas conhecidas (CVEs) daquela versão', 'Porque acelera a varredura', 'Porque esconde o serviço'], answer: 1, explain: 'Saber a versão exata permite cruzar com CVEs (lição 5) e decidir se há falha explorável.' },
        {
          type: 'code',
          q: 'Você recebeu a saída de uma varredura autorizada. Escreva `portas_abertas(saida)` que recebe o texto e devolve a lista ordenada (crescente) dos números de porta cujo estado é "open". Cada linha de porta tem o formato "PORTA/protocolo ESTADO servico", por exemplo "22/tcp open ssh". Ignore o cabeçalho e linhas sem esse formato.',
          starter: `def portas_abertas(saida):
    pass
`,
          tests: `s = """PORT     STATE    SERVICE
22/tcp   open     ssh
80/tcp   open     http
443/tcp  closed   https
3306/tcp open     mysql
3389/tcp filtered ms-wbt-server"""
assert portas_abertas(s) == [22, 80, 3306], "Deve devolver só as portas open, ordenadas: [22, 80, 3306]"
assert portas_abertas("") == [], "Entrada vazia deve devolver lista vazia"
assert portas_abertas("25/tcp open smtp") == [25], "Uma única porta open deve virar [25]"
assert portas_abertas("53/udp closed domain") == [], "Portas que não estão open devem ser ignoradas"
assert portas_abertas("443/tcp open https\\n22/tcp open ssh\\n80/tcp open http") == [22, 80, 443], "A lista deve sair em ordem crescente, mesmo que a saída venha fora de ordem"
`,
          solution: `def portas_abertas(saida):
    abertas = []
    for linha in saida.splitlines():
        partes = linha.split()
        if len(partes) >= 2 and "/" in partes[0] and partes[1] == "open":
            porta = int(partes[0].split("/")[0])
            abertas.append(porta)
    return sorted(abertas)
`,
          hint: 'Percorra saida.splitlines(); divida cada linha com split(); verifique se a segunda coluna é "open" e extraia o número antes da "/".',
          explain: 'Interpretar uma saída é separar o sinal (portas abertas) do ruído (cabeçalho e demais estados); é a habilidade central da fase.',
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'cs-04-05',
      title: 'Vulnerabilidades: CVE, CVSS e ciclo de vida',
      minutes: 27,
      content: 'content/ciberseguranca/cs-04/05-vulnerabilidades.md',
      exercises: [
        { type: 'mc', q: 'Qual a diferença entre uma vulnerabilidade e um exploit?', options: ['São a mesma coisa', 'A vulnerabilidade é a fraqueza; o exploit é o código ou a técnica que a aproveita', 'A vulnerabilidade é legal e o exploit é ilegal', 'O exploit é a correção da vulnerabilidade'], answer: 1, explain: 'A vulnerabilidade é a porta destrancada; o exploit é o gesto de abri-la.' },
        { type: 'match', q: 'Relacione a sigla ao que ela representa.', pairs: [['CVE', 'Identificador único de uma falha pública'], ['CVSS', 'Nota de gravidade de 0 a 10'], ['CWE', 'Categoria do tipo de erro'], ['Zero-day', 'Falha explorada antes de existir correção']], explain: 'CVE nomeia, CVSS mede, CWE classifica a causa; zero-day é a falha sem patch disponível.' },
        { type: 'mc', q: 'Uma falha tem CVSS 9.8 (crítica), mas está num serviço que você não expõe à internet. Outra tem CVSS 7.5 (alta), no seu portal público e já sendo explorada em ataques reais. Qual priorizar?', options: ['Sempre a de maior nota (9.8)', 'A de 7.5, por estar exposta e sob exploração ativa', 'Nenhuma, pois ambas têm correção', 'Tanto faz'], answer: 1, explain: 'A nota prioriza, mas exposição e exploração ativa (EPSS, lista KEV) definem a urgência real; o que é alto, exposto e explorado vem primeiro.' },
        { type: 'tf', q: 'A maioria dos ataques bem-sucedidos usa zero-days inéditos.', answer: false, explain: 'A maioria usa falhas antigas e já corrigidas em sistemas que ninguém atualizou; por isso atualizar é a defesa número um.' },
        { type: 'fill', q: 'O período mais perigoso, entre a divulgação pública de uma falha e a aplicação do patch por cada empresa, é chamado de janela de ___.', answer: ['exposição', 'exposicao'], explain: 'Assim que a CVE sai, atacantes procuram quem ainda não corrigiu; fechar essa janela rápido é essencial.' },
        { type: 'mc', q: 'Ao ler um boletim de segurança, qual conjunto de perguntas ajuda a decidir a urgência?', options: ['Só a cor do aviso', 'Produto e versão afetados, CVE e CVSS, se é explorável remotamente e já explorado, e se o serviço está exposto', 'Apenas o nome do pesquisador', 'Somente a data de publicação'], answer: 1, explain: 'Essas perguntas transformam o texto técnico numa decisão: corrigir hoje, nesta semana ou no próximo ciclo.' },
        {
          type: 'code',
          q: 'Escreva `severidade(nota)` que recebe uma nota CVSS (0 a 10) e devolve a faixa: "Nenhuma" se 0, "Baixa" se 0,1 a 3,9, "Média" se 4,0 a 6,9, "Alta" se 7,0 a 8,9 e "Crítica" se 9,0 a 10,0. Se a nota for menor que 0 ou maior que 10, levante ValueError.',
          starter: `def severidade(nota):
    pass
`,
          tests: `assert severidade(0) == "Nenhuma", "0 é Nenhuma"
assert severidade(3.9) == "Baixa", "3.9 é Baixa"
assert severidade(4.0) == "Média", "4.0 é Média"
assert severidade(6.9) == "Média", "6.9 é Média"
assert severidade(7.0) == "Alta", "7.0 é Alta"
assert severidade(8.9) == "Alta", "8.9 é Alta"
assert severidade(9.0) == "Crítica", "9.0 é Crítica"
assert severidade(10.0) == "Crítica", "10.0 é Crítica"
for ruim in (-1, 10.1, 15):
    try:
        severidade(ruim)
        assert False, "Notas fora de 0 a 10 devem levantar ValueError"
    except ValueError:
        pass
`,
          solution: `def severidade(nota):
    if nota < 0 or nota > 10:
        raise ValueError("nota deve estar entre 0 e 10")
    if nota == 0:
        return "Nenhuma"
    if nota < 4.0:
        return "Baixa"
    if nota < 7.0:
        return "Média"
    if nota < 9.0:
        return "Alta"
    return "Crítica"
`,
          hint: 'Primeiro valide o intervalo e levante ValueError; depois use uma sequência de if com os limites de cada faixa.',
          explain: 'Classificar por faixa é o que os scanners fazem para priorizar; validar a entrada evita notas impossíveis.',
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'cs-04-06',
      title: 'OWASP Top 10 (parte 1)',
      minutes: 28,
      content: 'content/ciberseguranca/cs-04/06-owasp-top-10-parte-1.md',
      exercises: [
        { type: 'mc', q: 'Qual é a causa raiz de uma injeção de SQL?', options: ['O banco de dados estar desatualizado', 'A entrada do usuário ser concatenada no comando, misturando dado com comando', 'O uso de HTTPS', 'A senha do banco ser fraca'], answer: 1, explain: 'Quando o dado é colado no comando, ele pode virar comando; a falha nasce de misturar as duas coisas.' },
        { type: 'mc', q: 'Qual é a correção correta para a injeção de SQL?', options: ['Proibir a letra "a" nas buscas', 'Usar consultas parametrizadas (prepared statements), que separam o comando dos dados', 'Esconder a tela de busca', 'Trocar o banco de dados'], answer: 1, explain: 'A consulta parametrizada faz o banco tratar a entrada sempre como valor, nunca como código; não se deve concatenar.' },
        { type: 'tf', q: 'Validar a entrada apenas no navegador (JavaScript) é suficiente para garantir a segurança.', answer: false, explain: 'O código do navegador pode ser contornado; a validação que vale é sempre a do servidor.' },
        { type: 'fill', q: 'A falha em que um texto do usuário é devolvido numa página e executado pelo navegador de quem a vê chama-se cross-site ___.', answer: ['scripting', 'XSS'], explain: 'No XSS, a defesa é escapar a saída e usar Content Security Policy.' },
        { type: 'match', q: 'Relacione a falha à sua defesa principal.', pairs: [['Injeção de SQL', 'Consulta parametrizada'], ['XSS', 'Escape na saída e CSP'], ['Falha de autenticação', 'Hashing forte, MFA e limite de tentativas'], ['Injeção de comando', 'Não montar comandos com texto do usuário']], explain: 'Cada categoria tem uma defesa central; todas partem de não confiar na entrada.' },
        { type: 'mc', q: 'Por que uma mensagem de erro como "usuário existe, senha incorreta" é um problema de segurança?', options: ['Deixa a tela mais lenta', 'Confirma ao atacante quais usuários existem, ajudando ataques de senha', 'Viola a LGPD sempre', 'Impede o login legítimo'], answer: 1, explain: 'Mensagens específicas entregam informação; o ideal é uma mensagem genérica que não distinga usuário inexistente de senha errada.' },
        {
          type: 'code',
          q: 'Escreva duas defesas de entrada. `cnpj_valido(texto)` devolve True apenas se `texto` for uma string de 14 dígitos (só números, sem pontuação). `escapar_html(texto)` devolve o texto com os caracteres `&`, `<` e `>` convertidos para `&amp;`, `&lt;` e `&gt;`, nessa ordem, para evitar XSS ao exibir.',
          starter: `def cnpj_valido(texto):
    pass

def escapar_html(texto):
    pass
`,
          tests: `assert cnpj_valido("12345678000199") is True, "14 dígitos deve ser válido"
assert cnpj_valido("123") is False, "Menos de 14 dígitos é inválido"
assert cnpj_valido("1234567800019a") is False, "Com letra é inválido"
assert cnpj_valido("12.345.678/0001-99") is False, "Com pontuação é inválido (espera-se só dígitos)"
assert escapar_html("<b>") == "&lt;b&gt;", "< e > devem ser escapados"
assert escapar_html("a & b") == "a &amp; b", "& deve virar &amp;"
assert escapar_html("a < b & c > d") == "a &lt; b &amp; c &gt; d", "Deve escapar todos os caracteres, com & primeiro para não escapar duas vezes"
`,
          solution: `def cnpj_valido(texto):
    return isinstance(texto, str) and len(texto) == 14 and texto.isdigit()

def escapar_html(texto):
    return (texto.replace("&", "&amp;")
                 .replace("<", "&lt;")
                 .replace(">", "&gt;"))
`,
          hint: 'Para o CNPJ, use len() e str.isdigit(). Para o escape, troque "&" primeiro (senão os & que você inserir seriam escapados de novo) e depois "<" e ">".',
          explain: 'Validar (lista de permitidos) e escapar na saída são as duas camadas que acompanham o sistema; a ordem do escape evita escapar duas vezes.',
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'cs-04-07',
      title: 'OWASP Top 10 (parte 2)',
      minutes: 29,
      content: 'content/ciberseguranca/cs-04/07-owasp-top-10-parte-2.md',
      exercises: [
        { type: 'mc', q: 'No portal, sua declaração está em ".../documento?id=1050" e, ao trocar para "id=1051", aparece o documento de outro cliente. Que falha é essa?', options: ['XSS', 'Controle de acesso quebrado (IDOR)', 'Injeção de SQL', 'SSRF'], answer: 1, explain: 'O sistema autenticou o usuário, mas não verificou se aquele documento pertence a ele; é um IDOR.' },
        { type: 'mc', q: 'Qual é a defesa correta para o IDOR?', options: ['Esconder o link no menu', 'Verificar no servidor, a cada requisição, se o recurso pertence ao usuário', 'Usar números de id maiores', 'Confiar no id enviado pelo navegador'], answer: 1, explain: 'Esconder não impede trocar o id na URL; a autorização tem de ser checada no servidor para cada objeto.' },
        { type: 'match', q: 'Relacione a categoria de falha à sua defesa.', pairs: [['Configuração incorreta', 'Hardening: trocar padrões, desligar o que não se usa'], ['Componentes vulneráveis', 'Inventário e atualização de dependências'], ['SSRF', 'Restringir os destinos que o servidor pode acessar'], ['Registro insuficiente', 'Logs de segurança e alertas']], explain: 'Cada categoria do Top 10 tem uma defesa central; juntas cobrem a aplicação.' },
        { type: 'tf', q: 'Se o código próprio é seguro, uma biblioteca de terceiros desatualizada não representa risco.', answer: false, explain: 'A aplicação herda as falhas (CVEs) das bibliotecas que usa; foi assim no Log4Shell. É preciso inventariar e atualizar dependências.' },
        { type: 'fill', q: 'A falha em que a aplicação aceita uma URL do usuário e faz o próprio servidor acessá-la, podendo alcançar a rede interna, chama-se ___ (sigla de quatro letras).', answer: ['SSRF'], explain: 'Server-Side Request Forgery usa o servidor como ponte; a defesa é restringir os destinos permitidos.' },
        { type: 'mc', q: 'Por que "registro e monitoramento insuficientes" é uma categoria de falha?', options: ['Porque gera muitos arquivos', 'Porque, sem logs e alertas, um ataque passa despercebido e o estrago cresce no escuro', 'Porque deixa o sistema mais lento', 'Porque viola a LGPD por si só'], answer: 1, explain: 'A demora entre invasão e descoberta ainda é medida em semanas; registrar eventos e alertar é o que permite reagir a tempo.' },
        { type: 'mc', q: 'Ao contratar um sistema, qual resposta do fornecedor é um sinal de alerta?', options: ['"Usamos consultas parametrizadas e escape por padrão"', '"É tudo criptografado e seguro, pode confiar"', '"Temos inventário de dependências e atualização automática"', '"Fazemos pentest com reteste após as correções"'], answer: 1, explain: 'Respostas vagas, sem detalhe verificável, são sinal de alerta; as demais são afirmações concretas que você pode checar.' },
        { type: 'tf', q: 'Um portal que recupera a senha perguntando "qual é o CNPJ da empresa?" tem um problema de design inseguro, mesmo que o código esteja escrito sem erros.', answer: true, explain: 'O CNPJ é público; a ideia de usá-lo como prova de identidade está errada desde o projeto. Design inseguro (A04 de 2021) é a falha que nasce antes do código.' },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'cs-04-08',
      title: 'Malware, ransomware e engenharia social',
      minutes: 25,
      content: 'content/ciberseguranca/cs-04/08-malware-ransomware-engenharia-social.md',
      exercises: [
        { type: 'match', q: 'Relacione o tipo de malware ao comportamento.', pairs: [['Worm', 'Espalha-se sozinho pela rede'], ['Trojan', 'Disfarça-se de programa legítimo'], ['Infostealer', 'Rouba senhas e cookies salvos'], ['Ransomware', 'Criptografa arquivos e exige resgate']], explain: 'Os tipos se definem pelo comportamento e costumam se combinar num mesmo ataque.' },
        { type: 'order', q: 'Ordene as etapas de um ataque de ransomware moderno.', items: ['Acesso inicial (phishing, credencial vazada ou falha exposta)', 'Movimento lateral pela rede', 'Exfiltração dos dados', 'Criptografia dos arquivos e pedido de resgate', 'Dupla extorsão: ameaça de publicar os dados'], explain: 'O ransomware de manchete é o último passo de uma intrusão que dura dias; interromper cedo evita o desastre.' },
        { type: 'tf', q: 'Ter backup resolve completamente o problema do ransomware com dupla extorsão.', answer: false, explain: 'O backup recupera os arquivos, mas não impede o vazamento dos dados já copiados; por isso é preciso também prevenir o acesso inicial e o movimento lateral.' },
        { type: 'mc', q: 'Na fraude do CEO (BEC), qual é a defesa mais eficaz?', options: ['Um antivírus melhor', 'Confirmar toda transferência e mudança de dados bancários por um segundo canal já conhecido, com dupla aprovação', 'Responder rápido ao pedido do chefe', 'Bloquear todos os e-mails externos'], answer: 1, explain: 'A fraude do CEO manipula pessoas; a defesa é de processo: validação por outro canal e dupla aprovação, mesmo quando o e-mail parece perfeito.' },
        { type: 'fill', q: 'A técnica em que o golpista cria um pretexto crível (fingir ser o suporte do banco ou o técnico do sistema) para extrair dados ou acesso chama-se ___.', answer: ['pretexting', 'pretexto'], explain: 'O pretexting usa detalhes reais colhidos no reconhecimento para ganhar credibilidade.' },
        { type: 'order', q: 'Ordene a resposta inicial a uma suspeita de infecção por malware.', items: ['Isolar a máquina da rede sem formatá-la', 'Acionar o responsável de TI (e o jurídico, se houver)', 'Trocar as senhas críticas a partir de outro dispositivo limpo', 'Avaliar o alcance e comunicar a ANPD se houver dados pessoais', 'Restaurar de um backup verificado após remover a causa'], explain: 'Primeiro conter e preservar evidências, depois acionar, trocar credenciais, avaliar o alcance e só então restaurar.' },
        { type: 'mc', q: 'Qual combinação de sinais deve acender o alerta máximo numa mensagem?', options: ['Saudação cordial e assinatura', 'Urgência + sigilo + exceção ao processo normal (ex.: mudar dados bancários de um fornecedor por e-mail)', 'Uso de HTTPS no link', 'Mensagem curta'], answer: 1, explain: 'Pressa, pedido de sigilo e quebra do processo são a assinatura da engenharia social voltada a fraude financeira.' },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'cs-04-09',
      title: 'Laboratório e relatório',
      minutes: 25,
      content: 'content/ciberseguranca/cs-04/09-laboratorio-e-relatorio.md',
      exercises: [
        { type: 'mc', q: 'Por que um laboratório próprio é a forma segura de praticar?', options: ['Porque é mais rápido', 'Porque você é o dono e tem autorização total, sem risco jurídico nem a terceiros', 'Porque não precisa de internet', 'Porque usa ferramentas diferentes'], answer: 1, explain: 'No lab o dono é você; pode errar e explorar à vontade, pois não há sistema alheio envolvido.' },
        { type: 'mc', q: 'Qual é o cuidado central ao montar um laboratório com máquinas propositalmente vulneráveis?', options: ['Usar o monitor maior', 'Isolar as VMs numa rede fechada, sem acesso à internet nem à rede do escritório', 'Deixar o antivírus desligado', 'Conectar tudo à rede principal para testar de verdade'], answer: 1, explain: 'O isolamento de rede garante que, se a VM vulnerável for comprometida, o problema não escape do laboratório.' },
        { type: 'match', q: 'Relacione o recurso ao seu papel no treino legal.', pairs: [['DVWA', 'Aplicação web vulnerável para rodar localmente'], ['OWASP Juice Shop', 'App moderno que cobre o OWASP Top 10'], ['TryHackMe', 'Trilhas guiadas na nuvem, para começar'], ['Hack The Box', 'Máquinas e desafios, do iniciante ao avançado']], explain: 'Todos fornecem o alvo e embutem a autorização; praticar neles é o oposto de testar sistema alheio.' },
        { type: 'order', q: 'Ordene as seções de um relatório de pentest.', items: ['Sumário executivo', 'Escopo e metodologia', 'Achados com severidade e evidência', 'Recomendações priorizadas', 'Conclusão e plano de reteste'], explain: 'Do resumo para a direção até o plano de verificação; o coração são os achados.' },
        { type: 'tf', q: 'Um bom achado de pentest descreve o impacto no negócio, não apenas o detalhe técnico.', answer: true, explain: '"Porta aberta" não diz nada à gestão; "um cliente veria os dados de outro" comunica o risco e orienta a decisão.' },
        { type: 'fill', q: 'Verificar, após as correções, se as falhas foram realmente resolvidas é o que se chama de ___.', answer: ['reteste', 'retest'], explain: 'Correção sem reteste é só promessa; o relatório deve prever essa verificação.' },
        { type: 'mc', q: 'Sendo o cliente que recebeu o relatório, por onde você deve começar a leitura?', options: ['Pela lista técnica completa', 'Pelo sumário executivo, que deve ser legível por um sócio', 'Pelas capturas de tela', 'Pela bibliografia'], answer: 1, explain: 'Se o sumário executivo é incompreensível, o fornecedor falhou em comunicar; ele é a porta de entrada da leitura gerencial.' },
      ],
    },
  ],
  exam: {
    passScore: 70,
    questions: [
      { type: 'mc', q: 'O escritório tem login no sistema de um cliente para lançar notas. Isso autoriza procurar falhas de segurança nesse sistema?', options: ['Sim, quem tem login pode testar', 'Sim, desde que não cause dano', 'Não: ter acesso não é autorização para testar; é preciso consentimento escrito e específico do titular', 'Sim, se for fora do horário comercial'], answer: 2, explain: 'Poder usar o sistema e poder testá-lo são coisas diferentes. Sem autorização escrita e específica, procurar falhas pode configurar o art. 154-A.' },
      { type: 'mc', q: 'Numa varredura autorizada do seu próprio servidor, a porta 3389 aparece como "filtered". O que isso significa?', options: ['Há um serviço escutando e aceitando conexões', 'A porta responde, mas nada escuta nela', 'Um firewall descarta os pacotes; o nmap não consegue decidir se há serviço', 'A porta está infectada'], answer: 2, explain: 'Filtered indica que um firewall está no caminho; é diferente de closed (responde sem serviço) e de open (serviço escutando).' },
      { type: 'mc', q: 'Para testar o portal de clientes do escritório, qual tipo de teste simula melhor o atacante mais provável (um cliente tentando ver os dados de outro)?', options: ['Black box, sem nenhuma informação', 'Grey box, com credenciais de um usuário comum', 'White box, com código-fonte e acesso de administrador', 'Red team de várias semanas'], answer: 1, explain: 'O grey box parte de uma conta comum, exatamente a posição de um cliente mal-intencionado, e costuma ter o melhor custo-benefício.' },
      { type: 'match', q: 'Relacione a fase do pentest ao que entrega.', pairs: [['Reconhecimento', 'Mapa do que existe (OSINT)'], ['Varredura', 'Inventário de serviços e versões'], ['Exploração', 'Prova de que a falha é real'], ['Relatório', 'Documento para corrigir']], explain: 'As fases vão de mapear a comunicar, passando por confirmar e medir o impacto.' },
      { type: 'mc', q: 'Qual fonte de OSINT costuma revelar subdomínios esquecidos do escritório, como um ambiente de teste antigo, sem tocar nos sistemas dele?', options: ['Uma varredura de portas com nmap', 'A transparência de certificados (crt.sh)', 'O antivírus do servidor', 'O formulário de contato do site'], answer: 1, explain: 'Toda AC pública registra os certificados que emite; consultar esse registro é passivo e lista os nomes de host, inclusive os que ninguém lembra que existem.' },
      { type: 'fill', q: 'O identificador único de uma vulnerabilidade pública, no formato "ano-número", é a ___.', answer: ['CVE'], explain: 'A CVE permite que todos falem da mesma falha sem ambiguidade; a nota de gravidade é o CVSS.' },
      { type: 'mc', q: 'Por que atualizar os sistemas é considerado a defesa número um?', options: ['Porque deixa o sistema mais rápido', 'Porque a maioria dos ataques usa falhas antigas já corrigidas', 'Porque elimina a necessidade de MFA', 'Porque impede qualquer zero-day'], answer: 1, explain: 'Aplicar patches fecha a janela de exposição e neutraliza a mercadoria mais barata do atacante.' },
      { type: 'mc', q: 'Injeção, XSS e falhas de autenticação têm uma raiz comum. Qual?', options: ['O banco de dados estar desatualizado', 'A aplicação confiar em algo que veio de fora sem validar, escapar ou autenticar', 'O uso de HTTPS', 'A falta de antivírus no servidor'], answer: 1, explain: 'Injeção confia que a entrada é só dado; XSS confia que o texto é seguro para exibir; autenticação fraca confia em quem apresenta a credencial. A postura defensiva é tratar toda entrada como suspeita.' },
      { type: 'tf', q: 'Tirar do menu o link para o documento de outro cliente resolve o IDOR, pois o usuário deixa de ver o documento alheio.', answer: false, explain: 'Esconder o link não impede trocar o id na URL. A única defesa é o servidor verificar, a cada requisição, se o recurso pertence a quem pede.' },
      { type: 'fill', q: 'No ransomware moderno, a etapa em que o atacante copia os dados para fora da empresa antes de criptografá-los chama-se ___.', answer: ['exfiltração', 'exfiltracao'], explain: 'A exfiltração é o que permite a dupla extorsão: mesmo com backup, os dados copiados podem ser publicados.' },
      { type: 'mc', q: 'Um e-mail "do diretor" pede uma transferência urgente e sigilosa e vem de diretor@totali-contabilidade.com, enquanto o domínio oficial é totali.com.br. Qual é a leitura correta?', options: ['Normal: o diretor deve ter outro e-mail', 'Sinal clássico de fraude do CEO (BEC): domínio parecido mais urgência e sigilo; confirme por um segundo canal antes de qualquer pagamento', 'Pode pagar se o valor for pequeno', 'Basta responder ao e-mail pedindo confirmação'], answer: 1, explain: 'Domínio trocado, pressa e pedido de sigilo são a assinatura do BEC. Responder ao próprio e-mail não serve: a confirmação tem de ir por um canal já conhecido, como o telefone cadastrado.' },
      { type: 'match', q: 'Relacione o recurso de treino ou documento à sua função.', pairs: [['OWASP Juice Shop', 'App vulnerável para praticar legalmente'], ['Sumário executivo', 'Resumo do relatório para a direção'], ['Reteste', 'Verificar as correções depois'], ['TryHackMe', 'Plataforma de treino autorizada']], explain: 'Laboratórios e plataformas fornecem o alvo autorizado; o relatório comunica e prevê verificação.' },
      { type: 'code', q: 'Escreva `urgencia(nota, exposto, explorado)` que decide quando corrigir uma falha a partir da nota CVSS e de dois booleanos (o serviço está exposto à internet? já há exploração ativa?). Devolva "Imediata" se exposto e explorado forem ambos True; senão, "Esta semana" se a nota for 7.0 ou mais, ou se exposto ou explorado for True; senão, "Próximo ciclo".', starter: `def urgencia(nota, exposto, explorado):
    pass
`, tests: `assert urgencia(7.5, True, True) == "Imediata", "Exposto e explorado: Imediata, mesmo com nota 7.5"
assert urgencia(9.8, False, False) == "Esta semana", "Crítica, mas nem exposta nem explorada: Esta semana"
assert urgencia(5.0, True, False) == "Esta semana", "Média, mas exposta: Esta semana"
assert urgencia(5.0, False, True) == "Esta semana", "Média, mas já explorada: Esta semana"
assert urgencia(7.0, False, False) == "Esta semana", "Nota 7.0 já entra em Esta semana"
assert urgencia(6.9, False, False) == "Próximo ciclo", "Média, interna e sem exploração: Próximo ciclo"
assert urgencia(3.0, False, False) == "Próximo ciclo", "Baixa, interna e sem exploração: Próximo ciclo"
`, solution: `def urgencia(nota, exposto, explorado):
    if exposto and explorado:
        return "Imediata"
    if nota >= 7.0 or exposto or explorado:
        return "Esta semana"
    return "Próximo ciclo"
`, hint: 'Teste primeiro a condição mais urgente (exposto e explorado); depois a intermediária (nota alta ou um dos dois sinais); o resto é "Próximo ciclo".', explain: 'A nota CVSS prioriza, mas exposição e exploração ativa (EPSS, KEV) definem a urgência real; a função traduz a regra de bolso da lição 5 em código.' },
      { type: 'code', q: 'Escreva `dominio(email)` que devolve, em minúsculas, o que vem depois do último "@" do endereço, e `suspeito(email, oficial)` que devolve True se o domínio do e-mail for diferente de `oficial` (comparação sem diferenciar maiúsculas) e False se for igual.', starter: `def dominio(email):
    pass

def suspeito(email, oficial):
    pass
`, tests: `assert dominio("Joao.Silva@Totali.com.br") == "totali.com.br", "dominio deve devolver o trecho após o @ em minúsculas"
assert dominio("diretor@totali-contabilidade.com") == "totali-contabilidade.com", "dominio deve pegar o que vem depois do último @"
assert suspeito("diretor@totali-contabilidade.com", "totali.com.br") is True, "Domínio parecido, mas diferente, é suspeito"
assert suspeito("Diretor@TOTALI.com.br", "totali.com.br") is False, "Mesmo domínio, só com maiúsculas, não é suspeito"
assert suspeito("financeiro@totali.com.br.golpe.net", "totali.com.br") is True, "O domínio real é o que vem por último; totali.com.br.golpe.net é outro domínio"
`, solution: `def dominio(email):
    return email.rsplit("@", 1)[-1].lower()

def suspeito(email, oficial):
    return dominio(email) != oficial.lower()
`, hint: 'email.rsplit("@", 1)[-1] pega o que vem depois do último @; compare tudo em lower().', explain: 'A fraude do CEO vive de domínios parecidos. Conferir o domínio real (lido da direita para a esquerda) é a verificação técnica; a confirmação por segundo canal é a de processo.' },
      { type: 'mc', q: 'Ao avaliar um relatório de pentest como cliente, o que indica um bom trabalho?', options: ['Muitos achados sem ordem de prioridade', 'Sumário executivo claro, achados com severidade e evidência, recomendações priorizadas e plano de reteste', 'Apenas a saída de uma ferramenta', 'Nenhuma menção a escopo'], answer: 1, explain: 'Clareza executiva, priorização, confirmação dos achados e reteste separam um pentest sério de um scan vendido como tal.' },
    ],
  },
});
