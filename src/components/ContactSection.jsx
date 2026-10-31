import React from 'react';
import { motion } from 'motion/react';
import { playClickSound, playHoverSound } from '../utils/audio';
import { trackWhatsAppClick } from '../utils/analytics';
import { AGENCY_CONFIG } from '../data/agency';

export default function ContactSection({ soundEnabled = true }) {
  const handleWhatsAppChat = () => {
    playClickSound(soundEnabled);
    trackWhatsAppClick('contact_section_btn', 'Falar com Bruno Garcia');
    const msg = 'Olá! Acessei o site da Comunicação Social Ag e gostaria de agendar uma conversa sobre a minha marca.';
    window.open(AGENCY_CONFIG.getWhatsAppUrl(msg), '_blank');
  };

  return (
    <section className="speaker-content-section" id="contato">
      <div className="section-container">
        {/* Header Label */}
        <div className="section-header-tag">
          <span className="tag-number">05</span>
          <span className="tag-line" />
          <span className="tag-title">CONTATO • DIAGNÓSTICO ESTRATÉGICO</span>
        </div>

        {/* Section Headline */}
        <div className="contact-box-card">
          <div className="contact-card-glow" />
          <h2 className="contact-headline">
            Sua marca pronta para ressoar no mercado.
          </h2>
          <p className="contact-lead">
            Agende uma sessão direta com Bruno Garcia para avaliar seu momento atual, analisar gargalos de posicionamento e desenhar um plano com etapas claras.
          </p>

          <div className="contact-actions-row">
            <button
              className="btn-contact-whatsapp"
              onClick={handleWhatsAppChat}
              onMouseEnter={() => playHoverSound(soundEnabled)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
              <span>Conversar pelo WhatsApp Oficial</span>
            </button>
          </div>

          {/* Details Grid */}
          <div className="contact-meta-grid">
            <div className="contact-meta-item">
              <span className="meta-item-label">LOCALIZAÇÃO</span>
              <span className="meta-item-value">{AGENCY_CONFIG.city}</span>
            </div>
            <div className="contact-meta-item">
              <span className="meta-item-label">ATENDIMENTO</span>
              <span className="meta-item-value">Nacional & Remoto</span>
            </div>
            <div className="contact-meta-item">
              <span className="meta-item-label">E-MAIL DIRETO</span>
              <span className="meta-item-value">{AGENCY_CONFIG.email}</span>
            </div>
            <div className="contact-meta-item">
              <span className="meta-item-label">TELEFONE</span>
              <span className="meta-item-value">{AGENCY_CONFIG.phoneDisplay}</span>
            </div>
          </div>
        </div>

        {/* Brand Footer */}
        <div className="site-brand-footer">
          <div className="footer-left">
            <span className="footer-copyright">
              © {new Date().getFullYear()} Comunicação Social Ag®. Todos os direitos reservados.
            </span>
            <span className="footer-sub">
              Poços de Caldas, MG • Estratégia, Criatividade e Tecnologia.
            </span>
          </div>
          <div className="footer-right">
            <span className="footer-status-pill">
              <span className="pulse-green-dot" />
              <span>Operação Ativa</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
