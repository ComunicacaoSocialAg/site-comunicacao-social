import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { playBassDrop, playSubwooferPulse } from '../utils/speakerAudio';

// ─── DEFINIÇÕES ESPACIAIS POR SEÇÃO (CHOREOGRAPHY) ───────────────────────────
// Ajustado para o modelo onde rotation.y = -Math.PI / 2 posiciona a face frontal dos alto-falantes para a câmera.
const SECTION_CONFIGS = {
  hero: {
    posDesktop: [1.6, 0.02, 0.1],
    posMobile: [0, -0.04, -0.2],
    rotDesktop: [-0.04, -Math.PI / 2 + 0.18, 0.03],
    rotMobile: [-0.02, -Math.PI / 2, 0],
    scaleDesktop: 3.1,
    scaleMobile: 1.8,
  },
  agency: {
    posDesktop: [1.55, 0.08, 0.0],
    posMobile: [0, 0.85, -0.6],
    rotDesktop: [0.06, -Math.PI / 2 + 0.35, 0.04],
    rotMobile: [0.08, -Math.PI / 2, 0],
    scaleDesktop: 2.6,
    scaleMobile: 1.8,
  },
  approach: {
    posDesktop: [1.45, 0.42, 0.0],
    posMobile: [0, 0.9, -0.6],
    rotDesktop: [-0.04, -Math.PI / 2 + 0.25, -0.03],
    rotMobile: [-0.06, -Math.PI / 2, 0],
    scaleDesktop: 2.35,
    scaleMobile: 1.8,
  },
  services: {
    posDesktop: [1.45, 0.45, -0.1],
    posMobile: [0, 0.95, -0.8],
    rotDesktop: [0.08, -Math.PI / 2 + 0.28, 0.02],
    rotMobile: [0.2, -Math.PI / 2, 0],
    scaleDesktop: 2.3,
    scaleMobile: 1.6,
  },
  projects: {
    posDesktop: [1.48, 0.42, -0.15],
    posMobile: [0, 0.85, -0.7],
    rotDesktop: [-0.06, -Math.PI / 2 + 0.3, 0.05],
    rotMobile: [0, -Math.PI / 2, 0],
    scaleDesktop: 2.2,
    scaleMobile: 1.7,
  },
  contact: {
    posDesktop: [0, 0.72, -0.15],
    posMobile: [0, 0.65, -0.4],
    rotDesktop: [0.18, -Math.PI / 2, 0],
    rotMobile: [0.2, -Math.PI / 2, 0],
    scaleDesktop: 2.8,
    scaleMobile: 2.0,
  },
};

export default function SpeakerCanvas({
  activeSection = 'hero',
  soundEnabled = true,
  onSpeakerClick,
  onLoaded,
  isDirectControl = false,
}) {
  const containerRef = useRef(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [beatPulseActive, setBeatPulseActive] = useState(false);

  // References to Three.js objects
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const speakerGroupRef = useRef(null);
  const modelMeshRef = useRef(null);
  const pointLightRef = useRef(null);
  const keyLightRef = useRef(null);
  const shockwavesRef = useRef([]);

  // Animation & Interaction state
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const dragRef = useRef({
    isDragging: false,
    prevX: 0,
    prevY: 0,
    userRotX: 0,
    userRotY: 0,
    velX: 0,
    velY: 0,
  });
  const currentTransformRef = useRef({
    pos: [1.6, 0.02, 0.1],
    rot: [-0.04, -Math.PI / 2 + 0.18, 0.03],
    scale: 3.1,
  });
  const impactRef = useRef({ intensity: 0, time: 0 });

  // Handle direct click on speaker (Drop the Bass)
  const triggerImpact = useCallback(() => {
    impactRef.current = { intensity: 1.0, time: performance.now() };
    setBeatPulseActive(true);
    setTimeout(() => setBeatPulseActive(false), 200);

    if (soundEnabled) {
      playBassDrop(true, 1.0);
    }

    // Spawn 3D shockwave ring
    spawnShockwave(1.0);

    if (onSpeakerClick) {
      onSpeakerClick();
    }
  }, [soundEnabled, onSpeakerClick]);

  // Shockwave ring spawner
  const spawnShockwave = (intensity = 1.0) => {
    if (!sceneRef.current || !speakerGroupRef.current) return;
    const innerRadius = 0.45;
    const outerRadius = 0.52;
    const ringGeo = new THREE.RingGeometry(innerRadius, outerRadius, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xf7d406,
      transparent: true,
      opacity: 0.85 * intensity,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    // Align with speaker front face
    ringMesh.position.copy(speakerGroupRef.current.position);
    ringMesh.position.z += 0.25;
    ringMesh.rotation.y = speakerGroupRef.current.rotation.y - Math.PI / 2;
    ringMesh.userData = {
      birth: performance.now(),
      lifetime: 900,
      startScale: 1.0,
      endScale: 3.8 * intensity,
      initialOpacity: 0.85 * intensity,
    };
    sceneRef.current.add(ringMesh);
    shockwavesRef.current.push(ringMesh);
  };

  // Setup Three.js scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera (perspective with tight FOV for elegant cinematic compression)
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, 3.6);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting System (Studio Audiophile Setup)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    // Warm Key Light (aimed at the yellow speaker cone)
    const keyLight = new THREE.DirectionalLight(0xfffae0, 2.8);
    keyLight.position.set(-2.5, 3.0, 3.5);
    scene.add(keyLight);
    keyLightRef.current = keyLight;

    // Rim / Back Light (accentuating black matte chassis contours)
    const rimLight = new THREE.DirectionalLight(0x7599ff, 1.6);
    rimLight.position.set(3.2, 1.8, -2.2);
    scene.add(rimLight);

    // Front Fill Light
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.7);
    fillLight.position.set(0, -2.0, 2.5);
    scene.add(fillLight);

    // Pulsing Core Point Light
    const pointLight = new THREE.PointLight(0xf7d406, 1.2, 5.0);
    pointLight.position.set(0, 0, 1.2);
    scene.add(pointLight);
    pointLightRef.current = pointLight;

    // 5. Root Group for transformations
    const speakerGroup = new THREE.Group();
    scene.add(speakerGroup);
    speakerGroupRef.current = speakerGroup;

    // 6. Load the 3D GLB Model
    const loader = new GLTFLoader();
    loader.load(
      '/assets/models/logo-speaker-3d.glb',
      (gltf) => {
        const root = gltf.scene;

        // Traverse to adjust materials for premium studio finish
        root.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
              child.material.roughness = 0.38;
              child.material.metalness = 0.12;
              child.material.needsUpdate = true;
            }
          }
        });

        // Center model geometry at its bounding box origin
        const box = new THREE.Box3().setFromObject(root);
        const center = new THREE.Vector3();
        box.getCenter(center);
        root.position.sub(center);

        speakerGroup.add(root);
        modelMeshRef.current = root;

        // Initial orientation: front face to camera
        speakerGroup.rotation.y = -Math.PI / 2 + 0.15;

        setIsLoaded(true);
        if (onLoaded) onLoaded();
      },
      (xhr) => {
        const total = xhr.total || 39426740;
        const pct = Math.min(100, Math.round((xhr.loaded / total) * 100));
        setLoadingProgress(pct);
      },
      (err) => {
        console.error('Error loading speaker 3D model:', err);
      }
    );

    // 7. Mouse / Pointer Tracking for interactive tilt
    const handlePointerMove = (e) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseRef.current.targetX = normX * 0.25;
      mouseRef.current.targetY = normY * 0.2;

      // If dragging
      if (dragRef.current.isDragging) {
        const deltaX = e.clientX - dragRef.current.prevX;
        const deltaY = e.clientY - dragRef.current.prevY;
        dragRef.current.prevX = e.clientX;
        dragRef.current.prevY = e.clientY;
        dragRef.current.userRotY += deltaX * 0.007;
        dragRef.current.userRotX += deltaY * 0.007;
        dragRef.current.velX = deltaX * 0.007;
        dragRef.current.velY = deltaY * 0.007;
      }
    };

    const handlePointerDown = (e) => {
      // Don't drag if clicking buttons or UI elements
      if (e.target.closest('button, a, input')) return;
      dragRef.current.isDragging = true;
      dragRef.current.prevX = e.clientX;
      dragRef.current.prevY = e.clientY;
      dragRef.current.velX = 0;
      dragRef.current.velY = 0;
      setIsInteracting(true);
    };

    const handlePointerUp = () => {
      dragRef.current.isDragging = false;
      setIsInteracting(false);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);

    // 8. Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 9. Main Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      const now = performance.now();

      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      // Apply drag inertia with damping
      if (!dragRef.current.isDragging) {
        dragRef.current.userRotX += dragRef.current.velX;
        dragRef.current.userRotY += dragRef.current.velY;
        dragRef.current.velX *= 0.92;
        dragRef.current.velY *= 0.92;
        // Slowly ease back user rotation toward 0 so section orientation rules
        dragRef.current.userRotX *= 0.985;
        dragRef.current.userRotY *= 0.985;
      }

      // Rhythmic Subwoofer Excursion (120 BPM = 2 beats/sec)
      const beatFreq = 2.0;
      const beatPhase = (elapsedTime * beatFreq) % 1.0;
      const kickCurve = Math.pow(Math.max(0, 1.0 - beatPhase * 3.6), 3.0);

      // Manual click impact decay
      const impactAge = (now - impactRef.current.time) / 1000;
      let manualImpact = 0;
      if (impactAge < 0.6) {
        manualImpact = Math.sin(impactAge * Math.PI * 4) * Math.exp(-impactAge * 5.0) * impactRef.current.intensity;
      }

      const totalBassKick = kickCurve * 0.35 + manualImpact * 0.65;

      // Update speaker group transform
      if (speakerGroupRef.current) {
        const cur = currentTransformRef.current;

        // Position interpolation
        speakerGroupRef.current.position.x += (cur.pos[0] - speakerGroupRef.current.position.x) * 0.07;
        speakerGroupRef.current.position.y += (cur.pos[1] - speakerGroupRef.current.position.y) * 0.07;
        speakerGroupRef.current.position.z += (cur.pos[2] - speakerGroupRef.current.position.z) * 0.07;

        // Target rotation with section base + drag + gentle mouse parallax
        const targetRotX = cur.rot[0] + dragRef.current.userRotX + mouseRef.current.y * 0.4;
        const targetRotY = cur.rot[1] + dragRef.current.userRotY + mouseRef.current.x * 0.6;
        const targetRotZ = cur.rot[2] - mouseRef.current.x * 0.15;

        speakerGroupRef.current.rotation.x += (targetRotX - speakerGroupRef.current.rotation.x) * 0.07;
        speakerGroupRef.current.rotation.y += (targetRotY - speakerGroupRef.current.rotation.y) * 0.07;
        speakerGroupRef.current.rotation.z += (targetRotZ - speakerGroupRef.current.rotation.z) * 0.07;

        // Base scale + physical subwoofer squash and stretch
        const baseScale = cur.scale;
        const excursionZ = totalBassKick * 0.14; // Forward acoustic punch
        const squashY = 1.0 - totalBassKick * 0.035; // Slight cabinet compression
        const stretchX = 1.0 + totalBassKick * 0.025; // Side expansion

        speakerGroupRef.current.scale.set(
          baseScale * stretchX,
          baseScale * squashY,
          baseScale * (1.0 + excursionZ)
        );

        // Pulsing Point Light flare
        if (pointLightRef.current) {
          pointLightRef.current.intensity = 1.1 + totalBassKick * 2.4;
        }
        if (keyLightRef.current) {
          keyLightRef.current.intensity = 2.8 + totalBassKick * 1.2;
        }
      }

      // Update & Cull Shockwave Rings
      const activeShockwaves = [];
      shockwavesRef.current.forEach((ring) => {
        const age = now - ring.userData.birth;
        const progress = age / ring.userData.lifetime;
        if (progress < 1.0) {
          const s = THREE.MathUtils.lerp(ring.userData.startScale, ring.userData.endScale, progress);
          ring.scale.set(s, s, s);
          ring.material.opacity = ring.userData.initialOpacity * (1.0 - progress);
          activeShockwaves.push(ring);
        } else {
          sceneRef.current.remove(ring);
          ring.geometry.dispose();
          ring.material.dispose();
        }
      });
      shockwavesRef.current = activeShockwaves;

      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };

    animate();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('resize', handleResize);

      if (rendererRef.current && rendererRef.current.domElement) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, []);

  // Update target transforms when section changes or on window resize
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const config = SECTION_CONFIGS[activeSection] || SECTION_CONFIGS.hero;

    currentTransformRef.current = {
      pos: isMobile ? config.posMobile : config.posDesktop,
      rot: isMobile ? config.rotMobile : config.rotDesktop,
      scale: isMobile ? config.scaleMobile : config.scaleDesktop,
    };
  }, [activeSection]);

  return (
    <div
      ref={containerRef}
      className={`speaker-canvas-wrapper ${isInteracting ? 'is-interacting' : ''}`}
      onClick={triggerImpact}
      title="Clique na Caixa de Som CS Ag para acionar o grave"
    >
      {/* 3D Loading Progress Indicator */}
      {!isLoaded && (
        <div className="speaker-loading-overlay">
          <div className="speaker-loading-brand">
            <div className="speaker-loading-cone-pulse" />
            <span className="speaker-loading-title">SISTEMA ACÚSTICO 3D CS AG</span>
            <div className="speaker-loading-bar-wrap">
              <div
                className="speaker-loading-bar-fill"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <span className="speaker-loading-meta">
              CALIBRANDO MONITORES HI-FI • {loadingProgress}%
            </span>
          </div>
        </div>
      )}

      {/* Floating Interactive Badge */}
      {isLoaded && (
        <div className="speaker-interactive-badge">
          <span className={`pulse-led ${beatPulseActive ? 'active' : ''}`} />
          <span className="speaker-badge-text">
            CAIXA DE SOM INTERATIVA • ARRASTE OU CLIQUE PARA O GRAVE
          </span>
        </div>
      )}
    </div>
  );
}
