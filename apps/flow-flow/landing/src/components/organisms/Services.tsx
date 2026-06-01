import { useState, useEffect } from 'react';
import { Container } from '../atoms/Container';
import { Badge } from '../atoms/Badge';
import { ServiceCard } from '../molecules/ServiceCard';
import { api, type Service } from '../../lib/api';

export function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.services().then(setServices).finally(() => setLoading(false));
  }, []);

  return (
    <section id="servicios" className="relative bg-brand-dark py-24">
      <Container>
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <Badge variant="gold">Servicios</Badge>
          <h2 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl">
            Nuestros Cortes y Precios
          </h2>
          <p className="mt-3 text-neutral-400">
            Todos nuestros servicios incluyen asesoría de estilo personalizada y atención de primera.
          </p>
        </div>

        {loading ? (
          <p className="text-center text-neutral-500">Cargando servicios...</p>
        ) : services.length === 0 ? (
          <p className="text-center text-neutral-500">Próximamente</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <ServiceCard
                key={service.id}
                icon={service.icon}
                title={service.name}
                description={service.description}
                price={service.price}
                index={i}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
