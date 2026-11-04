import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowUpRight, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CaseBrandSignature from '../components/CaseBrandSignature';
import LiviaSocialGallery from '../components/LiviaSocialGallery';
import { AGENCY_CONFIG } from '../data/agency';
import { LIVIA_ESPER_MEDIA as media } from '../data/liviaEsperShowcase';
import './livia-esper-showcase.css';

gsap.registerPlugin(ScrollTrigger);
const base = '/assets/cases/livia-esper/';
const screens = `${base}screens/`;
const chapters = ['Entrar no universo', 'Percorrer a história', 'Levar para perto'];

function Film({ src, poster, label, motion, className = '', sound = false }) {
  const ref = useRef(null);
  const manualPause = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const video = ref.current;
    let visible = false;
    const sync = () => {
      if (!visible || document.hidden || !motion || manualPause.current) video.pause();
      else video.play().catch(() => {});
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }, { threshold: 0.12 });
    observer.observe(video);
    document.addEventListener('visibilitychange', sync);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
      video.pause();
    };
  }, [motion]);
  const toggle = () => {
    const video = ref.current;
    if (video.paused) {
      manualPause.current = false;
      video.play().catch(() => setFailed(true));
    } else {
      manualPause.current = true;
      video.pause();
    }
  };
  return <div className={`le-film ${className}`}>
    <video ref={ref} src={src} poster={poster} loop muted={muted} playsInline preload="none"
      aria-label={label} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setFailed(true)} />
    <div className="le-film-controls">
      <button type="button" onClick={toggle} aria-label={`${playing ? 'Pausar' : 'Reproduzir'}: ${label}`}>
        {playing ? <Pause size={16} /> : <Play size={16} />}<span>{playing ? 'Pausar filme' : 'Assistir filme'}</span>
      </button>
      {sound && <button type="button" aria-label={muted ? 'Ativar som' : 'Silenciar'} aria-pressed={!muted}
        onClick={() => setMuted(!muted)}>{muted ? <VolumeX size={17} /> : <Volume2 size={17} />}</button>}
    </div>
    {failed && <a className="le-film-error" href={src}>Abrir o filme em outra aba <ArrowUpRight size={16} /></a>}
  </div>;
}

function Screen({ file, alt, className = '', eager = false }) {
  return <figure className={`le-screen ${className}`}><img src={`${screens}${file}`} alt={alt}
    width={file.includes('mobile') ? 390 : 1280} height={file.includes('mobile') ? 844 : 720}
    loading={eager ? 'eager' : 'lazy'} decoding="async" /></figure>;
}

export default function LiviaEsperShowcasePage({ onClose, onContact }) {
  const rootRef = useRef(null);
  const runwayRef = useRef(null);
  const [motion, setMotion] = useState(() => typeof window !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [chapter, setChapter] = useState(0);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setMotion(!query.matches);
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!motion || !root) return;
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      gsap.fromTo('.le-title-line', { y: 35, opacity: 0.5 }, { y: 0, opacity: 1, duration: 1.25, stagger: 0.09, ease: 'expo.out' });
      gsap.to('.le-hero-image', { yPercent: 15, scale: 1.08, ease: 'none',
        scrollTrigger: { trigger: '.le-opening', scroller: root, start: 'top top', end: 'bottom top', scrub: 0.8 } });
      mm.add('(min-width: 761px)', () => {
        root.classList.add('le-cinematic');
        const scenes = gsap.utils.toArray('.le-web-scene');
        gsap.set(scenes.slice(1), { autoAlpha: 0 });
        const tl = gsap.timeline({ scrollTrigger: {
          trigger: runwayRef.current, scroller: root, start: 'top top', end: 'bottom bottom', scrub: 0.85,
          invalidateOnRefresh: true, onUpdate: self => setChapter(self.progress < 0.36 ? 0 : self.progress < 0.7 ? 1 : 2),
        }});
        tl.fromTo('.le-screen-opening', { rotationY: -16, rotationX: 9, rotationZ: -4, scale: 0.78, yPercent: 8 },
          { rotationY: 0, rotationX: 0, rotationZ: 0, scale: 1.05, yPercent: 0, duration: 1.1, ease: 'power2.inOut' }, 0)
          .to('.le-web-scene-first .le-scene-heading', { y: -35, opacity: 0, duration: 0.35 }, 0.75)
          .to(scenes[0], { autoAlpha: 0, yPercent: -12, duration: 0.35 }, 1.2)
          .fromTo(scenes[1], { yPercent: 16, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.45 }, 1.2)
          .fromTo('.le-screen-adventure', { rotationZ: -6, xPercent: -7 }, { rotationZ: -2, xPercent: 3, duration: 0.9 }, 1.4)
          .fromTo('.le-screen-affection', { yPercent: 25, rotationZ: 8 }, { yPercent: -7, rotationZ: 3, duration: 0.9 }, 1.4)
          .to(scenes[1], { autoAlpha: 0, yPercent: -12, duration: 0.35 }, 2.5)
          .fromTo(scenes[2], { autoAlpha: 0, yPercent: 15 }, { autoAlpha: 1, yPercent: 0, duration: 0.4 }, 2.5)
          .fromTo('.le-screen-about', { xPercent: -10, rotationY: 9 }, { xPercent: 0, rotationY: 0, duration: 0.8 }, 2.6)
          .fromTo('.le-screen-phone', { yPercent: 16, rotationZ: 5 }, { yPercent: -6, rotationZ: 0, duration: 0.8 }, 2.6)
          .to({}, { duration: 0.35 });
        return () => root.classList.remove('le-cinematic');
      });
    }, root);
    const refresh = () => ScrollTrigger.refresh();
    const images = [...root.querySelectorAll('img')];
    images.forEach(img => { if (!img.complete) img.addEventListener('load', refresh, { once: true }); });
    let alive = true;
    document.fonts.ready.then(() => { if (alive) refresh(); });
    const frame = requestAnimationFrame(refresh);
    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      images.forEach(img => img.removeEventListener('load', refresh));
      mm.revert();
      ctx.revert();
    };
  }, [motion]);

  const jump = (event, id) => {
    const target = rootRef.current.querySelector(`#${id}`);
    if (!target) return;
    event.preventDefault();
    rootRef.current.scrollTo({ top: target.offsetTop - 68, behavior: motion ? 'smooth' : 'instant' });
    target.focus({ preventScroll: true });
  };
  const goChapter = index => {
    const runway = runwayRef.current;
    rootRef.current.scrollTo({ top: runway.offsetTop + (runway.offsetHeight - rootRef.current.clientHeight) * [0.14, 0.5, 0.88][index], behavior: motion ? 'smooth' : 'instant' });
  };
  const contact = AGENCY_CONFIG.getWhatsAppUrl('Olá! Vi o case da Dra. Lívia Esper e quero conversar sobre um projeto para a minha marca.');
  const home = event => {
    if (onClose && !event.metaKey && !event.ctrlKey && event.button === 0) { event.preventDefault(); onClose(); }
  };

  return <article ref={rootRef} className="le-case" data-motion={motion ? 'on' : 'off'} aria-labelledby="le-case-title">
    <a className="le-skip" href="#le-overview" onClick={e => jump(e, 'le-overview')}>Pular abertura</a>
    <header className="le-header">
      <a href="/" onClick={home}><ArrowLeft size={17} /><span>Todos os trabalhos</span></a>
      <a className="le-header-name" href="#le-overview" onClick={e => jump(e, 'le-overview')}>Dra. Lívia Esper</a>
      <div className="le-header-actions"><a href="#le-contact" onClick={e => jump(e, 'le-contact')}>Seu projeto <ArrowUpRight size={17} /></a>
        <button type="button" onClick={() => setMotion(!motion)} aria-label={motion ? 'Pausar animações' : 'Ativar animações'} aria-pressed={!motion}>{motion ? <Pause size={16} /> : <Play size={16} />}</button>
      </div>
    </header>
    <main>
      <section className="le-opening" aria-label="Dra. Lívia Esper: branding, comunicação e tecnologia">
        <div className="le-hero-image"><Film src={`${base}universo-dentinho.mp4`} poster={`${base}universo-poster.webp`} label="O universo do Dentinho" motion={motion} /></div>
        <div className="le-signature"><CaseBrandSignature client="Dra. Lívia Esper" clientLogo={media.hero.logo} /></div>
        <div className="le-hero-copy"><h1 id="le-case-title"><span className="le-title-line">Pequenos sorrisos.</span><span className="le-title-line">Um universo inteiro.</span></h1>
          <div className="le-hero-bottom"><p>Branding, presença digital,<br />site e SaaS para a Dra. Lívia Esper.</p><a href="#le-overview" onClick={e => jump(e, 'le-overview')}>Entre nessa história <ArrowDown size={19} /></a></div>
        </div>
      </section>
      <section className="le-overview le-padding" id="le-overview" tabIndex={-1}>
        <h2>O afeto é a origem.<br />A marca é o fio condutor.</h2>
        <div><p>Uma identidade que começa no logotipo, ganha vida no conteúdo, se transforma em uma história no site e chega à rotina do consultório pela tecnologia.</p>
          <p>Para a Dra. Lívia Esper, conectamos branding, materiais de marca, gestão da presença digital, experiência web e um sistema de gestão clínica personalizado.</p>
          <ul className="le-scope"><li>Branding e logotipo</li><li>Materiais de marca</li><li>Presença digital</li><li>Site e experiência</li><li>SaaS personalizado</li></ul>
        </div>
      </section>
      <section className="le-brand" aria-labelledby="le-brand-title">
        <div className="le-brand-heading le-padding"><h2 id="le-brand-title">Uma marca que<br />já chega perto.</h2><p>A leveza dos balões, as cores e o desenho do logotipo estabelecem uma linguagem que acompanha cada ponto de contato.</p></div>
        <div className="le-brand-mark"><img src={media.hero.logo} alt="Logotipo da Dra. Lívia Esper: crianças com balões em formato de dentes" width="994" height="653" loading="lazy" /></div>
        <div className="le-brand-colors" aria-hidden="true"><i /><i /><i /></div>
        <figure className="le-stationery"><img src={media.identity.papelaria} alt="Aplicação da identidade da Dra. Lívia Esper em papelaria institucional sobre fundo rosa" width="2000" height="1500" loading="lazy" /></figure>
        <div className="le-brand-motion"><Film src={media.hero.video3D} poster={media.hero.video3DPoster} label="Animação dos balões da marca" motion={motion} sound /><div><h3>A identidade<br />também se move.</h3><p>Os balões do logotipo atravessam o papel e entram em cena.</p></div></div>
      </section>
      <section className="le-web-intro le-padding" id="le-website" tabIndex={-1}><h2>Um site para<br />entrar na história.</h2><div><p>O Dentinho conduz a experiência. A rolagem revela os cenários, muda o ritmo e apresenta o universo da Dra. Lívia.</p><a className="le-text-link" href="https://draliviaesper.com.br" target="_blank" rel="noopener noreferrer">Explore o site oficial <ArrowUpRight size={18} /></a></div></section>
      <section className="le-web-runway" ref={runwayRef} aria-label="Apresentação cinematográfica das telas reais do site">
        <div className="le-web-stage">
          <section className="le-web-scene le-web-scene-first" aria-label="A abertura do site"><h3 className="le-scene-heading">O primeiro encontro<br />abre um mundo.</h3><div className="le-scene-space"><Screen file="site-abertura.webp" alt="Abertura real do site com o Dentinho adormecido sobre nuvens" className="le-screen-opening" eager /></div></section>
          <section className="le-web-scene le-web-scene-story" aria-label="As cenas da jornada"><h3 className="le-scene-heading">A cada rolagem,<br />uma nova descoberta.</h3><div className="le-scene-space"><Screen file="site-aventura.webp" alt="Cena do Dentinho explorando as colinas na jornada interativa" className="le-screen-adventure" eager /><Screen file="site-afeto.webp" alt="Cena de especialização e afeto no site da Dra. Lívia" className="le-screen-affection" eager /></div></section>
          <section className="le-web-scene le-web-scene-close" aria-label="O site em desktop e celular"><h3 className="le-scene-heading">O mesmo universo.<br />Em outras mãos.</h3><div className="le-scene-space"><Screen file="site-sobre.webp" alt="Apresentação institucional da Dra. Lívia no site oficial" className="le-screen-about" eager /><Screen file="site-mobile.webp" alt="Abertura real do site do Dentinho no celular" className="le-screen-phone" eager /></div></section>
          <nav className="le-chapter-nav" aria-label="Cenas da apresentação do site">{chapters.map((label, index) => <button type="button" key={label} onClick={() => goChapter(index)} aria-current={chapter === index ? 'step' : undefined}><span />{label}</button>)}</nav>
        </div>
      </section>
      <section className="le-system le-padding" aria-labelledby="le-system-title"><div className="le-system-heading"><h2 id="le-system-title">Por trás do encanto,<br />a operação.</h2><p>Um SaaS de gestão clínica personalizado. A tecnologia estende o projeto de comunicação para o dia a dia do consultório.</p></div><figure className="le-system-screen"><img src={media.system.desktop} alt="Interface do painel principal do sistema de gestão clínica desenvolvido para a Dra. Lívia Esper" width="2400" height="1500" loading="lazy" /></figure><div className="le-system-footer"><strong>Gestão clínica personalizada</strong><span>Estratégia, UX/UI e desenvolvimento</span></div></section>
      <section id="le-social" className="le-social le-padding" aria-labelledby="le-social-title"><div className="le-social-heading"><h2 id="le-social-title">Presença que<br />cultiva proximidade.</h2><p>Uma direção de arte reconhecível, temas do cotidiano das famílias e conteúdo que mantém a marca presente.</p></div><LiviaSocialGallery posts={media.posts} motion={motion} scrollerRef={rootRef} /><div className="le-reels"><div className="le-reels-copy"><h3>Quando a marca<br />entra em cena.</h3><p>Animação, personagens e conteúdo em movimento.</p></div>{media.reels.map(reel => <Film key={reel.id} src={reel.video} poster={reel.poster} label={reel.title} motion={motion} sound className="le-reel" />)}</div></section>
      <section className="le-closing le-padding" id="le-contact" tabIndex={-1}><p>Branding. Conteúdo. Experiência. Tecnologia.</p><h2>Todo detalhe<br />conta a mesma<br />história.</h2><div className="le-closing-bottom"><p>Da primeira impressão à gestão do consultório.<br />Tudo na mesma sintonia.</p><a href={contact} onClick={onContact ? event => { event.preventDefault(); onContact(); } : undefined}>Vamos falar do seu projeto <ArrowUpRight size={25} /></a></div><footer><a href="/" onClick={home}>Comunicação Social Ag</a><span>Somos a amplificação da sua voz.</span><a href="/trabalhos/verdao">Próximo case: Imobiliária Verdão <ArrowUpRight size={16} /></a></footer></section>
    </main>
  </article>;
}
