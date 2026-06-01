from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import Schedule, User
from ..schemas import ScheduleCreate, ScheduleResponse
from ..auth import get_current_user
from ..deps import get_tenant_id

router = APIRouter(prefix="/api/schedule", tags=["schedule"])


@router.get("", response_model=List[ScheduleResponse])
def get_schedule(
    db: Session = Depends(get_db),
    tenant_id: Optional[int] = Depends(get_tenant_id),
):
    query = db.query(Schedule)
    if tenant_id:
        query = query.filter(Schedule.barbershop_id == tenant_id)
    return query.order_by(Schedule.day_of_week).all()


@router.put("/{day_id}", response_model=ScheduleResponse)
def update_schedule(
    day_id: int,
    data: ScheduleCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
    tenant_id: Optional[int] = Depends(get_tenant_id),
):
    query = db.query(Schedule).filter(Schedule.id == day_id)
    if tenant_id:
        query = query.filter(Schedule.barbershop_id == tenant_id)
    schedule = query.first()
    if not schedule:
        schedule = Schedule(id=day_id, **data.model_dump(), barbershop_id=tenant_id)
        db.add(schedule)
    else:
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(schedule, key, value)
    db.commit()
    db.refresh(schedule)
    return schedule
