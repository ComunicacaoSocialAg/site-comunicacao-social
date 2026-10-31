import { motion } from 'motion/react';
import { playClickSound } from '../utils/audio';
import { trackWhatsAppClick } from '../utils/analytics';
import { AGENCY_CONFIG } from '../data/agency';

export default function HUD({
  activeSection = 'hero',
  soundEnabled,
  onToggleSound,
  onList,
  onInstitutional,
  onContact,
  onAgency,
  onApproach,
  onReplayIntro,
}) {
  const handleContactClick = () => {
    playClickSound(soundEnabled);
    trackWhatsAppClick('hud_top_cta', 'Falar com a Agência');
    if (onContact) {
      onContact();
    } else {
      window.open(
        AGENCY_CONFIG.getWhatsAppUrl('Olá! Gostaria de conversar sobre um projeto com a Comunicação Social Ag.'),
        '_blank'
      );
    }
  };

  return (
    <>
      {/* ── Architectural Floating Island Navigation ─────────────────────────── */}
      <header className="fluid-nav-container" aria-label="Navegação Principal">
        <nav className="fluid-nav-shell">
          {/* Brand Identity */}
          <button
            className="fluid-nav-brand"
            onClick={() => {
              playClickSound(soundEnabled);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            title="Comunicação Social Ag: Início"
          >
            <img
              src="/assets/brand/logo-sem-fundo.png"
              alt="Logo Comunicação Social Ag"
              className="fluid-nav-logo"
            />
            <span className="fluid-nav-wordmark">Comunicação Social Ag</span>
          </button>

          {/* Minimalist Editorial Links */}
          <div className="fluid-nav-links">
            <button
              className={`fluid-nav-link ${activeSection === 'hero' ? 'active' : ''}`}
              onClick={() => {
                playClickSound(soundEnabled);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Início
            </button>

            <button
              className={`fluid-nav-link ${activeSection === 'agency' ? 'active' : ''}`}
              onClick={() => {
                playClickSound(soundEnabled);
                if (onAgency) onAgency();
              }}
            >
              Agência
            </button>

            <button
              className={`fluid-nav-link ${activeSection === 'approach' ? 'active' : ''}`}
              onClick={() => {
                playClickSound(soundEnabled);
                if (onApproach) onApproach();
              }}
            >
              Abordagem
            </button>

            <button
              className="fluid-nav-link"
              onClick={() => {
                playClickSound(soundEnabled);
                if (onInstitutional) onInstitutional();
              }}
            >
              Serviços
            </button>

            <button
              className="fluid-nav-link"
              onClick={() => {
                playClickSound(soundEnabled);
                if (onList) onList();
              }}
            >
              Cases
            </button>

            <button
              className="fluid-nav-link"
              onClick={() => {
                playClickSound(soundEnabled);
                if (onReplayIntro) onReplayIntro();
              }}
              title="Assistir Manifesto Visual"
            >
              Intro
            </button>
          </div>

          {/* Action Tools & VIP Button */}
          <div className="fluid-nav-actions">
            <button className="fluid-nav-replay" onClick={onReplayIntro} aria-label="Rever abertura">
              Intro
            </button>
            {/* Audio Equalizer Toggle */}
            <button
              className={`eq-toggle ${soundEnabled ? 'active' : ''}`}
              onClick={onToggleSound}
              title={soundEnabled ? 'Desativar áudio' : 'Ativar áudio'}
              aria-label={soundEnabled ? 'Desativar áudio' : 'Ativar áudio'}
            >
              <div className="eq-bars" aria-hidden="true">
                <span className="eq-bar" />
                <span className="eq-bar" />
                <span className="eq-bar" />
              </div>
              <span>{soundEnabled ? 'AUDIO ON' : 'MUTE'}</span>
            </button>

            {/* VIP Contact Button-in-Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleContactClick}
              className="btn-nested-cta"
              style={{ padding: '0.4rem 0.45rem 0.4rem 1.1rem', fontSize: '0.82rem' }}
              title="Iniciar conversa com a equipe estratégica"
            >
              <span className="fluid-nav-contact-full">Falar com a Agência</span>
              <span className="fluid-nav-contact-compact">Conversar</span>
              <span className="btn-nested-cta__icon" style={{ width: '26px', height: '26px', fontSize: '0.75rem' }}>
                ↗
              </span>
            </motion.button>
          </div>
        </nav>
      </header>

      {/* ── Telemetry Live Status at Bottom Left ─────────────────────────────── */}
      <div className="fluid-telemetry-bar" aria-hidden="true">
        <span className="home3d__tag-dot" />
        <span>CS AG // STUDIO HI-FI // 120 BPM • SUB 48Hz</span>
      </div>
    </>
  );
}
