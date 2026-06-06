# Scrum Backlog - EjeClick Monorepo

## SPRINT 1: Setup, Sistema de Diseño y Átomos Base
*   [x] **Story 1.1**: Setup del Proyecto (Vite + React + TS) y configuración de herramientas (ESLint).
*   [x] **Story 1.1b**: Configurar Husky + lint-staged (pre-commit hooks).
*   [x] **Story 1.1c**: Inicializar repositorio git.
*   [x] **Story 1.2**: Definición del Design System (Tailwind v4 tokens, colores, tipografía).
*   [x] **Story 1.3**: Estructuración de directorios Atomic Design.
*   [x] **Story 1.4**: Implementación del Aurora Background CSS.
*   [x] **Story 1.5**: Construcción de Átomos UI (Button, Badge, Input, Typography).

## SPRINT 2: Moléculas, 3D Core y Organismos
*   [x] **Story 2.1**: Construcción de Moléculas (GlassCard, FormField, AccordionItem, SocialLink, ServiceCard).
*   [x] **Story 2.2**: Construcción del Entorno 3D Core (Scene3D, FloatingShapes, Particles + Bloom).
*   [x] **Story 2.3**: Organismo: Hero Section (3D + Aurora + textos + CTAs).
*   [x] **Story 2.4**: Organismos: Navbar y Mobile Menu (Glassmorphism).
*   [x] **Story 2.5**: Organismo: Services Bento Grid.

## SPRINT 3: Templates, Pages e Integración de Flujos
*   [x] **Story 3.1**: Organismos Restantes: Process, Social Proof, FAQ, Contact, Footer.
*   [x] **Story 3.2**: Creación de Templates y Pages (MainLayout + LandingPage).
*   [x] **Story 3.3**: Integración de animaciones Framer Motion por scroll.
*   [x] **Story 3.4**: Formulario de contacto conectado a backend POST `/api/v1/leads`.

## SPRINT 4: Polish, Performance y SEO
*   [x] **Story 4.1**: Integración de Lenis (Smooth Scroll premium).
*   [x] **Story 4.2**: Configurar Vitest + 8 tests unitarios (Button, Typography).
*   [x] **Story 4.2b**: Auditoría WCAG: skip-link, roles ARIA, aria-controls, tabla semántica, reduced-motion.
*   [x] **Story 4.3**: Fallback 3D para mobile (deshabilitar Three.js en <768px).
*   [x] **Story 4.3b**: Code splitting (vendor chunks) + lazy loading de Scene3D.
*   [x] **Story 4.4**: JSON-LD schemas (Organization, LocalBusiness, FAQPage).
*   [x] **Story 4.4b**: FAQPage schema injectado dinámicamente en FAQSection.

## SPRINT 5: Infraestructura y Despliegue
*   [x] **Story 5.1**: Dockerfile + docker-compose (frontend nginx + backend FastAPI + PostgreSQL).
*   [x] **Story 5.2**: Backend FastAPI completo (modelos, schemas, endpoints CRUD, database).
*   [x] **Story 5.3**: GitHub Actions CI (lint + typecheck + test + build).
*   [x] **Story 5.4**: Sentry frontend + logging estructurado backend.
*   [x] **Story 5.5**: CSP headers y seguridad de producción (nginx.conf).
*   [x] **Story 5.6**: Componente OptimizedImage + script de conversión WebP/AVIF.

## SPRINT 6: Skills y Documentación para IA
*   [x] **Story 6.1**: Crear `.agent/manifest.md` como entry point para cualquier IA.
*   [x] **Story 6.2**: Crear skills con auto-loading: react-expert, fastapi-expert, dba-expert, security-expert, testing-expert, devops-expert, seo-cro-expert.

## SPRINT 7: Agent Autonomy Infrastructure (Industry Standard)
*   [x] **Story 7.1**: Crear `CLAUDE.md` (Anthropic standard) — universal AI agent entry point en raíz del repositorio.
*   [x] **Story 7.2**: Crear `.agent/AGENTS.md` — protocolo de ejecución autónoma con agent loop, validation gate, self-correction (3 retries), y estándares de comunicación.
*   [x] **Story 7.3**: Definir Human-in-the-Loop boundaries en AGENTS.md — lista explícita de acciones que requieren aprobación humana vs. autonomía total.
*   [x] **Story 7.4**: Crear `.agent/context/decisions/` — sistema de Architecture Decision Records (ADR) con formato estándar.
*   [x] **Story 7.5**: Documentar ADR-001 (Lazy Load Three.js) y ADR-002 (Rate Limiting Leads) como decisiones arquitectónicas existentes.
*   [x] **Story 7.6**: Actualizar `.agent/README.md` — integrar AGENTS.md y decisions/ en el flujo del agente (diagrama Mermaid actualizado).

## SPRINT 7.5: Transactional Email Notifications
*   [x] **Story 7.5.1**: Integrar fastapi-mail y plantillas HTML para alertas.
*   [x] **Story 7.5.2**: Implementar FastAPI BackgroundTasks para no bloquear el HTTP Response.
*   [x] **Story 7.5.3**: Configurar credenciales SMTP vía .env y docker-compose `env_file`.

## SPRINT 8: Anthropic Monorepo Migration (Orchestrator-Workers)
*   [x] **Story 8.1**: Registrar ADR-004 (Monorepo Architecture).
*   [x] **Story 8.2**: Crear estructura de carpetas (apps/, packages/).
*   [x] **Story 8.3**: Configurar `package.json` raíz con npm workspaces.
*   [x] **Story 8.4**: Migrar código frontend actual a `apps/landing-ejeclick/`.
*   [x] **Story 8.5**: Refactorizar `docker-compose.yml` y Dockerfile para soportar el contexto del Monorepo.
*   [x] **Story 8.6**: Distribuir `CLAUDE.md` de manera jerárquica (Root = Orchestrator, apps/ = Workers).

## SPRINT 9: Flow Flow — Barbería Ecosystem
*   [x] **Story 9.1**: Crear landing Flow Flow pública (Hero, Servicios, Galería, Testimonios, Contacto).
*   [x] **Story 9.2**: Crear admin panel Flow Flow (login, dashboard, servicios CRUD, citas, horarios, galería).
*   [x] **Story 9.3**: Migrar admin de SQLite a PostgreSQL.
*   [x] **Story 9.4**: HashRouter + BackTrap para navegación mobile sin salir de la app.
*   [x] **Story 9.5**: Empaquetar landing + admin bajo `apps/flow-flow/`.

## SPRINT 10: Agent Protocol Fix
*   [x] **Story 10.1**: Mover agent loop al inicio de CLAUDE.md como instrucción obligatoria.
*   [x] **Story 10.2**: Remover YAML frontmatter de AGENTS.md (no aporta valor al agente).
*   [x] **Story 10.3**: Documentar ADR-006 (Agent Loop como primera instrucción).
*   [x] **Story 10.4**: Auditoría de seguridad y calidad del admin panel (CORS, logging, rate limiting, validación upload, tests backend).
*   [x] **Story 10.5**: Integración completa admin ↔ landing: servicios, galería y testimonios desde API.
*   [x] **Story 10.6**: Agregar gestión de testimonios en admin panel (CRUD + ruta).
*   [x] **Story 10.7**: Categorías de imágenes en galería (hero, services, gallery) con selector en admin y filtro en landing.
*   [x] **Story 10.8**: Booking widget en landing (calendario + horarios + email confirmación + conflict check).
*   [x] **Story 10.9**: Sistema de disponibilidad dinámica (DayOverrides + TimeBlocks + calendario admin).
*   [x] **Story 10.10**: Slots cada 30 minutos + endpoint cancelación de citas (1h límite) + formulario cancelar en landing.

## SPRINT 11: Skill Frontmatter Standardization
*   [x] **Story 11.1**: Migrar frontmatter de 9 skills al estándar oficial de Anthropic (remover `version`, `triggers`, `related_skills`; agregar `when_to_use`).
*   [x] **Story 11.2**: Documentar ADR-007 (Skill Frontmatter Standardization).

## SPRINT 12: Multi-Tenant SaaS Platform
*   [x] **Story 12.1**: Crear modelo `Barbershop` con slug, name, tagline, logo, palette JSON, social JSON, contact.
*   [x] **Story 12.2**: Agregar `barbershop_id` FK a todas las tablas existentes (services, appointments, schedules, testimonials, gallery_images, day_overrides, time_blocks, users).
*   [x] **Story 12.3**: Crear middleware de resolución de tenant (subdominio + X-Tenant-Slug header + default).
*   [x] **Story 12.4**: Crear dependency `get_tenant_id()` para FastAPI (deps.py).
*   [x] **Story 12.5**: Crear rol `super_admin` (barbershop_id=null) con seed data.
*   [x] **Story 12.6**: Endpoint público `GET /api/tenant` — devuelve nombre, tagline, logo, palette.
*   [x] **Story 12.7**: Endpoint admin `PUT /api/tenant/branding` — guarda paleta, logo, datos.
*   [x] **Story 12.8**: Auto-provisioning: al crear Barbershop, schedule + sections + admin + 6 servicios base.
*   [x] **Story 12.9**: Landing 100% dinámica: nombre, tagline, logo, colores desde GET /api/tenant.
*   [x] **Story 12.10**: CSS custom properties inyectadas desde paleta del tenant (sin colores hardcodeados).
*   [x] **Story 12.11**: Admin > página "Apariencia" con color pickers + formulario de negocio + vista previa.
*   [x] **Story 12.12**: Gestión de usuarios (super admin crea admin manual, admin crea barberos).
*   [x] **Story 12.13**: Seguridad de contraseñas (validación backend + frontend, mínimo 8 chars, mayúscula, minúscula, número).
*   [x] **Story 12.14**: Documentar ADR-008 + actualizar project.md + mission.md + task.md.

## SPRINT 13: Dynamic Landing + Branding
*   [x] **Story 13.1**: Landing 100% dinámica: nombre, tagline, logo, colores y horarios desde API.
*   [x] **Story 13.2**: CSS custom properties inyectadas desde paleta del tenant (sin colores hardcodeados).
*   [ ] **Story 13.3**: Admin > página "Apariencia" con color pickers + formulario de negocio + vista previa.

## BACKLOG (Futuro)
*   [ ] Extraer `ui-components` a un package compartido.
*   [ ] Extraer `ui-components` a un package compartido.
*   [ ] SEO/CRO: Google Analytics 4, Meta Pixel, sitemap.xml, robots.txt, Message Match.
*   [ ] Pruebas A/B de titulares y CTAs.
*   [ ] Ampliar tests a todos los componentes.
