import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, CheckCircle2, ChevronRight, Clock, User, Phone, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar } from '../molecules/Calendar';
import { Button } from '@ejeclick/ui-components';
import { api, type Service, type Schedule } from '../../lib/api';
import { cn } from '../../utils/cn';

type Step = 'service' | 'date' | 'time' | 'info' | 'confirm';

export function BookingWidget() {
  const [step, setStep] = useState<Step>('service');
  const [services, setServices] = useState<Service[]>([]);
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [appointmentId, setAppointmentId] = useState(0);

  const [form, setForm] = useState({ name: '', phone: '', email: '' });

  useEffect(() => { 
    api.services().then(setServices);
    api.schedule().then(setSchedule);
  }, []);

  useEffect(() => {
    if (!selectedDate) return;
    let active = true;
    setTimeout(() => {
      if (active) setLoadingSlots(true);
    }, 0);
    api.availability(selectedDate)
      .then((r) => {
        if (!active) return;
        setTimeSlots(r.slots || []);
        if (!r.available) setTimeSlots([]);
      })
      .catch(() => {
        if (active) setTimeSlots([]);
      })
      .finally(() => {
        if (active) setLoadingSlots(false);
      });
    return () => { active = false; };
  }, [selectedDate]);

  function canNext(): boolean {
    if (step === 'service') return !!selectedService;
    if (step === 'date') return !!selectedDate;
    if (step === 'time') return !!selectedTime;
    if (step === 'info') return !!form.name && !!form.phone && !!form.email;
    return true;
  }

  function next() {
    const order: Step[] = ['service', 'date', 'time', 'info', 'confirm'];
    const idx = order.indexOf(step);
    if (idx < order.length - 1) setStep(order[idx + 1]);
  }

  function back() {
    const order: Step[] = ['service', 'date', 'time', 'info', 'confirm'];
    const idx = order.indexOf(step);
    if (idx > 0) setStep(order[idx - 1]);
  }

  async function handleConfirm() {
    setSending(true);
    try {
      const res = await api.createAppointment({
        client_name: form.name,
        client_phone: form.phone,
        client_email: form.email,
        service_id: selectedService?.id,
        service_name: selectedService?.name || '',
        date: selectedDate,
        time: selectedTime,
      });
      setAppointmentId((res as { id: number }).id);
      setDone(true);
    } catch {
      alert('Error al agendar. Intenta de nuevo.');
    }
    setSending(false);
  }

  function disabledDays(dateStr: string): boolean {
    const d = new Date(dateStr);
    const day = d.getDay();
    const daySchedule = schedule.find(s => s.day_of_week === day);
    return daySchedule ? !daySchedule.is_active : false;
  }

  if (done) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border p-12 text-center shadow-2xl"
        style={{ borderColor: 'var(--theme-border)', background: 'var(--theme-card)' }}
      >
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full" style={{ background: 'var(--theme-accent-dim)' }}>
          <CheckCircle2 className="h-12 w-12" style={{ color: 'var(--theme-accent)' }} />
        </div>
        <h3 className="font-display text-3xl font-bold" style={{ color: 'var(--theme-foreground)' }}>¡Cita Confirmada!</h3>
        <p className="mt-4 text-base" style={{ color: 'var(--theme-muted)' }}>
          Tu espacio ha sido reservado. Te enviamos los detalles a <br/><strong style={{ color: 'var(--theme-foreground)' }}>{form.email}</strong>
        </p>
        
        <div className="mx-auto mt-8 max-w-sm rounded-xl border p-6 text-left" style={{ borderColor: 'var(--theme-border)', background: 'var(--theme-surface)' }}>
          <div className="flex items-center gap-3 mb-4">
             <span className="text-2xl">{selectedService?.icon}</span>
             <div>
               <p className="font-medium" style={{ color: 'var(--theme-foreground)' }}>{selectedService?.name}</p>
               <p className="text-sm" style={{ color: 'var(--theme-accent)' }}>{selectedDate} a las {selectedTime}</p>
             </div>
          </div>
          <div className="mt-4 border-t pt-4 text-center" style={{ borderColor: 'var(--theme-border)' }}>
             <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--theme-muted)' }}>Código de Reserva</p>
             <p className="mt-1 font-mono text-lg font-medium" style={{ color: 'var(--theme-foreground)' }}>#{appointmentId.toString().padStart(5, '0')}</p>
          </div>
        </div>

        <button 
          onClick={() => window.location.reload()} 
          className="mt-8 text-sm font-medium hover:underline"
          style={{ color: 'var(--theme-accent)' }}
        >
          Agendar otra cita
        </button>
      </motion.div>
    );
  }

  const steps = [
    { id: 'service', label: 'Servicio' },
    { id: 'date', label: 'Fecha' },
    { id: 'time', label: 'Hora' },
    { id: 'info', label: 'Datos' },
    { id: 'confirm', label: 'Confirmar' }
  ];

  return (
    <div className="rounded-2xl border shadow-xl overflow-hidden" style={{ borderColor: 'var(--theme-border)', background: 'var(--theme-card)' }}>
      {/* Header del Widget */}
      <div className="border-b px-6 py-5" style={{ borderColor: 'var(--theme-border)', background: 'var(--theme-surface)' }}>
        <div className="flex items-center justify-between">
          {steps.map((s, i) => {
            const isPast = steps.findIndex(x => x.id === step) > i;
            const isCurrent = step === s.id;
            return (
              <div key={s.id} className="flex items-center">
                <div className={cn(
                  "flex flex-col items-center gap-1.5 transition-colors duration-300",
                  isCurrent || isPast ? "opacity-100" : "opacity-40"
                )}>
                  <div className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold border-2",
                    isCurrent ? "border-transparent text-[var(--theme-background)] bg-[var(--theme-accent)] shadow-[0_0_15px_var(--theme-accent-dim)]" :
                    isPast ? "border-transparent bg-[var(--theme-accent-dim)] text-[var(--theme-accent)]" :
                    "border-[var(--theme-border)] text-[var(--theme-muted)] bg-transparent"
                  )}>
                    {isPast ? <CheckCircle2 size={16} /> : i + 1}
                  </div>
                  <span className="hidden text-xs font-medium sm:block" style={{ color: isCurrent || isPast ? 'var(--theme-foreground)' : 'var(--theme-muted)' }}>
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className="mx-2 h-px w-8 sm:w-12" style={{ background: isPast ? 'var(--theme-accent)' : 'var(--theme-border)' }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Contenido del Widget */}
      <div className="p-6 sm:p-8 min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div 
            key={step} 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }} 
            transition={{ duration: 0.25 }}
            className="h-full"
          >
            {step === 'service' && (
              <div className="space-y-4">
                <div className="mb-6">
                  <h3 className="text-xl font-bold" style={{ color: 'var(--theme-foreground)' }}>Selecciona un servicio</h3>
                  <p className="text-sm mt-1" style={{ color: 'var(--theme-muted)' }}>Elige la experiencia que deseas vivir hoy.</p>
                </div>
                
                <div className="grid gap-3 sm:grid-cols-2">
                  {services.map((s) => {
                    const isSelected = selectedService?.id === s.id;
                    return (
                      <button 
                        key={s.id} 
                        onClick={() => setSelectedService(s)}
                        className={cn(
                          "group relative flex flex-col items-start rounded-xl border p-5 text-left transition-all duration-300",
                          isSelected ? "shadow-md" : "hover:shadow-sm"
                        )}
                        style={{ 
                          borderColor: isSelected ? 'var(--theme-accent)' : 'var(--theme-border)',
                          background: isSelected ? 'var(--theme-accent-dim)' : 'transparent'
                        }}
                      >
                        {isSelected && (
                          <div className="absolute top-4 right-4 text-[var(--theme-accent)]">
                            <CheckCircle2 size={20} fill="currentColor" className="text-[var(--theme-background)]" />
                          </div>
                        )}
                        <span className="text-3xl mb-3">{s.icon}</span>
                        <p className="font-semibold text-lg" style={{ color: 'var(--theme-foreground)' }}>{s.name}</p>
                        <p className="text-sm mt-1 mb-4 line-clamp-2" style={{ color: 'var(--theme-muted)' }}>{s.description}</p>
                        <span className="mt-auto inline-flex rounded-md px-2.5 py-1 text-sm font-medium border" style={{ 
                          background: isSelected ? 'var(--theme-accent)' : 'var(--theme-surface)',
                          color: isSelected ? 'var(--theme-background)' : 'var(--theme-foreground)',
                          borderColor: isSelected ? 'transparent' : 'var(--theme-border)'
                        }}>
                          {s.price}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 'date' && (
              <div>
                <div className="mb-6">
                  <h3 className="text-xl font-bold" style={{ color: 'var(--theme-foreground)' }}>Selecciona una fecha</h3>
                  <p className="text-sm mt-1" style={{ color: 'var(--theme-muted)' }}>Los días grises no están disponibles.</p>
                </div>
                <div className="mx-auto max-w-md rounded-xl border p-4" style={{ borderColor: 'var(--theme-border)', background: 'var(--theme-surface)' }}>
                  <Calendar 
                    selected={selectedDate} 
                    onChange={(date) => {
                      setSelectedDate(date);
                      setSelectedTime('');
                    }} 
                    disabledDays={disabledDays} 
                  />
                </div>
              </div>
            )}

            {step === 'time' && (
              <div>
                <div className="mb-6">
                  <h3 className="text-xl font-bold" style={{ color: 'var(--theme-foreground)' }}>Horarios disponibles</h3>
                  <p className="text-sm mt-1" style={{ color: 'var(--theme-muted)' }}>Para el {selectedDate}</p>
                </div>
                
                {loadingSlots ? (
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="h-12 animate-pulse rounded-lg opacity-50" style={{ background: 'var(--theme-border)' }} />
                    ))}
                  </div>
                ) : timeSlots.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-12" style={{ borderColor: 'var(--theme-border)' }}>
                    <Clock className="mb-3 h-8 w-8 opacity-20" style={{ color: 'var(--theme-foreground)' }} />
                    <p style={{ color: 'var(--theme-muted)' }}>No hay horarios disponibles para esta fecha.</p>
                    <button onClick={back} className="mt-4 text-sm font-medium hover:underline" style={{ color: 'var(--theme-accent)' }}>
                      Elegir otra fecha
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
                    {timeSlots.map((t) => {
                      const isSelected = selectedTime === t;
                      return (
                        <button 
                          key={t} 
                          onClick={() => setSelectedTime(t)}
                          className={cn(
                            "rounded-lg border py-3 text-sm font-medium transition-all duration-200",
                            isSelected ? "shadow-md scale-105" : "hover:border-[var(--theme-accent)]"
                          )}
                          style={{
                            borderColor: isSelected ? 'var(--theme-accent)' : 'var(--theme-border)',
                            background: isSelected ? 'var(--theme-accent)' : 'var(--theme-surface)',
                            color: isSelected ? 'var(--theme-background)' : 'var(--theme-foreground)'
                          }}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {step === 'info' && (
              <div className="mx-auto max-w-md">
                <div className="mb-6 text-center">
                  <h3 className="text-xl font-bold" style={{ color: 'var(--theme-foreground)' }}>Tus Datos</h3>
                  <p className="text-sm mt-1" style={{ color: 'var(--theme-muted)' }}>Necesitamos esta información para confirmar la cita.</p>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <label htmlFor="booking-name" className="mb-1.5 flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--theme-foreground)' }}>
                      <User size={16} style={{ color: 'var(--theme-accent)' }} /> Nombre Completo
                    </label>
                    <input id="booking-name" type="text" required value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full rounded-lg border px-4 py-3 text-sm transition-colors focus:outline-none focus:ring-1"
                      style={{ 
                        background: 'var(--theme-surface)', 
                        borderColor: 'var(--theme-border)', 
                        color: 'var(--theme-foreground)',
                        '--tw-ring-color': 'var(--theme-accent)'
                      } as React.CSSProperties}
                      placeholder="Ej. Juan Pérez" />
                  </div>
                  <div>
                    <label htmlFor="booking-phone" className="mb-1.5 flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--theme-foreground)' }}>
                      <Phone size={16} style={{ color: 'var(--theme-accent)' }} /> WhatsApp
                    </label>
                    <input id="booking-phone" type="tel" required value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full rounded-lg border px-4 py-3 text-sm transition-colors focus:outline-none focus:ring-1"
                      style={{ 
                        background: 'var(--theme-surface)', 
                        borderColor: 'var(--theme-border)', 
                        color: 'var(--theme-foreground)',
                        '--tw-ring-color': 'var(--theme-accent)'
                      } as React.CSSProperties}
                      placeholder="+57 300 000 0000" />
                  </div>
                  <div>
                    <label htmlFor="booking-email" className="mb-1.5 flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--theme-foreground)' }}>
                      <Mail size={16} style={{ color: 'var(--theme-accent)' }} /> Correo Electrónico
                    </label>
                    <input id="booking-email" type="email" required value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full rounded-lg border px-4 py-3 text-sm transition-colors focus:outline-none focus:ring-1"
                      style={{ 
                        background: 'var(--theme-surface)', 
                        borderColor: 'var(--theme-border)', 
                        color: 'var(--theme-foreground)',
                        '--tw-ring-color': 'var(--theme-accent)'
                      } as React.CSSProperties}
                      placeholder="correo@ejemplo.com" />
                  </div>
                </div>
              </div>
            )}

            {step === 'confirm' && (
              <div className="mx-auto max-w-lg">
                <div className="mb-6 text-center">
                  <h3 className="text-xl font-bold" style={{ color: 'var(--theme-foreground)' }}>Resumen de Cita</h3>
                  <p className="text-sm mt-1" style={{ color: 'var(--theme-muted)' }}>Revisa los detalles antes de confirmar.</p>
                </div>
                
                <div className="overflow-hidden rounded-xl border shadow-sm" style={{ borderColor: 'var(--theme-border)', background: 'var(--theme-surface)' }}>
                  {/* Banner superior */}
                  <div className="p-6 text-center" style={{ background: 'var(--theme-accent-dim)' }}>
                    <span className="text-4xl">{selectedService?.icon}</span>
                    <h4 className="mt-3 text-xl font-bold" style={{ color: 'var(--theme-foreground)' }}>{selectedService?.name}</h4>
                    <p className="mt-1 font-semibold" style={{ color: 'var(--theme-accent)' }}>{selectedService?.price}</p>
                  </div>
                  
                  {/* Detalles */}
                  <div className="divide-y p-6" style={{ borderColor: 'var(--theme-border)' }}>
                    <div className="flex justify-between py-3">
                      <span className="flex items-center gap-2 text-sm" style={{ color: 'var(--theme-muted)' }}><CalendarIcon size={16}/> Fecha</span>
                      <span className="font-medium" style={{ color: 'var(--theme-foreground)' }}>{selectedDate}</span>
                    </div>
                    <div className="flex justify-between py-3">
                      <span className="flex items-center gap-2 text-sm" style={{ color: 'var(--theme-muted)' }}><Clock size={16}/> Hora</span>
                      <span className="font-medium" style={{ color: 'var(--theme-foreground)' }}>{selectedTime}</span>
                    </div>
                    <div className="flex justify-between py-3">
                      <span className="flex items-center gap-2 text-sm" style={{ color: 'var(--theme-muted)' }}><User size={16}/> Cliente</span>
                      <span className="font-medium" style={{ color: 'var(--theme-foreground)' }}>{form.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer del Widget */}
      <div className="border-t px-6 py-5 flex items-center justify-between" style={{ borderColor: 'var(--theme-border)', background: 'var(--theme-surface)' }}>
        <button 
          onClick={back} 
          disabled={step === 'service'}
          className="px-4 py-2 text-sm font-medium transition-colors disabled:opacity-0 disabled:pointer-events-none hover:underline"
          style={{ color: 'var(--theme-muted)' }}
        >
          Volver atrás
        </button>
        
        {step === 'confirm' ? (
          <Button variant="primary" onClick={handleConfirm} isLoading={sending} className="min-w-[160px]">
            Confirmar Reserva
          </Button>
        ) : (
          <Button variant="primary" onClick={next} disabled={!canNext()} className="min-w-[140px]">
            Continuar <ChevronRight size={16} />
          </Button>
        )}
      </div>
    </div>
  );
}
