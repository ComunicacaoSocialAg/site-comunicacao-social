import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowUpRight, Pause, Play } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CaseBrandSignature from '../components/CaseBrandSignature';
import { AGENCY_CONFIG } from '../data/agency';
import { PONTO_COR_MEDIA as media } from '../data/pontoCorShowcase';
import './ponto-cor-showcase.css';

gsap.registerPlugin(ScrollTrigger);
const b = media.base;

function Artwork({ item, className = '', eager = false }) {
  return <figure className={className}><img src={item.src} alt={item.alt} width={item.width} height={item.height} loading={eager ? 'eager' : 'lazy'} decoding="async" /></figure>;
}

function SceneMedia({ item, motion }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!item.video) return;
    const video = videoRef.current;
    if (!video) return;
    if (!motion) {
      video.pause();
      return;
    }
    let visible = false;
    const sync = () => {
      if (!visible || document.hidden || !motion) video.pause();
      else video.play().catch(() => {});
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }, { root: video.closest('.pc-case'), threshold: 0.08 });
    observer.observe(video);
    document.addEventListener('visibilitychange', sync);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
      video.pause();
    };
  }, [item.video, motion]);

  if (item.video) {
    return (
      <figure className="pc-scene-figure pc-scene-video">
        <video
          ref={videoRef}
          src={item.video}
          poster={item.poster || item.src}
          width={item.width}
          height={item.height}
          muted
          loop
          playsInline
          autoPlay={motion}
          preload="metadata"
          aria-label={item.alt}
        />
      </figure>
    );
  }

  return (
    <figure className="pc-scene-figure pc-scene-image">
      <img
        src={item.src}
        alt={item.alt}
        width={item.width}
        height={item.height}
        loading="lazy"
        decoding="async"
      />
    </figure>
  );
}

function HeroReel({ motion }) {
  const videoRef = useRef(null);
  const manualPause = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    let visible = false;
    const sync = () => {
      if (!visible || document.hidden || !motion) video.pause();
      else if (!manualPause.current) video.play().catch(() => {});
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }, { root: video.closest('.pc-case'), threshold: 0.05 });
    observer.observe(video);
    document.addEventListener('visibilitychange', sync);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', sync); video.pause(); };
  }, [motion]);

  async function toggle() {
    const video = videoRef.current;
    if (video.paused) {
      manualPause.current = false;
      try { await video.play(); } catch { setFailed(true); }
    } else {
      manualPause.current = true;
      video.pause();
    }
  }

  return <>
    <div className="pc-hero-image">
      <video ref={videoRef} className="pc-hero-video" src={`${b}hero-reel.mp4`} poster={`${b}hero-reel-poster.webp`}
        width="1280" height="720" muted loop playsInline preload="metadata"
        aria-label="Reel Ponto Cor: campanhas, lançamentos e conteúdo da presença digital da marca."
        onPlay={() => { setPlaying(true); setFailed(false); }} onPause={() => setPlaying(false)} onError={() => setFailed(true)} />
      {failed && <img className="pc-hero-video-fallback" src={`${b}hero-reel-poster.webp`} alt="Composição do reel de campanhas da Ponto Cor." width="1280" height="720" />}
    </div>
    <button className="pc-video-toggle" type="button" onClick={toggle} aria-label={playing ? 'Pausar reel Ponto Cor' : 'Reproduzir reel Ponto Cor'}>
      {playing ? <Pause size={17} /> : <Play size={17} />}<span>{playing ? 'Pausar reel' : 'Reproduzir reel'}</span>
    </button>
    {failed && <p className="pc-video-error" role="alert">O reel não carregou. <a href={`${b}hero-reel.mp4`}>Abrir vídeo</a>.</p>}
  </>;
}

export default function PontoCorShowcasePage({ onClose, onContact }) {
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
      mm.add({ desktop: '(min-width: 761px)', mobile: '(max-width: 760px)' }, ({ conditions }) => {
        const mobile = conditions.mobile;
        root.classList.add('pc-motion');
        const scroll = (trigger, end = 'bottom bottom') => ({ trigger, scroller: root, start: 'top top', end, scrub: 0.7, invalidateOnRefresh: true });
        gsap.from('.pc-title-line span', { yPercent: 108, duration: 1.25, stagger: 0.09, ease: 'expo.out' });
        gsap.timeline({ scrollTrigger: scroll('.pc-opening') })
          .to('.pc-hero-image', { scale: mobile ? 1 : 1.06, ease: 'none', duration: 1 }, 0)
          .to('.pc-hero-type', { yPercent: -20, opacity: 0, duration: 0.7, ease: 'power2.in' }, 0)
          .to('.pc-hero-base', { opacity: 0, duration: 0.35 }, 0)
          .fromTo('.pc-hero-statement', { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 0.7, ease: 'power3.inOut' }, 0.3);

        if (!mobile) {
          const track = root.querySelector('.pc-runway-track');
          gsap.to(track, { x: () => -Math.max(0, track.scrollWidth - root.clientWidth), ease: 'none', scrollTrigger: scroll('.pc-runway') });
          gsap.fromTo('.pc-runway-word', { xPercent: 3 }, { xPercent: -8, ease: 'none', scrollTrigger: scroll('.pc-runway') });
        }

        const scenes = gsap.utils.toArray('.pc-color-scene');
        gsap.set(scenes.slice(1), { clipPath: 'inset(100% 0 0 0)' });
        const palette = gsap.timeline({ scrollTrigger: scroll('.pc-color-film') });
        scenes.forEach((scene, index) => {
          if (index) palette.to(scene, { clipPath: 'inset(0% 0 0 0)', duration: 0.8, ease: 'power3.inOut' }, index * 1.3);
          const target = scene.querySelector('video') || scene.querySelector('img');
          if (target) palette.fromTo(target, { scale: 1.07 }, { scale: 1, duration: 1.25, ease: 'none' }, index * 1.3);
        });
        palette.to({}, { duration: 0.5 });

        if (!mobile) {
          gsap.fromTo('.pc-winter-feature', { yPercent: 8, rotate: -5 }, { yPercent: -5, rotate: 0, ease: 'none', scrollTrigger: { trigger: '.pc-winter', scroller: root, start: 'top bottom', end: 'bottom top', scrub: 1 } });
        }
        return () => root.classList.remove('pc-motion');
      });
    }, root);
    const refresh = () => ScrollTrigger.refresh();
    const frame = requestAnimationFrame(refresh);
    return () => { cancelAnimationFrame(frame); ctx.revert(); root.classList.remove('pc-motion'); };
  }, [motion]);

  function jump(event, id) {
    const target = rootRef.current.querySelector(`#${id}`);
    if (!target) return;
    event.preventDefault();
    rootRef.current.scrollTo({ top: target.offsetTop - 68, behavior: 'instant' });
    target.focus({ preventScroll: true });
  }
  function home(event) {
    if (onClose && (event.button === undefined || event.button === 0) && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) { event.preventDefault(); onClose(); }
  }
  const contact = AGENCY_CONFIG.getWhatsAppUrl('Olá! Vi o case da Ponto Cor e quero conversar sobre a presença digital da minha marca.');

  return <article className="pc-case" ref={rootRef} aria-labelledby="pc-title">
    <a className="pc-skip" href="#pc-overview" onClick={e => jump(e, 'pc-overview')}>Pular abertura</a>
    <header className="pc-header">
      <a href="/" onClick={home} aria-label="Voltar ao início"><ArrowLeft size={17} /><span>Voltar ao início</span></a>
      <nav aria-label="Neste case"><a href="#pc-carnaval" onClick={e => jump(e, 'pc-carnaval')}>Carnaval</a><a href="#pc-lancamentos" onClick={e => jump(e, 'pc-lancamentos')}>Lançamentos</a></nav>
      <div><a href="#pc-contact" onClick={e => jump(e, 'pc-contact')}>Vamos conversar <ArrowUpRight size={16} /></a><button type="button" aria-pressed={!motion} aria-label={motion ? 'Pausar animações' : 'Ativar animações'} onClick={() => setMotion(!motion)}>{motion ? <Pause size={17} /> : <Play size={17} />}</button></div>
    </header>
    <main>
      <section className="pc-opening">
        <div className="pc-hero">
          <HeroReel motion={motion} />
          <div className="pc-hero-shade" />
          <div className="pc-signature"><CaseBrandSignature client="Ponto Cor" clientLogo={`${b}logo-white.webp`} /></div>
          <div className="pc-hero-type"><h1 id="pc-title"><span className="pc-title-line"><span>PONTO</span></span><span className="pc-title-line"><span>COR.</span></span></h1></div>
          <div className="pc-hero-base"><p>Gestão da presença digital.<br />A vontade de criar.</p><a href="#pc-overview" onClick={e => jump(e, 'pc-overview')}>Explore o case <ArrowDown size={20} /></a></div>
          <div className="pc-hero-statement" aria-hidden="true">A ideia<br />pede cor.</div>
        </div>
      </section>

      <section id="pc-overview" className="pc-overview" tabIndex={-1}>
        <h2>Todo material.<br />Um começo.</h2>
        <div><p>Antes de virar peça, é possibilidade.</p><p>Um fio, uma fita, uma cor. A Ponto Cor está onde as ideias começam a ganhar forma. Nossa gestão da presença digital leva esse universo para a comunicação: campanhas de Carnaval, lançamentos e conteúdo que desperta a vontade de criar.</p><ul><li>Estratégia de conteúdo</li><li>Direção de arte</li><li>Campanhas sazonais</li><li>Gestão da presença digital</li></ul></div>
      </section>

      <section id="pc-carnaval" className="pc-carnival" tabIndex={-1} aria-labelledby="pc-carnival-title">
        <div className="pc-carnival-intro"><h2 id="pc-carnival-title">O Carnaval<br />começa na<br />imaginação.</h2><div><p>Do primeiro detalhe ao look inteiro.</p><p>Miçangas, fitas, crochê e brilho entram em cena. Uma campanha com espaço para estilos diferentes e uma mesma assinatura.</p></div></div>
        <div className="pc-runway"><div className="pc-runway-stage" tabIndex={0} aria-label="Galeria de peças de Carnaval"><div className="pc-runway-word" aria-hidden="true">CARNAVAL</div><div className="pc-runway-track">{media.carnival.map(item => <Artwork key={item.src} item={item} />)}</div></div><p className="pc-swipe">Deslize para explorar as peças</p></div>
        <div className="pc-carnival-diptych"><figure><img src={`${b}carnaval-maximal.webp`} alt="Imagem da campanha de Carnaval: composição maximalista com fitas, cores e adereços na rua." width="1000" height="1241" loading="lazy" /></figure><figure><img src={`${b}carnaval-neon.webp`} alt="Imagem da campanha de Carnaval: look em tons neon em uma cena de festa à noite." width="1000" height="1241" loading="lazy" /></figure><p>Muitos jeitos<br />de ser folia.</p></div>
      </section>

      <section id="pc-lancamentos" className="pc-launches" tabIndex={-1} aria-labelledby="pc-launch-title">
        <div className="pc-launch-intro"><h2 id="pc-launch-title">Cor também<br />dá água<br />na boca.</h2><p>Para apresentar as cores, uma associação que o olhar quase sente. Novelos e sabores se encontram em uma série visual criada para os canais da Ponto Cor.</p></div>
        <div className="pc-color-film"><div className="pc-color-stage">{media.colors.map((item, i) => <div key={item.video || item.src} className={`pc-color-scene pc-color-${i}`} style={{ '--scene-color': item.background }}><div className="pc-color-type" aria-hidden="true"><span>PONTO COR</span>{item.name ? <span>{item.name}</span> : null}</div><SceneMedia item={item} motion={motion} /></div>)}</div></div>
      </section>

      <section className="pc-winter" aria-labelledby="pc-winter-title">
        <div className="pc-winter-top"><div className="pc-winter-copy"><h2 id="pc-winter-title">A estação<br />muda.<br />O desejo<br />se renova.</h2><p>Nos lançamentos de inverno, a cor puxa a conversa. Composição, textura e direção de arte dão unidade à série e colocam o produto no centro do olhar.</p></div><Artwork className="pc-winter-feature" item={media.winter[0]} /></div>
        <div className="pc-winter-strip">{media.winter.slice(1).map(item => <Artwork key={item.src} item={item} />)}</div>
      </section>

      <section className="pc-collection" aria-labelledby="pc-collection-title">
        <div className="pc-collection-intro"><h2 id="pc-collection-title">Entre uma data<br />e outra, a marca<br />continua.</h2><p>O cuidado está em costurar os momentos. Novidades, ideias para presentear e o valor do feito à mão compõem uma presença que mantém a conversa aberta.</p></div>
        <div className="pc-collection-grid">{media.selection.map(item => <Artwork key={item.src} item={item} />)}</div>
      </section>

      <section id="pc-contact" className="pc-close" tabIndex={-1}>
        <img src={`${b}logo-color.webp`} alt="Ponto Cor" width="1000" height="341" loading="lazy" />
        <h2>UMA MARCA.<br />MUITAS IDEIAS.<br />A MESMA VOZ.</h2>
        <div className="pc-close-base"><p>Estratégia, direção de arte e conteúdo.<br />Tudo na mesma conversa para amplificar a sua voz.</p><a href={contact} target="_blank" rel="noopener noreferrer">Vamos falar da sua marca <ArrowUpRight size={22} /></a></div>
        <footer><a href="/trabalhos">Explorar outros trabalhos</a><a href="/contato" onClick={e => { if (onContact && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) { e.preventDefault(); onContact(); } }}>Comunicação Social Ag</a><span>© {new Date().getFullYear()}</span></footer>
      </section>
    </main>
  </article>;
}
