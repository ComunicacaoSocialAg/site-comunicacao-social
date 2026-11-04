import { useCallback, useEffect, useLayoutEffect, useRef, useState, lazy, Suspense } from 'react';
import { ArrowDown, ArrowUpRight, Menu, Volume2, VolumeX, X } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AGENCY_CONFIG } from '../../data/agency';
import { SPEAKER_IMAGE } from '../../data/brandIntro';
import { playClickSound } from '../../utils/audio';
import { playBassDrop } from '../../utils/speakerAudio';
import { SELECTED_WORKS } from './works';
import { createWorkTiming } from './workTiming';
const CinematicScene = lazy(() => import('./CinematicScene'));
import WorkPresentation from './WorkPresentation';
import './cinematic.css';

gsap.registerPlugin(ScrollTrigger);
const WORK_TIMING = createWorkTiming(SELECTED_WORKS.length);

export default function CinematicHome({ introActive, onReplayIntro, soundEnabled, onToggleSound, onOpenCase }) {
  const rootRef = useRef(null);
  const reelRef = useRef(null);
  const reelTriggerRef = useRef(null);
  const progressRef = useRef({ scroll: 0, pointer: { x: 0, y: 0 } });
  const [sceneReady, setSceneReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [activeWork, setActiveWork] = useState(0);
  const [openedWork, setOpenedWork] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const onSceneReady = useCallback(() => setSceneReady(true), []);
  const closeWork = useCallback(() => setOpenedWork(null), []);

  const scrollToSection = useCallback((id) => {
    setMenuOpen(false);
    const element = rootRef.current?.querySelector(`#${id}`);
    element?.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'start' });
  }, [reducedMotion]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (event) => setReducedMotion(event.matches);
    const onPointerMove = (event) => {
      progressRef.current.pointer.x = event.clientX / window.innerWidth * 2 - 1;
      progressRef.current.pointer.y = 1 - event.clientY / window.innerHeight * 2;
    };
    media.addEventListener('change', onChange);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => {
      media.removeEventListener('change', onChange);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const scroller = root.closest('.scroll-container');
    const context = gsap.context(() => {
      ScrollTrigger.create({
        trigger: root,
        scroller,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          progressRef.current.scroll = self.progress;
          root.dataset.sceneProgress = self.progress.toFixed(3);
          root.style.setProperty('--journey-progress', self.progress);
        },
      });
      if (reducedMotion) return;

      root.querySelectorAll('[data-motion-copy]').forEach((copy) => {
        gsap.fromTo(copy, { yPercent: 18, opacity: 1 }, {
          yPercent: -7, opacity: 1, ease: 'none',
          scrollTrigger: { trigger: copy.closest('section'), scroller, start: 'top 75%', end: 'bottom 55%', scrub: 0.8 },
        });
      });

      gsap.to(root.querySelector('.film-amplify-word'), {
        xPercent: -22, ease: 'none',
        scrollTrigger: { trigger: '#amplificar', scroller, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
      });

      const shots = [...root.querySelectorAll('.film-work-shot')];
      gsap.set(shots.slice(1), { xPercent: 108, rotationY: -16, z: -80, scale: 0.94, autoAlpha: 0 });
      gsap.set(shots[0], { xPercent: 0, rotationY: 0, z: 0, scale: 1, autoAlpha: 1 });

      const reel = gsap.timeline({
        scrollTrigger: {
          trigger: reelRef.current,
          scroller,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
          snap: {
            snapTo: WORK_TIMING.scenes.map(scene => scene.rest / WORK_TIMING.duration),
            duration: 0.35,
            delay: 0.15,
            ease: 'power2.out',
            inertia: false,
          },
          onUpdate: (self) => {
            const time = self.progress * WORK_TIMING.duration;
            const index = WORK_TIMING.scenes.findIndex((scene, i) => i < SELECTED_WORKS.length - 1 && time < scene.transition + 0.5);
            setActiveWork(index < 0 ? SELECTED_WORKS.length - 1 : index);
          },
        },
      });

      shots.forEach((shot, index) => {
        if (index === shots.length - 1) return;
        const at = WORK_TIMING.scenes[index].transition;
        const nextShot = shots[index + 1];

        // O case atual sai com rotação controlada e só esmaece na segunda metade do percurso
        reel.to(shot, {
          xPercent: -108,
          rotationY: 16,
          z: -80,
          scale: 0.94,
          duration: 1,
          ease: 'power2.inOut',
        }, at);

        reel.to(shot, {
          autoAlpha: 0,
          duration: 0.45,
          ease: 'power1.in',
        }, at + 0.55);

        // O próximo case entra com opacidade rápida e acomoda no centro com profundidade
        reel.fromTo(nextShot,
          { xPercent: 108, rotationY: -16, z: -80, scale: 0.94, autoAlpha: 0 },
          { xPercent: 0, rotationY: 0, z: 0, scale: 1, duration: 1, ease: 'power2.inOut' },
          at
        );

        reel.to(nextShot, {
          autoAlpha: 1,
          duration: 0.45,
          ease: 'power1.out',
        }, at);
      });

      reel.to({}, { duration: 1.0 }, WORK_TIMING.scenes.at(-1).start);
      reelTriggerRef.current = reel.scrollTrigger;
    }, root);
    const refresh = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(refresh);
      reelTriggerRef.current = null;
      context.revert();
    };
  }, [reducedMotion]);

  useLayoutEffect(() => {
    if (introActive || reducedMotion) return;
    const context = gsap.context(() => {
      gsap.fromTo('.film-hero-title .film-line > span', { yPercent: 110, rotate: 3 }, { yPercent: 0, rotate: 0, duration: 1.25, stagger: 0.12, ease: 'power4.out' });
      gsap.fromTo('.film-hero-note, .film-hero-bottom', { opacity: 0 }, { opacity: 1, duration: 1, delay: 0.5 });
    }, rootRef);
    return () => context.revert();
  }, [introActive, reducedMotion]);

  useEffect(() => {
    if (!menuOpen) return;
    const onEscape = (event) => { if (event.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [menuOpen]);

  const selectWork = (index) => {
    playClickSound(soundEnabled);
    if (reducedMotion) {
      rootRef.current.querySelectorAll('.film-work-shot')[index]?.scrollIntoView({ block: 'center' });
      return;
    }
    const trigger = reelTriggerRef.current;
    if (!trigger) return;
    const scroller = rootRef.current.closest('.scroll-container');
    scroller.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * WORK_TIMING.scenes[index].rest / WORK_TIMING.duration, behavior: 'smooth' });
  };

  return (
    <main ref={rootRef} className={`film-home${reducedMotion ? ' film-reduced' : ''}`} data-scene-progress="0">
      {!reducedMotion && <Suspense fallback={null}><CinematicScene progress={progressRef} introActive={introActive} onReady={onSceneReady} ready={sceneReady} reducedMotion={reducedMotion} /></Suspense>}

      <header className="film-header">
        <button className="film-brand" onClick={() => scrollToSection('hero')} aria-label="Comunicação Social Ag: início">
          <img src="/assets/brand/logo-sem-fundo.png" alt="" width="72" height="38" />
          <span>comunicação<br />social Ag</span>
        </button>
        <nav className="film-nav" aria-label="Navegação principal">
          <a href="/trabalhos" onClick={(event) => { event.preventDefault(); scrollToSection('trabalhos'); }}>Trabalhos <span>{String(SELECTED_WORKS.length).padStart(2, '0')}</span></a>
          <a href="/agencia">A agência</a>
          <a href="/abordagem">Abordagem</a>
          <a href="/mercado">Mercado</a>
          <a href="/contato" onClick={(event) => { event.preventDefault(); scrollToSection('contato'); }}>Vamos conversar <ArrowUpRight size={16} /></a>
        </nav>
        <div className="film-header-tools">
          <button className="film-intro-button" onClick={onReplayIntro}>Rever intro</button>
          <button className="film-icon-button" onClick={() => { onToggleSound(); if (!soundEnabled) playBassDrop(true, 0.35); }} aria-label={soundEnabled ? 'Desativar som' : 'Ativar som'}>{soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}</button>
          <button className="film-menu-button film-icon-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="film-mobile-nav" aria-label={menuOpen ? 'Fechar navegação' : 'Abrir navegação'}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
      </header>

      <nav id="film-mobile-nav" className="film-mobile-nav" hidden={!menuOpen} aria-label="Navegação móvel">
        <a href="/trabalhos" onClick={(event) => { event.preventDefault(); scrollToSection('trabalhos'); }}>Trabalhos <ArrowUpRight /></a>
        <a href="/agencia">A agência <ArrowUpRight /></a>
        <a href="/abordagem">Abordagem <ArrowUpRight /></a>
        <a href="/mercado">Mercado <ArrowUpRight /></a>
        <a href="/contato" onClick={(event) => { event.preventDefault(); scrollToSection('contato'); }}>Conversar <ArrowUpRight /></a>
        <button onClick={() => { setMenuOpen(false); onReplayIntro(); }}>Rever intro</button>
      </nav>

      <section id="hero" className="film-hero film-section">
        <p className="film-hero-note">Estratégia, criatividade<br />e tecnologia na mesma frequência.</p>
        <div className="film-speaker-target" data-poster-visible={!sceneReady || reducedMotion}>
          <img data-intro-speaker src={SPEAKER_IMAGE} alt="O logo da CS Ag em forma de caixas de som." width="1200" height="628" fetchPriority="high" decoding="async" />
        </div>
        <h1 className="film-hero-title" tabIndex={-1}>
          <span className="film-line film-hero-title-small"><span>Somos a amplificação</span></span>
          <span className="film-line"><span>da sua voz.</span></span>
        </h1>
        <div className="film-hero-bottom">
          <button className="film-explore" onClick={() => scrollToSection('escutar')}>Explore a experiência <ArrowDown size={19} /></button>
        </div>
      </section>

      <section id="escutar" className="film-listen film-section">
        <div className="film-listen-copy" data-motion-copy>
          <h2>Antes de<br />amplificar,<br /><em>escutar.</em></h2>
          <p>Uma marca tem história, ambição e uma voz própria. Nosso trabalho começa por entender o que ela precisa dizer. E quem precisa ouvir.</p>
        </div>
      </section>

      <section id="amplificar" className="film-amplify film-section">
        <p className="film-amplify-word" aria-hidden="true">AMPLIFICAR</p>
        <div className="film-amplify-copy" data-motion-copy>
          <h2>O meio muda.<br />A essência fica.</h2>
          <p>Da identidade à campanha. Da tela à rua.<br />Damos forma, direção e alcance à sua mensagem.</p>
        </div>
      </section>

      <section className="film-work-intro film-section">
        <h2 data-motion-copy>O trabalho<br /><em>fala.</em></h2>
        <p className="film-work-lead">Uma seleção de marcas, imagens e ideias.</p>
      </section>

      <section id="trabalhos" ref={reelRef} className="film-reel-runway" style={{ '--work-runway': `${100 + WORK_TIMING.duration * 40}svh` }} aria-label="Trabalhos selecionados">
        <div className="film-reel-stage">
          <div className="film-reel-label"><span className="film-reel-cue">Explore com a rolagem</span></div>
          <div className="film-work-space">
            {SELECTED_WORKS.map((work, index) => {
              const Media = work.href ? 'a' : 'button';
              const action = work.href ? {
                href: work.href,
                onClick: (event) => {
                  const isModified = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
                  if (isModified || (event.button !== undefined && event.button !== 0)) return;
                  event.preventDefault();
                  if (onOpenCase) {
                    onOpenCase(work.href, event.currentTarget, event);
                  }
                },
              } : {
                onClick: (event) => {
                  if (onOpenCase) {
                    onOpenCase(null, event.currentTarget, event, work);
                  } else {
                    setOpenedWork(index);
                  }
                },
              };
              return (
              <article key={work.id} className="film-work-shot" aria-hidden={!reducedMotion && activeWork !== index} style={{ '--work-bg': work.background }}>
                <Media className="film-work-media" {...action} tabIndex={reducedMotion || activeWork === index ? 0 : -1} aria-label={`Abrir projeto: ${work.client}`}>
                  <img src={work.image} alt={work.summary} loading="lazy" decoding="async" width="1200" height="900" style={{ objectFit: work.fit }} />
                  <div className="film-work-card-footer">
                    <h3 className="film-work-card-client">{work.client}</h3>
                    <span className="film-work-open" aria-hidden="true"><ArrowUpRight size={25} /></span>
                  </div>
                </Media>
              </article>
            );})}
          </div>
          <div className="film-reel-controls">
            <div className="film-reel-status">
              <span className="film-reel-count">{String(activeWork + 1).padStart(2, '0')} <span>/ {String(SELECTED_WORKS.length).padStart(2, '0')}</span></span>
              <span className="film-reel-active-client">{SELECTED_WORKS[activeWork].client}</span>
            </div>
            <div className="film-reel-index" role="group" aria-label="Escolher trabalho">
              {SELECTED_WORKS.map((work, index) => <button key={work.id} onClick={() => selectWork(index)} className={activeWork === index ? 'is-current' : ''} aria-label={`Ver ${work.client}`} aria-pressed={activeWork === index}>{String(index + 1).padStart(2, '0')}</button>)}
            </div>
          </div>
        </div>
      </section>

      <section id="agencia" className="film-agency film-section">
        <div className="film-agency-copy" data-motion-copy>
          <h2>Uma voz.<br /><em>Muitas<br />possibilidades.</em></h2>
          <p>Somos uma agência multidisciplinar, estratégica e criativa. Unimos pensamento de marca, comunicação e tecnologia para conectar ideias às pessoas.</p>
          <a href="/agencia" className="film-text-link">Conheça a agência <ArrowUpRight size={19} /></a>
          <div className="film-disciplines"><span>Estratégia e branding</span><span>Conteúdo e campanhas</span><span>Digital e tecnologia</span><span>Mídia e presença de marca</span></div>
        </div>
      </section>

      <section id="contato" className="film-contact film-section">
        <div className="film-contact-copy">
          <h2>Sua próxima<br /><em>grande ideia</em><br />começa numa<br />conversa.</h2>
          <a className="film-contact-link" href={AGENCY_CONFIG.getWhatsAppUrl()} target="_blank" rel="noopener noreferrer">Vamos amplificar <ArrowUpRight size={34} /></a>
          <a className="film-contact-email" href={`mailto:${AGENCY_CONFIG.email}`}>{AGENCY_CONFIG.email}</a>
        </div>
        <footer className="film-footer">
          <span>Comunicação Social Ag © {new Date().getFullYear()}</span>
          <span>Poços de Caldas, MG</span>
          <a href="/mercado">Mercado</a>
          <a href={AGENCY_CONFIG.clientPortalUrl} target="_blank" rel="noopener noreferrer">Área do cliente <ArrowUpRight size={13} /></a>
        </footer>
      </section>
      <div className="film-journey-meter" aria-hidden="true" />

      {openedWork !== null && <WorkPresentation work={SELECTED_WORKS[openedWork]} onClose={closeWork} onNext={() => setOpenedWork((openedWork + 1) % SELECTED_WORKS.length)} />}
    </main>
  );
}
