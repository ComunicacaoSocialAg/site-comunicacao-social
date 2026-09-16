import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { playClickSound, playHoverSound } from '../utils/audio';
import { trackWhatsAppClick } from '../utils/analytics';
import CinemaReelPlayer from '../components/CinemaReelPlayer';

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

  const handleHover = () => {
    playHoverSound(soundEnabled);
  };

  // Stagger animation container variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(4px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const capabilities = [
    {
      idx: '01',
      tag: 'Posicionamento',
      title: 'Estratégia de Marca',
      badge: 'CORE',
      desc: 'Diagnóstico profundo de mercado, tese de diferenciação competitiva e plano de crescimento de longo prazo antes de desenhar a primeira linha.',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 000 20M2 12h20" />
        </svg>
      )
    },
    {
      idx: '02',
      tag: 'Identidade & Sistema',
      title: 'Branding & Design System',
      badge: 'ALTO VALOR',
      desc: 'Sistemas visuais e tipográficos proprietários que conferem autoridade estética imediata e consistência matemática em qualquer superfície.',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2l8 4.5v11L12 22l-8-4.5v-11L12 2z" />
          <path d="M12 12l8-4.5M12 12v10M12 12L4 7.5" />
        </svg>
      )
    },
    {
      idx: '03',
      tag: 'Narrativa Proprietária',
      title: 'Conteúdo & Storytelling',
      badge: 'RESSONÂNCIA',
      desc: 'Produção editorial cinematográfica e narrativas de marca que constroem repertório cultural e lealdade de comunidade, fugindo do feed descartável.',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
        </svg>
      )
    },
    {
      idx: '04',
      tag: 'Conversão & Escala',
      title: 'Mídia & Performance CRO',
      badge: 'GROWTH',
      desc: 'Orquestração cirúrgica de tráfego pago (Meta/Google), SEO de alta intenção e otimização contínua de funil orientada a margem real de lucro.',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M18 20V10M12 20V4M6 20v-6" />
        </svg>
      )
    },
    {
      idx: '05',
      tag: 'Engenharia Digital',
      title: 'Web 3D & Creative Tech',
      badge: 'AWWWARDS',
      desc: 'Experiências digitais interativas com Three.js, shaders GLSL, WebGL e arquiteturas headless modernas que transformam sites institucionais em marcos memoráveis.',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
        </svg>
      )
    },
    {
      idx: '06',
      tag: 'Núcleo Regulado',
      title: 'Hub Saúde & Compliance',
      badge: 'CFM / CFO',
      desc: 'Comunicação médica e odontológica de alto padrão com blindagem jurídica ética total (Resoluções CFM 2.336/2023 e CFO 196/2019).',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2v20M2 12h20" strokeLinecap="round" />
        </svg>
      )
    }
  ];

  return (
    <motion.main
      className="page-editorial-root"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Dynamic Ambient Mesh Spotlights */}
      <div className="editorial-ambient-spotlight left" />
      <div className="editorial-ambient-spotlight right" />

      {/* Floating Island Top Bar */}
      <nav className="page-nav">
        <button className="pp-back" onClick={onBack} onMouseEnter={handleHover}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          voltar à galeria
        </button>

        <div className="pp-nav-center">
          <img src="/assets/brand/logo-sem-fundo.png" alt="CS Ag" style={{ width: 24, height: 24, objectFit: 'contain' }} />
          <span className="pp-nav-label">Comunicação Social Ag</span>
        </div>

        <div style={{ textAlign: 'right' }}>
          <button className="btn-gold-pill" onClick={handleContactClick} onMouseEnter={handleHover}>
            <span>Iniciar Conversa</span>
            <span className="btn-icon-wrapper">→</span>
          </button>
        </div>
      </nav>

      {/* Main Content Container with Staggered Reveals */}
      <motion.div
        className="editorial-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section & Manifesto */}
        <motion.section className="editorial-hero-block" variants={itemVariants}>
          <div className="editorial-eyebrow">
            <span className="eyebrow-dot" />
            <span>ESTÚDIO ESTRATÉGICO & CRIATIVO • POÇOS DE CALDAS</span>
          </div>

          <h1 className="editorial-massive-title">
            Agência de comunicação estratégica para marcas que precisam ser ouvidas{' '}
            <span className="editorial-gold-highlight">além do seu próprio quarteirão.</span>
          </h1>

          <p className="editorial-lead-text">
            Não vendemos peças soltas ou posts descartáveis. Construímos ecossistemas de crescimento que unem rigor analítico, direção de arte cinematográfica e tecnologia proprietária. Estratégia sem criatividade é invisível. Criatividade sem estratégia é irrelevante.
          </p>
        </motion.section>

        {/* Cinematic Reel Section (Vídeo Institucional Proprietário) */}
        <motion.section className="editorial-video-stage" variants={itemVariants}>
          <div className="video-stage-header">
            <div className="stage-tag">
              <span className="stage-indicator" />
              <span>O UNIVERSO CS AG EM MOVIMENTO</span>
            </div>
            <span className="stage-caption">Assista ao reel institucional da agência (25s)</span>
          </div>

          {/* Player de Vídeo Hardware Double-Bezel */}
          <CinemaReelPlayer soundEnabled={soundEnabled} />
        </motion.section>

        {/* De Onde Viemos — Trajetória & DNA */}
        <motion.section className="editorial-section-wrapper" variants={itemVariants}>
          <div className="editorial-split-layout">
            <div className="split-sticky-col">
              <span className="editorial-tag-pill">DE ONDE VIEMOS</span>
              <h2 className="split-title">
                Raiz local.<br />
                <span className="editorial-gold-text">Ambição sem fronteiras.</span>
              </h2>
              <p className="split-summary">
                Fundada há 5 anos no Sul de Minas, a CS Ag nasceu com uma única tese: o mercado não precisava de mais uma agência de templates; precisava de um parceiro com coragem criativa e profundidade executiva.
              </p>

              {/* Mini Chronology */}
              <div className="split-timeline">
                <div className="timeline-node">
                  <span className="node-year">2021</span>
                  <span className="node-desc">Início das operações em Poços de Caldas focadas em inteligência estratégica.</span>
                </div>
                <div className="timeline-node">
                  <span className="node-year">2023</span>
                  <span className="node-desc">Pioneirismo em Web 3D e produções audiovisuais de padrão cinema.</span>
                </div>
                <div className="timeline-node">
                  <span className="node-year">2026</span>
                  <span className="node-desc">Mais de 80 marcas atendidas em todo o Brasil e projetos premiados.</span>
                </div>
              </div>
            </div>

            <div className="split-content-col">
              <div className="manifesto-card double-bezel-card">
                <div className="inner-card-content">
                  <h3 className="card-headline">Por que recusamos o padrão industrial</h3>
                  <p>
                    Investimos em tecnologia de ponta quando o padrão do interior ainda era planilha em Excel. Desenvolvemos interfaces interativas em WebGL e 3D quando qualquer site padrão já bastava para a concorrência. Adotamos inteligência artificial em processos estratégicos antes que ela virasse manchete.
                  </p>
                  <p>
                    Evolução constante não é um slide de apresentação para nós. É a estrutura física sobre a qual construímos cada projeto.
                  </p>
                  <div className="quote-badge">
                    <span>“Criatividade que não move ponteiros de negócio é vaidade. Nós construímos valor.”</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Os Números Que Provam — Animated Kinetic Counters */}
        <motion.section className="editorial-stats-panel" variants={itemVariants}>
          <div className="stats-header">
            <span className="editorial-tag-pill">TRAÇÃO & RESULTADOS</span>
            <h2 className="stats-main-title">A solidez de quem entrega o que promete.</h2>
          </div>

          <div className="stats-quad-grid">
            <div className="stat-bezel-card" onMouseEnter={handleHover}>
              <div className="stat-glow-radial" />
              <div className="stat-number-display">80<span className="stat-symbol">+</span></div>
              <div className="stat-title">Marcas Posicionadas</div>
              <div className="stat-sub">Desde players regionais de destaque até marcas com projeção nacional.</div>
            </div>

            <div className="stat-bezel-card" onMouseEnter={handleHover}>
              <div className="stat-glow-radial" />
              <div className="stat-number-display">+400<span className="stat-symbol">%</span></div>
              <div className="stat-title">Crescimento Recorde</div>
              <div className="stat-sub">Maior índice de escala comercial comprovada em cliente ativo.</div>
            </div>

            <div className="stat-bezel-card" onMouseEnter={handleHover}>
              <div className="stat-glow-radial" />
              <div className="stat-number-display">5<span className="stat-symbol"> ANOS</span></div>
              <div className="stat-title">De Operação Contínua</div>
              <div className="stat-sub">Independência criativa, saúde financeira e retenção sólida de contas.</div>
            </div>

            <div className="stat-bezel-card" onMouseEnter={handleHover}>
              <div className="stat-glow-radial" />
              <div className="stat-number-display">100<span className="stat-symbol">%</span></div>
              <div className="stat-title">Projetos Sob Medida</div>
              <div className="stat-sub">Zero código reaproveitado, zero templates genéricos de mercado.</div>
            </div>
          </div>
        </motion.section>

        {/* As 6 Frentes de Atuação — Bento Grid */}
        <motion.section className="editorial-bento-section" variants={itemVariants}>
          <div className="bento-header-row">
            <div>
              <span className="editorial-tag-pill">ECOSSISTEMA INTEGRADO</span>
              <h2 className="bento-title">Seis frentes com uma só mente estratégica.</h2>
            </div>
            <p className="bento-intro-text">
              Eliminamos o ruído de lidar com múltiplos fornecedores desarticulados. Do diagnóstico à engenharia final, nossa equipe opera de ponta a ponta.
            </p>
          </div>

          <div className="bento-cards-grid">
            {capabilities.map((cap) => (
              <div key={cap.idx} className="bento-capability-card" onMouseEnter={handleHover}>
                <div className="bento-card-top">
                  <div className="bento-icon-wrapper">{cap.icon}</div>
                  <span className="bento-card-badge">{cap.badge}</span>
                </div>
                <div className="bento-card-meta">
                  <span className="bento-idx">{cap.idx}</span>
                  <span className="bento-tag">{cap.tag}</span>
                </div>
                <h3 className="bento-card-name">{cap.title}</h3>
                <p className="bento-card-desc">{cap.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Quem Opera — Manifesto Boutique */}
        <motion.section className="editorial-studio-manifesto" variants={itemVariants}>
          <div className="manifesto-inner-box">
            <span className="editorial-tag-pill">QUEM OPERA O SEU PROJETO</span>
            <h2 className="manifesto-heading">
              A inteligência de uma grande agência.<br />
              <span className="editorial-gold-highlight">A agilidade e atenção de um estúdio boutique.</span>
            </h2>
            <p className="manifesto-body">
              Você não falará com um estagiário de atendimento ou um intermediário corporativo. Na CS Ag, quem senta na mesa de reunião é quem desenha a estratégia, programa o código e dirige a campanha. Acreditamos em proximidade radical, diálogo transparente e velocidade executiva.
            </p>

            <div className="manifesto-pillars">
              <div className="pillar-item">
                <span className="pillar-check">✓</span>
                <span>Contato direto com os diretores de projeto</span>
              </div>
              <div className="pillar-item">
                <span className="pillar-check">✓</span>
                <span>Transparência analítica total de métricas</span>
              </div>
              <div className="pillar-item">
                <span className="pillar-check">✓</span>
                <span>Contratos com escopo e SLA rigorosamente cumpridos</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* CTA Banner de Alto Impacto */}
        <motion.section className="editorial-final-cta" variants={itemVariants}>
          <div className="cta-backdrop-glow" />
          <div className="cta-content-wrapper">
            <span className="cta-eyebrow">HORA DE DAR O PRÓXIMO PASSO</span>
            <h2 className="cta-title">
              Pronto para transformar a presença da sua marca no mercado?
            </h2>
            <p className="cta-subtitle">
              Vamos agendar uma conversa estratégica de 30 minutos para avaliar o seu momento e os canais de maior alavancagem para o seu negócio.
            </p>

            <div className="cta-buttons-group">
              <button className="btn-gold-pill large" onClick={handleContactClick} onMouseEnter={handleHover}>
                <span>Iniciar Briefing Estratégico</span>
                <span className="btn-icon-wrapper">→</span>
              </button>

              <button className="btn-ghost-pill" onClick={onBack} onMouseEnter={handleHover}>
                <span>Explorar Galeria 3D</span>
              </button>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </motion.main>
  );
}
