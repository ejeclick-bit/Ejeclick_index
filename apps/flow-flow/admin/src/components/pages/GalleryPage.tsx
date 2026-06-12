import { useState, useEffect, useRef, type ChangeEvent } from 'react';
import { Upload, Trash2, Loader2, GripVertical, AlertCircle, X } from 'lucide-react';
import { api, type GalleryItem, type Section, ApiError } from '../../lib/api';
import { useConfirm } from '../../hooks/useConfirm';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableImageCard({ img, deleting, onDelete }: { img: GalleryItem, deleting: number | null, onDelete: (id: number) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: img.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-xl border ${isDragging ? 'border-brand-gold ring-1 ring-brand-gold shadow-lg shadow-black/50' : 'border-subtle'} bg-brand-card overflow-hidden`}
    >
      <div className="aspect-square overflow-hidden relative group-hover:brightness-90 transition-all">
        <img src={img.url} alt={img.alt_text} className="h-full w-full object-cover pointer-events-none" loading="lazy" />
        
        {/* Drag Handle - Botón específico en la esquina superior izquierda */}
        <div 
          className="absolute top-2 left-2 flex items-center justify-center cursor-grab active:cursor-grabbing bg-black/50 hover:bg-black/70 backdrop-blur-md p-1.5 rounded-lg text-white/90 hover:text-white transition-colors z-20 touch-none"
          {...attributes} 
          {...listeners}
          title="Arrastrar para reordenar"
        >
          <GripVertical size={16} />
        </div>
      </div>
      <div className="p-3">
        <p className="truncate text-xs text-muted">{img.alt_text || 'Sin descripción'}</p>
      </div>
      <button
        onClick={() => onDelete(img.id)}
        disabled={deleting === img.id}
        className="absolute top-2 right-2 rounded-lg bg-red-500/90 px-3 py-1.5 text-xs text-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 disabled:opacity-50 flex items-center gap-1 z-20"
      >
        {deleting === img.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
        Eliminar
      </button>
      <span className="absolute bottom-10 left-2 pointer-events-none rounded-full bg-black/60 px-2 py-0.5 text-[10px] text-foreground/80 z-20">
        {img.section_name || img.section_slug}
      </span>
    </div>
  );
}

export function GalleryPage() {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSlug, setSelectedSlug] = useState('gallery');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const { confirm, ModalComponent } = useConfirm();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

    if (file.size > 10 * 1024 * 1024) {
      setError('La imagen excede el límite de 10MB. Por favor usa una imagen más ligera.');
      if (fileRef.current) fileRef.current.value = '';
      return;
    }

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

  function handleDelete(id: number) {
    confirm('¿Seguro que deseas eliminar esta imagen permanentemente?', async () => {
      setDeleting(id);
      try {
        await api.deleteImage(id);
        setImages((prev) => prev.filter((img) => img.id !== id));
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'Error al eliminar');
      }
      setDeleting(null);
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // Actualizar en BD en segundo plano
        const updates = newItems.map((item, index) => ({ id: item.id, sort_order: index }));
        api.reorderImages(updates).catch(() => setError('Error de conexión al guardar el orden.'));
        
        return newItems;
      });
    }
  }

  return (
    <div>
      <ModalComponent />
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Galería de Imágenes</h2>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400 [.light_&]:text-red-600 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="mt-0.5 shrink-0" size={18} />
          <div className="flex-1">
            <h3 className="text-sm font-semibold">Error en la galería</h3>
            <p className="mt-1 text-sm opacity-90">{error}</p>
          </div>
          <button onClick={() => setError('')} className="shrink-0 p-1 hover:bg-red-500/20 rounded-md transition-colors">
            <X size={16} />
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={24} className="animate-spin text-muted/80" />
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
                      : 'border-subtle bg-brand-card hover:border-subtle'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-semibold ${selectedSlug === s.slug ? 'text-brand-gold-light' : 'text-foreground'}`}>
                      {s.name}
                    </span>
                  </div>
                  <p className="text-xs text-muted/80 leading-relaxed">{s.description}</p>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between mb-6 p-4 rounded-xl border border-subtle bg-brand-card">
            <div>
              <p className="text-sm text-foreground font-medium">
                Subir a: <span className="text-brand-gold-light">{currentSection?.name || selectedSlug}</span>
              </p>
              <p className="text-xs text-muted/80 mt-0.5">{currentSection?.description}</p>
            </div>
            
            {selectedSlug === 'hero' && images.length >= 1 ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400 [.light_&]:text-amber-700 text-xs font-medium">
                Solo se permite 1 foto en el Hero. <br/>Elimina la actual para subir otra.
              </div>
            ) : (
              <label className={`flex cursor-pointer items-center gap-2 rounded-lg bg-brand-gold px-5 py-2.5 text-sm font-medium text-brand-dark transition-colors ${uploading ? 'opacity-50 pointer-events-none' : 'hover:bg-brand-gold-light'}`}>
                {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                {uploading ? 'Subiendo...' : 'Subir Imagen'}
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" disabled={uploading} />
              </label>
            )}
          </div>

          {images.length === 0 ? (
            <div className="text-center py-16 rounded-xl border border-dashed border-subtle">
              <p className="text-muted/80">No hay imágenes en esta sección</p>
              <p className="text-xs text-neutral-600 mt-1">Sube la primera imagen usando el botón de arriba</p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={images.map((img) => img.id)}
                strategy={rectSortingStrategy}
              >
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {images.map((img) => (
                    <SortableImageCard
                      key={img.id}
                      img={img}
                      deleting={deleting}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </>
      )}
    </div>
  );
}
