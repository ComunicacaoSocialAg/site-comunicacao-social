import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowUpRight, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AGENCY_CONFIG } from '../data/agency';
import { DUBOLA_SHOWCASE as media } from '../data/dubolaShowcase';
import './dubola-showcase.css';
import CaseBrandSignature from '../components/CaseBrandSignature';

gsap.registerPlugin(ScrollTrigger);

const SCENE_NAMES = [
  'Linha de Embalagens',
  'Maioneses',
  'Molhos de Tomate',
  'Ketchups',
  'Identidade em Ação',
  'Embalagens de Transporte',
  'Linha de Cozinha & Brindes',
  'Comunicação de PDV',
  'Portal Digital & Catálogo',
  'Cinema Gastronômico',
];

const SCENE_DETAILS = [
  'Arquitetura de rótulos e embalagens para mesa e cozinhas profissionais',
  'Quatro sabores, quatro cores de rótulo, uma só família',
  'Rótulo dourado e cor por sabor em potes de vidro',
  'Tradicional, com goiaba e picante no mesmo sistema de rótulos',
  'Aplicação em uniformes operacionais e presença de equipe',
  'Sacolas kraft com ilustração proprietária de ingredientes e ponto de contato',
  'Pano de prato com arte botânica de tomates frescos e lettering da marca',
  'Windbanners de alta visibilidade para eventos e distribuidores',
  'Landing page oficial dubola.com.br com apresentação de linhas e captação B2B',
  'Direção de arte e filme da linha Barbecue focado em apetite appeal',
];

const SCENE_STARTS = [0, 1.12, 2.2, 3.28, 4.36, 5.5, 6.56, 7.62, 8.66, 9.88];

function HeroVideo({ motion, compact }) {
  const videoRef = useRef(null);
  const manualPause = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [failed, setFailed] = useState(false);
  const source = compact ? media.hero.mobile : media.hero.desktop;

  useEffect(() => {
    const video = videoRef.current;
    let visible = false;
    const sync = () => {
      if (!visible || document.hidden || !motion) video.pause();
      else if (!manualPause.current) video.play().catch(() => {});
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: 0.12 });
    observer.observe(video);
    document.addEventListener('visibilitychange', sync);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', sync); video.pause(); };
  }, [motion, source]);

  async function toggle() {
    const video = videoRef.current;
    if (video.paused) {
      manualPause.current = false;
      try { await video.play(); } catch { setFailed(true); }
    } else { manualPause.current = true; video.pause(); }
  }

  return <>
    <video ref={videoRef} className="dbx-hero-video" src={source} poster={compact ? media.hero.mobilePoster : media.hero.poster}
      muted={muted} loop playsInline preload="metadata" aria-label="Reel 2 Dubola fornecido para a abertura do case"
      onPlay={() => { setPlaying(true); setFailed(false); }} onPause={() => setPlaying(false)} onError={() => setFailed(true)} />
    <div className="dbx-video-controls">
      <button type="button" onClick={toggle} aria-label={playing ? 'Pausar vídeo de abertura' : 'Reproduzir vídeo de abertura'}>
        {playing ? <Pause size={17} /> : <Play size={17} />}<span>{playing ? 'Pausar' : 'Reproduzir'}</span>
      </button>
      <button type="button" onClick={() => setMuted(!muted)} aria-label={muted ? 'Ativar som do vídeo' : 'Silenciar vídeo'} aria-pressed={!muted}>
        {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}<span>{muted ? 'Ativar som' : 'Silenciar'}</span>
      </button>
    </div>
    {failed && <p className="dbx-video-error" role="alert">O vídeo não carregou. <a href={source}>Abrir o vídeo</a>.</p>}
  </>;
}

function CampaignVideo({ active, motion }) {
  const ref = useRef(null);
  useEffect(() => {
    const video = ref.current;
    let visible = false;
    const sync = () => {
      if (!visible || document.hidden || (motion && !active)) video.pause();
      else if (active) video.play().catch(() => {});
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: 0.12 });
    observer.observe(video);
    document.addEventListener('visibilitychange', sync);
    return () => { observer.disconnect(); video.pause(); document.removeEventListener('visibilitychange', sync); };
  }, [active, motion]);
  return <video ref={ref} controls={!motion} src={media.campaignVideo} poster={media.campaign.src} aria-label="Animação de produto da linha Barbecue Dubola" muted loop playsInline preload="none" />;
}

export default function DubolaShowcasePage({ onClose, onContact }) {
  const rootRef = useRef(null);
  const [motion, setMotion] = useState(() => typeof window !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [compact, setCompact] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches);
  const [scene, setScene] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobile = window.matchMedia('(max-width: 768px)');
    const onMotion = () => setMotion(!reduced.matches);
    const onSize = () => setCompact(mobile.matches);
    reduced.addEventListener('change', onMotion); mobile.addEventListener('change', onSize);
    return () => { reduced.removeEventListener('change', onMotion); mobile.removeEventListener('change', onSize); };
  }, []);

  useLayoutEffect(() => {
    if (!motion) return;
    const root = rootRef.current;
    const runway = root.querySelector('.dbx-runway');
    const scenes = [...root.querySelectorAll('.dbx-scene')];
    let lastScene = 0;
    root.classList.add('is-cinematic');

    const context = gsap.context(() => {
      gsap.fromTo('.dbx-title-letter', { yPercent: 104, rotateX: -65 }, {
        yPercent: 0, rotateX: 0, stagger: 0.05, duration: 1.05, ease: 'power4.out',
      });

      gsap.fromTo('.dbx-statement-line', { xPercent: (i) => (i === 0 ? -18 : 18) }, {
        xPercent: 0, ease: 'none', scrollTrigger: {
          trigger: '.dbx-statement', scroller: root, start: 'top bottom', end: 'center center', scrub: 0.7,
        },
      });

      gsap.set('.dbx-product', { x: 0, y: 0, xPercent: -50, yPercent: -50 });
      gsap.set(scenes, { autoAlpha: 0 });
      gsap.set(scenes[0], { autoAlpha: 1 });
      const edit = gsap.timeline({ scrollTrigger: {
        trigger: runway, scroller: root, start: 'top top', end: 'bottom bottom', scrub: 0.85,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          root.style.setProperty('--dbx-progress', self.progress);
          const at = self.progress * edit.duration();
          let next = 0;
          SCENE_STARTS.forEach((t, i) => { if (at >= t - 0.1) next = i; });
          if (next !== lastScene) { lastScene = next; setScene(next); }
        },
        onLeave: () => setScene(-1),
        onEnterBack: () => setScene(SCENE_NAMES.length - 1),
        onLeaveBack: () => setScene(-1),
      } });

      // Scene 0: Products in depth
      if (compact) {
        edit.fromTo('.dbx-product-mustard',
          { xPercent: -56, yPercent: -42, rotation: -14, scale: 0.85 },
          { xPercent: -50, yPercent: -50, rotation: -8, scale: 1, duration: 0.72, ease: 'expo.out' },
          0
        )
        .fromTo('.dbx-product-ketchup',
          { xPercent: -50, yPercent: -42, rotation: 5, scale: 0.95 },
          { xPercent: -50, yPercent: -50, rotation: -2.5, scale: 1, duration: 0.72, ease: 'expo.out' },
          0
        )
        .fromTo('.dbx-product-guava',
          { xPercent: -46, yPercent: -54, rotation: -5, scale: 0.92 },
          { xPercent: -50, yPercent: -50, rotation: 3.5, scale: 1, duration: 0.72, ease: 'expo.out' },
          0
        )
        .fromTo('.dbx-product-mayo',
          { xPercent: -44, yPercent: -44, rotation: 6, scale: 0.85 },
          { xPercent: -50, yPercent: -50, rotation: 1.5, scale: 1, duration: 0.72, ease: 'expo.out' },
          0
        );
      } else {
        edit.fromTo('.dbx-product-mustard', { xPercent: -62, yPercent: -42, rotation: -20, rotationY: 18, z: -120, scale: 0.88 }, { xPercent: -50, yPercent: -50, rotation: -9, rotationY: 0, z: 0, scale: 1, duration: 0.72, ease: 'expo.out' }, 0)
          .fromTo('.dbx-product-ketchup', { xPercent: -50, yPercent: -40, rotation: 8, z: 120, scale: 1.02 }, { xPercent: -50, yPercent: -50, rotation: -3, z: 0, scale: 1, duration: 0.72, ease: 'expo.out' }, 0)
          .fromTo('.dbx-product-guava', { xPercent: -35, yPercent: -60, rotation: -12, z: -80 }, { xPercent: -50, yPercent: -50, rotation: 8, z: 0, duration: 0.72, ease: 'expo.out' }, 0)
          .fromTo('.dbx-product-mayo', { xPercent: -28, yPercent: -50, rotation: 8, z: -120 }, { xPercent: -50, yPercent: -50, rotation: 0, z: 0, duration: 0.72, ease: 'expo.out' }, 0);
      }

      edit.to('.dbx-products-word', { xPercent: compact ? -5 : -8, duration: 1.4, ease: 'none' }, 0);

      // Scenes 1-3: packaging lines
      edit.set(scenes[1], { autoAlpha: 1 }, 1.12)
        .fromTo(scenes[1], { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.55, ease: 'power3.inOut', immediateRender: false }, 1.12)
        .fromTo('.dbx-line-mayo-line img', { scale: 1.12 }, { scale: 1, duration: 1.1, ease: 'none', immediateRender: false }, 1.12)
        .set(scenes[0], { autoAlpha: 0 }, 1.7);

      edit.set(scenes[2], { autoAlpha: 1 }, 2.2)
        .fromTo(scenes[2], { xPercent: 100 }, { xPercent: 0, duration: 0.6, ease: 'power3.inOut', immediateRender: false }, 2.2)
        .to(scenes[1], { xPercent: -24, duration: 0.6, ease: 'power3.inOut' }, 2.2)
        .fromTo('.dbx-line-tomato-line img', { scale: 1.12 }, { scale: 1, duration: 1.1, ease: 'none', immediateRender: false }, 2.2)
        .set(scenes[1], { autoAlpha: 0 }, 2.81);

      edit.set(scenes[3], { autoAlpha: 1 }, 3.28)
        .fromTo(scenes[3], { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.55, ease: 'power3.inOut', immediateRender: false }, 3.28)
        .fromTo('.dbx-line-ketchup-line img', { scale: 1.12 }, { scale: 1, duration: 1.1, ease: 'none', immediateRender: false }, 3.28)
        .set(scenes[2], { autoAlpha: 0 }, 3.83);

      // Scene 4: Apron
      edit.set(scenes[4], { autoAlpha: 1 }, 4.36)
        .fromTo(scenes[4], { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.55, ease: 'power3.inOut', immediateRender: false }, 4.36)
        .fromTo('.dbx-apron img', { scale: 1.15, yPercent: 3 }, { scale: 1, yPercent: 0, duration: 1.3, ease: 'none', immediateRender: false }, 4.36)
        .set(scenes[3], { autoAlpha: 0 }, 4.91);

      // Scene 5: Bag
      edit.set(scenes[5], { autoAlpha: 1 }, 5.5)
        .fromTo(scenes[5], { xPercent: 100 }, { xPercent: 0, duration: 0.6, ease: 'power3.inOut', immediateRender: false }, 5.5)
        .to(scenes[4], { xPercent: -24, duration: 0.6, ease: 'power3.inOut' }, 5.5)
        .fromTo('.dbx-bag img', { scale: 1.14, xPercent: 2 }, { scale: 1.04, xPercent: -1, duration: 1.1, ease: 'none', immediateRender: false }, 5.5)
        .set(scenes[4], { autoAlpha: 0 }, 6.11);

      // Scene 6: Towel
      edit.set(scenes[6], { autoAlpha: 1 }, 6.56)
        .fromTo(scenes[6], { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.55, ease: 'power3.inOut', immediateRender: false }, 6.56)
        .fromTo('.dbx-towel img', { scale: 1.12 }, { scale: 1, duration: 1.1, ease: 'none', immediateRender: false }, 6.56)
        .set(scenes[5], { autoAlpha: 0 }, 7.09);

      // Scene 7: Flags
      edit.set(scenes[7], { autoAlpha: 1 }, 7.62)
        .fromTo(scenes[7], { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6, ease: 'power3.inOut', immediateRender: false }, 7.62)
        .fromTo('.dbx-flags img', { yPercent: 10, scale: 0.9 }, { yPercent: 0, scale: 1, duration: 1.1, ease: 'power2.out', immediateRender: false }, 7.62)
        .set(scenes[6], { autoAlpha: 0 }, 8.26);

      // Scene 8: Digital
      edit.set(scenes[8], { autoAlpha: 1 }, 8.66)
        .fromTo(scenes[8], { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.55, ease: 'power3.inOut', immediateRender: false }, 8.66);

      if (compact) {
        edit.fromTo('.dbx-landing-image',
          { scale: 0.9, rotation: -2, yPercent: 4 },
          { scale: 1, rotation: 0, yPercent: 0, duration: 1.2, ease: 'power2.out', immediateRender: false },
          8.66
        );
      } else {
        edit.fromTo('.dbx-landing-image',
          { scale: 0.72, rotation: -9, rotationY: -16, xPercent: 13, yPercent: 10 },
          { scale: 1.08, rotation: 0, rotationY: 0, xPercent: 0, yPercent: 0, duration: 1.4, ease: 'power2.inOut', immediateRender: false },
          8.66
        );
      }

      edit.to('.dbx-digital-word', { xPercent: compact ? -10 : -20, duration: 1.3, ease: 'none' }, 8.66)
        .set(scenes[7], { autoAlpha: 0 }, 9.25);

      // Scene 9: Campaign Film
      edit.set(scenes[9], { autoAlpha: 1 }, 9.88)
        .fromTo(scenes[9], { clipPath: 'inset(0% 0% 0% 100%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.55, ease: 'power3.inOut', immediateRender: false }, 9.88)
        .set(scenes[8], { autoAlpha: 0 }, 10.44)
        .to('.dbx-campaign video', { scale: 1.04, duration: 0.8, ease: 'none' }, 10.44);
    }, root);

    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(frame); context.revert(); root.classList.remove('is-cinematic');
      root.style.removeProperty('scroll-behavior'); root.style.removeProperty('--dbx-progress');
    };
  }, [motion, compact]);

  function home(event) {
    if (onClose && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && (event.button === undefined || event.button === 0)) { event.preventDefault(); onClose(); }
  }
  const contact = AGENCY_CONFIG.getWhatsAppUrl('Olá! Vi o trabalho para a Dubola e quero conversar sobre a minha marca.');

  return <article ref={rootRef} className="client-case dbx-case" data-motion={motion ? 'on' : 'off'} aria-labelledby="dbx-title">
    <a className="dbx-skip" href="#contato-case">Ir para o contato</a>
    <header className="dbx-header">
      <a href="/" onClick={home} className="dbx-back" aria-label="Voltar ao início"><ArrowLeft size={18} /><span>Voltar ao início</span></a>
      <a href="/" onClick={home} aria-label="Comunicação Social Ag" className="dbx-agency"><img src="/assets/brand/logo-sem-fundo.png" width="65" height="34" alt="Comunicação Social Ag" /></a>
      <div className="dbx-header-right"><a href="#contato-case">Vamos conversar<ArrowUpRight size={17} /></a>
        <button type="button" onClick={() => setMotion(!motion)} aria-label={motion ? 'Pausar animações' : 'Ativar animações'} aria-pressed={motion}>
          {motion ? <Pause size={16} /> : <Play size={16} />}
        </button>
      </div>
    </header>
    <main>
      <section className="dbx-hero" aria-labelledby="dbx-title">
        <HeroVideo motion={motion} compact={compact} />
        <div className="dbx-hero-shade" aria-hidden="true" />
        <div className="dbx-hero-signature"><CaseBrandSignature client="Dubola" clientLogo="/assets/cases/dubola/logo-dubola.svg" /></div>
        <h1 id="dbx-title" className="dbx-hero-title" aria-label="Dubola">
          {'DUBOLA'.split('').map((letter, i) => <span className="dbx-title-mask" key={i}><span className="dbx-title-letter" aria-hidden="true">{letter}</span></span>)}
        </h1>
        <div className="dbx-hero-bottom"><p>Branding, design<br />e comunicação integrada.</p><a href="#trabalho">Explore o trabalho<ArrowDown size={20} /></a></div>
      </section>

      <section className="dbx-statement" aria-labelledby="dbx-statement-title">
        <h2 id="dbx-statement-title"><span className="dbx-statement-line">DE PONTA</span><span className="dbx-statement-line">A PONTA.</span></h2>
        <p>Estratégia, branding, embalagens, campanhas, catálogos, digital, eventos e experiências de marca. Uma agência multidisciplinar que cuida do conjunto.</p>
      </section>

      <section id="trabalho" className="dbx-runway" aria-label="Exposição dos trabalhos da Comunicação Social Ag para Dubola">
        <div className="dbx-stage">
          <section className="dbx-scene dbx-products" aria-label="Design de embalagens Dubola">
            <span className="dbx-products-word" aria-hidden="true">DUBOLA</span>
            <div className="dbx-product-space">{media.products.map((product) => <img key={product.className} className={`dbx-product dbx-product-${product.className}`} src={product.src} alt={product.alt} loading="eager" decoding="async" />)}</div>
          </section>
          {media.lines.map((line) => <section key={line.className} className={`dbx-scene dbx-line dbx-line-${line.className}`} aria-label={line.alt}><img src={line.src} alt={line.alt} loading="eager" decoding="async" /></section>)}
          <section className="dbx-scene dbx-apron" aria-label="Aplicação da marca em uniforme"><img src={media.apron.src} alt={media.apron.alt} loading="eager" decoding="async" /></section>
          <section className="dbx-scene dbx-bag" aria-label="Design de saco de papel"><img src={media.bag.src} alt={media.bag.alt} loading="eager" decoding="async" /></section>
          <section className="dbx-scene dbx-towel" aria-label="Material de promoção"><img src={media.towel.src} alt={media.towel.alt} loading="eager" decoding="async" /></section>
          <section className="dbx-scene dbx-flags" aria-label="Sinalização de marca"><img src={media.flags.src} alt={media.flags.alt} loading="eager" decoding="async" /></section>
          <section className="dbx-scene dbx-digital" aria-label="Design e desenvolvimento da landing page"><span className="dbx-digital-word" aria-hidden="true">DIGITAL</span><img className="dbx-landing-image" src={media.landing.src} alt={media.landing.alt} loading="eager" decoding="async" /></section>
          <section className="dbx-scene dbx-campaign" aria-label="Direção de arte e animação de produto"><CampaignVideo active={scene === SCENE_NAMES.length - 1 && motion} motion={motion} /></section>
          
          {scene >= 0 && scene < SCENE_NAMES.length && (
            <div className="dbx-scene-bar">
              <div>
                <strong>{SCENE_NAMES[scene]}</strong>
                <span>{SCENE_DETAILS[scene]}</span>
              </div>
            </div>
          )}
          {scene >= 0 && scene < SCENE_NAMES.length && (
            <div className="dbx-scene-indicator" aria-hidden="true">
              <span>{SCENE_NAMES[scene]}</span>
            </div>
          )}

          <div className="dbx-edit-progress" aria-hidden="true"><span /></div>
        </div>
      </section>

      <footer id="contato-case" className="dbx-contact">
        <h2>Sua marca.<br /><span>Por inteiro.</span></h2>
        <p className="dbx-closing">Estratégia, branding, design, comunicação e experiência.<span>Tudo em sintonia para amplificar a sua marca.</span></p>
        <a className="dbx-contact-main" href={contact} target="_blank" rel="noopener noreferrer">Vamos amplificar<ArrowUpRight size={38} /></a>
        {onContact ? <button type="button" className="dbx-contact-other" onClick={onContact}>Outras formas de contato</button> : <a className="dbx-contact-other" href="/contato">Outras formas de contato</a>}
        <div className="dbx-footer"><a href="/" onClick={home}>Comunicação Social Ag para Dubola.</a><span>Somos a amplificação da sua voz.</span><span>Poços de Caldas, MG</span></div>
      </footer>
    </main>
  </article>;
}
