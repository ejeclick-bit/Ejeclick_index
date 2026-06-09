import { useState, useEffect } from 'react';
import { Container } from '../atoms/Container';
import { Badge } from '@ejeclick/ui-components';
import { GalleryImage } from '../molecules/GalleryImage';
import { api, type GalleryImage as GalleryItem } from '../../lib/api';
import { motion } from 'framer-motion';

export function Gallery() {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.gallery('gallery').then(setImages).finally(() => setLoading(false));
  }, []);

  return (
    <section
      id="galeria"
      className="relative py-28"
      style={{ background: 'var(--theme-surface)' }}
    >
      <Container>
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <Badge variant="gold">Galería</Badge>
          <h2 className="mt-4 font-display text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Nuestro Trabajo Habla
          </h2>
          <p className="mt-4 text-base text-muted leading-relaxed">
            Cada foto es la prueba de un estándar. Entra y juzga por ti mismo.
          </p>
          <div className="mx-auto mt-6 h-px w-16 rounded-full" style={{ background: 'var(--theme-accent)' }} />
        </motion.div>

        {loading ? (
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square animate-pulse rounded-2xl"
                style={{ background: 'var(--theme-card)', opacity: 0.5 }}
              />
            ))}
          </div>
        ) : images.length === 0 ? (
          /* Estado vacío elegante */
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 border border-dashed"
                style={{
                  background: 'var(--theme-card)',
                  borderColor: 'var(--theme-accent)',
                  opacity: 0.4 + i * 0.05,
                }}
              >
                <span className="text-2xl" aria-hidden="true">✂️</span>
                <span className="text-xs text-muted">Próximamente</span>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Mosaico con diferentes tamaños */
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {images.map((img, i) => (
              <GalleryImage key={img.id} src={img.url} alt={img.alt_text} index={i} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
