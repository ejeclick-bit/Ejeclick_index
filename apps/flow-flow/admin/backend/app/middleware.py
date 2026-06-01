from fastapi import Request
from sqlalchemy.orm import Session
from .database import SessionLocal
from .models import Barbershop


async def tenant_middleware(request: Request, call_next):
    request.state.barbershop_id = None
    request.state.tenant = None

    host = request.headers.get("host", "")
    slug = None

    if host and "." in host and host != "localhost" and not host.startswith("127."):
        parts = host.split(".")
        if not parts[0].startswith("admin"):
            slug = parts[0]

    if not slug:
        slug = request.headers.get("X-Tenant-Slug")

    if not slug:
        slug = request.query_params.get("slug")

    if slug:
        db = SessionLocal()
        try:
            tenant = db.query(Barbershop).filter(
                Barbershop.slug == slug, Barbershop.is_active == True
            ).first()
            if tenant:
                request.state.barbershop_id = tenant.id
                request.state.tenant = tenant
        finally:
            db.close()

    response = await call_next(request)
    return response
