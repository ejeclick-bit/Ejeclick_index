import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Torus, Sphere, Dodecahedron, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Material settings for the Bloom effect to pick up
const emissiveMaterialOpts = {
  color: "#3B82F6", // Primary
  emissive: "#3B82F6",
  emissiveIntensity: 1.5,
  toneMapped: false,
};

const violetMaterialOpts = {
  color: "#0EA5E9", // Secondary
  emissive: "#0EA5E9",
  emissiveIntensity: 1.5,
  toneMapped: false,
};

export function FloatingShapes() {
  const groupRef = useRef<THREE.Group>(null);

  // Subtle mouse tracking interaction
  useFrame((state) => {
    if (groupRef.current) {
      const targetX = (state.pointer.x * Math.PI) / 10;
      const targetY = (state.pointer.y * Math.PI) / 10;
      
      groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.05;
      groupRef.current.rotation.x += (targetY - groupRef.current.rotation.x) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Primary Torus */}
      <Float speed={2} rotationIntensity={1.5} floatIntensity={2} position={[-4, 1.5, -2]}>
        <Torus args={[0.8, 0.2, 16, 100]}>
          <meshStandardMaterial {...emissiveMaterialOpts} />
        </Torus>
      </Float>

      {/* Secondary Sphere with distortion */}
      <Float speed={1.5} rotationIntensity={1} floatIntensity={1.5} position={[3, -1, -1]}>
        <Sphere args={[0.9, 64, 64]}>
          <MeshDistortMaterial 
            {...violetMaterialOpts} 
            distort={0.4} 
            speed={2} 
          />
        </Sphere>
      </Float>

      {/* Tertiary Dodecahedron */}
      <Float speed={2.5} rotationIntensity={2} floatIntensity={2.5} position={[-2, -2, 1]}>
        <Dodecahedron args={[0.7, 0]}>
          <meshStandardMaterial 
            color="#6366F1" 
            emissive="#6366F1" 
            emissiveIntensity={2} 
            toneMapped={false} 
          />
        </Dodecahedron>
      </Float>
    </group>
  );
}
