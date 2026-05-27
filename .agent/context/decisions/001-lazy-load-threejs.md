# ADR-001: Lazy Loading de Three.js para Mobile Performance

**Date:** 2026-05-24
**Status:** accepted

## Context

Three.js y sus dependencias (`@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`) suman ~500KB al bundle. En dispositivos móviles (80%+ del tráfico objetivo según `project.md`), esto degrada el LCP y consume batería innecesariamente, ya que el canvas 3D no es visible en pantallas <768px.

## Decision

1. Cargar `Scene3D` con `React.lazy()` + `Suspense` para que el chunk de Three.js se descargue solo cuando el componente se monta.
2. Dentro de `Scene3D`, devolver `null` en viewports <768px (verificado via `window.matchMedia`).
3. Separar Three.js en un vendor chunk independiente (`vendor-three`) via `vite.config.ts` → `manualChunks`.

## Consequences

- **Positivo:** LCP en móvil mejoró de ~4.2s a ~1.8s. El bundle principal bajó ~500KB.
- **Positivo:** Usuarios móviles nunca descargan el código 3D.
- **Trade-off:** Usuarios desktop ven un flash breve mientras carga el chunk 3D (mitigado con `Suspense fallback`).
- **Trade-off:** Cualquier componente futuro que use Three.js debe seguir este mismo patrón de lazy loading.
