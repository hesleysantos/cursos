Nesta lição você vai construir telas em cima de um banco de dados usando um **construtor de apps internos**: listas, telas de detalhe, formulários, filtros e permissões por usuário. Vai conhecer Glide, Softr, AppSheet e Retool, entender o que todos têm em comum e montar o projeto da lição: um app de carteira de clientes do escritório. Isso importa porque é aqui que o banco deixa de ser uma tabela e vira um sistema que a equipe usa no celular.

## O que é um app interno

**App interno** é um sistema usado pela própria equipe, não pelo público. Carteira de clientes, controle de tarefas, cadastro de certificados digitais, agenda de visitas. O construtor de apps internos pega as tabelas que você modelou na lição anterior e gera telas prontas para listar, buscar, abrir, editar e criar registros, sem código.

## Os quatro construtores

| Ferramenta | Como funciona | Quando escolher |
|---|---|---|
| Glide | Conecta a Sheets, Airtable ou banco próprio; gera app com aparência de celular | Equipe usa no celular; cadastro e consulta rápidos |
| Softr | Conecta a Airtable e outros; monta portais e apps web com blocos | Portal para clientes externos com login (lição 9) |
| AppSheet | Do Google; conecta a Sheets e outros; forte em formulários e regras | Escritório já vive no Google Workspace |
| Retool | Componentes arrastáveis ligados a bancos e APIs; mais técnico | Equipe com alguém que aceita escrever pequenas consultas |

Os nomes dos menus mudam de ferramenta para ferramenta e de ano para ano, por isso esta lição ensina os **conceitos** que você encontra em todas. Para o passo a passo exato de botões, consulte a documentação atual da ferramenta escolhida.

## Os blocos de tela que todo app tem

**Lista**: mostra várias linhas de uma tabela. Você escolhe os campos visíveis (razão social, regime, responsável) e a ordenação. Pode ser em formato de cartões, tabela ou calendário.

**Detalhe**: abre uma linha só, com todos os campos e os registros vinculados. Na tela de um cliente, aparecem os honorários e as tarefas dele, porque você criou o vínculo na lição 2.

**Formulário**: cria ou edita uma linha. O construtor gera um campo de entrada para cada campo da tabela, já respeitando o tipo: um seletor para seleção única, um calendário para data, um botão de anexo para arquivo. Você decide quais campos aparecem e quais são obrigatórios.

**Filtro e busca**: a lista mostra só o que interessa. "Clientes ativos do Simples Nacional sob minha responsabilidade" é um filtro com três condições. Um bom app tem poucos filtros bem escolhidos, não todos os possíveis.

**Ação**: botões que fazem algo além de salvar: enviar e-mail, abrir o WhatsApp com mensagem pronta, marcar como concluído, gerar PDF.

## Permissões por usuário

Aqui está a diferença entre um app e uma planilha compartilhada. Em um app você define:

- **Quem entra**: lista de e-mails autorizados ou domínio do escritório.
- **Papéis**: administrador, analista, estagiário. Cada papel vê e faz coisas diferentes.
- **Filtro por usuário**: o analista só vê os clientes da coluna "Responsável" que apontam para ele. Isso se chama *row-level security* ou "filtro por linha" e é configurado comparando um campo da tabela com o e-mail de quem está logado.
- **Campos ocultos**: a senha do certificado digital só aparece para o administrador, ou não aparece em tela nenhuma.

> **Atenção:** permissão na tela não é permissão nos dados. Se a tabela do Airtable é compartilhada com todo mundo, qualquer pessoa abre o Airtable e vê tudo, mesmo que o app esconda. Restrinja o acesso ao banco e deixe o app ser a única porta.

## Projeto: app de carteira de clientes

Monte este app seguindo os passos; o objetivo é vivenciar o fluxo inteiro.

1. **Prepare o banco.** No Airtable, crie a base "Escritório" com as tabelas Clientes (razão social, CNPJ, regime como seleção única, responsável como texto ou vínculo a uma tabela Equipe, telefone, e-mail, ativo como caixa de seleção) e Tarefas (descrição, cliente como vínculo, prazo como data, situação como seleção única, responsável). Cadastre cinco clientes e dez tarefas fictícios.
2. **Crie o app.** No Glide ou no Softr, crie um novo app e conecte a base. A ferramenta vai detectar as tabelas e os tipos de campo.
3. **Tela de lista de clientes.** Escolha o formato de cartões, mostre razão social, regime e responsável; ordene por razão social. Adicione uma busca por nome e CNPJ.
4. **Tela de detalhe.** Ao tocar num cliente, mostre todos os campos e, abaixo, a lista das tarefas vinculadas, com a situação em destaque.
5. **Formulário de nova tarefa.** Dentro da tela do cliente, botão "Nova tarefa" com descrição, prazo e responsável; o campo cliente já vem preenchido.
6. **Filtro "minhas tarefas".** Uma aba que mostra só tarefas cujo responsável é o usuário logado e cuja situação não é "Concluída", ordenadas por prazo.
7. **Permissões.** Restrinja o acesso ao e-mail do escritório; deixe exclusão de cliente só para o papel administrador.
8. **Teste no celular.** Abra o link do app no telefone, cadastre uma tarefa, marque como concluída e confira que sumiu da aba "minhas tarefas".

Quando travar em um passo, peça ajuda à IA descrevendo a tela, não a ferramenta:

```text
Estou montando um app no [Glide/Softr] conectado ao Airtable. Tenho as tabelas Clientes e
Tarefas (Tarefas tem vínculo com Clientes). Quero uma aba que mostre apenas as tarefas do
usuário logado que não estejam concluídas, ordenadas por prazo. Explique o conceito que preciso
configurar (filtro por usuário) e o que procurar na documentação; não invente nomes de menus.
```

## Erros comuns

- **Mostrar todos os campos em todas as telas.** Lista mostra três ou quatro campos; o detalhe mostra o resto.
- **Deixar tudo editável.** CNPJ e razão social raramente mudam; proteja o que não deve ser alterado por engano.
- **Esquecer o estado vazio.** Um analista novo abre "minhas tarefas" e vê uma tela branca. Configure uma mensagem: "Nenhuma tarefa atribuída a você".

## Na prática

Um escritório com seis pessoas substituiu o grupo de WhatsApp "pendências" por um app no celular. Cada analista vê suas tarefas, o sócio vê tudo em um painel, e a tarefa concluída some da lista na hora. A reclamação mais comum na primeira semana foi "o app não me deixa apagar o cliente", o que era exatamente a intenção.

## Resumo

- Construtor de apps internos gera lista, detalhe, formulário, filtro e ação em cima do seu banco.
- Glide (celular), Softr (portais), AppSheet (Google) e Retool (mais técnico) seguem os mesmos conceitos.
- Permissões: quem entra, papéis, filtro por linha e campos ocultos.
- Proteja o banco; o app deve ser a única porta de acesso.
- O projeto da carteira de clientes exercita o fluxo completo: banco, telas, filtro e permissão.
