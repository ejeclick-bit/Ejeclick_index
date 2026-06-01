from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import ImageSection
from ..schemas import SectionResponse
from ..deps import get_tenant_id

router = APIRouter(prefix="/api/sections", tags=["sections"])


@router.get("", response_model=List[SectionResponse])
def list_sections(
    db: Session = Depends(get_db),
    tenant_id: Optional[int] = Depends(get_tenant_id),
):
    query = db.query(ImageSection)
    if tenant_id:
        query = query.filter(ImageSection.barbershop_id == tenant_id)
    return query.order_by(ImageSection.sort_order).all()
