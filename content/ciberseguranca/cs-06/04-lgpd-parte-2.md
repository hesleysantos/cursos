Nesta lição você vai transformar a LGPD em **prática**: mapear os dados (RoPA), saber quando fazer o **relatório de impacto (RIPD)**, colher consentimento do jeito certo, fechar contratos com operadores, definir retenção e descarte, responder a incidentes dentro das regras da ANPD e montar um **programa de privacidade** que um escritório consegue manter. O princípio da prestação de contas exige **provar** o cumprimento, e prova se produz com documentos e rotina.

## Mapeamento de dados: o RoPA

O **art. 37** obriga controlador e operador a manter **registro das operações de tratamento**, o **RoPA** (Record of Processing Activities). É o inventário: para cada processo que usa dados pessoais, uma linha com:

| Campo | Exemplo (folha de pagamento de clientes) |
|---|---|
| Processo | processamento de folha e eSocial |
| Papel do escritório | operador (o cliente é controlador) |
| Dados tratados | nome, CPF, PIS, salário, dependentes, atestados (sensível) |
| Titulares | funcionários dos clientes |
| Finalidade | cumprir obrigações trabalhistas e previdenciárias |
| Base legal | obrigação legal (art. 7º, II; art. 11, II, "a") |
| Origem | enviado pelo cliente |
| Compartilhamento | eSocial/governo, banco (pagamento), sistema de folha em nuvem |
| Retenção | prazo legal das obrigações trabalhistas |
| Controles | acesso por perfil, MFA, backup, pasta restrita |

Um escritório típico tem de 10 a 20 linhas. A planilha nasce da tabela da lição anterior e vira a base de tudo: política, contratos, pedidos de titulares, incidentes.

## RIPD: quando e como

O **Relatório de Impacto à Proteção de Dados Pessoais (RIPD, art. 38)** descreve um tratamento de **alto risco**, os riscos aos titulares e as medidas de mitigação. A ANPD pode exigi-lo; a Resolução CD/ANPD nº 2/2022 considera de alto risco o tratamento que combina um critério geral (larga escala ou afetar significativamente os titulares) com um específico, como dados sensíveis ou de crianças, adolescentes e idosos, decisões unicamente automatizadas, vigilância de áreas públicas ou uso de tecnologias inovadoras. Para o escritório, candidatos a RIPD: implantação de **ponto biométrico** nos clientes, uso de ferramenta de **IA** sobre dados de funcionários, novo sistema que concentra dados de saúde. Estrutura: descrição do tratamento, necessidade e proporcionalidade, riscos (probabilidade × impacto, como na lição 2), medidas, conclusão e assinatura do encarregado.

## Consentimento feito direito

Quando o consentimento é a base (newsletter, uso de foto no site, cookies não essenciais), ele precisa ser **livre, informado, inequívoco e específico** (art. 8º): texto claro, finalidade determinada, caixa **não** pré-marcada, separado dos termos de contrato, com registro de quando e como foi obtido e um caminho fácil para **revogar** (art. 8º, § 5º). O ônus de provar que houve consentimento é do controlador (art. 8º, § 2º).

## Contratos com operadores (e como operador)

O escritório fecha dois tipos de contrato:

1. **Com os clientes**, em que é operador: cláusula definindo papéis, finalidade, instruções, dever de sigilo, medidas de segurança, comunicação de incidentes em prazo (por exemplo, 24 horas), devolução ou eliminação ao fim, auditoria. Sem isso, qualquer discussão sobre responsabilidade começa do zero.
2. **Com seus fornecedores** (sistema de folha em nuvem, hospedagem, prestador de TI, Microsoft/Google), em que o escritório é controlador e eles, operadores: mesma lógica, invertida. Leia os termos de tratamento de dados (DPA) dos provedores e guarde-os.

## Retenção e descarte

O princípio da **necessidade** e o art. 15 determinam que, encerrado o tratamento, os dados sejam eliminados, salvo para cumprir obrigação legal, pesquisa, transferência a terceiro autorizada ou uso exclusivo do controlador anonimizado (art. 16). Na contabilidade, os prazos legais fazem o trabalho: documentos trabalhistas e previdenciários, fiscais e contábeis têm prazos próprios, em geral de 5 anos ou mais (as obrigações do FGTS chegaram a 30 anos para fatos antigos). A **tabela de temporalidade** do escritório diz, por tipo de documento, quanto tempo guardar e o que fazer depois: eliminar com registro (trituração, exclusão segura) ou devolver ao cliente. O que não tem prazo legal (currículos recebidos, contatos de marketing frios) deve ter prazo definido pelo escritório, curto.

## Resposta a incidentes: o que a ANPD exige

A **Resolução CD/ANPD nº 15/2024** regulamentou o art. 48:

- **Comunicar à ANPD** incidentes que possam acarretar **risco ou dano relevante** aos titulares, em **3 dias úteis** contados do conhecimento, por formulário próprio, com possibilidade de complementação posterior.
- **Comunicar aos titulares** afetados, em linguagem simples, no mesmo prazo, pelo meio mais eficaz.
- **Registrar internamente** todo incidente, comunicado ou não, com data, descrição, dados afetados, medidas tomadas e justificativa da decisão de comunicar ou não; guardar por 5 anos.
- Há **risco ou dano relevante** quando o incidente pode afetar significativamente os titulares e envolve ao menos um destes: dados sensíveis; dados de crianças, adolescentes ou idosos; dados financeiros; dados de autenticação (credenciais); dados protegidos por sigilo legal, judicial ou profissional; ou dados em larga escala.
- Agentes de **pequeno porte** (Resolução CD/ANPD nº 2/2022) têm esses prazos contados em dobro.

A decisão de comunicar precisa ser tomada **durante** a contenção, não semanas depois.

## Programa de privacidade prático

Um programa de privacidade para o escritório, em ordem de implantação:

1. **Encarregado** indicado (mesmo que dispensado) e canal publicado no site (e-mail de privacidade).
2. **RoPA** preenchido e revisado semestralmente.
3. **Política de privacidade** externa (site) e **política interna** de proteção de dados (lição seguinte).
4. **Contratos** com clientes e fornecedores com cláusulas de dados.
5. **Tabela de temporalidade** e rotina de descarte.
6. **Procedimento de atendimento a titulares**: quem recebe, como confirma a identidade, prazo de 15 dias, modelo de resposta.
7. **Procedimento de incidentes** integrado ao playbook do módulo 5, com o formulário da ANPD salvo.
8. **Treinamento** anual e registro de presença.
9. **RIPD** para os tratamentos de alto risco identificados.
10. **Revisão anual** de tudo, com ata.

A Resolução CD/ANPD nº 2/2022 dá tratamento **simplificado** a agentes de pequeno porte (microempresas, pequenas empresas, startups), mas não a quem trata dados de alto risco ou em larga escala; um escritório que processa folhas de dezenas de empresas deve avaliar com cuidado se se enquadra.

## Erros comuns

- Política de privacidade copiada da internet, sem corresponder ao que o escritório faz.
- RoPA feito uma vez e esquecido numa gaveta.
- Guardar "para sempre" por desconhecer o prazo, ou apagar antes do prazo legal.
- Descobrir o formulário da ANPD no dia do incidente.
- Confundir o programa com um documento: programa é rotina com responsável e calendário.

## Na prática

Comece pelo RoPA: duas horas com uma pessoa de cada área (fiscal, pessoal, contábil, administrativo), uma linha por processo. Com ele na mão, a política, os contratos e a resposta a incidentes se escrevem quase sozinhos.

## Resumo

- RoPA (art. 37): inventário de cada tratamento com papel, dados, base legal, compartilhamento, retenção e controles.
- RIPD (art. 38) para tratamentos de alto risco (sensíveis em escala, biometria, IA, vulneráveis).
- Consentimento livre, informado, específico, revogável e comprovável; só quando é a base adequada.
- Contratos com clientes (escritório operador) e fornecedores (escritório controlador) com cláusulas de dados.
- Resolução CD/ANPD 15/2024: comunicar ANPD e titulares em 3 dias úteis; registrar todo incidente por 5 anos.
