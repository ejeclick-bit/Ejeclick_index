#!/usr/bin/env bash
set -euo pipefail

BACKUP_DIR="/backups"
DB_HOST="${DB_HOST:-db}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-ejeclick}"
DB_USER="${DB_USER:-ejeclick}"
DB_PASS="${DB_PASS:-ejeclick}"
RETENTION_DAYS="${RETENTION_DAYS:-7}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
FILENAME="${BACKUP_DIR}/${DB_NAME}_${TIMESTAMP}.sql.gz"
S3_BUCKET="${S3_BUCKET:-}"

mkdir -p "$BACKUP_DIR"

echo "→ Backing up $DB_NAME..."
PGPASSWORD="$DB_PASS" pg_dump \
  -h "$DB_HOST" \
  -p "$DB_PORT" \
  -U "$DB_USER" \
  -d "$DB_NAME" \
  --no-owner \
  --no-acl \
  | gzip > "$FILENAME"

echo "→ Backup created: $FILENAME ($(du -h "$FILENAME" | cut -f1))"

# Optional: upload to S3-compatible storage
if [ -n "$S3_BUCKET" ]; then
  echo "→ Uploading to S3..."
  aws s3 cp "$FILENAME" "s3://${S3_BUCKET}/backups/"
fi

# Cleanup old backups
find "$BACKUP_DIR" -name "${DB_NAME}_*.sql.gz" -mtime +"$RETENTION_DAYS" -delete
echo "→ Cleaned up backups older than $RETENTION_DAYS days"
echo "✓ Done"
