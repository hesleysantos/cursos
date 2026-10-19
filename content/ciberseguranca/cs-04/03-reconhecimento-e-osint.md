# Reconhecimento e OSINT

Nesta lição você vai conhecer a primeira fase técnica de um ataque ou de um pentest: o **reconhecimento**. Vai entender o que é OSINT, quais informações sobre uma empresa ficam públicas sem que ninguém perceba (DNS, WHOIS, certificados, LinkedIn, vazamentos), o que são Google dorks e o Shodan e, do lado da defesa, como reduzir a exposição do escritório e dos clientes. Nada aqui envolve invadir coisa alguma: é só olhar o que já está à vista.

## O que é OSINT

**OSINT** (Open Source Intelligence) é a coleta de informações a partir de fontes abertas: sites, redes sociais, registros públicos, bases de vazamentos, documentos publicados. Num pentest, é a fase de **reconhecimento passivo**: não se toca no alvo, apenas se observa o que o alvo e terceiros já publicaram. Por não interagir com os sistemas, essa coleta é, em si, legal; o que pode ser ilegal é o que se faz com ela depois.

A analogia é a do observador que estuda uma casa por dias: horários, quem mora, se há câmera. Nenhum crime ainda, mas tudo o que vem depois se apoia nisso. Atacantes reais gastam mais tempo aqui do que em qualquer outra fase, porque um bom reconhecimento substitui a técnica: para que forçar uma entrada se o nome do gerente financeiro e os sistemas usados estão no LinkedIn e no site?

## Fontes técnicas

| Fonte | O que revela |
|---|---|
| **DNS** (módulo 2) | Subdomínios (`portal.`, `vpn.`, `teste.`), servidores de e-mail, provedores usados |
| **WHOIS / registro.br** | Responsável pelo domínio, datas, servidores DNS |
| **Transparência de certificados (CT)** | Toda AC pública registra os certificados que emite; a lista revela subdomínios, inclusive os "esquecidos" |
| **Cabeçalhos HTTP e páginas de erro** | Tecnologias e versões do servidor e dos frameworks |
| **Metadados de documentos** | PDFs e planilhas publicados guardam autor, software e, às vezes, caminhos de rede e nomes de usuário |
| **Repositórios públicos** | Código no GitHub com senhas, chaves e endereços internos deixados por engano |

A consulta ao WHOIS, à transparência de certificados (o serviço público crt.sh) ou ao DNS vai a **terceiros**, não ao alvo. É isso que mantém o reconhecimento "passivo".

## Fontes humanas

- **LinkedIn:** o organograma quase completo. Quem é do financeiro, quem acabou de entrar (alvo ideal para "o diretor pediu urgência"), e que sistemas a empresa usa, pois as vagas descrevem "experiência com o ERP tal e Office 365".
- **Site institucional:** nomes, e-mails, padrão de endereços (`nome.sobrenome@`), fornecedores.
- **Instagram e Facebook:** fotos do escritório com telas, post-its e crachás; viagens de executivos (prato cheio para a fraude do CEO, lição 8).
- **Vagas de emprego:** "administrador com Windows Server e firewall da marca tal" é um inventário de tecnologias de graça.
- **Vazamentos:** serviços como o Have I Been Pwned mostram quais e-mails da empresa aparecem em vazamentos e em quais serviços; atacantes usam versões completas, com senhas, para credential stuffing (módulo 3).

## Google dorks (conceito)

**Dorks** são buscas com os operadores avançados do próprio Google, que localizam conteúdo indexado sem querer: `site:` restringe ao domínio, `filetype:` filtra por extensão, `intitle:` e `inurl:` buscam no título e no endereço. Um uso defensivo e inofensivo é procurar `site:meuescritorio.com.br filetype:pdf` para ver quais documentos o Google conhece do próprio escritório. A base pública **Google Hacking Database** cataloga milhares desses padrões. A lição para a defesa é direta: **o que fica acessível sem login acaba encontrado.**

## Shodan (conceito)

O **Shodan** é um buscador que indexa **dispositivos** em vez de páginas: ele varre a internet, guarda o cartão de visita (banner) de cada serviço exposto e permite procurar, por exemplo, por câmeras ou servidores de acesso remoto abertos num país. Ele apenas mostra o que já está exposto; não ataca. É excelente para a defesa ("o que o mundo enxerga do meu IP?") e assustador por revelar quantos sistemas de pequenas empresas, inclusive impressoras e gravadores de câmera, estão abertos sem necessidade.

## O que se descobre sobre um escritório contábil

Juntando as fontes, um retrato típico de uma hora de pesquisa:

1. Domínio, provedor de e-mail e sistema contábil usado (pela vaga de emprego).
2. Nome e cargo dos funcionários; quem cuida do financeiro; quem é novo.
3. Padrão de e-mail e alguns endereços que apareceram em vazamentos com senha.
4. Um subdomínio `portal.` com versão antiga de um sistema, visto no certificado.
5. Uma foto no Instagram com a tela de um sistema aberta.
6. Lista de clientes citada no próprio site.

Com isso, o atacante escolhe o caminho: phishing direcionado ao funcionário novo, credential stuffing nas contas vazadas ou fraude do CEO. Nenhuma "invasão" técnica foi necessária até aqui, e é por isso que a defesa começa antes de qualquer firewall.

## Reduzindo a exposição

- **Faça o seu próprio OSINT** uma vez por semestre: pesquise o domínio no crt.sh, no Shodan e no Google com `site:`; verifique os e-mails no Have I Been Pwned.
- **Remova o que não precisa estar público:** painéis administrativos, ambientes de teste, documentos com metadados, lista de clientes.
- **Padronize e treine:** regra clara de não publicar fotos com telas; como o padrão de e-mail é conhecido, o processo de pagamento não pode depender só de um e-mail (lição 8).
- **Limpe os metadados** de PDFs e planilhas antes de publicá-los.
- **Monitore vazamentos** pelos alertas do gerenciador de senhas ou do Have I Been Pwned por domínio.
- **Não deixe serviços internos expostos** (acesso remoto, painel do roteador, câmeras); se precisam de acesso externo, use VPN ou acesso condicional (módulo 3).

## Erros comuns

- **Subestimar a fase.** "Ninguém vai se interessar pelo meu escritório" ignora que boa parte do ataque é automatizada.
- **Confundir passivo com ativo.** Consultar crt.sh é passivo; sondar os serviços do alvo é ativo e exige autorização (lição 4).
- **Publicar vagas com inventário de tecnologias.** Descreva funções, não marcas e versões.
- **Ignorar as redes sociais.** A engenharia social vive de fotos e rotinas publicadas.

## Na prática

- Monte um relatório de uma página do que a internet sabe sobre o escritório e corrija o que puder.
- Inclua no manual de boas práticas a regra sobre fotos e telas.
- Ao assumir um cliente, mostre a ele o que está exposto e como isso alimenta golpes.

## Resumo

- Reconhecimento passivo (OSINT) usa fontes abertas e não toca no alvo; é a fase mais longa de um ataque real.
- DNS, WHOIS, transparência de certificados, cabeçalhos e metadados revelam a infraestrutura; LinkedIn, site e redes sociais revelam as pessoas.
- Google dorks encontram o que foi indexado sem querer; o Shodan mostra os dispositivos expostos.
- A defesa é fazer o próprio OSINT, remover o desnecessário, limpar metadados e treinar a equipe.
- O reconhecimento alimenta phishing direcionado, credential stuffing e fraude do CEO, sem invasão técnica.
