Nesta lição você vai conhecer os cinco limites que mais causam problemas no uso profissional de IA — alucinação, corte de conhecimento, viés, inconsistência e dependência de contexto —, vai aprender um método simples para verificar as saídas e vai saber identificar as situações em que a IA não deve ser usada. Para quem assina documentos com responsabilidade legal, esta é a lição mais importante do módulo.

## Alucinação: o erro que parece acerto

**Alucinação** é quando o modelo produz uma informação falsa com a mesma fluência e confiança de uma verdadeira. Ele pode citar um artigo de lei que não existe, inventar o número de uma instrução normativa, atribuir uma decisão a um tribunal errado ou criar uma estatística redonda e convincente.

Isso acontece porque o modelo não consulta uma tabela de fatos; ele gera o texto mais plausível. Quando o fato real é raro no treinamento, o "plausível" vence o "verdadeiro". Quanto mais específico o pedido (número, data, valor, nome), maior o risco.

```text
Prompt:
Qual é o artigo da CLT que trata do aviso prévio proporcional?

Resposta esperada (resumo):
Um modelo cuidadoso cita o art. 487 da CLT e a Lei 12.506/2011, que criou
a proporcionalidade (30 dias, mais 3 por ano trabalhado, até o total de
90 dias). Um modelo descuidado pode inventar um número de artigo ou um
limite de dias.
Trate QUALQUER referência legal gerada como hipótese até conferir
no texto oficial.
```

Sinais de alerta: números muito redondos, citações sem link, referências com formato correto mas que você nunca viu, e respostas detalhadas demais para uma pergunta que exigiria "depende".

## Corte de conhecimento

Todo modelo tem uma **data de corte**: o momento até o qual os textos de treinamento foram coletados. Tudo depois disso ele desconhece — uma lei nova, uma tabela do INSS reajustada, o salário mínimo deste ano, uma versão nova de um sistema. O perigo é que ele **não avisa**: pergunte a tabela do IRRF e ele responderá a que conhece, como se fosse a atual.

Algumas ferramentas contornam isso com **busca na internet** integrada. Quando isso está ativado, o modelo lê páginas atuais antes de responder. Mesmo assim, confira a fonte: ele pode ter lido uma página desatualizada ou de má qualidade.

## Viés

O modelo aprendeu com textos escritos por pessoas, com todos os seus vieses. Ele pode assumir que "o contador" é homem, que uma pequena empresa é de um ramo específico, que a prática de um país vale para o Brasil, ou reproduzir opiniões populares como se fossem consenso técnico. Em temas sensíveis — seleção de pessoas, crédito, decisões sobre clientes — isso é risco legal, não só de qualidade.

## Inconsistência

A mesma pergunta pode ter respostas diferentes em conversas diferentes, por causa da aleatoriedade na geração. Mais sutil: uma mudança pequena no seu pedido (uma palavra, a ordem das frases) pode mudar a resposta. Por isso, em processos repetitivos, você vai padronizar os prompts (módulo 2) e testar mais de uma vez.

## Dependência de contexto

O modelo só vê o que está na conversa. Ele não conhece seu cliente, seu escritório, seu regime tributário, o que você disse na conversa de ontem nem o arquivo que está na sua área de trabalho. Se a resposta veio genérica, quase sempre é porque faltou contexto. E se você forneceu um contexto errado, ele vai construir uma resposta coerente com o erro — sem avisar.

## Como verificar saídas: o método dos três níveis

Nem toda saída precisa do mesmo rigor. Classifique pelo **custo de estar errado**:

| Nível | Exemplo | Como verificar |
|---|---|---|
| Baixo | Rascunho de e-mail interno, ideias para um post, nome de uma pasta | Leia e ajuste. Seu bom senso basta. |
| Médio | Resumo de uma norma, explicação para um cliente, checklist de fechamento | Confira os pontos-chave na fonte original. Peça ao modelo que cite o trecho em que se baseou. |
| Alto | Valor de tributo, prazo legal, parecer, cláusula contratual, cálculo trabalhista | Refaça ou confirme em fonte oficial (lei, site do órgão, sistema). A IA aqui é rascunho, nunca resposta final. |

Técnicas que ajudam em qualquer nível:

- **Peça a fonte** e abra a fonte. Se o link não existe ou não diz aquilo, a resposta cai.
- **Pergunte o contrário**: "quais são os argumentos contra essa conclusão?" Se ele muda de ideia facilmente, a primeira resposta era fraca.
- **Faça a mesma pergunta duas vezes**, em conversas separadas. Divergência é sinal de incerteza.
- **Dê o documento, não a pergunta solta.** Anexar a lei e pedir "com base neste texto" reduz muito a alucinação, porque ele passa a copiar e interpretar em vez de lembrar.

## Quando NÃO usar IA

- Quando você **não consegue verificar** o resultado e o erro tem consequência (multa, autuação, prejuízo ao cliente).
- Quando o insumo é **dado sigiloso** e a ferramenta não tem garantia contratual de privacidade (lição 6).
- Quando a tarefa exige **informação atual** e a ferramenta não tem busca ou acesso ao sistema.
- Quando a decisão é **julgamento profissional** que a norma atribui a você: assinatura de demonstrações, opinião sobre regime, responsabilidade técnica.
- Quando o cliente ou a empresa **proíbe** o uso para aquele tipo de dado ou processo.

## Responsabilidade profissional: quem assina responde

O contador que assina um balanço, uma declaração ou um parecer responde por ele perante o CRC, o fisco e o cliente — e isso não muda se o conteúdo foi rascunhado por IA. "A ferramenta errou" não é defesa. O Código de Ética da profissão exige zelo e competência técnica; usar uma ferramenta sem conferir o resultado é, na prática, o oposto disso.

A postura correta é tratar a IA como um **estagiário muito rápido e muito confiante**: você delega o rascunho, revisa cada entrega relevante e mantém a responsabilidade final. Documentar o que foi feito com IA (lição 7) protege você e o escritório.

## Erros comuns

1. **Verificar só quando a resposta parece estranha.** As piores alucinações parecem perfeitas.
2. **Pedir para a própria IA confirmar se ela está certa.** Ela tende a confirmar. Use fonte externa.
3. **Aceitar "segundo a legislação vigente" como se fosse citação.** É frase de efeito; exija o dispositivo e confira.
4. **Confundir busca ativada com infalibilidade.** Busca melhora a atualidade, não garante a interpretação.

## Na prática

Um cliente pergunta por e-mail se pode demitir um funcionário no período de estabilidade por acidente. Você usa a IA para montar um rascunho de resposta e listar os dispositivos relevantes (nível alto). Antes de enviar, abre a Lei 8.213/1991 e confere o art. 118, verifica se há convenção coletiva aplicável e ajusta o texto. A IA economizou 20 minutos de redação; a conferência, que é sua, levou 5. Esse é o equilíbrio.

## Resumo

- Alucinação é informação falsa com aparência de verdadeira; o risco cresce com a especificidade do pedido.
- Corte de conhecimento, viés, inconsistência e falta de contexto são limites estruturais, não defeitos passageiros.
- Verifique pelo custo do erro: baixo (bom senso), médio (fonte original), alto (refazer ou confirmar em fonte oficial).
- Não use IA quando não pode verificar, quando o dado é sigiloso sem garantia, ou quando a decisão é sua por lei.
- Quem assina responde. A IA é um estagiário rápido; a responsabilidade continua sendo sua.
