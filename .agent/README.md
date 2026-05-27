---
description: >
  Entry point for any AI agent working on EjeClick monorepo. Read this first
  to understand the structure, projects, and which skill to load.
version: 3.0.0
---

# EjeClick — Monorepo

## Estructura

```
apps/
  landing-ejeclick/     # Landing page principal
packages/               # Librerias compartidas (pendiente)
.claude/skills/         # Skills transversales
.claude/rules/          # Reglas path-scoped
.agent/context/         # Backlog, decisiones, estado
```

## Entry Points

| File | Location | Purpose |
|---|---|---|
| `CLAUDE.md` | Root | Orchestrator — entry point principal |
| `AGENTS.md` | Root | Autonomous execution protocol |
| `context/mission.md` | `.agent/context/` | Product vision |
| `context/project.md` | `.agent/context/` | Tech stack & architecture |
| `context/task.md` | `.agent/context/` | Monorepo backlog |
| `context/decisions/` | `.agent/context/` | ADRs |

## Skills

| Task | Skill |
|---|---|
| Architecture decisions | `.claude/skills/software-architect/SKILL.md` |
| React, UI, 3D | `.claude/skills/react-expert/SKILL.md` |
| FastAPI, endpoints | `.claude/skills/fastapi-expert/SKILL.md` |
| PostgreSQL, DB | `.claude/skills/dba-expert/SKILL.md` |
| Security | `.claude/skills/security-expert/SKILL.md` |
| Tests | `.claude/skills/testing-expert/SKILL.md` |
| Docker, CI/CD | `.claude/skills/devops-expert/SKILL.md` |
| SEO, CRO | `.claude/skills/seo-cro-expert/SKILL.md` |

## Commands

```bash
npm run dev              # Dev: landing-ejeclick (:3000)
npm run dev:barberia     # Dev: barberia-flow-flow (:3002)
npm run dev:all          # Ambos simultáneamente
npm run build            # Build: landing-ejeclick
npm run build:barberia   # Build: barberia-flow-flow
npm run build:all        # Ambos builds
npm test                 # Tests: landing-ejeclick
```

Al agregar una app nueva, crear script `dev:<name>` y puerto único en `vite.config.ts`.
