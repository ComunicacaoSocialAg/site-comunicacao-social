// ─── CS AG HI-FI WEB AUDIO ENGINE ──────────────────────────────────────────────
// Síntese sonora procedural de alta fidelidade sem arquivos pesados.
// Modulação acústica para a Caixa de Som 3D e feedback tátil analógico.

let audioContextInstance = null;

export function getAudioContext() {
  try {
    if (typeof window === 'undefined') return null;
    if (!audioContextInstance) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioContextInstance = new AudioCtx();
      }
    }
    if (audioContextInstance && audioContextInstance.state === 'suspended') {
      audioContextInstance.resume();
    }
    return audioContextInstance;
  } catch (err) {
    return null;
  }
}

// ─── SUB-BASS KICK / EXCURSÃO DE ALTO-FALANTE ─────────────────────────────────
// Simula o impacto físico de um cone subwoofer de estúdio (48Hz -> 20Hz com saturação harmônica)
export function playBassDrop(enabled = true, intensity = 1.0) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // 1. Oscilador Sub-grave senoidal
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(85, now);
    osc.frequency.exponentialRampToValueAtTime(32, now + 0.35);
    osc.frequency.exponentialRampToValueAtTime(18, now + 0.9);

    const targetGain = Math.min(0.85 * intensity, 1.0);
    oscGain.gain.setValueAtTime(0.001, now);
    oscGain.gain.linearRampToValueAtTime(targetGain, now + 0.02);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.95);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 1.0);

    // 2. Transiente de impacto acústico mecânico (Click do cone)
    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    clickOsc.type = 'triangle';
    clickOsc.frequency.setValueAtTime(240, now);
    clickOsc.frequency.exponentialRampToValueAtTime(45, now + 0.04);

    clickGain.gain.setValueAtTime(0.001, now);
    clickGain.gain.linearRampToValueAtTime(0.25 * intensity, now + 0.005);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

    clickOsc.connect(clickGain);
    clickGain.connect(ctx.destination);
    clickOsc.start(now);
    clickOsc.stop(now + 0.07);
  } catch (e) {
    console.warn('Audio Bass Drop:', e);
  }
}

// ─── PULSO RÍTMICO DE SUBWOOFER (BEAT CONTÍNUO) ──────────────────────────────
export function playSubwooferPulse(enabled = true) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(55, now);
    osc.frequency.exponentialRampToValueAtTime(24, now + 0.18);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.24);
  } catch (e) {}
}

// ─── CLICK ANALÓGICO / INTERRUPTOR DE ESTÚDIO ────────────────────────────────
export function playAnalogClick(enabled = true) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.025);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.04, now + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.035);
  } catch (e) {}
}

// ─── SWEEP DE TRANSIÇÃO / ONDA ACÚSTICA ───────────────────────────────────────
export function playResonanceSweep(enabled = true) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.2);
    osc.frequency.exponentialRampToValueAtTime(55, now + 0.45);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.Q.setValueAtTime(4, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.06, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.48);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.5);
  } catch (e) {}
}
