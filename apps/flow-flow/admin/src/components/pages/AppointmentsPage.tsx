import { useState, useEffect } from 'react';
import { Check, X, Trash2 } from 'lucide-react';
import { api, type Appointment } from '../../lib/api';
import { cn } from '../../utils/cn';

const statusColors: Record<string, string> = {
  pending: 'border-yellow-500/30 bg-yellow-500/5',
  confirmed: 'border-blue-500/30 bg-blue-500/5',
  completed: 'border-green-500/30 bg-green-500/5',
  cancelled: 'border-red-500/30 bg-red-500/5',
};

const statusLabels: Record<string, string> = {
  pending: 'Pendiente', confirmed: 'Confirmada', completed: 'Completada', cancelled: 'Cancelada',
};

export function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  function load() { api.listAppointments(filter || undefined, date).then(setAppointments); }
  useEffect(() => { load(); }, [filter, date]);

  async function changeStatus(id: number, status: string) {
    await api.updateAppointment(id, { status });
    load();
  }

  async function handleDelete(id: number) {
    if (!confirm('¿Eliminar esta cita?')) return;
    await api.deleteAppointment(id);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="text-xl font-bold text-white">Citas</h2>
        <div className="flex gap-3">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
            className="rounded-lg border border-neutral-700 bg-brand-card px-3 py-2 text-sm text-white focus:border-brand-gold focus:outline-none" />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg border border-neutral-700 bg-brand-card px-3 py-2 text-sm text-white focus:border-brand-gold focus:outline-none">
            <option value="">Todas</option>
            <option value="pending">Pendientes</option>
            <option value="confirmed">Confirmadas</option>
            <option value="completed">Completadas</option>
            <option value="cancelled">Canceladas</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {appointments.length === 0 ? (
          <p className="text-sm text-neutral-500">No hay citas para esta fecha</p>
        ) : (
          appointments.map((a) => (
            <div key={a.id} className={cn('rounded-xl border p-4', statusColors[a.status] || 'border-neutral-800 bg-brand-card')}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-white">{a.client_name}</p>
                  <p className="text-xs text-neutral-400">{a.client_phone} {a.client_email && `— ${a.client_email}`}</p>
                  <p className="mt-1 text-sm text-neutral-300">
                    {a.service_name} — <span className="text-brand-gold-light">{a.date}</span> a las <span className="text-brand-gold-light">{a.time}</span>
                  </p>
                  {a.notes && <p className="mt-1 text-xs text-neutral-500 italic">{a.notes}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium', a.status === 'pending' && 'text-yellow-400', a.status === 'confirmed' && 'text-blue-400', a.status === 'completed' && 'text-green-400', a.status === 'cancelled' && 'text-red-400')}>
                    {statusLabels[a.status]}
                  </span>
                  {a.status === 'pending' && (
                    <>
                      <button onClick={() => changeStatus(a.id, 'confirmed')} className="text-blue-400 hover:text-blue-300" title="Confirmar"><Check size={16} /></button>
                      <button onClick={() => changeStatus(a.id, 'cancelled')} className="text-red-400 hover:text-red-300" title="Cancelar"><X size={16} /></button>
                    </>
                  )}
                  {a.status === 'confirmed' && (
                    <button onClick={() => changeStatus(a.id, 'completed')} className="text-green-400 hover:text-green-300" title="Completar"><Check size={16} /></button>
                  )}
                  <button onClick={() => handleDelete(a.id)} className="text-neutral-600 hover:text-red-400" title="Eliminar"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
