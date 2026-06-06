# ADR-009: Generación Dinámica de Branding mediante CSS `color-mix`

**Date:** 2026-06-06
**Status:** accepted

## Context

En el modelo multi-tenant de EjeClick, cada tenant puede configurar su paleta de colores. El backend almacena valores clave como `primary` (color principal) y `surface` (color base de cards/superficies). Sin embargo, elementos interactivos de la interfaz como botones requieren variaciones de estos colores para sus diferentes estados (`hover`, `active`, bordes de tarjetas, etc.). 

Hasta ahora, la landing utilizaba valores hardcodeados para el fondo de las tarjetas (`--color-brand-card: #1a1a1a`) y carecía de una definición dinámica para el estado activo de los botones (`active:bg-brand-gold-dark`). Si solo confiamos en variables directas de base de datos, tendríamos que obligar al administrador a configurar decenas de colores específicos, o arriesgarnos a que los estados interactivos no coincidan visualmente con el tema elegido.

## Decision

1. **Inyección en el Theme de Tailwind v4:** Configurar variables CSS que actúen como puente entre los valores del tenant (`--brand-*`) y el motor de temas de Tailwind v4 (`--color-brand-*`).
2. **Generación con `color-mix` de CSS:** Para variaciones que no estén explícitamente configuradas por el tenant (como el hover/active de colores principales o el realce de tarjetas), utilizar la función nativa de CSS `color-mix` para derivarlas directamente en el navegador del cliente:
   - `--color-brand-gold-light` (hover): Usa el color secundario (`--brand-accent`) configurado, o genera una mezcla del 85% del color principal con blanco.
   - `--color-brand-gold-dark` (active): Genera una mezcla del 85% del color principal con negro.
   - `--color-brand-card` (cards): Usa el color de tarjeta configurado (`--brand-card`), o genera una versión 4% más clara que la superficie base (`--brand-surface`).
3. **Migración en Layouts:** Reemplazar el uso de variables directas `--brand-*` sin fallback por variables `--color-brand-*` (por ejemplo, en los gradientes radiales de [Hero.tsx](file:///home/migue/software/EjeClick/ejeclick_index/apps/flow-flow/landing/src/components/organisms/Hero.tsx)).

## Consequences

- **Positivo:** Los tenants obtienen un branding consistente y profesional con solo definir colores base (cero colores hardcodeados). Los botones tienen un comportamiento de click (`active`) visualmente correcto sin importar el color elegido.
- **Positivo:** Reducción del esfuerzo del usuario administrador en el panel de configuración (menos campos obligatorios).
- **Positivo:** Mantenimiento de la compatibilidad con navegadores modernos usando funciones nativas (`color-mix`), lo que evita cargar librerías javascript de manipulación de color en el frontend.
- **Trade-off:** La visualización de la vista previa requiere que el navegador soporte la sintaxis de CSS `color-mix` (soportado en >93% de navegadores globales).
