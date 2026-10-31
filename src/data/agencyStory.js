export const AGENCY_STORY = {
  title: 'Ideias feitas para ecoar.',
  introduction: 'Somos a Comunicação Social Ag. Unimos estratégia, criatividade e tecnologia para transformar o que uma marca tem a dizer em algo que as pessoas queiram ouvir.',
  belief: 'Sua marca tem uma voz. Ela merece chegar mais longe.',
  manifesto: [
    'Antes de ocupar uma tela, uma marca precisa ocupar um lugar na vida de alguém. Ser percebida. Fazer sentido. Despertar uma escolha. É para construir esse lugar que a gente existe.',
    'Nosso símbolo começa com dois balões de conversa. Porque toda boa comunicação nasce de uma troca. Quando eles viram caixas de som, a ideia ganha corpo: escutar com atenção, encontrar a mensagem e colocá-la no mundo com potência.',
    'Amplificar é dar alcance ao que faz uma marca ser ela. Com clareza para ser entendida, personalidade para ser lembrada e consistência para construir valor.',
  ],
  about: 'Somos uma agência multidisciplinar, estratégica e criativa, em Poços de Caldas, Minas Gerais. Conectamos pensamento de marca, conteúdo, mídia e tecnologia em uma mesma direção. Do primeiro diagnóstico à experiência que chega às pessoas.',
  purpose: 'Colocar as ideias certas no mundo. Com potência, precisão e verdade.',
  purposeBody: 'Trabalhamos para que a comunicação aproxime marcas e pessoas, fortaleça reputações e abra caminhos de crescimento. A forma pode ser um filme, uma identidade, um site, uma campanha ou uma conversa. A escolha vem do que precisa acontecer.',
};

export const AGENCY_METHOD = [
  { title: 'Escutar.', question: 'O que a sua marca tem a dizer?', text: 'Mergulhamos no negócio, nas pessoas e no contexto. Entendemos o momento da marca, suas ambições e o que está impedindo a próxima mudança. Uma boa pergunta pode mudar todo o projeto.' },
  { title: 'Traduzir.', question: 'Como essa ideia ganha forma?', text: 'Transformamos o diagnóstico em direção. Posicionamento, conceito, linguagem e identidade passam a contar a mesma história. Cada palavra, imagem e interação precisa ter uma razão para existir.' },
  { title: 'Amplificar.', question: 'Onde a mensagem encontra as pessoas?', text: 'Conectamos criação, produção, mídia e tecnologia. Do feed à rua, da busca ao ponto de venda, escolhemos os meios pelo papel que cumprem na jornada. A marca mantém a sua essência em cada encontro.' },
  { title: 'Aprender.', question: 'O que a resposta do mundo nos ensina?', text: 'Acompanhamos sinais, ouvimos o retorno e colocamos os dados em contexto. Ajustamos a rota para que o trabalho evolua junto com o negócio. A entrega é o começo da próxima conversa.' },
];

export const AGENCY_DISCIPLINES = [
  { title: 'Estratégia', description: 'Posicionamento, planejamento e inteligência de marca. Uma direção clara para conectar o que o negócio precisa ao que as pessoas valorizam.' },
  { title: 'Criação', description: 'Identidades, campanhas, design, conteúdo e audiovisual. A mensagem encontra uma linguagem que pertence à marca.' },
  { title: 'Alcance', description: 'Mídia, busca, redes sociais e comunicação integrada. Da tela à rua, cada meio tem um papel na conversa.' },
  { title: 'Tecnologia', description: 'Sites, experiências digitais, IA e automação. Ferramentas escolhidas pelo que ajudam a resolver.' },
];

export const AGENCY_CLIENTS = ['Dr. Alberto Brasil', 'Dra. Lívia Esper', 'Rocca', 'Tiê'];

export const APPROACH_STORY = {
  title: 'Uma ideia. Uma direção.',
  introduction: 'A mensagem vem primeiro. A estratégia define o caminho. Criação, mídia e tecnologia trabalham juntas para levar a marca às pessoas e aprender com cada resposta.',
  belief: 'Antes de escolher o formato, entendemos o que precisa mudar. No negócio, na percepção da marca ou na relação com as pessoas.',
  body: 'Uma identidade, um filme, uma campanha, um site. Cada entrega nasce da mesma pergunta: qual é o papel desta comunicação? A resposta orienta o conceito, a linguagem, os canais e a forma de acompanhar o trabalho.',
  closing: 'TV, rádio, redes sociais, busca, ponto de venda, sites e novas plataformas. O repertório é amplo, mas a escolha é específica: usamos o que faz sentido para a marca, para as pessoas e para o objetivo do trabalho.',
};

export const APPROACH_PRINCIPLES = [
  { title: 'Clareza antes do volume.', text: 'Uma mensagem precisa ser entendida para ser lembrada. Procuramos o que importa e damos a isso uma forma precisa, reconhecível e coerente com a marca.' },
  { title: 'Responsabilidade em cada palavra.', text: 'A atenção especial à saúde exige cuidado com a informação. Esse compromisso com potência, precisão e verdade orienta nossa comunicação em todos os setores.' },
  { title: 'Dados com contexto.', text: 'Definimos o que acompanhar a partir do objetivo. Interpretamos os sinais, ouvimos as pessoas e usamos o aprendizado para orientar as próximas escolhas.' },
];

// Apenas peças identificáveis no acervo fornecido. Casos completos virão
// cliente a cliente; trabalhos anteriores mantêm atribuição explícita.
export const AGENCY_CAMPAIGNS = [
  { id: 'alberto', client: 'Dr. Alberto Brasil', category: 'Identidade visual', image: '/assets/work/alberto.webp', background: '#e6e6e6', fit: 'cover' },
  { id: 'rocca', client: 'Rocca', category: 'Fotografia de produto', image: '/assets/work/rocca.webp', background: '#151713', fit: 'cover' },
  { id: 'livia', client: 'Dra. Lívia Esper', category: 'Identidade visual', image: '/assets/work/livia.webp', background: '#dfa1bf', fit: 'cover' },
  { id: 'tie', client: 'Tiê', category: 'Fotografia de produto', image: '/assets/agency/tie.webp', background: '#21180d', fit: 'cover' },
  { id: 'alberto-digital', client: 'Dr. Alberto Brasil', category: 'Presença digital', image: '/assets/agency/alberto-digital.webp', background: '#fff', fit: 'contain' },
  { id: 'unibanco', client: 'Unibanco', category: 'Campanha de incentivo', image: '/assets/work/unibanco.webp', background: '#e8e5df', fit: 'contain', source: 'Acervo profissional de Bruno Garcia' },
  { id: 'natal', client: 'Campanha de Natal', category: 'Peça de comunicação', image: '/assets/agency/natal.webp', background: '#0e0e0e', fit: 'contain' },
  { id: 'unibanco-guardiao', client: 'Unibanco', category: 'Comunicação interna', image: '/assets/agency/unibanco-guardiao.webp', background: '#e6e3db', fit: 'contain', source: 'Acervo profissional de Bruno Garcia' },
];
