registerModule({
  course: 'vibecoding',
  id: 'vc-05',
  order: 5,
  level: 'Profissional',
  title: 'Vibe Coding II: apps completos',
  description: 'Você vai sair das páginas estáticas e construir, com a IA, um aplicativo completo: banco de dados e login com Supabase, integrações com APIs e modelos de linguagem, especificação profissional, testes, segurança e manutenção. O projeto guiado é um sistema de gestão de honorários publicado na Vercel, com domínio, documentação e rubrica de entrega.',
  hours: 14,
  lessons: [
    {
      id: 'vc-05-01',
      title: 'Arquitetura de um app: as peças e como conversam',
      minutes: 25,
      content: 'content/vibecoding/vc-05/01-arquitetura-de-um-app.md',
      exercises: [
        { type: 'mc', q: 'Qual peça de um app é responsável por aplicar as regras de negócio de forma confiável, longe do usuário?', options: ['Frontend', 'Backend', 'Domínio', 'Navegador'], answer: 1, explain: 'O backend roda no servidor, fora do alcance do usuário; é o único lugar em que se pode confiar que a lógica não foi alterada.' },
        { type: 'tf', q: 'Esconder o botão "Excluir" no frontend para usuários comuns é suficiente para impedir que eles excluam registros.', answer: false, explain: 'Qualquer pessoa pode enviar a requisição diretamente ao backend, pulando a tela. A regra precisa estar no backend ou no banco.' },
        { type: 'match', q: 'Relacione a peça do app à sua função.', pairs: [['Frontend', 'Telas, botões e formulários que o usuário vê'], ['Banco de dados', 'Tabelas onde ficam clientes, contratos e faturas'], ['Autenticação', 'Confere quem é a pessoa e o que ela pode ver'], ['API', 'Canal padronizado para conversar com outros sistemas']], explain: 'Cada peça tem um papel distinto; conhecer os papéis é o que permite localizar um problema quando algo falha.' },
        { type: 'order', q: 'Coloque em ordem o ciclo de uma ação "Salvar fatura".', items: ['Usuário clica em Salvar no frontend', 'Frontend envia a requisição em JSON ao backend', 'Backend confere autenticação e valida os dados', 'Backend grava no banco de dados', 'Frontend mostra "Fatura salva"'], explain: 'A tela pede, o backend confere e grava, o banco confirma e só então a tela mostra o resultado.' },
        { type: 'fill', q: 'O conjunto de tecnologias escolhido para cada peça do app (por exemplo, Next.js + Supabase + Vercel) é chamado de ___.', answer: ['stack'], explain: 'Stack é o termo usado para a combinação de tecnologias de um projeto; para vibe coding, a melhor é a que a IA conhece bem e que tem hospedagem simples.' },
        { type: 'mc', q: 'Por que o prompt que termina com "proponha o modelo de dados e as telas; não gere código ainda" é melhor do que pedir o sistema inteiro?', options: ['Porque a IA não consegue gerar código longo', 'Porque assim você revisa o plano antes de gerar, evitando um emaranhado difícil de corrigir', 'Porque modelos de dados não podem ser gerados por IA', 'Porque o código gerado de uma vez não roda na Vercel'], answer: 1, explain: 'Revisar o plano antes do código evita decisões erradas sobre entidades e relações, que são as mais caras de refazer depois.' },
        { type: 'mc', q: 'Em qual situação a stack com backend em Python (FastAPI) faz mais sentido do que o Next.js completo?', options: ['Quando o app precisa de telas bonitas', 'Quando a lógica pesada já existe em Python, como cálculos fiscais', 'Quando se quer hospedar na Vercel', 'Quando o banco é o Supabase'], answer: 1, explain: 'Se o cálculo já está escrito em Python, reaproveitá-lo num backend FastAPI evita reescrever e testar tudo de novo em JavaScript.' },
      ],
    },
    {
      id: 'vc-05-02',
      title: 'Banco e autenticação com Supabase',
      minutes: 27,
      content: 'content/vibecoding/vc-05/02-banco-e-autenticacao-com-supabase.md',
      exercises: [
        { type: 'mc', q: 'Qual chave do Supabase NUNCA pode ir para o frontend?', options: ['A URL do projeto', 'A chave anon', 'A chave service_role', 'O nome da tabela'], answer: 2, explain: 'A service_role ignora toda a RLS; quem a tiver lê e escreve tudo. A anon é feita para o frontend e obedece à RLS.' },
        { type: 'tf', q: 'No Supabase, uma tabela sem RLS ativada só pode ser lida por quem tiver a chave service_role.', answer: false, explain: 'Sem RLS, a chave anon (que está no frontend, visível a todos) consegue ler e escrever a tabela inteira.' },
        { type: 'fill', q: 'Em SQL, para que a coluna valor_mensal nunca fique vazia, declaramos valor_mensal numeric(12,2) ___ null.', answer: ['not'], explain: 'not null torna a coluna obrigatória; o banco rejeita qualquer linha sem esse valor.' },
        { type: 'mc', q: 'Por que valores em dinheiro devem usar numeric(12,2) e não float?', options: ['Porque float não aceita números negativos', 'Porque float gera erros de arredondamento que criam centavos fantasmas', 'Porque numeric ocupa menos espaço', 'Porque float não existe no PostgreSQL'], answer: 1, explain: 'Ponto flutuante não representa decimais com exatidão; numeric guarda o valor exato com o número de casas definido.' },
        { type: 'match', q: 'Relacione o elemento da política de RLS ao seu papel.', pairs: [['auth.uid()', 'Id do usuário que está logado'], ['user_id', 'Coluna que diz quem é o dono da linha'], ['using', 'Condição para ler ou alterar linhas existentes'], ['with check', 'Condição para aceitar linhas novas ou alteradas']], explain: 'A RLS compara o usuário logado com o dono da linha; using filtra o que já existe e with check valida o que entra.' },
        { type: 'mc', q: 'O que é um magic link?', options: ['Um link que dá acesso de administrador', 'Um link enviado por e-mail que autentica o usuário sem senha', 'Um atalho para o painel do Supabase', 'Um link para recuperar a chave service_role'], answer: 1, explain: 'O usuário informa o e-mail, recebe um link e, ao clicar, entra autenticado; útil para quem acessa raramente.' },
        {
          type: 'code',
          q: 'Escreva a função validar_cliente(dados) que recebe um dicionário e devolve uma lista de mensagens de erro (lista vazia se estiver tudo certo). Regras: "nome" é obrigatório (não pode ser vazio nem só espaços) → "nome é obrigatório"; "cnpj", depois de remover tudo que não é dígito, deve ter 14 dígitos → "cnpj deve ter 14 dígitos"; se "email" vier preenchido, deve conter "@" → "email inválido".',
          starter: `import re

def validar_cliente(dados):
    erros = []
    # complete as validações
    return erros
`,
          tests: `assert validar_cliente({"nome": "Padaria Central", "cnpj": "12.345.678/0001-90"}) == [], "dados válidos devem devolver lista vazia"
assert validar_cliente({"nome": "   ", "cnpj": "12345678000190"}) == ["nome é obrigatório"], "nome só com espaços é inválido"
assert validar_cliente({"nome": "X", "cnpj": "123"}) == ["cnpj deve ter 14 dígitos"], "cnpj com menos de 14 dígitos"
assert validar_cliente({"nome": "X", "cnpj": "12345678000190", "email": "sem-arroba"}) == ["email inválido"], "email sem @ é inválido"
assert validar_cliente({"nome": "X", "cnpj": "12345678000190", "email": "a@b.com"}) == [], "email com @ é aceito"
assert validar_cliente({"nome": "", "cnpj": ""}) == ["nome é obrigatório", "cnpj deve ter 14 dígitos"], "dois erros, na ordem nome depois cnpj"
assert validar_cliente({"nome": "X", "cnpj": "12345678000190"}) == [], "email ausente não gera erro"
`,
          solution: `import re

def validar_cliente(dados):
    erros = []
    nome = (dados.get("nome") or "").strip()
    if not nome:
        erros.append("nome é obrigatório")
    cnpj = re.sub(r"\\D", "", dados.get("cnpj") or "")
    if len(cnpj) != 14:
        erros.append("cnpj deve ter 14 dígitos")
    email = dados.get("email") or ""
    if email and "@" not in email:
        erros.append("email inválido")
    return erros
`,
          hint: 'Use dados.get("campo") or "" para não quebrar quando o campo não existe; re.sub(r"\\D", "", texto) remove tudo que não é dígito.',
          explain: 'Validar antes de gravar devolve mensagens claras ao usuário; a lista de erros é fácil de testar e de reproduzir em JavaScript.',
        },
      ],
    },
    {
      id: 'vc-05-03',
      title: 'Integrações e APIs',
      minutes: 27,
      content: 'content/vibecoding/vc-05/03-integracoes-e-apis.md',
      exercises: [
        { type: 'mc', q: 'Onde deve ficar a chave da API do provedor de IA em um app Next.js + Vercel?', options: ['Em uma variável de ambiente sem o prefixo NEXT_PUBLIC_, lida só no servidor', 'Em uma variável NEXT_PUBLIC_ para o frontend usar direto', 'Em um comentário no código para não esquecer', 'No README do repositório'], answer: 0, explain: 'Variáveis NEXT_PUBLIC_ vão para o navegador e ficam visíveis; chaves de serviços pagos só podem ser lidas no servidor.' },
        { type: 'tf', q: 'Se uma chave de API foi commitada no GitHub e depois apagada do código, ela está segura.', answer: false, explain: 'A chave continua no histórico do Git e bots varrem repositórios em minutos; é preciso revogar no painel do serviço e gerar outra.' },
        { type: 'mc', q: 'O que é um webhook?', options: ['Uma consulta que o seu app faz a uma API externa', 'Um aviso que um serviço externo envia ao seu app quando algo acontece', 'Um tipo de chave de API', 'Uma página de documentação'], answer: 1, explain: 'No webhook o sentido se inverte: o serviço externo chama uma rota do seu backend para avisar de um evento, como "boleto pago".' },
        { type: 'order', q: 'Ordene o fluxo de "resumir um contrato com IA" dentro do app.', items: ['Frontend envia o PDF ao backend', 'Backend extrai o texto do PDF', 'Backend monta o prompt e chama a API do provedor de IA', 'Backend grava o resumo e devolve ao frontend'], explain: 'A chamada ao LLM acontece sempre no backend, porque é lá que vive a chave; o frontend só envia o arquivo e exibe o resultado.' },
        { type: 'fill', q: 'APIs de modelos de linguagem cobram por ___, separando entrada e saída.', answer: ['token', 'tokens'], explain: 'Token é o pedaço de palavra usado como unidade de cobrança; o custo da chamada soma tokens de entrada e de saída.' },
        { type: 'mc', q: 'Qual destes cuidados a IA tende a esquecer ao gerar uma rota que recebe webhooks, se você não pedir?', options: ['Responder em JSON', 'Verificar a assinatura e tolerar avisos repetidos', 'Usar o método POST', 'Gravar no banco'], answer: 1, explain: 'Sem verificação de assinatura qualquer um pode fingir ser o serviço; sem tolerância a repetição, o mesmo pagamento pode ser contado duas vezes.' },
        {
          type: 'code',
          q: 'Escreva a função custo_chamada(tokens_entrada, tokens_saida, preco_entrada, preco_saida), em que os preços são por milhão de tokens. Devolva o custo da chamada arredondado a 4 casas decimais.',
          starter: `def custo_chamada(tokens_entrada, tokens_saida, preco_entrada, preco_saida):
    pass
`,
          tests: `assert custo_chamada(1_000_000, 0, 3.0, 15.0) == 3.0, "um milhão de tokens de entrada a 3,0 por milhão custa 3,0"
assert custo_chamada(0, 1_000_000, 3.0, 15.0) == 15.0, "um milhão de tokens de saída a 15,0 por milhão custa 15,0"
assert custo_chamada(500_000, 100_000, 3.0, 15.0) == 3.0, "metade da entrada (1,5) mais um décimo da saída (1,5)"
assert custo_chamada(8000, 500, 3.0, 15.0) == 0.0315, "8 mil de entrada e 500 de saída: 0,024 + 0,0075"
assert custo_chamada(0, 0, 3.0, 15.0) == 0.0, "sem tokens não há custo"
`,
          solution: `def custo_chamada(tokens_entrada, tokens_saida, preco_entrada, preco_saida):
    custo = tokens_entrada / 1_000_000 * preco_entrada + tokens_saida / 1_000_000 * preco_saida
    return round(custo, 4)
`,
          hint: 'Divida cada quantidade de tokens por 1.000.000, multiplique pelo preço correspondente, some e use round(valor, 4).',
          explain: 'A conta mental de custo é tokens dividido por milhão vezes o preço; entrada e saída têm preços diferentes e devem ser somadas separadamente.',
        },
      ],
    },
    {
      id: 'vc-05-04',
      title: 'Especificação profissional: PRD completo e contrato com a IA',
      minutes: 23,
      content: 'content/vibecoding/vc-05/04-especificacao-profissional.md',
      exercises: [
        { type: 'mc', q: 'Quais quatro blocos o PRD profissional acrescenta ao PRD simples?', options: ['Logo, cores, fontes e slogan', 'Modelo de dados, fluxos, casos de borda e critérios de aceite', 'Orçamento, prazo, equipe e riscos', 'Testes, deploy, domínio e suporte'], answer: 1, explain: 'Esses quatro blocos dão à IA o que ela precisa para não inventar: dados, sequência de ações, situações estranhas e definição objetiva de pronto.' },
        { type: 'tf', q: '"A tela deve ser intuitiva" é um bom critério de aceite.', answer: false, explain: 'Critério de aceite precisa ser verificável de forma objetiva; "intuitiva" é opinião. Prefira "o cadastro é concluído em até 3 cliques a partir da lista".' },
        { type: 'match', q: 'Relacione a pergunta ao bloco do PRD em que a resposta aparece.', pairs: [['Quais campos tem uma fatura e como se liga ao contrato?', 'Modelo de dados'], ['O que acontece passo a passo ao registrar um pagamento?', 'Fluxo'], ['E se o dia de vencimento for 31 em mês de 30 dias?', 'Caso de borda'], ['Como sei que a exportação CSV está pronta?', 'Critério de aceite']], explain: 'Cada bloco responde a um tipo de pergunta: estrutura, sequência, exceção e verificação.' },
        { type: 'fill', q: 'A regra "não existem duas faturas da mesma competência para o mesmo contrato" vira, no SQL, uma restrição do tipo ___.', answer: ['unique', 'unique (contrato_id, competencia)'], explain: 'unique sobre o par (contrato_id, competencia) faz o próprio banco rejeitar a duplicata, mesmo que o código erre.' },
        { type: 'mc', q: 'Qual regra do "contrato com a IA" evita que ela acrescente um módulo de estoque a um sistema de honorários?', options: ['Usar a stack definida', 'Não adicionar funcionalidades fora do PRD; propor e esperar aprovação', 'Dizer como testar ao final', 'Implementar uma entrega por vez'], answer: 1, explain: 'A IA, com boa intenção, expande o escopo; a regra de não adicionar nada sem aprovação mantém o PRD como fonte da verdade.' },
        { type: 'order', q: 'Ordene as entregas de um app de honorários, da primeira à última.', items: ['Banco e RLS', 'Login e cadastro', 'CRUD de clientes', 'Contratos ligados a clientes', 'Geração de faturas', 'Painel e exportação'], explain: 'Cada entrega depende da anterior: não há login sem banco, nem contratos sem clientes, nem faturas sem contratos.' },
        { type: 'write', q: 'Escreva três casos de borda para a funcionalidade "registrar pagamento de fatura", no formato "E se...? Então...".', model: 'E se a fatura já estiver paga? Então bloqueia com a mensagem "fatura já paga". E se o valor pago for menor que o da fatura? Então registra recebimento parcial e mantém a fatura aberta. E se a data de pagamento for futura? Então rejeita com "data não pode ser futura".', checklist: ['Cada caso descreve uma situação fora do caminho feliz?', 'Cada caso diz o que o sistema deve fazer, não só o problema?', 'Os casos são verificáveis em um teste?'] },
      ],
    },
    {
      id: 'vc-05-05',
      title: 'Qualidade do código gerado: ler, testar, revisar, refatorar',
      minutes: 26,
      content: 'content/vibecoding/vc-05/05-qualidade-do-codigo-gerado.md',
      exercises: [
        { type: 'mc', q: 'Ao receber um arquivo gerado pela IA, qual é o lugar mais eficiente para procurar as regras de negócio?', options: ['Nos comentários', 'Nos import no topo do arquivo', 'Nos if e nas condições', 'No nome do arquivo'], answer: 2, explain: 'Regras como "atrasada se vencimento passou" aparecem como condições; se não há um if para a regra, ela não foi implementada.' },
        { type: 'tf', q: 'Quando um teste automatizado falha, o caminho correto é pedir à IA que ajuste o teste para passar.', answer: false, explain: 'O teste representa o PRD; se falhou, em geral o código está errado. Só se altera o teste quando ele contradiz o PRD.' },
        { type: 'fill', q: 'Em Python, a instrução ___ condição, "mensagem" interrompe o programa com AssertionError se a condição for falsa.', answer: ['assert'], explain: 'assert é a forma mais simples de teste automatizado: confere uma expectativa e falha com mensagem clara.' },
        { type: 'mc', q: 'O que é refatorar?', options: ['Reescrever o app em outra linguagem', 'Melhorar a estrutura do código sem mudar o que ele faz', 'Adicionar funcionalidades novas', 'Apagar os testes antigos'], answer: 1, explain: 'Refatorar muda a forma (funções menores, nomes claros, sem duplicação) e mantém o comportamento; os testes garantem isso.' },
        { type: 'mc', q: 'Por que pedir a uma segunda IA que revise o código da primeira funciona?', options: ['Porque a segunda sempre é mais inteligente', 'Porque modelos diferentes erram de jeitos diferentes', 'Porque a primeira não consegue ler o próprio código', 'Porque revisão só pode ser feita por outro provedor'], answer: 1, explain: 'Cada modelo tem pontos cegos próprios; uma revisão independente encontra erros que o autor não enxerga, e os testes decidem quem tem razão.' },
        { type: 'match', q: 'Relacione a ferramenta à sua finalidade.', pairs: [['Vitest', 'Testes automatizados em projetos JavaScript'], ['pytest', 'Testes automatizados em projetos Python'], ['DIVIDAS.md', 'Registro de atalhos e pendências do projeto'], ['assert', 'Verificação simples de uma expectativa no código']], explain: 'Cada stack tem seu executor de testes; a dívida técnica se registra em texto para ser paga depois.' },
        {
          type: 'code',
          q: 'Escreva a função calcular_desconto(valor, dias_antecipacao): devolve 5% do valor se o pagamento for feito com 10 ou mais dias de antecedência, 2% se for de 1 a 9 dias, e 0 caso contrário (0 ou negativo). Arredonde a 2 casas. Depois escreva pelo menos três assert próprios testando a função.',
          starter: `def calcular_desconto(valor, dias_antecipacao):
    pass

# seus testes aqui, por exemplo:
# assert calcular_desconto(1000, 10) == 50.0, "10 dias: 5%"
`,
          tests: `assert calcular_desconto(1000, 10) == 50.0, "10 dias de antecedência: 5% de 1000"
assert calcular_desconto(1000, 30) == 50.0, "30 dias de antecedência: 5%"
assert calcular_desconto(1000, 9) == 20.0, "9 dias: 2%"
assert calcular_desconto(1000, 1) == 20.0, "1 dia: 2%"
assert calcular_desconto(1000, 0) == 0.0, "no dia do vencimento não há desconto"
assert calcular_desconto(1000, -3) == 0.0, "pagamento atrasado não tem desconto"
assert calcular_desconto(333.33, 15) == 16.67, "arredonde a 2 casas"
`,
          solution: `def calcular_desconto(valor, dias_antecipacao):
    if dias_antecipacao >= 10:
        return round(valor * 0.05, 2)
    if dias_antecipacao >= 1:
        return round(valor * 0.02, 2)
    return 0.0

assert calcular_desconto(1000, 10) == 50.0, "10 dias: 5%"
assert calcular_desconto(1000, 5) == 20.0, "5 dias: 2%"
assert calcular_desconto(1000, 0) == 0.0, "sem antecedência: zero"
`,
          hint: 'Teste as fronteiras: 10 (entra nos 5%), 9 (entra nos 2%), 1 e 0. Use round(valor * 0.05, 2).',
          explain: 'Os limites das faixas (10, 9, 1, 0) são onde os erros se escondem; testar as fronteiras é o que diferencia um teste útil de um teste decorativo.',
        },
      ],
    },
    {
      id: 'vc-05-06',
      title: 'Segurança básica de apps',
      minutes: 27,
      content: 'content/vibecoding/vc-05/06-seguranca-basica-de-apps.md',
      exercises: [
        { type: 'mc', q: 'Qual é a defesa correta contra injeção de SQL?', options: ['Esconder o nome das tabelas', 'Usar consultas parametrizadas, em que o dado vai separado do comando', 'Limitar o tamanho dos campos', 'Validar só no frontend'], answer: 1, explain: 'Com parâmetros, o banco nunca interpreta o dado do usuário como instrução; concatenar texto no SQL é o que abre a brecha.' },
        { type: 'tf', q: 'Se o backend valida todos os dados, a RLS no banco se torna desnecessária.', answer: false, explain: 'A RLS é a última linha de defesa: mesmo com um bug no backend, o banco não entrega linhas de outro usuário.' },
        { type: 'match', q: 'Relacione o item do checklist ao risco que ele evita.', pairs: [['.env no .gitignore', 'Chave de API vazar no GitHub'], ['Teste com dois usuários', 'Um usuário ver dados do outro'], ['npm audit', 'Dependência com falha conhecida'], ['Restauração testada', 'Backup que não abre quando é preciso']], explain: 'Cada item do checklist corresponde a um incidente comum; a lista existe para que nenhum deles passe despercebido.' },
        { type: 'mc', q: 'O que é injeção de prompt no contexto de um app que resume documentos com IA?', options: ['Enviar o prompt pelo frontend', 'Um documento que contém instruções tentando fazer o modelo desobedecer às regras do app', 'Usar um prompt muito longo', 'Chamar o modelo sem chave'], answer: 1, explain: 'O texto do documento deve ser tratado como dado; se o modelo o lê como comando, pode ser levado a agir contra o app.' },
        { type: 'fill', q: 'A lei brasileira que regula o tratamento de dados pessoais, válida para o seu app assim que ele guarda nome, CPF ou e-mail, é a ___.', answer: ['LGPD', 'Lei Geral de Proteção de Dados', 'Lei 13.709/2018', 'Lei 13.709'], explain: 'A LGPD exige finalidade, controle de acesso, atendimento aos direitos do titular e resposta a incidentes.' },
        { type: 'mc', q: 'Com a RLS ativada, a tabela faturas tem políticas de select e insert, mas ninguém escreveu a de update. O que acontece ao tentar editar uma fatura?', options: ['Qualquer usuário consegue editar qualquer fatura', 'A edição é negada para todos, inclusive o dono, porque sem política a RLS nega', 'Só o dono consegue editar, porque a política de select vale para tudo', 'O Supabase cria a política de update sozinho'], answer: 1, explain: 'RLS nega por padrão: o que não tem política não acontece. O risco de segurança é "resolver" isso desativando a RLS ou criando uma política using (true), que libera as linhas para todo mundo.' },
        {
          type: 'code',
          q: 'Escreva a função validar_contrato(c) que recebe um dicionário e devolve a lista de erros, nesta ordem: "cliente_id é obrigatório" se o campo estiver ausente ou vazio; "valor_mensal deve ser maior que zero" se não for número ou for menor ou igual a zero; "dia_vencimento deve estar entre 1 e 28" se não for inteiro entre 1 e 28.',
          starter: `def validar_contrato(c):
    erros = []
    # complete
    return erros
`,
          tests: `assert validar_contrato({"cliente_id": "abc", "valor_mensal": 1500.0, "dia_vencimento": 10}) == [], "contrato válido"
assert validar_contrato({"cliente_id": "", "valor_mensal": 1500.0, "dia_vencimento": 10}) == ["cliente_id é obrigatório"], "cliente vazio"
assert validar_contrato({"cliente_id": "abc", "valor_mensal": -5, "dia_vencimento": 10}) == ["valor_mensal deve ser maior que zero"], "valor negativo"
assert validar_contrato({"cliente_id": "abc", "valor_mensal": "mil", "dia_vencimento": 10}) == ["valor_mensal deve ser maior que zero"], "valor em texto não é número"
assert validar_contrato({"cliente_id": "abc", "valor_mensal": 100, "dia_vencimento": 31}) == ["dia_vencimento deve estar entre 1 e 28"], "dia 31 é inválido"
assert validar_contrato({"cliente_id": "abc", "valor_mensal": 100, "dia_vencimento": 0}) == ["dia_vencimento deve estar entre 1 e 28"], "dia 0 é inválido"
assert validar_contrato({"valor_mensal": 0, "dia_vencimento": 40}) == ["cliente_id é obrigatório", "valor_mensal deve ser maior que zero", "dia_vencimento deve estar entre 1 e 28"], "três erros na ordem pedida"
`,
          solution: `def validar_contrato(c):
    erros = []
    if not c.get("cliente_id"):
        erros.append("cliente_id é obrigatório")
    valor = c.get("valor_mensal")
    if not isinstance(valor, (int, float)) or valor <= 0:
        erros.append("valor_mensal deve ser maior que zero")
    dia = c.get("dia_vencimento")
    if not isinstance(dia, int) or dia < 1 or dia > 28:
        erros.append("dia_vencimento deve estar entre 1 e 28")
    return erros
`,
          hint: 'isinstance(valor, (int, float)) confere se é número antes de comparar; c.get("campo") devolve None se o campo não existir.',
          explain: 'Validação no servidor rejeita entradas malformadas antes de tocar no banco; conferir o tipo evita que um texto quebre a comparação.',
        },
      ],
    },
    {
      id: 'vc-05-07',
      title: 'Custos, monitoramento e manutenção',
      minutes: 24,
      content: 'content/vibecoding/vc-05/07-custos-monitoramento-e-manutencao.md',
      exercises: [
        { type: 'mc', q: 'O que faz uma ferramenta de rastreamento de erros como o Sentry?', options: ['Impede que erros aconteçam', 'Captura as exceções do app, agrupa as repetidas e avisa você antes do cliente', 'Faz backup do banco', 'Atualiza as dependências sozinha'], answer: 1, explain: 'O Sentry registra cada erro com linha e contexto e notifica; sem ele, você só sabe do problema quando o usuário reclama.' },
        { type: 'tf', q: 'Planos gratuitos de hospedagem e banco são adequados enquanto o app está em desenvolvimento, mas a partir de um cliente pagante vale pagar pelo menos o banco.', answer: true, explain: 'Planos gratuitos têm cotas, podem pausar por inatividade e não garantem disponibilidade nem retenção de backups.' },
        { type: 'fill', q: 'Um monitor de ___ é um serviço externo que acessa o seu app a cada poucos minutos e avisa se ele não responder.', answer: ['uptime', 'disponibilidade'], explain: 'Logs mostram o que aconteceu dentro do app; só um monitor externo percebe que o endereço inteiro está fora do ar.' },
        { type: 'order', q: 'Ordene a rotina mensal de atualização de dependências.', items: ['Rodar npm outdated e npm audit', 'Atualizar primeiro o que for marcado como alto ou crítico', 'Rodar os testes automatizados', 'Fazer commit e deploy se os testes passarem'], explain: 'Primeiro se descobre o que há, depois se corrige o mais grave, e só se publica com testes verdes.' },
        { type: 'mc', q: 'Por que não se deve enviar CPF ou e-mail dos usuários nos eventos de log do Sentry?', options: ['Porque o Sentry cobra por caractere', 'Porque logs com dados pessoais viram dado pessoal guardado em um terceiro, com implicações de LGPD', 'Porque o Sentry não aceita texto', 'Porque isso deixa o app lento'], answer: 1, explain: 'Todo lugar em que um dado pessoal é armazenado passa a ser sua responsabilidade; logs devem identificar o erro, não a pessoa.' },
        { type: 'match', q: 'Relacione o sinal de crescimento à mudança que ele exige.', pairs: [['Pessoas que não são você cadastrando dados', 'Canal de suporte e rotina de resposta'], ['Faturamento que depende do app no ar', 'Plano pago e alertas de gasto'], ['Testar sem risco de estragar dados reais', 'Separar ambiente de desenvolvimento e produção'], ['Erros que ninguém reportou', 'Rastreamento de erros configurado']], explain: 'Cada estágio de uso pede uma camada a mais de operação; antecipar a mudança evita incidentes.' },
        { type: 'mc', q: 'Para que serve uma rota de saúde como /api/health?', options: ['Para mostrar a versão do app aos usuários', 'Para o monitor externo conferir que o app responde e consegue consultar o banco', 'Para resetar o banco', 'Para fazer login de administrador'], answer: 1, explain: 'A rota devolve "ok" só quando a aplicação e a conexão com o banco estão funcionando; é o que o monitor de uptime consulta.' },
      ],
    },
    {
      id: 'vc-05-08',
      title: 'Projeto guiado: Gestão de Honorários',
      minutes: 24,
      content: 'content/vibecoding/vc-05/08-projeto-gestao-de-honorarios.md',
      exercises: [
        { type: 'mc', q: 'Qual é a verificação mais importante do projeto, feita na etapa de clientes?', options: ['Conferir se a lista está em ordem alfabética', 'Entrar com um segundo usuário e confirmar que ele não vê os clientes do primeiro', 'Testar se o botão Excluir tem cor vermelha', 'Cadastrar cem clientes de uma vez'], answer: 1, explain: 'Esse teste comprova que a RLS funciona; sem ele, o vazamento de dados entre usuários só aparece na revisão final ou com cliente real.' },
        { type: 'tf', q: 'No projeto, o status "atrasada" deve ser gravado no banco no momento em que a fatura é criada.', answer: false, explain: '"Atrasada" depende da data de hoje, então é calculado ao listar: aberta com vencimento anterior a hoje. Gravado, ficaria desatualizado.' },
        { type: 'order', q: 'Ordene as etapas do projeto guiado.', items: ['Projeto base e contrato com a IA', 'Banco e RLS', 'Login', 'Clientes (CRUD)', 'Contratos', 'Faturas', 'Painel, CSV e revisão'], explain: 'Cada etapa depende da anterior e termina com verificação e commit; é a disciplina de entregas pequenas.' },
        { type: 'fill', q: 'Para o CSV abrir corretamente no Excel em português, o arquivo usa ponto e vírgula como separador e codificação UTF-8 com ___.', answer: ['BOM'], explain: 'O BOM (marca de ordem de bytes) faz o Excel reconhecer o UTF-8 e exibir os acentos corretamente.' },
        { type: 'mc', q: 'Ao gerar as faturas da competência pela segunda vez, o que deve acontecer?', options: ['Todas as faturas são criadas de novo', 'Nenhuma fatura nova é criada, porque já existe uma por contrato e competência', 'As faturas antigas são apagadas', 'Só os contratos inativos geram fatura'], answer: 1, explain: 'A restrição unique (contrato_id, competencia) e a lógica de geração impedem duplicatas; gerar de novo é seguro.' },
        { type: 'mc', q: 'Por que o PRD manda agregar os números do painel no banco em vez de trazer todas as faturas e somar no navegador?', options: ['Porque o navegador não sabe somar', 'Porque é mais eficiente e evita erros de ponto flutuante ao somar valores no JavaScript', 'Porque o Supabase não permite listar faturas', 'Porque a Vercel cobra por soma'], answer: 1, explain: 'O banco soma com numeric exato e devolve só os totais; trazer tudo para o navegador é lento e sujeito a centavos de diferença.' },
        {
          type: 'code',
          q: 'Escreva a função vencimento(competencia, dia) que recebe a competência no formato "AAAA-MM" e o dia de vencimento do contrato, e devolve um objeto date com o vencimento nesse mês. Se o dia não existir no mês (por exemplo, 30 em fevereiro), use o último dia do mês.',
          starter: `from datetime import date
import calendar

def vencimento(competencia, dia):
    pass
`,
          tests: `from datetime import date
assert vencimento("2026-03", 10) == date(2026, 3, 10), "dia normal dentro do mês"
assert vencimento("2026-02", 30) == date(2026, 2, 28), "fevereiro de 2026 tem 28 dias"
assert vencimento("2024-02", 31) == date(2024, 2, 29), "fevereiro de 2024 é bissexto"
assert vencimento("2026-04", 31) == date(2026, 4, 30), "abril tem 30 dias"
assert vencimento("2026-12", 28) == date(2026, 12, 28), "dezembro, dia 28"
`,
          solution: `from datetime import date
import calendar

def vencimento(competencia, dia):
    ano, mes = competencia.split("-")
    ano, mes = int(ano), int(mes)
    ultimo = calendar.monthrange(ano, mes)[1]
    return date(ano, mes, min(dia, ultimo))
`,
          hint: 'calendar.monthrange(ano, mes)[1] devolve o último dia do mês; use min(dia, ultimo).',
          explain: 'Esse é um caso de borda clássico de faturas: o dia do contrato pode não existir no mês, e a regra do PRD é usar o último dia.',
        },
      ],
    },
    {
      id: 'vc-05-09',
      title: 'Publicar e entregar',
      minutes: 25,
      content: 'content/vibecoding/vc-05/09-publicar-e-entregar.md',
      exercises: [
        { type: 'mc', q: 'O login funciona localmente, mas na Vercel a tela aparece e o login falha. Qual é a causa mais provável?', options: ['A Vercel não suporta Supabase', 'Variável de ambiente ausente ou com espaço no fim no painel da Vercel', 'O domínio ainda não propagou', 'O README está desatualizado'], answer: 1, explain: 'O .env.local não vai para a Vercel; as variáveis precisam ser cadastradas no painel do projeto, e um espaço extra invalida a chave.' },
        { type: 'tf', q: 'Sem configurar a Site URL e as Redirect URLs no Supabase, os links de confirmação de e-mail podem apontar para localhost.', answer: true, explain: 'O Supabase usa essas configurações para montar os links de e-mail; se ficarem no padrão, apontam para o endereço de desenvolvimento.' },
        { type: 'order', q: 'Ordene os passos para ligar um subdomínio próprio ao app na Vercel.', items: ['Adicionar o subdomínio em Domains na Vercel', 'Copiar o registro CNAME indicado pela Vercel', 'Criar o registro no painel do registrador do domínio', 'Aguardar a propagação e o certificado HTTPS automático'], explain: 'A Vercel diz qual registro criar; o registrador é quem o publica; a propagação e o HTTPS vêm em seguida.' },
        { type: 'fill', q: 'A primeira experiência do usuário com o app — convite, estados vazios com orientação e primeira tarefa guiada — chama-se ___.', answer: ['onboarding'], explain: 'Onboarding é o que faz a pessoa entender o app sem precisar perguntar; estados vazios úteis são a parte mais barata dele.' },
        { type: 'match', q: 'Relacione o documento ao seu conteúdo.', pairs: [['README.md', 'Como rodar localmente, fazer deploy e rodar os testes'], ['GUIA-DO-USUARIO.md', 'O que cada tela faz e as regras do sistema'], ['DIVIDAS.md', 'Pendências conhecidas e decisões adiadas'], ['PRD.md', 'Requisitos, modelo de dados, fluxos e critérios de aceite']], explain: 'Cada documento tem um leitor: o desenvolvedor, o usuário, o mantenedor e a IA.' },
        { type: 'mc', q: 'Por que manter dois projetos no Supabase, um de desenvolvimento e um de produção?', options: ['Porque o Supabase exige dois projetos', 'Para testar sem risco de alterar ou apagar dados reais dos clientes', 'Para dobrar o limite do plano gratuito', 'Porque a Vercel só aceita projetos em par'], answer: 1, explain: 'Testar na base de produção é como treinar lançamentos no livro do cliente; o ambiente separado protege os dados reais.' },
        { type: 'write', q: 'Aplique a rubrica final ao seu Gestão de Honorários: liste os três itens em que você tirou menos pontos e escreva, para cada um, a próxima ação concreta.', model: 'Item 8 (testes): 1/2 — só há testes de vencimento. Ação: pedir testes para a regra de não duplicar e para o cálculo de atrasada. Item 10 (documentação): 1/2 — falta o guia do usuário. Ação: gerar rascunho com a IA a partir do PRD e revisar. Item 6 (painel): 1/2 — "recebido no mês" conta pagamentos de outras competências. Ação: corrigir o filtro para pago_em no mês atual e testar.', checklist: ['Cada item tem a nota atual e o motivo?', 'Cada ação é concreta e cabe em uma sessão de trabalho?', 'As ações priorizam segurança e dados antes de aparência?'] },
      ],
    },
  ],
  exam: {
    passScore: 70,
    questions: [
      { type: 'mc', q: 'Qual peça do app é a barreira real de segurança, e não apenas uma conveniência?', options: ['O frontend', 'O backend e o banco de dados', 'O domínio', 'O README'], answer: 1, explain: 'O frontend pode ser contornado por requisições diretas; só o backend e o banco (com RLS) bloqueiam de fato.' },
      { type: 'tf', q: 'Desenhar entidades, relações e telas antes de gerar código reduz retrabalho porque o banco é a parte mais cara de refazer.', answer: true, explain: 'Telas se refazem rápido; mudar o modelo de dados com registros reais é caro e arriscado.' },
      { type: 'mc', q: 'No Supabase, qual par de chave e lugar está correto?', options: ['service_role no frontend', 'anon no frontend, obedecendo à RLS', 'anon no GitHub público', 'service_role em variável NEXT_PUBLIC_'], answer: 1, explain: 'A anon é feita para o navegador e só consegue o que a RLS permite; a service_role fica só no servidor.' },
      { type: 'fill', q: 'A regra escrita no próprio banco que faz cada usuário ver apenas as próprias linhas é a ___ (sigla em inglês).', answer: ['RLS', 'Row Level Security'], explain: 'Row Level Security filtra linha a linha comparando auth.uid() com a coluna user_id.' },
      { type: 'mc', q: 'Em um app que resume contratos com IA, por que a chamada ao modelo é feita no backend?', options: ['Porque o frontend não envia JSON', 'Porque a chave da API do provedor não pode ficar no navegador', 'Porque o modelo só responde a servidores', 'Porque o backend é mais rápido'], answer: 1, explain: 'A chave no navegador fica visível para qualquer pessoa, que gastaria o seu saldo; só o servidor a conhece.' },
      { type: 'match', q: 'Relacione o termo à definição.', pairs: [['Webhook', 'Serviço externo chama o seu app quando algo acontece'], ['Variável de ambiente', 'Valor conhecido pelo servidor, fora do código versionado'], ['Token', 'Unidade de cobrança das APIs de modelos de linguagem'], ['Critério de aceite', 'Frase verificável que define quando algo está pronto']], explain: 'Quatro conceitos centrais do módulo, cada um com um papel distinto na construção do app.' },
      { type: 'mc', q: 'Qual destes é um critério de aceite bem escrito?', options: ['A exportação deve ser rápida', 'O CSV usa ponto e vírgula como separador e a primeira linha é o cabeçalho', 'A tela de faturas deve ser bonita', 'O sistema deve funcionar bem'], answer: 1, explain: 'É verificável em segundos: abre-se o arquivo e confere-se; os outros são opiniões.' },
      { type: 'order', q: 'Ordene o ciclo de trabalho de uma entrega pequena no vibe coding profissional.', items: ['Atualizar o PRD com a funcionalidade', 'IA propõe o plano e você aprova', 'IA gera o código e os testes', 'Rodar os testes e corrigir o código', 'Commit e deploy'], explain: 'Especificar, aprovar, gerar, testar, publicar: cada passo protege o seguinte.' },
      { type: 'tf', q: 'Se a IA afirma "testei e está funcionando", isso prova que os testes foram executados.', answer: false, explain: 'A menos que a ferramenta execute código de fato, a frase é apenas texto gerado; você precisa rodar os testes.' },
      { type: 'mc', q: 'Qual trecho indica risco de injeção de SQL?', options: ['Uso de consulta parametrizada', 'SQL montado concatenando o texto digitado pelo usuário', 'Validação com Zod no servidor', 'RLS ativada'], answer: 1, explain: 'Concatenar texto do usuário no comando permite que ele vire instrução; parâmetros separam dado de comando.' },
      { type: 'mc', q: 'Qual é a obrigação prática da LGPD que exige planejar uma função "excluir cliente e tudo relacionado"?', options: ['Finalidade', 'Direitos do titular (mostrar, corrigir, apagar)', 'Backup', 'Monitoramento'], answer: 1, explain: 'O titular pode pedir a exclusão dos seus dados; o app precisa conseguir atender sem apagar à mão em várias tabelas.' },
      { type: 'mc', q: 'Depois do deploy na Vercel, os e-mails de confirmação de cadastro chegam com links para localhost:3000. Onde está a correção?', options: ['No painel da Vercel, em Domains', 'No Supabase, em Authentication → URL Configuration (Site URL e Redirect URLs)', 'No arquivo .env.local, trocando a chave anon', 'No registrador do domínio, no registro CNAME'], answer: 1, explain: 'O Supabase monta os links de e-mail a partir da Site URL e das Redirect URLs configuradas; no padrão elas apontam para o endereço de desenvolvimento.' },
      { type: 'mc', q: 'Qual ferramenta captura exceções do app em produção, agrupa as repetidas e avisa por e-mail?', options: ['Dependabot', 'Sentry', 'Vitest', 'registro.br'], answer: 1, explain: 'O Sentry é uma ferramenta de rastreamento de erros; Dependabot atualiza dependências, Vitest roda testes.' },
      {
        type: 'code',
        q: 'Escreva a função status_fatura(status, vencimento, hoje) que recebe o status gravado ("aberta", "paga", "cancelada"), a data de vencimento e a data de hoje (objetos date). Devolva "atrasada" se a fatura estiver aberta e o vencimento for anterior a hoje; caso contrário, devolva o status original.',
        starter: `from datetime import date

def status_fatura(status, vencimento, hoje):
    pass
`,
        tests: `from datetime import date
assert status_fatura("aberta", date(2026, 3, 10), date(2026, 3, 15)) == "atrasada", "aberta e vencida é atrasada"
assert status_fatura("aberta", date(2026, 3, 10), date(2026, 3, 10)) == "aberta", "no dia do vencimento ainda não está atrasada"
assert status_fatura("aberta", date(2026, 3, 20), date(2026, 3, 15)) == "aberta", "aberta e no prazo continua aberta"
assert status_fatura("paga", date(2026, 3, 10), date(2026, 3, 15)) == "paga", "paga nunca vira atrasada"
assert status_fatura("cancelada", date(2026, 3, 10), date(2026, 3, 15)) == "cancelada", "cancelada nunca vira atrasada"
`,
        solution: `from datetime import date

def status_fatura(status, vencimento, hoje):
    if status == "aberta" and vencimento < hoje:
        return "atrasada"
    return status
`,
        hint: 'Compare as datas com <; só faturas abertas podem ficar atrasadas.',
        explain: '"Atrasada" é calculado ao listar a partir do status gravado e da data de hoje, nunca gravado no banco.',
      },
      {
        type: 'code',
        q: 'Escreva a função limpar_cnpj(texto) que remove tudo que não é dígito e devolve os dígitos; se o resultado não tiver exatamente 14 dígitos, devolva None.',
        starter: `import re

def limpar_cnpj(texto):
    pass
`,
        tests: `assert limpar_cnpj("12.345.678/0001-90") == "12345678000190", "remova pontos, barra e hífen"
assert limpar_cnpj("12345678000190") == "12345678000190", "já limpo continua igual"
assert limpar_cnpj("123") is None, "menos de 14 dígitos devolve None"
assert limpar_cnpj("12.345.678/0001-900") is None, "mais de 14 dígitos devolve None"
assert limpar_cnpj("") is None, "vazio devolve None"
`,
        solution: `import re

def limpar_cnpj(texto):
    digitos = re.sub(r"\\D", "", texto or "")
    return digitos if len(digitos) == 14 else None
`,
        hint: 're.sub(r"\\D", "", texto) remove tudo que não é dígito; depois confira len(...) == 14.',
        explain: 'Normalizar o CNPJ antes de gravar permite aceitar máscara no formulário e manter o banco limpo e comparável.',
      },
    ],
  },
});
