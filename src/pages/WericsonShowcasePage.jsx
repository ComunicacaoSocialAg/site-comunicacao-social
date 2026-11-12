import { ArrowDown, ArrowLeft, ArrowRight, Maximize2 } from 'lucide-react';
import CaseBrandSignature from '../components/CaseBrandSignature';
import { WERICSON_CASE as project, WERICSON_SCREENS as screens } from '../data/wericsonShowcase';
import './wericson-showcase.css';

function Screen({ screen, className = '', priority = false }) {
  return (
    <a
      className={`wm-screen ${className}`}
      href={screen.src}
      target="_blank"
      rel="noopener"
      aria-label={`${screen.alt} Abrir imagem em tamanho maior em uma nova aba.`}
    >
      <img
        src={screen.src}
        srcSet={screen.srcSet}
        sizes={screen.sizes}
        width={screen.width}
        height={screen.height}
        alt={screen.alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding="async"
      />
      <span className="wm-screen-expand" aria-hidden="true"><Maximize2 size={15} /></span>
    </a>
  );
}

export default function WericsonShowcasePage({ onClose, onContact }) {
  function handleBack(event) {
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

  function goToContact(event) {
    if (!onContact || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    onContact();
  }

  return (
    <article className="wm-case" aria-labelledby="wm-title">
      <header className="wm-hero">
        <div className="wm-shell wm-topline">
          <CaseBrandSignature client={project.client} clientLogo={project.logo} />
          <a className="wm-back" href="/trabalhos" onClick={handleBack}><ArrowLeft size={16} aria-hidden="true" /> Trabalhos</a>
        </div>

        <div className="wm-shell wm-hero-grid">
          <div className="wm-hero-copy">
            <h1 id="wm-title">O consultório<br />em foco.</h1>
            <p>Identidade digital e sistema de gestão clínica para o psicanalista Wericson Martins.</p>
            <a className="wm-action" href="#wm-rotina">
              Explorar o sistema <ArrowDown size={17} aria-hidden="true" />
            </a>
          </div>

          <div className="wm-hero-media">
            <Screen screen={screens.dashboard} className="wm-hero-desktop wm-desktop" priority />
            <Screen screen={screens.dashboardMobile} className="wm-hero-phone wm-phone" priority />
          </div>
        </div>
      </header>

      <section className="wm-routine" id="wm-rotina" aria-labelledby="wm-routine-title">
        <div className="wm-shell">
          <div className="wm-section-heading">
            <h2 id="wm-routine-title">Um sistema para a prática psicanalítica.</h2>
            <p>O sistema acompanha o percurso do analisante, da ficha de acolhimento às entrevistas preliminares e às sessões. Agenda, registros clínicos, supervisão e honorários fazem parte da mesma rotina.</p>
          </div>

          <div className="wm-routine-media">
            <Screen screen={screens.intake} className="wm-intake-phone wm-phone" />
            <Screen screen={screens.agenda} className="wm-agenda-desktop wm-desktop" />
            <Screen screen={screens.agendaMobile} className="wm-agenda-phone wm-phone" />
          </div>
        </div>
      </section>

      <section className="wm-access" aria-labelledby="wm-access-title">
        <div className="wm-shell">
          <div className="wm-section-heading">
            <h2 id="wm-access-title">Sigilo clínico e LGPD levados a sério.</h2>
            <p>Prontuário e escuta exigem proteção absoluta. Desenvolvemos o sistema com camadas reais de segurança: bloqueio imediato por PIN para preservar a tela no consultório físico, isolamento de dados sensíveis e conformidade rigorosa com a LGPD. A tecnologia protege a relação entre analista e analisante, sem burocracia no atendimento.</p>
          </div>

          <div className="wm-access-media">
            <Screen screen={screens.lock} className="wm-lock-desktop wm-desktop" />
            <Screen screen={screens.lockMobile} className="wm-lock-phone wm-phone" />
          </div>
        </div>
      </section>

      <footer className="wm-close">
        <div className="wm-shell wm-close-inner">
          <div>
            <p>Comunicação Social Ag</p>
            <h2>Um sistema para<br />o seu jeito de trabalhar.</h2>
          </div>
          <a className="wm-action" href="/contato" onClick={goToContact}>
            Converse com a agência <ArrowRight size={17} aria-hidden="true" />
          </a>
        </div>
      </footer>
    </article>
  );
}
