import { type ReactNode } from 'react';
import { Navbar } from '../organisms/Navbar';
import { Footer } from '../organisms/Footer';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-brand-gold focus:px-4 focus:py-2 focus:text-brand-dark focus:outline-none"
      >
        Saltar al contenido principal
      </a>
      <Navbar />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}
