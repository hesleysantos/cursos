Nesta lição você vai aprender como funcionam **autenticação** (quem é você) e **autorização** (o que você pode fazer) em ferramentas no-code, como definir papéis, como garantir que cada cliente veja só os próprios dados em um portal, o que é **magic link** e, acima de tudo, o que nunca deve ficar exposto. Isso importa porque o erro de permissão é o mais grave que um sistema pode ter: um cliente vendo o balanço de outro é o fim da confiança no escritório.

## Autenticação e autorização

Dois conceitos que todo mundo mistura:

- **Autenticação** responde "quem é você?". É o login: e-mail e senha, link enviado por e-mail, conta do Google.
- **Autorização** responde "o que você pode ver e fazer?". É a permissão: o cliente vê os próprios documentos; o analista vê os de sua carteira; o sócio vê tudo.

A analogia é a portaria de um prédio comercial: o crachá prova quem você é (autenticação); o andar que o elevador libera é o que você pode acessar (autorização). Um sistema pode ter login perfeito e permissão errada, e o estrago vem da permissão.

## Formas de login em no-code

Os construtores (Softr, Bubble, Glide e outros) trazem o login pronto. As opções que você vai encontrar:

- **E-mail e senha**: o clássico. A senha é guardada pela ferramenta de forma cifrada; você nunca a vê, e isso é correto.
- **Magic link**: o usuário digita o e-mail e recebe um link que o autentica ao ser clicado. Não há senha para esquecer nem para vazar. Para portais de clientes, costuma ser a melhor experiência: o contador do cliente não quer mais uma senha na vida. Algumas ferramentas, em vez do link, enviam um código de uso único por e-mail; a ideia é a mesma, entrar sem senha.
- **Login social**: entrar com Google ou Microsoft. Bom para equipes que já usam esses serviços.

Além disso, ative a **verificação em duas etapas** para os administradores sempre que a ferramenta oferecer. Quem administra o portal pode ver tudo; essa conta merece proteção extra.

## Papéis: admin, equipe, cliente

Um **papel** é um rótulo que agrupa permissões. Em vez de configurar cada usuário, você configura o papel e atribui o usuário a ele. Para um escritório contábil, três papéis resolvem quase tudo:

| Papel | Vê | Faz |
|---|---|---|
| Administrador | Tudo | Cria usuários, altera configurações, exclui |
| Equipe | Clientes da própria carteira (ou todos, conforme a política) | Cria e edita documentos, tarefas, honorários |
| Cliente | Apenas seus próprios registros | Envia documentos, consulta guias e obrigações |

Nos construtores, o papel costuma ser um campo na tabela de usuários ("Papel: cliente") que as telas consultam. Cada tela ou bloco ganha uma regra de visibilidade: "mostrar se papel = administrador".

## Dados por cliente: o filtro que não pode falhar

No portal do cliente, a regra central é: **cada usuário só vê as linhas ligadas a ele**. Como garantir isso?

1. Na tabela Usuários, cada cliente tem um campo de vínculo "Empresa" apontando para a tabela Clientes.
2. Nas tabelas Documentos, Obrigações e Honorários, há o vínculo "Cliente".
3. Cada lista do portal recebe o filtro "Cliente = empresa do usuário logado". O construtor oferece isso como uma condição comparando o campo da tabela com um dado do usuário atual.

Até aqui, a filtragem é feita pela tela. Ferramentas mais completas, como o Bubble, permitem também **regras de privacidade nos dados**: mesmo que uma tela esqueça o filtro, o banco se recusa a entregar linhas de outro cliente. Quando a ferramenta oferecer esse segundo nível, use. É a diferença entre uma porta fechada e uma porta trancada.

> **Atenção:** teste com dois usuários de clientes diferentes, em navegadores diferentes. Abra cada tela e confira que um nunca vê nada do outro, inclusive em buscas, filtros e links diretos para um registro.

## O que nunca expor

Certas informações não devem aparecer em tela alguma, nem para o administrador pela interface do app:

- **Chaves de API e segredos** de integrações (a chave do Stripe, o token do Make). Elas ficam nas configurações da ferramenta, nunca em campo de tabela nem em texto da página.
- **Senhas de clientes**: nem a sua ferramenta deve conseguir exibi-las. Se um sistema mostra a senha do usuário em texto, ele está guardando errado.
- **Senhas de certificados digitais e de portais governamentais**: se o escritório precisa guardá-las, use um gerenciador de senhas com compartilhamento por equipe, não uma tabela do app.
- **Dados de outros clientes** em qualquer tela, inclusive em listas de seleção: um seletor "escolha o cliente" no formulário do portal já expõe a carteira inteira.
- **Links que valem como senha**: um link "público" para um registro do Airtable é acessível por qualquer pessoa que o tenha; não o use como forma de compartilhar dados de cliente.

Peça à IA uma revisão de segurança antes de abrir o portal:

```text
Vou publicar um portal no-code para clientes de um escritório contábil. Estrutura: tabelas
Usuários (com vínculo para Clientes), Documentos, Obrigações e Honorários (todas com vínculo
para Clientes). Papéis: administrador, equipe, cliente. Liste, em ordem de gravidade, os
erros de permissão que costumam acontecer nesse tipo de portal e como testar cada um antes
de liberar o acesso. Inclua os riscos de links públicos e seletores de registros.
```

## Passos práticos: configurar o acesso

1. Ative o login na ferramenta; escolha magic link para clientes e e-mail/senha ou login social para a equipe.
2. Crie o campo "Papel" na tabela de usuários e o vínculo "Empresa".
3. Crie um usuário de teste para cada papel, com e-mails que você controla.
4. Configure a visibilidade de cada página por papel.
5. Aplique o filtro "Cliente = empresa do usuário logado" em toda lista do portal, uma por uma.
6. Se a ferramenta tiver regras de privacidade nos dados, configure-as também.
7. Teste cruzado com dois clientes; teste um link direto de registro de um cliente estando logado como outro.
8. Ative verificação em duas etapas nas contas de administrador.

## Erros comuns

- **Esquecer o filtro em uma lista só.** Basta uma para expor tudo. Faça uma lista de verificação por página.
- **Dar papel de administrador "por enquanto".** O "por enquanto" vira permanente. Comece restrito.
- **Reaproveitar senha.** Senha do portal igual à do e-mail do escritório é convite para invasão.

## Na prática

Em um portal recém-lançado, o sócio entrou como cliente de teste e viu, no seletor do formulário de envio, o nome de todos os clientes do escritório. O seletor sozinho revelava a carteira inteira. A correção: preencher o cliente a partir do usuário logado e esconder o seletor.

## Resumo

- Autenticação é "quem é você"; autorização é "o que você pode fazer".
- Magic link costuma ser a melhor opção para clientes; duas etapas para administradores.
- Papéis (administrador, equipe, cliente) agrupam permissões e controlam a visibilidade das telas.
- Cada lista do portal filtra por "Cliente = empresa do usuário logado"; se houver regras de privacidade nos dados, use também.
- Nunca exponha chaves, senhas, dados de outros clientes ou links que valem como senha.
