---
name: testing-expert
description: >
  Especialista en testing para EjeClick. Escribe y mantiene tests unitarios
  y de integración con Vitest + React Testing Library para componentes React
  y APIs de FastAPI. Asegura cobertura mínima del 80%.
version: 1.0.0
triggers:
  - test / testing
  - vitest
  - react testing library
  - test unitario
  - test integracion
  - cobertura
  - msw
  - mock api
  - componente test
related_skills:
  - react-expert
  - fastapi-expert
---

# Skill: testing-expert

## Description

Experto en testing para EjeClick. Responsable de escribir y mantener tests unitarios (Vitest + React Testing Library) para componentes React y tests de integración para la API FastAPI. Asegura que el proyecto mantenga cobertura mínima del 80% y que ningún PR rompa tests existentes.

## Stack de testing

| Herramienta | Versión | Propósito |
|---|---|---|
| Vitest | 4.1+ | Test runner |
| @testing-library/react | 16+ | Renderizado de componentes |
| @testing-library/user-event | 14+ | Simulación de usuario |
| @testing-library/jest-dom | 6.9+ | Matchers DOM |
| jsdom | 29+ | Entorno browser simulado |
| MSW (opcional) | latest | Mock de APIs |

## Tests existentes

| Archivo | Tests | Lo que cubre |
|---|---|---|
| `src/components/atoms/Button.test.tsx` | 4 | Render, variantes, loading, onClick |
| `src/components/atoms/Typography.test.tsx` | 4 | Render, variantes h1, as prop, gradient |

**Total: 8 tests — cobertura: ~5%** (objetivo: 80%)

## Workflow

### Paso 1: Identificar qué testear

| Prioridad | Componente | Tipo de test |
|---|---|---|
| Alta | Atoms nuevos | Unitario (render, variantes, eventos) |
| Alta | Molecules nuevos | Unitario (composición, interacción, estados) |
| Media | Organisms existentes | Integración (fetch mock, estados idle/loading/error/success) |
| Media | API endpoints | Integración (POST/GET, validación, errores) |
| Baja | Pages | Integración (ensamblaje completo) |

### Paso 2: Escribir el test

```tsx
// src/components/atoms/Button.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renderiza children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('aplica variante primary', () => {
    const { container } = render(<Button variant="primary">Primary</Button>);
    expect(container.firstChild).toHaveClass('from-accent-primary');
  });

  it('muestra estado loading', () => {
    render(<Button isLoading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('ejecuta onClick al hacer clic', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    await userEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Paso 3: Mockear fetch para organisms

```tsx
// src/components/organisms/ContactSection.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ContactSection } from './ContactSection';

beforeEach(() => {
  globalThis.fetch = vi.fn();
});

it('muestra success al enviar formulario', async () => {
  (globalThis.fetch as any).mockResolvedValueOnce({
    ok: true,
    json: async () => ({ id: 1 }),
  });

  render(<ContactSection />);

  await userEvent.type(screen.getByLabelText('Nombre Completo'), 'Juan');
  await userEvent.type(screen.getByLabelText('Correo Electrónico'), 'juan@test.com');
  await userEvent.type(screen.getByLabelText('WhatsApp'), '+573001111111');
  await userEvent.type(screen.getByLabelText('Tipo de Negocio'), 'Restaurante');
  await userEvent.click(screen.getByText('Solicitar Diagnóstico Gratuito'));

  expect(await screen.findByRole('alert')).toHaveTextContent('Gracias');
});
```

### Paso 4: Verificar accesibilidad en tests

```tsx
it('tiene aria-expanded en el acordeón', () => {
  render(<AccordionItem question="Test" answer="Respuesta" />);
  const button = screen.getByRole('button', { name: /test/i });
  expect(button).toHaveAttribute('aria-expanded', 'false');
});
```

### Paso 5: Ejecutar y verificar cobertura

```bash
npm test                          # Todos los tests
npx vitest --coverage             # Con reporte de cobertura
npx vitest run src/components/atoms/Button.test.tsx  # Test específico
```

## Reglas estrictas

| Regla | Explicación |
|---|---|
| Archivo: `Componente.test.tsx` | Junto al componente, mismo directorio |
| `describe('Componente', ...)` | Agrupar tests del mismo componente |
| Tests en español | Coherente con el idioma del proyecto |
| `screen.getByRole()` sobre `getByTestId()` | Priorizar queries accesibles |
| Mockear fetch con `vi.fn()` | No llamar APIs reales en tests |
| No usar `any` en mocks | Tipar mocks con `as jest.Mock` o similar |
| Cada test prueba UNA cosa | Un `it` por comportamiento |

## Prioridad de tests (por escribir)

| Componente | Prioridad | Tipo |
|---|---|---|
| `AccordionItem` | Alta | Unitario + accesibilidad |
| `FormField` | Alta | Unitario + aria-describedby |
| `Navbar` | Alta | Unitario + menú móvil |
| `ContactSection` | Alta | Integración + fetch mock |
| `HeroSection` | Media | Render + lazy 3D |
| `FAQSection` | Media | Integración + accordion |
| `ServicesGrid` | Media | Render + animaciones |
| `LandingPage` | Baja | Integración |
| `MainLayout` | Baja | Integración + skip link |
| API endpoints | Media | Integración (pytest + httpx) |

## Edge Cases

| Situación | Manejo |
|---|---|
| Componente con framer-motion | Envolver en `motion.div` no requiere mock (framer-motion funciona en jsdom) |
| Componente con IntersectionObserver | Mockear `globalThis.IntersectionObserver` |
| Componente con lazy/Suspense | Usar `act()` + `waitFor()` |
| Fetch falla en test | Mockear `fetch` para que rechace |
| Test lento | Usar `vi.useFakeTimers()` para setTimeout |
| Error asíncrono no capturado | Envolver en `waitFor()` o `findBy*` |

## Validation / Definition of Done

- [ ] Test existe para el componente nuevo/modificado
- [ ] `npm test` pasa (0 fallos)
- [ ] No hay tests comentados o saltados (`.skip`)
- [ ] Tests usan queries accesibles (getByRole, getByLabelText)
- [ ] Cobertura del componente >80%
- [ ] Sin `console.log` en tests
- [ ] Sin mocks globales que contaminen otros tests

## Related Skills

- `react-expert` — para entender la estructura del componente a testear
- `fastapi-expert` — para tests de integración de API
