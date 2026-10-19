Nesta lição você vai entender por que o Claude Code pede confirmação, quais são os **modos de permissão** atuais, como trocar entre eles e quais regras de segurança adotar desde o primeiro dia. Em um escritório contábil, o computador tem dados de clientes e certificados digitais; dar a um agente o poder de rodar comandos exige saber onde está o freio.

## Por que ele pergunta

O Claude Code é construído sobre uma **arquitetura baseada em permissões**. Ler arquivos dentro da pasta de trabalho não exige aprovação, mas editar arquivos, rodar comandos e acessar a rede são ações que podem causar dano — e por isso, no modo manual, ele para e pergunta. A documentação resume: "Você é responsável por revisar o código e os comandos propostos antes de aprovar". Permissão é o momento em que você lê o diff ou o comando e decide.

## Os modos de permissão

Um modo de permissão define o que o Claude pode fazer **sem perguntar**. Os modos documentados hoje são:

| Modo (valor de configuração) | Nome na interface | O que roda sem perguntar | Indicado para |
| --- | --- | --- | --- |
| `default` | **Manual** | Só leituras (e um conjunto fixo de comandos somente-leitura, como `ls`, `cat`, `git status`) | Revisar cada ação; trabalho sensível |
| `acceptEdits` | **Accept edits** ("aceitar edições") | Leituras, **edições de arquivos** e comandos comuns de sistema de arquivos (`mkdir`, `touch`, `rm`, `mv`, `cp`, `sed`) dentro da pasta de trabalho | Iterar em código que você está revisando |
| `plan` | **Plan** (planejamento) | Leituras e exploração; **nenhuma edição** até você aprovar um plano | Explorar e planejar antes de mudar |
| `auto` | **Auto** | Tudo, com um **classificador** (um segundo modelo) revisando as ações em segundo plano e bloqueando as arriscadas | Tarefas longas, menos interrupções |
| `dontAsk` | — | Só leituras na pasta de trabalho e o que foi pré-aprovado; o resto é negado, sem perguntar | Scripts e CI (definido por flag ou configuração; não entra no ciclo do Shift+Tab) |
| `bypassPermissions` | **Bypass permissions** | Tudo, sem checagens | **Somente** contêineres e máquinas virtuais isolados |

Alguns detalhes que a documentação deixa claros:

- Em versões recentes, o **modo inicial** de uma sessão interativa no terminal e no VS Code é o **auto**. Você pode mudar isso por sessão ou por configuração.
- O modo **plan** é o que você usa para "pensar antes de fazer": o Claude lê, roda comandos de exploração e escreve um plano; quando o plano fica pronto ele oferece as opções "Yes, and use auto mode", "Yes, manually approve edits" (aprovar e revisar cada edição) e "No, keep planning". Aprovar sai do modo plan.
- No modo **auto**, o classificador bloqueia por padrão coisas como baixar e executar código da internet (`curl | bash`), enviar dados sensíveis para fora, `git push --force`, exclusões em massa e a destruição irreversível de arquivos que já existiam antes da sessão. Mesmo assim a documentação avisa: "o modo auto reduz os pedidos de permissão, mas não garante segurança".

## Como trocar de modo

Durante a sessão, pressione **Shift+Tab** para alternar. Partindo do auto, o primeiro toque vai para o manual e depois o ciclo segue `default` → `acceptEdits` → `plan` (e de volta ao auto, quando disponível). A barra de status mostra o modo ativo: `⏸ manual mode on`, `⏵⏵ accept edits on`, `⏸ plan mode on`, `⏵⏵ auto mode on`. No Windows, se Shift+Tab não funcionar no seu terminal, a documentação cita **Alt+M** como alternativa.

Para já começar em um modo:

```powershell
claude --permission-mode plan
```

Os valores aceitos são `default` (ou `manual`), `acceptEdits`, `plan`, `auto`, `dontAsk` e `bypassPermissions`. Para entrar no modo plan por um único pedido, comece a mensagem com `/plan`.

Para fixar um modo padrão em todas as suas sessões, use o arquivo de configuração do usuário (`~/.claude/settings.json`, que no Windows fica em `C:\Users\SeuUsuário\.claude\settings.json`). O exemplo oficial para começar sempre em manual é:

```json
{
  "permissions": {
    "defaultMode": "default"
  }
}
```

## `--dangerously-skip-permissions`: só em ambiente isolado

A flag `claude --dangerously-skip-permissions` equivale ao modo `bypassPermissions`: desliga os pedidos de permissão e as checagens de segurança, e os comandos executam na hora. O nome já diz: é perigoso. A tabela oficial indica esse modo para "contêineres e VMs isolados apenas". A regra para você: **nunca** use no seu computador de trabalho, onde estão os dados dos clientes, o certificado digital e o acesso ao e-mail. Se um dia precisar de execução totalmente autônoma, faça em uma máquina virtual descartável, sem acesso à sua rede e sem credenciais.

## Regras de segurança desde o início

1. **Nunca cole segredos na conversa**: senhas de sistemas, tokens de API, chaves de certificado. Credenciais ficam em variáveis de ambiente ou em arquivos fora do repositório (e no `.gitignore`).
2. **Revise antes de aprovar**: leia o diff inteiro e o comando inteiro. Um `rm` ou `Remove-Item` com caminho errado não tem desfazer.
3. **Desconfie de instruções dentro de arquivos e sites**: um PDF, um README ou uma página pode conter texto tentando mandar o agente fazer algo (**injeção de prompt**). A documentação recomenda revisar comandos sugeridos, evitar jogar conteúdo não confiável direto na conversa e verificar mudanças em arquivos críticos.
4. **Pasta de trabalho limitada**: abra o Claude Code na pasta do projeto, não no seu usuário inteiro. Em modo manual ele pede permissão para ler ou escrever fora dessa pasta.

## Erros comuns

- Pressionar Shift+Tab "para agilizar" e cair no auto sem perceber em um projeto sensível. Olhe a barra de status.
- Pressionar Shift+Tab **enquanto um pedido de permissão de arquivo está aberto**: ali a tecla não troca de modo, ela seleciona a opção "permitir pelo resto da sessão" (quando o pedido a oferece). Responda ao pedido primeiro; troque de modo depois.
- Achar que o modo auto é "automático e seguro": é menos interrupção, não ausência de risco.
- Usar `--dangerously-skip-permissions` porque "cansou de aprovar". O remédio certo é o modo accept edits ou pré-aprovar comandos específicos com `/permissions`.
- Colar o `.env` com senhas "para ele entender a configuração".

## Na prática

Rotina sugerida para o escritório: comece projetos novos em **plan** (`claude --permission-mode plan`), aprove o plano escolhendo "Yes, manually approve edits" nas primeiras vezes e, quando já confiar no fluxo de uma tarefa repetitiva (renomear arquivos de teste, por exemplo), use **accept edits**. Deixe o **auto** para tarefas longas em projetos sem dados sensíveis e **nunca** use bypass na máquina do trabalho.

## Resumo

- Permissão é o ponto em que você revisa; ler é livre, editar e rodar comandos pedem aprovação no modo manual.
- Modos atuais: `default` (Manual), `acceptEdits`, `plan`, `auto`, `dontAsk`, `bypassPermissions`.
- Shift+Tab alterna; `--permission-mode` define no início; `permissions.defaultMode` fixa no `settings.json`.
- `--dangerously-skip-permissions` = bypass: só em contêiner ou VM isolada.
- Sem segredos na conversa; leia diffs e comandos; desconfie de instruções vindas de arquivos e sites.
