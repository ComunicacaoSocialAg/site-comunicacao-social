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

    // 1. Sub-bass boom (115Hz -> 24Hz)
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(115, now);
    osc.frequency.exponentialRampToValueAtTime(24, now + 1.8);

    oscGain.gain.setValueAtTime(0.001, now);
    oscGain.gain.linearRampToValueAtTime(0.85, now + 0.04);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 2.3);

    // 2. Noise burst
    const bufferSize = ctx.sampleRate * 1.5;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;
    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3200, now);
    filter.frequency.exponentialRampToValueAtTime(70, now + 1.4);
    filter.Q.setValueAtTime(4.0, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.001, now);
    noiseGain.gain.linearRampToValueAtTime(0.65, now + 0.03);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    whiteNoise.start(now);
    whiteNoise.stop(now + 1.6);

    // 3. Cosmic sparkles
    [1580, 2370, 3160].forEach((freq, idx) => {
      const sparkleOsc = ctx.createOscillator();
      const sparkleGain = ctx.createGain();
      sparkleOsc.type = 'sine';
      sparkleOsc.frequency.setValueAtTime(freq, now);
      sparkleOsc.frequency.exponentialRampToValueAtTime(freq * 1.35, now + 1.2);

      sparkleGain.gain.setValueAtTime(0.001, now);
      sparkleGain.gain.linearRampToValueAtTime(0.12 / (idx + 1), now + 0.08);
      sparkleGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      sparkleOsc.connect(sparkleGain);
      sparkleGain.connect(ctx.destination);
      sparkleOsc.start(now);
      sparkleOsc.stop(now + 1.9);
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

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // Helper: Soft Radial Glow Texture for High-End Cosmic Particles
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 64;
    pCanvas.height = 64;
    const pCtx = pCanvas.getContext('2d');
    const pGrad = pCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
    pGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    pGrad.addColorStop(0.22, 'rgba(247, 212, 6, 0.95)');
    pGrad.addColorStop(0.6, 'rgba(247, 212, 6, 0.22)');
    pGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    pCtx.fillStyle = pGrad;
    pCtx.fillRect(0, 0, 64, 64);
    const particleGlowTex = new THREE.CanvasTexture(pCanvas);

    // Ambient Starfield Particles
    const pCount = 1500;
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i++) pPos[i] = (Math.random() - 0.5) * 120;
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.08,
      map: particleGlowTex,
      color: 0xf7d406,
      transparent: true,
      opacity: 0.32,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const ambientParticles = new THREE.Points(pGeo, pMat);
    scene.add(ambientParticles);

    // Big Bang Explosion Cosmic Embers
    const expCount = 650;
    const expPos = new Float32Array(expCount * 3);
    const expVel = new Float32Array(expCount * 3);
    for (let i = 0; i < expCount; i++) {
      expPos[i * 3]     = 0;
      expPos[i * 3 + 1] = 0;
      expPos[i * 3 + 2] = 0;

      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const speed = Math.random() * 24 + 12;
      const sinPhi = Math.sin(phi);

      expVel[i * 3]     = Math.cos(theta) * sinPhi * speed * 0.055;
      expVel[i * 3 + 1] = Math.sin(theta) * sinPhi * speed * 0.055;
      expVel[i * 3 + 2] = Math.cos(phi) * speed * 0.055;
    }
    const expGeo = new THREE.BufferGeometry();
    expGeo.setAttribute('position', new THREE.BufferAttribute(expPos, 3));
    const expMat = new THREE.PointsMaterial({
      size: 0.32,
      map: particleGlowTex,
      color: 0xffffff,
      transparent: true,
      opacity: 0.98,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const expParticles = new THREE.Points(expGeo, expMat);
    scene.add(expParticles);

    // Expanding Shockwave Rings
    const ring1Geo = new THREE.RingGeometry(0.2, 0.9, 64);
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

    gsap.fromTo(ring1.scale, { x: 0.01, y: 0.01, z: 0.01 }, { x: 48, y: 48, z: 48, duration: 1.8, ease: 'power2.out' });
    gsap.fromTo(ring1Mat, { opacity: 0.95 }, { opacity: 0, duration: 1.8, ease: 'power2.out' });

    const ring2Geo = new THREE.RingGeometry(0.2, 0.6, 64);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 3.5;
    scene.add(ring2);

    gsap.fromTo(ring2.scale, { x: 0.01, y: 0.01, z: 0.01 }, { x: 36, y: 36, z: 36, duration: 1.5, delay: 0.06, ease: 'power2.out' });
    gsap.fromTo(ring2Mat, { opacity: 0.85 }, { opacity: 0, duration: 1.5, delay: 0.06, ease: 'power2.out' });

    // Camera FOV recoil & Camera Shake
    gsap.to(camera, {
      fov: 65,
      duration: 2.2,
      ease: 'power3.out',
      onUpdate: () => camera.updateProjectionMatrix()
    });

    const shake = { val: 0.25 };
    gsap.to(shake, {
      val: 0,
      duration: 1.2,
      ease: 'power2.out',
      onUpdate: () => {
        if (shake.val > 0.001) {
          camera.position.x = (Math.random() - 0.5) * shake.val;
          camera.position.y = (Math.random() - 0.5) * shake.val;
        } else if (!isTransitioningRef.current) {
          camera.position.set(0, 0, 0.01);
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

      // Decelerate and move explosion particles
      const pArr = expGeo.attributes.position.array;
      for (let j = 0; j < expCount; j++) {
        const idx3 = j * 3;
        pArr[idx3]     += expVel[idx3];
        pArr[idx3 + 1] += expVel[idx3 + 1];
        pArr[idx3 + 2] += expVel[idx3 + 2];
        expVel[idx3]     *= 0.94;
        expVel[idx3 + 1] *= 0.94;
        expVel[idx3 + 2] *= 0.94;
      }
      expGeo.attributes.position.needsUpdate = true;
      if (expMat.opacity > 0.01) {
        expMat.opacity *= 0.985;
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
        {/* Tags */}
        <div className="pp-tags-row">
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

        {/* Metrics */}
        <section className="pp-section">
          <span className="pp-section-label">Resultados</span>
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

        {/* CTA final */}
        <div className="pp-cta-section">
          <p className="pp-cta-text">Quer um projeto assim para a sua marca?</p>
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

// ─── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [stage,          setStage]          = useState('matchcut'); // 'matchcut' | 'intro' | 'gallery'
  const [genesisCount,   setGenesisCount]   = useState(0);

  useEffect(() => {
    window.__stage = stage;
    window.__setStage = setStage;
  }, [stage]);
  const [activeProj,     setActiveProj]     = useState(null);
  const [hovered,        setHovered]        = useState(null);
  const [showList,       setShowList]       = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [soundEnabled,   setSoundEnabled]   = useState(true);
  const [cursorState,    setCursorState]    = useState({ text: '', isHovered: false, isDragging: false });
  const overlayRef = useRef(null);
  const flashRef   = useRef(null);

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

  // Click on sphere card → flash black → open project page
  const handleClick = useCallback((proj) => {
    playClickSound(soundEnabled);
    const overlay = overlayRef.current;
    gsap.to(overlay, {
      opacity: 1, duration: 0.35, ease: 'power2.in',
      onComplete: () => {
        setActiveProj(proj);
        gsap.to(overlay, { opacity: 0, duration: 0.4, ease: 'power2.out', delay: 0.1 });
      },
    });
  }, [soundEnabled]);

  // Close project page → smooth Motion exit back to sphere
  const handleClose = useCallback(() => {
    playClickSound(soundEnabled);
    setActiveProj(null);
  }, [soundEnabled]);

  // Navigate between project pages
  const handleNavigate = useCallback((proj) => {
    playClickSound(soundEnabled);
    setActiveProj(proj);
  }, [soundEnabled]);

  const filteredCount = activeCategory === 'all'
    ? PROJECTS.length
    : PROJECTS.filter(p => projectMatchesCategory(p, activeCategory)).length;

  return (
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
    </div>
  );
}
