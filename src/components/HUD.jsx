import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CATEGORIES, PROJECTS } from '../data/projects';
import { playClickSound } from '../utils/audio';
import { trackCategoryFilter, trackWhatsAppClick } from '../utils/analytics';

export default function HUD({
  hovered,
  activeCategory,
  onSelectCategory,
  soundEnabled,
  onToggleSound,
  filteredCount,
  onList,
  onInstitutional,
  onContact,
  onAgency,
  onApproach,
  onReplayIntro
}) {
  const handleCategoryClick = (catId) => {
    playClickSound(soundEnabled);
    onSelectCategory(catId);
    trackCategoryFilter(catId);
  };

  const handleContactClick = () => {
    playClickSound(soundEnabled);
    trackWhatsAppClick('hud_top_cta', 'Falar com a Agência');
    if (onContact) {
      onContact();
    } else {
      window.open('https://wa.me/5535999999999?text=Ol%C3%A1!%20Gostaria%20de%20conversar%20sobre%20um%20projeto%20com%20a%20Comunica%C3%A7%C3%A3o%20Social%20Ag.', '_blank');
    }
  };

  return (
    <nav className="hud" aria-label="Navegação Principal">
      <div className="hud-tl">
        <img src="/assets/brand/logo-sem-fundo.png" alt="Logo Comunicação Social Ag" className="hud-logo" />
        <div className="hud-brand">
          <span className="hud-name">Comunicação Social Ag</span>
          <span className="hud-sub">Estratégia · Criatividade · Tecnologia</span>
        </div>
      </div>

      <div className="hud-tr">
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          className={`btn-sound-toggle ${soundEnabled ? 'active' : ''}`}
          onClick={onToggleSound}
          title={soundEnabled ? 'Desativar áudio' : 'Ativar áudio'}
          aria-label={soundEnabled ? 'Desativar áudio' : 'Ativar áudio'}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {soundEnabled ? (
              <>
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              </>
            ) : (
              <>
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <line x1="23" y1="9" x2="17" y2="15"></line>
                <line x1="17" y1="9" x2="23" y2="15"></line>
              </>
            )}
          </svg>
          <span>{soundEnabled ? 'Som ON' : 'Mudo'}</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          className="btn-replay-intro"
          onClick={onReplayIntro}
          title="Assistir Manifesto / Intro"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          <span>Intro</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          className="btn-ghost"
          onClick={() => {
            playClickSound(soundEnabled);
            if (onAgency) onAgency();
          }}
          title="Manifesto e Visão da Agência"
        >
          Agência
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          className="btn-ghost"
          onClick={() => {
            playClickSound(soundEnabled);
            if (onApproach) onApproach();
          }}
          title="Nossa Metodologia: Escutar · Traduzir · Amplificar"
        >
          Abordagem
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          className="btn-ghost"
          onClick={onInstitutional}
          title="Conheça Serviços e Hub Saúde"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          Serviços
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          className="btn-ghost"
          onClick={onList}
          title="Ver índice de todos os projetos"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M1 2.5h11M1 6.5h11M1 10.5h11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          Projetos
        </motion.button>

        {/* Primary Commercial Conversion CTA */}
        <motion.button
          whileHover={{ scale: 1.04, y: -1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleContactClick}
          className="btn-gold"
          title="Iniciar conversa com a equipe estratégica"
        >
          Falar com a Agência →
        </motion.button>

        {/* Secondary client portal link */}
        <a
          href="https://cliente.comunicacaosocialag.com.br"
          target="_blank"
          rel="noopener noreferrer"
          className="hud-client-portal-link"
          title="Acesso exclusivo para clientes ativos"
        >
          Área do Cliente ↗
        </a>
      </div>

      <div className="hud-bl">
        {/* Category Filters Bar with sliding golden pill */}
        <div className="hud-filter-bar" role="tablist">
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                whileTap={{ scale: 0.95 }}
                className={`filter-pill ${isActive ? 'active' : ''}`}
                onClick={() => handleCategoryClick(cat.id)}
                role="tab"
                aria-selected={isActive}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeFilterPill"
                    className="filter-pill-active-bg"
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="filter-pill-label">{cat.label}</span>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {hovered ? (
            <motion.div
              key={hovered.id}
              className="hud-info"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              style={{ marginTop: 12 }}
            >
              <span className="hud-cat">{hovered.category}</span>
              <h3 className="hud-title">{hovered.title}</h3>
              <p className="hud-desc">{hovered.description}</p>
              <span className="hud-hint">clique para ver o case completo →</span>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              className="hud-idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ marginTop: 12 }}
            >
              <span className="pulse-dot" />
              <span>arraste para explorar · clique para ver o case</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="hud-br">
        <span className="hud-count">{filteredCount} de {PROJECTS.length} cases</span>
      </div>
    </nav>
  );
}
