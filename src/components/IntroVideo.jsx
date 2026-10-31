import React, { useRef, useState, useEffect, useCallback } from 'react';

export default function IntroVideo({ onComplete }) {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const completedRef = useRef(false);

  const triggerFinish = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 350);
  }, [onComplete]);

  const toggleAudio = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const curr = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 7.2;
    setProgress((curr / dur) * 100);

    // Natural completion near end of video
    if (curr >= 7.15 && !completedRef.current) {
      triggerFinish();
    }
  };

  // Keyboard shortcut: Escape or Space to skip intro
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === ' ') {
        e.preventDefault();
        triggerFinish();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerFinish]);

  // Attempt autoplay immediately
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay policy prevented playback, will play on user interaction
      });
    }
  }, []);

  return (
    <div className={`intro-container ${isExiting ? 'is-exiting' : ''}`}>
      <video
        ref={videoRef}
        className="intro-video-element"
        src="/assets/intro.mp4"
        autoPlay
        playsInline
        muted={isMuted}
        onTimeUpdate={handleTimeUpdate}
        onEnded={triggerFinish}
      />
      <div className="intro-vignette" />

      {/* Top HUD */}
      <div className="intro-top-bar">
        <div className="intro-brand-badge">
          <img src="/assets/brand/logo-sem-fundo.png" alt="CS Ag" className="intro-badge-logo" />
          <div className="intro-badge-text">
            <span className="intro-badge-title">Comunicação Social Ag®</span>
            <span className="intro-badge-subtitle">A Origem • Manifesto Visual</span>
          </div>
        </div>

        <div className="intro-badge-live">
          <span className="pulse-dot-gold" />
          <span>Experiência Imersiva</span>
        </div>
      </div>

      {/* Bottom HUD */}
      <div className="intro-bottom-bar">
        <div className="intro-manifesto-snippet">
          <span className="intro-manifesto-tag">Gênese da Marca</span>
          <p className="intro-manifesto-phrase">
            Da matéria primordial à expansão criativa infinita.
          </p>
        </div>

        <div className="intro-controls">
          <button className="btn-intro-audio" onClick={toggleAudio} title="Alternar áudio">
            {isMuted ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <line x1="23" y1="9" x2="17" y2="15"></line>
                  <line x1="17" y1="9" x2="23" y2="15"></line>
                </svg>
                <span>Ativar Som</span>
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                </svg>
                <span>Som Ligado</span>
              </>
            )}
          </button>

          <button className="btn-skip-intro" onClick={triggerFinish} title="Pular introdução (ESC)">
            <span>Pular Intro</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 4 15 12 5 20 5 4"></polygon>
              <line x1="19" y1="5" x2="19" y2="19"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="intro-progress-bar">
        <div className="intro-progress-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
