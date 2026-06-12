import { useState, useEffect } from 'react';
import { Container } from '../atoms/Container';
import { Badge } from '@ejeclick/ui-components';
import { api, type Service } from '../../lib/api';
import { motion } from 'framer-motion';
import { Scissors, Sparkles, Zap, Crown, Wind, Star } from 'lucide-react';

const SKELETON_COUNT = 3;

/** Servicios de fallback cuando la API no tiene datos */
const FALLBACK_SERVICES: (Service & { _icon: React.ElementType })[] = [
  {
    id: -1, name: 'Corte Clásico', icon: '✂️', is_active: true,
    description: 'El corte perfecto para cada tipo de cabello. Técnica depurada, acabado impecable.',
    price: 'Desde $150', _icon: Scissors,
  },
  {
    id: -2, name: 'Barba & Perfilado', icon: '🔥', is_active: true,
    description: 'Diseño y perfilado de barba con navaja. Detalles que marcan la diferencia.',
    price: 'Desde $100', _icon: Zap,
  },
  {
    id: -3, name: 'Combo Premium', icon: '👑', is_active: true,
    description: 'Corte + barba + tratamiento hidratante. Experiencia completa de barbería premium.',
    price: 'Desde $220', _icon: Crown,
  },
  {
    id: -4, name: 'Tratamiento Capilar', icon: '✨', is_active: true,
    description: 'Hidratación profunda, nutrición y brillo para cabello con vida propia.',
    price: 'Desde $180', _icon: Sparkles,
  },
  {
    id: -5, name: 'Alisado Premium', icon: '💫', is_active: true,
    description: 'Alisado profesional con productos de alta gama para un acabado de revista.',
    price: 'Desde $300', _icon: Wind,
  },
  {
    id: -6, name: 'Paquete Novia/XV', icon: '⭐', is_active: true,
    description: 'Paquete especial para eventos. Incluye corte, barba, tratamiento y estilizado.',
    price: 'Desde $450', _icon: Star,
  },
];

const ICON_MAP: Record<string, React.ElementType> = {
  '✂️': Scissors, '🔥': Zap, '👑': Crown, '✨': Sparkles, '💫': Wind, '⭐': Star,
};

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const IconComponent = ICON_MAP[service.icon] || Scissors;
  const isFallback = service.id < 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className="group relative overflow-hidden rounded-2xl border p-6 cursor-default"
      style={{
        background: 'var(--theme-card)',
        borderColor: 'var(--theme-border)',
      }}
    >
      {/* Brillo en hover */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
        style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(197,168,128,0.08) 0%, transparent 70%)',
        }}
      />
      {/* Línea superior de acento */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-t-2xl"
        style={{ background: 'var(--theme-accent)' }}
      />

      {/* Ícono */}
      <div
        className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110"
        style={{
          background: 'var(--theme-accent-dim, rgba(197,168,128,0.1))',
          border: '1px solid rgba(197,168,128,0.2)',
        }}
      >
        <IconComponent className="h-6 w-6" style={{ color: 'var(--theme-accent)' }} />
      </div>

      <h3
        className="font-display text-lg font-semibold leading-snug mb-2"
        style={{ color: 'var(--theme-foreground)' }}
      >
        {service.name}
      </h3>
      <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--theme-muted)' }}>
        {service.description}
      </p>

      <div className="flex items-center justify-between">
        <span
          className="text-base font-bold font-display"
          style={{ color: 'var(--theme-accent)' }}
        >
          {service.price}
        </span>
        {isFallback && (
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider"
            style={{
              background: 'var(--theme-accent-dim, rgba(197,168,128,0.1))',
              color: 'var(--theme-accent)',
              border: '1px solid rgba(197,168,128,0.2)',
            }}
          >
            Popular
          </span>
        )}
      </div>
    </motion.article>
  );
}

export function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.services().then(setServices).finally(() => setLoading(false));
  }, []);

  const displayServices = services.length > 0 ? services : FALLBACK_SERVICES;

  return (
    <section id="servicios" className="relative py-28 overflow-hidden" style={{ background: 'var(--theme-background)' }}>
      {/* Decoración diagonal de fondo */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
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

      {/* Luz ambiental izquierda */}
      <div
        className="pointer-events-none absolute -left-32 top-1/3 h-64 w-64 rounded-full blur-3xl opacity-10"
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
          <Badge variant="gold">Servicios</Badge>
          <h2 className="mt-4 font-display text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            El Arte del Corte Perfecto
          </h2>
          <p className="mt-4 text-base text-muted leading-relaxed">
            Cada servicio es una experiencia. Nuestros barberos combinan técnica,
            estilo y atención al detalle para que salgas sintiéndote diferente.
          </p>
          <div className="mx-auto mt-6 h-px w-16 rounded-full" style={{ background: 'var(--theme-accent)' }} />
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <div
                key={i}
                className="h-52 animate-pulse rounded-2xl"
                style={{ background: 'var(--theme-card)', opacity: 0.5 }}
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {displayServices.map((service, i) => (
              <ServiceCard key={service.id} service={service} index={i} />
            ))}
          </div>
        )}

        {/* CTA debajo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <button
            onClick={() => document.getElementById('reservas')?.scrollIntoView({ behavior: 'smooth' })}
            className="group inline-flex items-center gap-2 rounded-full border px-8 py-3 text-sm font-medium transition-all duration-300 hover:scale-105"
            style={{
              borderColor: 'var(--theme-accent)',
              color: 'var(--theme-accent)',
              background: 'var(--theme-accent-dim, rgba(197,168,128,0.07))',
            }}
          >
            Reservar un servicio
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </button>
        </motion.div>
      </Container>
    </section>
  );
}
