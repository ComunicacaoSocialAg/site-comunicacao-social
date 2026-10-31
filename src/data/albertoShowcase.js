const base = '/assets/cases/alberto/';

export const ALBERTO_CASE = {
  id: 'alberto-brasil', client: 'Dr. Alberto Brasil',
  title: 'A confiança ganha forma.', category: 'Presença digital & experiência web',
  accent: '#b4b0a4', image: `${base}portrait-suit.webp`,
  description: 'Direção de arte, conteúdo e experiência web para a presença digital do Dr. Alberto Brasil, cirurgião vascular em Poços de Caldas.',
  challenge: 'Traduzir a identidade de um profissional de saúde em uma comunicação reconhecível, clara e consistente.',
  thinking: 'A confiança também se constrói na forma de apresentar. Da primeira publicação à navegação no site, cada ponto de contato precisa falar a mesma língua.',
  closing: 'Estratégia, design, conteúdo e tecnologia. Uma mesma direção para a presença digital.',
};

export const ALBERTO_MEDIA = {
  base,
  posts: [
    { src: `${base}post-viagem.webp`, alt: 'Peça do Dr. Alberto Brasil: composição editorial com janela de avião e tipografia condensada.' },
    { src: `${base}post-treino.webp`, alt: 'Peça do Dr. Alberto Brasil: direção de arte com fotografia de treino e contraste tipográfico.' },
    { src: `${base}post-calor.webp`, alt: 'Peça do Dr. Alberto Brasil: fotografia em luz dourada e composição sobre o verão.' },
    { src: `${base}post-veia.webp`, alt: 'Peça do Dr. Alberto Brasil: fotografia, monograma e composição em tons neutros.' },
    { src: `${base}post-hormonios.webp`, alt: 'Peça do Dr. Alberto Brasil: fundo grafite, monograma e hierarquia de informação.' },
    { src: `${base}post-pele.webp`, alt: 'Peça do Dr. Alberto Brasil: fotografia de detalhe e composição tipográfica.' },
  ],
};
