# Senhas no servidor

Nesta lição você vai ver o outro lado da senha: o que um sistema bem feito guarda quando você cria uma conta, como ele confere a senha sem conhecê-la e por que, quando um site vaza, alguns vazamentos são catástrofe e outros quase inofensivos. Vai aprender o que é **sal**, por que bcrypt, scrypt e Argon2 são **lentos de propósito**, como funcionam os ataques de dicionário, força bruta e rainbow table, e o que é **credential stuffing**, a razão prática para nunca repetir senhas.

## O que o servidor nunca deveria guardar

A regra: **um sistema não precisa saber a sua senha para verificá-la**. Ele guarda um hash e, no login, calcula o hash do que você digitou e compara. Se o banco de dados vazar, o invasor leva hashes, não senhas.

Guardar senhas em texto claro (ou em base64, como vimos na lição 2) é a falha mais grave possível: um vazamento entrega todas as contas, e, como as pessoas repetem senhas, entrega contas em outros serviços também.

## Por que SHA-256 puro não basta

Hash resolve metade do problema. A outra metade é que o SHA-256 é **rápido**: uma placa de vídeo comum calcula bilhões de hashes por segundo. Com essa velocidade, três ataques funcionam:

- **Dicionário:** testar listas de senhas comuns ("123456", "senha", nomes, times, datas) e variações ("Senha@2026"). Resolve a maioria das senhas humanas em minutos.
- **Força bruta:** testar todas as combinações. Para uma senha de 8 caracteres só de letras minúsculas, são 2×10¹¹ possibilidades: segundos numa GPU.
- **Rainbow table:** tabelas pré-calculadas de hash → senha para bilhões de senhas. O atacante nem calcula; só consulta.

O vazamento do LinkedIn de 2012 é o caso clássico: 6,5 milhões de hashes SHA-1 **sem sal**; a maioria foi recuperada em dias.

## Sal: tornando cada hash único

O **sal** (salt) é um valor aleatório gerado para cada usuário e guardado ao lado do hash. O que se armazena é `hash(sal + senha)`, mais o sal em claro. Consequências:

1. Dois usuários com a mesma senha têm hashes diferentes (o invasor não descobre "essas 500 contas usam 123456" de uma vez).
2. Rainbow tables ficam inúteis: seria preciso uma tabela por sal.
3. Cada senha tem de ser atacada individualmente.

O sal **não é segredo**; sua função é ser único. O que torna o ataque caro é o próximo ingrediente.

## Lento de propósito: bcrypt, scrypt e Argon2

A ideia é usar uma função que leve, digamos, 100 milissegundos por tentativa. Para o usuário legítimo, que erra a senha duas vezes, é imperceptível. Para o atacante, que precisa de bilhões de tentativas, é a diferença entre minutos e séculos.

| Algoritmo | Ano | Característica | Situação |
|---|---|---|---|
| PBKDF2 | 2000 | Repete um HMAC milhares de vezes | Aceitável; ainda recomendado por normas governamentais |
| bcrypt | 1999 | Custo ajustável; muito difundido | Bom; limite de 72 bytes na senha |
| scrypt | 2009 | Exige muita memória, dificultando GPUs | Bom |
| **Argon2id** | 2015 | Vencedor da Password Hashing Competition; custo em tempo **e** memória | Recomendação atual da OWASP |

Todos têm um **fator de custo** que o administrador aumenta com o tempo, conforme o hardware fica mais rápido. O resultado armazenado costuma trazer algoritmo, custo, sal e hash numa string só, como `$argon2id$v=19$m=65536,t=3,p=4$...`.

## Simulando a ideia em Python

O navegador deste curso não tem `pbkdf2_hmac`, mas a ideia de "repetir um HMAC muitas vezes" pode ser reproduzida com `hmac`:

```python
import hmac, hashlib, secrets

def hash_senha(senha, sal, iteracoes=10000):
    h = senha.encode()
    for _ in range(iteracoes):
        h = hmac.new(sal.encode(), h, hashlib.sha256).digest()
    return h.hex()

sal = secrets.token_hex(16)          # 16 bytes aleatórios -> 32 caracteres hex
guardado = hash_senha("Contab!2026", sal)
print(sal, guardado[:16])

# No login:
tentativa = hash_senha("Contab!2026", sal)
print(hmac.compare_digest(guardado, tentativa))   # True
```

Dois detalhes importantes:

- **`secrets`, não `random`.** O módulo `random` é previsível e serve para jogos e simulações; `secrets` usa o gerador criptográfico do sistema e é o único adequado para sal, tokens e senhas temporárias.
- **`hmac.compare_digest`, não `==`.** A comparação normal de strings para no primeiro caractere diferente, então demora um pouquinho mais quando os primeiros caracteres batem. Um atacante que mede esses microssegundos consegue, em teoria, descobrir o hash byte a byte (**ataque de temporização**). `compare_digest` leva sempre o mesmo tempo.

## Vazamentos e credential stuffing

Quando um site vaza, as senhas recuperadas vão para listas públicas com bilhões de pares e-mail/senha. O **credential stuffing** é o ataque automatizado que testa esses pares em outros serviços: bancos, e-mail, e-commerce, sistemas de governo. Como grande parte das pessoas repete senhas, a taxa de sucesso é suficiente para ser lucrativo. Não é "hackear" o banco; é usar a senha que você mesmo repetiu.

O site **Have I Been Pwned** permite conferir se um e-mail aparece em vazamentos conhecidos, e gerenciadores de senhas fazem essa checagem automaticamente. A defesa, já vista no módulo 1, é simples: senha única por serviço (gerenciador) e MFA.

## Erros comuns

- **Hash rápido para senhas.** MD5, SHA-1 ou SHA-256 puros, com ou sem sal, são inadequados para senhas: use Argon2id, bcrypt ou scrypt.
- **Sal fixo ou "pimenta" só.** Um sal igual para todos equivale a nenhum sal.
- **Limitar o tamanho da senha para baixo.** "Máximo 8 caracteres" é sinal de sistema antigo, provavelmente guardando em claro.
- **"Esqueci a senha" que manda a senha atual por e-mail.** Só é possível se o sistema a guarda em claro. Sistema correto manda um link de redefinição com prazo.
- **Comparar hashes com `==`.** Use comparação em tempo constante.

## Na prática

- Ao contratar um sistema (ERP, portal do cliente, folha on-line), pergunte: como as senhas são armazenadas? A resposta esperada é "Argon2id" ou "bcrypt". Se a resposta for "criptografadas" sem detalhe, insista.
- Faça o teste do "esqueci a senha": se o sistema devolve a senha atual, troque-a imediatamente e trate o sistema como inseguro.
- Nas senhas do escritório (e-CAC, bancos, sistema contábil), use gerenciador com alerta de vazamento; nunca reaproveite a senha do e-mail.
- Em scripts internos que geram senhas iniciais ou tokens, use `secrets`.

## Resumo

- O servidor guarda hash com sal, nunca a senha; verifica recalculando.
- Sal único por usuário anula rainbow tables e obriga ataque individual.
- Funções lentas e ajustáveis (Argon2id, bcrypt, scrypt, PBKDF2) tornam dicionário e força bruta inviáveis.
- Use `secrets` para aleatoriedade e `hmac.compare_digest` para comparar sem vazar tempo.
- Credential stuffing explora senhas repetidas; a defesa é senha única e MFA.
