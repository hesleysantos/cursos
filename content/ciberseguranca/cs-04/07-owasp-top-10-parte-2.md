# OWASP Top 10 (parte 2)

Esta lição completa o passeio pelas falhas web mais críticas, agora com as categorias que mais aparecem em sistemas de gestão e portais: **controle de acesso quebrado** (incluindo o IDOR), **configuração incorreta**, **componentes vulneráveis**, **SSRF**, **falhas criptográficas** e **registro e monitoramento insuficientes**. No fim, você terá um **checklist** para usar quando contratar ou acompanhar o desenvolvimento de um sistema. O enfoque segue defensivo: reconhecer o problema e saber a defesa.

## Controle de acesso quebrado (e o IDOR)

É a falha número 1 das listas recentes do OWASP. Acontece quando o sistema autentica o usuário (sabe quem ele é), mas não verifica direito **o que ele pode acessar**. O caso mais comum é o **IDOR** (Insecure Direct Object Reference): o identificador de um recurso aparece no endereço ou no formulário, e trocá-lo dá acesso ao recurso de outra pessoa.

Imagine um portal onde, depois de entrar, você vê sua declaração em `.../documento?id=1050`. Se ao mudar para `id=1051` aparecer o documento de outro cliente, o controle de acesso está quebrado: o sistema conferiu que você está logado, mas não que **aquele** documento é seu. Num portal contábil, isso significaria um cliente enxergando os dados fiscais de outro.

A defesa é verificar a **autorização no servidor, a cada requisição**: o documento `id=1051` pertence ao usuário que está pedindo? Nunca se deve confiar no que o navegador envia, nem esconder o problema só tirando o link do menu. É o princípio do menor privilégio (módulo 3) aplicado a cada objeto.

## Configuração incorreta

Software seguro, instalado de forma frouxa, vira software inseguro. Entram aqui: senhas padrão de fábrica nunca trocadas, painéis de administração abertos à internet, mensagens de erro que revelam a estrutura interna, serviços ligados que ninguém usa, permissões amplas demais em nuvem (o famoso "bucket" de armazenamento público). A defesa é o **endurecimento** (hardening): partir de uma configuração mínima, trocar todo padrão, desligar o que não se usa e revisar periodicamente. Guias de referência (CIS Benchmarks) ajudam.

## Componentes vulneráveis

Nenhum sistema é escrito do zero; todos usam bibliotecas de terceiros. Quando uma dessas bibliotecas tem uma CVE (lição 5) e não é atualizada, a aplicação herda a falha, ainda que o código próprio seja impecável. Foi assim no Log4Shell. A defesa é manter um **inventário de dependências** e atualizá-las, de preferência com ferramentas automáticas que avisam quando um componente usado ganha uma CVE conhecida.

## SSRF: fazer o servidor buscar o que não devia

O **SSRF** (Server-Side Request Forgery) ocorre quando a aplicação aceita uma URL do usuário e o **servidor** a acessa em nome dele. Se não houver controle, o usuário pode apontar essa URL para a rede interna da empresa ou para serviços que só o servidor alcança, usando o servidor como ponte para enxergar o que de fora estaria fechado. Ganhou importância com a nuvem, onde há serviços internos sensíveis acessíveis apenas de dentro. A defesa é validar e restringir rigorosamente os destinos que o servidor pode buscar (lista de permitidos), em vez de aceitar qualquer endereço.

## Falhas criptográficas

Reúne os erros de proteção de dados que você estudou no módulo 3, agora como categoria de falha web: dados sensíveis trafegando ou guardados sem cifra, uso de algoritmos obsoletos (MD5, SHA-1, TLS antigo), senhas sem hashing forte, chaves mal gerenciadas. O sintoma é dado sensível exposto ou protegido só na aparência. A defesa é a do módulo 3: TLS atual, AES para dados em repouso, hashing de senha com Argon2id/bcrypt e gestão de chaves em cofre.

## Registro e monitoramento insuficientes

Se um ataque acontece e ninguém percebe, o estrago cresce no escuro. Esta categoria trata da falta de **logs** (módulo 2) e de **alertas**: sistema que não registra tentativas de login falhas, acessos a dados sensíveis ou erros suspeitos, e que não avisa ninguém quando algo foge do normal. A média de tempo entre uma invasão e sua descoberta ainda é medida em semanas ou meses, justamente por isso. A defesa é registrar os eventos de segurança, protegê-los contra adulteração, guardá-los pelo prazo adequado e definir alertas para o que importa.

## As dez categorias da edição 2021

Com as duas lições, você viu oito das dez categorias. Para fechar a lista, ficam as duas que são mais de processo do que de código:

| Posição (2021) | Categoria | Onde está no curso |
|---|---|---|
| A01 | Controle de acesso quebrado | Esta lição |
| A02 | Falhas criptográficas | Esta lição e módulo 3 |
| A03 | Injeção (inclui XSS) | Lição 6 |
| A04 | **Design inseguro** | Abaixo |
| A05 | Configuração incorreta | Esta lição |
| A06 | Componentes vulneráveis e desatualizados | Esta lição |
| A07 | Falhas de identificação e autenticação | Lição 6 e módulo 3 |
| A08 | **Falhas de integridade de software e dados** | Abaixo |
| A09 | Registro e monitoramento insuficientes | Esta lição |
| A10 | SSRF | Esta lição |

**Design inseguro** é a falha que nasce antes do código: o sistema foi concebido sem pensar em abuso. Exemplo: um portal que permite recuperar a senha respondendo "qual o CNPJ da empresa?", um dado público. Nenhuma linha de código está errada; a ideia é que está. A defesa é pensar nas ameaças na fase de projeto (modelagem de ameaças, lição 2).

**Falhas de integridade de software e dados** cobrem atualizações e componentes aceitos sem verificar a origem: um sistema que baixa "a nova versão" de um endereço qualquer, sem assinatura (módulo 3), ou que aceita dados serializados do usuário sem validar. A defesa é verificar assinaturas e hashes de tudo que entra na cadeia de software.

## Checklist para quem contrata ou desenvolve

Use estas perguntas ao encomendar, comprar ou acompanhar um sistema:

| Área | Pergunta de verificação |
|---|---|
| Controle de acesso | Cada requisição confere no servidor se o recurso pertence ao usuário? Testaram IDOR? |
| Injeção e XSS | Usa consultas parametrizadas e escape de saída por padrão (lição 6)? |
| Configuração | Senhas padrão trocadas, painéis fora da internet, erros sem detalhes internos, hardening aplicado? |
| Componentes | Há inventário de dependências e atualização automática quando surge uma CVE? |
| SSRF | O servidor restringe os destinos que pode acessar a partir de entradas do usuário? |
| Criptografia | TLS atual, dados sensíveis cifrados, senhas com Argon2id/bcrypt, chaves em cofre? |
| Autenticação | MFA disponível, limite de tentativas, sessões seguras e com expiração? |
| Registro | Eventos de segurança são registrados, protegidos e geram alertas? |
| Processo | Houve pentest? Há reteste após correções? As evidências são descartadas? |

Uma resposta vaga ("é tudo criptografado e seguro") é, por si, um sinal de alerta.

## Erros comuns

- **Esconder em vez de autorizar.** Tirar o link do menu não impede alguém de trocar o `id` na URL.
- **Confiar no cliente.** Validação e autorização que valem são as do servidor.
- **Deixar a dependência envelhecer.** O código próprio seguro não protege de uma biblioteca vulnerável.
- **Configuração padrão em produção.** Senhas de fábrica e painéis abertos são portas escancaradas.
- **Não registrar nada.** Sem logs, o incidente só aparece quando já é tarde.

## Na prática

- Rode o checklist com o fornecedor do sistema contábil e do portal de clientes; guarde as respostas.
- No portal do escritório, teste você mesmo a troca de identificadores na URL com duas contas de teste, para flagrar IDOR.
- Exija inventário de dependências atualizado e confirme que logs de acesso a dados sensíveis existem e são guardados.
- Registre a diligência: diante da ANPD, mostrar que você cobrou e verificou faz diferença.

## Resumo

- Controle de acesso quebrado (IDOR) é a falha número 1 da edição 2021; a defesa é verificar a autorização no servidor a cada requisição.
- Configuração incorreta e componentes vulneráveis se resolvem com hardening e atualização de dependências.
- SSRF abusa do servidor para alcançar a rede interna; a defesa é restringir os destinos permitidos.
- Falhas criptográficas e de registro repetem o módulo 3 e o módulo 2: cifra adequada, chaves em cofre, logs e alertas.
- O checklist transforma "confie em mim" em perguntas verificáveis para quem contrata ou desenvolve.
