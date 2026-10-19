registerModule({
  course: 'ciberseguranca',
  id: 'cs-03',
  order: 3,
  level: 'Intermediário',
  title: 'Criptografia e identidade',
  description: 'Você vai entender hash, criptografia simétrica e assimétrica, certificados digitais (ICP-Brasil, A1/A3) e o que acontece por trás do cadeado HTTPS. Depois, vai aprender como senhas devem ser guardadas no servidor, como funcionam OAuth, SSO e passkeys, e como organizar acessos e segredos do escritório no modelo Zero Trust.',
  hours: 14,
  lessons: [
    // ------------------------------------------------------------------
    {
      id: 'cs-03-01',
      title: 'Funções de hash',
      minutes: 27,
      content: 'content/ciberseguranca/cs-03/01-funcoes-de-hash.md',
      exercises: [
        { type: 'mc', q: 'Qual propriedade de uma função de hash permite publicar o hash de um documento sem revelar o conteúdo?', options: ['Determinismo', 'Unidirecionalidade (resistência a pré-imagem)', 'Rapidez de cálculo', 'Tamanho fixo da saída'], answer: 1, explain: 'Ser unidirecional significa que, a partir do hash, é inviável recuperar a entrada original; por isso o hash pode ser divulgado sem expor o conteúdo.' },
        { type: 'tf', q: 'Um hash SHA-256 de um arquivo de 2 GB é maior do que o hash SHA-256 de uma palavra.', answer: false, explain: 'A saída do SHA-256 tem sempre 256 bits (64 caracteres hexadecimais), independentemente do tamanho da entrada.' },
        { type: 'fill', q: 'Quando duas entradas diferentes produzem o mesmo hash, dizemos que ocorreu uma ___.', answer: ['colisão', 'colisao'], explain: 'Colisão é exatamente isso; em MD5 e SHA-1 ela pode ser fabricada de propósito, por isso os dois foram abandonados.' },
        { type: 'match', q: 'Relacione o algoritmo ao tamanho da saída em caracteres hexadecimais.', pairs: [['MD5', '32'], ['SHA-1', '40'], ['SHA-256', '64']], explain: 'MD5 gera 128 bits, SHA-1 160 bits e SHA-256 256 bits; cada caractere hexadecimal representa 4 bits.' },
        { type: 'mc', q: 'Você baixou o instalador de um programa fiscal e o SHA-256 calculado localmente é diferente do publicado no site oficial. O que isso indica?', options: ['O download está correto, pois hashes nunca são iguais', 'O arquivo foi corrompido ou adulterado; não instale', 'O site usou MD5, então a diferença é normal', 'Seu computador calculou o hash com a chave errada'], answer: 1, explain: 'A mesma entrada sempre gera o mesmo hash. Se o valor diverge, o arquivo que chegou não é o que o fornecedor publicou.' },
        { type: 'order', q: 'Ordene os passos para conferir a integridade de um instalador baixado.', items: ['Baixar o instalador do site oficial (HTTPS)', 'Calcular o hash SHA-256 do arquivo local (Get-FileHash ou sha256sum)', 'Comparar a sequência inteira com o hash publicado pelo fornecedor', 'Instalar somente se os dois forem idênticos'], explain: 'Só dá para calcular o hash depois de ter o arquivo; a comparação com a referência publicada vem antes de qualquer instalação, e a sequência tem de bater por inteiro.' },
        {
          type: 'code',
          q: 'Escreva a função `sha256_hex(texto)` que devolve o hash SHA-256 de uma string em hexadecimal, e a função `confere(texto, esperado)` que devolve True se o hash de `texto` for igual a `esperado` (ignorando maiúsculas/minúsculas).',
          starter: `import hashlib

def sha256_hex(texto):
    pass

def confere(texto, esperado):
    pass
`,
          tests: `assert sha256_hex("abc") == "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad", "sha256_hex('abc') está incorreto; lembre de codificar o texto com encode() e usar hexdigest()"
assert len(sha256_hex("Totali")) == 64, "O hash SHA-256 em hexadecimal tem 64 caracteres"
assert confere("abc", "BA7816BF8F01CFEA414140DE5DAE2223B00361A396177A9CB410FF61F20015AD") is True, "confere deve ignorar maiúsculas/minúsculas"
assert confere("abd", "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad") is False, "Texto diferente deve dar hash diferente e confere deve devolver False"
`,
          solution: `import hashlib

def sha256_hex(texto):
    return hashlib.sha256(texto.encode("utf-8")).hexdigest()

def confere(texto, esperado):
    return sha256_hex(texto) == esperado.lower()
`,
          hint: 'hashlib.sha256(texto.encode()).hexdigest() devolve o hash; para ignorar maiúsculas, compare com esperado.lower().',
          explain: 'Hash trabalha com bytes, por isso o encode(); hexdigest() devolve a representação hexadecimal em minúsculas.',
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'cs-03-02',
      title: 'Criptografia simétrica',
      minutes: 27,
      content: 'content/ciberseguranca/cs-03/02-criptografia-simetrica.md',
      exercises: [
        { type: 'mc', q: 'O que caracteriza a criptografia simétrica?', options: ['Usa uma chave pública para cifrar e uma privada para decifrar', 'Usa a mesma chave secreta para cifrar e decifrar', 'Não usa chave; a segurança está no algoritmo secreto', 'Só funciona para textos curtos'], answer: 1, explain: 'Simétrica significa uma única chave compartilhada entre quem cifra e quem decifra, como um cadeado com uma só chave.' },
        { type: 'tf', q: 'Codificar um texto em base64 protege o conteúdo contra leitura por terceiros.', answer: false, explain: 'Base64 é apenas uma representação de bytes em caracteres imprimíveis; não há chave e qualquer pessoa reverte.' },
        { type: 'fill', q: 'Pelo princípio de Kerckhoffs, o algoritmo pode ser público; toda a segurança deve estar na ___.', answer: ['chave'], explain: 'Se a segurança dependesse do segredo do algoritmo, bastaria vazá-lo uma vez; a chave é o que se mantém secreto.' },
        { type: 'mc', q: 'Por que o modo ECB do AES é considerado inseguro?', options: ['Porque usa chaves de apenas 56 bits', 'Porque blocos iguais do texto claro geram blocos cifrados iguais, revelando padrões', 'Porque não é compatível com AES-256', 'Porque exige uma chave diferente por bloco'], answer: 1, explain: 'No ECB cada bloco é cifrado de forma independente; dados repetidos aparecem repetidos no cifrado, como na famosa imagem do pinguim.' },
        { type: 'match', q: 'Relacione a técnica ao que ela garante.', pairs: [['Base64', 'Transporte de dados binários em formato de texto'], ['SHA-256', 'Integridade (resumo irreversível)'], ['AES', 'Sigilo (só quem tem a chave lê)']], explain: 'Codificação transporta, hash identifica e prova integridade, cifra esconde o conteúdo.' },
        { type: 'mc', q: 'Você envia ao cliente um zip com AES-256 contendo a folha de pagamento. Qual é a forma correta de enviar a senha?', options: ['No mesmo e-mail, logo abaixo do anexo', 'Por outro canal, como telefone ou mensageiro', 'No nome do arquivo, para não esquecer', 'Não precisa de senha, o AES-256 já protege'], answer: 1, explain: 'Chave e dado cifrado devem viajar por canais diferentes; se os dois vão no mesmo e-mail, quem o intercepta tem tudo.' },
        {
          type: 'code',
          q: 'Escreva `codificar(texto)` que devolve a string em base64, `decodificar(b64)` que devolve o texto original, e `hash_hex(texto)` que devolve o SHA-256 em hexadecimal. O objetivo é mostrar que base64 é reversível e hash não.',
          starter: `import base64, hashlib

def codificar(texto):
    pass

def decodificar(b64):
    pass

def hash_hex(texto):
    pass
`,
          tests: `assert codificar("Totali") == "VG90YWxp", "codificar('Totali') deveria devolver 'VG90YWxp'"
assert decodificar("VG90YWxp") == "Totali", "decodificar deve reverter o base64 para o texto original"
assert decodificar(codificar("Senha do cliente: 1234")) == "Senha do cliente: 1234", "codificar seguido de decodificar deve devolver o texto original"
assert hash_hex("Totali") == hashlib.sha256(b"Totali").hexdigest(), "hash_hex deve usar SHA-256 e devolver hexdigest"
assert hash_hex("Totali") != codificar("Totali"), "Hash e base64 são coisas diferentes"
`,
          solution: `import base64, hashlib

def codificar(texto):
    return base64.b64encode(texto.encode("utf-8")).decode("ascii")

def decodificar(b64):
    return base64.b64decode(b64).decode("utf-8")

def hash_hex(texto):
    return hashlib.sha256(texto.encode("utf-8")).hexdigest()
`,
          hint: 'base64.b64encode recebe bytes e devolve bytes; use encode() antes e decode() depois. b64decode faz o caminho inverso.',
          explain: 'Base64 vai e volta sem segredo algum; o hash só vai. Nenhum dos dois é criptografia, porque não existe chave.',
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'cs-03-03',
      title: 'Criptografia assimétrica',
      minutes: 25,
      content: 'content/ciberseguranca/cs-03/03-criptografia-assimetrica.md',
      exercises: [
        { type: 'mc', q: 'Para enviar um documento sigiloso a um cliente usando criptografia assimétrica, você deve cifrá-lo com:', options: ['A sua chave privada', 'A sua chave pública', 'A chave pública do cliente', 'A chave privada do cliente'], answer: 2, explain: 'O que é cifrado com a chave pública do destinatário só é decifrado com a chave privada dele; assim só o cliente lê.' },
        { type: 'mc', q: 'O que uma assinatura digital garante?', options: ['Que só o destinatário consegue ler o documento', 'Que o documento veio do dono da chave privada e não foi alterado', 'Que o documento foi enviado por HTTPS', 'Que o documento está comprimido'], answer: 1, explain: 'Assinar é aplicar a chave privada ao hash do documento; quem verifica com a pública confirma autoria e integridade. Sigilo é outra operação (cifrar com a pública do destinatário).' },
        { type: 'tf', q: 'A criptografia assimétrica é mais rápida que a simétrica, por isso é usada para cifrar arquivos grandes.', answer: false, explain: 'É o contrário: RSA e ECC são centenas de vezes mais lentos que AES; por isso cifram apenas a chave de sessão, e o AES cifra o volume de dados.' },
        { type: 'order', q: 'Ordene as etapas do esquema híbrido usado para enviar um arquivo grande com sigilo.', items: ['Gerar uma chave simétrica aleatória (chave de sessão)', 'Cifrar o arquivo com AES usando a chave de sessão', 'Cifrar a chave de sessão com a chave pública do destinatário', 'Enviar o arquivo cifrado junto com a chave de sessão cifrada', 'O destinatário decifra a chave de sessão com sua chave privada e, com ela, o arquivo'], explain: 'A assimétrica protege apenas a chave de sessão (pequena); a simétrica faz o trabalho pesado sobre o arquivo.' },
        { type: 'fill', q: 'O protocolo ___-Hellman permite que duas partes combinem um segredo comum conversando por um canal público.', answer: ['Diffie'], explain: 'Diffie-Hellman (1976) é a base da troca de chaves; a versão efêmera com curvas elípticas (ECDHE) é usada no TLS 1.3.' },
        { type: 'match', q: 'Relacione o termo à descrição.', pairs: [['RSA', 'Baseado na dificuldade de fatorar o produto de dois primos grandes'], ['ECC', 'Curvas elípticas: mesma segurança com chaves bem menores'], ['Sigilo futuro', 'Vazamento futuro da chave privada não expõe conversas passadas'], ['Chave de sessão', 'Chave simétrica temporária que cifra o volume de dados']], explain: 'RSA e ECC são as famílias assimétricas; sigilo futuro vem das chaves efêmeras; a chave de sessão é a parte simétrica do esquema híbrido.' },
        { type: 'mc', q: 'Um fornecedor pede que o escritório envie o arquivo .pfx do e-CNPJ com a senha "para configurar a integração". Qual é a avaliação correta?', options: ['Normal: o .pfx contém só a chave pública', 'Inaceitável: o .pfx contém a chave privada, ou seja, a identidade jurídica da empresa', 'Aceitável se enviado por WhatsApp em vez de e-mail', 'Aceitável desde que o fornecedor use HTTPS'], answer: 1, explain: 'O arquivo A1 com a senha é a chave privada. Quem a possui assina em nome da empresa; ela não deve ser compartilhada.' },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'cs-03-04',
      title: 'Assinatura digital e certificados',
      minutes: 28,
      content: 'content/ciberseguranca/cs-03/04-assinatura-digital-e-certificados.md',
      exercises: [
        { type: 'mc', q: 'Qual é a função de uma Autoridade Certificadora (AC)?', options: ['Gerar a chave privada do usuário e guardá-la', 'Verificar a identidade do titular e assinar o certificado que liga essa identidade à chave pública', 'Cifrar os documentos enviados à Receita Federal', 'Substituir a assinatura de próprio punho em cartório'], answer: 1, explain: 'A AC é o terceiro confiável: confere documentos e assina o certificado, criando o elo entre identidade e chave pública.' },
        { type: 'match', q: 'Relacione o tipo de certificado à característica.', pairs: [['A1', 'Chave privada em arquivo no computador, validade de 1 ano'], ['A3', 'Chave privada em token, cartão ou nuvem; não pode ser copiada'], ['e-CPF', 'Identifica a pessoa física'], ['e-CNPJ', 'Identifica a pessoa jurídica']], explain: 'A1 é software (copiável), A3 é hardware ou HSM; e-CPF e e-CNPJ diferem pelo titular.' },
        { type: 'tf', q: 'Uma assinatura feita antes da revogação do certificado continua válida; a revogação impede apenas usos futuros.', answer: true, explain: 'Revogar não desfaz assinaturas passadas; por isso o carimbo de tempo é importante para provar que a assinatura foi anterior à revogação.' },
        { type: 'fill', q: 'A ICP-Brasil foi instituída pela Medida Provisória ___ de 2001.', answer: ['2.200-2', '2200-2', '2.200-2/2001', '2200-2/2001'], explain: 'A MP 2.200-2/2001 criou a ICP-Brasil e, no art. 10, § 1º, deu presunção de veracidade aos documentos assinados com certificados da cadeia.' },
        { type: 'mc', q: 'Para que serve o carimbo de tempo em uma assinatura digital?', options: ['Para cifrar o documento com a hora atual', 'Para provar, com hora oficial de uma autoridade credenciada, quando o documento foi assinado', 'Para renovar automaticamente o certificado', 'Para registrar o documento em cartório'], answer: 1, explain: 'O relógio do computador do signatário não é confiável; a Autoridade de Carimbo de Tempo assina o hash junto com a hora oficial.' },
        { type: 'order', q: 'Ordene a cadeia de confiança, da raiz até o certificado do escritório.', items: ['AC-Raiz da ICP-Brasil (ITI)', 'AC de 1º nível', 'AC de 2º nível', 'Certificado e-CNPJ do escritório'], explain: 'Cada certificado é assinado pelo nível acima; a verificação sobe até a raiz, que já está instalada nos sistemas.' },
        { type: 'mc', q: 'Um funcionário que conhecia a senha do certificado A1 do escritório foi desligado. Qual é a providência correta?', options: ['Nenhuma, pois o certificado está no servidor', 'Trocar a senha do Windows dele', 'Revogar o certificado e emitir um novo', 'Esperar o vencimento natural do certificado'], answer: 2, explain: 'Quem teve o arquivo A1 e a senha pode ter copiado a chave privada; a única forma de garantir que ela não será usada é revogar e emitir outro.' },
        { type: 'tf', q: 'Aceitar um contrato clicando em "Concordo" num site tem a mesma presunção legal de veracidade que uma assinatura com certificado ICP-Brasil.', answer: false, explain: 'O clique é assinatura eletrônica simples; só a assinatura qualificada (ICP-Brasil) tem a presunção prevista na MP 2.200-2/2001.' },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'cs-03-05',
      title: 'TLS/HTTPS por dentro',
      minutes: 26,
      content: 'content/ciberseguranca/cs-03/05-tls-https-por-dentro.md',
      exercises: [
        { type: 'mc', q: 'O cadeado HTTPS em um site garante que:', options: ['O site é honesto e pertence a uma empresa idônea', 'A conexão é cifrada com quem controla aquele domínio', 'O site foi auditado pela Receita Federal', 'Não há vírus na página'], answer: 1, explain: 'TLS prova a posse do domínio e cifra o tráfego. Um site de phishing com domínio próprio obtém o mesmo cadeado em minutos.' },
        { type: 'order', q: 'Ordene, na sequência lógica apresentada na lição, o handshake do TLS 1.3.', items: ['Cliente envia algoritmos aceitos e sua metade da troca de chaves', 'Servidor responde com sua metade da troca e o certificado', 'Cliente valida o certificado (AC, prazo, nome, revogação)', 'Os dois calculam a chave de sessão', 'Tráfego passa a ser cifrado com AES'], explain: 'Primeiro a negociação e o certificado, depois a validação, então a chave de sessão e, por fim, o tráfego simétrico.' },
        { type: 'match', q: 'Relacione o erro do navegador à causa provável.', pairs: [['ERR_CERT_DATE_INVALID', 'Certificado vencido ou relógio do computador errado'], ['ERR_CERT_AUTHORITY_INVALID', 'AC não reconhecida (autoassinado ou proxy interceptando)'], ['ERR_CERT_COMMON_NAME_INVALID', 'Certificado emitido para outro domínio'], ['ERR_CERT_REVOKED', 'A AC revogou o certificado']], explain: 'Cada código aponta qual verificação do passo de validação falhou.' },
        { type: 'tf', q: 'O Let\'s Encrypt emite certificados gratuitos de validação de domínio (DV) com validade de 90 dias e renovação automática.', answer: true, explain: 'Foi o que tornou o HTTPS universal: certificado DV gratuito, automático via protocolo ACME, com validade curta.' },
        { type: 'fill', q: 'O cabeçalho ___ instrui o navegador a acessar o site somente por HTTPS durante um período, sem permitir ignorar erros de certificado.', answer: ['HSTS', 'Strict-Transport-Security'], explain: 'HSTS (Strict-Transport-Security) fecha a brecha da primeira conexão em HTTP e dos avisos ignorados.' },
        { type: 'mc', q: 'Ao acessar o internet banking, o navegador mostra ERR_CERT_AUTHORITY_INVALID e o botão "prosseguir mesmo assim". Você está no Wi-Fi de um café. O que fazer?', options: ['Prosseguir, pois bancos costumam ter esse erro', 'Não prosseguir: pode haver alguém interceptando a conexão', 'Digitar a senha rapidamente para não dar tempo ao atacante', 'Atualizar o navegador e prosseguir'], answer: 1, explain: 'AC inválida numa rede pública é o sinal clássico de interceptação (ataque de intermediário). Em sites com login, nunca prossiga.' },
        { type: 'mc', q: 'Por que, no TLS, o tráfego é cifrado com AES e não diretamente com a chave pública do servidor?', options: ['Porque a chave pública é secreta', 'Porque o AES é muito mais rápido; a assimétrica só autentica e combina a chave de sessão', 'Porque navegadores não suportam RSA', 'Porque o AES é mais seguro que o RSA'], answer: 1, explain: 'É o esquema híbrido: a parte assimétrica resolve confiança e troca de chave; a simétrica faz o trabalho pesado com eficiência.' },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'cs-03-06',
      title: 'Senhas no servidor',
      minutes: 29,
      content: 'content/ciberseguranca/cs-03/06-senhas-no-servidor.md',
      exercises: [
        { type: 'mc', q: 'Por que um sistema bem feito não guarda a senha do usuário, apenas um hash com sal?', options: ['Para economizar espaço no banco de dados', 'Porque pode verificar a senha recalculando o hash, e um vazamento não entrega as senhas em claro', 'Porque senhas em texto são proibidas pela Receita Federal', 'Porque o hash é mais rápido de digitar'], answer: 1, explain: 'O sistema compara hash com hash; se o banco vazar, o invasor leva hashes que ainda precisam ser atacados um a um.' },
        { type: 'mc', q: 'Qual é a função do sal (salt) no armazenamento de senhas?', options: ['Manter o hash em segredo', 'Tornar cada hash único, anulando rainbow tables e obrigando ataque individual', 'Aumentar o tamanho da senha para 72 bytes', 'Substituir o uso de MFA'], answer: 1, explain: 'O sal não é secreto; sua função é ser único por usuário, para que senhas iguais gerem hashes diferentes e tabelas pré-calculadas não sirvam.' },
        { type: 'tf', q: 'SHA-256 com sal é a recomendação atual para guardar senhas.', answer: false, explain: 'SHA-256 é rápido demais; para senhas usam-se funções lentas e ajustáveis como Argon2id, bcrypt ou scrypt.' },
        { type: 'fill', q: 'O ataque que testa pares e-mail/senha vazados de um site em outros serviços chama-se credential ___.', answer: ['stuffing'], explain: 'Credential stuffing explora a repetição de senhas; a defesa é senha única por serviço e MFA.' },
        { type: 'match', q: 'Relacione o módulo ou função Python ao uso correto.', pairs: [['secrets.token_hex(16)', 'Gerar um sal aleatório seguro'], ['hmac.compare_digest(a, b)', 'Comparar hashes em tempo constante'], ['random.randint', 'Simulações e jogos, nunca segurança'], ['hashlib.sha256', 'Integridade de arquivos']], explain: 'secrets usa o gerador criptográfico; compare_digest evita ataque de temporização; random é previsível; sha256 serve para integridade, não para senhas.' },
        {
          type: 'code',
          q: 'Escreva `gerar_sal()` que devolve 32 caracteres hexadecimais aleatórios seguros, e `hash_senha(senha, sal, iteracoes=1000)` que aplica HMAC-SHA256 em cadeia: começa com os bytes da senha e, a cada iteração, calcula `hmac.new(sal.encode(), valor_atual, hashlib.sha256).digest()`. Devolva o resultado final em hexadecimal.',
          starter: `import hmac, hashlib, secrets

def gerar_sal():
    pass

def hash_senha(senha, sal, iteracoes=1000):
    pass
`,
          tests: `s1, s2 = gerar_sal(), gerar_sal()
assert len(s1) == 32 and all(c in "0123456789abcdef" for c in s1), "gerar_sal deve devolver 32 caracteres hexadecimais (secrets.token_hex(16))"
assert s1 != s2, "Dois sais gerados devem ser diferentes"
def _ref(senha, sal, n):
    h = senha.encode()
    for _ in range(n):
        h = hmac.new(sal.encode(), h, hashlib.sha256).digest()
    return h.hex()
assert hash_senha("Contab!2026", "ab12", 1000) == _ref("Contab!2026", "ab12", 1000), "hash_senha deve iterar o HMAC exatamente como descrito"
assert hash_senha("Contab!2026", "ab12", 5) == _ref("Contab!2026", "ab12", 5), "O número de iterações deve ser respeitado"
assert hash_senha("Contab!2026", "ab12") != hash_senha("Contab!2026", "cd34"), "Sais diferentes devem gerar hashes diferentes"
assert len(hash_senha("x", "y")) == 64, "O resultado deve ser o hexadecimal de 32 bytes (64 caracteres)"
`,
          solution: `import hmac, hashlib, secrets

def gerar_sal():
    return secrets.token_hex(16)

def hash_senha(senha, sal, iteracoes=1000):
    h = senha.encode()
    for _ in range(iteracoes):
        h = hmac.new(sal.encode(), h, hashlib.sha256).digest()
    return h.hex()
`,
          hint: 'secrets.token_hex(16) dá 32 caracteres. No laço, o resultado .digest() de uma iteração é a entrada da próxima; no fim, use .hex().',
          explain: 'Repetir o HMAC muitas vezes torna cada tentativa mais cara para o atacante, que é a ideia do PBKDF2; o sal garante hashes únicos.',
        },
        {
          type: 'code',
          q: 'Escreva `senha_confere(guardado, tentativa)` que compara dois hashes em hexadecimal usando comparação em tempo constante (sem ==), devolvendo True ou False.',
          starter: `import hmac

def senha_confere(guardado, tentativa):
    pass
`,
          tests: `import inspect
assert senha_confere("abc123", "abc123") is True, "Hashes iguais devem devolver True"
assert senha_confere("abc123", "abc124") is False, "Hashes diferentes devem devolver False"
assert senha_confere("abc", "abc123") is False, "Tamanhos diferentes devem devolver False"
assert "compare_digest" in inspect.getsource(senha_confere), "Use hmac.compare_digest para comparar em tempo constante"
`,
          solution: `import hmac

def senha_confere(guardado, tentativa):
    return hmac.compare_digest(guardado, tentativa)
`,
          hint: 'hmac.compare_digest(a, b) devolve True/False e leva o mesmo tempo independentemente de onde as strings diferem.',
          explain: 'A comparação com == para no primeiro byte diferente e vaza informação pelo tempo; compare_digest evita o ataque de temporização.',
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'cs-03-07',
      title: 'Identidade e acesso (IAM)',
      minutes: 30,
      content: 'content/ciberseguranca/cs-03/07-identidade-e-acesso.md',
      exercises: [
        { type: 'mc', q: 'Qual frase descreve corretamente a diferença entre autenticação e autorização?', options: ['Autenticação define o que você pode fazer; autorização prova quem você é', 'Autenticação prova quem você é; autorização define o que você pode fazer', 'São sinônimos', 'Autorização é feita pelo MFA; autenticação, pelo RBAC'], answer: 1, explain: 'Primeiro o sistema confere a identidade (autenticação); depois decide as permissões (autorização). São etapas distintas.' },
        { type: 'tf', q: 'Ao usar "Entrar com Google" num sistema, o sistema recebe a sua senha do Google para validá-la.', answer: false, explain: 'No OAuth/OIDC o login acontece no Google; o sistema recebe apenas um código que troca por tokens com os escopos autorizados. A senha nunca é compartilhada.' },
        { type: 'order', q: 'Ordene o fluxo de "Entrar com Google" (OAuth 2.0 + OpenID Connect).', items: ['O sistema redireciona você ao Google informando os escopos', 'Você faz login no Google (com o MFA do Google)', 'O Google mostra a tela de consentimento e você permite', 'O Google devolve você ao sistema com um código temporário', 'O sistema troca o código por token de acesso e ID token', 'O sistema cria a sua sessão'], explain: 'O usuário autentica no provedor; o aplicativo só recebe tokens depois do consentimento, trocando o código nos bastidores.' },
        { type: 'fill', q: 'O modelo que atribui permissões a papéis (perfis) e papéis a pessoas é conhecido pela sigla ___.', answer: ['RBAC'], explain: 'Role-Based Access Control: permissões por papel escalam melhor e facilitam revisão e desligamento.' },
        { type: 'mc', q: 'Por que o FIDO2/passkey resiste a phishing enquanto o código TOTP do app não resiste?', options: ['Porque a passkey tem mais dígitos', 'Porque a credencial é amarrada ao domínio real; num site falso o navegador não encontra credencial para usar', 'Porque a passkey expira em 30 segundos', 'Porque a passkey usa SMS como canal'], answer: 1, explain: 'O código TOTP pode ser digitado em qualquer site, inclusive no falso; a assinatura FIDO2 só existe para o domínio cadastrado.' },
        { type: 'match', q: 'Relacione o conceito à descrição.', pairs: [['Menor privilégio', 'Apenas as permissões necessárias, pelo tempo necessário'], ['SSO', 'Um login no provedor de identidade dá acesso a vários sistemas'], ['Escopo (OAuth)', 'Conjunto de permissões que o aplicativo pede ao provedor'], ['Refresh token', 'Renova tokens de acesso de curta duração sem novo login']], explain: 'Cada termo é uma peça do IAM: limitar permissões, centralizar identidade, delimitar o acesso delegado e manter a sessão.' },
        { type: 'mc', q: 'Um app de "organização de tarefas" pede, no "Entrar com Microsoft", permissão para ler, enviar e excluir todos os seus e-mails. Qual é a avaliação correta?', options: ['Normal, todo app precisa disso', 'Desproporcional: os escopos excedem a função do app; não autorize', 'Aceitável se o app tiver HTTPS', 'Aceitável porque a Microsoft verificou o app'], answer: 1, explain: 'Escopos devem ser proporcionais à função. Apps maliciosos usam o consentimento OAuth para obter acesso total à caixa de e-mail sem precisar da senha.' },
        {
          type: 'code',
          q: 'Implemente um RBAC simples: `pode(papel, acao, permissoes)` devolve True se a lista de ações do papel no dicionário `permissoes` contém `acao`, e False se o papel não existe ou não tem a ação.',
          starter: `def pode(papel, acao, permissoes):
    pass
`,
          tests: `P = {"auxiliar": ["lancar_nota", "consultar_nota"], "gerente": ["lancar_nota", "consultar_nota", "fechar_periodo"], "admin": ["criar_usuario"]}
assert pode("auxiliar", "lancar_nota", P) is True, "auxiliar pode lancar_nota"
assert pode("auxiliar", "fechar_periodo", P) is False, "auxiliar não pode fechar_periodo"
assert pode("gerente", "fechar_periodo", P) is True, "gerente pode fechar_periodo"
assert pode("estagiario", "consultar_nota", P) is False, "Papel inexistente não tem permissão alguma"
assert pode("admin", "lancar_nota", P) is False, "admin não tem lancar_nota neste exemplo: cada papel só tem o que foi listado"
`,
          solution: `def pode(papel, acao, permissoes):
    return acao in permissoes.get(papel, [])
`,
          hint: 'permissoes.get(papel, []) devolve a lista do papel ou uma lista vazia; depois verifique se acao está nela.',
          explain: 'Negar por padrão (papel desconhecido = sem permissões) é o princípio do menor privilégio aplicado ao código.',
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'cs-03-08',
      title: 'Zero Trust e gestão de segredos',
      minutes: 28,
      content: 'content/ciberseguranca/cs-03/08-zero-trust-e-segredos.md',
      exercises: [
        { type: 'mc', q: 'Qual é a premissa central do modelo Zero Trust?', options: ['Quem está na rede interna é confiável', 'A rede está sempre potencialmente comprometida; cada acesso é verificado individualmente', 'Basta um firewall forte no perímetro', 'Usuários com VPN não precisam de MFA'], answer: 1, explain: 'Zero Trust abandona a confiança por localização: identidade, dispositivo e contexto são verificados a cada acesso.' },
        { type: 'tf', q: 'Se uma chave de API foi enviada por engano para um repositório Git, basta apagar o commit para resolver o problema.', answer: false, explain: 'O histórico do Git e cópias já feitas guardam a chave. Segredo exposto é comprometido: revogue e gere outro.' },
        { type: 'fill', q: 'A política que permite o acesso ao e-mail só se o usuário tem MFA, o dispositivo é gerenciado e o login vem do Brasil chama-se acesso ___.', answer: ['condicional'], explain: 'Acesso condicional avalia contexto (identidade, dispositivo, local) a cada login; é a implementação prática do Zero Trust em Microsoft 365 e Google Workspace.' },
        { type: 'match', q: 'Relacione o segredo ao local correto de armazenamento.', pairs: [['Senha do e-CAC usada pela equipe', 'Cofre compartilhado do gerenciador de senhas'], ['Chave de API usada por um script', 'Variável de ambiente ou cofre de segredos'], ['Chave de recuperação do BitLocker', 'Gerenciador de senhas ou conta corporativa, fora do notebook'], ['Chave privada do certificado A3', 'Token ou HSM, nunca copiada']], explain: 'Cada segredo tem um cofre adequado; nenhum deles é código, planilha ou e-mail.' },
        { type: 'mc', q: 'Qual medida de segmentação é a mais eficaz contra ransomware que criptografa o servidor de arquivos?', options: ['Trocar o nome do Wi-Fi', 'Manter backups em local que a conta do dia a dia não consegue apagar (imutáveis ou offline)', 'Usar base64 nos backups', 'Desligar o antivírus para acelerar o backup'], answer: 1, explain: 'O ransomware moderno procura e destrói backups acessíveis; backups isolados ou imutáveis garantem a recuperação sem pagar resgate.' },
        { type: 'order', q: 'Ordene as providências ao descobrir que uma senha de API foi publicada num repositório.', items: ['Revogar a chave exposta no provedor', 'Gerar uma nova chave e guardá-la no cofre ou variável de ambiente', 'Atualizar o script para ler a chave do ambiente', 'Remover o segredo do histórico e adicionar .env ao .gitignore', 'Verificar nos logs se a chave exposta foi usada indevidamente'], explain: 'A prioridade é invalidar o segredo; depois, corrigir a causa (código lendo do ambiente) e investigar se houve uso indevido.' },
        {
          type: 'code',
          q: 'Escreva `linhas_com_segredo(texto)` que recebe o conteúdo de um arquivo e devolve a lista de números de linha (começando em 1) em que aparece uma atribuição suspeita: a linha contém, ignorando maiúsculas, uma das palavras `senha`, `password`, `api_key` ou `token` seguida, em algum ponto depois, de `=`. Ignore linhas que começam com `#`.',
          starter: `def linhas_com_segredo(texto):
    pass
`,
          tests: `arq = """import os
# senha = 'comentario, ignorar'
senha_api = "k3yS3cr3t"
usuario = "raoni"
API_KEY=abc123
nome_token = 'x'
total = 10
password: "nao e atribuicao"
"""
assert linhas_com_segredo(arq) == [3, 5, 6], "Esperado [3, 5, 6]: senha_api, API_KEY e nome_token têm palavra suspeita seguida de ="
assert linhas_com_segredo("x = 1\\ny = 2") == [], "Sem palavras suspeitas, lista vazia"
assert linhas_com_segredo("TOKEN = os.environ.get('TOKEN')") == [1], "A comparação ignora maiúsculas"
assert linhas_com_segredo("valor = token") == [], "O = tem de vir depois da palavra suspeita; em 'valor = token' ele vem antes"
`,
          solution: `def linhas_com_segredo(texto):
    chaves = ["senha", "password", "api_key", "token"]
    achadas = []
    for n, linha in enumerate(texto.splitlines(), start=1):
        if linha.lstrip().startswith("#"):
            continue
        baixa = linha.lower()
        for c in chaves:
            pos = baixa.find(c)
            if pos != -1 and "=" in baixa[pos:]:
                achadas.append(n)
                break
    return achadas
`,
          hint: 'Percorra texto.splitlines() com enumerate(start=1); converta para minúsculas; para cada palavra, use find() e verifique se há "=" no trecho depois dela.',
          explain: 'É uma versão simplificada da varredura de segredos que o GitHub e ferramentas como gitleaks fazem: procurar padrões de atribuição de credenciais antes que cheguem ao repositório.',
        },
      ],
    },
  ],
  exam: {
    passScore: 70,
    questions: [
      { type: 'mc', q: 'Qual característica torna MD5 e SHA-1 inadequados para assinaturas e verificação de integridade com valor de segurança?', options: ['Saída muito longa', 'É possível fabricar colisões: dois arquivos diferentes com o mesmo hash', 'São lentos demais', 'Não funcionam em Windows'], answer: 1, explain: 'Colisões práticas foram demonstradas (MD5 em 2004, SHA-1 em 2017), o que permite trocar um documento por outro "igualmente assinado".' },
      { type: 'tf', q: 'Hash e criptografia são a mesma coisa, pois ambos transformam o texto em algo ilegível.', answer: false, explain: 'Criptografia tem chave e é reversível por quem a possui; hash não tem chave e é irreversível.' },
      { type: 'mc', q: 'Qual combinação representa o uso correto e moderno da criptografia simétrica?', options: ['AES em modo ECB', 'AES-256 em modo GCM', 'Cifra de César com chave 13', 'Base64 com senha'], answer: 1, explain: 'AES-GCM cifra e autentica; ECB vaza padrões; César e base64 não são criptografia séria.' },
      { type: 'fill', q: 'Na criptografia assimétrica, para assinar um documento usa-se a chave ___ do signatário.', answer: ['privada'], explain: 'A assinatura é feita com a chave privada e verificada por qualquer um com a chave pública correspondente.' },
      { type: 'mc', q: 'Por que sistemas reais combinam criptografia assimétrica e simétrica?', options: ['Porque a simétrica não é segura sozinha', 'Porque a assimétrica é lenta: ela protege só a chave de sessão, e a simétrica cifra os dados', 'Porque a assimétrica não funciona na internet', 'Porque a lei exige as duas'], answer: 1, explain: 'É o esquema híbrido: RSA/ECC resolvem confiança e troca de chaves; AES faz o trabalho pesado com rapidez.' },
      { type: 'match', q: 'Relacione o termo da ICP-Brasil à descrição.', pairs: [['AC-Raiz', 'Topo da cadeia de confiança, operada pelo ITI'], ['A1', 'Certificado em arquivo, validade de 1 ano'], ['A3', 'Certificado em token, cartão ou nuvem'], ['LCR', 'Lista de certificados revogados publicada pela AC']], explain: 'A cadeia sobe até a AC-Raiz; A1 e A3 diferem pelo local da chave privada; a LCR (ou OCSP) informa revogações.' },
      { type: 'mc', q: 'Qual norma dá presunção de veracidade aos documentos assinados com certificado ICP-Brasil?', options: ['Lei 12.737/2012', 'MP 2.200-2/2001', 'Lei 13.709/2018 (LGPD)', 'Marco Civil da Internet'], answer: 1, explain: 'A MP 2.200-2/2001 instituiu a ICP-Brasil e, no art. 10, § 1º, estabeleceu a presunção de veracidade.' },
      { type: 'mc', q: 'Um site de phishing que imita a Receita Federal exibe o cadeado HTTPS válido. Isso é possível porque:', options: ['O golpista roubou o certificado da Receita', 'Certificados DV só provam o controle do domínio, e qualquer domínio registrado obtém um gratuitamente', 'O navegador está com defeito', 'HTTPS não usa certificados'], answer: 1, explain: 'O cadeado atesta a conexão cifrada com o dono do domínio registrado pelo golpista, não a honestidade do site.' },
      { type: 'tf', q: 'O HSTS faz o navegador lembrar que um domínio só deve ser acessado por HTTPS, mesmo que o usuário digite o endereço sem https://.', answer: true, explain: 'Strict-Transport-Security elimina a primeira conexão insegura e impede ignorar erros de certificado durante o prazo definido.' },
      { type: 'mc', q: 'Um sistema de folha on-line envia a sua senha atual por e-mail quando você clica em "esqueci a senha". O que isso revela?', options: ['Que o sistema usa Argon2id', 'Que o sistema guarda senhas em texto claro ou de forma reversível', 'Que o sistema usa HTTPS', 'Nada; é o procedimento padrão'], answer: 1, explain: 'Com hash de senha correto, o sistema não conhece a senha e só pode oferecer redefinição por link; devolver a senha atual indica armazenamento inseguro.' },
      { type: 'order', q: 'Ordene os passos de verificação de senha num servidor bem projetado.', items: ['Buscar no banco o sal e o hash guardados do usuário', 'Calcular a função lenta (Argon2id/bcrypt) sobre sal + senha digitada', 'Comparar o resultado com o hash guardado em tempo constante', 'Criar a sessão se os valores coincidirem'], explain: 'O servidor nunca compara senhas; compara hashes, usando o sal do usuário e comparação sem vazamento de tempo.' },
      { type: 'mc', q: 'No fluxo "Entrar com Google", o que o sistema recebe do Google após o consentimento do usuário?', options: ['A senha do usuário no Google', 'Um código que é trocado por tokens com os escopos autorizados', 'Uma cópia da caixa de e-mail', 'O certificado digital do usuário'], answer: 1, explain: 'OAuth 2.0/OIDC entregam um código temporário trocado por token de acesso e ID token; a senha fica só no provedor.' },
      { type: 'mc', q: 'Qual forma de MFA resiste a sites de phishing que repassam códigos em tempo real?', options: ['Código por SMS', 'Código TOTP de aplicativo', 'Passkey ou chave física FIDO2', 'Pergunta de segurança'], answer: 2, explain: 'A credencial FIDO2 é vinculada ao domínio real; num site falso não há credencial para usar, diferentemente de um código digitável.' },
      { type: 'code', q: 'Escreva `hash_hex(texto)` que devolve o SHA-256 em hexadecimal e `iguais(a, b)` que compara dois hashes em tempo constante com hmac.compare_digest.', starter: `import hashlib, hmac

def hash_hex(texto):
    pass

def iguais(a, b):
    pass
`, tests: `assert hash_hex("abc") == "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad", "hash_hex('abc') incorreto"
assert iguais(hash_hex("abc"), hash_hex("abc")) is True, "Hashes iguais devem devolver True"
assert iguais(hash_hex("abc"), hash_hex("abd")) is False, "Hashes diferentes devem devolver False"
import inspect
assert "compare_digest" in inspect.getsource(iguais), "Use hmac.compare_digest em iguais"
`, solution: `import hashlib, hmac

def hash_hex(texto):
    return hashlib.sha256(texto.encode("utf-8")).hexdigest()

def iguais(a, b):
    return hmac.compare_digest(a, b)
`, hint: 'hashlib.sha256(texto.encode()).hexdigest() e hmac.compare_digest(a, b).', explain: 'SHA-256 para integridade; compare_digest para evitar vazar informação pelo tempo de comparação.' },
      { type: 'mc', q: 'Qual prática está de acordo com Zero Trust e boa gestão de segredos?', options: ['Guardar a senha do banco no script porque o servidor é interno', 'Liberar acesso total a quem está conectado na VPN', 'Ler segredos de variável de ambiente ou cofre, exigir MFA e revisar permissões por papel', 'Enviar o .pfx do A1 por e-mail com a senha em outro e-mail'], answer: 2, explain: 'Zero Trust verifica cada acesso e aplica menor privilégio; segredos ficam em cofres ou ambiente, nunca em código ou e-mail.' },
    ],
  },
});
