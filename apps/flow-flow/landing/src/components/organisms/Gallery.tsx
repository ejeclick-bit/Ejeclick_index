import { useState, useEffect } from 'react';
import { Container } from '../atoms/Container';
import { Badge } from '@ejeclick/ui-components';
import { api, type GalleryImage as GalleryItem } from '../../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Expand, X } from 'lucide-react';

/** Imágenes de fallback de Unsplash con búsqueda de barbería premium */
const FALLBACK_GALLERY = [
  {
    id: -1,
    url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&q=80&auto=format&fit=crop',
    alt_text: 'Barbero profesional realizando corte clásico',
    section_id: 1, section_slug: 'gallery', section_name: 'Galería',
  },
  {
    id: -2,
    url: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80&auto=format&fit=crop',
    alt_text: 'Interior moderno de barbería premium',
    section_id: 1, section_slug: 'gallery', section_name: 'Galería',
  },
  {
    id: -3,
    url: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&q=80&auto=format&fit=crop',
    alt_text: 'Perfilado de barba con navaja',
    section_id: 1, section_slug: 'gallery', section_name: 'Galería',
  },
  {
    id: -4,
    url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80&auto=format&fit=crop',
    alt_text: 'Corte moderno fade degradado',
    section_id: 1, section_slug: 'gallery', section_name: 'Galería',
  },
  {
    id: -5,
    url: 'https://images.unsplash.com/photo-1622296089863-eb7fc530daa8?w=600&q=80&auto=format&fit=crop',
    alt_text: 'Barbero estilizando con productos premium',
    section_id: 1, section_slug: 'gallery', section_name: 'Galería',
  },
  {
    id: -6,
    url: 'https://images.unsplash.com/photo-1652012582408-3f1de47e81d3?w=600&q=80&auto=format&fit=crop',
    alt_text: 'Sillón de barbería clásico y herramientas',
    section_id: 1, section_slug: 'gallery', section_name: 'Galería',
  },
];

function GalleryCard({ img, index, onOpen }: { img: GalleryItem; index: number; onOpen: (img: GalleryItem) => void }) {
  const isLarge = index === 0 || index === 4;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className={`group relative overflow-hidden rounded-2xl cursor-pointer ${isLarge ? 'sm:row-span-2' : ''}`}
      style={{ aspectRatio: isLarge ? '3/4' : '1/1' }}
      onClick={() => onOpen(img)}
    >
      <img
        src={img.url}
        alt={img.alt_text}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      {/* Expand icon */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-sm"
          style={{ background: 'rgba(197,168,128,0.2)', border: '1px solid rgba(197,168,128,0.4)' }}
        >
          <Expand className="h-4 w-4 text-white" />
        </div>
      </div>
      {/* Alt text en hover */}
      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <p className="text-xs text-white/80 truncate">{img.alt_text}</p>
      </div>
    </motion.div>
  );
}

function Lightbox({ img, onClose }: { img: GalleryItem; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <img src={img.url} alt={img.alt_text} className="h-full w-full object-contain" />
          <button
            onClick={onClose}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/80"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 p-4" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
            <p className="text-sm text-white/80">{img.alt_text}</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function Gallery() {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState<GalleryItem | null>(null);

  useEffect(() => {
    api.gallery('gallery').then(setImages).finally(() => setLoading(false));
  }, []);

  const displayImages = images.length > 0 ? images : FALLBACK_GALLERY;

  return (
    <section
      id="galeria"
      className="relative py-28"
      style={{ background: 'var(--theme-surface)' }}
    >
      {/* Efecto de ruido de textura */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

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
        ) : (
          /* Mosaico con tamaños variados */
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 auto-rows-auto">
            {displayImages.map((img, i) => (
              <GalleryCard key={img.id} img={img} index={i} onOpen={setSelectedImg} />
            ))}
          </div>
        )}

        {/* Indicador "Ver más" */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-10 text-center"
        >
          <p className="text-sm" style={{ color: 'var(--theme-muted)' }}>
            📸 Síguenos en Instagram para ver más trabajo
          </p>
        </motion.div>
      </Container>

      {/* Lightbox */}
      {selectedImg && (
        <Lightbox img={selectedImg} onClose={() => setSelectedImg(null)} />
      )}
    </section>
  );
}
