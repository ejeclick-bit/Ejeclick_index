# ADR-012: Barbershop Landing Premium Design System

**Date:** 2026-06-09
**Status:** accepted
**Aplica a:** `apps/flow-flow/landing` únicamente (la vista del cliente final)

## Context
El sistema de temas anterior era genérico. El modo oscuro parecía una terminal de hacker (#000 puro) y el modo claro parecía un documento de Word (#FFF puro). El usuario solicitó una experiencia inmersiva y temática acorde al espacio físico de una barbería.

## Decision

### Paleta Implementada

#### 🌙 Dark Mode — "Barbería Clandestina Nocturna"
Evoca cuero, madera oscura, luces tenues de un lounge.

| Token | Valor | Concepto |
|---|---|---|
| `--theme-background` | `#141414` | Carbón profundo — nunca negro |
| `--theme-surface` | `#1c1c1e` | Pizarra quemada cálida |
| `--theme-card` | `#202023` | Elevación visual de tarjetas |
| `--theme-foreground` | `#e4e4e7` | Plata cepillada — sin fatiga visual |
| `--theme-muted` | `#a1a1aa` | Gris apagado |
| `--theme-border` | `#2a2a2d` | Borde casi invisible |
| `--theme-accent` | `#c5a880` | **Bronce satinado / Dorado viejo** |

#### ☀️ Light Mode — "Barbería Clásica Mañana"
Evoca toallas limpias, iluminación natural, frescura, mármol.

| Token | Valor | Concepto |
|---|---|---|
| `--theme-background` | `#f5f4f0` | Lino / Arena suave — nunca blanco |
| `--theme-surface` | `#ede9e4` | Arena cálida en capas |
| `--theme-card` | `#ffffff` | Blanco puro para contraste sobre arena |
| `--theme-foreground` | `#1c1917` | Café grafito — no negro duro |
| `--theme-muted` | `#71717a` | Gris topo/piedra |
| `--theme-border` | `#d6cfc7` | Beige desaturado |
| `--theme-accent` | `#b45309` | **Ámbar whisky** (más saturado en claro para contraste) |

### Transición Cinematográfica
Se aplica `transition: background-color 400ms cubic-bezier(0.4, 0, 0.2, 1)` a `body` y a `*, *::before, *::after` para que TODOS los elementos transicionen suavemente. Las clases `.no-theme-transition` y `.cursor-spotlight` se excluyen.

### Componentes Actualizados
1. **Button (CTA "Agenda tu Cita")**: Dark = bronce sólido `#c5a880` con texto carbón + sombra dorada en hover. Light = ámbar whisky `#b45309` con texto blanco.
2. **ServiceCard**: Scale 1.02 + translateY(-4px) en hover. Línea de acento superior animada. Badge precio con `--theme-accent` semántico.
3. **Navbar**: Glassmorphism adaptativo. Dark = `bg-surface/80 backdrop-blur-xl` con borde bronce 10%. Light = blanco translúcido. Links con subrayado animado.

## Consequences
- `--theme-accent` y `--theme-accent-dim` son los únicos tokens de color de marca que cambian entre temas (bronce en dark → ámbar en light) para garantizar contraste WCAG.
- Las clases de Tailwind como `bg-brand-gold` siguen funcionando para el tenant branding, pero los componentes de la landing usan `var(--theme-accent)` directamente.
- **Regla:** Nunca usar `#000000` ni `#FFFFFF` en ningún fondo. Siempre con undertone.
