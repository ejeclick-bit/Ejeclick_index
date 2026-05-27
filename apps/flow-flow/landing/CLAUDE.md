# Barbería Flow Flow — Landing Page

Parent: `apps/flow-flow/` — see CLAUDE.md there for orchestration commands.

See root CLAUDE.md for shared rules, skills, context references, and protocol.

## Brand

- **Nombre:** Barbería Flow Flow
- **Eslogan:** Estilo que habla por sí solo
- **Tono:** Moderno, profesional, cercano
- **Colores:** Negro (#0a0a0a), blanco, dorado/accento por definir

## Stack

- React 19 + Vite 8 + Tailwind v4 + Framer Motion
- Sin Three.js (más liviano, solo si se necesita)
- Sin backend propio (formulario → servicio externo o email)

## Commands

```bash
npm run dev          # Vite dev server
npm run build        # tsc + vite build
npm test             # Vitest
npm run lint         # ESLint
npm run typecheck    # TypeScript
```

## Atomic Design Structure

```
src/components/atoms/       # Button, Input, Badge, Icon, Typography
src/components/molecules/   # ServiceCard, TestimonialCard, FormField
src/components/organisms/   # Hero, Services, Testimonials, Contact, Footer
src/components/templates/   # MainLayout
src/components/pages/       # LandingPage
```

## Content Sections (por construir)

1. Hero — titular + CTA + imagen de barbería
2. Servicios — lista de cortes y precios
3. Galería — trabajos realizados
4. Testimonios — clientes satisfechos
5. Ubicación — mapa + dirección
6. Contacto — formulario + WhatsApp
7. Footer — redes + horarios
