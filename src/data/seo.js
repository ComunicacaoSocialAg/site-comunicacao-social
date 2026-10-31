import { AGENCY_CONFIG } from './agency.js';
import { AGENCY_STORY, APPROACH_STORY } from './agencyStory.js';
import { PROJECTS } from './projects.js';

// A prévia nunca se torna canônica. O domínio oficial já existe.
export const SITE_URL = 'https://comunicacaosocialag.com.br';
export const INDEX_ROBOTS = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
export const NOINDEX_ROBOTS = 'noindex, follow';
export const LOGO_PATH = '/assets/brand/logo-sem-fundo.png';
export const SOCIAL_IMAGE_PATH = '/assets/brand/intro/speakers.webp';
export const absoluteUrl = (value) => new URL(value, SITE_URL).href;

const basePages = [
  { path: '/', title: 'Agência de Publicidade em Poços de Caldas | CS Ag', description: 'Comunicação Social Ag em Poços de Caldas, MG. Estratégia, branding, conteúdo, campanhas e tecnologia. Somos a amplificação da sua voz.', name: 'Comunicação Social Ag' },
  { path: '/agencia', title: 'Agência de Comunicação em Poços de Caldas | CS Ag', description: AGENCY_STORY.about, name: 'Agência', type: 'AboutPage' },
  { path: '/abordagem', title: 'Estratégia de Comunicação e Branding | CS Ag', description: APPROACH_STORY.introduction, name: 'Abordagem' },
  { path: '/trabalhos', title: 'Trabalhos de Branding e Comunicação | CS Ag', description: 'Conheça os trabalhos da Comunicação Social Ag: estratégia, identidade visual, campanhas, conteúdo e experiências digitais.', name: 'Trabalhos', type: 'CollectionPage' },
  { path: '/contato', title: 'Contato | Comunicação Social Ag | Poços de Caldas', description: 'Converse com a Comunicação Social Ag em Poços de Caldas, MG. Conte o que sua marca precisa amplificar pelo WhatsApp ou e-mail.', name: 'Contato', type: 'ContactPage' },
];

// Só o case com acervo e narrativa fornecidos entra no índice neste lançamento.
// Os demais projetos continuam disponíveis; liberar exige verificar suas provas.
export const VERIFIED_CASE_IDS = new Set(['dubola', 'verdao', 'alberto-brasil']);
export const SEO_PAGES = [
  ...basePages,
  ...PROJECTS.map((project) => ({
    path: `/trabalhos/${project.id}`,
    title: project.caseStudy ? `${project.client}: ${project.caseStudy.title} | CS Ag` : `${project.title} | Comunicação Social Ag`,
    description: project.description, name: project.client || project.title,
    image: project.image, project, noindex: !VERIFIED_CASE_IDS.has(project.id),
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
    location: { '@type': 'Place', name: 'Poços de Caldas, MG, Brasil', address: { '@type': 'PostalAddress', addressLocality: 'Poços de Caldas', addressRegion: 'MG', addressCountry: 'BR' } },
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
  if (page.path !== '/') {
    const crumbs = [{ name: AGENCY_CONFIG.name, item: `${SITE_URL}/` }];
    if (page.project) crumbs.push({ name: 'Trabalhos', item: absoluteUrl('/trabalhos') });
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
