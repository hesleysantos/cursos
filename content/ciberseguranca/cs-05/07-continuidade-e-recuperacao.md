Nesta lição você vai aprender a planejar para o **pior dia**: o que fazer quando o sistema para, seja por ransomware, incêndio, falha de disco ou queda do provedor de nuvem. Vai conhecer a **análise de impacto no negócio (BIA)**, as métricas **RTO** e **RPO**, a diferença entre **BCP** e **DRP**, as regras de backup que realmente resistem a ransomware e vai montar um plano concreto para "escritório sem sistema por 3 dias". Isso importa porque, para a maioria das pequenas empresas, o que mata não é o ataque, é não conseguir voltar a operar.

## Continuidade não é TI, é negócio

Um escritório contábil vive de prazos: folha até o dia 5, DCTFWeb até o dia 15, SPED até o dia 20. Se o sistema para no dia 13, a pergunta não é "como restauro o servidor?", é "como entrego a DCTFWeb de 80 clientes até o dia 15?". **Continuidade de negócios** começa pelas obrigações e termina na tecnologia, nunca o contrário.

## BIA: o que dói mais, e quando

A **análise de impacto no negócio (BIA, Business Impact Analysis)** lista cada processo essencial e responde: se ele parar, quanto perdemos por hora ou por dia, e a partir de quando o prejuízo vira insuportável? Exemplo simplificado:

| Processo | Impacto se parar | Tolerância máxima |
|---|---|---|
| Emissão de guias e folha | multas, clientes sem pagar funcionários | 1 dia útil |
| Atendimento por e-mail | reclamações, perda de confiança | 2 dias |
| Escrituração fiscal | acúmulo, mas recuperável | 5 dias |
| Site institucional | imagem | 15 dias |

A BIA diz **o que proteger primeiro**. Sem ela, a TI restaura o site antes da folha porque é mais fácil.

## RTO e RPO

Duas métricas definem o backup e o plano:

- **RTO (Recovery Time Objective):** em quanto tempo o processo precisa voltar. "Folha com RTO de 8 horas" significa que, 8 horas depois do desastre, a folha tem de estar rodando.
- **RPO (Recovery Point Objective):** quanto de dados você aceita perder, medido em tempo. "RPO de 4 horas" significa backup pelo menos a cada 4 horas; o pior caso perde 4 horas de trabalho.

Analogia: RTO é quanto tempo o caixa pode ficar fechado; RPO é quantos lançamentos você aceita redigitar. Quanto menores, mais caro: backup diário dá RPO de 24 h e custa quase nada; RPO de 15 minutos exige replicação contínua. Defina por processo, com base na BIA.

## BCP e DRP

- **BCP (Business Continuity Plan, plano de continuidade de negócios):** como a **empresa** continua operando enquanto o problema não é resolvido: quem faz o quê, onde trabalhar, como atender, como emitir guias manualmente ou por outro caminho.
- **DRP (Disaster Recovery Plan, plano de recuperação de desastres):** como a **tecnologia** volta: ordem de restauração, servidores substitutos, credenciais, contatos de fornecedores.

O DRP é um capítulo do BCP. A norma de referência é a **ISO 22301**; para o escritório, basta um documento de poucas páginas, testado.

## Backups que resistem a ransomware

Ransomware moderno **procura e criptografa os backups** antes do resto. Por isso a regra clássica **3-2-1** evoluiu para **3-2-1-1-0**:

- **3** cópias dos dados (o original e duas);
- em **2** tipos de mídia diferentes (disco local e nuvem, por exemplo);
- **1** cópia fora do local (nuvem ou outro endereço);
- **1** cópia **imutável ou off-line**;
- **0** erros na verificação, ou seja, restauração testada.

**Imutável** é a cópia que não pode ser alterada nem apagada por um período definido, nem pelo administrador (*object lock* em S3, Backblaze B2 e Wasabi, ou o armazenamento imutável do Azure Blob, suportado por ferramentas de backup como Veeam e Acronis). **Off-line** é a cópia desconectada fisicamente: um HD externo ligado só durante o backup e guardado no cofre, em rodízio. Quem domina o administrador do domínio apaga o backup da rede; não apaga o que está no cofre.

> **Atenção:** OneDrive, Google Drive e Dropbox **sincronizam**: se o ransomware criptografa a pasta local, a nuvem recebe a versão criptografada. O histórico de versões ajuda, mas não substitui backup. Backup é cópia separada, com retenção, que o usuário comum não consegue apagar.

## Testes de restauração

Backup que nunca foi restaurado é uma esperança, não um backup. Casos reais: a cópia estava corrompida há meses; a senha do backup só o ex-funcionário sabia; a restauração levaria 60 horas pela internet lenta. Teste **trimestralmente**: restaure arquivos aleatórios e um sistema inteiro em máquina separada, meça o tempo (o seu RTO real) e registre o resultado.

## Plano: "escritório sem sistema por 3 dias"

Cenário: segunda-feira, 8h, o servidor e as estações estão criptografados; o prazo da DCTFWeb é sexta.

**Dia 1 (continuidade):**
- Ativar o BCP: reunião de 15 minutos; o sócio decide e uma pessoa comunica.
- Operar pelo que não depende do servidor: sistema contábil em nuvem acessível de notebooks limpos; e-CAC e portais estaduais na web. Senhas no gerenciador de senhas, não no servidor.
- Priorizar pela BIA: guias e folha primeiro; escrituração espera.
- Avisar clientes com prazo nesta semana, por mensagem padrão.
- Acionar o DRP: prestador inicia a reinstalação e a restauração.

**Dia 2 (recuperação parcial):**
- Duas estações reinstaladas, uma com acesso ao backup restaurado em modo leitura.
- Trabalho essencial em notebooks reserva (ter dois guardados é parte da preparação).

**Dia 3 (normalização):**
- Servidor restaurado do backup imutável; validação dos dados de clientes-chave.
- Redigitação do que se perdeu entre o último backup e o incidente (RPO); registro de tudo para o relatório e o seguro.

O plano só funciona se, **antes**, existirem: backup imutável, sistema contábil acessível de fora, gerenciador de senhas, notebooks reserva e a lista de prazos da semana. Isso é a preparação em ação.

## Erros comuns

- Backup no mesmo servidor, ou em HD sempre conectado: o ransomware pega junto.
- Confiar em sincronização de nuvem como backup.
- Nunca testar a restauração, ou testar só arquivos pequenos.
- Plano de continuidade guardado só no servidor que caiu.

## Na prática

Preencha uma BIA de uma página com os cinco processos do escritório, defina RTO/RPO para cada um, confira se o backup atual atende e marque o primeiro teste de restauração. Guarde o plano impresso e no celular de duas pessoas.

## Resumo

- Continuidade começa pelos prazos e obrigações do negócio (BIA), não pela tecnologia.
- RTO é tempo para voltar; RPO é quanto de dados se aceita perder. Definem o backup.
- BCP mantém a empresa operando; DRP traz a tecnologia de volta.
- Regra 3-2-1-1-0: inclua uma cópia imutável ou off-line e teste a restauração.
- Sincronização de nuvem não é backup; plano guardado só no servidor não é plano.
