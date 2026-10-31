import { Suspense, useEffect, useRef, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LogoSpeakerScene } from './LogoSpeakerScene';
import { playClickSound, playHoverSound } from '../../utils/audio';
import { playBassDrop } from '../../utils/speakerAudio';
import { AGENCY_CONFIG } from '../../data/agency';
import { SPEAKER_IMAGE } from '../../data/brandIntro';
import './home3d.css';

const TRIAD_STEPS = [
  {
    num: '01',
    title: 'Escutar',
    subtitle: 'Diagnóstico e inteligência antes de qualquer briefing.',
    desc: 'Lemos o mercado, os concorrentes, os números e o que o público-alvo diz quando ninguém está perguntando. Sem escuta profunda, uma marca apenas faz barulho.',
  },
  {
    num: '02',
    title: 'Traduzir',
    subtitle: 'Linguagem proprietária e diferenciação radical.',
    desc: 'Transformamos contexto em identidade visual, verbal e conceitual de alto impacto. Criamos marcas que pertencem exclusivamente ao seu território.',
  },
  {
    num: '03',
    title: 'Amplificar',
    subtitle: 'Engenharia de canais, mídia e tecnologia.',
    desc: 'Distribuímos a mensagem com consistência e frequência estratégica: tráfego pago, plataformas web interativas e inteligência de conversão.',
  },
];

const FEATURED_CASES = [
  {
    id: 'livia-esper-site',
    category: 'Web 3D & Saúde Pediátrica',
    title: 'Dra. Lívia Esper: Reino da Boca',
    metric: '+140% em agendamentos particulares',
    tag: 'Experiência Imersiva',
  },
  {
    id: 'iluminismo',
    category: 'Estratégia & BI',
    title: 'O Iluminismo: Clareza de Dados',
    metric: '2.8M impressões e +42% de conversão',
    tag: 'Campanha Analítica',
  },
  {
    id: 'rupestre',
    category: 'Branding & Identidade',
    title: 'Arte Rupestre: Origens SA',
    metric: '+180% em percepção e 12 prêmios',
    tag: 'Identidade Visual',
  },
  {
    id: 'livia-esper-sistema',
    category: 'Design de Produto & SaaS',
    title: 'ERP Clínico Integrado',
    metric: '100% sem papel e -50% faltas',
    tag: 'Software Proprietário',
  },
];

export function Home3D({
  onContactClick,
  onProjectSelect,
  onAgencyClick,
  onApproachClick,
  soundEnabled = true,
}) {
  const root = useRef(null);
  const progress = useRef({ scroll: 0, reducedMotion: false });
  const [reducedMotion, setReducedMotion] = useState(false);
  const [activeTriad, setActiveTriad] = useState(0);
  const [heroVisible, setHeroVisible] = useState(true);

  useEffect(() => {
    const hero = root.current?.querySelector('#hero');
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting), {
      root: root.current.closest('.scroll-container'),
    });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    progress.current.reducedMotion = reducedMotion;
    if (reducedMotion || !root.current) return;

    gsap.registerPlugin(ScrollTrigger);
    const scroller = root.current.closest('.scroll-container') || undefined;
    const context = gsap.context(() => {
      ScrollTrigger.create({
        trigger: root.current,
        scroller: scroller,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.35,
        onUpdate: (self) => {
          progress.current.scroll = self.progress;
        },
      });

      gsap.utils.toArray('.home3d__section:not(#hero) .home3d__copy').forEach((copy) => {
        gsap.fromTo(
          copy,
          { autoAlpha: 0, y: 36 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: copy,
              scroller: scroller,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, root);

    return () => context.revert();
  }, [reducedMotion]);

  const handleTriadClick = useCallback((index) => {
    setActiveTriad(index);
    playClickSound(soundEnabled);
    playBassDrop(soundEnabled, 0.7 + index * 0.35);
  }, [soundEnabled]);

  const handleCtaClick = (e) => {
    if (onContactClick) {
      e.preventDefault();
      playClickSound(soundEnabled);
      onContactClick();
    }
  };

  const handleCaseClick = (caseId, e) => {
    if (onProjectSelect) {
      e.preventDefault();
      playClickSound(soundEnabled);
      onProjectSelect(caseId);
    }
  };

  return (
    <main ref={root} className={`home3d ${reducedMotion ? 'is-reduced-motion' : ''}`} data-hero-visible={heroVisible}>
      {!reducedMotion && (
        <div className="home3d__canvas" aria-hidden="true">
          <Canvas
            dpr={[1, 1.5]}
            camera={{ fov: 32, position: [0, 0, 3.2] }}
            gl={{ antialias: true, powerPreference: 'high-performance' }}
            onCreated={({ gl }) => gl.setClearColor('#070709', 1)}
          >
            <Suspense fallback={null}>
              <LogoSpeakerScene progress={progress} soundEnabled={soundEnabled} />
            </Suspense>
          </Canvas>
        </div>
      )}

      {/* ── SEÇÃO 01: HERO MONUMENTAL ──────────────────────────────────────── */}
      <section id="hero" className="home3d__section home3d__section--hero" data-align="left" data-section="0">
        <div className="home3d__copy">
          <h1 tabIndex={-1}>Somos a amplificação da sua voz.</h1>

          <p className="home3d__lead">
            Comunicação estratégica, branding proprietário e engenharia digital para marcas que precisam ser ouvidas com clareza, autoridade e liderança.
          </p>

          <div className="btn-group">
            <a
              className="btn-nested-cta"
              href="#contato"
              onClick={handleCtaClick}
            >
              <span>Começar uma conversa</span>
              <span className="btn-nested-cta__icon" aria-hidden="true">↗</span>
            </a>

            {onAgencyClick && (
              <button
                className="btn-nested-cta btn-nested-cta--secondary"
                onClick={() => {
                  playClickSound(soundEnabled);
                  onAgencyClick();
                }}
              >
                <span>Conhecer a Agência</span>
                <span className="btn-nested-cta__icon" aria-hidden="true">→</span>
              </button>
            )}
          </div>
        </div>
        <div className="home3d__speaker-bridge">
          <img data-intro-speaker src={SPEAKER_IMAGE} alt="Os dois balões da Comunicação Social Ag transformados em caixas de som amarelas e pretas." width="1200" height="628" fetchPriority="high" decoding="async" />
        </div>
      </section>

      {/* ── SEÇÃO 02: MANIFESTO & MÉTRICAS (A AGÊNCIA) ──────────────────────── */}
      <section className="home3d__section" data-align="right" data-section="1">
        <div className="home3d__copy">
          <div className="home3d__tag">
            <span className="home3d__tag-dot" />
            <span>02 // Quem Somos // Visão e Provas</span>
          </div>

          <h2>O ruído aparece. A causa nem sempre.</h2>

          <p className="home3d__body">
            Lemos o seu negócio como um sistema vivo. Antes de criar qualquer campanha ou escrever uma única linha de código, diagnosticamos com rigor onde a comunicação precisa agir para gerar preferência real de compra e relevância cultural.
          </p>

          <div className="home3d__metrics-grid">
            <div className="metric-card-shell">
              <div className="metric-card-core">
                <div className="metric-card__val">+400%</div>
                <div className="metric-card__lbl">Crescimento médio em campanhas ativas</div>
              </div>
            </div>

            <div className="metric-card-shell">
              <div className="metric-card-core">
                <div className="metric-card__val">80+</div>
                <div className="metric-card__lbl">Marcas transformadas no Brasil</div>
              </div>
            </div>

            <div className="metric-card-shell">
              <div className="metric-card-core">
                <div className="metric-card__val">5 Anos</div>
                <div className="metric-card__lbl">De método e consistência estratégica</div>
              </div>
            </div>

            <div className="metric-card-shell">
              <div className="metric-card-core">
                <div className="metric-card__val">Boutique</div>
                <div className="metric-card__lbl">Operação direta com Bruno Garcia, sem terceirizações</div>
              </div>
            </div>
          </div>

          {onAgencyClick && (
            <button
              className="btn-nested-cta btn-nested-cta--secondary"
              onClick={() => {
                playClickSound(soundEnabled);
                onAgencyClick();
              }}
            >
              <span>Ler Manifesto Completo</span>
              <span className="btn-nested-cta__icon" aria-hidden="true">↗</span>
            </button>
          )}
        </div>
      </section>

      {/* ── SEÇÃO 03: A TRÍADE ACÚSTICA (MÉTODO) ───────────────────────────── */}
      <section className="home3d__section" data-align="left" data-section="2">
        <div className="home3d__copy">
          <div className="home3d__tag">
            <span className="home3d__tag-dot" />
            <span>03 // Método Proprietário // 3 Fases</span>
          </div>

          <h2>Comunicação não é volume: é ressonância.</h2>

          <p className="home3d__body">
            Gritar mais alto apenas cansa o público. Nosso método opera em três movimentos disciplinados que transformam atenção em preferência consistente:
          </p>

          <div className="triad-list">
            {TRIAD_STEPS.map((step, idx) => (
              <div
                key={step.num}
                className={`triad-item ${activeTriad === idx ? 'active' : ''}`}
                onClick={() => handleTriadClick(idx)}
                onMouseEnter={() => playHoverSound(soundEnabled)}
              >
                <span className="triad-item__num">{step.num}</span>
                <div>
                  <div className="triad-item__title">{step.title}</div>
                  <div className="triad-item__desc">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {onApproachClick && (
            <button
              className="btn-nested-cta btn-nested-cta--secondary"
              onClick={() => {
                playClickSound(soundEnabled);
                onApproachClick();
              }}
            >
              <span>Explorar a Metodologia em Detalhes</span>
              <span className="btn-nested-cta__icon" aria-hidden="true">↗</span>
            </button>
          )}
        </div>
      </section>

      {/* ── SEÇÃO 04: CASES SELECIONADOS ────────────────────────────────────── */}
      <section className="home3d__section" data-align="right" data-section="3">
        <div className="home3d__copy">
          <div className="home3d__tag">
            <span className="home3d__tag-dot" />
            <span>04 // Portfólio // Cases em Destaque</span>
          </div>

          <h2>Resultados construídos com direção.</h2>

          <p className="home3d__body">
            Projetos reais onde unimos posicionamento, identidade de alto valor e plataformas digitais para entregar números comprovados:
          </p>

          <div className="cases-showcase-grid">
            {FEATURED_CASES.map((item) => (
              <a
                key={item.id}
                href={`/trabalhos/${item.id}`}
                className="case-card-shell"
                onClick={(e) => handleCaseClick(item.id, e)}
                onMouseEnter={() => playHoverSound(soundEnabled)}
              >
                <div className="case-card-core">
                  <div>
                    <div className="case-card__tag">{item.category}</div>
                    <div className="case-card__title">{item.title}</div>
                  </div>
                  <div className="case-card__metric">{item.metric}</div>
                </div>
              </a>
            ))}
          </div>

          <a
            href="/trabalhos"
            className="btn-nested-cta btn-nested-cta--secondary"
            onClick={(e) => {
              if (onProjectSelect) {
                e.preventDefault();
                playClickSound(soundEnabled);
                onProjectSelect(null);
              }
            }}
          >
            <span>Ver Todos os Trabalhos</span>
            <span className="btn-nested-cta__icon" aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      {/* ── SEÇÃO 05: DIÁLOGO EXECUTIVO (CONTATO) ─────────────────────────── */}
      <section className="home3d__section" data-align="center" data-section="4">
        <div className="home3d__copy">
          <div className="home3d__tag">
            <span className="home3d__tag-dot" />
            <span>05 // Diálogo Direto // Próximo Passo</span>
          </div>

          <h2>Sua marca está pronta para ser escolhida?</h2>

          <p className="home3d__lead" style={{ margin: '0 auto 2.5rem' }}>
            Vamos desenhar juntos o próximo ciclo de relevância da sua empresa. Atendimento direto e estratégico sem intermediários.
          </p>

          <div className="btn-group" style={{ justifyContent: 'center' }}>
            <a
              className="btn-nested-cta"
              href={AGENCY_CONFIG.getWhatsAppUrl('Olá! Gostaria de conversar com o Bruno Garcia sobre um projeto para a minha marca.')}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playClickSound(soundEnabled)}
            >
              <span>Conversar pelo WhatsApp Oficial</span>
              <span className="btn-nested-cta__icon" aria-hidden="true">↗</span>
            </a>

            <a
              className="btn-nested-cta btn-nested-cta--secondary"
              href="mailto:contato@comunicacaosocialag.com.br"
              onClick={() => playClickSound(soundEnabled)}
            >
              <span>Enviar E-mail Comercial</span>
              <span className="btn-nested-cta__icon" aria-hidden="true">✉</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home3D;
