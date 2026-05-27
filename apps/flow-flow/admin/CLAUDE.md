# Barbería Flow Flow — Admin Panel

Parent: `apps/flow-flow/` — see CLAUDE.md there for orchestration commands.

See root CLAUDE.md for shared rules, skills, context references, and protocol.

## Stack

- **Frontend:** React 19 + Vite 8 + Tailwind v4 + React Router v7
- **Backend:** FastAPI + SQLAlchemy + SQLite + JWT auth
- **Port:** Frontend :3003, Backend :8001

## Credenciales por defecto

| Usuario | Contraseña | Rol |
|---|---|---|
| admin | admin123 | Administrador |
| barber1 | barber123 | Barbero |

## Commands

```bash
# Frontend + Backend (dos terminales)
npm run dev                   # Frontend :3003
npm run dev:admin:backend     # Backend :8001

# O desde raiz del monorepo
npm run dev:admin             # Frontend :3003
```

## Estructura

```
backend/app/
  main.py         # App + seed data
  database.py     # SQLAlchemy + SQLite
  models.py       # User, Service, Appointment, Schedule, GalleryImage
  schemas.py      # Pydantic
  auth.py         # JWT
  routes/         # auth, services, appointments, schedule, gallery, dashboard
src/
  components/pages/  # Login, Dashboard, Services, Appointments, Schedule, Gallery
  components/templates/  # AdminLayout (sidebar + header)
  lib/              # api.ts (cliente HTTP) + auth.tsx (context)
  styles/           # globals.css
```

## API Endpoints

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | /api/auth/login | No | Login |
| GET | /api/auth/me | Sí | Perfil actual |
| GET | /api/dashboard | Sí | Estadísticas |
| GET/POST | /api/services | Sí* | CRUD servicios |
| PUT/DELETE | /api/services/:id | Sí | CRUD servicios |
| GET/POST | /api/appointments | No* | CRUD citas |
| PUT/DELETE | /api/appointments/:id | Sí | CRUD citas |
| GET/PUT | /api/schedule/:id | Sí | Horarios |
| GET/POST | /api/gallery | Sí | Galería |
| DELETE | /api/gallery/:id | Sí | Galería |

*POST /api/appointments NO requiere auth (para que clientes agenden desde la landing)
