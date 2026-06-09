# ADR-011: Premium Theme Transitions (View Transitions API & Framer Motion)

**Date:** 2026-06-09
**Status:** accepted

## Context
El sistema original de EjeClick y Flow Flow contaba con un modo oscuro por defecto construido sobre colores estáticos (`text-white`, `bg-brand-dark`). En un sprint anterior, se migró a CSS variables (`--theme-foreground`, `--theme-background`) inyectadas dinámicamente mediante `:root.light`.
Sin embargo, el usuario indicó que el cambio entre temas (usando View Transitions API estándar) era "muy estándar y simple", requiriendo una experiencia de usuario que se perciba de gama superior ("Premium").

## Decision
Para lograr una transición de grado Ultra-Premium y satisfacer el estándar de diseño en 2026, implementamos:

1. **View Transitions API Avanzada**: El `document.startViewTransition()` ya no usa un círculo estándar con un simple `ease-in-out`. Ahora usa la curva de aceleración elástica `cubic-bezier(0.8, 0, 0.2, 1)` con una duración extendida de 700ms.
2. **Morphing con Framer Motion**: Se reemplazaron los iconos estáticos de `<Sun />` y `<Moon />` por un componente SVG que usa `framer-motion` para rotar e intercalar sus vértices (morphing) al ser accionado.
3. **Refinamiento de Paleta de Colores (Off-White)**: Reemplazamos los blancos puros (`#F8FAFC`, `#FFFFFF`) y los negros puros por tonos hueso/perla (`#FCFBFA`, `#F5F4F1`) para el fondo, y un tono pizarra saturado (`#0B1221`) para textos. Esto reduce drásticamente la fatiga visual en Light Mode (Glassmorphism sutil).
4. **Respuesta Táctil**: Animaciones de `whileHover` y `whileTap` acopladas en el propio botón para dar fisicalidad a la interacción (Spring dynamics).

## Consequences
- **Dependencia de Framer Motion**: Agregamos `framer-motion` a los repositorios que no lo tenían (e.g. `flow-flow/admin`), incrementando ligeramente el bundle size (~25-30kb gzipped) pero ganando capacidades extremas de micro-interacciones.
- **Fallbacks Nativos**: Si el navegador no soporta `startViewTransition` (ej. navegadores obsoletos), el sistema hace el fallback automático al cambio directo de clase, pero manteniendo el morphing del botón.
- **Mantenimiento CSS**: Los developers futuros deben siempre usar variables `--theme-*` y clases semánticas en lugar de colores rígidos como `text-white` para que la transición siga funcionando armoniosamente en cualquier componente nuevo.

---

## Addendum: Paleta Premium para Barbería (2026-06-09)

### Investigación de Base
Se realizó búsqueda web con tendencias a junio 2026. El usuario indicó que las paletas anteriores se percibían "feas" y genéricas. Las fuentes consultadas incluyeron Awwwards, kontra.agency, material.io y colorhero.io.

**Problema con las paletas previas:**
- Dark mode usaba `#0a0a0a` (negro puro) — crea halos OLED, percepción barata.
- Light mode usaba `#F8FAFC` (blanco frío tipo hospital) — no evoca el ambiente cálido y artesanal de una barbería.

### Paleta Final Implementada

#### 🌙 Dark Mode — "Midnight Opulence" (Barbershop Premium)
| Token | Valor | Razón |
|---|---|---|
| `--theme-background` | `#13111A` | Deep Midnight — no negro puro, evita halos OLED |
| `--theme-surface` | `#1C1928` | Dark Plum — profundidad premium con tono cálido |
| `--theme-card` | `#231F31` | Rich Deep Purple Card — elevación visible |
| `--theme-foreground` | `#EDE9E0` | Warm Cream — reduce contraste duro, tono artesanal |
| `--theme-muted` | `#9E97A8` | Warm Lavender Gray — elegante para textos secundarios |
| `--theme-border` | `#2E2B3A` | Deep Plum Border — sutil y visible |

#### ☀️ Light Mode — "Porcelain Editorial" (Luxury Grooming)
| Token | Valor | Razón |
|---|---|---|
| `--theme-background` | `#FAF8F5` | Porcelain — warm paper, nunca blanco clínico |
| `--theme-surface` | `#F2EDE6` | Warm Linen — profundidad entre fondo y card |
| `--theme-card` | `#FFFEFB` | Ivory — limpio pero no frío |
| `--theme-foreground` | `#1C1110` | Espresso Dark — no negro puro |
| `--theme-muted` | `#7A6F68` | Warm Taupe — armónico con el fondo cálido |
| `--theme-border` | `#E5DDD5` | Sandy border — cálido y sutil |

### Regla de Oro para Futuras IAs
> **Nunca usar `#000000` ni `#FFFFFF` puros en ningún tema.** Siempre usar variaciones cálidas/frías con ligero croma para que la interfaz se perciba premium. Los fondos oscuros deben tener un undertone (cálido: plum/umber, o frío: navy/slate). Los fondos claros deben tener un tono hueso/porcelana con undertone cálido para evocar artesanía y lujo.

