import { renderToStaticMarkup } from 'react-dom/server';
import { MotionConfig } from 'motion/react';
import CinematicHome from './components/cinematic/CinematicHome.jsx';
import AgencyPage from './pages/AgencyPage.jsx';
import ApproachPage from './pages/ApproachPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import ProjectPage from './components/ProjectPage.jsx';
import ListSidebar from './components/ListSidebar.jsx';
import { PROJECTS } from './data/projects.js';

// Os mesmos componentes entregam a mesma copy no HTML e na experiência interativa.
export function renderPage(page) {
  let component;
  if (page.project) component = <ProjectPage project={page.project} allProjects={PROJECTS} />;
  else if (page.path === '/') component = <div className="scroll-container"><CinematicHome introActive={false} soundEnabled={false} /></div>;
  else if (page.path === '/agencia') component = <AgencyPage />;
  else if (page.path === '/abordagem') component = <ApproachPage />;
  else if (page.path === '/contato') component = <ContactPage />;
  else if (page.path === '/trabalhos') component = <ListSidebar activeCategory="all" soundEnabled={false} />;
  else component = <main className="page-editorial-root"><h1>Página não encontrada</h1><a href="/">Comunicação Social Ag</a></main>;
  const markup = renderToStaticMarkup(<MotionConfig reducedMotion="always">{component}</MotionConfig>);
  // O HTML sem JavaScript fica legível, sem os estados de entrada do Motion.
  return markup.replace(/style="([^"]*)"/g, (attribute, styles) => `style="${styles.replace(/(?:^|;)opacity:0(?=;|$)/g, ';opacity:1').replace(/(?:^|;)transform:[^;]*/g, '')}"`);
}
