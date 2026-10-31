import React, { useRef, useMemo } from 'react';
import { useGLTF, Environment, ContactShadows, Sparkles } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { MathUtils, DoubleSide } from 'three';
import { playBassDrop } from '../../utils/speakerAudio';

const FRAMES = [
  { at: 0, position: [0.44, -0.05, 0.2], rotation: [0.05, -0.24, 0], scale: 1.65, pulse: 0.18 },
  { at: 0.24, position: [-0.5, 0.02, 0.1], rotation: [0.1, 0.42, -0.05], scale: 1.35, pulse: 0.28 },
  { at: 0.5, position: [0.48, -0.02, 0.15], rotation: [-0.06, -0.62, 0.08], scale: 1.38, pulse: 0.45 },
  { at: 0.74, position: [-0.46, -0.08, 0.3], rotation: [0.03, 0.2, -0.02], scale: 1.55, pulse: 0.95 },
  { at: 1.0, position: [0.44, -0.04, 0.15], rotation: [0.05, -0.24, 0], scale: 1.35, pulse: 0.15 },
];

function sample(t) {
  const right = FRAMES.find((frame) => frame.at >= t) ?? FRAMES[FRAMES.length - 1];
  const left = [...FRAMES].reverse().find((frame) => frame.at <= t) ?? FRAMES[0];
  const p = MathUtils.smoothstep((t - left.at) / Math.max(0.001, right.at - left.at), 0, 1);
  const mix = (a, b) => MathUtils.lerp(a, b, p);
  return {
    position: left.position.map((v, i) => mix(v, right.position[i])),
    rotation: left.rotation.map((v, i) => mix(v, right.rotation[i])),
    scale: mix(left.scale, right.scale),
    pulse: mix(left.pulse, right.pulse),
  };
}

export function LogoSpeakerScene({ progress, soundEnabled = true }) {
  const root = useRef(null);
  const shockwaveRef = useRef(null);
  const kickRef = useRef(0);
  const gltf = useGLTF('/models/csag-speaker.glb', '/draco/');

  const cones = useMemo(() => {
    const matches = [];
    if (gltf && gltf.scene) {
      gltf.scene.traverse((object) => {
        if (/speaker|woofer|cone/i.test(object.name)) {
          matches.push(object);
        }
      });
    }
    return matches;
  }, [gltf]);

  useFrame(({ clock, pointer, viewport }, delta) => {
    if (!root.current) return;
    const scrollVal = progress?.current?.reducedMotion ? 0 : (progress?.current?.scroll || 0);
    const state = sample(scrollVal);
    const group = root.current;

    const isCompact = viewport.width < 2.2;
    const targetX = isCompact ? state.position[0] * 0.25 : state.position[0];
    const targetY = isCompact ? state.position[1] + 0.08 : state.position[1];
    const targetZ = state.position[2];
    const targetScale = state.scale * (isCompact ? 0.72 : 1.0);

    // Subtle pointer parallax tilt
    const tiltX = progress?.current?.reducedMotion ? 0 : pointer.y * -0.12;
    const tiltY = progress?.current?.reducedMotion ? 0 : pointer.x * 0.18;

    group.position.x = MathUtils.damp(group.position.x, targetX, 5, delta);
    group.position.y = MathUtils.damp(group.position.y, targetY, 5, delta);
    group.position.z = MathUtils.damp(group.position.z, targetZ, 5, delta);
    group.rotation.x = MathUtils.damp(group.rotation.x, state.rotation[0] + tiltX, 5, delta);
    group.rotation.y = MathUtils.damp(group.rotation.y, state.rotation[1] + tiltY, 5, delta);
    group.rotation.z = MathUtils.damp(group.rotation.z, state.rotation[2], 5, delta);

    const s = MathUtils.damp(group.scale.x, targetScale, 5, delta);

    // Natural sub-bass vibration (120 BPM)
    const beat = progress?.current?.reducedMotion
      ? 0
      : Math.sin(clock.elapsedTime * 12) * 0.038 * state.pulse;

    // Dampen kick impulse from user clicks
    kickRef.current = MathUtils.damp(kickRef.current, 0, 6, delta);
    const totalImpulse = beat + kickRef.current * 0.16;

    // Tactile acoustic cabinet vibration (squash and stretch)
    const pulseScaleX = s * (1 + totalImpulse * 0.85);
    const pulseScaleY = s * (1 - totalImpulse * 0.55);
    const pulseScaleZ = s * (1 + totalImpulse * 0.65);
    group.scale.set(pulseScaleX, pulseScaleY, pulseScaleZ);

    // Animate 3D acoustic shockwave ring
    if (shockwaveRef.current) {
      const ringScale = 1.0 + (1.0 - kickRef.current) * 1.8;
      shockwaveRef.current.scale.set(ringScale, ringScale, ringScale);
      shockwaveRef.current.material.opacity = Math.max(0, kickRef.current * 0.75);
    }

    cones.forEach((cone) => {
      if (cone.morphTargetInfluences && cone.morphTargetInfluences[0] !== undefined) {
        cone.morphTargetInfluences[0] = Math.max(0, totalImpulse * 1.5);
      }
    });
  });

  const handleSpeakerClick = (e) => {
    e.stopPropagation();
    kickRef.current = 1.0;
    playBassDrop(soundEnabled, 1.25);
  };

  return (
    <>
      <group ref={root}>
        {/* Studio Lighting Setup */}
        <ambientLight intensity={1.1} />
        {/* Warm Gold Key Light */}
        <directionalLight position={[4, 5, 4]} intensity={2.6} color="#fffbe6" />
        {/* Cool Graphite Rim Light for edge definition */}
        <directionalLight position={[-5, 3, -3]} intensity={1.8} color="#818cf8" />
        {/* Dynamic Acoustic Fill */}
        <pointLight position={[0, -0.2, 0.6]} intensity={1.2} color="#f7d406" distance={3} />

        <primitive
          object={gltf.scene}
          onPointerDown={handleSpeakerClick}
        />

        {/* 3D Sound Shockwave Ring */}
        <mesh ref={shockwaveRef} position={[0, 0, -0.05]} rotation={[0, 0, 0]}>
          <ringGeometry args={[0.35, 0.42, 64]} />
          <meshBasicMaterial
            color="#f7d406"
            transparent
            opacity={0}
            side={DoubleSide}
          />
        </mesh>

        <Environment preset="city" />
      </group>

      {/* Floating Acoustic Motes */}
      <Sparkles
        count={28}
        scale={[4, 3, 2]}
        size={1.8}
        speed={0.35}
        opacity={0.3}
        color="#f7d406"
      />

      {/* Ground Contact Shadow */}
      <ContactShadows
        position={[0, -0.85, 0]}
        opacity={0.65}
        scale={4.2}
        blur={2.4}
        far={2.2}
        color="#000000"
      />
    </>
  );
}

useGLTF.preload('/models/csag-speaker.glb', '/draco/');
