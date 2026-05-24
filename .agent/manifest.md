# EjeClick — Manifesto del Proyecto

> **Léeme primero.** Este archivo es el punto de entrada para cualquier agente de IA. Define el estado actual del proyecto, la arquitectura y cómo usar los skills automáticamente.

---

## 1. Estado del Proyecto (TL;DR)

Landing page de **conversión masiva** para EjeClick (agencia de desarrollo web). Construida con estándares Silicon Valley. **~95% completo.**

| Aspecto | Estado |
|---|---|
| Frontend (React 19 + Vite 8 + Tailwind v4 + Three.js) | ✅ Completo |
| Backend (FastAPI + PostgreSQL) | ✅ Completo |
| Testing (Vitest + RTL) | ✅ 8 tests |
| Infra (Docker + CI/CD) | ✅ Completo |
| Accesibilidad WCAG | ✅ Completo |
| Monitoreo (Sentry) | ✅ Completo |
| SEO (JSON-LD, OG, meta) | ✅ Completo |
| Seguridad (CSP, headers) | ✅ Completo |

Ver backlog detallado en `context/task.md`.

---

## 2. Cómo usar los Skills (Auto-loading)

Cada skill en `skills/` tiene una sección **"When to use"** al inicio. El agente DEBE cargar el skill correspondiente automáticamente según la tarea:

| Si la tarea es... | Cargar skill |
|---|---|
| Componente React, UI, animación, 3D, Atomic Design | `react-expert` |
| Endpoint FastAPI, modelo SQLAlchemy, schema Pydantic | `fastapi-expert` |
| Base de datos, migraciones, índices, consultas SQL | `dba-expert` |
| Seguridad, CSP, CORS, rate limiting, auditoría | `security-expert` |
| Tests unitarios, integración, cobertura | `testing-expert` |
| Docker, CI/CD, deploy, nginx, SSL, monitoreo | `devops-expert` |
| SEO, CRO, conversión, Lighthouse, schemas, copy | `seo-cro-expert` |

**Regla:** Antes de comenzar cualquier tarea, el agente debe:
1. Leer `context/task.md` para conocer el estado actual
2. Leer `context/project.md` para entender las reglas de negocio
3. Cargar el skill correspondiente según la tabla de arriba
4. Si la tarea involucra múltiples áreas, cargar todos los skills relevantes

---

## 3. Arquitectura del Proyecto

```
ejeclick_index/
├── .agent/                    # Contexto para IA
│   ├── manifest.md            ← TÚ ESTÁS AQUÍ
│   ├── context/
│   │   ├── mission.md         # Visión, metodología Scrum, Atomic Design
│   │   ├── project.md         # SSOT: specs técnicas, reglas de conversión
│   │   └── task.md            # Scrum backlog con estado actual
│   └── skills/                # Skills especializados por área
│       ├── react-expert.md
│       ├── fastapi-expert.md
│       ├── dba-expert.md
│       ├── security-expert.md
│       ├── testing-expert.md
│       ├── devops-expert.md
│       └── seo-cro-expert.md
├── src/
│   ├── components/
│   │   ├── atoms/             # 5 componentes (Badge, Button, Input, Typography, OptimizedImage)
│   │   ├── molecules/         # 5 componentes (AccordionItem, FormField, GlassCard, ServiceCard, SocialLink)
│   │   ├── organisms/         # 8 componentes (Navbar, HeroSection, ServicesGrid, ProcessSection, SocialProofSection, FAQSection, ContactSection, Footer)
│   │   ├── templates/         # 1 layout (MainLayout)
│   │   ├── pages/             # 1 página (LandingPage)
│   │   └── three/             # 3 componentes 3D (Scene3D, FloatingShapes, ParticleField)
│   ├── styles/index.css       # Tailwind v4 theme + Aurora CSS
│   ├── utils/cn.ts            # clsx + tailwind-merge
│   └── test/setup.ts          # Vitest setup
├── backend/
│   └── app/                   # FastAPI + SQLAlchemy + Pydantic
│       ├── main.py
│       ├── database.py
│       ├── models.py          # Lead
│       ├── schemas.py         # LeadCreate, LeadResponse
│       └── routes.py          # POST/GET /api/v1/leads
├── docker-compose.yml         # frontend + backend + postgres
├── .github/workflows/ci.yml   # GitHub Actions
├── nginx.conf                 # CSP + reverse proxy
└── scripts/
    └── optimize-images.sh     # WebP/AVIF conversion
```

---

## 4. Stack Técnico Exacto

| Capa | Tecnología | Versión |
|---|---|---|
| UI | React | 19.2.6 |
| Lenguaje | TypeScript | 6.0.3 |
| Build | Vite | 8.0.14 |
| CSS | Tailwind | 4.3.0 |
| 3D | Three.js + R3F + Drei + Postprocessing | 0.184 + 9.6 + 10.7 + 3.0 |
| Animación | Framer Motion | 12.40 |
| Smooth Scroll | Lenis | 1.3.23 |
| Iconos | Lucide React | 1.16 |
| Backend | FastAPI + Python | 0.115 + 3.12 |
| ORM | SQLAlchemy | 2.0 |
| BD | PostgreSQL | 16 |
| Monitoreo | Sentry | latest |
| Testing | Vitest + RTL + jest-dom | 4.1 + 16 + 6.9 |
| CI/CD | GitHub Actions | N/A |
| Contenedores | Docker + Compose | latest |
| Servidor | nginx (producción) | stable-alpine |

---

## 5. Comandos Rápidos

```bash
npm run dev              # Frontend dev
npm run build            # Build producción
npm test                 # Tests
npm run lint             # ESLint
npm run typecheck        # TypeScript
npm run optimize:images  # Convertir imágenes a WebP/AVIF
cd backend && uvicorn app.main:app --reload  # Backend dev
docker compose up -d     # Stack completo
```

---

## 6. Reglas para el Agente IA

1. **Siempre** leer `context/task.md` antes de empezar — actualizarlo al terminar cada tarea
2. **Siempre** cargar el skill correspondiente (nunca trabajar sin skill)
3. **Nunca** modificar `manifest.md` directamente — es la fuente de verdad estructural
4. **Cada commit** debe incluir actualización de `task.md` si corresponde
5. **TypeScript strict** + `verbatimModuleSyntax` — nunca usar `any`, siempre `type` en imports
6. **Atomic Design** — respetar la estructura: atoms → molecules → organisms → templates → pages
7. **WCAG** — toda nueva UI debe pasar auditoría básica: roles, aria, contraste, teclado
8. **Testing** — todo nuevo componente debe tener test unitario
