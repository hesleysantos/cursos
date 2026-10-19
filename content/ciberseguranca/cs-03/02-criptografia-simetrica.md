# Criptografia simétrica

Nesta lição você vai entender a **criptografia simétrica**, a tecnologia que protege o disco do seu notebook (BitLocker), o zip com senha que você manda ao cliente e o tráfego HTTPS. Vai aprender o que é o AES, o que são "modos de operação", por que a gestão da chave é o verdadeiro problema e por que **codificar** (base64) não tem nada a ver com **criptografar**.

## A ideia: uma chave para fechar e a mesma para abrir

Criptografia simétrica é um cadeado com uma única chave. Quem cifra e quem decifra usam a **mesma chave secreta**. O texto original chama-se **texto claro**; o resultado ilegível, **texto cifrado**.

```
texto claro + chave  --cifrar-->   texto cifrado
texto cifrado + chave --decifrar--> texto claro
```

A Cifra de César (deslocar cada letra algumas posições) é o exemplo histórico: a "chave" é o número de posições. Ela é inútil hoje porque só existem 25 chaves possíveis. Isso ilustra o **princípio de Kerckhoffs**: o algoritmo pode ser público; toda a segurança tem de estar na chave. Um sistema que depende de "ninguém saber como funciona" não é seguro, apenas obscuro.

## AES: o padrão do mundo

O **AES** (Advanced Encryption Standard) foi padronizado pelo governo dos EUA em 2001, após um concurso público e aberto, e hoje é usado em praticamente tudo. Ele trabalha com blocos de 128 bits e aceita chaves de 128, 192 ou 256 bits.

O tamanho da chave é o que torna a força bruta impossível. Uma chave de 128 bits tem 2¹²⁸ possibilidades, um número com 39 dígitos; mesmo que cada pessoa da Terra testasse um bilhão de chaves por segundo, não terminaria antes de o Sol se apagar. AES-256 é o que a maioria dos produtos oferece hoje.

> **Dica:** quando um produto diz "criptografia de nível militar", geralmente é só AES-256, o mesmo que qualquer zip sério usa. O marketing faz parecer especial; o que diferencia os produtos é **como** guardam a chave.

## Modos de operação (noção)

O AES cifra um bloco de 16 bytes por vez. Para cifrar um arquivo inteiro, é preciso uma regra para encadear os blocos: o **modo de operação**.

| Modo | Como funciona | Situação |
|---|---|---|
| ECB | Cada bloco cifrado de forma independente | Inseguro: blocos iguais geram saída igual, e padrões do arquivo ficam visíveis |
| CBC | Cada bloco depende do anterior | Aceitável, mas não detecta adulteração por si só |
| GCM | Cifra e gera uma "etiqueta" de autenticação | Padrão atual (TLS 1.3, muitos produtos): se alguém mexer no cifrado, a decifração falha |

O caso clássico do ECB é a imagem de um pinguim cifrada: a silhueta continua visível, porque regiões iguais da imagem viram blocos cifrados iguais. Você não precisa implementar modos; precisa saber que "AES" sozinho não diz tudo, e que o modo moderno é o **GCM** (ou a alternativa ChaCha20-Poly1305).

## Onde a criptografia simétrica aparece

- **BitLocker (Windows) e FileVault (macOS):** cifram o disco inteiro com AES. Se o notebook do escritório for roubado, os dados são ilegíveis sem a chave. A chave de recuperação do BitLocker deve ser guardada fora do notebook (na conta Microsoft da empresa ou no cofre de senhas).
- **Zip com senha:** o formato antigo "ZipCrypto" é fraco e quebrável; use ferramentas que ofereçam **AES-256** (7-Zip, WinRAR, WinZip). A senha vira a chave por meio de uma função de derivação.
- **TLS/HTTPS:** depois do aperto de mão inicial (lição 5), todo o tráfego é cifrado com AES-GCM ou ChaCha20, porque algoritmos simétricos são muito rápidos.
- **Backups, nuvem e mensageiros:** serviços sérios cifram os dados em repouso com AES; a pergunta certa é "quem tem a chave: eu ou o provedor?". WhatsApp e Signal cifram mensagens com chaves simétricas trocadas de forma assimétrica (lição 3).

## O verdadeiro problema: gestão de chaves

Cifrar com AES é trivial; o difícil é **combinar a chave com a outra parte sem que ninguém a veja** e depois **guardá-la**. Se você manda um zip com senha para o cliente e, no mesmo e-mail, escreve a senha, a criptografia virou teatro: quem interceptou o e-mail tem os dois.

Regras básicas:

1. Chave e dado cifrado viajam por **canais diferentes** (zip por e-mail, senha por telefone ou mensageiro).
2. Chaves são **longas e aleatórias**, não "Totali2026".
3. Chaves são **trocadas** quando alguém com acesso sai da empresa.
4. Chaves de recuperação (BitLocker, backup) ficam em **cofre**, não em post-it.

A troca de chaves à distância, por canal inseguro, é justamente o problema que a criptografia assimétrica resolve, como veremos na próxima lição.

## Criptografar não é codificar

**Base64** é uma forma de representar bytes usando só 64 caracteres imprimíveis (A–Z, a–z, 0–9, + e /). Ela existe para transportar dados binários em lugares feitos para texto, como anexos de e-mail, o XML da NF-e com imagem embutida ou um token numa URL. Base64 **não tem chave**: qualquer pessoa reverte.

```python
import base64, hashlib

texto = "Senha do cliente: 1234"
b64 = base64.b64encode(texto.encode()).decode()
print(b64)
# U2VuaGEgZG8gY2xpZW50ZTogMTIzNA==

print(base64.b64decode(b64).decode())
# Senha do cliente: 1234      <- reversível, sem segredo algum

h = hashlib.sha256(texto.encode()).hexdigest()
print(h[:20], "...")
# d8d7118e4d84bd233dbf ...     <- irreversível, sem chave
```

Compare os três conceitos:

| Técnica | Precisa de chave? | Reversível? | Para que serve |
|---|---|---|---|
| Codificação (base64, UTF-8) | Não | Sim, por qualquer um | Transportar dados num formato compatível |
| Hash (SHA-256) | Não | Não | Integridade, identificação |
| Criptografia (AES) | Sim | Só com a chave | Sigilo |

Muito sistema antigo "protege" senhas em base64 e chama isso de criptografia. É texto puro disfarçado.

## Erros comuns

- **Senha no mesmo e-mail do arquivo cifrado.** A regra é canal separado.
- **Zip com ZipCrypto.** Peça AES-256 nas opções do compactador.
- **Chave derivada de senha fraca.** AES-256 com senha "123456" é AES-256 quebrado em segundos: o atacante não ataca o AES, ataca a senha.
- **Confundir base64 com cifra.** Base64 esconde do olho, não do computador.
- **Perder a chave.** Dado cifrado sem chave é dado perdido. Backup da chave de recuperação é obrigatório.

## Na prática

- Ative BitLocker em todos os notebooks do escritório e guarde as chaves de recuperação no cofre de senhas.
- Ao enviar documentos sensíveis (IRPF de cliente, folha de pagamento) fora do sistema, use zip AES-256 e mande a senha por outro canal, ou melhor, use um portal seguro com login.
- Ao avaliar um software, pergunte: qual algoritmo e modo, onde fica a chave, quem pode acessá-la.

## Resumo

- Criptografia simétrica usa a mesma chave para cifrar e decifrar; AES é o padrão, com chaves de 128 a 256 bits.
- O modo de operação importa: evite ECB; prefira GCM.
- A segurança está na chave e na sua gestão, não no segredo do algoritmo.
- Base64 é codificação reversível sem chave; não protege nada.
- Hash prova integridade, criptografia garante sigilo, codificação só transporta.
