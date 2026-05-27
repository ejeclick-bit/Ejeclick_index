import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { FloatingShapes } from './FloatingShapes';
import { ParticleField } from './ParticleField';

function useMobile() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return isMobile;
}

export function Scene3D() {
  const isMobile = useMobile();

  return (
    <div className="absolute inset-0 z-0 h-full w-full pointer-events-none" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={isMobile ? [1, 1.2] : [1, 2]}
        gl={{
          powerPreference: 'high-performance',
          antialias: !isMobile,
          alpha: false,
        }}
      >
        <color attach="background" args={['#0A0F1A']} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        <Suspense fallback={null}>
          <FloatingShapes />
          {!isMobile && (
            <>
              <ParticleField />
              <EffectComposer enableNormalPass={false}>
                <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.2} />
              </EffectComposer>
            </>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
