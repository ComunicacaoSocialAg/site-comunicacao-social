import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Database,
  Eye,
  EyeOff,
  Layers,
  Lock,
  Pause,
  Play,
  Shield,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AGENCY_CONFIG } from '../data/agency';
import { ANA_LIMA_SHOWCASE as media } from '../data/anaLimaShowcase';
import CaseBrandSignature from '../components/CaseBrandSignature';
import './ana-lima-showcase.css';

gsap.registerPlugin(ScrollTrigger);

function HeroVideo({ motion }) {
  const videoRef = useRef(null);
  const manualPause = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let visible = false;
    const sync = () => {
      if (!visible || document.hidden || !motion) video.pause();
      else if (!manualPause.current) video.play().catch(() => {});
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { threshold: 0.08 }
    );
    observer.observe(video);
    document.addEventListener('visibilitychange', sync);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
      video.pause();
    };
  }, [motion]);

  async function toggle() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      manualPause.current = false;
      try {
        await video.play();
      } catch {
        setFailed(true);
      }
    } else {
      manualPause.current = true;
      video.pause();
    }
  }

  return (
    <>
      <video
        ref={videoRef}
        className="al-hero-video"
        src={media.hero.video}
        poster={media.hero.poster}
        muted={muted}
        loop
        playsInline
        preload="metadata"
        aria-label={media.hero.ariaLabel}
        onPlay={() => {
          setPlaying(true);
          setFailed(false);
        }}
        onPause={() => setPlaying(false)}
        onError={() => setFailed(true)}
      />
      <div className="al-video-controls">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? 'Pausar vídeo de abertura' : 'Reproduzir vídeo de abertura'}
        >
          {playing ? <Pause size={17} /> : <Play size={17} />}
          <span>{playing ? 'Pausar' : 'Reproduzir'}</span>
        </button>
        <button
          type="button"
          onClick={() => setMuted(!muted)}
          aria-label={muted ? 'Ativar som do vídeo de abertura' : 'Silenciar vídeo de abertura'}
          aria-pressed={!muted}
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          <span>{muted ? 'Ativar som' : 'Silenciar'}</span>
        </button>
      </div>
      {failed && (
        <p className="al-video-error" role="alert">
          O vídeo de abertura não pôde ser reproduzido automaticamente.{' '}
          <a href={media.hero.video} target="_blank" rel="noopener noreferrer">
            Abrir arquivo de vídeo
          </a>
          .
        </p>
      )}
    </>
  );
}

function ConsultorioFilm({ active, motion }) {
  const ref = useRef(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const sync = () => {
      if (!motion || document.hidden || !active) video.pause();
      else video.play().catch(() => {});
    };
    sync();
    document.addEventListener('visibilitychange', sync);
    return () => {
      video.pause();
      document.removeEventListener('visibilitychange', sync);
    };
  }, [active, motion]);

  return (
    <div className="al-film-wrap">
      <video
        ref={ref}
        controls={!motion}
        src={media.film.video}
        poster={media.film.poster}
        aria-label={media.film.ariaLabel}
        muted={muted}
        loop
        playsInline
        preload="metadata"
      />
      {motion && (
        <button
          type="button"
          className="al-film-sound"
          onClick={() => setMuted(!muted)}
          aria-label={muted ? 'Ativar áudio do filme de consultório' : 'Silenciar áudio do filme'}
          aria-pressed={!muted}
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          <span>{muted ? 'Ouvir ambiente' : 'Silenciar'}</span>
        </button>
      )}
    </div>
  );
}

const SCENE_NAMES = [
  'Experiência Web Autoral',
  'Fundamentos & Enquadre Clínico',
  'Software Clínico Próprio v3.3.1',
  'Cinema de Consultório',
  'Narrativa & Metodologia',
  'Identidade Visual & Símbolo',
];

export default function AnaLimaShowcasePage({ onClose, onContact }) {
  const rootRef = useRef(null);
  const [motion, setMotion] = useState(
    () => typeof window !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const [compact, setCompact] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 760px)').matches
  );
  const [scene, setScene] = useState(0);
  const [privacyMode, setPrivacyMode] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobile = window.matchMedia('(max-width: 760px)');
    const onMotion = () => setMotion(!reduced.matches);
    const onSize = () => setCompact(mobile.matches);
    reduced.addEventListener('change', onMotion);
    mobile.addEventListener('change', onSize);
    const timer = window.setTimeout(() => {
      rootRef.current?.querySelectorAll('.al-stage img').forEach((img) => {
        img.decode?.().catch(() => {});
      });
    }, 350);
    return () => {
      window.clearTimeout(timer);
      reduced.removeEventListener('change', onMotion);
      mobile.removeEventListener('change', onSize);
    };
  }, []);

  useLayoutEffect(() => {
    if (!motion) return;
    const root = rootRef.current;
    if (!root) return;
    const heroRunway = root.querySelector('.al-hero-runway');
    const runway = root.querySelector('.al-runway');
    const scenes = [...root.querySelectorAll('.al-scene')];
    let lastScene = 0;
    root.classList.add('is-cinematic');

    const context = gsap.context(() => {
      // Opening monumental title arrival
      gsap.fromTo(
        '.al-title-letter',
        { yPercent: 112, rotateX: -68 },
        {
          yPercent: 0,
          rotateX: 0,
          duration: 1.35,
          stagger: 0.055,
          ease: 'expo.out',
          delay: 0.1,
        }
      );

      // Act 1: Hero video stays pinned while typographic blocks scroll directly over it
      gsap.to('.al-hero-video', {
        scale: 1.1,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRunway,
          scroller: root,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.75,
        },
      });

      gsap.fromTo(
        '.al-hero-scrim',
        { opacity: 0.18 },
        {
          opacity: 0.72,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRunway,
            scroller: root,
            start: 'top top',
            end: '55% top',
            scrub: 0.6,
          },
        }
      );

      gsap.to('.al-hero-opening', {
        yPercent: -18,
        opacity: 0.12,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRunway,
          scroller: root,
          start: 'top top',
          end: '28% top',
          scrub: 0.65,
        },
      });

      gsap.fromTo(
        '.al-over-line',
        { xPercent: (i) => (i % 2 === 0 ? -9 : 9) },
        {
          xPercent: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: '.al-over-statement',
            scroller: root,
            start: 'top 92%',
            end: 'center 48%',
            scrub: 0.7,
          },
        }
      );

      gsap.fromTo(
        '.al-pillar-row',
        { y: 42, opacity: 0.18 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.al-over-pillars',
            scroller: root,
            start: 'top 88%',
            end: 'center 52%',
            scrub: 0.65,
          },
        }
      );

      // Act 2: Pinned full-viewport digital exhibition runway
      gsap.set(scenes, { autoAlpha: 0 });
      gsap.set(scenes[0], { autoAlpha: 1 });

      const edit = gsap.timeline({
        scrollTrigger: {
          trigger: runway,
          scroller: root,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.85,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            root.style.setProperty('--al-progress', self.progress);
            const t = self.progress * (edit.duration() || 7.72);
            const next =
              t >= 6.45 ? 5 : t >= 5.05 ? 4 : t >= 3.7 ? 3 : t >= 2.5 ? 2 : t >= 1.3 ? 1 : 0;
            if (next !== lastScene) {
              lastScene = next;
              setScene(next);
            }
          },
          onLeave: () => setScene(-1),
          onEnterBack: () => setScene(5),
          onLeaveBack: () => setScene(-1),
        },
      });

      // Scene 0: Web Experience in 3D depth
      edit
        .fromTo(
          '.al-web-main',
          { transformPerspective: 1400, rotateY: 14, rotateZ: -3.5, scale: 0.86, xPercent: -6, yPercent: 6 },
          { transformPerspective: 1400, rotateY: 0, rotateZ: 0, scale: 1, xPercent: 0, yPercent: 0, duration: 0.95, ease: 'power2.out' },
          0
        )
        .fromTo(
          '.al-web-secondary',
          { transformPerspective: 1400, rotateY: -12, scale: 0.88, xPercent: 10, yPercent: -8 },
          { transformPerspective: 1400, rotateY: -4, scale: 0.98, xPercent: 0, yPercent: 3, duration: 0.95, ease: 'power2.out' },
          0
        )
        .fromTo(
          '.al-web-phone',
          { yPercent: 22, rotateZ: 5, scale: 0.9 },
          { yPercent: -4, rotateZ: 0, scale: 1, duration: 0.95, ease: 'power2.out' },
          0
        )
        .to('.al-word-web', { xPercent: -12, duration: 1.25, ease: 'none' }, 0);

      // Scene 1: Clinical Foundations & Setting UX
      edit
        .set(scenes[1], { autoAlpha: 1 }, 1.18)
        .fromTo(
          scenes[1],
          { clipPath: 'inset(100% 0% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.55, ease: 'power3.inOut', immediateRender: false },
          1.18
        )
        .fromTo(
          '.al-mid-primary',
          { xPercent: -8, yPercent: 8, scale: 0.92 },
          { xPercent: 0, yPercent: 0, scale: 1, duration: 1.05, ease: 'power2.out' },
          1.22
        )
        .fromTo(
          '.al-mid-secondary',
          { xPercent: 10, yPercent: -8, scale: 0.92 },
          { xPercent: 0, yPercent: 2, scale: 1, duration: 1.05, ease: 'power2.out' },
          1.22
        )
        .to('.al-word-fundamentos', { xPercent: 10, duration: 1.15, ease: 'none' }, 1.18)
        .set(scenes[0], { autoAlpha: 0 }, 1.76);

      // Scene 2: SaaS Platform in 3D Depth
      edit
        .set(scenes[2], { autoAlpha: 1 }, 2.38)
        .fromTo(
          scenes[2],
          { xPercent: 100 },
          { xPercent: 0, duration: 0.62, ease: 'power3.inOut', immediateRender: false },
          2.38
        )
        .to(scenes[1], { xPercent: -24, duration: 0.62, ease: 'power3.inOut' }, 2.38)
        .fromTo(
          '.al-saas-dashboard',
          { transformPerspective: 1400, scale: 0.84, rotateX: 8, yPercent: 10 },
          { transformPerspective: 1400, scale: 1, rotateX: 0, yPercent: 0, duration: 1.1, ease: 'power2.out' },
          2.45
        )
        .fromTo(
          '.al-saas-schedule',
          { transformPerspective: 1400, xPercent: -12, rotateY: 12, scale: 0.88 },
          { transformPerspective: 1400, xPercent: 0, rotateY: 6, scale: 0.95, duration: 1.1, ease: 'power2.out' },
          2.45
        )
        .fromTo(
          '.al-saas-financial',
          { transformPerspective: 1400, xPercent: 12, rotateY: -12, scale: 0.88 },
          { transformPerspective: 1400, xPercent: 0, rotateY: -6, scale: 0.95, duration: 1.1, ease: 'power2.out' },
          2.45
        )
        .fromTo(
          '.al-saas-phone',
          { yPercent: 24, scale: 0.9 },
          { yPercent: -3, scale: 1, duration: 1.1, ease: 'power2.out' },
          2.45
        )
        .to('.al-word-saas', { xPercent: -14, duration: 1.25, ease: 'none' }, 2.38)
        .set(scenes[1], { autoAlpha: 0 }, 3.04);

      // Scene 3: Full-Viewport Consultorio Cinema
      edit
        .set(scenes[3], { autoAlpha: 1 }, 3.68)
        .fromTo(
          scenes[3],
          { clipPath: 'inset(100% 0% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6, ease: 'power3.inOut', immediateRender: false },
          3.68
        )
        .fromTo(
          '.al-film-wrap video',
          { scale: 1.12 },
          { scale: 1.02, duration: 1.15, ease: 'none' },
          3.68
        )
        .set(scenes[2], { autoAlpha: 0 }, 4.3);

      // Scene 4: Sequential 6-Plate Editorial Carousel Ribbon
      edit
        .set(scenes[4], { autoAlpha: 1 }, 4.92)
        .fromTo(
          scenes[4],
          { clipPath: 'inset(0% 100% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.58, ease: 'power3.inOut', immediateRender: false },
          4.92
        )
        .fromTo(
          '.al-carousel-track',
          { xPercent: 6 },
          { xPercent: compact ? -74 : -50, duration: 1.35, ease: 'none' },
          4.96
        )
        .to('.al-word-reflexao', { xPercent: 12, duration: 1.3, ease: 'none' }, 4.92)
        .set(scenes[3], { autoAlpha: 0 }, 5.52);

      // Scene 5: Brand Identity & Universe in 3D Depth
      edit
        .set(scenes[5], { autoAlpha: 1 }, 6.32)
        .fromTo(
          scenes[5],
          { clipPath: 'inset(0% 0% 100% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.58, ease: 'power3.inOut', immediateRender: false },
          6.32
        )
        .fromTo(
          '.al-brand-piece',
          {
            yPercent: (i) => (i % 2 === 0 ? 16 : -14),
            scale: 0.9,
            rotateZ: (i) => [-2, 2, -1.5, 1.5][i % 4],
          },
          {
            yPercent: (i) => (i % 2 === 0 ? -3 : 3),
            scale: 1,
            rotateZ: 0,
            stagger: 0.03,
            duration: 1.15,
            ease: 'power2.out',
          },
          6.36
        );

      if (compact) {
        edit.fromTo(
          '.al-brand-space',
          { xPercent: 0 },
          { xPercent: -50, duration: 0.56, ease: 'none' },
          6.34
        );
      }

      edit
        .to('.al-word-identidade', { xPercent: -15, duration: 1.2, ease: 'none' }, 6.32)
        .set(scenes[4], { autoAlpha: 0 }, 6.92);
    }, root);

    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(frame);
      context.revert();
      root.classList.remove('is-cinematic');
      root.style.removeProperty('--al-progress');
    };
  }, [motion, compact]);

  function home(event) {
    if (
      onClose &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.shiftKey &&
      !event.altKey &&
      (event.button === undefined || event.button === 0)
    ) {
      event.preventDefault();
      onClose();
    }
  }

  const contact = AGENCY_CONFIG.getWhatsAppUrl(
    'Olá! Vi o case da psicóloga Ana Lima e quero conversar sobre ecossistema digital e tecnologia para o meu consultório.'
  );

  return (
    <article
      ref={rootRef}
      className="client-case al-case"
      data-motion={motion ? 'on' : 'off'}
      aria-labelledby="al-title"
    >
      <a className="al-skip" href="#contato-case">
        Ir para o contato
      </a>

      <header className="al-header">
        <a href="/" onClick={home} className="al-back" aria-label="Voltar ao início">
          <ArrowLeft size={18} />
          <span>Voltar ao início</span>
        </a>
        <a href="/" onClick={home} aria-label="Comunicação Social Ag" className="al-agency">
          <img
            src="/assets/brand/logo-sem-fundo.png"
            width="65"
            height="34"
            alt="Comunicação Social Ag"
          />
        </a>
        <div className="al-header-right">
          <a href="#contato-case">
            Vamos conversar
            <ArrowUpRight size={17} />
          </a>
          <button
            type="button"
            onClick={() => setMotion(!motion)}
            aria-label={motion ? 'Pausar animações' : 'Ativar animações'}
            aria-pressed={motion}
          >
            {motion ? <Pause size={16} /> : <Play size={16} />}
          </button>
        </div>
      </header>

      <main>
        {/* Act 1: Sticky Video Stage + Scrolling Statements Passing Over Video */}
        <section className="al-hero-runway" aria-labelledby="al-title">
          <div className="al-hero-stage">
            <HeroVideo motion={motion} />
            <div className="al-hero-shade" aria-hidden="true" />
            <div className="al-hero-scrim" aria-hidden="true" />
          </div>

          <div className="al-hero-track">
            <div className="al-hero-opening">
              <CaseBrandSignature
                client="Ana Lima : Psicóloga Clínica"
                clientLogo={media.brand.logoOficialWebp}
              />

              <h1 id="al-title" className="al-hero-title" aria-label="Ana Lima">
                {'ANA LIMA'.split('').map((letter, index) => (
                  <span className="al-title-mask" key={index}>
                    <span className="al-title-letter" aria-hidden="true">
                      {letter === ' ' ? '\u00A0' : letter}
                    </span>
                  </span>
                ))}
              </h1>

              <div className="al-hero-bottom">
                <p>
                  Ecossistema digital completo: experiência web autoral,
                  <br />
                  software clínico sob medida com prontuário criptografado e gestão integrada.
                </p>
                <a href="#ecossistema">
                  Explore o ecossistema
                  <ArrowDown size={20} />
                </a>
              </div>
            </div>

            <div className="al-over-statement" aria-labelledby="al-over-heading">
              <h2 id="al-over-heading">
                <span className="al-over-line">ÉTICA &</span>
                <span className="al-over-line">TECNOLOGIA.</span>
              </h2>
              <p>
                Para a psicóloga clínica Ana Lima, o cuidado terapêutico e as ferramentas de trabalho
                compartilham o mesmo princípio: rigor ético, clareza e respeito absoluto à história de cada
                pessoa. Da primeira visita ao site institucional ao atendimento diário em um software clínico
                blindado contra vazamentos.
              </p>
            </div>

            <div className="al-over-pillars" aria-label="Frentes integradas do ecossistema">
              {media.pillars.map((pillar) => (
                <div className="al-pillar-row" key={pillar.title}>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Act 2: Full-Viewport Multi-Scene Exhibition Runway */}
        <section
          id="ecossistema"
          className="al-runway"
          aria-label="Exposição digital dos projetos desenvolvidos para Ana Lima"
        >
          <div className="al-stage">
            {/* Scene 0: Web Experience in 3D Depth */}
            <section
              className="al-scene al-scene-web"
              aria-label="Portal Institucional analimapsicologia.com.br"
            >
              <span className="al-bg-word al-word-web" aria-hidden="true">
                ACOLHIMENTO
              </span>
              <div className="al-web-space">
                <figure className="al-screen-frame al-web-secondary">
                  <img
                    src={media.website.abordagem.src}
                    alt={media.website.abordagem.alt}
                    loading="eager"
                    decoding="sync"
                  />
                </figure>
                <figure className="al-screen-frame al-web-main">
                  <img
                    src={media.website.hero.src}
                    alt={media.website.hero.alt}
                    loading="eager"
                    decoding="sync"
                  />
                </figure>
                <figure className="al-phone-frame al-web-phone">
                  <img
                    src={media.website.mobile.src}
                    alt={media.website.mobile.alt}
                    loading="eager"
                    decoding="sync"
                  />
                </figure>
              </div>
              <div className="al-scene-bar">
                <div>
                  <strong>Portal Institucional analimapsicologia.com.br</strong>
                  <span>Direção editorial serena, tipografia acolhedora e diálogo ético sobre saúde mental</span>
                </div>
                <a href={media.brand.websiteUrl} target="_blank" rel="noopener noreferrer">
                  analimapsicologia.com.br
                  <ArrowUpRight size={16} />
                </a>
              </div>
            </section>

            {/* Scene 1: Clinical Foundations & Setting UX */}
            <section
              className="al-scene al-scene-mid"
              aria-label="Fundamentos teóricos e enquadre clínico"
            >
              <span className="al-bg-word al-word-fundamentos" aria-hidden="true">
                FUNDAMENTOS
              </span>
              <div className="al-mid-space">
                <figure className="al-screen-frame al-mid-primary">
                  <img
                    src={media.website.pilares.src}
                    alt={media.website.pilares.alt}
                    loading="eager"
                    decoding="sync"
                  />
                </figure>
                <figure className="al-screen-frame al-mid-secondary">
                  <img
                    src={media.website.processo.src}
                    alt={media.website.processo.alt}
                    loading="eager"
                    decoding="sync"
                  />
                </figure>
              </div>
              <div className="al-scene-bar">
                <div>
                  <strong>Fundamentos & Enquadre Clínico</strong>
                  <span>
                    3 pilares da abordagem : sessões semanais de 50 minutos : presencial em Poços de Caldas e online
                  </span>
                </div>
              </div>
            </section>

            {/* Scene 2: SaaS Platform in 3D Depth */}
            <section
              className="al-scene al-scene-saas"
              aria-label="Software clínico próprio v3.3.1 em produção"
            >
              <span className="al-bg-word al-word-saas" aria-hidden="true">
                SISTEMA
              </span>
              <div className="al-saas-space">
                <figure className="al-screen-frame al-saas-schedule">
                  <img
                    src={media.saas.schedule.src}
                    alt={media.saas.schedule.alt}
                    loading="eager"
                    decoding="sync"
                  />
                </figure>
                <figure className="al-screen-frame al-saas-financial">
                  <img
                    src={media.saas.financial.src}
                    alt={media.saas.financial.alt}
                    loading="eager"
                    decoding="sync"
                  />
                </figure>
                <figure className="al-screen-frame al-saas-dashboard">
                  <img
                    src={media.saas.dashboard.src}
                    alt={media.saas.dashboard.alt}
                    loading="eager"
                    decoding="sync"
                  />
                </figure>
                <figure className="al-phone-frame al-saas-phone">
                  <img
                    src={media.saas.mobile.src}
                    alt={media.saas.mobile.alt}
                    loading="eager"
                    decoding="sync"
                  />
                </figure>
              </div>
              <div className="al-scene-bar">
                <div>
                  <strong>Software Clínico Próprio v3.3.1</strong>
                  <span>
                    Dashboard executivo, agenda de 50 min, cofre local AES-GCM e faturamento Pix Asaas
                  </span>
                </div>
                <a href={media.brand.saasUrl} target="_blank" rel="noopener noreferrer">
                  ana-lima-psi-app.web.app
                  <ArrowUpRight size={16} />
                </a>
              </div>
            </section>

            {/* Scene 3: Consultorio Cinema */}
            <section
              className="al-scene al-scene-cinema"
              aria-label="Filme cinematográfico no consultório"
            >
              <ConsultorioFilm active={scene === 3 && motion} motion={motion} />
              <div className="al-scene-bar al-scene-bar-cinema">
                <div>
                  <strong>O Espaço e o Gesto Terapêutico</strong>
                  <span>Produção audiovisual intimista para transmitir a escuta atenta e o silêncio reflexivo</span>
                </div>
              </div>
            </section>

            {/* Scene 4: Sequential 6-Plate Editorial Carousel */}
            <section
              className="al-scene al-scene-carousel"
              aria-label="Sequência editorial dos fundamentos da abordagem clínica"
            >
              <span className="al-bg-word al-word-reflexao" aria-hidden="true">
                REFLEXÃO
              </span>
              <div className="al-carousel-viewport">
                <div className="al-carousel-track">
                  {media.carousel.map((plate) => (
                    <figure className="al-carousel-plate" key={plate.src}>
                      <img src={plate.src} alt={plate.desc} loading="eager" decoding="sync" />
                      <figcaption className="al-carousel-caption">
                        <span className="al-carousel-tag">{plate.category}</span>
                        <strong>{plate.title}</strong>
                        <p>{plate.desc}</p>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
              <div className="al-scene-bar">
                <div>
                  <strong>Narrativa Sequencial & Jornada Reflexiva</strong>
                  <span>Seis lâminas que conduzem da compreensão da queixa à autonomia existencial</span>
                </div>
              </div>
            </section>

            {/* Scene 5: Brand Identity & Universe in 3D Depth */}
            <section
              className="al-scene al-scene-brand"
              aria-label="Universo visual da marca e dente-de-leão"
            >
              <span className="al-bg-word al-word-identidade" aria-hidden="true">
                IDENTIDADE
              </span>
              <div className="al-brand-space">
                {media.brandIdentity.map((item) => (
                  <figure
                    key={item.title}
                    className={`al-brand-piece al-brand-${item.aspect}`}
                  >
                    <img src={item.src} alt={item.title} loading="eager" decoding="sync" />
                    <figcaption className="al-brand-caption">
                      <strong>{item.title}</strong>
                      <p>{item.desc}</p>
                    </figcaption>
                  </figure>
                ))}
              </div>
              <div className="al-scene-bar">
                <div>
                  <strong>Identidade Visual & Símbolo do Dente-de-Leão</strong>
                  <span>Design orgânico, paleta botânica e alinhamento normativo ao CRP 04/60205</span>
                </div>
              </div>
            </section>

            {scene >= 0 && (
              <div className="al-scene-indicator" aria-hidden="true">
                <span>{SCENE_NAMES[scene]}</span>
              </div>
            )}
            <div className="al-edit-progress" aria-hidden="true">
              <span />
            </div>
          </div>
        </section>

        {/* Act 3: Deep Dive & 9 Defense-in-Depth Security Layers */}
        <section className="al-security-section" aria-labelledby="al-security-title">
          <div className="al-security-inner">
            <div className="al-security-header">
              <span className="al-kicker">ENGENHARIA & SIGILO PROFISSIONAL</span>
              <h2 id="al-security-title">
                9 Camadas de Proteção
                <br />
                <span>para o Espaço Terapêutico</span>
              </h2>
              <p>
                O Código de Ética Profissional do Psicólogo e a Resolução CFP 001/2009 exigem guarda
                rigorosa do prontuário por no mínimo 5 anos. Criamos uma arquitetura de defesa em
                profundidade onde nenhum dado sensível de sessão trafega em texto claro nem depende de
                servidores de terceiros para ser cifrado.
              </p>
            </div>

            <div className="al-security-grid">
              {media.securityLayers.map((layer) => (
                <div className="al-security-card" key={layer.layer}>
                  <div className="al-security-card-top">
                    <span className="al-layer-num">{layer.layer}</span>
                    <Shield size={18} className="al-layer-icon" />
                  </div>
                  <h3>{layer.name}</h3>
                  <p>{layer.detail}</p>
                </div>
              ))}
            </div>

            {/* Privacy Simulator Box */}
            <div className="al-privacy-demo">
              <div className="al-privacy-info">
                <span className="al-privacy-badge">RECURSO DO SISTEMA EM PRODUÇÃO</span>
                <h3>Modo de Privacidade de 1 Clique</h3>
                <p>
                  Quando a psicóloga atende em espaços compartilhados, co-workings ou via vídeo, um clique no
                  ícone de privacidade ofusca imediatamente nomes de pacientes, honorários e dados sensíveis
                  da tela sem deslogar.
                </p>
              </div>
              <div className="al-privacy-action">
                <button
                  type="button"
                  className={`al-privacy-toggle ${privacyMode ? 'is-active' : ''}`}
                  onClick={() => setPrivacyMode(!privacyMode)}
                  aria-pressed={privacyMode}
                >
                  {privacyMode ? <EyeOff size={18} /> : <Eye size={18} />}
                  <span>{privacyMode ? 'Modo de privacidade ativado' : 'Testar modo de privacidade'}</span>
                </button>
                <div className={`al-privacy-preview ${privacyMode ? 'is-hidden' : ''}`}>
                  <div className="al-preview-row">
                    <span>Paciente:</span>
                    <strong>{privacyMode ? '•••••••• ••••••••' : 'Camila R. S.'}</strong>
                  </div>
                  <div className="al-preview-row">
                    <span>Horário:</span>
                    <strong>{privacyMode ? '••:••' : '15:00 (Sessão 50 min)'}</strong>
                  </div>
                  <div className="al-preview-row">
                    <span>Honorários:</span>
                    <strong>{privacyMode ? 'R$ •••,••' : 'R$ 220,00 (Pix Asaas)'}</strong>
                  </div>
                  <div className="al-preview-row">
                    <span>Cofre:</span>
                    <strong className="al-vault-ok">
                      <Lock size={13} /> PBKDF2/AES-GCM Ativo
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Act 4: Studio Closing */}
        <footer id="contato-case" className="al-contact">
          <h2>
            Sua clínica.
            <br />
            <span>100% ética e conectada.</span>
          </h2>
          <p className="al-closing">
            Branding autoral, portal institucional com scrollytelling, software clínico com prontuário
            criptografado e cinema de consultório.
            <span>Um ecossistema proprietário para cuidar de quem cuida.</span>
          </p>
          <a
            className="al-contact-main"
            href={contact}
            target="_blank"
            rel="noopener noreferrer"
          >
            Vamos conversar
            <ArrowUpRight size={38} />
          </a>
          {onContact ? (
            <button type="button" className="al-contact-other" onClick={onContact}>
              Outras formas de contato
            </button>
          ) : (
            <a className="al-contact-other" href="/contato">
              Outras formas de contato
            </a>
          )}
          <div className="al-footer">
            <a href="/" onClick={home}>
              Comunicação Social Ag para Ana Lima : Psicóloga Clínica (CRP 04/60205).
            </a>
            <span>Somos a amplificação da sua voz.</span>
            <span>Poços de Caldas, MG</span>
          </div>
        </footer>
      </main>
    </article>
  );
}
