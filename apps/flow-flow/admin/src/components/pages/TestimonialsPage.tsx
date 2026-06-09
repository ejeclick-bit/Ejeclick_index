import { useState, useEffect, type FormEvent } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { api, type Testimonial } from '../../lib/api';

export function TestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ quote: '', author: '', role: '' });

  function load() { api.listTestimonials(true).then(setItems); }
  useEffect(() => { load(); }, []);

  function openEdit(t: Testimonial) { setEditing(t); setForm({ quote: t.quote, author: t.author, role: t.role }); setShowForm(true); }
  function openNew() { setEditing(null); setForm({ quote: '', author: '', role: '' }); setShowForm(true); }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (editing) await api.updateTestimonial(editing.id, form);
    else await api.createTestimonial(form);
    setShowForm(false);
    load();
  }

  async function handleDelete(id: number) {
    if (!confirm('¿Eliminar este testimonio?')) return;
    await api.deleteTestimonial(id);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Testimonios</h2>
        <button onClick={openNew} className="flex items-center gap-2 rounded-lg bg-brand-gold px-4 py-2 text-sm font-medium text-brand-dark hover:bg-brand-gold-light transition-colors">
          <Plus size={16} /> Nuevo Testimonio
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowForm(false)}>
          <div className="w-full max-w-md rounded-xl border border-subtle bg-brand-card p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">{editing ? 'Editar' : 'Nuevo'} Testimonio</h3>
              <button onClick={() => setShowForm(false)} className="text-muted/80 hover:text-foreground"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-foreground/80 mb-1">Cita</label>
                <textarea required value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })}
                  className="w-full rounded-lg border border-subtle bg-background px-3 py-2 text-sm text-foreground focus:border-brand-gold focus:outline-none" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-foreground/80 mb-1">Autor</label>
                  <input required value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })}
                    className="w-full rounded-lg border border-subtle bg-background px-3 py-2 text-sm text-foreground focus:border-brand-gold focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-foreground/80 mb-1">Rol</label>
                  <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full rounded-lg border border-subtle bg-background px-3 py-2 text-sm text-foreground focus:border-brand-gold focus:outline-none" />
                </div>
              </div>
              <button type="submit" className="w-full rounded-lg bg-brand-gold py-2 text-sm font-medium text-brand-dark hover:bg-brand-gold-light transition-colors">
                {editing ? 'Guardar Cambios' : 'Crear Testimonio'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-muted/80">No hay testimonios. Crea el primero.</p>
        ) : (
          items.map((t) => (
            <div key={t.id} className="rounded-xl border border-subtle bg-brand-card p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm text-foreground/80 italic">"{t.quote}"</p>
                  <p className="mt-2 text-sm font-medium text-foreground">{t.author}</p>
                  {t.role && <p className="text-xs text-muted/80">{t.role}</p>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => openEdit(t)} className="text-muted/80 hover:text-foreground"><Pencil size={16} /></button>
                  <button onClick={() => handleDelete(t.id)} className="text-muted/80 hover:text-red-400"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
