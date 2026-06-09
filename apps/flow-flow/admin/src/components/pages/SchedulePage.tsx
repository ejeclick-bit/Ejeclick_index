import { useState, useEffect } from 'react';
import { api, type ScheduleDay } from '../../lib/api';
import { cn } from '../../utils/cn';

const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export function SchedulePage() {
  const [schedule, setSchedule] = useState<ScheduleDay[]>([]);

  useEffect(() => { api.getSchedule().then(setSchedule); }, []);

  async function toggleDay(s: ScheduleDay) {
    const updated = await api.updateSchedule(s.id, { is_active: !s.is_active, day_of_week: s.day_of_week, open_time: s.open_time, close_time: s.close_time });
    setSchedule(schedule.map((d) => (d.id === updated.id ? updated : d)));
  }

  async function updateTime(s: ScheduleDay, field: 'open_time' | 'close_time', value: string) {
    const updated = await api.updateSchedule(s.id, { ...s, [field]: value });
    setSchedule(schedule.map((d) => (d.id === updated.id ? updated : d)));
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-foreground mb-6">Horarios de Atención</h2>

      <div className="space-y-2">
        {schedule.map((s) => (
          <div key={s.id} className="flex items-center gap-4 rounded-xl border border-subtle bg-brand-card p-4">
            <button
              onClick={() => toggleDay(s)}
              className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors',
                s.is_active ? 'bg-green-500/20 text-green-400' : 'bg-neutral-800 text-neutral-600',
              )}
            >
              {s.is_active ? 'ON' : 'OFF'}
            </button>

            <div className="flex-1">
              <p className={cn('font-medium', s.is_active ? 'text-foreground' : 'text-neutral-600')}>
                {dayNames[s.day_of_week]}
              </p>
            </div>

            {s.is_active ? (
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={s.open_time}
                  onChange={(e) => updateTime(s, 'open_time', e.target.value)}
                  className="rounded-lg border border-subtle bg-background px-3 py-2 text-sm text-foreground focus:border-brand-gold focus:outline-none"
                />
                <span className="text-muted/80">a</span>
                <input
                  type="time"
                  value={s.close_time}
                  onChange={(e) => updateTime(s, 'close_time', e.target.value)}
                  className="rounded-lg border border-subtle bg-background px-3 py-2 text-sm text-foreground focus:border-brand-gold focus:outline-none"
                />
              </div>
            ) : (
              <span className="text-sm text-neutral-600">Cerrado</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


