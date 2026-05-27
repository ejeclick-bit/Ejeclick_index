---
name: dba-expert
description: >
  Especialista en base de datos PostgreSQL para EjeClick. Diseña esquemas,
  optimiza consultas, configura migraciones con Alembic, índices, backups
  y monitoreo de performance.
version: 1.0.0
triggers:
  - base de datos
  - postgresql
  - migracion
  - alembic
  - indice / index
  - consulta lenta
  - backup base de datos
  - esquema bd
  - modelo sqlalchemy
related_skills:
  - fastapi-expert
  - devops-expert
  - security-expert
---

# Skill: dba-expert

## Description

Experto en PostgreSQL 16 para EjeClick. Responsable del diseño de esquemas, creación de índices, migraciones con Alembic, optimización de consultas, backups, y monitoreo de performance de la base de datos.

## Stack

| Capa | Tecnología | Versión |
|---|---|---|
| Base de datos | PostgreSQL | 16 Alpine |
| ORM | SQLAlchemy | 2.0 |
| Migraciones | Alembic | 1.13+ |
| Conexión | psycopg2-binary | 2.9+ |
| Host (dev) | localhost:5432 | Docker |
| Host (prod) | db:5432 | Docker compose |

## Workflow

### Paso 1: Identificar el cambio requerido

| Tipo | Acción | Herramienta |
|---|---|---|
| Nueva tabla | Crear modelo SQLAlchemy + migración | Alembic autogenerate |
| Nuevo índice | Agregar `__table_args__` o migración directa | Alembic |
| Optimizar query | `EXPLAIN ANALYZE` + ajustar índice | psql |
| Backup | `pg_dump` programado | cron + Docker |
| Migración de datos | Script SQL + verificación | Alembic + psql |

### Paso 2: Crear modelo SQLAlchemy

```python
# backend/app/models.py
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Numeric, func
from app.database import Base

class Campaign(Base):
    __tablename__ = "campaigns"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    type = Column(String(50), nullable=False)  # seo | ads | social
    status = Column(String(20), default="active")
    client_id = Column(Integer, ForeignKey("leads.id"), nullable=True)
    budget = Column(Numeric(10, 2), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
```

### Paso 3: Generar migración

```bash
cd backend
alembic init alembic                     # Solo la primera vez
alembic revision --autogenerate -m "add_campaigns_table"
alembic upgrade head
```

### Paso 4: Verificar índices

```sql
EXPLAIN ANALYZE SELECT * FROM leads WHERE email = 'test@example.com';
-- Si hay Seq Scan, agregar índice:
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
```

## Reglas estrictas

| Regla | Explicación |
|---|---|
| **Siempre** índice en columnas de WHERE/JOIN/ORDER BY | `EXPLAIN ANALYZE` antes y después |
| `TIMESTAMPTZ` sobre `TIMESTAMP` | Timezone-aware, evita bugs en producción |
| `VARCHAR` con límite realista | `VARCHAR(255)` solo si es necesario |
| Evitar `SELECT *` | Especificar columnas en producción |
| Particionar si >1M registros | Por mes o trimestre en `created_at` |
| Migraciones versionadas | Nunca modificar tablas a mano en producción |
| Backup diario automático | `pg_dump` + compresión + rotación |

## Configuración actual de la BD

```sql
-- Conexión: postgresql://ejeclick:ejeclick@db:5432/ejeclick

CREATE TABLE leads (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    email       VARCHAR(255) NOT NULL,
    whatsapp    VARCHAR(50) NOT NULL,
    business_type VARCHAR(255) NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_email ON leads(email);
```

## Comandos

```bash
# Acceder a la BD
docker compose exec db psql -U ejeclick -d ejeclick

# Listar tablas
\dt

# Ver índices
\di

# EXPLAIN ANALYZE
EXPLAIN ANALYZE SELECT email FROM leads WHERE created_at > NOW() - INTERVAL '7 days';

# Backup
docker compose exec db pg_dump -U ejeclick ejeclick > backup_$(date +%Y%m%d).sql

# Restore
cat backup.sql | docker compose exec -T db psql -U ejeclick -d ejeclick

# Ver consultas lentas en ejecución
SELECT pid, now() - pg_stat_activity.query_start AS duration, query, state
FROM pg_stat_activity
WHERE state != 'idle' ORDER BY duration DESC;
```

## Edge Cases

| Situación | Manejo |
|---|---|
| Migración falla | `alembic downgrade -1` para revertir |
| Tabla muy grande (>1M) | Particionar por fecha, crear índices parciales |
| Query lenta sin EXPLAIN | Usar `auto_explain` module en postgresql.conf |
| Conexiones agotadas | Aumentar `pool_size` en SQLAlchemy |
| Deadlock | Usar `SELECT ... FOR UPDATE` con orden consistente |
| Backup corrompido | Verificar con `pg_restore --list` antes de restore |

## Validation / Definition of Done

- [ ] Modelo SQLAlchemy creado con tipos correctos
- [ ] Migración generada y aplicada (`alembic upgrade head`)
- [ ] Índices creados para columnas de filtro/ordenamiento
- [ ] `EXPLAIN ANALYZE` muestra Index Scan (no Seq Scan)
- [ ] Backup programado y verificado
- [ ] Sin `VARCHAR` sin límite
- [ ] Sin `TIMESTAMP` sin timezone
- [ ] Conexión funciona desde backend y desde psql

## Related Skills

- `fastapi-expert` — para modelos SQLAlchemy, schemas, endpoints
- `devops-expert` — para backups automáticos, monitoreo de BD
- `security-expert` — para cifrado, auditoría de datos sensibles
