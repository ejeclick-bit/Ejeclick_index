# ADR-013: Extracción de UI Components a Package Compartido

**Date:** 2026-06-09
**Status:** accepted

## Contexto
El proyecto EjeClick se ha expandido a múltiples aplicaciones frontend (landing-ejeclick, flow-flow landing, flow-flow admin). Actualmente, los componentes de UI básicos (átomos y algunas moléculas) están duplicados entre `apps/landing-ejeclick/src/components` y `apps/flow-flow/landing/src/components`. Mantener consistencia en el sistema de diseño se vuelve difícil, ya que un cambio en un botón requiere cambios en múltiples repositorios. Además, hay componentes base como `ThemeToggle` y `Button` que se reescriben.

## Opciones Consideradas

1. **Mantener duplicación (Status Quo)**
   - *Ventajas*: Total independencia de las apps, sin complejidad de configuración adicional.
   - *Desventajas*: Alta deuda técnica, inconsistencias visuales, mantenimiento difícil.

2. **Extraer a `packages/ui-components` usando Vite/Rollup y publicar**
   - *Ventajas*: Paquete pre-compilado, utilizable fuera del monorepo si fuese necesario.
   - *Desventajas*: Overhead de build extra. Cada cambio en UI requiere re-buildear el paquete antes de ver los cambios en desarrollo.

3. **Extraer a `packages/ui-components` como código TypeScript crudo (Workspace Link)**
   - *Ventajas*: El HMR funciona perfectamente. Vite transpilara el código del package on-the-fly. No hay paso de build separado para el package. Mantenimiento muy bajo.
   - *Desventajas*: Requiere configuración extra en `tsconfig.json` y dependencias (Tailwind, Framer Motion) en el package que deben ser resueltas por las apps.

## Decisión
Opción 3. Extraer a `packages/ui-components` como código TypeScript no compilado e importado vía alias en el workspace de npm. Esta es la forma recomendada en monorepos Vite modernos por su simplicidad y perfecto Hot Module Replacement.

## Consecuencias
**Positivas:** 
- Una sola fuente de verdad para los componentes Atomic Design (Button, Badge, Input, Typography, ThemeToggle).
- Menos código que mantener en cada aplicación.
- Actualizaciones globales instantáneas para el sistema de diseño en todo el ecosistema.

**Negativas:**
- Mayor dependencia entre las apps y el paquete `ui-components`.
- Requiere asegurar que Tailwind en las apps lea los archivos dentro de `packages/ui-components/src/**/*.{ts,tsx}` para generar los estilos CSS correctamente.

**Neutrales:**
- Mueve la responsabilidad del diseño atómico al package compartido.
