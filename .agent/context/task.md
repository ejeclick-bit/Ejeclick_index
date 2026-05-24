# Scrum Backlog - EjeClick Landing Page

## SPRINT 1: Setup, Sistema de Diseño y Átomos Base
**Sprint Goal**: Establecer la arquitectura base del proyecto, el motor de estilos (Tailwind) y los componentes fundamentales (Átomos) bajo Atomic Design.

*   [x] **Story 1.1**: Setup del Proyecto (Vite + React + TS) y configuración de herramientas (ESLint).
*   [ ] **Story 1.1b**: Configurar Husky + lint-staged + commitlint (pre-commit hooks).
*   [ ] **Story 1.1c**: Inicializar repositorio git.
*   [x] **Story 1.2**: Definición del Design System (Tailwind v4 tokens, colores, tipografía).
*   [x] **Story 1.3**: Estructuración de directorios Atomic Design (`atoms/`, `molecules/`, `organisms/`, `templates/`, `pages/`).
*   [x] **Story 1.4**: Implementación del Aurora Background CSS.
*   [x] **Story 1.5**: Construcción de Átomos UI (Button, Badge, Input, Typography, Icon wrappers).

## SPRINT 2: Moléculas, 3D Core y Organismos
**Sprint Goal**: Ensamblar los elementos interactivos complejos, incluyendo el ecosistema 3D (React Three Fiber) y las secciones principales de la landing.

*   [x] **Story 2.1**: Construcción de Moléculas (GlassCard, FormField, AccordionItem, SocialLink, ServiceCard).
*   [x] **Story 2.2**: Construcción del Entorno 3D Core (Scene3D, FloatingShapes, Particles con post-procesado Bloom).
*   [x] **Story 2.3**: Organismo: Hero Section (Integrando 3D + Aurora + Textos).
*   [x] **Story 2.4**: Organismos: Navbar y Mobile Menu (Glassmorphism).
*   [x] **Story 2.5**: Organismo: Services Bento Grid.

## SPRINT 3: Templates, Pages e Integración de Flujos
**Sprint Goal**: Armar la página completa a partir de los organismos y aplicar las animaciones de scroll y validaciones.

*   [x] **Story 3.1**: Organismos Restantes: Timeline (Process), Social Proof (Comparativa), FAQ, Contact Form, Footer.
*   [x] **Story 3.2**: Creación de Templates y Pages (MainLayout + LandingPage).
*   [x] **Story 3.3**: Integración de animaciones Framer Motion de entrada y transición entre secciones.
*   [x] **Story 3.4**: Integración de validaciones del formulario de contacto (simulado con setTimeout).
*   [ ] **Story 3.4b**: Conectar formulario a backend real (FastAPI endpoint `/api/v1/leads`).

## SPRINT 4: Polish, Performance y SEO
**Sprint Goal**: Asegurar la calidad Silicon Valley (Lighthouse >95, smooth scroll) y preparación para despliegue.

*   [x] **Story 4.1**: Integración de Lenis (Smooth Scroll premium).
*   [ ] **Story 4.2**: Configurar Vitest + React Testing Library y escribir tests unitarios.
*   [ ] **Story 4.2b**: Auditoría de accesibilidad WCAG (contraste, navegación teclado, roles ARIA).
*   [x] **Story 4.3**: Ajustes de performance 3D para mobile (fallback a CSS null).
*   [ ] **Story 4.3b**: Code splitting: separar vendor chunks (Three.js, framer-motion) con lazy loading.
*   [x] **Story 4.4**: Inserción de schemas JSON-LD (Organization, LocalBusiness).
*   [ ] **Story 4.4b**: Añadir schema FAQPage para el acordeón de preguntas frecuentes.

## SPRINT 5: Infraestructura y Despliegue (NUEVO)
**Sprint Goal**: Preparar el proyecto para despliegue enterprise con Docker, CI/CD y backend funcional.

*   [ ] **Story 5.1**: Configurar Dockerfile + docker-compose (frontend Vite + backend FastAPI + PostgreSQL).
*   [ ] **Story 5.2**: Construir backend FastAPI con endpoint `/api/v1/leads` y conexión PostgreSQL.
*   [ ] **Story 5.3**: Configurar GitHub Actions CI/CD (lint + typecheck + test + build + deploy).
*   [ ] **Story 5.4**: Añadir monitoreo y logging (Sentry para frontend, logging structured para backend).
*   [ ] **Story 5.5**: Configurar CSP headers y seguridad de producción.
*   [ ] **Story 5.6**: Optimizar imágenes (hero.png → WebP/AVIF con lazy loading nativo).
