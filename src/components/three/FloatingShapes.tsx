import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Torus, Sphere, Dodecahedron, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface Shape {
  ref: React.RefObject<THREE.Mesh | null>;
  geometry: 'torus' | 'sphere' | 'dodecahedron';
  color: string;
  emissive: string;
  emissiveIntensity: number;
  basePos: [number, number, number];
  orbit: { radius: number; speedX: number; speedY: number; phaseX: number; phaseY: number };
  scale: number;
  distort?: boolean;
}

export function FloatingShapes() {
  const groupRef = useRef<THREE.Group>(null);

  const shapes: Shape[] = [
    {
      ref: useRef<THREE.Mesh>(null),
      geometry: 'torus',
      color: '#3B82F6',
      emissive: '#3B82F6',
      emissiveIntensity: 1.5,
      basePos: [-5, 2, -3],
      orbit: { radius: 3.5, speedX: 0.4, speedY: 0.3, phaseX: 0, phaseY: Math.PI / 2 },
      scale: 1,
    },
    {
      ref: useRef<THREE.Mesh>(null),
      geometry: 'sphere',
      color: '#0EA5E9',
      emissive: '#0EA5E9',
      emissiveIntensity: 1.5,
      basePos: [5, -2, -2],
      orbit: { radius: 3, speedX: 0.35, speedY: 0.45, phaseX: Math.PI, phaseY: 0 },
      scale: 1,
      distort: true,
    },
    {
      ref: useRef<THREE.Mesh>(null),
      geometry: 'dodecahedron',
      color: '#6366F1',
      emissive: '#6366F1',
      emissiveIntensity: 2,
      basePos: [0, -3, 1],
      orbit: { radius: 4, speedX: 0.25, speedY: 0.35, phaseX: Math.PI / 3, phaseY: Math.PI / 4 },
      scale: 1,
    },
    {
      ref: useRef<THREE.Mesh>(null),
      geometry: 'torus',
      color: '#8B5CF6',
      emissive: '#8B5CF6',
      emissiveIntensity: 1.2,
      basePos: [-3, -1, -5],
      orbit: { radius: 5, speedX: 0.2, speedY: 0.5, phaseX: Math.PI / 2, phaseY: Math.PI / 3 },
      scale: 0.7,
    },
    {
      ref: useRef<THREE.Mesh>(null),
      geometry: 'sphere',
      color: '#06B6D4',
      emissive: '#06B6D4',
      emissiveIntensity: 1,
      basePos: [4, 3, -4],
      orbit: { radius: 4.5, speedX: 0.45, speedY: 0.2, phaseX: 0, phaseY: Math.PI / 5 },
      scale: 0.6,
      distort: true,
    },
    {
      ref: useRef<THREE.Mesh>(null),
      geometry: 'dodecahedron',
      color: '#F472B6',
      emissive: '#F472B6',
      emissiveIntensity: 0.8,
      basePos: [-4, -3, 2],
      orbit: { radius: 3.5, speedX: 0.3, speedY: 0.4, phaseX: Math.PI / 6, phaseY: Math.PI / 2 },
      scale: 0.5,
    },
  ];

  useFrame((state) => {
    if (groupRef.current) {
      const targetX = (state.pointer.x * Math.PI) / 10;
      const targetY = (state.pointer.y * Math.PI) / 10;
      groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.02;
      groupRef.current.rotation.x += (targetY - groupRef.current.rotation.x) * 0.02;
    }

    const t = state.clock.elapsedTime;
    shapes.forEach((shape) => {
      if (shape.ref.current) {
        shape.ref.current.position.x =
          shape.basePos[0] + Math.sin(t * shape.orbit.speedX + shape.orbit.phaseX) * shape.orbit.radius;
        shape.ref.current.position.y =
          shape.basePos[1] + Math.cos(t * shape.orbit.speedY + shape.orbit.phaseY) * shape.orbit.radius;
        shape.ref.current.position.z =
          shape.basePos[2] + Math.sin(t * shape.orbit.speedX * 0.5 + shape.orbit.phaseX) * shape.orbit.radius * 0.5;
        shape.ref.current.rotation.x += 0.01;
        shape.ref.current.rotation.y += 0.02;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {shapes.map((shape, i) => (
        <mesh
          key={i}
          ref={shape.ref}
          scale={shape.scale}
        >
          {shape.geometry === 'torus' && <Torus args={[0.8, 0.2, 16, 100]} />}
          {shape.geometry === 'sphere' && <Sphere args={[0.9, 64, 64]} />}
          {shape.geometry === 'dodecahedron' && <Dodecahedron args={[0.7, 0]} />}
          {shape.distort ? (
            <MeshDistortMaterial
              color={shape.color}
              emissive={shape.emissive}
              emissiveIntensity={shape.emissiveIntensity}
              toneMapped={false}
              distort={0.4}
              speed={2}
            />
          ) : (
            <meshStandardMaterial
              color={shape.color}
              emissive={shape.emissive}
              emissiveIntensity={shape.emissiveIntensity}
              toneMapped={false}
            />
          )}
        </mesh>
      ))}
    </group>
  );
}
