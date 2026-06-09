# ADR-010: PostgreSQL Row-Level Security for Multi-Tenancy

**Date:** 2026-06-09
**Status:** accepted

## Context
The Flow-Flow administrative panel and landing pages are built as a multi-tenant SaaS. Currently, isolation between different barbershops was enforced purely at the application layer using SQLAlchemy `.filter(Model.barbershop_id == tenant_id)`. This approach is error-prone: if a developer forgets to include the filter in a query, data leakage between tenants can occur. For a production B2B environment, stronger guarantees are required to ensure strict data separation.

## Decision
We decided to implement PostgreSQL Row-Level Security (RLS) as the primary mechanism for multi-tenant data isolation.
- The FastAPI database dependency (`get_db`) was updated to inject the active `tenant_id` into the PostgreSQL session using `SET LOCAL app.current_tenant = '<tenant_id>'`.
- During application startup (`lifespan`), we execute `ALTER TABLE <table_name> ENABLE ROW LEVEL SECURITY;` on all tenant-specific tables.
- A permissive policy is applied: users can only read/write rows where `barbershop_id` matches the `app.current_tenant` variable, OR if the variable is empty (which corresponds to the `super_admin` role).

## Consequences
- **Pros:** 
  - Absolute data isolation guaranteed at the database engine level.
  - Mitigates human error (forgetting a `.filter()` in SQLAlchemy).
  - Centralized security policy.
- **Cons:** 
  - Slight overhead when opening database sessions due to the additional `SET LOCAL` command.
  - Requires developers to be mindful of `app.current_tenant` when executing raw SQL or background tasks outside the standard HTTP request lifecycle.
