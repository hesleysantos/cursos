Neste projeto guiado você vai construir, do zero e com o Claude Code, um **conciliador bancário**: um script que cruza o extrato do banco (arquivo OFX ou CSV) com a planilha de lançamentos do escritório e aponta o que bateu, o que ficou sem par de cada lado e as diferenças. Tudo em sessões de 30 minutos, com especificação, testes, CLAUDE.md e commits. Ao final, você escreve a função central de casamento por data e valor e avalia o resultado com uma rubrica. Conciliação é a tarefa contábil que mais se beneficia de automação: repetitiva, regrada e cheia de pequenas exceções.

## O problema

De um lado, o extrato bancário: cada linha tem data, valor (negativo para débito) e histórico. Do outro, a planilha de lançamentos do escritório: data, valor, descrição e, às vezes, um número de documento. A conciliação responde três perguntas: quais lançamentos têm transação correspondente no banco, quais transações do banco não foram lançadas e quais lançamentos não aparecem no banco. A regra básica de casamento é **mesma data e mesmo valor**, com tolerância de alguns dias para compensação.

## Sessão 1: especificação e esqueleto (30 min)

Crie a pasta `conciliador`, inicie o Git, o ambiente virtual e o `CLAUDE.md`. Escreva `docs/especificacao.md` com o modelo da lição 1:

```text
OBJETIVO: Conciliar transações bancárias com lançamentos do escritório e gerar
relatório de conciliados, pendentes do banco e pendentes do escritório.
ENTRADAS: extrato em CSV (data;valor;historico) ou OFX; planilha lancamentos.xlsx
(aba Lancamentos: Data | Valor | Descricao | Documento).
SAÍDAS: conciliacao-AAAA-MM.xlsx com 3 abas: Conciliados, SoBanco, SoEscritorio.
CRITÉRIOS DE ACEITE:
- Casamento por data exata e valor exato; cada transação casa com no máximo um
  lançamento e vice-versa.
- Tolerância configurável de dias (padrão 0; opção --tolerancia 2).
- Valores comparados em centavos inteiros (sem erro de ponto flutuante).
- Com o exemplo exemplos/outubro: 41 conciliados, 3 só banco, 2 só escritório.
- Nunca altera os arquivos de entrada.
```

O `CLAUDE.md` do projeto, curto:

```markdown
# Conciliador bancário

Script Python 3.12 (Windows). Ambiente em .venv; rode testes com `pytest`.
- Regra de negócio em `conciliador/regras.py`, sem Excel nem arquivos.
- Leitura em `conciliador/leitura.py`; gravação em `conciliador/gravacao.py`.
- Valores sempre em centavos (int). Datas como `datetime.date`.
- TDD: testes antes da implementação; nunca alterar testes para passar.
- Dados de exemplo em `exemplos/`; nunca usar dados reais de clientes.
```

Peça o plano em passos ao Claude Code, aprove e faça o primeiro commit com a estrutura vazia, a especificação e o CLAUDE.md.

## Sessão 2: leitura do extrato (30 min)

CSV primeiro, porque é simples: `csv.DictReader` com `delimiter=";"`, data `dd/mm/aaaa` e valor com vírgula. Testes com `io.StringIO`, sem arquivo. OFX é um formato de texto com marcações; cada transação fica entre `<STMTTRN>` e `</STMTTRN>`, com `<DTPOSTED>` (data no formato `AAAAMMDD...`), `<TRNAMT>` (valor com ponto decimal) e `<MEMO>` (histórico). Peça ao Claude Code um leitor com regex para esse formato ou avalie a biblioteca `ofxparse`; em ambos os casos, exija testes com um trecho de OFX fixo no teste. As duas leituras devolvem a mesma estrutura: lista de dicionários `{"data": date, "centavos": int, "historico": str}`.

## Sessão 3: o casamento (30 min)

A função central, em `regras.py`, recebe as duas listas e devolve três listas. Ela é pura: sem arquivo, sem Excel, só dados. Peça os testes primeiro:

```text
Escreva testes para casar(banco, escritorio, tolerancia_dias=0) -> (conciliados,
so_banco, so_escritorio). Casos: par exato; valor igual e data diferente fora
da tolerância; dentro da tolerância; dois lançamentos iguais e uma transação
(só um casa); listas vazias; valor negativo. conciliados é lista de tuplas
(transacao, lancamento). Não implemente ainda.
```

Depois implemente, veja passar, refatore. O exercício de código desta lição é exatamente essa função, em versão simplificada.

## Sessão 4: gravação, linha de comando e entrega (30 min)

Gravação com `openpyxl` em três abas; `argparse` com `--extrato`, `--lancamentos`, `--saida`, `--tolerancia`; log em arquivo; `rodar.bat`; README e changelog. Rode com `exemplos/outubro` e confira os números do critério de aceite. Revisão crítica, segunda opinião, checklist, commit, versão 1.0.0.

## Rubrica de avaliação

Avalie o seu projeto (ou o de um colega) por estes critérios; cada um vale de 0 a 2 pontos:

| Critério | 0 | 1 | 2 |
| --- | --- | --- | --- |
| Especificação | Não existe | Objetivo e entradas | Critérios de aceite verificáveis com números |
| Testes | Nenhum | Só caminho feliz | Bordas: vazio, duplicado, tolerância, negativo |
| Separação | Tudo em um arquivo | Leitura separada | Regra pura sem arquivo, Excel só nas pontas |
| Dinheiro | Float com `==` | Float com arredondamento | Centavos inteiros |
| Git | Sem commits | Um commit final | Commits pequenos com mensagens que explicam |
| CLAUDE.md | Não existe | Genérico | Regras do projeto que o Claude seguiu |
| Entrega | Só o `.py` | README | README testado, requirements, `.bat`, changelog |

De 11 a 14 pontos: pronto para uso no escritório. De 7 a 10: funciona, mas vai dar trabalho para manter. Abaixo de 7: volte às sessões 1 e 3.

## Erros comuns

- Comparar valores em `float` e perder casamentos por `0.30000000000000004`.
- Deixar uma transação casar com dois lançamentos de mesmo valor.
- Tolerância de dias aplicada só para um lado (banco depois do escritório, nunca antes).
- Ler o OFX com `split` frágil que quebra quando o banco muda uma quebra de linha.
- Sobrescrever a planilha de lançamentos em vez de gravar em `saida/`.
- Usar extrato real de cliente em `exemplos/`.

## Na prática

Com o conciliador pronto, o fechamento mensal de um cliente passa de uma tarde de conferência a dez minutos: rodar, abrir a aba SoBanco (tarifas, juros e transações não lançadas), a aba SoEscritorio (lançamentos sem pagamento ou com valor errado) e resolver cada item. As evoluções naturais, feitas com o mesmo fluxo, são casamento por histórico quando o valor se repete e sugestão automática de lançamento para tarifas bancárias.

## Resumo

- Conciliação = casar transações e lançamentos por data e valor, com tolerância, e listar sobras dos dois lados.
- Quatro sessões: especificação e esqueleto; leitura CSV/OFX; casamento puro com TDD; gravação e entrega.
- Dinheiro em centavos inteiros; cada item casa no máximo uma vez.
- CLAUDE.md curto com as regras que o Claude deve seguir no projeto.
- A rubrica mede especificação, testes, separação, dinheiro, Git, CLAUDE.md e entrega.
