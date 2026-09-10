import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 5174;

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'text/javascript; charset=UTF-8',
  '.jsx': 'text/jsx; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
};

function getHtml() {
  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="/assets/brand/logo-sem-fundo.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="comunicação social ag • somos a amplificação da sua voz. agência estratégica e criativa de publicidade em poços de caldas." />
    <meta name="author" content="Comunicação Social Ag" />
    <title>Comunicação Social Ag | Agência de Publicidade Estratégica</title>
    
    <style>
      @font-face {
        font-family: 'Myriad Variable Concept';
        src: url('/fonts/MyriadPro-BoldIt.otf') format('opentype');
        font-weight: 700;
        font-style: italic;
        font-display: swap;
      }
      @font-face {
        font-family: 'Myriad Variable Concept';
        src: url('/fonts/MyriadPro-Bold.otf') format('opentype');
        font-weight: 700;
        font-style: normal;
        font-display: swap;
      }
    </style>

    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="/bundle.css?v=${Date.now()}" />
  </head>
  <body class="bg-black text-white selection:bg-yellow-500 selection:text-black font-sans overflow-x-hidden">
    <div id="root"></div>
    <script src="/bundle.js?v=${Date.now()}"></script>
  </body>
</html>`;
}

const server = http.createServer((req, res) => {
  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  
  if (reqPath === '/' || reqPath === '/index.html') {
    res.writeHead(200, { 
      'Content-Type': 'text/html; charset=UTF-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
    });
    return res.end(getHtml());
  }

  let filePath = path.join(__dirname, 'public', reqPath);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(__dirname, reqPath);
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(200, { 
        'Content-Type': 'text/html; charset=UTF-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
      });
      return res.end(getHtml());
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
      } else {
        res.writeHead(200, { 
          'Content-Type': contentType,
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(data);
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`\n  🚀 Dev Server Ativo do Site Oficial Comunicação Social Ag (Bundled com Esbuild + No Cache)!`);
  console.log(`  ➜  Local: http://localhost:${PORT}/\n`);
});
