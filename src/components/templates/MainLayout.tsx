import { type ReactNode, useEffect } from 'react';
import Lenis from 'lenis';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';

export interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <>
      {/* Background Aurora */}
      <div className="aurora-container">
        <div className="aurora-orb aurora-primary"></div>
        <div className="aurora-orb aurora-secondary"></div>
        <div className="aurora-orb aurora-tertiary"></div>
      </div>

      <Navbar />

      <main className="relative z-10 w-full min-h-screen flex flex-col">
        {children}
      </main>

      <Footer />
    </>
  );
}
