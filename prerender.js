import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import Module from 'node:module';
import { build } from 'esbuild';
import { SEO_PAGES, NOT_FOUND_SEO, SITE_URL, INDEX_ROBOTS, NOINDEX_ROBOTS, SOCIAL_IMAGE_PATH, absoluteUrl, structuredDataFor } from './src/data/seo.js';

const root = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(root, 'dist');
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const compiled = await build({
  entryPoints: [path.join(root, 'src/entry-prerender.jsx')], bundle: true,
  platform: 'node', format: 'cjs', jsx: 'automatic', write: false,
  loader: { '.css': 'empty' }, external: ['react', 'react-dom', 'react-dom/server', 'react/jsx-runtime'],
  plugins: [{ name: 'static-scene', setup(builder) {
    builder.onResolve({ filter: /\/CinematicScene(\.jsx)?$/ }, () => ({ path: 'static-scene', namespace: 'static-scene' }));
    builder.onLoad({ filter: /.*/, namespace: 'static-scene' }, () => ({ contents: 'export default function StaticScene(){ return null; }', loader: 'js' }));
  } }],
});
const module = new Module(path.join(root, 'prerender-compiled.cjs'));
module.paths = Module._nodeModulePaths(root);
module._compile(compiled.outputFiles[0].text, path.join(root, 'prerender-compiled.cjs'));
const { renderPage } = module.exports;
const escape = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const meta = (name, value, attr = 'name') => `<meta ${attr}="${name}" content="${escape(value)}" />`;

for (const page of [...SEO_PAGES, NOT_FOUND_SEO]) {
  const canonical = absoluteUrl(page.path);
  const image = absoluteUrl(page.image || SOCIAL_IMAGE_PATH);
  const graph = structuredDataFor(page);
  const stylePrefixes = page.path === '/agencia' || page.path === '/abordagem'
    ? ['AgencyPage-', 'CampaignRibbon-'] : page.project ? ['ProjectPage-'] : [];
  const routeStyles = fs.readdirSync(path.join(dist, 'assets')).filter((file) => file.endsWith('.css') && stylePrefixes.some((prefix) => file.startsWith(prefix)));

  const head = [
    ...routeStyles.map((file) => `<link rel="stylesheet" href="/assets/${file}" />`),
    `<title>${escape(page.title)}</title>`, meta('description', page.description),
    meta('robots', page.noindex ? NOINDEX_ROBOTS : INDEX_ROBOTS), meta('author', 'Comunicação Social Ag'),
    `<link rel="canonical" href="${canonical}" />`,
    meta('og:type', 'website', 'property'), meta('og:site_name', 'Comunicação Social Ag', 'property'),
    meta('og:locale', 'pt_BR', 'property'), meta('og:url', canonical, 'property'),
    meta('og:title', page.title, 'property'), meta('og:description', page.description, 'property'),
    meta('og:image', image, 'property'), meta('og:image:alt', page.project?.title || 'O logo da CS Ag em forma de caixas de som.', 'property'),
    meta('twitter:card', 'summary_large_image'), meta('twitter:title', page.title),
    meta('twitter:description', page.description), meta('twitter:image', image),
    graph ? `<script id="site-schema" type="application/ld+json">${JSON.stringify(graph).replace(/</g, '\\u003c')}</script>` : '',
    page.path === '/' ? '<link rel="preload" as="image" href="/assets/brand/intro/speakers.webp" fetchpriority="high" />' : '',
  ].join('\n    ');
  const html = template.replace(/<!-- SEO_START -->[\s\S]*?<!-- SEO_END -->/, head)
    .replace('<div id="root"></div>', `<div id="root">${renderPage(page)}</div>`);
  const destination = page === NOT_FOUND_SEO ? path.join(dist, '404.html') : path.join(dist, page.path.slice(1), 'index.html');
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, html);
}
const indexable = SEO_PAGES.filter((page) => !page.noindex);
fs.writeFileSync(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexable.map((page) => `  <url><loc>${absoluteUrl(page.path)}</loc></url>`).join('\n')}\n</urlset>\n`);
fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
for (const file of ['sitemap.xml', 'robots.txt']) fs.copyFileSync(path.join(dist, file), path.join(root, 'public', file));
console.log(`HTML gerado para ${SEO_PAGES.length} páginas; ${indexable.length} URLs no sitemap; 404 separada.`);
if (process.env.VERCEL_ENV === 'preview') console.log('Prévia: manter X-Robots-Tag: noindex na Vercel. O domínio canônico continua oficial.');
