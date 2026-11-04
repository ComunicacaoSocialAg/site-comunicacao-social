import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const key = '7dd51dceb0f541d6a6322d8b1cba0f2f';
const host = 'comunicacaosocialag.com.br';
const keyLocation = `https://${host}/${key}.txt`;

// Extrai URLs do sitemap compilado
const sitemapPath = path.join(root, 'dist', 'sitemap.xml');
if (!fs.existsSync(sitemapPath)) {
  console.error('Arquivo sitemap.xml nao encontrado. Execute npm run build primeiro.');
  process.exit(1);
}

const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
const urls = [...sitemapContent.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);

if (urls.length === 0) {
  console.error('Nenhuma URL encontrada no sitemap.');
  process.exit(1);
}

const payload = {
  host,
  key,
  keyLocation,
  urlList: urls,
};

console.log(`Submetendo ${urls.length} URLs ao IndexNow (Bing, Yandex, etc.)...`);

const endpoints = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
];

for (const endpoint of endpoints) {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 200) {
      console.log(`[OK 200] ${endpoint}: URLs submetidas e validadas com sucesso.`);
    } else if (response.status === 202) {
      console.log(`[Aceito 202] ${endpoint}: Requisicao recebida, chave em processo de validacao.`);
    } else {
      const errorText = await response.text();
      console.warn(`[Status ${response.status}] ${endpoint}: ${errorText || response.statusText}`);
    }
  } catch (error) {
    console.error(`Erro ao conectar com ${endpoint}:`, error.message);
  }
}
