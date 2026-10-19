registerModule({
  course: 'claudecode',
  id: 'cc-02',
  order: 2,
  level: 'Básico',
  title: 'O dia a dia com o Claude Code',
  description: 'Você vai usar o Claude Code nas tarefas de todo dia: explorar um projeto desconhecido, editar com segurança, rodar testes e comandos, trabalhar com Git e pull requests, criar o CLAUDE.md, planejar tarefas grandes, dominar a interface e conhecer o VS Code, o app desktop e a web. Ao final, terá evoluído o organizador de notas com testes, branch, commits e PR.',
  hours: 6,
  lessons: [
    {
      id: 'cc-02-01',
      title: 'Explorar um projeto desconhecido',
      minutes: 23,
      content: 'content/claudecode/cc-02/01-explorar-um-projeto-desconhecido.md',
      exercises: [
        { type: 'order', q: 'Ordene a sequência recomendada para entender um projeto herdado.', items: ['Visão geral do projeto', 'Glossário dos termos específicos', 'Localizar o arquivo que faz a tarefa principal', 'Explicar o arquivo função por função', 'Rodar o script com ! e ver a saída real', 'Perguntar quais riscos ele vê'], explain: 'A documentação recomenda começar largo e afunilar; a execução e a avaliação de riscos vêm depois de entender a estrutura.' },
        { type: 'mc', q: 'O que acontece ao escrever @src/fiscal/ (uma pasta) na mensagem?', options: ['O conteúdo de todos os arquivos entra na conversa', 'Apenas a listagem de arquivos da pasta entra na conversa', 'A pasta é apagada', 'Nada; @ só funciona com arquivos'], answer: 1, explain: 'A documentação diz que referências a diretórios mostram listagens, não conteúdos; para o conteúdo, cite os arquivos.' },
        { type: 'fill', q: 'Para rodar um comando você mesmo e colocar a saída na conversa, comece a mensagem com o caractere ___.', answer: ['!'], explain: 'O prefixo ! aciona o modo shell: o comando roda, a saída entra na sessão e o Claude responde a ela.' },
        { type: 'tf', q: 'Ao digitar @, o Claude Code abre um menu de sugestão de caminhos, e Tab ou Enter aceitam o caminho destacado.', answer: true, explain: 'É o comportamento documentado da menção de arquivos; Enter de novo envia a mensagem.' },
        { type: 'mc', q: 'Seu script quebrou com um ValueError. Qual é a melhor forma de pedir ajuda?', options: ['"deu erro, conserta"', 'Colar o traceback completo, informar o comando que o gerou e pedir a causa raiz antes da correção', 'Descrever o erro de memória sem o traceback', 'Pedir para reescrever o script do zero'], answer: 1, explain: 'A documentação orienta a colar o traceback e o comando de reprodução; pedir a causa antes evita correções de sintoma.' },
        { type: 'match', q: 'Relacione a pergunta ao objetivo.', pairs: [['"me dê uma visão geral deste projeto"', 'Mapa do código'], ['"o que são lote, competência e remessa neste código?"', 'Glossário'], ['"onde o script decide a pasta do relatório?"', 'Localizar comportamento'], ['"explique conciliacao.py função por função"', 'Explicar um arquivo']], explain: 'Cada tipo de pergunta cobre uma etapa da exploração.' },
        { type: 'tf', q: 'Um arquivo de texto maior que 256 KB é incluído normalmente quando referenciado com @.', answer: false, explain: 'A documentação diz que arquivos de texto maiores que 256 KB não são incluídos pela menção com @.' },
      ],
    },
    {
      id: 'cc-02-02',
      title: 'Editar com segurança',
      minutes: 24,
      content: 'content/claudecode/cc-02/02-editar-com-seguranca.md',
      exercises: [
        { type: 'order', q: 'Ordene o roteiro de leitura de um diff.', items: ['Conferir se é o arquivo certo', 'Procurar linhas alteradas fora do trecho pedido', 'Entender cada linha nova', 'Verificar se algo importante foi removido', 'Confirmar que há uma forma de verificar (teste)'], explain: 'O roteiro vai do mais básico (arquivo) ao mais exigente (verificação).' },
        { type: 'mc', q: 'Por que acrescentar "não altere mais nada" ao pedido?', options: ['Para o agente trabalhar mais rápido', 'Para evitar mudanças "de brinde" que inflam o diff', 'Porque é obrigatório na sintaxe', 'Para desligar as permissões'], answer: 1, explain: 'Sem a restrição, o agente pode reformatar e renomear coisas, e um diff de 3 linhas vira 40.' },
        { type: 'fill', q: 'Com Yes ou No selecionado num pedido de permissão, a tecla ___ abre um campo de comentário para explicar sua resposta.', answer: ['Tab'], explain: 'A documentação do modo interativo descreve o Tab como a tecla que abre o comentário na resposta à permissão.' },
        { type: 'tf', q: 'A documentação recomenda, para bugs, escrever primeiro um teste que falhe reproduzindo o problema e só depois corrigir.', answer: true, explain: 'É o padrão de "teste vermelho antes": garante que a correção resolve o problema real.' },
        { type: 'mc', q: 'Qual comando descarta as alterações não commitadas de um único arquivo?', options: ['git restore folha.py', 'git commit folha.py', 'git branch folha.py', 'git push folha.py'], answer: 0, explain: 'git restore <arquivo> volta o arquivo ao estado do último commit; git restore . faz isso para tudo.' },
        { type: 'mc', q: 'Em que situação o modo accept edits é apropriado, segundo a lição?', options: ['Em qualquer código sensível', 'Em tarefas repetitivas e de baixo risco, revisando depois com /diff ou git diff', 'Quando não há Git', 'Nunca'], answer: 1, explain: 'A documentação sugere accept edits para revisar depois em vez de aprovar inline; para código sensível, volte ao manual.' },
        { type: 'match', q: 'Relacione a ferramenta de reversão ao seu alcance.', pairs: [['/rewind', 'Edições feitas pelas ferramentas de arquivo na sessão'], ['git restore arquivo', 'Alterações não commitadas de um arquivo'], ['git revert', 'Desfaz um commit criando outro, sem perder histórico'], ['"desfaça a última alteração"', 'Pede ao agente para reverter a edição recente']], explain: 'Cada mecanismo cobre um nível: sessão, arquivo não commitado, histórico, pedido direto.' },
      ],
    },
    {
      id: 'cc-02-03',
      title: 'Rodar comandos e testes pela conversa',
      minutes: 24,
      content: 'content/claudecode/cc-02/03-rodar-comandos-e-testes.md',
      exercises: [
        { type: 'mc', q: 'Qual é o pedido mais completo para o laço de correção?', options: ['"rode os testes"', '"corrija tudo"', '"rode python -m pytest -q e corrija as falhas sem alterar os testes; repita até passar e mostre a saída final"', '"os testes estão quebrados"'], answer: 2, explain: 'Esse pedido define o comando, proíbe mudar os testes, pede repetição até passar e exige evidência.' },
        { type: 'tf', q: 'Uma variável de ambiente definida em um comando do Claude Code continua valendo no comando seguinte.', answer: false, explain: 'Cada comando roda em processo separado; a documentação diz que variáveis de ambiente não persistem, por isso o venv deve ser ativado antes de abrir o Claude Code.' },
        { type: 'fill', q: 'O tempo limite padrão de um comando é de ___ minutos (o Claude pode pedir até dez).', answer: ['2', 'dois', '2 minutos', 'dois minutos'], explain: 'A documentação cita dois minutos como padrão e dez como teto; processos mais longos vão para segundo plano.' },
        { type: 'mc', q: 'Um script para esperando uma resposta "S/N" no teclado. O que fazer?', options: ['Digitar S na conversa', 'Trocar a pergunta interativa por um argumento de linha de comando ou flag', 'Aumentar o tempo limite', 'Rodar em modo auto'], answer: 1, explain: 'A ferramenta de execução não tem teclado conectado ao comando; entradas devem vir por argumentos ou arquivos.' },
        { type: 'order', q: 'Ordene o fluxo correto para instalar uma dependência.', items: ['Criar e ativar o venv antes de abrir o Claude Code', 'Pedir pip install do pacote no venv ativo', 'Conferir no pedido de permissão que o comando é o esperado', 'Registrar o pacote no requirements.txt', 'Confirmar com um import de teste'], explain: 'O venv precisa estar ativo antes, porque o ambiente não persiste entre comandos; o registro e a confirmação fecham o ciclo.' },
        { type: 'mc', q: 'Qual atalho manda um comando em execução para segundo plano, e qual comando lista o que está rodando?', options: ['Ctrl+B e /tasks', 'Ctrl+O e /status', 'Esc e /diff', 'Ctrl+T e /context'], answer: 0, explain: 'Ctrl+B envia para o fundo; /tasks lista e encerra comandos e subagentes em segundo plano.' },
        { type: 'tf', q: 'Comandos somente-leitura como ls, cat e git status rodam sem pedir permissão no modo manual.', answer: true, explain: 'A documentação cita um conjunto fixo de comandos somente-leitura que não exigem aprovação.' },
      ],
    },
    {
      id: 'cc-02-04',
      title: 'Git com o Claude Code',
      minutes: 24,
      content: 'content/claudecode/cc-02/04-git-com-o-claude-code.md',
      exercises: [
        { type: 'mc', q: 'Qual mensagem de commit segue a convenção da lição?', options: ['fix', 'ajustes', 'Aceita datas com barra em extrair_competencia', 'mudei umas coisas no script de competência porque estava dando erro quando o nome vinha com barra e agora funciona'], answer: 2, explain: 'Imperativo, curta, diz o quê; as outras são genéricas ou longas demais para a primeira linha.' },
        { type: 'tf', q: 'É aceitável colar o token do GitHub na conversa para o Claude configurar o gh.', answer: false, explain: 'Autenticação é com você: rode gh auth login; tokens e senhas não entram na conversa.' },
        { type: 'fill', q: 'Para abrir o seletor de sessões filtrado pelas sessões ligadas ao pull request 123: claude ___ 123', answer: ['--from-pr'], explain: 'A sessão é vinculada ao PR quando o Claude o cria com gh pr create; --from-pr reencontra essas sessões.' },
        { type: 'order', q: 'Ordene o fluxo completo de uma melhoria.', items: ['Criar a branch', 'Pedir a mudança com teste', 'Rodar os testes', 'Revisar arquivos, diff e segredos', 'Commit com mensagem descritiva', 'Criar o pull request'], explain: 'Branch primeiro, verificação antes do commit, PR por último.' },
        { type: 'mc', q: 'Por que a documentação recomenda instalar a CLI gh?', options: ['Sem ela o Git não funciona', 'O Claude sabe usá-la para issues, PRs e comentários; sem ela, a API sem autenticação bate em limites', 'Ela substitui o Claude Code', 'Ela faz commits automáticos'], answer: 1, explain: 'gh é a forma eficiente e autenticada de interagir com o GitHub; a alternativa não autenticada é limitada.' },
        { type: 'match', q: 'Relacione o pedido ao resultado.', pairs: [['"quais arquivos eu alterei?"', 'Status das alterações'], ['"crie uma nova branch chamada feature/log-csv"', 'Branch nova'], ['"me ajude a resolver os conflitos de merge"', 'Leitura dos marcadores e proposta de resolução'], ['"crie um pull request"', 'gh pr create com título e descrição']], explain: 'Os prompts do início rápido oficial cobrem status, branch, conflitos e PR.' },
        { type: 'mc', q: 'O que fazer logo depois de o Claude resolver um conflito de merge?', options: ['Fazer push imediatamente', 'Revisar o diff da resolução e rodar os testes', 'Apagar a branch', 'Nada; conflitos resolvidos não quebram nada'], answer: 1, explain: 'Resolução de conflito é fonte clássica de bug; a regra de negócio é decisão sua e os testes confirmam.' },
      ],
    },
    {
      id: 'cc-02-05',
      title: 'CLAUDE.md: a memória do projeto',
      minutes: 26,
      content: 'content/claudecode/cc-02/05-claude-md-a-memoria-do-projeto.md',
      exercises: [
        { type: 'match', q: 'Relacione o escopo do CLAUDE.md ao seu local.', pairs: [['Usuário (todos os projetos)', '~/.claude/CLAUDE.md'], ['Projeto (equipe, via Git)', './CLAUDE.md ou ./.claude/CLAUDE.md'], ['Local (pessoal, no .gitignore)', './CLAUDE.local.md'], ['Política gerenciada (Windows)', 'C:\\Program Files\\ClaudeCode\\CLAUDE.md']], explain: 'São os quatro escopos da tabela oficial, do mais amplo ao mais específico.' },
        { type: 'mc', q: 'O que o /init faz quando já existe um CLAUDE.md?', options: ['Sobrescreve o arquivo', 'Sugere melhorias em vez de sobrescrever', 'Apaga o arquivo', 'Nada'], answer: 1, explain: 'A documentação diz que, se o arquivo existir, /init sugere melhorias.' },
        { type: 'tf', q: 'Os CLAUDE.md de usuário e de projeto são concatenados; o do projeto não substitui o do usuário.', answer: true, explain: 'Todos os arquivos descobertos são concatenados em ordem do mais amplo ao mais específico.' },
        { type: 'fill', q: 'Para confirmar que o CLAUDE.md foi carregado, rode ___ e procure a lista Memory files.', answer: ['/context', 'context'], explain: '/context mostra o que ocupa a janela, inclusive os arquivos de memória carregados.' },
        { type: 'mc', q: 'Qual instrução está no formato recomendado (concreta e verificável)?', options: ['"seja cuidadoso com datas"', '"escreva código limpo"', '"valores monetários são sempre Decimal, nunca float"', '"faça as coisas direito"'], answer: 2, explain: 'A documentação contrasta instruções vagas com instruções verificáveis; só a terceira pode ser checada.' },
        { type: 'mc', q: 'Você disse "lembre que os testes precisam do venv ativo". Onde isso tende a ser gravado, segundo a documentação?', options: ['No CLAUDE.md do projeto', 'Na memória automática, em ~/.claude/projects/<projeto>/memory/', 'No .gitignore', 'Em settings.json'], answer: 1, explain: 'Pedidos de "lembre que…" vão para a memória automática; para o CLAUDE.md, peça "adicione ao CLAUDE.md".' },
        { type: 'tf', q: 'A meta oficial é manter o CLAUDE.md com menos de 200 linhas, porque arquivos longos reduzem a adesão.', answer: true, explain: 'A documentação cita 200 linhas como alvo e explica que o excesso consome contexto e faz o Claude ignorar regras.' },
        { type: 'write', q: 'Escreva um CLAUDE.md de até 12 linhas para um script de conciliação bancária do seu escritório.', model: '# Conciliação bancária\n## Como rodar\n- Ative .venv; rode python conciliar.py extrato.ofx razao.csv\n- Testes: python -m pytest -q\n## Regras\n- Lançamentos batem por valor exato e data com tolerância de 2 dias\n- Valores em Decimal\n## Não tocar\n- Pasta dados/ tem extratos reais: nunca commitar', checklist: ['Tem como rodar e como testar?', 'As regras são verificáveis?', 'Há uma seção do que não tocar e nenhum segredo?'] },
      ],
    },
    {
      id: 'cc-02-06',
      title: 'Modo de planejamento e tarefas grandes',
      minutes: 24,
      content: 'content/claudecode/cc-02/06-modo-de-planejamento-e-tarefas-grandes.md',
      exercises: [
        { type: 'mc', q: 'Quais são as três formas documentadas de entrar no modo plan?', options: ['Ctrl+P, /planning e --plan', 'Shift+Tab, claude --permission-mode plan e prefixo /plan', 'Esc Esc, /rewind e --resume', '/config, /model e /status'], answer: 1, explain: 'Shift+Tab cicla até o plan mode; a flag inicia nele; /plan vale para um pedido.' },
        { type: 'match', q: 'Relacione a opção de aprovação do plano ao efeito.', pairs: [['Yes, manually approve edits', 'Executa revisando cada edição'], ['Yes, and use auto mode', 'Executa com o classificador revisando, menos interrupções'], ['No, keep planning', 'Continua no modo plan para ajustar'], ['Ctrl+G', 'Abre o plano no editor para editá-lo antes de aprovar']], explain: 'São as opções documentadas do diálogo de aprovação, mais o atalho de edição do plano.' },
        { type: 'tf', q: 'Depois de aprovar o plano, o ideal é pedir "execute o plano todo" para ganhar tempo.', answer: false, explain: 'Uma etapa por vez mantém os diffs pequenos e permite corrigir cedo; o plano todo de uma vez gera diffs enormes.' },
        { type: 'fill', q: 'O atalho ___ mostra ou oculta a lista de tarefas do Claude na área de status.', answer: ['Ctrl+T'], explain: 'Ctrl+T alterna a checklist de tarefas; /tasks é outra coisa (processos em segundo plano).' },
        { type: 'mc', q: 'Na migração de planilha para SQLite, qual etapa a lição considera indispensável?', options: ['Interface gráfica', 'Validação contra a origem: contagens e somas iguais às da planilha', 'Envio por e-mail', 'Conversão para float'], answer: 1, explain: 'Sem validar contra a origem, linhas perdidas só aparecem meses depois.' },
        { type: 'mc', q: 'Qual é o padrão sugerido para dividir uma tarefa grande em sessões?', options: ['Nunca dividir', 'Salvar o plano em um arquivo, /clear e, na sessão nova, implementar a etapa 1 a partir de @PLANO.md', 'Copiar a conversa inteira para a sessão nova', 'Usar bypass para ir mais rápido'], answer: 1, explain: 'A documentação recomenda escrever a especificação e executá-la numa sessão nova com contexto limpo; o arquivo resiste à compactação.' },
        { type: 'write', q: 'Escreva o prompt de planejamento para migrar o controle de certificados digitais dos clientes (planilha) para SQLite, com requisitos verificáveis.', model: 'Quero migrar certificados.xlsx para certificados.db (SQLite). Requisitos: tabela clientes e tabela certificados com validade e tipo; importação idempotente; alerta de vencimento em 30 dias como função consultável; testes com pytest; validação final comparando contagem de linhas e datas com a planilha. Monte um plano em etapas pequenas e diga o que preciso decidir.', checklist: ['Há requisitos que podem ser testados?', 'Pediu etapas pequenas e validação contra a origem?', 'Pediu as decisões que cabem a você?'] },
      ],
    },
    {
      id: 'cc-02-07',
      title: 'Interface: atalhos, imagens e comandos',
      minutes: 24,
      content: 'content/claudecode/cc-02/07-interface-atalhos-imagens-e-comandos.md',
      exercises: [
        { type: 'match', q: 'Relacione o atalho à função.', pairs: [['Esc', 'Interrompe a ação mantendo o trabalho'], ['Esc Esc (caixa vazia)', 'Abre o menu de rewind'], ['Ctrl+O', 'Visualizador de transcrição'], ['Ctrl+L', 'Redesenha a tela'], ['Ctrl+R', 'Busca no histórico']], explain: 'Todos constam da referência de modo interativo.' },
        { type: 'mc', q: 'Como quebrar linha sem enviar a mensagem em qualquer terminal?', options: ['Enter', '\\ seguido de Enter (ou Ctrl+J)', 'Ctrl+C', 'Tab'], answer: 1, explain: '\\+Enter e Ctrl+J funcionam em qualquer terminal; Shift+Enter é nativo no Windows Terminal.' },
        { type: 'fill', q: 'No Windows, se o terminal interceptar o Ctrl+V, cole a imagem com ___.', answer: ['Alt+V', 'alt+v'], explain: 'A documentação lista Alt+V como atalho de colar imagem no Windows e no WSL.' },
        { type: 'tf', q: 'O comando /vim ainda é a forma de ativar o modo vim.', answer: false, explain: '/vim foi removido; o modo vim é ativado em /config → Editor mode (ou "editorMode": "vim" no settings.json).' },
        { type: 'mc', q: 'Qual comando mostra versão, modelo, conta e conectividade?', options: ['/status', '/model', '/clear', '/export'], answer: 0, explain: '/status abre a aba de status das configurações; /model troca o modelo.' },
        { type: 'mc', q: 'O que o /doctor faz dentro da sessão?', options: ['Apaga a conversa', 'Faz um check-up da instalação, configurações, extensões e CLAUDE.md e propõe correções que você confirma', 'Troca o modelo', 'Mostra o uso do plano'], answer: 1, explain: 'É o check-up de configuração; claude doctor na linha de comando faz o diagnóstico somente-leitura.' },
        { type: 'tf', q: '/btw faz uma pergunta lateral cuja resposta não entra no histórico da conversa.', answer: true, explain: 'É útil para tirar uma dúvida sem crescer o contexto.' },
      ],
    },
    {
      id: 'cc-02-08',
      title: 'VS Code, JetBrains, app desktop e web',
      minutes: 25,
      content: 'content/claudecode/cc-02/08-vs-code-jetbrains-desktop-e-web.md',
      exercises: [
        { type: 'mc', q: 'No VS Code, qual atalho insere uma referência com arquivo e intervalo de linhas da seleção?', options: ['Ctrl+Esc', 'Alt+K', 'Shift+Tab', 'Ctrl+Shift+Esc'], answer: 1, explain: 'Alt+K insere @arquivo#linhas; Ctrl+Esc alterna o foco; Ctrl+Shift+Esc abre nova aba.' },
        { type: 'tf', q: 'O plugin JetBrains inclui sua própria cópia da CLI, então não é preciso instalar o claude.', answer: false, explain: 'A documentação diz que o plugin roda o comando claude no terminal integrado e exige a CLI instalada separadamente.' },
        { type: 'match', q: 'Relacione a superfície à característica.', pairs: [['Extensão VS Code', 'Diffs lado a lado com aceitar/rejeitar por mudança'], ['App desktop', 'Inclui o Claude Code; sessões com pasta própria e opção worktree'], ['Web (claude.ai/code)', 'VM na nuvem a partir de um repositório no GitHub'], ['Plugin JetBrains', 'Ctrl+Esc abre; exige a CLI']], explain: 'Cada superfície tem um diferencial, mas todas usam o mesmo motor e o mesmo CLAUDE.md.' },
        { type: 'fill', q: 'Para criar uma sessão na nuvem a partir do terminal: claude ___ "descrição da tarefa"', answer: ['--cloud'], explain: '--cloud cria a sessão na nuvem clonando o remoto do GitHub; --teleport faz o caminho inverso.' },
        { type: 'mc', q: 'No app desktop, como se troca o modo de permissão?', options: ['Shift+Tab', 'Pelo seletor de modos da interface', 'Com /permission', 'Não é possível'], answer: 1, explain: 'A documentação diz que no desktop Shift+Tab não cicla os modos; usa-se o seletor.' },
        { type: 'tf', q: 'A extensão do VS Code e a CLI compartilham o histórico de conversas: claude --resume no terminal retoma uma conversa iniciada na extensão.', answer: true, explain: 'É o comportamento documentado; a extensão também tem o botão Session history.' },
        { type: 'mc', q: 'Qual superfície é a mais indicada para uma tarefa longa num repositório GitHub que você quer acompanhar pelo celular?', options: ['Terminal', 'Web/nuvem', 'JetBrains', 'Bloco de Notas'], answer: 1, explain: 'As sessões na nuvem continuam com o computador desligado e aparecem no app de celular.' },
      ],
    },
    {
      id: 'cc-02-09',
      title: 'Projeto guiado: evoluir o organizador',
      minutes: 25,
      content: 'content/claudecode/cc-02/09-projeto-guiado-evoluir-o-organizador.md',
      exercises: [
        {
          type: 'code',
          q: 'Escreva `data_valida(ano, mes, dia)` que recebe três inteiros e devolve True só se o mês estiver entre 1 e 12 e o dia entre 1 e 31 (regra simplificada do projeto). Use-a na função `extrair_competencia` já fornecida, que deve devolver None para datas inválidas.',
          starter: `import re

def data_valida(ano, mes, dia):
    pass

def extrair_competencia(nome):
    m = re.search(r"(\\d{4})[-_](\\d{2})[-_](\\d{2})", nome)
    if m:
        ano, mes, dia = int(m.group(1)), int(m.group(2)), int(m.group(3))
        if data_valida(ano, mes, dia):
            return m.group(1) + "-" + m.group(2)
        return None
    m = re.search(r"(\\d{2})[-_](\\d{2})[-_](\\d{4})", nome)
    if m:
        dia, mes, ano = int(m.group(1)), int(m.group(2)), int(m.group(3))
        if data_valida(ano, mes, dia):
            return m.group(3) + "-" + m.group(2)
        return None
    return None
`,
          tests: `assert data_valida(2026, 3, 15) is True, "15/03/2026 é válida"
assert data_valida(2026, 13, 1) is False, "mês 13 é inválido"
assert data_valida(2026, 1, 32) is False, "dia 32 é inválido"
assert data_valida(2026, 0, 10) is False, "mês 0 é inválido"
assert data_valida(2026, 5, 0) is False, "dia 0 é inválido"
assert extrair_competencia("NF_32-13-2026.pdf") is None, "data inválida deve devolver None"
assert extrair_competencia("NF_15-03-2026.pdf") == "2026-03", "data válida deve virar 2026-03"
`,
          solution: `import re

def data_valida(ano, mes, dia):
    return 1 <= mes <= 12 and 1 <= dia <= 31

def extrair_competencia(nome):
    m = re.search(r"(\\d{4})[-_](\\d{2})[-_](\\d{2})", nome)
    if m:
        ano, mes, dia = int(m.group(1)), int(m.group(2)), int(m.group(3))
        if data_valida(ano, mes, dia):
            return m.group(1) + "-" + m.group(2)
        return None
    m = re.search(r"(\\d{2})[-_](\\d{2})[-_](\\d{4})", nome)
    if m:
        dia, mes, ano = int(m.group(1)), int(m.group(2)), int(m.group(3))
        if data_valida(ano, mes, dia):
            return m.group(3) + "-" + m.group(2)
        return None
    return None
`,
          hint: 'Uma comparação encadeada resolve: 1 <= mes <= 12 and 1 <= dia <= 31. Devolva o booleano diretamente.',
          explain: 'A validação de intervalos é a correção do bug da etapa 4; a comparação encadeada devolve True ou False sem if.',
        },
        {
          type: 'code',
          q: 'Escreva `linha_log(nome, destino, momento)` que devolve a lista [nome, destino, momento_formatado], em que momento é um datetime e o formato é "AAAA-MM-DD HH:MM:SS". É a linha que o csv.writer vai gravar em organizado/log.csv.',
          starter: `from datetime import datetime

def linha_log(nome, destino, momento):
    pass
`,
          tests: `r = linha_log("NF_1_2026-03-15.pdf", "organizado/2026-03", datetime(2026, 4, 2, 9, 5, 7))
assert isinstance(r, list), "deve devolver uma lista, não " + type(r).__name__
assert r == ["NF_1_2026-03-15.pdf", "organizado/2026-03", "2026-04-02 09:05:07"], "linha incorreta: " + str(r)
assert linha_log("a.pdf", "organizado/sem_competencia", datetime(2025, 12, 31, 23, 59, 0))[2] == "2025-12-31 23:59:00", "horas e minutos devem ter dois dígitos"
`,
          solution: `from datetime import datetime

def linha_log(nome, destino, momento):
    return [nome, destino, momento.strftime("%Y-%m-%d %H:%M:%S")]
`,
          hint: 'Use momento.strftime("%Y-%m-%d %H:%M:%S").',
          explain: 'Separar a montagem da linha da gravação em disco permite testar a função sem criar arquivos.',
        },
        { type: 'order', q: 'Ordene as etapas do projeto guiado.', items: ['/init e ajustes no CLAUDE.md', 'Branch e commit do CLAUDE.md e .gitignore', 'Migrar testes para pytest com casos de borda', 'Teste que falha e correção de datas inválidas', 'Log em CSV', '/diff, /code-review e pull request'], explain: 'Memória do projeto, Git, testes, correção, nova funcionalidade e revisão final.' },
        { type: 'mc', q: 'Por que entrada/ e organizado/ vão no .gitignore?', options: ['Para o script rodar mais rápido', 'Porque contêm arquivos reais de clientes que não devem ir para o repositório', 'Porque o Git não aceita PDFs', 'Para economizar contexto'], answer: 1, explain: 'Dados reais nunca entram no Git; o repositório guarda código, testes e configuração.' },
        { type: 'tf', q: 'Na etapa 4, é essencial ver o teste falhar antes de pedir a correção.', answer: true, explain: 'O teste vermelho prova que ele reproduz o bug; se já passasse, a correção não estaria sendo verificada.' },
        { type: 'mc', q: 'O que fazer se o gh não estiver instalado na hora de abrir o PR?', options: ['Colar o token do GitHub na conversa', 'Pedir a descrição do PR em um arquivo e abrir o PR pelo site do GitHub', 'Desistir do PR', 'Commitar direto na main'], answer: 1, explain: 'A autenticação (gh auth login) é sua; sem o gh, a descrição ainda pode ser gerada e o PR aberto manualmente.' },
      ],
    },
  ],
  exam: {
    passScore: 70,
    questions: [
      { type: 'mc', q: 'O que @pasta/ inclui na conversa?', options: ['O conteúdo de todos os arquivos', 'A listagem de arquivos da pasta', 'O histórico do Git da pasta', 'Nada'], answer: 1, explain: 'Diretórios referenciados com @ trazem listagens, não conteúdos.' },
      { type: 'tf', q: 'Começar uma mensagem com ! roda o comando e coloca a saída na conversa.', answer: true, explain: 'É o modo shell do Claude Code.' },
      { type: 'mc', q: 'Qual frase ajuda a manter o diff pequeno?', options: ['"melhore o que achar necessário"', '"não altere mais nada"', '"refaça o arquivo"', '"use sua criatividade"'], answer: 1, explain: 'A restrição explícita evita mudanças de brinde.' },
      { type: 'fill', q: 'Para descartar as alterações não commitadas de um arquivo: git ___ arquivo.py', answer: ['restore'], explain: 'git restore volta o arquivo ao último commit.' },
      { type: 'mc', q: 'Por que ativar o venv antes de abrir o Claude Code?', options: ['Porque o Claude Code exige venv para iniciar', 'Porque variáveis de ambiente não persistem entre comandos da ferramenta de execução', 'Porque o pip não funciona sem isso', 'Para economizar tokens'], answer: 1, explain: 'Cada comando roda em processo separado; o ambiente ativado antes é herdado por todos.' },
      { type: 'tf', q: 'Um comando pode rodar indefinidamente em primeiro plano, sem limite de tempo.', answer: false, explain: 'Há tempo limite (dois minutos por padrão, até dez); processos longos vão para segundo plano.' },
      { type: 'mc', q: 'O que acontece quando o Claude cria um PR com gh pr create?', options: ['A sessão é apagada', 'A sessão fica vinculada ao PR e pode ser reencontrada com claude --from-pr', 'O PR é mesclado automaticamente', 'O repositório vira público'], answer: 1, explain: 'A vinculação permite voltar à sessão daquele PR.' },
      { type: 'match', q: 'Relacione o arquivo ao seu papel.', pairs: [['./CLAUDE.md', 'Instruções do projeto, versionadas'], ['./CLAUDE.local.md', 'Preferências pessoais do projeto, no .gitignore'], ['~/.claude/CLAUDE.md', 'Preferências do usuário em todos os projetos'], ['MEMORY.md', 'Índice da memória automática escrita pelo Claude']], explain: 'Cada arquivo tem um escopo e um autor diferentes.' },
      { type: 'mc', q: 'Qual comando gera um CLAUDE.md inicial analisando o projeto?', options: ['/memory', '/init', '/context', '/config'], answer: 1, explain: '/init cria o rascunho; /memory edita; /context confirma o carregamento.' },
      { type: 'fill', q: 'Para entrar no modo plan por um único pedido, comece a mensagem com ___.', answer: ['/plan', 'plan'], explain: '/plan entra no modo de planejamento para aquela tarefa.' },
      { type: 'mc', q: 'Qual atalho abre o plano proposto no editor de texto para edição antes de aprovar?', options: ['Ctrl+G', 'Ctrl+O', 'Ctrl+T', 'Ctrl+B'], answer: 0, explain: 'Ctrl+G abre o texto no editor padrão; Ctrl+O é a transcrição, Ctrl+T a lista de tarefas, Ctrl+B o segundo plano.' },
      { type: 'tf', q: 'No terminal do Windows, Alt+M é a alternativa documentada ao Shift+Tab para trocar o modo de permissão.', answer: true, explain: 'A referência de modo interativo cita Alt+M no Windows quando o runtime não habilita o modo VT.' },
      { type: 'mc', q: 'Qual superfície exige a CLI instalada separadamente para funcionar?', options: ['App desktop', 'Plugin JetBrains', 'Web', 'Nenhuma'], answer: 1, explain: 'O plugin JetBrains roda o comando claude no terminal integrado; o desktop inclui o Claude Code.' },
      { type: 'mc', q: 'No projeto guiado, qual é a ordem correta ao corrigir o bug de data inválida?', options: ['Corrigir o código e depois escrever o teste', 'Escrever o teste que falha, ver a falha, corrigir e rodar de novo', 'Apagar o teste antigo', 'Alterar a assinatura da função'], answer: 1, explain: 'Teste vermelho antes da correção prova que o bug foi reproduzido e resolvido.' },
      {
        type: 'code',
        q: 'Escreva `resumo_por_competencia(grupos)` que recebe um dicionário {competencia: [nomes]} e devolve uma lista de strings "competencia: N arquivo(s)", em ordem alfabética de competência.',
        starter: `def resumo_por_competencia(grupos):
    pass
`,
        tests: `r = resumo_por_competencia({"2026-04": ["c.pdf"], "2026-03": ["a.pdf", "b.pdf"], "sem_competencia": ["x.pdf"]})
assert r == ["2026-03: 2 arquivo(s)", "2026-04: 1 arquivo(s)", "sem_competencia: 1 arquivo(s)"], "resumo incorreto: " + str(r)
assert resumo_por_competencia({}) == [], "dicionário vazio devolve lista vazia"
`,
        solution: `def resumo_por_competencia(grupos):
    linhas = []
    for comp in sorted(grupos):
        linhas.append(comp + ": " + str(len(grupos[comp])) + " arquivo(s)")
    return linhas
`,
        hint: 'Use sorted(grupos) para percorrer as chaves em ordem e len() para contar.',
        explain: 'Ordenar as chaves garante um resumo previsível; a contagem vem do tamanho de cada lista.',
      },
    ],
  },
});
