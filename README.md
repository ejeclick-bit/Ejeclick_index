# EjeClick — Landing Page de Conversión

[![CI](https://github.com/ejeclick/ejeclick_index/actions/workflows/ci.yml/badge.svg)](https://github.com/ejeclick/ejeclick_index/actions/workflows/ci.yml)

Landing page de alta conversión para **EjeClick** — tecnología real para pequeñas empresas. Automatiza ventas y envíos, sin tecnicismos.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 19 + TypeScript 6 + Vite 8 + Tailwind v4 |
| 3D | Three.js + React Three Fiber + Postprocessing |
| Animación | Framer Motion + Lenis |
| Backend | FastAPI + Python 3.12 + SQLAlchemy 2.0 |
| Base de datos | PostgreSQL 16 |
| Infra | Docker + nginx + GitHub Actions |
| Monitoreo | Sentry (frontend) + logging estructurado (backend) |

## Requisitos

- Node.js 22+
- Docker + Docker Compose (para stack completo)
- Python 3.12 (para backend local)

## Desarrollo rápido

```bash
# Frontend
npm install
npm run dev            # http://localhost:5173

# Backend (segunda terminal)
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload  # http://localhost:8000/api/docs

# Stack completo (Docker)
docker compose up -d   # http://localhost
```

## Comandos

```bash
npm run build          # Build producción
npm test               # Tests (27 tests, 6 suites)
npm run lint           # ESLint
npm run typecheck      # TypeScript
npm run optimize:images # Convertir imágenes a WebP/AVIF
```

## Calidad

- TypeScript strict + `verbatimModuleSyntax`
- ESLint + Husky pre-commit
- WCAG AA accesibilidad (skip-link, ARIA, roles, reduced-motion)
- Code splitting (vendor chunks separados)
- Lazy loading (Three.js diferido)
- Rate limiting (10 POST/min)
- CSP + HSTS + security headers
- Docker multi-stage (~50MB imagen final)

## Estructura

```
src/
├── components/
│   ├── atoms/          # 5 componentes base
│   ├── molecules/      # 5 componentes compuestos
│   ├── organisms/      # 8 secciones completas
│   ├── templates/      # 1 layout
│   ├── pages/          # 1 página
│   └── three/          # 3 componentes 3D
backend/
└── app/                # FastAPI + SQLAlchemy + Pydantic
```

## Licencia

Privado — EjeClick © 2026
