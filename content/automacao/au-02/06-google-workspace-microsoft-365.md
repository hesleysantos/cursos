Nesta lição você vai usar os apps que o escritório já tem como blocos de automação: e-mail (Gmail e Outlook) para ler, filtrar e extrair anexos; Drive e OneDrive para salvar arquivos em pastas por cliente; Sheets e Excel como banco de dados; e o calendário para prazos. Também vai entender permissões e contas de serviço. Isso importa porque a maior parte dos documentos do escritório chega por e-mail e vive em pastas e planilhas; automatizar esse trânsito elimina horas de "baixar, renomear, salvar".

## E-mail: ler, filtrar, extrair anexos

Os conectores de **Gmail** e **Outlook** oferecem gatilhos ("novo e-mail", geralmente com filtros) e ações ("enviar", "marcar como lido", "aplicar marcador", "baixar anexo").

Caso típico: o cliente envia notas fiscais em PDF por e-mail. O fluxo:

```
[Gmail: novo e-mail com anexo, assunto contém "nota" OU remetente na lista de clientes]
   -> [Iterador: para cada anexo]
   -> [Filtro: extensão = pdf OU xml]
   -> [Função: identificar o cliente pelo remetente (buscar na planilha)]
   -> [Drive: salvar na pasta Clientes/<razão social>/<ano>/<mês>]
   -> [Gmail: aplicar marcador "processado"]
```

Boas práticas:

- **Filtre no gatilho**, não depois: menos operações e menos ruído. Filtre por remetente, assunto, presença de anexo ou marcador.
- **Use marcadores** (Gmail) ou **pastas/categorias** (Outlook) para marcar o que já foi processado; o gatilho então busca só e-mails sem a marca. É a técnica de idempotência aplicada ao e-mail.
- Para **identificar o cliente**, mantenha na planilha de clientes uma coluna com os e-mails que ele usa; o fluxo busca o remetente lá. Quando não encontra, cai numa rota "não identificado" que avisa o responsável.
- Anexos chegam como **dados binários**; a ferramenta os passa de um módulo a outro sem que você precise abrir. O módulo do Drive recebe o binário e o nome do arquivo.

## Drive e OneDrive: pastas por cliente

Organização que funciona: `Clientes / <CNPJ ou razão social> / <ano> / <tipo>`. O fluxo precisa de duas operações:

1. **Procurar pasta** pelo nome dentro da pasta-mãe. Se existir, usar o ID; se não, **criar** e usar o ID da nova. Esse "procurar, senão criar" é um padrão que você vai repetir sempre.
2. **Enviar arquivo** para a pasta pelo ID, com um nome padronizado: `2026-03_NF_12345678000190_001.pdf`. Nomes começando por ano-mês ordenam sozinhos.

No OneDrive e no SharePoint a lógica é a mesma, com caminhos em vez de IDs em alguns conectores. Em ambos, o fluxo precisa de permissão de escrita na pasta-mãe.

> **Dica:** o ID da pasta (uma sequência longa na URL) é mais estável que o nome. Guarde os IDs das pastas principais numa planilha de configuração e leia de lá no fluxo.

## Sheets e Excel como banco de dados

Google Sheets e Excel (via OneDrive/SharePoint) são o "banco de dados do pobre", e funcionam bem até alguns milhares de linhas. Operações que o conector oferece: adicionar linha, buscar linhas com filtro, atualizar linha, apagar linha, ler um intervalo.

Regras para a planilha que o fluxo usa (vistas no módulo anterior, agora obrigatórias):

- Cabeçalho na linha 1; uma aba só de dados; sem células mescladas; sem totais no meio.
- **Chave única** por linha (CNPJ, número do pedido). "Atualizar linha" precisa localizar a linha pela chave.
- Datas em ISO e CNPJ como texto. No Excel, formate a coluna como texto antes de o fluxo escrever.
- No Excel, o conector exige que os dados estejam numa **tabela formatada** (Inserir → Tabela); sem isso, o fluxo não enxerga as linhas.

Uma planilha de **log** separada (data, fluxo, cliente, ação, resultado) resolve a rastreabilidade de todos os fluxos de uma vez.

## Calendar: prazos como eventos

O conector do **Google Calendar** ou do **Outlook Calendar** cria, lista e atualiza eventos. Usos no escritório:

- Criar um evento "Entrega DCTFWeb — Cliente X" na agenda do responsável quando um novo cliente entra.
- Gatilho "evento começa em 1 dia" para disparar o lembrete ao cliente.
- Listar os eventos da semana e montar um e-mail de segunda-feira com a pauta.

Lembre do fuso: ao criar eventos, informe `America/Sao_Paulo` explicitamente.

## Permissões e contas de serviço

Três formas de o fluxo acessar esses apps:

| Forma | Como funciona | Quando usar |
|---|---|---|
| **Conta de usuário via OAuth** | Você autoriza com a conta (a dedicada a automações) | O padrão em escritórios pequenos |
| **Conta de serviço (Google)** | Identidade "robô" criada no Google Cloud, com chave própria; você compartilha pastas e planilhas com o e-mail dela | Fluxos técnicos, n8n self-hosted, sem depender de uma pessoa |
| **Registro de aplicativo (Microsoft Entra)** | Equivalente no Microsoft 365: um app com permissões concedidas pelo administrador | Power Automate avançado, integrações em servidor |

Em qualquer caso, aplique o menor privilégio: compartilhe só as pastas e planilhas necessárias; no Google Workspace e no Microsoft 365, o administrador pode restringir quais apps de terceiros podem ser autorizados. Se o fluxo "não enxerga" uma pasta, 90% das vezes é falta de compartilhamento com a conta que o fluxo usa.

## Erros comuns

- Gatilho de e-mail sem filtro, processando newsletters e spam.
- Não marcar o e-mail como processado e salvar o mesmo anexo várias vezes.
- Nome de arquivo sem padrão, impossível de encontrar depois.
- Procurar pasta pelo nome e criar duplicada porque o nome tinha um espaço a mais; normalize ou use ID.
- Planilha do Excel sem tabela formatada: o conector não lê.
- Conectar com a conta de uma pessoa que depois sai da empresa e todos os fluxos param.

## Na prática

Escolha um cliente que envia documentos por e-mail todo mês. Monte o fluxo "e-mail com anexo → pasta do cliente no Drive → marcador processado → linha no log". Rode um mês em paralelo com o processo manual e compare. Quando bater, estenda aos demais clientes com a planilha de remetentes.

## Resumo

- Gmail/Outlook: filtre no gatilho, extraia anexos com iterador, marque o processado.
- Drive/OneDrive: padrão "procurar pasta, senão criar"; nomes de arquivo com ano-mês na frente; prefira IDs.
- Sheets/Excel: cabeçalho limpo, chave única, CNPJ como texto; Excel exige tabela formatada.
- Calendar: prazos como eventos, com fuso explícito.
- Acesso por conta dedicada (OAuth), conta de serviço (Google) ou registro de app (Microsoft); sempre menor privilégio.
