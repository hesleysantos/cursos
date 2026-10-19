Nesta lição você vai aprender a pensar como um engenheiro de confiabilidade: listar o que pode dar errado numa automação, usar retentativas com bom senso, entender idempotência (a propriedade que evita cobrar o cliente duas vezes), configurar alertas, manter um humano no loop e registrar cada execução. Isso importa porque uma automação que falha em silêncio é pior do que nenhuma automação: você acha que a guia foi enviada, e não foi.

## Tudo que pode dar errado (e vai)

Uma automação depende de várias peças que não estão sob seu controle. As falhas mais comuns num escritório:

| Falha | Exemplo | Sintoma |
|---|---|---|
| **Serviço fora do ar** | API do banco indisponível de madrugada | Fluxo para com erro 5xx ou tempo esgotado |
| **Dado faltando** | Cliente novo sem e-mail no cadastro | Passo de envio falha ou envia para ninguém |
| **Dado em formato inesperado** | Valor "1.234,56" onde se esperava 1234.56 | Soma errada, filtro que não bate |
| **Duplicidade** | Fluxo rodou duas vezes no mesmo evento | Cliente recebe duas cobranças |
| **Limite excedido** | 429: muitas requisições | Parte dos clientes não é processada |
| **Mudança na fonte** | Coluna renomeada na planilha, campo novo na API | Fluxo "funciona" com dados errados |
| **Credencial expirada** | Token do Google venceu | Erro 401 em todos os passos |

O primeiro passo para confiabilidade é **listar** essas falhas antes de montar o fluxo: para cada passo do fluxograma da lição 2, pergunte "e se isso falhar?".

## Retentativas (retry)

Muitas falhas são **transitórias**: a API estava fora por 30 segundos, a rede oscilou. Para essas, a solução é **tentar de novo**. Mas tentar de novo tem regras:

1. **Espere entre tentativas**, e aumente a espera a cada falha (10 s, 30 s, 2 min). Isso se chama *backoff* e evita sobrecarregar um serviço que já está com problema.
2. **Limite o número de tentativas** (três a cinco). Depois disso, desista e avise alguém.
3. **Só repita o que é seguro repetir.** Consultar um CNPJ de novo não faz mal. Enviar uma cobrança de novo pode fazer. É aqui que entra a idempotência.

Ferramentas como Make e n8n têm retentativa configurável por passo; em Python, você escreve o laço.

## Idempotência: o interruptor

**Idempotente** é uma operação que, executada uma ou dez vezes, produz o mesmo resultado. A palavra é feia, mas a ideia é simples. Pense no **interruptor com posição**: apertar "ligar" dez vezes deixa a luz ligada, igual a apertar uma vez. Já um **botão de alternar** (aperta, liga; aperta de novo, desliga) não é idempotente: o resultado depende de quantas vezes você apertou.

Nas automações:

- "Marcar o cliente como ativo" é idempotente: marcar duas vezes dá no mesmo.
- "Somar 100 ao saldo" não é: duas execuções somam 200.
- "Enviar e-mail de boas-vindas" não é: o cliente recebe dois.

Como tornar uma operação idempotente? Com um **identificador do evento** e uma verificação antes de agir:

```
Antes de enviar a guia do cliente 12345678000190 referente a 2026-03:
  -> consultar a planilha de controle: já existe registro "12345678000190 | 2026-03 | enviado"?
       Sim -> pular
       Não -> enviar e registrar
```

A chave `CNPJ + competência` identifica o evento. Com ela, o fluxo pode rodar quantas vezes for (por retentativa, por engano, por reprocessamento) sem duplicar o envio. Muitas APIs de pagamento aceitam um cabeçalho de **chave de idempotência** justamente para isso: se a mesma chave chegar duas vezes, a segunda cobrança é ignorada.

## Alertas: falhar em voz alta

Regra de ouro: **toda falha definitiva precisa chegar a uma pessoa**, por e-mail, Slack, Teams, Telegram ou WhatsApp. O alerta deve dizer, no mínimo:

- qual fluxo falhou,
- em que passo,
- com qual dado (cliente, competência),
- qual foi o erro,
- e, se possível, um link para a execução.

Evite o extremo oposto: alertar para cada pequena retentativa que deu certo depois gera ruído, e a equipe passa a ignorar os alertas. Alerte falhas definitivas e resuma as transitórias num relatório diário.

## Humano no loop

**Humano no loop** (*human in the loop*) significa colocar um ponto de aprovação ou revisão humana dentro do fluxo, antes das ações irreversíveis ou de alto risco. Exemplos:

- O fluxo prepara os e-mails com as guias, mas um responsável clica em "aprovar lote" antes do envio.
- A conciliação automática casa 90% dos lançamentos; os 10% restantes vão para uma lista que uma pessoa revisa.
- Um agente de IA classifica despesas, mas tudo acima de R$ 5.000 vai para revisão.

A decisão de onde colocar o humano depende de duas perguntas: **qual o custo do erro?** e **dá para desfazer?** Enviar um lembrete errado é barato e desfazível (manda outro pedindo desculpas). Pagar uma guia duplicada não é.

## Registro de execuções

Cada vez que o fluxo roda, registre: data e hora, gatilho, dados de entrada (resumidos, sem segredos), resultado de cada passo, sucesso ou falha. As ferramentas de fluxo fazem isso no histórico de execuções, mas por tempo limitado; para o que importa (guias enviadas, cobranças emitidas), grave também numa planilha sua. É esse registro que responde ao cliente "vocês não me mandaram a guia!" com data, hora e comprovante.

## Erros comuns

- Retentar sem limite e sem espera, derrubando o serviço (e a sua chave).
- Retentar uma operação não idempotente e duplicar cobranças.
- Configurar o fluxo para "continuar em caso de erro" sem avisar ninguém.
- Alertar demais e treinar a equipe a ignorar alertas.
- Colocar o humano no loop em tudo, o que transforma a automação em uma lista de aprovações manuais.
- Confiar só no histórico da ferramenta, que apaga execuções antigas.

## Na prática

Para o processo que você mapeou na lição 2, faça uma tabela com três colunas: **passo**, **o que pode falhar**, **o que o fluxo faz**. Na terceira coluna só valem quatro respostas: retentar (com limite), pular e registrar, alertar e parar, ou pedir aprovação humana. Essa tabela é o plano de tratamento de erros e será o que diferencia o seu fluxo de um que "quase sempre funciona".

## Resumo

- Liste o que pode falhar: serviço fora, dado faltando, formato errado, duplicidade, limite, mudança na fonte, credencial expirada.
- Retentativas com espera crescente e limite de tentativas; só para operações seguras de repetir.
- Idempotência: mesmo resultado em uma ou dez execuções; use um identificador do evento e verifique antes de agir.
- Toda falha definitiva vira alerta para uma pessoa, com fluxo, passo, dado e erro.
- Humano no loop antes de ações caras ou irreversíveis.
- Registre cada execução em lugar seu, não só no histórico da ferramenta.
