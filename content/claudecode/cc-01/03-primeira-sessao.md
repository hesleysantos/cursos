Nesta lição você vai fazer sua primeira sessão de verdade: abrir o Claude Code na pasta de um projeto, perguntar sobre o código, pedir uma alteração, ler o diff, aprovar e encerrar. Vai também entender o que é o **contexto** de uma conversa e por que a pasta em que você abre o programa muda tudo. Essa é a base de todo o resto do curso.

## Prepare um projeto pequeno

Crie uma pasta com um script simples para termos o que explorar. No PowerShell:

```powershell
mkdir C:\projetos\primeira-sessao
cd C:\projetos\primeira-sessao
```

Crie o arquivo `honorarios.py` com este conteúdo (pode usar o Bloco de Notas):

```python
clientes = {"Padaria Central": 850.0, "Oficina Silva": 1200.0, "Clínica Vida": 2300.0}

total = 0
for nome, valor in clientes.items():
    total = total + valor
print("Total de honorários:", total)
```

Agora, ainda nessa pasta, inicie o Claude Code:

```powershell
claude
```

## Por que a pasta importa

Quando você roda `claude`, a pasta atual vira a **pasta de trabalho**. A documentação explica que o Claude Code ganha acesso aos arquivos dessa pasta e subpastas (e a outras só com sua permissão), ao terminal e ao estado do Git. Tudo que ele lê ali entra no **contexto** da conversa: a "memória de trabalho" que o modelo enxerga a cada resposta — suas mensagens, os arquivos lidos, a saída dos comandos, o `CLAUDE.md`. Abrir na pasta certa é o que permite perguntar "o que este projeto faz?" e receber uma resposta sobre **o seu** projeto, não uma resposta genérica.

> **Atenção:** abrir na pasta errada tem dois custos: ele não acha seus arquivos, ou acha arquivos demais (incluindo coisas que não deveriam entrar na conversa).

## Perguntar sobre o código

Comece sem pedir mudanças. Digite:

```text
o que este projeto faz?
```

Ele vai ler a pasta — você verá linhas indicando que leu `honorarios.py` — e responder com um resumo. Perguntas que a documentação sugere para qualquer projeto novo: "quais tecnologias ele usa?", "onde está o ponto de entrada?", "explique a estrutura de pastas". Você não precisa colar o arquivo: a documentação destaca que ele **lê os arquivos conforme precisa**.

Peça algo mais específico:

```text
explique linha por linha o que honorarios.py faz e aponte o que poderia melhorar
```

## Pedir uma alteração e ler o diff

Agora um pedido pequeno e verificável:

```text
em honorarios.py, substitua o laço por sum() e formate o total com duas casas decimais e separador de milhar no padrão brasileiro
```

Antes de gravar, ele mostra a **proposta de alteração** como um **diff**: linhas removidas marcadas com `-` e linhas adicionadas com `+`. Em modo manual ele pergunta se pode aplicar; aparecem opções como aprovar uma vez, aprovar para o resto da sessão ou recusar. Leia o diff inteiro. Perguntas que você deve se fazer:

1. Ele mexeu **só** no que pedi?
2. Entendi cada linha nova? Se não, pergunte antes de aprovar.
3. O resultado é verificável? Aqui, basta rodar o script.

Se o diff estiver bom, escolha **Yes** (Sim). Em seguida peça a verificação:

```text
rode python honorarios.py e me mostre a saída
```

Ele pedirá permissão para executar o comando (rodar comandos é uma ação que exige aprovação em modo manual). A saída esperada é algo como `Total de honorários: R$ 4.350,00`.

A documentação do início rápido lembra que você pode trocar o modo de permissão a qualquer momento com **Shift+Tab**; veremos os modos em detalhe na próxima lição.

## Corrigir, limpar e sair

Se a alteração não ficou como você queria, diga em linguagem natural: "não era isso, mantenha o laço e só formate o número". É uma conversa; iterar é normal.

Para começar um assunto novo sem a bagagem da conversa anterior:

```text
/clear
```

O `/clear` esvazia o contexto e inicia uma conversa nova (a anterior fica salva e pode ser retomada com `/resume`). Para sair do programa:

```text
/exit
```

Ou pressione Ctrl+D duas vezes. Na próxima vez, `claude --continue` reabre a conversa mais recente daquela pasta.

## Erros comuns

- **Pedir mudança grande logo de cara** ("refaça o sistema de honorários"). Comece pequeno; você ainda está aprendendo a ler o que ele produz.
- **Aprovar o diff sem ler.** O diff é o seu ponto de controle.
- **Não verificar.** Depois de qualquer edição, rode o script ou um teste.
- **Esquecer o `/clear`.** Conversa longa e misturada piora as respostas.
- **Abrir o Claude Code em `C:\Users\Você`** e aceitar a confiança: ele passa a enxergar tudo.

## Na prática

Um fluxo de 10 minutos que vale a pena repetir toda vez que pegar um script antigo do escritório: abrir `claude` na pasta, pedir "o que este projeto faz e quais riscos você vê?", pedir uma melhoria pequena, ler o diff, aprovar, rodar, e encerrar com `/exit`. Em uma semana você estará confortável com o ritmo pergunta → proposta → diff → aprovação → verificação.

## Resumo

- `cd` até a pasta do projeto e `claude`: a pasta vira a pasta de trabalho e define o que ele enxerga.
- O **contexto** é tudo que o modelo vê na conversa: mensagens, arquivos lidos, saídas de comandos.
- Pergunte antes de mudar; peça mudanças pequenas; leia o **diff** antes de aprovar; verifique rodando.
- `/clear` começa uma conversa nova; `/exit` (ou Ctrl+D duas vezes) sai; `claude --continue` retoma.
