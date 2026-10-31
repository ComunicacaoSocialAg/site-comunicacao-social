import AboutLayout, { AboutHero, AboutContact } from './AboutLayout';
import CampaignRibbon from './CampaignRibbon';
import { AGENCY_METHOD, APPROACH_STORY, APPROACH_PRINCIPLES } from '../data/agencyStory';

export default function ApproachPage({ onBack, onNavigateAbout }) {
  return <AboutLayout page="abordagem" title="Abordagem | Comunicação Social Ag" description={APPROACH_STORY.introduction} onBack={onBack} onNavigateAbout={onNavigateAbout}>
    <AboutHero lines={['Uma ideia.', 'Uma direção.']} introduction={APPROACH_STORY.introduction} next="#nosso-metodo" nextLabel="Conhecer nosso método" />
    <CampaignRibbon />
    <section className="agency-editorial agency-section">
      <h2>Amplificar começa<br />por entender.</h2>
      <div className="agency-editorial-copy"><p className="agency-body-lead">{APPROACH_STORY.belief}</p><p>{APPROACH_STORY.body}</p></div>
    </section>
    <section id="nosso-metodo" className="agency-method agency-section">
      <div className="agency-method-intro"><h2>Da primeira<br />pergunta à<br />próxima conversa.</h2><p>Quatro movimentos conectam o que a marca precisa dizer ao que as pessoas levam com elas.</p><nav className="agency-method-index" aria-label="Etapas do método">{AGENCY_METHOD.map((step, index) => <a key={step.title} href={'#metodo-' + (index + 1)}>{step.title}</a>)}</nav></div>
      <div className="agency-method-steps">{AGENCY_METHOD.map((step, index) => <article key={step.title} id={'metodo-' + (index + 1)}><span className="agency-step-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><h3>{step.title}</h3><h4>{step.question}</h4><p>{step.text}</p></article>)}</div>
    </section>
    <section className="agency-principles agency-section">
      <h2>O que orienta<br />cada escolha.</h2>
      <div className="agency-principle-rows">{APPROACH_PRINCIPLES.map((principle) => <article key={principle.title}><h3>{principle.title}</h3><p>{principle.text}</p></article>)}</div>
    </section>
    <section className="agency-approach-statement agency-section"><h2>O meio acompanha<br />a ideia.</h2><p>{APPROACH_STORY.closing}</p></section>
    <AboutContact onBack={onBack} nextPage={{ href: '/agencia', label: 'Conheça a agência' }} />
  </AboutLayout>;
}
