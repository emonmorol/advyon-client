import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Float,
  MeshTransmissionMaterial,
  Stars,
  Text, // kept for potential use
  useGLTF, // kept for potential use
} from "@react-three/drei";
import { EffectComposer, Bloom, Noise, Vignette } from "@react-three/postprocessing";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function DigitalGem() {
  const meshRef = useRef();
  const wireframeRef = useRef();
  
  useFrame((state, delta) => {
    if (meshRef.current) {
        meshRef.current.rotation.x -= delta * 0.2;
        meshRef.current.rotation.y -= delta * 0.15;
    }
    if (wireframeRef.current) {
        wireframeRef.current.rotation.x += delta * 0.1;
        wireframeRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <Float rotationIntensity={1} floatIntensity={2} speed={1.5}>
      <group scale={2.5}>
        {/* Inner Crystal */}
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1, 0]} />
          <MeshTransmissionMaterial
            backside
            backsideThickness={5}
            thickness={2}
            roughness={0.1}
            chromaticAberration={0.1}
            anisotropy={0.3}
            distortion={1} // High distortion for "gem" look
            distortionScale={0.5}
            temporalDistortion={0.2}
            iridescence={1}
            iridescenceIOR={1}
            iridescenceThicknessRange={[0, 1400]}
            color="#5CDBD6" // Bright Teal
            bg="#002220" // Dark Green
            resolution={1024}
          />
        </mesh>
        
        {/* Outer Wireframe */}
        <mesh ref={wireframeRef} scale={1.2}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial color="#E59500" wireframe transparent opacity={0.15} />
        </mesh>
      </group>
    </Float>
  );
}

function Rig() {
    const { camera, pointer } = useThree()
    const vec = new THREE.Vector3()

    useFrame(() => {
        // More stronger, noticeable parallax
        // Moves camera opposite to mouse
        camera.position.lerp(vec.set(-pointer.x * 4, -pointer.y * 4, camera.position.z), 0.05)
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
            eventSource={document.body} // Ensure it captures events even with overlays
        >
            {/* Lighting & Environment */}
            <ambientLight intensity={0.4} color="#004d40" />
            <spotLight position={[20, 20, 20]} angle={0.2} penumbra={1} intensity={25} color="#cceeee" />
            <spotLight position={[-20, -10, 10]} angle={0.2} penumbra={1} intensity={15} color="#E59500" />
            
            {/* Deep Green Environment */}
             <color attach="background" args={['#002220']} /> 
             {/* Note: background attribute on Canvas or color attach="background" works */}

            {/* Objects */}
            <group position={[3.5, 0, 0]}> {/* Position Right */}
                <DigitalGem />
            </group>

             {/* Stars - High Density */}
            <Stars radius={80} depth={50} count={8000} factor={4} saturation={1} fade speed={1.5} />

            {/* Interactions */}
            <Rig />
            
            {/* Post Processing */}
            <EffectComposer disableNormalPass>
                <Bloom luminanceThreshold={0.8} mipmapBlur intensity={1.5} radius={0.3} />
                <Noise opacity={0.08} />
                <Vignette eskil={false} offset={0.1} darkness={0.8} />
            </EffectComposer>
        </Canvas>
    </div>
  );
};

export default LegalScene;
