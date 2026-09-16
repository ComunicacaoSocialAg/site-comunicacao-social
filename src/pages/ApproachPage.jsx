import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { playClickSound } from '../utils/audio';
import { trackWhatsAppClick } from '../utils/analytics';

export default function ApproachPage({ onBack, onNavigateContact, soundEnabled }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleContactClick = () => {
    playClickSound(soundEnabled);
    trackWhatsAppClick('approach_page_cta', 'Iniciar Conversa');
    if (onNavigateContact) {
      onNavigateContact();
    } else {
      window.open('https://wa.me/5535999999999?text=Ol%C3%A1!%20Conheci%20a%20metodologia%20da%20CS%20Ag%20(Escutar,%20Traduzir,%20Amplificar)%20e%20gostaria%20de%20conversar%20sobre%20o%20meu%20projeto.', '_blank');
    }
  };

  return (
    <motion.main
      className="page-editorial-root"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Top Bar */}
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
          <button className="btn-gold" style={{ fontSize: '11px', padding: '6px 14px' }} onClick={handleContactClick}>
            Contato →
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="page-hero-section">
        <span className="editorial-tag">Como pensamos</span>
        <h1 className="editorial-title">
          Amplificar não é gritar mais alto. É saber exatamente o que vale a pena ser dito, e garantir que chegue a quem precisa ouvir.
        </h1>
        <p className="editorial-lead">
          Nosso processo tem três movimentos fundamentais. Nenhum projeto passa direto para o terceiro sem passar pelos dois primeiros.
        </p>
      </section>

      {/* 01 — Escutar */}
      <section className="editorial-movement-section">
        <div className="movement-num-col">
          <span className="movement-huge-num">01</span>
        </div>
        <div className="movement-content-col">
          <span className="movement-reputation-tag">
            Nossa reputação em: diagnóstico · escuta ativa · leitura de contexto · honestidade
          </span>
          <h2 className="movement-title">Escutar</h2>
          <p className="movement-desc">
            Antes de amplificar qualquer coisa, é preciso saber o que merece ser dito. Entramos no negócio, no mercado e no comportamento do cliente final até encontrar a frase que ninguém ali dentro tinha conseguido formular sozinho.
          </p>
          <p className="movement-highlight">
            Nenhuma peça nasce nesta agência sem ter passado por essa etapa. Marca que pula a escuta vira campanha bonita sem repertório.
          </p>
        </div>
      </section>

      {/* 02 — Traduzir */}
      <section className="editorial-movement-section">
        <div className="movement-num-col">
          <span className="movement-huge-num">02</span>
        </div>
        <div className="movement-content-col">
          <span className="movement-reputation-tag">
            Nossa reputação em: estratégia · criação · método · precisão
          </span>
          <h2 className="movement-title">Traduzir</h2>
          <p className="movement-desc">
            Uma verdade de negócio não vira comunicação sozinha. Traduzimos posicionamento em narrativa, narrativa em sistema visual, e sistema visual em peças que funcionam no feed, na rua, na busca e na conversa de WhatsApp.
          </p>
          <p className="movement-highlight">
            A mesma ideia, coerente em todos os pontos de contato. Isso é o que separa identidade de colagem.
          </p>
        </div>
      </section>

      {/* 03 — Amplificar */}
      <section className="editorial-movement-section">
        <div className="movement-num-col">
          <span className="movement-huge-num" style={{ color: 'var(--gold)' }}>03</span>
        </div>
        <div className="movement-content-col">
          <span className="movement-reputation-tag">
            Nossa reputação em: alcance · performance · dados · resultado
          </span>
          <h2 className="movement-title">Amplificar</h2>
          <p className="movement-desc">
            Comunicação que não chega a ninguém é diário pessoal, não trabalho de agência. Distribuímos com mídia paga, SEO, presença orgânica e tecnologia própria — e medimos o que aconteceu depois, para recalibrar o que vier a seguir.
          </p>
          <p className="movement-highlight">
            Amplificar é o nosso verbo. E amplificar, aqui, tem métrica.
          </p>
        </div>
      </section>

      {/* O que isso significa na prática */}
      <section className="editorial-block" style={{ borderBottom: 'none' }}>
        <span className="editorial-tag">Na prática</span>
        <h2 className="editorial-subtitle" style={{ marginBottom: 24 }}>
          Todo projeto que sai da CS Ag responde três perguntas:
        </h2>
        <div className="practical-questions-grid">
          <div className="question-card">
            <span className="q-badge">01</span>
            <h3>Por que isso precisava ser dito agora?</h3>
            <p>Conexão com timing de mercado, oportunidade competitiva e maturidade do público.</p>
          </div>
          <div className="question-card">
            <span className="q-badge">02</span>
            <h3>Por que essa é a forma certa de dizer?</h3>
            <p>Adequação estética, narrativa autêntica e linguagem proprietária da marca.</p>
          </div>
          <div className="question-card">
            <span className="q-badge">03</span>
            <h3>Como vamos saber se funcionou?</h3>
            <p>Métrica clara de sucesso, indicadores de performance (KPIs) e aprendizado contínuo.</p>
          </div>
        </div>
        <p className="practical-rule">
          Se um projeto não responde às três, ele não está pronto. Simples assim.
        </p>
      </section>

      {/* CTA Final */}
      <section className="editorial-cta-banner">
        <h2>Quer aplicar essa metodologia na sua empresa?</h2>
        <p>Vamos conversar sobre o momento atual do seu negócio.</p>
        <button className="btn-gold" style={{ fontSize: '13px', padding: '14px 28px' }} onClick={handleContactClick}>
          Conversar com a Equipe →
        </button>
      </section>

      <footer className="pp-footer">
        <span>© {new Date().getFullYear()} Comunicação Social Ag — Todos os direitos reservados</span>
        <span>Poços de Caldas, MG</span>
      </footer>
    </motion.main>
  );
}
