import AboutLayout, { AboutHero, AboutContact } from './AboutLayout';
import { AGENCY_STORY, AGENCY_DISCIPLINES } from '../data/agencyStory';
import InstitutionalReel from '../components/cinematic/InstitutionalReel';
import CampaignRibbon from './CampaignRibbon';

export default function AgencyPage({ onBack, onNavigateAbout }) {
  const heroBackground = (
    <div className="agency-hero-bg-video">
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/assets/video/reel-poster.webp"
        aria-label="Reel institucional da Comunicação Social Ag em plano de fundo"
      >
        <source src="/assets/video/institucional-csag.mp4" type="video/mp4" />
      </video>
      <div className="agency-hero-overlay" />
    </div>
  );

  return <AboutLayout page="agencia" title="Agência | Comunicação Social Ag" description={AGENCY_STORY.introduction} onBack={onBack} onNavigateAbout={onNavigateAbout}>
    <AboutHero
      lines={['Ideias feitas', 'para ecoar.']}
      introduction={AGENCY_STORY.introduction}
      next="#quem-somos"
      nextLabel="Conhecer a agência"
      backgroundMedia={heroBackground}
    />
    <CampaignRibbon />
    <section id="quem-somos" className="agency-editorial agency-section">
      <h2>Da conversa<br />à conexão.</h2>
      <div className="agency-editorial-copy"><p className="agency-body-lead">{AGENCY_STORY.about}</p><p>Bruno Garcia está à frente da agência. Um olhar que atravessa disciplinas, aproxima a estratégia da execução e mantém a conversa perto de quem cria.</p><p>Atuamos com marcas de diferentes setores, com atenção especial à saúde. Porque a força de uma mensagem também está no cuidado com o que ela diz.</p></div>
    </section>
    <section className="agency-belief agency-section">
      <div className="agency-belief-bg" aria-hidden="true">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/assets/brand/caixa-som-vibrando-poster.webp"
          aria-label="Caixas de som com o logo da Comunicação Social Ag vibrando em 3D"
        >
          <source src="/assets/brand/caixa-som-vibrando.mp4" type="video/mp4" />
        </video>
        <div className="agency-belief-overlay" />
      </div>
      <div className="agency-belief-heading">
        <h2>Sua marca<br />tem uma voz.</h2>
      </div>
      <div className="agency-belief-copy"><h3>Ela merece<br />chegar mais longe.</h3>{AGENCY_STORY.manifesto.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<p>{AGENCY_STORY.purpose}</p></div>
    </section>
    <section className="agency-disciplines agency-section" aria-labelledby="agency-disciplines-title">
      <h2 id="agency-disciplines-title">Muitas linguagens.<br />Uma direção.</h2>
      <div className="agency-discipline-rows">{AGENCY_DISCIPLINES.map((discipline) => <article key={discipline.title}><h3>{discipline.title}</h3><p>{discipline.description}</p></article>)}</div>
    </section>
    <section id="reel" className="agency-film" aria-label="Reel institucional da Comunicação Social Ag">
      <InstitutionalReel />
    </section>
    <AboutContact onBack={onBack} nextPage={{ href: '/abordagem', label: 'Conheça nossa abordagem' }} />
  </AboutLayout>;
}
