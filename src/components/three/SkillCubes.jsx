import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, RoundedBox, Float } from '@react-three/drei';
import * as THREE from 'three';

// Real tech stack with brand colors
const TECH_ICONS = [
  { label: 'React',      emoji: '⚛',  color: '#61DAFB', pos: [-3.5,  1.2,  0] },
  { label: 'Node.js',    emoji: '⬡',  color: '#3C873A', pos: [ 3.5,  1.2,  0] },
  { label: 'Firebase',   emoji: '🔥', color: '#FFCA28', pos: [ 0,    2.5,  0] },
  { label: 'Docker',     emoji: '🐳', color: '#2496ED', pos: [-3.0, -1.2,  0] },
  { label: 'GitHub',     emoji: '⊙',  color: '#ffffff', pos: [ 3.0, -1.2,  0] },
  { label: 'TypeScript', emoji: 'TS', color: '#3178C6', pos: [-1.5,  0.2,  0] },
  { label: 'MongoDB',    emoji: '🍃', color: '#4DB33D', pos: [ 1.5,  0.2,  0] },
  { label: 'GSAP',       emoji: '⚡', color: '#88CE02', pos: [ 0,   -2.0,  0] },
];

function TechIcon({ label, emoji, color, pos, index }) {
  const groupRef = useRef();
  const hovered = useRef(false);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    // Gentle float
    groupRef.current.position.y = pos[1] + Math.sin(t * 0.8 + index * 0.9) * 0.2;

    // Face camera (billboarding for text) + slow Y rotation
    if (!hovered.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.3 + index) * 0.3;
    } else {
      groupRef.current.rotation.y += 0.04;
    }

    // Scale on hover
    const targetScale = hovered.current ? 1.25 : 1;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
  });

  const c = new THREE.Color(color);

  return (
    <group
      ref={groupRef}
      position={pos}
      onPointerEnter={() => { hovered.current = true; document.body.style.cursor = 'pointer'; }}
      onPointerLeave={() => { hovered.current = false; document.body.style.cursor = ''; }}
    >
      {/* Glowing panel */}
      <RoundedBox args={[1.1, 1.1, 0.12]} radius={0.15} smoothness={4}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.25}
          roughness={0.2}
          metalness={0.7}
          transparent
          opacity={0.85}
        />
      </RoundedBox>

      {/* Border glow ring */}
      <RoundedBox args={[1.18, 1.18, 0.05]} radius={0.17} smoothness={4}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          transparent
          opacity={0.3}
          wireframe
        />
      </RoundedBox>

      {/* Label text */}
      <Text
        position={[0, -0.25, 0.08]}
        fontSize={0.13}
        color={color}
        font={undefined}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.005}
        outlineColor="#000"
      >
        {label}
      </Text>

      {/* Emoji / symbol */}
      <Text
        position={[0, 0.1, 0.08]}
        fontSize={0.28}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {emoji}
      </Text>
    </group>
  );
}

function GlowParticles() {
  const count = 60;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 6;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 4 - 1;
    }
    return arr;
  }, []);

  const ref = useRef();
  useFrame((s) => {
    if (ref.current) ref.current.rotation.y += 0.001;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#00D4FF" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

export default function SkillCubes() {
  return (
    <div style={{ width: '100%', height: '380px' }}>
      <Canvas
        camera={{ position: [0, 0, 7], fov: 58 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[0, 4, 4]} intensity={1.5} color="#00D4FF" />
        <pointLight position={[0, -4, 4]} intensity={1} color="#7C3AED" />
        <pointLight position={[4, 0, 2]} intensity={0.8} color="#F59E0B" />
        <GlowParticles />
        <Suspense fallback={null}>
          {TECH_ICONS.map((tech, i) => (
            <Float
              key={tech.label}
              speed={1.2}
              rotationIntensity={0.1}
              floatIntensity={0.3}
            >
              <TechIcon {...tech} index={i} />
            </Float>
          ))}
        </Suspense>
      </Canvas>
    </div>
  );
}
