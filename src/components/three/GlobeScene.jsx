import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

function Globe() {
  const outerRef = useRef();
  const gridRef = useRef();
  const atmosphereRef = useRef();
  const dotGroupRef = useRef();
  const ringRef = useRef();

  // Egypt coordinates: lat 26°N, lon 30°E
  const lat = (26 * Math.PI) / 180;
  const lon = (30 * Math.PI) / 180;
  const R = 2.02;
  const egyptX = R * Math.cos(lat) * Math.sin(lon);
  const egyptY = R * Math.sin(lat);
  const egyptZ = R * Math.cos(lat) * Math.cos(lon);

  // Generate latitude/longitude grid points
  const gridPoints = useMemo(() => {
    const pts = [];
    // Latitude lines
    for (let lat = -80; lat <= 80; lat += 20) {
      const r = (lat * Math.PI) / 180;
      for (let lon = 0; lon <= 360; lon += 3) {
        const l = (lon * Math.PI) / 180;
        pts.push(new THREE.Vector3(
          2 * Math.cos(r) * Math.sin(l),
          2 * Math.sin(r),
          2 * Math.cos(r) * Math.cos(l)
        ));
      }
    }
    // Longitude lines
    for (let lon = 0; lon < 360; lon += 20) {
      const l = (lon * Math.PI) / 180;
      for (let lat = -90; lat <= 90; lat += 2) {
        const r = (lat * Math.PI) / 180;
        pts.push(new THREE.Vector3(
          2 * Math.cos(r) * Math.sin(l),
          2 * Math.sin(r),
          2 * Math.cos(r) * Math.cos(l)
        ));
      }
    }
    return pts;
  }, []);

  const gridPositions = useMemo(() => {
    const arr = new Float32Array(gridPoints.length * 3);
    gridPoints.forEach((p, i) => {
      arr[i * 3] = p.x;
      arr[i * 3 + 1] = p.y;
      arr[i * 3 + 2] = p.z;
    });
    return arr;
  }, [gridPoints]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (outerRef.current) outerRef.current.rotation.y += 0.004;
    if (gridRef.current) gridRef.current.rotation.y += 0.004;
    if (dotGroupRef.current) dotGroupRef.current.rotation.y += 0.004;
    if (atmosphereRef.current) {
      atmosphereRef.current.material.opacity = 0.06 + Math.sin(t * 0.5) * 0.02;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.008;
      ringRef.current.scale.setScalar(1 + Math.sin(t * 1.5) * 0.03);
    }
  });

  return (
    <>
      {/* Core sphere - dark ocean */}
      <mesh>
        <sphereGeometry args={[1.96, 48, 48]} />
        <meshStandardMaterial
          color="#030d1a"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Outer wire sphere */}
      <mesh ref={outerRef}>
        <sphereGeometry args={[2.0, 36, 18]} />
        <meshBasicMaterial
          color="#00D4FF"
          wireframe
          transparent
          opacity={0.08}
        />
      </mesh>

      {/* Lat/lon dot grid */}
      <points ref={gridRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={gridPositions}
            count={gridPoints.length}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.018} color="#00D4FF" transparent opacity={0.35} sizeAttenuation />
      </points>

      {/* Egypt marker group */}
      <group ref={dotGroupRef}>
        {/* Glowing dot */}
        <mesh position={[egyptX, egyptY, egyptZ]}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshStandardMaterial
            color="#EF4444"
            emissive="#EF4444"
            emissiveIntensity={3}
            roughness={0}
          />
        </mesh>
        {/* Outer ring */}
        <mesh position={[egyptX, egyptY, egyptZ]}>
          <torusGeometry args={[0.12, 0.012, 8, 32]} />
          <meshBasicMaterial color="#EF4444" transparent opacity={0.8} />
        </mesh>
        {/* Pulse ring */}
        <mesh position={[egyptX, egyptY, egyptZ]} ref={ringRef}>
          <torusGeometry args={[0.2, 0.006, 8, 32]} />
          <meshBasicMaterial color="#EF4444" transparent opacity={0.4} />
        </mesh>
      </group>

      {/* Atmosphere glow */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[2.25, 32, 32]} />
        <meshBasicMaterial
          color="#00D4FF"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Equatorial ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.35, 0.008, 4, 80]} />
        <meshBasicMaterial color="#7C3AED" transparent opacity={0.3} />
      </mesh>
    </>
  );
}

export default function GlobeScene() {
  return (
    <div style={{ width: '100%', height: '360px' }}>
      <Canvas
        camera={{ position: [0, 1.5, 5.5], fov: 42 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.15} />
        <pointLight position={[6, 4, 6]} intensity={2} color="#00D4FF" />
        <pointLight position={[-4, -4, -4]} intensity={0.8} color="#7C3AED" />
        <directionalLight position={[3, 3, 3]} intensity={0.5} color="#ffffff" />
        <Stars radius={80} depth={50} count={2000} factor={2} fade speed={0.3} />
        <Globe />
      </Canvas>
    </div>
  );
}
