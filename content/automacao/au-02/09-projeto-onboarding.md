Nesta lição você vai montar, passo a passo, o projeto do módulo: o fluxo "Onboarding de cliente". Um formulário de cadastro dispara a consulta do CNPJ, a criação das pastas no Drive, o registro na planilha, o e-mail ou WhatsApp de boas-vindas e uma tarefa para o responsável. Tudo com testes e tratamento de erros. Isso importa porque o onboarding reúne todos os blocos do módulo num processo real que todo escritório tem, e que hoje costuma levar uma tarde de trabalho manual.

## O fluxo completo

```
[1. Gatilho: formulário de cadastro respondido]
   -> [2. Normalizar: cnpj_limpo, email em minúsculas, nome sem espaços extras]
   -> [3. Sheets: buscar cliente pelo cnpj_limpo]   (idempotência)
   -> [4. Roteador: já existe?]
        Sim -> [Log "duplicado"] -> [Alerta ao responsável] -> fim
        Não -> continua
   -> [5. HTTP: consultar CNPJ na BrasilAPI]
   -> [6. Roteador por status]
        200   -> segue com razao_social, situacao, cnae, uf
        404   -> segue com razao_social = nome do formulário, situacao = "não encontrado"
        senão -> [Alerta] -> fim
   -> [7. Drive: procurar pasta Clientes/<razao_social>; senão criar]
   -> [8. Drive: criar subpastas <ano>/Fiscal, Contábil, Pessoal, Documentos]
   -> [9. Sheets: adicionar linha em CLIENTES com todos os campos e status "onboarding"]
   -> [10. Roteador por canal]
        e-mail   -> [Gmail: boas-vindas com link da pasta e lista de documentos]
        whatsapp -> [WhatsApp API: template "boas_vindas"]
   -> [11. Tarefa para o responsável (Google Tasks, Planner, Trello, Asana ou e-mail)]
   -> [12. Sheets: linha no LOG "onboarding concluído"]
```

Doze blocos, mais os handlers. Cada bloco é algo que você já fez nas lições anteriores.

## Preparação

1. **Formulário** (Tally ou Google Forms): razão social (como o cliente escreve), CNPJ, e-mail, telefone, regime tributário (lista), canal preferido (e-mail/WhatsApp), aceite para receber mensagens (opt-in), nome do responsável no escritório (lista).
2. **Planilha CLIENTES**: aba `clientes` com `cnpj`, `razao_social`, `nome_fantasia`, `situacao`, `cnae`, `uf`, `regime`, `email`, `telefone`, `canal`, `opt_in`, `responsavel`, `pasta_id`, `status`, `data_cadastro`. Aba `log` com `data`, `fluxo`, `cnpj`, `acao`, `resultado`.
3. **Pasta-mãe** `Clientes` no Drive, compartilhada com a conta de automação. Anote o ID.
4. **Textos**: e-mail de boas-vindas e, se usar WhatsApp oficial, template aprovado.
5. **Fluxo central de alertas** (lição 8) já ativo.

## Montagem passo a passo

**Bloco 1 — gatilho.** Como na lição 2. Responda ao formulário com dados de teste e confirme os campos.

**Bloco 2 — normalizar.** Módulo de variáveis/Set com: `cnpj_limpo` = só dígitos do CNPJ; `email` = `lower(trim(email))`; `nome` = `trim(razão social)`. Teste: um CNPJ com pontos deve sair com 14 dígitos.

**Blocos 3 e 4 — idempotência.** Buscar linhas em `clientes` com `cnpj = cnpj_limpo`. Se vier algum resultado, rota "duplicado": registrar no log e alertar; o fluxo termina sem criar nada. Teste: envie o mesmo formulário duas vezes; a segunda deve cair aqui.

**Blocos 5 e 6 — CNPJ.** Módulo HTTP GET na BrasilAPI com `cnpj_limpo` na URL, parse ativado, opção "não interromper em erro". Roteador por status, como na lição 4. Teste com um CNPJ real (de uma empresa pública conhecida), um inválido e, se possível, simule uma falha (URL errada) para ver a rota de alerta.

**Blocos 7 e 8 — pastas.** "Procurar pasta" por nome dentro da pasta-mãe. Use `razao_social` da API (ou o nome do formulário na rota 404). Se encontrar, use o ID; senão, "criar pasta" e use o ID da nova. Depois crie o ano e as subpastas. Guarde `pasta_id`. Teste: rode duas vezes com nomes iguais e confira que não criou pasta duplicada (se criou, o nome tinha diferença de espaço ou maiúscula: normalize).

**Bloco 9 — planilha.** Adicionar linha com todos os campos, `status = onboarding`, `data_cadastro` em ISO. Teste: confira o CNPJ com zero à esquerda, se houver.

**Bloco 10 — boas-vindas.** Roteador por `canal`. Rota e-mail: Gmail com o texto preparado, mapeando nome, link da pasta (o Drive devolve) e lista de documentos conforme o regime. Rota WhatsApp: só se `opt_in = sim`; senão cai no e-mail. Teste com o seu e-mail e o seu número.

**Bloco 11 — tarefa.** Crie uma tarefa "Onboarding: <razão social> — conferir cadastro, solicitar documentos, agendar reunião" para o responsável escolhido no formulário, com prazo em 3 dias úteis. Se não houver ferramenta de tarefas, um e-mail para o responsável resolve.

**Bloco 12 — log.** Linha no `log` com `onboarding concluído`.

**Handlers.** Módulo de e-mail: "ignorar e registrar" se o e-mail estiver vazio. Módulos de Drive e Sheets: 3 retentativas. Qualquer outro erro: rota de erro para o fluxo central de alertas, com nome do fluxo, bloco, CNPJ e mensagem.

**Nome e documentação.** "ONBOARD Cadastro cliente - formulário -> CNPJ + Drive + planilha + boas-vindas (v01)". Exporte o JSON e escreva a página de documentação da lição 8.

## Roteiro de testes

| # | Caso | Resultado esperado |
|---|---|---|
| 1 | Cadastro normal, CNPJ válido, canal e-mail | Pastas criadas, linha na planilha, e-mail recebido, tarefa criada, log |
| 2 | Mesmo CNPJ de novo | Rota "duplicado": nada criado, alerta recebido |
| 3 | CNPJ inválido | Rota 404: pastas e linha com "não encontrado", e-mail enviado, alerta |
| 4 | CNPJ com pontos e barra | Igual ao caso 1 (normalização funcionou) |
| 5 | E-mail em branco (se o formulário permitir) | Handler ignora o envio, registra no log, resto conclui |
| 6 | Canal WhatsApp sem opt-in | Cai na rota e-mail |
| 7 | Razão social com acento e "&" | Pasta e e-mail corretos |
| 8 | URL da API errada de propósito | Alerta de erro, nada criado |

Só ative o fluxo em produção quando os oito casos passarem.

## Rubrica do projeto

Avalie o seu fluxo (ou o de um colega) com os critérios abaixo; cada item vale de 0 a 2 (0 = ausente, 1 = parcial, 2 = completo). Mínimo para considerar pronto: 18 de 24.

| Critério | O que se espera |
|---|---|
| Gatilho e normalização | Formulário dispara; CNPJ, e-mail e nome normalizados |
| Idempotência | Cadastro repetido não cria nada e alerta |
| Consulta de CNPJ | HTTP com parse, rotas para 200, 404 e outros |
| Pastas | Procurar, senão criar; sem duplicatas; estrutura padrão |
| Planilha | Todos os campos, CNPJ como texto, data ISO, status |
| Comunicação | Rota por canal, opt-in respeitado, texto correto, link da pasta |
| Tarefa | Criada para o responsável com prazo |
| Tratamento de erros | Handlers nos módulos críticos, retentativas, rota para alertas |
| Log | Linha por execução, com resultado |
| Testes | Os oito casos executados e registrados |
| Nome e documentação | Nome padronizado, módulos renomeados, página de documentação, JSON exportado |
| LGPD e segurança | Conta dedicada, só dados necessários, opt-in registrado, credenciais no cofre |

## Erros comuns

- Consultar a BrasilAPI antes de verificar a duplicidade na planilha: gasta operações e, pior, cria pastas e linhas repetidas.
- Procurar a pasta pelo nome digitado no formulário num teste e pelo nome da API no outro, e acabar com duas pastas para o mesmo cliente.
- Enviar o WhatsApp sem conferir `opt_in`, ou mandar o e-mail de boas-vindas para o endereço de teste depois de ativar em produção.
- Ativar o fluxo com só o caso 1 testado; os casos 2, 3 e 8 são os que revelam os buracos.
- Esquecer o handler no módulo de e-mail: um cadastro sem e-mail derruba a execução inteira, inclusive a tarefa e o log.

## Na prática

Rode o fluxo em paralelo com o cadastro manual durante os dois primeiros clientes novos de verdade: compare pasta por pasta e campo por campo. Quando bater, desligue o manual e deixe a tarefa do bloco 11 como o único ponto humano. O tempo de onboarding, que levava uma tarde, passa a ser o tempo de conferir uma tarefa.

## Depois do projeto

Extensões naturais: cobrar os documentos iniciais em 7 dias se a pasta "Documentos" continuar vazia; criar os eventos de obrigações no calendário do responsável conforme o regime; e, no módulo seguinte, trocar o texto fixo do e-mail por um gerado por IA com base no regime e no CNAE.

## Resumo

- Onboarding = formulário → normalizar → idempotência → CNPJ → pastas → planilha → boas-vindas → tarefa → log.
- Cada bloco usa algo já visto: gatilho, variáveis, roteadores, HTTP, Drive, Sheets, e-mail/WhatsApp, handlers.
- Teste os oito casos antes de ativar; a rubrica define o que é "pronto".
- Nome, documentação, exportação e LGPD fazem parte da entrega, não são extras.
