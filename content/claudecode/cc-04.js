registerModule({
  course: 'claudecode',
  id: 'cc-04',
  order: 4,
  level: 'Avançado',
  title: 'Personalizando o Claude Code',
  description: 'Você vai moldar o Claude Code ao seu escritório: arquivos de configuração e precedência, permissões avançadas com regras por ferramenta, memória com CLAUDE.md por pasta e imports, skills com SKILL.md, subagentes, hooks em Python, servidores MCP, estilos de saída, escolha de modelo e plugins. Ao final, monta e testa o kit completo do escritório: permissões seguras, CLAUDE.md, duas skills, um revisor, um hook de formatação e um servidor MCP.',
  hours: 12,
  lessons: [
    {
      id: 'cc-04-01',
      title: 'Configuração: arquivos, chaves e variáveis',
      minutes: 27,
      content: 'content/claudecode/cc-04/01-configuracao.md',
      exercises: [
        { type: 'match', q: 'Relacione cada arquivo de configuração ao seu alcance.', pairs: [['~/.claude/settings.json', 'Você, em todos os projetos da máquina'], ['.claude/settings.json', 'Todos que trabalham no projeto; vai para o Git'], ['.claude/settings.local.json', 'Só você, só neste projeto; fora do Git'], ['Configurações gerenciadas', 'Todos na organização; impostas pelo administrador']], explain: 'Cada nível tem um público; escolher o arquivo certo evita vazar preferência pessoal para o time ou política do time para fora.' },
        { type: 'order', q: 'Ordene os níveis de configuração do MAIOR para o MENOR poder (quem vence quando a mesma chave aparece em vários).', items: ['Configurações gerenciadas (organização)', 'Linha de comando (claude --settings)', '.claude/settings.local.json', '.claude/settings.json', '~/.claude/settings.json'], explain: 'A documentação lista a precedência nessa ordem: gerenciado, linha de comando, local do projeto, projeto compartilhado, usuário.' },
        { type: 'tf', q: 'Quando permissions.allow aparece em dois arquivos, vale só a lista do arquivo de maior precedência.', answer: false, explain: 'Chaves de lista como permissions.allow são combinadas entre os arquivos, não sobrescritas; cada arquivo acrescenta entradas.' },
        { type: 'mc', q: 'O Claude Code avisou que o settings.json é inválido. Qual é a causa mais provável?', options: ['O arquivo está em UTF-8', 'Há um comentário // ou uma vírgula sobrando após o último item', 'A chave $schema não é permitida', 'O arquivo está na pasta errada'], answer: 1, explain: 'Os arquivos são JSON estrito: comentários e vírgulas finais são erro de sintaxe, e o arquivo inteiro é rejeitado.' },
        { type: 'fill', q: 'No Windows, a pasta ~/.claude corresponde a %___%\\.claude.', answer: ['USERPROFILE'], explain: 'A documentação indica que, no Windows, ~/.claude significa %USERPROFILE%\\.claude, normalmente C:\\Users\\SeuNome\\.claude.' },
        { type: 'mc', q: 'Qual comando dentro da sessão mostra quais arquivos de configuração foram carregados, útil quando "a configuração não pegou"?', options: ['/config', '/status', '/permissions', '/memory'], answer: 1, explain: '/status mostra versão, modelo, conta e as fontes de configuração lidas; /config muda opções e /permissions gerencia regras.' },
        { type: 'mc', q: 'Onde é correto definir ANTHROPIC_API_KEY?', options: ['Em .claude/settings.json do projeto, para o time usar a mesma chave', 'Como variável de ambiente da sua máquina ou no env do seu ~/.claude/settings.json, nunca em arquivo que vai para o Git', 'Dentro do CLAUDE.md', 'No .mcp.json'], answer: 1, explain: 'A chave é um segredo pessoal; arquivos de projeto são versionados e compartilhados.' },
        { type: 'tf', q: 'A variável DISABLE_TELEMETRY=0 religa a telemetria.', answer: false, explain: 'Para essa variável, qualquer valor não vazio, inclusive 0 ou false, desliga; para religar é preciso remover a variável.' },
      ],
    },
    {
      id: 'cc-04-02',
      title: 'Permissões avançadas',
      minutes: 30,
      content: 'content/claudecode/cc-04/02-permissoes-avancadas.md',
      exercises: [
        { type: 'mc', q: 'Qual regra libera apenas comandos que começam com "git log", sem liberar outros subcomandos do git?', options: ['Bash(git *)', 'Bash(git log *)', 'Bash(* log)', 'Bash(git)'], answer: 1, explain: 'O curinga deve vir depois do subcomando: Bash(git *) liberaria todo git, inclusive push --force.' },
        { type: 'order', q: 'Coloque na ordem em que o Claude Code avalia as listas de permissão (a primeira que casa decide).', items: ['deny', 'ask', 'allow'], explain: 'A documentação define a ordem deny, depois ask, depois allow; especificidade não altera a ordem.' },
        { type: 'tf', q: 'Com Bash(git *) em deny e Bash(git status) em allow, o comando git status é liberado por ser mais específico.', answer: false, explain: 'Deny é avaliado antes e bloqueia; um allow não abre exceção dentro de um deny.' },
        { type: 'match', q: 'Relacione o modo de permissão ao que roda sem perguntar.', pairs: [['default (Manual)', 'Só leituras'], ['acceptEdits', 'Leituras, edições e comandos comuns de arquivo'], ['plan', 'Leituras e exploração; sem editar até aprovar o plano'], ['bypassPermissions', 'Tudo, sem perguntas; só em ambiente isolado']], explain: 'Cada modo troca supervisão por conveniência; bypass só em contêiner ou VM.' },
        { type: 'fill', q: 'Ao responder "Yes, and don\'t ask again" a um comando, o Claude Code grava uma regra allow no arquivo .claude/settings.___.json na raiz do repositório.', answer: ['local'], explain: 'As aprovações permanentes vão para .claude/settings.local.json, que é seu e não vai para o Git; vale revisá-lo de tempos em tempos.' },
        { type: 'mc', q: 'Por que Bash(rm *) em deny NÃO é uma fronteira de segurança completa?', options: ['Porque deny não funciona para Bash', 'Porque a regra casa com o texto do comando; /bin/rm ou bash -c "rm ..." não casam', 'Porque o Claude ignora deny em modo auto', 'Porque rm não existe no Windows'], answer: 1, explain: 'A documentação alerta que regras cobrem a forma usual do comando; para garantias, use sandbox e hooks PreToolUse.' },
        { type: 'mc', q: 'Você colocou "defaultMode": "bypassPermissions" no .claude/settings.json do projeto e a sessão continua em modo Manual. Por quê?', options: ['Falta reiniciar o computador', 'Os valores auto e bypassPermissions não têm efeito em arquivos de projeto ou locais; só em usuário, gerenciado ou linha de comando', 'O JSON precisa de aspas simples', 'O modo só muda com Shift+Tab'], answer: 1, explain: 'É uma proteção: um repositório clonado não pode colocar sua máquina em modo sem perguntas.' },
        { type: 'code', q: 'Implemente uma versão simplificada do casamento de regras Bash: `regra_casa(regra, comando)` devolve True se a regra casa com o comando. Regras: "Bash" (sem parênteses) casa com qualquer comando; dentro dos parênteses, "*" casa com qualquer texto (inclusive vazio) e o resto é literal, comparado inteiro; quando o padrão termina em " *" (espaço e asterisco) e esse é o único asterisco, a regra também casa com o comando sem o sufixo (Bash(ls *) casa com "ls"); sem asterisco, a comparação é exata.', starter: `import re

def regra_casa(regra, comando):
    pass
`, tests: `assert regra_casa("Bash", "qualquer coisa") is True, "Bash sem parênteses casa com tudo"
assert regra_casa("Bash(npm run build)", "npm run build") is True, "exato casa"
assert regra_casa("Bash(npm run build)", "npm run build --watch") is False, "sem curinga não casa com extra"
assert regra_casa("Bash(git log *)", "git log --oneline main") is True, "curinga final"
assert regra_casa("Bash(git log *)", "git log") is True, "curinga final também casa o comando sozinho"
assert regra_casa("Bash(git log *)", "git push origin main") is False, "subcomando diferente"
assert regra_casa("Bash(ls *)", "lsof") is False, "espaço antes do * faz parte da regra"
assert regra_casa("Bash(ls*)", "lsof") is True, "sem espaço, casa lsof"
assert regra_casa("Bash(* --version)", "node --version") is True, "curinga no início"
assert regra_casa("Bash(git * main)", "git merge main") is True, "curinga no meio"
assert regra_casa("Bash(git * main)", "git log") is False, "falta o final main"
assert regra_casa("Bash(* --help *)", "npm --help x") is True, "dois curingas"
assert regra_casa("Bash(* --help *)", "npm --help") is False, "com dois curingas, não casa sem o sufixo"
`, solution: `import re

def regra_casa(regra, comando):
    if "(" not in regra:
        return True
    padrao = regra[regra.index("(") + 1 : regra.rindex(")")]
    regex = ".*".join(re.escape(parte) for parte in padrao.split("*"))
    if re.fullmatch(regex, comando):
        return True
    if padrao.endswith(" *") and padrao.count("*") == 1:
        return comando == padrao[:-2]
    return False
`, explain: 'A regra vira uma expressão regular em que cada * é ".*" e o resto é literal; o caso especial do " *" final reproduz a regra documentada de que Bash(ls *) também casa com "ls" sozinho.', hint: 'Extraia o texto entre parênteses, divida por "*", escape cada parte com re.escape e junte com ".*"; use re.fullmatch. Trate o caso especial padrao.endswith(" *") com um único asterisco comparando comando == padrao[:-2].' },
      ],
    },
    {
      id: 'cc-04-03',
      title: 'Memória avançada',
      minutes: 27,
      content: 'content/claudecode/cc-04/03-memoria-avancada.md',
      exercises: [
        { type: 'match', q: 'Relacione o arquivo de memória ao seu papel.', pairs: [['~/.claude/CLAUDE.md', 'Suas preferências em todos os projetos'], ['./CLAUDE.md', 'Regras do projeto, compartilhadas via Git'], ['./CLAUDE.local.md', 'Suas preferências só neste projeto; no .gitignore'], ['.claude/rules/*.md', 'Regras por assunto, opcionalmente por caminho']], explain: 'Usuário = seu em todo projeto; projeto = de todos; local = seu neste projeto; rules = divisão por tema.' },
        { type: 'mc', q: 'Você iniciou o Claude Code em automacoes/conciliador/. Quais CLAUDE.md são carregados no início da sessão?', options: ['Só automacoes/conciliador/CLAUDE.md', 'automacoes/CLAUDE.md e automacoes/conciliador/CLAUDE.md (pastas acima e a atual), além do de usuário', 'Todos os CLAUDE.md de todas as subpastas', 'Nenhum até você rodar /memory'], answer: 1, explain: 'Os arquivos da pasta atual e das pastas acima entram no início; os de subpastas são carregados sob demanda, quando o Claude mexe em arquivos delas.' },
        { type: 'fill', q: 'Para citar um caminho no CLAUDE.md sem importá-lo, escreva-o entre ___.', answer: ['crases', 'crase', 'acentos graves', '`'], explain: 'A análise de imports ignora trechos entre crases e blocos de código; @README fora de crases importa o arquivo.' },
        { type: 'tf', q: 'Um arquivo importado com @caminho pode, por sua vez, importar outros arquivos, até o limite de quatro níveis.', answer: true, explain: 'A documentação define profundidade máxima de quatro saltos para imports recursivos.' },
        { type: 'mc', q: 'Uma regra em .claude/rules/leitores.md tem o cabeçalho paths: ["leitores/**/*.py"]. Quando ela entra no contexto?', options: ['Sempre, em toda sessão', 'Só quando o Claude lê, cria ou edita um arquivo que casa com o padrão', 'Só quando você digita /rules', 'Nunca; paths é ignorado'], answer: 1, explain: 'Regras com paths são carregadas sob demanda nos arquivos que casam; sem paths, carregam no início como o .claude/CLAUDE.md.' },
        { type: 'mc', q: 'Qual destas instruções NÃO deve ficar no CLAUDE.md?', options: ['"Rode pytest antes de commitar"', '"Dinheiro em centavos inteiros"', '"Token da API: abc123"', '"Nunca usar dados reais de clientes em testes"'], answer: 2, explain: 'Segredos nunca vão em arquivos de memória: eles entram no contexto do modelo e, no caso do projeto, no Git.' },
        { type: 'tf', q: 'Uma regra escrita no CLAUDE.md ("nunca apague a pasta dados") é garantida pelo Claude Code.', answer: false, explain: 'CLAUDE.md é contexto, não imposição; para garantir, use permissões (deny) ou um hook PreToolUse.' },
        { type: 'write', q: 'Escreva o CLAUDE.md (até 15 linhas) de um repositório com scripts de conferência de folha de pagamento, com comandos, três regras verificáveis e um import.', model: '# Conferência de folha\n\nPython 3.12 no Windows; ambiente em .venv.\n\n## Comandos\n- Testes: `pytest`\n- Qualidade: `ruff check .` e `black .`\n\n## Regras\n- Valores em centavos inteiros; competência como "AAAA-MM".\n- Regra de cálculo em funções puras; Excel só na leitura e na gravação.\n- Nunca usar dados reais de funcionários; exemplos fictícios em `exemplos/`.\n\nTabela de rubricas usada: @docs/rubricas.md', checklist: ['Tem comandos de teste e qualidade?', 'As regras são verificáveis (não "formate bem")?', 'Há um import @caminho fora de crases?', 'Não há segredos nem dados reais?'] },
      ],
    },
    {
      id: 'cc-04-04',
      title: 'Skills e comandos personalizados',
      minutes: 24,
      content: 'content/claudecode/cc-04/04-skills-e-comandos.md',
      exercises: [
        { type: 'fill', q: 'Uma skill de projeto fica em .claude/skills/<nome>/___.', answer: ['SKILL.md', 'skill.md'], explain: 'O arquivo obrigatório é SKILL.md, com cabeçalho YAML e instruções; arquivos de apoio ficam na mesma pasta.' },
        { type: 'mc', q: 'Qual campo do cabeçalho impede que o Claude carregue a skill por conta própria, deixando-a apenas para invocação sua com /nome?', options: ['user-invocable: false', 'disable-model-invocation: true', 'context: fork', 'allowed-tools: none'], answer: 1, explain: 'disable-model-invocation: true é a escolha certa para procedimentos com efeitos; user-invocable: false faz o contrário (esconde do menu e deixa só para o Claude).' },
        { type: 'match', q: 'Relacione a substituição ao seu valor.', pairs: [['$ARGUMENTS', 'Texto completo digitado após /nome'], ['$0', 'Primeiro argumento'], ['${CLAUDE_SKILL_DIR}', 'Pasta da própria skill'], ['${CLAUDE_PROJECT_DIR}', 'Raiz do projeto']], explain: 'As substituições permitem skills parametrizadas e scripts de apoio localizados pela pasta da skill.' },
        { type: 'tf', q: 'Uma linha com !`git status --short` no corpo da skill é executada antes de o Claude ler a skill e substituída pela saída do comando.', answer: true, explain: 'É o contexto dinâmico documentado; o exemplo oficial usa !`git diff HEAD`.' },
        { type: 'mc', q: 'Existe .claude/commands/deploy.md e .claude/skills/deploy/SKILL.md no mesmo projeto. O que acontece com /deploy?', options: ['Erro de conflito', 'A skill tem precedência sobre o arquivo de comando', 'O comando tem precedência', 'Os dois rodam em sequência'], answer: 1, explain: 'Comandos foram incorporados às skills; os dois criam /deploy e, quando ambos existem, a skill vence.' },
        { type: 'mc', q: 'Em que situação uma skill é melhor do que uma instrução no CLAUDE.md?', options: ['Quando a regra vale sempre e cabe em uma linha', 'Quando é um procedimento de várias etapas usado só em certas tarefas', 'Quando a ação não pode falhar nunca', 'Quando se trata de um segredo'], answer: 1, explain: 'Skills carregam só quando usadas; regras permanentes vão no CLAUDE.md e garantias em hooks.' },
        { type: 'order', q: 'Coloque na ordem os passos para criar e testar a skill fechar-mes em um projeto que ainda não tinha a pasta .claude/skills/.', items: ['Criar a pasta .claude/skills/fechar-mes/', 'Escrever SKILL.md com cabeçalho (name, description, argument-hint) e roteiro', 'Rodar /reload-skills na sessão', 'Conferir em /skills que ela aparece', 'Invocar /fechar-mes padaria 2026-10 e verificar o comportamento'], explain: 'A skill precisa existir no disco; como a pasta de skills foi criada durante a sessão, é preciso /reload-skills para ela ser lida; só então ela aparece na lista e pode ser invocada com argumentos.' },
      ],
    },
    {
      id: 'cc-04-05',
      title: 'Subagentes',
      minutes: 24,
      content: 'content/claudecode/cc-04/05-subagentes.md',
      exercises: [
        { type: 'fill', q: 'Subagentes do projeto ficam em arquivos Markdown na pasta .claude/___/.', answer: ['agents'], explain: 'A pasta .claude/agents/ vai para o Git; ~/.claude/agents/ vale em todos os seus projetos.' },
        { type: 'mc', q: 'Quais campos do cabeçalho de um subagente são obrigatórios?', options: ['name e tools', 'name e description', 'description e model', 'name, description e model'], answer: 1, explain: 'Só name e description são obrigatórios; os demais (tools, model, permissionMode, maxTurns...) são opcionais e campos desconhecidos são ignorados.' },
        { type: 'mc', q: 'Por que o subagente "revisor" recebe tools: Read, Glob, Grep, Bash e não Edit nem Write?', options: ['Porque subagentes não podem editar arquivos', 'Para que ele revise sem poder "corrigir" por conta própria; a decisão fica com você', 'Porque Edit é mais caro', 'Porque Read já inclui Edit'], answer: 1, explain: 'Um revisor que edita deixa de ser revisor; limitar ferramentas é a forma de garantir o papel.' },
        { type: 'tf', q: 'Para que o Claude delegue a um subagente sem ser mandado, ajuda escrever na description quando usá-lo, com frases como "use proativamente".', answer: true, explain: 'O Claude compara a tarefa com a description; a documentação recomenda explicitamente esse tipo de frase.' },
        { type: 'match', q: 'Relacione o campo do cabeçalho ao seu efeito.', pairs: [['model: inherit', 'Usa o mesmo modelo da conversa principal'], ['maxTurns: 25', 'Para após 25 turnos e devolve resultado parcial'], ['isolation: worktree', 'Roda em uma cópia temporária do repositório'], ['background: true', 'Mantém o subagente em segundo plano']], explain: 'Esses campos controlam custo, isolamento e paralelismo do subagente.' },
        { type: 'mc', q: 'Qual subagente embutido é usado para busca rápida no código, somente leitura?', options: ['general-purpose', 'Explore', 'Plan', 'statusline-setup'], answer: 1, explain: 'Explore faz busca e análise rápidas sem Write/Edit; Plan atua no modo de planejamento; general-purpose tem todas as ferramentas.' },
        { type: 'mc', q: 'Quando NÃO vale a pena delegar a um subagente?', options: ['Quando a tarefa gera páginas de saída que poluiriam o contexto', 'Quando a decisão depende de toda a conversa anterior, que o subagente não vê', 'Quando você quer uma revisão independente', 'Quando o roteiro é o mesmo em todo projeto'], answer: 1, explain: 'O subagente roda em contexto separado; o que depende da conversa inteira fica na conversa principal.' },
      ],
    },
    {
      id: 'cc-04-06',
      title: 'Hooks',
      minutes: 28,
      content: 'content/claudecode/cc-04/06-hooks.md',
      exercises: [
        { type: 'mc', q: 'Qual é a diferença essencial entre um hook e uma instrução no CLAUDE.md?', options: ['O hook é mais barato', 'O hook é executado pelo próprio Claude Code no evento, sempre; a instrução depende de o modelo segui-la', 'O hook só funciona no VS Code', 'Não há diferença'], answer: 1, explain: 'Hooks garantem; instruções sugerem. Por isso formatação obrigatória e bloqueios vão em hooks.' },
        { type: 'match', q: 'Relacione o evento ao momento em que dispara.', pairs: [['PreToolUse', 'Antes de uma ferramenta rodar; pode bloquear'], ['PostToolUse', 'Depois de uma ferramenta rodar com sucesso'], ['UserPromptSubmit', 'Quando você envia um prompt'], ['Notification', 'Quando o Claude precisa da sua atenção']], explain: 'Escolher o evento certo é o primeiro passo: formatar é PostToolUse, bloquear é PreToolUse.' },
        { type: 'fill', q: 'Para que um hook rode só após as ferramentas Edit e Write, o matcher é "Edit___Write".', answer: ['|'], explain: 'Alternativas no matcher são separadas por |; vazio ou * casa com todas as ferramentas.' },
        { type: 'mc', q: 'Um hook PreToolUse termina com código de saída 2 e escreve uma mensagem no stderr. O que acontece?', options: ['A ferramenta roda e a mensagem é ignorada', 'A ação é bloqueada e a mensagem vira a justificativa que o Claude recebe', 'A sessão é encerrada', 'A ferramenta roda e a mensagem vai para o usuário'], answer: 1, explain: 'Código 2 bloqueia em eventos bloqueáveis; o stderr é a razão. Código 0 não aprova nada: o fluxo normal de permissões continua.' },
        { type: 'tf', q: 'Um hook PostToolUse pode impedir que a edição aconteça, bastando sair com código 2.', answer: false, explain: 'Em PostToolUse a ferramenta já rodou; o evento não é bloqueável. Para impedir, use PreToolUse.' },
        { type: 'mc', q: 'No Windows, por que a forma exec ("command": "python", "args": ["${CLAUDE_PROJECT_DIR}/.claude/hooks/formatar.py"]) é preferível à forma shell?', options: ['Porque a forma shell não aceita Python', 'Porque a forma shell depende do Git Bash (sem ele, o comando cai no PowerShell e pode falhar, bloqueando a ferramenta); a forma exec chama o programa diretamente, sem shell', 'Porque args permite mais de um script', 'Porque exec é mais rápido'], answer: 1, explain: 'A documentação registra o erro "blocking because Git Bash wasn\'t found" em hooks na forma shell sem Git Bash; a forma exec inicia o programa sem shell nenhum.' },
        { type: 'code', q: 'Escreva `decidir(evento)` para a lógica de um hook PreToolUse. `evento` é o dicionário já lido do JSON de entrada. Devolva uma tupla (codigo_saida, mensagem): (2, "Bloqueado: <motivo>") se tool_name for "Bash" ou "PowerShell" e tool_input.command contiver (ignorando maiúsculas) "rm -rf", "git push --force", "git reset --hard" ou "Remove-Item" junto com "-Recurse"; caso contrário (outra ferramenta, comando seguro ou campos ausentes), devolva (0, "").', starter: `import re

def decidir(evento):
    pass
`, tests: `def ev(cmd, tool="Bash"):
    return {"hook_event_name": "PreToolUse", "tool_name": tool, "tool_input": {"command": cmd}}
assert decidir(ev("pytest -q")) == (0, ""), "comando seguro: (0, '')"
assert decidir(ev("rm -rf build/"))[0] == 2, "rm -rf deve bloquear"
assert decidir(ev("rm -rf build/"))[1].startswith("Bloqueado"), "mensagem deve começar com Bloqueado"
assert decidir(ev("git push --force origin main"))[0] == 2, "push --force bloqueia"
assert decidir(ev("GIT RESET --HARD"))[0] == 2, "ignorar maiúsculas"
assert decidir(ev("Remove-Item C:/dados -Recurse -Force"))[0] == 2, "Remove-Item com -Recurse bloqueia"
assert decidir(ev("Remove-Item C:/dados -Recurse", tool="PowerShell"))[0] == 2, "a ferramenta PowerShell também é avaliada"
assert decidir(ev("Remove-Item C:/dados/teste.txt")) == (0, ""), "Remove-Item sem -Recurse não bloqueia"
assert decidir(ev("rm -rf /tmp/x", tool="Edit")) == (0, ""), "outra ferramenta não é avaliada"
assert decidir({"hook_event_name": "PreToolUse", "tool_name": "Bash"}) == (0, ""), "sem tool_input não quebra"
assert decidir({}) == (0, ""), "evento vazio devolve (0, '')"
`, solution: `import re

PERIGOSOS = [r"rm -rf", r"git push --force", r"git reset --hard"]

def decidir(evento):
    if evento.get("tool_name") not in ("Bash", "PowerShell"):
        return (0, "")
    comando = (evento.get("tool_input") or {}).get("command", "") or ""
    baixo = comando.lower()
    for p in PERIGOSOS:
        if p in baixo:
            return (2, "Bloqueado: comando perigoso (" + p + ")")
    if "remove-item" in baixo and "-recurse" in baixo:
        return (2, "Bloqueado: comando perigoso (Remove-Item -Recurse)")
    return (0, "")
`, explain: 'A lógica reproduz o contrato do hook: só avalia as ferramentas de shell (Bash e PowerShell), lê tool_input.command com segurança, compara em minúsculas e devolve 2 com motivo para bloquear ou 0 para seguir o fluxo normal.', hint: 'Use evento.get("tool_name") not in ("Bash", "PowerShell") e (evento.get("tool_input") or {}).get("command", ""). Compare em minúsculas com "in"; para o Remove-Item, exija as duas substrings "remove-item" e "-recurse".' },
      ],
    },
    {
      id: 'cc-04-07',
      title: 'MCP (Model Context Protocol)',
      minutes: 27,
      content: 'content/claudecode/cc-04/07-mcp.md',
      exercises: [
        { type: 'mc', q: 'O que é um servidor MCP?', options: ['Um modelo de linguagem alternativo', 'Um programa, local ou hospedado, que expõe ferramentas, recursos e prompts que o Claude Code pode usar', 'Um arquivo de configuração do Claude Code', 'Um plugin do VS Code'], answer: 1, explain: 'MCP é o padrão aberto; o servidor oferece capacidades e o Claude Code, como cliente, as descobre e usa.' },
        { type: 'fill', q: 'Ao adicionar um servidor local, o separador ___ indica que tudo depois dele é o comando do servidor, não opções do claude.', answer: ['--'], explain: 'Sem o --, opções do servidor como --port seriam interpretadas pelo claude mcp add.' },
        { type: 'match', q: 'Relacione o escopo ao local onde o servidor é gravado.', pairs: [['local (padrão)', '~/.claude.json, na entrada deste projeto'], ['project', '.mcp.json na raiz do projeto'], ['user', '~/.claude.json, para todos os seus projetos']], explain: 'Só o escopo project gera um arquivo versionável e compartilhado com quem clona o repositório.' },
        { type: 'tf', q: 'O comando claude mcp add deve ser executado dentro de uma sessão do Claude Code, após o prompt.', answer: false, explain: 'Ele roda no terminal (PowerShell, por exemplo), fora da sessão; dentro da sessão usa-se /mcp para gerenciar e autenticar.' },
        { type: 'mc', q: 'No .mcp.json, qual forma evita gravar um caminho pessoal e ainda funciona em máquinas sem a variável definida?', options: ['"C:/Users/ana/exemplos"', '"${PASTA_EXEMPLOS:-C:/automacoes/exemplos}"', '"$PASTA_EXEMPLOS"', '"%PASTA_EXEMPLOS%"'], answer: 1, explain: 'A sintaxe ${VAR:-padrao} usa a variável se existir e o padrão caso contrário; é a forma documentada de expansão no .mcp.json.' },
        { type: 'mc', q: 'Qual regra de permissão libera todas as ferramentas do servidor chamado "arquivos"?', options: ['mcp__arquivos__*', 'mcp(arquivos)', 'Bash(arquivos *)', 'MCP:arquivos'], answer: 0, explain: 'Ferramentas MCP têm o nome mcp__servidor__ferramenta; o curinga após o prefixo do servidor cobre todas as ferramentas daquele servidor.' },
        { type: 'order', q: 'Coloque na ordem os passos para usar um servidor de sistema de arquivos no projeto.', items: ['claude mcp add --scope project arquivos -- npx -y @modelcontextprotocol/server-filesystem <pasta>', 'claude mcp list para conferir o estado', 'Abrir a sessão e aprovar o servidor de projeto quando perguntado', '/mcp para ver as ferramentas e pedir uma tarefa ao Claude', 'Trocar o caminho absoluto no .mcp.json por ${VAR:-padrao} antes de commitar'], explain: 'Adicionar, conferir, aprovar, usar e só então versionar sem caminho pessoal.' },
        { type: 'mc', q: 'Por que servidores MCP que buscam conteúdo externo exigem mais cuidado?', options: ['Porque consomem mais tokens', 'Porque expõem a injeção de prompt: conteúdo externo com instruções escondidas que o modelo pode seguir', 'Porque não funcionam no Windows', 'Porque exigem Node.js'], answer: 1, explain: 'A documentação alerta: verifique se confia em cada servidor; conteúdo externo pode conter instruções maliciosas.' },
      ],
    },
    {
      id: 'cc-04-08',
      title: 'Estilos de saída, modelos e plugins',
      minutes: 25,
      content: 'content/claudecode/cc-04/08-estilos-modelos-plugins.md',
      exercises: [
        { type: 'match', q: 'Relacione o estilo de saída ao seu efeito.', pairs: [['Concise', 'Respostas começam pelo resultado, sem preâmbulo'], ['Explanatory', 'Acrescenta blocos Insight explicando as escolhas'], ['Learning', 'Deixa trechos TODO(human) para você escrever'], ['Proactive', 'Começa a trabalhar e assume decisões de rotina']], explain: 'Os quatro estilos embutidos mantêm as instruções padrão e acrescentam um comportamento cada.' },
        { type: 'mc', q: 'Você escreveu "outputStyle": "explanatory" no settings e nada mudou. Por quê?', options: ['Estilos só funcionam no desktop', 'O valor diferencia maiúsculas: deve ser "Explanatory"; em minúsculas cai no estilo padrão', 'Falta reiniciar o Windows', 'A chave correta é "style"'], answer: 1, explain: 'A documentação alerta que o valor é sensível a maiúsculas na chave; o comando /output-style, por outro lado, ignora maiúsculas.' },
        { type: 'fill', q: 'O apelido de modelo ___ usa opus no modo de planejamento e sonnet na execução.', answer: ['opusplan'], explain: 'opusplan é o modo especial documentado para planejar com o modelo mais capaz e executar com o intermediário.' },
        { type: 'mc', q: 'Qual combinação faz mais sentido para renomear variáveis e escrever docstrings em um script pequeno?', options: ['opus com esforço max', 'haiku (ou sonnet) com esforço baixo', 'opusplan com esforço xhigh', 'sonnet[1m] com esforço max'], answer: 1, explain: 'Tarefas mecânicas não exigem o modelo mais caro nem raciocínio profundo; o critério é custo e velocidade.' },
        { type: 'tf', q: 'Trocar de modelo com /model vale apenas para a sessão atual.', answer: false, explain: '/model troca e salva como padrão para novas sessões; no seletor, a tecla s troca só para a sessão.' },
        { type: 'mc', q: 'O que é um marketplace de plugins?', options: ['Uma loja paga da Anthropic', 'Um catálogo (repositório ou pasta com .claude-plugin/marketplace.json) que lista plugins e onde buscá-los', 'Um servidor MCP', 'A aba Installed do /plugin'], answer: 1, explain: 'O marketplace é um catálogo; o oficial (claude-plugins-official) é adicionado na primeira sessão interativa no terminal.' },
        { type: 'mc', q: 'Por que não deixar ligados plugins que você não usa?', options: ['Porque eles expiram', 'Porque as descrições de seus skills e agentes entram no contexto de toda sessão e o que eles rodam, roda como você', 'Porque o /plugin trava com mais de três', 'Porque só um plugin pode estar ativo'], answer: 1, explain: 'Plugins ligados custam contexto e podem executar hooks e servidores; a documentação recomenda revisar e desligar os sem uso.' },
      ],
    },
    {
      id: 'cc-04-09',
      title: 'Projeto guiado: kit do escritório',
      minutes: 26,
      content: 'content/claudecode/cc-04/09-projeto-kit-do-escritorio.md',
      exercises: [
        { type: 'order', q: 'Coloque as peças do kit na ordem de montagem proposta.', items: ['Pasta, Git e ambiente virtual', 'Permissões seguras no .claude/settings.json', 'CLAUDE.md', 'Duas skills', 'Subagente revisor', 'Hook de formatação', 'Servidor MCP'], explain: 'Cada peça é montada e testada antes da próxima; permissões vêm antes porque limitam o que as peças seguintes podem fazer.' },
        { type: 'mc', q: 'As regras allow do .claude/settings.json do projeto parecem não funcionar na primeira sessão. O que falta?', options: ['Reiniciar o Windows', 'Aceitar o diálogo de confiança da pasta; allow do projeto só vale depois dele (deny e ask valem de imediato)', 'Adicionar as regras também no CLAUDE.md', 'Usar aspas simples no JSON'], answer: 1, explain: 'É a proteção contra repositórios clonados que liberariam ações na sua máquina sem consentimento.' },
        { type: 'match', q: 'Relacione a peça ao teste que confirma que ela funciona.', pairs: [['Permissões', '/permissions mostra as regras com origem no projeto e "leia o .env" é recusado'], ['CLAUDE.md', '/context lista o arquivo entre os de memória'], ['Hook de formatação', 'Arquivo criado com x=1 aparece como x = 1'], ['Servidor MCP', 'claude mcp list mostra conectado e /mcp lista as ferramentas']], explain: 'Configuração sem teste é configuração que você acha que tem; cada peça tem uma verificação objetiva.' },
        { type: 'tf', q: 'O .claude/settings.local.json deve ser commitado para que os colegas recebam as mesmas aprovações.', answer: false, explain: 'O arquivo local é pessoal (aprovações suas); vai no .gitignore. O que vale para todos fica no .claude/settings.json.' },
        { type: 'fill', q: 'No .mcp.json commitado, o caminho da pasta deve usar a forma ${PASTA_EXEMPLOS:-___} para ter um valor padrão sem caminho pessoal.', answer: ['C:/automacoes/exemplos', 'C:\\automacoes\\exemplos', 'padrao', 'padrão', 'valor padrão', 'um caminho padrão'], explain: 'A expansão ${VAR:-padrao} permite que cada máquina defina a variável e que o repositório traga um padrão neutro.' },
        { type: 'mc', q: 'Na rubrica, qual item leva nota 2 em "Subagente"?', options: ['Qualquer agente com Edit e Write', 'Revisor só leitura, descrição com "use proativamente", testado com git diff inalterado', 'Agente com model: opus', 'Agente sem description'], answer: 1, explain: 'O revisor deve revisar sem editar, ser acionado pela descrição e ter sido testado de fato.' },
        { type: 'code', q: 'Escreva `auditar_settings(texto)` que recebe o conteúdo de um settings.json (string) e devolve a lista de problemas encontrados, nesta ordem e com estas mensagens exatas quando aplicável: "JSON inválido" (e nada mais, se o texto não for JSON válido ou não for um objeto JSON); "allow libera Bash inteiro" se "Bash" ou "Bash(*)" estiver em permissions.allow; "falta negar leitura do .env" se nenhuma regra de permissions.deny começar com "Read(" e contiver ".env"; "falta negar rm -rf" se nenhuma regra de deny contiver "rm -rf"; "bypass não desativado" se permissions.disableBypassPermissionsMode não for "disable". Chaves ausentes contam como listas vazias.', starter: `import json

def auditar_settings(texto):
    pass
`, tests: `bom = '{"permissions": {"allow": ["Bash(pytest *)"], "deny": ["Bash(rm -rf *)", "Read(./.env)"], "disableBypassPermissionsMode": "disable"}}'
assert auditar_settings(bom) == [], "configuração correta não tem problemas"
assert auditar_settings("{ isso não é json") == ["JSON inválido"], "JSON inválido devolve só essa mensagem"
assert auditar_settings("[]") == ["JSON inválido"], "JSON que não é um objeto também conta como inválido"
ruim = '{"permissions": {"allow": ["Bash"], "deny": []}}'
assert auditar_settings(ruim) == ["allow libera Bash inteiro", "falta negar leitura do .env", "falta negar rm -rf", "bypass não desativado"], "todos os problemas na ordem"
assert auditar_settings("{}") == ["falta negar leitura do .env", "falta negar rm -rf", "bypass não desativado"], "sem permissions: listas vazias"
parcial = '{"permissions": {"allow": ["Bash(*)"], "deny": ["Read(./segredos/.env.local)", "Bash(rm -rf *)"], "disableBypassPermissionsMode": "disable"}}'
assert auditar_settings(parcial) == ["allow libera Bash inteiro"], "Bash(*) também libera tudo; .env em subpasta conta"
`, solution: `import json

def auditar_settings(texto):
    try:
        dados = json.loads(texto)
    except (ValueError, TypeError):
        return ["JSON inválido"]
    if not isinstance(dados, dict):
        return ["JSON inválido"]
    perm = dados.get("permissions", {}) or {}
    allow = perm.get("allow", []) or []
    deny = perm.get("deny", []) or []
    problemas = []
    if "Bash" in allow or "Bash(*)" in allow:
        problemas.append("allow libera Bash inteiro")
    if not any(r.startswith("Read(") and ".env" in r for r in deny):
        problemas.append("falta negar leitura do .env")
    if not any("rm -rf" in r for r in deny):
        problemas.append("falta negar rm -rf")
    if perm.get("disableBypassPermissionsMode") != "disable":
        problemas.append("bypass não desativado")
    return problemas
`, explain: 'A auditoria aplica as boas práticas da lição 2 como verificações objetivas: nada de Bash total em allow, segredos e destruição negados e bypass desligado.', hint: 'Use json.loads dentro de try/except ValueError e confira com isinstance(dados, dict) se o resultado é um objeto. Pegue permissions com .get e listas com .get(..., []). Use any(...) para procurar regras em deny.' },
      ],
    },
  ],
  exam: {
    passScore: 70,
    questions: [
      { type: 'mc', q: 'Qual arquivo contém as configurações compartilhadas com o time via Git?', options: ['~/.claude/settings.json', '.claude/settings.json', '.claude/settings.local.json', '~/.claude.json'], answer: 1, explain: 'O .claude/settings.json do projeto é commitado; o local é pessoal e o de usuário vale em todos os projetos.' },
      { type: 'tf', q: 'Na precedência de configurações, o arquivo .claude/settings.local.json vence o .claude/settings.json para a mesma chave.', answer: true, explain: 'A ordem é gerenciado > linha de comando > local > projeto > usuário.' },
      { type: 'mc', q: 'Qual regra está escrita corretamente para liberar apenas comandos pytest?', options: ['Bash(pytest)', 'Bash(pytest *)', 'Bash(*pytest)', 'pytest(Bash)'], answer: 1, explain: 'Bash(pytest *) casa com pytest e qualquer argumento; Bash(pytest) só casa o comando exato sem argumentos.' },
      { type: 'mc', q: 'Um deny no arquivo de usuário e um allow no arquivo de projeto casam com o mesmo comando. Resultado?', options: ['Allow vence porque o projeto tem precedência', 'Deny vence: regras de negar de qualquer nível são avaliadas antes', 'Pergunta ao usuário', 'Erro de configuração'], answer: 1, explain: 'A ordem deny, ask, allow vale entre arquivos; nenhum nível pode liberar o que outro negou.' },
      { type: 'fill', q: 'O modo que pula todas as perguntas de permissão, recomendado apenas em contêineres ou VMs, chama-se ___.', answer: ['bypassPermissions', 'bypass permissions', 'bypass'], explain: 'bypassPermissions (ativado por --dangerously-skip-permissions) só deve ser usado em ambiente isolado; pode ser desligado com disableBypassPermissionsMode.' },
      { type: 'mc', q: 'O que faz @docs/plano-de-contas.md escrito fora de crases em um CLAUDE.md?', options: ['Cria um link clicável', 'Importa o arquivo para o contexto no início da sessão', 'Nada; é só texto', 'Executa o arquivo'], answer: 1, explain: 'A sintaxe @caminho importa; entre crases vira texto literal.' },
      { type: 'match', q: 'Relacione o mecanismo ao seu uso correto.', pairs: [['CLAUDE.md', 'Fatos e regras que valem sempre'], ['Skill', 'Procedimento de várias etapas, carregado quando usado'], ['Hook', 'Algo que precisa acontecer sempre, sem depender do modelo'], ['Subagente', 'Tarefa delegada com ferramentas e contexto próprios']], explain: 'Cada mecanismo cobre uma necessidade; confundi-los gera instruções ignoradas ou contexto inflado.' },
      { type: 'mc', q: 'Qual é o caminho de uma skill pessoal chamada fechar-mes?', options: ['~/.claude/skills/fechar-mes/SKILL.md', '~/.claude/fechar-mes.md', '.claude/commands/fechar-mes/SKILL.md', '~/.claude/agents/fechar-mes.md'], answer: 0, explain: 'Skills pessoais ficam em ~/.claude/skills/<nome>/SKILL.md; as de projeto em .claude/skills/.' },
      { type: 'tf', q: 'Em um subagente, o campo tools define as ferramentas permitidas e, se omitido, o agente herda todas as disponíveis a subagentes.', answer: true, explain: 'É o comportamento documentado; para restringir um revisor, liste só Read, Glob, Grep e Bash.' },
      { type: 'mc', q: 'Qual evento de hook permite bloquear um comando antes de ele rodar?', options: ['PostToolUse', 'PreToolUse', 'SessionStart', 'Notification'], answer: 1, explain: 'PreToolUse dispara antes da ferramenta e aceita código 2 ou permissionDecision deny; PostToolUse não bloqueia.' },
      { type: 'mc', q: 'Em um hook de comando, o que significa sair com código 0 em PreToolUse?', options: ['A ferramenta é aprovada automaticamente', 'Sem objeção do hook; o fluxo normal de permissões continua', 'A ferramenta é bloqueada', 'A sessão reinicia'], answer: 1, explain: 'Só o JSON com permissionDecision allow pula a pergunta; código 0 sozinho não aprova nada.' },
      { type: 'fill', q: 'O escopo que grava o servidor MCP em um arquivo .mcp.json versionável chama-se ___.', answer: ['project'], explain: 'Local e user ficam em ~/.claude.json; project vai para .mcp.json na raiz e pede aprovação de cada pessoa.' },
      { type: 'mc', q: 'Qual estilo de saída deixa trechos TODO(human) para você escrever?', options: ['Concise', 'Explanatory', 'Learning', 'Proactive'], answer: 2, explain: 'Learning acrescenta os Insight do Explanatory e pede que você escreva as partes com decisão de projeto.' },
      { type: 'code', q: 'Escreva `extrair_comando(texto_json)` que recebe o JSON de entrada de um hook (string) e devolve o valor de tool_input.command. Devolva "" se o JSON for inválido, se não houver tool_input ou se não houver command.', starter: `import json

def extrair_comando(texto_json):
    pass
`, tests: `assert extrair_comando('{"tool_name": "Bash", "tool_input": {"command": "npm test"}}') == "npm test", "deve extrair o comando"
assert extrair_comando('{"tool_name": "Edit", "tool_input": {"file_path": "/a.py"}}') == "", "sem command devolve vazio"
assert extrair_comando('{"tool_name": "Bash"}') == "", "sem tool_input devolve vazio"
assert extrair_comando("isso não é json") == "", "JSON inválido devolve vazio"
`, solution: `import json

def extrair_comando(texto_json):
    try:
        dados = json.loads(texto_json)
    except (ValueError, TypeError):
        return ""
    entrada = dados.get("tool_input") or {}
    return entrada.get("command", "") or ""
`, explain: 'Hooks recebem JSON no stdin; a extração defensiva do comando é o primeiro passo de qualquer hook PreToolUse em Bash.', hint: 'json.loads dentro de try/except; depois .get("tool_input") e .get("command", "").' },
      { type: 'mc', q: 'Um colega clonou o kit do escritório (settings.json com allow/deny, CLAUDE.md, skills, hook e .mcp.json) e abriu o Claude Code na pasta. O que ele precisa fazer para que as regras allow do projeto e o servidor MCP de projeto passem a valer na máquina dele?', options: ['Nada; tudo vale assim que o repositório é clonado', 'Aceitar o diálogo de confiança da pasta e aprovar o servidor do .mcp.json quando o Claude Code perguntar', 'Copiar o settings.json para ~/.claude/settings.json', 'Rodar /reload-skills e /reload-plugins'], answer: 1, explain: 'É a proteção contra repositórios clonados: regras allow e servidores de projeto só entram depois do consentimento de cada pessoa; deny e ask valem de imediato, e CLAUDE.md, skills e hooks são lidos do próprio repositório.' },
    ],
  },
});
