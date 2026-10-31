'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LogoSpeakerScene, type SceneProgress } from './LogoSpeakerScene';
import './home3d.css';

const SECTIONS = [
  { eyebrow: 'Comunicação que move', title: 'A gente não faz mais do mesmo.', body: 'Constrói o que faz a sua marca ser escolhida.', cta: 'Começar uma conversa' },
  { eyebrow: 'Diagnóstico', title: 'O ruído aparece. A causa nem sempre.', body: 'Lemos o negócio como sistema para encontrar onde a comunicação precisa agir.' },
  { eyebrow: 'Estratégia em movimento', title: 'Mensagem, experiência e aquisição na mesma frequência.', body: 'Posicionamento, infraestrutura digital, conteúdo e performance operando como uma só máquina.' },
  { eyebrow: 'Impacto mensurável', title: 'Criatividade é uma alavanca.', body: 'Quando ela encontra direção, atenção vira preferência, e preferência vira resultado.' },
  { eyebrow: 'Próximo sinal', title: 'Sua marca está pronta para ser escolhida?', body: 'Vamos transformar comunicação em crescimento.', cta: 'Falar com a CS Ag' },
];

export interface Home3DProps {
  onContactClick?: () => void;
}

export function Home3D({ onContactClick }: Home3DProps) {
  const root = useRef<HTMLElement>(null);
  const progress = useRef<SceneProgress>({ scroll: 0, reducedMotion: false });
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update(); media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    progress.current.reducedMotion = reducedMotion;
    if (reducedMotion || !root.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const scroller = root.current.closest('.scroll-container') || undefined;
    const context = gsap.context(() => {
      ScrollTrigger.create({
        trigger: root.current, scroller: scroller, start: 'top top', end: 'bottom bottom', scrub: .35,
        onUpdate: self => { progress.current.scroll = self.progress; },
      });
      gsap.utils.toArray<HTMLElement>('.home3d__copy').forEach(copy => {
        gsap.fromTo(copy, { autoAlpha: 0, y: 34 }, {
          autoAlpha: 1, y: 0, duration: .85, ease: 'power3.out',
          scrollTrigger: { trigger: copy, scroller: scroller, start: 'top 78%', toggleActions: 'play none none reverse' },
        });
      });
    }, root);
    return () => context.revert();
  }, [reducedMotion]);

  const handleCta = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onContactClick) {
      e.preventDefault();
      onContactClick();
    }
  };

  return (
    <main ref={root} className={`home3d ${reducedMotion ? 'is-reduced-motion' : ''}`}>
      {!reducedMotion && (
        <div className="home3d__canvas" aria-hidden="true">
          <Canvas dpr={[1, 1.5]} camera={{ fov: 32, position: [0, 0, 3.2] }} gl={{ antialias: true, powerPreference: 'high-performance' }} onCreated={({ gl }) => gl.setClearColor('#08090d', 1)}>
            <Suspense fallback={null}><LogoSpeakerScene progress={progress} /></Suspense>
          </Canvas>
        </div>
      )}
      {SECTIONS.map((section, index) => (
        <section className="home3d__section" key={section.eyebrow} data-section={index}>
          <div className="home3d__copy">
            <p className="home3d__eyebrow">{section.eyebrow}</p>
            {index === 0 ? <h1>{section.title}</h1> : <h2>{section.title}</h2>}
            <p className="home3d__body">{section.body}</p>
            {section.cta && (
              <a className="home3d__cta" href="#contato" onClick={handleCta}>
                {section.cta}<span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
        </section>
      ))}
    </main>
  );
}

export default Home3D;
