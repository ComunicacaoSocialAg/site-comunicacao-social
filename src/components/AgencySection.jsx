import React from 'react';
import { motion } from 'motion/react';
import { playClickSound, playHoverSound } from '../utils/audio';
import { AGENCY_CONFIG } from '../data/agency';

export default function AgencySection({ onNavigateApproach, onContactClick, soundEnabled = true }) {
  const capabilities = [
    {
      id: 'estrategia',
      tag: '01 • FUNDAÇÃO',
      title: 'Estratégia de Marca',
      desc: 'Diagnóstico analítico, posicionamento competitivo e tese de diferenciação antes de qualquer decisão de design ou código.',
    },
    {
      id: 'branding',
      tag: '02 • IDENTIDADE',
      title: 'Branding & Sistemas Visuais',
      desc: 'Tipografia proprietária, paletas estruturadas e identidade memorável que destacam sua empresa dos concorrentes genéricos.',
    },
    {
      id: 'engenharia',
      tag: '03 • TECNOLOGIA',
      title: 'Engenharia Web & Experiência 3D',
      desc: 'Desenvolvimento ágil com Three.js, React e animações fluidas a 60fps, sem modelos prontos ou códigos descartáveis.',
    },
    {
      id: 'saude',
      tag: '04 • RIGOR TÉCNICO',
      title: 'Hub Especializado em Saúde',
      desc: 'Comunicação médica e odontológica com estrita observância às normas éticas e regulatórias do CFM, CFO e CRP.',
    },
  ];

  const metrics = [
    { value: '+42%', label: 'Eficiência de conversão' },
    { value: '2.8M', label: 'Impressões geradas' },
    { value: '+340%', label: 'Recall de marca' },
    { value: '100%', label: 'Conformidade ética' },
  ];

  return (
    <section className="speaker-content-section" id="agencia">
      <div className="section-container">
        {/* Header Label */}
        <div className="section-header-tag">
          <span className="tag-number">01</span>
          <span className="tag-line" />
          <span className="tag-title">A AGÊNCIA • MANIFESTO & CAPACIDADES</span>
        </div>

        {/* Section Headline */}
        <div className="section-headline-wrap">
          <h2 className="section-headline">
            Estratégia antes do código.
            <span className="headline-muted"> Identidade antes da moda.</span>
          </h2>
          <p className="section-lead">
            Na Comunicação Social Ag, cada entrega é tratada como um instrumento de precisão. Um único estrategista e diretor criativo cuida da sua marca do primeiro briefing até a entrega em produção, garantindo coerência cirúrgica em cada detalhe.
          </p>
        </div>

        {/* Metrics Strip */}
        <div className="agency-metrics-grid">
          {metrics.map((m, idx) => (
            <div key={idx} className="metric-card">
              <span className="metric-value">{m.value}</span>
              <span className="metric-label">{m.label}</span>
            </div>
          ))}
        </div>

        {/* Capabilities Grid */}
        <div className="capabilities-grid">
          {capabilities.map((cap) => (
            <div
              key={cap.id}
              className="capability-card"
              onMouseEnter={() => playHoverSound(soundEnabled)}
            >
              <span className="cap-tag">{cap.tag}</span>
              <h3 className="cap-title">{cap.title}</h3>
              <p className="cap-desc">{cap.desc}</p>
            </div>
          ))}
        </div>

        {/* Agency CTA Footer */}
        <div className="agency-section-footer">
          <button
            className="btn-agency-cta"
            onClick={() => {
              playClickSound(soundEnabled);
              onNavigateApproach();
            }}
            onMouseEnter={() => playHoverSound(soundEnabled)}
          >
            <span>Conhecer Nossa Metodologia</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
