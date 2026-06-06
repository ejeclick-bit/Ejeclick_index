import { useState, useEffect } from 'react';
import { Container } from '../atoms/Container';
import { Badge } from '../atoms/Badge';
import { Button } from '../atoms/Button';
import { BookingWidget } from '../organisms/BookingWidget';
import { useTenant } from '../../lib/tenant';
import { api, type Schedule } from '../../lib/api';

const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export function Contact() {
  const { tenant } = useTenant();
  const t = tenant;
  const [schedule, setSchedule] = useState<Schedule[]>([]);

  useEffect(() => {
    api.schedule().then(setSchedule);
  }, []);

  return (
    <section id="reservas" className="bg-brand-surface py-24">
      <Container>
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <Badge variant="gold">Contacto</Badge>
          <h2 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl">
            Agendá tu Cita
          </h2>
          <p className="mt-3 text-neutral-400">
            Elegí el servicio, la fecha y el horario. Te confirmamos al instante.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            <div className="rounded-xl border border-neutral-800 bg-brand-dark p-5">
              <h3 className="font-semibold text-white">📍 Ubicación</h3>
              <p className="mt-1 text-sm text-neutral-400">{t?.address || ''}</p>
            </div>
            
            <div className="rounded-xl border border-neutral-800 bg-brand-dark p-5">
              <h3 className="font-semibold text-white">🕐 Horarios</h3>
              <div className="mt-2 space-y-1">
                {schedule.length > 0 ? (
                  schedule.map((s) => (
                    <div key={s.day_of_week} className="flex justify-between text-sm text-neutral-400">
                      <span>{dayNames[s.day_of_week]}</span>
                      <span>{s.is_active ? `${s.open_time} - ${s.close_time}` : 'Cerrado'}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-neutral-500">Cargando horarios...</p>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-brand-dark p-5">
              <h3 className="font-semibold text-white">📱 Contacto Directo</h3>
              <p className="mt-1 text-sm text-neutral-400">{t?.phone || ''}</p>
              <p className="text-sm text-neutral-400">{t?.email || ''}</p>
            </div>
            <Button variant="primary" size="lg" className="w-full"
              onClick={() => window.open(`https://wa.me/${t?.whatsapp || ''}`, '_blank')}>
              Escribir por WhatsApp
            </Button>
          </div>

          <div className="lg:col-span-3">
            <BookingWidget />
          </div>
        </div>
      </Container>
    </section>
  );
}
