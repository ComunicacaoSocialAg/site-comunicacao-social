import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { playClickSound } from '../utils/audio';

export default function CinemaReelPlayer({ soundEnabled = true }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto play/pause based on viewport visibility
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().then(() => setIsPlaying(true)).catch(() => {
            // Autoplay with audio was blocked, fallback to muted
            video.muted = true;
            setIsMuted(true);
            video.play().then(() => setIsPlaying(true)).catch(() => {});
          });
        } else {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.35 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const togglePlay = () => {
    playClickSound(soundEnabled);
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    playClickSound(soundEnabled);
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    setCurrentTime(video.currentTime);
    setProgress((video.currentTime / video.duration) * 100);
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    setDuration(video.duration);
  };

  const handleSeek = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * video.duration;
    setProgress(pos * 100);
  };

  const formatTime = (secs) => {
    if (isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      ref={containerRef}
      className="cinema-reel-shell"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Ambient Volumetric Glow Behind the Hardware Shell */}
      <div className={`cinema-ambient-glow ${isPlaying ? 'is-active' : ''}`} />

      {/* Outer Hardware Machined Bezel */}
      <div className="cinema-reel-inner" onClick={togglePlay}>
        {/* Technical Corner Brackets */}
        <span className="frame-corner top-left" />
        <span className="frame-corner top-right" />
        <span className="frame-corner bottom-left" />
        <span className="frame-corner bottom-right" />

        {/* Video Element */}
        <video
          ref={videoRef}
          src="/assets/video/institucional-csag.mp4"
          playsInline
          loop
          muted={isMuted}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          className="cinema-video-element"
        />

        {/* Cinematic Scanline & Grain Vignette */}
        <div className="cinema-vignette-layer" />

        {/* Header HUD inside video */}
        <div className="cinema-hud-top">
          <div className="cinema-live-badge">
            <span className="cinema-live-dot" />
            <span>REEL INSTITUCIONAL • 2026 • 4K</span>
          </div>
          <div className="cinema-timestamp">
            {formatTime(currentTime)} / {formatTime(duration || 25)}
          </div>
        </div>

        {/* Center Big Play Button (shows when paused or on initial hover) */}
        {!isPlaying && (
          <motion.div
            className="cinema-play-overlay"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button className="cinema-center-btn" aria-label="Reproduzir Vídeo">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
            <span className="cinema-play-hint">CLIQUE PARA ASSISTIR COM ÁUDIO</span>
          </motion.div>
        )}

        {/* Bottom Custom Control Deck */}
        <div className={`cinema-control-deck ${isHovered || !isPlaying ? 'is-visible' : ''}`}>
          {/* Timeline Scrubber */}
          <div className="cinema-scrubber-track" onClick={handleSeek}>
            <div className="cinema-scrubber-bar" style={{ width: `${progress}%` }}>
              <span className="cinema-scrubber-thumb" />
            </div>
          </div>

          <div className="cinema-controls-row">
            <div className="cinema-controls-left">
              {/* Play / Pause */}
              <button
                type="button"
                className="cinema-ctrl-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
              >
                {isPlaying ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              {/* Mute / Unmute */}
              <button
                type="button"
                className={`cinema-ctrl-btn ${!isMuted ? 'is-active' : ''}`}
                onClick={toggleMute}
                aria-label={isMuted ? 'Ativar Áudio' : 'Mutar Áudio'}
              >
                {isMuted ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
                  </svg>
                )}
                <span className="cinema-ctrl-text">{isMuted ? 'SOM OFF' : 'SOM ON'}</span>
              </button>
            </div>

            <div className="cinema-controls-right">
              <span className="cinema-format-pill">1080P HD · 60 FPS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
