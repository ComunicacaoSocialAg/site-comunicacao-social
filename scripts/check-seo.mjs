import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SEO_PAGES, SITE_URL, absoluteUrl } from '../src/data/seo.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const titles = new Set();
let references = 0;
for (const page of SEO_PAGES) {
  const html = fs.readFileSync(path.join(dist, page.path.slice(1), 'index.html'), 'utf8');
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `${page.path}: um H1`);
  assert.equal((html.match(/<title>/g) || []).length, 1, `${page.path}: um title`);
  const title = html.match(/<title>([\s\S]*?)<\/title>/)[1];
  assert(!titles.has(title), `${page.path}: título exclusivo`); titles.add(title);
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1, `${page.path}: uma canônica`);
  assert(html.includes(`rel="canonical" href="${absoluteUrl(page.path)}"`), `${page.path}: canônica oficial`);
  assert.equal((html.match(/name="description"/g) || []).length, 1);
  assert.equal((html.match(/property="og:url"/g) || []).length, 1);
  assert.equal((html.match(/name="twitter:card"/g) || []).length, 1);
  assert(!/site-novo-chi-six|5535999999999|meta name="keywords"/.test(html));
  assert.equal(/name="robots" content="noindex/.test(html), Boolean(page.noindex), `${page.path}: indexação esperada`);
  const schemas = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  assert.equal(schemas.length, page.noindex ? 0 : 1);
  for (const match of schemas) {
    const schema = JSON.parse(match[1]);
    assert(Array.isArray(schema['@graph']));
    assert(!/datePublished|aggregateRating|reviewRating|streetAddress|SearchAction/.test(match[1]), 'Não inventar provas ou datas');
    assert(schema['@graph'].some((node) => node['@type'] === 'Organization'));
    assert(schema['@graph'].some((node) => node.url === absoluteUrl(page.path)));
  }
  for (const match of html.matchAll(/<(?:img|video|source|script|link)\b[^>]*(?:src|href|poster)="(\/[^"?]+)"/g)) {
    const file = path.join(dist, decodeURI(match[1]));
    assert(fs.existsSync(file), `${page.path}: recurso existe ${match[1]}`); references++;
  }
  for (const match of html.matchAll(/<a\b[^>]*href="(\/[^"?#]*)(?:[?#][^"]*)?"/g)) {
    const target = match[1].replace(/\/$/, '') || '/';
    assert(SEO_PAGES.some((item) => item.path === target) || fs.existsSync(path.join(dist, target)), `${page.path}: link interno válido ${target}`);
  }
  if (page.path === '/agencia' || page.path === '/abordagem') assert(/rel="stylesheet" href="\/assets\/CampaignRibbon-/.test(html), 'CSS da rota no HTML inicial');
  if (page.project) assert(/rel="stylesheet" href="\/assets\/ProjectPage-/.test(html));
}
const sitemap = fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8');
const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
assert.deepEqual(locations, SEO_PAGES.filter((page) => !page.noindex).map((page) => absoluteUrl(page.path)));
assert(!/lastmod|priority|changefreq|\?case=/.test(sitemap));
assert(fs.readFileSync(path.join(dist, 'robots.txt'), 'utf8').includes(`Sitemap: ${SITE_URL}/sitemap.xml`));
assert(/noindex/.test(fs.readFileSync(path.join(dist, '404.html'), 'utf8')));
const config = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
assert(!config.rewrites, 'Não transformar URLs inexistentes em home com status 200');
assert(config.headers.some((rule) => rule.has?.some((condition) => condition.type === 'host') && rule.headers.some((header) => header.key === 'X-Robots-Tag' && header.value.includes('noindex'))));
for (const rule of config.redirects) assert(SEO_PAGES.some((page) => page.path === rule.destination.split('#')[0]), 'Redirecionamento termina em uma página real');
console.log(`SEO aprovado: ${SEO_PAGES.length} páginas, ${locations.length} URLs indexáveis, ${references} referências de recursos, títulos, canônicas, schema, CSS de rotas, links, robots e 404.`);
