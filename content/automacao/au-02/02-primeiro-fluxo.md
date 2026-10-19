Nesta lição você vai montar seu primeiro fluxo completo: um formulário de cadastro (Tally ou Google Forms) que, ao ser respondido, grava uma linha numa planilha do Google Sheets e envia um e-mail de confirmação ao cliente. O passo a passo é genérico, para não depender de nomes de botões que mudam. Isso importa porque esse padrão "formulário → planilha → e-mail" resolve dezenas de situações do escritório: solicitação de documentos, pedido de certidão, cadastro de novo cliente, pesquisa de satisfação.

## O que vamos construir

```
[Gatilho: nova resposta no formulário]
   -> [Google Sheets: adicionar linha]
   -> [Gmail: enviar e-mail de confirmação]
```

Três blocos. Parece pouco, mas aqui estão todos os conceitos da lição anterior: gatilho instantâneo, duas ações, duas conexões, campos mapeados.

## Preparação (antes de abrir a ferramenta)

1. **Crie o formulário** com quatro campos: nome da empresa, CNPJ, e-mail, telefone. No Tally ou no Google Forms, deixe o CNPJ como texto curto. Responda uma vez com dados de teste (use um e-mail seu).
2. **Crie a planilha** no Google Sheets com o cabeçalho na linha 1: `data`, `empresa`, `cnpj`, `email`, `telefone`, `status`. Nenhuma outra coisa na aba.
3. **Escreva o texto do e-mail** num bloco de notas: assunto e corpo, com marcações para os campos variáveis, como `[EMPRESA]`.

Preparar fora da ferramenta evita a tentação de improvisar enquanto monta.

## Passo a passo genérico

### 1. Criar o fluxo e o gatilho

1. Crie um fluxo novo e dê um nome descritivo: "Cadastro de cliente: formulário → planilha → e-mail".
2. Adicione o primeiro bloco e procure o app do seu formulário (Tally, Google Forms, Typeform). Escolha o gatilho do tipo "nova resposta" ou "nova submissão".
3. Crie a conexão com a conta onde o formulário está. Se o app usa webhook (Tally, por exemplo), a ferramenta mostrará uma URL para você cadastrar nas integrações do formulário; se usa consulta (Google Forms, em geral via planilha de respostas), escolha o intervalo.
4. **Teste o gatilho**: envie uma resposta de exemplo no formulário e peça à ferramenta que busque dados. Você deve ver os quatro campos com os valores de teste.

> **Dica:** se o Google Forms não aparecer como gatilho direto, use a planilha de respostas que ele gera e o gatilho "nova linha" do Google Sheets. Funciona igual.

### 2. Adicionar a linha na planilha

1. Adicione um bloco do Google Sheets com a ação "adicionar linha" (*add row*, *append*).
2. Crie ou escolha a conexão Google (OAuth). Lembre-se da conta dedicada a automações.
3. Selecione a planilha e a aba. A ferramenta lerá o cabeçalho e mostrará um campo para cada coluna.
4. Mapeie: `empresa` ← nome da empresa do formulário; `cnpj` ← CNPJ; `email` ← e-mail; `telefone` ← telefone. Em `data`, use a função de data atual da ferramenta (`now`, `utcNow` ou similar). Em `status`, digite o texto fixo `novo`.
5. Rode o bloco isoladamente (a maioria das ferramentas permite "executar este módulo"). Abra a planilha: a linha deve estar lá.

### 3. Enviar o e-mail

1. Adicione um bloco do Gmail (ou Outlook) com a ação "enviar e-mail".
2. Conexão: a mesma conta Google, se o fluxo vai enviar por ela; ou outra, se o e-mail sai de um endereço diferente.
3. Mapeie `para` ← e-mail do formulário. No assunto e no corpo, cole o texto preparado e substitua as marcações pelos campos: onde estava `[EMPRESA]`, arraste o campo nome da empresa.
4. Se a ferramenta oferecer, marque o corpo como texto simples na primeira versão; HTML fica para depois.

### 4. Testar de ponta a ponta

1. Execute o fluxo uma vez (modo de teste ou "executar uma vez").
2. Responda ao formulário com dados de exemplo.
3. Verifique: a execução aparece no histórico com os três blocos verdes; a planilha tem a nova linha; o e-mail chegou com o nome certo.
4. Teste um caso ruim: responda com o e-mail em branco (se o formulário permitir). Observe onde o fluxo falha. Na lição 8 você vai tratar isso; por ora, basta saber que falha.

### 5. Ativar

Ative o fluxo (ligue a chave "ativo"/"on"). A partir de agora ele roda sozinho. Anote em algum lugar (uma planilha "Fluxos ativos") o nome, o que faz, as contas usadas e a data de ativação.

## Testar com dados de exemplo: regras

- Use **seus próprios contatos** nos testes. Nunca dispare e-mail para clientes reais durante a construção.
- Crie uma aba ou planilha **de teste** separada da de produção, e troque para a de produção só na ativação.
- Inclua um teste com **acentos e caracteres especiais** ("Ótica São João & Cia") para ver se nada quebra.
- Inclua um teste com **CNPJ começando por zero** e confira se a planilha preservou o zero (se não, formate a coluna como texto).

## Erros comuns

- Mapear o campo errado (telefone no lugar do e-mail) por pressa. Confira cada mapeamento lendo em voz alta.
- Esquecer de ativar o fluxo e achar que ele "não funciona".
- Testar com o fluxo ativo e enviar e-mail de teste para um cliente real.
- Criar o cabeçalho da planilha depois de configurar o módulo, o que desalinha as colunas; mude o cabeçalho e reabra o módulo.
- Usar a função de data sem fuso horário e gravar a hora errada (veja a lição 5).

## Na prática

Esse mesmo fluxo, com pequenos ajustes, vira: "solicitação de certidão → planilha de pedidos → e-mail de recebimento"; "pesquisa de satisfação → planilha → e-mail de agradecimento"; "pedido de documento ao cliente → planilha de pendências → e-mail com a lista". Monte o primeiro hoje e, na próxima semana, replique para um caso real do escritório.

## Resumo

- Padrão base: formulário → planilha → e-mail. Três blocos, duas conexões.
- Prepare fora da ferramenta: formulário, planilha com cabeçalho limpo, texto do e-mail.
- Sempre teste o gatilho primeiro para ver os campos; depois mapeie.
- Teste de ponta a ponta com dados seus, inclusive casos ruins, antes de ativar.
- Registre o fluxo ativado numa lista de fluxos do escritório.
