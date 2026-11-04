import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Expand, X } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const selectedIds = ['metas-dentinho', 'dia-das-criancas', 'guardar-escova', 'ferias-escolares', 'impacto-succao', 'dente-escuro'];
const positions = [{ y: 16, angle: -2 }, { y: -18, angle: 1.5 }, { y: 8, angle: -1 }, { y: -12, angle: 2 }, { y: 18, angle: -1.5 }, { y: -8, angle: 1 }];

export default function LiviaSocialGallery({ posts, motion, scrollerRef }) {
  const rootRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const triggerRef = useRef(null);
  const progressRef = useRef(0);
  const progressInkRef = useRef(null);
  const openerRef = useRef(null);
  const restoringFocusRef = useRef(false);
  const dialogRef = useRef(null);
  const [activePost, setActivePost] = useState(null);
  const items = selectedIds.map(id => posts.find(post => post.id === id)).filter(Boolean);

  const updateProgress = value => {
    progressRef.current = value;
    if (progressInkRef.current) progressInkRef.current.style.transform = `scaleX(${value})`;
    const root = rootRef.current;
    if (root) {
      root.querySelector('[data-direction="previous"]').disabled = value < 0.005;
      root.querySelector('[data-direction="next"]').disabled = value > 0.995;
    }
  };

  useEffect(() => {
    if (!motion) return;
    const root = rootRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const scroller = scrollerRef.current;
    if (!root || !viewport || !track || !scroller) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 761px)', () => {
      root.classList.add('le-gallery-cinematic');
      const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
      const travel = () => distance() + scroller.clientHeight * 0.3;
      const top = () => 68 + Math.max(0, (scroller.clientHeight - 68 - root.querySelector('.le-gallery-stage').offsetHeight) / 2);
      const measure = () => { root.style.setProperty('--le-gallery-travel', `${travel()}px`); };
      measure();
      viewport.scrollLeft = 0;
      const ctx = gsap.context(() => {
        const timeline = gsap.timeline({
          onUpdate() { updateProgress(this.progress()); },
          scrollTrigger: {
            trigger: root, scroller, start: () => `top ${top()}`, end: () => `+=${travel()}`,
            scrub: 0.65, invalidateOnRefresh: true, onRefreshInit: measure,
          },
        });
        timeline.to(track, { x: () => -distance(), duration: 1, ease: 'none' });
        triggerRef.current = timeline.scrollTrigger;
      }, root);
      return () => {
        triggerRef.current = null;
        ctx.revert();
        root.classList.remove('le-gallery-cinematic');
        root.style.removeProperty('--le-gallery-travel');
        updateProgress(0);
      };
    });
    return () => mm.revert();
  }, [motion, scrollerRef]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (activePost && !dialog.open) dialog.showModal();
    if (!activePost && dialog.open) dialog.close();
  }, [activePost]);

  const closePost = () => {
    restoringFocusRef.current = true;
    dialogRef.current.close();
    setActivePost(null);
    openerRef.current?.focus({ preventScroll: true });
    restoringFocusRef.current = false;
  };

  const move = direction => {
    const viewport = viewportRef.current;
    const trigger = triggerRef.current;
    const step = Math.min(0.48, viewport.clientWidth / Math.max(trackRef.current.scrollWidth - viewport.clientWidth, 1) * 0.7);
    if (trigger) {
      const progress = gsap.utils.clamp(0, 1, progressRef.current + direction * step);
      scrollerRef.current.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * progress, behavior: 'smooth' });
    } else viewport.scrollBy({ left: direction * viewport.clientWidth * 0.8, behavior: motion ? 'smooth' : 'instant' });
  };

  const handleFocus = event => {
    const item = event.target.closest('.le-social-piece');
    if (!item || restoringFocusRef.current || !event.target.matches(':focus-visible')) return;
    const viewport = viewportRef.current;
    const trigger = triggerRef.current;
    if (trigger) {
      const max = trackRef.current.scrollWidth - viewport.clientWidth;
      const progress = gsap.utils.clamp(0, 1, (item.offsetLeft - (viewport.clientWidth - item.offsetWidth) / 2) / Math.max(max, 1));
      scrollerRef.current.scrollTo({ top: trigger.start + progress * (trigger.end - trigger.start), behavior: 'instant' });
      ScrollTrigger.update();
      trigger.getTween()?.progress(1);
    }
  };

  return <div className="le-social-gallery" id="le-social-gallery" ref={rootRef}>
    <div className="le-gallery-stage">
      <div className="le-gallery-viewport" ref={viewportRef} role="region" aria-label="Publicações de Instagram da Dra. Lívia Esper"
        tabIndex={0} onFocus={handleFocus}
        onKeyDown={event => {
          if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1); }
        }}
        onScroll={() => {
          if (!triggerRef.current) {
            const element = viewportRef.current;
            updateProgress(element.scrollLeft / Math.max(1, element.scrollWidth - element.clientWidth));
          }
        }}>
        <div className="le-gallery-track" ref={trackRef}>
          {items.map((post, index) => <button type="button" key={post.id} className="le-social-piece"
            style={{ '--piece-y': `${positions[index].y}px`, '--piece-angle': `${positions[index].angle}deg` }}
            aria-label={`Ampliar publicação: ${post.title}`} aria-haspopup="dialog"
            onClick={event => {
              openerRef.current = event.currentTarget;
              setActivePost(post);
            }}>
            <img src={post.src} alt={post.title} width="900" height={post.id === 'ferias-escolares' ? '900' : '1125'} loading="lazy" decoding="async" />
            <span className="le-piece-expand" aria-hidden="true"><Expand size={17} /></span>
          </button>)}
        </div>
      </div>
      <div className="le-gallery-controls">
        <p className="le-gallery-hint"><span className="le-hint-desktop">Role para percorrer</span><span className="le-hint-touch">Arraste para explorar</span><span>Toque em uma peça para ampliar</span></p>
        <div className="le-gallery-progress" aria-hidden="true"><span ref={progressInkRef} /></div>
        <div className="le-gallery-arrows"><button type="button" data-direction="previous" aria-label="Ver publicações anteriores" disabled onClick={() => move(-1)}><ArrowLeft size={19} /></button><button type="button" data-direction="next" aria-label="Ver próximas publicações" onClick={() => move(1)}><ArrowRight size={19} /></button></div>
      </div>
    </div>
    <dialog className="le-post-dialog" ref={dialogRef} aria-label={activePost ? `Publicação ampliada: ${activePost.title}` : 'Publicação ampliada'}
      onCancel={event => { event.preventDefault(); closePost(); }}
      onClose={() => setActivePost(null)}
      onKeyDown={event => { if (event.key === 'Escape') { event.stopPropagation(); event.preventDefault(); closePost(); } }}
      onClick={event => { if (event.target === event.currentTarget) closePost(); }}>
      <button className="le-post-dialog-close" type="button" onClick={closePost} aria-label="Fechar publicação ampliada" autoFocus><X size={23} /></button>
      {activePost && <img src={activePost.src} alt={activePost.title} />}
    </dialog>
  </div>;
}
