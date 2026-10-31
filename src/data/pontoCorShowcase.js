const base = '/assets/cases/ponto-cor/';
const dimensions = {"hero": [1344, 1800], "carnaval-neon": [1000, 1241], "carnaval-maximal": [1000, 1241], "carnaval-ombreira": [1000, 1333], "carnaval-headpiece": [1000, 1333], "carnaval-brincos": [1000, 1250], "carnaval-micangas": [1000, 1250], "carnaval-customizacao": [1000, 1250], "carnaval-acessorios": [1000, 1250], "carnaval-viseira": [1000, 1250], "cor-chocolate": [1000, 1333], "cor-mirtilo": [1000, 1333], "cor-azeite": [1000, 1333], "cor-capim": [1000, 1333], "cor-pitaya": [1000, 1333], "inverno-cores": [1000, 1333], "inverno-vermelhos": [1000, 1333], "inverno-azuis": [1000, 1333], "inverno-verdes": [1000, 1333], "inverno-neutros": [1000, 1333], "inverno-teal": [1000, 1333], "inverno-marrons": [1000, 1333], "inverno-citricos": [1000, 1333], "inverno-roxos": [1000, 1333], "kit-bordado": [1000, 1241], "bouquet": [1000, 1333], "bolsa-croche": [1000, 1333], "manta": [1000, 1333], "dia-mulheres": [1000, 1333], "logo-color": [1000, 341], "logo-white": [1000, 1187], "carnaval-colorido": [1000, 1000], "mirtilo-novelo-poster": [360, 640], "mirtilo-artesanato-poster": [360, 640], "mirtilo-bailarina-poster": [360, 640], "mirtilo-armarinho-poster": [360, 640]};
const piece = (file, alt) => ({ src: `${base}${file}.webp`, alt, width: dimensions[file][0], height: dimensions[file][1] });
const videoPiece = (file, alt, background) => ({
  video: `${base}${file}.mp4`,
  poster: `${base}${file}-poster.webp`,
  src: `${base}${file}-poster.webp`,
  alt,
  width: 360,
  height: 640,
  background
});

export const PONTO_COR_CASE = {
  id: 'ponto-cor', client: 'Ponto Cor', title: 'A vontade de criar.',
  category: 'Gestão da presença digital', accent: '#d65e18',
  image: `${base}hero.webp`,
  description: 'Gestão da presença digital da Ponto Cor. Campanhas de Carnaval, lançamentos e conteúdo que conecta cor, produto e o prazer de criar.',
  challenge: 'Apresentar a variedade da Ponto Cor com uma linguagem que inspira, destaca os produtos e acompanha os diferentes momentos do calendário.',
  thinking: 'Cada material pode ser o começo de uma ideia. A comunicação transforma essa possibilidade em uma presença reconhecível.',
  closing: 'Estratégia, direção de arte e conteúdo em uma mesma conversa.',
};

export const PONTO_COR_MEDIA = {
  base,
  carnival: [
    piece('carnaval-ombreira', 'Campanha de Carnaval Ponto Cor: ombreira com fitas e pompons em luz dourada.'),
    piece('carnaval-micangas', 'Peça de Carnaval com pulseiras de miçangas, maquiagem colorida e composição em tons pastel.'),
    piece('carnaval-headpiece', 'Peça da coleção de headpieces: crochê multicolorido e tipografia editorial.'),
    piece('carnaval-brincos', 'Campanha de brincos de Carnaval com acessórios prateados e maquiagem azul.'),
    piece('carnaval-customizacao', 'Peça da campanha de customização de abadás Ponto Cor com ombreiras coloridas.'),
    piece('carnaval-acessorios', 'Peça de acessórios Ponto Cor com porta-squeeze de macramê sobre fundo laranja.'),
  ],
  colors: [
    { ...piece('cor-mirtilo', 'Peça de lançamento Ponto Cor com novelo em composição líquida com frutas.'), background: '#262347' },
    videoPiece('mirtilo-novelo', 'Trecho em vídeo: novelo de algodão girando em close-up sobre fundo terracota.', '#46231e'),
    videoPiece('mirtilo-artesanato', 'Trecho em vídeo: apresentação de peças tecidas à mão e sousplats artesanais.', '#1e1c1a'),
    videoPiece('mirtilo-bailarina', 'Trecho em vídeo: bailarina em movimento com faixa artesanal fluida.', '#202024'),
    videoPiece('mirtilo-armarinho', 'Trecho em vídeo: animação ilustrada no armarinho Ponto Cor com fitas e novelos.', '#2c1e18'),
  ],
  winter: [
    piece('inverno-cores', 'Capa da série As cores do inverno com novelos suspensos em uma espiral de cores.'),
    piece('inverno-vermelhos', 'Série de inverno Ponto Cor: novelos em vermelho, bordô e cereja.'),
    piece('inverno-azuis', 'Série de inverno Ponto Cor: novelos em azul-marinho, teal e azul acinzentado.'),
    piece('inverno-verdes', 'Série de inverno Ponto Cor: novelos em verde-oliva, floresta e musgo.'),
    piece('inverno-neutros', 'Série de inverno Ponto Cor: novelos em tons claros e naturais.'),
  ],
  selection: [
    piece('kit-bordado', 'Lançamento Kit Meu Primeiro Bordado: bastidor, fios e acessórios em composição clara.'),
    piece('bouquet', 'Peça Flores com todo amor: buquê de flores de crochê em embalagem de papel.'),
    piece('bolsa-croche', 'Peça de Dia das Mães com bolsa de crochê e a chamada Presentes para aquecer o coração.'),
    piece('manta', 'Peça de lançamento da manta de crochê em tom vinho, sobre uma poltrona clara.'),
    piece('inverno-teal', 'Peça de lançamento de cores com novelo teal e tipografia branca sobre fundo quente.'),
    piece('dia-mulheres', 'Campanha do Dia das Mulheres com mãos tecendo e a frase O mundo não vem pronto. É a gente que tece.'),
  ],
};
