import { useEffect, useRef, useState } from 'react';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { createReelPlayback } from './reelPlayback';
import './institutional-reel.css';

export default function InstitutionalReel() {
  const videoRef = useRef(null);
  const playbackRef = useRef(null);
  const [playback, setPlayback] = useState({ playing: false, sound: false, blocked: false, failed: false });

  useEffect(() => {
    const video = videoRef.current;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const controller = createReelPlayback(video, { onState: setPlayback, reducedMotion: media.matches, hidden: document.hidden });
    playbackRef.current = controller;
    const observer = new IntersectionObserver(([entry]) => controller.setVisible(entry.isIntersecting && entry.intersectionRatio >= .15), { threshold: .15 });
    const onVisibility = () => controller.setHidden(document.hidden);
    const onMotion = (event) => controller.setReducedMotion(event.matches);
    observer.observe(video);
    document.addEventListener('visibilitychange', onVisibility);
    media.addEventListener('change', onMotion);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      media.removeEventListener('change', onMotion);
      controller.destroy();
      playbackRef.current = null;
    };
  }, []);

  const pointer = (event) => {
    if (event.pointerType !== 'mouse') return;
    const stage = event.currentTarget;
    const rect = stage.getBoundingClientRect();
    stage.style.setProperty('--reel-pointer-x', (event.clientX - rect.left) + 'px');
    stage.style.setProperty('--reel-pointer-y', (event.clientY - rect.top) + 'px');
  };

  return <div className="institutional-reel" data-sound={playback.sound} data-failed={playback.failed}>
    <div className="institutional-reel-frame">
    <button className="institutional-reel-stage" onClick={() => playbackRef.current?.toggleSound()} onPointerMove={pointer} aria-label={playback.sound ? 'Silenciar reel institucional' : 'Reproduzir reel institucional com som desde o início'} aria-pressed={playback.sound} disabled={playback.failed}>
      <video ref={videoRef} src="/assets/video/institucional-csag.mp4" poster="/assets/video/reel-poster.webp" width="1280" height="720" muted loop playsInline preload="metadata" aria-hidden="true" />
      <span className="institutional-reel-prompt" aria-hidden="true">{playback.sound ? <VolumeX size={19} /> : <Play size={19} fill="currentColor" />}<span>{playback.sound ? 'Silenciar' : 'Assistir com som'}</span></span>
    </button>
    <button className="institutional-reel-pause" onClick={() => playbackRef.current?.togglePause()} aria-label={playback.playing ? 'Pausar reel institucional' : 'Reproduzir reel institucional'} disabled={playback.failed}>{playback.playing ? <Pause size={18} /> : <Play size={18} />}</button>
    <span className="institutional-reel-sound" aria-hidden="true">{playback.sound ? <Volume2 size={15} /> : <VolumeX size={15} />}</span>
    </div>
    <span className="reel-sr-only" role="status">{playback.sound ? 'Som ativado.' : 'Som desativado.'}</span>
    {playback.blocked && <p className="institutional-reel-message">Toque no vídeo para iniciar a reprodução.</p>}
    {playback.failed && <p className="institutional-reel-message" role="alert">O vídeo não carregou. <a href="/assets/video/institucional-csag.mp4">Abrir o reel diretamente</a>.</p>}
  </div>;
}
