import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PROJECTS } from './src/data/projects.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.resolve(__dirname, 'dist');
const BASE_URL = 'https://site-novo-chi-six.vercel.app';

if (!fs.existsSync(DIST_DIR)) {
  console.error('Error: dist directory does not exist. Run "vite build" first.');
  process.exit(1);
}

const template = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf-8');

function writePage(subPath, htmlContent) {
  const targetDir = path.join(DIST_DIR, subPath);
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(path.join(targetDir, 'index.html'), htmlContent, 'utf-8');
  console.log(`✓ Generated ${subPath}/index.html`);
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderMeta({ title, description, canonical, image, type = 'website', structuredData = null }) {
  let html = template;

  // Replace title
  html = html.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`);
  html = html.replace(/<meta name="title" content=".*?" \/>/, `<meta name="title" content="${escapeHtml(title)}" />`);

  // Replace description
  html = html.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${escapeHtml(description)}" />`);

  // Replace canonical
  html = html.replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${canonical}" />`);

  // Replace Open Graph
  html = html.replace(/<meta property="og:type" content=".*?" \/>/, `<meta property="og:type" content="${type}" />`);
  html = html.replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${canonical}" />`);
  html = html.replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${escapeHtml(title)}" />`);
  html = html.replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${escapeHtml(description)}" />`);
  if (image) {
    html = html.replace(/<meta property="og:image" content=".*?" \/>/, `<meta property="og:image" content="${image}" />`);
    html = html.replace(/<meta property="twitter:image" content=".*?" \/>/, `<meta property="twitter:image" content="${image}" />`);
  }

  // Replace Twitter
  html = html.replace(/<meta property="twitter:url" content=".*?" \/>/, `<meta property="twitter:url" content="${canonical}" />`);
  html = html.replace(/<meta property="twitter:title" content=".*?" \/>/, `<meta property="twitter:title" content="${escapeHtml(title)}" />`);
  html = html.replace(/<meta property="twitter:description" content=".*?" \/>/, `<meta property="twitter:description" content="${escapeHtml(description)}" />`);

  // Inject Structured Data (Schema.org JSON-LD)
  if (structuredData) {
    const jsonLd = `\n    <script type="application/ld+json">\n      ${JSON.stringify(structuredData, null, 2).replace(/\n/g, '\n      ')}\n    </script>`;
    html = html.replace('</head>', `${jsonLd}\n  </head>`);
  }

  return html;
}

function injectRootContent(html, content) {
  return html.replace('<div id="root"></div>', `<div id="root">${content}</div>`);
}

console.log('🚀 Starting Static Site Generation (SSG) Pre-rendering...');

// ─── 1. HOME PAGE (ENHANCED SEMANTIC DIST/INDEX.HTML) ─────────────────────────
const homeSemanticContent = `
  <header style="padding: 24px; border-bottom: 1px solid rgba(255,255,255,0.06); max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
    <div>
      <h1 style="font-size: 18px; margin: 0; color: #f7d406;">Comunicação Social Ag</h1>
      <p style="font-size: 12px; margin: 4px 0 0; color: #888;">Estratégia · Criatividade · Tecnologia · Poços de Caldas, MG</p>
    </div>
    <nav style="display: flex; gap: 16px; font-size: 13px;">
      <a href="/agencia" style="color: #eee; text-decoration: none;">Agência</a>
      <a href="/abordagem" style="color: #eee; text-decoration: none;">Abordagem</a>
      <a href="/trabalhos" style="color: #eee; text-decoration: none;">Trabalhos</a>
      <a href="/contato" style="color: #f7d406; text-decoration: none; font-weight: bold;">Contato</a>
    </nav>
  </header>
  <main style="max-width: 1100px; margin: 40px auto; padding: 0 24px;">
    <section style="margin-bottom: 48px;">
      <h2 style="font-size: 36px; line-height: 1.2; color: #fff; margin-bottom: 16px;">Somos a amplificação da sua voz.</h2>
      <p style="font-size: 18px; line-height: 1.6; color: #aaa; max-width: 800px;">
        Agência de comunicação estratégica construída para marcas que precisam ser ouvidas além do seu próprio quarteirão. Unimos inteligência analítica, branding proprietário, tecnologia interativa e execução direta.
      </p>
    </section>
    <section style="margin-bottom: 48px;">
      <h3 style="font-size: 20px; color: #f7d406; margin-bottom: 20px;">Cases & Projetos em Destaque</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
        ${PROJECTS.map(p => `
          <article style="border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 20px; background: rgba(255,255,255,0.02);">
            <span style="font-size: 11px; text-transform: uppercase; color: #f7d406; letter-spacing: 0.1em;">${escapeHtml(p.category)}</span>
            <h4 style="font-size: 18px; color: #fff; margin: 8px 0;"><a href="/trabalhos/${p.id}" style="color: #fff; text-decoration: none;">${escapeHtml(p.title)}</a></h4>
            <p style="font-size: 13px; color: #888; line-height: 1.5; margin-bottom: 12px;">${escapeHtml(p.description)}</p>
            <a href="/trabalhos/${p.id}" style="font-size: 12px; color: #f7d406; text-decoration: none;">Ver case completo →</a>
          </article>
        `).join('')}
      </div>
    </section>
  </main>
  <footer style="border-top: 1px solid rgba(255,255,255,0.06); padding: 32px 24px; text-align: center; font-size: 12px; color: #666;">
    <p>© ${new Date().getFullYear()} Comunicação Social Ag — Poços de Caldas, MG — Todos os direitos reservados</p>
  </footer>
`;

const homeSchema = {
  '@context': 'https://schema.org',
  '@type': 'AdvertisingAgency',
  'name': 'Comunicação Social Ag',
  'url': BASE_URL,
  'logo': `${BASE_URL}/assets/brand/logo-sem-fundo.png`,
  'image': `${BASE_URL}/assets/brand/logo-sem-fundo.png`,
  'description': 'Agência estratégica e criativa de publicidade, branding, tecnologia e experiências 3D em Poços de Caldas, MG.',
  'address': {
    '@type': 'PostalAddress',
    'addressLocality': 'Poços de Caldas',
    'addressRegion': 'MG',
    'addressCountry': 'BR'
  },
  'telephone': '+55-35-99999-9999',
  'sameAs': [
    'https://www.instagram.com/comunicacaosocialag'
  ]
};

const homeHtml = renderMeta({
  title: 'Comunicação Social Ag | Agência de Publicidade Estratégica',
  description: 'Somos a amplificação da sua voz. Agência estratégica de publicidade: branding, performance, tecnologia 3D e inteligência de marca.',
  canonical: `${BASE_URL}/`,
  image: `${BASE_URL}/assets/brand/logo-sem-fundo.png`,
  structuredData: homeSchema
});

fs.writeFileSync(path.join(DIST_DIR, 'index.html'), injectRootContent(homeHtml, homeSemanticContent), 'utf-8');
console.log('✓ Injected semantic SEO content into dist/index.html');

// ─── 2. /AGENCIA ──────────────────────────────────────────────────────────────
const agencyContent = `
  <header style="padding: 24px; border-bottom: 1px solid rgba(255,255,255,0.06); max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
    <div>
      <a href="/" style="font-size: 16px; font-weight: bold; color: #f7d406; text-decoration: none;">Comunicação Social Ag</a>
    </div>
    <nav style="display: flex; gap: 16px; font-size: 13px;">
      <a href="/" style="color: #888; text-decoration: none;">← Voltar à Home</a>
      <a href="/abordagem" style="color: #eee; text-decoration: none;">Abordagem</a>
      <a href="/trabalhos" style="color: #eee; text-decoration: none;">Trabalhos</a>
      <a href="/contato" style="color: #f7d406; text-decoration: none; font-weight: bold;">Contato</a>
    </nav>
  </header>
  <main style="max-width: 1100px; margin: 50px auto; padding: 0 24px;">
    <article>
      <span style="font-size: 11px; text-transform: uppercase; color: #f7d406; letter-spacing: 0.16em; font-weight: bold;">O que a CS Ag é</span>
      <h1 style="font-size: clamp(32px, 5vw, 56px); line-height: 1.15; color: #fff; margin: 16px 0 24px;">
        Agência de comunicação estratégica sediada em Poços de Caldas, construída para marcas que precisam ser ouvidas além do seu próprio quarteirão.
      </h1>
      <p style="font-size: 20px; line-height: 1.6; color: #b8b8c8; max-width: 880px; margin-bottom: 48px;">
        Não vendemos peças soltas. Construímos sistemas de crescimento que unem estratégia, criação, tecnologia e execução — porque estratégia sem criatividade é esquecível, e criatividade sem estratégia é inútil.
      </p>

      <section style="border-top: 1px solid rgba(255,255,255,0.06); padding-top: 48px; margin-bottom: 48px;">
        <h2 style="font-size: 28px; color: #fff; margin-bottom: 20px;">De onde viemos</h2>
        <p style="font-size: 16px; line-height: 1.8; color: #a4a4b8; margin-bottom: 16px;">
          Nascemos em Poços de Caldas com uma convicção clara: grandes marcas do interior não precisam de agências de capital para ter comunicação de nível global. O que elas precisam é de estratégia séria, criação afiada e execução que não terceiriza a responsabilidade.
        </p>
        <p style="font-size: 16px; line-height: 1.8; color: #a4a4b8;">
          Em 5 anos de história, crescemos junto com clientes que começaram regionais e hoje operam nacionalmente. Vimos tendências nascerem e morrerem; o que ficou foi o método: entender antes de criar, testar antes de escalar, medir para aprender.
        </p>
      </section>

      <section style="border-top: 1px solid rgba(255,255,255,0.06); padding-top: 48px; margin-bottom: 48px;">
        <h2 style="font-size: 28px; color: #fff; margin-bottom: 24px;">Os números que provam</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
          <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); padding: 24px; border-radius: 12px;">
            <div style="font-size: 44px; font-weight: 800; color: #f7d406; line-height: 1;">80+</div>
            <div style="font-size: 12px; color: #888; text-transform: uppercase; margin-top: 8px;">Clientes atendidos</div>
          </div>
          <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); padding: 24px; border-radius: 12px;">
            <div style="font-size: 44px; font-weight: 800; color: #f7d406; line-height: 1;">+400%</div>
            <div style="font-size: 12px; color: #888; text-transform: uppercase; margin-top: 8px;">Crescimento médio em campanhas</div>
          </div>
          <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); padding: 24px; border-radius: 12px;">
            <div style="font-size: 44px; font-weight: 800; color: #f7d406; line-height: 1;">5</div>
            <div style="font-size: 12px; color: #888; text-transform: uppercase; margin-top: 8px;">Anos construindo marcas</div>
          </div>
          <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); padding: 24px; border-radius: 12px;">
            <div style="font-size: 44px; font-weight: 800; color: #f7d406; line-height: 1;">∞</div>
            <div style="font-size: 12px; color: #888; text-transform: uppercase; margin-top: 8px;">Fronteiras de atuação</div>
          </div>
        </div>
      </section>

      <section style="border-top: 1px solid rgba(255,255,255,0.06); padding-top: 48px; margin-bottom: 48px;">
        <h2 style="font-size: 28px; color: #fff; margin-bottom: 24px;">O que fazemos — 6 Frentes de Atuação</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
          <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); padding: 24px; border-radius: 12px;">
            <span style="font-size: 11px; color: #f7d406; font-weight: bold;">01</span>
            <h3 style="font-size: 18px; color: #fff; margin: 8px 0;">Estratégia</h3>
            <p style="font-size: 13px; color: #999; line-height: 1.6;">Diagnóstico de marca, posicionamento de mercado, arquitetura de canais e planejamento anual.</p>
          </div>
          <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); padding: 24px; border-radius: 12px;">
            <span style="font-size: 11px; color: #f7d406; font-weight: bold;">02</span>
            <h3 style="font-size: 18px; color: #fff; margin: 8px 0;">Branding</h3>
            <p style="font-size: 13px; color: #999; line-height: 1.6;">Identidade visual proprietária, tom de voz, manuais de marca e design de experiência.</p>
          </div>
          <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); padding: 24px; border-radius: 12px;">
            <span style="font-size: 11px; color: #f7d406; font-weight: bold;">03</span>
            <h3 style="font-size: 18px; color: #fff; margin: 8px 0;">Conteúdo</h3>
            <p style="font-size: 13px; color: #999; line-height: 1.6;">Produção audiovisual, narrativas digitais, campanhas de influência e autoridade editorial.</p>
          </div>
          <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); padding: 24px; border-radius: 12px;">
            <span style="font-size: 11px; color: #f7d406; font-weight: bold;">04</span>
            <h3 style="font-size: 18px; color: #fff; margin: 8px 0;">Design</h3>
            <p style="font-size: 13px; color: #999; line-height: 1.6;">Design editorial, embalagens, sinalização e comunicação visual para ambientes corporativos.</p>
          </div>
          <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); padding: 24px; border-radius: 12px;">
            <span style="font-size: 11px; color: #f7d406; font-weight: bold;">05</span>
            <h3 style="font-size: 18px; color: #fff; margin: 8px 0;">Mídia & Performance</h3>
            <p style="font-size: 13px; color: #999; line-height: 1.6;">Tráfego pago multi-plataforma, inteligência de conversão, dados em tempo real e otimização contínua de ROI.</p>
          </div>
          <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); padding: 24px; border-radius: 12px;">
            <span style="font-size: 11px; color: #f7d406; font-weight: bold;">06</span>
            <h3 style="font-size: 18px; color: #fff; margin: 8px 0;">Tecnologia</h3>
            <p style="font-size: 13px; color: #999; line-height: 1.6;">Websites de alta performance, experiências 3D interativas WebGL, automações e sistemas web sob medida.</p>
          </div>
        </div>
      </section>

      <section style="text-align: center; padding: 60px 0;">
        <h2 style="font-size: 32px; color: #fff; margin-bottom: 16px;">Pronto para construir o próximo capítulo da sua marca?</h2>
        <a href="/contato" style="display: inline-block; background: #f7d406; color: #000; padding: 14px 28px; border-radius: 8px; font-weight: bold; text-decoration: none;">Iniciar Conversa com a Agência →</a>
      </section>
    </article>
  </main>
`;

const agencyHtml = renderMeta({
  title: 'A Agência — Comunicação Social Ag | Poços de Caldas, MG',
  description: 'Agência de comunicação estratégica sediada em Poços de Caldas, construída para marcas que precisam ser ouvidas além do seu próprio quarteirão.',
  canonical: `${BASE_URL}/agencia`,
  image: `${BASE_URL}/assets/brand/logo-sem-fundo.png`,
  structuredData: homeSchema
});

writePage('agencia', injectRootContent(agencyHtml, agencyContent));

// ─── 3. /ABORDAGEM ────────────────────────────────────────────────────────────
const approachContent = `
  <header style="padding: 24px; border-bottom: 1px solid rgba(255,255,255,0.06); max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
    <div>
      <a href="/" style="font-size: 16px; font-weight: bold; color: #f7d406; text-decoration: none;">Comunicação Social Ag</a>
    </div>
    <nav style="display: flex; gap: 16px; font-size: 13px;">
      <a href="/" style="color: #888; text-decoration: none;">← Voltar à Home</a>
      <a href="/agencia" style="color: #eee; text-decoration: none;">Agência</a>
      <a href="/trabalhos" style="color: #eee; text-decoration: none;">Trabalhos</a>
      <a href="/contato" style="color: #f7d406; text-decoration: none; font-weight: bold;">Contato</a>
    </nav>
  </header>
  <main style="max-width: 1100px; margin: 50px auto; padding: 0 24px;">
    <article>
      <span style="font-size: 11px; text-transform: uppercase; color: #f7d406; letter-spacing: 0.16em; font-weight: bold;">Como pensamos</span>
      <h1 style="font-size: clamp(32px, 5vw, 56px); line-height: 1.15; color: #fff; margin: 16px 0 24px;">
        Amplificar não é gritar mais alto. É saber exatamente o que vale a pena ser dito, e garantir que chegue a quem precisa ouvir.
      </h1>
      <p style="font-size: 20px; line-height: 1.6; color: #b8b8c8; max-width: 880px; margin-bottom: 48px;">
        Nosso processo tem três movimentos fundamentais. Nenhum projeto passa direto para o terceiro sem passar pelos dois primeiros.
      </p>

      <section style="border-top: 1px solid rgba(255,255,255,0.06); padding-top: 48px; margin-bottom: 48px;">
        <div style="display: flex; align-items: baseline; gap: 16px; margin-bottom: 16px;">
          <span style="font-size: 54px; font-weight: 900; color: #f7d406; line-height: 1;">01</span>
          <h2 style="font-size: 32px; color: #fff; margin: 0;">Escutar</h2>
        </div>
        <p style="font-size: 18px; font-weight: 600; color: #d0d0dc; margin-bottom: 16px;">
          Diagnóstico profundo antes de qualquer briefing criativo.
        </p>
        <p style="font-size: 16px; line-height: 1.8; color: #a4a4b8;">
          A maioria das agências começa criando. Nós começamos ouvindo: o mercado, os concorrentes, os números do cliente e, principalmente, o que o público-alvo diz quando ninguém está perguntando. Uma marca que fala sem escutar não comunica — ela apenas faz barulho.
        </p>
        <blockquote style="border-left: 2px solid #f7d406; padding-left: 16px; font-style: italic; color: #dedede; margin: 20px 0;">
          "O melhor briefing é aquele que você descobre cavando o que o cliente não disse na primeira reunião."
        </blockquote>
      </section>

      <section style="border-top: 1px solid rgba(255,255,255,0.06); padding-top: 48px; margin-bottom: 48px;">
        <div style="display: flex; align-items: baseline; gap: 16px; margin-bottom: 16px;">
          <span style="font-size: 54px; font-weight: 900; color: #f7d406; line-height: 1;">02</span>
          <h2 style="font-size: 32px; color: #fff; margin: 0;">Traduzir</h2>
        </div>
        <p style="font-size: 18px; font-weight: 600; color: #d0d0dc; margin-bottom: 16px;">
          Transformar dados, contexto e intenção em linguagem de impacto.
        </p>
        <p style="font-size: 16px; line-height: 1.8; color: #a4a4b8;">
          Dados soltos não movem ninguém. Criatividade sem ancoragem não vende. O segundo movimento é o mais refinado: é onde encontramos o ângulo que torna uma marca impossível de ignorar. Criamos linguagens proprietárias — visuais, verbais e conceituais — que pertencem exclusivamente àquele cliente.
        </p>
      </section>

      <section style="border-top: 1px solid rgba(255,255,255,0.06); padding-top: 48px; margin-bottom: 48px;">
        <div style="display: flex; align-items: baseline; gap: 16px; margin-bottom: 16px;">
          <span style="font-size: 54px; font-weight: 900; color: #f7d406; line-height: 1;">03</span>
          <h2 style="font-size: 32px; color: #fff; margin: 0;">Amplificar</h2>
        </div>
        <p style="font-size: 18px; font-weight: 600; color: #d0d0dc; margin-bottom: 16px;">
          Levar a mensagem certa às pessoas certas, na frequência certa.
        </p>
        <p style="font-size: 16px; line-height: 1.8; color: #a4a4b8;">
          Com a mensagem afiada e a identidade construída, entra a engenharia de distribuição: mídia paga, canais orgânicos, OOH, assessoria de influência e tecnologia. Medimos tudo em tempo real, eliminando desperdício e dobrando a aposta no que gera resultado real de negócios.
        </p>
      </section>

      <section style="border-top: 1px solid rgba(255,255,255,0.06); padding-top: 48px; margin-bottom: 48px;">
        <h2 style="font-size: 28px; color: #fff; margin-bottom: 24px;">O que isso significa na prática</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
          <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); padding: 24px; border-radius: 12px;">
            <span style="font-size: 11px; color: #f7d406; font-weight: bold;">Pergunta 01</span>
            <h3 style="font-size: 18px; color: #fff; margin: 8px 0;">Por que alguém deveria se importar?</h3>
            <p style="font-size: 13px; color: #999; line-height: 1.6;">Se a resposta for genérica, a campanha não vai para a rua. Toda mensagem precisa carregar um motivo genuíno de atenção.</p>
          </div>
          <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); padding: 24px; border-radius: 12px;">
            <span style="font-size: 11px; color: #f7d406; font-weight: bold;">Pergunta 02</span>
            <h3 style="font-size: 18px; color: #fff; margin: 8px 0;">Isso parece com outra marca?</h3>
            <p style="font-size: 13px; color: #999; line-height: 1.6;">Se parecer, joga fora e faz de novo. O maior risco na publicidade não é errar — é ser confundido com o vizinho.</p>
          </div>
          <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); padding: 24px; border-radius: 12px;">
            <span style="font-size: 11px; color: #f7d406; font-weight: bold;">Pergunta 03</span>
            <h3 style="font-size: 18px; color: #fff; margin: 8px 0;">Como medimos se funcionou?</h3>
            <p style="font-size: 13px; color: #999; line-height: 1.6;">Métrica de vaidade não paga boleto. Definimos o indicador de sucesso antes de veicular a primeira peça.</p>
          </div>
        </div>
      </section>

      <section style="text-align: center; padding: 60px 0;">
        <a href="/contato" style="display: inline-block; background: #f7d406; color: #000; padding: 14px 28px; border-radius: 8px; font-weight: bold; text-decoration: none;">Aplicar essa metodologia ao meu projeto →</a>
      </section>
    </article>
  </main>
`;

const approachHtml = renderMeta({
  title: 'Nossa Abordagem: Escutar · Traduzir · Amplificar — Comunicação Social Ag',
  description: 'Amplificar não é gritar mais alto. Conheça nossos 3 movimentos fundamentais de comunicação estratégica: 01 Escutar, 02 Traduzir, 03 Amplificar.',
  canonical: `${BASE_URL}/abordagem`,
  image: `${BASE_URL}/assets/brand/logo-sem-fundo.png`
});

writePage('abordagem', injectRootContent(approachHtml, approachContent));

// ─── 4. /CONTATO ──────────────────────────────────────────────────────────────
const contactContent = `
  <header style="padding: 24px; border-bottom: 1px solid rgba(255,255,255,0.06); max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
    <div>
      <a href="/" style="font-size: 16px; font-weight: bold; color: #f7d406; text-decoration: none;">Comunicação Social Ag</a>
    </div>
    <nav style="display: flex; gap: 16px; font-size: 13px;">
      <a href="/" style="color: #888; text-decoration: none;">← Voltar à Home</a>
      <a href="/agencia" style="color: #eee; text-decoration: none;">Agência</a>
      <a href="/abordagem" style="color: #eee; text-decoration: none;">Abordagem</a>
      <a href="/trabalhos" style="color: #eee; text-decoration: none;">Trabalhos</a>
    </nav>
  </header>
  <main style="max-width: 1100px; margin: 50px auto; padding: 0 24px;">
    <div style="display: grid; grid-template-columns: 1fr 340px; gap: 48px;">
      <div>
        <span style="font-size: 11px; text-transform: uppercase; color: #f7d406; letter-spacing: 0.16em; font-weight: bold;">Iniciar Projeto</span>
        <h1 style="font-size: clamp(28px, 4vw, 44px); line-height: 1.2; color: #fff; margin: 16px 0 20px;">
          Toda grande marca começou com uma conversa honesta.
        </h1>
        <p style="font-size: 16px; line-height: 1.6; color: #aaa; margin-bottom: 32px;">
          Preencha os passos abaixo para nos dar o contexto do seu negócio, ou use os canais diretos ao lado se preferir falar agora.
        </p>

        <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 28px;">
          <h2 style="font-size: 20px; color: #fff; margin-bottom: 12px;">Como podemos ajudar?</h2>
          <ul style="list-style: none; padding: 0; margin: 0 0 24px; color: #bbb; line-height: 2;">
            <li>✓ Construção de marca do zero (Branding & Identidade)</li>
            <li>✓ Reposicionamento e repaginação de marcas ativas</li>
            <li>✓ Estratégia de conteúdo, redes sociais e autoridade</li>
            <li>✓ Campanhas de performance e tráfego pago</li>
            <li>✓ Criação de sites de alta conversão e sistemas sob medida</li>
          </ul>
          <a href="https://wa.me/5535999999999?text=Ol%C3%A1!%20Gostaria%20de%20iniciar%20um%20projeto%20com%20a%20CS%20Ag." target="_blank" rel="noopener noreferrer" style="display: inline-block; background: #25d366; color: #000; font-weight: bold; padding: 12px 24px; border-radius: 8px; text-decoration: none;">
            Falar pelo WhatsApp Agora ↗
          </a>
        </div>
      </div>

      <aside>
        <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 24px;">
          <span style="font-size: 10px; text-transform: uppercase; color: #f7d406; letter-spacing: 0.1em; font-weight: bold;">Canais Imediatos</span>
          <h3 style="font-size: 20px; color: #fff; margin: 8px 0 16px;">Fale Direto</h3>
          
          <div style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.06);">
            <div style="font-size: 11px; color: #888; text-transform: uppercase;">WhatsApp</div>
            <a href="https://wa.me/5535999999999" target="_blank" rel="noopener noreferrer" style="color: #f7d406; font-size: 14px; text-decoration: none; font-weight: bold;">+55 (35) 99999-9999 ↗</a>
          </div>

          <div style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.06);">
            <div style="font-size: 11px; color: #888; text-transform: uppercase;">E-mail</div>
            <a href="mailto:contato@comunicacaosocialag.com.br" style="color: #f7d406; font-size: 14px; text-decoration: none;">contato@comunicacaosocialag.com.br ↗</a>
          </div>

          <div style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.06);">
            <div style="font-size: 11px; color: #888; text-transform: uppercase;">Localização</div>
            <div style="color: #ddd; font-size: 13px;">Poços de Caldas, MG — Brasil</div>
          </div>

          <div>
            <div style="font-size: 11px; color: #888; text-transform: uppercase;">Área do Cliente</div>
            <a href="https://cliente.comunicacaosocialag.com.br" target="_blank" rel="noopener noreferrer" style="color: #999; font-size: 13px; text-decoration: none;">Portal de Clientes Ativos ↗</a>
          </div>
        </div>
      </aside>
    </div>
  </main>
`;

const contactHtml = renderMeta({
  title: 'Fale Conosco — Inicie seu Projeto | Comunicação Social Ag',
  description: 'Inicie seu projeto com a equipe estratégica da Comunicação Social Ag. WhatsApp direto, e-mail comercial e atendimento estratégico em Poços de Caldas, MG.',
  canonical: `${BASE_URL}/contato`,
  image: `${BASE_URL}/assets/brand/logo-sem-fundo.png`
});

writePage('contato', injectRootContent(contactHtml, contactContent));

// ─── 5. /TRABALHOS (CATALOG INDEX) ─────────────────────────────────────────────
const worksContent = `
  <header style="padding: 24px; border-bottom: 1px solid rgba(255,255,255,0.06); max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
    <div>
      <a href="/" style="font-size: 16px; font-weight: bold; color: #f7d406; text-decoration: none;">Comunicação Social Ag</a>
    </div>
    <nav style="display: flex; gap: 16px; font-size: 13px;">
      <a href="/" style="color: #888; text-decoration: none;">← Galeria 3D</a>
      <a href="/agencia" style="color: #eee; text-decoration: none;">Agência</a>
      <a href="/abordagem" style="color: #eee; text-decoration: none;">Abordagem</a>
      <a href="/contato" style="color: #f7d406; text-decoration: none; font-weight: bold;">Contato</a>
    </nav>
  </header>
  <main style="max-width: 1100px; margin: 50px auto; padding: 0 24px;">
    <span style="font-size: 11px; text-transform: uppercase; color: #f7d406; letter-spacing: 0.16em; font-weight: bold;">Portfólio & Cases</span>
    <h1 style="font-size: clamp(32px, 5vw, 54px); color: #fff; margin: 16px 0 32px;">Todos os Trabalhos</h1>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px;">
      ${PROJECTS.map(p => `
        <article style="border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 24px; background: rgba(255,255,255,0.02);">
          <span style="font-size: 11px; text-transform: uppercase; color: #f7d406; letter-spacing: 0.1em;">${escapeHtml(p.category)} · ${p.year}</span>
          <h2 style="font-size: 22px; color: #fff; margin: 8px 0;"><a href="/trabalhos/${p.id}" style="color: #fff; text-decoration: none;">${escapeHtml(p.title)}</a></h2>
          <p style="font-size: 14px; color: #888; line-height: 1.6; margin-bottom: 16px;">${escapeHtml(p.description)}</p>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 12px;">
            <span style="font-size: 12px; color: #aaa;">${escapeHtml(p.client)}</span>
            <a href="/trabalhos/${p.id}" style="font-size: 12px; color: #f7d406; text-decoration: none; font-weight: bold;">Ver Case →</a>
          </div>
        </article>
      `).join('')}
    </div>
  </main>
`;

const worksHtml = renderMeta({
  title: 'Trabalhos & Cases de Sucesso — Comunicação Social Ag',
  description: 'Conheça o portfólio completo da Comunicação Social Ag: branding, campanhas urbanas, estratégia digital, experiências 3D e tecnologia.',
  canonical: `${BASE_URL}/trabalhos`,
  image: `${BASE_URL}/assets/brand/logo-sem-fundo.png`
});

writePage('trabalhos', injectRootContent(worksHtml, worksContent));

// ─── 6. INDIVIDUAL CASE PAGES (/trabalhos/:slug) ──────────────────────────────
PROJECTS.forEach(p => {
  const caseUrl = `${BASE_URL}/trabalhos/${p.id}`;
  const caseImage = p.image.startsWith('http') ? p.image : `${BASE_URL}${p.image}`;

  const caseStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    'name': p.title,
    'headline': p.title,
    'description': p.description,
    'image': caseImage,
    'creator': {
      '@type': 'AdvertisingAgency',
      'name': 'Comunicação Social Ag',
      'url': BASE_URL
    },
    'datePublished': `${p.year}-01-01`,
    'genre': p.category
  };

  const caseContent = `
    <header style="padding: 24px; border-bottom: 1px solid rgba(255,255,255,0.06); max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <a href="/" style="font-size: 14px; color: #888; text-decoration: none;">← Voltar à Galeria 3D</a>
      </div>
      <nav style="display: flex; gap: 16px; font-size: 13px;">
        <a href="/trabalhos" style="color: #eee; text-decoration: none;">Todos os Trabalhos</a>
        <a href="/agencia" style="color: #eee; text-decoration: none;">Agência</a>
        <a href="/contato" style="color: #f7d406; text-decoration: none; font-weight: bold;">Falar com a Agência</a>
      </nav>
    </header>
    <main style="max-width: 1000px; margin: 40px auto; padding: 0 24px;">
      <article>
        <span style="font-size: 12px; text-transform: uppercase; color: #f7d406; letter-spacing: 0.16em; font-weight: bold;">
          ${escapeHtml(p.category)} · ${p.year} ${p.isConceptual ? '(Projeto Conceitual / Benchmark)' : '(Projeto Real)'}
        </span>
        <h1 style="font-size: clamp(36px, 6vw, 68px); line-height: 1.05; color: #fff; margin: 16px 0 20px;">
          ${escapeHtml(p.title)}
        </h1>
        <p style="font-size: 20px; line-height: 1.5; color: #b8b8c8; margin-bottom: 32px;">
          ${escapeHtml(p.description)}
        </p>

        <div style="margin: 32px 0; border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.08);">
          <img src="${p.image}" alt="${escapeHtml(p.title)}" style="width: 100%; height: auto; max-height: 600px; object-fit: cover;" />
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 48px; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 32px;">
          <div><strong style="color: #888; font-size: 11px; text-transform: uppercase;">Cliente:</strong><div style="color: #fff; font-size: 15px;">${escapeHtml(p.client)}</div></div>
          <div><strong style="color: #888; font-size: 11px; text-transform: uppercase;">Papel da Agência:</strong><div style="color: #fff; font-size: 15px;">${escapeHtml(p.role || 'Estratégia & Criação')}</div></div>
          <div><strong style="color: #888; font-size: 11px; text-transform: uppercase;">Ano:</strong><div style="color: #fff; font-size: 15px;">${p.year}</div></div>
        </div>

        <section style="margin-bottom: 40px;">
          <h2 style="font-size: 24px; color: #f7d406; margin-bottom: 14px;">01. O Desafio</h2>
          <p style="font-size: 16px; line-height: 1.8; color: #c0c0d0;">${escapeHtml(p.challenge || p.description)}</p>
        </section>

        ${p.thought ? `
          <section style="margin-bottom: 40px;">
            <h2 style="font-size: 24px; color: #f7d406; margin-bottom: 14px;">02. O Pensamento Estratégico</h2>
            <p style="font-size: 16px; line-height: 1.8; color: #c0c0d0;">${escapeHtml(p.thought)}</p>
          </section>
        ` : ''}

        <section style="margin-bottom: 40px;">
          <h2 style="font-size: 24px; color: #f7d406; margin-bottom: 14px;">03. A Estratégia</h2>
          <p style="font-size: 16px; line-height: 1.8; color: #c0c0d0;">${escapeHtml(p.strategy || p.details)}</p>
        </section>

        ${p.execution ? `
          <section style="margin-bottom: 40px;">
            <h2 style="font-size: 24px; color: #f7d406; margin-bottom: 14px;">04. Execução</h2>
            <p style="font-size: 16px; line-height: 1.8; color: #c0c0d0;">${escapeHtml(p.execution)}</p>
          </section>
        ` : ''}

        ${p.impact ? `
          <section style="margin-bottom: 40px;">
            <h2 style="font-size: 24px; color: #f7d406; margin-bottom: 14px;">05. Impacto</h2>
            <p style="font-size: 16px; line-height: 1.8; color: #c0c0d0;">${escapeHtml(p.impact)}</p>
          </section>
        ` : ''}

        ${p.results && p.results.length > 0 ? `
          <section style="margin: 48px 0; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 28px;">
            <h2 style="font-size: 20px; color: #fff; margin-bottom: 20px;">Resultados Consolidados</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 20px;">
              ${p.results.map(r => `
                <div>
                  <div style="font-size: 36px; font-weight: 800; color: #f7d406; line-height: 1;">${escapeHtml(r.value)}</div>
                  <div style="font-size: 12px; color: #888; text-transform: uppercase; margin-top: 6px;">${escapeHtml(r.label)}</div>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <!-- CDC Art. 37 Legal Badge -->
        <div style="font-size: 11px; color: #666; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 16px; margin: 32px 0;">
          ${p.isConceptual
            ? 'Nota Legal (CDC Art. 37): Este estudo apresenta um projeto conceitual desenvolvido internamente pela Comunicação Social Ag como exploração de linguagem visual, direcionamento de arte e benchmark metodológico.'
            : 'Nota Legal (CDC Art. 37): Projeto executado pela Comunicação Social Ag para cliente ativo sob conformidade técnica e regulatória.'}
        </div>

        <section style="text-align: center; padding: 48px 0; border-top: 1px solid rgba(255,255,255,0.08);">
          <h2 style="font-size: 28px; color: #fff; margin-bottom: 16px;">Quer um formato semelhante para a sua marca?</h2>
          <a href="https://wa.me/5535999999999?text=${encodeURIComponent(`Olá! Vi o case "${p.title}" no portfólio da CS Ag e gostaria de solicitar uma proposta comercial.`)}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: #f7d406; color: #000; padding: 14px 28px; border-radius: 8px; font-weight: bold; text-decoration: none;">
            Solicitar Proposta para este Formato →
          </a>
        </section>
      </article>
    </main>
  `;

  const caseHtml = renderMeta({
    title: `${p.title} · ${p.category} — Comunicação Social Ag`,
    description: `${p.description} Desafio: ${p.challenge ? p.challenge.slice(0, 120) : p.title}... Veja o case completo.`,
    canonical: caseUrl,
    image: caseImage,
    type: 'article',
    structuredData: caseStructuredData
  });

  writePage(`trabalhos/${p.id}`, injectRootContent(caseHtml, caseContent));
});

// ─── 7. GENERATE SITEMAP.XML ──────────────────────────────────────────────────
const sitemapUrls = [
  { loc: `${BASE_URL}/`, priority: '1.0', changefreq: 'weekly' },
  { loc: `${BASE_URL}/agencia`, priority: '0.9', changefreq: 'monthly' },
  { loc: `${BASE_URL}/abordagem`, priority: '0.9', changefreq: 'monthly' },
  { loc: `${BASE_URL}/contato`, priority: '0.9', changefreq: 'monthly' },
  { loc: `${BASE_URL}/trabalhos`, priority: '0.8', changefreq: 'weekly' },
  ...PROJECTS.map(p => ({
    loc: `${BASE_URL}/trabalhos/${p.id}`,
    priority: '0.7',
    changefreq: 'monthly'
  }))
];

const today = new Date().toISOString().split('T')[0];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml, 'utf-8');
console.log('✓ Generated dist/sitemap.xml with 21 URLs');

// ─── 8. GENERATE ROBOTS.TXT ───────────────────────────────────────────────────
const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`;

fs.writeFileSync(path.join(DIST_DIR, 'robots.txt'), robotsTxt, 'utf-8');
console.log('✓ Generated dist/robots.txt');

console.log('🎉 SSG Pre-rendering completed successfully!');
