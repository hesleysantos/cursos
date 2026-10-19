Nesta lição você vai aprender o vocabulário comum a todas as ferramentas de fluxo: gatilhos, ações, módulos ou nós, conexões, execuções e campos mapeados. Depois vai comparar Make, n8n, Zapier e Power Automate com critérios objetivos. Isso importa porque, entendendo esses conceitos uma vez, você consegue usar qualquer uma das quatro, e as que surgirem depois, sem reaprender do zero.

## A ideia central: gatilho → ações

Toda ferramenta de fluxo funciona com a mesma lógica: **quando acontece X, faça Y, depois Z**. O "quando acontece X" é o **gatilho** (*trigger*). O "faça Y, depois Z" são as **ações**. O conjunto é o **fluxo** (o Make chama de *cenário*, o n8n de *workflow*, o Zapier de *Zap*, o Power Automate de *fluxo*).

Pense numa **linha de produção**. O gatilho é a esteira que entrega uma peça; cada estação faz uma operação na peça (ação) e passa adiante. A peça, no nosso caso, é um **item de dados**: um formulário respondido, um e-mail recebido, uma linha de planilha.

### Tipos de gatilho

| Tipo | Como dispara | Exemplo |
|---|---|---|
| **Instantâneo (webhook)** | O serviço avisa no momento do evento | Formulário Tally respondido |
| **Por consulta (polling)** | A ferramenta verifica de tempos em tempos se há algo novo | Novo e-mail com anexo no Gmail (a cada 15 min) |
| **Agendado** | Em um horário definido | Todo dia 20 às 8h |
| **Manual** | Você clica em "executar" | Testes e processamentos pontuais |

Gatilhos instantâneos são melhores (sem atraso, sem gasto com verificações vazias), mas nem todo serviço os oferece.

## Módulos ou nós

Cada bloco do fluxo é um **módulo** (Make) ou **nó** (n8n; *node*). Um módulo pertence a um **app** (Google Sheets, Gmail, WhatsApp) e executa uma operação específica (*adicionar linha*, *buscar linhas*, *enviar e-mail*). Além dos módulos de apps, existem módulos de **lógica**: filtros, roteadores, iteradores, agregadores, ferramentas de texto e data, e o módulo **HTTP** genérico, que chama qualquer API (você verá na lição 4).

## Conexões (credenciais)

Antes de usar um módulo do Google Sheets, você cria uma **conexão**: autoriza a ferramenta a acessar sua conta (via OAuth, visto no módulo anterior) ou informa uma chave de API. A conexão fica no cofre da ferramenta e pode ser reutilizada em vários fluxos. Nomeie as conexões de forma clara ("Google Sheets - automacao@escritorio") e use uma conta dedicada a automações.

## Execuções e operações

Cada vez que o gatilho dispara, o fluxo roda uma **execução** (*run*). A ferramenta guarda o histórico com o que cada módulo recebeu e devolveu, o que é a sua principal ferramenta de depuração.

Dentro de uma execução, cada módulo que roda conta como uma **operação** (Make) ou **tarefa** (Zapier). É a unidade de cobrança nas versões em nuvem: um fluxo com cinco módulos que roda 100 vezes consome 500 operações, e um iterador de 50 linhas multiplica as operações seguintes. O n8n em nuvem cobra por execução, não por nó; o self-hosted não tem esse limite. Consulte a documentação atual para os planos.

## Campos mapeados: o coração do fluxo

Quando um módulo roda, ele devolve **campos** (*outputs*): o formulário devolve nome, e-mail, CNPJ; a consulta de CNPJ devolve razão social, situação. Nos módulos seguintes, você **mapeia** esses campos nos **parâmetros de entrada**: arrasta o campo "e-mail" do formulário para o campo "destinatário" do módulo de e-mail.

```
[Formulário respondido]            [Gmail: enviar e-mail]
  nome: "Padaria Pão Quente"  --->   para: {{formulário.email}}
  email: "fin@pao.com.br"            assunto: "Bem-vindo, {{formulário.nome}}"
  cnpj: "12345678000190"             corpo: "Seu cadastro foi recebido..."
```

As chaves duplas `{{ }}` (notação ilustrativa; cada ferramenta tem a sua) indicam que o valor virá do módulo anterior, em cada execução. Mapear campos é 80% do trabalho de montar um fluxo; o resto é lógica.

> **Dica:** sempre rode o gatilho uma vez com dados de exemplo antes de mapear. Assim a ferramenta "aprende" quais campos existem e os mostra para você arrastar.

## Make, n8n, Zapier e Power Automate: como comparar

Os quatro fazem o mesmo; diferem em público, cobrança e profundidade. Critérios (sem preços, que mudam):

| Critério | Make | n8n | Zapier | Power Automate |
|---|---|---|---|---|
| Curva de aprendizado | Média | Média-alta | Baixa | Média |
| Interface | Visual, circular | Visual, em grafo | Lista de passos | Lista de passos |
| Lógica avançada (rotas, iteração) | Forte | Muito forte (inclui código) | Básica | Média |
| Catálogo de apps | Grande | Grande e crescente | O maior | Focado em Microsoft |
| Self-hosted | Não | Sim (código-fonte disponível, licença *fair-code*) | Não | Não |
| Cobrança | Por operação | Por execução (nuvem) ou grátis (self-hosted) | Por tarefa | Por usuário/fluxo (incluso em alguns planos do 365) |
| Ponto forte | Melhor custo-benefício para iniciantes com lógica | Controle, privacidade, IA | Simplicidade | Integração profunda com Microsoft 365 |

Resumo prático para um escritório contábil:

- **Make**: comece por aqui se não tem Microsoft 365 e quer lógica razoável com facilidade.
- **n8n**: se dados sensíveis pedem hospedagem própria ou há alguém técnico para manter.
- **Zapier**: fluxos simples de dois ou três passos, quando simplicidade importa mais que custo.
- **Power Automate**: se o escritório vive no Outlook, Excel, SharePoint e Teams.

Este módulo usa Make e n8n como referência, mas descreve os passos de modo genérico.

## Erros comuns

- Confundir gatilho com ação: o gatilho é sempre o primeiro bloco e só existe um por fluxo.
- Esquecer que o gatilho por consulta tem atraso (minutos) e consome operações mesmo sem novidades.
- Criar uma conexão com a conta pessoal e depois precisar refazer tudo ao trocar para a conta do escritório.
- Não testar o gatilho antes de mapear, e mapear campos "no escuro".
- Ignorar o consumo de operações de iteradores e descobrir no fim do mês.

## Na prática

Abra a ferramenta escolhida e, sem construir nada, encontre onde ficam as conexões, o histórico de execuções e o medidor de operações. Depois crie um fluxo vazio, adicione um gatilho de formulário ou de agendamento e observe os campos que ele devolve. Na próxima lição você monta o primeiro fluxo completo.

## Resumo

- Fluxo = gatilho (quando acontece X) + ações (faça Y, Z). Um gatilho por fluxo.
- Gatilhos: instantâneo (webhook), por consulta, agendado, manual.
- Módulos/nós pertencem a apps ou à lógica; conexões guardam credenciais reutilizáveis.
- Execução é uma rodada do fluxo; operações/tarefas são a unidade de cobrança.
- Mapear campos é ligar a saída de um módulo à entrada do seguinte; rode o gatilho antes para ver os campos.
- Make (custo-benefício), n8n (controle e self-hosted), Zapier (simplicidade), Power Automate (Microsoft 365).
