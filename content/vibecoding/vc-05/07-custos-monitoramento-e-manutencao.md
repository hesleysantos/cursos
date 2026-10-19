Nesta lição você vai aprender o que acontece **depois** que o app está no ar: quanto custa mantê-lo, como saber que ele quebrou antes do cliente avisar, como acompanhar erros e disponibilidade, como manter as dependências em dia e o que muda quando o uso cresce. Isso importa porque publicar é o começo, não o fim. Um app que ninguém monitora falha em silêncio, e um app que ninguém atualiza acumula brechas.

## Planos gratuitos e seus limites

A stack deste módulo cabe, em geral, nos planos gratuitos para um projeto pequeno: a Vercel hospeda o Next.js, o Supabase fornece banco e autenticação, e serviços de e-mail e de monitoramento têm faixas sem custo. Os limites exatos (tamanho do banco, número de requisições, usuários ativos, tempo de retenção de logs) mudam com frequência e **devem ser consultados na documentação atual** de cada serviço antes de depender deles.

O que não muda é a lógica dos limites. Planos gratuitos costumam ter:

- **Cotas** (tanto de banda, tanto de armazenamento, tantas execuções por mês).
- **Pausa por inatividade**: alguns serviços "adormecem" projetos sem uso por dias; a primeira requisição depois disso demora ou falha. Para um portal que o cliente abre uma vez por mês, isso é visível.
- **Sem suporte garantido e sem compromisso de disponibilidade**.
- **Retenção curta** de logs e backups.

A regra prática: plano gratuito para desenvolver, testar e para uso pessoal; a partir do momento em que um cliente paga pelo serviço ou depende dele, migre pelo menos o banco para um plano pago. Custa pouco perto do que custa perder dados.

## Logs e erros

**Log** é o registro do que o sistema fez: cada requisição, cada erro, com data e hora. Sem logs, "não funcionou" é um mistério; com logs, é uma linha que diz qual função falhou e por quê.

Dois níveis que você precisa conhecer:

1. **Logs da hospedagem**: a Vercel e o Supabase mostram, nos painéis, as requisições e os erros recentes. Bom para investigar "o que aconteceu às 14h".
2. **Rastreamento de erros**: ferramentas como o **Sentry** capturam cada exceção que acontece no app (no navegador e no servidor), agrupam as repetidas, mostram em que linha ocorreu e com que dados, e avisam por e-mail. Em vez de esperar o cliente reclamar, você recebe "TypeError em gerarFaturas, 12 ocorrências, 3 usuários afetados" minutos depois da primeira.

Instalar o Sentry é um prompt: *"Adicione o Sentry a este projeto Next.js, com a chave em variável de ambiente, capturando erros do servidor e do cliente; não envie dados pessoais dos usuários nos eventos."* O último trecho é importante: logs com CPF ou e-mail viram dado pessoal armazenado em um terceiro.

Peça também que o seu próprio código registre eventos importantes de forma estruturada: *"registre em log, em JSON, cada geração de fatura com user_id, contrato_id e competência"*. Depois, quando um cliente disser "a fatura de março não apareceu", você filtra pelo contrato e vê se ela foi gerada.

## Uptime: está no ar?

Um app pode estar "saudável" nos logs e ainda assim inacessível (domínio expirou, serviço fora do ar). Um **monitor de uptime** é um serviço externo que acessa o seu endereço a cada poucos minutos e avisa se não responder. Há opções gratuitas para um ou poucos endereços. Configure uma rota simples de saúde (`/api/health`, que responde "ok" se conseguir consultar o banco) e aponte o monitor para ela.

## Atualizações de dependências

Toda semana surgem versões novas das bibliotecas que o seu app usa. Nem todas importam; algumas corrigem falhas de segurança e essas importam muito. Rotina sugerida, uma vez por mês:

1. Rode `npm outdated` e `npm audit` (ou os equivalentes da sua stack).
2. Atualize primeiro o que o `audit` marcar como alto ou crítico.
3. Rode os testes automatizados. Se passarem, faça commit e deploy.
4. Atualizações grandes (mudança de versão principal do Next.js, por exemplo) merecem uma sessão própria e um branch separado.

Serviços como o **Dependabot** (do GitHub) abrem automaticamente propostas de atualização. Aceite as pequenas com testes verdes; estude as grandes.

## Quando a conta cresce

Sinais de que o app saiu da fase "projeto pequeno":

- Mais de um escritório ou dezenas de usuários ativos.
- Faturamento que depende do app estar no ar.
- Pessoas que não são você cadastrando dados.

O que muda:

- **Custos**: os planos pagos cobram por uso (banco maior, mais requisições, mais e-mails). Acompanhe a fatura mensal dos serviços e defina alertas de gasto no painel de cada um — todos têm.
- **Ambientes**: separe **desenvolvimento** (onde você testa) de **produção** (onde o cliente usa). Um projeto Supabase para cada; a Vercel cria automaticamente uma versão de pré-visualização para cada branch.
- **Suporte**: um canal onde o usuário reporta problemas e uma rotina para responder.
- **Backups e restauração** verificados, não presumidos.

```text
Checklist mensal de manutenção
[ ] Olhar o painel do Sentry: erros novos? erros recorrentes?
[ ] Conferir uso vs. limite em Vercel e Supabase
[ ] npm audit / npm outdated; atualizar e testar
[ ] Confirmar que o backup da semana existe e abre
[ ] Revisar a fatura dos serviços e os alertas de gasto
[ ] Ler o DIVIDAS.md e pagar uma dívida
```

## Erros comuns

- Descobrir que o projeto "dormiu" quando o cliente tenta usar.
- Não ter nenhum rastreamento de erro e saber dos problemas por WhatsApp.
- Enviar dados pessoais para a ferramenta de logs.
- Atualizar todas as dependências de uma vez, sem testes, numa sexta à tarde.
- Testar direto na produção porque "é rapidinho".

## Na prática

O portal de honorários roda há três meses. O Sentry avisa de um erro na exportação CSV que só acontece com clientes sem contrato ativo — ninguém tinha reclamado ainda. O contador corrige em dez minutos com a IA, roda os testes, faz deploy. No fim do mês, o painel do Supabase mostra o banco em 60% do limite do plano; ele migra para o plano pago antes de bater no teto. Nenhum cliente percebeu nada, e é assim que deve ser.

## Resumo

- Planos gratuitos servem para desenvolver; com cliente pagante, pague pelo menos o banco. Limites mudam: consulte a documentação.
- Logs dizem o que aconteceu; rastreamento de erros (Sentry) avisa antes do cliente; não registre dados pessoais.
- Monitor de uptime externo apontado para uma rota de saúde.
- Dependências: `audit` e `outdated` mensalmente, testes verdes antes do deploy.
- Ao crescer: separar ambientes, alertas de gasto, canal de suporte, backups verificados.
