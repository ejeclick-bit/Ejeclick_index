# Security

Paths: apps/*/nginx.conf, apps/*/backend/**/*.py

## HTTP Headers (nginx)

- `Content-Security-Policy` — restrict sources, use nonces for inline scripts
- `Strict-Transport-Security` — `max-age=63072000; preload`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`

## Backend

- CORS whitelist — only own domains per environment
- Rate limiting — 5/min for POST `/api/v1/leads`
- Pydantic validation on all inputs
- Log all write attempts with IP

## Never

- Commit secrets, API keys, or credentials
- Log sensitive user data
- Disable CORS, CSP, or rate limiting
