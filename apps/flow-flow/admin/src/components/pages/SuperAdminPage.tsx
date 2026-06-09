import { useState, useEffect } from 'react';
import { Plus, Loader2, ExternalLink } from 'lucide-react';
import { api, type TenantData } from '../../lib/api';

export function SuperAdminPage() {
  const [shops, setShops] = useState<TenantData[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [slug, setSlug] = useState('');
  const [name, setName] = useState('');
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [adminName, setAdminName] = useState('');

  function load() {
    setLoading(true);
    api.listBarbershops().then(setShops).catch(() => setError('Error al cargar barberías'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      load();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  function switchTenant(shopSlug: string) {
    localStorage.setItem('tenantSlug', shopSlug);
    localStorage.setItem('superAdminViewing', 'true');
    window.location.reload();
  }

  function clearTenant() {
    localStorage.removeItem('tenantSlug');
    localStorage.removeItem('superAdminViewing');
    window.location.reload();
  }

  async function handleCreate() {
    if (!slug || !name || !adminUsername || !adminPass || !adminName) return;
    setCreating(true);
    setError('');
    try {
      await api.createBarbershop({ slug, name, admin_username: adminUsername, admin_password: adminPass, admin_name: adminName });
      setSlug('');
      setName('');
      setAdminUsername('');
      setAdminPass('');
      setAdminName('');
      load();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error desconocido';
      setError(msg);
    }
    setCreating(false);
  }

  const currentSlug = localStorage.getItem('tenantSlug') || '';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-muted/80" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Todas las Barberías</h2>
        {currentSlug && (
          <button onClick={clearTenant}
            className="rounded-lg border border-subtle px-3 py-1.5 text-xs text-muted hover:text-foreground transition-colors">
            Ver todas (sin filtro) — actual: {currentSlug}
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-900/20 border border-red-900/30 px-4 py-3 text-sm text-red-400" role="alert">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-subtle bg-brand-card p-5 mb-6">
        <h3 className="font-semibold text-foreground mb-4">Crear Nueva Barbería</h3>
        <div className="grid gap-3 sm:grid-cols-2 mb-3">
          <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)}
            placeholder="slug (ej: peluquin)"
            className="rounded-lg border border-subtle bg-background px-3 py-2 text-sm text-foreground placeholder-neutral-500 focus:border-brand-gold focus:outline-none" />
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Nombre (ej: El Peluquín)"
            className="rounded-lg border border-subtle bg-background px-3 py-2 text-sm text-foreground placeholder-neutral-500 focus:border-brand-gold focus:outline-none" />
        </div>
        <p className="mb-3 text-xs text-muted/80 border-t border-subtle pt-3">Credenciales del Administrador</p>
        <div className="grid gap-3 sm:grid-cols-3 mb-3">
          <input type="text" value={adminUsername} onChange={(e) => setAdminUsername(e.target.value)}
            placeholder="Usuario admin"
            className="rounded-lg border border-subtle bg-background px-3 py-2 text-sm text-foreground placeholder-neutral-500 focus:border-brand-gold focus:outline-none" />
          <input type="password" value={adminPass} onChange={(e) => setAdminPass(e.target.value)}
            placeholder="Contraseña (mín. 8, mayúscula, minúscula, número)"
            className="rounded-lg border border-subtle bg-background px-3 py-2 text-sm text-foreground placeholder-neutral-500 focus:border-brand-gold focus:outline-none" />
          <input type="text" value={adminName} onChange={(e) => setAdminName(e.target.value)}
            placeholder="Nombre del admin"
            className="rounded-lg border border-subtle bg-background px-3 py-2 text-sm text-foreground placeholder-neutral-500 focus:border-brand-gold focus:outline-none" />
        </div>
        <div className="flex justify-end">
          <button onClick={handleCreate} disabled={creating || !slug || !name || !adminUsername || !adminPass || !adminName}
            className="flex items-center gap-2 rounded-lg bg-brand-gold px-4 py-2 text-sm font-medium text-brand-dark hover:bg-brand-gold-light disabled:opacity-50 transition-colors">
            {creating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            Crear
          </button>
        </div>
        <p className="mt-2 text-xs text-muted/80">
          Se auto-crean: horarios, secciones de galería, y 6 servicios base.
        </p>
      </div>

      <div className="space-y-2">
        {shops.map((s) => (
          <div key={s.id} className="flex items-center justify-between rounded-xl border border-subtle bg-brand-card p-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: (s.palette as Record<string, string>)?.primary || '#c9953c', color: '#0a0a0a' }}>
                {s.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-foreground">{s.name}</p>
                <p className="text-xs text-muted/80">{s.slug}.ejeclickbarber.com</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-2 py-0.5 text-xs ${s.is_active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                {s.is_active ? 'Activo' : 'Inactivo'}
              </span>
              <button onClick={() => switchTenant(s.slug)}
                className="rounded-lg border border-subtle px-3 py-1.5 text-xs text-brand-gold-light hover:bg-brand-gold/10 transition-colors flex items-center gap-1">
                <ExternalLink size={12} /> Entrar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
