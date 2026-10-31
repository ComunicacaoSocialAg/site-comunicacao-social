import React from 'react';
import { motion } from 'motion/react';
import { playClickSound, playHoverSound } from '../utils/audio';
import { playBassDrop, playResonanceSweep } from '../utils/speakerAudio';

export default function ApproachSection({ onNavigateServices, soundEnabled = true }) {
  const steps = [
    {
      num: '01',
      action: 'ESCUTAR',
      subtitle: 'Diagnóstico & Imersão',
      desc: 'Antes de desenhar uma linha ou definir um pixel, investigamos a operação, o histórico, as objeções dos clientes e o vácuo deixado pelos concorrentes.',
      tag: 'DIAGNÓSTICO',
    },
    {
      num: '02',
      action: 'TRADUZIR',
      subtitle: 'Arquitetura & Linguagem',
      desc: 'Convertemos diferenciais brutos em argumentos irrefutáveis, identidade visual proprietária e sistemas de design que nenhuma IA consegue reproduzir.',
      tag: 'ESTRUTURAÇÃO',
    },
    {
      num: '03',
      action: 'AMPLIFICAR',
      subtitle: 'Ressonância & Conversão',
      desc: 'Levamos a mensagem ao mercado através de plataformas digitais rápidas, campanhas de precisão e presença consistente nos canais de maior impacto.',
      tag: 'EXECUÇÃO',
    },
  ];

  const handleAmplifyTest = () => {
    playClickSound(soundEnabled);
    playResonanceSweep(soundEnabled);
    playBassDrop(soundEnabled, 1.4);
  };

  return (
    <section className="speaker-content-section" id="abordagem">
      <div className="section-container">
        {/* Header Label */}
        <div className="section-header-tag">
          <span className="tag-number">02</span>
          <span className="tag-line" />
          <span className="tag-title">NOSSA ABORDAGEM • A TRÍADE ESTRATÉGICA</span>
        </div>

        {/* Section Headline */}
        <div className="section-headline-wrap">
          <h2 className="section-headline">
            Escutar com profundidade.
            <span className="headline-muted"> Traduzir com clareza. Amplificar com potência.</span>
          </h2>
          <p className="section-lead">
            Metodologia proprietária desenvolvida para eliminar o ruído do mercado e transformar marcas em referências inquestionáveis no seu segmento.
          </p>
        </div>

        {/* Triad Cards */}
        <div className="approach-cards-grid">
          {steps.map((step, idx) => (
            <div
              key={step.num}
              className="approach-step-card"
              onMouseEnter={() => playHoverSound(soundEnabled)}
            >
              <div className="approach-card-header">
                <span className="approach-step-num">{step.num}</span>
                <span className="approach-step-tag">{step.tag}</span>
              </div>
              <h3 className="approach-step-action">{step.action}</h3>
              <h4 className="approach-step-subtitle">{step.subtitle}</h4>
              <p className="approach-step-desc">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Interactive Audio Resonance Box */}
        <div className="approach-interactive-callout">
          <div className="callout-left">
            <span className="callout-label">EXPERIMENTE A AMPLIFICAÇÃO</span>
            <p className="callout-text">
              Veja e sinta a resposta de frequência da nossa caixa de som 3D ao acionar a potência máxima do subwoofer.
            </p>
          </div>
          <button
            className="btn-amplify-pulse"
            onClick={handleAmplifyTest}
            onMouseEnter={() => playHoverSound(soundEnabled)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
            <span>Testar Ressonância Acústica</span>
          </button>
        </div>
      </div>
    </section>
  );
}
