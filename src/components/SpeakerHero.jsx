import React from 'react';
import { motion } from 'motion/react';
import { playClickSound, playHoverSound } from '../utils/audio';
import { playBassDrop } from '../utils/speakerAudio';
import { AGENCY_CONFIG } from '../data/agency';

export default function SpeakerHero({
  onExploreProjects,
  onExploreAgency,
  onContactClick,
  soundEnabled = true,
  onDropBass,
}) {
  const handleBassButton = () => {
    playClickSound(soundEnabled);
    playBassDrop(soundEnabled, 1.2);
    if (onDropBass) onDropBass();
  };

  return (
    <section className="speaker-hero-section" id="hero">
      <div className="speaker-hero-content">
        {/* Top Tagline Badge */}
        <motion.div
          className="speaker-hero-badge"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="badge-pulse-dot" />
          <span className="badge-text">COMUNICAÇÃO SOCIAL AG® • POÇOS DE CALDAS, MG</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          className="speaker-hero-title"
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          Comunicação não é ruído:
          <span className="hero-title-highlight"> é ressonância e amplificação.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="speaker-hero-description"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          Posicionamento estratégico, design com identidade proprietária e tecnologia de alta performance. Damos volume e autoridade à frequência única da sua marca.
        </motion.p>

        {/* Dedicated 3D Speaker Stage on Mobile */}
        <div className="speaker-hero-mobile-stage" />

        {/* Action Buttons */}
        <motion.div
          className="speaker-hero-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <button
            className="btn-hero-primary"
            onClick={() => {
              playClickSound(soundEnabled);
              onExploreProjects();
            }}
            onMouseEnter={() => playHoverSound(soundEnabled)}
          >
            <span>Ver Projetos Selecionados</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>

          <button
            className="btn-hero-secondary"
            onClick={() => {
              playClickSound(soundEnabled);
              onExploreAgency();
            }}
            onMouseEnter={() => playHoverSound(soundEnabled)}
          >
            <span>Conhecer a Agência</span>
          </button>

          <button
            className="btn-hero-bass"
            onClick={handleBassButton}
            title="Disparar pulso sonoro da caixa de som"
            onMouseEnter={() => playHoverSound(soundEnabled)}
          >
            <span className="btn-bass-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            </span>
            <span>Soltar o Grave</span>
          </button>
        </motion.div>

        {/* Micro Specs Footer */}
        <motion.div
          className="speaker-hero-specs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.45 }}
        >
          <div className="spec-item">
            <span className="spec-label">ESTRUTURA</span>
            <span className="spec-value">Operação Estratégica Direta</span>
          </div>
          <div className="spec-divider" />
          <div className="spec-item">
            <span className="spec-label">DIRETOR</span>
            <span className="spec-value">Bruno Garcia</span>
          </div>
          <div className="spec-divider" />
          <div className="spec-item">
            <span className="spec-label">ESPECIALIDADE</span>
            <span className="spec-value">Saúde • D2C • Varejo Premium</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
