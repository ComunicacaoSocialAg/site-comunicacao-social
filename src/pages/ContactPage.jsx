import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playClickSound } from '../utils/audio';
import { trackContactStep, trackWhatsAppClick } from '../utils/analytics';

const NEED_OPTIONS = [
  'Preciso de uma marca do zero',
  'Quero repaginar o que já existe',
  'Preciso de conteúdo e redes sociais',
  'Quero tráfego pago e performance',
  'Preciso de um site ou sistema',
  'Ainda não sei, quero conversar',
];

export default function ContactPage({ onBack, onNavigateWork, soundEnabled }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nome: '',
    empresa: '',
    necessidade: [],
    contexto: '',
    prazoVerba: '',
    email: '',
    whatsapp: '',
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const nextStep = () => {
    playClickSound(soundEnabled);
    const newStep = Math.min(step + 1, 7);
    setStep(newStep);
    trackContactStep(newStep, `Etapa ${newStep}`);
  };

  const prevStep = () => {
    playClickSound(soundEnabled);
    setStep(Math.max(step - 1, 1));
  };

  const toggleNeed = (opt) => {
    playClickSound(soundEnabled);
    setFormData(prev => {
      const exists = prev.necessidade.includes(opt);
      return {
        ...prev,
        necessidade: exists
          ? prev.necessidade.filter(x => x !== opt)
          : [...prev.necessidade, opt]
      };
    });
  };

  const handleSend = () => {
    playClickSound(soundEnabled);
    trackContactStep(7, 'Mensagem Enviada');
    trackWhatsAppClick('contact_form_complete', formData.nome);

    // Build WhatsApp message formatted with full briefing
    const msg = [
      `*NOVO PROJETO - CONTATO VIA SITE*`,
      `*Nome:* ${formData.nome || 'Não informado'}`,
      `*Empresa:* ${formData.empresa || 'Não informada'}`,
      `*Necessidade:* ${formData.necessidade.join(', ') || 'A definir'}`,
      `*Contexto:* ${formData.contexto || 'Sem contexto detalhado'}`,
      formData.prazoVerba ? `*Prazo/Verba:* ${formData.prazoVerba}` : null,
      `*E-mail:* ${formData.email || 'Não informado'}`,
      `*WhatsApp:* ${formData.whatsapp || 'Não informado'}`
    ].filter(Boolean).join('\n\n');

    const waUrl = `https://wa.me/5535999999999?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
    setStep(7);
  };

  const userName = formData.nome.trim() ? formData.nome.trim().split(' ')[0] : 'amigo(a)';

  return (
    <motion.main
      className="page-editorial-root contact-page-root"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Top Nav */}
      <nav className="page-nav">
        <button className="pp-back" onClick={onBack}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          voltar à galeria
        </button>
        <div className="pp-nav-center">
          <img src="/assets/brand/logo-sem-fundo.png" alt="CS Ag" style={{ width: 24, height: 24, objectFit: 'contain' }} />
          <span className="pp-nav-label">Comunicação Social Ag</span>
        </div>
        <div style={{ width: 100, textAlign: 'right' }}>
          <span style={{ fontSize: '11px', color: 'var(--gold)', fontFamily: 'var(--fh)', fontWeight: 700 }}>
            Etapa {step} de 7
          </span>
        </div>
      </nav>

      <div className="contact-layout-grid">
        {/* Main Interactive Form Column */}
        <div className="contact-form-column">
          <header className="contact-header">
            <span className="editorial-tag">Início do Projeto</span>
            <h1 className="editorial-title" style={{ fontSize: '36px', marginBottom: 8 }}>
              Bora conversar?
            </h1>
            <p style={{ color: '#9090a0', fontSize: '15px' }}>
              Conta pra gente o que você precisa amplificar. A resposta chega direto de quem vai tocar o seu projeto — sem fila, sem call center.
            </p>
          </header>

          <div className="contact-step-box">
            <AnimatePresence mode="wait">
              {/* ETAPA 1: Nome & Empresa */}
              {step === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="step-content"
                >
                  <span className="step-badge">Etapa 01</span>
                  <h2 className="step-prompt">
                    Oi! Que bom te ver por aqui. Vamos começar com o básico: qual é o seu nome e de qual marca ou projeto você fala?
                  </h2>
                  <div className="input-group">
                    <label className="input-label">Seu Nome</label>
                    <input
                      type="text"
                      className="contact-input"
                      placeholder="Ex: Ana Silva"
                      value={formData.nome}
                      onChange={e => setFormData({ ...formData, nome: e.target.value })}
                      autoFocus
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Marca ou Empresa</label>
                    <input
                      type="text"
                      className="contact-input"
                      placeholder="Ex: Lumina Saúde"
                      value={formData.empresa}
                      onChange={e => setFormData({ ...formData, empresa: e.target.value })}
                    />
                  </div>
                  <button
                    className="btn-gold"
                    style={{ marginTop: 20, width: '100%' }}
                    onClick={nextStep}
                    disabled={!formData.nome.trim()}
                  >
                    Continuar →
                  </button>
                </motion.div>
              )}

              {/* ETAPA 2: O que precisa */}
              {step === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="step-content"
                >
                  <span className="step-badge">Etapa 02</span>
                  <h2 className="step-prompt">
                    Legal, {userName}. O que te trouxe até a CS Ag hoje?
                  </h2>
                  <p style={{ fontSize: '13px', color: '#888', marginBottom: 16 }}>
                    Selecione uma ou mais opções:
                  </p>
                  <div className="chips-grid">
                    {NEED_OPTIONS.map(opt => {
                      const selected = formData.necessidade.includes(opt);
                      return (
                        <button
                          key={opt}
                          className={`contact-chip ${selected ? 'active' : ''}`}
                          onClick={() => toggleNeed(opt)}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  <div className="step-actions">
                    <button className="btn-ghost" onClick={prevStep}>← Voltar</button>
                    <button
                      className="btn-gold"
                      onClick={nextStep}
                      disabled={formData.necessidade.length === 0}
                    >
                      Continuar →
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ETAPA 3: Contexto */}
              {step === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="step-content"
                >
                  <span className="step-badge">Etapa 03</span>
                  <h2 className="step-prompt">
                    Perfeito. Nos conta rapidamente o cenário: o que já existe hoje e o que te incomoda nisso?
                  </h2>
                  <textarea
                    rows={5}
                    className="contact-textarea"
                    placeholder="Nos conte brevemente o desafio principal..."
                    value={formData.contexto}
                    onChange={e => setFormData({ ...formData, contexto: e.target.value })}
                    autoFocus
                  />
                  <div className="step-actions">
                    <button className="btn-ghost" onClick={prevStep}>← Voltar</button>
                    <button className="btn-gold" onClick={nextStep}>
                      Continuar →
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ETAPA 4: Prazo e Verba */}
              {step === 4 && (
                <motion.div
                  key="step-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="step-content"
                >
                  <span className="step-badge">Etapa 04</span>
                  <h2 className="step-prompt">
                    Isso ajuda a gente a te responder com mais precisão: existe um prazo ou uma verba já definida?
                  </h2>
                  <input
                    type="text"
                    className="contact-input"
                    placeholder="Ex: Precisamos lançar em 60 dias / Verba aprox..."
                    value={formData.prazoVerba}
                    onChange={e => setFormData({ ...formData, prazoVerba: e.target.value })}
                    autoFocus
                  />
                  <span className="input-helper">
                    Pode deixar em branco se ainda não tiver isso definido — não é eliminatório.
                  </span>
                  <div className="step-actions">
                    <button className="btn-ghost" onClick={prevStep}>← Voltar</button>
                    <button className="btn-gold" onClick={nextStep}>
                      Continuar →
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ETAPA 5: Dados de Contato */}
              {step === 5 && (
                <motion.div
                  key="step-5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="step-content"
                >
                  <span className="step-badge">Etapa 05</span>
                  <h2 className="step-prompt">
                    Onde a gente te encontra?
                  </h2>
                  <div className="input-group">
                    <label className="input-label">E-mail Profissional</label>
                    <input
                      type="email"
                      className="contact-input"
                      placeholder="seuemail@empresa.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      autoFocus
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">WhatsApp com DDD</label>
                    <input
                      type="tel"
                      className="contact-input"
                      placeholder="(35) 99999-9999"
                      value={formData.whatsapp}
                      onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                    />
                  </div>
                  <div className="step-actions">
                    <button className="btn-ghost" onClick={prevStep}>← Voltar</button>
                    <button
                      className="btn-gold"
                      onClick={nextStep}
                      disabled={!formData.email && !formData.whatsapp}
                    >
                      Revisar e Enviar →
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ETAPA 6: Confirmação */}
              {step === 6 && (
                <motion.div
                  key="step-6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="step-content"
                >
                  <span className="step-badge">Etapa 06</span>
                  <h2 className="step-prompt">
                    Show, {userName}!
                  </h2>
                  <p style={{ color: '#b0b0c0', lineHeight: 1.7, marginBottom: 20 }}>
                    Sua mensagem já está a caminho da nossa equipe. Normalmente respondemos em até 1 dia útil — geralmente bem antes disso.
                  </p>
                  <div className="summary-card">
                    <div><strong>Nome:</strong> {formData.nome} {formData.empresa ? `(${formData.empresa})` : ''}</div>
                    <div><strong>Necessidades:</strong> {formData.necessidade.join(', ') || 'Geral'}</div>
                    {formData.contexto && <div><strong>Contexto:</strong> {formData.contexto}</div>}
                    <div><strong>Contato:</strong> {formData.whatsapp || formData.email}</div>
                  </div>
                  <div className="step-actions">
                    <button className="btn-ghost" onClick={prevStep}>← Ajustar</button>
                    <button className="btn-gold" onClick={handleSend}>
                      Confirmar e Enviar via WhatsApp →
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ETAPA 7: Tela de Sucesso */}
              {step === 7 && (
                <motion.div
                  key="step-7"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="step-content success-box"
                >
                  <div className="success-icon">✓</div>
                  <h2 style={{ fontFamily: 'var(--fh)', fontSize: '28px', color: '#fff', marginBottom: 12 }}>
                    Recebido com sucesso!
                  </h2>
                  <p style={{ color: '#b0b0c0', lineHeight: 1.7, maxWidth: 440, margin: '0 auto 28px' }}>
                    Sua mensagem caiu direto na nossa mesa de novos projetos. Enquanto isso, que tal dar uma olhada nos nossos cases?
                  </p>
                  <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
                    <button className="btn-gold" onClick={onNavigateWork || onBack}>
                      Ver Trabalhos →
                    </button>
                    <button className="btn-ghost" onClick={onBack}>
                      Voltar à Galeria 3D
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Fixed Direct Contact Block (FALE DIRETO) */}
        <aside className="contact-sticky-sidebar">
          <div className="fale-direto-card">
            <span className="editorial-tag">Canais Imediatos</span>
            <h3 className="fale-direto-title">Fale Direto</h3>
            <p className="fale-direto-sub">
              Prefere falar sem preencher formulário? Nossos canais diretos estão abertos:
            </p>

            <div className="direct-item">
              <span className="direct-label">WhatsApp</span>
              <a
                href="https://wa.me/5535999999999?text=Ol%C3%A1!%20Gostaria%20de%20conversar%20diretamente%20com%20um%20estrategista%20da%20CS%20Ag."
                target="_blank"
                rel="noopener noreferrer"
                className="direct-link"
                onClick={() => trackWhatsAppClick('contact_sidebar_whatsapp', 'WhatsApp Direto')}
              >
                +55 (35) 99999-9999 ↗
              </a>
            </div>

            <div className="direct-item">
              <span className="direct-label">E-mail</span>
              <a href="mailto:contato@comunicacaosocialag.com.br" className="direct-link">
                contato@comunicacaosocialag.com.br ↗
              </a>
            </div>

            <div className="direct-item">
              <span className="direct-label">Onde estamos</span>
              <span className="direct-val">Poços de Caldas, MG — Brasil</span>
            </div>

            <div className="direct-item" style={{ borderBottom: 'none' }}>
              <span className="direct-label">Área do Cliente</span>
              <a href="https://cliente.comunicacaosocialag.com.br" target="_blank" rel="noopener noreferrer" className="direct-link-dim">
                Portal de Clientes Ativos ↗
              </a>
            </div>
          </div>
        </aside>
      </div>

      <footer className="pp-footer">
        <span>© {new Date().getFullYear()} Comunicação Social Ag — Todos os direitos reservados</span>
        <span>Poços de Caldas, MG</span>
      </footer>
    </motion.main>
  );
}
