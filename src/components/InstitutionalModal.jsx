import React, { useState } from 'react';
import { motion } from 'motion/react';
import { playClickSound } from '../utils/audio';
import { trackWhatsAppClick } from '../utils/analytics';

export default function InstitutionalModal({ isOpen, onClose, soundEnabled, onSelectCase }) {
  const [tab, setTab] = useState('agencia');

  if (!isOpen) return null;

  return (
    <div className="institutional-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="Sobre e Serviços da Agência">
      <div className="institutional-modal" onClick={e => e.stopPropagation()}>
        <motion.div
          className="institutional-panel"
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Header */}
          <div className="institutional-header">
            <div className="institutional-brand">
              <img src="/assets/brand/logo-sem-fundo.png" alt="CS Ag" className="institutional-brand-logo" />
              <div>
                <h3 className="institutional-brand-title">Comunicação Social Ag</h3>
                <span style={{ fontSize: '11px', color: '#8e8e9c', fontFamily: 'var(--fb)' }}>Estratégia · Criatividade · Tecnologia</span>
              </div>
            </div>

            <div className="institutional-nav-tabs" role="tablist">
              <button
                className={`institutional-tab-btn ${tab === 'agencia' ? 'active' : ''}`}
                onClick={() => {
                  playClickSound(soundEnabled);
                  setTab('agencia');
                }}
                role="tab"
                aria-selected={tab === 'agencia'}
              >
                A Agência
              </button>
              <button
                className={`institutional-tab-btn ${tab === 'servicos' ? 'active' : ''}`}
                onClick={() => {
                  playClickSound(soundEnabled);
                  setTab('servicos');
                }}
                role="tab"
                aria-selected={tab === 'servicos'}
              >
                Serviços
              </button>
              <button
                className={`institutional-tab-btn ${tab === 'saude' ? 'active' : ''}`}
                onClick={() => {
                  playClickSound(soundEnabled);
                  setTab('saude');
                }}
                role="tab"
                aria-selected={tab === 'saude'}
              >
                Hub Saúde CFM/CFO
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="btn-icon"
              onClick={onClose}
              title="Fechar"
              aria-label="Fechar modal"
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M2 2l11 11M13 2L2 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </motion.button>
          </div>

          {/* Body Content */}
          <div className="institutional-body">
            {tab === 'agencia' && (
              <motion.div
                key="agencia"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
              >
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--fh)' }}>
                    Manifesto & Posicionamento
                  </span>
                  <h2 style={{ fontFamily: 'var(--fh)', fontSize: '26px', color: '#fff', marginTop: 6, marginBottom: 14 }}>
                    A estratégia antes da estética.
                  </h2>
                  <p style={{ color: '#b0b0c0', fontSize: '14px', lineHeight: 1.7, maxWidth: '780px' }}>
                    Nascemos em Poços de Caldas (MG) com vocação global. Não acreditamos em comunicação vazia ou peças publicitárias sem retorno mensurável. Construímos um ecossistema onde inteligência de negócios, design editorial de alto padrão e tecnologia de ponta convivem para acelerar marcas de valor real.
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginTop: 8 }}>
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 18 }}>
                    <span style={{ fontFamily: 'var(--fh)', fontSize: '24px', fontWeight: 800, color: 'var(--gold)' }}>80+</span>
                    <p style={{ fontSize: '12px', color: '#8e8e9c', marginTop: 4 }}>Clientes e marcas transformadas</p>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 18 }}>
                    <span style={{ fontFamily: 'var(--fh)', fontSize: '24px', fontWeight: 800, color: 'var(--gold)' }}>5 Anos</span>
                    <p style={{ fontSize: '12px', color: '#8e8e9c', marginTop: 4 }}>De mercado e inovação contínua</p>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 18 }}>
                    <span style={{ fontFamily: 'var(--fh)', fontSize: '24px', fontWeight: 800, color: 'var(--gold)' }}>+400%</span>
                    <p style={{ fontSize: '12px', color: '#8e8e9c', marginTop: 4 }}>De crescimento consistente</p>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 18 }}>
                    <span style={{ fontFamily: 'var(--fh)', fontSize: '24px', fontWeight: 800, color: 'var(--gold)' }}>100%</span>
                    <p style={{ fontSize: '12px', color: '#8e8e9c', marginTop: 4 }}>Sob medida — zero templates genéricos</p>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 20 }}>
                  <h4 style={{ fontFamily: 'var(--fh)', fontSize: '14px', color: '#fff', marginBottom: 8 }}>
                    Poços de Caldas para o Brasil
                  </h4>
                  <p style={{ color: '#8e8e9c', fontSize: '13px', lineHeight: 1.6 }}>
                    Sediados em Poços de Caldas, Minas Gerais, atendemos empresas, clínicas e corporações em todo o território nacional e internacional, desenvolvendo desde identidades de marca memoráveis até plataformas corporativas complexas.
                  </p>
                </div>
              </motion.div>
            )}

            {tab === 'servicos' && (
              <motion.div
                key="servicos"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="service-card-grid"
              >
                <div className="service-card">
                  <span className="service-card-badge">Pilar 01</span>
                  <h4 className="service-card-title">Branding & Identidade</h4>
                  <p className="service-card-desc">
                    Arquitetura e reposicionamento de marca, design tokens, tipografia proprietária, diretrizes editoriais e papelaria de alto padrão.
                  </p>
                </div>

                <div className="service-card">
                  <span className="service-card-badge">Pilar 02</span>
                  <h4 className="service-card-title">Experiências Web & 3D</h4>
                  <p className="service-card-desc">
                    Interfaces cinematográficas com Three.js, shaders customizados, micro-interações táteis e narrativas imersivas via scrollytelling.
                  </p>
                </div>

                <div className="service-card">
                  <span className="service-card-badge">Pilar 03</span>
                  <h4 className="service-card-title">Sistemas & SaaS</h4>
                  <p className="service-card-desc">
                    Desenvolvimento de software sob medida, plataformas all-in-one para agências, ERPs clínicos e integrações de dados em tempo real.
                  </p>
                </div>

                <div className="service-card">
                  <span className="service-card-badge">Pilar 04</span>
                  <h4 className="service-card-title">Performance & Tráfego</h4>
                  <p className="service-card-desc">
                    Mídia programática, gestão de tráfego de alta conversão, inteligência de dados (BI), dashboards em tempo real e redução de CAC.
                  </p>
                </div>
              </motion.div>
            )}

            {tab === 'saude' && (
              <motion.div
                key="saude"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
              >
                <div className="health-compliance-callout">
                  <div className="health-callout-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                  </div>
                  <div className="health-callout-text">
                    <h4>Publicidade em Saúde em Conformidade Ética CFM & CFO</h4>
                    <p>
                      Atuamos em estrita consonância com a Resolução CFM nº 2.336/2023 e o Código de Ética Odontológica (Resolução CFO nº 196/2019). Desenvolvemos comunicação médica de autoridade com caráter educativo, humanizado e livre de sensacionalismo ou autopromoção antiética.
                    </p>
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 24 }}>
                  <span style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--fh)' }}>
                    Cases em Destaque no Hub Saúde
                  </span>
                  <h3 style={{ fontFamily: 'var(--fh)', fontSize: '20px', color: '#fff', margin: '8px 0 10px 0' }}>
                    Dra. Lívia Esper — Experiência Web & ERP Clínico
                  </h3>
                  <p style={{ color: '#a0a0b0', fontSize: '13px', lineHeight: 1.6, marginBottom: 18 }}>
                    Desenvolvemos uma experiência digital afetuosa com animação 3D e pré-cadastro inteligente que eliminou o medo infantil de dentista e reduziu faltas em 50%, aliada a um software clínico proprietário com prontuário interativo.
                  </p>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <button
                      onClick={() => {
                        onClose();
                        onSelectCase('livia-esper-site');
                      }}
                      className="btn-gold"
                      style={{ fontSize: '11px', padding: '8px 16px' }}
                    >
                      Ver Case: Experiência Web →
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        onSelectCase('livia-esper-sistema');
                      }}
                      className="btn-ghost"
                      style={{ fontSize: '11px', padding: '8px 16px' }}
                    >
                      Ver Case: Sistema Clínico →
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="institutional-footer">
            <span style={{ fontSize: '12px', color: '#8e8e9c' }}>
              Pronto para elevar o posicionamento da sua empresa?
            </span>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <a
                href="https://wa.me/5535999999999?text=Ol%C3%A1!%20Gostaria%20de%20solicitar%20uma%20proposta%20comercial%20para%20a%20Comunica%C3%A7%C3%A3o%20Social%20Ag."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-case-share"
                onClick={() => {
                  playClickSound(soundEnabled);
                  trackWhatsAppClick('institutional_footer_btn', 'Solicitar Proposta');
                }}
              >
                Solicitar Proposta no WhatsApp
              </a>
              <a
                href="https://cliente.comunicacaosocialag.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold"
                style={{ fontSize: '11px', padding: '9px 18px' }}
              >
                Área do Cliente
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
