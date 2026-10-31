import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowUpRight, Pause, Play } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CaseBrandSignature from '../components/CaseBrandSignature';
import { AGENCY_CONFIG } from '../data/agency';
import { ALBERTO_MEDIA as media } from '../data/albertoShowcase';
import './alberto-showcase.css';

gsap.registerPlugin(ScrollTrigger);
const b = media.base;

function SiteFilm({ motion }) {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const manualPause = useRef(false);
  useEffect(() => {
    const video = ref.current;
    let visible = false;
    const sync = () => {
      if (!visible || document.hidden || !motion || manualPause.current) video.pause();
      else video.play().catch(() => {});
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: 0.15 });
    observer.observe(video);
    document.addEventListener('visibilitychange', sync);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', sync); video.pause(); };
  }, [motion]);
  const toggle = async () => {
    const video = ref.current;
    if (video.paused) { manualPause.current = false; try { await video.play(); } catch { setFailed(true); } }
    else { manualPause.current = true; video.pause(); }
  };
  return <div className="ab-film">
    <video ref={ref} src={`${b}site-film.mp4`} poster={`${b}site-poster.webp`} muted loop playsInline preload="none"
      aria-label="Animação utilizada na abertura do novo site do Dr. Alberto Brasil"
      onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setFailed(true)} />
    <button type="button" onClick={toggle} aria-label={playing ? 'Pausar filme do site' : 'Reproduzir filme do site'}>
      {playing ? <Pause size={16} /> : <Play size={16} />} {playing ? 'Pausar filme' : 'Reproduzir filme'}
    </button>
    {failed && <p role="alert">Não foi possível reproduzir o filme. <a href={`${b}site-film.mp4`}>Abrir vídeo</a>.</p>}
  </div>;
}

export default function AlbertoShowcasePage({ onClose, onContact }) {
  const rootRef = useRef(null);
  const [motion, setMotion] = useState(() => typeof window !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setMotion(!query.matches);
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  useLayoutEffect(() => {
    if (!motion) return;
    const root = rootRef.current;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add({ desktop: '(min-width: 761px)', mobile: '(max-width: 760px)' }, (context) => {
        const mobile = context.conditions.mobile;
        root.classList.add('ab-cinematic');
        const scroll = (trigger, end = 'bottom top') => ({ trigger, scroller: root, start: 'top top', end, scrub: 0.8, invalidateOnRefresh: true });
        gsap.fromTo('.ab-name span', { yPercent: 103 }, { yPercent: 0, duration: 1.35, stagger: 0.1, ease: 'expo.out' });
        const opening = gsap.timeline({ scrollTrigger: scroll('.ab-opening', 'bottom bottom') });
        opening.to('.ab-portrait', { scale: 1.09, xPercent: mobile ? 0 : -5, duration: 1, ease: 'none' }, 0)
          .to('.ab-name', { yPercent: -28, opacity: 0, duration: 0.65, ease: 'power2.in' }, 0)
          .fromTo('.ab-opening-thesis', { yPercent: 55, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.65, ease: 'power2.out' }, 0.3)
          .to('.ab-portrait-shade', { opacity: 0.9, duration: 0.8 }, 0.15);

        const acts = gsap.utils.toArray('.ab-act');
        gsap.set(acts.slice(1), { autoAlpha: 0 });
        const cut = gsap.timeline({ scrollTrigger: scroll('.ab-exhibition', 'bottom bottom') });
        cut.fromTo('.ab-monogram', { scale: 0.84, rotate: -5 }, { scale: 1.04, rotate: 0, duration: 1.2, ease: 'power2.out' }, 0)
          .to('.ab-brand-word', { xPercent: -8, duration: 1.5, ease: 'none' }, 0)
          .set(acts[1], { autoAlpha: 1 }, 1.2)
          .fromTo(acts[1], { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 0.6, ease: 'power3.inOut', immediateRender: false }, 1.2)
          .fromTo('.ab-hero-post', { rotate: 9, yPercent: 15, scale: 0.85 }, { rotate: -4, yPercent: 0, scale: 1, duration: 1.3, ease: 'power2.out' }, 1.25)
          .fromTo('.ab-side-post', { xPercent: 28, rotate: -8 }, { xPercent: 0, rotate: 5, duration: 1.3, ease: 'power2.out' }, 1.25)
          .set(acts[0], { autoAlpha: 0 }, 1.85)
          .set(acts[2], { autoAlpha: 1 }, 2.9)
          .fromTo(acts[2], { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.6, ease: 'power3.inOut', immediateRender: false }, 2.9)
          .fromTo('.ab-desktop-screen', { rotateY: 12, rotateZ: -4, scale: 0.82, yPercent: 10 }, { rotateY: 0, rotateZ: 0, scale: 1, yPercent: -3, duration: 1.4, ease: 'power2.out' }, 3)
          .fromTo('.ab-phone-screen', { yPercent: 30, rotate: 8 }, { yPercent: 0, rotate: -3, duration: 1.4, ease: 'power2.out' }, 3)
          .set(acts[1], { autoAlpha: 0 }, 3.55)
          .to({}, { duration: 0.7 });

        const track = root.querySelector('.ab-gallery-track');
        gsap.to(track, {
          x: () => -Math.max(0, track.scrollWidth - root.clientWidth + parseFloat(getComputedStyle(track).paddingLeft)),
          ease: 'none', scrollTrigger: scroll('.ab-gallery', 'bottom bottom'),
        });
        return () => root.classList.remove('ab-cinematic');
      });
    }, root);
    const refresh = () => ScrollTrigger.refresh();
    root.querySelectorAll('img').forEach(img => { if (!img.complete) img.addEventListener('load', refresh, { once: true }); });
    const frame = requestAnimationFrame(refresh);
    return () => { cancelAnimationFrame(frame); root.querySelectorAll('img').forEach(img => img.removeEventListener('load', refresh)); ctx.revert(); root.classList.remove('ab-cinematic'); };
  }, [motion]);

  function home(event) {
    if (onClose && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) { event.preventDefault(); onClose(); }
  }
  function jump(event, id) {
    const target = rootRef.current.querySelector(`#${id}`);
    if (!target) return;
    event.preventDefault();
    rootRef.current.scrollTo({ top: target.offsetTop, behavior: motion ? 'smooth' : 'instant' });
    target.focus({ preventScroll: true });
  }
  const contact = AGENCY_CONFIG.getWhatsAppUrl('Olá! Vi o case do Dr. Alberto Brasil e quero conversar sobre a comunicação da minha marca.');

  return <article ref={rootRef} className="ab-case" data-motion={motion ? 'on' : 'off'} aria-labelledby="ab-title">
    <a className="ab-skip" href="#ab-overview" onClick={e => jump(e, 'ab-overview')}>Pular abertura</a>
    <header className="ab-header">
      <a href="/" onClick={home} aria-label="Voltar ao início"><ArrowLeft size={18} /><span>Voltar ao início</span></a>
      <div>
        <a href="#ab-contact" onClick={e => jump(e, 'ab-contact')}>Vamos conversar <ArrowUpRight size={17} /></a>
        <button type="button" aria-pressed={!motion} aria-label={motion ? 'Pausar animações' : 'Ativar animações'} onClick={() => setMotion(!motion)}>{motion ? <Pause size={18} /> : <Play size={18} />}</button>
      </div>
    </header>
    <main>
      <section className="ab-opening">
        <div className="ab-hero">
          <div className="ab-portrait"><img src={`${b}portrait-suit.webp`} alt="Retrato do Dr. Alberto Brasil" width="900" height="1350" fetchPriority="high" /></div>
          <div className="ab-portrait-shade" />
          <div className="ab-signature"><CaseBrandSignature client="Dr. Alberto Brasil" clientLogo={`${b}logo.svg`} /></div>
          <div className="ab-hero-main">
            <h1 id="ab-title" className="ab-name"><span>ALBERTO</span><span>BRASIL</span></h1>
            <div className="ab-hero-base"><p>Cirurgião vascular<br />Poços de Caldas, MG</p><a href="#ab-overview" onClick={e => jump(e, 'ab-overview')}>Explore o case <ArrowDown size={19} /></a></div>
          </div>
          <div className="ab-opening-thesis" aria-hidden="true"><span>A confiança</span><span>ganha forma.</span></div>
        </div>
      </section>

      <section id="ab-overview" className="ab-overview" tabIndex={-1}>
        <h2>Antes do primeiro<br />encontro, uma<br />percepção.</h2>
        <div><p>A maneira de se apresentar também comunica cuidado.</p><p>Para o Dr. Alberto Brasil, trabalhamos design, conteúdo e experiência web em uma mesma direção. Uma presença que aproxima, informa e mantém a identidade em cada ponto de contato.</p><ul><li>Direção de arte</li><li>Conteúdo digital</li><li>Design e desenvolvimento web</li></ul></div>
      </section>

      <section className="ab-exhibition" aria-label="Identidade, conteúdo e experiência digital">
        <div className="ab-stage">
          <section className="ab-act ab-brand" aria-label="Identidade visual do Dr. Alberto Brasil">
            <span className="ab-brand-word" aria-hidden="true">IDENTIDADE</span>
            <img className="ab-monogram" src={`${b}logo.svg`} alt="Assinatura visual do Dr. Alberto Brasil" width="1080" height="1080" loading="lazy" />
            <p>Uma assinatura.<br />Em toda a presença.</p>
            <div className="ab-palette" aria-label="Paleta de grafite, cinza quente, pedra e branco"><i /><i /><i /><i /></div>
          </section>
          <section className="ab-act ab-editorial" aria-labelledby="ab-editorial-title">
            <div className="ab-editorial-copy"><h2 id="ab-editorial-title">Clareza<br />que chama<br />o olhar.</h2><p>Fotografia, tipografia e composição.<br />Conteúdo com uma voz reconhecível.</p></div>
            <img className="ab-hero-post" src={media.posts[0].src} alt={media.posts[0].alt} width="900" height="1600" loading="lazy" />
            <img className="ab-side-post" src={media.posts[3].src} alt={media.posts[3].alt} width="900" height="1600" loading="lazy" />
          </section>
          <section className="ab-act ab-web" aria-labelledby="ab-web-title">
            <h2 id="ab-web-title">A mesma essência.<br />Outra dimensão.</h2>
            <div className="ab-web-composition">
              <img className="ab-desktop-screen" src={`${b}site-desktop.webp`} alt="Captura real da abertura do novo site do Dr. Alberto Brasil em desktop" width="1700" height="983" loading="lazy" />
              <img className="ab-phone-screen" src={`${b}site-mobile.webp`} alt="Captura real da abertura do novo site do Dr. Alberto Brasil em celular" width="390" height="844" loading="lazy" />
            </div>
            <a href="https://dralbertobrasil.com.br/" target="_blank" rel="noopener noreferrer">Visitar site do Dr. Alberto <ArrowUpRight size={18} /></a>
          </section>
        </div>
      </section>

      <section className="ab-gallery" aria-labelledby="ab-gallery-title">
        <div className="ab-gallery-stage">
          <div className="ab-gallery-heading"><h2 id="ab-gallery-title">Presença é<br />consistência.</h2><p>Uma curadoria do trabalho.<br />O design mantém a conversa em movimento.</p></div>
          <div className="ab-gallery-track">{media.posts.map(post => <figure key={post.src}><img src={post.src} alt={post.alt} width="900" height="1600" loading="lazy" /></figure>)}</div>
        </div>
      </section>

      <section className="ab-webfilm" aria-labelledby="ab-film-title">
        <div className="ab-film-intro"><h2 id="ab-film-title">O movimento<br />também comunica.</h2><p>A linguagem visual do novo site amplia a experiência da marca. Da imagem em movimento à organização da informação, uma navegação pensada como parte da comunicação.</p></div>
        <SiteFilm motion={motion} />
      </section>

      <section id="ab-contact" className="ab-close" tabIndex={-1}>
        <h2>CADA<br />DETALHE<br />COMUNICA.</h2>
        <div className="ab-close-bottom"><p>Estratégia, design, conteúdo e tecnologia.<br />Uma mesma direção para amplificar a sua voz.</p><a href={contact} target="_blank" rel="noopener noreferrer">Vamos falar da sua marca <ArrowUpRight size={22} /></a></div>
        <footer><a href="/trabalhos">Explorar outros trabalhos</a><span>Dr. Alberto Brasil, cirurgião vascular<br />CRM-MG 39529 | RQE 15412</span><a href="/contato" onClick={e => { if (onContact && !e.metaKey && !e.ctrlKey) { e.preventDefault(); onContact(); } }}>Comunicação Social Ag</a></footer>
      </section>
    </main>
  </article>;
}
