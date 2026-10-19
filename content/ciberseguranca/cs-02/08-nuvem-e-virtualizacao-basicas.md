Nesta lição você vai entender o que é uma máquina virtual e um container, o que significam IaaS, PaaS e SaaS, como funciona a responsabilidade compartilhada entre provedor e cliente, onde ficam os dados do escritório no Google Workspace ou no Microsoft 365, e como montar um laboratório seguro em máquina virtual para praticar nos próximos módulos. Importa porque "está na nuvem" não significa "está protegido": significa que parte da proteção é sua, e você precisa saber qual.

## Máquinas virtuais

Uma **máquina virtual** (VM) é um computador inteiro simulado por software dentro de outro. O programa que faz isso é o **hipervisor**: VirtualBox (gratuito), VMware Workstation Pro (gratuito desde 2024) e Hyper-V (incluído no Windows 11 Pro) são os mais comuns. Você cria a VM, define memória e disco, instala um Windows ou um Linux, e ela roda numa janela, isolada do sistema de fora (o **hospedeiro**). O hospedeiro é o prédio; cada VM é um apartamento: o que acontece dentro de um não afeta os outros.

Dois recursos tornam a VM a ferramenta perfeita para aprender segurança: o **snapshot** (uma foto do estado da VM, à qual se volta em segundos) e o isolamento de rede (a VM pode ficar numa rede só dela, sem enxergar o escritório). Testou algo que quebrou? Volte ao snapshot. Abriu um arquivo suspeito? Ficou confinado ao apartamento. A nuvem inteira é construída sobre esse princípio: os servidores de um provedor rodam milhares de VMs de clientes diferentes.

## Containers

Um **container** é uma forma mais leve de isolamento: em vez de simular um computador inteiro, empacota só um programa com suas dependências e o roda isolado sobre o sistema do hospedeiro. O Docker é a ferramenta mais conhecida. Se a VM é um apartamento, o container é um quarto com chave dentro de um apartamento compartilhado: mais barato, mais rápido, menos isolado.

## IaaS, PaaS e SaaS

"Nuvem" é usar computadores de outra pessoa, pela internet, pagando pelo uso. Os provedores (AWS, Microsoft Azure, Google Cloud, Oracle) oferecem isso em três níveis:

| Modelo | O que o provedor entrega | O que você administra | Exemplo |
|---|---|---|---|
| **IaaS** (infraestrutura) | Máquinas virtuais, rede, disco | Sistema operacional, atualizações, programas, dados | Servidor Windows na Azure para o sistema contábil |
| **PaaS** (plataforma) | Ambiente pronto para rodar seu programa | O programa e os dados | Banco de dados gerenciado |
| **SaaS** (software) | O sistema pronto, pela internet | Usuários, permissões, configurações, dados | Google Workspace, Microsoft 365 |

Para um escritório contábil, quase tudo é SaaS: e-mail, documentos, sistema fiscal, folha. É bom, porque o provedor protege os servidores melhor do que o escritório conseguiria. Mas uma parte continua sendo sua, e é aí que a maioria dos incidentes acontece.

## Responsabilidade compartilhada

Todo provedor publica um **modelo de responsabilidade compartilhada**: o provedor responde pela segurança **da** nuvem (prédios, servidores, rede, hipervisor, disponibilidade); o cliente, pela segurança **na** nuvem (contas, senhas, MFA, permissões, compartilhamento, backup dos próprios dados, configuração).

Para um escritório em SaaS: se o datacenter do Google pegar fogo, o Google responde; se um funcionário usar senha fraca sem MFA e um criminoso entrar no e-mail, o escritório responde; se alguém compartilhar a pasta de clientes com "qualquer pessoa com o link", o escritório responde.

O provedor garante disponibilidade dos servidores, não **backup dos seus dados** contra os seus próprios erros e contra ransomware que cifra arquivos sincronizados. Por isso existe backup para Microsoft 365 e Google Workspace, e a regra 3-2-1 continua valendo "na nuvem".

## Onde ficam os dados do escritório

No Google Workspace ou no Microsoft 365, e-mails e documentos ficam em datacenters do provedor, replicados em mais de um local, com criptografia em repouso e em trânsito. A LGPD permite transferência internacional sob condições; a pergunta "onde fica" costuma ser menos crítica que "quem pode acessar".

Quem administra isso é o **console de administração** (admin.google.com ou admin.microsoft.com). Ali um escritório pequeno deve, no mínimo: exigir MFA para todos; revisar quem é administrador (dois, não oito); restringir compartilhamento externo (links públicos desligados ou com validade); ativar os **logs de auditoria** (quem acessou e compartilhou o quê, de onde); e desativar a conta de quem sai no mesmo dia.

## Laboratório seguro em VM

Nos próximos módulos você vai praticar comandos, analisar arquivos suspeitos e testar ferramentas. Nada disso na máquina de trabalho nem contra sistemas de terceiros:

1. Instale o VirtualBox (ou ative o Hyper-V) no computador pessoal.
2. Crie uma VM com Ubuntu (gratuito) e, se possível, outra com Windows de avaliação (a Microsoft oferece versões de teste por tempo limitado).
3. Configure a rede da VM. No dia a dia, **NAT**: ela acessa a internet por meio do hospedeiro e nada de fora inicia conexão com ela, mas ela ainda consegue alcançar as máquinas da sua rede local. Para abrir algo suspeito, mude para **host-only** (só conversa com o hospedeiro) ou **rede interna** (não conversa com ninguém): sem internet e sem rede local, nada escapa. Nunca use **bridge**, que coloca a VM na mesma rede que todos os seus computadores.
4. Tire um snapshot logo após instalar, com o nome "limpo".
5. Antes de cada experimento, tire outro snapshot; depois, volte ao "limpo".

Nunca copie arquivos suspeitos da VM para o hospedeiro, nunca compartilhe a área de transferência durante uma análise e nunca aponte uma ferramenta de teste para endereços que não sejam a sua própria VM. O laboratório é o seu quintal; o resto é alheio.

## Erros comuns

- **"Está na nuvem, então tem backup."** Tem disponibilidade; backup contra os seus erros e contra ransomware é com você.
- **Administrador global para todo mundo** no console do Workspace ou do 365.
- **VM em modo bridge** (na mesma rede do escritório) durante a análise de um arquivo suspeito.

## Na prática

Entre no console de administração do e-mail do escritório e responda: quantos administradores existem; a MFA é obrigatória para todos; o compartilhamento externo está restrito; os logs de auditoria estão ativos; existe backup fora do provedor. Cada "não" é uma tarefa. Depois, monte a VM com Ubuntu e tire o snapshot "limpo": ela será sua companheira pelos próximos módulos.

> **Dica:** o Hyper-V vem desligado no Windows 11 Pro; ative-o em "Ativar ou desativar recursos do Windows".

## Resumo

- VM é um computador simulado e isolado (VirtualBox, VMware, Hyper-V), com snapshots para voltar no tempo; container é isolamento mais leve de um programa (Docker).
- IaaS entrega máquinas, PaaS entrega plataforma, SaaS entrega o sistema pronto; o escritório vive em SaaS.
- Responsabilidade compartilhada: o provedor protege a nuvem; contas, MFA, permissões, compartilhamento e backup dos dados são do cliente.
- No console do Workspace/365: MFA obrigatória, poucos administradores, compartilhamento externo restrito, auditoria ativa, desligamento no mesmo dia.
- Laboratório: VM com rede NAT no dia a dia e host-only (ou rede interna) ao analisar algo suspeito, snapshot "limpo", nada contra sistemas de terceiros.
