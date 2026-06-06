import { useState, useEffect, useCallback } from 'react';
import { Calendar, Scissors, Clock, Users, RefreshCw } from 'lucide-react';
import { api, type Appointment, ApiError } from '../../lib/api';
import { cn } from '../../utils/cn';

const statusColors: Record<string, string> = {
  pending: 'text-yellow-400 bg-yellow-400/10',
  confirmed: 'text-blue-400 bg-blue-400/10',
  completed: 'text-green-400 bg-green-400/10',
  cancelled: 'text-red-400 bg-red-400/10',
};

const statusLabels: Record<string, string> = {
  pending: 'Pendiente', confirmed: 'Confirmada', completed: 'Completada', cancelled: 'Cancelada',
};

export function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    api.getDashboard()
      .then(setData)
      .catch((e: ApiError) => setError(e.message || 'Error al cargar el dashboard'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      load();
    }, 0);
    return () => clearTimeout(timer);
  }, [load]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-gold border-t-transparent" role="status">
          <span className="sr-only">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400 mb-4" role="alert">{error}</p>
        <button onClick={load} className="inline-flex items-center gap-2 rounded-lg bg-brand-gold px-4 py-2 text-sm font-medium text-brand-dark hover:bg-brand-gold-light transition-colors">
          <RefreshCw size={16} /> Reintentar
        </button>
      </div>
    );
  }

  if (!data) return null;

  const cards = [
    { icon: Calendar, label: 'Citas Hoy', value: data.today_appointments, color: 'text-brand-gold' },
    { icon: Scissors, label: 'Servicios', value: data.total_services, color: 'text-blue-400' },
    { icon: Clock, label: 'Pendientes', value: data.pending_appointments, color: 'text-yellow-400' },
    { icon: Users, label: 'Clientes', value: data.total_clients, color: 'text-green-400' },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-6">Dashboard</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-neutral-800 bg-brand-card p-5">
            <div className="flex items-center gap-3">
              <c.icon size={24} className={c.color} />
              <div>
                <p className="text-2xl font-bold text-white">{c.value}</p>
                <p className="text-xs text-neutral-500">{c.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-neutral-800 bg-brand-card p-5">
        <h3 className="font-semibold text-white mb-4">Próximas Citas</h3>
        {data.upcoming_appointments.length === 0 ? (
          <p className="text-sm text-neutral-500 py-8 text-center">No hay citas próximas</p>
        ) : (
          <div className="space-y-3">
            {data.upcoming_appointments.map((a: Appointment) => (
              <div key={a.id} className="flex items-center justify-between rounded-lg border border-neutral-800 bg-brand-dark p-3">
                <div>
                  <p className="text-sm font-medium text-white">{a.client_name}</p>
                  <p className="text-xs text-neutral-500">{a.service_name} — {a.date} a las {a.time}</p>
                </div>
                <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium', statusColors[a.status] || '')}>
                  {statusLabels[a.status] || a.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
