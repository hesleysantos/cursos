registerModule({
  course: 'vibecoding',
  id: 'vc-04',
  order: 4,
  level: 'Avançado',
  title: 'Vibe Coding I: construindo com IA',
  description: 'Você vai construir software descrevendo o que quer e deixando a IA gerar o código, com método: especificar antes, iterar em passos pequenos, testar, depurar, versionar com Git e publicar com domínio próprio. Ao final, terá uma landing page e uma calculadora de honorários no ar, versionadas no GitHub, e saberá o mínimo de web (HTML, CSS, JavaScript, HTTP, JSON, APIs) para conversar com qualquer ferramenta de vibe coding.',
  hours: 11,
  lessons: [
    {
      id: 'vc-04-01',
      title: 'O que é vibe coding',
      minutes: 25,
      content: 'content/vibecoding/vc-04/01-o-que-e-vibe-coding.md',
      exercises: [
        { type: 'order', q: 'Coloque na ordem as etapas do ciclo de vibe coding.', items: ['Descrever o que se quer', 'Gerar o código com a IA', 'Rodar o resultado', 'Testar como um usuário', 'Iterar descrevendo o que falta'], explain: 'O ciclo é descrever → gerar → rodar → testar → iterar, repetido em passos pequenos.' },
        { type: 'mc', q: 'Qual é a diferença essencial entre no-code e vibe coding?', options: ['Vibe coding é gratuito', 'No-code é para sites; vibe coding é para apps', 'No no-code você arrasta blocos prontos; no vibe coding a IA gera código de verdade, e o limite é a sua capacidade de descrever e verificar', 'Não há diferença'], answer: 2, explain: 'No no-code, o que a ferramenta não oferece não existe; no vibe coding, o código gerado pode fazer qualquer coisa que você consiga especificar e testar.' },
        { type: 'tf', q: 'Se a calculadora gerada pela IA calcular um honorário errado, a responsabilidade é da ferramenta de IA.', answer: false, explain: 'Você continua responsável pelo que publica e usa; a IA é uma ferramenta, e o teste é seu.' },
        { type: 'mc', q: 'Por que o ciclo de vibe coding usa pedidos pequenos?', options: ['Porque a IA só aceita textos curtos', 'Porque pedidos pequenos são testáveis e corrigíveis; um pedido gigante gera algo que ninguém consegue testar', 'Para economizar créditos', 'Porque o navegador trava com pedidos grandes'], answer: 1, explain: 'Cada iteração pequena tem um alvo claro e um teste claro; como lançamentos contábeis, vários pequenos e certos valem mais que um grande e duvidoso.' },
        { type: 'match', q: 'Relacione o mito à realidade.', pairs: [['"A IA faz tudo, eu só peço"', 'Sem teste e especificação, o resultado é aleatório'], ['"O código gerado é seguro"', 'Pode conter falhas; peça revisão e nunca coloque segredos'], ['"Não preciso entender nada"', 'Precisa reconhecer erros e saber o que está pedindo'], ['"Serve para qualquer sistema"', 'Serve para pequenos e médios; críticos exigem engenharia']], explain: 'Cada mito ignora uma responsabilidade que continua sendo do humano.' },
        { type: 'fill', q: 'No prompt de arranque, pedir que a IA faça ___ antes de gerar código evita que ela preencha lacunas com suposições.', answer: ['perguntas', 'as perguntas', 'perguntas necessárias', 'questões'], explain: 'Perguntar antes obriga a IA a levantar o que está ambíguo, em vez de assumir e seguir.' },
        { type: 'mc', q: 'Qual destas práticas do módulo 1 continua valendo no vibe coding?', options: ['Nunca usar IA para código', 'Usar só ferramentas gratuitas', 'Evitar testar', 'Não colar senhas, chaves ou dados reais de clientes nos prompts'], answer: 3, explain: 'Privacidade e segurança não mudam: dados reais só no sistema pronto e protegido; nos prompts, dados fictícios.' },
      ],
    },
    {
      id: 'vc-04-02',
      title: 'Ferramentas de vibe coding em 2026',
      minutes: 25,
      content: 'content/vibecoding/vc-04/02-ferramentas.md',
      exercises: [
        { type: 'match', q: 'Relacione a ferramenta à família.', pairs: [['Lovable', 'Construtor de app por prompt, no navegador'], ['Cursor', 'Editor com IA derivado do VS Code'], ['Claude Code', 'Agente de terminal'], ['GitHub Copilot', 'Extensão de IA para o VS Code']], explain: 'Construtores mostram o app pronto no navegador; editores mostram os arquivos; agentes trabalham por texto no terminal; o Copilot é a extensão que dá IA ao VS Code.' },
        { type: 'mc', q: 'Qual família de ferramenta dá o MAIOR controle sobre os arquivos e os comandos executados?', options: ['Construtores por prompt', 'Editores com IA', 'Agentes de terminal', 'Todas dão o mesmo controle'], answer: 2, explain: 'O agente lê, cria e altera arquivos e roda comandos sob sua instrução; é a família de controle mais alto e também a que mais exige familiaridade com pastas e terminal.' },
        { type: 'tf', q: 'Para quem nunca abriu um terminal nem uma pasta de projeto, a recomendação é começar por um agente de terminal.', answer: false, explain: 'A escada é: construtor por prompt → editor com IA → agente. Começar pelo degrau mais alto gera frustração.' },
        { type: 'order', q: 'Ordene os critérios de escolha de ferramenta conforme a lição.', items: ['Seu conforto com o computador', 'O que você vai construir', 'Exportação do código para o GitHub', 'Política de privacidade dos dados', 'Modelo de cobrança'], explain: 'O perfil da pessoa vem primeiro; depois o projeto; exportação e privacidade são eliminatórios; o custo fecha a decisão.' },
        { type: 'mc', q: 'Por que a exportação do código para o GitHub é critério de escolha?', options: ['Porque o GitHub é obrigatório por lei', 'Porque sem exportação o projeto fica preso na plataforma (lock-in)', 'Porque o código fica mais rápido', 'Porque a IA só funciona com GitHub'], answer: 1, explain: 'Sem exportar, semanas de trabalho dependem de um serviço; com o código no GitHub, você muda de ferramenta quando quiser.' },
        { type: 'fill', q: 'VS Code com a extensão GitHub ___ oferece sugestões de código, chat e modo agente dentro do editor.', answer: ['copilot'], explain: 'O Copilot é a extensão de IA do GitHub para o VS Code; Cursor e Windsurf são editores derivados do VS Code com IA integrada desde o início.' },
        { type: 'mc', q: 'O que deve ser conferido na política de uso de dados de uma ferramenta de vibe coding antes de usá-la com projetos do escritório?', options: ['Se tem versão em português', 'Se o código e os prompts são usados para treinar modelos e se há opção de desligar isso', 'Se aceita cartão de crédito', 'Se tem tema escuro'], answer: 1, explain: 'Projetos podem conter lógica e dados sensíveis; saber se eles alimentam o treinamento de terceiros é obrigatório, especialmente com dados de clientes.' },
      ],
    },
    {
      id: 'vc-04-03',
      title: 'O mínimo de web para vibe coders',
      minutes: 35,
      content: 'content/vibecoding/vc-04/03-minimo-de-web.md',
      exercises: [
        { type: 'match', q: 'Relacione a tecnologia ao seu papel.', pairs: [['HTML', 'Estrutura: títulos, formulários, botões'], ['CSS', 'Aparência: cores, tamanhos, layout'], ['JavaScript', 'Comportamento: o que acontece ao clicar']], explain: 'Esqueleto, roupa e músculo: pedir "mude só o CSS do botão" é mais preciso do que "deixe mais bonito".' },
        { type: 'mc', q: 'O que significa um código de status HTTP 404?', options: ['Deu certo', 'Sem permissão', 'Não encontrado: o endereço ou o arquivo não existe', 'Erro no servidor'], answer: 2, explain: '404 indica que o recurso pedido não foi encontrado; conferir o caminho ou o nome do arquivo.' },
        { type: 'tf', q: 'Uma calculadora de honorários que faz a conta em JavaScript pode funcionar inteiramente no navegador, sem servidor.', answer: true, explain: 'Front-end puro resolve cálculos; servidor só é necessário quando há dados por usuário, login ou segredos.' },
        { type: 'fill', q: 'Em uma mensagem de erro, as três partes úteis são o tipo, a descrição e o ___ (arquivo e linha).', answer: ['lugar', 'local', 'localização'], explain: 'O lugar diz onde olhar; junto com tipo e descrição, é o que você copia inteiro para a IA.' },
        { type: 'mc', q: 'Onde deve ficar a chave de API usada para integrar com o Airtable?', options: ['No arquivo JavaScript da página', 'Em uma variável de ambiente, nunca no código', 'No HTML, em um comentário', 'No nome do arquivo'], answer: 1, explain: 'Chave no código vai para o GitHub e vaza; variável de ambiente mantém o segredo fora do repositório.' },
        {
          type: 'code',
          q: 'Escreva a função `ler_cliente(texto)` que recebe um texto JSON com o campo "cliente" e devolve o nome do cliente. Use o módulo json.',
          starter: `import json

def ler_cliente(texto):
    pass
`,
          tests: `assert ler_cliente('{"cliente": "Padaria Central", "valor": 1500.0}') == "Padaria Central", "Deveria devolver Padaria Central"
assert ler_cliente('{"valor": 10, "cliente": "Oficina do Zé"}') == "Oficina do Zé", "Deveria devolver Oficina do Zé"
`,
          solution: `import json

def ler_cliente(texto):
    dados = json.loads(texto)
    return dados["cliente"]
`,
          hint: 'json.loads(texto) transforma o texto em dicionário; depois acesse a chave "cliente".',
          explain: 'json.loads converte o texto JSON em um dicionário Python; a chave "cliente" devolve o nome.',
        },
        {
          type: 'code',
          q: 'Escreva a função `validar_cnpj(cnpj)` que devolve True se o texto tiver exatamente 14 caracteres e todos forem dígitos; caso contrário, False.',
          starter: `def validar_cnpj(cnpj):
    pass
`,
          tests: `assert validar_cnpj("12345678000190") is True, "14 dígitos deveria ser válido"
assert validar_cnpj("123") is False, "3 dígitos deveria ser inválido"
assert validar_cnpj("123456780001901") is False, "15 dígitos deveria ser inválido (exatamente 14)"
assert validar_cnpj("1234567800019a") is False, "Letra no meio deveria ser inválido"
assert validar_cnpj("12.345.678/0001-90") is False, "Com pontuação deveria ser inválido (só dígitos)"
assert validar_cnpj("") is False, "Vazio deveria ser inválido"
`,
          solution: `def validar_cnpj(cnpj):
    return len(cnpj) == 14 and cnpj.isdigit()
`,
          hint: 'Combine len(cnpj) == 14 com cnpj.isdigit() usando and.',
          explain: 'A validação de formato é a mesma que você vai pedir à IA no formulário: tamanho fixo e só dígitos.',
        },
        {
          type: 'code',
          q: 'Escreva a função `pendentes(texto)` que recebe um texto JSON com uma lista de honorários (cada um com "competencia" e "pago") e devolve a lista das competências com pago igual a False, na ordem em que aparecem.',
          starter: `import json

def pendentes(texto):
    pass
`,
          tests: `dados = '[{"competencia": "2026-01", "pago": true}, {"competencia": "2026-02", "pago": false}, {"competencia": "2026-03", "pago": false}]'
assert pendentes(dados) == ["2026-02", "2026-03"], "Deveria devolver as competências não pagas, em ordem"
assert pendentes('[{"competencia": "2026-01", "pago": true}]') == [], "Sem pendentes deveria devolver lista vazia"
`,
          solution: `import json

def pendentes(texto):
    lista = json.loads(texto)
    return [h["competencia"] for h in lista if not h["pago"]]
`,
          hint: 'json.loads devolve uma lista de dicionários; percorra com for e guarde a competência de quem tem pago == False.',
          explain: 'Ler JSON, percorrer a lista e filtrar por uma condição é o padrão de quase toda lógica de sistema.',
        },
      ],
    },
    {
      id: 'vc-04-04',
      title: 'Especificar antes de gerar',
      minutes: 28,
      content: 'content/vibecoding/vc-04/04-especificar-antes-de-gerar.md',
      exercises: [
        { type: 'mc', q: 'O que é um PRD, no contexto desta lição?', options: ['Um tipo de arquivo de código', 'Um documento curto que descreve o que o sistema faz, para quem, com dados, telas, regras e critérios de aceite', 'Uma ferramenta de deploy', 'O histórico de versões'], answer: 1, explain: 'O PRD é o contrato entre você e a IA: decisões tomadas antes, em texto simples, para que cada iteração tenha alvo.' },
        { type: 'fill', q: 'Uma história de usuário segue o formato "Como [papel], quero [ação] para [___]".', answer: ['benefício', 'beneficio', 'objetivo'], explain: 'O "para" força a pensar no porquê da funcionalidade.' },
        { type: 'mc', q: 'Qual destes é um critério de aceite válido?', options: ['A tela deve ser intuitiva', 'O sistema deve ser rápido', 'O botão Salvar fica desabilitado até o CNPJ ter 14 dígitos', 'O design deve agradar o sócio'], answer: 2, explain: 'Critério de aceite é objetivo e testável; "intuitivo" e "rápido" são opiniões, não verificações.' },
        { type: 'tf', q: 'A seção "fora do escopo" do PRD é opcional e serve apenas para registrar ideias futuras.', answer: false, explain: 'Ela delimita o que não será feito nesta versão, evitando que a IA (e você) encham o projeto; é a seção que mais economiza tempo.' },
        { type: 'order', q: 'Ordene as etapas do prompt de arranque.', items: ['Definir o papel da IA e o contexto', 'Colar o PRD', 'Listar as restrições técnicas', 'Pedir perguntas sobre o que estiver ambíguo', 'Pedir a estrutura e esperar aprovação'], explain: 'Papel, PRD e restrições dão o contexto; perguntas e aprovação colocam você no controle antes de gastar tempo gerando código.' },
        { type: 'match', q: 'Relacione a seção do PRD ao conteúdo.', pairs: [['Objetivo', 'Uma frase com o problema que resolve'], ['Dados', 'Tabelas e campos'], ['Regras', 'Cálculos, validações, permissões'], ['Critérios de aceite', 'Como saber que está pronto']], explain: 'Cada seção responde a uma pergunta que, se ficar sem resposta, a IA vai responder sozinha.' },
        {
          type: 'code',
          q: 'Implemente a regra de situação do controle de honorários: `situacao(data_pagamento, vencimento, hoje)` devolve "Pago" se data_pagamento não for None; senão "Atrasado" se hoje for posterior ao vencimento; senão "Pendente". As datas são textos no formato AAAA-MM-DD (podem ser comparados diretamente como texto).',
          starter: `def situacao(data_pagamento, vencimento, hoje):
    pass
`,
          tests: `assert situacao("2026-03-05", "2026-03-10", "2026-03-20") == "Pago", "Com data de pagamento deveria ser Pago"
assert situacao(None, "2026-03-10", "2026-03-20") == "Atrasado", "Sem pagamento e vencimento passado deveria ser Atrasado"
assert situacao(None, "2026-03-10", "2026-03-05") == "Pendente", "Sem pagamento e antes do vencimento deveria ser Pendente"
assert situacao(None, "2026-03-10", "2026-03-10") == "Pendente", "No dia do vencimento ainda é Pendente"
`,
          solution: `def situacao(data_pagamento, vencimento, hoje):
    if data_pagamento is not None:
        return "Pago"
    if hoje > vencimento:
        return "Atrasado"
    return "Pendente"
`,
          hint: 'Três casos em ordem: pago primeiro; depois compare hoje > vencimento; o resto é Pendente.',
          explain: 'A regra escrita no PRD vira três decisões em sequência; é exatamente o que você pediria à IA em JavaScript.',
        },
      ],
    },
    {
      id: 'vc-04-05',
      title: 'Projeto guiado 1: landing page com formulário',
      minutes: 24,
      content: 'content/vibecoding/vc-04/05-projeto-landing-page.md',
      exercises: [
        { type: 'mc', q: 'O que caracteriza uma landing page?', options: ['Muitas páginas com menu completo', 'Página com login', 'Página só para celular', 'Página única com um objetivo e uma ação para o visitante'], answer: 3, explain: 'Um objetivo, uma ação: por isso é o projeto ideal para começar, só front-end e resultado imediato.' },
        { type: 'tf', q: 'Uma página estática, sem servidor, consegue gravar sozinha as respostas do formulário em uma planilha.', answer: false, explain: 'Ela precisa enviar os dados para algo que grave: um serviço de formulário, um webhook de automação ou um Apps Script.' },
        { type: 'order', q: 'Ordene os passos do projeto da landing page.', items: ['Escrever a especificação mínima e os textos reais', 'Gerar a página com o prompt de arranque', 'Ajustar texto e estilo, um item por prompt', 'Ligar o formulário a um destino (serviço, webhook ou script)', 'Enviar um contato de teste e conferir que chegou ao destino', 'Divulgar o endereço'], explain: 'Especificar, gerar, ajustar, integrar, testar o envio real e só então divulgar: o ciclo completo em um projeto pequeno.' },
        { type: 'fill', q: 'O formulário envia os dados ao destino por uma requisição HTTP do tipo ___, com o corpo em JSON.', answer: ['post'], explain: 'POST é o método HTTP para enviar dados; GET é para buscar.' },
        { type: 'mc', q: 'Por que pedir "um ajuste por prompt" ao construtor por prompt?', options: ['Porque a ferramenta cobra por palavra', 'Porque com vários pedidos juntos a IA aplica uns e esquece outros', 'Porque o navegador trava', 'Não há motivo; pode pedir tudo junto'], answer: 1, explain: 'Pedidos isolados são aplicados e verificados um a um; pedidos empilhados se perdem.' },
        { type: 'match', q: 'Relacione a forma de ligar o formulário à característica.', pairs: [['Serviço de formulário', 'Cadastra, recebe um endpoint, encaminha por e-mail'], ['Webhook de automação', 'Make/Zapier/n8n recebe e grava na planilha'], ['Google Apps Script', 'Script ligado à planilha, sem serviço intermediário']], explain: 'Do mais simples ao mais flexível; em todos, o formulário faz POST em JSON para um endereço.' },
        { type: 'mc', q: 'O envio do formulário falhou e nada aconteceu na tela. Qual é o problema de projeto?', options: ['Nenhum; o usuário tenta de novo', 'O CSS está errado', 'Falta feedback de erro: contatos se perdem sem que ninguém saiba', 'O servidor está lento'], answer: 2, explain: 'Sem mensagem de erro, a falha é silenciosa; o critério de aceite exige "se falhar, mostre uma alternativa sem perder o digitado".' },
      ],
    },
    {
      id: 'vc-04-06',
      title: 'Depurar com IA',
      minutes: 27,
      content: 'content/vibecoding/vc-04/06-depurar-com-ia.md',
      exercises: [
        { type: 'mc', q: 'A mensagem "TypeError: Cannot read properties of null (reading \'value\') at calcular (app.js:42)" indica o quê?', options: ['Erro de sintaxe no HTML', 'Um elemento da página não foi encontrado (veio null) e o código tentou ler seu valor, na linha 42 de app.js', 'O servidor caiu', 'O arquivo app.js não existe'], answer: 1, explain: 'Tipo (TypeError), descrição (null não tem .value) e lugar (app.js:42): o elemento esperado não existe ou tem outro id.' },
        { type: 'fill', q: 'A instrução "se faltar informação para ter certeza da causa, não ___: me diga o que precisa ver" deve abrir toda sessão de depuração.', answer: ['adivinhe', 'adivinhar', 'chute'], explain: 'Proibir a adivinhação evita que a IA corrija um problema imaginado e introduza outro.' },
        { type: 'order', q: 'Ordene, conforme a lição, o que incluir em um prompt de depuração.', items: ['A mensagem de erro completa', 'O que você fez para o erro aparecer', 'O que esperava que acontecesse', 'O que já tentou', 'O pedido de explicação antes da correção'], explain: 'Evidência primeiro (erro, ação, expectativa), depois histórico, e por fim a forma de resposta desejada.' },
        { type: 'tf', q: 'Envolver o código inteiro em um try/except (ou try/catch, em JavaScript) para o erro parar de aparecer é uma forma válida de corrigir a causa.', answer: false, explain: 'Isso esconde o sintoma; o bug continua. Pergunte sempre: "isso corrige a causa ou só esconde o sintoma?".' },
        { type: 'match', q: 'Relacione a mensagem ao tipo de problema.', pairs: [['SyntaxError: Unexpected token \'}\'', 'Sintaxe: falta ou sobra uma chave'], ['404 Not Found ao carregar estilos.css', 'HTTP: arquivo não existe no caminho'], ['KeyError: \'valor\'', 'Dados: o JSON não tem a chave esperada']], explain: 'Reconhecer o tipo já aponta onde procurar antes mesmo de perguntar à IA.' },
        { type: 'mc', q: 'Depois de três iterações de correção sem progresso, o que fazer?', options: ['Pedir à IA que tente mais cinco vezes', 'Apagar o projeto', 'Mudar de ferramenta', 'Reverter para a última versão que funcionava e recomeçar com um pedido menor'], answer: 3, explain: 'Reverter é a saída mais barata de um buraco; por isso versionar antes de cada mudança importante é obrigatório.' },
        { type: 'mc', q: 'O console mostra cinco erros. Por qual começar?', options: ['Pelo primeiro, porque os seguintes costumam ser consequência dele', 'Pelo último, que é o mais recente', 'Por qualquer um', 'Pelo que tem o texto mais longo'], answer: 0, explain: 'O primeiro erro costuma derrubar o resto; corrigido ele, os outros frequentemente somem.' },
        { type: 'fill', q: 'No navegador, a tecla ___ abre as ferramentas do desenvolvedor, onde a aba Console mostra os erros de JavaScript.', answer: ['f12', 'F12'], explain: 'F12 (ou o menu de ferramentas do desenvolvedor) dá acesso ao Console e à aba Rede.' },
      ],
    },
    {
      id: 'vc-04-07',
      title: 'Git e GitHub para quem não programa',
      minutes: 25,
      content: 'content/vibecoding/vc-04/07-git-e-github.md',
      exercises: [
        { type: 'match', q: 'Relacione o termo à definição.', pairs: [['Commit', 'Uma versão salva, com mensagem'], ['Branch', 'Linha paralela de trabalho'], ['Push', 'Enviar os commits para o GitHub'], ['Repositório', 'A pasta do projeto com o histórico dentro']], explain: 'Esses quatro termos cobrem o uso diário do Git em projetos de vibe coding.' },
        { type: 'mc', q: 'Qual é a diferença entre Git e GitHub?', options: ['São a mesma coisa', 'Git é o programa que guarda o histórico na sua pasta; GitHub é o serviço que guarda uma cópia na internet', 'Git é pago; GitHub é gratuito', 'GitHub é para Windows; Git é para Mac'], answer: 1, explain: 'Git é a ferramenta; GitHub é o lugar (backup, colaboração, hospedagem de páginas).' },
        { type: 'tf', q: 'Uma chave de API enviada por engano a um repositório privado no GitHub pode ser mantida, porque o repositório é privado.', answer: false, explain: 'Considere a chave vazada e troque-a; o histórico guarda o valor e repositórios mudam de visibilidade e de membros.' },
        { type: 'order', q: 'Ordene o fluxo de trabalho com GitHub Desktop.', items: ['Fazer um commit antes de pedir a mudança à IA', 'Pedir a mudança e testar', 'Ler as alterações linha a linha no GitHub Desktop', 'Escrever a mensagem e confirmar o commit', 'Enviar (push) para o GitHub'], explain: 'Commit antes protege; ler as alterações revela o que a IA mexeu; o push é o backup.' },
        { type: 'fill', q: 'O arquivo ___ na raiz do projeto lista o que o Git deve ignorar, como o .env com segredos.', answer: ['.gitignore', 'gitignore'], explain: 'Sem ele, segredos e dependências vão parar no repositório.' },
        { type: 'mc', q: 'Qual mensagem de commit segue a boa prática?', options: ['ajustes', 'várias mudanças', 'Corrige cálculo de atraso quando o vencimento cai no fim de semana', 'commit'], answer: 2, explain: 'A mensagem descreve o que mudou; é o que permite entender o histórico e saber para onde voltar.' },
        { type: 'mc', q: 'O que o GitHub Pages hospeda?', options: ['Qualquer aplicação com banco de dados', 'Páginas estáticas (HTML, CSS, JavaScript) direto do repositório', 'Apenas arquivos PDF', 'Scripts Python no servidor'], answer: 1, explain: 'Pages serve arquivos estáticos; para código no servidor, use Vercel, Netlify ou outra plataforma.' },
      ],
    },
    {
      id: 'vc-04-08',
      title: 'Deploy e domínio',
      minutes: 25,
      content: 'content/vibecoding/vc-04/08-deploy-e-dominio.md',
      exercises: [
        { type: 'fill', q: 'Quando cada push no repositório republica o projeto automaticamente, chamamos isso de deploy ___.', answer: ['contínuo', 'continuo', 'automático', 'automatico'], explain: 'O deploy contínuo combina com o ciclo de vibe coding: iteração testada, commit, push, no ar.' },
        { type: 'mc', q: 'Uma chave de API está em variável de ambiente, mas o código que a usa roda no JavaScript da página. A chave está protegida?', options: ['Sim, variável de ambiente sempre protege', 'Não: o que roda no navegador é visível para quem abrir o código-fonte; a chamada precisa ir para uma função de servidor', 'Sim, desde que o site tenha HTTPS', 'Depende do navegador'], answer: 1, explain: 'Variável de ambiente só protege o que roda no servidor; no cliente, qualquer valor embutido fica exposto.' },
        { type: 'match', q: 'Relacione o serviço à característica.', pairs: [['GitHub Pages', 'Só estático, zero configuração'], ['Netlify', 'Deploy contínuo com formulários e funções'], ['Vercel', 'Deploy contínuo, forte com projetos do v0 e frameworks modernos']], explain: 'Os três hospedam estático; funções de servidor só em Netlify e Vercel.' },
        { type: 'tf', q: 'O arquivo .env.example deve conter os valores reais das chaves para facilitar a configuração.', answer: false, explain: 'O .env.example documenta os nomes das variáveis, sem valores; os valores ficam no .env (ignorado) e no painel do serviço.' },
        { type: 'order', q: 'Ordene os passos para ligar um domínio próprio ao projeto.', items: ['Registrar o domínio no registrador', 'Cadastrar o subdomínio no painel do serviço de deploy', 'Criar os registros de DNS no registrador', 'Aguardar a propagação e a emissão do HTTPS', 'Testar no endereço final'], explain: 'O serviço informa os registros; o registrador os aplica; HTTPS é automático; o teste fecha.' },
        { type: 'mc', q: 'Qual situação costuma tirar um projeto do plano gratuito?', options: ['Ter domínio próprio', 'Usar HTTPS', 'Tráfego acima do limite mensal ou uso comercial em serviço que diferencia isso nos termos', 'Ter mais de um commit por dia'], answer: 2, explain: 'Domínio e HTTPS não custam a mais nos serviços; tráfego, uso comercial, funções e colaboradores são os gatilhos de cobrança.' },
        { type: 'mc', q: 'Por que testar no endereço publicado, e não só no computador?', options: ['Porque o computador não roda JavaScript', 'Porque o ambiente publicado tem diferenças: caminhos, HTTPS, variáveis de ambiente', 'Porque o GitHub exige', 'Não é necessário'], answer: 1, explain: 'O que funciona localmente pode falhar no ar por um caminho relativo, uma variável não cadastrada ou um deploy que não foi refeito.' },
      ],
    },
    {
      id: 'vc-04-09',
      title: 'Projeto guiado 2: Calculadora de honorários',
      minutes: 27,
      content: 'content/vibecoding/vc-04/09-projeto-calculadora-honorarios.md',
      exercises: [
        { type: 'mc', q: 'Pelas regras fictícias da lição, qual é o honorário para Simples, faturamento 50.000, 3 funcionários e adicional de folha?', options: ['600', '825', '1.025', '1.225'], answer: 2, explain: 'Base 600 + 20% de 600 (faixa de 30.000,01 a 100.000) = 120 + 3 × 35 = 105 + folha 200 = 1.025.' },
        { type: 'tf', q: 'Faturamento exatamente igual a 30.000 recebe o acréscimo de 20% da base.', answer: false, explain: 'A faixa "até 30.000" tem acréscimo zero; 30.000,01 já entra na faixa de 20%. Limites são onde os bugs moram; teste os dois.' },
        { type: 'order', q: 'Ordene as partes do projeto da calculadora.', items: ['Escrever o PRD com critérios de aceite calculados à mão', 'Ligar o Git na pasta e fazer o primeiro commit', 'Gerar com o prompt de arranque, aprovando a estrutura', 'Testar caso a caso, incluindo limites e erro', 'Publicar e testar no ar', 'Avaliar pela rubrica'], explain: 'Especificação, versionamento, geração, teste, publicação, avaliação: o ciclo completo.' },
        { type: 'mc', q: 'Por que pedir à IA que separe a função de cálculo da parte que mexe na tela?', options: ['Para o código ficar menor', 'Para poder testar o cálculo isoladamente e reaproveitá-lo em outro projeto', 'Porque o navegador exige', 'Para economizar créditos'], answer: 1, explain: 'Cálculo separado é testável sem clicar em nada e vira, por exemplo, a página de orçamento do site sem reescrever.' },
        { type: 'match', q: 'Relacione o critério da rubrica à verificação.', pairs: [['Funciona', 'Todos os critérios de aceite passam, inclusive limites'], ['É claro', 'Um colega usa sem explicação e o código tem comentários'], ['Está versionado', 'Commits pequenos com mensagens, PRD no repositório, push feito'], ['Está no ar', 'Endereço público com HTTPS, testado no celular']], explain: 'Os quatro critérios se protegem: sem versão não há volta; sem clareza há dúvidas; sem publicação não há uso.' },
        {
          type: 'code',
          q: 'Implemente `calcular_honorario(regime, faturamento, funcionarios, adicionais)` com as regras fictícias da lição. Base: MEI 150, Simples 600, Presumido 1200, Real 2500. Acréscimo por faturamento: até 30000 zero; acima de 30000 até 100000, 20% da base; acima de 100000, 50% da base. Mais 35 por funcionário. `adicionais` é uma lista com itens entre "folha" (200), "fiscal" (300) e "consultoria" (400). Devolva o total.',
          starter: `def calcular_honorario(regime, faturamento, funcionarios, adicionais):
    base = {"MEI": 150, "Simples": 600, "Presumido": 1200, "Real": 2500}[regime]
    pass
`,
          tests: `assert calcular_honorario("Simples", 50000, 3, ["folha"]) == 1025, "Simples/50000/3/folha deveria dar 1025"
assert calcular_honorario("MEI", 0, 0, []) == 150, "MEI zerado deveria dar 150"
assert calcular_honorario("Real", 150000, 10, ["folha", "fiscal", "consultoria"]) == 5000, "Real completo deveria dar 5000"
assert calcular_honorario("Simples", 30000, 0, []) == 600, "Faturamento 30000 não tem acréscimo"
assert calcular_honorario("Simples", 30000.01, 0, []) == 720, "Faturamento 30000.01 tem 20% de acréscimo"
assert calcular_honorario("Presumido", 100000, 2, ["fiscal"]) == 1810, "Presumido/100000/2/fiscal deveria dar 1810"
`,
          solution: `def calcular_honorario(regime, faturamento, funcionarios, adicionais):
    base = {"MEI": 150, "Simples": 600, "Presumido": 1200, "Real": 2500}[regime]
    if faturamento > 100000:
        acrescimo = base * 0.5
    elif faturamento > 30000:
        acrescimo = base * 0.2
    else:
        acrescimo = 0
    valores = {"folha": 200, "fiscal": 300, "consultoria": 400}
    extras = sum(valores[a] for a in adicionais)
    return base + acrescimo + funcionarios * 35 + extras
`,
          hint: 'Teste as faixas da maior para a menor (> 100000, depois > 30000); some funcionários × 35 e os adicionais.',
          explain: 'São os mesmos critérios de aceite da lição, calculados à mão; se o seu código der outro número, ou o código ou a conta estão errados, e os dois precisam ser descobertos.',
        },
        { type: 'write', q: 'Escreva dois critérios de aceite novos para a calculadora, com entrada e resultado esperado calculados à mão, cobrindo um caso de limite e um caso de erro.', model: 'Limite: Presumido, faturamento 100.000, 0 funcionários, sem adicionais → 1.200 + 240 = 1.440 (100.000 ainda está na faixa de 20%). Erro: funcionários = -1 → mensagem "informe um número inteiro maior ou igual a zero", sem resultado.', checklist: ['O caso de limite está exatamente na fronteira de uma faixa?', 'O resultado esperado foi calculado à mão, com a composição?', 'O caso de erro diz o que a tela deve mostrar e o que não deve?'] },
      ],
    },
  ],
  exam: {
    passScore: 70,
    questions: [
      { type: 'order', q: 'Ordene o ciclo de vibe coding.', items: ['Descrever', 'Gerar', 'Rodar', 'Testar', 'Iterar'], explain: 'O ciclo se repete em passos pequenos; cada volta tem um alvo e um teste.' },
      { type: 'tf', q: 'No vibe coding, a IA escreve o código, mas a responsabilidade pelo resultado, pelos testes e pela segurança continua sendo sua.', answer: true, explain: 'Velocidade e barreira de entrada mudam; responsabilidade, teste, segurança e versionamento não.' },
      { type: 'mc', q: 'Qual família de ferramenta mostra o app pronto no navegador e publica com um botão, com menor controle sobre o código?', options: ['Agentes de terminal', 'Editores com IA', 'Construtores de app por prompt', 'Gerenciadores de versão'], answer: 2, explain: 'Lovable, v0, Bolt e Replit mostram o resultado ao lado da conversa; o preço é menos controle e risco de lock-in.' },
      { type: 'match', q: 'Relacione a tecnologia ao papel.', pairs: [['HTML', 'Estrutura'], ['CSS', 'Aparência'], ['JavaScript', 'Comportamento'], ['JSON', 'Formato dos dados']], explain: 'Com esse vocabulário, pedidos à IA ficam precisos.' },
      { type: 'mc', q: 'O código de status HTTP 500 indica o quê?', options: ['Deu certo', 'Não encontrado', 'Sem permissão', 'Erro no servidor (back-end)'], answer: 3, explain: '5xx é erro do lado do servidor; o problema está no back-end, e o registro de erros é o lugar para olhar.' },
      {
        type: 'code',
        q: 'Escreva a função `contar_pendentes(lista)` que recebe uma lista de dicionários com a chave "pago" (True/False) e devolve quantos têm pago igual a False.',
        starter: `def contar_pendentes(lista):
    pass
`,
        tests: `assert contar_pendentes([{"pago": True}, {"pago": False}, {"pago": False}]) == 2, "Deveria contar 2 pendentes"
assert contar_pendentes([]) == 0, "Lista vazia deveria dar 0"
assert contar_pendentes([{"pago": True}]) == 0, "Tudo pago deveria dar 0"
`,
        solution: `def contar_pendentes(lista):
    return sum(1 for h in lista if not h["pago"])
`,
        hint: 'Percorra a lista e conte os itens cujo "pago" é False.',
        explain: 'Percorrer e contar por condição é a lógica básica que você pede à IA em qualquer lista de registros.',
      },
      { type: 'mc', q: 'Qual destes é um critério de aceite testável?', options: ['O sistema deve ser moderno', 'A tela deve ser bonita', 'O código deve ser bom', 'Faturamento negativo mostra a mensagem "informe um valor válido" e não calcula'], answer: 3, explain: 'Entrada, comportamento e resultado esperado: isso é verificável; adjetivos não são.' },
      { type: 'fill', q: 'A seção do PRD que lista o que NÃO será feito nesta versão chama-se "fora do ___".', answer: ['escopo'], explain: 'É a seção que mais economiza tempo, porque impede que o projeto cresça sem controle.' },
      { type: 'mc', q: 'Como uma landing page estática envia as respostas do formulário para uma planilha?', options: ['Gravando direto no arquivo da planilha', 'Fazendo POST em JSON para um serviço de formulário, um webhook de automação ou um Apps Script', 'Não é possível', 'Enviando um e-mail pelo navegador'], answer: 1, explain: 'A página não grava sozinha; ela envia para um endereço que recebe e grava.' },
      { type: 'tf', q: 'Ao pedir ajuda à IA para um erro, é melhor resumir a mensagem ("deu um erro de null") do que colar a mensagem completa.', answer: false, explain: 'A mensagem completa tem tipo, descrição e lugar; o resumo perde justamente o que resolve.' },
      { type: 'mc', q: 'Qual pergunta separa uma correção de causa de uma que só esconde o sintoma?', options: ['"Isso deixa o código menor?"', '"Isso corrige a causa ou só esconde o sintoma?"', '"Isso é mais moderno?"', '"Isso usa menos créditos?"'], answer: 1, explain: 'Um try/except em volta de tudo faz o erro sumir e o bug continuar; peça explicação antes da correção.' },
      { type: 'mc', q: 'O que é um commit?', options: ['Uma versão salva do projeto, com mensagem, dentro do histórico do Git', 'Uma cópia da pasta com outro nome', 'O envio do projeto para a internet', 'Um ramo paralelo'], answer: 0, explain: 'Commit é o lançamento no livro diário do projeto: pequeno, descrito, datado; push é o envio ao GitHub.' },
      { type: 'fill', q: 'Segredos como chaves de API ficam fora do código, em variáveis de ___, cadastradas no painel do serviço de deploy.', answer: ['ambiente'], explain: 'Variáveis de ambiente mantêm o segredo fora do repositório; só protegem o que roda no servidor.' },
      { type: 'mc', q: 'Qual serviço NÃO serve para um projeto com código rodando no servidor?', options: ['Vercel', 'Netlify', 'GitHub Pages', 'Todos servem'], answer: 2, explain: 'GitHub Pages hospeda apenas arquivos estáticos; Vercel e Netlify oferecem funções de servidor.' },
      { type: 'mc', q: 'Na rubrica do projeto da calculadora, um sistema que funciona mas não está versionado deve ser considerado pronto?', options: ['Sim, funcionar é o que importa', 'Sim, se estiver no ar', 'Depende do tamanho', 'Não: sem versão, a próxima iteração pode quebrar tudo sem volta; os quatro critérios precisam passar'], answer: 3, explain: 'Funciona, é claro, está versionado, está no ar: quatro sins ou não está pronto.' },
    ],
  },
});
