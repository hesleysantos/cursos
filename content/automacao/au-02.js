registerModule({
  course: 'automacao',
  id: 'au-02',
  order: 2,
  level: 'Básico',
  title: 'Automação sem código com Make e n8n',
  description: 'Você vai montar fluxos reais em ferramentas sem código: gatilhos, ações, filtros, roteadores, iteradores, módulo HTTP para APIs, agendamentos, Google Workspace e Microsoft 365, WhatsApp e e-mail, tratamento de erros e documentação. Ao final, terá construído o fluxo completo de onboarding de cliente do escritório, com testes e rubrica.',
  hours: 9,
  lessons: [
    {
      id: 'au-02-01',
      title: 'Conceitos das ferramentas de fluxo',
      minutes: 27,
      content: 'content/automacao/au-02/01-conceitos-ferramentas-de-fluxo.md',
      exercises: [
        { type: 'mc', q: 'O que é o gatilho (trigger) de um fluxo?', options: ['O último bloco, que envia o resultado', 'O evento ou horário que faz o fluxo começar', 'A conexão com o Google', 'O cofre de credenciais'], answer: 1, explain: 'O gatilho é o "quando acontece X"; é sempre o primeiro bloco e só existe um por fluxo.' },
        { type: 'match', q: 'Relacione o tipo de gatilho ao exemplo.', pairs: [['Instantâneo (webhook)', 'Formulário Tally respondido'], ['Por consulta (polling)', 'Novo e-mail verificado a cada 15 minutos'], ['Agendado', 'Todo dia 20 às 8h'], ['Manual', 'Clicar em "executar" para um teste']], explain: 'Gatilhos instantâneos reagem no momento do evento; por consulta verificam de tempos em tempos; agendados seguem o relógio; manuais dependem de um clique.' },
        { type: 'tf', q: 'Um fluxo pode ter vários gatilhos, um para cada serviço conectado.', answer: false, explain: 'Cada fluxo tem um único gatilho; os demais blocos são ações ou lógica.' },
        { type: 'fill', q: 'Ligar a saída de um módulo (por exemplo, o e-mail do formulário) à entrada do módulo seguinte (o destinatário do e-mail) chama-se ___ campos.', answer: ['mapear', 'mapeamento de', 'mapeamento'], explain: 'Mapear campos é a maior parte do trabalho de montar um fluxo: cada execução preenche o valor vindo do bloco anterior.' },
        { type: 'mc', q: 'Um fluxo com 5 módulos roda 100 vezes no mês. Quantas operações ele consome, aproximadamente, numa ferramenta que cobra por módulo executado?', options: ['5', '100', '500', '105'], answer: 2, explain: 'Cada execução roda os 5 módulos; 100 × 5 = 500 operações.' },
        { type: 'mc', q: 'Qual ferramenta tem o código-fonte disponível (licença fair-code) e pode ser hospedada no servidor do próprio escritório?', options: ['Make', 'Zapier', 'n8n', 'Power Automate'], answer: 2, explain: 'O n8n publica o código-fonte sob a licença fair-code e oferece a opção self-hosted, sem cobrança por execução nesse caso; Make, Zapier e Power Automate só existem em nuvem.' },
        { type: 'tf', q: 'É recomendável rodar o gatilho uma vez com dados de exemplo antes de mapear os campos nos módulos seguintes.', answer: true, explain: 'Assim a ferramenta "aprende" os campos existentes e os mostra para você arrastar, em vez de mapear no escuro.' },
        { type: 'mc', q: 'Um escritório que trabalha inteiramente no Outlook, Excel, SharePoint e Teams tende a se beneficiar mais de qual ferramenta?', options: ['Power Automate', 'n8n', 'Zapier', 'Make'], answer: 0, explain: 'O Power Automate é integrado ao Microsoft 365, com conectores nativos para esses apps.' },
      ],
    },
    {
      id: 'au-02-02',
      title: 'Primeiro fluxo: formulário → planilha → e-mail',
      minutes: 24,
      content: 'content/automacao/au-02/02-primeiro-fluxo.md',
      exercises: [
        { type: 'order', q: 'Ordene os passos para montar o primeiro fluxo.', items: ['Preparar formulário, planilha com cabeçalho e texto do e-mail', 'Criar o fluxo e configurar o gatilho do formulário', 'Testar o gatilho com uma resposta de exemplo', 'Adicionar o módulo do Sheets e mapear as colunas', 'Adicionar o módulo de e-mail e mapear destinatário e texto', 'Testar de ponta a ponta e ativar'], explain: 'Preparação fora da ferramenta, gatilho testado antes de mapear, ações em sequência, teste completo e só então ativação.' },
        { type: 'mc', q: 'Por que testar o gatilho antes de adicionar os outros módulos?', options: ['Para gastar operações', 'Para a ferramenta reconhecer os campos do formulário e permitir mapeá-los', 'Porque é obrigatório na interface', 'Para ativar o fluxo'], answer: 1, explain: 'Sem uma execução de exemplo, os campos não aparecem e o mapeamento vira adivinhação.' },
        { type: 'tf', q: 'Durante a construção, é aceitável testar com o e-mail de um cliente real, desde que seja só uma vez.', answer: false, explain: 'Testes usam seus próprios contatos e uma planilha de teste; clientes reais só depois da ativação.' },
        { type: 'fill', q: 'Se o Google Forms não aparece como gatilho direto, pode-se usar a planilha de respostas com o gatilho "nova ___" do Google Sheets.', answer: ['linha'], explain: 'O Google Forms grava cada resposta como uma linha na planilha; o gatilho de nova linha funciona igual.' },
        { type: 'mc', q: 'Você mudou o cabeçalho da planilha depois de configurar o módulo do Sheets. O que deve fazer?', options: ['Nada; a ferramenta percebe sozinha', 'Apagar o fluxo e começar de novo', 'Reabrir o módulo para ele reler o cabeçalho e conferir o mapeamento', 'Trocar a planilha'], answer: 2, explain: 'O módulo guarda o cabeçalho lido na configuração; se ele muda, as colunas desalinham até você reabrir e remapear.' },
        { type: 'match', q: 'Relacione o teste ao problema que ele revela.', pairs: [['Nome com acento e "&"', 'Codificação de caracteres'], ['CNPJ começando por zero', 'Coluna numérica que apaga o zero'], ['E-mail em branco', 'Módulo de envio falha sem tratamento'], ['Fluxo ainda desativado', '"Não funciona" porque não está ligado']], explain: 'Cada caso de teste simula uma falha comum; descobrir na construção é mais barato do que em produção.' },
        { type: 'mc', q: 'O que deve ser registrado numa lista de "fluxos ativos" ao ativar um fluxo?', options: ['Só o nome', 'A senha da conta', 'O número de operações', 'Nome, o que faz, contas usadas e data de ativação'], answer: 3, explain: 'Esse registro é o começo da documentação e evita fluxos esquecidos rodando sem dono.' },
      ],
    },
    {
      id: 'au-02-03',
      title: 'Lógica no fluxo',
      minutes: 27,
      content: 'content/automacao/au-02/03-logica-no-fluxo.md',
      exercises: [
        { type: 'mc', q: 'Qual é a diferença entre um filtro e um roteador?', options: ['Não há diferença', 'O filtro tem um caminho (passa ou não); o roteador tem vários caminhos', 'O roteador é mais barato', 'O filtro só funciona com números'], answer: 1, explain: 'Filtro é a catraca; roteador é a bifurcação com várias placas.' },
        { type: 'tf', q: 'Um roteador deve sempre ter uma rota padrão (fallback) para os itens que não casam com nenhuma condição.', answer: true, explain: 'Sem rota padrão, valores inesperados como "MEI" ou campo vazio somem em silêncio.' },
        { type: 'fill', q: 'O bloco que transforma uma lista de 60 clientes em 60 itens processados um a um chama-se ___.', answer: ['iterador', 'iterator', 'loop'], explain: 'O iterador é a esteira do caixa: pega a cesta (lista) e passa um item por vez.' },
        { type: 'mc', q: 'Qual expressão deixa "Simples Nacional", " simples nacional " e "SIMPLES NACIONAL" na mesma rota?', options: ['regime = "Simples Nacional"', 'upper(regime) = "Simples Nacional"', 'lower(trim(regime)) = "simples nacional"', 'trim(regime) = "SIMPLES"'], answer: 2, explain: 'trim remove espaços das pontas e lower padroniza as letras; a comparação então é estável.' },
        { type: 'match', q: 'Relacione a necessidade à função típica.', pairs: [['Tirar espaços das pontas', 'trim'], ['Só dígitos do CNPJ', 'replace com expressão regular'], ['Data de hoje', 'now'], ['Converter texto em número', 'parseNumber / toNumber']], explain: 'Essas funções preparam os dados antes de filtros, comparações e gravações.' },
        { type: 'mc', q: 'Um fluxo lê 60 clientes, itera e, só depois de 3 módulos, filtra os ativos (20). Onde colocar o filtro para economizar operações?', options: ['Depois do e-mail', 'Logo após o iterador, antes dos 3 módulos', 'No final do fluxo', 'Não faz diferença'], answer: 1, explain: 'Filtrar cedo evita rodar os módulos caros para os 40 clientes inativos.' },
        { type: 'order', q: 'Ordene os blocos do fluxo "separar clientes por regime e enviar e-mail no dia 1".', items: ['Gatilho agendado: dia 1, 8h', 'Sheets: buscar linhas de clientes', 'Iterador: um cliente por vez', 'Filtro: ativo = true', 'Roteador por regime, com rota padrão', 'E-mail do modelo da rota', 'Sheets: linha no log'], explain: 'Gatilho, leitura, iteração, filtro, decisão, ação e registro: a ordem padrão de um fluxo com lógica.' },
        { type: 'tf', q: 'Um agregador transforma vários itens em um só, útil para montar um único e-mail com a lista de pendências.', answer: true, explain: 'É o inverso do iterador: junta os itens para uma ação única em vez de uma por item.' },
      ],
    },
    {
      id: 'au-02-04',
      title: 'Trabalhando com APIs no fluxo',
      minutes: 32,
      content: 'content/automacao/au-02/04-apis-no-fluxo.md',
      exercises: [
        { type: 'mc', q: 'Para que serve o módulo HTTP numa ferramenta de fluxo?', options: ['Para abrir sites no navegador', 'Para chamar qualquer API, mesmo sem conector pronto', 'Para enviar e-mails', 'Para criar planilhas'], answer: 1, explain: 'O módulo HTTP envia requisições genéricas (URL, método, cabeçalhos, corpo) e devolve a resposta; é a chave mestra das integrações.' },
        { type: 'fill', q: 'Antes de montar a URL da BrasilAPI, o CNPJ "12.345.678/0001-90" precisa ser convertido para ___ (só os 14 dígitos).', answer: ['12345678000190'], explain: 'A API espera o CNPJ sem pontos, barra e traço; com formatação, a resposta é 404 ou 400.' },
        { type: 'tf', q: 'No POST com corpo em JSON, o cabeçalho Content-Type: application/json é dispensável.', answer: false, explain: 'Sem esse cabeçalho, muitas APIs não interpretam o corpo e devolvem 400.' },
        { type: 'match', q: 'Relacione o tipo de autenticação à configuração no módulo HTTP.', pairs: [['Bearer token', 'Cabeçalho Authorization: Bearer TOKEN'], ['Chave de API', 'Cabeçalho próprio, como X-API-Key'], ['OAuth 2.0', 'Credencial com client ID e secret, autorizada na ferramenta'], ['Basic', 'Usuário e senha codificados pela ferramenta']], explain: 'Em todos os casos a credencial deve ficar no cofre da ferramenta, não digitada no fluxo.' },
        { type: 'mc', q: 'A consulta de CNPJ devolveu 404. O fluxo deve:', options: ['Parar com erro e desativar', 'Tentar de novo 100 vezes', 'Ignorar e gravar os dados vazios como válidos', 'Tratar como caso esperado: registrar "CNPJ não encontrado" e seguir ou alertar'], answer: 3, explain: '404 é um resultado possível; a ferramenta deve ser configurada para não interromper, e o roteador trata o status.' },
        {
          type: 'code',
          q: 'Escreva a função montar_url(cnpj) que remove tudo que não é dígito do CNPJ e devolve a URL "https://brasilapi.com.br/api/cnpj/v1/" seguida dos 14 dígitos. Dica: use re.sub.',
          starter: `import re

def montar_url(cnpj):
    pass
`,
          tests: `assert montar_url("12.345.678/0001-90") == "https://brasilapi.com.br/api/cnpj/v1/12345678000190", "deveria limpar pontos, barra e traço"
assert montar_url("04690098000107") == "https://brasilapi.com.br/api/cnpj/v1/04690098000107", "CNPJ já limpo deve manter o zero à esquerda"
assert montar_url(" 98.765.432/0001-11 ") == "https://brasilapi.com.br/api/cnpj/v1/98765432000111", "espaços também devem sair"
`,
          solution: `import re

def montar_url(cnpj):
    cnpj_limpo = re.sub(r"[^0-9]", "", cnpj)
    return "https://brasilapi.com.br/api/cnpj/v1/" + cnpj_limpo
`,
          hint: 're.sub(r"[^0-9]", "", texto) remove tudo que não é dígito.',
          explain: 'A expressão [^0-9] casa qualquer caractere que não seja dígito; substituí-los por vazio deixa só os números.',
        },
        {
          type: 'code',
          q: 'Escreva a função interpretar(status, corpo) que simula o roteador por status: se status for 200, devolva um dicionário {"ok": True, "razao_social": <campo razao_social do JSON em corpo>}; se for 404, devolva {"ok": False, "motivo": "CNPJ não encontrado"}; para qualquer outro status, devolva {"ok": False, "motivo": "erro <status>"}.',
          starter: `import json

def interpretar(status, corpo):
    pass
`,
          tests: `r = interpretar(200, '{"razao_social": "PADARIA PAO QUENTE ME", "uf": "SP"}')
assert r == {"ok": True, "razao_social": "PADARIA PAO QUENTE ME"}, "status 200 deve devolver ok True e a razão social"
assert interpretar(404, '{"message": "nao encontrado"}') == {"ok": False, "motivo": "CNPJ não encontrado"}, "status 404 deve devolver o motivo 'CNPJ não encontrado'"
assert interpretar(500, '') == {"ok": False, "motivo": "erro 500"}, "outros status devem devolver 'erro <status>'"
assert interpretar(429, '') == {"ok": False, "motivo": "erro 429"}, "429 deve devolver 'erro 429'"
`,
          solution: `import json

def interpretar(status, corpo):
    if status == 200:
        dados = json.loads(corpo)
        return {"ok": True, "razao_social": dados["razao_social"]}
    if status == 404:
        return {"ok": False, "motivo": "CNPJ não encontrado"}
    return {"ok": False, "motivo": f"erro {status}"}
`,
          hint: 'Trate 200 primeiro (com json.loads), depois 404, e deixe o caso geral por último.',
          explain: 'Verificar o status antes de ler o corpo evita tentar interpretar JSON de uma resposta de erro.',
        },
        { type: 'mc', q: 'Ao iterar 300 CNPJs e consultar uma API pública em sequência, o que evita o erro 429?', options: ['Inserir uma pausa entre as chamadas e respeitar o limite da API', 'Usar POST em vez de GET', 'Remover o parse', 'Trocar o cabeçalho Accept'], answer: 0, explain: '429 significa "muitas requisições"; pausas ou processamento em lotes mantêm o fluxo dentro do limite.' },
      ],
    },
    {
      id: 'au-02-05',
      title: 'Agendamentos e gatilhos de tempo',
      minutes: 27,
      content: 'content/automacao/au-02/05-agendamentos.md',
      exercises: [
        { type: 'mc', q: 'O que significa a expressão cron "0 9 20 * *"?', options: ['Todo dia às 20h09', 'Dia 20 de cada mês às 9h00', 'A cada 20 minutos', 'Dia 9 de cada mês às 20h'], answer: 1, explain: 'Os campos são minuto (0), hora (9), dia do mês (20), mês (qualquer) e dia da semana (qualquer).' },
        { type: 'fill', q: 'Complete a expressão cron para "de segunda a sexta às 7h00": 0 7 * * ___', answer: ['1-5', '1,2,3,4,5', 'MON-FRI'], explain: 'O quinto campo é o dia da semana; 1 a 5 vai de segunda a sexta (domingo é 0). Muitas implementações também aceitam as abreviações em inglês, como MON-FRI.' },
        { type: 'match', q: 'Relacione a expressão cron ao significado.', pairs: [['0 8 * * *', 'Todo dia às 8h'], ['0 8 1 * *', 'Dia 1 de cada mês às 8h'], ['0 */2 * * *', 'A cada 2 horas'], ['0 18 * * 5', 'Toda sexta às 18h']], explain: 'Leia sempre na ordem minuto, hora, dia do mês, mês, dia da semana.' },
        { type: 'tf', q: 'A expressão "8 0 * * *" roda todo dia às 8h da manhã.', answer: false, explain: 'O primeiro campo é o minuto: "8 0" significa 00h08. Para 8h, use "0 8 * * *".' },
        { type: 'mc', q: 'Um fluxo configurado em UTC deve rodar às 8h de Brasília (UTC−3). Em que hora UTC ele deve ser agendado, se não for possível mudar o fuso?', options: ['5h', '8h', '11h', '20h'], answer: 2, explain: '8h em Brasília corresponde a 11h UTC; o ideal, porém, é configurar o fuso America/Sao_Paulo na ferramenta.' },
        { type: 'mc', q: 'Por que agendar um lembrete mensal para o dia 31 é um problema?', options: ['Porque é fim de semana', 'Porque meses com menos de 31 dias não terão execução', 'Porque o cron não aceita 31', 'Porque as APIs ficam fora do ar'], answer: 1, explain: 'O cron só dispara em dias que existem; para "último dia do mês", rode no dia 1 olhando para trás ou use a opção da interface.' },
        { type: 'order', q: 'Ordene as medidas, da mais simples à mais estrutural, para evitar que duas execuções do mesmo fluxo se sobreponham.', items: ['Agendar com intervalo maior que a duração máxima', 'Ativar a opção de não executar enquanto a anterior roda', 'Marcar as linhas como "processando" antes de agir', 'Trocar o gatilho de consulta por webhook'], explain: 'Da configuração mais rápida (intervalo) à mudança de arquitetura (webhook), todas reduzem o risco de duplicidade.' },
        { type: 'tf', q: 'Um lembrete "vence hoje" agendado para o dia 20 pode cair num sábado ou feriado e confundir o cliente.', answer: true, explain: 'Vencimentos são ajustados em dias não úteis; rodar antes, com "vence dia 20", ou consultar a API de feriados resolve.' },
      ],
    },
    {
      id: 'au-02-06',
      title: 'Google Workspace e Microsoft 365 nos fluxos',
      minutes: 24,
      content: 'content/automacao/au-02/06-google-workspace-microsoft-365.md',
      exercises: [
        { type: 'mc', q: 'Qual é a melhor forma de evitar que o fluxo salve o mesmo anexo de e-mail várias vezes?', options: ['Rodar o fluxo só uma vez por dia', 'Aplicar um marcador "processado" e fazer o gatilho buscar só e-mails sem ele', 'Apagar o e-mail depois de salvar', 'Usar outra conta'], answer: 1, explain: 'O marcador funciona como o identificador de idempotência: o gatilho ignora o que já foi tratado.' },
        { type: 'fill', q: 'O padrão para salvar um arquivo na pasta do cliente é "procurar pasta pelo nome; se não existir, ___ e usar o ID da nova".', answer: ['criar', 'criar a pasta', 'criá-la', 'cria-la', 'criar uma', 'criar uma nova', 'criar nova', 'criar pasta', 'crie', 'crie a pasta'], explain: 'Procurar antes de criar evita pastas duplicadas e mantém a estrutura padronizada.' },
        { type: 'match', q: 'Relacione a operação ao app.', pairs: [['Baixar anexo e aplicar marcador', 'Gmail / Outlook'], ['Procurar pasta, senão criar', 'Drive / OneDrive'], ['Buscar linhas e atualizar linha pela chave', 'Sheets / Excel'], ['Criar evento de prazo com fuso', 'Calendar']], explain: 'Cada app do pacote tem operações típicas; combinados, cobrem o trânsito de documentos do escritório.' },
        { type: 'tf', q: 'O conector do Excel lê qualquer intervalo de células, sem necessidade de formatar os dados como tabela.', answer: false, explain: 'Na maioria dos conectores, o Excel exige que os dados estejam numa tabela formatada (Inserir → Tabela) para as linhas serem reconhecidas.' },
        { type: 'mc', q: 'O que é uma conta de serviço do Google?', options: ['A conta pessoal do sócio', 'Uma identidade "robô" com chave própria, com a qual você compartilha pastas e planilhas', 'Um plano pago do Workspace', 'O e-mail de suporte do Google'], answer: 1, explain: 'A conta de serviço não depende de uma pessoa e recebe acesso explícito ao que o fluxo precisa, aplicando o menor privilégio.' },
        { type: 'mc', q: 'Qual nome de arquivo segue a boa prática de ordenar sozinho por período?', options: ['NF_cliente_marco.pdf', 'nota fiscal (1).pdf', '2026-03_NF_12345678000190_001.pdf', 'NF 12345678000190 03-2026.pdf'], answer: 2, explain: 'Começar por ano-mês faz a ordem alfabética coincidir com a cronológica e facilita buscas.' },
        { type: 'tf', q: 'Se o fluxo "não enxerga" uma pasta do Drive, a causa mais comum é a pasta não estar compartilhada com a conta que o fluxo usa.', answer: true, explain: 'Permissão é o motivo de 90% desses erros; compartilhe só o necessário com a conta de automação.' },
      ],
    },
    {
      id: 'au-02-07',
      title: 'WhatsApp e comunicação',
      minutes: 27,
      content: 'content/automacao/au-02/07-whatsapp-e-comunicacao.md',
      exercises: [
        { type: 'mc', q: 'Qual é o principal risco de usar uma solução não oficial de automação do WhatsApp no número principal do escritório?', options: ['Custo alto', 'Banimento do número, com perda das conversas', 'Mensagens com atraso de minutos', 'Exigência de template'], answer: 1, explain: 'Soluções não oficiais violam os termos do WhatsApp e o número pode ser banido sem aviso.' },
        { type: 'fill', q: 'Na API oficial do WhatsApp, uma mensagem ativa (iniciada pela empresa) só pode ser enviada usando um ___ aprovado pela Meta.', answer: ['template', 'modelo', 'modelo de mensagem'], explain: 'Templates são modelos com variáveis, submetidos e aprovados antes do uso; mensagens livres só dentro da janela de atendimento.' },
        { type: 'tf', q: 'Um BSP é uma empresa parceira da Meta que revende o acesso à API oficial do WhatsApp com painel e suporte.', answer: true, explain: 'Business Solution Providers facilitam o acesso à API oficial, inclusive com cobrança em reais.' },
        { type: 'match', q: 'Relacione a situação ao canal mais indicado.', pairs: [['Alerta interno de falha, por bot gratuito para a equipe', 'Telegram'], ['Lembrete com PDF da guia em anexo', 'E-mail'], ['Cliente que só responde no WhatsApp, com opt-in', 'WhatsApp API oficial'], ['Canal de contingência curto', 'SMS']], explain: 'Cada canal tem custo, alcance e limitações; o lembrete completo costuma combinar e-mail e WhatsApp oficial.' },
        { type: 'mc', q: 'O que é opt-in no contexto de mensagens automáticas?', options: ['O token da API', 'A janela de 24 horas', 'O consentimento registrado do cliente para receber mensagens', 'O nome do template'], answer: 2, explain: 'Sem opt-in, o envio fere a LGPD e as regras da Meta, e gera denúncias e bloqueios.' },
        { type: 'mc', q: 'Por que e-mails automáticos podem cair em spam mesmo com conteúdo legítimo?', options: ['Porque o domínio não tem SPF, DKIM e DMARC configurados', 'Porque têm anexo', 'Porque foram enviados de manhã', 'Porque usam template'], answer: 0, explain: 'Essas configurações de DNS autenticam o remetente; sem elas, os provedores desconfiam da mensagem.' },
        { type: 'order', q: 'Ordene os blocos do fluxo de lembretes de obrigações.', items: ['Agendamento em dia útil, 9h, 3 dias antes do vencimento', 'Buscar obrigações pendentes do mês', 'Iterador', 'Buscar cliente pelo CNPJ (canal, opt-in)', 'Roteador por canal', 'Enviar pelo canal da rota', 'Registrar no log'], explain: 'Agendamento, leitura, iteração, enriquecimento, decisão, ação e registro.' },
        { type: 'tf', q: 'É boa prática enviar nas mensagens automáticas o valor da guia e os dados bancários completos do escritório, para facilitar o pagamento.', answer: false, explain: 'Mensagens podem ser encaminhadas; envie só o necessário e nunca dados sensíveis ou bancários completos.' },
      ],
    },
    {
      id: 'au-02-08',
      title: 'Tratamento de erros, documentação e boas práticas',
      minutes: 27,
      content: 'content/automacao/au-02/08-erros-documentacao-boas-praticas.md',
      exercises: [
        { type: 'match', q: 'Relacione o handler de erro ao uso.', pairs: [['Ignorar', 'Cliente sem e-mail: pula e segue com os demais'], ['Retentar', 'API lenta ou erro 5xx'], ['Interromper', 'Falha que precisa de intervenção humana'], ['Retomar', 'CEP não encontrado: segue sem endereço']], explain: 'Cada handler responde a um tipo de falha; escolher o errado duplica envios ou esconde problemas.' },
        { type: 'tf', q: 'Sem handler de erro, muitas ferramentas param a execução e, após falhas seguidas, desativam o fluxo.', answer: true, explain: 'Por isso um fluxo sem tratamento pode parar em silêncio; handlers e alertas evitam o susto.' },
        { type: 'mc', q: 'Qual condição é necessária antes de configurar retentativas em um módulo que envia mensagens?', options: ['Ter mais operações no plano', 'Garantir idempotência, com verificação prévia por identificador', 'Usar o Zapier', 'Desativar o log'], answer: 1, explain: 'Sem idempotência, cada retentativa pode reenviar a mensagem ao cliente.' },
        { type: 'fill', q: 'Um fluxo diário que confere no log se os fluxos críticos rodaram e avisa quando algum ficou em silêncio é chamado de fluxo ___.', answer: ['sentinela', 'de vigilância', 'vigia'], explain: 'Ele detecta a falha mais silenciosa: o fluxo que simplesmente não rodou.' },
        { type: 'mc', q: 'Qual nome de fluxo segue a boa prática de nomenclatura?', options: ['Cenário 3', 'Teste final v2 novo', 'FISCAL Lembrete DAS - dia 18 -> e-mail/WhatsApp (v03)', 'fluxo_bom'], answer: 2, explain: 'Área, processo, gatilho, resultado e versão dizem o que o fluxo faz sem precisar abri-lo.' },
        { type: 'mc', q: 'Um fluxo de 6 módulos (gatilho que lê a planilha, iterador e mais 4 módulos) roda uma vez por dia com 60 clientes. Quantas operações por dia, aproximadamente?', options: ['6', '60', '301', '360'], answer: 2, explain: '1 (gatilho/leitura, roda uma vez) + 5 × 60 (iterador e os 4 módulos seguintes rodam uma vez por cliente) = 301; iteradores multiplicam as operações seguintes.' },
        { type: 'order', q: 'Ordene os passos para alterar com segurança um fluxo em produção.', items: ['Exportar o JSON atual como backup', 'Duplicar o fluxo e trabalhar na cópia', 'Testar a cópia com dados de exemplo', 'Trocar a cópia pela versão em produção', 'Atualizar a documentação e a versão no nome'], explain: 'Backup, cópia, teste, troca e documentação evitam quebrar o que funcionava.' },
        { type: 'tf', q: 'Hospedar o n8n por conta própria é sempre a opção mais barata para um escritório pequeno.', answer: false, explain: 'Sem alguém técnico, a manutenção do servidor custa mais tempo do que a assinatura em nuvem; o self-hosted vale com volume alto e dados sensíveis.' },
      ],
    },
    {
      id: 'au-02-09',
      title: 'Projeto guiado: Onboarding de cliente',
      minutes: 26,
      content: 'content/automacao/au-02/09-projeto-onboarding.md',
      exercises: [
        { type: 'order', q: 'Ordene os blocos principais do fluxo de onboarding.', items: ['Gatilho: formulário respondido', 'Normalizar CNPJ, e-mail e nome', 'Buscar cliente na planilha (idempotência)', 'Consultar CNPJ na BrasilAPI', 'Procurar ou criar pastas no Drive', 'Adicionar linha na planilha de clientes', 'Enviar boas-vindas por e-mail ou WhatsApp', 'Criar tarefa e registrar no log'], explain: 'Normalizar e verificar duplicidade vêm antes de qualquer ação que crie algo; comunicação e tarefa fecham o processo.' },
        { type: 'mc', q: 'Por que o fluxo busca o CNPJ na planilha antes de consultar a API e criar pastas?', options: ['Para gastar menos operações da API', 'Para garantir idempotência: um cadastro repetido não cria pastas e linhas duplicadas', 'Porque a planilha é mais rápida', 'Porque a API exige'], answer: 1, explain: 'A verificação prévia por identificador (CNPJ) é o que permite o fluxo rodar de novo sem duplicar nada.' },
        { type: 'tf', q: 'Se a BrasilAPI devolver 404, o fluxo deve parar completamente e não cadastrar o cliente.', answer: false, explain: 'No projeto, o 404 segue com o nome do formulário e situação "não encontrado", e alerta o responsável para conferir.' },
        { type: 'fill', q: 'A rota de WhatsApp só deve ser usada se o campo ___ do cadastro estiver marcado como "sim"; caso contrário, cai no e-mail.', answer: ['opt_in', 'opt-in', 'optin', 'opt in', 'aceite'], explain: 'O consentimento registrado é exigência da LGPD e das regras da Meta.' },
        { type: 'match', q: 'Relacione o caso de teste ao resultado esperado.', pairs: [['Mesmo CNPJ enviado duas vezes', 'Rota duplicado: nada criado, alerta'], ['CNPJ inválido', 'Rota 404: cadastro com "não encontrado" e alerta'], ['E-mail em branco', 'Handler ignora o envio, registra no log, resto conclui'], ['URL da API errada de propósito', 'Alerta de erro, nada criado']], explain: 'Cada caso valida um ramo do fluxo; só com todos passando o fluxo vai para produção.' },
        { type: 'mc', q: 'O fluxo criou duas pastas para o mesmo cliente nos testes. Qual é a causa mais provável?', options: ['A API devolveu dois CNPJs', 'O Drive não permite procurar pastas', 'O nome usado na busca tinha diferença de espaço ou maiúscula em relação à pasta existente', 'O iterador rodou duas vezes'], answer: 2, explain: 'A busca por nome é sensível a pequenas diferenças; normalize o nome ou use o ID guardado na planilha.' },
        { type: 'write', q: 'Projeto: monte o fluxo de onboarding, execute os oito casos de teste e avalie-o pela rubrica. Escreva aqui: a pontuação por critério (0 a 2), o total, os casos de teste que falharam na primeira tentativa e o que você corrigiu.', model: 'Pontuação: gatilho e normalização 2; idempotência 2; consulta CNPJ 2; pastas 1 (criou duplicata no teste 7, corrigi normalizando o nome com trim); planilha 2; comunicação 2; tarefa 2; tratamento de erros 1 (faltava retentativa no Drive, adicionada); log 2; testes 2; nome e documentação 2; LGPD e segurança 2. Total: 22/24. Falhas na primeira rodada: casos 5 e 7. Correções: handler "ignorar e registrar" no e-mail; trim no nome da pasta. Fluxo ativado em produção após a segunda rodada com os oito casos passando.', checklist: ['Executou os oito casos de teste e registrou o resultado de cada um?', 'Pontuou os doze critérios da rubrica com justificativa?', 'Atingiu pelo menos 18 de 24?', 'Corrigiu as falhas encontradas e testou de novo?', 'Exportou o JSON e escreveu a página de documentação?', 'O fluxo usa conta dedicada, credenciais no cofre e opt-in registrado?'] },
      ],
    },
  ],
  exam: {
    passScore: 70,
    questions: [
      { type: 'mc', q: 'Num fluxo, o bloco que define "quando acontece X" é:', options: ['A ação', 'O gatilho', 'A conexão', 'O agregador'], answer: 1, explain: 'O gatilho inicia o fluxo; só existe um por fluxo.' },
      { type: 'tf', q: 'Numa ferramenta que cobra por operação, um iterador de 50 itens multiplica as operações dos módulos seguintes.', answer: true, explain: 'Cada item faz os módulos seguintes rodarem de novo; 50 itens × 3 módulos = 150 operações.' },
      { type: 'mc', q: 'Ao configurar a ação "adicionar linha" do Google Sheets, o que a ferramenta usa para mostrar um campo mapeável para cada coluna?', options: ['O cabeçalho da linha 1 da aba selecionada', 'O nome do arquivo da planilha', 'Os campos do formulário', 'O histórico de execuções'], answer: 0, explain: 'O módulo lê o cabeçalho da aba e cria um campo por coluna; por isso o cabeçalho deve estar pronto antes e, se mudar, o módulo precisa ser reaberto.' },
      { type: 'mc', q: 'Qual bloco cria vários caminhos no fluxo, com uma rota padrão para o que não casa com nenhuma condição?', options: ['Filtro', 'Iterador', 'Roteador', 'Agregador'], answer: 2, explain: 'O roteador (ou IF/Switch) bifurca o fluxo; a rota padrão captura o inesperado.' },
      { type: 'fill', q: 'Para comparar o regime de forma estável, use lower(___(regime)) = "simples nacional".', answer: ['trim'], explain: 'trim remove espaços das pontas; lower padroniza maiúsculas.' },
      { type: 'mc', q: 'No módulo HTTP, o que faz a opção de "parse" da resposta?', options: ['Envia a requisição duas vezes', 'Autentica com OAuth', 'Apaga o corpo', 'Converte o JSON da resposta em campos mapeáveis'], answer: 3, explain: 'Sem parse, a resposta é um texto único; com parse, cada campo do JSON vira um campo do fluxo.' },
      {
        type: 'code',
        q: 'Escreva a função so_digitos(cnpj) que devolve apenas os dígitos de um CNPJ formatado, como "12.345.678/0001-90" → "12345678000190".',
        starter: `import re

def so_digitos(cnpj):
    pass
`,
        tests: `assert so_digitos("12.345.678/0001-90") == "12345678000190", "deveria devolver só os 14 dígitos"
assert so_digitos("04.690.098/0001-07") == "04690098000107", "deve manter o zero à esquerda"
assert so_digitos("98765432000111") == "98765432000111", "CNPJ já limpo deve ficar igual"
`,
        solution: `import re

def so_digitos(cnpj):
    return re.sub(r"[^0-9]", "", cnpj)
`,
        hint: 're.sub com o padrão [^0-9] remove tudo que não é dígito.',
        explain: 'Essa limpeza é o passo obrigatório antes de montar a URL de consulta de CNPJ.',
      },
      { type: 'mc', q: 'Qual expressão cron dispara no dia 18 de cada mês às 9h?', options: ['9 18 * * *', '0 9 18 * *', '0 18 9 * *', '18 9 * * *'], answer: 1, explain: 'Minuto 0, hora 9, dia do mês 18, qualquer mês, qualquer dia da semana.' },
      { type: 'tf', q: 'Configurar o fuso America/Sao_Paulo na ferramenta faz os agendamentos e as funções de data usarem o horário de Brasília.', answer: true, explain: 'Sem isso, o fluxo pode rodar em UTC e disparar três horas fora do esperado.' },
      { type: 'mc', q: 'Qual prática evita que o fluxo processe o mesmo e-mail com anexo várias vezes?', options: ['Apagar a caixa de entrada', 'Aplicar um marcador "processado" e filtrar o gatilho por e-mails sem ele', 'Rodar o fluxo uma vez por semana', 'Usar SMS'], answer: 1, explain: 'O marcador funciona como identificador de idempotência no e-mail.' },
      { type: 'match', q: 'Relacione o canal à característica.', pairs: [['WhatsApp API oficial', 'Exige template aprovado e opt-in'], ['Solução não oficial de WhatsApp', 'Risco de banimento do número'], ['Telegram', 'Bot gratuito, bom para alertas internos'], ['E-mail transacional', 'Precisa de SPF, DKIM e DMARC']], explain: 'Cada canal tem regras e riscos próprios; o WhatsApp oficial é o único seguro para clientes.' },
      { type: 'mc', q: 'Qual handler é adequado para "cliente sem e-mail cadastrado" num fluxo que envia lembretes a 60 clientes?', options: ['Interromper tudo', 'Retentar 10 vezes', 'Ignorar o item, registrar no log e seguir com os demais', 'Reverter a execução inteira'], answer: 2, explain: 'A falha é isolada e não compromete os outros clientes; ignorar com registro é o tratamento proporcional.' },
      { type: 'mc', q: 'Quando hospedar o n8n por conta própria tende a valer a pena?', options: ['Sempre, porque é grátis', 'Quando há volume alto, dados sensíveis e alguém para manter o servidor', 'Quando o escritório tem até cinco clientes', 'Quando ninguém da equipe é técnico'], answer: 1, explain: 'O self-hosted elimina o custo por execução, mas exige manutenção; só compensa com volume, sensibilidade de dados e capacidade técnica.' },
      { type: 'tf', q: 'No projeto de onboarding, a verificação do CNPJ na planilha antes de criar pastas garante que um cadastro repetido não duplique nada.', answer: true, explain: 'É a idempotência aplicada: o identificador do evento (CNPJ) decide se o fluxo deve agir ou não.' },
      { type: 'mc', q: 'O que deve constar na documentação de um fluxo para que outra pessoa consiga operá-lo?', options: ['Só o nome', 'A senha da conta de automação', 'Objetivo, gatilho, entradas, saídas, conexões, tratamento de erros, dados pessoais, responsável e última alteração', 'O número de operações do mês'], answer: 2, explain: 'Esses itens permitem que quem não construiu o fluxo entenda, opere e corrija sem depender do autor.' },
    ],
  },
});
