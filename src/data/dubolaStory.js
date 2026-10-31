// Isolated case content: shared home/project data is deliberately unchanged.
const base = '/assets/cases/dubola/';
const asset = (name) => `${base}story/${name}`;
export const DUBOLA_STORY = {
  film: { src: asset('filme-dubola.mp4'), poster: asset('filme-poster.webp'), title: 'Dubola: da ideia ao encontro' },
  signature: asset('signature.webp'),
  label: { src: asset('label.webp'), alt: 'Arte do rótulo de ketchup com goiaba Dubola, com lettering vermelho e ilustrações dos ingredientes.', caption: 'O desenho começa no detalhe. Arte de rótulo.' },
  packaging: { src: asset('ketchups.webp'), alt: 'Mockup das embalagens de ketchup tradicional, com goiaba e picante, com um sistema de rótulos em vermelho, rosa e bordô.', caption: 'Uma linguagem em três sabores. Mockups de embalagem.' },
  families: [
    { src: asset('maioneses.webp'), alt: 'Mockup de quatro maioneses Dubola em bisnaga com cores diferentes nos rótulos.', caption: 'Maioneses', note: 'Cor para diferenciar. Identidade para reunir.', className: 'db-family-mayo' },
    { src: `${base}mostarda-dijon.webp`, alt: 'Mockup da mostarda Dijon Dubola com rótulo dourado.', caption: 'Mostardas', note: 'O mesmo repertório em outra personalidade.', className: 'db-family-mustard' },
    { src: asset('tomates.webp'), alt: 'Mockup de três molhos de tomate Dubola em potes de vidro com rótulos de cores diferentes.', caption: 'Molhos de tomate', note: 'Novos formatos. A mesma marca.', className: 'db-family-tomato' },
  ],
  commercial: [
    { id: 'catalogo', label: 'Catálogos e apresentações', title: 'Design que organiza a conversa.', body: 'Conceito, portfólio e argumentos de marca ganham uma sequência de leitura. Catálogos impressos, materiais digitais e apresentações fazem parte dessa construção comercial.', image: `${base}catalogo-jeito-dubola.webp`, alt: 'Prancha O Jeito Dubola de Ser, do material de apresentação da marca.', caption: 'Prancha da apresentação digital. Conceito e argumentos de marca.' },
    { id: 'landing', label: 'Landing page', title: 'A apresentação continua na tela.', body: 'Uma experiência própria para apresentar os molhos, organizar as linhas de produto e abrir a conversa com quem compra. A linguagem da embalagem acompanha o percurso digital.', image: asset('landing.webp'), alt: 'Captura real de dubola.com.br com a linha de ketchup, a assinatura Como deve ser e os acessos ao catálogo e ao atendimento.', caption: 'Landing page Dubola. Captura do site em outubro de 2026.', href: 'https://dubola.com.br/' },
    { id: 'campanha', label: 'Conceitos e campanhas', title: 'O produto dá origem à imagem.', body: 'Ingredientes, embalagens e composições gastronômicas formam o repertório das peças. A direção de arte conecta a apresentação do produto aos diferentes formatos de comunicação.', image: `${base}barbecue-brasa.webp`, alt: 'Composição publicitária da linha Barbecue Dubola com bisnagas, bag food service, madeira e fogo ao fundo.', caption: 'Composição publicitária da linha Barbecue.' },
  ],
  applications: [
    { src: asset('avental.webp'), alt: 'Mockup de avental preto Dubola em uma cozinha com bancada de madeira e luz lateral.', caption: 'Quem representa a marca também a veste.', label: 'Avental', note: 'Design de uniforme. Mockup de aplicação.', shape: 'wide' },
    { src: asset('bandana.webp'), alt: 'Mockup de bandana preta Dubola com logo e assinatura Como deve ser em vermelho.', caption: 'O cuidado continua nos detalhes.', label: 'Bandana', note: 'Design de uniforme. Mockup de aplicação.', shape: 'portrait' },
    { src: asset('windbanner.webp'), alt: 'Mockup de windbanner Dubola, com frente e verso completos, haste e base.', caption: 'Uma identidade que ocupa o espaço.', label: 'Windbanner', note: 'Sinalização. Mockup de frente e verso.', shape: 'banner' },
    { src: asset('sacola.webp'), alt: 'Mockup de saco de papel Dubola sobre bancada, com tomates ilustrados e assinatura da marca.', caption: 'A experiência acompanha o produto.', label: 'Saco de papel', note: 'Merchandising. Mockup de aplicação.', shape: 'square' },
    { src: asset('pano.webp'), alt: 'Mockup de pano de prato com tomates ilustrados, logo Dubola e assinatura Como deve ser em uma cozinha.', caption: 'A marca encontra lugar na rotina.', label: 'Pano de prato', note: 'Material promocional. Mockup de aplicação.', shape: 'wide' },
    { src: asset('camiseta.webp'), alt: 'Mockup de camiseta preta Dubola, frente e costas, com logo, assinatura e aplicação Sequoia na manga.', caption: 'Uma linguagem para toda a equipe.', label: 'Camiseta', note: 'Design de uniforme. Mockup de frente e costas.', shape: 'portrait' },
    { src: asset('display.webp'), alt: 'Mockup de display de balcão Dubola, com três níveis e painel ilustrado de ketchups.', caption: 'O ponto de contato também comunica.', label: 'Display', note: 'Material de promoção. Mockup de aplicação.', shape: 'display' },
  ],
  event: { src: asset('encontro.mp4'), poster: asset('encontro-poster.webp') },
  eventPhoto: { src: asset('evento.webp'), alt: 'Registro noturno do Churrasqueadas, com público diante da estação identificada como Chef Bola.', caption: 'Churrasqueadas. Registro do acervo da Dubola.' },
};
