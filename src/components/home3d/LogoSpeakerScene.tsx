import { Environment, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Group, MathUtils, Mesh, Object3D } from 'three';
import { MutableRefObject, useMemo, useRef } from 'react';

export type SceneProgress = { scroll: number; reducedMotion: boolean };
type Props = { progress: MutableRefObject<SceneProgress> };
type Keyframe = { at: number; position: [number, number, number]; rotation: [number, number, number]; scale: number; pulse: number };

const FRAMES: Keyframe[] = [
  { at: 0, position: [0.45, -0.08, 0], rotation: [0.04, -0.28, 0], scale: 1.5, pulse: 0.15 },
  { at: .22, position: [-0.55, 0.02, 0], rotation: [.12, .46, -.06], scale: 1.15, pulse: .25 },
  { at: .48, position: [0.52, -0.05, 0], rotation: [-.08, -.7, .1], scale: 1.1, pulse: .42 },
  { at: .72, position: [-0.48, -0.12, 0.3], rotation: [.04, .13, 0], scale: 1.45, pulse: 1 },
  { at: 1, position: [0.45, -0.04, 0], rotation: [.04, -.28, 0], scale: 1.25, pulse: .12 },
];

function sample(t: number) {
  const right = FRAMES.find(frame => frame.at >= t) ?? FRAMES[FRAMES.length - 1];
  const left = [...FRAMES].reverse().find(frame => frame.at <= t) ?? FRAMES[0];
  const p = MathUtils.smoothstep((t - left.at) / Math.max(.001, right.at - left.at), 0, 1);
  const mix = (a: number, b: number) => MathUtils.lerp(a, b, p);
  return {
    position: left.position.map((v, i) => mix(v, right.position[i])) as [number, number, number],
    rotation: left.rotation.map((v, i) => mix(v, right.rotation[i])) as [number, number, number],
    scale: mix(left.scale, right.scale),
    pulse: mix(left.pulse, right.pulse)
  };
}

export function LogoSpeakerScene({ progress }: Props) {
  const root = useRef<Group>(null!);
  const gltf = useGLTF('/models/csag-speaker.glb', '/draco/');
  const cones = useMemo(() => {
    const matches: Object3D[] = [];
    if (gltf && gltf.scene) {
      gltf.scene.traverse(object => {
        if (/speaker|woofer|cone/i.test(object.name)) matches.push(object);
      });
    }
    return matches;
  }, [gltf]);

  useFrame(({ clock }, delta) => {
    const state = sample(progress.current.reducedMotion ? 0 : progress.current.scroll);
    const group = root.current;
    if (!group) return;

    group.position.x = MathUtils.damp(group.position.x, state.position[0], 5, delta);
    group.position.y = MathUtils.damp(group.position.y, state.position[1], 5, delta);
    group.position.z = MathUtils.damp(group.position.z, state.position[2], 5, delta);
    group.rotation.x = MathUtils.damp(group.rotation.x, state.rotation[0], 5, delta);
    group.rotation.y = MathUtils.damp(group.rotation.y, state.rotation[1], 5, delta);
    group.rotation.z = MathUtils.damp(group.rotation.z, state.rotation[2], 5, delta);
    const s = MathUtils.damp(group.scale.x, state.scale, 5, delta);
    group.scale.setScalar(s);

    const beat = progress.current.reducedMotion ? 0 : Math.sin(clock.elapsedTime * 11) * .055 * state.pulse;
    cones.forEach(cone => {
      const mesh = cone as Mesh;
      const influence = mesh.morphTargetInfluences?.[0];
      if (influence !== undefined) mesh.morphTargetInfluences![0] = Math.max(0, beat);
    });
  });

  return (
    <group ref={root}>
      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 6, 4]} intensity={2.2} color="#ffffff" />
      <directionalLight position={[-4, 2, -3]} intensity={1.2} color="#f7d406" />
      <primitive object={gltf.scene} />
      <Environment preset="city" />
    </group>
  );
}

useGLTF.preload('/models/csag-speaker.glb', '/draco/');
