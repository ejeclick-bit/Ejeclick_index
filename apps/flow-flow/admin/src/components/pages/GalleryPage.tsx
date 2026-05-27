import { useState, useEffect, useRef, type ChangeEvent } from 'react';
import { Upload, Trash2 } from 'lucide-react';
import { api, type GalleryItem } from '../../lib/api';

export function GalleryPage() {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function load() { api.getGallery().then(setImages); }
  useEffect(() => { load(); }, []);

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await api.uploadImage(file, file.name);
      load();
    } catch (err) {
      alert('Error al subir imagen');
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  }

  async function handleDelete(id: number) {
    if (!confirm('¿Eliminar esta imagen?')) return;
    await api.deleteImage(id);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Galería</h2>
        <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-brand-gold px-4 py-2 text-sm font-medium text-brand-dark hover:bg-brand-gold-light transition-colors">
          <Upload size={16} />
          {uploading ? 'Subiendo...' : 'Subir Imagen'}
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </label>
      </div>

      {images.length === 0 ? (
        <p className="text-sm text-neutral-500">No hay imágenes. Sube la primera.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {images.map((img) => (
            <div key={img.id} className="group relative aspect-square overflow-hidden rounded-xl border border-neutral-800 bg-brand-card">
              <img src={img.url} alt={img.alt_text} className="h-full w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100 p-3">
                <button onClick={() => handleDelete(img.id)} className="flex items-center gap-1 rounded-lg bg-red-500/80 px-3 py-1.5 text-xs text-white hover:bg-red-500 transition-colors">
                  <Trash2 size={14} /> Eliminar
                </button>
              </div>
              <p className="absolute bottom-0 left-0 right-0 truncate bg-gradient-to-t from-black/80 to-transparent px-3 pb-2 pt-6 text-xs text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity">
                {img.alt_text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
