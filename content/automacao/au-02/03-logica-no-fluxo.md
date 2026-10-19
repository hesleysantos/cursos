Nesta lição você vai dar inteligência ao fluxo: filtrar itens, criar caminhos diferentes com roteadores e condições, processar listas com iteradores e agregadores, guardar valores em variáveis e usar funções de texto, data e número. O exemplo condutor é separar clientes por regime tributário. Isso importa porque, sem lógica, o fluxo faz a mesma coisa para todo mundo; com lógica, ele toma as decisões que você tomaria.

## Filtros: deixar passar só o que interessa

Um **filtro** fica entre dois blocos e só deixa o item seguir se uma condição for verdadeira. Pense na **catraca**: só passa quem tem o cartão certo.

Exemplo: o fluxo de cadastro da lição anterior envia e-mail para todo mundo. Você quer enviar o e-mail de boas-vindas só quando o campo `regime` for "Simples Nacional":

```
[Formulário] -> (filtro: regime = "Simples Nacional") -> [Gmail]
```

Se a condição for falsa, o item para ali, sem erro. Filtros aceitam operadores: igual, diferente, contém, começa com, maior que, está vazio, existe. Ao comparar texto, cuidado com maiúsculas e espaços: "simples nacional " (com espaço no fim) é diferente de "Simples Nacional". Normalize antes (veja funções de texto abaixo).

## Roteadores e condições (IF)

O filtro só tem um caminho. Quando você precisa de **vários caminhos**, usa um **roteador** (Make) ou um nó **IF/Switch** (n8n). É a **bifurcação** da estrada: cada placa leva a um destino.

Separando clientes por regime:

```
[Formulário]
   -> [Roteador]
        rota 1: regime = "Simples Nacional"  -> [Planilha: aba Simples]  -> [E-mail modelo A]
        rota 2: regime = "Lucro Presumido"   -> [Planilha: aba Presumido] -> [E-mail modelo B]
        rota 3: regime = "Lucro Real"        -> [Planilha: aba Real]      -> [E-mail modelo C]
        rota 4: (padrão / senão)             -> [Alerta ao responsável: regime desconhecido]
```

A **rota padrão** (chamada *fallback*, *else* ou *otherwise*) recebe tudo que não casou com nenhuma condição. Sempre crie uma: é ela que captura o "MEI", o "simples" minúsculo ou o campo vazio que você não previu.

No n8n, o nó **IF** tem duas saídas (verdadeiro/falso) e o **Switch** tem várias; no Make, o roteador tem quantas rotas você quiser, cada uma com seu filtro. No Power Automate, é a ação "Condição" e o "Switch".

## Iteradores e agregadores: trabalhando com listas

Muitos módulos devolvem **uma lista** (vários itens de uma vez): "buscar linhas da planilha" devolve 60 clientes; "listar anexos" devolve três arquivos. Os blocos seguintes, porém, costumam trabalhar com **um item por vez**.

O **iterador** (*iterator*, *split in batches*, *loop*) pega a lista e dispara os blocos seguintes uma vez por item. Pense na **esteira do caixa**: as compras chegam numa cesta (lista) e o caixa passa uma de cada vez.

O **agregador** (*aggregator*, *merge*) faz o inverso: junta vários itens num só. Serve para montar um único e-mail com a lista de todos os clientes pendentes, em vez de 60 e-mails.

```
[Sheets: buscar linhas (60 clientes)]
   -> [Iterador]  (agora são 60 itens)
   -> (filtro: status = "pendente")
   -> [Agregador de texto: uma linha por cliente]
   -> [E-mail único para o responsável com a lista]
```

> **Atenção:** cada item do iterador faz os blocos seguintes rodarem, e cada rodada conta operações. 60 clientes × 3 blocos = 180 operações. Filtre o mais cedo possível para não processar o que não precisa.

## Variáveis

Uma **variável** guarda um valor para usar depois no fluxo: a competência do mês ("2026-03"), o nome da pasta, um contador. Em Make, há módulos "definir variável" e "obter variável"; em n8n, o nó **Set** (ou "Edit Fields") cria campos; em Power Automate, "Inicializar variável". Use variáveis para não repetir a mesma expressão em dez lugares: se a regra mudar, você altera uma vez.

## Funções de texto, data e número

Toda ferramenta tem um painel de funções para transformar campos. As que mais aparecem no escritório:

| Necessidade | Função típica (nome varia) | Exemplo |
|---|---|---|
| Tirar espaços das pontas | `trim` | `" Simples "` → `"Simples"` |
| Padronizar maiúsculas | `upper`, `lower` | `"simples"` → `"SIMPLES"` |
| Só dígitos do CNPJ | `replace` com expressão regular | `"12.345.678/0001-90"` → `"12345678000190"` |
| Substituir texto | `replace` (um para cada troca: "R$ " por nada, "." por nada, "," por ".") | `"R$ 1.234,56"` → `"1234.56"` |
| Data de hoje | `now` | `2026-03-20T09:12:00` |
| Formatar data | `formatDate` | `2026-03-20` → `20/03/2026` |
| Somar dias | `addDays` | vencimento + 5 |
| Primeiro dia do mês | combinação de `formatDate` e `parseDate` | `2026-03-01` |
| Converter texto em número | `parseNumber`, `toNumber` | `"1234.56"` → `1234.56` |
| Arredondar | `round` | `1234.567` → `1234.57` |

Uma condição robusta de regime fica assim: `lower(trim(regime)) = "simples nacional"`. Assim, "Simples Nacional", "simples nacional " e "SIMPLES NACIONAL" caem na mesma rota.

## Exemplo completo: separar clientes por regime

Objetivo: todo dia 1, ler a planilha de clientes e enviar, para cada regime, um e-mail diferente lembrando os documentos daquele mês.

1. Gatilho agendado: dia 1, 8h.
2. Google Sheets: buscar linhas da aba `clientes` (devolve lista).
3. Iterador: um cliente por vez.
4. Filtro: `ativo = true`.
5. Variável `regime_normalizado` = `lower(trim(regime))`.
6. Roteador com três rotas por regime e uma rota padrão que alerta o responsável.
7. Em cada rota: e-mail com o modelo certo, mapeando nome e e-mail do cliente.
8. Ao final de cada rota: adicionar linha na aba `log` com data, CNPJ, regime e "enviado".

Oito blocos, e o fluxo faz o que uma pessoa levaria uma manhã para fazer.

## Erros comuns

- Roteador sem rota padrão: itens que não casam somem sem aviso.
- Comparar texto sem `trim` e `lower`, e ver metade dos clientes cair na rota errada.
- Esquecer o iterador e tentar enviar um e-mail "para a lista inteira" num campo que espera um único endereço.
- Pôr o filtro depois de blocos caros, gastando operações à toa.
- Usar funções de data sem definir o fuso (lição 5).

## Na prática

Pegue o fluxo da lição 2 e acrescente: um campo "regime" no formulário, um roteador com três rotas e uma padrão, e um e-mail diferente por rota. Teste com os três regimes e com um valor inesperado ("MEI") para ver a rota padrão funcionar. Esse é o esqueleto de quase todo fluxo de comunicação segmentada do escritório.

## Resumo

- Filtro: deixa passar só o que satisfaz a condição; sem erro quando barra.
- Roteador / IF / Switch: vários caminhos; sempre com rota padrão.
- Iterador transforma lista em itens; agregador junta itens numa lista. Cada item consome operações.
- Variáveis evitam repetir expressões; funções de texto, data e número preparam os dados.
- Normalize antes de comparar: `lower(trim(campo))`.
