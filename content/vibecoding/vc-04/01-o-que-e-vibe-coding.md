Nesta lição você vai entender o que é **vibe coding**: construir software descrevendo o que quer em linguagem natural e deixando a IA gerar o código, num ciclo de descrever, gerar, rodar, testar e iterar. Vai ver o que muda em relação ao no-code e à programação tradicional, o que não muda (você continua responsável), os mitos mais comuns e quem está usando isso para quê. Isso importa porque o vibe coding é a ponte entre o que você construiu sem código no módulo anterior e sistemas que são seus de verdade, com o código no seu **repositório** (a pasta do projeto com todo o histórico de versões, assunto da lição 7).

## O termo e o que ele significa

A expressão "vibe coding" surgiu no início de 2025 para descrever uma forma de programar em que a pessoa conversa com a IA, aceita o código gerado, roda, vê o que acontece e pede ajustes, sem necessariamente ler cada linha. Em 2026, o termo amadureceu e passou a nomear uma prática séria: **desenvolvimento conduzido por descrição**, em que o humano decide o que construir, especifica, testa e aprova, e a IA escreve o código.

A diferença para o no-code é a matéria-prima. No no-code, você arrasta blocos que alguém desenhou; o que a ferramenta não oferece, não existe. No vibe coding, a IA gera código de verdade, em linguagens como JavaScript e Python; o limite passa a ser a sua capacidade de descrever e verificar, não o catálogo de blocos.

## O ciclo: descrever → gerar → rodar → testar → iterar

Todo projeto de vibe coding segue o mesmo ciclo, repetido dezenas de vezes:

1. **Descrever**: você escreve o que quer, com o detalhe que aprendeu em engenharia de prompt. "Uma página com um formulário de três campos que grava em uma planilha."
2. **Gerar**: a IA produz os arquivos. Em ferramentas modernas, ela cria a estrutura inteira, instala o que precisa e explica o que fez.
3. **Rodar**: você executa o resultado, no navegador ou no computador, e vê funcionando (ou não).
4. **Testar**: você usa como um usuário usaria. Preenche o formulário, manda vazio, manda errado, abre no celular.
5. **Iterar**: descreve o que está errado ou o que falta, e volta ao passo 2.

O ciclo é curto de propósito. Pedidos pequenos, testados um a um, produzem sistemas que funcionam. Um pedido gigante ("faça o sistema do escritório inteiro") produz algo que ninguém consegue testar nem corrigir.

> **Dica:** pense em cada iteração como um lançamento contábil: pequeno, conferido, com histórico. Vários lançamentos pequenos e certos valem mais que um grande e duvidoso.

## O que muda

- **Velocidade**: uma landing page que levava dias leva uma tarde. Uma calculadora leva uma hora.
- **Barreira de entrada**: não é preciso saber a sintaxe de uma linguagem para começar. É preciso saber o que se quer e reconhecer quando está certo.
- **Papel do humano**: menos digitação, mais especificação, teste e decisão. Você vira o cliente exigente e o revisor do seu próprio projeto.

## O que não muda

Aqui está a parte que mais gente ignora:

- **Você continua responsável.** Se o sistema calcula um honorário errado, o erro é seu, não da IA. Se expõe dados de cliente, a responsabilidade legal é do escritório.
- **Código precisa ser testado.** A IA erra, e erra com confiança. O teste manual que você faz é o que separa um sistema de um protótipo.
- **Segurança e privacidade continuam valendo.** O que você aprendeu no módulo 1 sobre o que não colar em uma IA vale para o código: nada de senhas, chaves ou dados reais de clientes nos prompts.
- **Versionamento é obrigatório.** Sem histórico, uma iteração ruim destrói o que funcionava. A lição 7 cuida disso.
- **Entender o mínimo ajuda muito.** Saber o que é um arquivo HTML, o que é um erro no console e o que é uma API transforma você de passageiro em piloto. A lição 3 dá esse mínimo.

## Mitos e limites

| Mito | Realidade |
|---|---|
| "A IA faz tudo, eu só peço" | A IA faz o que foi pedido e muitas vezes algo diferente; sem teste e especificação, o resultado é aleatório |
| "Não preciso entender nada de código" | Não precisa escrever, mas precisa reconhecer erros, ler mensagens e saber o que está pedindo |
| "O código gerado é seguro" | Pode conter falhas; peça revisão de segurança explícita e nunca coloque segredos no código |
| "Serve para qualquer sistema" | Serve muito bem para pequenos e médios; sistemas críticos e grandes exigem engenharia de verdade |
| "Substitui o programador" | Substitui parte do trabalho repetitivo; projetos sérios continuam precisando de quem revisa com profundidade |

Os limites reais em 2026: a IA se perde em projetos grandes, repete erros em áreas que não domina, pode introduzir dependências desatualizadas e não sabe o que você não contou. Nada disso impede o uso; tudo isso pede método.

## Quem está usando e para quê

- **Profissionais de outras áreas** (contadores, advogados, médicos) constroem ferramentas internas: calculadoras, conversores de arquivo, painéis, portais simples.
- **Pequenas empresas** criam landing pages, formulários inteligentes e automações sob medida sem contratar agência.
- **Desenvolvedores** usam para acelerar o trabalho repetitivo e prototipar.

Um prompt de arranque para a sua primeira conversa com uma ferramenta de vibe coding, já aplicando o que você sabe:

```text
Quero construir uma página web simples, sem servidor, que calcule o honorário mensal de um
cliente a partir do regime tributário, do faturamento e do número de funcionários. Antes de
gerar código, faça as perguntas que precisar para entender as regras de cálculo. Depois,
proponha a estrutura de arquivos e espere minha aprovação antes de escrever.
```

Repare: você pede perguntas antes de código e aprovação antes de escrever. Isso é vibe coding com método.

## Erros comuns

- **Pedir tudo de uma vez.** Peça uma funcionalidade por iteração.
- **Aceitar sem rodar.** Código que você não executou não existe.
- **Colar dados reais.** Use dados fictícios para testar; dados de cliente só no sistema pronto e protegido.
- **Abandonar quando quebra.** Quebrar faz parte do ciclo; a lição 6 ensina a depurar.

## Na prática

Um contador precisava de um conversor de extrato bancário em PDF para planilha, algo que nenhum no-code fazia do jeito que ele queria. Descreveu o formato, pediu perguntas, aprovou a estrutura, testou com três extratos fictícios e iterou cinco vezes. Em uma tarde tinha uma ferramenta que roda no computador dele, versionada no GitHub, sem depender de assinatura de ninguém.

## Resumo

- Vibe coding é construir software descrevendo em linguagem natural e deixando a IA gerar o código.
- O ciclo é descrever → gerar → rodar → testar → iterar, em passos pequenos.
- Muda a velocidade e a barreira de entrada; não muda a sua responsabilidade, o teste, a segurança e o versionamento.
- A IA erra com confiança; método (especificar, testar, versionar) é o que torna o resultado confiável.
- Casos típicos: calculadoras, conversores, portais simples, páginas de captação.
