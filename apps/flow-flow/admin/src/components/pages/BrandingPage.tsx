import { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';

const PALETTE_FIELDS = [
  { key: 'primary', label: 'Color Principal' },
  { key: 'accent', label: 'Color Secundario (Hover)' },
  { key: 'bg', label: 'Fondo' },
  { key: 'surface', label: 'Superficie (cards)' },
];

const SOCIAL_FIELDS = [
  { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/...' },
  { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/...' },
  { key: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@...' },
];

export function BrandingPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '', tagline: '', description: '',
    whatsapp: '', phone: '', email: '', address: '',
    palette: {} as Record<string, string>,
    social: {} as Record<string, string>,
  });

  useEffect(() => {
    api.getTenant().then((t) => {
      if (t) {
        setForm({
          name: t.name || '', tagline: t.tagline || '', description: t.description || '',
          whatsapp: t.whatsapp || '', phone: t.phone || '', email: t.email || '', address: t.address || '',
          palette: t.palette || {},
          social: t.social || {},
        });
      }
    }).catch(() => setError('Error al cargar datos de la barbería'))
      .finally(() => setLoading(false));
  }, []);

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function updatePalette(key: string, value: string) {
    setForm((prev) => ({
      ...prev,
      palette: { ...prev.palette, [key]: value },
    }));
  }

  function updateSocial(key: string, value: string) {
    setForm((prev) => ({
      ...prev,
      social: { ...prev.social, [key]: value },
    }));
  }

  async function handleSave() {
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      await api.saveBranding({
        name: form.name,
        tagline: form.tagline,
        description: form.description,
        palette: form.palette,
        whatsapp: form.whatsapp,
        phone: form.phone,
        email: form.email,
        address: form.address,
        social: form.social,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('Error al guardar. Intenta de nuevo.');
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-muted/80" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Apariencia y Marca</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-brand-gold px-5 py-2.5 text-sm font-medium text-brand-dark hover:bg-brand-gold-light transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>

      {saved && (
        <div className="mb-4 rounded-lg bg-green-900/20 border border-green-900/30 px-4 py-3 text-sm text-green-400" role="alert">
          Cambios guardados correctamente
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg bg-red-900/20 border border-red-900/30 px-4 py-3 text-sm text-red-400" role="alert">
          {error}
        </div>
      )}

      <div className="space-y-8">
        <div className="rounded-xl border border-subtle bg-brand-card p-6">
          <h3 className="font-semibold text-foreground mb-4">Información del Negocio</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm text-foreground/80 mb-1">Nombre</label>
              <input type="text" value={form.name} onChange={(e) => updateField('name', e.target.value)}
                className="w-full rounded-lg border border-subtle bg-background px-3 py-2 text-sm text-foreground focus:border-brand-gold focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm text-foreground/80 mb-1">Eslogan</label>
              <input type="text" value={form.tagline} onChange={(e) => updateField('tagline', e.target.value)}
                className="w-full rounded-lg border border-subtle bg-background px-3 py-2 text-sm text-foreground focus:border-brand-gold focus:outline-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-foreground/80 mb-1">Descripción</label>
              <textarea value={form.description} onChange={(e) => updateField('description', e.target.value)} rows={2}
                className="w-full rounded-lg border border-subtle bg-background px-3 py-2 text-sm text-foreground focus:border-brand-gold focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm text-foreground/80 mb-1">WhatsApp</label>
              <input type="text" value={form.whatsapp} onChange={(e) => updateField('whatsapp', e.target.value)} placeholder="573001234567"
                className="w-full rounded-lg border border-subtle bg-background px-3 py-2 text-sm text-foreground focus:border-brand-gold focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm text-foreground/80 mb-1">Teléfono</label>
              <input type="text" value={form.phone} onChange={(e) => updateField('phone', e.target.value)}
                className="w-full rounded-lg border border-subtle bg-background px-3 py-2 text-sm text-foreground focus:border-brand-gold focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm text-foreground/80 mb-1">Email</label>
              <input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)}
                className="w-full rounded-lg border border-subtle bg-background px-3 py-2 text-sm text-foreground focus:border-brand-gold focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm text-foreground/80 mb-1">Dirección</label>
              <input type="text" value={form.address} onChange={(e) => updateField('address', e.target.value)}
                className="w-full rounded-lg border border-subtle bg-background px-3 py-2 text-sm text-foreground focus:border-brand-gold focus:outline-none" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-subtle bg-brand-card p-6">
          <h3 className="font-semibold text-foreground mb-4">Paleta de Colores</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {PALETTE_FIELDS.map((f) => (
              <div key={f.key} className="flex items-center gap-3">
                <input
                  type="color"
                  value={form.palette[f.key] || '#000000'}
                  onChange={(e) => updatePalette(f.key, e.target.value)}
                  className="h-10 w-10 cursor-pointer rounded border border-subtle bg-transparent"
                  aria-label={f.label}
                />
                <div>
                  <p className="text-sm text-foreground">{f.label}</p>
                  <p className="text-xs text-muted/80">{form.palette[f.key] || '#000000'}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-subtle p-4" style={{
            backgroundColor: form.palette.bg || '#0a0a0a',
          }}>
            <p className="text-xs text-muted mb-3">Vista previa</p>
            <div className="rounded-lg p-4 flex items-center gap-3"
              style={{ backgroundColor: form.palette.surface || '#141414' }}>
              <div className="h-8 w-8 rounded" style={{ backgroundColor: form.palette.primary || '#c9953c' }} />
              <div>
                <p className="text-sm font-bold text-foreground">{form.name || 'Mi Barbería'}</p>
                <p className="text-xs text-muted">{form.tagline || 'Estilo y profesionalismo'}</p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <div className="h-6 w-16 rounded text-xs flex items-center justify-center font-medium"
                style={{ backgroundColor: form.palette.primary || '#c9953c', color: form.palette.bg || '#0a0a0a' }}>
                Reservar
              </div>
              <div className="h-6 w-16 rounded border text-xs flex items-center justify-center"
                style={{ borderColor: form.palette.primary || '#c9953c', color: form.palette.primary || '#c9953c' }}>
                WhatsApp
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-subtle bg-brand-card p-6">
          <h3 className="font-semibold text-foreground mb-4">Redes Sociales</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {SOCIAL_FIELDS.map((f) => (
              <div key={f.key}>
                <label className="block text-sm text-foreground/80 mb-1">{f.label}</label>
                <input type="url" value={form.social[f.key] || ''}
                  onChange={(e) => updateSocial(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className="w-full rounded-lg border border-subtle bg-background px-3 py-2 text-sm text-foreground focus:border-brand-gold focus:outline-none" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
