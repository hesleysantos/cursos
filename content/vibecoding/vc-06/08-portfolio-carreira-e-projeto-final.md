Nesta última lição você vai organizar o que aprendeu em um **portfólio** que mostra o que você sabe fazer, conhecer os **caminhos de carreira** que se abrem para quem domina IA, no-code e vibe coding, saber onde encontrar **comunidades** e executar o **projeto final** do curso: um assistente e um app publicados, avaliados por uma rubrica. Isso importa porque conhecimento sem evidência não muda carreira; um link funcionando vale mais do que um certificado.

## Três caminhos de carreira

Ninguém precisa deixar de ser contador para seguir um deles; os três se combinam com a profissão e, muitas vezes, a potencializam.

**No-code builder / automação.** Constrói sistemas internos, portais, automações entre ferramentas, sem (ou com pouco) código. Mercado: escritórios, pequenas e médias empresas, agências. O diferencial do contador é conhecer o processo que automatiza — a maior parte dos builders sabe a ferramenta e não sabe o negócio.

**AI engineer júnior / desenvolvedor assistido por IA.** Constrói aplicações que usam modelos de linguagem: classificadores, assistentes com RAG, agentes com ferramentas. Exige o que você viu neste módulo (API, saídas estruturadas, avaliação, guardrails) e vontade de aprofundar programação. Mercado: empresas de software, equipes de dados, consultorias. É o caminho com maior curva e maior salto.

**Consultor de automação / IA para escritórios.** Diagnostica processos, escolhe ferramentas, implanta e treina a equipe. Combina a visão de negócio da lição anterior com a capacidade de prototipar rápido. Mercado: outros escritórios contábeis, que confiam em quem fala a língua deles.

Em qualquer um, o que o mercado compra é **evidência de entrega**: coisas publicadas, funcionando, com resultado medido.

## Montando o portfólio

Um portfólio de quem faz vibe coding tem três camadas:

1. **GitHub**: os repositórios dos seus projetos, cada um com README que diz o problema, a solução, a stack, como rodar e o que você aprendeu. Commits com mensagens claras mostram o processo. Projetos com testes mostram rigor.
2. **Demos públicas**: a landing page e a calculadora do módulo 4, o Gestão de Honorários do módulo 5, o assistente e o app deste módulo — cada um com um link que abre e funciona. Use dados fictícios; nunca dados de clientes reais.
3. **Uma página de apresentação**: a landing page do portfólio (você sabe gerar), com foto, duas frases sobre quem você é, três a cinco projetos com imagem, link e uma linha de resultado ("reduziu em 2 horas semanais a cobrança de honorários"), e contato.

O que torna um portfólio convincente não é a quantidade: são **resultados medidos** e **decisões explicadas**. "Classificador de documentos com 92% de acurácia em 60 casos de teste; guias vão para revisão humana" diz mais do que dez projetos sem número.

## Comunidades

Aprender sozinho é lento; aprender em comunidade acelera e abre portas. Onde procurar:

- **Comunidades das ferramentas** que você usa (fóruns, Discord, grupos oficiais de Supabase, Vercel, das ferramentas no-code e dos provedores de IA). Perguntas respondidas e bugs reportados são contribuições visíveis.
- **Grupos de contadores e tecnologia**: há comunidades de profissionais contábeis discutindo automação; o seu diferencial é raro ali.
- **Eventos e meetups** de tecnologia na sua cidade ou on-line; apresentar um projeto de 10 minutos é a forma mais rápida de ser conhecido.
- **Código aberto**: corrigir um erro de documentação em uma biblioteca que você usa já é uma contribuição.

Regra: participe para ajudar, não para se promover. A reputação vem como consequência.

## Projeto final

Dois entregáveis publicados, ligados ao seu trabalho:

**A. Um assistente** (sem código ou com API), que resolva uma tarefa real do escritório: normas internas, triagem de documentos, perguntas frequentes de clientes. Entregue: instruções, base de conhecimento (sem dados pessoais), conjunto de teste com pelo menos 20 casos e métricas.

**B. Um app** publicado, com banco, autenticação e pelo menos uma integração (API externa ou chamada a um LLM pelo backend). Pode ser a evolução do Gestão de Honorários (portal do cliente, lembretes, resumo de contratos) ou um projeto novo validado com usuários. Entregue: repositório com README, PRD, testes, checklist de segurança e link funcionando.

Prazo sugerido: quatro semanas, em sessões de 30 minutos por dia, seguindo o ciclo que você já domina: PRD → entregas pequenas → testes → commit → deploy.

## Rubrica final

Cada item vale de 0 a 2. Meta: 24 de 30.

```text
ASSISTENTE
1. Instruções com papel, fontes, formato, limites e exemplo          __/2
2. Base de conhecimento limpa, datada, sem dados pessoais            __/2
3. Conjunto de teste (20+ casos) e métricas calculadas               __/2
4. Admite quando não sabe; cita a fonte                              __/2
5. Decisão documentada sobre ações/conectores e supervisão           __/2

APP
6. PRD completo (dados, fluxos, bordas, aceite)                      __/2
7. Banco com RLS e teste com dois usuários                           __/2
8. Integração externa ou LLM pelo backend, com chave em ambiente     __/2
9. Testes automatizados verdes; validação no servidor                __/2
10. Checklist de segurança e LGPD aplicado                            __/2
11. Publicado com domínio, README e guia do usuário                   __/2

PORTFÓLIO E NEGÓCIO
12. Página de portfólio com projetos, links e resultados medidos      __/2
13. Validação com usuários registrada (conversas, piloto)             __/2
14. Proposta de uma página ou modelo de precificação                  __/2
15. Transparência: uso de IA rotulado nas entregas                    __/2
```

## Próximos passos depois do curso

- **Aprofundar programação**: o curso de Python deste site é o complemento natural para quem quer o caminho de AI engineer.
- **Automação**: o curso de automação aprofunda os workflows entre sistemas.
- **Segurança**: o curso de cibersegurança cobre o que este módulo só tocou.
- **Repetir o ciclo**: um projeto novo a cada dois meses, sempre publicado e medido.

## Erros comuns

- Portfólio com projetos "quase prontos" que não abrem.
- Dados reais de clientes em demos públicas.
- Descrever ferramentas em vez de resultados ("usei Supabase" vs. "eliminou a planilha de cobrança").
- Entrar em comunidade só para divulgar.
- Esperar estar "pronto" para publicar: publique o MVP e melhore em público.

## Na prática

Ao final das quatro semanas, o contador tem no ar: o assistente de normas com 25 casos de teste e 92% de acurácia; o portal do cliente com magic link, faturas e calendário de obrigações; um portfólio com cinco projetos e números. Quando um escritório parceiro pergunta "quem fez isso?", a resposta é um link — e uma proposta de uma página já pronta.

## Resumo

- Três caminhos: no-code builder, AI engineer júnior, consultor de automação; todos se combinam com a contabilidade e valorizam quem conhece o processo.
- Portfólio = GitHub com README e testes + demos que abrem + página com resultados medidos.
- Comunidades: das ferramentas, de contadores em tecnologia, eventos, código aberto; participe para ajudar.
- Projeto final: um assistente (instruções, base, testes, métricas) e um app (RLS, integração, testes, segurança, publicado), avaliados pela rubrica de 15 itens.
- Depois: Python, automação, cibersegurança, e um projeto novo publicado a cada dois meses.
