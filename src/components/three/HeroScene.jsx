import { useRef, Suspense, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

const LOGOS = [
  { name: 'React',      icon: 'https://cdn.simpleicons.org/react/61DAFB',         orbitR: 3.8, speed: 0.55, tilt:  8,  phase: 0.0 },
  { name: 'TypeScript', icon: 'https://cdn.simpleicons.org/typescript/3178C6',    orbitR: 4.5, speed: 0.40, tilt:  28, phase: 1.3 },
  { name: 'Node.js',    icon: 'https://cdn.simpleicons.org/nodedotjs/339933',     orbitR: 4.0, speed: 0.50, tilt: -30, phase: 2.6 },
  { name: 'Firebase',   icon: 'https://cdn.simpleicons.org/firebase/FFCA28',      orbitR: 5.0, speed: 0.35, tilt:  48, phase: 3.8 },
  { name: 'Python',     icon: 'https://cdn.simpleicons.org/python/3776AB',        orbitR: 4.3, speed: 0.45, tilt: -52, phase: 0.6 },
  { name: 'MongoDB',    icon: 'https://cdn.simpleicons.org/mongodb/47A248',       orbitR: 5.2, speed: 0.30, tilt:  65, phase: 4.9 },
  { name: 'Docker',     icon: 'https://cdn.simpleicons.org/docker/2496ED',        orbitR: 4.7, speed: 0.42, tilt: -70, phase: 1.9 },
  { name: 'Git',        icon: 'https://cdn.simpleicons.org/git/F05032',           orbitR: 3.6, speed: 0.60, tilt:  80, phase: 5.5 },
  { name: 'HTML5',      icon: 'https://cdn.simpleicons.org/html5/E34F26',         orbitR: 4.1, speed: 0.48, tilt: -15, phase: 2.1 },
  { name: 'Sass',       icon: 'https://cdn.simpleicons.org/sass/CC6699',          orbitR: 5.4, speed: 0.28, tilt:  35, phase: 3.2 },
  { name: 'Bootstrap',  icon: 'https://cdn.simpleicons.org/bootstrap/7952B3',     orbitR: 3.5, speed: 0.65, tilt: -45, phase: 0.9 },
  { name: 'JavaScript', icon: 'https://cdn.simpleicons.org/javascript/F7DF1E',    orbitR: 4.9, speed: 0.38, tilt:  58, phase: 4.1 },
  { name: 'Tailwind',   icon: 'https://cdn.simpleicons.org/tailwindcss/06B6D4',   orbitR: 5.7, speed: 0.25, tilt: -62, phase: 1.5 },
];

const BOUNDARY  = 7.0;
const SPRING_K  = 0.014;
const DAMPING   = 0.87;
const SENS      = 0.005;

// ─── Load all textures OUTSIDE Canvas with error fallback ─────────────────────
function useTexturesSafe(logos) {
  const [textures, setTextures] = useState(null);
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    const fallback = () => {
      const c = document.createElement('canvas');
      c.width = c.height = 4;
      return new THREE.CanvasTexture(c);
    };
    Promise.all(
      logos.map(l => new Promise(resolve =>
        loader.load(l.icon, resolve, undefined, () => resolve(fallback()))
      ))
    ).then(setTextures);
  }, []);
  return textures;
}

function orbitPos(logo, t, out) {
  const tr = (logo.tilt * Math.PI) / 180;
  const a  = t * logo.speed + logo.phase;
  out.set(
    Math.cos(a) * logo.orbitR,
    Math.sin(tr) * Math.sin(a) * logo.orbitR,
    Math.cos(tr) * Math.sin(a) * logo.orbitR
  );
}

// ─── Scene (receives pre-loaded textures as prop) ─────────────────────────────
function Scene({ textures, sharedRef }) {
  const { camera, raycaster } = useThree();

  const sprRefs  = useRef(LOGOS.map(() => null));
  const wireRef  = useRef();
  const coreRef  = useRef();
  const globe    = useRef({ rx: 0.4, ry: 0, vx: 0, vy: 0 });
  const phys     = useRef(LOGOS.map(() => ({
    pos: new THREE.Vector3(), vel: new THREE.Vector3(),
    plane: new THREE.Plane(), init: false,
  })));

  const _orb = new THREE.Vector3();
  const _ndc = new THREE.Vector2();
  const _hit = new THREE.Vector3();

  useFrame(({ clock }) => {
    const t  = clock.getElapsedTime();
    const sh = sharedRef.current;

    // ── Globe rotation + inertia ─────────────────────────────
    const g = globe.current;
    if (sh.globeDrag) {
      g.vx = (sh.cy - sh.py) * SENS;
      g.vy = (sh.cx - sh.px) * SENS;
      sh.px = sh.cx; sh.py = sh.cy;
    } else {
      // Very slow dreamy drift — full rotation ~5 mins
      g.vx = g.vx * 0.99 + 0.00003;
      g.vy = g.vy * 0.99 + 0.00015;
    }
    g.rx += g.vx;
    g.ry += g.vy;

    if (wireRef.current) {
      wireRef.current.rotation.x = g.rx;
      wireRef.current.rotation.y = g.ry;
    }
    if (coreRef.current) {
      coreRef.current.material.emissiveIntensity = 0.4 + Math.sin(t * 1.8) * 0.2;
      coreRef.current.rotation.x = g.rx;
      coreRef.current.rotation.y = g.ry;
    }

    // ── Logo physics ─────────────────────────────────────────
    phys.current.forEach((ph, i) => {
      orbitPos(LOGOS[i], t, _orb);
      if (!ph.init) { ph.pos.copy(_orb); ph.init = true; }

      if (sh.logoDrag === i) {
        _ndc.set(sh.ndcX, sh.ndcY);
        raycaster.setFromCamera(_ndc, camera);
        if (raycaster.ray.intersectPlane(ph.plane, _hit)) {
          ph.vel.subVectors(_hit, ph.pos);
          ph.pos.copy(_hit);
        }
      } else {
        // Spring toward orbit + damping
        ph.vel.x += (_orb.x - ph.pos.x) * SPRING_K;
        ph.vel.y += (_orb.y - ph.pos.y) * SPRING_K;
        ph.vel.z += (_orb.z - ph.pos.z) * SPRING_K;
        ph.vel.multiplyScalar(DAMPING);
        ph.pos.add(ph.vel);
        // Elastic boundary bounce
        if (ph.pos.length() > BOUNDARY) {
          const n = ph.pos.clone().normalize();
          const dot = ph.vel.dot(n);
          if (dot > 0) { ph.vel.addScaledVector(n, -2.1 * dot); ph.vel.multiplyScalar(0.7); }
          ph.pos.setLength(BOUNDARY * 0.97);
        }
      }
      if (sprRefs.current[i]) sprRefs.current[i].position.copy(ph.pos);
    });
  });

  return (
    <>
      <Stars radius={110} depth={70} count={5000} factor={3.5} fade speed={0.35} />
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 0]} intensity={3} color="#00D4FF" distance={22} decay={2} />
      <pointLight position={[8, 6, 4]}  intensity={1.0} color="#00D4FF" />
      <pointLight position={[-8,-4, 4]} intensity={0.5} color="#7C3AED" />

      {/* Invisible hit sphere for globe drag */}
      <mesh
        onPointerDown={(e) => {
          e.stopPropagation();
          const sh = sharedRef.current;
          sh.globeDrag = true;
          sh.px = e.clientX; sh.py = e.clientY;
          sh.cx = e.clientX; sh.cy = e.clientY;
        }}
      >
        <sphereGeometry args={[2.5, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Wireframe globe — 36 segments = many lines, slow gentle spin */}
      <mesh ref={wireRef}>
        <sphereGeometry args={[2.5, 36, 36]} />
        <meshBasicMaterial color="#00D4FF" wireframe transparent opacity={0.18} />
      </mesh>

      {/* Pulsing core — rotates in sync with wireframe */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[1.8, 28, 28]} />
        <meshStandardMaterial
          color="#00D4FF"
          emissive={new THREE.Color('#00D4FF')}
          emissiveIntensity={0.5}
          transparent opacity={0.1}
        />
      </mesh>
      {LOGOS.map((logo, i) => (
        <sprite
          key={logo.name}
          ref={el => { sprRefs.current[i] = el; }}
          scale={[1.1, 1.1, 1]}
          onPointerDown={(e) => {
            e.stopPropagation();
            const sh = sharedRef.current;
            const ph = phys.current[i];
            sh.logoDrag = i;
            const n = camera.getWorldDirection(new THREE.Vector3()).negate();
            ph.plane.setFromNormalAndCoplanarPoint(n, ph.pos);
            ph.vel.set(0, 0, 0);
          }}
        >
          <spriteMaterial
            map={textures[i]}
            transparent
            alphaTest={0.04}
            depthWrite={false}
            sizeAttenuation
          />
        </sprite>
      ))}
    </>
  );
}

// ─── Exported component ───────────────────────────────────────────────────────
export default function HeroScene() {
  const textures = useTexturesSafe(LOGOS);

  const shared = useRef({
    globeDrag: false, logoDrag: -1,
    cx: 0, cy: 0, px: 0, py: 0,
    ndcX: 0, ndcY: 0,
  });

  // Show empty canvas while textures load (< 1s usually)
  if (!textures) return <div className="three-canvas-wrapper" />;

  return (
    <div className="three-canvas-wrapper" style={{ cursor: 'grab' }}>
      <Canvas
        camera={{ position: [0, 1, 10], fov: 62 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const sh = shared.current;
          sh.cx   = e.clientX; sh.cy = e.clientY;
          sh.ndcX =  ((e.clientX - r.left) / r.width)  * 2 - 1;
          sh.ndcY = -((e.clientY - r.top)  / r.height) * 2 + 1;
        }}
        onPointerUp={() => {
          shared.current.globeDrag = false;
          shared.current.logoDrag  = -1;
        }}
        onPointerLeave={() => {
          shared.current.globeDrag = false;
          shared.current.logoDrag  = -1;
        }}
      >
        <Suspense fallback={null}>
          <Scene textures={textures} sharedRef={shared} />
        </Suspense>
      </Canvas>
    </div>
  );
}
