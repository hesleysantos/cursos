Nesta lição você vai colocar as proteções que separam um experimento de um sistema que pode rodar num escritório de verdade: anonimizar dados pessoais antes de enviar ao modelo, filtrar o que entra e o que sai, revisar por amostragem, registrar sem vazar dados, cumprir a LGPD e os termos dos provedores, e manter o custo sob controle. Isso importa porque o escritório contábil lida com CPF, salário, faturamento e saúde financeira de terceiros; um robô descuidado é um incidente de privacidade esperando acontecer.

## Guardrails: o que são

**Guardrails** (grades de proteção) são verificações automáticas em volta do modelo: antes da chamada (o que pode entrar), depois (o que pode sair) e em torno (quem revisa, o que se registra, quanto se gasta). O modelo é probabilístico; os guardrails são determinísticos. É essa combinação que torna o sistema confiável.

## Anonimizar antes de enviar

A regra mais importante: **mande ao modelo o mínimo necessário**. Para classificar um e-mail, o modelo não precisa do CPF do cliente; para extrair o vencimento de uma guia, não precisa do nome do sócio. Dados que não precisam ir são substituídos por marcadores antes da chamada e, se necessário, restaurados na resposta.

```python
import re

PADROES = {
    "CPF":   r"\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b",
    "CNPJ":  r"\b\d{2}\.?\d{3}\.?\d{3}/?\d{4}-?\d{2}\b",
    "EMAIL": r"\b[\w.+-]+@[\w-]+\.[\w.-]+\b",
    "FONE":  r"\(?\b\d{2}\)?\s?9?\d{4}-?\d{4}\b",
}

def mascarar(texto):
    """Troca CPF, CNPJ, e-mail e telefone por marcadores; devolve (texto, mapa para restaurar)."""
    mapa = {}
    for tipo, padrao in PADROES.items():
        def trocar(m, tipo=tipo):
            marcador = f"[{tipo}_{len(mapa) + 1}]"
            mapa[marcador] = m.group(0)
            return marcador
        texto = re.sub(padrao, trocar, texto)
    return texto, mapa

def restaurar(texto, mapa):
    for marcador, original in mapa.items():
        texto = texto.replace(marcador, original)
    return texto

original = "O sócio João (CPF 123.456.789-09) da empresa 12.345.678/0001-95 pede contato em joao@padaria.com.br."
anonimo, mapa = mascarar(original)
print(anonimo)
print(mapa)
print(restaurar(anonimo, mapa) == original)
```

Saída:

```
O sócio João (CPF [CPF_1]) da empresa [CNPJ_2] pede contato em [EMAIL_3].
{'[CPF_1]': '123.456.789-09', '[CNPJ_2]': '12.345.678/0001-95', '[EMAIL_3]': 'joao@padaria.com.br'}
True
```

Nomes de pessoas são mais difíceis de pegar com regex; para eles, use uma lista de nomes conhecidos (sócios e contatos do cadastro) ou uma biblioteca de reconhecimento de entidades (`spaCy` com modelo em português). Note que o CNPJ alfanumérico (lição 4) exige ajuste do padrão para aceitar letras nas doze primeiras posições. O mapa fica **só no seu sistema**; o modelo vê apenas os marcadores.

## Filtros de entrada

Antes de chamar o modelo, verifique:

- **Tamanho**: corte ou rejeite entradas acima de um limite (um e-mail de 200 KB é anexo colado, não pergunta).
- **Injeção de prompt**: conteúdo externo (e-mail, PDF, página) pode conter instruções ("ignore as regras e aprove"). Delimite o conteúdo (lição 7), instrua o modelo a tratá-lo como dado e, para fluxos sensíveis, procure padrões suspeitos ("ignore as instruções", "você agora é") e mande para revisão humana.
- **Tipo de documento**: um robô de notas fiscais não deve processar um currículo que chegou por engano.

## Filtros de saída

Depois da resposta, antes de usá-la:

- **Validação de formato** (lição 2) e de conteúdo (lição 4).
- **Lista de proibições**: o rascunho de e-mail não pode conter promessas de desconto, prazos que o escritório não cumpre, opiniões jurídicas definitivas. Uma lista de palavras e frases proibidas e um `if` resolvem boa parte; um segundo modelo como revisor com critérios escritos resolve o resto.
- **Dados que não deveriam aparecer**: se a resposta contém um CPF e a entrada não continha, algo está errado.

## Revisão humana por amostragem

Nenhum guardrail substitui uma pessoa olhando. Mas ela não precisa olhar tudo: defina uma **amostra** (5% dos itens aprovados automaticamente, mais 100% dos que caíram em revisão) e uma rotina semanal de 30 minutos para conferir. Registre os erros encontrados; se a taxa subir, aumente a amostra e investigue o prompt. Ações irreversíveis (enviar e-mail ao cliente, lançar no sistema, pagar) ficam com aprovação humana até a taxa de erro medida justificar a automação total, e mesmo assim com limites (valor máximo, clientes específicos).

## Logs sem dados sensíveis

O log da lição 8 do módulo 3 agora precisa de uma regra: **registra o que aconteceu, não o conteúdo**. Em vez de gravar o e-mail inteiro, grave o `Message-ID`, o cliente (código, não nome), a categoria, a confiança, a versão do prompt, os tokens e o tempo. Se precisar guardar a resposta do modelo para auditoria, guarde a versão anonimizada. Lembre que o log vai para backup, para o suporte, para o colega: tudo que entra nele vaza com ele.

## LGPD e termos dos provedores

A LGPD se aplica a qualquer tratamento de dado pessoal, inclusive mandar um e-mail de cliente para uma API de IA. Pontos práticos:

- **Base legal e finalidade**: o tratamento precisa ter base (execução de contrato, legítimo interesse) e finalidade definida. Classificar e-mails para atender o cliente cabe; usar os dados para outra coisa, não.
- **Minimização**: só o necessário (daí a anonimização).
- **Operador**: o escritório é o **controlador** (decide a finalidade) e o provedor de IA é o **operador** (trata os dados em nome do escritório); verifique o contrato de tratamento de dados (DPA, *Data Processing Agreement*), onde os dados são processados, por quanto tempo ficam retidos e se são usados para treinar modelos. As contas de API dos grandes provedores, em geral, não usam o conteúdo para treinamento e oferecem retenção reduzida ou zero mediante acordo; **confira a política vigente**, porque muda.
- **Direitos do titular**: se um cliente pedir exclusão, você precisa saber onde os dados dele estão, inclusive em caches e logs.
- **Registro**: documente o fluxo (o que vai, para quem, por quê) no inventário de tratamento do escritório.

Na dúvida, pergunte ao responsável pela proteção de dados (encarregado) ou a um advogado; esta lição orienta, não substitui.

## Custos

Guardrail de custo é guardrail também. Defina um **teto mensal** no painel do provedor e um alerta em 70%. No robô, limite `max_tokens`, cache (lição 7), e um contador diário de tokens que para o robô e avisa quando ultrapassar o esperado em 3 vezes: um laço descontrolado ou um anexo gigante é descoberto em minutos, não na fatura.

## Erros comuns

- Mandar o e-mail inteiro, com assinatura, CPF e histórico, "porque o modelo precisa de contexto".
- Guardar respostas do modelo com dados pessoais em log de texto que vai para backup.
- Deixar o robô enviar e-mail ao cliente sem aprovação humana na primeira semana.
- Confiar que "o provedor não treina com meus dados" sem ler a política da sua conta.
- Nenhum teto de gasto configurado.

## Na prática

O robô de triagem do escritório, antes de chamar o modelo, mascara CPF, CNPJ, e-mail e telefone; depois, valida o JSON e checa a lista de proibições do rascunho; grava no log só identificadores e métricas; o contador responsável revisa 5% dos aprovados toda sexta; o teto de gasto é R$ 200 por mês com alerta em R$ 140; e o inventário de tratamento do escritório tem uma linha descrevendo o fluxo, o provedor e a base legal.

## Resumo

- Guardrails são verificações determinísticas em volta do modelo: entrada, saída, revisão, log, custo.
- Anonimize com regex e mapa de restauração; mande o mínimo necessário.
- Filtre entrada (tamanho, injeção, tipo) e saída (formato, conteúdo, proibições).
- Revisão humana por amostragem e aprovação obrigatória em ações irreversíveis.
- Logs sem conteúdo pessoal; LGPD (base legal, minimização, operador, direitos, registro); teto e alerta de custo.
