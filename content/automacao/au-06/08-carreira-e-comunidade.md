# Carreira e comunidade

Nesta lição você vai mapear o que fazer com o que aprendeu: os **papéis** que o mercado contrata em automação e IA, uma **trilha de estudo** realista, **certificações** que valem o esforço, um **portfólio** com casos reais sem expor dados de clientes, as **comunidades** brasileiras e as **tendências** que merecem atenção, sem futurologia. Ao final, você terá um plano de seis meses.

## Os papéis

| Papel | O que faz | Habilidades centrais |
|---|---|---|
| **Analista de automação** | Mapeia processos, monta fluxos em Make/n8n/Power Automate, mede resultados | Pensamento de processo, low-code, métricas, comunicação |
| **Desenvolvedor RPA** | Constrói e mantém robôs (UiPath, Power Automate Desktop, Python) | Lógica, seletores e esperas, tratamento de erro, operação |
| **Engenheiro de IA** | Integra modelos em produtos: prompts, RAG, agentes, avaliação, custo | Python, APIs de LLM, embeddings, testes de cenário, segurança |
| **AI ops** | Opera esteiras e agentes em produção: filas, observabilidade, incidentes, governança | Infraestrutura básica, logs e métricas, Git, LGPD, runbooks |
| **Contador que automatiza** | Aplica tudo isso ao escritório e aos clientes; vende e lidera projetos | Domínio do processo contábil + qualquer combinação acima |

A última linha é a sua vantagem: quem entende o processo fiscal **e** consegue automatizá-lo é raro. A pessoa certa para liderar automação num escritório costuma ser um contador com este curso, não um desenvolvedor de fora.

## Trilha de seis meses

Você já tem a base do curso inteiro; o que consolida é **prática com volume real**:

1. **Meses 1 e 2: um processo de ponta a ponta.** Escolha um processo do escritório (conciliação, triagem de documentos) e automatize com esteira, logs e painel, medindo com baseline. É o seu primeiro caso.
2. **Mês 3: aprofundar uma ferramenta.** Se o escritório vive no n8n, estude a fundo (expressões, sub-workflows, modo queue, nós de IA); se é Python, pratique `pytest` e SQL.
3. **Mês 4: operação.** Deixe a automação rodar sem você: alertas, runbooks, outra pessoa treinada. Trate um incidente de verdade e escreva a análise.
4. **Mês 5: IA com avaliação.** Monte 30 a 50 casos de teste para a parte de IA e meça acerto por versão; é o que separa quem "usa IA" de quem entrega IA confiável.
5. **Mês 6: contar a história.** Escreva o caso com números (lição 7), apresente aos sócios ou a um cliente, publique uma versão anonimizada.

Reforce pelo caminho **SQL**, **Git**, noções de nuvem e redes e **inglês técnico**.

## Certificações

Certificação não substitui portfólio, mas abre portas em seleções e propostas para clientes maiores. As que fazem sentido em 2026:

- **UiPath Certified Professional** (Automation Developer Associate e, depois, Professional): a referência em RPA corporativo; academia gratuita, exame pago.
- **Microsoft PL-500 (Power Automate RPA Developer)**: para quem está no Microsoft 365.
- **Make Academy** e **cursos oficiais do n8n**: gratuitos, com certificado de conclusão; sinal de domínio, não credencial de mercado.
- **Nuvem, fundamentos**: AWS Cloud Practitioner, Microsoft AZ-900 ou AI-900, Google Cloud Digital Leader.

Confira a página oficial: nomes e preços mudam. Priorize a ferramenta que você usa; certificados sem casos entregues não convencem.

## Portfólio com casos reais

O portfólio de quem automatiza é feito de **casos**. Cada caso, em uma página: contexto (sem nomear o cliente), problema com baseline, solução (diagrama simples, ferramentas, onde há revisão humana), resultados com números, o que deu errado. Três a cinco casos bastam.

Cuidados: **anonimize** (nenhum CNPJ, nome ou valor identificável; dados inventados nas capturas); **peça autorização** por escrito quando o caso for reconhecível; publique código só do que é genérico (um leitor de OFX, um validador de XML), nunca fluxos com credenciais ou regras internas. Dois ou três utilitários documentados e testados valem mais que dez scripts soltos.

## Comunidades brasileiras

Automação se aprende em comunidade: a resposta para "o portal X mudou de novo" aparece lá primeiro.

- **Das ferramentas**: fórum oficial do n8n e grupos brasileiros de n8n e Make (Telegram, WhatsApp, Discord); fórum da UiPath e grupos de RPA.
- **Python**: a comunidade Python Brasil (lista, Telegram, eventos regionais e conferência anual).
- **Contabilidade e tecnologia**: grupos de contadores que automatizam; eventos de sindicatos, conselhos e fornecedores; comunidades de SPED, eSocial e reforma tributária, onde as mudanças de layout aparecem primeiro.
- **IA aplicada**: comunidades de engenharia de IA em português.

Participe sendo útil: responda o que sabe, compartilhe um caso, pergunte com contexto. Em um ano, a rede vale mais que qualquer anúncio de vaga.

## Tendências, sem futurologia

O que já está em curso:

- **Agentes** viram componente de esteira, com aprovação humana e observabilidade; o diferencial será operar bem, não "ter agente".
- **IA local**: modelos abertos no servidor do escritório ou em nuvem privada, para dados que não podem sair; fica mais barato a cada ano.
- **Protocolos abertos** (MCP e similares) reduzem o custo de ligar sistemas a assistentes.
- **Padronização fiscal**: NFS-e nacional, campos de IBS/CBS na NF-e e a transição da reforma tributária; cada mudança é trabalho de adaptação.
- **Mais responsabilidade**: regulação de IA em discussão e fiscalização da LGPD mais ativa; governança vira requisito.

O que não dá para prever: qual framework vai dominar, quais modelos existirão, o preço dos tokens. Por isso o curso insistiu em princípios (idempotência, estados, logs, menor privilégio, revisão humana), que sobrevivem às ferramentas.

## Armadilhas

- **Colecionar cursos sem entregar um processo completo.**
- **Portfólio com dados reais de cliente.**
- **Apostar tudo em uma ferramenta**: os princípios transferem; a ferramenta muda.
- **Esperar "a tecnologia estabilizar"**: ela não vai; aprenda a mudar junto.

## Na prática

Uma contadora de um escritório de médio porte fez a trilha de seis meses: automatizou a triagem de documentos com esteira e IA, operou com alertas e runbook, montou 40 casos de teste, escreveu o caso com números e apresentou em um evento regional. Seis meses depois, liderava a área de automação do escritório, com dois analistas, e atendia três clientes com automação como serviço. A certificação UiPath veio depois, quando um cliente grande pediu.

## Resumo

- Papéis: analista de automação, desenvolvedor RPA, engenheiro de IA, AI ops; o contador que automatiza combina processo e técnica, e isso é raro.
- Trilha de seis meses: um processo completo, aprofundar uma ferramenta, operar, avaliar a IA, contar a história com números.
- Certificações alinhadas à ferramenta que você usa; portfólio de casos anonimizados com números.
- Comunidades das ferramentas, Python Brasil, contabilidade e tecnologia, IA aplicada.
- Tendências: agentes operados, IA local, protocolos abertos, padronização fiscal, mais governança; os princípios sobrevivem às ferramentas.
