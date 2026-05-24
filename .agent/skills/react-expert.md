# Skill: Experto en React — EjeClick Frontend

## Stack específico del proyecto
- **React 19.2** con JSX auto-runtime (no importar `React`)
- **TypeScript 6.0** estricto: `verbatimModuleSyntax`, `noUnusedLocals`, `erasableSyntaxOnly`
- **Vite 8** con bundler Rolldown
- **Tailwind CSS v4** con `@theme` tokens y `@tailwindcss/vite` plugin
- **Atomic Design**: `atoms/` → `molecules/` → `organisms/` → `templates/` → `pages/`

## Reglas estrictas

### Importaciones
```tsx
// Tipos SIEMPRE con `type` (verbatimModuleSyntax)
import { type HTMLAttributes, forwardRef } from 'react';
import { type LucideIcon } from 'lucide-react';

// NO usar `import React from 'react'` (JSX auto-runtime)
// NO usar `export default function` en componentes — usar named exports
export function Button() { ... }
```

### Componentes
- **Atoms**: `forwardRef` + `displayName` + interfaz de props explícita
- **Molecules**: composición de átomos, sin lógica de negocio
- **Organisms**: secciones completas con estado local, hooks, y lógica de UI
- **Templates**: layouts que posicionan organisms
- **Pages**: ensamblaje final inyectando contenido en templates

### Patrones obligatorios
```tsx
// Atoms con forwardRef
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', ...props }, ref) => {
    return <button ref={ref} className={cn(...)} {...props} />;
  }
);
Button.displayName = "Button";
export { Button };
```

- Usar `cn()` de `@/utils/cn` para合并 Tailwind classes
- `aria-label` en todos los iconos interactivos
- `role="presentation"` o `aria-hidden` en elementos decorativos
- `prefers-reduced-motion` respetado en animaciones

### Átomos existentes (NO duplicar)
- `Badge` — variant: default | glow | outline
- `Button` — variant: primary | secondary | outline | ghost; size: sm | md | lg | icon; isLoading
- `Input` — hasError, forwardRef
- `Typography` — variant: h1-h4 | p | small | lead; as prop; gradient bool
- `OptimizedImage` — lazy loading con IntersectionObserver, WebP/AVIF support

### Moléculas existentes
- `AccordionItem` — question, answer, defaultOpen; usa framer-motion
- `FormField` — label, error, containerClassName; conecta Input + label + error
- `GlassCard` — glowOnHover; forwardRef
- `ServiceCard` — icon (LucideIcon), title, description, highlightColor
- `SocialLink` — icon (LucideIcon), label; target=_blank + noopener

### Organismos existentes
- `Navbar` — sticky + glassmorphism on scroll, menú móvil con framer-motion
- `HeroSection` — Scene3D lazy-loaded, badge, h1, CTAs, animaciones escalonadas
- `ServicesGrid` — bento grid con staggered animations
- `ProcessSection` — timeline con `<ol>/<li>`, animaciones por scroll
- `SocialProofSection` — métricas + tabla comparativa con roles ARIA
- `FAQSection` — acordeón con FAQPage JSON-LD schema
- `ContactSection` — formulario controlado, POST a `/api/v1/leads`, role=alert
- `Footer` — enlaces agrupados en `<nav aria-label>`

### 3D (Three.js)
- `Scene3D` — lazy-loaded con React.lazy + Suspense
- Canvas con `frameloop="demand"`, `dpr={[1,2]}`, mobile fallback a null
- Bloom postprocessing con `enableNormalPass={false}`

### Dependencias clave
- `framer-motion` — animaciones (SIEMPRE respetar reduced-motion)
- `lucide-react` — iconos (verificar nombre exportado antes de usar)
- `@sentry/react` — ErrorBoundance + tracing
- `lenis` — smooth scroll (ya integrado en MainLayout)

## Comandos
```bash
npm run dev          # Servidor de desarrollo
npm run build        # tsc -b + vite build
npm run lint         # ESLint
npm run typecheck    # tsc -b
npm test             # Vitest
```
