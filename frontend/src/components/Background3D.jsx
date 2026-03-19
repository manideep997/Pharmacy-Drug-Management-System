import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, Stars, MeshDistortMaterial, Sphere } from '@react-three/drei';

const OrganicMolecule = ({ position, color, scale, speed, distort }) => {
  return (
    <Float speed={speed} rotationIntensity={1.5} floatIntensity={2} position={position}>
      <Sphere args={[1, 64, 64]} scale={scale}>
        <MeshDistortMaterial 
          color={color} 
          envMapIntensity={1} 
          clearcoat={1} 
          clearcoatRoughness={0.1} 
          metalness={0.8} 
          roughness={0.2} 
          distort={distort} 
          speed={speed} 
        />
      </Sphere>
    </Float>
  );
};

const AbstractPill = ({ color, position, rotation, scale = 1 }) => {
  const ref = useRef();
  
  useFrame((state) => {
    if (ref.current) {
        ref.current.rotation.x += 0.001;
        ref.current.rotation.y += 0.003;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={1.5} position={position}>
      <mesh ref={ref} rotation={rotation} scale={scale}>
        <capsuleGeometry args={[0.3, 1.2, 32, 32]} />
        <meshPhysicalMaterial 
            color={color} 
            transmission={0.9} 
            opacity={1} 
            metalness={0.2} 
            roughness={0.1} 
            ior={1.5} 
            thickness={0.5}
        />
      </mesh>
    </Float>
  );
};

const Background3D = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] bg-[#030712]">
      <Canvas camera={{ position: [0, 0, 12], fov: 50 }}>
        <ambientLight intensity={0.2} color="#ffffff" />
        <directionalLight position={[10, 10, 10]} intensity={1.5} color="#818cf8" />
        <pointLight position={[-10, -10, -10]} intensity={2} color="#c084fc" />
        <spotLight position={[0, 5, 5]} intensity={1} angle={0.4} penumbra={1} color="#38bdf8" />
        
        {/* Deep Space Starfield */}
        <Stars radius={50} depth={50} count={3000} factor={4} saturation={1} fade speed={1} />
        
        {/* Dynamic Dark Mode Molecular Elements */}
        {/* Centerpiece */ }
        <OrganicMolecule position={[0, 0, -5]} color="#4f46e5" scale={2.5} speed={2} distort={0.4} />
        
        {/* Background nodes */ }
        <OrganicMolecule position={[-6, 3, -10]} color="#7e22ce" scale={1.8} speed={1.5} distort={0.5} />
        <OrganicMolecule position={[7, -4, -12]} color="#0ea5e9" scale={2} speed={1} distort={0.3} />
        <OrganicMolecule position={[-5, -5, -8]} color="#0f766e" scale={1.2} speed={2.5} distort={0.6} />
        
        {/* Glass Pills floating in space */}
        <AbstractPill color="#3b82f6" position={[-3, 2, -2]} rotation={[0.4, 0.2, 0]} scale={0.7} />
        <AbstractPill color="#a855f7" position={[4, 1, -1]} rotation={[-0.4, -0.2, 0.5]} scale={0.9} />
        <AbstractPill color="#10b981" position={[1, -3, -3]} rotation={[0.1, 0.8, -0.2]} scale={0.6} />
        <AbstractPill color="#ec4899" position={[-4, -2, 0]} rotation={[-0.5, 0.4, 0.1]} scale={0.5} />

        <Environment preset="night" />
      </Canvas>
    </div>
  );
};

export default Background3D;
