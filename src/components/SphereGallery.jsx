import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { PROJECTS, projectMatchesCategory } from '../data/projects';
import { playClickSound, playTransitionSound } from '../utils/audio';

// ─── HELPER: CIRCULAR GLOW PARTICLE SHADER ────────────────────────────────────
function createCircularParticleMaterial({ sizeMultiplier = 1.0, pixelRatio = null } = {}) {
  const pr = pixelRatio !== null ? pixelRatio : Math.min(typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1, 2);
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uPixelRatio: { value: pr },
      uSizeMultiplier: { value: sizeMultiplier }
    },
    vertexShader: `
      uniform float uPixelRatio;
      uniform float uSizeMultiplier;
      
      attribute float aSize;
      attribute vec3 aColor;
      attribute float aAlpha;
      
      varying vec3 vColor;
      varying float vAlpha;
      
      void main() {
        vColor = aColor;
        vAlpha = aAlpha;
        
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        float pointScale = (360.0 / -mvPosition.z) * uPixelRatio * uSizeMultiplier;
        gl_PointSize = clamp(aSize * pointScale, 1.0, 180.0);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      precision highp float;
      
      varying vec3 vColor;
      varying float vAlpha;
      
      void main() {
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        
        if (dist > 0.5) {
          discard;
        }
        
        float edge = smoothstep(0.5, 0.40, dist);
        float core = smoothstep(0.18, 0.0, dist);
        vec3 finalColor = mix(vColor, vec3(1.0, 1.0, 1.0), core * 0.9);
        float radiance = exp(-dist * 4.0);
        
        float alpha = vAlpha * edge * radiance;
        if (alpha < 0.002) {
          discard;
        }
        
        gl_FragColor = vec4(finalColor, alpha);
      }
    `
  });
}

// ─── SPHERE GALLERY (3D BIG BANG UNIVERSE) ─────────────────────────────────────
export default function SphereGallery({
  genesisTrigger,
  activeCategory,
  soundEnabled,
  isPaused = false,
  onHover,
  onClick,
  onCursorChange
}) {
  const canvasRef     = useRef(null);
  const groupRef      = useRef(null);
  const meshesRef     = useRef([]);
  const rafRef        = useRef(null);
  const isDownRef     = useRef(false);
  const lastPosRef    = useRef({ x: 0, y: 0 });
  const isDragRef     = useRef(false);
  const velRef        = useRef({ x: 0, y: 0 });
  const targetRotRef  = useRef({ x: 0, y: 0 });
  const currentRotRef = useRef({ x: 0, y: 0 });
  const hoveredRef    = useRef(null);
  const mouseRef      = useRef(new THREE.Vector2(-9, -9));
  const raycasterRef  = useRef(new THREE.Raycaster());
  const cameraRef     = useRef(null);
  const rendererRef   = useRef(null);
  const isTransitioningRef = useRef(false);
  const isPausedRef   = useRef(isPaused);

  // Sync isPaused with ref for 60fps loop access
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // Reactive Category Filter Update on 3D Cards
  useEffect(() => {
    if (!meshesRef.current.length) return;
    meshesRef.current.forEach(mesh => {
      const matches = projectMatchesCategory(mesh.userData.proj, activeCategory);
      if (matches) {
        gsap.to(mesh.material, { opacity: 0.92, duration: 0.45, ease: 'power2.out' });
        gsap.to(mesh.scale, { x: 1, y: 1, z: 1, duration: 0.45, ease: 'power2.out' });
        if (mesh.userData.edgeLine) {
          gsap.to(mesh.userData.edgeLine.material, {
            opacity: activeCategory === 'all' ? 0.15 : 0.75,
            duration: 0.45
          });
        }
      } else {
        gsap.to(mesh.material, { opacity: 0.12, duration: 0.45, ease: 'power2.out' });
        gsap.to(mesh.scale, { x: 0.88, y: 0.88, z: 0.88, duration: 0.45, ease: 'power2.out' });
        if (mesh.userData.edgeLine) {
          gsap.to(mesh.userData.edgeLine.material, { opacity: 0.02, duration: 0.45 });
        }
      }
    });
  }, [activeCategory]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene  = new THREE.Scene();
    scene.background = new THREE.Color(0x070708);
    const W = window.innerWidth, H = window.innerHeight;
    const camera = new THREE.PerspectiveCamera(85, W / H, 0.1, 500);
    camera.position.set(0, 0, 0.01);
    cameraRef.current = camera;

    const isMobile = typeof window !== 'undefined' && (window.innerWidth < 768 || /Mobi|Android|iPhone/i.test(navigator.userAgent));
    const effectivePixelRatio = isMobile ? 1.0 : Math.min(window.devicePixelRatio || 1, 2);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(W, H);
    renderer.setPixelRatio(effectivePixelRatio);
    rendererRef.current = renderer;

    // Ambient Starfield Particles (450 Mobile / 1,800 Desktop Circular Anti-Aliased Star Orbs)
    const pCount = isMobile ? 450 : 1800;
    const pPos = new Float32Array(pCount * 3);
    const pColor = new Float32Array(pCount * 3);
    const pSize = new Float32Array(pCount);
    const pAlpha = new Float32Array(pCount);

    for (let i = 0; i < pCount; i++) {
      const idx3 = i * 3;
      pPos[idx3]     = (Math.random() - 0.5) * 140;
      pPos[idx3 + 1] = (Math.random() - 0.5) * 140;
      pPos[idx3 + 2] = (Math.random() - 0.5) * 140;

      if (Math.random() > 0.25) {
        pColor[idx3]     = 0.968;
        pColor[idx3 + 1] = 0.831;
        pColor[idx3 + 2] = 0.024;
      } else {
        pColor[idx3]     = 0.96;
        pColor[idx3 + 1] = 0.97;
        pColor[idx3 + 2] = 1.0;
      }

      pSize[i]  = Math.random() * 0.12 + 0.04;
      pAlpha[i] = Math.random() * 0.42 + 0.14;
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('aColor', new THREE.BufferAttribute(pColor, 3));
    pGeo.setAttribute('aSize', new THREE.BufferAttribute(pSize, 1));
    pGeo.setAttribute('aAlpha', new THREE.BufferAttribute(pAlpha, 1));
    const pMat = createCircularParticleMaterial({ sizeMultiplier: 1.0, pixelRatio: effectivePixelRatio });
    const ambientParticles = new THREE.Points(pGeo, pMat);
    scene.add(ambientParticles);

    // Big Bang Explosion Cosmic Embers (600 Mobile / 2,600 Desktop in 4 Physical Tiers)
    const expCount = isMobile ? 600 : 2600;
    const expPos = new Float32Array(expCount * 3);
    const expColor = new Float32Array(expCount * 3);
    const expSize = new Float32Array(expCount);
    const expAlpha = new Float32Array(expCount);

    const expVel = new Float32Array(expCount * 3);
    const expDrag = new Float32Array(expCount);
    const expDecay = new Float32Array(expCount);
    const expMinAlpha = new Float32Array(expCount);
    const expSwirl = new Float32Array(expCount);

    const tier1Limit = Math.round(expCount * 0.17);
    const tier2Limit = Math.round(expCount * 0.65);
    const tier3Limit = Math.round(expCount * 0.90);

    for (let i = 0; i < expCount; i++) {
      const idx3 = i * 3;
      expPos[idx3]     = 0;
      expPos[idx3 + 1] = 0;
      expPos[idx3 + 2] = 0;

      if (i < tier1Limit) {
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const speed = (Math.random() * 32 + 38) * 0.06;
        const sinPhi = Math.sin(phi);

        expVel[idx3]     = Math.cos(theta) * sinPhi * speed;
        expVel[idx3 + 1] = Math.sin(theta) * sinPhi * speed;
        expVel[idx3 + 2] = (Math.cos(phi) * 0.75 + 0.35) * speed;

        expColor[idx3]     = 1.0;
        expColor[idx3 + 1] = 0.98;
        expColor[idx3 + 2] = 0.88;

        expSize[i]     = Math.random() * 0.2 + 0.12;
        expAlpha[i]    = 1.0;
        expDrag[i]     = 0.942;
        expDecay[i]    = 0.965;
        expMinAlpha[i] = 0.0;
        expSwirl[i]    = 0.0;

      } else if (i < tier2Limit) {
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const speed = (Math.random() * 24 + 14) * 0.052;
        const sinPhi = Math.sin(phi);

        expVel[idx3]     = Math.cos(theta) * sinPhi * speed;
        expVel[idx3 + 1] = Math.sin(theta) * sinPhi * speed;
        expVel[idx3 + 2] = Math.cos(phi) * speed;

        const paletteChoice = Math.random();
        if (paletteChoice < 0.65) {
          expColor[idx3]     = 0.968;
          expColor[idx3 + 1] = 0.831;
          expColor[idx3 + 2] = 0.024;
        } else if (paletteChoice < 0.88) {
          expColor[idx3]     = 1.0;
          expColor[idx3 + 1] = 0.619;
          expColor[idx3 + 2] = 0.0;
        } else {
          expColor[idx3]     = 1.0;
          expColor[idx3 + 1] = 0.282;
          expColor[idx3 + 2] = 0.0;
        }

        expSize[i]     = Math.random() * 0.45 + 0.25;
        expAlpha[i]    = 0.98;
        expDrag[i]     = 0.956;
        expDecay[i]    = 0.984;
        expMinAlpha[i] = 0.0;
        expSwirl[i]    = (Math.random() - 0.5) * 0.024;

      } else if (i < tier3Limit) {
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const speed = (Math.random() * 7.0 + 3.0) * 0.046;
        const sinPhi = Math.sin(phi);

        expVel[idx3]     = Math.cos(theta) * sinPhi * speed;
        expVel[idx3 + 1] = Math.sin(theta) * sinPhi * speed;
        expVel[idx3 + 2] = Math.cos(phi) * speed;

        expColor[idx3]     = 0.98;
        expColor[idx3 + 1] = 0.88;
        expColor[idx3 + 2] = 0.36;

        expSize[i]     = Math.random() * 0.22 + 0.12;
        expAlpha[i]    = 0.92;
        expDrag[i]     = 0.968;
        expDecay[i]    = 0.992;
        expMinAlpha[i] = Math.random() * 0.32 + 0.14;
        expSwirl[i]    = (Math.random() - 0.5) * 0.008;

      } else {
        const angle = Math.random() * Math.PI * 2;
        const speed = (Math.random() * 18 + 26) * 0.056;
        const yJitter = (Math.random() - 0.5) * 1.6;

        expVel[idx3]     = Math.cos(angle) * speed;
        expVel[idx3 + 1] = yJitter * 0.056;
        expVel[idx3 + 2] = Math.sin(angle) * speed;

        expColor[idx3]     = 1.0;
        expColor[idx3 + 1] = 0.96;
        expColor[idx3 + 2] = 0.70;

        expSize[i]     = Math.random() * 0.32 + 0.22;
        expAlpha[i]    = 0.95;
        expDrag[i]     = 0.945;
        expDecay[i]    = 0.978;
        expMinAlpha[i] = 0.0;
        expSwirl[i]    = 0.016;
      }
    }

    const expGeo = new THREE.BufferGeometry();
    expGeo.setAttribute('position', new THREE.BufferAttribute(expPos, 3));
    expGeo.setAttribute('aColor', new THREE.BufferAttribute(expColor, 3));
    expGeo.setAttribute('aSize', new THREE.BufferAttribute(expSize, 1));
    expGeo.setAttribute('aAlpha', new THREE.BufferAttribute(expAlpha, 1));
    const expMat = createCircularParticleMaterial({ sizeMultiplier: 1.15, pixelRatio: effectivePixelRatio });
    const expParticles = new THREE.Points(expGeo, expMat);
    scene.add(expParticles);

    // Expanding Shockwave Rings
    const ring1Geo = new THREE.RingGeometry(0.2, 0.9, 96);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0xf7d406,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 2.2;
    scene.add(ring1);

    gsap.fromTo(ring1.scale, { x: 0.01, y: 0.01, z: 0.01 }, { x: 56, y: 56, z: 56, duration: 2.0, ease: 'power2.out' });
    gsap.fromTo(ring1Mat, { opacity: 0.95 }, { opacity: 0, duration: 2.0, ease: 'power2.out' });

    const ring2Geo = new THREE.RingGeometry(0.2, 0.65, 96);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 3.4;
    scene.add(ring2);

    gsap.fromTo(ring2.scale, { x: 0.01, y: 0.01, z: 0.01 }, { x: 44, y: 44, z: 44, duration: 1.6, delay: 0.05, ease: 'power2.out' });
    gsap.fromTo(ring2Mat, { opacity: 0.9 }, { opacity: 0, duration: 1.6, delay: 0.05, ease: 'power2.out' });

    // Camera FOV recoil
    camera.position.set(0, 0, -1.6);
    camera.fov = 94;
    camera.updateProjectionMatrix();

    gsap.to(camera.position, {
      z: 0.01,
      duration: 2.4,
      ease: 'power4.out'
    });

    gsap.to(camera, {
      fov: 65,
      duration: 2.4,
      ease: 'power3.out',
      onUpdate: () => camera.updateProjectionMatrix()
    });

    const shake = { val: 0.38 };
    gsap.to(shake, {
      val: 0,
      duration: 1.35,
      ease: 'power2.out',
      onUpdate: () => {
        if (shake.val > 0.001) {
          camera.position.x = (Math.random() - 0.5) * shake.val;
          camera.position.y = (Math.random() - 0.5) * shake.val;
        } else if (!isTransitioningRef.current) {
          camera.position.x = 0;
          camera.position.y = 0;
        }
      }
    });

    // Wireframe Sphere
    const RADIUS = 20;
    const wireGeo = new THREE.SphereGeometry(RADIUS + 1.5, 28, 18);
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x1c1c24, wireframe: true, transparent: true, opacity: 0.055 });
    const wireSphere = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wireSphere);

    // Group for Cards
    const group = new THREE.Group();
    scene.add(group);
    groupRef.current = group;

    // Cards
    const loader   = new THREE.TextureLoader();
    const meshes   = [];
    const total    = PROJECTS.length;
    const CARD_W   = 8.0, CARD_H = 5.3;
    const cardGeo  = new THREE.PlaneGeometry(CARD_W, CARD_H);
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    PROJECTS.forEach((proj, i) => {
      const yNorm = 1 - (i / (total - 1)) * 2;
      const rAtY  = Math.sqrt(Math.max(0, 1 - yNorm * yNorm));
      const theta = goldenAngle * i;
      const finalPos = new THREE.Vector3(Math.cos(theta) * rAtY * RADIUS, yNorm * RADIUS, Math.sin(theta) * rAtY * RADIUS);

      const tex = loader.load(proj.image);
      tex.colorSpace = THREE.SRGBColorSpace;
      const mat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide, transparent: true, opacity: 0 });
      const mesh = new THREE.Mesh(cardGeo, mat);

      const edgeGeo = new THREE.EdgesGeometry(cardGeo);
      const edgeMat = new THREE.LineBasicMaterial({ color: 0xf7d406, transparent: true, opacity: 0.15 });
      const edgeLine = new THREE.LineSegments(edgeGeo, edgeMat);
      mesh.add(edgeLine);
      
      mesh.position.set(0, 0, 0);
      mesh.scale.set(0.001, 0.001, 0.001);
      mesh.lookAt(0, 0, 0);
      mesh.userData = {
        proj,
        idx: i,
        finalPos,
        edgeLine,
        baseRot: mesh.rotation.clone()
      };
      group.add(mesh);
      meshes.push(mesh);

      const delay = 0.08 + (i * 0.038);
      gsap.to(mesh.position, {
        x: finalPos.x,
        y: finalPos.y,
        z: finalPos.z,
        duration: 2.2,
        delay,
        ease: 'power4.out',
        onUpdate: () => {
          mesh.lookAt(0, 0, 0);
          mesh.userData.baseRot = mesh.rotation.clone();
        }
      });
      gsap.to(mesh.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 1.9,
        delay,
        ease: 'back.out(1.4)'
      });
      gsap.to(mat, {
        opacity: 0.88,
        duration: 1.5,
        delay: delay + 0.05,
        ease: 'power2.out'
      });
    });
    meshesRef.current = meshes;

    // Animation Loop with zero-cost pausing
    const FRICTION = 0.92, AUTO_SPEED = 0.0006, LERP = 0.072;
    function animate() {
      rafRef.current = requestAnimationFrame(animate);

      // PERFORMANCE OPTIMIZATION: Pause rendering and physics when modal/case is open or tab hidden
      if (isPausedRef.current || document.hidden) {
        return;
      }

      // Dynamic physics update for Big Bang 4-Tier Particle System
      const pArr = expGeo.attributes.position.array;
      const aArr = expGeo.attributes.aAlpha.array;
      let needAlphaUpdate = false;

      for (let j = 0; j < expCount; j++) {
        const idx3 = j * 3;

        pArr[idx3]     += expVel[idx3];
        pArr[idx3 + 1] += expVel[idx3 + 1];
        pArr[idx3 + 2] += expVel[idx3 + 2];

        const drag = expDrag[j];
        expVel[idx3]     *= drag;
        expVel[idx3 + 1] *= drag;
        expVel[idx3 + 2] *= drag;

        const swirl = expSwirl[j];
        if (swirl !== 0) {
          const cosS = Math.cos(swirl);
          const sinS = Math.sin(swirl);
          const px = pArr[idx3];
          const pz = pArr[idx3 + 2];
          pArr[idx3]     = px * cosS - pz * sinS;
          pArr[idx3 + 2] = px * sinS + pz * cosS;
        }

        const minA = expMinAlpha[j];
        if (aArr[j] > minA) {
          aArr[j] = Math.max(minA, aArr[j] * expDecay[j]);
          needAlphaUpdate = true;
        }
      }

      expGeo.attributes.position.needsUpdate = true;
      if (needAlphaUpdate) {
        expGeo.attributes.aAlpha.needsUpdate = true;
      }

      if (!isDownRef.current && !isTransitioningRef.current) {
        targetRotRef.current.x += AUTO_SPEED;
        velRef.current.x *= FRICTION;
        velRef.current.y *= FRICTION;
        targetRotRef.current.x += velRef.current.x;
        targetRotRef.current.y += velRef.current.y;
      }

      currentRotRef.current.x += (targetRotRef.current.x - currentRotRef.current.x) * LERP;
      currentRotRef.current.y += (targetRotRef.current.y - currentRotRef.current.y) * LERP;

      if (groupRef.current) {
        groupRef.current.rotation.y = currentRotRef.current.x;
        groupRef.current.rotation.x = currentRotRef.current.y;
      }

      // Raycasting
      if (!isTransitioningRef.current) {
        raycasterRef.current.setFromCamera(mouseRef.current, camera);
        const hits = raycasterRef.current.intersectObjects(meshes);

        if (hits.length > 0) {
          const hit = hits[0].object;
          if (hoveredRef.current !== hit) {
            if (hoveredRef.current) {
              gsap.to(hoveredRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.35, ease: 'power2.out' });
              if (hoveredRef.current.userData.edgeLine) {
                gsap.to(hoveredRef.current.userData.edgeLine.material, { opacity: 0.15, duration: 0.25 });
              }
            }
            hoveredRef.current = hit;
            gsap.to(hit.scale, { x: 1.14, y: 1.14, z: 1.14, duration: 0.35, ease: 'back.out(2)' });
            if (hit.userData.edgeLine) {
              gsap.to(hit.userData.edgeLine.material, { opacity: 0.95, duration: 0.25 });
            }
            onHover(hit.userData.proj);
            if (onCursorChange) onCursorChange({ isHovered: true, text: 'VER CASE' });
          }
        } else if (hoveredRef.current) {
          gsap.to(hoveredRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.35, ease: 'power2.out' });
          if (hoveredRef.current.userData.edgeLine) {
            gsap.to(hoveredRef.current.userData.edgeLine.material, { opacity: 0.15, duration: 0.25 });
          }
          hoveredRef.current = null;
          onHover(null);
          if (onCursorChange) onCursorChange({ isHovered: false, text: 'ARRASTAR' });
        }
      }

      renderer.render(scene, camera);
    }
    animate();

    function onDown(e) {
      isDownRef.current = true; isDragRef.current = false;
      const src = e.touches ? e.touches[0] : e;
      lastPosRef.current = { x: src.clientX, y: src.clientY };
      velRef.current = { x: 0, y: 0 };
      if (onCursorChange) onCursorChange({ isDragging: true, text: 'ARRASTANDO' });
    }
    function onMove(e) {
      const src = e.touches ? e.touches[0] : e;
      mouseRef.current.x = (src.clientX / W) * 2 - 1;
      mouseRef.current.y = -(src.clientY / H) * 2 + 1;
      if (!isDownRef.current) return;
      const dx = src.clientX - lastPosRef.current.x, dy = src.clientY - lastPosRef.current.y;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) isDragRef.current = true;
      const DRAG = 0.0018;
      targetRotRef.current.x += dx * DRAG;
      targetRotRef.current.y += dy * DRAG;
      velRef.current.x = dx * DRAG * 0.55;
      velRef.current.y = dy * DRAG * 0.55;
      lastPosRef.current = { x: src.clientX, y: src.clientY };
    }
    function onUp() {
      isDownRef.current = false;
      if (onCursorChange) onCursorChange({ isDragging: false, text: hoveredRef.current ? 'VER CASE' : 'ARRASTAR' });
      if (!isDragRef.current && hoveredRef.current && !isTransitioningRef.current) {
        const hit = hoveredRef.current;
        isTransitioningRef.current = true;
        playClickSound(soundEnabled);
        playTransitionSound(soundEnabled);

        const worldPos = new THREE.Vector3();
        hit.getWorldPosition(worldPos);

        gsap.to(hit.scale, { x: 1.65, y: 1.65, z: 1.65, duration: 0.45, ease: 'power2.in' });
        gsap.to(camera.position, {
          x: worldPos.x * 0.42,
          y: worldPos.y * 0.42,
          z: worldPos.z * 0.42,
          duration: 0.5,
          ease: 'power3.in',
          onComplete: () => {
            onClick(hit.userData.proj);
            setTimeout(() => {
              camera.position.set(0, 0, 0.01);
              hit.scale.set(1, 1, 1);
              isTransitioningRef.current = false;
            }, 450);
          }
        });
      }
    }
    function onResize() {
      const nW = window.innerWidth, nH = window.innerHeight;
      camera.aspect = nW / nH; camera.updateProjectionMatrix();
      renderer.setSize(nW, nH);
    }

    const handleVisibilityChange = () => {
      isPausedRef.current = document.hidden || isPaused;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    canvas.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    canvas.addEventListener('touchstart', onDown, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onUp);
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      canvas.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      canvas.removeEventListener('touchstart', onDown);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
      window.removeEventListener('resize', onResize);
      meshes.forEach(m => m.material.dispose());
      cardGeo.dispose(); pGeo.dispose(); pMat.dispose();
      expGeo.dispose(); expMat.dispose();
      ring1Geo.dispose(); ring1Mat.dispose();
      ring2Geo.dispose(); ring2Mat.dispose();
      wireGeo.dispose(); wireMat.dispose();
      renderer.dispose();
    };
  }, [genesisTrigger, onHover, onClick, soundEnabled, onCursorChange, isPaused]);

  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, display: 'block' }} />;
}
