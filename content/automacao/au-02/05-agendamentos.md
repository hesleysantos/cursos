Nesta lição você vai aprender a disparar fluxos pelo relógio: entender a notação cron, montar fluxos diários e mensais (como lembrar as guias no dia 20), lidar com fuso horário, definir janelas de execução e evitar que duas execuções se sobreponham. Isso importa porque o calendário fiscal do escritório é uma coleção de prazos recorrentes, e cada um deles pode virar um gatilho agendado.

## Gatilhos de tempo

Além de reagir a eventos (formulário respondido, e-mail recebido), o fluxo pode começar **em horários definidos**. É o despertador do fluxo. Toda ferramenta oferece um gatilho de agendamento (*Schedule*, *Cron*, *Recurrence*) com duas formas de configurar: uma **interface amigável** ("todo dia às 8h", "toda segunda") e, para casos mais finos, a notação **cron**.

## Cron explicado

**Cron** é uma notação de cinco campos, separados por espaço, que descreve quando algo roda:

```
┌──────── minuto (0–59)
│ ┌────── hora (0–23)
│ │ ┌──── dia do mês (1–31)
│ │ │ ┌── mês (1–12)
│ │ │ │ ┌ dia da semana (0–6, domingo = 0)
│ │ │ │ │
* * * * *
```

O asterisco `*` significa "qualquer valor". Alguns exemplos:

| Expressão | Significado |
|---|---|
| `0 8 * * *` | Todo dia às 8h00 |
| `0 8 * * 1-5` | De segunda a sexta às 8h00 |
| `30 9 20 * *` | Dia 20 de cada mês às 9h30 |
| `0 8 1 * *` | Dia 1 de cada mês às 8h00 |
| `0 */2 * * *` | A cada 2 horas, no minuto 0 |
| `0 7 * 1,4,7,10 *` | Todo dia às 7h, só em janeiro, abril, julho e outubro |
| `0 18 * * 5` | Toda sexta às 18h |

Leia sempre da esquerda para a direita: minuto, hora, dia do mês, mês, dia da semana. Um erro comum é trocar hora e minuto: `8 0 * * *` roda às 00h08, não às 8h.

> **Dica:** sites como crontab.guru traduzem expressões cron para uma frase clara (em inglês, como "At 09:00 on day-of-month 20"). Use-os para conferir antes de ativar.

## Fluxos diários e mensais no escritório

**Diário:** todo dia útil às 7h, buscar na planilha de pendências os documentos com prazo em até 3 dias e enviar um resumo ao responsável. Cron: `0 7 * * 1-5`.

**Mensal, dia 20: lembrar guias.** O fluxo clássico:

```
[Agendamento: 0 9 20 * *]
   -> [Sheets: buscar clientes ativos]
   -> [Iterador]
   -> [Filtro: canal = e-mail]
   -> [Gmail: "Sua guia do DAS vence hoje; o PDF está em anexo/na pasta"]
   -> [Sheets: log com data, CNPJ, "lembrete enviado"]
```

Dois cuidados com o dia 20. Primeiro, **fins de semana e feriados**: a maior parte dos vencimentos é antecipada ou postergada conforme a regra do tributo, e um lembrete "vence hoje" num sábado confunde. Solução simples: rodar no dia 18 com a mensagem "vence dia 20"; solução melhor: um passo que consulte a API de feriados da BrasilAPI e ajuste o texto. Segundo, **meses curtos**: `0 9 31 * *` só roda nos meses com 31 dias. Para "último dia do mês", prefira rodar no dia 1 olhando para trás, ou use a opção "último dia" da interface, se existir.

## Fusos horários

O servidor da ferramenta pode estar em outro país. Se o fluxo está configurado em UTC (tempo universal) e você quer 8h de Brasília (UTC−3), precisa agendar para 11h UTC. Cada ferramenta tem um lugar para definir o **fuso do fluxo ou da conta**; configure como `America/Sao_Paulo` e todos os agendamentos e funções de data passam a usar o horário de Brasília.

Dois sintomas de fuso errado: o fluxo roda três horas antes ou depois do esperado, e a data gravada na planilha vira o dia anterior quando o fluxo roda à noite. Lembre também que o Brasil não tem mais horário de verão desde 2019; se a ferramenta aplicar um, algo está configurado como outro fuso.

## Janelas de execução

**Janela** é o período em que o fluxo pode rodar. Faz sentido limitar:

- Fluxos que enviam mensagens a clientes: só em horário comercial, de segunda a sexta. Ninguém quer um WhatsApp de cobrança às 3h da manhã.
- Fluxos que consultam APIs com limite por hora: distribuir ao longo do dia em vez de concentrar.
- Fluxos pesados (relatórios): madrugada, para não disputar recursos com o expediente.

Na prática, isso é um filtro logo após o gatilho: "se a hora atual está entre 8 e 18 e o dia é útil, continue; senão, pare".

## Evitar sobreposição

Se um fluxo roda a cada 5 minutos e uma execução leva 8 minutos (porque a API está lenta), a segunda começa antes da primeira terminar. Duas execuções processando o mesmo item geram duplicidade. Como evitar:

1. **Intervalo maior que a duração máxima.** Meça quanto o fluxo demora no pior caso e agende com folga.
2. **Opção de não sobrepor.** Algumas ferramentas têm configuração "não executar se a anterior ainda estiver rodando" ou limite de execuções simultâneas (o n8n, por exemplo, permite limitar). Verifique na documentação atual da sua.
3. **Marcação de "em processamento".** O fluxo marca a linha como "processando" antes de agir e só pega linhas sem marca. É a técnica de idempotência do módulo anterior.
4. **Gatilho de evento no lugar de consulta.** Se existe webhook, use; elimina o problema.

## Erros comuns

- Trocar minuto e hora no cron.
- Agendar para o dia 31 e perder os meses curtos.
- Esquecer o fuso e disparar lembretes às 5h da manhã.
- Rodar lembretes "vence hoje" em feriados.
- Intervalo menor que a duração e sobrepor execuções.
- Não registrar a última execução, o que impede saber se o fluxo deixou de rodar (um fluxo agendado que para em silêncio é um risco; crie um segundo fluxo que avisa se o log do dia não existir).

## Na prática

Monte um calendário dos prazos recorrentes do escritório (DAS, DCTFWeb, FGTS Digital, folha, envio de extratos, cobrança de documentos) com a data de cada um. Para cada prazo, escreva o cron que dispararia o lembrete alguns dias antes, em dia útil, em horário comercial. Esse calendário vira, um a um, fluxos agendados.

## Resumo

- Gatilhos de tempo disparam pelo relógio; interface amigável ou notação cron.
- Cron: minuto, hora, dia do mês, mês, dia da semana. `0 9 20 * *` = dia 20 às 9h.
- Cuidado com fins de semana, feriados e meses curtos nos fluxos mensais.
- Configure o fuso `America/Sao_Paulo`; o Brasil não tem horário de verão.
- Janelas: mensagens só em horário comercial; cargas pesadas de madrugada.
- Evite sobreposição com intervalo folgado, opção de não concorrer, marcação "processando" ou webhook.
