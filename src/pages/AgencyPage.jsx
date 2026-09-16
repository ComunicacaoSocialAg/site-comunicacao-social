import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { playClickSound } from '../utils/audio';
import { trackWhatsAppClick } from '../utils/analytics';

export default function AgencyPage({ onBack, onNavigateContact, soundEnabled }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleContactClick = () => {
    playClickSound(soundEnabled);
    trackWhatsAppClick('agency_page_cta', 'Iniciar Conversa');
    if (onNavigateContact) {
      onNavigateContact();
    } else {
      window.open('https://wa.me/5535999999999?text=Ol%C3%A1!%20Li%20o%20manifesto%20da%20CS%20Ag%20e%20gostaria%20de%20conversar%20sobre%20a%20minha%20marca.', '_blank');
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
        <span className="editorial-tag">O que a CS Ag é</span>
        <h1 className="editorial-title">
          Agência de comunicação estratégica sediada em Poços de Caldas, construída para marcas que precisam ser ouvidas além do seu próprio quarteirão.
        </h1>
        <p className="editorial-lead">
          Não vendemos peças soltas. Construímos sistemas de crescimento que unem estratégia, criação, tecnologia e execução — porque estratégia sem criatividade é esquecível, e criatividade sem estratégia é inútil.
        </p>
      </section>

      {/* De onde viemos */}
      <section className="editorial-block">
        <div className="editorial-grid-2">
          <div>
            <span className="editorial-tag">De onde viemos</span>
            <h2 className="editorial-subtitle">Raiz local. Ambição sem fronteiras.</h2>
          </div>
          <div className="editorial-text-col">
            <p>
              Nascemos em Poços de Caldas há 5 anos, num mercado publicitário local acostumado com o mediano. A aposta era simples e difícil: entregar o que a maioria só promete.
            </p>
            <p>
              Não veio de template. Investimos em tecnologia quando o padrão da região ainda era planilha. Em vídeo quando texto bastava para a maioria. Em inteligência artificial quando isso ainda soava distante da realidade de uma agência do interior. Evolução constante não é discurso aqui. É como a casa é construída.
            </p>
            <p style={{ color: 'var(--gold)', fontWeight: 600 }}>
              O resultado: uma agência que atua com raiz local e ambição sem fronteira.
            </p>
          </div>
        </div>
      </section>

      {/* Os números que provam */}
      <section className="editorial-stats-section">
        <span className="editorial-tag">Os números que provam</span>
        <div className="editorial-stats-grid">
          <div className="editorial-stat-card">
            <span className="stat-number">80+</span>
            <span className="stat-label">Clientes atendidos</span>
          </div>
          <div className="editorial-stat-card">
            <span className="stat-number">+400%</span>
            <span className="stat-label">Crescimento em 4 anos</span>
          </div>
          <div className="editorial-stat-card">
            <span className="stat-number">5</span>
            <span className="stat-label">Anos de mercado</span>
          </div>
          <div className="editorial-stat-card">
            <span className="stat-number">∞</span>
            <span className="stat-label">Fronteiras de atuação</span>
          </div>
        </div>
      </section>

      {/* O que fazemos: 6 frentes */}
      <section className="editorial-block">
        <span className="editorial-tag">O que fazemos</span>
        <h2 className="editorial-subtitle" style={{ marginBottom: 32 }}>
          Seis frentes, uma só cabeça pensante por trás de cada uma:
        </h2>
        <div className="editorial-capabilities-grid">
          <div className="capability-card">
            <span className="cap-idx">01</span>
            <h3>Estratégia</h3>
            <p>Diagnóstico, posicionamento e plano de crescimento antes de qualquer peça ser criada.</p>
          </div>
          <div className="capability-card">
            <span className="cap-idx">02</span>
            <h3>Branding</h3>
            <p>Identidade visual e verbal que sustenta a marca em qualquer superfície, do feed ao letreiro.</p>
          </div>
          <div className="capability-card">
            <span className="cap-idx">03</span>
            <h3>Conteúdo</h3>
            <p>Produção editorial, social media e narrativa de marca com consistência de calendário.</p>
          </div>
          <div className="capability-card">
            <span className="cap-idx">04</span>
            <h3>Design</h3>
            <p>Peças, sistemas visuais e experiências digitais que carregam a estratégia sem perder impacto.</p>
          </div>
          <div className="capability-card">
            <span className="cap-idx">05</span>
            <h3>Mídia e Performance</h3>
            <p>Tráfego pago, SEO e distribuição com meta e número, não só estética.</p>
          </div>
          <div className="capability-card">
            <span className="cap-idx">06</span>
            <h3>Tecnologia</h3>
            <p>Sites, sistemas e automações desenvolvidos sob medida, incluindo aplicações com inteligência artificial.</p>
          </div>
        </div>
      </section>

      {/* Quem opera */}
      <section className="editorial-block" style={{ borderBottom: 'none' }}>
        <div className="editorial-grid-2">
          <div>
            <span className="editorial-tag">Quem opera</span>
            <h2 className="editorial-subtitle">Um time enxuto, no lugar de uma estrutura inchada.</h2>
          </div>
          <div className="editorial-text-col">
            <p>
              Aqui não existe conta gerenciada por estagiário nem estratégia terceirizada para quem nunca viu o cliente ao vivo. Cada projeto passa pelas mesmas mãos que pensam a agência inteira — do diagnóstico à entrega. É por isso que o padrão não cai quando o projeto cresce.
            </p>
            <p>
              Estamos em Poços de Caldas. Atendemos como quem está perto, porque está.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="editorial-cta-banner">
        <h2>Pronto para amplificar a sua marca?</h2>
        <p>Conte o desafio. A gente pensa o próximo movimento.</p>
        <button className="btn-gold" style={{ fontSize: '13px', padding: '14px 28px' }} onClick={handleContactClick}>
          Vamos Conversar →
        </button>
      </section>

      <footer className="pp-footer">
        <span>© {new Date().getFullYear()} Comunicação Social Ag — Todos os direitos reservados</span>
        <span>Poços de Caldas, MG</span>
      </footer>
    </motion.main>
  );
}
