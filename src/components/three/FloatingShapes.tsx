import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  Cone,
  Octahedron,
  TorusKnot,
  Icosahedron,
  Box,
  Cylinder,
  MeshDistortMaterial,
} from '@react-three/drei';
import * as THREE from 'three';

interface Shape {
  ref: React.RefObject<THREE.Mesh | null>;
  component: 'cone' | 'octahedron' | 'torusKnot' | 'icosahedron' | 'box' | 'cylinder';
  color: string;
  emissive: string;
  emissiveIntensity: number;
  basePos: [number, number, number];
  orbit: { radius: number; speedX: number; speedY: number; phaseX: number; phaseY: number };
  scale: number;
  rotateSpeed: number;
  distort?: boolean;
}

const shapes: Omit<Shape, 'ref'>[] = [
  {
    component: 'cone',
    color: '#3B82F6',
    emissive: '#3B82F6',
    emissiveIntensity: 1.5,
    basePos: [-5, 2, -3],
    orbit: { radius: 3.5, speedX: 0.4, speedY: 0.3, phaseX: 0, phaseY: Math.PI / 2 },
    scale: 0.8,
    rotateSpeed: 0.02,
  },
  {
    component: 'octahedron',
    color: '#0EA5E9',
    emissive: '#0EA5E9',
    emissiveIntensity: 1.5,
    basePos: [5, -2, -2],
    orbit: { radius: 3, speedX: 0.35, speedY: 0.45, phaseX: Math.PI, phaseY: 0 },
    scale: 0.7,
    rotateSpeed: 0.015,
    distort: true,
  },
  {
    component: 'torusKnot',
    color: '#6366F1',
    emissive: '#6366F1',
    emissiveIntensity: 2,
    basePos: [0, -3, 1],
    orbit: { radius: 4, speedX: 0.25, speedY: 0.35, phaseX: Math.PI / 3, phaseY: Math.PI / 4 },
    scale: 0.6,
    rotateSpeed: 0.025,
  },
  {
    component: 'icosahedron',
    color: '#8B5CF6',
    emissive: '#8B5CF6',
    emissiveIntensity: 1.2,
    basePos: [-3, -1, -5],
    orbit: { radius: 5, speedX: 0.2, speedY: 0.5, phaseX: Math.PI / 2, phaseY: Math.PI / 3 },
    scale: 0.5,
    rotateSpeed: 0.01,
  },
  {
    component: 'box',
    color: '#06B6D4',
    emissive: '#06B6D4',
    emissiveIntensity: 1,
    basePos: [4, 3, -4],
    orbit: { radius: 4.5, speedX: 0.45, speedY: 0.2, phaseX: 0, phaseY: Math.PI / 5 },
    scale: 0.5,
    rotateSpeed: 0.02,
    distort: true,
  },
  {
    component: 'cylinder',
    color: '#F472B6',
    emissive: '#F472B6',
    emissiveIntensity: 0.8,
    basePos: [-4, -3, 2],
    orbit: { radius: 3.5, speedX: 0.3, speedY: 0.4, phaseX: Math.PI / 6, phaseY: Math.PI / 2 },
    scale: 0.5,
    rotateSpeed: 0.01,
  },
];

export function FloatingShapes() {
  const groupRef = useRef<THREE.Group>(null);
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state) => {
    if (groupRef.current) {
      const targetX = (state.pointer.x * Math.PI) / 10;
      const targetY = (state.pointer.y * Math.PI) / 10;
      groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.02;
      groupRef.current.rotation.x += (targetY - groupRef.current.rotation.x) * 0.02;
    }

    const t = state.clock.elapsedTime;
    meshRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const s = shapes[i];
      mesh.position.x = s.basePos[0] + Math.sin(t * s.orbit.speedX + s.orbit.phaseX) * s.orbit.radius;
      mesh.position.y = s.basePos[1] + Math.cos(t * s.orbit.speedY + s.orbit.phaseY) * s.orbit.radius;
      mesh.position.z = s.basePos[2] + Math.sin(t * s.orbit.speedX * 0.5 + s.orbit.phaseX) * s.orbit.radius * 0.5;
      mesh.rotation.x += s.rotateSpeed;
      mesh.rotation.y += s.rotateSpeed * 1.5;
    });
  });

  return (
    <group ref={groupRef}>
      {shapes.map((s, i) => {
        const Component =
          s.component === 'cone' ? Cone :
          s.component === 'octahedron' ? Octahedron :
          s.component === 'torusKnot' ? TorusKnot :
          s.component === 'icosahedron' ? Icosahedron :
          s.component === 'box' ? Box :
          Cylinder;

        return (
          <Component
            key={i}
            ref={(el: THREE.Mesh | null) => { meshRefs.current[i] = el; }}
            scale={s.scale}
          >
            {s.distort ? (
              <MeshDistortMaterial
                color={s.color}
                emissive={s.emissive}
                emissiveIntensity={s.emissiveIntensity}
                toneMapped={false}
                distort={0.4}
                speed={2}
              />
            ) : (
              <meshStandardMaterial
                color={s.color}
                emissive={s.emissive}
                emissiveIntensity={s.emissiveIntensity}
                toneMapped={false}
              />
            )}
          </Component>
        );
      })}
    </group>
  );
}
