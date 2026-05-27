import os
import uuid
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import GalleryImage, User
from ..schemas import GalleryResponse
from ..auth import get_current_user

router = APIRouter(prefix="/api/gallery", tags=["gallery"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.get("", response_model=List[GalleryResponse])
def list_gallery(db: Session = Depends(get_db)):
    images = db.query(GalleryImage).order_by(GalleryImage.sort_order).all()
    return [
        GalleryResponse(
            id=img.id,
            filename=img.filename,
            alt_text=img.alt_text,
            url=f"/uploads/{img.filename}",
            uploaded_at=str(img.uploaded_at) if img.uploaded_at else None,
            sort_order=img.sort_order,
        )
        for img in images
    ]


@router.post("", response_model=GalleryResponse, status_code=201)
def upload_image(
    file: UploadFile = File(...),
    alt_text: str = Form(""),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    ext = os.path.splitext(file.filename or "image.jpg")[1]
    filename = f"{uuid.uuid4().hex}{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)
    content = file.file.read()
    with open(filepath, "wb") as f:
        f.write(content)
    image = GalleryImage(filename=filename, alt_text=alt_text)
    db.add(image)
    db.commit()
    db.refresh(image)
    return GalleryResponse(
        id=image.id,
        filename=image.filename,
        alt_text=image.alt_text,
        url=f"/uploads/{image.filename}",
        uploaded_at=str(image.uploaded_at) if image.uploaded_at else None,
        sort_order=image.sort_order,
    )


@router.delete("/{image_id}", status_code=204)
def delete_image(
    image_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    image = db.query(GalleryImage).filter(GalleryImage.id == image_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Imagen no encontrada")
    filepath = os.path.join(UPLOAD_DIR, image.filename)
    if os.path.exists(filepath):
        os.remove(filepath)
    db.delete(image)
    db.commit()
