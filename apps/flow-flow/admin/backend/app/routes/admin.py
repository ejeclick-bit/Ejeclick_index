import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Barbershop, User
from ..schemas import BarbershopResponse, BarbershopCreate
from ..auth import get_current_user, hash_password, validate_password

logger = logging.getLogger("admin")
router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/barbershops", response_model=List[BarbershopResponse])
def list_barbershops(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if user.role != "super_admin":
        raise HTTPException(status_code=403, detail="Requiere rol super_admin")
    shops = db.query(Barbershop).order_by(Barbershop.id).all()
    return [
        BarbershopResponse(
            id=s.id, slug=s.slug, name=s.name, tagline=s.tagline or "",
            description=s.description or "", logo_url=s.logo_url or "",
            favicon_url=s.favicon_url or "", palette=s.palette or {},
            whatsapp=s.whatsapp or "", phone=s.phone or "",
            email=s.email or "", address=s.address or "",
            social=s.social or {}, is_active=s.is_active,
        ) for s in shops
    ]


@router.post("/barbershops", response_model=BarbershopResponse, status_code=201)
def create_barbershop(
    data: BarbershopCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if user.role != "super_admin":
        raise HTTPException(status_code=403, detail="Requiere rol super_admin")

    if db.query(Barbershop).filter(Barbershop.slug == data.slug).first():
        raise HTTPException(status_code=409, detail="El slug ya existe")

    ok, msg = validate_password(data.admin_password)
    if not ok:
        raise HTTPException(status_code=400, detail=msg)

    if db.query(User).filter(User.username == data.admin_username).first():
        raise HTTPException(status_code=409, detail="El usuario ya existe")

    from ..main import provision_barbershop
    provision_barbershop(db, data.slug, data.name, data.tagline)

    b = db.query(Barbershop).filter(Barbershop.slug == data.slug).first()
    admin_user = User(
        username=data.admin_username,
        password_hash=hash_password(data.admin_password),
        name=data.admin_name,
        role="admin",
        barbershop_id=b.id,
    )
    db.add(admin_user)
    db.commit()
    logger.info("shop_created slug=%s admin=%s", data.slug, data.admin_username)

    return BarbershopResponse(
        id=b.id, slug=b.slug, name=b.name, tagline=b.tagline or "",
        description=b.description or "", logo_url=b.logo_url or "",
        favicon_url=b.favicon_url or "", palette=b.palette or {},
        whatsapp=b.whatsapp or "", phone=b.phone or "",
        email=b.email or "", address=b.address or "",
        social=b.social or {}, is_active=b.is_active,
    )
