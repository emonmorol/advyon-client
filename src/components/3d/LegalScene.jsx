import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Float,
  MeshTransmissionMaterial,
  MeshDistortMaterial,
  Stars,
  Sphere,
  Sparkles,
  Text, 
  OrbitControls,
  Instance,
  Instances
} from "@react-three/drei";
import { EffectComposer, Bloom, Noise, Vignette } from "@react-three/postprocessing";
import { useRef, useMemo, useState } from "react";
import * as THREE from "three";

const AICore = () => {
    const mesh = useRef();
    
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (mesh.current) {
            mesh.current.distort = 0.4 + Math.sin(t) * 0.1;
        }
    });

    return (
        <group scale={1.8}>
            <Sphere ref={mesh} args={[1, 64, 64]}>
                <MeshDistortMaterial 
                    color="#5CDBD6" 
                    envMapIntensity={1} 
                    clearcoat={1} 
                    clearcoatRoughness={0} 
                    metalness={0.1} 
                    roughness={0.1}
                    distort={0.4}
                    speed={2} 
                />
            </Sphere>
            {/* Inner Glow Polish */}
            <mesh scale={0.9}>
                 <sphereGeometry args={[1, 32, 32]} />
                 <meshBasicMaterial color="#F5B342" wireframe transparent opacity={0.05} />
            </mesh>
        </group>
    );
};

// Helper for spherical distribution
const getSphericalPos = (radius) => {
    const phi = Math.acos(-1 + (2 * Math.random()));
    const theta = Math.sqrt(Math.PI * 150) * phi;
    return new THREE.Vector3(
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi)
    );
}

const LawSymbols = () => {
  return (
    <group>
      {[...Array(8)].map((_, i) => {
        const pos = getSphericalPos(6); // Spherical distribution radius 6
        return (
            <Float key={i} speed={2} rotationIntensity={2} floatIntensity={1} position={pos}>
                <Text
                    fontSize={Math.random() > 0.5 ? 0.8 : 1.2}
                    color="#5CDBD6"
                    font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
                    characters="§¶"
                    maxWidth={10}
                    textAlign="center"
                    anchorX="center"
                    anchorY="middle"
                >
                    {i % 2 === 0 ? "§" : "¶"}
                    <meshBasicMaterial color="#5CDBD6" toneMapped={false} transparent opacity={0.6} />
                </Text>
            </Float>
        )
      })}
    </group>
  )
}

// Particle that avoids mouse
const InteractiveParticles = ({ count = 100 }) => {
    const { viewport, mouse } = useThree();
    const mesh = useRef();
    
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
           const t = Math.random() * 100;
           const factor = 20 + Math.random() * 100;
           const speed = 0.005 + Math.random() / 500; // MUCH Slower speed
           const x = (Math.random() - 0.5) * 15;
           const y = (Math.random() - 0.5) * 15;
           const z = (Math.random() - 0.5) * 15;
           
           temp.push({ t, factor, speed, x, y, z, mx: 0, my: 0 });
        }
        return temp;
    }, [count]);

    useFrame((state) => {
        // Run thought the particles
        particles.forEach((particle, i) => {
            let { t, factor, speed, x, y, z } = particle;
            
            // Basic movement
            t = particle.t += speed / 2;
            const a = Math.cos(t) + Math.sin(t * 1) / 10;
            const b = Math.sin(t) + Math.cos(t * 2) / 10;
            const s = Math.cos(t);

            // Mouse repulsion
            // We need to convert mouse (normalized -1 to 1) to world space roughly
            // Or project particle to specific plane. 
            // Simplified: Assume mouse controls a force field at z=0 plane but extending in depth
            const mouseX = (mouse.x * viewport.width) / 2;
            const mouseY = (mouse.y * viewport.height) / 2;
            
            // Distance from 'home' position to mouse
            const dist = Math.sqrt(Math.pow(x - mouseX, 2) + Math.pow(y - mouseY, 2));
            
            // If close, push away
             if (dist < 4) {
                 const angle = Math.atan2(y - mouseY, x - mouseX);
                 const force = (4 - dist) * 0.5; // smoother force
                 x += Math.cos(angle) * force;
                 y += Math.sin(angle) * force;
             }

            // Update instance
            dummy.position.set(
                x + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
                y + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
                z + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
            );
            
            dummy.scale.set(s, s, s);
            dummy.rotation.set(s * 5, s * 5, s * 5);
            dummy.updateMatrix();
            
            mesh.current.setMatrixAt(i, dummy.matrix);
        });
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[null, null, count]}>
            <sphereGeometry args={[0.02, 8, 8]} /> {/* Tiny spheres - Reduced size */}
            <meshBasicMaterial color="#5CDBD6" transparent opacity={0.4} />
        </instancedMesh>
    );
};


const DataSwarm = () => {
    return (
        <group>
            {/* Slower Background Sparkles */}
            <Sparkles 
                count={100} 
                scale={15} 
                size={2} // Smaller stars
                speed={0.05} // Significantly slowed down
                opacity={0.4} 
                color="#5CDBD6"
            />
            {/* Gold Dust - Slower */}
            <Sparkles 
                count={60} 
                scale={12} 
                size={1.5} // Smaller gold dust
                speed={0.02} // Very slow drift
                opacity={0.3} 
                color="#F5B342"
            />
            
            {/* Interactive Swarm that avoids mouse */}
            <InteractiveParticles count={150} />

            {/* Floating Glass Documents - Spherical Distribution */}
             {[...Array(10)].map((_, i) => {
                 const pos = getSphericalPos(5);
                 return (
                    <Float key={i} speed={1.5} rotationIntensity={1.5} floatIntensity={1.5} position={pos}>
                        <mesh rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}>
                            <boxGeometry args={[0.6, 0.8, 0.02]} />
                            <meshPhysicalMaterial 
                                color="#fff" 
                                transmission={0.6} 
                                thickness={0.5} 
                                roughness={0.2} 
                                clearcoat={1}
                                transparent
                                opacity={0.2}
                            />
                        </mesh>
                    </Float>
                );
             })}

            {/* Large Floating Rings */}
            <group rotation={[Math.PI / 3, 0, 0]}>
                 <Float rotationIntensity={1} floatIntensity={0.5} speed={1}>
                    <mesh rotation={[Math.PI / 2, 0, 0]}>
                        <torusGeometry args={[3.5, 0.01, 16, 100]} />
                        <meshBasicMaterial color="#5CDBD6" transparent opacity={0.15} />
                    </mesh>
                 </Float>
            </group>
             <group rotation={[-Math.PI / 3, 0, 0]}>
                 <Float rotationIntensity={1} floatIntensity={0.5} speed={0.8}>
                    <mesh rotation={[Math.PI / 2, 0, 0]}>
                        <torusGeometry args={[4.5, 0.01, 16, 100]} />
                        <meshBasicMaterial color="#F5B342" transparent opacity={0.1} />
                    </mesh>
                 </Float>
            </group>
        </group>
    );
};


const LegalScene = () => {
  return (
    <div className="fixed inset-0 z-0 h-full w-full bg-[#002220]">
        <Canvas
            shadows
            camera={{ position: [0, 0, 9], fov: 45 }}
            eventSource={document.body}
        >
            <ambientLight intensity={0.5} color="#004d40" />
            <spotLight position={[10, 10, 10]} angle={0.25} penumbra={1} intensity={20} color="#cceeee" />
            <spotLight position={[-10, -10, -10]} angle={0.2} penumbra={1} intensity={10} color="#F5B342" />
            <Environment preset="city" />

            {/* OrbitControls: Stable "Rolling" around the Object */}
            <OrbitControls 
                target={[0, 0, 0]} // CRITICAL: Focus on the Scene Center (screen center)
                enableZoom={false} 
                enablePan={false} 
                enableDamping={true}
                dampingFactor={0.05}
                rotateSpeed={0.5}
                autoRotate
                autoRotateSpeed={0.5}
                minPolarAngle={Math.PI / 3}
                maxPolarAngle={Math.PI / 1.5}
            />

            {/* AI Core positioned to the Right (matching UI column) */}
            <group position={[2.5, 0, 0]}>
                <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                    <AICore />
                </Float>
                <DataSwarm />
                <LawSymbols />
            </group>

            <Stars radius={80} depth={50} count={6000} factor={4} saturation={0} fade speed={1} />

            <EffectComposer disableNormalPass>
                <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.0} radius={0.5} />
                <Noise opacity={0.03} />
                <Vignette eskil={false} offset={0.1} darkness={0.6} />
            </EffectComposer>
        </Canvas>
    </div>
  );
};



export default LegalScene;
