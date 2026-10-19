Nesta lição você vai acompanhar o que acontece quando digita um endereço no navegador: a tradução do nome para IP pelo DNS, o pedido e a resposta HTTP com cabeçalhos e códigos de status, os cookies que mantêm você logado e a camada TLS que transforma HTTP em HTTPS. Ao final, vai saber em que pontos desse caminho um atacante consegue interceptar ou enganar. Importa porque phishing, sites falsos e roubo de sessão exploram exatamente essas etapas.

## Passo 1: DNS, a lista telefônica

Computadores se encontram por IP, mas pessoas decoram nomes. O **DNS** (*Domain Name System*) é a lista telefônica distribuída que converte `cav.receita.fazenda.gov.br` em um endereço IP. Quando você digita o nome, o sistema procura em ordem:

1. No cache do próprio computador (já perguntou há pouco?).
2. No **resolvedor** configurado, normalmente o do provedor ou do roteador, ou um público como `8.8.8.8` (Google) e `1.1.1.1` (Cloudflare).
3. Se o resolvedor não sabe, ele pergunta aos servidores raiz, depois aos responsáveis por `.br`, depois por `gov.br`, até chegar ao servidor **autoritativo** do domínio, que responde com o IP.

Você pode fazer a pergunta manualmente:

```powershell
nslookup gov.br 8.8.8.8
```

```
Não é resposta autoritativa:
Servidor:  dns.google
Address:  8.8.8.8

Nome:    gov.br
Addresses:  2804:151:3:2:161:148:164:31
          161.148.164.31
```

O segundo argumento (`8.8.8.8`) escolhe a quem perguntar; sem ele, o `nslookup` usa o resolvedor da rede (em geral o roteador). As linhas "Servidor" e "Address" confirmam quem respondeu (aqui, o resolvedor do Google). "Não é resposta autoritativa" (em versões mais antigas do Windows, "Resposta não autoritativa", e em outra posição) é normal: significa que o resolvedor respondeu do cache dele, sem ir até o servidor autoritativo. O `gov.br` devolve dois endereços, um IPv6 e um IPv4; os endereços podem mudar com o tempo, então não estranhe se os seus forem outros. O DNS tem vários tipos de registro: **A** (IPv4), **AAAA** (IPv6), **MX** (quem recebe o e-mail do domínio), **TXT** (textos usados por SPF e DMARC, lição 6) e **CNAME** (apelido). Tudo em texto puro, sem criptografia, por padrão.

## Passo 2: HTTP, o pedido e a resposta

Com o IP em mãos, o navegador abre uma conexão TCP na porta 80 (HTTP) ou 443 (HTTPS) e envia um **pedido** em texto:

```
GET /sobre HTTP/1.1
Host: www.gov.br
User-Agent: Mozilla/5.0 (Windows NT 10.0) Chrome/124.0
Cookie: sessao=a81f3c...
```

A primeira linha tem o **método** (GET para buscar, POST para enviar dados de formulário), o caminho e a versão. As linhas seguintes são **cabeçalhos**: pares nome-valor que descrevem o pedido. O `Host` diz qual site se quer (um mesmo IP hospeda vários); o `User-Agent` identifica o navegador; o `Cookie` devolve ao servidor o que ele guardou antes.

O servidor responde no mesmo formato:

```
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Set-Cookie: sessao=a81f3c...; Secure; HttpOnly
Content-Length: 18422

<!doctype html>...
```

O número na primeira linha é o **código de status**. Os que mais aparecem:

| Código | Significado |
|---|---|
| 200 | OK, deu certo |
| 301 / 302 | Redirecionado para outro endereço |
| 401 | Não autenticado (faça login) |
| 403 | Proibido (autenticado, mas sem permissão) |
| 404 | Não encontrado |
| 500 | Erro interno do servidor |

Num log de servidor web, centenas de 404 do mesmo IP em segundos são um robô procurando páginas de administração; dezenas de 401 na página de login são tentativas de senha.

## Cookies e sessões

HTTP não tem memória: cada pedido é independente. Para "lembrar" que você fez login, o site cria uma **sessão** no servidor e entrega ao navegador um **cookie** com o identificador dela (`sessao=a81f3c...`). A cada pedido seguinte, o navegador devolve o cookie e o servidor reconhece você.

Esse identificador é, na prática, uma senha temporária. Quem o copiar entra na sua conta sem senha e sem MFA, porque o login já aconteceu; é o que fazem programas maliciosos que leem os cookies do navegador. Por isso os atributos `Secure` (só por HTTPS) e `HttpOnly` (inacessível aos scripts, os pequenos programas que rodam dentro da página) importam, e por isso fazer logout, que invalida a sessão no servidor, é melhor do que fechar a aba.

## Passo 3: TLS, o lacre do envelope

No HTTP puro, tudo isso viaja em texto legível por qualquer equipamento no caminho. O **TLS** (*Transport Layer Security*) resolve: antes do primeiro pedido, navegador e servidor fazem um **aperto de mão** em que o servidor apresenta um **certificado digital** (emitido por uma autoridade em que o navegador confia, provando que ele controla aquele domínio) e os dois combinam chaves de criptografia. A partir daí, o HTTP viaja cifrado dentro do TLS: é o **HTTPS**.

O TLS garante que ninguém no caminho lê nem altera o conteúdo e que você fala com um servidor que controla o domínio digitado. Não garante que o domínio é honesto: `receita-federal-gov.net` pode ter certificado válido.

## Onde um atacante intercepta

Seguindo o caminho do pacote, estes são os pontos de ataque clássicos:

- **No DNS.** Um roteador invadido ou um Wi-Fi falso responde com o IP errado para o nome do banco. O HTTPS denuncia (o certificado não bate), a menos que a vítima ignore o aviso.
- **Na rede local ou no Wi-Fi.** Alguém na mesma rede captura o tráfego. Com HTTPS, vê apenas para qual domínio você foi; sem HTTPS, vê tudo.
- **Num proxy intermediário.** Um proxy é um intermediário por onde o tráfego passa. Programas maliciosos instalam um certificado próprio na máquina e um proxy para abrir o TLS no meio do caminho. Por isso instalar certificados "do suporte" é perigoso.
- **No próprio navegador.** Uma extensão maliciosa lê a página já decifrada.
- **Na máquina.** Um programa malicioso lê cookies, senhas salvas e o que você digita.

O HTTPS fecha os dois primeiros pontos; os três últimos dependem das defesas do módulo anterior: extensões controladas, conta padrão, antivírus, atualizações.

## Erros comuns

- **Clicar em "continuar mesmo assim" no aviso de certificado.** O aviso significa que o certificado não corresponde ao domínio: ou configuração errada, ou interceptação.
- **Achar que o DNS é só conveniência.** Quem controla o seu DNS controla para onde você vai.
- **Usar HTTP em sistemas internos "porque é só na rede local".** É onde o atacante está depois do acesso inicial.

## Na prática

Abra um portal do governo no navegador, pressione F12 e vá à aba Rede (Network). Recarregue a página e clique no primeiro item: você verá o pedido, os cabeçalhos e o código de status, como nesta lição. Clique no cadeado da barra de endereço e veja o certificado: para quem foi emitido, por quem, até quando. Depois, no PowerShell, rode `nslookup` para o domínio do escritório; na lição 6 ele vai servir para auditar o e-mail.

> **Dica:** domínio certo + cadeado + certificado emitido para aquele domínio é a rotina de dez segundos que evita a maioria das páginas falsas.

## Resumo

- DNS converte nomes em IPs consultando cache, resolvedor e servidores autoritativos; registros A, AAAA, MX, TXT, CNAME; tudo em texto puro por padrão.
- HTTP é pedido e resposta em texto, com método, cabeçalhos e código de status (200, 301, 401, 403, 404, 500).
- Cookies carregam o identificador da sessão; roubado, ele dispensa senha e MFA. Logout invalida a sessão.
- TLS cifra o HTTP e prova que o servidor controla o domínio, não que o domínio é honesto.
- Pontos de interceptação: DNS, rede/Wi-Fi, proxy com certificado falso, extensão do navegador e a própria máquina; o HTTPS resolve só os dois primeiros.
