Neste projeto guiado você vai criar do zero, **só conversando com o Claude Code**, um script Python que organiza PDFs de notas fiscais em pastas por competência (ano-mês). Vai aplicar tudo do módulo: abrir na pasta certa, pedir em etapas pequenas, planejar, ler diffs, verificar com testes e encerrar com segurança. Ao final, você terá uma automação real para o escritório e uma rubrica para avaliar seu próprio trabalho.

## O problema

Todo mês chegam PDFs com nomes variados: `NF_1234_2026-03-15.pdf`, `nota 98 15-03-2026.pdf`, `Recibo.pdf`. Queremos que o script leia a pasta `entrada`, descubra a competência pelo nome (datas no formato `AAAA-MM-DD` ou `DD-MM-AAAA`, com `-` ou `_`), mova cada arquivo para `organizado/AAAA-MM/` e deixe os que não têm data em `organizado/sem_competencia/`. Regra de negócio: a competência é a **data que aparece no nome**.

## Etapa 0: preparar a pasta

```powershell
mkdir C:\projetos\organizador-notas
cd C:\projetos\organizador-notas
git init
claude --permission-mode plan
```

Começar em modo plan garante que nada será editado antes de você aprovar um plano. Confirme a confiança na pasta quando perguntado.

## Etapa 1: o plano

Prompt:

```text
Quero um script Python chamado organizador.py, só com a biblioteca padrão, que:
1. leia os PDFs da pasta "entrada";
2. extraia a competência "AAAA-MM" do nome do arquivo (formatos 2026-03-15, 15-03-2026 e 15_03_2026);
3. mova cada arquivo para "organizado/AAAA-MM/"; sem data, para "organizado/sem_competencia/";
4. imprima um resumo: quantos arquivos por competência.
Separe a lógica em funções pequenas: extrair_competencia(nome) e agrupar_por_competencia(nomes).
Monte um plano com a estrutura de arquivos e as funções antes de escrever código.
```

**O que verificar:** o plano cita as duas funções com esses nomes? Propõe uma pasta `testes/`? Usa só `pathlib`, `re` e `shutil` (biblioteca padrão)? Se faltar algo, responda "No, keep planning" e ajuste. Quando estiver bom, aprove com "Yes, manually approve edits".

## Etapa 2: a função pura primeiro

```text
Comece só por extrair_competencia(nome). Exemplos obrigatórios:
"NF_1234_2026-03-15.pdf" -> "2026-03"
"nota 98 15-03-2026.pdf" -> "2026-03"
"rec_05_12_2025.pdf" -> "2025-12"
"Recibo.pdf" -> None
Crie também testes/test_organizador.py com esses casos usando apenas unittest, e rode
python -m unittest -v. Não mova arquivos ainda.
```

**O que verificar no diff:** a expressão regular aceita `-` e `_` como separadores; o caso `DD-MM-AAAA` devolve ano e mês na ordem certa (`2026-03`, não `03-2026`); o retorno sem data é `None`. **O que verificar na saída:** os testes passaram (`OK` no final). Se um falhar, peça "corrija e rode de novo".

## Etapa 3: agrupar

```text
Agora agrupar_por_competencia(nomes): recebe uma lista de nomes de arquivo e devolve um
dicionário {competencia: [nomes]}, usando "sem_competencia" como chave para os sem data.
Acrescente testes e rode.
```

**Verificar:** a chave para arquivos sem data é exatamente `"sem_competencia"`; a função não mexe no disco.

## Etapa 4: mover arquivos e resumo

```text
Implemente a função principal que lê "entrada", usa as duas funções, cria as pastas com
pathlib (parents=True, exist_ok=True), move com shutil.move e imprime o resumo. Antes de
mover de verdade, adicione a opção --simular que só imprime o que faria. Rode com --simular
numa pasta "entrada" com três PDFs vazios de exemplo que você mesmo criar.
```

**Verificar:** o modo `--simular` não altera nada (confira a pasta); o resumo mostra as competências certas; arquivos com o mesmo nome em competências diferentes não se sobrescrevem (pergunte: "o que acontece se dois arquivos tiverem o mesmo nome?").

## Etapa 5: rodar de verdade e revisar

Rode sem `--simular`, confira as pastas criadas e peça uma revisão:

```text
Revise organizador.py como se fosse um colega: riscos, casos não tratados, o que você
mudaria. Não edite nada ainda, só liste.
```

Decida o que vale a pena e peça uma mudança por vez. Encerre com `/rename organizador-notas` e `/exit`. No módulo 2 este mesmo projeto ganha `CLAUDE.md`, pytest, branch e pull request.

## Como testar sozinho

Crie arquivos vazios com nomes variados no PowerShell (`New-Item entrada\NF_1_2026-03-15.pdf`), inclua um sem data e um com data inválida (`32-13-2026`), e observe se o script trata cada um. Um caso difícil que vale experimentar: um número de nota com quatro dígitos antes de uma data brasileira, como `NF_1234_15-03-2026.pdf`. Se o script devolver `1234-15`, a expressão regular do formato `AAAA-MM-DD` está casando o número da nota como se fosse o ano; mostre o caso ao Claude e peça a correção. Depois rode `python -m unittest -v` e confirme que tudo passa.

## Erros comuns

- Pedir o script inteiro numa mensagem só: você recebe um diff grande e não consegue verificar nada.
- Esquecer o `--simular`: mover arquivos reais na primeira execução.
- Aceitar `03-2026` como competência por não ler o teste.
- Deixar o agente instalar bibliotecas de terceiros quando a biblioteca padrão resolve.
- Testar só com nomes "bonitos": os nomes reais têm espaços, acentos e maiúsculas.

## Rubrica de avaliação

| Critério | Insuficiente | Bom | Excelente |
| --- | --- | --- | --- |
| Pedidos | Um pedido gigante | Etapas, com exemplos | Etapas, exemplos, critério de aceite e restrições |
| Verificação | Só olhou o diff | Rodou os testes | Testes + simulação + casos estranhos |
| Permissões | Tudo em auto/bypass | Plan no início, manual nas edições | Plan, manual e revisão de cada comando |
| Resultado | Move errado ou sobrescreve | Organiza corretamente | Organiza, trata colisão e sem data, resumo claro |
| Sessão | Uma conversa sem nome | Nomeou e encerrou | Nomeou, compactou/limpou quando preciso |

## Na prática

Esse script é o mesmo padrão de dezenas de rotinas de escritório: extratos por mês, guias por cliente, recibos por competência. Mude a regra de extração e a pasta de destino, e o resto se mantém. Guarde o projeto: ele será a base do projeto guiado do módulo 2.

## Resumo

- Comece em modo plan, aprove o plano, depois edite em modo manual.
- Construa em etapas: função pura → testes → agrupamento → movimentação com `--simular` → execução real.
- Verifique cada etapa pelo diff **e** pela saída dos testes.
- Peça uma revisão crítica ao final e aplique uma mudança por vez.
- Nomeie a sessão e guarde o projeto para o módulo 2.
