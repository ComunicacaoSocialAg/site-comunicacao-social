import { Component, Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, useGLTF } from '@react-three/drei';
import { Box3, Group, MathUtils, Vector3 } from 'three';
import { SPEAKER_IMAGE } from '../../data/brandIntro';
import { samplePose } from './motion';
import { refineSpeakerMaterial } from './speakerMaterial';

class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

function Speaker({ progress, introActive, onReady }) {
  const groupRef = useRef(null);
  const readyRef = useRef(false);
  const initializedRef = useRef(false);
  const gl = useThree((state) => state.gl);
  const gltf = useGLTF('/models/csag-speaker.glb', '/draco/');
  const model = useMemo(() => {
    const source = gltf.scene.clone(true);
    // Orientação do modelo original. A geometria e suas UVs são preservadas.
    source.rotation.y = -Math.PI / 2;
    source.updateMatrixWorld(true);
    const bounds = new Box3().setFromObject(source);
    const center = bounds.getCenter(new Vector3());
    const size = bounds.getSize(new Vector3());
    source.position.sub(center);
    source.traverse((node) => {
      if (!node.isMesh) return;
      node.material = Array.isArray(node.material)
        ? node.material.map((material) => refineSpeakerMaterial(material, gl.capabilities.getMaxAnisotropy()))
        : refineSpeakerMaterial(node.material, gl.capabilities.getMaxAnisotropy());
    });
    const normalized = new Group();
    normalized.add(source);
    normalized.scale.setScalar(2.6 / size.x);
    return normalized;
  }, [gltf, gl]);

  useFrame(({ size, viewport }, delta) => {
    const group = groupRef.current;
    if (!group || document.hidden) return;
    const dt = Math.min(delta, 0.05);
    const compact = size.width <= 768;
    const scroll = introActive ? 0 : progress.current.scroll;
    const pointerWeight = Math.min(1, scroll / 0.055);
    const pointer = compact ? { x: 0, y: 0 } : progress.current.pointer;
    const pose = samplePose(scroll, compact);
    const heroScale = viewport.width * (compact ? 0.87 : 0.44) / 2.6;
    const scale = pose.scale * heroScale;
    const damp = (from, to) => initializedRef.current ? MathUtils.damp(from, to, 6, dt) : to;
    group.position.set(damp(group.position.x, pose.x), damp(group.position.y, pose.y), damp(group.position.z, pose.z));
    group.rotation.set(damp(group.rotation.x, pose.tilt - pointer.y * 0.045 * pointerWeight), damp(group.rotation.y, pose.yaw + pointer.x * 0.07 * pointerWeight), damp(group.rotation.z, pose.roll));
    group.scale.setScalar(damp(group.scale.x, scale));
    group.visible = pose.opacity > 0.01;
    initializedRef.current = true;
    // O aviso só sai depois de um quadro real: a abertura revela o mesmo canvas.
    if (!readyRef.current) {
      readyRef.current = true;
      requestAnimationFrame(onReady);
    }
  });

  return <group ref={groupRef}><primitive object={model} dispose={null} /></group>;
}

export default function CinematicScene({ progress, introActive, onReady, reducedMotion, ready }) {
  const fallback = <img className="film-scene-fallback" src={SPEAKER_IMAGE} alt="" />;
  if (reducedMotion) return null;
  return (
    <div className="film-scene" data-ready={ready} aria-hidden="true">
      <SceneBoundary fallback={fallback}>
        <Canvas camera={{ position: [0, 0, 7.5], fov: 35 }} dpr={[1, 1.75]} gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }} fallback={fallback}>
          <ambientLight intensity={0.55} />
          <directionalLight position={[-3, 4, 6]} intensity={1.65} color="#fff9ed" />
          <directionalLight position={[4, 0.5, 4]} intensity={0.9} color="#f2f5ff" />
          <directionalLight position={[1, 3, -4]} intensity={1.5} color="#ffffff" />
          <Suspense fallback={null}>
            <Speaker progress={progress} introActive={introActive} onReady={onReady} />
            <Environment resolution={128} frames={1}>
              <Lightformer position={[-3, 3, 4]} intensity={2} scale={[4, 5]} target={[0, 0, 0]} />
              <Lightformer position={[4, 0, 2]} intensity={1.25} scale={[2, 5]} target={[0, 0, 0]} />
              <Lightformer position={[0, 4, -3]} intensity={1.5} scale={[6, 2]} target={[0, 0, 0]} />
            </Environment>
          </Suspense>
        </Canvas>
      </SceneBoundary>
    </div>
  );
}
