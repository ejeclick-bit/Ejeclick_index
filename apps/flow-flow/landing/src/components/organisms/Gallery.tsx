import { useState, useEffect } from 'react';
import { Container } from '../atoms/Container';
import { Badge } from '../atoms/Badge';
import { GalleryImage } from '../molecules/GalleryImage';
import { api, type GalleryImage as GalleryItem } from '../../lib/api';

export function Gallery() {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.gallery('gallery').then(setImages).finally(() => setLoading(false));
  }, []);

  return (
    <section id="galeria" className="bg-brand-surface py-24">
      <Container>
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <Badge variant="gold">Galería</Badge>
          <h2 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl">
            Nuestro Trabajo
          </h2>
          <p className="mt-3 text-neutral-400">
            Cada corte es una obra de arte. Mira algunos de nuestros mejores trabajos.
          </p>
        </div>

        {loading ? (
          <p className="text-center text-neutral-500">Cargando galería...</p>
        ) : images.length === 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="aspect-square rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-600 text-sm">
                Próximamente
              </div>
            ))}
          </div>
        ) : (
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
