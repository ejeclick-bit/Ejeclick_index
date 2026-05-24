# Skill: Experto en Testing — EjeClick

## When to use
- Escribir tests unitarios para componentes React
- Escribir tests de integración para APIs
- Configurar o modificar Vitest, Testing Library
- Ejecutar suite de tests y analizar cobertura
- Verificar accesibilidad (aria, roles) mediante tests

## Stack de testing actual
- **Vitest 4.1+** con jsdom environment
- **@testing-library/react 16+** (testing-library/user-event 14+)
- **@testing-library/jest-dom** (setup en `src/test/setup.ts`)
- Corrido por `husky` pre-commit + GitHub Actions CI

## Configuración

### `vitest.config.ts`
```ts
test: {
  environment: 'jsdom',
  globals: true,
  setupFiles: ['./src/test/setup.ts'],
  css: true,
}
```

### `package.json` scripts
```bash
npm test           # vitest run
npm run test:watch # vitest (watch mode)
```

## Tests existentes
```
src/components/atoms/Button.test.tsx      # 4 tests
src/components/atoms/Typography.test.tsx  # 4 tests
```

## Patrones obligatorios

### Nomenclatura
- Archivos: `ComponentName.test.tsx` (junto al componente)
- Describir el componente: `describe('Button', () => { ... })`
- Tests en español (misma lengua que el proyecto)

### Estructura de un test
```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renderiza children', () => {
    render(<Button>Texto</Button>);
    expect(screen.getByText('Texto')).toBeInTheDocument();
  });

  it('ejecuta onClick al hacer clic', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    await userEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Lo que hay que testear en cada componente

#### Atoms
- Renderizado básico con children
- Variantes (clases CSS esperadas)
- Estados (disabled, loading, error)
- Eventos (onClick, onChange)
- Ref forwarding (si aplica)
- Accesibilidad (aria attributes, role)

#### Molecules
- Composición de átomos (que los children se rendericen)
- Interacción entre subcomponentes
- Estados de error y vacío
- Accesibilidad (aria-describedby, aria-controls)

#### Organisms
- Renderizado de la sección completa
- Estados: idle, loading, success, error
- Mock de fetch (ContactSection)
- Navegación y scroll (Navbar)
- Interacción de acordeón (FAQSection)

#### Pages
- Integración de organisms (LandingPage)
- Layout rendering (MainLayout)

### Mocking de APIs
```tsx
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const server = setupServer(
  http.post('/api/v1/leads', () => HttpResponse.json({ id: 1 }), { status: 201 }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### Cobertura de accesibilidad (WCAG)
- `screen.getByRole()` en vez de `getByTestId()` siempre que sea posible
- Verificar `aria-expanded`, `aria-controls`, `aria-label`
- Verificar que elementos decorativos tengan `aria-hidden`
- Verificar skip-link funcional

## Comandos
```bash
npm test                 # Una vez
npm run test:watch       # Modo watch
npx vitest run --coverage # Con cobertura (instalar @vitest/coverage-v8)
```
