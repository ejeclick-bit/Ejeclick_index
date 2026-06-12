import { useState, useEffect, type FormEvent } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { api, type Service } from '../../lib/api';
import { useConfirm } from '../../hooks/useConfirm';
import { cn } from '../../utils/cn';

export function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [editing, setEditing] = useState<Service | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', price: '', icon: '✂️', is_active: true });
  const { confirm, ModalComponent } = useConfirm();

  function load() { api.listServices(true).then(setServices); }
  useEffect(() => { load(); }, []);

  function openEdit(s: Service) { setEditing(s); setForm({ name: s.name, description: s.description, price: s.price, icon: s.icon, is_active: s.is_active }); setShowForm(true); }
  function openNew() { setEditing(null); setForm({ name: '', description: '', price: '', icon: '✂️', is_active: true }); setShowForm(true); }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (editing) {
      await api.updateService(editing.id, form);
    } else {
      await api.createService(form);
    }
    setShowForm(false);
    load();
  }

  async function toggleActive(s: Service) {
    await api.updateService(s.id, { is_active: !s.is_active });
    load();
  }

  function handleDelete(id: number) {
    confirm('¿Seguro que deseas eliminar este servicio permanentemente?', async () => {
      await api.deleteService(id);
      load();
    });
  }

  return (
    <div>
      <ModalComponent />
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Servicios</h2>
        <button onClick={openNew} className="flex items-center gap-2 rounded-lg bg-brand-gold px-4 py-2 text-sm font-medium text-brand-dark hover:bg-brand-gold-light transition-colors">
          <Plus size={16} /> Nuevo Servicio
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowForm(false)}>
          <div className="w-full max-w-md rounded-xl border border-subtle bg-brand-card p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">{editing ? 'Editar' : 'Nuevo'} Servicio</h3>
              <button onClick={() => setShowForm(false)} className="text-muted/80 hover:text-foreground"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-foreground/80 mb-1">Nombre</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg border border-subtle bg-background px-3 py-2 text-sm text-foreground focus:border-brand-gold focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm text-foreground/80 mb-1">Descripción</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full rounded-lg border border-subtle bg-background px-3 py-2 text-sm text-foreground focus:border-brand-gold focus:outline-none" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-foreground/80 mb-1">Precio</label>
                  <input required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full rounded-lg border border-subtle bg-background px-3 py-2 text-sm text-foreground focus:border-brand-gold focus:outline-none" placeholder="$25.000" />
                </div>
                <div>
                  <label className="block text-sm text-foreground/80 mb-1">Ícono</label>
                  <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}
                    className="w-full rounded-lg border border-subtle bg-background px-3 py-2 text-sm text-foreground focus:border-brand-gold focus:outline-none" />
                </div>
              </div>
              <button type="submit" className="w-full rounded-lg bg-brand-gold py-2 text-sm font-medium text-brand-dark hover:bg-brand-gold-light transition-colors">
                {editing ? 'Guardar Cambios' : 'Crear Servicio'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {services.map((s) => (
          <div key={s.id} className={cn('flex items-center justify-between rounded-xl border p-4', s.is_active ? 'border-subtle bg-brand-card' : 'border-subtle/50 bg-brand-card/50 opacity-60')}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{s.icon}</span>
              <div>
                <p className="text-sm font-medium text-foreground">{s.name}</p>
                <p className="text-xs text-muted/80">{s.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-brand-gold-light">{s.price}</span>
              <button onClick={() => toggleActive(s)} className="text-xs text-muted/80 hover:text-foreground transition-colors">
                {s.is_active ? 'Desactivar' : 'Activar'}
              </button>
              <button onClick={() => openEdit(s)} className="text-muted/80 hover:text-foreground"><Pencil size={16} /></button>
              <button onClick={() => handleDelete(s.id)} className="text-muted/80 hover:text-red-400"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
