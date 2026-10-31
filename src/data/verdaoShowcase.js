const base = '/assets/cases/verdao/';
const screen = (name) => `${base}screens/${name}`;
const carousel = (name) => `${base}carousel/${name}`;
const social = (name) => `${base}social/${name}`;

export const VERDAO_SHOWCASE = {
  brand: {
    logoWhite: `${base}verdao-logo-white.svg`,
    symbol: `${base}verdao-simbolo.svg`,
    leChampMark: `${base}marca-le-champ.svg`,
    city: 'Poços de Caldas, MG',
    portalUrl: 'https://imobiliariaverdao.com.br',
    leChampUrl: 'https://le-champ-verdao.vercel.app',
  },
  hero: {
    video: `${base}reel-verdao.mp4`,
    poster: `${base}reel-verdao-poster.webp`,
    cover: `${base}cover-verdao.webp`,
    ariaLabel: 'Reel institucional e de imóveis da Imobiliária Verdão em Poços de Caldas',
  },
  pillars: [
    {
      title: 'Gestão Digital',
      detail: 'Direção editorial contínua, campanhas de imóveis e presença ativa nos canais digitais.',
    },
    {
      title: 'Landing Pages',
      detail: 'Páginas exclusivas de lançamento arquitetônico, como a experiência completa do Le Champ Village.',
    },
    {
      title: 'Plataforma SaaS',
      detail: 'Sistema imobiliário por trás do portal oficial para busca, curadoria de carteira e captação de interessados.',
    },
    {
      title: 'Cinema Imobiliário',
      detail: 'Filmes de empreendimentos e reels de imóveis à venda dirigidos para retenção e decisão.',
    },
  ],
  leChamp: {
    hero: {
      src: screen('le-champ-hero.webp'),
      alt: 'Abertura da landing page do Le Champ Village com vista aérea das 20 casas na Avenida Champagnat em Poços de Caldas.',
    },
    casa: {
      src: screen('le-champ-casa.webp'),
      alt: 'Seção arquitetônica da landing page Le Champ Village apresentando a residência de aproximadamente 200 metros quadrados.',
    },
    lazer: {
      src: screen('le-champ-lazer.webp'),
      alt: 'Seção de lazer e convivência da landing page Le Champ Village.',
    },
    plantas: {
      src: screen('le-champ-plantas.webp'),
      alt: 'Visualização interativa das plantas da residência no site Le Champ Village.',
    },
    mobile: {
      src: screen('le-champ-mobile.webp'),
      alt: 'Versão mobile da landing page Le Champ Village.',
    },
  },
  saas: {
    home: {
      src: screen('saas-portal-home.webp'),
      alt: 'Portal oficial imobiliariaverdao.com.br com sistema de busca por finalidade, tipologia, cidade e bairro.',
    },
    catalog: {
      src: screen('saas-catalogo-imoveis.webp'),
      alt: 'Catálogo estruturado de casas à venda no portal oficial da Imobiliária Verdão em Poços de Caldas.',
    },
    detail: {
      src: screen('saas-ficha-imovel.webp'),
      alt: 'Página interna de imóvel no sistema da Imobiliária Verdão com galeria, especificações e canal direto de atendimento.',
    },
    mobile: {
      src: screen('saas-mobile.webp'),
      alt: 'Navegação mobile do catálogo de imóveis no sistema oficial da Imobiliária Verdão.',
    },
  },
  film: {
    video: `${base}le-champ-film.mp4`,
    poster: `${base}le-champ-film-poster.webp`,
    ariaLabel: 'Filme de apresentação do empreendimento Le Champ Village comercializado pela Imobiliária Verdão',
  },
  carousel: [
    {
      src: carousel('le-champ-01.webp'),
      alt: 'Lâmina de abertura do carrossel Le Champ Village: Mais espaço para a sua vida.',
    },
    {
      src: carousel('le-champ-02.webp'),
      alt: 'Segunda lâmina Le Champ Village: 200 metros quadrados, 20 casas e 2 vagas cobertas.',
    },
    {
      src: carousel('le-champ-03.webp'),
      alt: 'Terceira lâmina Le Champ Village: O lado de fora, do seu jeito.',
    },
    {
      src: carousel('le-champ-04.webp'),
      alt: 'Quarta lâmina Le Champ Village: 4 dormitórios, um lugar para cada um.',
    },
    {
      src: carousel('le-champ-05.webp'),
      alt: 'Quinta lâmina Le Champ Village: A pausa faz parte do seu endereço.',
    },
    {
      src: carousel('le-champ-06.webp'),
      alt: 'Sexta lâmina Le Champ Village: Avenida Champagnat em Poços de Caldas.',
    },
    {
      src: carousel('le-champ-07.webp'),
      alt: 'Sétima lâmina Le Champ Village: Convite para conhecer a planta com a Imobiliária Verdão.',
    },
  ],
  social: [
    {
      className: 'tijolo',
      src: social('dia-trabalhador.webp'),
      alt: 'Peça conceitual da Imobiliária Verdão: Ao primeiro tijolo. A primeira peça, o primeiro movimento, o esforço inicial.',
    },
    {
      className: 'meioambiente',
      src: social('meio-ambiente.webp'),
      alt: 'Peça institucional da Imobiliária Verdão: Somos verdes desde 1976. Símbolo V esculpido em musgo para o Dia Mundial do Meio Ambiente.',
    },
    {
      className: 'decisao',
      src: social('decisao-endereco.webp'),
      alt: 'Peça institucional da Imobiliária Verdão: Decisão que muda mais do que seu endereço.',
    },
    {
      className: 'boutique',
      src: social('predios-boutique.webp'),
      alt: 'Conteúdo editorial da Imobiliária Verdão sobre prédios boutique no mercado de alto padrão.',
    },
    {
      className: 'natal',
      src: social('natal-verdao.webp'),
      alt: 'Peça institucional de fim de ano da Imobiliária Verdão: Abra as portas para o seu melhor momento com chaveiro esmaltado Verdão.',
    },
    {
      className: 'pais',
      src: social('dia-pais.webp'),
      alt: 'Peça afetiva da Imobiliária Verdão: Entre tijolos de imaginação e paredes de afeto, os pais constroem os lares mais importantes.',
    },
    {
      className: 'villagio',
      src: social('gran-villagio.webp'),
      alt: 'Apresentação de imóvel à venda no Condomínio Gran Villagio pela Imobiliária Verdão.',
    },
    {
      className: 'casaverde',
      src: social('casa-verde-lar.webp'),
      alt: 'Abertura conceitual da Imobiliária Verdão: Você escolheu essa casa para ser seu lar. Quer investir em soluções verdes?',
    },
    {
      className: 'altopadrao',
      src: social('alto-padrao.webp'),
      alt: 'Análise editorial da Imobiliária Verdão sobre o mercado imobiliário de alto padrão no Brasil.',
    },
    {
      className: 'pascoa',
      src: social('pascoa-recomecar.webp'),
      alt: 'Peça sazonal e editorial da Imobiliária Verdão: É sobre recomeçar, sobre novas histórias.',
    },
    {
      className: 'areasverdes',
      src: social('areas-verdes.webp'),
      alt: 'Peça de mercado da Imobiliária Verdão: Mais verde, mais valor. Valorização em áreas arborizadas.',
    },
    {
      className: 'tecnologia',
      src: social('site-tecnologia.webp'),
      alt: 'Apresentação do ecossistema digital da Imobiliária Verdão: Casa conectada e novo portal imobiliário.',
    },
  ],
};
