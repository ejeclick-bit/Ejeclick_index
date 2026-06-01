---
name: dba-expert
description: >
  Especialista en PostgreSQL 16 para EjeClick. Diseña esquemas,
  optimiza consultas, configura migraciones con Alembic, índices,
  backups, monitoreo de performance, y patrones multi-tenant.
when_to_use: >
  base de datos, postgresql, migracion, alembic, indice, index,
  consulta lenta, backup base de datos, esquema bd, modelo sqlalchemy,
  json, jsonb, connection pool, particionamiento, cte, window function,
  explain analyze, pg_dump, rls, multi-tenant, pool_size, pool_pre_ping
---

# Skill: dba-expert

## Description

Experto en PostgreSQL 16 + SQLAlchemy 2.0 + Alembic para EjeClick. Responsable del diseño de esquemas relacionales normalizados, creación de índices compuestos para multi-tenancy, migraciones versionadas con Alembic, optimización de queries con EXPLAIN ANALYZE, backups automatizados y monitoreo de performance.

Regla de oro: **NUNCA usar SQLite en producción.** SQLite solo para tests por velocidad. Desarrollo y producción siempre PostgreSQL 16.

## Stack

| Capa | Tecnología | Versión | Notas |
|---|---|---|---|
| Base de datos | PostgreSQL | 16 Alpine | Docker: db-flow (:3004) |
| ORM | SQLAlchemy | 2.0 | DeclarativeBase, sessionmaker |
| Migraciones | Alembic | 1.13+ | Autogenerate + empty migrations |
| Conexión | psycopg2-binary | 2.9+ | Driver nativo PostgreSQL |
| Pool | SQLAlchemy built-in | QueuePool | pool_size=10, max_overflow=20 |

## Workflow

### Paso 1: Identificar el tipo de cambio

| Tipo | Acción | Herramienta |
|---|---|---|
| Nueva tabla | Crear modelo SQLAlchemy + migración | Alembic autogenerate |
| Nuevo índice | Agregar `__table_args__` o migración directa | Alembic |
| Nueva columna | Agregar Column al modelo + migración | Alembic autogenerate |
| Optimizar query | `EXPLAIN ANALYZE` + ajustar índice | psql |
| Backup | `pg_dump` programado | cron + Docker |
| Migración de datos | Script SQL + migración empty | Alembic + psql |
| JSONB query | Índice GIN + operador `@>` o `->>` | PostgreSQL native |

### Paso 2: Crear modelo SQLAlchemy

```python
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey, JSON, func
from sqlalchemy.orm import relationship
from app.database import Base

class Barbershop(Base):
    __tablename__ = "barbershops"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    slug = Column(String(50), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    palette = Column(JSON, default=lambda: {"primary": "#000", "accent": "#fff"})
    social = Column(JSON, default=lambda: {"instagram": "", "facebook": ""})
    is_active = Column(Boolean, default=True)
```

### Paso 3: Definir índices compuestos para multi-tenant

```python
class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True)
    barbershop_id = Column(Integer, ForeignKey("barbershops.id"), nullable=False, index=True)
    date = Column(String(20), nullable=False)
    time = Column(String(10), nullable=False)
    status = Column(String(20), default="pending")

    __table_args__ = (
        # Índice compuesto para buscar citas de un tenant por fecha
        Index("idx_appt_shop_date", "barbershop_id", "date"),
        # Índice compuesto para disponibilidad
        Index("idx_appt_shop_date_time", "barbershop_id", "date", "time"),
        # Índice parcial para citas activas
        Index("idx_appt_active", "barbershop_id", "date", "time",
              postgresql_where=(status.in_(["pending", "confirmed"]))),
    )
```

### Paso 4: Generar migración

```bash
cd apps/flow-flow/admin
alembic revision --autogenerate -m "add_barbershop_model"
alembic upgrade head

# Revertir si falla
alembic downgrade -1

# Migración vacía para datos
alembic revision -m "seed_default_sections"
# Editar el archivo, agregar INSERTs, luego:
alembic upgrade head
```

### Paso 5: Verificar queries con EXPLAIN ANALYZE

```sql
-- Conectar a la BD
docker compose exec db-flow psql -U flow_flow -d flow_flow

-- Ver plan de ejecución
EXPLAIN ANALYZE
SELECT * FROM appointments
WHERE barbershop_id = 1 AND date = '2026-05-29'
  AND status IN ('pending', 'confirmed');

-- Debe mostrar "Index Scan" o "Index Only Scan", NO "Seq Scan"
```

### Paso 6: JSONB queries

```sql
-- Buscar barberías con un color primario específico
SELECT slug, name FROM barbershops
WHERE palette ->> 'primary' = '#c9953c';

-- Índice GIN para acelerar búsquedas en JSONB
CREATE INDEX idx_barbershop_palette ON barbershops USING GIN (palette);
```

## Reglas estrictas

| Regla | Explicación |
|---|---|
| **PostgreSQL 16 siempre** | NUNCA SQLite en producción o desarrollo. SQLite solo para tests. |
| **`barbershop_id` en todo** | Multi-tenant: todas las tablas tienen FK a barbershops. |
| **Índice compuesto con tenant_id** | `(barbershop_id, date)` y `(barbershop_id, date, time, status)`. El tenant_id va PRIMERO. |
| **Índices parciales WHERE** | Solo indexar filas activas: `WHERE status IN ('pending', 'confirmed')` |
| **`TIMESTAMPTZ` sobre `TIMESTAMP`** | Timezone-aware, evita bugs en producción. |
| **`VARCHAR` con límite realista** | `VARCHAR(255)` solo si es necesario. Emails → 255, slugs → 50. |
| **Evitar `SELECT *`** | Especificar columnas en producción. |
| **JSONB para datos flexibles** | `palette`, `social` como JSONB, no como columnas separadas. Indexar con GIN si se filtra. |
| **`pool_pre_ping=True`** | Evita usar conexiones muertas del pool. |
| **Migraciones versionadas** | Nunca modificar tablas a mano en producción. |
| **Backup diario automático** | `pg_dump` + compresión + rotación de 7 días. |
| **`default=None` no existe en PG** | No usar `default=None` en Column, PG usa NULL implícito. |

## Esquema actual de la BD (Flow Flow Admin)

```sql
-- Conexión: postgresql://flow_flow:flow_flow@localhost:3004/flow_flow

barbershops (id, slug UNIQUE, name, tagline, palette JSONB, social JSONB, ...)
users (id, username, password_hash, role, barbershop_id FK)
services (id, name, price, icon, is_active, barbershop_id FK)
appointments (id, client_name, client_phone, client_email, service_id FK,
             date, time, status, barbershop_id FK)
schedules (id, day_of_week, is_active, open_time, close_time, barbershop_id FK)
testimonials (id, quote, author, role, is_active, barbershop_id FK)
image_sections (id, name, slug, description, barbershop_id FK)
gallery_images (id, filename, alt_text, section_id FK, barbershop_id FK)
day_overrides (id, date, is_active, open_time, close_time, reason, barbershop_id FK)
time_blocks (id, date, start_time, end_time, reason, barbershop_id FK)
```

## Índices recomendados

```sql
-- Disponibilidad: búsqueda de slots libres
CREATE INDEX idx_appt_active ON appointments (barbershop_id, date, time)
    WHERE status IN ('pending', 'confirmed');

-- Overrides de día: búsqueda por tenant + fecha
CREATE INDEX idx_overrides_shop_date ON day_overrides (barbershop_id, date);

-- Time blocks: búsqueda por tenant + fecha
CREATE INDEX idx_blocks_shop_date ON time_blocks (barbershop_id, date);

-- Servicios activos por tenant
CREATE INDEX idx_services_shop_active ON services (barbershop_id, sort_order)
    WHERE is_active = true;

-- Búsqueda de appointments por cliente
CREATE INDEX idx_appt_client ON appointments (barbershop_id, client_email, client_phone);
```

## Connection Pooling

```python
# database.py
engine = create_engine(
    DATABASE_URL,
    pool_size=10,          # Conexiones base
    max_overflow=20,       # Extra en picos de carga
    pool_pre_ping=True,    # Verifica conexión antes de usar
    pool_recycle=3600,     # Recicla conexiones cada hora
)
```

## Comandos PostgreSQL

```bash
# Acceder a la BD
docker compose exec db-flow psql -U flow_flow -d flow_flow

# Listar tablas
\dt

# Ver índices
\di

# Tamaño de tablas
SELECT relname, pg_size_pretty(pg_total_relation_size(relid))
FROM pg_stat_user_tables ORDER BY pg_total_relation_size(relid) DESC;

# EXPLAIN ANALYZE
EXPLAIN ANALYZE
SELECT * FROM appointments
WHERE barbershop_id = 1 AND date = '2026-05-29'
  AND time NOT IN (SELECT time FROM appointments WHERE barbershop_id = 1 AND date = '2026-05-29' AND status != 'cancelled');

# Backup
docker compose exec db-flow pg_dump -U flow_flow flow_flow > backup_$(date +%Y%m%d).sql

# Restore
cat backup.sql | docker compose exec -T db-flow psql -U flow_flow -d flow_flow

# Consultas lentas en ejecución
SELECT pid, now() - query_start AS duration, query, state
FROM pg_stat_activity WHERE state != 'idle' ORDER BY duration DESC;

# Índices no usados
SELECT schemaname, relname, indexrelname, idx_scan
FROM pg_stat_user_indexes WHERE idx_scan = 0 ORDER BY relname;
```

## CTE para slots disponibles

```sql
-- Query completa de disponibilidad en una sola consulta
WITH schedule_hours AS (
    SELECT generate_series(
        open_time::time, close_time::time - '30 min'::interval, '30 min'
    ) AS slot
    FROM schedules
    WHERE barbershop_id = 1 AND day_of_week = 1 AND is_active = true
),
blocked_slots AS (
    SELECT DISTINCT slot FROM schedule_hours s, time_blocks b
    WHERE b.barbershop_id = 1 AND b.date = '2026-05-30'
      AND s.slot >= b.start_time::time AND s.slot < b.end_time::time
),
booked_slots AS (
    SELECT time::time AS slot FROM appointments
    WHERE barbershop_id = 1 AND date = '2026-05-30'
      AND status IN ('pending', 'confirmed')
)
SELECT to_char(s.slot, 'HH24:MI') FROM schedule_hours s
WHERE s.slot NOT IN (SELECT slot FROM blocked_slots)
  AND s.slot NOT IN (SELECT slot FROM booked_slots)
ORDER BY s.slot;
```

## Edge Cases

| Situación | Manejo |
|---|---|
| Migración falla | `alembic downgrade -1` para revertir |
| Tabla >1M registros | Particionar por fecha + crear índices parciales |
| Query lenta sin EXPLAIN | Usar `auto_explain` module en postgresql.conf |
| Conexiones agotadas | Aumentar `pool_size` y `max_overflow` |
| Deadlock | `SELECT ... FOR UPDATE` con orden consistente |
| Backup corrompido | `pg_restore --list` antes de restore |
| JSONB query lenta | Agregar índice GIN en la columna JSONB |
| Migración de datos | Usar empty migration + raw SQL, no ORM |
| Conflictos de FK en multi-tenant | El `barbershop_id` FK NUNCA es nullable (excepto super_admin) |

## Validation / Definition of Done

- [ ] Modelo SQLAlchemy creado con tipos PostgreSQL correctos
- [ ] Migración generada y aplicada (`alembic upgrade head`)
- [ ] Índices compuestos con `barbershop_id` primero
- [ ] `EXPLAIN ANALYZE` muestra Index Scan (no Seq Scan) en queries comunes
- [ ] Backup programado y verificado
- [ ] `pool_pre_ping=True` en engine config
- [ ] Sin `VARCHAR` sin límite explícito
- [ ] Sin `TIMESTAMP` sin timezone (usa `TIMESTAMPTZ` o `DateTime(timezone=True)`)
- [ ] JSONB columns con default correcto (usar `lambda:` no `{}`)
- [ ] Conexión verificada desde backend y desde `psql`

## Related Skills

- `fastapi-expert` — modelos SQLAlchemy, schemas, endpoints
- `devops-expert` — backups automáticos, monitoreo de BD
- `security-expert` — cifrado, RLS, auditoría de datos
