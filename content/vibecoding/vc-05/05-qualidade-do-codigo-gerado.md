Nesta lição você vai aprender a garantir que o código gerado pela IA funciona de verdade, e não só na demonstração: ler o mínimo necessário, pedir **testes automatizados** e executá-los, usar uma segunda IA como revisora, refatorar e reconhecer **dívida técnica**. Isso importa porque a IA produz código com confiança igual quando está certa e quando está errada. Quem não testa descobre o erro pelo cliente.

## Ler o que a IA escreveu: o mínimo

Você não precisa entender cada linha. Precisa saber **onde olhar**. Ao receber um bloco de código, faça três perguntas:

1. **Que funções existem e o que cada uma promete?** Nomes como `calcularMulta`, `gerarFaturas`, `exportarCsv` devem bater com o PRD. Nome vago (`processar`, `handleData`) é sinal de que a IA não entendeu a tarefa.
2. **Onde estão as regras de negócio?** Procure os `if`. Cada regra do PRD ("atrasada se vencimento < hoje e status aberta") deve aparecer em algum `if`; se não aparece, não foi implementada.
3. **O que acontece no erro?** Procure `try`, `catch`, `except`, mensagens. Se o único caminho é o feliz, o app vai travar na primeira surpresa.

Peça à IA que facilite: *"explique este arquivo em 5 bullets, apontando onde está cada regra do PRD"*. Depois confira se o que ela diz bate com o que você lê.

## Testes automatizados: o que são e por que a IA deve escrevê-los

Um **teste automatizado** é um programa que chama o seu código com entradas conhecidas e confere se a saída é a esperada. Em Python, a forma mais simples é o `assert`:

```python
def calcular_multa(valor, dias_atraso):
    """Multa de 2% fixa + 0,033% ao dia (1% ao mês), só se houver atraso."""
    if dias_atraso <= 0:
        return 0.0
    multa = valor * 0.02
    juros = valor * 0.00033 * dias_atraso
    return round(multa + juros, 2)

# testes
assert calcular_multa(1000, 0) == 0.0, "sem atraso não há multa"
assert calcular_multa(1000, 1) == 20.33, "1 dia: 2% + 0,033%"
assert calcular_multa(1000, 30) == 29.9, "30 dias: 2% + 0,99%"
assert calcular_multa(0, 10) == 0.0, "valor zero gera multa zero"
print("todos os testes passaram")
```

Se um `assert` falhar, o Python para com `AssertionError` e a mensagem. Se tudo passa, você tem **prova**, não impressão, de que a função faz o que o PRD manda — e pode mudar o código amanhã e rodar os testes de novo em segundos.

Nos projetos em JavaScript, a ferramenta de teste mais comum é o **Vitest** (ou Jest); em Python, o **pytest**. Você não precisa configurá-los: peça.

```text
Para a função gerarFaturas, escreva testes automatizados que cubram:
- contrato ativo gera uma fatura por competência;
- contrato inativo não gera nada;
- competência já existente não duplica;
- dia de vencimento 31 em mês de 30 dias usa o último dia.
Use Vitest. Me diga o comando para rodar e o que devo ver.
```

Cada **caso de borda** do PRD vira um teste. Depois, rode o comando (`npm test` ou `pytest`) e leia o resultado: verde passou, vermelho falhou. Se falhou, cole a saída na IA e peça a correção — do código, não do teste, a não ser que o teste esteja errado em relação ao PRD.

## Revisão com outra IA

Modelos diferentes erram de jeitos diferentes. Uma prática barata e eficaz: pedir a **uma segunda IA** (outro provedor ou outro modelo) que revise o código gerado pela primeira.

```text
Revise este código como um desenvolvedor sênior. Procure: bugs lógicos,
casos não tratados, problemas de segurança (dados do usuário sem
validação, chaves expostas), e desvios em relação ao PRD abaixo.
Liste os problemas por gravidade, com a linha e a correção sugerida.
Não reescreva o arquivo inteiro.
[código] [PRD]
```

Leve a lista de volta para a primeira IA ou corrija na segunda. Você não precisa saber quem está certa: os testes decidem.

## Refatorar sem medo

**Refatorar** é melhorar a estrutura do código sem mudar o que ele faz: dividir uma função gigante em pequenas, renomear, remover duplicação. Com testes, refatorar é seguro: se depois da mudança tudo continua verde, nada quebrou. Sinais de que é hora:

- Uma função com mais de 50 linhas ou com cinco níveis de `if` aninhados.
- O mesmo trecho copiado em três lugares.
- Um arquivo que você evita abrir.

Prompt: *"Refatore `gerarFaturas` em funções menores com nomes claros, sem alterar o comportamento. Os testes existentes devem continuar passando."*

## Dívida técnica

**Dívida técnica** é o atalho que você toma hoje e paga com juros depois: a validação que ficou só no frontend, o cálculo copiado em dois lugares, o "TODO: tratar erro" esquecido. No vibe coding ela se acumula rápido, porque a IA entrega rápido. Não é pecado ter dívida; é pecado não anotá-la. Mantenha um arquivo `DIVIDAS.md` no projeto com o que ficou pendente e por quê, e reserve uma sessão por mês para pagar as mais perigosas (segurança e dados primeiro).

## Erros comuns

- Pedir testes e nunca rodá-los.
- Aceitar que a IA "ajuste o teste" para passar, em vez de corrigir o código.
- Testar só o caminho feliz: `calcular_multa(1000, 10)` e pronto.
- Confiar na frase "testei e está funcionando" da IA — ela não rodou nada a menos que a ferramenta execute código de fato.
- Refatorar sem testes e descobrir a quebra uma semana depois.

## Na prática

Antes de entregar o módulo de faturas ao escritório, o contador roda `npm test` e vê 18 testes verdes, incluindo os de vencimento em fevereiro. Manda o código para uma segunda IA, que aponta que o status "atrasada" nunca é recalculado ao abrir o painel. Ele anota, pede a correção, roda os testes de novo. Vinte minutos que evitam uma cobrança indevida.

## Resumo

- Leia o mínimo: nomes das funções, os `if` das regras, o tratamento de erro.
- Testes automatizados (`assert`, Vitest, pytest) provam que o código faz o que o PRD manda; cada caso de borda vira um teste.
- Rode os testes de verdade; corrija o código, não o teste.
- Uma segunda IA revisando a primeira encontra erros diferentes.
- Refatore com testes verdes; anote a dívida técnica e pague a perigosa primeiro.
