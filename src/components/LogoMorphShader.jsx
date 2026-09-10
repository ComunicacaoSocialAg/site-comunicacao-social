import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

export const LOGO_MATERIALS = [
  { id: 'ouro', label: 'OURO DERRETIDO & OBSIDIANA', src: '/assets/brand/morph/01_ouro_obsidiana.jpg' },
  { id: 'circuito', label: 'CIRCUITO CIBERNÉTICO', src: '/assets/brand/morph/02_circuito_tech.jpg' },
  { id: 'sumie', label: 'SUMI-Ê & FOLHA DE OURO', src: '/assets/brand/morph/03_sumie_ouro.jpg' },
  { id: 'cyberpunk', label: 'CYBERPUNK NEON', src: '/assets/brand/morph/04_cyberpunk_neon.jpg' },
  { id: 'bizantino', label: 'MOSAICO BIZANTINO EM OURO', src: '/assets/brand/morph/05_mosaico_bizantino.jpg' },
  { id: 'claymation', label: 'CLAYMATION STOP-MOTION', src: '/assets/brand/morph/06_claymation_arte.jpg' },
];

// GLSL Vertex Shader: ondas orgânicas na superfície e inclinação magnética
const vertexShader = `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uMouse;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Respiração e ondulação molecular 3D
    float wave = sin(pos.x * 2.8 + uTime * 1.6) * cos(pos.y * 2.8 + uTime * 1.3);
    pos.z += wave * 0.05;

    // Resposta magnética sutil ao cursor
    pos.x += uMouse.x * 0.05;
    pos.y += uMouse.y * 0.05;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

// GLSL Fragment Shader: Simplex Noise + Dissolve Front + Borda de Ouro Incandescente
const fragmentShader = `
  varying vec2 vUv;
  uniform sampler2D uTex1;
  uniform sampler2D uTex2;
  uniform float uProgress;
  uniform float uTime;
  uniform float uPixelate;
  uniform vec2 uResolution;

  // Simplex Noise 2D
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187,
                        0.366025403784439,
                       -0.577350269189626,
                        0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
          + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = vUv;

    // 1. Pixelização digital de inicialização (estilo Phantom.land)
    if (uPixelate > 0.005) {
      float pSize = mix(240.0, 20.0, uPixelate);
      uv = floor(uv * pSize) / pSize;
    }

    // 2. Ruído molecular para dispersão líquida
    float noise = snoise(uv * 6.5 + vec2(uTime * 0.12, uTime * 0.08));
    float fineNoise = snoise(uv * 16.0 - uTime * 0.2) * 0.35;
    float totalNoise = (noise + fineNoise) * 0.5 + 0.5;

    // 3. Deformação líquida de coordenadas UV
    float dispStrength = sin(uProgress * 3.1415926) * 0.08;
    vec2 uvDisp1 = uv + vec2(totalNoise - 0.5, totalNoise - 0.5) * dispStrength;
    vec2 uvDisp2 = uv - vec2(totalNoise - 0.5, totalNoise - 0.5) * dispStrength;

    // Aberração cromática sutil durante a transição
    float chr = dispStrength * 0.03;
    vec4 c1;
    c1.r = texture2D(uTex1, uvDisp1 + vec2(chr, 0.0)).r;
    c1.g = texture2D(uTex1, uvDisp1).g;
    c1.b = texture2D(uTex1, uvDisp1 - vec2(chr, 0.0)).b;
    c1.a = 1.0;

    vec4 c2;
    c2.r = texture2D(uTex2, uvDisp2 + vec2(chr, 0.0)).r;
    c2.g = texture2D(uTex2, uvDisp2).g;
    c2.b = texture2D(uTex2, uvDisp2 - vec2(chr, 0.0)).b;
    c2.a = 1.0;

    // 4. Interpolação por corte de ruído (Morph Front)
    float edgeWidth = 0.12;
    float threshold = smoothstep(uProgress - edgeWidth, uProgress + edgeWidth, totalNoise);

    // 5. Linha de Fusão de Ouro Incandescente (Burning Seam)
    float seam = 1.0 - smoothstep(0.0, 0.07, abs(totalNoise - uProgress));
    vec3 goldSeamColor = vec3(0.97, 0.83, 0.02);
    vec3 seamGlow = goldSeamColor * seam * 2.2 * sin(uProgress * 3.1415926);

    vec3 finalColor = mix(c2.rgb, c1.rgb, threshold);
    finalColor += seamGlow;

    // 6. Vinheta radial suave para fusão no preto obsidiana (#070708)
    vec2 centerDist = (vUv - 0.5) * vec2(1.15, 1.45);
    float vig = 1.0 - smoothstep(0.38, 0.50, length(centerDist));
    vec3 bgCol = vec3(0.027, 0.027, 0.031); // #070708
    finalColor = mix(bgCol, finalColor, vig);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export default function LogoMorphShader({ onMaterialChange }) {
  const mountRef = useRef(null);
  const [activeMaterial, setActiveMaterial] = useState(LOGO_MATERIALS[0]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // Cena & Câmera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    // Pré-carregamento das texturas
    const loader = new THREE.TextureLoader();
    const textures = LOGO_MATERIALS.map(m => {
      const tex = loader.load(m.src);
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      return tex;
    });

    // Geometria plana na proporção aproximada 16:9
    const geo = new THREE.PlaneGeometry(3.6, 2.05, 48, 48);

    const uniforms = {
      uTex1:       { value: textures[0] },
      uTex2:       { value: textures[1] },
      uProgress:   { value: 0.0 },
      uTime:       { value: 0.0 },
      uPixelate:   { value: 1.0 }, // Inicia com efeito de pixelização
      uResolution: { value: new THREE.Vector2(width, height) },
      uMouse:      { value: new THREE.Vector2(0, 0) },
    };

    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.y = 0.22;
    scene.add(mesh);

    // Animação de entrada: pixelização decresce nos primeiros 0.8s
    gsap.to(uniforms.uPixelate, {
      value: 0.0,
      duration: 0.85,
      ease: 'power2.out',
    });

    // Ciclo Contínuo de Morfose de Materiais
    let currentIndex = 0;
    let isDestroyed = false;

    function runMorphCycle() {
      if (isDestroyed) return;

      const nextIndex = (currentIndex + 1) % LOGO_MATERIALS.length;
      uniforms.uTex1.value = textures[currentIndex];
      uniforms.uTex2.value = textures[nextIndex];
      uniforms.uProgress.value = 0.0;

      // Atualiza etiqueta do material
      const targetMat = LOGO_MATERIALS[nextIndex];
      setActiveMaterial(targetMat);
      if (onMaterialChange) onMaterialChange(targetMat);

      // Transição suave de fusão molecular (1.2s de morph, pausa de 0.8s)
      gsap.to(uniforms.uProgress, {
        value: 1.0,
        duration: 1.25,
        ease: 'power2.inOut',
        delay: 0.65,
        onComplete: () => {
          if (isDestroyed) return;
          currentIndex = nextIndex;
          uniforms.uTex1.value = textures[currentIndex];
          uniforms.uProgress.value = 0.0;
          runMorphCycle();
        },
      });
    }

    // Inicia ciclo após 0.7s
    const startTimeout = setTimeout(runMorphCycle, 700);

    // Mouse Tracking para Parallax
    let targetMouseX = 0, targetMouseY = 0;
    const onMouseMove = (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2.0;
      targetMouseY = (-(e.clientY / window.innerHeight) + 0.5) * 2.0;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Loop de Render
    let rafId;
    const clock = new THREE.Clock();

    function render() {
      rafId = requestAnimationFrame(render);
      const delta = clock.getDelta();
      uniforms.uTime.value += delta;

      // Interpolação suave do mouse
      uniforms.uMouse.value.x += (targetMouseX - uniforms.uMouse.value.x) * 0.06;
      uniforms.uMouse.value.y += (targetMouseY - uniforms.uMouse.value.y) * 0.06;

      // Rotação sutil da malha
      mesh.rotation.y = uniforms.uMouse.value.x * 0.08;
      mesh.rotation.x = -uniforms.uMouse.value.y * 0.08;

      renderer.render(scene, camera);
    }
    render();

    // Redimensionamento
    const onResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      uniforms.uResolution.value.set(width, height);

      // Ajusta distância da câmera e elevação para telas menores (mobile)
      if (width < 768) {
        camera.position.z = 5.2;
        mesh.position.y = 0.32;
      } else {
        camera.position.z = 4.2;
        mesh.position.y = 0.22;
      }
    };
    window.addEventListener('resize', onResize);
    onResize();

    return () => {
      isDestroyed = true;
      clearTimeout(startTimeout);
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geo.dispose();
      mat.dispose();
      textures.forEach(t => t.dispose());
      renderer.dispose();
    };
  }, [onMaterialChange]);

  return (
    <div
      ref={mountRef}
      className="logo-morph-container"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
}
