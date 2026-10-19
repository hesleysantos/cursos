Nesta lição você vai construir um **assistente personalizado sem escrever código**, usando os recursos que os grandes provedores oferecem para isso — Projects (Claude), Custom GPTs (ChatGPT) e Gems (Gemini) — e vai montar o "assistente de normas do escritório". Vai aprender a escrever boas **instruções**, a alimentar uma **base de conhecimento** e a decidir quando ligar **ações e conectores**. Isso importa porque a maior parte do valor de IA em um escritório não está em apps novos, mas em assistentes que conhecem as regras da casa e respondem do jeito da casa.

## O que é um assistente personalizado

Um assistente personalizado é um chat com três coisas fixas:

1. **Instruções** (também chamadas de prompt de sistema): como ele deve se comportar, o que sabe, o que não faz, em que formato responde.
2. **Base de conhecimento**: arquivos que ele consulta antes de responder — manuais, políticas, modelos de documento, tabelas.
3. **Ferramentas** (opcional): ações que ele pode executar, como buscar na web, ler uma planilha ou chamar uma API.

Você configura uma vez; depois, qualquer conversa já começa com tudo isso carregado. É a diferença entre explicar as regras do escritório a cada pergunta e ter um colega que já as conhece.

Os três recursos têm a mesma ideia com nomes diferentes:

| Recurso | Onde | O que oferece, em termos gerais |
|---------|------|---------------------------------|
| **Projects** | Claude | Instruções do projeto, arquivos de conhecimento, conversas agrupadas; conectores a ferramentas externas |
| **Custom GPTs** | ChatGPT | Instruções, arquivos, ações (chamadas a APIs externas), compartilhamento |
| **Gems** | Gemini | Instruções e arquivos; integração com serviços do Google |

Os detalhes (limites de arquivos, planos em que estão disponíveis, formas de compartilhar) mudam com frequência: consulte a documentação atual de cada um. O método abaixo vale para os três.

## Escrevendo instruções que funcionam

Instruções boas são específicas, curtas e dizem o que fazer em caso de dúvida. Estrutura recomendada:

```text
PAPEL
Você é o assistente de normas internas do escritório Contábil Exemplo.
Responde a dúvidas da equipe sobre procedimentos, prazos internos e
padrões de documento.

FONTES
Responda APENAS com base nos arquivos anexados ao projeto. Se a resposta
não estiver neles, diga "não encontrei nas normas do escritório" e sugira
a quem perguntar. Nunca invente procedimento.

FORMATO
Resposta curta, em português do Brasil, com a citação do documento e da
seção de onde veio (ex.: "Manual de Fechamento, item 4.2").
Quando houver prazo, destaque-o em negrito.

LIMITES
Não dê orientação tributária ao cliente final; isso é com o contador
responsável. Não opine sobre legislação fora dos arquivos.
Se a pergunta envolver dado de cliente específico, peça que a pessoa
consulte o sistema em vez de tentar responder.

EXEMPLO
Pergunta: "até que dia fecho a folha?"
Resposta: "Até o **dia 25**, conforme Manual de Fechamento, item 2.1.
Se o dia 25 cair em fim de semana, antecipe para o último dia útil."
```

Cinco blocos: papel, fontes, formato, limites, exemplo. O bloco **fontes** é o que evita a invenção; o bloco **limites** é o que evita que o assistente dê um conselho que não lhe cabe. O exemplo mostra ao modelo o tom e a estrutura esperados melhor do que qualquer adjetivo.

## Base de conhecimento

Os arquivos anexados são o que o assistente "sabe". Regras para que funcionem:

- **Texto limpo**: PDF escaneado sem OCR é imagem, e o modelo não lê. Prefira arquivos de texto, Word ou PDF gerado digitalmente.
- **Um assunto por arquivo** e títulos claros ("Manual de Fechamento Mensal", "Política de Senhas", "Modelo de Proposta").
- **Data e versão** no início de cada arquivo. Quando o procedimento mudar, troque o arquivo; não deixe duas versões.
- **Tamanho razoável**: dezenas de páginas, não milhares. Para bases grandes, a lição de RAG explica o que muda.
- **Sem dados pessoais de clientes** na base. O assistente de normas não precisa de CPF de ninguém.

## Ações e conectores

Instruções e arquivos resolvem perguntas. **Ações** (Custom GPTs) e **conectores** (Projects, Gems) permitem que o assistente **faça** algo: buscar na web, ler um documento no Drive, consultar uma API do escritório. Pela lógica da lição anterior, isso o aproxima de um agente — com os mesmos cuidados: comece com leitura, exija confirmação para escrita, e pergunte-se o que acontece se a ação for chamada na hora errada.

Para o assistente de normas, a regra é simples: **sem ações na primeira versão**. Ele responde a partir dos arquivos. Quando a equipe confiar nele, uma segunda versão pode ganhar um conector de leitura ao repositório de normas, para não precisar reanexar arquivos a cada atualização.

## Construindo o assistente de normas, passo a passo

1. **Reúna as fontes**: três a oito documentos internos que geram mais perguntas (fechamento, admissão de cliente, padrão de e-mail, política de senhas). Converta para texto limpo; coloque data e versão.
2. **Crie o assistente** no recurso da sua ferramenta (Project, GPT ou Gem) com nome claro: "Normas — Contábil Exemplo".
3. **Cole as instruções** do modelo acima, adaptando papel e limites.
4. **Anexe os arquivos**.
5. **Teste com dez perguntas reais** da equipe, incluindo duas cujas respostas **não** estão nos arquivos. O assistente deve responder as oito com citação e admitir as duas.
6. **Ajuste**: se ele inventou, reforce o bloco de fontes; se citou errado, melhore os títulos dos arquivos; se respondeu longo demais, ajuste o formato.
7. **Compartilhe** com a equipe conforme o recurso permitir, e defina quem mantém os arquivos atualizados.

## Erros comuns

- Instruções genéricas ("seja útil e preciso") sem fontes nem limites.
- Anexar PDFs escaneados e culpar o modelo por "não achar".
- Não testar perguntas sem resposta nos arquivos — é o teste que revela invenção.
- Ligar ações de escrita na primeira versão.
- Esquecer o assistente depois de pronto: norma muda, arquivo não.

## Na prática

O escritório cria o assistente de normas em uma tarde. Nas duas primeiras semanas, as perguntas repetidas para o sócio caem visivelmente, e as respostas chegam com citação, o que faz a equipe abrir o manual certo. Uma vez por mês, quem cuida das normas atualiza os arquivos e repete o teste das dez perguntas.

## Resumo

- Assistente personalizado = instruções + base de conhecimento + (opcional) ferramentas; Projects, Custom GPTs e Gems seguem a mesma ideia.
- Instruções em cinco blocos: papel, fontes, formato, limites, exemplo.
- Base de conhecimento: texto limpo, um assunto por arquivo, data e versão, sem dados pessoais.
- Ações e conectores transformam o assistente em agente; comece sem elas e libere leitura antes de escrita.
- Teste com perguntas que têm e que não têm resposta nos arquivos; mantenha a base atualizada.
