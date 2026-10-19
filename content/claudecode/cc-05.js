registerModule({
  course: 'claudecode',
  id: 'cc-05',
  order: 5,
  level: 'Profissional',
  title: 'Automação e integração com o Claude Code',
  description: 'Você vai rodar o Claude Code sem interface (claude -p), obter JSON validado para scripts Python, agendar lotes idempotentes, integrar com GitHub Actions, conhecer o Agent SDK, montar workflows de várias etapas com Git e worktrees, controlar custos e monitoramento, aplicar segurança em execução não assistida e concluir com um robô de triagem de documentos para o escritório.',
  hours: 13,
  lessons: [
    // ------------------------------------------------------------------
    {
      id: 'cc-05-01',
      title: 'Modo não interativo: claude -p',
      minutes: 24,
      content: 'content/claudecode/cc-05/01-modo-nao-interativo.md',
      exercises: [
        {
          type: 'mc',
          q: 'Qual flag faz o Claude Code executar um prompt e encerrar, sem abrir a interface interativa?',
          options: ['-p (ou --print)', '--headless', '--batch', '--run'],
          answer: 0,
          explain: 'O modo não interativo (antes chamado de headless ou print mode) é ativado por -p / --print; as outras flags não existem na referência da CLI.',
        },
        {
          type: 'tf',
          q: 'Uma execução com claude -p mostra o diálogo de confiança da pasta antes de carregar hooks e servidores MCP do projeto.',
          answer: false,
          explain: 'A documentação avisa que uma sessão -p não mostra o diálogo de confiança, mas ainda roda os hooks do .claude/settings.json e conecta os servidores do .mcp.json; por isso --bare é recomendado em pastas desconhecidas.',
        },
        {
          type: 'fill',
          q: 'Para liberar ferramentas sem pedido de permissão em claude -p, use a flag ___ "Read,Edit".',
          answer: ['--allowedTools', '--allowed-tools'],
          explain: '--allowedTools (alias --allowed-tools) lista as ferramentas que executam sem perguntar, usando a mesma sintaxe das regras de permissão.',
        },
        {
          type: 'order',
          q: 'Ordene as etapas do script PowerShell que resume um log com o Claude Code.',
          items: ['Ler o log com Get-Content', 'Enviar o texto por pipe para claude -p com --max-turns', 'Conferir $LASTEXITCODE', 'Gravar a saída em arquivo com Set-Content'],
          explain: 'Primeiro se obtém a entrada, depois se executa o Claude, verifica-se o código de saída e só então se persiste o resultado.',
        },
        {
          type: 'match',
          q: 'Relacione cada flag ao seu efeito.',
          pairs: [['--max-turns', 'Limita os turnos agênticos e encerra com erro ao atingir'], ['--max-budget-usd', 'Interrompe quando a estimativa de gasto chega ao valor'], ['--output-format json', 'Devolve um envelope com result, session_id e metadados'], ['--bare', 'Pula hooks, skills, plugins, MCP e CLAUDE.md'], ['--permission-mode dontAsk', 'Nega automaticamente o que pediria aprovação']],
          explain: 'Cada flag controla um aspecto distinto: passos, dinheiro, formato de saída, carregamento de configuração e permissões.',
        },
        {
          type: 'mc',
          q: 'Qual é o limite documentado para a entrada por pipe (stdin) em claude -p?',
          options: ['1 MB', '10 MB', '100 MB', 'Não há limite'],
          answer: 1,
          explain: 'A documentação fixa o limite em 10 MB; acima disso o comando encerra com erro, e a recomendação é gravar em arquivo e citar o caminho no prompt.',
        },
        {
          type: 'mc',
          q: 'Seu script roda claude -p dentro de um repositório clonado de terceiros. Qual flag evita que hooks e servidores MCP desse repositório sejam carregados?',
          options: ['--verbose', '--bare', '--continue', '--json-schema'],
          answer: 1,
          explain: '--bare pula a descoberta de hooks, skills, comandos, subagentes, plugins, MCP, memória e CLAUDE.md, deixando a execução previsível; exige ANTHROPIC_API_KEY, pois não lê o login por assinatura.',
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'cc-05-02',
      title: 'Saída estruturada e scripts',
      minutes: 26,
      content: 'content/claudecode/cc-05/02-saida-estruturada-e-scripts.md',
      exercises: [
        {
          type: 'mc',
          q: 'Ao usar --output-format json com --json-schema, em qual campo do envelope chega o objeto validado pelo esquema?',
          options: ['result', 'structured_output', 'usage', 'session_id'],
          answer: 1,
          explain: 'O texto final fica em result; o objeto que obedece ao JSON Schema chega em structured_output, já validado.',
        },
        {
          type: 'tf',
          q: 'O campo total_cost_usd da saída JSON é o valor exato que será cobrado na fatura.',
          answer: false,
          explain: 'A documentação diz que total_cost_usd é uma estimativa calculada no cliente a partir de uma tabela de preços embutida; a cobrança real está no Console.',
        },
        {
          type: 'fill',
          q: 'Para obter uma saída que obedece a um esquema, combine --output-format json com a flag ___.',
          answer: ['--json-schema'],
          explain: '--json-schema recebe um JSON Schema; o agente conclui a tarefa e entrega um objeto validado em structured_output.',
        },
        {
          type: 'match',
          q: 'Relacione o subtype do resultado ao seu significado.',
          pairs: [['success', 'A execução terminou normalmente'], ['error_max_turns', 'O limite de turnos foi atingido'], ['error_max_budget_usd', 'A estimativa de gasto chegou ao teto'], ['error_max_structured_output_retries', 'Não foi possível produzir um objeto válido para o esquema']],
          explain: 'Os subtypes de erro dizem qual limite ou validação falhou, o que orienta a correção: simplificar a tarefa, ampliar o orçamento ou revisar o esquema.',
        },
        {
          type: 'order',
          q: 'Ordene a validação defensiva da saída de claude -p --output-format json em Python.',
          items: ['Chamar json.loads e tratar JSONDecodeError', 'Conferir que type é "result"', 'Conferir is_error e subtype', 'Validar os campos de negócio (CNPJ, valor)', 'Gravar no banco ou na planilha'],
          explain: 'Cada camada depende da anterior: só faz sentido validar campos de negócio depois de saber que o JSON é válido, que é um envelope de resultado e que a execução teve sucesso.',
        },
        {
          type: 'mc',
          q: 'Por que o script Python passa o conteúdo do documento pelo parâmetro input do subprocess.run (stdin) em vez de colocá-lo no prompt como argumento?',
          options: ['Porque o Claude não aceita argumentos de linha de comando', 'Para não estourar o limite da linha de comando e não precisar liberar a ferramenta Read', 'Porque stdin é processado mais rápido pelo modelo', 'Porque --json-schema exige entrada por stdin'],
          answer: 1,
          explain: 'A linha de comando tem limite de tamanho e o conteúdo por stdin chega direto ao agente, sem que ele precise de permissão para ler arquivos.',
        },
        {
          type: 'code',
          q: 'Escreva `extrair_resultado(texto)` que interpreta a saída de `claude -p --output-format json`. Regras: (1) se o texto não for JSON válido, devolva {"ok": False, "erro": "JSON invalido"}; (2) se não for um dicionário com "type" igual a "result", devolva {"ok": False, "erro": "envelope inesperado"}; (3) se "is_error" for verdadeiro ou "subtype" for diferente de "success", devolva {"ok": False, "erro": <subtype ou "desconhecido">}; (4) caso contrário, devolva {"ok": True, "texto": result, "dados": structured_output (ou None), "custo": total_cost_usd (ou 0.0), "turnos": num_turns (ou 0)}.',
          starter: `import json

def extrair_resultado(texto):
    # sua implementacao
    pass
`,
          tests: `r = extrair_resultado('{"type":"result","subtype":"success","is_error":false,"result":"ok","structured_output":{"tipo":"boleto"},"total_cost_usd":0.012,"num_turns":1,"session_id":"abc"}')
assert r["ok"] is True, "Execucao com sucesso deve devolver ok True"
assert r["texto"] == "ok" and r["dados"] == {"tipo": "boleto"}, "texto e dados devem vir de result e structured_output"
assert r["custo"] == 0.012 and r["turnos"] == 1, "custo e turnos devem vir de total_cost_usd e num_turns"
r = extrair_resultado('isso nao e json')
assert r["ok"] is False and r["erro"] == "JSON invalido", "Texto que nao e JSON deve devolver erro 'JSON invalido'"
r = extrair_resultado('{"type":"result","subtype":"error_max_turns","is_error":true,"result":"","num_turns":3}')
assert r["ok"] is False and r["erro"] == "error_max_turns", "Erro de execucao deve devolver o subtype como erro"
r = extrair_resultado('{"type":"outro"}')
assert r["ok"] is False and r["erro"] == "envelope inesperado", "type diferente de result e envelope inesperado"
r = extrair_resultado('[1, 2]')
assert r["ok"] is False and r["erro"] == "envelope inesperado", "Lista nao e um envelope valido"
r = extrair_resultado('null')
assert r["ok"] is False and r["erro"] == "envelope inesperado", "null e JSON valido, mas nao e um dicionario: envelope inesperado"
r = extrair_resultado('{"type":"result","subtype":"success","is_error":false,"result":"x"}')
assert r == {"ok": True, "texto": "x", "dados": None, "custo": 0.0, "turnos": 0}, "Campos ausentes devem receber None, 0.0 e 0"
`,
          solution: `import json

def extrair_resultado(texto):
    try:
        dados = json.loads(texto)
    except json.JSONDecodeError:
        return {"ok": False, "erro": "JSON invalido"}
    if not isinstance(dados, dict) or dados.get("type") != "result":
        return {"ok": False, "erro": "envelope inesperado"}
    if dados.get("is_error") or dados.get("subtype") != "success":
        return {"ok": False, "erro": dados.get("subtype", "desconhecido")}
    return {
        "ok": True,
        "texto": dados.get("result", ""),
        "dados": dados.get("structured_output"),
        "custo": dados.get("total_cost_usd", 0.0),
        "turnos": dados.get("num_turns", 0),
    }
`,
          explain: 'Validar em camadas (JSON, envelope, sucesso, campos) evita usar dados de uma execução que falhou; os padrões None, 0.0 e 0 deixam o restante do script previsível.',
          hint: 'Use try/except em volta de json.loads; depois isinstance(dados, dict); depois is_error/subtype; use dados.get(chave, padrao) para os campos opcionais.',
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'cc-05-03',
      title: 'Agendamento e lotes',
      minutes: 27,
      content: 'content/claudecode/cc-05/03-agendamento-e-lotes.md',
      exercises: [
        {
          type: 'mc',
          q: 'Qual opção de agendamento documentada continua rodando mesmo com o seu computador desligado?',
          options: ['/loop dentro da sessão', 'Tarefa agendada do app Desktop', 'Routines (nuvem)', 'Agendador de Tarefas do Windows'],
          answer: 2,
          explain: 'Routines executam na infraestrutura da Anthropic (ou em ambiente auto-hospedado), clonando o repositório a cada execução; as outras opções dependem da máquina ligada.',
        },
        {
          type: 'tf',
          q: 'As tarefas agendadas do app Desktop são executadas mesmo com o aplicativo fechado e o computador dormindo.',
          answer: false,
          explain: 'A documentação diz que elas só disparam com o app aberto e o computador acordado; execuções perdidas geram uma única execução de recuperação ao acordar.',
        },
        {
          type: 'fill',
          q: 'Tarefas recorrentes criadas com /loop expiram automaticamente ___ dias após a criação.',
          answer: ['7', 'sete'],
          explain: 'A documentação fixa a expiração em 7 dias para limitar o tempo que um laço esquecido pode rodar; para algo durável, use Routines ou tarefas do Desktop.',
        },
        {
          type: 'match',
          q: 'Relacione cada opção à sua característica.',
          pairs: [['Routines', 'Roda na nuvem; intervalo mínimo de 1 hora'], ['Tarefa do Desktop', 'Roda na máquina com o app aberto; intervalo mínimo de 1 minuto'], ['/loop', 'Exige a sessão aberta; para acompanhar algo durante o trabalho'], ['Agendador de Tarefas do Windows', 'Executa um script seu que chama claude -p']],
          explain: 'Cada opção troca comodidade por controle: a nuvem dispensa a máquina, o Desktop dá acesso a arquivos locais, o /loop é imediato, e o Agendador dá controle total.',
        },
        {
          type: 'order',
          q: 'Ordene as etapas de um lote idempotente que processa uma pasta de PDFs.',
          items: ['Listar os arquivos em ordem estável (sorted)', 'Pular os que já têm status "ok" no registro', 'Processar cada item dentro de try/except', 'Gravar o registro em disco a cada item', 'Mover o arquivo só depois de gravar o status'],
          explain: 'Ordem estável torna reexecuções previsíveis; pular os prontos evita custo repetido; exceção por item isola falhas; gravar antes de mover evita perder o estado numa queda.',
        },
        {
          type: 'mc',
          q: 'Em qual caso a API direta da Anthropic é mais adequada do que o Claude Code?',
          options: ['Quando a tarefa precisa editar arquivos e rodar testes', 'Quando a tarefa usa servidores MCP', 'Quando é uma classificação de texto de uma única rodada, sem ferramentas, em alto volume', 'Quando a tarefa precisa abrir um pull request'],
          answer: 2,
          explain: 'Sem necessidade de ferramentas, uma chamada direta à API é mais simples e barata que um laço agêntico; o Claude Code compensa quando há arquivos, comandos, MCP ou Git.',
        },
        {
          type: 'code',
          q: 'Escreva `filtrar_pendentes(arquivos, registro, max_tentativas=3)`. `arquivos` é uma lista de nomes; `registro` é um dicionário nome -> {"status": "ok"|"erro", "tentativas": n}. Devolva, em ordem alfabética, os nomes que ainda precisam ser processados: os que não estão no registro e os que estão com status diferente de "ok" e tentativas menores que `max_tentativas`.',
          starter: `def filtrar_pendentes(arquivos, registro, max_tentativas=3):
    # sua implementacao
    return []
`,
          tests: `registro = {
    "a.pdf": {"status": "ok", "tentativas": 1},
    "b.pdf": {"status": "erro", "tentativas": 1},
    "c.pdf": {"status": "erro", "tentativas": 3},
}
assert filtrar_pendentes(["c.pdf", "a.pdf", "b.pdf", "d.pdf"], registro) == ["b.pdf", "d.pdf"], "Deve devolver erro com tentativas < 3 e arquivos novos, em ordem alfabetica"
assert filtrar_pendentes([], registro) == [], "Lista vazia devolve lista vazia"
assert filtrar_pendentes(["c.pdf"], registro, max_tentativas=4) == ["c.pdf"], "Com max_tentativas maior, c.pdf volta a ser pendente"
assert filtrar_pendentes(["a.pdf"], {}) == ["a.pdf"], "Sem registro, tudo e pendente"
assert filtrar_pendentes(["a.pdf"], registro) == [], "Arquivo com status ok nao e pendente"
`,
          solution: `def filtrar_pendentes(arquivos, registro, max_tentativas=3):
    pendentes = []
    for nome in arquivos:
        item = registro.get(nome)
        if item is None:
            pendentes.append(nome)
        elif item.get("status") != "ok" and item.get("tentativas", 0) < max_tentativas:
            pendentes.append(nome)
    return sorted(pendentes)
`,
          explain: 'Idempotência: itens prontos são pulados e falhas são repetidas até um limite; ordenar o resultado torna cada reexecução previsível.',
          hint: 'Para cada nome, pegue registro.get(nome); None significa novo; senão compare status e tentativas. Devolva sorted(...).',
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'cc-05-04',
      title: 'GitHub Actions com Claude Code',
      minutes: 24,
      content: 'content/claudecode/cc-05/04-github-actions.md',
      exercises: [
        {
          type: 'mc',
          q: 'Qual é o nome da action oficial usada no workflow?',
          options: ['anthropics/claude-code-action@v1', 'anthropic/claude-action@latest', 'claude/github-action@v2', 'anthropics/claude-code@beta'],
          answer: 0,
          explain: 'A documentação usa anthropics/claude-code-action@v1 na linha uses; a versão @beta é antiga e a doc orienta migrar para @v1.',
        },
        {
          type: 'tf',
          q: 'Quando o workflow não define o input prompt, a action entra em modo interativo e responde à frase de gatilho @claude em issues e PRs.',
          answer: true,
          explain: 'A action detecta o modo pelo arquivo: sem prompt, espera o gatilho (@claude por padrão); com prompt, roda em automação em qualquer evento.',
        },
        {
          type: 'fill',
          q: 'Dentro de uma sessão do Claude Code, o comando ___ instala o GitHub App, cria o segredo e abre o PR com o workflow.',
          answer: ['/install-github-app'],
          explain: '/install-github-app é a configuração rápida; exige gh CLI autenticado, acesso de administrador e repositório no github.com.',
        },
        {
          type: 'match',
          q: 'Relacione cada input da action à sua função.',
          pairs: [['anthropic_api_key', 'Chave da API, passada via secrets'], ['claude_code_oauth_token', 'Token da assinatura gerado por claude setup-token'], ['claude_args', 'Argumentos da CLI, como --max-turns e --allowedTools'], ['prompt', 'Instruções fixas que ativam o modo automação'], ['trigger_phrase', 'Frase de gatilho, @claude por padrão']],
          explain: 'Autenticação, argumentos da CLI, prompt e gatilho são os inputs centrais; os demais estão na referência de configuração da action.',
        },
        {
          type: 'mc',
          q: 'Por que a documentação recomenda NÃO passar github_token: secrets.GITHUB_TOKEN para a action?',
          options: ['Porque o token expira em 1 hora', 'Porque commits feitos com o GITHUB_TOKEN padrão não disparam outros workflows', 'Porque a action não aceita esse input', 'Porque o token não tem permissão de leitura'],
          answer: 1,
          explain: 'O GitHub não dispara workflows em commits feitos com o GITHUB_TOKEN padrão; deixando a action autenticar como o Claude GitHub App, o CI roda nos commits do Claude.',
        },
        {
          type: 'order',
          q: 'Ordene a configuração manual da action.',
          items: ['Instalar o Claude GitHub App no repositório', 'Criar o segredo ANTHROPIC_API_KEY ou CLAUDE_CODE_OAUTH_TOKEN', 'Copiar examples/claude.yml para .github/workflows/', 'Comentar @claude em uma issue para testar'],
          explain: 'App, segredo e workflow são os três componentes; o teste vem depois do merge do workflow.',
        },
        {
          type: 'mc',
          q: 'Quais recursos cada execução da action consome, segundo a documentação?',
          options: ['Apenas tokens da API', 'Minutos do GitHub Actions e tokens (API ou assinatura)', 'Apenas minutos do GitHub Actions', 'Créditos do app Desktop'],
          answer: 1,
          explain: 'Os runners hospedados consomem minutos de Actions e cada interação consome tokens; --max-turns, timeout-minutes e concurrency limitam ambos.',
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'cc-05-05',
      title: 'Agent SDK',
      minutes: 26,
      content: 'content/claudecode/cc-05/05-agent-sdk.md',
      exercises: [
        {
          type: 'mc',
          q: 'Qual é o pacote Python do Agent SDK?',
          options: ['anthropic-agent', 'claude-agent-sdk', 'claude-code-sdk', 'mcp[cli]'],
          answer: 1,
          explain: 'pip install claude-agent-sdk; o nome antigo "Claude Code SDK" foi substituído por Agent SDK, e o pacote mcp é o SDK do protocolo MCP, outra coisa.',
        },
        {
          type: 'tf',
          q: 'O Agent SDK carrega automaticamente a chave de API de um arquivo .env na pasta do projeto.',
          answer: false,
          explain: 'A documentação diz que o SDK lê a chave do ambiente do processo e não carrega .env sozinho; é preciso defini-la no shell ou carregar o arquivo no seu código.',
        },
        {
          type: 'fill',
          q: 'A função central do SDK Python, que devolve um iterador assíncrono de mensagens, é ___().',
          answer: ['query'],
          explain: 'query(prompt=..., options=ClaudeAgentOptions(...)) cria o laço agêntico; você consome as mensagens com async for.',
        },
        {
          type: 'match',
          q: 'Relacione o campo de ClaudeAgentOptions à flag equivalente da CLI.',
          pairs: [['allowed_tools', '--allowedTools'], ['permission_mode', '--permission-mode'], ['max_turns', '--max-turns'], ['max_budget_usd', '--max-budget-usd'], ['output_format', '--json-schema']],
          explain: 'O SDK expõe como campos o que a CLI expõe como flags; output_format com type json_schema corresponde ao --json-schema.',
        },
        {
          type: 'mc',
          q: 'Em qual situação o Agent SDK compensa mais do que chamar claude -p por subprocess?',
          options: ['Para um único resumo de log por dia', 'Quando você precisa de vários turnos no mesmo processo, mensagens tipadas ou callbacks de permissão', 'Quando a tarefa não usa nenhuma ferramenta', 'Quando o script roda em bash'],
          answer: 1,
          explain: 'Para scripts simples a CLI basta; o SDK vale quando a integração é profunda: conversa com memória, objetos de mensagem, aprovação programática de ferramentas.',
        },
        {
          type: 'mc',
          q: 'A ResultMessage veio com subtype "error_max_turns". Qual é a ação correta no seu código?',
          options: ['Repetir imediatamente o mesmo prompt até dar certo', 'Simplificar ou dividir a tarefa, ou revisar o limite, antes de tentar de novo', 'Ignorar e usar o campo result mesmo assim', 'Aumentar max_budget_usd'],
          answer: 1,
          explain: 'O limite de turnos indica tarefa grande ou mal definida; repetir igual gasta de novo e tende a falhar de novo; orçamento não resolve limite de turnos.',
        },
        {
          type: 'code',
          q: 'Escreva `consolidar(resultados, limite_custo)` que recebe uma lista de dicionários (cada um com "subtype", "is_error", "total_cost_usd" e, opcionalmente, "structured_output") e devolve {"ok": n, "reprocessar": n, "revisar_custo": n, "sem_dados": n, "custo_total": float}. Classifique cada item nesta ordem: is_error verdadeiro ou subtype diferente de "success" -> "reprocessar"; custo (None vale 0) maior que limite_custo -> "revisar_custo"; structured_output ausente ou None -> "sem_dados"; senão "ok". custo_total soma o custo de todos os itens.',
          starter: `def consolidar(resultados, limite_custo):
    # sua implementacao
    pass
`,
          tests: `rs = [
    {"subtype": "success", "is_error": False, "total_cost_usd": 0.02, "structured_output": {"a": 1}},
    {"subtype": "error_max_turns", "is_error": True, "total_cost_usd": 0.30},
    {"subtype": "success", "is_error": False, "total_cost_usd": 0.50, "structured_output": {"a": 1}},
    {"subtype": "success", "is_error": False, "total_cost_usd": None, "structured_output": None},
]
r = consolidar(rs, 0.10)
assert r["ok"] == 1 and r["reprocessar"] == 1 and r["revisar_custo"] == 1 and r["sem_dados"] == 1, "Cada item deve cair em uma categoria: " + str(r)
assert abs(r["custo_total"] - 0.82) < 1e-9, "custo_total deve somar os custos (None vale 0): " + str(r["custo_total"])
assert consolidar([], 0.1) == {"ok": 0, "reprocessar": 0, "revisar_custo": 0, "sem_dados": 0, "custo_total": 0.0}, "Lista vazia devolve zeros"
r = consolidar([{"subtype": "success", "is_error": True, "total_cost_usd": 0.01, "structured_output": {}}], 1.0)
assert r["reprocessar"] == 1, "is_error True deve reprocessar mesmo com subtype success"
r = consolidar([{"subtype": "success", "is_error": False, "total_cost_usd": 0.05, "structured_output": {"x": 1}}], 0.05)
assert r["ok"] == 1, "Custo igual ao limite nao e maior que o limite"
`,
          solution: `def consolidar(resultados, limite_custo):
    saida = {"ok": 0, "reprocessar": 0, "revisar_custo": 0, "sem_dados": 0, "custo_total": 0.0}
    for r in resultados:
        custo = r.get("total_cost_usd") or 0.0
        saida["custo_total"] += custo
        if r.get("is_error") or r.get("subtype") != "success":
            saida["reprocessar"] += 1
        elif custo > limite_custo:
            saida["revisar_custo"] += 1
        elif r.get("structured_output") is None:
            saida["sem_dados"] += 1
        else:
            saida["ok"] += 1
    return saida
`,
          explain: 'A ordem das regras importa: um erro de execução deve ser reprocessado antes de se avaliar custo ou dados; somar o custo de todos os itens dá o total real do lote.',
          hint: 'Crie o dicionário de saída com zeros; para cada item, calcule custo = r.get("total_cost_usd") or 0.0, some ao total e use if/elif na ordem pedida.',
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'cc-05-06',
      title: 'Workflows multi-etapas',
      minutes: 26,
      content: 'content/claudecode/cc-05/06-workflows-multi-etapas.md',
      exercises: [
        {
          type: 'mc',
          q: 'Onde o Claude Code cria o worktree ao rodar claude --worktree relatorio?',
          options: ['Em ../relatorio, ao lado do repositório', 'Em .claude/worktrees/relatorio/, no branch worktree-relatorio', 'Em ~/.claude/worktrees/relatorio', 'Na própria pasta do repositório, trocando de branch'],
          answer: 1,
          explain: 'Por padrão o worktree fica em .claude/worktrees/<nome>/ na raiz do repositório, em um branch novo chamado worktree-<nome>; a doc sugere ignorar essa pasta no .gitignore.',
        },
        {
          type: 'tf',
          q: 'Os checkpoints do /rewind substituem commits no Git em workflows longos.',
          answer: false,
          explain: 'A documentação avisa que os checkpoints rastreiam só edições feitas pelas ferramentas de arquivo do Claude e não substituem o Git; commits entre etapas são o ponto de retorno confiável.',
        },
        {
          type: 'fill',
          q: 'A flag que inicia o Claude Code em um worktree isolado é ___ <nome> (ou -w).',
          answer: ['--worktree'],
          explain: '--worktree / -w cria o worktree e o branch e inicia a sessão nele; em dois terminais, nomes diferentes dão sessões paralelas isoladas.',
        },
        {
          type: 'match',
          q: 'Relacione a situação à decisão sobre paralelismo.',
          pairs: [['Coleta de três fontes em arquivos distintos', 'Paralelizar em worktrees ou subagentes'], ['Redação que depende do arquivo conciliado', 'Executar depois, em sequência'], ['Duas tarefas que editam o mesmo arquivo', 'Não paralelizar: haverá conflito'], ['Revisão do que acabou de ser escrito', 'Sessão nova ou subagente com contexto fresco']],
          explain: 'Independência em dados e arquivos permite paralelismo; dependência ou arquivos compartilhados exigem sequência; revisão pede contexto sem o viés de quem produziu.',
        },
        {
          type: 'order',
          q: 'Ordene as etapas do workflow do relatório mensal.',
          items: ['Coleta por fonte (paralela)', 'Conciliação em um arquivo único', 'Redação do relatório', 'Revisão por sessão nova ou subagente', 'Abertura do PR pelo script'],
          explain: 'Coleta alimenta conciliação, que alimenta redação; a revisão confere a redação e só então o PR é aberto.',
        },
        {
          type: 'mc',
          q: 'Você rodou claude -p --worktree lote1 em um script. O que acontece com o worktree ao fim?',
          options: ['É removido automaticamente', 'Fica no disco; execuções -p não limpam, e você remove com git worktree remove', 'É convertido em branch remoto', 'É movido para a lixeira do sistema'],
          answer: 1,
          explain: 'A documentação diz que execuções não interativas não têm prompt de saída, então o Claude não limpa seus worktrees; a remoção é manual (git worktree remove, ou unlock antes se estiver travado).',
        },
        {
          type: 'code',
          q: 'Escreva `dividir_lotes(itens, tamanho)` que divide uma lista em sublistas consecutivas de até `tamanho` elementos, preservando a ordem. Se `tamanho` for menor ou igual a zero, levante ValueError. Lista vazia devolve lista vazia.',
          starter: `def dividir_lotes(itens, tamanho):
    # sua implementacao
    pass
`,
          tests: `assert dividir_lotes([1, 2, 3, 4, 5], 2) == [[1, 2], [3, 4], [5]], "Cinco itens em lotes de 2 geram [[1,2],[3,4],[5]]"
assert dividir_lotes([], 3) == [], "Lista vazia devolve lista vazia"
assert dividir_lotes(["a", "b"], 5) == [["a", "b"]], "Tamanho maior que a lista gera um unico lote"
assert dividir_lotes([1, 2, 3], 3) == [[1, 2, 3]], "Tamanho igual ao total gera um lote"
try:
    dividir_lotes([1], 0)
    assert False, "tamanho 0 deve levantar ValueError"
except ValueError:
    pass
try:
    dividir_lotes([1, 2], -1)
    assert False, "tamanho negativo deve levantar ValueError"
except ValueError:
    pass
`,
          solution: `def dividir_lotes(itens, tamanho):
    if tamanho <= 0:
        raise ValueError("tamanho deve ser positivo")
    return [itens[i:i + tamanho] for i in range(0, len(itens), tamanho)]
`,
          explain: 'Fatias consecutivas preservam a ordem e permitem disparar um grupo de execuções por vez; validar o tamanho evita um laço infinito com passo zero.',
          hint: 'Use fatias: itens[i:i+tamanho] com i variando em range(0, len(itens), tamanho). Valide tamanho antes.',
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'cc-05-07',
      title: 'Custos, monitoramento e limites',
      minutes: 27,
      content: 'content/claudecode/cc-05/07-custos-monitoramento.md',
      exercises: [
        {
          type: 'mc',
          q: 'Na documentação atual, o comando /cost é:',
          options: ['Um comando removido', 'Um alias de /usage', 'O único lugar para ver a fatura real', 'Um comando exclusivo da API'],
          answer: 1,
          explain: '/usage mostra custo da sessão, tokens, limites do plano e atribuição; /cost e /stats são aliases dele.',
        },
        {
          type: 'tf',
          q: 'Em um plano por assinatura (Pro ou Max), o valor em dólares exibido no bloco Session do /usage é o que será cobrado.',
          answer: false,
          explain: 'A documentação diz que o custo de sessão é voltado a usuários de API; assinantes têm o uso incluído no plano, então o valor não é relevante para cobrança.',
        },
        {
          type: 'fill',
          q: 'Para ativar a exportação OpenTelemetry é obrigatório definir a variável ___=1 antes de configurar os exportadores.',
          answer: ['CLAUDE_CODE_ENABLE_TELEMETRY'],
          explain: 'CLAUDE_CODE_ENABLE_TELEMETRY=1 liga a coleta; depois se escolhem OTEL_METRICS_EXPORTER, OTEL_LOGS_EXPORTER, protocolo e endpoint.',
        },
        {
          type: 'match',
          q: 'Relacione a tática ao efeito sobre custo e contexto.',
          pairs: [['/clear entre tarefas', 'Evita reenviar contexto antigo a cada mensagem'], ['/compact com instruções', 'Resume a conversa preservando o que você indicou'], ['Subagentes para testes e logs', 'Mantêm a saída verbosa fora do contexto principal'], ['Hook que filtra a saída de testes', 'Reduz milhares de tokens a centenas antes de chegarem ao Claude'], ['CLAUDE.md com menos de 200 linhas', 'Diminui o que é carregado em toda sessão']],
          explain: 'Todas as táticas atacam o mesmo problema: quanto maior o contexto enviado, maior o custo e menor a qualidade.',
        },
        {
          type: 'mc',
          q: 'Qual métrica OpenTelemetry registra o custo estimado em dólares?',
          options: ['claude_code.token.usage', 'claude_code.cost.usage', 'claude_code.session.count', 'claude_code.api_request'],
          answer: 1,
          explain: 'claude_code.cost.usage é a métrica de custo em USD; claude_code.token.usage conta tokens; api_request é um evento, não uma métrica.',
        },
        {
          type: 'mc',
          q: 'Você quer que um script leia o que aconteceu em uma sessão. Qual abordagem a documentação recomenda?',
          options: ['Ler o arquivo .jsonl em ~/.claude/projects/ com um parser próprio', 'Usar /export ou claude -p --resume <id> --output-format json para obter um resumo estruturado', 'Copiar o terminal para um arquivo de texto', 'Ativar OTEL_LOG_USER_PROMPTS no settings do projeto'],
          answer: 1,
          explain: 'O formato das transcrições é interno e muda entre versões; a doc indica /export e as interfaces de script (saída JSON, --resume, hooks) para acesso estável.',
        },
        {
          type: 'code',
          q: 'Escreva `custo_total(resultados)` que recebe uma lista de dicionários com "nome" e, opcionalmente, "total_cost_usd" (pode faltar ou ser None). Devolva {"total": soma arredondada a 4 casas, "mais_caro": nome do item de maior custo (ou None se nenhum tiver custo), "sem_custo": lista dos nomes sem custo, na ordem original}.',
          starter: `def custo_total(resultados):
    # sua implementacao
    pass
`,
          tests: `rs = [{"nome": "a", "total_cost_usd": 0.01}, {"nome": "b", "total_cost_usd": 0.05}, {"nome": "c", "total_cost_usd": None}]
r = custo_total(rs)
assert r["total"] == 0.06, "total deve somar 0.01 + 0.05 = 0.06, obtido " + str(r["total"])
assert r["mais_caro"] == "b", "O mais caro e b"
assert r["sem_custo"] == ["c"], "c nao tem custo"
assert custo_total([]) == {"total": 0.0, "mais_caro": None, "sem_custo": []}, "Lista vazia devolve total 0.0 e mais_caro None"
r = custo_total([{"nome": "x"}, {"nome": "y"}])
assert r["sem_custo"] == ["x", "y"] and r["mais_caro"] is None and r["total"] == 0.0, "Sem custos: todos em sem_custo e mais_caro None"
r = custo_total([{"nome": "p", "total_cost_usd": 0.1}, {"nome": "q", "total_cost_usd": 0.2}, {"nome": "r", "total_cost_usd": 0.15}])
assert r["mais_caro"] == "q" and r["total"] == 0.45, "mais_caro deve ser q e total 0.45"
`,
          solution: `def custo_total(resultados):
    total = 0.0
    mais_caro = None
    maior = -1.0
    sem_custo = []
    for r in resultados:
        custo = r.get("total_cost_usd")
        if custo is None:
            sem_custo.append(r["nome"])
            continue
        total += custo
        if custo > maior:
            maior = custo
            mais_caro = r["nome"]
    return {"total": round(total, 4), "mais_caro": mais_caro, "sem_custo": sem_custo}
`,
          explain: 'Separar itens sem custo dos demais evita somar None e mostra onde a saída JSON não trouxe estimativa; o item mais caro orienta o teto de --max-budget-usd.',
          hint: 'Percorra a lista; se r.get("total_cost_usd") for None, anote em sem_custo e continue; senão some e compare com o maior visto até agora.',
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'cc-05-08',
      title: 'Segurança em automação',
      minutes: 27,
      content: 'content/claudecode/cc-05/08-seguranca-em-automacao.md',
      exercises: [
        {
          type: 'mc',
          q: 'Qual modo de permissão a documentação indica para um script de CI que deve rodar sem ninguém para aprovar e com uma lista exata de ferramentas?',
          options: ['bypassPermissions', 'plan', 'dontAsk', 'acceptEdits'],
          answer: 2,
          explain: 'dontAsk nega automaticamente tudo o que pediria aprovação e deixa passar só o que já é livre ou o que está na allowlist; bypassPermissions só é aceitável dentro de contêiner, VM ou sandbox runtime.',
        },
        {
          type: 'tf',
          q: 'Regras de deny em permissions valem em todos os modos, inclusive em bypassPermissions.',
          answer: true,
          explain: 'A documentação afirma que deny bloqueia em todo modo, inclusive bypassPermissions; já as regras allow não têm efeito nesse modo.',
        },
        {
          type: 'fill',
          q: 'As regras de permissão são avaliadas na ordem deny, ___, allow; a primeira que casa decide.',
          answer: ['ask'],
          explain: 'deny tem prioridade, depois ask (sempre pergunta), depois allow; a especificidade da regra não altera a ordem.',
        },
        {
          type: 'match',
          q: 'Relacione a ameaça ao controle principal.',
          pairs: [['Injeção de prompt em PDF processado', 'Esquema JSON e nenhuma ferramenta de efeito externo na mesma execução'], ['Chave de API vazada', 'Variável de ambiente e regra Read de negação para arquivos de segredo'], ['Comando destrutivo', 'Hook PreToolUse com exit 2 e regras deny'], ['Hooks de repositório clonado rodando em -p', 'Flag --bare'], ['Ação com efeito externo errada', 'Fila de propostas com aprovação humana antes de executar']],
          explain: 'Cada ameaça tem um controle que atua antes do dano: limitar saída, esconder segredos, bloquear comandos, não carregar configuração alheia, exigir pessoa.',
        },
        {
          type: 'mc',
          q: 'O sandbox do Bash embutido no Claude Code pode ser usado no Windows nativo?',
          options: ['Sim, basta rodar /sandbox', 'Não; ele roda em macOS, Linux e WSL2, e no Windows nativo os comandos rodam sem sandbox', 'Sim, mas só com PowerShell', 'Sim, após instalar o Docker'],
          answer: 1,
          explain: 'A documentação diz que no Windows nativo os comandos rodam sem sandbox; para isolar na máquina Windows, use WSL2, contêiner ou VM.',
        },
        {
          type: 'mc',
          q: 'Qual regra de allow libera "git diff HEAD" sem liberar "git diff-index"?',
          options: ['Bash(git diff*)', 'Bash(git diff *)', 'Bash(git *diff)', 'Bash'],
          answer: 1,
          explain: 'O espaço antes do * importa: Bash(git diff *) casa comandos que começam com "git diff" seguido de espaço; sem o espaço, git diff* também casaria git diff-index; Bash sozinho libera tudo.',
        },
        {
          type: 'code',
          q: 'Escreva `avaliar_permissao(regras, chamada)`. `regras` é um dicionário com listas opcionais "deny", "ask" e "allow"; `chamada` é um texto como "Bash(git push origin main)" ou "Read(./.env)". Uma regra casa quando: (a) é só o nome da ferramenta (ex.: "Read") e a chamada é dessa ferramenta; (b) termina em " *" (ex.: "Bash(git diff *)") e o conteúdo da chamada é igual ao prefixo ou começa com o prefixo seguido de espaço; (c) é exata (ex.: "Read(./.env)") e o conteúdo é idêntico. Avalie deny, depois ask, depois allow e devolva a primeira decisão que casar; sem regra, devolva "sem_regra".',
          starter: `def avaliar_permissao(regras, chamada):
    # sua implementacao
    return "sem_regra"
`,
          tests: `regras = {
    "deny": ["Read(./.env)", "Bash(curl *)"],
    "ask": ["Bash(git push *)"],
    "allow": ["Bash(git diff *)", "Read"],
}
assert avaliar_permissao(regras, "Bash(git diff HEAD)") == "allow", "git diff HEAD casa Bash(git diff *)"
assert avaliar_permissao(regras, "Bash(git diff)") == "allow", "git diff sozinho tambem casa o prefixo"
assert avaliar_permissao(regras, "Bash(git diff-index)") == "sem_regra", "git diff-index nao casa Bash(git diff *)"
assert avaliar_permissao(regras, "Bash(git push origin main)") == "ask", "git push casa a regra ask"
assert avaliar_permissao(regras, "Bash(curl http://x)") == "deny", "curl casa deny"
assert avaliar_permissao(regras, "Read(./.env)") == "deny", "Read(./.env) e deny mesmo com Read em allow"
assert avaliar_permissao(regras, "Read(./dados.csv)") == "allow", "Read sem especificador libera qualquer leitura"
assert avaliar_permissao(regras, "Edit(a.py)") == "sem_regra", "Sem regra para Edit"
assert avaliar_permissao({"deny": ["Bash"], "allow": ["Bash(git diff *)"]}, "Bash(git diff)") == "deny", "deny vem antes de allow"
assert avaliar_permissao({}, "Bash(ls)") == "sem_regra", "Sem regras devolve sem_regra"
`,
          solution: `def _partes(texto):
    if "(" in texto and texto.endswith(")"):
        i = texto.index("(")
        return texto[:i], texto[i + 1:-1]
    return texto, None

def _casa(regra, chamada):
    rf, ri = _partes(regra)
    cf, ci = _partes(chamada)
    if rf != cf:
        return False
    if ri is None:
        return True
    if ci is None:
        return False
    if ri.endswith(" *"):
        prefixo = ri[:-2]
        return ci == prefixo or ci.startswith(prefixo + " ")
    return ri == ci

def avaliar_permissao(regras, chamada):
    for decisao in ("deny", "ask", "allow"):
        for regra in regras.get(decisao, []):
            if _casa(regra, chamada):
                return decisao
    return "sem_regra"
`,
          explain: 'Reproduz a avaliação documentada: deny, depois ask, depois allow; o prefixo com espaço antes do * é o que impede git diff-index de casar com git diff.',
          hint: 'Separe ferramenta e conteúdo pelo primeiro "(" e pelo ")" final. Escreva uma função casa(regra, chamada) e percorra ("deny", "ask", "allow") nessa ordem.',
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'cc-05-09',
      title: 'Projeto guiado: Robô de triagem de documentos',
      minutes: 26,
      content: 'content/claudecode/cc-05/09-projeto-robo-de-triagem.md',
      exercises: [
        {
          type: 'mc',
          q: 'Por que o esquema do robô marca só "categoria" e "confianca" como obrigatórios?',
          options: ['Porque o JSON Schema permite no máximo dois campos obrigatórios', 'Porque campos como cnpj e valor não existem em todo documento, e exigi-los faria a validação falhar', 'Porque o Claude ignora os demais campos', 'Porque confianca substitui os outros campos'],
          answer: 1,
          explain: 'Um contrato não tem valor e um extrato não tem CNPJ de fornecedor; esquemas focados, com opcionais para o que pode faltar, evitam error_max_structured_output_retries.',
        },
        {
          type: 'tf',
          q: 'O robô de triagem deve receber a ferramenta Bash para poder mover os arquivos para as subpastas.',
          answer: false,
          explain: 'A execução de classificação não recebe ferramenta alguma: o texto entra por stdin e sai em structured_output; quem move arquivos, grava no banco e abre o PR é o Python e o PowerShell.',
        },
        {
          type: 'order',
          q: 'Ordene o pipeline do robô.',
          items: ['Extrair texto do PDF ou EML', 'Chamar claude -p com esquema JSON', 'Validar o envelope e os campos em Python', 'Rotear para a subpasta ou para revisão', 'Gravar no SQLite', 'Gerar o relatório e abrir o PR'],
          explain: 'Cada etapa consome a anterior: texto, classificação, validação, decisão de destino, persistência e, por fim, publicação revisável.',
        },
        {
          type: 'fill',
          q: 'A execução de classificação usa --permission-mode ___ para que nada além da resposta estruturada aconteça.',
          answer: ['dontAsk'],
          explain: 'dontAsk nega qualquer ação que pediria aprovação; combinado com a ausência de ferramentas liberadas e --bare, o agente só pode responder.',
        },
        {
          type: 'match',
          q: 'Relacione o componente à sua responsabilidade.',
          pairs: [['classificar.py', 'Chama claude -p com esquema e limites'], ['rotear.py', 'Decide destino e ação a partir do JSON'], ['banco.py', 'Grava status, custo e session_id por documento'], ['publicar.ps1', 'Cria branch, commita o relatório e abre o PR com gh'], ['triagem.ps1', 'Orquestra tudo e é registrado no Agendador de Tarefas']],
          explain: 'Separar responsabilidades permite testar cada parte sem o Claude e trocar uma peça sem mexer nas outras.',
        },
        {
          type: 'mc',
          q: 'O que garante que reexecutar o lote não reprocessa documentos já classificados?',
          options: ['O cache de prompt do Claude', 'A chave primária "nome" e o campo "status" na tabela documentos', 'A flag --continue', 'O agendador do Windows, que só roda uma vez'],
          answer: 1,
          explain: 'A função ja_processado consulta o status pelo nome; itens "ok" são pulados e "erro" são tentados de novo, o que é a idempotência da lição 3.',
        },
        {
          type: 'code',
          q: 'Escreva `rotear(classificacao, limite=0.8)` que devolve {"destino": ..., "acao": ...}. Regras: categoria fora de {"nota_fiscal", "boleto", "extrato", "contrato", "outro"} ou confianca (ausente vale 0) menor que limite -> {"destino": "revisao", "acao": "revisar"}; se a categoria for "nota_fiscal" ou "boleto", o campo cnpj precisa ter exatamente 14 dígitos numéricos (ausente ou formatado com pontos vai para revisão); caso contrário, destino é a própria categoria e acao é "arquivar".',
          starter: `PERMITIDAS = {"nota_fiscal", "boleto", "extrato", "contrato", "outro"}

def rotear(classificacao, limite=0.8):
    # sua implementacao
    pass
`,
          tests: `assert rotear({"categoria": "extrato", "confianca": 0.95}) == {"destino": "extrato", "acao": "arquivar"}, "Extrato confiavel vai para a pasta extrato"
assert rotear({"categoria": "nota_fiscal", "confianca": 0.9, "cnpj": "11222333000181"}) == {"destino": "nota_fiscal", "acao": "arquivar"}, "Nota fiscal com CNPJ de 14 digitos e arquivada"
assert rotear({"categoria": "nota_fiscal", "confianca": 0.9, "cnpj": "11.222.333/0001-81"}) == {"destino": "revisao", "acao": "revisar"}, "CNPJ formatado nao tem 14 digitos numericos: revisao"
assert rotear({"categoria": "boleto", "confianca": 0.9}) == {"destino": "revisao", "acao": "revisar"}, "Boleto sem CNPJ vai para revisao"
assert rotear({"categoria": "contrato", "confianca": 0.5}) == {"destino": "revisao", "acao": "revisar"}, "Confianca abaixo do limite: revisao"
assert rotear({"categoria": "recibo", "confianca": 0.99}) == {"destino": "revisao", "acao": "revisar"}, "Categoria fora da lista: revisao"
assert rotear({"categoria": "outro", "confianca": 0.6}, limite=0.5) == {"destino": "outro", "acao": "arquivar"}, "Limite menor aceita confianca 0.6"
assert rotear({"categoria": "extrato"}) == {"destino": "revisao", "acao": "revisar"}, "Sem confianca vale 0: revisao"
`,
          solution: `PERMITIDAS = {"nota_fiscal", "boleto", "extrato", "contrato", "outro"}

def rotear(classificacao, limite=0.8):
    categoria = classificacao.get("categoria")
    confianca = classificacao.get("confianca", 0)
    if categoria not in PERMITIDAS or confianca < limite:
        return {"destino": "revisao", "acao": "revisar"}
    if categoria in ("nota_fiscal", "boleto"):
        cnpj = str(classificacao.get("cnpj") or "")
        if not (len(cnpj) == 14 and cnpj.isdigit()):
            return {"destino": "revisao", "acao": "revisar"}
    return {"destino": categoria, "acao": "arquivar"}
`,
          explain: 'Confiança baixa e categoria fora da lista vão para revisão humana; nota e boleto exigem CNPJ válido porque alimentam lançamentos, e o resto é arquivado pela categoria.',
          hint: 'Verifique primeiro categoria e confiança; depois, só para nota_fiscal e boleto, confira len(cnpj) == 14 e cnpj.isdigit(); por fim devolva a categoria com "arquivar".',
        },
      ],
    },
  ],
  exam: {
    passScore: 70,
    questions: [
      {
        type: 'mc',
        q: 'O que acontece com um pedido de permissão em uma execução claude -p sem nenhum host para responder?',
        options: ['O comando fica aguardando indefinidamente', 'O pedido é negado e a execução continua', 'O Claude Code aprova automaticamente', 'A execução é cancelada com código 143'],
        answer: 1,
        explain: 'A documentação diz que, em uma execução -p sem host, os pedidos que ninguém pode responder são negados; o resultado pode vir incompleto e permission_denials registra o que foi negado.',
      },
      {
        type: 'tf',
        q: 'Com --bare, o Claude Code usa normalmente o login da sua assinatura (claude.ai).',
        answer: false,
        explain: 'Em modo bare o Claude Code não lê credenciais OAuth nem o keychain; a autenticação precisa vir de ANTHROPIC_API_KEY ou de um apiKeyHelper em --settings.',
      },
      {
        type: 'fill',
        q: 'O formato de saída que emite um objeto JSON por linha, em tempo real, é --output-format ___.',
        answer: ['stream-json'],
        explain: 'stream-json imprime eventos linha a linha (começando por system/init e terminando com result); json devolve um único objeto ao final; text é o padrão.',
      },
      {
        type: 'match',
        q: 'Relacione o campo do envelope JSON ao seu conteúdo.',
        pairs: [['result', 'Texto final da resposta'], ['structured_output', 'Objeto validado pelo --json-schema'], ['session_id', 'Identificador para --resume'], ['permission_denials', 'Ações negadas por falta de permissão'], ['num_turns', 'Turnos agênticos usados']],
        explain: 'Esses campos permitem que o script use o resultado, retome a sessão, audite negações e controle o consumo.',
      },
      {
        type: 'mc',
        q: 'Qual intervalo mínimo a documentação fixa para Routines (agendamento na nuvem)?',
        options: ['1 minuto', '15 minutos', '1 hora', '1 dia'],
        answer: 2,
        explain: 'Routines têm intervalo mínimo de uma hora; tarefas do Desktop e /loop aceitam um minuto.',
      },
      {
        type: 'mc',
        q: 'Qual segredo do repositório é usado quando a autenticação da action é feita pela assinatura, com token gerado por claude setup-token?',
        options: ['ANTHROPIC_API_KEY', 'CLAUDE_CODE_OAUTH_TOKEN', 'GITHUB_TOKEN', 'CLAUDE_SESSION_TOKEN'],
        answer: 1,
        explain: 'claude setup-token gera um token OAuth de longa duração que vai no segredo CLAUDE_CODE_OAUTH_TOKEN e no input claude_code_oauth_token; ANTHROPIC_API_KEY é para chave do Console.',
      },
      {
        type: 'tf',
        q: 'Em repositórios públicos, a revisão automática de PR pela action roda também em pull requests vindos de forks.',
        answer: false,
        explain: 'O GitHub não entrega segredos a execuções disparadas por PRs de forks em repositórios públicos, então a revisão só roda em branches do próprio repositório.',
      },
      {
        type: 'mc',
        q: 'No Agent SDK em Python, qual objeto marca o fim do laço e traz subtype, total_cost_usd e structured_output?',
        options: ['AssistantMessage', 'TextBlock', 'ResultMessage', 'ClaudeAgentOptions'],
        answer: 2,
        explain: 'ResultMessage é a última mensagem de query(); AssistantMessage traz o conteúdo intermediário e ClaudeAgentOptions é a configuração.',
      },
      {
        type: 'mc',
        q: 'Qual padrão a documentação sugere para que a revisão não carregue o viés de quem escreveu o código?',
        options: ['Pedir ao mesmo agente que se revise duas vezes', 'Escritor/revisor: uma sessão ou subagente com contexto fresco revisa o diff', 'Aumentar o limite de turnos', 'Desligar a compactação'],
        answer: 1,
        explain: 'Um contexto novo avalia o resultado por si, sem o raciocínio que o produziu; a doc cita o padrão Writer/Reviewer e revisores em subagente.',
      },
      {
        type: 'fill',
        q: 'A documentação recomenda adicionar a pasta ___ ao .gitignore para que worktrees criados pelo Claude Code não apareçam como arquivos não rastreados.',
        answer: ['.claude/worktrees/', '.claude/worktrees'],
        explain: 'Os worktrees ficam em .claude/worktrees/<nome>/ dentro do repositório; ignorá-los evita ruído no git status.',
      },
      {
        type: 'mc',
        q: 'Qual variável de ambiente habilita o registro do texto dos prompts nos eventos OpenTelemetry (desligado por padrão)?',
        options: ['OTEL_LOG_USER_PROMPTS', 'CLAUDE_CODE_ENABLE_TELEMETRY', 'OTEL_METRICS_EXPORTER', 'DISABLE_TELEMETRY'],
        answer: 0,
        explain: 'Por padrão o conteúdo é redigido; OTEL_LOG_USER_PROMPTS=1 inclui os prompts, e isso vai apenas para o coletor que você configurou.',
      },
      {
        type: 'tf',
        q: 'Rodar claude -p com --dangerously-skip-permissions diretamente no host de produção é aceitável se o prompt for curto.',
        answer: false,
        explain: 'A documentação exige contêiner, VM ou sandbox runtime para esse modo, que não protege contra injeção de prompt; o tamanho do prompt não muda o risco.',
      },
      {
        type: 'order',
        q: 'Ordene as camadas de uma arquitetura segura para processar documentos de terceiros.',
        items: ['Leitura e classificação sem ferramentas de efeito externo, com esquema JSON', 'Validação dos dados em Python', 'Fila de ações propostas', 'Aprovação humana', 'Execução por script com credenciais próprias'],
        explain: 'O conteúdo não confiável só alcança uma etapa sem poder de ação; o efeito externo vem depois de validação e aprovação.',
      },
      {
        type: 'mc',
        q: 'No robô de triagem, por que o PR é aberto pelo script com gh em vez de pelo próprio Claude?',
        options: ['Porque o Claude não sabe usar o Git', 'Para não dar ao agente que lê conteúdo externo permissão de Git e rede, mantendo o efeito externo sob controle do script e de uma revisão humana', 'Porque gh é mais rápido', 'Porque a action do GitHub exige'],
        answer: 1,
        explain: 'Separar quem lê (sem ferramentas) de quem publica (script com credenciais) é a aplicação direta do princípio de não juntar conteúdo não confiável com efeito externo.',
      },
      {
        type: 'code',
        q: 'Escreva `extrair_sessao(texto)` que recebe a saída de `claude -p --output-format json` e devolve o valor de "session_id", ou None se o texto não for JSON válido, não for um dicionário ou não tiver o campo.',
        starter: `import json

def extrair_sessao(texto):
    # sua implementacao
    pass
`,
        tests: `assert extrair_sessao('{"type":"result","session_id":"abc-123","result":"ok"}') == "abc-123", "Deve devolver o session_id"
assert extrair_sessao('nao e json') is None, "Texto invalido devolve None"
assert extrair_sessao('[1,2,3]') is None, "Lista devolve None"
assert extrair_sessao('{"type":"result"}') is None, "Sem session_id devolve None"
`,
        solution: `import json

def extrair_sessao(texto):
    try:
        dados = json.loads(texto)
    except json.JSONDecodeError:
        return None
    if not isinstance(dados, dict):
        return None
    return dados.get("session_id")
`,
        explain: 'Capturar o session_id da saída JSON é o que permite retomar a execução com --resume para investigar o que o agente fez.',
        hint: 'try/except em volta de json.loads; isinstance(dados, dict); dados.get("session_id").',
      },
    ],
  },
});
