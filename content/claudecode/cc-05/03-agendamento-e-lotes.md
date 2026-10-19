# Agendamento e lotes

Nesta lição você vai aprender a rodar o Claude Code **sem ninguém na frente da tela**: em horário marcado, sobre pastas inteiras de arquivos, com registro do que foi feito e sem repetir trabalho quando algo falha no meio. Também vai ver quando a API direta é melhor que o Claude Code.

## Três formas de agendar

A documentação descreve três opções, cada uma com um lugar:

| Opção | Onde roda | Precisa da máquina ligada? | Intervalo mínimo |
|---|---|---|---|
| **Routines** (nuvem, `/schedule` na CLI ou claude.ai/code/routines) | Infraestrutura da Anthropic (ou ambiente auto-hospedado) | Não; clona o repositório a cada execução | 1 hora |
| **Tarefas agendadas do app Desktop** | Seu computador, com acesso aos arquivos locais | Sim, com o app aberto e o computador acordado | 1 minuto |
| **`/loop`** dentro de uma sessão | Seu computador, na sessão aberta | Sim, com a sessão aberta | 1 minuto |

As Routines estão em prévia de pesquisa, exigem assinatura (Pro, Max, Team ou Enterprise) e rodam de forma autônoma, sem prompts de permissão. As tarefas do Desktop têm modo de permissão por tarefa e podem rodar em worktree isolado. O `/loop` é para acompanhar algo durante a sessão, e tarefas recorrentes expiram em 7 dias.

Para quem quer controle total no Windows, há a quarta opção, fora do Claude Code: o **Agendador de Tarefas** do Windows executando um script que chama `claude -p`. É a escolha quando o processamento depende de arquivos locais, de um banco local e de horários rígidos.

## Agendador de Tarefas do Windows

Crie um script `triagem.ps1` e registre com `schtasks` (PowerShell como administrador, se necessário):

```powershell
schtasks /Create /SC DAILY /ST 07:30 /TN "Totali\TriagemDocumentos" `
  /TR "powershell.exe -NoProfile -ExecutionPolicy Bypass -File C:\automacao\triagem.ps1"
```

Dentro do script, garanta o ambiente: a tarefa roda com outro perfil e sem a sua sessão aberta, então defina a chave e o diretório explicitamente.

```powershell
$env:ANTHROPIC_API_KEY = (Get-Content C:\segredos\anthropic.key -Raw).Trim()
Set-Location C:\automacao\triagem
python .\lote.py 2>&1 | Out-File .\logs\execucao.log -Append -Encoding utf8
```

Guardar a chave em arquivo protegido por ACL (ou no Gerenciador de Credenciais) é melhor que escrevê-la no script. Em Linux, o equivalente é o `cron`: `30 7 * * 1-5 /home/user/automacao/triagem.sh`.

## Processar uma pasta em lote

Classificar 50 PDFs é um laço: extrair texto, chamar `claude -p` com esquema (lição 2), gravar o resultado. A documentação de boas práticas mostra o padrão de *fan-out* em bash:

```bash
for file in $(cat files.txt); do
  claude -p "Migrate $file from Python 2 to Python 3. Return OK or FAIL." \
    --allowedTools "Edit,Bash(git commit *)" \
    --permission-mode dontAsk
done
```

O conselho oficial é testar em 2 ou 3 arquivos, ajustar o prompt e só então rodar no conjunto todo. Em Python, o laço fica assim (trecho de referência; depende do executável `claude`):

```python
import json
from pathlib import Path

def processar_pasta(pasta, classificar, registro):
    for pdf in sorted(Path(pasta).glob("*.pdf")):
        if pdf.name in registro:
            continue  # idempotencia: ja feito
        try:
            resultado = classificar(pdf)
            registro[pdf.name] = {"status": "ok", "dados": resultado}
        except Exception as e:
            registro[pdf.name] = {"status": "erro", "msg": str(e)}
        Path("registro.json").write_text(json.dumps(registro, ensure_ascii=False, indent=2), encoding="utf-8")
```

Três cuidados: **ordem estável** (`sorted`) para que reexecuções sejam previsíveis; **gravar o registro a cada item**, não só no fim, para não perder tudo se o processo cair; **capturar exceções por item**, para que um PDF ilegível não derrube os outros 49.

## Idempotência

Uma tarefa é **idempotente** quando rodá-la duas vezes produz o mesmo efeito que rodá-la uma. Em lotes com IA isso é essencial: a tarefa pode ser disparada de novo pelo agendador, pode cair no meio, ou você pode querer reprocessar só as falhas. Regras simples:

- Identifique cada item por algo estável (nome + tamanho, ou um hash do conteúdo).
- Registre o status por item: `ok`, `erro`, `revisao`.
- Pule os `ok`; reprocesse `erro` até um limite de tentativas.
- Nunca "mova e depois processe": processe e só então mova, ou grave o estado antes de mover.

## Registro (log) do que o agente fez

Além do seu `registro.json`, guarde a saída JSON completa de cada execução (ela traz `session_id`, `num_turns`, `total_cost_usd` e `permission_denials`). Isso permite auditar depois: quantos turnos, quanto custou, o que foi negado. Para investigar um caso, `claude --resume <session_id>` reabre a conversa daquela execução (a referência da CLI diz que `--continue` interativo pula as sessões criadas com `-p`, por isso guarde o `session_id` e use `--resume`).

## Quando usar a API direta em vez do Claude Code

O Claude Code é um **agente**: lê arquivos, roda comandos, decide passos. Isso custa contexto, turnos e dinheiro. Se a sua tarefa é "dado este texto, devolva esta classificação", sem ferramentas, a **API da Anthropic** (via SDK Python oficial) é mais simples e barata: uma chamada, um resultado, sem laço agêntico. A própria documentação do Agent SDK compara: use o SDK de cliente quando quer chamar a API diretamente e escrever o laço de ferramentas por conta própria. Critérios:

- Precisa ler/editar arquivos, rodar comandos, usar MCP ou Git? → Claude Code (`-p` ou Agent SDK).
- Tarefa de uma rodada, entrada e saída claras, alto volume? → API direta.
- Mistura dos dois? Faça a classificação pela API e deixe o Claude Code para o que exige ferramentas.

## Erros comuns

- Agendar sem definir `ANTHROPIC_API_KEY` no ambiente da tarefa: funciona no seu terminal, falha às 7h30.
- Confiar que a tarefa do Desktop roda com o computador dormindo (não roda; há uma execução de recuperação ao acordar).
- Lote sem registro por item: uma queda obriga a reprocessar tudo e pagar de novo.
- Usar o Claude Code para classificação pura em grande volume quando a API direta bastaria.
- Esquecer `timeout` e `--max-turns`: um item travado segura o lote inteiro.

## Na prática

Um escritório contábil costuma ter uma pasta "Recebidos" que enche todo dia. O agendamento às 7h30 processa o que chegou, grava status, move os classificados para subpastas e deixa os duvidosos em "Revisão". Quem chega às 8h encontra o trabalho organizado e um log dizendo quanto custou. Comece com o Agendador do Windows e um lote pequeno; migre para Routines quando quiser que rode mesmo com a máquina desligada e o fluxo couber em um repositório.

## Resumo

- Routines (nuvem, mínimo 1 h), tarefas do Desktop (local, app aberto) e `/loop` (sessão) são as opções nativas; o Agendador do Windows com `claude -p` dá controle total local.
- Lotes: ordem estável, registro por item gravado a cada passo, exceção por item, teste em poucos arquivos antes.
- Idempotência: identificar itens, registrar status, pular os prontos, limitar tentativas.
- Guarde a saída JSON de cada execução para auditoria e use `--resume` para investigar.
- Sem ferramentas e em alto volume, a API direta é mais simples e barata que um agente.
