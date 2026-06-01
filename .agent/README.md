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

## Skills (cargar antes de cada tarea)

| Task | Skill | Cómo cargar |
|---|---|---|
| Architecture decisions | `software-architect` | `/skill software-architect` o leer `.claude/skills/software-architect/SKILL.md` |
| Clean Code, SOLID, DRY, quality | `clean-code-expert` | Leer `.claude/skills/clean-code-expert/SKILL.md` |
| React, UI, 3D | `react-expert` | `/skill react-expert` o leer `.claude/skills/react-expert/SKILL.md` |
| FastAPI, endpoints | `fastapi-expert` | `/skill fastapi-expert` o leer `.claude/skills/fastapi-expert/SKILL.md` |
| PostgreSQL, DB | `dba-expert` | `/skill dba-expert` o leer `.claude/skills/dba-expert/SKILL.md` |
| Security | `security-expert` | `/skill security-expert` o leer `.claude/skills/security-expert/SKILL.md` |
| Tests | `testing-expert` | `/skill testing-expert` o leer `.claude/skills/testing-expert/SKILL.md` |
| Docker, CI/CD | `devops-expert` | `/skill devops-expert` o leer `.claude/skills/devops-expert/SKILL.md` |
| SEO, CRO | `seo-cro-expert` | `/skill seo-cro-expert` o leer `.claude/skills/seo-cro-expert/SKILL.md` |

Si `/skill` no reconoce un skill, leer el archivo `SKILL.md` directamente desde `.claude/skills/<nombre>/SKILL.md`.

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
