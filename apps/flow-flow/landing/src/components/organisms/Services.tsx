import { useState, useEffect } from 'react';
import { Container } from '../atoms/Container';
import { Badge } from '@ejeclick/ui-components';
import { ServiceCard } from '@ejeclick/ui-components';
import { api, type Service } from '../../lib/api';
import { motion } from 'framer-motion';

const SKELETON_COUNT = 3;

export function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.services().then(setServices).finally(() => setLoading(false));
  }, []);

  return (
    <section id="servicios" className="relative py-28 overflow-hidden" style={{ background: 'var(--theme-background)' }}>
      {/* Decoración de fondo sutil */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            var(--theme-accent) 0px,
            var(--theme-accent) 1px,
            transparent 1px,
            transparent 60px
          )`,
        }}
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
          <Badge variant="gold">Servicios</Badge>
          <h2 className="mt-4 font-display text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            El Arte del Corte Perfecto
          </h2>
          <p className="mt-4 text-base text-muted leading-relaxed">
            Cada servicio es una experiencia. Nuestros barberos combinan técnica,
            estilo y atención al detalle para que salgas sintiéndote diferente.
          </p>
          {/* Divider de acento */}
          <div className="mx-auto mt-6 h-px w-16 rounded-full" style={{ background: 'var(--theme-accent)' }} />
        </motion.div>

        {/* Grid de servicios */}
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-2xl"
                style={{ background: 'var(--theme-card)', opacity: 0.6 }}
              />
            ))}
          </div>
        ) : services.length === 0 ? (
          <p className="text-center text-muted/80">Próximamente</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                icon={service.icon}
                title={service.name}
                description={service.description}
                price={service.price}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
