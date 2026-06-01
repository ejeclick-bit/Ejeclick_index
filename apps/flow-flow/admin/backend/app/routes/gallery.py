import os
import uuid
import logging
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import GalleryImage, ImageSection, User
from ..schemas import GalleryResponse
from ..auth import get_current_user
from ..deps import get_tenant_id

logger = logging.getLogger("admin")
router = APIRouter(prefix="/api/gallery", tags=["gallery"])

UPLOAD_DIR = "uploads"
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".avif"}
MAX_FILE_SIZE = 5 * 1024 * 1024

os.makedirs(UPLOAD_DIR, exist_ok=True)


def _enrich(img: GalleryImage) -> GalleryResponse:
    return GalleryResponse(
        id=img.id, filename=img.filename, alt_text=img.alt_text or "",
        section_id=img.section_id, section_slug=img.section.slug if img.section else "",
        section_name=img.section.name if img.section else "",
        url=f"/uploads/{img.filename}",
        uploaded_at=str(img.uploaded_at) if img.uploaded_at else None,
        sort_order=img.sort_order or 0,
    )


@router.get("", response_model=List[GalleryResponse])
def list_gallery(
    section_slug: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    tenant_id: Optional[int] = Depends(get_tenant_id),
):
    query = db.query(GalleryImage)
    if tenant_id:
        query = query.filter(GalleryImage.barbershop_id == tenant_id)
    if section_slug:
        section = db.query(ImageSection).filter(
            ImageSection.slug == section_slug,
            ImageSection.barbershop_id == tenant_id,
        ).first()
        if section:
            query = query.filter(GalleryImage.section_id == section.id)
        else:
            return []
    images = query.order_by(GalleryImage.sort_order).all()
    return [_enrich(img) for img in images]


@router.post("", response_model=GalleryResponse, status_code=201)
def upload_image(
    file: UploadFile = File(...),
    alt_text: str = Form(""),
    section_slug: str = Form("gallery"),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
    tenant_id: Optional[int] = Depends(get_tenant_id),
):
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"Extension no permitida: {ext}")

    content = file.file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="Archivo muy grande. Maximo 5MB")

    section = db.query(ImageSection).filter(
        ImageSection.slug == section_slug,
        ImageSection.barbershop_id == tenant_id,
    ).first()
    if not section:
        raise HTTPException(status_code=400, detail=f"Seccion invalida: {section_slug}")

    filename = f"{uuid.uuid4().hex}{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)
    with open(filepath, "wb") as f:
        f.write(content)

    image = GalleryImage(filename=filename, alt_text=alt_text, section_id=section.id, barbershop_id=tenant_id)
    db.add(image)
    db.commit()
    db.refresh(image)
    logger.info("image_uploaded id=%s section=%s user=%s", image.id, section_slug, user.username)
    return _enrich(image)


@router.delete("/{image_id}", status_code=204)
def delete_image(
    image_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
    tenant_id: Optional[int] = Depends(get_tenant_id),
):
    query = db.query(GalleryImage).filter(GalleryImage.id == image_id)
    if tenant_id:
        query = query.filter(GalleryImage.barbershop_id == tenant_id)
    image = query.first()
    if not image:
        raise HTTPException(status_code=404, detail="Imagen no encontrada")
    filepath = os.path.join(UPLOAD_DIR, image.filename)
    if os.path.exists(filepath):
        os.remove(filepath)
    db.delete(image)
    db.commit()
    logger.info("image_deleted id=%d user=%s", image_id, user.username)
