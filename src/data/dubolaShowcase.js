const base = '/assets/cases/dubola/';
const media = (name) => `${base}showcase/${name}`;
const original = (name) => `${base}story/${name}`;

export const DUBOLA_SHOWCASE = {
  hero: {
    desktop: media('reel-2.mp4'), mobile: media('reel-2.mp4'),
    poster: media('reel-2-poster.webp'), mobilePoster: media('reel-2-poster.webp'),
  },
  products: [
    { src: media('mostarda.webp'), alt: 'Mockup de mostarda Dubola com rótulo amarelo e embalagem inclinada.', className: 'mustard' },
    { src: media('picante.webp'), alt: 'Mockup da embalagem de ketchup picante Dubola.', className: 'ketchup' },
    { src: media('goiaba.webp'), alt: 'Mockup da embalagem de ketchup com goiaba Dubola.', className: 'guava' },
    { src: media('maionese.webp'), alt: 'Mockup de pote de vidro de maionese tradicional Dubola.', className: 'mayo' },
  ],
  lines: [
    { src: original('maioneses.webp'), alt: 'Mockup de quatro maioneses Dubola em bisnaga, com rótulos nas cores roxo, azul, laranja e verde.', className: 'mayo-line' },
    { src: original('tomates.webp'), alt: 'Mockup de três molhos de tomate Dubola em potes de vidro com rótulos dourados em verde, marrom e vermelho.', className: 'tomato-line' },
    { src: media('ketchups-trio.webp'), alt: 'Mockup de três ketchups Dubola em bisnaga: tradicional, com goiaba e picante.', className: 'ketchup-line' },
  ],
  apron: { src: original('avental.webp'), alt: 'Aplicação da identidade Dubola em avental, apresentada em mockup ambientado.' },
  bag: { src: media('sacola-papel.webp'), alt: 'Mockup da sacola branca Dubola com ilustrações de tomates, logo e dois QR codes, sobre uma bancada.' },
  towel: { src: original('pano.webp'), alt: 'Pano de prato Dubola com ilustrações de tomates, em mockup ambientado de cozinha.' },
  flags: { src: original('windbanner.webp'), alt: 'Design de windbanner Dubola. Mockup de frente e verso completos.' },
  landing: { src: original('landing.webp'), alt: 'Captura real da landing page dubola.com.br.' },
  campaign: { src: `${base}barbecue-brasa.webp`, alt: 'Composição de campanha da linha Barbecue Dubola.' },
  campaignVideo: media('barbecue.mp4'),
};
