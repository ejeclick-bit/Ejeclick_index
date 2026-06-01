import { useEffect } from 'react';

export function BackTrap() {
  useEffect(() => {
    window.scrollTo({ top: 0 });
    const hash = window.location.hash || '/';
    window.history.pushState(null, '', `#${hash.replace(/^#+/, '')}`);
  }, []);

  return null;
}
