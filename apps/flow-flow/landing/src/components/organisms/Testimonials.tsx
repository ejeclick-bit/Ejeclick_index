import { useState, useEffect } from 'react';
import { Container } from '../atoms/Container';
import { Badge } from '@ejeclick/ui-components';
import { TestimonialCard } from '../molecules/TestimonialCard';
import { api, type Testimonial } from '../../lib/api';
import { motion } from 'framer-motion';

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.testimonials().then(setTestimonials).finally(() => setLoading(false));
  }, []);

  return (
    <section
      id="testimonios"
      className="relative py-28 overflow-hidden"
      style={{ background: 'var(--theme-background)' }}
    >
      {/* Gradiente de acento ambiental */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-64 w-2/3 rounded-full blur-3xl opacity-[0.04]"
        style={{ background: 'var(--theme-accent)' }}
        aria-hidden="true"
      />

      <Container className="relative z-10">
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <Badge variant="gold">Testimonios</Badge>
          <h2 className="mt-4 font-display text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Lo Que Dicen Nuestros Clientes
          </h2>
          <p className="mt-4 text-base text-muted leading-relaxed">
            La mejor referencia es la palabra de quien ya lo vivió.
            Estas son algunas historias reales.
          </p>
          <div className="mx-auto mt-6 h-px w-16 rounded-full" style={{ background: 'var(--theme-accent)' }} />
        </motion.div>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-48 animate-pulse rounded-2xl"
                style={{ background: 'var(--theme-card)', opacity: 0.5 }}
              />
            ))}
          </div>
        ) : testimonials.length === 0 ? (
          <p className="text-center text-muted/70 italic">Próximamente — sé el primero en compartir tu experiencia</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <TestimonialCard key={t.id} quote={t.quote} author={t.author} role={t.role} index={i} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
