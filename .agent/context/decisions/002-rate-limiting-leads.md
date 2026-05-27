# ADR-002: Rate Limiting en Endpoint de Leads

**Date:** 2026-05-24
**Status:** accepted

## Context

El endpoint `POST /api/v1/leads` es público y no requiere autenticación. Sin protección, un atacante o bot podría enviar miles de solicitudes para llenar la base de datos con spam o provocar un DDoS en la capa de base de datos.

## Decision

1. Implementar `slowapi` (wrapper de `limits`) en FastAPI con un límite de **10 solicitudes POST por minuto** por IP.
2. Configurar el limiter a nivel de route (`@limiter.limit("10/minute")`) en lugar de global, para no afectar endpoints de lectura (`GET /leads`, `GET /health`).
3. El handler de excepción devuelve HTTP 429 con un mensaje JSON claro.

## Consequences

- **Positivo:** Protección efectiva contra spam automatizado en el formulario de contacto.
- **Positivo:** Los endpoints GET no se ven afectados por el rate limiting.
- **Trade-off:** Si un usuario legítimo detrás de una NAT corporativa comparte IP con otros, podría ser limitado prematuramente. Aceptable para el volumen actual.
- **Trade-off:** En producción con nginx como reverse proxy, se debe configurar `X-Forwarded-For` para que `get_remote_address` obtenga la IP real del cliente y no la de nginx.
