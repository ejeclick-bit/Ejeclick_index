import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Container } from '../atoms/Container';
import { Badge } from '@ejeclick/ui-components';
import { useTenant } from '../../lib/tenant';
import { Scissors, Star, Clock, Award } from 'lucide-react';
import { api, type GalleryImage } from '../../lib/api';

const STATS = [
  { icon: Award, value: '8+', label: 'Años de Experiencia' },
  { icon: Star, value: '500+', label: 'Clientes Satisfechos' },
  { icon: Scissors, value: '12k+', label: 'Cortes Realizados' },
  { icon: Clock, value: '6/7', label: 'Días Disponibles' },
];

// ────────────────────────────────────────────────────────────────────────────
// Hero con Imagen (cuando el tenant subió una foto desde el admin)
// ────────────────────────────────────────────────────────────────────────────
function HeroWithImage({ imageUrl, children }: { imageUrl: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const yImg = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  return (
    <div ref={ref} className="relative">
      {/* Imagen con parallax */}
      <motion.div className="absolute inset-0 z-0" style={{ y: yImg }}>
        <img
          src={imageUrl}
          alt="Fondo de la barbería"
          className="h-full w-full object-cover"
          fetchPriority="high"
        />
      </motion.div>
      {/* Overlay cinematográfico (Más oscuro para mejor lectura) */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.8) 100%)',
        }}
      />
      {/* Viñeta para concentrar la atención */}
      <div
        className="absolute inset-0 z-10"
        style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)' }}
      />
      {/* Franja barber-pole lateral */}
      <div
        className="pointer-events-none absolute left-0 top-0 z-10 h-full w-1 opacity-30"
        style={{
          background: 'repeating-linear-gradient(135deg, var(--theme-accent) 0px, var(--theme-accent) 10px, transparent 10px, transparent 30px)',
        }}
      />
      {/* Contenido sobre imagen */}
      <div className="relative z-20 text-white">{children}</div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Hero CSS Premium (sin imagen — diseño que WOW por sí solo)
// Usa gradientes, formas geométricas y el acento del tenant
// ────────────────────────────────────────────────────────────────────────────
function HeroCSS({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {/* Fondo base del tema */}
      <div className="absolute inset-0 z-0" style={{ background: 'var(--theme-background)' }} />

      {/* Forma geométrica grande — círculo acento arriba-derecha */}
      <motion.div
        className="pointer-events-none absolute -top-40 -right-40 z-0 h-[600px] w-[600px] rounded-full"
        style={{ background: 'var(--theme-accent)', opacity: 0.06 }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Forma geométrica — círculo acento abajo-izquierda */}
      <motion.div
        className="pointer-events-none absolute -bottom-20 -left-20 z-0 h-80 w-80 rounded-full"
        style={{ background: 'var(--theme-accent)', opacity: 0.04 }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      {/* Líneas decorativas estilo barbería (scissors pattern) */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.025]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            var(--theme-accent) 0px,
            var(--theme-accent) 1px,
            transparent 1px,
            transparent 55px
          )`,
        }}
        aria-hidden="true"
      />

      {/* Franja de acento izquierda */}
      <div
        className="pointer-events-none absolute left-0 top-0 z-10 h-full w-1 opacity-40"
        style={{
          background: 'linear-gradient(to bottom, transparent, var(--theme-accent), transparent)',
        }}
      />

      {/* Ícono decorativo de tijeras grandes (marca la identidad) */}
      <div
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 z-0 opacity-[0.03] select-none"
        aria-hidden="true"
        style={{ fontSize: '28rem', lineHeight: 1, color: 'var(--theme-accent)' }}
      >
        ✂
      </div>

      {/* Contenido sobre el diseño CSS */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Contenido común del Hero (texto, CTAs, stats)
// ────────────────────────────────────────────────────────────────────────────
function HeroContent({ hasImage }: { hasImage: boolean }) {
  const { tenant } = useTenant();
  const t = tenant;

  // Con imagen: texto siempre blanco. Sin imagen: usa tokens del tema.
  const textColor = hasImage ? '#ffffff' : 'var(--theme-foreground)';
  const subColor = hasImage ? 'rgba(255,255,255,0.75)' : 'var(--theme-muted)';
  const statsBg = hasImage
    ? 'rgba(0,0,0,0.6)'
    : 'var(--theme-surface)';
  const statsBorder = hasImage
    ? 'rgba(197,168,128,0.15)'
    : 'var(--theme-border)';

  return (
    <Container className="pt-28 pb-0">
      <div className="mx-auto max-w-4xl">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="gold">✦ Barbería Profesional Premium</Badge>
        </motion.div>

        {/* Título */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-6 font-display font-bold leading-[1.05] tracking-tight drop-shadow-xl"
          style={{
            color: textColor,
            fontSize: 'clamp(2.5rem, 8vw, 6rem)',
            textShadow: hasImage ? '0 4px 60px rgba(0,0,0,0.9), 0 2px 20px rgba(0,0,0,0.7)' : 'none',
          }}
        >
          {t?.name || 'Flow Flow'}
          <br />
          <span style={{ color: 'var(--theme-accent)' }}>Barbería</span>
        </motion.h1>

        {/* Línea acento */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mt-6 h-0.5 w-24 origin-left rounded-full"
          style={{ background: 'var(--theme-accent)' }}
        />

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-6 max-w-xl text-lg leading-relaxed sm:text-xl drop-shadow-md"
          style={{ 
            color: subColor,
            textShadow: hasImage ? '0 2px 20px rgba(0,0,0,0.8), 0 1px 5px rgba(0,0,0,0.6)' : 'none'
          }}
        >
          {t?.tagline || 'Estilo y profesionalismo'}.{' '}
          <span style={{ color: hasImage ? 'rgba(255,255,255,0.75)' : 'var(--theme-muted)' }}>
            {t?.description || 'Tu imagen, nuestro arte.'}
          </span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10 flex flex-col items-stretch gap-4 sm:flex-row sm:items-start"
        >
          <button
            className="w-full sm:w-auto group flex items-center justify-center gap-2 rounded-lg px-8 py-3 text-sm font-medium transition-all duration-300 hover:scale-105"
            style={{
              background: 'var(--theme-accent)',
              color: 'var(--theme-background)',
            }}
            onClick={() => document.getElementById('reservas')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Reservar Ahora →
          </button>

          {/* WhatsApp secundario */}
          <button
            onClick={() => window.open(`https://wa.me/${t?.whatsapp || ''}`, '_blank')}
            className="group flex w-full sm:w-auto items-center justify-center gap-3 rounded-full border px-6 py-3 text-sm font-semibold transition-all duration-300 hover:scale-105"
            style={{
              borderColor: hasImage ? 'rgba(255,255,255,0.2)' : 'var(--theme-border)',
              background: hasImage ? 'rgba(255,255,255,0.05)' : 'var(--theme-surface)',
              backdropFilter: 'blur(10px)',
              color: textColor,
            }}
          >
            <svg className="h-4 w-4 text-green-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </button>
        </motion.div>

        {/* Indicador disponible */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 flex items-center gap-2"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
          </span>
          <span className="text-sm" style={{ color: subColor }}>
            Disponibles hoy — Agenda tu turno ahora
          </span>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="mt-16"
        >
          <div
            className="rounded-2xl border py-5"
            style={{
              background: statsBg,
              borderColor: statsBorder,
              backdropFilter: hasImage ? 'blur(20px)' : 'none',
            }}
          >
            <div className="grid grid-cols-2 gap-px sm:grid-cols-4">
              {STATS.map(({ icon: Icon, value, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 1.1 + i * 0.08 }}
                  className="flex flex-col items-center gap-1 py-2 text-center"
                >
                  <Icon className="mb-1 h-4 w-4" style={{ color: 'var(--theme-accent)' }} />
                  <span
                    className="text-2xl font-bold font-display"
                    style={{ color: hasImage ? '#fff' : 'var(--theme-foreground)' }}
                  >
                    {value}
                  </span>
                  <span
                    className="text-xs leading-tight"
                    style={{ color: hasImage ? 'rgba(255,255,255,0.55)' : 'var(--theme-muted)' }}
                  >
                    {label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </Container>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Componente Principal — elige el layout según hero_image_url del tenant o la galería
// ────────────────────────────────────────────────────────────────────────────
export function Hero() {
  const { tenant } = useTenant();
  const [heroImages, setHeroImages] = useState<GalleryImage[]>([]);

  useEffect(() => {
    // Solo buscar en la galería si el tenant no configuró un hero_image_url
    if (!tenant?.hero_image_url) {
      api.gallery('hero').then(setHeroImages).catch(() => {});
    }
  }, [tenant?.hero_image_url]);

  const heroImage = tenant?.hero_image_url || heroImages?.[0]?.url || '';

  if (heroImage) {
    return (
      <section className="relative min-h-screen overflow-hidden">
        <HeroWithImage imageUrl={heroImage}>
          <div className="pb-24">
            <HeroContent hasImage={true} />
          </div>
        </HeroWithImage>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen overflow-hidden">
      <HeroCSS>
        <div className="pb-24">
          <HeroContent hasImage={false} />
        </div>
      </HeroCSS>
    </section>
  );
}
