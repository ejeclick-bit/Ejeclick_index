import { lazy, Suspense } from 'react';

const Scene3D = lazy(() =>
  import('@/components/three/Scene3D').then((m) => ({ default: m.Scene3D }))
);

export function HeroSection() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center justify-center pt-20 pb-16">
      <Suspense fallback={null}>
        <Scene3D />
      </Suspense>

      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-bg-primary to-transparent z-10" />
    </section>
  );
}
