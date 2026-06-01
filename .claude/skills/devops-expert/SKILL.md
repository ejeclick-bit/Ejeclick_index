---
name: devops-expert
description: >
  Especialista en DevOps e infraestructura para EjeClick. Configura Docker,
  CI/CD con GitHub Actions, nginx, SSL, deploy a producción, backups de BD
  y monitoreo de infraestructura.
when_to_use: >
  docker, docker compose, ci/cd, github actions, nginx, ssl, https,
  deploy, produccion, backup, monitoreo infra, devops
---

# Skill: devops-expert

## Description

Experto en DevOps para EjeClick. Responsable de mantener Docker multi-stage, docker-compose para toda la stack (frontend + backend + PostgreSQL), CI/CD con GitHub Actions, configuración de nginx con seguridad y proxy reverso, SSL, deploy a producción, backups automatizados y monitoreo de infraestructura.

## Stack

| Capa | Tecnología | Versión |
|---|---|---|
| Contenedores | Docker | 24+ |
| Orquestación | Docker Compose | v2 |
| Frontend (prod) | nginx | stable-alpine |
| Backend (prod) | Uvicorn | 0.30+ |
| CI/CD | GitHub Actions | N/A |
| BD | PostgreSQL | 16 Alpine |
| SSL | Cloudflare / Let's Encrypt | N/A |

## Arquitectura actual

```
                      Cloudflare (SSL)
                            │
                       nginx:80
                      /        \
              /api/*           /*
            backend:8000    index.html (SPA)
                │
            PostgreSQL:5432
```

## Workflow

### Paso 1: Construir y verificar local

```bash
# Build sin cache
docker compose build --no-cache

# Iniciar stack
docker compose up -d

# Verificar logs
docker compose logs -f

# Verificar servicios
curl -s -o /dev/null -w "%{http_code}" http://localhost          # → 200
curl -s -o /dev/null -w "%{http_code}" http://localhost/api/docs # → 200
```

### Paso 2: CI/CD — cada push a main ejecuta

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test
      - run: npm run build
```

### Paso 3: Deploy a producción

```bash
# Opción 1: SSH + Docker (recomendado para VPS)
ssh user@server
cd /opt/ejeclick
git pull origin main
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Opción 2: GitHub Actions con SSH deploy
# Configurar secrets: SSH_HOST, SSH_USER, SSH_KEY
```

### Paso 4: Configurar SSL

```bash
# Opción Cloudflare (recomendado, más simple)
# 1. Poner dominio en Cloudflare
# 2. Configurar DNS → IP del servidor
# 3. Activar "Full (strict)" SSL/TLS

# Opción Let's Encrypt (VPS sin Cloudflare)
docker compose run --rm certbot certonly --webroot -w /var/www/html -d ejeclick.com
```

## Reglas estrictas

| Regla | Razón |
|---|---|
| Multi-stage build | Imágenes pequeñas (~50MB vs 1GB) |
| Versiones explícitas en tags | `node:22-alpine` no `node:latest` |
| Health checks en servicios dependientes | `db` → `backend` → `frontend` |
| Volúmenes nombrados para BD | `pgdata:` no anonymous volumes |
| Cache de npm en CI | `cache: npm` en setup-node |
| Secrets en GitHub Secrets | Nunca en docker-compose.yml |
| Backup diario de BD | `pg_dump` + cron + backup remoto |

## Configuraciones existentes

### docker-compose.yml
```yaml
services:
  frontend:
    build: .
    ports: ["80:80"]
    depends_on: [backend]

  backend:
    build: ./backend
    ports: ["8000:8000"]
    environment:
      - DATABASE_URL=postgresql://ejeclick:ejeclick@db:5432/ejeclick
    depends_on:
      db: { condition: service_healthy }

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: ejeclick
      POSTGRES_PASSWORD: ejeclick
      POSTGRES_DB: ejeclick
    volumes: [pgdata:/var/lib/postgresql/data]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ejeclick"]
```

### nginx.conf
```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location ~* \.(js|css|png|webp|avif)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## Comandos

```bash
# Desarrollo
docker compose up -d                    # Iniciar todo
docker compose down                     # Detener todo
docker compose logs -f backend          # Ver logs de backend
docker compose exec db psql -U ejeclick # Acceder a BD

# Mantenimiento
docker compose build --no-cache         # Rebuild sin cache
docker system prune -a                  # Limpiar imágenes no usadas
docker compose logs --tail=100 -f       # Últimas 100 líneas

# Backup BD
docker compose exec db pg_dump -U ejeclick ejeclick > backup_$(date +%Y%m%d).sql

# Producción
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Edge Cases

| Situación | Manejo |
|---|---|
| Contenedor no arranca | `docker compose logs <service>` para ver error |
| Puerto en uso | Cambiar puerto en docker-compose.yml o matar proceso |
| Base de datos corrupta | Restore desde backup + `docker compose down -v` |
| CI falla | Revisar logs en GitHub Actions > pestaña "checks" |
| SSL expirado | Cloudflare: automático; Let's Encrypt: renovar con cron |
| Disco lleno | `docker system prune -af` + rotar logs de contenedores |

## Validation / Definition of Done

- [ ] `docker compose build` exitoso (0 errores)
- [ ] `docker compose up -d` levanta todos los servicios
- [ ] `curl http://localhost` retorna 200 (frontend)
- [ ] `curl http://localhost/api/docs` retorna 200 (backend)
- [ ] `curl http://localhost/api/v1/leads` retorna 200 (API)
- [ ] CI en GitHub Actions pasa (green check)
- [ ] SSL configurado y verificable en navegador
- [ ] Backup automático configurado y probado
- [ ] Logs de errores configurados y accesibles

## Related Skills

- `security-expert` — para CSP, headers, CORS, HTTPS
- `dba-expert` — para backups, migraciones, monitoreo de BD
- `fastapi-expert` — para configuración del backend en producción
