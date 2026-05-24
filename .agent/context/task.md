# Scrum Backlog - EjeClick Landing Page

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

## SPRINT 6: Skills y Documentación para IA (NUEVO)
*   [x] **Story 6.1**: Crear `.agent/manifest.md` como entry point para cualquier IA.
*   [x] **Story 6.2**: Crear skills con auto-loading: react-expert, fastapi-expert, dba-expert, security-expert, testing-expert, devops-expert, seo-cro-expert.
*   [ ] **Futuro**: SEO/CRO: Google Analytics 4, Meta Pixel, sitemap.xml, robots.txt, Message Match.
*   [ ] **Futuro**: Pruebas A/B de titulares y CTAs.
*   [ ] **Futuro**: Ampliar tests a todos los componentes.
