Nesta lição você vai aprender como se constrói **software seguro**, mesmo sem programar profissionalmente: o ciclo de desenvolvimento seguro (SDLC), a revisão de código, as três famílias de testes automatizados (SAST, DAST e SCA), o problema dos **segredos em repositórios**, a segurança do pipeline e a **modelagem de ameaças com STRIDE**, aplicada a um sistema de honorários. Isso importa porque o escritório usa, contrata ou até cria sistemas que tratam dados de clientes, e as perguntas certas evitam contratar ou construir um problema.

## SDLC seguro: segurança desde o rascunho

O **SDLC (Software Development Life Cycle)** é o ciclo de vida do software: requisitos, projeto, implementação, testes, implantação, manutenção. O SDLC **seguro** acrescenta uma atividade de segurança em cada etapa, em vez de deixar tudo para o final:

| Etapa | Atividade de segurança |
|---|---|
| Requisitos | requisitos de segurança e privacidade (LGPD: minimização, retenção) |
| Projeto | modelagem de ameaças (STRIDE) |
| Implementação | padrões de código seguro, revisão, SAST, sem segredos no código |
| Testes | DAST, SCA, testes de segurança automatizados |
| Implantação | pipeline protegido, configuração segura, segredos em cofre |
| Manutenção | atualização de dependências, resposta a vulnerabilidades |

**DevSecOps** é o nome dessa integração quando o desenvolvimento usa automação contínua (DevOps): segurança automatizada dentro do mesmo fluxo.

## Revisão de código

Toda alteração passa pelos olhos de outra pessoa antes de entrar. Além de "funciona?", pergunta-se: a entrada do usuário é validada? Há consulta SQL montada com texto colado (injeção)? A permissão é verificada no servidor, não só na tela? Há senha ou chave no código? Uma lista de verificação curta, usada sempre, pega a maior parte do OWASP Top 10 antes de qualquer ferramenta.

## SAST, DAST e SCA

Três testes automatizados, três ângulos diferentes:

- **SAST (Static Application Security Testing):** analisa o **código-fonte** sem executar, procurando padrões perigosos (SQL montado com concatenação, uso de funções inseguras, segredos). Ferramentas: Semgrep, SonarQube, Bandit (Python), CodeQL (GitHub). Roda a cada *commit* (cada envio de alteração ao repositório de código).
- **DAST (Dynamic Application Security Testing):** ataca a aplicação **em execução**, como um pentest automatizado: injeta payloads em formulários, testa cabeçalhos, autenticação. Ferramentas: OWASP ZAP (gratuito), Burp Suite. Roda em ambiente de teste.
- **SCA (Software Composition Analysis):** verifica as **dependências** (bibliotecas de terceiros) contra bases de vulnerabilidades conhecidas (CVE). Uma biblioteca vulnerável (caso Log4Shell, 2021) derruba tudo. Ferramentas: Dependabot (GitHub), OWASP Dependency-Check, `pip-audit`, `npm audit`.

Nenhum substitui os outros: SAST não vê configuração de servidor, DAST não vê código morto, SCA não vê o seu código.

## Segredos em repositórios

Um **segredo** é qualquer credencial: senha de banco, chave de API, token, certificado. O erro mais grave: escrever o segredo no código (`senha = "Contabil@2026"`) e enviar ao Git (o sistema de controle de versão que guarda todo o histórico do código). Mesmo apagado depois, **fica no histórico**; em repositório público, robôs encontram em minutos.

Como fazer certo:
1. Segredos em **variáveis de ambiente** ou em um **cofre** (AWS Secrets Manager, Azure Key Vault, HashiCorp Vault, *Secrets* do GitHub Actions).
2. Arquivo `.env` **fora** do repositório (`.gitignore`), com um `.env.example` sem valores.
3. Varredura automática no pipeline: **gitleaks**, **trufflehog**, *secret scanning* do GitHub.
4. Se vazou: **rotacionar imediatamente** (nova credencial, revogar a antiga). Apagar do histórico é secundário; o segredo já foi copiado.

## Pipelines e testes automatizados

O **pipeline** (GitHub Actions, GitLab CI, Azure DevOps) é a esteira que compila, testa e publica. Ele mesmo é um alvo: quem controla o pipeline publica o que quiser. Proteções: segredos com escopo mínimo, aprovação obrigatória para publicar em produção, ações de terceiros fixadas em versão, e etapas de segurança **bloqueantes**: se o SAST acha uma injeção grave, a publicação falha. Testes automatizados simples ajudam: tentar acessar `/relatorios/cliente/42` logado como outro cliente e esperar `403`.

## Threat modeling com STRIDE

**Modelagem de ameaças** é olhar o desenho do sistema e perguntar, componente por componente, "o que pode dar errado?". **STRIDE** é o mnemônico da Microsoft para seis categorias:

| Letra | Ameaça | Pergunta | Propriedade violada |
|---|---|---|---|
| **S** | Spoofing (falsificação de identidade) | alguém pode fingir ser outro usuário? | autenticação |
| **T** | Tampering (adulteração) | alguém pode alterar dados em trânsito ou armazenados? | integridade |
| **R** | Repudiation (repúdio) | alguém pode negar que fez algo? | não repúdio |
| **I** | Information disclosure (vazamento) | dados podem vazar para quem não deve? | confidencialidade |
| **D** | Denial of service (negação de serviço) | o sistema pode ser derrubado? | disponibilidade |
| **E** | Elevation of privilege (elevação de privilégio) | um usuário comum pode virar administrador? | autorização |

### Exemplo: sistema de honorários

Um sistema web onde o escritório cadastra clientes, gera boletos de honorários e os clientes consultam faturas. Componentes: navegador do cliente, API, banco de dados, integração com o banco emissor, e-mail de cobrança.

- **S:** cliente rouba a senha de outro e vê faturas alheias. **Controle:** MFA, bloqueio por tentativas.
- **T:** alguém altera o valor ou o código de barras do boleto no e-mail ou no banco de dados. **Controle:** boleto gerado pelo banco, HTTPS, auditoria de alterações.
- **R:** o cliente diz que nunca recebeu a cobrança; um funcionário nega ter alterado um honorário. **Controle:** log de envio e de alterações com usuário, data e valor anterior.
- **I:** a API devolve dados de outro cliente se o ID na URL for trocado (IDOR, *Insecure Direct Object Reference*). **Controle:** autorização no servidor em cada requisição; testes automatizados de acesso.
- **D:** requisições em massa derrubam a consulta de faturas no dia do vencimento. **Controle:** limite de requisições por cliente e CDN (rede de distribuição de conteúdo, que absorve picos de tráfego).
- **E:** um parâmetro `perfil=admin` no formulário muda o papel do usuário. **Controle:** papel definido no servidor, nunca vindo do cliente.

Cada linha vira um requisito, um teste ou um controle documentado.

## Erros comuns

- Testar segurança só no fim, quando mudar o projeto é caro.
- Confiar na validação feita no navegador; o atacante não usa o seu navegador.
- Rodar o SCA uma vez e nunca mais; dependências envelhecem toda semana.
- Apagar o segredo do código sem rotacionar.

## Na prática

Ao contratar um sistema (ERP, folha, emissor de notas), pergunte ao fornecedor: fazem SAST/SCA? Têm pentest periódico? Como reportar uma vulnerabilidade e em quanto tempo corrigem? Ao construir uma automação própria, aplique o STRIDE numa folha de papel antes da primeira linha.

## Resumo

- SDLC seguro coloca uma atividade de segurança em cada etapa; DevSecOps a automatiza no pipeline.
- SAST analisa código, DAST ataca a aplicação rodando, SCA verifica dependências; use os três.
- Segredos nunca no código: variáveis de ambiente ou cofre, varredura automática, rotação imediata se vazar.
- Pipeline protegido: segredos mínimos, aprovação para produção, etapas de segurança bloqueantes.
- STRIDE (Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege) transforma um desenho em lista de controles.
