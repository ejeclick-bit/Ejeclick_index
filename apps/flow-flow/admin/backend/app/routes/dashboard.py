from datetime import date
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..models import Appointment, Service, User
from ..schemas import DashboardResponse, AppointmentResponse
from ..auth import get_current_user

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("", response_model=DashboardResponse)
def get_dashboard(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    today = str(date.today())

    today_count = db.query(func.count(Appointment.id)).filter(
        Appointment.date == today
    ).scalar() or 0

    pending_count = db.query(func.count(Appointment.id)).filter(
        Appointment.status == "pending"
    ).scalar() or 0

    service_count = db.query(func.count(Service.id)).filter(
        Service.is_active == True
    ).scalar() or 0

    client_count = db.query(func.count(func.distinct(Appointment.client_phone))).scalar() or 0

    upcoming = db.query(Appointment).filter(
        Appointment.date >= today
    ).order_by(Appointment.date, Appointment.time).limit(10).all()

    return DashboardResponse(
        today_appointments=today_count,
        total_services=service_count,
        pending_appointments=pending_count,
        total_clients=client_count,
        upcoming_appointments=[
            AppointmentResponse(
                id=a.id, client_name=a.client_name, client_phone=a.client_phone,
                client_email=a.client_email, service_id=a.service_id,
                service_name=a.service_name, date=a.date, time=a.time,
                status=a.status, notes=a.notes,
                created_at=str(a.created_at) if a.created_at else None,
            ) for a in upcoming
        ],
    )
