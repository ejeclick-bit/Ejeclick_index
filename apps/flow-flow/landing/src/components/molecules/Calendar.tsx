import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

interface CalendarProps {
  selected: string;
  onChange: (date: string) => void;
  disabledDays?: (dateStr: string) => boolean;
}

function getDayGrid(year: number, month: number): (number | null)[][] {
  const first = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const grid: (number | null)[][] = [];
  let row: (number | null)[] = [];
  for (let i = 0; i < first; i++) row.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    row.push(d);
    if (row.length === 7) { grid.push(row); row = []; }
  }
  if (row.length) { while (row.length < 7) row.push(null); grid.push(row); }
  return grid;
}

export function Calendar({ selected, onChange, disabledDays }: CalendarProps) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const grid = getDayGrid(year, month);
  const fmt = (d: number) => `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const isPast = (d: number) => new Date(year, month, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => { if (month === 0) { setYear(y => y - 1); setMonth(11); } else setMonth(m => m - 1); }}
          className="rounded-lg p-2 text-neutral-400 hover:text-white hover:bg-white/5 transition-colors" aria-label="Mes anterior">
          <ChevronLeft size={20} />
        </button>
        <span className="text-sm font-semibold text-white">{MONTHS[month]} {year}</span>
        <button onClick={() => { if (month === 11) { setYear(y => y + 1); setMonth(0); } else setMonth(m => m + 1); }}
          className="rounded-lg p-2 text-neutral-400 hover:text-white hover:bg-white/5 transition-colors" aria-label="Mes siguiente">
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map(d => <div key={d} className="text-center text-[11px] font-medium text-neutral-500 py-1">{d}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {grid.map((week, wi) =>
          week.map((day, di) => {
            if (!day) return <div key={`${wi}-${di}`} />;
            const dateStr = fmt(day);
            const disabled = isPast(day) || disabledDays?.(dateStr) === true;
            return (
              <button
                key={dateStr}
                onClick={() => !disabled && onChange(dateStr)}
                disabled={disabled}
                className={cn(
                  'aspect-square rounded-lg text-sm transition-colors',
                  selected === dateStr
                    ? 'bg-brand-gold text-brand-dark font-semibold'
                    : disabled
                      ? 'text-neutral-700 cursor-not-allowed'
                      : 'text-neutral-300 hover:bg-white/5',
                )}
              >
                {day}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
