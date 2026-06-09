import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@ejeclick/ui-components';
import { ThemeToggle } from '@ejeclick/ui-components';
import { cn } from '@/utils/cn';
import { scrollToSection } from '@/utils/lenis';

const navLinks = [
  { name: 'Servicios', href: '#servicios' },
  { name: 'Proceso', href: '#proceso' },
  { name: 'Casos de Éxito', href: '#casos' },
  { name: 'FAQ', href: '#faq' },
];

const linkVariants = {
  initial: { opacity: 0, y: -10 },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.05, duration: 0.4 },
  }),
};

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled ? "py-3" : "py-5"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className={cn(
            "flex items-center justify-between transition-all duration-500 rounded-2xl px-8 py-5",
            isScrolled ? "glass-card border border-white/10" : "bg-transparent"
          )}
        >
          {/* Logo */}
          <motion.a
            href="#"
            className="flex items-center gap-2 outline-none"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-2xl md:text-3xl font-extrabold tracking-tighter text-foreground">
              Eje<span className="text-gradient">Click</span>
            </span>
          </motion.a>

          {/* Desktop Nav */}
          <nav aria-label="Navegación principal" className="hidden md:flex items-center gap-10">
            {navLinks.map((link, i) => (
              <motion.a
                key={link.name}
                href={link.href}
                className="text-base lg:text-lg font-medium text-text-secondary transition-colors hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-accent-primary rounded-md px-3 py-2"
                variants={linkVariants}
                initial="initial"
                animate="animate"
                custom={i}
                whileHover={{ scale: 1.1, color: '#ffffff' }}
                whileTap={{ scale: 0.95 }}
              >
                {link.name}
              </motion.a>
            ))}
          </nav>

          {/* CTA & Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              <Button variant="primary" size="md" className="hidden md:inline-flex text-base px-6 py-3" onClick={() => scrollToSection('#contacto')}>
                Solicitar Demo
              </Button>
            </motion.div>
            
            <button
              type="button"
              className="md:hidden p-3 text-text-secondary hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary rounded-md"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-label="Menú de navegación"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-full px-4 pt-2 pb-6 md:hidden"
          >
            <div className="glass-card flex flex-col gap-5 p-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-lg font-medium text-text-secondary hover:text-foreground transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <hr className="border-white/10 my-2" />
              <Button variant="primary" className="w-full text-base py-3" onClick={() => { scrollToSection('#contacto'); setIsMobileMenuOpen(false); }}>
                Solicitar Demo
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
