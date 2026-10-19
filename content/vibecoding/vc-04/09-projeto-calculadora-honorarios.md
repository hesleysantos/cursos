Nesta lição você vai construir o projeto final do módulo: uma **calculadora de honorários** web, da especificação à publicação, passando por geração com IA, testes manuais, versionamento e deploy. Ao final, vai avaliar o resultado com uma **rubrica de qualidade** de quatro critérios: funciona, é claro, está versionado, está no ar. Isso importa porque é o ciclo completo de vibe coding aplicado a um problema real do escritório, e o que você aprender aqui se repete em todo projeto seguinte.

## O problema

Escritórios calculam honorários com regras parecidas: um valor base por regime tributário, acréscimos por faixa de faturamento e por número de funcionários, descontos por serviços não contratados. Hoje isso vive em uma planilha ou na cabeça do sócio. A calculadora padroniza a proposta e pode, mais tarde, virar uma página pública de orçamento.

As regras abaixo são **fictícias**, só para o exercício; troque pelas do seu escritório.

## Parte 1 — Especificação

Aplique a lição 4. O PRD em uma página:

**Objetivo:** calcular o honorário mensal sugerido a partir de regime, faturamento e funcionários.

**Usuários:** o sócio e a equipe comercial, no computador e no celular.

**Funcionalidades (v1):** formulário com regime (MEI, Simples, Presumido, Real), faturamento mensal (número), número de funcionários (inteiro), serviços adicionais (caixas: folha, fiscal completo, consultoria); botão Calcular; resultado com valor sugerido e a composição (base, acréscimos, adicionais); botão "Copiar proposta" que copia um texto pronto.

**Fora do escopo:** salvar propostas, login, envio por e-mail, PDF.

**Regras (fictícias):**
- Base por regime: MEI 150; Simples 600; Presumido 1.200; Real 2.500.
- Acréscimo por faturamento: até 30.000, zero; de 30.000,01 a 100.000, 20% da base; acima de 100.000, 50% da base.
- Acréscimo por funcionário: 35 por funcionário, a partir do primeiro.
- Adicionais: folha 200; fiscal completo 300; consultoria 400.
- Validação: faturamento maior ou igual a zero; funcionários inteiro maior ou igual a zero; regime obrigatório.

**Telas:** uma só, com o formulário à esquerda e o resultado à direita (em coluna no celular).

**Critérios de aceite:**
- Simples, faturamento 50.000, 3 funcionários, folha: resultado 600 + 120 + 105 + 200 = 1.025.
- MEI, faturamento 0, 0 funcionários, sem adicionais: 150.
- Faturamento negativo ou vazio: mensagem de erro, sem calcular.
- Real, 150.000, 10 funcionários, todos os adicionais: 2.500 + 1.250 + 350 + 900 = 5.000.
- Sem erro no console; funciona no celular.

Repare que os critérios de aceite são **casos de teste com resultado esperado**, calculados à mão. É assim que você vai saber se a IA acertou. Faça a conta você mesmo antes de gerar; se o sistema der outro número, ou a IA errou, ou a sua conta errou, e os dois casos precisam ser descobertos.

## Parte 2 — Geração

1. Crie a pasta `calculadora-honorarios` e ligue o Git nela (GitHub Desktop, lição 7). Primeiro commit: "Especificação", com o PRD salvo como `PRD.md`.
2. Abra a ferramenta escolhida (agente ou editor com IA) na pasta e cole o prompt de arranque:

```text
Você é um desenvolvedor sênior ajudando um contador. Construa a calculadora descrita em
PRD.md como uma página estática (index.html, estilos.css, app.js), sem framework, sem
servidor, em português. Comente o código explicando cada regra de cálculo. Separe a
função de cálculo (que recebe os dados e devolve a composição) da parte que mexe na tela,
para que eu possa testar o cálculo isoladamente. Antes de gerar, liste as dúvidas sobre
as regras; depois proponha a estrutura e espere minha aprovação.
```

3. Responda às dúvidas, aprove a estrutura, deixe gerar.
4. Abra `index.html` no navegador. Commit: "Primeira versão gerada".

Se usar um construtor por prompt, o fluxo é o mesmo; ao final, exporte para o GitHub.

## Parte 3 — Testes manuais

Use os critérios de aceite como roteiro, um por vez:

5. Caso Simples/50.000/3/folha: o resultado é 1.025? A composição mostra 600, 120, 105 e 200?
6. Caso MEI zerado: 150?
7. Faturamento vazio: mensagem clara, sem número no resultado, sem erro no console?
8. Caso Real completo: 5.000?
9. Faturamento exatamente 30.000: acréscimo zero (o limite é "até 30.000"). E 30.000,01: 20%. Limites são onde os bugs moram.
10. Celular: campos legíveis, botão alcançável, resultado abaixo do formulário.
11. "Copiar proposta": o texto copiado tem os valores certos?

Cada falha vira um prompt de depuração (lição 6): mensagem completa, o que fez, o que esperava, explicação antes da correção. Cada correção que passa nos testes vira um commit com mensagem descritiva.

Peça também uma revisão à IA, como fez com o modelo de dados no módulo anterior:

```text
Revise app.js procurando: casos de limite nas faixas de faturamento (30.000 e 100.000),
tratamento de vírgula como separador decimal digitado pelo usuário, número de funcionários
decimal, e qualquer caminho em que o resultado possa aparecer sem validação. Liste os
problemas encontrados antes de alterar qualquer coisa.
```

## Parte 4 — Publicação

12. Confira o `.gitignore` (não há segredos neste projeto, mas o hábito fica).
13. Push para o GitHub.
14. Publique com GitHub Pages (lição 7) ou conecte à Vercel/Netlify (lição 8).
15. Teste os mesmos casos no endereço publicado, no celular.
16. Se tiver domínio, configure `calculadora.seudominio.com.br`.
17. Commit final: "Versão 1 publicada".

## Rubrica de qualidade

Avalie o projeto nos quatro critérios. Cada um é sim ou não; o projeto está pronto com quatro sins.

| Critério | Pergunta | Como verificar |
|---|---|---|
| Funciona | Todos os critérios de aceite passam, inclusive os limites e o caminho do erro? | Rodar os casos de teste no endereço publicado |
| É claro | Outra pessoa entende a tela sem explicação e o código tem comentários que explicam as regras? | Pedir a um colega para usar; abrir app.js e ler |
| Está versionado | Há commits pequenos com mensagens descritivas, PRD no repositório, push feito? | Abrir o histórico no GitHub Desktop |
| Está no ar | Endereço público com HTTPS, testado no celular? | Abrir no telefone, conferir o cadeado |

Um projeto que funciona mas não está versionado vai quebrar na próxima iteração sem volta. Um que está no ar mas não é claro vai gerar dúvidas da equipe toda semana. Os quatro critérios se protegem mutuamente.

## Erros comuns

- **Não calcular os casos de teste à mão.** Sem resultado esperado, não há teste; há olhada.
- **Ignorar os limites de faixa.** 30.000 e 30.000,01 são casos diferentes; teste os dois.
- **Deixar a IA misturar cálculo e tela.** A separação é o que permite testar e, depois, reaproveitar o cálculo em outro projeto.
- **Publicar sem testar no ar.** O endereço local e o publicado podem se comportar diferente.

## Na prática

A calculadora deste projeto virou, em um escritório, a página de orçamento do site: o visitante preenche, vê o valor estimado e clica em "Falar com o escritório", que já leva a composição no WhatsApp. O cálculo é o mesmo arquivo `app.js`, separado da tela desde o início; só a tela mudou. Versionado, publicado, e com cada regra comentada para o dia em que a tabela de honorários mudar.

## Resumo

- Especifique com PRD e critérios de aceite calculados à mão; eles são o seu roteiro de teste.
- Gere pedindo cálculo separado da tela, código comentado e dúvidas antes do código.
- Teste caso a caso, inclusive limites e erro; cada correção aprovada vira commit.
- Publique, teste no ar e no celular, configure o domínio.
- Rubrica: funciona, é claro, está versionado, está no ar; quatro sins ou não está pronto.
