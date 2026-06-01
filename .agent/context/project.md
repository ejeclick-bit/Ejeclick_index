# Project Context: EjeClick - Multi-Tenant SaaS Platform

## 1. Executive Summary & Core Objective
**EjeClick** es una plataforma SaaS multi-tenant para barberías. Una sola instancia sirve a N barberías, cada una con su propio subdominio, branding personalizado, landing page y panel administrativo. Sin desarrollo por cliente — solo configuración.

- **Meta Inmediata:** Migrar la barbería Flow Flow de hardcodeada a multi-tenant, con modelo Barbershop y tenant isolation.
- **Meta de Mediano Plazo:** Permitir al super admin crear nuevas barberías desde el panel, con auto-provisioning.
- **Propósito del Archivo:** SSOT para agentes de IA. Cada línea de código debe respetar tenancy isolation y Clean Architecture.

## 2. Technical Stack

| Capa | Tecnología | Propósito |
|---|---|---|
| Frontend Landing | React 19 + Vite 8 + Tailwind v4 + Framer Motion | Landing dinámica por tenant |
| Frontend Admin | React 19 + Vite 8 + React Router v7 | Panel multi-tenant con super admin |
| Backend | FastAPI + Python 3.12 + SQLAlchemy 2.0 | API REST con middleware de tenant |
| Base de Datos | PostgreSQL 16 | Tenant isolation por barbershop_id |
| Infra | Docker + nginx | Wildcard subdominios |
| Monorepo | npm workspaces | apps/ + packages/ |

## 3. Multi-Tenant Architecture Rules

| Regla | Explicación |
|---|---|
| **Tenant Isolation** | barbershop_id en TODAS las tablas. Un tenant nunca ve datos de otro. |
| **Resolución por subdominio** | Host header → slug → barbershop_id en request.state |
| **Super Admin** | Usuario con barbershop_id = null. Acceso total a todas las barberías. |
| **Auto-Provisioning** | Al crear Barbershop: schedule + sections + admin user + servicios base por defecto. |
| **Landing dinámica** | Paleta de colores, logo, textos desde GET /api/tenant. Zero hardcode. |
| **Branding Configurable** | Colores vía CSS custom properties desde BD. Admin elige con color picker. |
| **Subdominios** | `[slug].ejeclickbarber.com` → landing. `admin.[slug].ejeclickbarber.com` → admin panel. |

## 4. Database Schema (Core Entities)

```
Barbershop (slug, name, tagline, logo, palette JSON, social JSON, domain, contact)
├── users.barbershop_id
├── services.barbershop_id
├── appointments.barbershop_id
├── schedules.barbershop_id
├── testimonials.barbershop_id
├── gallery_images.barbershop_id
├── day_overrides.barbershop_id
└── time_blocks.barbershop_id
```

## 5. Implementation Roadmap

### Phase 1: Multi-Tenancy Core (Sprint 12)
1. Barbershop model + barbershop_id en todas las tablas
2. Tenant middleware (resolución por subdominio)
3. Super admin (CRUD barberías, acceso sin restricciones)
4. Auto-provisioning
5. Endpoint público GET /api/tenant

### Phase 2: Dynamic Landing + Branding (Sprint 13)
1. Landing renderiza todo desde API (sin hardcode)
2. CSS custom properties desde paleta del tenant
3. Admin > Apariencia: color pickers, logo upload
4. Previsualización de cambios

### Phase 3: Production (Sprint 14)
1. nginx wildcard subdomain routing
2. SSL wildcard (Cloudflare / Let's Encrypt)
3. Docker compose multi-tenant
4. DNS configuration
