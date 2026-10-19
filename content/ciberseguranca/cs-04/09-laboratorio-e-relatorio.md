# Laboratório e relatório

Esta última lição do módulo fecha o ciclo com as duas pontas práticas da segurança ofensiva ética: **onde praticar sem cometer crime** e **como se comunica o resultado de um teste**. Você vai aprender a montar um laboratório seguro, conhecer as plataformas legais de treino e entender a estrutura de um **relatório de pentest** — tanto para escrevê-lo, se seguir a carreira, quanto para lê-lo criticamente sendo o cliente que contratou o teste.

## Por que um laboratório próprio

Depois da lição 1, a regra já está clara: só se pratica em sistemas próprios ou autorizados. O laboratório é o ambiente onde você tem **autorização total porque o dono é você**. Ali pode errar, derrubar serviços, explorar falhas à vontade, sem risco jurídico e sem afetar ninguém. É a quadra de treino antes do jogo.

## Montando um lab seguro

A base é a **virtualização**: programas como VirtualBox (gratuito) ou VMware criam computadores virtuais (VMs) dentro do seu, isolados do sistema real. O cuidado central é o **isolamento de rede**: as VMs de treino devem ficar numa rede interna fechada (modo "host-only" ou rede interna), sem acesso à internet nem à rede do escritório. Assim, mesmo que uma VM propositalmente vulnerável seja comprometida, o problema não escapa dali.

Um lab típico tem duas peças:

- **Máquina de ataque:** uma distribuição com ferramentas de segurança já instaladas, como **Kali Linux** ou **Parrot OS**.
- **Máquina-alvo:** um sistema **propositalmente vulnerável**, feito para treino. Os mais usados:

| Alvo de treino | O que é |
|---|---|
| **DVWA** (Damn Vulnerable Web Application) | Aplicação web cheia de falhas clássicas, com níveis de dificuldade; roda numa VM local |
| **OWASP Juice Shop** | Aplicação web moderna e vulnerável, cobre o OWASP Top 10 de forma didática |
| **Metasploitable** | Servidor Linux repleto de serviços vulneráveis para treinar varredura e exploração |

Esses alvos existem **para serem atacados**; usá-los no seu lab isolado é totalmente legal.

## Plataformas legais de treino

Se você não quer montar tudo, plataformas na nuvem já entregam o ambiente pronto e autorizado:

- **TryHackMe:** trilhas guiadas, ótimo para começar; salas que ensinam passo a passo.
- **Hack The Box:** máquinas e desafios mais livres, do iniciante ao avançado; tem a seção "Academy" didática.
- **PortSwigger Web Security Academy:** gratuita, focada em web, feita pelos criadores do Burp Suite.
- **CTFs** (Capture The Flag): competições em que se resolvem desafios de segurança por pontos, sempre em ambiente autorizado.

Todas compartilham o mesmo princípio: o alvo é fornecido e a autorização está embutida. Praticar nelas é o oposto de testar um sistema alheio.

> **Dica:** registre o que aprende. Um caderno de laboratório com o que você testou, como e o que descobriu vira portfólio e acelera o aprendizado. É também o embrião do relatório.

## O relatório de pentest

O teste só gera valor quando vira um documento que permite **corrigir**. O relatório é o produto final e tem uma estrutura consagrada:

| Seção | Conteúdo | Para quem |
|---|---|---|
| **Sumário executivo** | Visão geral em linguagem de negócio: postura de segurança, principais riscos, recomendações estratégicas, sem jargão | Direção, sócios |
| **Escopo e metodologia** | O que foi testado, quando, com que abordagem (lição 2), o que ficou de fora | Gestão e técnicos |
| **Achados** | Cada falha: descrição, **severidade** (CVSS, lição 5), evidência, impacto no negócio e recomendação de correção | Equipe técnica |
| **Recomendações** | Priorização do que corrigir primeiro, com prazos sugeridos | Gestão e técnicos |
| **Conclusão e reteste** | Avaliação geral e plano de verificação após as correções | Todos |

O coração é a seção de **achados**. Um achado bem escrito responde: qual é a falha, onde está, qual a gravidade, **o que um atacante conseguiria** (o impacto no negócio, não só o detalhe técnico) e como corrigir. A evidência — uma captura de tela, um trecho de requisição — prova que a falha é real, mas descreve o problema sem servir de manual de ataque.

## Lendo um relatório como cliente

Sendo o escritório quem contratou, você não precisa entender cada detalhe técnico, mas precisa saber **avaliar o relatório**:

1. **Comece pelo sumário executivo.** Ele deveria ser legível por um sócio. Se for incompreensível, o fornecedor falhou em comunicar.
2. **Olhe a severidade e a priorização.** Existe uma ordem clara do que corrigir primeiro? Cem achados sem prioridade não ajudam.
3. **Cada achado tem recomendação acionável?** "Corrija a vulnerabilidade" não é recomendação; "adote consulta parametrizada no campo X" é.
4. **Houve confirmação, não só scan?** Achados com evidência de exploração valem mais que uma lista de ferramenta (lição 2).
5. **Há plano de reteste?** Correção sem verificação é promessa.
6. **Como os dados do teste serão descartados?** Evidências contêm informação sensível e precisam de prazo de destruição.

Depois de receber o relatório, o trabalho começa: priorizar, corrigir, retestar e **guardar o documento** como prova de diligência diante de um incidente ou da ANPD.

## Erros comuns

- **Praticar fora do lab.** Nenhum aprendizado justifica testar sistema alheio; o lab e as plataformas existem para isso.
- **Lab conectado à rede do escritório.** A máquina-alvo vulnerável precisa ficar isolada.
- **Relatório só técnico.** Sem sumário executivo, a direção não decide.
- **Achado sem impacto de negócio.** "Porta aberta" não diz nada; "um cliente veria os dados de outro" diz tudo.
- **Engavetar o relatório.** O valor está em corrigir e retestar, não em arquivar.

## Na prática

- Monte um lab isolado com VirtualBox e o Juice Shop ou o DVWA; comece pelo TryHackMe para ter trilha guiada.
- Se contratar um pentest para o portal do escritório, use o checklist da lição 7 e, ao receber o relatório, avalie-o pelos seis pontos acima.
- Transforme os achados num plano com responsável e prazo; agende o reteste.
- Arquive relatório e evidências de correção; eles documentam a diligência do escritório.

## Resumo

- Pratique sempre em laboratório próprio e isolado ou em plataformas autorizadas (TryHackMe, Hack The Box, PortSwigger); nunca em sistemas alheios.
- Um lab seguro usa VMs isoladas da rede, com uma máquina de ataque e alvos vulneráveis como DVWA, Juice Shop ou Metasploitable.
- O relatório de pentest tem sumário executivo, escopo, achados com severidade e evidência, recomendações e reteste.
- O achado útil descreve o impacto no negócio e traz correção acionável, não apenas o detalhe técnico.
- Como cliente, avalie o relatório pela clareza executiva, priorização, confirmação dos achados e plano de reteste, e guarde-o como prova de diligência.
