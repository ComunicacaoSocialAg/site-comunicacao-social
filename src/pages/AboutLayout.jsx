import { useLayoutEffect, useRef } from 'react';
import { ArrowDown, ArrowLeft, ArrowUpRight } from 'lucide-react';
import { gsap } from 'gsap';
import { AGENCY_CONFIG } from '../data/agency';
import './agency-page.css';

function isPlainClick(event) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

export default function AboutLayout({ page, onBack, onNavigateAbout, children }) {
  const rootRef = useRef(null);
  useLayoutEffect(() => {
    const root = rootRef.current;
    const motion = gsap.matchMedia();
    motion.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(root.querySelectorAll('.agency-title-line > span'), { yPercent: 104 }, { yPercent: 0, duration: 1.1, stagger: .1, ease: 'power4.out' });
    }, root);
    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(window.location.hash.slice(1));
      if (target && root.contains(target)) target.scrollIntoView({ block: 'start', behavior: 'instant' });
      else root.scrollTop = 0;
    });
    return () => {
      cancelAnimationFrame(frame);
      motion.revert();
    };
  }, [page]);

  const follow = (event, route) => {
    if (!isPlainClick(event)) return;
    if (route === '/' && onBack) { event.preventDefault(); onBack(); }
    else if (route === '/' + page) {
      event.preventDefault();
      rootRef.current.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    } else if (onNavigateAbout) { event.preventDefault(); onNavigateAbout(route); }
  };

  return <main ref={rootRef} className="agency-page" data-about-page={page}>
    <header className="agency-header">
      <a className="agency-brand" href="/" onClick={(event) => follow(event, '/')}><img src="/assets/brand/logo-sem-fundo.png" alt="Comunicação Social Ag: início" width="72" height="38" /></a>
      <nav className="about-switcher" aria-label="Conheça a Comunicação Social Ag">
        <a href="/agencia" aria-current={page === 'agencia' ? 'page' : undefined} onClick={(event) => follow(event, '/agencia')}>Agência</a>
        <a href="/abordagem" aria-current={page === 'abordagem' ? 'page' : undefined} onClick={(event) => follow(event, '/abordagem')}>Abordagem</a>
      </nav>
      <nav className="agency-header-links" aria-label="Navegação principal">
        <a className="agency-home-link" href="/" onClick={(event) => follow(event, '/')}><ArrowLeft size={15} />Início</a>
        <a className="agency-header-contact" href={AGENCY_CONFIG.getWhatsAppUrl()} target="_blank" rel="noopener noreferrer" aria-label="Vamos conversar pelo WhatsApp"><span>Vamos conversar</span><ArrowUpRight size={18} /></a>
      </nav>
    </header>
    {children}
  </main>;
}

export function AboutHero({ lines, introduction, next, nextLabel }) {
  return <section className="agency-hero">
    <h1>{lines.map((line) => <span className="agency-title-line" key={line}><span>{line}</span></span>)}</h1>
    <div className="agency-hero-bottom"><p>{introduction}</p><a href={next} aria-label={nextLabel}><ArrowDown size={26} /></a></div>
  </section>;
}

export function AboutContact({ onBack, nextPage }) {
  return <section className="agency-contact agency-section">
    <h2>O próximo eco<br />pode ser o seu.</h2>
    <a className="agency-conversation" href={AGENCY_CONFIG.getWhatsAppUrl('Olá! Conheci a Comunicação Social Ag e quero conversar sobre a minha marca.')} target="_blank" rel="noopener noreferrer">Vamos dar voz à sua ideia <ArrowUpRight /></a>
    <a className="agency-email" href={'mailto:' + AGENCY_CONFIG.email}>{AGENCY_CONFIG.email}</a>
    <a className="about-next-page" href={nextPage.href}>{nextPage.label}<ArrowUpRight size={18} /></a>
    <footer><span>Comunicação Social Ag © {new Date().getFullYear()}</span><span>Poços de Caldas, MG</span><a href="/" onClick={(event) => { if (isPlainClick(event) && onBack) { event.preventDefault(); onBack(); } }}>Voltar ao início <ArrowUpRight size={14} /></a></footer>
  </section>;
}
