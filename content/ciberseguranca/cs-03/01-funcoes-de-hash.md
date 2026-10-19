# Funções de hash

Nesta lição você vai entender o que é uma **função de hash**, por que ela é a peça mais usada de toda a criptografia e como aplicá-la no dia a dia: conferir se um instalador baixado é o original, provar que um arquivo do SPED não foi alterado depois da entrega e entender por que MD5 e SHA-1 viraram sinônimo de "não use mais". Ao final, você calcula hashes em Python e sabe o que faz um hash ser bom ou ruim.

## O que é um hash

Uma função de hash recebe qualquer quantidade de dados (uma palavra, um PDF de 300 páginas, um arquivo de 2 GB) e devolve uma sequência de tamanho fixo, chamada **digest** ou simplesmente "o hash". Para o SHA-256, essa sequência tem sempre 256 bits, mostrados como 64 caracteres hexadecimais.

A analogia mais útil é a **impressão digital**. Ela não contém a pessoa inteira, mas identifica a pessoa com altíssima confiança. Da mesma forma, o hash não contém o arquivo, mas identifica aquele arquivo: mude uma vírgula no documento e a impressão digital muda por completo.

```bash
$ echo -n "Totali Contabilidade" | sha256sum
9d1ca929552c948b...   (64 caracteres no total)
$ echo -n "Totali Contabilidade." | sha256sum
0deeb51fc969c634...   (completamente diferente por causa de um ponto)
```

## As quatro propriedades que importam

Para servir à segurança, uma função de hash precisa de quatro propriedades:

| Propriedade | O que significa | Por que importa |
|---|---|---|
| Determinística | A mesma entrada sempre gera o mesmo hash | Permite comparar hoje com o hash gravado ontem |
| Rápida de calcular | Um arquivo grande leva frações de segundo | Viável para uso em massa |
| Unidirecional (pré-imagem) | Do hash não se recupera a entrada | O hash pode ser publicado sem expor o conteúdo |
| Resistente a colisão | É inviável achar duas entradas com o mesmo hash | Ninguém consegue "trocar" um documento por outro de mesmo hash |

Há ainda o **efeito avalanche**: uma alteração mínima na entrada muda cerca de metade dos bits da saída. É por isso que os dois hashes do exemplo acima não se parecem em nada.

> **Atenção:** hash não é criptografia. Criptografar é um caminho de ida e volta (quem tem a chave decifra). Hash é um caminho só de ida: não existe "deshashear". Essa confusão aparece até em contratos de software.

## Hash em Python

A biblioteca padrão traz o módulo `hashlib`. Hash funciona sobre bytes, então o texto precisa ser codificado antes (`encode()`):

```python
import hashlib

texto = "Totali Contabilidade"
h = hashlib.sha256(texto.encode("utf-8")).hexdigest()
print(len(h), h[:16])
# 64 9d1ca929552c948b

# Para arquivos grandes, lê-se em pedaços para não encher a memória:
def hash_arquivo(caminho):
    h = hashlib.sha256()
    with open(caminho, "rb") as f:
        for bloco in iter(lambda: f.read(65536), b""):
            h.update(bloco)
    return h.hexdigest()
```

O método `update()` permite alimentar a função aos poucos; o resultado é o mesmo que calcular tudo de uma vez.

## SHA-256 vs MD5 vs SHA-1: por que os antigos morreram

| Algoritmo | Ano | Tamanho | Situação em 2026 |
|---|---|---|---|
| MD5 | 1992 | 128 bits (32 hex) | Quebrado: colisões geradas em segundos num notebook |
| SHA-1 | 1995 | 160 bits (40 hex) | Quebrado: colisão prática demonstrada em 2017 (projeto SHAttered) |
| SHA-256 (família SHA-2) | 2001 | 256 bits (64 hex) | Padrão atual; usado em TLS, Bitcoin, ICP-Brasil |
| SHA-3 | 2015 | 224 a 512 bits | Alternativa com construção interna diferente; ainda pouco usado |

Uma **colisão** é quando duas entradas diferentes produzem o mesmo hash. Em tese toda função de hash tem colisões (há infinitas entradas e saídas finitas), mas num algoritmo seguro encontrá-las é inviável mesmo com todos os computadores do planeta. O MD5 e o SHA-1 perderam essa garantia: pesquisadores conseguem fabricar dois arquivos diferentes, por exemplo dois PDFs com textos distintos, que têm o mesmo hash. Se a assinatura de um contrato dependesse do hash SHA-1, seria possível assinar um documento e depois apresentar outro, "igualmente assinado".

Por isso navegadores, autoridades certificadoras e a ICP-Brasil abandonaram SHA-1 nas assinaturas. MD5 ainda aparece em sistemas antigos como mero "verificador de download", mas para qualquer fim de segurança está proibido.

## Integridade de arquivos: o uso mais comum

Quando você baixa um instalador, o site sério publica ao lado o hash SHA-256 do arquivo. Depois do download, você calcula o hash localmente e compara. Se bater, o arquivo que chegou é idêntico ao que o fornecedor publicou; se não bater, houve corrupção no download ou alguém adulterou o arquivo no caminho.

```bash
# Windows (PowerShell)
Get-FileHash .\instalador.exe -Algorithm SHA256

# Linux / macOS
sha256sum instalador.exe
```

Para um escritório contábil, isso aparece em dois lugares. Primeiro, ao instalar programas da Receita, do eSocial ou do sistema contábil: conferir o hash evita instalar uma versão trojanizada distribuída por um site falso. Segundo, nos arquivos do SPED: o recibo de transmissão traz um hash que identifica exatamente o arquivo entregue. Se anos depois alguém questionar "esse arquivo no seu backup é mesmo o que foi transmitido?", o hash responde.

> **Dica:** guarde o hash em local separado do arquivo. Se um invasor altera o arquivo e o hash gravado ao lado dele, a conferência "passa". A segurança está na comparação com uma referência que o atacante não controla.

## Erros comuns

- **Comparar visualmente só o começo.** Dois hashes que começam iguais podem ser diferentes no fim. Compare a sequência inteira (ou use ferramenta que compara).
- **Achar que hash protege o sigilo.** Hash prova integridade, não esconde conteúdo. Para sigilo, use criptografia (próxima lição).
- **Usar hash puro para guardar senhas.** Senhas exigem algoritmos lentos com sal (lição 6). SHA-256 sozinho é rápido demais para isso.
- **Confiar em MD5 publicado num site HTTP.** Se o site pode ser alterado no caminho, o hash também pode. Hash só vale quando a referência vem de fonte confiável (HTTPS, assinatura).

## Na prática

- Antes de instalar qualquer software de terceiros no escritório, confira o SHA-256 publicado pelo fornecedor.
- Ao arquivar documentos fiscais e contratos assinados, registre o hash numa planilha de controle separada.
- Sistemas de versionamento como o Git identificam cada alteração de código por hash; o próprio Git, que nasceu com SHA-1, já oferece suporte a SHA-256 por causa das colisões.
- A assinatura digital (lição 4) é, no fundo, "assinar o hash" do documento, não o documento inteiro.

## Resumo

- Hash transforma qualquer entrada em um resumo de tamanho fixo; é determinístico, rápido, unidirecional e resistente a colisão.
- Uma alteração mínima gera um hash totalmente diferente (efeito avalanche).
- MD5 e SHA-1 estão quebrados; use SHA-256 ou superior.
- O uso diário é conferir integridade: downloads, arquivos do SPED, documentos arquivados.
- Hash não é criptografia e não serve, sozinho, para guardar senhas.
