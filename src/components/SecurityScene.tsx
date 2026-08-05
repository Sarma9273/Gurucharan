import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { AdaptiveDpr, Float, Sparkles } from '@react-three/drei';
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { FocusMode } from '../data';

const colours: Record<FocusMode, string> = {
  ai: '#9f7cff',
  soc: '#55e6ff',
  data: '#f7b955',
};

function ParticleField({ colour }: { colour: string }) {
  const points = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const array = new Float32Array(900 * 3);
    for (let i = 0; i < 900; i += 1) {
      const radius = 2.4 + Math.random() * 7;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      array[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      array[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      array[i * 3 + 2] = radius * Math.cos(phi);
    }
    return array;
  }, []);

  useFrame((_, delta) => {
    points.current.rotation.y += delta * 0.025;
    points.current.rotation.x -= delta * 0.006;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={colour} size={0.018} transparent opacity={0.65} sizeAttenuation />
    </points>
  );
}

function OrbitNode({
  radius,
  speed,
  offset,
  colour,
  scale = 1,
}: {
  radius: number;
  speed: number;
  offset: number;
  colour: string;
  scale?: number;
}) {
  const mesh = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const time = clock.elapsedTime * speed + offset;
    mesh.current.position.set(
      Math.cos(time) * radius,
      Math.sin(time * 1.37) * radius * 0.42,
      Math.sin(time) * radius,
    );
  });
  return (
    <mesh ref={mesh} scale={scale}>
      <icosahedronGeometry args={[0.1, 1]} />
      <meshStandardMaterial color={colour} emissive={colour} emissiveIntensity={5} />
    </mesh>
  );
}

function Core({ mode }: { mode: FocusMode }) {
  const group = useRef<THREE.Group>(null!);
  const inner = useRef<THREE.Mesh>(null!);
  const { pointer, viewport } = useThree();
  const colour = colours[mode];

  useFrame(({ clock }, delta) => {
    const compact = viewport.width < 7;
    const targetX = pointer.y * (compact ? 0.14 : 0.28);
    const targetY = pointer.x * (compact ? 0.18 : 0.38);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetX, 4, delta);
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetY, 4, delta);
    group.current.rotation.z += delta * 0.035;
    inner.current.rotation.x = clock.elapsedTime * 0.18;
    inner.current.rotation.y = clock.elapsedTime * 0.27;
  });

  return (
    <group ref={group}>
      <Float speed={1.8} rotationIntensity={0.18} floatIntensity={0.28}>
        <mesh ref={inner}>
          <icosahedronGeometry args={[1.05, 3]} />
          <meshPhysicalMaterial
            color="#09121c"
            emissive={colour}
            emissiveIntensity={0.45}
            roughness={0.18}
            metalness={0.82}
            clearcoat={1}
            transmission={0.1}
          />
        </mesh>
        <mesh scale={1.08}>
          <icosahedronGeometry args={[1.05, 2]} />
          <meshBasicMaterial color={colour} wireframe transparent opacity={0.55} />
        </mesh>
      </Float>

      {[1.55, 1.85, 2.2].map((radius, index) => (
        <mesh
          key={radius}
          rotation={[
            Math.PI / (2.5 + index),
            Math.PI / (4 + index),
            index * 0.8,
          ]}
        >
          <torusGeometry args={[radius, 0.008 + index * 0.004, 8, 180]} />
          <meshBasicMaterial color={index === 1 ? '#f7b955' : colour} transparent opacity={0.55} />
        </mesh>
      ))}

      <OrbitNode radius={1.6} speed={0.42} offset={0} colour="#55e6ff" scale={1.2} />
      <OrbitNode radius={1.9} speed={-0.28} offset={2} colour="#f7b955" />
      <OrbitNode radius={2.2} speed={0.22} offset={4} colour="#9f7cff" scale={1.4} />
      <Sparkles count={45} scale={5} size={2.5} speed={0.25} color={colour} />
    </group>
  );
}

export default function SecurityScene({ mode }: { mode: FocusMode }) {
  return (
    <div className="security-scene" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 42 }}
        dpr={[1, 1.65]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.28} />
        <pointLight position={[3, 3, 4]} intensity={35} color="#55e6ff" />
        <pointLight position={[-3, -2, 2]} intensity={25} color="#9f7cff" />
        <pointLight position={[0, 3, -2]} intensity={18} color="#f7b955" />
        <ParticleField colour={colours[mode]} />
        <Core mode={mode} />
        <EffectComposer multisampling={0}>
          <Bloom luminanceThreshold={0.25} mipmapBlur intensity={1.15} />
          <Vignette eskil={false} offset={0.18} darkness={0.7} />
        </EffectComposer>
        <AdaptiveDpr pixelated />
      </Canvas>
    </div>
  );
}
