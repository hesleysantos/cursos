Nesta lição você vai aprender a especificar antes de gerar: escrever um **PRD** curto (documento de requisitos do produto), histórias de usuário, critérios de aceite, telas descritas em texto e o modelo de dados. Vai ver um exemplo completo para um "controle de honorários" e montar o **prompt de arranque** que abre o projeto na ferramenta de vibe coding. Isso importa porque a IA constrói exatamente o que foi descrito; o que não foi escrito, ela inventa, e o que ela inventa raramente é o que o seu escritório precisa.

## Por que especificar

No módulo de engenharia de prompt você viu que contexto e critérios melhoram qualquer resposta. Em vibe coding, isso vale em dobro: um projeto tem dezenas de decisões (quais campos, quais regras, o que acontece no erro), e cada decisão não escrita vira uma suposição da IA. Especificar é tomar essas decisões antes, em texto simples, para que cada iteração tenha um alvo.

A analogia é o contrato de prestação de serviços: ninguém começa a escriturar sem saber o escopo. O PRD é o contrato entre você e a IA.

## O PRD curto

Um **PRD** (do inglês *product requirements document*) descreve o que o sistema faz e para quem. Para projetos de vibe coding, uma página basta, com estas seções:

1. **Objetivo**: uma frase. O problema que resolve.
2. **Usuários**: quem usa e em que situação.
3. **Funcionalidades**: lista curta, em ordem de prioridade. O que não está aqui não existe.
4. **Fora do escopo**: o que explicitamente não será feito nesta versão. Evita que a IA (e você) encha o projeto.
5. **Dados**: as tabelas ou estruturas, como na lição 2 do módulo anterior.
6. **Telas**: cada tela descrita em texto.
7. **Regras**: cálculos, validações, permissões.
8. **Critérios de aceite**: como saber que está pronto.

## Histórias de usuário e critérios de aceite

Uma **história de usuário** descreve uma funcionalidade do ponto de vista de quem usa, no formato: "Como [papel], quero [ação] para [benefício]". Ela força a pensar no porquê.

Cada história ganha **critérios de aceite**: condições objetivas, testáveis, que dizem se a história está cumprida. Sem eles, "funciona" é opinião. Com eles, é verificação, como uma conciliação: ou bate, ou não bate.

Exemplo:

> **História:** Como analista, quero marcar um honorário como pago para que a lista de pendências fique atualizada.
>
> **Critérios de aceite:**
> - Ao clicar em "Marcar como pago", o honorário recebe a data de hoje como data de pagamento.
> - O honorário some da lista "Pendentes" e aparece em "Pagos".
> - Não é possível marcar como pago duas vezes.
> - A ação pede confirmação antes de executar.

## Telas em texto

Você não precisa desenhar. Descreva cada tela como se explicasse por telefone: o que aparece, em que ordem, o que cada botão faz. Exemplo:

> **Tela "Honorários do mês":** no topo, um seletor de competência (mês/ano) com o mês atual selecionado. Abaixo, uma tabela com as colunas cliente, valor, vencimento, situação. Situação mostra "Pendente" em laranja, "Pago" em verde, "Atrasado" em vermelho. Cada linha tem o botão "Marcar como pago". No rodapé, o total pendente e o total recebido do mês.

Isso é suficiente para a IA gerar algo próximo do que você imagina, e muito mais eficiente do que corrigir dez vezes.

## Exemplo completo: controle de honorários

**Objetivo:** controlar os honorários mensais dos clientes do escritório, sabendo quem pagou e quem está em atraso.

**Usuários:** a equipe administrativa (duas pessoas) e o sócio, no computador.

**Funcionalidades (v1):** cadastrar cliente com valor mensal e dia de vencimento; gerar os honorários de uma competência para todos os clientes ativos; listar por competência com situação; marcar como pago; total pendente e recebido.

**Fora do escopo (v1):** emissão de boleto ou Pix, envio de e-mail, portal do cliente, relatórios anuais.

**Dados:**
- Cliente: id, razão social, CNPJ, valor mensal, dia de vencimento, ativo.
- Honorário: id, cliente (vínculo), competência, valor, vencimento, data de pagamento (vazia se pendente).

**Regras:**
- Situação: "Pago" se tem data de pagamento; "Atrasado" se não tem e o vencimento passou; senão "Pendente".
- Gerar competência cria um honorário por cliente ativo, sem duplicar se já existir para aquele mês.
- CNPJ deve ter 14 dígitos; valor deve ser maior que zero.

**Telas:** Clientes (lista com busca, formulário de cadastro) e Honorários do mês (descrita acima).

**Critérios de aceite:** os de cada história, mais: funciona no Chrome e no Edge; os dados persistem ao fechar e reabrir; não há erro no console.

## O prompt de arranque

Com o PRD pronto, o primeiro prompt da ferramenta de vibe coding tem uma estrutura fixa: papel, contexto, PRD, restrições técnicas, e o pedido de **perguntar e planejar antes de gerar**.

```text
Você é um desenvolvedor sênior ajudando um contador que não programa. Vamos construir o
sistema descrito no PRD abaixo, em iterações pequenas.

[cole o PRD inteiro]

Restrições técnicas: aplicação web simples; sem servidor nesta versão; os dados ficam
salvos no navegador (localStorage); sem frameworks pesados; código comentado em português.
Nunca coloque chaves ou segredos no código.

Antes de escrever qualquer código: (1) faça as perguntas necessárias sobre o que estiver
ambíguo; (2) proponha a estrutura de arquivos e a ordem das iterações; (3) espere minha
aprovação. Na primeira iteração, entregue apenas a tela de Clientes funcionando.
```

Dois termos do prompt merecem explicação. **localStorage** é uma pequena área de armazenamento que o navegador reserva para cada site; serve para guardar dados no próprio computador do usuário, sem servidor, o que basta para uma versão 1 usada por poucas pessoas. **Framework** é um pacote de código pronto que impõe uma estrutura ao projeto; é útil em sistemas grandes, mas em projetos pequenos só acrescenta arquivos e passos de instalação, por isso o prompt pede para evitá-los.

Três detalhes importam. A frase "em iterações pequenas" define o ritmo. As restrições técnicas evitam que a IA escolha uma arquitetura complexa demais. E "espere minha aprovação" coloca você no controle: você lê o plano, corrige o que entendeu errado e só então gasta tempo e créditos gerando código.

## Passos práticos

1. Escolha um problema pequeno do seu escritório.
2. Escreva o PRD em uma página, seguindo as oito seções. Peça à IA para revisar a clareza e apontar ambiguidades, sem gerar código ainda.
3. Escreva de três a cinco histórias de usuário com critérios de aceite.
4. Descreva as telas em texto.
5. Monte o prompt de arranque e guarde-o em um arquivo; ele será reutilizado quando você trocar de ferramenta ou recomeçar.

## Erros comuns

- **PRD de dez páginas.** Uma página; o que não cabe, vai para a versão 2.
- **Critério de aceite subjetivo.** "Tela intuitiva" não é testável; "o botão Salvar fica desabilitado até o CNPJ ter 14 dígitos" é.
- **Esquecer o "fora do escopo".** É a seção que mais economiza tempo.
- **Pular o "pergunte antes".** A IA assume, e as suposições erradas custam iterações.

## Na prática

Um escritório gastou duas semanas iterando um controle de honorários porque cada pedido descobria uma regra nova ("ah, cliente inativo não gera honorário"). Recomeçou com um PRD de uma página, seis histórias e critérios de aceite. A segunda versão ficou pronta em dois dias, e o PRD virou a documentação do sistema.

## Resumo

- Especificar é decidir antes; o que não está escrito, a IA inventa.
- O PRD curto tem objetivo, usuários, funcionalidades, fora do escopo, dados, telas, regras e critérios de aceite.
- Histórias de usuário dizem o porquê; critérios de aceite tornam "pronto" verificável.
- Telas descritas em texto bastam para a IA gerar algo próximo do imaginado.
- O prompt de arranque junta papel, PRD, restrições e o pedido de perguntar e planejar antes de gerar.
