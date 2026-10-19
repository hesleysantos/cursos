Nesta lição você vai aplicar tudo o que viu no módulo à realidade de um escritório contábil: cuidados com o certificado digital, acesso aos portais do governo, golpes que miram contadores e seus clientes, uma política mínima para a equipe e um checklist de 20 itens. Importa porque o contador é guardião dos dados de dezenas de empresas e o alvo mais rentável para quem quer chegar a elas.

## Certificado digital: A1 e A3

O certificado digital é a identidade eletrônica do escritório e dos clientes: com ele se assina a ECD, a EFD e o eSocial, se emite nota fiscal e se acessa o e-CAC por procuração. Quem tem o certificado e a senha **é** a empresa perante o governo.

| Tipo | Onde fica | Validade | Risco principal |
|---|---|---|---|
| A1 | Arquivo (`.pfx`) instalado no computador | 1 ano | Pode ser copiado sem que ninguém perceba |
| A3 | Token USB ou cartão com chip | Até 5 anos, conforme a certificadora | Pode ser furtado, mas não copiado; depende da senha (PIN) |

Cuidados com o A1: o arquivo `.pfx` e a senha nunca ficam juntos (nem na mesma pasta, nem no mesmo e-mail); o arquivo não circula por WhatsApp; a cópia de segurança fica no backup criptografado, não no desktop; e cada certificado é instalado só nas máquinas que precisam dele. Mantenha uma planilha de controle: cliente, tipo, validade, onde está instalado, quem tem a senha. Com o A3, o token sai da máquina ao fim do dia e fica trancado, e o PIN não vai anotado na etiqueta.

## Portais do governo

O e-CAC, o Portal do Simples Nacional, o eSocial e os portais estaduais e municipais concentram o poder de fazer e desfazer a vida fiscal dos clientes. Três regras: acesse sempre pelo favorito digitado por você, nunca por link; use a conta gov.br com nível prata ou ouro e MFA ativada; e revise periodicamente as **procurações eletrônicas** no e-CAC, revogando as de clientes que saíram. Uma procuração que você não concedeu é sinal de comprometimento.

## Golpes contra contadores e clientes

Alguns golpes foram desenhados para o ecossistema contábil. Reconhecê-los pelo roteiro é a melhor defesa.

- **Falsa alteração de conta bancária.** Um e-mail "do fornecedor" ou "do cliente", às vezes de uma caixa realmente invadida, informa que os pagamentos passam a ir para outra conta. Regra fixa: mudança de dados bancários só se confirma por telefone para o número já cadastrado.
- **Boleto adulterado.** O boleto chega com a linha digitável trocada, ou é alterado por programa malicioso na máquina. Confira o beneficiário na tela de confirmação do banco; se o nome não é o esperado, pare.
- **Pedido urgente do "dono".** Mensagem do sócio, por WhatsApp de número novo ou e-mail parecido, pedindo transferência "para agora". Urgência e sigilo são a assinatura do golpe. Nenhum pagamento sai sem confirmação por voz, no número conhecido.
- **Falso suporte do sistema ou da certificadora.** Ligação pedindo acesso remoto para "atualizar o certificado". Fornecedores não ligam pedindo acesso.

## Política mínima de segurança para a equipe

Uma política não precisa ter 40 páginas. Uma página, assinada por todos e revisada a cada ano, cobrindo:

1. **Contas e senhas:** uma conta por pessoa, gerenciador obrigatório, MFA em tudo que permitir.
2. **Dispositivos:** conta padrão, atualizações automáticas, bloqueio de tela, BitLocker, só lojas oficiais no celular.
3. **E-mail e mensagens:** regra do canal independente para pagamentos e alterações de dados; mensagem suspeita é reportada, não encaminhada.
4. **Dados dos clientes:** não saem por WhatsApp ou e-mail pessoal; descarte seguro de papel e mídias.
5. **Certificados:** inventário, senha separada do arquivo, token guardado.
6. **Backup:** automático, 3-2-1, teste mensal, responsável nomeado.
7. **Incidentes:** a quem avisar e o que não fazer (não pagar, não esconder) se clicou, perdeu o celular ou a máquina foi cifrada.
8. **Desligamento:** no dia em que alguém sai, todos os acessos são revogados, inclusive procurações.

Treinamento: 30 minutos por semestre, com exemplos reais, sem punição para quem errou.

## Checklist de 20 itens

Marque o que já existe; o que faltar vira plano.

1. Inventário de ativos (dados, sistemas, certificados, contas).
2. Uma conta por pessoa, sem contas compartilhadas.
3. Contas de uso diário sem privilégio de administrador.
4. Gerenciador de senhas em uso por toda a equipe.
5. MFA no e-mail, gov.br, bancos, Workspace/365 e gerenciador.
6. Códigos de recuperação da MFA guardados fora do celular.
7. Windows, navegador, Office e sistema contábil com atualização automática.
8. Defender (ou EDR) e Firewall ativos em todas as máquinas.
9. Bloqueio de tela automático em 5 minutos.
10. BitLocker ativo, com chave de recuperação guardada.
11. Backup automático 3-2-1 com 30 dias ou mais de versões.
12. Teste de restauração feito no último mês, com registro.
13. Certificados A1 inventariados; arquivo e senha separados.
14. Tokens A3 fora da máquina ao fim do expediente.
15. Procurações eletrônicas revisadas no último trimestre.
16. Regra do canal independente escrita e conhecida por quem paga contas.
17. Wi-Fi com WPA2/WPA3, senha forte e rede separada para visitantes.
18. Nenhum programa de acesso remoto iniciando com o Windows.
19. Procedimento de desligamento com revogação de acessos.
20. Política de uma página assinada e treinamento semestral registrado.

## Erros comuns

- **Certificado A1 "de todo mundo" instalado em todas as máquinas**, com senha na planilha compartilhada.
- **Procurações eletrônicas nunca revisadas.**
- **Política escrita e nunca lida.** Política é hábito, não documento.
- **Tratar o incidente como vergonha.** Quem esconde o clique dá tempo ao atacante.

## Na prática

Marque uma reunião de uma hora com a equipe. Passe o checklist item a item e atribua um responsável e uma data a cada pendência. Priorize nesta ordem: MFA no e-mail e gov.br, contas sem administrador, backup testado, inventário de certificados.

> **Atenção:** a LGPD exige comunicar incidentes relevantes com dados pessoais à ANPD e aos titulares. Ter o procedimento pronto antes evita decisões ruins no dia.

## Resumo

- Certificado A1 (arquivo, 1 ano) pode ser copiado em silêncio; A3 (token) depende do PIN. Senha e arquivo nunca juntos; inventário sempre.
- Portais do governo só por favorito, com gov.br prata/ouro e MFA; revise procurações eletrônicas todo trimestre.
- Golpes típicos (alteração de conta, boleto adulterado, pedido urgente do dono, falso suporte) caem com a regra do canal independente e a conferência do beneficiário.
- Uma política de uma página, assinada e treinada a cada semestre, vale mais que um manual.
- O checklist de 20 itens é o plano de ação; comece por MFA, contas sem administrador, backup testado e certificados inventariados.
