# Frontend Rules

Paths: apps/*/src/**/*.tsx

## Architecture

Atomic Design: atoms → molecules → organisms → templates → pages

## Accessibility (WCAG AA)

- `aria-label` on icon-only buttons
- `aria-expanded` + `aria-controls` on menus and accordions
- `aria-hidden="true"` on decorative SVGs/icons
- `role="alert"` on error/success messages
- `role="region"` + `aria-labelledby` on panels
- `aria-invalid` + `aria-describedby` on inputs with errors
- Respect `prefers-reduced-motion`
- Skip-link targeting `#main-content`

## Animations

- Framer Motion for all animations
- Scroll-triggered with `whileInView`, `once: true`
- Three.js lazy-loaded, disabled on mobile (<768px)

## Styling

Tailwind CSS v4 with custom tokens.
Use `cn()` utility for conditional className merging.
