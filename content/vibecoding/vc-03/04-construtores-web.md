Nesta lição você vai entender a diferença entre um **site** e um **aplicativo web**, conhecer os construtores web mais usados (Bubble para aplicações com lógica, Framer e Webflow para sites, WordPress quando faz sentido) e aprender o básico de domínio e hospedagem. Isso importa porque é comum um escritório gastar meses construindo um "site" quando precisava de um app, ou o contrário; saber qual é qual evita a ferramenta errada desde o início.

## Site ou app?

Um **site** é principalmente conteúdo: páginas que apresentam o escritório, os serviços, o blog, o contato. Todo visitante vê a mesma coisa. A lógica é mínima: um formulário de contato, talvez um botão de WhatsApp.

Um **aplicativo web** (web app) é principalmente interação: a pessoa entra com login, vê dados que são dela, cria e edita registros, e o que aparece na tela depende de quem está logado e do que já fez. O portal do cliente, o controle de honorários, a calculadora de rescisão com histórico são apps.

A pergunta que decide: **o que o usuário vê depende de quem ele é?** Se não, é site. Se sim, é app. Muitos projetos são os dois: um site institucional na porta da frente e um app atrás do botão "Área do cliente". Nada impede que sejam feitos em ferramentas diferentes.

## Bubble: lógica e workflows

O **Bubble** é o construtor no-code mais completo para aplicações web. Ele reúne as quatro partes da anatomia em um só lugar: tem banco de dados próprio, editor visual de telas, lógica por **workflows** e conectores para integrações.

Um workflow é uma regra do tipo "quando acontece X, faça Y, depois Z". Exemplo: "Quando o usuário clica em Enviar documento → crie um registro na tabela Documentos com o arquivo e o cliente atual → envie um e-mail ao analista responsável → mostre a mensagem 'Recebido'". Você monta isso escolhendo eventos e ações em listas, sem código. É o mesmo raciocínio das automações, mas dentro do próprio app.

O Bubble oferece **condições** em cada elemento ("este botão só aparece se o usuário for administrador") e **estados** (lembrar qual aba está aberta). Isso dá muito poder, e a contrapartida é uma curva de aprendizado maior que a dos construtores de apps internos. Vale a pena quando as regras do seu sistema passam do que Glide ou Softr conseguem.

```text
Quero construir no Bubble um portal onde cada cliente do meu escritório contábil faz login,
vê apenas seus documentos e envia novos arquivos. Descreva, em linguagem de workflow
(evento → ações), os fluxos de: login, listar documentos do cliente atual, enviar um documento
e avisar o analista. Diga também qual regra de privacidade de dados preciso configurar para
que um cliente nunca veja o documento de outro.
```

## Framer e Webflow: sites com acabamento profissional

**Framer** e **Webflow** são construtores de sites. Ambos permitem desenhar páginas com liberdade visual (tipografia, animações, layout para celular) e publicam com hospedagem incluída. Têm também **CMS**, um pequeno banco de conteúdo para blog, serviços ou equipe, que gera uma página por registro.

A diferença prática em 2026: o Framer é mais rápido para quem quer um site bonito sem aprender conceitos de construção; o Webflow expõe mais a estrutura de uma página web (caixas dentro de caixas, estilos reutilizáveis), o que dá mais controle e exige mais aprendizado. Para um site institucional de escritório, qualquer um dos dois resolve.

Ambos **não são para apps**: não têm login com dados por pessoa nem lógica de negócio. Para isso, Bubble ou Softr.

## WordPress: quando faz sentido

O **WordPress** existe há mais de duas décadas e é o sistema de sites mais usado do mundo. Ele faz sentido quando:

- O site vai ter **muito conteúdo** (blog com centenas de artigos) e a equipe quer autonomia para publicar.
- Você precisa de um **plugin específico** que só existe no ecossistema dele, como certas integrações com e-mail marketing ou cursos.
- O escritório já tem um site WordPress e a troca não compensa.

A desvantagem: você passa a ser responsável por hospedagem, atualizações de segurança e plugins que quebram. Em Framer e Webflow isso vem incluso. Para um site novo e simples, WordPress costuma ser mais trabalho do que o necessário.

## Domínio e hospedagem

Dois conceitos que todo projeto publicado envolve:

- **Domínio** é o nome: `meuescritorio.com.br`. Você registra o nome em um registrador (no Brasil, os `.br` passam pelo Registro.br) e paga uma taxa anual. O domínio é seu e vai junto para onde você mudar.
- **Hospedagem** é onde os arquivos do site ficam guardados e são servidos aos visitantes. Nos construtores no-code a hospedagem vem incluída no plano; você só aponta o domínio para ela.

Apontar o domínio significa criar registros de **DNS**: a "agenda telefônica" da internet, que diz que `meuescritorio.com.br` fica em tal servidor. A ferramenta mostra quais registros criar (normalmente um do tipo A ou CNAME); você copia e cola no painel do registrador. A propagação pode demorar algumas horas.

**HTTPS** (o cadeado no navegador) é obrigatório em qualquer site hoje; os construtores emitem o certificado automaticamente. Se o cadeado não aparecer após a configuração, o problema quase sempre é um registro de DNS errado.

## Passos práticos: um site institucional

1. Liste as páginas: início, serviços, sobre, contato. Nada mais no começo.
2. Escreva o texto de cada página antes de desenhar; peça à IA para revisar tom e clareza, mas use informações verdadeiras do escritório.
3. No Framer ou Webflow, parta de um modelo (*template*) próximo do que quer; troque textos, cores e imagens.
4. Confira a versão para celular; a maioria dos visitantes vem dele.
5. Configure o formulário de contato para enviar e-mail ao escritório.
6. Publique no subdomínio gratuito da ferramenta; teste tudo.
7. Registre o domínio, crie os registros de DNS indicados e aguarde o cadeado.

## Erros comuns

- **Construir um app em ferramenta de site.** Login e dados por pessoa pedem Bubble, Softr ou similar.
- **Registrar o domínio em nome da agência.** O domínio deve estar no CNPJ do escritório; perder o controle dele é perder o endereço do negócio.
- **Esquecer o celular.** Testar só no computador esconde botões sobrepostos e textos cortados.

## Na prática

Um escritório publicou um site de quatro páginas no Framer em dois dias e ligou o botão "Área do cliente" a um portal feito no Softr. Para o visitante, é um sistema só; por trás, cada parte usa a ferramenta certa. Quando o portal cresceu e precisou de regras mais complexas, só ele migrou para o Bubble; o site não mudou.

## Resumo

- Site é conteúdo igual para todos; app é interação que depende de quem está logado.
- Bubble constrói apps completos com banco, telas e workflows; curva de aprendizado maior.
- Framer e Webflow fazem sites com acabamento profissional e hospedagem incluída; não são para apps.
- WordPress vale para muito conteúdo ou plugin específico; exige manutenção.
- Domínio é o nome (seu, no Registro.br); hospedagem é onde o site fica; DNS liga um ao outro; HTTPS é obrigatório.
