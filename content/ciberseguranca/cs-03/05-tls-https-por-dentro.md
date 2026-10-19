# TLS/HTTPS por dentro

Nesta lição você vai juntar as peças das lições anteriores (hash, AES, par de chaves, certificados) para entender o que acontece no segundo em que o cadeado aparece no navegador: o **handshake** do TLS, quem emite os certificados dos sites, por que o Let's Encrypt mudou a internet, o que significam os erros de certificado e por que o cadeado **não** garante que o site é honesto.

## O que o TLS protege

**TLS** (Transport Layer Security) é o protocolo que cifra a conexão entre o seu navegador e o servidor. **HTTPS** é simplesmente o HTTP do módulo 2 rodando por dentro do TLS. Ele garante três coisas:

1. **Sigilo:** quem está no meio (Wi-Fi do aeroporto, provedor) vê que você acessou `receita.fazenda.gov.br`, mas não o que enviou ou recebeu.
2. **Integridade:** ninguém altera o conteúdo no caminho.
3. **Autenticidade do servidor:** você está falando com o dono do domínio, não com um impostor no mesmo Wi-Fi.

A versão atual é o **TLS 1.3** (2018). As versões 1.0 e 1.1 foram aposentadas em 2021, e o nome antigo **SSL** só sobrevive no jargão ("certificado SSL").

## O handshake, em visão geral

Antes de qualquer dado, cliente e servidor fazem um aperto de mão de alguns milissegundos:

1. **Cliente:** "Falo TLS 1.3, aceito estes algoritmos; aqui está minha metade da troca de chaves (ECDHE)."
2. **Servidor:** "Escolhi AES-256-GCM; aqui está minha metade da troca e o meu **certificado**."
3. O cliente **valida o certificado**: assinado por AC confiável? No prazo? O nome bate com o domínio digitado? Não foi revogado?
4. O servidor prova que possui a chave privada do certificado assinando parte da conversa.
5. Os dois calculam a mesma **chave de sessão** pelo Diffie-Hellman efêmero (lição 3).
6. A partir daí, tudo é cifrado com AES (lição 2), com código de integridade em cada mensagem.

Repare no esquema híbrido: assimétrica para autenticar e combinar a chave; simétrica para o tráfego. Como a chave de sessão é efêmera, mesmo que a chave privada do servidor vaze no futuro, o tráfego de hoje continua protegido.

A sequência acima é a ordem **lógica**, para entender. No TLS 1.3 real as duas metades trocadas nos passos 1 e 2 já bastam para derivar as primeiras chaves, tanto que o próprio certificado do servidor viaja cifrado; e tudo cabe numa única ida e volta, o que torna o 1.3 mais rápido que o 1.2.

```bash
# Ver o certificado e a cadeia de um site (ferramenta padrão, leitura apenas)
openssl s_client -connect www.gov.br:443 -servername www.gov.br </dev/null 2>/dev/null | openssl x509 -noout -subject -issuer -dates
# subject=CN = www.gov.br
# issuer=C = US, O = Let's Encrypt, CN = R11   (exemplo ilustrativo)
# notBefore=...  notAfter=...
```

## Certificados de sites: quem emite e o que verificam

Os certificados de sites seguem a mesma PKI da lição 4, mas com outra cadeia: as AC-Raiz confiáveis são as que vêm nos navegadores e sistemas (programas de raízes da Mozilla, Google, Apple e Microsoft). A raiz da ICP-Brasil não está em todas essas listas (o Firefox, por exemplo, não a reconhece); por isso até sites do governo usam ACs internacionais no HTTPS. Há três níveis de verificação:

| Tipo | O que a AC verifica |
|---|---|
| **DV** (validação de domínio) | Só que você controla o domínio (registro DNS ou arquivo no site) |
| **OV** (validação de organização) | Domínio + existência da empresa |
| **EV** (validação estendida) | Verificação jurídica mais profunda; hoje sem destaque visual nos navegadores |

A esmagadora maioria dos sites usa DV. Guarde isso para o fim da lição.

## Let's Encrypt e a internet toda em HTTPS

Até 2015, um certificado custava centenas de reais por ano e exigia processo manual; a maioria dos sites comuns ficava em HTTP, e só bancos, lojas e grandes serviços usavam HTTPS. O **Let's Encrypt**, uma AC sem fins lucrativos, passou a emitir certificados DV **gratuitos e automáticos** (protocolo ACME), com validade de 90 dias e renovação por script. Hoje a grande maioria das páginas carregadas usa HTTPS, e os navegadores marcam HTTP como "não seguro". A tendência é encurtar ainda mais a validade (o fórum CA/Browser aprovou reduções progressivas até 47 dias nos próximos anos), para que a automação seja obrigatória e a revogação importe menos.

## Erros de certificado e o que significam

Quando a validação do passo 3 falha, o navegador mostra um aviso. Os códigos mais comuns no Chrome:

| Erro | Significado provável | O que fazer |
|---|---|---|
| `ERR_CERT_DATE_INVALID` | Certificado vencido, ou o relógio do seu computador está errado | Confira a data do PC; se estiver certa, o site esqueceu de renovar |
| `ERR_CERT_AUTHORITY_INVALID` | A AC não é reconhecida (certificado autoassinado, ou um proxy/antivírus interceptando) | Em rede corporativa pode ser o proxy; em Wi-Fi público, suspeite |
| `ERR_CERT_COMMON_NAME_INVALID` | O certificado é de outro domínio | Erro de configuração do servidor ou ataque de redirecionamento |
| `ERR_CERT_REVOKED` | A AC revogou o certificado | Não prossiga |

A regra para o escritório: **nunca clique em "prosseguir mesmo assim" em sites onde se faz login ou se entra com dados**. Se for um sistema interno com certificado autoassinado, a solução é instalar a raiz interna nas máquinas, não ensinar a equipe a ignorar avisos.

## HSTS: fechando a porta do HTTP

Se o usuário digita `banco.com.br` sem `https://`, a primeira conexão sai em HTTP e um atacante na mesma rede pode interceptá-la antes do redirecionamento. O cabeçalho **HSTS** (`Strict-Transport-Security`) manda o navegador lembrar: "por um ano, só me acesse por HTTPS, e não deixe o usuário ignorar erros de certificado". Grandes domínios entram ainda numa lista pré-carregada nos navegadores, eliminando até a primeira conexão insegura.

## Por que HTTPS não significa "site honesto"

Esse é o ponto que mais engana vítimas de phishing. O cadeado prova apenas que a **conexão é cifrada com o dono daquele domínio**. Um golpista registra `receita-federal-regularize.com`, obtém em minutos um certificado DV gratuito e tem um cadeado idêntico ao da Receita. A maioria dos sites de phishing já usa HTTPS.

O cadeado responde "estou falando com quem controla este domínio?"; não responde "este domínio é quem diz ser?". A segunda pergunta você responde conferindo o **domínio** (módulo 2: ler a URL da direita para a esquerda) e a origem do link.

## Erros comuns

- **Confiar no cadeado como selo de legitimidade.** Phishing também tem cadeado.
- **Ignorar avisos de certificado.** É o navegador dizendo que alguém pode estar no meio.
- **Deixar o site do escritório em HTTP.** Documentos enviados pelo formulário viajam em texto claro.
- **Esquecer a renovação.** Certificado vencido derruba site e e-mail; automatize com ACME.

## Na prática

- Verifique se o site e o portal de clientes do escritório têm HTTPS válido, redirecionamento forçado e HSTS (o SSL Labs gera um relatório gratuito).
- Ao receber um link, olhe o domínio antes do cadeado.
- Em rede corporativa com proxy de inspeção, o TI consegue ler o tráfego HTTPS; não é lugar para assuntos pessoais sensíveis.

## Resumo

- TLS dá sigilo, integridade e autenticidade do servidor; HTTPS é HTTP sobre TLS; use 1.2 ou, de preferência, 1.3.
- O handshake valida o certificado e combina uma chave de sessão efêmera; o tráfego vai em AES.
- Certificados de sites são DV na maioria, gratuitos via Let's Encrypt e com validade cada vez menor.
- Erros de certificado indicam vencimento, AC desconhecida, nome errado ou revogação; não prossiga em sites com login.
- HSTS força HTTPS; o cadeado prova a conexão, não a honestidade do site.
