import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { AGENCY_CAMPAIGNS } from '../data/agencyStory';

export default function CampaignRibbon() {
  const rootRef = useRef(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    let visible = false;
    const synchronize = () => { root.dataset.running = visible && !document.hidden && !paused; };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; synchronize(); });
    observer.observe(root);
    document.addEventListener('visibilitychange', synchronize);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', synchronize); };
  }, [paused]);

  return (
    <section ref={rootRef} className="agency-ribbon" aria-label="Peças de comunicação do nosso acervo" data-running="false">
      <div className="agency-ribbon-track">
        {[0, 1].map((copy) => <div className="agency-ribbon-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>
          {AGENCY_CAMPAIGNS.map((work) => <figure className="agency-ribbon-shot" key={work.id}>
            <img src={work.image} alt={`${work.client}: ${work.category.toLowerCase()}`} width="900" height="675" loading={copy ? 'lazy' : 'eager'} decoding="async" />
          </figure>)}
        </div>)}
      </div>
      <button className="agency-ribbon-pause" onClick={() => setPaused(!paused)} aria-pressed={paused} aria-label={paused ? 'Retomar movimento das imagens' : 'Pausar movimento das imagens'}>{paused ? <Play size={16} /> : <Pause size={16} />}</button>
    </section>
  );
}
