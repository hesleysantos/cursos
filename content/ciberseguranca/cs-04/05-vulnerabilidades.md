# Vulnerabilidades: CVE, CVSS e o ciclo de vida

Nesta lição você vai aprender a "linguagem" com que o mundo da segurança fala de falhas: o que é uma **CVE**, como a nota **CVSS** mede a gravidade, o que o **CWE** classifica, como uma vulnerabilidade nasce e morre, o que é um **zero-day** e por que **atualizar é a defesa número um**. No fim, você saberá ler um boletim de segurança e decidir o que é urgente, uma habilidade que serve ao escritório inteiro, não só a quem faz pentest.

## O que é uma vulnerabilidade

Uma **vulnerabilidade** é uma fraqueza num sistema que pode ser aproveitada para violar sua segurança: um erro de programação, uma configuração frouxa, uma senha padrão esquecida. Nem toda vulnerabilidade é usada, mas toda vulnerabilidade é uma dívida de risco em aberto. Um **exploit** é o código ou a técnica que aproveita uma vulnerabilidade específica. A distinção importa: a vulnerabilidade é a porta destrancada; o exploit é o gesto de girar a maçaneta.

## CVE: o nome único de cada falha

**CVE** (Common Vulnerabilities and Exposures) é o sistema que dá um **identificador único** a cada vulnerabilidade pública, no formato `CVE-ano-número`, por exemplo `CVE-2021-44228` (a falha Log4Shell, que abalou a internet em 2021). Mantido pela MITRE com apoio do governo americano, o CVE é o que permite que fornecedor, pesquisador, scanner e administrador falem da mesma falha sem ambiguidade. Quando a Microsoft, a Oracle ou o fornecedor do seu sistema contábil publicam correções, cada uma vem amarrada a uma ou mais CVEs.

## CVSS: medindo a gravidade de 0 a 10

**CVSS** (Common Vulnerability Scoring System) é a nota de gravidade, de 0,0 a 10,0, calculada a partir de características da falha (se é explorável pela rede, se exige privilégios, se depende de interação do usuário, qual o impacto sobre confidencialidade, integridade e disponibilidade). As faixas:

| Nota CVSS | Severidade |
|---|---|
| 0,1 – 3,9 | Baixa |
| 4,0 – 6,9 | Média |
| 7,0 – 8,9 | Alta |
| 9,0 – 10,0 | Crítica |

A nota ajuda a priorizar, mas não deve ser lida sozinha. Uma falha "crítica" num serviço que você não expõe à internet pode ser menos urgente, na prática, do que uma "alta" no seu portal público. Por isso existe o complemento **EPSS** (probabilidade de a falha ser explorada nos próximos dias) e, nos Estados Unidos, a lista **KEV** (Known Exploited Vulnerabilities) da CISA, que marca o que já está sendo usado em ataques reais. Regra de bolso: **o que é crítico, exposto e já explorado na prática vem primeiro.**

## CWE: a categoria do erro

Enquanto a CVE nomeia uma falha específica num produto, o **CWE** (Common Weakness Enumeration) classifica o **tipo** de erro que a originou: `CWE-89` é injeção de SQL, `CWE-79` é cross-site scripting, `CWE-287` é autenticação inadequada. O CWE é o vocabulário das causas, e é com ele que o OWASP Top 10 (lições 6 e 7) agrupa as falhas mais comuns. Pensar por CWE ajuda a corrigir a raiz: em vez de tapar uma injeção de SQL de cada vez, você elimina a categoria inteira adotando consultas parametrizadas.

## O ciclo de vida de uma vulnerabilidade

```bash
# Linha do tempo típica de uma falha
descoberta  ->  relato ao fornecedor (privado)  ->  correção (patch)
            ->  divulgação pública + CVE         ->  exploits surgem
            ->  aplicação do patch pelos usuários ->  falha "aposentada"
```

O período mais perigoso é a **janela de exposição**: entre a divulgação pública e o momento em que cada empresa aplica a correção. Assim que a CVE sai, scanners e atacantes passam a procurar quem ainda não corrigiu. Foi o que aconteceu com o Log4Shell: em horas havia varreduras em massa atrás de servidores vulneráveis.

Um **zero-day** é a situação oposta e mais temida: uma falha que os atacantes conhecem e exploram **antes** de existir correção (o fornecedor teve "zero dias" para consertar). Contra zero-days não há patch; a defesa é em camadas — menor privilégio, segmentação, monitoramento e backups (módulo 3) —, para que uma porta ainda desconhecida não dê acesso a tudo.

## Por que atualizar é a defesa número 1

A maioria esmagadora dos ataques bem-sucedidos não usa zero-days; usa falhas **antigas e já corrigidas** em sistemas que ninguém atualizou. Aplicar patches fecha a janela de exposição e neutraliza a mercadoria mais barata do atacante. Para o escritório, isso significa: sistema operacional, navegador, leitor de PDF, sistema contábil, roteador e firmware de dispositivos em dia. A atualização automática, quando confiável, é aliada, não incômodo.

## Lendo um boletim de segurança

Quando o fornecedor publica um aviso, procure responder a cinco perguntas:

1. **Qual produto e versão** são afetados? A minha está na lista?
2. **Qual a CVE e a nota CVSS?** É crítica ou alta?
3. **É explorável remotamente e já há exploração ativa** (EPSS alto, consta na KEV)?
4. **O serviço afetado está exposto** no meu ambiente?
5. **Qual a ação:** aplicar patch, mudar uma configuração ou desativar um recurso? Em quanto tempo?

Com essas respostas, você transforma um texto técnico numa decisão: corrigir hoje, nesta semana ou no próximo ciclo.

## Erros comuns

- **Priorizar só pela nota CVSS.** Contexto (exposição e exploração ativa) muda a urgência.
- **Adiar atualizações "para não parar o sistema".** A janela de exposição é exatamente esse adiamento.
- **Esquecer firmware e dispositivos.** Roteadores, câmeras e impressoras também têm CVEs.
- **Confundir vulnerabilidade com exploit.** Ter a falha não é o mesmo que estar sendo atacado, mas é dívida a pagar.
- **Ignorar sistemas sem suporte.** Software fora de suporte não recebe patch; é risco permanente até ser substituído.

## Na prática

- Assine os boletins do fornecedor do sistema contábil e da Microsoft; defina um responsável por lê-los.
- Mantenha um inventário simples (sistemas, versões, se estão expostos) para responder rápido "isso me afeta?".
- Ative atualização automática onde for seguro e crie uma rotina mensal para o resto.
- Trate como prioridade o que for crítico, exposto e com exploração ativa conhecida.

## Resumo

- Vulnerabilidade é a fraqueza; exploit é o que a aproveita.
- CVE dá nome único à falha; CVSS mede a gravidade de 0 a 10; CWE classifica o tipo de erro.
- A nota CVSS prioriza, mas exposição e exploração ativa (EPSS, KEV) definem a urgência real.
- Zero-day é a falha sem correção; a janela de exposição entre divulgação e patch é o período mais perigoso.
- Atualizar é a defesa número um, porque a maioria dos ataques usa falhas antigas já corrigidas.
