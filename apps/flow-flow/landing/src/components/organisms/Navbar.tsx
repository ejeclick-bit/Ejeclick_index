import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Container } from '../atoms/Container';
import { Button } from '../atoms/Button';
import { cn } from '../../utils/cn';
import { useTenant } from '../../lib/tenant';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { label: 'Reservar', href: '#reservas' },
    { label: 'Cancelar Cita', href: '#cancelar' },
    { label: 'Servicios', href: '#servicios' },
    { label: 'Galería', href: '#galeria' },
    { label: 'Testimonios', href: '#testimonios' },
  ];

  const { tenant } = useTenant();

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-brand-dark/85 backdrop-blur-lg shadow-lg shadow-black/10'
          : 'bg-transparent',
      )}
    >
      <Container>
        <nav className="flex h-16 items-center justify-between" aria-label="Navegación principal">
          <a href="#" className="text-lg font-bold tracking-tight text-white">
            <span className="text-brand-gold">✦</span> {tenant?.name || 'Barbería'}
          </a>

          <ul className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-sm text-neutral-400 transition-colors hover:text-white"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <Button
            variant="primary"
            size="sm"
            className="hidden md:inline-flex"
            onClick={() => window.open(`https://wa.me/${tenant?.whatsapp || ""}`, '_blank')}
          >
            Agenda tu Cita
          </Button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex p-2 text-white md:hidden"
            aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </Container>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-neutral-800 bg-brand-dark md:hidden"
          >
            <Container className="py-4">
              <ul className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="block rounded-md px-3 py-2 text-sm text-neutral-300 transition-colors hover:bg-white/5 hover:text-white"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
                <li className="pt-2">
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => window.open(`https://wa.me/${tenant?.whatsapp || ""}`, '_blank')}
                  >
                    Agenda tu Cita
                  </Button>
                </li>
              </ul>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
