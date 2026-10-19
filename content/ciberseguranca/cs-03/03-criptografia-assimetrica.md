# Criptografia assimétrica

Nesta lição você vai entender a ideia que tornou possível a internet segura: um **par de chaves**, uma pública e uma privada, em vez de uma chave compartilhada. Vai aprender o que são RSA e ECC (sem matemática pesada), a diferença entre **cifrar** e **assinar**, como duas partes que nunca se viram combinam um segredo e por que a assimétrica sempre trabalha em dupla com a simétrica.

## O problema que a simétrica não resolve

Na lição anterior vimos que o AES é imbatível, mas exige que as duas partes já tenham a mesma chave. Como o seu navegador combina uma chave com o servidor do banco se eles nunca se encontraram e a conexão pode estar sendo observada? Mandar a chave pela própria conexão seria entregá-la ao observador.

Em 1976, Whitfield Diffie e Martin Hellman propuseram a solução; em 1977, Rivest, Shamir e Adleman criaram o **RSA**. A ideia: cada pessoa tem **duas chaves matematicamente ligadas**.

## Chave pública e chave privada

- A **chave pública** pode ser distribuída para o mundo inteiro: fica no site, no cartão de visitas, no certificado digital.
- A **chave privada** nunca sai do dono. Está no token A3, no HSM, no arquivo .pfx protegido por senha.

O que uma chave faz, só a outra desfaz. Isso abre dois usos distintos:

| Operação | Quem usa qual chave | Garante |
|---|---|---|
| **Cifrar** | Qualquer um cifra com a **pública** do destinatário; só ele decifra com a **privada** | Sigilo: só o destinatário lê |
| **Assinar** | O dono assina com a **privada**; qualquer um verifica com a **pública** | Autenticidade e integridade: foi ele quem assinou, e o conteúdo não mudou |

Pense numa caixa de correio com fenda: qualquer pessoa coloca cartas (chave pública), mas só o dono tem a chave que abre a caixa (chave privada). Para a assinatura, inverta: um carimbo que só o dono possui, mas cujo desenho todos conhecem e podem conferir.

## Como a assinatura funciona por dentro

Assinar um documento de 200 páginas com RSA seria lento. Por isso a assinatura combina com a lição 1:

1. Calcula-se o **hash** do documento (SHA-256).
2. Aplica-se a chave privada a **esse hash** numa operação matemática de assinatura: o resultado é a assinatura. (No RSA, costuma-se descrever isso como "cifrar o hash com a chave privada"; em ECC a operação é outra, mas a ideia é a mesma: só quem tem a privada produz a assinatura.)
3. Quem recebe calcula o hash do documento de novo e usa a chave pública para verificar se a assinatura corresponde a esse hash. Se a verificação passa, o documento é íntegro e veio do dono da chave.

Esse mecanismo é exatamente o que acontece quando você assina uma declaração com o e-CNPJ do escritório, como veremos na lição 4.

## RSA e ECC (noção)

**RSA** baseia-se na dificuldade de fatorar o produto de dois números primos enormes. Multiplicar dois primos de 300 dígitos é instantâneo; descobrir quais eram, partindo só do produto, é inviável. Chaves RSA seguras hoje têm **2048 bits** no mínimo; 3072 ou 4096 para uso mais longo.

**ECC** (criptografia de curvas elípticas) usa outra estrutura matemática e consegue a mesma segurança com chaves muito menores: uma chave ECC de 256 bits equivale a uma RSA de cerca de 3072 bits. Por isso é mais rápida e consome menos bateria, dominando celulares, TLS 1.3 e mensageiros. Nomes que você verá: **P-256**, **X25519** (troca de chaves) e **Ed25519** (assinaturas).

```bash
# Gerar um par de chaves de teste com OpenSSL (laboratório, uso didático)
openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:2048 -out privada.pem
openssl pkey -in privada.pem -pubout -out publica.pem
# privada.pem: guarde; publica.pem: pode distribuir
```

> **Atenção:** computadores quânticos em larga escala quebrariam RSA e ECC. Por isso o NIST padronizou em 2024 os primeiros algoritmos **pós-quânticos** (ML-KEM e ML-DSA), que já começam a aparecer em navegadores e no TLS. Não é problema para resolver hoje no escritório, mas é por isso que "criptografia para sempre" não existe.

## Troca de chaves: combinando um segredo em público

O protocolo **Diffie-Hellman** permite que duas partes, conversando por um canal que todos escutam, cheguem ao mesmo segredo sem nunca transmiti-lo. A analogia clássica usa tintas: os dois combinam uma cor pública, cada um mistura uma cor secreta própria, trocam as misturas e cada um adiciona de novo a sua cor secreta. Ambos chegam à mesma cor final; quem só viu as misturas intermediárias não consegue separar as tintas.

A versão com curvas elípticas (**ECDHE**, "E" de efêmero) gera um segredo novo a cada conexão. Isso dá o **sigilo futuro** (forward secrecy): se a chave privada do servidor vazar daqui a um ano, as conversas gravadas hoje continuam indecifráveis.

## Por que é lenta e como se combina com a simétrica

Operações RSA e ECC envolvem números gigantes; são centenas ou milhares de vezes mais lentas que o AES. Cifrar um backup de 50 GB com RSA levaria horas. Por isso todo sistema real usa o **esquema híbrido**:

1. Gera-se uma chave simétrica aleatória (a **chave de sessão**).
2. Cifra-se o dado grande com AES e essa chave (rápido).
3. Cifra-se **só a chave de sessão** (32 bytes) com a chave pública do destinatário, ou ela é combinada via Diffie-Hellman.
4. Envia-se o pacote: dado cifrado + chave de sessão cifrada.

É assim no HTTPS, no WhatsApp, no PGP, em tudo. A assimétrica resolve **confiança e distribuição**; a simétrica faz o **trabalho pesado**.

## Erros comuns

- **Confundir qual chave faz o quê.** Sigilo: cifra com a pública do destinatário. Assinatura: assina com a própria privada. Se alguém pede "sua chave privada para verificar a assinatura", está errado ou mal-intencionado.
- **Compartilhar a chave privada.** Enviar o .pfx do e-CNPJ por e-mail ou WhatsApp para "o programador configurar" é entregar a identidade jurídica da empresa.
- **Chaves pequenas.** RSA de 1024 bits é considerado inseguro e não é mais aceito por navegadores nem por ACs; exija 2048 ou mais.
- **Achar que assinatura dá sigilo.** Um documento assinado continua legível por todos. Assinar prova autoria; cifrar esconde conteúdo. São coisas diferentes e podem ser combinadas.

## Na prática

- O certificado digital do escritório é um par de chaves: a pública está no certificado, a privada no token ou no arquivo A1. Trate o arquivo A1 e sua senha como um talão de cheques assinado.
- Quando o sistema contábil "assina o XML" ou o eSocial, está assinando o hash do arquivo com a chave privada; a Receita verifica com a pública.
- SSH (módulo 2) usa o mesmo par para autenticar sem senha: a pública fica no servidor, a privada no seu computador.

## Resumo

- Criptografia assimétrica usa um par: pública (distribuída) e privada (guardada).
- Cifrar com a pública garante sigilo; assinar com a privada garante autenticidade e integridade.
- RSA (fatoração) e ECC (curvas elípticas) são as famílias atuais; ECC é menor e mais rápida.
- Diffie-Hellman permite combinar um segredo por canal público; a versão efêmera dá sigilo futuro.
- Na prática, a assimétrica só protege a chave de sessão; o volume de dados é cifrado com AES.
