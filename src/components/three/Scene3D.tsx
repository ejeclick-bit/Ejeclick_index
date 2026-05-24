import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { FloatingShapes } from './FloatingShapes';
import { ParticleField } from './ParticleField';

export function Scene3D() {
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile to optimize or disable heavy 3D effects
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // For high performance on mobile, we return null to let the CSS Aurora background take over.
  // Alternatively, we could render just the particles without Bloom.
  if (isMobile) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-0 h-full w-full pointer-events-none">
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 2]} // limit pixel ratio for performance
        frameloop="demand" // Only render on updates
        gl={{ powerPreference: "high-performance", antialias: false }}
      >
        <color attach="background" args={['#0A0A0F']} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        <Suspense fallback={null}>
          <FloatingShapes />
          <ParticleField />
          
          <EffectComposer enableNormalPass={false}>
            <Bloom 
              luminanceThreshold={0.2} 
              mipmapBlur 
              intensity={1.2} 
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
