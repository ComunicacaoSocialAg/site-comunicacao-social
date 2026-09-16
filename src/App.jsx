import React, { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { motion, AnimatePresence } from 'motion/react';
import { PROJECTS, CATEGORIES, projectMatchesCategory } from './data/projects';
import {
  playHoverSound,
  playClickSound,
  playTransitionSound,
  playBigBangAudio
} from './utils/audio';
import {
  trackCaseView,
  trackCategoryFilter
} from './utils/analytics';
import ErrorBoundary from './components/ErrorBoundary';
import MagneticCursor from './components/MagneticCursor';
import MatchCutIntro from './components/MatchCutIntro';
import KineticPreloader from './components/KineticPreloader';
import IntroVideo from './components/IntroVideo';
import SphereGallery from './components/SphereGallery';
import HUD from './components/HUD';
import ProjectPage from './components/ProjectPage';
import ListSidebar from './components/ListSidebar';
import InstitutionalModal from './components/InstitutionalModal';
import WhatsAppFloatButton from './components/WhatsAppFloatButton';
import AgencyPage from './pages/AgencyPage';
import ApproachPage from './pages/ApproachPage';
import ContactPage from './pages/ContactPage';

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
  return { route: '/', caseId: null };
}

export default function App() {
  const initialNav = parseCurrentUrl();
  const initialProject = initialNav.caseId
    ? PROJECTS.find(p => p.id === initialNav.caseId) || null
    : null;

  // Direct subpage or case landings skip the initial match-cut intro
  const isDirectLanding = Boolean(
    initialNav.route !== '/' || initialProject
  );

  const [stage, setStage] = useState(isDirectLanding ? 'gallery' : 'matchcut');
  const [currentRoute, setCurrentRoute] = useState(initialNav.route);
  const [activeCategory, setActiveCategory] = useState('all');
  const [hovered, setHovered] = useState(null);
  const [activeProj, setActiveProj] = useState(initialProject);
  const [showList, setShowList] = useState(initialNav.route === '/trabalhos');
  const [showInstitutional, setShowInstitutional] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [genesisCount, setGenesisCount] = useState(0);
  const [cursorState, setCursorState] = useState({ isHovered: false, isDragging: false, text: 'ARRASTAR' });

  const flashRef = useRef(null);
  const overlayRef = useRef(null);

  // Sync state with browser navigation (Back / Forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      const { route, caseId } = parseCurrentUrl();
      setCurrentRoute(route);
      if (route === '/agencia') {
        setActiveProj(null);
        setShowList(false);
        setShowInstitutional(false);
        document.title = 'A Agência — Comunicação Social Ag';
      } else if (route === '/abordagem') {
        setActiveProj(null);
        setShowList(false);
        setShowInstitutional(false);
        document.title = 'Nossa Abordagem: Escutar · Traduzir · Amplificar — Comunicação Social Ag';
      } else if (route === '/contato') {
        setActiveProj(null);
        setShowList(false);
        setShowInstitutional(false);
        document.title = 'Fale Conosco — Comunicação Social Ag';
      } else if (route === '/trabalhos') {
        setActiveProj(null);
        setShowList(true);
        setShowInstitutional(false);
        document.title = 'Trabalhos & Cases — Comunicação Social Ag';
      } else if (caseId) {
        const found = PROJECTS.find(p => p.id === caseId);
        setActiveProj(found || null);
        setShowList(false);
        setShowInstitutional(false);
        if (found) {
          document.title = `${found.title} · ${found.category} — Comunicação Social Ag`;
        }
      } else {
        // Home
        setActiveProj(null);
        setShowList(false);
        setShowInstitutional(false);
        document.title = 'Comunicação Social Ag — Estratégia · Criatividade · Tecnologia';
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
      document.title = `${proj.title} · ${proj.category} — Comunicação Social Ag`;
    } else if (targetRoute === '/agencia') {
      setActiveProj(null);
      setShowList(false);
      setShowInstitutional(false);
      window.history.pushState({ route: '/agencia' }, '', '/agencia');
      document.title = 'A Agência — Comunicação Social Ag';
    } else if (targetRoute === '/abordagem') {
      setActiveProj(null);
      setShowList(false);
      setShowInstitutional(false);
      window.history.pushState({ route: '/abordagem' }, '', '/abordagem');
      document.title = 'Nossa Abordagem: Escutar · Traduzir · Amplificar — Comunicação Social Ag';
    } else if (targetRoute === '/contato') {
      setActiveProj(null);
      setShowList(false);
      setShowInstitutional(false);
      window.history.pushState({ route: '/contato' }, '', '/contato');
      document.title = 'Fale Conosco — Comunicação Social Ag';
    } else if (targetRoute === '/trabalhos') {
      setActiveProj(null);
      setShowList(true);
      setShowInstitutional(false);
      window.history.pushState({ route: '/trabalhos' }, '', '/trabalhos');
      document.title = 'Trabalhos & Cases — Comunicação Social Ag';
    } else {
      // Home /
      setActiveProj(null);
      setShowList(false);
      setShowInstitutional(false);
      window.history.pushState({ route: '/' }, '', '/');
      document.title = 'Comunicação Social Ag — Estratégia · Criatividade · Tecnologia';
    }
  }, [soundEnabled]);

  // Handle Match-Cut completion → Big Bang flash and transition to 3D sphere
  const handleMatchCutComplete = useCallback(() => {
    playBigBangAudio(soundEnabled);
    const flash = flashRef.current;
    if (flash) {
      gsap.fromTo(flash,
        { opacity: 1, scale: 1 },
        { opacity: 0, duration: 1.8, ease: 'power3.out' }
      );
    }
    setGenesisCount(c => c + 1);
    setStage('gallery');
  }, [soundEnabled]);

  // Handle Fallback Preloader completion
  const handlePreloaderComplete = useCallback(() => {
    setStage('gallery');
  }, []);

  // Handle Intro Video completion
  const handleIntroComplete = useCallback(() => {
    setStage('gallery');
  }, []);

  // Replay Intro on Demand
  const handleReplayIntro = useCallback(() => {
    playClickSound(soundEnabled);
    navigateTo('/');
    setStage('matchcut');
  }, [soundEnabled, navigateTo]);

  // Toggle global audio
  const handleToggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev);
  }, []);

  // Cursor updates
  const handleCursorChange = useCallback((newState) => {
    setCursorState(prev => ({ ...prev, ...newState }));
  }, []);

  // Hover over 3D sphere item
  const handleHover = useCallback((proj) => {
    setHovered(proj);
    if (proj) {
      playHoverSound(soundEnabled);
    }
  }, [soundEnabled]);

  // Click on a project item → smooth transition overlay + open ProjectPage
  const handleProjectSelect = useCallback((proj) => {
    playClickSound(soundEnabled);
    playTransitionSound(soundEnabled);

    const overlay = overlayRef.current;
    if (!overlay) {
      navigateTo('/trabalhos/:slug', proj);
      return;
    }

    gsap.to(overlay, {
      opacity: 1,
      duration: 0.35,
      ease: 'power2.in',
      onComplete: () => {
        navigateTo('/trabalhos/:slug', proj);
        gsap.to(overlay, { opacity: 0, duration: 0.4, ease: 'power2.out', delay: 0.1 });
      },
    });
  }, [soundEnabled, navigateTo]);

  // Close project page → back to home / 3D sphere
  const handleCloseProject = useCallback(() => {
    navigateTo('/');
  }, [navigateTo]);

  // Navigate between project cases
  const handleNavigateProjects = useCallback((proj) => {
    navigateTo('/trabalhos/:slug', proj);
  }, [navigateTo]);

  // PERFORMANCE OPTIMIZATION:
  // Pause 3D canvas rendering and physics when on subpages, case views, or open drawers
  const isSpherePaused = Boolean(
    stage !== 'gallery' ||
    currentRoute !== '/' ||
    activeProj ||
    showList ||
    showInstitutional
  );

  const filteredCount = activeCategory === 'all'
    ? PROJECTS.length
    : PROJECTS.filter(p => projectMatchesCategory(p, activeCategory)).length;

  return (
    <ErrorBoundary>
      <div className="root">
        {/* Liquid Magnetic Cursor */}
        <MagneticCursor
          text={cursorState.text}
          isHovered={cursorState.isHovered}
          isDragging={cursorState.isDragging}
        />

        {/* Big Bang Flash Overlay */}
        <div ref={flashRef} className="bigbang-flash" />

        {/* Black flash overlay for transitions */}
        <div ref={overlayRef} className="transition-overlay" />

        {/* Floating WhatsApp CTA Button (accessible throughout the site) */}
        {currentRoute !== '/contato' && (
          <WhatsAppFloatButton soundEnabled={soundEnabled} />
        )}

        {/* Match-Cut Rhythmic Kinetic Intro (Phantom.land Level) */}
        {stage === 'matchcut' && (
          <MatchCutIntro
            onComplete={handleMatchCutComplete}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
          />
        )}

        {/* Kinetic Preloader Experience (Fallback) */}
        {stage === 'preloader' && (
          <KineticPreloader
            onComplete={handlePreloaderComplete}
            soundEnabled={soundEnabled}
            playTransitionSound={playTransitionSound}
          />
        )}

        {/* Intro Video Experience */}
        {stage === 'intro' && (
          <IntroVideo onComplete={handleIntroComplete} />
        )}

        {/* 3D Sphere Canvas & Navigation HUD */}
        <div style={{
          visibility: stage === 'gallery' && !activeProj && currentRoute === '/' ? 'visible' : 'hidden',
          pointerEvents: stage === 'gallery' && !activeProj && currentRoute === '/' ? 'auto' : 'none'
        }}>
          {stage === 'gallery' && (
            <SphereGallery
              genesisTrigger={genesisCount}
              activeCategory={activeCategory}
              soundEnabled={soundEnabled}
              isPaused={isSpherePaused}
              onHover={handleHover}
              onClick={handleProjectSelect}
              onCursorChange={handleCursorChange}
            />
          )}

          <HUD
            hovered={hovered}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
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
            onContact={() => navigateTo('/contato')}
            onReplayIntro={handleReplayIntro}
          />
        </div>

        {/* Case Study Page with AnimatePresence */}
        <AnimatePresence mode="wait">
          {activeProj && (
            <ProjectPage
              key={activeProj.id}
              project={activeProj}
              allProjects={PROJECTS}
              onClose={handleCloseProject}
              onNavigate={handleNavigateProjects}
              onContact={() => navigateTo('/contato')}
            />
          )}
        </AnimatePresence>

        {/* Agency Page (/agencia) */}
        <AnimatePresence mode="wait">
          {currentRoute === '/agencia' && !activeProj && (
            <AgencyPage
              onBack={() => navigateTo('/')}
              onNavigateContact={() => navigateTo('/contato')}
              soundEnabled={soundEnabled}
            />
          )}
        </AnimatePresence>

        {/* Approach Page (/abordagem) */}
        <AnimatePresence mode="wait">
          {currentRoute === '/abordagem' && !activeProj && (
            <ApproachPage
              onBack={() => navigateTo('/')}
              onNavigateContact={() => navigateTo('/contato')}
              soundEnabled={soundEnabled}
            />
          )}
        </AnimatePresence>

        {/* Conversational Contact Page (/contato) */}
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
                const found = PROJECTS.find(p => p.id === caseId);
                if (found) {
                  setShowInstitutional(false);
                  handleProjectSelect(found);
                }
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
}
