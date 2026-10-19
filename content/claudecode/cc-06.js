registerModule({
  course: 'claudecode',
  id: 'cc-06',
  order: 6,
  level: 'Especialista',
  title: 'Engenharia com agentes e governança',
  description: 'Você vai desenhar arquiteturas de agentes com orquestrador, especialistas e contratos, administrar o contexto com método, criar um servidor MCP próprio em Python sobre SQLite, empacotar skills e plugins para a equipe, medir confiabilidade com conjuntos de teste, aprofundar segurança e LGPD, implantar governança com settings gerenciados e encerrar com o projeto final: um assistente de fechamento contábil completo.',
  hours: 14,
  lessons: [
    // ------------------------------------------------------------------
    {
      id: 'cc-06-01',
      title: 'Arquitetura de trabalho com agentes',
      minutes: 24,
      content: 'content/claudecode/cc-06/01-arquitetura-de-trabalho-com-agentes.md',
      exercises: [
        {
          type: 'mc',
          q: 'O que um subagente recebe quando o orquestrador delega uma tarefa a ele?',
          options: ['Toda a conversa principal até aquele ponto', 'Apenas a tarefa delegada, em um contexto próprio, e devolve um resumo', 'Os mesmos arquivos abertos no editor', 'O histórico de todas as sessões do projeto'],
          answer: 1,
          explain: 'Subagentes rodam em janela de contexto separada e não veem a conversa principal; por isso o prompt deles precisa ser autossuficiente e a tarefa completa.',
        },
        {
          type: 'tf',
          q: 'Paralelizar sempre reduz o tempo total, então toda tarefa grande deve ser dividida em sessões paralelas.',
          answer: false,
          explain: 'Só vale paralelizar unidades independentes em dados e arquivos; dependências, arquivos compartilhados e necessidade de visão de conjunto pedem sequência, e cada agente paralelo tem contexto e custo próprios.',
        },
        {
          type: 'fill',
          q: 'Para que um subagente definido em .claude/agents/ sempre rode em um worktree temporário, acrescente ao frontmatter isolation: ___.',
          answer: ['worktree'],
          explain: 'isolation: worktree faz o subagente editar em um checkout isolado, evitando conflitos com a sessão principal e com outros subagentes.',
        },
        {
          type: 'match',
          q: 'Relacione o tipo de especialista ao caso de uso.',
          pairs: [['Subagente (.claude/agents/)', 'Revisão independente ou pesquisa que lê muitos arquivos'], ['Skill com context: fork', 'Procedimento da equipe executado em subagente'], ['Sessão separada (claude -p ou worktree)', 'Etapa de pipeline agendada ou trabalho paralelo em arquivos distintos'], ['Sessão principal', 'Orquestrar, decidir e combinar resultados']],
          explain: 'Cada mecanismo isola contexto de um jeito; a escolha depende de quem precisa ver o quê e de como o resultado volta.',
        },
        {
          type: 'order',
          q: 'Ordene o roteiro de decomposição de uma tarefa para agentes.',
          items: ['Nomear o resultado final em termos verificáveis', 'Listar as entradas e de onde vêm', 'Cortar em unidades onde o contexto muda e onde há verificação possível', 'Ordenar as unidades por dependência'],
          explain: 'Começa-se pelo fim (o que é "pronto"), passa-se pelas entradas, cortam-se unidades por contexto e verificação, e só então se decide, pela dependência, o que pode rodar em paralelo.',
        },
        {
          type: 'mc',
          q: 'O que o comando /batch faz, segundo a documentação?',
          options: ['Executa um arquivo .bat do Windows', 'Decompõe uma mudança grande em 5 a 30 unidades e roda cada uma em um subagente com worktree próprio', 'Compacta a conversa em lotes', 'Agenda uma tarefa na nuvem'],
          answer: 1,
          explain: '/batch pesquisa o código, propõe um plano de unidades independentes e, aprovado, dispara um subagente em background por unidade, cada um em worktree isolado.',
        },
        {
          type: 'mc',
          q: 'Qual é o "contrato executável" entre dois agentes de um pipeline?',
          options: ['Um comentário no CLAUDE.md pedindo cuidado', 'Um esquema JSON aplicado com --json-schema ou output_format, que rejeita saídas fora do formato', 'O nome da branch', 'O modelo escolhido'],
          answer: 1,
          explain: 'O esquema JSON valida a saída antes de ela chegar ao próximo agente; contratos escritos em texto orientam, mas o esquema impõe.',
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'cc-06-02',
      title: 'Gestão avançada de contexto',
      minutes: 27,
      content: 'content/claudecode/cc-06/02-gestao-avancada-de-contexto.md',
      exercises: [
        {
          type: 'mc',
          q: 'Segundo a documentação, o que NÃO é recarregado automaticamente após /compact?',
          options: ['O CLAUDE.md', 'A memória automática', 'A lista de skills disponíveis', 'As ferramentas MCP'],
          answer: 2,
          explain: 'Prompt de sistema, CLAUDE.md, memória e ferramentas MCP recarregam; a listagem de skills não é reinjetada, só o corpo das skills que você invocou.',
        },
        {
          type: 'tf',
          q: 'Dividir um CLAUDE.md longo em arquivos importados com @ reduz o custo de contexto.',
          answer: false,
          explain: 'A documentação diz que imports ajudam a organizar, mas os arquivos importados também carregam no início; para reduzir contexto, use regras com paths ou skills.',
        },
        {
          type: 'fill',
          q: 'O comando que mostra, como uma grade, o que está ocupando a janela de contexto é ___.',
          answer: ['/context'],
          explain: '/context visualiza o uso de contexto e dá sugestões; /usage mostra tokens e custo; /compact resume.',
        },
        {
          type: 'match',
          q: 'Relacione o comando à sua função.',
          pairs: [['/clear', 'Começar conversa nova com contexto vazio'], ['/compact', 'Resumir a conversa, com instruções opcionais'], ['/btw', 'Pergunta lateral que não entra no histórico'], ['/context', 'Ver o que ocupa a janela'], ['/rename', 'Nomear a sessão para achá-la depois com /resume']],
          explain: 'Cada comando atua em um momento: limpar, resumir, desviar sem poluir, medir e organizar sessões.',
        },
        {
          type: 'mc',
          q: 'Quanto da memória automática (MEMORY.md) é carregado em cada sessão?',
          options: ['O arquivo inteiro, sem limite', 'As primeiras 200 linhas ou 25 KB, o que vier primeiro', 'Apenas a última linha', 'Nada; ela só é lida sob demanda'],
          answer: 1,
          explain: 'A documentação fixa esse limite para a memória automática; por isso vale revisá-la com /memory e apagar o que ficou obsoleto.',
        },
        {
          type: 'mc',
          q: 'Onde devem ficar as notas de progresso de um trabalho que atravessa várias sessões?',
          options: ['No CLAUDE.md, para carregar sempre', 'Em um arquivo como NOTAS.md, lido no início de cada sessão', 'Na própria conversa, confiando no --continue', 'No .gitignore'],
          answer: 1,
          explain: 'O CLAUDE.md é para o que vale em todas as sessões; estado de projeto mora em arquivos que a próxima sessão lê, e a conversa não é um lugar confiável.',
        },
        {
          type: 'code',
          q: 'Escreva `estimar_tokens(texto)`, que devolve max(1, len(texto) // 4), e `selecionar_arquivos(arquivos, limite)`, que recebe um dicionário nome -> texto e um limite de tokens. Percorra os arquivos na ordem do dicionário e inclua cada um apenas se o total acumulado mais seus tokens couber no limite (os que não cabem são pulados, e a varredura continua). Devolva uma tupla (lista de nomes selecionados, total de tokens selecionados).',
          starter: `def estimar_tokens(texto):
    pass

def selecionar_arquivos(arquivos, limite):
    pass
`,
          tests: `assert estimar_tokens("") == 1 and estimar_tokens("abcdefgh") == 2, "estimar_tokens usa max(1, len // 4)"
arq = {"a.md": "x" * 400, "b.md": "y" * 4000, "c.md": "z" * 800}
assert selecionar_arquivos(arq, 500) == (["a.md", "c.md"], 300), "Com limite 500, b.md (1000 tokens) nao cabe e c.md ainda entra"
assert selecionar_arquivos(arq, 10000) == (["a.md", "b.md", "c.md"], 1300), "Com limite alto, todos entram"
assert selecionar_arquivos({}, 10) == ([], 0), "Sem arquivos devolve lista vazia e 0"
assert selecionar_arquivos({"v.md": ""}, 1) == (["v.md"], 1), "Arquivo vazio vale 1 token"
assert selecionar_arquivos(arq, 50) == ([], 0), "Limite menor que qualquer arquivo seleciona nada"
`,
          solution: `def estimar_tokens(texto):
    return max(1, len(texto) // 4)

def selecionar_arquivos(arquivos, limite):
    selecionados = []
    total = 0
    for nome, texto in arquivos.items():
        tokens = estimar_tokens(texto)
        if total + tokens <= limite:
            selecionados.append(nome)
            total += tokens
    return selecionados, total
`,
          explain: 'A estimativa de quatro caracteres por token dá ordem de grandeza; selecionar só o que cabe no orçamento evita estourar o contexto antes de começar.',
          hint: 'Mantenha um acumulador total; para cada arquivo calcule tokens e só inclua se total + tokens <= limite.',
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'cc-06-03',
      title: 'Criando um servidor MCP próprio em Python',
      minutes: 27,
      content: 'content/claudecode/cc-06/03-servidor-mcp-proprio-em-python.md',
      exercises: [
        {
          type: 'mc',
          q: 'Na série 2.x do SDK Python oficial (pacote mcp), qual é a importação da classe de alto nível para criar um servidor?',
          options: ['from mcp.server import MCPServer', 'from mcp import Server', 'from fastmcp import FastMCP', 'from claude_agent_sdk import MCPServer'],
          answer: 0,
          explain: 'O README oficial usa from mcp.server import MCPServer e mcp = MCPServer("Demo"); FastMCP era a API da versão 1 e claude_agent_sdk é outro pacote.',
        },
        {
          type: 'tf',
          q: 'É seguro usar print() para depurar um servidor MCP que roda por stdio.',
          answer: false,
          explain: 'Em stdio, a saída padrão é o canal do protocolo; um print() corrompe a comunicação. Use o módulo logging, que escreve em stderr.',
        },
        {
          type: 'fill',
          q: 'No comando claude mcp add --transport stdio clientes ___ python servidor.py, o separador que isola as opções do Claude do comando do servidor é:',
          answer: ['--'],
          explain: 'Tudo depois de -- é passado ao servidor sem alteração; sem ele, o Claude Code tentaria interpretar os argumentos do seu servidor como flags próprias.',
        },
        {
          type: 'match',
          q: 'Relacione o comando à sua função.',
          pairs: [['mcp dev servidor.py', 'Abre o MCP Inspector para chamar as ferramentas manualmente'], ['claude mcp list', 'Lista servidores configurados e seu estado'], ['/mcp', 'Dentro da sessão, mostra servidores e ferramentas'], ['claude mcp add --scope project', 'Grava a configuração no .mcp.json versionável'], ['claude mcp get clientes', 'Mostra detalhes e erros de um servidor']],
          explain: 'Inspector para desenvolvimento, comandos claude mcp para gestão, /mcp para verificar na sessão.',
        },
        {
          type: 'mc',
          q: 'Como a ferramenta "consultar" do servidor "clientes" aparece em regras de permissão e no campo tools de um subagente?',
          options: ['clientes.consultar', 'mcp__clientes__consultar', 'mcp:clientes/consultar', 'consultar@clientes'],
          answer: 1,
          explain: 'O padrão é mcp__<servidor>__<ferramenta>; mcp__clientes__* casa todas as ferramentas do servidor.',
        },
        {
          type: 'mc',
          q: 'Por que a consulta SQL usa o marcador ? em vez de montar a string com f-string?',
          options: ['Porque sqlite3 não aceita f-strings', 'Para evitar injeção de SQL por um CNPJ malicioso vindo do modelo ou de um documento', 'Porque é mais rápido', 'Porque o MCP exige'],
          answer: 1,
          explain: 'Parâmetros são enviados separados do SQL; o valor nunca é interpretado como comando, mesmo que contenha aspas ou ponto e vírgula.',
        },
        {
          type: 'code',
          q: 'Escreva `consultar_cliente(conn, cnpj)` para uma conexão sqlite3 com a tabela clientes(cnpj, razao_social, regime, responsavel). Normalize o CNPJ mantendo só dígitos; se não tiver exatamente 14, devolva None. Consulte com SQL parametrizado e devolva um dicionário com as quatro colunas, ou None se não existir.',
          starter: `import sqlite3

def consultar_cliente(conn, cnpj):
    # sua implementacao
    pass
`,
          tests: `import sqlite3
conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE clientes (cnpj TEXT PRIMARY KEY, razao_social TEXT, regime TEXT, responsavel TEXT)")
conn.execute("INSERT INTO clientes VALUES ('11222333000181', 'Padaria Sol LTDA', 'Simples Nacional', 'Ana')")
conn.execute("INSERT INTO clientes VALUES ('99888777000166', 'Oficina Lua ME', 'Lucro Presumido', 'Bruno')")
esperado = {"cnpj": "11222333000181", "razao_social": "Padaria Sol LTDA", "regime": "Simples Nacional", "responsavel": "Ana"}
assert consultar_cliente(conn, "11222333000181") == esperado, "CNPJ so com digitos deve encontrar o cliente"
assert consultar_cliente(conn, "11.222.333/0001-81") == esperado, "CNPJ formatado deve ser normalizado"
assert consultar_cliente(conn, "000") is None, "CNPJ com menos de 14 digitos devolve None"
assert consultar_cliente(conn, "11222333000199") is None, "CNPJ inexistente devolve None"
assert consultar_cliente(conn, "99.888.777/0001-66")["regime"] == "Lucro Presumido", "Deve devolver o regime do segundo cliente"
assert consultar_cliente(conn, "' OR 1=1 --") is None, "Tentativa de injecao nao tem 14 digitos e devolve None"
`,
          solution: `import sqlite3

def consultar_cliente(conn, cnpj):
    cnpj = "".join(ch for ch in str(cnpj) if ch.isdigit())
    if len(cnpj) != 14:
        return None
    cur = conn.execute(
        "SELECT cnpj, razao_social, regime, responsavel FROM clientes WHERE cnpj = ?",
        (cnpj,),
    )
    linha = cur.fetchone()
    if linha is None:
        return None
    return {"cnpj": linha[0], "razao_social": linha[1], "regime": linha[2], "responsavel": linha[3]}
`,
          explain: 'Normalizar e validar o CNPJ antes da consulta, usar SQL parametrizado e devolver None para o que não existe são as três defesas de uma ferramenta de leitura segura.',
          hint: 'Filtre os dígitos com "".join(ch for ch in cnpj if ch.isdigit()); use conn.execute(sql, (cnpj,)) e cur.fetchone().',
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'cc-06-04',
      title: 'Skills e plugins avançados',
      minutes: 23,
      content: 'content/claudecode/cc-06/04-skills-e-plugins-avancados.md',
      exercises: [
        {
          type: 'mc',
          q: 'Onde fica o manifesto de um plugin?',
          options: ['plugin.json na raiz do plugin', '.claude-plugin/plugin.json', '.claude/plugin.json', 'skills/plugin.json'],
          answer: 1,
          explain: 'Só o manifesto fica em .claude-plugin/; os componentes (skills/, agents/, hooks/, .mcp.json) ficam na raiz do plugin.',
        },
        {
          type: 'tf',
          q: 'Colocar a pasta skills/ dentro de .claude-plugin/ é aceito e as skills carregam normalmente.',
          answer: false,
          explain: 'A documentação avisa que componentes salvos dentro de .claude-plugin/ não carregam; skills/ precisa ficar ao lado dessa pasta, na raiz do plugin.',
        },
        {
          type: 'fill',
          q: 'A skill "conciliar" de um plugin chamado fechamento-contabil é invocada como /___:conciliar.',
          answer: ['fechamento-contabil'],
          explain: 'O name do manifesto vira prefixo de skills e agentes, evitando colisões entre plugins.',
        },
        {
          type: 'match',
          q: 'Relacione o comando à sua função.',
          pairs: [['claude plugin validate ./x', 'Confere manifesto e frontmatter dos componentes'], ['claude --plugin-dir ./x', 'Carrega o plugin só nesta sessão, sem instalar'], ['claude plugin marketplace add ./m', 'Registra um marketplace (pasta ou repositório)'], ['claude plugin install x@m', 'Instala um plugin a partir de um marketplace'], ['/reload-plugins', 'Recarrega plugins editados durante a sessão']],
          explain: 'Validar, testar sem instalar, registrar o catálogo, instalar e recarregar cobrem o ciclo de desenvolvimento.',
        },
        {
          type: 'order',
          q: 'Ordene a criação e o uso de um marketplace próprio.',
          items: ['Criar a pasta com .claude-plugin/marketplace.json e plugins/', 'Rodar claude plugin validate na pasta do marketplace', 'Registrar com claude plugin marketplace add', 'Instalar com claude plugin install nome@marketplace', 'Conferir com claude plugin list'],
          explain: 'Estrutura, validação, registro, instalação e verificação: o mesmo ciclo que a equipe seguirá depois com o repositório hospedado.',
        },
        {
          type: 'mc',
          q: 'Qual variável permite que um script dentro da skill rode sem prompt de permissão, quando citada em allowed-tools e no texto?',
          options: ['${CLAUDE_PROJECT_DIR}', '${CLAUDE_SKILL_DIR}', '${CLAUDE_PLUGIN_ROOT}', '${HOME}'],
          answer: 1,
          explain: 'allowed-tools: Bash(${CLAUDE_SKILL_DIR}/scripts/x.py *) pré-aprova o script da própria skill; CLAUDE_PLUGIN_ROOT é usada no .mcp.json do plugin.',
        },
        {
          type: 'mc',
          q: 'Como fazer todos os colaboradores de um repositório usarem o plugin do escritório sem comandos manuais?',
          options: ['Enviar o .zip por e-mail', 'Definir extraKnownMarketplaces e enabledPlugins no .claude/settings.json do projeto', 'Colocar o plugin no CLAUDE.md', 'Instalar no escopo local de cada um'],
          answer: 1,
          explain: 'Com o marketplace registrado e o plugin habilitado nos settings do projeto, cada pessoa recebe o plugin após confiar na pasta; para a organização inteira, os mesmos campos vão em settings gerenciados.',
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'cc-06-05',
      title: 'Avaliação e confiabilidade',
      minutes: 26,
      content: 'content/claudecode/cc-06/05-avaliacao-e-confiabilidade.md',
      exercises: [
        {
          type: 'mc',
          q: 'Por que incluir casos adversariais (documento com "ignore as instruções") no conjunto de teste?',
          options: ['Para aumentar a taxa de sucesso', 'Para verificar que o agente trata o conteúdo como dado e não obedece a instruções embutidas', 'Porque a documentação exige', 'Para testar a velocidade'],
          answer: 1,
          explain: 'Injeção de prompt é um risco real; só um caso de teste mostra, em números, se a defesa (prompt, esquema, permissões) funciona e continua funcionando.',
        },
        {
          type: 'tf',
          q: 'Se a taxa média de sucesso subiu depois de mudar o CLAUDE.md, não há regressão.',
          answer: false,
          explain: 'A média pode subir enquanto casos críticos (adversariais, difíceis) passam a falhar; compare caso a caso contra a linha de base.',
        },
        {
          type: 'fill',
          q: 'O comando que executa casos de teste de um plugin com e sem ele, pontuando a diferença, é claude plugin ___.',
          answer: ['eval'],
          explain: 'claude plugin eval mede se o plugin realmente muda o comportamento do Claude, inclusive em CI.',
        },
        {
          type: 'match',
          q: 'Relacione o tipo de tarefa a um critério objetivo.',
          pairs: [['Classificação', 'Categoria igual ao gabarito'], ['Extração de valor', 'Diferença menor que R$ 0,01'], ['Código', 'Testes automatizados passam'], ['Texto', 'Todos os números citados existem na fonte'], ['Custo', 'total_cost_usd e num_turns abaixo do teto']],
          explain: 'Critérios booleanos permitem calcular taxa e detectar regressão; "ficou bom" não permite.',
        },
        {
          type: 'order',
          q: 'Ordene o procedimento para mudar um prompt sem regressão.',
          items: ['Rodar o lote na versão atual e guardar a linha de base', 'Fazer a mudança em um branch', 'Rodar o lote de novo', 'Comparar caso a caso com a linha de base', 'Aceitar só se nenhum caso que passava falhou'],
          explain: 'Sem linha de base não há comparação; sem comparação por caso, regressões se escondem na média.',
        },
        {
          type: 'mc',
          q: 'O que deve acontecer com cada erro novo encontrado em produção?',
          options: ['Ser corrigido no prompt e esquecido', 'Virar um caso de teste com gabarito no conjunto versionado', 'Ser ignorado se for raro', 'Ser registrado só no log'],
          answer: 1,
          explain: 'O conjunto de teste cresce com a realidade; assim a próxima mudança não reintroduz o erro sem que você perceba.',
        },
        {
          type: 'code',
          q: 'Escreva `taxa_sucesso(resultados)`, que recebe uma lista de dicionários com "id" e "passou" (booleano) e devolve {"taxa": proporção de aprovados arredondada a 3 casas, "falhas": lista dos ids que não passaram, na ordem original}. Lista vazia devolve {"taxa": 0.0, "falhas": []}.',
          starter: `def taxa_sucesso(resultados):
    # sua implementacao
    pass
`,
          tests: `rs = [{"id": "nf-1", "passou": True}, {"id": "injecao", "passou": False}, {"id": "scan", "passou": True}, {"id": "dup", "passou": False}]
assert taxa_sucesso(rs) == {"taxa": 0.5, "falhas": ["injecao", "dup"]}, "Dois de quatro passaram: taxa 0.5 e falhas na ordem"
assert taxa_sucesso([]) == {"taxa": 0.0, "falhas": []}, "Lista vazia devolve taxa 0.0"
assert taxa_sucesso([{"id": "a", "passou": True}]) == {"taxa": 1.0, "falhas": []}, "Tudo passou: taxa 1.0"
r = taxa_sucesso([{"id": "a", "passou": True}, {"id": "b", "passou": True}, {"id": "c", "passou": False}])
assert r["taxa"] == 0.667 and r["falhas"] == ["c"], "Arredondar a 3 casas: 0.667"
`,
          solution: `def taxa_sucesso(resultados):
    if not resultados:
        return {"taxa": 0.0, "falhas": []}
    falhas = [r["id"] for r in resultados if not r.get("passou")]
    aprovados = len(resultados) - len(falhas)
    return {"taxa": round(aprovados / len(resultados), 3), "falhas": falhas}
`,
          explain: 'A taxa resume o lote e a lista de falhas diz o que investigar; tratar a lista vazia evita divisão por zero.',
          hint: 'Trate a lista vazia primeiro; depois monte a lista de falhas com uma compreensão e calcule round(aprovados / total, 3).',
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'cc-06-06',
      title: 'Segurança a fundo',
      minutes: 28,
      content: 'content/claudecode/cc-06/06-seguranca-a-fundo.md',
      exercises: [
        {
          type: 'mc',
          q: 'Quais são os três elementos da "tríade letal" que não devem coexistir no mesmo agente?',
          options: ['Python, Git e PowerShell', 'Acesso a dados privados, exposição a conteúdo não confiável e capacidade de comunicar para fora', 'Subagentes, hooks e MCP', 'Leitura, escrita e execução'],
          answer: 1,
          explain: 'Quando os três se juntam, uma injeção pode levar dados privados para fora; a defesa é separar as etapas para que nenhuma tenha os três.',
        },
        {
          type: 'tf',
          q: 'O sandbox do Bash embutido também isola as ferramentas de arquivo, os servidores MCP e os hooks.',
          answer: false,
          explain: 'A documentação diz que o sandbox cobre só comandos de shell; ferramentas de arquivo, MCP e hooks rodam fora dele, e para cobri-los é preciso sandbox runtime, contêiner ou VM.',
        },
        {
          type: 'fill',
          q: 'Além de allow e deny, a lista permissions.___ faz uma ação ser sempre confirmada antes de executar.',
          answer: ['ask'],
          explain: 'ask é o meio-termo: a ação é possível, mas pede confirmação; é avaliada depois de deny e antes de allow.',
        },
        {
          type: 'match',
          q: 'Relacione a ameaça ao vetor típico.',
          pairs: [['Injeção de prompt', 'README de repositório clonado ou PDF processado'], ['Exfiltração', 'Comando curl para um domínio externo'], ['Comando destrutivo', 'rm -rf ou git reset --hard'], ['Servidor MCP malicioso', 'Ferramenta com descrição enganosa'], ['Vazamento de segredo', 'Chave colada no prompt e gravada na transcrição']],
          explain: 'Conhecer o vetor permite escolher o controle: --bare, deny de rede, hooks, revisão de servidores, segredos fora do prompt.',
        },
        {
          type: 'mc',
          q: 'Segundo a documentação de uso de dados, como a Anthropic trata prompts e código enviados por contas comerciais (Team, Enterprise, API)?',
          options: ['Usa para treinar modelos por padrão', 'Não usa para treinar modelos generativos; retenção padrão de 30 dias, com Zero Data Retention disponível para contas qualificadas', 'Guarda por 5 anos sempre', 'Depende do modelo escolhido'],
          answer: 1,
          explain: 'Contas comerciais não têm os dados usados em treinamento (salvo opt-in explícito) e seguem retenção de 30 dias; contas de consumidor dependem da preferência de privacidade.',
        },
        {
          type: 'mc',
          q: 'Qual regra de caminho é efetivamente consultada pelo Claude Code para bloquear edições em docs/?',
          options: ['Write(docs/**)', 'Edit(docs/**)', 'NotebookEdit(docs/**)', 'Glob(docs/**)'],
          answer: 1,
          explain: 'A documentação diz que verificações de caminho usam só Edit(path) e Read(path); regras com Write, NotebookEdit ou Glob são aceitas, mas nunca consultadas, e geram aviso na inicialização.',
        },
        {
          type: 'code',
          q: 'Escreva `anonimizar(texto)` que substitui todo CPF no formato 000.000.000-00 por "***.***.***-**" e todo CNPJ no formato 00.000.000/0000-00 por "**.***.***/****-**", deixando o resto do texto intacto. Use o módulo re.',
          starter: `import re

def anonimizar(texto):
    # sua implementacao
    pass
`,
          tests: `assert anonimizar("CPF 123.456.789-09 do titular") == "CPF ***.***.***-** do titular", "CPF formatado deve ser mascarado"
assert anonimizar("CNPJ 11.222.333/0001-81") == "CNPJ **.***.***/****-**", "CNPJ formatado deve ser mascarado"
assert anonimizar("sem dados") == "sem dados", "Texto sem documentos fica igual"
assert anonimizar("a 111.222.333-44 e 555.666.777-88") == "a ***.***.***-** e ***.***.***-**", "Dois CPFs no mesmo texto"
assert anonimizar("valor 1.234,56 na nota") == "valor 1.234,56 na nota", "Valores monetarios nao sao mascarados"
assert anonimizar("x 11.222.333/0001-81 y 123.456.789-09") == "x **.***.***/****-** y ***.***.***-**", "CNPJ e CPF juntos"
`,
          solution: `import re

CPF = re.compile(r"\\b\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}\\b")
CNPJ = re.compile(r"\\b\\d{2}\\.\\d{3}\\.\\d{3}/\\d{4}-\\d{2}\\b")

def anonimizar(texto):
    texto = CNPJ.sub("**.***.***/****-**", texto)
    texto = CPF.sub("***.***.***-**", texto)
    return texto
`,
          explain: 'Mascarar CPF e CNPJ antes de enviar ao modelo é minimização de dados pessoais (LGPD); expressões regulares com fronteiras evitam mascarar valores monetários.',
          hint: 'Dois padrões: CPF é três grupos de 3 dígitos com pontos e um traço com 2 dígitos; CNPJ é 2.3.3/4-2. Use re.sub com cada um.',
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'cc-06-07',
      title: 'Governança em equipe',
      minutes: 24,
      content: 'content/claudecode/cc-06/07-governanca-em-equipe.md',
      exercises: [
        {
          type: 'mc',
          q: 'Onde fica o arquivo de settings gerenciados no Windows, segundo a documentação?',
          options: ['C:\\ProgramData\\ClaudeCode\\managed-settings.json', 'C:\\Program Files\\ClaudeCode\\managed-settings.json', '%USERPROFILE%\\.claude\\managed-settings.json', 'C:\\Windows\\ClaudeCode\\settings.json'],
          answer: 1,
          explain: 'O caminho atual é C:\\Program Files\\ClaudeCode\\managed-settings.json; a documentação diz que o caminho antigo em ProgramData não é mais lido.',
        },
        {
          type: 'tf',
          q: 'Um valor definido em settings gerenciados pode ser sobreposto pela flag --settings na linha de comando.',
          answer: false,
          explain: 'Settings gerenciados ficam acima de todos os níveis, inclusive --settings; apenas alguns valores mais restritos de níveis inferiores ainda contam.',
        },
        {
          type: 'fill',
          q: 'A chave permissions.___ com valor "disable" impede que alguém entre no modo bypassPermissions.',
          answer: ['disableBypassPermissionsMode'],
          explain: 'permissions.disableBypassPermissionsMode: "disable" em settings gerenciados bloqueia o modo em todas as máquinas que recebem a política.',
        },
        {
          type: 'match',
          q: 'Relacione o nível de instrução ao arquivo.',
          pairs: [['Organização', 'CLAUDE.md gerenciado ou chave claudeMd em managed-settings.json'], ['Projeto', './CLAUDE.md e .claude/rules/*.md'], ['Pessoa, todos os projetos', '~/.claude/CLAUDE.md'], ['Pessoa, este projeto', './CLAUDE.local.md no .gitignore']],
          explain: 'Cada nível tem um dono e um escopo; versionar o nível de projeto e manter o pessoal fora do repositório evita divergências.',
        },
        {
          type: 'mc',
          q: 'Qual é a atribuição padrão que o Claude Code adiciona a commits, e qual chave de settings a controla?',
          options: ['Signed-off-by: Claude; chave signoff', 'Co-Authored-By: <nome do modelo> <noreply@anthropic.com>; chave attribution', 'Author: Anthropic; chave author', 'Nenhuma atribuição por padrão'],
          answer: 1,
          explain: 'O trailer Co-Authored-By com o modelo em uso é o padrão; attribution.commit e attribution.pr personalizam ou ocultam; includeCoAuthoredBy está obsoleta.',
        },
        {
          type: 'order',
          q: 'Ordene os níveis de settings do maior para o menor em precedência.',
          items: ['Settings gerenciados', 'Linha de comando (--settings)', '.claude/settings.local.json', '.claude/settings.json', '~/.claude/settings.json'],
          explain: 'Gerenciados vencem tudo; depois a sessão, o local do projeto, o compartilhado do projeto e, por último, o do usuário.',
        },
        {
          type: 'mc',
          q: 'Como confirmar em uma máquina que a política gerenciada foi aplicada?',
          options: ['Rodar /status e procurar "Enterprise managed settings" em Setting sources', 'Abrir o CLAUDE.md', 'Rodar /cost', 'Verificar o .gitignore'],
          answer: 0,
          explain: 'A documentação indica /status, cuja linha Setting sources mostra a origem gerenciada (file, remote ou MDM).',
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'cc-06-08',
      title: 'Carreira e comunidade',
      minutes: 25,
      content: 'content/claudecode/cc-06/08-carreira-e-comunidade.md',
      exercises: [
        {
          type: 'mc',
          q: 'Onde está o changelog oficial do Claude Code, com as mudanças de cada versão?',
          options: ['No arquivo CHANGELOG.md do repositório github.com/anthropics/claude-code', 'No /usage', 'No marketplace de plugins', 'No arquivo ~/.claude/changelog.txt'],
          answer: 0,
          explain: 'O repositório oficial mantém o CHANGELOG.md por versão; é a fonte para acompanhar mudanças que afetam seus scripts.',
        },
        {
          type: 'tf',
          q: 'claude --help lista todas as flags disponíveis, então não é preciso consultar a referência da CLI.',
          answer: false,
          explain: 'A própria documentação avisa que claude --help não lista todas as flags; a referência da CLI na doc é a fonte completa.',
        },
        {
          type: 'match',
          q: 'Relacione o nome antigo ao nome atual.',
          pairs: [['custom commands', 'skills'], ['headless / print mode', 'modo não interativo (-p)'], ['Claude Code SDK', 'Agent SDK'], ['includeCoAuthoredBy', 'attribution'], ['FastMCP (SDK v1)', 'MCPServer (SDK mcp 2.x)']],
          explain: 'Saber os dois nomes evita confusão ao ler tutoriais antigos e ajuda a buscar na documentação atual.',
        },
        {
          type: 'fill',
          q: 'O comando que mostra a versão instalada do Claude Code é claude ___.',
          answer: ['--version', '-v'],
          explain: 'claude --version (ou -v) imprime a versão; a doc recomenda conferi-la ao notar mudanças de comportamento.',
        },
        {
          type: 'mc',
          q: 'Qual prática a lição recomenda para CI e contêineres, para que atualizações não quebrem a automação sem aviso?',
          options: ['Nunca atualizar', 'Fixar uma versão específica (claude install X.Y.Z ou npm com @X.Y.Z e DISABLE_AUTOUPDATER=1) e atualizar de propósito', 'Usar sempre a versão latest', 'Desligar o lote de avaliação'],
          answer: 1,
          explain: 'Instalações nativas se atualizam sozinhas; em ambientes automatizados, fixar a versão e reexecutar o lote de avaliação ao atualizar mantém o controle.',
        },
        {
          type: 'mc',
          q: 'O que diferencia um repositório de portfólio de quem trabalha com agentes, segundo a lição?',
          options: ['Muito código gerado por IA', 'Configuração versionada (CLAUDE.md, rules, skills, agentes, hooks, MCP, CI), avaliação medida e decisões documentadas', 'Apenas um README bonito', 'Prompts salvos em um arquivo de texto'],
          answer: 1,
          explain: 'Quem lê o repositório vê método, segurança e medição; isso diz mais do que o volume de código.',
        },
        {
          type: 'write',
          q: 'Escreva, em até 6 linhas, a seção "O que o agente não pode fazer" do README de um repositório de automação contábil, citando pelo menos duas regras de permissão e uma fronteira de aprovação humana.',
          model: 'O agente não lança nada no sistema contábil nem envia e-mails: toda ação externa vai para pendencias/ e espera aprovação da responsável técnica. Permissões: deny para Read(./.env), Read(./segredos/**) e Bash(curl *); allow apenas para Read, Edit(saida/**) e Bash(python -m pytest *). O script agendado roda com --permission-mode dontAsk e --bare, sem ferramentas de Git; quem abre o PR é o script, e o merge exige revisão humana.',
          checklist: ['Citou pelo menos duas regras de permissão com a sintaxe correta (deny/allow, Read/Edit/Bash)?', 'Deixou explícita uma ação que exige aprovação humana?', 'Deixou claro o que o agente nunca faz (lançar, enviar, apagar)?'],
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'cc-06-09',
      title: 'Projeto final: Assistente de fechamento contábil',
      minutes: 30,
      content: 'content/claudecode/cc-06/09-projeto-final-assistente-de-fechamento.md',
      exercises: [
        {
          type: 'mc',
          q: 'Quem lança as pendências aprovadas no sistema contábil no projeto final?',
          options: ['O subagente testador', 'A skill relatorio', 'Ninguém automaticamente: o assistente gera pendências e a pessoa aprova e lança', 'O workflow do GitHub Actions'],
          answer: 2,
          explain: 'A especificação diz que o assistente nunca lança; a fronteira de efeito externo é humana, e o PR com o relatório é aberto pelo script.',
        },
        {
          type: 'tf',
          q: 'As três skills do projeto (coletar, conciliar, relatorio) usam disable-model-invocation: true para que só você ou o script as invoquem.',
          answer: true,
          explain: 'Procedimentos com efeito não devem ser disparados pelo modelo por conta própria; a invocação explícita (/skill ou no prompt do -p) mantém o controle.',
        },
        {
          type: 'order',
          q: 'Ordene os cinco primeiros sprints do plano.',
          items: ['Repositório, CLAUDE.md, rules e .gitignore', 'Função conciliar com testes', 'Função resumir_fechamento com testes e esquemas', 'Skill coletar com script e esquema', 'Skill conciliar'],
          explain: 'Base do repositório, depois o núcleo testado em Python puro, e só então as skills que dependem dele.',
        },
        {
          type: 'match',
          q: 'Relacione o componente ao controle de segurança que ele implementa.',
          pairs: [['Hook PreToolUse com exit 2', 'Bloqueia escrita fora de saida/, src/ e tests/'], ['Servidor MCP clientes', 'Consulta somente leitura com SQL parametrizado'], ['Script fechar.ps1', 'dontAsk, --bare, limites de turnos e orçamento, chave em ambiente'], ['Workflow de revisão', 'Permissões de leitura e segredo em secrets'], ['Subagente revisor', 'Confere números do relatório sem o viés de quem escreveu']],
          explain: 'Cada camada tem um controle próprio; juntas formam a defesa em profundidade exigida pela rubrica.',
        },
        {
          type: 'mc',
          q: 'O que a rubrica exige para aprovação além dos 70 pontos?',
          options: ['Nota máxima em CLAUDE.md', 'Pelo menos metade dos pontos em cada critério de segurança (hooks, MCP, script)', 'Que o projeto use Opus', 'Que o PR seja mesclado automaticamente'],
          answer: 1,
          explain: 'Um projeto que acerta tudo mas falha em segurança não está pronto para dados de clientes; por isso há mínimo por critério de segurança.',
        },
        {
          type: 'code',
          q: 'Escreva `conciliar(extrato, razao)`. Cada lista tem lançamentos {"data": "AAAA-MM-DD", "valor": inteiro em centavos, "descricao": str}. Um lançamento do extrato casa com o primeiro lançamento do razão ainda não usado que tenha a mesma data e o mesmo valor; cada um casa no máximo uma vez. Devolva {"casados": n, "so_extrato": [lançamentos do extrato sem par, na ordem], "so_razao": [lançamentos do razão sem par, na ordem]}.',
          starter: `def conciliar(extrato, razao):
    # sua implementacao
    pass
`,
          tests: `e = [
    {"data": "2026-09-01", "valor": 1500, "descricao": "PIX recebido"},
    {"data": "2026-09-02", "valor": -200, "descricao": "tarifa"},
    {"data": "2026-09-02", "valor": -200, "descricao": "tarifa duplicada"},
]
r = [
    {"data": "2026-09-01", "valor": 1500, "descricao": "recebimento"},
    {"data": "2026-09-02", "valor": -200, "descricao": "tarifa bancaria"},
    {"data": "2026-09-05", "valor": -900, "descricao": "aluguel"},
]
c = conciliar(e, r)
assert c["casados"] == 2, "Dois pares casam (1500 e uma tarifa)"
assert c["so_extrato"] == [e[2]], "A tarifa duplicada fica so no extrato"
assert c["so_razao"] == [r[2]], "O aluguel fica so no razao"
assert conciliar([], []) == {"casados": 0, "so_extrato": [], "so_razao": []}, "Listas vazias"
assert conciliar(e, []) == {"casados": 0, "so_extrato": e, "so_razao": []}, "Sem razao, tudo fica so no extrato"
c2 = conciliar([{"data": "2026-09-01", "valor": 100, "descricao": "x"}], [{"data": "2026-09-01", "valor": 101, "descricao": "y"}])
assert c2["casados"] == 0 and len(c2["so_extrato"]) == 1 and len(c2["so_razao"]) == 1, "Valores diferentes nao casam"
`,
          solution: `def conciliar(extrato, razao):
    usados = [False] * len(razao)
    casados = 0
    so_extrato = []
    for lanc in extrato:
        achou = False
        for i, r in enumerate(razao):
            if not usados[i] and r["data"] == lanc["data"] and r["valor"] == lanc["valor"]:
                usados[i] = True
                achou = True
                casados += 1
                break
        if not achou:
            so_extrato.append(lanc)
    so_razao = [r for i, r in enumerate(razao) if not usados[i]]
    return {"casados": casados, "so_extrato": so_extrato, "so_razao": so_razao}
`,
          explain: 'Marcar os lançamentos do razão já usados garante que cada um case uma única vez, o que é essencial para detectar duplicidades no extrato.',
          hint: 'Mantenha uma lista de marcadores "usado" para o razão; para cada lançamento do extrato procure o primeiro não usado com mesma data e valor e dê break.',
        },
        {
          type: 'code',
          q: 'Escreva `resumir_fechamento(conciliado)`, que recebe o resultado de conciliar() e devolve {"total_divergencias": quantidade de lançamentos sem par (dos dois lados), "valor_so_extrato": soma dos valores só no extrato, "valor_so_razao": soma dos valores só no razão, "status": "ok" se não houver divergência, senão "pendente"}.',
          starter: `def resumir_fechamento(conciliado):
    # sua implementacao
    pass
`,
          tests: `c = {"casados": 3, "so_extrato": [{"valor": 1500}], "so_razao": []}
assert resumir_fechamento(c) == {"total_divergencias": 1, "valor_so_extrato": 1500, "valor_so_razao": 0, "status": "pendente"}, "Uma divergencia no extrato"
assert resumir_fechamento({"casados": 5, "so_extrato": [], "so_razao": []}) == {"total_divergencias": 0, "valor_so_extrato": 0, "valor_so_razao": 0, "status": "ok"}, "Sem divergencias: ok"
c = {"casados": 0, "so_extrato": [{"valor": -200}, {"valor": 50}], "so_razao": [{"valor": -900}]}
assert resumir_fechamento(c) == {"total_divergencias": 3, "valor_so_extrato": -150, "valor_so_razao": -900, "status": "pendente"}, "Somas com valores negativos"
`,
          solution: `def resumir_fechamento(conciliado):
    so_extrato = conciliado["so_extrato"]
    so_razao = conciliado["so_razao"]
    total = len(so_extrato) + len(so_razao)
    return {
        "total_divergencias": total,
        "valor_so_extrato": sum(l["valor"] for l in so_extrato),
        "valor_so_razao": sum(l["valor"] for l in so_razao),
        "status": "ok" if total == 0 else "pendente",
    }
`,
          explain: 'O resumo transforma a conciliação em uma decisão: zero divergências é ok; qualquer sobra de um dos lados é pendência para revisão humana.',
          hint: 'total = len(so_extrato) + len(so_razao); use sum() com uma expressão geradora para cada lado.',
        },
      ],
    },
  ],
  exam: {
    passScore: 70,
    questions: [
      {
        type: 'mc',
        q: 'Qual é o princípio central por trás das arquiteturas de agentes, segundo a documentação de boas práticas?',
        options: ['Usar o modelo mais caro', 'A janela de contexto enche rápido e o desempenho cai; cada agente deve ver só o que precisa', 'Executar tudo em paralelo', 'Nunca usar subagentes'],
        answer: 1,
        explain: 'Gestão de contexto e verificabilidade são a base: orquestrador, especialistas, contratos e paralelismo existem para administrar contexto.',
      },
      {
        type: 'tf',
        q: 'Um subagente definido em .claude/agents/ herda automaticamente o histórico da conversa principal.',
        answer: false,
        explain: 'Subagentes rodam em contexto próprio e recebem apenas a tarefa; devolvem um resumo.',
      },
      {
        type: 'fill',
        q: 'Para resumir a conversa preservando o que você indicar, use /___ seguido das instruções.',
        answer: ['compact'],
        explain: '/compact [instruções] substitui o histórico por um resumo dirigido; /clear começa do zero.',
      },
      {
        type: 'mc',
        q: 'Qual é o limite recomendado de tamanho para um CLAUDE.md, segundo a documentação?',
        options: ['50 linhas', 'Menos de 200 linhas', '1.000 linhas', 'Não há recomendação'],
        answer: 1,
        explain: 'A doc recomenda menos de 200 linhas: arquivos longos consomem contexto e reduzem a adesão às instruções; procedimentos vão para skills.',
      },
      {
        type: 'match',
        q: 'Relacione o elemento do servidor MCP em Python ao seu papel.',
        pairs: [['@mcp.tool()', 'Registra uma função como ferramenta'], ['Anotações de tipo e docstring', 'Viram o esquema e a descrição que o Claude lê'], ['mcp.run()', 'Inicia o servidor; sem argumento usa stdio'], ['if __name__ == "__main__":', 'Evita que importar o arquivo inicie o servidor'], ['logging', 'Saída de depuração em stderr, sem corromper o stdio']],
        explain: 'Esses cinco elementos formam o servidor mínimo descrito na documentação do SDK mcp.',
      },
      {
        type: 'mc',
        q: 'Como registrar um servidor stdio em Python no Claude Code de forma compartilhável com a equipe?',
        options: ['claude mcp add --transport http clientes --scope user http://localhost', 'claude mcp add --transport stdio clientes --scope project -- python servidor.py', 'Editar o CLAUDE.md', 'claude plugin install clientes'],
        answer: 1,
        explain: '--transport stdio, o separador -- antes do comando e --scope project, que grava no .mcp.json versionável.',
      },
      {
        type: 'tf',
        q: 'O nome da entrada no marketplace.json pode ser diferente do name do plugin.json sem problemas.',
        answer: false,
        explain: 'A documentação pede que os dois nomes sejam iguais; quando diferem, instalar pelo nome do manifesto falha com "not found in marketplace".',
      },
      {
        type: 'mc',
        q: 'Um plugin habilitado no escopo user afeta quais sessões?',
        options: ['Só a sessão atual', 'Todas as sessões em todos os projetos da máquina, inclusive as que não usam o plugin', 'Só o repositório atual', 'Só sessões na nuvem'],
        answer: 1,
        explain: 'Um plugin habilitado entra em toda sessão: nomes e descrições ficam no contexto a cada turno e seus servidores MCP sobem; por isso inclua só o que a equipe usa.',
      },
      {
        type: 'mc',
        q: 'Por que rodar cada caso do conjunto de avaliação mais de uma vez?',
        options: ['Para gastar o orçamento', 'Porque o agente é probabilístico e um caso instável só aparece com repetição', 'Porque a API exige', 'Para aquecer o cache'],
        answer: 1,
        explain: 'Um caso que passa duas de três vezes é instável e precisa de prompt ou esquema melhor; uma execução só esconde isso.',
      },
      {
        type: 'order',
        q: 'Ordene a avaliação de regras de permissão e o resultado quando nada casa (modo manual).',
        items: ['deny', 'ask', 'allow', 'Sem regra: a ação pede aprovação (fail-closed)'],
        explain: 'A primeira regra que casa decide, na ordem deny, ask, allow; sem correspondência, o modo manual pergunta.',
      },
      {
        type: 'mc',
        q: 'Em qual sistema o sandbox do Bash embutido NÃO está disponível?',
        options: ['macOS', 'Linux', 'WSL2', 'Windows nativo'],
        answer: 3,
        explain: 'No Windows nativo os comandos rodam sem sandbox; a alternativa é WSL2, contêiner ou VM.',
      },
      {
        type: 'tf',
        q: 'Para dados pessoais de clientes, a lição recomenda usar conta comercial (Team, Enterprise ou API) em vez de conta pessoal Pro ou Max.',
        answer: true,
        explain: 'Contas comerciais não têm dados usados em treinamento e seguem retenção de 30 dias; nas contas de consumidor isso depende da preferência de privacidade do usuário.',
      },
      {
        type: 'mc',
        q: 'Qual chave de settings gerenciados faz o Claude Code ignorar regras de permissão de níveis inferiores e de --allowedTools?',
        options: ['allowManagedHooksOnly', 'allowManagedPermissionRulesOnly', 'strictKnownMarketplaces', 'disableSideloadFlags'],
        answer: 1,
        explain: 'allowManagedPermissionRulesOnly: true torna os settings gerenciados a única fonte de regras de permissão.',
      },
      {
        type: 'mc',
        q: 'Qual é o método semanal sugerido para acompanhar mudanças do Claude Code sem se perder?',
        options: ['Reinstalar tudo toda semana', 'Ler o CHANGELOG.md filtrando o que você usa, reexecutar o lote de avaliação e fixar versões onde importa', 'Ignorar atualizações', 'Trocar de modelo'],
        answer: 1,
        explain: 'Changelog, lote de avaliação e versões fixadas em CI transformam mudanças frequentes em algo controlável.',
      },
      {
        type: 'code',
        q: 'Escreva `validar_manifesto(m)` que recebe o dicionário de um plugin.json e devolve uma lista de erros (vazia se válido): "name obrigatorio" se name estiver ausente ou vazio; "name sem espacos" se contiver espaço; "version invalida" se version existir e não estiver no formato N.N.N (só dígitos e pontos, três partes). Use o módulo re para a versão.',
        starter: `import re

def validar_manifesto(m):
    # sua implementacao
    return []
`,
        tests: `assert validar_manifesto({"name": "fechamento-contabil", "version": "1.0.0"}) == [], "Manifesto valido devolve lista vazia"
assert validar_manifesto({"version": "1.0.0"}) == ["name obrigatorio"], "name ausente"
assert validar_manifesto({"name": ""}) == ["name obrigatorio"], "name vazio"
assert validar_manifesto({"name": "meu plugin"}) == ["name sem espacos"], "name com espaco"
assert validar_manifesto({"name": "x", "version": "1.0"}) == ["version invalida"], "version com duas partes e invalida"
assert validar_manifesto({"name": "x", "version": "v1.0.0"}) == ["version invalida"], "Prefixo v e invalido"
assert validar_manifesto({"name": "x"}) == [], "version e opcional"
assert validar_manifesto({"name": "a b", "version": "1"}) == ["name sem espacos", "version invalida"], "Dois erros na ordem name, version"
`,
        solution: `import re

def validar_manifesto(m):
    erros = []
    nome = m.get("name")
    if not nome:
        erros.append("name obrigatorio")
    elif " " in nome:
        erros.append("name sem espacos")
    versao = m.get("version")
    if versao is not None and not re.fullmatch(r"\\d+\\.\\d+\\.\\d+", versao):
        erros.append("version invalida")
    return erros
`,
        explain: 'Nome obrigatório sem espaços e versão em três partes são as regras do manifesto que o claude plugin validate confere; devolver os erros em lista permite relatar todos de uma vez.',
        hint: 'Verifique name com if not nome / elif " " in nome; para version use re.fullmatch(r"\\d+\\.\\d+\\.\\d+", versao) quando ela existir.',
      },
    ],
  },
});
