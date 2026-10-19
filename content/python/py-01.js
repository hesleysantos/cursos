registerModule({
  course: 'python',
  id: 'py-01',
  order: 1,
  level: 'Iniciante',
  title: 'Fundamentos',
  description: 'Você vai instalar o Python, entender como um programa é executado e dominar os blocos básicos: variáveis, números, textos, conversões e decisões com if/elif/else. Ao final, vai construir uma calculadora de salário líquido com INSS e IRRF e saber ler qualquer mensagem de erro sem pânico.',
  hours: 5,
  lessons: [
    {
      id: 'py-01-01',
      title: 'Primeiros passos: Python, terminal e print()',
      minutes: 31,
      content: 'content/python/py-01/01-primeiros-passos.md',
      exercises: [
        { type: 'mc', q: 'O que é o "interpretador" do Python?', options: ['Um site onde se publica código', 'O programa que lê seu código e executa cada instrução', 'Um tipo de planilha', 'O editor de texto VS Code'], answer: 1, explain: 'O interpretador é o programa python.exe que lê o arquivo .py linha a linha e executa as instruções.' },
        { type: 'tf', q: 'Ao instalar o Python no Windows, a opção "Add python.exe to PATH" é dispensável.', answer: false, explain: 'Sem o PATH, o terminal não encontra o comando python e mostra "não é reconhecido como um comando".' },
        { type: 'fill', q: 'Para mostrar um texto na tela usamos a função ___("Olá").', answer: ['print'], explain: 'print() é a função embutida que escreve na saída padrão (a tela do terminal).' },
        { type: 'order', q: 'Coloque na ordem correta os passos para rodar seu primeiro programa.', items: ['Digitar print("Olá") no arquivo ola.py', 'Salvar o arquivo com Ctrl + S', 'Digitar python ola.py no terminal e apertar Enter', 'Ver Olá aparecer na tela'], explain: 'O interpretador lê o arquivo gravado no disco: primeiro se escreve, depois se salva, só então o terminal executa com python nome.py e a saída aparece.' },
        { type: 'mc', q: 'O que indica o símbolo >>> no terminal?', options: ['Um erro de sintaxe', 'Que o arquivo foi salvo', 'Que o Python está no modo interativo, esperando uma instrução', 'Que o terminal está travado'], answer: 2, explain: 'Os três sinais de maior são o prompt do modo interativo: cada linha digitada é executada na hora.' },
        { type: 'tf', q: 'print("Total:", 100) mostra na tela Total: 100, com um espaço entre os dois itens.', answer: true, explain: 'Itens separados por vírgula no print() são exibidos com um espaço entre eles.' },
        {
          type: 'code',
          q: 'Escreva um programa que imprima exatamente a frase: Olá, contador!',
          starter: `# escreva seu print aqui
`,
          tests: `assert saida.strip() == "Olá, contador!", "Imprima exatamente: Olá, contador!"
`,
          solution: `print("Olá, contador!")
`,
          hint: 'Use print() com o texto entre aspas duplas.',
          explain: 'print() escreve exatamente o texto entre aspas; vírgula e acento fazem parte da string.',
        },
        { type: 'mc', q: 'Qual destas linhas gera erro?', options: ['print("Nota 123")', "print('Nota 123')", 'print(Nota 123)', 'print("Nota", 123)'], answer: 2, explain: 'Sem aspas, o Python tenta interpretar Nota como variável e 123 como outra coisa: SyntaxError.' },
      ],
    },
    {
      id: 'py-01-02',
      title: 'Variáveis e tipos',
      minutes: 35,
      content: 'content/python/py-01/02-variaveis-e-tipos.md',
      exercises: [
        { type: 'mc', q: 'Qual é o tipo do valor 1250.90?', options: ['int', 'str', 'float', 'bool'], answer: 2, explain: 'Números com ponto decimal são float. O separador decimal em Python é o ponto.' },
        { type: 'tf', q: 'Em Python, salario = 3500 significa "salario é igual a 3500" no sentido matemático.', answer: false, explain: 'O sinal = é atribuição: a variável salario RECEBE o valor 3500. Comparação usa ==.' },
        { type: 'fill', q: 'Para descobrir o tipo de uma variável usamos a função ___(variavel).', answer: ['type'], explain: 'type() devolve a classe do valor, como <class \'int\'> ou <class \'str\'>.' },
        { type: 'mc', q: 'Qual nome de variável é válido E segue a convenção do Python?', options: ['valorNota', 'valor-nota', 'valor_nota', '2valor'], answer: 2, explain: 'snake_case (minúsculas com sublinhado) é a convenção. Hífen vira subtração e nome não pode começar com número.' },
        {
          type: 'code',
          q: 'Crie as variáveis: nome_cliente com o texto "Padaria Central", faturamento com o número decimal 45000.50, ativo com o valor lógico verdadeiro e data_baixa sem valor (None).',
          starter: `nome_cliente =
faturamento =
ativo =
data_baixa =
`,
          tests: `assert nome_cliente == "Padaria Central", "nome_cliente deve ser o texto Padaria Central"
assert type(faturamento) is float and faturamento == 45000.50, "faturamento deve ser o float 45000.50"
assert ativo is True, "ativo deve ser True"
assert data_baixa is None, "data_baixa deve ser None"
`,
          solution: `nome_cliente = "Padaria Central"
faturamento = 45000.50
ativo = True
data_baixa = None
`,
          hint: 'Texto entre aspas, decimal com ponto, True com T maiúsculo, None com N maiúsculo.',
          explain: 'Cada tipo tem sua forma literal: aspas para str, ponto para float, True para bool e None para ausência de valor.',
        },
        {
          type: 'code',
          q: 'A variável saldo começa em 1000. Sem apagar a primeira linha, acrescente 250 ao saldo usando a própria variável (saldo = saldo + ...), e depois guarde em dobro o valor de saldo multiplicado por 2.',
          starter: `saldo = 1000
# acrescente 250 ao saldo

# crie dobro
`,
          tests: `assert saldo == 1250, "saldo deveria ser 1250 após somar 250"
assert dobro == 2500, "dobro deveria ser 2500"
`,
          solution: `saldo = 1000
saldo = saldo + 250
dobro = saldo * 2
`,
          hint: 'Leia saldo = saldo + 250 como "saldo recebe saldo mais 250".',
          explain: 'A atribuição calcula o lado direito com o valor atual e guarda o resultado no mesmo nome.',
        },
        { type: 'tf', q: 'Um CNPJ como "12.345.678/0001-90" deve ser guardado como str, não como número.', answer: true, explain: 'Códigos têm pontuação e zeros à esquerda e nunca entram em contas; são texto.' },
        { type: 'order', q: 'Ordene as linhas para que o programa imprima 1500.', items: ['receita = 2000', 'despesa = receita - 1500', 'resultado = receita - despesa', 'print(resultado)'], explain: 'Uma variável só pode ser usada depois de criada: despesa depende de receita, resultado depende das duas, e o print vem por último.' },
        { type: 'mc', q: 'O que acontece em preco = 10,50?', options: ['Cria o float 10.5', 'Gera SyntaxError', 'Cria uma tupla (10, 50)', 'Cria a string "10,50"'], answer: 2, explain: 'A vírgula separa itens em Python; 10,50 vira uma tupla com dois inteiros. Decimal usa ponto.' },
      ],
    },
    {
      id: 'py-01-03',
      title: 'Números e operadores',
      minutes: 32,
      content: 'content/python/py-01/03-numeros-e-operadores.md',
      exercises: [
        { type: 'mc', q: 'Qual o resultado de 17 // 5?', options: ['3.4', '3', '2', '3.0'], answer: 1, explain: '// é a divisão inteira: descarta a parte decimal e devolve 3.' },
        { type: 'fill', q: 'Complete com o operador que devolve o resto da divisão: 17 ___ 5 dá 2.', answer: ['%'], explain: 'O operador módulo % devolve o resto da divisão inteira: 17 = 3 × 5 + 2.' },
        { type: 'mc', q: 'Qual o resultado de 100 + 50 * 2?', options: ['300', '200', '150', '250'], answer: 1, explain: 'Multiplicação tem prioridade sobre soma: 50 * 2 = 100, depois 100 + 100 = 200.' },
        { type: 'tf', q: 'A expressão 10 / 2 devolve o inteiro 5.', answer: false, explain: 'A divisão / sempre devolve float: 10 / 2 é 5.0.' },
        {
          type: 'code',
          q: 'Escreva a função iss(valor, aliquota) que recebe o valor do serviço e a alíquota em porcentagem (ex.: 5 para 5%) e devolve o ISS arredondado para 2 casas.',
          starter: `def iss(valor, aliquota):
    pass
`,
          tests: `assert iss(2400, 5) == 120.0, "iss(2400, 5) deveria ser 120.0"
assert iss(2387.33, 5) == 119.37, "iss(2387.33, 5) deveria ser 119.37 (arredondado)"
assert iss(1000, 2.5) == 25.0, "iss(1000, 2.5) deveria ser 25.0"
`,
          solution: `def iss(valor, aliquota):
    return round(valor * aliquota / 100, 2)
`,
          hint: 'valor * aliquota / 100, depois round(..., 2).',
          explain: 'Percentual é o valor dividido por 100; round(x, 2) arredonda para centavos.',
        },
        {
          type: 'code',
          q: 'Escreva a função montante(capital, taxa, meses) que calcula juros compostos: capital * (1 + taxa) ** meses, arredondado para 2 casas. A taxa vem em decimal (0.015 para 1,5%).',
          starter: `def montante(capital, taxa, meses):
    pass
`,
          tests: `assert montante(10000, 0.015, 24) == 14295.03, "montante(10000, 0.015, 24) deveria ser 14295.03"
assert montante(1000, 0.10, 1) == 1100.0, "montante(1000, 0.10, 1) deveria ser 1100.0"
assert montante(500, 0, 12) == 500.0, "com taxa zero o montante é igual ao capital"
`,
          solution: `def montante(capital, taxa, meses):
    return round(capital * (1 + taxa) ** meses, 2)
`,
          hint: 'Potência em Python é **, não ^.',
          explain: 'Juros compostos são uma potência: (1 + taxa) elevado ao número de períodos, multiplicado pelo capital.',
        },
        { type: 'mc', q: 'Qual atalho equivale a total = total + nota?', options: ['total =+ nota', 'total += nota', 'total ++ nota', 'total => nota'], answer: 1, explain: '+= soma e atribui. Cuidado: =+ é apenas "recebe o valor positivo".' },
        { type: 'order', q: 'Ordene as linhas para calcular e imprimir 69.3 (percentual da despesa sobre a receita).', items: ['receita, despesa = 45000, 31200', 'percentual = despesa / receita * 100', 'percentual = round(percentual, 1)', 'print(percentual)'], explain: 'Primeiro os valores, depois o cálculo que depende deles, depois o arredondamento do resultado e, por fim, a exibição.' },
      ],
    },
    {
      id: 'py-01-04',
      title: 'Strings e f-strings',
      minutes: 31,
      content: 'content/python/py-01/04-strings.md',
      exercises: [
        { type: 'mc', q: 'Em codigo = "NOTA-123", o que devolve codigo[0]?', options: ['"O"', '"N"', '"3"', 'Erro'], answer: 1, explain: 'A contagem de índices começa em 0; a posição 0 é a letra N.' },
        { type: 'fill', q: 'Para saber quantos caracteres tem uma string usamos ___(texto).', answer: ['len'], explain: 'len() devolve o tamanho de qualquer sequência, inclusive strings.' },
        { type: 'mc', q: 'O que devolve "NFE-2026-000123"[4:8]?', options: ['"2026"', '"-2026"', '"2026-"', '"E-20"'], answer: 0, explain: 'O fatiamento inclui o índice 4 e exclui o 8: posições 4, 5, 6 e 7 formam "2026".' },
        { type: 'tf', q: 'Depois de nome.upper(), a variável nome passa a ter o texto em maiúsculas.', answer: false, explain: 'Strings são imutáveis: upper() devolve uma nova string. É preciso fazer nome = nome.upper().' },
        {
          type: 'code',
          q: 'Escreva a função so_digitos(cnpj) que recebe um CNPJ formatado (ex.: "12.345.678/0001-90") e devolve apenas os dígitos ("12345678000190").',
          starter: `def so_digitos(cnpj):
    pass
`,
          tests: `assert so_digitos("12.345.678/0001-90") == "12345678000190", "deveria remover pontos, barra e hífen"
assert so_digitos("00.000.000/0001-91") == "00000000000191", "deveria manter os zeros à esquerda"
assert so_digitos("12345678000190") == "12345678000190", "sem formatação deve devolver igual"
`,
          solution: `def so_digitos(cnpj):
    return cnpj.replace(".", "").replace("/", "").replace("-", "")
`,
          hint: 'Encadeie três replace(), um para cada símbolo.',
          explain: 'replace() devolve uma nova string, então pode ser encadeado; cada chamada remove um símbolo.',
        },
        {
          type: 'code',
          q: 'Escreva a função linha_relatorio(conta, valor) que devolve uma string com a conta alinhada à esquerda em 15 posições e o valor à direita em 12 posições com 2 casas decimais. Ex.: linha_relatorio("Receitas", 45000) -> "Receitas           45000.00" (27 caracteres no total).',
          starter: `def linha_relatorio(conta, valor):
    pass
`,
          tests: `assert linha_relatorio("Receitas", 45000) == "Receitas           45000.00", "Receitas alinhado em 15 e 45000.00 em 12"
assert linha_relatorio("Despesas", 31200.5) == "Despesas           31200.50", "Despesas alinhado em 15 e 31200.50 em 12"
assert len(linha_relatorio("ISS", 1)) == 27, "a linha deve ter 15 + 12 = 27 caracteres"
`,
          solution: `def linha_relatorio(conta, valor):
    return f"{conta:<15}{valor:>12.2f}"
`,
          hint: 'Use uma f-string: {conta:<15} e {valor:>12.2f}.',
          explain: '< alinha à esquerda e > à direita; o número é a largura e .2f fixa duas casas decimais.',
        },
        { type: 'mc', q: 'Qual expressão converte o texto brasileiro "1.250,90" para "1250.90"?', options: ['texto.replace(",", ".")', 'texto.replace(".", "").replace(",", ".")', 'texto.replace(".", ",")', 'texto.strip()'], answer: 1, explain: 'Primeiro remove o ponto de milhar, depois troca a vírgula decimal por ponto. Só trocar a vírgula deixaria "1.250.90".' },
        { type: 'fill', q: 'Na f-string f"ISS: {valor:___}", o formato que mostra duas casas decimais é', answer: ['.2f'], explain: '.2f significa número de ponto flutuante com 2 casas após o ponto.' },
      ],
    },
    {
      id: 'py-01-05',
      title: 'input() e conversões de tipo',
      minutes: 31,
      content: 'content/python/py-01/05-input-e-conversoes.md',
      exercises: [
        { type: 'mc', q: 'Qual é o tipo do valor devolvido por input(), independentemente do que o usuário digitar?', options: ['int', 'float', 'str', 'Depende do que foi digitado'], answer: 2, explain: 'input() sempre devolve string; a conversão para número é responsabilidade do programador.' },
        { type: 'tf', q: 'int("3.5") devolve 3.', answer: false, explain: 'int() não aceita texto com ponto decimal: gera ValueError. Use float("3.5") ou int(float("3.5")).' },
        { type: 'fill', q: 'O erro gerado por int("abc") chama-se ___.', answer: ['ValueError'], explain: 'O tipo (str) está correto, mas o valor não pode ser convertido: ValueError.' },
        { type: 'mc', q: 'O que devolve int(9.99)?', options: ['10', '9', '9.0', 'ValueError'], answer: 1, explain: 'int() trunca (corta) a parte decimal; não arredonda. Para arredondar use round().' },
        {
          type: 'code',
          q: 'Escreva a função para_numero(texto) que recebe um valor em formato brasileiro como string ("1.500,90") e devolve o float correspondente (1500.9).',
          starter: `def para_numero(texto):
    pass
`,
          tests: `assert para_numero("1.500,90") == 1500.9, "1.500,90 deveria virar 1500.9"
assert para_numero("89,90") == 89.9, "89,90 deveria virar 89.9"
assert para_numero("2.000.000,00") == 2000000.0, "2.000.000,00 deveria virar 2000000.0"
assert type(para_numero("10,00")) is float, "o resultado deve ser float"
`,
          solution: `def para_numero(texto):
    return float(texto.replace(".", "").replace(",", "."))
`,
          hint: 'Remova os pontos, troque a vírgula por ponto e só então use float().',
          explain: 'float() só entende ponto decimal e não aceita separador de milhar; por isso o texto é limpo antes.',
        },
        {
          type: 'code',
          q: 'Escreva a função total_pedido(qtd_texto, preco_texto) que recebe a quantidade e o preço como strings já no formato do Python (ex.: "12" e "89.90"), converte cada um para o tipo adequado e devolve o total arredondado em 2 casas.',
          starter: `def total_pedido(qtd_texto, preco_texto):
    pass
`,
          tests: `assert total_pedido("12", "89.90") == 1078.8, "12 x 89.90 = 1078.8"
assert total_pedido("3", "10") == 30.0, "3 x 10 = 30.0"
assert total_pedido(" 5 ", "2.5") == 12.5, "espaços nas bordas devem ser aceitos"
`,
          solution: `def total_pedido(qtd_texto, preco_texto):
    qtd = int(qtd_texto)
    preco = float(preco_texto)
    return round(qtd * preco, 2)
`,
          hint: 'int() para a quantidade, float() para o preço; int() e float() ignoram espaços nas bordas.',
          explain: 'Quantidade é contagem (int) e preço tem centavos (float); sem converter, * entre strings daria TypeError.',
        },
        { type: 'tf', q: 'Nos exercícios deste curso, usamos funções em vez de input() porque o navegador não tem teclado para o input() ler e porque funções são fáceis de testar.', answer: true, explain: 'Separar cálculo de leitura torna o código testável e reutilizável.' },
        { type: 'order', q: 'Ordene as linhas de um programa que lê um valor, converte e mostra o dobro.', items: ['texto = input("Valor: ")', 'valor = float(texto)', 'dobro = valor * 2', 'print(f"Dobro: {dobro:.2f}")'], explain: 'Ler, converter, calcular, exibir — nessa ordem, porque cada passo depende do anterior.' },
      ],
    },
    {
      id: 'py-01-06',
      title: 'Condicionais: if, elif, else',
      minutes: 35,
      content: 'content/python/py-01/06-condicionais.md',
      exercises: [
        { type: 'mc', q: 'Qual operador compara igualdade em Python?', options: ['=', '==', '===', 'equals'], answer: 1, explain: '== compara dois valores; = é atribuição.' },
        { type: 'tf', q: 'Em uma cadeia if/elif/elif/else, pode acontecer de dois blocos executarem.', answer: false, explain: 'Apenas o primeiro bloco cuja condição for verdadeira executa; os demais são ignorados.' },
        { type: 'fill', q: 'Complete: if valor > 5000 ___ tem_contrato: (deve ser verdadeiro só quando as duas condições forem verdadeiras).', answer: ['and'], explain: 'and exige que ambas as condições sejam verdadeiras.' },
        { type: 'mc', q: 'Qual destes valores é considerado VERDADEIRO (truthy) em um if?', options: ['0', '""', 'None', '"0"'], answer: 3, explain: 'O texto "0" não é vazio, logo é truthy. Zero numérico, string vazia e None são falsy.' },
        {
          type: 'code',
          q: 'Escreva a função regime(faturamento_anual) que devolve "MEI" se o faturamento for até 81000, "Simples Nacional" se for até 4800000, e "Lucro Presumido ou Real" acima disso.',
          starter: `def regime(faturamento_anual):
    pass
`,
          tests: `assert regime(50000) == "MEI", "50000 deveria ser MEI"
assert regime(81000) == "MEI", "81000 (limite) ainda é MEI"
assert regime(81000.01) == "Simples Nacional", "logo acima de 81000 é Simples Nacional"
assert regime(2500000) == "Simples Nacional", "2500000 deveria ser Simples Nacional"
assert regime(5000000) == "Lucro Presumido ou Real", "5000000 deveria ser Lucro Presumido ou Real"
`,
          solution: `def regime(faturamento_anual):
    if faturamento_anual <= 81000:
        return "MEI"
    elif faturamento_anual <= 4800000:
        return "Simples Nacional"
    else:
        return "Lucro Presumido ou Real"
`,
          hint: 'Ordene as faixas da menor para a maior com if/elif/else.',
          explain: 'Como só o primeiro ramo verdadeiro executa, testar da menor faixa para a maior dispensa repetir o limite inferior.',
        },
        {
          type: 'code',
          q: 'Escreva a função classificar_nota(tipo, valor) que devolve "Revisar" se o tipo NÃO for um de "NFe", "NFSe" ou "CTe", OU se o valor for maior que 50000; caso contrário devolve "OK".',
          starter: `def classificar_nota(tipo, valor):
    pass
`,
          tests: `assert classificar_nota("NFe", 1000) == "OK", "NFe de 1000 deveria ser OK"
assert classificar_nota("NFSe", 50000) == "OK", "NFSe de exatamente 50000 deveria ser OK"
assert classificar_nota("NFe", 50000.01) == "Revisar", "acima de 50000 deveria ser Revisar"
assert classificar_nota("Recibo", 100) == "Revisar", "tipo desconhecido deveria ser Revisar"
assert classificar_nota("CTe", 200) == "OK", "CTe de 200 deveria ser OK"
`,
          solution: `def classificar_nota(tipo, valor):
    if tipo not in ("NFe", "NFSe", "CTe") or valor > 50000:
        return "Revisar"
    return "OK"
`,
          hint: 'Use not in com uma tupla de tipos válidos e combine com or.',
          explain: 'in testa pertencimento a uma coleção; or faz a condição valer se qualquer um dos dois motivos de revisão ocorrer.',
        },
        { type: 'tf', q: 'A condição if tipo == "NFe" or "NFSe": é sempre verdadeira.', answer: true, explain: 'O Python lê como (tipo == "NFe") or ("NFSe"); uma string não vazia é truthy, então a condição sempre passa.' },
        { type: 'mc', q: 'O que faz status = "Alto" if valor > 5000 else "Normal"?', options: ['Gera SyntaxError', 'Atribui "Alto" se valor > 5000, senão "Normal"', 'Sempre atribui "Alto"', 'Imprime Alto ou Normal'], answer: 1, explain: 'É a expressão condicional (ternária): escolhe entre dois valores em uma linha.' },
        { type: 'mc', q: 'Com qtd = 0, por que if qtd > 0 and total / qtd > 100: NÃO gera ZeroDivisionError?', options: ['Porque dividir por zero devolve 0 em Python', 'Porque and avalia da esquerda para a direita e para no primeiro False: a divisão nunca é executada', 'Porque o if ignora erros', 'Porque total / qtd é avaliado antes de qtd > 0'], answer: 1, explain: 'Curto-circuito: com qtd > 0 falso, o resultado do and já está decidido e o Python nem avalia o lado direito.' },
      ],
    },
    {
      id: 'py-01-07',
      title: 'Lendo erros e tracebacks',
      minutes: 34,
      content: 'content/python/py-01/07-lendo-erros.md',
      exercises: [
        { type: 'mc', q: 'Em que direção se deve ler um traceback para achar a informação mais útil?', options: ['De cima para baixo: a primeira linha é a mais importante', 'De baixo para cima: a última linha diz o tipo e a mensagem do erro', 'Só a primeira palavra', 'Tanto faz'], answer: 1, explain: 'A última linha traz o tipo e a mensagem; a linha "File ..., line N" logo acima aponta onde olhar.' },
        { type: 'mc', q: 'Qual erro aparece ao executar print(valor_brutto) quando só existe a variável valor_bruto?', options: ['TypeError', 'SyntaxError', 'NameError', 'IndentationError'], answer: 2, explain: 'NameError: name \'valor_brutto\' is not defined — o nome não existe (erro de digitação).' },
        { type: 'tf', q: 'Um SyntaxError acontece durante a execução, depois que parte do programa já rodou.', answer: false, explain: 'Erros de sintaxe são detectados antes de executar qualquer linha; o programa nem começa.' },
        { type: 'fill', q: 'O erro gerado por "Total: " + 100 chama-se ___.', answer: ['TypeError'], explain: 'Somar str com int é operação entre tipos incompatíveis: TypeError.' },
        { type: 'match', q: 'Relacione o erro à causa mais provável.', pairs: [['SyntaxError', 'parêntese ou aspas sem fechar'], ['NameError', 'variável digitada errado ou não criada'], ['TypeError', 'operação entre texto e número'], ['IndentationError', 'bloco do if sem os 4 espaços'], ['ValueError', 'int("abc")']], explain: 'Cada tipo de erro aponta para uma categoria de problema; reconhecê-los acelera a correção.' },
        {
          type: 'code',
          q: 'O código abaixo tem DOIS erros (um TypeError e um erro de digitação em nome). Corrija-o para que a função liquido(bruto, desconto) devolva bruto menos desconto, aceitando o desconto como texto numérico (ex.: "280").',
          starter: `def liquido(bruto, desconto):
    resultado = bruto - desconto
    return resultedo
`,
          tests: `assert liquido(3500, "280") == 3220, "liquido(3500, '280') deveria ser 3220"
assert liquido(1000, "0") == 1000, "liquido(1000, '0') deveria ser 1000"
assert liquido(2000, "500.5") == 1499.5, "liquido(2000, '500.5') deveria ser 1499.5"
`,
          solution: `def liquido(bruto, desconto):
    resultado = bruto - float(desconto)
    return resultado
`,
          hint: 'Converta desconto com float() e confira a grafia de resultado no return.',
          explain: 'bruto - "280" é TypeError (int menos str); resultedo é NameError porque o nome criado foi resultado.',
        },
        {
          type: 'code',
          q: 'O código abaixo gera IndentationError e falta um dois-pontos. Corrija-o para que sinal(valor) devolva "positivo", "negativo" ou "zero".',
          starter: `def sinal(valor):
if valor > 0
    return "positivo"
    elif valor < 0:
        return "negativo"
    else:
    return "zero"
`,
          tests: `assert sinal(10) == "positivo", "sinal(10) deveria ser positivo"
assert sinal(-3.5) == "negativo", "sinal(-3.5) deveria ser negativo"
assert sinal(0) == "zero", "sinal(0) deveria ser zero"
`,
          solution: `def sinal(valor):
    if valor > 0:
        return "positivo"
    elif valor < 0:
        return "negativo"
    else:
        return "zero"
`,
          hint: 'O corpo da função tem 4 espaços; o corpo de cada if/elif/else tem 8. Toda linha de if/elif/else termina com dois-pontos.',
          explain: 'A indentação define os blocos: if, elif e else precisam estar no mesmo nível, e seus corpos um nível abaixo.',
        },
        { type: 'order', q: 'Ordene os passos do método para resolver um erro.', items: ['Ler a última linha do traceback', 'Ir até a linha indicada no arquivo', 'Perguntar o que o Python esperava e o que encontrou', 'Mudar uma coisa e rodar de novo'], explain: 'Diagnóstico antes de alteração: identificar, localizar, entender, corrigir uma coisa por vez.' },
      ],
    },
    {
      id: 'py-01-08',
      title: 'Projeto: calculadora de salário líquido',
      minutes: 35,
      content: 'content/python/py-01/08-projeto-salario-liquido.md',
      exercises: [
        { type: 'mc', q: 'Por que o projeto separa o cálculo (calcular_inss, calcular_irrf) da exibição (mostrar_holerite)?', options: ['Porque o Python exige', 'Para o programa rodar mais rápido', 'Para poder testar e reaproveitar o cálculo sem depender da tela', 'Por acaso'], answer: 2, explain: 'Funções de cálculo puras podem ser testadas automaticamente e usadas com dados de qualquer origem.' },
        { type: 'tf', q: 'No INSS progressivo, a alíquota da faixa em que o salário cai é aplicada sobre o salário inteiro.', answer: false, explain: 'Cada pedaço do salário é tributado pela alíquota de sua faixa; soma-se o resultado de todas as faixas.' },
        { type: 'fill', q: 'Antes de aplicar as faixas do INSS, salários acima do teto são "achatados" com: if bruto > TETO_INSS: bruto = ___', answer: ['TETO_INSS', '8157.41'], explain: 'Acima do teto o desconto não cresce; o cálculo é feito como se o salário fosse o próprio teto.' },
        {
          type: 'code',
          q: 'Implemente calcular_inss(bruto) com a tabela progressiva: 7,5% até 1518.00; 9% de 1518.01 a 2793.88; 12% de 2793.89 a 4190.83; 14% de 4190.84 a 8157.41 (teto). Acima do teto, calcule como se fosse o teto. Devolva arredondado em 2 casas.',
          starter: `TETO_INSS = 8157.41

def calcular_inss(bruto):
    pass
`,
          tests: `assert calcular_inss(1518) == 113.85, "calcular_inss(1518) deveria ser 113.85"
assert calcular_inss(2000) == 157.23, "calcular_inss(2000) deveria ser 157.23"
assert calcular_inss(3000) == 253.41, "calcular_inss(3000) deveria ser 253.41"
assert calcular_inss(5000) == 509.6, "calcular_inss(5000) deveria ser 509.6"
assert calcular_inss(12000) == 951.63, "acima do teto deveria dar 951.63"
`,
          solution: `TETO_INSS = 8157.41

def calcular_inss(bruto):
    if bruto > TETO_INSS:
        bruto = TETO_INSS
    if bruto <= 1518.00:
        inss = bruto * 0.075
    elif bruto <= 2793.88:
        inss = 1518.00 * 0.075 + (bruto - 1518.00) * 0.09
    elif bruto <= 4190.83:
        inss = 1518.00 * 0.075 + (2793.88 - 1518.00) * 0.09 + (bruto - 2793.88) * 0.12
    else:
        inss = 1518.00 * 0.075 + (2793.88 - 1518.00) * 0.09 + (4190.83 - 2793.88) * 0.12 + (bruto - 4190.83) * 0.14
    return round(inss, 2)
`,
          hint: 'Primeiro achate no teto. Depois if/elif por faixa, somando as faixas anteriores inteiras mais o pedaço da faixa atual.',
          explain: 'Tabela progressiva: cada faixa tributa só o pedaço que cai nela, e o teto limita a base antes do cálculo.',
        },
        {
          type: 'code',
          q: 'Implemente calcular_irrf(base): até 2259.20 isento; até 2826.65 7,5% com dedução 169.44; até 3751.05 15% com dedução 381.44; até 4664.68 22,5% com dedução 662.77; acima 27,5% com dedução 896.00. irrf = base * aliquota - deducao; nunca negativo; arredondado em 2 casas.',
          starter: `def calcular_irrf(base):
    pass
`,
          tests: `assert calcular_irrf(2000) == 0.0, "2000 é isento"
assert calcular_irrf(2746.59) == 36.55, "calcular_irrf(2746.59) deveria ser 36.55"
assert calcular_irrf(3000) == 68.56, "calcular_irrf(3000) deveria ser 68.56"
assert calcular_irrf(4000) == 237.23, "calcular_irrf(4000) deveria ser 237.23"
assert calcular_irrf(5000) == 479.0, "calcular_irrf(5000) deveria ser 479.0"
assert calcular_irrf(0) == 0.0, "base zero deve dar zero, nunca negativo"
`,
          solution: `def calcular_irrf(base):
    if base <= 2259.20:
        aliquota, deducao = 0.0, 0.0
    elif base <= 2826.65:
        aliquota, deducao = 0.075, 169.44
    elif base <= 3751.05:
        aliquota, deducao = 0.15, 381.44
    elif base <= 4664.68:
        aliquota, deducao = 0.225, 662.77
    else:
        aliquota, deducao = 0.275, 896.00
    irrf = base * aliquota - deducao
    if irrf < 0:
        irrf = 0.0
    return round(irrf, 2)
`,
          hint: 'Escolha aliquota e deducao no if/elif, faça a conta uma vez só e proteja contra negativo.',
          explain: 'A parcela a deduzir transforma a tabela progressiva em uma única multiplicação; imposto negativo não existe.',
        },
        {
          type: 'code',
          q: 'As funções calcular_inss e calcular_irrf já estão prontas no starter. Implemente calcular_liquido(bruto, dependentes): base do IRRF = bruto - INSS - dependentes * 189.59; líquido = bruto - INSS - IRRF, arredondado em 2 casas.',
          starter: `TETO_INSS = 8157.41
DEDUCAO_DEPENDENTE = 189.59

def calcular_inss(bruto):
    if bruto > TETO_INSS:
        bruto = TETO_INSS
    if bruto <= 1518.00:
        inss = bruto * 0.075
    elif bruto <= 2793.88:
        inss = 1518.00 * 0.075 + (bruto - 1518.00) * 0.09
    elif bruto <= 4190.83:
        inss = 1518.00 * 0.075 + (2793.88 - 1518.00) * 0.09 + (bruto - 2793.88) * 0.12
    else:
        inss = 1518.00 * 0.075 + (2793.88 - 1518.00) * 0.09 + (4190.83 - 2793.88) * 0.12 + (bruto - 4190.83) * 0.14
    return round(inss, 2)

def calcular_irrf(base):
    if base <= 2259.20:
        aliquota, deducao = 0.0, 0.0
    elif base <= 2826.65:
        aliquota, deducao = 0.075, 169.44
    elif base <= 3751.05:
        aliquota, deducao = 0.15, 381.44
    elif base <= 4664.68:
        aliquota, deducao = 0.225, 662.77
    else:
        aliquota, deducao = 0.275, 896.00
    irrf = base * aliquota - deducao
    if irrf < 0:
        irrf = 0.0
    return round(irrf, 2)

def calcular_liquido(bruto, dependentes):
    pass
`,
          tests: `assert calcular_liquido(3000, 0) == 2710.04, "calcular_liquido(3000, 0) deveria ser 2710.04"
assert calcular_liquido(3000, 2) == 2738.47, "calcular_liquido(3000, 2) deveria ser 2738.47"
assert calcular_liquido(10000, 1) == 7508.21, "calcular_liquido(10000, 1) deveria ser 7508.21"
assert calcular_liquido(2000, 0) == 1842.77, "calcular_liquido(2000, 0) deveria ser 1842.77"
`,
          solution: `TETO_INSS = 8157.41
DEDUCAO_DEPENDENTE = 189.59

def calcular_inss(bruto):
    if bruto > TETO_INSS:
        bruto = TETO_INSS
    if bruto <= 1518.00:
        inss = bruto * 0.075
    elif bruto <= 2793.88:
        inss = 1518.00 * 0.075 + (bruto - 1518.00) * 0.09
    elif bruto <= 4190.83:
        inss = 1518.00 * 0.075 + (2793.88 - 1518.00) * 0.09 + (bruto - 2793.88) * 0.12
    else:
        inss = 1518.00 * 0.075 + (2793.88 - 1518.00) * 0.09 + (4190.83 - 2793.88) * 0.12 + (bruto - 4190.83) * 0.14
    return round(inss, 2)

def calcular_irrf(base):
    if base <= 2259.20:
        aliquota, deducao = 0.0, 0.0
    elif base <= 2826.65:
        aliquota, deducao = 0.075, 169.44
    elif base <= 3751.05:
        aliquota, deducao = 0.15, 381.44
    elif base <= 4664.68:
        aliquota, deducao = 0.225, 662.77
    else:
        aliquota, deducao = 0.275, 896.00
    irrf = base * aliquota - deducao
    if irrf < 0:
        irrf = 0.0
    return round(irrf, 2)

def calcular_liquido(bruto, dependentes):
    inss = calcular_inss(bruto)
    base_irrf = bruto - inss - dependentes * DEDUCAO_DEPENDENTE
    irrf = calcular_irrf(base_irrf)
    return round(bruto - inss - irrf, 2)
`,
          hint: 'Chame calcular_inss, monte a base, chame calcular_irrf e subtraia os dois do bruto.',
          explain: 'Funções pequenas se combinam: o líquido depende do INSS e do IRRF, e a base do IRRF depende do INSS e dos dependentes.',
        },
        { type: 'mc', q: 'Com mais dependentes, o salário líquido tende a:', options: ['Diminuir, pois há mais descontos', 'Aumentar, pois a base do IRRF diminui', 'Ficar igual', 'Depender do INSS'], answer: 1, explain: 'Cada dependente reduz a base de cálculo do IRRF em 189,59, reduzindo o imposto e aumentando o líquido.' },
        { type: 'order', q: 'Ordene as etapas do cálculo do salário líquido.', items: ['Calcular o INSS sobre o bruto', 'Subtrair INSS e dependentes para obter a base do IRRF', 'Calcular o IRRF sobre a base', 'Subtrair INSS e IRRF do bruto'], explain: 'A base do IRRF depende do INSS, e o líquido depende dos dois impostos.' },
      ],
    },
  ],
  exam: {
    passScore: 70,
    questions: [
      { type: 'mc', q: 'Qual comando executa o arquivo folha.py no terminal?', options: ['run folha.py', 'python folha.py', 'folha.py', 'print(folha.py)'], answer: 1, explain: 'O interpretador é chamado com python seguido do nome do arquivo.' },
      { type: 'tf', q: 'No modo interativo (>>>), o Python mostra o valor de uma expressão como 2 + 2 sem precisar de print().', answer: true, explain: 'O modo interativo exibe automaticamente o resultado de cada expressão; em arquivos .py só print() mostra algo.' },
      { type: 'mc', q: 'Qual é o tipo de "3500"?', options: ['int', 'float', 'str', 'bool'], answer: 2, explain: 'Está entre aspas, logo é texto (str), mesmo parecendo número.' },
      { type: 'fill', q: 'O valor especial que representa "ausência de valor" em Python é ___.', answer: ['None'], explain: 'None é o único valor do tipo NoneType; diferente de 0 e de "".' },
      { type: 'mc', q: 'No cálculo do INSS progressivo, o que faz a linha if bruto > TETO_INSS: bruto = TETO_INSS?', options: ['Zera o INSS de quem ganha acima do teto', 'Limita a base de cálculo ao teto: acima dele o desconto não cresce', 'Aplica 14% sobre o salário inteiro', 'Gera erro para salários altos'], answer: 1, explain: 'Acima do teto, o INSS é calculado como se o salário fosse o próprio teto; por isso a base é "achatada" antes das faixas.' },
      { type: 'mc', q: 'Qual o resultado de 1000 % 350?', options: ['2', '300', '2.857', '650'], answer: 1, explain: '% é o resto da divisão inteira: 1000 = 2 * 350 + 300.' },
      { type: 'tf', q: 'round(2.5) devolve 3.', answer: false, explain: 'Python arredonda empates para o par mais próximo: round(2.5) é 2.' },
      { type: 'mc', q: 'O que devolve "SPED_2026.txt"[-4:]?', options: ['".txt"', '"2026"', '"SPED"', '"txt"'], answer: 0, explain: 'Índices negativos contam do fim; [-4:] pega os 4 últimos caracteres.' },
      { type: 'fill', q: 'Para alinhar um valor à direita em 10 posições em uma f-string usamos {valor:___}.', answer: ['>10'], explain: '> alinha à direita e 10 é a largura mínima do campo.' },
      { type: 'mc', q: 'Qual expressão converte corretamente o texto "1500.50" em número para fazer contas?', options: ['int("1500.50")', 'str("1500.50")', 'float("1500.50")', 'number("1500.50")'], answer: 2, explain: 'float() aceita texto com ponto decimal; int() geraria ValueError.' },
      { type: 'tf', q: 'A condição if saldo = 0: é válida em Python.', answer: false, explain: 'Comparação usa ==; com um só = ocorre SyntaxError.' },
      { type: 'mc', q: 'Qual erro aparece ao escrever o bloco do if sem indentação?', options: ['NameError', 'TypeError', 'IndentationError', 'ValueError'], answer: 2, explain: 'A indentação define os blocos; sem ela o Python acusa IndentationError: expected an indented block.' },
      {
        type: 'code',
        q: 'Escreva a função desconto(valor, percentual) que devolve o valor com o desconto percentual aplicado (percentual em %, ex.: 15 para 15%), arredondado em 2 casas.',
        starter: `def desconto(valor, percentual):
    pass
`,
        tests: `assert desconto(4000, 15) == 3400.0, "4000 com 15% de desconto é 3400.0"
assert desconto(100, 0) == 100.0, "sem desconto devolve o valor"
assert desconto(89.90, 10) == 80.91, "89.90 com 10% é 80.91"
`,
        solution: `def desconto(valor, percentual):
    return round(valor * (1 - percentual / 100), 2)
`,
        hint: 'valor * (1 - percentual / 100).',
        explain: 'Descontar p% equivale a multiplicar por (1 - p/100); round(x, 2) ajusta para centavos.',
      },
      {
        type: 'code',
        q: 'Escreva a função status_nota(valor, paga) que devolve "Paga" se paga for True; senão "Vencida alta" se valor > 10000, ou "Vencida" caso contrário.',
        starter: `def status_nota(valor, paga):
    pass
`,
        tests: `assert status_nota(500, True) == "Paga", "nota paga deveria ser Paga"
assert status_nota(50000, True) == "Paga", "nota paga é Paga independentemente do valor"
assert status_nota(15000, False) == "Vencida alta", "nao paga acima de 10000 é Vencida alta"
assert status_nota(10000, False) == "Vencida", "exatamente 10000 nao paga é Vencida"
`,
        solution: `def status_nota(valor, paga):
    if paga:
        return "Paga"
    elif valor > 10000:
        return "Vencida alta"
    else:
        return "Vencida"
`,
        hint: 'Teste paga primeiro; só depois compare o valor.',
        explain: 'A ordem dos ramos importa: a condição mais decisiva (nota paga) vem primeiro, e o valor só é avaliado se não estiver paga.',
      },
      {
        type: 'code',
        q: 'Escreva a função formatar_cpf(digitos) que recebe 11 dígitos como string ("12345678901") e devolve no formato "123.456.789-01" usando fatiamento e f-string.',
        starter: `def formatar_cpf(digitos):
    pass
`,
        tests: `assert formatar_cpf("12345678901") == "123.456.789-01", "12345678901 deveria virar 123.456.789-01"
assert formatar_cpf("00011122233") == "000.111.222-33", "zeros à esquerda devem ser mantidos"
`,
        solution: `def formatar_cpf(digitos):
    return f"{digitos[:3]}.{digitos[3:6]}.{digitos[6:9]}-{digitos[9:]}"
`,
        hint: 'Fatie em [:3], [3:6], [6:9] e [9:], e junte com pontos e hífen numa f-string.',
        explain: 'Fatiamento recorta cada grupo de dígitos sem perder zeros, e a f-string monta o formato final.',
      },
    ],
  },
});
