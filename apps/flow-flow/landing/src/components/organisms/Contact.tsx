import { useState } from 'react';
import { Container } from '../atoms/Container';
import { Badge } from '../atoms/Badge';
import { Button } from '../atoms/Button';
import { SITE } from '../../lib/data';

export function Contact() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <section id="contacto" className="bg-brand-surface py-24">
      <Container>
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <Badge variant="gold">Contacto</Badge>
          <h2 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl">
            Agendá tu Cita
          </h2>
          <p className="mt-3 text-neutral-400">
            Escríbenos por WhatsApp o déjanos tus datos y te contactamos.
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="rounded-xl border border-neutral-800 bg-brand-dark p-5">
              <h3 className="font-semibold text-white">📍 Ubicación</h3>
              <p className="mt-1 text-sm text-neutral-400">{SITE.address}</p>
            </div>
            <div className="rounded-xl border border-neutral-800 bg-brand-dark p-5">
              <h3 className="font-semibold text-white">🕐 Horarios</h3>
              <p className="mt-1 text-sm text-neutral-400">{SITE.hours.weekdays}</p>
              <p className="text-sm text-neutral-400">{SITE.hours.sunday}</p>
            </div>
            <div className="rounded-xl border border-neutral-800 bg-brand-dark p-5">
              <h3 className="font-semibold text-white">📱 Contacto Directo</h3>
              <p className="mt-1 text-sm text-neutral-400">{SITE.phone}</p>
              <p className="text-sm text-neutral-400">{SITE.email}</p>
            </div>
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => window.open(`https://wa.me/${SITE.whatsapp}`, '_blank')}
            >
              Escribir por WhatsApp
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral-300">
                Nombre Completo
              </label>
              <input
                id="name"
                type="text"
                required
                className="mt-1 w-full rounded-lg border border-neutral-700 bg-brand-dark px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold"
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-300">
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                required
                className="mt-1 w-full rounded-lg border border-neutral-700 bg-brand-dark px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold"
                placeholder="correo@ejemplo.com"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-neutral-300">
                Mensaje
              </label>
              <textarea
                id="message"
                required
                rows={4}
                className="mt-1 w-full resize-none rounded-lg border border-neutral-700 bg-brand-dark px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold"
                placeholder="¿Qué servicio te interesa?"
              />
            </div>
            {sent ? (
              <p className="rounded-lg bg-green-900/30 px-4 py-3 text-sm text-green-400" role="alert">
                Gracias por escribirnos. Te contactaremos pronto.
              </p>
            ) : (
              <Button type="submit" variant="primary" size="lg" className="w-full">
                Enviar Mensaje
              </Button>
            )}
          </form>
        </div>
      </Container>
    </section>
  );
}
