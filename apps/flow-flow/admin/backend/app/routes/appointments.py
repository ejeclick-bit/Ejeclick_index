from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import date
from ..database import get_db
from ..models import Appointment, User
from ..schemas import AppointmentCreate, AppointmentUpdate, AppointmentResponse
from ..auth import get_current_user

router = APIRouter(prefix="/api/appointments", tags=["appointments"])


@router.get("", response_model=List[AppointmentResponse])
def list_appointments(
    status_filter: str = "",
    date_filter: str = "",
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    query = db.query(Appointment)
    if status_filter:
        query = query.filter(Appointment.status == status_filter)
    if date_filter:
        query = query.filter(Appointment.date == date_filter)
    else:
        query = query.filter(Appointment.date >= str(date.today()))
    return query.order_by(Appointment.date, Appointment.time).all()


@router.post("", response_model=AppointmentResponse, status_code=201)
def create_appointment(
    data: AppointmentCreate,
    db: Session = Depends(get_db),
):
    appointment = Appointment(**data.model_dump())
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    return appointment


@router.put("/{appointment_id}", response_model=AppointmentResponse)
def update_appointment(
    appointment_id: int,
    data: AppointmentUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(appointment, key, value)
    db.commit()
    db.refresh(appointment)
    return appointment


@router.delete("/{appointment_id}", status_code=204)
def delete_appointment(
    appointment_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    db.delete(appointment)
    db.commit()
