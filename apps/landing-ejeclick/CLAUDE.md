# landing-ejeclick — Landing Page

Worker instructions for the EjeClick landing page app.

See root CLAUDE.md for shared rules, skills, context references, and protocol.

## App-specific

- **Stack:** React 19 + Vite 8 + Tailwind v4 + Three.js + FastAPI
- **Architecture:** Atomic Design (atoms → molecules → organisms → templates → pages)
- **Backend:** FastAPI + SQLAlchemy + Pydantic at `/api/v1/`

## Commands (run from this directory)

```bash
npm run dev          # Vite dev server
npm run build        # tsc + vite build
npm test             # Vitest
npm run lint         # ESLint
npm run typecheck    # TypeScript
```

## File Organization

```
src/components/atoms/       # Indivisible UI elements
src/components/molecules/   # Atom compositions
src/components/organisms/   # Complete sections
src/components/templates/   # Layout wrappers
src/components/pages/       # Final page assemblies
src/components/three/       # 3D components
backend/app/                # FastAPI application
```
