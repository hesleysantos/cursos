Nesta lição você vai aprender a organizar, versionar e compartilhar os prompts do escritório, a medir se eles estão dando resultado e a evitar os erros mais comuns de quem já domina o básico. No final, há o projeto do módulo: uma biblioteca com dez prompts prontos para um escritório contábil. Prompts que vivem só na memória de uma pessoa não escalam; uma biblioteca transforma conhecimento individual em processo da equipe.

## Por que uma biblioteca

Depois de algumas semanas, cada pessoa do escritório terá meia dúzia de prompts que funcionam. Sem organização, acontece o de sempre: cada um refaz o que o outro já fez, as versões divergem, o estagiário usa um prompt velho e o resultado piora sem ninguém saber por quê. A biblioteca resolve isso com três regras: um lugar, um formato, um responsável.

## Formato de cada prompt na biblioteca

Cada entrada tem:

- **Nome** curto e descritivo: "E-mail de cobrança de documentos".
- **Quando usar** (uma frase) e **quando não usar**.
- **Variáveis** a preencher, com exemplo.
- **O prompt** em si.
- **Exemplo de saída aprovada** (anonimizado).
- **Critérios de aceite** (lição 4) e **casos de teste**.
- **Versão, data e autor**.
- **Nível de verificação** exigido antes de usar a saída (baixo, médio, alto).

```text
NOME: Resumo de norma para a equipe
QUANDO USAR: nova IN, portaria ou lei relevante para os clientes.
QUANDO NÃO USAR: pareceres para cliente (use o prompt "Parecer").
VARIÁVEIS: {PUBLICO} (equipe | sócios), {N_TOPICOS} (padrão 8).
VERIFICAÇÃO: média — conferir 2 artigos citados na fonte.
VERSÃO: 1.2 (03/2026) — acrescentada a regra "sem prazo no texto".

PROMPT:
Com base exclusivamente no documento anexo, produza (1) uma frase
dizendo o que a norma faz; (2) até {N_TOPICOS} tópicos com as mudanças,
cada um com o artigo entre parênteses; (3) até 3 ações para um escritório
contábil, com prazo. Se não houver prazo, escreva "sem prazo no texto".
Público: {PUBLICO}. Não acrescente informação de fora do documento.

Resposta esperada (resumo):
Qualquer pessoa da equipe consegue usar sem perguntar nada a quem criou.
```

## Onde guardar e como versionar

Serve um documento compartilhado, uma pasta de arquivos de texto, uma planilha ou uma ferramenta de notas. O critério é: todos acessam, há histórico de alterações e alguém é dono. **Versionar** significa que toda mudança gera uma versão nova com data e motivo, e a anterior fica guardada. Se a versão 1.3 começar a dar resultados piores (a ferramenta mudou, por exemplo), você volta para a 1.2 em um minuto e sabe o que mudou.

Convenção simples: número de versão com dois níveis (1.0, 1.1, 2.0), data, e uma linha de "o que mudou". Mudança grande (reescrita) sobe o primeiro número; ajuste pequeno sobe o segundo.

## Compartilhar com a equipe

- **Apresente**, não apenas disponibilize: 20 minutos mostrando três prompts e como usar rende mais que um link.
- **Um responsável por prompt**: quem recebe sugestões e decide mudanças.
- **Canal de feedback**: uma coluna "problemas encontrados" na planilha ou um grupo de mensagens.
- **Vincule aos assistentes**: os prompts mais usados viram instruções do assistente do escritório (lição 7), e a biblioteca guarda a versão "oficial".

## Medir resultado

Sem medida, a biblioteca vira estante de enfeite. Três indicadores simples:

1. **Taxa de aprovação**: de cada 10 usos, quantas saídas foram aceitas sem reescrita grande? Anote por um mês. Abaixo de 7, o prompt precisa de ajuste.
2. **Tempo economizado**: quanto a tarefa levava antes e quanto leva agora, incluindo a verificação. Se a verificação come o ganho, a tarefa talvez não seja boa para IA.
3. **Erros encontrados na verificação**: quantos e de que tipo (número inventado, tom, formato). O tipo de erro indica a parte do prompt a corrigir (lição 1).

Uma planilha com data, prompt, versão, aprovado (sim/não), tempo e tipo de erro basta — e serve de registro de uso de IA, atendendo à política do escritório.

## Erros comuns de quem já sabe o básico

- **Vagueza disfarçada de concisão.** "Resuma" com contexto de uma linha ainda é vago.
- **Excesso.** Prompts de duas páginas, cheios de regras que se contradizem; o modelo ignora parte e você não sabe qual.
- **Confiar sem checar** porque "esse prompt sempre funcionou". Ferramentas mudam; casos novos aparecem.
- **Copiar prompts da internet sem adaptar.** O contexto é outro, o regime é outro, o idioma às vezes é outro.
- **Não anonimizar nos exemplos** da biblioteca. Um exemplo com CNPJ real num documento compartilhado é vazamento.
- **Deixar a biblioteca morrer.** Sem responsável e sem revisão, em seis meses ninguém usa.

## Projeto: dez prompts para um escritório contábil

Monte sua biblioteca inicial com estes dez prompts, cada um no formato da lição. A maioria você já viu em forma de exemplo neste módulo ou no anterior e pode adaptar; os demais (como a resposta a dúvida de cliente e a ata de reunião) você constrói com a anatomia da lição 1 e as técnicas da lição 2:

1. **E-mail de cobrança de documentos** (variáveis: cliente, documentos, prazo, tom).
2. **Resumo de norma para a equipe** (variáveis: público, número de tópicos).
3. **Extração de eventos de folha de um e-mail** (tabela fixa, "não deduza").
4. **Classificação de lançamentos bancários** (categorias do plano de contas, few-shot, "REVISAR").
5. **Fórmula de Excel a partir da descrição da planilha** (versão, idioma, explicação).
6. **Explicação de balancete para o cliente** (até 10 linhas, só números do balancete).
7. **Checklist de fechamento mensal por regime** (sem prazos específicos).
8. **Resposta a dúvida de cliente com dispositivos legais** (raciocínio em etapas, "CONFIRMAR", lembrete de decisão do contador).
9. **Revisão de texto para cliente leigo** (manter conteúdo, listar alterações).
10. **Ata de reunião a partir de anotações** (decisões, responsáveis, prazos, pendências).

Para cada um: escreva o prompt, rode com dois casos reais anonimizados, anote critérios de aceite e nível de verificação, registre a versão 1.0. Ao terminar, você terá o ativo mais valioso deste módulo — e a matéria-prima dos módulos de automação, em que vários desses prompts vão rodar sozinhos.

## Na prática

Reserve uma hora por semana, durante um mês, para a biblioteca: na primeira, os prompts que já existem em forma de exemplo; na segunda, os novos; na terceira, testes e critérios; na quarta, apresentação à equipe. Depois disso, a manutenção é de minutos por semana. O retorno é diário.

## Resumo

- Biblioteca: um lugar, um formato, um responsável; cada prompt com nome, uso, variáveis, exemplo, critérios, versão e nível de verificação.
- Versione com número, data e motivo; guarde as versões anteriores.
- Compartilhe apresentando, com responsável e canal de feedback; vincule aos assistentes do escritório.
- Meça taxa de aprovação, tempo economizado e tipos de erro; use a planilha como registro de uso de IA.
- Erros de quem já sabe: vagueza, excesso, confiar sem checar, copiar sem adaptar, exemplos com dados reais.
