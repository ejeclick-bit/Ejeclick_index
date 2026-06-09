import { useEffect, useRef } from 'react';

/**
 * useCursorSpotlight
 * Rastrea la posición del cursor y actualiza variables CSS en el elemento raíz
 * para crear el efecto de reflejo/luz que sigue al cursor.
 * Solo se activa en dispositivos con puntero fino (desktop/laptop).
 */
export function useCursorSpotlight() {
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine)');
    if (!mediaQuery.matches) return;

    const root = document.documentElement;

    const handleMouseMove = (e: MouseEvent) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        root.style.setProperty('--cursor-x', `${e.clientX}px`);
        root.style.setProperty('--cursor-y', `${e.clientY}px`);
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);
}
