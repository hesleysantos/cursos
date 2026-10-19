# Documentos fiscais e integrações contábeis

Nesta lição você vai aprender a estrutura dos documentos que circulam todo dia no escritório, o XML da **NF-e** e da **NFS-e**, os arquivos do **SPED**, e os **layouts de importação** dos sistemas contábeis, e a extrair deles o que importa com Python. Ao final, você vai escrever uma função que lê um XML de NF-e com `xml.etree` e devolve os campos principais, com as validações que evitam lançar nota errada.

## NF-e: o XML que vale como documento

A Nota Fiscal Eletrônica (modelo 55) é um arquivo XML assinado digitalmente e autorizado pela SEFAZ. O PDF (DANFE) é só uma representação; o XML é o documento. Ele segue um esquema público (a versão atual do layout é a 4.00, com as adaptações em curso para os grupos de IBS/CBS da reforma tributária) e tem uma hierarquia estável:

```
nfeProc
  NFe
    infNFe (Id="NFe" + 44 dígitos da chave, versao="4.00")
      ide    -> nNF (número), serie, dhEmi (data/hora), natOp, mod
      emit   -> CNPJ, xNome, IE
      dest   -> CNPJ ou CPF, xNome
      det (um por item, atributo nItem)
        prod -> cProd, xProd, NCM, CFOP, uCom, qCom, vUnCom, vProd
        imposto -> ICMS, IPI, PIS, COFINS
      total
        ICMSTot -> vBC, vICMS, vProd, vFrete, vDesc, vNF
  protNFe -> infProt -> nProt (protocolo), cStat (100 = autorizada)
```

Um detalhe que derruba iniciantes: todos os elementos estão em um **namespace** (`http://www.portalfiscal.inf.br/nfe`). Ao buscar com `xml.etree`, você precisa informá-lo, senão nada é encontrado.

```python
import xml.etree.ElementTree as ET

XML = """<?xml version="1.0" encoding="UTF-8"?>
<nfeProc xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
  <NFe>
    <infNFe Id="NFe35260911222333000181550010000012341000012345" versao="4.00">
      <ide><nNF>1234</nNF><serie>1</serie><dhEmi>2026-09-15T10:20:00-03:00</dhEmi><natOp>Venda</natOp></ide>
      <emit><CNPJ>11222333000181</CNPJ><xNome>Padaria Sol Ltda</xNome></emit>
      <dest><CNPJ>99888777000166</CNPJ><xNome>Mercado Lua</xNome></dest>
      <det nItem="1"><prod><cProd>P1</cProd><xProd>Pao frances</xProd><NCM>19059090</NCM><CFOP>5102</CFOP><qCom>100.0000</qCom><vProd>850.00</vProd></prod></det>
      <det nItem="2"><prod><cProd>P2</cProd><xProd>Bolo</xProd><NCM>19059090</NCM><CFOP>5102</CFOP><qCom>10.0000</qCom><vProd>350.00</vProd></prod></det>
      <total><ICMSTot><vProd>1200.00</vProd><vDesc>0.00</vDesc><vNF>1200.00</vNF></ICMSTot></total>
    </infNFe>
  </NFe>
  <protNFe><infProt><cStat>100</cStat><nProt>135260000123456</nProt></infProt></protNFe>
</nfeProc>"""

NS = {"nfe": "http://www.portalfiscal.inf.br/nfe"}
raiz = ET.fromstring(XML)
inf = raiz.find(".//nfe:infNFe", NS)
chave = inf.get("Id")[3:]
numero = inf.findtext("nfe:ide/nfe:nNF", namespaces=NS)
emitente = inf.findtext("nfe:emit/nfe:xNome", namespaces=NS)
valor = float(inf.findtext("nfe:total/nfe:ICMSTot/nfe:vNF", namespaces=NS))
itens = [(d.findtext("nfe:prod/nfe:xProd", namespaces=NS), float(d.findtext("nfe:prod/nfe:vProd", namespaces=NS)))
         for d in inf.findall("nfe:det", NS)]
status = raiz.findtext(".//nfe:cStat", namespaces=NS)
print(chave, numero, emitente, valor, status)
print(itens)
# 35260911222333000181550010000012341000012345 1234 Padaria Sol Ltda 1200.0 100
# [('Pao frances', 850.0), ('Bolo', 350.0)]
```

Pontos de atenção: valores vêm como texto com ponto decimal (converta com `float` ou, para dinheiro, `Decimal`); a chave tem 44 dígitos e começa com o código da UF e AAMM de emissão; `cStat` 100 é autorizada (150, autorizada fora de prazo), 110 denegada e 101 indica cancelamento. Só que o cancelamento de uma nota já autorizada é registrado como **evento**, em um XML separado (`procEventoNFe`, assim como a carta de correção), e o `protNFe` da nota continua dizendo 100: para saber se a nota está cancelada, é preciso ler os eventos ou consultar a situação na SEFAZ, não só o protocolo. Para arquivos grandes em lote, `ET.iterparse` evita carregar tudo na memória.

Validações mínimas antes de lançar: a chave tem 44 dígitos numéricos; o CNPJ do destinatário é o do cliente (nota de entrada) ou o emitente é o cliente (saída); a soma dos `vProd` dos itens bate com `vProd` do total (descontos e frete explicam diferenças com `vNF`); a nota não está cancelada; e a chave ainda não foi lançada (duplicidade é o erro mais comum).

## NFS-e: o caso mais bagunçado

Notas de serviço são municipais. Cada prefeitura tinha seu layout (a maioria seguindo o padrão ABRASF, com variações). Desde 2023 existe o **padrão nacional da NFS-e** (gov.br), ao qual os municípios vêm aderindo, com XML e API próprios, mas a transição é gradual: em 2026 você ainda encontra os dois mundos. A estratégia prática: escreva um extrator por layout, devolvendo sempre o mesmo dicionário (`prestador`, `tomador`, `numero`, `data`, `valor_servico`, `iss`, `codigo_servico`), e trate cada município novo como um "adaptador". Nunca suponha que o campo se chama igual em duas cidades.

## SPED: texto delimitado por barras

Os arquivos do SPED (EFD ICMS/IPI, EFD-Contribuições, ECD, ECF) são texto puro, uma linha por registro, campos separados por `|`, começando e terminando com barra:

```
|0000|020|0|01092026|30092026|PADARIA SOL LTDA|11222333000181||SP|...|
|C100|1|0|...|55|00|1|1234|35260911222333000181550010000012341000012345|15092026|15092026|1200,00|...|
|C170|1|P1|Pao frances|100|UN|850,00|...|
```

O primeiro campo é o código do registro (`0000` abertura, `C100` nota, `C170` item, `M200` apuração de PIS na EFD-Contribuições, `9999` encerramento). No `0000`, o segundo campo é o código da versão do leiaute, que muda todo ano (na EFD ICMS/IPI, `020` para 2026); confira a tabela vigente antes de gerar ou validar um arquivo. Campo vazio aparece como duas barras seguidas (acima, o CPF vazio depois do CNPJ). Diferente do XML, aqui os decimais usam **vírgula** e as datas vêm como DDMMAAAA. O leiaute de cada registro está no Guia Prático da Receita; o campo certo depende da posição, então conte com cuidado.

```python
linha = "|C100|1|0|F001|55|00|1|1234|35260911222333000181550010000012341000012345|15092026|15092026|1200,00|\n"
campos = linha.strip()[1:-1].split("|")   # tira a quebra de linha e UMA barra de cada ponta
print(campos[0], campos[7], campos[8][:10] + "...", campos[11].replace(",", "."))
# C100 1234 3526091122... 1200.00
```

Não use `strip("|")` para tirar as barras das pontas: se o último campo estiver vazio (`...|1200,00||`), ele apagaria as duas barras finais e o campo vazio sumiria, deslocando a contagem.

Uma conferência clássica: somar os `vNF` dos XMLs do mês e comparar com a soma do campo de valor dos registros `C100` da EFD. Divergência indica nota faltando ou duplicada.

## Layouts de importação dos sistemas contábeis

Cada sistema (Domínio, Alterdata, Fortes, Contmatic) tem leiautes para receber lançamentos. Há dois tipos:

- **Posicionais**: cada campo ocupa colunas fixas (por exemplo, data nas posições 1 a 10, valor nas 11 a 25). O lançamento em lote do Domínio é assim, com registros numerados (cabeçalho, lançamento, histórico, encerramento). Um caractere a mais desloca tudo; use `str.ljust`/`rjust` e teste com uma linha.
- **Delimitados** (CSV, planilha): mais tolerantes; o sistema mapeia colunas na importação.

Independentemente do tipo, o fluxo é: extrair dos documentos, montar o lançamento (data, débito, crédito, valor, histórico), **validar** (contas existem no plano, valor maior que zero, data na competência) e só então gerar o arquivo. O arquivo de importação é a fronteira em que um erro se multiplica por centenas de linhas, então a validação vem antes.

## Armadilhas

- **Esquecer o namespace** no `xml.etree`: `find` devolve `None` e você acha que o campo não existe.
- **Converter vírgula e ponto errado**: XML usa ponto; SPED e Excel brasileiro usam vírgula.
- **Somar `vProd` e esperar `vNF`**: descontos, frete, IPI e ST entram na conta.
- **Lançar XML cancelado**: confira `cStat` e os eventos.
- **Supor que a NFS-e de uma cidade serve para outra**.
- **Gerar arquivo posicional sem testar uma linha** no sistema de destino.

## Na prática

Um escritório recebe por e-mail e pelo web service da SEFAZ cerca de 3.000 XMLs por mês. Um script lê cada arquivo com `xml.etree`, valida chave, destinatário, status e duplicidade, grava os campos num banco SQLite e gera o arquivo de importação para o sistema contábil, no leiaute do sistema, por cliente. Os que falham na validação (destinatário errado, nota cancelada, chave repetida) vão para uma pasta de pendências com o motivo. Antes, dois funcionários digitavam notas; hoje, um revisa pendências.

## Resumo

- A NF-e é um XML com namespace e hierarquia fixa (infNFe, ide, emit, dest, det/prod, total/ICMSTot, protNFe); extraia com `xml.etree` informando o namespace.
- Valide chave, destinatário, status, soma dos itens e duplicidade antes de lançar.
- NFS-e varia por município; o padrão nacional avança, mas em 2026 convivem vários layouts: um adaptador por layout.
- SPED é texto delimitado por `|`, com vírgula decimal e data DDMMAAAA; o código do registro é o primeiro campo.
- Sistemas contábeis importam por layouts posicionais ou delimitados; valide antes de gerar o arquivo.
