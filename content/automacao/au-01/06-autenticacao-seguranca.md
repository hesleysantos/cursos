Nesta lição você vai entender como as automações se identificam nos sistemas (chaves, tokens e OAuth), o que acontece quando você clica em "Conectar com Google", por que o menor privilégio protege o escritório, onde guardar segredos, o que a LGPD exige quando dados de clientes passam por terceiros e por que logs importam. Uma automação tem as mesmas senhas que você e trabalha 24 horas por dia: se ela vaza, vaza tudo.

## Três formas de se identificar

Uma automação precisa provar quem é. Três mecanismos:

| Mecanismo | O que é | Analogia | Onde aparece |
|---|---|---|---|
| **Chave de API** | Sequência fixa gerada no painel do serviço | Chave da porta: quem tem, entra | ERPs, plataformas de boleto, APIs de IA |
| **Token** | Credencial temporária, com validade | Pulseira de evento: vale só hoje | Quase toda API moderna |
| **OAuth** | Você autoriza um app a agir na sua conta, sem dar a senha | Procuração com poderes limitados | Google, Microsoft, Meta, bancos |

Na prática: chave de API é simples, mas, se vazar, vale até você revogá-la. Token expira sozinho. OAuth é o mais seguro para contas Google e Microsoft, porque a senha nunca sai de você.

## O que acontece ao clicar em "Conectar com Google"

Quando você conecta o Make ou o n8n à sua conta Google, acontece o seguinte:

1. A ferramenta abre uma tela **do Google** (repare no endereço: `accounts.google.com`, não o site da ferramenta).
2. Você faz login **no Google**. A ferramenta não vê sua senha.
3. O Google mostra as **permissões** pedidas (*scopes*, escopos): "ver e editar planilhas", "ler e enviar e-mails", "gerenciar arquivos do Drive".
4. Você aceita. O Google entrega à ferramenta um **token de acesso** (curto, horas) e um **token de atualização** (longo), usado para renovar o acesso.
5. A partir daí, a ferramenta age **em seu nome**, limitada aos escopos aprovados.

Duas consequências: você pode **revogar** o acesso a qualquer momento na página de segurança da conta, sem trocar a senha; e os escopos são o seu controle: se o fluxo só lê planilhas, não aceite acesso ao Gmail inteiro.

> **Atenção:** "ver, editar, criar e excluir todos os seus arquivos do Google Drive" é muito mais do que "ver planilhas específicas". Leia antes de aceitar.

## Menor privilégio

O **princípio do menor privilégio** diz: cada automação (e cada pessoa) deve ter só as permissões necessárias para a tarefa. Na prática:

- Crie uma conta separada para automações (`automacao@seuescritorio.com.br`) em vez de usar a conta do sócio.
- Compartilhe com essa conta só as pastas e planilhas que o fluxo usa.
- Ao gerar uma chave de API, escolha permissão de leitura se o fluxo só lê.
- Uma chave por fluxo, não uma chave mestra. Se uma vazar, você revoga só ela.

É o **molho de chaves do zelador**: ele não precisa da chave do cofre para limpar o corredor.

## Onde guardar segredos

Segredo é qualquer chave, token ou senha. Regras:

- **Nunca** em planilhas, e-mails, grupos de WhatsApp ou no texto do fluxo.
- **Nunca** em código enviado a repositórios (GitHub) ou colado numa IA.
- Use o **cofre de credenciais** da ferramenta (Make, n8n, Zapier e Power Automate têm um): a chave fica criptografada e o fluxo só a referencia.
- Em Python, use **variáveis de ambiente** ou um arquivo `.env` fora do controle de versão.
- Em equipe, use um gerenciador de senhas com cofres compartilhados.
- **Rotacione**: troque chaves periodicamente e sempre que alguém com acesso sair.

## LGPD: dados de clientes em ferramentas de terceiros

A **LGPD** (Lei Geral de Proteção de Dados, Lei 13.709/2018) se aplica a qualquer tratamento de dados pessoais, e um escritório contábil trata muitos: CPF de sócios, folha de pagamento, dados bancários. Quando uma automação envia esses dados ao Make, ao n8n na nuvem, a uma API de IA ou a um serviço de WhatsApp, você está **compartilhando dados com um operador** (na linguagem da lei). É permitido, mas exige cuidados:

1. **Base legal.** Em geral, o contrato com o cliente e as obrigações legais do contador justificam o tratamento. Outra finalidade (marketing, por exemplo) precisa de outra base.
2. **Minimização.** Envie só o necessário. Para um lembrete de guia, a ferramenta não precisa do salário dos funcionários.
3. **Termos do fornecedor.** Onde os dados ficam, por quanto tempo e se são usados para treinar modelos de IA.
4. **Transferência internacional.** Muitas ferramentas guardam dados fora do Brasil; a LGPD permite, com garantias. Documente.
5. **Direitos do titular.** Se o cliente pedir exclusão, você precisa saber em quais ferramentas os dados estão.
6. **Inventário.** Qual fluxo trata quais dados, em qual ferramenta, com qual finalidade.

Para dados sensíveis (saúde, biometria, menores), redobre o cuidado e, em dúvida, consulte um especialista em proteção de dados.

## Logs: a caixa-preta da automação

**Log** é o registro do que a automação fez: quando rodou, com quais dados, o que deu certo e o que falhou. Serve para **investigar erros** ("por que o cliente X não recebeu a guia?"), **provar conformidade** ("enviada dia 15 às 9h12") e **detectar abuso** ("por que rodou 500 vezes de madrugada?").

Logs também são dados: não registre chaves nem dados sensíveis completos (mascare o CPF: `***.456.789-**`). Defina retenção e quem pode ver.

## Erros comuns

- Conectar automações à conta pessoal do sócio.
- Aceitar todos os escopos sem ler.
- Colar a chave de API numa mensagem para "testar rapidinho".
- Não revogar acessos quando um funcionário sai.
- Mandar a folha inteira para uma IA quando bastava o total.
- Deixar o log registrando o token em texto puro.

## Na prática

Faça hoje um inventário de dez minutos: abra a página de "apps com acesso à sua conta" no Google e no Microsoft 365 e revogue o que não reconhece. Liste as ferramentas de automação do escritório, que dados passam por elas e quem tem a senha. Isso atende à LGPD e mostra onde o escritório está exposto.

## Resumo

- Chave de API é fixa; token expira; OAuth autoriza um app sem entregar a senha, com escopos limitados e revogáveis.
- Ao "conectar com Google", leia os escopos; aceite só o necessário.
- Menor privilégio: conta separada para automações, uma chave por fluxo, só leitura quando bastar.
- Segredos ficam em cofres de credenciais ou variáveis de ambiente, nunca em planilhas ou mensagens.
- LGPD: minimize os dados enviados a terceiros, verifique os termos, mantenha inventário, respeite os direitos do titular.
- Logs investigam, provam e detectam; mascare dados sensíveis.
