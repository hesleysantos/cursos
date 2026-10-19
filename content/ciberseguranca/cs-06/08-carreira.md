Nesta lição você vai conhecer o **mercado de cibersegurança** como caminho de carreira: as áreas de atuação, as trilhas de certificação mais reconhecidas, como montar portfólio e laboratório, onde estão as comunidades brasileiras e o que esperar de salários, com as ressalvas que números desse tipo exigem. Isso importa porque, ao final de seis módulos, você tem base para decidir se quer ser o **profissional de referência em segurança e privacidade** dentro da contabilidade, migrar para a área, ou simplesmente contratar melhor.

## As áreas

Cibersegurança não é uma profissão; é um conjunto delas. As principais:

| Área | O que faz no dia a dia | Perfil que combina |
|---|---|---|
| **SOC / Blue Team** | monitora alertas, investiga, responde a incidentes, cria regras de detecção | gosta de investigação, rotina de plantão |
| **GRC** | políticas, riscos, auditoria, conformidade (ISO 27001, LGPD), relatórios para a diretoria | organizado, escreve bem, entende de processos e lei |
| **Pentest / Red Team** | testa sistemas e redes simulando atacantes, escreve relatórios | curioso, persistente, gosta de técnica profunda |
| **Segurança em nuvem** | IAM, configuração segura de AWS/Azure/GCP, automação | afinidade com infraestrutura e código |
| **AppSec** | revisão de código, SAST/DAST, threat modeling, apoio a desenvolvedores | programa ou programou |
| **Forense e DFIR** (Digital Forensics and Incident Response) | coleta e análise de evidências, resposta a incidentes aprofundada | meticuloso, documenta tudo |
| **Privacidade** | programa de privacidade, LGPD, encarregado (DPO), contratos | jurídico-processual, comunicação |

Para quem vem da contabilidade, **GRC** e **privacidade** são as portas mais naturais: a lógica de controle, evidência, auditoria e prazo legal é a mesma; o que muda é o objeto. Um contador que domina LGPD e ISO 27001 é raro e valorizado, inclusive dentro de escritórios e de empresas de software contábil.

## Trilhas e certificações

Certificação não substitui prática, mas abre portas em processos seletivos e organiza o estudo. As mais reconhecidas, por nível:

**Entrada**
- **ISC2 CC (Certified in Cybersecurity):** fundamentos; o ISC2 já ofereceu o exame e o treinamento oficial gratuitamente em campanhas de entrada na profissão; confira as condições vigentes no site antes de se inscrever.
- **CompTIA Security+:** a certificação de entrada mais citada em vagas; cobre redes, criptografia, identidade, ataques, GRC básico.

**Intermediário**
- **CompTIA CySA+:** análise de segurança, detecção, resposta (SOC).
- **CEH (EC-Council):** ethical hacking; muito citado em vagas no Brasil, mais teórico que prático.
- **ISO/IEC 27001 Lead Implementer** e **Lead Auditor** (PECB, BSI e outros): implantar e auditar SGSI; a trilha natural de GRC.
- **CIPP/E e CIPM (IAPP):** privacidade (legislação europeia, que inspirou a LGPD, e gestão de programas); no Brasil também há certificações específicas de LGPD, de reconhecimento variável.

**Avançado**
- **OSCP (OffSec):** pentest prático, exame de 24 horas de laboratório; respeitada mundialmente.
- **CISSP (ISC2):** gestão de segurança, oito domínios; exige cinco anos de experiência comprovada para o título pleno (quatro, com diploma de ensino superior ou outra credencial aprovada); quem passa no exame sem a experiência fica como *Associate of ISC2* até completá-la.
- **CISM (ISACA):** gestão; **CISA (ISACA):** auditoria de sistemas, muito próxima do mundo contábil.
- Certificações de nuvem: AWS Certified Security – Specialty, Microsoft SC-100/SC-200, Google Professional Cloud Security Engineer.

Para o perfil deste curso, uma trilha coerente: ISC2 CC → Security+ → ISO 27001 Lead Implementer → CIPM/CIPP ou CISA.

## Portfólio e laboratório

Em segurança, o que você **fez** pesa mais que o que você **cursou**. Um portfólio público (GitHub, blog, LinkedIn) pode conter:

- O **plano de segurança e privacidade** do projeto final deste curso, anonimizado.
- Scripts como os das lições de logs e hash, documentados.
- Um relatório de pentest de laboratório (nunca de alvo real sem autorização).
- Artigos curtos explicando um incidente público e as lições, mapeado no ATT&CK.
- Um **laboratório doméstico**: máquinas virtuais (VirtualBox ou Hyper-V) com um Windows, um Linux, um Wazuh e o Kali; plataformas de prática como TryHackMe e Hack The Box (com trilhas defensivas e ofensivas), Blue Team Labs Online, e os desafios de CTF (capture the flag) brasileiros.

## Comunidades brasileiras

Participar é a forma mais rápida de aprender o que o mercado valoriza e de conseguir indicações:

- **Eventos:** Roadsec, H2HC (Hackers to Hackers Conference), BSides (São Paulo e outras cidades), Mind The Sec, Security Leaders, além dos encontros da **OWASP** nos capítulos brasileiros.
- **Grupos e associações:** capítulos do ISC2 e da ISACA no Brasil, comunidades no Discord e no Telegram ligadas a eventos e a plataformas de prática, grupos de **privacidade e LGPD** (como os de encarregados), e o **CERT.br**, que publica estatísticas, cartilhas e cursos.
- **Fontes para acompanhar:** CERT.br, ANPD (resoluções e guias), NIST, CIS, MITRE, e os relatórios anuais de empresas de segurança sobre o Brasil.

## Salários e mercado

Há escassez de profissionais de segurança no Brasil e no mundo, o que mantém a demanda alta mesmo em períodos de corte em outras áreas de tecnologia. Sobre salários, qualquer número preciso envelhece em meses e varia por cidade, porte da empresa, idioma e regime (CLT ou PJ). Como **ordem de grandeza**, com essa ressalva: cargos de entrada (analista júnior de SOC ou GRC) costumam começar na faixa de alguns milhares de reais mensais; plenos e seniores, em geral, ficam entre o dobro e o quádruplo disso; cargos de gestão (gerente, CISO) e especialistas raros (AppSec, nuvem, resposta a incidentes) podem ir além, especialmente em multinacionais e em contratação remota para o exterior. Consulte pesquisas salariais atualizadas (Robert Half, Glassdoor, levantamentos de associações) antes de qualquer decisão.

Para quem não pretende mudar de área: um escritório que oferece **consultoria de LGPD e segurança** aos clientes, ou que simplesmente demonstra maturidade de segurança em propostas, tem um diferencial comercial concreto.

## Erros comuns

- Colecionar certificações sem prática: o entrevistador pergunta "o que você fez com isso?".
- Começar pelo OSCP sem base de redes e sistemas.
- Praticar em alvos reais sem autorização: é crime (Lei 12.737/2012, art. 154-A do Código Penal), e encerra carreiras.
- Ignorar as habilidades de comunicação: em GRC e privacidade, escrever e explicar são metade do trabalho.
- Acreditar em números precisos de salário sem fonte e data.

## Na prática

Escolha uma área pelas afinidades da tabela, defina a primeira certificação, monte o laboratório com duas máquinas virtuais e publique o seu primeiro artigo: o mapeamento no ATT&CK de um incidente público. Entre em uma comunidade este mês.

## Resumo

- Áreas: SOC, GRC, pentest, nuvem, AppSec, forense/DFIR, privacidade; GRC e privacidade são as portas naturais para quem vem da contabilidade.
- Trilha sugerida: ISC2 CC → Security+ → ISO 27001 Lead Implementer → CIPM/CIPP ou CISA; OSCP e CISSP para quem avança.
- Portfólio público e laboratório (VMs, Wazuh, Kali, TryHackMe/Hack The Box) pesam mais que diplomas.
- Comunidades: Roadsec, H2HC, BSides, OWASP, ISC2/ISACA, CERT.br.
- Mercado aquecido; salários variam muito; use faixas com ressalva e fontes atualizadas.
