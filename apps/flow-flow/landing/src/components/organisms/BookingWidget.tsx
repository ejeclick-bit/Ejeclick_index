import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar } from '../molecules/Calendar';
import { Button } from '../atoms/Button';
import { api, type Service, type Schedule } from '../../lib/api';

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
      <div className="text-center py-12">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
          <CalendarIcon className="h-8 w-8 text-green-400" />
        </div>
        <h3 className="text-xl font-bold text-white">¡Cita Agendada!</h3>
        <p className="mt-2 text-neutral-400">
          Te enviamos un correo de confirmación a <strong className="text-white">{form.email}</strong>
        </p>
        <p className="text-sm text-neutral-500 mt-1">
          {selectedDate} a las {selectedTime} — {selectedService?.name}
        </p>
        <p className="text-xs text-neutral-600 mt-3">
          ID de cita: <span className="text-brand-gold-light font-mono">{appointmentId}</span>
        </p>
        <a href="#cancelar" className="inline-block mt-4 text-xs text-brand-gold-light underline hover:no-underline">
          ¿Necesitas cancelar?
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-neutral-800 bg-brand-card p-6">
      <div className="flex items-center justify-between mb-6">
        {(['service', 'date', 'time', 'info', 'confirm'] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-1">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ${
              step === s ? 'bg-brand-gold text-brand-dark' :
              ['confirm'].indexOf(step) > i || (step === 'confirm' && done) ? 'bg-green-500/20 text-green-400' :
              'bg-neutral-800 text-neutral-500'
            }`}>
              {['confirm'].indexOf(step) > i ? '✓' : i + 1}
            </div>
            {i < 4 && <div className="hidden sm:block w-4 h-px bg-neutral-800" />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
          {step === 'service' && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">Elige un servicio</h3>
              {services.map((s) => (
                <button key={s.id} onClick={() => { setSelectedService(s); }}
                  className={`w-full rounded-xl border p-4 text-left transition-all ${
                    selectedService?.id === s.id
                      ? 'border-brand-gold bg-brand-gold/5'
                      : 'border-neutral-800 hover:border-neutral-700'
                  }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{s.icon}</span>
                      <div>
                        <p className="font-medium text-white">{s.name}</p>
                        <p className="text-sm text-neutral-400">{s.description}</p>
                      </div>
                    </div>
                    <span className="text-brand-gold-light font-semibold">{s.price}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {step === 'date' && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Elige una fecha</h3>
              <Calendar 
                selected={selectedDate} 
                onChange={(date) => {
                  setSelectedDate(date);
                  setLoadingSlots(true);
                  setSelectedTime('');
                }} 
                disabledDays={disabledDays} 
              />
            </div>
          )}

          {step === 'time' && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Elige un horario</h3>
              {loadingSlots ? (
                <p className="text-neutral-500">Cargando horarios...</p>
              ) : timeSlots.length === 0 ? (
                <p className="text-neutral-500">No hay horarios disponibles para esta fecha.</p>
              ) : (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {timeSlots.map((t) => (
                    <button key={t} onClick={() => setSelectedTime(t)}
                      className={`rounded-lg border py-3 text-sm transition-all ${
                        selectedTime === t
                          ? 'border-brand-gold bg-brand-gold text-brand-dark font-medium'
                          : 'border-neutral-700 text-neutral-300 hover:border-brand-gold/40'
                      }`}>
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 'info' && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Tus datos</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="booking-name" className="block text-sm text-neutral-300 mb-1">Nombre Completo</label>
                  <input id="booking-name" type="text" required value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-lg border border-neutral-700 bg-brand-dark px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-brand-gold focus:outline-none"
                    placeholder="Tu nombre" />
                </div>
                <div>
                  <label htmlFor="booking-phone" className="block text-sm text-neutral-300 mb-1">WhatsApp</label>
                  <input id="booking-phone" type="tel" required value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full rounded-lg border border-neutral-700 bg-brand-dark px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-brand-gold focus:outline-none"
                    placeholder="+57 300 000 0000" />
                </div>
                <div>
                  <label htmlFor="booking-email" className="block text-sm text-neutral-300 mb-1">Correo Electrónico</label>
                  <input id="booking-email" type="email" required value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-lg border border-neutral-700 bg-brand-dark px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-brand-gold focus:outline-none"
                    placeholder="correo@ejemplo.com" />
                </div>
              </div>
            </div>
          )}

          {step === 'confirm' && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Confirma tu cita</h3>
              <div className="space-y-3 rounded-lg border border-neutral-800 bg-brand-dark p-4">
                <div className="flex justify-between text-sm"><span className="text-neutral-400">Servicio</span><span className="text-white">{selectedService?.name}</span></div>
                <div className="flex justify-between text-sm"><span className="text-neutral-400">Fecha</span><span className="text-white">{selectedDate}</span></div>
                <div className="flex justify-between text-sm"><span className="text-neutral-400">Hora</span><span className="text-white">{selectedTime}</span></div>
                <div className="flex justify-between text-sm"><span className="text-neutral-400">Cliente</span><span className="text-white">{form.name}</span></div>
                <div className="flex justify-between text-sm"><span className="text-neutral-400">WhatsApp</span><span className="text-white">{form.phone}</span></div>
                <div className="flex justify-between text-sm"><span className="text-neutral-400">Email</span><span className="text-white">{form.email}</span></div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-6">
        <Button variant="ghost" onClick={back} disabled={step === 'service'}>Atrás</Button>
        {step === 'confirm' ? (
          <Button variant="primary" onClick={handleConfirm} isLoading={sending}>Confirmar Cita</Button>
        ) : (
          <Button variant="primary" onClick={next} disabled={!canNext()}>Continuar</Button>
        )}
      </div>
    </div>
  );
}
