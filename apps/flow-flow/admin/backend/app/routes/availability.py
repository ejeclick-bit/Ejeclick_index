import logging
from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import DayOverride, TimeBlock, User
from ..schemas import DayOverrideCreate, DayOverrideResponse, TimeBlockCreate, TimeBlockResponse
from ..auth import get_current_user
from ..deps import get_tenant_id

logger = logging.getLogger("admin")
router = APIRouter(prefix="/api/availability", tags=["availability"])


@router.get("/overrides", response_model=List[DayOverrideResponse])
def list_overrides(
    start_date: Optional[str] = Query(None, alias="start"),
    end_date: Optional[str] = Query(None, alias="end"),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
    tenant_id: Optional[int] = Depends(get_tenant_id),
):
    query = db.query(DayOverride)
    if tenant_id:
        query = query.filter(DayOverride.barbershop_id == tenant_id)
    if start_date:
        query = query.filter(DayOverride.date >= start_date)
    if end_date:
        query = query.filter(DayOverride.date <= end_date)
    return query.order_by(DayOverride.date).all()


@router.put("/overrides/{override_date}", response_model=DayOverrideResponse)
def save_override(
    override_date: str,
    data: DayOverrideCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
    tenant_id: Optional[int] = Depends(get_tenant_id),
):
    query = db.query(DayOverride).filter(DayOverride.date == override_date)
    if tenant_id:
        query = query.filter(DayOverride.barbershop_id == tenant_id)
    existing = query.first()
    if existing:
        existing.is_active = data.is_active
        existing.open_time = data.open_time
        existing.close_time = data.close_time
        existing.reason = data.reason
        db.commit()
        db.refresh(existing)
        return existing
    new = DayOverride(date=override_date, **data.model_dump(exclude={"date"}), barbershop_id=tenant_id)
    db.add(new)
    db.commit()
    db.refresh(new)
    logger.info("override_created date=%s active=%s", override_date, data.is_active)
    return new


@router.delete("/overrides/{override_date}", status_code=204)
def delete_override(
    override_date: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
    tenant_id: Optional[int] = Depends(get_tenant_id),
):
    query = db.query(DayOverride).filter(DayOverride.date == override_date)
    if tenant_id:
        query = query.filter(DayOverride.barbershop_id == tenant_id)
    existing = query.first()
    if existing:
        db.delete(existing)
        db.commit()


@router.get("/blocks", response_model=List[TimeBlockResponse])
def list_blocks(
    date: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
    tenant_id: Optional[int] = Depends(get_tenant_id),
):
    query = db.query(TimeBlock)
    if tenant_id:
        query = query.filter(TimeBlock.barbershop_id == tenant_id)
    if date:
        query = query.filter(TimeBlock.date == date)
    return query.order_by(TimeBlock.start_time).all()


@router.post("/blocks", response_model=TimeBlockResponse, status_code=201)
def create_block(
    data: TimeBlockCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
    tenant_id: Optional[int] = Depends(get_tenant_id),
):
    block = TimeBlock(**data.model_dump(), barbershop_id=tenant_id)
    db.add(block)
    db.commit()
    db.refresh(block)
    logger.info("time_block_created date=%s start=%s end=%s", data.date, data.start_time, data.end_time)
    return block


@router.delete("/blocks/{block_id}", status_code=204)
def delete_block(
    block_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
    tenant_id: Optional[int] = Depends(get_tenant_id),
):
    query = db.query(TimeBlock).filter(TimeBlock.id == block_id)
    if tenant_id:
        query = query.filter(TimeBlock.barbershop_id == tenant_id)
    block = query.first()
    if block:
        db.delete(block)
        db.commit()
