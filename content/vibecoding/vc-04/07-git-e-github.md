Nesta lição você vai entender **versionamento** com Git e GitHub de forma prática, sem jargão desnecessário: o que é um commit, o que é um branch, como usar o GitHub Desktop para não precisar do terminal, como desfazer uma mudança ruim e como publicar uma página com GitHub Pages. Isso importa porque, em vibe coding, a IA altera dezenas de arquivos por iteração; sem histórico, uma iteração ruim destrói o que funcionava, e você não tem para onde voltar.

## O problema que o Git resolve

Você já viveu isso com planilhas: `honorarios_final.xlsx`, `honorarios_final_v2.xlsx`, `honorarios_final_v2_corrigido.xlsx`. Cópias manuais, ninguém sabe qual é a certa, e a correção boa de uma versão se perde na outra.

O **Git** é um programa que guarda o histórico de uma pasta: cada vez que você "salva uma versão" (um **commit**), ele registra o que mudou, quando e com qual descrição. Você pode ver qualquer versão antiga, comparar duas versões e voltar a qualquer ponto. Tudo dentro da mesma pasta, sem cópias.

O **GitHub** é um serviço na internet que guarda uma cópia do seu histórico Git: backup, acesso de outro computador, colaboração e, de quebra, hospedagem de páginas. Git é a ferramenta; GitHub é o lugar.

## Os conceitos que você precisa

- **Repositório**: a pasta do projeto com o histórico dentro. Criar um repositório é "ligar o histórico" para uma pasta.
- **Commit**: uma versão salva, com mensagem. "Adiciona validação de CNPJ no formulário". Pequeno e frequente, como um lançamento contábil: cada um descreve uma mudança só.
- **Branch** (ramo): uma linha paralela de trabalho. O ramo principal (`main`) é o que funciona; você cria um ramo para experimentar algo e, se der certo, junta de volta (**merge**). Se der errado, apaga o ramo e o principal nem soube. Para projetos solo, você vai usar pouco; basta saber que existe e para que serve.
- **Push** e **pull**: enviar seus commits para o GitHub e trazer de lá. Push é o backup.
- **Reverter**: voltar um arquivo, ou o projeto inteiro, a um commit anterior.

> **Dica:** o ritmo certo é: antes de pedir uma mudança grande à IA, faça um commit. Depois que a mudança funcionar e passar nos testes, outro commit. Entre os dois, se tudo quebrar, você volta ao primeiro.

## GitHub Desktop: Git sem terminal

O **GitHub Desktop** é um programa gratuito com interface gráfica que faz tudo o que você precisa de Git nesta fase, sem digitar comandos. Os nomes exatos dos botões variam com a versão; use os passos como mapa e a documentação atual como referência.

### Passos práticos: colocar o projeto no Git

1. **Crie uma conta no GitHub** e instale o GitHub Desktop; entre com a conta.
2. **Adicione o repositório**: no GitHub Desktop, escolha criar um repositório novo apontando para a pasta do seu projeto (a landing page da lição 5, por exemplo). Ele cria o histórico ali.
3. **Faça o primeiro commit**: a lista de arquivos aparece como "alterações"; escreva a mensagem "Primeira versão da landing page" e confirme. Pronto: versão 1 registrada.
4. **Publique no GitHub**: o botão de publicar envia o repositório para a sua conta. Marque como **privado** se o projeto tiver qualquer coisa que não deva ser pública.
5. **Trabalhe e repita**: peça uma mudança à IA, teste, volte ao GitHub Desktop, leia as alterações (ele mostra linha a linha o que mudou, em verde e vermelho), escreva a mensagem e confirme. Depois, envie (push).

Ler as alterações antes de confirmar é um hábito poderoso: é o momento em que você percebe que a IA mexeu em um arquivo que não devia.

### Desfazer

- **Mudança ainda não confirmada** e ruim: no GitHub Desktop, descarte as alterações do arquivo (ou de todos). O arquivo volta ao último commit.
- **Commit ruim já feito**: use "reverter este commit"; o Git cria um novo commit que desfaz o anterior. O histórico continua íntegro; nada é apagado.
- **Quero ver como estava semana passada**: abra o histórico, escolha o commit, veja os arquivos.

## O que não vai para o repositório

Alguns arquivos nunca devem ser versionados, e um arquivo chamado `.gitignore` na raiz do projeto lista o que ignorar:

- **Segredos**: arquivos `.env` com chaves de API e senhas. Uma chave enviada ao GitHub, mesmo em repositório privado, deve ser considerada vazada e trocada.
- **Dependências baixadas**: pastas como `node_modules`, recriadas a partir de uma lista.
- **Dados reais de clientes**: use dados fictícios no projeto; dados reais ficam no sistema em produção, protegido.

Peça à IA, no início de todo projeto: "crie um `.gitignore` adequado para este projeto e um arquivo `.env.example` sem valores reais".

## GitHub Pages: publicar uma página estática

O GitHub hospeda gratuitamente páginas **estáticas** (HTML, CSS e JavaScript sem servidor) direto do repositório. A landing page da lição 5 se encaixa.

1. Confira que o `index.html` está na raiz do repositório (ou em uma pasta `docs`, conforme a configuração).
2. No site do GitHub, nas configurações do repositório, localize a seção Pages e escolha o ramo e a pasta de origem.
3. Aguarde alguns minutos; o GitHub mostra o endereço, no formato `seu-usuario.github.io/nome-do-repositorio`.
4. Cada push para o ramo escolhido republica a página automaticamente.

Repositórios privados podem ter restrição de Pages conforme o plano; consulte a documentação atual.

## Por que nunca trabalhar sem versionamento

Três motivos, em ordem de frequência:

1. **A IA quebra o que funcionava.** Acontece toda semana. Com commit, é um clique para voltar.
2. **O computador morre.** Com push, o projeto está no GitHub; instale o Desktop em outra máquina e continue.
3. **Você precisa saber o que mudou.** "Desde quando o cálculo está errado?" tem resposta no histórico.

## Erros comuns

- **Commits gigantes.** "Várias mudanças" não ajuda a voltar nem a entender. Um commit por mudança.
- **Mensagem vazia ou "ajustes".** Descreva o que mudou: "Corrige cálculo de atraso quando vencimento cai no fim de semana".
- **Chave no repositório.** Mesmo privado. Troque a chave imediatamente se acontecer.

## Na prática

Um contador pediu ao agente "melhore o layout" da calculadora e recebeu uma versão que não calculava mais. Em vez de passar a tarde consertando, abriu o GitHub Desktop, reverteu o commit da mudança e refez o pedido com uma instrução menor: "altere apenas o CSS; não toque no JavaScript". Cinco minutos. A versão quebrada continua no histórico, caso queira estudar o que deu errado.

## Resumo

- Git guarda o histórico de uma pasta em commits; GitHub guarda uma cópia na internet.
- Commit pequeno e frequente, com mensagem descritiva; push é o backup.
- Branch é uma linha paralela para experimentar; merge junta de volta.
- GitHub Desktop faz tudo isso sem terminal: alterações, commit, push, reverter, histórico.
- `.gitignore` mantém segredos e dependências fora; GitHub Pages publica páginas estáticas de graça.
