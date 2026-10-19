Nesta lição você vai transformar fluxos que "funcionam" em fluxos confiáveis: tratar erros com handlers, configurar retentativas, notificar falhas, nomear e versionar fluxos, documentá-los, controlar custos por operação e decidir quando vale hospedar o n8n por conta própria. O fluxo da lição 2 vai falhar um dia; a diferença entre um susto e um prejuízo é o que você faz nesta lição.

## Handlers de erro

Quando um módulo falha (API fora, campo vazio, permissão negada), o padrão de quase toda ferramenta é **parar a execução** e, após algumas falhas seguidas, **desativar o fluxo**. Um **handler de erro** (*error handler*) é um caminho alternativo que roda quando o módulo falha, em vez de parar tudo.

É o **plano B do roteiro de viagem**: se o voo atrasar, já se sabe o que fazer; ninguém fica parado no aeroporto.

Os handlers típicos:

| Handler | O que faz | Quando usar |
|---|---|---|
| **Ignorar** | Pula o item com erro e continua com o próximo | Item isolado que não compromete os demais (um cliente sem e-mail) |
| **Retentar** (*retry*) | Tenta de novo após um intervalo, N vezes | Falhas transitórias (API lenta, 429, 5xx) |
| **Interromper** (*break/stop*) | Para a execução, mas guarda o item para reprocessar depois | Falha que precisa de intervenção |
| **Reverter** (*rollback*) | Desfaz o que foi feito nesta execução | Quando as ações anteriores não podem ficar pela metade |
| **Retomar** (*resume*) | Continua com um valor substituto | Campo opcional que falhou (CEP não encontrado: segue sem endereço) |

No Make, os handlers se ligam ao módulo pela rota de erro; no n8n, o nó tem a opção "continuar em caso de erro" e o fluxo pode ter um **error workflow** global; no Power Automate, "configurar executar após" define que um passo roda quando o anterior falha.

## Retentativas

Configure retentativa só para erros transitórios e com espera crescente: 3 tentativas com 30 s, 2 min e 10 min, por exemplo. Nunca retente módulos que enviam mensagens ou criam registros sem antes garantir idempotência (verificação prévia por identificador), senão a retentativa duplica o envio.

## Notificação de falha

Toda falha definitiva vira mensagem para uma pessoa. Padrão de três partes:

1. **Um fluxo de erro central** (no n8n, o error workflow; no Make, um cenário disparado por webhook) que recebe: nome do fluxo, módulo, mensagem de erro, dados do item (sem segredos) e link da execução.
2. **Envio** por Telegram, e-mail ou canal da equipe.
3. **Registro** numa planilha de incidentes: data, fluxo, erro, quem tratou, como resolveu.

Além disso, um **fluxo sentinela** diário confere no log se os fluxos críticos rodaram e avisa se algum ficou em silêncio; nem toda ferramenta avisa quando desativa um fluxo por excesso de erros.

## Nomenclatura

Com dez fluxos, nomes como "Cenário 3" viram pesadelo. Adote um padrão:

```
[área] [processo] - [gatilho] -> [resultado]  (vNN)
FISCAL Lembrete DAS - dia 18 -> e-mail/WhatsApp (v03)
ONBOARD Cadastro cliente - formulário -> CNPJ + Drive + planilha (v02)
INTERNO Alerta de erros - webhook -> Telegram (v01)
```

O mesmo padrão para conexões, planilhas e pastas. Dentro do fluxo, renomeie os módulos: "HTTP: consultar CNPJ na BrasilAPI" em vez de "HTTP 1".

## Versões

As ferramentas guardam histórico de alterações, mas não substituem disciplina:

- Antes de uma mudança grande, **duplique** o fluxo, trabalhe na cópia (v04) e só troque quando testada.
- **Exporte** o fluxo (JSON) para uma pasta "Fluxos/exportados" com data. É o seu backup se a conta for perdida.
- Anote na descrição o que mudou em cada versão.

## Documentação do fluxo

Uma página por fluxo, num lugar compartilhado. O mínimo:

| Item | Exemplo |
|---|---|
| Nome e versão | FISCAL Lembrete DAS v03 |
| Objetivo | Lembrar clientes do Simples do vencimento do DAS |
| Gatilho | Dia 18, 9h, America/Sao_Paulo |
| Entradas | Planilha CLIENTES (aba clientes), pasta Guias/<ano>/<mês> |
| Saídas | E-mail/WhatsApp ao cliente, linha na planilha LOG |
| Conexões | Google - automacao@, WhatsApp - BSP X |
| Tratamento de erros | Sem e-mail: ignora e registra; API fora: 3 retentativas; demais: alerta |
| Dados pessoais | Nome, e-mail, telefone (base: contrato) |
| Responsável | Fulano; substituto: Beltrano |
| Última alteração | 2026-03-10: adicionado filtro de feriado |

Quem não construiu o fluxo deve conseguir operá-lo lendo essa página.

## Custos por operação

Nas ferramentas em nuvem, cada módulo executado custa. Estimativa mensal: **execuções por mês × módulos por execução**, lembrando que iteradores multiplicam. Um fluxo de 6 módulos (gatilho que lê a planilha, iterador e mais quatro módulos) que roda uma vez por dia com 60 clientes gasta 1 + 5 × 60 = 301 operações por dia (o gatilho roda uma vez; o iterador e os quatro módulos seguintes rodam uma vez por cliente), cerca de 9 mil por mês. Para reduzir: filtrar antes do iterador, usar webhook em vez de consulta, agrupar com agregadores e processar em lote quando o conector permitir. Acompanhe o medidor de operações semanalmente no início.

## n8n self-hosted: quando vale

Hospedar o n8n por conta própria (num servidor em nuvem, geralmente via Docker) elimina o custo por execução e mantém os dados sob seu controle. Vale quando:

- O volume de operações já custa mais que um servidor pequeno por mês.
- Dados sensíveis (folha, bancos) não devem passar por terceiros, por política ou contrato.
- Há alguém capaz de atualizar, fazer backup e monitorar o servidor.

Não vale quando o escritório é pequeno, ninguém é técnico e a nuvem cabe no orçamento: a manutenção consome mais tempo do que a assinatura custaria. Meio-termo: provedores que hospedam o n8n por você.

## Erros comuns

- Fluxo sem handler: para na primeira exceção e é desativado em silêncio.
- Retentativa em módulo de envio sem idempotência: cliente recebe três mensagens.
- Nomes genéricos ("Cenário 3", "HTTP 1").
- Editar o fluxo em produção sem cópia e quebrar o que funcionava.
- Nenhuma exportação; a conta é perdida e os fluxos junto.
- Iterador antes do filtro, estourando o limite de operações no dia 10 do mês.

## Na prática

Volte ao fluxo da lição 2 e acrescente: handler "ignorar e registrar" no módulo de e-mail (e-mail vazio), 3 retentativas no módulo do Sheets, rota de erro para o fluxo central de alertas, nome padronizado, exportação em JSON e a página de documentação. Faça isso em todos os fluxos antes de criar novos.

## Resumo

- Handlers: ignorar, retentar, interromper, reverter, retomar. Sem handler, o fluxo para e pode ser desativado.
- Retentativa só para falhas transitórias, com espera crescente e idempotência garantida.
- Fluxo central de alertas + planilha de incidentes + fluxo sentinela.
- Nomenclatura padrão para fluxos, módulos, conexões e planilhas; versões em cópias e exportações.
- Documente cada fluxo numa página; estime operações (execuções × módulos, iteradores multiplicam).
- n8n self-hosted vale com volume alto, dados sensíveis e alguém para manter.
