# Skill: Experto en Seguridad — EjeClick

## Stack y configuración actual
- **Frontend**: React + Vite, servido por nginx en producción
- **Backend**: FastAPI + PostgreSQL, detrás de nginx reverse proxy
- **Infra**: Docker compose, GitHub Actions CI
- **Monitoreo**: Sentry (frontend), logging estructurado (backend)

## Configuración de seguridad actual

### nginx.conf (producción)
```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' /api/";
add_header X-Frame-Options "DENY";
add_header X-Content-Type-Options "nosniff";
add_header Referrer-Policy "strict-origin-when-cross-origin";
```

### Backend (FastAPI)
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Reglas estrictas

### 1. Content Security Policy (CSP)
- **Nunca** usar `'unsafe-inline'` en `script-src` si se puede evitar
- Para producción, generar nonce o hash para scripts inline
- Agregar `frame-ancestors 'none'` (refuerza X-Frame-Options)
- `connect-src` debe incluir la URL del backend en producción
- Auditoría con `https://csp.withgoogle.com/` o `Content-Security-Policy-Report-Only`

### 2. Headers HTTP de seguridad
```nginx
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()";
add_header Cross-Origin-Opener-Policy "same-origin";
add_header Cross-Origin-Embedder-Policy "require-corp";
add_header Cross-Origin-Resource-Policy "same-origin";
```

### 3. API Security
- Rate limiting: implementar con `slowapi` en FastAPI
- Input validation: Pydantic (ya implementado)
- No exponer IDs secuenciales (migrar a UUID para nuevas tablas)
- CORS: whitelist estricta por entorno (nunca `allow_origins=["*"]`)
- Headers: `X-Content-Type-Options: nosniff` (ya implementado)

### 4. Frontend
- `rel="noopener noreferrer"` en todos los enlaces externos (ya implementado en SocialLink)
- `target="_blank` solo con `rel="noopener"`
- No interpolación directa de HTML en React (usar JSX, no `dangerouslySetInnerHTML`)
- Sanitizar cualquier input antes de mostrarlo

### 5. Backend
```python
# Rate limiting example
from slowapi import Limiter
from slowapi.util import get_remote_address
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@router.post("/leads")
@limiter.limit("5/minute")
def create_lead(request: Request, ...):
    ...
```

### 6. Base de datos
- SQLAlchemy ORM previene SQL injection (no usar raw SQL con interpolación)
- Conexiones: pool_size=10, max_overflow=20
- Contraseñas: bcrypt si se implementa auth
- Backup cifrado para datos de leads

### 7. Dependencias
- `npm audit` y `pip-audit` en CI
- Dependabot o Renovate para actualizaciones automáticas
- Revisar vulnerabilidades conocidas de `three`, `framer-motion`, `@sentry`

### 8. Monitoreo de seguridad
- Sentry para errores frontend (no logs de seguridad)
- Revisar logs de backend regularmente
- Alertas para: múltiples intentos fallidos, patrones sospechosos en leads
- `audit.log` en backend para eventos de seguridad

## Checklist pre-deploy
- [ ] CSP configurado sin `'unsafe-inline'` en script-src
- [ ] HSTS habilitado
- [ ] CORS whitelist limitada
- [ ] Rate limiting implementado
- [ ] Dependencias auditadas
- [ ] Sentry configurado con DSN de producción
- [ ] HTTPS habilitado (certbot o Cloudflare)
- [ ] Logging de errores configurado
- [ ] Backups automáticos
