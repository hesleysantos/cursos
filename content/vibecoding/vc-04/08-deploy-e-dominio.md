Nesta lição você vai aprender a fazer o **deploy** (colocar no ar) de um projeto de vibe coding em Vercel, Netlify ou GitHub Pages, a usar **variáveis de ambiente** para manter segredos fora do código, a ligar um domínio próprio com HTTPS, a entender quando o custo sai de zero e a seguir uma lista de verificação de publicação. Isso importa porque um projeto que só funciona no seu computador não serve ao escritório; publicar com segurança é o que transforma código em ferramenta.

## O que é deploy

**Deploy** é o processo de pegar o código do repositório e colocá-lo em um servidor acessível pela internet. Nos serviços modernos, é automático: você conecta o repositório do GitHub, e a cada push o serviço reconstrói e republica. Isso se chama **deploy contínuo** e combina perfeitamente com o ciclo de vibe coding: iteração testada, commit, push, no ar.

Duas categorias de projeto pedem deploys diferentes:

- **Estático**: só HTML, CSS e JavaScript; o servidor apenas entrega arquivos. Landing page, calculadora, conversor que roda no navegador. Qualquer um dos três serviços hospeda de graça.
- **Com back-end**: tem código que roda no servidor (login, banco de dados, chamadas a APIs com chave secreta). GitHub Pages não serve; Vercel e Netlify têm funções de servidor, e projetos maiores pedem outras plataformas (o módulo seguinte cobre).

## Vercel, Netlify e GitHub Pages

| Serviço | Ponto forte | Observação |
|---|---|---|
| GitHub Pages | Zero configuração para páginas estáticas; já está onde seu código está | Só estático; sem variáveis de ambiente em tempo de execução |
| Netlify | Deploy contínuo simples, formulários nativos, funções de servidor | Plano gratuito com limites de tráfego e execuções; conferir |
| Vercel | Deploy contínuo, funções de servidor, ótimo para projetos gerados por v0 e frameworks modernos | Plano gratuito voltado a uso pessoal; conferir termos para uso comercial |

Os três têm o mesmo fluxo: entrar com a conta do GitHub, importar o repositório, confirmar as configurações detectadas automaticamente e aguardar o primeiro deploy. Em minutos, há um endereço provisório (`nome-do-projeto.vercel.app`, `nome.netlify.app`, `usuario.github.io/projeto`).

Se o deploy falhar, o registro (*log*) do serviço mostra o erro; copie-o inteiro e aplique a lição 6.

## Variáveis de ambiente: segredos fora do código

Uma **variável de ambiente** é um valor que o programa lê do ambiente em que roda, não do código. É assim que uma chave de API chega ao servidor sem estar escrita em nenhum arquivo versionado.

O fluxo:

1. No seu computador, o projeto tem um arquivo `.env` com `AIRTABLE_API_KEY=xxxx`. Esse arquivo está no `.gitignore` e nunca vai para o GitHub.
2. No repositório, há um `.env.example` com `AIRTABLE_API_KEY=` vazio, para documentar que a variável existe.
3. No painel do serviço de deploy, há uma seção de variáveis de ambiente; você cadastra o nome e o valor lá. O servidor lê de lá.
4. O código acessa a variável pelo nome (`process.env.AIRTABLE_API_KEY` em JavaScript no servidor, `os.environ["AIRTABLE_API_KEY"]` em Python).

> **Atenção:** variável de ambiente só protege o segredo se o código que a usa roda no **servidor**. Em uma página estática, qualquer valor embutido no JavaScript é visível para quem abrir o código-fonte no navegador. Se a calculadora precisa chamar uma API com chave secreta, a chamada tem de passar por uma função de servidor. Pergunte à IA: "esta chave ficará exposta no navegador?".

Peça à IA a configuração certa:

```text
O projeto usa a chave da API do Airtable. Configure para que ela seja lida de uma variável
de ambiente chamada AIRTABLE_API_KEY, crie o .env.example, confirme que .env está no
.gitignore e me diga onde cadastrar o valor no painel da [Vercel/Netlify]. Confirme se
alguma parte do código que usa a chave roda no navegador; se sim, mova para uma função
de servidor.
```

## Domínio próprio e HTTPS

O raciocínio é o mesmo do módulo de no-code: você registra o domínio (Registro.br para `.br`), cadastra o domínio no painel do serviço de deploy, ele mostra os registros de DNS necessários, e você os cria no painel do registrador. Em algumas horas, o endereço responde e o certificado HTTPS é emitido automaticamente.

Dicas práticas:

- Use um **subdomínio** por projeto: `calculadora.meuescritorio.com.br`, `portal.meuescritorio.com.br`. Não custa a mais e organiza.
- Configure o redirecionamento de `www` para o domínio sem `www` (ou o contrário), para não ter dois endereços.

## Custo zero → pago

Os planos gratuitos cobrem bem projetos pequenos de um escritório. O custo aparece quando:

- O **tráfego** passa do limite mensal (pouco provável em ferramentas internas, possível em páginas de captação com anúncios).
- O uso deixa de ser **pessoal** e vira comercial, em serviços que diferenciam isso nos termos.
- Você precisa de **funções de servidor** além da cota gratuita, ou de banco de dados gerenciado.
- Você quer **colaboradores** com acesso ao painel.

Consulte a página de preços atual antes de publicar algo que clientes vão usar, e anote em qual limite o seu projeto vai esbarrar primeiro. Para a maioria dos projetos deste módulo, a conta é: domínio anual mais zero.

## Lista de verificação de publicação

Antes de divulgar o endereço, confira item a item:

1. O projeto está em um repositório no GitHub, com `.gitignore` e sem segredos no histórico.
2. O deploy está ligado ao repositório e um push de teste republicou.
3. Variáveis de ambiente cadastradas no painel; nenhuma chave visível no navegador.
4. Endereço provisório testado: todas as telas, o caminho do erro, o celular.
5. Domínio próprio configurado e HTTPS ativo (cadeado).
6. Sem erros no console na versão publicada.
7. Formulários enviando para o destino real; contato de teste recebido.
8. Política de privacidade acessível, se a página coleta dados.
9. Custos conferidos no plano atual; limite mais próximo anotado.
10. Commit marcado como "versão publicada", para saber o que está no ar.

## Erros comuns

- **Chave no JavaScript do navegador.** "Mas está em variável de ambiente" não basta se o código roda no cliente.
- **Testar só no endereço local.** O ambiente publicado tem diferenças (caminhos, HTTPS, variáveis). Teste no ar.
- **Esquecer de republicar.** Alguns serviços exigem novo deploy para aplicar variáveis de ambiente alteradas.

## Na prática

Um escritório publicou a calculadora de honorários na Vercel ligada ao GitHub. Cada melhoria aprovada pelo sócio vira commit, push e, dois minutos depois, está no ar em `calculadora.escritorio.com.br`. Quando a calculadora precisou consultar um CNPJ em uma API com chave, a chamada foi movida para uma função de servidor e a chave para variável de ambiente, sem mudar nada para o usuário.

## Resumo

- Deploy contínuo: conectar o repositório; cada push republica.
- Estático vai para qualquer um dos três; com back-end, Vercel ou Netlify (funções) ou plataformas maiores.
- Variáveis de ambiente mantêm segredos fora do código, mas só protegem o que roda no servidor.
- Domínio próprio por subdomínio, DNS no registrador, HTTPS automático.
- Siga a lista de verificação de publicação antes de divulgar; custo zero até esbarrar em tráfego, uso comercial ou funções.
