import React, { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';

// ─── 21 MARCOS HISTÓRICOS DA EVOLUÇÃO DA COMUNICAÇÃO HUMANA ──────────────────
// Com coordenadas travadas no centro, contando uma narrativa contínua da Pré-História ao Futuro.
// A imagem 02_ouro_derretido_obsidiana.jpg é estritamente o último slide (clímax/singularidade).
export const MATCH_CUT_FRAMES = [
  {
    id: 'rupestre',
    src: '/assets/brand/matchcut/01_rupestre.jpg',
    tag: '01 • ORIGEM ANCESTRAL',
    era: 'PRÉ-HISTÓRIA (~30.000 A.C.)',
    principle: 'O PRIMEIRO REGISTRO: O IMPULSO ANCESTRAL DE ETERNIZAR O SIGNIFICADO',
    accent: '#d97736',
  },
  {
    id: 'papiro',
    src: '/assets/brand/matchcut/02_papiro.jpg',
    tag: '02 • CODIFICAÇÃO & MEMÓRIA',
    era: 'EGITO ANTIGO (~3.000 A.C.)',
    principle: 'A ESCRITA ESTRUTURADA: TRANSFORMAR VISÃO EM CÓDIGO PERMANENTE',
    accent: '#e2b86b',
  },
  {
    id: 'mosaico',
    src: '/assets/brand/matchcut/03_mosaico_bizantino.jpg',
    tag: '03 • ICONOGRAFIA SACRA',
    era: 'IMPÉRIO BIZANTINO (SÉC. VI)',
    principle: 'A TRANSCENDÊNCIA DO SÍMBOLO: COMUNICAR O INTANGÍVEL E O SUBLIME',
    accent: '#d4af37',
  },
  {
    id: 'gutenberg',
    src: '/assets/brand/matchcut/04_gutenberg.jpg',
    tag: '04 • ESCALA & DISSEMINAÇÃO',
    era: 'PRENSA DE GUTENBERG (1440)',
    principle: 'A DEMOCRATIZAÇÃO DA IDEIA: A PALAVRA IMPRESSA COMO MOTOR DE REVOLUÇÃO',
    accent: '#c29b63',
  },
  {
    id: 'barroco',
    src: '/assets/brand/matchcut/05_barroco.jpg',
    tag: '05 • NARRATIVA & CONTRASTE',
    era: 'BARROCO CARAVAGGIANO (1600)',
    principle: 'O IMPACTO DO CHIAROSCURO: O DRAMA HUMANO QUE DESPERTA A EMOÇÃO',
    accent: '#e65100',
  },
  {
    id: 'sumie',
    src: '/assets/brand/matchcut/06_sumie.jpg',
    tag: '06 • ELEGÂNCIA & SÍNTESE',
    era: 'ORIENTE CLÁSSICO & NANQUIM',
    principle: 'A SÍNTESE DO VAZIO: MENOS ELEMENTOS, MAIOR PROFUNDIDADE DE SENTIDO',
    accent: '#e0a96d',
  },
  {
    id: 'taisho',
    src: '/assets/brand/matchcut/07_taisho.jpg',
    tag: '07 • PLURALIDADE CULTURAL',
    era: 'PÔSTER TAISHO JAPÃO (1920)',
    principle: 'O ENCONTRO DE MUNDOS: A FUSÃO DE TRADIÇÃO E VANGUARDA GERA O INÉDITO',
    accent: '#e76f51',
  },
  {
    id: 'radio',
    src: '/assets/brand/matchcut/08_radio.jpg',
    tag: '08 • ALCANCE & RESSONÂNCIA',
    era: 'ERA DO RÁDIO VALVULADO (1930)',
    principle: 'A VOZ SEM DISTÂNCIAS: CONECTAR MILHÕES NA MESMA FREQUÊNCIA COLETIVA',
    accent: '#e07a5f',
  },
  {
    id: 'rubber_hose',
    src: '/assets/brand/matchcut/09_rubber_hose.jpg',
    tag: '09 • LINGUAGEM LÚDICA',
    era: 'ANIMAÇÃO RUBBER HOSE (1930)',
    principle: 'A ILUSÃO DA VIDA: DAR ALMA, AFETO E RITMO AO QUE ERA ESTÁTICO',
    accent: '#f4a261',
  },
  {
    id: 'favo_cafe',
    src: '/assets/brand/matchcut/10_favo_cafe.jpg',
    tag: '10 • ESTÍMULO SENSORIAL',
    era: 'TERROIR & ALQUIMIA ORGÂNICA',
    principle: 'A EXPERIÊNCIA DOS SENTIDOS: COMUNICAÇÃO QUE SE SENTE, PROVA E MEMORIZA',
    accent: '#f59e0b',
  },
  {
    id: 'comic_pop',
    src: '/assets/brand/matchcut/11_comic_pop.jpg',
    tag: '11 • CULTURA COLETIVA',
    era: 'COMIC ART & BEN-DAY (1960)',
    principle: 'A POTÊNCIA DO POPULAR: ELEVAR O COTIDIANO A NARRATIVAS HERÓICAS',
    accent: '#ef4444',
  },
  {
    id: 'warhol',
    src: '/assets/brand/matchcut/12_warhol.jpg',
    tag: '12 • O PODER DO ÍCONE',
    era: 'POP ART WARHOL (1962)',
    principle: 'A MEMORABILIDADE DO SIGNO: REPETIÇÃO INTENCIONAL QUE CRIA O ÍCONE',
    accent: '#06d6a0',
  },
  {
    id: 'claymation',
    src: '/assets/brand/matchcut/13_claymation.jpg',
    tag: '13 • MATÉRIA & HUMANIDADE',
    era: 'STOP-MOTION & PLASTICINA',
    principle: 'O TOQUE ARTESANAL: ESCULPIR CADA MILÍMETRO COM HUMOR E HUMANIDADE',
    accent: '#ffb703',
  },
  {
    id: 'brutalismo',
    src: '/assets/brand/matchcut/14_brutalismo.jpg',
    tag: '14 • RIGOR TIPOGRÁFICO',
    era: 'BRUTALISMO GRÁFICO SUÍÇO',
    principle: 'A FORÇA DA ESTRUTURA: VERDADE VISUAL RADICAL SEM ADORNOS INÚTEIS',
    accent: '#e63946',
  },
  {
    id: 'patch_jeans',
    src: '/assets/brand/matchcut/15_patch_jeans.jpg',
    tag: '15 • PERTENCIMENTO & MODA',
    era: 'STREETWEAR & TEXTIL BORDADO',
    principle: 'A IDENTIDADE COMO BANDEIRA: O DESIGN QUE AS PESSOAS QUEREM VESTIR',
    accent: '#3b82f6',
  },
  {
    id: 'cassete_som',
    src: '/assets/brand/matchcut/16_cassete_som.jpg',
    tag: '16 • FREQUÊNCIA & SINTONIA',
    era: 'FITA CASSETE & ENGENHARIA DE ÁUDIO',
    principle: 'A CADÊNCIA DA MENSAGEM: O TIMBRE EXATO QUE ENTRA EM HARMONIA COM O PÚBLICO',
    accent: '#ec4899',
  },
  {
    id: 'satelite',
    src: '/assets/brand/matchcut/17_satelite.jpg',
    tag: '17 • VISÃO PANORÂMICA',
    era: 'EXPLORAÇÃO ESPACIAL & ÓRBITA',
    principle: 'A PERSPECTIVA GLOBAL: ENXERGAR O TODO PARA ANTECIPAR O FUTURO',
    accent: '#6366f1',
  },
  {
    id: 'circuito',
    src: '/assets/brand/matchcut/18_circuito.jpg',
    tag: '18 • MATRIZ DIGITAL',
    era: 'CIRCUITO CIBERNÉTICO & HARDWARE',
    principle: 'A ARQUITETURA DE DADOS: A INTELIGÊNCIA QUE AMPLIFICA A CRIATIVIDADE',
    accent: '#00b4d8',
  },
  {
    id: 'fluid_acrylic',
    src: '/assets/brand/matchcut/19_fluid_acrylic.jpg',
    tag: '19 • FLUIDEZ & ADAPTAÇÃO',
    era: 'ARTE FLUIDA CONTEMPORÂNEA',
    principle: 'A FLUIDEZ VITAL: CAPACIDADE DE ADAPTAÇÃO CONTÍNUA EM CENÁRIOS VOLÁTEIS',
    accent: '#8b5cf6',
  },
  {
    id: 'cyberpunk',
    src: '/assets/brand/matchcut/20_cyberpunk.jpg',
    tag: '20 • CONEXÃO EM TEMPO REAL',
    era: 'CYBERPUNK & REDES NEURAIS',
    principle: 'A VANGUARDA DO FUTURO: RELEVÂNCIA IMEDIATA EM UM MUNDO HIPERCONECTADO',
    accent: '#f72585',
  },
  {
    id: 'ouro_obsidiana',
    src: '/assets/brand/matchcut/21_ouro_obsidiana.jpg',
    tag: '21 • SINGULARIDADE PERENE',
    era: 'OURO DERRETIDO & OBSIDIANA',
    principle: 'O VALOR PERMANENTE DA IDEIA: ESTRATÉGIAS SÓLIDAS QUE ATRAVESSAM GERAÇÕES',
    accent: '#f7d406',
  },
];

// ─── SEQUÊNCIA DE RITMO & ACELERAÇÃO PROGRESSIVA (21 MARCOS ÚNICOS) ───────────
// 420ms (contemplação) -> 360ms -> 270ms -> 150ms -> 60ms -> 28ms -> 280ms (trava no ouro)
const RHYTHMIC_SEQUENCE = [
  { frameIdx: 0, delay: 420 },  // 01. Rupestre
  { frameIdx: 1, delay: 360 },  // 02. Papiro
  { frameIdx: 2, delay: 310 },  // 03. Mosaico Bizantino
  { frameIdx: 3, delay: 270 },  // 04. Gutenberg
  { frameIdx: 4, delay: 235 },  // 05. Barroco
  { frameIdx: 5, delay: 205 },  // 06. Sumi-ê
  { frameIdx: 6, delay: 175 },  // 07. Taisho
  { frameIdx: 7, delay: 150 },  // 08. Rádio
  { frameIdx: 8, delay: 130 },  // 09. Rubber Hose
  { frameIdx: 9, delay: 110 },  // 10. Favo de Mel & Café
  { frameIdx: 10, delay: 95 },  // 11. Comic Pop
  { frameIdx: 11, delay: 80 },  // 12. Warhol
  { frameIdx: 12, delay: 68 },  // 13. Claymation
  { frameIdx: 13, delay: 58 },  // 14. Brutalismo
  { frameIdx: 14, delay: 50 },  // 15. Patch Jeans
  { frameIdx: 15, delay: 44 },  // 16. Fita Cassete
  { frameIdx: 16, delay: 38 },  // 17. Satélite
  { frameIdx: 17, delay: 34 },  // 18. Circuito Cibernético
  { frameIdx: 18, delay: 30 },  // 19. Fluid Acrylic
  { frameIdx: 19, delay: 28 },  // 20. Cyberpunk Neon
  { frameIdx: 20, delay: 280 }, // 21. Ouro Derretido & Obsidiana (Trava rígida e clímax antes da grande ruptura!)
];

// ─── AUDIO SYNTHESIZER (WEB AUDIO API) ────────────────────────────────────────
let matchCutAudioCtx = null;
function getMatchAudioCtx() {
  try {
    if (!matchCutAudioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) matchCutAudioCtx = new AudioCtx();
    }
    if (matchCutAudioCtx && matchCutAudioCtx.state === 'suspended') {
      matchCutAudioCtx.resume();
    }
    return matchCutAudioCtx;
  } catch (e) {
    return null;
  }
}

function playCutTickSound(stepIndex, totalSteps, enabled = true) {
  if (!enabled) return;
  try {
    const ctx = getMatchAudioCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Rampa tonal: 220Hz até 1500Hz
    const progressRatio = stepIndex / totalSteps;
    const baseFreq = 220 + Math.pow(progressRatio, 1.7) * 1280;

    osc.type = stepIndex > 13 ? 'sawtooth' : 'triangle';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.75, now + 0.035);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.06 + progressRatio * 0.06, now + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.038);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.042);
  } catch (e) {}
}

function playClimaxSnapSound(enabled = true) {
  if (!enabled) return;
  try {
    const ctx = getMatchAudioCtx();
    if (!ctx) return;
    const now = ctx.currentTime;

    // 1. Sub-bass Boom (105Hz -> 18Hz)
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(105, now);
    subOsc.frequency.exponentialRampToValueAtTime(18, now + 1.8);

    subGain.gain.setValueAtTime(0.001, now);
    subGain.gain.linearRampToValueAtTime(0.9, now + 0.02);
    subGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);

    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 2.1);

    // 2. High Shimmer Detonation (2200Hz -> 3600Hz)
    const shimmerOsc = ctx.createOscillator();
    const shimmerGain = ctx.createGain();
    shimmerOsc.type = 'sine';
    shimmerOsc.frequency.setValueAtTime(2200, now);
    shimmerOsc.frequency.exponentialRampToValueAtTime(3600, now + 0.35);

    shimmerGain.gain.setValueAtTime(0.001, now);
    shimmerGain.gain.linearRampToValueAtTime(0.22, now + 0.02);
    shimmerGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

    shimmerOsc.connect(shimmerGain);
    shimmerGain.connect(ctx.destination);
    shimmerOsc.start(now);
    shimmerOsc.stop(now + 0.65);
  } catch (e) {}
}

export default function MatchCutIntro({ onComplete, soundEnabled = true, onToggleSound }) {
  const [activeFrameIdx, setActiveFrameIdx] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isClimax, setIsClimax] = useState(false);
  const [currentSpeedBpm, setCurrentSpeedBpm] = useState(142);

  const containerRef = useRef(null);
  const frameWrapRef = useRef(null);
  const flashRef = useRef(null);
  const isFinishedRef = useRef(false);

  const activeMaterial = MATCH_CUT_FRAMES[activeFrameIdx] || MATCH_CUT_FRAMES[0];

  // 1. Preload de todas as 21 imagens com zero lag
  useEffect(() => {
    let mounted = true;
    const preloadPromises = MATCH_CUT_FRAMES.map((mat) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = mat.src;
        if (img.complete) {
          if (img.decode) {
            img.decode().then(resolve).catch(resolve);
          } else {
            resolve();
          }
        } else {
          img.onload = () => {
            if (img.decode) {
              img.decode().then(resolve).catch(resolve);
            } else {
              resolve();
            }
          };
          img.onerror = resolve;
        }
      });
    });

    Promise.all(preloadPromises).then(() => {
      if (mounted) {
        setIsReady(true);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  // 2. Ruptura de Clímax e Handover para o Big Bang
  const triggerClimaxAndFinish = useCallback(() => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;
    setIsClimax(true);

    playClimaxSnapSound(soundEnabled);

    const wrap = frameWrapRef.current;
    const flash = flashRef.current;

    const tl = gsap.timeline({
      onComplete: () => {
        if (onComplete) onComplete();
      },
    });

    if (wrap) {
      tl.to(wrap, {
        scale: 1.65,
        filter: 'brightness(3.0) contrast(1.3) blur(3px)',
        duration: 0.38,
        ease: 'power3.in',
      });
    }

    if (flash) {
      tl.to(
        flash,
        {
          opacity: 1,
          duration: 0.24,
          ease: 'power2.in',
        },
        '-=0.2'
      );
    }
  }, [onComplete, soundEnabled]);

  // 3. Execução da Sequência Rítmica Acelerada
  useEffect(() => {
    window.__setMatchCutFrame = (idx) => {
      setActiveFrameIdx(idx);
      setStepIndex(idx);
    };

    if (!isReady || isFinishedRef.current) return;

    let timeoutId = null;

    const executeStep = (curStep) => {
      if (window.__pauseMatchCut) return;

      if (curStep >= RHYTHMIC_SEQUENCE.length) {
        triggerClimaxAndFinish();
        return;
      }

      const seq = RHYTHMIC_SEQUENCE[curStep];
      setActiveFrameIdx(seq.frameIdx);
      setStepIndex(curStep);

      // Velocidade calculada em BPM
      setCurrentSpeedBpm(Math.round((60 * 1000) / seq.delay));

      // Som tátil sincronizado
      playCutTickSound(curStep, RHYTHMIC_SEQUENCE.length, soundEnabled);

      // Micro-impacto cinético
      if (frameWrapRef.current) {
        gsap.fromTo(
          frameWrapRef.current,
          { scale: 1.012 },
          { scale: 1.0, duration: Math.min(0.07, seq.delay / 1000), ease: 'power1.out' }
        );
      }

      timeoutId = setTimeout(() => {
        executeStep(curStep + 1);
      }, seq.delay);
    };

    // Respiração inicial de 200ms para contemplar a entrada
    timeoutId = setTimeout(() => {
      executeStep(0);
    }, 200);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isReady, triggerClimaxAndFinish, soundEnabled]);

  // Atalhos de Teclado (ESC ou Espaço para Pular)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === ' ') {
        triggerClimaxAndFinish();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerClimaxAndFinish]);

  return (
    <div className="matchcut-root" ref={containerRef}>
      {/* Flash Overlay de Clímax */}
      <div className="matchcut-flash" ref={flashRef} />

      {/* Grid de Partículas Cósmicas / Background */}
      <div className="matchcut-ambient-bg" />

      {/* HUD SUPERIOR */}
      <header className="matchcut-top-bar">
        <div className="matchcut-brand-label">
          <span className="matchcut-badge-symbol">CS Ag®</span>
          <span className="matchcut-badge-divider">/</span>
          <span className="matchcut-badge-title">EVOLUÇÃO DA COMUNICAÇÃO</span>
        </div>

        <div className="matchcut-top-actions">
          {onToggleSound && (
            <button
              className={`matchcut-action-btn ${soundEnabled ? 'is-active' : ''}`}
              onClick={onToggleSound}
              title={soundEnabled ? 'Mudo' : 'Ativar Áudio'}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {soundEnabled ? (
                  <>
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </>
                ) : (
                  <>
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </>
                )}
              </svg>
              <span>{soundEnabled ? 'SOM ATIVO' : 'MUDO'}</span>
            </button>
          )}

          <button className="matchcut-skip-btn" onClick={triggerClimaxAndFinish}>
            <span>PULAR</span>
            <span className="matchcut-key-tag">ESC</span>
          </button>
        </div>
      </header>

      {/* ESTÁGIO CENTRAL DO LOGO */}
      <div className="matchcut-stage">
        {/* NOME DA AGÊNCIA E SLOGAN NO INÍCIO COM AS FONTES OFICIAIS */}
        <div className="matchcut-hero-brand">
          <div className="matchcut-brand-lockup">
            <span className="brand-word-comunicacao">comunicação</span>
            <span className="brand-word-social">social</span>
            <span className="brand-word-ag">Ag</span>
          </div>
          <div className="matchcut-brand-slogan">
            <span className="slogan-line left" />
            <span className="slogan-text">comunicação estratégica</span>
            <span className="slogan-line right" />
          </div>
        </div>

        {/* CONTAINER DO LOGO (55% a 60% DA VIEWPORT COM COORDENADAS TRAVADAS) */}
        <div
          ref={frameWrapRef}
          className={`matchcut-viewport-frame ${isClimax ? 'is-climax' : ''}`}
          style={{ '--mat-accent': activeMaterial.accent }}
        >
          {/* Marcadores de Mira / Brackets nos 4 cantos */}
          <span className="frame-corner top-left" />
          <span className="frame-corner top-right" />
          <span className="frame-corner bottom-left" />
          <span className="frame-corner bottom-right" />

          {/* 21 Camadas de Imagens Pré-carregadas para Troca Instantânea a 60fps */}
          {MATCH_CUT_FRAMES.map((frame, idx) => (
            <img
              key={frame.id}
              src={frame.src}
              alt={frame.principle}
              className="matchcut-texture-layer"
              style={{
                opacity: idx === activeFrameIdx ? 1 : 0,
                zIndex: idx === activeFrameIdx ? 2 : 1,
              }}
              draggable={false}
            />
          ))}

          {/* Linha de Varredura Sutil */}
          <div className="matchcut-scanline" />

          {/* Vignette Interna */}
          <div className="matchcut-inner-vignette" />
        </div>

        {/* METADADOS & PRINCÍPIOS FUNDAMENTAIS DA COMUNICAÇÃO */}
        <div className="matchcut-meta-bar">
          <div className="matchcut-meta-left">
            <div className="matchcut-meta-tag">
              <span className="matchcut-live-dot" style={{ backgroundColor: activeMaterial.accent }} />
              <span className="matchcut-meta-code">{activeMaterial.tag}</span>
            </div>
            <span className="matchcut-meta-era">{activeMaterial.era}</span>
          </div>

          <div className="matchcut-principle-wrap">
            <h2 className="matchcut-principle-text" style={{ '--accent': activeMaterial.accent }}>
              {activeMaterial.principle}
            </h2>
          </div>

          <div className="matchcut-telemetry">
            <div className="matchcut-telemetry-item">
              <span className="telemetry-lbl">CADÊNCIA</span>
              <span className="telemetry-val">{currentSpeedBpm} BPM</span>
            </div>
            <div className="matchcut-telemetry-sep">/</div>
            <div className="matchcut-telemetry-item">
              <span className="telemetry-lbl">MARCO</span>
              <span className="telemetry-val">
                {String(stepIndex + 1).padStart(2, '0')}/{String(RHYTHMIC_SEQUENCE.length).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* BARRA DE PROGRESSO RAZOR-THIN NA BASE */}
      <div className="matchcut-bottom-meter">
        <div
          className="matchcut-meter-fill"
          style={{
            width: `${((stepIndex + 1) / RHYTHMIC_SEQUENCE.length) * 100}%`,
            backgroundColor: activeMaterial.accent,
            boxShadow: `0 0 14px ${activeMaterial.accent}`,
          }}
        />
      </div>
    </div>
  );
}
