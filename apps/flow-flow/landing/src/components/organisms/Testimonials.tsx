import { Container } from '../atoms/Container';
import { Badge } from '../atoms/Badge';
import { TestimonialCard } from '../molecules/TestimonialCard';
import { SITE } from '../../lib/data';

export function Testimonials() {
  return (
    <section id="testimonios" className="bg-brand-dark py-24">
      <Container>
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <Badge variant="gold">Testimonios</Badge>
          <h2 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl">
            Lo Que Dicen Nuestros Clientes
          </h2>
          <p className="mt-3 text-neutral-400">
            No confíes solo en nuestra palabra — mira lo que opinan quienes ya vivieron la experiencia Flow Flow.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SITE.testimonials.map((t, i) => (
            <TestimonialCard key={t.author} {...t} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}
