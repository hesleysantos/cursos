Nesta lição você vai aprender a reconhecer o ataque mais comum e mais eficiente que existe: a engenharia social, que não invade sistemas, invade pessoas. Vai ver as formas que ela assume (e-mail, SMS, telefone, WhatsApp e até vídeos falsos), os sinais que denunciam uma mensagem falsa e o que fazer quando ela chega. Isso importa porque a maior parte dos incidentes em pequenas empresas começa com alguém clicando onde não devia.

## O que é engenharia social

Engenharia social é o uso de manipulação psicológica para fazer alguém entregar informação, dinheiro ou acesso. O atacante não precisa quebrar uma senha se conseguir que você a digite num site falso. Ele explora sentimentos universais: **medo** ("sua conta será bloqueada"), **urgência** ("você tem 2 horas"), **autoridade** ("aqui é da Receita Federal"), **ganância** ("restituição disponível") e **confiança** ("oi, mãe, troquei de número").

O **phishing** é a forma mais famosa: uma mensagem que finge ser de uma fonte confiável para fisgar a vítima. Ele tem variações por canal:

| Nome | Canal | Exemplo típico |
|---|---|---|
| Phishing | E-mail | "Pendência na Receita Federal, regularize em 24h" |
| Smishing | SMS | "Seu CPF foi usado em compra de R$ 2.390. Não reconhece? Acesse o link" |
| Vishing | Telefone (voz) | "Central de segurança do banco: detectamos uma transação suspeita" |
| WhatsApp | Mensagem | Número novo se passando por cliente ou sócio pedindo transferência urgente |
| Spear phishing | Qualquer | Mensagem feita sob medida, citando nome, cargo e um cliente real |
| Deepfake | Áudio ou vídeo | Voz do dono da empresa, clonada por inteligência artificial, autorizando um pagamento |

O deepfake virou acessível: com poucos segundos de áudio público (um vídeo no Instagram), é possível gerar uma voz convincente, e já houve empresas que transferiram valores altos após uma videochamada com "diretores" falsos. A defesa não é perceber a imperfeição do vídeo; é ter um processo que não dependa da voz de ninguém.

## Anatomia de um e-mail falso

Veja um exemplo típico, do tipo que chega todo dia em escritórios contábeis:

> **De:** Receita Federal <atendimento@receita-federal-gov.net>
> **Assunto:** URGENTE: irregularidade no CNPJ 12.345.678/0001-90
> Prezado contribuinte, identificamos divergências na sua declaração. Para evitar a suspensão do CNPJ, acesse o link abaixo e regularize em até 48 horas.
> [Regularizar agora]
> Anexo: Notificacao_Fiscal.pdf.exe

Os sinais estão todos ali:

1. **Remetente.** O domínio verdadeiro da Receita é `gov.br`. "receita-federal-gov.net" é um domínio qualquer registrado pelo golpista. Passe o mouse sobre o nome para ver o endereço real; no celular, toque e segure.
2. **Urgência e ameaça.** Prazo de 48 horas e suspensão do CNPJ. Órgãos públicos comunicam pendências pelos canais oficiais (no caso da Receita, a caixa postal do e-CAC), não por e-mail com link para "regularizar".
3. **Link.** O texto do botão diz uma coisa; o destino é outro. Passe o mouse sem clicar e leia o endereço no canto da tela. Encurtadores (bit.ly) e domínios parecidos (`gov-br.com`, `receita.fazenda.info`) são alerta vermelho.
4. **Anexo.** Um arquivo que termina em `.exe`, `.scr`, `.js`, `.bat` ou um `.zip` "protegido por senha" é programa, não documento. "Notificacao.pdf.exe" é executável disfarçado; o Windows esconde a última extensão por padrão.
5. **Genérico ou errado.** "Prezado contribuinte", erros de concordância, logotipo diferente.

O mesmo padrão aparece no "banco" ("atualize seu dispositivo de segurança"), no "Serasa" ("seu nome foi negativado"), nos "Correios" ("taxa pendente") e no **boleto falso**: um boleto de "renovação do certificado digital" ou "taxa de alvará" com valor plausível e beneficiário desconhecido. Antes de pagar qualquer boleto, confira se o nome do beneficiário no aplicativo do banco é a empresa que você esperava.

## Vishing e WhatsApp: o golpe por conversa

No telefone, o roteiro é sempre parecido: a pessoa diz ser do banco, cita dados reais seus (obtidos em vazamentos), fala de uma compra suspeita e "orienta" você a transferir para uma "conta segura", instalar um aplicativo "de proteção" ou informar o código que chegou por SMS. Nenhum banco pede isso. Desligue e ligue você mesmo para o número do cartão.

No WhatsApp, os dois golpes mais comuns contra escritórios são: o **número novo** ("oi, sou o Carlos da empresa X, troquei de número, preciso que pague esse boleto hoje") e a **conta clonada**, em que o golpista convence a vítima a informar o código de ativação do WhatsApp e passa a falar com todos os contatos dela. Ative a verificação em duas etapas do próprio WhatsApp (um PIN de seis dígitos) para dificultar o segundo caso.

## Erros comuns

- **Clicar para "só dar uma olhada".** Muitas páginas falsas instalam programas ou roubam a senha só com a visita e o preenchimento automático do navegador.
- **Responder ao e-mail perguntando se é verdade.** Quem responde é o golpista.
- **Confiar porque a mensagem tem seus dados.** Nome, CPF, endereço e até o banco onde você tem conta estão em vazamentos públicos.
- **Achar que só gente desatenta cai.** Mensagens bem feitas, no dia errado, enganam qualquer um. Por isso a defesa precisa ser processo, não vigilância.

## Na prática

Adote a regra do **canal independente**: se um pedido de pagamento, troca de dados bancários, senha ou código chegou por um canal, confirme por outro que você já tinha. E-mail do cliente pedindo para mudar a conta do pagamento? Ligue para o telefone que já estava no cadastro (não para o que veio no e-mail). WhatsApp do sócio pedindo transferência? Ligue para o número antigo.

No escritório, combine um procedimento para mensagens suspeitas: não clicar, não responder, não encaminhar aos colegas (isso espalha o risco), tirar um print, avisar o responsável e marcar como phishing. Se alguém já clicou e digitou a senha, não é motivo de vergonha: troque a senha imediatamente, ative a dupla verificação e avise. O custo de esconder é muito maior.

> **Dica:** o site `gov.br/receitafederal` e o e-CAC são os únicos lugares onde a Receita fala com você sobre pendências. E-mail com link e prazo é golpe até prova em contrário.

## Resumo

- Engenharia social manipula pessoas usando medo, urgência, autoridade, ganância e confiança; phishing é sua forma por mensagem.
- Variações: smishing (SMS), vishing (telefone), golpes por WhatsApp, spear phishing (sob medida) e deepfakes (voz e vídeo falsos).
- Sinais de alerta: remetente com domínio estranho, prazo curto com ameaça, link cujo destino não bate, anexo executável, texto genérico.
- Regra do canal independente: todo pedido de pagamento, mudança de conta ou código deve ser confirmado por um canal que você já tinha.
- Clicou? Troque a senha, ative a dupla verificação e avise na hora.
