import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { playClickSound, playHoverSound } from '../utils/audio';
import { trackWhatsAppClick } from '../utils/analytics';

export default function ApproachPage({ onBack, onNavigateContact, soundEnabled }) {
  const [activeMovement, setActiveMovement] = useState('01');

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

  const handleHover = () => {
    playHoverSound(soundEnabled);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.14,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 32, filter: 'blur(4px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const questions = [
    {
      num: '01',
      title: 'Por que isso precisava ser dito agora?',
      subtitle: 'Timing de Mercado & Oportunidade Competitiva',
      answer: 'Toda campanha eficiente captura uma janela temporal específica. Se a mensagem pudesse ser dita há três anos ou daqui a três anos com o mesmo impacto, ela não tem urgência nem pertinência.'
    },
    {
      num: '02',
      title: 'Por que essa é a forma certa de dizer?',
      subtitle: 'Adequação Estética & Linguagem Proprietária',
      answer: 'O tom de voz, a paleta, a cadência visual e os canais escolhidos devem emanar unicamente do DNA da sua marca. Se trocarmos o seu logotipo pelo do concorrente e nada parecer estranho, o trabalho fracassou.'
    },
    {
      num: '03',
      title: 'Como vamos saber se funcionou?',
      subtitle: 'Métrica Clara de Sucesso & Aprendizado Contínuo',
      answer: 'Definimos antes do lançamento quais ponteiros devem se mover: taxa de conversão, custo de aquisição, recall ou ticket médio. Sem KPI tangível, a comunicação é apenas despesa, não investimento.'
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
      {/* Ambient Lighting Orbs */}
      <div className="editorial-ambient-spotlight left" />
      <div className="editorial-ambient-spotlight right" />

      {/* Floating Island Navigation */}
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

      {/* Content Container */}
      <motion.div
        className="editorial-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section & Core Thesis */}
        <motion.section className="editorial-hero-block" variants={itemVariants}>
          <div className="editorial-eyebrow">
            <span className="eyebrow-dot" />
            <span>NOSSA METODOLOGIA ESTRATÉGICA • O MÉTODO DOS 3 MOVIMENTOS</span>
          </div>

          <h1 className="editorial-massive-title">
            Amplificar não é gritar mais alto.{' '}
            <span className="editorial-gold-highlight">
              É saber exatamente o que vale a pena ser dito, e garantir que chegue a quem precisa ouvir.
            </span>
          </h1>

          <p className="editorial-lead-text">
            Nosso processo opera sob três movimentos rigorosos e interdependentes. Nenhum projeto passa direto para a amplificação sem ter consolidado a escuta e a tradução.
          </p>

          {/* Stepper Indicator */}
          <div className="movement-stepper-bar">
            <div
              className={`stepper-step ${activeMovement === '01' ? 'is-active' : ''}`}
              onClick={() => setActiveMovement('01')}
              onMouseEnter={handleHover}
            >
              <span className="step-badge">01</span>
              <span className="step-name">Escutar</span>
            </div>
            <div className="stepper-connector" />
            <div
              className={`stepper-step ${activeMovement === '02' ? 'is-active' : ''}`}
              onClick={() => setActiveMovement('02')}
              onMouseEnter={handleHover}
            >
              <span className="step-badge">02</span>
              <span className="step-name">Traduzir</span>
            </div>
            <div className="stepper-connector" />
            <div
              className={`stepper-step ${activeMovement === '03' ? 'is-active' : ''}`}
              onClick={() => setActiveMovement('03')}
              onMouseEnter={handleHover}
            >
              <span className="step-badge">03</span>
              <span className="step-name">Amplificar</span>
            </div>
          </div>
        </motion.section>

        {/* ── MOVIMENTO 01: ESCUTAR ───────────────────────────────────────────── */}
        <motion.section className="movement-showcase-section" variants={itemVariants}>
          <div className="movement-card-double-bezel">
            <div className="movement-card-inner">
              <div className="movement-text-panel">
                <div className="movement-tag-row">
                  <span className="movement-number-stroke">01</span>
                  <div className="movement-tag-pill">MOVIMENTO PRIMÁRIO</div>
                </div>

                <h2 className="movement-name-title">Escutar</h2>

                <div className="movement-reputation-badge">
                  Nossa reputação em: diagnóstico · escuta ativa · leitura de contexto · honestidade
                </div>

                <p className="movement-body-p">
                  Antes de amplificar qualquer coisa, é preciso saber o que merece ser dito. Entramos no negócio, no mercado e no comportamento do cliente final até encontrar a frase que ninguém ali dentro tinha conseguido formular sozinho.
                </p>

                <div className="movement-highlight-box">
                  <div className="box-line" />
                  <p>
                    Nenhuma peça nasce nesta agência sem ter passado por essa etapa. Marca que pula a escuta vira campanha bonita sem repertório.
                  </p>
                </div>
              </div>

              {/* Visual Interactive Diagram: Acoustic Radar / Frequency Scanner */}
              <div className="movement-visual-panel">
                <div className="radar-scanner-box">
                  <div className="radar-grid-rings">
                    <div className="radar-ring r1" />
                    <div className="radar-ring r2" />
                    <div className="radar-ring r3" />
                    <div className="radar-sweep-beam" />
                    <div className="radar-signal-blip b1" />
                    <div className="radar-signal-blip b2" />
                    <div className="radar-signal-blip b3" />
                    <div className="radar-core-dot">
                      <span className="dot-pulse" />
                    </div>
                  </div>
                  <div className="radar-hud-footer">
                    <span className="hud-code">FREQ_SCAN // 44.1kHz</span>
                    <span className="hud-status">SINAL DETECTADO: 99.4%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── MOVIMENTO 02: TRADUZIR ─────────────────────────────────────────── */}
        <motion.section className="movement-showcase-section" variants={itemVariants}>
          <div className="movement-card-double-bezel">
            <div className="movement-card-inner">
              <div className="movement-text-panel">
                <div className="movement-tag-row">
                  <span className="movement-number-stroke">02</span>
                  <div className="movement-tag-pill">MOVIMENTO DE SÍNTESE</div>
                </div>

                <h2 className="movement-name-title">Traduzir</h2>

                <div className="movement-reputation-badge">
                  Nossa reputação em: estratégia · criação · método · precisão
                </div>

                <p className="movement-body-p">
                  Uma verdade de negócio não vira comunicação sozinha. Traduzimos posicionamento em narrativa, narrativa em sistema visual, e sistema visual em peças que funcionam no feed, na rua, na busca e na conversa de WhatsApp.
                </p>

                <div className="movement-highlight-box">
                  <div className="box-line" />
                  <p>
                    A mesma ideia, coerente em todos os pontos de contato. Isso é o que separa identidade de colagem.
                  </p>
                </div>
              </div>

              {/* Visual Interactive Diagram: Signal Prism / Spectral Decoder */}
              <div className="movement-visual-panel">
                <div className="prism-decoder-box">
                  <div className="prism-rays-container">
                    <div className="prism-input-ray" />
                    <div className="prism-core-polygon">
                      <span>CS AG</span>
                    </div>
                    <div className="prism-output-streams">
                      <div className="output-stream s1"><span>NARRATIVA</span></div>
                      <div className="output-stream s2"><span>DESIGN SYSTEM</span></div>
                      <div className="output-stream s3"><span>CONVERSÃO</span></div>
                    </div>
                  </div>
                  <div className="radar-hud-footer">
                    <span className="hud-code">DECODER_MATRIX // GLSL</span>
                    <span className="hud-status">COERÊNCIA MULTICANAL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── MOVIMENTO 03: AMPLIFICAR ───────────────────────────────────────── */}
        <motion.section className="movement-showcase-section" variants={itemVariants}>
          <div className="movement-card-double-bezel highlight-gold">
            <div className="movement-card-inner">
              <div className="movement-text-panel">
                <div className="movement-tag-row">
                  <span className="movement-number-stroke gold">03</span>
                  <div className="movement-tag-pill gold">MOVIMENTO DE IMPACTO</div>
                </div>

                <h2 className="movement-name-title gold">Amplificar</h2>

                <div className="movement-reputation-badge">
                  Nossa reputação em: alcance · performance · dados · resultado
                </div>

                <p className="movement-body-p">
                  Comunicação que não chega a ninguém é diário pessoal, não trabalho de agência. Distribuímos com mídia paga, SEO, presença orgânica e tecnologia própria — e medimos o que aconteceu depois, para recalibrar o que vier a seguir.
                </p>

                <div className="movement-highlight-box gold">
                  <div className="box-line gold" />
                  <p>
                    Amplificar é o nosso verbo. E amplificar, aqui, tem métrica.
                  </p>
                </div>
              </div>

              {/* Visual Interactive Diagram: Concentric Broadcasting Sphere */}
              <div className="movement-visual-panel">
                <div className="broadcast-box">
                  <div className="broadcast-rings-emitter">
                    <div className="broadcast-ring ring-1" />
                    <div className="broadcast-ring ring-2" />
                    <div className="broadcast-ring ring-3" />
                    <div className="broadcast-ring ring-4" />
                    <div className="broadcast-center-core">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                      </svg>
                    </div>
                  </div>
                  <div className="radar-hud-footer">
                    <span className="hud-code">BROADCAST // REACH & ROI</span>
                    <span className="hud-status">AMPLIFICAÇÃO ESCALÁVEL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── NA PRÁTICA: AS 3 PERGUNTAS ─────────────────────────────────────── */}
        <motion.section className="editorial-questions-section" variants={itemVariants}>
          <div className="questions-header">
            <span className="editorial-tag-pill">O CRITÉRIO DE HOMOLOGAÇÃO</span>
            <h2 className="questions-title">
              Todo projeto que sai da CS Ag responde três perguntas:
            </h2>
            <p className="questions-subtitle">
              Se uma criação não souber sustentar todas as três respostas de forma incontestável, ela volta para a prancheta.
            </p>
          </div>

          <div className="questions-interactive-grid">
            {questions.map((q) => (
              <div key={q.num} className="question-interactive-card" onMouseEnter={handleHover}>
                <div className="q-card-top">
                  <span className="q-number-pill">{q.num}</span>
                  <span className="q-category">{q.subtitle}</span>
                </div>
                <h3 className="q-heading">{q.title}</h3>
                <p className="q-answer">{q.answer}</p>
              </div>
            ))}
          </div>

          {/* Golden Seal of Strategy */}
          <div className="strategy-seal-box">
            <div className="seal-emblem">✓</div>
            <div className="seal-text-content">
              <h4>A Regra de Ouro da CS Ag</h4>
              <p>
                Se um projeto não responde com clareza a essas três perguntas, ele simplesmente não está pronto para ir ao ar. Simples assim.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Final CTA Banner */}
        <motion.section className="editorial-final-cta" variants={itemVariants}>
          <div className="cta-backdrop-glow" />
          <div className="cta-content-wrapper">
            <span className="cta-eyebrow">HORA DE APLICAR O MÉTODO</span>
            <h2 className="cta-title">
              Quer aplicar essa metodologia na sua empresa?
            </h2>
            <p className="cta-subtitle">
              Vamos sentar para analisar o seu mercado, escutar os desafios do seu negócio e traçar um plano de amplificação sob medida.
            </p>

            <div className="cta-buttons-group">
              <button className="btn-gold-pill large" onClick={handleContactClick} onMouseEnter={handleHover}>
                <span>Conversar com a Equipe</span>
                <span className="btn-icon-wrapper">→</span>
              </button>

              <button className="btn-ghost-pill" onClick={onBack} onMouseEnter={handleHover}>
                <span>Voltar à Galeria 3D</span>
              </button>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </motion.main>
  );
}
