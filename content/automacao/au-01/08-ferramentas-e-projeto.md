Nesta lição você vai conhecer o mapa das ferramentas de automação em 2026 (no-code, RPA, código e IA), o que cada família faz bem e mal, e um roteiro para escolher. Ao final, vai fazer o projeto do módulo: mapear e priorizar três processos do seu trabalho. Isso importa porque agora você precisa decidir **com o quê** construir, e a escolha errada vira um fluxo frágil ou um projeto que nunca termina.

## As quatro famílias

### 1. Ferramentas de fluxo sem código (no-code / low-code)

**Make**, **n8n**, **Zapier** e **Power Automate** (Microsoft) são ferramentas visuais em que você monta um fluxo encadeando blocos: um gatilho ("novo formulário recebido") seguido de ações ("adicionar linha na planilha", "enviar e-mail"). Cada bloco conecta a um serviço (Google Sheets, Gmail, WhatsApp, APIs genéricas).

- **Fazem bem:** integrar serviços com API, fluxos de evento (chegou algo, faça algo), agendamentos, lógica simples.
- **Fazem mal:** lógica muito complexa, volumes grandes, sistemas sem API.
- **Para quem:** quem não programa e precisa entregar rápido. É o foco do próximo módulo.

### 2. RPA (automação robótica de processos)

**UiPath**, **Power Automate Desktop** e similares gravam e reproduzem ações na tela: abrir um programa, clicar, digitar, copiar. É o "robô que usa o computador como uma pessoa".

- **Faz bem:** sistemas antigos sem API (portal da prefeitura, sistema contábil de mesa, site do banco que só tem tela).
- **Faz mal:** é frágil; qualquer mudança de layout quebra o robô. Precisa de uma máquina ligada.
- **Para quem:** quem tem processos presos em telas e aceita manutenção frequente.

### 3. Código (Python)

Scripts em **Python** fazem qualquer coisa: ler arquivos, chamar APIs, processar milhares de linhas, gerar relatórios. Bibliotecas como `pandas` (tabelas), `requests` (APIs) e `openpyxl` (Excel) resolvem o grosso do trabalho de escritório.

- **Faz bem:** volume, lógica complexa, controle total, custo baixo de operação.
- **Faz mal:** exige aprender a programar e alguém para manter.
- **Para quem:** quem está disposto a estudar (o curso de Python deste site existe para isso) ou tem alguém técnico na equipe.

### 4. IA: APIs de modelos de linguagem e agentes

Modelos de linguagem (LLMs) acessíveis por API, como os da Anthropic, OpenAI e Google, leem e produzem texto: classificam um e-mail, extraem dados de uma nota em PDF, resumem um contrato. **Agentes** são programas que usam um LLM para decidir, passo a passo, quais ferramentas acionar (consultar o CNPJ, criar a pasta, enviar o e-mail) para cumprir um objetivo.

- **Faz bem:** texto não estruturado, em que regras fixas não bastam.
- **Faz mal:** precisão absoluta. Um LLM pode errar um número; tudo que é fiscal precisa de conferência ou validação por regra.
- **Para quem:** quem já tem o fluxo estruturado e quer tratar a parte "bagunçada". A IA entra como um bloco dentro de um fluxo ou script, não como substituta.

## Como escolher

Use este roteiro, nesta ordem:

1. **Origem e destino têm API ou conector pronto?** Sim: ferramenta de fluxo. Não: RPA (ou peça ao fornecedor a API; muitos têm e não divulgam).
2. **O processo lida com texto livre ou documentos variados?** Sim: acrescente um passo de IA, com validação depois.
3. **Volume grande ou lógica complexa?** Sim: Python, possivelmente disparado pela ferramenta de fluxo.
4. **Quem vai manter?** Ninguém programa: no-code. Há alguém técnico: código dá mais controle e custa menos por execução.
5. **Dados sensíveis?** Considere n8n hospedado pelo escritório (self-hosted) ou Python local.
6. **Custo total?** Assinatura + horas de construção + manutenção. Volte ao payback da lição 3.

| Situação | Primeira escolha |
|---|---|
| Formulário → planilha → e-mail | Make, n8n ou Zapier |
| Já usa Microsoft 365 em tudo | Power Automate |
| Baixar extrato de banco sem API | RPA |
| Processar 20 mil lançamentos | Python |
| Classificar e-mails de clientes por assunto | Fluxo no-code + passo de IA |
| Dados sensíveis, controle total | n8n self-hosted ou Python local |

> **Dica:** a combinação mais comum em escritórios em 2026 é "ferramenta de fluxo como espinha dorsal, blocos de IA onde há texto livre e um script Python quando o volume aperta". Não é preciso escolher uma única família.

## Panorama rápido

- **Make:** visual, bom para iniciantes, cobra por operações executadas.
- **n8n:** visual, com código-fonte disponível para leitura (licença própria, chamada *fair-code*, que não é "open source" no sentido estrito), pode ser hospedado pelo escritório; mais técnico.
- **Zapier:** o mais simples e antigo; catálogo enorme; tende a custar mais em volume.
- **Power Automate:** integrado ao Microsoft 365; a versão Desktop faz RPA.
- **UiPath:** líder em RPA corporativo; mais pesado do que um escritório pequeno costuma precisar.
- **Python:** gratuito; o custo é o seu tempo de aprendizado.
- **APIs de LLM:** cobradas por volume de texto; preços e modelos mudam com frequência, consulte a documentação atual.

Preços, limites e botões mudam o tempo todo; o critério não muda.

## Erros comuns

- **Escolher a ferramenta antes do processo.** Assinar o Make e só depois descobrir que o sistema contábil não tem API (o que pedia RPA).
- **Usar RPA onde existe API.** O robô de tela é frágil; se o fornecedor oferece API ou exportação automática, prefira o fluxo.
- **Confiar em números extraídos por IA sem validação.** Um LLM pode trocar um dígito; valor fiscal sempre passa por regra ou conferência humana.
- **Escolher o self-hosted sem ninguém para manter.** Servidor parado é fluxo parado; sem pessoa técnica, a nuvem costuma sair mais barata.
- **Querer resolver tudo com uma única família.** O normal é combinar: fluxo como espinha dorsal, IA e Python como blocos.

## Na prática

Antes de assinar qualquer ferramenta, faça o teste de uma hora: abra a versão gratuita de Make ou n8n, procure os conectores dos seus dois sistemas mais usados (e-mail, planilha, sistema contábil) e veja se existem. Se o sistema contábil não aparece, abra a documentação dele e procure a palavra "API". Esse teste responde a primeira pergunta do roteiro sem gastar um real.

## Projeto do módulo: três processos do seu trabalho

Entregue um documento (planilha ou texto) com:

**Parte 1: levantamento.** Liste de cinco a dez tarefas repetitivas do seu trabalho e marque os quatro critérios da lição 1 em cada uma.

**Parte 2: três processos mapeados.** Escolha os três mais fortes. Para cada um: nome e gatilho; entradas, passos, decisões, saídas e exceções (lição 2); fluxograma em texto ou desenho.

**Parte 3: medição e priorização.** Para cada processo: tempo por execução, execuções por mês, custo da hora, retrabalho, custo mensal, esforço para automatizar e payback (lição 3). Posicione os três na matriz esforço × impacto.

**Parte 4: dados, integrações e riscos.** De onde vêm os dados e em que formato (lição 4); os sistemas têm API ou webhook (lição 5); credenciais e dados pessoais envolvidos (lição 6); o que pode falhar e como o fluxo reage (lição 7).

**Parte 5: ferramenta e primeiro passo.** Para o processo prioritário, escolha a família de ferramenta com o roteiro desta lição e escreva o primeiro passo concreto para a próxima semana.

A rubrica está no exercício final. Guarde o documento: no próximo módulo você vai construir o primeiro desses fluxos.

## Resumo

- Quatro famílias: fluxo sem código (Make, n8n, Zapier, Power Automate), RPA (UiPath, Power Automate Desktop), código (Python) e IA (APIs de LLM, agentes).
- Com API, use fluxo; sem API, RPA; texto livre pede IA com validação; volume e lógica complexa pedem Python.
- Decida por: API disponível, texto livre, volume, quem mantém, sensibilidade dos dados, custo total.
- Combine: fluxo como espinha dorsal, IA e Python como blocos.
- O projeto consolida o módulo: levantar, mapear, medir, priorizar, avaliar riscos e escolher a ferramenta.
