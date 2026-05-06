import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Professional data-stream / neural-network helix
function NeuralHelix() {
  const group = useRef();
  const particlesRef = useRef([]);
  const linesRef = useRef([]);

  const { nodes, connections } = useMemo(() => {
    const nodes = [];
    const turns = 5;
    const ppt = 10; // points per turn
    const total = turns * ppt;
    const height = 7;

    for (let i = 0; i <= total; i++) {
      const t = i / total;
      const angle = t * turns * Math.PI * 2;
      const y = t * height - height / 2;
      const r = 1.1;

      nodes.push({
        a: new THREE.Vector3(Math.cos(angle) * r, y, Math.sin(angle) * r),
        b: new THREE.Vector3(Math.cos(angle + Math.PI) * r, y, Math.sin(angle + Math.PI) * r),
        t,
      });
    }

    // Rung connections every 5 nodes
    const connections = [];
    for (let i = 0; i < nodes.length; i += 5) {
      connections.push(i);
    }
    return { nodes, connections };
  }, []);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y += 0.005;
    // Pulse effect
    const t = state.clock.getElapsedTime();
    particlesRef.current.forEach((mesh, i) => {
      if (!mesh) return;
      const pulse = Math.sin(t * 2 + i * 0.3) * 0.15 + 1;
      mesh.scale.setScalar(pulse);
    });
  });

  return (
    <group ref={group}>
      {nodes.map((node, i) => {
        const colorA = new THREE.Color().setHSL(0.55 + node.t * 0.2, 1, 0.6);
        const colorB = new THREE.Color().setHSL(0.75 + node.t * 0.15, 1, 0.55);
        return (
          <group key={i}>
            {/* Strand A */}
            <mesh
              ref={(el) => { if (el) particlesRef.current[i * 2] = el; }}
              position={[node.a.x, node.a.y, node.a.z]}
            >
              <sphereGeometry args={[0.055, 8, 8]} />
              <meshStandardMaterial
                color={colorA}
                emissive={colorA}
                emissiveIntensity={1.2}
                roughness={0.1}
                metalness={0.8}
              />
            </mesh>

            {/* Strand B */}
            <mesh
              ref={(el) => { if (el) particlesRef.current[i * 2 + 1] = el; }}
              position={[node.b.x, node.b.y, node.b.z]}
            >
              <sphereGeometry args={[0.055, 8, 8]} />
              <meshStandardMaterial
                color={colorB}
                emissive={colorB}
                emissiveIntensity={1.2}
                roughness={0.1}
                metalness={0.8}
              />
            </mesh>

            {/* Connect consecutive nodes with thin tubes */}
            {i > 0 && i < nodes.length && (
              <>
                <StrandLine from={nodes[i - 1].a} to={node.a} color={colorA} />
                <StrandLine from={nodes[i - 1].b} to={node.b} color={colorB} />
              </>
            )}

            {/* Rungs */}
            {connections.includes(i) && (
              <RungConnector from={node.a} to={node.b} progress={node.t} />
            )}
          </group>
        );
      })}
    </group>
  );
}

function StrandLine({ from, to, color }) {
  const points = useMemo(() => [from, to], [from, to]);
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry().setFromPoints(points);
    return g;
  }, [points]);

  return (
    <line geometry={geometry}>
      <lineBasicMaterial color={color} opacity={0.6} transparent linewidth={1} />
    </line>
  );
}

function RungConnector({ from, to, progress }) {
  const points = useMemo(() => [from, to], [from, to]);
  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);
  const midColor = new THREE.Color().setHSL(0.14 + progress * 0.1, 1, 0.6); // gold-ish

  return (
    <group>
      <line geometry={geometry}>
        <lineBasicMaterial color={midColor} opacity={0.5} transparent />
      </line>
      {/* Mid-point diamond */}
      <mesh position={[(from.x + to.x) / 2, (from.y + to.y) / 2, (from.z + to.z) / 2]}>
        <octahedronGeometry args={[0.06, 0]} />
        <meshStandardMaterial color={midColor} emissive={midColor} emissiveIntensity={1.5} />
      </mesh>
    </group>
  );
}

export default function DNAHelix() {
  return (
    <div style={{ width: '100%', height: '420px' }}>
      <Canvas
        camera={{ position: [4, 0, 4], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.1} />
        <pointLight position={[3, 3, 3]} intensity={2} color="#00D4FF" />
        <pointLight position={[-3, -3, 3]} intensity={1.5} color="#7C3AED" />
        <pointLight position={[0, 0, -3]} intensity={0.8} color="#F59E0B" />
        <NeuralHelix />
      </Canvas>
    </div>
  );
}
