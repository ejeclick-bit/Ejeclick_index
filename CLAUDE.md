@AGENTS.md

---

## Project

EjeClick — Agencia de desarrollo web. Este monorepo contiene todos los proyectos y paquetes compartidos.

## Structure

```
apps/                      # Proyectos ejecutables
  landing-ejeclick/        # Landing page principal (React + FastAPI + Postgres)
packages/                  # Librerías compartidas (pendiente)
.claude/skills/            # Skills transversales a todos los proyectos
.claude/rules/             # Reglas path-scoped compartidas
.agent/context/            # Backlog, decisiones, estado del monorepo
```

## Apps

| App | Stack | Comandos |
|---|---|---|
| `apps/landing-ejeclick` | React 19 + Vite 8 + FastAPI + Postgres | `npm run dev -w apps/landing-ejeclick` |
| `apps/flow-flow/landing` | React 19 + Vite 8 + Tailwind v4 | `npm run dev -w apps/flow-flow/landing` |
| `apps/flow-flow/admin` | React 19 + Vite 8 + FastAPI + PostgreSQL | `npm run dev -w apps/flow-flow/admin` + `npm run dev:admin:backend` |

## Commands (from root)

```bash
npm run dev              # Dev server (landing-ejeclick → :3000)
npm run dev:barberia     # Dev server (barberia-flow-flow → :3002)
npm run dev:all          # Ambos simultáneamente
npm run build            # Build landing-ejeclick
npm run build:barberia   # Build barberia-flow-flow
npm run build:all        # Ambos builds
npm test                 # Tests
npm run lint             # ESLint
npm run typecheck        # TypeScript
```

## Port Convention

Each app in `apps/` gets a unique port for development to avoid conflicts:

| App | Port |
|---|---|
| `apps/landing-ejeclick` | 3000 |
| `apps/flow-flow/landing` | 3002 |
| `apps/flow-flow/admin` (frontend) | 3003 |
| `apps/flow-flow/admin` (backend) | 8001 |
| Future apps | Next available port |

When adding a new app, set its port in `vite.config.ts` under `server.port` and add a `dev:<name>` script in root `package.json`.

## Skills (load matching skill before coding)

| Task type | Skill location |
|---|---|
| Architecture, decisions, trade-offs | `.claude/skills/software-architect/SKILL.md` |
| Clean Code, SOLID, DRY, refactoring, error handling | `.claude/skills/clean-code-expert/SKILL.md` |
| React, UI, 3D, animations | `.claude/skills/react-expert/SKILL.md` |
| FastAPI, endpoints, models | `.claude/skills/fastapi-expert/SKILL.md` |
| PostgreSQL, DB, migrations | `.claude/skills/dba-expert/SKILL.md` |
| Security, CSP, CORS, audit | `.claude/skills/security-expert/SKILL.md` |
| Tests, Vitest, coverage | `.claude/skills/testing-expert/SKILL.md` |
| Docker, CI/CD, deploy, nginx | `.claude/skills/devops-expert/SKILL.md` |
| SEO, CRO, Lighthouse, analytics | `.claude/skills/seo-cro-expert/SKILL.md` |

## Rules (auto-applied by Claude Code)

| File | Scope |
|---|---|
| `.claude/rules/code-style.md` | `apps/*/src/**/*.{ts,tsx}` |
| `.claude/rules/testing.md` | `apps/*/src/**/*.test.{ts,tsx}` |
| `.claude/rules/api-design.md` | `apps/*/backend/**/*.py` |
| `.claude/rules/security.md` | nginx, CI/CD, backend |
| `.claude/rules/frontend-rules.md` | `apps/*/src/**/*.tsx` |
| `.claude/rules/backend-rules.md` | `apps/*/backend/**/*.py` |

## Context

| File | Purpose |
|---|---|
| `.agent/context/task.md` | Monorepo backlog |
| `.agent/context/project.md` | Tech stack & architecture |
| `.agent/context/mission.md` | Product vision |
| `.agent/context/decisions/` | ADRs |

## Critical Rules

1. **Never** modify dependencies without human approval.
2. **Always** run `npm run typecheck && npm run lint && npm test && npm run build`.
3. **Always** update `.agent/context/task.md` after completing a task.
4. **Log** architectural decisions in `.agent/context/decisions/`.
5. **Read** AGENTS.md for the full autonomous execution protocol.
