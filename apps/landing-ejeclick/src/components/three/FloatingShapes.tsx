import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

function FastAPILogo({ color }: { color: string }) {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0.25);
    s.lineTo(-0.06, 0.08);
    s.lineTo(0.02, 0.08);
    s.lineTo(0, -0.2);
    s.lineTo(0.08, -0.02);
    s.lineTo(0, -0.02);
    s.lineTo(0, 0.25);
    return s;
  }, []);

  return (
    <group>
      <mesh rotation={[0, 0, 0]}>
        <ringGeometry args={[0.7, 1, 6]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh>
        <ringGeometry args={[0.7, 1, 6]} />
        <meshBasicMaterial wireframe color="#ffffff" transparent opacity={0.3} />
      </mesh>
      <mesh rotation={[0, 0, 0]} position={[0, 0, 0.05]}>
        <shapeGeometry args={[shape]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.5} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function CodeLines({ count = 6 }: { count?: number }) {
  const rows = useMemo(() => {
    const widths = [0.6, 0.3, 0.5, 0.7, 0.25, 0.4];
    const r: { offsets: number[]; width: number }[] = [];
    for (let i = 0; i < count; i++) {
      const cols = 4 + (i % 3);
      const offsets: number[] = [];
      let x = -2;
      for (let j = 0; j < cols; j++) {
        const w = widths[(i * cols + j) % widths.length];
        offsets.push(x);
        x += w + 0.1;
      }
      r.push({ offsets, width: 0.4 });
    }
    return r;
  }, [count]);

  const colors = ['#3B82F6', '#0EA5E9', '#8B5CF6', '#22C55E', '#F59E0B', '#EF4444'];
const opacities = [0.9, 0.7, 1.0, 0.8, 0.6, 0.95];

  return (
    <group position={[0, 0.5, 0]}>
      {rows.map((row, ri) => (
        <group key={ri} position={[-1.8, -ri * 0.25, 0]}>
          {row.offsets.map((x, ci) => (
            <mesh key={ci} position={[x + (0.4 / 2), 0, 0]}>
              <boxGeometry args={[0.4, 0.04, 0.04]} />
              <meshStandardMaterial
                color={colors[ci % colors.length]}
                emissive={colors[ci % colors.length]}
                emissiveIntensity={0.5}
                toneMapped={false}
                transparent
                opacity={opacities[ci % opacities.length]}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function GridStructure() {
  const gridPoints = useMemo(() => {
    const points: number[] = [];
    const size = 3;
    const divs = 6;
    for (let i = 0; i <= divs; i++) {
      const t = -size + (i / divs) * size * 2;
      points.push(t, -size, 0, t, size, 0);
      points.push(-size, t, 0, size, t, 0);
    }
    return new Float32Array(points);
  }, []);

  const gridGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(gridPoints, 3));
    return g;
  }, [gridPoints]);

  return (
    <group>
      <lineSegments geometry={gridGeom}>
        <lineBasicMaterial color="#0EA5E9" transparent opacity={0.3} />
      </lineSegments>
      {[0, 1, 2, 3, 4, 5].map((i) =>
        [0, 1, 2, 3, 4, 5].map((j) => {
          const x = -3 + (i / 5) * 6;
          const y = -3 + (j / 5) * 6;
          return (
            <mesh key={`${i}-${j}`} position={[x, y, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 0.4, 6]} />
              <meshStandardMaterial color="#0EA5E9" emissive="#0EA5E9" emissiveIntensity={0.3} toneMapped={false} transparent opacity={0.4} />
            </mesh>
          );
        }),
      )}
      {['hero', 'services', 'process', 'contact'].map((label, i) => (
        <mesh key={label} position={[-2.5 + i * 1.6, 1.8, 0.05]}>
          <planeGeometry args={[1.3, 0.4]} />
          <meshStandardMaterial color="#1E293B" transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

function BrowserUI() {
  const dotColors = ['#EF4444', '#F59E0B', '#22C55E'];
  return (
    <group>
      {/* Window frame */}
      <RoundedBox args={[3, 2.2, 0.06]} radius={0.1} smoothness={6}>
        <meshStandardMaterial color="#0A0F1A" emissive="#0A0F1A" emissiveIntensity={0.15} toneMapped={false} />
      </RoundedBox>

      {/* Window glow */}
      <RoundedBox args={[3, 2.2, 0.04]} radius={0.1} smoothness={6}>
        <meshStandardMaterial color="#1E293B" transparent opacity={0.5} side={THREE.BackSide} />
      </RoundedBox>

      {/* Title bar */}
      <mesh position={[0, 1, 0.07]}>
        <boxGeometry args={[2.9, 0.16, 0.02]} />
        <meshStandardMaterial color="#1E293B" emissive="#1E293B" emissiveIntensity={0.3} toneMapped={false} />
      </mesh>

      {/* Traffic lights */}
      {dotColors.map((color, i) => (
        <mesh key={i} position={[-1.25 + i * 0.15, 1, 0.1]}>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} toneMapped={false} />
        </mesh>
      ))}

      {/* URL bar */}
      <mesh position={[0.2, 0.78, 0.07]}>
        <planeGeometry args={[1.8, 0.1]} />
        <meshStandardMaterial color="#334155" emissive="#334155" emissiveIntensity={0.1} toneMapped={false} />
      </mesh>
      <mesh position={[-0.3, 0.78, 0.09]}>
        <planeGeometry args={[0.5, 0.04]} />
        <meshStandardMaterial color="#94A3B8" emissive="#94A3B8" emissiveIntensity={0.2} toneMapped={false} transparent opacity={0.6} />
      </mesh>
      <mesh position={[0.7, 0.78, 0.09]}>
        <planeGeometry args={[0.7, 0.04]} />
        <meshStandardMaterial color="#94A3B8" emissive="#94A3B8" emissiveIntensity={0.2} toneMapped={false} transparent opacity={0.6} />
      </mesh>

      {/* Hero section preview */}
      <mesh position={[0, 0.3, 0.07]}>
        <planeGeometry args={[2.6, 0.5]} />
        <meshStandardMaterial color="#0A0F1A" transparent opacity={0.6} />
      </mesh>

      {/* Heading line */}
      <mesh position={[-0.4, 0.5, 0.09]}>
        <planeGeometry args={[1.6, 0.06]} />
        <meshStandardMaterial color="#F8FAFC" emissive="#F8FAFC" emissiveIntensity={0.15} toneMapped={false} />
      </mesh>
      <mesh position={[-0.3, 0.38, 0.09]}>
        <planeGeometry args={[1.0, 0.04]} />
        <meshStandardMaterial color="#F8FAFC" emissive="#F8FAFC" emissiveIntensity={0.1} toneMapped={false} transparent opacity={0.5} />
      </mesh>

      {/* CTA button */}
      <mesh position={[0, 0.18, 0.09]}>
        <planeGeometry args={[0.7, 0.1]} />
        <meshStandardMaterial color="#3B82F6" emissive="#3B82F6" emissiveIntensity={0.6} toneMapped={false} />
      </mesh>

      {/* Features row */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[-0.8 + i * 0.8, -0.25, 0.07]}>
          <RoundedBox args={[0.6, 0.4, 0.03]} radius={0.04} smoothness={4}>
            <meshStandardMaterial
              color="#1E293B"
              emissive="#1E293B"
              emissiveIntensity={0.15}
              toneMapped={false}
            />
          </RoundedBox>
        </mesh>
      ))}

      {/* Feature icons */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[-0.8 + i * 0.8, -0.18, 0.09]}>
          <planeGeometry args={[0.12, 0.12]} />
          <meshStandardMaterial
            color={['#3B82F6', '#0EA5E9', '#6366F1'][i]}
            emissive={['#3B82F6', '#0EA5E9', '#6366F1'][i]}
            emissiveIntensity={0.5}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Feature text lines */}
      {[0, 1, 2].map((i) => (
        <mesh key={`t${i}`} position={[-0.8 + i * 0.8, -0.35, 0.09]}>
          <planeGeometry args={[0.35, 0.03]} />
          <meshStandardMaterial color="#64748B" emissive="#64748B" emissiveIntensity={0.1} toneMapped={false} transparent opacity={0.5} />
        </mesh>
      ))}

      {/* Bottom bar */}
      <mesh position={[0, -0.9, 0.07]}>
        <boxGeometry args={[2.9, 0.06, 0.02]} />
        <meshStandardMaterial color="#1E293B" emissive="#1E293B" emissiveIntensity={0.2} toneMapped={false} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

function LayerGroup({
  children,
  zOffset,
}: {
  children: React.ReactNode;
  zOffset: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.z = zOffset + Math.sin(state.clock.elapsedTime * 0.5 + zOffset) * 0.12;
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

export function FloatingShapes() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime;
      groupRef.current.rotation.y = Math.sin(t * 0.15) * 0.4;
      groupRef.current.rotation.x = Math.sin(t * 0.1) * 0.08;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <LayerGroup zOffset={-2}>
        <FastAPILogo color="#3B82F6" />
        <CodeLines count={6} />
        <pointLight position={[0, 0, 1]} color="#3B82F6" intensity={8} distance={6} decay={2} />
      </LayerGroup>

      <LayerGroup zOffset={0}>
        <GridStructure />
      </LayerGroup>

      <LayerGroup zOffset={2}>
        <BrowserUI />
      </LayerGroup>
    </group>
  );
}
