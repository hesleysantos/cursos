Nesta lição você vai aprender o que nunca deve ser colado num chat de IA, como ler a política de uso de dados de uma ferramenta, o que a LGPD exige de quem trata dados de clientes, por que contas corporativas existem, como anonimizar antes de enviar e, por fim, como escrever uma política de uso de IA para o escritório. Para um contador, que lida o dia inteiro com dados sigilosos de terceiros, esta lição define a linha entre uso profissional e imprudência.

## O que acontece com o que você cola

Quando você envia um texto a um assistente em nuvem, ele sai do seu computador e vai para os servidores do fornecedor. A partir daí, três coisas podem acontecer, dependendo da ferramenta e do plano:

1. O conteúdo é processado e **descartado** após um período (comum em planos corporativos e em APIs).
2. O conteúdo é **armazenado** no seu histórico, visível a quem tiver acesso à conta.
3. O conteúdo pode ser **usado para treinar** versões futuras do modelo (comum como padrão em planos gratuitos e pessoais, muitas vezes com opção de desativar).

O terceiro caso é o mais delicado: um dado que entrou no treinamento pode, em teoria, ressurgir num texto gerado para outra pessoa. Por isso a primeira pergunta a fazer a qualquer ferramenta é: **meus dados são usados para treinamento? Onde está escrito?**

## O que não colar num chat (sem garantia contratual)

- **Dados pessoais de clientes e funcionários**: CPF, RG, endereço, data de nascimento, salário, dados de saúde, dados bancários.
- **Senhas, tokens, certificados digitais e chaves de API.** Nunca, em nenhuma ferramenta.
- **Documentos sigilosos**: contratos com cláusula de confidencialidade, balancetes de clientes, folha de pagamento, planejamento tributário, dados de processos.
- **Informação de terceiros sem autorização**: e-mails recebidos, propostas de concorrentes, dados de um cliente para resolver dúvida de outro.
- **Qualquer coisa que você não colocaria num e-mail para um desconhecido.**

Isso não significa "nunca use IA com dados reais". Significa que, para dados reais, você precisa de uma ferramenta com garantia (contrato corporativo ou modelo local) ou de anonimização.

## Políticas de uso de dados: o que procurar

Toda ferramenta séria publica uma política de privacidade e termos de uso. Ao ler, procure respostas para:

- Os dados enviados são usados para **treinar** modelos? Há como **desativar**? Para contas corporativas, a resposta costuma ser "não, por contrato".
- Por quanto tempo os dados ficam **armazenados** e onde (país).
- Quem, dentro do fornecedor, pode **acessar** as conversas (por exemplo, equipes de segurança).
- Há **certificações** de segurança e conformidade e um **acordo de tratamento de dados** disponível.
- A ferramenta integrada ao seu sistema (ERP, banco, pacote de escritório) segue a política do sistema ou a de um terceiro?

Políticas mudam. Consulte a versão atual, registre a data em que leu e reveja periodicamente.

## LGPD em uma página

A **Lei Geral de Proteção de Dados (Lei 13.709/2018)** se aplica a qualquer tratamento de dados pessoais, e enviar um dado a uma ferramenta de IA é tratamento. Pontos que importam para o escritório:

- O escritório costuma ser **operador** dos dados do cliente (trata em nome dele) e **controlador** dos dados dos próprios funcionários. A classificação depende do caso — ao cumprir obrigações legais em nome próprio, o escritório pode ser controlador também dos dados do cliente —, mas nos dois papéis há deveres.
- Todo tratamento precisa de **finalidade** legítima e de **base legal** (execução de contrato, obrigação legal, legítimo interesse etc.). "Colei no chat para agilizar" não é base legal se o contrato com o cliente não prevê compartilhamento com terceiros.
- Dados **sensíveis** (saúde, biometria, filiação sindical, entre outros) têm regras mais rígidas. Atestados e laudos médicos que chegam ao departamento pessoal entram aqui.
- O fornecedor de IA passa a tratar os dados em seu nome: vira **operador** (ou **suboperador**, quando o escritório já é operador do cliente); você precisa saber quem ele é, onde armazena e com que garantias.
- Incidente de segurança (vazamento) pode exigir comunicação à ANPD e aos titulares. Colar dados num lugar sem controle é um incidente esperando para acontecer.

Em caso de dúvida sobre um tratamento específico, consulte o encarregado de dados (DPO) do escritório ou um advogado; esta lição dá o mapa, não o parecer.

## Contas corporativas e modelos locais

Planos corporativos (Team, Enterprise, Business e similares) existem justamente para resolver isso: garantia contratual de não treinamento, administração centralizada de usuários, controle de quem pode usar quais recursos, e muitas vezes retenção reduzida. Custam mais por usuário, mas transformam a IA de "risco individual" em "ferramenta institucional".

Para o que nem assim pode sair da rede — ou para clientes que exigem isso —, o **modelo local** (lição 4) é a alternativa: os dados nunca deixam o servidor do escritório.

## Anonimização: a técnica mais barata

Muitas tarefas não precisam do dado real. Antes de colar, substitua:

```text
Antes:
"O funcionário João da Silva, CPF 123.456.789-00, admitido em 03/02/2021
com salário de R$ 3.850,00, apresentou atestado de 15 dias..."

Depois:
"O funcionário F1, admitido em 03/02/2021 com salário de R$ 3.850,00,
apresentou atestado de 15 dias..."

Prompt:
Com base no caso acima, explique como calcular os primeiros 15 dias de
afastamento e a partir de quando o INSS assume o benefício.

Resposta esperada (resumo):
A explicação sai idêntica à que sairia com o nome real — o modelo não
precisava do CPF para nada. Nome e documento ficaram fora.
```

Regras práticas: troque nomes por códigos (F1, Cliente A), remova documentos e endereços, arredonde valores quando o valor exato não importa, apague o que não é necessário para a pergunta. Mantenha, no seu computador, a tabela de correspondência.

> **Atenção:** a rigor, a LGPD chama de **pseudonimização** a troca por códigos quando você guarda a tabela que permite voltar ao nome real; **anonimização** é quando não há como reidentificar a pessoa. Para o fornecedor da IA, que nunca vê a tabela, o efeito é o mesmo; a tabela, porém, continua sendo dado pessoal e deve ficar protegida.

## Política de uso de IA para o escritório

Um documento de uma página já resolve a maior parte dos problemas. Ele deve dizer:

1. **Ferramentas aprovadas** (e as contas: corporativas, não pessoais).
2. **O que pode e o que não pode** ser enviado, com exemplos concretos.
3. **Regra de anonimização** obrigatória para dados de clientes fora das ferramentas aprovadas.
4. **Verificação obrigatória**: toda saída usada em entrega ao cliente ou a órgão público é revisada por uma pessoa responsável.
5. **Registro**: o que foi feito com IA fica anotado no processo (lição 7).
6. **Responsável** pela política e data de revisão.

Peça à própria IA um rascunho com essa estrutura, revise com a equipe e assine. Políticas que ninguém lê não protegem ninguém.

## Erros comuns

- **Usar a conta pessoal gratuita para trabalho** porque "é a mesma coisa". Não é: a política de dados é outra.
- **Confiar no botão "não treinar" sem conferir** se ele existe no seu plano e se está ativado.
- **Anonimizar só o nome** e deixar CPF, matrícula ou e-mail.
- **Colar prints de tela** achando que imagem não é dado. É.

## Na prática

Fluxo seguro para uma dúvida trabalhista real: anonimize o caso, use a ferramenta aprovada pelo escritório, peça a explicação com os dispositivos legais, confira na fonte, aplique ao caso real no seu sistema e anote no processo "análise preliminar com IA, conferida em [data]". Nada de dado identificável saiu, e a resposta chegou em minutos.

## Resumo

- O que você cola sai do seu computador; descubra se é armazenado e se treina modelos.
- Sem garantia contratual, nunca envie dados pessoais, senhas, certificados nem documentos sigilosos.
- LGPD se aplica: finalidade, base legal, cuidado redobrado com dados sensíveis e responsabilidade pelo fornecedor.
- Contas corporativas e modelos locais existem para dados reais; anonimização resolve a maior parte dos casos.
- Escreva uma política de uma página: ferramentas, limites, anonimização, verificação, registro e responsável.
