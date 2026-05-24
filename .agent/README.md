# EjeClick — AI Agent Context

## Project Overview

Landing page de alta conversión para EjeClick (agencia de desarrollo web). Construida bajo estándares Silicon Valley con React 19 + Vite 8 + Three.js + FastAPI + PostgreSQL.

**Estado:** ~95% completo. Ver `context/task.md` para backlog detallado.

---

## Entry Points

| File | Purpose |
|---|---|
| `context/mission.md` | Product vision, Scrum methodology, Atomic Design rules |
| `context/project.md` | Single Source of Truth: tech stack, conversion rules, AIDCA model |
| `context/task.md` | Scrum backlog with current completion status |

---

## Skills (Auto-loading)

Each skill is in its own directory under `skills/<skill-name>/`. Load the relevant skill before starting any task:

| Task | Skill |
|---|---|
| React components, UI, animations, 3D, Atomic Design | `react-expert` |
| FastAPI endpoints, SQLAlchemy models, Pydantic schemas | `fastapi-expert` |
| PostgreSQL schema, indexes, migrations, query optimization | `dba-expert` |
| CSP, CORS, rate limiting, security audit, pre-deploy checklist | `security-expert` |
| Vitest, React Testing Library, test patterns, coverage | `testing-expert` |
| Docker, CI/CD, nginx, SSL, deploy, monitoring | `devops-expert` |
| SEO, CRO, JSON-LD, Lighthouse, analytics, A/B testing | `seo-cro-expert` |

**Workflow:**
1. Read `context/task.md` first
2. Read `context/project.md` for business rules
3. Load the relevant skill(s) from `skills/<skill-name>/`
4. After completing work, update `context/task.md`

---

## Quick Commands

```bash
npm run dev              # Frontend dev server
npm run build            # Production build
npm test                 # Run tests
npm run lint             # ESLint
npm run typecheck        # TypeScript check
docker compose up -d     # Full stack (frontend + backend + db)
```
