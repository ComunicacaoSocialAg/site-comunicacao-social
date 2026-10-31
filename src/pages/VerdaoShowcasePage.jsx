import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowUpRight, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AGENCY_CONFIG } from '../data/agency';
import { VERDAO_SHOWCASE as media } from '../data/verdaoShowcase';
import CaseBrandSignature from '../components/CaseBrandSignature';
import './verdao-showcase.css';

gsap.registerPlugin(ScrollTrigger);

function HeroVideo({ motion }) {
  const videoRef = useRef(null);
  const manualPause = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
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
        className="vrd-hero-video"
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
      <div className="vrd-video-controls">
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
        <p className="vrd-video-error" role="alert">
          O vídeo de abertura não pôde ser reproduzido automaticamente.{' '}
          <a href={media.hero.video}>Abrir arquivo de vídeo</a>.
        </p>
      )}
    </>
  );
}

function DevelopmentFilm({ active, motion }) {
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
    <div className="vrd-film-wrap">
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
          className="vrd-film-sound"
          onClick={() => setMuted(!muted)}
          aria-label={muted ? 'Ativar áudio do filme Le Champ' : 'Silenciar áudio do filme Le Champ'}
          aria-pressed={!muted}
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          <span>{muted ? 'Ouvir trilha' : 'Silenciar'}</span>
        </button>
      )}
    </div>
  );
}

const SCENE_NAMES = [
  'Landing Page Le Champ',
  'Arquitetura & Plantas',
  'Sistema & Portal SaaS',
  'Cinema Imobiliário',
  'Narrativa Editorial',
  'Presença Digital',
];

export default function VerdaoShowcasePage({ onClose, onContact }) {
  const rootRef = useRef(null);
  const [motion, setMotion] = useState(
    () => typeof window !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const [compact, setCompact] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 760px)').matches
  );
  const [scene, setScene] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobile = window.matchMedia('(max-width: 760px)');
    const onMotion = () => setMotion(!reduced.matches);
    const onSize = () => setCompact(mobile.matches);
    reduced.addEventListener('change', onMotion);
    mobile.addEventListener('change', onSize);
    const timer = window.setTimeout(() => {
      rootRef.current?.querySelectorAll('.vrd-stage img').forEach((img) => {
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
    const heroRunway = root.querySelector('.vrd-hero-runway');
    const runway = root.querySelector('.vrd-runway');
    const scenes = [...root.querySelectorAll('.vrd-scene')];
    let lastScene = 0;
    root.classList.add('is-cinematic');

    const context = gsap.context(() => {
      // Opening monumental title arrival
      gsap.fromTo(
        '.vrd-title-letter',
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
      gsap.to('.vrd-hero-video', {
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
        '.vrd-hero-scrim',
        { opacity: 0.14 },
        {
          opacity: 0.68,
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

      gsap.to('.vrd-hero-opening', {
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
        '.vrd-over-line',
        { xPercent: (i) => (i % 2 === 0 ? -9 : 9) },
        {
          xPercent: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: '.vrd-over-statement',
            scroller: root,
            start: 'top 92%',
            end: 'center 48%',
            scrub: 0.7,
          },
        }
      );

      gsap.fromTo(
        '.vrd-pillar-row',
        { y: 42, opacity: 0.18 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.vrd-over-pillars',
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
            root.style.setProperty('--vrd-progress', self.progress);
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

      // Scene 0: Le Champ Landing Page in 3D depth
      edit
        .fromTo(
          '.vrd-lc-main',
          { transformPerspective: 1400, rotateY: 14, rotateZ: -3.5, scale: 0.86, xPercent: -6, yPercent: 6 },
          { transformPerspective: 1400, rotateY: 0, rotateZ: 0, scale: 1, xPercent: 0, yPercent: 0, duration: 0.95, ease: 'power2.out' },
          0
        )
        .fromTo(
          '.vrd-lc-secondary',
          { transformPerspective: 1400, rotateY: -12, scale: 0.88, xPercent: 10, yPercent: -8 },
          { transformPerspective: 1400, rotateY: -4, scale: 0.98, xPercent: 0, yPercent: 3, duration: 0.95, ease: 'power2.out' },
          0
        )
        .fromTo(
          '.vrd-lc-phone',
          { yPercent: 22, rotateZ: 5, scale: 0.9 },
          { yPercent: -4, rotateZ: 0, scale: 1, duration: 0.95, ease: 'power2.out' },
          0
        )
        .to('.vrd-word-lechamp', { xPercent: -12, duration: 1.25, ease: 'none' }, 0);

      // Scene 1: Le Champ Floor Plans & Architecture UX
      edit
        .set(scenes[1], { autoAlpha: 1 }, 1.18)
        .fromTo(
          scenes[1],
          { clipPath: 'inset(100% 0% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.55, ease: 'power3.inOut', immediateRender: false },
          1.18
        )
        .fromTo(
          '.vrd-plan-primary',
          { xPercent: -8, yPercent: 8, scale: 0.92 },
          { xPercent: 0, yPercent: 0, scale: 1, duration: 1.05, ease: 'power2.out' },
          1.22
        )
        .fromTo(
          '.vrd-plan-secondary',
          { xPercent: 10, yPercent: -8, scale: 0.92 },
          { xPercent: 0, yPercent: 2, scale: 1, duration: 1.05, ease: 'power2.out' },
          1.22
        )
        .to('.vrd-word-area', { xPercent: 10, duration: 1.15, ease: 'none' }, 1.18)
        .set(scenes[0], { autoAlpha: 0 }, 1.76);

      // Scene 2: Official Portal & SaaS Property Engine
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
          '.vrd-saas-catalog',
          { transformPerspective: 1400, scale: 0.84, rotateX: 8, yPercent: 10 },
          { transformPerspective: 1400, scale: 1, rotateX: 0, yPercent: 0, duration: 1.1, ease: 'power2.out' },
          2.45
        )
        .fromTo(
          '.vrd-saas-home',
          { transformPerspective: 1400, xPercent: -12, rotateY: 12, scale: 0.88 },
          { transformPerspective: 1400, xPercent: 0, rotateY: 6, scale: 0.95, duration: 1.1, ease: 'power2.out' },
          2.45
        )
        .fromTo(
          '.vrd-saas-detail',
          { transformPerspective: 1400, xPercent: 12, rotateY: -12, scale: 0.88 },
          { transformPerspective: 1400, xPercent: 0, rotateY: -6, scale: 0.95, duration: 1.1, ease: 'power2.out' },
          2.45
        )
        .fromTo(
          '.vrd-saas-phone',
          { yPercent: 24, scale: 0.9 },
          { yPercent: -3, scale: 1, duration: 1.1, ease: 'power2.out' },
          2.45
        )
        .to('.vrd-word-saas', { xPercent: -14, duration: 1.25, ease: 'none' }, 2.38)
        .set(scenes[1], { autoAlpha: 0 }, 3.04);

      // Scene 3: Full-Viewport Development Cinema (Le Champ Film)
      edit
        .set(scenes[3], { autoAlpha: 1 }, 3.68)
        .fromTo(
          scenes[3],
          { clipPath: 'inset(100% 0% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6, ease: 'power3.inOut', immediateRender: false },
          3.68
        )
        .fromTo(
          '.vrd-film-wrap video',
          { scale: 1.12 },
          { scale: 1.02, duration: 1.15, ease: 'none' },
          3.68
        )
        .set(scenes[2], { autoAlpha: 0 }, 4.3);

      // Scene 4: Sequential 7-Plate Editorial Carousel Ribbon
      edit
        .set(scenes[4], { autoAlpha: 1 }, 4.92)
        .fromTo(
          scenes[4],
          { clipPath: 'inset(0% 100% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.58, ease: 'power3.inOut', immediateRender: false },
          4.92
        )
        .fromTo(
          '.vrd-carousel-track',
          { xPercent: 6 },
          { xPercent: compact ? -72 : -48, duration: 1.35, ease: 'none' },
          4.96
        )
        .to('.vrd-word-editorial', { xPercent: 12, duration: 1.3, ease: 'none' }, 4.92)
        .set(scenes[3], { autoAlpha: 0 }, 5.52);

      // Scene 5: Digital Presence & Social Ecosystem in 3D Depth
      edit
        .set(scenes[5], { autoAlpha: 1 }, 6.32)
        .fromTo(
          scenes[5],
          { clipPath: 'inset(0% 0% 100% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.58, ease: 'power3.inOut', immediateRender: false },
          6.32
        )
        .fromTo(
          '.vrd-social-piece',
          {
            yPercent: (i) => (i % 2 === 0 ? 18 : -16),
            scale: 0.88,
            rotateZ: (i) => (i % 2 === 0 ? -3 : 3),
          },
          {
            yPercent: (i) => (i % 2 === 0 ? -4 : 4),
            scale: 1,
            rotateZ: 0,
            stagger: 0.03,
            duration: 1.15,
            ease: 'power2.out',
          },
          6.36
        )
        .to('.vrd-word-presence', { xPercent: -15, duration: 1.2, ease: 'none' }, 6.32)
        .set(scenes[4], { autoAlpha: 0 }, 6.92);
    }, root);

    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(frame);
      context.revert();
      root.classList.remove('is-cinematic');
      root.style.removeProperty('--vrd-progress');
    };
  }, [motion, compact]);

  function home(event) {
    if (
      onClose &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.shiftKey &&
      !event.altKey &&
      event.button === 0
    ) {
      event.preventDefault();
      onClose();
    }
  }

  const contact = AGENCY_CONFIG.getWhatsAppUrl(
    'Olá! Vi o case da Imobiliária Verdão e quero conversar sobre presença digital e tecnologia para a minha marca.'
  );

  return (
    <article
      ref={rootRef}
      className="client-case vrd-case"
      data-motion={motion ? 'on' : 'off'}
      aria-labelledby="vrd-title"
    >
      <a className="vrd-skip" href="#contato-case">
        Ir para o contato
      </a>

      <header className="vrd-header">
        <a href="/" onClick={home} className="vrd-back" aria-label="Voltar ao início">
          <ArrowLeft size={18} />
          <span>Voltar ao início</span>
        </a>
        <a href="/" onClick={home} aria-label="Comunicação Social Ag" className="vrd-agency">
          <img
            src="/assets/brand/logo-sem-fundo.png"
            width="65"
            height="34"
            alt="Comunicação Social Ag"
          />
        </a>
        <div className="vrd-header-right">
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
        {/* Act 1: Sticky Reel Video Stage + Scrolling Statements Passing Over Video */}
        <section className="vrd-hero-runway" aria-labelledby="vrd-title">
          <div className="vrd-hero-stage">
            <HeroVideo motion={motion} />
            <div className="vrd-hero-shade" aria-hidden="true" />
            <div className="vrd-hero-scrim" aria-hidden="true" />
          </div>

          <div className="vrd-hero-track">
            <div className="vrd-hero-opening">
              <CaseBrandSignature client="Imobiliária Verdão" clientLogo={media.brand.symbol} />

              <h1 id="vrd-title" className="vrd-hero-title" aria-label="Imobiliária Verdão">
                {'VERDÃO'.split('').map((letter, index) => (
                  <span className="vrd-title-mask" key={index}>
                    <span className="vrd-title-letter" aria-hidden="true">
                      {letter}
                    </span>
                  </span>
                ))}
              </h1>

              <div className="vrd-hero-bottom">
                <p>
                  Ecossistema 100% digital: presença contínua,
                  <br />
                  landing pages de lançamento, SaaS e cinema imobiliário.
                </p>
                <a href="#ecossistema">
                  Explore o ecossistema
                  <ArrowDown size={20} />
                </a>
              </div>
            </div>

            <div className="vrd-over-statement" aria-labelledby="vrd-over-heading">
              <h2 id="vrd-over-heading">
                <span className="vrd-over-line">100%</span>
                <span className="vrd-over-line">DIGITAL.</span>
              </h2>
              <p>
                Para a Imobiliária Verdão, marca, conteúdo e software funcionam como uma única
                operação. Do primeiro impacto no vídeo à busca filtrada no portal oficial e às
                páginas exclusivas de lançamento como o Le Champ Village.
              </p>
            </div>

            <div className="vrd-over-pillars" aria-label="Frentes digitais integradas">
              {media.pillars.map((pillar) => (
                <div className="vrd-pillar-row" key={pillar.title}>
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
          className="vrd-runway"
          aria-label="Exposição digital dos projetos realizados para a Imobiliária Verdão"
        >
          <div className="vrd-stage">
            {/* Scene 0: Le Champ Landing Page */}
            <section
              className="vrd-scene vrd-scene-lechamp"
              aria-label="Landing page de lançamento Le Champ Village"
            >
              <span className="vrd-bg-word vrd-word-lechamp" aria-hidden="true">
                LE CHAMP
              </span>
              <div className="vrd-lechamp-space">
                <figure className="vrd-screen-frame vrd-lc-secondary">
                  <img
                    src={media.leChamp.lazer.src}
                    alt={media.leChamp.lazer.alt}
                    loading="eager"
                    decoding="sync"
                  />
                </figure>
                <figure className="vrd-screen-frame vrd-lc-main">
                  <img
                    src={media.leChamp.hero.src}
                    alt={media.leChamp.hero.alt}
                    loading="eager"
                    decoding="sync"
                  />
                </figure>
                <figure className="vrd-phone-frame vrd-lc-phone">
                  <img
                    src={media.leChamp.mobile.src}
                    alt={media.leChamp.mobile.alt}
                    loading="eager"
                    decoding="sync"
                  />
                </figure>
              </div>
              <div className="vrd-scene-bar">
                <div>
                  <strong>Landing Page Le Champ Village</strong>
                  <span>Direção de arte editorial, UX/UI e captação qualificada na Av. Champagnat</span>
                </div>
                <a href={media.brand.leChampUrl} target="_blank" rel="noopener noreferrer">
                  Abrir landing page
                  <ArrowUpRight size={16} />
                </a>
              </div>
            </section>

            {/* Scene 1: Le Champ Architecture & Interactive Floor Plans */}
            <section
              className="vrd-scene vrd-scene-plans"
              aria-label="Experiência interativa de plantas e arquitetura Le Champ Village"
            >
              <span className="vrd-bg-word vrd-word-area" aria-hidden="true">
                200 M²
              </span>
              <div className="vrd-plans-space">
                <figure className="vrd-screen-frame vrd-plan-primary">
                  <img
                    src={media.leChamp.plantas.src}
                    alt={media.leChamp.plantas.alt}
                    loading="eager"
                    decoding="sync"
                  />
                </figure>
                <figure className="vrd-screen-frame vrd-plan-secondary">
                  <img
                    src={media.leChamp.casa.src}
                    alt={media.leChamp.casa.alt}
                    loading="eager"
                    decoding="sync"
                  />
                </figure>
              </div>
              <div className="vrd-scene-bar">
                <div>
                  <strong>Arquitetura de Decisão</strong>
                  <span>
                    20 casas em condomínio fechado : aproximadamente 200 m² : 4 dormitórios : 2 vagas cobertas
                  </span>
                </div>
              </div>
            </section>

            {/* Scene 2: Official Property Platform & SaaS Engine */}
            <section
              className="vrd-scene vrd-scene-saas"
              aria-label="Plataforma oficial e sistema imobiliário SaaS da Imobiliária Verdão"
            >
              <span className="vrd-bg-word vrd-word-saas" aria-hidden="true">
                SISTEMA
              </span>
              <div className="vrd-saas-space">
                <figure className="vrd-screen-frame vrd-saas-home">
                  <img
                    src={media.saas.home.src}
                    alt={media.saas.home.alt}
                    loading="eager"
                    decoding="sync"
                  />
                </figure>
                <figure className="vrd-screen-frame vrd-saas-detail">
                  <img
                    src={media.saas.detail.src}
                    alt={media.saas.detail.alt}
                    loading="eager"
                    decoding="sync"
                  />
                </figure>
                <figure className="vrd-screen-frame vrd-saas-catalog">
                  <img
                    src={media.saas.catalog.src}
                    alt={media.saas.catalog.alt}
                    loading="eager"
                    decoding="sync"
                  />
                </figure>
                <figure className="vrd-phone-frame vrd-saas-phone">
                  <img
                    src={media.saas.mobile.src}
                    alt={media.saas.mobile.alt}
                    loading="eager"
                    decoding="sync"
                  />
                </figure>
              </div>
              <div className="vrd-scene-bar">
                <div>
                  <strong>SaaS & Portal Oficial de Imóveis</strong>
                  <span>
                    Motor de busca por tipologia e bairro, gestão de carteira e conversão direta
                  </span>
                </div>
                <a href={media.brand.portalUrl} target="_blank" rel="noopener noreferrer">
                  imobiliariaverdao.com.br
                  <ArrowUpRight size={16} />
                </a>
              </div>
            </section>

            {/* Scene 3: Development Cinema */}
            <section
              className="vrd-scene vrd-scene-cinema"
              aria-label="Filme audiovisual de empreendimento e imóveis à venda"
            >
              <DevelopmentFilm active={scene === 3 && motion} motion={motion} />
              <div className="vrd-scene-bar vrd-scene-bar-cinema">
                <div>
                  <strong>Filmes de Empreendimentos & Imóveis à Venda</strong>
                  <span>Produção e edição audiovisual para lançamentos, condomínios e alto padrão</span>
                </div>
              </div>
            </section>

            {/* Scene 4: 7-Plate Architectural Carousel */}
            <section
              className="vrd-scene vrd-scene-carousel"
              aria-label="Sequência editorial completa do carrossel Le Champ Village"
            >
              <span className="vrd-bg-word vrd-word-editorial" aria-hidden="true">
                EDITORIAL
              </span>
              <div className="vrd-carousel-viewport">
                <div className="vrd-carousel-track">
                  {media.carousel.map((plate) => (
                    <figure className="vrd-carousel-plate" key={plate.src}>
                      <img src={plate.src} alt={plate.alt} loading="eager" decoding="sync" />
                    </figure>
                  ))}
                </div>
              </div>
              <div className="vrd-scene-bar">
                <div>
                  <strong>Narrativa Sequencial de Lançamento</strong>
                  <span>Sete lâminas conectadas que conduzem do desejo espacial à leitura da planta</span>
                </div>
              </div>
            </section>

            {/* Scene 5: Digital Presence Constellation */}
            <section
              className="vrd-scene vrd-scene-presence"
              aria-label="Gestão da presença digital e campanhas sociais da Imobiliária Verdão"
            >
              <span className="vrd-bg-word vrd-word-presence" aria-hidden="true">
                PRESENÇA
              </span>
              <div className="vrd-presence-space">
                {media.social.map((piece) => (
                  <figure
                    key={piece.className}
                    className={`vrd-social-piece vrd-social-${piece.className}`}
                  >
                    <img src={piece.src} alt={piece.alt} loading="eager" decoding="sync" />
                  </figure>
                ))}
              </div>
              <div className="vrd-scene-bar">
                <div>
                  <strong>Gestão da Presença Digital</strong>
                  <span>Posicionamento institucional, curadoria de carteira e campanhas em Poços de Caldas</span>
                </div>
              </div>
            </section>

            {scene >= 0 && (
              <div className="vrd-scene-indicator" aria-hidden="true">
                <span>{SCENE_NAMES[scene]}</span>
              </div>
            )}
            <div className="vrd-edit-progress" aria-hidden="true">
              <span />
            </div>
          </div>
        </section>

        {/* Act 3: Studio Closing */}
        <footer id="contato-case" className="vrd-contact">
          <h2>
            Sua presença.
            <br />
            <span>100% digital.</span>
          </h2>
          <p className="vrd-closing">
            Gestão de presença, landing pages de lançamento, sistemas SaaS e filmes de imóveis.
            <span>Um único ecossistema para posicionar marcas e acelerar negócios.</span>
          </p>
          <a
            className="vrd-contact-main"
            href={contact}
            target="_blank"
            rel="noopener noreferrer"
          >
            Vamos amplificar
            <ArrowUpRight size={38} />
          </a>
          {onContact ? (
            <button type="button" className="vrd-contact-other" onClick={onContact}>
              Outras formas de contato
            </button>
          ) : (
            <a className="vrd-contact-other" href="/contato">
              Outras formas de contato
            </a>
          )}
          <div className="vrd-footer">
            <a href="/" onClick={home}>
              Comunicação Social Ag para Imobiliária Verdão.
            </a>
            <span>Somos a amplificação da sua voz.</span>
            <span>Poços de Caldas, MG</span>
          </div>
        </footer>
      </main>
    </article>
  );
}
