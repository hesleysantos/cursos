registerModule({
  course: 'automacao',
  id: 'au-01',
  order: 1,
  level: 'Iniciante',
  title: 'Pensamento de automação',
  description: 'Você vai aprender a escolher o que automatizar, mapear e medir processos, entender dados estruturados, APIs, webhooks, autenticação e confiabilidade, e conhecer o panorama de ferramentas de 2026. Ao final, terá três processos do seu escritório mapeados e priorizados, prontos para virar automações.',
  hours: 8,
  lessons: [
    {
      id: 'au-01-01',
      title: 'O que automatizar',
      minutes: 27,
      content: 'content/automacao/au-01/01-o-que-automatizar.md',
      exercises: [
        { type: 'mc', q: 'Quais são os quatro critérios que tornam uma tarefa boa candidata a automação?', options: ['Cara, urgente, chata e nova', 'Repetitiva, baseada em regras, alto volume e propensa a erro', 'Manual, criativa, rara e complexa', 'Simples, divertida, visível e barata'], answer: 1, explain: 'Esses quatro critérios indicam que a tarefa pode ser descrita em passos fixos e que o retorno compensa o esforço de montar a automação.' },
        { type: 'tf', q: 'Uma tarefa que exige julgamento profissional, como decidir se uma despesa é dedutível, é uma boa candidata a automação completa.', answer: false, explain: 'Tarefas que exigem julgamento continuam com o contador; a automação pode preparar os dados, mas a decisão é humana.' },
        { type: 'mc', q: 'Ao explicar uma tarefa para um estagiário, você diz "depende" a cada passo. O que isso indica?', options: ['A tarefa está pronta para automação', 'A tarefa tem alto volume', 'A tarefa ainda não tem regras claras; padronize antes de automatizar', 'A tarefa deve ser feita por RPA'], answer: 2, explain: 'Muitos "depende" mostram que as regras não estão definidas; automatizar uma tarefa sem regras claras gera um fluxo que quebra nas exceções.' },
        { type: 'fill', q: 'Quando uma automação apenas muda onde a tarefa é feita, mas alguém ainda precisa terminar à mão, dizemos que a tarefa foi ___, não automatizada.', answer: ['deslocada', 'apenas deslocada', 'só deslocada'], explain: 'O ganho real só existe quando a pessoa deixa de fazer a tarefa; se ela só mudou de lugar, não houve economia.' },
        { type: 'match', q: 'Relacione a tarefa do escritório à parte que pode ser automatizada.', pairs: [['Conciliar extratos', 'Casar valores e datas idênticos; exceções ficam com a pessoa'], ['Cobrar documentos', 'Primeiro e segundo lembrete automáticos; cobrança por telefone é humana'], ['Enviar guias mensais', 'Todo o envio, com registro de data e hora'], ['Orientar troca de regime tributário', 'Nada: exige julgamento profissional']], explain: 'O padrão do escritório é automatizar a parte mecânica e deixar o julgamento e o relacionamento para a pessoa.' },
        { type: 'order', q: 'Ordene os passos para levantar candidatos a automação na primeira semana.', items: ['Anotar cada tarefa repetida durante a semana', 'Marcar os quatro critérios em cada tarefa', 'Separar as tarefas com três ou quatro critérios', 'Escolher as candidatas para mapear'], explain: 'Primeiro se observa, depois se classifica, depois se filtra e só então se escolhe por onde começar.' },
        { type: 'mc', q: 'Qual destes é um ganho real de automação, e não de fachada?', options: ['Um relatório gerado automaticamente que ninguém lê', 'Um robô que baixa extratos, mas alguém ainda renomeia e move os arquivos', 'Guias enviadas no mesmo dia e formato para todos os clientes, com registro de envio', 'Uma ferramenta nova instalada em todos os computadores'], answer: 2, explain: 'Consistência e rastreabilidade são ganhos concretos; os outros exemplos não eliminam trabalho humano nem produzem resultado útil.' },
        { type: 'tf', q: 'Um site de prefeitura que muda de layout todo mês é uma fonte ideal para automação, porque o volume de consultas é alto.', answer: false, explain: 'Fontes que mudam toda hora tornam a automação frágil e exigem manutenção constante; o volume sozinho não compensa isso.' },
      ],
    },
    {
      id: 'au-01-02',
      title: 'Mapear um processo',
      minutes: 27,
      content: 'content/automacao/au-01/02-mapear-processo.md',
      exercises: [
        { type: 'mc', q: 'Quais são as cinco peças de um processo mapeado?', options: ['Entradas, passos, decisões, saídas e exceções', 'Pessoas, prazos, custos, metas e riscos', 'Gatilho, API, webhook, JSON e log', 'Fornecedor, cliente, contrato, preço e nota'], answer: 0, explain: 'Essas cinco peças descrevem o que entra, o que acontece, onde o caminho se divide, o que sai e o que foge do normal.' },
        { type: 'match', q: 'Relacione o símbolo do fluxograma ao seu significado.', pairs: [['Círculo', 'Início ou fim'], ['Retângulo', 'Ação'], ['Losango', 'Decisão'], ['Seta', 'Ordem dos passos']], explain: 'Esses quatro símbolos são o básico de qualquer fluxograma (e correspondem aos elementos essenciais do BPMN); bastam para desenhar qualquer processo do escritório.' },
        { type: 'tf', q: 'No fluxograma, um losango (decisão) pode ter apenas uma seta de saída, desde que seja o caso mais comum.', answer: false, explain: 'Toda decisão precisa ter todas as saídas tratadas; uma saída sem destino é um buraco por onde a automação falha.' },
        { type: 'fill', q: 'A tabela que resume fornecedores, entradas, processo, saídas e clientes é chamada de ___.', answer: ['SIPOC'], explain: 'SIPOC vem das iniciais em inglês de Suppliers, Inputs, Process, Outputs, Customers.' },
        { type: 'order', q: 'Ordene os passos do mapeamento do processo "envio de guias mensais".', items: ['Nomear o processo e o gatilho', 'Listar as entradas', 'Escrever os passos como um estagiário faria', 'Marcar as decisões', 'Levantar as exceções', 'Validar com quem executa hoje'], explain: 'Começa-se pelo nome e gatilho, depois entradas e passos, então decisões e exceções, e por fim a validação com quem faz.' },
        { type: 'mc', q: 'Qual é a peça do processo que as pessoas mais esquecem e que mais derruba automações?', options: ['As entradas', 'As saídas', 'As exceções', 'O nome do processo'], answer: 2, explain: 'Exceções como cliente sem cadastro ou guia inexistente são o que faz o fluxo quebrar quando não foram previstas.' },
        { type: 'mc', q: 'Por que mapear o processo real, com as gambiarras, em vez do processo ideal?', options: ['Porque o ideal é impossível', 'Porque o mapa precisa refletir o que acontece de fato para a automação funcionar; melhorias vêm depois', 'Porque a ferramenta exige', 'Porque é mais rápido'], answer: 1, explain: 'Automatizar um processo imaginado produz um fluxo que não corresponde à realidade do escritório; primeiro se registra o real, depois se melhora.' },
        { type: 'write', q: 'Mapeie em texto o processo "cobrar documentos dos clientes no início do mês": escreva o gatilho, 2 entradas, 4 passos, 1 decisão com as duas saídas, 1 saída e 2 exceções.', model: 'Gatilho: dia 1 de cada mês. Entradas: lista de clientes ativos com e-mail; lista de documentos pendentes por cliente. Passos: 1) listar clientes com pendência; 2) montar mensagem com os documentos faltantes; 3) enviar por e-mail; 4) registrar envio na planilha. Decisão: cliente enviou tudo até o dia 5? Sim: encerrar. Não: enviar segundo lembrete no dia 6. Saída: registro de cobranças enviadas. Exceções: cliente sem e-mail cadastrado; cliente novo sem lista de documentos definida.', checklist: ['Definiu o gatilho (data ou evento)?', 'Listou pelo menos duas entradas?', 'Escreveu passos como um estagiário faria?', 'A decisão tem as duas saídas tratadas?', 'Levantou duas exceções reais?'] },
      ],
    },
    {
      id: 'au-01-03',
      title: 'Medir e priorizar',
      minutes: 31,
      content: 'content/automacao/au-01/03-medir-priorizar.md',
      exercises: [
        { type: 'mc', q: 'Um processo leva 3 minutos por execução, roda 100 vezes por mês e o custo da hora é R$ 40. Qual é o custo mensal, sem retrabalho?', options: ['R$ 120', 'R$ 200', 'R$ 300', 'R$ 400'], answer: 1, explain: '100 × 3 min = 300 min = 5 horas; 5 × R$ 40 = R$ 200.' },
        { type: 'tf', q: 'O custo da hora de um funcionário é apenas o salário dividido pelas horas trabalhadas.', answer: false, explain: 'O custo real inclui encargos, férias, décimo terceiro e benefícios; uma regra prática é multiplicar o salário-hora por 1,6 a 1,8.' },
        { type: 'match', q: 'Relacione a posição na matriz esforço × impacto à ação recomendada.', pairs: [['Alto impacto, baixo esforço', 'Faça primeiro'], ['Alto impacto, alto esforço', 'Planeje como projeto'], ['Baixo impacto, baixo esforço', 'Faça se sobrar tempo'], ['Baixo impacto, alto esforço', 'Não faça']], explain: 'A matriz orienta a começar pelas vitórias rápidas e evitar o que custa muito e rende pouco.' },
        { type: 'fill', q: 'O número de meses necessários para recuperar o investimento inicial de uma automação chama-se ___.', answer: ['payback', 'pay back', 'tempo de payback'], explain: 'Payback = investimento ÷ economia líquida mensal; acima de 12 meses, vale repensar.' },
        { type: 'mc', q: 'Uma automação custou R$ 800 para montar, economiza R$ 300 por mês e a ferramenta custa R$ 100 por mês. Qual é o payback?', options: ['2 meses', '2,7 meses', '4 meses', '8 meses'], answer: 2, explain: 'Economia líquida = 300 − 100 = R$ 200/mês; 800 ÷ 200 = 4 meses.' },
        {
          type: 'code',
          q: 'Escreva a função payback_meses(investimento, economia_mensal, custo_ferramenta) que devolve em quantos meses a automação se paga (investimento dividido pela economia líquida mensal). Se a economia líquida for zero ou negativa, devolva None.',
          starter: `def payback_meses(investimento, economia_mensal, custo_ferramenta):
    pass
`,
          tests: `assert payback_meses(800, 300, 100) == 4, "800 / (300 - 100) deveria dar 4 meses"
assert payback_meses(500, 175, 60) is not None and abs(payback_meses(500, 175, 60) - 4.3478) < 0.01, "500 / 115 deveria dar aproximadamente 4,35 meses"
assert payback_meses(1000, 100, 100) is None, "economia líquida zero não tem payback: devolva None"
assert payback_meses(1000, 50, 100) is None, "economia líquida negativa não tem payback: devolva None"
`,
          solution: `def payback_meses(investimento, economia_mensal, custo_ferramenta):
    liquido = economia_mensal - custo_ferramenta
    if liquido <= 0:
        return None
    return investimento / liquido
`,
          hint: 'Calcule a economia líquida primeiro; se for menor ou igual a zero, devolva None antes de dividir.',
          explain: 'A verificação antes da divisão evita dividir por zero e impede um resultado negativo sem sentido.',
        },
        {
          type: 'code',
          q: 'Escreva a função horas_economizadas(execucoes, minutos_por_execucao, minutos_retrabalho) que devolve o total de horas por mês que a automação libera: (execuções × minutos por execução + minutos de retrabalho) convertido para horas.',
          starter: `def horas_economizadas(execucoes, minutos_por_execucao, minutos_retrabalho):
    pass
`,
          tests: `assert horas_economizadas(60, 4, 60) == 5.0, "60 x 4 + 60 = 300 min = 5 horas"
assert horas_economizadas(100, 3, 0) == 5.0, "100 x 3 = 300 min = 5 horas"
assert horas_economizadas(10, 6, 30) == 1.5, "10 x 6 + 30 = 90 min = 1,5 hora"
`,
          solution: `def horas_economizadas(execucoes, minutos_por_execucao, minutos_retrabalho):
    total_minutos = execucoes * minutos_por_execucao + minutos_retrabalho
    return total_minutos / 60
`,
          hint: 'Some os minutos primeiro e só depois divida por 60.',
          explain: 'Converter tudo para minutos, somar e dividir por 60 evita erros de arredondamento no meio da conta.',
        },
        { type: 'tf', q: 'O processo de que todo mundo mais reclama é sempre o que deve ser automatizado primeiro.', answer: false, explain: 'A reclamação indica incômodo, não custo; a priorização deve seguir os números de tempo, frequência, erros e payback.' },
      ],
    },
    {
      id: 'au-01-04',
      title: 'Dados estruturados',
      minutes: 30,
      content: 'content/automacao/au-01/04-dados-estruturados.md',
      exercises: [
        { type: 'mc', q: 'Por que CNPJ, CPF e CEP devem ser guardados como texto, e não como número?', options: ['Porque são muito grandes', 'Porque o zero à esquerda some quando são tratados como número', 'Porque têm letras', 'Porque as APIs exigem texto'], answer: 1, explain: 'Como número, 04.690.098 vira 4690098, e planilhas podem exibir em notação científica; como texto, o valor se preserva.' },
        { type: 'match', q: 'Relacione o valor ao tipo de dado mais adequado.', pairs: [['"Padaria Pão Quente ME"', 'Texto'], ['1234.56', 'Número decimal'], ['2026-03-20', 'Data'], ['true', 'Booleano']], explain: 'O tipo define o que a automação pode fazer com o campo: somar números, comparar datas, filtrar por verdadeiro/falso.' },
        { type: 'tf', q: 'O formato de data ISO (2026-03-20) é preferido em bancos de dados e APIs porque não tem ambiguidade e ordena corretamente.', answer: true, explain: 'Ano-mês-dia elimina a confusão entre dia e mês e faz a ordem alfabética coincidir com a ordem cronológica.' },
        { type: 'fill', q: 'O formato de troca de dados usado pelas APIs, com pares "campo": valor entre chaves, chama-se ___.', answer: ['JSON'], explain: 'JSON (JavaScript Object Notation) é a língua das APIs e aceita aninhamento de listas e objetos.' },
        { type: 'mc', q: 'O que acontece se a função de conversão trocar a vírgula por ponto ANTES de remover o ponto de milhar em "1.234,56"?', options: ['Funciona normalmente', 'O texto vira "1.234.56" e a remoção dos pontos produz "123456"', 'Dá erro de sintaxe', 'O valor fica negativo'], answer: 1, explain: 'A ordem importa: primeiro remova o ponto de milhar, depois troque a vírgula decimal por ponto.' },
        {
          type: 'code',
          q: 'Escreva a função brl_para_numero(texto) que converte um valor em formato brasileiro, como "1.234,56" ou "R$ 10.500,00", em número decimal (float). Remova "R$" e espaços, remova o ponto de milhar e troque a vírgula por ponto.',
          starter: `def brl_para_numero(texto):
    pass
`,
          tests: `assert brl_para_numero("1.234,56") == 1234.56, "1.234,56 deveria virar 1234.56"
assert brl_para_numero("R$ 10.500,00") == 10500.0, "R$ 10.500,00 deveria virar 10500.0"
assert brl_para_numero("0,99") == 0.99, "0,99 deveria virar 0.99"
assert brl_para_numero("1.000.000,00") == 1000000.0, "1.000.000,00 deveria virar 1000000.0"
assert isinstance(brl_para_numero("5,00"), float), "o resultado deve ser float"
`,
          solution: `def brl_para_numero(texto):
    limpo = texto.replace("R$", "").strip()
    limpo = limpo.replace(".", "")
    limpo = limpo.replace(",", ".")
    return float(limpo)
`,
          hint: 'Use replace três vezes: "R$" por nada, "." por nada, "," por "."; depois float().',
          explain: 'Remover o ponto de milhar antes de trocar a vírgula garante que sobre apenas um ponto decimal para o float().',
        },
        { type: 'order', q: 'Ordene os passos para somar valores que chegam no formato brasileiro ("1.234,56") numa automação.', items: ['Receber o texto "1.234,56"', 'Remover o ponto de milhar', 'Trocar a vírgula por ponto', 'Converter o texto em número', 'Somar os valores'], explain: 'A remoção do ponto precisa vir antes da troca da vírgula; só depois de virar número o valor pode ser somado.' },
        { type: 'mc', q: 'Qual destas práticas NÃO trava uma automação que lê a planilha?', options: ['Mesclar células para fazer um título', 'Escrever "a confirmar" na coluna de valor', 'Manter uma linha por registro e uma informação por célula', 'Deixar linhas em branco entre grupos de clientes'], answer: 2, explain: 'Uma linha por registro e uma informação por célula é exatamente o formato que a automação espera; as outras opções quebram a leitura.' },
      ],
    },
    {
      id: 'au-01-05',
      title: 'APIs e webhooks explicados',
      minutes: 30,
      content: 'content/automacao/au-01/05-apis-webhooks.md',
      exercises: [
        { type: 'mc', q: 'Na analogia do restaurante, o que representa a API?', options: ['A cozinha', 'O garçom com o cardápio', 'O cliente', 'A conta'], answer: 1, explain: 'A API define o que pode ser pedido e em que formato, e devolve o resultado sem expor como o sistema funciona por dentro.' },
        { type: 'match', q: 'Relacione o código de status ao seu significado.', pairs: [['200', 'Deu certo'], ['401', 'Chave de API ausente ou inválida'], ['404', 'Recurso não encontrado'], ['429', 'Muitas requisições; espere'], ['500', 'Erro no servidor']], explain: '2xx é sucesso, 4xx é erro de quem pediu, 5xx é erro de quem responde.' },
        { type: 'tf', q: 'Um webhook é quando a sua automação pergunta ao sistema, a cada minuto, se algo novo aconteceu.', answer: false, explain: 'Isso é consulta repetida (polling). Webhook é o contrário: o sistema envia um POST para a sua URL no momento em que o evento acontece.' },
        { type: 'fill', q: 'O método HTTP usado para apenas consultar informação, sem alterar nada, é o ___.', answer: ['GET'], explain: 'GET é "me mostre"; POST é "faça isso" (criar ou executar).' },
        { type: 'mc', q: 'Qual serviço brasileiro gratuito e sem chave permite consultar dados cadastrais de um CNPJ?', options: ['ViaCEP', 'Open Finance', 'BrasilAPI', 'Sistema do banco'], answer: 2, explain: 'A BrasilAPI oferece, entre outras consultas, dados de CNPJ; o ViaCEP é só para CEP, e as APIs de bancos exigem credenciais.' },
        {
          type: 'code',
          q: 'A variável `resposta` contém o JSON (em texto) devolvido por uma consulta de CNPJ. Escreva a função resumo_empresa(resposta) que converte o texto em dicionário e devolve a string "RAZÃO SOCIAL - UF", usando os campos "razao_social" e "uf".',
          starter: `import json

def resumo_empresa(resposta):
    pass
`,
          tests: `r1 = '{"cnpj": "12345678000190", "razao_social": "PADARIA PAO QUENTE ME", "uf": "SP", "municipio": "SAO PAULO"}'
assert resumo_empresa(r1) == "PADARIA PAO QUENTE ME - SP", "esperava 'PADARIA PAO QUENTE ME - SP'"
r2 = '{"cnpj": "98765432000111", "razao_social": "CLINICA VIDA LTDA", "uf": "SE"}'
assert resumo_empresa(r2) == "CLINICA VIDA LTDA - SE", "esperava 'CLINICA VIDA LTDA - SE'"
`,
          solution: `import json

def resumo_empresa(resposta):
    dados = json.loads(resposta)
    return f'{dados["razao_social"]} - {dados["uf"]}'
`,
          hint: 'json.loads(resposta) devolve um dicionário; acesse os campos com dados["razao_social"].',
          explain: 'json.loads transforma o texto JSON em dicionário Python; a partir daí os campos são acessados por nome.',
        },
        { type: 'mc', q: 'Por que não colocar a chave de API na URL da requisição?', options: ['Porque a URL fica muito longa', 'Porque as APIs não aceitam', 'Porque o navegador bloqueia', 'Porque a URL costuma aparecer em logs e históricos, expondo a chave'], answer: 3, explain: 'URLs são registradas em logs de servidores e navegadores; a chave deve ir em um cabeçalho, que não costuma ser registrado.' },
        { type: 'order', q: 'Ordene o que acontece quando uma automação consulta um CEP no ViaCEP.', items: ['A automação monta a URL com o CEP', 'Envia uma requisição GET', 'O ViaCEP devolve um código de status e um corpo em JSON', 'A automação confere se o status é 200', 'A automação lê os campos do JSON'], explain: 'Montar, enviar, receber, conferir o status e só então usar os dados é a sequência segura para qualquer chamada de API.' },
      ],
    },
    {
      id: 'au-01-06',
      title: 'Autenticação e segurança nas automações',
      minutes: 27,
      content: 'content/automacao/au-01/06-autenticacao-seguranca.md',
      exercises: [
        { type: 'match', q: 'Relacione o mecanismo de autenticação à analogia.', pairs: [['Chave de API', 'Chave da porta: quem tem, entra'], ['Token', 'Pulseira de evento: vale só hoje'], ['OAuth', 'Procuração com poderes limitados']], explain: 'A chave é fixa, o token expira e o OAuth delega poderes específicos sem entregar a senha.' },
        { type: 'tf', q: 'Ao conectar o Make à sua conta Google via OAuth, a ferramenta recebe e armazena a sua senha do Google.', answer: false, explain: 'O login acontece na tela do Google; a ferramenta recebe apenas tokens limitados aos escopos aprovados, e a senha nunca sai de você.' },
        { type: 'mc', q: 'O que são "escopos" (scopes) numa autorização OAuth?', options: ['Os servidores onde os dados ficam', 'As permissões específicas que o app recebe, como "ver planilhas" ou "enviar e-mails"', 'O prazo de validade da senha', 'Os nomes dos fluxos'], answer: 1, explain: 'Os escopos delimitam o que o app pode fazer na sua conta; aceitar só os necessários é aplicar o menor privilégio.' },
        { type: 'fill', q: 'O princípio segundo o qual cada automação deve ter apenas as permissões necessárias para a tarefa chama-se princípio do menor ___.', answer: ['privilégio', 'privilegio'], explain: 'Menor privilégio limita o estrago se uma credencial vazar: a chave de um fluxo de leitura não permite apagar nada.' },
        { type: 'mc', q: 'Qual é o lugar correto para guardar uma chave de API usada em um fluxo?', options: ['Numa célula escondida da planilha', 'No grupo de WhatsApp da equipe', 'No cofre de credenciais da ferramenta ou em variável de ambiente', 'No próprio texto do fluxo, para facilitar'], answer: 2, explain: 'Cofres de credenciais e variáveis de ambiente guardam o segredo criptografado ou fora do código; planilhas e mensagens expõem a chave.' },
        { type: 'mc', q: 'Segundo a LGPD, o que significa "minimização" ao enviar dados de clientes para uma ferramenta de terceiros?', options: ['Enviar os dados compactados', 'Enviar apenas os dados necessários para a finalidade do fluxo', 'Reduzir o número de clientes', 'Usar letras minúsculas'], answer: 1, explain: 'Para gerar um lembrete de guia, por exemplo, a ferramenta não precisa receber a folha de pagamento dos funcionários.' },
        { type: 'tf', q: 'Logs de automação podem registrar tokens e CPFs completos, porque só a equipe tem acesso a eles.', answer: false, explain: 'Logs também são dados: tokens em texto puro viram vazamento, e dados pessoais devem ser mascarados e ter prazo de retenção.' },
        { type: 'order', q: 'Ordene o que acontece ao clicar em "Conectar com Google" numa ferramenta de automação.', items: ['A ferramenta abre a tela de login do Google', 'Você faz login no Google', 'O Google mostra as permissões (escopos) pedidas', 'Você aceita e o Google entrega tokens à ferramenta', 'A ferramenta passa a agir em seu nome, limitada aos escopos'], explain: 'Esse é o fluxo OAuth: a senha fica no Google, a ferramenta recebe só tokens com os poderes que você aprovou.' },
      ],
    },
    {
      id: 'au-01-07',
      title: 'Erros, exceções e confiabilidade',
      minutes: 27,
      content: 'content/automacao/au-01/07-erros-confiabilidade.md',
      exercises: [
        { type: 'mc', q: 'O que é uma operação idempotente?', options: ['Uma operação que nunca falha', 'Uma operação que, executada uma ou dez vezes, produz o mesmo resultado', 'Uma operação muito rápida', 'Uma operação que só roda de madrugada'], answer: 1, explain: 'Como o interruptor com posição "ligar": apertar dez vezes deixa a luz ligada, igual a apertar uma vez.' },
        {
          type: 'mc',
          q: 'Qual destas operações NÃO é idempotente (executá-la duas vezes muda o resultado)?',
          options: ['Marcar o cliente como ativo', 'Verificar se já existe o registro "CNPJ + competência" antes de enviar a guia', 'Somar 100 ao saldo do cliente', 'Definir o saldo do cliente como 500'],
          answer: 2,
          explain: 'Somar acumula a cada execução: duas vezes dá 200, não 100. Marcar como ativo, definir um valor fixo e verificar antes de agir produzem o mesmo resultado se repetidos, por isso são idempotentes.',
        },
        { type: 'tf', q: 'Retentativas devem ser feitas imediatamente e sem limite, até a API responder.', answer: false, explain: 'Retentativas precisam de espera crescente (backoff) e de um limite de tentativas; depois disso, o fluxo deve alertar alguém.' },
        { type: 'fill', q: 'Colocar um ponto de aprovação ou revisão humana antes de ações irreversíveis no fluxo é chamado de "humano no ___".', answer: ['loop', 'ciclo'], explain: 'Humano no loop (human in the loop) protege contra erros caros ou impossíveis de desfazer, como pagar uma guia duplicada.' },
        { type: 'mc', q: 'Qual informação NÃO precisa constar em um alerta de falha definitiva?', options: ['Qual fluxo falhou', 'Em que passo falhou', 'O token de acesso usado', 'Qual dado (cliente, competência) estava sendo processado'], answer: 2, explain: 'O alerta deve permitir investigar o problema; incluir o token exporia um segredo em e-mails e mensagens.' },
        { type: 'mc', q: 'Um fluxo rodou duas vezes no mesmo evento e o cliente recebeu duas cobranças. Qual é a solução estrutural?', options: ['Pedir desculpas e seguir', 'Usar um identificador do evento e verificar se já foi processado antes de agir', 'Desligar as retentativas', 'Rodar o fluxo só uma vez por dia'], answer: 1, explain: 'A verificação prévia com um identificador (CNPJ + competência, por exemplo) torna o envio idempotente, independentemente de quantas vezes o fluxo rodar.' },
        { type: 'order', q: 'Ordene o tratamento correto de uma falha transitória de API.', items: ['A chamada falha com erro 5xx', 'Esperar alguns segundos', 'Tentar de novo com espera maior', 'Atingir o limite de tentativas', 'Alertar o responsável e registrar a execução'], explain: 'Backoff crescente, limite de tentativas e alerta ao final: assim a falha transitória se resolve sozinha e a definitiva chega a uma pessoa.' },
        { type: 'tf', q: 'Confiar apenas no histórico de execuções da ferramenta é suficiente para comprovar ao cliente que a guia foi enviada há oito meses.', answer: false, explain: 'O histórico da ferramenta é apagado após algum tempo; o que importa deve ser gravado também em um registro seu, como uma planilha.' },
      ],
    },
    {
      id: 'au-01-08',
      title: 'Panorama de ferramentas e projeto',
      minutes: 29,
      content: 'content/automacao/au-01/08-ferramentas-e-projeto.md',
      exercises: [
        { type: 'match', q: 'Relacione a ferramenta à sua família.', pairs: [['Make', 'Fluxo sem código'], ['UiPath', 'RPA'], ['Python', 'Código'], ['API de LLM', 'IA']], explain: 'Cada família resolve um tipo de problema: fluxos integram APIs, RPA opera telas, código dá controle e IA trata texto livre.' },
        { type: 'mc', q: 'O sistema contábil do escritório só tem tela, sem API nem exportação automática. Qual família de ferramenta é a primeira opção?', options: ['Fluxo sem código', 'RPA', 'API de LLM', 'Webhook'], answer: 1, explain: 'RPA reproduz cliques e digitação na tela, o que resolve sistemas sem API, ainda que exija manutenção quando o layout muda.' },
        { type: 'tf', q: 'Um modelo de linguagem (LLM) pode classificar e-mails de clientes, mas os valores fiscais que ele extrair devem passar por conferência ou validação por regra.', answer: true, explain: 'LLMs lidam bem com texto livre, mas podem errar números; tudo que é fiscal exige validação.' },
        { type: 'fill', q: 'A versão do n8n instalada em um servidor do próprio escritório, para que os dados não saiam, é chamada de n8n ___.', answer: ['self-hosted', 'self hosted', 'auto-hospedado', 'autohospedado', 'hospedado pelo escritório'], explain: 'Self-hosted significa hospedado por você; é a opção comum para dados sensíveis e volume alto.' },
        { type: 'mc', q: 'Qual é a primeira pergunta do roteiro para escolher a ferramenta?', options: ['Qual é a mais barata?', 'Os sistemas de origem e destino têm API ou conector pronto?', 'Qual tem a interface mais bonita?', 'Qual a equipe já conhece?'], answer: 1, explain: 'A existência de API ou conector decide entre fluxo sem código e RPA; as outras perguntas vêm depois.' },
        { type: 'order', q: 'Ordene as partes do projeto do módulo.', items: ['Levantar cinco a dez tarefas e marcar os critérios', 'Mapear os três processos mais fortes', 'Medir e posicionar na matriz esforço × impacto', 'Avaliar dados, integrações, credenciais e riscos', 'Escolher a ferramenta e definir o primeiro passo'], explain: 'O projeto segue a ordem das lições: critérios, mapeamento, medição, riscos e escolha da ferramenta.' },
        { type: 'mc', q: 'Um escritório usa Microsoft 365 em tudo (Outlook, Excel, SharePoint, Teams). Qual ferramenta de fluxo tende a ser a escolha mais natural?', options: ['Zapier', 'Make', 'Power Automate', 'UiPath'], answer: 2, explain: 'Power Automate é integrado ao Microsoft 365 e tem conectores nativos para Outlook, Excel, SharePoint e Teams.' },
        { type: 'write', q: 'Projeto do módulo: entregue o documento com as cinco partes (levantamento, três processos mapeados, medição e priorização, dados/integrações/riscos, ferramenta e primeiro passo). Cole aqui um resumo de uma página com o processo prioritário.', model: 'Processo prioritário: envio de guias do DAS. Gatilho: dia 15. Entradas: guias no sistema, cadastro com e-mail e canal. Passos: listar clientes, localizar guia, enviar, registrar. Decisões: guia existe? canal? Exceções: guia ausente, e-mail devolvido. Medição: 60 execuções × 4 min + 1 h retrabalho = 5 h/mês × R$ 35 = R$ 175/mês. Esforço: 10 h. Payback: 4,3 meses. Matriz: alto impacto, baixo esforço. Dados: planilha de clientes (CNPJ como texto, e-mail), PDF das guias. Integrações: Google Drive e Gmail via OAuth; sem API do sistema contábil (exportação manual de PDFs na primeira versão). Riscos: guia ausente (alertar), e-mail inválido (registrar e alertar), duplicidade (verificar CNPJ + competência). Ferramenta: Make ou n8n. Primeiro passo: padronizar a planilha de clientes esta semana.', checklist: ['Listou de cinco a dez tarefas com os quatro critérios marcados?', 'Os três processos têm entradas, passos, decisões, saídas e exceções?', 'Há números de tempo, frequência, custo da hora e payback para cada um?', 'Identificou formato dos dados, APIs/webhooks e credenciais envolvidas?', 'Listou o que pode falhar e como o fluxo reage (retentar, pular, alertar, aprovar)?', 'Escolheu a família de ferramenta com justificativa e definiu um primeiro passo concreto?'] },
      ],
    },
  ],
  exam: {
    passScore: 70,
    questions: [
      { type: 'mc', q: 'Qual tarefa reúne os quatro critérios de automação (repetitiva, baseada em regras, alto volume, propensa a erro)?', options: ['Orientar um cliente sobre mudança de regime tributário', 'Enviar as guias mensais de 60 clientes por e-mail', 'Negociar honorários atrasados por telefone', 'Avaliar um risco fiscal incomum'], answer: 1, explain: 'O envio de guias acontece todo mês, segue regras claras, tem volume e costuma gerar erros manuais; as outras exigem julgamento ou relacionamento.' },
      { type: 'tf', q: 'Automatizar um processo bagunçado, em que cada funcionário faz de um jeito, costuma produzir a bagunça mais rápido.', answer: true, explain: 'A automação repete o processo como foi descrito; sem padronização, o fluxo quebra nas exceções e multiplica erros.' },
      { type: 'match', q: 'Relacione a peça do processo ao exemplo no envio de guias.', pairs: [['Entrada', 'Guia gerada no sistema'], ['Decisão', 'Canal preferido do cliente?'], ['Saída', 'Registro de envio com data e hora'], ['Exceção', 'E-mail devolvido']], explain: 'Entradas são o que precisa existir antes; decisões dividem o caminho; saídas são o resultado; exceções são o que foge do normal.' },
      { type: 'mc', q: 'No fluxograma, qual símbolo representa uma decisão?', options: ['Círculo', 'Retângulo', 'Losango', 'Seta'], answer: 2, explain: 'O losango marca o ponto em que o caminho se divide e precisa ter todas as saídas tratadas.' },
      { type: 'mc', q: 'Um processo leva 5 minutos, roda 48 vezes por mês, com 1 hora de retrabalho mensal, e o custo da hora é R$ 40. Qual é o custo mensal?', options: ['R$ 160', 'R$ 200', 'R$ 240', 'R$ 280'], answer: 1, explain: '48 × 5 = 240 min = 4 h; mais 1 h de retrabalho = 5 h; 5 × R$ 40 = R$ 200.' },
      { type: 'fill', q: 'Na matriz esforço × impacto, os processos de alto impacto e baixo esforço são chamados de vitórias ___.', answer: ['rápidas'], explain: 'São os primeiros a automatizar, porque trazem retorno alto com pouco investimento.' },
      { type: 'mc', q: 'Qual é o formato correto para guardar uma data numa planilha que alimenta automação?', options: ['20/03/2026', '20-mar', '2026-03-20', 'março de 2026'], answer: 2, explain: 'O formato ISO (ano-mês-dia) não tem ambiguidade entre dia e mês e ordena corretamente.' },
      {
        type: 'code',
        q: 'Escreva a função brl_para_numero(texto) que converte "1.234,56" em 1234.56 (remova o ponto de milhar e troque a vírgula por ponto). O texto não terá "R$".',
        starter: `def brl_para_numero(texto):
    pass
`,
        tests: `assert brl_para_numero("1.234,56") == 1234.56, "1.234,56 deveria virar 1234.56"
assert brl_para_numero("99,90") == 99.9, "99,90 deveria virar 99.9"
assert brl_para_numero("12.000,00") == 12000.0, "12.000,00 deveria virar 12000.0"
`,
        solution: `def brl_para_numero(texto):
    return float(texto.replace(".", "").replace(",", "."))
`,
        hint: 'Primeiro remova os pontos, depois troque a vírgula por ponto, depois float().',
        explain: 'A ordem das substituições garante que sobre apenas um ponto decimal.',
      },
      { type: 'mc', q: 'Uma requisição de API retornou o status 401. O que isso indica?', options: ['Deu certo', 'O recurso não existe', 'Chave de API ausente ou inválida', 'Erro no servidor'], answer: 2, explain: '401 significa não autorizado: a automação não se identificou corretamente.' },
      { type: 'tf', q: 'Um webhook é o sistema de origem enviando um POST para a URL da sua automação no momento em que um evento acontece.', answer: true, explain: 'É a "API ao contrário": em vez de você perguntar, o sistema avisa.' },
      {
        type: 'code',
        q: 'A função recebe o texto JSON devolvido por uma consulta de CEP. Escreva cidade_uf(resposta) que devolve a string "localidade/uf", por exemplo "São Paulo/SP".',
        starter: `import json

def cidade_uf(resposta):
    pass
`,
        tests: `r = '{"cep": "01001-000", "logradouro": "Praça da Sé", "localidade": "São Paulo", "uf": "SP"}'
assert cidade_uf(r) == "São Paulo/SP", "esperava 'São Paulo/SP'"
r2 = '{"cep": "49010-000", "localidade": "Aracaju", "uf": "SE"}'
assert cidade_uf(r2) == "Aracaju/SE", "esperava 'Aracaju/SE'"
`,
        solution: `import json

def cidade_uf(resposta):
    dados = json.loads(resposta)
    return f'{dados["localidade"]}/{dados["uf"]}'
`,
        hint: 'json.loads transforma o texto em dicionário; monte a string com os dois campos.',
        explain: 'Ler JSON é converter o texto em dicionário e acessar os campos pelo nome.',
      },
      { type: 'mc', q: 'Ao conectar uma ferramenta à conta Google via OAuth, o que a ferramenta recebe?', options: ['A senha do Google', 'Tokens limitados aos escopos que você aprovou', 'Acesso total e permanente à conta', 'Nada; ela usa a sua sessão do navegador'], answer: 1, explain: 'O OAuth entrega tokens com permissões específicas e revogáveis; a senha nunca sai de você.' },
      { type: 'mc', q: 'Qual prática está de acordo com a LGPD ao usar uma ferramenta de automação na nuvem?', options: ['Enviar a folha de pagamento completa para gerar um lembrete de guia', 'Nunca usar ferramentas na nuvem', 'Guardar os dados dos clientes no log do fluxo', 'Enviar apenas os dados necessários à finalidade e manter um inventário do que cada fluxo trata'], answer: 3, explain: 'Minimização e registro das operações são exigências da lei; o resto é excesso ou exposição.' },
      { type: 'mc', q: 'Por que verificar "CNPJ + competência" na planilha de controle antes de enviar a guia?', options: ['Para tornar o envio idempotente e evitar duplicidade quando o fluxo rodar de novo', 'Para deixar o fluxo mais lento', 'Porque a API exige', 'Para economizar operações da ferramenta'], answer: 0, explain: 'Com o identificador do evento, o fluxo pode rodar várias vezes sem enviar a mesma guia duas vezes.' },
      { type: 'match', q: 'Relacione a situação à família de ferramenta mais indicada.', pairs: [['Formulário → planilha → e-mail', 'Fluxo sem código'], ['Sistema antigo que só tem tela', 'RPA'], ['Processar 20 mil lançamentos', 'Python'], ['Classificar e-mails em texto livre', 'IA com validação']], explain: 'A escolha depende de API disponível, volume, texto livre e quem mantém.' },
    ],
  },
});
