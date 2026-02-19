import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Float,
  MeshTransmissionMaterial,
  MeshDistortMaterial,
  Stars,
  Sphere,
  Sparkles,
  Text, // kept for potential use
  useGLTF, // kept for potential use
} from "@react-three/drei";
import { EffectComposer, Bloom, Noise, Vignette } from "@react-three/postprocessing";
import { useRef, useMemo } from "react";
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

const LawSymbols = () => {
  return (
    <group>
      {[...Array(6)].map((_, i) => (
        <Float key={i} speed={2} rotationIntensity={2} floatIntensity={1} position={[
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 6
        ]}>
            <Text
                fontSize={i % 2 === 0 ? 0.8 : 1.2}
                color="#5CDBD6"
                font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
                characters="§¶"
            >
                {i % 2 === 0 ? "§" : "¶"}
                <meshBasicMaterial color="#5CDBD6" toneMapped={false} transparent opacity={0.6} />
            </Text>
        </Float>
      ))}
    </group>
  )
}

const DataSwarm = () => {
    return (
        <group>
            {/* Primary Data Stream */}
            <Sparkles 
                count={150} 
                scale={12} 
                size={4} 
                speed={0.4} 
                opacity={0.8} 
                color="#5CDBD6"
            />
            {/* Secondary Gold Dust */}
            <Sparkles 
                count={80} 
                scale={10} 
                size={2} 
                speed={0.2} 
                opacity={0.5} 
                color="#F5B342"
            />
            
            {/* Floating Glass Documents */}
             {[...Array(8)].map((_, i) => (
                <Float key={i} speed={1.5} rotationIntensity={1.5} floatIntensity={1.5} position={[
                    (Math.random() - 0.5) * 9,
                    (Math.random() - 0.5) * 7,
                    (Math.random() - 0.5) * 5
                ]}>
                    <mesh rotation={[Math.random(), Math.random(), 0]}>
                        <boxGeometry args={[0.6, 0.8, 0.02]} /> {/* Document Shape */}
                        <meshPhysicalMaterial 
                            color="#fff" 
                            transmission={0.6} 
                            thickness={0.5} 
                            roughness={0.2} 
                            clearcoat={1}
                            transparent
                            opacity={0.3}
                        />
                         {/* Text Lines Hint */}
                         <mesh position={[0, 0, 0.011]}>
                            <planeGeometry args={[0.4, 0.02]} />
                            <meshBasicMaterial color="#5CDBD6" transparent opacity={0.5} />
                         </mesh>
                         <mesh position={[0, 0.2, 0.011]}>
                            <planeGeometry args={[0.4, 0.02]} />
                            <meshBasicMaterial color="#5CDBD6" transparent opacity={0.5} />
                         </mesh>
                         <mesh position={[0, -0.2, 0.011]}>
                            <planeGeometry args={[0.4, 0.02]} />
                            <meshBasicMaterial color="#5CDBD6" transparent opacity={0.5} />
                         </mesh>
                    </mesh>
                </Float>
            ))}

            {/* Floating Rings */}
            <group rotation={[Math.PI / 3, 0, 0]}>
                 <Float rotationIntensity={1} floatIntensity={0.5} speed={2}>
                    <mesh rotation={[Math.PI / 2, 0, 0]}>
                        <torusGeometry args={[3.5, 0.01, 16, 100]} />
                        <meshBasicMaterial color="#5CDBD6" transparent opacity={0.15} />
                    </mesh>
                 </Float>
            </group>
             <group rotation={[-Math.PI / 3, 0, 0]}>
                 <Float rotationIntensity={1} floatIntensity={0.5} speed={1.5}>
                    <mesh rotation={[Math.PI / 2, 0, 0]}>
                        <torusGeometry args={[4.5, 0.01, 16, 100]} />
                        <meshBasicMaterial color="#F5B342" transparent opacity={0.1} />
                    </mesh>
                 </Float>
            </group>
        </group>
    );
};

function Rig() {
    const { camera, pointer } = useThree()
    const vec = new THREE.Vector3()

    useFrame(() => {
        camera.position.lerp(vec.set(-pointer.x * 2, -pointer.y * 2, 9), 0.05)
        camera.lookAt(0, 0, 0)
    })
    return null
}

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

            {/* Centered AI Core with Legal Context */}
            <group position={[3.5, 0, 0]}>
                <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                    <AICore />
                </Float>
                <DataSwarm />
                <LawSymbols />
            </group>

            <Stars radius={80} depth={50} count={6000} factor={4} saturation={0} fade speed={1} />
            <Rig />
            
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
