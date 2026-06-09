import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Container } from '../atoms/Container';
import { Button } from '@ejeclick/ui-components';
import { ThemeToggle } from '@ejeclick/ui-components';
import { cn } from '../../utils/cn';
import { useTenant } from '../../lib/tenant';

/**
 * Navbar — Barbershop Premium
 *
 * Efecto glassmorphism adaptativo:
 *   Dark mode: vidrio esmerilado oscuro sobre el carbón con borde bronce muy sutil.
 *   Light mode: vidrio blanco translúcido sobre el lino con borde beige cálido.
 *
 * Al hacer scroll activa el backdrop-blur y la capa de color.
 */
export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { tenant } = useTenant();

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

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        // Transición suave propia para el Navbar
        'transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]',
        isScrolled
          ? [
              // Fondo vidrio adaptativo según tema
              'bg-[var(--theme-surface)]/80',
              'backdrop-blur-xl',
              // Borde inferior bronce/beige según tema
              'border-b border-[var(--theme-accent)]/10',
              // Sombra sutil
              'shadow-[0_4px_24px_rgba(0,0,0,0.08)]',
            ]
          : 'bg-transparent border-b border-transparent',
      )}
    >
      <Container>
        <nav
          className="flex h-16 items-center justify-between"
          aria-label="Navegación principal"
        >
          {/* Logotipo */}
          <a
            href="#"
            className="flex items-center gap-2 text-lg font-semibold tracking-tight text-foreground no-underline"
          >
            {/* Diamante de acento */}
            <span
              className="text-base"
              style={{ color: 'var(--theme-accent)' }}
              aria-hidden="true"
            >
              ✦
            </span>
            <span className="font-display">{tenant?.name || 'Barbería'}</span>
          </a>

          {/* Nav links — desktop */}
          <ul className="hidden items-center gap-8 md:flex" role="list">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={cn(
                    'relative text-sm font-medium text-muted',
                    'transition-colors duration-200 hover:text-foreground',
                    // Subrayado animado con acento
                    'after:absolute after:bottom-[-2px] after:left-0 after:h-px after:w-0',
                    'after:bg-[var(--theme-accent)] after:transition-all after:duration-300',
                    'hover:after:w-full',
                  )}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Acciones derecha — desktop */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Button
              variant="primary"
              size="sm"
              onClick={() =>
                window.open(`https://wa.me/${tenant?.whatsapp || ''}`, '_blank')
              }
            >
              Agenda tu Cita
            </Button>
          </div>

          {/* Acciones derecha — mobile */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                'inline-flex items-center justify-center rounded-lg p-2',
                'text-foreground/70 hover:text-foreground',
                'hover:bg-[var(--theme-accent-dim)]',
                'transition-colors duration-200',
              )}
              aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </Container>

      {/* Menú mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className={cn(
              'overflow-hidden md:hidden',
              'border-t border-[var(--theme-border)]',
              'bg-[var(--theme-surface)]/95 backdrop-blur-xl',
            )}
          >
            <Container className="py-4">
              <ul className="flex flex-col gap-1" role="list">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'block rounded-lg px-3 py-2.5 text-sm font-medium',
                        'text-foreground/80 hover:text-foreground',
                        'hover:bg-[var(--theme-accent-dim)]',
                        'transition-colors duration-200',
                      )}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
                <li className="pt-3 border-t border-[var(--theme-border)] mt-2">
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() =>
                      window.open(`https://wa.me/${tenant?.whatsapp || ''}`, '_blank')
                    }
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
