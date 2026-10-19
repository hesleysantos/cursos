Nesta lição você vai construir, do início ao fim, o **Portal do Cliente** de um escritório contábil usando Softr em cima do Airtable: tabelas de clientes, documentos e obrigações; login por cliente; formulário de envio de documentos; notificação para a equipe. Ao final, você terá critérios objetivos para dizer "está pronto". Isso importa porque o projeto reúne tudo o que o módulo ensinou, na ordem certa, e deixa um sistema real que o seu escritório pode usar.

## O que o portal faz

Antes de tocar em qualquer ferramenta, a especificação em uma frase por item:

- O cliente entra com magic link e vê só o que é dele.
- Vê a lista de obrigações do mês com situação (pendente, entregue) e as guias disponíveis.
- Envia documentos por formulário, escolhendo competência e tipo.
- A equipe recebe aviso de cada envio e vê os documentos por situação.
- O administrador cadastra clientes e usuários.

Tudo o que não está nessa lista fica para a versão 2. Disciplina de escopo é o que faz projetos terminarem.

## Parte 1 — As tabelas (Airtable)

1. Crie a base "Portal" com quatro tabelas.
2. **Clientes**: Razão social (texto), CNPJ (texto, para preservar zeros à esquerda), Regime (seleção única), Responsável no escritório (texto ou vínculo), Ativo (caixa de seleção).
3. **Usuários**: Nome, E-mail (tipo e-mail), Papel (seleção: administrador, equipe, cliente), Empresa (vínculo a Clientes). Algumas ferramentas criam essa tabela automaticamente ao ativar o login; nesse caso, acrescente os campos Papel e Empresa.
4. **Documentos**: Cliente (vínculo), Competência (data), Tipo (seleção: extrato, notas, folha, outro), Arquivo (anexo), Situação (seleção: recebido, conferido, lançado), Enviado em (data de criação automática), Observações (texto longo).
5. **Obrigações**: Cliente (vínculo), Descrição (texto), Vencimento (data), Situação (seleção: pendente, entregue), Guia (anexo).
6. Cadastre três clientes fictícios, um usuário cliente para cada, duas obrigações por cliente. Use e-mails que você controla para testar o login.
7. Restrinja o compartilhamento da base: só a equipe do escritório tem acesso direto.

Revise o modelo com a IA antes de seguir; é mais barato corrigir aqui:

```text
Revise este modelo de dados para um portal de clientes de escritório contábil: [cole as
tabelas e campos]. Aponte campos faltantes para o fluxo "cliente envia documento → equipe
confere → equipe lança", tipos de campo inadequados e qualquer vínculo que esteja faltando
para filtrar tudo por cliente.
```

## Parte 2 — O portal (Softr)

8. Crie uma aplicação nova e conecte a base Portal. Confirme que as quatro tabelas aparecem.
9. **Login**: ative a autenticação de usuários, ligue à tabela Usuários e escolha a entrada sem senha que a ferramenta oferecer (magic link ou código enviado por e-mail). Não publique página de cadastro aberto: o administrador cria os usuários.
10. **Página "Minhas obrigações"**: bloco de lista ligado a Obrigações, com filtro "Cliente = empresa do usuário logado", ordenado por vencimento. Mostre descrição, vencimento, situação e o anexo da guia quando houver.
11. **Página "Meus documentos"**: lista de Documentos com o mesmo filtro por usuário, mostrando competência, tipo, situação e arquivo.
12. **Página "Enviar documento"**: bloco de formulário ligado a Documentos com os campos competência, tipo, arquivo (obrigatório, PDF ou XML) e observações. O campo Cliente deve ser preenchido automaticamente com a empresa do usuário logado e ficar oculto. Situação fixa em "recebido".
13. **Página da equipe**: visível só para os papéis administrador e equipe. Lista de Documentos agrupada ou filtrada por situação, com ação para mudar a situação. Lista de Obrigações de todos os clientes com filtro por responsável.
14. **Visibilidade**: cada página ganha a regra de papel correspondente. Cliente não vê a página da equipe; equipe não vê a configuração de usuários.

## Parte 3 — A notificação

15. Na ferramenta de automação (Make, Zapier ou n8n), crie um cenário com gatilho "novo registro na tabela Documentos".
16. Ação: enviar e-mail ao responsável do cliente, com razão social, competência, tipo e link do registro. Se a sua ferramenta permitir, o e-mail do responsável pode vir por busca na tabela Clientes.
17. Teste enviando um documento pelo portal e confirme o e-mail.

## Parte 4 — Testes antes de liberar

18. Entre como cliente A e como cliente B em navegadores diferentes. Confira obrigações, documentos e formulário: nada de um aparece para o outro.
19. Copie o link de um documento do cliente A e abra logado como cliente B. Deve ser negado.
20. Envie um documento sem arquivo: o formulário deve recusar.
21. Entre como equipe e mude a situação de um documento; confira que o cliente vê a mudança.
22. Abra tudo no celular.

## Critérios de pronto

O portal está pronto quando **todos** os itens abaixo forem verdadeiros. Não é "quase": é uma lista de verificação, como a de fechamento de um balanço.

| Critério | Como verificar |
|---|---|
| Login sem senha funciona para os três papéis | Entrar com cada usuário de teste |
| Cliente vê apenas seus registros em todas as páginas | Teste cruzado A/B, inclusive link direto |
| Formulário recusa envio sem arquivo e preenche o cliente automaticamente | Enviar errado e enviar certo |
| Equipe recebe notificação a cada envio | E-mail chega em até alguns minutos |
| Equipe altera situação e o cliente vê | Mudar e conferir nos dois lados |
| Base do Airtable restrita à equipe | Conferir o compartilhamento |
| Política de privacidade e aceite no cadastro | Página publicada e campo de aceite |
| Funciona no celular | Abrir cada página no telefone |
| Custos mensais somados e aprovados | Planilha preenchida |
| Lógica documentada e exportação testada | Documento escrito; CSV importado em planilha de teste |

Se um item falhar, o portal não está pronto. Resolva e teste de novo.

## Erros comuns neste projeto

- **Deixar o seletor de cliente visível no formulário.** Expõe a carteira inteira; o cliente vem do usuário logado.
- **Esquecer o filtro na página de documentos.** O teste cruzado é obrigatório.
- **Expandir o escopo no meio.** "Já que estamos aqui, vamos colocar os honorários." Versão 2.

## Na prática

Com o portal no ar, a rotina do escritório muda: o cliente deixa de mandar documento por mensagem, a equipe confere o que chegou por uma lista com situação, e o sócio tem um painel de quem ainda não enviou no mês. O portal nasceu em uma semana de trabalho em tempo parcial, sem código, e com a exportação e a documentação prontas para o dia em que crescer.

## Resumo

- Especifique em uma frase por função; o que ficou de fora vai para a versão 2.
- Tabelas primeiro (Clientes, Usuários, Documentos, Obrigações), com vínculos para filtrar por cliente.
- Softr: login sem senha, páginas filtradas pelo usuário logado, formulário com cliente automático, páginas da equipe por papel.
- Automação avisa a equipe a cada envio; teste o ciclo inteiro.
- Critérios de pronto são uma lista de verificação; todos precisam passar.
