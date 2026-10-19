# Identidade e acesso (IAM)

Nesta lição você vai entender como sistemas decidem **quem é você** e **o que você pode fazer**: autenticação e autorização, menor privilégio, controle por papéis (RBAC), o que acontece de verdade ao clicar em "Entrar com Google" (OAuth 2.0 e OpenID Connect), como sessões e tokens mantêm você logado e por que o MFA baseado em FIDO2/passkeys é imune a phishing. É o conhecimento para organizar acessos no escritório e avaliar o login dos sistemas que você contrata.

## Autenticação não é autorização

- **Autenticação** responde "quem é você?": senha, código do app, biometria, certificado.
- **Autorização** responde "o que você pode fazer?": ver a folha da empresa X, excluir um lançamento.

O porteiro do prédio autentica (confere o crachá); a chave de cada sala autoriza. Um erro clássico é tratar as duas como uma só: usuário logado passa a ver tudo. No módulo 4 veremos que "controle de acesso quebrado" é a falha número 1 em aplicações web. **IAM** (Identity and Access Management) cuida das duas e do ciclo de vida: criar conta, dar permissões, revisar, revogar.

## Princípio do menor privilégio

Cada pessoa ou sistema deve ter **apenas** as permissões necessárias para a sua função, pelo tempo necessário. Não é desconfiança; é limitar o estrago quando uma credencial vaza ou alguém erra. No escritório: o estagiário que lança notas não precisa de acesso à folha; ninguém trabalha o dia inteiro como administrador do Windows.

## RBAC: permissões por papel

Dar permissões pessoa a pessoa não escala. O **RBAC** (Role-Based Access Control) cria **papéis** com conjuntos de permissões e os atribui às pessoas:

| Papel | Pode | Não pode |
|---|---|---|
| Auxiliar fiscal | Lançar e consultar notas das empresas atribuídas | Fechar período, ver folha |
| Analista de pessoal | Processar folha, gerar eSocial | Alterar plano de contas |
| Gerente | Aprovar, fechar período, ver tudo do seu setor | Criar usuários |
| Administrador | Criar usuários, configurar o sistema | Usar esse perfil no dia a dia |

Quando alguém muda de função, troca-se o papel; quando sai, remove-se o usuário. Revisões periódicas ("quem ainda tem o papel X?") são obrigatórias.

## SSO: uma identidade, vários sistemas

**SSO** (Single Sign-On) é entrar uma vez e acessar vários sistemas. Um **provedor de identidade** (IdP: Microsoft Entra ID, Google Workspace, Okta) autentica a pessoa; os sistemas confiam nele. Resultado: uma senha forte com MFA em vez de vinte fracas, e um desligamento que bloqueia tudo de uma vez. Os protocolos por trás são **SAML** e **OpenID Connect**.

## OAuth 2.0 e OpenID Connect: "Entrar com Google" por dentro

**OAuth 2.0** é um protocolo de **autorização delegada**: um aplicativo acessa parte dos seus dados em outro serviço **sem receber a sua senha**. **OpenID Connect (OIDC)** é uma camada sobre o OAuth que acrescenta **autenticação**: informa quem é o usuário. Ao clicar em "Entrar com Google" num sistema de gestão:

1. O sistema redireciona você ao Google, dizendo quem ele é e quais permissões quer (**escopos**: "ver seu nome e e-mail").
2. Você faz login **no Google**, com o MFA do Google. O sistema nunca vê a senha.
3. O Google mostra a tela de consentimento: "O sistema X quer ver seu nome e e-mail. Permitir?"
4. Ao permitir, o Google devolve você ao sistema com um **código** temporário.
5. O sistema troca esse código, nos bastidores, por um **token de acesso** (para chamar as APIs do Google nos escopos permitidos) e um **ID token** (OIDC) que diz quem é o usuário.
6. O sistema cria a sua sessão.

> **Atenção:** a tela de consentimento é o momento de ler os escopos. "Ver seu nome e e-mail" é razoável; "ler, enviar e excluir seus e-mails" para um app de tarefas não é. Revise periodicamente os apps conectados à conta do escritório.

## Sessões e tokens

Depois do login, o sistema precisa reconhecer você nas próximas requisições sem pedir senha de novo:

- **Sessão no servidor:** o servidor guarda "sessão 8f3a = usuário Raoni" e envia ao navegador um **cookie** com esse identificador. Logout apaga a sessão.
- **Token assinado (JWT):** o servidor emite um token com os dados do usuário e uma assinatura (lição 3); qualquer serviço que conheça a chave pública valida sem consultar banco. Escala bem, mas é difícil revogar antes de expirar; por isso tokens de acesso duram minutos e um **refresh token** os renova.

Em ambos os casos, **quem rouba o cookie ou o token é você** até ele expirar. Por isso infostealers (módulo 4) miram cookies do navegador, e por isso a expiração curta importa.

## MFA resistente a phishing: FIDO2 e passkeys

MFA por SMS ou app (TOTP) é muito melhor que senha só, mas um site de phishing bem feito pede o código e o repassa em tempo real ao site verdadeiro.

**FIDO2** (padrão da FIDO Alliance e do W3C, formado por WebAuthn e CTAP) muda o jogo. No cadastro, o seu dispositivo (chave física como a YubiKey, ou o próprio celular ou computador) gera um **par de chaves exclusivo para aquele domínio**. No login, o site envia um desafio e o dispositivo o assina com a chave privada, após você confirmar com digital, rosto ou PIN. Dois efeitos:

- A chave privada nunca sai do dispositivo; não há o que o site vazar.
- A assinatura é amarrada ao **domínio real**. Num site falso, o navegador não encontra credencial para aquele domínio. Não existe "digitar o código no site errado".

**Passkeys** são credenciais FIDO2 sincronizadas entre seus dispositivos pela Apple, Google, Microsoft ou por gerenciadores como Bitwarden. Google, Microsoft, GitHub e vários bancos já as oferecem.

## Erros comuns

- **Conta compartilhada** ("o login do escritório"): sem rastreabilidade, sem revogação individual, MFA impossível.
- **Esquecer de revogar:** ex-funcionário com acesso ao sistema contábil é incidente anunciado.
- **Aceitar qualquer escopo no OAuth:** apps maliciosos pedem acesso total à caixa de e-mail.
- **Achar que MFA por SMS é inquebrável:** protege contra credential stuffing, não contra phishing em tempo real nem troca de chip (SIM swap).

## Na prática

- Monte uma tabela de papéis do escritório e aplique-a no sistema contábil, no Drive e no e-mail.
- Centralize o login em Google Workspace ou Microsoft 365 com MFA obrigatório; use SSO onde possível.
- Ative passkeys ou chave física nas contas mais críticas: e-mail, Microsoft/Google, banco.
- Crie um checklist de desligamento: desativar o usuário no IdP, revogar procurações, trocar senhas compartilhadas residuais.

## Resumo

- Autenticação prova quem você é; autorização define o que pode fazer.
- Menor privilégio e RBAC organizam permissões por função e limitam o dano de um vazamento.
- OAuth 2.0 delega acesso sem compartilhar senha; OIDC acrescenta a identidade. Leia os escopos.
- Sessões e tokens mantêm o login; roubá-los equivale a roubar a senha até expirarem.
- FIDO2/passkeys são o MFA que o phishing não captura, porque a credencial é amarrada ao domínio.
