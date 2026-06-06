import { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { api, type UserEntry } from '../../lib/api';

export function UsersPage() {
  const [users, setUsers] = useState<UserEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ username: '', password: '', name: '' });
  const [passErrors, setPassErrors] = useState<string[]>([]);

  function load() { setLoading(true); api.listUsers().then(setUsers).catch(() => setError('Error al cargar usuarios')).finally(() => setLoading(false)); }
  useEffect(() => {
    const timer = setTimeout(() => {
      load();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  function validatePass(pw: string): string[] {
    const e: string[] = [];
    if (pw.length < 8) e.push('Mínimo 8 caracteres');
    if (!/[A-Z]/.test(pw)) e.push('Una mayúscula');
    if (!/[a-z]/.test(pw)) e.push('Una minúscula');
    if (!/\d/.test(pw)) e.push('Un número');
    return e;
  }

  async function handleCreate() {
    if (!form.username || !form.password || !form.name) return;
    setCreating(true);
    setError('');
    try {
      await api.createUser({ ...form, role: 'barber' });
      setShowForm(false);
      setForm({ username: '', password: '', name: '' });
      setPassErrors([]);
      load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al crear usuario');
    }
    setCreating(false);
  }

  async function toggleActive(u: UserEntry) {
    try {
      await api.updateUser(u.id, { is_active: !u.is_active });
      load();
    } catch { setError('Error al actualizar'); }
  }

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 size={24} className="animate-spin text-neutral-500" /></div>;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Usuarios</h2>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 rounded-lg bg-brand-gold px-4 py-2 text-sm font-medium text-brand-dark hover:bg-brand-gold-light transition-colors">
          <Plus size={16} /> Nuevo Barbero
        </button>
      </div>

      {error && <div className="mb-4 rounded-lg bg-red-900/20 border border-red-900/30 px-4 py-3 text-sm text-red-400" role="alert">{error}</div>}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowForm(false)}>
          <div className="w-full max-w-sm rounded-xl border border-neutral-800 bg-brand-card p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-white mb-4">Nuevo Barbero</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-neutral-300 mb-1">Usuario</label>
                <input type="text" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="w-full rounded-lg border border-neutral-700 bg-brand-dark px-3 py-2 text-sm text-white focus:border-brand-gold focus:outline-none"
                  placeholder="juan_barber" />
              </div>
              <div>
                <label className="block text-sm text-neutral-300 mb-1">Nombre Completo</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg border border-neutral-700 bg-brand-dark px-3 py-2 text-sm text-white focus:border-brand-gold focus:outline-none"
                  placeholder="Juan Pérez" />
              </div>
              <div>
                <label className="block text-sm text-neutral-300 mb-1">Contraseña</label>
                <input type="password" value={form.password}
                  onChange={(e) => { setForm({ ...form, password: e.target.value }); setPassErrors(validatePass(e.target.value)); }}
                  className="w-full rounded-lg border border-neutral-700 bg-brand-dark px-3 py-2 text-sm text-white focus:border-brand-gold focus:outline-none" />
                <div className="mt-2 space-y-1">
                  {['Mínimo 8 caracteres', 'Una mayúscula', 'Una minúscula', 'Un número'].map((r) => (
                    <div key={r} className={`text-xs flex items-center gap-1 ${passErrors.includes(r) ? 'text-red-400' : 'text-green-400'}`}>
                      {passErrors.includes(r) ? '✕' : '✓'} {r}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowForm(false)} className="flex-1 rounded-lg border border-neutral-700 py-2 text-sm text-neutral-400 hover:text-white transition-colors">Cancelar</button>
              <button onClick={handleCreate} disabled={creating || passErrors.length > 0}
                className="flex-1 rounded-lg bg-brand-gold py-2 text-sm font-medium text-brand-dark hover:bg-brand-gold-light disabled:opacity-50 transition-colors">
                {creating ? 'Creando...' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {users.map((u) => (
          <div key={u.id} className="flex items-center justify-between rounded-xl border border-neutral-800 bg-brand-card p-4">
            <div>
              <p className="font-medium text-white">{u.name}</p>
              <p className="text-xs text-neutral-500">@{u.username} — {u.role}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`rounded-full px-2 py-0.5 text-xs ${u.is_active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                {u.is_active ? 'Activo' : 'Inactivo'}
              </span>
              <button onClick={() => toggleActive(u)}
                className="text-xs text-neutral-500 hover:text-white transition-colors">
                {u.is_active ? 'Desactivar' : 'Activar'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
