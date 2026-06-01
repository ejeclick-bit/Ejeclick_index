import logging
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from typing import Optional
from ..database import get_db
from ..models import Barbershop, User
from ..schemas import BarbershopResponse, BarbershopBrandingUpdate
from ..auth import get_current_user
from ..middleware import tenant_middleware

logger = logging.getLogger("admin")
router = APIRouter(prefix="/api/tenant", tags=["tenant"])


@router.get("", response_model=Optional[BarbershopResponse])
def get_tenant(request: Request, db: Session = Depends(get_db)):
    tenant_id = getattr(request.state, "barbershop_id", None)
    if not tenant_id:
        return None
    tenant = db.query(Barbershop).filter(Barbershop.id == tenant_id).first()
    if not tenant:
        return None
    return BarbershopResponse(
        id=tenant.id, slug=tenant.slug, name=tenant.name,
        tagline=tenant.tagline or "", description=tenant.description or "",
        logo_url=tenant.logo_url or "", favicon_url=tenant.favicon_url or "",
        palette=tenant.palette or {}, whatsapp=tenant.whatsapp or "",
        phone=tenant.phone or "", email=tenant.email or "",
        address=tenant.address or "", social=tenant.social or {},
        is_active=tenant.is_active,
    )


@router.put("/branding", response_model=BarbershopResponse)
def update_branding(
    data: BarbershopBrandingUpdate,
    request: Request,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    tenant_id = getattr(request.state, "barbershop_id", None)
    if not tenant_id:
        raise HTTPException(status_code=400, detail="No tenant context")

    tenant = db.query(Barbershop).filter(Barbershop.id == tenant_id).first()
    if not tenant:
        raise HTTPException(status_code=404, detail="Barbershop not found")

    update = data.model_dump(exclude_unset=True)
    for key, value in update.items():
        setattr(tenant, key, value)
    db.commit()
    db.refresh(tenant)
    logger.info("branding_updated shop=%s", tenant.slug)

    return BarbershopResponse(
        id=tenant.id, slug=tenant.slug, name=tenant.name,
        tagline=tenant.tagline or "", description=tenant.description or "",
        logo_url=tenant.logo_url or "", favicon_url=tenant.favicon_url or "",
        palette=tenant.palette or {}, whatsapp=tenant.whatsapp or "",
        phone=tenant.phone or "", email=tenant.email or "",
        address=tenant.address or "", social=tenant.social or {},
        is_active=tenant.is_active,
    )
