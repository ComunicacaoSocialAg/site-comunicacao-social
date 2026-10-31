import { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { PROJECTS, projectMatchesCategory } from './data/projects';
import {
  playClickSound,
  playTransitionSound,
} from './utils/audio';
import { getAudioContext } from './utils/speakerAudio';
import { shouldShowIntro } from './data/brandIntro';
import ErrorBoundary from './components/ErrorBoundary';
import BrandIntro from './components/BrandIntro';
import CinematicHome from './components/cinematic/CinematicHome';
import HUD from './components/HUD';
const ProjectPage = lazy(() => import('./components/ProjectPage'));
const ListSidebar = lazy(() => import('./components/ListSidebar'));
const InstitutionalModal = lazy(() => import('./components/InstitutionalModal'));
import WhatsAppFloatButton from './components/WhatsAppFloatButton';
const AgencyPage = lazy(() => import('./pages/AgencyPage'));
const ApproachPage = lazy(() => import('./pages/ApproachPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
import { updatePageSeo } from './data/seo.js';

// ─── URL ROUTING PARSER ────────────────────────────────────────────────────────
function parseCurrentUrl() {
  if (typeof window === 'undefined') return { route: '/', caseId: null };
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  const searchParams = new URLSearchParams(window.location.search);
  const caseQuery = searchParams.get('case');

  if (path === '/agencia') return { route: '/agencia', caseId: null };
  if (path === '/abordagem') return { route: '/abordagem', caseId: null };
  if (path === '/contato') return { route: '/contato', caseId: null };
  if (path === '/trabalhos') return { route: '/trabalhos', caseId: null };
  if (path.startsWith('/trabalhos/')) {
    const slug = path.replace('/trabalhos/', '');
    return { route: '/trabalhos/:slug', caseId: slug };
  }
  if (caseQuery) {
    return { route: '/trabalhos/:slug', caseId: caseQuery };
  }
  return { route: path === '/' ? '/' : '/404', caseId: null };
}

export default function App() {
  const initialNav = parseCurrentUrl();
  const initialProject = initialNav.caseId
    ? PROJECTS.find((p) => p.id === initialNav.caseId) || null
    : null;

  // Direct subpage or case landings skip the initial intro
  const isDirectLanding = Boolean(initialNav.route !== '/' || initialProject);

  const [stage, setStage] = useState(() => {
    return shouldShowIntro({
      directLanding: isDirectLanding,
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    }) ? 'intro' : 'interactive';
  });
  const [currentRoute, setCurrentRoute] = useState(initialNav.caseId && !initialProject ? '/404' : initialNav.route);
  const [activeSection, setActiveSection] = useState('hero');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeProj, setActiveProj] = useState(initialProject);
  const [caseOrigin, setCaseOrigin] = useState(null);
  const [showList, setShowList] = useState(initialNav.route === '/trabalhos');
  const [showInstitutional, setShowInstitutional] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const isClientCase = Boolean(activeProj?.caseStudy);

  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const path = currentRoute === '/trabalhos/:slug' && activeProj ? `/trabalhos/${activeProj.id}` : currentRoute;
    updatePageSeo(path);
  }, [currentRoute, activeProj]);

  // Pré-carrega o chunk do ProjectPage para transições instantâneas ao clicar
  useEffect(() => {
    import('./components/ProjectPage');
  }, []);

  // Resume Web Audio Context on first user touch / pointerdown (iOS/Safari compliance)
  useEffect(() => {
    const unlockAudio = () => {
      getAudioContext();
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
    window.addEventListener('pointerdown', unlockAudio, { passive: true, once: true });
    window.addEventListener('touchstart', unlockAudio, { passive: true, once: true });
    window.addEventListener('keydown', unlockAudio, { passive: true, once: true });
    return () => {
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
  }, []);

  // Sync state with browser navigation (Back / Forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      const { route, caseId } = parseCurrentUrl();
      setCurrentRoute(caseId && !PROJECTS.some((project) => project.id === caseId) ? '/404' : route);
      if (route === '/agencia') {
        setActiveProj(null);
        setShowList(false);
        setShowInstitutional(false);
      } else if (route === '/abordagem') {
        setActiveProj(null);
        setShowList(false);
        setShowInstitutional(false);
      } else if (route === '/contato') {
        setActiveProj(null);
        setShowList(false);
        setShowInstitutional(false);
      } else if (route === '/trabalhos') {
        setActiveProj(null);
        setShowList(true);
        setShowInstitutional(false);
      } else if (caseId) {
        const found = PROJECTS.find((p) => p.id === caseId);
        setActiveProj(found || null);
        setShowList(false);
        setShowInstitutional(false);
      } else {
        // Home
        setActiveProj(null);
        setShowList(false);
        setShowInstitutional(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Programmatic client navigation with URL sync
  const navigateTo = useCallback((targetRoute, proj = null) => {
    playClickSound(soundEnabled);
    setCurrentRoute(targetRoute);

    if (targetRoute === '/trabalhos/:slug' && proj) {
      setActiveProj(proj);
      setShowList(false);
      setShowInstitutional(false);
      window.history.pushState({ route: targetRoute, slug: proj.id }, '', `/trabalhos/${proj.id}`);
    } else if (targetRoute === '/agencia') {
      setActiveProj(null);
      setShowList(false);
      setShowInstitutional(false);
      window.history.pushState({ route: '/agencia' }, '', '/agencia');
    } else if (targetRoute === '/abordagem') {
      setActiveProj(null);
      setShowList(false);
      setShowInstitutional(false);
      window.history.pushState({ route: '/abordagem' }, '', '/abordagem');
    } else if (targetRoute === '/contato') {
      setActiveProj(null);
      setShowList(false);
      setShowInstitutional(false);
      window.history.pushState({ route: '/contato' }, '', '/contato');
    } else if (targetRoute === '/trabalhos') {
      setActiveProj(null);
      setShowList(true);
      setShowInstitutional(false);
      window.history.pushState({ route: '/trabalhos' }, '', '/trabalhos');
    } else {
      // Home /
      setActiveProj(null);
      setShowList(false);
      setShowInstitutional(false);
      window.history.pushState({ route: '/' }, '', '/');
    }
  }, [soundEnabled]);

  // Smooth scroll to a named section on Home
  const scrollToSection = useCallback((sectionId) => {
    playClickSound(soundEnabled);
    if (currentRoute !== '/') {
      navigateTo('/');
      setTimeout(() => {
        const el = scrollContainerRef.current?.querySelector('#' + sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
      return;
    }

    const el = scrollContainerRef.current?.querySelector('#' + sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentRoute, navigateTo, soundEnabled]);

  // Scroll listener to update 3D speaker target configuration
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const sections = [
      { id: 'hero', key: 'hero' },
      { id: 'agencia', key: 'agency' },
      { id: 'abordagem', key: 'approach' },
      { id: 'servicos', key: 'services' },
      { id: 'projetos', key: 'projects' },
      { id: 'contato', key: 'contact' },
    ];

    const scrollTop = container.scrollTop;
    const viewportHeight = container.clientHeight;
    const scrollHeight = container.scrollHeight;

    // Fast boundary checks for top and bottom limits
    if (scrollTop < 80) {
      setActiveSection((prev) => (prev !== 'hero' ? 'hero' : prev));
      return;
    }
    if (scrollTop + viewportHeight >= scrollHeight - 60) {
      setActiveSection((prev) => (prev !== 'contact' ? 'contact' : prev));
      return;
    }

    const focusPoint = scrollTop + viewportHeight * 0.45;

    for (const sec of sections) {
      const el = container.querySelector('#' + sec.id);
      if (el) {
        const top = el.offsetTop;
        const height = el.offsetHeight;
        if (focusPoint >= top && focusPoint < top + height) {
          setActiveSection((prev) => (prev !== sec.key ? sec.key : prev));
          break;
        }
      }
    }
  }, []);

  // A imagem final ocupa o mesmo lugar na abertura e na primeira tela.
  const handleIntroComplete = useCallback((reason) => {
    setStage('interactive');
    if (reason === 'skip') {
      requestAnimationFrame(() => {
        document.querySelector('.film-home h1')?.focus({ preventScroll: true });
      });
    }
  }, []);

  // Replay Intro on Demand
  const handleReplayIntro = useCallback(() => {
    playClickSound(soundEnabled);
    if (currentRoute !== '/') {
      navigateTo('/');
    }
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'instant' });
    setStage('intro');
  }, [soundEnabled, currentRoute, navigateTo]);

  // Toggle global audio
  const handleToggleSound = useCallback(() => {
    setSoundEnabled((prev) => !prev);
  }, []);

  // Click on a project item → open ProjectPage
  const handleProjectSelect = useCallback((proj) => {
    playClickSound(soundEnabled);
    playTransitionSound(soundEnabled);
    navigateTo('/trabalhos/:slug', proj);
  }, [soundEnabled, navigateTo]);

  const openHomeCase = useCallback((href, trigger, event, directWork = null) => {
    let project = href ? PROJECTS.find(item => `/trabalhos/${item.id}` === href) : null;
    if (!project && directWork) {
      project = PROJECTS.find(item => item.id === directWork.id) || directWork;
    }
    if (!project) return;

    const rect = trigger?.getBoundingClientRect();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (rect) {
      const clickX = event?.clientX ?? (rect.left + rect.width / 2);
      const clickY = event?.clientY ?? (rect.top + rect.height / 2);
      const originX = `${((clickX / window.innerWidth) * 100).toFixed(2)}%`;
      const originY = `${((clickY / window.innerHeight) * 100).toFixed(2)}%`;

      const clipClosed = `inset(${Math.max(0, Math.round(rect.top))}px ${Math.max(0, Math.round(window.innerWidth - rect.right))}px ${Math.max(0, Math.round(window.innerHeight - rect.bottom))}px ${Math.max(0, Math.round(rect.left))}px round 16px)`;
      const clipOpen = 'inset(0px 0px 0px 0px round 0px)';

      setCaseOrigin({
        trigger,
        reduced,
        origin: `${originX} ${originY}`,
        clipClosed,
        clipOpen,
      });
    } else {
      setCaseOrigin(null);
    }

    navigateTo('/trabalhos/:slug', project);
  }, [navigateTo]);

  // Close project page → back to home
  const handleCloseProject = useCallback(() => {
    navigateTo('/');
  }, [navigateTo]);

  // Tecla Escape para fechar o case aberto
  useEffect(() => {
    if (!activeProj) return;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleCloseProject();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeProj, handleCloseProject]);

  const filteredCount = activeCategory === 'all'
    ? PROJECTS.length
    : PROJECTS.filter((p) => projectMatchesCategory(p, activeCategory)).length;

  return (
    <ErrorBoundary>
      <Suspense fallback={null}>
      <div className="root" data-intro-active={stage === 'intro'}>
        {/* Cinematic Film Grain Overlay */}
        {!isClientCase && currentRoute !== '/' && currentRoute !== '/agencia' && currentRoute !== '/abordagem' && <div className="cinema-grain" aria-hidden="true" />}

        {/* Floating WhatsApp CTA Button */}
        {!isClientCase && stage === 'interactive' && currentRoute !== '/' && currentRoute !== '/contato' && currentRoute !== '/agencia' && currentRoute !== '/abordagem' && (
          <WhatsAppFloatButton soundEnabled={soundEnabled} />
        )}

        {/* Abertura de marca com passagem contínua para a primeira tela. */}
        {stage === 'intro' && (
          <BrandIntro onComplete={handleIntroComplete} />
        )}

        {/* O conteúdo carrega durante a abertura e recebe foco só ao terminar. */}
        <div className="interactive-stage" inert={stage === 'intro'} aria-hidden={stage === 'intro' ? true : undefined}>
            {/* Navigation Floating Island */}
            {!isClientCase && currentRoute !== '/' && currentRoute !== '/agencia' && currentRoute !== '/abordagem' && <HUD
              activeSection={activeSection}
              soundEnabled={soundEnabled}
              onToggleSound={handleToggleSound}
              filteredCount={filteredCount}
              onList={() => {
                playClickSound(soundEnabled);
                setShowList(true);
              }}
              onInstitutional={() => {
                playClickSound(soundEnabled);
                setShowInstitutional(true);
              }}
              onAgency={() => navigateTo('/agencia')}
              onApproach={() => navigateTo('/abordagem')}
              onContact={() => scrollToSection('contato')}
              onReplayIntro={handleReplayIntro}
            />}

            {/* Main Vertical Scroll Container with Home3D */}
            {(currentRoute === '/' || caseOrigin) && (
              <div
                ref={scrollContainerRef}
                className="scroll-container"
                onScroll={handleScroll}
                inert={Boolean(activeProj)}
                aria-hidden={activeProj ? true : undefined}
                style={activeProj ? { overflow: 'hidden' } : undefined}
              >
                <CinematicHome
                  introActive={stage === 'intro'}
                  onReplayIntro={handleReplayIntro}
                  soundEnabled={soundEnabled}
                  onToggleSound={handleToggleSound}
                  onOpenCase={openHomeCase}
                />
              </div>
            )}

            {currentRoute === '/404' && <main className="page-editorial-root"><h1>Página não encontrada</h1><a href="/">Comunicação Social Ag</a></main>}

            {/* Dedicated Agency Page Route (/agencia) */}
            <AnimatePresence mode="wait">
              {currentRoute === '/agencia' && !activeProj && (
                <AgencyPage
                  onBack={() => navigateTo('/')}
                  onNavigateAbout={navigateTo}
                />
              )}
            </AnimatePresence>

            {/* Dedicated Approach Page Route (/abordagem) */}
            <AnimatePresence mode="wait">
              {currentRoute === '/abordagem' && !activeProj && (
                <ApproachPage
                  onBack={() => navigateTo('/')}
                  onNavigateAbout={navigateTo}
                />
              )}
            </AnimatePresence>

            {/* Dedicated Contact Page Route (/contato) */}
            <AnimatePresence mode="wait">
              {currentRoute === '/contato' && !activeProj && (
                <ContactPage
                  onBack={() => navigateTo('/')}
                  onNavigateWork={() => {
                    setShowList(true);
                    navigateTo('/trabalhos');
                  }}
                  soundEnabled={soundEnabled}
                />
              )}
            </AnimatePresence>

            {/* Case Study Detailed View with AnimatePresence */}
            <AnimatePresence mode="wait" onExitComplete={() => {
              if (currentRoute === '/') caseOrigin?.trigger?.focus({ preventScroll: true });
              setCaseOrigin(null);
            }}>
              {activeProj && (
                <motion.div
                  key={activeProj.id}
                  data-case-viewport
                  tabIndex={-1}
                  role="region"
                  aria-label={`Case ${activeProj.client || activeProj.title}`}
                  style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 600,
                    background: '#070709',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    transformOrigin: caseOrigin?.origin || '50% 50%',
                    willChange: 'clip-path, transform, opacity',
                  }}
                  initial={caseOrigin && !caseOrigin.reduced ? {
                    clipPath: caseOrigin.clipClosed,
                    scale: 0.94,
                    opacity: 0.95,
                  } : {
                    opacity: 0,
                  }}
                  animate={{
                    clipPath: caseOrigin?.clipOpen || 'inset(0px 0px 0px 0px round 0px)',
                    scale: 1,
                    opacity: 1,
                  }}
                  exit={caseOrigin && !caseOrigin.reduced ? {
                    clipPath: caseOrigin.clipClosed,
                    scale: 0.94,
                    opacity: 0,
                  } : {
                    opacity: 0,
                  }}
                  transition={{
                    duration: caseOrigin?.reduced ? 0 : 0.52,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  onAnimationComplete={() => {
                    if (activeProj) document.querySelector('[data-case-viewport]')?.focus({ preventScroll: true });
                  }}
                >
                  <ProjectPage
                    key={activeProj.id}
                    project={activeProj}
                    allProjects={PROJECTS}
                    onClose={handleCloseProject}
                    onNavigate={(p) => navigateTo('/trabalhos/:slug', p)}
                    onContact={() => navigateTo('/contato')}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sidebar Drawer (Portfolio Catalog) with AnimatePresence */}
            <AnimatePresence>
              {showList && (
                <ListSidebar
                  activeCategory={activeCategory}
                  onSelectCategory={setActiveCategory}
                  soundEnabled={soundEnabled}
                  onClose={() => {
                    playClickSound(soundEnabled);
                    setShowList(false);
                    if (currentRoute === '/trabalhos') {
                      navigateTo('/');
                    }
                  }}
                  onSelect={(p) => {
                    setShowList(false);
                    handleProjectSelect(p);
                  }}
                />
              )}
            </AnimatePresence>

            {/* Institutional Modal (Serviços & Hub Saúde) with AnimatePresence */}
            <AnimatePresence>
              {showInstitutional && (
                <InstitutionalModal
                  isOpen={showInstitutional}
                  onClose={() => {
                    playClickSound(soundEnabled);
                    setShowInstitutional(false);
                  }}
                  soundEnabled={soundEnabled}
                  onSelectCase={(caseId) => {
                    const found = PROJECTS.find((p) => p.id === caseId);
                    if (found) {
                      setShowInstitutional(false);
                      handleProjectSelect(found);
                    }
                  }}
                />
              )}
            </AnimatePresence>
        </div>
      </div>
          </Suspense>
    </ErrorBoundary>
  );
}
