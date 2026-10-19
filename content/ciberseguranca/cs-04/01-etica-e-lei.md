# Ética e lei

Este módulo olha a segurança pelo ponto de vista de quem ataca, e por isso começa pela pergunta que vem antes de qualquer técnica: **o que é permitido?** Nesta lição você vai entender o que é hacking ético, por que autorização por escrito e escopo separam profissão de crime, o que dizem a Lei 12.737/2012, o Marco Civil e a LGPD, como funciona o bug bounty e como é a carreira ofensiva. Ao final, saberá avaliar se uma atividade é legal antes de executá-la, e exigir isso de quem contratar.

## A mesma habilidade, outra intenção

O **hacker ético** (ou pentester) usa o mesmo conhecimento que um criminoso, com três diferenças que mudam tudo: tem **autorização** do dono do sistema, trabalha dentro de um **escopo** definido e tem o **objetivo** de corrigir, não de lucrar com o dano. A analogia é a do chaveiro: abrir a porta de quem perdeu a chave é serviço; abrir a do vizinho é crime. A habilidade é idêntica; a lei olha para o consentimento.

Esse consentimento precisa ser **por escrito**, **anterior** e **específico**. Um "pode testar aí" dito no corredor não protege ninguém; um contrato com escopo, prazo, janelas de horário e contatos de emergência protege o cliente e o profissional.

## Escopo: o que está dentro e o que está fora

O escopo lista o que pode ser testado: quais domínios, sistemas e contas de teste. O que não está listado está **fora**, mesmo que pertença ao mesmo cliente. Dois cuidados típicos:

- **Terceiros:** um site hospedado num provedor compartilhado não autoriza testar o provedor; serviços de nuvem têm políticas próprias para testes de seus clientes.
- **Pessoas:** simulações de phishing ou ligações só entram se o contrato disser, com regras sobre quem pode ser alvo.

Quem sai do escopo, mesmo "para ajudar", perde a cobertura da autorização e responde como invasor.

## A lei brasileira

| Norma | O que importa aqui |
|---|---|
| **Lei 12.737/2012** (conhecida como "Lei Carolina Dieckmann") | Criou o **art. 154-A do Código Penal**: invadir dispositivo informático de uso alheio, conectado ou não à rede, com o fim de obter, adulterar ou destruir dados sem autorização do usuário, ou instalar vulnerabilidades para obter vantagem ilícita |
| **Lei 14.155/2021** | Endureceu o 154-A (reclusão de 1 a 4 anos e multa; de 2 a 5 anos se a invasão obtém comunicações privadas, segredos comerciais ou informações sigilosas; aumento de pena se há prejuízo econômico) e criou a **fraude eletrônica** (art. 171, § 2º-A): golpes em que a vítima é induzida a fornecer informações por redes sociais, telefone ou e-mail fraudulento, com pena de 4 a 8 anos |
| **Marco Civil da Internet** (Lei 12.965/2014) | Princípios do uso da internet, guarda dos registros de conexão e de acesso (os logs do módulo 2) e responsabilidade dos provedores |
| **LGPD** (Lei 13.709/2018) | Tratamento de dados pessoais, dever de adotar medidas de segurança e de comunicar incidentes à ANPD e aos titulares; um teste que toca dados pessoais precisa de base legal e contrato |

Repare no verbo do 154-A: **invadir**. O elemento central é a ausência de autorização do usuário do dispositivo. Com autorização (expressa ou tácita) não há crime; sem ela, e com a finalidade de obter, alterar ou destruir dados, há crime mesmo que nada tenha sido efetivamente copiado ou apagado.

> **Atenção:** "era só para testar", "não causei dano" e "a falha era óbvia" não são defesas. O crime se configura pela invasão sem autorização com o fim de obter, alterar ou destruir dados, ainda que nada tenha sido levado; prejuízo e dados sigilosos apenas agravam a pena.

## O que é crime e o que não é

| Atividade | Situação |
|---|---|
| Testar o próprio sistema ou uma máquina virtual de laboratório que você montou | Legal |
| Resolver desafios no TryHackMe, HackTheBox ou numa instalação local do DVWA | Legal: ambientes criados para isso |
| Pentest com contrato e escopo assinados pelo dono do sistema | Legal |
| Reportar uma falha dentro de um programa de bug bounty, seguindo as regras | Legal |
| Procurar falhas num site alheio "só para ver", sem autorização | Pode configurar o art. 154-A |
| Entrar na conta de outra pessoa com uma senha que você descobriu | Crime (154-A e, havendo proveito, 171) |
| Testar o sistema de um cliente do escritório sem ele saber | Crime; o contrato contábil não autoriza |
| Divulgar uma falha publicamente sem dar prazo ao responsável | Não é crime em si, mas é antiético e pode gerar responsabilidade civil |

Regra prática: **se não é seu e não há autorização escrita, não teste.**

## Divulgação responsável e bug bounty

Quem encontra uma falha por acaso (um portal que expõe dados, por exemplo) deve praticar a **divulgação responsável**: avisar o responsável de forma privada, dar prazo razoável para correção (90 dias é a prática comum) e só então falar publicamente, se for o caso. Não se acessa mais do que o mínimo necessário para demonstrar o problema, e nunca se baixa uma base "como prova".

**Bug bounty** é o programa em que a empresa **autoriza previamente** pesquisadores a testar os sistemas listados e paga por falha reportada, conforme a severidade. Plataformas como **HackerOne** e **Bugcrowd** (internacionais) e **BugHunt** (brasileira) intermediam. As regras do programa funcionam como a autorização; sair delas elimina a proteção.

## Carreira ofensiva

A área inclui o **pentester** (testa sistemas por contrato), o **red team** (simula um adversário real por semanas), o **pesquisador de vulnerabilidades** e o **caçador de bug bounty**. Certificações reconhecidas: **OSCP** (prática e respeitada), **eJPT** (iniciante) e **CEH** (teórica, comum em editais). Nenhuma substitui laboratório; a lição 9 mostra como praticar legalmente. Para quem vem da contabilidade há um nicho valioso: avaliar a segurança de ERPs, sistemas fiscais e processos de pagamento, onde entender o negócio vale tanto quanto a técnica.

## Erros comuns

- **Autorização verbal.** Sem papel, sem proteção.
- **Confundir "posso acessar" com "posso testar".** Ter login no sistema do cliente não autoriza procurar falhas nele.
- **Sair do escopo por curiosidade.** Cada sistema a mais é um risco jurídico.
- **Achar que as ferramentas são o problema.** Elas são legais; o uso sem autorização é que não é.

## Na prática

- Antes de qualquer teste, mesmo no site do próprio escritório, registre por escrito quem autorizou, o quê e quando.
- Se alguém propuser "testar o sistema do concorrente" ou "ver se entra na conta de fulano", recuse: é crime, mesmo a pedido.
- Se descobrir uma falha por acaso, documente o mínimo, pare e comunique o responsável de forma privada.
- Ao contratar um pentest, exija contrato com escopo, acordo de confidencialidade e prazo de descarte dos dados coletados.

## Resumo

- Hacking ético é a mesma habilidade com autorização escrita, escopo definido e objetivo de correção.
- O art. 154-A do Código Penal (Lei 12.737/2012, agravado pela Lei 14.155/2021) pune a invasão sem autorização; "só testar" não é defesa.
- O Marco Civil regula logs e provedores; a LGPD regula dados pessoais e exige comunicação de incidentes.
- Laboratórios próprios, plataformas de treino e bug bounty são os caminhos legais para praticar.
- Fora do escopo ou sem contrato, não teste.
