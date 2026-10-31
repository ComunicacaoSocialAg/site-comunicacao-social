import React from 'react';
import { motion } from 'motion/react';
import { playClickSound, playHoverSound } from '../utils/audio';

export default function ServicesSection({ onOpenModal, soundEnabled = true }) {
  const serviceCards = [
    {
      id: 'branding',
      category: 'IDENTIDADE',
      title: 'Branding & Sistemas de Design',
      desc: 'Construção de marcas memoráveis: logotipos, paletas cromáticas calibradas, tipografia proprietária e guias de aplicação que garantem autoridade imediata em qualquer ponto de contato.',
      deliverables: ['Identidade Visual Completa', 'Design System e Manual de Marca', 'Materiais Editoriais e Papelaria'],
    },
    {
      id: 'digital',
      category: 'TECNOLOGIA',
      title: 'Plataformas & Sites de Alta Performance',
      desc: 'Desenvolvimento de websites e interfaces imersivas que unem design refinado, arquitetura mobile-first, tempos de carregamento ultrarrápidos e conformidade com os mais altos padrões da web.',
      deliverables: ['Websites Institucionais', 'Landing Pages de Alta Conversão', 'Experiências 3D e Interativas'],
    },
    {
      id: 'saude',
      category: 'HUB REGULADO',
      title: 'Hub Especializado em Saúde',
      desc: 'Comunicação estratégica para médicos, cirurgiões-dentistas e clínicas com estrita observância das resoluções do CFM, CFO e CRP. Conteúdo educativo, ético e fundamentado em autoridade técnica.',
      deliverables: ['Posicionamento Médico e Odontológico', 'Sites com Rigor Técnico e SEO Local', 'Comunicação Institucional e Ética'],
    },
  ];

  return (
    <section className="speaker-content-section" id="servicos">
      <div className="section-container">
        {/* Header Label */}
        <div className="section-header-tag">
          <span className="tag-number">03</span>
          <span className="tag-line" />
          <span className="tag-title">SERVIÇOS • SOLUÇÕES ESTRATÉGICAS</span>
        </div>

        {/* Section Headline */}
        <div className="section-headline-wrap">
          <h2 className="section-headline">
            Soluções completas.
            <span className="headline-muted"> Execução cirúrgica sem intermediários.</span>
          </h2>
          <p className="section-lead">
            Da concepção da tese de marca até o desenvolvimento de sistemas digitais complexos, atuamos em todas as etapas essenciais para sua autoridade de mercado.
          </p>
        </div>

        {/* Service Cards Grid */}
        <div className="services-cards-grid">
          {serviceCards.map((srv) => (
            <div
              key={srv.id}
              className="service-card"
              onMouseEnter={() => playHoverSound(soundEnabled)}
            >
              <div className="service-card-top">
                <span className="service-category">{srv.category}</span>
              </div>
              <h3 className="service-title">{srv.title}</h3>
              <p className="service-desc">{srv.desc}</p>
              <div className="service-deliverables">
                {srv.deliverables.map((d, i) => (
                  <div key={i} className="deliverable-item">
                    <span className="deliverable-bullet" />
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Modal Trigger Button */}
        <div className="services-footer-cta">
          <button
            className="btn-services-modal"
            onClick={() => {
              playClickSound(soundEnabled);
              onOpenModal();
            }}
            onMouseEnter={() => playHoverSound(soundEnabled)}
          >
            <span>Ver Detalhamento Completo de Serviços</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
