Nesta lição você vai construir e publicar o seu primeiro projeto de vibe coding: uma **landing page** do escritório com um formulário de contato que envia as respostas para uma planilha ou e-mail. Vai gerar a página com um construtor por prompt (Lovable ou v0) ou com um agente (Claude Code), ajustar texto e estilo por prompt, ligar o formulário a um destino real e publicar. Isso importa porque o primeiro projeto publicado muda a sua relação com a tecnologia: deixa de ser algo que outros fazem.

## O que é uma landing page

Uma **landing page** é uma página única, com um objetivo só: apresentar uma oferta e levar o visitante a uma ação (preencher um formulário, chamar no WhatsApp). Para um escritório contábil, a oferta pode ser "abertura de empresa", "migração de contador" ou "diagnóstico tributário gratuito". É o projeto ideal para começar: só front-end, sem login, resultado visível em minutos.

## Antes de gerar: a especificação

Aplique a lição anterior em versão mínima:

- **Objetivo:** captar contatos de empresas interessadas em [serviço].
- **Seções:** cabeçalho com nome e frase de impacto; três benefícios; como funciona em três passos; formulário (nome, e-mail, telefone, mensagem); rodapé com CNPJ, endereço e link para a política de privacidade.
- **Formulário:** campos obrigatórios exceto mensagem; e-mail validado; ao enviar, mostrar "Recebemos seu contato" e limpar os campos.
- **Destino do formulário:** uma planilha do Google ou o e-mail do escritório.
- **Critérios de aceite:** abre bem no celular; formulário recusa e-mail inválido; a resposta chega ao destino; sem erro no console.

Escreva os textos reais antes. A IA gera texto genérico muito bem, mas genérico não vende; use os serviços, os diferenciais e o tom do seu escritório.

## Caminho A: construtor por prompt

1. Abra o Lovable ou o v0 e cole um prompt de arranque:

```text
Crie uma landing page em português para um escritório contábil chamado [nome], com o
objetivo de captar contatos para o serviço de [serviço]. Seções: cabeçalho com a frase
"[frase]"; três benefícios: [lista]; "como funciona" em três passos: [lista]; formulário
com nome, e-mail, telefone (obrigatórios) e mensagem (opcional), com validação de e-mail;
rodapé com CNPJ [fictício por enquanto] e link "Política de privacidade". Estilo: sóbrio,
azul-escuro e branco, tipografia limpa, totalmente responsivo (adaptado ao celular). Ainda não conecte o formulário
a nada; apenas mostre "Recebemos seu contato" ao enviar.
```

2. Veja o resultado. Peça ajustes um por vez: "aumente o contraste do botão", "troque a frase do cabeçalho por [frase]", "coloque o telefone com máscara (11) 99999-9999".
3. Teste a validação: envie e-mail sem "@"; a página deve recusar.
4. Abra a visualização para celular e confira cada seção.

## Caminho B: agente de terminal

1. Crie uma pasta vazia, por exemplo `landing-escritorio`, e abra o terminal nela. No Windows, um jeito simples é abrir a pasta no Explorador de Arquivos, clicar na barra de endereço, digitar `cmd` e pressionar Enter: o terminal abre já dentro da pasta.
2. Inicie o Claude Code (ou outro agente) e cole o mesmo prompt, acrescentando: "Gere arquivos HTML, CSS e JavaScript simples, sem framework, que abram direto no navegador."
3. Abra o arquivo `index.html` no navegador para ver o resultado. Peça ajustes do mesmo jeito.
4. A vantagem deste caminho é que o código já está na sua pasta, pronto para o versionamento da lição 7.

## Ligar o formulário a um destino

Uma página sem servidor não consegue, sozinha, gravar em planilha ou mandar e-mail. Existem três formas comuns de resolver, do mais simples ao mais flexível:

- **Serviço de formulário**: serviços como Formspree, Web3Forms ou similares recebem o envio do seu formulário HTML e encaminham por e-mail ou para integrações. Você cadastra, recebe um endereço (um *endpoint*) e pede à IA: "faça o formulário enviar para este endpoint por POST". Consulte a documentação atual do serviço escolhido.
- **Automação com webhook**: no Make, Zapier ou n8n, crie um cenário com gatilho "webhook" que grava em uma planilha do Google; a ferramenta fornece um endereço, e o formulário envia para ele. É o mesmo raciocínio da lição de formulários do módulo anterior, só que o formulário agora é seu.
- **Google Apps Script**: um pequeno script ligado à planilha recebe os dados; a IA escreve o script e explica como publicá-lo. Mais passos, nenhum serviço intermediário.

Qualquer que seja o caminho, o prompt é parecido:

```text
Altere o envio do formulário para fazer uma requisição POST em JSON para o endereço
[endpoint], com os campos nome, email, telefone e mensagem. Enquanto envia, desabilite o
botão. Se a resposta for sucesso (status 200), mostre "Recebemos seu contato" e limpe o
formulário; se falhar, mostre "Não foi possível enviar, tente pelo WhatsApp" sem perder o
que foi digitado. Não coloque nenhuma chave secreta no código.
```

Repare nos conceitos da lição 3 aparecendo: POST, JSON, status 200. Você já sabe o que eles significam.

> **Atenção:** o endereço do webhook não é um segredo forte, mas também não deve ser divulgado; quem o tiver pode enviar dados falsos. Serviços de formulário costumam oferecer proteção contra spam; ative.

## Publicar

No construtor por prompt, publicar é um botão; você recebe um endereço provisório. Aproveite para localizar, nas configurações do construtor, a opção de exportar o projeto para o GitHub: mesmo que não a use agora, saber que ela existe é a sua garantia contra o lock-in da lição 2. No caminho do agente, a lição 8 ensina Vercel, Netlify e GitHub Pages; por enquanto, deixe a página pronta na pasta. Em ambos os casos, o domínio próprio vem depois.

Antes de divulgar, passe pelos critérios de aceite, um a um. Envie um contato de teste e confira que chegou na planilha ou no e-mail.

## Erros comuns

- **Texto genérico.** "Soluções contábeis inovadoras" não diz nada. Diga o que o escritório faz, para quem, em quanto tempo.
- **Pedir vários ajustes de uma vez.** A IA aplica uns e esquece outros. Um por prompt.
- **Formulário sem feedback de erro.** Se o envio falhar em silêncio, você perde contatos sem saber.
- **Divulgar antes de testar o envio.** O primeiro cliente real não pode ser o seu teste.

## Na prática

Um escritório publicou uma landing page de "migração de contador" gerada no v0 em uma tarde, com o formulário ligado a uma planilha por webhook do Make. Cada contato novo cria uma linha e avisa o sócio por e-mail. O custo foi o plano gratuito das ferramentas; o primeiro cliente veio em duas semanas.

## Resumo

- Landing page: página única, um objetivo, uma ação; ideal como primeiro projeto.
- Especifique seções, formulário, destino e critérios de aceite antes de gerar; escreva textos reais.
- Gere no construtor por prompt (resultado visual rápido) ou no agente (código na sua pasta); ajuste um item por prompt.
- O formulário envia por POST em JSON para um serviço de formulário, um webhook de automação ou um Apps Script.
- Teste a validação, o envio e o celular antes de divulgar.
