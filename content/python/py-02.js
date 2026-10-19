registerModule({
  course: 'python',
  id: 'py-02',
  order: 2,
  level: 'Básico',
  title: 'Estruturas de dados e repetição',
  description: 'Você vai aprender a repetir tarefas com while e for, a organizar dados em listas, tuplas, dicionários e conjuntos, a escrever comprehensions e a criar suas próprias funções. Ao final, vai montar um controle de despesas em memória com totais por categoria e relatório formatado.',
  hours: 5,
  lessons: [
    {
      id: 'py-02-01',
      title: 'Repetição com while',
      minutes: 32,
      content: 'content/python/py-02/01-while.md',
      exercises: [
        { type: 'mc', q: 'Quais são as três peças de um while bem construído?', options: ['def, return, print', 'Inicialização, condição e atualização', 'if, elif, else', 'lista, índice e append'], answer: 1, explain: 'Sem inicialização a condição falha; sem atualização a condição nunca muda e o laço não termina.' },
        { type: 'tf', q: 'O comando break encerra o programa inteiro.', answer: false, explain: 'break sai apenas do laço mais interno; o código depois do laço continua executando.' },
        { type: 'fill', q: 'Para pular o restante da volta atual e testar a condição de novo usamos ___.', answer: ['continue'], explain: 'continue abandona o resto do bloco nesta iteração e volta à condição do laço.' },
        {
          type: 'code',
          q: 'Escreva a função meses_para_quitar(saldo, parcela) que devolve quantos meses são necessários para zerar o saldo pagando a parcela todo mês (a última pode ser menor). Use while. Se o saldo já for 0 ou negativo, devolva 0.',
          starter: `def meses_para_quitar(saldo, parcela):
    meses = 0
    # complete com um while
    return meses
`,
          tests: `assert meses_para_quitar(5000, 1200) == 5, "5000 com parcelas de 1200 quita em 5 meses"
assert meses_para_quitar(1000, 1000) == 1, "1000 com parcela de 1000 quita em 1 mês"
assert meses_para_quitar(0, 100) == 0, "saldo zero não precisa de meses"
assert meses_para_quitar(2400, 1000) == 3, "2400 com parcelas de 1000 quita em 3 meses"
`,
          solution: `def meses_para_quitar(saldo, parcela):
    meses = 0
    while saldo > 0:
        saldo -= parcela
        meses += 1
    return meses
`,
          hint: 'Enquanto saldo > 0: subtraia a parcela e some 1 ao contador.',
          explain: 'O número de voltas depende do que acontece dentro do laço (o saldo diminuir), caso típico de while.',
        },
        {
          type: 'code',
          q: 'Escreva a função anos_para_dobrar(capital, taxa) que devolve em quantos anos o capital, rendendo taxa ao ano (decimal, ex.: 0.08), atinge pelo menos o dobro do valor inicial. Use while.',
          starter: `def anos_para_dobrar(capital, taxa):
    pass
`,
          tests: `assert anos_para_dobrar(10000, 0.08) == 10, "a 8% ao ano dobra em 10 anos"
assert anos_para_dobrar(1000, 0.10) == 8, "a 10% ao ano dobra em 8 anos"
assert anos_para_dobrar(100, 1.0) == 1, "a 100% ao ano dobra em 1 ano"
`,
          solution: `def anos_para_dobrar(capital, taxa):
    alvo = capital * 2
    anos = 0
    while capital < alvo:
        capital *= 1 + taxa
        anos += 1
    return anos
`,
          hint: 'Guarde o alvo (capital * 2) antes de começar a alterar capital.',
          explain: 'Calcule o alvo antes do laço; dentro dele, multiplique pelo fator (1 + taxa) e conte os anos até alcançar o alvo.',
        },
        { type: 'mc', q: 'Qual trecho gera um laço infinito?', options: ['n = 0\nwhile n < 5:\n    n += 1', 'n = 10\nwhile n > 0:\n    n += 1', 'while False:\n    print(1)', 'for i in range(3):\n    pass'], answer: 1, explain: 'n começa em 10 e só cresce; a condição n > 0 nunca fica falsa.' },
        { type: 'order', q: 'Ordene as linhas para somar só os valores positivos de uma lista com while, sem laço infinito.', items: ['i, total = 0, 0', 'while i < len(valores):', '    valor = valores[i]', '    i += 1', '    if valor <= 0:', '        continue', '    total += valor'], explain: 'Inicializações primeiro; dentro do laço, a atualização de i tem de vir antes do continue, senão nos valores não positivos o i nunca mudaria e o laço travaria.' },
        { type: 'tf', q: 'while True: com um break alcançável dentro é um padrão válido em Python.', answer: true, explain: 'É comum para "repetir até acontecer algo"; o break é a porta de saída.' },
      ],
    },
    {
      id: 'py-02-02',
      title: 'for, range e enumerate',
      minutes: 34,
      content: 'content/python/py-02/02-for-e-range.md',
      exercises: [
        { type: 'mc', q: 'Quais números range(1, 5) gera?', options: ['1, 2, 3, 4, 5', '0, 1, 2, 3, 4', '1, 2, 3, 4', '0, 1, 2, 3, 4, 5'], answer: 2, explain: 'range começa no início informado e para antes do fim: 1, 2, 3, 4.' },
        { type: 'fill', q: 'Para percorrer uma lista obtendo posição e item ao mesmo tempo usamos for i, item in ___(lista):', answer: ['enumerate'], explain: 'enumerate() produz pares (posição, item) que são desempacotados a cada volta.' },
        { type: 'tf', q: 'Em um laço aninhado, o laço interno roda completo a cada volta do laço externo.', answer: true, explain: 'Para cada iteração externa, o interno percorre todos os seus itens antes de o externo avançar.' },
        {
          type: 'code',
          q: 'Escreva a função soma_pares(n) que devolve a soma de todos os números pares de 0 até n (inclusive), usando for e range.',
          starter: `def soma_pares(n):
    pass
`,
          tests: `assert soma_pares(10) == 30, "0+2+4+6+8+10 = 30"
assert soma_pares(7) == 12, "0+2+4+6 = 12"
assert soma_pares(0) == 0, "soma_pares(0) deveria ser 0"
`,
          solution: `def soma_pares(n):
    total = 0
    for i in range(0, n + 1, 2):
        total += i
    return total
`,
          hint: 'range(0, n + 1, 2) gera só os pares; ou teste i % 2 == 0.',
          explain: 'O passo 2 do range gera só pares, e o fim n + 1 garante que n entre quando for par.',
        },
        {
          type: 'code',
          q: 'Escreva a função tabela_juros(capital, taxa, anos) que devolve uma lista com o montante ao final de cada ano (juros compostos), cada valor arredondado em 2 casas.',
          starter: `def tabela_juros(capital, taxa, anos):
    montantes = []
    # complete com um for
    return montantes
`,
          tests: `assert tabela_juros(10000, 0.08, 3) == [10800.0, 11664.0, 12597.12], "tabela de 3 anos a 8%"
assert tabela_juros(1000, 0.10, 1) == [1100.0], "1 ano a 10%"
assert tabela_juros(500, 0.05, 0) == [], "zero anos devolve lista vazia"
`,
          solution: `def tabela_juros(capital, taxa, anos):
    montantes = []
    for _ in range(anos):
        capital *= 1 + taxa
        montantes.append(round(capital, 2))
    return montantes
`,
          hint: 'A cada volta, multiplique o capital por (1 + taxa) e faça append do valor arredondado.',
          explain: 'O for com range(anos) repete exatamente anos vezes; a variável _ indica que a contagem em si não é usada.',
        },
        { type: 'mc', q: 'O que imprime o código: for n in range(10, 0, -3): print(n, end=" ")', options: ['10 7 4 1', '10 7 4', '0 3 6 9', '10 7 4 1 -2'], answer: 0, explain: 'Começa em 10, passo -3, para antes de 0: 10, 7, 4, 1.' },
        { type: 'order', q: 'Ordene as linhas para imprimir o total de notas de cada empresa (acumulador zerado por empresa).', items: ['for nome, lista in zip(empresas, notas):', '    total = 0', '    for valor in lista:', '        total += valor', '    print(nome, total)'], explain: 'total = 0 fica dentro do laço externo para reiniciar a cada empresa; o print vem depois do laço interno.' },
        {
          type: 'code',
          q: 'Escreva a função numerar(nomes) que devolve uma lista de strings no formato "1. Nome", "2. Nome", ... começando em 1, usando enumerate.',
          starter: `def numerar(nomes):
    pass
`,
          tests: `assert numerar(["Padaria", "Oficina"]) == ["1. Padaria", "2. Oficina"], "deveria numerar a partir de 1"
assert numerar([]) == [], "lista vazia devolve lista vazia"
assert numerar(["Ana"]) == ["1. Ana"], "um item recebe o número 1"
`,
          solution: `def numerar(nomes):
    resultado = []
    for i, nome in enumerate(nomes, start=1):
        resultado.append(f"{i}. {nome}")
    return resultado
`,
          hint: 'enumerate(nomes, start=1) e uma f-string.',
          explain: 'start=1 faz a contagem começar em 1, como as pessoas esperam em relatórios.',
        },
      ],
    },
    {
      id: 'py-02-03',
      title: 'Listas',
      minutes: 31,
      content: 'content/python/py-02/03-listas.md',
      exercises: [
        { type: 'mc', q: 'O que acontece em notas = notas.sort()?', options: ['notas fica ordenada', 'notas vira None', 'Gera TypeError', 'notas fica em ordem inversa'], answer: 1, explain: 'sort() ordena no lugar e devolve None; a atribuição apaga a lista. Use notas.sort() sozinho ou sorted().' },
        { type: 'tf', q: 'Depois de b = a, com a sendo uma lista, alterar b com append também altera a.', answer: true, explain: 'b = a não copia: os dois nomes apontam para a mesma lista. Para copiar use a.copy().' },
        { type: 'fill', q: 'Para remover e devolver o último item de uma lista usamos lista.___()', answer: ['pop'], explain: 'pop() sem argumento remove e devolve o último item; pop(i) faz o mesmo com a posição i.' },
        {
          type: 'code',
          q: 'Escreva a função acima_de(valores, limite) que devolve uma NOVA lista só com os valores maiores que limite, na ordem original. Use for e append.',
          starter: `def acima_de(valores, limite):
    pass
`,
          tests: `assert acima_de([1200, 15000, 300, 22000], 10000) == [15000, 22000], "deveria manter só 15000 e 22000"
assert acima_de([1, 2, 3], 10) == [], "nenhum acima devolve lista vazia"
assert acima_de([10, 20], 10) == [20], "valor igual ao limite não é maior que ele e fica de fora"
original = [5, 50, 500]
acima_de(original, 10)
assert original == [5, 50, 500], "a lista original não deve ser alterada"
`,
          solution: `def acima_de(valores, limite):
    resultado = []
    for v in valores:
        if v > limite:
            resultado.append(v)
    return resultado
`,
          hint: 'Comece com uma lista vazia e faça append dos que passam no if.',
          explain: 'Construir uma lista nova em vez de remover da original evita o bug de pular itens ao alterar a lista durante o laço.',
        },
        { type: 'mc', q: 'Qual a diferença entre lista.append([1, 2]) e lista.extend([1, 2])?', options: ['Nenhuma', 'append adiciona a lista como um único item; extend adiciona cada elemento', 'extend adiciona a lista como um único item; append adiciona cada elemento', 'append só aceita números'], answer: 1, explain: 'append([1, 2]) cria uma lista dentro da lista; extend([1, 2]) acrescenta 1 e 2 separadamente.' },
        { type: 'tf', q: 'sorted(lista) altera a lista original.', answer: false, explain: 'sorted() devolve uma nova lista ordenada e deixa a original intacta; quem altera no lugar é lista.sort().' },
        {
          type: 'code',
          q: 'Escreva a função copiar_e_ordenar(lista) que devolve uma CÓPIA ordenada da lista sem alterar a original (a cópia deve ser um objeto diferente).',
          starter: `def copiar_e_ordenar(lista):
    pass
`,
          tests: `original = [3, 1, 2]
resultado = copiar_e_ordenar(original)
assert resultado == [1, 2, 3], "a cópia deve estar ordenada"
assert original == [3, 1, 2], "a lista original não deve mudar"
assert resultado is not original, "deve ser um objeto diferente do original"
`,
          solution: `def copiar_e_ordenar(lista):
    return sorted(lista)
`,
          hint: 'sorted() já devolve uma lista nova; ou use lista.copy() e depois sort().',
          explain: 'sorted() cria uma lista nova; a original continua igual e is confirma que são objetos distintos.',
        },
        { type: 'order', q: 'Ordene as linhas para encontrar a posição da maior nota com enumerate.', items: ['maior_pos = 0', 'for i, valor in enumerate(notas):', '    if valor > notas[maior_pos]:', '        maior_pos = i', 'print(maior_pos)'], explain: 'Começa assumindo a posição 0 como maior e atualiza quando encontra um valor maior.' },
      ],
    },
    {
      id: 'py-02-04',
      title: 'Tuplas e desempacotamento',
      minutes: 34,
      content: 'content/python/py-02/04-tuplas.md',
      exercises: [
        { type: 'mc', q: 'Qual expressão cria uma tupla com um único item?', options: ['(5)', '[5]', '(5,)', 'tuple(5)'], answer: 2, explain: 'A vírgula define a tupla; (5) é só o inteiro 5 entre parênteses.' },
        { type: 'tf', q: 'É possível fazer t[0] = 10 em uma tupla t.', answer: false, explain: 'Tuplas são imutáveis: atribuir a uma posição gera TypeError.' },
        { type: 'fill', q: 'A linha a, b = b, a faz a ___ dos valores das duas variáveis.', answer: ['troca', 'inversão', 'permuta'], explain: 'O lado direito cria a tupla (b, a) antes da atribuição, então os valores são trocados sem variável temporária.' },
        {
          type: 'code',
          q: 'Escreva a função dividir_com_resto(a, b) que devolve a tupla (quociente inteiro, resto).',
          starter: `def dividir_com_resto(a, b):
    pass
`,
          tests: `assert dividir_com_resto(1000, 350) == (2, 300), "1000 = 2*350 + 300"
assert dividir_com_resto(17, 5) == (3, 2), "17 = 3*5 + 2"
assert dividir_com_resto(10, 5) == (2, 0), "10 = 2*5 + 0"
q, r = dividir_com_resto(7, 2)
assert q == 3 and r == 1, "o resultado deve poder ser desempacotado em duas variáveis"
`,
          solution: `def dividir_com_resto(a, b):
    return a // b, a % b
`,
          hint: 'return a // b, a % b',
          explain: 'Separar por vírgula no return cria uma tupla; quem chama pode desempacotar em duas variáveis.',
        },
        {
          type: 'code',
          q: 'Escreva a função totais_folha(folha) que recebe uma lista de tuplas (nome, salario, dependentes) e devolve a tupla (total_salarios, total_dependentes). Use desempacotamento no for.',
          starter: `def totais_folha(folha):
    pass
`,
          tests: `folha = [("Maria", 3500.00, 2), ("João", 4200.00, 0), ("Ana", 2900.00, 1)]
assert totais_folha(folha) == (10600.0, 3), "total de salários 10600.0 e 3 dependentes"
assert totais_folha([]) == (0, 0), "folha vazia devolve (0, 0)"
`,
          solution: `def totais_folha(folha):
    total_salarios = 0
    total_dependentes = 0
    for nome, salario, dependentes in folha:
        total_salarios += salario
        total_dependentes += dependentes
    return total_salarios, total_dependentes
`,
          hint: 'for nome, salario, dependentes in folha: acumule os dois totais.',
          explain: 'Cada tupla da lista é desempacotada em três variáveis a cada volta, dispensando índices como linha[1].',
        },
        {
          type: 'code',
          q: 'Escreva a função estatisticas(valores) que devolve a tupla (soma, menor, maior, media) usando sum, min, max e len. A média deve ser arredondada em 2 casas.',
          starter: `def estatisticas(valores):
    pass
`,
          tests: `assert estatisticas([1200, 850, 4500, 300]) == (6850, 300, 4500, 1712.5), "estatisticas de [1200, 850, 4500, 300]"
assert estatisticas([10]) == (10, 10, 10, 10.0), "lista de um item"
assert estatisticas([1, 2]) == (3, 1, 2, 1.5), "media de 1 e 2 é 1.5"
soma, menor, maior, media = estatisticas([4, 6])
assert (soma, menor, maior, media) == (10, 4, 6, 5.0), "o resultado deve poder ser desempacotado em quatro variáveis"
`,
          solution: `def estatisticas(valores):
    soma = sum(valores)
    media = round(soma / len(valores), 2)
    return soma, min(valores), max(valores), media
`,
          hint: 'return soma, min(valores), max(valores), media devolve uma tupla.',
          explain: 'As funções embutidas resolvem cada pergunta em uma chamada; a vírgula no return agrupa os quatro valores em uma tupla, que quem chama pode desempacotar.',
        },
        { type: 'mc', q: 'Em numero, valor, *detalhes = ["NF 1", 100, "pago", "boleto"], o que detalhes recebe?', options: ['"pago"', '("pago", "boleto")', '["pago", "boleto"]', 'Erro'], answer: 2, explain: 'A variável com * recebe uma lista com todos os itens restantes.' },
        { type: 'order', q: 'Ordene as linhas para somar os salários de uma lista de tuplas (nome, salario).', items: ['total = 0', 'for nome, salario in folha:', '    total += salario', 'print(f"Total: {total:.2f}")'], explain: 'Acumulador inicializado antes, desempacotamento no for, soma dentro, exibição depois.' },
      ],
    },
    {
      id: 'py-02-05',
      title: 'Dicionários',
      minutes: 33,
      content: 'content/python/py-02/05-dicionarios.md',
      exercises: [
        { type: 'mc', q: 'O que acontece ao acessar d["email"] quando a chave não existe?', options: ['Devolve None', 'Devolve ""', 'Gera KeyError', 'Cria a chave com valor None'], answer: 2, explain: 'Colchetes exigem que a chave exista; para um padrão sem erro use d.get("email").' },
        { type: 'tf', q: 'Em um dicionário, "x" in d testa se "x" é um dos valores.', answer: false, explain: 'in testa as chaves. Para valores, use "x" in d.values().' },
        { type: 'fill', q: 'Para percorrer chaves e valores juntos: for chave, valor in d.___():', answer: ['items'], explain: 'items() entrega tuplas (chave, valor) desempacotadas a cada volta.' },
        {
          type: 'code',
          q: 'Escreva a função contar(itens) que recebe uma lista e devolve um dicionário com quantas vezes cada item aparece (padrão contador).',
          starter: `def contar(itens):
    pass
`,
          tests: `assert contar(["Aluguel", "Energia", "Aluguel", "Material", "Energia", "Aluguel"]) == {"Aluguel": 3, "Energia": 2, "Material": 1}, "contagem por categoria"
assert contar([]) == {}, "lista vazia devolve dicionário vazio"
assert contar(["NFe"]) == {"NFe": 1}, "um item conta 1"
`,
          solution: `def contar(itens):
    contagem = {}
    for item in itens:
        contagem[item] = contagem.get(item, 0) + 1
    return contagem
`,
          hint: 'contagem[item] = contagem.get(item, 0) + 1',
          explain: 'get(item, 0) devolve a contagem atual ou 0 na primeira vez; somar 1 e gravar cobre os dois casos sem if.',
        },
        {
          type: 'code',
          q: 'Escreva a função somar_por_categoria(lancamentos) que recebe uma lista de tuplas (categoria, valor) e devolve um dicionário {categoria: total}, com cada total arredondado em 2 casas.',
          starter: `def somar_por_categoria(lancamentos):
    pass
`,
          tests: `dados = [("Aluguel", 2500.00), ("Energia", 380.50), ("Aluguel", 2500.00), ("Material", 129.90), ("Energia", 410.00)]
assert somar_por_categoria(dados) == {"Aluguel": 5000.0, "Energia": 790.5, "Material": 129.9}, "totais por categoria"
assert somar_por_categoria([]) == {}, "sem lançamentos devolve dicionário vazio"
`,
          solution: `def somar_por_categoria(lancamentos):
    totais = {}
    for categoria, valor in lancamentos:
        totais[categoria] = totais.get(categoria, 0) + valor
    for categoria in totais:
        totais[categoria] = round(totais[categoria], 2)
    return totais
`,
          hint: 'Mesmo padrão do contador, somando valor em vez de 1; arredonde ao final.',
          explain: 'O padrão somador é o contador com o valor no lugar do 1; o arredondamento final evita caudas de float.',
        },
        { type: 'mc', q: 'Qual expressão devolve a chave com o maior valor em salarios = {"Maria": 3500, "João": 4200}?', options: ['max(salarios)', 'max(salarios.values())', 'max(salarios, key=salarios.get)', 'salarios.max()'], answer: 2, explain: 'max percorre as chaves e compara pelo valor devolvido por salarios.get(chave). max(salarios) compararia os nomes alfabeticamente.' },
        {
          type: 'code',
          q: 'Escreva a função nome_cliente(clientes, cnpj) que recebe um dicionário aninhado {cnpj: {"nome": ..., "regime": ...}} e devolve o nome do cliente, ou "desconhecido" se o CNPJ não existir. Não use try/except.',
          starter: `def nome_cliente(clientes, cnpj):
    pass
`,
          tests: `clientes = {"111": {"nome": "Padaria Central", "regime": "Simples"}, "222": {"nome": "Oficina Souza", "regime": "Presumido"}}
assert nome_cliente(clientes, "111") == "Padaria Central", "CNPJ 111 é a Padaria Central"
assert nome_cliente(clientes, "222") == "Oficina Souza", "CNPJ 222 é a Oficina Souza"
assert nome_cliente(clientes, "999") == "desconhecido", "CNPJ inexistente devolve desconhecido"
`,
          solution: `def nome_cliente(clientes, cnpj):
    if cnpj in clientes:
        return clientes[cnpj]["nome"]
    return "desconhecido"
`,
          hint: 'Teste cnpj in clientes antes de acessar; depois clientes[cnpj]["nome"].',
          explain: 'Testar a chave com in evita o KeyError; o acesso em cadeia pega o campo dentro do dicionário interno.',
        },
        { type: 'order', q: 'Ordene as linhas para imprimir os totais por categoria em ordem alfabética.', items: ['totais = {"Energia": 790.5, "Aluguel": 5000.0}', 'for categoria, total in sorted(totais.items()):', '    print(f"{categoria:<10}{total:>10.2f}")'], explain: 'sorted(totais.items()) ordena as tuplas pela chave; o for desempacota e a f-string alinha.' },
      ],
    },
    {
      id: 'py-02-06',
      title: 'Conjuntos',
      minutes: 28,
      content: 'content/python/py-02/06-conjuntos.md',
      exercises: [
        { type: 'mc', q: 'Como se cria um conjunto vazio?', options: ['{}', 'set()', '[]', '()'], answer: 1, explain: '{} cria um dicionário vazio; conjunto vazio só com set().' },
        { type: 'tf', q: 'Conjuntos mantêm a ordem em que os itens foram adicionados.', answer: false, explain: 'Conjuntos não têm posição nem ordem garantida; use sorted() para exibir ordenado.' },
        { type: 'fill', q: 'A operação que devolve só os itens presentes nos DOIS conjuntos é a interseção, escrita a ___ b.', answer: ['&'], explain: '& é a interseção; | é união; - é diferença.' },
        {
          type: 'code',
          q: 'Escreva a função unicos_ordenados(lista) que devolve uma lista com os itens distintos da lista, em ordem crescente.',
          starter: `def unicos_ordenados(lista):
    pass
`,
          tests: `assert unicos_ordenados(["Padaria", "Oficina", "Padaria", "Mercado", "Oficina"]) == ["Mercado", "Oficina", "Padaria"], "distintos em ordem alfabética"
assert unicos_ordenados([3, 1, 3, 2, 1]) == [1, 2, 3], "distintos numéricos ordenados"
assert unicos_ordenados([]) == [], "lista vazia devolve lista vazia"
`,
          solution: `def unicos_ordenados(lista):
    return sorted(set(lista))
`,
          hint: 'set() remove duplicados; sorted() devolve uma lista ordenada.',
          explain: 'set elimina repetições e sorted converte de volta para lista já em ordem.',
        },
        {
          type: 'code',
          q: 'Escreva a função conciliar(banco, contabil) que recebe dois conjuntos e devolve a tupla (bateu, so_banco, so_contabil), cada um como LISTA ordenada: itens nos dois, só no banco, só na contabilidade.',
          starter: `def conciliar(banco, contabil):
    pass
`,
          tests: `banco = {"NF 101", "NF 102", "NF 103", "NF 104"}
contabil = {"NF 102", "NF 103", "NF 105"}
assert conciliar(banco, contabil) == (["NF 102", "NF 103"], ["NF 101", "NF 104"], ["NF 105"]), "conciliação banco x contabilidade"
assert conciliar(set(), {"a"}) == ([], [], ["a"]), "banco vazio: tudo só na contabilidade"
`,
          solution: `def conciliar(banco, contabil):
    bateu = sorted(banco & contabil)
    so_banco = sorted(banco - contabil)
    so_contabil = sorted(contabil - banco)
    return bateu, so_banco, so_contabil
`,
          hint: 'Interseção com &, diferenças com - nos dois sentidos; sorted em cada um.',
          explain: 'A conciliação é exatamente interseção e as duas diferenças; a diferença não é simétrica, por isso são dois cálculos.',
        },
        { type: 'mc', q: 'Qual item NÃO pode ser colocado em um conjunto?', options: ['"NF 1"', '(2026, 10)', '[1, 2]', '3.5'], answer: 2, explain: 'Itens de conjunto precisam ser imutáveis; listas são mutáveis e geram TypeError: unhashable type.' },
        { type: 'match', q: 'Relacione a operação ao resultado para a = {1, 2, 3} e b = {3, 4}.', pairs: [['a | b', '{1, 2, 3, 4}'], ['a & b', '{3}'], ['a - b', '{1, 2}'], ['b - a', '{4}']], explain: 'União junta tudo; interseção fica com o comum; diferença depende da ordem dos operandos.' },
      ],
    },
    {
      id: 'py-02-07',
      title: 'Comprehensions',
      minutes: 33,
      content: 'content/python/py-02/07-comprehensions.md',
      exercises: [
        { type: 'mc', q: 'O que produz [v * 2 for v in [1, 2, 3] if v > 1]?', options: ['[2, 4, 6]', '[4, 6]', '[2, 3]', '[1, 2, 3]'], answer: 1, explain: 'O if no final filtra (ficam 2 e 3), e a expressão dobra cada um: [4, 6].' },
        { type: 'tf', q: 'Em uma comprehension, o if que fica no final (depois do for) pode ter else.', answer: false, explain: 'O if do final é filtro e não aceita else; if/else só é permitido na expressão, antes do for.' },
        { type: 'fill', q: 'Comprehension de dicionário que inverte chaves e valores: {v: k for k, v in d.___()}', answer: ['items'], explain: 'items() entrega os pares (chave, valor), que são trocados de lugar na expressão.' },
        {
          type: 'code',
          q: 'Escreva a função com_desconto(valores, pct) que devolve uma lista com cada valor após aplicar pct% de desconto, arredondado em 2 casas. Use comprehension de lista.',
          starter: `def com_desconto(valores, pct):
    pass
`,
          tests: `assert com_desconto([1200.00, 850.50, 300.00], 5) == [1140.0, 807.97, 285.0], "5% de desconto em cada valor"
assert com_desconto([100], 0) == [100.0], "sem desconto"
assert com_desconto([], 10) == [], "lista vazia"
`,
          solution: `def com_desconto(valores, pct):
    return [round(v * (1 - pct / 100), 2) for v in valores]
`,
          hint: '[round(v * (1 - pct / 100), 2) for v in valores]',
          explain: 'A expressão transforma cada item e o for percorre a lista; uma linha substitui lista vazia + for + append.',
        },
        {
          type: 'code',
          q: 'Escreva a função classificar(valores) que devolve uma lista de strings: "crédito" para valores positivos e "débito" para os demais, usando if/else NA EXPRESSÃO da comprehension.',
          starter: `def classificar(valores):
    pass
`,
          tests: `assert classificar([100, -50, 200, 0]) == ["crédito", "débito", "crédito", "débito"], "positivos são crédito; zero e negativos, débito"
assert classificar([]) == [], "lista vazia"
`,
          solution: `def classificar(valores):
    return ["crédito" if v > 0 else "débito" for v in valores]
`,
          hint: '["crédito" if v > 0 else "débito" for v in valores]',
          explain: 'Com if/else antes do for, todo item entra na lista, e a condição decide qual valor ele recebe.',
        },
        { type: 'mc', q: 'Qual expressão achata [[1, 2], [3], [4, 5]] em [1, 2, 3, 4, 5]?', options: ['[v for v in linha for linha in tabela]', '[linha for linha in tabela for v in linha]', '[v for linha in tabela for v in linha]', '[tabela for v in linha]'], answer: 2, explain: 'O primeiro for é o externo (linhas) e o segundo o interno (valores), na mesma ordem dos laços em bloco.' },
        {
          type: 'code',
          q: 'Escreva a função inverter(d) que devolve um dicionário com chaves e valores trocados, usando comprehension de dicionário.',
          starter: `def inverter(d):
    pass
`,
          tests: `assert inverter({"Caixa": "1.1.01", "Bancos": "1.1.02"}) == {"1.1.01": "Caixa", "1.1.02": "Bancos"}, "chaves e valores trocados"
assert inverter({}) == {}, "dicionário vazio"
`,
          solution: `def inverter(d):
    return {valor: chave for chave, valor in d.items()}
`,
          hint: '{valor: chave for chave, valor in d.items()}',
          explain: 'A comprehension de dicionário monta cada par novo com o valor antigo como chave e a chave antiga como valor.',
        },
        { type: 'order', q: 'Ordene os pedaços para formar a comprehension que soma os salários dos ativos: sum(...)', items: ['sum(', 'sal', 'for nome, sal, ativo in folha', 'if ativo', ')'], explain: 'Dentro de sum vai a expressão geradora: expressão, depois o for, depois o filtro.' },
      ],
    },
    {
      id: 'py-02-08',
      title: 'Funções',
      minutes: 35,
      content: 'content/python/py-02/08-funcoes.md',
      exercises: [
        { type: 'mc', q: 'O que devolve uma função que não tem return?', options: ['0', '""', 'None', 'Gera erro'], answer: 2, explain: 'Sem return explícito, toda função devolve None ao terminar.' },
        { type: 'tf', q: 'print(x) dentro de uma função é equivalente a return x.', answer: false, explain: 'print mostra na tela e devolve None; return entrega o valor para quem chamou. Só com return o valor pode ser usado em contas e testes.' },
        { type: 'fill', q: 'A string de documentação logo abaixo do def, entre três aspas, chama-se ___.', answer: ['docstring', 'docstrings'], explain: 'A docstring descreve o que a função faz, recebe e devolve; help() e o editor a exibem.' },
        {
          type: 'code',
          q: 'Escreva a função calcular_iss(valor, aliquota=5) com valor padrão de alíquota 5 (%), que devolve o ISS arredondado em 2 casas e tenha uma docstring.',
          starter: `def calcular_iss(valor, aliquota=5):
    pass
`,
          tests: `assert calcular_iss(2400) == 120.0, "sem informar alíquota, usa 5%"
assert calcular_iss(2400, 3) == 72.0, "alíquota 3% informada por posição"
assert calcular_iss(aliquota=2, valor=1000) == 20.0, "argumentos nomeados em qualquer ordem"
assert calcular_iss.__doc__ and calcular_iss.__doc__.strip(), "a função deve ter docstring"
`,
          solution: `def calcular_iss(valor, aliquota=5):
    """Calcula o ISS sobre o valor do serviço com a alíquota em %."""
    return round(valor * aliquota / 100, 2)
`,
          hint: 'A docstring vai na primeira linha do corpo, entre aspas triplas.',
          explain: 'O valor padrão torna aliquota opcional; argumentos nomeados dispensam a ordem; a docstring fica em __doc__.',
        },
        {
          type: 'code',
          q: 'Escreva a função aplicar_reajuste(salarios, percentual=0) que devolve uma NOVA lista com cada salário reajustado em percentual%, arredondado em 2 casas, sem alterar a lista recebida.',
          starter: `def aplicar_reajuste(salarios, percentual=0):
    pass
`,
          tests: `base = [3500, 4200, 2900]
novo = aplicar_reajuste(base, 5)
assert novo == [3675.0, 4410.0, 3045.0], "reajuste de 5%"
assert base == [3500, 4200, 2900], "a lista original não deve ser alterada"
assert aplicar_reajuste(base) == [3500.0, 4200.0, 2900.0], "sem percentual devolve os mesmos valores"
`,
          solution: `def aplicar_reajuste(salarios, percentual=0):
    return [round(s * (1 + percentual / 100), 2) for s in salarios]
`,
          hint: 'Construa uma lista nova (comprehension ou for + append) em vez de alterar salarios.',
          explain: 'A função recebe a mesma lista de quem chamou (não uma cópia); devolver uma lista nova é o que garante que a original não mude.',
        },
        { type: 'mc', q: 'Por que def adicionar(item, lista=[]) é um problema?', options: ['Listas não podem ser parâmetros', 'O padrão é criado uma vez e compartilhado entre todas as chamadas', 'Gera SyntaxError', 'O parâmetro com padrão deveria vir primeiro'], answer: 1, explain: 'O valor padrão mutável é o mesmo objeto em todas as chamadas; itens de uma chamada aparecem na seguinte. Use None e crie dentro.' },
        { type: 'tf', q: 'Uma função pode ler uma variável global sem a palavra global, mas para atribuir a ela precisa declarar global.', answer: true, explain: 'Leitura de globais é livre; atribuição sem global cria uma variável local de mesmo nome (ou UnboundLocalError).' },
        {
          type: 'code',
          q: 'Dada uma lista de tuplas (nome, salario), escreva a função pegar_salario(registro) que devolve o salário de um registro, e a função ordenar_por_salario(folha) que devolve a lista ordenada do maior para o menor salário usando sorted com key=pegar_salario.',
          starter: `def pegar_salario(registro):
    pass

def ordenar_por_salario(folha):
    pass
`,
          tests: `folha = [("Maria", 3500), ("João", 4200), ("Ana", 2900)]
assert pegar_salario(("Maria", 3500)) == 3500, "pegar_salario devolve a posição 1"
assert ordenar_por_salario(folha) == [("João", 4200), ("Maria", 3500), ("Ana", 2900)], "do maior para o menor salário"
assert folha == [("Maria", 3500), ("João", 4200), ("Ana", 2900)], "a lista original não deve mudar"
`,
          solution: `def pegar_salario(registro):
    return registro[1]

def ordenar_por_salario(folha):
    return sorted(folha, key=pegar_salario, reverse=True)
`,
          hint: 'Passe pegar_salario para key SEM parênteses; reverse=True inverte a ordem.',
          explain: 'Funções são valores: sorted chama pegar_salario para cada item e ordena pelo que ela devolve.',
        },
      ],
    },
    {
      id: 'py-02-09',
      title: 'Projeto: controle de despesas',
      minutes: 32,
      content: 'content/python/py-02/09-projeto-despesas.md',
      exercises: [
        { type: 'mc', q: 'Por que o projeto representa cada despesa como dicionário e não como tupla?', options: ['Dicionários são mais rápidos', 'Com quatro campos, acessar por nome (d["valor"]) é mais claro que por posição (d[2])', 'Tuplas não cabem em listas', 'Porque o relatório exige'], answer: 1, explain: 'Com vários campos, o acesso por nome se explica sozinho; a tupla exigiria lembrar o significado de cada posição.' },
        { type: 'tf', q: 'A função relatorio deve usar despesas.sort() para exibir da maior para a menor.', answer: false, explain: 'sort() alteraria a ordem da lista de quem chamou; sorted() devolve uma cópia ordenada e preserva os dados.' },
        {
          type: 'code',
          q: 'Implemente adicionar_despesa(despesas, descricao, categoria, valor, data) que cria o dicionário com as chaves "descricao", "categoria", "valor" (arredondado em 2 casas) e "data", acrescenta à lista recebida e devolve o dicionário criado.',
          starter: `def adicionar_despesa(despesas, descricao, categoria, valor, data):
    pass
`,
          tests: `lista = []
d = adicionar_despesa(lista, "Aluguel escritório", "Aluguel", 2500.004, "2026-10-05")
assert d == {"descricao": "Aluguel escritório", "categoria": "Aluguel", "valor": 2500.0, "data": "2026-10-05"}, "deve devolver o dicionário com as 4 chaves e valor arredondado"
assert len(lista) == 1 and lista[0] is d, "a despesa deve ser acrescentada à lista recebida"
adicionar_despesa(lista, "Energia", "Energia", 380.5, "2026-10-10")
assert len(lista) == 2, "a segunda chamada deve acrescentar mais uma"
`,
          solution: `def adicionar_despesa(despesas, descricao, categoria, valor, data):
    despesa = {
        "descricao": descricao,
        "categoria": categoria,
        "valor": round(valor, 2),
        "data": data,
    }
    despesas.append(despesa)
    return despesa
`,
          hint: 'Monte o dicionário, faça despesas.append(despesa) e devolva despesa.',
          explain: 'A lista é alterada por referência e o dicionário criado é devolvido para quem chamou poder usá-lo.',
        },
        {
          type: 'code',
          q: 'Implemente total_geral(despesas) e total_por_categoria(despesas) para uma lista de dicionários com as chaves "categoria" e "valor". Ambas arredondam em 2 casas; a segunda devolve {categoria: total}.',
          starter: `def total_geral(despesas):
    pass

def total_por_categoria(despesas):
    pass
`,
          tests: `despesas = [
    {"descricao": "Aluguel", "categoria": "Aluguel", "valor": 2500.0, "data": "2026-10-05"},
    {"descricao": "Energia", "categoria": "Energia", "valor": 380.5, "data": "2026-10-10"},
    {"descricao": "Papel", "categoria": "Material", "valor": 129.9, "data": "2026-10-12"},
    {"descricao": "Internet", "categoria": "Energia", "valor": 199.9, "data": "2026-10-15"},
]
assert total_geral(despesas) == 3210.3, "total geral de outubro é 3210.3"
assert total_por_categoria(despesas) == {"Aluguel": 2500.0, "Energia": 580.4, "Material": 129.9}, "totais por categoria"
assert total_geral([]) == 0, "lista vazia tem total 0"
assert total_por_categoria([]) == {}, "lista vazia devolve dicionário vazio"
`,
          solution: `def total_geral(despesas):
    return round(sum(d["valor"] for d in despesas), 2)

def total_por_categoria(despesas):
    totais = {}
    for d in despesas:
        cat = d["categoria"]
        totais[cat] = totais.get(cat, 0) + d["valor"]
    return {cat: round(v, 2) for cat, v in totais.items()}
`,
          hint: 'sum com gerador para o total; padrão contador com get(cat, 0) para as categorias.',
          explain: 'O total geral é uma soma de um campo; o total por categoria é o padrão somador com dicionário, arredondado ao final.',
        },
        {
          type: 'code',
          q: 'Implemente filtrar_por_mes(despesas, mes) que devolve as despesas cuja "data" (formato AAAA-MM-DD) começa com mes (formato AAAA-MM), e maior_despesa(despesas) que devolve o dicionário de maior "valor" (ou None se a lista estiver vazia). Não use lambda: crie uma função auxiliar para o key.',
          starter: `def filtrar_por_mes(despesas, mes):
    pass

def valor_da_despesa(despesa):
    pass

def maior_despesa(despesas):
    pass
`,
          tests: `despesas = [
    {"descricao": "Aluguel", "categoria": "Aluguel", "valor": 2500.0, "data": "2026-10-05"},
    {"descricao": "Energia", "categoria": "Energia", "valor": 380.5, "data": "2026-10-10"},
    {"descricao": "Toner", "categoria": "Material", "valor": 450.0, "data": "2026-11-08"},
]
out = filtrar_por_mes(despesas, "2026-10")
assert len(out) == 2 and all(d["data"].startswith("2026-10") for d in out), "outubro tem 2 despesas"
assert filtrar_por_mes(despesas, "2026-12") == [], "dezembro não tem despesas"
assert maior_despesa(despesas)["descricao"] == "Aluguel", "a maior despesa é o Aluguel"
assert maior_despesa([]) is None, "lista vazia devolve None"
assert valor_da_despesa({"valor": 7.5}) == 7.5, "valor_da_despesa devolve o campo valor"
`,
          solution: `def filtrar_por_mes(despesas, mes):
    return [d for d in despesas if d["data"].startswith(mes)]

def valor_da_despesa(despesa):
    return despesa["valor"]

def maior_despesa(despesas):
    if not despesas:
        return None
    return max(despesas, key=valor_da_despesa)
`,
          hint: 'Comprehension com if para o filtro; max(despesas, key=valor_da_despesa) protegido por if not despesas.',
          explain: 'startswith filtra o mês no formato AAAA-MM; max com key compara dicionários pelo campo valor, e a guarda evita ValueError em lista vazia.',
        },
        { type: 'mc', q: 'O que acontece em max(despesas, key=valor_da_despesa()) (com parênteses)?', options: ['Funciona normalmente', 'TypeError, porque valor_da_despesa é chamada sem argumento antes de ser passada', 'Devolve None', 'Ordena a lista'], answer: 1, explain: 'Com parênteses a função é executada na hora (sem o argumento obrigatório); key espera a função em si, sem parênteses.' },
        { type: 'order', q: 'Ordene as linhas do corpo de total_por_categoria(despesas).', items: ['totais = {}', 'for d in despesas:', '    cat = d["categoria"]', '    totais[cat] = totais.get(cat, 0) + d["valor"]', 'return {cat: round(v, 2) for cat, v in totais.items()}'], explain: 'O dicionário acumulador é criado antes do laço; dentro dele, a categoria é lida antes de ser usada como chave; o return com o arredondamento vem depois de somar tudo.' },
      ],
    },
  ],
  exam: {
    passScore: 70,
    questions: [
      { type: 'mc', q: 'Qual laço é o mais indicado quando o número de repetições depende do que acontece durante a execução (ex.: até o saldo zerar)?', options: ['for', 'while', 'if', 'range'], answer: 1, explain: 'while repete enquanto a condição for verdadeira, sem exigir saber de antemão quantas voltas.' },
      { type: 'tf', q: 'Em um while, colocar continue antes da linha que atualiza a variável de controle pode causar laço infinito.', answer: true, explain: 'continue pula o resto da volta, inclusive a atualização; a condição nunca muda.' },
      { type: 'mc', q: 'Quantos números range(0, 10, 2) gera?', options: ['4', '5', '6', '10'], answer: 1, explain: '0, 2, 4, 6, 8 — cinco números; o 10 não entra.' },
      { type: 'fill', q: 'Para percorrer duas listas lado a lado usamos for a, b in ___(lista1, lista2):', answer: ['zip'], explain: 'zip() produz tuplas com um item de cada lista a cada volta.' },
      { type: 'mc', q: 'Qual forma copia de verdade a lista a?', options: ['b = a', 'b = a.copy()', 'b = a.sort()', 'b = a.append()'], answer: 1, explain: 'copy() (ou a[:] ou list(a)) cria uma nova lista; b = a só cria outro nome para a mesma lista.' },
      { type: 'tf', q: 'lista.pop() remove e devolve o último item da lista.', answer: true, explain: 'pop() sem argumento atua no último item; pop(i) atua na posição i.' },
      { type: 'mc', q: 'Qual estrutura é a mais adequada para um registro com posições de significado fixo que não deve ser alterado, como (nome, salario, ativo)?', options: ['Lista', 'Tupla', 'Conjunto', 'Dicionário vazio'], answer: 1, explain: 'A tupla é imutável e expressa um registro fixo; a lista é para coleções homogêneas que mudam.' },
      { type: 'mc', q: 'O que devolve d.get("x", 0) quando a chave "x" não existe em d?', options: ['KeyError', 'None', '0', '"x"'], answer: 2, explain: 'get devolve o segundo argumento como padrão quando a chave não existe.' },
      { type: 'fill', q: 'A linha do padrão contador é: contagem[item] = contagem.___(item, 0) + 1', answer: ['get'], explain: 'get(item, 0) devolve a contagem atual ou 0 na primeira ocorrência.' },
      { type: 'mc', q: 'Para a = {"NF 1", "NF 2", "NF 3"} e b = {"NF 2", "NF 4"}, o que é a - b?', options: ['{"NF 1", "NF 3"}', '{"NF 4"}', '{"NF 2"}', '{"NF 1", "NF 3", "NF 4"}'], answer: 0, explain: 'A diferença a - b mantém o que está em a e não está em b.' },
      { type: 'tf', q: '[x for x in lista if x > 0 else 0] é uma comprehension válida.', answer: false, explain: 'O if do final é filtro e não aceita else; com else, o if/else vai antes do for: [x if x > 0 else 0 for x in lista].' },
      { type: 'mc', q: 'Em def f(a, b=2): ..., o que acontece em f(5)?', options: ['TypeError por faltar b', 'b recebe 2 (valor padrão)', 'b recebe None', 'a recebe 2'], answer: 1, explain: 'Parâmetros com valor padrão são opcionais; se não forem passados, usam o padrão.' },
      {
        type: 'code',
        q: 'Escreva a função media(valores) que devolve a média arredondada em 2 casas, ou 0 se a lista estiver vazia.',
        starter: `def media(valores):
    pass
`,
        tests: `assert media([1200, 850, 4500, 300]) == 1712.5, "média de [1200, 850, 4500, 300] é 1712.5"
assert media([]) == 0, "lista vazia devolve 0"
assert media([10, 20]) == 15.0, "média de 10 e 20 é 15.0"
`,
        solution: `def media(valores):
    if not valores:
        return 0
    return round(sum(valores) / len(valores), 2)
`,
        hint: 'Teste a lista vazia antes de dividir por len(valores).',
        explain: 'A guarda evita ZeroDivisionError; sum e len resolvem a média sem laço.',
      },
      {
        type: 'code',
        q: 'Escreva a função contar_tipos(notas) que recebe uma lista de dicionários com a chave "tipo" e devolve um dicionário {tipo: quantidade}.',
        starter: `def contar_tipos(notas):
    pass
`,
        tests: `notas = [{"tipo": "NFe", "valor": 100}, {"tipo": "NFSe", "valor": 50}, {"tipo": "NFe", "valor": 70}]
assert contar_tipos(notas) == {"NFe": 2, "NFSe": 1}, "duas NFe e uma NFSe"
assert contar_tipos([]) == {}, "lista vazia devolve dicionário vazio"
`,
        solution: `def contar_tipos(notas):
    contagem = {}
    for nota in notas:
        tipo = nota["tipo"]
        contagem[tipo] = contagem.get(tipo, 0) + 1
    return contagem
`,
        hint: 'Padrão contador: contagem[tipo] = contagem.get(tipo, 0) + 1',
        explain: 'Cada nota contribui com 1 para a contagem do seu tipo; get com padrão 0 trata a primeira ocorrência.',
      },
      {
        type: 'code',
        q: 'Escreva a função nomes_ativos(folha) que recebe uma lista de tuplas (nome, salario, ativo) e devolve uma lista com os nomes dos ativos em MAIÚSCULAS, usando uma comprehension com filtro.',
        starter: `def nomes_ativos(folha):
    pass
`,
        tests: `folha = [("Maria", 3500, True), ("João", 4200, False), ("Ana", 2900, True)]
assert nomes_ativos(folha) == ["MARIA", "ANA"], "só os ativos, em maiúsculas"
assert nomes_ativos([]) == [], "folha vazia devolve lista vazia"
`,
        solution: `def nomes_ativos(folha):
    return [nome.upper() for nome, salario, ativo in folha if ativo]
`,
        hint: '[nome.upper() for nome, salario, ativo in folha if ativo]',
        explain: 'O desempacotamento no for dá acesso aos três campos; o if filtra pelos ativos e a expressão transforma o nome.',
      },
    ],
  },
});
