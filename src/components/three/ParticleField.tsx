import { Stars } from '@react-three/drei';

export function ParticleField() {
  return (
    <Stars 
      radius={50} 
      depth={50} 
      count={4000} 
      factor={4} 
      saturation={0} 
      fade 
      speed={1} 
    />
  );
}
