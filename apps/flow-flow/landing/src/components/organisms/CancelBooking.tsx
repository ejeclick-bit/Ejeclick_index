import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { XCircle, Clock } from 'lucide-react';
import { Container } from '../atoms/Container';
import { Badge } from '@ejeclick/ui-components';
import { Button } from '@ejeclick/ui-components';
import { api } from '../../lib/api';

export function CancelBooking() {
  const [step, setStep] = useState<'find' | 'select' | 'done'>('find');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState<{ id: number; date: string; time: string; service_name: string; status: string }[]>([]);
  const [cancelling, setCancelling] = useState<number | null>(null);
  const [result, setResult] = useState<{ date: string; time: string } | null>(null);

  async function handleFind(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (!email || !phone) {
      setError('Completa todos los campos');
      return;
    }
    setLoading(true);
    try {
      const matches = await api.searchAppointments(email, phone);
      if (matches.length === 0) {
        setError('No se encontró ninguna cita activa con ese email y teléfono.');
      } else {
        setAppointments(matches);
        setStep('select');
      }
    } catch {
      setError('Error al buscar tus citas. Intenta de nuevo.');
    }
    setLoading(false);
  }

  async function handleCancel(id: number) {
    setCancelling(id);
    try {
      const res = await api.cancelAppointment(id, email, phone);
      setResult(res);
      setStep('done');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al cancelar';
      setError(msg);
    }
    setCancelling(null);
  }

  function reset() {
    setStep('find');
    setEmail('');
    setPhone('');
    setError('');
    setAppointments([]);
    setResult(null);
  }

  return (
    <section id="cancelar" className="bg-background py-24">
      <Container>
        <div className="mx-auto max-w-md">
          <div className="mb-8 text-center">
            <Badge variant="gold">Cancelar Cita</Badge>
            <h2 className="mt-4 font-display text-3xl font-bold text-foreground sm:text-4xl">
              ¿No puedes asistir?
            </h2>
            <p className="mt-3 text-muted">
              Cancela tu cita sin problema. Solo necesitas 1 hora de anticipación.
            </p>
          </div>

          {step === 'done' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-xl border border-green-500/20 bg-green-500/5 p-8 text-center"
            >
              <XCircle className="mx-auto mb-4 h-12 w-12 text-green-400" />
              <h3 className="text-lg font-semibold text-foreground">Cita Cancelada</h3>
              <p className="mt-2 text-sm text-muted">
                Tu cita del {result?.date} a las {result?.time} ha sido cancelada.
              </p>
              <p className="mt-1 text-xs text-muted/80">El horario queda liberado para otros clientes.</p>
              <Button variant="ghost" className="mt-6" onClick={reset}>
                Cancelar otra cita
              </Button>
            </motion.div>
          ) : step === 'select' ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-subtle bg-brand-card p-6"
            >
              <h3 className="font-semibold text-foreground mb-4">Tus citas activas</h3>

              {error && (
                <div className="mb-4">
                  <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-left">
                    <Clock className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
                    <div>
                      <p className="text-sm font-medium text-amber-300">No se puede cancelar</p>
                      <p className="mt-1 text-sm text-amber-200/70">{error}</p>
                      <p className="mt-2 text-xs text-amber-200/50">Si necesitas ayuda, contáctanos por WhatsApp.</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {appointments.map((a) => (
                  <div key={a.id} className="flex items-center justify-between rounded-lg border border-subtle bg-background p-4">
                    <div>
                      <p className="font-medium text-foreground">{a.service_name}</p>
                      <p className="text-sm text-muted">{a.date} a las {a.time}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      isLoading={cancelling === a.id}
                      onClick={() => handleCancel(a.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Cancelar
                    </Button>
                  </div>
                ))}
              </div>

              <div className="mt-4 border-t border-subtle pt-4">
                <p className="text-xs text-muted/80 mb-2">La cancelación es reversible desde el admin.</p>
                <Button variant="ghost" size="sm" onClick={reset}>
                  Volver
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.form
              onSubmit={handleFind}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-subtle bg-brand-card p-6 space-y-4"
            >
              {error && (
                <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-left" role="alert">
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="cancel-email" className="block text-sm font-medium text-foreground/80">Correo Electrónico</label>
                <input id="cancel-email" type="email" required value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-subtle bg-background px-4 py-2.5 text-sm text-foreground placeholder-neutral-500 focus:border-brand-gold focus:outline-none"
                  placeholder="El mismo que usaste al agendar" />
              </div>
              <div>
                <label htmlFor="cancel-phone" className="block text-sm font-medium text-foreground/80">WhatsApp</label>
                <input id="cancel-phone" type="tel" required value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-subtle bg-background px-4 py-2.5 text-sm text-foreground placeholder-neutral-500 focus:border-brand-gold focus:outline-none"
                  placeholder="El mismo que usaste al agendar" />
              </div>
              <button type="submit" disabled={loading} className="group flex w-full items-center justify-center gap-2 rounded-lg px-8 py-3 text-sm font-medium transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
                style={{
                  background: 'var(--theme-accent)',
                  color: 'var(--theme-background)',
                }}>
                {loading ? 'Buscando...' : 'Buscar mi cita'}
              </button>
            </motion.form>
          )}
        </div>
      </Container>
    </section>
  );
}
