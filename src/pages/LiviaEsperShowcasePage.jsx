import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import { ArrowDown, ArrowLeft, ArrowUpRight, Pause, Play, Volume2, VolumeX, Sparkles, Check, Heart, Shield, Stethoscope, ChevronRight, X } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CaseBrandSignature from '../components/CaseBrandSignature';
import { AGENCY_CONFIG } from '../data/agency';
import { LIVIA_ESPER_CASE as info, LIVIA_ESPER_MEDIA as media } from '../data/liviaEsperShowcase';
import './livia-esper-showcase.css';

gsap.registerPlugin(ScrollTrigger);

function HeroVideo3D({ motion }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [failed, setFailed] = useState(false);
  const manualPause = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let visible = false;
    const sync = () => {
      if (!visible || document.hidden || !motion || manualPause.current) {
        video.pause();
      } else {
        video.play().catch(() => {});
      }
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { threshold: 0.15 }
    );
    observer.observe(video);
    document.addEventListener('visibilitychange', sync);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
      video.pause();
    };
  }, [motion]);

  const togglePlay = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      manualPause.current = false;
      try {
        await video.play();
        setPlaying(true);
      } catch {
        setFailed(true);
      }
    } else {
      manualPause.current = true;
      video.pause();
      setPlaying(false);
    }
  };

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  return (
    <div className="le-hero-video-box">
      <video
        ref={videoRef}
        src={media.hero.video3D}
        poster={media.hero.video3DPoster}
        muted={muted}
        loop
        playsInline
        preload="metadata"
        aria-label="Animação tridimensional dos balões em formato de dente da Dra. Lívia Esper"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setFailed(true)}
      />
      <div className="le-hero-video-actions">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? 'Pausar animação 3D' : 'Reproduzir animação 3D'}
        >
          {playing ? <Pause size={15} /> : <Play size={15} />}
          <span>{playing ? 'Pausar' : 'Reproduzir'}</span>
        </button>
        <button
          type="button"
          onClick={toggleSound}
          aria-label={muted ? 'Ativar som da animação' : 'Silenciar animação'}
          aria-pressed={!muted}
        >
          {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          <span>{muted ? 'Som' : 'Mudo'}</span>
        </button>
      </div>
      {failed && (
        <p className="le-video-fallback" role="alert">
          Vídeo indisponível no navegador. <a href={media.hero.video3D}>Abrir arquivo</a>.
        </p>
      )}
    </div>
  );
}

function ReelPlayer({ reel, motion }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const manualPause = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let visible = false;
    const sync = () => {
      if (!visible || document.hidden || !motion || manualPause.current) {
        video.pause();
      } else {
        video.play().catch(() => {});
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }, { threshold: 0.25 });
    observer.observe(video);
    document.addEventListener('visibilitychange', sync);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
      video.pause();
    };
  }, [motion, reel.video]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      manualPause.current = false;
      video.play().catch(() => {});
      setPlaying(true);
    } else {
      manualPause.current = true;
      video.pause();
      setPlaying(false);
    }
  };

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  return (
    <div className="le-reel-card">
      <div className="le-reel-screen">
        <video
          ref={videoRef}
          src={reel.video}
          poster={reel.poster}
          muted={muted}
          loop
          playsInline
          preload="metadata"
          aria-label={reel.title}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
        <div className="le-reel-controls">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? `Pausar vídeo ${reel.title}` : `Reproduzir vídeo ${reel.title}`}
          >
            {playing ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button
            type="button"
            onClick={toggleSound}
            aria-label={muted ? `Ativar áudio de ${reel.title}` : `Silenciar áudio de ${reel.title}`}
            aria-pressed={!muted}
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>
      </div>
      <div className="le-reel-info">
        <span className="le-reel-tag">{reel.tag}</span>
        <h3>{reel.title}</h3>
        <p>{reel.description}</p>
      </div>
    </div>
  );
}

export default function LiviaEsperShowcasePage({ onClose, onContact }) {
  const rootRef = useRef(null);
  const [motion, setMotion] = useState(
    () => typeof window !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [activeStoryAct, setActiveStoryAct] = useState(0);
  const [activeModalPost, setActiveModalPost] = useState(null);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setMotion(!query.matches);
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  useLayoutEffect(() => {
    if (!motion) return;
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add({ desktop: '(min-width: 761px)', mobile: '(max-width: 760px)' }, (context) => {
        const isMobile = context.conditions.mobile;
        root.classList.add('le-cinematic');

        const scrollConf = (trigger, end = 'bottom top') => ({
          trigger,
          scroller: root,
          start: 'top top',
          end,
          scrub: 0.8,
          invalidateOnRefresh: true,
        });

        // Monumental title arrival
        gsap.fromTo(
          '.le-hero-title span',
          { yPercent: 104 },
          { yPercent: 0, duration: 1.35, stagger: 0.1, ease: 'expo.out' }
        );

        // Hero opening scrub
        const openingTl = gsap.timeline({ scrollTrigger: scrollConf('.le-opening', 'bottom bottom') });
        openingTl
          .to('.le-hero-portrait', { scale: 1.08, xPercent: isMobile ? 0 : -4, duration: 1, ease: 'none' }, 0)
          .to('.le-hero-title', { yPercent: -25, opacity: 0, duration: 0.65, ease: 'power2.in' }, 0)
          .fromTo('.le-opening-thesis', { yPercent: 50, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.7, ease: 'power2.out' }, 0.25)
          .to('.le-hero-shade', { opacity: 0.88, duration: 0.8 }, 0.15);

        // Horizontal post track
        const track = root.querySelector('.le-posts-track');
        if (track) {
          gsap.to(track, {
            x: () => -Math.max(0, track.scrollWidth - root.clientWidth + 48),
            ease: 'none',
            scrollTrigger: scrollConf('.le-posts-gallery', 'bottom bottom'),
          });
        }
      });
    }, root);

    const refresh = () => ScrollTrigger.refresh();
    root.querySelectorAll('img').forEach((img) => {
      if (!img.complete) img.addEventListener('load', refresh, { once: true });
    });
    const frame = requestAnimationFrame(refresh);

    return () => {
      cancelAnimationFrame(frame);
      root.querySelectorAll('img').forEach((img) => img.removeEventListener('load', refresh));
      ctx.revert();
      root.classList.remove('le-cinematic');
    };
  }, [motion]);

  const handleHomeClick = (event) => {
    if (onClose && (event.button === undefined || event.button === 0) && !event.metaKey && !event.ctrlKey) {
      event.preventDefault();
      onClose();
    }
  };

  const jumpTo = (event, id) => {
    const target = rootRef.current?.querySelector(`#${id}`);
    if (!target) return;
    event.preventDefault();
    rootRef.current.scrollTo({ top: target.offsetTop, behavior: motion ? 'smooth' : 'instant' });
    target.focus({ preventScroll: true });
  };

  // Close post modal on Escape key
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && activeModalPost) {
        setActiveModalPost(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeModalPost]);

  const categories = ['Todos', 'Prevenção & Hábitos', 'Dúvidas dos Pais', 'Cotidiano & Conexão', 'Saúde Integral'];
  const filteredPosts = activeCategory === 'Todos'
    ? media.posts
    : media.posts.filter((p) => p.category === activeCategory);

  const contactUrl = AGENCY_CONFIG.getWhatsAppUrl(
    'Olá! Vi o case da Dra. Lívia Esper e quero conversar sobre estratégia, tecnologia e comunicação para a minha clínica.'
  );

  return (
    <article
      ref={rootRef}
      className="le-case"
      data-motion={motion ? 'on' : 'off'}
      aria-labelledby="le-case-title"
    >
      <a className="le-skip" href="#le-overview" onClick={(e) => jumpTo(e, 'le-overview')}>
        Pular abertura
      </a>

      {/* Top Header */}
      <header className="le-header">
        <a href="/" onClick={handleHomeClick} aria-label="Voltar ao início">
          <ArrowLeft size={18} />
          <span>Voltar ao início</span>
        </a>
        <div className="le-header-center">
          <img src="/assets/brand/logo-sem-fundo.png" alt="CS Ag" style={{ width: 22, height: 22, objectFit: 'contain' }} />
          <span>Comunicação Social Ag</span>
        </div>
        <div className="le-header-right">
          <a href="#le-contact" onClick={(e) => jumpTo(e, 'le-contact')} className="le-contact-link">
            Vamos conversar <ArrowUpRight size={17} />
          </a>
          <button
            type="button"
            aria-pressed={!motion}
            aria-label={motion ? 'Pausar animações' : 'Ativar animações'}
            onClick={() => setMotion(!motion)}
          >
            {motion ? <Pause size={18} /> : <Play size={18} />}
          </button>
        </div>
      </header>

      <main>
        {/* Hero Opening */}
        <section className="le-opening">
          <div className="le-hero">
            <div className="le-hero-portrait">
              <img
                src={media.hero.portrait}
                alt="Retrato da Dra. Lívia Esper no consultório pediátrico com jaleco e espelho clínico"
                width="1200"
                height="1600"
                fetchPriority="high"
              />
            </div>
            <div className="le-hero-shade" />

            <div className="le-signature">
              <CaseBrandSignature client="Dra. Lívia Esper" clientLogo={media.hero.logo} />
            </div>

            <div className="le-hero-main">
              <h1 id="le-case-title" className="le-hero-title">
                <span>DRA. LÍVIA</span>
                <span>ESPER</span>
              </h1>
              <div className="le-hero-meta">
                <p>
                  Odontopediatria Especializada USP<br />
                  CRO-MG 30269 • Poços de Caldas, MG
                </p>
                <a href="#le-overview" onClick={(e) => jumpTo(e, 'le-overview')}>
                  Explore o case <ArrowDown size={18} />
                </a>
              </div>
            </div>

            <div className="le-opening-thesis" aria-hidden="true">
              <span>O cuidado ganha encanto,</span>
              <span>método e tecnologia.</span>
            </div>
          </div>
        </section>

        {/* 3D Balloon Animation Feature Banner */}
        <section className="le-3d-banner" aria-label="Abertura tridimensional da marca">
          <div className="le-3d-banner-inner">
            <div className="le-3d-copy">
              <span className="le-kicker-clean">Identidade em Movimento</span>
              <h2>Os três balões de dente ganham vida em 3D.</h2>
              <p>
                A assinatura visual da Dra. Lívia Esper foi traduzida em animação tridimensional com textura esmaltada,
                expressões alegres e movimento orgânico. Uma peça desenvolvida para a abertura do site oficial e introduções
                em vídeo nas redes sociais.
              </p>
            </div>
            <HeroVideo3D motion={motion} />
          </div>
        </section>

        {/* Strategic Overview */}
        <section id="le-overview" className="le-overview" tabIndex={-1}>
          <div className="le-overview-heading">
            <h2>Antes da consulta,<br />uma sensação de<br />segurança.</h2>
          </div>
          <div className="le-overview-content">
            <p className="le-lead">
              A ida ao dentista na infância não precisa ser marcada por choro, tensão ou salas de espera impessoais.
            </p>
            <p>
              Para a Dra. Lívia Esper, a Comunicação Social Ag desenvolveu um ecossistema completo: da marca física
              à tela do celular dos pais, passando por uma narrativa interativa em 3D e um sistema de gestão clínica
              proprietário que eliminou o papel e reduziu faltas.
            </p>
            <div className="le-overview-pillars">
              <div className="le-pillar">
                <Heart size={20} className="le-pillar-icon" />
                <div>
                  <strong>Identidade Afetuosa</strong>
                  <p>Papelaria timbrada, paleta suave e presença acolhedora.</p>
                </div>
              </div>
              <div className="le-pillar">
                <Sparkles size={20} className="le-pillar-icon" />
                <div>
                  <strong>Presença Digital</strong>
                  <p>Reels animados e posts informativos com empatia e técnica.</p>
                </div>
              </div>
              <div className="le-pillar">
                <Stethoscope size={20} className="le-pillar-icon" />
                <div>
                  <strong>Experiência Web 3D</strong>
                  <p>O Reino da Boca com o personagem O Dentinho em 6 atos.</p>
                </div>
              </div>
              <div className="le-pillar">
                <Shield size={20} className="le-pillar-icon" />
                <div>
                  <strong>SaaS Clínico Sob Medida</strong>
                  <p>ERP sob medida com anamnese online e régua de WhatsApp.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Act 1: Brand Identity & Stationery */}
        <section className="le-identity-section" aria-labelledby="le-identity-title">
          <div className="le-section-intro">
            <span className="le-kicker-clean">Identidade Visual</span>
            <h2 id="le-identity-title">A delicadeza como linguagem de marca.</h2>
            <p>
              O logotipo reúne duas silhuetas de crianças segurando três balões em formato de dentes molares.
              Uma composição que expressa leveza e descomplica a odontologia desde o primeiro olhar.
            </p>
          </div>

          <div className="le-palette-strip" aria-label="Paleta cromática do projeto">
            {media.identity.palette.map((color) => (
              <div key={color.hex} className="le-palette-card" style={{ '--chip-color': color.hex }}>
                <span className="le-palette-sample" />
                <strong>{color.name}</strong>
                <code>{color.hex}</code>
                <span>{color.role}</span>
              </div>
            ))}
          </div>

          <div className="le-stationery-grid">
            <figure className="le-stationery-hero">
              <img
                src={media.identity.papelaria}
                alt="Papelaria timbrada oficial da Dra. Lívia Esper com endereço e registro CRO-MG 30269"
                width="2000"
                height="1500"
                loading="lazy"
              />
              <figcaption>
                Papelaria timbrada oficial: Rua Goiás, 64, Centro, Poços de Caldas • CRO-MG 30269
              </figcaption>
            </figure>
            <figure className="le-stationery-secondary">
              <img
                src={media.identity.heroMockup}
                alt="Aplicação da identidade visual em superfície rosa lavanda com papel de carta e envelopes"
                width="1800"
                height="1350"
                loading="lazy"
              />
              <figcaption>
                Aplicação institucional sobre base lavanda suave.
              </figcaption>
            </figure>
          </div>
        </section>

        {/* Act 2: Social Media & Reels */}
        <section className="le-social-section" aria-labelledby="le-social-title">
          <div className="le-section-intro">
            <span className="le-kicker-clean">Presença Digital</span>
            <h2 id="le-social-title">Os posts mais fofos e informativos da odontopediatria.</h2>
            <p>
              Orientação preventiva com rigor científico para os pais, aliada a ilustrações carinhosas e ritmo que
              prendem a atenção das crianças. Uma curadoria viva com conteúdo informativo e ético.
            </p>
          </div>

          {/* Reels Showcase */}
          <div className="le-reels-stage" aria-label="Reels em vídeo produzidos pela agência">
            {media.reels.map((reel) => (
              <ReelPlayer key={reel.id} reel={reel} motion={motion} />
            ))}
          </div>

          {/* Filter Bar */}
          <div className="le-filter-bar" role="toolbar" aria-label="Filtro de publicações por tema">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`le-filter-btn${activeCategory === cat ? ' is-active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Posts Gallery */}
          <div className="le-posts-grid">
            {filteredPosts.map((post) => (
              <figure
                key={post.id}
                className="le-post-card"
                onClick={() => setActiveModalPost(post)}
                tabIndex={0}
                role="button"
                aria-label={`Ver postagem: ${post.title}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveModalPost(post);
                  }
                }}
              >
                <div className="le-post-img-wrap">
                  <img src={post.src} alt={post.title} width="400" height="500" loading="lazy" />
                  <span className="le-post-badge">{post.category}</span>
                </div>
                <figcaption className="le-post-caption">
                  <h4>{post.title}</h4>
                  <p>{post.description}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* Post Quick-View Modal */}
        {activeModalPost && (
          <div className="le-modal-overlay" onClick={() => setActiveModalPost(null)} role="dialog" aria-modal="true">
            <div className="le-modal-box" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="le-modal-close"
                onClick={() => setActiveModalPost(null)}
                aria-label="Fechar visualização"
              >
                <X size={20} />
              </button>
              <div className="le-modal-media">
                <img src={activeModalPost.src} alt={activeModalPost.title} />
              </div>
              <div className="le-modal-body">
                <span className="le-modal-cat">{activeModalPost.category}</span>
                <h3>{activeModalPost.title}</h3>
                <p>{activeModalPost.description}</p>
                <div className="le-modal-footer">
                  <span>Dra. Lívia Esper • @dra.livia_esper</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Act 3: Web Experience (The Kingdom of the Mouth) */}
        <section className="le-web-section" aria-labelledby="le-web-title">
          <div className="le-section-intro">
            <span className="le-kicker-clean">Experiência Web</span>
            <h2 id="le-web-title">O Reino da Boca: scrollytelling lúdico com O Dentinho.</h2>
            <p>
              A experiência digital transforma a clínica em um mundo de fantasia e descobertas.
              Conduzida pelo personagem 3D O Dentinho com sua estrela dourada, a narrativa desmistifica
              o tratamento e conecta pais e crianças antes mesmo da chegada à recepção.
            </p>
          </div>

          <div className="le-web-composition">
            <figure className="le-web-desktop-wrap">
              <img
                src={media.webStory.desktop}
                alt="Abertura do site da Dra. Lívia Esper com o personagem 3D O Dentinho no céu estrelado"
                width="2400"
                height="1500"
                loading="lazy"
              />
              <figcaption>
                Experiência imersiva em desktop: vídeo scrubber interativo e narrativa em 6 atos.
              </figcaption>
            </figure>
            <figure className="le-web-mobile-wrap">
              <img
                src={media.webStory.mobile}
                alt="Interface mobile do site draliviaesper.com demonstrando especialidades clínicas e condicionamento infantil"
                width="828"
                height="1792"
                loading="lazy"
              />
              <figcaption>
                Navegação mobile com especialidades e marcação em 1 toque.
              </figcaption>
            </figure>
          </div>

          {/* Interactive Acts Showcase */}
          <div className="le-story-acts">
            <div className="le-acts-header">
              <h3>Os 6 Atos da Jornada</h3>
              <p>Cada ato cumpre uma função psicológica na redução da ansiedade infantil:</p>
            </div>
            <div className="le-acts-nav" role="tablist">
              {media.webStory.acts.map((act, index) => (
                <button
                  key={act.num}
                  type="button"
                  role="tab"
                  aria-selected={activeStoryAct === index}
                  className={`le-act-tab${activeStoryAct === index ? ' is-active' : ''}`}
                  onClick={() => setActiveStoryAct(index)}
                >
                  <span className="le-act-tab-num">{act.num}</span>
                  <span className="le-act-tab-name">{act.title}</span>
                </button>
              ))}
            </div>
            <div className="le-act-content-box" role="tabpanel">
              <div className="le-act-number">Ato {media.webStory.acts[activeStoryAct].num}</div>
              <h4>{media.webStory.acts[activeStoryAct].subtitle}</h4>
              <p>{media.webStory.acts[activeStoryAct].summary}</p>
            </div>
          </div>
        </section>

        {/* Act 4: Custom Clinical SaaS */}
        <section className="le-system-section" aria-labelledby="le-system-title">
          <div className="le-section-intro">
            <span className="le-kicker-clean">Engenharia de Software</span>
            <h2 id="le-system-title">Sistema de gestão clínica sob medida.</h2>
            <p>
              Softwares médicos convencionais foram pensados para adultos e ignoram as particularidades da odontopediatria.
              Desenvolvemos um software proprietário full-stack que acompanha a dinâmica real da cadeira clínica.
            </p>
          </div>

          <figure className="le-system-figure">
            <img
              src={media.system.desktop}
              alt="Dashboard do sistema de gestão clínica da Dra. Lívia Esper com agenda pediátrica, insights de IA e alertas de comportamento"
              width="2400"
              height="1500"
              loading="lazy"
            />
            <figcaption>
              Dashboard clínico: fila da cadeira pediátrica, insights diários por IA e controle de faltas em tempo real.
            </figcaption>
          </figure>

          <div className="le-system-pillars">
            {media.system.pillars.map((pillar) => (
              <div key={pillar.title} className="le-system-pillar-card">
                <div className="le-pillar-bullet" />
                <h4>{pillar.title}</h4>
                <p>{pillar.description}</p>
              </div>
            ))}
          </div>

          <div className="le-tech-specs">
            <div>
              <strong>Front-End</strong>
              <span>React 19 & GSAP</span>
            </div>
            <div>
              <strong>Back-End</strong>
              <span>Firebase Firestore em tempo real</span>
            </div>
            <div>
              <strong>Prontuário</strong>
              <span>Odontograma decíduo touch no iPad</span>
            </div>
            <div>
              <strong>Comunicação</strong>
              <span>Automação WhatsApp & Token de Anamnese</span>
            </div>
          </div>
        </section>

        {/* Act 5: About the Doctor */}
        <section className="le-doctor-section" aria-labelledby="le-doctor-title">
          <div className="le-doctor-card">
            <div className="le-doctor-img">
              <img
                src={media.hero.portraitAbout}
                alt="Dra. Lívia Esper em sua mesa de atendimento no consultório"
                width="764"
                height="1024"
                loading="lazy"
              />
            </div>
            <div className="le-doctor-info">
              <span className="le-kicker-clean">A Profissional</span>
              <h2 id="le-doctor-title">Dra. Lívia Esper</h2>
              <p className="le-doctor-creds">
                Cirurgiã-Dentista • Especialista em Odontopediatria pela USP<br />
                Inscrição no Conselho: CRO-MG 30269
              </p>
              <div className="le-doctor-bio">
                <p>
                  Com sólida formação acadêmica e foco exclusivo no público infantil, a Dra. Lívia Esper alia
                  técnicas modernas de odontologia minimamente invasiva ao condicionamento psicológico positivo.
                </p>
                <p>
                  Sua prática é pautada na prevenção precoce, no acompanhamento do crescimento craniofacial e na construção
                  de memórias afetivas positivas com a saúde bucal.
                </p>
              </div>
              <ul className="le-doctor-checks">
                <li><Check size={16} /> Especialização de referência pela Universidade de São Paulo (USP)</li>
                <li><Check size={16} /> Consultório estruturado para conforto infantil e dos responsáveis</li>
                <li><Check size={16} /> Atendimento em estrita conformidade com o Código de Ética Odontológica</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Contact and Agency Closing */}
        <section id="le-contact" className="le-close-section" tabIndex={-1}>
          <div className="le-close-content">
            <span className="le-kicker-clean">Comunicação Estratégica em Saúde</span>
            <h2>CADA DETALHE DO CUIDADO COMUNICA.</h2>
            <p>
              Estratégia de marca, direção de arte, animação 3D e engenharia de software.<br />
              Uma mesma direção para amplificar a autoridade e o afeto da sua clínica.
            </p>
            <div className="le-close-actions">
              <a href={contactUrl} target="_blank" rel="noopener noreferrer" className="le-btn-main">
                Vamos falar sobre o seu projeto <ArrowUpRight size={20} />
              </a>
            </div>
          </div>

          <footer className="le-footer">
            <div className="le-footer-links">
              <span>Outros cases da CS Ag:</span>
              <a href="/trabalhos/ponto-cor">Ponto Cor</a>
              <a href="/trabalhos/alberto-brasil">Dr. Alberto Brasil</a>
              <a href="/trabalhos/dubola">Dubola</a>
              <a href="/trabalhos/verdao">Imobiliária Verdão</a>
            </div>
            <div className="le-footer-compliance">
              <span>Dra. Lívia Esper • Odontopediatra Especialista USP • CRO-MG 30269</span>
              <span>Rua Goiás, 64, Centro, Poços de Caldas, MG • Tel: (35) 3721-7858</span>
            </div>
            <div className="le-footer-agency">
              <a href="/contato" onClick={(e) => {
                if (onContact && !e.metaKey && !e.ctrlKey) {
                  e.preventDefault();
                  onContact();
                }
              }}>
                Comunicação Social Ag • Somos a amplificação da sua voz.
              </a>
            </div>
          </footer>
        </section>
      </main>
    </article>
  );
}
