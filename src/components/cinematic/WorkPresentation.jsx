import { useEffect, useRef } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { AGENCY_CONFIG } from '../../data/agency';

export default function WorkPresentation({ work, onClose, onNext }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog.open) dialog.showModal();
    dialog.addEventListener('close', onClose);
    return () => {
      dialog.removeEventListener('close', onClose);
      if (dialog.open) dialog.close();
    };
  }, [onClose]);

  useEffect(() => { dialogRef.current.scrollTop = 0; }, [work.id]);

  return (
    <dialog ref={dialogRef} className="film-work-dialog" aria-labelledby="work-title">
      <header className="film-work-dialog-nav">
        <span>Comunicação Social Ag</span>
        <button onClick={() => dialogRef.current.close()} aria-label="Fechar projeto">Voltar <X size={18} /></button>
      </header>
      <figure className="film-work-dialog-image" style={{ background: work.background }}>
        <img src={work.image} alt={work.summary} style={{ objectFit: work.fit }} />
      </figure>
      <div className="film-work-dialog-copy">
        <p>{work.category}{work.source && ` / ${work.source}`}</p>
        <h2 id="work-title">{work.client}</h2>
        <h3>{work.title}</h3>
        <p className="film-work-description">{work.description}</p>
        <a className="film-text-link" href={AGENCY_CONFIG.getWhatsAppUrl(`Olá! Vi o trabalho ${work.client} no site da CS Ag e gostaria de conversar sobre minha marca.`)} target="_blank" rel="noopener noreferrer">Conversar sobre um projeto <ArrowUpRight size={20} /></a>
        <button className="film-next-work" onClick={onNext}>Próximo trabalho <ArrowUpRight size={36} /></button>
      </div>
    </dialog>
  );
}
