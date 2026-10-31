import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { INTRO_MATERIALS } from '../data/brandIntro';
import './brand-intro.css';

export default function BrandIntro({ onComplete }) {
  const rootRef = useRef(null);
  const finishRef = useRef(null);
  const skipRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let timeline;
    let deadline;
    let cancelled = false;
    let finished = false;
    let started = false;
    const finish = (reason = 'complete') => {
      if (cancelled || finished) return;
      finished = true;
      clearTimeout(deadline);
      timeline?.kill();
      onComplete(reason);
    };
    finishRef.current = finish;
    const layers = [...root.querySelectorAll('.brand-intro__material')];
    const images = layers.map((layer) => layer.querySelector('picture img'));
    const readyImages = new Set();

    const start = () => {
      if (cancelled || finished || started) return;
      started = true;
      clearTimeout(deadline);
      const available = layers.filter((layer, index) => readyImages.has(images[index]));
      if (!available.length) { finish(); return; }
      root.dataset.phase = 'materials';
      timeline = gsap.timeline({ onComplete: () => finish() });
      let at = 0.12;
      let previous;
      layers.forEach((layer, index) => {
        if (!readyImages.has(images[index])) return;
        if (previous) timeline.set(previous, { opacity: 0 }, at);
        timeline.set(layer, { opacity: 1 }, at);
        previous = layer;
        at += INTRO_MATERIALS[index].duration;
      });
      // Nada muda na câmera nem no objeto durante a passagem. A película
      // se dissolve e revela o mesmo 3D que continuará na primeira tela.
      timeline.call(() => { root.dataset.phase = 'handoff'; }, null, at);
      timeline.to(root.querySelector('.brand-intro__photos'), { opacity: 0, duration: 0.95, ease: 'power2.inOut' }, at);
      timeline.to(root.querySelector('.brand-intro__backdrop'), { opacity: 0, duration: 0.95, ease: 'power2.inOut' }, at);
      timeline.to(root.querySelectorAll('.brand-intro__chrome'), { opacity: 0, duration: 0.3 }, at + 0.5);
      timeline.to({}, { duration: 0.3 });
    };
    if (media.matches) finish('reduced-motion');
    else {
      deadline = setTimeout(start, 2200);
      Promise.allSettled(images.map(async (image) => {
        try { await image.decode(); if (!cancelled) readyImages.add(image); } catch { /* Uma imagem indisponível não bloqueia a navegação. */ }
      })).then(start);
    }
    const onMotionChange = (event) => { if (event.matches) finish('reduced-motion'); };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') finish('skip');
      if (event.key === 'Tab') { event.preventDefault(); skipRef.current?.focus(); }
    };
    const onVisibilityChange = () => { if (document.hidden) timeline?.pause(); else timeline?.resume(); };
    const onResize = () => finish('resize');
    media.addEventListener('change', onMotionChange);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize, { once: true });
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      cancelled = true;
      clearTimeout(deadline);
      timeline?.kill();
      media.removeEventListener('change', onMotionChange);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [onComplete]);

  return (
    <section ref={rootRef} className="brand-intro" aria-label="Abertura da Comunicação Social Ag" data-phase="preparing">
      <div className="brand-intro__backdrop" />
      <header className="brand-intro__header brand-intro__chrome">
        <span className="brand-intro__name">comunicação social Ag</span>
        <button ref={skipRef} className="brand-intro__skip" onClick={() => finishRef.current?.('skip')}>Pular abertura <span aria-hidden="true">Esc</span></button>
      </header>
      <div className="brand-intro__photos" aria-hidden="true">
        {INTRO_MATERIALS.map((material) => (
          <div className="brand-intro__material" key={material.id} style={{ '--material-bg': `url("${material.mobileSrc}")` }}>
            <picture><source media="(max-width: 768px)" srcSet={material.mobileSrc} /><img src={material.src} alt="" width="1600" height="900" decoding="async" /></picture>
          </div>
        ))}
      </div>
      <footer className="brand-intro__footer brand-intro__chrome"><span>O meio muda.<br />A essência fica.</span><span>Somos a amplificação da sua voz.</span></footer>
    </section>
  );
}
