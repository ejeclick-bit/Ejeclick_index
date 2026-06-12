# ADR-012: Gestión de Imagen de Hero por Tenant desde Backend

**Date:** 2026-06-09
**Status:** accepted

## Context

La landing page de la barbería necesita soporte para una imagen de fondo en el Hero.
El proyecto es **multi-tenant SaaS**: cada barbería es un cliente diferente con branding propio.
Poner una imagen hardcodeada en el frontend (URL de Unsplash u otra) violaría dos principios:

1. **Multi-tenancy**: no todas las barberías quieren la misma foto.
2. **Performance**: cargar imágenes desde CDN externas (Unsplash) en producción agrega dependencia de terceros, potencial rate limiting y latencia.

## Decision

**El Hero soporta dos modos mutuamente excluyentes:**

### Modo A — Sin imagen (CSS Premium)
- Activo por defecto cuando `hero_image_url` está vacío en BD
- Usa gradientes, formas geométricas animadas y el acento del tenant
- Completamente adaptativo al tema claro/oscuro
- Zero bytes extra en red, renderizado puro CSS + Framer Motion

### Modo B — Con imagen (del tenant)
- Activo cuando el admin sube una foto desde `Admin > Apariencia > Imagen de Portada`
- La imagen se guarda en el servidor (`/uploads/hero_<slug>_<uuid>.<ext>`)
- La BD almacena solo la ruta relativa: `hero_image_url = "/uploads/hero_flow-flow_abc123.webp"`
- El backend (`POST /api/tenant/hero-image`) valida: extensión (jpg/png/webp), tamaño (máx 8MB), autenticación
- Al subir una nueva imagen, el backend elimina la anterior automáticamente

### Flujo completo

```
Admin Panel (BrandingPage)
  │
  ├── Usuario selecciona archivo (.jpg/.png/.webp)
  │
  ▼
POST /api/tenant/hero-image  (multipart/form-data)
  │
  ├── Valida extensión y tamaño
  ├── Elimina foto anterior (si existe en disco)
  ├── Guarda nuevo archivo en /uploads/hero_<slug>_<uuid>.<ext>
  ├── Actualiza barbershops.hero_image_url en PostgreSQL
  │
  ▼
GET /api/tenant  →  retorna hero_image_url
  │
  ▼
Landing Hero.tsx
  │
  ├── hero_image_url = ""  →  HeroCSS (diseño geométrico premium)
  └── hero_image_url != "" →  HeroWithImage (parallax + overlay cinematográfico)
```

## Consequences

**Positivo:**
- Cada barbería puede personalizar su hero sin código
- Las imágenes viven en el mismo servidor — sin dependencia de CDN externas
- El admin puede volver al diseño CSS eliminando la imagen (DELETE /api/tenant/hero-image)
- Tenant isolation: el endpoint requiere auth y barbershop_id del contexto

**Negativo / Trade-offs:**
- Las imágenes viven en disco local del servidor — en producción con múltiples réplicas habría que migrar a S3/MinIO
- No hay compresión/resize automático — el admin debe subir la imagen ya optimizada
- Máximo 8MB por imagen (suficiente para una buena foto sin optimizar)

**Pendiente (futuro):**
- Integrar `python-pillow` para auto-resize a 1920x1080 y conversión a WebP al momento del upload
- Migrar `/uploads/` a MinIO cuando el proyecto escale a múltiples instancias
