from datetime import datetime
from zoneinfo import ZoneInfo
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from ..database import get_db
from ..models import Appointment, Service, User
from ..schemas import DashboardResponse, AppointmentResponse
from ..auth import get_current_user
from ..deps import get_tenant_id

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("", response_model=DashboardResponse)
def get_dashboard(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
    tenant_id: Optional[int] = Depends(get_tenant_id),
):
    today = str(datetime.now(ZoneInfo("America/Bogota")).date())

    def filtered(q):
        return q.filter(Appointment.barbershop_id == tenant_id) if tenant_id else q

    today_count = filtered(db.query(func.count(Appointment.id)).filter(
        Appointment.date == today
    )).scalar() or 0

    pending_count = filtered(db.query(func.count(Appointment.id)).filter(
        Appointment.status == "pending"
    )).scalar() or 0

    query = db.query(func.count(Service.id)).filter(Service.is_active == True)
    if tenant_id:
        query = query.filter(Service.barbershop_id == tenant_id)
    service_count = query.scalar() or 0

    client_q = db.query(func.count(func.distinct(Appointment.client_phone)))
    if tenant_id:
        client_q = client_q.filter(Appointment.barbershop_id == tenant_id)
    client_count = client_q.scalar() or 0

    up_q = db.query(Appointment).filter(Appointment.date >= today)
    if tenant_id:
        up_q = up_q.filter(Appointment.barbershop_id == tenant_id)
    upcoming = up_q.order_by(Appointment.date, Appointment.time).limit(10).all()

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
