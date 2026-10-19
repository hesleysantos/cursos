Nesta lição você vai conhecer quem está do outro lado (criminosos, pessoas de dentro, ativistas e governos), o que cada um quer e, principalmente, como um ataque se desenrola em etapas. Entender a cadeia de um ataque é o que permite perceber que a maioria das defesas boas não é tecnológica: é interromper o ataque numa etapa barata, antes que ele chegue ao objetivo.

## Quem ataca

Não existe "o hacker" genérico. Existem perfis diferentes, com motivações e recursos muito diferentes.

| Tipo de atacante | O que quer | Como costuma agir |
|---|---|---|
| Criminosos (cibercrime) | Dinheiro | Golpes, ransomware, roubo de credenciais, fraude bancária |
| Insiders (pessoas de dentro) | Vingança, ganho pessoal ou simples descuido | Ex-funcionário com acesso ativo, estagiário que copia a base de clientes, colega que clica num anexo |
| Hacktivistas | Chamar atenção para uma causa | Derrubar sites, pichar páginas, vazar documentos |
| Estados e grupos patrocinados | Espionagem, sabotagem, influência | Ataques sofisticados e pacientes contra governos e empresas estratégicas |

Para um escritório contábil, os dois primeiros são os que importam no dia a dia. O cibercrime no Brasil é organizado como uma indústria: há quem desenvolve o vírus, quem aluga o acesso a computadores já invadidos, quem faz as ligações da "central do banco" e quem lava o dinheiro em contas de laranjas.

O insider merece atenção porque não precisa invadir nada: ele já está dentro. E o insider mais comum não é o vilão, é o descuidado: usa a mesma senha em tudo, deixa o computador destravado, manda planilha de clientes para o e-mail pessoal "para trabalhar em casa".

## A cadeia de um ataque

Ataques seguem uma sequência, que a área de segurança costuma descrever em quatro grandes etapas.

1. **Reconhecimento.** O atacante estuda o alvo: quem trabalha ali (LinkedIn, site do escritório, Instagram), quais sistemas usa, qual é o e-mail do sócio, quem cuida do financeiro. Tudo público.
2. **Acesso inicial.** Ele entra por algum lugar: um e-mail de phishing que rouba a senha, um anexo com programa malicioso (*malware*, qualquer programa feito para causar dano), uma senha vazada reutilizada, uma área de trabalho remota aberta para a internet com senha fraca.
3. **Movimento e escalada.** Dentro, ele procura mais: outras máquinas, o servidor de arquivos, a senha de administrador, o certificado digital, o acesso ao banco. Essa fase pode durar dias ou semanas em silêncio.
4. **Objetivo.** Só agora acontece o que a vítima percebe: arquivos criptografados com pedido de resgate, transferência bancária, dados vendidos, boleto trocado.

Essa visão em etapas é poderosa porque **cada etapa é uma chance de interromper o ataque**. A dupla verificação (MFA) corta o acesso inicial mesmo que a senha vaze. Contas sem privilégio de administrador dificultam a escalada. O backup testado neutraliza o objetivo do ransomware. Não é preciso ser perfeito em tudo; é preciso ter barreiras em mais de uma etapa.

## Casos reais no Brasil

Alguns episódios ajudam a enxergar a cadeia funcionando. As descrições aqui são de alto nível, sem detalhes técnicos de execução.

- **Ransomware no STJ (2020).** O Superior Tribunal de Justiça teve seus sistemas criptografados e ficou dias sem operar. O caso mostrou que disponibilidade é tão crítica quanto sigilo, e que a recuperação depende de backup íntegro.
- **Ministério da Saúde e ConecteSUS (2021).** Um grupo criminoso derrubou os sistemas e o aplicativo que guardava os comprovantes de vacinação, no meio da pandemia. Pelo que foi apurado e divulgado, a entrada envolveu credenciais de acesso válidas (usuário e senha), não uma "super vulnerabilidade".
- **Megavazamento de dados (2021).** Uma base com dados de mais de 220 milhões de CPFs circulou em fóruns criminosos. Esses dados alimentam até hoje golpes que parecem legítimos, porque o golpista "sabe" seu nome, CPF e endereço.
- **Golpes do Pix.** Não exploram falha do Pix, e sim a pessoa: a "central do banco" liga sobre uma transação suspeita e orienta a vítima a "devolver" o dinheiro; o falso vendedor manda QR Code adulterado; o WhatsApp clonado pede transferência a um parente. Em todos, o acesso inicial é a conversa.
- **Golpe do boleto.** Um programa malicioso instalado na máquina troca a linha digitável do boleto na hora da impressão ou do pagamento. A integridade é quebrada sem que ninguém perceba, até o fornecedor cobrar de novo.

## O que a lei diz

No Brasil, invadir dispositivo alheio para obter, adulterar ou destruir dados é crime previsto no art. 154-A do Código Penal, inserido pela **Lei 12.737/2012** (Lei Carolina Dieckmann). A Lei 14.155/2021 aumentou as penas desse crime e das fraudes por meio eletrônico. Isso também delimita o que você pode fazer: testar a segurança de um sistema que não é seu, sem autorização, é invasão, mesmo com boa intenção. Neste curso, toda prática será em ambiente próprio.

## Erros comuns

- **"Sou pequeno demais para ser alvo."** Campanhas automatizadas atacam milhares de alvos de uma vez; o critério é a facilidade, não o tamanho.
- **Olhar só para fora.** Boa parte dos incidentes vem de dentro, por má-fé ou descuido.
- **Achar que o ataque é instantâneo.** Entre o acesso inicial e o objetivo pode haver semanas. Monitorar sinais (login estranho, arquivo que sumiu) dá tempo de reagir.
- **Culpar a vítima do golpe.** O golpe funciona porque explora confiança, urgência e medo, sentimentos que todo mundo tem. A defesa é processo, não "esperteza".

## Na prática

Pegue o inventário de ativos da lição anterior e, para cada ativo de risco alto, responda: por qual etapa um atacante chegaria até ele? O certificado digital, por exemplo: reconhecimento (descobre quem é o contador), acesso inicial (phishing para o e-mail dele), movimento (procura o arquivo .pfx e a senha anotada), objetivo (emite notas, altera dados fiscais). Agora pense em uma barreira para cada etapa. Isso é, de forma simplificada, o que um analista chama de modelagem de ameaças.

> **Atenção:** desconfie sempre de mensagens que combinam três ingredientes: urgência, autoridade ("é do banco", "é da Receita") e um pedido de ação (clique, pague, informe). É a receita do acesso inicial.

## Resumo

- Os atacantes relevantes para um escritório são criminosos (querem dinheiro) e insiders (acesso legítimo usado mal, por má-fé ou descuido).
- Um ataque segue etapas: reconhecimento, acesso inicial, movimento/escalada e objetivo. Cada etapa é uma chance de barrar.
- Casos brasileiros (STJ, Ministério da Saúde, megavazamento, golpes do Pix e do boleto) mostram quebras de disponibilidade, confidencialidade e integridade.
- A Lei 12.737/2012 tipifica a invasão de dispositivo; testar sistemas de terceiros sem autorização é crime.
- Urgência + autoridade + pedido de ação é o padrão de quase todo golpe.
