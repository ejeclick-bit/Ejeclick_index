import logging
from datetime import date, datetime
from zoneinfo import ZoneInfo
from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import Appointment, Schedule, DayOverride, TimeBlock, User
from ..schemas import AppointmentCreate, AppointmentUpdate, AppointmentResponse, CancelAppointmentRequest, AppointmentCancelResponse, AppointmentSearchRequest, AppointmentSearchItem
from ..auth import get_current_user
from ..email_service import send_appointment_confirmation, send_admin_notification
from ..deps import get_tenant_id

logger = logging.getLogger("admin")
router = APIRouter(prefix="/api/appointments", tags=["appointments"])

SLOT_DURATION = 30


def _to_response(a: Appointment) -> AppointmentResponse:
    return AppointmentResponse(
        id=a.id, client_name=a.client_name, client_phone=a.client_phone,
        client_email=a.client_email or "", service_id=a.service_id,
        service_name=a.service_name or "", date=a.date, time=a.time,
        status=a.status, notes=a.notes or "",
        created_at=str(a.created_at) if a.created_at else None,
    )


@router.get("/availability")
def get_availability(
    request_date: str = Query(alias="date"),
    db: Session = Depends(get_db),
    tenant_id: Optional[int] = Depends(get_tenant_id),
):
    try:
        parsed = date.fromisoformat(request_date)
    except ValueError:
        raise HTTPException(status_code=400, detail="Fecha invalida. Use YYYY-MM-DD")

    override = db.query(DayOverride).filter(
        DayOverride.date == request_date,
        DayOverride.barbershop_id == tenant_id,
    ).first()
    if override and not override.is_active:
        return {"date": request_date, "available": False, "slots": []}

    day_of_week = parsed.weekday()
    open_time = override.open_time if override and override.is_active else None
    close_time = override.close_time if override and override.is_active else None

    if not open_time or not close_time:
        schedule = db.query(Schedule).filter(
            Schedule.day_of_week == day_of_week,
            Schedule.is_active == True,
            Schedule.barbershop_id == tenant_id,
        ).first()
        if not schedule:
            return {"date": request_date, "available": False, "slots": []}
        open_time = schedule.open_time
        close_time = schedule.close_time

    blocks = db.query(TimeBlock).filter(
        TimeBlock.date == request_date,
        TimeBlock.barbershop_id == tenant_id,
    ).all()

    booked = {
        a.time for a in db.query(Appointment).filter(
            Appointment.date == request_date,
            Appointment.status.in_(["pending", "confirmed"]),
            Appointment.barbershop_id == tenant_id,
        ).all()
    }

    slots = []
    start_h, start_m = map(int, open_time.split(':'))
    end_h, end_m = map(int, close_time.split(':'))
    
    current_mins = start_h * 60 + start_m
    close_mins = end_h * 60 + end_m

    while current_mins + SLOT_DURATION <= close_mins:
        hour = current_mins // 60
        minute = current_mins % 60
        time_str = f"{hour:02d}:{minute:02d}"
        
        slot_start = current_mins
        slot_end = current_mins + SLOT_DURATION
        
        blocked = False
        for b in blocks:
            bh, bm = map(int, b.start_time.split(':'))
            b_start = bh * 60 + bm
            eh, em = map(int, b.end_time.split(':'))
            b_end = eh * 60 + em
            
            if slot_start < b_end and slot_end > b_start:
                blocked = True
                break

        if time_str not in booked and not blocked:
            slots.append(time_str)
            
        # Increase by 30 mins (we only support 30 mins increments, or we could just use 30)
        # But we must snap to 00 or 30 to prevent weird slots if open_time is 09:15
        current_mins += 30

    colombia_tz = ZoneInfo("America/Bogota")
    today_str = str(datetime.now(colombia_tz).date())
    if request_date == today_str:
        now = datetime.now(colombia_tz)
        cutoff = f"{now.hour:02d}:{now.minute:02d}"
        slots = [s for s in slots if s > cutoff]

    logger.info("availability date=%s open=%s close=%s available=%d",
                request_date, open_time, close_time, len(slots))
    return {"date": request_date, "available": len(slots) > 0, "slots": slots}


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
        today_str = str(datetime.now(ZoneInfo("America/Bogota")).date())
        query = query.filter(Appointment.date >= today_str)
    return [_to_response(a) for a in query.order_by(Appointment.date, Appointment.time).all()]


@router.post("", response_model=AppointmentResponse, status_code=201)
def create_appointment(
    data: AppointmentCreate,
    db: Session = Depends(get_db),
    tenant_id: Optional[int] = Depends(get_tenant_id),
):
    existing = db.query(Appointment).filter(
        Appointment.date == data.date,
        Appointment.time == data.time,
        Appointment.status.in_(["pending", "confirmed"]),
        Appointment.barbershop_id == tenant_id,
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="Este horario ya está reservado")

    appointment = Appointment(**data.model_dump(), barbershop_id=tenant_id)
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    logger.info("appointment_created id=%s date=%s time=%s", appointment.id, data.date, data.time)

    send_appointment_confirmation(
        client_name=appointment.client_name,
        client_email=appointment.client_email,
        date=appointment.date,
        time=appointment.time,
        service_name=appointment.service_name,
    )
    send_admin_notification(
        client_name=appointment.client_name,
        client_phone=appointment.client_phone,
        client_email=appointment.client_email,
        service_name=appointment.service_name,
        date=appointment.date,
        time=appointment.time,
        notes=appointment.notes,
    )

    return _to_response(appointment)


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
    return _to_response(appointment)


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


@router.post("/search", response_model=List[AppointmentSearchItem])
def search_appointments(
    data: AppointmentSearchRequest,
    db: Session = Depends(get_db),
):
    appointments = db.query(Appointment).filter(
        Appointment.client_email.ilike(data.client_email.strip()),
        Appointment.client_phone == data.client_phone.strip(),
        Appointment.status.in_(["pending", "confirmed"]),
        Appointment.date >= str(datetime.now(ZoneInfo("America/Bogota")).date()),
    ).order_by(Appointment.date, Appointment.time).all()

    return [
        AppointmentSearchItem(
            id=a.id, date=a.date, time=a.time,
            service_name=a.service_name, status=a.status,
        )
        for a in appointments
    ]


@router.post("/{appointment_id}/cancel", response_model=AppointmentCancelResponse)
def cancel_appointment(
    appointment_id: int,
    data: CancelAppointmentRequest,
    db: Session = Depends(get_db),
):
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Cita no encontrada")

    if appointment.client_email.strip().lower() != data.client_email.strip().lower():
        raise HTTPException(status_code=403, detail="Email no coincide con la cita")
    if appointment.client_phone.strip() != data.client_phone.strip():
        raise HTTPException(status_code=403, detail="Teléfono no coincide con la cita")

    if appointment.status in ("cancelled", "completed"):
        raise HTTPException(status_code=400, detail=f"La cita ya está {appointment.status}")

    try:
        appt_datetime = datetime.fromisoformat(f"{appointment.date}T{appointment.time}")
        now = datetime.now(ZoneInfo("America/Bogota")).replace(tzinfo=None)
        diff_hours = (appt_datetime - now).total_seconds() / 3600
        if diff_hours < 1:
            raise HTTPException(
                status_code=400,
                detail="Ya no es posible cancelar. Se requiere mínimo 1 hora de anticipación.",
            )
    except (ValueError, TypeError):
        pass

    appointment.status = "cancelled"
    db.commit()
    db.refresh(appointment)
    logger.info("appointment_cancelled id=%d by_client", appointment.id)
    return AppointmentCancelResponse(
        id=appointment.id, status="cancelled",
        date=appointment.date, time=appointment.time,
    )
