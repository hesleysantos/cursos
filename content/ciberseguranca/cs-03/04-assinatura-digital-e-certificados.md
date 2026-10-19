# Assinatura digital e certificados

Nesta lição você vai entender o que acontece de fato quando "assina com o certificado digital": o que é uma **PKI**, o papel das **autoridades certificadoras**, a **cadeia de confiança** e a diferença entre **A1** e **A3**. Vai ver por que a ICP-Brasil tem validade jurídica, o que é o carimbo de tempo, o que fazer quando um certificado é comprometido e quais cuidados o escritório precisa ter com o certificado que assina as obrigações de dezenas de clientes.

## O elo que faltava: quem garante que a chave pública é sua?

Na lição anterior, a chave pública podia ser distribuída livremente. Mas se um golpista publica uma chave pública dizendo "esta é a chave da Totali", como alguém saberia que é falsa? A assinatura seria matematicamente válida, só que da pessoa errada.

A solução é o **certificado digital**: um arquivo que amarra uma chave pública a uma identidade (nome, CPF ou CNPJ) e é **assinado por um terceiro confiável**, a **Autoridade Certificadora (AC)**, que só assina depois de verificar a identidade com documentos, presencialmente ou por videoconferência. O conjunto de regras, autoridades e procedimentos chama-se **PKI** (infraestrutura de chaves públicas).

## Cadeia de confiança

Um certificado não vale por si só; ele é assinado por uma AC, que por sua vez tem um certificado assinado por uma AC acima, até chegar à **AC-Raiz**, cuja chave pública já vem instalada nos sistemas operacionais e navegadores.

```
AC-Raiz (ICP-Brasil, operada pelo ITI)
  └── AC de 1º nível (ex.: AC Certisign, AC Serasa, AC Soluti...)
        └── AC de 2º nível
              └── Certificado e-CNPJ da Totali Contabilidade
```

Para verificar a sua assinatura, o sistema da Receita percorre essa cadeia: o e-CNPJ foi assinado por uma AC válida? Essa AC foi assinada pela raiz? A raiz está na lista de confiança? Se tudo fecha, a assinatura é aceita. É como o reconhecimento de firma: você confia no cartório porque ele é fiscalizado pelo Estado.

## ICP-Brasil: a PKI oficial

A **ICP-Brasil** foi criada pela **Medida Provisória 2.200-2/2001**, ainda em vigor, e é coordenada pelo **ITI** (Instituto Nacional de Tecnologia da Informação). O ponto jurídico central está no art. 10, § 1º: documentos assinados com certificado ICP-Brasil **presumem-se verdadeiros em relação aos signatários**. Quem quiser contestar precisa provar o contrário.

A **Lei 14.063/2020** definiu três níveis de assinatura eletrônica para interações com o poder público: **simples** (login e senha, aceite em app), **avançada** (como a assinatura do gov.br) e **qualificada** (ICP-Brasil). A escrituração fiscal (SPED), a emissão de NF-e e boa parte dos serviços do e-CAC exigem a qualificada; já vários serviços do gov.br e das juntas comerciais aceitam a avançada. Na dúvida, o certificado ICP-Brasil é aceito em todos os níveis.

## A1 vs A3 e os tipos de certificado

| Característica | A1 | A3 |
|---|---|---|
| Onde fica a chave privada | Arquivo (.pfx/.p12) no computador | Token USB, cartão inteligente ou nuvem (HSM) |
| Validade típica | 1 ano | 1 a 3 anos |
| Pode ser copiado? | Sim (risco e conveniência) | Não: a chave não sai do dispositivo |
| Uso | Sistemas automatizados, ERP, emissão de NF-e em lote | Assinaturas de maior responsabilidade, uso pessoal |

Os tipos mais comuns no escritório:

- **e-CPF:** identifica a pessoa física (o contador, o sócio).
- **e-CNPJ:** identifica a pessoa jurídica, vinculado ao CPF do responsável legal.
- **NF-e:** certificado da empresa usado só para emissão de documentos fiscais.

O certificado A3 em nuvem une o melhor dos dois: a chave fica num HSM do provedor, e você autoriza cada uso pelo celular.

## Carimbo de tempo

Uma assinatura prova **quem** e **o quê**, mas a data vem do relógio do computador de quem assinou, que pode estar errado ou ser manipulado. O **carimbo de tempo** resolve isso: uma Autoridade de Carimbo de Tempo credenciada na ICP-Brasil assina o hash do documento junto com a hora oficial. É essencial em contratos com prazo e para provar que um documento foi assinado **antes** de o certificado expirar ou ser revogado.

## Revogação: quando o certificado deixa de valer antes do prazo

Se o token é perdido, o arquivo A1 vaza ou o responsável legal muda, o certificado precisa ser **revogado** na AC que o emitiu. A AC publica uma **Lista de Certificados Revogados (LCR)** e oferece consulta on-line (**OCSP**); sistemas sérios consultam uma das duas antes de aceitar uma assinatura. Assinaturas feitas **antes** da revogação continuam válidas (daí o carimbo de tempo); as feitas depois são rejeitadas.

## Cuidados com o certificado do escritório

O e-CNPJ do escritório, somado às procurações eletrônicas dos clientes, permite entregar declarações, emitir notas e assinar atos em nome de dezenas de empresas. É o ativo mais sensível da operação.

- **Arquivo A1:** sem cópias espalhadas em pen drives e e-mails. Guarde no servidor com permissão restrita e registre quem tem acesso. A senha do .pfx vai para o cofre de senhas.
- **Token A3:** não fica conectado o dia inteiro nem circula entre mesas. O PIN não é anotado no corpo do token.
- **Procurações eletrônicas:** revise-as periodicamente no e-CAC; revogue as de clientes que saíram.
- **Desligamento de funcionário:** se ele conhecia a senha do A1, troque o certificado (revogue e emita outro). Senha de A1 vazada é chave privada vazada.
- **Renovação:** anote vencimentos; um certificado vencido em dia de prazo de SPED é prejuízo garantido.
- **Golpes:** e-mails do tipo "seu certificado será cancelado, clique para renovar" são phishing. ACs não pedem a senha do certificado.

## Erros comuns

- **Achar que o certificado "é" a chave.** O certificado contém a chave pública; a privada fica no arquivo ou token. Vazou o A1 com a senha, vazou a identidade.
- **Confundir assinatura digital com assinatura eletrônica simples.** Aceitar um contrato por clique é assinatura eletrônica; só a qualificada tem a presunção da MP 2.200-2.
- **Ignorar a cadeia.** "Certificado válido" num site não é o mesmo que certificado ICP-Brasil; cada cadeia serve a um propósito (lição 5).
- **Não revogar.** Token perdido sem revogação é um cheque em branco.

## Na prática

- Faça um inventário dos certificados do escritório: tipo, titular, validade, onde está a chave, quem tem a senha.
- Prefira A3 (ou A1 em servidor com acesso controlado) para o e-CNPJ do escritório; A1 pode ficar para o ERP que emite notas em lote.
- Verifique a assinatura de PDFs recebidos no leitor ou no Verificador de Conformidade do ITI: signatário, cadeia ICP-Brasil, documento não alterado após a assinatura.

## Resumo

- O certificado digital liga uma chave pública a uma identidade e é assinado por uma Autoridade Certificadora.
- A confiança sobe em cadeia até a AC-Raiz; na ICP-Brasil, operada pelo ITI.
- A MP 2.200-2/2001 dá presunção de veracidade às assinaturas ICP-Brasil; a Lei 14.063/2020 classifica os níveis de assinatura.
- A1 é arquivo (copiável, 1 ano); A3 é hardware ou nuvem (não copiável, 1 a 3 anos).
- Carimbo de tempo prova a data; revogação impede uso futuro de um certificado comprometido.
