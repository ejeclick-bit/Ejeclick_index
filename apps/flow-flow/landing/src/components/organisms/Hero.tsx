import { motion } from 'framer-motion';
import { Container } from '../atoms/Container';
import { Badge } from '@ejeclick/ui-components';
import { Button } from '@ejeclick/ui-components';
import { useTenant } from '../../lib/tenant';

export function Hero() {
  const { tenant } = useTenant();
  const t = tenant;

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden" style={{ background: 'var(--theme-background)' }}>
      {/* Luces radiales de acento para darle vida al fondo */}
      <div 
        className="absolute inset-0 opacity-20 transition-opacity duration-700" 
        style={{ background: 'radial-gradient(circle at top right, var(--theme-accent) 0%, transparent 40%)' }} 
      />
      <div 
        className="absolute inset-0 opacity-10 transition-opacity duration-700" 
        style={{ background: 'radial-gradient(circle at bottom left, var(--theme-accent) 0%, transparent 40%)' }} 
      />

      <Container className="relative z-10 pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Badge variant="gold">Barbería Profesional</Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-6 font-display text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl"
            style={{ color: 'var(--theme-foreground)' }}
          >
            {t?.name || 'Barbería'}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-4 text-lg sm:text-xl"
            style={{ color: 'var(--theme-muted)' }}
          >
            {t?.tagline || 'Estilo y profesionalismo'}. {t?.description || ''}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Button size="lg" variant="primary"
              onClick={() => document.getElementById('reservas')?.scrollIntoView({ behavior: 'smooth' })}>
              Reservar Ahora
            </Button>
            <Button size="lg" variant="secondary"
              onClick={() => window.open(`https://wa.me/${t?.whatsapp || ''}`, '_blank')}>
              Escribir por WhatsApp
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 flex items-center justify-center gap-4 text-sm"
            style={{ color: 'var(--theme-muted)' }}
          >
            <span className="flex items-center gap-2 px-4 py-2 rounded-full border" style={{ borderColor: 'var(--theme-border)', background: 'var(--theme-surface)' }}>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              Disponibles hoy
            </span>
          </motion.div>
        </div>
      </Container>

      {/* Gradiente inferior para transición a la siguiente sección */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-32" 
        style={{ background: 'linear-gradient(to top, var(--theme-background), transparent)' }} 
      />
    </section>
  );
}
