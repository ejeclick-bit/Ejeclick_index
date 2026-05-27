import { Container } from '../atoms/Container';
import { Badge } from '../atoms/Badge';
import { GalleryImage } from '../molecules/GalleryImage';
import { SITE } from '../../lib/data';

export function Gallery() {
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

        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {SITE.gallery.map((img, i) => (
            <GalleryImage key={img.src} {...img} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}
