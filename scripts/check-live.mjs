import assert from 'node:assert/strict';
import process from 'node:process';
import { SEO_PAGES, SITE_URL, absoluteUrl } from '../src/data/seo.js';

// Executar depois da publicação. Não envia pedidos de indexação.
const base = new URL(process.argv[2] || SITE_URL).origin;
for (const page of SEO_PAGES.filter((item) => !item.noindex)) {
  const response = await fetch(base + page.path);
  assert.equal(response.status, 200, page.path);
  const html = await response.text();
  assert(html.includes(`rel="canonical" href="${absoluteUrl(page.path)}"`), 'Canônica: ' + page.path);
  assert(!/name="robots" content="noindex/.test(html));
  if (base === SITE_URL) assert(!response.headers.get('x-robots-tag')?.includes('noindex'), 'Produção sem bloqueio de indexação');
}
for (const pathname of ['/pagina-inexistente-csag-404', '/trabalhos/case-inexistente-csag', '/assets/arquivo-inexistente.js']) {
  const response = await fetch(base + pathname, { redirect: 'manual' });
  assert.equal(response.status, 404, '404 real: ' + pathname);
}
for (const [source, destination] of [['/about','/agencia'],['/vamos-conversar','/contato'],['/services','/agencia#agency-disciplines-title'],['/?case=dubola','/trabalhos/dubola'],['/?case=verdao','/trabalhos/verdao']]) {
  const response = await fetch(base + source, { redirect: 'manual' });
  assert([301,308].includes(response.status), 'Redirecionamento permanente: ' + source);
  const location = new URL(response.headers.get('location'), base);
  assert.equal(location.pathname + location.hash, destination);
}
const sitemap = await fetch(base + '/sitemap.xml');
assert.equal(sitemap.status, 200);
const sitemapText = await sitemap.text();
assert(sitemapText.includes(SITE_URL + '/trabalhos/dubola'));
assert(sitemapText.includes(SITE_URL + '/trabalhos/verdao'));
const robots = await fetch(base + '/robots.txt');
assert.equal(robots.status, 200);
assert((await robots.text()).includes(`Sitemap: ${SITE_URL}/sitemap.xml`));
console.log('Publicação validada: páginas, canônicas, 404, redirecionamentos, sitemap e robots.');
