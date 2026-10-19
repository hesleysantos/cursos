# Frameworks e plataformas de agentes

Nesta lição você vai conhecer as principais ferramentas para construir agentes em 2026, entender o que cada uma faz de diferente e usar critérios objetivos para escolher. Ao final, você vai saber ler a estrutura de um agente simples em Python e decidir se, para o seu caso, faz mais sentido o n8n, um SDK de código ou uma chamada direta à API.

## Por que existem frameworks

Na lição 1 você viu que o laço de um agente cabe em vinte linhas. Então para que um framework? Porque o laço é a parte fácil. O trabalho real está em: guardar histórico, limitar passos, tratar erros de ferramenta, pausar para aprovação humana, retomar depois, registrar tudo e coordenar mais de um agente. Frameworks empacotam essas partes. O preço é aprender as abstrações deles e depender das decisões de outra pessoa.

## O panorama em 2026

| Ferramenta | Tipo | Ideia central | Para quem |
|---|---|---|---|
| **LangChain / LangGraph** | Biblioteca Python/JS | LangGraph modela o agente como um **grafo** de nós e arestas com estado persistente (checkpoints) | Quem precisa de controle fino do fluxo e retomada |
| **CrewAI** | Biblioteca Python | **Equipes** de agentes com papel, objetivo e histórico, executando tarefas em sequência ou hierarquia | Quem quer multiagente com pouca configuração |
| **OpenAI Agents SDK** | Biblioteca Python/JS | Agente = instruções + ferramentas; **handoffs** entre agentes e **guardrails** embutidos | Quem usa modelos da OpenAI |
| **Claude Agent SDK** (Anthropic) | Biblioteca Python/TS | O mesmo motor do Claude Code como biblioteca: ferramentas de arquivo e terminal prontas, MCP, subagentes, permissões | Agentes que mexem em arquivos e código |
| **n8n AI Agent** | Nó visual do n8n | Nó "AI Agent" com sub-nós de modelo, memória e ferramentas (outros nós do n8n) | Quem já automatiza no n8n e quer agente sem código |
| **Make AI Agents** | Recurso do Make | Agente configurado na interface, usando cenários do Make como ferramentas | Quem já usa Make |

Além deles, há o **tool runner** dos SDKs oficiais de API (Anthropic e OpenAI), que executa o laço de ferramentas sem framework nenhum, e os **agentes gerenciados** na nuvem, em que o provedor roda o laço e um ambiente isolado para você. Nomes e versões mudam rápido; o que não muda é a classificação: visual sem código, biblioteca de código ou serviço gerenciado.

## Critérios de escolha

1. **Quem vai manter?** Se o escritório não tem programador, n8n ou Make. Se há alguém de Python, um SDK.
2. **Onde estão as ferramentas?** Se tudo já está em cenários do Make ou fluxos do n8n, use o agente nativo dessas plataformas; as ferramentas viram sub-nós.
3. **Precisa pausar e retomar?** Aprovação humana que leva horas exige estado persistente: LangGraph (checkpoints) e os agentes gerenciados fazem isso nativamente; n8n tem o nó "Wait" e formulários.
4. **Um agente ou vários?** Comece com um. CrewAI e os handoffs do OpenAI SDK só valem quando um agente só fica confuso (lição 6).
5. **Dependência de fornecedor**: LangGraph e CrewAI funcionam com vários modelos; os SDKs da OpenAI e da Anthropic são pensados para os modelos deles (alguns aceitam outros, com limitações).
6. **Observabilidade**: veja se a ferramenta mostra cada passo, custo e erro. Sem isso, depurar um agente é adivinhação.

> **Dica:** antes de escolher framework, escreva o agente "na unha" com a API, como abaixo. Se ficar bom em 100 linhas, talvez você não precise de framework.

## Estrutura de um agente simples em Python

O esqueleto a seguir é independente de framework. Ele simula o modelo com uma função para rodar sem rede; na vida real, `decidir()` é uma chamada à API com a lista de ferramentas (lição 2).

```python
import json

FERRAMENTAS = {}

def ferramenta(fn):
    """Decorator: registra a funcao como ferramenta pelo nome."""
    FERRAMENTAS[fn.__name__] = fn
    return fn

@ferramenta
def listar_pendencias(cnpj: str) -> str:
    base = {"11222333000181": ["DAS 09/2026", "Extrato set/2026"]}
    return json.dumps(base.get(cnpj, []))

@ferramenta
def buscar_cnpj(nome: str) -> str:
    return "11222333000181" if "padaria" in nome.lower() else ""

def decidir(historico):
    """Simula o modelo: devolve uma acao a partir do historico."""
    ultimo = historico[-1]
    if ultimo["role"] == "user":
        return {"tool": "buscar_cnpj", "args": {"nome": ultimo["content"]}}
    if ultimo.get("tool") == "buscar_cnpj":
        return {"tool": "listar_pendencias", "args": {"cnpj": ultimo["content"]}}
    return {"final": f"Pendencias: {ultimo['content']}"}

def rodar(pergunta, max_passos=6):
    historico = [{"role": "user", "content": pergunta}]
    for _ in range(max_passos):
        acao = decidir(historico)
        if "final" in acao:
            return acao["final"]
        fn = FERRAMENTAS.get(acao["tool"])
        if fn is None:
            historico.append({"role": "tool", "tool": acao["tool"], "content": "erro: ferramenta inexistente"})
            continue
        resultado = fn(**acao["args"])
        historico.append({"role": "tool", "tool": acao["tool"], "content": resultado})
    return "Limite de passos; escalar para humano."

print(rodar("Pendencias da Padaria Sol"))
# Pendencias: ["DAS 09/2026", "Extrato set/2026"]
```

Os frameworks fazem exatamente isso com mais recursos: o decorator `@ferramenta` vira `@tool` (LangChain), `@function_tool` (OpenAI Agents SDK) ou `@beta_tool` (SDK da Anthropic); o `historico` vira estado com checkpoint; o `max_passos` vira configuração. Quando for usar um deles, leia a documentação da versão instalada: assinaturas mudam entre versões, e um tutorial de 2024 provavelmente não roda em 2026.

## Como fica no n8n

No n8n, o nó **AI Agent** recebe a mensagem (de um webhook, do WhatsApp, de um formulário), e você conecta a ele três tipos de sub-nó: um **modelo de chat** (OpenAI, Anthropic, Google, Ollama local), uma **memória** (janela de mensagens, Redis, Postgres) e **ferramentas** (um nó do Google Sheets como ferramenta, uma requisição HTTP, um sub-workflow, um servidor MCP). O agente decide quais ferramentas chamar; o n8n mostra cada passo no log de execução. Para o escritório que já tem fluxos no n8n, é o caminho mais curto.

## Armadilhas

- **Começar pelo framework mais famoso**, e não pelo problema. Muitas pessoas instalam LangGraph para algo que o nó do n8n resolve.
- **Tutoriais desatualizados**: a área muda a cada poucos meses. Prefira a documentação oficial e confira a versão.
- **Multiagente no primeiro dia**: complexidade sem necessidade.
- **Esquecer custo**: frameworks que fazem várias chamadas por passo (planejar, criticar, revisar) multiplicam a conta. Meça tokens por tarefa.

## Na prática

Um escritório com dois contadores e um analista que sabe Python precisava de um assistente que lesse a planilha de obrigações e respondesse no WhatsApp. Avaliaram três opções: nó AI Agent do n8n (que já usavam), LangGraph e o SDK de agentes da Anthropic. Escolheram o n8n: as ferramentas já existiam como fluxos, o log de execução servia de auditoria e a aprovação humana saiu com um nó de espera e um botão no Slack. Seis meses depois, quando precisaram de retomada de tarefas longas e testes automatizados, migraram só a parte central para Python com LangGraph, mantendo o n8n como entrada e saída.

## Resumo

- Frameworks resolvem o que está em volta do laço: estado, limites, erros, aprovação, retomada e coordenação.
- Em 2026, as opções principais são LangGraph, CrewAI, OpenAI Agents SDK, Claude Agent SDK, o nó AI Agent do n8n e os agentes do Make, além do tool runner dos SDKs e agentes gerenciados.
- Escolha por quem mantém, onde estão as ferramentas, necessidade de pausa e retomada, número de agentes, dependência de fornecedor e observabilidade.
- Escreva primeiro o agente simples com a API; adote um framework quando sentir a falta de algo concreto.
- Leia a documentação da versão instalada; assinaturas mudam rápido.
