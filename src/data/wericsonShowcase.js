const assets = '/assets/cases/wericson-martins';

const screen = (file, alt, mobile = false) => ({
  src: `${assets}/${file}.webp`,
  alt,
  width: mobile ? 390 : 1280,
  height: mobile ? 844 : 720,
});

export const WERICSON_SCREENS = {
  dashboard: {
    ...screen('dashboard-desktop', 'Painel geral do consultório no computador, com atendimentos, honorários, registros e pendências.'),
    srcSet: `${assets}/dashboard-desktop-small.webp 680w, ${assets}/dashboard-desktop.webp 1280w`,
    sizes: '(max-width: 800px) 76vw, (max-width: 1440px) 63vw, 910px',
  },
  dashboardMobile: screen('dashboard-mobile', 'Painel geral no celular, com atalhos e navegação na parte inferior da tela.', true),
  agenda: screen('agenda-desktop', 'Agenda no computador, com filtros, opções de visualização e sessões do dia.'),
  agendaMobile: screen('agenda-mobile', 'Agenda no celular com filtros e a lista de sessões.', true),
  intake: screen('intake-mobile', 'Ficha de acolhimento no celular, com campos para solicitar atendimento preliminar.', true),
  login: screen('login-desktop', 'Tela de acesso profissional do consultório com opção de entrar com Google.'),
  loginMobile: screen('login-mobile', 'Tela de acesso profissional com Google na versão mobile.', true),
  lock: screen('lock-desktop', 'Tela bloqueada no computador com teclado para digitar o PIN.'),
  lockMobile: screen('lock-mobile', 'Tela de bloqueio por PIN na versão mobile.', true),
};

export const WERICSON_CASE = {
  id: 'wericson-martins',
  client: 'Wericson Martins',
  title: 'O consultório em foco',
  category: 'Identidade digital e software de gestão clínica',
  accent: '#512e3e',
  image: WERICSON_SCREENS.dashboard.src,
  logo: `${assets}/monograma-wm.svg`,
  description: 'Identidade digital e sistema de gestão sob medida para a prática psicanalítica de Wericson Martins, do acolhimento à agenda e à supervisão clínica.',
};
