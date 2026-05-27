from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Schedule, User
from ..schemas import ScheduleCreate, ScheduleResponse
from ..auth import get_current_user

router = APIRouter(prefix="/api/schedule", tags=["schedule"])


@router.get("", response_model=List[ScheduleResponse])
def get_schedule(db: Session = Depends(get_db)):
    return db.query(Schedule).order_by(Schedule.day_of_week).all()


@router.put("/{day_id}", response_model=ScheduleResponse)
def update_schedule(
    day_id: int,
    data: ScheduleCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    schedule = db.query(Schedule).filter(Schedule.id == day_id).first()
    if not schedule:
        schedule = Schedule(id=day_id, **data.model_dump())
        db.add(schedule)
    else:
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(schedule, key, value)
    db.commit()
    db.refresh(schedule)
    return schedule
