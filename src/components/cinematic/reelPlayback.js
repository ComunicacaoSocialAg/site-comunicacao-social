export const REEL_PREVIEW_SECONDS = 10;

// Um único vídeo alterna entre a prévia muda e o filme completo com som.
export function createReelPlayback(video, { onState, reducedMotion = false, hidden = false }) {
  let visible = false;
  let userPaused = false;
  let userStarted = false;
  let destroyed = false;
  let requestId = 0;
  let state = { playing: false, sound: false, blocked: false, failed: false };
  video.muted = true;
  const publish = (changes = {}) => {
    if (destroyed) return;
    const next = { ...state, playing: !video.paused, sound: !video.muted, ...changes };
    if (Object.keys(next).some((key) => next[key] !== state[key])) { state = next; onState(next); }
  };
  const shouldPlay = () => visible && !hidden && !userPaused && !state.failed && (!reducedMotion || userStarted);
  const synchronize = () => {
    const request = ++requestId;
    if (!shouldPlay()) {
      video.pause();
      if (!visible || hidden || reducedMotion && !userStarted) video.muted = true;
      publish();
      return;
    }
    if (!video.paused) { publish(); return; }
    if (video.muted && video.currentTime >= REEL_PREVIEW_SECONDS) video.currentTime = 0;
    const failed = () => { if (!destroyed && request === requestId) publish({ blocked: true }); };
    try {
      Promise.resolve(video.play()).then(() => {
        if (destroyed) { video.pause(); return; }
        if (!shouldPlay()) video.pause();
        publish({ blocked: false });
      }, failed);
    } catch { failed(); }
  };
  const onPlayback = () => publish();
  const onPlaying = () => publish({ blocked: false });
  const onTimeUpdate = () => { if (video.muted && video.currentTime >= REEL_PREVIEW_SECONDS) video.currentTime = 0; };
  const onError = () => { video.pause(); publish({ failed: true }); };
  const onLoaded = () => { publish({ failed: false }); synchronize(); };
  const listeners = { playing: onPlaying, pause: onPlayback, volumechange: onPlayback, timeupdate: onTimeUpdate, error: onError, loadeddata: onLoaded };
  Object.entries(listeners).forEach(([event, callback]) => video.addEventListener(event, callback));
  return {
    setVisible(value) { visible = value; synchronize(); },
    setHidden(value) { hidden = value; synchronize(); },
    setReducedMotion(value) { reducedMotion = value; if (value) userStarted = false; synchronize(); },
    toggleSound() {
      if (state.failed) return;
      video.muted = !video.muted;
      if (!video.muted || video.currentTime >= REEL_PREVIEW_SECONDS) video.currentTime = 0;
      userStarted = true;
      userPaused = false;
      publish({ blocked: false });
      synchronize();
    },
    togglePause() { userPaused = !video.paused; userStarted = true; synchronize(); },
    destroy() {
      destroyed = true;
      requestId += 1;
      Object.entries(listeners).forEach(([event, callback]) => video.removeEventListener(event, callback));
      video.muted = true;
      video.pause();
    },
  };
}
