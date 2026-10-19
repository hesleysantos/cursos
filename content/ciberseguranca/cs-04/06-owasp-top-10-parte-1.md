# OWASP Top 10 (parte 1)

O **OWASP Top 10** é a lista das categorias de falhas mais críticas em aplicações web, mantida pela OWASP (Open Worldwide Application Security Project) e revisada a cada poucos anos. Nesta lição e na próxima usamos a **edição de 2021**, a mais difundida em contratos e ferramentas (a edição de 2025 reorganiza algumas categorias, por exemplo juntando o SSRF ao controle de acesso, mas mantém o essencial). Nesta lição você vai entender as três mais clássicas — **injeção**, **cross-site scripting (XSS)**, que na lista de 2021 faz parte da injeção mas aqui ganha seção própria, e **falhas de autenticação** — sempre pelo mesmo caminho: o que é, por que acontece e, principalmente, **como se corrige**. O objetivo é defensivo: reconhecer o problema e saber a defesa para exigir dela quem desenvolve ou contrata sistemas.

## Injeção: o problema de misturar dados com comandos

A **injeção** acontece quando a entrada do usuário é colada diretamente num comando que o sistema vai executar, de modo que o dado se transforma em comando. A injeção de **SQL** (a linguagem dos bancos de dados) é o exemplo mais famoso.

Imagine uma tela de busca de cliente que monta a consulta assim, concatenando texto (os dois trechos abaixo são ilustrativos, não executáveis: `entrada_do_usuario` e `cursor` representam o que viria do formulário e da conexão com o banco):

```python
# VULNERÁVEL — nunca faça assim: o que o usuário digita vira parte do comando
nome = entrada_do_usuario
consulta = "SELECT * FROM clientes WHERE nome = '" + nome + "'"
cursor.execute(consulta)
```

Se o usuário digitar um nome comum, funciona. Mas se digitar algo que contenha aspas e trechos de SQL, o texto deixa de ser "um nome" e passa a alterar a lógica da consulta, podendo retornar a tabela inteira ou ignorar o filtro. O sistema confundiu **dado** com **comando**.

A correção não é "proibir aspas"; é **nunca concatenar**. Usa-se **consulta parametrizada** (prepared statement): o comando e os dados viajam separados, e o banco trata a entrada sempre como valor, jamais como código.

```python
# CORRETO — consulta parametrizada: o dado nunca vira comando
nome = entrada_do_usuario
cursor.execute("SELECT * FROM clientes WHERE nome = ?", (nome,))
```

O mesmo princípio vale para **injeção de comando** (quando a entrada vai parar numa linha de comando do sistema operacional): a defesa é não montar comandos com texto do usuário e usar as funções seguras da linguagem, que recebem os argumentos separadamente. A regra geral de toda injeção é uma só: **separe dados de comandos.**

## Validação e escape: as camadas de apoio

A consulta parametrizada resolve a injeção de SQL, mas duas práticas reforçam a defesa em qualquer entrada:

- **Validação (lista de permitidos):** aceite apenas o que faz sentido. Um CNPJ tem 14 dígitos; um código de cliente é numérico; um estado tem duas letras. Rejeitar o que foge do formato elimina a maior parte das entradas maliciosas antes de qualquer processamento.
- **Escape/sanitização:** ao exibir um dado, converta os caracteres especiais para que sejam mostrados como texto, não interpretados. É a defesa central do XSS, a seguir.

Validar na entrada e escapar na saída é o par que acompanha o sistema inteiro.

## XSS: quando o navegador da vítima executa o que não devia

O **cross-site scripting (XSS)** acontece quando uma aplicação devolve, dentro de uma página, um texto vindo do usuário sem tratá-lo, e esse texto contém código que o navegador de quem vê a página acaba executando. O caso clássico: um campo de comentário ou de nome que aceita trechos de script; quando outro usuário abre a página, o script roda no navegador dele, podendo roubar o cookie de sessão (módulo 3) e sequestrar a conta.

A defesa tem duas frentes:

- **Escape na saída:** caracteres como `<`, `>` e `&` são convertidos para suas formas seguras, de modo que apareçam como texto literal e nunca como marcação executável. Frameworks web modernos fazem isso por padrão; o perigo mora em quem desliga essa proteção "para funcionar".
- **Content Security Policy (CSP):** um cabeçalho que diz ao navegador de onde ele pode carregar e executar scripts, barrando a execução de código injetado mesmo que algo escape.

## Falhas de autenticação

Esta categoria reúne os erros que permitem passar pela porta de entrada: senhas fracas aceitas, ausência de limite de tentativas (que abre caminho para força bruta, módulo 3), identificadores de sessão previsíveis ou que não expiram, recuperação de senha mal feita e falta de MFA. O sintoma é sempre o mesmo: o sistema não garante, com robustez, que quem entrou é mesmo quem diz ser.

As defesas você já conhece do módulo 3: senhas guardadas com Argon2id/bcrypt e sal; limite de tentativas e bloqueio temporário; sessões com identificador aleatório, expiração curta e cookies `Secure` e `HttpOnly`; recuperação por link temporário, nunca devolvendo a senha; e MFA, de preferência resistente a phishing (passkeys/FIDO2). Juntas, elas transformam "roubei uma senha" em "ainda não entrei".

## O fio comum: nunca confie na entrada

As três falhas têm a mesma raiz: a aplicação **confiou** em algo que veio de fora. Injeção confia que a entrada é só um dado; XSS confia que o texto do usuário é seguro para exibir; falhas de autenticação confiam que quem apresenta uma credencial é o dono dela. A postura defensiva é inverter isso: **toda entrada é suspeita até ser validada, escapada e autenticada.**

## Erros comuns

- **Confiar na validação só do navegador.** O JavaScript da página pode ser contornado; a validação que conta é a do servidor.
- **"Limpar" a entrada removendo palavras.** Filtros de palavras proibidas são fáceis de driblar; o certo é parametrizar e escapar.
- **Desligar o escape do framework.** Quase todo XSS real vem de alguém que marcou um conteúdo como "seguro" sem ser.
- **Mensagem de erro que entrega demais.** "Usuário existe, senha errada" ajuda o atacante; prefira mensagens genéricas.
- **Sessão que nunca expira.** Um cookie eterno é uma senha eterna na mão de quem o roubar.

## Na prática

- Ao contratar ou encomendar um sistema, pergunte: usa consultas parametrizadas? O escape de saída está ativo? Há CSP? As senhas usam bcrypt ou Argon2? Há MFA e limite de tentativas?
- Em qualquer formulário do escritório (portal do cliente, site), valide no servidor e teste com entradas fora do formato esperado.
- Exija do fornecedor evidência de que o sistema passou por testes das categorias do OWASP Top 10.
- Mantenha o framework atualizado: as proteções padrão dependem de versões recentes.

## Resumo

- O OWASP Top 10 lista as falhas web mais críticas; esta lição cobriu injeção, XSS e falhas de autenticação.
- Injeção vem de misturar dado com comando; a correção é a consulta parametrizada, que os separa.
- XSS executa no navegador da vítima; a defesa é escape na saída e Content Security Policy.
- Falhas de autenticação se resolvem com as práticas do módulo 3: hashing forte, limite de tentativas, sessões seguras e MFA.
- A raiz comum é confiar na entrada; a postura defensiva é validar, escapar e autenticar sempre.
