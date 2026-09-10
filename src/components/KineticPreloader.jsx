import { useEffect, useRef, useState } from 'react';
import LogoMorphShader, { LOGO_MATERIALS } from './LogoMorphShader';

/**
 * KineticPreloader
 * Inspirado na premiada sequência de abertura do Phantom.land (Awwwards SOTD).
 * Apresenta:
 * 1. WebGL Logo Perpetual Morph Engine: Interpolação molecular com Simplex Noise,
 *    deslocamento líquido e borda incandescente entre os materiais da marca.
 * 2. Tipografia dividida com kinetic stretch, skew e separação lateral agressiva (cubic-bezier(0.81, -0.01, 0, 1)).
 * 3. Badge dinâmico de identificação da matéria em fusão.
 * 4. Barra de progresso razor-thin na base (0.4vh).
 * 5. Micro-áudio de ruptura ao atingir 100%.
 */
export default function KineticPreloader({ onComplete, soundEnabled, playTransitionSound }) {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentMat, setCurrentMat] = useState(LOGO_MATERIALS[0]);
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const completedRef = useRef(false);

  // 1. Simulação suave e dinâmica de progresso (~3.4s para apreciar os morphs)
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      if (window.__pausePreloader) return;
      // Passo suave entre 0.8% e 1.7% a cada 36ms (~3.2s total)
      const step = 0.85 + Math.random() * 0.95;
      current = Math.min(100, current + step);
      setProgress(current);

      if (current >= 100) {
        clearInterval(interval);
        setIsLoaded(true);

        // Dispara efeito sonoro de liberação/ruptura
        if (playTransitionSound) {
          playTransitionSound(soundEnabled);
        }

        // Aguarda a animação cinética de stretch/skew completar (~950ms)
        setTimeout(() => {
          if (!completedRef.current) {
            completedRef.current = true;
            onComplete();
          }
        }, 950);
      }
    }, 36);

    return () => clearInterval(interval);
  }, [onComplete, soundEnabled, playTransitionSound]);

  // 2. Animação da Singularidade Cósmica Dourada no Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Partículas cósmicas orbitais
    const particles = Array.from({ length: 48 }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: 40 + Math.random() * 110,
      speed: (0.01 + Math.random() * 0.02) * (Math.random() > 0.5 ? 1 : -1),
      size: 1 + Math.random() * 2.2,
      alpha: 0.2 + Math.random() * 0.7,
    }));

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      time += 0.035;

      // Brilho ambiente cósmico sutil atrás do WebGL Logo
      const pulse = 1 + Math.sin(time * 2) * 0.12;
      const glowGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 280 * pulse);
      glowGrad.addColorStop(0, 'rgba(247, 212, 6, 0.12)');
      glowGrad.addColorStop(0.5, 'rgba(247, 212, 6, 0.03)');
      glowGrad.addColorStop(1, 'rgba(7, 7, 8, 0)');

      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 280 * pulse, 0, Math.PI * 2);
      ctx.fill();

      // Anéis de gravidade finos
      ctx.lineWidth = 1;
      for (let r = 1; r <= 3; r++) {
        const ringRadius = (50 + r * 28) * (1 + Math.sin(time + r) * 0.05);
        ctx.strokeStyle = `rgba(247, 212, 6, ${0.15 / r})`;
        ctx.beginPath();
        ctx.ellipse(cx, cy, ringRadius, ringRadius * 0.75, time * 0.2 * (r % 2 === 0 ? 1 : -1), 0, Math.PI * 2);
        ctx.stroke();
      }

      // Partículas em órbita
      for (const p of particles) {
        p.angle += p.speed;
        const px = cx + Math.cos(p.angle) * p.radius * pulse;
        const py = cy + Math.sin(p.angle) * (p.radius * 0.75) * pulse;

        ctx.fillStyle = `rgba(247, 212, 6, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const handleSkip = (e) => {
    e.stopPropagation();
    if (!completedRef.current) {
      completedRef.current = true;
      onComplete();
    }
  };

  return (
    <div className={`kinetic-preloader-root ${isLoaded ? 'is-loaded' : ''}`}>
      {/* WebGL Logo Perpetual Morph Engine (Phantom.land Signature) */}
      <div className="logo-morph-wrapper">
        <LogoMorphShader onMaterialChange={setCurrentMat} />
      </div>

      {/* Canvas com Partículas Orbitais Cósmicas Sutis de Fundo */}
      <canvas ref={canvasRef} className="kinetic-core-canvas" />

      {/* Tipografia Esculpida com Stretch & Split Skew (Phantom.land CSS keyframes) */}
      <div className={`loader-text-wrapper ${isLoaded ? 'is-loaded' : ''}`}>
        <h2 className="loader-chunk-left">
          <span>COMUNICAÇÃO SOCIAL AG</span>
        </h2>
        <h2 className="loader-chunk-right">
          <span>AGÊNCIA CRIATIVA ESTRATÉGICA</span>
        </h2>
      </div>

      {/* Badge Dinâmico da Matéria Ativa do Logotipo */}
      <div className="kinetic-material-badge">
        <span className="kinetic-badge-dot" />
        <span>MATÉRIA • {currentMat.label}</span>
      </div>

      {/* Botão sutil para pular intro se o usuário desejar */}
      <button className="kinetic-skip-btn" onClick={handleSkip}>
        <span>Pular Intro</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      </button>

      {/* Indicador de porcentagem numérico sutil */}
      <div className="kinetic-percent-display">
        <span>{Math.round(progress)}%</span>
      </div>

      {/* Barra de Progresso Razor-Thin (0.4vh) em Ouro */}
      <div
        className="loader-progress-bar"
        style={{ transform: `scaleX(${progress / 100})` }}
      />
    </div>
  );
}
