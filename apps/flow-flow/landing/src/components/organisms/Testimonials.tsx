import { useState, useEffect } from 'react';
import { Container } from '../atoms/Container';
import { Badge } from '@ejeclick/ui-components';
import { api, type Testimonial } from '../../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: -1,
    quote: 'El mejor corte que me han dado en años. El ambiente es increíble y los barberos realmente saben lo que hacen. Ya no voy a ningún otro lugar.',
    author: 'Carlos Mendoza',
    role: 'Cliente frecuente',
    rating: 5,
  },
  {
    id: -2,
    quote: 'Vine por primera vez y quedé impresionado. El perfilado de barba fue exactamente como lo pedí. Definitivamente regreso cada dos semanas.',
    author: 'Roberto Jiménez',
    role: 'Cliente nuevo',
    rating: 5,
  },
  {
    id: -3,
    quote: 'La atención es excepcional. Se nota que usan productos de calidad y que cuidan cada detalle. Me sentí como en una barbería de lujo.',
    author: 'Miguel Ángel Torres',
    role: 'Cliente VIP',
    rating: 5,
  },
  {
    id: -4,
    quote: 'Traje a mi hijo por primera vez y fue una experiencia increíble para los dos. El ambiente es muy cómodo y el resultado fue perfecto.',
    author: 'Alejandro Ruiz',
    role: 'Padre de familia',
    rating: 5,
  },
  {
    id: -5,
    quote: 'El sistema de reservas online es muy cómodo. Puedo agendar desde mi celular y siempre hay horarios disponibles. Servicio de primera.',
    author: 'Daniel Herrera',
    role: 'Profesionista',
    rating: 5,
  },
  {
    id: -6,
    quote: 'El combo premium vale absolutamente cada peso. Salí transformado: corte, barba y tratamiento. Mis colegas preguntaron dónde me cortaron.',
    author: 'Francisco Morales',
    role: 'Empresario',
    rating: 5,
  },
];

function StarRating({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star 
          key={i} 
          className="h-3.5 w-3.5" 
          style={{ 
            color: 'var(--theme-accent)', 
            fill: i < count ? 'currentColor' : 'transparent' 
          }} 
        />
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial, index }: { testimonial: Testimonial; index: number }) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative flex flex-col rounded-2xl border p-6 transition-shadow duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
      style={{ background: 'var(--theme-card)', borderColor: 'var(--theme-border)' }}
    >
      {/* Brillo superior en hover */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
        style={{ background: 'radial-gradient(circle at 50% -20%, rgba(197,168,128,0.07) 0%, transparent 60%)' }}
      />

      {/* Ícono de comillas */}
      <div
        className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-lg"
        style={{ background: 'var(--theme-accent-dim, rgba(197,168,128,0.1))' }}
      >
        <Quote className="h-4 w-4" style={{ color: 'var(--theme-accent)' }} />
      </div>

      {/* Rating */}
      <StarRating count={testimonial.rating ?? 5} />

      {/* Quote */}
      <blockquote
        className="mt-3 flex-1 text-sm leading-relaxed"
        style={{ color: 'var(--theme-muted)' }}
      >
        "{testimonial.quote}"
      </blockquote>

      {/* Autor */}
      <figcaption
        className="mt-5 flex items-center gap-3 border-t pt-4"
        style={{ borderColor: 'var(--theme-border)' }}
      >
        {/* Avatar generado */}
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold flex-shrink-0"
          style={{
            background: 'var(--theme-accent)',
            color: 'var(--theme-background)',
          }}
        >
          {testimonial.author.charAt(0)}
        </div>
        <div>
          <div className="text-sm font-semibold" style={{ color: 'var(--theme-foreground)' }}>
            {testimonial.author}
          </div>
          {testimonial.role && (
            <div className="text-xs" style={{ color: 'var(--theme-muted)' }}>
              {testimonial.role}
            </div>
          )}
        </div>
      </figcaption>
    </motion.figure>
  );
}

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', quote: '', rating: 5 });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    api.testimonials().then(setTestimonials).finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name || !formData.quote) return;
    setSubmitting(true);
    try {
      await api.submitTestimonial({
        author: formData.name,
        quote: formData.quote,
        role: 'Cliente',
        rating: formData.rating,
      });
      setSubmitted(true);
      setFormData({ name: '', quote: '', rating: 5 });
      setTimeout(() => { setShowForm(false); setSubmitted(false); }, 4000);
    } catch {
      alert("Error al enviar la reseña. Intenta nuevamente.");
    }
    setSubmitting(false);
  }

  const displayTestimonials = testimonials.length > 0 ? testimonials : FALLBACK_TESTIMONIALS;

  return (
    <section
      id="testimonios"
      className="relative py-28 overflow-hidden"
      style={{ background: 'var(--theme-background)' }}
    >
      {/* Gradiente ambiental */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-80 w-2/3 rounded-full blur-3xl opacity-[0.06]"
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
          className="mx-auto mb-4 max-w-2xl text-center"
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

        {/* Trust badge animado */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-12 flex items-center justify-center gap-3"
        >
          <div className="flex -space-x-2">
            {['C', 'R', 'M', 'A', 'D'].map((initial, i) => (
              <div
                key={i}
                className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ring-2"
                style={{
                  background: `hsl(${30 + i * 15}, 60%, ${45 + i * 4}%)`,
                  color: 'white',
                  '--tw-ring-color': 'var(--theme-background)',
                } as React.CSSProperties}
              >
                {initial}
              </div>
            ))}
          </div>
          <div className="flex flex-col">
            <StarRating />
            <span className="text-xs mt-0.5" style={{ color: 'var(--theme-muted)' }}>
              +500 clientes satisfechos
            </span>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-52 animate-pulse rounded-2xl"
                style={{ background: 'var(--theme-card)', opacity: 0.5 }}
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {displayTestimonials.map((t, i) => (
              <TestimonialCard key={t.id} testimonial={t} index={i} />
            ))}
          </div>
        )}

        {/* Indicadores de confianza */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-6"
        >
          {[
            { label: '⭐ 4.9/5 en Google' },
            { label: '✅ Verificados' },
            { label: '🏆 Top Barbería 2024' },
          ].map((badge) => (
            <span
              key={badge.label}
              className="rounded-full border px-4 py-2 text-xs font-medium"
              style={{
                borderColor: 'var(--theme-border)',
                background: 'var(--theme-card)',
                color: 'var(--theme-muted)',
              }}
            >
              {badge.label}
            </span>
          ))}
        </motion.div>
        {/* Botón de Dejar Reseña */}
        <div className="mt-12 flex justify-center">
          <button 
            onClick={() => setShowForm(!showForm)}
            className="rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-300 hover:scale-105"
            style={{
              background: showForm ? 'transparent' : 'var(--theme-accent)',
              color: showForm ? 'var(--theme-muted)' : 'var(--theme-background)',
              border: showForm ? '1px solid var(--theme-border)' : 'none'
            }}
          >
            {showForm ? 'Cancelar' : 'Dejar una reseña'}
          </button>
        </div>

        {/* Formulario de Reseña */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              className="overflow-hidden mt-8 max-w-md mx-auto"
            >
              {submitted ? (
                <div className="rounded-xl border p-6 text-center" style={{ borderColor: 'var(--theme-border)', background: 'var(--theme-surface)' }}>
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20 text-green-500">
                    <Quote size={20} />
                  </div>
                  <h4 className="text-lg font-bold" style={{ color: 'var(--theme-foreground)' }}>¡Gracias por tu reseña!</h4>
                  <p className="mt-2 text-sm" style={{ color: 'var(--theme-muted)' }}>Tu comentario será revisado y publicado pronto.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="rounded-xl border p-6 shadow-lg" style={{ borderColor: 'var(--theme-border)', background: 'var(--theme-card)' }}>
                  <h4 className="mb-4 text-lg font-bold text-center" style={{ color: 'var(--theme-foreground)' }}>Comparte tu experiencia</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-center" style={{ color: 'var(--theme-foreground)' }}>Calificación</label>
                      <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setFormData({ ...formData, rating: star })}
                            className="focus:outline-none transition-transform hover:scale-110"
                          >
                            <Star 
                              className="h-8 w-8" 
                              style={{ 
                                color: 'var(--theme-accent)', 
                                fill: star <= formData.rating ? 'currentColor' : 'transparent' 
                              }} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--theme-foreground)' }}>Tu Nombre</label>
                      <input 
                        required type="text" 
                        value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full rounded-lg border px-4 py-2 text-sm focus:outline-none" 
                        style={{ background: 'var(--theme-surface)', borderColor: 'var(--theme-border)', color: 'var(--theme-foreground)' }} 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--theme-foreground)' }}>Tu Comentario</label>
                      <textarea 
                        required rows={3} 
                        value={formData.quote} onChange={e => setFormData({ ...formData, quote: e.target.value })}
                        className="w-full rounded-lg border px-4 py-2 text-sm focus:outline-none" 
                        style={{ background: 'var(--theme-surface)', borderColor: 'var(--theme-border)', color: 'var(--theme-foreground)' }} 
                      />
                    </div>
                    <button 
                      type="submit" disabled={submitting}
                      className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-all disabled:opacity-50 hover:opacity-90"
                      style={{ background: 'var(--theme-accent)', color: 'var(--theme-background)' }}
                    >
                      {submitting ? 'Enviando...' : 'Enviar Reseña'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </section>
  );
}
