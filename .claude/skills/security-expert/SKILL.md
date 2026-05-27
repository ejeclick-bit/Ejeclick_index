---
name: security-expert
description: >
  Especialista en seguridad para EjeClick. Audita y configura Content
  Security Policy, headers HTTP, CORS, rate limiting, dependencias, y
  prepara el checklist pre-deploy de seguridad.
version: 1.0.0
triggers:
  - seguridad
  - csp
  - content security policy
  - cors
  - rate limiting
  - auditoria seguridad
  - pre-deploy
  - headers http
  - hsts
  - dependencias vulnerables
  - npm audit
related_skills:
  - devops-expert
  - fastapi-expert
  - react-expert
---

# Skill: security-expert

## Description

Experto en seguridad para EjeClick. Responsable de auditar y configurar Content Security Policy (CSP), headers HTTP, CORS, rate limiting en API, dependencias (npm audit, pip-audit), y mantener el checklist pre-deploy de seguridad. Aplica OWASP Top 10 y estándares de seguridad para startups.

## Stack auditado

| Capa | Medida actual | Estado |
|---|---|---|
| Frontend (nginx) | CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy | ✅ |
| Frontend (React) | rel=noopener, aria, sin dangerouslySetInnerHTML | ✅ |
| Backend (FastAPI) | CORS, Pydantic validation, logging | ✅ |
| API | Rate limiting | ❌ Pendiente |
| Dependencias | npm audit en CI | ❌ Pendiente |
| HTTPS | No configurado aún (dev local) | ❌ Pendiente |

## Workflow

### Paso 1: Auditoría rápida de seguridad

```bash
# Frontend: revisar dependencias
npm audit

# Backend: revisar dependencias
cd backend && pip-audit

# Verificar headers HTTP actuales
curl -sI http://localhost:5173 | grep -i '^content-security\|^x-frame\|^x-content'
```

### Paso 2: Configurar CSP (producción)

```nginx
# nginx.conf — CSP estricto para producción
add_header Content-Security-Policy "
    default-src 'self';
    script-src 'self' 'nonce-${NONCE}';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
    font-src 'self';
    connect-src 'self' https://api.ejeclick.com;
    frame-ancestors 'none';
    form-action 'self';
    base-uri 'self';
" always;
```

### Paso 3: Configurar headers HTTP completos

```nginx
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
add_header Cross-Origin-Opener-Policy "same-origin" always;
add_header Cross-Origin-Embedder-Policy "require-corp" always;
```

### Paso 4: Configurar CORS (backend)

```python
# backend/app/main.py — CORS por entorno
origins = {
    "development": ["http://localhost:5173", "http://localhost:5174"],
    "staging": ["https://staging.ejeclick.com"],
    "production": ["https://ejeclick.com"],
}
env = os.getenv("APP_ENV", "development")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins[env],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)
```

### Paso 5: Implementar rate limiting (backend)

```python
# pip install slowapi
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(429, _rate_limit_exceeded_handler)

@router.post("/leads")
@limiter.limit("5/minute")
def create_lead(request: Request, lead_data: LeadCreate, db: Session = Depends(get_db)):
    ...
```

### Paso 6: Verificar

```bash
# Probar CSP (debe dar verde)
curl -sI https://ejeclick.com | grep -i 'content-security-policy'

# Probar CORS
curl -s -H "Origin: https://evil.com" -H "Access-Control-Request-Method: POST" -X OPTIONS https://api.ejeclick.com/api/v1/leads -v 2>&1 | grep -i 'access-control'

# Probar rate limiting
for i in $(seq 1 10); do curl -s -o /dev/null -w "%{http_code}\n" -X POST https://api.ejeclick.com/api/v1/leads ... ; done
```

## Checklist pre-deploy (completar antes de cada deploy a producción)

### Headers HTTP
- [ ] `Content-Security-Policy` configurado sin `'unsafe-inline'` en script-src
- [ ] `Strict-Transport-Security` con `max-age=63072000; preload`
- [ ] `X-Frame-Options: DENY`
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] `Permissions-Policy` restringido

### API
- [ ] CORS whitelist solo con dominios propios
- [ ] Rate limiting implementado (5/min para POST leads)
- [ ] Input validation con Pydantic (ya implementado)
- [ ] Logging de todos los intentos de escritura

### Dependencias
- [ ] `npm audit` sin vulnerabilidades críticas
- [ ] `pip-audit` sin vulnerabilidades críticas
- [ ] Dependabot configurado en GitHub

### Infraestructura
- [ ] HTTPS habilitado (Cloudflare o Let's Encrypt)
- [ ] Sentry configurado con DSN de producción
- [ ] Backups automáticos de BD configurados
- [ ] Logs de backend rotados

## Edge Cases

| Situación | Manejo |
|---|---|
| CSP bloquea recurso legítimo | Usar `Content-Security-Policy-Report-Only` primero |
| CORS bloquea request legítimo | Verificar `allow_origins` incluye el origen exacto |
| DDoS en endpoint de leads | Rate limiting + Cloudflare WAF |
| Script inline necesario | Usar nonce en CSP (`'nonce-${NONCE}'`) |
| npm audit muestra vuln | Revisar si hay fix disponible; si no, evaluar riesgo |
| Base de datos expuesta | Firewall: solo permitir conexiones desde backend |

## Related Skills

- `devops-expert` — para nginx, HTTPS, deploy, monitoreo
- `fastapi-expert` — para CORS, rate limiting en backend
- `react-expert` — para seguridad en frontend (no dangerouslySetInnerHTML, rel=noopener)
