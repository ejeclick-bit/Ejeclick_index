import { motion } from 'framer-motion';
import { Container } from '../atoms/Container';
import { Badge } from '../atoms/Badge';
import { Button } from '../atoms/Button';
import { useTenant } from '../../lib/tenant';

export function Hero() {
  const { tenant } = useTenant();
  const t = tenant;

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-dark via-brand-dark to-brand-surface" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--brand-primary)_0%,_transparent_50%)] opacity-20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--brand-primary)_0%,_transparent_50%)] opacity-10" />

      <Container className="relative z-10 pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Badge variant="gold">Barbería Profesional</Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-6 font-display text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            {t?.name || 'Barbería'}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-4 text-lg text-neutral-400 sm:text-xl"
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
            className="mt-6 flex items-center justify-center gap-4 text-sm text-neutral-500"
          >
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
              Disponibles hoy
            </span>
          </motion.div>
        </div>
      </Container>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brand-dark to-transparent" />
    </section>
  );
}
