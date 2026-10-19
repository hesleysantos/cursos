registerModule({
  course: 'vibecoding',
  id: 'vc-06',
  order: 6,
  level: 'Especialista',
  title: 'Agentes, produto e carreira',
  description: 'Você vai entender e construir agentes de IA, assistentes personalizados e bases de conhecimento com RAG, chamar modelos pela API com saídas estruturadas, medir a confiabilidade do que construiu e tratar ética, licenças e regulação com segurança. Fecha com produto, precificação, portfólio e um projeto final: um assistente e um app publicados.',
  hours: 13,
  lessons: [
    {
      id: 'vc-06-01',
      title: 'Agentes de IA: ferramentas, MCP e supervisão',
      minutes: 25,
      content: 'content/vibecoding/vc-06/01-agentes-de-ia.md',
      exercises: [
        { type: 'mc', q: 'O que diferencia um agente de um workflow?', options: ['O agente não usa modelo de linguagem', 'No agente, o modelo escolhe os passos para atingir um objetivo; no workflow, os passos são fixos', 'O workflow é sempre mais caro', 'O agente não pode usar ferramentas'], answer: 1, explain: 'O workflow segue uma sequência definida por você; o agente recebe um objetivo e ferramentas e decide sozinho a ordem e o momento de parar.' },
        { type: 'tf', q: 'No function calling, o modelo executa diretamente a função que escolheu.', answer: false, explain: 'O modelo apenas pede a chamada com os parâmetros; o seu código decide se executa e devolve o resultado. Esse é o ponto de controle.' },
        { type: 'order', q: 'Ordene o ciclo de uma chamada de ferramenta (function calling).', items: ['Programa envia ao modelo a pergunta do usuário e a lista de ferramentas disponíveis', 'Modelo responde com um pedido estruturado de chamada (nome e parâmetros)', 'Programa decide, executa a função e devolve o resultado ao modelo', 'Modelo lê o resultado e responde em linguagem natural'], explain: 'As ferramentas vão junto com a pergunta; o modelo só pede; o programa executa; o modelo redige a resposta final com o resultado.' },
        { type: 'fill', q: 'O ___ (sigla) é o padrão aberto que permite a um sistema expor suas ferramentas uma vez para qualquer assistente compatível.', answer: ['MCP', 'Model Context Protocol'], explain: 'O Model Context Protocol padroniza a conexão entre assistentes e ferramentas, como uma tomada universal.' },
        { type: 'mc', q: 'Qual destas ações deve ficar SEM autonomia para um agente no escritório?', options: ['Classificar anexos recebidos', 'Cruzar razão e extrato para levantar hipóteses', 'Transmitir uma declaração ao fisco', 'Montar um resumo para reunião'], answer: 2, explain: 'Ações irreversíveis e com consequência legal exigem confirmação humana; o agente prepara, a pessoa confirma.' },
        { type: 'match', q: 'Relacione a falha típica de agentes à sua proteção.', pairs: [['Loop de tentativas repetidas', 'Número máximo de passos'], ['Ação irreversível por engano', 'Confirmação humana nas ferramentas de escrita'], ['Instruções escondidas num documento lido', 'Tratar conteúdo lido como dado, não como ordem'], ['Gasto descontrolado', 'Teto de custo definido']], explain: 'Cada modo de falha tem uma proteção de desenho; supervisão é construir o agente para pedir confirmação nos pontos certos.' },
        { type: 'mc', q: 'Por que a descrição de uma ferramenta deve dizer "use quando…"?', options: ['Porque é obrigatório pelo MCP', 'Porque é a descrição que o modelo lê para decidir quando chamar a ferramenta', 'Porque melhora a velocidade da API', 'Porque substitui os parâmetros'], answer: 1, explain: 'O modelo escolhe ferramentas pela descrição; uma descrição vaga gera chamadas na hora errada.' },
      ],
    },
    {
      id: 'vc-06-02',
      title: 'Assistentes personalizados sem código',
      minutes: 24,
      content: 'content/vibecoding/vc-06/02-assistentes-personalizados.md',
      exercises: [
        { type: 'mc', q: 'Quais são os três componentes de um assistente personalizado?', options: ['Logo, nome e cor', 'Instruções, base de conhecimento e ferramentas (opcionais)', 'Banco, backend e frontend', 'Prompt, senha e domínio'], answer: 1, explain: 'As instruções definem o comportamento, a base fornece o que ele sabe e as ferramentas permitem ações; os três ficam fixos para toda conversa.' },
        { type: 'match', q: 'Relacione o recurso ao provedor.', pairs: [['Projects', 'Claude'], ['Custom GPTs', 'ChatGPT'], ['Gems', 'Gemini']], explain: 'Os três têm a mesma ideia com nomes diferentes; detalhes e planos mudam, consulte a documentação atual.' },
        { type: 'match', q: 'Relacione o bloco das instruções ao que ele define.', pairs: [['Papel', 'Quem o assistente é e para quem responde'], ['Formato', 'Tamanho, idioma e citação da resposta'], ['Limites', 'O que ele não faz e para quem encaminhar'], ['Exemplo', 'Pergunta e resposta modelo que mostram o tom']], explain: 'Papel diz quem ele é; formato padroniza; limites impedem conselhos indevidos; o exemplo mostra o tom melhor do que adjetivos. O bloco de fontes, o quinto, é o que evita invenção.' },
        { type: 'tf', q: 'Um PDF escaneado sem OCR funciona bem como base de conhecimento, porque o assistente lê imagens.', answer: false, explain: 'Sem OCR o PDF é só imagem; o assistente não encontra o texto. Use arquivos de texto ou PDFs gerados digitalmente.' },
        { type: 'fill', q: 'O bloco de ___ das instruções é o que manda o assistente responder apenas com base nos arquivos e admitir quando não encontra.', answer: ['fontes'], explain: 'O bloco de fontes é a principal defesa contra invenção; sem ele, o modelo completa com o que acha plausível.' },
        { type: 'mc', q: 'Por que o teste do assistente deve incluir perguntas cujas respostas NÃO estão nos arquivos?', options: ['Para gastar tokens', 'Para verificar se ele admite que não encontrou em vez de inventar', 'Porque o recurso exige', 'Para treinar o modelo'], answer: 1, explain: 'É o teste que revela invenção; um assistente que responde tudo com confiança, inclusive o que não sabe, não é confiável.' },
        { type: 'write', q: 'Escreva o bloco LIMITES das instruções de um assistente que responde dúvidas de clientes sobre prazos de obrigações do escritório.', model: 'LIMITES: não calcule nem informe valores de impostos; para isso, oriente a falar com o contador responsável. Não opine sobre legislação fora dos arquivos. Não acesse nem peça dados pessoais (CPF, senhas). Se a pergunta for sobre um caso específico do cliente, diga que o atendimento humano vai responder em até 1 dia útil.', checklist: ['Diz o que o assistente não faz?', 'Indica o caminho humano quando a pergunta sai do escopo?', 'Protege dados pessoais?'] },
      ],
    },
    {
      id: 'vc-06-03',
      title: 'RAG e bases de conhecimento',
      minutes: 25,
      content: 'content/vibecoding/vc-06/03-rag-e-bases-de-conhecimento.md',
      exercises: [
        { type: 'order', q: 'Ordene os três passos do RAG.', items: ['Recuperar os trechos mais relevantes para a pergunta', 'Montar o prompt com a pergunta e os trechos', 'Gerar a resposta citando os trechos'], explain: 'Recuperar, aumentar e gerar: o modelo lê só o que importa para aquela pergunta.' },
        { type: 'mc', q: 'O que é um embedding?', options: ['Um resumo do documento feito pelo modelo', 'Uma lista de números que representa o significado de um texto', 'Um tipo de PDF', 'Uma chave de API'], answer: 1, explain: 'Textos com sentido parecido têm embeddings próximos, mesmo com palavras diferentes; é o que permite a busca semântica.' },
        { type: 'tf', q: 'A busca semântica encontra "fechamento dos salários até o dia 25" quando alguém pergunta "prazo da folha", mesmo sem palavras em comum.', answer: true, explain: 'A comparação é por significado (embeddings), não por palavra exata; é a vantagem sobre a busca tradicional.' },
        { type: 'fill', q: 'Dividir os documentos em pedaços antes de gerar embeddings chama-se ___.', answer: ['chunking'], explain: 'O embedding de um documento inteiro é uma média sem sentido; pedaços por parágrafo ou seção, com sobreposição, dão busca útil.' },
        { type: 'mc', q: 'Qual pergunta NÃO é bem resolvida por RAG?', options: ['O que diz o contrato da Acme sobre reajuste?', 'Qual é a soma dos honorários mensais dos contratos ativos?', 'Qual é o prazo de fechamento da folha no manual?', 'Quais contratos mencionam IPCA?'], answer: 1, explain: 'Somar valores de muitos registros é cálculo sobre dados estruturados: pergunta para o banco (SQL), não para busca de trechos.' },
        { type: 'match', q: 'Relacione o tipo de pergunta à ferramenta adequada.', pairs: [['A resposta é um trecho de documento', 'RAG'], ['A resposta é um número calculado sobre muitos registros', 'Banco de dados (SQL)'], ['A resposta é uma síntese de todos os documentos', 'Leitura completa ou resumo em etapas'], ['A resposta muda a cada minuto (cotação)', 'Chamada a uma API']], explain: 'Saber qual ferramenta responde a qual pergunta é a competência central da lição.' },
        { type: 'mc', q: 'Por que guardar título do documento, seção e data junto de cada pedaço?', options: ['Para o arquivo ficar maior', 'Para o modelo citar a fonte e o usuário perceber uma versão desatualizada', 'Porque o embedding exige', 'Para acelerar o OCR'], answer: 1, explain: 'Sem esses dados o trecho vem solto; com eles, a resposta cita a fonte e uma tabela de 2025 é reconhecida como antiga.' },
      ],
    },
    {
      id: 'vc-06-04',
      title: 'Construindo com a API: prompts de sistema, JSON, custos e cache',
      minutes: 26,
      content: 'content/vibecoding/vc-06/04-construindo-com-a-api.md',
      exercises: [
        { type: 'mc', q: 'Qual é o papel do prompt de sistema em uma chamada à API?', options: ['Trazer o documento a ser analisado', 'Fixar papel, formato e limites que valem para todas as chamadas', 'Definir o preço por token', 'Substituir a chave da API'], answer: 1, explain: 'O sistema concentra as regras fixas; a mensagem do usuário traz o conteúdo variável. Isso permite reaproveitar e cachear o sistema.' },
        { type: 'tf', q: 'Se você pede JSON no prompt, não precisa validar a resposta no código.', answer: false, explain: 'O modelo pode responder fora do formato; a validação no código é o que impede o programa de quebrar.' },
        { type: 'fill', q: 'Para tarefas de extração e classificação, a ___ (parâmetro que controla a variação das respostas) deve ser baixa, próxima de zero.', answer: ['temperatura', 'temperature'], explain: 'Temperatura baixa torna a saída mais previsível, o que é desejável quando um programa vai consumir a resposta.' },
        { type: 'mc', q: 'Para que serve o streaming?', options: ['Reduzir o custo por token', 'Mostrar a resposta aparecendo aos poucos, melhorando a percepção de velocidade em chats', 'Garantir JSON válido', 'Evitar erros 429'], answer: 1, explain: 'Streaming não muda custo nem qualidade; serve para texto que uma pessoa lê enquanto é gerado, não para respostas que um programa valida.' },
        { type: 'mc', q: 'Por que o prompt de sistema longo deve vir ANTES do conteúdo variável na requisição?', options: ['Porque a API exige essa ordem', 'Porque o cache de prompt reaproveita a parte idêntica que vem primeiro', 'Porque o modelo lê de trás para frente', 'Porque reduz os tokens de saída'], answer: 1, explain: 'O cache atua sobre o prefixo repetido; se o conteúdo variável vier antes, nada é reaproveitado.' },
        { type: 'match', q: 'Relacione a alavanca de economia ao exemplo.', pairs: [['Modelo', 'Usar o mais barato que resolve a classificação'], ['Entrada', 'Mandar só as primeiras linhas do extrato'], ['Saída', 'Limitar max_tokens e pedir resposta curta'], ['Cache próprio', 'Guardar no banco o resultado de um documento já classificado']], explain: 'Quatro formas de reduzir custo, do maior impacto (modelo) ao mais simples (não perguntar duas vezes).' },
        {
          type: 'code',
          q: 'Escreva duas funções. montar_payload(modelo, sistema, texto) devolve um dicionário com as chaves "model" (modelo), "max_tokens" (300), "temperature" (0), "system" (sistema) e "messages" (lista com um único dicionário {"role": "user", "content": texto}). validar_classificacao(resposta) recebe uma string, tenta carregar como JSON e devolve a tupla (dados, None) se for um dicionário com "categoria" dentro de CATEGORIAS e "confianca" numérica entre 0 e 1; caso contrário devolve (None, mensagem de erro) com uma das mensagens: "resposta não é JSON válido", "categoria desconhecida", "confianca inválida".',
          starter: `import json

CATEGORIAS = {"nota_fiscal", "contrato", "extrato_bancario", "guia_imposto", "outro"}

def montar_payload(modelo, sistema, texto):
    pass

def validar_classificacao(resposta):
    pass
`,
          tests: `p = montar_payload("modelo-x", "Classifique.", "Texto do doc")
assert p["model"] == "modelo-x", "model deve ser o modelo informado"
assert p["max_tokens"] == 300 and p["temperature"] == 0, "max_tokens 300 e temperature 0"
assert p["system"] == "Classifique.", "system deve ser o prompt de sistema"
assert p["messages"] == [{"role": "user", "content": "Texto do doc"}], "messages com uma mensagem do usuário"
assert validar_classificacao('{"categoria": "contrato", "confianca": 0.9}') == ({"categoria": "contrato", "confianca": 0.9}, None), "JSON válido devolve (dados, None)"
assert validar_classificacao("Acho que é um contrato") == (None, "resposta não é JSON válido"), "texto livre não é JSON"
assert validar_classificacao('{"categoria": "boleto", "confianca": 0.5}') == (None, "categoria desconhecida"), "categoria fora da lista"
assert validar_classificacao('{"categoria": "outro", "confianca": 1.5}') == (None, "confianca inválida"), "confianca acima de 1"
assert validar_classificacao('{"categoria": "outro", "confianca": "alta"}') == (None, "confianca inválida"), "confianca em texto"
assert validar_classificacao('{"categoria": "outro"}') == (None, "confianca inválida"), "confianca ausente"
`,
          solution: `import json

CATEGORIAS = {"nota_fiscal", "contrato", "extrato_bancario", "guia_imposto", "outro"}

def montar_payload(modelo, sistema, texto):
    return {
        "model": modelo,
        "max_tokens": 300,
        "temperature": 0,
        "system": sistema,
        "messages": [{"role": "user", "content": texto}],
    }

def validar_classificacao(resposta):
    try:
        dados = json.loads(resposta)
    except json.JSONDecodeError:
        return None, "resposta não é JSON válido"
    if not isinstance(dados, dict) or dados.get("categoria") not in CATEGORIAS:
        return None, "categoria desconhecida"
    conf = dados.get("confianca")
    if not isinstance(conf, (int, float)) or isinstance(conf, bool) or not 0 <= conf <= 1:
        return None, "confianca inválida"
    return dados, None
`,
          hint: 'json.loads levanta json.JSONDecodeError quando o texto não é JSON; use try/except. Confira o tipo de confianca com isinstance antes de comparar com 0 e 1.',
          explain: 'Montar o payload e validar a resposta são as duas pontas de toda integração com LLM; validar sempre é o que impede uma resposta fora do formato de quebrar o app.',
        },
      ],
    },
    {
      id: 'vc-06-05',
      title: 'Avaliação e confiabilidade',
      minutes: 27,
      content: 'content/vibecoding/vc-06/05-avaliacao-e-confiabilidade.md',
      exercises: [
        { type: 'mc', q: 'Por que não se deve avaliar o classificador com os mesmos exemplos que estão no prompt?', options: ['Porque gasta mais tokens', 'Porque acertar um caso que o modelo já viu como exemplo não prova que ele generaliza', 'Porque a API não permite', 'Porque os exemplos são sempre fáceis'], answer: 1, explain: 'O conjunto de teste precisa ser independente dos exemplos do prompt; senão a métrica fica inflada.' },
        { type: 'tf', q: 'Um sistema que classifica todo documento como nota fiscal tem revocação perfeita para essa categoria.', answer: true, explain: 'Ele encontra todas as notas fiscais (revocação 100%), mas com precisão péssima, porque quase tudo que ele chama de nota fiscal não é.' },
        { type: 'match', q: 'Relacione a métrica à pergunta que ela responde.', pairs: [['Acurácia', 'De todos os casos, quantos o sistema acertou?'], ['Precisão', 'Quando o sistema diz que é X, quantas vezes é mesmo X?'], ['Revocação', 'De todos os X reais, quantos o sistema encontrou?']], explain: 'Acurácia é visão geral; precisão e revocação olham uma categoria por vez, e se tensionam.' },
        { type: 'fill', q: 'Verificações determinísticas feitas no código, fora do modelo, que bloqueiam saídas inaceitáveis chamam-se ___.', answer: ['guardrails', 'guardrail'], explain: 'Guardrails sempre fazem a mesma coisa (validar formato, listas permitidas, limites, confirmação de ações); são a camada que torna confiável o que o modelo sozinho não garante.' },
        { type: 'mc', q: 'Ao comparar dois prompts em um teste A/B, qual regra é essencial?', options: ['Usar conjuntos de teste diferentes para cada um', 'Mudar uma coisa por vez e usar o mesmo conjunto de teste', 'Trocar também o modelo para ver mais diferença', 'Olhar só três respostas na tela'], answer: 1, explain: 'Só com o mesmo conjunto e uma única mudança é possível atribuir a diferença de métrica à mudança feita.' },
        { type: 'mc', q: 'O que deve acontecer com cada correção feita pelo revisor humano?', options: ['Ser apagada para não poluir o log', 'Virar um caso novo no conjunto de teste', 'Ser enviada ao provedor de IA', 'Mudar a temperatura'], answer: 1, explain: 'As correções de produção são os casos mais valiosos: representam erros reais e fazem o conjunto crescer onde importa.' },
        {
          type: 'code',
          q: 'Escreva acuracia(esperado, previsto), que devolve a fração de posições em que as duas listas coincidem, e precisao(esperado, previsto, categoria), que devolve, entre os itens em que previsto é a categoria, a fração em que esperado também é (devolva 0.0 se o sistema nunca previu a categoria). As listas têm o mesmo tamanho.',
          starter: `def acuracia(esperado, previsto):
    pass

def precisao(esperado, previsto, categoria):
    pass
`,
          tests: `e = ["nf", "nf", "contrato", "extrato", "nf", "outro"]
p = ["nf", "contrato", "contrato", "extrato", "nf", "nf"]
assert abs(acuracia(e, p) - 4 / 6) < 1e-9, "4 acertos em 6"
assert acuracia(["a", "b"], ["a", "b"]) == 1.0, "tudo certo é 1.0"
assert acuracia(["a", "b"], ["b", "a"]) == 0.0, "tudo errado é 0.0"
assert abs(precisao(e, p, "nf") - 2 / 3) < 1e-9, "disse nf 3 vezes, acertou 2"
assert precisao(e, p, "contrato") == 0.5, "disse contrato 2 vezes, acertou 1 (precisão, não revocação)"
assert precisao(e, p, "extrato") == 1.0, "disse extrato 1 vez e acertou"
assert precisao(e, p, "outro") == 0.0, "nunca previu outro: 0.0"
`,
          solution: `def acuracia(esperado, previsto):
    acertos = sum(1 for e, p in zip(esperado, previsto) if e == p)
    return acertos / len(esperado)

def precisao(esperado, previsto, categoria):
    vp = sum(1 for e, p in zip(esperado, previsto) if p == categoria and e == categoria)
    fp = sum(1 for e, p in zip(esperado, previsto) if p == categoria and e != categoria)
    if vp + fp == 0:
        return 0.0
    return vp / (vp + fp)
`,
          hint: 'Use zip(esperado, previsto) para percorrer as duas listas juntas; conte verdadeiros positivos e falsos positivos.',
          explain: 'Acurácia é acertos sobre total; precisão é verdadeiros positivos sobre tudo que o sistema disse ser da categoria. Proteger a divisão por zero evita erro quando a categoria nunca é prevista.',
        },
      ],
    },
    {
      id: 'vc-06-06',
      title: 'Ética, propriedade intelectual e licenças',
      minutes: 25,
      content: 'content/vibecoding/vc-06/06-etica-propriedade-intelectual-e-licencas.md',
      exercises: [
        { type: 'mc', q: 'Qual é o principal risco de licença no código gerado por IA?', options: ['O provedor ser dono do seu app', 'Trechos ou dependências com licenças copyleft (GPL, AGPL) que impõem obrigações ao seu produto', 'Licenças MIT exigirem pagamento', 'Não poder usar o código comercialmente'], answer: 1, explain: 'Licenças permissivas pedem pouco; copyleft pode exigir abrir o seu código. É preciso olhar as licenças de trechos e dependências.' },
        { type: 'tf', q: 'Colar o extrato de um cliente em um chat gratuito para "só entender" é compatível com o sigilo profissional.', answer: false, explain: 'Planos gratuitos podem usar o conteúdo para treinar; dados de cliente só em serviços com compromisso de não treinamento, e minimizados.' },
        { type: 'match', q: 'Relacione o princípio à prática.', pairs: [['Minimização', 'Substituir CNPJ e nomes por "Empresa A" e "Empresa B" no prompt'], ['Transparência', 'Rotular "resumo gerado automaticamente"'], ['Responsabilidade profissional', 'Conferir e assinar o que a IA calculou'], ['Detecção de viés', 'Métricas por grupo de clientes']], explain: 'Cada princípio ético vira uma prática concreta no dia a dia do escritório.' },
        { type: 'fill', q: 'A lei europeia de IA, que classifica usos por nível de risco, é o ___ (nome em inglês, duas palavras).', answer: ['AI Act', 'EU AI Act', 'Artificial Intelligence Act'], explain: 'O AI Act impõe deveres crescentes conforme o risco e serve de referência para outras legislações, incluindo o projeto brasileiro.' },
        { type: 'mc', q: 'Por que decisões sobre crédito, contratação ou demissão não devem ser automatizadas por IA sem revisão humana?', options: ['Porque a IA é lenta', 'Porque afetam direitos das pessoas, podem reproduzir vieses e exigem base jurídica e explicação', 'Porque custam muitos tokens', 'Porque o AI Act proíbe qualquer uso de IA'], answer: 1, explain: 'Vieses dos dados de treinamento aparecem nessas decisões; a lei e a ética exigem revisão humana real e capacidade de explicar.' },
        { type: 'mc', q: 'Em uma fiscalização, qual é a resposta adequada sobre um cálculo automatizado?', options: ['"A IA fez"', 'Mostrar o registro do que foi automatizado e como foi conferido', 'Dizer que não se usa IA', 'Apresentar o prompt como laudo'], answer: 1, explain: 'A responsabilidade é de quem assina; a documentação do processo e da conferência é o que sustenta o trabalho.' },
        { type: 'write', q: 'Escreva o texto de um aviso curto (até 3 frases) para o portal do cliente, informando que os resumos de contrato são gerados por IA.', model: 'Este resumo foi gerado automaticamente por inteligência artificial a partir do documento original e pode conter imprecisões. Ele não substitui a leitura do contrato nem a orientação do contador responsável. Para dúvidas, clique em "Falar com o contador".', checklist: ['Diz claramente que foi gerado por IA?', 'Avisa que pode conter erros e aponta o documento original?', 'Oferece um caminho humano?'] },
      ],
    },
    {
      id: 'vc-06-07',
      title: 'Produto e negócio',
      minutes: 25,
      content: 'content/vibecoding/vc-06/07-produto-e-negocio.md',
      exercises: [
        { type: 'mc', q: 'Qual pergunta é mais útil para validar um problema em uma conversa com um usuário?', options: ['"Você usaria meu app?"', '"O que você fez da última vez que isso aconteceu?"', '"Você acha a ideia boa?"', '"Quanto você pagaria?"'], answer: 1, explain: 'Perguntas sobre o passado revelam comportamento real; perguntas hipotéticas recebem "sim" por educação.' },
        { type: 'tf', q: 'MVP é a versão com todas as funcionalidades, porém com visual simples.', answer: false, explain: 'MVP é a menor versão que resolve a tarefa central de ponta a ponta; funcionalidades extras ficam para depois de medir.' },
        { type: 'fill', q: 'Um sinal de que um problema é real é que alguém já ___ uma solução com o que tem à mão (planilha com macro, grupo de WhatsApp, estagiário dedicado) — complete com o verbo que a lição usa para esse "quebra-galho".', answer: ['improvisa', 'improvisou', 'improvisam', 'improvisaram'], explain: 'Solução improvisada mostra que a dor existe e indica o que o produto precisa fazer; se ninguém improvisa nada, talvez a dor não seja grande.' },
        { type: 'match', q: 'Relacione o modelo de cobrança à característica.', pairs: [['Por projeto (serviço)', 'Receita grande e irregular; paga antes'], ['Assinatura (SaaS)', 'Receita pequena e recorrente; paga depois'], ['Híbrido', 'Implantação paga mais mensalidade menor']], explain: 'Cada modelo troca risco por previsibilidade; o híbrido costuma agradar escritórios.' },
        { type: 'mc', q: 'Por que precificar um serviço feito com IA pelas horas gastas é um erro?', options: ['Porque a IA cobra por token', 'Porque as horas caem com a IA, mas o valor gerado para o cliente não', 'Porque o cliente nunca sabe as horas', 'Porque é proibido'], answer: 1, explain: 'O preço deve refletir o valor (tempo economizado, erros evitados); cobrar por hora penaliza a própria eficiência.' },
        { type: 'order', q: 'Ordene as etapas de validação do mais barato ao mais caro.', items: ['Conversas com quem tem o problema', 'Protótipo clicável', 'Landing page com lista de interesse ou pré-venda', 'Piloto com uma ou duas empresas'], explain: 'A ideia é errar barato: cada etapa custa mais e só é feita se a anterior confirmou interesse.' },
        { type: 'mc', q: 'Qual métrica é de "vaidade" e não deve orientar decisões?', options: ['Retenção no mês seguinte', 'Custo por cliente', 'Número de curtidas na landing page', 'Chamados de suporte por cliente'], answer: 2, explain: 'Curtidas e visitas não indicam uso nem receita; ativação, retenção, receita, custo e suporte indicam.' },
      ],
    },
    {
      id: 'vc-06-08',
      title: 'Portfólio, carreira e projeto final',
      minutes: 24,
      content: 'content/vibecoding/vc-06/08-portfolio-carreira-e-projeto-final.md',
      exercises: [
        { type: 'match', q: 'Relacione o caminho de carreira à sua descrição.', pairs: [['No-code builder', 'Sistemas internos e automações com pouco ou nenhum código'], ['AI engineer júnior', 'Aplicações com LLM: classificadores, RAG, agentes, avaliação'], ['Consultor de automação', 'Diagnostica processos, escolhe ferramentas, implanta e treina']], explain: 'Os três se combinam com a contabilidade; o diferencial do contador é conhecer o processo que automatiza.' },
        { type: 'mc', q: 'O que torna um portfólio convincente?', options: ['Muitos projetos, mesmo inacabados', 'Resultados medidos e decisões explicadas, com links que funcionam', 'Lista de ferramentas conhecidas', 'Certificados'], answer: 1, explain: '"Classificador com 92% de acurácia em 60 casos" diz mais do que dez projetos sem número; link que abre vale mais que certificado.' },
        { type: 'tf', q: 'Demos públicas do portfólio podem usar dados reais de clientes, desde que sejam poucos.', answer: false, explain: 'Dados de clientes nunca vão para demos públicas; use dados fictícios. É sigilo profissional e LGPD.' },
        { type: 'fill', q: 'Cada repositório do portfólio deve ter um ___ que diz o problema, a solução, a stack, como rodar e o que você aprendeu.', answer: ['README', 'README.md'], explain: 'O README é a porta de entrada do repositório; sem ele, ninguém entende o projeto nem consegue rodá-lo.' },
        { type: 'mc', q: 'Quais são os dois entregáveis do projeto final?', options: ['Um vídeo e um PDF', 'Um assistente com testes e métricas, e um app publicado com banco, auth e integração', 'Uma landing page e um currículo', 'Um agente autônomo e um boleto'], answer: 1, explain: 'O projeto final junta as duas metades do curso: assistente (instruções, base, avaliação) e app (RLS, integração, testes, deploy).' },
        { type: 'order', q: 'Ordene o ciclo de trabalho recomendado para o projeto final.', items: ['Escrever o PRD', 'Dividir em entregas pequenas', 'Gerar e rodar testes', 'Commit', 'Deploy'], explain: 'É o mesmo ciclo do módulo anterior: especificar, entregar pouco, testar, versionar, publicar.' },
        { type: 'write', q: 'Escreva a descrição de um projeto para a sua página de portfólio: uma linha de problema, uma de solução e uma de resultado medido.', model: 'Problema: o escritório controlava honorários em planilha e esquecia vencimentos. Solução: app Next.js + Supabase com clientes, contratos, faturas e painel de vencimentos, com RLS e testes. Resultado: cobrança semanal caiu de 2 horas para 20 minutos; zero faturas esquecidas em 3 meses.', checklist: ['O resultado tem um número?', 'A solução cabe em uma frase?', 'Há um link funcionando para a demo?'] },
      ],
    },
  ],
  exam: {
    passScore: 70,
    questions: [
      { type: 'mc', q: 'Em qual caso o modelo decide sozinho quais passos dar para atingir um objetivo?', options: ['Chat', 'Workflow', 'Agente', 'Prompt de sistema'], answer: 2, explain: 'O agente recebe objetivo e ferramentas e escolhe os passos; o workflow tem passos fixos; o chat só responde.' },
      { type: 'tf', q: 'O MCP torna um agente automaticamente seguro, porque padroniza as ferramentas.', answer: false, explain: 'O MCP padroniza a conexão; permissões, confirmação humana e limites continuam sendo responsabilidade de quem constrói.' },
      { type: 'fill', q: 'No function calling, quem executa de fato a função pedida pelo modelo é o seu ___, não o modelo.', answer: ['código', 'programa', 'backend', 'codigo'], explain: 'O modelo só pede a chamada; o código decide, executa e devolve o resultado. É o ponto de controle.' },
      { type: 'mc', q: 'Qual bloco das instruções de um assistente personalizado evita que ele invente procedimentos?', options: ['Papel', 'Fontes', 'Formato', 'Exemplo'], answer: 1, explain: 'O bloco de fontes manda responder só com base nos arquivos e admitir quando não encontra.' },
      { type: 'match', q: 'Relacione o termo à definição.', pairs: [['Embedding', 'Lista de números que representa o significado de um texto'], ['Chunking', 'Dividir documentos em pedaços antes de indexar'], ['RAG', 'Buscar trechos relevantes e gerar a resposta com eles'], ['Guardrail', 'Verificação determinística no código que bloqueia saídas inaceitáveis']], explain: 'Quatro conceitos centrais do módulo, cada um com papel distinto na construção de sistemas com IA.' },
      { type: 'mc', q: 'Qual pergunta deve ir para o banco de dados (SQL) em vez de RAG?', options: ['O que o manual diz sobre férias?', 'Qual o total em aberto de todos os clientes?', 'Qual cláusula fala de rescisão no contrato X?', 'Quais contratos mencionam IPCA?'], answer: 1, explain: 'Agregação sobre muitos registros é cálculo em dados estruturados; RAG busca trechos de texto.' },
      { type: 'tf', q: 'O cache de prompt reaproveita a parte idêntica que vem no início da requisição, por isso o prompt de sistema deve vir antes do conteúdo variável.', answer: true, explain: 'O cache atua sobre o prefixo repetido; com o sistema primeiro, milhares de chamadas reaproveitam o mesmo processamento.' },
      { type: 'mc', q: 'Um classificador acerta 45 de 50 casos, mas deixa passar 4 das 10 guias de imposto. Qual métrica revela esse problema?', options: ['Acurácia geral', 'Revocação da categoria guia_imposto', 'Número de tokens', 'Temperatura'], answer: 1, explain: 'A acurácia (90%) esconde o problema; a revocação de guia_imposto (60%) mostra que a categoria crítica escapa.' },
      { type: 'order', q: 'Ordene o fluxo de um teste A/B de prompts.', items: ['Montar um conjunto de teste rotulado por humanos', 'Rodar o prompt A e o prompt B sobre o mesmo conjunto', 'Comparar as métricas e o custo', 'Registrar a decisão com data e versão'], explain: 'Mesmo conjunto, uma mudança por vez, métricas registradas: é o que transforma opinião em decisão.' },
      { type: 'mc', q: 'Qual prática protege o sigilo profissional ao usar IA com documentos de clientes?', options: ['Usar o plano gratuito para economizar', 'Serviço com compromisso de não treinamento e minimização dos dados no prompt', 'Enviar o documento inteiro para melhor contexto', 'Guardar os prompts no GitHub público'], answer: 1, explain: 'Compromisso de não treinamento e substituição de nomes e CNPJ por marcadores reduzem a exposição dos dados do cliente.' },
      { type: 'tf', q: 'A responsabilidade pelo que o contador assina passa a ser do provedor de IA quando o cálculo foi gerado por um modelo.', answer: false, explain: 'A responsabilidade profissional permanece de quem assina; a IA é ferramenta, e a conferência é parte do trabalho.' },
      { type: 'mc', q: 'Qual é a definição correta de MVP?', options: ['Versão com todas as funcionalidades e visual simples', 'Menor versão que resolve a tarefa central de ponta a ponta', 'Protótipo sem backend', 'Versão gratuita do produto'], answer: 1, explain: 'O MVP já substitui o jeito antigo na tarefa principal; o resto vem depois de medir.' },
      { type: 'mc', q: 'Qual elemento do portfólio pesa mais para quem contrata?', options: ['Quantidade de repositórios', 'Resultado medido e link que funciona', 'Lista de cursos feitos', 'Número de seguidores'], answer: 1, explain: 'Evidência de entrega — projeto publicado, funcionando, com número — é o que o mercado compra.' },
      {
        type: 'code',
        q: 'Escreva a função revocacao(esperado, previsto, categoria): entre os itens em que esperado é a categoria, a fração em que previsto também é. Devolva 0.0 se a categoria não aparece em esperado.',
        starter: `def revocacao(esperado, previsto, categoria):
    pass
`,
        tests: `e = ["nf", "nf", "contrato", "extrato", "nf", "outro"]
p = ["nf", "contrato", "contrato", "extrato", "nf", "nf"]
assert abs(revocacao(e, p, "nf") - 2 / 3) < 1e-9, "3 nf reais, 2 encontradas"
assert revocacao(e, p, "contrato") == 1.0, "1 contrato real, encontrado"
assert revocacao(e, p, "outro") == 0.0, "1 outro real, não encontrado"
assert revocacao(e, p, "guia") == 0.0, "categoria ausente em esperado devolve 0.0"
`,
        solution: `def revocacao(esperado, previsto, categoria):
    vp = sum(1 for e, p in zip(esperado, previsto) if e == categoria and p == categoria)
    fn = sum(1 for e, p in zip(esperado, previsto) if e == categoria and p != categoria)
    if vp + fn == 0:
        return 0.0
    return vp / (vp + fn)
`,
        hint: 'Conte os verdadeiros positivos e os falsos negativos (era a categoria, mas o sistema não disse).',
        explain: 'Revocação mede quantos casos reais da categoria o sistema encontrou; é a métrica certa quando deixar passar custa caro.',
      },
      {
        type: 'code',
        q: 'Escreva a função extrair_json(resposta) que recebe a string devolvida por um modelo, tenta carregá-la como JSON e devolve o dicionário resultante; se não for JSON válido ou não for um dicionário, devolve None.',
        starter: `import json

def extrair_json(resposta):
    pass
`,
        tests: `assert extrair_json('{"categoria": "contrato"}') == {"categoria": "contrato"}, "JSON de objeto vira dicionário"
assert extrair_json("não é json") is None, "texto livre devolve None"
assert extrair_json('[1, 2, 3]') is None, "lista não é dicionário"
assert extrair_json('{"a": {"b": 1}}') == {"a": {"b": 1}}, "objetos aninhados são aceitos"
`,
        solution: `import json

def extrair_json(resposta):
    try:
        dados = json.loads(resposta)
    except json.JSONDecodeError:
        return None
    return dados if isinstance(dados, dict) else None
`,
        hint: 'json.loads dentro de try/except json.JSONDecodeError; depois confira isinstance(dados, dict).',
        explain: 'Validar que a resposta é um objeto JSON antes de usá-la é o guardrail mais básico de qualquer integração com LLM.',
      },
    ],
  },
});
