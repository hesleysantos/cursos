Nesta lição você vai aprender a usar IA no trabalho contábil sem criar problemas jurídicos ou éticos: a quem pertence o **código gerado** e que **licenças** ele pode carregar, como tratar **dados de clientes**, o que é ser **transparente** com quem usa seus sistemas, como **vieses** aparecem em tarefas aparentemente neutras, onde fica a **responsabilidade profissional** do contador e o que a **regulação** sinaliza. Isso importa porque a tecnologia muda rápido, mas a responsabilidade por um balanço, uma declaração ou um dado vazado continua sendo de quem assina.

## Código gerado: de quem é e com que licença

**Propriedade.** Os termos de uso dos principais provedores atribuem ao usuário os direitos sobre a saída gerada, em termos gerais; os detalhes variam por serviço e plano e podem mudar — leia os termos do que você usa. Na prática, o código gerado no seu projeto é seu para usar, modificar e vender, com uma ressalva: a proteção autoral de material gerado sem contribuição humana substancial ainda está em discussão em várias jurisdições. Isso raramente afeta um app interno, mas importa se o código é o produto que você pretende proteger.

**Licenças de terceiros.** O risco real é outro: a IA aprendeu com código público e pode reproduzir trechos de projetos cujas licenças impõem obrigações. Licenças **permissivas** (MIT, Apache 2.0, BSD) pedem pouco mais que manter o aviso de copyright. Licenças **copyleft** (GPL, AGPL) podem exigir que o seu código, se distribuído, seja aberto nos mesmos termos. Há ainda as **dependências** instaladas: cada biblioteca tem licença, e AGPL em um serviço web tem implicações diferentes de MIT.

Rotina mínima: peça à IA que liste as licenças das dependências (há ferramentas que fazem isso), evite copyleft forte em produtos comerciais sem avaliar, e reescreva trechos que pareçam "copiados" (comentários estranhos, nomes de outro projeto).

## Dados de clientes

Você viu a LGPD pelo lado do app. Aqui o ângulo é o uso da IA no dia a dia:

- **Não cole dados de clientes em ferramentas que usam o conteúdo para treinar modelos.** Planos corporativos e APIs costumam oferecer compromisso de não treinar com os seus dados; planos gratuitos nem sempre. Verifique a política atual e configure as opções de privacidade.
- **Minimize**: para resumir um contrato, substitua CNPJ e nomes das partes por "Empresa A" e "Empresa B". Para classificar um documento, as primeiras linhas bastam.
- **Finalidade**: o cliente confiou os dados para a contabilidade; usá-los para treinar um produto seu é outra finalidade e exige outra base legal.
- **Contratos**: o provedor de IA que processa dados de clientes entra na cadeia como operador; o contrato de serviço deve tratar disso.

## Transparência com usuários

Quem usa um sistema seu tem o direito de saber quando lida com IA e quando uma decisão foi automatizada. Práticas simples:

- Rotular: "resumo gerado automaticamente; confira o documento original".
- Oferecer caminho humano: um botão "falar com o contador" no portal.
- Explicar o alcance: "este assistente responde sobre normas internas; não dá orientação tributária".
- Registrar: o log diz quando uma classificação ou cálculo foi feito por IA.

A transparência protege o usuário e você: um resumo rotulado como automático não é uma opinião profissional assinada.

## Vieses

Modelos reproduzem padrões dos dados de treinamento, e isso aparece em lugares inesperados:

- Um classificador de "risco de inadimplência" pode associar risco a bairros ou tipos de empresa de forma injusta.
- Um assistente que redige e-mails pode mudar o tom conforme o nome do destinatário.
- Um extrator de dados pode errar sistematicamente nos documentos de um formato menos comum (o de clientes menores, por exemplo).

O remédio é o da lição anterior: conjunto de teste que representa todos os clientes, métricas **por grupo**, revisão humana nas decisões que afetam pessoas. Decisões sobre direitos (crédito, contratação, demissão) exigem revisão humana real e base jurídica.

## Responsabilidade profissional do contador

A ferramenta muda; a responsabilidade não. O contador responde pelo que assina perante o cliente, o Conselho de classe e o fisco, tenha ou não usado IA. Consequências:

- **Revisão** é parte do trabalho: a IA calcula, você confere o que importa.
- **Sigilo** vale para o que você digita em um chat tanto quanto para o que diz ao telefone.
- **Competência**: usar uma ferramenta que você não entende, em algo que assina, é risco que o código de ética não perdoa.
- **Documentação**: registre o que foi automatizado e como foi conferido. Em uma fiscalização, "a IA fez" não é resposta.

## Regulação: noção

**União Europeia.** O **AI Act** é a lei europeia de IA, em vigor desde 2024 com obrigações entrando em etapas. Classifica usos por **risco** (proibido, alto, limitado, mínimo) e impõe deveres crescentes conforme o risco: transparência, documentação, supervisão humana, gestão de dados. Afeta quem oferece sistemas na UE e serve de referência para o resto do mundo.

**Brasil.** Há um **projeto de lei** sobre IA em tramitação no Congresso (o PL 2338/2023, aprovado pelo Senado no fim de 2024 e enviado à Câmara), inspirado no modelo de risco europeu, e a **ANPD** (Autoridade Nacional de Proteção de Dados) já atua sobre dados pessoais em IA com base na LGPD. Texto, prazos e detalhes podem mudar; acompanhe fontes oficiais.

O que já vale hoje: LGPD, Código de Defesa do Consumidor, Código Civil (responsabilidade por dano), normas do Conselho Federal de Contabilidade. A regulação específica de IA vai somar deveres, não substituí-los.

## Erros comuns

- Colar extrato de cliente em um chat gratuito "só para entender".
- Descobrir AGPL em um produto vendido por não olhar licenças.
- Entregar ao cliente um resumo gerado como se fosse parecer.
- Automatizar uma decisão sobre pessoas sem conseguir explicá-la.
- Esperar "a lei de IA" para cuidar de dados: a LGPD já cobra.

## Na prática

Antes de lançar um portal com resumo de contratos por IA, o escritório confere as licenças das dependências, escolhe um plano de API com compromisso de não treinamento, anonimiza as partes nos prompts, rotula os resumos como automáticos com link para o original, registra cada geração em log e inclui no contrato com o cliente uma cláusula sobre processamento automatizado. Nada disso impede o lançamento; tudo isso evita o problema.

## Resumo

- Código gerado é, em geral, seu; o risco está nas licenças de trechos e dependências (permissiva vs. copyleft).
- Dados de clientes: serviços sem treinamento, minimização, finalidade e contrato.
- Transparência: rotule o automático, ofereça caminho humano, registre.
- Vieses: métricas por grupo e revisão humana em decisões sobre pessoas.
- O contador responde pelo que assina; AI Act e PL brasileiro sinalizam deveres por risco, mas LGPD e código de ética já valem hoje.
