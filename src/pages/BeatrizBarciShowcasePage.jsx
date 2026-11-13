import { useEffect, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowUpRight, RotateCcw } from 'lucide-react';
import CaseBrandSignature from '../components/CaseBrandSignature';
import { BEATRIZ_CASE as project, BEATRIZ_MEDIA as media } from '../data/beatrizBarciShowcase';
import './beatriz-barci-showcase.css';

function CampaignImage({ file, alt, width, height, className }) {
  return <img className={className} src={`${media}/carrossel/${file}`} alt={alt} width={width} height={height} loading="lazy" decoding="async" />;
}

function handleNavigation(event, action) {
  if (!action || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  action();
}

function CaseHero() {
  const [take, setTake] = useState(0);
  const [opening, setOpening] = useState('waiting');

  useEffect(() => {
    const fallback = window.setTimeout(() => {
      setOpening((phase) => phase === 'waiting' ? 'finished' : phase);
    }, 1000);
    return () => window.clearTimeout(fallback);
  }, [take]);

  function replay() {
    setOpening('waiting');
    setTake((previous) => previous + 1);
  }

  return (
    <header className="barci-hero">
      <img className="barci-portrait" src={project.image} alt="Retrato da Dra. Beatriz Barci" width="1080" height="1350" fetchPriority="high" />
      <div className="barci-hero-grade" aria-hidden="true" />
      <div key={take} className="barci-opening" data-phase={opening} aria-hidden="true">
        <picture>
          <source media="(prefers-reduced-motion: no-preference)" srcSet={`${media}/videos/assinatura-enquadrada.png?abertura=${take}`} />
          <img src={project.logo} alt="" width="480" height="480"
            onError={() => setOpening('finished')}
            onLoad={(event) => {
              if (event.currentTarget.currentSrc.includes('assinatura-enquadrada.png')) {
                setOpening((phase) => phase === 'waiting' ? 'playing' : phase);
              }
            }} />
        </picture>
      </div>
      <div className="barci-hero-top">
        <CaseBrandSignature client={project.client} clientLogo={project.logo} />
        <a href="/trabalhos">
          <ArrowLeft size={17} aria-hidden="true" /> Trabalhos
        </a>
      </div>
      <div className="barci-hero-copy">
        <h1 id="barci-title">Uma marca perto<br />das famílias.</h1>
        <div className="barci-hero-end">
          <p>Branding, direção de arte e conteúdo para a Dra. Beatriz Barci.</p>
          <a href="#barci-projeto">Explorar o case <ArrowDown size={17} aria-hidden="true" /></a>
        </div>
      </div>
      <button type="button" className="barci-replay" onClick={replay} aria-label="Rever abertura" title="Rever abertura">
        <RotateCcw size={18} aria-hidden="true" />
      </button>
    </header>
  );
}

export default function BeatrizBarciShowcasePage({ onContact }) {
  return (
    <article className="barci-case" aria-labelledby="barci-title">
      <CaseHero />

      <section className="barci-brief" id="barci-projeto" aria-labelledby="barci-brief-title">
        <h2 id="barci-brief-title">Como levar o acolhimento do consultório para a comunicação?</h2>
        <div className="barci-brief-detail">
          <p>Partimos da logomarca que a Beatriz já usava. A CS Ag desenvolveu o branding do projeto, definiu a linguagem das campanhas e criou peças que aproximam a odontopediatria da rotina das famílias.</p>
          <ul aria-label="Entregas da Comunicação Social Ag">
            <li>Branding</li>
            <li>Direção de arte</li>
            <li>Conteúdo educativo</li>
          </ul>
        </div>
      </section>

      <section className="barci-welcome" aria-labelledby="barci-welcome-title">
        <div className="barci-welcome-photo">
          <img src={`${media}/consultorio/beatriz-barci-consultorio.webp`} alt="Dra. Beatriz com recursos lúdicos do consultório" width="1080" height="1440" loading="lazy" decoding="async" />
        </div>
        <div className="barci-welcome-story">
          <h2 id="barci-welcome-title">O jeito da Beatriz de receber.</h2>
          <p>Nas peças, o rosto da Beatriz e as situações do consultório dividem espaço com cor e ilustração. A direção de arte traduz em imagem o cuidado que a família encontra na primeira visita.</p>
          <CampaignImage className="barci-welcome-piece" file="condicionamento-01.webp" alt="Peça da campanha sobre acolhimento no consultório" width={1080} height={1350} />
        </div>
      </section>

      <section className="barci-editorial" aria-labelledby="barci-editorial-title">
        <div className="barci-editorial-head">
          <h2 id="barci-editorial-title">As perguntas que os pais trazem.</h2>
          <p>Ortopedia funcional, crescimento facial e hábitos em casa viraram pautas. Nos carrosséis, a pergunta abre a conversa e a direção de arte organiza a leitura.</p>
        </div>
        <div className="barci-editorial-spread">
          <CampaignImage className="barci-spread-lead" file="ortopedia-01-capa.webp" alt="Capa do carrossel sobre ortopedia funcional dos maxilares" width={1200} height={1500} />
          <CampaignImage className="barci-spread-top" file="crescimento-facial-capa.webp" alt="Capa do carrossel sobre crescimento facial" width={1080} height={1440} />
          <CampaignImage className="barci-spread-bottom" file="lanches.jpg" alt="Peça ilustrada sobre lanches para as crianças" width={900} height={1125} />
        </div>
      </section>

      <section className="barci-campaign" aria-labelledby="barci-campaign-title">
        <div className="barci-campaign-copy">
          <h2 id="barci-campaign-title">Uma voz que muda de assunto sem perder o tom.</h2>
          <p>Do Dia das Crianças ao conteúdo sobre ortopedia, cada peça tem um papel. O branding dá unidade à comunicação mesmo quando mudam o formato e o assunto.</p>
        </div>
        <div className="barci-campaign-pair">
          <CampaignImage file="dia-das-criancas.jpg" alt="Peça ilustrada da campanha de Dia das Crianças" width={900} height={1125} />
          <CampaignImage file="ortopedia-retrato.jpg" alt="Peça educativa com retrato da Dra. Beatriz" width={900} height={1600} />
        </div>
      </section>

      <footer className="barci-footer">
        <p className="barci-purpose">Somos a amplificação da sua voz.</p>
        <h2>Vamos falar<br />da sua marca?</h2>
        <a href="/contato" onClick={(event) => handleNavigation(event, onContact)}>
          Fale com a CS Ag <ArrowUpRight size={20} aria-hidden="true" />
        </a>
        <p className="barci-credit">Dra. Beatriz Barci<br />Odontopediatria e Ortopedia Funcional dos Maxilares<br />CRO-MG 59198</p>
      </footer>
    </article>
  );
}
