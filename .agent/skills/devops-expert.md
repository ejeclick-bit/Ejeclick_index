# Skill: Experto en DevOps/Infra — EjeClick

## When to use
- Configurar o modificar Docker, docker-compose, Dockerfile
- CI/CD: GitHub Actions, pipelines, deploy automático
- Servidor web: nginx, proxy reverso, SSL, HTTPS
- Monitoreo de infra: health checks, logs, uptime
- Entornos: development, staging, producción
- Base de datos: backups, migraciones, conexiones

## Stack específico del proyecto
- **Docker 24+** con docker compose v2
- **nginx stable-alpine** como servidor de producción frontend
- **GitHub Actions** para CI (lint + typecheck + test + build)
- **PostgreSQL 16 Alpine** como base de datos
- **Uvicorn** como servidor ASGI del backend
- Imagen base frontend: `node:22-alpine` (builder) → `nginx:stable-alpine` (runner)

## Configuración actual

### Docker compose (`docker-compose.yml`)
```yaml
services:
  frontend:  # nginx:80, depende de backend
  backend:   # uvicorn:8000, depende de db
  db:        # postgres:16-alpine:5432, volumen pgdata
```

### Frontend Dockerfile (multi-stage)
```dockerfile
FROM node:22-alpine AS builder  # npm ci + npm run build
FROM nginx:stable-alpine        # copia dist/ a /usr/share/nginx/html
```

### nginx.conf
```nginx
# Proxy reverso /api/ → backend:8000
# Cache de assets estáticos (1 año, immutable)
# CSP headers + X-Frame-Options + X-Content-Type-Options
```

### CI/CD (`.github/workflows/ci.yml`)
```yaml
on: push/PR a main
jobs:
  quality:
    steps: checkout → node 22 → npm ci → lint → typecheck → test → build
```

## Reglas estrictas

### Docker
- Usar multi-stage builds (nunca imágenes monstruosas)
- `node:22-alpine` para build, `nginx:stable-alpine` para runtime
- `python:3.12-slim` para backend (nunca `:latest`)
- Versiones explícitas en tags (nunca `:latest`)
- Health checks en servicios dependientes (db → backend → frontend)
- Volúmenes nombrados para datos persistentes (pgdata)

### nginx
```nginx
# Servir SPA: todas las rutas → index.html
location / {
    try_files $uri $uri/ /index.html;
}

# API reverse proxy
location /api/ {
    proxy_pass http://backend:8000;
    proxy_set_header Host $host;
}

# Cache estático
location ~* \.(js|css|png|webp|avif)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# Seguridad
add_header Content-Security-Policy "...";
add_header X-Frame-Options "DENY";
add_header X-Content-Type-Options "nosniff";
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
```

### CI/CD
- Siempre correr lint, typecheck, test, build en cada push
- No hacer deploy si alguna etapa falla
- Cache de `node_modules` con `actions/setup-node` + `cache: npm`
- Secrets: `VITE_SENTRY_DSN`, `DATABASE_URL`, etc. en GitHub Secrets

### Producción
- SSL: Cloudflare (edge) o Certbot (Let's Encrypt)
- Dominio: `ejeclick.com` (configurar en Cloudflare o DNS)
- Backup diario de PostgreSQL: `pg_dump` + cron
- Logs: Docker logs + Sentry (frontend) + logging estructurado (backend)
- Deploy: GitHub Actions con SSH + docker compose pull && up -d

## Comandos
```bash
# Stack completo
docker compose up -d
docker compose down
docker compose logs -f

# Backup BD
docker compose exec db pg_dump -U ejeclick ejeclick > backup.sql

# Ver logs de un servicio
docker compose logs -f backend

# Rebuild sin cache
docker compose build --no-cache

# Producción (con archivo de override)
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```
