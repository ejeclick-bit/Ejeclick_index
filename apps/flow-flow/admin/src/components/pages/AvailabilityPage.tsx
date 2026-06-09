import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Plus, Trash2 } from 'lucide-react';
import { api, type DayOverride, type TimeBlock } from '../../lib/api';
import { cn } from '../../utils/cn';

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

function fmt(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function AvailabilityPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [overrides, setOverrides] = useState<Record<string, DayOverride>>({});
  const [selectedDate, setSelectedDate] = useState('');
  const [blocks, setBlocks] = useState<TimeBlock[]>([]);

  const [form, setForm] = useState({ isActive: false, openTime: '', closeTime: '', reason: '' });
  const [blockForm, setBlockForm] = useState({ startTime: '', endTime: '', reason: '' });

  function loadOverrides() {
    const start = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const end = `${year}-${String(month + 2 > 12 ? 1 : month + 2).padStart(2, '0')}-01`;
    api.listOverrides(start, end).then((list) => {
      const map: Record<string, DayOverride> = {};
      list.forEach((o) => { map[o.date] = o; });
      setOverrides(map);
    });
  }

  useEffect(() => { loadOverrides(); }, [year, month]);

  function selectDate(dateStr: string) {
    setSelectedDate(dateStr);
    const existing = overrides[dateStr];
    setForm({
      isActive: existing?.is_active ?? true,
      openTime: existing?.open_time ?? '09:00',
      closeTime: existing?.close_time ?? '20:00',
      reason: existing?.reason ?? '',
    });
    api.listBlocks(dateStr).then(setBlocks);
  }

  async function saveOverride() {
    try {
      await api.saveOverride(selectedDate, {
        is_active: form.isActive,
        open_time: form.openTime,
        close_time: form.closeTime,
        reason: form.reason,
      });
      loadOverrides();
    } catch {
      alert('Error al guardar. Verifica que el backend esté corriendo.');
    }
  }

  async function deleteOverride() {
    try {
      await api.deleteOverride(selectedDate);
      loadOverrides();
      setSelectedDate('');
    } catch {
      alert('Error al eliminar el override.');
    }
  }

  async function addBlock() {
    if (!blockForm.startTime || !blockForm.endTime) return;
    try {
      await api.createBlock({ date: selectedDate, start_time: blockForm.startTime, end_time: blockForm.endTime, reason: blockForm.reason });
      setBlockForm({ startTime: '', endTime: '', reason: '' });
      api.listBlocks(selectedDate).then(setBlocks);
    } catch {
      alert('Error al agregar el bloque.');
    }
  }

  async function removeBlock(id: number) {
    try {
      await api.deleteBlock(id);
      api.listBlocks(selectedDate).then(setBlocks);
    } catch {
      alert('Error al eliminar el bloque.');
    }
  }

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div>
      <h2 className="text-xl font-bold text-foreground mb-6">Disponibilidad</h2>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-subtle bg-brand-card p-5">
            <div className="flex items-center justify-between mb-6">
              <button onClick={() => { if (month === 0) { setYear(y => y - 1); setMonth(11); } else setMonth(m => m - 1); }}
                className="rounded-lg p-2 text-muted hover:text-foreground hover:bg-foreground/5">
                <ChevronLeft size={20} />
              </button>
              <span className="text-lg font-semibold text-foreground">{MONTHS[month]} {year}</span>
              <button onClick={() => { if (month === 11) { setYear(y => y + 1); setMonth(0); } else setMonth(m => m + 1); }}
                className="rounded-lg p-2 text-muted hover:text-foreground hover:bg-foreground/5">
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS.map(d => <div key={d} className="text-center text-xs font-medium text-muted/80 py-1">{d}</div>)}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {cells.map((day, i) => {
                if (!day) return <div key={i} />;
                const dateStr = fmt(new Date(year, month, day));
                const past = new Date(dateStr) < new Date(fmt(today));
                const ov = overrides[dateStr];
                const isSelected = selectedDate === dateStr;
                let bg: string;
                let border = '';
                if (!ov || ov.is_active) bg = 'hover:bg-green-500/10 bg-green-500/5';
                else bg = 'hover:bg-red-500/10 bg-red-500/5';
                if (isSelected) border = 'ring-2 ring-brand-gold';

                return (
                  <button key={i} onClick={() => !past && selectDate(dateStr)} disabled={past}
                    className={cn(
                      'aspect-square rounded-lg text-sm transition-colors flex items-center justify-center',
                      past ? 'text-neutral-700 cursor-not-allowed bg-transparent' : 'text-foreground cursor-pointer',
                      bg, border,
                    )}>
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div>
          {selectedDate ? (
            <div className="rounded-xl border border-subtle bg-brand-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">{selectedDate}</h3>
                <button onClick={() => setSelectedDate('')} className="text-muted/80 hover:text-foreground"><X size={18} /></button>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={!form.isActive} onChange={() => setForm({ ...form, isActive: !form.isActive })}
                    className="rounded border-neutral-600 bg-neutral-800 accent-red-500" />
                  <span className="text-sm">Día cerrado (no disponible)</span>
                </label>

                {form.isActive && (
                  <div className="flex items-center gap-2">
                    <input type="time" value={form.openTime} onChange={(e) => setForm({ ...form, openTime: e.target.value })}
                      className="rounded-lg border border-subtle bg-background px-3 py-2 text-sm text-foreground focus:border-brand-gold focus:outline-none" />
                    <span className="text-muted/80">a</span>
                    <input type="time" value={form.closeTime} onChange={(e) => setForm({ ...form, closeTime: e.target.value })}
                      className="rounded-lg border border-subtle bg-background px-3 py-2 text-sm text-foreground focus:border-brand-gold focus:outline-none" />
                  </div>
                )}

                <div>
                  <label className="text-xs text-muted/80">Motivo (opcional)</label>
                  <input type="text" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-subtle bg-background px-3 py-2 text-sm text-foreground placeholder-neutral-500 focus:border-brand-gold focus:outline-none"
                    placeholder="Ej: Cita médica, vacaciones..." />
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={saveOverride}
                  className="flex-1 rounded-lg bg-brand-gold px-4 py-2 text-sm font-medium text-brand-dark hover:bg-brand-gold-light transition-colors">
                  Guardar
                </button>
                {overrides[selectedDate] && (
                  <button onClick={deleteOverride}
                    className="rounded-lg border border-red-800 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                    Restaurar
                  </button>
                )}
              </div>

              <div className="border-t border-subtle pt-4">
                <h4 className="text-sm font-medium text-foreground mb-3">Bloqueos de tiempo (almuerzos, reuniones)</h4>
                <div className="space-y-2 mb-3">
                  {blocks.map((b) => (
                    <div key={b.id} className="flex items-center justify-between rounded-lg bg-neutral-800/50 px-3 py-2">
                      <span className="text-sm text-foreground/80">{b.start_time} - {b.end_time}</span>
                      <div className="flex items-center gap-2">
                        {b.reason && <span className="text-xs text-muted/80">{b.reason}</span>}
                        <button onClick={() => removeBlock(b.id)} className="text-muted/80 hover:text-red-400"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input type="time" value={blockForm.startTime} onChange={(e) => setBlockForm({ ...blockForm, startTime: e.target.value })}
                    className="flex-1 rounded-lg border border-subtle bg-background px-2 py-1.5 text-sm text-foreground focus:border-brand-gold focus:outline-none" />
                  <input type="time" value={blockForm.endTime} onChange={(e) => setBlockForm({ ...blockForm, endTime: e.target.value })}
                    className="flex-1 rounded-lg border border-subtle bg-background px-2 py-1.5 text-sm text-foreground focus:border-brand-gold focus:outline-none" />
                  <button onClick={addBlock}
                    className="rounded-lg border border-subtle p-1.5 text-muted hover:text-foreground hover:border-neutral-500">
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-subtle p-8 text-center">
              <p className="text-muted/80">Selecciona un día del calendario para configurar su disponibilidad</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
