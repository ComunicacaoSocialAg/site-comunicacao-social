import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { motion, AnimatePresence } from 'motion/react';
import KineticPreloader from './components/KineticPreloader';
import MatchCutIntro from './components/MatchCutIntro';


// ─── PROJECTS DATA ─────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    id: 'iluminismo',
    num: '01',
    title: 'O Iluminismo',
    category: 'Estratégia Digital',
    tags: ['dados', 'bi', 'estratégia'],
    client: 'CS Ag Analytics',
    year: '2026',
    role: 'Planejamento & BI',
    accent: '#f7d406',
    isConceptual: true,
    image: '/assets/projects/iluminismo.png',
    description: 'Campanha conceitual focada em clareza de dados, racionalismo analítico e design minimalista.',
    challenge: 'O cliente operava com dados dispersos em 6 plataformas diferentes, tomando decisões por intuição. A comunicação da marca não refletia a sofisticação analítica dos seus serviços — havia uma dissonância entre o que entregavam e como se apresentavam.',
    strategy: 'Desenvolvemos um sistema de identidade editorial inspirado no Iluminismo europeu — onde a razão supera a obscuridade. A campanha posicionou o BI como a "luz" que ilumina decisões. Painéis integrados com dashboards em tempo real foram apresentados como a principal peça criativa, tornando os dados o protagonista visual.',
    results: [
      { value: '+42%', label: 'Eficiência de conversão' },
      { value: '2.8M', label: 'Impressões geradas' },
      { value: '340%', label: 'ROI da campanha' },
      { value: '68%', label: 'Taxa de engajamento' },
    ],
    details: 'Paleta monocromática com pontos de foco dourados, tipografia racionalista e dashboards ao vivo como peça criativa central. A campanha foi reconhecida como case de inovação no setor.',
  },
  {
    id: 'rupestre',
    num: '02',
    title: 'Arte Rupestre',
    category: 'Identidade Visual',
    tags: ['branding', 'arte', 'origem'],
    client: 'Origens SA',
    year: '2025',
    role: 'Branding & Direção de Arte',
    accent: '#c8a97e',
    isConceptual: true,
    image: '/assets/projects/rupestre.png',
    description: 'Resgate histórico da comunicação humana traduzido em marca contemporânea.',
    challenge: 'Uma marca sem personalidade clara, disputando mercado em um segmento saturado de identidades genéricas. O cliente queria se diferenciar radicalmente, mas sem perder a seriedade. A pergunta era: como ser memorável sendo autêntico?',
    strategy: 'Resgatamos a primeira forma de comunicação humana — a arte rupestre — como metáfora de autenticidade e origem. Criamos tipografias proprietárias que simulam traços em pedra e texturas vetoriais de pigmentos naturais. O contraste entre o primitivo e o tecnológico virou o posicionamento central.',
    results: [
      { value: '+180%', label: 'Brand awareness' },
      { value: '12', label: 'Prêmios de design' },
      { value: '4', label: 'Países de atuação' },
      { value: '98%', label: 'Satisfação do cliente' },
    ],
    details: 'Sistema visual completo: logotipo, paleta de terra, papelaria, embalagens e guia de marca. A identidade foi premiada em 3 festivais nacionais de criatividade.',
  },
  {
    id: 'neon-city',
    num: '03',
    title: 'Neon City',
    category: 'Campanha Urbana',
    tags: ['lifestyle', 'ooh', 'digital'],
    client: 'Urban Co.',
    year: '2026',
    role: 'Direção de Arte & Produção',
    accent: '#7c4dff',
    isConceptual: true,
    image: '/assets/projects/neon-city.png',
    description: 'Campanha noturna que captura o pulso da metrópole moderna com estética cyberpunk e iluminação neon.',
    challenge: 'Uma marca de lifestyle urbano que precisava se conectar com o público jovem das capitais, mas cujo orçamento não comportava mídia tradicional em grande escala. O desafio era gerar impacto máximo com presença estratégica em poucos pontos.',
    strategy: 'Mapeamos os 12 pontos de maior fluxo noturno nas capitais e combinamos OOH digital programático com social media ativado por geolocalização. Quando alguém passava perto de um painel, recebia o conteúdo no Instagram — criando um loop entre o físico e o digital.',
    results: [
      { value: '4.2M', label: 'Impressões em 30 dias' },
      { value: '8.4%', label: 'CTR (média do setor: 2%)' },
      { value: '+63%', label: 'Visitas nas lojas' },
      { value: '12', label: 'Pontos de ativação' },
    ],
    details: 'Produção completa de assets para OOH digital e social. Geolocalização ativa por raio de 200m dos pontos. Campanha reconhecida como referência de integração phygital.',
  },
  {
    id: 'moda-editorial',
    num: '04',
    title: 'The Shape of Silence',
    category: 'Moda Editorial',
    tags: ['moda', 'editorial', 'branding'],
    client: 'Mágala Fashion',
    year: '2025',
    role: 'Direção Criativa',
    accent: '#efefef',
    isConceptual: true,
    image: '/assets/projects/moda-editorial.png',
    description: 'Editorial minimalista explorando geometria e silêncio como linguagem visual de alto impacto.',
    challenge: 'Uma marca de moda com DNA sofisticado mas comunicação inconsistente. O editorial precisava estabelecer de vez o tom visual da coleção outono/inverno e posicionar a marca no segmento premium, com cobertura em veículos especializados nacionais e internacionais.',
    strategy: 'Construímos toda a narrativa visual ao redor do conceito de "silêncio como forma". Preto e branco absoluto, geometria arquitetônica, poses estáticas que sugerem movimento contido. A ausência de cor se tornou a declaração mais forte. Cada frame foi pensado como uma obra autônoma.',
    results: [
      { value: '3x', label: 'Acima do engajamento médio' },
      { value: '28', label: 'Publicações em veículos' },
      { value: '+210%', label: 'Crescimento de seguidores' },
      { value: '5', label: 'Dias de produção' },
    ],
    details: 'Produção fotográfica completa em estúdio e locação arquitetônica. Veiculação em 28 publicações de moda nacionais e internacionais. Coleção esgotada em 3 semanas.',
  },
  {
    id: 'radio-tv',
    num: '05',
    title: 'Era do Rádio e TV',
    category: 'Campanha Cross-Media',
    tags: ['campanha', 'mídia', 'nostalgia'],
    client: 'Rede Difusora',
    year: '2026',
    role: 'Produção Multimídia',
    accent: '#ff6b35',
    isConceptual: true,
    image: '/assets/projects/era-do-radio-tv.png',
    description: 'Reposicionamento de marca inspirado na época de ouro da radiodifusão brasileira.',
    challenge: 'Uma rede de comunicação tradicional que perdia relevância para o streaming, mas ainda detinha uma base leal de ouvintes e telespectadores. A questão central: como transformar "antigo" em "atemporal" sem parecer retrô ou forçado?',
    strategy: 'Abraçamos o passado como superpoder. Spots de áudio com textura analógica, vídeos com grain de película e paleta vintage, integrados a campanhas digitais com linguagem contemporânea. O conceito "Algumas coisas melhoram com o tempo" conectou gerações diferentes em uma única narrativa.',
    results: [
      { value: '2M+', label: 'Ouvintes/espectadores' },
      { value: '+340%', label: 'Recall de marca' },
      { value: '4', label: 'Plataformas integradas' },
      { value: '6', label: 'Meses de campanha' },
    ],
    details: 'Spots de rádio, VTs para TV, reels, stories e mídia programática integrados em uma única plataforma de mensagem. O recall de marca subiu de 18% para 79% entre o público de 35-55 anos.',
  },
  {
    id: 'festival',
    num: '06',
    title: 'Sunscape Festival',
    category: 'Ativação & Evento',
    tags: ['evento', 'ativação', 'experiência'],
    client: 'Sunscape Music',
    year: '2024',
    role: 'Branding & Ativação',
    accent: '#ff9500',
    isConceptual: true,
    image: '/assets/projects/festival.png',
    description: 'Identidade e ativação completa para festival de música de verão — 3 dias, 4 palcos, 8 mil pessoas.',
    challenge: 'Um festival estreante que precisava se posicionar em um mercado dominado por eventos consolidados com décadas de história. Sem histórico, sem artistas mega-headliners no orçamento. O desafio: criar antecipação e desejo antes mesmo do evento existir na memória coletiva.',
    strategy: 'Construímos o festival como uma promessa sensorial antes de ser um produto. A campanha lançou o "universo Sunscape" meses antes — conteúdo teasers cinematográficos, experiência de AR nas redes, playlist exclusiva. Quando os ingressos foram à venda, o público já estava dentro do universo da marca.',
    results: [
      { value: '100%', label: 'Ingressos em 48h' },
      { value: '8k', label: 'Participantes' },
      { value: '94', label: 'NPS do evento' },
      { value: '4', label: 'Palcos produzidos' },
    ],
    details: 'Da identidade visual à sinalização no local, apps, wristbands, merchandising, comunicação pré, durante e pós-evento. A campanha de lançamento viralizou antes mesmo da venda de ingressos começar.',
  },
  {
    id: 'tech-summit',
    num: '07',
    title: 'Global Tech Summit',
    category: 'B2B & Eventos Corporativos',
    tags: ['b2b', 'tech', 'conferência'],
    client: 'ABC Technologies',
    year: '2024',
    role: 'Identidade & Comunicação',
    accent: '#d4a843',
    isConceptual: true,
    image: '/assets/projects/tech-summit.png',
    description: 'Sistema de comunicação premium para conferência tecnológica com 2.400 executivos de 38 países.',
    challenge: 'Uma conferência com conteúdo de altíssimo nível mas apresentação visual genérica que não refletia a sofisticação do evento. O desafio: criar um sistema visual que comunicasse excelência técnica e autoridade global sem parecer frio ou inacessível.',
    strategy: 'Desenvolvemos um sistema visual baseado em circuitos dourados sobre fundo navy profundo — a metáfora de conexões que formam inteligência. O sistema foi construído para ser modular: funciona de cartão de visita a cenografia de 400m². Cada touchpoint reforçava a mesma narrativa de "conexão que transforma".',
    results: [
      { value: '2.4k', label: 'Executivos presentes' },
      { value: '38', label: 'Países representados' },
      { value: '96%', label: 'Avaliação positiva' },
      { value: '3', label: 'Dias de evento' },
    ],
    details: 'Sistema completo: identidade, site, app, sinalização, keynote decks, press kit, credenciais, cenografia e comunicação digital. Evento avaliado como o mais bem produzido da história da conferência.',
  },
  {
    id: 'gastronomia',
    num: '08',
    title: 'Sabores do Brasil',
    category: 'Food & Lifestyle',
    tags: ['food', 'lifestyle', 'fotografia'],
    client: 'Restaurante Raízes',
    year: '2025',
    role: 'Fotografia & Conteúdo',
    accent: '#e07b39',
    isConceptual: true,
    image: '/assets/projects/gastronomia.png',
    description: 'Campanha visual celebrando a gastronomia brasileira com ingredientes locais e a cultura da mesa compartilhada.',
    challenge: 'Um restaurante de cozinha brasileira contemporânea que disputava espaço com franquias e redes. Os pratos eram excepcionais, mas a comunicação visual não fazia jus. As fotos existentes foram tiradas com celular sob iluminação artificial. O desafio: fazer a comida parecer tão boa quanto é.',
    strategy: 'Três dias de produção fotográfica editorial com direção de arte completa. Utilizamos luz natural dourada do fim de tarde, plating artesanal e cenografia de mesa com elementos regionais autênticos. O contexto — a varanda com vista para a montanha — entrou como protagonista, não como fundo.',
    results: [
      { value: '+67%', label: 'Reservas no mês' },
      { value: '180k', label: 'Views nas redes' },
      { value: '40+', label: 'Peças produzidas' },
      { value: '3', label: 'Dias de produção' },
    ],
    details: 'Banco de imagens completo para redes sociais, cardápio digital e impresso, comunicação interna e relações públicas. O restaurante passou a ter fila de espera de 2 semanas após a divulgação.',
  },
  {
    id: 'amplificacao',
    num: '09',
    title: 'Amplificação de Voz',
    category: 'Performance & Social',
    tags: ['social', 'performance', 'conteúdo'],
    client: 'Comunica Global',
    year: '2025',
    role: 'Performance & Conteúdo',
    accent: '#00c896',
    isConceptual: true,
    image: '/assets/projects/marketing-digital.png',
    description: 'Estratégia de amplificação de canais sociais com crescimento orgânico e pago sincronizados.',
    challenge: 'Uma empresa de consultoria com expertise real mas presença digital quase zero. Conteúdo irregular, sem estratégia, publicado sem critério de horário, tema ou audiência. O custo de aquisição de cliente era 3x acima da média do mercado por depender exclusivamente de indicação.',
    strategy: 'Mapeamos as micro-comunidades onde os decisores de compra passavam tempo. Construímos uma estratégia de conteúdo de autoridade — menos posts, mais profundidade. IA para análise de sentimento e timing de publicação. Mídia paga ativada apenas após validação orgânica do conteúdo.',
    results: [
      { value: '-30%', label: 'Custo de aquisição' },
      { value: '+280%', label: 'Alcance orgânico' },
      { value: '12', label: 'Plataformas gerenciadas' },
      { value: '6', label: 'Meses de estratégia' },
    ],
    details: 'Estratégia editorial, produção de conteúdo, gestão de mídia paga e relatórios mensais de performance. O CAC caiu 30% e o LTV dos clientes aumentou 85% por melhoria no posicionamento de autoridade.',
  },
  {
    id: 'floresta',
    num: '10',
    title: 'Reforest Earth',
    category: 'ESG & Sustentabilidade',
    tags: ['esg', 'ambiental', 'causa'],
    client: 'Reforest Earth NGO',
    year: '2025',
    role: 'Estratégia & Identidade',
    accent: '#4caf50',
    isConceptual: true,
    image: '/assets/projects/floresta.png',
    description: 'Identidade e comunicação para ONG de reflorestamento presente em 12 países.',
    challenge: 'Uma ONG com trabalho real e impactante que não conseguia traduzir sua missão em engajamento financeiro. A identidade visual era amadora, o tom de comunicação era culpabilizador (comum no setor ambiental) e a arrecadação estava estagnada há 3 anos.',
    strategy: 'Mudamos o tom de "salve o planeta" para "faça parte da regeneração". A identidade foi redesenhada com formas orgânicas e fotografia aérea deslumbrante que mostra o impacto real. Cada comunicação mostra progresso, não problema. Doadores passaram a receber atualizações de "sua árvore" — criando conexão emocional duradoura.',
    results: [
      { value: '+180%', label: 'Arrecadação em 3 meses' },
      { value: '12', label: 'Países de atuação' },
      { value: '50k', label: 'Novos doadores' },
      { value: '94%', label: 'Taxa de retenção' },
    ],
    details: 'Repositionamento completo de marca, novo site, campanha digital e sistema de comunicação com doadores. A ONG passou de financeiramente estagnada para autossustentável em um ano.',
  },
  {
    id: 'imoveis',
    num: '11',
    title: 'Aurora Residences',
    category: 'Imobiliário Premium',
    tags: ['imóveis', 'luxo', 'lançamento'],
    client: 'Aurora Construtora',
    year: '2026',
    role: 'Lançamento & Branding',
    accent: '#f0c060',
    isConceptual: true,
    image: '/assets/projects/imoveis.png',
    description: 'Campanha de lançamento de empreendimento residencial de alto padrão — 100% vendido em 72h.',
    challenge: 'Um empreendimento de alto padrão em um mercado com 14 outros lançamentos simultâneos. O produto era excepcional, mas o desafio era criar urgência e desejo em um público que compra com a razão e a emoção ao mesmo tempo — e que está acostumado com promessas vazias do setor.',
    strategy: 'Desenvolvemos uma campanha de lançamento em 3 fases: teaser de mistério gerando especulação nas redes do segmento; evento exclusivo para corretores com experiência imersiva do empreendimento; e lançamento público com escassez real comunicada. A narrativa centrou não no apartamento, mas no estilo de vida que ele representa.',
    results: [
      { value: '100%', label: 'Unidades vendidas em 72h' },
      { value: 'R$48M', label: 'Em vendas geradas' },
      { value: '320', label: 'Leads qualificados' },
      { value: '15', label: 'Dias de campanha' },
    ],
    details: 'Estratégia de lançamento, identidade do empreendimento, materiais de venda premium, campanha digital e evento de lançamento. Melhor resultado de velocidade de vendas da construtora em 20 anos de mercado.',
  },
  {
    id: 'esportes',
    num: '12',
    title: 'Velocity Unbound',
    category: 'Esportes & Ativação',
    tags: ['esportes', 'ativação', 'campanha'],
    client: 'Adrenaline Sports',
    year: '2026',
    role: 'Direção Criativa & Produção',
    accent: '#ff3030',
    isConceptual: true,
    image: '/assets/projects/esportes.png',
    description: 'Campanha de ativação de marca esportiva com conceito de velocidade sem limites.',
    challenge: 'Uma marca esportiva querendo se posicionar no segmento premium de performance, mas com comunicação que não se diferenciava das marcas mainstream. O público-alvo — atletas amadores sérios — sentia que a marca não os entendia de verdade.',
    strategy: 'Produzimos conteúdo com atletas reais, não modelos. Filmagem em condições extremas reais — pista de corrida às 5h da manhã, câmeras de alta velocidade capturando milissegundos decisivos. O conceito "Velocity Unbound" evoca que o único limite é o que você aceita como limite. Ativação em 6 grandes competições nacionais.',
    results: [
      { value: '4x', label: 'CTR acima da média' },
      { value: '1.2M', label: 'Visualizações do filme' },
      { value: '+89%', label: 'Brand lift' },
      { value: '6', label: 'Cidades ativadas' },
    ],
    details: 'Filme publicitário de 90s, cortes de 15s e 6s para social, peças estáticas e ativação física em eventos. O filme ganhou prêmio de melhor produção no festival regional de publicidade.',
  },
  {
    id: 'csag',
    num: '13',
    title: 'O Legado CS Ag',
    category: 'Branding Institucional',
    tags: ['institucional', 'branding', 'identidade'],
    client: 'Comunicação Social Ag',
    year: 'Desde 2020',
    role: 'Quem Somos',
    accent: '#f7d406',
    isConceptual: false,
    image: '/assets/projects/sobre.png',
    description: 'Nossa essência: estrategistas que pensam, criativos que realizam. Nascemos em Poços de Caldas, atuamos sem fronteiras.',
    challenge: 'Criar uma agência que realmente entregasse o que promete — não apenas campanhas bonitas, mas resultados mensuráveis. O mercado publicitário local estava acostumado com o medíocre. Queríamos mudar o padrão de referência.',
    strategy: 'Construímos cada projeto como se fosse o único. Sem templates, sem atalhos. Investimos em tecnologia quando o mercado ainda usava planilhas, em vídeo quando texto era o padrão, em IA quando ainda era novidade. A evolução constante virou nossa identidade.',
    results: [
      { value: '80+', label: 'Clientes atendidos' },
      { value: '+400%', label: 'Crescimento em 4 anos' },
      { value: '5', label: 'Anos de mercado' },
      { value: '∞', label: 'Fronteiras de atuação' },
    ],
    details: 'Em Poços de Caldas, atuando globalmente. Design estratégico, desenvolvimento tecnológico e marketing focado em conversão para elevar marcas que merecem ser vistas.',
  },
  {
    id: 'eliteos',
    num: '14',
    title: 'Plataforma EliteOS',
    category: 'Design de Produto & SaaS',
    tags: ['produto', 'saas', 'ux'],
    client: 'Elite OS Inc.',
    year: '2026',
    role: 'UX/UI & Full-stack',
    accent: '#818cf8',
    isConceptual: true,
    image: '/assets/projects/home-old.png',
    description: 'Sistema operacional integrado para gestão de agências criativas — CRM, Kanban e BI em uma interface premium.',
    challenge: 'Agências criativas gerenciando projetos em 5+ ferramentas diferentes: WhatsApp para briefing, planilha para financeiro, Trello para tarefas, Drive para arquivos, e-mail para aprovações. O caos operacional consumia horas que deveriam ir para criação.',
    strategy: 'Desenvolvemos o EliteOS — uma plataforma all-in-one desenhada especificamente para o fluxo de trabalho criativo. Interface premium que inspira, não apenas funciona. IA integrada para briefing automático, estimativa de horas e dashboards de rentabilidade por cliente e projeto.',
    results: [
      { value: '300+', label: 'Usuários ativos' },
      { value: '-65%', label: 'Tempo de gestão' },
      { value: '12', label: 'Módulos integrados' },
      { value: '99.8%', label: 'Uptime' },
    ],
    details: 'Desenvolvida com React, TailwindCSS e Supabase. IA para briefing automático e estimativas. Dashboard de rentabilidade por cliente. App mobile em desenvolvimento.',
  },
  {
    id: 'livia-esper-site',
    num: '15',
    title: 'Dra. Lívia Esper | Experiência Web',
    category: 'Web Experience & Storytelling',
    tags: ['web design', 'storytelling', 'gsap', 'odontopediatria', 'conversão'],
    client: 'Dra. Lívia Esper Odontopediatria',
    year: '2026',
    role: 'Branding Digital, UI/UX & Desenvolvimento',
    accent: '#f472b6',
    isConceptual: false,
    image: '/assets/projects/livia-site.png',
    description: 'Experiência digital imersiva com animação 3D, scrollytelling lúdico e pré-cadastro inteligente que elimina o medo infantil de dentista.',
    challenge: 'A consulta odontopediátrica gera ansiedade nas crianças e nos pais. Sites convencionais de saúde são frios e burocráticos. O desafio era criar uma experiência acolhedora que transformasse a clínica no "Reino da Boca" e aumentasse a taxa de agendamentos.',
    strategy: 'Construímos uma narrativa cinematográfica conduzida pelo personagem 3D "O Dentinho", com 6 atos de scrollytelling interativo via GSAP. Integramos um sistema de pré-cadastro com Token Mágico para os pais preencherem a anamnese online e marcação em 1 clique via WhatsApp.',
    results: [
      { value: '+140%', label: 'Aumento em agendamentos' },
      { value: '4.8 min', label: 'Tempo médio no site' },
      { value: '-75%', label: 'Tempo de espera na clínica' },
      { value: '98%', label: 'Satisfação dos responsáveis' },
    ],
    details: 'Desenvolvido em React com GSAP ScrollTrigger. Vídeo scrubber interativo com render 3D proprietário, paleta afetuosa em tons pastel e portal integrado para pré-atendimento sem fricção.',
  },
  {
    id: 'livia-esper-sistema',
    num: '16',
    title: 'Dra. Lívia Esper | Sistema Clínico',
    category: 'Design de Produto & SaaS',
    tags: ['saas', 'gestão clínica', 'prontuário', 'ia', 'firebase'],
    client: 'Clínica Dra. Lívia Esper',
    year: '2026',
    role: 'Product Design & Full-Stack Development',
    accent: '#38bdf8',
    isConceptual: false,
    image: '/assets/projects/livia-sistema.png',
    description: 'ERP clínico sob medida para odontopediatria — prontuário com odontograma decíduo interativo, IA comportamental e régua de WhatsApp.',
    challenge: 'Softwares médicos tradicionais são genéricos e pensados apenas para adultos. A clínica sofria com fichas de papel, alto índice de faltas e perda de tempo no preenchimento de evoluções e controle de dentes de leite.',
    strategy: 'Criamos um software proprietário completo: Dashboard com visão de cadeira clínica e alertas de IA; prontuário com odontograma interativo para dentes decíduos e permanentes; régua automática de WhatsApp em 1 clique para pós-consulta; e gamificação com Medalhas de Coragem para as crianças.',
    results: [
      { value: '100%', label: 'Eliminação do papel' },
      { value: '-50%', label: 'Redução em faltas (no-show)' },
      { value: '3x', label: 'Mais rapidez em evoluções' },
      { value: 'R$ 0', label: 'Custo de licença de terceiros' },
    ],
    details: 'Full-stack em React 19 e Firebase Firestore em tempo real. Assistente clínico com IA para transcrição de consultas, suporte a radiografias DICOM, controle financeiro por convênio e portal do responsável.',
  },
];

// ─── CATEGORIES DEFINITION ───────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'all', label: 'Todos' },
  { id: 'branding', label: 'Branding', match: ['Identidade Visual', 'Branding Institucional'] },
  { id: 'estrategia', label: 'Estratégia', match: ['Estratégia Digital', 'ESG & Sustentabilidade', 'Performance & Social'] },
  { id: 'campanhas', label: 'Campanhas', match: ['Campanha Urbana', 'Moda Editorial', 'Campanha Cross-Media', 'Ativação & Evento', 'B2B & Eventos Corporativos', 'Food & Lifestyle', 'Imobiliário Premium', 'Esportes & Ativação'] },
  { id: 'tech', label: 'Tech & SaaS', match: ['Design de Produto & SaaS', 'Web Experience & Storytelling'] },
];

function projectMatchesCategory(proj, catId) {
  if (!catId || catId === 'all') return true;
  const cat = CATEGORIES.find(c => c.id === catId);
  if (!cat || !cat.match) return true;
  return cat.match.includes(proj.category);
}

// ─── SONIC BRANDING ENGINE (Web Audio API) ────────────────────────────────────
let audioCtxInstance = null;
function getAudioContext() {
  try {
    if (!audioCtxInstance) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) audioCtxInstance = new AudioCtx();
    }
    if (audioCtxInstance && audioCtxInstance.state === 'suspended') {
      audioCtxInstance.resume();
    }
    return audioCtxInstance;
  } catch (e) {
    return null;
  }
}

function playHoverSound(enabled = true) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2350, now);
    osc.frequency.exponentialRampToValueAtTime(2600, now + 0.06);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.025, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  } catch (e) {}
}

function playClickSound(enabled = true) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(820, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.04);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.05, now + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  } catch (e) {}
}

function playTransitionSound(enabled = true) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const bufferSize = ctx.sampleRate * 0.4;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;
    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, now);
    filter.frequency.exponentialRampToValueAtTime(1400, now + 0.22);
    filter.frequency.exponentialRampToValueAtTime(320, now + 0.4);
    filter.Q.setValueAtTime(2.2, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.04, now + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    whiteNoise.start(now);
    whiteNoise.stop(now + 0.41);
  } catch (e) {}
}

function playBigBangAudio(enabled = true) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // 1. Deep Sub-bass boom & sub-bass punch (130Hz -> 22Hz)
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(130, now);
    osc.frequency.exponentialRampToValueAtTime(22, now + 2.2);

    oscGain.gain.setValueAtTime(0.001, now);
    oscGain.gain.linearRampToValueAtTime(0.92, now + 0.035);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 2.4);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 2.5);

    // 1b. Secondary sub-triangle body for acoustic chest-weight
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(58, now);
    subOsc.frequency.exponentialRampToValueAtTime(28, now + 1.6);
    subGain.gain.setValueAtTime(0.001, now);
    subGain.gain.linearRampToValueAtTime(0.45, now + 0.05);
    subGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 1.9);

    // 2. High-energy filtered noise burst
    const bufferSize = ctx.sampleRate * 1.8;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;
    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3800, now);
    filter.frequency.exponentialRampToValueAtTime(65, now + 1.6);
    filter.Q.setValueAtTime(4.5, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.001, now);
    noiseGain.gain.linearRampToValueAtTime(0.72, now + 0.025);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.7);

    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    whiteNoise.start(now);
    whiteNoise.stop(now + 1.8);

    // 3. Quad Celestial Sparkle Chimes
    [1320, 1980, 2640, 3960].forEach((freq, idx) => {
      const sparkleOsc = ctx.createOscillator();
      const sparkleGain = ctx.createGain();
      sparkleOsc.type = 'sine';
      sparkleOsc.frequency.setValueAtTime(freq, now + idx * 0.015);
      sparkleOsc.frequency.exponentialRampToValueAtTime(freq * 1.45, now + 1.4);

      sparkleGain.gain.setValueAtTime(0.001, now + idx * 0.015);
      sparkleGain.gain.linearRampToValueAtTime(0.14 / (idx + 1), now + 0.06 + idx * 0.015);
      sparkleGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);

      sparkleOsc.connect(sparkleGain);
      sparkleGain.connect(ctx.destination);
      sparkleOsc.start(now + idx * 0.015);
      sparkleOsc.stop(now + 2.1);
    });
  } catch (err) {
    console.warn('Big Bang Audio:', err);
  }
}

// ─── MAGNETIC LIQUID CURSOR ───────────────────────────────────────────────────
function MagneticCursor({ text = '', isHovered = false, isDragging = false }) {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isFine) return;
    document.body.classList.add('has-custom-cursor');

    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let ringX = mouseX, ringY = mouseY;
    let rafId;

    const onMouseMove = (e) => {
      setVisible(true);
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
    };

    const onMouseLeave = () => setVisible(false);
    const onMouseEnter = () => setVisible(true);

    const render = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }
      rafId = requestAnimationFrame(render);
    };
    rafId = requestAnimationFrame(render);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      document.body.classList.remove('has-custom-cursor');
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" style={{ opacity: visible ? 1 : 0 }} />
      <div
        ref={ringRef}
        className={`cursor-ring ${isHovered ? 'is-hovered' : ''} ${isDragging ? 'is-dragging' : ''}`}
        style={{ opacity: visible ? 1 : 0 }}
      >
        <span className="cursor-label">{text}</span>
      </div>
    </>
  );
}

// ─── INTRO VIDEO (MANIFESTO DA MARCA) ──────────────────────────────────────────
function IntroVideo({ onComplete }) {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const completedRef = useRef(false);

  const triggerFinish = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    onComplete();
  }, [onComplete]);

  const toggleAudio = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const curr = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 7.2;
    setProgress((curr / dur) * 100);

    // Big Bang climax at 6.7s
    if (curr >= 6.7 && !completedRef.current) {
      triggerFinish();
    }
  };

  return (
    <div className="intro-container">
      <video
        ref={videoRef}
        className="intro-video-element"
        src="/assets/intro.mp4"
        autoPlay
        playsInline
        muted={isMuted}
        onTimeUpdate={handleTimeUpdate}
        onEnded={triggerFinish}
      />
      <div className="intro-vignette" />

      {/* Top HUD */}
      <div className="intro-top-bar">
        <div className="intro-brand-badge">
          <img src="/assets/brand/logo-sem-fundo.png" alt="CS Ag" className="intro-badge-logo" />
          <div className="intro-badge-text">
            <span className="intro-badge-title">Comunicação Social Ag®</span>
            <span className="intro-badge-subtitle">A Origem • Manifesto Visual</span>
          </div>
        </div>

        <div className="intro-badge-live">
          <span className="pulse-dot-gold" />
          <span>Experiência Imersiva</span>
        </div>
      </div>

      {/* Bottom HUD */}
      <div className="intro-bottom-bar">
        <div className="intro-manifesto-snippet">
          <span className="intro-manifesto-tag">Gênese da Marca</span>
          <p className="intro-manifesto-phrase">
            Da matéria primordial à expansão criativa infinita.
          </p>
        </div>

        <div className="intro-controls">
          <button className="btn-intro-audio" onClick={toggleAudio} title="Alternar áudio">
            {isMuted ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <line x1="23" y1="9" x2="17" y2="15"></line>
                  <line x1="17" y1="9" x2="23" y2="15"></line>
                </svg>
                <span>Ativar Som</span>
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                </svg>
                <span>Som Ligado</span>
              </>
            )}
          </button>

          <button className="btn-skip-intro" onClick={triggerFinish}>
            <span>Pular Intro</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 4 15 12 5 20 5 4"></polygon>
              <line x1="19" y1="5" x2="19" y2="19"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="intro-progress-bar">
        <div className="intro-progress-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

// ─── HELPER: CIRCULAR GLOW PARTICLE SHADER ──────────────────────────────────
// Strictly circular fragment shader: discards length(coord) > 0.5 to banish all square quad artifacts
function createCircularParticleMaterial({ sizeMultiplier = 1.0, pixelRatio = null } = {}) {
  const pr = pixelRatio !== null ? pixelRatio : Math.min(typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1, 2);
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uPixelRatio: { value: pr },
      uSizeMultiplier: { value: sizeMultiplier }
    },
    vertexShader: `
      uniform float uPixelRatio;
      uniform float uSizeMultiplier;
      
      attribute float aSize;
      attribute vec3 aColor;
      attribute float aAlpha;
      
      varying vec3 vColor;
      varying float vAlpha;
      
      void main() {
        vColor = aColor;
        vAlpha = aAlpha;
        
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        float pointScale = (360.0 / -mvPosition.z) * uPixelRatio * uSizeMultiplier;
        gl_PointSize = clamp(aSize * pointScale, 1.0, 180.0);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      precision highp float;
      
      varying vec3 vColor;
      varying float vAlpha;
      
      void main() {
        // Distance from center of point quad: [-0.5 .. 0.5]
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        
        // Strict circular cutoff: mathematically eliminates any square quad artifact
        if (dist > 0.5) {
          discard;
        }
        
        // Anti-aliased soft outer perimeter
        float edge = smoothstep(0.5, 0.40, dist);
        
        // Incandescent fusion core (white-hot center)
        float core = smoothstep(0.18, 0.0, dist);
        vec3 finalColor = mix(vColor, vec3(1.0, 1.0, 1.0), core * 0.9);
        
        // Inverse-exponential optical glow falloff
        float radiance = exp(-dist * 4.0);
        
        float alpha = vAlpha * edge * radiance;
        if (alpha < 0.002) {
          discard;
        }
        
        gl_FragColor = vec4(finalColor, alpha);
      }
    `
  });
}

// ─── SPHERE GALLERY (3D BIG BANG UNIVERSE) ─────────────────────────────────────
function SphereGallery({
  genesisTrigger,
  activeCategory,
  soundEnabled,
  onHover,
  onClick,
  onCursorChange
}) {
  const canvasRef     = useRef(null);
  const groupRef      = useRef(null);
  const meshesRef     = useRef([]);
  const rafRef        = useRef(null);
  const isDownRef     = useRef(false);
  const lastPosRef    = useRef({ x: 0, y: 0 });
  const isDragRef     = useRef(false);
  const velRef        = useRef({ x: 0, y: 0 });
  const targetRotRef  = useRef({ x: 0, y: 0 });
  const currentRotRef = useRef({ x: 0, y: 0 });
  const hoveredRef    = useRef(null);
  const mouseRef      = useRef(new THREE.Vector2(-9, -9));
  const raycasterRef  = useRef(new THREE.Raycaster());
  const cameraRef     = useRef(null);
  const rendererRef   = useRef(null);
  const isTransitioningRef = useRef(false);

  // Reactive Category Filter Update on 3D Cards
  useEffect(() => {
    if (!meshesRef.current.length) return;
    meshesRef.current.forEach(mesh => {
      const matches = projectMatchesCategory(mesh.userData.proj, activeCategory);
      if (matches) {
        gsap.to(mesh.material, { opacity: 0.92, duration: 0.45, ease: 'power2.out' });
        gsap.to(mesh.scale, { x: 1, y: 1, z: 1, duration: 0.45, ease: 'power2.out' });
        if (mesh.userData.edgeLine) {
          gsap.to(mesh.userData.edgeLine.material, {
            opacity: activeCategory === 'all' ? 0.15 : 0.75,
            duration: 0.45
          });
        }
      } else {
        gsap.to(mesh.material, { opacity: 0.12, duration: 0.45, ease: 'power2.out' });
        gsap.to(mesh.scale, { x: 0.88, y: 0.88, z: 0.88, duration: 0.45, ease: 'power2.out' });
        if (mesh.userData.edgeLine) {
          gsap.to(mesh.userData.edgeLine.material, { opacity: 0.02, duration: 0.45 });
        }
      }
    });
  }, [activeCategory]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene  = new THREE.Scene();
    scene.background = new THREE.Color(0x070708);
    const W = window.innerWidth, H = window.innerHeight;
    const camera = new THREE.PerspectiveCamera(85, W / H, 0.1, 500);
    camera.position.set(0, 0, 0.01);
    cameraRef.current = camera;

    const isMobile = typeof window !== 'undefined' && (window.innerWidth < 768 || /Mobi|Android|iPhone/i.test(navigator.userAgent));
    const effectivePixelRatio = isMobile ? 1.0 : Math.min(window.devicePixelRatio || 1, 2);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(W, H);
    renderer.setPixelRatio(effectivePixelRatio);
    rendererRef.current = renderer;

    // Ambient Starfield Particles (450 Mobile / 1,800 Desktop Circular Anti-Aliased Star Orbs)
    const pCount = isMobile ? 450 : 1800;
    const pPos = new Float32Array(pCount * 3);
    const pColor = new Float32Array(pCount * 3);
    const pSize = new Float32Array(pCount);
    const pAlpha = new Float32Array(pCount);

    for (let i = 0; i < pCount; i++) {
      const idx3 = i * 3;
      pPos[idx3]     = (Math.random() - 0.5) * 140;
      pPos[idx3 + 1] = (Math.random() - 0.5) * 140;
      pPos[idx3 + 2] = (Math.random() - 0.5) * 140;

      if (Math.random() > 0.25) {
        // Brand Warm Gold
        pColor[idx3]     = 0.968;
        pColor[idx3 + 1] = 0.831;
        pColor[idx3 + 2] = 0.024;
      } else {
        // Diamond Starlight White
        pColor[idx3]     = 0.96;
        pColor[idx3 + 1] = 0.97;
        pColor[idx3 + 2] = 1.0;
      }

      pSize[i]  = Math.random() * 0.12 + 0.04;
      pAlpha[i] = Math.random() * 0.42 + 0.14;
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('aColor', new THREE.BufferAttribute(pColor, 3));
    pGeo.setAttribute('aSize', new THREE.BufferAttribute(pSize, 1));
    pGeo.setAttribute('aAlpha', new THREE.BufferAttribute(pAlpha, 1));
    const pMat = createCircularParticleMaterial({ sizeMultiplier: 1.0, pixelRatio: effectivePixelRatio });
    const ambientParticles = new THREE.Points(pGeo, pMat);
    scene.add(ambientParticles);

    // Big Bang Explosion Cosmic Embers (600 Mobile / 2,600 Desktop in 4 Physical Tiers)
    const expCount = isMobile ? 600 : 2600;
    const expPos = new Float32Array(expCount * 3);
    const expColor = new Float32Array(expCount * 3);
    const expSize = new Float32Array(expCount);
    const expAlpha = new Float32Array(expCount);

    // Dynamic Physics Arrays
    const expVel = new Float32Array(expCount * 3);
    const expDrag = new Float32Array(expCount);
    const expDecay = new Float32Array(expCount);
    const expMinAlpha = new Float32Array(expCount);
    const expSwirl = new Float32Array(expCount);

    const tier1Limit = Math.round(expCount * 0.17);
    const tier2Limit = Math.round(expCount * 0.65);
    const tier3Limit = Math.round(expCount * 0.90);

    for (let i = 0; i < expCount; i++) {
      const idx3 = i * 3;
      expPos[idx3]     = 0;
      expPos[idx3 + 1] = 0;
      expPos[idx3 + 2] = 0;

      if (i < tier1Limit) {
        // TIER 1: Needle Sparks (Hyper-Velocity White-Gold Piercing Rays)
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const speed = (Math.random() * 32 + 38) * 0.06;
        const sinPhi = Math.sin(phi);

        expVel[idx3]     = Math.cos(theta) * sinPhi * speed;
        expVel[idx3 + 1] = Math.sin(theta) * sinPhi * speed;
        expVel[idx3 + 2] = (Math.cos(phi) * 0.75 + 0.35) * speed;

        expColor[idx3]     = 1.0;
        expColor[idx3 + 1] = 0.98;
        expColor[idx3 + 2] = 0.88;

        expSize[i]     = Math.random() * 0.2 + 0.12;
        expAlpha[i]    = 1.0;
        expDrag[i]     = 0.942;
        expDecay[i]    = 0.965;
        expMinAlpha[i] = 0.0;
        expSwirl[i]    = 0.0;

      } else if (i < tier2Limit) {
        // TIER 2: Stellar Embers & Molten Fire (Dense 3D Swirl Cluster)
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const speed = (Math.random() * 24 + 14) * 0.052;
        const sinPhi = Math.sin(phi);

        expVel[idx3]     = Math.cos(theta) * sinPhi * speed;
        expVel[idx3 + 1] = Math.sin(theta) * sinPhi * speed;
        expVel[idx3 + 2] = Math.cos(phi) * speed;

        const paletteChoice = Math.random();
        if (paletteChoice < 0.65) {
          expColor[idx3]     = 0.968;
          expColor[idx3 + 1] = 0.831;
          expColor[idx3 + 2] = 0.024; // #f7d406 Brand Gold
        } else if (paletteChoice < 0.88) {
          expColor[idx3]     = 1.0;
          expColor[idx3 + 1] = 0.619;
          expColor[idx3 + 2] = 0.0;   // #ff9e00 Solar Amber
        } else {
          expColor[idx3]     = 1.0;
          expColor[idx3 + 1] = 0.282;
          expColor[idx3 + 2] = 0.0;   // #ff4800 Incandescent Flare
        }

        expSize[i]     = Math.random() * 0.45 + 0.25;
        expAlpha[i]    = 0.98;
        expDrag[i]     = 0.956;
        expDecay[i]    = 0.984;
        expMinAlpha[i] = 0.0;
        expSwirl[i]    = (Math.random() - 0.5) * 0.024;

      } else if (i < tier3Limit) {
        // TIER 3: Persistent Cosmic Stardust (Lingers Around 3D Cards)
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const speed = (Math.random() * 7.0 + 3.0) * 0.046;
        const sinPhi = Math.sin(phi);

        expVel[idx3]     = Math.cos(theta) * sinPhi * speed;
        expVel[idx3 + 1] = Math.sin(theta) * sinPhi * speed;
        expVel[idx3 + 2] = Math.cos(phi) * speed;

        expColor[idx3]     = 0.98;
        expColor[idx3 + 1] = 0.88;
        expColor[idx3 + 2] = 0.36;

        expSize[i]     = Math.random() * 0.22 + 0.12;
        expAlpha[i]    = 0.92;
        expDrag[i]     = 0.968;
        expDecay[i]    = 0.992;
        expMinAlpha[i] = Math.random() * 0.32 + 0.14; // Persistent glow!
        expSwirl[i]    = (Math.random() - 0.5) * 0.008;

      } else {
        // TIER 4: Equatorial Shockwave Halo (Coherent Planar Expansion)
        const angle = Math.random() * Math.PI * 2;
        const speed = (Math.random() * 18 + 26) * 0.056;
        const yJitter = (Math.random() - 0.5) * 1.6;

        expVel[idx3]     = Math.cos(angle) * speed;
        expVel[idx3 + 1] = yJitter * 0.056;
        expVel[idx3 + 2] = Math.sin(angle) * speed;

        expColor[idx3]     = 1.0;
        expColor[idx3 + 1] = 0.96;
        expColor[idx3 + 2] = 0.70;

        expSize[i]     = Math.random() * 0.32 + 0.22;
        expAlpha[i]    = 0.95;
        expDrag[i]     = 0.945;
        expDecay[i]    = 0.978;
        expMinAlpha[i] = 0.0;
        expSwirl[i]    = 0.016;
      }
    }

    const expGeo = new THREE.BufferGeometry();
    expGeo.setAttribute('position', new THREE.BufferAttribute(expPos, 3));
    expGeo.setAttribute('aColor', new THREE.BufferAttribute(expColor, 3));
    expGeo.setAttribute('aSize', new THREE.BufferAttribute(expSize, 1));
    expGeo.setAttribute('aAlpha', new THREE.BufferAttribute(expAlpha, 1));
    const expMat = createCircularParticleMaterial({ sizeMultiplier: 1.15, pixelRatio: effectivePixelRatio });
    const expParticles = new THREE.Points(expGeo, expMat);
    scene.add(expParticles);

    // Expanding Shockwave Rings (Optical Precision Gradients)
    const ring1Geo = new THREE.RingGeometry(0.2, 0.9, 96);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0xf7d406,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 2.2;
    scene.add(ring1);

    gsap.fromTo(ring1.scale, { x: 0.01, y: 0.01, z: 0.01 }, { x: 56, y: 56, z: 56, duration: 2.0, ease: 'power2.out' });
    gsap.fromTo(ring1Mat, { opacity: 0.95 }, { opacity: 0, duration: 2.0, ease: 'power2.out' });

    const ring2Geo = new THREE.RingGeometry(0.2, 0.65, 96);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 3.4;
    scene.add(ring2);

    gsap.fromTo(ring2.scale, { x: 0.01, y: 0.01, z: 0.01 }, { x: 44, y: 44, z: 44, duration: 1.6, delay: 0.05, ease: 'power2.out' });
    gsap.fromTo(ring2Mat, { opacity: 0.9 }, { opacity: 0, duration: 1.6, delay: 0.05, ease: 'power2.out' });

    // Camera FOV recoil & Spatial Kinetic Recoil
    camera.position.set(0, 0, -1.6);
    camera.fov = 94;
    camera.updateProjectionMatrix();

    gsap.to(camera.position, {
      z: 0.01,
      duration: 2.4,
      ease: 'power4.out'
    });

    gsap.to(camera, {
      fov: 65,
      duration: 2.4,
      ease: 'power3.out',
      onUpdate: () => camera.updateProjectionMatrix()
    });

    const shake = { val: 0.38 };
    gsap.to(shake, {
      val: 0,
      duration: 1.35,
      ease: 'power2.out',
      onUpdate: () => {
        if (shake.val > 0.001) {
          camera.position.x = (Math.random() - 0.5) * shake.val;
          camera.position.y = (Math.random() - 0.5) * shake.val;
        } else if (!isTransitioningRef.current) {
          camera.position.x = 0;
          camera.position.y = 0;
        }
      }
    });

    // Wireframe Sphere
    const RADIUS = 20;
    const wireGeo = new THREE.SphereGeometry(RADIUS + 1.5, 28, 18);
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x1c1c24, wireframe: true, transparent: true, opacity: 0.055 });
    const wireSphere = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wireSphere);

    // Group for Cards
    const group = new THREE.Group();
    scene.add(group);
    groupRef.current = group;

    // Cards
    const loader   = new THREE.TextureLoader();
    const meshes   = [];
    const total    = PROJECTS.length;
    const CARD_W   = 8.0, CARD_H = 5.3;
    const cardGeo  = new THREE.PlaneGeometry(CARD_W, CARD_H);
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    PROJECTS.forEach((proj, i) => {
      const yNorm = 1 - (i / (total - 1)) * 2;
      const rAtY  = Math.sqrt(Math.max(0, 1 - yNorm * yNorm));
      const theta = goldenAngle * i;
      const finalPos = new THREE.Vector3(Math.cos(theta) * rAtY * RADIUS, yNorm * RADIUS, Math.sin(theta) * rAtY * RADIUS);

      const tex = loader.load(proj.image);
      tex.colorSpace = THREE.SRGBColorSpace;
      const mat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide, transparent: true, opacity: 0 });
      const mesh = new THREE.Mesh(cardGeo, mat);

      // Edge glow wireframe (Razor-sharp gold border)
      const edgeGeo = new THREE.EdgesGeometry(cardGeo);
      const edgeMat = new THREE.LineBasicMaterial({ color: 0xf7d406, transparent: true, opacity: 0.15 });
      const edgeLine = new THREE.LineSegments(edgeGeo, edgeMat);
      mesh.add(edgeLine);
      
      // Genesis: starts at origin
      mesh.position.set(0, 0, 0);
      mesh.scale.set(0.001, 0.001, 0.001);
      mesh.lookAt(0, 0, 0);
      mesh.userData = {
        proj,
        idx: i,
        finalPos,
        edgeLine,
        baseRot: mesh.rotation.clone()
      };
      group.add(mesh);
      meshes.push(mesh);

      // Big Bang ejection animation
      const delay = 0.08 + (i * 0.038);
      gsap.to(mesh.position, {
        x: finalPos.x,
        y: finalPos.y,
        z: finalPos.z,
        duration: 2.2,
        delay,
        ease: 'power4.out',
        onUpdate: () => {
          mesh.lookAt(0, 0, 0);
          mesh.userData.baseRot = mesh.rotation.clone();
        }
      });
      gsap.to(mesh.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 1.9,
        delay,
        ease: 'back.out(1.4)'
      });
      gsap.to(mat, {
        opacity: 0.88,
        duration: 1.5,
        delay: delay + 0.05,
        ease: 'power2.out'
      });
    });
    meshesRef.current = meshes;

    // Animation Loop
    const FRICTION = 0.92, AUTO_SPEED = 0.0006, LERP = 0.072;
    function animate() {
      rafRef.current = requestAnimationFrame(animate);

      // Dynamic physics update for Big Bang 4-Tier Particle System
      const pArr = expGeo.attributes.position.array;
      const aArr = expGeo.attributes.aAlpha.array;
      let needAlphaUpdate = false;

      for (let j = 0; j < expCount; j++) {
        const idx3 = j * 3;

        // Apply velocities
        pArr[idx3]     += expVel[idx3];
        pArr[idx3 + 1] += expVel[idx3 + 1];
        pArr[idx3 + 2] += expVel[idx3 + 2];

        // Apply per-particle physical drag deceleration
        const drag = expDrag[j];
        expVel[idx3]     *= drag;
        expVel[idx3 + 1] *= drag;
        expVel[idx3 + 2] *= drag;

        // Tangential vortex curl / swirl around central Y-axis
        const swirl = expSwirl[j];
        if (swirl !== 0) {
          const cosS = Math.cos(swirl);
          const sinS = Math.sin(swirl);
          const px = pArr[idx3];
          const pz = pArr[idx3 + 2];
          pArr[idx3]     = px * cosS - pz * sinS;
          pArr[idx3 + 2] = px * sinS + pz * cosS;
        }

        // Per-tier alpha decay with minimum floor (stardust persists!)
        const minA = expMinAlpha[j];
        if (aArr[j] > minA) {
          aArr[j] = Math.max(minA, aArr[j] * expDecay[j]);
          needAlphaUpdate = true;
        }
      }

      expGeo.attributes.position.needsUpdate = true;
      if (needAlphaUpdate) {
        expGeo.attributes.aAlpha.needsUpdate = true;
      }

      if (!isDownRef.current && !isTransitioningRef.current) {
        targetRotRef.current.x += AUTO_SPEED;
        velRef.current.x *= FRICTION;
        velRef.current.y *= FRICTION;
        targetRotRef.current.x += velRef.current.x;
        targetRotRef.current.y += velRef.current.y;
      }
      targetRotRef.current.y = Math.max(-Math.PI / 6, Math.min(Math.PI / 6, targetRotRef.current.y));
      currentRotRef.current.x += (targetRotRef.current.x - currentRotRef.current.x) * LERP;
      currentRotRef.current.y += (targetRotRef.current.y - currentRotRef.current.y) * LERP;
      group.rotation.y = currentRotRef.current.x;
      group.rotation.x = currentRotRef.current.y;
      wireSphere.rotation.y = currentRotRef.current.x * 0.25;
      ambientParticles.rotation.y += 0.00015;
      expParticles.rotation.y += 0.0002;

      // Raycasting for cards
      if (!isTransitioningRef.current) {
        raycasterRef.current.setFromCamera(mouseRef.current, camera);
        const hits = raycasterRef.current.intersectObjects(meshes);
        const hit  = hits.length > 0 ? hits[0].object : null;

        if (hit !== hoveredRef.current) {
          if (hoveredRef.current) {
            const old = hoveredRef.current;
            const matches = projectMatchesCategory(old.userData.proj, activeCategory);
            gsap.to(old.scale, { x: matches ? 1 : 0.88, y: matches ? 1 : 0.88, z: matches ? 1 : 0.88, duration: 0.35, ease: 'power2.out' });
            gsap.to(old.material, { opacity: matches ? 0.92 : 0.12, duration: 0.3 });
            if (old.userData.edgeLine) {
              gsap.to(old.userData.edgeLine.material, {
                opacity: activeCategory === 'all' ? 0.15 : (matches ? 0.75 : 0.02),
                duration: 0.3
              });
            }
            if (old.userData.baseRot) {
              gsap.to(old.rotation, {
                x: old.userData.baseRot.x,
                y: old.userData.baseRot.y,
                z: old.userData.baseRot.z,
                duration: 0.4,
                ease: 'power2.out'
              });
            }
          }
          if (hit) {
            const matches = projectMatchesCategory(hit.userData.proj, activeCategory);
            gsap.to(hit.scale, { x: 1.15, y: 1.15, z: 1.15, duration: 0.4, ease: 'power2.out' });
            gsap.to(hit.material, { opacity: 1, duration: 0.25 });
            if (hit.userData.edgeLine) {
              gsap.to(hit.userData.edgeLine.material, { opacity: 1, duration: 0.25 });
            }
            playHoverSound(soundEnabled);
            onHover(hit.userData.proj);
            if (onCursorChange) onCursorChange({ isHovered: true, text: 'VER CASE' });
          } else {
            onHover(null);
            if (onCursorChange) onCursorChange({ isHovered: false, text: isDownRef.current ? 'ARRASTANDO' : 'ARRASTAR' });
          }
          hoveredRef.current = hit;
        }

        // Magnetic Tilt Parallax for hovered card
        if (hoveredRef.current && hoveredRef.current.userData.baseRot) {
          const card = hoveredRef.current;
          const tiltX = mouseRef.current.y * 0.18;
          const tiltY = mouseRef.current.x * 0.18;
          card.rotation.x = card.userData.baseRot.x - tiltX;
          card.rotation.y = card.userData.baseRot.y + tiltY;
        }
      }

      renderer.render(scene, camera);
    }
    animate();

    function onDown(e) {
      isDownRef.current = true; isDragRef.current = false;
      const src = e.touches ? e.touches[0] : e;
      lastPosRef.current = { x: src.clientX, y: src.clientY };
      velRef.current = { x: 0, y: 0 };
      if (onCursorChange) onCursorChange({ isDragging: true, text: 'ARRASTANDO' });
    }
    function onMove(e) {
      const src = e.touches ? e.touches[0] : e;
      mouseRef.current.x = (src.clientX / W) * 2 - 1;
      mouseRef.current.y = -(src.clientY / H) * 2 + 1;
      if (!isDownRef.current) return;
      const dx = src.clientX - lastPosRef.current.x, dy = src.clientY - lastPosRef.current.y;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) isDragRef.current = true;
      const DRAG = 0.0018;
      targetRotRef.current.x += dx * DRAG;
      targetRotRef.current.y += dy * DRAG;
      velRef.current.x = dx * DRAG * 0.55;
      velRef.current.y = dy * DRAG * 0.55;
      lastPosRef.current = { x: src.clientX, y: src.clientY };
    }
    function onUp() {
      isDownRef.current = false;
      if (onCursorChange) onCursorChange({ isDragging: false, text: hoveredRef.current ? 'VER CASE' : 'ARRASTAR' });
      if (!isDragRef.current && hoveredRef.current && !isTransitioningRef.current) {
        const hit = hoveredRef.current;
        isTransitioningRef.current = true;
        playClickSound(soundEnabled);
        playTransitionSound(soundEnabled);

        // Fly-through camera zoom towards the clicked card
        const worldPos = new THREE.Vector3();
        hit.getWorldPosition(worldPos);

        gsap.to(hit.scale, { x: 1.65, y: 1.65, z: 1.65, duration: 0.45, ease: 'power2.in' });
        gsap.to(camera.position, {
          x: worldPos.x * 0.42,
          y: worldPos.y * 0.42,
          z: worldPos.z * 0.42,
          duration: 0.5,
          ease: 'power3.in',
          onComplete: () => {
            onClick(hit.userData.proj);
            setTimeout(() => {
              camera.position.set(0, 0, 0.01);
              hit.scale.set(1, 1, 1);
              isTransitioningRef.current = false;
            }, 450);
          }
        });
      }
    }
    function onResize() {
      const nW = window.innerWidth, nH = window.innerHeight;
      camera.aspect = nW / nH; camera.updateProjectionMatrix();
      renderer.setSize(nW, nH);
    }

    canvas.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    canvas.addEventListener('touchstart', onDown, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onUp);
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      canvas.removeEventListener('touchstart', onDown);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
      window.removeEventListener('resize', onResize);
      meshes.forEach(m => m.material.dispose());
      cardGeo.dispose(); pGeo.dispose(); pMat.dispose();
      expGeo.dispose(); expMat.dispose();
      ring1Geo.dispose(); ring1Mat.dispose();
      ring2Geo.dispose(); ring2Mat.dispose();
      wireGeo.dispose(); wireMat.dispose();
      renderer.dispose();
    };
  }, [genesisTrigger, onHover, onClick, soundEnabled, onCursorChange]);

  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, display: 'block' }} />;
}

// ─── HUD ───────────────────────────────────────────────────────────────────────
function HUD({
  hovered,
  activeCategory,
  onSelectCategory,
  soundEnabled,
  onToggleSound,
  filteredCount,
  onList,
  onInstitutional,
  onReplayIntro
}) {
  return (
    <div className="hud">
      <div className="hud-tl">
        <img src="/assets/brand/logo-sem-fundo.png" alt="CS Ag" className="hud-logo" />
        <div className="hud-brand">
          <span className="hud-name">Comunicação Social Ag</span>
          <span className="hud-sub">Agência Criativa Estratégica</span>
        </div>
      </div>

      <div className="hud-tr">
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          className={`btn-sound-toggle ${soundEnabled ? 'active' : ''}`}
          onClick={onToggleSound}
          title={soundEnabled ? 'Desativar áudio' : 'Ativar áudio'}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {soundEnabled ? (
              <>
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              </>
            ) : (
              <>
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <line x1="23" y1="9" x2="17" y2="15"></line>
                <line x1="17" y1="9" x2="23" y2="15"></line>
              </>
            )}
          </svg>
          <span>{soundEnabled ? 'Som ON' : 'Mudo'}</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          className="btn-replay-intro"
          onClick={onReplayIntro}
          title="Assistir Manifesto / Intro"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          <span>Intro</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          className="btn-ghost"
          onClick={onInstitutional}
          title="Conheça a Agência, Serviços e Hub Saúde"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          Sobre & Serviços
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          className="btn-ghost"
          onClick={onList}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M1 2.5h11M1 6.5h11M1 10.5h11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          Projetos
        </motion.button>

        <motion.a
          whileHover={{ scale: 1.04, y: -1 }}
          whileTap={{ scale: 0.95 }}
          href="https://cliente.comunicacaosocialag.com.br"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gold"
        >
          Área do Cliente
        </motion.a>
      </div>

      <div className="hud-bl">
        {/* Category Filters Bar with sliding golden pill */}
        <div className="hud-filter-bar">
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                whileTap={{ scale: 0.95 }}
                className={`filter-pill ${isActive ? 'active' : ''}`}
                onClick={() => {
                  playClickSound(soundEnabled);
                  onSelectCategory(cat.id);
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeFilterPill"
                    className="filter-pill-active-bg"
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="filter-pill-label">{cat.label}</span>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {hovered ? (
            <motion.div
              key={hovered.id}
              className="hud-info"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              style={{ marginTop: 12 }}
            >
              <span className="hud-cat">{hovered.category}</span>
              <h3 className="hud-title">{hovered.title}</h3>
              <p className="hud-desc">{hovered.description}</p>
              <span className="hud-hint">clique para ver o case completo →</span>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              className="hud-idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ marginTop: 12 }}
            >
              <span className="pulse-dot" />
              <span>arraste para explorar · clique para ver o case</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="hud-br">
        <span className="hud-count">{filteredCount} de {PROJECTS.length} cases</span>
      </div>
    </div>
  );
}

// ─── PROJECT PAGE (Case Study) ─────────────────────────────────────────────────
function ProjectPage({ project, allProjects, onClose, onNavigate }) {
  const currentIdx = allProjects.findIndex(p => p.id === project.id);
  const prevProj   = allProjects[currentIdx - 1] || null;
  const nextProj   = allProjects[currentIdx + 1] || null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [project.id]);

  return (
    <motion.div
      key={project.id}
      className="pp-root"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Top nav */}
      <nav className="pp-nav">
        <motion.button
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.95 }}
          className="pp-back"
          onClick={onClose}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          voltar à galeria
        </motion.button>
        <div className="pp-nav-center">
          <img src="/assets/brand/logo-sem-fundo.png" alt="CS Ag" style={{ width: 24, height: 24, objectFit: 'contain' }} />
          <span className="pp-nav-label">Comunicação Social Ag</span>
        </div>
        <div className="pp-nav-right">
          <span className="pp-num">{project.num} / {String(PROJECTS.length).padStart(2,'0')}</span>
        </div>
      </nav>

      {/* Hero */}
      <div className="pp-hero">
        <motion.div
          className="pp-hero-img-wrap"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <img src={project.image} alt={project.title} className="pp-hero-img" />
          <div className="pp-hero-overlay" style={{ '--accent': project.accent }} />
        </motion.div>
        <div className="pp-hero-content">
          <motion.span
            className="pp-hero-cat"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {project.category}
          </motion.span>
          <motion.h1
            className="pp-hero-title"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
          >
            {project.title}
          </motion.h1>
          <motion.div
            className="pp-hero-meta"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.24 }}
          >
            <span>{project.client}</span>
            <span className="pp-hero-sep">—</span>
            <span>{project.year}</span>
            <span className="pp-hero-sep">—</span>
            <span>{project.role}</span>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <motion.div
        className="pp-content"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Tags + Conceptual / Verified Case Badge */}
        <div className="pp-tags-row" style={{ alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {project.isConceptual ? (
            <span
              className="pp-tag"
              style={{
                background: 'rgba(247, 212, 6, 0.08)',
                border: '1px dashed rgba(247, 212, 6, 0.45)',
                color: 'var(--gold)',
                fontWeight: 700
              }}
            >
              Estudo Conceitual & Benchmark
            </span>
          ) : (
            <span
              className="pp-tag"
              style={{
                background: 'rgba(37, 211, 102, 0.12)',
                border: '1px solid rgba(37, 211, 102, 0.4)',
                color: '#25d366',
                fontWeight: 700
              }}
            >
              ✓ Case Real Homologado
            </span>
          )}
          {project.tags.map(t => (
            <span key={t} className="pp-tag" style={{ '--accent': project.accent }}>{t}</span>
          ))}
        </div>

        {/* Overview + Challenge */}
        <section className="pp-section pp-two-col">
          <div className="pp-col">
            <span className="pp-section-label">Desafio</span>
            <p className="pp-body-text">{project.challenge}</p>
          </div>
          <div className="pp-col">
            <span className="pp-section-label">Estratégia & Solução</span>
            <p className="pp-body-text">{project.strategy}</p>
          </div>
        </section>

        {/* Divider */}
        <div className="pp-divider" style={{ '--accent': project.accent }} />

        {/* Metrics with CDC Art. 37 Legal Disclosure */}
        <section className="pp-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
            <span className="pp-section-label" style={{ marginBottom: 0 }}>Resultados</span>
            <span style={{ fontSize: '11px', color: project.isConceptual ? '#888' : '#25d366', fontStyle: 'italic' }}>
              {project.isConceptual
                ? '* Indicadores projetados em ambiente de benchmark/estudo conceitual de mercado.'
                : '* Métricas aferidas em produção clínica e homologadas pelo cliente.'}
            </span>
          </div>
          <div className="pp-metrics">
            {project.results.map((r, i) => (
              <motion.div
                key={i}
                className="pp-metric"
                style={{ '--accent': project.accent }}
                whileHover={{ y: -3, borderColor: 'rgba(247,212,6,0.35)' }}
                transition={{ duration: 0.2 }}
              >
                <span className="pp-metric-value">{r.value}</span>
                <span className="pp-metric-label">{r.label}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Gallery / Full image */}
        <section className="pp-gallery-section">
          <div className="pp-gallery-img-wrap">
            <img src={project.image} alt={project.title} className="pp-gallery-img" />
          </div>
          <p className="pp-details-text">{project.details}</p>
        </section>

        {/* Navigation entre projetos */}
        <div className="pp-project-nav">
          {prevProj ? (
            <motion.button
              whileHover={{ x: -4 }}
              whileTap={{ scale: 0.97 }}
              className="pp-nav-proj pp-nav-prev"
              onClick={() => onNavigate(prevProj)}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div>
                <span className="pp-nav-proj-label">Projeto anterior</span>
                <span className="pp-nav-proj-title">{prevProj.title}</span>
              </div>
            </motion.button>
          ) : <div />}

          {nextProj ? (
            <motion.button
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.97 }}
              className="pp-nav-proj pp-nav-next"
              onClick={() => onNavigate(nextProj)}
            >
              <div style={{ textAlign: 'right' }}>
                <span className="pp-nav-proj-label">Próximo projeto</span>
                <span className="pp-nav-proj-title">{nextProj.title}</span>
              </div>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.button>
          ) : <div />}
        </div>

        {/* CTA final + WhatsApp Direct & Share */}
        <div className="pp-cta-section">
          <p className="pp-cta-text">Quer um projeto assim para a sua marca?</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', marginTop: 14 }}>
            <motion.a
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              href="https://cliente.comunicacaosocialag.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="pp-cta-btn"
              style={{ '--accent': project.accent }}
            >
              Fale com a gente
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Veja esse case da Comunicação Social Ag: "${project.title}" - ${typeof window !== 'undefined' ? window.location.origin : ''}/?case=${project.id}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-case-share"
              title="Compartilhar case no WhatsApp"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              Compartilhar no WhatsApp
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              href={`https://wa.me/5535999999999?text=${encodeURIComponent(`Olá! Vi o case "${project.title}" no portfólio da CS Ag e gostaria de uma solução similar.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-case-share"
              style={{ background: 'rgba(247,212,6,0.12)', borderColor: 'rgba(247,212,6,0.35)', color: 'var(--gold)' }}
              title="Solicitar proposta similar no WhatsApp"
            >
              Solicitar Proposta para este Formato →
            </motion.a>
          </div>
        </div>

        <footer className="pp-footer">
          <span>© {new Date().getFullYear()} Comunicação Social Ag — Todos os direitos reservados</span>
          <span>Poços de Caldas, MG</span>
        </footer>
      </motion.div>
    </motion.div>
  );
}

// ─── LIST SIDEBAR ──────────────────────────────────────────────────────────────
function ListSidebar({
  activeCategory,
  onSelectCategory,
  soundEnabled,
  onClose,
  onSelect
}) {
  const filteredProjects = PROJECTS.filter(p => projectMatchesCategory(p, activeCategory));

  return (
    <div className="sidebar-root">
      <motion.div
        className="sidebar-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.28 }}
        onClick={onClose}
      />
      <motion.aside
        className="sidebar"
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 280 }}
      >
        <header className="sidebar-head">
          <div>
            <p className="sidebar-title">Todos os projetos</p>
            <p className="sidebar-count">{filteredProjects.length} de {PROJECTS.length} cases</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="btn-icon"
            onClick={onClose}
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M2 2l11 11M13 2L2 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </motion.button>
        </header>

        {/* Categories Chips */}
        <div className="sidebar-filter-row">
          {CATEGORIES.map(cat => {
            const count = cat.id === 'all'
              ? PROJECTS.length
              : PROJECTS.filter(p => projectMatchesCategory(p, cat.id)).length;
            const isActive = activeCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                className={`sidebar-chip ${isActive ? 'active' : ''}`}
                onClick={() => {
                  playClickSound(soundEnabled);
                  onSelectCategory(cat.id);
                }}
              >
                {cat.label} ({count})
              </motion.button>
            );
          })}
        </div>

        <motion.ul
          className="sidebar-list"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.035, delayChildren: 0.06 }
            }
          }}
          initial="hidden"
          animate="show"
        >
          {filteredProjects.map(p => (
            <motion.li
              key={p.id}
              variants={{
                hidden: { opacity: 0, x: -14 },
                show: { opacity: 1, x: 0, transition: { duration: 0.26, ease: "easeOut" } }
              }}
              className="sidebar-item"
              whileHover={{ x: 6, backgroundColor: 'rgba(255,255,255,0.04)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                playClickSound(soundEnabled);
                onSelect(p);
              }}
            >
              <span className="si-num">{p.num}</span>
              <div className="si-left">
                <span className="si-title">{p.title}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                  <span className="si-cat">{p.category}</span>
                  <span className="pill-mono">{p.year}</span>
                  {p.tags && p.tags.slice(0, 2).map(t => (
                    <span key={t} className="pill-mono">#{t}</span>
                  ))}
                </div>
              </div>
              <div className="si-right">
                <span className="si-client">{p.client}</span>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </motion.aside>
    </div>
  );
}

// ─── INSTITUTIONAL MODAL (SOBRE, SERVIÇOS & HUB SAÚDE CFM/CFO) ────────────────
function InstitutionalModal({ isOpen, onClose, soundEnabled, onSelectCase }) {
  const [tab, setTab] = useState('agencia');

  if (!isOpen) return null;

  return (
    <div className="institutional-backdrop" onClick={onClose}>
      <div className="institutional-modal" onClick={e => e.stopPropagation()}>
        <motion.div
          className="institutional-panel"
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Header */}
          <div className="institutional-header">
            <div className="institutional-brand">
              <img src="/assets/brand/logo-sem-fundo.png" alt="CS Ag" className="institutional-brand-logo" />
              <div>
                <h3 className="institutional-brand-title">Comunicação Social Ag</h3>
                <span style={{ fontSize: '11px', color: '#8e8e9c', fontFamily: 'var(--fb)' }}>Estratégia · Criatividade · Tecnologia</span>
              </div>
            </div>

            <div className="institutional-nav-tabs">
              <button
                className={`institutional-tab-btn ${tab === 'agencia' ? 'active' : ''}`}
                onClick={() => {
                  playClickSound(soundEnabled);
                  setTab('agencia');
                }}
              >
                A Agência
              </button>
              <button
                className={`institutional-tab-btn ${tab === 'servicos' ? 'active' : ''}`}
                onClick={() => {
                  playClickSound(soundEnabled);
                  setTab('servicos');
                }}
              >
                Serviços
              </button>
              <button
                className={`institutional-tab-btn ${tab === 'saude' ? 'active' : ''}`}
                onClick={() => {
                  playClickSound(soundEnabled);
                  setTab('saude');
                }}
              >
                Hub Saúde CFM/CFO
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="btn-icon"
              onClick={onClose}
              title="Fechar"
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M2 2l11 11M13 2L2 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </motion.button>
          </div>

          {/* Body Content */}
          <div className="institutional-body">
            {tab === 'agencia' && (
              <motion.div
                key="agencia"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
              >
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--fh)' }}>
                    Manifesto & Posicionamento
                  </span>
                  <h2 style={{ fontFamily: 'var(--fh)', fontSize: '26px', color: '#fff', marginTop: 6, marginBottom: 14 }}>
                    A estratégia antes da estética.
                  </h2>
                  <p style={{ color: '#b0b0c0', fontSize: '14px', lineHeight: 1.7, maxWidth: '780px' }}>
                    Nascemos em Poços de Caldas (MG) com vocação global. Não acreditamos em comunicação vazia ou peças publicitárias sem retorno mensurável. Construímos um ecossistema onde inteligência de negócios, design editorial de alto padrão e tecnologia de ponta convivem para acelerar marcas de valor real.
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginTop: 8 }}>
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 18 }}>
                    <span style={{ fontFamily: 'var(--fh)', fontSize: '24px', fontWeight: 800, color: 'var(--gold)' }}>80+</span>
                    <p style={{ fontSize: '12px', color: '#8e8e9c', marginTop: 4 }}>Clientes e marcas transformadas</p>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 18 }}>
                    <span style={{ fontFamily: 'var(--fh)', fontSize: '24px', fontWeight: 800, color: 'var(--gold)' }}>5 Anos</span>
                    <p style={{ fontSize: '12px', color: '#8e8e9c', marginTop: 4 }}>De mercado e inovação contínua</p>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 18 }}>
                    <span style={{ fontFamily: 'var(--fh)', fontSize: '24px', fontWeight: 800, color: 'var(--gold)' }}>+400%</span>
                    <p style={{ fontSize: '12px', color: '#8e8e9c', marginTop: 4 }}>De crescimento consistente</p>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 18 }}>
                    <span style={{ fontFamily: 'var(--fh)', fontSize: '24px', fontWeight: 800, color: 'var(--gold)' }}>100%</span>
                    <p style={{ fontSize: '12px', color: '#8e8e9c', marginTop: 4 }}>Sob medida — zero templates genéricos</p>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 20 }}>
                  <h4 style={{ fontFamily: 'var(--fh)', fontSize: '14px', color: '#fff', marginBottom: 8 }}>
                    Poços de Caldas para o Brasil
                  </h4>
                  <p style={{ color: '#8e8e9c', fontSize: '13px', lineHeight: 1.6 }}>
                    Sediados em Poços de Caldas, Minas Gerais, atendemos empresas, clínicas e corporações em todo o território nacional e internacional, desenvolvendo desde identidades de marca memoráveis até plataformas corporativas complexas.
                  </p>
                </div>
              </motion.div>
            )}

            {tab === 'servicos' && (
              <motion.div
                key="servicos"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="service-card-grid"
              >
                <div className="service-card">
                  <span className="service-card-badge">Pilar 01</span>
                  <h4 className="service-card-title">Branding & Identidade</h4>
                  <p className="service-card-desc">
                    Arquitetura e reposicionamento de marca, design tokens, tipografia proprietária, diretrizes editoriais e papelaria de alto padrão.
                  </p>
                </div>

                <div className="service-card">
                  <span className="service-card-badge">Pilar 02</span>
                  <h4 className="service-card-title">Experiências Web & 3D</h4>
                  <p className="service-card-desc">
                    Interfaces cinematográficas com Three.js, shaders customizados, micro-interações táteis e narrativas imersivas via scrollytelling.
                  </p>
                </div>

                <div className="service-card">
                  <span className="service-card-badge">Pilar 03</span>
                  <h4 className="service-card-title">Sistemas & SaaS</h4>
                  <p className="service-card-desc">
                    Desenvolvimento de software sob medida, plataformas all-in-one para agências, ERPs clínicos e integrações de dados em tempo real.
                  </p>
                </div>

                <div className="service-card">
                  <span className="service-card-badge">Pilar 04</span>
                  <h4 className="service-card-title">Performance & Tráfego</h4>
                  <p className="service-card-desc">
                    Mídia programática, gestão de tráfego de alta conversão, inteligência de dados (BI), dashboards em tempo real e redução de CAC.
                  </p>
                </div>
              </motion.div>
            )}

            {tab === 'saude' && (
              <motion.div
                key="saude"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
              >
                <div className="health-compliance-callout">
                  <div className="health-callout-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                  </div>
                  <div className="health-callout-text">
                    <h4>Publicidade em Saúde em Conformidade Ética CFM & CFO</h4>
                    <p>
                      Atuamos em estrita consonância com a Resolução CFM nº 2.336/2023 e o Código de Ética Odontológica (Resolução CFO nº 196/2019). Desenvolvemos comunicação médica de autoridade com caráter educativo, humanizado e livre de sensacionalismo ou autopromoção antiética.
                    </p>
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 24 }}>
                  <span style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--fh)' }}>
                    Cases em Destaque no Hub Saúde
                  </span>
                  <h3 style={{ fontFamily: 'var(--fh)', fontSize: '20px', color: '#fff', margin: '8px 0 10px 0' }}>
                    Dra. Lívia Esper — Experiência Web & ERP Clínico
                  </h3>
                  <p style={{ color: '#a0a0b0', fontSize: '13px', lineHeight: 1.6, marginBottom: 18 }}>
                    Desenvolvemos uma experiência digital afetuosa com animação 3D e pré-cadastro inteligente que eliminou o medo infantil de dentista e reduziu faltas em 50%, aliada a um software clínico proprietário com prontuário interativo.
                  </p>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <button
                      onClick={() => {
                        onClose();
                        onSelectCase('livia-esper-site');
                      }}
                      className="btn-gold"
                      style={{ fontSize: '11px', padding: '8px 16px' }}
                    >
                      Ver Case: Experiência Web →
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        onSelectCase('livia-esper-sistema');
                      }}
                      className="btn-ghost"
                      style={{ fontSize: '11px', padding: '8px 16px' }}
                    >
                      Ver Case: Sistema Clínico →
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="institutional-footer">
            <span style={{ fontSize: '12px', color: '#8e8e9c' }}>
              Pronto para elevar o posicionamento da sua empresa?
            </span>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <a
                href="https://wa.me/5535999999999?text=Ol%C3%A1!%20Gostaria%20de%20solicitar%20uma%20proposta%20comercial%20para%20a%20Comunica%C3%A7%C3%A3o%20Social%20Ag."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-case-share"
                onClick={() => playClickSound(soundEnabled)}
              >
                Solicitar Proposta no WhatsApp
              </a>
              <a
                href="https://cliente.comunicacaosocialag.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold"
                style={{ fontSize: '11px', padding: '9px 18px' }}
              >
                Área do Cliente
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ─── FLOATING WHATSAPP BUTTON COMPONENT ───────────────────────────────────────
function WhatsAppFloatButton({ soundEnabled }) {
  const defaultMsg = encodeURIComponent("Olá! Conheci o site da Comunicação Social Ag e gostaria de conversar com um estrategista.");
  return (
    <a
      href={`https://wa.me/5535999999999?text=${defaultMsg}`}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float-btn"
      title="Falar no WhatsApp com a Comunicação Social Ag"
      onClick={() => playClickSound(soundEnabled)}
    >
      <div className="whatsapp-icon-wrap">
        <div className="whatsapp-pulse-ring" />
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
      </div>
      <div className="whatsapp-text-wrap">
        <span className="whatsapp-status-label">Online Agora</span>
        <span className="whatsapp-main-label">Falar com Estrategista</span>
      </div>
    </a>
  );
}

// ─── ERROR BOUNDARY (WEBGL & RUNTIME RESILIENCE) ──────────────────────────────
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#070708',
          color: '#fff',
          padding: 32,
          textAlign: 'center',
          fontFamily: 'var(--fb)'
        }}>
          <img src="/assets/brand/logo-sem-fundo.png" alt="CS Ag" style={{ width: 48, marginBottom: 20 }} />
          <h2 style={{ fontFamily: 'var(--fh)', color: 'var(--gold)', marginBottom: 12, fontSize: '22px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Experiência 3D Indisponível
          </h2>
          <p style={{ color: '#aaa', maxWidth: 480, marginBottom: 28, fontSize: '14px', lineHeight: 1.6 }}>
            O seu navegador ou dispositivo encontrou uma limitação gráfica. Você pode recarregar a página ou navegar pelos nossos canais institucionais diretos.
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: 'var(--gold)',
                color: '#000',
                border: 'none',
                padding: '12px 24px',
                borderRadius: 8,
                fontWeight: 700,
                fontFamily: 'var(--fh)',
                cursor: 'pointer'
              }}
            >
              Recarregar Experiência
            </button>
            <a
              href="https://cliente.comunicacaosocialag.com.br"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#fff',
                padding: '12px 24px',
                borderRadius: 8,
                fontWeight: 600,
                textDecoration: 'none',
                fontFamily: 'var(--fh)'
              }}
            >
              Área do Cliente
            </a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [stage,          setStage]          = useState(prefersReducedMotion ? 'gallery' : 'matchcut'); // 'matchcut' | 'intro' | 'gallery'
  const [genesisCount,   setGenesisCount]   = useState(0);

  useEffect(() => {
    window.__stage = stage;
    window.__setStage = setStage;
  }, [stage]);

  const [activeProj,        setActiveProj]        = useState(null);
  const [hovered,           setHovered]           = useState(null);
  const [showList,          setShowList]          = useState(false);
  const [showInstitutional, setShowInstitutional] = useState(false);
  const [activeCategory,    setActiveCategory]    = useState('all');
  const [soundEnabled,      setSoundEnabled]      = useState(true);
  const [cursorState,       setCursorState]       = useState({ text: '', isHovered: false, isDragging: false });
  const overlayRef = useRef(null);
  const flashRef   = useRef(null);

  // Sync URL query params with active project for deep linking
  const updateUrlForProject = useCallback((proj) => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location);
    if (proj) {
      url.searchParams.set('case', proj.id);
    } else {
      url.searchParams.delete('case');
    }
    window.history.pushState({}, '', url);
  }, []);

  // Check URL on initial mount and support browser popstate (back/forward)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const caseId = params.get('case');
    if (caseId) {
      const found = PROJECTS.find(p => p.id === caseId);
      if (found) {
        setActiveProj(found);
        setStage('gallery');
      }
    }

    const handlePopState = () => {
      const p = new URLSearchParams(window.location.search);
      const cId = p.get('case');
      if (cId) {
        const match = PROJECTS.find(item => item.id === cId);
        if (match) setActiveProj(match);
      } else {
        setActiveProj(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Keyboard navigation & accessibility (Escape, ArrowLeft, ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (showInstitutional) {
          playClickSound(soundEnabled);
          setShowInstitutional(false);
        } else if (showList) {
          playClickSound(soundEnabled);
          setShowList(false);
        } else if (activeProj) {
          playClickSound(soundEnabled);
          updateUrlForProject(null);
          setActiveProj(null);
        }
      } else if (activeProj && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        const cIdx = PROJECTS.findIndex(p => p.id === activeProj.id);
        if (e.key === 'ArrowLeft' && cIdx > 0) {
          const prev = PROJECTS[cIdx - 1];
          playClickSound(soundEnabled);
          updateUrlForProject(prev);
          setActiveProj(prev);
        } else if (e.key === 'ArrowRight' && cIdx < PROJECTS.length - 1) {
          const next = PROJECTS[cIdx + 1];
          playClickSound(soundEnabled);
          updateUrlForProject(next);
          setActiveProj(next);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showInstitutional, showList, activeProj, soundEnabled, updateUrlForProject]);

  const handleCursorChange = useCallback((newState) => {
    setCursorState(prev => ({ ...prev, ...newState }));
  }, []);

  const handleToggleSound = useCallback(() => {
    setSoundEnabled(prev => {
      const next = !prev;
      if (next) playClickSound(true);
      return next;
    });
  }, []);

  const handleMatchCutComplete = useCallback(() => {
    playBigBangAudio(soundEnabled);
    const flash = flashRef.current;
    if (flash) {
      gsap.killTweensOf(flash);
      gsap.fromTo(flash,
        { opacity: 1 },
        {
          opacity: 0,
          duration: 1.4,
          ease: 'power2.out',
          onStart: () => {
            setStage('gallery');
            setGenesisCount(c => c + 1);
          }
        }
      );
    } else {
      setStage('gallery');
      setGenesisCount(c => c + 1);
    }
  }, [soundEnabled]);

  const handlePreloaderComplete = useCallback(() => {
    setStage('intro');
  }, []);

  const handleIntroComplete = useCallback(() => {
    playBigBangAudio(soundEnabled);
    const flash = flashRef.current;
    if (flash) {
      gsap.killTweensOf(flash);
      gsap.fromTo(flash,
        { opacity: 1 },
        {
          opacity: 0,
          duration: 1.5,
          ease: 'power2.out',
          onStart: () => {
            setStage('gallery');
            setGenesisCount(c => c + 1);
          }
        }
      );
    } else {
      setStage('gallery');
      setGenesisCount(c => c + 1);
    }
  }, [soundEnabled]);

  const handleReplayIntro = useCallback(() => {
    playClickSound(soundEnabled);
    setStage('matchcut');
  }, [soundEnabled]);

  const handleHover = useCallback(proj => setHovered(proj), []);

  // Click on sphere card → flash black → open project page + sync URL
  const handleClick = useCallback((proj) => {
    playClickSound(soundEnabled);
    const overlay = overlayRef.current;
    gsap.to(overlay, {
      opacity: 1, duration: 0.35, ease: 'power2.in',
      onComplete: () => {
        updateUrlForProject(proj);
        setActiveProj(proj);
        gsap.to(overlay, { opacity: 0, duration: 0.4, ease: 'power2.out', delay: 0.1 });
      },
    });
  }, [soundEnabled, updateUrlForProject]);

  // Close project page → smooth Motion exit back to sphere + clear URL
  const handleClose = useCallback(() => {
    playClickSound(soundEnabled);
    updateUrlForProject(null);
    setActiveProj(null);
  }, [soundEnabled, updateUrlForProject]);

  // Navigate between project pages + sync URL
  const handleNavigate = useCallback((proj) => {
    playClickSound(soundEnabled);
    updateUrlForProject(proj);
    setActiveProj(proj);
  }, [soundEnabled, updateUrlForProject]);

  const filteredCount = activeCategory === 'all'
    ? PROJECTS.length
    : PROJECTS.filter(p => projectMatchesCategory(p, activeCategory)).length;

  return (
    <ErrorBoundary>
      <div className="root">
        {/* Custom Liquid Magnetic Cursor */}
        <MagneticCursor
          text={cursorState.text}
          isHovered={cursorState.isHovered}
          isDragging={cursorState.isDragging}
        />

        {/* Big Bang Flash Overlay */}
        <div ref={flashRef} className="bigbang-flash" />

        {/* Black flash overlay for transitions */}
        <div ref={overlayRef} className="transition-overlay" />

        {/* Floating WhatsApp CTA Button */}
        <WhatsAppFloatButton soundEnabled={soundEnabled} />

        {/* Match-Cut Rhythmic Kinetic Intro (Phantom.land Level) */}
        {stage === 'matchcut' && (
          <MatchCutIntro
            onComplete={handleMatchCutComplete}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
          />
        )}

        {/* Kinetic Preloader Experience (Fallback) */}
        {stage === 'preloader' && (
          <KineticPreloader
            onComplete={handlePreloaderComplete}
            soundEnabled={soundEnabled}
            playTransitionSound={playTransitionSound}
          />
        )}

        {/* Intro Video Experience */}
        {stage === 'intro' && (
          <IntroVideo onComplete={handleIntroComplete} />
        )}

        {/* Sphere + HUD (visible when gallery is active) */}
        <div style={{
          visibility: stage === 'gallery' && !activeProj ? 'visible' : 'hidden',
          pointerEvents: stage === 'gallery' && !activeProj ? 'auto' : 'none'
        }}>
          {stage === 'gallery' && (
            <SphereGallery
              genesisTrigger={genesisCount}
              activeCategory={activeCategory}
              soundEnabled={soundEnabled}
              onHover={handleHover}
              onClick={handleClick}
              onCursorChange={handleCursorChange}
            />
          )}
          <HUD
            hovered={hovered}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
            filteredCount={filteredCount}
            onList={() => {
              playClickSound(soundEnabled);
              setShowList(true);
            }}
            onInstitutional={() => {
              playClickSound(soundEnabled);
              setShowInstitutional(true);
            }}
            onReplayIntro={handleReplayIntro}
          />
        </div>

        {/* Project page (Case Study) with AnimatePresence */}
        <AnimatePresence mode="wait">
          {activeProj && (
            <ProjectPage
              key={activeProj.id}
              project={activeProj}
              allProjects={PROJECTS}
              onClose={handleClose}
              onNavigate={handleNavigate}
            />
          )}
        </AnimatePresence>

        {/* Sidebar Drawer with AnimatePresence */}
        <AnimatePresence>
          {showList && (
            <ListSidebar
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              soundEnabled={soundEnabled}
              onClose={() => {
                playClickSound(soundEnabled);
                setShowList(false);
              }}
              onSelect={(p) => {
                setShowList(false);
                handleClick(p);
              }}
            />
          )}
        </AnimatePresence>

        {/* Institutional Drawer (Sobre, Serviços & Hub Saúde) with AnimatePresence */}
        <AnimatePresence>
          {showInstitutional && (
            <InstitutionalModal
              isOpen={showInstitutional}
              onClose={() => {
                playClickSound(soundEnabled);
                setShowInstitutional(false);
              }}
              soundEnabled={soundEnabled}
              onSelectCase={(caseId) => {
                const found = PROJECTS.find(p => p.id === caseId);
                if (found) {
                  handleClick(found);
                }
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
}
