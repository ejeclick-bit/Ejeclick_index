import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import Testimonial, User
from ..schemas import TestimonialCreate, TestimonialUpdate, TestimonialResponse
from ..auth import get_current_user
from ..deps import get_tenant_id

logger = logging.getLogger("admin")
router = APIRouter(prefix="/api/testimonials", tags=["testimonials"])


@router.get("", response_model=List[TestimonialResponse])
def list_testimonials(
    include_inactive: bool = False,
    db: Session = Depends(get_db),
    tenant_id: Optional[int] = Depends(get_tenant_id),
):
    query = db.query(Testimonial)
    if tenant_id:
        query = query.filter(Testimonial.barbershop_id == tenant_id)
    if not include_inactive:
        query = query.filter(Testimonial.is_active == True)
    return query.order_by(Testimonial.sort_order).all()


@router.post("", response_model=TestimonialResponse, status_code=201)
def create_testimonial(
    data: TestimonialCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
    tenant_id: Optional[int] = Depends(get_tenant_id),
):
    t = Testimonial(**data.model_dump(), barbershop_id=tenant_id)
    db.add(t)
    db.commit()
    db.refresh(t)
    logger.info("testimonial_created id=%d author=%s", t.id, t.author)
    return t


@router.put("/{testimonial_id}", response_model=TestimonialResponse)
def update_testimonial(
    testimonial_id: int,
    data: TestimonialUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
    tenant_id: Optional[int] = Depends(get_tenant_id),
):
    query = db.query(Testimonial).filter(Testimonial.id == testimonial_id)
    if tenant_id:
        query = query.filter(Testimonial.barbershop_id == tenant_id)
    t = query.first()
    if not t:
        raise HTTPException(status_code=404, detail="Testimonio no encontrado")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(t, key, value)
    db.commit()
    db.refresh(t)
    return t


@router.delete("/{testimonial_id}", status_code=204)
def delete_testimonial(
    testimonial_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
    tenant_id: Optional[int] = Depends(get_tenant_id),
):
    query = db.query(Testimonial).filter(Testimonial.id == testimonial_id)
    if tenant_id:
        query = query.filter(Testimonial.barbershop_id == tenant_id)
    t = query.first()
    if not t:
        raise HTTPException(status_code=404, detail="Testimonio no encontrado")
    db.delete(t)
    db.commit()
