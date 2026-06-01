# ADR-008: Multi-Tenant SaaS Architecture for Barbershop Platform

**Date:** 2026-05-29
**Status:** proposed

## Context

El proyecto actual implementa una sola barbería ("Flow Flow") con datos hardcodeados en la landing y una BD sin concepto de tenancy. Para escalar a múltiples clientes sin desarrollo por cada uno, necesitamos una arquitectura multi-tenant SaaS donde una sola instancia sirva a N barberías independientes.

## Decision

Adoptar una arquitectura **multi-tenant con base de datos compartida (shared database, tenant isolation)** con las siguientes características:

1. **Modelo Barbershop** central con todos los atributos de branding (slug, name, palette JSON, logo, social JSON, contact)
2. **Tenant isolation** vía `barbershop_id` FK en todas las entidades
3. **Middleware de resolución de tenant** por subdominio (Host header → slug → DB lookup → barbershop_id inyectado en `request.state`)
4. **Super admin** con `barbershop_id = null` y acceso sin restricciones a cualquier barbería
5. **Auto-provisioning**: al crear un registro Barbershop, generar automáticamente schedule, sections, admin user y servicios base
6. **Landing 100% dinámica**: CSS custom properties inyectadas desde la paleta del tenant. Sin hardcode de colores, textos ni branding.
7. **Subdominios wildcard**: `[slug].ejeclickbarber.com` para landing, `admin.[slug].ejeclickbarber.com` para admin panel

## Opciones Consideradas

1. **Schema-per-tenant**: Una base de datos PostgreSQL por barbería.
   - Ventajas: aislamiento total, backups independientes
   - Desventajas: complejidad operativa alta, no escala con SQLite en dev

2. **Database-per-tenant**: Misma instancia PostgreSQL, un schema por slug.
   - Ventajas: buen aislamiento, migraciones independientes
   - Desventajas: complejidad de routing, migraciones por schema

3. **Shared database + tenant column**: Una BD con barbershop_id en todas las tablas.
   - Ventajas: simple, escalable, fácil de implementar, un solo backup
   - Desventajas: requiere disciplina en queries (nunca olvidar el filtro)

**Decisión: Opción 3** — Shared database con `barbershop_id`. Es el patrón más común en SaaS early-stage, fácil de implementar y migrar desde el estado actual. Si el volumen crece, se puede migrar a schema-per-tenant posteriormente.

## Consequences

### Positivas
- Nueva barbería on-boarded en minutos (crear registro → automático)
- Una sola instancia de backend/frontend para todas las barberías
- Branding 100% configurable desde el admin (sin tocar código)
- Mantenimiento y deploys centralizados
- Datos de todas las barberías en un solo lugar para analítica cross-tenant

### Negativas
- Migración de datos existentes: la BD actual debe adaptarse al nuevo schema con barbershop_id
- Riesgo de leak entre tenants si una query olvida el filtro de barbershop_id
- El helper `get_tenant_query()` debe usarse en TODAS las queries sin excepción
- Desarrollo local con subdominios requiere configuración extra (hosts file o nginx local)
- La landing y el admin deben reescribirse para eliminar todo hardcode
