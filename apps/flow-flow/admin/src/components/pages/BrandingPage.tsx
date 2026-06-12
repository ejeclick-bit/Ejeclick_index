import { useState, useEffect, useRef } from 'react';
import { Save, Loader2, ImagePlus, Trash2, Eye, AlertCircle, X } from 'lucide-react';
import { api } from '../../lib/api';
import { useConfirm } from '../../hooks/useConfirm';

const PALETTE_FIELDS = [
  { key: 'primary', label: 'Color Principal' },
  { key: 'accent', label: 'Color Secundario (Hover)' },
];

const SOCIAL_FIELDS = [
  { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/...' },
  { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/...' },
  { key: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@...' },
];

function isLightColor(hexColor: string) {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return brightness > 155;
}

export function BrandingPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const { confirm, ModalComponent } = useConfirm();

  // Estado para la imagen de portada del Hero
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [heroUploading, setHeroUploading] = useState(false);
  const [heroDeleting, setHeroDeleting] = useState(false);
  const [heroError, setHeroError] = useState('');
  const heroInputRef = useRef<HTMLInputElement>(null);

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
        setHeroImageUrl(t.hero_image_url || '');
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

  async function handleHeroUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setHeroError('La imagen excede el límite de 5MB. Por favor usa una imagen más ligera.');
      if (heroInputRef.current) heroInputRef.current.value = '';
      return;
    }

    setHeroUploading(true);
    setHeroError('');
    try {
      const updated = await api.uploadHeroImage(file);
      setHeroImageUrl(updated.hero_image_url || '');
    } catch (err: unknown) {
      setHeroError(err instanceof Error ? err.message : 'Error al subir la imagen.');
    } finally {
      setHeroUploading(false);
      // Resetear input para permitir re-subir el mismo archivo
      if (heroInputRef.current) heroInputRef.current.value = '';
    }
  }

  function handleHeroDelete() {
    confirm('¿Seguro que deseas eliminar la imagen de portada? La landing volverá al diseño por defecto.', async () => {
      setHeroDeleting(true);
      setHeroError('');
      try {
        await api.deleteHeroImage();
        setHeroImageUrl('');
      } catch {
        setHeroError('Error al eliminar la imagen.');
      } finally {
        setHeroDeleting(false);
      }
    });
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
      <ModalComponent />
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
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-400 [.light_&]:text-green-600 animate-in fade-in slide-in-from-top-2">
          <div className="flex-1">
            <h3 className="text-sm font-semibold">Cambios guardados correctamente</h3>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400 [.light_&]:text-red-600 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="mt-0.5 shrink-0" size={18} />
          <div className="flex-1">
            <h3 className="text-sm font-semibold">Error al guardar</h3>
            <p className="mt-1 text-sm opacity-90">{error}</p>
          </div>
          <button onClick={() => setError('')} className="shrink-0 p-1 hover:bg-red-500/20 rounded-md transition-colors">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="space-y-8">

        {/* ── Panel: Imagen de Portada del Hero ── */}
        <div className="rounded-xl border border-subtle bg-brand-card p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-foreground">Imagen de Portada</h3>
              <p className="text-xs text-muted mt-1">
                Foto de fondo para el Hero de tu landing. Opcional — sin imagen se muestra un diseño premium por defecto.
                <br />Formatos: JPG, PNG, WebP · Máximo 10MB · Recomendado: 1920×1080px
              </p>
            </div>
          </div>

          {/* Error de hero */}
          {heroError && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-red-400 [.light_&]:text-red-600 animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="mt-0.5 shrink-0" size={16} />
              <div className="flex-1">
                <p className="text-sm font-medium">{heroError}</p>
              </div>
              <button onClick={() => setHeroError('')} className="shrink-0 p-0.5 hover:bg-red-500/20 rounded-md transition-colors">
                <X size={14} />
              </button>
            </div>
          )}

          {heroImageUrl ? (
            /* Preview de imagen existente */
            <div className="relative group overflow-hidden rounded-xl border border-subtle" style={{ aspectRatio: '16/6' }}>
              <img
                src={heroImageUrl}
                alt="Imagen de portada actual"
                className="h-full w-full object-cover"
              />
              {/* Overlay con acciones */}
              <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <a
                  href={heroImageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-lg bg-white/10 backdrop-blur-sm px-3 py-2 text-xs font-medium text-white border border-white/20 hover:bg-white/20 transition-colors"
                >
                  <Eye size={13} />
                  Ver original
                </a>
                <button
                  onClick={() => heroInputRef.current?.click()}
                  disabled={heroUploading}
                  className="flex items-center gap-1.5 rounded-lg bg-brand-gold/80 px-3 py-2 text-xs font-medium text-brand-dark hover:bg-brand-gold transition-colors disabled:opacity-50"
                >
                  <ImagePlus size={13} />
                  Cambiar
                </button>
                <button
                  onClick={handleHeroDelete}
                  disabled={heroDeleting}
                  className="flex items-center gap-1.5 rounded-lg bg-red-900/70 px-3 py-2 text-xs font-medium text-red-200 border border-red-800/40 hover:bg-red-900 transition-colors disabled:opacity-50"
                >
                  {heroDeleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                  Eliminar
                </button>
              </div>
              <div className="absolute bottom-2 left-3 rounded-md bg-black/60 px-2 py-1 text-[10px] text-white/70 backdrop-blur-sm">
                Pasa el cursor para ver opciones
              </div>
            </div>
          ) : (
            /* Zona de upload vacía */
            <button
              type="button"
              onClick={() => heroInputRef.current?.click()}
              disabled={heroUploading}
              className="w-full rounded-xl border-2 border-dashed border-subtle hover:border-brand-gold/50 transition-colors duration-200 flex flex-col items-center justify-center gap-3 py-12 text-muted hover:text-brand-gold disabled:opacity-50 group"
            >
              {heroUploading ? (
                <>
                  <Loader2 size={28} className="animate-spin text-brand-gold" />
                  <p className="text-sm font-medium text-brand-gold">Subiendo imagen...</p>
                </>
              ) : (
                <>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-subtle bg-background group-hover:border-brand-gold/30 transition-colors">
                    <ImagePlus size={24} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">Subir imagen de portada</p>
                    <p className="text-xs mt-0.5 text-muted/60">Sin imagen, la landing muestra el diseño premium por defecto</p>
                  </div>
                </>
              )}
            </button>
          )}

          {/* Input de archivo oculto */}
          <input
            ref={heroInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            className="hidden"
            onChange={handleHeroUpload}
            aria-label="Seleccionar imagen de portada"
          />
        </div>

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

          {/* Vista previa — reacciona al tema del admin automáticamente */}
          <div className="mt-6 rounded-xl border border-subtle bg-background p-4">
            <p className="text-xs text-muted mb-3">Vista previa</p>
            <div className="rounded-lg p-4 flex items-center gap-3 bg-brand-card shadow-sm border border-subtle">
              <div
                className="h-8 w-8 rounded flex-shrink-0"
                style={{ backgroundColor: form.palette.primary || 'var(--theme-accent)' }}
              />
              <div>
                <p className="text-sm font-bold text-foreground">
                  {form.name || 'Mi Barbería'}
                </p>
                <p className="text-xs text-muted">
                  {form.tagline || 'Estilo y profesionalismo'}
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <div
                className="h-8 px-4 rounded-md text-xs flex items-center justify-center font-medium shadow-sm"
                style={{
                  backgroundColor: form.palette.primary || 'var(--theme-accent)',
                  color: form.palette.primary
                    ? (isLightColor(form.palette.primary) ? '#1a1a1a' : '#ffffff')
                    : 'var(--theme-background)',
                }}
              >
                Reservar
              </div>
              <div
                className="h-8 px-4 rounded-md border text-xs flex items-center justify-center bg-brand-card hover:bg-subtle transition-colors"
                style={{
                  borderColor: form.palette.primary || 'var(--theme-accent)',
                  color: form.palette.primary || 'var(--theme-accent)',
                }}
              >
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
