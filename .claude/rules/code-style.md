# Code Style

Paths: apps/*/src/**/*.{ts,tsx}

## TypeScript

- strict mode enabled — no `any` type
- Named exports only (no `export default`)
- Use `interface` over `type` for object shapes
- Prefix component props with `ComponentNameProps`
- Use `const` over `let` where possible

## React Components

- Atoms: `forwardRef` + `displayName`
- Props interface with JSDoc comments
- Destructure props in function signature
- Use `cn()` utility for className merging

## Imports

Order: React → libraries → utils → components → styles

```tsx
import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';
```
