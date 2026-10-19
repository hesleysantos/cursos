Nesta lição você vai entender o que, afinal, a segurança da informação protege, vai conhecer os três pilares que todo profissional da área usa para pensar (confidencialidade, integridade e disponibilidade) e vai aprender quatro palavras que organizam qualquer conversa sobre risco: ativo, ameaça, vulnerabilidade e risco. Isso importa porque, sem esse vocabulário, segurança vira uma lista de medos soltos; com ele, vira uma decisão de negócio, como decidir se vale a pena contratar um seguro.

## O que estamos protegendo

Segurança da informação não é "proteger o computador". É proteger a **informação** que o escritório guarda, processa e envia, esteja ela num servidor, num pendrive, num e-mail, numa gaveta ou na cabeça de um funcionário. Para um escritório contábil, isso inclui: folhas de pagamento, extratos bancários, senhas de portais do governo, certificados digitais, declarações de imposto de renda, contratos e os dados pessoais de centenas de clientes.

Uma analogia ajuda: pense no escritório como um cofre de documentos. O cofre precisa de três coisas ao mesmo tempo. Só quem tem a chave abre (ninguém de fora lê). O que está lá dentro continua exatamente como foi guardado (ninguém altera). E, quando você precisa de um papel, o cofre abre (ele não está trancado para sempre nem inundado). Esses três requisitos têm nome.

## Os três pilares: a tríade CIA

A sigla CIA vem do inglês *Confidentiality, Integrity, Availability*. Em português: **confidencialidade, integridade e disponibilidade**. Praticamente todo incidente de segurança é a quebra de um ou mais desses pilares.

| Pilar | Pergunta que responde | Exemplo de quebra no escritório |
|---|---|---|
| Confidencialidade | Só quem deve ver, vê? | Um ex-funcionário ainda acessa o e-mail e lê a folha dos clientes |
| Integridade | A informação está correta e inalterada? | Alguém troca a conta bancária num boleto antes de ele ser pago |
| Disponibilidade | A informação está acessível quando preciso? | Um ransomware (programa que embaralha os arquivos e cobra resgate para devolvê-los) tranca tudo na véspera da entrega da DCTFWeb |

Repare que os pilares podem conflitar. Senhas longas e dupla verificação aumentam a confidencialidade, mas tornam o acesso mais lento. Backup em três lugares aumenta a disponibilidade, mas cria três cópias para proteger. Segurança é sempre equilíbrio, nunca "máximo de tudo".

## Quatro palavras para pensar em risco

Profissionais de segurança não discutem "o hacker". Eles usam um vocabulário preciso:

- **Ativo** é qualquer coisa de valor: dados, equipamentos, sistemas, a reputação do escritório e até o tempo da equipe.
- **Ameaça** é algo que pode causar dano ao ativo: um criminoso, um funcionário descuidado, um incêndio, uma falha de energia.
- **Vulnerabilidade** é uma fraqueza que a ameaça pode explorar: senha fraca, sistema sem atualização, porta aberta, falta de treinamento.
- **Risco** é a combinação: a chance de uma ameaça explorar uma vulnerabilidade e o tamanho do estrago se isso acontecer.

Uma forma simples de lembrar: risco = probabilidade × impacto. Um pendrive com senhas de clientes (ativo) pode ser perdido (ameaça); ele não é criptografado (vulnerabilidade); logo, o risco é alto, porque a chance de perda é razoável e o impacto é grave. A boa notícia é que você não controla a ameaça, mas controla a vulnerabilidade: criptografe o pendrive (embaralhe o conteúdo de modo que só quem tem a senha consiga ler) e o risco despenca, mesmo que a ameaça continue existindo.

## Por que escritórios contábeis são alvo

Muita gente acredita que "ninguém vai perder tempo com um escritório pequeno". Os dados mostram o contrário, por três motivos.

Primeiro, **valor concentrado**. Um único escritório contábil guarda os dados bancários, fiscais e pessoais de dezenas ou centenas de empresas e pessoas físicas. Para o criminoso, é mais rentável atacar o contador do que atacar cada cliente separadamente.

Segundo, **acesso privilegiado**. O escritório tem procurações eletrônicas, certificados digitais e senhas de portais (e-CAC, Simples Nacional, eSocial, internet banking). Quem controla a máquina do contador controla, na prática, parte da vida fiscal dos clientes.

Terceiro, **defesa menor**. Grandes bancos têm equipes de segurança 24 horas. Um escritório com oito pessoas costuma ter um computador antigo que "ainda funciona", uma senha compartilhada no post-it e nenhum backup testado. Ataques em massa, como campanhas de phishing (mensagens falsas que fingem ser do banco ou da Receita para roubar senhas; lição 3) e de ransomware, não escolhem a vítima pelo tamanho; escolhem pela facilidade.

Há ainda uma dimensão legal. A **LGPD (Lei 13.709/2018)** obriga quem trata dados pessoais a adotar medidas de segurança e a comunicar incidentes à Autoridade Nacional de Proteção de Dados e aos titulares. Vazar dados de clientes não é só constrangimento: pode gerar sanções, indenizações e perda de contratos.

## Erros comuns

- **Confundir segurança com antivírus.** O antivírus protege contra uma parte das ameaças. Ele não impede alguém de digitar a senha num site falso nem substitui o backup.
- **Proteger só o que é "sigiloso".** A integridade de um boleto ou a disponibilidade de uma planilha de folha são tão críticas quanto o sigilo.
- **Achar que o risco é zero ou é cem.** Risco se reduz, se transfere (seguro) ou se aceita conscientemente. Nunca desaparece.
- **Esquecer os ativos invisíveis.** A conta do WhatsApp do escritório, o e-mail de recuperação de senha e o celular do sócio são ativos críticos, mas quase nunca entram na lista.

## Na prática

Um bom começo é um **inventário de ativos** em uma planilha simples, com quatro colunas: o que é, onde está, quem acessa e o que acontece se for perdido, alterado ou vazado. Em um escritório pequeno, a lista cabe em uma página. Só de preenchê-la já aparecem surpresas: a senha do certificado digital anotada num arquivo de texto no desktop, o backup que ninguém sabe se funciona, o estagiário que saiu há seis meses e ainda tem usuário ativo.

Depois, classifique cada linha por risco (alto, médio, baixo) usando a lógica de probabilidade × impacto. Ao longo deste curso, cada lição vai atacar uma vulnerabilidade dessa lista: senhas, dispositivos, backup, navegação, certificado digital.

> **Dica:** a pergunta mais útil de toda a segurança é "e se isso parar de funcionar amanhã às 8h?". Faça-a para cada ativo e você terá, de graça, seu primeiro plano de continuidade.

## Resumo

- Segurança da informação protege a informação, onde quer que ela esteja, não apenas o computador.
- Os três pilares são confidencialidade (só quem deve vê), integridade (nada alterado sem autorização) e disponibilidade (acessível quando preciso).
- Risco é a chance de uma ameaça explorar uma vulnerabilidade num ativo, multiplicada pelo impacto; você reduz risco atacando as vulnerabilidades.
- Escritórios contábeis são alvo por concentrar dados valiosos, ter acesso privilegiado a portais e ter defesas fracas.
- A LGPD (Lei 13.709/2018) torna a proteção dos dados dos clientes uma obrigação legal.
