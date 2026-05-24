# Skill: Experto en FastAPI — EjeClick Backend

## Stack específico del proyecto
- **FastAPI 0.115+** con Python 3.12
- **SQLAlchemy 2.0** como ORM asíncrono
- **PostgreSQL 16** como base de datos
- **Pydantic v2** para validación de schemas
- **Alembic** para migraciones
- **Uvicorn** como servidor ASGI
- Dockerizado: `backend/Dockerfile` + `docker-compose.yml`

## Estructura actual
```
backend/
├── requirements.txt
├── Dockerfile
└── app/
    ├── __init__.py
    ├── main.py          # FastAPI app + CORS + logging middleware
    ├── database.py      # SQLAlchemy engine + session + Base
    ├── models.py        # Modelos SQLAlchemy
    ├── schemas.py       # Pydantic schemas
    └── routes.py        # APIRouter con endpoints
```

## Modelos existentes

### Lead
```python
class Lead(Base):
    __tablename__ = "leads"
    id: int            # PK autoincrement
    name: str          # VARCHAR(255), NOT NULL
    email: str         # VARCHAR(255), NOT NULL
    whatsapp: str      # VARCHAR(50), NOT NULL
    business_type: str # VARCHAR(255), NOT NULL
    created_at: datetime  # server_default=func.now()
```

## Endpoints existentes

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/v1/leads` | Crear lead (201) |
| GET | `/api/v1/leads` | Listar leads (orden descendente por fecha) |

## Schemas Pydantic

```python
class LeadCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    email: EmailStr
    whatsapp: str = Field(..., min_length=7, max_length=50)
    business_type: str = Field(..., min_length=2, max_length=255)

class LeadResponse(BaseModel):
    id: int
    name, email, whatsapp, business_type: str
    model_config = {"from_attributes": True}
```

## Reglas estrictas

### Nuevos endpoints
- Prefijo siempre `/api/v1/`
- Usar `response_model` para tipado de respuesta
- Códigos HTTP explícitos con `status_code`
- Logging estructurado con `logger.info()` en cada operación CRUD
- Validación con Pydantic (nunca validar manualmente en routes)

### Nuevos modelos
- Heredar de `app.database.Base`
- `__tablename__` en plural y snake_case
- `created_at` con `server_default=func.now()` en todos los modelos
- `updated_at` con `onupdate=func.now()` si aplica

### Database
- `SessionLocal` con `autocommit=False`
- `get_db()` como generator para dependencia FastAPI
- Usar `db.commit()` + `db.refresh()` después de cada creación
- `DATABASE_URL` desde variable de entorno (nunca hardcodeada)

### Seguridad
- CORS configurado en `main.py` (agregar orígenes según entorno)
- Input sanitization vía Pydantic
- No exponer IDs secuenciales si hay riesgo de enumeración (usar UUID)
- Logging de todas las operaciones de escritura

## Comandos
```bash
# Local dev
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

# Con Docker
docker compose up -d

# Documentación interactiva
open http://localhost:8000/api/docs
```
