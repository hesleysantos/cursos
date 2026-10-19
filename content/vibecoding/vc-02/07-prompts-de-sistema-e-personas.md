Nesta lição você vai aprender o que é um prompt de sistema (as instruções permanentes que moldam todas as respostas), como criar assistentes personalizados com Projects, GPTs e recursos equivalentes, como anexar uma base de conhecimento e como definir guardrails — limites que o assistente não deve ultrapassar. No final, você vai construir o "assistente do escritório": um ajudante configurado uma vez e usado por toda a equipe.

## Prompt de sistema: a instrução que fica

Até aqui, você escreveu instruções a cada pedido. O **prompt de sistema** (ou instruções personalizadas) é um texto que a ferramenta coloca **antes de toda conversa**, de forma invisível. Ele define quem o assistente é, como responde, o que sabe sobre você e o que deve evitar. O modelo trata essas instruções com prioridade maior que as mensagens comuns.

Onde ele aparece: nas configurações de "instruções personalizadas" do assistente, nas instruções de um projeto, na criação de um GPT ou Gem, e no parâmetro ou na mensagem `system` das APIs. O nome muda; a ideia é a mesma.

Um bom prompt de sistema tem:

1. **Identidade e público**: "Você é o assistente do escritório X, que atende pequenas empresas em Sergipe."
2. **Tom e idioma**: "Responda em português do Brasil, de forma direta e cordial."
3. **Regras fixas**: "Cite o dispositivo legal ao afirmar qualquer regra. Nunca invente números; escreva 'confirmar' quando não tiver certeza."
4. **Formato padrão**: "Prefira tópicos curtos. E-mails com até 120 palavras."
5. **Limites (guardrails)**: "Não dê orientação sobre investimentos. Não processe dados pessoais; se o usuário colar CPF, peça para anonimizar."
6. **Contexto do negócio**: regimes atendidos, sistemas usados, prazos internos.

## Personas: útil, com moderação

**Persona** é o papel que o assistente assume. Funciona porque ativa o vocabulário e o nível certos. "Assistente de departamento pessoal" responde de um jeito; "revisor rigoroso de textos para clientes" responde de outro. O que não funciona é persona teatral ("o maior contador do universo") ou personas contraditórias no mesmo assistente. Um assistente, um papel claro. Se precisa de dois papéis, crie dois assistentes.

## Projects, GPTs e Gems: assistentes personalizados

As principais ferramentas oferecem um jeito de empacotar prompt de sistema + arquivos + configurações:

- **Projects** (Claude e ChatGPT): um espaço com instruções e arquivos; todas as conversas dentro dele herdam isso.
- **GPTs** (ChatGPT): um assistente nomeado, com instruções, arquivos e, opcionalmente, ações externas; pode ser compartilhado com a equipe ou publicado.
- **Gems** (Gemini): o equivalente no ecossistema Google.
- **Agentes e Copilots personalizados** (Microsoft): o equivalente no Microsoft 365.

Os recursos exatos mudam com frequência; consulte a documentação atual da sua ferramenta. O importante é a prática: **configure uma vez, use muitas vezes**, e revise quando algo sair errado.

## Base de conhecimento

Anexar arquivos ao assistente cria uma **base de conhecimento**: documentos que ele consulta antes de responder. Para o escritório, candidatos naturais:

- Manual de procedimentos internos (como fechar o mês, quem aprova o quê).
- Modelos de e-mail e de documentos.
- Tabela de honorários e política de prazos.
- Glossário de termos que o escritório usa de um jeito específico.
- Resumos de normas recorrentes (feitos e conferidos por vocês).

Regras: só documentos **revisados** (se o manual está errado, o assistente vai repetir o erro com confiança), **sem dados de clientes** (a menos que a conta tenha garantia de dados e a política permita), e **com data** no nome do arquivo para você saber o que está desatualizado.

## Guardrails: o que o assistente não deve fazer

**Guardrails** são as grades de proteção. Num assistente de escritório, os mais importantes:

- **Escopo**: "Responda apenas sobre temas contábeis, fiscais e trabalhistas do escritório. Para outros assuntos, diga que não é o assistente adequado."
- **Incerteza**: "Quando não tiver certeza, diga. Nunca invente prazo, valor ou artigo."
- **Dados**: "Se o usuário enviar dados pessoais identificáveis, peça para anonimizar antes de continuar."
- **Decisão**: "Você apoia a análise; a decisão e a assinatura são do contador responsável. Lembre isso em pareceres."
- **Formato**: "Nunca responda com mais de X palavras sem que o usuário peça."

Guardrails não são infalíveis — um usuário insistente ou um texto colado com instruções escondidas podem contorná-los —, mas reduzem muito os erros do dia a dia e padronizam o comportamento.

## Construindo o assistente do escritório

Junte as peças num prompt de sistema completo:

```text
Você é o Assistente Interno do escritório contábil "Contas Claras",
que atende pequenas empresas (comércio e serviços) nos regimes Simples
Nacional e Lucro Presumido. Seus usuários são a equipe do escritório.

Como responder: em português do Brasil, direto e cordial, em tópicos
curtos. E-mails para clientes com até 120 palavras, assinados "Equipe
Contas Claras".

Regras: ao afirmar uma regra legal, cite o dispositivo. Nunca invente
números, prazos ou artigos; quando não tiver certeza, escreva
"CONFIRMAR" e indique onde conferir. Use os documentos anexos
(manual de procedimentos, modelos de e-mail) como referência principal
quando o assunto estiver neles.

Limites: responda só sobre temas contábeis, fiscais, trabalhistas e
de organização do escritório. Se receber dados pessoais identificáveis,
peça para anonimizar antes de continuar. Lembre, em qualquer análise
que possa virar parecer, que a decisão final é do contador responsável.

Resposta esperada (resumo):
Com esse prompt de sistema, um simples "faz o e-mail de cobrança de
documentos da Padaria X" já sai no tom, no tamanho e com a assinatura
certos — e uma pergunta sobre investimentos recebe uma recusa educada.
```

Teste com dez pedidos típicos da equipe e três "ataques" (dado pessoal, assunto fora do escopo, pedido de número que ele não deveria inventar). Ajuste até passar em todos.

## Erros comuns

1. **Prompt de sistema gigante.** Vinte parágrafos de regras se contradizem e o modelo ignora parte. Seja enxuto e priorize.
2. **Base de conhecimento com documentos antigos ou errados.** O assistente vira um propagador de erro.
3. **Esperar que o guardrail substitua a política.** A proteção técnica apoia, não substitui, as regras da lição de privacidade.
4. **Nunca revisar.** Normas mudam, procedimentos mudam; marque uma revisão trimestral.
5. **Um assistente para tudo.** Papéis diferentes em assistentes diferentes.

## Na prática

Monte o assistente do escritório esta semana com o prompt acima adaptado, três documentos revisados e os guardrails. Compartilhe com uma pessoa da equipe, peça que use por três dias e anote o que saiu errado. Corrija o prompt de sistema, não as respostas uma a uma. Esse assistente é a base dos módulos seguintes, quando ele ganhará ferramentas e automações.

## Resumo

- O prompt de sistema é a instrução permanente: identidade, tom, regras, formato, limites e contexto.
- Persona clara e única por assistente; nada de personas teatrais.
- Projects, GPTs, Gems e agentes empacotam instruções e arquivos; configure uma vez, use muitas.
- Base de conhecimento só com documentos revisados, datados e sem dados de clientes sem garantia.
- Guardrails de escopo, incerteza, dados e decisão reduzem erros; teste com pedidos normais e com "ataques".
