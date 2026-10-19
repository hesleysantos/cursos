# Zero Trust e gestão de segredos

Nesta última lição do módulo você vai conhecer o modelo que substituiu a ideia de "rede interna segura": o **Zero Trust**, cujo lema é "nunca confie, sempre verifique". Vai entender segmentação, acesso condicional e, na parte mais prática, como guardar os **segredos** do escritório e dos seus scripts: variáveis de ambiente, cofres como Bitwarden e Vault, rotação e o que nunca deve ir para código ou e-mail.

## O castelo e o fosso não funcionam mais

O modelo tradicional era o do castelo: um perímetro forte (firewall, VPN) e, dentro dele, confiança. Quem estava na rede interna acessava o servidor de arquivos, a impressora, o sistema contábil. Isso quebrou por três razões:

1. As pessoas trabalham de casa, do cliente, do celular. Não existe mais "dentro".
2. Os sistemas estão na nuvem (e-mail, ERP, Drive). O perímetro não os contém.
3. Um único notebook infectado por phishing já está "dentro". O ransomware (módulo 4) explora exatamente a confiança interna para se espalhar.

## Zero Trust: nunca confie, sempre verifique

O **Zero Trust**, formalizado pelo NIST na publicação SP 800-207 (2020) e popularizado pelo projeto BeyondCorp do Google, parte da premissa de que **a rede está sempre comprometida**. Cada acesso é avaliado individualmente, venha de onde vier. Os princípios:

| Princípio | Significado |
|---|---|
| Verificar explicitamente | Toda requisição autentica e autoriza com base em identidade, dispositivo, local e contexto, não no endereço IP |
| Menor privilégio | Acesso mínimo, pelo tempo mínimo (lição 7), inclusive para administradores |
| Assumir a violação | Projetar como se o invasor já estivesse dentro: segmentar, registrar tudo, limitar o movimento lateral |

Zero Trust não é um produto que se compra; é uma forma de arquitetar acessos com as peças que você já viu: identidade forte (SSO, MFA resistente a phishing), dispositivos conhecidos, criptografia em todo lugar (TLS inclusive dentro da rede) e logs (módulo 2).

## Segmentação

Segmentar é dividir a rede e os sistemas em zonas com controle entre elas, para que um comprometimento não vire um incêndio. Exemplos ao alcance de um escritório:

- **Wi-Fi de visitantes separado** do Wi-Fi da equipe (rede de convidados do roteador ou VLAN).
- **Servidor de arquivos** acessível só aos usuários do escritório, nunca exposto à internet.
- **Impressoras e câmeras** (dispositivos IoT, geralmente desatualizados) numa rede própria.
- **Backups** em local que a conta do dia a dia não consegue apagar (imutáveis ou offline). Essa é a segmentação que derrota o ransomware.

Na nuvem, segmentar é usar grupos e permissões: a pasta "Folha" no Drive não é visível ao setor fiscal.

## Acesso condicional

É a implementação mais visível do Zero Trust em Microsoft 365 e Google Workspace: regras do tipo "permitir acesso ao e-mail **se** o usuário tem MFA **e** o dispositivo é gerenciado **e** o login vem do Brasil; caso contrário, bloquear ou exigir nova verificação". O login de madrugada, de outro país, num dispositivo nunca visto, que passaria no modelo do castelo (a senha estava certa), aqui dispara alerta ou bloqueio.

## O que é um segredo

**Segredo** é qualquer valor cuja posse dá acesso: senha, chave de API, token, arquivo A1 com sua senha, chave de recuperação do BitLocker, string de conexão de banco de dados, chave SSH privada. Num escritório contábil há dezenas: e-CAC, bancos, prefeituras, API do sistema contábil, Wi-Fi.

A regra de ouro: **segredo não vive em lugar lido por pessoas**. Nem em código, nem em planilha compartilhada, nem em e-mail, nem no grupo de WhatsApp.

## Segredos em scripts: variáveis de ambiente e arquivos .env

Quem automatiza cai na tentação de escrever a senha no script:

```python
# ERRADO: segredo no código
senha_api = "k3yS3cr3t-2026"
```

Esse arquivo será copiado, enviado e versionado no Git, e a senha irá junto, para sempre, no histórico. A alternativa é ler o segredo do **ambiente**:

```python
# CERTO: segredo vem do ambiente; o código não o contém
import os
senha_api = os.environ.get("API_SENHA")
if not senha_api:
    raise SystemExit("Defina a variável de ambiente API_SENHA")
```

Se você rodar esse trecho sem a variável definida, o script para na hora com a mensagem "Defina a variável de ambiente API_SENHA". Isso é proposital: é melhor falhar cedo e de forma clara do que seguir com uma senha vazia. A variável é definida fora do código (no sistema, no agendador de tarefas ou num arquivo `.env` carregado na execução), e o `.env` entra no `.gitignore` para nunca ser versionado. O GitHub faz **varredura de segredos** e avisa quando uma chave vaza num repositório; a resposta correta é **revogar e trocar**, não apenas apagar o commit (o histórico guarda tudo).

## Cofres de segredos

- **Gerenciador de senhas** (Bitwarden, 1Password, KeePassXC): o cofre do escritório. Cofres compartilhados por setor, senha mestra forte, MFA, registro de quem acessou o quê. Serve para senhas e também para guardar certificados A1 e chaves de recuperação.
- **Cofre para sistemas** (HashiCorp Vault, AWS Secrets Manager, Azure Key Vault): os scripts pedem o segredo em tempo de execução, com identidade própria e logs. Para um escritório pequeno, o gerenciador de senhas via linha de comando já resolve.
- **HSM e tokens:** para chaves que nunca podem ser copiadas.

## Rotação

**Rotacionar** é trocar o segredo periodicamente e, obrigatoriamente, em três eventos: saída de alguém que o conhecia, suspeita de vazamento e incidente. Chaves de API e tokens de longa duração são os mais esquecidos; mantenha um inventário com data de criação e responsável.

## O que nunca colocar em código ou e-mail

- Senhas, chaves de API, tokens, strings de conexão.
- Arquivo .pfx do certificado A1 e sua senha (nem separados em dois e-mails).
- Chaves privadas SSH e chaves de recuperação do BitLocker.
- Dados pessoais de clientes em massa (CPFs, salários) em anexos sem criptografia.
- Códigos de MFA e de recuperação.

Para transmitir um segredo, use o compartilhamento do próprio gerenciador de senhas, que cifra ponta a ponta e expira.

## Erros comuns

- **"Está na rede interna, então é seguro."** O notebook infectado do estagiário também está.
- **Segredo no código "só por enquanto".** O "enquanto" vira o histórico do Git.
- **Planilha de senhas no Drive.** Sem auditoria, compartilhável com um clique.
- **Apagar o commit achando que resolveu.** Segredo exposto é segredo comprometido: troque.
- **Zero Trust só no papel.** Comprar uma ferramenta sem MFA, inventário e menor privilégio não muda nada.

## Na prática

- Adote um gerenciador de senhas com cofres compartilhados; migre as senhas de planilhas e e-mails e depois apague-as.
- Ative acesso condicional básico no Microsoft 365 ou Google Workspace: MFA obrigatório, bloqueio de países onde ninguém trabalha, alerta de dispositivo novo.
- Separe o Wi-Fi de visitantes e garanta backups que a conta do dia a dia não apaga.
- Nos scripts de automação, troque toda senha escrita por variável de ambiente ou chamada ao cofre.

## Resumo

- Zero Trust substitui o perímetro pela verificação de cada acesso (identidade, dispositivo, contexto) e assume que a rede já está comprometida.
- Segmentação e acesso condicional limitam o movimento de um invasor e barram logins anômalos.
- Segredos ficam em cofres ou variáveis de ambiente, nunca em código, planilha ou e-mail.
- Rotacione segredos periodicamente e sempre que alguém sai ou há suspeita de vazamento.
- Segredo exposto é comprometido: revogue e troque, não só apague.
