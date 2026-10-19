Nesta lição você vai aprender o básico de **forense digital**: preservar evidências de um computador suspeito sem destruí-las, em que ordem coletar, como provar que uma evidência não foi alterada (hash) e como documentar quem teve acesso a ela (cadeia de custódia). Vai conhecer as ferramentas de referência e escrever um verificador de integridade em Python. Isso importa porque a diferença entre "achamos que foi isso" e "provamos que foi isso" está em como você tratou o computador nos primeiros minutos.

## Forense é contabilidade de evidências

O trabalho de um perito digital se parece muito com uma auditoria: ele não altera os livros, tira cópias autenticadas, registra cada passo e produz um laudo que outra pessoa consegue refazer. Os três princípios:

1. **Não altere o original.** Toda análise é feita em cópia.
2. **Prove a integridade.** Um hash da cópia, igual ao hash do original, demonstra que nada mudou.
3. **Documente o caminho.** Quem coletou, quando, onde guardou, quem acessou.

Sem isso, a evidência vale pouco num processo trabalhista, numa disputa com cliente ou numa comunicação à ANPD.

## Ordem de volatilidade

Algumas evidências somem em segundos; outras duram anos. A regra, formalizada na RFC 3227 (um documento técnico público da internet sobre coleta de evidências), é coletar primeiro o que desaparece primeiro. A tabela abaixo adapta essa lista:

| Ordem | Evidência | Tempo de vida |
|---|---|---|
| 1 | Registradores e cache da CPU | nanossegundos |
| 2 | Memória RAM (processos, senhas, chaves de criptografia, conexões) | até desligar |
| 3 | Estado da rede (conexões abertas, tabela ARP) | segundos a minutos |
| 4 | Processos em execução | enquanto rodam |
| 5 | Disco (arquivos, registro do Windows, logs locais) | até ser sobrescrito |
| 6 | Logs remotos, backups | meses |
| 7 | Mídia de arquivo (fitas, discos guardados) | anos |

Consequência prática: **não desligue** um computador suspeito antes de capturar a memória, porque a chave que o ransomware usou e a conexão com o atacante estão na RAM. Isolar da rede, sim; desligar, não.

## Imagem de disco

Uma **imagem forense** é a cópia bit a bit de um disco inteiro, incluindo espaço "vazio" (onde ficam arquivos apagados). Ferramentas: **FTK Imager** (gratuito, Windows, com interface) e o comando `dd` (Linux). A cópia é feita para um disco externo, idealmente usando um **bloqueador de escrita** (hardware ou software) que impede qualquer gravação no original.

Depois da cópia, calcula-se o **hash** (SHA-256) do original e da imagem. Iguais? A imagem é fiel. Esse par de hashes vai no relatório.

## Hash de evidências

Você já viu hashes no módulo de criptografia. Aqui o uso é específico: cada arquivo coletado (imagem de disco, captura de memória, log exportado, e-mail suspeito) recebe um hash no momento da coleta, anotado na cadeia de custódia. Qualquer pessoa, a qualquer momento, pode recalcular e confirmar que o arquivo é o mesmo.

```python
import hashlib

def sha256_de_arquivo(caminho):
    h = hashlib.sha256()
    with open(caminho, "rb") as f:
        for bloco in iter(lambda: f.read(65536), b""):
            h.update(bloco)
    return h.hexdigest()

# simulação: cria um "arquivo de evidência" e calcula o hash
with open("/tmp/evidencia.log", "wb") as f:
    f.write(b"Mar 14 09:21:07 srv01 sshd: Failed password for root from 203.0.113.45\n")

print(sha256_de_arquivo("/tmp/evidencia.log"))
```

Saída (sempre a mesma para esse conteúdo; o arquivo é gravado em modo binário, `"wb"`, para que o resultado não dependa do sistema operacional):

```
d0d1226c4ac09802df3c47ef06d91247c863a4a033a648cb51ce580534d2c16e
```

Ler em blocos de 64 KB permite calcular o hash de um disco de 1 TB sem carregar tudo na memória. Use SHA-256; MD5 e SHA-1 ainda aparecem em ferramentas antigas, mas têm colisões conhecidas e não servem mais para provar integridade.

> **Atenção:** o hash prova que o arquivo **não mudou** desde a coleta. Não prova que a coleta foi feita corretamente nem quem fez. Para isso existe a cadeia de custódia.

## Cadeia de custódia

A **cadeia de custódia** é o registro contínuo de posse da evidência: um formulário (papel ou digital) com, para cada item: identificação (ex.: "HD-01, Seagate 1 TB, serial X"), descrição, hash, data e hora da coleta, quem coletou, onde está guardado, e cada transferência (de quem para quem, quando, por quê, assinatura). Qualquer lacuna ("ficou na gaveta do estagiário por três dias") enfraquece a prova.

Guarde a evidência original lacrada e trabalhe sempre sobre cópias com o mesmo hash.

## Triagem de um computador suspeito

Você não é perito, mas pode ser a primeira pessoa a chegar. O roteiro para não destruir nada:

1. **Fotografe a tela** como está (relógio visível ajuda). Anote hora e o que vê.
2. **Isole da rede** (cabo fora, Wi-Fi desligado). Não desligue a máquina.
3. **Não mexa**: não abra arquivos, não rode antivírus, não "dê uma olhada" no histórico. Cada clique altera datas de acesso e sobrescreve espaço livre.
4. **Chame quem vai coletar** (prestador com capacidade forense ou perito). Se precisar capturar a memória antes que ela se perca e tiver a ferramenta pronta (um pendrive com utilitário de captura preparado na fase de preparação), faça e anote o hash.
5. **Registre** no formulário de custódia o que você fez, com horários.
6. Se a decisão for não investigar formalmente (incidente pequeno), ainda assim exporte os logs e tire a imagem antes de formatar; a necessidade pode surgir depois.

## Ferramentas de referência (conceito)

- **Autopsy:** plataforma gratuita e gráfica de análise de imagens de disco (baseada no The Sleuth Kit). Recupera arquivos apagados, monta linha do tempo, extrai histórico de navegação e e-mails.
- **Velociraptor:** ferramenta gratuita de **coleta e caça** em muitas máquinas ao mesmo tempo: um agente em cada estação responde a perguntas como "quais tarefas agendadas foram criadas nos últimos 7 dias?" numa linguagem de consulta própria (VQL).
- **FTK Imager:** imagens de disco e captura de memória no Windows; **Volatility:** análise de memória; **Wireshark:** análise de rede.

Para o escritório, o importante é saber que elas existem e **exigir** que o prestador de resposta as use e documente.

## Erros comuns

- Desligar ou reiniciar a máquina "para ver se resolve".
- Rodar o antivírus antes de coletar: ele apaga o malware, que era a evidência.
- Copiar arquivos "arrastando" em vez de fazer imagem: perde apagados e metadados.
- Calcular hash com MD5 ou não calcular nenhum.
- Deixar a evidência circular sem registro de quem pegou.

## Na prática

Na fase de preparação (lição anterior), monte um **kit forense mínimo**: um HD externo vazio de 2 TB, um pendrive com FTK Imager, formulários de cadeia de custódia impressos, caneta e etiquetas. Custa pouco e evita a frase mais cara de um incidente: "a gente formatou".

## Resumo

- Três princípios: não altere o original, prove integridade com hash, documente a custódia.
- Ordem de volatilidade: memória e rede primeiro, disco depois, backups por último. Isole, não desligue.
- Imagem forense é cópia bit a bit; hash SHA-256 do original e da cópia devem coincidir.
- Cadeia de custódia registra cada posse e transferência; lacuna enfraquece a prova.
- Autopsy (disco), Velociraptor (coleta em escala), FTK Imager (imagem/memória).
