# Skill: Experto DBA — EjeClick Database

## When to use
- Diseñar o modificar esquemas de base de datos
- Crear índices, migraciones (Alembic)
- Optimizar consultas lentas (EXPLAIN ANALYZE)
- Configurar backups, monitoreo de performance
- Migrar datos o modelos (particionamiento, nuevos campos)

## Stack específico del proyecto
- **PostgreSQL 16** (Alpine, dockerizada)
- **SQLAlchemy 2.0** como ORM
- **Alembic** para migraciones (no configurado aún — instalar al agregar schema)
- Host: `db`, Puerto: `5432`, DB: `ejeclick`, User/Pass: `ejeclick/ejeclick`

## Modelo actual

```sql
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

## Reglas estrictas

### Performance
- **Siempre** agregar índices para columnas usadas en `WHERE`, `ORDER BY`, `JOIN`
- Usar `EXPLAIN ANALYZE` antes de cualquier optimización
- Preferir `TIMESTAMPTZ` sobre `TIMESTAMP` (timezone-aware)
- `VARCHAR` con límite razonable (nunca `VARCHAR(255)` por defecto sin pensar)
- Evitar `SELECT *` en producción — especificar columnas
- Particionamiento por tiempo si `leads` supera 1M registros

### Nuevas tablas
```sql
CREATE TABLE campaigns (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(255) NOT NULL,
    type        VARCHAR(50) NOT NULL,  -- 'seo' | 'ads' | 'social'
    status      VARCHAR(20) DEFAULT 'active',
    client_id   INTEGER REFERENCES leads(id),
    budget      NUMERIC(10,2),
    started_at  TIMESTAMPTZ,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_campaigns_client ON campaigns(client_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
```

### Migraciones con Alembic
```bash
cd backend
alembic init alembic
alembic revision --autogenerate -m "description"
alembic upgrade head
```

### Seguridad de datos
- Contraseñas: `bcrypt` (nunca texto plano)
- Emails: columna única con índice único si se requiere dedup
- Datos sensibles: cifrar con `pgcrypto` si aplica
- Backup: `pg_dump -U ejeclick ejeclick > backup.sql`
- Restore: `psql -U ejeclick ejeclick < backup.sql`

### Monitoreo
- `pg_stat_user_tables` para seguimiento de tamaño y seq_scans
- `pg_stat_activity` para consultas lentas en ejecución
- Configurar `log_min_duration_statement = 200` en postgresql.conf

## Comandos
```bash
# Acceder a la BD
docker compose exec db psql -U ejeclick -d ejeclick

# Backup
docker compose exec db pg_dump -U ejeclick ejeclick > backup_$(date +%Y%m%d).sql

# Restore
cat backup.sql | docker compose exec -T db psql -U ejeclick -d ejeclick
```
