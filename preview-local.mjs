import http from 'node:http';
import { createReadStream } from 'node:fs';
import { readFile, realpath, stat } from 'node:fs/promises';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';

const projectDirectory = dirname(fileURLToPath(import.meta.url));
const siteDirectory = await realpath(resolve(projectDirectory, 'dist'));
const html = await readFile(resolve(siteDirectory, 'index.html'));
const routing = JSON.parse(await readFile(resolve(projectDirectory, 'vercel.json'), 'utf8'));
const build = createHash('sha256').update(html).digest('hex').slice(0, 12);
const args = process.argv.slice(2);
const portIndex = args.indexOf('--port');
const requestedPort = Number(portIndex === -1 ? 4173 : args[portIndex + 1]);
if (!Number.isInteger(requestedPort) || requestedPort < 1024 || requestedPort > 65525) {
  throw new Error('Porta inválida. Informe um número de 1024 a 65525.');
}

const types = {
  '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif',
  '.ico': 'image/x-icon', '.mp4': 'video/mp4', '.webm': 'video/webm',
  '.mp3': 'audio/mpeg', '.glb': 'model/gltf-binary', '.gltf': 'model/gltf+json',
  '.wasm': 'application/wasm', '.woff2': 'font/woff2', '.woff': 'font/woff',
};

const server = http.createServer(async (request, response) => {
  const reply = (status, message, headers = {}) => {
    response.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', ...headers });
    response.end(request.method === 'HEAD' ? undefined : message);
  };
  if (!['GET', 'HEAD'].includes(request.method)) return reply(405, 'Método não permitido.', { Allow: 'GET, HEAD' });
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname); }
  catch { return reply(400, 'Endereço inválido.'); }
  if (pathname === '/.csag-preview.json') {
    return reply(200, JSON.stringify({ app: 'csag-local-preview', build }), { 'Content-Type': 'application/json' });
  }
  const parsedUrl = new URL(request.url, 'http://127.0.0.1');
  const normalized = pathname.replace(/\/+$/, '') || '/';
  const redirect = routing.redirects?.find((rule) => rule.source === normalized && (!rule.has || rule.has.every((condition) => condition.type === 'query' && parsedUrl.searchParams.get(condition.key) === condition.value)));
  if (redirect) return reply(308, '', { Location: redirect.destination });
  if (pathname !== normalized) return reply(308, '', { Location: normalized + parsedUrl.search });
  if (pathname.includes('\0')) return reply(400, 'Endereço inválido.');
  let file = resolve(siteDirectory, `.${pathname}`);
  const withinSite = (value) => value === siteDirectory || value.startsWith(siteDirectory + sep);
  if (!withinSite(file)) return reply(403, 'Caminho indisponível.');
  try {
    let info;
    let fileStatus = 200;
    try {
      info = await stat(file);
      if (info.isDirectory()) { file = resolve(file, 'index.html'); info = await stat(file); }
    } catch (error) {
      if (error.code !== 'ENOENT' && error.code !== 'ENOTDIR') throw error;
      fileStatus = 404;
      file = resolve(siteDirectory, '404.html');
      info = await stat(file);
    }
    if (!info.isFile() || !withinSite(await realpath(file))) return reply(403, 'Caminho indisponível.');
    const headers = { 'Content-Type': types[extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store', 'Accept-Ranges': 'bytes', 'X-Content-Type-Options': 'nosniff', 'X-Robots-Tag': 'noindex, follow' };
    let start = 0;
    let end = info.size - 1;
    let status = fileStatus;
    if (request.headers.range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(request.headers.range);
      if (!match || (!match[1] && !match[2]) || info.size === 0) return reply(416, 'Trecho inválido.', { 'Content-Range': `bytes */${info.size}` });
      if (match[1]) { start = Number(match[1]); end = match[2] ? Math.min(Number(match[2]), end) : end; }
      else { start = Math.max(0, info.size - Number(match[2])); }
      if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= info.size) return reply(416, 'Trecho inválido.', { 'Content-Range': `bytes */${info.size}` });
      status = 206;
      headers['Content-Range'] = `bytes ${start}-${end}/${info.size}`;
    }
    headers['Content-Length'] = Math.max(0, end - start + 1);
    response.writeHead(status, headers);
    if (request.method === 'HEAD' || info.size === 0) return response.end();
    const stream = createReadStream(file, { start, end });
    stream.on('error', () => response.destroy());
    response.on('close', () => stream.destroy());
    stream.pipe(response);
  } catch { reply(500, 'Não foi possível ler o arquivo. Feche a prévia e abra o atalho novamente.'); }
});

let port = requestedPort;
while (true) {
  try {
    await new Promise((accept, reject) => {
      server.once('error', reject);
      server.listen(port, '127.0.0.1', () => { server.off('error', reject); accept(); });
    });
    break;
  } catch (error) {
    if (error.code !== 'EADDRINUSE' || port >= requestedPort + 9) throw error;
    port += 1;
  }
}
const url = `http://127.0.0.1:${port}/?cinema=4`;
console.log(`\nPrévia da Comunicação Social Ag\n\n${url}\n\nMantenha esta janela aberta enquanto estiver vendo o site.\nPara encerrar, pressione Control + C.\n`);
if (args.includes('--open') && process.platform === 'darwin') {
  const opener = spawn('/usr/bin/open', [url], { stdio: 'ignore' });
  opener.on('error', () => console.log('Abra o endereço acima no navegador.'));
}
const stop = () => { server.close(); server.closeAllConnections(); };
process.once('SIGINT', stop);
process.once('SIGTERM', stop);
