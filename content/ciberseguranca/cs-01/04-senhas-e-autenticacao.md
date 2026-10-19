Nesta lição você vai aprender o que realmente torna uma senha forte (não é o símbolo), por que reutilizar senha é a vulnerabilidade mais explorada do mundo, como um gerenciador de senhas resolve o problema sem exigir memória e por que a dupla verificação é a medida de maior impacto que você pode adotar hoje. Ao final, vai conhecer as chaves de acesso (passkeys), que começam a substituir senhas.

## O que torna uma senha forte

Durante anos, a orientação foi "oito caracteres com maiúscula, número e símbolo". O resultado foi `Contab@2024`, que qualquer programa de adivinhação testa em segundos, porque segue um padrão previsível: palavra, símbolo, ano. A orientação atual (inclusive do NIST, o instituto americano de padrões que influencia o mundo todo) é outra: **comprimento vale mais que complexidade**.

O motivo é matemático: programas de quebra testam bilhões de combinações por segundo, mas o número de combinações cresce de forma explosiva a cada caractere a mais. Uma senha de 8 caracteres com símbolos pode cair em horas; uma frase de 20 caracteres só com minúsculas leva séculos. Daí a ideia de **frase-senha**: três a cinco palavras aleatórias, fáceis de lembrar e impossíveis de adivinhar.

| Senha | Comprimento | Avaliação |
|---|---|---|
| `123456` | 6 | A mais usada do mundo; quebrada instantaneamente |
| `Contab@2024` | 11 | Padrão previsível; cai em listas de palavras |
| `cavalo-janela-cafe-tambor` | 25 | Frase-senha: forte e memorizável |

Regras práticas: mínimo de 12 caracteres (16 ou mais para e-mail e banco), nada de dados pessoais nem sequências de teclado (`qwerty`) e, acima de tudo, **uma senha diferente para cada serviço**.

## O problema da reutilização

Vazamentos de senhas acontecem o tempo todo: fóruns, lojas virtuais, aplicativos de entrega. Quando um site é invadido, a lista de e-mails e senhas vai parar em bases criminosas, e os atacantes fazem o **credential stuffing**: testam automaticamente aquele par e-mail/senha em centenas de outros serviços (Gmail, bancos, portais do governo). Se você usa a mesma senha, a invasão de um site de receitas vira a invasão do seu e-mail.

Você pode conferir se seu e-mail aparece em vazamentos conhecidos no site **Have I Been Pwned** (`haveibeenpwned.com`), serviço gratuito e respeitado. Se aparecer, troque a senha daquele serviço e de qualquer outro onde ela foi reutilizada.

## Gerenciadores de senhas

Ninguém decora 80 senhas longas e diferentes. Não é para decorar: é para usar um **gerenciador de senhas**, um cofre criptografado que gera, guarda e preenche as senhas. Você lembra apenas uma senha-mestra (uma frase-senha longa) e o gerenciador cuida do resto.

Opções consolidadas: **Bitwarden** (gratuito na versão básica, código aberto, com planos para equipes), **1Password** (pago, muito usado em empresas) e **KeePass** (gratuito, offline, o cofre é um arquivo que você controla). Um gerenciador dedicado funciona em todos os dispositivos e permite compartilhar senhas com a equipe de forma controlada, sem planilha nem grupo de WhatsApp.

Dois cuidados: a senha-mestra precisa ser forte e protegida com dupla verificação; e um gerenciador preenche a senha **só no site correto**, uma defesa extra contra phishing: se ele não oferece a senha do banco naquela página, a página não é a do banco.

## MFA: a segunda camada

A **autenticação de múltiplos fatores** (MFA, ou 2FA quando são dois) exige, além da senha (algo que você sabe), um segundo fator: algo que você tem (celular, chave física) ou algo que você é (digital, rosto). Com MFA, uma senha vazada sozinha não abre a conta, o que barra a imensa maioria dos ataques automatizados.

Nem todo segundo fator é igual:

| Método | Como funciona | Segurança |
|---|---|---|
| SMS | Código por mensagem | Fraco: sujeito a clonagem de chip (SIM swap) e interceptação |
| App autenticador | Código de 6 dígitos que muda a cada 30 s (Google Authenticator, Microsoft Authenticator, Authy) | Bom: o código nasce no celular, sem passar pela operadora |
| Notificação no app | "Foi você?" com Aprovar/Negar | Bom, mas cuidado para não aprovar sem ler |
| Chave física (YubiKey) | Dispositivo USB/NFC | Excelente: resistente a phishing |

Ative MFA nesta ordem: e-mail principal (por ele se recuperam todas as outras senhas), gov.br, internet banking, gerenciador de senhas, Workspace ou Microsoft 365 do escritório, redes sociais. Guarde os **códigos de recuperação** oferecidos ao ativar; sem eles, perder o celular significa perder a conta.

## Chaves de acesso (passkeys)

A **passkey** é o substituto da senha adotado por Google, Apple e Microsoft. Em vez de um segredo que você digita (e que pode ser roubado), o dispositivo guarda uma chave criptográfica e prova que é você com a digital ou o rosto. Não há senha para vazar nem para digitar num site falso, porque a chave só funciona no site de origem. Por baixo, a passkey usa o mesmo padrão aberto das chaves físicas, o **FIDO2**; a diferença é que a chave fica no celular ou no computador, sem aparelho extra. Quando aparecer a opção "criar chave de acesso", vale ativar.

## Erros comuns

- **Trocar senha por obrigação a cada 30 dias.** Isso gera `Senha01`, `Senha02`. Troque quando houver suspeita de vazamento, não por calendário.
- **Anotar a senha-mestra no bloco de notas do celular.** O cofre fica com a chave na porta.
- **Senha compartilhada do escritório.** Não tem dono, não tem rastreio e não muda quando alguém sai.
- **Aprovar notificação de MFA que você não pediu.** Se chegou um "Foi você?" sem você ter tentado entrar, alguém tem sua senha. Negue e troque.

## Na prática

Hoje mesmo: instale um gerenciador, crie uma frase-senha forte como senha-mestra e cadastre as cinco contas mais críticas (e-mail, gov.br, banco, Workspace/365, certificado digital). Ative MFA por aplicativo nessas cinco e guarde os códigos de recuperação em local seguro (impressos, num envelope lacrado). Na semana seguinte, migre o resto. No escritório, use o cofre compartilhado do gerenciador para as senhas de portais, com acesso por pessoa, revogável no dia em que alguém sair.

> **Dica:** a senha do e-mail é a senha-mestra da sua vida: quem controla o e-mail reseta todas as outras. Trate-a como tal.

## Resumo

- Comprimento importa mais que complexidade: use frases-senha de 4 ou 5 palavras, com 16 caracteres ou mais nas contas críticas.
- Nunca reutilize senha; vazamentos de um site são testados em todos os outros (credential stuffing). Confira seu e-mail no Have I Been Pwned.
- Um gerenciador (Bitwarden, 1Password, KeePass) gera e guarda senhas únicas e ainda ajuda contra phishing ao preencher só no site certo.
- MFA por aplicativo autenticador é melhor que por SMS; ative primeiro no e-mail, gov.br, banco e gerenciador, e guarde os códigos de recuperação.
- Passkeys substituem a senha por uma chave no dispositivo, imune a phishing; ative onde estiver disponível.
