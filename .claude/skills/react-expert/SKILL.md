---
name: react-expert
description: >
  Especialista en frontend React para EjeClick. Crea y mantiene componentes
  Atomic Design con TypeScript estricto, animaciones, 3D y accesibilidad WCAG.
version: 1.0.0
triggers:
  - componente react
  - UI / UX
  - animacion
  - three.js / 3d
  - atomic design
  - framer motion
  - tailwind
  - wcag / accesibilidad
  - formulario react
  - performance frontend
related_skills:
  - testing-expert
  - security-expert
  - seo-cro-expert
---

# Skill: react-expert

## Description

Experto en React 19 + TypeScript 6 + Vite 8 + Tailwind v4 + Three.js para el frontend de EjeClick. Responsable de mantener la arquitectura Atomic Design, animaciones con framer-motion, componentes accesibles (WCAG AA), y optimización de performance con code splitting y lazy loading.

## Stack

| Capa | Tecnología | Versión |
|---|---|---|
| UI | React | 19.2.6 |
| Lenguaje | TypeScript | 6.0.3 |
| Build | Vite | 8.0.14 |
| CSS | Tailwind CSS | 4.3.0 |
| 3D | Three.js + R3F + Drei | 0.184 + 9.6 + 10.7 |
| Postprocessing | @react-three/postprocessing | 3.0.4 |
| Animación | Framer Motion | 12.40 |
| Iconos | Lucide React | 1.16 |
| Smooth Scroll | Lenis | 1.3.23 |
| Monitoreo | @sentry/react | latest |

## Workflow

### Paso 1: Identificar el tipo de componente

| Tipo | Directorio | Características |
|---|---|---|
| **Atom** | `src/components/atoms/` | forwardRef + displayName, sin lógica de negocio, reutilizable |
| **Molecule** | `src/components/molecules/` | Composición de átomos, props drilling, estados error/empty |
| **Organism** | `src/components/organisms/` | Estado local con hooks, lógica de UI, sección completa |
| **Template** | `src/components/templates/` | Layout que posiciona organisms, sin contenido directo |
| **Page** | `src/components/pages/` | Ensamblaje final, importa templates + organisms |

### Paso 2: Escribir el componente

Reglas de código:

```tsx
// ✅ Correcto
import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';

export interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', ...props }, ref) => {
    return <button ref={ref} className={cn('base', variant, className)} {...props} />;
  }
);
Button.displayName = 'Button';
export { Button };

// ❌ Incorrecto
import React from 'react'; // No necesario (JSX auto-runtime)
export default function Button() { ... } // Usar named export
const x: any = ...; // No usar any
import { HTMLAttributes } from 'react'; // Falta type keyword
```

### Paso 3: Agregar accesibilidad WCAG

Checklist obligatorio por componente:
- [ ] `aria-label` en todos los botones icono
- [ ] `aria-expanded` + `aria-controls` en menús y acordeones
- [ ] `aria-hidden="true"` en elementos decorativos (SVG, íconos, 3D)
- [ ] `role="alert"` en mensajes de error/éxito
- [ ] `role="region"` + `aria-labelledby` en paneles de acordeón
- [ ] `aria-invalid` + `aria-describedby` en inputs con error
- [ ] `prefers-reduced-motion` respetado (ya global en CSS)
- [ ] Skip-link funcional (`#main-content`)
- [ ] Contraste de color: texto sobre fondo debe cumplir AA

### Paso 4: Animar con framer-motion

```tsx
// Animación de entrada por scroll (estándar del proyecto)
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: '-100px' }}
  transition={{ duration: 0.5, delay: index * 0.1 }}
>
  {children}
</motion.div>
```

### Paso 5: Integrar 3D (Three.js) — solo si es necesario

```tsx
// Lazy loading obligatorio para Scene3D
const Scene3D = lazy(() =>
  import('@/components/three/Scene3D').then((m) => ({ default: m.Scene3D }))
);

// Canvas siempre con performance opts
<Canvas
  dpr={[1, 2]}
  frameloop="demand"
  gl={{ powerPreference: 'high-performance', antialias: false }}
>
  <color attach="background" args={['#0A0A0F']} />
  <ambientLight intensity={0.5} />
  <Suspense fallback={null}>
    <FloatingShapes />
    <EffectComposer enableNormalPass={false}>
      <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.2} />
    </EffectComposer>
  </Suspense>
</Canvas>
```

### Paso 6: Verificar build

```bash
npm run typecheck   # 0 errores TypeScript
npm run lint        # 0 errores ESLint
npm run build       # Build exitoso
npm test            # Tests pasan (si existen para el componente)
```

## Componentes existentes (NO duplicar)

### Atoms
| Componente | Props clave | Notas |
|---|---|---|
| `Badge` | variant: default \| glow \| outline | forwardRef |
| `Button` | variant, size, isLoading | forwardRef |
| `Input` | hasError | forwardRef |
| `Typography` | variant: h1-h4 \| p \| small \| lead; as; gradient | createElement |
| `OptimizedImage` | src, alt, webp, avif, priority | lazy loading native |

### Molecules
| Componente | Props clave | Notas |
|---|---|---|
| `AccordionItem` | question, answer, defaultOpen | framer-motion, aria-controls |
| `FormField` | label, error | forwardRef, aria-describedby |
| `GlassCard` | glowOnHover | forwardRef, glass-card utility |
| `ServiceCard` | icon, title, description, highlightColor | LucideIcon type |
| `SocialLink` | icon, label | target=_blank, noopener |

### Organisms
| Componente | Sección | Notas |
|---|---|---|
| `Navbar` | Header | Sticky + glassmorphism + menú móvil |
| `HeroSection` | Hero | Scene3D lazy, badge, h1, CTAs |
| `ServicesGrid` | Servicios | Bento grid + staggered animations |
| `ProcessSection` | Proceso | Timeline `<ol>/<li>` + aria-hidden |
| `SocialProofSection` | Casos | Tabla role=table + métricas |
| `FAQSection` | FAQ | Accordion + FAQPage JSON-LD |
| `ContactSection` | Contacto | Form POST /api/v1/leads + role=alert |
| `Footer` | Footer | 2 navs con aria-label |

## Edge Cases

| Situación | Manejo |
|---|---|
| Componente ya existe | Revisar tabla de componentes existentes primero |
| Icono no existe en lucide-react | Verificar con `node -e "require('lucide-react').NombreIcono"` |
| Three.js muy pesado para móvil | Scene3D devuelve null en <768px; lazy loading |
| Error en animación | framer-motion con `initial=false` si el componente se montacondicionalmente |
| Formulario sin fetch API | Mostrar error con `role="alert"` |
| Componente sin test | Crear test con `ComponentName.test.tsx` junto al componente |

## Validation / Definition of Done

- [ ] TypeScript: 0 errores (`npm run typecheck`)
- [ ] ESLint: 0 errores (`npm run lint`)
- [ ] Build: exitoso (`npm run build`)
- [ ] Tests: existen y pasan para el componente nuevo/modificado (`npm test`)
- [ ] Accesibilidad: checklist WCAG completado
- [ ] Responsive: funciona en 375px, 768px, 1440px
- [ ] Sin imports no usados
- [ ] Sin `any` types
- [ ] Sin `console.log` en producción
- [ ] Sin emojis en código (solo en contenido si el cliente lo pide)

## Related Skills

- `testing-expert` — para escribir tests del componente
- `security-expert` — para auditar seguridad del componente
- `seo-cro-expert` — para optimizar conversión del componente
