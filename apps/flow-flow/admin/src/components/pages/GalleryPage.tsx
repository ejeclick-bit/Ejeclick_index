import { useState, useEffect, useRef, type ChangeEvent } from 'react';
import { Upload, Trash2, Loader2 } from 'lucide-react';
import { api, type GalleryItem, type Section, ApiError } from '../../lib/api';

export function GalleryPage() {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSlug, setSelectedSlug] = useState('gallery');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  function load() {
    setLoading(true);
    setError('');
    Promise.all([
      api.listSections(),
      api.listGallery(),
    ])
      .then(([secs]) => {
        setSections(secs);
        if (secs.length > 0 && !secs.find((s) => s.slug === selectedSlug)) {
          setSelectedSlug(secs[0].slug);
        }
      })
      .catch(() => setError('Error al cargar secciones'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      load();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (selectedSlug) {
      api.listGallery(selectedSlug).then(setImages).catch(() => setError('Error al cargar imágenes'));
    }
  }, [selectedSlug]);

  const currentSection = sections.find((s) => s.slug === selectedSlug);

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const img = await api.uploadImage(file, file.name, selectedSlug);
      setImages((prev) => [...prev, img]);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Error al subir imagen');
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  }

  async function handleDelete(id: number) {
    if (!confirm('¿Eliminar esta imagen permanentemente?')) return;
    setDeleting(id);
    try {
      await api.deleteImage(id);
      setImages((prev) => prev.filter((img) => img.id !== id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Error al eliminar');
    }
    setDeleting(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Galería de Imágenes</h2>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-900/20 border border-red-900/30 px-4 py-3 text-sm text-red-400" role="alert">
          {error}
          <button onClick={() => setError('')} className="ml-2 underline hover:no-underline">Cerrar</button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={24} className="animate-spin text-neutral-500" />
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            {sections.map((s) => {
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedSlug(s.slug)}
                  className={`rounded-xl border p-5 text-left transition-all ${
                    selectedSlug === s.slug
                      ? 'border-brand-gold bg-brand-gold/5 ring-1 ring-brand-gold'
                      : 'border-neutral-800 bg-brand-card hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-semibold ${selectedSlug === s.slug ? 'text-brand-gold-light' : 'text-white'}`}>
                      {s.name}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 leading-relaxed">{s.description}</p>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between mb-6 p-4 rounded-xl border border-neutral-800 bg-brand-card">
            <div>
              <p className="text-sm text-white font-medium">
                Subir a: <span className="text-brand-gold-light">{currentSection?.name || selectedSlug}</span>
              </p>
              <p className="text-xs text-neutral-500 mt-0.5">{currentSection?.description}</p>
            </div>
            <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-brand-gold px-5 py-2.5 text-sm font-medium text-brand-dark hover:bg-brand-gold-light transition-colors disabled:opacity-50">
              {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              {uploading ? 'Subiendo...' : 'Subir Imagen'}
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" disabled={uploading} />
            </label>
          </div>

          {images.length === 0 ? (
            <div className="text-center py-16 rounded-xl border border-dashed border-neutral-800">
              <p className="text-neutral-500">No hay imágenes en esta sección</p>
              <p className="text-xs text-neutral-600 mt-1">Sube la primera imagen usando el botón de arriba</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {images.map((img) => (
                <div key={img.id} className="group relative rounded-xl border border-neutral-800 bg-brand-card overflow-hidden">
                  <div className="aspect-square overflow-hidden">
                    <img src={img.url} alt={img.alt_text} className="h-full w-full object-cover" loading="lazy" />
                  </div>
                  <div className="p-3">
                    <p className="truncate text-xs text-neutral-400">{img.alt_text || 'Sin descripción'}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(img.id)}
                    disabled={deleting === img.id}
                    className="absolute top-2 right-2 rounded-lg bg-red-500/90 px-3 py-1.5 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 disabled:opacity-50 flex items-center gap-1"
                  >
                    {deleting === img.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                    Eliminar
                  </button>
                  <span className="absolute top-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] text-neutral-300">
                    {img.section_name || img.section_slug}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
