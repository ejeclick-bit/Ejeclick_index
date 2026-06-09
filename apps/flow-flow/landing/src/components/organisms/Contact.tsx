import { useState, useEffect } from 'react';
import { Container } from '../atoms/Container';
import { Badge } from '@ejeclick/ui-components';
import { Button } from '@ejeclick/ui-components';
import { BookingWidget } from '../organisms/BookingWidget';
import { useTenant } from '../../lib/tenant';
import { api, type Schedule } from '../../lib/api';
import { MapPin, Clock, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export function Contact() {
  const { tenant } = useTenant();
  const t = tenant;
  const [schedule, setSchedule] = useState<Schedule[]>([]);

  useEffect(() => {
    api.schedule().then(setSchedule);
  }, []);

  return (
    <section id="reservas" className="relative py-28" style={{ background: 'var(--theme-surface)' }}>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <Badge variant="gold">Contacto</Badge>
          <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl lg:text-5xl" style={{ color: 'var(--theme-foreground)' }}>
            Asegura tu Espacio
          </h2>
          <p className="mt-4 text-base leading-relaxed" style={{ color: 'var(--theme-muted)' }}>
            El buen estilo no espera. Reserva tu cita en segundos y asegúrate de lucir siempre impecable.
          </p>
          <div className="mx-auto mt-6 h-px w-16 rounded-full" style={{ background: 'var(--theme-accent)' }} />
        </motion.div>

        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-12">
          {/* Información de Contacto */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6 lg:col-span-5"
          >
            <div className="rounded-2xl border p-6 transition-shadow hover:shadow-lg" style={{ borderColor: 'var(--theme-border)', background: 'var(--theme-card)' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: 'var(--theme-accent-dim)', color: 'var(--theme-accent)' }}>
                  <MapPin size={20} />
                </div>
                <h3 className="font-semibold text-lg" style={{ color: 'var(--theme-foreground)' }}>Ubicación</h3>
              </div>
              <p className="pl-13 text-sm leading-relaxed" style={{ color: 'var(--theme-muted)' }}>{t?.address || 'Visítanos en nuestra sede principal.'}</p>
            </div>
            
            <div className="rounded-2xl border p-6 transition-shadow hover:shadow-lg" style={{ borderColor: 'var(--theme-border)', background: 'var(--theme-card)' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: 'var(--theme-accent-dim)', color: 'var(--theme-accent)' }}>
                  <Clock size={20} />
                </div>
                <h3 className="font-semibold text-lg" style={{ color: 'var(--theme-foreground)' }}>Horarios</h3>
              </div>
              <div className="pl-13 space-y-2 mt-2">
                {schedule.length > 0 ? (
                  schedule.map((s) => (
                    <div key={s.day_of_week} className="flex justify-between text-sm border-b border-dashed pb-1 last:border-0 last:pb-0" style={{ borderColor: 'var(--theme-border)', color: 'var(--theme-muted)' }}>
                      <span className="font-medium">{dayNames[s.day_of_week]}</span>
                      <span>{s.is_active ? `${s.open_time.substring(0,5)} - ${s.close_time.substring(0,5)}` : 'Cerrado'}</span>
                    </div>
                  ))
                ) : (
                  <div className="animate-pulse flex flex-col gap-2">
                    <div className="h-4 w-full rounded bg-gray-500/20"></div>
                    <div className="h-4 w-3/4 rounded bg-gray-500/20"></div>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border p-6 transition-shadow hover:shadow-lg" style={{ borderColor: 'var(--theme-border)', background: 'var(--theme-card)' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: 'var(--theme-accent-dim)', color: 'var(--theme-accent)' }}>
                  <Phone size={20} />
                </div>
                <h3 className="font-semibold text-lg" style={{ color: 'var(--theme-foreground)' }}>Contacto Directo</h3>
              </div>
              <div className="pl-13 space-y-3">
                <a href={`tel:${t?.phone}`} className="flex items-center gap-2 text-sm hover:underline" style={{ color: 'var(--theme-muted)' }}>
                  {t?.phone || ''}
                </a>
                <a href={`mailto:${t?.email}`} className="flex items-center gap-2 text-sm hover:underline" style={{ color: 'var(--theme-muted)' }}>
                  {t?.email || ''}
                </a>
              </div>
            </div>

            <Button variant="primary" size="lg" className="w-full mt-4"
              onClick={() => window.open(`https://wa.me/${t?.whatsapp || ''}`, '_blank')}>
              Escribir por WhatsApp
            </Button>
          </motion.div>

          {/* Widget de Reservas */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-7"
          >
            <BookingWidget />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
