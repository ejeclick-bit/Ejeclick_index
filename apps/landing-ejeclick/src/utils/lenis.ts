import type Lenis from 'lenis';

let lenisInstance: Lenis | null = null;

export function setLenisInstance(lenis: Lenis) {
  lenisInstance = lenis;
}

export function scrollToSection(target: string) {
  if (lenisInstance) {
    lenisInstance.scrollTo(target);
  } else {
    const el = document.querySelector(target);
    el?.scrollIntoView({ behavior: 'smooth' });
  }
}
