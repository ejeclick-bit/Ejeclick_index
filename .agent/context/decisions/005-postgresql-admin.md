# ADR-005: PostgreSQL for Admin Panel (Flow Flow)

**Date:** 2026-05-27
**Status:** accepted

## Context

The admin panel for Flow Flow was initially built with SQLite for development speed, violating the project's PostgreSQL standard established in ADR-004 and the dba-expert skill.

## Decision

Migrate the admin backend from SQLite to PostgreSQL, using the same stack as the rest of the monorepo:

- Docker: each project has its own PostgreSQL instance (`db` for landing-ejeclick, `db-flow` for flow-flow)
- Local dev: SQLite fallback via `FLOW_DATABASE_URL` env var
- Production: PostgreSQL via Docker Compose

## Consequences

**Positivas:**
- Consistent database technology across all projects
- Same tooling (pgAdmin, backups, migrations) applies everywhere
- No schema fragmentation between projects

**Negativas:**
- Minor overhead of running a second PostgreSQL container for local development
- SQLite fallback for local dev without Docker (acceptable trade-off)
