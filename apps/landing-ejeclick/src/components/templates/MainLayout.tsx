import { type ReactNode, useEffect } from 'react';
import Lenis from 'lenis';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { setLenisInstance, scrollToSection } from '@/utils/lenis';

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

    setLenisInstance(lenis);

    const handleAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as Element).closest('a[href^="#"]');
      if (anchor) {
        e.preventDefault();
        const href = anchor.getAttribute('href');
        if (href) scrollToSection(href);
      }
    };

    document.addEventListener('click', handleAnchorClick);

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent-primary focus:text-foreground focus:rounded-lg focus:outline-none"
      >
        Saltar al contenido principal
      </a>

      {/* Background Aurora */}
      <div className="aurora-container" aria-hidden="true">
        <div className="aurora-orb aurora-primary"></div>
        <div className="aurora-orb aurora-secondary"></div>
        <div className="aurora-orb aurora-tertiary"></div>
      </div>

      <Navbar />

      <main id="main-content" className="relative z-10 w-full min-h-screen flex flex-col">
        {children}
      </main>

      <Footer />
    </>
  );
}
