---
name: fastapi-expert
description: >
  Especialista en backend FastAPI + SQLAlchemy + PostgreSQL para EjeClick.
  Crea y mantiene endpoints REST, modelos de datos, schemas Pydantic y
  migraciones con logging estructurado y seguridad.
version: 1.0.0
triggers:
  - endpoint api
  - fastapi
  - modelo sqlalchemy
  - schema pydantic
  - migracion alembic
  - base de datos backend
  - api rest
  - endpoint leads
related_skills:
  - dba-expert
  - security-expert
  - testing-expert
---

# Skill: fastapi-expert

## Description

Experto en FastAPI + Python 3.12 + SQLAlchemy 2.0 + PostgreSQL 16 para el backend de EjeClick. Responsable de mantener la API REST, modelos de datos, schemas de validación con Pydantic, logging estructurado, y seguridad de endpoints.

## Stack

| Capa | Tecnología | Versión |
|---|---|---|
| Framework | FastAPI | 0.115+ |
| Lenguaje | Python | 3.12 |
| ORM | SQLAlchemy | 2.0 |
| Validación | Pydantic | 2.9+ |
| Servidor | Uvicorn | 0.30+ |
| Migraciones | Alembic | 1.13+ |
| BD | PostgreSQL | 16 |

## Workflow

### Paso 1: Identificar el tipo de cambio

| Tipo | Archivo | Descripción |
|---|---|---|
| Nuevo endpoint | `app/routes.py` | Agregar función con decorador `@router` |
| Nuevo modelo | `app/models.py` | Clase que hereda de `Base` |
| Nuevo schema | `app/schemas.py` | Clase Pydantic `BaseModel` |
| Migración | `alembic/versions/` | `alembic revision --autogenerate` |
| Config | `app/main.py` | CORS, middleware, logging |

### Paso 2: Escribir el endpoint

```python
# app/schemas.py
from pydantic import BaseModel, EmailStr, Field

class LeadCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    email: EmailStr
    whatsapp: str = Field(..., min_length=7, max_length=50)
    business_type: str = Field(..., min_length=2, max_length=255)

class LeadResponse(BaseModel):
    id: int
    name: str
    email: str
    whatsapp: str
    business_type: str
    created_at: datetime
    model_config = {"from_attributes": True}
```

```python
# app/routes.py
import logging
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Lead
from app.schemas import LeadCreate, LeadResponse

logger = logging.getLogger("ejeclick")
router = APIRouter()

@router.post("/leads", response_model=LeadResponse, status_code=status.HTTP_201_CREATED)
def create_lead(lead_data: LeadCreate, db: Session = Depends(get_db)):
    lead = Lead(
        name=lead_data.name,
        email=lead_data.email,
        whatsapp=lead_data.whatsapp,
        business_type=lead_data.business_type,
    )
    db.add(lead)
    db.commit()
    db.refresh(lead)
    logger.info("lead_created id=%d email=%s", lead.id, lead.email)
    return lead
```

### Paso 3: Registrar en main.py

```python
# app/main.py
from app.routes import router
app.include_router(router, prefix="/api/v1")
```

### Paso 4: Verificar

```bash
cd backend
uvicorn app.main:app --reload
# Abrir http://localhost:8000/api/docs
# Probar endpoint con Swagger UI
```

## Reglas estrictas

| Regla | Explicación |
|---|---|
| Prefijo `/api/v1/` | Todos los endpoints bajo este prefijo |
| `response_model` | Siempre tipar la respuesta |
| `status_code` explícito | 201 para POST, 200 para GET |
| Logging en cada CRUD | `logger.info("operacion detalhes=%s", ...)` |
| Validación con Pydantic | Nunca validar manualmente en routes |
| `__tablename__` en plural | `leads`, `campaigns`, `users` |
| `created_at` con `func.now()` | En todos los modelos |
| `DATABASE_URL` desde env | `os.getenv("DATABASE_URL", "...")` |
| `get_db()` como generator | `SessionLocal()` con `finally: db.close()` |

## Endpoints existentes

| Método | Ruta | Descripción | Estado |
|---|---|---|---|
| POST | `/api/v1/leads` | Crear lead | ✅ |
| GET | `/api/v1/leads` | Listar leads (desc) | ✅ |

## Modelos existentes

```python
class Lead(Base):
    __tablename__ = "leads"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    whatsapp = Column(String(50), nullable=False)
    business_type = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
```

## Edge Cases

| Situación | Manejo |
|---|---|
| Email inválido | Pydantic `EmailStr` lo rechaza con 422 |
| Campo faltante | Pydantic `Field(...)` required lo rechaza |
| Base de datos caída | SQLAlchemy lanza exc → FastAPI 500 + log |
| ID duplicado | SERIAL PK previene; unique constraint si aplica |
| CORS bloqueado | Verificar `allow_origins` en main.py |
| Rate limiting | Implementar con `slowapi` si hay abuso |

## Validation / Definition of Done

- [ ] 0 errores Python: `python -m py_compile app/routes.py`
- [ ] Endpoint funciona en Swagger UI en `/api/docs`
- [ ] POST retorna 201 + body JSON correcto
- [ ] GET retorna 200 + array JSON
- [ ] Logging: mensaje descriptivo en cada operación
- [ ] CORS: orígenes correctos para el entorno
- [ ] Validación: campos incorrectos retornan 422 con mensaje claro
- [ ] Sin secrets hardcodeados (usar env vars)
- [ ] Sin imports no usados

## Related Skills

- `dba-expert` — para diseño de tablas, índices, migraciones
- `security-expert` — para CORS, rate limiting, auditoría
- `testing-expert` — para tests de integración de la API
