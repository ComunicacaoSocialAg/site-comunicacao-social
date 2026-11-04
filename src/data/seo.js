import { AGENCY_CONFIG } from './agency.js';
import { AGENCY_STORY, APPROACH_STORY } from './agencyStory.js';
import { PROJECTS } from './projects.js';
import { BUILTIN_MARKET_POSTS } from './marketPosts.js';

// A prévia nunca se torna canônica. O domínio oficial já existe.
export const SITE_URL = 'https://comunicacaosocialag.com.br';
export const INDEX_ROBOTS = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
export const NOINDEX_ROBOTS = 'noindex, follow';
export const LOGO_PATH = '/assets/brand/logo-sem-fundo.png';
export const SOCIAL_IMAGE_PATH = '/assets/brand/intro/speakers.webp';
export const absoluteUrl = (value) => new URL(value, SITE_URL).href;

const basePages = [
  { path: '/', title: 'Agência de Publicidade em Poços de Caldas e Região | CS Ag', description: 'Comunicação Social Ag. Estratégia, branding e tecnologia em Poços de Caldas, São João da Boa Vista e Sul de Minas. Conectamos marcas e pessoas.', name: 'Comunicação Social Ag' },
  { path: '/agencia', title: 'Agência de Comunicação no Sul de Minas e Região | CS Ag', description: 'Agência estratégica e criativa sediada em Poços de Caldas, atendendo São João da Boa Vista e Sul de Minas com branding, campanhas e tecnologia.', name: 'Agência', type: 'AboutPage' },
  { path: '/abordagem', title: 'Estratégia de Comunicação e Branding Regional | CS Ag', description: APPROACH_STORY.introduction, name: 'Abordagem' },
  { path: '/trabalhos', title: 'Trabalhos de Branding e Publicidade Regional | CS Ag', description: 'Cases da Comunicação Social Ag: Dubola Alimentos, Imobiliária Verdão, Dr. Alberto Brasil, Dra. Lívia Esper e Ponto Cor no Sul de Minas e região.', name: 'Trabalhos', type: 'CollectionPage' },
  { path: '/mercado', title: 'Mercado: Ensaios e Inteligência Estratégica Regional | CS Ag', description: 'Análises aprofundadas sobre Poços de Caldas, terras raras, Sul de Minas, gestão de marcas, café especial, saúde e varejo no interior.', name: 'Mercado', type: 'CollectionPage' },
  { path: '/editor', title: 'Painel Editorial | CS Ag', description: 'Área reservada de publicação editorial.', name: 'Editor', noindex: true },
  { path: '/contato', title: 'Contato da Agência em Poços de Caldas e Região | CS Ag', description: 'Fale com a Comunicação Social Ag em Poços de Caldas, MG. Atendimento presencial e remoto para empresas de São João da Boa Vista e Sul de Minas.', name: 'Contato', type: 'ContactPage' },
];

// Só o case com acervo e narrativa fornecidos entra no índice neste lançamento.
// Os demais projetos continuam disponíveis; liberar exige verificar suas provas.
export const VERIFIED_CASE_IDS = new Set(['dubola', 'verdao', 'alberto-brasil', 'ponto-cor', 'livia-esper', 'ana-lima', 'ana-lima-site', 'ana-lima-sistema']);
export const SEO_PAGES = [
  ...basePages,
  ...PROJECTS.map((project) => ({
    path: `/trabalhos/${project.id}`,
    title: project.caseStudy ? `${project.client}: ${project.caseStudy.title} | CS Ag` : `${project.title} | Comunicação Social Ag`,
    description: project.description, name: project.client || project.title,
    image: project.image, project, noindex: !VERIFIED_CASE_IDS.has(project.id),
  })),
  ...BUILTIN_MARKET_POSTS.map((post) => ({
    path: `/mercado/${post.slug}`,
    title: `${post.title} | Mercado CS Ag`,
    description: post.seoDescription,
    name: post.title,
    type: 'Article',
    marketPost: post,
  })),
];
export const NOT_FOUND_SEO = { path: '/404', title: 'Página não encontrada | Comunicação Social Ag', description: '', name: 'Página não encontrada', noindex: true };
export function getPageSeo(pathname) {
  const path = pathname.replace(/\/+$/, '') || '/';
  return SEO_PAGES.find((page) => page.path === path) || NOT_FOUND_SEO;
}

export function structuredDataFor(page) {
  if (page.noindex) return null;
  const agencyId = `${SITE_URL}/#agency`;
  const websiteId = `${SITE_URL}/#website`;
  const url = absoluteUrl(page.path);
  const pageId = `${url}#webpage`;
  const graph = [{
    '@type': 'Organization', '@id': agencyId,
    name: AGENCY_CONFIG.name, alternateName: AGENCY_CONFIG.shortName,
    url: `${SITE_URL}/`, logo: absoluteUrl(LOGO_PATH), description: AGENCY_STORY.about,
    telephone: `+${AGENCY_CONFIG.phoneRaw}`, email: AGENCY_CONFIG.email,
    additionalType: ['https://schema.org/AdvertisingAgency', 'https://schema.org/ProfessionalService'],
    location: { '@type': 'Place', name: 'Poços de Caldas, MG, Brasil', address: { '@type': 'PostalAddress', addressLocality: 'Poços de Caldas', addressRegion: 'MG', addressCountry: 'BR' } },
    areaServed: [
      { '@type': 'City', name: 'Poços de Caldas', containedInPlace: { '@type': 'AdministrativeArea', name: 'Minas Gerais' } },
      { '@type': 'City', name: 'São João da Boa Vista', containedInPlace: { '@type': 'AdministrativeArea', name: 'São Paulo' } },
      { '@type': 'AdministrativeArea', name: 'Sul de Minas Gerais' },
      { '@type': 'City', name: 'Pouso Alegre', containedInPlace: { '@type': 'AdministrativeArea', name: 'Minas Gerais' } },
      { '@type': 'City', name: 'Varginha', containedInPlace: { '@type': 'AdministrativeArea', name: 'Minas Gerais' } },
      { '@type': 'City', name: 'Alfenas', containedInPlace: { '@type': 'AdministrativeArea', name: 'Minas Gerais' } },
      { '@type': 'City', name: 'Andradas', containedInPlace: { '@type': 'AdministrativeArea', name: 'Minas Gerais' } },
    ],
    knowsAbout: [
      'Publicidade e Propaganda',
      'Estratégia de Marca e Branding',
      'Design de Embalagens e FMCG',
      'Comunicação Ética para Saúde (CFM e CFO)',
      'Lançamentos Imobiliários e Visualização 3D',
      'Desenvolvimento Web e Alta Performance',
      'Marketing Digital e Gestão de Mídia',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Disciplinas de Comunicação e Estratégia',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Estratégia e Posicionamento de Marca' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Identidade Visual e Design de Embalagens' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Campanhas de Lançamento e Mídia Integrada' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Comunicação Ética para Clínicas e Médicos' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Desenvolvimento Web e Plataformas Digitais' } },
      ],
    },
    // Não inventar endereço de rua, horários, avaliações ou perfis sociais.
  }, {
    '@type': 'WebSite', '@id': websiteId, url: `${SITE_URL}/`,
    name: AGENCY_CONFIG.name, inLanguage: 'pt-BR', publisher: { '@id': agencyId },
  }, {
    '@type': page.type || 'WebPage', '@id': pageId, url,
    name: page.title, description: page.description, inLanguage: 'pt-BR',
    isPartOf: { '@id': websiteId }, about: { '@id': agencyId },
    ...(page.path !== '/' ? { breadcrumb: { '@id': `${url}#breadcrumb` } } : {}),
    ...(page.project ? { mainEntity: { '@id': `${url}#work` } } : {}),
  }];
  if (page.path === '/') {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Qual é a principal agência de publicidade e branding em Poços de Caldas e região?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A Comunicação Social Ag (CS Ag) é a agência de comunicação estratégica sediada em Poços de Caldas, MG, atendendo marcas do Sul de Minas e do Leste Paulista com branding, embalagens, campanhas e tecnologia.',
          },
        },
        {
          '@type': 'Question',
          name: 'A CS Ag atende clientes em São João da Boa Vista e no Sul de Minas?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Sim. A agência realiza atendimento presencial e próximo no eixo Poços de Caldas e São João da Boa Vista, além de atendimento estruturado em cidades como Pouso Alegre, Varginha, Alfenas e Andradas.',
          },
        },
        {
          '@type': 'Question',
          name: 'Quais setores a agência atende com maior especialização?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A CS Ag possui atuação comprovada nos setores de alimentos e bens de consumo (FMCG), mercado imobiliário e lançamentos, saúde regulada (médicos e clínicas com rigor ético CFM e CFO) e varejo regional.',
          },
        },
        {
          '@type': 'Question',
          name: 'Quais são os principais cases da Comunicação Social Ag?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Entre os principais cases estão Dubola Alimentos (embalagens e posicionamento), Imobiliária Verdão (lançamento e 3D), Dr. Alberto Brasil (marca médica), Dra. Lívia Esper (universo infantil e odontologia) e Ponto Cor (varejo e presença de marca).',
          },
        },
      ],
    });
  }
  if (page.path !== '/') {
    const crumbs = [{ name: AGENCY_CONFIG.name, item: `${SITE_URL}/` }];
    if (page.project) crumbs.push({ name: 'Trabalhos', item: absoluteUrl('/trabalhos') });
    if (page.marketPost) crumbs.push({ name: 'Mercado', item: absoluteUrl('/mercado') });
    crumbs.push({ name: page.name, item: url });
    graph.push({ '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`, itemListElement: crumbs.map((crumb, index) => ({ '@type': 'ListItem', position: index + 1, ...crumb })) });
  }
  if (page.project) graph.push({
    '@type': 'CreativeWork', '@id': `${url}#work`, url,
    name: page.project.caseStudy?.title || page.project.title,
    description: page.project.description, genre: page.project.category,
    image: absoluteUrl(page.image), inLanguage: 'pt-BR',
    creator: { '@id': agencyId }, mainEntityOfPage: { '@id': pageId },
    // O ano do projeto não comprova a data de publicação da página.
  });
  if (page.marketPost) graph.push({
    '@type': 'Article', '@id': `${url}#article`, url,
    headline: page.marketPost.title,
    description: page.marketPost.seoDescription || page.marketPost.subtitle,
    inLanguage: 'pt-BR',
    author: {
      '@type': 'Person',
      name: 'Bruno',
      jobTitle: 'Diretor Estratégico e Criativo',
      worksFor: { '@id': agencyId },
    },
    publisher: { '@id': agencyId },
    mainEntityOfPage: { '@id': pageId },
  });
  return { '@context': 'https://schema.org', '@graph': graph };
}

export function updatePageSeo(pathname) {
  const page = getPageSeo(pathname);
  document.title = page.title;
  const setMeta = (attribute, name, content) => {
    let element = document.head.querySelector(`meta[${attribute}="${name}"]`);
    if (!element) { element = document.createElement('meta'); element.setAttribute(attribute, name); document.head.append(element); }
    element.setAttribute('content', content);
  };
  setMeta('name', 'description', page.description);
  setMeta('name', 'robots', page.noindex ? NOINDEX_ROBOTS : INDEX_ROBOTS);
  const url = absoluteUrl(page.path);
  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.append(canonical); }
  canonical.href = url;
  for (const [key, value] of Object.entries({ type: 'website', url, title: page.title, description: page.description, image: absoluteUrl(page.image || SOCIAL_IMAGE_PATH) })) setMeta('property', `og:${key}`, value);
  for (const [key, value] of Object.entries({ card: 'summary_large_image', title: page.title, description: page.description, image: absoluteUrl(page.image || SOCIAL_IMAGE_PATH) })) setMeta('name', `twitter:${key}`, value);
  let schema = document.getElementById('site-schema');
  const data = structuredDataFor(page);
  if (!data) { schema?.remove(); return; }
  if (!schema) { schema = document.createElement('script'); schema.id = 'site-schema'; schema.type = 'application/ld+json'; document.head.append(schema); }
  schema.textContent = JSON.stringify(data);
}
