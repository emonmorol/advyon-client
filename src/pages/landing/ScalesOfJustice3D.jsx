import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

/* ───────── Deep Teal wireframe material shared by the whole model ───────── */
const tealWire = new THREE.MeshPhongMaterial({
  color: 0x5cdbd6,   // --teal-bright
  wireframe: true,
  transparent: true,
  opacity: 0.35,
});

const tealGlow = new THREE.MeshPhongMaterial({
  color: 0x3a7573,   // --teal-accent
  emissive: 0x5cdbd6,
  transparent: true,
  opacity: 0.2,
});

/* ───────── Animated Particle field ───────── */
function Particles({ count = 400 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) arr[i] = (Math.random() - 0.5) * 22;
    return arr;
  }, [count]);

  useFrame(() => {
    if (ref.current) ref.current.rotation.y -= 0.0003;
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
      <pointsMaterial size={0.04} color={0x5cdbd6} transparent opacity={0.5} />
    </points>
  );
}

/* ───────── The Scales model ───────── */
function ScalesModel() {
  const groupRef = useRef();
  const beamGroupRef = useRef();
  const leftBowlRef = useRef();
  const rightBowlRef = useRef();
  const currentTilt = useRef(0);

  // Track mouse for interactive tilt
  useFrame(({ clock, pointer }) => {
    const time = clock.getElapsedTime();

    // Normalise pointer (-1 … 1) → tilt
    const targetTilt = -pointer.x * 0.4;
    currentTilt.current += (targetTilt - currentTilt.current) * 0.03;

    const ambientRock = Math.sin(time * 0.5) * 0.05;
    const finalZ = currentTilt.current + ambientRock;

    // Rotate beam
    if (beamGroupRef.current) {
      beamGroupRef.current.rotation.z += (finalZ - beamGroupRef.current.rotation.z) * 0.03;

      // Counter‑rotate bowls so they hang vertically
      if (leftBowlRef.current) leftBowlRef.current.rotation.z = -beamGroupRef.current.rotation.z;
      if (rightBowlRef.current) rightBowlRef.current.rotation.z = -beamGroupRef.current.rotation.z;
    }

    // Slow auto rotate
    if (groupRef.current) groupRef.current.rotation.y += 0.002;
  });

  return (
    <group ref={groupRef}>
      {/* Base */}
      <mesh material={tealWire} position={[0, -2.5, 0]}>
        <cylinderGeometry args={[0.8, 1, 0.3, 32]} />
      </mesh>

      {/* Pole */}
      <mesh material={tealWire} position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 4.5, 32]} />
      </mesh>

      {/* Beam group (tilts) */}
      <group ref={beamGroupRef} position={[0, 1.8, 0]}>
        {/* Beam bar */}
        <mesh material={tealWire} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.05, 5, 32]} />
        </mesh>

        {/* Left bowl */}
        <mesh ref={leftBowlRef} material={tealWire} position={[-2.5, -1.2, 0]} rotation={[Math.PI, 0, 0]}>
          <sphereGeometry args={[0.7, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        </mesh>

        {/* Right bowl */}
        <mesh ref={rightBowlRef} material={tealWire} position={[2.5, -1.2, 0]} rotation={[Math.PI, 0, 0]}>
          <sphereGeometry args={[0.7, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        </mesh>

        {/* Center glow orb */}
        <mesh material={tealGlow}>
          <sphereGeometry args={[0.5, 32, 32]} />
        </mesh>
      </group>
    </group>
  );
}

/* ───────── Exported full‑screen 3D canvas ───────── */
export default function ScalesOfJustice3D() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 60 }}
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight color={0x0e2d2c} intensity={1.5} />
        <pointLight color={0x5cdbd6} intensity={2} distance={60} position={[10, 10, 10]} />
        <Float speed={0.4} floatIntensity={0.3} rotationIntensity={0.1}>
          <ScalesModel />
        </Float>
        <Particles />
      </Canvas>
    </div>
  );
}
