Nesta lição você vai extrair campos de notas fiscais, recibos e contratos com ajuda de modelos de linguagem: quando o PDF tem texto, quando é imagem e precisa de OCR, quais ferramentas de OCR existem (Tesseract e serviços de nuvem), como pedir os campos ao modelo e, o mais importante, como **validar depois**: CNPJ com dígitos corretos, soma dos itens batendo com o total, datas possíveis. Isso importa porque extrair errado é pior do que não extrair: um valor trocado entra na contabilidade com cara de certo.

## O fluxo completo

```
documento -> texto (camada de texto ou OCR) -> modelo com esquema de campos -> validação -> planilha/sistema
                                                                              -> fila de revisão (se falhar)
```

Cada seta é uma etapa com sua ferramenta. O modelo está no meio, não no fim: a palavra final é da validação.

## Texto ou imagem?

Na lição 4 do módulo 3 você viu que `pypdf` lê a camada de texto e devolve vazio quando a página é imagem. Esse é o teste:

```python
def tem_camada_de_texto(textos_das_paginas, minimo=50):
    """Recebe a lista de textos extraídos por página; True se há texto suficiente."""
    total = sum(len(t.strip()) for t in textos_das_paginas)
    return total >= minimo

print(tem_camada_de_texto(["NOTA FISCAL ELETRÔNICA Nº 1234 ... CNPJ 11.222.333/0001-81"]))
print(tem_camada_de_texto(["", " "]))
```

Saída: `True` e `False`. Com texto, siga direto para o modelo. Sem texto, OCR.

## OCR: Tesseract e serviços de nuvem

**OCR** (reconhecimento óptico de caracteres) transforma imagem em texto. Opções:

- **Tesseract** (gratuito, local): instale o programa no Windows, o pacote de idioma português (`por`) e a biblioteca `pytesseract`. O fluxo é converter cada página do PDF em imagem (`pymupdf` ou `pdf2image`) e chamar `pytesseract.image_to_string(imagem, lang="por")`. Funciona bem em documentos limpos e impressos; sofre com fotos tortas, carimbos e letra manuscrita.
- **Serviços de nuvem**: Google Document AI, Amazon Textract e Azure Document Intelligence recebem o PDF ou a imagem, devolvem texto com posição, tabelas e, em alguns casos, campos já identificados de notas e recibos. Cobram por página, acertam mais em documentos ruins e exigem atenção à LGPD (lição 8): o documento sai do seu computador.
- **Modelos multimodais**: os modelos de linguagem atuais aceitam imagem e PDF diretamente na mensagem. Para documentos de uma ou duas páginas, mandar a imagem e pedir os campos em JSON costuma ser mais simples do que OCR separado. Custa mais tokens por página; confira os limites de tamanho e de páginas na documentação.

Regra prática: comece com a camada de texto; se não houver, Tesseract para volume alto e documentos limpos, serviço de nuvem ou modelo multimodal para documentos difíceis.

## Pedir os campos ao modelo

Use o esquema da lição 2 com os campos do documento. Para uma nota fiscal de serviço:

```python
ESQUEMA_NFS = {
    "type": "object",
    "properties": {
        "numero": {"type": "string"},
        "data_emissao": {"type": "string", "description": "AAAA-MM-DD"},
        "prestador_cnpj": {"type": "string", "description": "somente dígitos"},
        "tomador_cnpj": {"type": "string"},
        "itens": {"type": "array", "items": {"type": "object",
                  "properties": {"descricao": {"type": "string"}, "valor": {"type": "number"}},
                  "required": ["descricao", "valor"]}},
        "valor_total": {"type": "number"},
        "iss_retido": {"type": "boolean"},
    },
    "required": ["numero", "data_emissao", "prestador_cnpj", "itens", "valor_total"],
}
```

Na instrução, diga para copiar valores **como estão no documento**, não inventar o que não existe (usar `null`), e converter formatos (vírgula decimal, data brasileira) só na saída. Quanto mais o esquema descreve (`description`), menos ambiguidade.

## Pós-validação: a etapa que salva

O modelo pode trocar um dígito, confundir prestador com tomador ou ler `1.234,56` como `123456`. Regras de negócio pegam isso:

**1. CNPJ com dígitos verificadores válidos.** Os dois últimos dígitos são calculados a partir dos outros doze. Desde julho de 2026 a Receita Federal também emite CNPJs **alfanuméricos** (letras maiúsculas nas doze primeiras posições: as oito da raiz e as quatro da ordem); o cálculo usa o valor de cada caractere (código ASCII menos 48, o que dá 0 a 9 para dígitos e 17 a 42 para letras), e os dois dígitos verificadores continuam numéricos.

```python
import re

def cnpj_valido(cnpj):
    cnpj = re.sub(r"[^0-9A-Za-z]", "", str(cnpj)).upper()
    if len(cnpj) != 14 or not cnpj[12:].isdigit() or len(set(cnpj)) == 1:
        return False
    valores = [ord(c) - 48 for c in cnpj[:12]]
    def digito(seq, pesos):
        soma = sum(v * p for v, p in zip(seq, pesos))
        resto = soma % 11
        return 0 if resto < 2 else 11 - resto
    d1 = digito(valores, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2])
    d2 = digito(valores + [d1], [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2])
    return cnpj[12:] == f"{d1}{d2}"

print(cnpj_valido("11.222.333/0001-81"))   # True
print(cnpj_valido("11.222.333/0001-82"))   # False
print(cnpj_valido("12.ABC.345/01DE-35"))   # True (exemplo alfanumérico da Receita)
```

**2. Soma dos itens bate com o total** (com tolerância de centavos):

```python
def itens_batem(itens, valor_total, tolerancia=0.01):
    soma = sum(float(i["valor"]) for i in itens)
    return abs(soma - float(valor_total)) <= tolerancia

print(itens_batem([{"valor": 100.0}, {"valor": 34.56}], 134.56))   # True
print(itens_batem([{"valor": 100.0}, {"valor": 34.56}], 1345.6))   # False
```

**3. Datas possíveis**: emissão não pode ser no futuro nem anterior a, digamos, 2000; vencimento não pode ser antes da emissão. **4. Cruzamento com cadastro**: o CNPJ do tomador deve ser o de um cliente do escritório; se não for, o documento provavelmente é de outra pessoa ou foi lido errado. **5. Campos obrigatórios não nulos** para o tipo de documento.

Qualquer regra que falhe manda o documento para a fila de revisão com o motivo. O que passa em todas entra no sistema com um marcador "extraído automaticamente" até alguém conferir por amostragem (lição 8).

## Erros comuns

- Pular o OCR em PDF escaneado e mandar texto vazio ao modelo: ele inventa uma nota inteira.
- Aceitar CNPJ só porque tem 14 dígitos: dígito trocado passa; validar o verificador pega.
- Comparar soma de itens com `==` em float: use tolerância.
- Mandar contrato de 60 páginas inteiro para extrair três cláusulas: localize as páginas certas com busca de texto antes.
- Esquecer que CNPJ pode ter letras desde 2026 e rejeitar documentos válidos com `isdigit()`.

## Na prática

Um escritório recebe por e-mail 400 notas de serviço por mês de 30 clientes. O robô baixa os anexos (módulo 3), testa a camada de texto, roda OCR nos escaneados, pede os campos ao modelo com esquema, valida CNPJ, soma e datas, cruza o tomador com o cadastro e grava na planilha de lançamentos. Cerca de 8% caem na revisão; o resto entra sem digitação. A conferência por amostragem de 5% mantém a confiança no processo.

## Resumo

- Fluxo: texto (camada ou OCR) → modelo com esquema → validação → destino ou revisão.
- Sem camada de texto, OCR: Tesseract local, serviços de nuvem ou modelo multimodal, cada um com custo e cuidado com LGPD.
- Esquema com `description` reduz ambiguidade; peça `null` para o que não existe.
- Valide com regras de negócio: dígitos do CNPJ (inclusive alfanumérico), soma dos itens, datas, cadastro.
- O modelo propõe; a validação e a amostragem humana decidem.
