# Backend Rules

Paths: apps/*/backend/**/*.py

## Stack

- FastAPI 0.115+
- Python 3.12
- SQLAlchemy 2.0
- Pydantic 2.9+
- PostgreSQL 16

## Code Quality

- Type hints on all functions
- Docstrings on public functions and models
- No wildcard imports (`from x import *`)
- Logging with standard logger, not print
- Environment variables for all config
