import os
import uuid
import logging
from fastapi import APIRouter, Depends, HTTPException, Request, UploadFile, File
from sqlalchemy.orm import Session
from typing import Optional
from ..database import get_db
from ..models import Barbershop, User
from ..schemas import BarbershopResponse, BarbershopBrandingUpdate
from ..auth import get_current_user
from ..middleware import tenant_middleware

logger = logging.getLogger("admin")
router = APIRouter(prefix="/api/tenant", tags=["tenant"])

UPLOAD_DIR = "uploads"
ALLOWED_HERO_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
MAX_HERO_SIZE = 10 * 1024 * 1024  # 10 MB

os.makedirs(UPLOAD_DIR, exist_ok=True)


def _serialize(tenant: Barbershop) -> BarbershopResponse:
    """Serializa un objeto Barbershop a BarbershopResponse con todos los campos."""
    return BarbershopResponse(
        id=tenant.id,
        slug=tenant.slug,
        name=tenant.name,
        tagline=tenant.tagline or "",
        description=tenant.description or "",
        logo_url=tenant.logo_url or "",
        favicon_url=tenant.favicon_url or "",
        hero_image_url=tenant.hero_image_url or "",
        palette=tenant.palette or {},
        whatsapp=tenant.whatsapp or "",
        phone=tenant.phone or "",
        email=tenant.email or "",
        address=tenant.address or "",
        social=tenant.social or {},
        is_active=tenant.is_active,
    )


@router.get("", response_model=Optional[BarbershopResponse])
def get_tenant(request: Request, db: Session = Depends(get_db)):
    tenant_id = getattr(request.state, "barbershop_id", None)
    if not tenant_id:
        return None
    tenant = db.query(Barbershop).filter(Barbershop.id == tenant_id).first()
    if not tenant:
        return None
    return _serialize(tenant)


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

    return _serialize(tenant)


@router.post("/hero-image", response_model=BarbershopResponse)
def upload_hero_image(
    file: UploadFile = File(...),
    request: Request = None,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    Sube una imagen para el fondo del Hero de la landing.
    - Valida extensión y tamaño (máx 8MB)
    - Guarda el archivo en /uploads/ con nombre único
    - Guarda la ruta en barbershops.hero_image_url
    - El antiguo archivo se elimina si existía
    """
    tenant_id = getattr(request.state, "barbershop_id", None)
    if not tenant_id:
        raise HTTPException(status_code=400, detail="No tenant context")

    tenant = db.query(Barbershop).filter(Barbershop.id == tenant_id).first()
    if not tenant:
        raise HTTPException(status_code=404, detail="Barbershop not found")

    # Validar extensión
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_HERO_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Extensión no permitida: {ext}. Usa JPG, PNG o WebP.",
        )

    # Leer y validar tamaño
    content = file.file.read()
    if len(content) > MAX_HERO_SIZE:
        raise HTTPException(status_code=400, detail="Archivo muy grande. Máximo 10MB.")

    # Eliminar imagen anterior si existe
    if tenant.hero_image_url:
        old_filename = tenant.hero_image_url.lstrip("/uploads/")
        old_path = os.path.join(UPLOAD_DIR, old_filename)
        if os.path.exists(old_path):
            try:
                os.remove(old_path)
            except OSError:
                pass  # No es crítico si falla la eliminación

    # Guardar nuevo archivo con nombre único incluyendo el slug del tenant
    filename = f"hero_{tenant.slug}_{uuid.uuid4().hex}{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)
    with open(filepath, "wb") as f:
        f.write(content)

    # Actualizar BD
    tenant.hero_image_url = f"/uploads/{filename}"
    db.commit()
    db.refresh(tenant)

    logger.info(
        "hero_image_uploaded shop=%s filename=%s size=%dKB user=%s",
        tenant.slug, filename, len(content) // 1024, user.username,
    )
    return _serialize(tenant)


@router.delete("/hero-image", response_model=BarbershopResponse)
def delete_hero_image(
    request: Request,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Elimina la imagen de Hero del tenant. La landing volverá al diseño CSS."""
    tenant_id = getattr(request.state, "barbershop_id", None)
    if not tenant_id:
        raise HTTPException(status_code=400, detail="No tenant context")

    tenant = db.query(Barbershop).filter(Barbershop.id == tenant_id).first()
    if not tenant:
        raise HTTPException(status_code=404, detail="Barbershop not found")

    if tenant.hero_image_url:
        filename = tenant.hero_image_url.replace("/uploads/", "")
        filepath = os.path.join(UPLOAD_DIR, filename)
        if os.path.exists(filepath):
            try:
                os.remove(filepath)
            except OSError:
                pass
        tenant.hero_image_url = ""
        db.commit()
        db.refresh(tenant)
        logger.info("hero_image_deleted shop=%s user=%s", tenant.slug, user.username)

    return _serialize(tenant)
